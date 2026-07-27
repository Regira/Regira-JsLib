import { F as e, _ as t } from "./array-utility-3.2.7.js";
import { useVModelField as n } from "../vue/vue-helper.js";
import { t as r } from "./IconButton-3.2.7.js";
import { isNewEntity as i } from "../vue/entities/abstractions/IEntity.js";
import "./abstractions-3.2.7.js";
import { t as a } from "./ISearchObject-3.2.7.js";
import { a as o } from "./feedback-3.2.7.js";
import { Fragment as s, computed as c, createElementBlock as l, createElementVNode as u, createVNode as d, defineComponent as f, getCurrentInstance as p, guardReactiveProps as m, mergeModels as h, mergeProps as g, normalizeClass as _, normalizeProps as v, onMounted as y, openBlock as b, ref as x, renderList as S, renderSlot as C, toRaw as w, unref as T, useModel as E, watch as D } from "vue";
import { useRouter as O } from "vue-router";
//#region src/vue/entities/form/form.ts
var k = /* @__PURE__ */ function(e) {
	return e.pending = "Pending", e.saved = "Saved", e.removed = "Removed", e.error = "Error", e;
}({}), A = {
	readonly: !1,
	isPopup: !1
};
function j({ entityService: t, props: n, emit: r, feedback: i = o() }) {
	let { readonly: a, isPopup: s } = n, c = x(n.modelValue), l = x();
	function u() {
		r("cancel", {
			canceled: c.value,
			original: l.value
		}), c.value = t.toEntity(e(l.value));
	}
	function d() {
		if (a) throw i.fail("Readonly"), Error("Readonly");
	}
	let f = O();
	async function p() {
		d(), r("changeState", "Pending");
		try {
			i.pending("Saving...");
			let { saved: n, isNew: a } = await t.save(c.value);
			if (r("save", {
				saved: n,
				isNew: a
			}), i.success("Saved"), c.value = t.toEntity(e(n)), l.value = t.toEntity(e(n)), r("update:modelValue", c.value), a && !s) {
				let e = f.currentRoute.value;
				delete e.query.src;
				let t = {
					name: e.name,
					params: {
						...e.params,
						id: n.$id
					},
					query: { ...e.query },
					hash: e.hash
				};
				f.replace(t);
			}
		} catch (e) {
			console.error("Saving failed", { ex: e });
			let t = e, n = t.response?.status;
			throw n == 400 ? i.fail("Saving failed", t.response?.data?.errors) : n == 404 ? i.fail("Item not found", t.response?.data?.message || t.message) : i.fail("Server error", t.response?.data?.message || t.message), r("changeState", "Error"), e;
		} finally {
			r("changeState", "Saved");
		}
	}
	async function m() {
		d(), r("changeState", "Pending");
		try {
			i.pending("Deleting..."), await t.remove(c.value), i.success("Deleted"), r("remove", c.value);
		} catch (e) {
			console.error("Deleting failed", {
				item: c,
				ex: e
			});
			let t = e, n = t.response?.status;
			n == 400 ? i.fail("Deleting failed", t.response?.data?.errors) : n == 404 ? i.fail("Item not found", t.response?.data?.message || t.message) : i.fail("Deleting failed", t.response?.data?.message || t.message), r("changeState", "Error");
		} finally {
			r("changeState", "Removed");
		}
	}
	async function h() {
		let n = t.toEntity(e(c.value));
		n.isArchived = !1, r("changeState", "Pending");
		try {
			i.pending("Restoring...");
			let { saved: a, isNew: o } = await t.save(n);
			r("restore", a), r("save", {
				saved: a,
				isNew: o
			}), i.success("Restored"), c.value = t.toEntity(e(a)), l.value = t.toEntity(e(a)), r("update:modelValue", c.value);
		} catch (e) {
			console.error("Restoring failed", {
				item: c,
				ex: e
			});
			let t = e;
			throw i.fail("Restoring failed", t.response?.data?.errors), r("changeState", "Error"), e;
		} finally {
			r("changeState", "Saved");
		}
	}
	return D(() => n.modelValue, () => {
		c.value = n.modelValue, l.value = t.toEntity(e(c.value));
	}), y(() => {
		l.value = t.toEntity(e(c.value));
	}), {
		item: c,
		original: l,
		feedback: i,
		handleCancel: u,
		handleSubmit: p,
		handleRemove: m,
		handleRestore: h
	};
}
//#endregion
//#region src/vue/entities/form/modal.ts
var M = {
	closeOnSave: !1,
	closeOnDelete: !0
};
function N({ entityService: t, model: n, itemDefaults: r, closeOnSave: o, closeOnCancel: s, closeOnDelete: c, emit: l, feedback: u }) {
	let d = x(!1), f = x(), m = p();
	function h(e) {
		f.value = e;
	}
	function g() {
		l("close", f.value), d.value = !1;
	}
	async function _() {
		let o = n.value;
		try {
			let n = typeof r == "function" ? {} : e(T(r) || {});
			o ??= await t.newEntity(n), o?.$id || (o = t.toEntity(o || n)), t != null && !i(o.$id) && (o = await t.details(o.$id, { archived: a.included }) || o), typeof r == "function" && (o = await r(o)), f.value = o, d.value = !0, l("open", f.value, h);
		} catch (e) {
			console.error("Fetching details failed", {
				id: o?.$id,
				ex: e,
				app: m
			}), u ||= m?.appContext.config.globalProperties.$feedback, u.fail(`Fetching ${o?.$title || "item #" + o?.$id} failed`, e.response.status == 403 ? "Not allowed" : e.response?.data);
		}
	}
	function v(e) {
		s && (l("cancel", e), g());
	}
	function y({ saved: e, isNew: t }) {
		l("save", {
			saved: e,
			isNew: t
		}), l("update:modelValue", e), o && g();
	}
	function b() {
		l("remove", f.value), c && g();
	}
	return {
		item: f,
		isOpen: d,
		feedback: u,
		close: g,
		open: _,
		handleSave: y,
		handleRemove: b,
		handleCancel: v
	};
}
var P = N;
//#endregion
//#region src/vue/entities/form/listInput.ts
function F({ props: e, emit: r }) {
	let i = n(e, r), a = x({ id: 0 }), o = (e) => {
		r("sort", e);
	};
	function s({ saved: e, isNew: n }) {
		n && (e.id = (t(i.value, (e) => e.id) ?? 0) - 1, r("update:modelValue", i.value.concat([e])), a.value = { id: 0 });
	}
	return {
		items: i,
		newItem: a,
		handleSort: o,
		handleSave: s
	};
}
function I({ props: e, emit: t }) {
	let r = n(e, t);
	function i() {
		t("save", {
			saved: r.value,
			isNew: !r.value.id
		});
	}
	function a(e) {
		e._deleted = !e._deleted, t("remove", e);
	}
	return {
		item: r,
		handleSave: i,
		handleRemove: a
	};
}
//#endregion
//#region src/vue/entities/form/ownedCollections.ts
function L({ props: e, emit: r }) {
	let i = n(e, r), a = () => ({ id: 0 }), o = x();
	async function s() {
		o.value = a();
	}
	let c = (e) => {
		r("sort", e);
	};
	function l({ saved: e, isNew: n }) {
		if (n) {
			e.id = Math.min(t(i.value, (e) => e.id) ?? 0, 0) - 1;
			let n = i.value.concat([e]);
			i.value = n, s();
		}
	}
	return D(() => e.modelValue, () => i.value = e.modelValue || []), y(async () => {
		i.value = e.modelValue || [], await s();
	}), {
		items: i,
		newItem: o,
		resetNewItem: s,
		handleSort: c,
		handleSave: l
	};
}
//#endregion
//#region src/vue/entities/form/ownedModal.ts
function R(t, { props: n, emit: r }) {
	let i = x(n.modelValue || { id: 0 }), a = x(!1);
	function o() {
		let r = n.modelValue || {}, o = e(T(n.itemDefaults || {}));
		i.value = Object.assign(new t(), {
			...r,
			...o
		}), a.value = !0;
	}
	function s() {
		r("cancel"), a.value = !1;
	}
	function c() {
		r("save", {
			saved: i.value,
			isNew: i.value.id == 0
		}), r("update:modelValue", i.value), a.value = !1;
	}
	return {
		item: i,
		isOpen: a,
		handleOpen: o,
		handleCancel: s,
		handleSubmit: c
	};
}
//#endregion
//#region src/vue/entities/form/InputSelectorInline.vue?vue&type=script&setup=true&lang.ts
var z = { class: "input-selector-inline row align-items-center" }, B = { class: "col-auto mb-2" }, V = /* @__PURE__ */ f({
	__name: "InputSelectorInline",
	props: /*@__PURE__*/ h({
		rowKey: { type: Function },
		excludeKey: { type: Function },
		isNew: { type: Function }
	}, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ h(["remove", "add"], ["update:modelValue"]),
	setup(e, { emit: t }) {
		let n = E(e, "modelValue"), i = e, a = t, o = c(() => (n.value ?? []).map((e) => i.excludeKey?.(e)).filter((e) => e != null)), f = 0, p = /* @__PURE__ */ new WeakMap();
		function h(e) {
			let t = i.rowKey?.(e);
			if (t != null) return t;
			let n = w(e);
			return p.has(n) || p.set(n, `rg-isi-${++f}`), p.get(n);
		}
		let y = /* @__PURE__ */ new WeakSet();
		function x(e) {
			return typeof e.id == "number" && e.id > 0;
		}
		function T(e) {
			return i.isNew ? i.isNew(e) : y.has(w(e)) && !x(e);
		}
		function D(e) {
			T(e) ? n.value = (n.value ?? []).filter((t) => w(t) !== w(e)) : e._deleted = !e._deleted, a("remove", e);
		}
		function O(e) {
			y.add(w(e)), n.value = [...n.value ?? [], e], a("add", e);
		}
		return (e, t) => (b(), l("div", z, [(b(!0), l(s, null, S(n.value ?? [], (t) => (b(), l("div", {
			key: h(t),
			class: "col-auto mb-2 pe-0"
		}, [u("div", { class: _(["form-control p-0 d-inline-flex align-items-center", { "is-deleted": t._deleted }]) }, [C(e.$slots, "chip", g({ ref_for: !0 }, { row: t })), d(r, {
			icon: "delete",
			class: "btn-outline-danger border-0",
			title: t._deleted ? "restore" : "remove",
			onClick: (e) => D(t)
		}, null, 8, ["title", "onClick"])], 2)]))), 128)), u("div", B, [C(e.$slots, "selector", v(m({
			add: O,
			exclude: o.value
		})))])]));
	}
});
//#endregion
export { I as a, k as c, F as i, A as l, R as n, M as o, L as r, P as s, V as t, j as u };
