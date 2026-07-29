import e from "../utilities/string-utility.js";
import { L as t, P as n, t as r } from "./array-utility-3.2.7.js";
import { n as i, t as a } from "./datetime-utility-3.2.7.js";
import o from "../utilities/promise-utility.js";
import s from "../utilities/file-utility.js";
import { n as c, t as l } from "./image-utility-3.2.7.js";
import { i as u, r as d, t as f } from "./clipboard-utility-3.2.7.js";
//#region src/utilities/http-utility.ts
var p = () => location.hostname === "localhost" || location.hostname === "127.0.0.1", m = (e) => (typeof e == "string" ? new URL(e) : e).protocol === "https:", h = (e) => {
	let t = new URL(e);
	return m(t) ? e : "https:" + e.substring(t.protocol.length);
}, g = {
	isLocalHost: p,
	getHttpsUrl: h,
	forceHttps: (e) => {
		let t = h(e);
		t !== e && !p() && u(t);
	},
	toQueryString: (e, t = !1) => {
		let n = (e) => e instanceof Date ? i(e) : String(e), r = (e, t) => {
			let r = n(t);
			return r === void 0 ? [] : [`${encodeURIComponent(e)}=${encodeURIComponent(r)}`];
		}, a = (e, n) => Object.entries(e).filter((e) => t || e[1] != null).flatMap(([e, t]) => {
			let i = n ? `${n}[${e}]` : e;
			return Array.isArray(t) ? t.flatMap((e) => r(i, e)) : typeof t == "object" && t && !(t instanceof Date) ? a(t, i) : r(i, t);
		});
		return a(e).join("&");
	},
	getQueryStringParams: (e = window.location.href) => {
		let t = new URL(e), n = new URLSearchParams(t.search);
		return Object.fromEntries(n.entries());
	}
}, _ = {
	arrayUtility: r,
	colorUtility: c,
	datetimeUtility: a,
	fileUtility: s,
	htmlUtility: d,
	httpUtility: g,
	imageUtility: l,
	numberUtility: n,
	objectUtility: t,
	promiseUtility: o,
	stringUtility: e,
	clipboardUtility: f
};
//#endregion
export { g as n, _ as t };
