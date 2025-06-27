# models/rl_agent.py

import torch
import torch.nn as nn
import torch.nn.functional as F

# Automatically choose GPU if available
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

class Agent(nn.Module):
    def __init__(self, input_shape=(3, 128, 128), num_actions=2):
        super(Agent, self).__init__()
        c, h, w = input_shape
        self.net = nn.Sequential(
            nn.Conv2d(c, 16, kernel_size=3, stride=2, padding=1),   # -> (B, 16, 64, 64)
            nn.ReLU(),
            nn.Conv2d(16, 32, kernel_size=3, stride=2, padding=1),  # -> (B, 32, 32, 32)
            nn.ReLU(),
            nn.Flatten(),
            nn.Linear(32 * 32 * 32, 256),
            nn.ReLU(),
            nn.Linear(256, num_actions)
        )

    def forward(self, x):
        return self.net(x)

# ================================
# 📌 Exportable agent and helpers
# ================================

# Instantiate and move to correct device
agent = Agent().to(DEVICE)

def select_action(observation_tensor: torch.Tensor) -> int:
    """
    Selects an action using the trained RL agent given an image tensor input.
    
    Args:
        observation_tensor (torch.Tensor): Image tensor of shape [1, 3, 128, 128]

    Returns:
        int: Chosen action index
    """
    agent.eval()
    with torch.no_grad():
        observation_tensor = observation_tensor.to(DEVICE)
        q_values = agent(observation_tensor)
        action = torch.argmax(q_values, dim=1).item()
    return action
