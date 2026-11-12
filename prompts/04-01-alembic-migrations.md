# Alembic — baseline dello schema

Archivio della milestone `prompts/TASK 04.1 — Introduce Alembic Database Migrations.md`. I comandi si eseguono dalla radice del repository, con il virtualenv attivo. L'URL è quello di `app.config.settings`: variabile `DATABASE_URL`, altrimenti `sqlite:///./database/app.db`.

## Revisione

Baseline `f0dc31842d67`, file `migrations/versions/f0dc31842d67_baseline_containers_schema.py`. Crea la tabella `containers` già presente nel modello SQLAlchemy: chiave primaria, `container_number` univoco, check sullo status, `created_at` senza default lato database.

Su SQLite `migrations/env.py` attiva `render_as_batch`, così le modifiche successive possono usare le batch migration.

## Comandi

Creare una migrazione dopo aver modificato i modelli, poi rileggere il file generato:

```bash
alembic revision --autogenerate -m "descrizione della modifica"
```

Storia, revisione corrente e head:

```bash
alembic history
alembic current
alembic heads
```

Applicare le migrazioni fino a head:

```bash
alembic upgrade head
```

Su un database vuoto questo comando crea lo schema. Tornare indietro di una revisione:

```bash
alembic downgrade -1
```

Sulla baseline, `downgrade -1` elimina la tabella `containers` e i suoi record.

## Database già esistente

`database/app.db` aveva già la tabella `containers`, creata in precedenza con `create_all`. L'upgrade della baseline non va eseguito su quel file: tenterebbe di creare di nuovo la tabella.

Confronto fra schema e modelli, poi registrazione della revisione senza eseguire l'SQL:

```bash
alembic stamp head
```

`stamp` aggiunge `alembic_version` e lascia invariati la tabella e i record. Il database locale è stato allineato a `f0dc31842d67`. Prima e dopo lo stamp la tabella `containers` conteneva 0 righe e il suo `CREATE TABLE` era identico.

L'avvio con `uvicorn` non lancia migrazioni e non azzera il database. `init_db` crea soltanto la directory del file SQLite, se manca.

## Test

I test delle migrazioni usano file SQLite temporanei. Non aprono `database/app.db`.
