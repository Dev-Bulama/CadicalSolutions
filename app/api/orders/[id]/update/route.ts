import prisma from "@/lib/prisma"

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
    const id = (await params).id
  const body = await req.json()

  const { status, message, location } = body

  const order = await prisma.order.update({
    where: { id: id },
    data: { status },
  })

  await prisma.trackingEvent.create({
    data: {
      orderId: order.id,
      status,
      message: message || `Status updated to ${status}`,
      location,
    },
  })

  return Response.json(order)
}