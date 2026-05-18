"use client"

import { useState, useEffect, useCallback } from "react"
import useEmblaCarousel from "embla-carousel-react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Search, Shield, Truck, Award, Clock } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

const SLIDES = [
  {
    badge: "Medical Equipment Marketplace",
    headline: "Premium Medical Equipment for Hospitals, Clinics & Healthcare Providers",
    sub: "Source verified, certified medical devices from trusted suppliers across Nigeria.",
    cta1: { label: "Shop Equipment", href: "/products" },
    cta2: { label: "Request Quote", href: "/booking" },
    image: "/mri.jpeg",
    accent: "from-[#0D47A1] via-[#1565C0] to-[#1976D2]",
  },
  {
    badge: "Medical Services",
    headline: "Installation, Maintenance & Repair Services Nationwide",
    sub: "Certified biomedical engineers at your facility within 24–48 hours.",
    cta1: { label: "Book a Service", href: "/booking" },
    cta2: { label: "View Service Plans", href: "/booking" },
    image: "/test.jpeg",
    accent: "from-[#004D40] via-[#00695C] to-[#00796B]",
  },
  {
    badge: "Hospital Procurement",
    headline: "Bulk Procurement Solutions for Healthcare Institutions",
    sub: "Streamlined procurement with institutional pricing, invoicing, and dedicated account managers.",
    cta1: { label: "Procurement Request", href: "/institutional-portal" },
    cta2: { label: "Talk to Specialist", href: "/booking" },
    image: "/home-image.jpeg",
    accent: "from-[#1A237E] via-[#283593] to-[#303F9F]",
  },
  {
    badge: "Supplier Marketplace",
    headline: "Trusted Medical Suppliers & Vendors Across Nigeria",
    sub: "Partner with verified suppliers to grow your medical equipment business.",
    cta1: { label: "Become a Supplier", href: "/auth/register" },
    cta2: { label: "Explore Products", href: "/products" },
    image: "/Cadical.jpg",
    accent: "from-[#4A148C] via-[#6A1B9A] to-[#7B1FA2]",
  },
]

const TRUST_BADGES = [
  { icon: Shield, label: "Verified Suppliers" },
  { icon: Award,  label: "Certified Equipment" },
  { icon: Truck,  label: "Nationwide Delivery" },
  { icon: Clock,  label: "24hr Response" },
]

export default function Hero() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 30 })
  const [current, setCurrent] = useState(0)
  const [searchQ, setSearchQ] = useState("")
  const [paused, setPaused] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on("select", () => setCurrent(emblaApi.selectedScrollSnap()))
  }, [emblaApi])

  useEffect(() => {
    if (paused || !emblaApi) return
    const timer = setInterval(() => emblaApi.scrollNext(), 5000)
    return () => clearInterval(timer)
  }, [emblaApi, paused])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQ.trim()) window.location.href = `/products?search=${encodeURIComponent(searchQ)}`
  }

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "calc(100vh - 4rem)", minHeight: 560, maxHeight: 780 }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Carousel */}
      <div ref={emblaRef} className="h-full overflow-hidden">
        <div className="flex h-full">
          {SLIDES.map((slide, i) => (
            <div key={i} className="relative flex-[0_0_100%] h-full min-w-0">
              {/* Background image */}
              <div className="absolute inset-0">
                <Image src={slide.image} alt={slide.badge} fill className="object-cover" priority={i === 0} />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.accent} opacity-85`} />
                {/* Grid texture */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-center px-6 md:px-16 max-w-5xl">
                <AnimatePresence mode="wait">
                  {current === i && (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -16 }}
                      transition={{ duration: 0.5 }}
                    >
                      <span className="inline-block text-white/90 text-xs font-semibold tracking-widest uppercase border border-white/30 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full mb-5">
                        {slide.badge}
                      </span>

                      <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-serif mb-4 max-w-3xl">
                        {slide.headline}
                      </h1>

                      <p className="text-white/75 text-base md:text-lg leading-relaxed mb-8 max-w-xl">
                        {slide.sub}
                      </p>

                      <div className="flex flex-wrap gap-3 mb-10">
                        <Link href={slide.cta1.href} className="bg-[#F5A623] hover:bg-[#e0962a] text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:scale-105 shadow-lg">
                          {slide.cta1.label}
                        </Link>
                        <Link href={slide.cta2.href} className="bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-lg font-semibold text-sm transition-all">
                          {slide.cta2.label}
                        </Link>
                      </div>

                      {/* Search bar */}
                      <form onSubmit={handleSearch} className="flex items-center gap-2 bg-white rounded-xl shadow-xl overflow-hidden max-w-lg p-1.5">
                        <Search size={16} className="text-slate-400 ml-2 flex-shrink-0" />
                        <input
                          value={searchQ}
                          onChange={e => setSearchQ(e.target.value)}
                          placeholder="Search equipment, services, suppliers..."
                          className="flex-1 text-sm text-slate-700 outline-none placeholder:text-slate-400 py-1.5 bg-transparent"
                        />
                        <button type="submit" className="bg-[#1565C0] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#0d47a1] transition-colors flex-shrink-0">
                          Search
                        </button>
                      </form>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arrow controls */}
      <button onClick={scrollPrev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white p-2.5 rounded-full transition-all">
        <ChevronLeft size={20} />
      </button>
      <button onClick={scrollNext} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/15 hover:bg-white/30 backdrop-blur-sm border border-white/20 text-white p-2.5 rounded-full transition-all">
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${i === current ? "bg-white w-6 h-2" : "bg-white/40 w-2 h-2"}`}
          />
        ))}
      </div>

      {/* Trust badges */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/40 to-transparent">
        <div className="max-w-5xl mx-auto px-6 md:px-16 py-4">
          <div className="flex flex-wrap gap-4 sm:gap-8">
            {TRUST_BADGES.map((b, i) => (
              <div key={i} className="flex items-center gap-2">
                <b.icon size={14} className="text-[#F5A623]" />
                <span className="text-white/80 text-xs font-medium">{b.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
