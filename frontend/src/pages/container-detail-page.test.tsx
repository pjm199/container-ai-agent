import type { ReactElement } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render, screen } from "@testing-library/react"
import { MemoryRouter, Route, Routes } from "react-router-dom"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { ApiError, getContainer } from "@/lib/api"
import { ContainerDetailPage } from "./container-detail-page"

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api")
  return { ...actual, getContainer: vi.fn() }
})

function renderAt(path: string, ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/containers/:containerId" element={ui} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}

describe("container detail", () => {
  beforeEach(() => {
    vi.mocked(getContainer).mockReset()
  })

  test("shows the record returned by the API", async () => {
    vi.mocked(getContainer).mockResolvedValue({
      id: 4,
      container_number: "CONT-0004",
      container_type: "20GP",
      status: "maintenance",
      location: "workshop",
      condition: "damaged",
      notes: "door seal",
      created_at: "2026-11-12T05:45:00.000Z",
    })

    renderAt("/containers/4", <ContainerDetailPage />)

    expect(await screen.findByText("CONT-0004")).toBeInTheDocument()
    expect(screen.getByText("workshop")).toBeInTheDocument()
    expect(screen.getByText("door seal")).toBeInTheDocument()
    expect(getContainer).toHaveBeenCalledWith(4)
  })

  test("shows a not-found state when the API returns 404", async () => {
    vi.mocked(getContainer).mockRejectedValue(new ApiError("Container not found", 404, { detail: "Container not found" }))

    renderAt("/containers/999999", <ContainerDetailPage />)

    expect(await screen.findByRole("heading", { name: "Container not found" })).toBeInTheDocument()
  })
})
