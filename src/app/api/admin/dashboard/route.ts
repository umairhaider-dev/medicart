import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const [totalOrders, totalUsers, pendingRx, products, recentOrders, revenue] = await Promise.all([
      prisma.order.count(),
      prisma.user.count({ where: { isAdmin: false } }),
      prisma.prescription.count({ where: { status: "PENDING" } }),
      prisma.product.count(),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } }, items: true },
      }),
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { total: true },
      }),
    ]);

    const monthlyRevenue = await prisma.order.groupBy({
      by: ["createdAt"],
      where: {
        status: { not: "CANCELLED" },
        createdAt: { gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000) },
      },
      _sum: { total: true },
    });

    return NextResponse.json({
      stats: {
        totalOrders,
        totalUsers,
        pendingRx,
        totalProducts: products,
        totalRevenue: revenue._sum.total ?? 0,
      },
      recentOrders,
      monthlyRevenue,
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    return NextResponse.json({ error: "Failed to load dashboard" }, { status: 500 });
  }
}
