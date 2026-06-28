"use client";

import { useState } from "react";
import { Search, FileText, MessageSquare, ArrowLeft, Clock, Eye } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import PageBanner from "@/components/PageBanner";

interface RequestItem {
  id: string;
  type: "demande" | "reclamation";
  title: string;
  statut: string;
  date: string;
  secteur: string;
}

const statutColors: Record<string, string> = {
  "موداخلة": "bg-blue-100 text-blue-700",
  "قيد الدراسة": "bg-amber-100 text-amber-700",
  "مولجة": "bg-purple-100 text-purple-700",
  "معاملة": "bg-indigo-100 text-indigo-700",
  "معالجة": "bg-indigo-100 text-indigo-700",
  "متم": "bg-green-100 text-green-700",
  "مرفوضة": "bg-red-100 text-red-700",
  "Soumise": "bg-blue-100 text-blue-700",
  "En cours d'étude": "bg-amber-100 text-amber-700",
  "Transmise": "bg-purple-100 text-purple-700",
  "En traitement": "bg-indigo-100 text-indigo-700",
  "Complétée": "bg-green-100 text-green-700",
  "Refusée": "bg-red-100 text-red-700",
};

export default function SuiviPage() {
  const { t, lang } = useLang();
  const [cin, setCin] = useState("");
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!cin.trim()) return;
    setLoading(true);
    try {
      const [demandesRes, reclamationsRes] = await Promise.all([
        fetch(`/api/demandes?cin=${cin}`),
        fetch(`/api/reclamations?cin=${cin}`),
      ]);
      const demandes = await demandesRes.json();
      const reclamations = await reclamationsRes.json();

      const items: RequestItem[] = [
        ...demandes.map((d: any) => ({ id: d.id, type: "demande" as const, title: d.type, statut: d.statut, date: d.dateCreation, secteur: d.secteur })),
        ...reclamations.map((r: any) => ({ id: r.id, type: "reclamation" as const, title: r.sujet, statut: r.statut, date: r.dateCreation, secteur: r.secteur })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setRequests(items);
      setSearched(true);
    } catch {
      setRequests([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={lang === "ar" ? "rtl" : "ltr"}>
      <PageBanner title={t("trackPageTitle")} subtitle={t("trackPageDesc")} compact backHref="/citoyen" backLabel={lang === "ar" ? "العودة إلى الخدمات" : "Retour aux services"} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
        <div className={`flex gap-4 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
          <input
            type="text"
            value={cin}
            onChange={(e) => setCin(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-3.5 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all"
            placeholder={lang === "ar" ? "أدخل رقم بطاقتك الوطنية" : "Entrez votre N° CIN"}
          />
          <button onClick={handleSearch} disabled={loading} className="bg-spatcha-green text-white px-6 py-3.5 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium whitespace-nowrap disabled:opacity-50">
            {loading ? "..." : t("search")}
          </button>
        </div>
      </div>

      {searched && (
        <>
          {requests.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={28} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-spatcha-dark mb-2">{t("noResults")}</h3>
              <p className="text-spatcha-gray">{t("noResultsDesc")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className={`flex items-start justify-between gap-4 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
                    <div className={`flex items-start gap-4 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${req.type === "demande" ? "bg-blue-50" : "bg-amber-50"}`}>
                        {req.type === "demande" ? <FileText size={22} className="text-blue-600" /> : <MessageSquare size={22} className="text-amber-600" />}
                      </div>
                      <div className={lang === "fr" ? "text-right" : ""}>
                        <h3 className="font-bold text-spatcha-dark">{req.title}</h3>
                        <p className="text-sm text-spatcha-gray mt-1">{req.type === "demande" ? (lang === "ar" ? "شهادة" : "Certificat") : (lang === "ar" ? "شكاية" : "Réclamation")} - {req.secteur}</p>
                        <div className={`flex items-center gap-4 mt-2 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statutColors[req.statut] || "bg-gray-100 text-gray-700"}`}>
                            {req.statut}
                          </span>
                          <span className="text-xs text-gray-400 flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(req.date).toLocaleDateString(lang === "ar" ? "ar-MA" : "fr-FR")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/employe/tableau-de-bord/demande/${req.id}`} className="text-spatcha-green hover:bg-spatcha-green/5 p-2 rounded-lg transition-all">
                      <Eye size={20} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
    </div>
  );
}
