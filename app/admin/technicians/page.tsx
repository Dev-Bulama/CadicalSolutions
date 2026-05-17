"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wrench, Search, RefreshCw, Star, MapPin, Phone, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"

interface Technician {
  id: string
  firstName: string
  lastName: string
  phone: string
  specializations: string[]
  state: string
  city: string
  status: string
  isAvailable: boolean
  isOnJob: boolean
  rating: number
  totalJobs: number
  completedJobs: number
  user: { name: string; email: string }
  _count: { serviceJobs: number }
}

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: "text-emerald-700 bg-emerald-50 border-emerald-200",
  INACTIVE: "text-muted-foreground bg-muted",
  ON_LEAVE: "text-amber-700 bg-amber-50 border-amber-200",
  SUSPENDED: "text-red-700 bg-red-50 border-red-200",
}

export default function TechniciansAdminPage() {
  const [technicians, setTechnicians] = useState<Technician[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchTechnicians() }, [status])

  async function fetchTechnicians() {
    setLoading(true)
    const params = new URLSearchParams({ limit: "50" })
    if (status) params.set("status", status)
    const res = await fetch(`/api/technician-profile?${params}`)
    const data = await res.json()
    setTechnicians(data.technicians || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: string) {
    await fetch("/api/technician-profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    })
    toast.success("Technician status updated")
    await fetchTechnicians()
  }

  const filtered = technicians.filter((t) =>
    !search ||
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    t.phone.includes(search)
  )

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Technicians</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} registered technicians</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTechnicians}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </Button>
      </div>

      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search technicians…" className="pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            {["ACTIVE", "INACTIVE", "ON_LEAVE", "SUSPENDED"].map((s) => (
              <SelectItem key={s} value={s}>{s.replace(/_/g, " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading technicians…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No technicians found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((tech) => (
            <Card key={tech.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 font-bold text-primary">
                      {tech.firstName[0]}{tech.lastName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{tech.firstName} {tech.lastName}</p>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[tech.status]}`}>
                          {tech.status}
                        </span>
                        {tech.isAvailable ? (
                          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5">
                            <CheckCircle size={10} />Available
                          </span>
                        ) : (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                            <XCircle size={10} />Unavailable
                          </span>
                        )}
                        {tech.isOnJob && (
                          <Badge variant="outline" className="text-[10px] text-amber-600 border-amber-300">On Job</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><Phone size={11} />{tech.phone}</span>
                        <span className="flex items-center gap-1"><MapPin size={11} />{tech.city}, {tech.state}</span>
                      </div>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {tech.specializations.slice(0, 3).map((s) => (
                          <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-center shrink-0">
                    <div>
                      <p className="text-sm font-bold flex items-center gap-0.5">
                        <Star size={12} className="text-amber-500" />
                        {tech.rating.toFixed(1)}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Rating</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold">{tech.completedJobs}/{tech.totalJobs}</p>
                      <p className="text-[10px] text-muted-foreground">Jobs done</p>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      {tech.status === "ACTIVE" && (
                        <Button size="sm" variant="outline" onClick={() => updateStatus(tech.id, "SUSPENDED")} className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50">
                          Suspend
                        </Button>
                      )}
                      {(tech.status === "SUSPENDED" || tech.status === "INACTIVE") && (
                        <Button size="sm" onClick={() => updateStatus(tech.id, "ACTIVE")} className="h-7 text-xs">
                          Activate
                        </Button>
                      )}
                    </div>
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
