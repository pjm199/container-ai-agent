# FINAL MILE — Container Intelligence Experience MVP

Devi portare il progetto esistente a una demo MVP professionale, completa e pronta per la pubblicazione pubblica su Vercel.

La specifica di prodotto è `Container_Intelligence_Experience_Product_Spec.md`. Leggila integralmente prima di intervenire.

## Obiettivo

Realizzare una demo premium di Container Intelligence, convincente per il titolare di un gruppo internazionale che produce, vende e noleggia container.

Non stiamo costruendo un ERP sostitutivo. Stiamo dimostrando una nuova esperienza di intelligence, visualizzazione e interazione sopra i sistemi aziendali esistenti.

## Regole inderogabili

1. Ispeziona prima tutto il progetto e identifica cosa è già funzionante.
2. Conserva React, TypeScript, FastAPI e il backend esistente. Non riscrivere ciò che funziona.
3. Non introdurre microservizi o complessità architetturale non necessarie.
4. Usa un dataset sintetico unico, coerente e sufficientemente ricco per alimentare tutte le sezioni.
5. La demo deve funzionare autonomamente anche senza il backend locale.
6. Non devono esserci chiamate a `localhost` nella versione pubblicata.
7. Non simulare integrazioni aziendali, GPS reali, IoT o AI live. Distingui chiaramente le funzionalità dimostrative da quelle effettive.
8. Non esporre chiavi API nel frontend.

## Lavoro da completare

- Implementa e rifinisci le cinque aree: Executive, Fleet, Commercial, AI Assistant, Connected Operations.
- Rendi navigabili e coerenti tutte le pagine, i filtri, le schede e le interazioni.
- Realizza una vera esperienza desktop per manager e una vera esperienza mobile-first per gli operatori dei depositi.
- Cura in particolare gerarchia visiva, tipografia, spaziature, grafici, tabelle, mappe, stati vuoti e feedback delle azioni.
- Le operazioni mobile devono essere semplici e rapide: ricerca/scansione dimostrativa, dettaglio container, cronologia, ispezione, foto e registrazione evento dimostrativa.
- L'AI Assistant deve rispondere a domande pertinenti sul dataset demo, senza fingere di interrogare dati aziendali reali.
- Verifica coerenza matematica e logica di KPI, ricavi, utilizzo, disponibilità, contratti e trend.
- Verifica routing, navigazione diretta e refresh delle pagine.
- Prepara il frontend per Vercel: directory corretta, build, variabili d'ambiente e configurazione necessaria per React Router.

## Qualità richiesta

Non limitarti a creare schermate visivamente gradevoli. Ogni funzione mostrata deve avere un comportamento verificabile.

La demo deve essere presentabile a un imprenditore, non sembrare un prototipo da sviluppatore.

## Metodo di lavoro

Procedi per fasi, ma non fermarti a una semplice analisi o a un piano:

1. Audit del repository e confronto con la specifica.
2. Implementazione delle funzionalità mancanti.
3. Rifinitura grafica desktop e mobile.
4. Test funzionali, test automatici, TypeScript e build di produzione.
5. Correzione di tutti i problemi individuati.
6. Preparazione finale per il deploy Vercel.

Non chiedermi decisioni tecniche secondarie: scegli la soluzione più solida e coerente con il progetto.

Non eliminare test o funzionalità esistenti per far passare la build.

## Consegna finale

Quando hai terminato, produci un report con:

- Funzionalità completate.
- Funzionalità dimostrative e relativi limiti.
- Test eseguiti e risultati.
- Eventuali problemi residui, classificati per gravità.
- Modifiche architetturali e file principali modificati.
- Istruzioni esatte per pubblicare su Vercel.

Il lavoro è concluso soltanto quando la build di produzione è pulita e tutte le funzionalità essenziali sono state verificate.