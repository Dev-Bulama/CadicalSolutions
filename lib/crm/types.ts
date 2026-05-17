export type CrmProvider = "zoho" | "hubspot" | "salesforce" | "freshsales" | "custom"

export type SyncDirection = "push" | "pull" | "both"
export type SyncInterval = "5min" | "15min" | "hourly" | "daily"

export interface CrmContact {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  title?: string
  address?: string
  city?: string
  state?: string
  country?: string
  tags?: string[]
  customFields?: Record<string, unknown>
}

export interface CrmAccount {
  id?: string
  name: string
  type?: string
  phone?: string
  email?: string
  website?: string
  address?: string
  city?: string
  state?: string
  country?: string
  industry?: string
  customFields?: Record<string, unknown>
}

export interface CrmDeal {
  id?: string
  name: string
  stage?: string
  pipeline?: string
  amount?: number
  currency?: string
  closeDate?: string
  contactId?: string
  accountId?: string
  ownerId?: string
  customFields?: Record<string, unknown>
}

export interface CrmLead {
  id?: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  leadSource?: string
  status?: string
  industry?: string
  amount?: number
  customFields?: Record<string, unknown>
}

export interface CrmTicket {
  id?: string
  subject: string
  description?: string
  status?: string
  priority?: string
  contactId?: string
  customFields?: Record<string, unknown>
}

export interface SyncResult {
  success: boolean
  synced: number
  failed: number
  errors: string[]
}

export interface ConnectionTestResult {
  success: boolean
  message: string
  details?: Record<string, unknown>
}

export interface OAuthTokens {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
  apiDomain?: string
  tokenType?: string
}
