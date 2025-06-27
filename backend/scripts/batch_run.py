#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
HarvestGuard CLI Batch Scanner
- Scan a folder of images or a single image
- Display real-time terminal UI of detection results
- Optionally associate results with a user ID
- Log to database using SQLAlchemy ORM
- Uses pre-trained Autoencoder + RL Agent
"""

import os
import sys
import argparse
import time
from PIL import Image
import torch
import torch.nn.functional as F
from torchvision import transforms
from sqlalchemy.orm import Session
from tqdm import tqdm
from pathlib import Path

# Path setup
BASE_DIR = Path(__file__).resolve().parent.parent.parent
sys.path.append(str(BASE_DIR))

from app.db.session import SessionLocal
from app.db.models import Scan
from app.models.autoencoder import ConvAutoencoder
from app.models.rl_agent import Agent
from app.core.config import settings

# Constants
IMAGE_SIZE = (128, 128)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
TRANSFORM = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.ToTensor()
])

def load_model():
    auto_path = BASE_DIR / "models" / "checkpoints" / "autoencoder.pth"
    rl_path = BASE_DIR / "models" / "checkpoints" / "rl_agent_smart.pth"

    autoencoder = ConvAutoencoder().to(DEVICE)
    autoencoder.load_state_dict(torch.load(auto_path, map_location=DEVICE))
    autoencoder.eval()

    rl_agent = Agent().to(DEVICE)
    rl_agent.load_state_dict(torch.load(rl_path, map_location=DEVICE))
    rl_agent.eval()

    return autoencoder, rl_agent

def predict_image(img_path, autoencoder, rl_agent, threshold=0.0148):
    img = Image.open(img_path).convert("RGB")
    tensor = TRANSFORM(img).unsqueeze(0).to(DEVICE)

    with torch.no_grad():
        recon = autoencoder(tensor)
        error = F.mse_loss(recon, tensor).item()
        q_vals = rl_agent(tensor)
        action = torch.argmax(q_vals).item()

    label = "Real" if action == 0 else "Fake"
    flagged = error >= threshold

    return {
        "image_path": str(img_path),
        "reconstruction_error": round(error, 5),
        "predicted_label": label,
        "flagged": flagged
    }

def log_to_db(db: Session, result: dict, user_id=None):
    scan = Scan(
        image_path=result["image_path"],
        predicted_label=result["predicted_label"],
        reconstruction_error=result["reconstruction_error"],
        flagged=result["flagged"],
        user_id=user_id
    )
    db.add(scan)
    db.commit()

def main(folder_or_image, user_id=None):
    print("\n🧠 HarvestGuard AI Batch Scanner")
    print("===================================")
    print(f"📂 Scanning: {folder_or_image}")
    if user_id:
        print(f"👤 User ID: {user_id}")
    print("-----------------------------------")

    autoencoder, rl_agent = load_model()
    db = SessionLocal()

    # Get list of images
    if os.path.isdir(folder_or_image):
        images = sorted([os.path.join(folder_or_image, f)
                         for f in os.listdir(folder_or_image)
                         if f.lower().endswith(('.jpg', '.jpeg', '.png'))])
    else:
        images = [folder_or_image]

    if not images:
        print("❌ No valid images found.")
        return

    for img_path in tqdm(images, desc="🔍 Scanning", unit="img"):
        try:
            result = predict_image(img_path, autoencoder, rl_agent)
            log_to_db(db, result, user_id=user_id)
            print(f"📸 {os.path.basename(img_path)} | {result['predicted_label']} | Error: {result['reconstruction_error']} | {'🚨' if result['flagged'] else '✅'}")
        except Exception as e:
            print(f"⚠️ Error processing {img_path}: {e}")

    db.close()
    print("✅ Scan complete. Results logged to database.\n")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="HarvestGuard CLI - AI Batch Scanner")
    parser.add_argument("path", help="Path to image or folder")
    parser.add_argument("--user", type=int, help="User ID to associate scan logs", required=False)
    args = parser.parse_args()

    main(args.path, args.user)
