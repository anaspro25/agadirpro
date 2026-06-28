"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, Share2, Loader2, FileText, Printer } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { CertificateContent } from "@/components/Certificate";
import { useLang } from "@/lib/LangContext";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

export default function CertificatPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useLang();
  const certRef = useRef<HTMLDivElement>(null);
  const [data, setData] = useState<any>(null);
  const [employe, setEmploye] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("employe");
    if (!stored) { router.push("/employe"); return; }
    setEmploye(JSON.parse(stored));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(`/api/demandes/${params.id}`);
      if (res.ok) {
        const demande = await res.json();
        setData(demande);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!certRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      pdf.save(`certificat-${params.id}.pdf`);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const shareWhatsApp = async () => {
    if (!certRef.current) return;
    setGenerating(true);
    try {
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = 210;
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "FAST");
      const pdfBlob = pdf.output("blob");

      if (navigator.share && navigator.canShare) {
        const file = new File([pdfBlob], `certificat-${params.id}.pdf`, { type: "application/pdf" });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({ files: [file], title: lang === "ar" ? "شهادة إدارية" : "Certificat administratif" });
          return;
        }
      }

      const url = URL.createObjectURL(pdfBlob);
      const phone = data?.telephone?.replace(/^0/, "212") || "";
      const text = encodeURIComponent(
        lang === "ar"
          ? `السلام عليكم، نرفق لكم شهادتكم الإدارية.`
          : `Bonjour, veuillez trouver ci-joint votre certificat administratif.`
      );
      window.open(`https://wa.me/${phone}?text=${text}`, "_blank");
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    } catch (e) {
      console.error(e);
    } finally {
      setGenerating(false);
    }
  };

  const printCert = () => {
    window.print();
  };

  if (loading) return <div className="rtl"><PageBanner title="..." compact /><div className="max-w-3xl mx-auto px-4 py-12 text-center text-spatcha-gray">{lang === "ar" ? "جاري التحميل..." : "Chargement..."}</div></div>;
  if (!data) return <div className="rtl"><PageBanner title="..." compact /><div className="max-w-3xl mx-auto px-4 py-12 text-center">{lang === "ar" ? "الطلب غير موجود" : "Demande introuvable"}</div></div>;

  const type = data.description as "شهادة السكنى" | "شهادة عدم العمل" | "شهادة التردد";

  return (
    <div className={lang === "ar" ? "rtl" : "ltr"}>
      <PageBanner
        title={lang === "ar" ? "الشهادة الإدارية" : "Certificat administratif"}
        subtitle={data.nomComplet}
        compact
        backHref={`/employe/tableau-de-bord/demande/${params.id}`}
        backLabel={lang === "ar" ? "العودة إلى الطلب" : "Retour à la demande"}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          <button onClick={printCert} className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all text-sm font-medium">
            <Printer size={16} />
            {lang === "ar" ? "طباعة" : "Imprimer"}
          </button>
          <button onClick={generatePDF} disabled={generating} className="flex items-center gap-2 px-5 py-2.5 bg-spatcha-green text-white rounded-xl hover:bg-spatcha-green/90 transition-all text-sm font-medium disabled:opacity-50">
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            {lang === "ar" ? "تحميل PDF" : "Télécharger PDF"}
          </button>
          <button onClick={shareWhatsApp} disabled={generating} className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all text-sm font-medium disabled:opacity-50">
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Share2 size={16} />}
            {lang === "ar" ? "إرسال عبر واتساب" : "Envoyer via WhatsApp"}
          </button>
        </div>

        {/* Certificate Preview */}
        <div ref={certRef} className="shadow-xl border border-gray-200">
          <CertificateContent
            type={type}
            nomComplet={data.nomComplet}
            cin={data.cin}
            adresse={data.adresse}
            secteur={data.secteur}
            telephone={data.telephone}
            dateCreation={data.dateCreation}
            agentNom={employe?.nomComplet || ""}
            signatureDataUrl={employe?.signature}
            demandeId={params.id as string}
          />
        </div>

        <div className="text-center mt-6 text-xs text-spatcha-gray">
          {lang === "ar"
            ? "يمكن التحقق من صحة هذه الشهادة عبر مسح رمز QR الموجود أسفل الوثيقة"
            : "L'authenticité de ce certificat peut être vérifiée en scannant le code QR ci-dessous"}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          nav, footer, .no-print { display: none !important; }
          @page { margin: 0; }
        }
      `}</style>
    </div>
  );
}
