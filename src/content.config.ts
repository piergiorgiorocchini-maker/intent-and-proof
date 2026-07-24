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

const imageSchema = z.object({
	src: z.string().min(1),
	alt: z.string().min(1),
	width: z.number().int().positive().optional(),
	height: z.number().int().positive().optional()
});

const linkSchema = z.object({
	label: z.string().min(1),
	href: z.string().min(1)
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

export const collections = {
	articles,
	pages,
	authors,
	categories
};
