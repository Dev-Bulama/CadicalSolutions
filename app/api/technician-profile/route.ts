import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get("status")
  const available = searchParams.get("available")
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "20")

  const where = {
    ...(status ? { status: status as never } : {}),
    ...(available === "true" ? { isAvailable: true } : {}),
  }

  const [technicians, total] = await Promise.all([
    prisma.technicianProfile.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        _count: { select: { serviceJobs: true } },
      },
      orderBy: { rating: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.technicianProfile.count({ where }),
  ])

  return NextResponse.json({ technicians, total })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const {
    userId, firstName, lastName, phone, profileImage,
    specializations, certifications, yearsOfExperience,
    state, city, baseAddress,
  } = body

  if (!userId || !firstName || !lastName || !phone || !state || !city) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const existing = await prisma.technicianProfile.findUnique({ where: { userId } })
  if (existing) {
    return NextResponse.json({ error: "Technician profile already exists" }, { status: 409 })
  }

  const tech = await prisma.technicianProfile.create({
    data: {
      userId, firstName, lastName, phone, profileImage,
      specializations: specializations || [],
      certifications: certifications || [],
      yearsOfExperience: yearsOfExperience || 0,
      state, city, baseAddress,
    },
  })

  return NextResponse.json({ technician: tech }, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const body = await req.json()
  const { id, ...data } = body

  // Handle location update separately (privacy)
  if (data.currentLocation !== undefined && !data.shareLocation) {
    delete data.currentLocation
  }

  const tech = await prisma.technicianProfile.update({ where: { id }, data })
  return NextResponse.json({ technician: tech })
}
