"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, FileText, MessageSquare, Users, Clock, Eye, CheckCircle, XCircle, RefreshCw, Phone, PenLine, Upload, Database } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import PageBanner from "@/components/PageBanner";

interface EmployeSession {
  id: string;
  nomComplet: string;
  email: string;
  secteurs: string[];
  telephone: string;
  signature?: string;
}

interface DemandeItem {
  id: string;
  type: "demande" | "reclamation";
  title: string;
  nomComplet: string;
  cin: string;
  statut: string;
  date: string;
  telephone: string;
}

const statutColors: Record<string, string> = {
  "موداخلة": "bg-blue-100 text-blue-700",
  "قيد الدراسة": "bg-amber-100 text-amber-700",
  "مولجة": "bg-purple-100 text-purple-700",
  "معاملة": "bg-indigo-100 text-indigo-700",
  "معالجة": "bg-indigo-100 text-indigo-700",
  "متم": "bg-green-100 text-green-700",
  "مرفوضة": "bg-red-100 text-red-700",
};

const statutsDisponibles = ["موداخلة", "قيد الدراسة", "مولجة", "معاملة", "متم", "مرفوضة"];

export default function TableauDeBordPage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [employe, setEmploye] = useState<EmployeSession | null>(null);
  const [items, setItems] = useState<DemandeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [showSignature, setShowSignature] = useState(false);
  const [signatureDataUrl, setSignatureDataUrl] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("employe");
    if (!stored) { router.push("/employe"); return; }
    setEmploye(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!employe) return;
    fetchData();
  }, [employe]);

  const fetchData = async () => {
    if (!employe) return;
    setLoading(true);
    try {
      const secteurParams = employe.secteurs.map((s) => `secteur=${encodeURIComponent(s)}`).join("&");
      const [demandesRes, reclamationsRes] = await Promise.all([
        fetch(`/api/demandes?${secteurParams}`),
        fetch(`/api/reclamations?${secteurParams}`),
      ]);
      const demandes = await demandesRes.json();
      const reclamations = await reclamationsRes.json();

      const all: DemandeItem[] = [
        ...demandes.map((d: any) => ({ ...d, type: "demande" as const, title: d.type })),
        ...reclamations.map((r: any) => ({ ...r, type: "reclamation" as const, title: r.sujet })),
      ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      setItems(all);
    } catch (e) {
      console.error("Error fetching data", e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatut = async (id: string, type: string, statut: string) => {
    const endpoint = type === "demande" ? `/api/demandes/${id}` : `/api/reclamations/${id}`;
    try {
      const res = await fetch(endpoint, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statut, employeId: employe?.id }),
      });
      if (res.ok) fetchData();
    } catch (e) {
      console.error("Error updating status", e);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("employe");
    router.push("/employe");
  };

  const filtered = items.filter((item) => {
    if (typeFilter !== "all" && item.type !== typeFilter) return false;
    if (filter !== "all" && item.statut !== filter) return false;
    return true;
  });

  const stats = {
    total: items.length,
    pending: items.filter((i) => i.statut === "موداخلة" || i.statut === "قيد الدراسة").length,
    completed: items.filter((i) => i.statut === "متم").length,
    rejected: items.filter((i) => i.statut === "مرفوضة").length,
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!employe) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setSignatureDataUrl(dataUrl);
      const updated = { ...employe, signature: dataUrl };
      setEmploye(updated);
      localStorage.setItem("employe", JSON.stringify(updated));
    };
    reader.readAsDataURL(file);
  };

  const clearSignature = () => {
    if (!employe) return;
    setSignatureDataUrl("");
    const updated = { ...employe, signature: "" };
    setEmploye(updated);
    localStorage.setItem("employe", JSON.stringify(updated));
  };

  if (!employe) return null;

  return (
    <div className={lang === "ar" ? "rtl" : "ltr"}>
      <PageBanner title={`${t("welcome")}، ${employe.nomComplet}`} subtitle={employe.secteurs.join(" • ")} compact />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap justify-end gap-3 mb-6">
          <button onClick={() => { setShowSignature(true); setSignatureDataUrl(employe.signature || ""); }} className="flex items-center gap-2 px-4 py-2.5 border border-spatcha-gold/30 bg-spatcha-gold/10 text-spatcha-dark rounded-xl hover:bg-spatcha-gold/20 transition-all text-sm font-medium">
            <PenLine size={16} />
            {lang === "ar" ? "التوقيع الإلكتروني" : "Signature"}
          </button>
          <Link href="/employe/import-citoyens" className="flex items-center gap-2 px-4 py-2.5 border border-spatcha-green/30 bg-spatcha-green/5 text-spatcha-green rounded-xl hover:bg-spatcha-green/10 transition-all text-sm font-medium">
            <Database size={16} />
            {lang === "ar" ? "استيراد السكان" : "Import citoyens"}
          </Link>
          <button onClick={fetchData} className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium">
            <RefreshCw size={16} />
            {t("refresh")}
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-all text-sm font-medium">
            <LogOut size={16} />
            {t("logout")}
          </button>
        </div>

        {/* Signature Modal */}
        {showSignature && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSignature(false)}>
            <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()} dir={lang === "ar" ? "rtl" : "ltr"}>
              <h3 className="text-xl font-bold text-spatcha-dark mb-2">{lang === "ar" ? "إدارة التوقيع الإلكتروني" : "Gestion de la signature"}</h3>
              <p className="text-sm text-spatcha-gray mb-6">{lang === "ar" ? "ارفع صورة توقيعك أو ختمك الإلكتروني. سيتم استخدامه تلقائيا عند تأكيد الطلبات." : "Téléchargez votre signature ou cachet. Il sera utilisé automatiquement lors de la validation des demandes."}</p>

              {signatureDataUrl ? (
                <div className="mb-6">
                  <img src={signatureDataUrl} alt="Signature" className="max-h-32 mx-auto border border-gray-200 rounded-xl p-4 bg-white" />
                  <div className="flex gap-3 mt-4">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium cursor-pointer">
                      <Upload size={16} />
                      {lang === "ar" ? "تغيير" : "Changer"}
                      <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                    </label>
                    <button onClick={clearSignature} className="flex-1 px-4 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all text-sm font-medium">
                      {lang === "ar" ? "حذف" : "Supprimer"}
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block border-2 border-dashed border-gray-200 hover:border-spatcha-green/40 rounded-2xl p-8 text-center cursor-pointer transition-all mb-6">
                  <Upload size={32} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-sm text-spatcha-gray">{lang === "ar" ? "اضغط لرفع صورة التوقيع" : "Cliquez pour télécharger"}</p>
                  <p className="text-xs text-gray-400 mt-1">{lang === "ar" ? "صيغ مقبولة: JPG, PNG" : "Formats: JPG, PNG"}</p>
                  <input type="file" accept="image/*" onChange={handleSignatureUpload} className="hidden" />
                </label>
              )}

              <button onClick={() => setShowSignature(false)} className="w-full bg-spatcha-green text-white py-3 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium">
                {lang === "ar" ? "حفظ" : "Enregistrer"}
              </button>
            </div>
          </div>
        )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: t("total"), value: stats.total, color: "bg-blue-50 text-blue-600", icon: FileText },
          { label: t("inProgress"), value: stats.pending, color: "bg-amber-50 text-amber-600", icon: Clock },
          { label: t("completed"), value: stats.completed, color: "bg-green-50 text-green-600", icon: CheckCircle },
          { label: t("rejected"), value: stats.rejected, color: "bg-red-50 text-red-600", icon: XCircle },
        ].map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-spatcha-gray">{stat.label}</p>
                <p className="text-3xl font-bold text-spatcha-dark mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className={`flex flex-col sm:flex-row gap-4 ${lang === "fr" ? "" : ""}`}>
          <div className="flex-1">
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none bg-white text-sm">
              <option value="all">{t("allRequests")}</option>
              <option value="demande">{lang === "ar" ? "الشواهد" : "Certificats"}</option>
              <option value="reclamation">{lang === "ar" ? "الشكايات" : "Réclamations"}</option>
            </select>
          </div>
          <div className="flex-1">
            <select value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none bg-white text-sm">
              <option value="all">{t("allStatus")}</option>
              {statutsDisponibles.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12 text-spatcha-gray">{lang === "ar" ? "جاري التحميل..." : "Chargement..."}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-spatcha-dark mb-2">{t("noRequests")}</h3>
          <p className="text-spatcha-gray">{t("noRequestsDesc")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className={`flex flex-col lg:flex-row lg:items-center gap-4 ${lang === "fr" ? "lg:flex-row-reverse" : ""}`}>
                <div className={`flex items-start gap-4 flex-1 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.type === "demande" ? "bg-blue-50" : "bg-amber-50"}`}>
                    {item.type === "demande" ? <FileText size={22} className="text-blue-600" /> : <MessageSquare size={22} className="text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`flex items-center gap-2 mb-1 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
                      <h3 className="font-bold text-spatcha-dark truncate">{item.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${statutColors[item.statut] || "bg-gray-100"}`}>{item.statut}</span>
                    </div>
                    <div className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-spatcha-gray ${lang === "fr" ? "flex-row-reverse" : ""}`}>
                      <span className={`flex items-center gap-1 ${lang === "fr" ? "flex-row-reverse" : ""}`}><Users size={14} />{item.nomComplet}</span>
                      <span>CIN: {item.cin}</span>
                      <span className={`flex items-center gap-1 ${lang === "fr" ? "flex-row-reverse" : ""}`}><Phone size={14} />{item.telephone}</span>
                      <span className={`flex items-center gap-1 ${lang === "fr" ? "flex-row-reverse" : ""}`}><Clock size={14} />{new Date(item.date).toLocaleDateString(lang === "ar" ? "ar-MA" : "fr-FR")}</span>
                    </div>
                  </div>
                </div>
                <div className={`flex items-center gap-2 shrink-0 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
                  <select
                    value={item.statut}
                    onChange={(e) => updateStatut(item.id, item.type, e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:border-spatcha-green outline-none"
                  >
                    {statutsDisponibles.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <Link href={`/employe/tableau-de-bord/demande/${item.id}`} className="p-2 text-spatcha-green hover:bg-spatcha-green/5 rounded-lg transition-all">
                    <Eye size={20} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  );
}
