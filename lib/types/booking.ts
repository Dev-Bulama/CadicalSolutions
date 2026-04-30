export type ServiceType = 'maintenance' | 'consultation' | null
export type UrgencyType = 'routine' | 'soon' | 'urgent' | null
export type FormatType = 'physical' | 'virtual' | null
export type CallerType = 'individual' | 'institution' | null
export type BookingMethod = 'slot' | 'callback' | null
export type BookingStep = 1 | 2 | 3 | 4

export interface BookingFormState {
  // Step 1 — Service
  service: ServiceType
  urgency: UrgencyType
  format: FormatType
  equipmentType: string
  issueType: string
  consultType: string
  notes: string

  // Step 2 — Details
  callerType: CallerType
  firstName: string
  lastName: string
  orgName: string
  role: string
  phone: string
  email: string
  location: string

  // Step 3 — Date & Time
  bookingType: BookingMethod
  selectedSlot: string | null
  prefDate: string
  callbackDate: string
  callWindow: string
  callbackPhone: string
}

export const initialFormState: BookingFormState = {
  service: null,
  urgency: null,
  format: null,
  equipmentType: '',
  issueType: '',
  consultType: '',
  notes: '',
  callerType: null,
  firstName: '',
  lastName: '',
  orgName: '',
  role: '',
  phone: '',
  email: '',
  location: '',
  bookingType: null,
  selectedSlot: null,
  prefDate: '',
  callbackDate: '',
  callWindow: '',
  callbackPhone: '',
}

export interface BookingPayload extends BookingFormState {
  ref: string
  submittedAt: string
}
