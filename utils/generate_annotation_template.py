import os
import csv

PREPROCESSED_DIR = "data/preprocessed"
ANNOTATION_DIR = "data/annotations"
ANNOTATION_FILE = os.path.join(ANNOTATION_DIR, "reference_labels.csv")

# Create the annotations directory if it doesn't exist
os.makedirs(ANNOTATION_DIR, exist_ok=True)

# CSV header
header = ["filename", "category", "brand", "label", "notes"]

rows = []

print("📝 Scanning preprocessed images to create annotation template...\n")

# Loop through each category and brand
for category in os.listdir(PREPROCESSED_DIR):
    cat_path = os.path.join(PREPROCESSED_DIR, category)
    if not os.path.isdir(cat_path):
        continue

    for brand in os.listdir(cat_path):
        brand_path = os.path.join(cat_path, brand)
        if not os.path.isdir(brand_path):
            continue

        for file in os.listdir(brand_path):
            if not file.lower().endswith((".jpg", ".jpeg", ".png")):
                continue
            rows.append([
                file,          # filename
                category,      # e.g., fertilizer
                brand,         # e.g., YaraMila
                "",            # label (to fill: real, fake, suspect)
                ""             # notes
            ])

# Write to CSV
with open(ANNOTATION_FILE, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(header)
    writer.writerows(rows)

print(f"✅ Annotation template created at: {ANNOTATION_FILE}")
print(f"✍️  You can now open and fill in labels (real, fake, suspect) and notes as needed.\n")
