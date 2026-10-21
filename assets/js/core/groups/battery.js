const minutes = (s) => (isFinite(s) ? Math.round(s / 60) : null);

export default {
	id: "battery",
	load: () => navigator.getBattery(),
	rows: [
		{ id: "level", type: "num", unit: "%", volatile: true, get: (b) => Math.round(b.level * 100) },
		{ id: "charging", type: "bool", volatile: true, get: (b) => b.charging },
		{ id: "tfull", type: "num", unit: "min", volatile: true, get: (b) => minutes(b.chargingTime) },
		{ id: "tempty", type: "num", unit: "min", volatile: true, get: (b) => minutes(b.dischargingTime) },
	],
};
