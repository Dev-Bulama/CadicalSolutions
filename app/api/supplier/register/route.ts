import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(req: NextRequest) {
  const body = await req.json()

  const {
    companyName, contactName, email, phone, altPhone, website,
    category, description, address, city, state, country,
    cacNumber, taxId, nafdacNumber, yearEstablished,
  } = body

  if (!companyName || !contactName || !email || !phone || !address || !city || !state) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const existing = await prisma.supplier.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ error: "A supplier with this email already exists" }, { status: 409 })
  }

  const supplier = await prisma.supplier.create({
    data: {
      companyName, contactName, email, phone, altPhone, website,
      category: category || [],
      description, address, city, state,
      country: country || "Nigeria",
      cacNumber, taxId, nafdacNumber,
      yearEstablished: yearEstablished ? parseInt(yearEstablished) : null,
      status: "PENDING",
    },
  })

  return NextResponse.json({ supplier }, { status: 201 })
}
