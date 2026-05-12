import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"


export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id =  (await params).id
  const body = await req.json()

  const {
    status,
    message,
    location,
    trackingNumber,
    carrier,
  } = body

  const order = await prisma.order.update({
    where: {
      id: id,
    },
    data: {
      status,
      trackingNumber,
      carrier,
    },
  })

  // log history
  if (status || message) {
    await prisma.trackingEvent.create({
      data: {
        orderId: order.id,
        status: status || order.status,
        message: message || `Status updated to ${status}`,
        location,
      },
    })
  }

  return NextResponse.json(order)
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id =  (await params).id
  const order = await prisma.order.findUnique({
    where: { id: id },
    include: {
      trackingEvents: {
        orderBy: { createdAt: "desc" },
      },
    },
  })

  return Response.json(order)
}