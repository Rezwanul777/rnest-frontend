export const ACCESS_TOKEN_COOKIE = "rentnest_access_token"
export const USER_ROLE_COOKIE = "rentnest_user_role"

export const authCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 24 * 60 * 60,
}
