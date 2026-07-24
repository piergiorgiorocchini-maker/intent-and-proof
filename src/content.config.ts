import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const slugSchema = z
	.string()
	.min(1)
	.regex(
		/^[a-z0-9]+(?:[/-][a-z0-9]+)*$/,
		"Use lowercase letters, numbers, hyphens and optional path separators only."
	);

const localeSchema = z.enum(["en", "it"]);
const toneSchema = z.enum(["light", "navy", "mint", "cobalt", "orange", "neutral"]);

const imageSchema = z.object({
	src: z.string().min(1),
	alt: z.string().min(1),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional(),
	caption: z.string().optional(),
	credit: z.string().optional(),
	position: z.string().default("center"),
	loading: z.enum(["eager", "lazy"]).default("lazy")
});

const linkSchema = z.object({
	label: z.string().min(1),
	href: z.string().min(1)
});

const actionSchema = linkSchema.extend({
	style: z.enum(["primary", "secondary", "outline", "text", "dark"]).default("primary"),
	trackingId: z.string().optional(),
	newTab: z.boolean().default(false)
});

const ctaSchema = z.object({
	eyebrow: z.string().optional(),
	title: z.string().min(1),
	text: z.string().min(1),
	label: z.string().min(1),
	href: z.string().min(1),
	style: z.enum(["primary", "secondary", "dark"]).default("primary")
});

const seoSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	canonicalUrl: z.url().optional(),
	image: imageSchema.optional(),
	noIndex: z.boolean().default(false),
	noFollow: z.boolean().default(false)
});

const heroSchema = z.object({
	layout: z.enum(["split", "background", "text-only"]).default("split"),
	tone: z.enum(["aurora", "navy", "light", "mint"]).default("aurora"),
	image: imageSchema.optional(),
	imagePosition: z.string().default("center"),
	videoUrl: z.url().optional()
});

const commentsSchema = z.object({
	enabled: z.boolean().default(false),
	provider: z.literal("giscus").default("giscus"),
	repo: z.string().optional(),
	repoId: z.string().optional(),
	category: z.string().default("General"),
	categoryId: z.string().optional(),
	mapping: z.enum(["pathname", "url", "title", "og:title", "specific", "number"]).default("pathname"),
	theme: z.string().default("preferred_color_scheme"),
	lang: z.string().default("en")
});

const faqSchema = z.object({
	question: z.string().min(1),
	answer: z.string().min(1)
});

const commercialHeroSchema = z.object({
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

const commercialSectionSchema = z.discriminatedUnion("type", [
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

const authors = defineCollection({
	loader: glob({ base: "./src/content/authors", pattern: "**/*.md" }),
	schema: z.object({
		name: z.string().min(1),
		slug: slugSchema,
		role: z.string().min(1),
		shortBio: z.string().min(1),
		image: imageSchema.optional(),
		expertise: z.array(z.string()).default([]),
		links: z.array(linkSchema).default([]),
		active: z.boolean().default(true),
		order: z.number().int().nonnegative().default(0),
		seo: seoSchema.optional()
	})
});

const categories = defineCollection({
	loader: glob({ base: "./src/content/categories", pattern: "**/*.md" }),
	schema: z.object({
		name: z.string().min(1),
		slug: slugSchema,
		description: z.string().min(1),
		eyebrow: z.string().default("Research"),
		tone: z.enum(["navy", "cobalt", "mint", "orange", "neutral"]).default("navy"),
		featured: z.boolean().default(false),
		order: z.number().int().nonnegative().default(0),
		seo: seoSchema.optional()
	})
});

const articles = defineCollection({
	loader: glob({ base: "./src/content/articles", pattern: "**/*.md" }),
	schema: z.object({
		title: z.string().min(1),
		slug: slugSchema,
		description: z.string().min(1),
		eyebrow: z.string().default("Growth Guide"),
		draft: z.boolean().default(true),
		featured: z.boolean().default(false),
		publishedDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		readTime: z.string().default("8 min read"),
		author: reference("authors"),
		editor: reference("authors").optional(),
		category: reference("categories"),
		tags: z.array(z.string()).default([]),
		keyTakeaways: z.array(z.string()).default([]),
		faqs: z.array(faqSchema).default([]),
		relatedArticles: z.array(slugSchema).default([]),
		layout: z.enum(["editorial-wide", "editorial-standard"]).default("editorial-wide"),
		hero: heroSchema.default({
			layout: "split",
			tone: "aurora",
			imagePosition: "center"
		}),
		showDescription: z.boolean().default(true),
		showToc: z.boolean().default(true),
		showShare: z.boolean().default(true),
		showSidebarCta: z.boolean().default(true),
		sidebarCta: ctaSchema.optional(),
		footerCta: ctaSchema.optional(),
		comments: commentsSchema.optional(),
		seo: seoSchema.optional()
	})
});

const pages = defineCollection({
	loader: glob({ base: "./src/content/pages", pattern: "**/*.md" }),
	schema: z.object({
		title: z.string().min(1),
		slug: slugSchema,
		description: z.string().min(1),
		draft: z.boolean().default(true),
		template: z
			.enum(["foundation", "service", "landing", "legal", "standard"])
			.default("standard"),
		order: z.number().int().nonnegative().default(0),
		hero: z.object({
			eyebrow: z.string().optional(),
			title: z.string().optional(),
			text: z.string().optional(),
			image: imageSchema.optional(),
			primaryAction: linkSchema.optional(),
			secondaryAction: linkSchema.optional()
		}).optional(),
		cta: ctaSchema.optional(),
		seo: seoSchema.optional()
	})
});

const products = defineCollection({
	loader: glob({ base: "./src/content/products", pattern: "**/*.md" }),
	schema: z.object({
		locale: localeSchema,
		translationKey: slugSchema,
		title: z.string().min(1),
		productName: z.string().min(1),
		navigationLabel: z.string().optional(),
		slug: slugSchema,
		description: z.string().min(1),
		draft: z.boolean().default(true),
		featured: z.boolean().default(false),
		order: z.number().int().nonnegative().default(0),
		productType: z.enum(["system", "service", "platform", "diagnostic"]).default("system"),
		accent: z.enum(["mint", "cobalt", "orange", "navy"]).default("mint"),
		updatedDate: z.coerce.date().optional(),
		breadcrumbs: z.array(linkSchema).default([]),
		hero: commercialHeroSchema,
		sections: z.array(commercialSectionSchema).default([]),
		alternates: z.array(z.object({
			locale: localeSchema,
			href: z.string().min(1),
			isDefault: z.boolean().default(false)
		})).default([]),
		seo: seoSchema.optional()
	})
});

export const collections = {
	articles,
	pages,
	authors,
	categories,
	products
};
