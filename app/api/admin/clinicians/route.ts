import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import prisma  from "@/lib/prisma"


export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searchParams = req.nextUrl.searchParams
    const verified = searchParams.get("verified")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const where = {
      ...(verified !== null && { verified: verified === "true" }),
    }

    const clinicians = await prisma.clinician.findMany({
      where,
      include: { user: true },
      take: limit,
      skip: offset,
      orderBy: { createdAt: "desc" },
    })

    const total = await prisma.clinician.count({ where })

    return NextResponse.json({
      data: clinicians.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        specialization: c.specialization,
        licenseNumber: c.licenseNumber,
        yearsOfExperience: c.yearsOfExperience,
        verified: c.verified,
        isAvailable: c.isAvailable,
        email: c.user.email,
        createdAt: c.createdAt,
      })),
      total,
      limit,
      offset,
    })
  } catch (error) {
    console.error("GET /api/admin/clinicians error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
