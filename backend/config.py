# Production settings and security parameters

import os

# Root directories
BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(BACKEND_DIR)

# Model directories and weight paths
MODELS_DIR = os.path.join(PROJECT_ROOT, "models")
CLASSES_FILE = os.path.join(MODELS_DIR, "classes.json")
CUSTOM_WEIGHTS = os.path.join(MODELS_DIR, "best_helmet_model.pt")
DEFAULT_WEIGHTS = "yolo11n.pt"

# Server configuration
HOST = "0.0.0.0"
PORT = 8000

# Inference confidence and NMS thresholds
CONFIDENCE_THRESHOLD = 0.35
IOU_THRESHOLD = 0.45

# Security limits
MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB maximum file size
ALLOWED_IMAGE_MIMES = {"image/jpeg", "image/png", "image/webp"}
ALLOWED_MAGIC_PREFIXES = [
    b'\xff\xd8\xff',        # JPEG
    b'\x89PNG\r\n\x1a\n',  # PNG
    b'RIFF',                # WEBP (starts with RIFF....WEBP)
]
