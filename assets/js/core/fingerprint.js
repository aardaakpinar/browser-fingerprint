import { sha256 } from "../lib/sha256.js";

// Bump when the set of fingerprinted values or their format changes on purpose.
export const FP_VERSION = 2;

// `all` holds every value; `stable` leaves out rows flagged volatile (they change from moment to moment).
export function split(groups) {
	const all = {};
	const stable = {};
	for (const g of groups)
		for (const r of g.rows) {
			all[`${g.id}.${r.id}`] = r.value;
			if (!r.volatile) stable[`${g.id}.${r.id}`] = r.value;
		}
	return { all, stable };
}

// Keys are fixed ids and sorted, so labels, translations and row order never affect the hash.
export const digest = (stable) =>
	sha256(
		JSON.stringify([
			FP_VERSION,
			Object.keys(stable)
				.sort()
				.map((k) => [k, stable[k]]),
		]),
	);
