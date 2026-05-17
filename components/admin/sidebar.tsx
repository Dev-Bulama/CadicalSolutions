"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard, Package, Users, LogOut, ShoppingCart,
  Calendar, Building2, GitBranch, Truck, Plug, BarChart3,
  ChevronDown, ChevronRight, Stethoscope,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface NavItem {
  name: string
  href?: string
  icon: React.ElementType
  children?: { name: string; href: string }[]
}

const navItems: NavItem[] = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Bookings", href: "/admin/bookings", icon: Calendar },
  { name: "Clinicians", href: "/admin/clinicians", icon: Stethoscope },
  { name: "Services", href: "/admin/services", icon: BarChart3 },
  { name: "Referrals", href: "/admin/referrals", icon: GitBranch },
  { name: "Institutions", href: "/admin/institutions", icon: Building2 },
  {
    name: "Suppliers",
    icon: Truck,
    children: [
      { name: "All Suppliers", href: "/admin/suppliers" },
      { name: "Pending KYC", href: "/admin/suppliers/pending" },
      { name: "Products", href: "/admin/suppliers/products" },
      { name: "RFQ Management", href: "/admin/rfq" },
      { name: "Bulk Orders", href: "/admin/bulk-orders" },
    ],
  },
  {
    name: "Integrations",
    icon: Plug,
    children: [
      { name: "CRM Overview", href: "/admin/integrations/crm" },
      { name: "Connect CRM", href: "/admin/integrations/crm/connect" },
      { name: "Field Mapping", href: "/admin/integrations/crm/mappings" },
      { name: "Automations", href: "/admin/integrations/crm/automations" },
      { name: "Sync Logs", href: "/admin/integrations/crm/logs" },
      { name: "Failed Jobs", href: "/admin/integrations/crm/failed-jobs" },
      { name: "Webhook Logs", href: "/admin/integrations/crm/webhooks" },
      { name: "Setup Wizard", href: "/admin/integrations/crm/setup-wizard" },
    ],
  },
  { name: "Users", href: "/admin/users", icon: Users },
]

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const isChildActive = item.children?.some((c) => pathname.startsWith(c.href))
  const [open, setOpen] = useState(isChildActive ?? false)

  if (!item.children) {
    const isActive = pathname === item.href
    const Icon = item.icon
    return (
      <Link
        href={item.href!}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
          isActive
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Icon size={17} />
        {item.name}
      </Link>
    )
  }

  const Icon = item.icon
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
          isChildActive
            ? "text-primary bg-primary/5"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
      >
        <Icon size={17} />
        <span className="flex-1 text-left">{item.name}</span>
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && (
        <div className="ml-6 mt-1 space-y-0.5 border-l border-border pl-3">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "block px-2 py-1.5 rounded-md text-xs font-medium transition-colors",
                pathname === child.href || pathname.startsWith(child.href + "/")
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-60 border-r border-border bg-card flex flex-col shrink-0">
      <div className="px-5 py-5 border-b border-border">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <div>
            <p className="font-bold text-sm leading-none">Cadical</p>
            <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Admin Console</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {navItems.map((item) => (
          <NavGroup key={item.name} item={item} pathname={pathname} />
        ))}
      </nav>

      <div className="p-3 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" asChild>
          <Link href="/api/auth/signout">
            <LogOut size={16} />
            Sign out
          </Link>
        </Button>
      </div>
    </aside>
  )
}
