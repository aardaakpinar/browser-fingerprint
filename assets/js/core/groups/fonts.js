const CANDIDATES = ["Arial", "Verdana", "Times New Roman", "Courier New", "Georgia", "Trebuchet MS", "Impact", "Comic Sans MS", "Tahoma", "Calibri", "Cambria", "Consolas", "Segoe UI", "Helvetica", "Helvetica Neue", "Menlo", "Monaco", "Roboto", "Ubuntu", "Noto Sans", "Lucida Grande", "Palatino", "Garamond", "Futura", "Optima", "Gill Sans", "Candara", "Century Gothic", "SF Pro Text", "Apple Color Emoji"];

// A font counts as installed when text set in it measures differently from the generic fallback.
function detect() {
	const bases = ["monospace", "serif", "sans-serif"];
	const probe = document.createElement("span");
	probe.style.cssText = "position:absolute;left:-9999px;font-size:72px;visibility:hidden";
	probe.textContent = "mmmmmmmmmmlli1WQ@#";
	document.body.appendChild(probe);
	const width = {};
	bases.forEach((b) => {
		probe.style.fontFamily = b;
		width[b] = probe.offsetWidth;
	});
	const found = CANDIDATES.filter((f) =>
		bases.some((b) => {
			probe.style.fontFamily = `'${f}',${b}`;
			return probe.offsetWidth !== width[b];
		}),
	);
	probe.remove();
	return found;
}

export default { id: "fonts", rows: [{ id: "fonts", type: "list", get: detect }] };
