import { NextResponse } from "next/server";
import { toggleLawFirmStatus } from "@/lib/services/law-firm";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const lawFirm = await toggleLawFirmStatus((await params).id);
    return NextResponse.json(lawFirm);
  } catch (error) {
    return NextResponse.json({ error: "Failed to toggle law firm status" }, { status: 500 });
  }
}
