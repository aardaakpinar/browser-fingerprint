// Detailed browser identity (User-Agent Client Hints). Chromium only.
export default {
	id: "uach",
	load: () => navigator.userAgentData.getHighEntropyValues(["architecture", "bitness", "model", "platformVersion", "uaFullVersion", "fullVersionList"]),
	rows: [
		{ id: "arch", type: "text", get: (h) => [h.architecture, h.bitness && `(${h.bitness}-bit)`].filter(Boolean).join(" ") },
		{ id: "model", type: "text", get: (h) => h.model },
		{ id: "pver", type: "text", get: (h) => h.platformVersion },
		{ id: "fver", type: "text", get: (h) => h.uaFullVersion },
		{ id: "brands", type: "list", get: (h) => h.fullVersionList.map((b) => `${b.brand} ${b.version}`) },
	],
};
