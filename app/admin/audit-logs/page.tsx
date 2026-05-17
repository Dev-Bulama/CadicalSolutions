"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, Shield } from "lucide-react"

interface AuditLog {
  id: string
  userId: string | null
  userEmail: string | null
  userRole: string | null
  action: string
  entity: string
  entityId: string | null
  ipAddress: string | null
  createdAt: string
}

const ACTION_COLOR: Record<string, string> = {
  create: "text-emerald-700 bg-emerald-50",
  update: "text-blue-700 bg-blue-50",
  delete: "text-red-700 bg-red-50",
  login: "text-violet-700 bg-violet-50",
  approve: "text-teal-700 bg-teal-50",
  reject: "text-amber-700 bg-amber-50",
  sync: "text-indigo-700 bg-indigo-50",
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [total, setTotal] = useState(0)
  const [entity, setEntity] = useState("")
  const [action, setAction] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLogs() }, [entity, action])

  async function fetchLogs() {
    setLoading(true)
    const params = new URLSearchParams()
    if (entity) params.set("entity", entity)
    if (action) params.set("action", action)
    const res = await fetch(`/api/audit-logs?${params}`)
    const data = await res.json()
    setLogs(data.logs || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield size={22} className="text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Audit Logs</h1>
            <p className="text-muted-foreground text-sm mt-0.5">{total} total audit events</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={entity} onValueChange={setEntity}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All entities</SelectItem>
              {["user", "product", "order", "supplier", "service_booking", "crm", "rfq"].map((e) => (
                <SelectItem key={e} value={e} className="capitalize">{e.replace(/_/g, " ")}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={action} onValueChange={setAction}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All actions</SelectItem>
              {["create", "update", "delete", "login", "approve", "reject", "sync"].map((a) => (
                <SelectItem key={a} value={a} className="capitalize">{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchLogs}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-12">Loading audit logs…</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No audit logs found.</p>
          ) : (
            <div className="space-y-1.5">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted/50 transition-colors">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-medium capitalize ${ACTION_COLOR[log.action] || "bg-muted text-muted-foreground"}`}>
                    {log.action}
                  </span>
                  <span className="text-sm font-medium capitalize min-w-[120px]">{log.entity.replace(/_/g, " ")}</span>
                  {log.entityId && (
                    <code className="text-xs text-muted-foreground font-mono hidden sm:block">
                      {log.entityId.slice(0, 12)}…
                    </code>
                  )}
                  <div className="flex-1 text-xs text-muted-foreground">
                    {log.userEmail || "System"} {log.userRole ? `(${log.userRole})` : ""}
                  </div>
                  {log.ipAddress && (
                    <span className="text-xs text-muted-foreground font-mono hidden md:block">{log.ipAddress}</span>
                  )}
                  <span className="text-xs text-muted-foreground shrink-0">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
