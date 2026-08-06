import type { PublishedLocale } from "./ui";

const answers = {
	en: [
		{ value: "yes", label: "Yes" },
		{ value: "partly", label: "Partly" },
		{ value: "no", label: "No" },
		{ value: "unsure", label: "Not sure" }
	],
	it: [
		{ value: "yes", label: "Sì" },
		{ value: "partly", label: "In parte" },
		{ value: "no", label: "No" },
		{ value: "unsure", label: "Non saprei" }
	]
} as const;

export const diagnosticCopy = {
	en: {
		meta: {
			title: "Free Website & Ads Diagnostic | Intent & Proof",
			description: "Run a free acquisition diagnostic using PageSpeed data, commercial checks and optional Google Ads metrics to identify the most important leak in your lead-generation system.",
			canonical: "/diagnostic/"
		},
		hero: {
			eyebrow: "Free Acquisition Diagnostic",
			title: "Find where your website is losing demand.",
			intro: "Combine a live mobile PageSpeed scan, ten commercial checks and an optional Google Ads snapshot. The result identifies the strongest part of your acquisition system, the priority leak and the first action worth investigating.",
			note: "No account connection is required for this first release."
		},
		preview: {
			aria: "Example diagnostic result",
			label: "Example system score",
			mode: "Mobile scan",
			status: "Promising, but leaking",
			rows: [
				{ label: "Technical foundation", value: 82 },
				{ label: "Commercial readiness", value: 61 },
				{ label: "Ads efficiency", value: 54 }
			]
		},
		start: {
			eyebrow: "Start with the website",
			title: "Run the technical scan.",
			intro: "We use Google PageSpeed Insights to read mobile performance, SEO, accessibility and browser best-practice signals. The scan is combined with your answers rather than treated as an oracle carved into a Lighthouse report.",
			website: "Website address",
			businessType: "Business type",
			businessTypes: [
				{ value: "b2b", label: "B2B service business" },
				{ value: "practice", label: "Professional practice" },
				{ value: "local", label: "Local service business" },
				{ value: "consultancy", label: "Specialist consultancy" },
				{ value: "other", label: "Other" }
			],
			objective: "Primary objective",
			objectives: [
				{ value: "enquiries", label: "Generate more enquiries" },
				{ value: "lead-quality", label: "Improve lead quality" },
				{ value: "conversion", label: "Improve conversion rate" },
				{ value: "paid-search", label: "Improve paid search efficiency" },
				{ value: "measurement", label: "Improve measurement" }
			],
			urlError: "Enter a valid public website address.",
			run: "Run free diagnostic",
			status: "Usually takes 15–40 seconds, depending on Google and the target site."
		},
		assessment: {
			eyebrow: "Commercial readiness",
			title: "Add the context an API cannot see.",
			intro: "Answer from the perspective of a qualified first-time visitor. Ten checks are enough for a useful first model; nobody needs a 74-question free consultation wearing a progress bar.",
			answers: answers.en,
			questions: [
				{ category: "intent", name: "intentClarity", legend: "Can a first-time visitor understand who you help and the result you provide within a few seconds?" },
				{ category: "intent", name: "intentPages", legend: "Do priority services or offers have dedicated pages aligned with a specific buyer need?" },
				{ category: "proof", name: "proofEvidence", legend: "Does the site show concrete cases, outcomes, reviews, credentials or other credible evidence?" },
				{ category: "proof", name: "proofPlacement", legend: "Is proof placed beside the claims, offers and calls to action it is meant to support?" },
				{ category: "conversion", name: "conversionAction", legend: "Is there one obvious primary action on the pages that matter commercially?" },
				{ category: "conversion", name: "conversionFriction", legend: "Can a qualified visitor contact you without unnecessary fields, steps or uncertainty?" },
				{ category: "search", name: "searchRelevance", legend: "Do organic and paid landing pages match the query, location or service that brought the visitor?" },
				{ category: "search", name: "searchStructure", legend: "Are titles, headings and page structure built around real commercial demand rather than generic company language?" },
				{ category: "measurement", name: "measurementEvents", legend: "Are forms, calls, bookings or messaging clicks tracked as meaningful conversions?" },
				{ category: "measurement", name: "measurementSource", legend: "Can you connect enquiries and qualified leads back to their source or campaign?" }
			],
			usesAds: "Are you currently using Google Ads?",
			noAds: "No",
			yesAds: "Yes, include an Ads diagnostic",
			adsEyebrow: "Optional Google Ads snapshot",
			adsIntro: "Use one consistent recent period. The tool derives CTR, click-to-lead conversion, cost per lead and qualified-lead rate. These are diagnostic signals, not universal industry commandments.",
			adsFields: {
				impressions: "Impressions",
				clicks: "Clicks",
				spend: "Spend",
				leads: "Leads",
				qualified: "Qualified leads",
				targetCpl: "Target cost per lead",
				tracking: "Reliable conversion tracking?",
				terms: "Search terms reviewed regularly?",
				negatives: "Negative keywords maintained?",
				landing: "Dedicated relevant landing pages?"
			},
			questionError: "Complete all ten commercial checks before generating the score.",
			generate: "Generate my score"
		},
		results: {
			eyebrow: "Intent & Proof score",
			title: "Your diagnostic result",
			technical: "Technical foundation",
			technicalMeta: "PageSpeed mobile, SEO, accessibility and best practices.",
			commercial: "Commercial readiness",
			commercialMeta: "Intent, proof, conversion, search relevance and measurement.",
			ads: "Google Ads efficiency",
			adsMeta: "Optional efficiency, lead-quality and account-control signals.",
			signals: "Signals worth investigating",
			priority: "Priority leak:",
			contactTitle: "Turn the score into a professional diagnosis.",
			contactText: "Send the URL, scores and priority leak to Intent & Proof for a human review. The button opens a pre-filled email; nothing is stored automatically in this first release.",
			name: "Your name",
			email: "Work email",
			send: "Send result for review",
			copy: "Copy result",
			disclaimer: "This automated score is a first-pass diagnostic, not a guarantee of commercial performance. Recommendations identify areas to investigate, not causes proven without account and customer data."
		},
		client: {
			pageSpeedLocale: "en_GB",
			labels: {
				technical: "Technical foundation",
				intent: "Intent alignment",
				proof: "Proof strength",
				conversion: "Conversion path",
				search: "Search and Ads readiness",
				measurement: "Measurement integrity",
				ads: "Google Ads efficiency"
			},
			actions: {
				technical: "Fix the slowest mobile experience and the failed SEO audits before buying more traffic.",
				intent: "Build one priority page around a specific buyer, problem and desired outcome instead of a broad list of services.",
				proof: "Place quantified evidence, cases or credible reviews beside the main decision and conversion points.",
				conversion: "Reduce the primary path to one obvious action and remove unnecessary friction from the contact step.",
				search: "Align each high-intent query or campaign with a dedicated landing page and a precise offer.",
				measurement: "Track meaningful enquiries and connect them to their source before optimising spend or content.",
				ads: "Review search terms, query intent, conversion quality and landing-page relevance before changing bids or budgets."
			},
			bands: [
				{ minimum: 80, label: "Strong foundation" },
				{ minimum: 65, label: "Promising, but leaking" },
				{ minimum: 45, label: "Fragile acquisition system" },
				{ minimum: 0, label: "High-priority leaks" }
			],
			messages: {
				noLighthouse: "PageSpeed returned no Lighthouse result.",
				noCategories: "PageSpeed returned no scored categories.",
				partialScan: "Google returned a partial PageSpeed scan; the technical score uses only the available Lighthouse categories.",
				lowPerformance: "Mobile performance is likely suppressing conversion efficiency.",
				seoIssues: "The technical SEO foundation contains failed or incomplete checks.",
				bestPracticeIssues: "Browser, security or implementation best-practice issues need review.",
				accessibilityIssues: "Accessibility friction may also be creating usability friction.",
				missingTitle: "The page title is missing or inadequate.",
				missingDescription: "The meta description is missing or inadequate.",
				viewportIssue: "The mobile viewport is not configured correctly.",
				robotsIssue: "robots.txt contains a crawlability problem.",
				canonicalIssue: "The page has a canonicalisation problem.",
				requestFailed: "PageSpeed request failed ({status}).",
				timedOut: "PageSpeed timed out before completing the scan.",
				scanFailed: "PageSpeed scan failed.",
				lowCtr: "Low CTR suggests weak query-to-ad relevance, targeting or offer clarity.",
				lowConversion: "Low click-to-lead conversion points toward landing-page, proof or form friction.",
				highCpl: "Cost per lead is materially above the stated target.",
				lowLeadQuality: "Lead quality indicates weak search-intent control or insufficient qualification.",
				trackingWeak: "Conversion tracking is not strong enough to guide automated bidding or budget decisions.",
				termsWeak: "Search-term review is too weak to identify wasted or irrelevant demand.",
				negativesWeak: "Negative-keyword control is likely allowing avoidable spend.",
				landingWeak: "Traffic is not consistently sent to a dedicated, query-relevant landing page.",
				technicalExcluded: "The live technical scan was unavailable and was excluded from the total score.",
				strongestSummary: "Your strongest area is {strongest} ({strongestScore}/100). The priority leak is {priority} ({priorityScore}/100).",
				unavailable: "Unavailable",
				notIncluded: "Not included",
				noSignals: "No critical technical or Ads signal was detected in this first-pass scan.",
				running: "Running the mobile technical scan. Complete the commercial checks while it works.",
				complete: "Technical scan complete{partial}: {score}/100.",
				partial: " (partial data)",
				quota: "Google's anonymous PageSpeed quota is temporarily exhausted; the technical section was excluded from the score.",
				rejected: "Google rejected the anonymous PageSpeed request; the technical section was excluded from the score.",
				timeout: "Google PageSpeed timed out; the technical section was excluded from the score.",
				genericError: "Google PageSpeed did not complete the scan; the technical section was excluded from the score.",
				continue: "You can retry the scan or continue.",
				copied: "Result copied",
				copy: "Copy result",
				copyUnavailable: "Copy unavailable"
			},
			email: {
				title: "Intent & Proof Diagnostic",
				website: "Website",
				businessType: "Business type",
				objective: "Primary objective",
				total: "Total score",
				technical: "Technical score",
				commercial: "Commercial score",
				ads: "Ads score",
				priority: "Priority leak",
				action: "Recommended first action",
				request: "I would like a professional review of this result.",
				name: "Name",
				email: "Email",
				subject: "Intent & Proof diagnostic review"
			}
		}
	},
	it: {
		meta: {
			title: "Diagnostica gratuita di sito e campagne | Intent & Proof",
			description: "Esegui una diagnostica gratuita dell'acquisizione usando dati PageSpeed, verifiche commerciali e metriche Google Ads facoltative per individuare la dispersione più importante del sistema.",
			canonical: "/it/diagnostic/"
		},
		hero: {
			eyebrow: "Diagnostica gratuita dell'acquisizione",
			title: "Scopri dove il tuo sito sta perdendo domanda.",
			intro: "Combina una scansione PageSpeed mobile, dieci verifiche commerciali e un'analisi facoltativa di Google Ads. Il risultato individua la parte più solida del sistema, la dispersione prioritaria e la prima azione da approfondire.",
			note: "Per questa prima analisi non è necessario collegare alcun account."
		},
		preview: {
			aria: "Esempio di risultato diagnostico",
			label: "Esempio di punteggio del sistema",
			mode: "Scansione mobile",
			status: "Promettente, ma con dispersioni",
			rows: [
				{ label: "Fondamenta tecniche", value: 82 },
				{ label: "Preparazione commerciale", value: 61 },
				{ label: "Efficienza delle campagne", value: 54 }
			]
		},
		start: {
			eyebrow: "Inizia dal sito",
			title: "Esegui la scansione tecnica.",
			intro: "Utilizziamo Google PageSpeed Insights per leggere prestazioni mobile, SEO, accessibilità e buone pratiche del browser. La scansione viene combinata con le tue risposte, non trattata come un oracolo inciso in un rapporto Lighthouse.",
			website: "Indirizzo del sito",
			businessType: "Tipo di attività",
			businessTypes: [
				{ value: "b2b", label: "Impresa di servizi B2B" },
				{ value: "practice", label: "Studio professionale" },
				{ value: "local", label: "Attività di servizi locali" },
				{ value: "consultancy", label: "Consulenza specialistica" },
				{ value: "other", label: "Altro" }
			],
			objective: "Obiettivo principale",
			objectives: [
				{ value: "enquiries", label: "Generare più richieste" },
				{ value: "lead-quality", label: "Migliorare la qualità dei contatti" },
				{ value: "conversion", label: "Migliorare il tasso di conversione" },
				{ value: "paid-search", label: "Migliorare l'efficienza delle campagne" },
				{ value: "measurement", label: "Migliorare la misurazione" }
			],
			urlError: "Inserisci l'indirizzo valido di un sito pubblico.",
			run: "Esegui la diagnostica gratuita",
			status: "In genere richiede 15–40 secondi, in base a Google e al sito analizzato."
		},
		assessment: {
			eyebrow: "Preparazione commerciale",
			title: "Aggiungi il contesto che un'API non può vedere.",
			intro: "Rispondi dal punto di vista di un nuovo visitatore qualificato. Dieci verifiche bastano per un primo modello utile; nessuno ha bisogno di una consulenza gratuita di 74 domande travestita da barra di avanzamento.",
			answers: answers.it,
			questions: [
				{ category: "intent", name: "intentClarity", legend: "Un nuovo visitatore capisce in pochi secondi chi aiuti e quale risultato offri?" },
				{ category: "intent", name: "intentPages", legend: "I servizi o le offerte prioritarie hanno pagine dedicate a una specifica esigenza del cliente?" },
				{ category: "proof", name: "proofEvidence", legend: "Il sito mostra casi concreti, risultati, recensioni, credenziali o altre prove credibili?" },
				{ category: "proof", name: "proofPlacement", legend: "Le prove sono collocate accanto alle affermazioni, alle offerte e alle azioni che devono sostenere?" },
				{ category: "conversion", name: "conversionAction", legend: "Nelle pagine commercialmente importanti esiste un'azione principale evidente?" },
				{ category: "conversion", name: "conversionFriction", legend: "Un visitatore qualificato può contattarti senza campi, passaggi o incertezze inutili?" },
				{ category: "search", name: "searchRelevance", legend: "Le pagine di destinazione organiche e a pagamento corrispondono alla ricerca, alla località o al servizio che ha portato il visitatore?" },
				{ category: "search", name: "searchStructure", legend: "Titoli, intestazioni e struttura delle pagine sono costruiti sulla domanda commerciale reale anziché su formule aziendali generiche?" },
				{ category: "measurement", name: "measurementEvents", legend: "Moduli, chiamate, prenotazioni o clic sui messaggi vengono tracciati come conversioni significative?" },
				{ category: "measurement", name: "measurementSource", legend: "Riesci a collegare richieste e contatti qualificati alla loro fonte o campagna?" }
			],
			usesAds: "Stai utilizzando Google Ads?",
			noAds: "No",
			yesAds: "Sì, includi la diagnostica Ads",
			adsEyebrow: "Analisi facoltativa di Google Ads",
			adsIntro: "Usa un unico periodo recente e coerente. Lo strumento calcola CTR, conversione da clic a contatto, costo per contatto e quota di contatti qualificati. Sono segnali diagnostici, non comandamenti universali di settore.",
			adsFields: {
				impressions: "Impressioni",
				clicks: "Clic",
				spend: "Spesa",
				leads: "Contatti",
				qualified: "Contatti qualificati",
				targetCpl: "Costo obiettivo per contatto",
				tracking: "Il tracciamento delle conversioni è affidabile?",
				terms: "I termini di ricerca vengono controllati regolarmente?",
				negatives: "Le parole chiave negative vengono aggiornate?",
				landing: "Esistono landing page dedicate e pertinenti?"
			},
			questionError: "Completa tutte le dieci verifiche commerciali prima di generare il punteggio.",
			generate: "Genera il mio punteggio"
		},
		results: {
			eyebrow: "Punteggio Intent & Proof",
			title: "Il risultato della diagnostica",
			technical: "Fondamenta tecniche",
			technicalMeta: "PageSpeed mobile, SEO, accessibilità e buone pratiche.",
			commercial: "Preparazione commerciale",
			commercialMeta: "Intento, prove, conversione, pertinenza della ricerca e misurazione.",
			ads: "Efficienza di Google Ads",
			adsMeta: "Segnali facoltativi di efficienza, qualità dei contatti e controllo dell'account.",
			signals: "Segnali da approfondire",
			priority: "Dispersione prioritaria:",
			contactTitle: "Trasforma il punteggio in una diagnosi professionale.",
			contactText: "Invia URL, punteggi e dispersione prioritaria a Intent & Proof per una revisione umana. Il pulsante apre un'email precompilata; in questa prima versione non viene memorizzato nulla automaticamente.",
			name: "Il tuo nome",
			email: "Email di lavoro",
			send: "Invia il risultato per la revisione",
			copy: "Copia il risultato",
			disclaimer: "Questo punteggio automatico è una prima diagnostica, non una garanzia di prestazioni commerciali. Le raccomandazioni indicano aree da approfondire, non cause dimostrate senza dati dell'account e dei clienti."
		},
		client: {
			pageSpeedLocale: "it_IT",
			labels: {
				technical: "Fondamenta tecniche",
				intent: "Allineamento all'intento",
				proof: "Forza delle prove",
				conversion: "Percorso di conversione",
				search: "Preparazione per ricerca e campagne",
				measurement: "Integrità della misurazione",
				ads: "Efficienza di Google Ads"
			},
			actions: {
				technical: "Correggi l'esperienza mobile più lenta e gli errori SEO prima di acquistare altro traffico.",
				intent: "Costruisci una pagina prioritaria attorno a un cliente, un problema e un risultato specifici, invece di presentare un elenco generico di servizi.",
				proof: "Colloca risultati quantificati, casi o recensioni credibili accanto ai principali punti decisionali e di conversione.",
				conversion: "Riduci il percorso principale a un'azione evidente ed elimina gli attriti inutili dal contatto.",
				search: "Collega ogni ricerca o campagna ad alto intento a una landing page dedicata e a un'offerta precisa.",
				measurement: "Traccia le richieste significative e collegale alla fonte prima di ottimizzare spesa o contenuti.",
				ads: "Controlla termini di ricerca, intento, qualità delle conversioni e pertinenza delle landing page prima di modificare offerte o budget."
			},
			bands: [
				{ minimum: 80, label: "Fondamenta solide" },
				{ minimum: 65, label: "Promettente, ma con dispersioni" },
				{ minimum: 45, label: "Sistema di acquisizione fragile" },
				{ minimum: 0, label: "Dispersioni ad alta priorità" }
			],
			messages: {
				noLighthouse: "PageSpeed non ha restituito alcun risultato Lighthouse.",
				noCategories: "PageSpeed non ha restituito categorie con un punteggio.",
				partialScan: "Google ha restituito una scansione PageSpeed parziale; il punteggio tecnico usa soltanto le categorie Lighthouse disponibili.",
				lowPerformance: "Le prestazioni mobile probabilmente riducono l'efficienza della conversione.",
				seoIssues: "Le fondamenta SEO tecniche contengono verifiche non superate o incomplete.",
				bestPracticeIssues: "Vanno controllati problemi relativi a browser, sicurezza o buone pratiche di implementazione.",
				accessibilityIssues: "Gli attriti di accessibilità possono creare anche problemi di usabilità.",
				missingTitle: "Il titolo della pagina è assente o inadeguato.",
				missingDescription: "La meta description è assente o inadeguata.",
				viewportIssue: "Il viewport mobile non è configurato correttamente.",
				robotsIssue: "Il file robots.txt contiene un problema di scansione.",
				canonicalIssue: "La pagina presenta un problema di canonicalizzazione.",
				requestFailed: "La richiesta PageSpeed non è riuscita ({status}).",
				timedOut: "PageSpeed ha superato il tempo disponibile prima di completare la scansione.",
				scanFailed: "La scansione PageSpeed non è riuscita.",
				lowCtr: "Un CTR basso suggerisce scarsa pertinenza tra ricerca, annuncio, targeting o offerta.",
				lowConversion: "Una bassa conversione da clic a contatto indica possibili attriti nella landing page, nelle prove o nel modulo.",
				highCpl: "Il costo per contatto supera in modo significativo l'obiettivo indicato.",
				lowLeadQuality: "La qualità dei contatti indica un controllo debole dell'intento di ricerca o una qualificazione insufficiente.",
				trackingWeak: "Il tracciamento delle conversioni non è abbastanza solido per guidare offerte automatiche o decisioni di budget.",
				termsWeak: "Il controllo dei termini di ricerca è insufficiente per individuare domanda sprecata o irrilevante.",
				negativesWeak: "Il controllo delle parole chiave negative probabilmente consente spesa evitabile.",
				landingWeak: "Il traffico non viene inviato con regolarità a una landing page dedicata e pertinente alla ricerca.",
				technicalExcluded: "La scansione tecnica in tempo reale non era disponibile ed è stata esclusa dal punteggio totale.",
				strongestSummary: "L'area più solida è {strongest} ({strongestScore}/100). La dispersione prioritaria è {priority} ({priorityScore}/100).",
				unavailable: "Non disponibile",
				notIncluded: "Non incluso",
				noSignals: "Questa prima scansione non ha rilevato segnali tecnici o Ads critici.",
				running: "Scansione tecnica mobile in corso. Nel frattempo completa le verifiche commerciali.",
				complete: "Scansione tecnica completata{partial}: {score}/100.",
				partial: " (dati parziali)",
				quota: "La quota anonima di Google PageSpeed è temporaneamente esaurita; la sezione tecnica è stata esclusa dal punteggio.",
				rejected: "Google ha rifiutato la richiesta anonima a PageSpeed; la sezione tecnica è stata esclusa dal punteggio.",
				timeout: "Google PageSpeed ha superato il tempo disponibile; la sezione tecnica è stata esclusa dal punteggio.",
				genericError: "Google PageSpeed non ha completato la scansione; la sezione tecnica è stata esclusa dal punteggio.",
				continue: "Puoi riprovare la scansione oppure continuare.",
				copied: "Risultato copiato",
				copy: "Copia il risultato",
				copyUnavailable: "Copia non disponibile"
			},
			email: {
				title: "Diagnostica Intent & Proof",
				website: "Sito",
				businessType: "Tipo di attività",
				objective: "Obiettivo principale",
				total: "Punteggio totale",
				technical: "Punteggio tecnico",
				commercial: "Punteggio commerciale",
				ads: "Punteggio Ads",
				priority: "Dispersione prioritaria",
				action: "Prima azione consigliata",
				request: "Desidero una revisione professionale di questo risultato.",
				name: "Nome",
				email: "Email",
				subject: "Revisione diagnostica Intent & Proof"
			}
		}
	}
} as const satisfies Record<PublishedLocale, unknown>;

export type DiagnosticLocale = keyof typeof diagnosticCopy;
