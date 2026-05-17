"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, CheckCheck, Package, Wrench, CreditCard, Calendar, Activity, ChevronRight } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  actionUrl: string | null
  isRead: boolean
  createdAt: string
}

const TYPE_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  order: { icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
  service: { icon: Wrench, color: "text-violet-600", bg: "bg-violet-50" },
  payment: { icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
  maintenance: { icon: Calendar, color: "text-amber-600", bg: "bg-amber-50" },
  crm: { icon: Activity, color: "text-rose-600", bg: "bg-rose-50" },
  system: { icon: Bell, color: "text-muted-foreground", bg: "bg-muted" },
}

// Mock notifications for UI preview
const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "service", title: "Technician Assigned", message: "A technician has been assigned to your booking SB-ABC123. They will contact you shortly.", actionUrl: "/dashboard/service/1", isRead: false, createdAt: new Date().toISOString() },
  { id: "2", type: "order", title: "Order Shipped", message: "Your order #ORD-456 has been dispatched. Track your package in real time.", actionUrl: "/dashboard/orders/2", isRead: false, createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: "3", type: "maintenance", title: "Maintenance Due in 7 Days", message: "Quarterly maintenance for your Ventilator Unit is due on Jan 25, 2026.", actionUrl: "/dashboard/maintenance", isRead: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "4", type: "payment", title: "Payment Confirmed", message: "Payment of ₦125,000 received for order #ORD-456.", actionUrl: null, isRead: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: "5", type: "service", title: "Service Completed", message: "Your repair service for the X-Ray Machine has been completed. View the service report.", actionUrl: "/dashboard/service/5", isRead: true, createdAt: new Date(Date.now() - 259200000).toISOString() },
]

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  const unreadCount = notifications.filter((n) => !n.isRead).length

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n))
  }

  const visible = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-card px-6 py-4 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={20} className="text-primary" />
            <div>
              <h1 className="font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
              )}
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllRead} className="text-xs gap-1">
              <CheckCheck size={13} />
              Mark all read
            </Button>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Filter tabs */}
        <div className="flex gap-2">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium transition-colors capitalize",
                filter === f
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {f}
              {f === "unread" && unreadCount > 0 && (
                <span className="ml-1.5 bg-white/20 text-xs px-1.5 py-0.5 rounded-full">{unreadCount}</span>
              )}
            </button>
          ))}
        </div>

        {/* Notification list */}
        {visible.length === 0 ? (
          <div className="text-center py-16">
            <Bell size={32} className="text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="font-medium text-sm">No notifications</p>
            <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {visible.map((n) => {
              const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system
              const Icon = cfg.icon
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex gap-3 p-4 rounded-xl border transition-colors",
                    n.isRead ? "bg-card border-border" : "bg-card border-primary/20 shadow-sm"
                  )}
                  onClick={() => markRead(n.id)}
                >
                  <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0", cfg.bg)}>
                    <Icon size={16} className={cfg.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-medium", !n.isRead && "font-semibold")}>{n.title}</p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {!n.isRead && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                        <span className="text-[10px] text-muted-foreground">{timeAgo(n.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.message}</p>
                    {n.actionUrl && (
                      <Link
                        href={n.actionUrl}
                        className="inline-flex items-center gap-1 text-xs text-primary mt-1.5 hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View details <ChevronRight size={11} />
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
