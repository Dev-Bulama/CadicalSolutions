'use client'

import { motion } from 'framer-motion'
import type { BookingStep } from '@/lib/types/booking'

interface StepsBarProps {
  currentStep: BookingStep
}

const steps = [
  { id: 1, label: 'Service', shortLabel: 'Service' },
  { id: 2, label: 'Your Details', shortLabel: 'Details' },
  { id: 3, label: 'Date & Time', shortLabel: 'Date' },
  { id: 4, label: 'Confirm', shortLabel: 'Confirm' },
]

export default function StepsBar({ currentStep }: StepsBarProps) {
  return (
    <div className="bg-transparent border-b border-c-border px-4 sm:px-8 flex items-center">
      {steps.map((step, index) => {
        const isDone = step.id < currentStep
        const isActive = step.id === currentStep
        const isPending = step.id > currentStep

        return (
          <div
            key={step.id}
            className="step-item-connector flex items-center gap-2 py-4 flex-1 min-w-0"
          >
            {/* Circle */}
            <motion.div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-colors duration-300 ${
                isDone
                  ? 'bg-green-600 text-white'
                  : isActive
                  ? 'bg-blue-600 text-white'
                  : 'bg-c-border text-c-muted'
              }`}
              animate={{
                scale: isActive ? [1, 1.1, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            >
              {isDone ? '✓' : step.id}
            </motion.div>

            {/* Label */}
            <span
              className={`text-[12px] sm:text-[12.5px] font-medium transition-colors duration-300 truncate ${
                isDone
                  ? 'text-green-600'
                  : isActive
                  ? 'text-blue-600 font-semibold'
                  : 'text-c-muted'
              }`}
            >
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.shortLabel}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
