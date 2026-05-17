"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, ExternalLink, Plug } from "lucide-react"
import { toast } from "sonner"

const CRM_OPTIONS = [
  { id: "zoho", name: "Zoho CRM", available: true, desc: "Full OAuth integration with bi-directional sync" },
  { id: "hubspot", name: "HubSpot", available: false, desc: "Coming soon" },
  { id: "salesforce", name: "Salesforce", available: false, desc: "Coming soon" },
  { id: "freshsales", name: "Freshsales", available: false, desc: "Coming soon" },
]

export default function ConnectCrmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const connected = searchParams.get("connected")
  const error = searchParams.get("error")

  const [selectedCrm, setSelectedCrm] = useState("zoho")
  const [clientId, setClientId] = useState("")
  const [clientSecret, setClientSecret] = useState("")
  const [organizationId, setOrganizationId] = useState("")
  const [saving, setSaving] = useState(false)

  const redirectUri =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/admin/crm/zoho/callback`
      : ""

  async function handleSave() {
    if (!clientId || !clientSecret) {
      toast.error("Client ID and Client Secret are required")
      return
    }
    setSaving(true)
    const res = await fetch("/api/admin/crm/connection", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: selectedCrm,
        clientId,
        clientSecret,
        redirectUri,
        organizationId,
      }),
    })
    const data = await res.json()
    if (data.connection) {
      toast.success("Credentials saved. Click Authorize to connect.")
      router.refresh()
    } else {
      toast.error("Failed to save credentials")
    }
    setSaving(false)
  }

  async function handleAuthorize() {
    window.location.href = "/api/admin/crm/zoho/authorize"
  }

  return (
    <div className="p-6 max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Connect CRM</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Choose your CRM platform and enter credentials to connect Cadical.
        </p>
      </div>

      {connected && (
        <div className="flex items-center gap-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
          <CheckCircle size={18} />
          <span className="font-medium">CRM connected successfully!</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{decodeURIComponent(error)}</span>
        </div>
      )}

      {/* CRM Selection */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Select CRM Platform</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {CRM_OPTIONS.map((crm) => (
            <button
              key={crm.id}
              onClick={() => crm.available && setSelectedCrm(crm.id)}
              disabled={!crm.available}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                selectedCrm === crm.id
                  ? "border-primary bg-primary/5"
                  : crm.available
                  ? "border-border hover:border-primary/40"
                  : "border-border opacity-50 cursor-not-allowed"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-sm">{crm.name}</span>
                {crm.available ? (
                  <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-300">
                    Available
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-[10px]">Soon</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{crm.desc}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Zoho Credentials */}
      {selectedCrm === "zoho" && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Zoho CRM Credentials</CardTitle>
            <CardDescription>
              Get these from your{" "}
              <a
                href="https://api-console.zoho.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1 hover:underline"
              >
                Zoho API Console <ExternalLink size={12} />
              </a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Client ID</Label>
              <Input
                placeholder="1000.XXXXXXXXXXXX"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Client Secret</Label>
              <Input
                type="password"
                placeholder="••••••••••••••••"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Organization ID <span className="text-muted-foreground">(optional)</span></Label>
              <Input
                placeholder="Your Zoho org ID"
                value={organizationId}
                onChange={(e) => setOrganizationId(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Redirect URI <span className="text-xs text-muted-foreground">(copy to Zoho app)</span></Label>
              <div className="flex gap-2">
                <Input value={redirectUri} readOnly className="bg-muted text-muted-foreground font-mono text-xs" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(redirectUri)
                    toast.success("Copied!")
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving} variant="outline">
                {saving ? "Saving…" : "Save Credentials"}
              </Button>
              <Button onClick={handleAuthorize} className="gap-2">
                <Plug size={15} />
                Authorize with Zoho
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-muted-foreground">
        Need help? View the{" "}
        <a href="/admin/integrations/crm/setup-wizard" className="text-primary hover:underline">
          step-by-step setup wizard
        </a>
        .
      </p>
    </div>
  )
}
