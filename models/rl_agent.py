import torch
import torch.nn as nn

class Agent(nn.Module):
    def __init__(self, input_shape=(3, 128, 128), num_actions=2):
        super(Agent, self).__init__()
        c, h, w = input_shape
        self.net = nn.Sequential(
            nn.Conv2d(c, 16, kernel_size=3, stride=2, padding=1),  # (B, 16, 64, 64)
            nn.ReLU(),
            nn.Conv2d(16, 32, kernel_size=3, stride=2, padding=1),  # (B, 32, 32, 32)
            nn.ReLU(),
            nn.Flatten(),
            nn.Linear(32 * 32 * 32, 256),
            nn.ReLU(),
            nn.Linear(256, num_actions)
        )

    def forward(self, x):
        return self.net(x)
