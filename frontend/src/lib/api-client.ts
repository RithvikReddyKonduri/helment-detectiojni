// Simple API helper to communicate with the FastAPI backend

import { DetectionResponse } from '../types/detection';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function detectHelmet(imageBlob: Blob): Promise<DetectionResponse> {
  const formData = new FormData();
  formData.append('file', imageBlob, 'frame.jpg');

  const response = await fetch(`${API_BASE_URL}/api/v1/detect`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Detection request failed with status: ${response.status}`);
  }

  return response.json();
}
