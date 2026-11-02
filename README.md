# SafeSight AI - Industrial Helmet Detection System

An enterprise-grade computer vision system for real-time safety helmet compliance monitoring, featuring an AI training pipeline, FastAPI inference backend, and a modern industrial web dashboard.

---

## 📁 Project Structure

```text
helmet-detection-industry-track/
├── run.bat                          # One-click launcher: starts server & opens web UI
├── notebooks/                       # Training Lab
│   ├── helmet_detection.ipynb       # Step-by-step model training notebook
│   └── utils/                       # Dataset downloader and label converter
├── data/                            # Raw and processed datasets (git-ignored)
├── models/                          # Trained weights & class configurations
├── backend/                         # FastAPI Inference Engine
│   ├── main.py                      # Server entry point
│   ├── config.py                    # App configuration
│   ├── core/                        # Detection engine logic
│   ├── schemas/                     # API blueprints
│   └── api/                         # REST API routes (/api/v1/detect)
└── frontend/                        # Next.js & Web Dashboard
    ├── public/index.html            # Real-time industrial dashboard UI
    └── src/                         # Next.js TypeScript components
```

---

## 🚀 Quick Start (Single Click)

Simply **double-click** `run.bat` in this folder!

It will:
1. Check your Python installation.
2. Install dependencies (`backend/requirements.txt`).
3. Start the server on `http://localhost:8000`.
4. Open the interactive dashboard in your browser.

---

## 🔬 Training with Jupyter Notebook

To train the model on Kaggle data:
1. Open terminal:
   ```powershell
   jupyter notebook notebooks/helmet_detection.ipynb
   ```
2. Follow the 6 simple steps inside the notebook to download the Kaggle dataset, train the detector, and export the model to `models/best_helmet_model.onnx`.
