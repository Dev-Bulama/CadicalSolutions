import { User } from "lucide-react"
import { TechBottomNav } from "@/components/technician/bottom-nav"

export const dynamic = "force-dynamic"

export default function TechnicianLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-muted/20">
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

      <main className="flex-1 pb-20">{children}</main>

      <TechBottomNav />
    </div>
  )
}
