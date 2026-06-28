"use client";

import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { useLang } from "@/lib/LangContext";

interface LocationMapProps {
  latitude: number;
  longitude: number;
  label?: string;
}

export default function LocationMap({ latitude, longitude, label }: LocationMapProps) {
  const { lang } = useLang();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const init = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current!, {
        center: [latitude, longitude],
        zoom: 16,
        zoomControl: false,
        scrollWheelZoom: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap",
        maxZoom: 18,
      }).addTo(map);

      L.marker([latitude, longitude]).addTo(map)
        .bindPopup(label || `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`)
        .openPopup();

      mapInstanceRef.current = map;
    };

    init();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [latitude, longitude]);

  return (
    <div className="mb-8">
      <h3 className="font-bold text-spatcha-dark mb-3 flex items-center gap-2">
        <MapPin size={18} className="text-spatcha-green" />
        {lang === "ar" ? "موقع مقدم الطلب" : "Localisation du demandeur"}
      </h3>
      <div ref={mapRef} className="w-full h-[250px] rounded-2xl border border-gray-200 overflow-hidden" />
    </div>
  );
}
