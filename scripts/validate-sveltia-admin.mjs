import { readFile } from "node:fs/promises";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const admin = new URL("public/admin/", root);
const files = ["cms-model.js", "cms-settings.js", "cms-rules.js", "cms-init.js"];

const source = Object.fromEntries(
	await Promise.all(
		files.map(async (file) => [file, await readFile(new URL(file, admin), "utf8")])
	)
);

const index = await readFile(new URL("index.html", admin), "utf8");
for (const file of files) {
	if (!index.includes(`/admin/${file}`)) {
		throw new Error(`Missing admin script reference: ${file}`);
	}
}

if (!index.includes("@sveltia/cms@0.172.4")) {
	throw new Error("Sveltia CMS must use the reviewed pinned version.");
}

let initializedConfig;
const context = vm.createContext({
	console,
	document: { body: { innerHTML: "" } },
	window: {
		CMS: {
			init({ config }) {
				initializedConfig = config;
			},
		},
	},
});

for (const file of files) {
	new vm.Script(source[file], { filename: file }).runInContext(context);
}

if (!initializedConfig) throw new Error("Sveltia CMS was not initialized.");
if (initializedConfig.load_config_file !== false) throw new Error("External config loading must remain disabled.");
if (initializedConfig.backend?.name !== "github") throw new Error("GitHub backend is missing.");
if (initializedConfig.backend?.repo !== "piergiorgiorocchini-maker/intent-and-proof") {
	throw new Error("Unexpected CMS repository.");
}

const collections = initializedConfig.collections ?? [];
const expected = ["settings", "authors", "categories", "articles", "pages", "products"];
for (const name of expected) {
	if (!collections.some((collection) => collection.name === name)) {
		throw new Error(`Missing CMS collection: ${name}`);
	}
}

const products = collections.find((collection) => collection.name === "products");
const sections = products?.fields?.find((field) => field.name === "sections");
if (sections?.types?.length !== 16) {
	throw new Error(`Expected 16 commercial section types, found ${sections?.types?.length ?? 0}.`);
}

const settings = collections.find((collection) => collection.name === "settings");
const globalFile = settings?.files?.find((file) => file.name === "global");
const settingFields = globalFile?.fields?.map((field) => field.name) ?? [];
for (const name of ["site", "tracking", "trackingNotice", "forms", "thankYou"]) {
	if (!settingFields.includes(name)) throw new Error(`Missing global setting group: ${name}`);
}

const globalSettings = await readFile(new URL("src/content/settings/global.md", root), "utf8");
for (const consentName of [
	"ad_storage",
	"ad_user_data",
	"ad_personalization",
	"analytics_storage",
	"functionality_storage",
	"security_storage",
]) {
	if (!globalSettings.includes(`${consentName}: granted`)) {
		throw new Error(`Tracking default must remain granted for ${consentName}.`);
	}
}

for (const handlerId of ["newsletter", "diagnostic", "contact"]) {
	if (!globalSettings.includes(`- id: ${handlerId}`)) {
		throw new Error(`Missing centralized form handler: ${handlerId}`);
	}
}

for (const page of ["src/pages/thank-you/index.astro", "src/pages/it/grazie/index.astro"]) {
	await readFile(new URL(page, root), "utf8");
}

console.log(
	`Sveltia admin validated: ${collections.length} collections, ${sections.types.length} commercial blocks, centralized tracking and forms.`
);
