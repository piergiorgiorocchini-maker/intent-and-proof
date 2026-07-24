# Intent & Proof CMS

The CMS is available at `/admin/` after the branch is deployed.

## Current test workflow

- Sveltia CMS is pinned to version `0.172.4`.
- Authentication currently uses the GitHub backend and a personal access token.
- Content changes are written to `agent/sveltia-content-system` while the system is under review.
- Before production release, the backend branch must be changed to `main` and a production authentication method approved.

## Managed collections

- Authors
- Categories
- Articles
- Pages
- Products

Every collection uses explicit `locale` and `translationKey` fields. New files follow the pattern:

`translation-key-en.md`

`translation-key-it.md`

Select the language before the first save. Relations between authors, categories and articles are filtered to the language of the entry being edited.

## Commercial products

The Product editor exposes the hero, SEO, language alternates, automatic related research and 16 reorderable commercial section types. Section design remains controlled by Astro components; Sveltia manages content, visibility, order, media, calls to action and presentation variants.

## Media

Uploaded assets are stored in:

`public/images/uploads`

and published from:

`/images/uploads`

## Validation

`npm run build` executes `scripts/validate-sveltia-admin.mjs` before the Astro build. The validator loads the generated CMS configuration, verifies the five collections and confirms the complete commercial block registry.
