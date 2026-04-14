const DEFAULT_API_URL = "http://localhost:5050"
const TOKEN_KEY = "abs_admin_token"
export const CUSTOMER_TOKEN_KEY = "abs_customer_token"

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "")

export const API_BASE_URL = trimTrailingSlash(
  process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL
)

export type ApiRequestOptions = RequestInit & {
  auth?: boolean
  /** When auth is true, send this user JWT instead of the admin token. */
  useCustomerToken?: boolean
}

export class ApiError extends Error {
  status: number
  details: unknown

  constructor(message: string, status: number, details: unknown = null) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.details = details
  }
}

const buildUrl = (path: string) => {
  if (/^https?:\/\//.test(path)) return path
  if (!path.startsWith("/")) return `${API_BASE_URL}/${path}`
  return `${API_BASE_URL}${path}`
}

export const getAuthToken = () => {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(TOKEN_KEY)
}

export const setAuthToken = (token: string) => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(TOKEN_KEY, token)
}

export const clearAuthToken = () => {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(TOKEN_KEY)
}

export const getCustomerToken = () => {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(CUSTOMER_TOKEN_KEY)
}

export const setCustomerToken = (token: string) => {
  if (typeof window === "undefined") return
  window.localStorage.setItem(CUSTOMER_TOKEN_KEY, token)
}

export const clearCustomerToken = () => {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(CUSTOMER_TOKEN_KEY)
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const TRANSIENT_HTTP = new Set([502, 503, 504])

async function apiFetchOnce<T>(path: string, options: ApiRequestOptions): Promise<T> {
  const { auth = false, useCustomerToken = false, headers, ...rest } = options
  const requestHeaders = new Headers(headers)

  const isFormData =
    typeof FormData !== "undefined" && rest.body instanceof FormData

  if (!isFormData && !requestHeaders.has("Content-Type") && rest.body) {
    requestHeaders.set("Content-Type", "application/json")
  }

  if (auth) {
    if (typeof window !== "undefined") {
      const token = useCustomerToken ? getCustomerToken() : getAuthToken()
      if (!token) {
        throw new ApiError(
          useCustomerToken
            ? "Sign in required — open /account/login."
            : "Not signed in — open /admin/login and sign in again (no JWT in this browser).",
          401,
          null
        )
      }
      requestHeaders.set("Authorization", `Bearer ${token}`)
    }
  }

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers: requestHeaders,
  })

  const contentType = response.headers.get("content-type") || ""
  const isJson = contentType.includes("application/json")
  const payload = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message =
      (typeof payload === "object" &&
        payload &&
        "message" in payload &&
        typeof payload.message === "string" &&
        payload.message) ||
      response.statusText ||
      "Request failed"
    throw new ApiError(message, response.status, payload)
  }

  return payload as T
}

/**
 * JSON/API requests. **GET and HEAD** are retried up to 3 times on 502/503/504 or network errors
 * (mutations are not retried to avoid duplicate side effects).
 */
export const apiFetch = async <T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> => {
  const method = (options.method ?? "GET").toUpperCase()
  const allowRetry = method === "GET" || method === "HEAD"
  const maxAttempts = allowRetry ? 3 : 1

  let lastError: unknown
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await apiFetchOnce<T>(path, options)
    } catch (e) {
      lastError = e
      const canRetryAttempt = attempt < maxAttempts - 1
      const transientHttp =
        e instanceof ApiError && TRANSIENT_HTTP.has(e.status) && canRetryAttempt
      const networkFailure = e instanceof TypeError && allowRetry && canRetryAttempt
      if (transientHttp || networkFailure) {
        await sleep(280 * Math.pow(2, attempt))
        continue
      }
      throw e
    }
  }
  throw lastError
}

export const apiHealthCheck = async () => {
  return apiFetch<string>("/", { method: "GET" })
}
