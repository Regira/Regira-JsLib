import { A as e, I as t, O as n, h as r, j as i } from "../_chunks/array-utility-3.2.6.js";
//#region src/utilities/file-utility.ts
function a(e, t) {
	let n = Uint8Array.from(e, (e) => e.charCodeAt(0));
	return new Blob([n], { type: t });
}
var o = ({ multiple: e, accept: t } = {}) => new Promise(function(n) {
	let r = document.createElement("input");
	r.setAttribute("type", "file"), (e == null || e) && r.setAttribute("multiple", "true"), t != null && r.setAttribute("accept", Array.isArray(t) ? t.join(",") : t), r.value = "", r.setAttribute("style", "display: none;");
	function i() {
		let e = [...r.files];
		r.removeEventListener("change", i), document.body.removeChild(r), n(e);
	}
	r.addEventListener("change", i), r.addEventListener("cancel", () => n([])), document.body.appendChild(r), r.click();
}), s = (e) => e != null && e instanceof Blob, c = (e) => URL.createObjectURL(e), l = (e) => URL.revokeObjectURL(e), u = (e) => {
	if (!e || !e.includes("/")) return e;
	if (e.endsWith("/")) throw Error("filename cannot end with a '/'");
	return r(e.split("/").filter((e) => !!e));
}, d = (e) => {
	let t = r(n(e.split("."), 1));
	return t ? "." + t : "";
}, f = (t) => {
	if (!t) return;
	let n = u(t);
	if (!n || !n.includes(".")) return n;
	let r = n.split(".");
	return e(r, r.length - 1 || 1).join(".");
}, p = (e, n, { filesParameterName: r = "files" } = {}) => {
	let a = i(e).reduce((e, t) => (e.append(r, t, t.name), e), new FormData()), o = t(n);
	return Object.entries(o).reduce((e, t) => (e.append(t[0], t[1]), e), a);
}, m = async (e, t, n) => {
	let r = new Blob([e], { type: n ?? e.type });
	return r.name = t ?? e.name, r;
}, h = (e, t, n) => {
	let r = e.slice(0, 100).includes(","), i = r ? e.slice(e.indexOf(",") + 1) : e;
	!n && r && (n = e.slice(0, e.indexOf(",")).split(":")[1].split(";")[0]);
	let o = a(atob(i), n ?? "");
	return o.name = t, o;
}, g = async (e, t) => {
	let n = await fetch(e), r = n.headers.get("content-disposition");
	if (r && r.indexOf("attachment") !== -1) {
		let e = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(r);
		e != null && e[1] && (t = e[1].replace(/['"]/g, ""));
	}
	let i = await n.blob();
	return t && (i.name = t), i;
}, _ = async (e) => new Promise(function(t) {
	let n = new FileReader();
	n.onload = (e) => t(e.target.result), n.readAsDataURL(e);
}), v = async (e) => e.text(), y = (e, t, n) => {
	let r = new Blob([e], { type: n });
	return t && (r.name = t), r;
}, b = (e, t) => {
	let n = URL.createObjectURL(e), r = document.createElement("a");
	r.href = n, r.download = t ?? e.name ?? "file", r.rel = "noopener", r.style.display = "none", document.body.appendChild(r), r.click(), r.remove(), setTimeout(() => URL.revokeObjectURL(n), 4e4);
}, x = (e, t = !0, n = 1) => {
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
}, S = (e) => {
	e.preventDefault();
	let { dataTransfer: t } = e, n = [];
	if (t?.items) {
		for (let e = 0; e < t.items.length; e++) if (t.items[e].kind === "file") {
			let r = t.items[e].getAsFile();
			r && n.push(r);
		}
	} else t?.files && n.push(...Array.from(t.files));
	return n;
}, C = {
	isFile: s,
	createUrl: c,
	revokeUrl: l,
	getFilename: u,
	getExtension: d,
	getFilenameWithoutExtension: f,
	toFormData: p,
	fileToBlob: m,
	base64ToBlob: h,
	urlToBlob: g,
	blobToBase64: _,
	readAllText: v,
	writeAllText: y,
	saveAs: b,
	formatFileSize: x
};
//#endregion
export { h as base64ToBlob, _ as blobToBase64, o as browse, c as createUrl, C as default, S as dropHandler, m as fileToBlob, x as formatFileSize, d as getExtension, u as getFilename, f as getFilenameWithoutExtension, s as isFile, v as readAllText, l as revokeUrl, b as saveAs, p as toFormData, g as urlToBlob, y as writeAllText };
