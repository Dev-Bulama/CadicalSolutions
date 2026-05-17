"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts"
import {
  TrendingUp, TrendingDown, Users, ShoppingCart, Package,
  Wrench, Truck, Building2, RefreshCw, DollarSign,
  AlertTriangle, CheckCircle, Activity,
} from "lucide-react"

interface Analytics {
  overview: Record<string, number>
  charts: {
    revenueTrend: { month: string; revenue: number }[]
    topProducts: { name: string; quantity: number; orders: number }[]
    serviceByType: { serviceType: string; _count: { id: number } }[]
  }
}

const COLORS = ["#1565C0", "#2196F3", "#64B5F6", "#BBDEFB", "#E3F2FD"]

function StatCard({
  label, value, icon: Icon, change, changeDir, color, format = "number",
}: {
  label: string
  value: number
  icon: React.ElementType
  change?: number
  changeDir?: "up" | "down"
  color: string
  format?: "number" | "currency"
}) {
  const formatted = format === "currency"
    ? `₦${(value / 1_000_000).toFixed(1)}M`
    : value.toLocaleString()

  return (
    <Card>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between mb-3">
          <div className={`w-9 h-9 rounded-lg ${color} flex items-center justify-center`}>
            <Icon size={18} className="text-white" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center gap-0.5 text-xs font-medium ${changeDir === "up" ? "text-emerald-600" : "text-red-600"}`}>
              {changeDir === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {Math.abs(change)}%
            </div>
          )}
        </div>
        <p className="text-2xl font-bold">{formatted}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </CardContent>
    </Card>
  )
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAnalytics() }, [])

  async function fetchAnalytics() {
    setLoading(true)
    const res = await fetch("/api/analytics")
    const json = await res.json()
    setData(json)
    setLoading(false)
  }

  const ov = data?.overview || {}

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-64">
        <RefreshCw size={24} className="animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Analytics & Intelligence</h1>
          <p className="text-muted-foreground text-sm mt-1">Real-time business metrics across all modules</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAnalytics}>
          <RefreshCw size={14} />
          Refresh
        </Button>
      </div>

      {/* Revenue + Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue" value={ov.totalRevenue || 0} icon={DollarSign}
          color="bg-emerald-600" format="currency"
          change={ov.revenueGrowth} changeDir={(ov.revenueGrowth || 0) >= 0 ? "up" : "down"}
        />
        <StatCard label="Total Orders" value={ov.totalOrders || 0} icon={ShoppingCart} color="bg-blue-600" />
        <StatCard label="Total Users" value={ov.totalUsers || 0} icon={Users} color="bg-violet-600" />
        <StatCard label="Service Bookings" value={ov.totalBookings || 0} icon={Wrench} color="bg-amber-600" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Products" value={ov.totalProducts || 0} icon={Package} color="bg-slate-600" />
        <StatCard label="Approved Suppliers" value={ov.approvedSuppliers || 0} icon={Truck} color="bg-teal-600" />
        <StatCard label="Institutions" value={ov.totalInstitutions || 0} icon={Building2} color="bg-indigo-600" />
        <StatCard label="Open RFQs" value={ov.openRFQs || 0} icon={Activity} color="bg-rose-600" />
      </div>

      {/* Revenue Chart */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Revenue Trend (6 months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data?.charts.revenueTrend || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `₦${(v / 1000000).toFixed(1)}M`} />
                <Tooltip formatter={(v: number) => [`₦${v.toLocaleString()}`, "Revenue"]} />
                <Line type="monotone" dataKey="revenue" stroke="#1565C0" strokeWidth={2.5} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Attention Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { icon: AlertTriangle, label: "Low Stock Products", value: ov.lowStockProducts || 0, color: "text-red-600 bg-red-50", href: "/admin/products" },
              { icon: ShoppingCart, label: "Pending Orders", value: ov.pendingOrders || 0, color: "text-amber-600 bg-amber-50", href: "/admin/orders" },
              { icon: Wrench, label: "Pending Bookings", value: ov.pendingBookings || 0, color: "text-blue-600 bg-blue-50", href: "/admin/service-jobs" },
              { icon: Truck, label: "Pending Suppliers", value: (ov.totalSuppliers || 0) - (ov.approvedSuppliers || 0), color: "text-violet-600 bg-violet-50", href: "/admin/suppliers" },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className={`flex items-center gap-3 p-2.5 rounded-lg ${item.color}`}>
                  <Icon size={16} />
                  <div className="flex-1">
                    <p className="text-xs font-medium">{item.label}</p>
                  </div>
                  <span className="text-sm font-bold">{item.value}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Top Products + Service Types */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.charts.topProducts || []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No order data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={data?.charts.topProducts || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="#1565C0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Service Requests by Type</CardTitle>
          </CardHeader>
          <CardContent>
            {(data?.charts.serviceByType || []).length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No service data yet</p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={data?.charts.serviceByType || []}
                    dataKey="_count.id"
                    nameKey="serviceType"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ serviceType, percent }) =>
                      `${serviceType?.replace(/_/g, " ")?.slice(0, 8)} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {(data?.charts.serviceByType || []).map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v, name) => [v, String(name).replace(/_/g, " ")]} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Technician + CRM Performance */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Technicians", value: ov.activeTechnicians || 0, total: ov.totalTechnicians || 0, icon: Wrench, color: "text-blue-600" },
          { label: "Completed Jobs", value: ov.completedServiceJobs || 0, icon: CheckCircle, color: "text-emerald-600" },
          { label: "CRM Synced Records", value: ov.crmSyncedContacts || 0, icon: Activity, color: "text-violet-600" },
          { label: "Unread Notifications", value: ov.unreadNotifications || 0, icon: AlertTriangle, color: "text-amber-600" },
        ].map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label}>
              <CardContent className="pt-4 pb-3">
                <Icon size={18} className={`${s.color} mb-2`} />
                <p className="text-2xl font-bold">{s.value.toLocaleString()}</p>
                {s.total !== undefined && (
                  <p className="text-xs text-muted-foreground">of {s.total} total</p>
                )}
                <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
