# TASK 03.1 — Project Cleanup, Documentation & Git Readiness

## Obiettivo
Consolidare il repository dopo il completamento del frontend, senza introdurre nuove funzionalità.

## 1. Analisi preliminare
Esamina:
- Git status e branch corrente.
- Tutti i file nella root.
- `.gitignore` e file `.env`.
- Struttura `docs/`, `prompts/`, `postman/`.
- Database SQLite e contenuto della tabella containers.

Non eseguire operazioni distruttive prima di aver verificato i file interessati.

## 2. Pulizia
- Verifica il `package-lock.json` nella root. Se è vuoto e inutilizzato, eliminalo. Mantieni `frontend/package-lock.json`.
- Verifica `env.example` e `.env.example` nella root. Mantieni il nome canonico `.env.example`; elimina eventuali duplicati soltanto dopo averne confrontato il contenuto.
- Verifica che `.env`, `frontend/.env`, database SQLite e `node_modules` siano esclusi da Git.
- Non cancellare file di configurazione necessari.

## 3. Database
Verifica la presenza del record di test `CONT-UI-0001`.

Se è ancora presente e risulta l'unico record creato per la verifica dell'interfaccia, elimina esclusivamente quel record. Non eliminare il database e non modificare altri dati.

## 4. Documentazione
- Uniforma il nome del file a `docs/ARCHITECTURE.md`.
- Verifica che tutti i riferimenti interni siano aggiornati.
- Esamina i prompt presenti in `prompts/`.
- Confronta `prompts/02-frontend-foundation.md` con `prompts/Task 03 — Frontend foundation.md`.
- Evita duplicazioni e non perdere il prompt operativo originale.
- Completa `prompts/README.md` con indice, descrizione e ordine di esecuzione dei prompt.
- Elimina `prompts/02-container-management-api.md` soltanto se è un file vuoto e non corrisponde a una milestone effettivamente prevista.
- Non inventare contenuti mancanti nei prompt precedenti.

## 5. Verifiche
Esegui:
- `git diff --check`
- `pytest -v`
- `cd frontend && npm test`
- `npm run build`

Verifica inoltre che nessun segreto, file `.env`, database locale o `node_modules` venga incluso nel futuro commit.

## 6. Git
Non eseguire commit e non effettuare merge.

Fornisci un report finale con:
- File eliminati, rinominati e modificati.
- Stato del database.
- Documentazione consolidata.
- Esito di tutti i test.
- Output finale di `git status`.
- Eventuali problemi rimasti aperti.