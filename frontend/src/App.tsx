import { Link, Navigate, Route, Routes } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { DemoProvider } from "@/demo/demo-context"
import { ContainerCreatePage } from "@/pages/container-create-page"
import { ContainerDetailPage } from "@/pages/container-detail-page"
import { ContainersPage } from "@/pages/containers-page"
import { DashboardPage } from "@/pages/dashboard-page"
import { AssistantPage } from "@/pages/assistant-page"
import { CommercialPage, ContractPage, CustomerPage, QuotePage, QuoteWorkflowPage } from "@/pages/commercial-pages"
import { FleetInventoryPage, FleetMaintenancePage, FleetMapPage, FleetPage, FleetUnitPage } from "@/pages/fleet-pages"
import { IntelligencePage } from "@/pages/intelligence-page"
import { AlertPage, FieldUnitPage, OperationsPage } from "@/pages/operations-pages"
import { OverviewPage } from "@/pages/overview-page"

export function App() {
  return (
    <DemoProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/fleet" element={<FleetPage />} />
          <Route path="/fleet/inventory" element={<FleetInventoryPage />} />
          <Route path="/fleet/map" element={<FleetMapPage />} />
          <Route path="/fleet/maintenance" element={<FleetMaintenancePage />} />
          <Route path="/fleet/units/:unitId" element={<FleetUnitPage />} />
          <Route path="/commercial" element={<CommercialPage />} />
          <Route path="/commercial/customers/:customerId" element={<CustomerPage />} />
          <Route path="/commercial/quotes/new" element={<QuoteWorkflowPage />} />
          <Route path="/commercial/quotes/:quoteId" element={<QuotePage />} />
          <Route path="/commercial/contracts/:contractId" element={<ContractPage />} />
          <Route path="/executive" element={<IntelligencePage />} />
          <Route path="/intelligence" element={<Navigate to="/executive" replace />} />
          <Route path="/assistant" element={<AssistantPage />} />
          <Route path="/operations" element={<OperationsPage />} />
          <Route path="/operations/units/:unitId" element={<FieldUnitPage />} />
          <Route path="/operations/alerts/:alertId" element={<AlertPage />} />
          <Route path="/registry" element={<DashboardPage />} />
          <Route path="/containers" element={<ContainersPage />} />
          <Route path="/containers/new" element={<ContainerCreatePage />} />
          <Route path="/containers/:containerId" element={<ContainerDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AppShell>
    </DemoProvider>
  )
}

function NotFoundPage() {
  return (
    <>
      <PageHeader title="Page not found" description="That address is not part of ContainerOS." />
      <div className="p-6">
        <Link className={buttonVariants({ variant: "outline" })} to="/">
          Back to overview
        </Link>
      </div>
    </>
  )
}
