import { F as e, _ as t } from "./array-utility-3.2.5.js";
import { useVModelField as n } from "../vue/vue-helper.js";
import { isNewEntity as r } from "../vue/entities/abstractions/IEntity.js";
import "./abstractions-3.2.5.js";
import { i } from "./feedback-3.2.5.js";
import { getCurrentInstance as a, onMounted as o, ref as s, unref as c, watch as l } from "vue";
import { useRouter as u } from "vue-router";
//#region src/vue/entities/form/form.ts
var d = /* @__PURE__ */ function(e) {
	return e.pending = "Pending", e.saved = "Saved", e.removed = "Removed", e.error = "Error", e;
}({}), f = {
	readonly: !1,
	isPopup: !1
};
function p({ entityService: t, props: n, emit: r, feedback: a = i() }) {
	let { readonly: c, isPopup: f } = n, p = s(n.modelValue), m = s();
	function h() {
		r("cancel", {
			canceled: p.value,
			original: m.value
		}), p.value = m.value;
	}
	function g() {
		if (c) throw a.fail("Readonly"), Error("Readonly");
	}
	let _ = u();
	async function v() {
		g(), r("changeState", d.pending);
		try {
			a.pending("Saving...");
			let { saved: n, isNew: i } = await t.save(p.value);
			if (r("save", {
				saved: n,
				isNew: i
			}), a.success("Saved"), p.value = t.toEntity(e(n)), m.value = t.toEntity(e(n)), r("update:modelValue", p.value), i && !f) {
				let e = _.currentRoute.value;
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
				_.replace(t);
			}
		} catch (e) {
			console.error("Saving failed", { ex: e });
			let t = e, n = t.response?.status;
			throw n == 400 ? a.fail("Saving failed", t.response?.data?.errors) : n == 404 ? a.fail("Item not found", t.response?.data?.message || t.message) : a.fail("Server error", t.response?.data?.message || t.message), r("changeState", d.error), e;
		} finally {
			r("changeState", d.saved);
		}
	}
	async function y() {
		g(), r("changeState", d.pending);
		try {
			a.pending("Deleting..."), await t.remove(p.value), a.success("Deleted"), r("remove", p.value);
		} catch (e) {
			console.error("Deleting failed", {
				item: p,
				ex: e
			});
			let t = e;
			throw a.fail("Deleting failed", t.response?.data?.errors), r("changeState", d.error), e;
		} finally {
			r("changeState", d.removed);
		}
	}
	async function b() {
		let n = t.toEntity(e(p.value));
		n.isArchived = !1, r("changeState", d.pending);
		try {
			a.pending("Restoring...");
			let { saved: i, isNew: o } = await t.save(n);
			r("restore", i), r("save", {
				saved: i,
				isNew: o
			}), a.success("Restored"), p.value = t.toEntity(e(i)), m.value = t.toEntity(e(i)), r("update:modelValue", p.value);
		} catch (e) {
			console.error("Restoring failed", {
				item: p,
				ex: e
			});
			let t = e;
			throw a.fail("Restoring failed", t.response?.data?.errors), r("changeState", d.error), e;
		} finally {
			r("changeState", d.saved);
		}
	}
	return l(() => n.modelValue, () => {
		p.value = n.modelValue, m.value = t.toEntity(e(p.value));
	}), o(() => {
		m.value = t.toEntity(e(p.value));
	}), {
		item: p,
		original: m,
		feedback: a,
		handleCancel: h,
		handleSubmit: v,
		handleRemove: y,
		handleRestore: b
	};
}
//#endregion
//#region src/vue/entities/form/modal.ts
var m = {
	closeOnSave: !1,
	closeOnDelete: !0
};
function h({ entityService: t, model: n, itemDefaults: i, closeOnSave: o, closeOnCancel: l, closeOnDelete: u, emit: d, feedback: f }) {
	let p = s(!1), m = s(), h = a();
	function g(e) {
		m.value = e;
	}
	function _() {
		d("close", m.value), p.value = !1;
	}
	async function v() {
		let a = n.value;
		try {
			let n = typeof i == "function" ? {} : e(c(i) || {});
			a ??= await t.newEntity(n), a?.$id || (a = t.toEntity(a || n)), t != null && !r(a.$id) && (a = await t.details(a.$id) || a), typeof i == "function" && (a = await i(a)), m.value = a, p.value = !0, d("open", m.value, g);
		} catch (e) {
			console.error("Fetching details failed", {
				id: a?.$id,
				ex: e,
				app: h
			}), f ||= h?.appContext.config.globalProperties.$feedback, f.fail(`Fetching ${a?.$title || "item #" + a?.$id} failed`, e.response.status == 403 ? "Not allowed" : e.response?.data);
		}
	}
	function y(e) {
		l && (d("cancel", e), _());
	}
	function b({ saved: e, isNew: t }) {
		d("save", {
			saved: e,
			isNew: t
		}), d("update:modelValue", e), o && _();
	}
	function x() {
		d("remove", m.value), u && _();
	}
	return {
		item: m,
		isOpen: p,
		feedback: f,
		close: _,
		open: v,
		handleSave: b,
		handleRemove: x,
		handleCancel: y
	};
}
var g = h;
//#endregion
//#region src/vue/entities/form/listInput.ts
function _({ props: e, emit: r }) {
	let i = n(e, r), a = s({ id: 0 }), o = (e) => {
		r("sort", e);
	};
	function c({ saved: e, isNew: n }) {
		n && (e.id = (t(i.value, (e) => e.id) ?? 0) - 1, r("update:modelValue", i.value.concat([e])), a.value = { id: 0 });
	}
	return {
		items: i,
		newItem: a,
		handleSort: o,
		handleSave: c
	};
}
function v({ props: e, emit: t }) {
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
function y({ props: e, emit: r }) {
	let i = n(e, r), a = () => ({ id: 0 }), c = s();
	async function u() {
		c.value = a();
	}
	let d = (e) => {
		r("sort", e);
	};
	function f({ saved: e, isNew: n }) {
		n && (e.id = Math.min(t(i.value, (e) => e.id) ?? 0, 0) - 1, i.value = i.value.concat([e]), u());
	}
	return l(() => e.modelValue, () => i.value = e.modelValue || []), o(async () => {
		i.value = e.modelValue || [], await u();
	}), {
		items: i,
		newItem: c,
		resetNewItem: u,
		handleSort: d,
		handleSave: f
	};
}
//#endregion
//#region src/vue/entities/form/ownedModal.ts
function b(t, { props: n, emit: r }) {
	let i = s(n.modelValue || { id: 0 }), a = s(!1);
	function o() {
		let r = n.modelValue || {}, o = e(c(n.itemDefaults || {}));
		i.value = Object.assign(new t(), {
			...r,
			...o
		}), a.value = !0;
	}
	function l() {
		r("cancel"), a.value = !1;
	}
	function u() {
		r("save", {
			saved: i.value,
			isNew: i.value.id == 0
		}), r("update:modelValue", i.value), a.value = !1;
	}
	return {
		item: i,
		isOpen: a,
		handleOpen: o,
		handleCancel: l,
		handleSubmit: u
	};
}
//#endregion
export { m as a, f as c, v as i, p as l, y as n, g as o, _ as r, d as s, b as t };
