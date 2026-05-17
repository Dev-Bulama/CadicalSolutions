# Cadical Solutions — Admin Operations Manual

> Version 1.0 | Last Updated: May 2026  
> Audience: Platform Administrators and Superadmins

---

## Table of Contents

1. [Logging In](#1-logging-in)
2. [Dashboard Overview](#2-dashboard-overview)
3. [Managing Products](#3-managing-products)
4. [Managing Orders](#4-managing-orders)
5. [Managing Suppliers](#5-managing-suppliers)
6. [Managing RFQs](#6-managing-rfqs)
7. [Service Jobs Pipeline](#7-service-jobs-pipeline)
8. [Technician Management](#8-technician-management)
9. [Maintenance Scheduling](#9-maintenance-scheduling)
10. [CRM Integration](#10-crm-integration)
11. [Analytics Dashboard](#11-analytics-dashboard)
12. [Audit Logs](#12-audit-logs)
13. [User Management](#13-user-management)

---

## 1. Logging In

### Default Superadmin Credentials

| Field | Value |
|---|---|
| URL | `https://your-domain.com/auth/sign-in` |
| Email | `superadmin@cadical.com` |
| Password | `Cadical@2026` |

> **Security notice:** Change the default password immediately after the first login. Navigate to **Account Settings → Security → Change Password**.

### Steps

1. Open a browser and navigate to the sign-in page.
2. Enter the email and password above.
3. Click **Sign In**.
4. On successful authentication you will be redirected to `/admin/dashboard`.
5. If the system prompts for email verification, check the inbox for `superadmin@cadical.com` and click the verification link.

### Troubleshooting Login

| Problem | Resolution |
|---|---|
| "Invalid credentials" | Confirm email is `superadmin@cadical.com` with no leading/trailing spaces |
| Account shows "Banned" | Check `User.banned` flag in database — reset via direct DB access or another superadmin |
| Session expires immediately | Verify server `SESSION_SECRET` environment variable is set |
| Redirected to `/auth/sign-in` on every page | Cookie domain mismatch — check `NEXTAUTH_URL` / `BETTER_AUTH_URL` env var |

---

## 2. Dashboard Overview

After logging in, the admin dashboard at `/admin/dashboard` provides a real-time summary of platform health.

### KPI Cards (top row)

| Card | What It Shows |
|---|---|
| Total Revenue | Sum of all paid orders in the selected period |
| Active Orders | Orders with status PAID, PROCESSING, or SHIPPED |
| Pending Bookings | Service bookings awaiting approval |
| Open RFQs | RFQs with status OPEN |
| Active Technicians | Technicians with status ACTIVE and `isAvailable = true` |
| Pending Suppliers | Suppliers awaiting KYC approval |

### Quick Action Shortcuts

The dashboard sidebar provides direct navigation to the most commonly used sections:
- **Approve Supplier** → jumps to the pending-suppliers filter in `/admin/suppliers`
- **Assign Technician** → opens the unassigned job queue in `/admin/service-jobs`
- **View Overdue Maintenance** → opens the overdue filter in `/admin/maintenance`

### Recent Activity Feed

The bottom of the dashboard shows the 20 most recent audit log entries across all entities — a quick pulse check on platform activity without navigating to the full audit log.

---

## 3. Managing Products

Navigate to **Admin → Products** (`/admin/products`).

### 3.1 Adding a New Product

1. Click **+ Add Product** (top-right button).
2. Fill in the product form:
   - **Name** — product display name (required)
   - **SKU** — unique stock-keeping unit (required, must be globally unique)
   - **Category** — select from EQUIPMENT, CONSUMABLES, PHARMACEUTICALS
   - **Price** — retail unit price in NGN
   - **Stock** — initial stock count
   - **Description** — full product description
   - **Specs** — JSON object for technical specifications (e.g. `{"voltage": "220V", "weight": "5kg"}`)
   - **Image** — click **Upload Image** to push to Cloudinary; the URL is stored automatically
3. Click **Save Product**.
4. The product is immediately visible in the public catalogue.

### 3.2 Editing a Product

1. In the products table, click the **pencil icon** on the product row, or click the product name.
2. Edit any field.
3. Click **Update Product**.
4. Changes take effect immediately.

### 3.3 Deactivating / Hiding a Product

There is no permanent delete for products to preserve order history integrity.

1. Open the product edit form.
2. Toggle the **Active** switch to OFF.
3. Click **Update Product**.
4. The product disappears from the public catalogue but remains in order records.

### 3.4 Managing Stock

Stock is decremented automatically when an order is placed and can be manually adjusted:

1. Open the product edit form.
2. Update the **Stock** field to the correct quantity.
3. Click **Update Product**.

> Products with `stock = 0` display as "Out of Stock" in the catalogue and cannot be added to cart.

---

## 4. Managing Orders

Navigate to **Admin → Orders** (`/admin/orders`).

### 4.1 Viewing Orders

The orders table displays all orders with:
- Order ID and tracking code
- Customer name and email
- Total amount
- Payment status (UNPAID / PAID)
- Fulfilment status (PENDING / PROCESSING / SHIPPED / DELIVERED / CANCELLED)
- Date placed

Use the **filter bar** to narrow by status, date range, or search by tracking code or customer email.

### 4.2 Updating Order Status

1. Click the order row to open the order detail panel.
2. Review order items, shipping address, and payment confirmation.
3. Click the **Status** dropdown and select the new status:
   - **PROCESSING** — payment confirmed, preparing shipment
   - **SHIPPED** — enter the carrier and tracking number in the provided fields, then save
   - **DELIVERED** — mark as delivered on confirmation
   - **CANCELLED** — provide a cancellation reason (recorded in the audit log)
4. Click **Update Status**.
5. The customer receives an automatic notification for status changes to SHIPPED and DELIVERED.

### 4.3 Viewing Order Tracking Events

Each order has a **Tracking Timeline** tab showing all `TrackingEvent` records — timestamped status messages and locations pushed by the AfterShip integration or manually entered by admins.

To add a manual tracking event:
1. Open the order.
2. Click **Add Tracking Event**.
3. Enter status, message, and optional location.
4. Click **Add**.

---

## 5. Managing Suppliers

Navigate to **Admin → Suppliers** (`/admin/suppliers`).

### 5.1 Viewing the Supplier Queue

The default view shows all suppliers, sortable by registration date. Filter by status using the tabs:
- **Pending** — awaiting KYC review
- **Approved** — active verified suppliers
- **Rejected** — applications declined
- **Suspended** — temporarily disabled accounts

### 5.2 Approving Supplier KYC

1. Click a supplier row with **PENDING** status.
2. The supplier detail panel opens. Review:
   - Company profile (name, category, address)
   - Business information (CAC number, tax ID, NAFDAC number)
   - Uploaded documents (click each document link to open in a new tab)
3. For each document, use the **Approve / Reject** buttons to set the document status.
4. Once all required documents are reviewed, click **Approve Supplier** at the bottom of the panel.
5. The supplier's `status` changes to `APPROVED`, `isActive = true`, and `verifiedAt` is recorded.
6. The supplier receives an email notification that their account is approved.

### 5.3 Rejecting a Supplier

1. Open the supplier detail panel.
2. Click **Reject Application**.
3. Enter a rejection reason (sent to the supplier by email).
4. Click **Confirm Rejection**.
5. The supplier's `status` changes to `REJECTED`.

### 5.4 Suspending an Active Supplier

1. Open an APPROVED supplier's detail panel.
2. Click **Suspend Supplier**.
3. Enter the suspension reason.
4. Click **Confirm Suspension**.
5. The supplier's `status` changes to `SUSPENDED` and `isActive = false`. They lose access to the supplier portal immediately.

### 5.5 Reactivating a Suspended Supplier

1. Open the SUSPENDED supplier's detail panel.
2. Click **Reactivate Supplier**.
3. Confirm the action.
4. The supplier's `status` returns to `APPROVED` and `isActive = true`.

---

## 6. Managing RFQs

Navigate to **Admin → RFQ** (`/admin/rfq`).

### 6.1 Viewing RFQs

The RFQ list shows all requests with status badge (OPEN / CLOSED / AWARDED / CANCELLED), requester, category, target budget, and closing date. Click an RFQ to expand its details and associated bids.

### 6.2 Reviewing Bids

Within an open RFQ:
1. Click the **Bids** tab to see all supplier bids.
2. Each bid shows: supplier name, unit price, total price, lead time (days), and any notes.
3. Click a supplier name to open their profile in a side panel.

### 6.3 Awarding a Bid

1. Open the RFQ detail view.
2. Go to the **Bids** tab.
3. On the winning bid row, click **Award Bid**.
4. Confirm the award.
5. The winning bid's `status` changes to `accepted`; all other bids change to `rejected`.
6. The RFQ's `status` changes to `AWARDED`.
7. The winning supplier and the requester receive email notifications.

### 6.4 Closing an RFQ Without Award

1. Open the RFQ detail view.
2. Click **Close RFQ**.
3. Enter a reason (e.g. "Budget not approved", "Requirements changed").
4. Click **Confirm Close**.
5. The RFQ's `status` changes to `CLOSED`. No supplier is notified of an award.

### 6.5 Shortlisting Bids

Before making a final award decision, you may shortlist bids:
1. On each bid row, click **Shortlist**.
2. Shortlisted bids have `status = 'shortlisted'` and are highlighted in the UI.
3. This has no notification effect — it is an admin working state only.

---

## 7. Service Jobs Pipeline

Navigate to **Admin → Service Jobs** (`/admin/service-jobs`).

The service pipeline moves a customer's service booking through these stages:

```
BOOKED → PENDING_APPROVAL → APPROVED → TECHNICIAN_ASSIGNED → TECHNICIAN_ACCEPTED
      → TECHNICIAN_EN_ROUTE → INSPECTION_STARTED → REPAIR_ONGOING
      → WAITING_FOR_PARTS → TESTING → COMPLETED → INVOICE_GENERATED
```

### 7.1 Reviewing New Bookings

1. Go to **Admin → Bookings** (`/admin/bookings`) for the booking intake queue.
2. New bookings have status `BOOKED`. Click a booking to review:
   - Equipment details (name, model, serial)
   - Service type and urgency
   - Site address and contact
   - Uploaded images and documents
3. Click **Approve Booking** to advance status to `APPROVED`.
4. Alternatively, click **Reject** and provide a reason.

### 7.2 Assigning a Technician

1. After approval, the booking appears in the Service Jobs queue with status `APPROVED`.
2. Click the job row.
3. Click **Assign Technician**.
4. A dropdown lists all ACTIVE technicians filtered by specialization match and availability.
5. Select a technician and click **Assign**.
6. The job's `status` advances to `TECHNICIAN_ASSIGNED`.
7. The technician receives an in-app notification and can accept or reject the job from their portal.
8. The customer receives a notification that a technician has been assigned.

### 7.3 Tracking Job Progress

The **Service Jobs** board shows real-time status via Pusher WebSockets — the status badge updates automatically when the technician advances the job from their portal. No page refresh is needed.

Click a job to see:
- Full status timeline with timestamps
- Technician diagnostic notes (populated as they work)
- Parts requested / used (JSON list)
- Estimated and actual costs

### 7.4 Manually Advancing Job Status

Admins can override status for exceptional cases:
1. Open the job detail panel.
2. Click **Update Status**.
3. Select the new status from the dropdown.
4. Add an admin note explaining the manual override.
5. Click **Save**.

### 7.5 Closing a Job (Invoice Generated)

Once the technician marks the job `COMPLETED`:
1. Open the job detail.
2. Review labor cost, parts cost, and total cost entered by the technician.
3. Click **Generate Invoice** to create a PDF invoice (stored in `ServiceJob.invoiceUrl`).
4. Click **Mark Invoice Sent** to update status to `INVOICE_GENERATED`.
5. Schedule a follow-up if needed using the **Follow-Up Date** field.

---

## 8. Technician Management

Navigate to **Admin → Technicians** (`/admin/technicians`).

### 8.1 Viewing the Technician Roster

The roster table shows all technicians with:
- Name, phone, state, specializations
- Status (ACTIVE / INACTIVE / ON_LEAVE / SUSPENDED)
- Availability flag
- Rating and total completed jobs

### 8.2 Creating a Technician Account

A technician must first have a User account on the platform. Then:

1. Go to **Admin → Technicians**.
2. Click **+ Add Technician**.
3. Search for the user by email.
4. Fill in the technician profile:
   - First name, last name, phone
   - Specializations (multi-select: installation, repair, calibration, etc.)
   - Certifications
   - Years of experience
   - State and city (dispatch base)
5. Click **Create Profile**.

### 8.3 Activating a Technician

New technician profiles default to `ACTIVE`. If a profile was manually set to `INACTIVE`:
1. Open the technician detail panel.
2. Click **Activate**.
3. The technician's `status` returns to `ACTIVE` and they appear in the assignment dropdown.

### 8.4 Suspending a Technician

1. Open the technician detail panel.
2. Click **Suspend Technician**.
3. Enter the reason.
4. Click **Confirm Suspension**.
5. `status = SUSPENDED`. The technician loses access to their job board and cannot be assigned new jobs.

### 8.5 Putting a Technician on Leave

1. Open the technician detail panel.
2. Click **Set On Leave**.
3. The technician's `status` changes to `ON_LEAVE`. They appear in the roster but are excluded from the job assignment dropdown.

---

## 9. Maintenance Scheduling

Navigate to **Admin → Maintenance** (`/admin/maintenance`).

### 9.1 Creating a Maintenance Schedule

1. Click **+ New Schedule**.
2. Fill in the form:
   - **Equipment Name** — name of the equipment to be maintained
   - **Equipment Model / Serial** — for identification
   - **Service Type** — select from: PREVENTIVE_MAINTENANCE, INSPECTION, CALIBRATION, etc.
   - **Frequency** — WEEKLY, MONTHLY, QUARTERLY, BIANNUAL, or ANNUAL
   - **Next Due Date** — first scheduled maintenance date
   - **Site Address and State**
   - **Assigned Institution** — link to an Institution record if applicable
   - **Assign Technician** — optional; pre-assigns a specific technician
   - **Auto-Assign** — if enabled, the system automatically assigns the nearest available technician when the due date approaches
   - **Reminder Days Before** — number of days before due date to send reminder notifications (default: 7)
3. Click **Create Schedule**.

### 9.2 Logging a Maintenance Completion

When a scheduled maintenance visit has been completed:

1. Find the schedule in the maintenance list.
2. Click **Log Completion**.
3. Fill in:
   - **Completed At** — date and time of completion
   - **Technician** — who performed the service
   - **Notes** — work performed
   - **Parts Used** — JSON list of parts consumed
   - **Cost** — total service cost
   - **Report URL** — link to uploaded service report (Cloudinary)
4. Click **Save Log**.
5. The schedule's `lastCompletedAt` and `nextDueDate` are updated automatically based on frequency.

### 9.3 Viewing Overdue Schedules

1. In the maintenance list, click the **Overdue** filter tab.
2. All schedules where `nextDueDate < today` are listed, sorted by how overdue they are.
3. From this view, click **Initiate Service** to create a service booking for the overdue equipment, which enters the normal service jobs pipeline.

### 9.4 Deactivating a Schedule

If equipment has been decommissioned:
1. Open the schedule detail.
2. Click **Deactivate Schedule**.
3. The `isActive` flag is set to `false` and the schedule no longer generates reminders or appears in the overdue report.

---

## 10. CRM Integration

Navigate to **Admin → Integrations → CRM** (`/admin/integrations/crm`).

### 10.1 Connecting Zoho CRM

1. Click **Connect New CRM**.
2. Select **Zoho CRM** from the provider list.
3. You are redirected to the **Setup Wizard** (`/admin/integrations/crm/setup-wizard`).
4. The wizard guides you through three steps:
   - **Step 1: Credentials** — enter your Zoho Client ID and Client Secret (obtained from Zoho API Console — see the full guide in `ZOHO_CRM_GUIDE.md`).
   - **Step 2: OAuth Authorization** — click **Connect to Zoho**. You are redirected to Zoho's consent screen. Log in as the Zoho CRM admin and click **Accept**.
   - **Step 3: Configuration** — after redirect back, configure sync interval (5min / 15min / hourly / daily) and enable sync.
5. Click **Finish Setup**. The integration card on the CRM hub shows **Connected** with a green indicator.

### 10.2 Configuring Field Mappings

Navigate to **Admin → Integrations → CRM → Mappings** (`/admin/integrations/crm/mappings`).

1. Select the **Entity** to configure from the tabs: Contacts, Accounts, Deals, Cases, Leads.
2. The mapping table shows current mappings with:
   - **Cadical Field** — the local database field
   - **Zoho Field** — the target field in Zoho
   - **Direction** — `tocrm` (push only), `fromcrm` (pull only), or `both`
3. To add a new mapping:
   - Click **+ Add Mapping**.
   - Select the Cadical field from the dropdown.
   - Enter the Zoho API field name (e.g. `Last_Name`, `Account_Name`).
   - Set direction and whether the field is required.
   - Optionally add a **Transform Function** (JavaScript expression to transform the value, e.g. `value.toUpperCase()`).
   - Click **Save Mapping**.
4. To delete a mapping, click the **trash icon** on the row and confirm.

### 10.3 Running a Manual Sync

1. Navigate to **Admin → Integrations → CRM** (hub page).
2. In the active connection card, click **Sync Now**.
3. Select the entity to sync (or "All Entities").
4. Select direction: **Push to Zoho** or **Pull from Zoho**.
5. Click **Start Sync**.
6. A progress indicator appears. When complete, a summary shows: records synced, records failed, duration.

### 10.4 Setting Up Automation Rules

Navigate to **Admin → Integrations → CRM → Automations** (`/admin/integrations/crm/automations`).

1. Click **+ New Rule**.
2. Configure the trigger:
   - **Trigger Event:** `order_completed` | `rfq_submitted` | `booking_created` | `user_inactive`
   - **Trigger Config:** for `user_inactive`, enter the number of inactivity days (e.g. `{"days": 30}`)
3. Configure the action:
   - **Action Type:** `create_deal` | `create_lead` | `create_contact` | `create_ticket` | `update_stage`
   - **Action Config:** pipeline, stage, owner, tags as required by the action type
4. Enter a rule name and description.
5. Toggle **Active** to ON.
6. Click **Save Rule**.

### 10.5 Retrying Failed Sync Jobs

Navigate to **Admin → Integrations → CRM → Failed Jobs** (`/admin/integrations/crm/failed-jobs`).

1. The table lists all failed jobs with entity, operation, error message, retry count, and status.
2. To retry a single job, click **Retry** on that row.
3. To retry all pending jobs, click **Retry All**.
4. Jobs that have exhausted `maxRetries` show status `abandoned` — these require manual investigation. Click **View Payload** to inspect the data, fix the underlying issue (e.g. correct a field value), then click **Reset and Retry**.

### 10.6 Monitoring Connection Health

The CRM hub shows a **Health Score** (0–100) for the active connection:
- **90–100:** Healthy — all recent syncs succeeded.
- **50–89:** Degraded — some failed syncs; review the sync log.
- **0–49:** Critical — token may be expired or credentials revoked; reconnect.

Click **View Logs** to open the sync log viewer at `/admin/integrations/crm/logs`.

---

## 11. Analytics Dashboard

Navigate to **Admin → Analytics** (`/admin/analytics`).

### 11.1 Available Charts

| Chart | Metric | Chart Type |
|---|---|---|
| Revenue Over Time | Total order revenue by day/week/month | Line chart |
| Orders by Status | Count of orders in each status | Bar chart |
| Top Products | Best-selling products by revenue | Horizontal bar |
| Service Jobs Volume | Jobs created vs completed over time | Line chart |
| Supplier Activity | RFQ bids submitted by supplier | Bar chart |
| Technician Performance | Jobs completed per technician | Bar chart |
| Maintenance Compliance | Completed vs overdue schedules | Pie chart |
| Notification Delivery | Email / SMS / push delivery rates | Stacked bar |

### 11.2 Changing the Time Period

Use the **Date Range** picker in the top-right corner to select:
- Last 7 days
- Last 30 days
- Last 90 days
- Custom range (date picker)

All charts update simultaneously when the range changes.

### 11.3 Reading the Charts

- **Hover** over any data point to see the exact value in a tooltip.
- **Click a legend item** to toggle that series on or off.
- **Recharts** renders all charts client-side; if a chart is blank, check that data exists for the selected period.

### 11.4 Exporting Data

1. Click the **Export** button above any chart.
2. Select format: **CSV** or **JSON**.
3. The data behind the chart is downloaded. The CSV includes column headers matching the chart's data fields.

> The analytics data is sourced from `/api/analytics` which aggregates from the database at request time. For very large datasets, expect a 2–5 second load time.

---

## 12. Audit Logs

Navigate to **Admin → Audit Logs** (`/admin/audit-logs`).

The audit log is an immutable record of every significant action taken on the platform. Records cannot be edited or deleted.

### 12.1 Reading the Audit Log Table

Each row shows:
- **Timestamp** — when the action occurred
- **User** — email and role of the actor
- **Action** — `create`, `update`, `delete`, `login`, `approve`, `reject`, `sync`
- **Entity** — which model was affected (e.g. `supplier`, `order`, `booking`)
- **Entity ID** — the primary key of the affected record
- **IP Address** — originating IP

### 12.2 Filtering the Audit Log

Use the filter controls to narrow results:

| Filter | How to Use |
|---|---|
| **Entity** | Select from dropdown: user, product, order, supplier, booking, crm, etc. |
| **Action** | Select: create, update, delete, approve, reject, login, sync |
| **User Email** | Type a partial email to filter by actor |
| **Date Range** | Select start and end date using the date picker |
| **Entity ID** | Paste a specific record ID to see all actions on that record |

Click **Apply Filters** to refresh the log. Click **Reset** to clear all filters.

### 12.3 Viewing Before / After Diff

For `update` actions, the audit log captures a `before` and `after` JSON snapshot:
1. Click the row with action type `update`.
2. A detail panel opens showing a **diff view** — fields that changed are highlighted in green (new value) and red (old value).

### 12.4 Exporting Audit Logs

1. Apply filters to scope the export.
2. Click **Export CSV**.
3. The filtered records download as a CSV file.

> Audit logs are retained indefinitely in the `AuditLog` table. For compliance archival, export and store externally on a regular schedule.

---

## 13. User Management

User accounts are managed through the admin section. There is no dedicated `/admin/users` page in the current routing — user actions are performed via direct database access or through the context of other modules (e.g. approving a supplier links their `userId`).

### 13.1 Viewing Users

Access user records via `/api/auth/admin` or through the audit log (filter by entity = `user`) to trace user activity.

### 13.2 Banning a User

To ban a user (immediate session termination and login block):

1. Locate the user record (by email, via the database or audit log).
2. Set `User.banned = true`.
3. Set `User.banReason` to a reason string.
4. Optionally set `User.banExpires` to a Unix timestamp for a temporary ban.
5. All existing sessions for the user are invalidated on next request (better-auth checks the `banned` flag on session validation).

### 13.3 Resetting a User Password

1. Trigger a password reset email via `POST /api/auth/forgot-password` with the user's email.
2. The user receives an email with a reset link valid for 24 hours.

### 13.4 Assigning the Admin Role

1. Set `User.role = 'SUPER_ADMIN'` for the target user (via direct database update or a seeded admin script).
2. The user's next session will have admin-level access.

> **Note:** Role management UI is on the roadmap. Currently, role assignments require direct database access or a seed script.

### 13.5 Impersonating a User (Support Mode)

The `Session.impersonatedBy` field supports admin impersonation for support investigations:
1. This feature requires a dedicated admin UI (in development).
2. When active, the impersonated session is flagged in audit logs as `impersonatedBy: <adminUserId>`.
