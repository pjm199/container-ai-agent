import type { ReactElement } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { render } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { Toaster } from "@/components/ui/sonner"
import { DemoProvider } from "@/demo/demo-context"

export function renderWithProviders(ui: ReactElement) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <DemoProvider>
          {ui}
          <Toaster />
        </DemoProvider>
      </MemoryRouter>
    </QueryClientProvider>,
  )
}
