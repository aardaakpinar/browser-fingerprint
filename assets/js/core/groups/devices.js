import { round, settle } from "../../lib/util.js";

const KEYS = [
	["Q", "KeyQ"],
	["Y", "KeyY"],
	["Z", "KeyZ"],
	[";", "Semicolon"],
];

export default {
	id: "devices",
	load: () =>
		settle({
			dev: async () => {
				const count = { audioinput: 0, videoinput: 0, audiooutput: 0 };
				(await navigator.mediaDevices.enumerateDevices()).forEach((d) => count[d.kind]++);
				return count;
			},
			est: () => navigator.storage.estimate(),
			kb: async () => {
				const map = await navigator.keyboard.getLayoutMap();
				return KEYS.map(([label, code]) => [label, map.get(code)]);
			},
			wa: () => PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable(),
		}),
	rows: [
		{ id: "mics", type: "num", volatile: true, get: (d) => d.dev.audioinput },
		{ id: "cams", type: "num", volatile: true, get: (d) => d.dev.videoinput },
		{ id: "spk", type: "num", volatile: true, get: (d) => d.dev.audiooutput },
		{ id: "pads", type: "num", volatile: true, get: () => [...navigator.getGamepads()].filter(Boolean).length },
		{ id: "quota", type: "num", unit: "GB", volatile: true, get: (d) => round(d.est.quota / 2 ** 30, 1) },
		{ id: "used", type: "num", unit: "MB", volatile: true, get: (d) => round(d.est.usage / 2 ** 20, 1) },
		{ id: "heap", type: "num", unit: "MB", get: () => round(performance.memory.jsHeapSizeLimit / 2 ** 20) },
		{ id: "kbd", type: "pairs", get: (d) => d.kb },
		{ id: "webauthn", type: "bool", get: (d) => d.wa },
	],
};
