(function () {
	const $ = (s) => document.querySelector(s);
	const FONTS = ["Arial", "Verdana", "Times New Roman", "Courier New", "Georgia", "Trebuchet MS", "Impact", "Comic Sans MS", "Tahoma", "Calibri", "Cambria", "Consolas", "Segoe UI", "Helvetica", "Helvetica Neue", "Menlo", "Monaco", "Roboto", "Ubuntu", "Noto Sans", "Lucida Grande", "Palatino", "Garamond", "Futura", "Optima", "Gill Sans", "Candara", "Century Gothic", "SF Pro Text", "Apple Color Emoji"];
	const t = I18N.t;
	let last = null,
		lastGroups = [],
		hex = "";
	async function sha(str) {
		try {
			const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
			return [...new Uint8Array(b)].map((x) => x.toString(16).padStart(2, "0")).join("");
		} catch (e) {
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
	function rtc() {
		return new Promise((res) => {
			const f = { pub: new Set(), loc: new Set(), mdns: 0 };
			let pc;
			try {
				pc = new RTCPeerConnection({ iceServers: [{ urls: "stun:stun.l.google.com:19302" }, { urls: "stun:stun.cloudflare.com:3478" }] });
			} catch (e) {
				return res(null);
			}
			const done = () => {
				try {
					pc.close();
				} catch (e) {}
				res(f);
			};
			pc.createDataChannel("x");
			pc.onicecandidate = (e) => {
				if (!e.candidate) {
					done();
					return;
				}
				const c = e.candidate.candidate.split(" "),
					addr = c[4],
					type = c[7];
				if (type === "srflx") f.pub.add(addr);
				else if (type === "host") f.loc.add(addr);
			};
			pc.createOffer()
				.then((o) => pc.setLocalDescription(o))
				.catch(() => res(null));
			setTimeout(done, 4000);
		});
	}
	function fonts() {
		const base = ["monospace", "serif", "sans-serif"],
			s = document.createElement("span");
		s.style.cssText = "position:absolute;left:-9999px;font-size:72px;visibility:hidden";
		s.textContent = "mmmmmmmmmmlli1WQ@#";
		document.body.appendChild(s);
		const w = {};
		base.forEach((b) => {
			s.style.fontFamily = b;
			w[b] = s.offsetWidth;
		});
		const found = FONTS.filter((f) =>
			base.some((b) => {
				s.style.fontFamily = "'" + f + "'," + b;
				return s.offsetWidth !== w[b];
			}),
		);
		s.remove();
		return found;
	}
	function canvasData() {
		try {
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
		} catch (e) {
			return "";
		}
	}
	function webgl() {
		try {
			const g = document.createElement("canvas").getContext("webgl");
			if (!g) return null;
			const e = g.getExtension("WEBGL_debug_renderer_info");
			return {
				vendor: e ? g.getParameter(e.UNMASKED_VENDOR_WEBGL) : g.getParameter(g.VENDOR),
				renderer: e ? g.getParameter(e.UNMASKED_RENDERER_WEBGL) : g.getParameter(g.RENDERER),
				maxTexture: g.getParameter(g.MAX_TEXTURE_SIZE),
			};
		} catch (e) {
			return null;
		}
	}
	async function audioData() {
		try {
			const C = window.OfflineAudioContext || window.webkitOfflineAudioContext;
			const ctx = new C(1, 5000, 44100),
				o = ctx.createOscillator(),
				k = ctx.createDynamicsCompressor();
			o.type = "triangle";
			o.frequency.value = 10000;
			o.connect(k);
			k.connect(ctx.destination);
			o.start(0);
			const d = (await ctx.startRendering()).getChannelData(0);
			let s = 0;
			for (let i = 4500; i < 5000; i++) s += Math.abs(d[i]);
			return s.toString();
		} catch (e) {
			return "";
		}
	}
	const storage = () =>
		["localStorage", "sessionStorage"]
			.filter((k) => {
				try {
					window[k].setItem("_t", "1");
					window[k].removeItem("_t");
					return true;
				} catch (e) {
					return false;
				}
			})
			.concat(window.indexedDB ? ["IndexedDB"] : []);
	const mq = (q) => matchMedia(q).matches;
	// Typed values: plain string = text, YN = yes/no badge, CH = chips ([name, true|false|text] pairs allowed).
	const YN = (v) => ({ b: !!v });
	const CH = (a) => ({ c: a });
	const U = (v, f = (x) => x) => (v == null || v === "" ? "Unknown" : f(v));
	const ms = (x) => (isFinite(x) && x >= 0 ? x.toFixed(0) + " ms" : "—");
	const navT = () => performance.getEntriesByType("navigation")[0] || {};
	const tryP = async (f, d = null) => {
		try {
			const v = await Promise.race([f(), new Promise((_, r) => setTimeout(r, 1800))]);
			return v ?? d;
		} catch (e) {
			return d;
		}
	};

	// Every value is language-independent: translation happens only at render time.
	async function extras() {
		const n = navigator,
			X = {};
		X.bat = await tryP(async () => {
			const b = await n.getBattery();
			return { l: Math.round(b.level * 100), c: b.charging, ct: b.chargingTime, dt: b.dischargingTime };
		});
		X.he = await tryP(() => n.userAgentData.getHighEntropyValues(["architecture", "bitness", "model", "platformVersion", "uaFullVersion", "fullVersionList"]));
		X.dev = await tryP(async () => {
			const c = { audioinput: 0, videoinput: 0, audiooutput: 0 };
			(await n.mediaDevices.enumerateDevices()).forEach((d) => c[d.kind]++);
			return c;
		});
		X.vox = await tryP(
			() =>
				new Promise((res) => {
					const s = speechSynthesis,
						f = () => {
							const v = s.getVoices();
							if (v.length) res(v.map((x) => x.name));
						};
					f();
					s.onvoiceschanged = f;
					setTimeout(() => res([]), 1200);
				}),
		);
		X.perm = await tryP(async () => {
			const o = [],
				S = { granted: "Granted", denied: "Denied", prompt: "Ask" };
			for (const nm of ["geolocation", "notifications", "camera", "microphone", "clipboard-read", "midi", "push"]) {
				try {
					o.push([nm, S[(await n.permissions.query({ name: nm })).state]]);
				} catch (e) {}
			}
			return o.length ? o : null;
		});
		X.gpu = await tryP(async () => {
			const i = (await n.gpu.requestAdapter()).info || {};
			return [i.vendor, i.architecture, i.device, i.description].filter(Boolean).join(" / ") || null;
		});
		X.est = await tryP(async () => {
			const e = await n.storage.estimate();
			return { q: (e.quota / 1073741824).toFixed(1) + " GB", u: (e.usage / 1048576).toFixed(1) + " MB" };
		});
		X.kb = await tryP(async () => {
			const m = await n.keyboard.getLayoutMap();
			return [
				["Q", m.get("KeyQ")],
				["Y", m.get("KeyY")],
				["Z", m.get("KeyZ")],
				[";", m.get("Semicolon")],
			];
		});
		X.wa = await tryP(() => PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable());
		X.math = (await sha([Math.tan(-1e300), Math.sinh(1), Math.expm1(1), Math.cosh(10), Math.atanh(0.5)].join("|"))).slice(0, 16);
		const v = document.createElement("video"),
			a = document.createElement("audio");
		X.codec = [
			["H.264", 'video/mp4; codecs="avc1.42E01E"'],
			["HEVC", 'video/mp4; codecs="hvc1.1.6.L93.B0"'],
			["VP9", 'video/webm; codecs="vp9"'],
			["AV1", 'video/mp4; codecs="av01.0.05M.08"'],
			["AAC", 'audio/mp4; codecs="mp4a.40.2"'],
			["Opus", 'audio/webm; codecs="opus"'],
			["FLAC", "audio/flac"],
			["MP3", "audio/mpeg"],
		]
			.filter(([, t]) => (t[0] == "v" ? v : a).canPlayType(t))
			.map((x) => x[0]);
		X.feat = [
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
		let m = 1e9,
			p = performance.now();
		for (let i = 0; i < 3000; i++) {
			const q = performance.now();
			if (q > p) {
				m = Math.min(m, q - p);
				p = q;
			}
		}
		X.tim = m < 1e9 ? (m * 1000).toFixed(0) + " µs" : null;
		return X;
	}

	// Each group: [group, [[label, value, volatile?], ...]]. Group and label names are English keys.
	// Rows flagged 1 change from moment to moment and are left out of the fingerprint hash.
	async function collect() {
		const n = navigator,
			c = n.connection || {},
			N = navT(),
			X = await extras(),
			gl = webgl(),
			B = X.bat,
			h = X.he || {},
			E = X.est,
			D = X.dev;
		const ro = Intl.DateTimeFormat().resolvedOptions(),
			off = -new Date().getTimezoneOffset() / 60;
		const canvas = canvasData(),
			audio = await audioData(),
			fl = fonts();
		const [canvasH, audioH] = await Promise.all([sha(canvas), sha(audio)]);
		const min = (s) => (s === Infinity ? "—" : Math.round(s / 60) + " min");
		const bat = (f) => (B ? f(B) : "Unsupported");
		const mic = (k) => U(D, (d) => String(d[k]));
		return [
			[
				"browser",
				"Browser",
				[
					["ua", "User-Agent", n.userAgent],
					["platform", "Platform", U(n.userAgentData?.platform || n.platform)],
					["langs", "Languages", CH(n.languages || [n.language])],
					["tz", "Time zone", ro.timeZone],
					["utc", "UTC offset", "UTC" + (off >= 0 ? "+" : "") + off, 1],
					["cookies", "Cookies enabled", YN(n.cookieEnabled)],
					["dnt", "Do Not Track", U(["1", "0", "yes", "no"].includes(String(n.doNotTrack ?? window.doNotTrack)) ? String(n.doNotTrack ?? window.doNotTrack) : null, (v) => YN(v === "1" || v === "yes"))],
					["storage", "Web storage", CH(storage())],
					["pdf", "PDF viewer", U(n.pdfViewerEnabled, YN)],
				],
			],
			[
				"screen",
				"Screen",
				[
					["res", "Resolution", screen.width + " × " + screen.height],
					["avail", "Available area", screen.availWidth + " × " + screen.availHeight],
					["win", "Window size", innerWidth + " × " + innerHeight, 1],
					["orient", "Orientation", U(screen.orientation, (o) => o.type + " " + o.angle + "°"), 1],
					["pointer", "Pointer", mq("(pointer: fine)") ? "Mouse" : mq("(pointer: coarse)") ? "Touch" : "None"],
					["hover", "Hover support", YN(mq("(any-hover: hover)"))],
					["dpr", "Pixel ratio", String(devicePixelRatio), 1],
					["depth", "Color depth", screen.colorDepth + " bit"],
					["scheme", "Color scheme", mq("(prefers-color-scheme: dark)") ? "Dark" : "Light", 1],
					["motion", "Reduced motion", YN(mq("(prefers-reduced-motion: reduce)"))],
					["hdr", "HDR", YN(mq("(dynamic-range: high)"))],
					["gamut", "Color gamut", mq("(color-gamut: p3)") ? "P3" : "sRGB"],
				],
			],
			[
				"hardware",
				"Hardware",
				[
					["cores", "Logical cores", U(n.hardwareConcurrency, String)],
					["mem", "Memory", U(n.deviceMemory, (v) => v + " GB")],
					["touch", "Touch points", String(n.maxTouchPoints || 0)],
				],
			],
			[
				"connection",
				"Connection",
				[
					["proto", "Protocol", U(N.nextHopProtocol), 1],
					["host", "Host", location.host || "Local file", 1],
					["secure", "Secure context", YN(isSecureContext), 1],
					["coi", "Cross-origin isolated", YN(self.crossOriginIsolated), 1],
					["ctype", "Connection type", U(c.type), 1],
					["etype", "Effective type", U(c.effectiveType), 1],
					["dlmax", "Max downlink", U(c.downlinkMax, (v) => v + " Mb/s"), 1],
					["dl", "Downlink", U(c.downlink, (v) => v + " Mb/s"), 1],
					["rtt", "Round-trip time", U(c.rtt, (v) => v + " ms"), 1],
					["saver", "Data saver", U(c.saveData, YN), 1],
					["online", "Online", YN(n.onLine), 1],
					[
						"timings",
						"Timings",
						CH([
							["DNS", ms(N.domainLookupEnd - N.domainLookupStart)],
							["TCP", ms(N.connectEnd - N.connectStart)],
							["TLS", N.secureConnectionStart > 0 ? ms(N.connectEnd - N.secureConnectionStart) : "—"],
							["TTFB", ms(N.responseStart - N.requestStart)],
						]),
						1,
					],
					["psize", "Page size", U(N.transferSize, (v) => (v / 1024).toFixed(1) + " KB"), 1],
				],
			],
			[
				"battery",
				"Battery",
				[
					["level", "Level", bat((b) => b.l + "%"), 1],
					["charging", "Charging", bat((b) => YN(b.c)), 1],
					["tfull", "Time to full", bat((b) => min(b.ct)), 1],
					["tempty", "Time to empty", bat((b) => min(b.dt)), 1],
				],
			],
			[
				"uach",
				"Detailed browser identity",
				[
					["arch", "Architecture", U(h.architecture, (a) => a + (h.bitness ? " (" + h.bitness + "-bit)" : ""))],
					["model", "Device model", U(h.model)],
					["pver", "Platform version", U(h.platformVersion)],
					["fver", "Full version", U(h.uaFullVersion)],
					["brands", "Brands", U(h.fullVersionList, (l) => CH(l.map((b) => b.brand + " " + b.version)))],
				],
			],
			[
				"devices",
				"Devices & storage",
				[
					["mics", "Microphones", mic("audioinput"), 1],
					["cams", "Cameras", mic("videoinput"), 1],
					["spk", "Speakers", mic("audiooutput"), 1],
					["pads", "Gamepads", n.getGamepads ? String([...n.getGamepads()].filter(Boolean).length) : "Unsupported", 1],
					["quota", "Storage quota", U(E, (e) => e.q), 1],
					["used", "Storage used", U(E, (e) => e.u), 1],
					["heap", "JS heap limit", performance.memory ? Math.round(performance.memory.jsHeapSizeLimit / 1048576) + " MB" : "Unsupported"],
					["kbd", "Keyboard layout", U(X.kb, CH)],
					["webauthn", "Platform authenticator", U(X.wa, YN)],
				],
			],
			[
				"caps",
				"Capabilities",
				[
					["perms", "Permissions", U(X.perm, CH), 1],
					["plugins", "Plugins", CH([...n.plugins].map((p) => p.name))],
					["apis", "Web APIs", CH(X.feat)],
					["codecs", "Codecs", CH(X.codec)],
					["voices", "Speech voices", U(X.vox, (v) => CH(v.slice(0, 6).concat(v.length > 6 ? ["+" + (v.length - 6)] : []))), 1],
				],
			],
			[
				"locale",
				"Locale & time",
				[
					["locale", "Locale", ro.locale],
					["cal", "Calendar", ro.calendar],
					["numsys", "Numbering system", ro.numberingSystem],
					["numfmt", "Number format", new Intl.NumberFormat().format(1234567.891)],
					["datefmt", "Date format", new Date(2020, 11, 31, 23, 59).toLocaleString()],
					["timer", "Timer resolution", U(X.tim), 1],
					["math", "Math hash", X.math],
					["ref", "Referrer", document.referrer || "None", 1],
					["hist", "History length", String(history.length), 1],
					["charset", "Charset", document.characterSet],
				],
			],
			[
				"automation",
				"Automation signals",
				[
					["webdriver", "webdriver", YN(n.webdriver)],
					["headless", "Headless hint", YN(/Headless/i.test(n.userAgent))],
					["chrome", "Chrome object", YN(window.chrome)],
				],
			],
			[
				"graphics",
				"Graphics & audio",
				[
					["gpuv", "GPU vendor", gl ? gl.vendor : "Unsupported"],
					["gpur", "GPU renderer", gl ? gl.renderer : "Unsupported"],
					["maxtex", "Max texture size", gl ? String(gl.maxTexture) : "Unsupported"],
					["webgpu", "WebGPU", U(X.gpu, (g) => g)],
					["canvas", "Canvas hash", canvas ? canvasH.slice(0, 24) : "Unsupported"],
					["audio", "Audio hash", audio ? audioH.slice(0, 24) : "Unsupported"],
				],
			],
			["fonts", "Fonts", [["fonts", "Installed fonts", CH(fl)]]],
		];
	}

	// ---- Rendering (the only place where text is translated) ----
	const NA = new Set(["Unknown", "Unsupported", "None", "Unspecified", "—"]);
	const el = (tag, cls, txt) => {
		const e = document.createElement(tag);
		if (cls) e.className = cls;
		if (txt != null) e.textContent = txt;
		return e;
	};
	function cell(v) {
		const d = el("dd");
		if (v && v.b !== undefined) d.append(el("span", "badge " + (v.b ? "yes" : "no"), t(v.b ? "Yes" : "No")));
		else if (v && v.c) {
			if (!v.c.length) {
				d.className = "na";
				d.textContent = t("None");
			} else {
				d.className = "chips";
				v.c.forEach((x) => {
					if (!Array.isArray(x)) return d.append(el("span", "chip", t(String(x))));
					const [k, val] = x;
					d.append(typeof val == "boolean" ? el("span", "chip " + (val ? "on" : "off"), (val ? "✓ " : "✗ ") + k) : el("span", "chip", k + ": " + t(String(val))));
				});
			}
		} else {
			if (NA.has(v)) d.className = "na";
			d.textContent = t(String(v));
		}
		return d;
	}
	function render() {
		const out = $("#out");
		out.textContent = "";
		lastGroups.forEach(([, title, rows]) => {
			const s = el("section"),
				dl = el("dl");
			rows.forEach(([, k, v]) => {
				const r = el("div", "row");
				r.append(el("dt", "", t(k)), cell(v));
				dl.append(r);
			});
			s.append(el("h2", "", t(title)), dl);
			out.append(s);
		});
	}
	const TITLE = "How well does your browser know you?",
		LEAD = "These values are collected without cookies, only from what your browser volunteers. Combined, they form a profile unique to you.";
	function applyUI() {
		document.title = $("#title").textContent = t(TITLE);
		$("meta[name=description]").content = $("#lead").textContent = t(LEAD);
		$("#hashTitle").textContent = t("Stable fingerprint");
		$("#again").textContent = t("Recalculate");
		$("#copy").textContent = t("Copy JSON");
		$("#hash").textContent = hex || t("Computing…");
		$("#rings").setAttribute("aria-label", t("Rings generated from the fingerprint"));
	}

	function rings(hex) {
		const b = hex.match(/../g).map((h) => parseInt(h, 16));
		let out = "";
		for (let i = 0; i < 14; i++) {
			const r0 = 10 + i * 7,
				f1 = 2 + (b[i] % 4),
				f2 = 3 + (b[i + 14] % 5),
				p1 = b[i + 3] / 40,
				p2 = b[i + 9] / 40;
			const A1 = 1.2 + i * 0.28,
				A2 = 0.6 + i * 0.15;
			let d = "";
			for (let k = 0; k <= 120; k++) {
				const a = (k / 120) * Math.PI * 2;
				const r = r0 + Math.sin(a * f1 + p1) * A1 + Math.sin(a * f2 + p2) * A2;
				d += (k ? "L" : "M") + (110 + r * Math.cos(a)).toFixed(1) + " " + (110 + r * Math.sin(a)).toFixed(1);
			}
			out += '<path d="' + d + 'Z"/>';
		}
		$("#rings").innerHTML = out;
	}
	// Bump when the set of fingerprinted values or their format changes on purpose.
	const FP_VERSION = 1;
	// Keys are fixed ids (group.row), sorted, so labels, translations and row order never affect the hash.
	function split(groups) {
		const all = {},
			flat = {};
		groups.forEach(([g, , rows]) =>
			rows.forEach(([id, , v, vol]) => {
				all[g + "." + id] = v;
				if (!vol) flat[g + "." + id] = v;
			}),
		);
		return { all, flat };
	}
	const digest = (flat) =>
		sha(
			JSON.stringify([
				FP_VERSION,
				Object.keys(flat)
					.sort()
					.map((k) => [k, flat[k]]),
			]),
		);

	async function run() {
		hex = "";
		applyUI();
		lastGroups = await collect();
		render();
		const { all, flat } = split(lastGroups);
		last = all;
		hex = await digest(flat);
		$("#hash").textContent = hex;
		rings(hex);
	}
	$("#again").onclick = run;
	$("#copy").onclick = async () => {
		try {
			await navigator.clipboard.writeText(JSON.stringify(last, null, 2));
			$("#copy").textContent = t("Copied");
		} catch (e) {
			$("#copy").textContent = t("Copy failed");
		}
		setTimeout(() => ($("#copy").textContent = t("Copy JSON")), 1500);
	};
	applyUI();
	run();
})();
