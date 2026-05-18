"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Grid3X3, Wrench, ShoppingCart, User } from "lucide-react"
import { useCart } from "@/context/cart-context"

const ITEMS = [
  { icon: Home,       label: "Home",       href: "/"         },
  { icon: Grid3X3,    label: "Categories", href: "/products" },
  { icon: Wrench,     label: "Services",   href: "/booking"  },
  { icon: ShoppingCart, label: "Cart",     href: "/cart"     },
  { icon: User,       label: "Account",    href: "/auth/login"},
]

export function BottomNav() {
  const pathname  = usePathname()
  const { totalItems } = useCart()

  // Only show on pages where it makes sense
  const show = ["/", "/products", "/booking", "/cart"].some(p => pathname === p || pathname.startsWith(p + "?"))
  if (!show) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      {/* Glassmorphism background */}
      <div className="mx-3 mb-3 rounded-2xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-900/10">
        <div className="flex items-center justify-around px-2 py-1.5">
          {ITEMS.map(item => {
            const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)
            const isCart = item.href === "/cart"
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all ${
                  active ? "text-[#1565C0]" : "text-slate-400 hover:text-slate-700"
                }`}
              >
                <div className={`relative p-1.5 rounded-xl transition-colors ${active ? "bg-blue-50" : ""}`}>
                  <item.icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                  {isCart && totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-[#F5A623] text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] font-medium ${active ? "text-[#1565C0]" : ""}`}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
