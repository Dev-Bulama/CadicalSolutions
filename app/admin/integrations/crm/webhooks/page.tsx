"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, CheckCircle, XCircle, Clock } from "lucide-react"
import { toast } from "sonner"

interface WebhookLog {
  id: string
  event: string
  status: string
  errorMessage: string | null
  receivedAt: string
}

export default function WebhookLogsPage() {
  const [logs, setLogs] = useState<WebhookLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchLogs() }, [])

  async function fetchLogs() {
    setLoading(true)
    const res = await fetch("/api/admin/crm/webhook")
    const data = await res.json()
    setLogs(data.logs || [])
    setLoading(false)
  }

  const webhookUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/admin/crm/webhook`
      : "/api/admin/crm/webhook"

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Webhook Logs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Incoming CRM webhook events received by Cadical.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchLogs}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Webhook URL */}
      <div className="p-4 bg-muted rounded-lg border border-border">
        <p className="text-xs font-medium text-muted-foreground mb-1.5">Your Cadical Webhook URL</p>
        <div className="flex gap-2">
          <code className="flex-1 text-xs bg-background rounded px-3 py-2 border border-border font-mono">
            {webhookUrl}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { navigator.clipboard.writeText(webhookUrl); toast.success("Copied!") }}
          >
            Copy
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Paste this URL into your CRM&apos;s webhook configuration to receive real-time events.
        </p>
      </div>

      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-12">Loading webhook logs…</p>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-12">
              No webhook events received yet.
            </p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => {
                const Icon = log.status === "processed" ? CheckCircle : log.status === "failed" ? XCircle : Clock
                const color = log.status === "processed" ? "text-emerald-600" : log.status === "failed" ? "text-red-600" : "text-blue-600"
                return (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg border border-border">
                    <Icon size={15} className={`${color} mt-0.5 shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <code className="text-xs font-mono">{log.event}</code>
                        <Badge
                          variant={log.status === "processed" ? "default" : "secondary"}
                          className="text-[10px]"
                        >
                          {log.status}
                        </Badge>
                      </div>
                      {log.errorMessage && (
                        <p className="text-xs text-red-600 mt-0.5">{log.errorMessage}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(log.receivedAt).toLocaleString()}
                      </p>
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
