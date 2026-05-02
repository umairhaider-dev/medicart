import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";
import { randomBytes } from "crypto";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const { status, reviewNotes, rejectionReason } = await req.json();

    const verificationCode =
      status === "VERIFIED"
        ? `RX-${randomBytes(2).toString("hex").toUpperCase()}-${randomBytes(2).toString("hex").toUpperCase()}`
        : undefined;

    const prescription = await prisma.prescription.update({
      where: { id },
      data: {
        status,
        reviewNotes,
        rejectionReason,
        ...(verificationCode && { verificationCode }),
      },
      include: {
        user: { select: { name: true, email: true } },
        medications: true,
      },
    });
    return NextResponse.json({ prescription });
  } catch {
    return NextResponse.json({ error: "Failed to update prescription" }, { status: 500 });
  }
}
