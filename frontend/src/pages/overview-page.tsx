import { Link } from "react-router-dom"
import { AS_OF, SAMPLE_NOTE, TENANT, alerts } from "@/demo/dataset"
import { useDemo } from "@/demo/demo-context"
import { formatDay, formatPercent, formatUsd } from "@/demo/format"
import {
  PERIODS,
  customerResults,
  fleetCounts,
  highAlerts,
  periodById,
  periodMoney,
  pipelineValue,
  revenueSeries,
  underutilized,
  utilizationPct,
} from "@/demo/metrics"
import { fieldClass, HorizontalBars, KpiCard, MapCanvas, Panel, RevenueChart, SectionHeading } from "@/components/demo-visuals"

const MODULES = [
  { to: "/fleet", title: "Fleet", text: "Inventory, utilization, distribution and maintenance.", accent: "border-t-teal-600 bg-teal-50/60" },
  { to: "/commercial", title: "Commercial", text: "Customers, quotes, contracts and margin.", accent: "border-t-amber-500 bg-amber-50/70" },
  { to: "/executive", title: "Executive", text: "How the sample company is doing, and what deserves attention.", accent: "border-t-indigo-500 bg-indigo-50/70" },
  { to: "/assistant", title: "Assistant", text: "Scripted answers over the same sample book.", accent: "border-t-violet-500 bg-violet-50/70" },
  { to: "/operations", title: "Operations", text: "Yard search, a container card and actions that stay in this session.", accent: "border-t-cyan-600 bg-cyan-50/70" },
]

export function OverviewPage() {
  const demo = useDemo()
  const period = periodById(demo.periodId)
  const money = periodMoney(demo.periodId)
  const counts = fleetCounts()
  const marginPct = money.revenue === 0 ? 0 : Math.round((money.margin / money.revenue) * 1000) / 10
  const leaders = customerResults(demo.periodId).slice(0, 4)
  const insight = customerResults(demo.periodId)[0]

  return (
    <div className="space-y-6 px-4 py-6 md:px-6">
      <SectionHeading
        eyebrow={TENANT}
        title="Executive overview"
        description={`A way to read the ${TENANT} synthetic book as of ${formatDay(AS_OF)}. It does not replace an operational system. Financials follow the selected period. Fleet figures are the same snapshot used in Fleet.`}
        actions={
          <label className="grid w-full gap-1 text-sm sm:w-auto">
            <span className="text-muted-foreground">Period</span>
            <select
              aria-label="Date range"
              className={fieldClass}
              value={demo.periodId}
              onChange={(event) => {
                const next = PERIODS.find((item) => item.id === event.target.value)
                if (next) {
                  demo.setPeriodId(next.id)
                }
              }}
            >
              {PERIODS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        }
      />
      <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        <KpiCard label="Revenue" value={formatUsd(money.revenue)} detail={`${period.label} · rental and sales`} />
        <KpiCard label="Margin" value={formatPercent(marginPct)} detail={formatUsd(money.margin)} />
        <KpiCard label="Fleet utilization" value={formatPercent(utilizationPct())} detail={`${counts.rented} rented of ${counts.total - counts.sold} active`} />
        <KpiCard label="Open pipeline" value={formatUsd(pipelineValue(demo.quotes))} detail="Draft, sent and negotiation quotes" />
      </section>
      <section>
        <h2 className="mb-3 text-sm font-semibold">Five readings of the same book</h2>
        <div className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 xl:grid-cols-5">
          {MODULES.map((module) => (
            <Link key={module.to} to={module.to} className={`border border-t-2 px-4 py-3 transition-colors hover:brightness-95 ${module.accent}`}>
              <p className="text-sm font-semibold">{module.title}</p>
              <p className="mt-1 text-xs text-pretty text-muted-foreground">{module.text}</p>
            </Link>
          ))}
        </div>
      </section>
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Total containers" value={String(counts.total)} detail={`Includes ${counts.sold} sold`} />
        <KpiCard label="Available" value={String(counts.available)} detail={`${underutilized().length} idle 45 days or more`} />
        <KpiCard label="Rented" value={String(counts.rented)} detail="Matches active contracts" />
        <KpiCard label="In transit" value={String(counts.in_transit)} detail="Sample lanes" />
        <KpiCard label="Maintenance" value={String(counts.maintenance)} detail="Workshop and predictions" />
      </section>
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.7fr)]">
        <Panel title={`Revenue · ${period.label}`}>
          <RevenueChart points={revenueSeries(demo.periodId)} />
          <p className="mt-3 text-xs text-muted-foreground">
            Rental {formatUsd(money.rentalRevenue)} · Sales {formatUsd(money.salesRevenue)}
          </p>
        </Panel>
        <Panel title="Commercial performance" action={<Link className="text-xs underline-offset-4 hover:underline" to="/commercial">Open</Link>}>
          <HorizontalBars
            rows={leaders.map((row) => ({
              label: row.customer.name,
              value: row.margin,
              display: formatUsd(row.margin),
            }))}
          />
        </Panel>
      </div>
      <Panel title="Fleet distribution" action={<Link className="text-xs underline-offset-4 hover:underline" to="/fleet/map">Open map</Link>}>
        <MapCanvas />
        <p className="mt-3 text-xs text-muted-foreground">Schematic of sample positions. It does not call a map service.</p>
      </Panel>
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Recent operational alerts" action={<Link className="text-xs underline-offset-4 hover:underline" to="/operations">Open</Link>}>
          <ul className="divide-y">
            {alerts.slice(0, 4).map((alert) => (
              <li key={alert.id} className="py-2">
                <Link className="text-sm font-medium hover:underline" to={`/operations/alerts/${alert.id}`}>
                  {alert.title}
                </Link>
                <p className="text-xs text-muted-foreground">{alert.severity} · {formatDay(alert.at)}</p>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Insight preview" action={<Link className="text-xs underline-offset-4 hover:underline" to="/assistant">Ask the assistant</Link>}>
          <p className="text-sm">
            {insight
              ? `${insight.customer.name} is the largest sample margin in ${period.label}, at ${formatUsd(insight.margin)}.`
              : "No booked margin in this period."}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {highAlerts().length} high-severity sample alerts are open. The assistant uses this same book and does not call a model.
          </p>
        </Panel>
      </div>
      <p className="text-xs text-muted-foreground">{SAMPLE_NOTE}</p>
    </div>
  )
}
