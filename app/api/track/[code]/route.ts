import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const code =  (await params).code
  const order = await prisma.order.findUnique({
    where: {
      trackingCode: code,
    },
    include: {
      trackingEvents: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  })

  if (!order) {
    return NextResponse.json(
      { error: "Order not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(order)
}