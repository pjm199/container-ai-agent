import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Plus, Search } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ErrorState, EmptyState } from "@/components/feedback-state"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { ApiError, listContainers } from "@/lib/api"
import {
  CONTAINER_STATUSES,
  STATUS_LABELS,
  filterContainers,
  isContainerStatus,
  type ContainerStatus,
} from "@/lib/containers"

export function ContainersPage() {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<ContainerStatus | "all">("all")
  const containers = useQuery({
    queryKey: ["containers"],
    queryFn: listContainers,
  })

  const visible = useMemo(
    () => (containers.data ? filterContainers(containers.data, query, status) : []),
    [containers.data, query, status],
  )
  const filtersActive = query.trim() !== "" || status !== "all"

  return (
    <>
      <PageHeader
        title="Containers"
        description="Search and open records stored by the API. Editing and deletion are not available."
        actions={
          <Link className={buttonVariants()} to="/containers/new">
            <Plus className="size-4" aria-hidden="true" />
            New container
          </Link>
        }
      />
      <div className="space-y-4 p-4 md:p-6">
        <div className="grid gap-3 rounded-xl border bg-card p-4 md:grid-cols-[minmax(0,1fr)_220px]">
          <div className="space-y-2">
            <Label htmlFor="container-search">Search by container number</Label>
            <div className="relative">
              <Search className="pointer-events-none absolute top-2 left-2.5 size-4 text-muted-foreground" aria-hidden="true" />
              <Input
                id="container-search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value)
                }}
                className="pl-8"
                placeholder="Number contains…"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status-filter">Status</Label>
            <select
              id="status-filter"
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              value={status}
              onChange={(event) => {
                const value = event.target.value
                setStatus(value === "all" || !isContainerStatus(value) ? "all" : value)
              }}
            >
              <option value="all">All statuses</option>
              {CONTAINER_STATUSES.map((item) => (
                <option key={item} value={item}>
                  {STATUS_LABELS[item]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {containers.isLoading ? (
          <div className="space-y-2" aria-busy="true">
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
            <Skeleton className="h-10" />
          </div>
        ) : null}

        {containers.isError ? (
          <ErrorState
            title="Containers could not be loaded"
            message={containers.error instanceof ApiError ? containers.error.message : "Something went wrong."}
            onRetry={() => {
              void containers.refetch()
            }}
          />
        ) : null}

        {containers.data && containers.data.length === 0 ? (
          <EmptyState
            title="No containers yet"
            message="Create a container and it will appear in this list."
            action={
              <Link className={buttonVariants()} to="/containers/new">
                New container
              </Link>
            }
          />
        ) : null}

        {containers.data && containers.data.length > 0 && visible.length === 0 ? (
          <EmptyState
            title="No matching containers"
            message={
              filtersActive
                ? "Nothing in the current registry matches this number and status."
                : "Nothing to show."
            }
          />
        ) : null}

        {visible.length > 0 ? (
          <div className="rounded-xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Number</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Condition</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((container) => (
                  <TableRow key={container.id}>
                    <TableCell>
                      <Link
                        className="font-medium text-primary underline-offset-4 hover:underline"
                        to={`/containers/${container.id}`}
                      >
                        {container.container_number}
                      </Link>
                    </TableCell>
                    <TableCell>{container.container_type}</TableCell>
                    <TableCell>
                      <StatusBadge status={container.status} />
                    </TableCell>
                    <TableCell>{container.location}</TableCell>
                    <TableCell>{container.condition}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </div>
    </>
  )
}
