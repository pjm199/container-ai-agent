export function formatUsd(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatMonth(month: string): string {
  return new Intl.DateTimeFormat("en-GB", { month: "short", timeZone: "UTC" }).format(
    new Date(`${month}-01T00:00:00Z`),
  )
}

export function formatDay(iso: string): string {
  const normalized = iso.length === 10 ? `${iso}T00:00:00Z` : iso
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(normalized))
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`
}
