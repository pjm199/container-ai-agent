# Architettura

Container AI Assistant è composto da un backend FastAPI e da un frontend React indipendente. Il frontend non accede al database: legge e scrive solo attraverso le API HTTP.

## Backend

- Applicazione: `app/main.py`
- Configurazione: `app/config.py` (`DATABASE_URL`, `CORS_ORIGINS`)
- Persistenza SQLite: `app/database.py`
- Migrazioni: `app/migrate.py`, `migrations/`
- Modello `containers`: `app/models/container.py`
- Schemi Pydantic: `app/schemas/container.py`
- Router: `app/routers/containers.py`

Il file predefinito è `database/app.db`. Lo schema è versionato con Alembic, nella directory `migrations/`. L'URL del database arriva da `DATABASE_URL` in `app.config.settings`: `alembic.ini` non contiene un percorso fisso. Su SQLite le migrazioni usano la modalità batch.

All'avvio l'applicazione crea solo la directory del file SQLite. Non applica migrazioni e non azzera il database. Le modifiche di schema si eseguono dalla radice del repository:

```bash
alembic revision --autogenerate -m "descrizione della modifica"
alembic history
alembic current
alembic upgrade head
alembic downgrade -1
```

`alembic upgrade head` porta un database vuoto alla revisione head e crea le tabelle. Su un database che ha già le tabelle, creato prima di Alembic, non va lanciato l'upgrade della baseline: ricreerebbe `containers`. Si registra la revisione già presente con:

```bash
alembic stamp head
```

`stamp` scrive la revisione in `alembic_version` e lascia invariati tabella e record. Il database locale di sviluppo è stato allineato così alla revisione `f0dc31842d67`. `alembic downgrade -1` su quella baseline elimina la tabella `containers`.

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

ContainerOS è la demo commerciale. È un'esperienza di lettura sopra un libro sintetico, non un gestionale e non un collegamento a sistemi aziendali. I moduli Overview, Fleet, Commercial, Executive, Assistant e Operations leggono `frontend/src/demo/`. Non chiamano un'API finta. Il registro live resta su `/registry` e `/containers` e usa `src/lib/api.ts` verso il backend. `/intelligence` reindirizza a `/executive`.

- `src/lib/api.ts` esegue le chiamate reali e traduce gli errori HTTP.
- `src/lib/containers.ts` calcola totali, filtri e validazione del form sui dati già ricevuti dal registro.
- `src/demo/metrics.ts` ricava i totali della demo da contratti, vendite e flotta, così le cifre coincidono tra i moduli.

La ricerca del registro per numero e il filtro per stato avvengono nel browser sull'elenco restituito da `GET /containers`. Il backend non espone parametri di query.

`VITE_API_BASE_URL` indica la base delle API. In sviluppo è `http://localhost:8000`. La build di produzione, in `frontend/.env.production`, lascia la variabile vuota. In un artefatto pubblicato un indirizzo di loopback non viene chiamato: le cinque aree restano sul dataset sintetico e il registro live mostra che non fa parte di quel deploy. `frontend/vercel.json` rimanda ogni percorso a `index.html`, così il refresh di una route resta nell'applicazione.

## Avvio

Backend, dalla radice del repository:

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
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
