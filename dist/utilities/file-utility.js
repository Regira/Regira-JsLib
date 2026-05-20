import { A as e, I as t, O as n, h as r, j as i } from "../_chunks/array-utility-3.0.6.js";
//#region src/utilities/file-utility.ts
function a(e, t, n) {
	let r = new ArrayBuffer(e.length), i = new Uint8Array(r);
	for (let t = 0; t < e.length; t++) i[t] = e.charCodeAt(t);
	let a = new Blob([r], { type: n });
	return a.name = t, a;
}
function o(e, t, n = 512) {
	let r = [];
	for (let t = 0; t < e.length; t += n) {
		let i = e.slice(t, t + n), a = Array(i.length);
		for (let e = 0; e < i.length; e++) a[e] = i.charCodeAt(e);
		let o = new Uint8Array(a);
		r.push(o);
	}
	return new Blob(r, { type: t });
}
var s = ({ multiple: e, accept: t } = {}) => new Promise(function(n) {
	let r = document.createElement("input");
	r.setAttribute("type", "file"), (e == null || e) && r.setAttribute("multiple", "true"), t != null && r.setAttribute("accept", Array.isArray(t) ? t.join(",") : t), r.value = "", r.setAttribute("style", "display: none;");
	function i() {
		let e = [...r.files];
		r.removeEventListener("change", i), document.body.removeChild(r), n(e);
	}
	r.addEventListener("change", i), r.addEventListener("cancel", () => n([])), document.body.appendChild(r), r.click();
}), c = (e) => e != null && e instanceof Blob, l = (e) => URL.createObjectURL(e), u = (e) => URL.revokeObjectURL(e), d = (e) => {
	if (!e || !e.includes("/")) return e;
	if (e.endsWith("/")) throw Error("filename cannot end with a '/'");
	return r(e.split("/").filter((e) => !!e));
}, f = (e) => {
	let t = r(n(e.split("."), 1));
	return t ? "." + t : "";
}, p = (t) => {
	if (!t) return null;
	let n = d(t);
	if (!n || !n.includes(".")) return n;
	let r = n.split(".");
	return e(r, r.length - 1 || 1).join(".");
}, m = (e, n, { filesParameterName: r = "files" } = {}) => {
	let a = i(e).reduce((e, t) => (e.append(r, t, t.name), e), new FormData()), o = t(n);
	return Object.entries(o).reduce((e, t) => (e.append(t[0], t[1]), e), a);
}, h = async (e, t, n) => new Promise((r) => {
	let i = new FileReader();
	i.onload = () => r(a(i.result, t ?? e.name, n ?? e.type)), i.readAsBinaryString(e);
}), g = (e, t, n) => {
	let r = e.substr(0, 100).includes(","), i = r ? e.substr(e.indexOf(",") + 1) : e;
	!n && r && (n = e.substr(0, e.indexOf(",")).split(":")[1].split(";")[0]);
	let a = o(atob(i), n ?? "");
	return a.name = t, a;
}, _ = async (e, t) => {
	let n = await fetch(e), r = n.headers.get("content-disposition");
	if (r && r.indexOf("attachment") !== -1) {
		let e = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(r);
		e != null && e[1] && (t = e[1].replace(/['"]/g, ""));
	}
	let i = await n.blob();
	return t && (i.name = t), i;
}, v = async (e) => new Promise(function(t) {
	let n = new FileReader();
	n.onload = (e) => t(e.target.result), n.readAsDataURL(e);
}), y = async (e) => new Promise(function(t) {
	let n = new FileReader();
	n.onload = (e) => t(e.target.result), n.readAsText(e);
}), b = (e, t, n) => {
	let r = new Blob([e], { type: n });
	return t && (r.name = t), r;
}, x = (e, t) => {
	(function(e) {
		if (e == null || typeof navigator < "u" && /MSIE [1-9]\./.test(navigator.userAgent)) return null;
		let t = e.document, n = () => e.URL ?? e.webkitURL ?? e, r = t.createElementNS("http://www.w3.org/1999/xhtml", "a"), i = "download" in r, a = (e) => {
			e.dispatchEvent(new MouseEvent("click"));
		}, o = /constructor/i.test(String(e.HTMLElement ?? "")) || !!e.safari, s = /CriOS\/[\d]+/.test(navigator.userAgent), c = (t) => {
			e.setImmediate ? e.setImmediate(() => {
				throw t;
			}) : e.setTimeout(() => {
				throw t;
			}, 0);
		}, l = (e) => {
			setTimeout(() => {
				typeof e == "string" ? n().revokeObjectURL(e) : e.remove();
			}, 4e4);
		}, u = (e, t, n) => {
			let r = [].concat(t), i = r.length;
			for (; i--;) {
				let t = e["on" + r[i]];
				if (typeof t == "function") try {
					t.call(e, n ?? e);
				} catch (e) {
					c(e);
				}
			}
		}, d = (e) => /^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type) ? new Blob(["﻿", e], { type: e.type }) : e;
		function f(t, c, f) {
			f || (t = d(t));
			let p = this, m = t.type === "application/octet-stream", h, g = () => {
				u(p, "writestart progress write writeend".split(" "));
			}, _ = () => {
				if ((s || m && o) && e.FileReader) {
					let n = new FileReader();
					n.onloadend = function() {
						let t = s ? n.result : n.result.replace(/^data:[^;]*;/, "data:attachment/file;");
						e.open(t, "_blank") || (e.location.href = t), p.readyState = p.DONE, g();
					}, n.readAsDataURL(t), p.readyState = p.INIT;
					return;
				}
				h ||= n().createObjectURL(t), m ? e.location.href = h : e.open(h, "_blank") || (e.location.href = h), p.readyState = p.DONE, g(), l(h);
			};
			if (p.readyState = p.INIT, i) {
				h = n().createObjectURL(t), setTimeout(function() {
					r.href = h, r.download = c, a(r), g(), l(h), p.readyState = p.DONE;
				});
				return;
			}
			_();
		}
		let p = f.prototype, m = function(e, t, n) {
			new f(e, t || e.name || "download", n);
		}, h = navigator;
		return typeof navigator < "u" && h.msSaveOrOpenBlob ? function(e, t) {
			t = t || e.name || "download", h.msSaveOrOpenBlob(d(e), t);
		} : (p.abort = function() {}, p.readyState = p.INIT = 0, p.WRITING = 1, p.DONE = 2, p.error = p.onwritestart = p.onprogress = p.onwrite = p.onabort = p.onerror = p.onwriteend = null, m);
	})(typeof self < "u" ? self : typeof window < "u" ? window : null)?.(e, t ?? e.name ?? "file");
}, S = (e, t = !0, n = 1) => {
	let r = t ? 1e3 : 1024;
	if (Math.abs(e) < r) return e + " B";
	let i = t ? [
		"kB",
		"MB",
		"GB",
		"TB",
		"PB",
		"EB",
		"ZB",
		"YB"
	] : [
		"KiB",
		"MiB",
		"GiB",
		"TiB",
		"PiB",
		"EiB",
		"ZiB",
		"YiB"
	], a = -1, o = 10 ** n;
	do
		e /= r, ++a;
	while (Math.round(Math.abs(e) * o) / o >= r && a < i.length - 1);
	return e.toFixed(n) + " " + i[a];
}, C = (e) => {
	e.preventDefault();
	let { dataTransfer: t } = e, n = [];
	if (t?.items) {
		for (let e = 0; e < t.items.length; e++) if (t.items[e].kind === "file") {
			let r = t.items[e].getAsFile();
			r && n.push(r);
		}
	} else t?.files && n.push(...Array.from(t.files));
	return n;
}, w = {
	isFile: c,
	createUrl: l,
	revokeUrl: u,
	getFilename: d,
	getExtension: f,
	getFilenameWithoutExtension: p,
	toFormData: m,
	fileToBlob: h,
	base64ToBlob: g,
	urlToBlob: _,
	blobToBase64: v,
	readAllText: y,
	writeAllText: b,
	saveAs: x,
	formatFileSize: S
};
//#endregion
export { g as base64ToBlob, v as blobToBase64, s as browse, l as createUrl, w as default, C as dropHandler, h as fileToBlob, S as formatFileSize, f as getExtension, d as getFilename, p as getFilenameWithoutExtension, c as isFile, y as readAllText, u as revokeUrl, x as saveAs, m as toFormData, _ as urlToBlob, b as writeAllText };
