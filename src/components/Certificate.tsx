"use client";

import { useRef } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

interface CertificateProps {
  type: "شهادة السكنى" | "شهادة عدم العمل" | "شهادة التردد";
  nomComplet: string;
  cin: string;
  adresse: string;
  secteur: string;
  telephone: string;
  dateCreation: string;
  agentNom: string;
  signatureDataUrl?: string;
  demandeId: string;
}

const certificateTexts: Record<string, { title: string; body: string }> = {
  "شهادة السكنى": {
    title: "شهادة السكنى",
    body: "يشهد عون السلطة الموقع أسفله أن السيد(ة):",
  },
  "شهادة عدم العمل": {
    title: "شهادة عدم العمل",
    body: "يشهد عون السلطة الموقع أسفله أن السيد(ة):",
  },
  "شهادة التردد": {
    title: "شهادة التردد",
    body: "يشهد عون السلطة الموقع أسفله أن السيد(ة):",
  },
};

function CertificateContent({ type, nomComplet, cin, adresse, secteur, telephone, dateCreation, agentNom, signatureDataUrl, demandeId }: CertificateProps) {
  const info = certificateTexts[type];
  const date = new Date(dateCreation).toLocaleDateString("ar-MA");
  const today = new Date().toLocaleDateString("ar-MA");

  return (
    <div className="bg-white" dir="rtl">
      <div className="border-4 border-double border-spatcha-gold/40 p-6 md:p-10 rounded-none" style={{ minHeight: "800px" }}>
        {/* Taj */}
        <div className="flex justify-center mb-4">
          <img src="/images/coat_of_arms_of_morocco.svg" alt="Taj" className="h-24 md:h-28" />
        </div>

        {/* Administrative hierarchy */}
        <div className="text-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-spatcha-dark" style={{ fontFamily: "'Traditional Arabic', 'Arabic Typesetting', serif" }}>المملكة المغربية</h1>
          <h2 className="text-sm md:text-base text-spatcha-gray mt-1">وزارة الداخلية</h2>
          <h2 className="text-sm md:text-base text-spatcha-gray">عمالة أكادير إداوتنان</h2>
          <h3 className="text-sm md:text-base font-bold text-spatcha-dark mt-1">الملحقة الإدارية 14 - أكادير</h3>
        </div>

        {/* Separator */}
        <div className="border-t-2 border-b border-spatcha-gold/30 mb-6" />

        {/* Reference */}
        <div className="flex justify-between text-xs md:text-sm text-spatcha-gray mb-6">
          <span>رقم: {demandeId.slice(0, 8).toUpperCase()}</span>
          <span>تاريخ الإصدار: {today}</span>
        </div>

        {/* Certificate Title */}
        <h3 className="text-lg md:text-xl font-bold text-center text-spatcha-dark mb-6 underline decoration-spatcha-gold/40 underline-offset-8">
          {info.title}
        </h3>

        {/* Certificate Body */}
        <div className="text-sm md:text-base leading-relaxed text-spatcha-dark space-y-4 mb-8">
          <p>{info.body}</p>

          <table className="w-full border-collapse">
            <tbody>
              <tr>
                <td className="py-1.5 w-40 font-bold align-top">الاسم الكامل:</td>
                <td className="py-1.5 border-b border-dotted border-gray-300 pr-2">{nomComplet}</td>
              </tr>
              <tr>
                <td className="py-1.5 w-40 font-bold align-top">رقم البطاقة الوطنية:</td>
                <td className="py-1.5 border-b border-dotted border-gray-300 pr-2">{cin}</td>
              </tr>
              <tr>
                <td className="py-1.5 w-40 font-bold align-top">العنوان:</td>
                <td className="py-1.5 border-b border-dotted border-gray-300 pr-2">{adresse}</td>
              </tr>
              <tr>
                <td className="py-1.5 w-40 font-bold align-top">الحي:</td>
                <td className="py-1.5 border-b border-dotted border-gray-300 pr-2">{secteur}</td>
              </tr>
              <tr>
                <td className="py-1.5 w-40 font-bold align-top">الهاتف:</td>
                <td className="py-1.5 border-b border-dotted border-gray-300 pr-2">{telephone}</td>
              </tr>
            </tbody>
          </table>

          {type === "شهادة السكنى" && (
            <p className="mt-4">وقد تم تحرير هذه الشهادة بناء على طلب المعني(ة) بالأمر لإدلائه بها لدى الإدارات العمومية.</p>
          )}
          {type === "شهادة عدم العمل" && (
            <p className="mt-4">يثبت عدم مزاولته(ا) لأي نشاط مهني لدى القطاع العام أو الخاص.</p>
          )}
          {type === "شهادة التردد" && (
            <p className="mt-4">وقد تم تحرير هذه الشهادة بناء على التصريح الذي أدلى به(ا) لدى مصلحة الملحقة الإدارية.</p>
          )}
        </div>

        {/* Bottom section: place/date + signature */}
        <div className="flex justify-between items-end mt-12">
          <div className="text-sm text-spatcha-dark">
            <p>حرر بأكادير</p>
            <p>في: {today}</p>
          </div>
          <div className="text-center">
            {signatureDataUrl && (
              <div className="mb-1">
                <img src={signatureDataUrl} alt="Signature" className="h-14 mx-auto" />
              </div>
            )}
            <p className="text-sm font-bold text-spatcha-dark border-t border-spatcha-gold/30 pt-1">
              {agentNom}
            </p>
            <p className="text-xs text-spatcha-gray">عون السلطة</p>
          </div>
        </div>

        {/* Verification QR */}
        <div className="flex justify-center mt-8 pt-4 border-t border-gray-200">
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`https://spatcha.vercel.app/certificat/${demandeId}`)}`}
            alt="QR"
            className="h-16 w-16"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        </div>
      </div>
    </div>
  );
}

export { CertificateContent };
export type { CertificateProps };
