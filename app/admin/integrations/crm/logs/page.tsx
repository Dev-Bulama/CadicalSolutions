"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle, AlertCircle, Clock } from "lucide-react"

interface SyncLog {
  id: string
  syncType: string
  entity: string
  direction: string
  status: string
  recordsTotal: number
  recordsSynced: number
  recordsFailed: number
  errorSummary: string | null
  durationMs: number | null
  startedAt: string
  completedAt: string | null
}

const STATUS_ICON: Record<string, React.ElementType> = {
  success: CheckCircle,
  failed: XCircle,
  partial: AlertCircle,
  running: Clock,
}

const STATUS_COLOR: Record<string, string> = {
  success: "text-emerald-600",
  failed: "text-red-600",
  partial: "text-amber-600",
  running: "text-blue-600",
}

export default function SyncLogsPage() {
  const [logs, setLogs] = useState<SyncLog[]>([])
  const [total, setTotal] = useState(0)
  const [entity, setEntity] = useState("")
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLogs() }, [entity, status])

  async function fetchLogs() {
    setLoading(true)
    const params = new URLSearchParams({ limit: "50" })
    if (entity) params.set("entity", entity)
    if (status) params.set("status", status)
    const res = await fetch(`/api/admin/crm/logs?${params}`)
    const data = await res.json()
    setLogs(data.logs || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-5xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Sync Logs</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} total sync runs recorded</p>
        </div>
        <div className="flex gap-2">
          <Select value={entity} onValueChange={setEntity}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All entities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All entities</SelectItem>
              {["contact", "account", "deal", "lead", "ticket"].map((e) => (
                <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="All status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All status</SelectItem>
              {["success", "partial", "failed", "running"].map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={fetchLogs}>
            <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-12">Loading logs…</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">No sync logs found.</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => {
                const Icon = STATUS_ICON[log.status] || Clock
                const color = STATUS_COLOR[log.status] || "text-muted-foreground"
                const successRate = log.recordsTotal > 0
                  ? Math.round((log.recordsSynced / log.recordsTotal) * 100)
                  : 0
                return (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                    <Icon size={16} className={`${color} mt-0.5 shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium capitalize">{log.entity}</span>
                        <Badge variant="outline" className="text-[10px] capitalize">{log.syncType}</Badge>
                        <Badge variant="outline" className="text-[10px] capitalize">{log.direction}</Badge>
                        <Badge
                          variant={log.status === "success" ? "default" : "secondary"}
                          className={`text-[10px] ${color}`}
                        >
                          {log.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{log.recordsSynced}/{log.recordsTotal} synced ({successRate}%)</span>
                        {log.recordsFailed > 0 && <span className="text-red-600">{log.recordsFailed} failed</span>}
                        {log.durationMs && <span>{(log.durationMs / 1000).toFixed(1)}s</span>}
                        <span>{new Date(log.startedAt).toLocaleString()}</span>
                      </div>
                      {log.errorSummary && (
                        <p className="mt-1 text-xs text-red-600 truncate">{log.errorSummary}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
