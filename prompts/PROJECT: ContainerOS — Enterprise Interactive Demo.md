# PROJECT: ContainerOS — Enterprise Interactive Demo

## Objective

Transform the existing frontend into a premium, fully navigable enterprise SaaS product demonstration for an international container manufacturing, sales and rental company.

This is a commercial demonstration intended for the company's owner and senior management.

It must look and feel like a mature enterprise software product, not a generic admin template or student project.

## 1. Product identity

Working product name: ContainerOS

Positioning: Intelligent Container Business Platform.

Visual direction:
- Premium enterprise SaaS.
- Modern, sophisticated, clean and data-rich.
- Dark navy / graphite navigation, light neutral content surfaces.
- Restrained accent colors.
- Excellent typography, spacing, alignment and information hierarchy.
- High-quality charts, tables, maps and status indicators.
- Consistent iconography.
- Professional micro-interactions and transitions.
- Responsive desktop and tablet experience.

Avoid generic AI gradients, excessive rounded cards, unnecessary decoration and dashboard-template aesthetics.

## 2. Application structure

Build a persistent application shell with:
- Left sidebar.
- Product logo and name.
- Five primary navigation sections.
- Top bar with global search, notifications, profile and demo indicator.
- Main content area.
- Breadcrumbs where appropriate.

Primary modules:

### A. Fleet Management
- Fleet overview and KPI cards.
- Total containers, available, rented, in transit, maintenance.
- Container inventory with search, filters and sorting.
- Container details and operational status.
- Location and fleet distribution map.
- Utilization indicators.
- Maintenance overview.

### B. Commercial Management
- Customer portfolio.
- Customer details and history.
- Quotes and rental contracts.
- Sales and rental performance.
- Revenue and margin indicators.
- Quote creation workflow with sample data.
- Commercial pipeline.

### C. Business Intelligence
- Executive KPI dashboard.
- Revenue and margin trends.
- Rental utilization.
- Geographic performance.
- Customer profitability.
- Forecasts and operational insights.
- Period filters.

### D. AI Business Assistant
- Premium conversational interface.
- Suggested business questions.
- Example queries:
  - "Which containers are currently underutilized?"
  - "Show me our most profitable customers."
  - "Prepare a quote for 200 containers in Singapore."
  - "Identify potential operational risks."
- Demonstrate structured responses, tables, charts and business recommendations.
- Include a clear demo-mode label. Do not claim real AI integration if none exists.

### E. IoT & Predictive Operations
- Geographic tracking visualization.
- Container status and last reported position.
- Sensor indicators.
- Alerts and anomalies.
- Maintenance prediction examples.
- Historical event timeline.
- Clearly label simulated IoT data.

## 3. Executive landing dashboard

The initial route must open on a compelling executive overview.

Include:
- Welcome header.
- Date range selector.
- Global KPI summary.
- Fleet utilization.
- Revenue trend.
- Container distribution map.
- Recent operational alerts.
- Commercial performance.
- AI-generated insight preview.
- Quick links to the five modules.

This page must immediately communicate the value of the entire platform.

## 4. Data and behavior

Use a centralized, realistic demonstration dataset.

Create a coherent fictional international business with operations in Europe, Asia and North America.

Use consistent sample entities across all modules:
- Containers
- Customers
- Contracts
- Quotes
- Locations
- Financial figures
- Operational events

All figures must reconcile logically between modules.

Every major navigation item must work.

Implement meaningful interactions:
- Search
- Filters
- Sorting
- Tabs
- Date selectors
- Detail views
- Interactive charts where supported
- Quote workflow
- AI demo conversation
- Alert details

Avoid inert buttons that suggest functionality but do nothing.

Never present fictional data as actual company data. Add a persistent but discreet "DEMO ENVIRONMENT — SAMPLE DATA" indicator.

## 5. Technical constraints

- Inspect the existing repository before changing anything.
- Preserve the current React + TypeScript + Vite + Tailwind + shadcn/ui architecture.
- Keep the existing frontend/backend separation.
- Reuse existing dependencies and components wherever appropriate.
- Avoid unnecessary dependencies.
- Maintain strict TypeScript.
- Organize components, pages, data and shared UI cleanly.
- Do not damage existing backend functionality.
- Do not introduce fake API integrations.
- Do not expose secrets or credentials.
- Ensure the application works locally without requiring external services.

Use reusable components and a maintainable design system.

## 6. Quality assurance

Before declaring completion:
- Run frontend tests.
- Run TypeScript checks.
- Run production build.
- Test every navigation route.
- Test all major interactions.
- Check browser console errors.
- Check desktop and tablet layouts.
- Verify data consistency across modules.
- Fix all discovered issues.

## 7. Deliverables

Provide:
1. Fully implemented interactive frontend.
2. Clear list of modified and created files.
3. Description of implemented interactions.
4. Test and build results.
5. List of demo-only capabilities versus real backend integrations.
6. Instructions to run locally.
7. Deployment instructions for a public demo URL.

Do not stop after producing a visual mockup. Implement the actual React application.

Do not modify the existing backend unless a change is strictly necessary and explicitly justified.

Work in small, coherent implementation stages, but complete the entire frontend demo before reporting success.