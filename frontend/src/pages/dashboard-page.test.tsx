import { screen, within } from "@testing-library/react"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { listContainers } from "@/lib/api"
import type { Container } from "@/lib/containers"
import { renderWithProviders } from "@/test/render"
import { DashboardPage } from "./dashboard-page"

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api")
  return { ...actual, listContainers: vi.fn(), getHealth: vi.fn() }
})

function record(overrides: Partial<Container>): Container {
  return {
    id: 1,
    container_number: "CONT-0001",
    container_type: "40HC",
    status: "available",
    location: "yard-a",
    condition: "good",
    notes: null,
    created_at: "2026-11-12T05:45:00.000Z",
    ...overrides,
  }
}

describe("dashboard", () => {
  beforeEach(() => {
    vi.mocked(listContainers).mockReset()
  })

  test("shows counts calculated from the API list", async () => {
    vi.mocked(listContainers).mockResolvedValue([
      record({}),
      record({ id: 2, container_number: "CONT-0002", status: "rented" }),
      record({ id: 3, container_number: "CONT-0003", status: "in_transit" }),
    ])

    renderWithProviders(<DashboardPage />)

    expect(within(await screen.findByRole("group", { name: "Total containers" })).getByText("3")).toBeInTheDocument()
    expect(within(screen.getByRole("group", { name: "Available" })).getByText("1")).toBeInTheDocument()
    expect(within(screen.getByRole("group", { name: "Rented" })).getByText("1")).toBeInTheDocument()
    expect(within(screen.getByRole("group", { name: "In transit" })).getByText("1")).toBeInTheDocument()
    expect(within(screen.getByRole("group", { name: "Maintenance" })).getByText("0")).toBeInTheDocument()
  })

  test("shows an empty registry when the API returns no containers", async () => {
    vi.mocked(listContainers).mockResolvedValue([])

    renderWithProviders(<DashboardPage />)

    expect(await screen.findByRole("heading", { name: "No containers yet" })).toBeInTheDocument()
    expect(within(screen.getByRole("group", { name: "Total containers" })).getByText("0")).toBeInTheDocument()
  })
})
