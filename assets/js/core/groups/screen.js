import { mq } from "../../lib/util.js";

export default {
	id: "screen",
	rows: [
		{ id: "res", type: "size", get: () => [screen.width, screen.height] },
		{ id: "avail", type: "size", get: () => [screen.availWidth, screen.availHeight] },
		{ id: "win", type: "size", volatile: true, get: () => [innerWidth, innerHeight] },
		{ id: "orient", type: "text", volatile: true, get: () => `${screen.orientation.type} ${screen.orientation.angle}°` },
		{ id: "pointer", type: "enum", get: () => (mq("(pointer: fine)") ? "mouse" : mq("(pointer: coarse)") ? "touch" : "none") },
		{ id: "hover", type: "bool", get: () => mq("(any-hover: hover)") },
		{ id: "dpr", type: "num", volatile: true, get: () => devicePixelRatio }, // changes with zoom
		{ id: "depth", type: "num", unit: "bit", get: () => screen.colorDepth },
		{ id: "scheme", type: "enum", volatile: true, get: () => (mq("(prefers-color-scheme: dark)") ? "dark" : "light") },
		{ id: "motion", type: "bool", get: () => mq("(prefers-reduced-motion: reduce)") },
		{ id: "hdr", type: "bool", get: () => mq("(dynamic-range: high)") },
		{ id: "gamut", type: "text", get: () => (mq("(color-gamut: p3)") ? "P3" : "sRGB") },
	],
};
