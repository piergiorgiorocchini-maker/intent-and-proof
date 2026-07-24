# Intent & Proof CMS

The CMS is available at `/admin/` after deployment.

## Current workflow

- Sveltia CMS is pinned to version `0.172.4`.
- Authentication currently uses the GitHub backend and a personal access token.
- Content changes are written directly to `main` after the content-system PR is merged.
- The public site is currently the controlled test environment; unpublished experiments must remain `draft` or `noindex`.
- A production-friendly OAuth method can replace token authentication later without changing the content model.

## Managed collections

- Global settings
- Authors
- Categories
- Articles
- Pages
- Products

Every editorial collection uses explicit `locale` and `translationKey` fields. New files follow the pattern:

`translation-key-en.md`

`translation-key-it.md`

Select the language before the first save. Relations between authors, categories and articles are filtered to the language of the entry being edited.

## Global settings

The singleton **Tracking, forms and thank-you** screen controls:

- direct Google tags or Google Tag Manager;
- GA4, Google Ads and Meta Pixel identifiers;
- non-blocking Google consent defaults;
- shared event names for CTA, phone, WhatsApp, email, forms and lead confirmation;
- the informational tracking notice in English and Italian;
- centralized form handlers for newsletter, diagnostic, contact, download and general leads;
- English and Italian thank-you page copy.

Tracking defaults remain `granted`, matching the approved LavaggioDivani approach. The informational notice never delays or prevents configured tags from loading.

Provider secrets must never be stored in CMS content. The CMS stores only public IDs, public form endpoints, redirect-field names and non-sensitive routing values. Providers requiring private API keys must use a protected serverless endpoint.

### Recommended handler patterns

- Newsletter: `submissionMode: fetch`, `successMode: inline`.
- Diagnostic/contact: `submissionMode: native` when the provider supports a redirect field, otherwise `fetch`; `successMode: redirect`.
- Commercial redirects: `/thank-you/?type=diagnostic` or `/it/grazie/?type=diagnostic`.

Forms use the handler ID first and then fall back to a matching purpose. Existing commercial diagnostic forms therefore resolve to the centralized `diagnostic` handler without embedding an endpoint in page content.

## Commercial products

The Product editor exposes the hero, SEO, language alternates, automatic related research and 16 reorderable commercial section types. Section design remains controlled by Astro components; Sveltia manages content, visibility, order, media, calls to action and presentation variants.

## Media

Uploaded assets are stored in:

`public/images/uploads`

and published from:

`/images/uploads`

## Validation

`npm run build` executes `scripts/validate-sveltia-admin.mjs` before the Astro build. The validator loads the generated CMS configuration, verifies all six collections, confirms the complete commercial block registry, checks the centralized form handlers, enforces granted tracking defaults, confirms both thank-you routes exist and verifies that Sveltia writes to `main`.