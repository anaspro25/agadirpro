"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Building, Globe } from "lucide-react";
import { useLang } from "@/lib/LangContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { lang, setLang, t } = useLang();

  const toggleLang = () => setLang(lang === "ar" ? "fr" : "ar");

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="bg-spatcha-green text-white p-2.5 rounded-xl">
              <Building size={28} />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-spatcha-green leading-tight">{t("appName")}</h1>
              <p className="text-xs text-spatcha-gray">{t("appSubtitle")}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            <Link href="/" className="px-4 py-2 rounded-lg text-spatcha-dark hover:bg-spatcha-light hover:text-spatcha-green transition-all font-medium">
              {t("home")}
            </Link>
            <Link href="/citoyen" className="px-4 py-2 rounded-lg text-spatcha-dark hover:bg-spatcha-light hover:text-spatcha-green transition-all font-medium">
              {t("services")}
            </Link>
            <Link href="/a-propos" className="px-4 py-2 rounded-lg bg-spatcha-gold/20 text-spatcha-dark hover:bg-spatcha-gold/30 transition-all font-medium border border-spatcha-gold/30">
              {t("about")}
            </Link>
            <Link href="/citoyen/suivi" className="px-4 py-2 rounded-lg text-spatcha-dark hover:bg-spatcha-light hover:text-spatcha-green transition-all font-medium">
              {t("trackRequests")}
            </Link>
            <button onClick={toggleLang} className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-sm font-medium text-spatcha-dark mr-1">
              <Globe size={16} />
              {lang === "ar" ? "FR" : "AR"}
            </button>
            <Link href="/employe" className="px-4 py-2 rounded-lg bg-spatcha-green text-white hover:bg-spatcha-green/90 transition-all font-medium mr-1">
              {t("employee")}
            </Link>
          </nav>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t bg-white" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="px-4 py-3 space-y-2">
            <Link href="/" className="block px-4 py-3 rounded-lg hover:bg-spatcha-light text-spatcha-dark font-medium" onClick={() => setMenuOpen(false)}>
              {t("home")}
            </Link>
            <Link href="/citoyen" className="block px-4 py-3 rounded-lg hover:bg-spatcha-light text-spatcha-dark font-medium" onClick={() => setMenuOpen(false)}>
              {t("services")}
            </Link>
            <Link href="/a-propos" className="block px-4 py-3 rounded-lg bg-spatcha-gold/20 text-spatcha-dark font-medium border border-spatcha-gold/30" onClick={() => setMenuOpen(false)}>
              {t("about")}
            </Link>
            <Link href="/citoyen/suivi" className="block px-4 py-3 rounded-lg hover:bg-spatcha-light text-spatcha-dark font-medium" onClick={() => setMenuOpen(false)}>
              {t("trackRequests")}
            </Link>
            <button onClick={toggleLang} className="block w-full text-right px-4 py-3 rounded-lg hover:bg-spatcha-light text-spatcha-dark font-medium border border-gray-200">
              <Globe size={16} className="inline ml-1" />
              {lang === "ar" ? "Français" : "العربية"}
            </button>
            <Link href="/employe" className="block px-4 py-3 rounded-lg bg-spatcha-green text-white text-center font-medium" onClick={() => setMenuOpen(false)}>
              {t("employee")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
