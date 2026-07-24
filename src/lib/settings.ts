import { getEntry } from "astro:content";
import type { GlobalSettings } from "../content/schemas/settings";

const fallbackSettings: GlobalSettings = {
	site: {
		brand: "Intent & Proof",
		baseUrl: "https://www.intentandproof.com",
		country: "IT",
		defaultLocale: "en"
	},
	tracking: {
		enabled: false,
		debug: false,
		delivery: "direct",
		consentModeEnabled: true,
		defaultConsent: {
			ad_storage: "granted",
			ad_user_data: "granted",
			ad_personalization: "granted",
			analytics_storage: "granted",
			functionality_storage: "granted",
			security_storage: "granted"
		},
		googleTagManager: { enabled: false, containerId: "" },
		googleAnalytics4: { enabled: false, measurementId: "" },
		googleAds: { enabled: false, conversionId: "", defaultConversionLabel: "" },
		metaPixel: { enabled: false, pixelId: "" },
		events: {
			ctaClick: "cta_click",
			phoneClick: "phone_click",
			whatsappClick: "whatsapp_click",
			emailClick: "email_click",
			formSubmit: "form_submit",
			emailSignup: "sign_up",
			generateLead: "generate_lead",
			thankYouView: "thank_you_view"
		}
	},
	trackingNotice: {
		enabled: false,
		storageKey: "intent-proof-tracking-notice",
		expiryDays: 180,
		en: {
			title: "Analytics notice",
			text: "This site uses analytics technologies.",
			dismissLabel: "Got it",
			privacyLabel: "Privacy information",
			privacyHref: "/privacy/"
		},
		it: {
			title: "Informativa analytics",
			text: "Questo sito utilizza tecnologie di analisi.",
			dismissLabel: "Ho capito",
			privacyLabel: "Informativa privacy",
			privacyHref: "/it/privacy/"
		}
	},
	forms: { handlers: [] },
	thankYou: {
		en: {
			eyebrow: "Request received",
			title: "Thank you.",
			text: "Your information has been received.",
			nextStepsTitle: "What happens next",
			nextSteps: ["We review the information."],
			primaryLabel: "Read the latest research",
			primaryHref: "/blog/",
			secondaryLabel: "Return home",
			secondaryHref: "/"
		},
		it: {
			eyebrow: "Richiesta ricevuta",
			title: "Grazie.",
			text: "Le informazioni sono state ricevute.",
			nextStepsTitle: "Cosa succede ora",
			nextSteps: ["Esaminiamo le informazioni."],
			primaryLabel: "Leggi gli ultimi articoli",
			primaryHref: "/it/blog/",
			secondaryLabel: "Torna alla home",
			secondaryHref: "/"
		}
	}
};

let cachedSettings: GlobalSettings | null = null;

export async function getGlobalSettings(): Promise<GlobalSettings> {
	if (cachedSettings) return cachedSettings;

	const entry = await getEntry("settings", "global");
	cachedSettings = (entry?.data as GlobalSettings | undefined) ?? fallbackSettings;
	return cachedSettings;
}

export type FormHandler = GlobalSettings["forms"]["handlers"][number];

export function resolveFormHandler(
	settings: GlobalSettings,
	handlerId: string,
	purpose?: FormHandler["purpose"]
): FormHandler | undefined {
	return settings.forms.handlers.find((handler) => handler.id === handlerId)
		?? settings.forms.handlers.find((handler) => purpose && handler.purpose === purpose);
}

export function localizedPath(handler: FormHandler | undefined, locale: "en" | "it"): string {
	if (!handler) return locale === "it" ? "/it/grazie/" : "/thank-you/";
	return locale === "it" ? handler.successPathIt : handler.successPathEn;
}

export function isTrackingConfigured(settings: GlobalSettings): boolean {
	const tracking = settings.tracking;
	if (!tracking.enabled) return false;

	return Boolean(
		(tracking.delivery === "gtm" && tracking.googleTagManager.enabled && tracking.googleTagManager.containerId)
		|| (tracking.googleAnalytics4.enabled && tracking.googleAnalytics4.measurementId)
		|| (tracking.googleAds.enabled && tracking.googleAds.conversionId)
		|| (tracking.metaPixel.enabled && tracking.metaPixel.pixelId)
	);
}
