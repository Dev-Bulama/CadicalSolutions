import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma  from "@/lib/prisma"


export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()

    const clinician = await prisma.clinician.update({
      where: { id },
      data: {
        verified: body.verified || true,
      },
      include: { user: true },
    })

    return NextResponse.json({
      id: clinician.id,
      firstName: clinician.firstName,
      lastName: clinician.lastName,
      verified: clinician.verified,
      message: `Clinician ${clinician.verified ? "verified" : "unverified"} successfully`,
    })
  } catch (error) {
    console.error("PATCH /api/admin/clinicians/[id]/verify error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
