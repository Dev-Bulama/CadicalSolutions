"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { MapPin } from "lucide-react"

const CITIES = [
  { city: "Lagos",      time: "Same-day",  },
  { city: "Abuja",      time: "24–48hrs"   },
  { city: "Port Harcourt", time: "24–48hrs" },
  { city: "Kano",       time: "48–72hrs"   },
  { city: "Ibadan",     time: "24–48hrs"   },
  { city: "Enugu",      time: "48–72hrs"   },
]

export default function Coverage() {
  return (
    <section className="py-20 px-4 md:px-8 bg-[#0D47A1] relative overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-14 items-center">

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <MapPin size={16} className="text-[#F5A623]" />
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Nationwide Coverage</p>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight font-serif">
            Where we <span className="italic text-teal-300">deliver.</span>
          </h2>

          <p className="text-white/65 mb-8 leading-relaxed">
            Fast, reliable delivery of medical equipment and supplies across Nigeria's major cities and beyond.
          </p>

          <div className="grid grid-cols-2 gap-3">
            {CITIES.map(c => (
              <div key={c.city} className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5">
                <span className="text-white text-sm font-medium">{c.city}</span>
                <span className="text-teal-300 text-xs font-semibold">{c.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="relative w-[300px] md:w-[360px] aspect-square rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
            <Image src="/deliveries.png" alt="Nationwide Delivery" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0D47A1]/40 to-transparent" />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
