import { CrmAdapter } from "./base"
import type {
  CrmContact, CrmAccount, CrmDeal, CrmLead, CrmTicket,
  ConnectionTestResult, OAuthTokens
} from "./types"

interface ZohoConfig {
  clientId: string
  clientSecret: string
  redirectUri: string
  accessToken?: string
  refreshToken?: string
  apiDomain?: string // e.g. https://www.zohoapis.com
}

export class ZohoCrmAdapter extends CrmAdapter {
  readonly provider = "zoho"

  private clientId: string
  private clientSecret: string
  private redirectUri: string
  private accessToken: string
  private refreshToken?: string
  private apiDomain: string

  private readonly accountsUrl = "https://accounts.zoho.com"

  constructor(config: ZohoConfig) {
    super()
    this.clientId = config.clientId
    this.clientSecret = config.clientSecret
    this.redirectUri = config.redirectUri
    this.accessToken = config.accessToken || ""
    this.refreshToken = config.refreshToken
    this.apiDomain = config.apiDomain || "https://www.zohoapis.com"
  }

  private get baseUrl() {
    return `${this.apiDomain}/crm/v3`
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Zoho-oauthtoken ${this.accessToken}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Zoho API ${method} ${path} → ${res.status}: ${err}`)
    }

    return res.json() as T
  }

  getAuthorizationUrl(state = ""): string {
    const params = new URLSearchParams({
      response_type: "code",
      client_id: this.clientId,
      scope: "ZohoCRM.modules.ALL,ZohoCRM.settings.ALL,ZohoCRM.org.READ",
      redirect_uri: this.redirectUri,
      access_type: "offline",
      state,
    })
    return `${this.accountsUrl}/oauth/v2/auth?${params.toString()}`
  }

  async exchangeCodeForTokens(code: string): Promise<OAuthTokens> {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      redirect_uri: this.redirectUri,
      code,
    })

    const res = await fetch(`${this.accountsUrl}/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })

    const data = await res.json() as {
      access_token: string
      refresh_token?: string
      expires_in?: number
      api_domain?: string
      token_type?: string
      error?: string
    }

    if (data.error) throw new Error(`Zoho OAuth error: ${data.error}`)

    return {
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresIn: data.expires_in,
      apiDomain: data.api_domain,
      tokenType: data.token_type,
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<OAuthTokens> {
    const params = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: this.clientId,
      client_secret: this.clientSecret,
      refresh_token: refreshToken,
    })

    const res = await fetch(`${this.accountsUrl}/oauth/v2/token`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    })

    const data = await res.json() as {
      access_token: string
      expires_in?: number
      error?: string
    }

    if (data.error) throw new Error(`Zoho token refresh error: ${data.error}`)

    return { accessToken: data.access_token, expiresIn: data.expires_in }
  }

  async testConnection(): Promise<ConnectionTestResult> {
    try {
      const data = await this.request<{ data?: unknown[] }>("GET", "/org")
      return {
        success: true,
        message: "Connected to Zoho CRM successfully",
        details: { org: data },
      }
    } catch (err) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Connection failed",
      }
    }
  }

  // ── Contacts ──────────────────────────────────────

  async createContact(contact: CrmContact): Promise<string> {
    const data = await this.request<{ data: { details: { id: string } }[] }>(
      "POST",
      "/Contacts",
      {
        data: [{
          First_Name: contact.firstName,
          Last_Name: contact.lastName,
          Email: contact.email,
          Phone: contact.phone,
          Account_Name: contact.company,
          Title: contact.title,
          Mailing_Street: contact.address,
          Mailing_City: contact.city,
          Mailing_State: contact.state,
          Mailing_Country: contact.country,
        }],
      }
    )
    return data.data[0].details.id
  }

  async updateContact(id: string, contact: Partial<CrmContact>): Promise<void> {
    await this.request("PUT", `/Contacts/${id}`, {
      data: [{
        First_Name: contact.firstName,
        Last_Name: contact.lastName,
        Email: contact.email,
        Phone: contact.phone,
        Account_Name: contact.company,
      }],
    })
  }

  async getContact(id: string): Promise<CrmContact | null> {
    try {
      const data = await this.request<{ data: Record<string, string>[] }>(
        "GET",
        `/Contacts/${id}`
      )
      const r = data.data[0]
      return {
        id: r.id,
        firstName: r.First_Name,
        lastName: r.Last_Name,
        email: r.Email,
        phone: r.Phone,
      }
    } catch {
      return null
    }
  }

  async searchContacts(email: string): Promise<CrmContact[]> {
    try {
      const data = await this.request<{ data: Record<string, string>[] }>(
        "GET",
        `/Contacts/search?email=${encodeURIComponent(email)}`
      )
      return (data.data || []).map((r) => ({
        id: r.id,
        firstName: r.First_Name,
        lastName: r.Last_Name,
        email: r.Email,
        phone: r.Phone,
      }))
    } catch {
      return []
    }
  }

  // ── Accounts ──────────────────────────────────────

  async createAccount(account: CrmAccount): Promise<string> {
    const data = await this.request<{ data: { details: { id: string } }[] }>(
      "POST",
      "/Accounts",
      {
        data: [{
          Account_Name: account.name,
          Account_Type: account.type,
          Phone: account.phone,
          Email: account.email,
          Website: account.website,
          Billing_Street: account.address,
          Billing_City: account.city,
          Billing_State: account.state,
          Billing_Country: account.country,
          Industry: account.industry,
        }],
      }
    )
    return data.data[0].details.id
  }

  async updateAccount(id: string, account: Partial<CrmAccount>): Promise<void> {
    await this.request("PUT", `/Accounts/${id}`, {
      data: [{ Account_Name: account.name, Phone: account.phone }],
    })
  }

  async searchAccounts(name: string): Promise<CrmAccount[]> {
    try {
      const data = await this.request<{ data: Record<string, string>[] }>(
        "GET",
        `/Accounts/search?word=${encodeURIComponent(name)}`
      )
      return (data.data || []).map((r) => ({
        id: r.id,
        name: r.Account_Name,
        phone: r.Phone,
        email: r.Email,
      }))
    } catch {
      return []
    }
  }

  // ── Deals ──────────────────────────────────────────

  async createDeal(deal: CrmDeal): Promise<string> {
    const data = await this.request<{ data: { details: { id: string } }[] }>(
      "POST",
      "/Deals",
      {
        data: [{
          Deal_Name: deal.name,
          Stage: deal.stage || "Qualification",
          Pipeline: deal.pipeline,
          Amount: deal.amount,
          Currency: deal.currency,
          Closing_Date: deal.closeDate,
          Contact_Name: deal.contactId ? { id: deal.contactId } : undefined,
          Account_Name: deal.accountId ? { id: deal.accountId } : undefined,
        }],
      }
    )
    return data.data[0].details.id
  }

  async updateDeal(id: string, deal: Partial<CrmDeal>): Promise<void> {
    await this.request("PUT", `/Deals/${id}`, {
      data: [{ Stage: deal.stage, Amount: deal.amount }],
    })
  }

  // ── Leads ──────────────────────────────────────────

  async createLead(lead: CrmLead): Promise<string> {
    const data = await this.request<{ data: { details: { id: string } }[] }>(
      "POST",
      "/Leads",
      {
        data: [{
          First_Name: lead.firstName,
          Last_Name: lead.lastName,
          Email: lead.email,
          Phone: lead.phone,
          Company: lead.company,
          Lead_Source: lead.leadSource || "Web Site",
          Lead_Status: lead.status || "Not Contacted",
          Annual_Revenue: lead.amount,
        }],
      }
    )
    return data.data[0].details.id
  }

  async updateLead(id: string, lead: Partial<CrmLead>): Promise<void> {
    await this.request("PUT", `/Leads/${id}`, {
      data: [{ Lead_Status: lead.status }],
    })
  }

  // ── Tickets (via Cases module) ─────────────────────

  async createTicket(ticket: CrmTicket): Promise<string> {
    const data = await this.request<{ data: { details: { id: string } }[] }>(
      "POST",
      "/Cases",
      {
        data: [{
          Subject: ticket.subject,
          Description: ticket.description,
          Status: ticket.status || "New",
          Priority: ticket.priority || "Medium",
          Contact_Name: ticket.contactId ? { id: ticket.contactId } : undefined,
        }],
      }
    )
    return data.data[0].details.id
  }

  async updateTicket(id: string, ticket: Partial<CrmTicket>): Promise<void> {
    await this.request("PUT", `/Cases/${id}`, {
      data: [{ Status: ticket.status, Priority: ticket.priority }],
    })
  }
}
