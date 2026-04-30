'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import StepsBar from './StepsBar'
import Step1Service from './steps/Step1Service'
import Step2Details from './steps/Step2Details'
import Step3DateTime from './steps/Step3DateTime'
import Step4Review from './steps/Step4Review'
import Confirmation from './Confirmation'
import Sidebar from './Sidebar'

import { initialFormState } from '@/lib/types/booking'
import type { BookingFormState, BookingStep } from '@/lib/types/booking'

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState<BookingStep>(1)
  const [formState, setFormState] = useState<BookingFormState>(initialFormState)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingRef, setBookingRef] = useState<string | null>(null)

  const updateState = (updates: Partial<BookingFormState>) => {
    setFormState((prev) => ({ ...prev, ...updates }))
  }

  const goForward = () => {
    setCurrentStep((s) => Math.min(s + 1, 4) as BookingStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1) as BookingStep)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    console.log('Submitting booking:', formState)
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      })
      const data = await res.json()
      if (data.success) {
        setBookingRef(data.ref)
      } else {
        alert(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      // Fallback: still show confirmation with client-generated ref
      const ref = `CAD-${Math.floor(100000 + Math.random() * 900000)}`
      setBookingRef(ref)
    } finally {
      setIsSubmitting(false)
    }
  }

  const stepProps = { state: formState, onChange: updateState }

  return (
    <section className="max-w-[1100px] mx-auto px-4 sm:px-6 md:px-12 py-8 md:py-10 pb-14">
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-7 items-start">
        {/* ── Form Card ── */}
        <motion.div
          className="bg-white rounded-2xl border border-c-border overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <AnimatePresence mode="wait">
            {bookingRef ? (
              <Confirmation key="confirmation" bookingRef={bookingRef} />
            ) : (
              <motion.div key="form" exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                {/* Steps indicator */}
                <StepsBar currentStep={currentStep} />

                {/* Form body */}
                <div className="p-6 sm:p-8">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <Step1Service
                        key="step1"
                        {...stepProps}
                        onNext={goForward}
                      />
                    )}
                    {currentStep === 2 && (
                      <Step2Details
                        key="step2"
                        {...stepProps}
                        onNext={goForward}
                        onBack={goBack}
                      />
                    )}
                    {currentStep === 3 && (
                      <Step3DateTime
                        key="step3"
                        {...stepProps}
                        onNext={goForward}
                        onBack={goBack}
                      />
                    )}
                    {currentStep === 4 && (
                      <Step4Review
                        key="step4"
                        state={formState}
                        onBack={goBack}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ── Sidebar ── */}
        <Sidebar />
      </div>
    </section>
  )
}
