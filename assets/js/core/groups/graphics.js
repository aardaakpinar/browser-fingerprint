import { sha256 } from "../../lib/sha256.js";
import { settle } from "../../lib/util.js";

function webgl() {
	const g = document.createElement("canvas").getContext("webgl");
	const ext = g.getExtension("WEBGL_debug_renderer_info");
	return {
		vendor: g.getParameter(ext ? ext.UNMASKED_VENDOR_WEBGL : g.VENDOR),
		renderer: g.getParameter(ext ? ext.UNMASKED_RENDERER_WEBGL : g.RENDERER),
		maxTexture: g.getParameter(g.MAX_TEXTURE_SIZE),
	};
}

// The probe text deliberately mixes accented letters and an emoji to exercise glyph rendering.
function paintCanvas() {
	const c = document.createElement("canvas");
	c.width = 240;
	c.height = 60;
	const x = c.getContext("2d");
	x.textBaseline = "top";
	x.font = "16px Arial";
	x.fillStyle = "#f60";
	x.fillRect(100, 1, 62, 20);
	x.fillStyle = "#069";
	x.fillText("Parmak izi, ĞüŞiöç 🙂", 2, 15);
	x.fillStyle = "rgba(102,204,0,.7)";
	x.font = "18px Times New Roman";
	x.fillText("Parmak izi, ĞüŞiöç 🙂", 4, 30);
	x.beginPath();
	x.arc(50, 50, 20, 0, Math.PI * 2);
	x.stroke();
	return c.toDataURL();
}

async function renderAudio() {
	const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
	const ctx = new Ctx(1, 5000, 44100);
	const osc = ctx.createOscillator();
	const comp = ctx.createDynamicsCompressor();
	osc.type = "triangle";
	osc.frequency.value = 10000;
	osc.connect(comp);
	comp.connect(ctx.destination);
	osc.start(0);
	const samples = (await ctx.startRendering()).getChannelData(0);
	let sum = 0;
	for (let i = 4500; i < 5000; i++) sum += Math.abs(samples[i]);
	return sum.toString();
}

export default {
	id: "graphics",
	load: () =>
		settle({
			gl: async () => webgl(),
			canvas: async () => (await sha256(paintCanvas())).slice(0, 24),
			audio: async () => (await sha256(await renderAudio())).slice(0, 24),
			gpu: async () => {
				const i = (await navigator.gpu.requestAdapter()).info || {};
				return [i.vendor, i.architecture, i.device, i.description].filter(Boolean).join(" / ");
			},
		}),
	rows: [
		{ id: "gpuv", type: "text", get: (d) => d.gl.vendor },
		{ id: "gpur", type: "text", get: (d) => d.gl.renderer },
		{ id: "maxtex", type: "num", get: (d) => d.gl.maxTexture },
		{ id: "webgpu", type: "text", get: (d) => d.gpu },
		{ id: "canvas", type: "text", get: (d) => d.canvas },
		{ id: "audio", type: "text", get: (d) => d.audio },
	],
};
