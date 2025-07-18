# backend/app/services/prediction.py
# Service for processing image scans using an autoencoder model.

import os
import sys
import torch
import torch.nn.functional as F
import yaml
from PIL import Image
from io import BytesIO
from torchvision import transforms
from typing import Optional
from datetime import datetime

# Fix dynamic import paths
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../.."))
sys.path.append(PROJECT_ROOT)

from models.autoencoder import ConvAutoencoder
from models.rl_agent import Agent

# Config and Constants
CONFIG_PATH = os.path.join(PROJECT_ROOT, "config", "settings.yaml")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "checkpoints", "autoencoder.pth")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMAGE_SIZE = (128, 128)

with open(CONFIG_PATH, "r") as f:
    settings = yaml.safe_load(f)

DEFAULT_THRESHOLD = settings.get("anomaly_threshold", 0.015)

# Transforms
transform = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.ToTensor()
])

# Model Loading
def load_autoencoder():
    """Load the autoencoder model for image reconstruction."""
    model = ConvAutoencoder().to(DEVICE)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()
    return model

def load_rl_agent():
    """Load the reinforcement learning agent for classification."""
    model = Agent().to(DEVICE)
    # Optional: model.load_state_dict(...) if weights are saved
    model.eval()
    return model

autoencoder = load_autoencoder()
rl_agent = load_rl_agent()

# Core prediction logic
def predict_tensor(tensor, threshold: float = DEFAULT_THRESHOLD):
    """Predict authenticity of a tensor image."""
    with torch.no_grad():
        reconstruction = autoencoder(tensor)
        recon_error = F.mse_loss(reconstruction, tensor).item()

    is_anomaly = recon_error > threshold

    with torch.no_grad():
        logits = rl_agent(tensor)
        probs = torch.softmax(logits, dim=1)
        predicted_class = torch.argmax(probs, dim=1).item()
        confidence = round(probs[0][predicted_class].item(), 4)

    decision = "Flag" if is_anomaly else "Accept"  # Match ENUM('Accept', 'Flag')

    return {
        "decision": decision,
        "confidence": confidence,
        "reconstruction_error": round(recon_error, 5),
        "is_anomaly": is_anomaly,
        "timestamp": datetime.utcnow().isoformat()
    }

def predict_image(image_path: str, custom_threshold: Optional[float] = None):
    """Predict authenticity from an image file path."""
    threshold = custom_threshold or DEFAULT_THRESHOLD
    image = Image.open(image_path).convert("RGB")
    tensor = transform(image).unsqueeze(0).to(DEVICE)
    return predict_tensor(tensor, threshold)

def predict_image_from_bytes(file_bytes: bytes, custom_threshold: Optional[float] = None):
    """Predict authenticity from image bytes."""
    threshold = custom_threshold or DEFAULT_THRESHOLD
    image = Image.open(BytesIO(file_bytes)).convert("RGB")
    tensor = transform(image).unsqueeze(0).to(DEVICE)
    return predict_tensor(tensor, threshold)

def process_image_scan(file_bytes: bytes, image_path: str, user_id: Optional[int] = None, db=None):
    """Process an image scan and log results to the database."""
    from app.db.crud import log_scan_result

    result = predict_image_from_bytes(file_bytes)

    if db and user_id:
        log_scan_result(
            db=db,
            image_path=image_path,
            decision=result["decision"],
            confidence=result["confidence"],
            reconstruction_error=result["reconstruction_error"],
            is_anomaly=result["is_anomaly"],
            user_id=user_id
        )

    return {
        "image": image_path,
        "decision": result["decision"],
        "confidence": result["confidence"],
        "reconstruction_error": result["reconstruction_error"],
        "is_anomaly": result["is_anomaly"],
        "timestamp": result["timestamp"]
    }