const DEFAULT_API_URL = "https://rnest-backend.vercel.app/api"

const apiUrl = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API_URL).replace(
  /\/$/,
  ""
)

export const env = {
  apiUrl,
} as const
