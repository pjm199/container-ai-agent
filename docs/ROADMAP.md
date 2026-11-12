# Roadmap

Il file precedente era vuoto. Qui sono riportati solo gli elementi verificabili nel codice e nelle milestone già realizzate. Date, priorità commerciali e funzioni non descritte nel repository non sono state inventate.

## Fatto

- Health check `GET /health`.
- Database SQLite dei container, con creazione, elenco e lettura per id.
- Frontend con dashboard, elenco filtrabile, dettaglio e creazione, collegato alle API.
- OpenAPI JSON disponibile. Swagger UI e ReDoc disattivati.
- Collection Postman degli endpoint esistenti.
- Migrazioni Alembic. La baseline `f0dc31842d67` descrive la tabella `containers`. L'avvio dell'applicazione non modifica lo schema.
- Demo ContainerOS nel frontend, con dati di esempio separati dal registro API.
- Cinque aree di esperienza sulla stessa fonte sintetica: Fleet, Commercial, Executive, Assistant e Connected Operations. Le azioni di deposito restano nella sessione del browser.
- Build statica pubblicabile. La demo non chiama un backend locale.

## Non presente nel backend

- Modifica di un container.
- Cancellazione di un container.
- Filtri, ricerca e paginazione lato server.
- Autenticazione e autorizzazione.
- Funzioni di intelligenza artificiale.

Il frontend non mostra azioni di modifica o cancellazione perché le API corrispondenti non esistono. Non c'è una conferma per operazioni distruttive, perché nessuna operazione distruttiva è esposta.

## Informazioni mancanti

Non ci sono, nel repository, decisioni su autenticazione, AI, multi-utente o sostituzione di SQLite. Quei temi compaiono solo come assenze del codice attuale e nel README iniziale, che dichiarava autenticazione e AI non implementate.
