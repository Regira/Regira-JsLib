import { startsWith as e } from "../../utilities/string-utility.js";
import { format as t, isDate as n, isValid as r } from "date-fns";
//#region src/vue/formatters/index.ts
function i(e, t) {
	if (!e || (typeof e == "string" && (e = new Date(e)), !n(e) || !r(e))) return "";
	if (t == null) return e.toLocaleDateString();
	let i = (e, t = 2) => e.toString().padStart(t, "0"), a = {
		d: e.getDate(),
		dd: i(e.getDate()),
		M: e.getMonth() + 1,
		MM: i(e.getMonth() + 1),
		yy: i(e.getFullYear() % 100),
		yyyy: i(e.getFullYear(), 4),
		h: e.getHours(),
		hh: i(e.getHours()),
		H: e.getHours(),
		HH: i(e.getHours()),
		m: e.getMinutes(),
		mm: i(e.getMinutes()),
		n: e.getMilliseconds(),
		nn: i(e.getMilliseconds()),
		nnn: i(e.getMilliseconds(), 3),
		nnnn: i(e.getMilliseconds(), 4)
	};
	return t.replace(/d{1,2}|M{1,2}|yy(?:yy)?|H{1,2}|h{1,2}|m{1,2}|n{1,4}/g, (e) => a[e]?.toString() ?? "");
}
var a = (e, t = "dd-MM-yyyy") => e ? i(e, t) : "", o = (e) => a(e, "yyyy-MM-dd"), s = (e) => a(e, "hh:mm"), c = (e, t) => e == null ? "" : (typeof e == "string" && (e = new Date(e)), e.toLocaleDateString(t)), l = (e, n) => e == null ? "" : (typeof e == "string" && (e = new Date(e)), n?.includes("US") ? t(e, "MM/dd") : t(e, "dd/MM"));
function u(e, t, n = 2, r = n) {
	return e == null ? "" : e?.toLocaleString(t, {
		minimumFractionDigits: n,
		maximumFractionDigits: r
	});
}
function d(e, t) {
	return e == null ? "" : e.toLocaleString(t, { notation: "compact" });
}
function f(e, t, n = "EUR") {
	return e == null ? "" : e.toLocaleString(t, {
		style: "currency",
		currency: n
	});
}
function p(e, t, n = "EUR") {
	return e == null ? "" : e.toLocaleString(t, {
		style: "currency",
		currency: n,
		notation: "compact"
	});
}
function m(e, t) {
	return e == null ? "" : (e > 1 ? e / 100 : e).toLocaleString(t, { style: "percent" });
}
var h = (t) => t == null || !(t.length === 16 && e(t, "BE", !0)) ? "" : `${t.slice(0, 4)} ${t.slice(4, 8)} ${t.slice(8, 12)} ${t.slice(12, 16)}`, g = (e) => e.replace(/\s+/gi, " ").replace(/[^a-z 0-9]+/gi, "").trim().split(" ").map((e) => e[0]).join("").toUpperCase(), _ = (e) => (e || "").replace(/\n/g, "<br/>"), v = (e) => {
	if (!e) return e;
	let t = e.match(/\d/g);
	return t == null ? e : [
		t.slice(0, 3),
		t.slice(3, 7),
		t.slice(7, 12)
	].filter((e) => e.length > 0).map((e) => e.join("")).join("/");
};
function y(e, t) {
	if (!e || (e?.length ?? 0) <= t) return e;
	let n = e.lastIndexOf(" ", t) || e.lastIndexOf(",", t) || e.lastIndexOf(".", t);
	return n > -1 && (e = e.substring(0, n)), e + "...";
}
//#endregion
export { o as dateInputString, h as formatBankaccount, f as formatCurrency, p as formatCurrencyCompact, c as formatDate, a as formatDateTime, u as formatNumber, d as formatNumberCompact, m as formatPercentage, l as formatShortDate, v as formatStructuredReference, _ as formatTextPreserveNewLines, s as formatTime, g as getInitials, y as shortenString };
