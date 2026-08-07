import { NextResponse, type NextRequest } from "next/server"

import { ACCESS_TOKEN_COOKIE, USER_ROLE_COOKIE } from "./lib/auth-cookies"
import { getDashboardPath, isUserRole } from "./lib/roles"
import type { UserRole } from "./types/auth"

function getRequiredRole(pathname: string): UserRole | null {
  if (pathname.startsWith("/dashboard/tenant")) return "TENANT"
  if (pathname.startsWith("/dashboard/landlord")) return "LANDLORD"
  if (pathname.startsWith("/dashboard/admin")) return "ADMIN"

  return null
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value
  const roleCookie = request.cookies.get(USER_ROLE_COOKIE)?.value

  if (!accessToken || !isUserRole(roleCookie)) {
    const loginUrl = new URL("/auth/login", request.url)
    loginUrl.searchParams.set("redirect", `${pathname}${search}`)

    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete(ACCESS_TOKEN_COOKIE)
    response.cookies.delete(USER_ROLE_COOKIE)
    return response
  }

  const ownDashboard = getDashboardPath(roleCookie)
  const requiredRole = getRequiredRole(pathname)

  if (
    pathname === "/dashboard" ||
    (requiredRole && requiredRole !== roleCookie)
  ) {
    return NextResponse.redirect(new URL(ownDashboard, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*"],
}
