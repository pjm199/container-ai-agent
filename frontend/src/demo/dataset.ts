import type {
  Alert,
  Contract,
  Customer,
  FleetUnit,
  Location,
  Quote,
  Sale,
  Sensor,
  UnitType,
} from "@/demo/types"

export const TENANT = "Harborside Container Industries"
export const AS_OF = "2026-11-12"
export const SAMPLE_NOTE =
  "Synthetic data for this demonstration. It is not a customer record, it is not connected to a company system, and it does not replace an operational application."

export const LIST_PRICES: Record<UnitType, number> = {
  "20DC": 2450,
  "40HC": 3650,
  "40RF": 8900,
  "20TK": 6200,
}

export const MONTHS = [
  "2026-01",
  "2026-02",
  "2026-03",
  "2026-04",
  "2026-05",
  "2026-06",
  "2026-07",
  "2026-08",
  "2026-09",
  "2026-10",
  "2026-11",
] as const

export const locations: Location[] = [
  { id: "rotterdam", name: "Rotterdam", country: "Netherlands", region: "Europe", x: 168, y: 168 },
  { id: "hamburg", name: "Hamburg", country: "Germany", region: "Europe", x: 220, y: 128 },
  { id: "singapore", name: "Singapore", country: "Singapore", region: "Asia", x: 548, y: 278 },
  { id: "shanghai", name: "Shanghai", country: "China", region: "Asia", x: 640, y: 168 },
  { id: "busan", name: "Busan", country: "South Korea", region: "Asia", x: 708, y: 140 },
  { id: "los-angeles", name: "Los Angeles", country: "United States", region: "North America", x: 812, y: 196 },
  { id: "houston", name: "Houston", country: "United States", region: "North America", x: 868, y: 246 },
  { id: "savannah", name: "Savannah", country: "United States", region: "North America", x: 912, y: 198 },
]

export const customers: Customer[] = [
  { id: "meridian", name: "Meridian Retail Asia", region: "Asia", segment: "Retail", since: "2024-02", city: "Singapore", contact: "L. Tan" },
  { id: "helvetia", name: "Helvetia Foods", region: "Europe", segment: "Food", since: "2023-11", city: "Rotterdam", contact: "M. Keller" },
  { id: "pacific", name: "Pacific Alloy", region: "Asia", segment: "Industrial", since: "2025-01", city: "Busan", contact: "S. Park" },
  { id: "gulfstream", name: "Gulfstream Chemicals", region: "North America", segment: "Chemical", since: "2024-06", city: "Houston", contact: "R. Alvarez" },
  { id: "nordhavn", name: "Nordhavn Timber", region: "Europe", segment: "Materials", since: "2025-04", city: "Hamburg", contact: "A. Berg" },
  { id: "atlas", name: "Atlas Auto Parts", region: "North America", segment: "Automotive", since: "2025-08", city: "Los Angeles", contact: "J. Okonkwo" },
  { id: "baltic", name: "Baltic Cold Chain", region: "Europe", segment: "Food", since: "2026-11", city: "Hamburg", contact: "I. Nowak" },
]

export const contracts: Contract[] = [
  { id: "RC-2401", customerId: "meridian", quantity: 48, unitType: "40HC", monthlyRate: 420, monthlyCost: 250, start: "2026-01", end: "2027-06", locationIds: ["singapore", "shanghai"], corridor: "Singapore — Shanghai" },
  { id: "RC-2408", customerId: "helvetia", quantity: 30, unitType: "40RF", monthlyRate: 680, monthlyCost: 400, start: "2026-03", end: "2027-02", locationIds: ["rotterdam", "hamburg"], corridor: "Rotterdam — Hamburg" },
  { id: "RC-2414", customerId: "pacific", quantity: 24, unitType: "20DC", monthlyRate: 260, monthlyCost: 160, start: "2026-02", end: "2026-12", locationIds: ["busan", "shanghai"], corridor: "Busan — Shanghai" },
  { id: "RC-2420", customerId: "gulfstream", quantity: 27, unitType: "20TK", monthlyRate: 740, monthlyCost: 450, start: "2026-06", end: "2027-05", locationIds: ["houston"], corridor: "Houston hub" },
  { id: "RC-2426", customerId: "nordhavn", quantity: 15, unitType: "40HC", monthlyRate: 380, monthlyCost: 230, start: "2026-04", end: "2027-03", locationIds: ["hamburg"], corridor: "Hamburg yard" },
  { id: "RC-2431", customerId: "atlas", quantity: 12, unitType: "40HC", monthlyRate: 400, monthlyCost: 240, start: "2026-08", end: "2027-07", locationIds: ["los-angeles"], corridor: "Los Angeles yard" },
]

export const sales: Sale[] = [
  { id: "SO-118", customerId: "pacific", month: "2026-02", unitType: "20DC", quantity: 400, unitPrice: 2450, unitCost: 1960, locationId: "busan" },
  { id: "SO-141", customerId: "meridian", month: "2026-05", unitType: "40HC", quantity: 220, unitPrice: 3650, unitCost: 2847, locationId: "singapore" },
  { id: "SO-166", customerId: "helvetia", month: "2026-09", unitType: "40RF", quantity: 80, unitPrice: 8900, unitCost: 7476, locationId: "rotterdam" },
]

export const quotes: Quote[] = [
  { id: "QT-1042", customerId: "meridian", locationId: "singapore", unitType: "40HC", quantity: 200, unitPrice: 3480, stage: "sent", created: "2026-11-02", note: "Annual replenishment for the Singapore distribution centre." },
  { id: "QT-1048", customerId: "gulfstream", locationId: "houston", unitType: "20TK", quantity: 40, unitPrice: 6100, stage: "negotiation", created: "2026-10-21", note: "Tank fleet expansion, delivery from Houston." },
  { id: "QT-1051", customerId: "baltic", locationId: "hamburg", unitType: "40RF", quantity: 60, unitPrice: 8600, stage: "sent", created: "2026-11-08", note: "Cold-chain trial. Prospect, not yet a rental customer." },
  { id: "QT-1033", customerId: "atlas", locationId: "los-angeles", unitType: "40HC", quantity: 30, unitPrice: 3520, stage: "won", created: "2026-10-30", note: "Won. Release is planned for December and is not in booked revenue." },
  { id: "QT-1019", customerId: "nordhavn", locationId: "hamburg", unitType: "40HC", quantity: 12, unitPrice: 3400, stage: "lost", created: "2026-09-14", note: "Lost on lead time." },
]

const PREDICTIONS = [
  "Door seal wear likely within 30 days",
  "Reefer compressor hours above the service threshold",
  "Locking-rod corrosion at the right door",
  "Floor panel delamination along the centre line",
]

const LANES: Array<[string, string]> = [
  ["rotterdam", "singapore"],
  ["shanghai", "los-angeles"],
  ["houston", "hamburg"],
  ["busan", "savannah"],
  ["hamburg", "houston"],
  ["los-angeles", "busan"],
  ["savannah", "rotterdam"],
  ["singapore", "los-angeles"],
]

function sensor(partial: Partial<Sensor> & Pick<Sensor, "temperatureC">): Sensor {
  return {
    reportedAt: "2026-11-12T06:40:00Z",
    humidityPct: partial.temperatureC === null ? 61 : 78,
    door: "closed",
    shockG: 0.2,
    batteryPct: 86,
    ...partial,
  }
}

function timeline(statusLabel: string): FleetUnit["timeline"] {
  return [
    { at: "2024-04-02", label: "Entered the sample fleet" },
    { at: "2026-06-18", label: "Inspection passed" },
    { at: "2026-11-01", label: statusLabel },
  ]
}

function buildUnits(): { units: FleetUnit[]; alerts: Alert[] } {
  const units: FleetUnit[] = []
  let serial = 4821100
  let excursion: FleetUnit | null = null
  let shockUnit: FleetUnit | null = null

  const push = (unit: Omit<FleetUnit, "id" | "number">): FleetUnit => {
    const number = `HCIU${serial}`
    serial += 1
    const created: FleetUnit = { ...unit, id: number, number }
    units.push(created)
    return created
  }

  for (const contract of contracts) {
    for (let index = 0; index < contract.quantity; index += 1) {
      const locationId = contract.locationIds[index % contract.locationIds.length] ?? contract.locationIds[0]
      const unit = push({
        unitType: contract.unitType,
        status: "rented",
        locationId,
        condition: index % 11 === 0 ? "fair" : "good",
        customerId: contract.customerId,
        contractId: contract.id,
        idleDays: 0,
        destinationId: null,
        eta: null,
        sensors:
          contract.unitType === "40RF" || index % 4 === 0
            ? sensor({
                temperatureC: contract.unitType === "40RF" ? -18.2 : null,
                shockG: 0.2,
              })
            : null,
        timeline: timeline("On hire"),
        prediction: null,
      })
      if (contract.unitType === "40RF" && index === 0) {
        excursion = unit
      }
      if (shockUnit === null && contract.unitType === "40HC" && index === 4) {
        shockUnit = unit
      }
    }
  }

  if (excursion?.sensors) {
    excursion.sensors = { ...excursion.sensors, temperatureC: 8.6, reportedAt: "2026-11-12T06:10:00Z" }
    excursion.timeline = [...excursion.timeline, { at: "2026-11-12T06:10:00Z", label: "Temperature rose above setpoint" }]
  }
  if (shockUnit?.sensors) {
    shockUnit.sensors = { ...shockUnit.sensors, shockG: 4.2, reportedAt: "2026-11-11T22:15:00Z" }
  } else if (shockUnit) {
    shockUnit.sensors = sensor({ temperatureC: null, shockG: 4.2, reportedAt: "2026-11-11T22:15:00Z" })
  }

  for (let index = 0; index < 48; index += 1) {
    push({
      unitType: index % 3 === 0 ? "20DC" : "40HC",
      status: "available",
      locationId: locations[index % locations.length]?.id ?? "rotterdam",
      condition: "good",
      customerId: null,
      contractId: null,
      idleDays: 15 + (index % 8) * 8,
      destinationId: null,
      eta: null,
      sensors: null,
      timeline: timeline("Idle in yard"),
      prediction: null,
    })
  }

  for (let index = 0; index < 22; index += 1) {
    const lane = LANES[index % LANES.length] ?? LANES[0]
    const day = 14 + (index % 8)
    push({
      unitType: index % 5 === 0 ? "40RF" : "40HC",
      status: "in_transit",
      locationId: lane[0],
      condition: "good",
      customerId: null,
      contractId: null,
      idleDays: 0,
      destinationId: lane[1],
      eta: `2026-11-${day}`,
      sensors: sensor({
        temperatureC: index % 5 === 0 ? -17.4 : null,
        batteryPct: index === 0 ? 18 : 74,
        reportedAt: index === 0 ? "2026-11-11T16:05:00Z" : "2026-11-12T05:50:00Z",
      }),
      timeline: timeline("Departed on the sample lane"),
      prediction: null,
    })
  }

  for (let index = 0; index < 12; index += 1) {
    push({
      unitType: index % 4 === 0 ? "40RF" : "40HC",
      status: "maintenance",
      locationId: locations[index % locations.length]?.id ?? "hamburg",
      condition: index % 3 === 0 ? "poor" : "fair",
      customerId: null,
      contractId: null,
      idleDays: 6 + index,
      destinationId: null,
      eta: null,
      sensors: sensor({
        temperatureC: index % 4 === 0 ? -12.1 : null,
        batteryPct: 64,
      }),
      timeline: timeline("Moved to maintenance"),
      prediction: PREDICTIONS[index % PREDICTIONS.length] ?? PREDICTIONS[0],
    })
  }

  for (const locationId of ["savannah", "rotterdam"]) {
    push({
      unitType: "20DC",
      status: "sold",
      locationId,
      condition: "good",
      customerId: null,
      contractId: null,
      idleDays: 0,
      destinationId: null,
      eta: null,
      sensors: null,
      timeline: timeline("Sold and awaiting collection"),
      prediction: null,
    })
  }

  const idle = units
    .filter((unit) => unit.status === "available")
    .reduce((best, unit) => (unit.idleDays > best.idleDays ? unit : best))
  const maintenance = units.find((unit) => unit.status === "maintenance")
  const transit = units.find((unit) => unit.status === "in_transit")

  const alerts: Alert[] = []
  if (excursion) {
    alerts.push({
      id: "AL-441",
      severity: "high",
      title: "Reefer temperature above setpoint",
      summary: `${excursion.number} reported 8.6°C against a −18°C setpoint.`,
      action: "Call the depot and confirm the compressor before the next handover.",
      at: "2026-11-12T06:10:00Z",
      containerId: excursion.id,
    })
  }
  alerts.push({
    id: "AL-438",
    severity: "medium",
    title: "Yard idle time above 45 days",
    summary: `${idle.number} has been available for ${idle.idleDays} days.`,
    action: "Offer the unit on the next open quote or reposition it.",
    at: "2026-11-12T04:00:00Z",
    containerId: idle.id,
  })
  if (maintenance?.prediction) {
    alerts.push({
      id: "AL-433",
      severity: "medium",
      title: "Maintenance prediction",
      summary: `${maintenance.number}: ${maintenance.prediction}.`,
      action: "Schedule the workshop slot already implied by this sample prediction.",
      at: "2026-11-11T09:30:00Z",
      containerId: maintenance.id,
    })
  }
  if (transit) {
    alerts.push({
      id: "AL-429",
      severity: "low",
      title: "Lane report is behind plan",
      summary: `${transit.number} last reported with 18% battery, 14 hours behind the lane plan.`,
      action: "Request a fresh position from the sample tracker.",
      at: "2026-11-11T16:05:00Z",
      containerId: transit.id,
    })
  }
  if (shockUnit) {
    alerts.push({
      id: "AL-426",
      severity: "high",
      title: "Shock above the handling limit",
      summary: `${shockUnit.number} recorded 4.2 g.`,
      action: "Hold the unit for a door and corner-casting inspection.",
      at: "2026-11-11T22:15:00Z",
      containerId: shockUnit.id,
    })
  }

  return { units, alerts }
}

const built = buildUnits()

export const units: FleetUnit[] = built.units
export const alerts: Alert[] = built.alerts

export const locationById = Object.fromEntries(locations.map((location) => [location.id, location]))
export const customerById = Object.fromEntries(customers.map((customer) => [customer.id, customer]))
export const contractById = Object.fromEntries(contracts.map((contract) => [contract.id, contract]))

export function unitById(id: string): FleetUnit | undefined {
  return units.find((unit) => unit.id === id)
}
