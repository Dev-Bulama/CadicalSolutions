"use client"

import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"

const TESTIMONIALS = [
  {
    name: "Dr. Amaka Okafor",
    role: "Medical Director",
    org: "St. Raphael's Specialist Hospital, Lagos",
    text: "Cadical has transformed how we procure medical equipment. The institutional portal is seamless — we raised a purchase order and had our ultrasound machines delivered in 48 hours. Exceptional service.",
    rating: 5,
  },
  {
    name: "Engr. Taiwo Balogun",
    role: "Biomedical Engineer",
    org: "University College Hospital, Ibadan",
    text: "Their maintenance engineers are genuinely knowledgeable. We had a Philips monitor down at 2am and their team was on-site by morning. That kind of reliability is rare in Nigeria.",
    rating: 5,
  },
  {
    name: "Mrs. Ngozi Eze",
    role: "Head of Procurement",
    org: "Redeemed Healthcare Centre, Abuja",
    text: "We've used three other suppliers before Cadical. None of them offered the level of after-sales support and product certification documentation that Cadical provides as standard.",
    rating: 5,
  },
  {
    name: "Dr. Emmanuel Adeyemi",
    role: "Lab Director",
    org: "Synlab Nigeria, Lagos",
    text: "The diagnostic equipment we sourced through Cadical has been performing flawlessly for over a year. The calibration certificates and service reports were impeccable.",
    rating: 5,
  },
]

export default function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", () => setCurrent(emblaApi.selectedScrollSnap()))
    const timer = setInterval(() => emblaApi.scrollNext(), 6000)
    return () => clearInterval(timer)
  }, [emblaApi])

  return (
    <section className="py-20 px-4 md:px-8 bg-slate-50">
      <div className="max-w-5xl mx-auto">

        <div className="text-center mb-12">
          <p className="text-[#1565C0] text-xs font-semibold uppercase tracking-widest mb-3">Testimonials</p>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900">What healthcare professionals say</h2>
        </div>

        <div ref={emblaRef} className="overflow-hidden">
          <div className="flex">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="flex-[0_0_100%] md:flex-[0_0_50%] px-3">
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-slate-100 rounded-2xl p-6 h-full shadow-sm"
                >
                  <Quote size={28} className="text-blue-100 mb-3" />

                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={13} className="text-[#F5A623] fill-[#F5A623]" />
                    ))}
                  </div>

                  <p className="text-slate-700 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>

                  <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                    <div className="w-10 h-10 rounded-full bg-[#1565C0]/10 flex items-center justify-center text-[#1565C0] font-bold text-sm flex-shrink-0">
                      {t.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                      <div className="text-xs text-slate-500">{t.role}, {t.org}</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${i === current ? "bg-[#1565C0] w-5 h-2" : "bg-slate-300 w-2 h-2"}`}
            />
          ))}
        </div>

      </div>
    </section>
  )
}
