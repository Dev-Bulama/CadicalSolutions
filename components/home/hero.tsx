import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="min-h-screen bg-[#0d47a1] pt-32 pb-20 px-6 md:px-12 relative overflow-hidden">

      {/* grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* radial accents */}
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(245,166,35,0.12)_0%,transparent_70%)]" />
      <div className="absolute -bottom-24 -left-24 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)]" />

      {/* MAIN GRID */}
      <div className="relative z-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT CONTENT */}
        <div className="max-w-2xl">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-[#F5A623] text-xs font-semibold tracking-widest uppercase border border-[#F5A623]/30 bg-[#F5A623]/10 px-4 py-1 rounded-full mb-6"
          >
            🇳🇬 Reliable Healthcare supply
            
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-5xl md:text-6xl font-bold leading-tight font-serif mb-5"
          >
            delivered with<br />care.<br />
            <span className="text-[#F5A623]">supply.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white/70 text-lg leading-relaxed mb-10"
          >
            Medical equipment, pharmaceutical products and specialist services for hospitals, clinics, and individuals across Nigeria.
          </motion.p>

          <div className="flex flex-wrap gap-3">
            <Link href={'/products'} className="bg-[#F5A623] text-white px-6 py-3 rounded font-semibold">
              Shop Pharmacy
            </Link>
            <Link href={'/products?type=institutional'} className="bg-white text-[#1565C0] px-6 py-3 rounded font-semibold">
              Order Supplies
            </Link>
            <Link href={'#services'} className="border border-white/30 text-white px-6 py-3 rounded font-semibold">
              Our Services
            </Link>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative w-full h-[420px] md:h-[520px]">
          <Image
            src="/images/mri.jpeg"
            alt="Healthcare"
            fill
            className="object-cover rounded-2xl"
            priority
          />
        </div>

      </div>

      {/* stats */}
      <div className="relative z-10 mt-20 border-t border-white/10 pt-10 flex flex-wrap gap-10">
        {[
          ["100+", "Active clients served"],
          ["3+", "Years in Nigerian healthcare"],
          ["24hr", "Service response time"],
          ["100%", "Certified products only"]
        ].map((s, i) => (
          <div key={i}>
            <div className="text-white text-3xl font-bold font-serif">{s[0]}</div>
            <div className="text-white/50 text-xs">{s[1]}</div>
          </div>
        ))}
      </div>

    </section>
  );
}