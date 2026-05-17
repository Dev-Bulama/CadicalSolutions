import prisma from "@/lib/prisma"

interface AuditParams {
  userId?: string
  userEmail?: string
  userRole?: string
  action: string
  entity: string
  entityId?: string
  before?: unknown
  after?: unknown
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog(params: AuditParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        userEmail: params.userEmail,
        userRole: params.userRole,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        before: params.before ? JSON.parse(JSON.stringify(params.before)) : undefined,
        after: params.after ? JSON.parse(JSON.stringify(params.after)) : undefined,
        ipAddress: params.ipAddress,
        userAgent: params.userAgent,
      },
    })
  } catch {
    // Audit log failure should never break main flow
  }
}

export async function getAuditLogs(filters: {
  entity?: string
  action?: string
  userId?: string
  page?: number
  limit?: number
}) {
  const { entity, action, userId, page = 1, limit = 50 } = filters

  const where = {
    ...(entity ? { entity } : {}),
    ...(action ? { action } : {}),
    ...(userId ? { userId } : {}),
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ])

  return { logs, total, page, limit }
}
