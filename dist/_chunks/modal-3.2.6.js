import { t as e } from "./Icon-3.2.6.js";
import { t } from "./IconButton-3.2.6.js";
import { n } from "./ioc-3.2.6.js";
import { Transition as r, computed as i, createBlock as a, createCommentVNode as o, createElementBlock as s, createElementVNode as c, createTextVNode as l, createVNode as u, defineComponent as d, inject as f, mergeDefaults as p, normalizeClass as m, normalizeStyle as h, openBlock as g, renderSlot as _, toDisplayString as v, withCtx as y, withKeys as b } from "vue";
//#region src/vue/ui/modal/modal.ts
var x = /* @__PURE__ */ function(e) {
	return e.normal = "Normal", e.success = "Success", e.warning = "Warning", e.danger = "Danger", e;
}({}), S = {
	showHeader: !0,
	showFooter: !0,
	type: "Normal"
}, C = { class: "modal-wrapper" }, w = {
	class: "modal show d-block",
	tabindex: "-1"
}, T = { class: "d-flex justify-content-between w-100" }, E = { class: "modal-title" }, D = { class: "d-flex justify-content-between w-100" }, O = /* @__PURE__ */ d({
	__name: "DefaultModal",
	props: /*@__PURE__*/ p({
		title: {},
		isVisible: { type: Boolean },
		showHeader: { type: Boolean },
		showFooter: { type: Boolean },
		fullWidth: { type: Boolean },
		size: {},
		type: {}
	}, { ...S }),
	emits: [
		"submit",
		"cancel",
		"close"
	],
	setup(n, { emit: d }) {
		let f = d, p = n, S = i(() => p.type === x.normal), O = i(() => p.type === x.success), k = i(() => p.type === x.warning), A = i(() => p.type === x.danger), j = i(() => p.size && p.size !== "md" ? `modal-${p.size}` : ""), M = i(() => ({
			"rg-accent-bg": S.value,
			"bg-success": O.value,
			"bg-danger": A.value,
			"text-white": A.value,
			"bg-warning": k.value
		})), N = i(() => ({ "text-danger": A.value })), P = i(() => ({})), F = () => f("close"), I = () => f("cancel"), L = () => f("submit");
		return (i, d) => (g(), a(r, { name: "modal" }, {
			default: y(() => [n.isVisible ? (g(), s("div", {
				key: 0,
				class: "rg-modal modal-mask",
				onKeydown: b(F, ["esc"])
			}, [c("div", C, [c("div", w, [c("div", { class: m(["modal-dialog modal-dialog-scrollable", [j.value, { "full-width": n.fullWidth }]]) }, [c("div", {
				class: "modal-content",
				style: h({ "min-height": n.fullWidth ? "60vh" : "inherit" })
			}, [
				n.showHeader ? (g(), s("div", {
					key: 0,
					class: m(["rg-modal__header modal-header py-2", M.value])
				}, [c("div", T, [_(i.$slots, "title", {}, () => [c("h3", E, [
					A.value ? (g(), a(e, {
						key: 0,
						name: "alert",
						class: "me-2"
					})) : o("", !0),
					k.value ? (g(), a(e, {
						key: 1,
						name: "warning",
						class: "me-2"
					})) : o("", !0),
					l(" " + v(n.title), 1)
				])]), _(i.$slots, "header-close-button", { handleClose: F }, () => [u(t, {
					icon: "close",
					class: m([A.value ? "btn-danger" : "btn-outline-danger"]),
					title: "close",
					onClick: F,
					"data-dismiss": "modal"
				}, null, 8, ["class"])])])], 2)) : o("", !0),
				c("div", { class: m(["rg-modal__body modal-body", N.value]) }, [_(i.$slots, "default")], 2),
				n.showFooter ? (g(), s("div", {
					key: 1,
					class: m(["rg-modal__footer modal-footer py-1", P.value])
				}, [_(i.$slots, "buttons", {}, () => [c("div", D, [_(i.$slots, "footer-close-button", { handleCancel: I }, () => [c("div", null, [u(t, {
					icon: "cancel",
					class: "btn-outline-secondary",
					onClick: I
				}, {
					default: y(() => [...d[0] ||= [l("Cancel", -1)]]),
					_: 1
				})])]), _(i.$slots, "footer-submit-button", { handleClose: L }, () => [c("div", null, [u(t, {
					icon: "submit",
					class: m(A.value ? "btn-danger" : "btn-success"),
					onClick: L
				}, {
					default: y(() => [...d[1] ||= [l("Submit", -1)]]),
					_: 1
				}, 8, ["class"])])])])])], 2)) : o("", !0)
			], 4)], 2)])])], 32)) : o("", !0)]),
			_: 3
		}));
	}
}), k = Symbol("regira.modal");
function A() {
	return f(k, O);
}
var j = { install(e, t = {}) {
	"DefaultModal" in t && console.warn("[regira] modalPlugin option `DefaultModal` was renamed to `Modal` — pass app.use(modalPlugin, { Modal }).");
	let r = t.Modal ?? O;
	e.provide(k, r), n.registerComponentsGlobally && e.component("MyModal", r);
} };
//#endregion
export { x as a, O as i, A as n, S as o, j as r, k as t };
