import type {
  CrmContact, CrmAccount, CrmDeal, CrmLead, CrmTicket,
  SyncResult, ConnectionTestResult, OAuthTokens
} from "./types"

export abstract class CrmAdapter {
  abstract readonly provider: string

  abstract testConnection(): Promise<ConnectionTestResult>

  // OAuth
  abstract getAuthorizationUrl(state?: string): string
  abstract exchangeCodeForTokens(code: string): Promise<OAuthTokens>
  abstract refreshAccessToken(refreshToken: string): Promise<OAuthTokens>

  // Contacts
  abstract createContact(contact: CrmContact): Promise<string>
  abstract updateContact(id: string, contact: Partial<CrmContact>): Promise<void>
  abstract getContact(id: string): Promise<CrmContact | null>
  abstract searchContacts(email: string): Promise<CrmContact[]>

  // Accounts
  abstract createAccount(account: CrmAccount): Promise<string>
  abstract updateAccount(id: string, account: Partial<CrmAccount>): Promise<void>
  abstract searchAccounts(name: string): Promise<CrmAccount[]>

  // Deals
  abstract createDeal(deal: CrmDeal): Promise<string>
  abstract updateDeal(id: string, deal: Partial<CrmDeal>): Promise<void>

  // Leads
  abstract createLead(lead: CrmLead): Promise<string>
  abstract updateLead(id: string, lead: Partial<CrmLead>): Promise<void>

  // Tickets
  abstract createTicket(ticket: CrmTicket): Promise<string>
  abstract updateTicket(id: string, ticket: Partial<CrmTicket>): Promise<void>

  // Bulk sync helpers
  async syncContacts(contacts: CrmContact[]): Promise<SyncResult> {
    const result: SyncResult = { success: true, synced: 0, failed: 0, errors: [] }
    for (const contact of contacts) {
      try {
        const existing = await this.searchContacts(contact.email)
        if (existing.length > 0 && existing[0].id) {
          await this.updateContact(existing[0].id, contact)
        } else {
          await this.createContact(contact)
        }
        result.synced++
      } catch (err) {
        result.failed++
        result.errors.push(`Contact ${contact.email}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
    result.success = result.failed === 0
    return result
  }
}
