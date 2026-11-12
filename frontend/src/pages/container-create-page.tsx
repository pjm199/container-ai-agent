import { useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RegistryOffline } from "@/components/feedback-state"
import { PageHeader } from "@/components/page-header"
import { ApiError, createContainer, fieldErrorsFromApi, liveRegistryEnabled } from "@/lib/api"
import {
  CONTAINER_STATUSES,
  STATUS_LABELS,
  toContainerCreateInput,
  validateContainerDraft,
  type ContainerDraft,
} from "@/lib/containers"

const EMPTY_DRAFT: ContainerDraft = {
  container_number: "",
  container_type: "",
  status: "",
  location: "",
  condition: "",
  notes: "",
}

export function ContainerCreatePage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [draft, setDraft] = useState<ContainerDraft>(EMPTY_DRAFT)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState<string | null>(null)

  const mutation = useMutation({
    mutationFn: createContainer,
    onSuccess: async (container) => {
      await queryClient.invalidateQueries({ queryKey: ["containers"] })
      toast.success("Container created.")
      navigate(`/containers/${container.id}`)
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        const fields = fieldErrorsFromApi(error)
        setFieldErrors(fields)
        setFormError(Object.keys(fields).length === 0 ? error.message : null)
        return
      }
      setFormError("The container could not be created.")
    },
  })

  function update(field: keyof ContainerDraft, value: string) {
    setDraft((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => {
      if (!(field in current)) {
        return current
      }
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const errors = validateContainerDraft(draft)
    setFieldErrors(errors)
    setFormError(null)
    if (Object.keys(errors).length > 0) {
      return
    }
    mutation.mutate(toContainerCreateInput(draft))
  }

  return (
    <>
      <PageHeader
        title="New container"
        description="Required fields are checked here and again by the API."
        actions={
          <Link className={buttonVariants({ variant: "outline" })} to="/containers">
            Cancel
          </Link>
        }
      />
      {liveRegistryEnabled() ? null : (
        <div className="p-4 md:p-6">
          <RegistryOffline />
        </div>
      )}
      {liveRegistryEnabled() ? (
      <form className="mx-auto max-w-2xl space-y-5 p-4 md:p-6" onSubmit={onSubmit} noValidate>
        {formError ? (
          <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm">
            {formError}
          </p>
        ) : null}
        <Field
          id="container_number"
          label="Container number"
          value={draft.container_number}
          error={fieldErrors.container_number}
          onChange={(value) => {
            update("container_number", value)
          }}
        />
        <Field
          id="container_type"
          label="Type"
          value={draft.container_type}
          error={fieldErrors.container_type}
          onChange={(value) => {
            update("container_type", value)
          }}
        />
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <select
            id="status"
            className="min-h-11 w-full rounded-lg border border-input bg-transparent px-3 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive md:min-h-9 md:text-sm"
            value={draft.status}
            aria-invalid={fieldErrors.status ? true : undefined}
            aria-describedby={fieldErrors.status ? "status-error" : undefined}
            onChange={(event) => {
              update("status", event.target.value)
            }}
          >
            <option value="">Select a status</option>
            {CONTAINER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
          {fieldErrors.status ? (
            <p id="status-error" className="text-sm text-destructive">
              {fieldErrors.status}
            </p>
          ) : null}
        </div>
        <Field
          id="location"
          label="Location"
          value={draft.location}
          error={fieldErrors.location}
          onChange={(value) => {
            update("location", value)
          }}
        />
        <Field
          id="condition"
          label="Condition"
          value={draft.condition}
          error={fieldErrors.condition}
          onChange={(value) => {
            update("condition", value)
          }}
        />
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <textarea
            id="notes"
            className="min-h-24 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-base outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            value={draft.notes}
            onChange={(event) => {
              update("notes", event.target.value)
            }}
          />
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creating…" : "Create container"}
        </Button>
      </form>
      ) : null}
    </>
  )
}

function Field({
  id,
  label,
  value,
  error,
  onChange,
}: {
  id: string
  label: string
  value: string
  error?: string
  onChange: (value: string) => void
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onChange={(event) => {
          onChange(event.target.value)
        }}
      />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  )
}
