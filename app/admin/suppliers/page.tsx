"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import {
  CheckCircle, XCircle, Clock, RefreshCw, Search,
  Building2, Phone, Mail, Package, Star, Truck,
} from "lucide-react"
import { toast } from "sonner"

interface Supplier {
  id: string
  companyName: string
  contactName: string
  email: string
  phone: string
  category: string[]
  state: string
  status: string
  isActive: boolean
  rating: number
  createdAt: string
  _count: { products: number; rfqBids: number; bulkOrders: number; documents: number }
}

const STATUS_CONFIG: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline"; icon: React.ElementType }> = {
  PENDING: { label: "Pending", variant: "secondary", icon: Clock },
  APPROVED: { label: "Approved", variant: "default", icon: CheckCircle },
  REJECTED: { label: "Rejected", variant: "destructive", icon: XCircle },
  SUSPENDED: { label: "Suspended", variant: "outline", icon: XCircle },
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState("")
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSuppliers() }, [statusFilter])

  async function fetchSuppliers() {
    setLoading(true)
    const params = new URLSearchParams({ limit: "50" })
    if (statusFilter) params.set("status", statusFilter)
    const res = await fetch(`/api/admin/suppliers?${params}`)
    const data = await res.json()
    setSuppliers(data.suppliers || [])
    setTotal(data.total || 0)
    setLoading(false)
  }

  async function updateStatus(id: string, status: string) {
    const res = await fetch("/api/admin/suppliers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      toast.success(`Supplier ${status.toLowerCase()}`)
      await fetchSuppliers()
    } else {
      toast.error("Failed to update status")
    }
  }

  const filtered = suppliers.filter((s) =>
    !search ||
    s.companyName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: suppliers.length,
    pending: suppliers.filter((s) => s.status === "PENDING").length,
    approved: suppliers.filter((s) => s.status === "APPROVED").length,
    rejected: suppliers.filter((s) => s.status === "REJECTED").length,
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground text-sm mt-1">{total} registered suppliers</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchSuppliers}>
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: stats.total, color: "text-foreground" },
          { label: "Pending KYC", value: stats.pending, color: "text-amber-600" },
          { label: "Approved", value: stats.approved, color: "text-emerald-600" },
          { label: "Rejected", value: stats.rejected, color: "text-red-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-5 pb-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search suppliers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
            <SelectItem value="SUSPENDED">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Suppliers Grid */}
      {loading ? (
        <p className="text-sm text-muted-foreground text-center py-12">Loading suppliers…</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-12">No suppliers found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((supplier) => {
            const sc = STATUS_CONFIG[supplier.status] || STATUS_CONFIG.PENDING
            const Icon = sc.icon
            return (
              <Card key={supplier.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Building2 size={18} className="text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{supplier.companyName}</p>
                          <Badge variant={sc.variant} className="text-[10px] gap-1">
                            <Icon size={10} />
                            {sc.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{supplier.contactName}</p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Mail size={11} />{supplier.email}</span>
                          <span className="flex items-center gap-1"><Phone size={11} />{supplier.phone}</span>
                          <span>{supplier.state}, Nigeria</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {supplier.category.slice(0, 3).map((c) => (
                            <Badge key={c} variant="outline" className="text-[10px]">{c}</Badge>
                          ))}
                          {supplier.category.length > 3 && (
                            <Badge variant="outline" className="text-[10px]">+{supplier.category.length - 3}</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-center shrink-0">
                      <div>
                        <p className="text-sm font-bold">{supplier._count.products}</p>
                        <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-center"><Package size={9} />Products</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold">{supplier._count.rfqBids}</p>
                        <p className="text-[10px] text-muted-foreground">RFQ Bids</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold flex items-center gap-0.5">
                          <Star size={11} className="text-amber-500" />
                          {supplier.rating.toFixed(1)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">Rating</p>
                      </div>
                      <div className="flex flex-col gap-1.5">
                        {supplier.status === "PENDING" && (
                          <>
                            <Button size="sm" onClick={() => updateStatus(supplier.id, "APPROVED")} className="h-7 text-xs">
                              Approve
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => updateStatus(supplier.id, "REJECTED")} className="h-7 text-xs">
                              Reject
                            </Button>
                          </>
                        )}
                        {supplier.status === "APPROVED" && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(supplier.id, "SUSPENDED")} className="h-7 text-xs">
                            Suspend
                          </Button>
                        )}
                        {(supplier.status === "REJECTED" || supplier.status === "SUSPENDED") && (
                          <Button size="sm" variant="outline" onClick={() => updateStatus(supplier.id, "APPROVED")} className="h-7 text-xs">
                            Reinstate
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
