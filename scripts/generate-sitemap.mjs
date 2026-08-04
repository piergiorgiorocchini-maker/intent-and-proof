import { readdir, readFile, writeFile } from "node:fs/promises";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_ORIGIN = "https://www.intentandproof.com";
const DIST_DIR = fileURLToPath(new URL("../dist/", import.meta.url));
const SITEMAP_PATH = join(DIST_DIR, "sitemap.xml");

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...await collectHtmlFiles(absolutePath));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(absolutePath);
    }
  }

  return files;
}

function readAttribute(tag, attribute) {
  const match = tag.match(new RegExp(`\\b${attribute}=["']([^"']*)["']`, "i"));
  return match?.[1] ?? "";
}

function isNoindex(html) {
  const metaTags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const robotsTag = metaTags.find((tag) => readAttribute(tag, "name").toLowerCase() === "robots");
  const directives = readAttribute(robotsTag ?? "", "content")
    .split(",")
    .map((directive) => directive.trim().toLowerCase());

  return directives.includes("noindex");
}

function findCanonicalUrl(html) {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];
  const canonicalTag = linkTags.find((tag) => readAttribute(tag, "rel").toLowerCase() === "canonical");
  return readAttribute(canonicalTag ?? "", "href");
}

function findAlternateUrls(html) {
  const linkTags = html.match(/<link\b[^>]*>/gi) ?? [];

  return linkTags
    .filter((tag) => readAttribute(tag, "rel").toLowerCase() === "alternate")
    .map((tag) => ({
      hreflang: readAttribute(tag, "hreflang").toLowerCase(),
      href: readAttribute(tag, "href")
    }))
    .filter((alternate) => alternate.hreflang && alternate.href)
    .map((alternate) => ({
      hreflang: alternate.hreflang,
      href: new URL(alternate.href, SITE_ORIGIN).toString()
    }))
    .filter((alternate) => new URL(alternate.href).origin === SITE_ORIGIN);
}

function fallbackUrl(filePath) {
  const outputPath = relative(DIST_DIR, filePath).split(sep).join("/");

  if (outputPath === "index.html") {
    return `${SITE_ORIGIN}/`;
  }

  if (outputPath.endsWith("/index.html")) {
    return `${SITE_ORIGIN}/${outputPath.slice(0, -"index.html".length)}`;
  }

  return `${SITE_ORIGIN}/${outputPath.replace(/\.html$/, "/")}`;
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const htmlFiles = await collectHtmlFiles(DIST_DIR);
const pages = new Map();

for (const filePath of htmlFiles) {
  const html = await readFile(filePath, "utf8");

  if (isNoindex(html)) {
    continue;
  }

  const canonicalUrl = findCanonicalUrl(html) || fallbackUrl(filePath);
  const parsedUrl = new URL(canonicalUrl, SITE_ORIGIN);

  if (parsedUrl.origin !== SITE_ORIGIN) {
    continue;
  }

  const alternates = findAlternateUrls(html);
  pages.set(parsedUrl.toString(), alternates);
}

const sitemapEntries = [...pages.entries()]
  .sort(([first], [second]) => first.localeCompare(second))
  .map(([url, alternates]) => {
    const alternateLinks = alternates
      .map((alternate) => `    <xhtml:link rel="alternate" hreflang="${escapeXml(alternate.hreflang)}" href="${escapeXml(alternate.href)}" />`)
      .join("\n");
    const linksBlock = alternateLinks ? `\n${alternateLinks}` : "";

    return `  <url>\n    <loc>${escapeXml(url)}</loc>${linksBlock}\n  </url>`;
  })
  .join("\n");

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${sitemapEntries}\n</urlset>\n`;

await writeFile(SITEMAP_PATH, sitemap, "utf8");
console.log(`Generated multilingual sitemap.xml with ${pages.size} indexable URLs.`);
