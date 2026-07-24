import { z } from "astro/zod";

export const slugSchema = z
	.string()
	.min(1)
	.regex(
		/^[a-z0-9]+(?:[/-][a-z0-9]+)*$/,
		"Use lowercase letters, numbers, hyphens and optional path separators only."
	);

export const localeSchema = z.enum(["en", "it"]);
export const toneSchema = z.enum(["light", "navy", "mint", "cobalt", "orange", "neutral"]);

export const imageSchema = z.object({
	src: z.string().min(1),
	alt: z.string().min(1),
	width: z.number().int().positive().nullish(),
	height: z.number().int().positive().nullish(),
	caption: z.string().optional(),
	credit: z.string().optional(),
	position: z.string().default("center"),
	loading: z.enum(["eager", "lazy"]).default("lazy")
});

export const linkSchema = z.object({
	label: z.string().min(1),
	href: z.string().min(1)
});

export const actionSchema = linkSchema.extend({
	style: z.enum(["primary", "secondary", "outline", "text", "dark"]).default("primary"),
	trackingId: z.string().optional(),
	newTab: z.boolean().default(false)
});

export const ctaSchema = z.object({
	eyebrow: z.string().optional(),
	title: z.string().min(1),
	text: z.string().min(1),
	label: z.string().min(1),
	href: z.string().min(1),
	style: z.enum(["primary", "secondary", "dark"]).default("primary")
});

export const seoSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	canonicalUrl: z.union([z.url(), z.literal("")]).optional(),
	image: imageSchema.nullish(),
	noIndex: z.boolean().default(false),
	noFollow: z.boolean().default(false)
});

export const heroSchema = z.object({
	layout: z.enum(["split", "background", "text-only"]).default("split"),
	tone: z.enum(["aurora", "navy", "light", "mint"]).default("aurora"),
	image: imageSchema.nullish(),
	imagePosition: z.string().default("center"),
	videoUrl: z.union([z.url(), z.literal("")]).optional()
});

export const commentsSchema = z.object({
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

export const faqSchema = z.object({
	question: z.string().min(1),
	answer: z.string().min(1)
});

export const relatedContentSchema = z.object({
	enabled: z.boolean().default(true),
	eyebrow: z.string().optional(),
	title: z.string().optional(),
	text: z.string().optional(),
	categoryIds: z.array(slugSchema).default([]),
	tags: z.array(z.string()).default([]),
	manualArticleIds: z.array(slugSchema).default([]),
	limit: z.number().int().min(3).max(4).default(4),
	fallbackToLatest: z.boolean().default(true)
});