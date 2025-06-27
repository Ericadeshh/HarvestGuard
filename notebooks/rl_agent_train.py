# 🧠 Reinforcement Learning Agent Training Script
# This script implements a reinforcement learning agent for image anomaly detection
# using a pre-trained autoencoder. It includes environment setup, agent training,
# evaluation, and reporting with visualizations.

# -----------------------------------------------
# 📚 Section 1: Import Libraries
# -----------------------------------------------
import os
import random
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from torchvision import transforms
from PIL import Image
from collections import deque
import numpy as np
import pathlib
import matplotlib.pyplot as plt
import torchvision.transforms.functional as TF
from datetime import datetime
from matplotlib.backends.backend_pdf import PdfPages
from IPython.display import display, HTML
import pandas as pd
import sys

# -----------------------------------------------
# 🔧 Section 2: Set Random Seeds for Reproducibility
# -----------------------------------------------
random.seed(42)
torch.manual_seed(42)

# -----------------------------------------------
# 📂 Section 3: Define Project Paths and Constants
# -----------------------------------------------
PROJECT_ROOT = pathlib.Path(os.getcwd()).resolve()
DATA_DIR = PROJECT_ROOT / "data" / "preprocessed" / "fertilizer" / "YaraMila"
IMAGE_DIR = str(DATA_DIR)

DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
IMAGE_SIZE = (128, 128)
NUM_EPISODES = 5
MAX_STEPS = 20
LR = 1e-4
THRESHOLD = 0.0148  # Anomaly detection threshold
GAMMA = 0.95  # Discount factor for Q-learning

print(f"🛠 Using image folder: {IMAGE_DIR}")

# -----------------------------------------------
# 🔍 Section 4: Load Pre-trained Autoencoder
# -----------------------------------------------
print(f"Current working directory: {os.getcwd()}")
print(f"PROJECT_ROOT: {PROJECT_ROOT}")
print(f"sys.path before: {sys.path}")

# Explicitly add models directory to sys.path
models_path = str(PROJECT_ROOT / "models")
if models_path not in sys.path:
    sys.path.append(models_path)
    print(f"Added {models_path} to sys.path")
print(f"sys.path after: {sys.path}")

try:
    from autoencoder import ConvAutoencoder
    print("✅ Successfully imported ConvAutoencoder")
except ModuleNotFoundError as e:
    print(f"Error importing ConvAutoencoder: {e}")
    print("Please ensure the 'models' directory exists and contains 'autoencoder.py' with ConvAutoencoder class.")
    sys.exit(1)

# Initialize and load the autoencoder model
autoencoder = ConvAutoencoder().to(DEVICE)
autoencoder_path = PROJECT_ROOT / "models" / "checkpoints" / "autoencoder.pth"
autoencoder.load_state_dict(torch.load(autoencoder_path, map_location=DEVICE))
autoencoder.eval()

# Define anomaly scoring function using MSE
def anomaly_score(img_tensor):
    with torch.no_grad():
        recon = autoencoder(img_tensor)
        return torch.nn.functional.mse_loss(recon, img_tensor).item()

# -----------------------------------------------
# 🧪 Section 5: Define Feedback-Integrated RL Environment
# -----------------------------------------------
class FeedbackImageScanEnv:
    def __init__(self, image_dir, autoencoder, threshold=0.01, user_feedback=None):
        """Initialize environment with image directory and autoencoder."""
        self.image_dir = image_dir
        self.autoencoder = autoencoder
        self.threshold = threshold
        self.images = sorted([
            f for f in os.listdir(image_dir) if f.lower().endswith(('.jpg', '.png'))
        ])
        self.index = 0
        self.transform = transforms.Compose([
            transforms.Resize(IMAGE_SIZE),
            transforms.ToTensor()
        ])
        self.feedback = user_feedback or {}  # e.g., {"000001.jpg": "correct", "000002.jpg": "wrong"}

        if not os.path.exists(image_dir):
            raise FileNotFoundError(f"❌ Directory not found: {image_dir}")
        if not self.images:
            raise ValueError(f"❌ No valid image files in: {image_dir}")

    def reset(self):
        """Reset environment to initial state."""
        self.index = 0
        return self._get_obs()

    def _get_obs(self):
        """Retrieve current image tensor or None if done."""
        if self.index >= len(self.images):
            return None
        img_path = os.path.join(self.image_dir, self.images[self.index])
        img = Image.open(img_path).convert("RGB")
        return self.transform(img).unsqueeze(0).to(DEVICE)

    def step(self, action):
        """Execute action (0=real, 1=fake) and return next state, reward, done."""
        file_name = self.images[self.index]
        image_tensor = self._get_obs()
        recon = self.autoencoder(image_tensor)
        recon_error = F.mse_loss(recon, image_tensor).item()

        # Reward logic based on user feedback or anomaly score
        if file_name in self.feedback:
            feedback = self.feedback[file_name]
            if (action == 1 and feedback == "flag") or (action == 0 and feedback == "accept"):
                reward = 1  # Correct decision
            else:
                reward = -1  # Incorrect decision
        else:
            reward = 1 if ((recon_error < self.threshold and action == 0) or
                           (recon_error >= self.threshold and action == 1)) else -1

        self.index += 1
        done = self.index >= len(self.images)
        return self._get_obs(), reward, done

# -----------------------------------------------
# 🤖 Section 6: Define RL Agent
# -----------------------------------------------
class Agent(nn.Module):
    def __init__(self, input_shape=(3, 128, 128), num_actions=2):
        """Initialize the convolutional neural network for the RL agent."""
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
        """Forward pass through the network."""
        return self.net(x)

# Initialize environment and agent
env = FeedbackImageScanEnv(IMAGE_DIR, autoencoder, THRESHOLD)
model = Agent().to(DEVICE)
optimizer = optim.Adam(model.parameters(), lr=LR)
loss_fn = nn.MSELoss()

# -----------------------------------------------
# 🔁 Section 7: Train RL Agent
# -----------------------------------------------
memory = deque(maxlen=1000)

for episode in range(NUM_EPISODES):
    state = env.reset()
    total_reward = 0

    for step in range(MAX_STEPS):
        q_values = model(state)
        action = torch.argmax(q_values).item()

        next_state, reward, done = env.step(action)
        total_reward += reward

        # Estimate future reward (Q-learning)
        with torch.no_grad():
            next_q_values = model(next_state) if next_state is not None else torch.zeros_like(q_values)
            max_next_q = torch.max(next_q_values)
            target_q = q_values.clone()
            target_q[0][action] = reward + GAMMA * max_next_q

        # Compute loss and update model
        loss = loss_fn(q_values, target_q)
        optimizer.zero_grad()
        loss.backward()
        optimizer.step()

        if done or next_state is None:
            break

        state = next_state

    print(f"📈 Episode {episode+1}/{NUM_EPISODES} | Total Reward: {total_reward}")

# -----------------------------------------------
# 💾 Section 8: Save Trained Model
# -----------------------------------------------
CHECKPOINT_DIR = PROJECT_ROOT / "models" / "checkpoints"
CHECKPOINT_DIR.mkdir(parents=True, exist_ok=True)

checkpoint_path = CHECKPOINT_DIR / "rl_agent_smart.pth"
torch.save(model.state_dict(), checkpoint_path)
print(f"✅ Smarter RL agent saved to: {checkpoint_path}")

# -----------------------------------------------
# 🧠 Section 9: Evaluate RL Agent
# -----------------------------------------------
print("🔍 Agent Evaluation Run:")
state = env.reset()
done = False
total_reward = 0

while not done and state is not None:
    with torch.no_grad():
        q_values = model(state)
        action = torch.argmax(q_values).item()
    next_state, reward, done = env.step(action)
    total_reward += reward
    state = next_state

print(f"✅ Total Reward Collected by Smart Agent: {total_reward}")

# -----------------------------------------------
# 📊 Section 10: Visual Inference Demo
# -----------------------------------------------
print("🎞️ RL Agent Visual Inference Demo:")
env.reset()
done = False
state = env._get_obs()
total_reward = 0
step = 0
results = []
figures = []

pdf_report = PdfPages("rl_agent_report.pdf")

while not done and state is not None:
    with torch.no_grad():
        # Fix shape bug
        if state.dim() == 3:
            state_input = state.unsqueeze(0)  # (1, 3, 128, 128)
        else:
            state_input = state

        action_values = model(state_input)
        action = torch.argmax(action_values).item()

        # Inference from autoencoder
        recon = autoencoder(state_input)
        error = torch.mean((recon - state_input) ** 2).item()

        # Result label
        result = "✅ Accept" if action == 0 else "🚨 Flag"

        # Store step results
        results.append({
            "step": step,
            "image_path": env.images[env.index],
            "action": result,
            "error": round(error, 5)
        })

        # Create side-by-side visualization
        fig, axs = plt.subplots(1, 2, figsize=(8, 4))
        axs[0].imshow(TF.to_pil_image(state.squeeze().cpu()))
        axs[0].set_title("Original")
        axs[0].axis('off')

        axs[1].imshow(TF.to_pil_image(recon.squeeze().cpu()))
        axs[1].set_title(f"Reconstruction\nError: {round(error, 5)}")
        axs[1].axis('off')

        fig.suptitle(f"Step {step} | {result}", fontsize=12)
        figures.append(fig)
        pdf_report.savefig(fig)
        plt.close(fig)

        # Next step
        next_state, reward, done = env.step(action)
        total_reward += reward
        state = next_state
        step += 1

pdf_report.close()
print(f"📄 PDF report saved: rl_agent_report.pdf")
print(f"🏁 Demo finished — Total Reward Collected: {total_reward}")

# -----------------------------------------------
# 📊 Section 11: Post-Analysis Summary
# -----------------------------------------------
num_flagged = sum(1 for r in results if "Flag" in r["action"])
num_accepted = len(results) - num_flagged
avg_error = round(sum(r["error"] for r in results) / len(results), 5)

print("🔍 RL Agent Analysis Summary")
print(f"🖼 Total Images Processed: {len(results)}")
print(f"✅ Accepted: {num_accepted}")
print(f"🚨 Flagged: {num_flagged}")
print(f"📈 Average Reconstruction Error: {avg_error}")

# Export summary as text
with open("rl_agent_analysis_summary.txt", "w") as f:
    f.write("RL Agent Analysis Summary\n")
    f.write(f"Total Images Processed: {len(results)}\n")
    f.write(f"Accepted: {num_accepted}\n")
    f.write(f"Flagged: {num_flagged}\n")
    f.write(f"Average Reconstruction Error: {avg_error}\n")

print("📝 Summary exported: rl_agent_analysis_summary.txt")

# -----------------------------------------------
# 📁 Section 12: Save Results as HTML
# -----------------------------------------------
html_rows = "".join([
    f"<tr><td>{r['step']}</td><td>{r['image_path']}</td><td>{r['action']}</td><td>{r['error']}</td></tr>"
    for r in results
])
html_table = f"""
<h3>RL Agent Decision Log</h3>
<table border='1' style='border-collapse: collapse;'>
<tr><th>Step</th><th>Image</th><th>Action</th><th>Recon Error</th></tr>
{html_rows}
</table>
"""

# Save HTML with UTF-8 encoding
with open("rl_agent_results.html", "w", encoding="utf-8") as f:
    f.write(html_table)

print("✅ HTML log saved: rl_agent_results.html")

# -----------------------------------------------
# 📊 Section 13: Visualize and Save Performance Chart
# -----------------------------------------------
results_df = pd.DataFrame(results)

plt.figure(figsize=(10, 4))
plt.plot(results_df['step'], results_df['error'], marker='o', label='Reconstruction Error')
plt.axhline(y=THRESHOLD, color='r', linestyle='--', label='Threshold')
plt.title("🔍 RL Agent Performance")
plt.xlabel("Step")
plt.ylabel("Reconstruction Error")
plt.legend()
plt.grid(True)
plt.tight_layout()

os.makedirs("reports", exist_ok=True)
chart_path = "reports/rl_agent_performance.png"
plt.savefig(chart_path)
plt.close()
print(f"✅ Chart saved to: {chart_path}")

# -----------------------------------------------
# 💾 Section 14: Save Logs as CSV and HTML
# -----------------------------------------------
csv_path = "reports/rl_agent_decision_log.csv"
html_path = "reports/rl_agent_decision_log.html"

results_df.to_csv(csv_path, index=False)
results_df.to_html(html_path, index=False, escape=False)

print(f"✅ Logs saved to:\n- CSV: {csv_path}\n- HTML: {html_path}")

# -----------------------------------------------
# 📄 Section 15: Export Performance Report to PDF
# -----------------------------------------------
pdf_path = "reports/rl_agent_performance_report.pdf"
with PdfPages(pdf_path) as pdf:
    # Page 1: Performance Chart
    plt.figure(figsize=(10, 4))
    plt.plot(results_df['step'], results_df['error'], marker='o', label='Reconstruction Error')
    plt.axhline(y=THRESHOLD, color='r', linestyle='--', label='Threshold')
    plt.title("RL Agent Reconstruction Error")
    plt.xlabel("Step")
    plt.ylabel("Error")
    plt.legend()
    plt.grid(True)
    plt.tight_layout()
    pdf.savefig()
    plt.close()

    # Page 2: Table
    fig, ax = plt.subplots(figsize=(12, len(results_df) * 0.3))
    ax.axis('off')
    table = ax.table(
        cellText=results_df.values,
        colLabels=results_df.columns,
        cellLoc='center',
        loc='center'
    )
    table.scale(1, 1.5)
    pdf.savefig()
    plt.close()

print(f"✅ PDF report saved: {pdf_path}")

# -----------------------------------------------
# 🎉 Section 16: Final Message
# -----------------------------------------------
print("🎉 RL Agent evaluation complete and fully documented.")
print("📁 Reports generated in the /reports directory.")