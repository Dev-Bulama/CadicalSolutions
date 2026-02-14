import { type NextRequest, NextResponse } from "next/server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import  prisma from "@/lib/prisma"


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const clinician = await prisma.clinician.findUnique({
      where: { id },
      include: { user: true },
    })

    if (!clinician) {
      return NextResponse.json({ error: "Clinician not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: clinician.id,
      firstName: clinician.firstName,
      lastName: clinician.lastName,
      specialization: clinician.specialization,
      licenseNumber: clinician.licenseNumber,
      yearsOfExperience: clinician.yearsOfExperience,
      bio: clinician.bio,
      verified: clinician.verified,
      isAvailable: clinician.isAvailable,
      email: clinician.user.email,
      createdAt: clinician.createdAt,
    })
  } catch (error) {
    console.error("GET /api/admin/clinicians/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    await prisma.clinician.delete({
      where: { id },
    })

    return NextResponse.json({ message: "Clinician deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/admin/clinicians/[id] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
