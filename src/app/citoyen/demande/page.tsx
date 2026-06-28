"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TypeDemande, SECTEURS } from "@/lib/types";
import LocationPicker from "@/components/LocationPicker";
import { Upload, FileText, ArrowLeft, Check, AlertCircle } from "lucide-react";
import Link from "next/link";
import CameraCapture from "@/components/CameraCapture";
import { useLang } from "@/lib/LangContext";
import PageBanner from "@/components/PageBanner";

export default function DemandePage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nomComplet: "",
    cin: "",
    telephone: "",
    adresse: "",
    secteur: "",
    type: TypeDemande.CHAHADAT_SOKNA,
    description: "",
  });
  const [documents, setDocuments] = useState<{ nom: string; type: string; dataUrl: string }[]>([]);
  const [latitude, setLatitude] = useState<number | undefined>();
  const [longitude, setLongitude] = useState<number | undefined>();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setDocuments((prev) => {
        const filtered = prev.filter((d) => d.type !== docType);
        return [...filtered, { nom: file.name, type: docType, dataUrl: reader.result as string }];
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    if (!nomComplet || !cin || !telephone || !adresse || !secteur) {
      setError(lang === "ar" ? "يرجى ملء جميع الحقول المطلوبة" : "Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (documents.length === 0) {
      setError(lang === "ar" ? "يرجى إرفاق البطاقة الوطنية على الأقل" : "Veuillez joindre au moins la CIN");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/demandes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, documents, latitude, longitude }),
      });
      if (!res.ok) throw new Error("فشل في تقديم الطلب");
      setSuccess(true);
    } catch {
      setError(lang === "ar" ? "حدث خطأ. حاول مرة أخرى." : "Erreur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const { nomComplet, cin, telephone, adresse, secteur, type, description } = form;
  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  if (success) {
    return (
      <div className={`max-w-2xl mx-auto px-4 py-20 text-center ${lang === "ar" ? "rtl" : "ltr"}`}>
        <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} className="text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-spatcha-dark mb-4">{t("successTitle")}</h1>
          <p className="text-spatcha-gray mb-8">{t("successDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/citoyen/suivi" className="inline-flex items-center justify-center gap-2 bg-spatcha-green text-white px-8 py-3 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium">
              {t("trackRequests")}
            </Link>
            <button onClick={() => { setSuccess(false); setStep(1); setForm({ nomComplet: "", cin: "", telephone: "", adresse: "", secteur: "", type: TypeDemande.CHAHADAT_SOKNA, description: "" }); setDocuments([]); }} className="inline-flex items-center justify-center gap-2 border border-gray-200 text-spatcha-dark px-8 py-3 rounded-xl hover:bg-gray-50 transition-all font-medium">
              {t("newRequest")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={lang === "ar" ? "rtl" : "ltr"}>
      <PageBanner title={t("requestCertTitle")} subtitle={t("formRequestCertDesc")} compact backHref="/citoyen" backLabel={lang === "ar" ? "العودة إلى الخدمات" : "Retour aux services"} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

      {/* Steps */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${step >= s ? "bg-spatcha-green text-white" : "bg-gray-100 text-gray-400"}`}>{s}</div>
            <span className={`text-sm hidden sm:block ${step >= s ? "text-spatcha-green font-medium" : "text-gray-400"}`}>
              {[t("stepInfo"), t("stepDocs"), t("stepConfirm")][s - 1]}
            </span>
            {s < 3 && <div className={`flex-1 h-0.5 ${step > s ? "bg-spatcha-green" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      {error && (
        <div className={`flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 ${lang === "ar" ? "rtl" : "ltr"}`}>
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1 */}
      {step === 1 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("fullName")} <span className="text-red-500">*</span></label>
              <input type="text" value={nomComplet} onChange={(e) => update("nomComplet", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all" placeholder={lang === "ar" ? "أدخل اسمك الكامل" : "Votre nom complet"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("cin")} <span className="text-red-500">*</span></label>
              <input type="text" value={cin} onChange={(e) => update("cin", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all" placeholder="AB123456" />
            </div>
            <div>
              <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("phone")} <span className="text-red-500">*</span></label>
              <input type="tel" value={telephone} onChange={(e) => update("telephone", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all" placeholder="0612345678" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("address")} <span className="text-red-500">*</span></label>
              <input type="text" value={adresse} onChange={(e) => update("adresse", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all" placeholder={lang === "ar" ? "أدخل عنوانك السكني الكامل" : "Votre adresse complète"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("neighborhood")} <span className="text-red-500">*</span></label>
              <select value={secteur} onChange={(e) => update("secteur", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all bg-white">
                <option value="">{t("selectNeighborhood")}</option>
                {SECTEURS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("certType")} <span className="text-red-500">*</span></label>
              <select value={type} onChange={(e) => update("type", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all bg-white">
                {Object.values(TypeDemande).map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("notes")}</label>
              <textarea value={description} onChange={(e) => update("description", e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all resize-none" placeholder={lang === "ar" ? "أي معلومات إضافية (اختياري)" : "Informations supplémentaires (optionnel)"} />
            </div>
          </div>
          <button onClick={() => setStep(2)} className="mt-8 w-full bg-spatcha-green text-white py-3.5 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium text-lg">
            {t("next")}: {t("stepDocs")}
          </button>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <p className="text-sm text-spatcha-gray mb-6">{t("uploadDocs")}. {t("acceptedFormats")}</p>
          <div className="space-y-4 mb-4">
            <FileUpload label={t("cinCard")} required docType="cin" fileName={documents.find((d) => d.type === "cin")?.nom} onChange={(e) => handleFile(e, "cin")} />
            <FileUpload label={t("electricityBill")} docType="facture" fileName={documents.find((d) => d.type === "facture")?.nom} onChange={(e) => handleFile(e, "facture")} />
            <FileUpload label={t("witnessCert")} docType="temoins" fileName={documents.find((d) => d.type === "temoins")?.nom} onChange={(e) => handleFile(e, "temoins")} />
            <FileUpload label={t("otherDoc")} docType="autre" fileName={documents.find((d) => d.type === "autre")?.nom} onChange={(e) => handleFile(e, "autre")} />
          </div>
          <div className="flex justify-center mb-6">
            <CameraCapture onCapture={(dataUrl, fileName) => setDocuments((prev) => [...prev, { nom: fileName, type: "camera", dataUrl }])} />
          </div>
          <div className="mb-6 pt-4 border-t border-gray-100">
            <LocationPicker latitude={latitude} longitude={longitude} onLocationChange={(lat, lng) => { setLatitude(lat); setLongitude(lng); }} />
          </div>
          <div className="flex gap-4 mt-6">
            <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-spatcha-dark py-3.5 rounded-xl hover:bg-gray-50 transition-all font-medium">
              {t("back")}
            </button>
            <button onClick={() => setStep(3)} className="flex-1 bg-spatcha-green text-white py-3.5 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium">
              {t("next")}: {t("stepConfirm")}
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-spatcha-dark mb-6">{t("stepConfirm")}</h2>
          <div className="space-y-4">
            {[
              [t("fullName"), nomComplet],
              [t("cin"), cin],
              [t("phone"), telephone],
              [t("address"), adresse],
              [t("neighborhood"), secteur],
              [t("certType"), type],
              [t("notes"), description || (lang === "ar" ? "لا يوجد" : "Aucune")],
              [t("stepDocs"), `${documents.length} ${lang === "ar" ? "وثائق مرفقة" : "document(s) joint(s)"}`],
            ].map(([label, value], i) => (
              <div key={i} className={`flex justify-between py-3 border-b border-gray-100 last:border-0 ${lang === "ar" ? "" : "flex-row-reverse"}`}>
                <span className="text-spatcha-gray">{label as string}</span>
                <span className="font-medium text-spatcha-dark">{value as string}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-4 mt-8">
            <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-spatcha-dark py-3.5 rounded-xl hover:bg-gray-50 transition-all font-medium">
              {t("back")}
            </button>
            <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-spatcha-green text-white py-3.5 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium disabled:opacity-50">
              {loading ? (lang === "ar" ? "جاري التقديم..." : "Envoi en cours...") : t("confirm")}
            </button>
          </div>
        </div>
      )}
    </div>
    </div>
  );
}

function FileUpload({ label, required, docType, fileName, onChange }: { label: string; required?: boolean; docType: string; fileName?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const { lang } = useLang();
  return (
    <div className={`border-2 border-dashed border-gray-200 hover:border-spatcha-green/40 rounded-xl p-6 transition-all bg-gray-50/50 hover:bg-green-50/30 ${lang === "ar" ? "rtl" : "ltr"}`}>
      <label className={`flex items-center gap-4 cursor-pointer ${lang === "fr" ? "flex-row-reverse" : ""}`}>
        <div className="w-12 h-12 bg-spatcha-green/10 rounded-xl flex items-center justify-center shrink-0">
          <Upload size={22} className="text-spatcha-green" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-spatcha-dark">
            {label} {required && <span className="text-red-500">*</span>}
          </p>
          {fileName ? (
            <p className="text-sm text-spatcha-green">{fileName}</p>
          ) : (
            <p className="text-sm text-gray-400">{lang === "ar" ? "اضغط لرفع الملف" : "Cliquez pour joindre"}</p>
          )}
        </div>
        <FileText size={20} className="text-gray-300" />
        <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={onChange} className="hidden" />
      </label>
    </div>
  );
}
