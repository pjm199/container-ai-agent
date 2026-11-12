import { useState } from "react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom"
import { toast } from "sonner"
import { actionClass, fieldClass, HorizontalBars, KpiCard, Panel, SectionHeading } from "@/components/demo-visuals"
import {
  LIST_PRICES,
  contractById,
  contracts,
  customerById,
  customers,
  locationById,
  locations,
  sales,
  units,
} from "@/demo/dataset"
import { useDemo } from "@/demo/demo-context"
import { formatDay, formatUsd } from "@/demo/format"
import { comparisonFor, contractsEnding, customerResults, periodMoney, pipelineValue, quoteValue, typeResults } from "@/demo/metrics"
import type { QuoteStage, Region, UnitType } from "@/demo/types"

const STAGES: QuoteStage[] = ["draft", "sent", "negotiation", "won", "lost"]
const TYPES: UnitType[] = ["20DC", "40HC", "40RF", "20TK"]
const AREAS: Region[] = ["Europe", "Asia", "North America"]

export function CommercialPage() {
  const demo = useDemo()
  const [area, setArea] = useState<Region | "all">("all")
  const [unitType, setUnitType] = useState<UnitType | "all">("all")
  const money = periodMoney(demo.periodId)
  const change = comparisonFor(demo.periodId)
  const leaders = customerResults(demo.periodId).filter((row) => area === "all" || row.customer.region === area).slice(0, 5)
  const open = demo.quotes.filter((quote) => quote.stage === "draft" || quote.stage === "sent" || quote.stage === "negotiation")
  const ending = contractsEnding("2026-12")
  const types = typeResults(demo.periodId).filter((row) => unitType === "all" || row.unitType === unitType)
  const visibleContracts = contracts.filter((contract) => {
    const matchesArea = area === "all" || customerById[contract.customerId]?.region === area
    const matchesType = unitType === "all" || contract.unitType === unitType
    return matchesArea && matchesType
  })
  return (
    <div className="space-y-6 px-4 py-6 md:px-6">
      <SectionHeading
        eyebrow="Commercial intelligence"
        title="Commercial intelligence"
        description="Sample customers, contracts and quotes. Quote value is pipeline, not booked revenue. Figures use the same rental and sale rules as the executive view."
        actions={<Link className={`${actionClass} bg-primary text-primary-foreground`} to="/commercial/quotes/new">New quote</Link>}
      />
      <section className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 lg:grid-cols-3">
        <KpiCard label="Booked revenue" value={formatUsd(money.revenue)} detail="Rental plus equipment sales" />
        <KpiCard label="Booked margin" value={formatUsd(money.margin)} detail="Same period as the overview" />
        <KpiCard label="Open pipeline" value={formatUsd(pipelineValue(demo.quotes))} detail={`${open.length} open quotes`} />
      </section>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm">Area
          <select aria-label="Commercial area" className={fieldClass} value={area} onChange={(event) => {
            const next = AREAS.find((item) => item === event.target.value)
            setArea(next ?? "all")
          }}>
            <option value="all">All areas</option>
            {AREAS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
        <label className="grid gap-1 text-sm">Type
          <select aria-label="Commercial type" className={fieldClass} value={unitType} onChange={(event) => {
            const next = TYPES.find((item) => item === event.target.value)
            setUnitType(next ?? "all")
          }}>
            <option value="all">All types</option>
            {TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <Panel title="Change versus the previous window">
        {change ? (
          <p className="text-sm">Booked revenue {formatUsd(change.current.revenue)} against {formatUsd(change.previous.revenue)}. Change {formatUsd(change.revenueDelta)}. The earlier window is {change.earlier[0]}{change.earlier.length > 1 ? ` to ${change.earlier[change.earlier.length - 1]}` : ""}.</p>
        ) : (
          <p className="text-sm text-muted-foreground">Year to date has no earlier year in the sample, so a change figure is not shown.</p>
        )}
      </Panel>
      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Customer portfolio">
          <ul className="divide-y">
            {customers.filter((customer) => area === "all" || customer.region === area).map((customer) => {
              const result = leaders.find((row) => row.customer.id === customer.id)
              return (
                <li key={customer.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <Link className="text-sm font-medium hover:underline" to={`/commercial/customers/${customer.id}`}>{customer.name}</Link>
                    <p className="text-xs text-muted-foreground">{customer.segment} · {customer.region}</p>
                  </div>
                  <span className="text-sm tabular-nums text-muted-foreground">{result ? formatUsd(result.margin) : "No bookings"}</span>
                </li>
              )
            })}
          </ul>
        </Panel>
        <Panel title="Margin by customer">
          <HorizontalBars rows={leaders.map((row) => ({ label: row.customer.name, value: row.margin, display: formatUsd(row.margin) }))} />
        </Panel>
      </div>
      <Panel title="Margin by equipment type">
        <HorizontalBars rows={types.map((row) => ({ label: row.unitType, value: row.margin, display: formatUsd(row.margin) }))} />
        <p className="mt-3 text-xs text-muted-foreground">Margin is rental rate minus sample operating cost, plus equipment-sale price minus sample cost, for the selected period.</p>
      </Panel>
      <Panel title="Terms ending December 2026">
        <ul className="divide-y text-sm">
          {ending.map((contract) => (
            <li key={contract.id} className="py-2">
              <Link className="font-medium hover:underline" to={`/commercial/contracts/${contract.id}`}>{contract.id}</Link>
              <span className="text-muted-foreground"> · {customerById[contract.customerId]?.name}. The sample stores the end as a month, not a day.</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Pipeline">
        <QuoteTable />
      </Panel>
      <Panel title="Rental contracts">
        <ul className="divide-y">
          {visibleContracts.map((contract) => (
            <li key={contract.id} className="grid gap-1 py-3 text-sm sm:grid-cols-[6rem_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-3">
              <Link className="font-medium hover:underline" to={`/commercial/contracts/${contract.id}`}>{contract.id}</Link>
              <span>{customerById[contract.customerId]?.name}</span>
              <span className="text-muted-foreground">{contract.quantity} × {contract.unitType}</span>
              <span className="tabular-nums">{formatUsd(contract.quantity * contract.monthlyRate)} / month</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

export function CustomerPage() {
  const { customerId = "" } = useParams()
  const customer = customerById[customerId]
  const demo = useDemo()
  if (!customer) {
    return <div className="px-4 py-6 md:px-6"><SectionHeading title="Customer not found" description="That sample customer is not in the portfolio." /></div>
  }
  const result = customerResults(demo.periodId).find((row) => row.customer.id === customer.id)
  const book = contracts.filter((contract) => contract.customerId === customer.id)
  const history = sales.filter((sale) => sale.customerId === customer.id)
  const related = demo.quotes.filter((quote) => quote.customerId === customer.id)
  const fleet = units.filter((unit) => unit.customerId === customer.id).slice(0, 8)
  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <SectionHeading eyebrow={customer.segment} title={customer.name} description={`${customer.city} · ${customer.region} · contact ${customer.contact} · customer since ${formatDay(customer.since)}`} />
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <KpiCard label="Period revenue" value={formatUsd(result?.revenue ?? 0)} detail="Rental and sales in the selected period" />
        <KpiCard label="Period margin" value={formatUsd(result?.margin ?? 0)} detail="Reconciles with business intelligence" />
      </section>
      <Panel title="Contracts">
        {book.length === 0 ? <p className="text-sm text-muted-foreground">No rental contract. Prospect activity stays in quotes.</p> : null}
        <ul className="divide-y">
          {book.map((contract) => (
            <li key={contract.id} className="py-2 text-sm">
              <Link className="font-medium hover:underline" to={`/commercial/contracts/${contract.id}`}>{contract.id}</Link>
              <span className="text-muted-foreground"> · {contract.corridor}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Equipment sales">
        {history.length === 0 ? <p className="text-sm text-muted-foreground">No equipment sales in the sample.</p> : null}
        <ul className="divide-y text-sm">
          {history.map((sale) => (
            <li key={sale.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between">
              <span>{sale.id} · {sale.quantity} × {sale.unitType}</span>
              <span className="tabular-nums">{formatUsd(sale.quantity * sale.unitPrice)}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Quotes">
        <ul className="divide-y text-sm">
          {related.map((quote) => (
            <li key={quote.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
              <Link className="hover:underline" to={`/commercial/quotes/${quote.id}`}>{quote.id}</Link>
              <span className="capitalize text-muted-foreground">{quote.stage}</span>
            </li>
          ))}
        </ul>
      </Panel>
      <Panel title="Units on hire">
        <ul className="grid gap-2 sm:grid-cols-2 text-sm">
          {fleet.map((unit) => (
            <li key={unit.id}><Link className="hover:underline" to={`/fleet/units/${unit.id}`}>{unit.number}</Link></li>
          ))}
        </ul>
        {fleet.length === 0 ? <p className="text-sm text-muted-foreground">No units currently assigned.</p> : null}
      </Panel>
    </div>
  )
}

export function ContractPage() {
  const { contractId = "" } = useParams()
  const contract = contractById[contractId]
  if (!contract) {
    return <div className="px-4 py-6 md:px-6"><SectionHeading title="Contract not found" description="That sample contract is not in the book." /></div>
  }
  const monthly = contract.quantity * contract.monthlyRate
  const margin = contract.quantity * (contract.monthlyRate - contract.monthlyCost)
  const assigned = units.filter((unit) => unit.contractId === contract.id)
  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <SectionHeading eyebrow="Rental contract" title={contract.id} description={contract.corridor} />
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Monthly revenue" value={formatUsd(monthly)} detail={`${contract.quantity} × ${formatUsd(contract.monthlyRate)}`} />
        <KpiCard label="Monthly margin" value={formatUsd(margin)} detail="Rate minus sample operating cost" />
        <KpiCard label="Term" value={`${contract.start} – ${contract.end}`} detail={customerById[contract.customerId]?.name ?? ""} />
      </section>
      <Panel title={`Assigned units (${assigned.length})`}>
        <ul className="grid gap-2 sm:grid-cols-2 text-sm">
          {assigned.slice(0, 12).map((unit) => (
            <li key={unit.id}><Link className="hover:underline" to={`/fleet/units/${unit.id}`}>{unit.number}</Link> · {locationById[unit.locationId]?.name}</li>
          ))}
        </ul>
      </Panel>
    </div>
  )
}

export function QuotePage() {
  const { quoteId = "" } = useParams()
  const demo = useDemo()
  const quote = demo.quotes.find((item) => item.id === quoteId)
  if (!quote) {
    return <div className="px-4 py-6 md:px-6"><SectionHeading title="Quote not found" description="That sample quote is not in this session." /></div>
  }
  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <SectionHeading eyebrow="Sample quote" title={quote.id} description={quote.note} />
      <p className="text-sm text-muted-foreground">Stage: <span className="capitalize text-foreground">{quote.stage}</span>. This amount is not booked revenue.</p>
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <KpiCard label="Value" value={formatUsd(quoteValue(quote))} detail={`${quote.quantity} × ${formatUsd(quote.unitPrice)}`} />
        <KpiCard label="Customer" value={customerById[quote.customerId]?.name ?? quote.customerId} detail={locationById[quote.locationId]?.name ?? ""} />
        <KpiCard label="Created" value={formatDay(quote.created)} detail={quote.unitType} />
      </section>
    </div>
  )
}

export function QuoteWorkflowPage() {
  const demo = useDemo()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const initialType = TYPES.find((item) => item === params.get("type")) ?? "40HC"
  const [step, setStep] = useState(0)
  const [customerId, setCustomerId] = useState(params.get("customer") ?? "")
  const [locationId, setLocationId] = useState(params.get("location") ?? "")
  const [unitType, setUnitType] = useState<UnitType>(initialType)
  const [quantity, setQuantity] = useState(params.get("quantity") ?? "1")
  const [unitPrice, setUnitPrice] = useState(String(LIST_PRICES[initialType]))
  const [note, setNote] = useState("")
  const [error, setError] = useState("")
  const parsedQuantity = Number(quantity)
  const parsedPrice = Number(unitPrice)
  const value = Number.isFinite(parsedQuantity) && Number.isFinite(parsedPrice) ? parsedQuantity * parsedPrice : 0

  function validate() {
    if (!customerId || !locationId) {
      return "Choose a customer and a location."
    }
    if (!Number.isInteger(parsedQuantity) || parsedQuantity < 1) {
      return "Quantity must be a whole number of at least 1."
    }
    if (!Number.isFinite(parsedPrice) || parsedPrice <= 0) {
      return "Unit price must be greater than zero."
    }
    return ""
  }

  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <SectionHeading eyebrow={`Step ${step + 1} of 3`} title="New quote" description="Saved only in this browser session. It joins the pipeline and does not change booked revenue." />
      {error ? <p role="alert" className="border border-destructive/40 bg-destructive/5 px-3 py-2 text-sm">{error}</p> : null}
      {step === 0 ? (
        <div className="grid max-w-xl gap-3">
          <label className="text-sm">Customer
            <select className={fieldClass} value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
              <option value="">Select a customer</option>
              {customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}
            </select>
          </label>
          <label className="text-sm">Location
            <select className={fieldClass} value={locationId} onChange={(event) => setLocationId(event.target.value)}>
              <option value="">Select a location</option>
              {locations.map((location) => <option key={location.id} value={location.id}>{location.name}</option>)}
            </select>
          </label>
          <label className="text-sm">Type
            <select className={fieldClass} value={unitType} onChange={(event) => {
              const next = TYPES.find((item) => item === event.target.value) ?? "40HC"
              setUnitType(next)
              setUnitPrice(String(LIST_PRICES[next]))
            }}>
              {TYPES.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
          </label>
        </div>
      ) : null}
      {step === 1 ? (
        <div className="grid max-w-xl gap-3">
          <label className="text-sm">Quantity
            <input className={fieldClass} inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          </label>
          <label className="text-sm">Unit price (USD)
            <input className={fieldClass} inputMode="decimal" value={unitPrice} onChange={(event) => setUnitPrice(event.target.value)} />
          </label>
          <label className="text-sm">Note
            <input className={fieldClass} value={note} onChange={(event) => setNote(event.target.value)} />
          </label>
          <p className="text-sm text-muted-foreground">Extended sample value {formatUsd(value)}</p>
        </div>
      ) : null}
      {step === 2 ? (
        <Panel title="Review">
          <p className="text-sm">{customerById[customerId]?.name} · {locationById[locationId]?.name}</p>
          <p className="mt-1 text-sm">{parsedQuantity} × {unitType} at {formatUsd(parsedPrice)}</p>
          <p className="mt-1 text-sm font-medium">{formatUsd(value)}</p>
          <p className="mt-2 text-xs text-muted-foreground">{note || "No note."} This draft is excluded from booked revenue.</p>
        </Panel>
      ) : null}
      <div className="flex flex-col gap-2 sm:flex-row">
        {step > 0 ? <button type="button" className={`${actionClass} border`} onClick={() => setStep(step - 1)}>Back</button> : null}
        {step < 2 ? (
          <button type="button" className={`${actionClass} bg-primary text-primary-foreground`} onClick={() => {
            const message = step === 0 ? (!customerId || !locationId ? "Choose a customer and a location." : "") : validate()
            setError(message)
            if (!message) {
              setStep(step + 1)
            }
          }}>Continue</button>
        ) : (
          <button type="button" className={`${actionClass} bg-primary text-primary-foreground`} onClick={() => {
            const message = validate()
            setError(message)
            if (message) {
              return
            }
            const quote = demo.addQuote({
              customerId,
              locationId,
              unitType,
              quantity: parsedQuantity,
              unitPrice: parsedPrice,
              note: note || "Draft created in the demo session.",
            })
            toast("Quote saved in this demo session.")
            navigate(`/commercial/quotes/${quote.id}`)
          }}>Save quote</button>
        )}
      </div>
    </div>
  )
}

function QuoteTable() {
  const demo = useDemo()
  const [stage, setStage] = useState<"all" | QuoteStage>("all")
  const rows = demo.quotes.filter((quote) => stage === "all" || quote.stage === stage)
  return (
    <div className="space-y-3">
      <label className="text-sm">Stage
        <select aria-label="Quote stage" className={`${fieldClass} max-w-xs`} value={stage} onChange={(event) => {
          const next = event.target.value
          setStage(STAGES.find((item) => item === next) ?? "all")
        }}>
          <option value="all">All stages</option>
          {STAGES.map((item) => <option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      <ul className="divide-y">
        {rows.map((quote) => (
          <li key={quote.id} className="grid gap-1 py-3 text-sm sm:grid-cols-[6rem_minmax(0,1fr)_auto_auto] sm:items-center sm:gap-3">
            <Link className="font-medium hover:underline" to={`/commercial/quotes/${quote.id}`}>{quote.id}</Link>
            <span>{customerById[quote.customerId]?.name}</span>
            <span className="capitalize text-muted-foreground">{quote.stage}</span>
            <span className="tabular-nums">{formatUsd(quoteValue(quote))}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
