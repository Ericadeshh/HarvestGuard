import os
from PIL import Image
from pathlib import Path
import hashlib

# ==== 📁 Paths and Settings ====
INPUT_DIR = "data/raw"
OUTPUT_DIR = "data/preprocessed"
TARGET_SIZE = (128, 128)
MIN_WIDTH = 64
MIN_HEIGHT = 64

image_hashes = set()  # For duplicate detection
total_processed = 0
total_skipped = 0

# ==== 📏 Quality Checks ====
def is_low_quality(img):
    return img.width < MIN_WIDTH or img.height < MIN_HEIGHT

def get_image_hash(image):
    return hashlib.md5(image.tobytes()).hexdigest()

# ==== 🔁 Main Function ====
def preprocess_images():
    global total_processed, total_skipped

    print("🔧 Starting image preprocessing...\n")

    for category in os.listdir(INPUT_DIR):
        category_path = os.path.join(INPUT_DIR, category)
        if not os.path.isdir(category_path):
            continue

        print(f"📂 Category: {category}")

        for company in os.listdir(category_path):
            company_path = os.path.join(category_path, company)
            if not os.path.isdir(company_path):
                continue

            print(f"  🏷️ Brand: {company}")
            output_path = os.path.join(OUTPUT_DIR, category, company)
            os.makedirs(output_path, exist_ok=True)

            processed = 0
            skipped = 0

            for file in os.listdir(company_path):
                input_file = os.path.join(company_path, file)
                try:
                    with Image.open(input_file) as img:
                        img = img.convert("RGB")

                        if is_low_quality(img):
                            print(f"    ⛔ Skipped (too small): {file}")
                            skipped += 1
                            total_skipped += 1
                            continue

                        img_hash = get_image_hash(img)
                        if img_hash in image_hashes:
                            print(f"    ⚠️ Skipped duplicate: {file}")
                            skipped += 1
                            total_skipped += 1
                            continue
                        image_hashes.add(img_hash)

                        img = img.resize(TARGET_SIZE)
                        output_file = os.path.join(output_path, Path(file).stem + ".jpg")
                        img.save(output_file, "JPEG")
                        print(f"    ✅ Processed: {file}")
                        processed += 1
                        total_processed += 1

                except Exception as e:
                    print(f"    ❌ Skipped {file} (error: {e})")
                    skipped += 1
                    total_skipped += 1

            print(f"  🔹 {processed} images processed, {skipped} skipped.\n")

    print("✅ Preprocessing complete.")
    print(f"🧾 Total processed: {total_processed}")
    print(f"🧾 Total skipped: {total_skipped}\n")

# ==== 🚀 Entry Point ====
if __name__ == "__main__":
    preprocess_images()
