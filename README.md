# container-ai-assistant

Backend iniziale di container-ai-assistant. L'applicazione espone un health check HTTP. La configurazione riserva un URL SQLite per una persistenza futura; database, autenticazione e funzionalità AI non sono implementati.

## Requisiti

- Python 3.9 o successivo

## Ambiente virtuale

```bash
python3 -m venv .venv
source .venv/bin/activate
```

Su Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

## Dipendenze

```bash
pip install -r requirements.txt
cp .env.example .env
```

## Avvio del server

```bash
uvicorn app.main:app --reload
```

Il server resta in ascolto su `http://127.0.0.1:8000`. Health check: `GET /health`.

## Test

```bash
pytest
```
# container-ai-agent
