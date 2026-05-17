import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { ZohoCrmAdapter } from "@/lib/crm/zoho"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get("code")
  const state = searchParams.get("state") // connectionId
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/admin/integrations/crm?error=${encodeURIComponent(error)}`
    )
  }

  if (!code || !state) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/admin/integrations/crm?error=missing_params`
    )
  }

  const connection = await prisma.crmConnection.findUnique({ where: { id: state } })

  if (!connection?.clientId || !connection.clientSecret || !connection.redirectUri) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/admin/integrations/crm?error=invalid_connection`
    )
  }

  try {
    const adapter = new ZohoCrmAdapter({
      clientId: connection.clientId,
      clientSecret: connection.clientSecret,
      redirectUri: connection.redirectUri,
    })

    const tokens = await adapter.exchangeCodeForTokens(code)

    const expiresAt = tokens.expiresIn
      ? new Date(Date.now() + tokens.expiresIn * 1000)
      : null

    await prisma.crmConnection.update({
      where: { id: state },
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken || connection.refreshToken,
        tokenExpiresAt: expiresAt,
        apiDomain: tokens.apiDomain || connection.apiDomain,
        isConnected: true,
        lastError: null,
        healthScore: 100,
      },
    })

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/admin/integrations/crm?connected=true`
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : "OAuth callback failed"
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/admin/integrations/crm?error=${encodeURIComponent(message)}`
    )
  }
}
