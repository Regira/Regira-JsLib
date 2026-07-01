import { isUrl as e } from "../utilities/string-utility.js";
import t from "../utilities/file-utility.js";
import { t as n } from "./image-utility-3.2.5.js";
import r from "axios";
//#region src/io/file-helper.ts
var i = class {
	async getBlob(n, r, i) {
		if (n instanceof File) return t.fileToBlob(n, r, i);
		if (n instanceof Blob) {
			let e = n;
			return r && e.name !== r && (e.name = r), e;
		}
		if (typeof n == "string") return e(n) ? t.urlToBlob(n, r) : t.base64ToBlob(n, r ?? "", i);
		throw Error("Cannot convert input to type Blob");
	}
	async getBase64Url(e) {
		let n = await this.getBlob(e);
		return t.blobToBase64(n);
	}
	async createUrl(e) {
		let n = await this.getBlob(e);
		return t.blobToBase64(n);
	}
	async browse(e = {}) {
		return new Promise(function(t) {
			let n = document.createElement("input");
			n.setAttribute("type", "file"), (e.multiple == null || e.multiple) && n.setAttribute("multiple", "true"), e.accept && n.setAttribute("accept", Array.isArray(e.accept) ? e.accept.join(",") : e.accept), n.value = "", n.setAttribute("style", "display: none;");
			function r() {
				let e = [...this.files ?? []];
				n.removeEventListener("change", r), document.body.removeChild(n), t(e);
			}
			n.addEventListener("change", r), document.body.appendChild(n), n.click();
		});
	}
	async readJson(e) {
		let n = await t.readAllText(e);
		try {
			return JSON.parse(n);
		} catch (t) {
			throw console.error("Could not parse blob to JSON", {
				blob: e,
				content: n,
				error: t
			}), t;
		}
	}
	async writeJson(e, n) {
		let r = JSON.stringify(e, null, 2);
		return t.writeAllText(r, n, "application/json");
	}
	async send(e, n, i = {}, a = {}) {
		let { method: o = "POST", headers: s, filesParameterName: c } = a;
		return r({
			method: o,
			url: e,
			data: t.toFormData(n || [], i || {}, c ? { filesParameterName: c } : {}),
			headers: {
				"Content-Type": "multipart/form-data",
				...s || {}
			}
		});
	}
	async saveAs(e, n, r) {
		let i = e, a = await this.getBlob(e, r || i.name, n || i.type);
		return t.saveAs(a, a.name || "file");
	}
}, a = class extends i {
	async getImage(e) {
		if (e instanceof HTMLImageElement) return e;
		if (typeof e == "string") return n.urlToImage(e);
		if (e instanceof Blob) return n.blobToImage(e);
		if (e instanceof HTMLCanvasElement) return n.canvasToImage(e);
		throw Error("Cannot convert input to type Image");
	}
	async getBlob(e, t, r) {
		return e instanceof HTMLImageElement ? n.imageToBlob(e, t, r) : e instanceof HTMLCanvasElement ? n.canvasToBlob(e, r) : super.getBlob(e, t, r);
	}
	async resize(e, t, r) {
		let i = await this.getImage(e);
		return n.resizeByScale(i, Math.min(1, t / Math.max(i.width, i.height)), r);
	}
	async rotate(e, t) {
		let r = n.parseContentType(e.type), i = await this.getImage(e);
		return n.rotate(i, t, r);
	}
	async flipHorizontally(e) {
		return this.flipFlop(e, !0);
	}
	async flipVertically(e) {
		return this.flipFlop(e, !1, !0);
	}
	async flipFlop(e, t = !1, r = !1, i) {
		let a = await this.getImage(e);
		return n.flipFlop(a, t, r, i);
	}
	async convertType(e, t) {
		let r = await this.getImage(e);
		return n.convertType(r, t);
	}
	async getLightness(e) {
		let t = await this.getImage(e);
		return n.getLightness(t);
	}
	async white2transparent(e, t = 0) {
		let r = await this.getImage(e);
		return n.white2transparent(r, t);
	}
}, o = {
	FileHelper: i,
	ImageHelper: a
};
//#endregion
export { a as n, i as r, o as t };
