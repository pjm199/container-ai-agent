# Frontend

Interfaccia React di Container AI Assistant. I dati arrivano dal backend FastAPI; il frontend non apre il database.

## Requisiti

- Node.js 22 o successivo, con npm
- Backend in ascolto su `http://localhost:8000`

## Configurazione

```bash
npm install
cp .env.example .env
```

`.env` contiene solo:

```bash
VITE_API_BASE_URL=http://localhost:8000
```

## Avvio

```bash
npm run dev
```

L'applicazione è su `http://localhost:5173`. La lingua dell'interfaccia è l'inglese.

## Verifica

```bash
npm test
npm run build
```

## Pagine

- `/` dashboard con i conteggi calcolati da `GET /containers`
- `/containers` elenco, ricerca per numero e filtro per stato
- `/containers/new` creazione
- `/containers/:containerId` dettaglio
