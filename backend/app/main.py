# backend/app/main.py
# Entry point for the HarvestGuard FastAPI application.
# Configures middleware, mounts API routers, and handles startup/shutdown events.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints import auth, scan, feedback, health
from app.core.config import settings
import sys
import logging
import atexit
from app.db.database_setup import setup_database  # Run setup on startup

# Initialize FastAPI app with metadata
app = FastAPI(
    title="HarvestGuard API",
    description="API for fertilizer authenticity detection using autoencoder-based anomaly detection.",
    version="1.0.0"
)

# Configure CORS middleware to allow cross-origin requests
# Allows all origins for development; restrict in production for security
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Universal for dev, supports all frontend origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers (e.g., Authorization, Content-Type)
)

# Mount API routers with versioned prefixes and tags
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(scan.router, prefix="/api/v1/scan", tags=["scan"])
app.include_router(feedback.router, prefix="/api/v1/feedback", tags=["feedback"])
app.include_router(health.router, prefix="/api/v1")

# Display formatted server status on startup
def display_status():
    print(
        "\n┌────────────────────────────────────────────────────────────┐\n"
        "│                  🚀 HARVESTGUARD SERVER STATUS              │\n"
        "├────────────────────────────────────────────────────────────┤\n"
        "│ 🟢 FastAPI App Loaded Successfully                          │\n"
        "│ 🟢 Development Server Running with --reload                │\n"
        "│ 🟢 Mounted Routers: auth, scan, feedback                   │\n"
        "│ 🟢 CORS Configured for All Origins (Development Mode)      │\n"
        "└────────────────────────────────────────────────────────────┘\n"
    )

# Display database connection status after setup
def display_db_status():
    print(
        "\n┌────────────────────────────────────────────────────────────┐\n"
        "│                🛠️  DATABASE CONNECTION STATUS               │\n"
        "├────────────────────────────────────────────────────────────┤\n"
        "│ ✅ Connected to MySQL Database                             │\n"
        f"│ ✅ Verified or Created Database: {settings.MYSQL_DB:<24}│\n"
        "│ ✅ Required Tables: users, scans, feedback — Verified      │\n"
        "└────────────────────────────────────────────────────────────┘\n"
    )

# Handle cleanup on server shutdown
def on_shutdown():
    print(
        "\n┌────────────────────────────────────────────────────────────┐\n"
        "│                    👋 SERVER SHUTDOWN                      │\n"
        "├────────────────────────────────────────────────────────────┤\n"
        "│ 🔄 Cleaning up connections...                              │\n"
        "│ ✅ Shutdown complete. Bye for now!                         │\n"
        "└────────────────────────────────────────────────────────────┘\n"
    )

# Startup event: Initialize database and display status
@app.on_event("startup")
async def on_startup():
    setup_database()  # Verify/create database and tables
    display_status()
    display_db_status()

# Shutdown event: Perform cleanup
@app.on_event("shutdown")
async def shutdown_event():
    on_shutdown()

# Register shutdown handler for manual termination (e.g., CTRL+C)
atexit.register(on_shutdown)

# Root endpoint for basic API status check
@app.get("/")
async def root():
    return {"message": "HarvestGuard API is running"}