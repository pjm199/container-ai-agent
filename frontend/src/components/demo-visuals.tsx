import { useEffect, useState, type ReactNode } from "react"
import { Link } from "react-router-dom"
import { formatMonth, formatPercent, formatUsd } from "@/demo/format"
import { locationStats } from "@/demo/metrics"
import { units } from "@/demo/dataset"
import { cn } from "@/lib/utils"

export const fieldClass =
  "mt-1 min-h-11 w-full rounded-md border border-input bg-card px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:min-h-9 md:text-sm"

export const actionClass =
  "inline-flex min-h-11 items-center justify-center px-4 text-base md:min-h-9 md:px-3 md:text-sm"

export function SectionHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:flex-wrap sm:items-end">
      <div className="min-w-0">
        {eyebrow ? <p className="text-[11px] font-medium tracking-[0.12em] text-muted-foreground uppercase sm:tracking-[0.16em]">{eyebrow}</p> : null}
        <h1 className="mt-1 text-xl font-semibold tracking-tight text-balance sm:text-2xl">{title}</h1>
        {description ? <p className="mt-1 max-w-2xl text-sm text-pretty text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">{actions}</div> : null}
    </div>
  )
}

export function KpiCard({ label, value, detail, to }: { label: string; value: string; detail: string; to?: string }) {
  const card = (
    <article className="min-w-0 border border-teal-100 border-t-2 border-t-teal-600 bg-gradient-to-b from-teal-50 to-card px-3 py-3 sm:px-4" aria-label={label}>
      <p className="text-[11px] leading-snug font-medium tracking-[0.08em] text-muted-foreground uppercase sm:tracking-[0.14em]">{label}</p>
      <p className="mt-2 text-xl leading-tight font-semibold tracking-tight break-words tabular-nums sm:text-2xl">{value}</p>
      <p className="mt-1 text-xs text-pretty text-muted-foreground">{detail}</p>
    </article>
  )
  if (!to) {
    return card
  }
  return (
    <Link to={to} className="block min-h-11 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2">
      {card}
    </Link>
  )
}

export function RevenueChart({ points }: { points: Array<{ month: string; revenue: number; margin: number }> }) {
  const width = 640
  const height = 180
  const max = Math.max(...points.map((point) => point.revenue), 1)
  const step = points.length > 1 ? width / (points.length - 1) : width
  const coordinates = points.map((point, index) => {
    const x = index * step
    const y = height - 16 - (point.revenue / max) * (height - 28)
    return { ...point, x, y }
  })
  const line = coordinates.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ")
  const first = coordinates[0]
  const last = coordinates.at(-1)
  const area = first && last ? `${line} L ${last.x.toFixed(1)} ${height} L ${first.x.toFixed(1)} ${height} Z` : ""
  const summary = points.map((point) => `${formatMonth(point.month)} ${formatUsd(point.revenue)}`).join(", ")
  const [activeMonth, setActiveMonth] = useState(points.at(-1)?.month ?? "")
  const active = coordinates.find((point) => point.month === activeMonth) ?? coordinates.at(-1)

  return (
    <figure className="min-w-0">
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Revenue ${summary}`} className="h-40 w-full text-teal-700 sm:h-44">
        {area ? <path d={area} fill="currentColor" opacity="0.16" /> : null}
        <path d={line} fill="none" stroke="currentColor" strokeWidth="2.5" />
        {coordinates.map((point) => {
          const selected = point.month === active?.month
          const label = `${formatMonth(point.month)} revenue ${formatUsd(point.revenue)}, margin ${formatUsd(point.margin)}`
          return (
            <g key={point.month}>
              <circle
                cx={point.x}
                cy={point.y}
                r="16"
                fill="transparent"
                className="cursor-pointer"
                role="button"
                tabIndex={0}
                aria-label={label}
                aria-pressed={selected}
                onClick={() => setActiveMonth(point.month)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setActiveMonth(point.month)
                  }
                }}
              />
              <circle cx={point.x} cy={point.y} r={selected ? 5 : 3} fill={selected ? "#b45309" : "currentColor"} pointerEvents="none" />
            </g>
          )
        })}
      </svg>
      {active ? (
        <p className="mt-2 text-sm">
          <span className="font-medium">{formatMonth(active.month)}</span>
          <span className="text-muted-foreground"> · {formatUsd(active.revenue)} revenue · {formatUsd(active.margin)} margin</span>
        </p>
      ) : null}
      <figcaption className="mt-2 grid grid-cols-3 gap-x-2 gap-y-1 text-[11px] text-muted-foreground sm:grid-cols-4 lg:grid-cols-6">
        {points.map((point) => (
          <button
            key={point.month}
            type="button"
            className={cn("min-h-11 text-left md:min-h-8", point.month === active?.month && "font-medium text-foreground")}
            onClick={() => setActiveMonth(point.month)}
          >
            {formatMonth(point.month)}
          </button>
        ))}
      </figcaption>
    </figure>
  )
}

export function HorizontalBars({ rows }: { rows: Array<{ label: string; value: number; display: string }> }) {
  const max = Math.max(...rows.map((row) => row.value), 1)
  return (
    <ul className="space-y-3">
      {rows.map((row, index) => (
        <li key={row.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="min-w-0">{row.label}</span>
            <span className="shrink-0 tabular-nums text-muted-foreground">{row.display}</span>
          </div>
          <div className="h-2 rounded-full bg-teal-50">
            <div
              className={cn("h-full rounded-full", ["bg-teal-600", "bg-amber-500", "bg-indigo-500", "bg-orange-500", "bg-sky-600"][index % 5])}
              style={{ width: `${Math.max(4, (row.value / max) * 100)}%` }}
            />
          </div>
        </li>
      ))}
    </ul>
  )
}

export function MapCanvas({ activeId, onSelect }: { activeId?: string; onSelect?: (locationId: string) => void }) {
  const [open, setOpen] = useState(false)
  const [localId, setLocalId] = useState<string | undefined>(activeId)
  const selectedId = activeId ?? localId

  function choose(locationId: string) {
    setLocalId(locationId)
    onSelect?.(locationId)
  }

  useEffect(() => {
    if (!open) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    window.addEventListener("keydown", onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener("keydown", onKey)
    }
  }, [open])

  return (
    <div className="min-w-0">
      <div className="mb-2 flex justify-end">
        <button type="button" className={cn(actionClass, "border bg-card")} onClick={() => setOpen(true)}>
          Full screen
        </button>
      </div>
      <FleetMap activeId={selectedId} onSelect={choose} />
      <PortList activeId={selectedId} onSelect={choose} className="md:hidden" />
      {open ? (
        <div className="fixed inset-0 z-50 flex flex-col bg-background" role="dialog" aria-modal="true" aria-label="Fleet map">
          <div className="flex items-center justify-between gap-3 border-b px-3 pt-[env(safe-area-inset-top)]">
            <p className="text-sm font-semibold">Fleet distribution</p>
            <button type="button" className={cn(actionClass, "px-3")} onClick={() => setOpen(false)} autoFocus>
              Close
            </button>
          </div>
          <div className="min-h-0 flex-1">
            <FleetMap activeId={selectedId} onSelect={choose} expanded />
          </div>
          <div className="max-h-[42dvh] overflow-y-auto border-t pb-[env(safe-area-inset-bottom)]">
            <PortList activeId={selectedId} onSelect={choose} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function PortList({
  activeId,
  onSelect,
  className,
}: {
  activeId?: string
  onSelect?: (locationId: string) => void
  className?: string
}) {
  const stats = locationStats()
  return (
    <ul className={cn("grid grid-cols-1 gap-2 pt-3 min-[400px]:grid-cols-2", className)}>
      {stats.map((row) => {
        const active = row.location.id === activeId
        return (
          <li key={row.location.id}>
            <button
              type="button"
              aria-pressed={active}
              className={cn(
                "flex min-h-11 w-full items-center justify-between gap-3 border px-3 py-2 text-left text-sm",
                active ? "border-primary bg-muted" : "bg-card",
              )}
              onClick={() => onSelect?.(row.location.id)}
            >
              <span className="min-w-0">
                <span className="block font-medium">{row.location.name}</span>
                <span className="block text-xs text-muted-foreground">{row.location.region}</span>
              </span>
              <span className="shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                {row.total} · {formatPercent(row.utilization)}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export function FleetMap({
  activeId,
  onSelect,
  expanded = false,
}: {
  activeId?: string
  onSelect?: (locationId: string) => void
  expanded?: boolean
}) {
  const stats = locationStats()
  const lanes = units
    .filter((unit) => unit.status === "in_transit" && unit.destinationId)
    .map((unit) => {
      const from = stats.find((row) => row.location.id === unit.locationId)?.location
      const to = stats.find((row) => row.location.id === unit.destinationId)?.location
      return from && to ? { key: `${unit.id}`, from, to } : null
    })
    .filter((lane) => lane !== null)

  return (
    <svg
      viewBox="0 0 960 420"
      role="img"
      aria-label="Schematic fleet distribution across Europe, Asia and North America"
      preserveAspectRatio="xMidYMid meet"
      className={cn("fleet-map w-full bg-[#f3fbf8]", expanded ? "h-full" : "h-auto")}
    >
      <text x="32" y="36" className="map-region-label fill-teal-800" fontSize="12">
        Europe
      </text>
      <text x="520" y="36" className="map-region-label fill-amber-800" fontSize="12">
        Asia
      </text>
      <text x="790" y="36" className="map-region-label fill-indigo-800" fontSize="12">
        North America
      </text>
      <ellipse cx="190" cy="190" rx="120" ry="90" fill="#c7ebe3" />
      <ellipse cx="620" cy="200" rx="150" ry="110" fill="#f6e4c4" />
      <ellipse cx="860" cy="210" rx="80" ry="100" fill="#d9e2f8" />
      {lanes.map((lane) => (
        <line
          key={lane.key}
          x1={lane.from.x}
          y1={lane.from.y}
          x2={lane.to.x}
          y2={lane.to.y}
          stroke="#0f766e"
          strokeDasharray="4 4"
        />
      ))}
      {stats.map((row) => {
        const active = row.location.id === activeId
        const content = (
          <>
            <circle cx={row.location.x} cy={row.location.y} r={expanded ? 48 : 28} fill="transparent" />
            <circle cx={row.location.x} cy={row.location.y} r={active ? 8 : 6} fill={active ? "#b45309" : "#0f766e"} />
            <text x={row.location.x + 10} y={row.location.y - 10} fontSize="11" className="map-port-label fill-slate-800">
              {row.location.name}
            </text>
            <text x={row.location.x + 10} y={row.location.y + 4} fontSize="10" className="map-port-label fill-slate-500">
              {row.total} units
            </text>
          </>
        )
        if (!onSelect) {
          return <g key={row.location.id}>{content}</g>
        }
        return (
          <g key={row.location.id} role="button" tabIndex={0} className="cursor-pointer" onClick={() => onSelect(row.location.id)}>
            {content}
          </g>
        )
      })}
    </svg>
  )
}

export function Panel({ title, action, children, className }: { title: string; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={cn("border border-teal-100 bg-card", className)}>
      <header className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <h2 className="min-w-0 text-sm font-semibold tracking-tight">{title}</h2>
        {action}
      </header>
      <div className="px-4 py-4">{children}</div>
    </section>
  )
}
