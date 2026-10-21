import { t } from "../i18n/index.js";
import { el } from "../lib/dom.js";

const DASH = "—";
const chip = (text, state = "") => el("span", `chip ${state}`.trim(), text);
const value = (v, unit) => (v == null ? DASH : typeof v == "number" && unit ? `${v} ${unit}` : String(v));

// Row types shown as one text value.
const TEXT = {
	text: (v) => String(v),
	num: (v, r) => value(v, r.unit),
	size: ([w, h]) => `${w} × ${h}`,
	enum: (v) => t(`val.${v}`),
};

// Row types shown as one or more chips / badges.
const ITEMS = {
	bool: (v) => [el("span", `badge ${v ? "yes" : "no"}`, t(v ? "val.yes" : "val.no"))],
	list: (v) => v.map((x) => chip(x)),
	flags: (v) => v.map(([name, on]) => chip(`${on ? "✓" : "✗"} ${name}`, on ? "on" : "off")),
	pairs: (v, r) => v.map(([name, x]) => chip(`${name}: ${value(x, r.unit)}`)),
	states: (v) => v.map(([name, s]) => chip(`${name}: ${t(`val.${s}`)}`)),
};

function cell(row) {
	const dd = el("dd");
	const muted = (key) => {
		dd.className = "na";
		dd.textContent = t(key);
	};
	if (row.value == null) muted("val.unavailable");
	else if (ITEMS[row.type]) {
		const items = ITEMS[row.type](row.value, row);
		if (!items.length) muted("val.none");
		else {
			dd.className = "chips";
			dd.append(...items);
		}
	} else dd.textContent = TEXT[row.type](row.value, row);
	return dd;
}

export function render(container, groups) {
	container.textContent = "";
	for (const g of groups) {
		const dl = el("dl");
		for (const r of g.rows) {
			const row = el("div", "row");
			row.append(el("dt", "", t(`row.${g.id}.${r.id}`)), cell(r));
			dl.append(row);
		}
		const section = el("section");
		section.append(el("h2", "", t(`group.${g.id}`)), dl);
		container.append(section);
	}
}
