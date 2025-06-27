# backend/app/services/batch_processor.py

import os
import shutil
import zipfile
import tempfile
from datetime import datetime
from typing import Optional, List, Union
from PIL import Image
import torch
import torch.nn.functional as F
from torchvision import transforms

from app.db.session import get_db
from app.db.models import Scan
from sqlalchemy.orm import Session

# Paths to saved model weights
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
AE_PATH = os.path.join(BASE_DIR, "models/checkpoints/autoencoder.pth")
RL_PATH = os.path.join(BASE_DIR, "models/checkpoints/rl_agent_smart.pth")

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMAGE_SIZE = (128, 128)

# Pre-trained models loading
from app.models.autoencoder import ConvAutoencoder
from app.models.rl_agent import Agent

def load_models():
    ae = ConvAutoencoder().to(DEVICE)
    ae.load_state_dict(torch.load(AE_PATH, map_location=DEVICE))
    ae.eval()

    rl = Agent().to(DEVICE)
    rl.load_state_dict(torch.load(RL_PATH, map_location=DEVICE))
    rl.eval()

    return ae, rl

# Transform
transform = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.ToTensor()
])

def predict_image_tensor(ae, rl, img_tensor):
    with torch.no_grad():
        recon = ae(img_tensor)
        recon_err = F.mse_loss(recon, img_tensor).item()

        logits = rl(img_tensor)
        probs = torch.softmax(logits, dim=-1)
        action = torch.argmax(probs, dim=-1).item()
        confidence = probs[0, action].item()

    return recon_err, action, confidence

def process_images(
    source: Union[str, List[str]],
    user_id: Optional[int] = None,
    db: Session = None
):
    """
    Scan images/folders or ZIP uploads and log to DB if session provided.
    Returns list of results: dict(filename, recon_err, is_anomaly, action, confidence).
    """
    ae, rl = load_models()
    tmp = None

    # Handle zipped uploads
    if isinstance(source, str) and zipfile.is_zipfile(source):
        tmp = tempfile.TemporaryDirectory()
        with zipfile.ZipFile(source, 'r') as z:
            z.extractall(tmp.name)
        img_folder = tmp.name
    elif isinstance(source, str) and os.path.isdir(source):
        img_folder = source
    elif isinstance(source, list):
        img_folder = None
    else:
        raise ValueError("Source must be a folder path, ZIP file, or list of image paths.")

    files = []
    if img_folder:
        files = [os.path.join(img_folder, f) for f in os.listdir(img_folder)
                 if f.lower().endswith(('.jpg', '.png', '.jpeg'))]
    else:
        files = source

    results = []
    for path in sorted(files):
        try:
            img = Image.open(path).convert("RGB")
            t = transform(img).unsqueeze(0).to(DEVICE)
        except Exception as e:
            continue

        recon_err, action, confidence = predict_image_tensor(ae, rl, t)
        is_anomaly = bool(action == 1)

        result = {
            "filename": os.path.basename(path),
            "reconstruction_error": round(recon_err, 5),
            "is_anomaly": is_anomaly,
            "action": "Flag" if is_anomaly else "Accept",
            "confidence": round(confidence, 4),
            "scanned_at": datetime.utcnow()
        }
        results.append(result)

        if db:
            scan = Scan(
                filename=result["filename"],
                reconstruction_error=result["reconstruction_error"],
                is_anomaly=result["is_anomaly"],
                action=result["action"],
                confidence=result["confidence"],
                scanned_at=result["scanned_at"],
                user_id=user_id
            )
            db.add(scan)

    if db:
        try:
            db.commit()
        except Exception:
            db.rollback()
            raise

    if tmp:
        tmp.cleanup()

    return results
