import { $ } from "./lib/dom.js";
import { applyDom, t } from "./i18n/index.js";
import { collect } from "./core/collect.js";
import { split, digest } from "./core/fingerprint.js";
import { render } from "./ui/render.js";
import { drawRings } from "./ui/rings.js";

const ui = { hash: $("#hash"), rings: $("#rings"), out: $("#out"), again: $("#again"), copy: $("#copy") };
let snapshot = {};

async function run() {
	ui.hash.textContent = t("ui.computing");
	const groups = await collect();
	render(ui.out, groups);
	const { all, stable } = split(groups);
	snapshot = all;
	const hex = await digest(stable);
	ui.hash.textContent = hex;
	drawRings(ui.rings, hex);
}

ui.again.onclick = run;
ui.copy.onclick = async () => {
	try {
		await navigator.clipboard.writeText(JSON.stringify(snapshot, null, 2));
		ui.copy.textContent = t("ui.copied");
	} catch {
		ui.copy.textContent = t("ui.copyFailed");
	}
	setTimeout(() => (ui.copy.textContent = t("ui.copy")), 1500);
};

applyDom();
run();
