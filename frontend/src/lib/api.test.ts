import { afterEach, describe, expect, test, vi } from "vitest"
import { ApiError, createContainer, fieldErrorsFromApi, getContainer, listContainers, publishableApiBase } from "./api"

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("publishable API base", () => {
  test("keeps a local URL for development and drops it from a published build", () => {
    expect(publishableApiBase("http://localhost:8000", false)).toBe("http://localhost:8000")
    expect(publishableApiBase("http://127.0.0.1:8000/", true)).toBeNull()
    expect(publishableApiBase("https://api.example.com", true)).toBe("https://api.example.com")
    expect(publishableApiBase("  ", true)).toBeNull()
  })
})

describe("API client", () => {
  test("loads the container list from the configured backend", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      jsonResponse(200, [
        {
          id: 7,
          container_number: "CONT-0007",
          container_type: "20GP",
          status: "available",
          location: "gate-1",
          condition: "good",
          notes: null,
          created_at: "2026-11-12T05:45:00.000Z",
        },
      ]),
    )
    vi.stubGlobal("fetch", fetchMock)

    const records = await listContainers()

    expect(records).toHaveLength(1)
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/containers",
      expect.objectContaining({ headers: expect.any(Headers) }),
    )
  })

  test("reads one container and reports a missing record", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(404, { detail: "Container not found" }))
    vi.stubGlobal("fetch", fetchMock)

    await expect(getContainer(999999)).rejects.toMatchObject({
      status: 404,
      message: "Container not found",
    })
  })

  test("maps a duplicate number and validation errors", async () => {
    const duplicate = new ApiError(
      "A container with this container_number already exists",
      409,
      { detail: "A container with this container_number already exists" },
    )
    expect(fieldErrorsFromApi(duplicate).container_number).toBe(duplicate.message)

    const invalid = new ApiError("Some fields need attention.", 422, {
      detail: [{ loc: ["body", "location"], msg: "Field required" }],
    })
    expect(fieldErrorsFromApi(invalid)).toEqual({ location: "Field required" })

    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(409, { detail: duplicate.message }))
    vi.stubGlobal("fetch", fetchMock)
    await expect(
      createContainer({
        container_number: "CONT-0001",
        container_type: "40HC",
        status: "available",
        location: "yard-a",
        condition: "good",
        notes: null,
      }),
    ).rejects.toBeInstanceOf(ApiError)
  })
})
