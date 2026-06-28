import { NextRequest, NextResponse } from "next/server";
import { EMPLOYES } from "@/lib/types";

export async function POST(request: NextRequest) {
  try {
    const { email, motDePasse } = await request.json();
    const employe = EMPLOYES.find((e) => e.email === email && e.motDePasse === motDePasse);
    if (!employe) {
      return NextResponse.json({ error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" }, { status: 401 });
    }
    const { motDePasse: _, ...safe } = employe;
    return NextResponse.json({ employe: safe });
  } catch {
    return NextResponse.json({ error: "خطأ في الخادم" }, { status: 500 });
  }
}
