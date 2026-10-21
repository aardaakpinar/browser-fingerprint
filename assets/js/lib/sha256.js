// SHA-256 via Web Crypto; falls back to a simple non-cryptographic hash where it is unavailable.
export async function sha256(str) {
	try {
		const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
		return [...new Uint8Array(bytes)].map((x) => x.toString(16).padStart(2, "0")).join("");
	} catch {
		let h = 2166136261;
		const out = [];
		for (let r = 0; r < 8; r++) {
			for (let i = 0; i < str.length; i++) {
				h ^= str.charCodeAt(i) + r;
				h = Math.imul(h, 16777619) >>> 0;
			}
			out.push(h.toString(16).padStart(8, "0"));
		}
		return out.join("");
	}
}
