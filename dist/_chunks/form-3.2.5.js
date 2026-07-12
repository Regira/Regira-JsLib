import { F as e, _ as t } from "./array-utility-3.2.5.js";
import { useVModelField as n } from "../vue/vue-helper.js";
import { t as r } from "./IconButton-3.2.5.js";
import { t as i } from "./_plugin-vue_export-helper-3.2.5.js";
import { isNewEntity as a } from "../vue/entities/abstractions/IEntity.js";
import "./abstractions-3.2.5.js";
import { i as o } from "./feedback-3.2.5.js";
import { Fragment as s, computed as c, createElementBlock as l, createElementVNode as u, createVNode as d, defineComponent as f, getCurrentInstance as p, guardReactiveProps as m, mergeModels as h, mergeProps as g, normalizeClass as _, normalizeProps as v, onMounted as y, openBlock as b, ref as x, renderList as S, renderSlot as C, unref as w, useModel as T, watch as E } from "vue";
import { useRouter as D } from "vue-router";
//#region src/vue/entities/form/form.ts
var O = /* @__PURE__ */ function(e) {
	return e.pending = "Pending", e.saved = "Saved", e.removed = "Removed", e.error = "Error", e;
}({}), k = {
	readonly: !1,
	isPopup: !1
};
function A({ entityService: t, props: n, emit: r, feedback: i = o() }) {
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
var j = {
	closeOnSave: !1,
	closeOnDelete: !0
};
function M({ entityService: t, model: n, itemDefaults: r, closeOnSave: i, closeOnCancel: o, closeOnDelete: s, emit: c, feedback: l }) {
	let u = x(!1), d = x(), f = p();
	function m(e) {
		d.value = e;
	}
	function h() {
		c("close", d.value), u.value = !1;
	}
	async function g() {
		let i = n.value;
		try {
			let n = typeof r == "function" ? {} : e(w(r) || {});
			i ??= await t.newEntity(n), i?.$id || (i = t.toEntity(i || n)), t != null && !a(i.$id) && (i = await t.details(i.$id) || i), typeof r == "function" && (i = await r(i)), d.value = i, u.value = !0, c("open", d.value, m);
		} catch (e) {
			console.error("Fetching details failed", {
				id: i?.$id,
				ex: e,
				app: f
			}), l ||= f?.appContext.config.globalProperties.$feedback, l.fail(`Fetching ${i?.$title || "item #" + i?.$id} failed`, e.response.status == 403 ? "Not allowed" : e.response?.data);
		}
	}
	function _(e) {
		o && (c("cancel", e), h());
	}
	function v({ saved: e, isNew: t }) {
		c("save", {
			saved: e,
			isNew: t
		}), c("update:modelValue", e), i && h();
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
	let i = n(e, r), a = () => ({ id: 0 }), o = x();
	async function s() {
		o.value = a();
	}
	let c = (e) => {
		r("sort", e);
	};
	function l({ saved: e, isNew: n }) {
		n && (e.id = Math.min(t(i.value, (e) => e.id) ?? 0, 0) - 1, i.value = i.value.concat([e]), s());
	}
	return E(() => e.modelValue, () => i.value = e.modelValue || []), y(async () => {
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
	let i = x(n.modelValue || { id: 0 }), a = x(!1);
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
var R = { class: "input-selector-inline row align-items-center" }, z = { class: "col-auto mb-2" }, B = /*#__PURE__*/ i(/* @__PURE__ */ f({
	__name: "InputSelectorInline",
	props: /*@__PURE__*/ h({
		rowKey: { type: Function },
		excludeKey: { type: Function }
	}, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: /*@__PURE__*/ h(["remove", "add"], ["update:modelValue"]),
	setup(e, { emit: t }) {
		let n = T(e, "modelValue"), i = e, a = t, o = c(() => (n.value ?? []).map((e) => i.excludeKey?.(e)).filter((e) => e != null));
		function f(e) {
			e._deleted = !e._deleted, a("remove", e);
		}
		function p(e) {
			n.value = [...n.value ?? [], e], a("add", e);
		}
		return (t, i) => (b(), l("div", R, [(b(!0), l(s, null, S(n.value ?? [], (n, i) => (b(), l("div", {
			key: e.rowKey?.(n) ?? i,
			class: "col-auto mb-2 pe-0"
		}, [u("div", { class: _(["form-control p-0 d-inline-flex align-items-center", { "is-deleted": n._deleted }]) }, [C(t.$slots, "chip", g({ ref_for: !0 }, { row: n }), void 0, !0), d(r, {
			icon: "delete",
			class: "btn-outline-danger border-0",
			title: n._deleted ? "restore" : "remove",
			onClick: (e) => f(n)
		}, null, 8, ["title", "onClick"])], 2)]))), 128)), u("div", z, [C(t.$slots, "selector", v(m({
			add: p,
			exclude: o.value
		})), void 0, !0)])]));
	}
}), [["__scopeId", "data-v-b3fe2e67"]]);
//#endregion
export { F as a, O as c, P as i, k as l, L as n, j as o, I as r, N as s, B as t, A as u };
