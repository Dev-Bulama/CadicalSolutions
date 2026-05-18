"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { ShieldCheck, Zap, Users, Award } from "lucide-react"

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Certified Products Only",
    desc: "Every product we carry is NAFDAC-registered and manufacturer-verified. No counterfeits, no shortcuts.",
    color: "text-blue-600 bg-blue-50",
  },
  {
    icon: Zap,
    title: "Fast, Dependable Delivery",
    desc: "Lagos same-day, nationwide within 48–72 hours. Your operations don't stop — we make sure of it.",
    color: "text-amber-600 bg-amber-50",
  },
  {
    icon: Users,
    title: "Relationship-Driven",
    desc: "A dedicated account manager, not a ticket system. We pick up the phone and we follow through.",
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    icon: Award,
    title: "Healthcare Specialists",
    desc: "Our team has deep domain knowledge — biomedical engineers, procurement experts, and logistics specialists.",
    color: "text-violet-600 bg-violet-50",
  },
]

export default function Why() {
  return (
    <section id="why" className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-6xl mx-auto">

        <div className="grid md:grid-cols-2 gap-16 items-center">

          {/* Left: image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-2xl">
              <Image src="/test.jpeg" alt="Why Cadical" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D47A1]/60 to-transparent" />

              {/* Floating card */}
              <div className="absolute bottom-5 left-5 right-5 bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <ShieldCheck size={18} className="text-[#1565C0]" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">Trusted by 50+ healthcare facilities</div>
                    <div className="text-xs text-slate-500">Hospitals, clinics and labs across Nigeria</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: content */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[#1565C0] text-xs font-semibold uppercase tracking-widest mb-3">Why Cadical</p>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 leading-tight">
                Reliable supply is not a luxury.<br />
                <span className="text-[#1565C0]">It's the baseline.</span>
              </h2>
              <p className="text-slate-500 mb-8 leading-relaxed">
                Most healthcare supply chains in Nigeria fail at the last mile — late deliveries, wrong products, no follow-up. We built Cadical to be the partner healthcare providers actually deserve.
              </p>
            </motion.div>

            <div className="space-y-4">
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: 16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="flex gap-4 group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.color}`}>
                    <p.icon size={18} />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 text-sm mb-0.5">{p.title}</div>
                    <div className="text-slate-500 text-sm leading-relaxed">{p.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
