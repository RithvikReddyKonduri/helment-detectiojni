# Main FastAPI entry point for Helmet Detection System

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.api.v1.router import api_router
from backend.config import PROJECT_ROOT

# Initialize FastAPI application
app = FastAPI(
    title="Industrial Helmet Detection API",
    description="Real-time computer vision service to monitor safety helmet compliance.",
    version="1.0.0"
)

# Enable CORS so the Next.js frontend can communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach API routes (e.g. /api/v1/detect)
app.include_router(api_router, prefix="/api/v1")

# Health check route
@app.get("/health")
def health_check():
    return {"status": "ok", "service": "helmet-detection-backend"}

# Serve the web dashboard directly
frontend_dir = os.path.join(PROJECT_ROOT, "frontend", "public")
if os.path.exists(frontend_dir):
    app.mount("/static", StaticFiles(directory=frontend_dir), name="static")

    @app.get("/")
    def serve_dashboard():
        index_file = os.path.join(frontend_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Frontend index.html is being prepared."}
