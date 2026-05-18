"use client"

export const dynamic = "force-dynamic"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Package, ShoppingCart, TrendingUp, AlertTriangle,
  CheckCircle, Clock, Star, BarChart3, ArrowRight,
} from "lucide-react"
import Link from "next/link"

const MOCK_STATS = [
  { label: "Active Products", value: "24", icon: Package, color: "text-blue-600", change: "+3 this month" },
  { label: "Pending Orders", value: "7", icon: ShoppingCart, color: "text-amber-600", change: "2 urgent" },
  { label: "Monthly Revenue", value: "₦2.4M", icon: TrendingUp, color: "text-emerald-600", change: "+18% vs last month" },
  { label: "Low Stock Alerts", value: "3", icon: AlertTriangle, color: "text-red-600", change: "Action needed" },
]

const RECENT_ORDERS = [
  { id: "ORD-001", product: "Ventilator Unit X500", qty: 2, amount: "₦480,000", status: "PROCESSING" },
  { id: "ORD-002", product: "Surgical Gloves (100 pcs)", qty: 50, amount: "₦75,000", status: "SHIPPED" },
  { id: "ORD-003", product: "Blood Pressure Monitor", qty: 5, amount: "₦125,000", status: "PENDING" },
]

const STATUS_BADGE: Record<string, "default" | "secondary" | "outline"> = {
  PENDING: "secondary",
  PROCESSING: "outline",
  SHIPPED: "default",
}

export default function SupplierDashboard() {
  return (
    <div className="min-h-screen bg-muted/30">
      <div className="border-b border-border bg-card px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <div>
            <p className="font-bold text-sm">Cadical Supplier Portal</p>
            <p className="text-[10px] text-muted-foreground">MedEquip Suppliers Ltd.</p>
          </div>
        </div>
        <Badge variant="default" className="gap-1 text-xs">
          <CheckCircle size={11} />Approved Supplier
        </Badge>
      </div>

      <div className="p-8 max-w-6xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Welcome back. Here&apos;s your business overview.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {MOCK_STATS.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="pt-5 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon size={18} className={stat.color} />
                  </div>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs font-medium mt-0.5">{stat.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{stat.change}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Recent Orders */}
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Orders</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/supplier/orders">View all <ArrowRight size={13} /></Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {RECENT_ORDERS.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium">{order.product}</p>
                        <p className="text-xs text-muted-foreground">Qty: {order.qty} · {order.id}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{order.amount}</p>
                        <Badge variant={STATUS_BADGE[order.status] || "secondary"} className="text-[10px] mt-1">
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Add Product", href: "/supplier/products", icon: Package },
                  { label: "View Orders", href: "/supplier/orders", icon: ShoppingCart },
                  { label: "Analytics", href: "/supplier/analytics", icon: BarChart3 },
                  { label: "Edit Profile", href: "/supplier/profile", icon: Star },
                ].map((action) => {
                  const Icon = action.icon
                  return (
                    <Link
                      key={action.href}
                      href={action.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      <Icon size={16} className="text-muted-foreground" />
                      <span className="text-sm font-medium">{action.label}</span>
                      <ArrowRight size={13} className="ml-auto text-muted-foreground" />
                    </Link>
                  )
                })}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} className="text-amber-500" />
                  <p className="text-sm font-semibold">Performance</p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Overall Rating</span>
                    <span className="font-semibold">4.8/5.0</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">On-time Delivery</span>
                    <span className="font-semibold text-emerald-600">94%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Order Fulfillment</span>
                    <span className="font-semibold text-emerald-600">98%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Return Rate</span>
                    <span className="font-semibold">1.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
