"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Plug, RefreshCw, CheckCircle, XCircle, AlertCircle,
  Activity, Users, Building2, ShoppingCart, FileText, Zap, ArrowRight,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Connection {
  id: string
  provider: string
  isConnected: boolean
  syncEnabled: boolean
  lastSyncAt: string | null
  healthScore: number
  lastError: string | null
  _count: { syncLogs: number; failedJobs: number; fieldMappings: number; automationRules: number }
}

const statCards = [
  { label: "Synced Contacts", icon: Users, key: "contacts", color: "text-blue-600" },
  { label: "Synced Accounts", icon: Building2, key: "accounts", color: "text-violet-600" },
  { label: "Active Deals", icon: ShoppingCart, key: "deals", color: "text-emerald-600" },
  { label: "Open Leads", icon: FileText, key: "leads", color: "text-amber-600" },
]

export default function CrmDashboardPage() {
  const [connection, setConnection] = useState<Connection | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchConnection()
  }, [])

  async function fetchConnection() {
    setLoading(true)
    const res = await fetch("/api/admin/crm/connection")
    const data = await res.json()
    setConnection(data.connection)
    setLoading(false)
  }

  async function testConnection() {
    setTesting(true)
    const res = await fetch("/api/admin/crm/test", { method: "POST" })
    const data = await res.json()
    if (data.success) {
      toast.success("CRM connected successfully")
    } else {
      toast.error(data.message || "Connection test failed")
    }
    await fetchConnection()
    setTesting(false)
  }

  async function triggerSync() {
    setSyncing(true)
    const res = await fetch("/api/admin/crm/sync", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity: "all" }),
    })
    const data = await res.json()
    if (data.success) {
      toast.success("Full sync initiated successfully")
    } else {
      toast.error(data.error || "Sync failed")
    }
    await fetchConnection()
    setSyncing(false)
  }

  const healthColor =
    !connection ? "text-muted-foreground" :
    connection.healthScore >= 80 ? "text-emerald-600" :
    connection.healthScore >= 50 ? "text-amber-600" : "text-red-600"

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">CRM Integration</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your CRM connections, sync data, and configure automation rules.
          </p>
        </div>
        <div className="flex gap-2">
          {connection?.isConnected && (
            <Button variant="outline" size="sm" onClick={testConnection} disabled={testing}>
              <Activity size={15} className={testing ? "animate-pulse" : ""} />
              {testing ? "Testing…" : "Test Connection"}
            </Button>
          )}
          {connection?.isConnected && (
            <Button size="sm" onClick={triggerSync} disabled={syncing}>
              <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
              {syncing ? "Syncing…" : "Sync All"}
            </Button>
          )}
        </div>
      </div>

      {/* Connection Status */}
      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <div className="h-20 flex items-center justify-center text-muted-foreground text-sm">
              Loading connection…
            </div>
          ) : !connection ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <Plug size={20} className="text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold">No CRM Connected</p>
                  <p className="text-sm text-muted-foreground">Connect a CRM to start syncing data</p>
                </div>
              </div>
              <Button asChild>
                <Link href="/admin/integrations/crm/connect">Connect CRM <ArrowRight size={15} /></Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Plug size={22} className="text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold capitalize">{connection.provider} CRM</p>
                    <Badge variant={connection.isConnected ? "default" : "secondary"}>
                      {connection.isConnected ? "Connected" : "Disconnected"}
                    </Badge>
                    <Badge variant={connection.syncEnabled ? "default" : "outline"}>
                      Sync {connection.syncEnabled ? "On" : "Off"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {connection.lastSyncAt
                      ? `Last synced ${new Date(connection.lastSyncAt).toLocaleString()}`
                      : "Never synced"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 text-sm">
                <div className="text-center">
                  <p className={`text-2xl font-bold ${healthColor}`}>{connection.healthScore}</p>
                  <p className="text-muted-foreground text-xs">Health Score</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{connection._count.syncLogs}</p>
                  <p className="text-muted-foreground text-xs">Sync Runs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{connection._count.failedJobs}</p>
                  <p className="text-muted-foreground text-xs">Failed Jobs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{connection._count.fieldMappings}</p>
                  <p className="text-muted-foreground text-xs">Field Maps</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold">{connection._count.automationRules}</p>
                  <p className="text-muted-foreground text-xs">Automations</p>
                </div>
              </div>
            </div>
          )}
          {connection?.lastError && (
            <div className="mt-4 flex items-start gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{connection.lastError}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Field Mapping", desc: "Map CRM fields", href: "/admin/integrations/crm/mappings", icon: Zap },
          { label: "Automations", desc: "Configure triggers", href: "/admin/integrations/crm/automations", icon: RefreshCw },
          { label: "Sync Logs", desc: "View sync history", href: "/admin/integrations/crm/logs", icon: Activity },
          { label: "Setup Wizard", desc: "Step-by-step guide", href: "/admin/integrations/crm/setup-wizard", icon: CheckCircle },
        ].map((action) => {
          const Icon = action.icon
          return (
            <Link key={action.href} href={action.href}>
              <Card className="hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer h-full">
                <CardContent className="pt-5 pb-4">
                  <Icon size={20} className="text-primary mb-2" />
                  <p className="font-semibold text-sm">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.desc}</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>

      {/* Supported CRMs */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Supported CRM Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: "Zoho CRM", status: "available" },
              { name: "HubSpot", status: "coming-soon" },
              { name: "Salesforce", status: "coming-soon" },
              { name: "Freshsales", status: "coming-soon" },
              { name: "Custom API", status: "coming-soon" },
            ].map((crm) => (
              <div
                key={crm.name}
                className="flex items-center justify-between p-3 rounded-lg border border-border"
              >
                <span className="text-sm font-medium">{crm.name}</span>
                {crm.status === "available" ? (
                  <CheckCircle size={14} className="text-emerald-500" />
                ) : (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">Soon</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
