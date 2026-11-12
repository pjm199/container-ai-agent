# Prompt 02 — Frontend foundation

Archivio della milestone frontend. Il testo operativo è quello salvato in `prompts/Task 03 — Frontend foundation.md`. Il report finale è in `prompts/Task 03 — Frontend foundation — report.md`.

## Ambito eseguito

Frontend indipendente in `frontend/`, con React, TypeScript, Vite, Tailwind CSS, shadcn/ui, Lucide, React Router e TanStack Query.

Pagine: dashboard con conteggi calcolati dall'elenco API, lista con ricerca per numero e filtro per stato, dettaglio, creazione con validazione e errori API.

Backend: Swagger UI e ReDoc disattivati, OpenAPI JSON conservato, CORS limitato al dev server Vite. Gli endpoint esistenti non cambiano contratto.

Collection Postman in `postman/container-ai-assistant.postman_collection.json`.

Documentazione: `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, `frontend/README.md`.

## Fuori ambito

Modifica, cancellazione, autenticazione e funzioni AI. Il backend non espone update né delete, quindi l'interfaccia non le offre e non chiede conferma per operazioni distruttive.
