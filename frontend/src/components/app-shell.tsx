import type { ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import { Container, LayoutDashboard } from "lucide-react"
import { NavLink } from "react-router-dom"
import { getHealth } from "@/lib/api"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/containers", label: "Containers", icon: Container, end: false },
]

function navigationClass(isActive: boolean) {
  return cn(
    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  const health = useQuery({
    queryKey: ["health"],
    queryFn: getHealth,
    retry: false,
  })

  const apiLabel = health.isSuccess
    ? `API ${health.data.version}`
    : health.isError
      ? "API unavailable"
      : "Checking API"

  return (
    <div className="min-h-svh bg-background md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-b border-sidebar-border bg-sidebar text-sidebar-foreground md:border-r md:border-b-0">
        <div className="flex items-center gap-3 px-4 py-4 md:px-5 md:py-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-sidebar-primary text-sm font-semibold text-sidebar-primary-foreground">
            CA
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight">Container AI</p>
            <p className="text-xs text-sidebar-foreground/65">Assistant</p>
          </div>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-3" aria-label="Primary">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => navigationClass(isActive)}>
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <p className="hidden px-5 pb-5 text-xs text-sidebar-foreground/60 md:block">{apiLabel}</p>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  )
}
