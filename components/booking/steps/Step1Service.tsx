'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { BookingFormState, ServiceType, UrgencyType, FormatType } from '@/lib/types/booking'

interface Step1Props {
  state: BookingFormState
  onChange: (updates: Partial<BookingFormState>) => void
  onNext: () => void
}

/* ── Reusable animated card with drawn border ── */
function SelectCard({
  selected,
  onClick,
  className = '',
  children,
}: {
  selected: boolean
  onClick: () => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <motion.div
      className={`relative border-[1.5px] rounded-[10px] cursor-pointer overflow-hidden transition-colors duration-200 ${
        selected
          ? 'border-c-blue bg-blue-300'
          : 'border-c-border hover:border-c-blue hover:bg-c-blue-light'
      } ${className}`}
      onClick={onClick}
      whileHover="hover"
      initial="rest"
      animate={selected ? 'selected' : 'rest'}
    >
      {/* Bottom line that draws on hover */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-c-blue origin-left"
        variants={{
          rest: { scaleX: 0 },
          hover: { scaleX: 1 },
          selected: { scaleX: 1 },
        }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
      />
      {children}
    </motion.div>
  )
}

export default function Step1Service({ state, onChange, onNext }: Step1Props) {
  const handleService = (svc: ServiceType) => {
    onChange({ service: svc, urgency: null, format: null })
  }

  const handleUrgency = (u: UrgencyType) => onChange({ urgency: u })
  const handleFormat = (f: FormatType) => onChange({ format: f })

  const validate = () => {
    if (!state.service) {
      alert('Please select a service type.')
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
        What do you need?
      </p>
      <p className="text-[13.5px] text-c-muted mb-7 leading-[1.5]">
        Select the service that fits your situation.
      </p>

      {/* Service selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
        <SelectCard
          selected={state.service === 'maintenance'}
          onClick={() => handleService('maintenance')}
          className="p-4"
        >
          {state.service === 'maintenance' && (
            <motion.span
              className="absolute top-2.5 right-3 w-5 h-5 bg-c-blue text-white rounded-full text-[11px] font-bold flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              ✓
            </motion.span>
          )}
          <span className="text-[22px] mb-2 block">🔧</span>
          <h4 className="text-[13.5px] font-semibold text-c-text mb-1">
            Equipment Maintenance & Repair
          </h4>
          <p className="text-[12px] text-c-muted leading-[1.5]">
            Servicing, calibration or repair of medical equipment at your facility
          </p>
        </SelectCard>

        <SelectCard
          selected={state.service === 'consultation'}
          onClick={() => handleService('consultation')}
          className="p-4"
        >
          {state.service === 'consultation' && (
            <motion.span
              className="absolute top-2.5 right-3 w-5 h-5 bg-c-blue text-white rounded-full text-[11px] font-bold flex items-center justify-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              ✓
            </motion.span>
          )}
          <span className="text-[22px] mb-2 block">💬</span>
          <h4 className="text-[13.5px] font-semibold text-c-text mb-1">
            Supply Consultation
          </h4>
          <p className="text-[12px] text-c-muted leading-[1.5]">
            Expert advice on healthcare procurement, equipment selection or supply chain
          </p>
        </SelectCard>
      </div>

      {/* ── Maintenance extras ── */}
      <AnimatePresence>
        {state.service === 'maintenance' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mb-[18px]">
              <label className="block text-[12.5px] font-semibold text-c-text mb-1.5 tracking-[0.2px]">
                Equipment Type *
              </label>
              <select
                value={state.equipmentType}
                onChange={(e) => onChange({ equipmentType: e.target.value })}
                className="w-full px-3.5 py-[11px] border-[1.5px] border-c-border rounded-lg text-[14px] font-dm text-c-text bg-white transition-all duration-200 focus:border-c-blue focus:shadow-blue-glow"
              >
                <option value="" disabled>Select equipment type</option>
                <option>Dialysis Machine</option>
                <option>Blood Pressure Monitor</option>
                <option>ECG / EKG Machine</option>
                <option>Ultrasound / Imaging Equipment</option>
                <option>Infusion Pump</option>
                <option>Ventilator</option>
                <option>Laboratory Equipment</option>
                <option>Other Medical Equipment</option>
              </select>
            </div>

            <div className="mb-[18px]">
              <label className="block text-[12.5px] font-semibold text-c-text mb-1.5">
                Nature of Issue *
              </label>
              <select
                value={state.issueType}
                onChange={(e) => onChange({ issueType: e.target.value })}
                className="w-full px-3.5 py-[11px] border-[1.5px] border-c-border rounded-lg text-[14px] font-dm text-c-text bg-white transition-all duration-200 focus:border-c-blue focus:shadow-blue-glow"
              >
                <option value="" disabled>What needs to be done?</option>
                <option>Routine Servicing / Preventive Maintenance</option>
                <option>Equipment Not Functioning</option>
                <option>Calibration Required</option>
                <option>Parts Replacement</option>
                <option>Post-Repair Inspection</option>
                <option>Unsure — needs assessment</option>
              </select>
            </div>

            {/* Urgency */}
            <div className="mb-[18px]">
              <label className="block text-[12.5px] font-semibold text-c-text mb-1.5">
                Urgency
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {[
                  { id: 'routine' as UrgencyType, icon: '📅', label: 'Routine', sub: 'Within 1 week' },
                  { id: 'soon' as UrgencyType, icon: '⚡', label: 'Soon', sub: 'Within 48hrs' },
                  { id: 'urgent' as UrgencyType, icon: '🚨', label: 'Urgent', sub: 'Same day', isUrgent: true },
                ].map(({ id, icon, label, sub, isUrgent }) => {
                  const isSelected = state.urgency === id
                  return (
                    <motion.div
                      key={id}
                      className={`relative border-[1.5px] rounded-lg px-3 py-2.5 cursor-pointer text-center overflow-hidden transition-colors duration-200 ${
                        isSelected
                          ? isUrgent
                            ? 'urgency-urgent-selected border-c-red'
                            : 'border-c-blue bg-c-blue-light'
                          : 'border-c-border hover:border-c-blue'
                      }`}
                      onClick={() => handleUrgency(id)}
                      whileHover="hover"
                      initial="rest"
                      animate={isSelected ? 'selected' : 'rest'}
                    >
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 h-[2px] origin-left ${isUrgent ? 'bg-c-red' : 'bg-c-blue'}`}
                        variants={{
                          rest: { scaleX: 0 },
                          hover: { scaleX: 1 },
                          selected: { scaleX: 1 },
                        }}
                        transition={{ duration: 0.28, ease: 'easeOut' }}
                      />
                      <span className="text-[18px] mb-1 block">{icon}</span>
                      <h4 className="text-[12.5px] font-semibold text-c-text mb-0.5">{label}</h4>
                      <p className="text-[11px] text-c-muted">{sub}</p>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Consultation extras ── */}
      <AnimatePresence>
        {state.service === 'consultation' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mb-[18px]">
              <label className="block text-[12.5px] font-semibold text-c-text mb-1.5">
                Consultation Type *
              </label>
              <select
                value={state.consultType}
                onChange={(e) => onChange({ consultType: e.target.value })}
                className="w-full px-3.5 py-[11px] border-[1.5px] border-c-border rounded-lg text-[14px] font-dm text-c-text bg-white transition-all duration-200 focus:border-c-blue focus:shadow-blue-glow"
              >
                <option value="" disabled>What do you need advice on?</option>
                <option>Equipment Procurement & Selection</option>
                <option>Supply Chain Audit & Optimisation</option>
                <option>Setting Up a New Clinic/Facility</option>
                <option>Dialysis Supply Planning</option>
                <option>General Healthcare Supply Query</option>
              </select>
            </div>

            {/* Format toggle */}
            <div className="mb-[18px]">
              <label className="block text-[12.5px] font-semibold text-c-text mb-1.5">
                Preferred Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'physical' as FormatType, icon: '🏥', label: 'Physical Visit', sub: 'We come to your location' },
                  { id: 'virtual' as FormatType, icon: '💻', label: 'Virtual', sub: 'WhatsApp or video call' },
                ].map(({ id, icon, label, sub }) => (
                  <SelectCard
                    key={id}
                    selected={state.format === id}
                    onClick={() => handleFormat(id)}
                    className="p-3.5 flex items-center gap-3"
                  >
                    <span className="text-[20px] flex-shrink-0">{icon}</span>
                    <div>
                      <h4 className="text-[13.5px] font-semibold text-c-text mb-0.5">{label}</h4>
                      <p className="text-[11.5px] text-c-muted leading-[1.4]">{sub}</p>
                    </div>
                  </SelectCard>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notes */}
      <div className="mb-[18px]">
        <label className="block text-[12.5px] font-semibold text-c-text mb-1.5">
          Additional Notes <span className="font-normal text-c-muted text-[11px] ml-1">(optional)</span>
        </label>
        <textarea
          value={state.notes}
          onChange={(e) => onChange({ notes: e.target.value })}
          placeholder="Any extra context that would help us prepare..."
          rows={3}
          className="w-full px-3.5 py-[11px] border-[1.5px] border-c-border rounded-lg text-[14px] font-dm text-c-text bg-white transition-all duration-200 focus:border-c-blue focus:shadow-blue-glow min-h-[90px]"
        />
      </div>

      {/* Nav */}
      <div className="flex justify-between items-center mt-7 pt-6 border-t border-c-border">
        <span />
        <motion.button
          onClick={handleNext}
          className="inline-flex items-center gap-1.5 px-6 py-[11px] bg-blue-600 text-white rounded-lg text-[14px] font-semibold cursor-pointer transition-all duration-200 hover:bg-c-blue-dark hover:shadow-btn-blue hover:-translate-y-px"
          whileTap={{ scale: 0.97 }}
        >
          Continue → Your Details
        </motion.button>
      </div>
    </motion.div>
  )
}
