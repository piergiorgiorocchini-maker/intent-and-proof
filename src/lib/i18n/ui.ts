export const publishedLocales = ["en", "it"] as const;
export const plannedLocales = ["ro"] as const;

export type PublishedLocale = (typeof publishedLocales)[number];
export type PlannedLocale = (typeof plannedLocales)[number];
export type KnownLocale = PublishedLocale | PlannedLocale;

export const localeMetadata: Record<KnownLocale, {
	name: string;
	intl: string;
	og: string;
	prefix: string;
}> = {
	en: { name: "English", intl: "en-GB", og: "en_GB", prefix: "" },
	it: { name: "Italiano", intl: "it-IT", og: "it_IT", prefix: "/it" },
	ro: { name: "Română", intl: "ro-RO", og: "ro_RO", prefix: "/ro" }
};

export function resolvePublishedLocale(value?: string): PublishedLocale {
	return value === "it" ? "it" : "en";
}

export const uiCopy = {
	en: {
		base: {
			skipLink: "Skip to content"
		},
		routes: {
			home: "/",
			services: "/#services",
			solutions: "/#solutions",
			blog: "/blog/",
			caseStudies: "/blog/category/case-studies/",
			about: "/about/",
			diagnostic: "/diagnostic/",
			products: "/products/",
			localAuthority: "/products/local-authority-engine/",
			leadGuide: "/blog/local-service-lead-generation/",
			privacy: "/privacy/"
		},
		header: {
			brandHome: "Intent & Proof home",
			mainNavigation: "Main navigation",
			primaryActions: "Primary actions",
			mobileNavigation: "Mobile navigation",
			openNavigation: "Open navigation",
			changeLanguage: "Change language",
			languageSelection: "Language selection",
			language: "Language",
			about: "About",
			diagnostic: "Request diagnostic",
			navigation: [
				{ label: "Services", route: "services" },
				{ label: "Who we help", route: "solutions" },
				{ label: "Case Studies", route: "caseStudies" },
				{ label: "Research", route: "blog" }
			]
		},
		footer: {
			ctaEyebrow: "Start with a diagnostic",
			ctaTitle: "Find where your business is losing demand.",
			ctaText: "We examine how your website captures intent, builds trust, creates action and measures the outcome, then identify what should be fixed first.",
			ctaPrimary: "Request a Diagnostic",
			ctaSecondary: "View Case Studies",
			tagline: "Measurable customer acquisition systems for service businesses, connecting search, websites, proof, conversion and tracking.",
			social: "Social channels",
			socialPlaceholder: "profile coming soon",
			navigationLabel: "Footer navigation",
			trackingNotice: "Analytics notice",
			columns: [
				{
					title: "System",
					links: [
						{ label: "Diagnostic", route: "diagnostic" },
						{ label: "Services", route: "services" },
						{ label: "Local Authority Engine", route: "localAuthority" }
					]
				},
				{
					title: "Proof",
					links: [
						{ label: "Case Studies", route: "caseStudies" },
						{ label: "Local SEO Research", route: "blog" }
					]
				},
				{
					title: "Research",
					links: [
						{ label: "Latest Research", route: "blog" },
						{ label: "Lead Generation Guide", route: "leadGuide" },
						{ label: "Research Notes", special: "researchEmail" }
					]
				},
				{
					title: "Company",
					links: [
						{ label: "About", route: "about" },
						{ label: "Contact", special: "contactEmail" },
						{ label: "Analytics notice", special: "trackingNotice" }
					]
				}
			],
			rights: "All rights reserved.",
			method: "Intent → Proof → Action → Measurement"
		},
		article: {
			defaultTitle: "Intent & Proof Growth Guide",
			defaultDescription: "Practical growth systems for service businesses.",
			defaultEyebrow: "Growth Guide",
			defaultAuthorRole: "Founder, analyst and acquisition-system operator",
			defaultAuthorBio: "Piergiorgio Rocchini combines financial analysis, market research and hands-on customer acquisition systems built in live service markets.",
			defaultImageAlt: "Intent & Proof editorial guide visual",
			portraitSuffix: "portrait",
			ctaEyebrow: "Intent & Proof Audit",
			ctaTitle: "Want to find the weak points in your website?",
			ctaText: "Get a practical audit of your SEO, landing page, tracking and lead path before spending more on traffic.",
			ctaLabel: "Check My Site",
			sidebarEyebrow: "Free diagnostic",
			sidebarTitle: "Find the first commercial leak worth fixing.",
			sidebarText: "A focused review of intent, proof, conversion and measurement before more budget is committed.",
			sidebarLabel: "Request diagnostic",
			breadcrumbs: [
				{ href: "/", label: "Home" },
				{ href: "/blog/", label: "Research" }
			],
			toc: [
				{ href: "#overview", label: "Overview" },
				{ href: "#system", label: "The system" },
				{ href: "#checklist", label: "Checklist" },
				{ href: "#faq", label: "FAQ" }
			],
			mobileAction: "Recommended action",
			navigation: "Article navigation",
			actionAndSharing: "Recommended action and sharing",
			topics: "Article topics",
			editedBy: "Edited by",
			publicationInformation: "Publication information",
			updated: "Updated",
			breadcrumb: "Breadcrumb",
			share: "Share",
			shareLinkedIn: "Share on LinkedIn",
			shareX: "Share on X",
			copyLink: "Copy article link",
			openCanonical: "Open canonical article link",
			relatedEyebrow: "Related research",
			relatedTitle: "Continue from here.",
			relatedText: "The most recent and relevant articles are selected automatically during the build.",
			relatedTopicTitle: "More research on this topic.",
			relatedTopicText: "An automatic selection of the most recent and relevant articles.",
			relatedAll: "View all research"
		}
	},
	it: {
		base: {
			skipLink: "Vai al contenuto"
		},
		routes: {
			home: "/it/",
			services: "/it/#services",
			solutions: "/it/#solutions",
			blog: "/it/blog/",
			caseStudies: "/it/blog/",
			about: "/it/chi-siamo/",
			diagnostic: "/it/diagnostic/",
			products: "/it/prodotti/",
			localAuthority: "/it/prodotti/seo-locale-attivita/",
			leadGuide: "/it/blog/",
			privacy: "/it/privacy/"
		},
		header: {
			brandHome: "Home di Intent & Proof",
			mainNavigation: "Navigazione principale",
			primaryActions: "Azioni principali",
			mobileNavigation: "Navigazione mobile",
			openNavigation: "Apri la navigazione",
			changeLanguage: "Cambia lingua",
			languageSelection: "Selezione lingua",
			language: "Lingua",
			about: "Chi siamo",
			diagnostic: "Richiedi diagnosi",
			navigation: [
				{ label: "Servizi", route: "services" },
				{ label: "Per chi lavoriamo", route: "solutions" },
				{ label: "Casi studio", route: "caseStudies" },
				{ label: "Approfondimenti", route: "blog" }
			]
		},
		footer: {
			ctaEyebrow: "Inizia dalla diagnostica",
			ctaTitle: "Scopri dove la tua attività sta perdendo domanda.",
			ctaText: "Esaminiamo come il sito intercetta l'intento, costruisce fiducia, genera azioni e misura i risultati, quindi individuiamo cosa correggere per primo.",
			ctaPrimary: "Richiedi una diagnostica",
			ctaSecondary: "Vedi i casi studio",
			tagline: "Sistemi misurabili di acquisizione clienti per imprese di servizi, collegando ricerca, siti, prove, conversione e tracciamento.",
			social: "Canali social",
			socialPlaceholder: "profilo in preparazione",
			navigationLabel: "Navigazione del footer",
			trackingNotice: "Informativa analytics",
			columns: [
				{
					title: "Sistema",
					links: [
						{ label: "Diagnostica", route: "diagnostic" },
						{ label: "Servizi", route: "services" },
						{ label: "Sistema di autorevolezza locale", route: "localAuthority" }
					]
				},
				{
					title: "Prove",
					links: [
						{ label: "Casi studio", route: "caseStudies" },
						{ label: "Ricerca sulla SEO locale", route: "blog" }
					]
				},
				{
					title: "Approfondimenti",
					links: [
						{ label: "Ultimi articoli", route: "blog" },
						{ label: "Guide alla generazione di contatti", route: "leadGuide" },
						{ label: "Note di ricerca", special: "researchEmail" }
					]
				},
				{
					title: "Azienda",
					links: [
						{ label: "Chi siamo", route: "about" },
						{ label: "Contatti", special: "contactEmail" },
						{ label: "Informativa analytics", special: "trackingNotice" }
					]
				}
			],
			rights: "Tutti i diritti riservati.",
			method: "Intento → Prova → Azione → Misurazione"
		},
		article: {
			defaultTitle: "Guida alla crescita di Intent & Proof",
			defaultDescription: "Sistemi pratici di crescita per imprese di servizi.",
			defaultEyebrow: "Guida alla crescita",
			defaultAuthorRole: "Fondatore, analista e progettista di sistemi di acquisizione",
			defaultAuthorBio: "Piergiorgio Rocchini unisce analisi finanziaria, ricerca di mercato e sistemi di acquisizione clienti costruiti e verificati in attività di servizi reali.",
			defaultImageAlt: "Immagine editoriale di Intent & Proof",
			portraitSuffix: "ritratto",
			ctaEyebrow: "Analisi Intent & Proof",
			ctaTitle: "Vuoi individuare i punti deboli del tuo sito?",
			ctaText: "Ottieni un'analisi pratica di SEO, landing page, tracciamento e percorso dei contatti prima di investire altro traffico.",
			ctaLabel: "Analizza il mio sito",
			sidebarEyebrow: "Diagnostica gratuita",
			sidebarTitle: "Individua la prima dispersione commerciale da correggere.",
			sidebarText: "Una verifica mirata di intento, prove, conversione e misurazione prima di impegnare altro budget.",
			sidebarLabel: "Richiedi la diagnostica",
			breadcrumbs: [
				{ href: "/it/", label: "Home" },
				{ href: "/it/blog/", label: "Approfondimenti" }
			],
			toc: [
				{ href: "#overview", label: "Panoramica" },
				{ href: "#system", label: "Il sistema" },
				{ href: "#checklist", label: "Lista di controllo" },
				{ href: "#faq", label: "FAQ" }
			],
			mobileAction: "Azione consigliata",
			navigation: "Navigazione dell'articolo",
			actionAndSharing: "Azione consigliata e condivisione",
			topics: "Argomenti dell'articolo",
			editedBy: "A cura di",
			publicationInformation: "Informazioni sulla pubblicazione",
			updated: "Aggiornato",
			breadcrumb: "Percorso di navigazione",
			share: "Condividi",
			shareLinkedIn: "Condividi su LinkedIn",
			shareX: "Condividi su X",
			copyLink: "Copia il link dell'articolo",
			openCanonical: "Apri il link canonico dell'articolo",
			relatedEyebrow: "Approfondimenti correlati",
			relatedTitle: "Continua da qui.",
			relatedText: "Gli articoli più recenti e pertinenti vengono selezionati automaticamente durante la build.",
			relatedTopicTitle: "Altri approfondimenti sul tema.",
			relatedTopicText: "Una selezione automatica degli articoli più recenti e pertinenti.",
			relatedAll: "Vedi tutti gli articoli"
		}
	}
} as const;

export type UiCopy = (typeof uiCopy)[PublishedLocale];
