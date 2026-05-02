import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function DELETE(req: Request, { params }: { params: Promise<{ productId: string }> }) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { productId } = await params;
    await prisma.wishlistItem.deleteMany({
      where: { userId: session.userId, productId },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
