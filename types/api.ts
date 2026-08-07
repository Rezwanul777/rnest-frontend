export type ApiResponse<T> = {
  success: boolean
  message: string
  data: T
}

export type PaginationMeta = {
  page: number
  limit: number
  total: number
  totalPages: number
}

export type ApiErrorResponse = {
  success?: boolean
  message?: string
  errorSources?: Array<{
    path?: string
    message?: string
  }>
}
