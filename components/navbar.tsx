"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect, useRef } from "react"
import { Menu, X, Search, ShoppingCart, User, ChevronDown, Package, Wrench, Building2, BarChart3, MapPin } from "lucide-react"
import { useCart } from "@/context/cart-context"
import { usePathname } from "next/navigation"

const CATEGORIES = [
  { name: "Diagnostics",     href: "/products?category=Diagnostics" },
  { name: "Imaging",         href: "/products?category=Imaging" },
  { name: "ICU Equipment",   href: "/products?category=ICU" },
  { name: "Surgical",        href: "/products?category=Surgery" },
  { name: "Laboratory",      href: "/products?category=Laboratory" },
  { name: "Monitoring",      href: "/products?category=Monitoring" },
  { name: "Dental",          href: "/products?category=Dental" },
  { name: "Rehabilitation",  href: "/products?category=Rehabilitation" },
  { name: "Consumables",     href: "/products?category=Consumables" },
]

const SERVICES = [
  { icon: Wrench,    name: "Equipment Repair",   href: "/booking" },
  { icon: BarChart3, name: "Maintenance Plans",  href: "/booking" },
  { icon: Building2, name: "Institutional Supply",href: "/institutional-portal" },
  { icon: MapPin,    name: "Track Order",        href: "/track" },
]

export function Navbar() {
  const [open, setOpen]           = useState(false)
  const [scrolled, setScrolled]   = useState(false)
  const [prodOpen, setProdOpen]   = useState(false)
  const [servOpen, setServOpen]   = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQ, setSearchQ]     = useState("")
  const pathname                  = usePathname()
  const { totalItems }            = useCart()
  const searchRef                 = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQ.trim()) window.location.href = `/products?search=${encodeURIComponent(searchQ)}`
  }

  const isHome = pathname === "/"

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-white/98 backdrop-blur-md shadow-sm border-b border-slate-100" : "bg-white"
    } h-16 flex items-center px-4 md:px-8 justify-between`}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
        <Image src="/images/logo.png" alt="Cadical" width={32} height={32} className="w-8 h-8 rounded-lg" />
        <div className="leading-tight hidden sm:block">
          <div className="text-[#1565C0] text-sm font-bold tracking-tight">Cadical Solutions</div>
          <div className="text-[10px] text-slate-400 font-medium">Right Supply. Right Time.</div>
        </div>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center gap-1 text-sm font-medium text-slate-600">

        {/* Products dropdown */}
        <div className="relative" onMouseEnter={() => setProdOpen(true)} onMouseLeave={() => setProdOpen(false)}>
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#1565C0] transition-colors">
            <Package size={15} /> Products <ChevronDown size={13} className={`transition-transform ${prodOpen ? "rotate-180" : ""}`} />
          </button>
          {prodOpen && (
            <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
              <div className="px-3 py-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">Categories</div>
              {CATEGORIES.map(c => (
                <Link key={c.name} href={c.href} className="block px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#1565C0] transition-colors">
                  {c.name}
                </Link>
              ))}
              <div className="border-t border-slate-100 mt-2 pt-2 px-3">
                <Link href="/products" className="text-sm font-semibold text-[#1565C0] hover:underline">View all products →</Link>
              </div>
            </div>
          )}
        </div>

        {/* Services dropdown */}
        <div className="relative" onMouseEnter={() => setServOpen(true)} onMouseLeave={() => setServOpen(false)}>
          <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#1565C0] transition-colors">
            <Wrench size={15} /> Services <ChevronDown size={13} className={`transition-transform ${servOpen ? "rotate-180" : ""}`} />
          </button>
          {servOpen && (
            <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50">
              {SERVICES.map(s => (
                <Link key={s.name} href={s.href} className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-[#1565C0] transition-colors">
                  <s.icon size={14} className="text-[#1565C0]" /> {s.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        <Link href="/institutional-portal" className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#1565C0] transition-colors">Institutional</Link>
        {isHome && <a href="#why" className="px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#1565C0] transition-colors">About</a>}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1">

        {/* Search */}
        {searchOpen ? (
          <form onSubmit={handleSearch} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
            <Search size={14} className="text-slate-400" />
            <input
              ref={searchRef}
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search equipment..."
              className="bg-transparent text-sm outline-none w-40 text-slate-700 placeholder:text-slate-400"
            />
            <button type="button" onClick={() => setSearchOpen(false)}><X size={14} className="text-slate-400 hover:text-slate-600" /></button>
          </form>
        ) : (
          <button onClick={() => setSearchOpen(true)} className="hidden md:flex p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-[#1565C0] transition-colors">
            <Search size={18} />
          </button>
        )}

        {/* Cart */}
        <Link href="/cart" className="relative p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-[#1565C0] transition-colors">
          <ShoppingCart size={18} />
          {totalItems > 0 && (
            <span className="absolute -top-0.5 -right-0.5 bg-[#F5A623] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              {totalItems > 9 ? "9+" : totalItems}
            </span>
          )}
        </Link>

        {/* Account */}
        <Link href="/auth/login" className="hidden md:flex p-2 rounded-lg hover:bg-slate-50 text-slate-500 hover:text-[#1565C0] transition-colors">
          <User size={18} />
        </Link>

        {/* Book CTA */}
        <Link href="/booking" className="hidden lg:inline-flex items-center gap-1.5 bg-[#1565C0] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0d47a1] transition-colors ml-1">
          Book Service
        </Link>

        {/* Mobile hamburger */}
        <button className="lg:hidden p-2 rounded-lg hover:bg-slate-50 text-slate-600 ml-1" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-slate-100 shadow-lg lg:hidden z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
          <form onSubmit={handleSearch} className="mx-4 mt-4 mb-3 flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
            <Search size={14} className="text-slate-400" />
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search equipment..." className="bg-transparent text-sm outline-none flex-1 text-slate-700" />
          </form>

          <div className="px-4 py-2 space-y-1">
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pt-2 pb-1">Products</div>
            {CATEGORIES.map(c => (
              <Link key={c.name} href={c.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-slate-700 hover:text-[#1565C0] border-b border-slate-50">
                {c.name}
              </Link>
            ))}

            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pt-4 pb-1">Services</div>
            {SERVICES.map(s => (
              <Link key={s.name} href={s.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-slate-700 hover:text-[#1565C0] border-b border-slate-50">
                {s.name}
              </Link>
            ))}

            <div className="pt-4 pb-4 flex flex-col gap-2">
              <Link href="/booking" onClick={() => setOpen(false)} className="bg-[#1565C0] text-white px-4 py-2.5 rounded-lg text-sm font-semibold text-center">Book a Service</Link>
              <Link href="/auth/login" onClick={() => setOpen(false)} className="border border-slate-200 text-slate-700 px-4 py-2.5 rounded-lg text-sm font-semibold text-center">Sign In</Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
