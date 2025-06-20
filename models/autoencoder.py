# models/autoencoder.py

import torch
import torch.nn as nn

class ConvAutoencoder(nn.Module):
    """
    Convolutional Autoencoder for image anomaly detection.
    """

    def __init__(self):
        super(ConvAutoencoder, self).__init__()

        # === Encoder ===
        self.encoder = nn.Sequential(
            nn.Conv2d(3, 32, 3, stride=2, padding=1),  # [B, 32, H/2, W/2]
            nn.ReLU(True),
            nn.Conv2d(32, 64, 3, stride=2, padding=1), # [B, 64, H/4, W/4]
            nn.ReLU(True),
            nn.Conv2d(64, 128, 3, stride=2, padding=1),# [B, 128, H/8, W/8]
            nn.ReLU(True)
        )

        # === Decoder ===
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(128, 64, 3, stride=2, padding=1, output_padding=1),
            nn.ReLU(True),
            nn.ConvTranspose2d(64, 32, 3, stride=2, padding=1, output_padding=1),
            nn.ReLU(True),
            nn.ConvTranspose2d(32, 3, 3, stride=2, padding=1, output_padding=1),
            nn.Sigmoid()  # Output in [0, 1] range
        )

    def forward(self, x):
        x = self.encoder(x)
        x = self.decoder(x)
        return x
