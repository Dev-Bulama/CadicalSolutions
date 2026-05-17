# Cadical Solutions — Zoho CRM Integration Guide

> Version 1.0 | Last Updated: May 2026  
> Audience: Platform Administrators, Technical Integrators

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Creating an OAuth App in Zoho API Console](#2-creating-an-oauth-app-in-zoho-api-console)
3. [Required Environment Variables](#3-required-environment-variables)
4. [Connecting Cadical to Zoho (Setup Wizard)](#4-connecting-cadical-to-zoho-setup-wizard)
5. [Field Mapping Guide](#5-field-mapping-guide)
6. [Setting Up Automation Rules](#6-setting-up-automation-rules)
7. [Manual Sync vs Automatic Sync](#7-manual-sync-vs-automatic-sync)
8. [Webhook Configuration](#8-webhook-configuration)
9. [Troubleshooting Common Errors](#9-troubleshooting-common-errors)
10. [Sync Log Interpretation](#10-sync-log-interpretation)
11. [Retrying Failed Jobs](#11-retrying-failed-jobs)

---

## 1. Prerequisites

Before starting the Zoho CRM integration, confirm the following:

### Zoho Account Requirements

| Requirement | Details |
|---|---|
| Zoho CRM account | Professional, Enterprise, or Ultimate edition (API access is not available on Free tier) |
| CRM Admin role | Your Zoho user must have the **Administrator** profile to create OAuth apps and configure webhooks |
| Data center region | Know your region: US (`zoho.com`), EU (`zoho.eu`), IN (`zoho.in`), AU (`zoho.com.au`) — this affects the accounts URL |
| Modules enabled | Ensure Contacts, Accounts, Deals, Cases, and Leads modules are enabled in your Zoho CRM |

### Cadical Platform Requirements

| Requirement | Details |
|---|---|
| Admin access | Must be logged in as a Cadical SUPER_ADMIN |
| Environment variables | Server environment must be accessible to add/update variables |
| HTTPS on redirect URI | Zoho OAuth requires the redirect URI to use HTTPS in production |
| Database migrations run | `CrmConnection`, `CrmFieldMapping`, and related tables must exist (run `npx prisma migrate deploy`) |

---

## 2. Creating an OAuth App in Zoho API Console

### Step 1 — Open the Zoho API Console

1. Go to [https://api-console.zoho.com](https://api-console.zoho.com) (adjust subdomain for your region, e.g. `api-console.zoho.eu` for EU).
2. Sign in with your Zoho CRM administrator credentials.

### Step 2 — Create a New Client

1. Click **GET STARTED** or **Add Client** if you already have clients listed.
2. Select **Server-based Applications** as the client type.
   - This is the correct type for a Next.js server that handles the OAuth callback server-side.
3. Click **Create Now**.

### Step 3 — Fill in the Application Details

| Field | Value |
|---|---|
| **Client Name** | `Cadical Solutions` (or any recognisable name) |
| **Homepage URL** | `https://your-cadical-domain.com` |
| **Authorized Redirect URIs** | `https://your-cadical-domain.com/api/admin/crm/callback` |

> The redirect URI must exactly match what is set in `ZOHO_REDIRECT_URI`. Even a trailing slash difference will cause OAuth to fail.

4. Click **Create**.
5. Zoho generates a **Client ID** and **Client Secret**. Copy both values — the secret is shown only once.

### Step 4 — Configure Required Scopes

When Cadical initiates the OAuth flow, it requests the following Zoho CRM scopes:

```
ZohoCRM.modules.contacts.ALL
ZohoCRM.modules.accounts.ALL
ZohoCRM.modules.deals.ALL
ZohoCRM.modules.cases.ALL
ZohoCRM.modules.leads.ALL
ZohoCRM.settings.fields.READ
ZohoCRM.bulk.ALL
ZohoSearch.securesearch.READ
```

These scopes are passed automatically during the OAuth redirect. You do not need to configure them in the API Console — Zoho presents them to the admin on the consent screen.

### Step 5 — Note Your Data Center Accounts URL

The Accounts URL depends on your Zoho region:

| Region | Accounts URL |
|---|---|
| United States | `https://accounts.zoho.com` |
| Europe | `https://accounts.zoho.eu` |
| India | `https://accounts.zoho.in` |
| Australia | `https://accounts.zoho.com.au` |
| Japan | `https://accounts.zoho.jp` |
| Canada | `https://accounts.zohocloud.ca` |

---

## 3. Required Environment Variables

Add the following variables to your production environment (`.env.local` for local development, or the hosting platform's environment configuration for production):

```env
# Zoho CRM OAuth Credentials
ZOHO_CLIENT_ID=1000.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
ZOHO_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
ZOHO_ACCOUNTS_URL=https://accounts.zoho.com
ZOHO_REDIRECT_URI=https://your-cadical-domain.com/api/admin/crm/callback
```

### Variable Reference

| Variable | Required | Description |
|---|---|---|
| `ZOHO_CLIENT_ID` | Yes | Client ID from Zoho API Console |
| `ZOHO_CLIENT_SECRET` | Yes | Client Secret from Zoho API Console (keep secret) |
| `ZOHO_ACCOUNTS_URL` | Yes | Zoho Accounts base URL for your data center region |
| `ZOHO_REDIRECT_URI` | Yes | Must match the Authorized Redirect URI set in the Zoho API Console exactly |

### Additional Pusher / Cadical Variables (ensure these are set)

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/cadical

# Auth
BETTER_AUTH_SECRET=your-auth-secret-min-32-chars
BETTER_AUTH_URL=https://your-cadical-domain.com

# Pusher
PUSHER_APP_ID=your-pusher-app-id
PUSHER_KEY=your-pusher-key
PUSHER_SECRET=your-pusher-secret
PUSHER_CLUSTER=eu
NEXT_PUBLIC_PUSHER_KEY=your-pusher-key
NEXT_PUBLIC_PUSHER_CLUSTER=eu
```

> After adding environment variables, restart the server process for them to take effect.

---

## 4. Connecting Cadical to Zoho (Setup Wizard)

### Step-by-Step Connection via the Setup Wizard

1. Log in to the Cadical admin portal as SUPER_ADMIN.
2. Navigate to **Admin → Integrations → CRM** (`/admin/integrations/crm`).
3. Click **Connect New CRM**.
4. Select **Zoho CRM** from the list of providers.
5. You are redirected to the **Setup Wizard** at `/admin/integrations/crm/setup-wizard`.

---

**Wizard Step 1 — Credentials**

1. Enter your **Zoho Client ID** in the Client ID field.
2. Enter your **Zoho Client Secret** in the Client Secret field.
3. The **Accounts URL** field is pre-populated based on your `ZOHO_ACCOUNTS_URL` environment variable. Change it if your data center differs.
4. Click **Next**.

---

**Wizard Step 2 — OAuth Authorization**

1. Click **Connect to Zoho**.
2. You are redirected to Zoho's OAuth consent page (`accounts.zoho.com/oauth/v2/auth`).
3. Log in with your Zoho CRM Administrator account if not already logged in.
4. Review the requested permissions (scopes) listed on the consent page.
5. Click **Accept**.
6. Zoho redirects you back to `https://your-cadical-domain.com/api/admin/crm/callback?code=AUTH_CODE`.
7. The Cadical backend exchanges the auth code for an `access_token` and `refresh_token`.
8. Tokens are stored encrypted in the `CrmConnection` record.
9. The wizard advances to Step 3 automatically.

---

**Wizard Step 3 — Configuration**

1. Set the **Sync Interval**:
   - `5min` — high-frequency sync (recommended for active sales teams)
   - `15min` — balanced
   - `hourly` — default, suitable for most use cases
   - `daily` — low-frequency, minimum API usage
2. Toggle **Enable Sync** to ON to activate automatic syncing immediately.
3. Click **Finish Setup**.

---

The CRM hub now shows the Zoho CRM card with status **Connected** and a green health indicator.

### Verifying the Connection

1. On the CRM hub page, click **Test Connection** on the Zoho card.
2. The system calls the Zoho API to verify token validity.
3. A success banner confirms the connection is live.
4. If the test fails, see [Section 9 — Troubleshooting](#9-troubleshooting-common-errors).

---

## 5. Field Mapping Guide

Field mappings define which Cadical database fields are sent to (or received from) which Zoho CRM fields.

Navigate to **Admin → Integrations → CRM → Mappings** (`/admin/integrations/crm/mappings`).

### 5.1 Default Mappings

The following default mappings are pre-configured after connection:

#### Cadical User → Zoho Contact

| Cadical Field (`User`) | Zoho Field | Direction |
|---|---|---|
| `name` | `Full_Name` | both |
| `email` | `Email` | both |
| `phone` | `Phone` | both |
| `city` | `Mailing_City` | tocrm |
| `state` | `Mailing_State` | tocrm |
| `country` | `Mailing_Country` | tocrm |
| `createdAt` | `Lead_Source` (mapped to "Web") | tocrm |

#### Institution → Zoho Account

| Cadical Field (`Institution`) | Zoho Field | Direction |
|---|---|---|
| `instName` | `Account_Name` | both |
| `instType` | `Industry` | both |
| `phone` | `Phone` | both |
| `email` | `Account_Email` (custom field) | both |
| `state` | `Billing_State` | tocrm |
| `address` | `Billing_Street` | tocrm |
| `staffCount` | `Employees` | tocrm |
| `cac` | `CAC_Number` (custom field) | tocrm |

#### Order → Zoho Deal

| Cadical Field (`Order`) | Zoho Field | Direction |
|---|---|---|
| `id` | `Deal_Name` (prefixed: `ORD-{id}`) | tocrm |
| `totalAmount` | `Amount` | tocrm |
| `status` | `Stage` (mapped via transform) | tocrm |
| `createdAt` | `Closing_Date` | tocrm |

**Status → Stage transform function:**
```javascript
// Transform: Order.status → Zoho Deal Stage
const map = {
  PENDING: 'Qualification',
  PAID: 'Value Proposition',
  PROCESSING: 'Id. Decision Makers',
  SHIPPED: 'Perception Analysis',
  DELIVERED: 'Closed Won',
  CANCELLED: 'Closed Lost'
}
return map[value] || 'Qualification'
```

#### ServiceBooking → Zoho Case

| Cadical Field (`ServiceBooking`) | Zoho Field | Direction |
|---|---|---|
| `bookingCode` | `Case_Number` | tocrm |
| `issueDescription` | `Description` | tocrm |
| `urgency` | `Priority` (mapped: EMERGENCY→High, URGENT→Medium, NORMAL→Low) | tocrm |
| `status` | `Status` | tocrm |
| `serviceType` | `Type` | tocrm |
| `siteAddress` | `Street` | tocrm |

#### Referral → Zoho Lead

| Cadical Field (`Referral`) | Zoho Field | Direction |
|---|---|---|
| `referrerFullName` | `First_Name` + `Last_Name` (split on first space) | tocrm |
| `referrerPhone` | `Phone` | tocrm |
| `referrerEmail` | `Email` | tocrm |
| `referrerFacility` | `Company` | tocrm |
| `clientFacilityName` | `Lead_Source` | tocrm |
| `urgencyLevel` | `Rating` | tocrm |
| `reasonForRequest` | `Description` | tocrm |

### 5.2 Adding Custom Mappings

1. Go to **CRM → Mappings** and select the relevant entity tab.
2. Click **+ Add Mapping**.
3. Select the **Cadical Field** from the dropdown (all schema fields for that entity are listed).
4. Enter the **Zoho API Field Name** — find this in your Zoho CRM under:
   - Settings → Modules and Fields → select the module → view field API names
   - Custom fields have names like `CAC_Number_c` (suffix `_c`)
5. Set **Direction**: `tocrm`, `fromcrm`, or `both`.
6. If the value needs transformation, enter a JavaScript expression in **Transform Function**:
   ```javascript
   // Example: convert to uppercase
   return value.toUpperCase()
   // Example: extract first word
   return value.split(' ')[0]
   // Example: format date
   return new Date(value).toISOString().split('T')[0]
   ```
7. Click **Save Mapping**.

### 5.3 Mapping Validation Rules

- Each `(connectionId, entity, cadicalField)` combination must be unique.
- Zoho field names are case-sensitive — use the exact API name from Zoho.
- Required fields (`isRequired = true`) cause the sync record to fail entirely if the Cadical value is null.
- Non-required fields with null values are skipped (not sent to Zoho).

---

## 6. Setting Up Automation Rules

Automation rules trigger a Zoho CRM action automatically when a platform event occurs.

Navigate to **Admin → Integrations → CRM → Automations** (`/admin/integrations/crm/automations`).

### 6.1 Available Triggers

| Trigger Event | When It Fires |
|---|---|
| `order_completed` | When an Order's status changes to `DELIVERED` |
| `rfq_submitted` | When a new RFQ is created by a customer |
| `booking_created` | When a new ServiceBooking record is created |
| `user_inactive` | When a User has not logged in for N days (configured in Trigger Config) |

### 6.2 Available Actions

| Action Type | What Happens in Zoho |
|---|---|
| `create_contact` | Creates a new Contact record |
| `create_lead` | Creates a new Lead record |
| `create_deal` | Creates a new Deal in the specified pipeline and stage |
| `create_ticket` | Creates a new Case (support ticket) |
| `update_stage` | Updates the Stage of an existing Deal |

### 6.3 Example: Create a Deal When an Order is Delivered

1. Click **+ New Rule**.
2. **Name:** `Order Delivered → CRM Deal`
3. **Trigger Event:** `order_completed`
4. **Trigger Config:** `{}` (no extra config needed for this trigger)
5. **Action Type:** `create_deal`
6. **Action Config:**
   ```json
   {
     "pipeline": "Sales Pipeline",
     "stage": "Closed Won",
     "owner": "admin@yourcompany.com",
     "tags": ["e-commerce", "auto-created"]
   }
   ```
7. Toggle **Active** to ON.
8. Click **Save Rule**.

### 6.4 Example: Create a Lead When an RFQ is Submitted

1. **Name:** `RFQ Submitted → CRM Lead`
2. **Trigger Event:** `rfq_submitted`
3. **Trigger Config:** `{}`
4. **Action Type:** `create_lead`
5. **Action Config:**
   ```json
   {
     "source": "RFQ Form",
     "owner": "sales@yourcompany.com",
     "rating": "Hot"
   }
   ```
6. Save and enable.

### 6.5 Example: Flag Inactive Users

1. **Name:** `30-Day Inactivity → Re-engagement Lead`
2. **Trigger Event:** `user_inactive`
3. **Trigger Config:** `{"days": 30}`
4. **Action Type:** `create_lead`
5. **Action Config:** `{"source": "Re-engagement", "owner": "marketing@yourcompany.com"}`
6. Save and enable.

### 6.6 Monitoring Rule Execution

- Each rule tracks `lastRunAt` and `runCount`.
- View rule history in the Automations table — hover over the run count to see a mini log.
- Full execution logs for automation-triggered syncs appear in the **Sync Logs** view filtered by `syncType = instant`.

---

## 7. Manual Sync vs Automatic Sync

### Manual Sync

Manual sync is initiated by an admin on demand. Use it to:
- Bootstrap data after the initial connection.
- Re-sync after a data correction.
- Verify a specific entity before enabling automatic sync.

**How to run a manual sync:**
1. Go to **Admin → Integrations → CRM** (hub page).
2. Click **Sync Now** on the Zoho connection card.
3. Select entity and direction.
4. Click **Start Sync** and monitor progress in the modal.

**CLI equivalent (for server-side scripts):**
```bash
curl -X POST https://your-domain.com/api/admin/crm/sync \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"entity": "contact", "direction": "push"}'
```

### Automatic Sync

When `syncEnabled = true` on the `CrmConnection` record, the sync engine runs at the configured `syncInterval`. The scheduler is driven by a Next.js Route Handler configured as a cron job (or an external cron hitting `/api/admin/crm/cron`).

**Cron configuration example (Vercel cron):**
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/admin/crm/cron",
      "schedule": "0 * * * *"
    }
  ]
}
```

The cron endpoint:
1. Queries all `CrmConnection` records where `syncEnabled = true` and `nextSyncAt <= now()`.
2. For each connection, runs the sync for all mapped entities.
3. Updates `lastSyncAt` and calculates `nextSyncAt` based on `syncInterval`.

### Sync Conflict Resolution

When direction is `both`, conflicts (same field changed in both systems since last sync) are resolved by **Cadical-wins** — the local database value takes precedence. The Zoho value is overwritten.

To reverse this (Zoho wins), set the field mapping direction to `fromcrm` only.

---

## 8. Webhook Configuration

Webhooks allow Zoho CRM to push events to Cadical in real time when records change in Zoho. This enables `fromcrm` updates without waiting for the next sync cycle.

### Cadical Webhook Endpoint

```
POST https://your-cadical-domain.com/api/admin/crm/webhook
```

This endpoint:
- Accepts `application/json` payloads from Zoho.
- Logs the event in `CrmWebhookLog`.
- Processes the event asynchronously.
- Returns `200 OK` immediately (within 5 seconds as required by Zoho).

### Step-by-Step: Configure Webhooks in Zoho CRM

1. In Zoho CRM, go to **Settings → Automation → Webhooks**.
2. Click **+ New Webhook**.
3. Fill in:
   - **Webhook Name:** `Cadical Sync Webhook`
   - **URL to Notify:** `https://your-cadical-domain.com/api/admin/crm/webhook`
   - **Method:** `POST`
   - **Module:** Select the module (e.g. Contacts, Deals) — create one webhook per module
4. Under **Parameters**, add:
   - Key: `Content-Type` | Value: `application/json`
   - Key: `X-Zoho-Module` | Value: `${module_name}` (Zoho merge field)
5. Under **Body**, select **JSON** and add the fields you want Cadical to receive, e.g.:
   ```json
   {
     "id": "${Contacts.id}",
     "email": "${Contacts.Email}",
     "name": "${Contacts.Full_Name}",
     "modified_at": "${Contacts.Modified_Time}"
   }
   ```
6. Click **Save**.
7. Under **Triggers**, associate the webhook with record events: `On Create`, `On Update`.

### Step-by-Step: Create a Workflow Rule to Fire the Webhook

1. Go to **Settings → Automation → Workflow Rules**.
2. Click **+ Create Rule**.
3. Module: **Contacts** (or the relevant module).
4. Rule Name: `Cadical Sync on Update`.
5. When to trigger: **Record is modified** → All fields.
6. Add Action: **Webhook** → Select the webhook created above.
7. Click **Save and Activate**.

Repeat for each module: Contacts, Accounts, Deals, Cases, Leads.

### Webhook Signature Verification

For security, configure a shared secret in Zoho (add it as a custom header):
- Header key: `X-Cadical-Webhook-Secret`
- Header value: A random secret string (store it in env as `ZOHO_WEBHOOK_SECRET`)

The `/api/admin/crm/webhook` handler validates this header before processing. Requests without a matching secret return `401 Unauthorized`.

---

## 9. Troubleshooting Common Errors

### 9.1 Token Expired

**Symptom:** Sync log shows `error: "invalid_token"` or `"Access token expired"`. Health score drops below 50.

**Cause:** Zoho access tokens expire after 1 hour. The system should refresh automatically using the stored `refreshToken`. If the refresh also fails, the connection is broken.

**Fix:**
1. Go to **Admin → Integrations → CRM**.
2. Click **Reconnect** on the Zoho card.
3. Re-authorize via the OAuth consent screen.
4. New tokens are stored and the health score resets to 100.

**Prevent recurrence:** Ensure the token refresh logic in `lib/crm/zoho.ts` is called before every API request. Check that the refresh token has not expired (Zoho refresh tokens expire after 30 days of non-use).

---

### 9.2 Scope Mismatch

**Symptom:** OAuth callback returns `error=access_denied` or specific API calls return `"PERMISSION_DENIED"`.

**Cause:** The OAuth app was authorized with insufficient scopes, or the Zoho user does not have the required module permissions in their Zoho CRM profile.

**Fix:**
1. In Zoho CRM, go to **Settings → Users → Roles** and confirm the admin role has access to Contacts, Accounts, Deals, Cases, and Leads.
2. Revoke the existing OAuth grant in Zoho: **Settings → OAuth Applications** → find Cadical → **Revoke**.
3. Reconnect via the Cadical Setup Wizard — the consent screen will request the full scope list again.

---

### 9.3 Rate Limits

**Symptom:** Sync logs show `"API calls per day limit exceeded"` or HTTP 429 from Zoho API.

**Cause:** Zoho CRM enforces daily API call limits based on your plan:

| Plan | API Calls / Day |
|---|---|
| Standard | 5,000 |
| Professional | 100,000 |
| Enterprise | 200,000 |
| Ultimate | 500,000 |

**Fix:**
1. Increase sync interval to `hourly` or `daily` to reduce API call frequency.
2. Disable sync for non-critical entities (e.g. stop syncing Cases if that module is not in use).
3. Upgrade your Zoho plan if the limits are insufficient for your data volume.
4. The Cadical sync engine implements exponential backoff on 429 responses — failed records are queued in `CrmFailedJob` and retried automatically when the daily limit resets (midnight in your Zoho data center timezone).

---

### 9.4 Invalid Redirect URI

**Symptom:** After clicking "Connect to Zoho" you see `"redirect_uri_mismatch"` on the Zoho consent page.

**Fix:**
1. Go to [https://api-console.zoho.com](https://api-console.zoho.com).
2. Open your OAuth app.
3. Under **Authorized Redirect URIs**, confirm the URI exactly matches `ZOHO_REDIRECT_URI` in your environment — including `https://`, the correct domain, and the exact path `/api/admin/crm/callback`.
4. No trailing slashes.
5. Save and retry the connection.

---

### 9.5 Sync Succeeds But No Records Appear in Zoho

**Symptom:** Sync log shows `status: success`, `recordsSynced: 50`, but records are not visible in Zoho.

**Possible Causes and Fixes:**

| Cause | Fix |
|---|---|
| Required Zoho field not mapped | Open field mappings and ensure all mandatory Zoho module fields are mapped (e.g. `Last_Name` is required for Contacts) |
| Zoho record creation skipped due to duplicate | Zoho may deduplicate on email; check if records exist under a different lookup |
| Wrong Zoho API field name | Verify field API names in **Zoho Settings → Modules and Fields** |
| Transform function error | Test the transform function in the mapping editor; a runtime error silently skips the field |

---

### 9.6 Webhook Events Not Arriving

**Symptom:** Changes in Zoho are not reflected in Cadical.

**Fix:**
1. Verify the webhook URL in Zoho points to the correct Cadical domain (`/api/admin/crm/webhook`).
2. Check that the Zoho Workflow Rule is active (green status in **Settings → Automation → Workflow Rules**).
3. Open the Cadical webhook log at **Admin → Integrations → CRM → Webhooks** and check for received events.
4. If no events are logged, the webhook is not firing — check the Zoho Workflow Rule trigger conditions.
5. If events are logged with `status: failed`, check the `errorMessage` column for details.
6. Verify `ZOHO_WEBHOOK_SECRET` matches the secret set as a custom header in the Zoho webhook configuration.

---

## 10. Sync Log Interpretation

Navigate to **Admin → Integrations → CRM → Logs** (`/admin/integrations/crm/logs`).

### Log Table Columns

| Column | Meaning |
|---|---|
| `syncType` | `instant` (automation-triggered), `scheduled` (cron), `manual` (admin-initiated) |
| `entity` | Which Zoho module was synced: `contact`, `account`, `deal`, `lead`, `case` |
| `direction` | `push` (Cadical → Zoho) or `pull` (Zoho → Cadical) |
| `status` | `running` \| `success` \| `partial` \| `failed` |
| `recordsTotal` | Total records considered for this sync run |
| `recordsSynced` | Records successfully created or updated in the target system |
| `recordsFailed` | Records that failed to sync (written to `CrmFailedJob`) |
| `durationMs` | Total sync duration in milliseconds |
| `errorSummary` | Short description of errors if `status = partial` or `failed` |
| `startedAt` / `completedAt` | Sync run time range |

### Status Meanings

| Status | Meaning | Action Required |
|---|---|---|
| `running` | Sync is currently in progress | Wait for completion |
| `success` | All records synced without errors | None |
| `partial` | Some records synced, some failed | Review failed jobs |
| `failed` | No records synced; entire run failed | Check `errorSummary`, fix root cause, retry |

### Filtering Logs

Use the filter controls to narrow the log:
- **Entity** — filter to a specific module
- **Status** — show only failed or partial runs
- **Direction** — push vs pull
- **Date Range** — scope to a time window

### Reading a Partial Sync

A `partial` status means some records were written successfully and some were not. The `recordsFailed` count shows how many were skipped. Each failed record is written to `CrmFailedJob` with the full payload and error message — review those in the Failed Jobs view.

---

## 11. Retrying Failed Jobs

Navigate to **Admin → Integrations → CRM → Failed Jobs** (`/admin/integrations/crm/failed-jobs`).

### Understanding Failed Job Statuses

| Status | Meaning |
|---|---|
| `pending` | Waiting to be retried (within retry window) |
| `retrying` | Currently being retried by the background process |
| `resolved` | Successfully synced on a retry attempt |
| `abandoned` | Exceeded `maxRetries` (default: 3); requires manual intervention |

### Automatic Retry Behaviour

The retry engine checks for pending failed jobs:
- After each scheduled sync run.
- When triggered manually via "Retry All".

Retries use exponential backoff:
- Attempt 1: immediate
- Attempt 2: 5 minutes later
- Attempt 3: 30 minutes later
- After 3 failures: status set to `abandoned`

### Manually Retrying a Single Job

1. Find the job in the Failed Jobs table.
2. Click **Retry** on that row.
3. The job's `status` changes to `retrying`.
4. If successful, it moves to `resolved` and the record appears in Zoho.
5. If it fails again and `retryCount < maxRetries`, it returns to `pending`.

### Retrying All Pending Jobs

1. Click **Retry All** (top-right of the Failed Jobs page).
2. All jobs with `status = pending` are queued for immediate retry.
3. Monitor progress in the Sync Logs view with `syncType = manual`.

### Fixing an Abandoned Job

1. Click **View Payload** on the abandoned job row.
2. The full JSON payload that was sent to Zoho is displayed.
3. Identify the issue (e.g. missing required field, invalid value).
4. Fix the underlying data in Cadical (edit the user/order/booking record).
5. Click **Reset and Retry** on the failed job — this resets `retryCount = 0` and `status = pending`.
6. Trigger a manual retry or wait for the next scheduled sync.

### Bulk Resolution

For large numbers of abandoned jobs caused by a systemic issue (e.g. a bad field mapping):
1. Fix the root cause (correct the field mapping or transform function).
2. Click **Reset All Abandoned** — sets all abandoned jobs back to `pending`.
3. Click **Retry All** to process them.

### Exporting Failed Jobs

1. Click **Export CSV** to download all failed jobs with their payloads and error messages.
2. Use this for offline analysis or to share with your integration developer.
