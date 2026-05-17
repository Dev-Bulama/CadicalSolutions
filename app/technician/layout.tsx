"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Briefcase, Calendar, MapPin, Bell, User } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV = [
  { href: "/technician/jobs", icon: Briefcase, label: "Jobs" },
  { href: "/technician/schedule", icon: Calendar, label: "Schedule" },
  { href: "/technician/tracking", icon: MapPin, label: "Tracking" },
  { href: "/technician/notifications", icon: Bell, label: "Alerts" },
  { href: "/technician/profile", icon: User, label: "Profile" },
]

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
      {/* Top bar */}
      <header className="bg-card border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">C</span>
          </div>
          <span className="font-bold text-sm">Cadical Tech</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <User size={16} className="text-primary" />
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 pb-20">{children}</main>

      {/* Mobile bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border safe-area-pb">
        <div className="grid grid-cols-5 max-w-lg mx-auto">
          {NAV.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2 px-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon size={20} className={isActive ? "fill-primary/10" : ""} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
