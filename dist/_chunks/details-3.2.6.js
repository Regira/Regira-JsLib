import { a as e } from "./feedback-3.2.6.js";
import { Fragment as t, computed as n, createElementBlock as r, createElementVNode as i, createVNode as a, defineComponent as o, normalizeClass as s, onMounted as c, openBlock as l, ref as u, renderList as d, resolveComponent as f, toDisplayString as p, watch as m } from "vue";
import { useRouter as h } from "vue-router";
//#region src/vue/entities/details/details.ts
function g(t, r = e()) {
	let i = h(), a = n(() => i.currentRoute.value.params.id), o = n(() => a.value === "new"), s = u(void 0), l = u(!1);
	function d() {
		function e(e) {
			if (!e) return !1;
			let t = e.indexOf("?");
			return t > -1 && (e = e.substring(0, t)), i.options.routes.some((t) => t.path == e && t.name?.toString().includes("Overview"));
		}
		function t() {
			let e = i.currentRoute.value;
			return i.options.routes.find((t) => t.name == e.name?.toString().replace(/Form|Fiche/, "Overview"));
		}
		let n = i.options.history.state.back?.toString();
		return e(n) ? n : t();
	}
	let f = d(), p = n(() => !!i.currentRoute.value.name?.toString().includes("Form")), g = n(() => !!i.currentRoute.value.name?.toString().includes("Fiche")), _ = n(() => i.options.routes.flatMap((e) => [e, ...e.children || []]).some((e) => e.name == i.currentRoute.value.name?.toString().replace("Form", "Fiche")));
	async function v() {
		if (o.value) {
			s.value = await t.newEntity({});
			return;
		}
		l.value = !0;
		try {
			s.value = await t.details(a.value);
		} catch (e) {
			console.error(`Fetching details failed for #${a.value}`, {
				id: a.value,
				ex: e
			}), r.fail(`Fetching item #${a.value} failed`, e.response.status == 403 ? "Not allowed" : e.response.status == 404 ? "Not found" : e.response.data);
		} finally {
			l.value = !1;
		}
	}
	return m(i.currentRoute, async (e, t) => {
		e.name === t.name && t.params.id != "new" && e.params.id !== t.params.id && await v();
	}), c(v), {
		item: s,
		routeId: a,
		isNew: o,
		overviewUrl: f,
		isForm: p,
		isFiche: g,
		hasFiche: _,
		isLoading: l,
		feedback: r,
		load: v
	};
}
//#endregion
//#region src/vue/entities/details/DetailsSummary.vue?vue&type=script&setup=true&lang.ts
var _ = { class: "details-summary" }, v = {
	key: 0,
	class: "col"
}, y = { class: "fw-bold" }, b = { class: "col fw-bold" }, x = { class: "col-12" }, S = { class: "col fw-bold" }, C = { class: "col" }, w = /* @__PURE__ */ o({
	__name: "DetailsSummary",
	props: { modelValue: {} },
	setup(e) {
		let o = e, c = n(() => o.modelValue ?? {});
		return (e, n) => {
			let o = f("DetailsSummary", !0);
			return l(), r("div", _, [(l(!0), r(t, null, d(c.value, (e, n, c) => (l(), r("div", {
				class: s(["row", { "bg-light": c % 2 == 0 }]),
				key: n
			}, [Array.isArray(e) ? (l(), r("div", v, [i("span", y, p(n), 1), (l(!0), r(t, null, d(e, (e, n) => (l(), r(t, { key: n }, [i("div", null, "(" + p(n + 1) + ".)", 1), a(o, {
				modelValue: e,
				class: "ms-5"
			}, null, 8, ["modelValue"])], 64))), 128))])) : typeof e == "object" ? (l(), r(t, { key: 1 }, [i("div", b, p(n), 1), i("div", x, [a(o, {
				modelValue: e,
				class: "ms-5"
			}, null, 8, ["modelValue"])])], 64)) : (l(), r(t, { key: 2 }, [i("div", S, p(n), 1), i("div", C, p(e), 1)], 64))], 2))), 128))]);
		};
	}
});
//#endregion
export { g as n, w as t };
