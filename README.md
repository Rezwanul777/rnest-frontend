<div align="center">

RentNest Frontend 🏠

Find, request, list, and manage rental properties with confidence.



Assignment 5 — RentNest Frontend<br />“Find & List Rental Properties with Ease”

Frontend Repository ·Backend Repository ·Live Backend

</div>

Overview

RentNest is a responsive rental-property marketplace built with the latestNext.js App Router, TypeScript, shadcn/ui, and Tailwind CSS. It connects to theRentNest REST API and provides dedicated experiences for tenants, landlords,and administrators.

Tenants can discover homes, submit rental requests, pay securely after landlordapproval, and leave verified reviews. Landlords can publish and manageproperties, process requests, and follow tenants and earnings. Administratorscan moderate users, properties, rental requests, and payments across theplatform.

The frontend uses real backend data—no mock property, request, payment, or userrecords are required.

Live Resources

Resource

URL

Frontend source

github.com/Rezwanul777/rnest-frontend

Backend source

github.com/Rezwanul777/rent-nest-backend

Backend deployment

rnest-backend.vercel.app

API base URL

https://rnest-backend.vercel.app/api

API mapping

API_INTEGRATION.md

Demo Admin Credentials

[!WARNING]These credentials are provided only for assignment evaluation. Never reusethis password for a personal account. Rotate or remove it before using theproject in production.

Role

Email

Password

Admin

ayaan.bin@gmail.com

admin-nest@123

Core Features

Public Experience

Responsive homepage with real featured properties from the backend

Dark and light themes with system-theme support

Backend-powered search, filtering, sorting, and pagination

Filters for location, rent, property category, and amenities

Property details with optimized images, amenities, landlord information, andrental-request CTA

Assignment-aligned How RentNest Works tenant and landlord journeys

Skeleton loading states, route error boundaries, empty states, and structuredAPI errors

Session-aware public navigation showing the current user, role, dashboardlink, and sign-out action

Tenant Dashboard

Tenant registration and login with React Hook Form and Zod

Browse properties and submit validated rental requests

Request history with Pending, Approved, Rejected, Active, and Completed states

Pay Now CTA only after landlord approval

Real Stripe Checkout redirect with success and cancel pages

Webhook-confirmed payment history

Active-rental and payment overview

Verified review submission after a successful payment

Submitted and waiting-review history

Landlord Dashboard

Portfolio, incoming-request, and confirmed-earnings overview

Create, edit, delete, publish, and hide property listings

Multiple image URL input and amenities management

Optimistic property-availability updates

Optimistic Approve/Reject rental-request actions with rollback on error

Automatic visibility of tenant and rental-agreement history

Backend-scoped property and payment data

Admin Dashboard

Platform overview for users, properties, requests, and confirmed revenue

Searchable and paginated user management

Ban and unban actions with self-ban protection

Property content moderation, including hidden listings

Platform-wide rental-request oversight

Read-only payment oversight backed by Stripe webhook status

Technology Stack

Area

Technology

Framework

Next.js 16 App Router

Language

TypeScript

UI

shadcn/ui with Nova styling

Styling

Tailwind CSS 4

Forms

React Hook Form

Validation

Zod

Icons

Lucide React

Notifications

Sonner

Theme

next-themes

Payments

Stripe Checkout

Backend

Express, Prisma, PostgreSQL, JWT, Stripe Webhooks

Deployment

Vercel

Application Workflow

flowchart TD
    A[Register or sign in] --> B{User role}

    B -->|Tenant| T1[Browse and filter properties]
    T1 --> T2[View property details]
    T2 --> T3[Submit rental request]
    T3 --> T4[Wait for landlord decision]
    T4 -->|Approved| T5[Proceed to Stripe Checkout]
    T5 --> T6[Backend verifies Stripe webhook]
    T6 --> T7[Payment becomes Paid and rental becomes Active]
    T7 --> T8[Leave a verified review]

    B -->|Landlord| L1[Create and manage listings]
    L1 --> L2[Receive tenant requests]
    L2 --> L3[Approve or reject]
    L3 --> L4[Approved tenant can pay]
    L4 --> L5[Track tenants and earnings]

    B -->|Admin| D1[Review platform statistics]
    D1 --> D2[Manage users]
    D1 --> D3[Moderate properties]
    D1 --> D4[Inspect requests and payments]

Rental and Payment Status Flow

PENDING request
      ↓ landlord approves
APPROVED + PENDING_PAYMENT agreement
      ↓ tenant completes Stripe Checkout
checkout.session.completed webhook
      ↓ backend verification
PAID payment + ACTIVE agreement
      ↓
Verified review available

The success-page URL is not treated as payment proof. Stripe webhookverification in the backend remains the authoritative source for payment andrental-agreement status.

Role and Session Architecture

Login is submitted to the same-origin Next.js route handler at/api/auth/login.

The handler forwards credentials to the RentNest backend.

The returned access token is stored in an application-wide HttpOnly cookie.

Next.js 16 proxy.ts protects /dashboard/* routes and provides fastrole-based redirects.

Dashboard layouts verify the authenticated user again throughGET /auth/me; the role cookie is only a routing hint.

Public pages preserve the session and display the verified user in thenavigation bar.

Only the explicit Sign out action calls the backend logout endpoint andclears the frontend cookies.

Protected browser mutations pass through same-origin route handlers, keepingthe access token unavailable to client-side JavaScript.

Main Routes

Route

Access

Purpose

/

Public

Homepage and featured properties

/properties

Public

Search, filter, sort, and paginate listings

/properties/[id]

Public

Property details and request CTA

/auth/register

Guest

Tenant or landlord registration

/auth/login

Guest

Role-aware login

/dashboard/tenant

Tenant

Tenant overview

/dashboard/tenant/requests

Tenant

Rental request history and actions

/dashboard/tenant/payments

Tenant

Stripe payment history

/dashboard/tenant/reviews

Tenant

Waiting and submitted reviews

/dashboard/landlord

Landlord

Landlord overview

/dashboard/landlord/properties

Landlord

Property management

/dashboard/landlord/properties/new

Landlord

Create a listing

/dashboard/landlord/requests

Landlord

Approve or reject requests

/dashboard/landlord/tenants

Landlord

Tenant and agreement history

/dashboard/admin

Admin

Platform overview

/dashboard/admin/users

Admin

Ban and unban users

/dashboard/admin/properties

Admin

Listing moderation

/dashboard/admin/requests

Admin

Global request oversight

/dashboard/admin/payments

Admin

Global payment oversight

/payment/success

Tenant

Verify Stripe session and expose review flow

/payment/cancel

Tenant

Explain cancellation and allow safe retry

Project Structure

rnest-frontend/
├── app/
│   ├── api/                         # Same-origin backend proxy routes
│   ├── auth/                        # Login and registration
│   ├── dashboard/
│   │   ├── tenant/                  # Tenant modules
│   │   ├── landlord/                # Landlord modules
│   │   └── admin/                   # Admin modules
│   ├── payment/                     # Stripe success/cancel pages
│   ├── properties/                  # Catalog and property details
│   ├── error.tsx                    # Global route error boundary
│   ├── loading.tsx                  # Global loading UI
│   └── page.tsx                     # Homepage
├── components/
│   ├── auth/                        # Auth forms and logout
│   ├── dashboard/                   # Shared and role-specific dashboard UI
│   ├── home/                        # Homepage sections and property cards
│   ├── layout/                      # Header and footer
│   ├── payment/                     # Payment confirmation UI
│   ├── properties/                  # Filters, catalog, and request CTA
│   └── ui/                          # shadcn/ui source components
├── lib/                             # Environment, roles, cookies, validation
├── services/                        # Public and authenticated API services
├── types/                           # Shared TypeScript domain types
├── proxy.ts                         # Next.js 16 role-based route protection
└── API_INTEGRATION.md               # Frontend-to-backend endpoint map

Getting Started

Prerequisites

Node.js 20.9 or newer

npm

A running RentNest backend or the deployed backend URL

Stripe test-mode configuration in the backend for payment testing

1. Clone the repository

git clone https://github.com/Rezwanul777/rnest-frontend.git
cd rnest-frontend

2. Install dependencies

npm install

3. Configure the environment

Create .env.local in the project root:

NEXT_PUBLIC_API_URL=https://rnest-backend.vercel.app/api

The project currently uses the same deployed API as its fallback, but anexplicit environment variable is recommended for local and production clarity.

Do not place STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, database credentials,or JWT secrets in the frontend environment.

4. Start the development server

npm run dev

Open http://localhost:3000.

5. Quality checks

npm run typecheck
npm run lint
npm run build

Available Scripts

Command

Purpose

npm run dev

Start Next.js development mode with Webpack

npm run typecheck

Check TypeScript without emitting files

npm run lint

Run ESLint

npm run build

Create a production build

npm run start

Start the production build

Error Handling and UX

React Hook Form and Zod provide field-level validation.

Backend field errors are mapped back to their matching form inputs.

Sonner toasts report successful and failed mutations.

Optimistic landlord/admin mutations roll back when the backend rejects them.

Route-specific loading.tsx, error.tsx, and not-found.tsx files handleloading, failures, and missing records.

Status badges use consistent colors across tenant, landlord, and admin views.

Assignment Coverage

Requirement

Implementation

Real API integration

Backend-powered services and same-origin protected route handlers

API documentation

API_INTEGRATION.md

Structured error handling

Inline validation, Sonner toasts, error boundaries, and rollback

Three role dashboards

Tenant, landlord, and admin protected workspaces

Next.js route protection

Next.js 16 proxy.ts plus backend /auth/me verification

Dark mode

System-aware light/dark theme toggle

Real payment flow

Stripe Checkout, webhook verification, success, and cancel pages

Admin credentials

Included above for assignment evaluation

Meaningful commits

Keep at least 20 descriptive frontend commits before submission

Recommended Next Features

1. Notification Center

Add in-app and optional email notifications for request approval/rejection,payment confirmation, property availability, and pending review reminders.Notifications should link directly to the relevant dashboard record.

2. Saved Properties and Saved Searches

Allow tenants to favorite properties, save filter combinations, and quicklyrevisit matching listings. A later version could notify users when a savedsearch receives a new property.

3. Managed Image Uploads

Replace manual image URLs with Cloudinary, UploadThing, or another signed uploadflow. Keep upload validation, preview, removal, size limits, and landlordownership checks.

4. Automated Testing and Production Hardening

Add Playwright end-to-end tests for authentication, role protection, requestapproval, Stripe test checkout, moderation, and review submission. Add componenttests, accessibility checks, rate-limit-aware error states, and deploymentmonitoring.

Before Final Submission

Deploy the frontend to Vercel and add its live URL to this README.

Set NEXT_PUBLIC_API_URL in the frontend Vercel environment.

Set the production frontend URL as the backend application URL.

Confirm backend CORS accepts the deployed frontend origin.

Update Stripe success/cancel URLs for the deployed frontend.

Confirm the Stripe webhook endpoint and signing secret in production.

Test tenant, landlord, and admin flows in separate browser sessions.

Confirm the demo admin credentials work on the deployed application.

Add 2–4 current screenshots or a short demo GIF to this README.

Verify at least 20 meaningful frontend commits.

Run typecheck, lint, and production build successfully.

Rotate demo credentials and all test secrets before real production use.

Security Notes

Access tokens are stored in HttpOnly cookies rather than local storage.

Backend authorization remains mandatory for every protected action.

Frontend role checks improve navigation but never replace backend permissionchecks.

Payment status is never changed from query parameters or client-side state.

Stripe secret keys and webhook secrets belong only in the backend environment.

Public demo credentials must not be reused for any non-demo account.

Contributing

Create a focused branch.

Keep changes small and assignment-aligned.

Run typecheck, lint, and build before committing.

Use descriptive commit messages such as:

feat: add role-aware notification center
feat: add cloud image upload for landlord listings
test: cover tenant request and Stripe checkout journey
fix: preserve authenticated navigation on public routes

<div align="center">

Built for Assignment 5 with Next.js, TypeScript, shadcn/ui, and the RentNest API.

</div>
