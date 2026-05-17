import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const connection = await prisma.crmConnection.findFirst({ where: { isActive: true } })
  if (!connection) return NextResponse.json({ mappings: [] })

  const mappings = await prisma.crmFieldMapping.findMany({
    where: { connectionId: connection.id },
    orderBy: [{ entity: "asc" }, { cadicalField: "asc" }],
  })

  return NextResponse.json({ mappings })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const connection = await prisma.crmConnection.findFirst({ where: { isActive: true } })
  if (!connection) return NextResponse.json({ error: "No active connection" }, { status: 404 })

  const mapping = await prisma.crmFieldMapping.upsert({
    where: {
      connectionId_entity_cadicalField: {
        connectionId: connection.id,
        entity: body.entity,
        cadicalField: body.cadicalField,
      },
    },
    update: { crmField: body.crmField, direction: body.direction, transformFn: body.transformFn },
    create: {
      connectionId: connection.id,
      entity: body.entity,
      cadicalField: body.cadicalField,
      crmField: body.crmField,
      direction: body.direction || "both",
      isRequired: body.isRequired || false,
      transformFn: body.transformFn,
    },
  })

  return NextResponse.json({ mapping })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.crmFieldMapping.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
