# RentNest API Integration

Base URL is configured with `NEXT_PUBLIC_API_URL` and defaults to:

```text
https://rnest-backend.vercel.app/api
```

| Frontend route/component                   | Backend endpoint                                                                     | Purpose                                             |
| ------------------------------------------ | ------------------------------------------------------------------------------------ | --------------------------------------------------- |
| `/` · `FeaturedProperties`                 | `GET /properties?limit=3&sortBy=createdAt&sortOrder=desc`                            | Latest three available properties                   |
| `/` · `HeroSection`                        | `GET /categories`                                                                    | Real property-type options                          |
| `/properties`                              | `GET /properties`                                                                    | Backend search, filtering, sorting, and pagination  |
| `/properties`                              | `GET /categories`                                                                    | Category filter options                             |
| `/properties/[id]`                         | `GET /properties/:id`                                                                | Property details                                    |
| `/properties/[id]` · request modal         | `POST /rental-requests`                                                              | Tenant submits a protected rental request           |
| `/auth/register`                           | `POST /auth/register`                                                                | Tenant or landlord account creation                 |
| `/auth/login`                              | `POST /auth/login`                                                                   | Login, role retrieval, and frontend session cookie  |
| `/dashboard/*`                             | `GET /auth/me`                                                                       | Verify the HttpOnly-cookie session and current role |
| `/dashboard/tenant/requests`               | `GET /rental-requests`                                                               | Tenant request history, filters, and pagination     |
| `/dashboard/tenant`                        | `GET /rental-requests`, `GET /rental-agreements`, `GET /payments`                    | Real request, active-rental, and payment overview   |
| `/dashboard/tenant/requests/[id]/pay`      | `POST /payments/rental-agreements/:agreementId/checkout`                             | Create a real Stripe Checkout Session               |
| `/dashboard/tenant/payments`               | `GET /payments`                                                                      | Tenant-scoped payment history, filters, pagination  |
| `/dashboard/tenant/reviews`                | `GET /rental-agreements`, `POST /reviews/:rentalAgreementId`                         | Review eligible rentals and submit tenant feedback  |
| `/payment/success`                         | `GET /payments/session/:sessionId`                                                   | Verify webhook-confirmed payment and unlock review  |
| `/payment/cancel`                          | Stripe cancel redirect                                                               | Display cancellation and safe retry navigation      |
| `/dashboard/admin`                         | `GET /admin/users`, `GET /admin/properties`, `GET /rental-requests`, `GET /payments` | Global platform health overview                     |
| `/dashboard/admin/users`                   | `GET /admin/users`, `PATCH /admin/users/:userId`                                     | Search, filter, paginate, ban, and unban users      |
| `/dashboard/admin/properties`              | `GET /admin/properties`, `PATCH /admin/properties/:propertyId/availability`          | Inspect, search, filter, hide, and publish listings |
| `/dashboard/admin/requests`                | `GET /rental-requests`                                                               | Inspect, search, filter, and paginate all requests  |
| `/dashboard/admin/payments`                | `GET /payments`                                                                      | Inspect, search, filter, and paginate all payments  |
| `/dashboard/landlord/properties`           | `GET /properties/me`                                                                 | Landlord-owned listings, filters, and pagination    |
| `/dashboard/landlord`                      | `GET /properties/me`, `GET /rental-requests`, `GET /payments`                        | Real portfolio, request, and paid-earnings overview |
| `/dashboard/landlord/properties/new`       | `GET /categories`, `POST /properties`                                                | Load property types and create a landlord listing   |
| `/dashboard/landlord/properties/[id]/edit` | `GET /properties/me/:id`, `GET /categories`                                          | Load an owned property into the edit form           |
| `Landlord edit-property form`              | `PATCH /properties/:id`                                                              | Update an owned property listing                    |
| `Landlord delete confirmation`             | `DELETE /properties/:id`                                                             | Permanently remove an owned property listing        |
| `Landlord availability switch`             | `PATCH /properties/:id/availability`                                                 | Toggle whether a property is publicly available     |
| `/dashboard/landlord/requests`             | `GET /rental-requests`                                                               | Landlord-scoped incoming request management         |
| `/dashboard/landlord/tenants`              | `GET /rental-agreements`                                                             | Landlord-scoped tenant and lease history            |
| `Landlord request actions`                 | `PATCH /rental-requests/:id`                                                         | Approve or reject a pending rental request          |
| `LogoutButton`                             | `POST /auth/logout`                                                                  | End the backend session and clear frontend cookies  |

The property list sends these supported query parameters to the backend:

```text
page, limit, search, categoryId, minRent, maxRent,
amenities, sortBy, sortOrder
```

The homepage requests at most three real available properties. The Explore All
catalog requests six records per page. Because the backend PUBLIC scope enforces
`isAvailable: true`, these are maximum page sizes rather than guaranteed fake
counts: approving a rental makes that property unavailable and naturally
reduces the public total. When only one or two real listings remain, the
homepage grid expands those cards to avoid an awkward empty third column.

All requests pass through `services/api-client.ts`. Failed API responses become
structured `ApiError` instances and are displayed by Next.js route error
boundaries. Public property data revalidates every 60 seconds; categories
revalidate every 300 seconds.

Authentication forms use React Hook Form with shared Zod schemas. Browser forms
submit to same-origin Next.js Route Handlers under `/api/auth/*`; those handlers
forward requests to the backend and keep the access token in an HttpOnly cookie
for the role-based dashboard integration. Next.js 16 `proxy.ts` protects all
`/dashboard/*` routes and redirects tenant, landlord, and admin users to their
own dashboard. Dashboard layouts also call `GET /auth/me`, so the role cookie is
only a routing hint—the backend-authenticated user remains the security source.

The property request modal also uses React Hook Form and Zod. It submits through
the same-origin `/api/rental-requests` Route Handler, which reads the HttpOnly
access-token cookie and forwards the request to the protected backend endpoint.
Backend validation and conflict responses are shown as inline errors and Sonner
toast notifications.

The tenant request-history page performs a server-side authenticated fetch with
`page`, `limit`, `status`, `sortBy`, and `sortOrder` query parameters. The
backend scopes the response to the authenticated tenant. To enable the approved
request payment CTA, each approved request also needs its related
`rentalAgreement.id`, because Stripe checkout accepts an agreement ID rather
than a rental-request ID.

The tenant request table presents a combined rental lifecycle. Request-level
PENDING, APPROVED, and REJECTED states use orange, blue, and red badges;
agreement-level ACTIVE and COMPLETED states replace the approved badge with
green and gray badges. APPROVED plus PENDING_PAYMENT shows Pay now. After the
Stripe webhook confirms payment, ACTIVE shows Leave review as required by the
assignment journey. COMPLETED remains reviewable, while terminated or cancelled
agreements do not expose the review action. Existing reviews show View review.

The tenant overview aggregates only tenant-scoped backend data. Request totals
and recent activity come from rental requests, payable and active rentals come
from agreements filtered by `PENDING_PAYMENT` and `ACTIVE`, and total paid is
calculated across every page of the tenant's `PAID` payment records.

The tenant payment page resolves the approved request's tenant-scoped rental
agreement and creates checkout through a same-origin Route Handler. That handler
reads the HttpOnly access-token cookie and forwards only the agreement ID to the
backend. The browser receives Stripe's HTTPS `checkoutUrl` and redirects there;
no Stripe secret or payment amount exists in frontend code. The success page
does not mark a payment as paid from URL parameters. It polls the protected
`GET /payments/session/:sessionId` endpoint, and the review form appears on the
success page only after the backend returns `PAID` with an ACTIVE or COMPLETED
agreement. The Stripe webhook remains authoritative for payment and agreement
status. The cancel page keeps the agreement pending so the tenant can retry.

The tenant payment-history page sends `page`, `limit`, `status`, `sortBy`, and
`sortOrder` to `GET /payments`. The authenticated backend scope restricts the
result to the signed-in tenant's rental agreements. The table displays only
real payment fields returned by the API and includes all backend statuses:
`PENDING`, `PROCESSING`, `PAID`, `FAILED`, `REFUNDED`, and `CANCELLED`.

The tenant review page reads tenant-scoped `ACTIVE` and `COMPLETED` rental
agreements, including each agreement's optional `review` relation. A review is
submitted through a same-origin Route Handler to
`POST /reviews/:rentalAgreementId`. React Hook Form and Zod validate the 1–5
rating and optional comment, while backend field errors appear inline and in a
toast. The backend verifies agreement ownership, ACTIVE or COMPLETED status, a
real `PAID` payment, and the one-review-per-agreement rule.

The admin overview performs parallel server-side authenticated requests. User
and property totals come from the admin endpoints, pending and recent activity
come from the admin-scoped rental-request endpoint, and confirmed platform
revenue is calculated across all `PAID` payment pages visible to the admin.
Recent-user and recent-request panels display only real backend records.

Admin user management sends `page`, `limit`, `search`, `role`, `isActive`,
`sortBy`, and `sortOrder` to `GET /admin/users`. Ban and unban actions use a
same-origin protected Route Handler and optimistically update the selected row;
failed mutations roll back and show a toast. The current admin cannot ban their
own account in the UI, and the backend must enforce the same rule.

Admin property moderation sends `page`, `limit`, `search`, `isAvailable`,
`sortBy`, and `sortOrder` to `GET /admin/properties`. The endpoint uses the
backend ADMIN scope, so hidden listings remain visible to moderators. Hide and
Publish actions send an explicit boolean through a same-origin protected Route
Handler to `PATCH /admin/properties/:propertyId/availability`. The card updates
optimistically, rolls back on failure, and reports every result with a Sonner
toast. Public property links are shown only for published listings.

Admin rental-request oversight sends `page`, `limit`, `search`, `status`,
`sortBy`, and `sortOrder` to the authenticated `GET /rental-requests` endpoint.
The backend ADMIN scope returns platform-wide records with selected tenant,
property, and optional agreement data. The details dialog is read-only:
Approve/Reject remains a landlord action, preserving the assignment's role
boundaries and backend authorization rules.

Admin payment oversight sends `page`, `limit`, `search`, `status`, `sortBy`,
and `sortOrder` to the ADMIN-scoped `GET /payments` endpoint. The backend adds
only selected agreement, tenant, and property fields while continuing to omit
the Stripe checkout URL. The table and details dialog are read-only because
Stripe webhook verification—not a frontend action or success URL—owns payment
and rental-agreement status transitions.

The landlord request table uses optimistic status updates. Approving a request
immediately marks that request as approved and other pending requests for the
same property as rejected, matching the backend transaction. Failed updates are
rolled back and displayed through a Sonner error toast. Only the backend remains
authoritative for the final status and rental-agreement creation.

The tenant-history page reads landlord-scoped rental agreements. It supports
backend status filtering and pagination and shows only fields returned by the
API: tenant name, property, agreement status, activation date, and lease dates.

The landlord property page fetches only listings owned by the authenticated
landlord. Search and availability filters are sent to the backend, while each
availability switch uses an optimistic update through a same-origin Route
Handler. Failed toggles are rolled back and reported with a toast.

The landlord overview aggregates only backend-owned data. Property totals and
availability come from landlord-scoped property queries, pending and recent
activity come from landlord-scoped rental requests, and confirmed earnings are
the sum of all `PAID` records returned by the landlord-scoped payments API.

The add-property form uses React Hook Form and Zod, loads categories from the
real backend, and supports multiple image URLs plus comma-separated amenities.
Its same-origin `POST /api/properties` Route Handler forwards the HttpOnly access
token to the protected backend endpoint. Backend field errors appear inline,
while all failures and successful creation are also reported with Sonner toasts.

The edit-property route reuses the same validated form with backend values
prefilled. The owned-property endpoint supplies the initial data, and updates
are sent through a same-origin PATCH Route Handler so the HttpOnly token remains
server-side. Backend field errors remain attached to their matching form fields.

Deleting a listing requires an explicit confirmation dialog. The request uses
the same protected, same-origin property Route Handler and removes the card only
after the backend confirms success. Failed deletions remain visible and show
both inline dialog feedback and a Sonner toast.
