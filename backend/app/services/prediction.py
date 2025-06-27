import os
import sys
import torch
import torch.nn.functional as F
import yaml
from PIL import Image
from torchvision import transforms

# ===============================
# Fix dynamic import paths
# ===============================
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../"))
sys.path.append(PROJECT_ROOT)

from models.autoencoder import ConvAutoencoder
from models.rl_agent import Agent

# ===============================
# Config and Constants
# ===============================
CONFIG_PATH = os.path.join(PROJECT_ROOT, "config", "settings.yaml")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "checkpoints", "autoencoder.pth")
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMAGE_SIZE = (128, 128)

with open(CONFIG_PATH, "r") as f:
    settings = yaml.safe_load(f)

DEFAULT_THRESHOLD = settings.get("anomaly_threshold", 0.015)

# ===============================
# Transforms
# ===============================
transform = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.ToTensor()
])

# ===============================
# Model Loading
# ===============================
def load_autoencoder():
    model = ConvAutoencoder().to(DEVICE)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()
    return model

def load_rl_agent():
    model = Agent().to(DEVICE)
    # Optional: Load weights if you have them
    # model.load_state_dict(torch.load(...))
    model.eval()
    return model

# ===============================
# Main Prediction Function
# ===============================
def predict_image(image_path: str, custom_threshold: float = None):
    threshold = custom_threshold if custom_threshold is not None else DEFAULT_THRESHOLD

    # Load models
    autoencoder = load_autoencoder()
    rl_agent = load_rl_agent()

    # Prepare image
    image = Image.open(image_path).convert("RGB")
    tensor = transform(image).unsqueeze(0).to(DEVICE)

    # Reconstruction
    with torch.no_grad():
        reconstruction = autoencoder(tensor)
        recon_error = F.mse_loss(reconstruction, tensor).item()

    is_anomaly = recon_error > threshold

    # Use RL agent (mocked confidence here)
    with torch.no_grad():
        logits = rl_agent(tensor)
        probs = torch.softmax(logits, dim=1)
        predicted_class = torch.argmax(probs, dim=1).item()
        confidence = round(probs[0][predicted_class].item(), 4)

    # Decision mapping
    decision = "FLAGGED" if is_anomaly else "ACCEPTED"

    return {
        "decision": decision,
        "confidence": confidence,
        "reconstruction_error": round(recon_error, 5),
        "is_anomaly": is_anomaly
    }
