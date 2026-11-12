import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ErrorState } from "@/components/feedback-state"
import { PageHeader } from "@/components/page-header"
import { StatusBadge } from "@/components/status-badge"
import { ApiError, getContainer } from "@/lib/api"
import { formatCreatedAt } from "@/lib/containers"

export function ContainerDetailPage() {
  const params = useParams()
  const containerId = Number(params.containerId)
  const idIsValid = Number.isInteger(containerId) && containerId > 0
  const container = useQuery({
    queryKey: ["containers", containerId],
    queryFn: () => getContainer(containerId),
    enabled: idIsValid,
  })

  const missing = !idIsValid || (container.error instanceof ApiError && container.error.status === 404)

  return (
    <>
      <PageHeader
        title="Container"
        description="Record loaded from the API."
        actions={
          <Link className={buttonVariants({ variant: "outline" })} to="/containers">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to list
          </Link>
        }
      />
      <div className="p-4 md:p-6">
        {container.isLoading ? (
          <Skeleton className="h-64" aria-busy="true" />
        ) : null}

        {missing ? (
          <ErrorState title="Container not found" message="No container exists for this identifier." />
        ) : null}

        {container.isError && !missing ? (
          <ErrorState
            title="The container could not be loaded"
            message={container.error instanceof ApiError ? container.error.message : "Something went wrong."}
            onRetry={() => {
              void container.refetch()
            }}
          />
        ) : null}

        {container.data ? (
          <Card>
            <CardHeader>
              <CardTitle className="flex flex-wrap items-center gap-3 text-lg">
                {container.data.container_number}
                <StatusBadge status={container.data.status} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="grid gap-4 sm:grid-cols-2">
                <Detail label="Type" value={container.data.container_type} />
                <Detail label="Location" value={container.data.location} />
                <Detail label="Condition" value={container.data.condition} />
                <Detail label="Created" value={formatCreatedAt(container.data.created_at)} />
                <Detail label="Notes" value={container.data.notes ?? "None"} />
                <Detail label="Record ID" value={String(container.data.id)} />
              </dl>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</dt>
      <dd className="mt-1 text-sm">{value}</dd>
    </div>
  )
}
