(() => {
  const opt = (name, label, widget = "string", extra = {}) => ({ name, label, widget, required: false, ...extra });
  const req = (name, label, widget = "string", extra = {}) => ({ name, label, widget, ...extra });
  const sel = (name, label, options, extra = {}) => req(name, label, "select", { options, ...extra });
  const bool = (name, label, value = false) => opt(name, label, "boolean", { default: value });
  const num = (name, label, extra = {}) => opt(name, label, "number", { value_type: "int", ...extra });
  const textList = (name, label, extra = {}) => opt(name, label, "list", { ...extra });
  const obj = (name, label, fields, extra = {}) => opt(name, label, "object", { collapsed: true, fields, ...extra });
  const structuredList = (name, label, fields, extra = {}) =>
    opt(name, label, "list", { collapsed: true, fields, ...extra });

  const localeOptions = [
    { label: "English", value: "en" },
    { label: "Italiano", value: "it" },
  ];
  const toneOptions = ["light", "navy", "mint", "cobalt", "orange", "neutral"];
  const slugPattern = ["^[a-z0-9]+(?:-[a-z0-9]+)*$", "Usare minuscole, numeri e trattini."];

  const localeField = () => sel("locale", "Lingua", localeOptions, { default: "en" });
  const translationField = () => req("translationKey", "Chiave di traduzione", "string", { pattern: slugPattern });
  const slugField = () => req("slug", "Slug pubblico", "string", { pattern: slugPattern });

  const imageFields = () => [
    req("src", "File o URL", "image"),
    req("alt", "Testo alternativo"),
    num("width", "Larghezza", { min: 1 }),
    num("height", "Altezza", { min: 1 }),
    opt("caption", "Didascalia", "text"),
    opt("credit", "Credito"),
    opt("position", "Posizione", "string", { default: "center" }),
    opt("loading", "Caricamento", "select", { options: ["eager", "lazy"], default: "lazy" }),
  ];
  const imageField = (name, label) => obj(name, label, imageFields());

  const linkFields = () => [req("label", "Etichetta"), req("href", "URL")];
  const linkField = (name, label) => obj(name, label, linkFields());

  const actionFields = () => [
    ...linkFields(),
    opt("style", "Stile", "select", {
      options: ["primary", "secondary", "outline", "text", "dark"],
      default: "primary",
    }),
    opt("trackingId", "ID tracciamento"),
    bool("newTab", "Apri in nuova scheda"),
  ];
  const actionField = (name, label) => obj(name, label, actionFields());

  const ctaFields = () => [
    opt("eyebrow", "Sovratitolo"),
    req("title", "Titolo"),
    req("text", "Testo", "text"),
    req("label", "Etichetta pulsante"),
    req("href", "URL pulsante"),
    opt("style", "Stile", "select", { options: ["primary", "secondary", "dark"], default: "primary" }),
  ];
  const ctaField = (name, label) => obj(name, label, ctaFields());

  const seoField = () =>
    obj("seo", "SEO e indicizzazione", [
      opt("title", "Titolo SEO"),
      opt("description", "Meta description", "text"),
      opt("canonicalUrl", "URL canonico"),
      imageField("image", "Immagine social"),
      bool("noIndex", "Escludi dai motori di ricerca"),
      bool("noFollow", "Non seguire i link"),
    ]);

  const relatedField = () =>
    obj("relatedContent", "Interlinking automatico", [
      opt("enabled", "Attivo", "boolean", { default: true }),
      opt("eyebrow", "Sovratitolo"),
      opt("title", "Titolo sezione"),
      opt("text", "Testo introduttivo", "text"),
      opt("categoryIds", "Categorie prioritarie", "relation", {
        collection: "categories",
        value_field: "{{slug}}",
        display_fields: ["name", "locale"],
        search_fields: ["name", "description"],
        multiple: true,
        filters: [{ field: "fields.locale", values: ["{{fields.locale}}"] }],
      }),
      textList("tags", "Tag prioritari"),
      opt("manualArticleIds", "Articoli scelti manualmente", "relation", {
        collection: "articles",
        value_field: "{{slug}}",
        display_fields: ["title", "publishedDate"],
        search_fields: ["title", "description", "tags"],
        multiple: true,
        max: 4,
        filters: [
          { field: "fields.locale", values: ["{{fields.locale}}"] },
          { field: "fields.draft", values: [false] },
        ],
      }),
      num("limit", "Numero articoli", { min: 3, max: 4, default: 4 }),
      opt("fallbackToLatest", "Completa con gli ultimi articoli", "boolean", { default: true }),
    ]);

  const relation = (name, label, collection, display_fields, extra = {}) =>
    req(name, label, "relation", {
      collection,
      value_field: "{{slug}}",
      display_fields,
      search_fields: display_fields,
      filters: [{ field: "fields.locale", values: ["{{fields.locale}}"] }],
      ...extra,
    });

  const baseCollection = (name, label, folder, fields, extra = {}) => ({
    name,
    label,
    label_singular: label.replace(/i$/, "e"),
    folder,
    create: true,
    delete: true,
    format: "yaml-frontmatter",
    extension: "md",
    identifier_field: "translationKey",
    slug: "{{fields.translationKey}}-{{fields.locale}}",
    editor: { preview: false },
    view_filters: [
      { label: "English", field: "locale", pattern: "^en$" },
      { label: "Italiano", field: "locale", pattern: "^it$" },
    ],
    fields,
    ...extra,
  });

  const authors = baseCollection("authors", "Autori", "src/content/authors", [
    localeField(),
    translationField(),
    req("name", "Nome"),
    slugField(),
    req("role", "Ruolo"),
    req("shortBio", "Bio breve", "text"),
    imageField("image", "Foto autore"),
    textList("expertise", "Competenze"),
    structuredList("links", "Link professionali", linkFields()),
    opt("active", "Autore attivo", "boolean", { default: true }),
    num("order", "Ordine", { min: 0, default: 0 }),
    seoField(),
  ], { summary: "{{name}} · {{locale | upper}}" });

  const categories = baseCollection("categories", "Categorie", "src/content/categories", [
    localeField(),
    translationField(),
    req("name", "Nome categoria"),
    slugField(),
    req("description", "Descrizione", "text"),
    opt("eyebrow", "Sovratitolo", "string", { default: "Research" }),
    opt("tone", "Tono colore", "select", {
      options: ["navy", "cobalt", "mint", "orange", "neutral"],
      default: "navy",
    }),
    bool("featured", "In evidenza"),
    num("order", "Ordine", { min: 0, default: 0 }),
    seoField(),
  ], { summary: "{{name}} · {{locale | upper}}" });

  const articleHero = obj("hero", "Hero articolo", [
    opt("layout", "Layout", "select", { options: ["split", "background", "text-only"], default: "split" }),
    opt("tone", "Tono", "select", { options: ["aurora", "navy", "light", "mint"], default: "aurora" }),
    imageField("image", "Immagine hero"),
    opt("imagePosition", "Posizione immagine", "string", { default: "center" }),
    opt("videoUrl", "URL video"),
  ]);

  const commentsField = obj("comments", "Commenti Giscus", [
    bool("enabled", "Attivi"),
    opt("provider", "Provider", "hidden", { default: "giscus" }),
    opt("repo", "Repository"),
    opt("repoId", "Repository ID"),
    opt("category", "Categoria Discussion", "string", { default: "General" }),
    opt("categoryId", "Categoria ID"),
    opt("mapping", "Mappatura", "select", {
      options: ["pathname", "url", "title", "og:title", "specific", "number"],
      default: "pathname",
    }),
    opt("theme", "Tema", "string", { default: "preferred_color_scheme" }),
    opt("lang", "Lingua", "string", { default: "en" }),
  ]);

  const articles = baseCollection("articles", "Articoli", "src/content/articles", [
    localeField(),
    translationField(),
    req("title", "Titolo"),
    slugField(),
    req("description", "Descrizione", "text"),
    opt("eyebrow", "Sovratitolo", "string", { default: "Growth Guide" }),
    bool("draft", "Bozza", true),
    bool("featured", "In evidenza"),
    req("publishedDate", "Data pubblicazione", "datetime", {
      format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false,
    }),
    opt("updatedDate", "Ultimo aggiornamento", "datetime", {
      format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false,
    }),
    opt("readTime", "Tempo di lettura", "string", { default: "8 min read" }),
    relation("author", "Autore", "authors", ["name", "role"]),
    opt("editor", "Editor", "relation", {
      collection: "authors",
      value_field: "{{slug}}",
      display_fields: ["name", "role"],
      search_fields: ["name", "role"],
      filters: [{ field: "fields.locale", values: ["{{fields.locale}}"] }],
    }),
    relation("category", "Categoria", "categories", ["name", "description"]),
    textList("tags", "Tag"),
    textList("keyTakeaways", "Punti chiave"),
    structuredList("faqs", "FAQ", [req("question", "Domanda"), req("answer", "Risposta", "text")]),
    opt("relatedArticles", "Articoli correlati manuali", "relation", {
      collection: "articles",
      value_field: "{{slug}}",
      display_fields: ["title", "publishedDate"],
      search_fields: ["title", "description", "tags"],
      multiple: true,
      max: 4,
      filters: [
        { field: "fields.locale", values: ["{{fields.locale}}"] },
        { field: "fields.draft", values: [false] },
      ],
    }),
    opt("layout", "Layout articolo", "select", {
      options: ["editorial-wide", "editorial-standard"], default: "editorial-wide",
    }),
    articleHero,
    opt("showDescription", "Mostra descrizione", "boolean", { default: true }),
    opt("showToc", "Mostra indice", "boolean", { default: true }),
    opt("showShare", "Mostra condivisione", "boolean", { default: true }),
    opt("showSidebarCta", "Mostra CTA laterale", "boolean", { default: true }),
    ctaField("sidebarCta", "CTA laterale"),
    ctaField("footerCta", "CTA finale"),
    commentsField,
    relatedField(),
    seoField(),
    req("body", "Contenuto", "markdown"),
  ], {
    summary: "{{title}} · {{locale | upper}} · {{publishedDate | date('DD MMM YYYY')}}",
    sortable_fields: ["title", "publishedDate", "updatedDate", "category", "draft"],
    view_filters: [
      { label: "English", field: "locale", pattern: "^en$" },
      { label: "Italiano", field: "locale", pattern: "^it$" },
      { label: "Bozze", field: "draft", pattern: "true" },
      { label: "Pubblicati", field: "draft", pattern: "false" },
    ],
  });

  const pageHero = obj("hero", "Hero pagina", [
    opt("eyebrow", "Sovratitolo"),
    opt("title", "Titolo hero"),
    opt("text", "Testo hero", "text"),
    imageField("image", "Immagine hero"),
    linkField("primaryAction", "Azione primaria"),
    linkField("secondaryAction", "Azione secondaria"),
  ]);

  const pages = baseCollection("pages", "Pagine", "src/content/pages", [
    localeField(),
    translationField(),
    req("title", "Titolo"),
    slugField(),
    req("description", "Descrizione", "text"),
    bool("draft", "Bozza", true),
    opt("template", "Template", "select", {
      options: ["foundation", "service", "landing", "legal", "standard"], default: "standard",
    }),
    num("order", "Ordine", { min: 0, default: 0 }),
    pageHero,
    ctaField("cta", "CTA pagina"),
    relatedField(),
    seoField(),
    req("body", "Contenuto", "markdown"),
  ], { summary: "{{title}} · {{locale | upper}}" });

  const sectionBase = () => [
    req("id", "ID sezione", "string", { pattern: slugPattern }),
    opt("visible", "Visibile", "boolean", { default: true }),
    opt("tone", "Tono", "select", { options: toneOptions, default: "light" }),
    opt("eyebrow", "Sovratitolo"),
    opt("title", "Titolo"),
    opt("text", "Testo", "text"),
  ];
  const section = (name, label, fields) => ({ name, label, fields: [...sectionBase(), ...fields] });
  const item = (name, label, fields, extra = {}) => structuredList(name, label, fields, extra);

  const productHero = obj("hero", "Hero commerciale", [
    opt("eyebrow", "Sovratitolo"),
    opt("badge", "Badge"),
    req("title", "Titolo"),
    req("text", "Testo", "text"),
    actionField("primaryAction", "Azione primaria"),
    actionField("secondaryAction", "Azione secondaria"),
    textList("microcopy", "Micro-rassicurazioni"),
    obj("media", "Media hero", [
      opt("type", "Tipo", "select", { options: ["image", "video", "interface"], default: "image" }),
      req("src", "File o URL", "image"),
      req("alt", "Testo alternativo"),
      opt("poster", "Poster video", "image"),
      opt("caption", "Didascalia", "text"),
      opt("position", "Posizione", "string", { default: "center" }),
    ]),
    opt("layout", "Layout", "select", { options: ["split", "centered", "visual-first"], default: "split" }),
    opt("tone", "Tono", "select", { options: toneOptions, default: "navy" }),
  ]);

  const commercialTypes = [
    section("trust", "Fascia di fiducia", [
      item("items", "Elementi", [
        req("name", "Nome"), opt("label", "Etichetta"), imageField("logo", "Logo"),
        opt("metric", "Metrica"), opt("href", "URL"),
      ]),
      opt("note", "Nota", "text"),
    ]),
    section("problem", "Problema e costo", [
      opt("costTitle", "Titolo costi"),
      item("costs", "Costi", [req("title", "Titolo"), req("text", "Testo", "text"), opt("icon", "Icona")]),
      actionField("action", "Azione"),
    ]),
    section("outcomes", "Risultati", [
      opt("columns", "Colonne", "number", { value_type: "int", min: 2, max: 4, default: 3 }),
      item("items", "Risultati", [
        req("title", "Titolo"), req("text", "Testo", "text"), opt("metric", "Metrica"),
        opt("icon", "Icona"), actionField("action", "Azione"),
      ]),
    ]),
    section("process", "Processo", [
      item("steps", "Fasi", [
        opt("number", "Numero"), req("title", "Titolo"), req("text", "Testo", "text"),
        textList("deliverables", "Deliverable"),
      ]),
      imageField("media", "Media"),
      actionField("action", "Azione"),
    ]),
    section("feature", "Funzionalità o beneficio", [
      opt("layout", "Layout", "select", { options: ["media-left", "media-right", "centered"], default: "media-right" }),
      textList("bullets", "Punti"),
      imageField("media", "Media"),
      actionField("action", "Azione"),
      opt("proof", "Prova", "text"),
    ]),
    section("metrics", "Metriche", [
      item("items", "Metriche", [req("value", "Valore"), req("label", "Etichetta"), opt("detail", "Dettaglio", "text")]),
      opt("note", "Nota", "text"), opt("sourceLabel", "Fonte"), opt("sourceHref", "URL fonte"),
    ]),
    section("testimonial", "Testimonianza", [
      req("quote", "Citazione", "text"), req("name", "Nome"), req("role", "Ruolo"),
      opt("company", "Azienda"), imageField("image", "Foto"), imageField("logo", "Logo"),
      opt("result", "Risultato"), actionField("action", "Azione"),
    ]),
    section("case-study", "Case study", [
      req("client", "Cliente"), opt("challenge", "Sfida", "text"), opt("approach", "Approccio", "text"),
      item("results", "Risultati", [req("value", "Valore"), req("label", "Etichetta")]),
      imageField("media", "Media"), actionField("action", "Azione"),
    ]),
    section("audience", "A chi serve", [
      req("fitTitle", "Titolo clienti ideali"), textList("fitItems", "Clienti ideali", { required: true }),
      req("notFitTitle", "Titolo non adatto"), textList("notFitItems", "Non adatto", { required: true }),
      opt("note", "Nota", "text"),
    ]),
    section("integrations", "Integrazioni", [
      item("items", "Strumenti", [
        req("name", "Nome"), opt("description", "Descrizione", "text"),
        imageField("logo", "Logo"), opt("href", "URL"),
      ]),
      opt("note", "Nota", "text"), actionField("action", "Azione"),
    ]),
    section("pricing", "Prezzi e modalità", [
      opt("currencyNote", "Nota valuta"),
      item("plans", "Piani", [
        req("name", "Nome"), opt("eyebrow", "Sovratitolo"), req("price", "Prezzo"),
        opt("frequency", "Frequenza"), req("description", "Descrizione", "text"),
        textList("features", "Caratteristiche"), actionField("action", "Azione"),
        bool("highlighted", "In evidenza"), opt("badge", "Badge"),
      ]),
      opt("note", "Nota", "text"),
    ]),
    section("risk-reversal", "Riduzione del rischio", [
      item("commitments", "Impegni", [req("title", "Titolo"), req("text", "Testo", "text")]),
      actionField("action", "Azione"), textList("microcopy", "Microcopy"),
    ]),
    section("faq", "FAQ commerciali", [
      item("items", "Domande", [req("question", "Domanda"), req("answer", "Risposta", "text")]),
      opt("contactText", "Testo contatto", "text"), actionField("contactAction", "Azione contatto"),
    ]),
    section("lead-form", "Modulo lead", [
      req("formName", "Nome modulo"), opt("action", "Endpoint", "string", { default: "#" }),
      opt("method", "Metodo", "select", { options: ["get", "post"], default: "post" }),
      item("fields", "Campi", [
        req("name", "Nome tecnico", "string", { pattern: slugPattern }),
        req("label", "Etichetta"),
        opt("type", "Tipo", "select", {
          options: ["text", "email", "url", "tel", "textarea", "select"], default: "text",
        }),
        opt("placeholder", "Placeholder"), bool("required", "Obbligatorio"),
        textList("options", "Opzioni"), opt("autocomplete", "Autocomplete"),
      ]),
      req("buttonLabel", "Testo pulsante"), opt("note", "Nota", "text"),
      opt("privacyText", "Privacy", "text"), opt("successMessage", "Messaggio conferma", "text"),
    ]),
    section("contact", "Opzioni di contatto", [
      item("items", "Contatti", [
        sel("type", "Tipo", ["email", "phone", "whatsapp", "calendar", "form", "location"]),
        req("label", "Etichetta"), req("value", "Valore"), opt("href", "URL"),
        opt("description", "Descrizione", "text"), opt("availability", "Disponibilità"),
      ]),
    ]),
    section("final-cta", "CTA finale", [
      actionField("primaryAction", "Azione primaria"),
      actionField("secondaryAction", "Azione secondaria"),
      textList("microcopy", "Microcopy"), imageField("media", "Media"),
    ]),
  ];

  const products = baseCollection("products", "Prodotti", "src/content/products", [
    localeField(),
    translationField(),
    req("title", "Titolo documento"),
    req("productName", "Nome prodotto"),
    opt("navigationLabel", "Etichetta navigazione"),
    slugField(),
    req("description", "Descrizione", "text"),
    bool("draft", "Bozza", true),
    bool("featured", "In evidenza"),
    num("order", "Ordine", { min: 0, default: 0 }),
    opt("productType", "Tipo prodotto", "select", {
      options: ["system", "service", "platform", "diagnostic"], default: "system",
    }),
    opt("accent", "Colore prodotto", "select", {
      options: ["mint", "cobalt", "orange", "navy"], default: "mint",
    }),
    opt("updatedDate", "Ultimo aggiornamento", "datetime", {
      format: "YYYY-MM-DD", date_format: "YYYY-MM-DD", time_format: false,
    }),
    structuredList("breadcrumbs", "Breadcrumb", linkFields()),
    productHero,
    opt("sections", "Sezioni commerciali", "list", {
      types: commercialTypes, typeKey: "type", collapsed: true, summary: "{{type}} · {{title}}",
    }),
    structuredList("alternates", "Versioni linguistiche", [
      sel("locale", "Lingua", localeOptions),
      req("href", "URL"),
      bool("isDefault", "Versione predefinita"),
    ]),
    relatedField(),
    seoField(),
  ], {
    summary: "{{productName}} · {{locale | upper}}",
    sortable_fields: ["productName", "updatedDate", "order", "draft"],
  });

  window.IntentProofCMSCollections = [authors, categories, articles, pages, products];
})();
