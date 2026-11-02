export interface DetectedBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label: string;
  confidence: number;
  status: 'Safe' | 'Danger' | 'Neutral';
  color: string;
}

export interface DetectionResponse {
  success: boolean;
  total_detected: number;
  compliant_count: number;
  violation_count: number;
  is_fully_compliant: boolean;
  detections: DetectedBox[];
}
