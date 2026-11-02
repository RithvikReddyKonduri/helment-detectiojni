# Data blueprints for API requests and responses

from typing import List, Optional
from pydantic import BaseModel

# Represents one detected object with a bounding box
class DetectedBox(BaseModel):
    # Normalized box coordinates (range: 0.0 to 1.0)
    x1: float
    y1: float
    x2: float
    y2: float
    # Name of the object detected (e.g., 'helmet', 'no_helmet')
    label: str
    # How confident the model is (e.g., 0.94)
    confidence: float
    # Compliance tag: 'Safe' or 'Danger'
    status: str
    # Hex color for drawing the box in UI
    color: str

# Overall response returned to the frontend
class DetectionResponse(BaseModel):
    # Whether the detection was successful
    success: bool
    # Total people or heads found
    total_detected: int
    # How many people are wearing helmets
    compliant_count: int
    # How many people are NOT wearing helmets
    violation_count: int
    # Overall safety rating
    is_fully_compliant: bool
    # List of all detected boxes
    detections: List[DetectedBox]
    # Base64 data URI of the image with bounding boxes drawn directly on pixels
    annotated_image: Optional[str] = None
