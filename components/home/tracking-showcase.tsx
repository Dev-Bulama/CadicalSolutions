"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { CheckCircle2, Clock, Truck, Package, MapPin } from "lucide-react"

const STAGES = [
  { icon: CheckCircle2, label: "Order Placed",     desc: "Order confirmed & payment processed",  done: true,  active: false },
  { icon: Package,      label: "Processing",       desc: "Equipment verified and packed",         done: true,  active: false },
  { icon: Truck,        label: "Dispatched",       desc: "In transit via certified carrier",      done: true,  active: true  },
  { icon: MapPin,       label: "Out for Delivery", desc: "Near your location",                    done: false, active: false },
  { icon: CheckCircle2, label: "Delivered",        desc: "Signed & received by your facility",    done: false, active: false },
]

export default function TrackingShowcase() {
  return (
    <section className="py-20 px-4 md:px-8 bg-white">
      <div className="max-w-5xl mx-auto">

        <div className="grid md:grid-cols-2 gap-12 items-center">

          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#1565C0] text-xs font-semibold uppercase tracking-widest mb-3">Real-Time Tracking</p>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
              Always know where your order is.
            </h2>
            <p className="text-slate-500 leading-relaxed mb-6">
              From the moment you place an order to the point of delivery, you have full visibility into every step of your shipment. No calls required.
            </p>
            <ul className="space-y-2 mb-8 text-sm text-slate-600">
              {["Live status updates via SMS & email", "Estimated delivery window", "Delivery confirmation & proof"].map((t, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" /> {t}
                </li>
              ))}
            </ul>
            <Link href="/products" className="inline-flex items-center gap-2 bg-[#1565C0] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#0d47a1] transition-colors">
              Track Your Order
            </Link>
          </motion.div>

          {/* Right: timeline UI */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
          >
            {/* Mock order header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
              <div>
                <div className="text-xs text-slate-400 mb-0.5">Order</div>
                <div className="font-bold text-slate-900 font-mono text-sm">CAD-M3Q9Z-2026</div>
              </div>
              <span className="bg-amber-100 text-amber-700 text-[11px] font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <Clock size={10} /> In Transit
              </span>
            </div>

            {/* Timeline */}
            <div className="space-y-0">
              {STAGES.map((stage, i) => (
                <div key={stage.label} className="flex gap-4 relative">
                  {/* Line */}
                  {i < STAGES.length - 1 && (
                    <div className={`absolute left-[18px] top-8 bottom-0 w-0.5 ${stage.done ? "bg-[#1565C0]" : "bg-slate-200"}`} style={{ height: "calc(100% - 8px)" }} />
                  )}

                  {/* Icon */}
                  <div className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    stage.active ? "bg-[#1565C0] ring-4 ring-blue-100" :
                    stage.done   ? "bg-[#1565C0]" : "bg-slate-200"
                  }`}>
                    <stage.icon size={16} className={stage.done || stage.active ? "text-white" : "text-slate-400"} />
                  </div>

                  <div className="pb-5">
                    <div className={`text-sm font-semibold ${stage.active ? "text-[#1565C0]" : stage.done ? "text-slate-900" : "text-slate-400"}`}>
                      {stage.label}
                      {stage.active && <span className="ml-2 text-[10px] bg-blue-100 text-[#1565C0] px-2 py-0.5 rounded-full font-medium">Now</span>}
                    </div>
                    <div className={`text-xs mt-0.5 ${stage.done || stage.active ? "text-slate-500" : "text-slate-300"}`}>{stage.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  )
}
