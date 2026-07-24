import { z } from "astro/zod";
import {
	actionSchema,
	faqSchema,
	imageSchema,
	slugSchema,
	toneSchema
} from "./shared";

export const commercialHeroSchema = z.object({
	eyebrow: z.string().optional(),
	badge: z.string().optional(),
	title: z.string().min(1),
	text: z.string().min(1),
	primaryAction: actionSchema,
	secondaryAction: actionSchema.optional(),
	microcopy: z.array(z.string()).default([]),
	media: z.object({
		type: z.enum(["image", "video", "interface"]).default("image"),
		src: z.string().min(1),
		alt: z.string().min(1),
		poster: z.string().optional(),
		caption: z.string().optional(),
		position: z.string().default("center")
	}).optional(),
	layout: z.enum(["split", "centered", "visual-first"]).default("split"),
	tone: toneSchema.default("navy")
});

const commercialBlockBase = z.object({
	id: slugSchema,
	visible: z.boolean().default(true),
	tone: toneSchema.default("light"),
	eyebrow: z.string().optional(),
	title: z.string().optional(),
	text: z.string().optional()
});

const trustBlockSchema = commercialBlockBase.extend({
	type: z.literal("trust"),
	items: z.array(z.object({
		name: z.string().min(1),
		label: z.string().optional(),
		logo: imageSchema.optional(),
		metric: z.string().optional(),
		href: z.string().optional()
	})).min(1),
	note: z.string().optional()
});

const problemBlockSchema = commercialBlockBase.extend({
	type: z.literal("problem"),
	costTitle: z.string().optional(),
	costs: z.array(z.object({
		title: z.string().min(1),
		text: z.string().min(1),
		icon: z.string().optional()
	})).min(1),
	action: actionSchema.optional()
});

const outcomesBlockSchema = commercialBlockBase.extend({
	type: z.literal("outcomes"),
	columns: z.number().int().min(2).max(4).default(3),
	items: z.array(z.object({
		title: z.string().min(1),
		text: z.string().min(1),
		metric: z.string().optional(),
		icon: z.string().optional(),
		action: actionSchema.optional()
	})).min(1)
});

const processBlockSchema = commercialBlockBase.extend({
	type: z.literal("process"),
	steps: z.array(z.object({
		number: z.string().optional(),
		title: z.string().min(1),
		text: z.string().min(1),
		deliverables: z.array(z.string()).default([])
	})).min(1),
	media: imageSchema.optional(),
	action: actionSchema.optional()
});

const featureBlockSchema = commercialBlockBase.extend({
	type: z.literal("feature"),
	layout: z.enum(["media-left", "media-right", "centered"]).default("media-right"),
	bullets: z.array(z.string()).default([]),
	media: imageSchema.optional(),
	action: actionSchema.optional(),
	proof: z.string().optional()
});

const metricsBlockSchema = commercialBlockBase.extend({
	type: z.literal("metrics"),
	items: z.array(z.object({
		value: z.string().min(1),
		label: z.string().min(1),
		detail: z.string().optional()
	})).min(1),
	note: z.string().optional(),
	sourceLabel: z.string().optional(),
	sourceHref: z.string().optional()
});

const testimonialBlockSchema = commercialBlockBase.extend({
	type: z.literal("testimonial"),
	quote: z.string().min(1),
	name: z.string().min(1),
	role: z.string().min(1),
	company: z.string().optional(),
	image: imageSchema.optional(),
	logo: imageSchema.optional(),
	result: z.string().optional(),
	action: actionSchema.optional()
});

const caseStudyBlockSchema = commercialBlockBase.extend({
	type: z.literal("case-study"),
	client: z.string().min(1),
	challenge: z.string().optional(),
	approach: z.string().optional(),
	results: z.array(z.object({
		value: z.string().min(1),
		label: z.string().min(1)
	})).default([]),
	media: imageSchema.optional(),
	action: actionSchema.optional()
});

const audienceBlockSchema = commercialBlockBase.extend({
	type: z.literal("audience"),
	fitTitle: z.string().min(1),
	fitItems: z.array(z.string()).min(1),
	notFitTitle: z.string().min(1),
	notFitItems: z.array(z.string()).min(1),
	note: z.string().optional()
});

const integrationsBlockSchema = commercialBlockBase.extend({
	type: z.literal("integrations"),
	items: z.array(z.object({
		name: z.string().min(1),
		description: z.string().optional(),
		logo: imageSchema.optional(),
		href: z.string().optional()
	})).min(1),
	note: z.string().optional(),
	action: actionSchema.optional()
});

const pricingBlockSchema = commercialBlockBase.extend({
	type: z.literal("pricing"),
	currencyNote: z.string().optional(),
	plans: z.array(z.object({
		name: z.string().min(1),
		eyebrow: z.string().optional(),
		price: z.string().min(1),
		frequency: z.string().optional(),
		description: z.string().min(1),
		features: z.array(z.string()).default([]),
		action: actionSchema,
		highlighted: z.boolean().default(false),
		badge: z.string().optional()
	})).min(1),
	note: z.string().optional()
});

const riskBlockSchema = commercialBlockBase.extend({
	type: z.literal("risk-reversal"),
	commitments: z.array(z.object({
		title: z.string().min(1),
		text: z.string().min(1)
	})).min(1),
	action: actionSchema.optional(),
	microcopy: z.array(z.string()).default([])
});

const commercialFaqBlockSchema = commercialBlockBase.extend({
	type: z.literal("faq"),
	items: z.array(faqSchema).min(1),
	contactText: z.string().optional(),
	contactAction: actionSchema.optional()
});

const leadFormBlockSchema = commercialBlockBase.extend({
	type: z.literal("lead-form"),
	formName: z.string().min(1),
	action: z.string().default("#"),
	method: z.enum(["get", "post"]).default("post"),
	fields: z.array(z.object({
		name: slugSchema,
		label: z.string().min(1),
		type: z.enum(["text", "email", "url", "tel", "textarea", "select"]).default("text"),
		placeholder: z.string().optional(),
		required: z.boolean().default(false),
		options: z.array(z.string()).default([]),
		autocomplete: z.string().optional()
	})).min(1),
	buttonLabel: z.string().min(1),
	note: z.string().optional(),
	privacyText: z.string().optional(),
	successMessage: z.string().optional()
});

const contactBlockSchema = commercialBlockBase.extend({
	type: z.literal("contact"),
	items: z.array(z.object({
		type: z.enum(["email", "phone", "whatsapp", "calendar", "form", "location"]),
		label: z.string().min(1),
		value: z.string().min(1),
		href: z.string().optional(),
		description: z.string().optional(),
		availability: z.string().optional()
	})).min(1)
});

const finalCtaBlockSchema = commercialBlockBase.extend({
	type: z.literal("final-cta"),
	primaryAction: actionSchema,
	secondaryAction: actionSchema.optional(),
	microcopy: z.array(z.string()).default([]),
	media: imageSchema.optional()
});

export const commercialSectionSchema = z.discriminatedUnion("type", [
	trustBlockSchema,
	problemBlockSchema,
	outcomesBlockSchema,
	processBlockSchema,
	featureBlockSchema,
	metricsBlockSchema,
	testimonialBlockSchema,
	caseStudyBlockSchema,
	audienceBlockSchema,
	integrationsBlockSchema,
	pricingBlockSchema,
	riskBlockSchema,
	commercialFaqBlockSchema,
	leadFormBlockSchema,
	contactBlockSchema,
	finalCtaBlockSchema
]);
