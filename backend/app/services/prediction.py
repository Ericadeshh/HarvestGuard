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
import yaml

# Device configuration
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load Configuration
CONFIG_PATH = os.path.join(PROJECT_ROOT, "config", "settings.yaml")
with open(CONFIG_PATH, "r") as f:
    CONFIG = yaml.safe_load(f)
ANOMALY_THRESHOLD = CONFIG.get("anomaly_threshold", 0.0148)

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
        Dict containing image name, reconstruction error, action, decision, and confidence.
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
        action_probs = torch.softmax(action_logits, dim=-1)
        confidence = action_probs.max(dim=-1).values.item()
        action = torch.argmax(action_probs, dim=-1).item()
        decision = "Accept" if action == 0 else "Flag"

    return {
        "image": os.path.basename(image_path),
        "reconstruction_error": float(recon_error),
        "is_anomaly": recon_error > ANOMALY_THRESHOLD,
        "action": action,
        "decision": decision,
        "confidence": confidence
    }

# Local test with improved output
if __name__ == "__main__":
    test_image_path = os.path.join(
        PROJECT_ROOT, "data", "preprocessed", "fertilizer", "YaraMila", "000001.jpg"
    )
    try:
        result = predict_image(test_image_path)
        print("\n🌾 HarvestGuard Image Analysis 🌾")
        print("-" * 40)
        print(f"📸 Image: {result['image']}")
        print(f"🔍 Reconstruction Error: {result['reconstruction_error']:.5f}")
        print(f"🚨 Anomaly: {'Yes' if result['is_anomaly'] else 'No'} (Threshold: {ANOMALY_THRESHOLD})")
        print(f"🤖 RL Agent Decision: {result['decision']}")
        print(f"📊 Confidence: {result['confidence']:.2%}")
        print("-" * 40)
    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        
        
'''
The backend/app/services/prediction.py script is designed to perform inference on a single image using two pre-trained models: a convolutional autoencoder and a reinforcement learning (RL) agent. Here's what it does:
Loads Models:
Loads a pre-trained ConvAutoencoder from autoencoder.pth to compute reconstruction errors for anomaly detection.
Loads a pre-trained Agent (RL model) from rl_agent_smart.pth to make a classification decision (Accept or Flag).
Preprocesses Image:
Takes an image file path as input.
Uses preprocess_image from utils/image_processing.py to resize the image to 128x128 and convert it to a tensor of shape [1, 3, 128, 128] (batched RGB).
Inference:
Passes the image through the autoencoder to compute the reconstruction error (via compute_reconstruction_error from utils/anomaly_scoring.py), indicating how anomalous the image is.
Passes the same image through the RL agent to predict an action (0 for "Accept", 1 for "Flag") based on learned patterns.
Returns Results:
Outputs a dictionary with the image name, reconstruction error, action (0 or 1), and decision ("Accept" or "Flag").
Local Testing:
Includes a test block that processes a sample image (data/preprocessed/fertilizer/YaraMila/000001.jpg) and prints the result.
The script is a core component of the HarvestGuard backend, enabling image-based anomaly detection and classification, likely for identifying counterfeit or genuine agricultural products (e.g., fertilizers).
Action 0: "Accept" - Indicates the image is classified as genuine or normal (e.g., a legitimate fertilizer product).
Action 1: "Flag" - Indicates the image is classified as anomalous or suspect (e.g., a potential counterfeit or defective product).
'''