import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getDemandes, addDemande } from "@/lib/store-unified";
import { StatutDemande } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secteurs = searchParams.getAll("secteur");
  const cin = searchParams.get("cin");

  let demandes = await getDemandes();

  if (secteurs.length > 0) {
    demandes = demandes.filter((d) => secteurs.includes(d.secteur));
  }

  if (cin) {
    demandes = demandes.filter((d) => d.cin === cin);
  }

  return NextResponse.json(demandes);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const demande = {
      id: uuidv4(),
      citoyenId: body.cin,
      nomComplet: body.nomComplet,
      cin: body.cin,
      telephone: body.telephone,
      adresse: body.adresse,
      secteur: body.secteur,
      type: body.type,
      statut: StatutDemande.MOUDAKHELA,
      documents: body.documents || [],
      description: body.description || "",
      dateCreation: new Date().toISOString(),
      dateMiseAJour: new Date().toISOString(),
      latitude: body.latitude || undefined,
      longitude: body.longitude || undefined,
    };
    await addDemande(demande);
    return NextResponse.json(demande, { status: 201 });
  } catch {
    return NextResponse.json({ error: "خطأ في إنشاء الطلب" }, { status: 500 });
  }
}
