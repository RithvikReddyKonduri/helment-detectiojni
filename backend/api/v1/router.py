# Aggregates all v1 API endpoints

from fastapi import APIRouter
from backend.api.v1.endpoints.detect import router as detect_router

api_router = APIRouter()
api_router.include_router(detect_router, prefix="", tags=["Detection"])
