# utils/calculate_threshold.py

import os
import sys
import numpy as np
from tqdm import tqdm

# Add project root to path
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(PROJECT_ROOT)

from utils.anomaly_scoring import load_model, compute_reconstruction_error, transform
from models.autoencoder import ConvAutoencoder
from PIL import Image

# Folder containing known good/reference images
REF_DIR = os.path.join(PROJECT_ROOT, "data", "reference")

# Load model once
model = load_model()

# Store scores here
reconstruction_errors = []

print(f"📊 Scanning reference images from: {REF_DIR}\n")

# Go through all categories and brands
for category in os.listdir(REF_DIR):
    category_path = os.path.join(REF_DIR, category)
    for brand in os.listdir(category_path):
        brand_path = os.path.join(category_path, brand)
        for file in tqdm(os.listdir(brand_path), desc=f"🔍 {category}/{brand}"):
            if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                try:
                    img_path = os.path.join(brand_path, file)
                    image = Image.open(img_path).convert("RGB")
                    tensor = transform(image)
                    error = compute_reconstruction_error(model, tensor)
                    reconstruction_errors.append(error)
                except Exception as e:
                    print(f"⚠️ Skipped: {file} — {e}")

# Convert to NumPy array
errors = np.array(reconstruction_errors)
mean = np.mean(errors)
std = np.std(errors)
threshold = mean + 2 * std

# Output results
print("\n📈 Threshold Analysis Result")
print(f"Total Samples:   {len(errors)}")
print(f"Mean Error:      {mean:.6f}")
print(f"Std Deviation:   {std:.6f}")
print(f"📌 Suggested Threshold: {threshold:.6f}")
