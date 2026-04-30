'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

interface ConfirmationProps {
  bookingRef: string
}

export default function Confirmation({ bookingRef }: ConfirmationProps) {
  return (
    <motion.div
      className="text-center px-8 py-12"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {/* Icon */}
      <motion.div
        className="w-[72px] h-[72px] bg-c-green-light rounded-full flex items-center justify-center text-[32px] mx-auto mb-5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20, delay: 0.1 }}
      >
        ✅
      </motion.div>

      <motion.h2
        className="font-playfair font-bold text-[26px] text-c-text mb-2.5"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        Booking Received.
      </motion.h2>

      <motion.p
        className="text-[14px] text-c-muted leading-[1.7] max-w-[380px] mx-auto mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        Thank you. Your booking request has been submitted. The Cadical team
        will confirm your appointment within 24 hours via phone or WhatsApp.
      </motion.p>

      <motion.div
        className="inline-block bg-c-blue-light border border-c-border rounded-lg px-5 py-2.5 text-[13px] text-c-blue font-semibold mb-6"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.35 }}
      >
        Ref: {bookingRef}
      </motion.div>

      <motion.div
        className="flex gap-3 justify-center flex-wrap"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.45 }}
      >
        <a
          href="https://wa.me/2347076175550"
          className="inline-flex items-center gap-1.5 px-6 py-[11px] bg-c-blue text-white rounded-lg text-[14px] font-semibold no-underline transition-all duration-200 hover:bg-c-blue-dark hover:shadow-btn-blue hover:-translate-y-px"
        >
          Message Us on WhatsApp
        </a>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-6 py-[11px] bg-transparent text-c-muted border-[1.5px] border-c-border rounded-lg text-[14px] font-semibold no-underline transition-all duration-200 hover:border-c-blue hover:text-c-blue"
        >
          Back to Home
        </Link>
      </motion.div>
    </motion.div>
  )
}
