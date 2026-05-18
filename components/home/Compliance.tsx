"use client"

import { motion } from "framer-motion"
import { ShieldCheck } from "lucide-react"

const ITEMS = [
  { tag: "CAC",    title: "Corporate Affairs Commission",  detail: "RC 8969474 — legally registered entity" },
  { tag: "NAFDAC", title: "Drug & Device Compliance",     detail: "Per-SKU product registration" },
  { tag: "NDPA",   title: "Data Protection",              detail: "privacy@cadical.com" },
  { tag: "ISO",    title: "Quality Standards",            detail: "ISO 13485 aligned processes" },
]

export default function Compliance() {
  return (
    <section id="compliance" className="py-16 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck size={18} className="text-[#1565C0]" />
              <p className="text-[#1565C0] text-xs font-semibold uppercase tracking-widest">Compliance</p>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
              Regulated. Registered. <span className="text-[#1565C0] italic">Auditable.</span>
            </h2>
          </div>
          <p className="text-slate-500 text-sm max-w-sm">Every product and process at Cadical is backed by regulatory compliance.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ITEMS.map((c, i) => (
            <motion.div
              key={c.tag}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="border border-slate-100 p-5 rounded-xl bg-slate-50 hover:shadow-sm transition-shadow"
            >
              <span className="inline-block text-[10px] font-bold bg-blue-100 text-[#1565C0] px-2.5 py-1 rounded-full mb-3 uppercase tracking-widest">
                {c.tag}
              </span>
              <h4 className="font-semibold text-slate-900 text-sm mb-1">{c.title}</h4>
              <p className="text-xs text-slate-500">{c.detail}</p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  )
}
