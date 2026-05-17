"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, FileText, Building2, Package, DollarSign, Calendar } from "lucide-react"
import { toast } from "sonner"

const CATEGORIES = [
  "Diagnostic Equipment", "Surgical Equipment", "Patient Monitoring",
  "Rehabilitation Equipment", "Emergency Equipment", "Pharmaceuticals",
  "Consumables", "Laboratory Equipment", "Imaging Equipment", "Other",
]

export default function RFQPage() {
  const [submitted, setSubmitted] = useState(false)
  const [rfqCode, setRfqCode] = useState("")
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    organization: "",
    title: "",
    description: "",
    specifications: "",
    quantity: "",
    targetBudget: "",
    currency: "NGN",
    deliveryDate: "",
    deliveryAddress: "",
    closingDate: "",
    category: [] as string[],
  })

  function set(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function toggleCategory(cat: string) {
    setForm((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat],
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.category.length === 0) {
      toast.error("Please select at least one category")
      return
    }
    setLoading(true)
    const res = await fetch("/api/rfq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setRfqCode(data.rfq.rfqCode)
      setSubmitted(true)
    } else {
      toast.error(data.error || "Failed to submit RFQ")
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-10 pb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">RFQ Submitted Successfully</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Your request for quotation has been received. Approved suppliers will submit bids within 48–72 hours.
            </p>
            <div className="p-3 bg-muted rounded-lg mb-6">
              <p className="text-xs text-muted-foreground">Your RFQ Reference</p>
              <p className="font-mono font-bold text-lg">{rfqCode}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Save your reference code. Our team will contact you at the email provided to share supplier bids.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-card px-8 py-5">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
              <FileText size={18} className="text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-lg">Request for Quotation</h1>
              <p className="text-xs text-muted-foreground">Submit your medical equipment procurement requirements</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 size={16} className="text-primary" />
                Organization & Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input required value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="Dr. Amara Osei" />
              </div>
              <div className="space-y-1.5">
                <Label>Organization / Hospital</Label>
                <Input value={form.organization} onChange={(e) => set("organization", e.target.value)} placeholder="Lagos General Hospital" />
              </div>
              <div className="space-y-1.5">
                <Label>Email Address *</Label>
                <Input required type="email" value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} placeholder="procurement@hospital.ng" />
              </div>
              <div className="space-y-1.5">
                <Label>Phone Number *</Label>
                <Input required value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} placeholder="+234 801 234 5678" />
              </div>
            </CardContent>
          </Card>

          {/* Request Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package size={16} className="text-primary" />
                Equipment Requirements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>RFQ Title *</Label>
                <Input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. ICU Ventilators for 20-bed ward" />
              </div>
              <div className="space-y-1.5">
                <Label>Description *</Label>
                <Textarea
                  required
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe what you need, intended use, environment, etc."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Equipment Categories *</Label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                        form.category.includes(cat)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "border-border text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {form.category.length > 0 && (
                  <p className="text-xs text-muted-foreground">{form.category.length} selected</p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label>Technical Specifications</Label>
                <Textarea
                  value={form.specifications}
                  onChange={(e) => set("specifications", e.target.value)}
                  placeholder="List technical specs, certifications required, brand preferences, etc."
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <Label>Quantity Required *</Label>
                  <Input required type="number" min="1" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} placeholder="10" />
                </div>
                <div className="space-y-1.5">
                  <Label>Target Budget</Label>
                  <Input type="number" value={form.targetBudget} onChange={(e) => set("targetBudget", e.target.value)} placeholder="500000" />
                </div>
                <div className="space-y-1.5">
                  <Label>Currency</Label>
                  <Select value={form.currency} onValueChange={(v) => set("currency", v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN (₦)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Delivery & Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Delivery & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Required Delivery Date</Label>
                <Input type="date" value={form.deliveryDate} onChange={(e) => set("deliveryDate", e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Bid Closing Date</Label>
                <Input type="date" value={form.closingDate} onChange={(e) => set("closingDate", e.target.value)} />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Delivery Address</Label>
                <Input value={form.deliveryAddress} onChange={(e) => set("deliveryAddress", e.target.value)} placeholder="Full delivery address" />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              By submitting, you agree that your requirements will be shared with approved Cadical suppliers.
            </p>
            <Button type="submit" disabled={loading} size="lg">
              {loading ? "Submitting…" : "Submit RFQ"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
