"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Truck, Building2, FileText, Shield } from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

const NIGERIA_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu",
  "FCT (Abuja)", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina",
  "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo",
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
]

const SUPPLY_CATEGORIES = [
  "Medical Equipment", "Surgical Equipment", "Diagnostics", "Pharmaceuticals",
  "Consumables", "Laboratory Equipment", "Patient Monitoring", "Rehabilitation",
  "Emergency Equipment", "Imaging Equipment", "Dental Equipment", "Other",
]

const STEPS = [
  { icon: Building2, label: "Company Info" },
  { icon: FileText, label: "KYC Documents" },
  { icon: Shield, label: "Review & Submit" },
]

export default function SupplierRegisterPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    altPhone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    description: "",
    cacNumber: "",
    taxId: "",
    nafdacNumber: "",
    yearEstablished: "",
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

  async function handleSubmit() {
    setLoading(true)
    const res = await fetch("/api/supplier/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setSubmitted(true)
    } else {
      toast.error(data.error || "Registration failed")
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
            <h2 className="text-xl font-bold mb-2">Application Submitted</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Thank you for applying to become a Cadical supplier. Our team will review your application
              and contact you within 3–5 business days.
            </p>
            <div className="p-3 bg-muted rounded-lg mb-6 text-sm">
              <p className="text-muted-foreground text-xs mb-1">What happens next?</p>
              <ul className="text-left space-y-1 text-xs">
                <li>✓ Document verification by our compliance team</li>
                <li>✓ Background and license check</li>
                <li>✓ Approval notification via email</li>
                <li>✓ Portal access granted upon approval</li>
              </ul>
            </div>
            <Button asChild variant="outline">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-card px-8 py-5">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
            <Truck size={18} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Become a Cadical Supplier</h1>
            <p className="text-xs text-muted-foreground">Join Nigeria&apos;s leading medical equipment marketplace</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-10 space-y-6">
        {/* Progress Steps */}
        <div className="flex items-center gap-0">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="flex items-center flex-1">
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  i === step ? "bg-primary text-primary-foreground" :
                  i < step ? "text-emerald-600" : "text-muted-foreground"
                }`}>
                  {i < step ? <CheckCircle size={16} /> : <Icon size={16} />}
                  <span className="hidden sm:block">{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-px mx-2 ${i < step ? "bg-emerald-300" : "bg-border"}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Step 0 – Company Info */}
        {step === 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Company Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Company Name *</Label>
                  <Input required value={form.companyName} onChange={(e) => set("companyName", e.target.value)} placeholder="MedEquip Solutions Ltd." />
                </div>
                <div className="space-y-1.5">
                  <Label>Contact Person *</Label>
                  <Input required value={form.contactName} onChange={(e) => set("contactName", e.target.value)} placeholder="John Adeyemi" />
                </div>
                <div className="space-y-1.5">
                  <Label>Business Email *</Label>
                  <Input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="info@company.ng" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number *</Label>
                  <Input required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+234 801 234 5678" />
                </div>
                <div className="space-y-1.5">
                  <Label>Alt. Phone</Label>
                  <Input value={form.altPhone} onChange={(e) => set("altPhone", e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>Website</Label>
                  <Input type="url" value={form.website} onChange={(e) => set("website", e.target.value)} placeholder="https://company.ng" />
                </div>
                <div className="space-y-1.5">
                  <Label>State *</Label>
                  <Select value={form.state} onValueChange={(v) => set("state", v)}>
                    <SelectTrigger><SelectValue placeholder="Select state…" /></SelectTrigger>
                    <SelectContent>
                      {NIGERIA_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Input required value={form.city} onChange={(e) => set("city", e.target.value)} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Address *</Label>
                <Input required value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="25 Medical Drive, Ikeja" />
              </div>
              <div className="space-y-1.5">
                <Label>Company Description</Label>
                <Textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} placeholder="Brief description of your company and products…" />
              </div>
              <div className="space-y-2">
                <Label>Supply Categories *</Label>
                <div className="flex flex-wrap gap-2">
                  {SUPPLY_CATEGORIES.map((cat) => (
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
              </div>
              <div className="flex justify-end pt-2">
                <Button
                  onClick={() => {
                    if (!form.companyName || !form.contactName || !form.email || !form.phone || !form.state || !form.city || !form.address) {
                      toast.error("Please fill in all required fields")
                      return
                    }
                    if (form.category.length === 0) {
                      toast.error("Select at least one supply category")
                      return
                    }
                    setStep(1)
                  }}
                >
                  Next: KYC Documents
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1 – KYC */}
        {step === 1 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">KYC & Business Documents</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>CAC Registration Number</Label>
                  <Input value={form.cacNumber} onChange={(e) => set("cacNumber", e.target.value)} placeholder="RC1234567" />
                </div>
                <div className="space-y-1.5">
                  <Label>Tax Identification Number (TIN)</Label>
                  <Input value={form.taxId} onChange={(e) => set("taxId", e.target.value)} placeholder="12345678-0001" />
                </div>
                <div className="space-y-1.5">
                  <Label>NAFDAC Number <span className="text-muted-foreground">(if applicable)</span></Label>
                  <Input value={form.nafdacNumber} onChange={(e) => set("nafdacNumber", e.target.value)} placeholder="A7-1234" />
                </div>
                <div className="space-y-1.5">
                  <Label>Year Established</Label>
                  <Input type="number" min="1900" max={new Date().getFullYear()} value={form.yearEstablished} onChange={(e) => set("yearEstablished", e.target.value)} placeholder="2010" />
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                <p className="font-semibold mb-1">Document Upload</p>
                <p className="text-xs">After your application is approved, our team will contact you to collect certified copies of:</p>
                <ul className="text-xs mt-1 list-disc list-inside space-y-0.5">
                  <li>CAC Certificate of Incorporation</li>
                  <li>NAFDAC Registration (for pharma/devices)</li>
                  <li>PCN License (for pharmaceuticals)</li>
                  <li>Tax Clearance Certificate</li>
                  <li>Proof of Business Address</li>
                </ul>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(0)}>Back</Button>
                <Button onClick={() => setStep(2)}>Next: Review</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2 – Review */}
        {step === 2 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Review Your Application</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                {[
                  ["Company", form.companyName],
                  ["Contact", form.contactName],
                  ["Email", form.email],
                  ["Phone", form.phone],
                  ["Location", `${form.city}, ${form.state}`],
                  ["CAC", form.cacNumber || "Not provided"],
                  ["NAFDAC", form.nafdacNumber || "Not provided"],
                  ["Tax ID", form.taxId || "Not provided"],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-right">{value}</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Supply Categories</p>
                <div className="flex flex-wrap gap-1.5">
                  {form.category.map((c) => (
                    <span key={c} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-medium">{c}</span>
                  ))}
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                By submitting, you confirm that all provided information is accurate and you agree to
                Cadical&apos;s Supplier Terms of Service.
              </p>

              <div className="flex justify-between pt-2">
                <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button onClick={handleSubmit} disabled={loading}>
                  {loading ? "Submitting…" : "Submit Application"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
