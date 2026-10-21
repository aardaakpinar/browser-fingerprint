export const $ = (selector, root = document) => root.querySelector(selector);

export function el(tag, className = "", text = null) {
	const node = document.createElement(tag);
	if (className) node.className = className;
	if (text !== null) node.textContent = text;
	return node;
}
