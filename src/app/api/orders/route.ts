import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.userId },
      include: { items: true, address: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { items, address, subtotal, discount, deliveryFee, tax, total, promoCode, paymentMethod } = body;

    if (!items?.length) {
      return NextResponse.json({ error: "Order must have at least one item." }, { status: 400 });
    }

    const order = await prisma.order.create({
      data: {
        userId: session.userId,
        subtotal,
        discount: discount ?? 0,
        deliveryFee: deliveryFee ?? 0,
        tax: tax ?? 0,
        total,
        promoCode,
        paymentMethod,
        items: {
          create: items.map((item: { productId: string; name: string; price: number; quantity: number; image?: string }) => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        },
        ...(address && {
          address: {
            create: {
              label: address.label ?? "Delivery",
              line1: address.line1,
              line2: address.line2,
              city: address.city,
              state: address.state,
              zip: address.zip,
            },
          },
        }),
      },
      include: { items: true, address: true },
    });

    // Award mediCoins (1 coin per $1 spent)
    await prisma.user.update({
      where: { id: session.userId },
      data: { mediCoins: { increment: Math.floor(total) } },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err) {
    console.error("Create order error:", err);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
