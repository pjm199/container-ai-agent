import {
  alerts,
  AS_OF,
  contracts,
  customers,
  customerById,
  locationById,
  MONTHS,
  sales,
  units,
} from "@/demo/dataset"
import type { FleetUnit, PeriodId, Quote, Region, UnitType } from "@/demo/types"

export type Money = {
  revenue: number
  cost: number
  margin: number
  rentalRevenue: number
  salesRevenue: number
}

export const PERIODS: Array<{ id: PeriodId; label: string; months: string[] }> = [
  { id: "nov", label: "November 2026", months: ["2026-11"] },
  { id: "q4", label: "Q4 2026 to date", months: ["2026-10", "2026-11"] },
  { id: "h2", label: "July–November 2026", months: MONTHS.slice(6) },
  { id: "ytd", label: "Year to date 2026", months: [...MONTHS] },
]

const EMPTY: Money = { revenue: 0, cost: 0, margin: 0, rentalRevenue: 0, salesRevenue: 0 }

export function periodById(id: PeriodId) {
  return PERIODS.find((period) => period.id === id) ?? PERIODS[3]
}

export function fleetCounts(fleet: FleetUnit[] = units) {
  const counts = { total: fleet.length, available: 0, rented: 0, in_transit: 0, maintenance: 0, sold: 0 }
  for (const unit of fleet) {
    counts[unit.status] += 1
  }
  return counts
}

export function utilizationPct(fleet: FleetUnit[] = units): number {
  const active = fleet.filter((unit) => unit.status !== "sold").length
  const rented = fleet.filter((unit) => unit.status === "rented").length
  if (active === 0) {
    return 0
  }
  return Math.round((rented / active) * 1000) / 10
}

export function monthMoney(month: string): Money {
  let rentalRevenue = 0
  let rentalCost = 0
  for (const contract of contracts) {
    if (contract.start <= month && contract.end >= month) {
      rentalRevenue += contract.quantity * contract.monthlyRate
      rentalCost += contract.quantity * contract.monthlyCost
    }
  }
  let salesRevenue = 0
  let salesCost = 0
  for (const sale of sales) {
    if (sale.month === month) {
      salesRevenue += sale.quantity * sale.unitPrice
      salesCost += sale.quantity * sale.unitCost
    }
  }
  const revenue = rentalRevenue + salesRevenue
  const cost = rentalCost + salesCost
  return { revenue, cost, margin: revenue - cost, rentalRevenue, salesRevenue }
}

function addMoney(left: Money, right: Money): Money {
  return {
    revenue: left.revenue + right.revenue,
    cost: left.cost + right.cost,
    margin: left.margin + right.margin,
    rentalRevenue: left.rentalRevenue + right.rentalRevenue,
    salesRevenue: left.salesRevenue + right.salesRevenue,
  }
}

export function periodMoney(periodId: PeriodId): Money {
  return periodById(periodId).months.map(monthMoney).reduce(addMoney, EMPTY)
}

export function revenueSeries(periodId: PeriodId) {
  return periodById(periodId).months.map((month) => {
    const money = monthMoney(month)
    return { month, revenue: money.revenue, margin: money.margin, rental: money.rentalRevenue }
  })
}

export function quoteValue(quote: Quote): number {
  return quote.quantity * quote.unitPrice
}

export function openPipeline(items: Quote[]) {
  return items.filter((quote) => quote.stage === "draft" || quote.stage === "sent" || quote.stage === "negotiation")
}

export function pipelineValue(items: Quote[]): number {
  return openPipeline(items).reduce((sum, quote) => sum + quoteValue(quote), 0)
}

export function customerResultsForMonths(months: readonly string[]) {
  return customers
    .map((customer) => {
      let revenue = 0
      let margin = 0
      for (const month of months) {
        for (const contract of contracts) {
          if (contract.customerId === customer.id && contract.start <= month && contract.end >= month) {
            const revenuePart = contract.quantity * contract.monthlyRate
            const costPart = contract.quantity * contract.monthlyCost
            revenue += revenuePart
            margin += revenuePart - costPart
          }
        }
        for (const sale of sales) {
          if (sale.customerId === customer.id && sale.month === month) {
            const revenuePart = sale.quantity * sale.unitPrice
            const costPart = sale.quantity * sale.unitCost
            revenue += revenuePart
            margin += revenuePart - costPart
          }
        }
      }
      return { customer, revenue, margin }
    })
    .filter((row) => row.revenue > 0)
    .sort((left, right) => right.margin - left.margin)
}

export function customerResults(periodId: PeriodId) {
  return customerResultsForMonths(periodById(periodId).months)
}

export function moneyForMonths(months: readonly string[]): Money {
  return months.map(monthMoney).reduce(addMoney, EMPTY)
}

export function previousMonths(periodId: PeriodId): string[] | null {
  if (periodId === "nov") {
    return ["2026-10"]
  }
  if (periodId === "q4") {
    return ["2026-08", "2026-09"]
  }
  if (periodId === "h2") {
    return ["2026-02", "2026-03", "2026-04", "2026-05", "2026-06"]
  }
  return null
}

export function comparisonFor(periodId: PeriodId) {
  const earlier = previousMonths(periodId)
  if (!earlier) {
    return null
  }
  const current = periodMoney(periodId)
  const previous = moneyForMonths(earlier)
  return { earlier, current, previous, revenueDelta: current.revenue - previous.revenue }
}

export function regionRevenueForMonths(months: readonly string[]) {
  const rows = customerResultsForMonths(months)
  const regions: Region[] = ["Europe", "Asia", "North America"]
  return regions.map((region) => ({
    region,
    revenue: rows.filter((row) => row.customer.region === region).reduce((sum, row) => sum + row.revenue, 0),
    margin: rows.filter((row) => row.customer.region === region).reduce((sum, row) => sum + row.margin, 0),
  }))
}

export function regionRevenueChange(periodId: PeriodId) {
  const earlier = previousMonths(periodId)
  if (!earlier) {
    return null
  }
  const before = regionRevenueForMonths(earlier)
  return regionRevenueForMonths(periodById(periodId).months)
    .map((row) => {
      const prior = before.find((item) => item.region === row.region)?.revenue ?? 0
      return { region: row.region, current: row.revenue, previous: prior, delta: row.revenue - prior }
    })
    .sort((left, right) => right.delta - left.delta)
}

export function typeResults(periodId: PeriodId) {
  const months = periodById(periodId).months
  const types: UnitType[] = ["20DC", "40HC", "40RF", "20TK"]
  return types
    .map((unitType) => {
      let revenue = 0
      let margin = 0
      for (const month of months) {
        for (const contract of contracts) {
          if (contract.unitType === unitType && contract.start <= month && contract.end >= month) {
            const revenuePart = contract.quantity * contract.monthlyRate
            const costPart = contract.quantity * contract.monthlyCost
            revenue += revenuePart
            margin += revenuePart - costPart
          }
        }
        for (const sale of sales) {
          if (sale.unitType === unitType && sale.month === month) {
            const revenuePart = sale.quantity * sale.unitPrice
            const costPart = sale.quantity * sale.unitCost
            revenue += revenuePart
            margin += revenuePart - costPart
          }
        }
      }
      return { unitType, revenue, margin }
    })
    .filter((row) => row.revenue > 0)
    .sort((left, right) => right.margin - left.margin)
}

export function contractsEnding(month: string) {
  return contracts.filter((contract) => contract.end === month)
}

export function alertsBetween(startDay: string, endDay: string = AS_OF) {
  return alerts.filter((alert) => {
    const day = alert.at.slice(0, 10)
    return day >= startDay && day <= endDay
  })
}

export function behindPlanUnits(fleet: FleetUnit[] = units): FleetUnit[] {
  const ids = new Set(
    alerts.filter((alert) => alert.title.toLowerCase().includes("behind")).map((alert) => alert.containerId),
  )
  return fleet.filter((unit) => ids.has(unit.id) || (unit.eta !== null && unit.eta < AS_OF))
}

export function regionResults(periodId: PeriodId) {
  const regions: Region[] = ["Europe", "Asia", "North America"]
  const rows = customerResults(periodId)
  return regions.map((region) => {
    const positioned = units.filter((unit) => locationById[unit.locationId]?.region === region)
    const rented = positioned.filter((unit) => unit.status === "rented").length
    const active = positioned.filter((unit) => unit.status !== "sold").length
    const money = rows.filter((row) => row.customer.region === region)
    return {
      region,
      containers: positioned.length,
      utilization: active === 0 ? 0 : Math.round((rented / active) * 1000) / 10,
      revenue: money.reduce((sum, row) => sum + row.revenue, 0),
      margin: money.reduce((sum, row) => sum + row.margin, 0),
    }
  })
}

export function locationStats() {
  return Object.values(locationById).map((location) => {
    const positioned = units.filter((unit) => unit.locationId === location.id)
    const rented = positioned.filter((unit) => unit.status === "rented").length
    const active = positioned.filter((unit) => unit.status !== "sold").length
    return {
      location,
      total: positioned.length,
      rented,
      available: positioned.filter((unit) => unit.status === "available").length,
      utilization: active === 0 ? 0 : Math.round((rented / active) * 1000) / 10,
    }
  })
}

export function underutilized(fleet: FleetUnit[] = units): FleetUnit[] {
  return fleet
    .filter((unit) => unit.status === "available" && unit.idleDays >= 45)
    .sort((left, right) => right.idleDays - left.idleDays)
}

export function forecast() {
  const november = monthMoney("2026-11").rentalRevenue
  return [
    { month: "2026-12", rental: november },
    { month: "2027-01", rental: november },
    { month: "2027-02", rental: november },
  ]
}

export function highAlerts() {
  return alerts.filter((alert) => alert.severity === "high")
}

export function customerName(id: string | null): string {
  if (!id) {
    return "Unassigned"
  }
  return customerById[id]?.name ?? id
}

export function locationName(id: string | null): string {
  if (!id) {
    return "Unknown"
  }
  return locationById[id]?.name ?? id
}
