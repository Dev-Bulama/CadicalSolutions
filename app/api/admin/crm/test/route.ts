import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { getCrmAdapter } from "@/lib/crm"

export async function POST() {
  const connection = await prisma.crmConnection.findFirst({ where: { isActive: true } })

  if (!connection) {
    return NextResponse.json({ success: false, message: "No active CRM connection found" }, { status: 404 })
  }

  if (!connection.accessToken) {
    return NextResponse.json({ success: false, message: "Not authorized yet — complete OAuth flow first" })
  }

  try {
    const adapter = getCrmAdapter(connection)
    const result = await adapter.testConnection()

    await prisma.crmConnection.update({
      where: { id: connection.id },
      data: {
        healthScore: result.success ? 100 : 0,
        lastError: result.success ? null : result.message,
      },
    })

    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    await prisma.crmConnection.update({
      where: { id: connection.id },
      data: { healthScore: 0, lastError: message },
    })
    return NextResponse.json({ success: false, message })
  }
}
