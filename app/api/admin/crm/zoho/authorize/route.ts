import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ZohoCrmAdapter } from "@/lib/crm/zoho"

export async function GET() {
  const connection = await prisma.crmConnection.findFirst({
    where: { isActive: true, provider: "zoho" },
  })

  if (!connection?.clientId || !connection.clientSecret || !connection.redirectUri) {
    return NextResponse.json({ error: "Zoho credentials not configured" }, { status: 400 })
  }

  const adapter = new ZohoCrmAdapter({
    clientId: connection.clientId,
    clientSecret: connection.clientSecret,
    redirectUri: connection.redirectUri,
  })

  const authUrl = adapter.getAuthorizationUrl(connection.id)
  return NextResponse.redirect(authUrl)
}
