'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { BookingFormState, BookingMethod } from '@/lib/types/booking'

interface Step3Props {
  state: BookingFormState
  onChange: (updates: Partial<BookingFormState>) => void
  onNext: () => void
  onBack: () => void
}

const today = new Date().toISOString().split('T')[0]

const TIME_SLOTS = [
  { label: '8:00 AM', available: true },
  { label: '9:00 AM', available: true },
  { label: '10:00 AM', available: false },
  { label: '11:00 AM', available: true },
  { label: '12:00 PM', available: false },
  { label: '1:00 PM', available: true },
  { label: '2:00 PM', available: true },
  { label: '3:00 PM', available: true },
  { label: '4:00 PM', available: false },
]

const inputClass =
  'w-full px-3.5 py-[11px] border-[1.5px] border-c-border rounded-lg text-[14px] font-dm text-c-text bg-white transition-all duration-200 focus:border-c-blue focus:shadow-blue-glow'

export default function Step3DateTime({ state, onChange, onNext, onBack }: Step3Props) {
  const handleBookingType = (type: BookingMethod) => {
    onChange({ bookingType: type, selectedSlot: null })
  }

  const validate = () => {
    if (!state.bookingType) {
      alert('Please choose a booking method.')
      return false
    }
    if (state.bookingType === 'slot') {
      if (!state.prefDate) {
        alert('Please select a preferred date.')
        return false
      }
      if (!state.selectedSlot) {
        alert('Please select a time slot.')
        return false
      }
    }
    if (state.bookingType === 'callback') {
      if (!state.callbackDate) {
        alert('Please select a callback date.')
        return false
      }
      if (!state.callWindow) {
        alert('Please select a callback time window.')
        return false
      }
      if (!state.callbackPhone.trim()) {
        alert('Please enter a phone number for the callback.')
        return false
      }
    }
    return true
  }

  const handleNext = () => {
    if (validate()) onNext()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.25 }}
    >
      <p className="font-playfair font-bold text-[20px] text-c-text mb-1.5">
        When works for you?
      </p>
      <p className="text-[13.5px] text-c-muted mb-7 leading-[1.5]">
        Pick a slot or request a callback and we&apos;ll confirm a time that suits both sides.
      </p>

      {/* Booking method toggle */}
      <div className="mb-4">
        <label className="block text-[12.5px] font-semibold text-c-text mb-1.5">
          How would you prefer to book?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'slot' as BookingMethod, icon: '📅', label: 'Pick a Slot', sub: 'Choose a date and time now' },
            { id: 'callback' as BookingMethod, icon: '📞', label: 'Request Callback', sub: 'We call you to confirm timing' },
          ].map(({ id, icon, label, sub }) => {
            const isSelected = state.bookingType === id
            return (
              <motion.div
                key={id}
                className={`relative border-[1.5px] rounded-[10px] p-3.5 cursor-pointer overflow-hidden transition-colors duration-200 flex items-center gap-3 ${
                  isSelected
                    ? 'border-c-blue bg-c-blue-light'
                    : 'border-c-border hover:border-c-blue'
                }`}
                onClick={() => handleBookingType(id)}
                whileHover="hover"
                initial="rest"
                animate={isSelected ? 'selected' : 'rest'}
              >
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-c-blue origin-left"
                  variants={{
                    rest: { scaleX: 0 },
                    hover: { scaleX: 1 },
                    selected: { scaleX: 1 },
                  }}
                  transition={{ duration: 0.28, ease: 'easeOut' }}
                />
                <span className="text-[20px] flex-shrink-0">{icon}</span>
                <div>
                  <h4 className="text-[13.5px] font-semibold text-c-text mb-0.5">{label}</h4>
                  <p className="text-[11.5px] text-c-muted leading-[1.4]">{sub}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* ── Slot picker ── */}
      <AnimatePresence>
        {state.bookingType === 'slot' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mb-[18px]">
              <label className="block text-[12.5px] font-semibold text-c-text mb-1.5">
                Preferred Date *
              </label>
              <input
                type="date"
                min={today}
                value={state.prefDate}
                onChange={(e) => onChange({ prefDate: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="mb-[18px]">
              <label className="block text-[12.5px] font-semibold text-c-text mb-1.5">
                Available Time Slots
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {TIME_SLOTS.map((slot) => {
                  const isSelected = state.selectedSlot === slot.label
                  if (!slot.available) {
                    return (
                      <div
                        key={slot.label}
                        className="slot-unavailable border-[1.5px] border-c-border rounded-lg px-2 py-2.5 text-center text-[13px] font-medium"
                      >
                        {slot.label}
                      </div>
                    )
                  }
                  return (
                    <motion.div
                      key={slot.label}
                      className={`relative border-[1.5px] rounded-lg px-2 py-2.5 text-center text-[13px] font-medium cursor-pointer overflow-hidden transition-colors duration-200 ${
                        isSelected
                          ? 'bg-c-blue border-c-blue text-white font-semibold'
                          : 'border-c-border text-c-text hover:border-c-blue hover:text-c-blue hover:bg-c-blue-light'
                      }`}
                      onClick={() => onChange({ selectedSlot: slot.label })}
                      whileHover={isSelected ? undefined : 'hover'}
                      initial="rest"
                      animate={isSelected ? 'selected' : 'rest'}
                    >
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-c-blue origin-left"
                        variants={{
                          rest: { scaleX: 0 },
                          hover: { scaleX: 1 },
                          selected: { scaleX: 0 },
                        }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                      />
                      {slot.label}
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Callback picker ── */}
      <AnimatePresence>
        {state.bookingType === 'callback' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="mb-[18px]">
                <label className="block text-[12.5px] font-semibold text-c-text mb-1.5">
                  Best Date to Call *
                </label>
                <input
                  type="date"
                  min={today}
                  value={state.callbackDate}
                  onChange={(e) => onChange({ callbackDate: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="mb-[18px]">
                <label className="block text-[12.5px] font-semibold text-c-text mb-1.5">
                  Preferred Call Window *
                </label>
                <select
                  value={state.callWindow}
                  onChange={(e) => onChange({ callWindow: e.target.value })}
                  className={inputClass}
                >
                  <option value="" disabled>Select a time window</option>
                  <option>Morning — 8am to 12pm</option>
                  <option>Afternoon — 12pm to 4pm</option>
                  <option>Evening — 4pm to 6pm</option>
                  <option>Anytime during business hours</option>
                </select>
              </div>
            </div>
            <div className="mb-[18px]">
              <label className="block text-[12.5px] font-semibold text-c-text mb-1.5">
                Best Number to Call *
              </label>
              <input
                type="tel"
                value={state.callbackPhone}
                onChange={(e) => onChange({ callbackPhone: e.target.value })}
                placeholder="Phone number for callback"
                className={inputClass}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nav */}
      <div className="flex justify-between items-center mt-7 pt-6 border-t border-c-border">
        <motion.button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-6 py-[11px] bg-transparent text-c-muted border-[1.5px] border-c-border rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:border-c-blue hover:text-c-blue"
          whileTap={{ scale: 0.97 }}
        >
          ← Back
        </motion.button>
        <motion.button
          onClick={handleNext}
          className="inline-flex items-center gap-1.5 px-6 py-[11px] bg-c-blue text-white rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-c-blue-dark hover:shadow-btn-blue hover:-translate-y-px"
          whileTap={{ scale: 0.97 }}
        >
          Review Booking →
        </motion.button>
      </div>
    </motion.div>
  )
}
