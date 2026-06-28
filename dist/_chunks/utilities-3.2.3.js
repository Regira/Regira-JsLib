import e from "../utilities/string-utility.js";
import { L as t, P as n, t as r } from "./array-utility-3.2.3.js";
import { t as i } from "./datetime-utility-3.2.3.js";
import a from "../utilities/promise-utility.js";
import o from "../utilities/file-utility.js";
import { n as s, t as c } from "./image-utility-3.2.3.js";
import { i as l, r as u, t as d } from "./clipboard-utility-3.2.3.js";
//#region src/utilities/http-utility.ts
var f = () => location.hostname === "localhost" || location.hostname === "127.0.0.1", p = (e) => (typeof e == "string" ? new URL(e) : e).protocol === "https:", m = (e) => {
	let t = new URL(e);
	return p(t) ? e : "https:" + e.substring(t.protocol.length);
}, h = {
	isLocalHost: f,
	getHttpsUrl: m,
	forceHttps: (e) => {
		let t = m(e);
		t !== e && !f() && l(t);
	},
	toQueryString: (e, t = !1) => {
		let n = (e, t) => `${encodeURIComponent(e)}=${encodeURIComponent(String(t))}`, r = (e, i) => Object.entries(e).filter((e) => t || e[1] != null).flatMap(([e, t]) => {
			let a = i ? `${i}[${e}]` : e;
			return Array.isArray(t) ? t.map((e) => n(a, e)) : typeof t == "object" && t ? r(t, a) : [n(a, t)];
		});
		return r(e).join("&");
	},
	getQueryStringParams: (e = window.location.href) => {
		let t = new URL(e), n = new URLSearchParams(t.search);
		return Object.fromEntries(n.entries());
	}
}, g = {
	arrayUtility: r,
	colorUtility: s,
	datetimeUtility: i,
	fileUtility: o,
	htmlUtility: u,
	httpUtility: h,
	imageUtility: c,
	numberUtility: n,
	objectUtility: t,
	promiseUtility: a,
	stringUtility: e,
	//webpackUtility,
	clipboardUtility: d
};
//#endregion
export { h as n, g as t };
