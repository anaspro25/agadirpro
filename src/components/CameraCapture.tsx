"use client";

import { useState, useRef } from "react";
import { Camera, X } from "lucide-react";
import { useLang } from "@/lib/LangContext";

interface CameraCaptureProps {
  onCapture: (dataUrl: string, fileName: string) => void;
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { lang } = useLang();

  const openCamera = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setStream(s);
      setShowCamera(true);
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = s;
      }, 100);
    } catch {
      alert(lang === "ar" ? "تعذر الوصول إلى الكاميرا. تأكد من السماح باستخدام الكاميرا." : "Impossible d'accéder à la caméra.");
    }
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d")!.drawImage(video, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");
    onCapture(dataUrl, `camera_${Date.now()}.jpg`);
    closeCamera();
  };

  const closeCamera = () => {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    setStream(null);
    setShowCamera(false);
  };

  return (
    <>
      <button type="button" onClick={openCamera} className={`flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all text-sm font-medium border border-blue-200 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
        <Camera size={18} />
        {lang === "ar" ? "تصوير بالكاميرا" : "Photo avec caméra"}
      </button>

      {showCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className={`bg-white rounded-2xl p-4 w-full max-w-lg ${lang === "ar" ? "rtl" : "ltr"}`}>
            <div className={`flex justify-between items-center mb-4 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
              <h3 className="font-bold text-spatcha-dark">{lang === "ar" ? "تصوير وثيقة" : "Prendre une photo"}</h3>
              <button onClick={closeCamera} className="p-1 hover:bg-gray-100 rounded-lg">
                <X size={24} />
              </button>
            </div>
            <video ref={videoRef} autoPlay playsInline className="w-full rounded-xl bg-black" />
            <canvas ref={canvasRef} className="hidden" />
            <div className={`flex gap-3 mt-4 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
              <button onClick={capture} className="flex-1 bg-spatcha-green text-white py-3 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium">
                {lang === "ar" ? "التقاط الصورة" : "Capturer"}
              </button>
              <button onClick={closeCamera} className="flex-1 border border-gray-200 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium">
                {lang === "ar" ? "إلغاء" : "Annuler"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
