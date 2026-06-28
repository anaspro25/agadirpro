import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getReclamations, addReclamation } from "@/lib/store-unified";
import { StatutReclamation } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secteurs = searchParams.getAll("secteur");
  const cin = searchParams.get("cin");

  let reclamations = await getReclamations();

  if (secteurs.length > 0) {
    reclamations = reclamations.filter((r) => secteurs.includes(r.secteur));
  }

  if (cin) {
    reclamations = reclamations.filter((r) => r.cin === cin);
  }

  return NextResponse.json(reclamations);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const reclamation = {
      id: uuidv4(),
      citoyenId: body.cin,
      nomComplet: body.nomComplet,
      cin: body.cin,
      telephone: body.telephone,
      adresse: body.adresse,
      secteur: body.secteur,
      sujet: body.sujet,
      description: body.description,
      documents: body.documents || [],
      statut: StatutReclamation.MOUDAKHELA,
      dateCreation: new Date().toISOString(),
      dateMiseAJour: new Date().toISOString(),
      latitude: body.latitude || undefined,
      longitude: body.longitude || undefined,
    };
    await addReclamation(reclamation);
    return NextResponse.json(reclamation, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطأ في إنشاء الشكاية" }, { status: 500 });
  }
}
