import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  const connection = await prisma.crmConnection.findFirst({
    where: { isActive: true },
    include: {
      _count: { select: { syncLogs: true, failedJobs: true, fieldMappings: true, automationRules: true } },
    },
  })
  return NextResponse.json({ connection })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { provider, clientId, clientSecret, redirectUri, organizationId } = body

  if (!provider || !clientId || !clientSecret || !redirectUri) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  await prisma.crmConnection.updateMany({ data: { isActive: false } })

  const connection = await prisma.crmConnection.create({
    data: { provider, clientId, clientSecret, redirectUri, organizationId, isActive: true },
  })

  return NextResponse.json({ connection })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...data } = body

  const connection = await prisma.crmConnection.update({
    where: { id },
    data,
  })

  return NextResponse.json({ connection })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 })

  await prisma.crmConnection.update({
    where: { id },
    data: { isConnected: false, isActive: false, accessToken: null, refreshToken: null },
  })

  return NextResponse.json({ success: true })
}
