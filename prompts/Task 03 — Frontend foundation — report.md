# Report — Task 03, Frontend foundation

Milestone completata e verificata. Il testo operativo è `prompts/Task 03 — Frontend foundation.md`. Questo file è il report finale richiesto dalla sezione 11.

## Architettura realizzata

Container AI Assistant è un backend FastAPI e un frontend React indipendente. Il frontend non apre il database: legge e scrive solo via HTTP.

Il backend conserva il contratto già presente.

| Metodo | Percorso | Risultato |
| --- | --- | --- |
| GET | `/health` | `{"status":"ok","version":"0.1.0"}` |
| GET | `/openapi.json` | schema OpenAPI |
| GET | `/containers` | elenco ordinato per id |
| POST | `/containers` | creazione, 201 |
| GET | `/containers/{container_id}` | dettaglio, 404 se assente |

`POST /containers` risponde 409 se `container_number` esiste già e 422 se i campi obbligatori o lo status non sono validi. Gli status ammessi sono `available`, `rented`, `in_transit`, `maintenance`, `sold`.

Modifiche backend di questa milestone:

- Swagger UI (`/docs`) e ReDoc (`/redoc`) disattivati.
- OpenAPI JSON lasciato su `/openapi.json`.
- CORS limitato a `http://localhost:5173` e `http://127.0.0.1:5173`. Metodi `GET`, `POST`, `OPTIONS`. Header `Accept` e `Content-Type`. Credenziali disabilitate.

Il frontend vive in `frontend/`. Stack: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui (stile base-nova), Lucide, React Router, TanStack Query. Lingua dell'interfaccia: inglese.

- `frontend/src/lib/api.ts` è l'unico punto che chiama il backend e traduce gli errori HTTP.
- `frontend/src/lib/containers.ts` calcola i totali, filtra l'elenco e valida il form sui dati già ricevuti.
- La base URL è `VITE_API_BASE_URL`, in sviluppo `http://localhost:8000`.
- Ricerca per numero e filtro per stato avvengono nel browser sull'elenco di `GET /containers`. L'API non ha parametri di query.

Pagine:

- `/` dashboard. Conteggi reali di totale, available, rented, in transit, maintenance, più accesso alla gestione container. `sold` entra nel totale e nel filtro di elenco, senza una card propria.
- `/containers` elenco con numero, tipo, stato, posizione e condizione.
- `/containers/new` creazione, validazione locale ed errori 409/422 dell'API.
- `/containers/:containerId` dettaglio.

Stati coperti: loading, empty, error con riprova, successo con toast e navigazione al dettaglio. La sidebar mostra la versione letta da `GET /health`.

## File creati e modificati

Backend, solo per CORS, documentazione API e test di piattaforma:

- `app/main.py`
- `app/config.py`
- `.env.example`
- `.gitignore` (`node_modules/`)
- `tests/test_platform.py`
- `README.md`

Frontend, directory nuova:

- `frontend/package.json`, `frontend/package-lock.json`, `frontend/vite.config.ts`, `frontend/tsconfig.json`, `frontend/tsconfig.app.json`, `frontend/tsconfig.node.json`, `frontend/components.json`, `frontend/index.html`
- `frontend/.env.example`, `frontend/.gitignore`, `frontend/README.md`
- `frontend/src/main.tsx`, `frontend/src/App.tsx`, `frontend/src/index.css`, `frontend/src/vite-env.d.ts`
- `frontend/src/lib/api.ts`, `frontend/src/lib/containers.ts`, `frontend/src/lib/utils.ts`
- `frontend/src/components/app-shell.tsx`, `page-header.tsx`, `feedback-state.tsx`, `status-badge.tsx`
- componenti shadcn in `frontend/src/components/ui/` (button, card, input, label, select, table, badge, separator, skeleton, sonner)
- pagine: `dashboard-page.tsx`, `containers-page.tsx`, `container-detail-page.tsx`, `container-create-page.tsx`
- test: `frontend/src/lib/api.test.ts`, `containers.test.ts`, `dashboard-page.test.tsx`, `containers-page.test.tsx`, `container-detail-page.test.tsx`, `container-create-page.test.tsx`, `frontend/src/test/setup.ts`, `frontend/src/test/render.tsx`

Integrazione e documentazione:

- `postman/container-ai-assistant.postman_collection.json` (v2.1, variabili `baseUrl` e `containerId`)
- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `prompts/02-frontend-foundation.md`
- `prompts/00-project-setup.md` e `prompts/01-container-database.md`, ricostruiti perché i file erano vuoti. Le informazioni originali mancanti sono segnate nei file.

`frontend/.env` esiste in locale ed è ignorato da git. Il valore è lo stesso di `frontend/.env.example`.

## Comandi di avvio

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

Il backend risponde su `http://127.0.0.1:8000`. Il frontend resta su `http://localhost:5173`: la porta è fissa e Vite si ferma se è occupata.

Verifica:

```bash
pytest
cd frontend && npm test && npm run build
```

## Test eseguiti e risultati

Eseguiti di nuovo al termine della verifica:

- pytest: 23 passed
- Vitest: 14 passed, 6 file
- `tsc -b`: completato senza errori
- `npm run build`: build di produzione completata durante la milestone

Controlli sull'istanza in esecuzione:

- `GET /health` restituisce `{"status":"ok","version":"0.1.0"}`
- `GET /docs` e `GET /redoc` rispondono 404
- `GET /openapi.json` risponde 200 e include `/health`, `/containers` e `/containers/{container_id}`
- preflight `OPTIONS /containers` da `http://localhost:5173` rimanda quell'origine; un'origine sconosciuta non riceve `access-control-allow-origin`

Browser, contro l'API reale:

- dashboard vuota prima di qualsiasi record
- form vuoto: errori sui campi obbligatori
- creazione di `CONT-UI-0001` (40HC, available, yard-a, good) e apertura del dettaglio, record id 1
- elenco con quella riga; ricerca `nomatch` e filtro `rented` mostrano l'empty state
- dashboard dopo la creazione: Total 1, Available 1, Rented 0, In transit 0, Maintenance 0
- secondo invio dello stesso numero: il form resta su `/containers/new` e mostra «A container with this container_number already exists»
- `/containers/999999` mostra «Container not found»
- a 1280 px la sidebar è 240 px e compare «API 0.1.0»; a 768 px sidebar e contenuto restano affiancati

## Problemi ancora aperti

Questi punti restano veri dopo la milestone frontend:

- In preflight Starlette aggiunge anche `Accept-Language` e `Content-Language` agli header consentiti. L'origine resta limitata alle due URL di Vite.

Al termine di questa milestone lo schema era ancora creato da `init_db`. TASK 04.1 lo ha sostituito con Alembic.

TASK 03.1 ha poi rimosso il record di verifica `CONT-UI-0001`, il `package-lock.json` vuoto nella root e ha compilato `prompts/README.md`. Il documento di architettura è `docs/ARCHITECTURE.md`. `prompts/02-container-management-api.md` resta vuoto.

## Funzionalità non implementate

- Modifica e cancellazione di un container, e la relativa conferma distruttiva: il backend non espone quelle API.
- Ricerca, filtro e paginazione lato server: `GET /containers` non accetta query param. Filtro e ricerca sono nel browser.
- Migrazioni Alembic, autenticazione e funzioni di intelligenza artificiale: fuori dall'ambito di questa milestone.
- Nessun dato aziendale è stato inserito come dato reale. L'unico record presente è `CONT-UI-0001`, creato durante la verifica dell'interfaccia.
