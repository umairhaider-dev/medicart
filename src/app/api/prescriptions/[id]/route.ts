import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    const prescription = await prisma.prescription.findFirst({
      where: { id, userId: session.userId },
      include: { medications: true },
    });
    if (!prescription) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ prescription });
  } catch {
    return NextResponse.json({ error: "Failed to fetch prescription" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await params;
    await prisma.prescription.deleteMany({ where: { id, userId: session.userId } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete prescription" }, { status: 500 });
  }
}
