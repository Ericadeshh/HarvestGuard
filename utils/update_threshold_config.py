# utils/update_threshold_config.py

# =============================================
# 🔧 Setup: Import and Project Root Handling
# =============================================
import os
import sys
import yaml
import torch
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
from tqdm import tqdm

# Ensure models and config directories are accessible
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

from models.autoencoder import ConvAutoencoder

# =============================================
# 🔩 Configurations
# =============================================
REFERENCE_DIR = os.path.join(PROJECT_ROOT, "data", "reference")
CONFIG_FILE = os.path.join(PROJECT_ROOT, "config", "settings.yaml")
IMAGE_SIZE = (128, 128)
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MODEL_PATH = os.path.join(PROJECT_ROOT, "models", "checkpoints", "autoencoder.pth")

# =============================================
# 🧠 Load Trained Autoencoder
# =============================================
def load_model():
    model = ConvAutoencoder().to(DEVICE)
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()
    return model

# =============================================
# 🔁 Transformations (Must match training)
# =============================================
transform = transforms.Compose([
    transforms.Resize(IMAGE_SIZE),
    transforms.ToTensor()
])

# =============================================
# 📊 Calculate Reconstruction Errors
# (Recursively through all categories)
# =============================================
def calculate_errors(model):
    errors = []
    print(f"\n📊 Scanning reference images from: {REFERENCE_DIR}\n")
    for category in os.listdir(REFERENCE_DIR):
        category_path = os.path.join(REFERENCE_DIR, category)
        if not os.path.isdir(category_path):
            continue

        for subcat in os.listdir(category_path):
            subcat_path = os.path.join(category_path, subcat)
            if not os.path.isdir(subcat_path):
                continue

            image_files = [f for f in os.listdir(subcat_path) if f.lower().endswith(('.jpg', '.jpeg', '.png'))]
            if not image_files:
                continue

            print(f"🔍 {category}/{subcat}:", end=" ")
            for file in tqdm(image_files, desc="", leave=False):
                file_path = os.path.join(subcat_path, file)
                try:
                    image = Image.open(file_path).convert("RGB")
                    image_tensor = transform(image).unsqueeze(0).to(DEVICE)

                    with torch.no_grad():
                        reconstructed = model(image_tensor)
                        loss = F.mse_loss(reconstructed, image_tensor).item()
                        errors.append(loss)
                except Exception as e:
                    print(f"❌ Failed on {file_path}: {e}")
    return errors

# =============================================
# 📝 Write Threshold to settings.yaml
# =============================================
def update_config(threshold):
    if not os.path.exists(CONFIG_FILE):
        config = {}
    else:
        with open(CONFIG_FILE, 'r') as f:
            config = yaml.safe_load(f) or {}

    config["anomaly_threshold"] = round(threshold, 6)

    with open(CONFIG_FILE, 'w') as f:
        yaml.dump(config, f)

    print(f"\n✅ Threshold updated in {CONFIG_FILE}: {round(threshold, 6)}\n")

# =============================================
# 🚀 Run Threshold Calculation and Save
# =============================================
if __name__ == "__main__":
    model = load_model()
    errors = calculate_errors(model)

    if not errors:
        print("⚠️ No valid images found in reference directory.")
        sys.exit(1)

    mean = sum(errors) / len(errors)
    std = torch.std(torch.tensor(errors)).item()
    threshold = mean + std

    print("\n📈 Threshold Analysis Result")
    print(f"Total Samples:   {len(errors)}")
    print(f"Mean Error:      {round(mean, 6)}")
    print(f"Std Deviation:   {round(std, 6)}")
    print(f"📌 Suggested Threshold: {round(threshold, 6)}")

    update_config(threshold)
