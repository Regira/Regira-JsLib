import { Fragment as e, createElementBlock as t, defineComponent as n, normalizeClass as r, openBlock as i, ref as a, renderList as o, toDisplayString as s, unref as c, watchEffect as l } from "vue";
//#region src/vue/lang/formatText.ts
function u(e, t) {
	if (typeof t == "function") return t(e);
	let n = e;
	return d(e)?.forEach((e) => {
		if (e in t) {
			let r = f(t[e]), i = RegExp(`{${e}}`, "g");
			n = n.replace(i, r);
		}
	}), n;
}
function d(e) {
	let t = /\{([^{}]+)\}/g, n = [], r;
	for (; (r = t.exec(e)) !== null;) n.push(r[1]);
	return n;
}
function f(e) {
	return e?.toString() ?? "";
}
//#endregion
//#region src/vue/lang/translate.ts
function p(e, t, n, r) {
	if (t == null) return e;
	let i = t[e];
	return i == null ? (console.warn(`translate: ${e} not found`, {
		values: t,
		langCode: n
	}), e) : m(i, n, r);
}
function m(e, t, n) {
	let r = typeof e == "string" ? e : e[t] ?? e[t.substring(0, 2)];
	return n != null && (r = u(r, n)), r;
}
//#endregion
//#region src/vue/lang/useLang.ts
var h = a(""), g = a(""), _ = a({});
function v() {
	return {
		langCode: h,
		fallbackLangCode: g,
		messages: _,
		translate: (e, t) => p(e, _.value, h.value, t) || p(e, _.value, g.value, t),
		translateMessage: (e, t) => m(e, h.value, t) || m(e, g.value, t),
		setLangCode(e) {
			e && (h.value = e);
		},
		replaceMessages: (e) => _.value = e,
		loadMessages: (e) => _.value = {
			..._.value,
			...e
		}
	};
}
//#endregion
//#region src/vue/lang/plugin.ts
var y = { install(e, t) {
	let n = a(!1), { fallbackLangCode: r, translate: i, translateMessage: o, setLangCode: s, replaceMessages: c } = v();
	s(t.defaultLang ?? "en"), r.value = t.defaultLang ?? "en", typeof t.messages == "function" ? l(async () => {
		c(await t.messages()), n.value = !0;
	}) : (c(t.messages), n.value = !0), e.config.globalProperties.$t = (e, t) => n.value ? i(e, t) : "", e.config.globalProperties.$tm = (e, t) => o(e, t);
} }, b = { class: "rg-lang-selector list-inline d-inline mb-0" }, x = ["onClick"], S = /* @__PURE__ */ n({
	__name: "LangSelector",
	props: { langs: {} },
	emits: ["select"],
	setup(n, { emit: a }) {
		let l = a, { langCode: u, setLangCode: d } = v();
		function f(e) {
			d(e), l("select", e);
		}
		return (a, l) => (i(), t("ul", b, [(i(!0), t(e, null, o(n.langs, (e) => (i(), t("li", {
			key: e,
			class: r(["list-inline-item", { "fw-bold": c(u) == e }]),
			role: "button",
			onClick: (t) => f(e)
		}, s(e.toUpperCase()), 11, x))), 128))]));
	}
});
//#endregion
export { S as LangSelector, u as formatText, y as plugin, p as translate, m as translateMessage, v as useLang };
