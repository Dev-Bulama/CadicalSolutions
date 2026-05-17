"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Search, RefreshCw, Wrench, MapPin, User, Clock, ChevronRight } from "lucide-react"
import { toast } from "sonner"

interface ServiceBooking {
  id: string
  bookingCode: string
  equipmentName: string
  serviceType: string
  urgency: string
  status: string
  siteCity: string
  siteState: string
  createdAt: string
  user: { name: string; email: string } | null
  assignedTech: { firstName: string; lastName: string } | null
  _count: { statusEvents: number }
}

const STATUS_COLORS: Record<string, string> = {
  BOOKED: "bg-muted text-muted-foreground",
  PENDING_APPROVAL: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-blue-50 text-blue-700 border-blue-200",
  TECHNICIAN_ASSIGNED: "bg-violet-50 text-violet-700 border-violet-200",
  TECHNICIAN_ACCEPTED: "bg-violet-50 text-violet-700",
  TECHNICIAN_EN_ROUTE: "bg-orange-50 text-orange-700",
  INSPECTION_STARTED: "bg-yellow-50 text-yellow-700",
  REPAIR_ONGOING: "bg-blue-50 text-blue-700",
  WAITING_FOR_PARTS: "bg-amber-50 text-amber-700",
  TESTING: "bg-teal-50 text-teal-700",
  COMPLETED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
}

const URGENCY_COLOR: Record<string, string> = {
  EMERGENCY: "text-red-600",
  URGENT: "text-amber-600",
  NORMAL: "text-blue-600",
  ROUTINE: "text-muted-foreground",
}

export default function ServiceJobsPage() {
  const [bookings, setBookings] = useState<ServiceBooking[]>([])
  const [total, setTotal] = useState(0)
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBookings() }, [status])

  async function fetchBookings() {
    setLoading(true)
    const params = new URLSearchParams({ limit: "50" })
    if (status) params.set("status", status)
    const res = await fetch(`/api/service-booking?${params}`)
    const data = await res.json()
    setBookings(data.bookings || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: string) {
    const res = await fetch("/api/service-booking", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    })
    if (res.ok) {
      toast.success("Status updated")
      await fetchBookings()
    } else {
      toast.error("Failed to update status")
    }
  }

  const filtered = bookings.filter((b) =>
    !search ||
    b.bookingCode.toLowerCase().includes(search.toLowerCase()) ||
    b.equipmentName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Service Jobs</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} total service bookings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchBookings}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search bookings…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {["BOOKED", "PENDING_APPROVAL", "APPROVED", "TECHNICIAN_ASSIGNED", "TECHNICIAN_EN_ROUTE", "IN_PROGRESS", "COMPLETED", "CANCELLED"].map((s) => (
              <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Jobs List */}
      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading service jobs…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No service jobs found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Wrench size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{booking.equipmentName}</p>
                        <code className="text-[10px] text-muted-foreground font-mono">{booking.bookingCode}</code>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_COLORS[booking.status] || "bg-muted text-muted-foreground"}`}>
                          {booking.status.replace(/_/g, " ")}
                        </span>
                        <span className={`text-[10px] font-medium ${URGENCY_COLOR[booking.urgency]}`}>
                          {booking.urgency}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {booking.serviceType.replace(/_/g, " ")}
                      </p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><MapPin size={11} />{booking.siteCity}, {booking.siteState}</span>
                        {booking.user && <span className="flex items-center gap-1"><User size={11} />{booking.user.name}</span>}
                        {booking.assignedTech && (
                          <span className="flex items-center gap-1">
                            <Wrench size={11} />Tech: {booking.assignedTech.firstName} {booking.assignedTech.lastName}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <Clock size={11} />{new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {booking.status === "BOOKED" && (
                      <Button size="sm" onClick={() => updateStatus(booking.id, "PENDING_APPROVAL")} className="h-7 text-xs">
                        Review
                      </Button>
                    )}
                    {booking.status === "PENDING_APPROVAL" && (
                      <Button size="sm" onClick={() => updateStatus(booking.id, "APPROVED")} className="h-7 text-xs">
                        Approve
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0">
                      <ChevronRight size={14} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
