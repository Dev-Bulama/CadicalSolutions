import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import  prisma  from "@/lib/prisma"


export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const category = searchParams.get("category")
    const isActive = searchParams.get("isActive") === "true"

    const where = {
      // ...(category && { category }),
      ...(isActive && { isActive: true }),
    }

    const services = await prisma.service.findMany({
      where,
      orderBy: { order: "asc" },
    })

    return NextResponse.json(services)
  } catch (error) {
    console.error("GET /api/services error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { name, description, category, icon, order } = body

    if (!name || !description || !category) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const service = await prisma.service.create({
      data: {
        name,
        description,
        category,
        icon: icon || null,
        order: order || 0,
        isActive: true,
      },
    })

    return NextResponse.json(service, { status: 201 })
  } catch (error) {
    console.error("POST /api/services error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
