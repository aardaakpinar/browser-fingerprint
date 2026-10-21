import { settle } from "../../lib/util.js";

const PERMISSIONS = ["geolocation", "notifications", "camera", "microphone", "clipboard-read", "midi", "push"];
const STATE = { granted: "granted", denied: "denied", prompt: "ask" }; // -> i18n val.<state>
const CODECS = [
	["H.264", 'video/mp4; codecs="avc1.42E01E"'],
	["HEVC", 'video/mp4; codecs="hvc1.1.6.L93.B0"'],
	["VP9", 'video/webm; codecs="vp9"'],
	["AV1", 'video/mp4; codecs="av01.0.05M.08"'],
	["AAC", 'audio/mp4; codecs="mp4a.40.2"'],
	["Opus", 'audio/webm; codecs="opus"'],
	["FLAC", "audio/flac"],
	["MP3", "audio/mpeg"],
];
const apis = () => {
	const n = navigator;
	return [
		["Bluetooth", !!n.bluetooth],
		["USB", !!n.usb],
		["Serial", !!n.serial],
		["HID", !!n.hid],
		["Share", !!n.share],
		["WakeLock", !!n.wakeLock],
		["Vibration", !!n.vibrate],
		["ServiceWorker", !!n.serviceWorker],
		["WebAssembly", typeof WebAssembly == "object"],
		["SharedArrayBuffer", typeof SharedArrayBuffer == "function"],
		["OffscreenCanvas", typeof OffscreenCanvas == "function"],
		["WebRTC", !!window.RTCPeerConnection],
		["MediaRecorder", !!window.MediaRecorder],
		["Notifications", !!window.Notification],
		["WebGL2", !!document.createElement("canvas").getContext("webgl2")],
		["WebXR", !!n.xr],
	];
};

export default {
	id: "caps",
	load: () =>
		settle({
			perm: async () => {
				const out = [];
				for (const name of PERMISSIONS) {
					try {
						out.push([name, STATE[(await navigator.permissions.query({ name })).state]]);
					} catch {}
				}
				return out.length ? out : null;
			},
			vox: () =>
				new Promise((resolve) => {
					const read = () => {
						const v = speechSynthesis.getVoices();
						if (v.length) resolve(v.map((x) => x.name));
					};
					read();
					speechSynthesis.onvoiceschanged = read;
					setTimeout(() => resolve([]), 1200);
				}),
		}),
	rows: [
		{ id: "perms", type: "states", volatile: true, get: (d) => d.perm },
		{ id: "plugins", type: "list", get: () => [...navigator.plugins].map((p) => p.name) },
		{ id: "apis", type: "flags", get: apis },
		{
			id: "codecs",
			type: "list",
			get: () => {
				const media = { video: document.createElement("video"), audio: document.createElement("audio") };
				return CODECS.filter(([, mime]) => media[mime.split("/")[0]].canPlayType(mime)).map(([name]) => name);
			},
		},
		{ id: "voices", type: "list", volatile: true, get: (d) => d.vox.slice(0, 6).concat(d.vox.length > 6 ? ["+" + (d.vox.length - 6)] : []) },
	],
};
