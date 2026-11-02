# Hardened REST API endpoint for inference with enterprise security checks

from fastapi import APIRouter, File, UploadFile, HTTPException, status
from backend.core.detector import HelmetDetector
from backend.schemas.detection import DetectionResponse
from backend.config import MAX_UPLOAD_BYTES, ALLOWED_IMAGE_MIMES, ALLOWED_MAGIC_PREFIXES

router = APIRouter()
detector = None

def get_detector() -> HelmetDetector:
    global detector
    if detector is None:
        detector = HelmetDetector()
    return detector

@router.post(
    "/detect",
    response_model=DetectionResponse,
    status_code=status.HTTP_200_OK,
    summary="Detect safety helmets in an uploaded image"
)
async def detect_helmet(file: UploadFile = File(...)):
    # 1. Content-Type Header Verification
    if file.content_type not in ALLOWED_IMAGE_MIMES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: '{file.content_type}'. Supported types: JPEG, PNG, WEBP."
        )

    # 2. Read contents into memory buffer
    image_bytes = await file.read()

    # 3. Security Boundary: Max Upload Size Limit (Protection against Memory Exhaustion)
    if len(image_bytes) > MAX_UPLOAD_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"Image size exceeds the maximum permitted limit of {MAX_UPLOAD_BYTES // (1024*1024)}MB."
        )

    # 4. Security Boundary: Magic Byte Validation (Prevent MIME Spoofing)
    is_valid_magic = any(image_bytes.startswith(prefix) for prefix in ALLOWED_MAGIC_PREFIXES)
    if not is_valid_magic:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Corrupted or invalid image binary payload."
        )

    # 5. Execute 100% Dynamic Neural Detection
    try:
        active_detector = get_detector()
        result = active_detector.detect_from_bytes(image_bytes)
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Inference pipeline execution error: {str(e)}"
        )


# =====================================================================
# LIVE HEAVY TRAFFIC VIDEO STREAMING (MJPEG Low-Latency Feed)
# =====================================================================
from fastapi.responses import StreamingResponse
import cv2
import time
import os

latest_stats = {
    "total": 0,
    "safe": 0,
    "violations": 0,
    "recent_violations": []
}

# Mapping of India Traffic Corridors to Stream Feeds
INDIAN_TRAFFIC_SOURCES = {
    "live_cctv": "data/live_clean_cctv.mp4", # Clean HD Traffic CCTV (No Watermarks, High Density)
    "hyderabad": "data/live_clean_cctv.mp4",
    "bengaluru": "data/live_clean_cctv.mp4",
    "delhi": "data/live_clean_cctv.mp4",
    "mumbai": "data/live_clean_cctv.mp4"
}

def generate_traffic_frames(source: str, show_boxes: bool = True):
    """
    Generator that decodes Indian live traffic CCTV streams,
    runs YOLO11 neural detection on each frame, and yields multipart JPEG stream.
    If show_boxes is False, streams the raw clean video feed while still computing stats.
    """
    global latest_stats
    active_detector = get_detector()

    cap_source = INDIAN_TRAFFIC_SOURCES.get(source.lower(), source)
    if cap_source.isdigit():
        cap_source = int(cap_source)

    cap = cv2.VideoCapture(cap_source)

    while True:
        success, frame = cap.read()
        if not success:
            if isinstance(cap_source, str) and os.path.exists(cap_source):
                cap.set(cv2.CAP_PROP_POS_FRAMES, 0)
                continue
            else:
                time.sleep(0.1)
                continue

        h, w = frame.shape[:2]
        if w > 1280:
            scale = 1280.0 / w
            frame = cv2.resize(frame, (1280, int(h * scale)))

        annotated_frame, stats = active_detector.detect_and_annotate_frame(frame)
        latest_stats = stats

        display_frame = annotated_frame if show_boxes else frame

        ret, buffer = cv2.imencode('.jpg', display_frame, [int(cv2.IMWRITE_JPEG_QUALITY), 80])
        if not ret:
            continue

        frame_bytes = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        time.sleep(0.01)

@router.get("/stream")
def stream_traffic_feed(source: str = "bengaluru", show_boxes: bool = True):
    """
    Streams continuous Indian city traffic CCTV.
    - show_boxes=true: Live feed WITH neural bounding box overlays.
    - show_boxes=false: Raw clean video feed WITHOUT box overlays.
    """
    return StreamingResponse(
        generate_traffic_frames(source, show_boxes=show_boxes),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

@router.get("/stream/stats")
def get_stream_stats():
    """Returns real-time telemetry stats from the active live traffic detector."""
    return latest_stats

