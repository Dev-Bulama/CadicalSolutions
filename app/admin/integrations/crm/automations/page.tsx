"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Trash2, Plus, Zap } from "lucide-react"
import { toast } from "sonner"

const TRIGGER_EVENTS = [
  { value: "order_completed", label: "Order Completed" },
  { value: "rfq_submitted", label: "RFQ Submitted" },
  { value: "booking_created", label: "Service Booking Created" },
  { value: "user_registered", label: "User Registered" },
  { value: "institution_registered", label: "Institution Registered" },
  { value: "referral_submitted", label: "Referral Submitted" },
  { value: "user_inactive_30d", label: "Customer Inactive 30 Days" },
  { value: "bulk_order_submitted", label: "Bulk Order Submitted" },
]

const ACTION_TYPES = [
  { value: "create_deal", label: "Create CRM Deal" },
  { value: "create_lead", label: "Create CRM Lead" },
  { value: "create_contact", label: "Create CRM Contact" },
  { value: "create_ticket", label: "Create CRM Ticket" },
  { value: "update_stage", label: "Update Deal Stage" },
  { value: "create_account", label: "Create CRM Account" },
]

interface Rule {
  id: string
  name: string
  description: string
  triggerEvent: string
  actionType: string
  isActive: boolean
  runCount: number
  lastRunAt: string | null
}

export default function AutomationsPage() {
  const [rules, setRules] = useState<Rule[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [triggerEvent, setTriggerEvent] = useState("")
  const [actionType, setActionType] = useState("")
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchRules() }, [])

  async function fetchRules() {
    setLoading(true)
    const res = await fetch("/api/admin/crm/automations")
    const data = await res.json()
    setRules(data.rules || [])
    setLoading(false)
  }

  async function createRule() {
    if (!name || !triggerEvent || !actionType) {
      toast.error("Name, trigger, and action are required")
      return
    }
    setSaving(true)
    const res = await fetch("/api/admin/crm/automations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, triggerEvent, actionType }),
    })
    if (res.ok) {
      toast.success("Automation rule created")
      setName("")
      setDescription("")
      setTriggerEvent("")
      setActionType("")
      await fetchRules()
    } else {
      toast.error("Failed to create rule")
    }
    setSaving(false)
  }

  async function toggleRule(id: string, isActive: boolean) {
    await fetch("/api/admin/crm/automations", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, isActive }),
    })
    setRules((prev) => prev.map((r) => (r.id === id ? { ...r, isActive } : r)))
  }

  async function deleteRule(id: string) {
    await fetch(`/api/admin/crm/automations?id=${id}`, { method: "DELETE" })
    setRules((prev) => prev.filter((r) => r.id !== id))
    toast.success("Rule deleted")
  }

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Automation Rules</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Automatically push data to your CRM when events happen in Cadical.
        </p>
      </div>

      {/* Add Rule */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap size={16} className="text-primary" />
            New Automation Rule
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Rule Name</Label>
              <Input placeholder="e.g. New Order → CRM Deal" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label>Description <span className="text-muted-foreground">(optional)</span></Label>
              <Input placeholder="Brief description…" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>When (Trigger)</Label>
              <Select value={triggerEvent} onValueChange={setTriggerEvent}>
                <SelectTrigger>
                  <SelectValue placeholder="Select trigger…" />
                </SelectTrigger>
                <SelectContent>
                  {TRIGGER_EVENTS.map((t) => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label>Then (Action)</Label>
              <Select value={actionType} onValueChange={setActionType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select action…" />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_TYPES.map((a) => (
                    <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={createRule} disabled={saving} size="sm">
            <Plus size={15} />
            {saving ? "Creating…" : "Create Rule"}
          </Button>
        </CardContent>
      </Card>

      {/* Rules List */}
      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground text-center py-8">Loading rules…</p>
        ) : rules.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground text-sm">
              No automation rules yet. Create one above.
            </CardContent>
          </Card>
        ) : (
          rules.map((rule) => {
            const trigger = TRIGGER_EVENTS.find((t) => t.value === rule.triggerEvent)
            const action = ACTION_TYPES.find((a) => a.value === rule.actionType)
            return (
              <Card key={rule.id} className={!rule.isActive ? "opacity-60" : ""}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{rule.name}</p>
                        <Badge variant={rule.isActive ? "default" : "secondary"} className="text-[10px]">
                          {rule.isActive ? "Active" : "Paused"}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {rule.runCount} runs
                        </Badge>
                      </div>
                      {rule.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{rule.description}</p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                          WHEN: {trigger?.label || rule.triggerEvent}
                        </span>
                        <span>→</span>
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                          THEN: {action?.label || rule.actionType}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={(v) => toggleRule(rule.id, v)}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteRule(rule.id)}
                        className="h-7 w-7 text-muted-foreground hover:text-red-600"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
