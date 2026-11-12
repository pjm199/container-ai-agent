import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { AlertCircle, Boxes, CircleCheck, Container, RefreshCw } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState, EmptyState, RegistryOffline } from "@/components/feedback-state"
import { PageHeader } from "@/components/page-header"
import { ApiError, listContainers, liveRegistryEnabled } from "@/lib/api"
import { countContainers, type ContainerCounts } from "@/lib/containers"

const STATS: Array<{
  key: keyof ContainerCounts
  label: string
  icon: typeof Boxes
}> = [
  { key: "total", label: "Total containers", icon: Boxes },
  { key: "available", label: "Available", icon: CircleCheck },
  { key: "rented", label: "Rented", icon: Container },
  { key: "in_transit", label: "In transit", icon: RefreshCw },
  { key: "maintenance", label: "Maintenance", icon: AlertCircle },
]

export function DashboardPage() {
  const live = liveRegistryEnabled()
  const containers = useQuery({
    queryKey: ["containers"],
    queryFn: listContainers,
    enabled: live,
    retry: false,
  })

  const counts = containers.data ? countContainers(containers.data) : null

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Live totals from the local API registry. These records are separate from the ContainerOS sample tenant."
        actions={
          <Link className={buttonVariants()} to="/containers">
            Manage containers
          </Link>
        }
      />
      <div className="space-y-6 p-4 md:p-6">
        {!live ? <RegistryOffline /> : null}
        {containers.isLoading ? (
          <div className="grid grid-cols-2 gap-3 xl:grid-cols-5" aria-busy="true">
            {STATS.map((stat) => (
              <Skeleton key={stat.key} className="h-28" />
            ))}
          </div>
        ) : null}

        {containers.isError ? (
          <ErrorState
            title="The dashboard could not be loaded"
            message={containers.error instanceof ApiError ? containers.error.message : "Something went wrong."}
            onRetry={() => {
              void containers.refetch()
            }}
          />
        ) : null}

        {counts ? (
          <>
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-5">
              {STATS.map((stat) => (
                <Card key={stat.key} role="group" aria-label={stat.label}>
                  <CardHeader>
                    <CardDescription className="flex items-center gap-2">
                      <stat.icon className="size-4" aria-hidden="true" />
                      {stat.label}
                    </CardDescription>
                    <CardTitle className="text-2xl font-semibold sm:text-3xl">{counts[stat.key]}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
            {counts.total === 0 ? (
              <EmptyState
                title="No containers yet"
                message="The registry is empty. Add the first container to start tracking availability."
                action={
                  <Link className={buttonVariants()} to="/containers/new">
                    New container
                  </Link>
                }
              />
            ) : null}
          </>
        ) : null}
      </div>
    </>
  )
}
