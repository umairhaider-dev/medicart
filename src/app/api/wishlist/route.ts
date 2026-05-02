import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ items: [] });

  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: session.userId },
      include: { product: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items: items.map((i) => i.product) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { productId } = await req.json();

    const existing = await prisma.wishlistItem.findUnique({
      where: { userId_productId: { userId: session.userId, productId } },
    });

    if (existing) {
      await prisma.wishlistItem.delete({ where: { id: existing.id } });
      return NextResponse.json({ added: false });
    }

    await prisma.wishlistItem.create({ data: { userId: session.userId, productId } });
    return NextResponse.json({ added: true }, { status: 201 });
  } catch (err) {
    console.error("Wishlist toggle error:", err);
    return NextResponse.json({ error: "Failed to update wishlist" }, { status: 500 });
  }
}
