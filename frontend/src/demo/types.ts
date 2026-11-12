import type { ContainerStatus } from "@/lib/containers"

export type Region = "Europe" | "Asia" | "North America"
export type UnitType = "20DC" | "40HC" | "40RF" | "20TK"
export type QuoteStage = "draft" | "sent" | "negotiation" | "won" | "lost"
export type Severity = "high" | "medium" | "low"
export type PeriodId = "nov" | "q4" | "h2" | "ytd"

export type Location = {
  id: string
  name: string
  country: string
  region: Region
  x: number
  y: number
}

export type Customer = {
  id: string
  name: string
  region: Region
  segment: string
  since: string
  city: string
  contact: string
}

export type Contract = {
  id: string
  customerId: string
  quantity: number
  unitType: UnitType
  monthlyRate: number
  monthlyCost: number
  start: string
  end: string
  locationIds: string[]
  corridor: string
}

export type Sale = {
  id: string
  customerId: string
  month: string
  unitType: UnitType
  quantity: number
  unitPrice: number
  unitCost: number
  locationId: string
}

export type Quote = {
  id: string
  customerId: string
  locationId: string
  unitType: UnitType
  quantity: number
  unitPrice: number
  stage: QuoteStage
  created: string
  note: string
}

export type Sensor = {
  reportedAt: string
  temperatureC: number | null
  humidityPct: number | null
  door: "closed" | "open"
  shockG: number
  batteryPct: number
}

export type TimelineEvent = {
  at: string
  label: string
}

export type FleetUnit = {
  id: string
  number: string
  unitType: UnitType
  status: ContainerStatus
  locationId: string
  condition: "good" | "fair" | "poor"
  customerId: string | null
  contractId: string | null
  idleDays: number
  destinationId: string | null
  eta: string | null
  sensors: Sensor | null
  timeline: TimelineEvent[]
  prediction: string | null
}

export type Alert = {
  id: string
  severity: Severity
  title: string
  summary: string
  action: string
  at: string
  containerId: string
}
