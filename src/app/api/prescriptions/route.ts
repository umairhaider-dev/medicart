import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionFromRequest } from "@/lib/auth";

export async function GET(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const prescriptions = await prisma.prescription.findMany({
      where: { userId: session.userId },
      include: { medications: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ prescriptions });
  } catch {
    return NextResponse.json({ error: "Failed to fetch prescriptions" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { patientName, doctorName, hospital, issueDate, notes, fileName, fileUrl, medications } = body;

    if (!patientName || !fileName) {
      return NextResponse.json({ error: "Patient name and file are required." }, { status: 400 });
    }

    const prescription = await prisma.prescription.create({
      data: {
        userId: session.userId,
        patientName,
        doctorName,
        hospital,
        issueDate,
        notes,
        fileName,
        fileUrl,
        medications: {
          create: (medications ?? []).map((m: { name: string; dosage?: string; duration?: string; instructions?: string }) => ({
            name: m.name,
            dosage: m.dosage,
            duration: m.duration,
            instructions: m.instructions,
          })),
        },
      },
      include: { medications: true },
    });
    return NextResponse.json({ prescription }, { status: 201 });
  } catch (err) {
    console.error("Prescription upload error:", err);
    return NextResponse.json({ error: "Failed to upload prescription" }, { status: 500 });
  }
}
