# container-ai-assistant

Backend FastAPI e frontend React per il registro container. Autenticazione e funzioni AI non sono implementate.

## Backend

Richiede Python 3.9 o successivo.

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
alembic upgrade head
uvicorn app.main:app --reload
```

Il server ascolta su `http://127.0.0.1:8000`.

- `GET /health`
- `GET /openapi.json`
- `GET /containers`
- `POST /containers`
- `GET /containers/{container_id}`

`/docs` e `/redoc` non sono pubblicati.

```bash
pytest
```

## Frontend

Vedi `frontend/README.md`. In breve:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

L'interfaccia è su `http://localhost:5173` e usa `VITE_API_BASE_URL=http://localhost:8000`.
