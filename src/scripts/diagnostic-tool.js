const tool = document.querySelector("[data-diagnostic-tool]");

if (tool) {
	const state = {
		url: "",
		psi: null,
		psiError: false,
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

	const labels = {
		technical: "Technical foundation",
		intent: "Intent alignment",
		proof: "Proof strength",
		conversion: "Conversion path",
		search: "Search & Ads readiness",
		measurement: "Measurement integrity",
		ads: "Google Ads efficiency"
	};

	const actions = {
		technical: "Fix the slowest mobile experience and the failed SEO audits before buying more traffic.",
		intent: "Build one priority page around a specific buyer, problem and desired outcome instead of a broad list of services.",
		proof: "Place quantified evidence, cases or credible reviews beside the main decision and conversion points.",
		conversion: "Reduce the primary path to one obvious action and remove unnecessary friction from the contact step.",
		search: "Align each high-intent query or campaign with a dedicated landing page and a precise offer.",
		measurement: "Track meaningful enquiries and connect them to their source before optimising spend or content.",
		ads: "Review search terms, query intent, conversion quality and landing-page relevance before changing bids or budgets."
	};

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
		return tool.querySelector(`[name='${name}']:checked`)?.value
			|| tool.querySelector(`[name='${name}']`)?.value
			|| "";
	}

	function scoreBand(score) {
		if (score >= 80) return "Strong foundation";
		if (score >= 65) return "Promising, but leaking";
		if (score >= 45) return "Fragile acquisition system";
		return "High-priority leaks";
	}

	function clampScore(value) {
		return Math.max(0, Math.min(100, Math.round(value)));
	}

	function auditPassed(audits, id) {
		const score = audits?.[id]?.score;
		return score === null || score === undefined ? null : score >= 0.9;
	}

	function parsePageSpeed(payload) {
		const lighthouse = payload?.lighthouseResult;
		if (!lighthouse) throw new Error("PageSpeed returned no Lighthouse result.");

		const categories = lighthouse.categories || {};
		const audits = lighthouse.audits || {};
		const categoryScore = (id) => Math.round((categories[id]?.score ?? 0) * 100);
		const performance = categoryScore("performance");
		const seo = categoryScore("seo");
		const accessibility = categoryScore("accessibility");
		const bestPractices = categoryScore("best-practices");
		const score = clampScore(
			performance * 0.4 + seo * 0.25 + accessibility * 0.15 + bestPractices * 0.2
		);

		const signals = [];
		if (performance < 70) signals.push("Mobile performance is likely suppressing conversion efficiency.");
		if (seo < 90) signals.push("The technical SEO foundation contains failed or incomplete checks.");
		if (bestPractices < 85) signals.push("Browser, security or implementation best-practice issues need review.");
		if (accessibility < 85) signals.push("Accessibility friction may also be creating usability friction.");
		if (auditPassed(audits, "document-title") === false) signals.push("The page title is missing or inadequate.");
		if (auditPassed(audits, "meta-description") === false) signals.push("The meta description is missing or inadequate.");
		if (auditPassed(audits, "viewport") === false) signals.push("The mobile viewport is not configured correctly.");
		if (auditPassed(audits, "robots-txt") === false) signals.push("robots.txt contains a crawlability problem.");
		if (auditPassed(audits, "canonical") === false) signals.push("The page has a canonicalisation problem.");

		const metric = (id, fallback = "n/a") => audits[id]?.displayValue || fallback;
		return {
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

	async function runPageSpeed(url) {
		const endpoint = new URL("https://www.googleapis.com/pagespeedonline/v5/runPagespeed");
		endpoint.searchParams.set("url", url);
		endpoint.searchParams.set("strategy", "mobile");
		["performance", "seo", "accessibility", "best-practices"].forEach((category) => {
			endpoint.searchParams.append("category", category);
		});

		const response = await fetch(endpoint, { headers: { Accept: "application/json" } });
		if (!response.ok) throw new Error(`PageSpeed request failed (${response.status}).`);
		return parsePageSpeed(await response.json());
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
			if (ctr < 3) signals.push("Low CTR suggests weak query-to-ad relevance, targeting or offer clarity.");
		}
		if (conversionRate !== null) {
			scores.push(metricScore(conversionRate, [[10, 100], [5, 75], [2, 45]]));
			if (conversionRate < 5) signals.push("Low click-to-lead conversion points toward landing-page, proof or form friction.");
		}
		const cplScore = inverseRatioScore(cpl, targetCpl);
		if (cplScore !== null) {
			scores.push(cplScore);
			if (cpl > targetCpl * 1.25) signals.push("Cost per lead is materially above the stated target.");
		}
		if (qualifiedRate !== null) {
			scores.push(metricScore(qualifiedRate, [[70, 100], [40, 65], [20, 35]]));
			if (qualifiedRate < 40) signals.push("Lead quality indicates weak search-intent control or insufficient qualification.");
		}

		["adsTracking", "adsTerms", "adsNegatives", "adsLanding"].forEach((name) => {
			const value = selectedValue(name);
			scores.push(answerValues[value] ?? 35);
		});
		if (selectedValue("adsTracking") !== "yes") signals.push("Conversion tracking is not strong enough to guide automated bidding or budget decisions.");
		if (selectedValue("adsTerms") !== "yes") signals.push("Search-term review is too weak to identify wasted or irrelevant demand.");
		if (selectedValue("adsNegatives") !== "yes") signals.push("Negative-keyword control is likely allowing avoidable spend.");
		if (selectedValue("adsLanding") !== "yes") signals.push("Traffic is not consistently sent to a dedicated, query-relevant landing page.");

		return {
			score: clampScore(scores.reduce((sum, value) => sum + value, 0) / scores.length),
			metrics: {
				CTR: ctr === null ? null : `${ctr.toFixed(1)}%`,
				CVR: conversionRate === null ? null : `${conversionRate.toFixed(1)}%`,
				CPL: cpl === null ? null : `€${cpl.toFixed(2)}`,
				"Qualified lead rate": qualifiedRate === null ? null : `${qualifiedRate.toFixed(0)}%`
			},
			signals
		};
	}

	function buildResult() {
		const commercial = commercialScores();
		const technical = state.psi || {
			score: 50,
			performance: null,
			seo: null,
			accessibility: null,
			bestPractices: null,
			metrics: {},
			signals: ["The live technical scan was unavailable, so the technical score is provisional."]
		};
		const ads = adsScore();
		const total = ads
			? clampScore(technical.score * 0.4 + commercial.score * 0.4 + ads.score * 0.2)
			: clampScore(technical.score * 0.5 + commercial.score * 0.5);

		const diagnosticAreas = {
			technical: technical.score,
			...commercial.categories
		};
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
			priorityLabel: labels[priorityKey],
			strongestLabel: labels[strongestKey],
			action: actions[priorityKey],
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
		tool.querySelector("[data-result-metrics]").innerHTML = metrics
			.map((metric) => `<span class="results-metric">${metric}</span>`)
			.join("");
	}

	function renderResult(result) {
		tool.querySelector("[data-total-score]").textContent = result.total;
		tool.querySelector("[data-result-band]").textContent = result.band;
		tool.querySelector("[data-result-summary]").textContent =
			`Your strongest area is ${result.strongestLabel} (${result.strongestScore}/100). `
			+ `The priority leak is ${result.priorityLabel} (${result.priorityScore}/100).`;
		tool.querySelector("[data-technical-score]").textContent = `${result.technical.score}/100`;
		tool.querySelector("[data-commercial-score]").textContent = `${result.commercial.score}/100`;
		tool.querySelector("[data-ads-score]").textContent = result.ads ? `${result.ads.score}/100` : "Not included";
		tool.querySelector("[data-priority-label]").textContent = result.priorityLabel;
		tool.querySelector("[data-priority-action]").textContent = result.action;
		tool.querySelector("[data-result-signals]").innerHTML = result.signals.length
			? result.signals.map((signal) => `<li>${signal}</li>`).join("")
			: "<li>No critical technical or Ads signal was detected in this first-pass scan.</li>";
		renderMetrics(result);
		resultsPanel.hidden = false;
		resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
	}

	function buildEmailBody(result) {
		const businessType = tool.querySelector("[name='businessType']")?.value || "";
		const objective = tool.querySelector("[name='objective']")?.value || "";
		return [
			"Intent & Proof Diagnostic",
			"",
			`Website: ${state.url}`,
			`Business type: ${businessType}`,
			`Primary objective: ${objective}`,
			`Total score: ${result.total}/100 — ${result.band}`,
			`Technical score: ${result.technical.score}/100`,
			`Commercial score: ${result.commercial.score}/100`,
			`Ads score: ${result.ads ? `${result.ads.score}/100` : "Not included"}`,
			`Priority leak: ${result.priorityLabel}`,
			`Recommended first action: ${result.action}`,
			"",
			"I would like a professional review of this result."
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
		assessmentPanel.hidden = false;
		generateButton.disabled = true;
		scanButton.disabled = true;
		scanStatus.dataset.state = "running";
		scanStatus.textContent = "Running the mobile technical scan. Complete the commercial checks while it works.";
		assessmentPanel.scrollIntoView({ behavior: "smooth", block: "start" });

		try {
			state.psi = await runPageSpeed(url.href);
			scanStatus.dataset.state = "complete";
			scanStatus.textContent = `Technical scan complete: ${state.psi.score}/100.`;
		} catch (error) {
			state.psiError = true;
			scanStatus.dataset.state = "error";
			scanStatus.textContent = "The live PageSpeed scan was unavailable. You can still generate a provisional diagnostic.";
			console.warn(error);
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
		const body = `${buildEmailBody(state.result)}\n\nName: ${name}\nEmail: ${email}`;
		window.location.href = `mailto:piergiorgio.rocchini@gmail.com?subject=${encodeURIComponent("Intent & Proof diagnostic review")}&body=${encodeURIComponent(body)}`;
	});

	tool.querySelector("[data-copy-result]").addEventListener("click", async () => {
		if (!state.result) return;
		const button = tool.querySelector("[data-copy-result]");
		try {
			await navigator.clipboard.writeText(buildEmailBody(state.result));
			button.textContent = "Result copied";
			setTimeout(() => { button.textContent = "Copy result"; }, 1800);
		} catch {
			button.textContent = "Copy unavailable";
		}
	});
}
