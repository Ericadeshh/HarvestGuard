# demo_cli_batch_scan.py

import os
import zipfile
import requests
import getpass
from pathlib import Path
from tqdm import tqdm
from colorama import Fore, Style, init

# === Init terminal color support ===
init(autoreset=True)

# === Constants ===
API_BASE_URL = "http://localhost:8000/api/v1"
LOGIN_URL = f"{API_BASE_URL}/auth/token"
BATCH_SCAN_URL = f"{API_BASE_URL}/scan/batch"

# === Auth ===
def login(username: str, password: str) -> str:
    print(f"\n🔐 Logging in as {username}...")
    response = requests.post(LOGIN_URL, data={
        "username": username,
        "password": password
    })

    if response.status_code != 200:
        print(Fore.RED + "❌ Login failed.")
        print(Fore.RED + response.text)
        exit(1)

    print(Fore.GREEN + "✅ Login successful.\n")
    return response.json()["access_token"]

# === File Discovery ===
def zip_to_filelist(zip_path):
    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        extract_path = Path("temp_extracted")
        extract_path.mkdir(exist_ok=True)
        zip_ref.extractall(extract_path)
        return sorted(extract_path.rglob("*.jpg") + extract_path.rglob("*.png"))

def load_images_from_path(path: str):
    path = Path(path)

    if not path.exists():
        print(Fore.RED + "❌ Path does not exist.")
        exit(1)

    if path.is_file():
        if path.suffix.lower() in ['.jpg', '.jpeg', '.png']:
            return [path]
        elif path.suffix == ".zip":
            return zip_to_filelist(path)
        else:
            print(Fore.RED + "❌ Unsupported file type.")
            exit(1)

    elif path.is_dir():
        return sorted(list(path.rglob("*.jpg")) + list(path.rglob("*.png")))

    else:
        print(Fore.RED + "❌ Invalid path.")
        exit(1)

# === Upload and Scan ===
def batch_scan(images, token: str):
    headers = {"Authorization": f"Bearer {token}"}
    files = [("files", (img.name, open(img, "rb"), "image/jpeg")) for img in images]

    print(Fore.BLUE + f"\n📡 Uploading {len(images)} image(s) for scanning...\n")

    response = requests.post(BATCH_SCAN_URL, headers=headers, files=files)

    if response.status_code != 200:
        print(Fore.RED + f"❌ Scan failed: {response.status_code} - {response.text}")
        return

    results = response.json().get("results", [])
    print(Fore.YELLOW + "\n📊 Scan Results:")
    print(Fore.YELLOW + "-" * 50)

    for result in results:
        image = result.get("image", "unknown")
        if "error" in result:
            print(Fore.RED + f"{image:<25} ❌ ERROR: {result['error']}")
        else:
            decision = result["decision"]
            color = Fore.RED if decision == "FLAGGED" else Fore.GREEN
            confidence = result.get("confidence", 0.0)
            recon_err = result.get("reconstruction_error", 0.0)
            print(f"{image:<25} {color}{decision:<10} {Style.RESET_ALL} | Conf: {confidence:.4f}, Err: {recon_err:.5f}")

# === CLI Entry Point ===
def main():
    print(Fore.CYAN + Style.BRIGHT + "\n" + "=" * 60)
    print("          🌾  HarvestGuard Batch Scan CLI Demo")
    print("=" * 60 + "\n")

    username = input("Username: ")
    password = getpass.getpass("Password: ")
    token = login(username, password)

    print(Fore.WHITE + """
📂 You can scan:
    - A single image (e.g. data/sample.jpg)
    - A folder of images (e.g. data/reference/fertilizer/YaraMila)
    - A zip file of images (e.g. data/batch.zip)
    """)

    input_path = input("📁 Enter the path to image, folder, or zip file: ").strip()
    images = load_images_from_path(input_path)

    if not images:
        print(Fore.RED + "❌ No valid images found.")
        return

    print(Fore.GREEN + f"\n📦 Found {len(images)} image(s). Starting scan...\n")
    batch_scan(images, token)

if __name__ == "__main__":
    main()