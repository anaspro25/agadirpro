"use client";

import { useLang } from "@/lib/LangContext";

export default function Footer() {
  const { t, lang } = useLang();

  return (
    <footer className="bg-spatcha-dark text-white">
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${lang === "ar" ? "rtl" : "ltr"}`}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">{t("appName")} - Agadir</h3>
            <p className="text-gray-300 leading-relaxed text-sm">
              {t("heroDesc")}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{t("footerQuickLinks")}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href="/" className="hover:text-white transition-colors">{t("home")}</a></li>
              <li><a href="/citoyen" className="hover:text-white transition-colors">{t("services")}</a></li>
              <li><a href="/a-propos" className="hover:text-white transition-colors">{t("about")}</a></li>
              <li><a href="/citoyen/suivi" className="hover:text-white transition-colors">{t("trackRequests")}</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">{t("footerContact")}</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>{t("footerPhone")}: 0522XXXXXX</li>
              <li>{t("footerEmail")}: contact@spatcha.ma</li>
              <li>{t("footerAddress")}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} {t("footerRights")} - {t("appName")}
        </div>
      </div>
    </footer>
  );
}
