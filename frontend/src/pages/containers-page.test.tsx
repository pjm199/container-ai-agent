import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { listContainers } from "@/lib/api"
import type { Container } from "@/lib/containers"
import { renderWithProviders } from "@/test/render"
import { ContainersPage } from "./containers-page"

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api")
  return { ...actual, listContainers: vi.fn() }
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

describe("container list", () => {
  beforeEach(() => {
    vi.mocked(listContainers).mockReset()
  })

  test("searches by number and filters by status", async () => {
    vi.mocked(listContainers).mockResolvedValue([
      record({}),
      record({ id: 2, container_number: "CONT-0002", status: "rented", location: "gate-2" }),
    ])
    const user = userEvent.setup()
    renderWithProviders(<ContainersPage />)

    expect(await screen.findByRole("link", { name: "CONT-0001" })).toBeInTheDocument()
    await user.type(screen.getByLabelText("Search by container number"), "0002")
    expect(screen.queryByRole("link", { name: "CONT-0001" })).not.toBeInTheDocument()
    expect(screen.getByRole("link", { name: "CONT-0002" })).toBeInTheDocument()

    await user.selectOptions(screen.getByLabelText("Status"), "available")
    expect(screen.getByText("No matching containers")).toBeInTheDocument()
  })

  test("links a row to its detail page", async () => {
    vi.mocked(listContainers).mockResolvedValue([record({})])
    renderWithProviders(<ContainersPage />)

    expect(await screen.findByRole("link", { name: "CONT-0001" })).toHaveAttribute("href", "/containers/1")
  })
})
