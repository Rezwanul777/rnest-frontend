# RentNest API Integration

Base URL is configured with `NEXT_PUBLIC_API_URL` and defaults to:

```text
https://rnest-backend.vercel.app/api
```

| Frontend route/component             | Backend endpoint                                          | Purpose                                             |
| ------------------------------------ | --------------------------------------------------------- | --------------------------------------------------- |
| `/` · `FeaturedProperties`           | `GET /properties?limit=6&sortBy=createdAt&sortOrder=desc` | Latest available properties                         |
| `/` · `HeroSection`                  | `GET /categories`                                         | Real property-type options                          |
| `/properties`                        | `GET /properties`                                         | Backend search, filtering, sorting, and pagination  |
| `/properties`                        | `GET /categories`                                         | Category filter options                             |
| `/properties/[id]`                   | `GET /properties/:id`                                     | Property details                                    |
| `/properties/[id]` · request modal   | `POST /rental-requests`                                   | Tenant submits a protected rental request           |
| `/auth/register`                     | `POST /auth/register`                                     | Tenant or landlord account creation                 |
| `/auth/login`                        | `POST /auth/login`                                        | Login, role retrieval, and frontend session cookie  |
| `/dashboard/*`                       | `GET /auth/me`                                            | Verify the HttpOnly-cookie session and current role |
| `/dashboard/tenant/requests`         | `GET /rental-requests`                                    | Tenant request history, filters, and pagination     |
| `/dashboard/landlord/properties`     | `GET /properties/me`                                      | Landlord-owned listings, filters, and pagination    |
| `/dashboard/landlord/properties/new` | `GET /categories`, `POST /properties`                     | Load property types and create a landlord listing   |
| `Landlord availability switch`       | `PATCH /properties/:id/availability`                      | Toggle whether a property is publicly available     |
| `/dashboard/landlord/requests`       | `GET /rental-requests`                                    | Landlord-scoped incoming request management         |
| `Landlord request actions`           | `PATCH /rental-requests/:id`                              | Approve or reject a pending rental request          |
| `LogoutButton`                       | `POST /auth/logout`                                       | End the backend session and clear frontend cookies  |

The property list sends these supported query parameters to the backend:

```text
page, limit, search, categoryId, minRent, maxRent,
amenities, sortBy, sortOrder
```

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

The landlord request table uses optimistic status updates. Approving a request
immediately marks that request as approved and other pending requests for the
same property as rejected, matching the backend transaction. Failed updates are
rolled back and displayed through a Sonner error toast. Only the backend remains
authoritative for the final status and rental-agreement creation.

The landlord property page fetches only listings owned by the authenticated
landlord. Search and availability filters are sent to the backend, while each
availability switch uses an optimistic update through a same-origin Route
Handler. Failed toggles are rolled back and reported with a toast.

The add-property form uses React Hook Form and Zod, loads categories from the
real backend, and supports multiple image URLs plus comma-separated amenities.
Its same-origin `POST /api/properties` Route Handler forwards the HttpOnly access
token to the protected backend endpoint. Backend field errors appear inline,
while all failures and successful creation are also reported with Sonner toasts.
