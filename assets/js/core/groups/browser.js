const webStorage = (k) => {
	try {
		window[k].setItem("_t", "1");
		window[k].removeItem("_t");
		return true;
	} catch {
		return false;
	}
};

// navigator.doNotTrack is "1" / "0" / null, older browsers use "yes" / "no".
const doNotTrack = () => {
	const v = String(navigator.doNotTrack ?? window.doNotTrack);
	return ["1", "yes"].includes(v) ? true : ["0", "no"].includes(v) ? false : null;
};

export default {
	id: "browser",
	rows: [
		{ id: "ua", type: "text", get: () => navigator.userAgent },
		{ id: "platform", type: "text", get: () => navigator.userAgentData?.platform || navigator.platform },
		{ id: "langs", type: "list", get: () => [...(navigator.languages || [navigator.language])] },
		{ id: "tz", type: "text", get: () => Intl.DateTimeFormat().resolvedOptions().timeZone },
		{
			id: "utc",
			type: "text",
			volatile: true, // changes with daylight saving
			get: () => {
				const h = -new Date().getTimezoneOffset() / 60;
				return "UTC" + (h >= 0 ? "+" : "") + h;
			},
		},
		{ id: "cookies", type: "bool", get: () => navigator.cookieEnabled },
		{ id: "dnt", type: "bool", get: doNotTrack },
		{ id: "storage", type: "list", get: () => ["localStorage", "sessionStorage"].filter(webStorage).concat(window.indexedDB ? ["IndexedDB"] : []) },
		{ id: "pdf", type: "bool", get: () => navigator.pdfViewerEnabled },
	],
};
