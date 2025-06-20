# utils/anomaly_scoring.py

# =============================================
# 🔧 Setup: Fix import path for local modules
# =============================================
import os
import sys
import yaml

# Dynamically locate and append project root to Python path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

# =============================================
# 📦 Imports
# =============================================
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image

from models.autoencoder import ConvAutoencoder

# =============================================
# 🔩 Load Configuration
# =============================================
CONFIG_PATH = os.path.join(PROJECT_ROOT, "config", "settings.yaml")
with open(CONFIG_PATH, "r") as f:
    config = yaml.safe_load(f)

MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "checkpoints", "autoencoder.pth")
THRESHOLD = config.get("anomaly_threshold", 0.008)
IMAGE_SIZE = (128, 128)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# =============================================
# 🧪 Image Transformations
# =============================================
transform = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.ToTensor()
])

# =============================================
# 🔄 Load Trained Autoencoder
# =============================================
def load_model():
    model = ConvAutoencoder().to(DEVICE)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()
    return model

# =============================================
# 🧠 Compute Image Reconstruction Error
# =============================================
def compute_reconstruction_error(model, image_tensor):
    with torch.no_grad():
        image_tensor = image_tensor.to(DEVICE).unsqueeze(0)
        reconstructed = model(image_tensor)
        loss = F.mse_loss(reconstructed, image_tensor)
    return loss.item()

# =============================================
# 🧮 Score a Single Image
# =============================================
def score_image(image_path, threshold=THRESHOLD):
    image = Image.open(image_path).convert("RGB")
    image_tensor = transform(image)
    model = load_model()
    score = compute_reconstruction_error(model, image_tensor)
    label = "✅ REAL" if score < threshold else "⚠️ SUSPECT/FAKE"

    return {
        "file": image_path,
        "score": round(score, 5),
        "result": label
    }

# =============================================
# 📂 Score All Images in a Directory
# =============================================
def score_directory(folder, threshold=THRESHOLD):
    if not os.path.exists(folder):
        print(f"❌ ERROR: Directory not found:\n{folder}")
        return []

    results = []
    print(f"🔎 Scoring images in: {folder}\n")
    for file in os.listdir(folder):
        path = os.path.join(folder, file)
        if file.lower().endswith(('.jpg', '.jpeg', '.png')):
            result = score_image(path, threshold)
            print(f"{result['result']} | Score: {result['score']} | {result['file']}")
            results.append(result)
    return results

# =============================================
# 🚀 Main Execution
# =============================================
if __name__ == "__main__":
    TEST_DIR = os.path.join(PROJECT_ROOT, "data", "preprocessed", "fertilizer", "Mavuno")
    score_directory(TEST_DIR)
