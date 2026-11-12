import { AS_OF, TENANT } from "@/demo/dataset"
import { formatPercent, formatUsd } from "@/demo/format"
import {
  alertsBetween,
  behindPlanUnits,
  contractsEnding,
  customerName,
  locationName,
  pipelineValue,
  regionResults,
  regionRevenueForMonths,
  underutilized,
} from "@/demo/metrics"
import type { Quote } from "@/demo/types"

export const SUGGESTED_QUESTIONS = [
  "Which areas recorded the largest revenue increase?",
  "Which containers have been idle the longest?",
  "Which contracts expire in the next 30 days?",
  "Summarize this week's main anomalies.",
  "Compare fleet utilization between Europe and Asia.",
] as const

export type AssistantReply = {
  title: string
  narrative: string
  scope: string
  columns?: string[]
  rows?: string[][]
  href?: { to: string; label: string }
  recommendation: string
}

const SCOPE = `Synthetic sample for ${TENANT}, as of 12 Nov 2026. Not a live analysis and not connected to a company system.`
const EARLIER = ["2026-02", "2026-03", "2026-04", "2026-05", "2026-06"]

export function replyTo(question: string, items: Quote[] = []): AssistantReply {
  const normalized = question.toLowerCase()
  if (normalized.includes("increase") || (normalized.includes("revenue") && normalized.includes("area"))) {
    const current = regionResults("h2")
    const previous = regionRevenueForMonths(EARLIER)
    const ranked = current
      .map((row) => {
        const before = previous.find((item) => item.region === row.region)?.revenue ?? 0
        return { region: row.region, current: row.revenue, previous: before, delta: row.revenue - before }
      })
      .sort((left, right) => right.delta - left.delta)
    const leader = ranked[0]
    return {
      title: "Revenue change by customer region",
      narrative: leader
        ? `${leader.region} has the largest change in booked revenue for July–November against February–June: ${formatUsd(leader.delta)}. Revenue is rental plus equipment sales, attributed to the customer region. Quotes are excluded.`
        : "The sample does not have a comparable window.",
      scope: SCOPE,
      columns: ["Region", "Jul–Nov", "Feb–Jun", "Change"],
      rows: ranked.map((row) => [row.region, formatUsd(row.current), formatUsd(row.previous), formatUsd(row.delta)]),
      href: { to: "/executive", label: "Open executive intelligence" },
      recommendation: "Read the change beside the months that contain equipment sales. A region can move because of one sale, not because rental volume changed.",
    }
  }
  if (normalized.includes("idle") || normalized.includes("longest") || normalized.includes("underutil")) {
    const idle = underutilized()
    return {
      title: "Longest-idle sample units",
      narrative: `${idle.length} available units have been idle for at least 45 days. The table lists the longest waits in the snapshot.`,
      scope: SCOPE,
      columns: ["Unit", "Type", "Location", "Idle days"],
      rows: idle.slice(0, 6).map((unit) => [unit.number, unit.unitType, locationName(unit.locationId), String(unit.idleDays)]),
      href: { to: "/fleet/inventory?status=available", label: "Open available inventory" },
      recommendation: "These waits are yard days in the sample, not a live dwell feed.",
    }
  }
  if (normalized.includes("expire") || normalized.includes("contract") || normalized.includes("30")) {
    const ending = contractsEnding("2026-12")
    const first = ending[0]
    return {
      title: "Nearest contract expiry",
      narrative: `No sample contract stores a day inside the 30 days after ${AS_OF}. Terms are stored as months. ${first ? `${first.id} is the only term whose end month is December 2026.` : "No term ends in December 2026."}`,
      scope: SCOPE,
      columns: ["Contract", "Customer", "End month", "Monthly revenue"],
      rows: ending.map((contract) => [
        contract.id,
        customerName(contract.customerId),
        contract.end,
        formatUsd(contract.quantity * contract.monthlyRate),
      ]),
      href: first ? { to: `/commercial/contracts/${first.id}`, label: `Open ${first.id}` } : { to: "/commercial", label: "Open commercial intelligence" },
      recommendation: "Treat December as the next expiry window. Do not read it as a 30-day clock until a source system provides a date.",
    }
  }
  if (normalized.includes("anomal") || normalized.includes("week") || normalized.includes("risk") || normalized.includes("alert")) {
    const week = alertsBetween("2026-11-06")
    const late = behindPlanUnits()
    const lateUnit = late[0]
    return {
      title: "Anomalies in the sample week",
      narrative: `${week.length} sample alerts fall between 6 Nov and 12 Nov 2026. ${lateUnit ? `${lateUnit.number} is the unit marked behind its lane plan.` : "No unit has an arrival date before the sample date."}`,
      scope: SCOPE,
      columns: ["Severity", "Alert", "Unit"],
      rows: week.map((alert) => [alert.severity, alert.title, alert.containerId]),
      href: { to: "/operations", label: "Open connected operations" },
      recommendation: "The high-severity items are a warm reefer and a shock event. Both are scripted sample alerts.",
    }
  }
  if (normalized.includes("europe") || normalized.includes("asia") || normalized.includes("util")) {
    const rows = regionResults("ytd").filter((row) => row.region === "Europe" || row.region === "Asia")
    return {
      title: "Fleet utilization, Europe and Asia",
      narrative: "Utilization is the current rented share of unsold units positioned in the region. It is a snapshot, not an average over the selected period.",
      scope: SCOPE,
      columns: ["Region", "Positioned", "Utilization"],
      rows: rows.map((row) => [row.region, String(row.containers), formatPercent(row.utilization)]),
      href: { to: "/fleet", label: "Open fleet intelligence" },
      recommendation: "Compare this snapshot with booked revenue on the executive view. Position and revenue answer different questions.",
    }
  }
  return {
    title: "Demo assistant",
    narrative: `This assistant answers only from the ${TENANT} synthetic book. Open pipeline is ${formatUsd(pipelineValue(items))}. Choose a suggested question for a structured reply.`,
    scope: SCOPE,
    recommendation: "Ask about regional revenue change, idle units, the next contract expiry, this week's anomalies, or Europe versus Asia.",
  }
}
