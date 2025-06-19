"""
generate_reference_dataset.py

This script copies a fixed number of high-quality, representative images
from the preprocessed dataset into the 'reference' directory.

This reference set will be used for training the autoencoder model
to learn what "genuine" agricultural products look like.

Author: Eric Adesh
Project: HarvestGuard AI
"""

import os
import shutil
from PIL import Image
from pathlib import Path

# === 📁 Directory Configuration ===
PREPROCESSED_DIR = "data/preprocessed"     # Input directory (cleaned data)
REFERENCE_DIR = "data/reference"           # Output directory (trusted samples)

# === ⚙️ Sampling and Quality Settings ===
MAX_IMAGES_PER_BRAND = 30                  # Maximum images to copy per brand
MIN_WIDTH = 64                             # Minimum width to accept image
MIN_HEIGHT = 64                            # Minimum height to accept image

# === 📊 Counters for Reporting ===
copied_total = 0
skipped_total = 0

# === 🧠 Image Quality Check ===
def is_acceptable_image(img):
    """
    Returns True if image is large enough to be considered usable.
    """
    return img.width >= MIN_WIDTH and img.height >= MIN_HEIGHT

# === 🚀 Main Function to Copy Reference Images ===
def generate_reference_dataset():
    """
    Iterates over preprocessed images and copies a selected number of
    clean, acceptable images into the reference dataset directory,
    preserving category and brand substructure.
    """
    global copied_total, skipped_total
    print("📦 Starting generation of reference dataset...\n")

    # Loop through each category (fertilizer, pesticide, etc.)
    for category in os.listdir(PREPROCESSED_DIR):
        category_path = os.path.join(PREPROCESSED_DIR, category)
        if not os.path.isdir(category_path):
            continue

        print(f"📂 Category: {category}")

        # Loop through each brand inside the category
        for brand in os.listdir(category_path):
            brand_path = os.path.join(category_path, brand)
            if not os.path.isdir(brand_path):
                continue

            print(f"  🏷️ Brand: {brand}")

            # Destination folder in reference directory
            output_path = os.path.join(REFERENCE_DIR, category, brand)
            os.makedirs(output_path, exist_ok=True)

            images = os.listdir(brand_path)
            copied = 0
            skipped = 0

            # Loop through files until desired count is reached
            for file in images:
                if copied >= MAX_IMAGES_PER_BRAND:
                    break

                src_file = os.path.join(brand_path, file)
                dst_file = os.path.join(output_path, Path(file).stem + ".jpg")

                try:
                    # Open image and convert to RGB
                    with Image.open(src_file) as img:
                        img = img.convert("RGB")

                        # Skip images that are too small
                        if not is_acceptable_image(img):
                            print(f"    ⛔ Skipped (low quality): {file}")
                            skipped += 1
                            skipped_total += 1
                            continue

                        # Save image in JPEG format to reference directory
                        img.save(dst_file, "JPEG")
                        print(f"    ✅ Copied: {file}")
                        copied += 1
                        copied_total += 1

                except Exception as e:
                    # Skip if image is unreadable or corrupted
                    print(f"    ❌ Skipped (error): {file} — {e}")
                    skipped += 1
                    skipped_total += 1

            # Summary for current brand
            print(f"  🔹 Brand summary — Copied: {copied}, Skipped: {skipped}\n")

    # Final report
    print("✅ Reference dataset generation complete.")
    print(f"🧾 Total copied: {copied_total}")
    print(f"🧾 Total skipped: {skipped_total}\n")

# === Entry Point ===
if __name__ == "__main__":
    generate_reference_dataset()
