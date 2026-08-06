const tool = document.querySelector("[data-diagnostic-tool]");

if (tool) {
	const copyNode = tool.querySelector("[data-diagnostic-copy]");
	let copy = null;

	try {
		copy = JSON.parse(copyNode?.textContent || "null");
	} catch (error) {
		console.error("Diagnostic translation data could not be parsed.", error);
	}

	if (!copy) throw new Error("Missing diagnostic translation data.");

	const state = {
		url: "",
		psi: null,
		psiError: false,
		psiErrorDetail: "",
		result: null
	};

	const scanButton = tool.querySelector("[data-run-scan]");
	const generateButton = tool.querySelector("[data-generate-score]");
	const assessmentPanel = tool.querySelector("[data-assessment-panel]");
	const resultsPanel = tool.querySelector("[data-results]");
	const scanStatus = tool.querySelector("[data-scan-status]");
	const urlInput = tool.querySelector("[name='website']");
	const adsToggle = tool.querySelector("[name='usesAds']");
	const adsFields = tool.querySelector("[data-ads-fields]");

	const answerValues = {
		yes: 100,
		partly: 60,
		no: 15,
		unsure: 35
	};

	const format = (template, values = {}) => Object.entries(values)
		.reduce((output, [key, value]) => output.replaceAll(`{${key}}`, String(value)), template);

	function normaliseUrl(value) {
		const trimmed = value.trim();
		if (!trimmed) return null;
		try {
			return new URL(/^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`);
		} catch {
			return null;
		}
	}

	function numberValue(name) {
		const field = tool.querySelector(`[name='${name}']`);
		const value = Number.parseFloat(field?.value || "");
		return Number.isFinite(value) ? value : null;
	}

	function selectedValue(name) {
		const field = tool.querySelector(`[name='${name}']`);
		if (!field) return "";
		if (field.matches("input[type='radio'], input[type='checkbox']")) {
			return tool.querySelector(`[name='${name}']:checked`)?.value || "";
		}
		return field.value || "";
	}

	function selectedLabel(name) {
		const field = tool.querySelector(`[name='${name}']`);
		if (field instanceof HTMLSelectElement) {
			return field.selectedOptions[0]?.textContent?.trim() || field.value;
		}
		return selectedValue(name);
	}

	function scoreBand(score) {
		return copy.bands.find((band) => score >= band.minimum)?.label || copy.bands.at(-1)?.label || "";
	}

	function clampScore(value) {
		return Math.max(0, Math.min(100, Math.round(value)));
	}

	function auditPassed(audits, id) {
		const score = audits?.[id]?.score;
		return score === null || score === undefined ? null : score >= 0.9;
	}

	function parsePageSpeed(payload, coverage = "full") {
		const lighthouse = payload?.lighthouseResult;
		if (!lighthouse) throw new Error(copy.messages.noLighthouse);

		const runtimeError = lighthouse.runtimeError;
		if (runtimeError?.message) throw new Error(runtimeError.message);

		const categories = lighthouse.categories || {};
		const audits = lighthouse.audits || {};
		const categoryScore = (id) => {
			const value = categories[id]?.score;
			return value === null || value === undefined ? null : Math.round(value * 100);
		};
		const performance = categoryScore("performance");
		const seo = categoryScore("seo");
		const accessibility = categoryScore("accessibility");
		const bestPractices = categoryScore("best-practices");
		const weightedCategories = [
			[performance, 0.4],
			[seo, 0.25],
			[accessibility, 0.15],
			[bestPractices, 0.2]
		].filter(([value]) => value !== null);
		if (!weightedCategories.length) throw new Error(copy.messages.noCategories);
		const availableWeight = weightedCategories.reduce((sum, [, weight]) => sum + weight, 0);
		const score = clampScore(
			weightedCategories.reduce((sum, [value, weight]) => sum + value * weight, 0) / availableWeight
		);

		const signals = [];
		if (coverage !== "full" || weightedCategories.length < 4) signals.push(copy.messages.partialScan);
		if (performance !== null && performance < 70) signals.push(copy.messages.lowPerformance);
		if (seo !== null && seo < 90) signals.push(copy.messages.seoIssues);
		if (bestPractices !== null && bestPractices < 85) signals.push(copy.messages.bestPracticeIssues);
		if (accessibility !== null && accessibility < 85) signals.push(copy.messages.accessibilityIssues);
		if (auditPassed(audits, "document-title") === false) signals.push(copy.messages.missingTitle);
		if (auditPassed(audits, "meta-description") === false) signals.push(copy.messages.missingDescription);
		if (auditPassed(audits, "viewport") === false) signals.push(copy.messages.viewportIssue);
		if (auditPassed(audits, "robots-txt") === false) signals.push(copy.messages.robotsIssue);
		if (auditPassed(audits, "canonical") === false) signals.push(copy.messages.canonicalIssue);

		const metric = (id, fallback = "n/a") => audits[id]?.displayValue || fallback;
		return {
			available: true,
			coverage,
			score,
			performance,
			seo,
			accessibility,
			bestPractices,
			metrics: {
				LCP: metric("largest-contentful-paint"),
				CLS: metric("cumulative-layout-shift"),
				TBT: metric("total-blocking-time"),
				FCP: metric("first-contentful-paint")
			},
			signals
		};
	}

	async function requestPageSpeed(endpointBase, url, categories, timeoutMs = 65000) {
		const endpoint = new URL(endpointBase);
		endpoint.searchParams.set("url", url);
		endpoint.searchParams.set("strategy", "mobile");
		endpoint.searchParams.set("locale", copy.pageSpeedLocale);
		endpoint.searchParams.set("utm_source", "intentandproof.com");
		endpoint.searchParams.set("key", "AIzaSyBnrN4ZxjLT92jQfYMhmqM43F5Dtzlm6cY");
		categories.forEach((category) => endpoint.searchParams.append("category", category));

		const controller = new AbortController();
		const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
		try {
			const response = await fetch(endpoint, {
				headers: { Accept: "application/json" },
				cache: "no-store",
				signal: controller.signal
			});
			const payload = await response.json().catch(() => ({}));
			if (!response.ok) {
				const message = payload?.error?.message || format(copy.messages.requestFailed, { status: response.status });
				const error = new Error(message);
				error.status = response.status;
				throw error;
			}
			return payload;
		} catch (error) {
			if (error?.name === "AbortError") {
				const timeoutError = new Error(copy.messages.timedOut);
				timeoutError.status = 408;
				throw timeoutError;
			}
			throw error;
		} finally {
			window.clearTimeout(timeout);
		}
	}

	async function runPageSpeed(url) {
		const fullCategories = ["performance", "seo", "accessibility", "best-practices"];
		const primary = "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed";
		const fallback = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed";
		const errors = [];

		try {
			return parsePageSpeed(await requestPageSpeed(primary, url, fullCategories), "full");
		} catch (error) {
			errors.push(error);
		}

		try {
			return parsePageSpeed(await requestPageSpeed(fallback, url, fullCategories), "full-fallback");
		} catch (error) {
			errors.push(error);
		}

		const quotaBlocked = errors.some((error) => error?.status === 403 || error?.status === 429);
		if (!quotaBlocked) {
			try {
				return parsePageSpeed(await requestPageSpeed(primary, url, ["performance"], 50000), "performance-only");
			} catch (error) {
				errors.push(error);
			}
		}

		const finalError = errors[errors.length - 1] || new Error(copy.messages.scanFailed);
		finalError.status = finalError.status || errors.find((error) => error?.status)?.status || 0;
		throw finalError;
	}

	function commercialScores() {
		const categoryAnswers = {};
		tool.querySelectorAll("[data-commercial-question]").forEach((question) => {
			const category = question.dataset.category;
			const name = question.dataset.name;
			const value = selectedValue(name);
			if (!categoryAnswers[category]) categoryAnswers[category] = [];
			categoryAnswers[category].push(answerValues[value] ?? 35);
		});

		const categoryScores = {};
		Object.entries(categoryAnswers).forEach(([category, values]) => {
			categoryScores[category] = clampScore(values.reduce((sum, value) => sum + value, 0) / values.length);
		});

		const values = Object.values(categoryScores);
		return {
			score: clampScore(values.reduce((sum, value) => sum + value, 0) / values.length),
			categories: categoryScores
		};
	}

	function metricScore(value, bands) {
		for (const [minimum, score] of bands) {
			if (value >= minimum) return score;
		}
		return 15;
	}

	function inverseRatioScore(value, target) {
		if (!value || !target) return null;
		const ratio = value / target;
		if (ratio <= 1) return 100;
		if (ratio <= 1.25) return 75;
		if (ratio <= 1.75) return 45;
		return 15;
	}

	function adsScore() {
		if (selectedValue("usesAds") !== "yes") return null;

		const impressions = numberValue("adsImpressions");
		const clicks = numberValue("adsClicks");
		const cost = numberValue("adsCost");
		const conversions = numberValue("adsConversions");
		const qualified = numberValue("adsQualified");
		const targetCpl = numberValue("adsTargetCpl");
		const ctr = impressions && clicks !== null ? (clicks / impressions) * 100 : null;
		const conversionRate = clicks && conversions !== null ? (conversions / clicks) * 100 : null;
		const cpl = conversions && cost !== null ? cost / conversions : null;
		const qualifiedRate = conversions && qualified !== null ? (qualified / conversions) * 100 : null;

		const scores = [];
		const signals = [];
		if (ctr !== null) {
			scores.push(metricScore(ctr, [[6, 100], [3, 72], [1.5, 45]]));
			if (ctr < 3) signals.push(copy.messages.lowCtr);
		}
		if (conversionRate !== null) {
			scores.push(metricScore(conversionRate, [[10, 100], [5, 75], [2, 45]]));
			if (conversionRate < 5) signals.push(copy.messages.lowConversion);
		}
		const cplScore = inverseRatioScore(cpl, targetCpl);
		if (cplScore !== null) {
			scores.push(cplScore);
			if (cpl > targetCpl * 1.25) signals.push(copy.messages.highCpl);
		}
		if (qualifiedRate !== null) {
			scores.push(metricScore(qualifiedRate, [[70, 100], [40, 65], [20, 35]]));
			if (qualifiedRate < 40) signals.push(copy.messages.lowLeadQuality);
		}

		["adsTracking", "adsTerms", "adsNegatives", "adsLanding"].forEach((name) => {
			const value = selectedValue(name);
			scores.push(answerValues[value] ?? 35);
		});
		if (selectedValue("adsTracking") !== "yes") signals.push(copy.messages.trackingWeak);
		if (selectedValue("adsTerms") !== "yes") signals.push(copy.messages.termsWeak);
		if (selectedValue("adsNegatives") !== "yes") signals.push(copy.messages.negativesWeak);
		if (selectedValue("adsLanding") !== "yes") signals.push(copy.messages.landingWeak);

		return {
			score: clampScore(scores.reduce((sum, value) => sum + value, 0) / scores.length),
			metrics: {
				CTR: ctr === null ? null : `${ctr.toFixed(1)}%`,
				CVR: conversionRate === null ? null : `${conversionRate.toFixed(1)}%`,
				CPL: cpl === null ? null : `${cpl.toFixed(2)}`,
				[copy.labels.qualifiedLeadRate || "Qualified lead rate"]: qualifiedRate === null ? null : `${qualifiedRate.toFixed(0)}%`
			},
			signals
		};
	}

	function buildResult() {
		const commercial = commercialScores();
		const technical = state.psi || {
			available: false,
			score: null,
			performance: null,
			seo: null,
			accessibility: null,
			bestPractices: null,
			metrics: {},
			signals: [state.psiErrorDetail || copy.messages.technicalExcluded]
		};
		const ads = adsScore();
		let total;
		if (technical.available && ads) total = clampScore(technical.score * 0.4 + commercial.score * 0.4 + ads.score * 0.2);
		else if (technical.available) total = clampScore(technical.score * 0.5 + commercial.score * 0.5);
		else if (ads) total = clampScore(commercial.score * 0.7 + ads.score * 0.3);
		else total = commercial.score;

		const diagnosticAreas = { ...commercial.categories };
		if (technical.available) diagnosticAreas.technical = technical.score;
		if (ads) diagnosticAreas.ads = ads.score;
		const sortedAreas = Object.entries(diagnosticAreas).sort((a, b) => a[1] - b[1]);
		const [priorityKey, priorityScore] = sortedAreas[0];
		const [strongestKey, strongestScore] = sortedAreas[sortedAreas.length - 1];
		const signals = [...technical.signals, ...(ads?.signals || [])].slice(0, 5);

		return {
			total,
			band: scoreBand(total),
			technical,
			commercial,
			ads,
			priorityKey,
			priorityScore,
			strongestKey,
			strongestScore,
			priorityLabel: copy.labels[priorityKey],
			strongestLabel: copy.labels[strongestKey],
			action: copy.actions[priorityKey],
			signals
		};
	}

	function renderMetrics(result) {
		const metrics = [];
		Object.entries(result.technical.metrics || {}).forEach(([label, value]) => {
			if (value && value !== "n/a") metrics.push(`${label}: ${value}`);
		});
		Object.entries(result.ads?.metrics || {}).forEach(([label, value]) => {
			if (value) metrics.push(`${label}: ${value}`);
		});
		const container = tool.querySelector("[data-result-metrics]");
		container.replaceChildren(...metrics.map((metric) => {
			const span = document.createElement("span");
			span.className = "results-metric";
			span.textContent = metric;
			return span;
		}));
	}

	function renderSignals(signals) {
		const list = tool.querySelector("[data-result-signals]");
		const values = signals.length ? signals : [copy.messages.noSignals];
		list.replaceChildren(...values.map((signal) => {
			const item = document.createElement("li");
			item.textContent = signal;
			return item;
		}));
	}

	function renderResult(result) {
		tool.querySelector("[data-total-score]").textContent = result.total;
		tool.querySelector("[data-result-band]").textContent = result.band;
		tool.querySelector("[data-result-summary]").textContent = format(copy.messages.strongestSummary, {
			strongest: result.strongestLabel,
			strongestScore: result.strongestScore,
			priority: result.priorityLabel,
			priorityScore: result.priorityScore
		});
		tool.querySelector("[data-technical-score]").textContent = result.technical.available
			? `${result.technical.score}/100`
			: copy.messages.unavailable;
		tool.querySelector("[data-commercial-score]").textContent = `${result.commercial.score}/100`;
		tool.querySelector("[data-ads-score]").textContent = result.ads ? `${result.ads.score}/100` : copy.messages.notIncluded;
		tool.querySelector("[data-priority-label]").textContent = result.priorityLabel;
		tool.querySelector("[data-priority-action]").textContent = result.action;
		renderSignals(result.signals);
		renderMetrics(result);
		resultsPanel.hidden = false;
		resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function buildEmailBody(result) {
		const businessType = selectedLabel("businessType");
		const objective = selectedLabel("objective");
		return [
			copy.email.title,
			"",
			`${copy.email.website}: ${state.url}`,
			`${copy.email.businessType}: ${businessType}`,
			`${copy.email.objective}: ${objective}`,
			`${copy.email.total}: ${result.total}/100 — ${result.band}`,
			`${copy.email.technical}: ${result.technical.available ? `${result.technical.score}/100` : copy.messages.unavailable}`,
			`${copy.email.commercial}: ${result.commercial.score}/100`,
			`${copy.email.ads}: ${result.ads ? `${result.ads.score}/100` : copy.messages.notIncluded}`,
			`${copy.email.priority}: ${result.priorityLabel}`,
			`${copy.email.action}: ${result.action}`,
			"",
			copy.email.request
		].join("\n");
	}

	scanButton.addEventListener("click", async () => {
		const url = normaliseUrl(urlInput.value);
		if (!url) {
			tool.querySelector("[data-url-error]").hidden = false;
			return;
		}

		tool.querySelector("[data-url-error]").hidden = true;
		state.url = url.href;
		urlInput.value = url.href;
		state.psi = null;
		state.psiError = false;
		state.psiErrorDetail = "";
		state.result = null;
		resultsPanel.hidden = true;
		assessmentPanel.hidden = false;
		generateButton.disabled = true;
		scanButton.disabled = true;
		scanStatus.dataset.state = "running";
		scanStatus.textContent = copy.messages.running;
		assessmentPanel.scrollIntoView({ behavior: "smooth", block: "start" });

		try {
			state.psi = await runPageSpeed(url.href);
			scanStatus.dataset.state = "complete";
			const partial = state.psi.coverage === "full" ? "" : copy.messages.partial;
			scanStatus.textContent = format(copy.messages.complete, { partial, score: state.psi.score });
		} catch (error) {
			state.psiError = true;
			const status = error?.status || 0;
			if (status === 429) state.psiErrorDetail = copy.messages.quota;
			else if (status === 403) state.psiErrorDetail = copy.messages.rejected;
			else if (status === 408) state.psiErrorDetail = copy.messages.timeout;
			else state.psiErrorDetail = copy.messages.genericError;
			scanStatus.dataset.state = "error";
			scanStatus.textContent = `${state.psiErrorDetail} ${copy.messages.continue}`;
			console.warn("PageSpeed diagnostic error:", error);
		} finally {
			generateButton.disabled = false;
			scanButton.disabled = false;
		}
	});

	adsToggle.addEventListener("change", () => {
		adsFields.hidden = adsToggle.value !== "yes";
	});

	generateButton.addEventListener("click", () => {
		const unanswered = [...tool.querySelectorAll("[data-commercial-question]")]
			.some((question) => !selectedValue(question.dataset.name));
		if (unanswered) {
			tool.querySelector("[data-question-error]").hidden = false;
			return;
		}
		tool.querySelector("[data-question-error]").hidden = true;
		state.result = buildResult();
		renderResult(state.result);
	});

	tool.querySelector("[data-send-result]").addEventListener("click", () => {
		if (!state.result) return;
		const name = tool.querySelector("[name='contactName']")?.value.trim() || "";
		const email = tool.querySelector("[name='contactEmail']")?.value.trim() || "";
		const body = `${buildEmailBody(state.result)}\n\n${copy.email.name}: ${name}\n${copy.email.email}: ${email}`;
		window.location.href = `mailto:piergiorgio.rocchini@gmail.com?subject=${encodeURIComponent(copy.email.subject)}&body=${encodeURIComponent(body)}`;
	});

	tool.querySelector("[data-copy-result]").addEventListener("click", async () => {
		if (!state.result) return;
		const button = tool.querySelector("[data-copy-result]");
		try {
			await navigator.clipboard.writeText(buildEmailBody(state.result));
			button.textContent = copy.messages.copied;
			setTimeout(() => { button.textContent = copy.messages.copy; }, 1800);
		} catch {
			button.textContent = copy.messages.copyUnavailable;
		}
	});
}