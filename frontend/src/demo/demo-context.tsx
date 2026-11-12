import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from "react"
import { quotes as sampleQuotes } from "@/demo/dataset"
import type { PeriodId, Quote, QuoteStage } from "@/demo/types"

type QuoteDraft = {
  customerId: string
  locationId: string
  unitType: Quote["unitType"]
  quantity: number
  unitPrice: number
  note: string
}

export type FieldKind = "movement" | "check" | "damage" | "photo"

export type FieldEntry = {
  id: string
  unitId: string
  kind: FieldKind
  note: string
  at: string
}

type DemoContextValue = {
  quotes: Quote[]
  addQuote: (draft: QuoteDraft) => Quote
  periodId: PeriodId
  setPeriodId: (periodId: PeriodId) => void
  seenAlertIds: string[]
  markAlertSeen: (id: string) => void
  fieldEntries: FieldEntry[]
  addFieldEntry: (entry: Omit<FieldEntry, "id" | "at">) => FieldEntry
}

const DemoContext = createContext<DemoContextValue | null>(null)

export function DemoProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState<Quote[]>(sampleQuotes)
  const [periodId, setPeriodId] = useState<PeriodId>("ytd")
  const [seenAlertIds, setSeenAlertIds] = useState<string[]>([])
  const [fieldEntries, setFieldEntries] = useState<FieldEntry[]>([])
  const sequence = useRef(1)
  const fieldSequence = useRef(1)

  const value = useMemo<DemoContextValue>(
    () => ({
      quotes,
      periodId,
      setPeriodId,
      seenAlertIds,
      markAlertSeen: (id: string) => {
        setSeenAlertIds((current) => (current.includes(id) ? current : [...current, id]))
      },
      fieldEntries,
      addFieldEntry: (entry) => {
        const saved: FieldEntry = {
          ...entry,
          id: `FE-${fieldSequence.current}`,
          at: "2026-11-12T12:00:00Z",
        }
        fieldSequence.current += 1
        setFieldEntries((current) => [saved, ...current])
        return saved
      },
      addQuote: (draft: QuoteDraft) => {
        const quote: Quote = {
          ...draft,
          id: `QT-D${sequence.current}`,
          created: "2026-11-12",
          stage: "draft" satisfies QuoteStage,
        }
        sequence.current += 1
        setQuotes((current) => [quote, ...current])
        return quote
      },
    }),
    [fieldEntries, periodId, quotes, seenAlertIds],
  )

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>
}

export function useDemo(): DemoContextValue {
  const value = useContext(DemoContext)
  if (!value) {
    throw new Error("DemoProvider is missing")
  }
  return value
}
