# Prompt

Indice dei file in `prompts/`. I testi `00` e `01` sono ricostruzioni: i file originali erano vuoti. Le informazioni assenti restano segnate dentro quei file.

## Ordine di esecuzione

1. `00-project-setup.md` — setup iniziale: applicazione FastAPI, `GET /health`, dipendenze e avvio. Ricostruzione, non il prompt originale.
2. `01-container-database.md` — database SQLite dei container e API di creazione, elenco e dettaglio. Ricostruzione, non il prompt originale.
3. `Task 03 — Frontend foundation.md` — prompt operativo del frontend. È il testo da seguire per quella milestone.
4. `TASK 03.1 — Project Cleanup, Documentation & Git Readiness.md` — pulizia del repository, documentazione e controllo prima del commit. Nessuna funzione nuova.
5. `TASK 04.1 — Introduce Alembic Database Migrations.md` — introduzione di Alembic e baseline dello schema esistente.
6. `PROJECT: ContainerOS — Enterprise Interactive Demo.md` — demo interattiva del frontend, con dati di esempio.
7. `06-CRITICAL REQUIREMENT — MOBILE-FIRST RESPONSIVE DESIGN.md` — smartphone come piattaforma di primo livello.
8. `07-Container_Intelligence_Experience_Product_Spec.md` — esperienza di consultazione sulle cinque aree, senza sostituire un gestionale.
9. `010-FINAL MILE — Container Intelligence Experience MVP.md` — demo pronta per una pubblicazione statica, autonoma dal backend locale.

## Archivi

Questi file registrano il lavoro già fatto. Non sostituiscono il prompt operativo.

- `02-frontend-foundation.md` — sintesi della milestone frontend. Rimanda a `Task 03 — Frontend foundation.md` e al report.
- `Task 03 — Frontend foundation — report.md` — report della milestone frontend: architettura, file, comandi, test e punti lasciati aperti in quel momento.
- `04-01-alembic-migrations.md` — migrazioni Alembic: comandi, baseline e allineamento di un database già esistente.

## File senza testo

`02-container-management-api.md` è vuoto. Il nome occupa lo slot 02 della sequenza iniziale, quindi il file è stato conservato. Non contiene un prompt e non è stato compilato: il testo originale non c’è, e le API dei container sono già descritte in `01-container-database.md`.
