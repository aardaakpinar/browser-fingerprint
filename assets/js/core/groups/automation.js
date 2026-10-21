export default {
	id: "automation",
	rows: [
		{ id: "webdriver", type: "bool", get: () => navigator.webdriver },
		{ id: "headless", type: "bool", get: () => /Headless/i.test(navigator.userAgent) },
		{ id: "chrome", type: "bool", get: () => !!window.chrome },
	],
};
