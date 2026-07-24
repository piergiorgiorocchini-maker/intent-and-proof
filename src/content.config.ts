import { defineCollection, reference } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import {
	commentsSchema,
	ctaSchema,
	faqSchema,
	heroSchema,
	imageSchema,
	linkSchema,
	localeSchema,
	relatedContentSchema,
	seoSchema,
	slugSchema
} from "./content/schemas/shared";
import {
	commercialHeroSchema,
	commercialSectionSchema
} from "./content/schemas/commercial";

const contentId = ({ entry }: { entry: string }) => entry.replace(/\.(md|mdx)$/, "");

const authors = defineCollection({
	loader: glob({ base: "./src/content/authors", pattern: "**/*.md", generateId: contentId }),
	schema: z.object({
		locale: localeSchema.default("en"),
		translationKey: slugSchema,
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
	loader: glob({ base: "./src/content/categories", pattern: "**/*.md", generateId: contentId }),
	schema: z.object({
		locale: localeSchema.default("en"),
		translationKey: slugSchema,
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
	loader: glob({ base: "./src/content/articles", pattern: "**/*.md", generateId: contentId }),
	schema: z.object({
		locale: localeSchema.default("en"),
		translationKey: slugSchema,
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
		relatedContent: relatedContentSchema.optional(),
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
	loader: glob({ base: "./src/content/pages", pattern: "**/*.md", generateId: contentId }),
	schema: z.object({
		locale: localeSchema.default("en"),
		translationKey: slugSchema,
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
		relatedContent: relatedContentSchema.optional(),
		seo: seoSchema.optional()
	})
});

const products = defineCollection({
	loader: glob({ base: "./src/content/products", pattern: "**/*.md", generateId: contentId }),
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
		relatedContent: relatedContentSchema.optional(),
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
