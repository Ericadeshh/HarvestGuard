# backend/app/main.py
# Entry point for the FastAPI application, initializing the app and mounting API routes.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints.auth import router as auth_router
from app.api.v1.endpoints.scan import router as scan_router
from app.api.v1.endpoints.feedback import router as feedback_router
from app.core.config import settings

# Initialize FastAPI app
app = FastAPI(
    title="HarvestGuard API",
    description="API for fertilizer authenticity detection using autoencoder-based anomaly detection.",
    version="1.0.0"
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(auth_router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(scan_router, prefix="/api/v1/scan", tags=["scan"])
app.include_router(feedback_router, prefix="/api/v1/feedback", tags=["feedback"])

@app.get("/")
async def root():
    """Root endpoint for health check."""
    return {"message": "HarvestGuard API is running"}