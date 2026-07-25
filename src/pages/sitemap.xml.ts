import { getCollection } from "astro:content";

export const prerender = true;

const SITE_URL = "https://www.intentandproof.com";

interface SitemapEntry {
	path: string;
	lastmod?: Date;
}

const escapeXml = (value: string) =>
	value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;")
		.replaceAll("'", "&apos;");

const normalizePath = (path: string) => {
	const withLeadingSlash = path.startsWith("/") ? path : `/${path}`;
	return withLeadingSlash === "/" || withLeadingSlash.endsWith("/")
		? withLeadingSlash
		: `${withLeadingSlash}/`;
};

const pagePath = (locale: "en" | "it", slug: string) =>
	locale === "it" ? `/it/${slug}/` : `/${slug}/`;

const articlePath = (locale: "en" | "it", slug: string) =>
	locale === "it" ? `/it/blog/${slug}/` : `/blog/${slug}/`;

const categoryPath = (locale: "en" | "it", slug: string) =>
	locale === "it" ? `/it/blog/categoria/${slug}/` : `/blog/category/${slug}/`;

const authorPath = (locale: "en" | "it", slug: string) =>
	locale === "it" ? `/it/autori/${slug}/` : `/authors/${slug}/`;

const productPath = (locale: "en" | "it", slug: string) =>
	locale === "it" ? `/it/prodotti/${slug}/` : `/products/${slug}/`;

export async function GET() {
	const [articles, pages, categories, authors, products] = await Promise.all([
		getCollection("articles"),
		getCollection("pages"),
		getCollection("categories"),
		getCollection("authors"),
		getCollection("products")
	]);

	const entries = new Map<string, SitemapEntry>();
	const add = (entry: SitemapEntry) => {
		const path = normalizePath(entry.path);
		entries.set(path, { ...entry, path });
	};

	// Stable public routes that are not generated from a content collection.
	add({ path: "/" });
	add({ path: "/about/" });
	add({ path: "/diagnostic/" });
	add({ path: "/blog/" });
	add({ path: "/it/blog/" });
	add({ path: "/blog/local-service-lead-generation/" });

	for (const entry of articles) {
		if (entry.data.draft || entry.data.seo?.noIndex) continue;
		add({
			path: articlePath(entry.data.locale, entry.data.slug),
			lastmod: entry.data.updatedDate ?? entry.data.publishedDate
		});
	}

	for (const entry of pages) {
		if (entry.data.draft || entry.data.seo?.noIndex) continue;
		add({ path: pagePath(entry.data.locale, entry.data.slug) });
	}

	for (const entry of categories) {
		if (entry.data.seo?.noIndex) continue;
		add({ path: categoryPath(entry.data.locale, entry.data.slug) });
	}

	for (const entry of authors) {
		if (!entry.data.active || entry.data.seo?.noIndex) continue;
		add({ path: authorPath(entry.data.locale, entry.data.slug) });
	}

	for (const entry of products) {
		if (entry.data.draft || entry.data.seo?.noIndex) continue;
		add({
			path: productPath(entry.data.locale, entry.data.slug),
			lastmod: entry.data.updatedDate
		});
	}

	const urls = [...entries.values()]
		.sort((a, b) => a.path.localeCompare(b.path))
		.map(({ path, lastmod }) => {
			const location = escapeXml(new URL(path, SITE_URL).toString());
			const modified = lastmod
				? `\n    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>`
				: "";
			return `  <url>\n    <loc>${location}</loc>${modified}\n  </url>`;
		})
		.join("\n");

	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

	return new Response(xml, {
		headers: {
			"Content-Type": "application/xml; charset=utf-8"
		}
	});
}
