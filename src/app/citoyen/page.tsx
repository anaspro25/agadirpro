"use client";

import Link from "next/link";
import { FileText, MessageSquare, Search, Building, Phone } from "lucide-react";
import { EMPLOYES } from "@/lib/types";
import { useLang } from "@/lib/LangContext";
import PageBanner from "@/components/PageBanner";

export default function CitoyenPage() {
  const { t, lang } = useLang();

  const services = [
    { icon: FileText, title: t("requestCert"), desc: t("requestCertDesc"), href: "/citoyen/demande", color: "bg-blue-50 text-blue-600" },
    { icon: MessageSquare, title: t("complaint"), desc: t("complaintDesc"), href: "/citoyen/reclamation", color: "bg-amber-50 text-amber-600" },
    { icon: Phone, title: t("aawan"), desc: t("aawanDesc"), href: "/citoyen/aawan-solta", color: "bg-purple-50 text-purple-600" },
    { icon: Search, title: t("trackTitle"), desc: t("trackDesc"), href: "/citoyen/suivi", color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className={lang === "ar" ? "rtl" : "ltr"}>
      <PageBanner title={t("services")} subtitle={lang === "ar" ? "اختر الخدمة التي تريدها" : "Choisissez le service souhaité"} backHref="/" backLabel={lang === "ar" ? "العودة إلى الرئيسية" : "Retour à l'accueil"} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, i) => (
          <Link key={i} href={service.href} className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-spatcha-green/20 hover:-translate-y-1">
            <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <service.icon size={32} />
            </div>
            <h3 className="text-xl font-bold text-spatcha-dark mb-3">{service.title}</h3>
            <p className="text-spatcha-gray leading-relaxed">{service.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-gradient-to-r from-spatcha-green/5 to-green-50 rounded-2xl p-8 border border-spatcha-green/10">
        <div className="flex items-start gap-4 mb-6">
          <Building className="text-spatcha-green mt-1 shrink-0" size={28} />
          <div>
            <h3 className="text-lg font-bold text-spatcha-dark mb-2">{lang === "ar" ? "معلومة مهمة" : "Information"}</h3>
            <p className="text-spatcha-gray leading-relaxed">{t("infoMsg")}</p>
          </div>
        </div>

        <div className="border-t border-spatcha-green/10 pt-6">
          <h3 className="text-lg font-bold text-spatcha-dark mb-4 flex items-center gap-2">
            <Phone size={20} />
            {t("employees")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {EMPLOYES.map((emp) => (
              <div key={emp.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p className="font-bold text-spatcha-dark">{emp.nomComplet}</p>
                <p className="text-sm text-spatcha-gray mt-1">{emp.secteurs.join(" / ")}</p>
                <a href={`tel:${emp.telephone}`} className="inline-flex items-center gap-1.5 text-sm text-spatcha-green font-medium mt-2 hover:underline">
                  <Phone size={14} />
                  {emp.telephone}
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
