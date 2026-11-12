import { Link, Route, Routes } from "react-router-dom"
import { buttonVariants } from "@/components/ui/button"
import { AppShell } from "@/components/app-shell"
import { PageHeader } from "@/components/page-header"
import { ContainerCreatePage } from "@/pages/container-create-page"
import { ContainerDetailPage } from "@/pages/container-detail-page"
import { ContainersPage } from "@/pages/containers-page"
import { DashboardPage } from "@/pages/dashboard-page"

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/containers" element={<ContainersPage />} />
        <Route path="/containers/new" element={<ContainerCreatePage />} />
        <Route path="/containers/:containerId" element={<ContainerDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppShell>
  )
}

function NotFoundPage() {
  return (
    <>
      <PageHeader title="Page not found" description="That address is not part of this application." />
      <div className="p-6">
        <Link className={buttonVariants({ variant: "outline" })} to="/">
          Back to dashboard
        </Link>
      </div>
    </>
  )
}
