export const CONTAINER_STATUSES = [
  "available",
  "rented",
  "in_transit",
  "maintenance",
  "sold",
] as const

export type ContainerStatus = (typeof CONTAINER_STATUSES)[number]

export type Container = {
  id: number
  container_number: string
  container_type: string
  status: ContainerStatus
  location: string
  condition: string
  notes: string | null
  created_at: string
}

export type ContainerCreateInput = {
  container_number: string
  container_type: string
  status: ContainerStatus
  location: string
  condition: string
  notes: string | null
}

export type ContainerDraft = {
  container_number: string
  container_type: string
  status: string
  location: string
  condition: string
  notes: string
}

export const STATUS_LABELS: Record<ContainerStatus, string> = {
  available: "Available",
  rented: "Rented",
  in_transit: "In transit",
  maintenance: "Maintenance",
  sold: "Sold",
}

export type ContainerCounts = Record<ContainerStatus, number> & { total: number }

export function isContainerStatus(value: string): value is ContainerStatus {
  return CONTAINER_STATUSES.some((status) => status === value)
}

export function countContainers(containers: Container[]): ContainerCounts {
  const counts: ContainerCounts = {
    total: containers.length,
    available: 0,
    rented: 0,
    in_transit: 0,
    maintenance: 0,
    sold: 0,
  }
  for (const container of containers) {
    counts[container.status] += 1
  }
  return counts
}

export function filterContainers(
  containers: Container[],
  query: string,
  status: ContainerStatus | "all",
): Container[] {
  const needle = query.trim().toLowerCase()
  return containers.filter((container) => {
    const statusMatches = status === "all" || container.status === status
    const numberMatches =
      needle === "" || container.container_number.toLowerCase().includes(needle)
    return statusMatches && numberMatches
  })
}

export function validateContainerDraft(draft: ContainerDraft): Record<string, string> {
  const errors: Record<string, string> = {}
  if (draft.container_number.trim() === "") {
    errors.container_number = "Container number is required."
  }
  if (draft.container_type.trim() === "") {
    errors.container_type = "Type is required."
  }
  if (!isContainerStatus(draft.status)) {
    errors.status = "Select a status."
  }
  if (draft.location.trim() === "") {
    errors.location = "Location is required."
  }
  if (draft.condition.trim() === "") {
    errors.condition = "Condition is required."
  }
  return errors
}

export function toContainerCreateInput(draft: ContainerDraft): ContainerCreateInput {
  const notes = draft.notes.trim()
  return {
    container_number: draft.container_number.trim(),
    container_type: draft.container_type.trim(),
    status: draft.status as ContainerStatus,
    location: draft.location.trim(),
    condition: draft.condition.trim(),
    notes: notes === "" ? null : notes,
  }
}

export function formatCreatedAt(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  const formatted = new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date)
  return `${formatted} UTC`
}
