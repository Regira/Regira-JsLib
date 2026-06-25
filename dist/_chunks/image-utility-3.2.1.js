import { startsWith as e, trim as t } from "../utilities/string-utility.js";
import { A as n, _ as r, g as i, j as a, n as o, p as s } from "./array-utility-3.2.1.js";
import c from "../utilities/file-utility.js";
//#region src/utilities/color-utility.ts
var l = (e, t, n) => "#" + [
	e,
	t,
	n
].map((e) => e.toString(16).padStart(2, "0")).join(""), u = (e, n) => {
	e.length === 4 && (e = "#" + a(t(e, "#").toLowerCase()).reduce((e, t) => e + t + t, ""));
	let r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
	return r ? {
		r: parseInt(r[1], 16),
		g: parseInt(r[2], 16),
		b: parseInt(r[3], 16),
		a: n ?? 1
	} : null;
}, d = (e, t) => {
	let n = u(e, t);
	return n ? `rgba(${n.r}, ${n.g}, ${n.b}, ${n.a})` : null;
}, f = (e, t) => {
	let n = u(e, t);
	if (!n) return [
		0,
		0,
		0,
		1
	];
	let { r, g: i, b: a, a: o = 1 } = n;
	return [
		r,
		i,
		a,
		o
	];
}, p = (n, r) => {
	if (s(n)) {
		let [e, t, r, i = 1] = n;
		return `rgba(${e},${t},${r},${i})`;
	}
	if (typeof n == "string") {
		if (e(n, "#")) return d(n, r);
		if (e(n, "rgba")) return n;
		if (e(n, "rgb")) return p(t(n.substring(3), "()").split(",").map(Number), r);
	}
	return null;
}, m = (e, t, n) => {
	let [r, i, a] = [
		e,
		t,
		n
	].map((e) => 255 - e);
	return {
		ri: r,
		gi: i,
		bi: a
	};
}, h = {
	rgbToHex: l,
	hexToRgb: u,
	hexToRgbString: d,
	hexToRgbArray: f,
	getRgbString: p,
	invertRgb: m,
	invertHex: (e) => {
		let [t, n, r] = f(e), { ri: i, gi: a, bi: o } = m(t, n, r);
		return l(i, a, o);
	},
	grayscale: (e, t = "average") => {
		let a = n(f(e), 3), s;
		switch (t) {
			case "light": {
				let e = Math.round(i(a) * .8);
				s = [
					e,
					e,
					e
				];
				break;
			}
			case "dark": {
				let e = r(a);
				s = [
					e,
					e,
					e
				];
				break;
			}
			case "weight": {
				let e = [
					.21,
					.72,
					.07
				], t = Math.round(a.reduce((t, n, r) => t + n * e[r], 0));
				s = [
					t,
					t,
					t
				];
				break;
			}
			default: {
				let e = Math.round(o(a));
				s = [
					e,
					e,
					e
				];
				break;
			}
		}
		return l(...s);
	}
}, g = {
	jpg: "image/jpeg",
	png: "image/png",
	gif: "image/gif"
}, _ = g.jpg, v = async (e) => {
	let t = await T(e), n = new FileReader();
	return new Promise((e) => {
		n.onloadend = (t) => {
			let n = new Uint8Array(t.target.result).subarray(0, 4), r = "";
			for (var i = 0; i < n.length; i++) r += n[i].toString(16);
			let a;
			switch (r) {
				case "89504e47":
					a = g.png;
					break;
				case "47494638":
					a = g.gif;
					break;
				case "ffd8ffe0":
				case "ffd8ffe1":
				case "ffd8ffe2":
				case "ffd8ffe3":
				case "ffd8ffe8":
					a = g.jpg;
					break;
				default:
					a = void 0;
					break;
			}
			e(a);
		}, n.readAsArrayBuffer(t);
	});
}, y = (e) => (e || g.jpg).replace("/jpg", "/jpeg"), b = (e, t, n = {
	backgroundColor: "#ffffff",
	imageSmoothingEnabled: !1
}) => {
	let r = window.document.createElement("canvas");
	return r.width = e, r.height = t, n && x(r, n), r;
}, x = (e, t) => {
	let n = e.getContext("2d");
	return t != null && Object.keys(t).forEach(function(r) {
		let i = t[r];
		if (i !== null) switch (r) {
			case "backgroundColor":
			case "background-color":
				n.fillStyle = p(i, void 0), n.fillRect(0, 0, e.width, e.height);
				break;
			case "image":
				n.drawImage(i, 0, 0);
				break;
			default: n[r] = i;
		}
	}), n;
}, S = (e) => {
	x(e).clearRect(0, 0, e.width, e.height);
}, C = async (e) => new Promise((t, n) => {
	let r = new Image();
	r.onload = () => t(r), r.onerror = n, r.src = e;
}), w = async (e) => C(c.createUrl(e)), T = async (e, t, n) => c.urlToBlob(e.src, t), E = async (e, t = _, n = 1) => C(e.toDataURL(t, n)), D = (e, t, n) => {
	let r = b(t || e.width, n || e.height);
	return x(r).drawImage(e, 0, 0, t || e.width, n || e.height), r;
}, O = {
	contentTypes: g,
	getImageContentType: v,
	parseContentType: y,
	urlToImage: C,
	blobToImage: w,
	imageToBlob: T,
	canvasToImage: E,
	imageToCanvas: D,
	canvasToBlob: async (e, t = _, n = 1) => new Promise((r) => e.toBlob(r, t, n)),
	base64ToImage: async (e) => C(e),
	imageToBase64: (e, t = _, n = 1) => D(e).toDataURL(t, n),
	resizeByScale: async (e, t, { quality: n = 1, type: r = _ } = {}) => {
		function i(e, t, n) {
			var r = t * t, i = e.width, a = e.height, o = Math.floor(i * t), s = Math.floor(a * t), c = 0, l = 0, u = 0, d = 0, f = 0, p = 0, m = 0, h = 0, _ = 0, v = 0, y = 0, S = 0, C = 0, w = 0, T = 0, E = !1, D = !1, O = x(e).getImageData(0, 0, i, a).data, k = new Float32Array(3 * o * s), A = 0, j = 0, M = 0;
			for (l = 0; l < a; l++) for (f = l * t, _ = 0 | f, p = 3 * _ * o, D = _ !== (0 | f + t), D && (w = _ + 1 - f, T = f + t - _ - 1), c = 0; c < i; c++, u += 4) d = c * t, h = 0 | d, m = p + h * 3, E = h !== (0 | d + t), E && (S = h + 1 - d, C = d + t - h - 1), A = O[u], j = O[u + 1], M = O[u + 2], !E && !D ? (k[m] += A * r, k[m + 1] += j * r, k[m + 2] += M * r) : E && !D ? (v = S * t, k[m] += A * v, k[m + 1] += j * v, k[m + 2] += M * v, y = C * t, k[m + 3] += A * y, k[m + 4] += j * y, k[m + 5] += M * y) : D && !E ? (v = w * t, k[m] += A * v, k[m + 1] += j * v, k[m + 2] += M * v, y = T * t, k[m + 3 * o] += A * y, k[m + 3 * o + 1] += j * y, k[m + 3 * o + 2] += M * y) : (v = S * w, k[m] += A * v, k[m + 1] += j * v, k[m + 2] += M * v, y = C * w, k[m + 3] += A * y, k[m + 4] += j * y, k[m + 5] += M * y, y = S * T, k[m + 3 * o] += A * y, k[m + 3 * o + 1] += j * y, k[m + 3 * o + 2] += M * y, y = C * T, k[m + 3 * o + 3] += A * y, k[m + 3 * o + 4] += j * y, k[m + 3 * o + 5] += M * y);
			var N = b(o, s), P = x(N, { "background-color": n === g.jpg ? "#FFF" : null }), F = P.getImageData(0, 0, o, s), I = F.data, L = 0;
			for (u = 0, m = 0; L < o * s; u += 3, m += 4, L++) I[m] = Math.ceil(k[u]), I[m + 1] = Math.ceil(k[u + 1]), I[m + 2] = Math.ceil(k[u + 2]), I[m + 3] = 255;
			return P.putImageData(F, 0, 0), N;
		}
		function a(e, t, n) {
			let r = b(e.width, e.height);
			return x(r, { "background-color": n === g.png ? "transparent" : n === g.jpg ? "#FFF" : null }).drawImage(e, 0, 0), i(r, t, n);
		}
		let o = y(r || await v(e));
		return E(a(e, t, o), o, n);
	},
	resize: async (e, t, { quality: n = 1, type: r = _ } = {}) => {
		let { width: i, height: a } = e, [o = 0, c = o] = s(t) ? t : [t, t];
		o == 0 && (o = c / a * i), c == 0 && (c = o / i * a);
		let l = b(o, c), u = x(l, { imageSmoothingEnabled: !1 }), d = .5, f = b(i * d, a * d);
		return x(f, { imageSmoothingEnabled: !1 }).drawImage(f, 0, 0, i * d, a * d), u.drawImage(f, 0, 0, i * d, a * d, 0, 0, o, c), E(l, y(r || await v(e)) || g.png, n);
	},
	rotate: async (e, t = 1, n = _) => {
		let r = t > 0 ? 90 : t < 0 ? -90 : 0, i = Math.max(e.width, e.height), a = e.naturalWidth, o = e.naturalHeight, s = r === 0 ? a : o, c = r === 0 ? o : a, l = y(n || await v(e)), u = b(i, i), d = x(u, {
			imageSmoothingEnabled: !1,
			"background-color": l === g.jpg ? "#FFF" : null
		});
		d.translate(u.width / 2, u.height / 2), d.rotate(r * Math.PI / 180), d.translate(-(u.width / 2), -(u.height / 2)), d.drawImage(e, (u.width - a) / 2, (u.height - o) / 2);
		let f = d.getImageData((i - s) / 2, (i - c) / 2, s, c), p = b(s, c);
		return x(p, {
			imageSmoothingEnabled: !1,
			"background-color": l === g.jpg ? "#FFF" : null
		}).putImageData(f, 0, 0), E(p, l, 1);
	},
	flipFlop: async (e, t, n, r = _) => {
		let i = y(r || await v(e)), a = D(e), o = x(a, { "background-color": i === g.jpg ? "#FFF" : null });
		return o.translate(t ? e.width : 0, n ? e.height : 0), o.scale(t ? -1 : 1, n ? -1 : 1), S(a), o.drawImage(e, 0, 0), o.restore(), E(a, i, 1);
	},
	convertType: async (e, t) => {
		let n = b(e.width, e.height);
		return x(n, { "background-color": t === g.jpg ? "#FFF" : null }).drawImage(e, 0, 0), E(n, t, 1);
	},
	getLightness: (e) => {
		let t = 0, n = D(e), r = x(n).getImageData(0, 0, n.width, n.height).data, i, a, o, s;
		for (let e = 0, n = r.length; e < n; e += 4) i = r[e], a = r[e + 1], o = r[e + 2], s = Math.floor((i + a + o) / 3), t += s;
		return Math.floor(t / (e.width * e.height));
	},
	white2transparent: async (e, t) => {
		let n = e.width, r = e.height, i = D(e), a = x(i), o = a.getImageData(0, 0, n, r), s = o.data;
		for (let e = 0; e < s.length; e += 4) s[e + 0] >= 255 - t && s[e + 1] >= 255 - t && s[e + 2] >= 255 - t && (s[e + 3] = 0);
		return a.putImageData(o, 0, 0), E(i, g.png, 1);
	}
};
//#endregion
export { h as n, O as t };
