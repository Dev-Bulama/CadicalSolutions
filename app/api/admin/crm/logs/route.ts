import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "50")
  const entity = searchParams.get("entity")
  const status = searchParams.get("status")

  const connection = await prisma.crmConnection.findFirst({ where: { isActive: true } })
  if (!connection) return NextResponse.json({ logs: [], total: 0 })

  const where = {
    connectionId: connection.id,
    ...(entity ? { entity } : {}),
    ...(status ? { status } : {}),
  }

  const [logs, total] = await Promise.all([
    prisma.crmSyncLog.findMany({
      where,
      orderBy: { startedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.crmSyncLog.count({ where }),
  ])

  return NextResponse.json({ logs, total, page, limit })
}
