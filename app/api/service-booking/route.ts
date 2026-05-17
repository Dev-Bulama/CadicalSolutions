import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createNotification } from "@/lib/notifications"
import { createAuditLog } from "@/lib/audit"

function generateBookingCode(): string {
  return "SB-" + Date.now().toString(36).toUpperCase() + "-" + Math.random().toString(36).slice(2, 5).toUpperCase()
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")
  const status = searchParams.get("status")
  const serviceType = searchParams.get("serviceType")
  const userId = searchParams.get("userId")

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(serviceType ? { serviceType: serviceType as never } : {}),
    ...(userId ? { userId } : {}),
  }

  const [bookings, total] = await Promise.all([
    prisma.serviceBooking.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        assignedTech: { select: { firstName: true, lastName: true, phone: true } },
        _count: { select: { statusEvents: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.serviceBooking.count({ where }),
  ])

  return NextResponse.json({ bookings, total, page, limit })
}

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {
    userId, equipmentName, equipmentModel, equipmentSerial, equipmentBrand,
    serviceType, urgency, issueDescription, severity, equipmentCondition,
    siteAddress, siteCity, siteState, siteContact, sitePhone,
    preferredDate, preferredTimeSlot, alternateDate,
    images, documents, dynamicFields, notes,
  } = body

  if (!equipmentName || !serviceType || !issueDescription || !siteAddress || !siteCity || !siteState) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const booking = await prisma.serviceBooking.create({
    data: {
      bookingCode: generateBookingCode(),
      userId,
      equipmentName, equipmentModel, equipmentSerial, equipmentBrand,
      serviceType,
      urgency: urgency || "NORMAL",
      issueDescription, severity, equipmentCondition,
      siteAddress, siteCity, siteState, siteContact, sitePhone,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
      preferredTimeSlot,
      alternateDate: alternateDate ? new Date(alternateDate) : null,
      images: images || [],
      documents: documents || [],
      dynamicFields,
      notes,
      status: "BOOKED",
    },
  })

  // Initial status event
  await prisma.serviceStatusEvent.create({
    data: {
      bookingId: booking.id,
      status: "BOOKED",
      message: "Service booking created successfully",
      updatedByRole: "system",
    },
  })

  // Notify user
  if (userId) {
    await createNotification({
      userId,
      type: "service",
      title: "Service Booking Confirmed",
      message: `Your ${serviceType.replace(/_/g, " ").toLowerCase()} booking (${booking.bookingCode}) has been received.`,
      actionUrl: `/dashboard/service/${booking.id}`,
    })
  }

  await createAuditLog({
    userId,
    action: "create",
    entity: "service_booking",
    entityId: booking.id,
    after: { bookingCode: booking.bookingCode, serviceType, status: "BOOKED" },
  })

  return NextResponse.json({ booking }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, status, assignedTechId, adminNotes, estimatedCost, ...rest } = body

  const existing = await prisma.serviceBooking.findUnique({ where: { id } })
  if (!existing) return NextResponse.json({ error: "Booking not found" }, { status: 404 })

  const updated = await prisma.serviceBooking.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(assignedTechId !== undefined ? { assignedTechId } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
      ...(estimatedCost !== undefined ? { estimatedCost } : {}),
      ...rest,
    },
  })

  if (status && status !== existing.status) {
    await prisma.serviceStatusEvent.create({
      data: {
        bookingId: id,
        status,
        message: `Status updated to ${status.replace(/_/g, " ").toLowerCase()}`,
        updatedByRole: "admin",
      },
    })

    if (existing.userId) {
      await createNotification({
        userId: existing.userId,
        type: "service",
        title: "Service Update",
        message: `Your booking ${existing.bookingCode} is now: ${status.replace(/_/g, " ").toLowerCase()}`,
        actionUrl: `/dashboard/service/${id}`,
      })
    }
  }

  return NextResponse.json({ booking: updated })
}
