"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileSpreadsheet, AlertCircle, Check, ArrowLeft, Download, Users, Loader2 } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { useLang } from "@/lib/LangContext";

export default function ImportCitoyensPage() {
  const { lang } = useLang();
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ imported: number; skipped: number; total: number } | null>(null);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!file) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/import-citoyens", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
    } catch (e: any) {
      setError(e.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const headers = [["CIN", "NomComplet", "Telephone", "Adresse", "Secteur", "DateNaissance", "LieuNaissance", "Profession", "Sexe"]];
    const csv = headers.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "modele-import-citoyens.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rtl">
      <PageBanner
        title={lang === "ar" ? "استيراد السكان" : "Import des citoyens"}
        subtitle={lang === "ar" ? "رفع ملف Excel أو CSV ببيانات الساكنة" : "Télécharger un fichier Excel ou CSV des habitants"}
        compact
        backHref="/employe/tableau-de-bord"
        backLabel={lang === "ar" ? "العودة إلى اللوحة" : "Retour au tableau de bord"}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-spatcha-dark mb-2">
            {lang === "ar" ? "رفع ملف الساكنة" : "Uploader le fichier"}
          </h2>
          <p className="text-sm text-spatcha-gray mb-6">
            {lang === "ar"
              ? "الملف يجب أن يحتوي على الأقل عمود CIN و NomComplet. باقي الأعمدة اختيارية."
              : "Le fichier doit contenir au moins les colonnes CIN et NomComplet."}
          </p>

          <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2.5 border border-spatcha-green/30 text-spatcha-green rounded-xl hover:bg-green-50 transition-all text-sm font-medium mb-6">
            <Download size={16} />
            {lang === "ar" ? "تحميل نموذج" : "Télécharger le modèle"}
          </button>

          <div
            className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${file ? "border-spatcha-green bg-green-50/30" : "border-gray-200 hover:border-spatcha-green/40 bg-gray-50/50"}`}
            onClick={() => fileRef.current?.click()}
          >
            {file ? (
              <div className="flex flex-col items-center gap-3">
                <FileSpreadsheet size={48} className="text-spatcha-green" />
                <p className="font-bold text-spatcha-dark">{file.name}</p>
                <p className="text-sm text-spatcha-gray">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <Upload size={48} className="text-gray-300" />
                <p className="font-bold text-spatcha-dark">
                  {lang === "ar" ? "اضغط لرفع الملف" : "Cliquez pour uploader"}
                </p>
                <p className="text-sm text-gray-400">
                  {lang === "ar" ? "Excel (.xlsx, .xls) أو CSV" : "Excel (.xlsx, .xls) ou CSV"}
                </p>
              </div>
            )}
            <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </div>

          {file && (
            <div className="flex gap-4 mt-6">
              <button onClick={() => { setFile(null); setResult(null); }} className="flex-1 border border-gray-200 text-spatcha-dark py-3 rounded-xl hover:bg-gray-50 transition-all font-medium">
                {lang === "ar" ? "إلغاء" : "Annuler"}
              </button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 bg-spatcha-green text-white py-3 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                {loading
                  ? (lang === "ar" ? "جاري الاستيراد..." : "Importation...")
                  : (lang === "ar" ? "بدء الاستيراد" : "Importer")}
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mt-6 text-red-700">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Check size={24} className="text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-spatcha-dark">
                    {lang === "ar" ? "تم الاستيراد بنجاح" : "Importation réussie"}
                  </h3>
                  <p className="text-sm text-spatcha-gray">
                    {lang === "ar"
                      ? `تم استيراد ${result.imported} شخص، وتخطي ${result.skipped} مكرر`
                      : `${result.imported} importé(s), ${result.skipped} doublon(s) ignoré(s)`}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white rounded-xl p-3">
                  <p className="text-2xl font-bold text-spatcha-green">{result.total}</p>
                  <p className="text-xs text-spatcha-gray">{lang === "ar" ? "المجموع" : "Total"}</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-2xl font-bold text-spatcha-green">{result.imported}</p>
                  <p className="text-xs text-spatcha-gray">{lang === "ar" ? "مستورد" : "Importé"}</p>
                </div>
                <div className="bg-white rounded-xl p-3">
                  <p className="text-2xl font-bold text-amber-600">{result.skipped}</p>
                  <p className="text-xs text-spatcha-gray">{lang === "ar" ? "مكرر" : "Doublon"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
