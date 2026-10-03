# CleanCare — Production-Grade Dry Cleaning & Laundry Platform

> Premium doorstep dry cleaning and laundry management platform.
> Three connected applications — Customer, Driver, Admin — backed by a unified REST API.

---

## Applications

| App              | URL                    | Tech Stack            |
|------------------|------------------------|-----------------------|
| Customer App     | http://localhost:3000  | Next.js 14 + Tailwind |
| Driver App       | http://localhost:3001  | Next.js 14 + Tailwind |
| Admin Portal     | http://localhost:3002  | Next.js 14 + Tailwind |
| Backend API      | http://localhost:4000  | NestJS + Prisma       |
| Swagger Docs     | http://localhost:4000/api/docs | OpenAPI 3.0  |

---

## Project Structure

```
cleancare/
├── apps/
│   ├── customer/        # PWA — mobile-first customer app
│   ├── driver/          # PWA — driver pickup & delivery app
│   └── admin/           # Desktop SaaS admin portal
├── backend/             # NestJS REST API
│   └── src/
│       ├── auth/        # OTP authentication, JWT, session
│       ├── orders/      # Order lifecycle + state machine
│       ├── customers/   # Customer & address management
│       ├── drivers/     # Driver jobs, pickup, delivery
│       ├── services/    # Service catalogue
│       ├── garments/    # Garment catalogue
│       ├── payments/    # Razorpay integration + webhooks
│       ├── notifications/ # Push, SMS, email
│       ├── processing/  # Processing center workflow
│       ├── qc/          # Quality control
│       ├── reports/     # Dashboard KPIs + analytics
│       ├── support/     # Tickets & messaging
│       ├── offers/      # Coupons & discounts
│       ├── audit/       # Audit logging
│       └── settings/    # Config + slots
├── packages/
│   ├── types/           # Shared TypeScript types
│   └── ui/              # Design tokens + Tailwind config
├── database/
│   ├── prisma/
│   │   └── schema.prisma # Complete DB schema (30+ tables)
│   └── seeds/
│       └── seed.ts       # Development seed data
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Quick Start — Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 15+ (or use Docker)
- Redis 7+ (or use Docker)
- Yarn (recommended)

### 1. Clone & Install

```bash
cd cleancare
cp .env.example .env
# Edit .env — fill in at minimum: DATABASE_URL, JWT_SECRET, REFRESH_TOKEN_SECRET
yarn install
```

### 2. Start services with Docker (easiest)

```bash
docker-compose up postgres redis -d
```

### 3. Set up database

```bash
# Generate Prisma client
yarn db:generate

# Run migrations
yarn db:migrate

# Seed demo data
yarn db:seed
```

### 4. Run all apps

Open 4 terminals:

```bash
# Terminal 1 — Backend API
yarn dev:backend

# Terminal 2 — Customer App  (http://localhost:3000)
yarn dev:customer

# Terminal 3 — Driver App    (http://localhost:3001)
yarn dev:driver

# Terminal 4 — Admin Portal  (http://localhost:3002)
yarn dev:admin
```

---

## Demo Credentials (after seeding)

All accounts use OTP authentication.
In development mode (`OTP_DEV_MODE=true`), use OTP: **123456**

| Role         | Mobile       | Notes                  |
|--------------|--------------|------------------------|
| Super Admin  | 9800000001   | Full access            |
| Ops Manager  | 9800000002   | Order management       |
| Driver       | 9876500010   | Rakesh Meena           |
| Customer     | 9876543210   | Rahul Sharma           |
| Customer     | 9876511111   | Priya Singh            |

---

## Order Lifecycle

```
BOOKED → PICKUP_ASSIGNED → PICKED_UP → RECEIVED
→ PROCESSING → QC → PACKED → READY_FOR_DELIVERY
→ OUT_FOR_DELIVERY → DELIVERED → COMPLETED
```

Every transition:
- Requires role authorization (enforced server-side)
- Creates an immutable status history record
- Triggers the relevant notification event
- Is written to the audit log

---

## Key Features

### Customer App
- OTP login/registration
- Service & garment catalogue (database-driven)
- 4-step booking wizard with live price estimate
- Saved addresses with type (Home/Office/Other)
- Pickup & delivery time slot selection
- UPI/Card/COD payment via Razorpay
- Real-time order tracking timeline (15s polling)
- Order history with search & filters
- Coupon/promo code support
- Push notifications
- Installable as PWA

### Driver App
- OTP login (driver-only accounts)
- Dashboard with today's stats & earnings
- Jobs list (Pickup / Delivery tabs)
- Pickup flow: Start → Customer OTP → Quantity check → Photo proof → Confirm
- Delivery flow: Start → Customer OTP → COD collection → Confirm
- Quantity mismatch auto-creates exception
- Real earnings tracking (daily/weekly/monthly)
- Google Maps navigation integration

### Admin Portal
- Real-time dashboard with KPI cards + charts (Recharts)
- Complete order management with advanced filters + CSV export
- Service catalogue CRUD with activate/deactivate
- Garment catalogue with SKU management
- Driver management + job assignment
- Payment tracking + refunds
- Support ticket management
- Coupon/offer configuration
- Processing center workflow
- QC with pass/fail/reprocess
- Exception tracking
- Audit logs
- User/role management (RBAC)
- Settings configuration

---

## API Documentation

Swagger UI available at: http://localhost:4000/api/docs

### Authentication

All API calls require JWT Bearer token except:
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/driver/verify-otp`
- `POST /api/auth/admin/verify-otp`
- `GET /api/services`
- `GET /api/settings/public`

---

## Environment Variables

See `.env.example` for all required variables with descriptions.

Critical variables:
- `DATABASE_URL` — PostgreSQL connection string
- `JWT_SECRET` — Min 64 random characters
- `REFRESH_TOKEN_SECRET` — Min 64 random characters
- `OTP_DEV_MODE=true` — Enable test OTP in development

---

## Deployment

### Docker (recommended)

```bash
docker-compose up --build -d
```

### Manual

1. Build all apps: `yarn build:all`
2. Run migrations: `yarn db:migrate`
3. Start backend: `cd backend && yarn start`
4. Serve Next.js apps with your preferred server

---

## Security Notes

- Never commit `.env` to version control
- Payment verification happens server-side only (Razorpay signature check)
- OTP has configurable expiry and max attempt limits
- All routes protected by JWT + RBAC guards
- Frontend never receives raw payment keys
- Audit log tracks every critical business action
- Rate limiting applied at API gateway level

---

## Tech Stack

| Layer       | Technology                              |
|-------------|-----------------------------------------|
| Frontend    | Next.js 14, React 18, TypeScript        |
| Styling     | Tailwind CSS                            |
| State       | Zustand + React Query                   |
| Backend     | NestJS, TypeScript                      |
| Database    | PostgreSQL 16 via Prisma ORM            |
| Cache       | Redis 7                                 |
| Auth        | JWT + OTP (MSG91/Twilio)                |
| Payments    | Razorpay                                |
| Storage     | AWS S3 compatible                       |
| Notifications | Firebase Push + SMS                   |
| Maps        | Google Maps                             |
| Charts      | Recharts                                |
| Container   | Docker + Docker Compose                 |

---

Built with ❤️ — CleanCare v1.0.0
