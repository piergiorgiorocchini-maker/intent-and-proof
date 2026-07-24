(() => {
  const collections = window.IntentProofCMSCollections;

  if (!window.CMS || !Array.isArray(collections) || collections.length === 0) {
    document.body.innerHTML = "<main style='font:16px system-ui;padding:2rem'><h1>CMS configuration error</h1><p>The Sveltia content model could not be loaded.</p></main>";
    throw new Error("Intent & Proof CMS collections are unavailable.");
  }

  window.CMS.init({
    config: {
      load_config_file: false,
      backend: {
        name: "github",
        repo: "piergiorgiorocchini-maker/intent-and-proof",
        branch: "agent/sveltia-content-system",
      },
      site_url: "https://www.intentandproof.com",
      display_url: "https://www.intentandproof.com",
      logo_url: "/favicon.svg",
      show_preview_links: true,
      media_folder: "public/images/uploads",
      public_folder: "/images/uploads",
      slug: {
        encoding: "ascii",
        clean_accents: true,
        sanitize_replacement: "-",
      },
      collections,
    },
  });
})();
