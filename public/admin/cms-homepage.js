(() => {
  const req = (name, label, widget = "string", extra = {}) => ({ name, label, widget, ...extra });
  const opt = (name, label, widget = "string", extra = {}) => ({ name, label, widget, required: false, ...extra });
  const obj = (name, label, fields) => opt(name, label, "object", { collapsed: true, fields });
  const list = (name, label, fields, extra = {}) => opt(name, label, "list", { collapsed: true, fields, ...extra });
  const textList = (name, label) => opt(name, label, "list", { field: { label: "Voce", name: "value", widget: "string" } });
  const action = (name, label) => obj(name, label, [req("label", "Etichetta"), req("href", "URL")]);

  const homepageFields = [
    obj("seo", "SEO", [
      req("title", "Titolo SEO"),
      req("description", "Meta description", "text"),
    ]),
    obj("hero", "Hero", [
      req("eyebrow", "Sovratitolo"),
      req("title", "Titolo", "text"),
      req("text", "Testo", "text"),
      action("primaryAction", "Azione primaria"),
      action("secondaryAction", "Azione secondaria"),
      textList("assurances", "Rassicurazioni"),
    ]),
    obj("diagnostic", "Anteprima diagnostica", [
      req("title", "Titolo"),
      req("client", "Cliente dimostrativo"),
      req("status", "Stato"),
      req("score", "Punteggio"),
      req("scoreLabel", "Etichetta punteggio"),
      req("scoreSummary", "Sintesi punteggio"),
      req("updatedLabel", "Aggiornamento"),
      list("metrics", "Metriche", [
        req("label", "Etichetta"),
        req("value", "Valore", "number", { value_type: "int", min: 0, max: 100 }),
        req("color", "Variabile colore"),
      ]),
      req("nextLabel", "Etichetta prossima azione"),
      req("nextText", "Prossima azione", "text"),
      req("signalTopLabel", "Etichetta segnale superiore"),
      req("signalTopText", "Testo segnale superiore"),
      req("signalBottomLabel", "Etichetta segnale inferiore"),
      req("signalBottomText", "Testo segnale inferiore"),
    ]),
    list("evidence", "Prove operative", [
      req("icon", "Icona"),
      req("value", "Valore"),
      req("text", "Testo", "text"),
    ], { summary: "{{value}} · {{text}}" }),
    obj("testimonial", "Testimonianza", [
      req("quote", "Citazione", "text"),
      req("initials", "Iniziali"),
      req("name", "Nome"),
      req("role", "Ruolo"),
    ]),
    obj("resource", "Risorsa gratuita", [
      req("eyebrow", "Sovratitolo"),
      req("title", "Titolo modulo"),
      req("coverTitle", "Titolo copertina"),
      req("coverText", "Testo copertina", "text"),
      req("text", "Descrizione", "text"),
      req("placeholder", "Placeholder email"),
      req("buttonLabel", "Testo pulsante"),
      req("note", "Nota"),
      req("errorMessage", "Messaggio errore", "text"),
    ]),
    obj("productsSection", "Prodotti", [
      req("eyebrow", "Sovratitolo"),
      req("title", "Titolo", "text"),
      req("text", "Introduzione", "text"),
      list("items", "Prodotti", [
        req("number", "Numero"),
        req("state", "Categoria"),
        req("verb", "Verbo"),
        req("title", "Nome prodotto"),
        req("text", "Descrizione", "text"),
        req("href", "URL"),
        req("linkLabel", "Etichetta link"),
        req("icon", "Tipo icona", "select", { options: ["build", "capture", "diagnose", "measure"] }),
        req("iconBars", "Elementi icona", "number", { value_type: "int", min: 1, max: 5 }),
      ], { summary: "{{number}} · {{title}}" }),
    ]),
    obj("audienceSection", "Clienti ideali", [
      req("eyebrow", "Sovratitolo"),
      req("title", "Titolo", "text"),
      req("text", "Introduzione", "text"),
      list("items", "Avatar", [
        req("code", "Codice breve"),
        req("title", "Titolo"),
        req("text", "Descrizione", "text"),
      ], { summary: "{{code}} · {{title}}" }),
      obj("proof", "Fascia sistema", [
        req("mark", "Marchio"),
        req("title", "Titolo"),
        req("text", "Testo", "text"),
        req("href", "URL"),
        req("label", "Etichetta link"),
      ]),
    ]),
    obj("researchSection", "Ultimi articoli", [
      req("eyebrow", "Sovratitolo"),
      req("title", "Titolo", "text"),
      req("href", "URL archivio"),
      req("label", "Etichetta archivio"),
      req("articleLabel", "Etichetta articolo"),
    ]),
    obj("finalCta", "CTA finale", [
      req("eyebrow", "Sovratitolo"),
      req("title", "Titolo", "text"),
      req("href", "URL"),
      req("label", "Etichetta pulsante"),
    ]),
  ];

  const homepageCollection = {
    name: "homepage",
    label: "Homepage",
    format: "json",
    editor: { preview: false },
    files: [
      {
        name: "homepage-en",
        label: "Homepage · English",
        file: "src/data/homepage.json",
        fields: homepageFields,
      },
    ],
  };

  if (Array.isArray(window.IntentProofCMSCollections)) {
    window.IntentProofCMSCollections.unshift(homepageCollection);
  }
})();
