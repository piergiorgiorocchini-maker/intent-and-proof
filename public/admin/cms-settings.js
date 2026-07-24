(() => {
  const req = (name, label, widget = "string", extra = {}) => ({ name, label, widget, ...extra });
  const opt = (name, label, widget = "string", extra = {}) => ({ name, label, widget, required: false, ...extra });
  const bool = (name, label, value = false) => opt(name, label, "boolean", { default: value });
  const num = (name, label, extra = {}) => opt(name, label, "number", { value_type: "int", ...extra });
  const sel = (name, label, options, extra = {}) => req(name, label, "select", { options, ...extra });
  const obj = (name, label, fields, extra = {}) => opt(name, label, "object", { collapsed: true, fields, ...extra });
  const list = (name, label, fields, extra = {}) => opt(name, label, "list", { collapsed: true, fields, ...extra });

  const consentOptions = ["granted", "denied"];
  const localeOptions = [
    { label: "English", value: "en" },
    { label: "Italiano", value: "it" },
  ];
  const slugPattern = ["^[a-z0-9]+(?:-[a-z0-9]+)*$", "Usare minuscole, numeri e trattini."];

  const noticeFields = () => [
    req("title", "Titolo"),
    req("text", "Testo", "text"),
    req("dismissLabel", "Etichetta chiusura"),
    opt("privacyLabel", "Etichetta privacy"),
    opt("privacyHref", "URL privacy"),
  ];

  const thankYouFields = () => [
    req("eyebrow", "Sovratitolo"),
    req("title", "Titolo"),
    req("text", "Testo", "text"),
    req("nextStepsTitle", "Titolo prossimi passi"),
    opt("nextSteps", "Prossimi passi", "list"),
    req("primaryLabel", "CTA primaria"),
    req("primaryHref", "URL CTA primaria"),
    req("secondaryLabel", "CTA secondaria"),
    req("secondaryHref", "URL CTA secondaria"),
  ];

  const settingsCollection = {
    name: "settings",
    label: "Impostazioni globali",
    delete: false,
    editor: { preview: false },
    files: [
      {
        name: "global",
        label: "Tracking, moduli e thank-you",
        file: "src/content/settings/global.md",
        format: "yaml-frontmatter",
        fields: [
          obj("site", "Sito", [
            req("brand", "Brand"),
            req("baseUrl", "URL principale"),
            req("country", "Paese"),
            sel("defaultLocale", "Lingua predefinita", localeOptions, { default: "en" }),
          ]),
          obj("tracking", "Tracking centralizzato", [
            bool("enabled", "Tracking attivo", true),
            bool("debug", "Modalità debug"),
            sel("delivery", "Modalità caricamento", [
              { label: "Tag diretti", value: "direct" },
              { label: "Google Tag Manager", value: "gtm" },
            ], { default: "direct" }),
            bool("consentModeEnabled", "Google Consent Mode attivo", true),
            obj("defaultConsent", "Stato predefinito del consenso", [
              sel("ad_storage", "Ad storage", consentOptions, { default: "granted" }),
              sel("ad_user_data", "Ad user data", consentOptions, { default: "granted" }),
              sel("ad_personalization", "Ad personalization", consentOptions, { default: "granted" }),
              sel("analytics_storage", "Analytics storage", consentOptions, { default: "granted" }),
              sel("functionality_storage", "Functionality storage", consentOptions, { default: "granted" }),
              sel("security_storage", "Security storage", consentOptions, { default: "granted" }),
            ]),
            obj("googleTagManager", "Google Tag Manager", [
              bool("enabled", "Attivo"),
              opt("containerId", "Container ID", "string", { hint: "Esempio: GTM-XXXXXXX" }),
            ]),
            obj("googleAnalytics4", "Google Analytics 4", [
              bool("enabled", "Attivo"),
              opt("measurementId", "Measurement ID", "string", { hint: "Esempio: G-XXXXXXXXXX" }),
            ]),
            obj("googleAds", "Google Ads", [
              bool("enabled", "Attivo"),
              opt("conversionId", "Conversion ID", "string", { hint: "Esempio: AW-123456789" }),
              opt("defaultConversionLabel", "Etichetta conversione predefinita"),
            ]),
            obj("metaPixel", "Meta Pixel", [
              bool("enabled", "Attivo"),
              opt("pixelId", "Pixel ID"),
            ]),
            obj("events", "Nomi eventi", [
              req("ctaClick", "CTA click"),
              req("phoneClick", "Phone click"),
              req("whatsappClick", "WhatsApp click"),
              req("emailClick", "Email click"),
              req("formSubmit", "Form submit"),
              req("emailSignup", "Email signup"),
              req("generateLead", "Generate lead"),
              req("thankYouView", "Thank-you view"),
            ]),
          ]),
          obj("trackingNotice", "Banner informativo non bloccante", [
            bool("enabled", "Banner attivo", true),
            req("storageKey", "Chiave browser"),
            num("expiryDays", "Giorni prima di mostrarlo di nuovo", { min: 1, default: 180 }),
            obj("en", "Testi inglesi", noticeFields()),
            obj("it", "Testi italiani", noticeFields()),
          ]),
          obj("forms", "Email catcher e moduli", [
            list("handlers", "Destinazioni centralizzate", [
              req("id", "Handler ID", "string", { pattern: slugPattern }),
              req("label", "Nome leggibile"),
              bool("enabled", "Attivo"),
              sel("purpose", "Scopo", ["newsletter", "diagnostic", "contact", "download", "lead"], { default: "lead" }),
              sel("provider", "Provider", ["disabled", "custom", "mailchimp", "brevo", "convertkit"], { default: "disabled" }),
              opt("endpoint", "Endpoint pubblico"),
              sel("method", "Metodo", ["get", "post"], { default: "post" }),
              sel("submissionMode", "Invio", [
                { label: "Nativo", value: "native" },
                { label: "Fetch/AJAX", value: "fetch" },
              ], { default: "native" }),
              sel("successMode", "Conferma", [
                { label: "Messaggio inline", value: "inline" },
                { label: "Redirect thank-you", value: "redirect" },
              ], { default: "redirect" }),
              req("successPathEn", "Thank-you EN"),
              req("successPathIt", "Thank-you IT"),
              opt("redirectFieldName", "Nome campo redirect del provider"),
              req("eventName", "Evento di conversione"),
              list("hiddenFields", "Campi nascosti", [
                req("name", "Nome"),
                opt("value", "Valore"),
              ], { summary: "{{name}} = {{value}}" }),
            ], { summary: "{{label}} · {{purpose}} · {{enabled}}" }),
          ]),
          obj("thankYou", "Thank-you page", [
            obj("en", "Versione inglese", thankYouFields()),
            obj("it", "Versione italiana", thankYouFields()),
          ]),
        ],
      },
    ],
  };

  const collections = Array.isArray(window.IntentProofCMSCollections)
    ? window.IntentProofCMSCollections
    : [];
  window.IntentProofCMSCollections = [settingsCollection, ...collections];
})();
