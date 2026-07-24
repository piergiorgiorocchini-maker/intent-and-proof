(() => {
  const collections = window.IntentProofCMSCollections || [];
  const collection = (name) => collections.find((item) => item.name === name);
  const field = (fields, name) => (fields || []).find((item) => item.name === name);

  const articles = collection("articles");
  const comments = field(articles?.fields, "comments");
  const provider = field(comments?.fields, "provider");
  if (provider) {
    provider.widget = "select";
    provider.options = ["giscus"];
    provider.default = "giscus";
  }

  const removeBooleanFilters = (relationField) => {
    if (!relationField?.filters) return;
    relationField.filters = relationField.filters.filter((filter) => filter.field !== "fields.draft");
  };

  removeBooleanFilters(field(articles?.fields, "relatedArticles"));
  for (const name of ["articles", "pages", "products"]) {
    const related = field(collection(name)?.fields, "relatedContent");
    removeBooleanFilters(field(related?.fields, "manualArticleIds"));
  }

  const products = collection("products");
  const hero = field(products?.fields, "hero");
  if (hero) {
    hero.required = true;
    const primaryAction = field(hero.fields, "primaryAction");
    if (primaryAction) primaryAction.required = true;
  }

  const sections = field(products?.fields, "sections");
  const sectionTypes = Object.fromEntries((sections?.types || []).map((type) => [type.name, type]));
  const requireField = (typeName, fieldName) => {
    const target = field(sectionTypes[typeName]?.fields, fieldName);
    if (target) target.required = true;
  };

  const requiredLists = {
    trust: ["items"],
    problem: ["costs"],
    outcomes: ["items"],
    process: ["steps"],
    metrics: ["items"],
    audience: ["fitItems", "notFitItems"],
    integrations: ["items"],
    pricing: ["plans"],
    "risk-reversal": ["commitments"],
    faq: ["items"],
    "lead-form": ["fields"],
    contact: ["items"],
  };

  for (const [typeName, names] of Object.entries(requiredLists)) {
    for (const fieldName of names) requireField(typeName, fieldName);
  }

  const pricingPlans = field(sectionTypes.pricing?.fields, "plans");
  const pricingAction = field(pricingPlans?.fields, "action");
  if (pricingAction) pricingAction.required = true;

  const finalPrimaryAction = field(sectionTypes["final-cta"]?.fields, "primaryAction");
  if (finalPrimaryAction) finalPrimaryAction.required = true;
})();
