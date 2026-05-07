
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

// CREATE institution
export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const institution = await prisma.institution.create({
  data: {
    ...body,
    passwordHash: await bcrypt.hash(body.password, 10),

    documents: {
      create: body.documents || [],
    },
  },
  include: {
    documents: true,
  },
});

    return Response.json(institution, { status: 201 });
  } catch (err) {
    return Response.json({ error: "Failed to create institution" }, { status: 500 });
  }
}

// GET all institutions
export async function GET() {
  const institutions = await prisma.institution.findMany({
    include: { documents: true },
    orderBy: { createdAt: "desc" },
  });

  return Response.json(institutions);
}