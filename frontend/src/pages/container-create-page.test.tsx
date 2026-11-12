import { screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { beforeEach, describe, expect, test, vi } from "vitest"
import { ApiError, createContainer } from "@/lib/api"
import { renderWithProviders } from "@/test/render"
import { ContainerCreatePage } from "./container-create-page"

vi.mock("@/lib/api", async () => {
  const actual = await vi.importActual<typeof import("@/lib/api")>("@/lib/api")
  return { ...actual, createContainer: vi.fn() }
})

async function fillRequiredFields() {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText("Container number"), "CONT-0100")
  await user.type(screen.getByLabelText("Type"), "40HC")
  await user.selectOptions(screen.getByLabelText("Status"), "available")
  await user.type(screen.getByLabelText("Location"), "yard-a")
  await user.type(screen.getByLabelText("Condition"), "good")
  return user
}

describe("create container", () => {
  beforeEach(() => {
    vi.mocked(createContainer).mockReset()
  })

  test("blocks submit when required fields are missing", async () => {
    const user = userEvent.setup()
    renderWithProviders(<ContainerCreatePage />)

    await user.click(screen.getByRole("button", { name: "Create container" }))

    expect(screen.getByText("Container number is required.")).toBeInTheDocument()
    expect(screen.getByText("Select a status.")).toBeInTheDocument()
    expect(createContainer).not.toHaveBeenCalled()
  })

  test("shows the API duplicate error and confirms a successful create", async () => {
    vi.mocked(createContainer).mockRejectedValueOnce(
      new ApiError("A container with this container_number already exists", 409, {
        detail: "A container with this container_number already exists",
      }),
    )
    renderWithProviders(<ContainerCreatePage />)
    const user = await fillRequiredFields()
    await user.click(screen.getByRole("button", { name: "Create container" }))

    expect(await screen.findByText("A container with this container_number already exists")).toBeInTheDocument()

    vi.mocked(createContainer).mockResolvedValueOnce({
      id: 15,
      container_number: "CONT-0100",
      container_type: "40HC",
      status: "available",
      location: "yard-a",
      condition: "good",
      notes: null,
      created_at: "2026-11-12T05:45:00.000Z",
    })
    await user.click(screen.getByRole("button", { name: "Create container" }))

    expect(await screen.findByText("Container created.")).toBeInTheDocument()
    expect(vi.mocked(createContainer).mock.calls.at(-1)?.[0]).toEqual({
      container_number: "CONT-0100",
      container_type: "40HC",
      status: "available",
      location: "yard-a",
      condition: "good",
      notes: null,
    })
  })
})
