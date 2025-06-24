# backend/app/services/prediction.py

import sys
import os
from typing import Dict

# Add project root to sys.path for imports
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
if PROJECT_ROOT not in sys.path:
    sys.path.append(PROJECT_ROOT)

# Standard Imports
from models.autoencoder import ConvAutoencoder
from models.rl_agent import Agent
from utils.anomaly_scoring import compute_reconstruction_error
from utils.image_processing import preprocess_image

import torch
from PIL import Image

# Device configuration
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load Models
AUTOENCODER_PATH = os.path.join(PROJECT_ROOT, "models", "checkpoints", "autoencoder.pth")
RL_AGENT_PATH = os.path.join(PROJECT_ROOT, "models", "checkpoints", "rl_agent_smart.pth")

# Initialize models
try:
    autoencoder = ConvAutoencoder().to(DEVICE)
    autoencoder.load_state_dict(torch.load(AUTOENCODER_PATH, map_location=DEVICE))
    autoencoder.eval()

    rl_agent = Agent().to(DEVICE)
    rl_agent.load_state_dict(torch.load(RL_AGENT_PATH, map_location=DEVICE))
    rl_agent.eval()
except FileNotFoundError as e:
    raise FileNotFoundError(f"Model checkpoint not found: {e}")

def predict_image(image_path: str) -> Dict[str, any]:
    """
    Run prediction on a single image using the autoencoder and RL agent.
    Returns reconstruction error and the RL agent's decision.

    Args:
        image_path (str): Path to the input image.

    Returns:
        Dict containing image name, reconstruction error, action, and decision.
    """
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found: {image_path}")

    # Preprocess image
    image_tensor = preprocess_image(image_path).to(DEVICE).unsqueeze(0)  # [1, C, H, W]

    with torch.no_grad():
        # Autoencoder reconstruction
        recon = autoencoder(image_tensor)
        recon_error = compute_reconstruction_error(autoencoder, image_tensor)

        # RL Agent decision
        action_logits = rl_agent(image_tensor)
        action = torch.argmax(action_logits, dim=-1).item()
        decision = "Accept" if action == 0 else "Flag"

    return {
        "image": os.path.basename(image_path),
        "reconstruction_error": float(recon_error),
        "action": action,
        "decision": decision
    }

# Local test
if __name__ == "__main__":
    test_image_path = os.path.join(
        PROJECT_ROOT, "data", "preprocessed", "fertilizer", "YaraMila", "000001.jpg"
    )
    try:
        result = predict_image(test_image_path)
        print(f"✅ Prediction Result:\n{result}")
    except Exception as e:
        print(f"❌ Error during prediction: {e}")