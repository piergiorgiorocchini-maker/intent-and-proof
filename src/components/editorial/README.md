# Intent & Proof editorial components

This folder contains framework-light Astro components designed for the Intent & Proof editorial system and future Sveltia-managed content.

## Layout components

- `ArticleHero.astro`: split, background or text-only article hero.
- `Breadcrumbs.astro`: reusable breadcrumb navigation.
- `ArticleMeta.astro`: publication, update and reading-time metadata.
- `ContributorCard.astro`: author or editor identity.
- `TableOfContents.astro`: sticky article navigation.
- `ShareBar.astro`: LinkedIn, X, canonical link and copy-link actions.
- `SidebarCta.astro`: commercial sidebar action.
- `AuthorCard.astro`: full author summary.
- `ArticleFooter.astro`: author card, final CTA and extension slot.
- `GiscusComments.astro`: optional GitHub Discussions comments.

## Content components

- `ArticleFigure.astro`: image, video or custom media with caption and credit.
- `CalloutBox.astro`: information, tip, warning, data or success notes.
- `KeyTakeaways.astro`: concise article summary.
- `QuoteBlock.astro`: sourced editorial quotation.
- `ResponsiveTable.astro`: accessible horizontal table wrapper.
- `InlineCTA.astro`: inline, bottom or dark CTA.
- `FAQBlock.astro`: accessible FAQ accordions with optional FAQ schema.
- `RelatedArticles.astro`: related-content cards.
- `DataHighlight.astro`: KPI or statistic emphasis.
- `DefinitionBox.astro`: term and definition.
- `ProsCons.astro`: advantages and trade-offs.
- `DownloadResource.astro`: downloadable resource CTA.
- `ComparisonCards.astro`: product, service or tool comparisons.
- `CodeBlock.astro`: code presentation with copy action.
- `Footnotes.astro`: notes and source links.

## Design rules

- Components remain server-rendered by default.
- JavaScript is limited to copy-link and copy-code actions, plus optional Giscus loading.
- Components share `src/styles/editorial-components.css`.
- Existing public article classes are retained where needed to prevent visual regressions.
- Sveltia fields should expose structured options without allowing editors to alter layout CSS.
