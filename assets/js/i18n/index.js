import en from "./locales/en.js";
import tr from "./locales/tr.js";
import es from "./locales/es.js";
import zh from "./locales/zh.js";
import hi from "./locales/hi.js";

// To add a language: copy locales/en.js, translate the values, import it here.
// Missing keys fall back to English, so technical terms can be left out.
const LOCALES = { en, tr, es, zh, hi };

// First supported language in the browser's preference order, otherwise English.
function detect() {
	for (const l of navigator.languages || [navigator.language]) {
		const code = String(l).toLowerCase().split("-")[0];
		if (code in LOCALES) return code;
	}
	return "en";
}

export const lang = detect();
export const t = (key) => LOCALES[lang][key] ?? LOCALES.en[key] ?? key;

// data-i18n="key"            -> text content
// data-i18n-<attr>="key"     -> that attribute (e.g. data-i18n-aria-label, data-i18n-content)
export function applyDom(root = document) {
	document.documentElement.lang = lang;
	root.querySelectorAll("*").forEach((node) => {
		for (const name of node.getAttributeNames()) {
			if (name === "data-i18n") node.textContent = t(node.getAttribute(name));
			else if (name.startsWith("data-i18n-")) node.setAttribute(name.slice(10), t(node.getAttribute(name)));
		}
	});
}
