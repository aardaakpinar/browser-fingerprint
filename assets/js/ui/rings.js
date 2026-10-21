// Draws concentric wobbly rings seeded by the fingerprint hash.
export function drawRings(svg, hex) {
	const b = hex.match(/../g).map((h) => parseInt(h, 16));
	let out = "";
	for (let i = 0; i < 14; i++) {
		const r0 = 10 + i * 7;
		const f1 = 2 + (b[i] % 4);
		const f2 = 3 + (b[i + 14] % 5);
		const p1 = b[i + 3] / 40;
		const p2 = b[i + 9] / 40;
		const A1 = 1.2 + i * 0.28;
		const A2 = 0.6 + i * 0.15;
		let d = "";
		for (let k = 0; k <= 120; k++) {
			const a = (k / 120) * Math.PI * 2;
			const r = r0 + Math.sin(a * f1 + p1) * A1 + Math.sin(a * f2 + p2) * A2;
			d += (k ? "L" : "M") + (110 + r * Math.cos(a)).toFixed(1) + " " + (110 + r * Math.sin(a)).toFixed(1);
		}
		out += `<path d="${d}Z"/>`;
	}
	svg.innerHTML = out;
}
