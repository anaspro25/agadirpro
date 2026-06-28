"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Check, Loader2 } from "lucide-react";
import { useLang } from "@/lib/LangContext";

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({ latitude, longitude, onLocationChange }: LocationPickerProps) {
  const { lang } = useLang();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [selectedLat, setSelectedLat] = useState<number | null>(latitude || null);
  const [selectedLng, setSelectedLng] = useState<number | null>(longitude || null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const defaultPos: [number, number] = selectedLat && selectedLng
        ? [selectedLat, selectedLng]
        : [30.4278, -9.5981];

      const map = L.map(mapRef.current!, {
        center: defaultPos,
        zoom: 15,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);

      const marker = L.marker(defaultPos, { draggable: true }).addTo(map);

      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setSelectedLat(pos.lat);
        setSelectedLng(pos.lng);
        onLocationChange(pos.lat, pos.lng);
      });

      map.on("click", (e: any) => {
        marker.setLatLng(e.latlng);
        setSelectedLat(e.latlng.lat);
        setSelectedLng(e.latlng.lng);
        onLocationChange(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setReady(true);
    };

    init();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const getCurrentPosition = () => {
    if (!navigator.geolocation) return;
    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setSelectedLat(lat);
        setSelectedLng(lng);
        onLocationChange(lat, lng);
        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.setView([lat, lng], 16);
          markerRef.current.setLatLng([lat, lng]);
        }
        setGettingLocation(false);
      },
      () => setGettingLocation(false),
      { enableHighAccuracy: true }
    );
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-bold text-spatcha-dark flex items-center gap-2">
          <MapPin size={16} className="text-spatcha-green" />
          {lang === "ar" ? "موقعك على الخريطة" : "Votre localisation"}
        </label>
        <button
          type="button"
          onClick={getCurrentPosition}
          disabled={gettingLocation}
          className="flex items-center gap-2 px-4 py-2 bg-spatcha-green text-white rounded-xl hover:bg-spatcha-green/90 transition-all text-sm font-medium disabled:opacity-50"
        >
          {gettingLocation ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} />}
          {lang === "ar" ? "موقعي الحالي" : "Ma position"}
        </button>
      </div>
      <div ref={mapRef} className="w-full h-[300px] rounded-2xl border border-gray-200 overflow-hidden" />
      {selectedLat && selectedLng && (
        <div className="mt-2 flex items-center gap-2 text-xs text-spatcha-gray">
          <Check size={14} className="text-green-600" />
          {lang === "ar" ? "تم تحديد الموقع" : "Localisation définie"}
          <span dir="ltr" className="text-gray-400">
            ({selectedLat.toFixed(5)}, {selectedLng.toFixed(5)})
          </span>
        </div>
      )}
    </div>
  );
}
