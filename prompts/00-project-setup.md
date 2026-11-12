# Prompt 00 — Project setup

> Ricostruzione. Il file su disco era vuoto: questo non è il testo originale del prompt. Descrive lo stato iniziale verificabile nel codice prima del modulo container. I dettagli non presenti nei file sono elencati in fondo.

## Contesto ricostruito

Repository Python con un'applicazione FastAPI minima.

- Pacchetto `app`, versione `0.1.0`, nome `container-ai-assistant`.
- `GET /health` risponde `{ "status": "ok", "version": "0.1.0" }`.
- Impostazioni in `app/config.py`, con `DATABASE_URL` predefinito `sqlite:///./database/app.db`. In quella fase l'URL era solo dichiarato: non esistevano engine, sessioni o tabelle.
- Dipendenze iniziali: FastAPI, Uvicorn, Pydantic, pydantic-settings, pytest, httpx.
- Test: `tests/test_health.py`.
- Avvio documentato: `uvicorn app.main:app --reload`.
- Python indicato nel README: 3.9 o successivo.
- Directory `database/` presente, con i file di database ignorati da git.

Il README di quella fase dichiarava che database, autenticazione e funzioni AI non erano implementati.

## Informazioni mancanti

Mancano il testo originale del prompt, l'elenco esatto dei vincoli dati all'autore e qualsiasi decisione di prodotto non rimasta nel codice o nel README.
