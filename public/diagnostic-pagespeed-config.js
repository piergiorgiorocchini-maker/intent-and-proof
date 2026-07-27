(() => {
	const pageSpeedApiKey = "AIzaSyBnrN4ZxjlT92jQfYMhmqM43F5Dtzlm6cY";
	const nativeFetch = window.fetch.bind(window);

	window.fetch = (input, init) => {
		try {
			const requestUrl = input instanceof Request
				? new URL(input.url)
				: new URL(String(input), window.location.href);
			const isPageSpeedRequest = requestUrl.hostname === "pagespeedonline.googleapis.com"
				|| (requestUrl.hostname === "www.googleapis.com"
					&& requestUrl.pathname.includes("/pagespeedonline/"));

			if (isPageSpeedRequest) {
				requestUrl.searchParams.set("key", pageSpeedApiKey);
				return nativeFetch(requestUrl.toString(), init);
			}
		} catch {
			// Fall through to the browser's native fetch behaviour.
		}

		return nativeFetch(input, init);
	};
})();
