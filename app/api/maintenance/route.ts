import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { createNotification } from "@/lib/notifications"

function generateScheduleCode(): string {
  return "MS-" + Date.now().toString(36).toUpperCase()
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const institutionId = searchParams.get("institutionId")
  const dueSoon = searchParams.get("dueSoon") // days

  const where = {
    isActive: true,
    ...(userId ? { userId } : {}),
    ...(institutionId ? { institutionId } : {}),
    ...(dueSoon
      ? {
          nextDueDate: {
            lte: new Date(Date.now() + parseInt(dueSoon) * 86400000),
            gte: new Date(),
          },
        }
      : {}),
  }

  const [schedules, total] = await Promise.all([
    prisma.maintenanceSchedule.findMany({
      where,
      include: {
        technician: { select: { firstName: true, lastName: true } },
        history: { orderBy: { completedAt: "desc" }, take: 1 },
      },
      orderBy: { nextDueDate: "asc" },
    }),
    prisma.maintenanceSchedule.count({ where }),
  ])

  return NextResponse.json({ schedules, total })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    userId, institutionId, technicianId,
    equipmentName, equipmentModel, equipmentSerial,
    serviceType, frequency, siteAddress, siteState,
    nextDueDate, reminderDaysBefore, autoAssign, notes, contractId,
  } = body

  if (!equipmentName || !serviceType || !frequency || !siteAddress || !siteState || !nextDueDate) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const schedule = await prisma.maintenanceSchedule.create({
    data: {
      scheduleCode: generateScheduleCode(),
      userId, institutionId, technicianId,
      equipmentName, equipmentModel, equipmentSerial,
      serviceType,
      frequency,
      siteAddress, siteState,
      nextDueDate: new Date(nextDueDate),
      reminderDaysBefore: reminderDaysBefore || 7,
      autoAssign: autoAssign || false,
      notes, contractId,
    },
  })

  if (userId) {
    await createNotification({
      userId,
      type: "maintenance",
      title: "Maintenance Schedule Created",
      message: `Recurring ${frequency.toLowerCase()} maintenance scheduled for ${equipmentName}`,
      actionUrl: `/dashboard/maintenance/${schedule.id}`,
    })
  }

  return NextResponse.json({ schedule }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, completedAt, technicianId, notes: logNotes, reportUrl, partsUsed, cost, ...rest } = body

  // Log completion
  if (completedAt) {
    const schedule = await prisma.maintenanceSchedule.findUnique({ where: { id } })
    if (!schedule) return NextResponse.json({ error: "Schedule not found" }, { status: 404 })

    await prisma.maintenanceLog.create({
      data: {
        scheduleId: id,
        completedAt: new Date(completedAt),
        technicianId,
        notes: logNotes,
        reportUrl,
        partsUsed,
        cost,
      },
    })

    // Calculate next due date
    const freqMap: Record<string, number> = {
      WEEKLY: 7,
      MONTHLY: 30,
      QUARTERLY: 91,
      BIANNUAL: 182,
      ANNUAL: 365,
    }

    const days = freqMap[schedule.frequency] || 30
    const nextDue = new Date(Date.now() + days * 86400000)

    await prisma.maintenanceSchedule.update({
      where: { id },
      data: { lastCompletedAt: new Date(completedAt), nextDueDate: nextDue },
    })

    return NextResponse.json({ success: true, nextDueDate: nextDue })
  }

  const updated = await prisma.maintenanceSchedule.update({ where: { id }, data: rest })
  return NextResponse.json({ schedule: updated })
}
