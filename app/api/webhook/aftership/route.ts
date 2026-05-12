import { NextResponse } from "next/server"
import { pusherServer } from "@/lib/pusher"
import prisma from "@/lib/prisma"

export async function POST(req: Request) {
  const body = await req.json()

  const tracking = body?.data?.tracking

  if (!tracking) {
    return NextResponse.json({ ok: true })
  }

  const trackingNumber = tracking.tracking_number

  const order = await prisma.order.findFirst({
    where: {
      trackingNumber,
    },
  })

  if (!order) {
    return NextResponse.json({ ok: true })
  }

  const latestCheckpoint = tracking.checkpoints?.[0]

  await prisma.trackingEvent.create({
    data: {
      orderId: order.id,
      status: tracking.tag,
      message: latestCheckpoint?.message || tracking.tag,
      location: latestCheckpoint?.location,
    },
  })

  await prisma.order.update({
    where: {
      id: order.id,
    },
    data: {
      status: tracking.tag,
    },
  })

  await pusherServer.trigger(
    `order-${order.id}`,
    "tracking-update",
    {
      status: tracking.tag,
      message: latestCheckpoint?.message,
      location: latestCheckpoint?.location,
      updatedAt: new Date(),
    }
  )

  return NextResponse.json({ success: true })
}