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
import { globalSettingsSchema } from "./content/schemas/settings";

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
		image: imageSchema.nullish(),
		expertise: z.array(z.string()).default([]),
		links: z.array(linkSchema).default([]),
		active: z.boolean().default(true),
		order: z.number().int().nonnegative().default(0),
		seo: seoSchema.nullish()
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
		seo: seoSchema.nullish()
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
		editor: z.union([reference("authors"), z.literal("")]).optional(),
		category: reference("categories"),
		tags: z.array(z.string()).default([]),
		keyTakeaways: z.array(z.string()).default([]),
		faqs: z.array(faqSchema).default([]),
		relatedArticles: z.array(slugSchema).default([]),
		relatedContent: relatedContentSchema.nullish(),
		layout: z.enum(["editorial-wide", "editorial-standard"]).default("editorial-wide"),
		hero: heroSchema.nullish().default({
			layout: "background",
			tone: "aurora",
			image: {
				src: "/images/uploads/intent-proof-medical-leads-hero.webp",
				alt: "Medical team celebrating new leads through local search",
				width: 1672,
				height: 941,
				caption: "",
				credit: "",
				position: "center right",
				loading: "lazy"
			},
			imagePosition: "right",
			videoUrl: ""
		}),
		showDescription: z.boolean().default(true),
		showToc: z.boolean().default(true),
		showShare: z.boolean().default(true),
		showSidebarCta: z.boolean().default(true),
		sidebarCta: ctaSchema.nullish(),
		footerCta: ctaSchema.nullish(),
		comments: commentsSchema.nullish(),
		seo: seoSchema.nullish()
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
			image: imageSchema.nullish(),
			primaryAction: linkSchema.nullish(),
			secondaryAction: linkSchema.nullish()
		}).nullish(),
		cta: ctaSchema.nullish(),
		relatedContent: relatedContentSchema.nullish(),
		seo: seoSchema.nullish()
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
		relatedContent: relatedContentSchema.nullish(),
		alternates: z.array(z.object({
			locale: localeSchema,
			href: z.string().min(1),
			isDefault: z.boolean().default(false)
		})).default([]),
		seo: seoSchema.nullish()
	})
});

const settings = defineCollection({
	loader: glob({ base: "./src/content/settings", pattern: "**/*.md", generateId: contentId }),
	schema: globalSettingsSchema
});

export const collections = {
	articles,
	pages,
	authors,
	categories,
	products,
	settings
};
