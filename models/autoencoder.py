# models/autoencoder.py

import os
import torch
import torch.nn as nn
import torch.nn.functional as F

# Automatically choose GPU if available
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class ConvAutoencoder(nn.Module):
    """
    Convolutional Autoencoder for image anomaly detection.
    """
    def __init__(self):
        super(ConvAutoencoder, self).__init__()

        # === Encoder ===
        self.encoder = nn.Sequential(
            nn.Conv2d(3, 32, 3, stride=2, padding=1),   # [B, 32, H/2, W/2]
            nn.ReLU(True),
            nn.Conv2d(32, 64, 3, stride=2, padding=1),  # [B, 64, H/4, W/4]
            nn.ReLU(True),
            nn.Conv2d(64, 128, 3, stride=2, padding=1), # [B, 128, H/8, W/8]
            nn.ReLU(True)
        )

        # === Decoder ===
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(128, 64, 3, stride=2, padding=1, output_padding=1),
            nn.ReLU(True),
            nn.ConvTranspose2d(64, 32, 3, stride=2, padding=1, output_padding=1),
            nn.ReLU(True),
            nn.ConvTranspose2d(32, 3, 3, stride=2, padding=1, output_padding=1),
            nn.Sigmoid()  # Output in [0, 1]
        )

    def forward(self, x):
        x = self.encoder(x)
        x = self.decoder(x)
        return x

# ================================
# 📌 Exportable model and helpers
# ================================

# Instantiate and move to correct device
autoencoder = ConvAutoencoder().to(DEVICE)

def compute_reconstruction_error(input_tensor: torch.Tensor, reconstructed: torch.Tensor) -> float:
    """
    Computes mean squared error between original and reconstructed image.
    Args:
        input_tensor (Tensor): Original input tensor [B, C, H, W]
        reconstructed (Tensor): Reconstructed output [B, C, H, W]
    Returns:
        float: MSE loss
    """
    return F.mse_loss(reconstructed, input_tensor).item()
