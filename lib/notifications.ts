import prisma from "@/lib/prisma"

interface NotifyParams {
  userId: string
  type: string
  title: string
  message: string
  actionUrl?: string
}

export async function createNotification(params: NotifyParams) {
  try {
    return await prisma.notification.create({
      data: {
        userId: params.userId,
        type: params.type,
        title: params.title,
        message: params.message,
        actionUrl: params.actionUrl,
      },
    })
  } catch {
    // Never break main flow
  }
}

export async function markNotificationsRead(userId: string, ids?: string[]) {
  await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
      ...(ids ? { id: { in: ids } } : {}),
    },
    data: { isRead: true, readAt: new Date() },
  })
}

export async function getUserNotifications(userId: string, unreadOnly = false) {
  return prisma.notification.findMany({
    where: {
      userId,
      ...(unreadOnly ? { isRead: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  })
}
