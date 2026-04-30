'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { BookingFormState, CallerType } from '@/lib/types/booking'

interface Step2Props {
  state: BookingFormState
  onChange: (updates: Partial<BookingFormState>) => void
  onNext: () => void
  onBack: () => void
}

function FormInput({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="mb-[18px]">
      <label className="block text-[12.5px] font-semibold text-c-text mb-1.5 tracking-[0.2px]">
        {label} {required && '*'}
      </label>
      {children}
    </div>
  )
}

const inputClass =
  'w-full px-3.5 py-[11px] border-[1.5px] border-c-border rounded-lg text-[14px] font-dm text-c-text bg-white transition-all duration-200 focus:border-c-blue focus:shadow-blue-glow'

export default function Step2Details({ state, onChange, onNext, onBack }: Step2Props) {
  const handleCallerType = (type: CallerType) => {
    onChange({ callerType: type })
  }

  const validate = () => {
    if (!state.callerType) {
      alert('Please select whether you are booking as an individual or institution.')
      return false
    }
    if (!state.firstName.trim() || !state.lastName.trim()) {
      alert('Please enter your first and last name.')
      return false
    }
    if (!state.phone.trim() || !state.email.trim()) {
      alert('Please enter your phone number and email address.')
      return false
    }
    if (!state.location.trim()) {
      alert('Please enter your location or address.')
      return false
    }
    if (state.callerType === 'institution' && !state.orgName.trim()) {
      alert('Please enter your organisation name.')
      return false
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
        Your Details
      </p>
      <p className="text-[13.5px] text-c-muted mb-7 leading-[1.5]">
        Tell us who you are so we can prepare properly.
      </p>

      {/* Caller type */}
      <FormInput label="You are booking as" required>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'individual' as CallerType, icon: '👤', label: 'Individual', sub: 'Personal or home care' },
            { id: 'institution' as CallerType, icon: '🏥', label: 'Institution', sub: 'Hospital, clinic or facility' },
          ].map(({ id, icon, label, sub }) => {
            const isSelected = state.callerType === id
            return (
              <motion.div
                key={id}
                className={`relative border-[1.5px] rounded-[10px] p-3.5 cursor-pointer overflow-hidden transition-colors duration-200 flex items-center gap-2.5 ${
                  isSelected
                    ? 'border-c-blue bg-c-blue-light'
                    : 'border-c-border hover:border-c-blue'
                }`}
                onClick={() => handleCallerType(id)}
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
                  <p className="text-[11.5px] text-c-muted">{sub}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </FormInput>

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput label="First Name" required>
          <input
            type="text"
            value={state.firstName}
            onChange={(e) => onChange({ firstName: e.target.value })}
            placeholder="First name"
            className={inputClass}
          />
        </FormInput>
        <FormInput label="Last Name" required>
          <input
            type="text"
            value={state.lastName}
            onChange={(e) => onChange({ lastName: e.target.value })}
            placeholder="Last name"
            className={inputClass}
          />
        </FormInput>
      </div>

      {/* Institution-specific fields */}
      <AnimatePresence>
        {state.callerType === 'institution' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <FormInput label="Organisation / Facility Name" required>
              <input
                type="text"
                value={state.orgName}
                onChange={(e) => onChange({ orgName: e.target.value })}
                placeholder="e.g. Lagos General Hospital"
                className={inputClass}
              />
            </FormInput>
            <FormInput label="Your Role / Position" required>
              <input
                type="text"
                value={state.role}
                onChange={(e) => onChange({ role: e.target.value })}
                placeholder="e.g. Procurement Officer, Head Nurse"
                className={inputClass}
              />
            </FormInput>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Phone & Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput label="Phone Number" required>
          <input
            type="tel"
            value={state.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+234 000 000 0000"
            className={inputClass}
          />
        </FormInput>
        <FormInput label="Email Address" required>
          <input
            type="email"
            value={state.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="your@email.com"
            className={inputClass}
          />
        </FormInput>
      </div>

      {/* Location */}
      <FormInput label="Location / Address" required>
        <input
          type="text"
          value={state.location}
          onChange={(e) => onChange({ location: e.target.value })}
          placeholder="City, area or full address for physical visits"
          className={inputClass}
        />
      </FormInput>

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
          Continue → Date & Time
        </motion.button>
      </div>
    </motion.div>
  )
}
