# TASK 03 — Frontend Foundation & First UI

## Obiettivo

Realizzare il frontend indipendente del progetto Container AI Assistant, collegato al backend FastAPI tramite REST API.

Il frontend deve avere un aspetto moderno, professionale e adatto a un'applicazione SaaS B2B internazionale per la gestione di container.

Non realizzare una semplice interfaccia dimostrativa: i dati devono provenire dal backend reale.

## 1. Prima di modificare il codice

- Analizza la struttura completa del repository.
- Verifica le API effettivamente disponibili.
- Leggi i modelli, gli schemi Pydantic e i router esistenti.
- Verifica come vengono avviati backend e test.
- Non modificare funzionalità backend già funzionanti, salvo le modifiche esplicitamente richieste sotto.

## 2. Architettura frontend

Crea una directory indipendente `frontend/`.

Stack:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- Lucide React per le icone
- React Router
- TanStack Query per la gestione delle chiamate API e della cache.

Mantieni il frontend indipendente dal backend. Non inserire logica applicativa o accesso diretto al database nel frontend.

## 3. Design e UX

Realizza un'interfaccia moderna, pulita e professionale.

Direzione visiva:
- SaaS B2B contemporaneo.
- Sidebar di navigazione.
- Header superiore con titolo della pagina e azioni.
- Layout ordinato, gerarchia visiva chiara.
- Tabelle moderne, filtri e indicatori di stato.
- Spaziature curate e tipografia leggibile.
- Responsive desktop e tablet.
- Niente estetica da gestionale tradizionale o interfaccia anni Novanta.

L'applicazione sarà inizialmente in inglese, pensando a un utilizzo internazionale.

## 4. Prima versione funzionale

Implementa:

### Dashboard
- Numero totale di container.
- Container disponibili.
- Container noleggiati.
- Container in transito.
- Container in manutenzione.
- Accesso rapido alla gestione container.

I valori devono essere calcolati dai dati restituiti dal backend, non inventati o inseriti staticamente.

### Containers
- Elenco container.
- Ricerca per numero container.
- Filtro per stato.
- Visualizzazione di numero, tipologia, stato, posizione e condizione.
- Apertura della scheda di dettaglio.
- Creazione di un nuovo container tramite form.
- Validazione dei campi.
- Gestione degli errori restituiti dalle API.

Non implementare funzioni di modifica o cancellazione se il backend non espone le relative API.

### Stati dell'interfaccia
Prevedere:
- Loading.
- Empty state.
- Error state.
- Success feedback.
- Conferma prima delle operazioni distruttive, se previste in futuro.

## 5. Collegamento API

Usa la variabile d'ambiente:

`VITE_API_BASE_URL=http://localhost:8000`

Crea un livello API dedicato, separato dai componenti UI.

Usa le API effettivamente presenti nel backend. Non inventare endpoint.

Prevedi una gestione centralizzata degli errori HTTP.

## 6. Backend

Disabilita le interfacce Swagger UI e ReDoc.

Mantieni disponibile lo schema OpenAPI JSON, necessario per integrazioni e strumenti di sviluppo.

Verifica il CORS per consentire le richieste dal frontend durante lo sviluppo, senza utilizzare configurazioni permissive non necessarie.

Non alterare il funzionamento degli endpoint esistenti.

## 7. Postman

Crea una collection Postman versionata nel repository, contenente le richieste per gli endpoint effettivamente disponibili.

Usa variabili per base URL e identificativi.

## 8. Documentazione

Crea o aggiorna:

- `docs/ARCHITECTURE.md`
- `docs/ROADMAP.md`
- `frontend/README.md`
- `prompts/02-frontend-foundation.md`

Verifica anche che siano archiviati i prompt delle milestone precedenti:

- `prompts/00-project-setup.md`
- `prompts/01-container-database.md`

Non inventare il contenuto dei prompt precedenti: ricostruiscilo dal contesto del progetto e dai file esistenti, segnalando eventuali informazioni mancanti.

## 9. Qualità e test

- TypeScript senza errori.
- Nessun errore nella build.
- Test backend ancora tutti verdi.
- Test delle funzionalità frontend principali.
- Verifica che le chiamate API funzionino.
- Nessun dato aziendale fittizio presentato come reale.

## 10. Criteri di accettazione

La milestone è completata quando:

1. Backend e frontend si avviano separatamente.
2. Il frontend comunica con il backend tramite API.
3. Dashboard e lista container mostrano dati reali.
4. È possibile creare un container.
5. La scheda di dettaglio funziona.
6. Swagger UI e ReDoc non sono accessibili.
7. Postman collection e documentazione sono presenti.
8. Build e test passano.

## 11. Report finale

Al termine restituisci:

- Architettura realizzata.
- File creati e modificati.
- Comandi per avviare backend e frontend.
- Test eseguiti e risultati.
- Eventuali problemi ancora aperti.
- Funzionalità non implementate e motivazione.

Non dichiarare completata la milestone se i criteri di accettazione non sono soddisfatti.