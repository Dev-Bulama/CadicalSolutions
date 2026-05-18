"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { ShoppingBag, Building2, Wrench, Check, ArrowRight } from "lucide-react"

const PORTALS = [
  {
    icon: ShoppingBag,
    badge: "For Everyone",
    title: "MediStore",
    sub: "Browse and order certified medical equipment online. Fast delivery anywhere in Nigeria.",
    color: "border-blue-200 bg-blue-50/50",
    iconColor: "bg-blue-100 text-blue-700",
    features: ["NAFDAC-certified products", "Secure card & transfer payment", "Fast nationwide delivery", "Order tracking & history"],
    cta: { label: "Browse Products", href: "/products" },
    accent: "#1565C0",
  },
  {
    icon: Building2,
    badge: "For Institutions",
    title: "Supply Portal",
    sub: "Dedicated procurement platform for hospitals, clinics, and healthcare institutions.",
    color: "border-emerald-200 bg-emerald-50/50 ring-2 ring-emerald-200",
    iconColor: "bg-emerald-100 text-emerald-700",
    features: ["Institutional bulk pricing", "Auto-invoicing & delivery notes", "Monthly supply agreements", "Dedicated account manager"],
    cta: { label: "Open Portal", href: "/institutional-portal" },
    accent: "#059669",
    popular: true,
  },
  {
    icon: Wrench,
    badge: "Physical & Virtual",
    title: "Services",
    sub: "Qualified engineers and biomedical technicians for equipment maintenance and repair.",
    color: "border-violet-200 bg-violet-50/50",
    iconColor: "bg-violet-100 text-violet-700",
    features: ["Equipment repair & calibration", "Preventive maintenance plans", "Supply chain consultation", "24hr emergency response"],
    cta: { label: "Book Service", href: "/booking" },
    accent: "#7C3AED",
  },
]

export default function Portals() {
  return (
    <section id="portals" className="py-20 px-4 md:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-[#1565C0] text-xs font-semibold uppercase tracking-widest mb-3">What We Offer</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">One platform. Three ways to access us.</h2>
          <p className="text-slate-500 max-w-xl mx-auto">Whether you're a hospital, clinic, or individual — we have the right solution for your healthcare supply needs.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PORTALS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`relative bg-white rounded-2xl border p-6 flex flex-col hover:shadow-lg transition-all duration-300 ${p.color}`}
            >
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">
                  Most Popular
                </span>
              )}

              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${p.iconColor}`}>
                <p.icon size={22} />
              </div>

              <div className="text-[10px] font-semibold uppercase tracking-widest text-slate-400 mb-1">{p.badge}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{p.title}</h3>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">{p.sub}</p>

              <ul className="space-y-2.5 mb-6 flex-1">
                {p.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm text-slate-700">
                    <Check size={14} className="mt-0.5 flex-shrink-0" style={{ color: p.accent }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={p.cta.href}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold border transition-all hover:gap-3"
                style={{ color: p.accent, borderColor: p.accent + "40", backgroundColor: p.accent + "08" }}
              >
                {p.cta.label} <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
