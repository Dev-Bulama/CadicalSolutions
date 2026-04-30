'use client'

import { motion } from 'framer-motion'
import type { BookingFormState } from '@/lib/types/booking'

interface Step4Props {
  state: BookingFormState
  onBack: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-c-border gap-4 last:border-b-0">
      <span className="text-[13px] text-c-muted flex-shrink-0">{label}</span>
      <span className="text-[13px] text-c-text font-medium text-right">{value}</span>
    </div>
  )
}

function buildSummary(state: BookingFormState) {
  const svcMap: Record<string, string> = {
    maintenance: '🔧 Equipment Maintenance & Repair',
    consultation: '💬 Supply Consultation',
  }

  const service = state.service ? svcMap[state.service] : '—'

  const type =
    state.service === 'maintenance'
      ? state.issueType || '—'
      : state.consultType || '—'

  const name = [state.firstName, state.lastName].filter(Boolean).join(' ') +
    (state.orgName ? ` — ${state.orgName}` : '') || '—'

  const contact = [state.phone, state.email].filter(Boolean).join(' · ') || '—'

  const location = state.location || '—'

  let timing = '—'
  if (state.bookingType === 'slot') {
    timing = [state.prefDate, state.selectedSlot].filter(Boolean).join(' at ') || 'Date selected'
  } else if (state.bookingType === 'callback') {
    const parts = [state.callbackDate, state.callWindow].filter(Boolean)
    timing = parts.length ? `Callback: ${parts.join(', ')}` : 'Callback requested'
  }

  const notes = state.notes || 'None'

  return { service, type, name, contact, location, timing, notes }
}

export default function Step4Review({ state, onBack, onSubmit, isSubmitting }: Step4Props) {
  const summary = buildSummary(state)

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <p className="font-playfair font-bold text-[20px] text-c-text mb-1.5">
        Review & Confirm
      </p>
      <p className="text-[13.5px] text-c-muted mb-7 leading-[1.5]">
        Check everything looks right before submitting.
      </p>

      {/* Summary box */}
      <div className="bg-c-off rounded-[10px] p-5 mb-6 border border-c-border">
        <h4 className="text-[13px] font-semibold text-c-muted uppercase tracking-[1px] mb-3.5">
          Booking Summary
        </h4>
        <SummaryRow label="Service" value={summary.service} />
        <SummaryRow label="Type" value={summary.type} />
        <SummaryRow label="Name" value={summary.name} />
        <SummaryRow label="Contact" value={summary.contact} />
        <SummaryRow label="Location" value={summary.location} />
        <SummaryRow label="Timing" value={summary.timing} />
        <SummaryRow label="Notes" value={summary.notes} />
      </div>

      {/* Note box */}
      <div className="flex gap-2.5 items-start bg-c-warn-bg border border-c-warn-border rounded-[10px] px-4 py-3.5 mb-5">
        <span className="text-[18px] flex-shrink-0">ℹ️</span>
        <p className="text-[12.5px] text-c-warn-text leading-[1.6]">
          By submitting this booking you agree to be contacted by the Cadical Solutions team to
          confirm or adjust your appointment. We respond within 24 hours.
        </p>
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-7 pt-6 border-t border-c-border">
        <motion.button
          onClick={onBack}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-6 py-[11px] bg-transparent text-c-muted border-[1.5px] border-c-border rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:border-c-blue hover:text-c-blue disabled:opacity-50"
          whileTap={{ scale: 0.97 }}
        >
          ← Back
        </motion.button>
        <motion.button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="inline-flex items-center gap-1.5 px-6 py-[11px] bg-c-green text-white rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-[#1b5e20] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          whileTap={{ scale: 0.97 }}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Submitting…
            </>
          ) : (
            '✓ Confirm Booking'
          )}
        </motion.button>
      </div>
    </motion.div>
  )
}
