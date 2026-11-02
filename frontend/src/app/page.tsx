"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Radio, 
  Activity, 
  AlertOctagon, 
  Clock, 
  Upload,
  Video,
  FileImage,
  Layers,
  Camera,
  Maximize2
} from "lucide-react";

export default function TrafficSafetyDualDashboard() {
  const [activeTab, setActiveTab] = useState<"cctv" | "upload">("cctv");
  const [showDetectionBoxes, setShowDetectionBoxes] = useState(true);
  
  // Real-time stream telemetry
  const [cctvStats, setCctvStats] = useState({
    total: 0,
    safe: 0,
    violations: 0
  });
  const [liveIncidents, setLiveIncidents] = useState<{ id: string; time: string; label: string; conf: string }[]>([]);

  // Image Upload state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [annotatedImage, setAnnotatedImage] = useState<string | null>(null);
  const [uploadDetections, setUploadDetections] = useState<any[]>([]);
  const [uploadStats, setUploadStats] = useState({ total: 0, safe: 0, violations: 0 });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Poll real-time CCTV stream stats continuously
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTab === "cctv") {
      const pollStats = async () => {
        try {
          const res = await fetch("http://127.0.0.1:8000/api/v1/stream/stats", {
            cache: "no-store",
            headers: { "Pragma": "no-cache", "Cache-Control": "no-cache" }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && typeof data.total === "number") {
              setCctvStats({
                total: data.total,
                safe: data.safe,
                violations: data.violations
              });
            }
          }
        } catch {
          // Keep running silently
        }
      };

      pollStats();
      interval = setInterval(pollStats, 500);
    }
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadedImage(URL.createObjectURL(file));
    setAnnotatedImage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/v1/detect", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadDetections(data.detections || []);
        if (data.annotated_image) {
          setAnnotatedImage(data.annotated_image);
        }
        setUploadStats({
          total: data.total_detected || 0,
          safe: data.compliant_count || 0,
          violations: data.violation_count || 0
        });
      }
    } catch {
      alert("Backend unreachable on port 8000.");
    } finally {
      setIsUploading(false);
    }
  };

  const currentStats = activeTab === "cctv" ? cctvStats : uploadStats;
  const compliance = currentStats.total > 0 ? Math.round((currentStats.safe / currentStats.total) * 100) : 100;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#07090e", color: "#f1f5f9", fontFamily: "Plus Jakarta Sans, sans-serif" }}>
      {/* Top Police Control Header */}
      <header style={{
        borderBottom: "1px solid #1e293b",
        backgroundColor: "#0c1017",
        padding: "14px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            padding: "8px",
            borderRadius: "10px",
            display: "flex",
            alignItems: "center"
          }}>
            <Radio style={{ width: "20px", height: "20px", color: "#10b981" }} />
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "16px", fontWeight: "700", letterSpacing: "0.5px", margin: 0, color: "#ffffff" }}>
                INDIAN TRAFFIC POLICE — AI HELMET SURVEILLANCE
              </h1>
              <span style={{
                fontSize: "10px",
                fontFamily: "monospace",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                color: "#34d399",
                padding: "2px 8px",
                borderRadius: "4px",
                border: "1px solid rgba(16, 185, 129, 0.3)"
              }}>
                SEC 129 MV ACT
              </span>
            </div>
            <p style={{ fontSize: "12px", color: "#94a3b8", fontFamily: "monospace", margin: "2px 0 0 0" }}>
              High-Density Urban Junction & Highway AI Monitoring Core
            </p>
          </div>
        </div>

        {/* Dual Mode Switcher Tabs */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            padding: "4px",
            borderRadius: "10px",
            display: "flex",
            gap: "6px"
          }}>
            <button
              onClick={() => setActiveTab("cctv")}
              style={{
                backgroundColor: activeTab === "cctv" ? "#059669" : "transparent",
                color: activeTab === "cctv" ? "#ffffff" : "#94a3b8",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Video style={{ width: "15px", height: "15px" }} />
              <span>Live Traffic CCTV</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("upload");
                fileInputRef.current?.click();
              }}
              style={{
                backgroundColor: activeTab === "upload" ? "#059669" : "transparent",
                color: activeTab === "upload" ? "#ffffff" : "#94a3b8",
                border: "none",
                borderRadius: "6px",
                padding: "8px 16px",
                fontSize: "12px",
                fontWeight: "600",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              <Upload style={{ width: "15px", height: "15px" }} />
              <span>Manual Image Scan</span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileUpload}
            />
          </div>

          <div style={{ height: "24px", width: "1px", backgroundColor: "#1e293b" }} />

          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "rgba(16, 185, 129, 0.12)",
            color: "#34d399",
            padding: "6px 14px",
            borderRadius: "6px",
            border: "1px solid rgba(16, 185, 129, 0.25)",
            fontSize: "11px",
            fontFamily: "monospace"
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#34d399" }} />
            <span style={{ fontWeight: "700", textTransform: "uppercase" }}>AI CORE ACTIVE</span>
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main style={{
        maxWidth: "1680px",
        margin: "0 auto",
        padding: "24px 32px",
        display: "grid",
        gridTemplateColumns: "1fr 420px",
        gap: "28px"
      }}>
        {/* Left Column: Media Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {/* Subheader bar */}
          <div style={{
            backgroundColor: "#0e131d",
            border: "1px solid #1e293b",
            borderRadius: "10px",
            padding: "10px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontFamily: "monospace" }}>
              <span style={{ color: "#94a3b8" }}>SOURCE:</span>
              <span style={{ color: "#ffffff", fontWeight: "700" }}>
                {activeTab === "cctv"
                  ? "INDIAN ARTERIAL JUNCTIONS (CCTV MULTI-PERSPECTIVE STREAM)"
                  : "LOCAL TEST IMAGE / PHOTO INSPECTION"}
              </span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => setShowDetectionBoxes(!showDetectionBoxes)}
                style={{
                  backgroundColor: showDetectionBoxes ? "rgba(16, 185, 129, 0.15)" : "rgba(148, 163, 184, 0.15)",
                  color: showDetectionBoxes ? "#34d399" : "#94a3b8",
                  border: `1px solid ${showDetectionBoxes ? "rgba(16, 185, 129, 0.3)" : "rgba(148, 163, 184, 0.3)"}`,
                  borderRadius: "6px",
                  padding: "4px 10px",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Layers style={{ width: "12px", height: "12px" }} />
                <span>{showDetectionBoxes ? "AI BOXES: ON" : "AI BOXES: OFF (RAW)"}</span>
              </button>
              <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#34d399" }}>
                {activeTab === "cctv" ? "LIVE REAL-TIME INFERENCE (25 FPS)" : "STATIC IMAGE PROCESSED"}
              </div>
            </div>
          </div>

          {/* Main Visual Display */}
          <div style={{
            position: "relative",
            backgroundColor: "#000000",
            border: "1px solid #1e293b",
            borderRadius: "14px",
            overflow: "hidden",
            aspectRatio: "16/9",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
          }}>
            {activeTab === "cctv" ? (
              <img
                key={showDetectionBoxes ? "with-boxes" : "without-boxes"}
                src={`http://localhost:8000/api/v1/stream?source=bengaluru&show_boxes=${showDetectionBoxes}`}
                alt="Live Indian Traffic Stream"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              uploadedImage ? (
                <div style={{ position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <img
                    src={showDetectionBoxes && annotatedImage ? annotatedImage : uploadedImage}
                    alt="Uploaded Scene"
                    style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain", display: "block" }}
                  />
                </div>
              ) : (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  style={{ textAlign: "center", padding: "40px", cursor: "pointer" }}
                >
                  <Upload style={{ width: "32px", height: "32px", color: "#10b981", margin: "0 auto 12px auto" }} />
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "#ffffff", margin: "0 0 6px 0" }}>
                    Click to Choose an Image
                  </h3>
                  <p style={{ fontSize: "12px", color: "#64748b", fontFamily: "monospace", margin: 0 }}>
                    Upload any photo to inspect helmet detections
                  </p>
                </div>
              )
            )}

            {/* In-feed HUD Overlay */}
            <div style={{
              position: "absolute",
              top: "14px",
              left: "14px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              padding: "4px 10px",
              borderRadius: "4px",
              fontSize: "11px",
              fontFamily: "monospace",
              color: "#e2e8f0"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#ef4444" }} />
              <span>{activeTab === "cctv" ? "LIVE // IN-TRAFFIC-CAM-01" : "INSPECTION DESK"}</span>
            </div>

            <div style={{
              position: "absolute",
              top: "14px",
              right: "14px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              backgroundColor: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(4px)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              padding: "4px 12px",
              borderRadius: "4px",
              fontSize: "11px",
              fontFamily: "monospace"
            }}>
              <span style={{ color: "#94a3b8" }}>RESOLUTION:</span>
              <span style={{ color: "#ffffff", fontWeight: "600" }}>1280x720</span>
              <span style={{ color: "#475569" }}>|</span>
              <span style={{ color: "#34d399", fontWeight: "700" }}>FEED ACTIVE</span>
            </div>
          </div>
        </div>

        {/* Right Column: Telemetry Stats */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* 4 Stats Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ backgroundColor: "#0e131d", border: "1px solid #1e293b", padding: "16px", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Two-Wheelers</span>
              <div style={{ fontSize: "28px", fontFamily: "monospace", fontWeight: "700", color: "#ffffff" }}>
                {currentStats.total}
              </div>
              <span style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace" }}>In Active View</span>
            </div>

            <div style={{ backgroundColor: "#0e131d", border: "1px solid #1e293b", padding: "16px", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", color: "#94a3b8", display: "block", marginBottom: "4px" }}>Compliance</span>
              <div style={{
                fontSize: "28px",
                fontFamily: "monospace",
                fontWeight: "700",
                color: compliance >= 80 ? "#34d399" : "#fbbf24"
              }}>
                {compliance}%
              </div>
              <span style={{ fontSize: "10px", color: "#64748b", fontFamily: "monospace" }}>Helmet Ratio</span>
            </div>

            <div style={{ backgroundColor: "#0e131d", border: "1px solid rgba(16, 185, 129, 0.25)", padding: "16px", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", color: "#34d399", fontWeight: "600", display: "block", marginBottom: "4px" }}>With Helmet</span>
              <div style={{ fontSize: "28px", fontFamily: "monospace", fontWeight: "700", color: "#34d399" }}>
                {currentStats.safe}
              </div>
              <span style={{ fontSize: "10px", color: "#10b981", fontFamily: "monospace" }}>Safe Riders</span>
            </div>

            <div style={{ backgroundColor: "#0e131d", border: "1px solid rgba(239, 68, 68, 0.25)", padding: "16px", borderRadius: "10px" }}>
              <span style={{ fontSize: "11px", color: "#f87171", fontWeight: "600", display: "block", marginBottom: "4px" }}>No Helmet</span>
              <div style={{ fontSize: "28px", fontFamily: "monospace", fontWeight: "700", color: "#f87171" }}>
                {currentStats.violations}
              </div>
              <span style={{ fontSize: "10px", color: "#ef4444", fontFamily: "monospace" }}>Challans Pending</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
