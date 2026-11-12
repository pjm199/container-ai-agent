# Container Intelligence Experience

## Product brief e specifica UX/UI per Cursor Agent

**Versione:** 1.0 --- 11 novembre 2026\
**Scopo:** realizzare una demo software interattiva, di livello
enterprise, da presentare al titolare di un'azienda internazionale del
settore container.

------------------------------------------------------------------------

## 1. Direzione strategica

### Obiettivo

Impressionare il titolare mostrando capacità concrete di product design,
UX/UI, architettura software, sviluppo frontend e applicazione
dell'intelligenza artificiale ai processi aziendali.

**Non stiamo costruendo un nuovo gestionale container e non stiamo
proponendo di sostituire quello esistente.** È ragionevole presumere che
l'azienda disponga già di un gestionale per le attività operative. Non
ne conosciamo però prodotto, caratteristiche o API: non dobbiamo
inventare carenze né dichiarare integrazioni inesistenti.

La demo mostra una possibile nuova esperienza di accesso, consultazione
e interazione con dati e processi aziendali. In una fase successiva
questa esperienza potrebbe essere integrata con i sistemi esistenti, se
tecnicamente e commercialmente sensato.

### Risultato commerciale atteso

Il titolare deve pensare: *«Questa è la qualità di software e di
esperienza utente che potremmo portare nella nostra azienda. Voglio
capire cosa potrebbero realizzare partendo dai nostri sistemi.»*

La demo apre una conversazione. Non deve fingere di essere già
installata o collegata all'azienda.

## 2. Principi non negoziabili

1.  Qualità enterprise: niente aspetto da esercizio didattico o template
    generico.
2.  Prodotto prima della tecnologia: ogni schermata risponde a
    un'esigenza riconoscibile.
3.  UX eccellente: gerarchia informativa, navigazione intuitiva,
    feedback e stati curati.
4.  Responsive reale: desktop per direzione e funzioni commerciali;
    smartphone per il personale sul campo. Il mobile non è una versione
    desktop ristretta.
5.  Interattività autentica: menu, filtri, ricerca, selezione,
    drill-down e flussi dimostrativi funzionano.
6.  Trasparenza: dataset sintetico; nessuna integrazione aziendale reale
    attiva.
7.  Non duplicare il gestionale: le funzioni mobile mostrano una
    possibile esperienza migliore sopra processi e sistemi esistenti.
8.  Coerenza: design system unico e componenti riutilizzabili.

## 3. Le cinque aree di esperienza

Sono cinque punti di accesso a informazioni e capacità, non cinque
gestionali separati.

### 3.1 Fleet Intelligence

**Scopo:** lettura immediata della flotta globale.

Contenuti: - container totali e distribuzione per stato; - distribuzione
geografica per area, paese e deposito; - disponibilità, utilizzo e
movimentazioni; - eventi anomali e container in ritardo; - andamento nel
tempo; - elenco ricercabile e filtrabile; - dettaglio container con
timeline eventi.

Interazioni: filtri per area, deposito, stato e tipologia; selezione
KPI; apertura dettaglio; drill-down dalla visione globale al singolo
container.

Non presentare la mappa come GPS reale: se la posizione è simulata,
dichiararlo.

### 3.2 Commercial Intelligence

**Scopo:** rendere leggibili performance commerciali e informazioni di
noleggio/vendita.

Contenuti: - ricavi e andamento; - contratti attivi e in scadenza; -
clienti principali; - utilizzo e redditività per tipologia e area; -
opportunità commerciali; - scadenze e situazioni da attenzionare.

Interazioni: periodo selezionabile, confronto tra periodi, filtri per
area/cliente/tipologia, dettaglio cliente o contratto.

I valori devono essere coerenti tra KPI, grafici e tabelle. Non
inventare formule finanziarie non definite.

### 3.3 Executive Intelligence

**Scopo:** dare al titolare una vista sintetica per capire cosa accade e
dove intervenire.

Contenuti: - KPI aziendali principali; - trend di ricavi, utilizzo e
disponibilità; - confronto tra aree geografiche; - rischi, anomalie e
scostamenti; - priorità suggerite; - sintesi delle variazioni rispetto
al periodo precedente.

La pagina deve rispondere a tre domande: come sta andando l'azienda?
Dove sono problemi o opportunità? Cosa merita attenzione oggi? Evitare
grafici decorativi senza una lettura manageriale.

### 3.4 AI Business Assistant

**Scopo:** mostrare come interrogare informazioni aziendali in
linguaggio naturale e ottenere risposte utili.

Prompt dimostrativi: - «Quali aree hanno registrato il maggiore aumento
dei ricavi?» - «Quali container risultano fermi da più tempo?» - «Quali
contratti scadono nei prossimi 30 giorni?» - «Riassumi le principali
anomalie della settimana.» - «Confronta l'utilizzo della flotta tra
Europa e Asia.»

Esperienza: - interfaccia conversazionale curata; - suggerimenti
iniziali cliccabili; - risposte strutturate con numeri e sintesi; -
collegamenti alle viste e ai dettagli pertinenti; - indicazione del
perimetro e della fonte dei dati.

**Veridicità:** se non esiste un collegamento effettivo a un modello AI
e a dati reali, le risposte sono scenari dimostrativi predefiniti. Non
presentarle come analisi live.

### 3.5 Connected Operations

**Scopo:** mostrare un'esperienza mobile moderna per chi lavora in
deposito o sul campo.

Non è un nuovo gestionale operativo. È una dimostrazione di come
informazioni e attività già presenti nei sistemi aziendali potrebbero
diventare più accessibili e semplici da usare.

Esperienza mobile: - home con deposito/utente e attività rilevanti; -
ricerca o scansione simulata di un container; - scheda container
leggibile su smartphone; - timeline degli eventi; - azioni dimostrative:
conferma movimentazione, controllo visivo, segnalazione danno; - foto di
esempio o acquisizione simulata; - feedback chiaro dell'azione.

Se scansione o salvataggio non sono realmente collegati a un sistema,
devono essere dichiarati simulati. Non affermare che un'operazione sia
stata registrata nel gestionale esterno.

## 4. Esperienze e navigazione

Un unico prodotto con due modalità d'uso coerenti.

### Desktop e tablet

Destinatari: titolare, direzione, responsabili commerciali e operativi.

Struttura indicativa: - navigazione laterale pulita; - header con
ricerca, periodo, notifiche e profilo demo; - contenuti con titolo,
contesto e azioni; - drill-down progressivo dai KPI ai dettagli.

### Smartphone

Destinatari: operatori di deposito, personale sul campo e responsabili
in mobilità.

Requisiti: - Connected Operations progettata mobile-first; - controlli
touch adeguati; - testo leggibile e gerarchia semplice; - azioni
primarie evidenti; - niente tabelle desktop compresse; - altre aree
consultabili in responsive, con priorità alla leggibilità.

Navigazione suggerita: - Overview - Fleet - Commercial - Executive - AI
Assistant - Operations

Operations è prioritaria su smartphone; su desktop può avere una vista
dedicata o un'anteprima.

## 5. Direzione visiva e qualità UX

La UI deve comunicare solidità industriale, dimensione internazionale,
precisione, controllo, tecnologia e affidabilità.

Evitare: - dashboard generiche da template; - gradienti ed effetti
decorativi eccessivi; - card tutte uguali; - grafici senza significato o
unità; - placeholder e lorem ipsum; - numeri incoerenti; - controlli che
non fanno nulla.

Usare: - tipografia curata e gerarchia netta; - palette sobria e
distintiva; - spaziatura consistente; - stati hover, focus e disabled; -
grafici leggibili con unità e periodi; - tabelle professionali; -
micro-interazioni discrete; - skeleton, empty state, error state e toast
curati; - contrasto, focus visibile, label e navigazione da tastiera.

Creare un'identità autonoma, senza copiare concorrenti o software
esistenti.

## 6. Dataset dimostrativo

Usare un dataset sintetico plausibile per un'azienda internazionale di
container.

Deve essere: - coerente tra tutte le cinque aree; - abbastanza ricco da
alimentare grafici, filtri e drill-down; - distribuito su più regioni e
depositi; - composto da tipologie container, clienti, contratti ed
eventi fittizi; - temporalmente coerente.

Usare un'unica fonte dati demo o un repository/mock service condiviso.
Non duplicare dataset diversi nelle singole pagine.

Mostrare una dicitura discreta ma visibile: **Demo environment ·
Synthetic data · Not connected to company systems**.

Non usare nomi, loghi o dati identificabili del potenziale cliente senza
autorizzazione.

## 7. Architettura e vincoli tecnici

### Base esistente

Il repository dispone già di: - backend FastAPI; - frontend React 19,
TypeScript e Vite; - Tailwind CSS e shadcn/ui base-nova; - Lucide, React
Router e TanStack Query; - client API centralizzato; - test backend e
frontend.

La milestone frontend precedente è documentata nel report
`Task 03 — Frontend foundation`.

### Decisione per questa fase

**La priorità è la demo UI/UX. Non avviare ora una riscrittura completa
del backend.**

Prima di modificare: 1. ispezionare repository, pagine, componenti,
dipendenze e test; 2. preservare ciò che funziona; 3. identificare cosa
riutilizzare; 4. definire la nuova struttura dell'esperienza; 5. isolare
i dati sintetici dietro un repository/service condiviso; 6. mantenere
separati il client API reale e il provider demo.

Non collegare schermate a endpoint inesistenti. Non estendere il modello
container attuale fingendo che rappresenti tutto il dominio aziendale.

### Integrazione futura

Preparare confini che consentano in futuro di sostituire il provider
demo con adapter verso API o sistemi aziendali autorizzati, senza
riscrivere i componenti UI.

Separare chiaramente: - pagine e componenti; - logica di
presentazione; - servizi/repository; - dataset demo; - adapter API
futuri.

Non implementare ora integrazioni, autenticazione enterprise, IoT reale
o AI live senza requisiti e accessi. Preparare confini puliti, non
infrastruttura fittizia.

### Regole di qualità

-   TypeScript strict; evitare `any` ingiustificati.
-   Nessuna logica di business importante dispersa nei componenti UI.
-   Loading, empty, error e success espliciti.
-   Nessuna chiave API nel frontend o nel repository.
-   Nessuna dipendenza nuova senza motivazione.
-   Nessuna modifica distruttiva al backend/API esistente senza
    necessità dimostrata.
-   Aggiornare test e documentazione.
-   Non dichiarare reale una funzione che è soltanto simulata.

## 8. Interazioni minime richieste

-   navigazione tra tutte le aree;
-   filtri e selettori che aggiornano i dati;
-   ricerca container;
-   apertura dettagli e drill-down;
-   grafici alimentati dal dataset condiviso;
-   cambio periodo dove previsto;
-   AI demo con almeno 4--5 prompt predefiniti;
-   collegamenti dalle risposte AI alle viste pertinenti;
-   flusso mobile di ricerca/scansione simulata e scheda container;
-   flusso dimostrativo di segnalazione evento/danno con feedback;
-   verifica su smartphone, tablet e desktop.

Ogni controllo principale deve produrre un risultato visibile.

## 9. Criteri di accettazione

### Prodotto

-   comunica una visione di prodotto, non un esercizio tecnico;
-   le cinque aree sono riconoscibili e coerenti;
-   non dichiara di sostituire il gestionale;
-   distingue demo, dati sintetici e funzioni non collegate.

### UX/UI

-   qualità visiva consistente;
-   desktop curato per la direzione;
-   smartphone realmente utilizzabile per Operations;
-   nessuna schermata placeholder;
-   stati e feedback coerenti.

### Funzionalità

-   controlli principali funzionanti;
-   dati coerenti tra dashboard, grafici, elenchi e dettagli;
-   nessun errore evidente in console;
-   nessun pulsante/link morto.

### Tecnica

-   test esistenti non regressi;
-   TypeScript e build di produzione senza errori;
-   test aggiornati per logica significativa;
-   istruzioni di avvio e deploy documentate;
-   nessun segreto incluso.

### Condivisione

-   demo distribuibile tramite URL pubblico;
-   primo accesso immediatamente comprensibile;
-   nessun dato aziendale reale richiesto;
-   presentazione professionale al primo caricamento.

## 10. Fuori ambito

Non implementare ora: - sostituzione del gestionale; - migrazione di
dati reali; - integrazione con ERP/WMS/TMS non identificati; -
autenticazione collegata a un'organizzazione reale; - GPS, telemetria,
sensori o IoT effettivi; - AI su dati riservati; - workflow produttivi
scambiabili per operazioni reali; - microservizi o infrastruttura cloud
complessa.

Questi elementi saranno valutati dopo aver suscitato interesse e
compreso i sistemi effettivi del cliente.

## 11. Piano di realizzazione

**Fase A --- Audit e direzione** - leggere il codice attuale; -
individuare pagine, componenti, dipendenze e test; - definire struttura
dell'esperienza e design system; - annotare cosa preservare,
riutilizzare, modificare o aggiungere.

**Fase B --- Design system e shell** - layout responsive e
navigazione; - tipografia, colori e spaziature; - componenti KPI,
grafici, tabelle, filtri, timeline e stati.

**Fase C --- Esperienza desktop** - Executive Overview; - Fleet
Intelligence; - Commercial Intelligence; - AI Assistant.

**Fase D --- Esperienza mobile** - Operations mobile-first; -
ricerca/scansione dimostrativa; - scheda container; - evento/ispezione
dimostrativa; - verifica responsive delle altre aree.

**Fase E --- Rifinitura e rilascio** - coerenza dati; - test; -
accessibilità e responsive; - performance; - revisione visuale
completa; - build e deploy pubblico.

Non procedere a una riscrittura generale. Ogni fase deve lasciare il
repository avviabile e verificabile.

## 12. Istruzione operativa per Cursor Agent

Agisci come un team senior composto da Product Designer, UX Architect,
Frontend Architect e Senior Engineer.

Prima di modificare il codice: 1. leggi questo documento per intero; 2.
ispeziona il repository e la milestone frontend esistente; 3. confronta
lo stato attuale con questa specifica; 4. individua cosa preservare,
riutilizzare, modificare o aggiungere; 5. segnala conflitti reali tra
codice e specifica.

Poi implementa per fasi, privilegiando qualità e coerenza rispetto alla
quantità di schermate.

Non chiedere all'utente decisioni tecniche che puoi prendere
responsabilmente. Per scelte reversibili, adotta la soluzione più
semplice e professionale e documentala. Se una scelta è irreversibile o
cambia il posizionamento commerciale, fermati e chiedi conferma.

Non inventare requisiti del cliente. Non fingere integrazioni. Non
trasformare mock in funzioni reali senza dichiararlo.

Al termine di ogni fase: - esegui i test pertinenti; - esegui TypeScript
check e build; - verifica schermate desktop e mobile; - riporta file
modificati, funzioni completate, test e risultati, problemi residui; -
aggiorna la documentazione.

**Priorità assoluta:** realizzare una demo che faccia percepire capacità
di prodotto, design, AI e sviluppo di livello professionale, senza
raccontare al cliente una storia non vera su ciò che il suo gestionale
già fa.
