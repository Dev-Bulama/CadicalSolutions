"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Wrench, Settings, Gauge, Phone, ArrowRight } from "lucide-react"

const SERVICES = [
  {
    icon: Wrench,
    title: "Equipment Repair",
    desc: "Fast on-site diagnosis and repair for all major brands — Philips, GE, Siemens, Mindray and more.",
    tags: ["Imaging", "ICU", "Diagnostics"],
    color: "text-blue-600 bg-blue-50",
    cta: "Book Repair",
  },
  {
    icon: Settings,
    title: "Preventive Maintenance",
    desc: "Scheduled quarterly or annual maintenance contracts to keep your equipment running at peak performance.",
    tags: ["Annual Plans", "Quarterly", "Reports"],
    color: "text-emerald-600 bg-emerald-50",
    cta: "Get a Plan",
  },
  {
    icon: Gauge,
    title: "Calibration",
    desc: "Certified calibration services for diagnostic and measurement equipment to regulatory standards.",
    tags: ["ISO 9001", "Certificates", "Auditable"],
    color: "text-violet-600 bg-violet-50",
    cta: "Book Calibration",
  },
  {
    icon: Phone,
    title: "Supply Consultation",
    desc: "Expert procurement advice for hospitals, clinics and institutions on sourcing, budgeting, and contracts.",
    tags: ["Free Consult", "Procurement", "Budget"],
    color: "text-amber-600 bg-amber-50",
    cta: "Talk to Us",
  },
]

export default function Services() {
  return (
    <section id="services" className="py-20 px-4 md:px-8 bg-slate-50">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-[#1565C0] text-xs font-semibold uppercase tracking-widest mb-3">Medical Services</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">We don't just supply — we support.</h2>
          <p className="text-slate-500 max-w-xl mx-auto">From emergency repair to scheduled maintenance, our certified engineers keep your equipment operational.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SERVICES.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
                <s.icon size={20} />
              </div>

              <h3 className="font-bold text-slate-900 mb-2">{s.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed mb-4 flex-1">{s.desc}</p>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {s.tags.map(t => (
                  <span key={t} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>

              <Link
                href="/booking"
                className="flex items-center gap-1.5 text-sm font-semibold text-[#1565C0] hover:gap-2.5 transition-all"
              >
                {s.cta} <ArrowRight size={13} />
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-[#1565C0] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[#0d47a1] transition-colors shadow-lg shadow-blue-200"
          >
            Book Any Service <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}
