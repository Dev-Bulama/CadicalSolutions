import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import {
  syncUsersToContacts,
  syncInstitutionsToAccounts,
  syncOrdersToCrmDeals,
  syncBookingsToTickets,
  syncReferralsToLeads,
} from "@/lib/crm/sync"

const entityHandlers: Record<string, (id: string) => Promise<void>> = {
  contacts: syncUsersToContacts,
  accounts: syncInstitutionsToAccounts,
  deals: syncOrdersToCrmDeals,
  tickets: syncBookingsToTickets,
  leads: syncReferralsToLeads,
}

export async function POST(req: NextRequest) {
  const { entity = "all" } = await req.json().catch(() => ({}))

  const connection = await prisma.crmConnection.findFirst({ where: { isActive: true, isConnected: true } })

  if (!connection) {
    return NextResponse.json({ error: "No connected CRM found" }, { status: 404 })
  }

  try {
    if (entity === "all") {
      await Promise.allSettled(
        Object.values(entityHandlers).map((fn) => fn(connection.id))
      )
    } else {
      const handler = entityHandlers[entity]
      if (!handler) return NextResponse.json({ error: "Unknown entity" }, { status: 400 })
      await handler(connection.id)
    }

    await prisma.crmConnection.update({
      where: { id: connection.id },
      data: { lastSyncAt: new Date() },
    })

    return NextResponse.json({ success: true, synced: entity })
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    )
  }
}
