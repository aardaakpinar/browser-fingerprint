import { round } from "../../lib/util.js";

const ms = (x) => (isFinite(x) && x >= 0 ? round(x) : null);

export default {
	id: "connection",
	load: () => ({ c: navigator.connection, n: performance.getEntriesByType("navigation")[0] }),
	rows: [
		{ id: "proto", type: "text", volatile: true, get: (d) => d.n.nextHopProtocol },
		{ id: "host", type: "text", volatile: true, get: () => location.host },
		{ id: "secure", type: "bool", volatile: true, get: () => isSecureContext },
		{ id: "coi", type: "bool", volatile: true, get: () => self.crossOriginIsolated },
		{ id: "ctype", type: "text", volatile: true, get: (d) => d.c.type },
		{ id: "etype", type: "text", volatile: true, get: (d) => d.c.effectiveType },
		{ id: "dlmax", type: "num", unit: "Mb/s", volatile: true, get: (d) => d.c.downlinkMax },
		{ id: "dl", type: "num", unit: "Mb/s", volatile: true, get: (d) => d.c.downlink },
		{ id: "rtt", type: "num", unit: "ms", volatile: true, get: (d) => d.c.rtt },
		{ id: "saver", type: "bool", volatile: true, get: (d) => d.c.saveData },
		{ id: "online", type: "bool", volatile: true, get: () => navigator.onLine },
		{
			id: "timings",
			type: "pairs",
			unit: "ms",
			volatile: true,
			get: ({ n }) => [
				["DNS", ms(n.domainLookupEnd - n.domainLookupStart)],
				["TCP", ms(n.connectEnd - n.connectStart)],
				["TLS", n.secureConnectionStart > 0 ? ms(n.connectEnd - n.secureConnectionStart) : null],
				["TTFB", ms(n.responseStart - n.requestStart)],
			],
		},
		{ id: "psize", type: "num", unit: "KB", volatile: true, get: ({ n }) => (n.transferSize ? round(n.transferSize / 1024, 1) : null) },
	],
};
