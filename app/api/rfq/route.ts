import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { nanoid } from "nanoid" // we'll use a manual approach instead

function generateRFQCode(): string {
  return "RFQ-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 6).toUpperCase()
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where = status ? { status: status as "OPEN" | "CLOSED" | "AWARDED" | "CANCELLED" } : {}

  const [rfqs, total] = await Promise.all([
    prisma.rFQ.findMany({
      where,
      include: {
        _count: { select: { bids: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.rFQ.count({ where }),
  ])

  return NextResponse.json({ rfqs, total })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {
    contactName, contactEmail, contactPhone, organization,
    title, description, category, specifications, quantity,
    targetBudget, currency, deliveryDate, deliveryAddress, closingDate,
  } = body

  if (!contactName || !contactEmail || !title || !quantity) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const rfq = await prisma.rFQ.create({
    data: {
      rfqCode: generateRFQCode(),
      contactName, contactEmail, contactPhone, organization,
      title, description,
      category: category || [],
      specifications, quantity: parseInt(quantity),
      targetBudget: targetBudget ? parseFloat(targetBudget) : null,
      currency: currency || "NGN",
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      deliveryAddress,
      closingDate: closingDate ? new Date(closingDate) : null,
      status: "OPEN",
    },
  })

  return NextResponse.json({ rfq }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, status } = body

  const rfq = await prisma.rFQ.update({
    where: { id },
    data: { status },
  })

  return NextResponse.json({ rfq })
}
