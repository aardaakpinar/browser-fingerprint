export const mq = (q) => matchMedia(q).matches;
export const round = (n, d = 0) => Math.round(n * 10 ** d) / 10 ** d;

// Resolves to null on error or timeout, so one unsupported API never blocks the page.
export const safe = (fn, ms = 1800) =>
	Promise.race([Promise.resolve().then(fn), new Promise((r) => setTimeout(r, ms, null))])
		.then((v) => v ?? null)
		.catch(() => null);

// settle({ a: () => promiseA, b: () => promiseB }) -> { a: valueA | null, b: valueB | null }
export const settle = async (jobs) => Object.fromEntries(await Promise.all(Object.entries(jobs).map(async ([k, fn]) => [k, await safe(fn)])));
