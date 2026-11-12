import { describe, expect, test } from "vitest"
import { contracts, quotes, sales, units } from "@/demo/dataset"
import {
  alertsBetween,
  behindPlanUnits,
  comparisonFor,
  contractsEnding,
  customerResults,
  fleetCounts,
  monthMoney,
  periodMoney,
  pipelineValue,
  regionResults,
  utilizationPct,
} from "@/demo/metrics"
describe("sample dataset", () => {
  test("fleet counts match the contracts and sum to the fleet", () => {
    const counts = fleetCounts()
    expect(counts.total).toBe(units.length)
    expect(counts.available + counts.rented + counts.in_transit + counts.maintenance + counts.sold).toBe(counts.total)
    expect(counts.rented).toBe(contracts.reduce((sum, contract) => sum + contract.quantity, 0))
    expect(counts).toMatchObject({ available: 48, rented: 156, in_transit: 22, maintenance: 12, sold: 2 })
  })

  test("every rented unit points at its contract", () => {
    for (const unit of units.filter((item) => item.status === "rented")) {
      const contract = contracts.find((item) => item.id === unit.contractId)
      expect(contract?.customerId).toBe(unit.customerId)
      expect(contract?.unitType).toBe(unit.unitType)
    }
  })

  test("money identities hold for the year to date", () => {
    const money = periodMoney("ytd")
    expect(money.revenue).toBe(money.rentalRevenue + money.salesRevenue)
    expect(money.margin).toBe(money.revenue - money.cost)
    const customers = customerResults("ytd")
    expect(customers.reduce((sum, row) => sum + row.revenue, 0)).toBe(money.revenue)
    expect(customers.reduce((sum, row) => sum + row.margin, 0)).toBe(money.margin)
    expect(regionResults("ytd").reduce((sum, row) => sum + row.revenue, 0)).toBe(money.revenue)
  })

  test("november rental is the full active contract book", () => {
    const november = monthMoney("2026-11")
    const expected = contracts.reduce((sum, contract) => sum + contract.quantity * contract.monthlyRate, 0)
    expect(november.rentalRevenue).toBe(expected)
    const salesRevenue = sales
      .filter((sale) => sale.month === "2026-11")
      .reduce((sum, sale) => sum + sale.quantity * sale.unitPrice, 0)
    expect(november.salesRevenue).toBe(salesRevenue)
  })

  test("open pipeline excludes won and lost quotes", () => {
    const open = quotes.filter((quote) => quote.stage === "sent" || quote.stage === "negotiation")
    expect(pipelineValue(quotes)).toBe(open.reduce((sum, quote) => sum + quote.quantity * quote.unitPrice, 0))
  })

  test("period change uses the same revenue identity", () => {
    expect(comparisonFor("ytd")).toBeNull()
    const november = comparisonFor("nov")
    expect(november?.revenueDelta).toBe(monthMoney("2026-11").revenue - monthMoney("2026-10").revenue)
    const half = comparisonFor("h2")
    expect(half).not.toBeNull()
    const regions = regionResults("h2")
    expect(regions.reduce((sum, row) => sum + row.revenue, 0)).toBe(half?.current.revenue)
  })

  test("december is the only stored expiry month after the sample date", () => {
    expect(contractsEnding("2026-12").map((contract) => contract.id)).toEqual(["RC-2414"])
    expect(behindPlanUnits()).toHaveLength(1)
    expect(alertsBetween("2026-11-06")).toHaveLength(5)
  })

  test("utilization uses the unsold fleet", () => {
    const counts = fleetCounts()
    expect(utilizationPct()).toBe(Math.round((counts.rented / (counts.total - counts.sold)) * 1000) / 10)
  })
})
