import prisma from "@/lib/prisma"
import { type NextRequest, NextResponse } from "next/server"


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const { userId, firstName, lastName, specialization, licenseNumber, yearsOfExperience, bio } = body

    if (!userId || !firstName || !lastName || !specialization || !licenseNumber) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if clinician already exists
    const existingClinician = await prisma.clinician.findUnique({
      where: { userId },
    })

    if (existingClinician) {
      return NextResponse.json({ error: "Clinician profile already exists" }, { status: 400 })
    }

    // Check if license number is unique
    const licenseExists = await prisma.clinician.findUnique({
      where: { licenseNumber },
    })

    if (licenseExists) {
      return NextResponse.json({ error: "License number already registered" }, { status: 400 })
    }

    const clinician = await prisma.clinician.create({
      data: {
        userId,
        firstName,
        lastName,
        specialization,
        licenseNumber,
        yearsOfExperience: yearsOfExperience || 0,
        bio: bio || null,
        verified: false,
        isAvailable: true,
      },
      include: { user: true },
    })

    return NextResponse.json(
      {
        id: clinician.id,
        userId: clinician.userId,
        firstName: clinician.firstName,
        lastName: clinician.lastName,
        specialization: clinician.specialization,
        licenseNumber: clinician.licenseNumber,
        yearsOfExperience: clinician.yearsOfExperience,
        verified: clinician.verified,
        isAvailable: clinician.isAvailable,
        message: "Clinician registered successfully. Awaiting verification.",
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("POST /api/clinician/register error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
