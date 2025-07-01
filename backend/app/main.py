# backend/app/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.scan import router as scan_router
from app.api.v1.endpoints.feedback import router as feedback_router
from app.api.v1.endpoints import health

from app.core.config import settings
import sys
import logging
import atexit
from app.db.database_setup import setup_database  # Run setup on startup

app = FastAPI(
    title="HarvestGuard API",
    description="API for fertilizer authenticity detection using autoencoder-based anomaly detection.",
    version="1.0.0"
)

# Allow all CORS origins during development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Universal for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(scan_router, prefix="/api/v1/scan", tags=["scan"])
app.include_router(feedback_router, prefix="/api/v1/feedback", tags=["feedback"])
app.include_router(health.router, prefix="/api/v1")

# Display formatted console status
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

def on_shutdown():
    print(
        "\n┌────────────────────────────────────────────────────────────┐\n"
        "│                    👋 SERVER SHUTDOWN                      │\n"
        "├────────────────────────────────────────────────────────────┤\n"
        "│ 🔄 Cleaning up connections...                              │\n"
        "│ ✅ Shutdown complete. Bye for now!                         │\n"
        "└────────────────────────────────────────────────────────────┘\n"
    )

@app.on_event("startup")
async def on_startup():
    setup_database()  # Calls database setup/verification
    display_status()
    display_db_status()

@app.on_event("shutdown")
async def shutdown_event():
    on_shutdown()

# Also register cleanup on exit (CTRL+C etc.)
atexit.register(on_shutdown)

@app.get("/")
async def root():
    return {"message": "HarvestGuard API is running"}