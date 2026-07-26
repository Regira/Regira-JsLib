import { t as e } from "./ISearchObject-3.2.6.js";
import { a as t } from "./feedback-3.2.6.js";
import { Fragment as n, computed as r, createElementBlock as i, createElementVNode as a, createVNode as o, defineComponent as s, normalizeClass as c, onMounted as l, openBlock as u, ref as d, renderList as f, resolveComponent as p, toDisplayString as m, watch as h } from "vue";
import { useRouter as g } from "vue-router";
//#region src/vue/entities/details/details.ts
function _(n, i = t()) {
	let a = g(), o = r(() => a.currentRoute.value.params.id), s = r(() => o.value === "new"), c = d(void 0), u = d(!1);
	function f() {
		function e(e) {
			if (!e) return !1;
			let t = e.indexOf("?");
			return t > -1 && (e = e.substring(0, t)), a.options.routes.some((t) => t.path == e && t.name?.toString().includes("Overview"));
		}
		function t() {
			let e = a.currentRoute.value;
			return a.options.routes.find((t) => t.name == e.name?.toString().replace(/Form|Fiche/, "Overview"));
		}
		let n = a.options.history.state.back?.toString();
		return e(n) ? n : t();
	}
	let p = f(), m = r(() => !!a.currentRoute.value.name?.toString().includes("Form")), _ = r(() => !!a.currentRoute.value.name?.toString().includes("Fiche")), v = r(() => a.options.routes.flatMap((e) => [e, ...e.children || []]).some((e) => e.name == a.currentRoute.value.name?.toString().replace("Form", "Fiche")));
	async function y() {
		if (s.value) {
			c.value = await n.newEntity({});
			return;
		}
		u.value = !0;
		try {
			c.value = await n.details(o.value, { archived: e.included });
		} catch (e) {
			console.error(`Fetching details failed for #${o.value}`, {
				id: o.value,
				ex: e
			}), i.fail(`Fetching item #${o.value} failed`, e.response.status == 403 ? "Not allowed" : e.response.status == 404 ? "Not found" : e.response.data);
		} finally {
			u.value = !1;
		}
	}
	return h(a.currentRoute, async (e, t) => {
		e.name === t.name && t.params.id != "new" && e.params.id !== t.params.id && await y();
	}), l(y), {
		item: c,
		routeId: o,
		isNew: s,
		overviewUrl: p,
		isForm: m,
		isFiche: _,
		hasFiche: v,
		isLoading: u,
		feedback: i,
		load: y
	};
}
//#endregion
//#region src/vue/entities/details/DetailsSummary.vue?vue&type=script&setup=true&lang.ts
var v = { class: "details-summary" }, y = {
	key: 0,
	class: "col"
}, b = { class: "fw-bold" }, x = { class: "col fw-bold" }, S = { class: "col-12" }, C = { class: "col fw-bold" }, w = { class: "col" }, T = /* @__PURE__ */ s({
	__name: "DetailsSummary",
	props: { modelValue: {} },
	setup(e) {
		let t = e, s = r(() => t.modelValue ?? {});
		return (e, t) => {
			let r = p("DetailsSummary", !0);
			return u(), i("div", v, [(u(!0), i(n, null, f(s.value, (e, t, s) => (u(), i("div", {
				class: c(["row", { "bg-light": s % 2 == 0 }]),
				key: t
			}, [Array.isArray(e) ? (u(), i("div", y, [a("span", b, m(t), 1), (u(!0), i(n, null, f(e, (e, t) => (u(), i(n, { key: t }, [a("div", null, "(" + m(t + 1) + ".)", 1), o(r, {
				modelValue: e,
				class: "ms-5"
			}, null, 8, ["modelValue"])], 64))), 128))])) : typeof e == "object" ? (u(), i(n, { key: 1 }, [a("div", x, m(t), 1), a("div", S, [o(r, {
				modelValue: e,
				class: "ms-5"
			}, null, 8, ["modelValue"])])], 64)) : (u(), i(n, { key: 2 }, [a("div", C, m(t), 1), a("div", w, m(e), 1)], 64))], 2))), 128))]);
		};
	}
});
//#endregion
export { _ as n, T as t };
