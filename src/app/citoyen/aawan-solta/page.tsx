"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Search, User, MapPin } from "lucide-react";
import { EMPLOYES } from "@/lib/types";
import { useLang } from "@/lib/LangContext";
import PageBanner from "@/components/PageBanner";
import SectorMap from "@/components/SectorMap";

export default function AawanSoltaPage() {
  const { t, lang } = useLang();
  const [search, setSearch] = useState("");
  const [mapSecteur, setMapSecteur] = useState<string | null>(null);

  const filtered = EMPLOYES.filter((emp) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return (
      emp.nomComplet.toLowerCase().includes(q) ||
      emp.secteurs.some((s) => s.includes(q)) ||
      emp.telephone.includes(q)
    );
  });

  return (
    <div className={lang === "ar" ? "rtl" : "ltr"}>
      <PageBanner title={t("employees")} subtitle={lang === "ar" ? "ابحث عن عون السلطة المكلف بحيك للتواصل معه مباشرة" : "Recherchez l'agent d'autorité de votre quartier"} compact backHref="/citoyen" backLabel={lang === "ar" ? "العودة إلى الخدمات" : "Retour aux services"} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className={`relative ${lang === "ar" ? "" : ""}`}>
          <Search size={20} className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${lang === "ar" ? "right-4" : "left-4"}`} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full ${lang === "ar" ? "pr-12 pl-4" : "pl-12 pr-4"} py-3.5 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all`}
            placeholder={lang === "ar" ? "ابحث باسم الحي، اسم العون، أو رقم الهاتف..." : "Recherche par quartier, nom ou téléphone..."}
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-spatcha-dark mb-2">{lang === "ar" ? "لا توجد نتائج" : "Aucun résultat"}</h3>
            <p className="text-spatcha-gray">{lang === "ar" ? "لا يوجد عون سلطة يطابق بحثك" : "Aucun agent ne correspond"}</p>
          </div>
        ) : (
          filtered.map((emp) => (
            <div key={emp.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className={`flex items-start gap-4 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
                <div className="w-14 h-14 bg-spatcha-green/10 rounded-2xl flex items-center justify-center shrink-0">
                  <User size={28} className="text-spatcha-green" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-spatcha-dark">{emp.nomComplet}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    {emp.secteurs.map((s) => (
                      <button key={s} onClick={() => setMapSecteur(s)} className="text-sm bg-green-50 text-spatcha-green px-3 py-1 rounded-full font-medium flex items-center gap-1 hover:bg-green-100 transition-all cursor-pointer">
                        <MapPin size={12} />
                        {s}
                      </button>
                    ))}
                  </div>
                  <a href={`tel:${emp.telephone}`} className={`inline-flex items-center gap-2 mt-4 bg-spatcha-green text-white px-5 py-2.5 rounded-xl hover:bg-spatcha-green/90 transition-all text-sm font-medium ${lang === "fr" ? "flex-row-reverse" : ""}`}>
                    <Phone size={16} />
                    {emp.telephone}
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {mapSecteur && <SectorMap secteur={mapSecteur} onClose={() => setMapSecteur(null)} />}
    </div>
    </div>
  );
}
