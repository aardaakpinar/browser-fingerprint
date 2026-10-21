import { sha256 } from "../../lib/sha256.js";

const options = () => Intl.DateTimeFormat().resolvedOptions();

// Smallest step performance.now() reports, in microseconds (browsers coarsen it on purpose).
function timerResolution() {
	let min = 1e9;
	let prev = performance.now();
	for (let i = 0; i < 3000; i++) {
		const now = performance.now();
		if (now > prev) {
			min = Math.min(min, now - prev);
			prev = now;
		}
	}
	return min < 1e9 ? Math.round(min * 1000) : null;
}

export default {
	id: "locale",
	load: async () => ({
		math: (await sha256([Math.tan(-1e300), Math.sinh(1), Math.expm1(1), Math.cosh(10), Math.atanh(0.5)].join("|"))).slice(0, 16),
		timer: timerResolution(),
	}),
	rows: [
		{ id: "locale", type: "text", get: () => options().locale },
		{ id: "cal", type: "text", get: () => options().calendar },
		{ id: "numsys", type: "text", get: () => options().numberingSystem },
		{ id: "numfmt", type: "text", get: () => new Intl.NumberFormat().format(1234567.891) },
		{ id: "datefmt", type: "text", get: () => new Date(2020, 11, 31, 23, 59).toLocaleString() },
		{ id: "timer", type: "num", unit: "µs", volatile: true, get: (d) => d.timer },
		{ id: "math", type: "text", get: (d) => d.math },
		{ id: "ref", type: "text", volatile: true, get: () => document.referrer },
		{ id: "hist", type: "num", volatile: true, get: () => history.length },
		{ id: "charset", type: "text", get: () => document.characterSet },
	],
};
