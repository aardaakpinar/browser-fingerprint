export default {
	id: "hardware",
	rows: [
		{ id: "cores", type: "num", get: () => navigator.hardwareConcurrency },
		{ id: "mem", type: "num", unit: "GB", get: () => navigator.deviceMemory },
		{ id: "touch", type: "num", get: () => navigator.maxTouchPoints || 0 },
	],
};
