"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { FileText, MessageSquare, Clock, User, Phone, MapPin, CreditCard, FileImage, CheckCircle, Share2 } from "lucide-react";
import PageBanner from "@/components/PageBanner";
import { useLang } from "@/lib/LangContext";
import { SECTEUR_LOCATIONS } from "@/lib/types";
import LocationMap from "@/components/LocationMap";

interface DetailData {
  type: "demande" | "reclamation";
  id: string;
  nomComplet: string;
  cin: string;
  telephone: string;
  adresse: string;
  secteur: string;
  statut: string;
  dateCreation: string;
  description?: string;
  documents?: { nom: string; type: string; dataUrl: string }[];
  sujet?: string;
  reponse?: string;
  latitude?: number;
  longitude?: number;
}

const statutColors: Record<string, string> = {
  "موداخلة": "bg-blue-100 text-blue-700",
  "قيد الدراسة": "bg-amber-100 text-amber-700",
  "مولجة": "bg-purple-100 text-purple-700",
  "معاملة": "bg-indigo-100 text-indigo-700",
  "معالجة": "bg-indigo-100 text-indigo-700",
  "متم": "bg-green-100 text-green-700",
  "مرفوضة": "bg-red-100 text-red-700",
};

export default function DemandeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = useLang();
  const [data, setData] = useState<DetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [newStatut, setNewStatut] = useState("");
  const [reponse, setReponse] = useState("");
  const [employeSession, setEmployeSession] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem("employe");
    if (!stored) { router.push("/employe"); return; }
    setEmployeSession(JSON.parse(stored));
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [demandeRes, reclamationRes] = await Promise.all([
        fetch(`/api/demandes/${params.id}`),
        fetch(`/api/reclamations/${params.id}`),
      ]);
      const demande = demandeRes.ok ? await demandeRes.json() : null;
      const reclamation = reclamationRes.ok ? await reclamationRes.json() : null;

      if (demande) {
        setData({ ...demande, type: "demande" });
        setNewStatut(demande.statut);
      } else if (reclamation) {
        setData({ ...reclamation, type: "reclamation" });
        setNewStatut(reclamation.statut);
        setReponse(reclamation.reponse || "");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const updateStatut = async () => {
    if (!data) return;
    const endpoint = data.type === "demande" ? `/api/demandes/${data.id}` : `/api/reclamations/${data.id}`;
    const body: any = { statut: newStatut };
    if (data.type === "reclamation") body.reponse = reponse;
    try {
      await fetch(endpoint, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      router.push("/employe/tableau-de-bord");
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="rtl"><PageBanner title="..." compact /><div className="max-w-3xl mx-auto px-4 py-12 text-center text-spatcha-gray">جاري التحميل...</div></div>;
  if (!data) return <div className="rtl"><PageBanner title="..." compact /><div className="max-w-3xl mx-auto px-4 py-12 text-center">الطلب غير موجود</div></div>;

  return (
    <div className="rtl">
      <PageBanner title={data.type === "demande" ? "طلب شهادة" : "شكاية"} subtitle={data.type === "demande" ? data.description : data.sujet} compact backHref="/employe/tableau-de-bord" backLabel="العودة إلى اللوحة" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="flex items-start gap-4 mb-6">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${data.type === "demande" ? "bg-blue-50" : "bg-amber-50"}`}>
            {data.type === "demande" ? <FileText size={28} className="text-blue-600" /> : <MessageSquare size={28} className="text-amber-600" />}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-spatcha-dark">{data.type === "demande" ? "طلب شهادة" : "شكاية"}</h1>
            <p className="text-spatcha-gray">{data.type === "demande" ? data.description : data.sujet}</p>
          </div>
          <span className={`mr-auto text-sm px-3 py-1.5 rounded-full font-medium ${statutColors[data.statut] || "bg-gray-100"}`}>{data.statut}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InfoItem icon={User} label="الاسم الكامل" value={data.nomComplet} />
          <InfoItem icon={CreditCard} label="رقم البطاقة" value={data.cin} />
          <InfoItem icon={Phone} label="الهاتف" value={data.telephone} />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
              <MapPin size={18} className="text-spatcha-gray" />
            </div>
            <div>
              <p className="text-xs text-spatcha-gray">الحي</p>
              <a href={SECTEUR_LOCATIONS[data.secteur]} target="_blank" rel="noopener noreferrer" className="font-medium text-spatcha-dark hover:text-spatcha-green transition-all underline underline-offset-2 decoration-dotted">
                {data.secteur}
              </a>
            </div>
          </div>
          <div className="md:col-span-2">
            <InfoItem icon={MapPin} label="العنوان" value={data.adresse} />
          </div>
          <InfoItem icon={Clock} label="تاريخ التقديم" value={new Date(data.dateCreation).toLocaleDateString("ar-MA")} />
        </div>

        {/* Citizen Location */}
        {data.latitude && data.longitude && (
          <LocationMap latitude={data.latitude} longitude={data.longitude} label={data.nomComplet} />
        )}

        {/* Certificate actions for completed demands */}
        {data.type === "demande" && data.statut === "متم" && (
          <div className="mb-8 border-2 border-spatcha-green/20 rounded-2xl p-6 bg-gradient-to-br from-green-50 to-white">
            <div className="text-center mb-4">
              <h3 className="font-bold text-spatcha-dark text-lg flex items-center justify-center gap-2">
                <CheckCircle size={20} className="text-green-600" />
                {lang === "ar" ? "الشهادة الإلكترونية" : "Certificat électronique"}
              </h3>
              <p className="text-sm text-spatcha-gray mt-1">
                {lang === "ar" ? "تمت معالجة الطلب بنجاح. يمكنكم عرض الشهادة أو إرسالها للمعني(ة) بالأمر." : "La demande a été traitée. Vous pouvez visualiser ou envoyer le certificat."}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href={`/employe/tableau-de-bord/demande/${data.id}/certificat`} className="flex items-center gap-2 px-6 py-3 bg-spatcha-green text-white rounded-xl hover:bg-spatcha-green/90 transition-all font-medium">
                <FileText size={18} />
                {lang === "ar" ? "عرض الشهادة" : "Voir le certificat"}
              </Link>
              <Link href={`/employe/tableau-de-bord/demande/${data.id}/certificat`} className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-medium">
                <Share2 size={18} />
                {lang === "ar" ? "إرسال عبر واتساب" : "Envoyer via WhatsApp"}
              </Link>
            </div>
          </div>
        )}

        {data.documents && data.documents.length > 0 && (
          <div className="mb-8">
            <h3 className="font-bold text-spatcha-dark mb-4 flex items-center gap-2">
              <FileImage size={18} />
              الوثائق المرفقة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.documents.map((doc, i) => (
                <a key={i} href={doc.dataUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all border border-gray-100">
                  <FileText size={18} className="text-spatcha-green" />
                  <span className="text-sm text-spatcha-dark truncate">{doc.nom}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-6">
          <h3 className="font-bold text-spatcha-dark mb-4">تحديث حالة الطلب</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            <select value={newStatut} onChange={(e) => setNewStatut(e.target.value)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 bg-white focus:border-spatcha-green outline-none">
              {["موداخلة", "قيد الدراسة", "مولجة", "معاملة", "معالجة", "متم", "مرفوضة"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={updateStatut} className="bg-spatcha-green text-white px-8 py-3 rounded-xl hover:bg-spatcha-green/90 transition-all font-medium whitespace-nowrap">
              حفظ التغييرات
            </button>
          </div>
          {data.type === "reclamation" && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-spatcha-dark mb-2">الرد على الشكاية</label>
              <textarea value={reponse} onChange={(e) => setReponse(e.target.value)} rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-spatcha-green outline-none resize-none" placeholder="اكتب ردك على الشكاية..." />
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
        <Icon size={18} className="text-spatcha-gray" />
      </div>
      <div>
        <p className="text-xs text-spatcha-gray">{label}</p>
        <p className="font-medium text-spatcha-dark">{value}</p>
      </div>
    </div>
  );
}
