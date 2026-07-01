import { F as e, _ as t } from "./array-utility-3.2.5.js";
import { useVModelField as n } from "../vue/vue-helper.js";
import { i as r } from "./feedback-3.2.5.js";
import { getCurrentInstance as i, onMounted as a, ref as o, unref as s, watch as c } from "vue";
import { useRouter as l } from "vue-router";
//#region src/vue/entities/form/form.ts
var u = /* @__PURE__ */ function(e) {
	return e.pending = "Pending", e.saved = "Saved", e.removed = "Removed", e.error = "Error", e;
}({}), d = {
	readonly: !1,
	isPopup: !1
};
function f({ entityService: t, props: n, emit: i, feedback: s = r() }) {
	let { readonly: u, isPopup: d } = n, f = o(n.modelValue), p = o();
	function m() {
		i("cancel", {
			canceled: f.value,
			original: p.value
		}), f.value = p.value;
	}
	function h() {
		if (u) throw s.fail("Readonly"), Error("Readonly");
	}
	let g = l();
	async function _() {
		h(), i("changeState", "Pending");
		try {
			s.pending("Saving...");
			let { saved: n, isNew: r } = await t.save(f.value);
			if (i("save", {
				saved: n,
				isNew: r
			}), s.success("Saved"), f.value = t.toEntity(e(n)), p.value = t.toEntity(e(n)), i("update:modelValue", f.value), r && !d) {
				let e = g.currentRoute.value;
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
				g.replace(t);
			}
		} catch (e) {
			console.error("Saving failed", { ex: e });
			let t = e, n = t.response?.status;
			throw n == 400 ? s.fail("Saving failed", t.response?.data?.errors) : n == 404 ? s.fail("Item not found", t.response?.data?.message || t.message) : s.fail("Server error", t.response?.data?.message || t.message), i("changeState", "Error"), e;
		} finally {
			i("changeState", "Saved");
		}
	}
	async function v() {
		h(), i("changeState", "Pending");
		try {
			s.pending("Deleting..."), await t.remove(f.value), s.success("Deleted"), i("remove", f.value);
		} catch (e) {
			console.error("Deleting failed", {
				item: f,
				ex: e
			});
			let t = e;
			throw s.fail("Deleting failed", t.response?.data?.errors), i("changeState", "Error"), e;
		} finally {
			i("changeState", "Removed");
		}
	}
	async function y() {
		let n = t.toEntity(e(f.value));
		n.isArchived = !1, i("changeState", "Pending");
		try {
			s.pending("Restoring...");
			let { saved: r, isNew: a } = await t.save(n);
			i("restore", r), i("save", {
				saved: r,
				isNew: a
			}), s.success("Restored"), f.value = t.toEntity(e(r)), p.value = t.toEntity(e(r)), i("update:modelValue", f.value);
		} catch (e) {
			console.error("Restoring failed", {
				item: f,
				ex: e
			});
			let t = e;
			throw s.fail("Restoring failed", t.response?.data?.errors), i("changeState", "Error"), e;
		} finally {
			i("changeState", "Saved");
		}
	}
	return c(() => n.modelValue, () => {
		f.value = n.modelValue, p.value = t.toEntity(e(f.value));
	}), a(() => {
		p.value = t.toEntity(e(f.value));
	}), {
		item: f,
		original: p,
		feedback: s,
		handleCancel: m,
		handleSubmit: _,
		handleRemove: v,
		handleRestore: y
	};
}
//#endregion
//#region src/vue/entities/form/modal.ts
var p = {
	closeOnSave: !1,
	closeOnDelete: !0
};
function m({ entityService: t, model: n, itemDefaults: r, closeOnSave: a, closeOnCancel: c, closeOnDelete: l, emit: u, feedback: d }) {
	let f = o(!1), p = o(), m = i();
	function h(e) {
		p.value = e;
	}
	function g() {
		u("close", p.value), f.value = !1;
	}
	async function _() {
		let i = n.value;
		try {
			let n = typeof r == "function" ? {} : e(s(r) || {});
			i ??= await t.newEntity(n), i?.$id || (i = t.toEntity(i || n)), t != null && i.$id !== "new" && (i = await t.details(i.$id) || i), typeof r == "function" && (i = await r(i)), p.value = i, f.value = !0, u("open", p.value, h);
		} catch (e) {
			console.error("Fetching details failed", {
				id: i?.$id,
				ex: e,
				app: m
			}), d ||= m?.appContext.config.globalProperties.$feedback, d.fail(`Fetching ${i?.$title || "item #" + i?.$id} failed`, e.response.status == 403 ? "Not allowed" : e.response?.data);
		}
	}
	function v(e) {
		c && (u("cancel", e), g());
	}
	function y({ saved: e, isNew: t }) {
		u("save", {
			saved: e,
			isNew: t
		}), u("update:modelValue", e), a && g();
	}
	function b() {
		u("remove", p.value), l && g();
	}
	return {
		item: p,
		isOpen: f,
		feedback: d,
		close: g,
		open: _,
		handleSave: y,
		handleRemove: b,
		handleCancel: v
	};
}
var h = m;
//#endregion
//#region src/vue/entities/form/listInput.ts
function g({ props: e, emit: r }) {
	let i = n(e, r), a = o({ id: 0 }), s = (e) => {
		r("sort", e);
	};
	function c({ saved: e, isNew: n }) {
		n && (e.id = (t(i.value, (e) => e.id) ?? 0) - 1, r("update:modelValue", i.value.concat([e])), a.value = { id: 0 });
	}
	return {
		items: i,
		newItem: a,
		handleSort: s,
		handleSave: c
	};
}
function _({ props: e, emit: t }) {
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
function v({ props: e, emit: r }) {
	let i = n(e, r), s = () => ({ id: 0 }), l = o();
	async function u() {
		l.value = s();
	}
	let d = (e) => {
		r("sort", e);
	};
	function f({ saved: e, isNew: n }) {
		n && (e.id = Math.min(t(i.value, (e) => e.id) ?? 0, 0) - 1, i.value = i.value.concat([e]), u());
	}
	return c(() => e.modelValue, () => i.value = e.modelValue || []), a(async () => {
		i.value = e.modelValue || [], await u();
	}), {
		items: i,
		newItem: l,
		resetNewItem: u,
		handleSort: d,
		handleSave: f
	};
}
//#endregion
//#region src/vue/entities/form/ownedModal.ts
function y(t, { props: n, emit: r }) {
	let i = o(n.modelValue || { id: 0 }), a = o(!1);
	function c() {
		let r = n.modelValue || {}, o = e(s(n.itemDefaults || {}));
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
		handleOpen: c,
		handleCancel: l,
		handleSubmit: u
	};
}
//#endregion
export { p as a, d as c, _ as i, f as l, v as n, h as o, g as r, u as s, y as t };
