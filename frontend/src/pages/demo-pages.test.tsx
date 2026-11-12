import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { App } from "@/App"
import { units } from "@/demo/dataset"
import { formatUsd } from "@/demo/format"
import { periodMoney } from "@/demo/metrics"
import { getHealth } from "@/lib/api"
import { renderWithProviders } from "@/test/render"

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api")
  return { ...actual, getHealth: vi.fn() }
})

function nav(label: string) {
  return (name: string) => name === label
}

describe("ContainerOS demo", () => {
  beforeEach(() => {
    vi.mocked(getHealth).mockResolvedValue({ status: "ok", version: "0.1.0" })
  })

  test("opens on the executive overview with sample figures", async () => {
    renderWithProviders(<App />)
    expect(await screen.findByRole("heading", { name: "Executive overview" })).toBeInTheDocument()
    expect(screen.getByText("DEMO ENVIRONMENT · SYNTHETIC DATA · NOT CONNECTED TO COMPANY SYSTEMS")).toBeInTheDocument()
    expect(screen.getAllByText(formatUsd(periodMoney("ytd").revenue)).length).toBeGreaterThan(0)
  })

  test("navigates through the five modules", async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)
    await user.click(await screen.findByRole("link", { name: nav("Fleet") }))
    expect(await screen.findByRole("heading", { name: "Fleet intelligence" })).toBeInTheDocument()
    await user.click(screen.getByRole("link", { name: nav("Commercial") }))
    expect(await screen.findByRole("heading", { name: "Commercial intelligence" })).toBeInTheDocument()
    await user.click(screen.getByRole("link", { name: nav("Executive") }))
    expect(await screen.findByRole("heading", { name: "Executive intelligence" })).toBeInTheDocument()
    await user.click(screen.getByRole("link", { name: nav("Assistant") }))
    expect(await screen.findByRole("heading", { name: "AI business assistant" })).toBeInTheDocument()
    await user.click(screen.getByRole("link", { name: nav("Operations") }))
    expect(await screen.findByRole("heading", { name: "Connected operations" })).toBeInTheDocument()
  })

  test("filters inventory by container number", async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)
    await user.click(await screen.findByRole("link", { name: nav("Fleet") }))
    await user.click(await screen.findByRole("link", { name: "Inventory" }))
    const number = units[0]?.number ?? ""
    await user.type(screen.getByLabelText("Search by container number"), number)
    expect(await screen.findByRole("link", { name: number })).toBeInTheDocument()
    expect(screen.getByText("1 unit")).toBeInTheDocument()
  })

  test("saves a quote into the sample pipeline", async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)
    await user.click(await screen.findByRole("link", { name: nav("Commercial") }))
    await user.click(screen.getByRole("link", { name: "New quote" }))
    await user.selectOptions(screen.getByLabelText("Customer"), "meridian")
    await user.selectOptions(screen.getByLabelText("Location"), "singapore")
    await user.click(screen.getByRole("button", { name: "Continue" }))
    await user.clear(screen.getByLabelText("Quantity"))
    await user.type(screen.getByLabelText("Quantity"), "200")
    await user.click(screen.getByRole("button", { name: "Continue" }))
    await user.click(screen.getByRole("button", { name: "Save quote" }))
    expect(await screen.findByRole("heading", { name: "QT-D1" })).toBeInTheDocument()
    expect(screen.getByText(/not booked revenue/i)).toBeInTheDocument()
  })

  test("answers a suggested assistant question from the sample book", async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)
    await user.click(await screen.findByRole("link", { name: nav("Assistant") }))
    await user.click(screen.getByRole("button", { name: "Which containers have been idle the longest?" }))
    expect(await screen.findByText("Scripted demo response. No model is connected.")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "Longest-idle sample units" })).toBeInTheDocument()
  })

  test("records a simulated yard action without claiming an external write", async () => {
    const user = userEvent.setup()
    renderWithProviders(<App />)
    await user.click(await screen.findByRole("link", { name: nav("Operations") }))
    await user.click(screen.getByRole("button", { name: "Simulate scan" }))
    expect(await screen.findByRole("heading", { name: /HCIU/ })).toBeInTheDocument()
    await user.type(screen.getByLabelText("Damage note"), "Corner casting dent")
    await user.click(screen.getByRole("button", { name: "Report damage" }))
    expect(await screen.findByText("Corner casting dent")).toBeInTheDocument()
    expect(screen.getByText(/not written to the live registry/i)).toBeInTheDocument()
  })
})
