import { screen } from "@testing-library/react"
import { describe, expect, test, vi } from "vitest"
import { renderWithProviders } from "@/test/render"
import { DashboardPage } from "./dashboard-page"

vi.mock("@/lib/api", () => ({
  liveRegistryEnabled: () => false,
  listContainers: vi.fn(),
  getHealth: vi.fn(),
  ApiError: class ApiError extends Error {
    readonly status = 0
    readonly body = null
  },
}))

describe("published demo", () => {
  test("shows the experience without calling the live registry", async () => {
    const { listContainers } = await import("@/lib/api")
    renderWithProviders(<DashboardPage />)
    expect(await screen.findByRole("heading", { name: "Live registry is not part of this deployment" })).toBeInTheDocument()
    expect(listContainers).not.toHaveBeenCalled()
  })
})
