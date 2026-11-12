import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  Bell,
  Briefcase,
  Container,
  Database,
  LayoutDashboard,
  LineChart,
  Menu,
  MessageSquareText,
  Radar,
  Search,
  UserRound,
  X,
} from "lucide-react"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { alerts, customerById, quotes, TENANT, units } from "@/demo/dataset"
import { useDemo } from "@/demo/demo-context"
import { getHealth, liveRegistryEnabled } from "@/lib/api"
import { useMinWidth } from "@/lib/viewport"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/fleet", label: "Fleet", icon: Container, end: false },
  { to: "/commercial", label: "Commercial", icon: Briefcase, end: false },
  { to: "/executive", label: "Executive", icon: LineChart, end: false },
  { to: "/assistant", label: "Assistant", icon: MessageSquareText, end: false },
  { to: "/operations", label: "Operations", icon: Radar, end: false },
]

const TAB_ITEMS = [
  NAV_ITEMS[5],
  NAV_ITEMS[1],
  NAV_ITEMS[2],
  NAV_ITEMS[3],
  NAV_ITEMS[4],
]

function navigationClass(isActive: boolean) {
  return cn(
    "flex min-h-11 items-center gap-2 border-l-2 border-transparent px-3 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
    isActive && "border-sidebar-primary bg-sidebar-accent text-sidebar-accent-foreground",
  )
}

function tabClass(isActive: boolean) {
  return cn(
    "relative flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 px-0.5 text-[10px] leading-tight",
    isActive ? "text-primary" : "text-muted-foreground",
  )
}

function crumbs(pathname: string): Array<{ label: string; to?: string }> {
  if (pathname === "/") {
    return [{ label: "Overview" }]
  }
  if (pathname.startsWith("/registry") || pathname.startsWith("/containers")) {
    return [{ label: "Live registry" }]
  }
  const parts = pathname.split("/").filter(Boolean)
  const labels: Record<string, string> = {
    fleet: "Fleet",
    inventory: "Inventory",
    map: "Distribution",
    maintenance: "Maintenance",
    units: "Unit",
    commercial: "Commercial",
    customers: "Customer",
    quotes: "Quote",
    new: "New quote",
    contracts: "Contract",
    executive: "Executive",
    intelligence: "Executive",
    assistant: "Assistant",
    operations: "Operations",
    alerts: "Alert",
  }
  return parts.map((part, index) => ({
    label:
      parts[index - 1] === "customers"
        ? (customerById[part]?.name ?? part)
        : (labels[part] ?? part),
    to: index < parts.length - 1 ? `/${parts.slice(0, index + 1).join("/")}` : undefined,
  }))
}

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const demo = useDemo()
  const desktop = useMinWidth(768)
  const [query, setQuery] = useState("")
  const [panel, setPanel] = useState<"search" | "alerts" | "profile" | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const registry = location.pathname.startsWith("/containers") || location.pathname.startsWith("/registry")
  const registryLive = liveRegistryEnabled()
  const health = useQuery({ queryKey: ["health"], queryFn: getHealth, retry: false, enabled: registryLive })
  const unseen = alerts.filter((alert) => !demo.seenAlertIds.includes(alert.id))
  const matches = useMemo(() => searchSample(query, demo.quotes), [demo.quotes, query])
  const apiLabel = !registryLive
    ? "Synthetic demo"
    : health.isSuccess
      ? `API ${health.data.version}`
      : health.isError
        ? "API unavailable"
        : "Checking API"

  useEffect(() => {
    setMenuOpen(false)
    setPanel(null)
  }, [location.pathname])

  useEffect(() => {
    if (desktop) {
      setMenuOpen(false)
    }
  }, [desktop])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPanel(null)
        setMenuOpen(false)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="h-dvh overflow-hidden bg-background pl-[env(safe-area-inset-left)] pr-[env(safe-area-inset-right)] md:grid md:grid-cols-[248px_minmax(0,1fr)]">
      {desktop ? (
        <aside className="flex min-h-0 flex-col overflow-y-auto border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
          <div className="flex items-center gap-3 px-4 py-4">
            <span className="flex size-9 items-center justify-center bg-sidebar-primary text-xs font-semibold tracking-wide text-sidebar-primary-foreground">
              OS
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold tracking-tight">ContainerOS</p>
              <p className="text-[11px] text-sidebar-foreground/60">Intelligent Container Business Platform</p>
            </div>
          </div>
          <nav className="flex flex-col gap-1 px-2 pb-3" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => navigationClass(isActive)}>
                <item.icon className="size-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            ))}
            <NavLink to="/registry" className={({ isActive }) => navigationClass(isActive || registry)}>
              <Database className="size-4" aria-hidden="true" />
              Live registry
            </NavLink>
          </nav>
          <p className="mt-auto px-5 py-4 text-[11px] text-sidebar-foreground/55">{apiLabel}</p>
        </aside>
      ) : null}
      <div className="flex h-dvh min-w-0 flex-col">
        <p className="shrink-0 border-b bg-slate-100 px-3 py-1.5 pt-[max(0.375rem,env(safe-area-inset-top))] text-center text-[10px] leading-snug font-medium tracking-wide text-slate-600 sm:text-[11px]">
          {registry
            ? "LIVE REGISTRY · LOCAL API · SEPARATE FROM THE SYNTHETIC DEMO"
            : "DEMO ENVIRONMENT · SYNTHETIC DATA · NOT CONNECTED TO COMPANY SYSTEMS"}
        </p>
        <header className="relative z-30 shrink-0 border-b bg-card">
          <div className="flex items-center gap-1 px-2 py-1 md:px-4 md:py-2">
            {desktop ? null : (
              <NavLink to="/" end className="flex min-h-11 min-w-0 flex-1 items-center gap-2 px-1">
                <span className="flex size-8 shrink-0 items-center justify-center bg-primary text-[10px] font-semibold text-primary-foreground">
                  OS
                </span>
                <span className="truncate text-sm font-semibold">ContainerOS</span>
              </NavLink>
            )}
            {desktop ? (
              <nav aria-label="Breadcrumb" className="min-w-0 flex-1 text-sm leading-6 text-pretty text-muted-foreground">
                <Crumbs pathname={location.pathname} onNavigate={navigate} />
              </nav>
            ) : null}
            <div className="relative ml-auto flex shrink-0 items-center">
              {desktop ? (
                <SearchField
                  query={query}
                  matches={matches}
                  open={panel === "search"}
                  onQuery={(value) => {
                    setQuery(value)
                    setPanel("search")
                  }}
                  onOpen={() => setPanel("search")}
                  onPick={(to) => {
                    navigate(to)
                    setPanel(null)
                    setQuery("")
                  }}
                />
              ) : null}
              <IconButton
                label={`Notifications, ${unseen.length} unseen`}
                pressed={panel === "alerts"}
                onClick={() => setPanel(panel === "alerts" ? null : "alerts")}
              >
                <Bell className="size-4" />
                {unseen.length > 0 ? <span className="absolute top-2 right-2 size-1.5 bg-primary" /> : null}
              </IconButton>
              <button
                type="button"
                aria-label="Profile Amelia Chen"
                aria-expanded={panel === "profile"}
                className="flex min-h-11 items-center gap-2 px-2 text-sm hover:bg-muted md:min-h-8 md:border md:px-2"
                onClick={() => setPanel(panel === "profile" ? null : "profile")}
              >
                <UserRound className="size-4" />
                <span className="hidden md:inline">A. Chen</span>
              </button>
              {desktop ? null : (
                <IconButton label="Open menu" pressed={menuOpen} onClick={() => setMenuOpen(true)}>
                  <Menu className="size-4" />
                </IconButton>
              )}
              {panel === "alerts" ? (
                <OverlayPanel desktop={desktop} label="Sample alerts" onClose={() => setPanel(null)}>
                  <p className="border-b px-3 py-3 text-xs tracking-[0.12em] text-muted-foreground uppercase">Sample alerts</p>
                  {alerts.map((alert) => (
                    <button
                      key={alert.id}
                      type="button"
                      className="block min-h-11 w-full border-b px-3 py-2 text-left last:border-b-0 hover:bg-muted"
                      onClick={() => {
                        demo.markAlertSeen(alert.id)
                        setPanel(null)
                        navigate(`/operations/alerts/${alert.id}`)
                      }}
                    >
                      <span className="text-sm font-medium">{alert.title}</span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{alert.severity}</span>
                    </button>
                  ))}
                </OverlayPanel>
              ) : null}
              {panel === "profile" ? (
                <OverlayPanel desktop={desktop} label="Profile" onClose={() => setPanel(null)}>
                  <div className="p-4">
                    <p className="text-sm font-semibold">Amelia Chen</p>
                    <p className="text-xs text-muted-foreground">Chief Executive · {TENANT}</p>
                    <p className="mt-2 text-xs text-muted-foreground">Sample profile. This demo has no accounts.</p>
                    <button
                      type="button"
                      className="mt-3 min-h-11 text-sm underline-offset-4 hover:underline"
                      onClick={() => {
                        toast("Demo environment: sign-in is not connected.")
                        setPanel(null)
                      }}
                    >
                      Sign out
                    </button>
                  </div>
                </OverlayPanel>
              ) : null}
            </div>
          </div>
          {desktop ? null : (
            <div className="px-3 pb-2">
              <label className="relative block">
                <Search className="pointer-events-none absolute top-3.5 left-3 size-4 text-muted-foreground" aria-hidden="true" />
                <input
                  aria-label="Search sample data"
                  value={query}
                  placeholder="Search sample data"
                  className="h-11 w-full rounded-md border bg-background pr-3 pl-9 text-base outline-none focus-visible:border-ring"
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              {query.trim() ? (
                <div className="max-h-60 overflow-y-auto border-t">
                  <SearchResults
                    matches={matches}
                    onPick={(to) => {
                      navigate(to)
                      setQuery("")
                    }}
                  />
                </div>
              ) : null}
              <nav aria-label="Breadcrumb" className="pt-1 text-sm leading-6 text-pretty text-muted-foreground">
                <Crumbs pathname={location.pathname} onNavigate={navigate} />
              </nav>
            </div>
          )}
        </header>
        <main className="min-h-0 min-w-0 flex-1 overflow-x-clip overflow-y-auto">{children}</main>
        {desktop ? null : (
          <nav
            aria-label="Primary"
            className="grid shrink-0 grid-cols-5 border-t bg-card pb-[env(safe-area-inset-bottom)]"
          >
            {TAB_ITEMS.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => tabClass(isActive)}>
                <item.icon className="size-5" aria-hidden="true" />
                <span className="tab-label max-w-full truncate">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
      {menuOpen ? (
        <MobileMenu
          registry={registry}
          apiLabel={apiLabel}
          onClose={() => setMenuOpen(false)}
        />
      ) : null}
    </div>
  )
}

function Crumbs({ pathname, onNavigate }: { pathname: string; onNavigate: (to: string) => void }) {
  return (
    <>
      {crumbs(pathname).map((crumb, index) => (
        <span key={`${crumb.label}-${index}`}>
          {index > 0 ? <span className="px-1.5">/</span> : null}
          {crumb.to ? (
            <button type="button" className="min-h-11 hover:text-foreground md:min-h-0" onClick={() => onNavigate(crumb.to ?? "/")}>
              {crumb.label}
            </button>
          ) : (
            <span className="text-foreground">{crumb.label}</span>
          )}
        </span>
      ))}
    </>
  )
}

function IconButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string
  pressed?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-expanded={pressed}
      className="relative flex size-11 items-center justify-center hover:bg-muted md:size-8 md:border"
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function SearchField({
  query,
  matches,
  open,
  onQuery,
  onOpen,
  onPick,
}: {
  query: string
  matches: Array<{ to: string; label: string; kind: string }>
  open: boolean
  onQuery: (value: string) => void
  onOpen: () => void
  onPick: (to: string) => void
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-2 left-2 size-3.5 text-muted-foreground" aria-hidden="true" />
      <input
        aria-label="Search sample data"
        value={query}
        placeholder="Search sample data"
        className="h-9 w-64 bg-transparent pr-2 pl-7 text-sm outline-none"
        onChange={(event) => onQuery(event.target.value)}
        onFocus={onOpen}
      />
      {open && query.trim() ? (
        <div className="absolute top-10 right-0 z-20 w-72 border bg-card shadow-sm">
          <SearchResults matches={matches} onPick={onPick} />
        </div>
      ) : null}
    </div>
  )
}

function SearchResults({
  matches,
  onPick,
}: {
  matches: Array<{ to: string; label: string; kind: string }>
  onPick: (to: string) => void
}) {
  if (matches.length === 0) {
    return <p className="px-3 py-3 text-sm text-muted-foreground">No sample matches.</p>
  }
  return (
    <>
      {matches.map((match) => (
        <button
          key={match.to}
          type="button"
          className="block min-h-11 w-full px-3 py-2 text-left text-sm hover:bg-muted"
          onClick={() => onPick(match.to)}
        >
          <span className="block font-medium">{match.label}</span>
          <span className="text-xs text-muted-foreground">{match.kind}</span>
        </button>
      ))}
    </>
  )
}

function OverlayPanel({
  desktop,
  label,
  onClose,
  children,
}: {
  desktop: boolean
  label: string
  onClose: () => void
  children: ReactNode
}) {
  if (!desktop) {
    return (
      <div className="fixed inset-0 z-50">
        <button type="button" aria-label="Close panel" className="absolute inset-0 bg-slate-950/40" onClick={onClose} />
        <div
          role="dialog"
          aria-modal="true"
          aria-label={label}
          className="absolute inset-x-0 bottom-0 max-h-[80dvh] overflow-y-auto bg-card pb-[env(safe-area-inset-bottom)] shadow-lg"
        >
          {children}
        </div>
      </div>
    )
  }
  return <div className="absolute top-11 right-0 z-20 w-80 border bg-card shadow-sm">{children}</div>
}

function MobileMenu({
  registry,
  apiLabel,
  onClose,
}: {
  registry: boolean
  apiLabel: string
  onClose: () => void
}) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    closeRef.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    const node = dialogRef.current
    if (!node) {
      return
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Tab") {
        return
      }
      const items = [...node.querySelectorAll<HTMLElement>("a, button")].filter((item) => !item.hasAttribute("disabled"))
      const first = items[0]
      const last = items[items.length - 1]
      if (!first || !last) {
        return
      }
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    node.addEventListener("keydown", onKey)
    return () => node.removeEventListener("keydown", onKey)
  }, [])

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label="Close menu" className="absolute inset-0 bg-slate-950/40" onClick={onClose} />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto bg-sidebar pb-[env(safe-area-inset-bottom)] text-sidebar-foreground shadow-lg"
      >
        <div className="flex items-center justify-between px-4 py-2">
          <p className="text-sm font-semibold">Menu</p>
          <button ref={closeRef} type="button" aria-label="Close menu" className="flex size-11 items-center justify-center" onClick={onClose}>
            <X className="size-4" />
          </button>
        </div>
        <nav aria-label="All sections" className="flex flex-col px-2 pb-2">
          {NAV_ITEMS.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => navigationClass(isActive)} onClick={onClose}>
              <item.icon className="size-4" aria-hidden="true" />
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/registry" className={({ isActive }) => navigationClass(isActive || registry)} onClick={onClose}>
            <Database className="size-4" aria-hidden="true" />
            Live registry
          </NavLink>
        </nav>
        <p className="px-5 pb-4 text-[11px] text-sidebar-foreground/55">{apiLabel}</p>
      </div>
    </div>
  )
}

function searchSample(query: string, sampleQuotes: typeof quotes) {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return []
  }
  const found: Array<{ to: string; label: string; kind: string }> = []
  for (const unit of units) {
    if (unit.number.toLowerCase().includes(needle)) {
      found.push({ to: `/fleet/units/${unit.id}`, label: unit.number, kind: "Sample container" })
    }
  }
  for (const customer of Object.values(customerById)) {
    if (customer.name.toLowerCase().includes(needle)) {
      found.push({ to: `/commercial/customers/${customer.id}`, label: customer.name, kind: "Sample customer" })
    }
  }
  for (const quote of sampleQuotes) {
    if (quote.id.toLowerCase().includes(needle)) {
      found.push({ to: `/commercial/quotes/${quote.id}`, label: quote.id, kind: "Sample quote" })
    }
  }
  return found.slice(0, 8)
}
