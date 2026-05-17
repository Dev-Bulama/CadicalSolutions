import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const payload = await req.json().catch(() => ({}))
  const event = req.headers.get("x-crm-event") || payload?.event || "unknown"

  const connection = await prisma.crmConnection.findFirst({ where: { isActive: true } })

  if (!connection) {
    return NextResponse.json({ received: false }, { status: 404 })
  }

  await prisma.crmWebhookLog.create({
    data: {
      connectionId: connection.id,
      event,
      payload,
      status: "received",
    },
  })

  // Process known events
  try {
    if (event === "deal.stage_changed" || event === "zoho.deal.update") {
      const dealId = payload?.data?.id
      const newStage = payload?.data?.Stage
      if (dealId && newStage) {
        // Future: map back to Cadical order status
      }
    }

    await prisma.crmWebhookLog.updateMany({
      where: { connectionId: connection.id, event, status: "received" },
      data: { status: "processed" },
    })
  } catch (err) {
    await prisma.crmWebhookLog.updateMany({
      where: { connectionId: connection.id, event },
      data: {
        status: "failed",
        errorMessage: err instanceof Error ? err.message : "Processing error",
      },
    })
  }

  return NextResponse.json({ received: true })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "50")

  const connection = await prisma.crmConnection.findFirst({ where: { isActive: true } })
  if (!connection) return NextResponse.json({ logs: [], total: 0 })

  const [logs, total] = await Promise.all([
    prisma.crmWebhookLog.findMany({
      where: { connectionId: connection.id },
      orderBy: { receivedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.crmWebhookLog.count({ where: { connectionId: connection.id } }),
  ])

  return NextResponse.json({ logs, total })
}
