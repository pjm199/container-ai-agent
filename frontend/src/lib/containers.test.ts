import { describe, expect, test } from "vitest"
import {
  countContainers,
  filterContainers,
  validateContainerDraft,
  type Container,
  type ContainerDraft,
} from "./containers"

function container(overrides: Partial<Container> = {}): Container {
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

const draft: ContainerDraft = {
  container_number: " CONT-0001 ",
  container_type: "40HC",
  status: "available",
  location: "yard-a",
  condition: "good",
  notes: "",
}

describe("container calculations", () => {
  test("counts each status from the API records", () => {
    const counts = countContainers([
      container(),
      container({ id: 2, status: "rented", container_number: "CONT-0002" }),
      container({ id: 3, status: "in_transit", container_number: "CONT-0003" }),
      container({ id: 4, status: "maintenance", container_number: "CONT-0004" }),
      container({ id: 5, status: "sold", container_number: "CONT-0005" }),
    ])

    expect(counts).toEqual({
      total: 5,
      available: 1,
      rented: 1,
      in_transit: 1,
      maintenance: 1,
      sold: 1,
    })
  })

  test("filters by container number and status", () => {
    const records = [
      container(),
      container({ id: 2, status: "rented", container_number: "CONT-0002" }),
    ]

    expect(filterContainers(records, "0002", "all").map((item) => item.id)).toEqual([2])
    expect(filterContainers(records, "", "rented").map((item) => item.id)).toEqual([2])
    expect(filterContainers(records, "0002", "available")).toEqual([])
  })

  test("requires the fields the API requires", () => {
    expect(validateContainerDraft({ ...draft, container_number: "  ", status: "" })).toEqual({
      container_number: "Container number is required.",
      status: "Select a status.",
    })
    expect(validateContainerDraft(draft)).toEqual({})
  })
})
