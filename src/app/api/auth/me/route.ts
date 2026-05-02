import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest, mapUser } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ user: null }, { status: 401 });

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      include: { addresses: true },
    });
    if (!user) return NextResponse.json({ user: null }, { status: 401 });
    return NextResponse.json({ user: mapUser(user) });
  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
