"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Trash2, Plus, Save } from "lucide-react"
import { toast } from "sonner"

const ENTITIES = ["contact", "account", "deal", "lead", "ticket"]
const DIRECTIONS = ["both", "tocrm", "fromcrm"]

const CADICAL_FIELDS: Record<string, string[]> = {
  contact: ["name", "email", "phone", "address", "city", "state", "country"],
  account: ["instName", "instType", "phone", "email", "address", "state"],
  deal: ["trackingCode", "totalAmount", "status", "createdAt"],
  lead: ["referrerFullName", "referrerEmail", "referrerPhone", "referrerFacility", "estimatedValue"],
  ticket: ["ref", "service", "urgency", "notes"],
}

const ZOHO_FIELDS: Record<string, string[]> = {
  contact: ["First_Name", "Last_Name", "Email", "Phone", "Mailing_Street", "Mailing_City", "Mailing_State", "Mailing_Country"],
  account: ["Account_Name", "Account_Type", "Phone", "Email", "Billing_Street", "Billing_State"],
  deal: ["Deal_Name", "Amount", "Stage", "Closing_Date"],
  lead: ["First_Name", "Last_Name", "Email", "Phone", "Company", "Annual_Revenue"],
  ticket: ["Subject", "Status", "Priority", "Description"],
}

interface Mapping {
  id: string
  entity: string
  cadicalField: string
  crmField: string
  direction: string
}

export default function FieldMappingsPage() {
  const [mappings, setMappings] = useState<Mapping[]>([])
  const [entity, setEntity] = useState("contact")
  const [cadicalField, setCadicalField] = useState("")
  const [crmField, setCrmField] = useState("")
  const [direction, setDirection] = useState("both")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchMappings() }, [])

  async function fetchMappings() {
    setLoading(true)
    const res = await fetch("/api/admin/crm/mappings")
    const data = await res.json()
    setMappings(data.mappings || [])
    setLoading(false)
  }

  async function addMapping() {
    if (!cadicalField || !crmField) {
      toast.error("Select both fields")
      return
    }
    setSaving(true)
    const res = await fetch("/api/admin/crm/mappings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entity, cadicalField, crmField, direction }),
    })
    if (res.ok) {
      toast.success("Mapping saved")
      setCadicalField("")
      setCrmField("")
      await fetchMappings()
    } else {
      toast.error("Failed to save mapping")
    }
    setSaving(false)
  }

  async function deleteMapping(id: string) {
    await fetch(`/api/admin/crm/mappings?id=${id}`, { method: "DELETE" })
    setMappings((prev) => prev.filter((m) => m.id !== id))
    toast.success("Mapping removed")
  }

  const filtered = mappings.filter((m) => m.entity === entity)

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Field Mapping</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Map Cadical data fields to CRM fields for accurate sync.
        </p>
      </div>

      {/* Add Mapping */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Add Field Mapping</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-4 gap-3 items-end">
            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Entity</p>
              <Select value={entity} onValueChange={setEntity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ENTITIES.map((e) => (
                    <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Cadical Field</p>
              <Select value={cadicalField} onValueChange={setCadicalField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {(CADICAL_FIELDS[entity] || []).map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">CRM Field</p>
              <Select value={crmField} onValueChange={setCrmField}>
                <SelectTrigger>
                  <SelectValue placeholder="Select…" />
                </SelectTrigger>
                <SelectContent>
                  {(ZOHO_FIELDS[entity] || []).map((f) => (
                    <SelectItem key={f} value={f}>{f}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-medium text-muted-foreground">Direction</p>
              <Select value={direction} onValueChange={setDirection}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="both">Both ways</SelectItem>
                  <SelectItem value="tocrm">Cadical → CRM</SelectItem>
                  <SelectItem value="fromcrm">CRM → Cadical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={addMapping} disabled={saving} size="sm">
            <Plus size={15} />
            {saving ? "Saving…" : "Add Mapping"}
          </Button>
        </CardContent>
      </Card>

      {/* Entity Tabs */}
      <div className="flex gap-2 flex-wrap">
        {ENTITIES.map((e) => {
          const count = mappings.filter((m) => m.entity === e).length
          return (
            <button
              key={e}
              onClick={() => setEntity(e)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize flex items-center gap-1.5 ${
                entity === e ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {e}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  entity === e ? "bg-primary-foreground/20 text-primary-foreground" : "bg-background"
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Mappings Table */}
      <Card>
        <CardContent className="pt-4">
          {loading ? (
            <p className="text-sm text-muted-foreground text-center py-8">Loading mappings…</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No field mappings for <span className="capitalize font-medium">{entity}</span> yet.
            </p>
          ) : (
            <div className="space-y-2">
              {filtered.map((m) => (
                <div key={m.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                  <div className="flex items-center gap-3 text-sm">
                    <code className="px-2 py-0.5 bg-muted rounded text-xs font-mono">{m.cadicalField}</code>
                    <span className="text-muted-foreground">
                      {m.direction === "both" ? "⇄" : m.direction === "tocrm" ? "→" : "←"}
                    </span>
                    <code className="px-2 py-0.5 bg-muted rounded text-xs font-mono">{m.crmField}</code>
                    <Badge variant="outline" className="text-[10px] capitalize">{m.direction}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteMapping(m.id)}
                    className="h-7 w-7 text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 size={13} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
