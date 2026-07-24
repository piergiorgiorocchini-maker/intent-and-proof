---
site:
  brand: "Intent & Proof"
  baseUrl: "https://www.intentandproof.com"
  country: "IT"
  defaultLocale: en
tracking:
  enabled: true
  debug: false
  delivery: direct
  consentModeEnabled: true
  defaultConsent:
    ad_storage: granted
    ad_user_data: granted
    ad_personalization: granted
    analytics_storage: granted
    functionality_storage: granted
    security_storage: granted
  googleTagManager:
    enabled: false
    containerId: ""
  googleAnalytics4:
    enabled: false
    measurementId: ""
  googleAds:
    enabled: false
    conversionId: ""
    defaultConversionLabel: ""
  metaPixel:
    enabled: false
    pixelId: ""
  events:
    ctaClick: cta_click
    phoneClick: phone_click
    whatsappClick: whatsapp_click
    emailClick: email_click
    formSubmit: form_submit
    emailSignup: sign_up
    generateLead: generate_lead
    thankYouView: thank_you_view
trackingNotice:
  enabled: true
  storageKey: intent-proof-tracking-notice
  expiryDays: 180
  en:
    title: "Analytics notice"
    text: "This site uses analytics and advertising measurement technologies to understand visits, enquiries and commercial performance. Tracking is active when configured."
    dismissLabel: "Got it"
    privacyLabel: "Privacy information"
    privacyHref: "/privacy/"
  it:
    title: "Informativa analytics"
    text: "Questo sito utilizza tecnologie di analisi e misurazione pubblicitaria per comprendere visite, richieste e risultati commerciali. Il tracciamento è attivo quando configurato."
    dismissLabel: "Ho capito"
    privacyLabel: "Informativa privacy"
    privacyHref: "/it/privacy/"
forms:
  handlers:
    - id: newsletter
      label: "Newsletter and research notes"
      enabled: false
      purpose: newsletter
      provider: disabled
      endpoint: ""
      method: post
      submissionMode: fetch
      successMode: inline
      successPathEn: "/thank-you/?type=newsletter"
      successPathIt: "/it/grazie/?type=newsletter"
      eventName: sign_up
      hiddenFields:
        - name: source
          value: newsletter
    - id: diagnostic
      label: "Commercial diagnostic"
      enabled: false
      purpose: diagnostic
      provider: disabled
      endpoint: ""
      method: post
      submissionMode: native
      successMode: redirect
      successPathEn: "/thank-you/?type=diagnostic"
      successPathIt: "/it/grazie/?type=diagnostic"
      eventName: generate_lead
      hiddenFields:
        - name: source
          value: diagnostic
    - id: contact
      label: "General contact"
      enabled: false
      purpose: contact
      provider: disabled
      endpoint: ""
      method: post
      submissionMode: native
      successMode: redirect
      successPathEn: "/thank-you/?type=contact"
      successPathIt: "/it/grazie/?type=contact"
      eventName: generate_lead
      hiddenFields:
        - name: source
          value: contact
thankYou:
  en:
    eyebrow: "Request received"
    title: "Thank you. Your next step is clear."
    text: "Your information has been received. We will review the context and use it to decide the most useful next action."
    nextStepsTitle: "What happens next"
    nextSteps:
      - "We review the information and the source of the request."
      - "Commercial enquiries are assessed before a recommendation is made."
      - "Relevant research remains available while you wait."
    primaryLabel: "Read the latest research"
    primaryHref: "/blog/"
    secondaryLabel: "Return home"
    secondaryHref: "/"
  it:
    eyebrow: "Richiesta ricevuta"
    title: "Grazie. Il prossimo passo è chiaro."
    text: "Le informazioni sono state ricevute. Esamineremo il contesto per individuare l'azione successiva più utile."
    nextStepsTitle: "Cosa succede ora"
    nextSteps:
      - "Esaminiamo le informazioni e la provenienza della richiesta."
      - "Le richieste commerciali vengono valutate prima di formulare una raccomandazione."
      - "Nel frattempo restano disponibili gli approfondimenti pertinenti."
    primaryLabel: "Leggi gli ultimi articoli"
    primaryHref: "/it/blog/"
    secondaryLabel: "Torna alla home"
    secondaryHref: "/"
---
