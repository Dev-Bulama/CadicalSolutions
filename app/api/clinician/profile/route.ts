import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma  from "@/lib/prisma"


export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const clinician = await prisma.clinician.findUnique({
      where: { userId: session.user.id },
      include: { user: true },
    })

    if (!clinician) {
      return NextResponse.json({ error: "Clinician profile not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: clinician.id,
      firstName: clinician.firstName,
      lastName: clinician.lastName,
      specialization: clinician.specialization,
      licenseNumber: clinician.licenseNumber,
      yearsOfExperience: clinician.yearsOfExperience,
      bio: clinician.bio,
      profileImage: clinician.profileImage,
      verified: clinician.verified,
      isAvailable: clinician.isAvailable,
      email: clinician.user.email,
      createdAt: clinician.createdAt,
      updatedAt: clinician.updatedAt,
    })
  } catch (error) {
    console.error("GET /api/clinician/profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const clinician = await prisma.clinician.update({
      where: { userId: session.user.id },
      data: {
        firstName: body.firstName,
        lastName: body.lastName,
        specialization: body.specialization,
        yearsOfExperience: body.yearsOfExperience,
        bio: body.bio,
        profileImage: body.profileImage,
        isAvailable: body.isAvailable,
      },
      include: { user: true },
    })

    return NextResponse.json({
      id: clinician.id,
      firstName: clinician.firstName,
      lastName: clinician.lastName,
      specialization: clinician.specialization,
      licenseNumber: clinician.licenseNumber,
      yearsOfExperience: clinician.yearsOfExperience,
      bio: clinician.bio,
      profileImage: clinician.profileImage,
      verified: clinician.verified,
      isAvailable: clinician.isAvailable,
      email: clinician.user.email,
      createdAt: clinician.createdAt,
      updatedAt: clinician.updatedAt,
    })
  } catch (error) {
    console.error("PUT /api/clinician/profile error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
