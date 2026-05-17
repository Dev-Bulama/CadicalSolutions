"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw, FileText, Calendar, DollarSign, Users } from "lucide-react"
import { toast } from "sonner"

interface RFQ {
  id: string
  rfqCode: string
  title: string
  contactName: string
  contactEmail: string
  organization: string | null
  category: string[]
  quantity: number
  targetBudget: number | null
  currency: string
  status: string
  closingDate: string | null
  createdAt: string
  _count: { bids: number }
}

const STATUS_COLOR: Record<string, string> = {
  OPEN: "text-emerald-700 bg-emerald-50 border-emerald-200",
  CLOSED: "text-muted-foreground bg-muted",
  AWARDED: "text-blue-700 bg-blue-50 border-blue-200",
  CANCELLED: "text-red-700 bg-red-50 border-red-200",
}

export default function RFQAdminPage() {
  const [rfqs, setRfqs] = useState<RFQ[]>([])
  const [status, setStatus] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchRFQs() }, [status])

  async function fetchRFQs() {
    setLoading(true)
    const params = new URLSearchParams()
    if (status) params.set("status", status)
    const res = await fetch(`/api/rfq?${params}`)
    const data = await res.json()
    setRfqs(data.rfqs || [])
    setLoading(false)
  }

  async function updateStatus(id: string, newStatus: string) {
    await fetch("/api/rfq", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: newStatus }),
    })
    toast.success(`RFQ marked as ${newStatus.toLowerCase()}`)
    await fetchRFQs()
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">RFQ Management</h1>
          <p className="text-muted-foreground text-sm mt-1">Request for Quotation submissions from hospitals and institutions</p>
        </div>
        <div className="flex gap-2">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All</SelectItem>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
              <SelectItem value="AWARDED">Awarded</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={fetchRFQs}>
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading RFQs…</p>
      ) : rfqs.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No RFQs found.</p>
      ) : (
        <div className="space-y-3">
          {rfqs.map((rfq) => (
            <Card key={rfq.id}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{rfq.title}</p>
                        <code className="text-[10px] text-muted-foreground font-mono">{rfq.rfqCode}</code>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_COLOR[rfq.status]}`}>
                          {rfq.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {rfq.contactName}{rfq.organization ? ` · ${rfq.organization}` : ""} · {rfq.contactEmail}
                      </p>
                      <div className="flex items-center gap-4 mt-1.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users size={11} />Qty: {rfq.quantity}
                        </span>
                        {rfq.targetBudget && (
                          <span className="flex items-center gap-1">
                            <DollarSign size={11} />
                            Budget: {rfq.currency} {rfq.targetBudget.toLocaleString()}
                          </span>
                        )}
                        {rfq.closingDate && (
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            Closes: {new Date(rfq.closingDate).toLocaleDateString()}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FileText size={11} />{rfq._count.bids} bid{rfq._count.bids !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {rfq.category.slice(0, 4).map((c) => (
                          <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  {rfq.status === "OPEN" && (
                    <div className="flex gap-1.5 shrink-0">
                      <Button size="sm" variant="outline" onClick={() => updateStatus(rfq.id, "CLOSED")} className="h-7 text-xs">
                        Close
                      </Button>
                      <Button size="sm" onClick={() => updateStatus(rfq.id, "AWARDED")} className="h-7 text-xs">
                        Award
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
