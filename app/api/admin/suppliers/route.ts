import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where = status ? { status: status as "PENDING" | "APPROVED" | "REJECTED" | "SUSPENDED" } : {}

  const [suppliers, total] = await Promise.all([
    prisma.supplier.findMany({
      where,
      include: {
        _count: { select: { products: true, rfqBids: true, bulkOrders: true, documents: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.supplier.count({ where }),
  ])

  return NextResponse.json({ suppliers, total, page, limit })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, status, ...rest } = body

  const data: Record<string, unknown> = { ...rest }
  if (status) {
    data.status = status
    if (status === "APPROVED") {
      data.isActive = true
      data.verifiedAt = new Date()
    } else if (status === "REJECTED" || status === "SUSPENDED") {
      data.isActive = false
    }
  }

  const supplier = await prisma.supplier.update({ where: { id }, data })
  return NextResponse.json({ supplier })
}
