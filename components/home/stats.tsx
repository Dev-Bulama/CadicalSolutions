"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useInView } from "framer-motion"

const STATS = [
  { value: 100,  suffix: "+",  label: "Products Available",    sub: "Across 9 categories" },
  { value: 50,   suffix: "+",  label: "Healthcare Clients",    sub: "Hospitals & clinics" },
  { value: 99,   suffix: "%",  label: "Certified Products",    sub: "NAFDAC & ISO compliant" },
  { value: 24,   suffix: "hr", label: "Service Response",      sub: "Emergency & planned" },
]

function Counter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = Date.now()
    const step = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * value))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [inView, value])

  return (
    <span ref={ref} className="tabular-nums">
      {count}{suffix}
    </span>
  )
}

export default function Stats() {
  return (
    <section className="py-16 px-4 md:px-8 bg-[#0D47A1]">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center"
            >
              <div className="text-4xl md:text-5xl font-bold text-white font-serif mb-1">
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="text-white font-semibold text-sm mb-0.5">{s.label}</div>
              <div className="text-white/50 text-xs">{s.sub}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
