# Architettura

Container AI Assistant è composto da un backend FastAPI e da un frontend React indipendente. Il frontend non accede al database: legge e scrive solo attraverso le API HTTP.

## Backend

- Applicazione: `app/main.py`
- Configurazione: `app/config.py` (`DATABASE_URL`, `CORS_ORIGINS`)
- Persistenza SQLite: `app/database.py`
- Modello `containers`: `app/models/container.py`
- Schemi Pydantic: `app/schemas/container.py`
- Router: `app/routers/containers.py`

All'avvio il lifespan crea le tabelle mancanti. Il file predefinito è `database/app.db`.

Endpoint disponibili:

| Metodo | Percorso | Risultato |
| --- | --- | --- |
| GET | `/health` | `{ "status": "ok", "version": "0.1.0" }` |
| GET | `/openapi.json` | schema OpenAPI |
| GET | `/containers` | elenco ordinato per id |
| POST | `/containers` | creazione, risposta 201 |
| GET | `/containers/{container_id}` | dettaglio, 404 se assente |

`POST /containers` risponde 409 se `container_number` esiste già e 422 se i campi obbligatori o lo status non sono validi. Gli status ammessi sono `available`, `rented`, `in_transit`, `maintenance`, `sold`.

Swagger UI (`/docs`) e ReDoc (`/redoc`) sono disattivati. Lo schema JSON resta pubblicato.

Il CORS accetta solo le origini in `CORS_ORIGINS`, di default `http://localhost:5173` e `http://127.0.0.1:5173`. Sono consentiti i metodi `GET`, `POST` e `OPTIONS`, e gli header `Accept` e `Content-Type`.

## Frontend

Directory `frontend/`. Stack: React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide, React Router, TanStack Query.

- `src/lib/api.ts` esegue le chiamate e traduce gli errori HTTP.
- `src/lib/containers.ts` calcola totali, filtri e validazione del form sui dati già ricevuti.
- Le pagine sono dashboard, elenco, dettaglio e creazione.

La ricerca per numero e il filtro per stato avvengono nel browser sull'elenco restituito da `GET /containers`. Il backend non espone parametri di query.

`VITE_API_BASE_URL` indica la base delle API. In sviluppo è `http://localhost:8000`.

## Avvio

Backend, dalla radice del repository:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

Frontend, in un altro terminale:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Il frontend resta su `http://localhost:5173`. La porta è fissa: se è occupata, Vite si ferma invece di cambiarla.

## Test

```bash
pytest
cd frontend && npm test && npm run build
```
