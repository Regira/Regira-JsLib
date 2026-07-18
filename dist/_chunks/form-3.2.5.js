import { F as e, _ as t } from "./array-utility-3.2.5.js";
import { useVModelField as n } from "../vue/vue-helper.js";
import { t as r } from "./IconButton-3.2.5.js";
import { isNewEntity as i } from "../vue/entities/abstractions/IEntity.js";
import "./abstractions-3.2.5.js";
import { a } from "./feedback-3.2.5.js";
import { Fragment as o, computed as s, createElementBlock as c, createElementVNode as l, createVNode as u, defineComponent as d, getCurrentInstance as f, guardReactiveProps as p, mergeModels as m, mergeProps as h, normalizeClass as g, normalizeProps as _, onMounted as v, openBlock as y, ref as b, renderList as x, renderSlot as S, toRaw as C, unref as w, useModel as T, watch as E } from "vue";
import { useRouter as D } from "vue-router";
//#region src/vue/entities/form/form.ts
var O = /* @__PURE__ */ function(e) {
	return e.pending = "Pending", e.saved = "Saved", e.removed = "Removed", e.error = "Error", e;
}({}), k = {
	readonly: !1,
	isPopup: !1
};
function A({ entityService: t, props: n, emit: r, feedback: i = a() }) {
	let { readonly: o, isPopup: s } = n, c = b(n.modelValue), l = b();
	function u() {
		r("cancel", {
			canceled: c.value,
			original: l.value
		}), c.value = t.toEntity(e(l.value));
	}
	function d() {
		if (o) throw i.fail("Readonly"), Error("Readonly");
	}
	let f = D();
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
	return E(() => n.modelValue, () => {
		c.value = n.modelValue, l.value = t.toEntity(e(c.value));
	}), v(() => {
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
var j = {
	closeOnSave: !1,
	closeOnDelete: !0
};
function M({ entityService: t, model: n, itemDefaults: r, closeOnSave: a, closeOnCancel: o, closeOnDelete: s, emit: c, feedback: l }) {
	let u = b(!1), d = b(), p = f();
	function m(e) {
		d.value = e;
	}
	function h() {
		c("close", d.value), u.value = !1;
	}
	async function g() {
		let a = n.value;
		try {
			let n = typeof r == "function" ? {} : e(w(r) || {});
			a ??= await t.newEntity(n), a?.$id || (a = t.toEntity(a || n)), t != null && !i(a.$id) && (a = await t.details(a.$id) || a), typeof r == "function" && (a = await r(a)), d.value = a, u.value = !0, c("open", d.value, m);
		} catch (e) {
			console.error("Fetching details failed", {
				id: a?.$id,
				ex: e,
				app: p
			}), l ||= p?.appContext.config.globalProperties.$feedback, l.fail(`Fetching ${a?.$title || "item #" + a?.$id} failed`, e.response.status == 403 ? "Not allowed" : e.response?.data);
		}
	}
	function _(e) {
		o && (c("cancel", e), h());
	}
	function v({ saved: e, isNew: t }) {
		c("save", {
			saved: e,
			isNew: t
		}), c("update:modelValue", e), a && h();
	}
	function y() {
		c("remove", d.value), s && h();
	}
	return {
		item: d,
		isOpen: u,
		feedback: l,
		close: h,
		open: g,
		handleSave: v,
		handleRemove: y,
		handleCancel: _
	};
}
var N = M;
//#endregion
//#region src/vue/entities/form/listInput.ts
function P({ props: e, emit: r }) {
	let i = n(e, r), a = b({ id: 0 }), o = (e) => {
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
function F({ props: e, emit: t }) {
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
function I({ props: e, emit: r }) {
	let i = n(e, r), a = () => ({ id: 0 }), o = b();
	async function s() {
		o.value = a();
	}
	let c = (e) => {
		r("sort", e);
	};
	function l({ saved: e, isNew: n }) {
		n && (e.id = Math.min(t(i.value, (e) => e.id) ?? 0, 0) - 1, i.value = i.value.concat([e]), s());
	}
	return E(() => e.modelValue, () => i.value = e.modelValue || []), v(async () => {
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
function L(t, { props: n, emit: r }) {
	let i = b(n.modelValue || { id: 0 }), a = b(!1);
	function o() {
		let r = n.modelValue || {}, o = e(w(n.itemDefaults || {}));
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
var R = { class: "input-selector-inline row align-items-center" }, z = { class: "col-auto mb-2" }, B = /* @__PURE__ */ d({
	__name: "InputSelectorInline",
	props: /*@__PURE__*/ m({
		rowKey: { type: Function },
		excludeKey: { type: Function },
		isNew: { type: Function }
	}, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ m(["remove", "add"], ["update:modelValue"]),
	setup(e, { emit: t }) {
		let n = T(e, "modelValue"), i = e, a = t, d = s(() => (n.value ?? []).map((e) => i.excludeKey?.(e)).filter((e) => e != null)), f = 0, m = /* @__PURE__ */ new WeakMap();
		function v(e) {
			let t = i.rowKey?.(e);
			if (t != null) return t;
			let n = C(e);
			return m.has(n) || m.set(n, `rg-isi-${++f}`), m.get(n);
		}
		let b = /* @__PURE__ */ new WeakSet();
		function w(e) {
			return typeof e.id == "number" && e.id > 0;
		}
		function E(e) {
			return i.isNew ? i.isNew(e) : b.has(C(e)) && !w(e);
		}
		function D(e) {
			E(e) ? n.value = (n.value ?? []).filter((t) => C(t) !== C(e)) : e._deleted = !e._deleted, a("remove", e);
		}
		function O(e) {
			b.add(C(e)), n.value = [...n.value ?? [], e], a("add", e);
		}
		return (e, t) => (y(), c("div", R, [(y(!0), c(o, null, x(n.value ?? [], (t) => (y(), c("div", {
			key: v(t),
			class: "col-auto mb-2 pe-0"
		}, [l("div", { class: g(["form-control p-0 d-inline-flex align-items-center", { "is-deleted": t._deleted }]) }, [S(e.$slots, "chip", h({ ref_for: !0 }, { row: t })), u(r, {
			icon: "delete",
			class: "btn-outline-danger border-0",
			title: t._deleted ? "restore" : "remove",
			onClick: (e) => D(t)
		}, null, 8, ["title", "onClick"])], 2)]))), 128)), l("div", z, [S(e.$slots, "selector", _(p({
			add: O,
			exclude: d.value
		})))])]));
	}
});
//#endregion
export { F as a, O as c, P as i, k as l, L as n, j as o, I as r, N as s, B as t, A as u };
