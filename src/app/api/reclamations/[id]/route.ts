import { NextRequest, NextResponse } from "next/server";
import { getReclamationById, updateReclamation } from "@/lib/store-unified";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reclamation = await getReclamationById(id);
  if (!reclamation) return NextResponse.json({ error: "الشكاية غير موجودة" }, { status: 404 });
  return NextResponse.json(reclamation);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updateReclamation(id, body);
    if (!updated) return NextResponse.json({ error: "الشكاية غير موجودة" }, { status: 404 });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "خطأ في تحديث الشكاية" }, { status: 500 });
  }
}
