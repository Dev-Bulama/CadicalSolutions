import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { rfqId, supplierId, unitPrice, totalPrice, leadTimeDays, notes } = body

  if (!rfqId || !supplierId || !unitPrice || !totalPrice || !leadTimeDays) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const rfq = await prisma.rFQ.findUnique({ where: { id: rfqId } })
  if (!rfq || rfq.status !== "OPEN") {
    return NextResponse.json({ error: "RFQ is not open for bids" }, { status: 400 })
  }

  const bid = await prisma.rFQBid.upsert({
    where: { rfqId_supplierId: { rfqId, supplierId } },
    update: { unitPrice, totalPrice, leadTimeDays, notes },
    create: { rfqId, supplierId, unitPrice, totalPrice, leadTimeDays, notes },
  })

  return NextResponse.json({ bid })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const rfqId = searchParams.get("rfqId")

  if (!rfqId) return NextResponse.json({ error: "rfqId required" }, { status: 400 })

  const bids = await prisma.rFQBid.findMany({
    where: { rfqId },
    include: { supplier: { select: { companyName: true, email: true, rating: true, deliveryScore: true } } },
    orderBy: { totalPrice: "asc" },
  })

  return NextResponse.json({ bids })
}
