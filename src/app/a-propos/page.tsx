"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Building, Users, FileText, Shield, MapPin, AlertTriangle, Vote, Leaf, Laptop } from "lucide-react";
import { useLang } from "@/lib/LangContext";
import PageBanner from "@/components/PageBanner";

const articles = [
  { key: "1", icon: Building, color: "bg-blue-50 text-blue-600" },
  { key: "2", icon: Users, color: "bg-green-50 text-green-600" },
  { key: "3", icon: FileText, color: "bg-amber-50 text-amber-600" },
  { key: "4", icon: Shield, color: "bg-purple-50 text-purple-600" },
  { key: "5", icon: MapPin, color: "bg-red-50 text-red-600" },
  { key: "6", icon: AlertTriangle, color: "bg-orange-50 text-orange-600" },
  { key: "8", icon: Vote, color: "bg-teal-50 text-teal-600" },
  { key: "9", icon: Leaf, color: "bg-emerald-50 text-emerald-600" },
  { key: "10", icon: Laptop, color: "bg-sky-50 text-sky-600" },
];

function AccordionItem({ articleKey, icon: Icon, color, lang, t, isOpen, onToggle }: {
  articleKey: string; icon: React.ElementType; color: string; lang: string; t: (s: string) => string; isOpen: boolean; onToggle: () => void;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all ${isOpen ? "shadow-md" : "hover:shadow-md"}`}>
      <button onClick={onToggle} className="w-full p-5 md:p-6 flex items-center gap-4 text-right" dir={lang === "ar" ? "rtl" : "ltr"}>
        <div className={`p-3 rounded-xl ${color} shrink-0`}>
          <Icon size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-spatcha-dark">{t(`article${articleKey}Title`)}</h3>
        </div>
        <div className="text-spatcha-gray shrink-0">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-5 md:px-6 pb-5 md:pb-6" dir={lang === "ar" ? "rtl" : "ltr"}>
          <div className="border-t border-gray-100 pt-4">
            <p className="text-spatcha-gray leading-relaxed text-[15px]">{t(`article${articleKey}Content`)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function APropos() {
  const { t, lang } = useLang();
  const [openArticle, setOpenArticle] = useState<string | null>("1");

  return (
    <div className={lang === "ar" ? "rtl" : "ltr"}>
      <PageBanner title={t("aboutTitle")} subtitle={t("aboutSubtitle")} badge={t("heroBadge")} />

      {/* Articles */}
      <section className="py-12 md:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          {articles.map(({ key, icon, color }) => (
            <AccordionItem
              key={key}
              articleKey={key}
              icon={icon}
              color={color}
              lang={lang}
              t={t}
              isOpen={openArticle === key}
              onToggle={() => setOpenArticle(openArticle === key ? null : key)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
