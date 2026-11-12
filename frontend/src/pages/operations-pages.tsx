import { useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { actionClass, fieldClass, MapCanvas, Panel, SectionHeading } from "@/components/demo-visuals"
import { alerts, locations, unitById, units } from "@/demo/dataset"
import { useDemo, type FieldKind } from "@/demo/demo-context"
import { formatDay } from "@/demo/format"
import { locationName } from "@/demo/metrics"

export function OperationsPage() {
  const [depotId, setDepotId] = useState(locations[0]?.id ?? "rotterdam")
  const [code, setCode] = useState("")
  const [miss, setMiss] = useState("")
  const navigate = useNavigate()
  const depotUnits = units.filter((unit) => unit.locationId === depotId)
  const tasks = alerts.filter((alert) => unitById(alert.containerId)?.locationId === depotId)
  const tracked = units.filter((unit) => unit.sensors)

  function openUnit(number: string) {
    const found = units.find((unit) => unit.number.toLowerCase() === number.trim().toLowerCase())
    if (!found) {
      setMiss("No sample container uses that number.")
      return
    }
    setMiss("")
    navigate(`/operations/units/${found.id}`)
  }

  const events = units
    .flatMap((unit) => unit.timeline.map((event) => ({ ...event, unitId: unit.id, number: unit.number })))
    .sort((left, right) => right.at.localeCompare(left.at))
    .slice(0, 8)

  function simulateScan() {
    const typed = code.trim()
    if (typed) {
      openUnit(typed)
      return
    }
    const sample = depotUnits[0]
    if (!sample) {
      setMiss("This depot has no sample unit to scan.")
      return
    }
    setCode(sample.number)
    setMiss("")
    navigate(`/operations/units/${sample.id}`)
  }

  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <SectionHeading
        eyebrow="Simulated yard workflow"
        title="Connected operations"
        description="A mobile view of work already represented in the sample book. Scanning and saving stay in this browser session. Nothing is sent to a company system."
      />
      <Panel title="This depot">
        <label className="grid gap-1 text-sm">Depot
          <select aria-label="Depot" className={fieldClass} value={depotId} onChange={(event) => setDepotId(event.target.value)}>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>{location.name}</option>
            ))}
          </select>
        </label>
        <p className="mt-3 text-sm">Sample yard lead · {locationName(depotId)} · {depotUnits.length} units positioned here</p>
      </Panel>
      <Panel title="Find a container">
        <label className="grid gap-1 text-sm">Container number
          <input aria-label="Scan or search container number" className={fieldClass} value={code} onChange={(event) => setCode(event.target.value)} placeholder="HCIU…" />
        </label>
        {miss ? <p role="alert" className="mt-2 text-sm">{miss}</p> : null}
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <button type="button" className={`${actionClass} bg-primary text-primary-foreground`} onClick={() => openUnit(code)}>Search</button>
          <button type="button" className={`${actionClass} border`} onClick={simulateScan}>Simulate scan</button>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Simulate scan uses the number you typed, or the first sample unit at this depot when the field is empty. There is no camera and no external register.</p>
      </Panel>
      <Panel title="Relevant at this depot">
        {tasks.length === 0 ? <p className="text-sm text-muted-foreground">No sample alert is positioned at this depot.</p> : null}
        <ul className="divide-y">
          {tasks.map((alert) => (
            <li key={alert.id} className="py-3">
              <Link className="text-sm font-medium hover:underline" to={`/operations/alerts/${alert.id}`}>{alert.title}</Link>
              <p className="text-xs text-muted-foreground">{alert.severity}</p>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Simulated positions">
        <p className="mb-3 text-xs text-muted-foreground">Schematic sample positions. Not a live tracker and not GPS.</p>
        <MapCanvas />
      </Panel>
      <Panel title="Alerts">
        <ul className="divide-y">
          {alerts.map((alert) => (
            <li key={alert.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <Link className="text-sm font-medium hover:underline" to={`/operations/alerts/${alert.id}`}>{alert.title}</Link>
              <span className="text-xs uppercase text-muted-foreground">{alert.severity}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <details className="border bg-card px-4 py-3">
        <summary className="cursor-pointer text-sm font-medium">Sample telemetry</summary>
        <div className="mt-4 space-y-4">
      <Panel title="Last reported sensors">
        <div className="min-w-0">
          <table className="data-cards w-full text-sm">
            <thead className="border-b text-left text-xs text-muted-foreground uppercase">
              <tr>
                <th className="py-2 pr-3">Unit</th>
                <th className="py-2 pr-3">Position</th>
                <th className="py-2 pr-3">Status</th>
                <th className="py-2 pr-3">Temperature</th>
                <th className="py-2 pr-3">Battery</th>
                <th className="py-2">Reported</th>
              </tr>
            </thead>
            <tbody>
              {tracked.slice(0, 12).map((unit) => (
                <tr key={unit.id} className="border-b last:border-b-0">
                  <td className="py-2 pr-3" data-label="Unit"><Link className="hover:underline" to={`/fleet/units/${unit.id}`}>{unit.number}</Link></td>
                  <td className="py-2 pr-3" data-label="Position">{locationName(unit.locationId)}</td>
                  <td className="py-2 pr-3" data-label="Status">{unit.status.replace("_", " ")}</td>
                  <td className="py-2 pr-3" data-label="Temperature">{unit.sensors?.temperatureC === null || unit.sensors?.temperatureC === undefined ? "n/a" : `${unit.sensors.temperatureC}°C`}</td>
                  <td className="py-2 pr-3" data-label="Battery">{unit.sensors?.batteryPct}%</td>
                  <td className="py-2" data-label="Reported">{unit.sensors ? formatDay(unit.sensors.reportedAt) : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
      <Panel title="Recent sample events">
        <ol className="space-y-2 text-sm">
          {events.map((event) => (
            <li key={`${event.unitId}-${event.at}-${event.label}`} className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-3">
              <span><Link className="hover:underline" to={`/fleet/units/${event.unitId}`}>{event.number}</Link> · {event.label}</span>
              <span className="text-muted-foreground">{formatDay(event.at)}</span>
            </li>
          ))}
        </ol>
      </Panel>
        </div>
      </details>
    </div>
  )
}

export function FieldUnitPage() {
  const { unitId = "" } = useParams()
  const demo = useDemo()
  const [note, setNote] = useState("")
  const unit = unitById(unitId)
  if (!unit) {
    return <div className="px-4 py-6 md:px-6"><SectionHeading title="Unit not found" description="That sample container is not in the demonstration fleet." /></div>
  }
  const entries = demo.fieldEntries.filter((entry) => entry.unitId === unit.id)

  function save(kind: FieldKind, text: string) {
    demo.addFieldEntry({ unitId: unit.id, kind, note: text })
    toast("Saved in this demo session. Nothing was sent to a company system.")
  }

  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <SectionHeading eyebrow="Simulated yard card" title={unit.number} description={`${unit.unitType} · ${locationName(unit.locationId)}. This card reads the synthetic book. Actions stay in the browser.`} />
      <p className="text-sm capitalize">{unit.status.replace("_", " ")} · {unit.condition}</p>
      <Panel title="Timeline">
        <ol className="space-y-2 text-sm">
          {unit.timeline.map((event) => (
            <li key={`${event.at}-${event.label}`} className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <span>{event.label}</span>
              <span className="text-muted-foreground">{formatDay(event.at)}</span>
            </li>
          ))}
        </ol>
      </Panel>
      <Panel title="Demo actions">
        <div className="flex flex-col gap-2">
          <button type="button" className={`${actionClass} bg-primary text-primary-foreground`} onClick={() => save("movement", "Movement confirmed in the demo session.")}>Confirm movement</button>
          <button type="button" className={`${actionClass} border`} onClick={() => save("check", "Visual check recorded in the demo session.")}>Visual check</button>
          <button type="button" className={`${actionClass} border`} onClick={() => save("photo", "Sample photo attached. No camera or file was used.")}>Attach sample photo</button>
        </div>
        <label className="mt-4 grid gap-1 text-sm">Damage note
          <input aria-label="Damage note" className={fieldClass} value={note} onChange={(event) => setNote(event.target.value)} />
        </label>
        <button
          type="button"
          className={`${actionClass} mt-3 border`}
          onClick={() => {
            const text = note.trim()
            if (!text) {
              toast("Add a damage note before saving.")
              return
            }
            save("damage", text)
            setNote("")
          }}
        >
          Report damage
        </button>
        <p className="mt-3 text-xs text-muted-foreground">These actions are not written to the live registry or to any external system.</p>
      </Panel>
      <Panel title="Session log">
        {entries.length === 0 ? <p className="text-sm text-muted-foreground">No demo action has been saved for this unit.</p> : null}
        <ul className="divide-y text-sm">
          {entries.map((entry) => (
            <li key={entry.id} className="py-2">
              <span className="font-medium capitalize">{entry.kind}</span>
              <p className="text-muted-foreground">{entry.note}</p>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

export function AlertPage() {
  const { alertId = "" } = useParams()
  const demo = useDemo()
  const alert = alerts.find((item) => item.id === alertId)
  if (!alert) {
    return <div className="px-4 py-6 md:px-6"><SectionHeading title="Alert not found" description="That sample alert is not in the demonstration." /></div>
  }
  const unit = unitById(alert.containerId)
  const seen = demo.seenAlertIds.includes(alert.id)
  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <SectionHeading eyebrow={`${alert.severity} · simulated`} title={alert.title} description={alert.summary} />
      <p className="text-sm">{alert.action}</p>
      <p className="text-sm text-muted-foreground">Reported {formatDay(alert.at)}{unit ? ` · ${locationName(unit.locationId)}` : ""}</p>
      {unit ? <Link className="text-sm underline-offset-4 hover:underline" to={`/fleet/units/${unit.id}`}>Open {unit.number}</Link> : null}
      <div>
        <button
          type="button"
          className={`${actionClass} border disabled:opacity-50`}
          disabled={seen}
          onClick={() => demo.markAlertSeen(alert.id)}
        >
          {seen ? "Marked reviewed" : "Mark reviewed"}
        </button>
      </div>
    </div>
  )
}
