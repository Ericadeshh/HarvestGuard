"""
generate_reference_labels.py

Generates annotations for verified reference samples (known genuine)
from data/reference/, labeled as 'real'.

Author: Eric Adesh
"""

import os
import csv

REFERENCE_DIR = "data/reference"
ANNOTATION_DIR = "data/annotations"
ANNOTATION_FILE = os.path.join(ANNOTATION_DIR, "reference_labels.csv")

header = ["filename", "category", "brand", "label", "notes"]
rows = []

print("🧠 Generating annotation file for REFERENCE samples...\n")

for category in os.listdir(REFERENCE_DIR):
    cat_path = os.path.join(REFERENCE_DIR, category)
    if not os.path.isdir(cat_path):
        continue

    for brand in os.listdir(cat_path):
        brand_path = os.path.join(cat_path, brand)
        if not os.path.isdir(brand_path):
            continue

        for file in os.listdir(brand_path):
            if file.lower().endswith((".jpg", ".jpeg", ".png")):
                rows.append([
                    file,
                    category,
                    brand,
                    "real",
                    "verified as authentic"
                ])

# Ensure annotation folder exists
os.makedirs(ANNOTATION_DIR, exist_ok=True)

# Write to CSV
with open(ANNOTATION_FILE, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

print(f"✅ Finished. Reference annotation file saved at: {ANNOTATION_FILE}")
print(f"🧾 Total real samples annotated: {len(rows)}\n")
