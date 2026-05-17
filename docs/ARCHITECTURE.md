# Cadical Solutions — Technical Architecture

> Version 1.0 | Last Updated: May 2026

---

## 1. System Overview

Cadical Solutions is a multi-tenant healthcare supply-chain and field-service platform built on Next.js 16 (App Router). It serves four distinct user personas — platform admins, institutional buyers, verified suppliers, and field technicians — through a single unified codebase with role-based portals. The platform covers the full lifecycle from product discovery and procurement (RFQ → bulk order → payment) through field-service dispatch (booking → technician assignment → job completion → maintenance scheduling), and synchronises customer data bidirectionally with Zoho CRM via an OAuth 2.0 integration engine. Real-time job status updates are delivered over Pusher WebSockets. Payments are processed through Flutterwave. All mutations are captured in an immutable audit log, and security is enforced at the Next.js middleware layer before requests reach any route handler.

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Framework | Next.js 16.2.5 (App Router) | SSR, RSC, API routes, middleware |
| Language | TypeScript 5 | Type safety across client and server |
| UI Library | React 19 | Component model, Suspense, Server Components |
| Styling | Tailwind CSS + `components.json` (shadcn/ui) | Design system, responsive layouts |
| Icons | Lucide React | Consistent icon set |
| Charts | Recharts | Analytics dashboards |
| ORM | Prisma v7 + PrismaPg adapter | Type-safe PostgreSQL access, migrations |
| Database | PostgreSQL | Primary relational data store |
| Auth | better-auth v1.3.34 | Session (web) + JWT (mobile/API) hybrid auth |
| CRM | Zoho CRM (OAuth 2.0) | Bidirectional customer record sync |
| Real-time | Pusher | WebSocket channels for live job updates |
| Payments | Flutterwave | Payment initiation and webhook verification |
| Media | Cloudinary | Image upload, optimisation, CDN delivery |
| PWA | `manifest.json` + `sw.js` | Offline support, installability, push notifications |
| Deployment | Vercel (assumed) | Edge functions, serverless API routes |

---

## 3. Folder Structure

```
/
├── app/                          # Next.js App Router root
│   ├── layout.tsx                # Root layout (fonts, providers, PWA meta)
│   ├── page.tsx                  # Marketing home page
│   │
│   ├── admin/                    # Admin portal (role-gated)
│   │   ├── dashboard/            # KPI overview, recent activity feed
│   │   ├── products/             # Product catalogue CRUD
│   │   ├── orders/               # Order management, status updates
│   │   ├── bookings/             # Service booking queue
│   │   ├── clinicians/           # Clinician profile review
│   │   ├── suppliers/            # Supplier KYC approval workflow
│   │   ├── rfq/                  # RFQ listing, bid evaluation, award
│   │   ├── bulk-orders/          # Bulk order negotiation
│   │   ├── service-jobs/         # Job board (assign, track, complete)
│   │   ├── technicians/          # Technician roster management
│   │   ├── maintenance/          # Maintenance schedules and logs
│   │   ├── institutions/         # Institutional portal management
│   │   ├── referrals/            # Referral tracking
│   │   ├── analytics/            # Revenue, orders, service metrics charts
│   │   ├── audit-logs/           # Immutable activity log viewer
│   │   ├── tracking/             # Order shipment tracking dashboard
│   │   └── integrations/
│   │       └── crm/              # CRM integration management
│   │           ├── page.tsx      # Integration hub overview
│   │           ├── setup-wizard/ # Guided OAuth connection flow
│   │           ├── connect/      # Manual connection page
│   │           ├── mappings/     # Field mapping editor
│   │           ├── automations/  # Automation rule builder
│   │           ├── logs/         # Sync log viewer
│   │           ├── failed-jobs/  # Failed job queue and retry
│   │           └── webhooks/     # Incoming webhook log
│   │
│   ├── supplier/                 # Supplier portal (role-gated)
│   ├── technician/               # Technician mobile portal (role-gated)
│   ├── notifications/            # Notification centre
│   ├── auth/                     # Sign-in, sign-up, forgot password pages
│   ├── dashboard/                # Authenticated user dashboard
│   ├── products/                 # Public product catalogue
│   ├── booking/                  # General booking flow
│   ├── service-booking/          # Equipment service booking wizard
│   ├── rfq/                      # RFQ submission form
│   ├── cart/                     # Shopping cart
│   ├── checkout/                 # Checkout + Flutterwave payment
│   ├── clinician/                # Clinician public profile
│   ├── institutional-portal/     # Institution registration and portal
│   ├── referrals/                # Referral submission
│   ├── services/                 # Services catalogue
│   └── api/                      # API route handlers (see Section 6)
│
├── lib/                          # Server-side utilities and integrations
│   ├── prisma.ts                 # Prisma client singleton (PrismaPg adapter)
│   ├── auth.ts                   # better-auth configuration, providers
│   ├── auth-client.ts            # Client-side auth helpers
│   ├── audit.ts                  # Audit log write helper
│   ├── notifications.ts          # Notification creation and dispatch
│   ├── pusher.ts                 # Server-side Pusher client
│   ├── pusher-client.ts          # Browser Pusher binding
│   ├── cloudinary.ts             # Cloudinary upload helpers
│   ├── storage.ts                # Generic file storage abstraction
│   ├── aftership.ts              # AfterShip shipment tracking client
│   ├── generate-tracking-code.ts # Unique tracking code generator
│   ├── utils.ts                  # Shared utilities
│   ├── animations.ts             # Framer Motion animation presets
│   ├── types/                    # Shared TypeScript type definitions
│   └── crm/                      # CRM integration engine
│       ├── base.ts               # Base CRM adapter interface
│       ├── zoho.ts               # Zoho OAuth2 client and API wrapper
│       ├── sync.ts               # Sync orchestrator (push/pull logic)
│       ├── types.ts              # CRM-specific TypeScript types
│       └── index.ts              # CRM module public API
│
├── components/                   # Shared React components
├── context/                      # React context providers
├── hooks/                        # Custom React hooks
│
├── prisma/
│   ├── schema.prisma             # Database schema (all models)
│   ├── migrations/               # Prisma migration history
│   └── seed.ts                   # Database seed script
│
├── public/
│   ├── manifest.json             # PWA web app manifest
│   └── sw.js                     # Service worker (caching strategies)
│
├── middleware.ts                 # Rate limiting + security headers
├── next.config.ts                # Next.js configuration
├── prisma.config.ts              # Prisma config (adapter wiring)
└── tsconfig.json                 # TypeScript compiler options
```

---

## 4. Database Schema Overview

All models live in `prisma/schema.prisma`. PostgreSQL is the sole datastore.

### Core Identity

| Model | Key Fields | Purpose |
|---|---|---|
| `User` | `id`, `email`, `role`, `banned`, `premium` | Platform user account |
| `Session` | `userId`, `token`, `expiresAt`, `ipAddress` | Web session store (better-auth) |
| `Account` | `userId`, `providerId`, `accessToken`, `refreshToken` | OAuth provider links |
| `Verification` | `identifier`, `value`, `expiresAt` | Email / phone verification tokens |

### Commerce

| Model | Key Fields | Purpose |
|---|---|---|
| `Product` | `id`, `sku`, `price`, `stock`, `category`, `specs` | Product catalogue |
| `CartItem` | `userId`, `productId`, `quantity` | Shopping cart (unique per user+product) |
| `Order` | `id`, `trackingCode`, `status`, `totalAmount`, `paymentId` | Customer order |
| `OrderItem` | `orderId`, `productId`, `quantity`, `price` | Line items within an order |
| `TrackingEvent` | `orderId`, `status`, `message`, `location` | Shipment event history |

### Institutional / B2B

| Model | Key Fields | Purpose |
|---|---|---|
| `Institution` | `id`, `instName`, `cac`, `accountEmail`, `passwordHash` | Healthcare institution account |
| `Document` | `institutionId`, `type`, `url`, `status` | KYC compliance documents |
| `Clinician` | `userId`, `specialization`, `licenseNumber`, `verified` | Clinician profile |
| `Referral` | `refId`, `referrerFacility`, `clientFacilityName`, `urgencyLevel` | Clinical referrals |

### Supplier Marketplace

| Model | Key Fields | Purpose |
|---|---|---|
| `Supplier` | `id`, `companyName`, `status`, `rating`, `cacNumber` | Vendor account |
| `SupplierDocument` | `supplierId`, `type`, `url`, `status` | Supplier KYC documents |
| `SupplierProduct` | `supplierId`, `sku`, `unitPrice`, `bulkPrice`, `isApproved` | Products listed by suppliers |
| `RFQ` | `rfqCode`, `title`, `quantity`, `status`, `closingDate` | Request for Quotation |
| `RFQBid` | `rfqId`, `supplierId`, `unitPrice`, `leadTimeDays`, `status` | Supplier bid on an RFQ |
| `BulkOrder` | `bulkCode`, `items (JSON)`, `finalAmount`, `status` | Negotiated bulk purchase order |

### Service Ecosystem

| Model | Key Fields | Purpose |
|---|---|---|
| `ServiceBooking` | `bookingCode`, `serviceType`, `urgency`, `status`, `assignedTechId` | Customer equipment service request |
| `ServiceStatusEvent` | `bookingId`, `status`, `updatedByRole` | Status transition history |
| `TechnicianProfile` | `userId`, `specializations`, `status`, `rating`, `isOnJob` | Field technician profile |
| `ServiceJob` | `jobCode`, `bookingId`, `technicianId`, `status`, `diagnosticNotes` | Active job assigned to technician |
| `MaintenanceSchedule` | `scheduleCode`, `frequency`, `nextDueDate`, `isActive` | Recurring maintenance schedule |
| `MaintenanceLog` | `scheduleId`, `completedAt`, `technicianId`, `cost` | Maintenance completion records |
| `EquipmentRecord` | `passportCode`, `equipmentName`, `condition`, `serviceHistory (JSON)` | Equipment health passport |
| `ServiceContract` | `contractCode`, `plan`, `responseHours`, `includedVisits`, `status` | SLA service contracts |

### CRM Integration Engine

| Model | Key Fields | Purpose |
|---|---|---|
| `CrmConnection` | `provider`, `isConnected`, `accessToken`, `syncInterval`, `healthScore` | CRM provider connection config |
| `CrmFieldMapping` | `connectionId`, `entity`, `cadicalField`, `crmField`, `direction` | Field-level sync mapping |
| `CrmSyncLog` | `connectionId`, `entity`, `status`, `recordsSynced`, `recordsFailed` | Sync run audit trail |
| `CrmAutomationRule` | `triggerEvent`, `actionType`, `triggerConfig`, `actionConfig` | Event-driven CRM automation |
| `CrmWebhookLog` | `event`, `payload`, `status` | Inbound webhook event log |
| `CrmFailedJob` | `entity`, `operation`, `payload`, `retryCount`, `status` | Retry queue for failed sync operations |

### Supporting Models

| Model | Key Fields | Purpose |
|---|---|---|
| `Notification` | `userId`, `type`, `title`, `isRead`, `sentEmail`, `sentPush` | In-app and push notifications |
| `AuditLog` | `userId`, `action`, `entity`, `before`, `after`, `ipAddress` | Immutable audit trail |
| `ChatRoom` | `type`, `reference`, `participants` | Internal messaging rooms |
| `ChatMessage` | `roomId`, `senderId`, `senderRole`, `content`, `isRead` | Chat messages |

---

## 5. Authentication Architecture

### Web Sessions (Admin / Customer / Institution)

```
Browser → POST /api/auth/sign-in
       → better-auth validates credentials
       → Creates Session record in DB (token, expiresAt, ipAddress, userAgent)
       → Sets HttpOnly session cookie
       → Subsequent requests: middleware reads cookie → validates session token
```

- Session tokens are stored in the `Session` table and looked up on every protected request.
- `impersonatedBy` field on `Session` supports admin impersonation for support workflows.
- The `banned` flag on `User` is checked on session validation; banned users receive 403.

### JWT / API Access (Technician Mobile Portal)

```
Mobile client → POST /api/auth/sign-in (credentials)
             → better-auth returns signed JWT
             → Client stores JWT in secure storage
             → Subsequent requests: Authorization: Bearer <token>
             → Middleware / route handler validates JWT signature + expiry
```

The hybrid approach means web portals use cookie-based sessions (CSRF-safe) while the technician mobile portal uses stateless JWTs suitable for React Native or PWA offline scenarios.

### Role Enforcement

Roles are stored on the `User.role` field (`SUPER_ADMIN`, `CLINICIAN`, etc.) and checked in:
1. `middleware.ts` — path-level protection for `/admin`, `/api/admin`, `/technician/jobs`, `/supplier/dashboard`.
2. Individual API route handlers — fine-grained action-level checks.

---

## 6. API Design Conventions

### REST Conventions

- All API routes live under `app/api/`.
- Resources follow noun-based paths: `/api/service-jobs`, `/api/rfq`, `/api/notifications`.
- Standard HTTP verbs: `GET` (list/read), `POST` (create), `PUT` (update), `DELETE` (remove).
- Bulk operations use query parameters: `?status=OPEN&page=1&limit=20`.

### Standard Success Response Shape

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "total": 120,
    "page": 1,
    "limit": 20
  }
}
```

### Standard Error Response Shape

```json
{
  "success": false,
  "error": "Human-readable message",
  "code": "VALIDATION_ERROR",
  "details": { "field": "reason" }
}
```

### HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Success |
| 201 | Resource created |
| 400 | Validation error / bad request |
| 401 | Unauthenticated |
| 403 | Forbidden (insufficient role) |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |

### Key API Routes

| Route | Methods | Description |
|---|---|---|
| `/api/technician-profile` | GET, POST, PUT | Technician profile CRUD and status updates |
| `/api/service-booking` | GET, POST | Service booking creation and listing |
| `/api/service-jobs` | GET, POST, PUT | Job board with real-time Pusher events |
| `/api/maintenance` | GET, POST, PUT | Maintenance schedule management |
| `/api/notifications` | GET, PUT | Notification listing and mark-read |
| `/api/analytics` | GET | Admin KPI aggregations |
| `/api/audit-logs` | GET | Filterable audit log viewer |
| `/api/rfq` | GET, POST | RFQ submission and listing |
| `/api/rfq/bid` | POST | Supplier bid submission |
| `/api/supplier/register` | POST | Supplier onboarding |
| `/api/admin/suppliers` | GET, PUT | Supplier approval / suspension |
| `/api/admin/crm/*` | GET, POST, PUT, DELETE | Full CRM management |
| `/api/orders` | GET, POST | Order management |
| `/api/payment` | POST | Flutterwave payment initiation |
| `/api/verify-payment` | POST | Flutterwave webhook verification |
| `/api/upload` | POST | Cloudinary media upload |
| `/api/track` | GET | Order tracking by code |

---

## 7. Real-Time Architecture (Pusher)

Cadical uses Pusher for server-sent real-time events. The browser subscribes to named channels; the server triggers events after state mutations.

### Server-Side Trigger

```typescript
// lib/pusher.ts
import Pusher from 'pusher'
const pusher = new Pusher({ appId, key, secret, cluster })

// In /api/service-jobs PUT handler:
await pusher.trigger(`service-jobs`, 'status-updated', { jobId, status, technicianId })
await pusher.trigger(`booking-${bookingId}`, 'job-update', { status, message })
```

### Channel Reference

| Channel | Events | Subscribers |
|---|---|---|
| `service-jobs` | `status-updated`, `job-assigned`, `job-completed` | Admin job board |
| `booking-{bookingId}` | `job-update`, `technician-en-route`, `completed` | Customer booking detail page |
| `notifications-{userId}` | `new-notification` | Notification bell (all portals) |

### Client-Side Subscription

```typescript
// lib/pusher-client.ts
import Pusher from 'pusher-js'
const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, { cluster })

const channel = pusherClient.subscribe('service-jobs')
channel.bind('status-updated', (data) => { /* update UI */ })
```

---

## 8. CRM Integration Architecture

### Overview

The CRM engine in `lib/crm/` provides an adapter-based architecture. Currently Zoho CRM is the primary supported provider; the base interface in `lib/crm/base.ts` allows future addition of HubSpot, Salesforce, or Freshsales.

### Zoho OAuth 2.0 Flow

```
1. Admin navigates to /admin/integrations/crm/setup-wizard
2. Frontend calls GET /api/admin/crm/connect?provider=zoho
3. Server redirects to Zoho Accounts (accounts.zoho.com/oauth/v2/auth)
   with client_id, redirect_uri, scope, response_type=code
4. Admin approves access in Zoho
5. Zoho redirects to /api/admin/crm/callback?code=AUTH_CODE
6. Server exchanges code for access_token + refresh_token via POST to accounts.zoho.com/oauth/v2/token
7. Tokens stored encrypted in CrmConnection record
8. isConnected = true, healthScore = 100
```

### Sync Engine (`lib/crm/sync.ts`)

The sync engine supports three modes:

| Mode | Trigger | Description |
|---|---|---|
| **Manual** | Admin clicks "Sync Now" | Single full sync run for selected entity |
| **Scheduled** | Cron / Next.js cron route | Runs at configured interval (5min/15min/hourly/daily) |
| **Instant** | Automation rule fires | Triggered by platform events (order_completed, booking_created) |

Entity mapping:

| Cadical Entity | Zoho Module | Direction |
|---|---|---|
| User | Contacts | Both |
| Institution | Accounts | Both |
| Order | Deals | Push |
| ServiceBooking | Cases | Push |
| Referral | Leads | Push |

### Webhook Handler

Zoho can push events to `/api/admin/crm/webhook`. The handler:
1. Validates the incoming payload signature.
2. Writes a `CrmWebhookLog` record.
3. Processes the event (update local record, trigger notification).
4. Returns `200 OK` within 5 seconds (async processing if needed).

### Retry / Failed Jobs

Any sync operation that fails is written to `CrmFailedJob` with `retryCount = 0`. A background process retries up to `maxRetries` (default 3) with exponential backoff. Permanently failed jobs (`status = 'abandoned'`) are visible in `/admin/integrations/crm/failed-jobs`.

---

## 9. Security Layers

### Middleware Rate Limiting

`middleware.ts` implements an in-memory token-bucket rate limiter:
- **Limit:** 100 requests per IP per 60-second window.
- **Scope:** All `/api/*` routes.
- **Response on breach:** `429 Too Many Requests` with `Retry-After: 60` header.

> **Production note:** The in-memory store is single-process only. Replace with a Redis-backed counter (e.g. `@upstash/ratelimit`) for multi-instance deployments.

### Security Headers

Every response receives the following headers via middleware:

| Header | Value |
|---|---|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self)` |

### Audit Logging

Every significant mutation (create, update, delete, approve, reject, login, sync) is written to the `AuditLog` table via `lib/audit.ts`. Fields captured:

- `userId`, `userEmail`, `userRole`
- `action` and `entity` (e.g. `approve` / `supplier`)
- `entityId` — the affected record's primary key
- `before` / `after` — JSON snapshots for diff display
- `ipAddress`, `userAgent`

### Route Protection Matrix

| Path Pattern | Protection |
|---|---|
| `/admin/**` | Admin session required |
| `/api/admin/**` | Admin session required |
| `/technician/jobs`, `/technician/schedule` | Technician session or JWT required |
| `/supplier/dashboard` | Supplier session required |
| `/api/auth/**` | Public (auth endpoints) |
| `/api/products`, `/api/rfq`, `/api/services` | Public (read-only catalogue) |
| `/api/webhook` | Signature validation only |

---

## 10. PWA Architecture

### Web App Manifest (`public/manifest.json`)

Declares the app as installable with short name, theme colour, display mode (`standalone`), and icon assets for home-screen placement. Used primarily by the technician mobile portal.

### Service Worker (`public/sw.js`)

Implements the following caching strategies:

| Asset Type | Strategy | Notes |
|---|---|---|
| Static assets (`/_next/static/**`) | Cache First | Long-lived, versioned by Next.js hash |
| API routes (`/api/**`) | Network First | Fresh data preferred; cache as fallback |
| Navigation routes | Stale While Revalidate | App shell served instantly |
| Images (Cloudinary) | Cache First with expiry | 7-day TTL |

The service worker enables offline viewing of previously loaded pages — critical for field technicians in areas with poor connectivity.

---

## 11. Performance Considerations

### Prisma Connection Pooling

`lib/prisma.ts` uses the PrismaPg adapter (native PostgreSQL pooling) and exports a singleton Prisma client to prevent connection exhaustion during Next.js hot reload in development. In production on Vercel, the singleton pattern ensures the client is reused across invocations within a long-lived serverless container.

```typescript
// lib/prisma.ts pattern
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }
export const prisma = globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Static Asset Optimisation

- All images served via Cloudinary CDN — no local image storage.
- Next.js `<Image>` component enforces lazy loading and responsive `srcset`.
- Lucide React icons are tree-shaken at build time (named imports only).
- Recharts is loaded client-side only via `dynamic(() => import('recharts'), { ssr: false })` to avoid SSR bundle bloat.

### React Server Components

Admin dashboard pages, audit log viewers, and analytics pages are implemented as React Server Components where possible, eliminating client-side data fetching waterfalls and reducing JavaScript sent to the browser.

### Database Query Optimisation

- Compound unique constraints (`@@unique`) used on join tables (e.g. `[rfqId, supplierId]` on `RFQBid`).
- `@unique` on natural keys (`rfqCode`, `bookingCode`, `jobCode`, `trackingCode`) for fast single-record lookups.
- Pagination applied at the Prisma query layer (`take` / `skip`) — no unbounded list queries in production handlers.
