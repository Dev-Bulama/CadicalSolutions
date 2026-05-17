import { NextRequest, NextResponse } from "next/server"
import { getUserNotifications, markNotificationsRead } from "@/lib/notifications"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const userId = searchParams.get("userId")
  const unreadOnly = searchParams.get("unreadOnly") === "true"

  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

  const notifications = await getUserNotifications(userId, unreadOnly)
  const unreadCount = notifications.filter((n) => !n.isRead).length

  return NextResponse.json({ notifications, unreadCount })
}

export async function PUT(req: NextRequest) {
  const { userId, ids } = await req.json()
  if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 })

  await markNotificationsRead(userId, ids)
  return NextResponse.json({ success: true })
}
