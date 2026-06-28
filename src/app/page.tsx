"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { FileText, MessageSquare, Search, Users, Building, ArrowLeft, Shield, CheckCircle, Phone, MapPin, User } from "lucide-react";
import { EMPLOYES, SECTEURS } from "@/lib/types";
import { useLang } from "@/lib/LangContext";
import SectorMap from "@/components/SectorMap";

export default function Home() {
  const { t, lang } = useLang();
  const [mapSecteur, setMapSecteur] = useState<string | null>(null);

  const services = [
    { icon: FileText, title: t("requestCert"), desc: t("requestCertDesc"), href: "/citoyen/demande", color: "bg-blue-50 text-blue-600" },
    { icon: MessageSquare, title: t("complaint"), desc: t("complaintDesc"), href: "/citoyen/reclamation", color: "bg-amber-50 text-amber-600" },
    { icon: Phone, title: t("aawan"), desc: t("aawanDesc"), href: "/citoyen/aawan-solta", color: "bg-purple-50 text-purple-600" },
    { icon: Search, title: t("trackTitle"), desc: t("trackDesc"), href: "/citoyen/suivi", color: "bg-green-50 text-green-600" },
  ];

  return (
    <div className={lang === "ar" ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="relative bg-spatcha-green text-white overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/background.jpg')" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-spatcha-green/70 via-spatcha-green/60 to-green-900/80" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl opacity-10" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-spatcha-gold rounded-full blur-3xl opacity-10" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-32 h-32 md:w-48 md:h-48 relative shrink-0 order-1 md:order-2">
              <Image src="/images/coat_of_arms_of_morocco.svg" alt="Coat of Arms of Morocco" fill className="object-contain drop-shadow-lg" />
            </div>
            <div className={`flex-1 text-center ${lang === "ar" ? "md:text-right" : "md:text-left"} order-2 md:order-1`}>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-6">
                <Shield size={16} />
                <span>{t("heroBadge")}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                {t("heroTitle1")}
                <br />
                <span className="text-spatcha-gold">{t("heroTitle2")}</span>
                <br />
                {t("heroTitle3")}
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto md:mx-0 mb-8 leading-relaxed">
                {t("heroDesc")}
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 justify-center ${lang === "ar" ? "md:justify-start" : "md:justify-start"}`}>
                <Link href="/citoyen/demande" className="inline-flex items-center justify-center gap-2 bg-spatcha-gold text-spatcha-dark font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all shadow-lg shadow-black/20 text-lg">
                  {t("startNow")}
                  <ArrowLeft size={20} className={lang === "fr" ? "rotate-180" : ""} />
                </Link>
                <Link href="/citoyen" className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white font-medium px-8 py-4 rounded-xl hover:bg-white/30 transition-all border border-white/30 text-lg">
                  {t("browseServices")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* أعوان السلطة */}
      <section className={`bg-white py-12 border-b border-gray-100 ${lang === "ar" ? "rtl" : "ltr"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-spatcha-dark mb-4 flex items-center gap-2">
                <Phone size={22} className="text-spatcha-green" />
                {t("employees")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EMPLOYES.map((emp) => (
                  <div key={emp.id} className="flex items-center justify-between bg-spatcha-light rounded-xl p-3 hover:shadow-sm transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-spatcha-green/10 rounded-xl flex items-center justify-center">
                        <User size={18} className="text-spatcha-green" />
                      </div>
                      <div>
                        <p className="font-bold text-spatcha-dark text-sm">{emp.nomComplet}</p>
                        <p className="text-xs text-spatcha-gray">{emp.secteurs.join(" / ")}</p>
                      </div>
                    </div>
                    <a href={`tel:${emp.telephone}`} className="text-spatcha-green font-bold text-xs hover:underline shrink-0" dir="ltr">{emp.telephone}</a>
                  </div>
                ))}
              </div>
            </div>
            <div className="shrink-0 text-center md:text-right">
              <h3 className="text-xl font-bold text-spatcha-dark mb-4 flex items-center gap-2 justify-center md:justify-end">
                <MapPin size={22} className="text-spatcha-green" />
                {t("neighborhoods")}
              </h3>
              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                {SECTEURS.map((s) => (
                  <button key={s} onClick={() => setMapSecteur(s)} className="text-sm bg-green-50 text-spatcha-green px-3 py-1.5 rounded-full font-medium flex items-center gap-1 hover:bg-green-100 transition-all cursor-pointer">
                    <MapPin size={12} />
                    {s}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex gap-2 flex-wrap justify-center md:justify-end">
                <span className="text-xs bg-spatcha-green/10 text-spatcha-green px-3 py-1 rounded-full">1000+ {lang === "ar" ? "طلب" : "demandes"}</span>
                <span className="text-xs bg-spatcha-green/10 text-spatcha-green px-3 py-1 rounded-full">98% {lang === "ar" ? "رضا" : "satisfaction"}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className={`py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${lang === "ar" ? "rtl" : "ltr"}`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-spatcha-dark mb-4">{t("serviceTitle")}</h2>
          <p className="text-spatcha-gray max-w-2xl mx-auto text-lg">{t("serviceSubtitle")}</p>
        </div>
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
      </section>

      {/* How it works */}
      <section className={`py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ${lang === "ar" ? "rtl" : "ltr"}`}>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-spatcha-dark mb-4">{t("howTitle")}</h2>
          <p className="text-spatcha-gray max-w-2xl mx-auto text-lg">{t("howSubtitle")}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", titleKey: "step1", descKey: "step1Desc" },
            { step: "02", titleKey: "step2", descKey: "step2Desc" },
            { step: "03", titleKey: "step3", descKey: "step3Desc" },
            { step: "04", titleKey: "step4", descKey: "step4Desc" },
          ].map((item, i) => (
            <div key={i} className="text-center">
              <div className="w-16 h-16 bg-spatcha-green/10 text-spatcha-green rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">{item.step}</div>
              <h3 className="text-lg font-bold text-spatcha-dark mb-2">{t(item.titleKey)}</h3>
              <p className="text-spatcha-gray text-sm leading-relaxed">{t(item.descKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Employee CTA */}
      <section className="bg-spatcha-dark py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t("empCtaTitle")}</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">{t("empCtaDesc")}</p>
          <Link href="/employe" className="inline-flex items-center gap-2 bg-spatcha-gold text-spatcha-dark font-bold px-8 py-4 rounded-xl hover:bg-yellow-400 transition-all">
            {t("empLogin")}
            <ArrowLeft size={20} className={lang === "fr" ? "rotate-180" : ""} />
          </Link>
        </div>
      </section>

      {mapSecteur && <SectorMap secteur={mapSecteur} onClose={() => setMapSecteur(null)} />}
    </div>
  );
}
