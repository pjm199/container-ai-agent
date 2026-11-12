import { useMemo, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { StatusBadge } from "@/components/status-badge"
import { actionClass, fieldClass, KpiCard, MapCanvas, Panel, SectionHeading } from "@/components/demo-visuals"
import { contractById, locationById, locations, unitById, units } from "@/demo/dataset"
import { formatDay, formatPercent } from "@/demo/format"
import { behindPlanUnits, customerName, fleetCounts, locationName, locationStats, underutilized, utilizationPct } from "@/demo/metrics"
import { CONTAINER_STATUSES, STATUS_LABELS } from "@/lib/containers"
import type { Region, UnitType } from "@/demo/types"

const TYPES: UnitType[] = ["20DC", "40HC", "40RF", "20TK"]
const REGIONS: Region[] = ["Europe", "Asia", "North America"]
const PAGE_SIZE = 10

export function FleetPage() {
  const counts = fleetCounts()
  const yards = [...locationStats()].sort((left, right) => right.total - left.total).slice(0, 4)
  const maintenance = units.filter((unit) => unit.status === "maintenance").slice(0, 4)
  return (
    <div className="space-y-6 px-4 py-6 md:px-6">
      <SectionHeading
        eyebrow="Fleet intelligence"
        title="Fleet intelligence"
        description="Snapshot of the synthetic fleet. Counts match the overview. Positions on the map are simulated."
        actions={
          <>
            <Link className={`${actionClass} border bg-card`} to="/fleet/inventory">Inventory</Link>
            <Link className={`${actionClass} border bg-card`} to="/fleet/map">Map</Link>
            <Link className={`${actionClass} border bg-card`} to="/fleet/maintenance">Maintenance</Link>
          </>
        }
      />
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <KpiCard label="Total containers" value={String(counts.total)} detail={`Includes ${counts.sold} sold`} to="/fleet/inventory" />
        <KpiCard label="Available" value={String(counts.available)} detail={`${underutilized().length} idle 45+ days`} to="/fleet/inventory?status=available" />
        <KpiCard label="Rented" value={String(counts.rented)} detail="Assigned to contracts" to="/fleet/inventory?status=rented" />
        <KpiCard label="In transit" value={String(counts.in_transit)} detail="Moving between sample ports" to="/fleet/inventory?status=in_transit" />
        <KpiCard label="Maintenance" value={String(counts.maintenance)} detail="Includes predicted work" to="/fleet/inventory?status=maintenance" />
      </section>
      <Panel title="Exceptions in the sample">
        <ul className="divide-y text-sm">
          {behindPlanUnits().map((unit) => (
            <li key={unit.id} className="py-2">
              <Link className="font-medium hover:underline" to={`/fleet/units/${unit.id}`}>{unit.number}</Link>
              <p className="text-xs text-muted-foreground">Marked behind the sample lane plan. Arrival dates in the book are still on or after 12 Nov 2026.</p>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title={`Utilization ${formatPercent(utilizationPct())}`}>
        <div className="grid gap-4 md:grid-cols-2">
          <ul className="space-y-2 text-sm">
            {yards.map((yard) => (
              <li key={yard.location.id} className="flex justify-between gap-3">
                <Link className="hover:underline" to={`/fleet/inventory?location=${yard.location.id}`}>{yard.location.name}</Link>
                <span className="tabular-nums text-muted-foreground">{yard.total} · {formatPercent(yard.utilization)}</span>
              </li>
            ))}
          </ul>
          <ul className="space-y-2 text-sm">
            {maintenance.map((unit) => (
              <li key={unit.id}>
                <Link className="font-medium hover:underline" to={`/fleet/units/${unit.id}`}>{unit.number}</Link>
                <p className="text-xs text-muted-foreground">{unit.prediction}</p>
              </li>
            ))}
          </ul>
        </div>
      </Panel>
    </div>
  )
}

export function FleetInventoryPage() {
  const [params, setParams] = useSearchParams()
  const [page, setPage] = useState(0)
  const [sort, setSort] = useState<"number" | "idle">("number")
  const query = params.get("q") ?? ""
  const status = params.get("status") ?? "all"
  const unitType = params.get("type") ?? "all"
  const location = params.get("location") ?? "all"
  const region = params.get("region") ?? "all"
  const visible = useMemo(() => {
    const filtered = units.filter((unit) => {
      const matchesQuery = unit.number.toLowerCase().includes(query.trim().toLowerCase())
      const matchesStatus = status === "all" || unit.status === status
      const matchesType = unitType === "all" || unit.unitType === unitType
      const matchesLocation = location === "all" || unit.locationId === location
      const matchesRegion = region === "all" || locationById[unit.locationId]?.region === region
      return matchesQuery && matchesStatus && matchesType && matchesLocation && matchesRegion
    })
    return [...filtered].sort((left, right) => (sort === "idle" ? right.idleDays - left.idleDays : left.number.localeCompare(right.number)))
  }, [location, query, region, sort, status, unitType])
  const pages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const current = Math.min(page, pages - 1)
  const slice = visible.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE)

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value === "" || value === "all") {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setParams(next)
    setPage(0)
  }

  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <SectionHeading eyebrow="Fleet" title="Inventory" description="Search, filter and sort the sample fleet." />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <label className="grid gap-1 text-sm">
          Number
          <input aria-label="Search by container number" className={fieldClass} value={query} onChange={(event) => update("q", event.target.value)} />
        </label>
        <label className="grid gap-1 text-sm">
          Status
          <select aria-label="Status" className={fieldClass} value={status} onChange={(event) => update("status", event.target.value)}>
            <option value="all">All statuses</option>
            {CONTAINER_STATUSES.map((item) => (
              <option key={item} value={item}>{STATUS_LABELS[item]}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Type
          <select aria-label="Type" className={fieldClass} value={unitType} onChange={(event) => update("type", event.target.value)}>
            <option value="all">All types</option>
            {TYPES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Area
          <select aria-label="Area" className={fieldClass} value={region} onChange={(event) => update("region", event.target.value)}>
            <option value="all">All areas</option>
            {REGIONS.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          Location
          <select aria-label="Location" className={fieldClass} value={location} onChange={(event) => update("location", event.target.value)}>
            <option value="all">All locations</option>
            {locations.map((item) => (
              <option key={item.id} value={item.id}>{item.name}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">{visible.length === 1 ? "1 unit" : `${visible.length} units`}</p>
        <button type="button" className="min-h-11 underline-offset-4 hover:underline" onClick={() => setSort(sort === "number" ? "idle" : "number")}>
          Sort by {sort === "number" ? "number" : "idle days"}
        </button>
      </div>
      {visible.length === 0 ? <p className="border bg-card px-4 py-8 text-sm text-muted-foreground">No sample units match these filters.</p> : null}
      {visible.length > 0 ? (
        <div className="md:overflow-x-auto md:border md:bg-card">
          <table className="data-cards w-full text-sm">
            <thead className="border-b text-left text-xs tracking-wide text-muted-foreground uppercase">
              <tr>
                <th className="px-3 py-2">Number</th>
                <th className="px-3 py-2">Type</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Location</th>
                <th className="px-3 py-2">Condition</th>
                <th className="px-3 py-2">Idle</th>
              </tr>
            </thead>
            <tbody>
              {slice.map((unit) => (
                <tr key={unit.id} className="border-b last:border-b-0">
                  <td className="px-3 py-2" data-label="Number">
                    <Link className="font-medium hover:underline" to={`/fleet/units/${unit.id}`}>{unit.number}</Link>
                  </td>
                  <td className="px-3 py-2" data-label="Type">{unit.unitType}</td>
                  <td className="px-3 py-2" data-label="Status"><StatusBadge status={unit.status} /></td>
                  <td className="px-3 py-2" data-label="Location">{locationName(unit.locationId)}</td>
                  <td className="px-3 py-2 capitalize" data-label="Condition">{unit.condition}</td>
                  <td className="px-3 py-2 tabular-nums" data-label="Idle">{unit.idleDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      <div className="grid grid-cols-3 items-center gap-2 text-sm">
        <button type="button" className="min-h-11 border px-3 disabled:opacity-40" disabled={current === 0} onClick={() => setPage(current - 1)}>Previous</button>
        <span className="text-center text-muted-foreground">Page {current + 1} of {pages}</span>
        <button type="button" className="min-h-11 border px-3 disabled:opacity-40" disabled={current + 1 >= pages} onClick={() => setPage(current + 1)}>Next</button>
      </div>
    </div>
  )
}

export function FleetMapPage() {
  const [active, setActive] = useState<string | undefined>(undefined)
  const selected = locationStats().find((row) => row.location.id === active)
  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <SectionHeading eyebrow="Fleet" title="Distribution" description="Schematic sample positions. Selecting a port opens that yard in the inventory." />
      <Panel title="Operating regions">
        <MapCanvas activeId={active} onSelect={setActive} />
        <div className="mt-4 hidden flex-wrap gap-2 md:flex">
          {locations.map((location) => (
            <button key={location.id} type="button" className="min-h-11 border px-3 py-1 text-sm hover:bg-muted" onClick={() => setActive(location.id)}>
              {location.name}
            </button>
          ))}
        </div>
        {selected ? (
          <p className="mt-4 text-sm">
            {selected.location.name}: {selected.total} units, utilization {formatPercent(selected.utilization)}.{" "}
            <Link className="underline-offset-4 hover:underline" to={`/fleet/inventory?location=${selected.location.id}`}>View inventory</Link>
          </p>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">Select a port to see its sample count.</p>
        )}
      </Panel>
    </div>
  )
}

export function FleetMaintenancePage() {
  const rows = units.filter((unit) => unit.status === "maintenance")
  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <SectionHeading eyebrow="Fleet" title="Maintenance" description="Sample workshop queue and prediction text. These are not live sensor diagnoses." />
      <ul className="divide-y border bg-card">
        {rows.map((unit) => (
          <li key={unit.id} className="flex flex-wrap items-start justify-between gap-3 px-4 py-3">
            <div>
              <Link className="font-medium hover:underline" to={`/fleet/units/${unit.id}`}>{unit.number}</Link>
              <p className="text-sm text-muted-foreground">{unit.prediction}</p>
            </div>
            <p className="text-sm text-muted-foreground">{locationName(unit.locationId)} · {unit.condition}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function FleetUnitPage() {
  const { unitId = "" } = useParams()
  const unit = unitById(unitId)
  if (!unit) {
    return <div className="px-4 py-6 md:px-6"><SectionHeading title="Unit not found" description="That sample container is not in the demonstration fleet." /></div>
  }
  const contract = unit.contractId ? contractById[unit.contractId] : undefined
  const location = locationById[unit.locationId]
  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <SectionHeading eyebrow="Sample container" title={unit.number} description={`${unit.unitType} · ${location?.name ?? unit.locationId}, ${location?.country ?? ""}`} />
      <div className="flex flex-wrap gap-2">
        <StatusBadge status={unit.status} />
        <span className="border px-2 py-1 text-xs capitalize">{unit.condition}</span>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Panel title="Assignment">
          <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
            <dt className="text-muted-foreground">Customer</dt>
            <dd>{unit.customerId ? <Link className="hover:underline" to={`/commercial/customers/${unit.customerId}`}>{customerName(unit.customerId)}</Link> : "Unassigned"}</dd>
            <dt className="text-muted-foreground">Contract</dt>
            <dd>{contract ? <Link className="hover:underline" to={`/commercial/contracts/${contract.id}`}>{contract.id}</Link> : "None"}</dd>
            <dt className="text-muted-foreground">Idle days</dt>
            <dd className="tabular-nums">{unit.idleDays}</dd>
            <dt className="text-muted-foreground">Destination</dt>
            <dd>{unit.destinationId ? `${locationName(unit.destinationId)}${unit.eta ? ` · ETA ${formatDay(unit.eta)}` : ""}` : "—"}</dd>
          </dl>
        </Panel>
        <Panel title="Simulated sensors">
          {unit.sensors ? (
            <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm">
              <dt className="text-muted-foreground">Reported</dt><dd>{formatDay(unit.sensors.reportedAt)}</dd>
              <dt className="text-muted-foreground">Temperature</dt><dd>{unit.sensors.temperatureC === null ? "n/a" : `${unit.sensors.temperatureC}°C`}</dd>
              <dt className="text-muted-foreground">Door</dt><dd className="capitalize">{unit.sensors.door}</dd>
              <dt className="text-muted-foreground">Shock</dt><dd>{unit.sensors.shockG} g</dd>
              <dt className="text-muted-foreground">Battery</dt><dd>{unit.sensors.batteryPct}%</dd>
            </dl>
          ) : (
            <p className="text-sm text-muted-foreground">This sample unit has no sensor package.</p>
          )}
          {unit.prediction ? <p className="mt-3 text-sm">{unit.prediction}</p> : null}
        </Panel>
      </div>
      <Panel title="Timeline">
        <ol className="space-y-2 text-sm">
          {unit.timeline.map((event) => (
            <li key={`${event.at}-${event.label}`} className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
              <span>{event.label}</span>
              <span className="text-muted-foreground">{formatDay(event.at)}</span>
            </li>
          ))}
        </ol>
      </Panel>
    </div>
  )
}
