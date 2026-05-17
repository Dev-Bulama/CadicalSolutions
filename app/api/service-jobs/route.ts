import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createNotification } from "@/lib/notifications"
import { pusherServer } from "@/lib/pusher"

function generateJobCode(): string {
  return "JOB-" + Date.now().toString(36).toUpperCase()
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const technicianId = searchParams.get("technicianId")
  const status = searchParams.get("status")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where = {
    ...(technicianId ? { technicianId } : {}),
    ...(status ? { status: status as never } : {}),
  }

  const [jobs, total] = await Promise.all([
    prisma.serviceJob.findMany({
      where,
      include: {
        booking: {
          select: {
            bookingCode: true,
            equipmentName: true,
            serviceType: true,
            urgency: true,
            siteAddress: true,
            siteCity: true,
            siteState: true,
            issueDescription: true,
            user: { select: { name: true, email: true, phone: true } },
          },
        },
        technician: { select: { firstName: true, lastName: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.serviceJob.count({ where }),
  ])

  return NextResponse.json({ jobs, total })
}

export async function POST(req: NextRequest) {
  const { bookingId, technicianId, scheduledAt } = await req.json()

  if (!bookingId) return NextResponse.json({ error: "bookingId required" }, { status: 400 })

  const existing = await prisma.serviceJob.findUnique({ where: { bookingId } })
  if (existing) {
    return NextResponse.json({ error: "Job already exists for this booking" }, { status: 409 })
  }

  const job = await prisma.serviceJob.create({
    data: {
      jobCode: generateJobCode(),
      bookingId,
      technicianId,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
      status: technicianId ? "ASSIGNED" : "ASSIGNED",
    },
  })

  // Update booking status
  await prisma.serviceBooking.update({
    where: { id: bookingId },
    data: {
      status: technicianId ? "TECHNICIAN_ASSIGNED" : "APPROVED",
      assignedTechId: technicianId,
    },
  })

  if (technicianId) {
    const tech = await prisma.technicianProfile.findUnique({
      where: { id: technicianId },
      select: { userId: true },
    })
    if (tech) {
      await createNotification({
        userId: tech.userId,
        type: "service",
        title: "New Job Assigned",
        message: `You have been assigned a new service job (${job.jobCode})`,
        actionUrl: `/technician/jobs/${job.id}`,
      })
    }
  }

  return NextResponse.json({ job }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, status, diagnosticNotes, workDone, partsUsed, laborCost, partsCost, totalCost, completionImages } = body

  const existing = await prisma.serviceJob.findUnique({
    where: { id },
    include: { booking: { select: { userId: true, bookingCode: true, bookingId: true } } },
  })
  if (!existing) return NextResponse.json({ error: "Job not found" }, { status: 404 })

  const updated = await prisma.serviceJob.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(diagnosticNotes !== undefined ? { diagnosticNotes } : {}),
      ...(workDone !== undefined ? { workDone } : {}),
      ...(partsUsed !== undefined ? { partsUsed } : {}),
      ...(laborCost !== undefined ? { laborCost } : {}),
      ...(partsCost !== undefined ? { partsCost } : {}),
      ...(totalCost !== undefined ? { totalCost } : {}),
      ...(completionImages ? { completionImages } : {}),
      ...(status === "ON_SITE" ? { startedAt: new Date() } : {}),
      ...(status === "COMPLETED" ? { completedAt: new Date() } : {}),
    },
  })

  // Sync booking status
  const bookingStatusMap: Record<string, string> = {
    ACCEPTED: "TECHNICIAN_ACCEPTED",
    EN_ROUTE: "TECHNICIAN_EN_ROUTE",
    ON_SITE: "INSPECTION_STARTED",
    IN_PROGRESS: "REPAIR_ONGOING",
    WAITING_PARTS: "WAITING_FOR_PARTS",
    COMPLETED: "COMPLETED",
  }

  if (status && bookingStatusMap[status]) {
    const newBookingStatus = bookingStatusMap[status]
    await prisma.serviceBooking.update({
      where: { id: existing.bookingId },
      data: { status: newBookingStatus as never },
    })

    await prisma.serviceStatusEvent.create({
      data: {
        bookingId: existing.bookingId,
        status: newBookingStatus as never,
        message: `Technician update: ${status.replace(/_/g, " ").toLowerCase()}`,
        updatedByRole: "technician",
      },
    })

    // Push real-time update
    try {
      await pusherServer.trigger(`booking-${existing.bookingId}`, "status-update", {
        status: newBookingStatus,
        jobStatus: status,
        updatedAt: new Date().toISOString(),
      })
    } catch {
      // Pusher is optional
    }

    if (existing.booking?.userId) {
      await createNotification({
        userId: existing.booking.userId,
        type: "service",
        title: "Service Update",
        message: `Your booking ${existing.booking.bookingCode}: ${status.replace(/_/g, " ").toLowerCase()}`,
        actionUrl: `/dashboard/service/${existing.bookingId}`,
      })
    }
  }

  return NextResponse.json({ job: updated })
}
