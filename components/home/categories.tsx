"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  Scan, Activity, Heart, Scissors, FlaskConical,
  Eye, Monitor, Accessibility, Package2
} from "lucide-react"

const CATS = [
  { icon: Scan,          name: "Imaging",        sub: "Ultrasound, X-Ray, CT",       href: "/products?category=Imaging",       color: "bg-blue-50 text-blue-600 border-blue-100" },
  { icon: Activity,      name: "Diagnostics",    sub: "Analyzers, POC, Reagents",     href: "/products?category=Diagnostics",   color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { icon: Heart,         name: "ICU Equipment",  sub: "Ventilators, Monitors",        href: "/products?category=ICU",           color: "bg-red-50 text-red-600 border-red-100" },
  { icon: Scissors,      name: "Surgical",       sub: "Instruments, Electrosurgery",  href: "/products?category=Surgery",       color: "bg-violet-50 text-violet-600 border-violet-100" },
  { icon: FlaskConical,  name: "Laboratory",     sub: "Centrifuges, PCR, Incubators", href: "/products?category=Laboratory",    color: "bg-amber-50 text-amber-600 border-amber-100" },
  { icon: Monitor,       name: "Monitoring",     sub: "Vital Signs, ECG, Oximetry",   href: "/products?category=Monitoring",    color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  { icon: Eye,           name: "Dental",         sub: "CBCT, Handpieces, Scalers",    href: "/products?category=Dental",        color: "bg-pink-50 text-pink-600 border-pink-100" },
  { icon: Accessibility, name: "Rehabilitation", sub: "Wheelchairs, Therapy",         href: "/products?category=Rehabilitation",color: "bg-orange-50 text-orange-600 border-orange-100" },
  { icon: Package2,      name: "Consumables",    sub: "Gloves, IV Sets, Dressings",   href: "/products?category=Consumables",   color: "bg-slate-50 text-slate-600 border-slate-100" },
]

export default function Categories() {
  return (
    <section className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-7xl mx-auto">

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-[#1565C0] text-xs font-semibold uppercase tracking-widest mb-2">Browse by Category</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">Find the right equipment</h2>
          </div>
          <Link href="/products" className="text-sm text-[#1565C0] font-semibold hover:underline hidden sm:block">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {CATS.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
            >
              <Link
                href={cat.href}
                className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl border ${cat.color} hover:shadow-md hover:-translate-y-1 transition-all duration-200 text-center group`}
              >
                <div className="p-2.5 rounded-lg bg-white/60 group-hover:bg-white transition-colors">
                  <cat.icon size={20} />
                </div>
                <span className="text-xs font-semibold leading-tight">{cat.name}</span>
                <span className="text-[10px] text-slate-500 leading-tight hidden md:block">{cat.sub}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 sm:hidden text-center">
          <Link href="/products" className="text-sm text-[#1565C0] font-semibold hover:underline">
            View all categories →
          </Link>
        </div>
      </div>
    </section>
  )
}
