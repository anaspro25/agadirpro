import { NextRequest, NextResponse } from "next/server";
import { getDemandeById, updateDemande } from "@/lib/store-unified";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const demande = await getDemandeById(id);
  if (!demande) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
  return NextResponse.json(demande);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateDemande(id, body);
    if (!updated) return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "خطأ في تحديث الطلب" }, { status: 500 });
  }
}
