import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session?.isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 20;

  try {
    const where = status ? { status: status as never } : {};
    const [total, prescriptions] = await Promise.all([
      prisma.prescription.count({ where }),
      prisma.prescription.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          medications: true,
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);
    return NextResponse.json({ prescriptions, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}
