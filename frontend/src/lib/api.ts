import type { Container, ContainerCreateInput } from "./containers"

export class ApiError extends Error {
  readonly status: number
  readonly body: unknown

  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.body = body
  }
}

type ErrorBody = {
  detail?: unknown
}

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]"])

export function publishableApiBase(configured: string | undefined, production: boolean): string | null {
  const value = configured?.trim()
  if (!value) {
    return null
  }
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return null
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return null
  }
  if (production && LOOPBACK_HOSTS.has(url.hostname)) {
    return null
  }
  return value.replace(/\/$/, "")
}

export function liveRegistryEnabled(): boolean {
  return publishableApiBase(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD) !== null
}

export function messageFromBody(body: unknown, status: number): string {
  if (status === 0) {
    return "The server could not be reached."
  }
  if (body && typeof body === "object" && "detail" in body) {
    const detail = (body as ErrorBody).detail
    if (typeof detail === "string" && detail.trim() !== "") {
      return detail
    }
    if (Array.isArray(detail)) {
      return "Some fields need attention."
    }
  }
  return `Request failed (${status}).`
}

export function fieldErrorsFromApi(error: ApiError): Record<string, string> {
  if (error.status === 409) {
    return { container_number: error.message }
  }
  if (!error.body || typeof error.body !== "object" || !("detail" in error.body)) {
    return {}
  }
  const detail = (error.body as ErrorBody).detail
  if (!Array.isArray(detail)) {
    return {}
  }
  const errors: Record<string, string> = {}
  for (const item of detail) {
    if (!item || typeof item !== "object") {
      continue
    }
    const record = item as { loc?: unknown; msg?: unknown }
    const loc = Array.isArray(record.loc) ? record.loc : []
    const field = loc.find((part) => typeof part === "string" && part !== "body")
    if (typeof field !== "string") {
      continue
    }
    errors[field] = typeof record.msg === "string" ? record.msg : "Invalid value."
  }
  return errors
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers)
  headers.set("Accept", "application/json")
  if (init?.body !== undefined) {
    headers.set("Content-Type", "application/json")
  }

  const base = publishableApiBase(import.meta.env.VITE_API_BASE_URL, import.meta.env.PROD)
  if (!base) {
    throw new ApiError("The live registry is not connected in this deployment.", 0, null)
  }

  let response: Response
  try {
    response = await fetch(`${base}${path}`, { ...init, headers })
  } catch {
    throw new ApiError("The server could not be reached.", 0, null)
  }

  if (!response.ok) {
    let body: unknown = null
    try {
      body = await response.json()
    } catch {
      body = null
    }
    throw new ApiError(messageFromBody(body, response.status), response.status, body)
  }

  return (await response.json()) as T
}

export function getHealth(): Promise<{ status: string; version: string }> {
  return request("/health")
}

export function listContainers(): Promise<Container[]> {
  return request("/containers")
}

export function getContainer(containerId: number): Promise<Container> {
  return request(`/containers/${containerId}`)
}

export function createContainer(input: ContainerCreateInput): Promise<Container> {
  return request("/containers", {
    method: "POST",
    body: JSON.stringify(input),
  })
}
