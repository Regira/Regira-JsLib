import { trim as e } from "../utilities/string-utility.js";
//#region src/utilities/object-utility.ts
var t = (e) => typeof e == "object" && !!e && Object.prototype.toString.call(e) === "[object Object]", n = (e) => {
	let t = (e, t) => t === "" ? e : `${t}.${e}`, n = (e, r = "", i = {}) => {
		if (Array.isArray(e)) for (let t = 0; t < e.length; t++) n(e, `${r}[${t}]`, i);
		else if (typeof e != "object") i[r] = e;
		else for (let a of Object.entries(e)) {
			let e = a[0], o = a[1];
			if (Array.isArray(o)) for (let a in o) {
				let s = t(`${e}[${a}]`, r);
				n(o[a], s, i);
			}
			else {
				let a = t(e, r);
				typeof o == "object" && o && Object.keys(o).length > 0 ? n(o, a, i) : i[a] = o;
			}
		}
		return i;
	};
	return n(e);
}, r = (e, t) => t.split(".").reduce((e, t) => e == null ? null : e[t], e), i = (e) => {
	let t = (e, t) => e.filter(t)[0], n = (e, r = []) => {
		if (typeof e != "object" || !e) return e;
		let i = t(r, (t) => t.original === e);
		if (i) return i.copy;
		if (e instanceof Date) return new Date(e);
		let a = Array.isArray(e) ? [] : {};
		return r.push({
			original: e,
			copy: a
		}), Object.keys(e).forEach((t) => {
			a[t] = n(e[t], r);
		}), a;
	};
	return n(e);
}, a = (e, ...n) => {
	function r(e, n, r) {
		let a = e[r];
		return t(n) && t(a) ? e[r] = i(a, n) : e[r] = n, e;
	}
	function i(e, t) {
		return Object.keys(t).reduce((e, n) => r(e, t[n], n), e);
	}
	return n.reduce((e, t) => i(e, t), e);
}, o = (e) => e ? Object.keys(e).filter((t) => e[t] !== void 0) : [], s = (t, n) => {
	let r = o(n);
	return !r.length || r.every((r) => {
		let i = n[r];
		if (typeof i == "function") return i.apply(t, [r]);
		if ((i instanceof Date || typeof i == "number") && !(r in t)) {
			let e = t[r[3].toLowerCase() + (r.length > 4 ? r.substring(4) : "")];
			if (r.startsWith("min")) return e >= i;
			if (r.startsWith("max")) return e <= i;
		}
		let a = e(r, "*");
		if (typeof i == "string" && (typeof t[a] == "string" || t[a] === void 0)) {
			let e = i?.toUpperCase(), n = t[a]?.toUpperCase();
			if (n == null && e != null) return !1;
			if (r.startsWith("*") && r.endsWith("*")) return n?.includes(e) ?? !1;
			if (r.startsWith("*")) return n?.endsWith(e) ?? !1;
			if (r.endsWith("*")) return n?.startsWith(e) ?? !1;
		}
		if (r in t) {
			let e = t[r];
			return Array.isArray(i) && !Array.isArray(e) ? i.some((t) => t == e) : Array.isArray(e) && !Array.isArray(i) ? e.some((e) => e == i) : Array.isArray(e) && Array.isArray(i) ? i.every((t) => e.some((e) => e == t)) : i instanceof Object ? s(e, i) : e == i;
		}
		return !0;
	});
}, c = {
	isPlainObject: t,
	flattenObject: n,
	crawlObject: r,
	mixin: a,
	filterObject: s
}, l = (e, t, n) => {
	let r, i, a = 0, o = /(\d+)|(\D+)/g, s = /\d/;
	if (isFinite(Number(n(e))) && isFinite(Number(n(t)))) return Number(n(e)) - Number(n(t));
	let c = String(n(e)).toLowerCase(), l = String(n(t)).toLowerCase();
	if (c === l) return 0;
	if (!(s.test(c) && s.test(l))) return c > l ? 1 : -1;
	let u = c.match(o) ?? [], d = l.match(o) ?? [], f = u.length > d.length ? d.length : u.length;
	for (; a < f;) if (r = u[a], i = d[a++], r !== i) return isFinite(Number(r)) && isFinite(Number(i)) ? (r.charAt(0) === "0" ? Number("." + r) : Number(r)) - (i.charAt(0) === "0" ? Number("." + i) : Number(i)) : r > i ? 1 : -1;
	return u.length - d.length;
}, u = (e = 0, t = e) => {
	if (t === e && (e = 0), t <= e) {
		if (e === 0) return 0;
		let n = "Invalid input (max should be greater than min)";
		throw console.error(n, {
			min: e,
			max: t
		}), Error(n);
	}
	return Math.floor(Math.random() * (t - e + 1)) + e;
}, d = {
	naturalCompare: l,
	getRandom: u
}, f = (e) => e, p = (e, t, n) => {
	let r = n(e), i = n(t);
	return r < i ? -1 : +(r > i);
}, m = (e, t, n) => {
	let r = n(e), i = n(t);
	return r > i ? -1 : +(r < i);
}, h = (e) => Array.isArray(e), g = (e) => e != null && typeof e[Symbol.iterator] == "function", _ = (e) => e ? h(e) ? e : g(e) ? [...e] : Object.values(e) : [], v = (e) => [...Array(e)], y = (e, t = f) => {
	let n = [...e];
	return n.sort((e, n) => p(e, n, t)), n;
}, b = (e, t = f) => {
	let n = [...e];
	return n.sort((e, n) => m(e, n, t)), n;
}, x = (e, t = f) => {
	let n = [...e];
	return n.sort((e, n) => l(e, n, t)), n;
}, S = (e) => {
	let t = [...e];
	return [...Array(t.length)].map(() => {
		let e = u(t.length - 1);
		return t.splice(e, 1)[0];
	});
}, C = (e, t, n = f, r = f, i = (e) => e) => {
	let a = [], o = _(e), s = _(t);
	return o.forEach((e) => {
		s.filter((t) => n(e) === r(t)).forEach((t) => {
			a.push(i(e, t));
		});
	}), a;
}, w = (e, t) => {
	let n = _(e);
	return j(n.map(t)).map((e) => [e, n.filter((n, r, i) => e === t(n, r, i))]);
}, T = (e, t, n = f, r = f, i = (e, t) => [e, t]) => {
	let a = _(t);
	return _(e).map((e, t, i) => [e, a.filter((a, o, s) => n(e, t, i) === r(a, o, s))]).map(([e, t]) => i(e, t));
}, E = (e, t, n = f, r = f) => {
	let i = _(t);
	return _(e).filter((e) => !i.some((t) => n(e) === r(t)));
}, D = (e, t) => {
	let n = _(e);
	return t ? n.filter(t).length : n.length;
}, O = (e, t) => {
	let n = _(e);
	return t ? n.find(t) : n[0];
}, k = (e, t) => {
	let n = _(e);
	if (!t) return n.length ? n[n.length - 1] : void 0;
	for (let e = n.length - 1; e >= 0; e--) if (t(n[e])) return n[e];
}, A = (e, t) => _(e).reduce((e, n) => e.some((e) => t(e) === t(n)) ? e : e.concat([n]), []), j = (e) => [...new Set(_(e))], M = (e, t) => j(_(e).concat(_(t))), N = (e, t) => _(e).slice(0, t), P = (e, t) => _(e).slice(t), F = (e, t, n = 0) => {
	let r = t * n;
	return _(e).slice(r, r + t);
}, I = (e, t) => {
	let n = _(e).length;
	return Math.ceil(n / t);
}, L = (e, t = f) => {
	let n = _(e);
	if (n.length) return n.reduce((e, n) => {
		let r = t(n);
		return e == null || r < e ? r : e;
	}, null);
}, R = (e, t = f) => {
	let n = _(e);
	if (n.length) return n.reduce((e, n) => {
		let r = t(n);
		return e == null || r > e ? r : e;
	}, null);
}, z = (e, t) => {
	let n = t ?? f;
	return _(e).reduce((e, t) => e + n(t), 0);
}, B = (e, t) => {
	let n = _(e);
	return z(n, t) / n.length;
}, V = (e, t, n) => {
	let r = n ?? f;
	return _(e).reduce((e, n, i) => {
		let a = t(n), o = r(n, i, e);
		return e.set(a, o);
	}, /* @__PURE__ */ new Map());
}, H = (e, t, n = !0) => {
	if (e === t) return !0;
	if (e == null || t == null) return !1;
	let r = _(e), i = _(t);
	if (r.length !== i.length) return !1;
	if (n) {
		for (let e = 0; e < r.length; e++) if (r[e] !== i[e]) return !1;
		return !0;
	}
	return C(r, i).length === r.length;
}, U = (e, t) => _(e).filter((e) => s(e, t)), W = (e) => {
	let t = 0;
	return {
		get selectedIndex() {
			return t;
		},
		set selectedIndex(n) {
			n >= 0 && n < e.length && (t = n);
		},
		get length() {
			return e.length;
		},
		get current() {
			return t >= 0 && t < e.length ? e[t] ?? null : null;
		},
		first() {
			t = 0;
		},
		previous() {
			return t > 0 && t--, t > 0;
		},
		next() {
			return t < e.length - 1 && t++, t < e.length;
		},
		last() {
			t = e.length - 1;
		}
	};
}, G = (e, t, n) => {
	let r = e.indexOf(t);
	r !== -1 && (e.splice(r, 1), e.splice(n, 0, t));
}, K = (e, t) => {
	e.splice(0, e.length, ...t);
}, q = {
	isArray: h,
	isIterable: g,
	toArray: _,
	newArray: v,
	orderBy: y,
	orderByDesc: b,
	naturalSort: x,
	shuffle: S,
	innerJoin: C,
	groupBy: w,
	groupJoin: T,
	count: D,
	first: O,
	last: k,
	distinctBy: A,
	distinct: j,
	union: M,
	take: N,
	skip: P,
	page: F,
	countPages: I,
	min: L,
	max: R,
	sum: z,
	average: B,
	toMap: V,
	sameContent: H,
	query: U,
	getEnumerator: W,
	move: G,
	reFill: K
};
//#endregion
export { N as A, F as C, S as D, H as E, i as F, n as I, c as L, V as M, M as N, P as O, d as P, b as S, K as T, L as _, j as a, v as b, O as c, T as d, C as f, R as g, k as h, I as i, _ as j, z as k, W as l, g as m, B as n, A as o, h as p, D as r, E as s, q as t, w as u, G as v, U as w, y as x, x as y };
