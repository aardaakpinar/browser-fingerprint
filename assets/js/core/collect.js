import { safe } from "../lib/util.js";
import groups from "./groups/index.js";

// A row's get() may throw or return nothing when an API is missing. That simply means "unavailable" (null).
function read(row, data) {
	try {
		const v = row.get(data);
		return v === undefined || v === "" || Number.isNaN(v) ? null : v;
	} catch {
		return null;
	}
}

// Returns [{ id, rows: [{ id, type, unit, volatile, value }] }]. Values are raw and language-independent.
export function collect() {
	return Promise.all(
		groups.map(async (g) => {
			const data = g.load ? await safe(g.load, 4000) : undefined;
			return { id: g.id, rows: g.rows.map((r) => ({ id: r.id, type: r.type, unit: r.unit, volatile: !!r.volatile, value: read(r, data) })) };
		}),
	);
}
