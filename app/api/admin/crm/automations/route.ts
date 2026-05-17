import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const connection = await prisma.crmConnection.findFirst({ where: { isActive: true } })
  if (!connection) return NextResponse.json({ rules: [] })

  const rules = await prisma.crmAutomationRule.findMany({
    where: { connectionId: connection.id },
    orderBy: { createdAt: "desc" },
  })

  return NextResponse.json({ rules })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const connection = await prisma.crmConnection.findFirst({ where: { isActive: true } })
  if (!connection) return NextResponse.json({ error: "No active connection" }, { status: 404 })

  const rule = await prisma.crmAutomationRule.create({
    data: {
      connectionId: connection.id,
      name: body.name,
      description: body.description,
      triggerEvent: body.triggerEvent,
      triggerConfig: body.triggerConfig,
      actionType: body.actionType,
      actionConfig: body.actionConfig,
      isActive: body.isActive ?? true,
    },
  })

  return NextResponse.json({ rule })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...data } = body

  const rule = await prisma.crmAutomationRule.update({ where: { id }, data })
  return NextResponse.json({ rule })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.crmAutomationRule.delete({ where: { id } })
  return NextResponse.json({ success: true })
}
