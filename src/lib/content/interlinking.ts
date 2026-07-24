import { getCollection, type CollectionEntry } from "astro:content";

type ArticleEntry = CollectionEntry<"articles">;
type CategoryEntry = CollectionEntry<"categories">;
type AuthorEntry = CollectionEntry<"authors">;

export interface ArticleIndexItem {
	id: string;
	locale: "en" | "it";
	translationKey: string;
	slug: string;
	title: string;
	description: string;
	eyebrow: string;
	href: string;
	publishedDate: Date;
	updatedDate?: Date;
	readTime: string;
	tags: string[];
	categoryId: string;
	categorySlug: string;
	categoryName: string;
	categoryHref: string;
	authorId: string;
	authorName: string;
	authorHref: string;
	image?: {
		src: string;
		alt: string;
	};
}

export interface RelatedArticleOptions {
	locale?: "en" | "it";
	currentId?: string;
	currentHref?: string;
	categoryIds?: string[];
	tags?: string[];
	manualArticleIds?: string[];
	limit?: number;
	fallbackToLatest?: boolean;
}

const referenceId = (value: unknown): string => {
	if (typeof value === "string") return value;
	if (value && typeof value === "object" && "id" in value) {
		return String((value as { id: string }).id);
	}
	return "";
};

const normalized = (value: string) => value.trim().toLowerCase();
const newestFirst = (a: ArticleIndexItem, b: ArticleIndexItem) =>
	b.publishedDate.getTime() - a.publishedDate.getTime();

const articleHref = (locale: "en" | "it", slug: string) =>
	locale === "it" ? `/it/blog/${slug}/` : `/blog/${slug}/`;

const categoryHref = (locale: "en" | "it", slug: string) =>
	locale === "it" ? `/it/blog/categoria/${slug}/` : `/blog/category/${slug}/`;

const authorHref = (locale: "en" | "it", slug: string) =>
	locale === "it" ? `/it/autori/${slug}/` : `/authors/${slug}/`;

export async function getPublishedArticleIndex(locale?: "en" | "it"): Promise<ArticleIndexItem[]> {
	const [articles, categories, authors] = await Promise.all([
		getCollection("articles"),
		getCollection("categories"),
		getCollection("authors")
	]);

	const categoryMap = new Map<string, CategoryEntry>(categories.map((entry) => [entry.id, entry]));
	const authorMap = new Map<string, AuthorEntry>(authors.map((entry) => [entry.id, entry]));

	return articles
		.filter((entry: ArticleEntry) => !entry.data.draft)
		.filter((entry: ArticleEntry) => !locale || (entry.data.locale ?? "en") === locale)
		.map((entry: ArticleEntry): ArticleIndexItem => {
			const entryLocale = (entry.data.locale ?? "en") as "en" | "it";
			const categoryId = referenceId(entry.data.category);
			const authorId = referenceId(entry.data.author);
			const category = categoryMap.get(categoryId);
			const author = authorMap.get(authorId);
			const categorySlug = category?.data.slug ?? categoryId.replace(/-(en|it)$/, "");
			const authorSlug = author?.data.slug ?? authorId.replace(/-(en|it)$/, "");
			const heroImage = entry.data.hero?.image;

			return {
				id: entry.id,
				locale: entryLocale,
				translationKey: entry.data.translationKey,
				slug: entry.data.slug,
				title: entry.data.title,
				description: entry.data.description,
				eyebrow: entry.data.eyebrow,
				href: articleHref(entryLocale, entry.data.slug),
				publishedDate: entry.data.publishedDate,
				updatedDate: entry.data.updatedDate,
				readTime: entry.data.readTime,
				tags: entry.data.tags,
				categoryId,
				categorySlug,
				categoryName: category?.data.name ?? entry.data.eyebrow,
				categoryHref: categoryHref(entryLocale, categorySlug),
				authorId,
				authorName: author?.data.name ?? "Intent & Proof",
				authorHref: authorHref(entryLocale, authorSlug),
				...(heroImage ? { image: { src: heroImage.src, alt: heroImage.alt } } : {})
			};
		})
		.sort(newestFirst);
}

export function selectRelatedArticles(
	articles: ArticleIndexItem[],
	options: RelatedArticleOptions = {}
): ArticleIndexItem[] {
	const {
		locale = "en",
		currentId = "",
		currentHref = "",
		categoryIds = [],
		tags = [],
		manualArticleIds = [],
		limit = 4,
		fallbackToLatest = true
	} = options;

	const safeLimit = Math.max(3, Math.min(4, limit));
	const requestedCategories = new Set(categoryIds.map(normalized));
	const requestedTags = new Set(tags.map(normalized));
	const candidates = articles.filter((article) =>
		article.locale === locale &&
		article.id !== currentId &&
		article.href !== currentHref
	);
	const selected: ArticleIndexItem[] = [];
	const seen = new Set<string>();

	const add = (article?: ArticleIndexItem) => {
		if (!article || seen.has(article.id) || selected.length >= safeLimit) return;
		seen.add(article.id);
		selected.push(article);
	};

	manualArticleIds.forEach((requestedId) => {
		const key = normalized(requestedId);
		add(candidates.find((article) =>
			normalized(article.id) === key ||
			normalized(article.slug) === key ||
			normalized(article.translationKey) === key
		));
	});

	if (requestedCategories.size > 0) {
		candidates
			.filter((article) =>
				requestedCategories.has(normalized(article.categoryId)) ||
				requestedCategories.has(normalized(article.categorySlug))
			)
			.sort(newestFirst)
			.forEach(add);
	}

	if (requestedTags.size > 0 && selected.length < safeLimit) {
		candidates
			.map((article) => ({
				article,
				overlap: article.tags.filter((tag) => requestedTags.has(normalized(tag))).length
			}))
			.filter(({ overlap }) => overlap > 0)
			.sort((a, b) => b.overlap - a.overlap || newestFirst(a.article, b.article))
			.forEach(({ article }) => add(article));
	}

	if (fallbackToLatest && selected.length < safeLimit) {
		candidates.sort(newestFirst).forEach(add);
	}

	return selected.slice(0, safeLimit);
}
