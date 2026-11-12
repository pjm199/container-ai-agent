import { Badge } from "@/components/ui/badge"
import { STATUS_LABELS, type ContainerStatus } from "@/lib/containers"
import { cn } from "@/lib/utils"

const STATUS_STYLES: Record<ContainerStatus, string> = {
  available: "border-emerald-200 bg-emerald-50 text-emerald-800",
  rented: "border-sky-200 bg-sky-50 text-sky-800",
  in_transit: "border-amber-200 bg-amber-50 text-amber-900",
  maintenance: "border-orange-200 bg-orange-50 text-orange-900",
  sold: "border-slate-200 bg-slate-100 text-slate-700",
}

export function StatusBadge({ status }: { status: ContainerStatus }) {
  return (
    <Badge variant="outline" className={cn("h-6 px-2", STATUS_STYLES[status])}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
