(function () {
	const $ = (s) => document.querySelector(s);
	const FONTS = ["Arial", "Verdana", "Times New Roman", "Courier New", "Georgia", "Trebuchet MS", "Impact", "Comic Sans MS", "Tahoma", "Calibri", "Cambria", "Consolas", "Segoe UI", "Helvetica", "Helvetica Neue", "Menlo", "Monaco", "Roboto", "Ubuntu", "Noto Sans", "Lucida Grande", "Palatino", "Garamond", "Futura", "Optima", "Gill Sans", "Candara", "Century Gothic", "SF Pro Text", "Apple Color Emoji"];
	let last = null,
		stable = {},
		lastGroups = [],
		netRows = [],
		netBusy = false;
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
	function n_gp() {
		try {
			return String([...navigator.getGamepads()].filter(Boolean).length) + " bağlı";
		} catch (e) {
			return "bilinmiyor";
		}
	}
	const msf = (x) => (isFinite(x) && x >= 0 ? x.toFixed(0) + " ms" : "—");
	function navT() {
		return performance.getEntriesByType("navigation")[0] || {};
	}
	function navTimes() {
		const N = navT();
		return "DNS " + msf(N.domainLookupEnd - N.domainLookupStart) + ", TCP " + msf(N.connectEnd - N.connectStart) + ", TLS " + (N.secureConnectionStart > 0 ? msf(N.connectEnd - N.secureConnectionStart) : "—") + ", TTFB " + msf(N.responseStart - N.requestStart);
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
			return "yok";
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
			return "yok";
		}
	}
	function storage() {
		const t = (k) => {
			try {
				window[k].setItem("_t", "1");
				window[k].removeItem("_t");
				return true;
			} catch (e) {
				return false;
			}
		};
		return "localStorage " + (t("localStorage") ? "var" : "yok") + ", sessionStorage " + (t("sessionStorage") ? "var" : "yok") + ", IndexedDB " + (window.indexedDB ? "var" : "yok");
	}
	const mq = (q) => matchMedia(q).matches;
	const tryP = async (f, d = "bilinmiyor") => {
		try {
			const v = await Promise.race([f(), new Promise((_, r) => setTimeout(r, 1800))]);
			return v ?? d;
		} catch (e) {
			return d;
		}
	};
	async function extras() {
		const n = navigator,
			X = {},
			sec = (v) => (v === Infinity ? "—" : Math.round(v) + " sn");
		X.bat = await tryP(async () => {
			if (!n.getBattery) return "API yok (Firefox ve Safari kapalı tutuyor)";
			const b = await n.getBattery();
			return { l: Math.round(b.level * 100) + "%", c: b.charging ? "evet" : "hayır", ct: sec(b.chargingTime), dt: sec(b.dischargingTime) };
		});
		X.he = await tryP(async () => (n.userAgentData ? await n.userAgentData.getHighEntropyValues(["architecture", "bitness", "model", "platformVersion", "uaFullVersion", "fullVersionList", "wow64"]) : null));
		X.dev = await tryP(async () => {
			const c = { audioinput: 0, videoinput: 0, audiooutput: 0 };
			(await n.mediaDevices.enumerateDevices()).forEach((d) => c[d.kind]++);
			return "mikrofon " + c.audioinput + ", kamera " + c.videoinput + ", hoparlör " + c.audiooutput;
		});
		X.vox = await tryP(
			() =>
				new Promise((res) => {
					const s = speechSynthesis,
						f = () => {
							const v = s.getVoices();
							if (v.length)
								res(
									v.length +
										" ses: " +
										v
											.slice(0, 4)
											.map((x) => x.name)
											.join(", ") +
										(v.length > 4 ? "…" : ""),
								);
						};
					f();
					s.onvoiceschanged = f;
					setTimeout(() => res("0 ses"), 1200);
				}),
		);
		X.perm = await tryP(async () => {
			const o = [];
			for (const nm of ["geolocation", "notifications", "camera", "microphone", "clipboard-read", "midi", "push"]) {
				try {
					o.push(nm + ": " + (await n.permissions.query({ name: nm })).state);
				} catch (e) {}
			}
			return o.join(", ") || null;
		});
		X.gpu = await tryP(async () => {
			if (!n.gpu) return "WebGPU yok";
			const a = await n.gpu.requestAdapter();
			if (!a) return "adaptör yok";
			const i = a.info || {};
			return [i.vendor, i.architecture, i.device, i.description].filter(Boolean).join(" / ") || "bilgi gizli";
		});
		X.est = await tryP(async () => {
			const e = await n.storage.estimate();
			return { q: (e.quota / 1073741824).toFixed(1) + " GB", u: (e.usage / 1048576).toFixed(1) + " MB" };
		});
		X.kb = await tryP(async () => {
			const m = await n.keyboard.getLayoutMap();
			return "Q→" + m.get("KeyQ") + ", Y→" + m.get("KeyY") + ", Z→" + m.get("KeyZ") + ", ;→" + m.get("Semicolon");
		});
		X.wa = await tryP(async () => ((await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()) ? "var (Windows Hello, Touch ID vb.)" : "yok"));
		X.math = (await sha([Math.tan(-1e300), Math.sinh(1), Math.expm1(1), Math.cosh(10), Math.atanh(0.5)].join("|"))).slice(0, 16);
		const v = document.createElement("video"),
			a = document.createElement("audio");
		X.codec =
			[
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
				.map((x) => x[0])
				.join(", ") || "yok";
		X.feat = [
			["Bluetooth", !!n.bluetooth],
			["USB", !!n.usb],
			["Serial", !!n.serial],
			["HID", !!n.hid],
			["Paylaş", !!n.share],
			["WakeLock", !!n.wakeLock],
			["Titreşim", !!n.vibrate],
			["ServiceWorker", !!n.serviceWorker],
			["WebAssembly", typeof WebAssembly == "object"],
			["SharedArrayBuffer", typeof SharedArrayBuffer == "function"],
			["OffscreenCanvas", typeof OffscreenCanvas == "function"],
			["WebRTC", !!window.RTCPeerConnection],
			["MediaRecorder", !!window.MediaRecorder],
			["Bildirim", !!window.Notification],
			["WebGL2", !!document.createElement("canvas").getContext("webgl2")],
			["WebXR", !!n.xr],
		];
		const ro = Intl.DateTimeFormat().resolvedOptions();
		X.intl = ro.locale + ", takvim " + ro.calendar + ", rakam " + ro.numberingSystem + ", " + new Intl.NumberFormat().format(1234567.891) + ", " + new Date(2020, 11, 31, 23, 59).toLocaleString();
		let m = 1e9,
			p = performance.now();
		for (let i = 0; i < 3000; i++) {
			const q = performance.now();
			if (q > p) {
				m = Math.min(m, q - p);
				p = q;
			}
		}
		X.tim = m < 1e9 ? (m * 1000).toFixed(0) + " µs" : "bilinmiyor";
		return X;
	}
	async function collect() {
		const n = navigator,
			c = n.connection || {};
		const gl = webgl(),
			X = await extras();
		const B = typeof X.bat == "object" ? X.bat : { l: X.bat, c: "—", ct: "—", dt: "—" },
			H = typeof X.he == "object" ? X.he : {},
			E = typeof X.est == "object" ? X.est : { q: X.est, u: "—" };
		const canvas = canvasData(),
			audio = await audioData(),
			fl = fonts();
		const [canvasH, audioH] = await Promise.all([sha(canvas), sha(audio)]);
		const groups = [
			[
				"Tarayıcı",
				[
					["User-Agent", n.userAgent],
					["Platform", n.userAgentData?.platform || n.platform],
					["Diller", (n.languages || [n.language]).join(", ")],
					["Saat dilimi", Intl.DateTimeFormat().resolvedOptions().timeZone],
					["UTC farkı", String(-new Date().getTimezoneOffset() / 60), 1],
					["Çerezler", n.cookieEnabled ? "Açık" : "Kapalı"],
					["Do Not Track", { 1: "Açık", 0: "Kapalı" }[n.doNotTrack ?? window.doNotTrack] ?? "belirtilmemiş"],
					["Depolama", storage()],
					["PDF görüntüleyici", n.pdfViewerEnabled === undefined ? "bilinmiyor" : String(n.pdfViewerEnabled)],
				],
			],
			[
				"Ekran",
				[
					["Çözünürlük", screen.width + " × " + screen.height],
					["Kullanılabilir alan", screen.availWidth + " × " + screen.availHeight],
					["Pencere", innerWidth + " × " + innerHeight, 1],
					["Yön", screen.orientation ? screen.orientation.type + " " + screen.orientation.angle + "°" : "bilinmiyor", 1],
					["İşaretçi", mq("(pointer: fine)") ? "hassas (fare)" : mq("(pointer: coarse)") ? "kaba (dokunmatik)" : "yok"],
					["Üzerine gelme (hover)", mq("(any-hover: hover)") ? "var" : "yok"],
					["Piksel oranı", String(devicePixelRatio), 1],
					["Renk derinliği", screen.colorDepth + " bit"],
					["Renk teması", mq("(prefers-color-scheme: dark)") ? "koyu" : "açık", 1],
					["Hareketi azalt", mq("(prefers-reduced-motion: reduce)") ? "evet" : "hayır"],
					["HDR / geniş gamut", (mq("(dynamic-range: high)") ? "HDR" : "SDR") + " / " + (mq("(color-gamut: p3)") ? "P3" : "sRGB")],
				],
			],
			[
				"Donanım",
				[
					["Mantıksal çekirdek", String(n.hardwareConcurrency ?? "bilinmiyor")],
					["Bellek (yaklaşık)", n.deviceMemory ? n.deviceMemory + " GB" : "bilinmiyor"],
					["Dokunmatik nokta", String(n.maxTouchPoints || 0)],
					["Ağ türü", c.effectiveType ? c.effectiveType + (c.saveData ? " (veri tasarrufu)" : "") : "bilinmiyor", 1],
				],
			],
			[
				"Bağlantı",
				[
					["Protokol", location.protocol + " / " + (navT().nextHopProtocol || "bilinmiyor"), 1],
					["Ana makine", location.host || "yerel dosya", 1],
					["Güvenli bağlam", String(isSecureContext) + ", crossOriginIsolated " + String(self.crossOriginIsolated), 1],
					["Bağlantı türü", (navigator.connection || {}).type || "bilinmiyor", 1],
					["Etkin ağ türü", (navigator.connection || {}).effectiveType || "bilinmiyor", 1],
					["Azami indirme", (navigator.connection || {}).downlinkMax ? navigator.connection.downlinkMax + " Mb/sn" : "bilinmiyor", 1],
					["Veri tasarrufu", String((navigator.connection || {}).saveData ?? "bilinmiyor"), 1],
					["Bağlantı süreleri", navTimes(), 1],
					["Sayfa boyutu", navT().transferSize ? (navT().transferSize / 1024).toFixed(1) + " KB" : "bilinmiyor", 1],
				],
			],
			[
				"Pil ve güç",
				[
					["Şarj seviyesi", B.l, 1],
					["Şarj oluyor", B.c, 1],
					["Dolmasına kalan", B.ct, 1],
					["Boşalmasına kalan", B.dt, 1],
				],
			],
			[
				"Ayrıntılı tarayıcı kimliği (UA-CH)",
				[
					["Mimari / bit", (H.architecture || "—") + " / " + (H.bitness || "—")],
					["Cihaz modeli", H.model || "—"],
					["Platform sürümü", H.platformVersion || "—"],
					["Tam sürüm", H.uaFullVersion || "—"],
					["Marka listesi", (H.fullVersionList || []).map((b) => b.brand + " " + b.version).join(", ") || "—"],
				],
			],
			[
				"Cihazlar ve ağ",
				[
					["Medya aygıtları", X.dev, 1],
					["Gamepad", n_gp(), 1],
					["İndirme hızı / gecikme", navigator.connection ? navigator.connection.downlink + " Mb/sn / " + navigator.connection.rtt + " ms" : "bilinmiyor", 1],
					["Çevrimiçi", navigator.onLine ? "evet" : "hayır", 1],
					["Disk kotası", E.q, 1],
					["Kullanılan depolama", E.u, 1],
					["JS yığın sınırı", performance.memory ? Math.round(performance.memory.jsHeapSizeLimit / 1048576) + " MB" : "yok"],
					["Klavye düzeni", X.kb],
					["Biyometrik kimlik (WebAuthn)", X.wa],
				],
			],
			[
				"İzinler ve yetenekler",
				[
					["İzin durumları", X.perm, 1],
					["Eklentiler", [...navigator.plugins].map((p) => p.name).join(", ") || "yok"],
					["Destek listesi", X.feat.map(([k, v]) => (v ? "✓ " : "✗ ") + k).join("  ")],
					["Codec desteği", X.codec],
					["WebGPU", X.gpu],
					["Konuşma sentezi sesleri", X.vox, 1],
				],
			],
			[
				"Yerel ayarlar ve zaman",
				[
					["Intl örneği", X.intl],
					["Zamanlayıcı hassasiyeti", X.tim, 1],
					["Math özeti", X.math],
					["Sayfa", (document.referrer || "yönlendiren yok") + ", geçmiş " + history.length + ", " + document.characterSet, 1],
				],
			],
			[
				"Otomasyon izleri",
				[
					["webdriver", String(navigator.webdriver)],
					["Headless ipucu", /Headless/i.test(navigator.userAgent) ? "evet" : "hayır"],
					["window.chrome", window.chrome ? "var" : "yok"],
				],
			],
			[
				"Grafik ve ses",
				[
					["WebGL üretici", gl ? gl.vendor : "desteklenmiyor"],
					["WebGL ekran kartı", gl ? gl.renderer : "desteklenmiyor"],
					["WebGL azami doku", gl ? String(gl.maxTexture) : "—"],
					["Canvas özeti", canvasH.slice(0, 24)],
					["Ses özeti", audio === "yok" ? "yok" : audioH.slice(0, 24)],
				],
			],
			["Yazı tipleri", [["Bulunan (" + fl.length + "/" + FONTS.length + ")", fl.join(", ") || "hiçbiri"]]],
		];
		return groups;
	}
	function render(groups) {
		lastGroups = groups;
		const out = $("#out");
		out.textContent = "";
		groups.forEach(([title, rows]) => {
			const s = document.createElement("section"),
				h = document.createElement("h2"),
				dl = document.createElement("dl");
			h.textContent = title;
			rows.forEach(([k, v]) => {
				const r = document.createElement("div"),
					dt = document.createElement("dt"),
					dd = document.createElement("dd");
				r.className = "row";
				dt.textContent = k;
				dd.textContent = v;
				r.append(dt, dd);
				dl.append(r);
			});
			s.append(h, dl);
			out.append(s);
		});
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
	function split(groups) {
		const all = {},
			flat = {};
		groups.forEach(([t, rows]) =>
			rows.forEach(([k, v, vol]) => {
				const key = t + "/" + k;
				all[key] = v;
				if (!vol) flat[key] = v;
			}),
		);
		return { all, flat };
	}
	async function run() {
		$("#hash").textContent = "Hesaplanıyor…";
		const groups = await collect();
		render(groups);
		const { all, flat } = split(groups);
		last = all;
		stable = flat;
		const hex = await sha(JSON.stringify(flat));
		$("#hash").textContent = hex;
		const nA = Object.keys(all).length,
			nS = Object.keys(flat).length;
		rings(hex);
	}
	$("#again").onclick = run;
	$("#copy").onclick = async () => {
		try {
			await navigator.clipboard.writeText(JSON.stringify(last, null, 2));
			$("#copy").textContent = "Kopyalandı";
		} catch (e) {
			$("#copy").textContent = "Kopyalanamadı";
		}
		setTimeout(() => ($("#copy").textContent = "JSON’u kopyala"), 1500);
	};
	run();
})();
