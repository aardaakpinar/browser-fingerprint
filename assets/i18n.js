(function () {
	// Column order: English (the key), Türkçe, Español, 中文, हिन्दी.
	// To add a language: append its code to CODES and one column to every row.
	// Missing or empty cells fall back to English, so technical terms can be left out.
	const CODES = ["en", "tr", "es", "zh", "hi"];
	const TABLE = [
		// Page
		["How well does your browser know you?", "Tarayıcın Seni Ne Kadar Tanıyor?", "¿Cuánto te conoce tu navegador?", "你的浏览器有多了解你？", "आपका ब्राउज़र आपको कितना जानता है?"],
		["These values are collected without cookies, only from what your browser volunteers. Combined, they form a profile unique to you.", "Aşağıdaki değerler çerez olmadan, yalnızca tarayıcının kendiliğinden verdiği bilgilerden toplanır. Hepsi birleşince sana özgü bir izdüşümü oluşur.", "Estos valores se obtienen sin cookies, solo con lo que tu navegador revela por sí mismo. Combinados, forman un perfil único para ti.", "以下数值无需 Cookie，仅来自浏览器主动提供的信息。组合起来，就构成了独属于你的特征。", "ये मान बिना कुकीज़ के, केवल आपके ब्राउज़र द्वारा स्वयं दी गई जानकारी से जुटाए जाते हैं। मिलकर ये आपकी अनूठी प्रोफ़ाइल बनाते हैं।"],
		["Stable fingerprint", "Sabit parmak izi", "Huella estable", "稳定指纹", "स्थिर फ़िंगरप्रिंट"],
		["Computing…", "Hesaplanıyor…", "Calculando…", "计算中…", "गणना हो रही है…"],
		["Recalculate", "Yeniden hesapla", "Recalcular", "重新计算", "दोबारा गणना करें"],
		["Copy JSON", "JSON’u kopyala", "Copiar JSON", "复制 JSON", "JSON कॉपी करें"],
		["Copied", "Kopyalandı", "Copiado", "已复制", "कॉपी हो गया"],
		["Copy failed", "Kopyalanamadı", "Error al copiar", "复制失败", "कॉपी नहीं हो सका"],
		["Rings generated from the fingerprint", "Parmak izinden üretilen halkalar", "Anillos generados a partir de la huella", "由指纹生成的圆环", "फ़िंगरप्रिंट से बने छल्ले"],
		// Values
		["Yes", "Evet", "Sí", "是", "हाँ"],
		["No", "Hayır", "No", "否", "नहीं"],
		["Unknown", "Bilinmiyor", "Desconocido", "未知", "अज्ञात"],
		["Unsupported", "Desteklenmiyor", "No compatible", "不支持", "समर्थित नहीं"],
		["None", "Yok", "Ninguno", "无", "कोई नहीं"],
		["Unspecified", "Belirtilmemiş", "Sin especificar", "未指定", "अनिर्दिष्ट"],
		["Granted", "İzin verildi", "Concedido", "已允许", "अनुमत"],
		["Denied", "Reddedildi", "Denegado", "已拒绝", "अस्वीकृत"],
		["Ask", "Soruluyor", "Preguntar", "询问", "पूछें"],
		["Light", "Açık", "Claro", "浅色", "हल्का"],
		["Dark", "Koyu", "Oscuro", "深色", "गहरा"],
		["On", "Açık", "Activado", "开启", "चालू"],
		["Off", "Kapalı", "Desactivado", "关闭", "बंद"],
		["Mouse", "Fare", "Ratón", "鼠标", "माउस"],
		["Touch", "Dokunmatik", "Táctil", "触控", "टच"],
		["Local file", "Yerel dosya", "Archivo local", "本地文件", "स्थानीय फ़ाइल"],
		// Groups
		["Browser", "Tarayıcı", "Navegador", "浏览器", "ब्राउज़र"],
		["Screen", "Ekran", "Pantalla", "屏幕", "स्क्रीन"],
		["Hardware", "Donanım", "Hardware", "硬件", "हार्डवेयर"],
		["Connection", "Bağlantı", "Conexión", "连接", "कनेक्शन"],
		["Battery", "Pil", "Batería", "电池", "बैटरी"],
		["Detailed browser identity", "Ayrıntılı tarayıcı kimliği", "Identidad detallada del navegador", "浏览器详细标识", "ब्राउज़र की विस्तृत पहचान"],
		["Devices & storage", "Cihazlar ve depolama", "Dispositivos y almacenamiento", "设备与存储", "डिवाइस और स्टोरेज"],
		["Capabilities", "Yetenekler", "Capacidades", "功能支持", "क्षमताएँ"],
		["Locale & time", "Yerel ayar ve zaman", "Idioma y hora", "区域与时间", "क्षेत्र और समय"],
		["Automation signals", "Otomasyon izleri", "Señales de automatización", "自动化迹象", "ऑटोमेशन संकेत"],
		["Graphics & audio", "Grafik ve ses", "Gráficos y audio", "图形与音频", "ग्राफ़िक्स और ऑडियो"],
		["Fonts", "Yazı tipleri", "Fuentes", "字体", "फ़ॉन्ट"],
		// Browser
		["Platform", "Platform", "Plataforma", "平台", "प्लेटफ़ॉर्म"],
		["Languages", "Diller", "Idiomas", "语言", "भाषाएँ"],
		["Time zone", "Saat dilimi", "Zona horaria", "时区", "समय क्षेत्र"],
		["UTC offset", "UTC farkı", "Desfase UTC", "UTC 偏移", "UTC अंतर"],
		["Cookies enabled", "Çerezler etkin", "Cookies activadas", "Cookie 已启用", "कुकीज़ चालू"],
		["Web storage", "Web depolama", "Almacenamiento web", "网页存储", "वेब स्टोरेज"],
		["PDF viewer", "PDF görüntüleyici", "Visor de PDF", "PDF 查看器", "PDF व्यूअर"],
		// Screen
		["Resolution", "Çözünürlük", "Resolución", "分辨率", "रेज़ोल्यूशन"],
		["Available area", "Kullanılabilir alan", "Área disponible", "可用区域", "उपलब्ध क्षेत्र"],
		["Window size", "Pencere boyutu", "Tamaño de ventana", "窗口大小", "विंडो आकार"],
		["Orientation", "Yön", "Orientación", "方向", "ओरिएंटेशन"],
		["Pointer", "İşaretçi", "Puntero", "指针", "पॉइंटर"],
		["Hover support", "Üzerine gelme desteği", "Compatibilidad con hover", "支持悬停", "होवर समर्थन"],
		["Pixel ratio", "Piksel oranı", "Relación de píxeles", "像素比", "पिक्सेल अनुपात"],
		["Color depth", "Renk derinliği", "Profundidad de color", "色深", "कलर डेप्थ"],
		["Color scheme", "Renk teması", "Esquema de color", "配色方案", "रंग योजना"],
		["Reduced motion", "Hareketi azalt", "Reducir movimiento", "减少动态效果", "गति कम करें"],
		["Color gamut", "Renk gamı", "Gama de color", "色域", "कलर गैमट"],
		// Hardware
		["Logical cores", "Mantıksal çekirdek", "Núcleos lógicos", "逻辑核心数", "लॉजिकल कोर"],
		["Memory", "Bellek", "Memoria", "内存", "मेमोरी"],
		["Touch points", "Dokunma noktası", "Puntos táctiles", "触控点数", "टच पॉइंट"],
		// Connection
		["Protocol", "Protokol", "Protocolo", "协议", "प्रोटोकॉल"],
		["Host", "Ana makine", "Host", "主机", "होस्ट"],
		["Secure context", "Güvenli bağlam", "Contexto seguro", "安全上下文", "सुरक्षित संदर्भ"],
		["Cross-origin isolated", "Çapraz kaynak yalıtımı", "Aislamiento de origen cruzado", "跨源隔离", "क्रॉस-ऑरिजिन आइसोलेशन"],
		["Connection type", "Bağlantı türü", "Tipo de conexión", "连接类型", "कनेक्शन प्रकार"],
		["Effective type", "Etkin ağ türü", "Tipo efectivo", "有效网络类型", "प्रभावी नेटवर्क प्रकार"],
		["Max downlink", "Azami indirme", "Descarga máxima", "最大下行速度", "अधिकतम डाउनलिंक"],
		["Downlink", "İndirme hızı", "Descarga", "下行速度", "डाउनलिंक"],
		["Round-trip time", "Gecikme (RTT)", "Latencia (RTT)", "往返延迟", "राउंड-ट्रिप समय"],
		["Data saver", "Veri tasarrufu", "Ahorro de datos", "流量节省", "डेटा सेवर"],
		["Online", "Çevrimiçi", "En línea", "在线", "ऑनलाइन"],
		["Timings", "Süreler", "Tiempos", "耗时", "समय"],
		["Page size", "Sayfa boyutu", "Tamaño de página", "页面大小", "पेज आकार"],
		// Battery
		["Level", "Şarj seviyesi", "Nivel", "电量", "स्तर"],
		["Charging", "Şarj oluyor", "Cargando", "充电中", "चार्ज हो रही है"],
		["Time to full", "Dolmasına kalan", "Tiempo para carga completa", "充满剩余时间", "पूरा चार्ज होने में"],
		["Time to empty", "Boşalmasına kalan", "Tiempo hasta vaciarse", "耗尽剩余时间", "खाली होने में"],
		// UA-CH
		["Architecture", "Mimari", "Arquitectura", "架构", "आर्किटेक्चर"],
		["Device model", "Cihaz modeli", "Modelo del dispositivo", "设备型号", "डिवाइस मॉडल"],
		["Platform version", "Platform sürümü", "Versión de plataforma", "平台版本", "प्लेटफ़ॉर्म संस्करण"],
		["Full version", "Tam sürüm", "Versión completa", "完整版本", "पूर्ण संस्करण"],
		["Brands", "Markalar", "Marcas", "品牌列表", "ब्रांड"],
		// Devices & storage
		["Microphones", "Mikrofonlar", "Micrófonos", "麦克风", "माइक्रोफ़ोन"],
		["Cameras", "Kameralar", "Cámaras", "摄像头", "कैमरे"],
		["Speakers", "Hoparlörler", "Altavoces", "扬声器", "स्पीकर"],
		["Gamepads", "Oyun kolları", "Mandos", "游戏手柄", "गेमपैड"],
		["Storage quota", "Depolama kotası", "Cuota de almacenamiento", "存储配额", "स्टोरेज कोटा"],
		["Storage used", "Kullanılan depolama", "Almacenamiento usado", "已用存储", "उपयोग किया गया स्टोरेज"],
		["JS heap limit", "JS yığın sınırı", "Límite de heap JS", "JS 堆上限", "JS हीप सीमा"],
		["Keyboard layout", "Klavye düzeni", "Distribución del teclado", "键盘布局", "कीबोर्ड लेआउट"],
		["Platform authenticator", "Cihaz kimlik doğrulayıcı", "Autenticador de plataforma", "平台身份验证器", "प्लेटफ़ॉर्म ऑथेंटिकेटर"],
		// Capabilities
		["Permissions", "İzinler", "Permisos", "权限", "अनुमतियाँ"],
		["Plugins", "Eklentiler", "Complementos", "插件", "प्लगइन"],
		["Web APIs", "Web API’leri", "API web", "Web API", "वेब API"],
		["Codecs", "Codec’ler", "Códecs", "编解码器", "कोडेक"],
		["Speech voices", "Konuşma sesleri", "Voces de síntesis", "语音合成声音", "स्पीच आवाज़ें"],
		// Locale & time
		["Locale", "Yerel ayar", "Configuración regional", "区域设置", "लोकेल"],
		["Calendar", "Takvim", "Calendario", "日历", "कैलेंडर"],
		["Numbering system", "Rakam sistemi", "Sistema numérico", "数字系统", "अंक प्रणाली"],
		["Number format", "Sayı biçimi", "Formato numérico", "数字格式", "संख्या प्रारूप"],
		["Date format", "Tarih biçimi", "Formato de fecha", "日期格式", "दिनांक प्रारूप"],
		["Timer resolution", "Zamanlayıcı hassasiyeti", "Resolución del temporizador", "计时器精度", "टाइमर रिज़ॉल्यूशन"],
		["Math hash", "Math özeti", "Hash de Math", "Math 摘要", "Math हैश"],
		["Referrer", "Yönlendiren", "Referente", "来源页面", "रेफ़रर"],
		["History length", "Geçmiş uzunluğu", "Longitud del historial", "历史记录长度", "हिस्ट्री लंबाई"],
		["Charset", "Karakter kümesi", "Codificación", "字符集", "कैरेक्टर सेट"],
		// Automation
		["Headless hint", "Headless ipucu", "Indicio headless", "无头模式迹象", "हेडलेस संकेत"],
		["Chrome object", "Chrome nesnesi", "Objeto Chrome", "Chrome 对象", "Chrome ऑब्जेक्ट"],
		// Graphics & audio
		["GPU vendor", "GPU üreticisi", "Fabricante de GPU", "GPU 厂商", "GPU निर्माता"],
		["GPU renderer", "GPU modeli", "Renderizador de GPU", "GPU 渲染器", "GPU रेंडरर"],
		["Max texture size", "Azami doku boyutu", "Tamaño máximo de textura", "最大纹理尺寸", "अधिकतम टेक्सचर आकार"],
		["Canvas hash", "Canvas özeti", "Hash de Canvas", "Canvas 摘要", "Canvas हैश"],
		["Audio hash", "Ses özeti", "Hash de audio", "音频摘要", "ऑडियो हैश"],
		["Installed fonts", "Yüklü yazı tipleri", "Fuentes instaladas", "已安装字体", "इंस्टॉल किए गए फ़ॉन्ट"],
	];

	const DICT = {};
	CODES.forEach((c, i) =>
		TABLE.forEach((row) => {
			if (row[i]) (DICT[c] = DICT[c] || {})[row[0]] = row[i];
		}),
	);

	// The browser's language list in order; English when none is supported.
	function detect() {
		for (const l of navigator.languages || [navigator.language]) {
			const c = String(l).toLowerCase().split("-")[0];
			if (CODES.includes(c)) return c;
		}
		return "en";
	}

	let lang = detect();
	const t = (k) => (DICT[lang] && DICT[lang][k]) || k;
	document.documentElement.lang = lang;

	window.I18N = {
		t,
		codes: CODES,
		get lang() {
			return lang;
		},
	};
})();
