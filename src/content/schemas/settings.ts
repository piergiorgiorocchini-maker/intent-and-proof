import { z } from "astro/zod";
import { localeSchema, slugSchema } from "./shared";

const consentStateSchema = z.enum(["granted", "denied"]);

const localizedNoticeSchema = z.object({
	title: z.string().min(1),
	text: z.string().min(1),
	dismissLabel: z.string().min(1),
	privacyLabel: z.string().optional(),
	privacyHref: z.string().optional()
});

const localizedThankYouSchema = z.object({
	eyebrow: z.string().min(1),
	title: z.string().min(1),
	text: z.string().min(1),
	nextStepsTitle: z.string().min(1),
	nextSteps: z.array(z.string()).min(1),
	primaryLabel: z.string().min(1),
	primaryHref: z.string().min(1),
	secondaryLabel: z.string().min(1),
	secondaryHref: z.string().min(1)
});

const formHandlerSchema = z.object({
	id: slugSchema,
	label: z.string().min(1),
	enabled: z.boolean().default(false),
	purpose: z.enum(["newsletter", "diagnostic", "contact", "download", "lead"]).default("lead"),
	provider: z.enum(["disabled", "custom", "mailchimp", "brevo", "convertkit"]).default("disabled"),
	endpoint: z.string().default(""),
	method: z.enum(["get", "post"]).default("post"),
	submissionMode: z.enum(["native", "fetch"]).default("native"),
	successMode: z.enum(["inline", "redirect"]).default("redirect"),
	successPathEn: z.string().default("/thank-you/"),
	successPathIt: z.string().default("/it/grazie/"),
	redirectFieldName: z.string().optional(),
	eventName: z.string().default("generate_lead"),
	hiddenFields: z.array(z.object({
		name: z.string().min(1),
		value: z.string()
	})).default([])
});

export const globalSettingsSchema = z.object({
	site: z.object({
		brand: z.string().default("Intent & Proof"),
		baseUrl: z.url().default("https://www.intentandproof.com"),
		country: z.string().default("IT"),
		defaultLocale: localeSchema.default("en")
	}).default({
		brand: "Intent & Proof",
		baseUrl: "https://www.intentandproof.com",
		country: "IT",
		defaultLocale: "en"
	}),
	tracking: z.object({
		enabled: z.boolean().default(true),
		debug: z.boolean().default(false),
		delivery: z.enum(["direct", "gtm"]).default("direct"),
		consentModeEnabled: z.boolean().default(true),
		defaultConsent: z.object({
			ad_storage: consentStateSchema.default("granted"),
			ad_user_data: consentStateSchema.default("granted"),
			ad_personalization: consentStateSchema.default("granted"),
			analytics_storage: consentStateSchema.default("granted"),
			functionality_storage: consentStateSchema.default("granted"),
			security_storage: consentStateSchema.default("granted")
		}).default({
			ad_storage: "granted",
			ad_user_data: "granted",
			ad_personalization: "granted",
			analytics_storage: "granted",
			functionality_storage: "granted",
			security_storage: "granted"
		}),
		googleTagManager: z.object({
			enabled: z.boolean().default(false),
			containerId: z.string().default("")
		}).default({ enabled: false, containerId: "" }),
		googleAnalytics4: z.object({
			enabled: z.boolean().default(false),
			measurementId: z.string().default("")
		}).default({ enabled: false, measurementId: "" }),
		googleAds: z.object({
			enabled: z.boolean().default(false),
			conversionId: z.string().default(""),
			defaultConversionLabel: z.string().default("")
		}).default({ enabled: false, conversionId: "", defaultConversionLabel: "" }),
		metaPixel: z.object({
			enabled: z.boolean().default(false),
			pixelId: z.string().default("")
		}).default({ enabled: false, pixelId: "" }),
		events: z.object({
			ctaClick: z.string().default("cta_click"),
			phoneClick: z.string().default("phone_click"),
			whatsappClick: z.string().default("whatsapp_click"),
			emailClick: z.string().default("email_click"),
			formSubmit: z.string().default("form_submit"),
			emailSignup: z.string().default("sign_up"),
			generateLead: z.string().default("generate_lead"),
			thankYouView: z.string().default("thank_you_view")
		}).default({
			ctaClick: "cta_click",
			phoneClick: "phone_click",
			whatsappClick: "whatsapp_click",
			emailClick: "email_click",
			formSubmit: "form_submit",
			emailSignup: "sign_up",
			generateLead: "generate_lead",
			thankYouView: "thank_you_view"
		})
	}).default({
		enabled: true,
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
	}),
	trackingNotice: z.object({
		enabled: z.boolean().default(true),
		storageKey: z.string().default("intent-proof-tracking-notice"),
		expiryDays: z.number().int().positive().default(180),
		en: localizedNoticeSchema,
		it: localizedNoticeSchema
	}),
	forms: z.object({
		handlers: z.array(formHandlerSchema).default([])
	}).default({ handlers: [] }),
	thankYou: z.object({
		en: localizedThankYouSchema,
		it: localizedThankYouSchema
	})
});

export type GlobalSettings = z.infer<typeof globalSettingsSchema>;
