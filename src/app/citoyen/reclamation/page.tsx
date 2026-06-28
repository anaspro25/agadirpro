"use client";

import { useState } from "react";
import { SECTEURS } from "@/lib/types";
import { MessageSquare, ArrowLeft, Check, AlertCircle, Upload, FileText } from "lucide-react";
import Link from "next/link";
import CameraCapture from "@/components/CameraCapture";
import { useLang } from "@/lib/LangContext";
import PageBanner from "@/components/PageBanner";
import LocationPicker from "@/components/LocationPicker";

export default function ReclamationPage() {
  const { t, lang } = useLang();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nomComplet: "",
    cin: "",
    telephone: "",
    adresse: "",
    secteur: "",
    sujet: "",
    description: "",
  });
  const [documents, setDocuments] = useState<{ nom: string; type: string; dataUrl: string }[]>([]);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDocuments((prev) => [...prev, { nom: file.name, type: "piece", dataUrl: reader.result as string }]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const { nomComplet, cin, telephone, adresse, secteur, sujet, description } = form;
    if (!nomComplet || !cin || !telephone || !adresse || !secteur || !sujet || !description) {
      setError(lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Veuillez remplir tous les champs");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/reclamations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, documents, latitude, longitude }),
      });
      if (!res.ok) throw new Error("فشل في تقديم الشكاية");
      setSuccess(true);
    } catch {
      setError(lang === "ar" ? "حدث خطأ. حاول مرة أخرى." : "Erreur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className={lang === "ar" ? "rtl" : "ltr"}>
        <PageBanner title={t("complaintTitle")} compact />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-spatcha-dark mb-4">{t("complaintSuccess")}</h1>
          <p className="text-spatcha-gray mb-8">{lang === "ar" ? "سيتم معالجة شكايتك من طرف عون السلطة المختص في أقرب وقت ممكن." : "Votre réclamation sera traitée par l'agent d'autorité compétent."}</p>
          <Link href="/citoyen/suivi" className="inline-flex items-center justify-center gap-2 bg-spatcha-green text-white px-8 py-3 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium">
            {t("trackRequests")}
          </Link>
        </div>
      </div>
    </div>
    );
  }

  return (
    <div className={lang === "ar" ? "rtl" : "ltr"}>
      <PageBanner title={t("complaintTitle")} subtitle={t("formComplaintDesc")} compact backHref="/citoyen" backLabel={lang === "ar" ? "العودة إلى الخدمات" : "Retour aux services"} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {error && (
        <div className={`flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 ${lang === "ar" ? "rtl" : "ltr"}`}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("fullName")} <span className="text-red-500">*</span></label>
            <input type="text" value={form.nomComplet} onChange={(e) => setForm({ ...form, nomComplet: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all" placeholder={lang === "ar" ? "أدخل اسمك الكامل" : "Votre nom complet"} />
          </div>
          <div>
            <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("cin")} <span className="text-red-500">*</span></label>
            <input type="text" value={form.cin} onChange={(e) => setForm({ ...form, cin: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all" placeholder="AB123456" />
          </div>
          <div>
            <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("phone")} <span className="text-red-500">*</span></label>
            <input type="tel" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all" placeholder="0612345678" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("address")} <span className="text-red-500">*</span></label>
            <input type="text" value={form.adresse} onChange={(e) => setForm({ ...form, adresse: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all" placeholder={lang === "ar" ? "أدخل عنوانك السكني الكامل" : "Votre adresse complète"} />
          </div>
          <div>
            <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("neighborhood")} <span className="text-red-500">*</span></label>
            <select value={form.secteur} onChange={(e) => setForm({ ...form, secteur: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all bg-white">
              <option value="">{t("selectNeighborhood")}</option>
              {SECTEURS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("subject")} <span className="text-red-500">*</span></label>
            <input type="text" value={form.sujet} onChange={(e) => setForm({ ...form, sujet: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all" placeholder={lang === "ar" ? "عنوان الشكاية" : "Objet de la réclamation"} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("complaintDetails")} <span className="text-red-500">*</span></label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={5} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all resize-none" placeholder={lang === "ar" ? "اكتب تفاصيل شكايتك هنا..." : "Détaillez votre réclamation ici..."} />
          </div>
          <div className="md:col-span-2">
            <div className={`border-2 border-dashed border-gray-200 hover:border-spatcha-green/40 rounded-xl p-6 transition-all bg-gray-50/50 ${lang === "fr" ? "text-left" : ""}`}>
              <label className={`flex items-center gap-4 cursor-pointer ${lang === "fr" ? "flex-row-reverse" : ""}`}>
                <div className="w-12 h-12 bg-spatcha-green/10 rounded-xl flex items-center justify-center shrink-0">
                  <Upload size={22} className="text-spatcha-green" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-spatcha-dark">{t("attachDocs")}</p>
                  {documents.length > 0 ? (
                    <p className="text-sm text-spatcha-green">{documents.length} {lang === "ar" ? "وثيقة(ق) مرفقة" : "document(s) joint(s)"}</p>
                  ) : (
                    <p className="text-sm text-gray-400">{lang === "ar" ? "اختياري - صور، مستندات... (JPG, PNG, PDF)" : "Optionnel - Photos, documents... (JPG, PNG, PDF)"}</p>
                  )}
                </div>
                <FileText size={20} className="text-gray-300" />
                <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={handleFile} className="hidden" />
              </label>
            </div>
            <div className="flex justify-center mt-4">
              <CameraCapture onCapture={(dataUrl, fileName) => setDocuments((prev) => [...prev, { nom: fileName, type: "camera", dataUrl }])} />
            </div>
          </div>
          <div className="md:col-span-2 pt-4 border-t border-gray-100">
            <LocationPicker latitude={latitude} longitude={longitude} onLocationChange={(lat, lng) => { setLatitude(lat); setLongitude(lng); }} />
          </div>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="mt-8 w-full bg-spatcha-green text-white py-3.5 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium text-lg disabled:opacity-50">
          {loading ? (lang === "ar" ? "جاري التقديم..." : "Envoi...") : t("submit")}
        </button>
      </div>
    </div>
    </div>
  );
}
