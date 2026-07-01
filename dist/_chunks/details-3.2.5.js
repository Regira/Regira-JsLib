import { i as e } from "./feedback-3.2.5.js";
import { Fragment as t, computed as n, createElementBlock as r, createElementVNode as i, createVNode as a, normalizeClass as o, onMounted as s, openBlock as c, ref as l, renderList as u, resolveComponent as d, toDisplayString as f, watch as p } from "vue";
import { useRouter as m } from "vue-router";
//#region src/vue/entities/details/details.ts
function h(t, r = e()) {
	let i = m(), a = n(() => i.currentRoute.value.params.id), o = n(() => a.value === "new"), c = l(null), u = l(!1);
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
	let f = d(), h = n(() => !!i.currentRoute.value.name?.toString().includes("Form")), g = n(() => !!i.currentRoute.value.name?.toString().includes("Fiche")), _ = n(() => i.options.routes.flatMap((e) => [e, ...e.children || []]).some((e) => e.name == i.currentRoute.value.name?.toString().replace("Form", "Fiche")));
	async function v() {
		if (o.value) {
			c.value = await t.newEntity({});
			return;
		}
		u.value = !0;
		try {
			c.value = await t.details(a.value);
		} catch (e) {
			console.error(`Fetching details failed for #${a.value}`, {
				id: a.value,
				ex: e
			}), r.fail(`Fetching item #${a.value} failed`, e.response.status == 403 ? "Not allowed" : e.response.status == 404 ? "Not found" : e.response.data);
		} finally {
			u.value = !1;
		}
	}
	return p(i.currentRoute, async (e, t) => {
		e.name === t.name && t.params.id != "new" && e.params.id !== t.params.id && await v();
	}), s(v), {
		item: c,
		routeId: a,
		isNew: o,
		overviewUrl: f,
		isForm: h,
		isFiche: g,
		hasFiche: _,
		isLoading: u,
		feedback: r,
		load: v
	};
}
//#endregion
//#region src/vue/entities/details/DetailsSummary.vue
var g = { class: "details-summary" }, _ = {
	key: 0,
	class: "col"
}, v = { class: "fw-bold" }, y = { class: "col fw-bold" }, b = { class: "col-12" }, x = { class: "col fw-bold" }, S = { class: "col" }, C = {
	__name: "DetailsSummary",
	props: { modelValue: {
		type: Object,
		default: () => ({})
	} },
	setup(e) {
		let s = e, l = n({ get() {
			return s.modelValue;
		} });
		return (e, n) => {
			let s = d("DetailsSummary", !0);
			return c(), r("div", g, [(c(!0), r(t, null, u(l.value, (e, n, d) => (c(), r("div", { class: o(["row", { "bg-light": d % 2 == 0 }]) }, [Array.isArray(e) ? (c(), r("div", _, [i("span", v, f(n), 1), (c(!0), r(t, null, u(l.value[n], (e, n) => (c(), r(t, null, [i("div", null, "(" + f(n + 1) + ".)", 1), a(s, {
				modelValue: e,
				class: "ms-5"
			}, null, 8, ["modelValue"])], 64))), 256))])) : typeof e == "object" ? (c(), r(t, { key: 1 }, [i("div", y, f(n), 1), i("div", b, [a(s, {
				modelValue: e,
				class: "ms-5"
			}, null, 8, ["modelValue"])])], 64)) : (c(), r(t, { key: 2 }, [i("div", x, f(n), 1), i("div", S, f(e), 1)], 64))], 2))), 256))]);
		};
	}
};
//#endregion
export { h as n, C as t };
