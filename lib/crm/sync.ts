import prisma from "@/lib/prisma"
import { getCrmAdapter } from "./index"
import type { CrmContact, CrmAccount, CrmDeal, CrmLead } from "./types"

export async function syncUsersToContacts(connectionId: string): Promise<void> {
  const connection = await prisma.crmConnection.findUnique({ where: { id: connectionId } })
  if (!connection || !connection.isConnected) return

  const log = await prisma.crmSyncLog.create({
    data: {
      connectionId,
      syncType: "manual",
      entity: "contact",
      direction: "push",
      status: "running",
    },
  })

  const start = Date.now()

  try {
    const adapter = getCrmAdapter(connection)
    const users = await prisma.user.findMany({ take: 500 })

    const contacts: CrmContact[] = users.map((u) => {
      const parts = (u.name || "").split(" ")
      return {
        firstName: parts[0] || u.name,
        lastName: parts.slice(1).join(" ") || "-",
        email: u.email,
        phone: u.phone || undefined,
        address: u.address || undefined,
        city: u.city || undefined,
        state: u.state || undefined,
        country: u.country || undefined,
      }
    })

    const result = await adapter.syncContacts(contacts)

    await prisma.crmSyncLog.update({
      where: { id: log.id },
      data: {
        status: result.success ? "success" : "partial",
        recordsTotal: contacts.length,
        recordsSynced: result.synced,
        recordsFailed: result.failed,
        errorSummary: result.errors.join("; ") || null,
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    })
  } catch (err) {
    await prisma.crmSyncLog.update({
      where: { id: log.id },
      data: {
        status: "failed",
        errorSummary: err instanceof Error ? err.message : String(err),
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    })
    throw err
  }
}

export async function syncInstitutionsToAccounts(connectionId: string): Promise<void> {
  const connection = await prisma.crmConnection.findUnique({ where: { id: connectionId } })
  if (!connection || !connection.isConnected) return

  const log = await prisma.crmSyncLog.create({
    data: { connectionId, syncType: "manual", entity: "account", direction: "push", status: "running" },
  })

  const start = Date.now()

  try {
    const adapter = getCrmAdapter(connection)
    const institutions = await prisma.institution.findMany({ take: 500 })

    let synced = 0
    let failed = 0
    const errors: string[] = []

    for (const inst of institutions) {
      try {
        const account: CrmAccount = {
          name: inst.instName,
          type: inst.instType,
          phone: inst.phone,
          email: inst.email,
          address: inst.address,
          city: inst.lga,
          state: inst.state,
          country: "Nigeria",
          industry: "Healthcare",
        }
        const existing = await adapter.searchAccounts(inst.instName)
        if (existing.length > 0 && existing[0].id) {
          await adapter.updateAccount(existing[0].id, account)
        } else {
          await adapter.createAccount(account)
        }
        synced++
      } catch (err) {
        failed++
        errors.push(`${inst.instName}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    await prisma.crmSyncLog.update({
      where: { id: log.id },
      data: {
        status: failed === 0 ? "success" : "partial",
        recordsTotal: institutions.length,
        recordsSynced: synced,
        recordsFailed: failed,
        errorSummary: errors.join("; ") || null,
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    })
  } catch (err) {
    await prisma.crmSyncLog.update({
      where: { id: log.id },
      data: {
        status: "failed",
        errorSummary: err instanceof Error ? err.message : String(err),
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    })
  }
}

export async function syncOrdersToCrmDeals(connectionId: string): Promise<void> {
  const connection = await prisma.crmConnection.findUnique({ where: { id: connectionId } })
  if (!connection || !connection.isConnected) return

  const log = await prisma.crmSyncLog.create({
    data: { connectionId, syncType: "manual", entity: "deal", direction: "push", status: "running" },
  })

  const start = Date.now()

  try {
    const adapter = getCrmAdapter(connection)
    const orders = await prisma.order.findMany({
      include: { user: true },
      where: { status: "PAID" },
      take: 200,
    })

    let synced = 0
    let failed = 0
    const errors: string[] = []

    for (const order of orders) {
      try {
        const deal: CrmDeal = {
          name: `Order #${order.trackingCode}`,
          stage: "Closed Won",
          amount: order.totalAmount,
          currency: "NGN",
          closeDate: order.createdAt.toISOString().split("T")[0],
        }
        await adapter.createDeal(deal)
        synced++
      } catch (err) {
        failed++
        errors.push(`Order ${order.trackingCode}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    await prisma.crmSyncLog.update({
      where: { id: log.id },
      data: {
        status: failed === 0 ? "success" : "partial",
        recordsTotal: orders.length,
        recordsSynced: synced,
        recordsFailed: failed,
        errorSummary: errors.join("; ") || null,
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    })
  } catch (err) {
    await prisma.crmSyncLog.update({
      where: { id: log.id },
      data: {
        status: "failed",
        errorSummary: err instanceof Error ? err.message : String(err),
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    })
  }
}

export async function syncBookingsToTickets(connectionId: string): Promise<void> {
  const connection = await prisma.crmConnection.findUnique({ where: { id: connectionId } })
  if (!connection || !connection.isConnected) return

  const log = await prisma.crmSyncLog.create({
    data: { connectionId, syncType: "manual", entity: "ticket", direction: "push", status: "running" },
  })

  const start = Date.now()

  try {
    const adapter = getCrmAdapter(connection)
    const bookings = await prisma.booking.findMany({ take: 200 })

    let synced = 0
    let failed = 0
    const errors: string[] = []

    for (const booking of bookings) {
      try {
        await adapter.createTicket({
          subject: `Service Request – ${booking.service} [${booking.ref}]`,
          description: booking.notes || undefined,
          status: "New",
          priority: booking.urgency === "emergency" ? "High" : "Medium",
        })
        synced++
      } catch (err) {
        failed++
        errors.push(`Booking ${booking.ref}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    await prisma.crmSyncLog.update({
      where: { id: log.id },
      data: {
        status: failed === 0 ? "success" : "partial",
        recordsTotal: bookings.length,
        recordsSynced: synced,
        recordsFailed: failed,
        errorSummary: errors.join("; ") || null,
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    })
  } catch (err) {
    await prisma.crmSyncLog.update({
      where: { id: log.id },
      data: {
        status: "failed",
        errorSummary: err instanceof Error ? err.message : String(err),
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    })
  }
}

export async function syncReferralsToLeads(connectionId: string): Promise<void> {
  const connection = await prisma.crmConnection.findUnique({ where: { id: connectionId } })
  if (!connection || !connection.isConnected) return

  const log = await prisma.crmSyncLog.create({
    data: { connectionId, syncType: "manual", entity: "lead", direction: "push", status: "running" },
  })

  const start = Date.now()

  try {
    const adapter = getCrmAdapter(connection)
    const referrals = await prisma.referral.findMany({ take: 200 })

    let synced = 0
    let failed = 0
    const errors: string[] = []

    for (const ref of referrals) {
      try {
        const nameParts = ref.referrerFullName.split(" ")
        const lead: CrmLead = {
          firstName: nameParts[0],
          lastName: nameParts.slice(1).join(" ") || "-",
          email: ref.referrerEmail || "",
          phone: ref.referrerPhone,
          company: ref.referrerFacility,
          leadSource: "Referral",
          status: "Not Contacted",
          amount: ref.estimatedValue ? parseFloat(ref.estimatedValue) : undefined,
        }
        await adapter.createLead(lead)
        synced++
      } catch (err) {
        failed++
        errors.push(`Referral ${ref.refId}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }

    await prisma.crmSyncLog.update({
      where: { id: log.id },
      data: {
        status: failed === 0 ? "success" : "partial",
        recordsTotal: referrals.length,
        recordsSynced: synced,
        recordsFailed: failed,
        errorSummary: errors.join("; ") || null,
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    })
  } catch (err) {
    await prisma.crmSyncLog.update({
      where: { id: log.id },
      data: {
        status: "failed",
        errorSummary: err instanceof Error ? err.message : String(err),
        completedAt: new Date(),
        durationMs: Date.now() - start,
      },
    })
  }
}
