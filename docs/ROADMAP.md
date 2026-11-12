# Roadmap

Il file precedente era vuoto. Qui sono riportati solo gli elementi verificabili nel codice e nelle milestone già realizzate. Date, priorità commerciali e funzioni non descritte nel repository non sono state inventate.

## Fatto

- Health check `GET /health`.
- Database SQLite dei container, con creazione, elenco e lettura per id.
- Frontend con dashboard, elenco filtrabile, dettaglio e creazione, collegato alle API.
- OpenAPI JSON disponibile. Swagger UI e ReDoc disattivati.
- Collection Postman degli endpoint esistenti.

## Non presente nel backend

- Modifica di un container.
- Cancellazione di un container.
- Filtri, ricerca e paginazione lato server.
- Migrazioni di schema: `init_db` crea le tabelle mancanti e non modifica una tabella già esistente.
- Autenticazione e autorizzazione.
- Funzioni di intelligenza artificiale.

Il frontend non mostra azioni di modifica o cancellazione perché le API corrispondenti non esistono. Non c'è una conferma per operazioni distruttive, perché nessuna operazione distruttiva è esposta.

## Informazioni mancanti

Non ci sono, nel repository, decisioni su autenticazione, AI, multi-utente o sostituzione di SQLite. Quei temi compaiono solo come assenze del codice attuale e nel README iniziale, che dichiarava autenticazione e AI non implementate.
