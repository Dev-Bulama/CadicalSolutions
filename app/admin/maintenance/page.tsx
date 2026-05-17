"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, RefreshCw, Clock, Wrench, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface Schedule {
  id: string
  scheduleCode: string
  equipmentName: string
  equipmentModel: string | null
  serviceType: string
  frequency: string
  siteAddress: string
  siteState: string
  nextDueDate: string
  lastCompletedAt: string | null
  isActive: boolean
  technician: { firstName: string; lastName: string } | null
  history: { completedAt: string }[]
}

const FREQ_COLOR: Record<string, string> = {
  WEEKLY: "text-red-600 bg-red-50 border-red-200",
  MONTHLY: "text-amber-600 bg-amber-50 border-amber-200",
  QUARTERLY: "text-blue-600 bg-blue-50 border-blue-200",
  BIANNUAL: "text-violet-600 bg-violet-50 border-violet-200",
  ANNUAL: "text-emerald-600 bg-emerald-50 border-emerald-200",
}

export default function MaintenancePage() {
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const [form, setForm] = useState({
    equipmentName: "",
    equipmentModel: "",
    serviceType: "PREVENTIVE_MAINTENANCE",
    frequency: "MONTHLY",
    siteAddress: "",
    siteState: "",
    nextDueDate: "",
    reminderDaysBefore: "7",
    notes: "",
  })

  useEffect(() => { fetchSchedules() }, [])

  async function fetchSchedules() {
    setLoading(true)
    const res = await fetch("/api/maintenance")
    const data = await res.json()
    setSchedules(data.schedules || [])
    setLoading(false)
  }

  function setF(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function createSchedule() {
    if (!form.equipmentName || !form.siteAddress || !form.siteState || !form.nextDueDate) {
      toast.error("Fill in all required fields")
      return
    }
    const res = await fetch("/api/maintenance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, reminderDaysBefore: parseInt(form.reminderDaysBefore) }),
    })
    if (res.ok) {
      toast.success("Maintenance schedule created")
      setShowForm(false)
      await fetchSchedules()
    } else {
      toast.error("Failed to create schedule")
    }
  }

  const overdue = schedules.filter((s) => new Date(s.nextDueDate) < new Date())
  const dueSoon = schedules.filter((s) => {
    const d = new Date(s.nextDueDate)
    const now = new Date()
    return d >= now && d <= new Date(now.getTime() + 7 * 86400000)
  })

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Maintenance Scheduling</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {schedules.length} active schedules · {overdue.length} overdue · {dueSoon.length} due within 7 days
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={fetchSchedules}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
          <Button size="sm" onClick={() => setShowForm(!showForm)}>
            <Plus size={14} />
            New Schedule
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold text-red-600">{overdue.length}</p>
            <p className="text-xs text-muted-foreground">Overdue</p>
          </CardContent>
        </Card>
        <Card className="border-amber-200 bg-amber-50/50">
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold text-amber-600">{dueSoon.length}</p>
            <p className="text-xs text-muted-foreground">Due this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-2xl font-bold">{schedules.length}</p>
            <p className="text-xs text-muted-foreground">Total schedules</p>
          </CardContent>
        </Card>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New Maintenance Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Equipment Name *</Label>
                <Input value={form.equipmentName} onChange={(e) => setF("equipmentName", e.target.value)} placeholder="Ventilator Unit" />
              </div>
              <div className="space-y-1.5">
                <Label>Model</Label>
                <Input value={form.equipmentModel} onChange={(e) => setF("equipmentModel", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Service Type</Label>
                <Select value={form.serviceType} onValueChange={(v) => setF("serviceType", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PREVENTIVE_MAINTENANCE">Preventive Maintenance</SelectItem>
                    <SelectItem value="INSPECTION">Inspection</SelectItem>
                    <SelectItem value="CALIBRATION">Calibration</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Frequency</Label>
                <Select value={form.frequency} onValueChange={(v) => setF("frequency", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["WEEKLY", "MONTHLY", "QUARTERLY", "BIANNUAL", "ANNUAL"].map((f) => (
                      <SelectItem key={f} value={f}>{f.charAt(0) + f.slice(1).toLowerCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Site Address *</Label>
                <Input value={form.siteAddress} onChange={(e) => setF("siteAddress", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>State *</Label>
                <Input value={form.siteState} onChange={(e) => setF("siteState", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Next Due Date *</Label>
                <Input type="date" value={form.nextDueDate} onChange={(e) => setF("nextDueDate", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Reminder (days before)</Label>
                <Input type="number" value={form.reminderDaysBefore} onChange={(e) => setF("reminderDaysBefore", e.target.value)} />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={createSchedule}>Create Schedule</Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule List */}
      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading schedules…</p>
      ) : schedules.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No maintenance schedules yet.</p>
      ) : (
        <div className="space-y-3">
          {schedules.map((s) => {
            const isOverdue = new Date(s.nextDueDate) < new Date()
            const fc = FREQ_COLOR[s.frequency] || "bg-muted text-muted-foreground"
            return (
              <Card key={s.id} className={isOverdue ? "border-red-200" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${isOverdue ? "bg-red-100" : "bg-primary/10"}`}>
                        <Wrench size={16} className={isOverdue ? "text-red-600" : "text-primary"} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{s.equipmentName}</p>
                          {s.equipmentModel && <span className="text-xs text-muted-foreground">{s.equipmentModel}</span>}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${fc}`}>
                            {s.frequency}
                          </span>
                          {isOverdue && (
                            <Badge variant="destructive" className="text-[10px]">Overdue</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{s.serviceType.replace(/_/g, " ")} · {s.siteAddress}, {s.siteState}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />Next: {new Date(s.nextDueDate).toLocaleDateString()}
                          </span>
                          {s.lastCompletedAt && (
                            <span className="flex items-center gap-1">
                              <CheckCircle size={11} className="text-emerald-500" />
                              Last: {new Date(s.lastCompletedAt).toLocaleDateString()}
                            </span>
                          )}
                          {s.technician && (
                            <span>Tech: {s.technician.firstName} {s.technician.lastName}</span>
                          )}
                          <span>{s.history.length} logs</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        <Calendar size={12} />
                        Schedule
                      </Button>
                      <Button size="sm" className="h-7 text-xs">
                        <CheckCircle size={12} />
                        Complete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
