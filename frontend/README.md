# Frontend

ContainerOS, the demonstration interface, plus the live container registry.

The five experience areas and the overview read one synthetic dataset in `src/demo/`. The interface says the data is synthetic and not connected to a company system. It does not replace an operational application. The live registry at `/registry` and `/containers` calls the FastAPI backend. The frontend does not open the database.

## Requirements

- Node.js 22 or later, with npm
- The backend on `http://localhost:8000` is required only for the live registry

## Setup

```bash
npm install
cp .env.example .env
```

`.env` contains:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Local run

```bash
npm run dev
```

The application is at `http://localhost:5173`. The interface language is English.

## Checks

```bash
npm test
npm run build
```

## Routes

- `/` executive overview of the sample tenant
- `/fleet`, `/fleet/inventory`, `/fleet/map`, `/fleet/maintenance`, `/fleet/units/:unitId`
- `/commercial`, `/commercial/customers/:customerId`, `/commercial/quotes/new`, `/commercial/quotes/:quoteId`, `/commercial/contracts/:contractId`
- `/executive` ( `/intelligence` redirects here )
- `/assistant`
- `/operations`, `/operations/units/:unitId`, `/operations/alerts/:alertId`
- `/registry` and `/containers` live API registry

## Public demo

The sample product is a static site. It does not need the API. A production build leaves `VITE_API_BASE_URL` empty, and a published build never calls `localhost` or `127.0.0.1`. The live registry stays on those routes only when the app runs locally against the API, or when a public `https` base URL is set on the host. No secrets belong in the frontend environment.

`vercel.json` sends every path to `index.html`, so a refresh on `/fleet` or `/operations/units/…` still opens the app.

### Publish on Vercel

1. Import this Git repository in Vercel.
2. Set **Root Directory** to `frontend`.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Leave `VITE_API_BASE_URL` unset. Do not point it at `localhost`.
5. Deploy. The public URL opens on the executive overview. The five areas work without a backend.

From `frontend/`, the same build is `npm run build`. The files to publish are in `dist/`.
