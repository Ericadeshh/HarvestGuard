"""
generate_expired_or_suspect_labels.py

Generates annotations for expired, fake, or suspect samples
from data/expired_or_suspect/, labeled as 'fake' or 'suspect'.

Author: Eric Adesh
"""

import os
import csv
import random

EXPIRED_DIR = "data/expired_or_suspect"
ANNOTATION_DIR = "data/annotations"
ANNOTATION_FILE = os.path.join(ANNOTATION_DIR, "expired_or_suspect_labels.csv")

header = ["filename", "category", "brand", "label", "notes"]
rows = []

print("⚠️  Generating annotation file for EXPIRED or SUSPECT samples...\n")

for category in os.listdir(EXPIRED_DIR):
    cat_path = os.path.join(EXPIRED_DIR, category)
    if not os.path.isdir(cat_path):
        continue

    for brand in os.listdir(cat_path):
        brand_path = os.path.join(cat_path, brand)
        if not os.path.isdir(brand_path):
            continue

        for file in os.listdir(brand_path):
            if file.lower().endswith((".jpg", ".jpeg", ".png")):
                # Randomly label some as fake or suspect for testing
                label = random.choice(["fake", "suspect"])
                note = "visual anomaly detected" if label == "fake" else "requires manual inspection"
                rows.append([
                    file,
                    category,
                    brand,
                    label,
                    note
                ])

# Ensure annotation folder exists
os.makedirs(ANNOTATION_DIR, exist_ok=True)

# Write to CSV
with open(ANNOTATION_FILE, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

print(f"✅ Finished. Expired/suspect annotation file saved at: {ANNOTATION_FILE}")
print(f"🧾 Total entries: {len(rows)}\n")
