# Commercial page system

The commercial system is driven by the `products` Content Collection and rendered by `CommercialPageLayout.astro`.

## Multilingual model

Each language version is a separate Markdown entry with:

- `locale`: currently `en` or `it`
- `translationKey`: shared across translations
- a localized `slug`, title, description, breadcrumbs, actions and form copy
- `alternates`: localized URLs used to generate `hreflang` and `x-default`

Product names may remain unchanged between locales while every supporting message remains independently editable.

## CMS control

Sveltia will manage:

- hero badge, eyebrow, title, copy, media, CTAs and reassurance text
- section order and visibility
- section tone and product accent
- all cards, steps, bullets, metrics and proof statements
- case studies, testimonials and audience qualification
- integrations, engagement options and risk commitments
- FAQ content and commercial contact prompts
- form fields, labels, options, privacy copy and success message
- SEO metadata, canonical URL, social image and indexing state

Sveltia controls content and approved variants. It does not expose arbitrary classes, spacing values, font sizes or colour codes. This preserves visual consistency across editors and products.

## Available blocks

1. `trust`
2. `problem`
3. `outcomes`
4. `process`
5. `feature`
6. `metrics`
7. `testimonial`
8. `case-study`
9. `audience`
10. `integrations`
11. `pricing`
12. `risk-reversal`
13. `faq`
14. `lead-form`
15. `contact`
16. `final-cta`

Blocks can be repeated, reordered or hidden. The renderer maps each `type` to a controlled Astro component.

## Current reference product

`Local Authority Engine` is implemented in English and Italian as the reference persuasive architecture. Both entries remain `noIndex: true` until commercial copy, contact endpoints and final visuals are approved.

The current form action and direct-contact values are non-production placeholders. They must be connected to approved email, CRM, form or calendar endpoints during the Sveltia/integration step before indexing is enabled.

## Validation

The English and Italian product routes, all commercial blocks, multilingual metadata and product indexes pass the automated Astro production build. The final validation was repeated after removing unapproved contact details.
