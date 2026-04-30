'use client'

import { motion } from 'framer-motion'

const badges = [
  'We confirm within 24 hours',
  'Physical & virtual available',
  'Free first consultation',
]

export default function PageHeader() {
  return (
    <div className="bg-blue-800 relative overflow-hidden">
      {/* Grid pattern overlay */}
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      <div className="relative z-10 max-w-[1100px] mx-auto px-6 md:px-12 py-10 md:py-[52px] flex flex-wrap justify-between items-end gap-6">
        {/* Left: Title & description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="font-playfair font-bold text-[28px] sm:text-[34px] md:text-[38px] text-white leading-[1.15] mb-2">
            Book a <span className="text-amber-600">Service</span>
          </h1>
          <p className="text-[14px] md:text-[15px] text-white/65 leading-[1.7] font-light max-w-[460px]">
            Schedule equipment maintenance, a repair visit or a healthcare
            supply consultation — physical or virtual.
          </p>
        </motion.div>

        {/* Right: Badges */}
        <motion.div
          className="flex flex-col gap-2.5 items-start sm:items-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {badges.map((badge, i) => (
            <motion.div
              key={badge}
              className="flex items-center gap-2 bg-white/[0.08] border border-white/[0.15] rounded-lg px-4 py-2.5 text-white/80 text-[13px] font-medium"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 + i * 0.08 }}
            >
              <span className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0" />
              {badge}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
