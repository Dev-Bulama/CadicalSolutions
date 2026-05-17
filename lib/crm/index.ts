import { ZohoCrmAdapter } from "./zoho"
import type { CrmAdapter } from "./base"

interface ConnectionConfig {
  provider: string
  clientId?: string | null
  clientSecret?: string | null
  redirectUri?: string | null
  accessToken?: string | null
  refreshToken?: string | null
  apiDomain?: string | null
}

export function getCrmAdapter(connection: ConnectionConfig): CrmAdapter {
  switch (connection.provider) {
    case "zoho":
      return new ZohoCrmAdapter({
        clientId: connection.clientId || "",
        clientSecret: connection.clientSecret || "",
        redirectUri: connection.redirectUri || "",
        accessToken: connection.accessToken || undefined,
        refreshToken: connection.refreshToken || undefined,
        apiDomain: connection.apiDomain || undefined,
      })
    default:
      throw new Error(`Unsupported CRM provider: ${connection.provider}`)
  }
}

export { ZohoCrmAdapter }
export type { CrmAdapter }
