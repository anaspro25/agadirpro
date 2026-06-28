import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx";
import { getCitoyens, addCitoyens } from "@/lib/store-unified";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "لا يوجد ملف" }, { status: 400 });

    const bytes = await file.arrayBuffer();
    const workbook = XLSX.read(bytes, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet, { defval: "" });

    if (rows.length === 0) return NextResponse.json({ error: "الملف فارغ" }, { status: 400 });

    const existing = await getCitoyens();
    const existingCins = new Set(existing.map((c) => c.cin));
    let imported = 0;
    let skipped = 0;
    const citoyens: any[] = [];

    const colMap = findColumns(rows[0]);

    for (const row of rows) {
      const cin = String(row[colMap.cin] || "").trim();
      if (!cin) { skipped++; continue; }
      if (existingCins.has(cin)) { skipped++; continue; }

      citoyens.push({
        id: uuidv4(),
        cin,
        nomComplet: String(row[colMap.nom] || "").trim() || `مواطن ${cin}`,
        telephone: String(row[colMap.telephone] || "").trim(),
        adresse: String(row[colMap.adresse] || "").trim(),
        secteur: String(row[colMap.secteur] || "").trim(),
        dateNaissance: String(row[colMap.dateNaissance] || "").trim(),
        lieuNaissance: String(row[colMap.lieuNaissance] || "").trim(),
        profession: String(row[colMap.profession] || "").trim(),
        sexe: String(row[colMap.sexe] || "").trim(),
        notes: "",
      });
      existingCins.add(cin);
      imported++;
    }

    if (citoyens.length > 0) addCitoyens(citoyens);

    return NextResponse.json({
      imported,
      skipped,
      total: rows.length,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "خطأ في المعالجة" }, { status: 500 });
  }
}

function findColumns(row: any): Record<string, string> {
  const keys = Object.keys(row);
  const toLower = (s: string) => s.trim().toLowerCase().replace(/[\s_\-]/g, "");

  const findKey = (patterns: string[]): string => {
    for (const p of patterns) {
      const found = keys.find((k) => toLower(k).includes(toLower(p)));
      if (found) return found;
    }
    return keys[0];
  };

  return {
    cin: findKey(["cin", "c.i.n", "carte", "بطاقة", "رقم"]),
    nom: findKey(["nom", "name", "اسم", "الاسم", "fullname", "nomcomplet"]),
    telephone: findKey(["tel", "phone", "mobile", "هاتف", "موبايل", "تلفون"]),
    adresse: findKey(["adresse", "address", "عنوان", "adr"]),
    secteur: findKey(["secteur", "sector", "district", "quartier", "حي", "قطاع"]),
    dateNaissance: findKey(["date", "naissance", "birth", "born", "تاريخ", "الميلاد", "ميلاد"]),
    lieuNaissance: findKey(["lieu", "place", "مكان", "الميلاد", "الولادة"]),
    profession: findKey(["profession", "job", "work", "مهنة", "وظيفة", "prof"]),
    sexe: findKey(["sexe", "sex", "gender", "جنس", "نوع"]),
  };
}
