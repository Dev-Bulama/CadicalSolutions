"use client"

export const dynamic = "force-dynamic"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  CheckCircle, Wrench, Package, Camera, Calendar,
  ClipboardList, CreditCard, ChevronRight, ChevronLeft, MapPin,
} from "lucide-react"
import { toast } from "sonner"

const SERVICE_TYPES = [
  { value: "INSTALLATION", label: "Installation", desc: "New equipment setup", icon: "🔧" },
  { value: "PREVENTIVE_MAINTENANCE", label: "Preventive Maintenance", desc: "Scheduled upkeep", icon: "🛡️" },
  { value: "REPAIR", label: "Equipment Repair", desc: "Fix malfunctions", icon: "🔩" },
  { value: "EMERGENCY_REPAIR", label: "Emergency Repair", desc: "Urgent breakdown", icon: "🚨" },
  { value: "INSPECTION", label: "Inspection", desc: "Safety & compliance check", icon: "🔍" },
  { value: "CALIBRATION", label: "Calibration", desc: "Precision adjustment", icon: "⚙️" },
  { value: "UPGRADE", label: "Equipment Upgrade", desc: "Performance enhancement", icon: "⬆️" },
  { value: "RELOCATION", label: "Relocation", desc: "Move equipment safely", icon: "📦" },
  { value: "CONSULTATION", label: "Technical Consultation", desc: "Expert advice", icon: "💬" },
  { value: "WARRANTY_SERVICE", label: "Warranty Service", desc: "Under-warranty repair", icon: "✅" },
]

const URGENCY_OPTS = [
  { value: "ROUTINE", label: "Routine", desc: "Within 2 weeks", color: "text-muted-foreground" },
  { value: "NORMAL", label: "Normal", desc: "Within 3–5 days", color: "text-blue-600" },
  { value: "URGENT", label: "Urgent", desc: "Within 24–48 hours", color: "text-amber-600" },
  { value: "EMERGENCY", label: "Emergency", desc: "Same day response", color: "text-red-600" },
]

const STEPS = [
  { label: "Equipment", icon: Package },
  { label: "Service Type", icon: Wrench },
  { label: "Describe Issue", icon: ClipboardList },
  { label: "Upload Media", icon: Camera },
  { label: "Schedule", icon: Calendar },
  { label: "Location", icon: MapPin },
  { label: "Review", icon: CheckCircle },
]

export default function ServiceBookingPage() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [bookingCode, setBookingCode] = useState("")
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    equipmentName: "",
    equipmentModel: "",
    equipmentSerial: "",
    equipmentBrand: "",
    serviceType: "",
    urgency: "NORMAL",
    issueDescription: "",
    severity: "",
    equipmentCondition: "",
    // Dynamic fields
    siteReadiness: "",
    electricalReq: "",
    installationAddress: "",
    faultDescription: "",
    siteAddress: "",
    siteCity: "",
    siteState: "",
    siteContact: "",
    sitePhone: "",
    preferredDate: "",
    preferredTimeSlot: "",
    alternateDate: "",
    notes: "",
  })

  function set(k: string, v: string) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  const isInstallation = form.serviceType === "INSTALLATION"
  const isRepair = ["REPAIR", "EMERGENCY_REPAIR"].includes(form.serviceType)

  async function handleSubmit() {
    setLoading(true)
    const res = await fetch("/api/service-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        dynamicFields: isInstallation
          ? { siteReadiness: form.siteReadiness, electricalReq: form.electricalReq }
          : isRepair
          ? { faultDescription: form.faultDescription, severity: form.severity }
          : undefined,
      }),
    })
    const data = await res.json()
    if (res.ok) {
      setBookingCode(data.booking.bookingCode)
      setSubmitted(true)
    } else {
      toast.error(data.error || "Booking failed")
    }
    setLoading(false)
  }

  function nextStep() {
    // Validation per step
    if (step === 0 && !form.equipmentName) { toast.error("Equipment name is required"); return }
    if (step === 1 && !form.serviceType) { toast.error("Select a service type"); return }
    if (step === 2 && !form.issueDescription) { toast.error("Describe the issue"); return }
    if (step === 5 && (!form.siteAddress || !form.siteCity || !form.siteState)) { toast.error("Site address is required"); return }
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-muted/30 flex items-center justify-center p-6">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-10 pb-8">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold mb-2">Booking Confirmed</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Your service request has been received. Our team will review and assign a technician shortly.
            </p>
            <div className="p-3 bg-muted rounded-lg mb-4">
              <p className="text-xs text-muted-foreground">Booking Reference</p>
              <p className="font-mono font-bold text-lg">{bookingCode}</p>
            </div>
            <div className="text-xs text-muted-foreground text-left space-y-1 mb-6 p-3 bg-blue-50 rounded-lg">
              <p className="font-medium text-blue-800 mb-1">What happens next?</p>
              <p>✓ Booking review within 2 hours</p>
              <p>✓ Technician assignment notification</p>
              <p>✓ Real-time status updates via SMS/app</p>
              <p>✓ Technician arrives at scheduled time</p>
            </div>
            <Button onClick={() => window.location.href = "/"}>Return to Home</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Wrench size={16} className="text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold">Book a Service</h1>
            <p className="text-xs text-muted-foreground">Medical equipment service request</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Step Progress */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon
            return (
              <div key={s.label} className="flex items-center shrink-0">
                <div
                  className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    i === step
                      ? "bg-primary text-primary-foreground"
                      : i < step
                      ? "text-emerald-600 bg-emerald-50"
                      : "text-muted-foreground"
                  }`}
                >
                  {i < step ? <CheckCircle size={13} /> : <Icon size={13} />}
                  <span className="hidden sm:block">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <ChevronRight size={12} className="text-muted-foreground mx-0.5" />
                )}
              </div>
            )
          })}
        </div>

        {/* Step 0: Equipment */}
        {step === 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package size={16} className="text-primary" />
                Equipment Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <Label>Equipment Name *</Label>
                <Input value={form.equipmentName} onChange={(e) => set("equipmentName", e.target.value)} placeholder="e.g. Philips Ventilator" />
              </div>
              <div className="space-y-1.5">
                <Label>Brand / Manufacturer</Label>
                <Input value={form.equipmentBrand} onChange={(e) => set("equipmentBrand", e.target.value)} placeholder="Philips, GE, Siemens…" />
              </div>
              <div className="space-y-1.5">
                <Label>Model Number</Label>
                <Input value={form.equipmentModel} onChange={(e) => set("equipmentModel", e.target.value)} placeholder="V60 Plus" />
              </div>
              <div className="col-span-2 space-y-1.5">
                <Label>Serial Number</Label>
                <Input value={form.equipmentSerial} onChange={(e) => set("equipmentSerial", e.target.value)} placeholder="SN12345678" />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 1: Service Type */}
        {step === 1 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Wrench size={16} className="text-primary" />
                Select Service Type
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {SERVICE_TYPES.map((s) => (
                  <button
                    key={s.value}
                    onClick={() => set("serviceType", s.value)}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      form.serviceType === s.value
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <div className="text-lg mb-1">{s.icon}</div>
                    <p className="text-sm font-semibold">{s.label}</p>
                    <p className="text-xs text-muted-foreground">{s.desc}</p>
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label>Urgency Level</Label>
                <div className="grid grid-cols-2 gap-2">
                  {URGENCY_OPTS.map((u) => (
                    <button
                      key={u.value}
                      onClick={() => set("urgency", u.value)}
                      className={`p-3 rounded-lg border-2 text-left transition-all ${
                        form.urgency === u.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
                      }`}
                    >
                      <p className={`text-sm font-semibold ${u.color}`}>{u.label}</p>
                      <p className="text-xs text-muted-foreground">{u.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Describe Issue (Dynamic) */}
        {step === 2 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <ClipboardList size={16} className="text-primary" />
                Describe the Issue
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Issue Description *</Label>
                <Textarea
                  value={form.issueDescription}
                  onChange={(e) => set("issueDescription", e.target.value)}
                  placeholder="Describe what's happening with the equipment…"
                  rows={4}
                />
              </div>

              {/* Dynamic fields for Repair */}
              {isRepair && (
                <>
                  <div className="space-y-1.5">
                    <Label>Fault Description</Label>
                    <Textarea
                      value={form.faultDescription}
                      onChange={(e) => set("faultDescription", e.target.value)}
                      placeholder="Specific fault codes, error messages, symptoms…"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label>Issue Severity</Label>
                      <Select value={form.severity} onValueChange={(v) => set("severity", v)}>
                        <SelectTrigger><SelectValue placeholder="Select severity…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low — Equipment works partially</SelectItem>
                          <SelectItem value="medium">Medium — Reduced performance</SelectItem>
                          <SelectItem value="high">High — Equipment not functional</SelectItem>
                          <SelectItem value="critical">Critical — Patient safety risk</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Equipment Condition</Label>
                      <Select value={form.equipmentCondition} onValueChange={(v) => set("equipmentCondition", v)}>
                        <SelectTrigger><SelectValue placeholder="Select condition…" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Good (minor issue)</SelectItem>
                          <SelectItem value="fair">Fair (moderate damage)</SelectItem>
                          <SelectItem value="poor">Poor (extensive damage)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {/* Dynamic fields for Installation */}
              {isInstallation && (
                <>
                  <div className="space-y-1.5">
                    <Label>Site Readiness</Label>
                    <Select value={form.siteReadiness} onValueChange={(v) => set("siteReadiness", v)}>
                      <SelectTrigger><SelectValue placeholder="Is site ready for installation?" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ready">Site is ready</SelectItem>
                        <SelectItem value="needs_prep">Site needs preparation</SelectItem>
                        <SelectItem value="not_sure">Not sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Electrical / Infrastructure Requirements</Label>
                    <Textarea
                      value={form.electricalReq}
                      onChange={(e) => set("electricalReq", e.target.value)}
                      placeholder="Power supply specs, voltage, special outlets required…"
                      rows={2}
                    />
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <Label>Additional Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={(e) => set("notes", e.target.value)}
                  placeholder="Any other information you want us to know…"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Upload Media */}
        {step === 3 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Camera size={16} className="text-primary" />
                Upload Equipment Images
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
                <Camera size={32} className="text-muted-foreground mx-auto mb-3" />
                <p className="font-medium text-sm">Upload Equipment Photos</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Photos help our technicians prepare and bring the right tools
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Select Images
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Supported: JPG, PNG, HEIC · Max 10 files · 10MB each
              </p>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                <strong>Tip:</strong> Take photos showing the issue area, model/serial number label, and surrounding environment.
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Schedule */}
        {step === 4 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar size={16} className="text-primary" />
                Preferred Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Preferred Date *</Label>
                  <Input
                    type="date"
                    value={form.preferredDate}
                    onChange={(e) => set("preferredDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Preferred Time Slot</Label>
                  <Select value={form.preferredTimeSlot} onValueChange={(v) => set("preferredTimeSlot", v)}>
                    <SelectTrigger><SelectValue placeholder="Select time…" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="8am-10am">8:00 AM – 10:00 AM</SelectItem>
                      <SelectItem value="10am-12pm">10:00 AM – 12:00 PM</SelectItem>
                      <SelectItem value="12pm-2pm">12:00 PM – 2:00 PM</SelectItem>
                      <SelectItem value="2pm-4pm">2:00 PM – 4:00 PM</SelectItem>
                      <SelectItem value="4pm-6pm">4:00 PM – 6:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2 space-y-1.5">
                  <Label>Alternate Date <span className="text-muted-foreground">(optional)</span></Label>
                  <Input
                    type="date"
                    value={form.alternateDate}
                    onChange={(e) => set("alternateDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Location */}
        {step === 5 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin size={16} className="text-primary" />
                Service Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label>Site Address *</Label>
                <Input value={form.siteAddress} onChange={(e) => set("siteAddress", e.target.value)} placeholder="25 Hospital Road, Surulere" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>City *</Label>
                  <Input value={form.siteCity} onChange={(e) => set("siteCity", e.target.value)} placeholder="Lagos" />
                </div>
                <div className="space-y-1.5">
                  <Label>State *</Label>
                  <Input value={form.siteState} onChange={(e) => set("siteState", e.target.value)} placeholder="Lagos" />
                </div>
                <div className="space-y-1.5">
                  <Label>On-site Contact Name</Label>
                  <Input value={form.siteContact} onChange={(e) => set("siteContact", e.target.value)} placeholder="Dr. Emeka Obi" />
                </div>
                <div className="space-y-1.5">
                  <Label>On-site Contact Phone</Label>
                  <Input value={form.sitePhone} onChange={(e) => set("sitePhone", e.target.value)} placeholder="+234 801 234 5678" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Review */}
        {step === 6 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <CheckCircle size={16} className="text-primary" />
                Review Your Request
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {[
                  { label: "Equipment", value: `${form.equipmentName}${form.equipmentBrand ? ` (${form.equipmentBrand})` : ""}` },
                  { label: "Service", value: SERVICE_TYPES.find((s) => s.value === form.serviceType)?.label || form.serviceType },
                  { label: "Urgency", value: URGENCY_OPTS.find((u) => u.value === form.urgency)?.label || form.urgency },
                  { label: "Location", value: `${form.siteAddress}, ${form.siteCity}, ${form.siteState}` },
                  { label: "Preferred Date", value: form.preferredDate || "Not specified" },
                  { label: "Time Slot", value: form.preferredTimeSlot || "Flexible" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between py-2 border-b border-border/50 text-sm">
                    <span className="text-muted-foreground">{label}</span>
                    <span className="font-medium text-right max-w-[60%]">{value}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs font-medium mb-1">Issue Description</p>
                <p className="text-xs text-muted-foreground">{form.issueDescription}</p>
              </div>
              <p className="text-xs text-muted-foreground">
                By submitting, you agree to Cadical's Service Terms. A technician will be assigned and you'll receive SMS/email updates.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(s - 1, 0))} disabled={step === 0}>
            <ChevronLeft size={15} />
            Back
          </Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight size={15} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Submitting…" : "Confirm Booking"}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
