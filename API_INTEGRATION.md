# RentNest API Integration

Base URL is configured with `NEXT_PUBLIC_API_URL` and defaults to:

```text
https://rnest-backend.vercel.app/api
```

| Frontend route/component   | Backend endpoint                                          | Purpose                                             |
| -------------------------- | --------------------------------------------------------- | --------------------------------------------------- |
| `/` · `FeaturedProperties` | `GET /properties?limit=6&sortBy=createdAt&sortOrder=desc` | Latest available properties                         |
| `/` · `HeroSection`        | `GET /categories`                                         | Real property-type options                          |
| `/properties`              | `GET /properties`                                         | Backend search, filtering, sorting, and pagination  |
| `/properties`              | `GET /categories`                                         | Category filter options                             |
| `/properties/[id]`         | `GET /properties/:id`                                     | Property details                                    |
| `/auth/register`           | `POST /auth/register`                                     | Tenant or landlord account creation                 |
| `/auth/login`              | `POST /auth/login`                                        | Login, role retrieval, and frontend session cookie  |
| `/dashboard/*`             | `GET /auth/me`                                            | Verify the HttpOnly-cookie session and current role |
| `LogoutButton`             | `POST /auth/logout`                                       | End the backend session and clear frontend cookies  |

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
