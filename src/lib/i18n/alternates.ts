export type ContentLocale = "en" | "it";
export type ContentKind = "page" | "article" | "product";

export interface AlternateLocale {
	locale: ContentLocale;
	href: string;
	isDefault?: boolean;
}

interface LocalizedContentEntry {
	data: {
		locale: ContentLocale;
		translationKey: string;
		slug: string;
		draft?: boolean;
	};
}

export function localizedContentPath(kind: ContentKind, locale: ContentLocale, slug: string): string {
	if (kind === "article") {
		return locale === "it" ? `/it/blog/${slug}/` : `/blog/${slug}/`;
	}

	if (kind === "product") {
		return locale === "it" ? `/it/prodotti/${slug}/` : `/products/${slug}/`;
	}

	return locale === "it" ? `/it/${slug}/` : `/${slug}/`;
}

export function buildContentAlternates(
	entries: LocalizedContentEntry[],
	translationKey: string,
	kind: ContentKind
): AlternateLocale[] {
	const variants = entries.filter(
		(entry) => entry.data.translationKey === translationKey && entry.data.draft !== true
	);
	const seenLocales = new Set<ContentLocale>();

	for (const entry of variants) {
		if (seenLocales.has(entry.data.locale)) {
			throw new Error(
				`[i18n] Duplicate ${kind} translation for key "${translationKey}" and locale "${entry.data.locale}".`
			);
		}
		seenLocales.add(entry.data.locale);
	}

	const alternates: AlternateLocale[] = variants.map((entry) => ({
		locale: entry.data.locale,
		href: localizedContentPath(kind, entry.data.locale, entry.data.slug)
	}));
	const english = alternates.find((alternate) => alternate.locale === "en");

	if (english) {
		alternates.push({ locale: "en", href: english.href, isDefault: true });
	}

	return alternates;
}
