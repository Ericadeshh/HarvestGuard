import os
import yaml
import torch

# Constants
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load threshold from YAML
CONFIG_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), 'config', 'settings.yaml')

if os.path.exists(CONFIG_PATH):
    with open(CONFIG_PATH, 'r') as f:
        config = yaml.safe_load(f)
        ANOMALY_THRESHOLD = config.get("anomaly_threshold", 0.1)
else:
    ANOMALY_THRESHOLD = 0.1  # default fallback
