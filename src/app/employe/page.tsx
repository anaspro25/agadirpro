"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useLang } from "@/lib/LangContext";
import { EMPLOYES } from "@/lib/types";
import PageBanner from "@/components/PageBanner";

export default function EmployeLoginPage() {
  const router = useRouter();
  const { t, lang } = useLang();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError(lang === "ar" ? "يرجى إدخال البريد الإلكتروني وكلمة المرور" : "Veuillez entrer email et mot de passe");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/employe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, motDePasse: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "خطأ");
      localStorage.setItem("employe", JSON.stringify(data.employe));
      router.push("/employe/tableau-de-bord");
    } catch (e: any) {
      setError(e.message || (lang === "ar" ? "معلومات الدخول غير صحيحة" : "Identifiants incorrects"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={lang === "ar" ? "rtl" : "ltr"}>
      <PageBanner title={t("empLoginTitle")} subtitle={t("empLoginDesc")} compact backHref="/" backLabel={lang === "ar" ? "العودة إلى الرئيسية" : "Retour à l'accueil"} />
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-spatcha-green/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-spatcha-green" />
            </div>
            <h1 className="text-2xl font-bold text-spatcha-dark">{t("empLoginTitle")}</h1>
            <p className="text-spatcha-gray mt-2">{t("empLoginDesc")}</p>
          </div>

          {error && (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-sm">
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("email")}</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all" placeholder={lang === "ar" ? "أدخل بريدك الإلكتروني" : "Votre email"} />
            </div>
            <div>
              <label className="block text-sm font-medium text-spatcha-dark mb-2">{t("password")}</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green focus:ring-2 focus:ring-spatcha-green/20 outline-none transition-all" placeholder={lang === "ar" ? "أدخل كلمة المرور" : "Votre mot de passe"} />
            </div>
            <button onClick={handleLogin} disabled={loading} className="w-full bg-spatcha-green text-white py-3.5 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium text-lg disabled:opacity-50">
              {loading ? (lang === "ar" ? "جاري..." : "Connexion...") : t("login")}
            </button>
          </div>

          <div className="mt-6 bg-spatcha-light rounded-xl p-4">
            <p className="text-xs text-spatcha-gray font-medium mb-2">{t("demoCredentials")}</p>
            {[
              { email: "ahmed@spatcha.ma", secteur: "حي الداخلة" },
              { email: "fatima@spatcha.ma", secteur: "حي الداخلة 2 (F1-F20)" },
              { email: "mohamed@spatcha.ma", secteur: "حي القدس + حي الفضية" },
              { email: "saida@spatcha.ma", secteur: "حي الوفاء + المختار السوسي" },
            ].map((emp, i) => (
              <div key={i} className="text-xs text-spatcha-gray mb-1">
                <span className="font-medium">{emp.secteur}:</span> {emp.email} / <span className="font-mono">admin123</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}
