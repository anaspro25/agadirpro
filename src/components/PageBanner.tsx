"use client";

import Image from "next/image";
import { Shield } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageBannerProps {
  title: string;
  subtitle?: string;
  badge?: string;
  backHref?: string;
  backLabel?: string;
  compact?: boolean;
}

export default function PageBanner({ title, subtitle, badge, backHref, backLabel, compact }: PageBannerProps) {
  const { t, lang } = useLang();

  return (
    <section className={`relative bg-spatcha-green text-white overflow-hidden ${compact ? "py-8 md:py-12" : "py-12 md:py-20"}`}>
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/background.jpg')" }} />
      <div className="absolute inset-0 bg-gradient-to-b from-spatcha-green/70 via-spatcha-green/60 to-green-900/80" />
      <div className="absolute inset-0">
        <div className={`absolute top-10 ${lang === "ar" ? "right-10" : "left-10"} w-72 h-72 bg-white rounded-full blur-3xl opacity-10`} />
        <div className={`absolute bottom-10 ${lang === "ar" ? "left-10" : "right-10"} w-96 h-96 bg-spatcha-gold rounded-full blur-3xl opacity-10`} />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {backHref && (
          <Link href={backHref} className={`inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm mb-4 ${lang === "fr" ? "flex-row-reverse" : ""}`}>
            <ArrowLeft size={16} className={lang === "fr" ? "rotate-180" : ""} />
            {backLabel || (lang === "ar" ? "العودة" : "Retour")}
          </Link>
        )}
        <div className={`flex flex-col md:flex-row items-center gap-4 md:gap-6 ${backHref ? "" : "pt-4"}`}>
          <div className={`${compact ? "w-16 h-16 md:w-20 md:h-20" : "w-28 h-28 md:w-40 md:h-40"} relative shrink-0`}>
            <Image src="/images/coat_of_arms_of_morocco.svg" alt="Coat of Arms of Morocco" fill className="object-contain drop-shadow-lg" />
          </div>
          <div className={`text-center ${lang === "ar" ? "md:text-right" : "md:text-left"} flex-1`}>
            {badge && (
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm mb-3">
                <Shield size={16} />
                <span>{badge}</span>
              </div>
            )}
            <h1 className={`font-bold leading-tight text-white ${compact ? "text-xl md:text-2xl" : "text-2xl md:text-3xl lg:text-4xl"}`}>{title}</h1>
            {subtitle && <p className={`text-white/80 leading-relaxed mt-2 ${compact ? "text-sm" : "text-base md:text-lg"}`}>{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  );
}
