# Prompt 01 — Container database

> Ricostruzione. Il file su disco era vuoto. Il contenuto segue la richiesta che ha prodotto il modulo attuale e il comportamento verificabile in modello, router e test. Non è una copia archivata del prompt originale.

## Obiettivo ricostruito

Aggiungere il primo modulo funzionale: persistenza SQLite dei container, senza autenticazione, AI o frontend.

Stack richiesto: FastAPI, SQLAlchemy 2.x, SQLite, Pydantic, pytest.

## Modello

Tabella `containers`:

- `id`: integer, chiave primaria, autoincrement
- `container_number`: stringa obbligatoria e univoca
- `container_type`: stringa obbligatoria
- `status`: stringa obbligatoria
- `location`: stringa obbligatoria
- `condition`: stringa obbligatoria
- `notes`: stringa facoltativa
- `created_at`: datetime

Status ammessi: `available`, `rented`, `in_transit`, `maintenance`, `sold`.

## API

- `POST /containers`
- `GET /containers`
- `GET /containers/{container_id}`

Vincoli emersi dall'implementazione e dai test: modello, schemi e router separati; SQLite su file; 404 per id assente; 409 per numero duplicato; 422 per campi obbligatori mancanti, vuoti o status sconosciuto; `GET /health` invariato; test su database temporaneo, senza usare `database/app.db`.

## Informazioni mancanti

Il file originale non conteneva il testo del prompt. Non è archiviata la formulazione esatta su messaggi di errore, codice HTTP del duplicato e formato di `created_at`. Quei comportamenti sono quelli oggi coperti dai test.
