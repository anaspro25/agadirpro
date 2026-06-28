"use client";

import { useEffect, useRef } from "react";
import { SECTEUR_BOUNDARIES, SECTEURS, EMPLOYES } from "@/lib/types";
import { X } from "lucide-react";

interface SectorMapProps {
  secteur: string;
  onClose: () => void;
}

export default function SectorMap({ secteur, onClose }: SectorMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const boundary = SECTEUR_BOUNDARIES[secteur];

  useEffect(() => {
    if (!mapRef.current || !boundary || mapInstanceRef.current) return;

    const initMap = async () => {
      const L = (await import("leaflet")).default;
      await import("leaflet/dist/leaflet.css");

      const map = L.map(mapRef.current!, {
        center: boundary.center,
        zoom: boundary.zoom,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(map);

      const polygon = L.polygon(boundary.polygon as any, {
        color: "#006233",
        weight: 3,
        opacity: 0.9,
        fillColor: "#006233",
        fillOpacity: 0.15,
      }).addTo(map);

      const agent = EMPLOYES.find((e) => e.secteurs.includes(secteur));
      if (agent) {
        const center = boundary.center;
        L.marker(center).addTo(map)
          .bindPopup(`<b>${agent.nomComplet}</b><br/>${secteur}`)
          .openPopup();
      }

      map.fitBounds(polygon.getBounds().pad(0.2));
      mapInstanceRef.current = map;
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [secteur]);

  const agent = EMPLOYES.find((e) => e.secteurs.includes(secteur));

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()} dir="rtl">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-spatcha-dark">{secteur}</h3>
            {agent && <p className="text-sm text-spatcha-gray">عون السلطة: {agent.nomComplet}</p>}
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all">
            <X size={20} className="text-spatcha-gray" />
          </button>
        </div>
        <div ref={mapRef} className="w-full h-[400px] md:h-[500px]" />
        {agent && (
          <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-spatcha-green/10 rounded-xl flex items-center justify-center">
                <span className="text-spatcha-green font-bold text-sm">{agent.nomComplet[0]}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-spatcha-dark">{agent.nomComplet}</p>
                <p className="text-xs text-spatcha-gray">{agent.telephone}</p>
              </div>
            </div>
            <a href={`tel:${agent.telephone}`} className="bg-spatcha-green text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-spatcha-green/90 transition-all">
              اتصل
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
