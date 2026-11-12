import { AS_OF } from "@/demo/dataset"
import { useDemo } from "@/demo/demo-context"
import { formatDay, formatMonth, formatPercent, formatUsd } from "@/demo/format"
import { Link } from "react-router-dom"
import {
  PERIODS,
  alertsBetween,
  comparisonFor,
  customerResults,
  forecast,
  periodById,
  periodMoney,
  regionResults,
  regionRevenueChange,
  revenueSeries,
  utilizationPct,
} from "@/demo/metrics"
import { fieldClass, HorizontalBars, KpiCard, Panel, RevenueChart, SectionHeading } from "@/components/demo-visuals"

export function IntelligencePage() {
  const demo = useDemo()
  const period = periodById(demo.periodId)
  const money = periodMoney(demo.periodId)
  const marginPct = money.revenue === 0 ? 0 : Math.round((money.margin / money.revenue) * 1000) / 10
  const customers = customerResults(demo.periodId)
  const regions = regionResults(demo.periodId)
  const outlook = forecast()
  const change = comparisonFor(demo.periodId)
  const regionsChange = regionRevenueChange(demo.periodId)
  const week = alertsBetween("2026-11-06")
  return (
    <div className="space-y-6 px-4 py-6 md:px-6">
      <SectionHeading
        eyebrow="Executive intelligence"
        title="Executive intelligence"
        description={`How the synthetic book stands through ${formatDay(AS_OF)}, where the sample moves, and what is worth reading today. The forecast repeats the November rental run-rate and does not assume further equipment sales.`}
        actions={
          <label className="grid w-full gap-1 text-sm sm:w-auto">
            <span className="text-muted-foreground">Period</span>
            <select aria-label="Period" className={fieldClass} value={demo.periodId} onChange={(event) => {
              const next = PERIODS.find((item) => item.id === event.target.value)
              if (next) {
                demo.setPeriodId(next.id)
              }
            }}>
              {PERIODS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
        }
      />
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Revenue" value={formatUsd(money.revenue)} detail={period.label} />
        <KpiCard label="Margin" value={formatPercent(marginPct)} detail={formatUsd(money.margin)} />
        <KpiCard label="Rental utilization" value={formatPercent(utilizationPct())} detail="Snapshot, not a period average" />
        <KpiCard label="Sales mix" value={formatPercent(money.revenue === 0 ? 0 : (money.salesRevenue / money.revenue) * 100)} detail={formatUsd(money.salesRevenue)} />
      </section>
      <Panel title="Change versus the previous window">
        {change && regionsChange ? (
          <>
            <p className="text-sm">
              Booked revenue is {formatUsd(change.current.revenue)} against {formatUsd(change.previous.revenue)} in {change.earlier[0]}
              {change.earlier.length > 1 ? `–${change.earlier[change.earlier.length - 1]}` : ""}. Change {formatUsd(change.revenueDelta)}.
            </p>
            <ul className="mt-3 divide-y text-sm">
              {regionsChange.map((row) => (
                <li key={row.region} className="flex items-center justify-between gap-3 py-2">
                  <span>{row.region}</span>
                  <span className="tabular-nums text-muted-foreground">{formatUsd(row.delta)}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Year to date has no earlier year in the sample, so a change figure is not shown. Select July–November to compare it with February–June.</p>
        )}
      </Panel>
      <Panel title="What deserves attention today">
        <ul className="divide-y text-sm">
          {week.map((alert) => (
            <li key={alert.id} className="py-2">
              <Link className="font-medium hover:underline" to={`/operations/alerts/${alert.id}`}>{alert.title}</Link>
              <p className="text-xs text-muted-foreground">{alert.severity} · sample alert</p>
            </li>
          ))}
        </ul>
      </Panel>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Revenue and margin">
          <RevenueChart points={revenueSeries(demo.periodId)} />
          <ul className="mt-3 space-y-1 text-xs text-muted-foreground">
            {revenueSeries(demo.periodId).map((point) => (
              <li key={point.month}>{formatMonth(point.month)} revenue {formatUsd(point.revenue)} · margin {formatUsd(point.margin)}</li>
            ))}
          </ul>
        </Panel>
        <Panel title="Customer profitability">
          <HorizontalBars rows={customers.map((row) => ({ label: row.customer.name, value: row.margin, display: formatUsd(row.margin) }))} />
        </Panel>
      </div>
      <Panel title="Geographic performance">
        <div className="min-w-0">
          <table className="data-cards w-full text-sm">
            <thead className="border-b text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="py-2 pr-3">Region</th>
                <th className="py-2 pr-3">Containers positioned</th>
                <th className="py-2 pr-3">Utilization</th>
                <th className="py-2 pr-3">Booked revenue</th>
                <th className="py-2">Margin</th>
              </tr>
            </thead>
            <tbody>
              {regions.map((region) => (
                <tr key={region.region} className="border-b last:border-b-0">
                  <td className="py-2 pr-3" data-label="Region">{region.region}</td>
                  <td className="py-2 pr-3 tabular-nums" data-label="Containers">{region.containers}</td>
                  <td className="py-2 pr-3 tabular-nums" data-label="Utilization">{formatPercent(region.utilization)}</td>
                  <td className="py-2 pr-3 tabular-nums" data-label="Revenue">{formatUsd(region.revenue)}</td>
                  <td className="py-2 tabular-nums" data-label="Margin">{formatUsd(region.margin)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Revenue is booked to the customer region. Container counts are current positions. The two views are labeled separately so they are not treated as the same figure.</p>
      </Panel>
      <Panel title="Illustrative rental forecast">
        <ul className="grid gap-3 sm:grid-cols-3">
          {outlook.map((point) => (
            <li key={point.month} className="border px-3 py-3">
              <p className="text-xs text-muted-foreground">{formatMonth(point.month)} {point.month.slice(0, 4)}</p>
              <p className="mt-1 text-lg font-semibold tabular-nums">{formatUsd(point.rental)}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}
