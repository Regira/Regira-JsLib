import { t as e } from "./Icon-3.2.5.js";
import { t } from "./IconButton-3.2.5.js";
import { Transition as n, computed as r, createBlock as i, createCommentVNode as a, createElementBlock as o, createElementVNode as s, createTextVNode as c, createVNode as l, defineComponent as u, normalizeClass as d, normalizeStyle as f, openBlock as p, renderSlot as m, toDisplayString as h, withCtx as g, withKeys as _ } from "vue";
//#region src/vue/ui/modal/modal.ts
var v = /* @__PURE__ */ function(e) {
	return e.normal = "Normal", e.success = "Success", e.warning = "Warning", e.danger = "Danger", e;
}({}), y = { class: "modal-wrapper" }, b = {
	class: "modal show d-block",
	tabindex: "-1"
}, x = { class: "d-flex justify-content-between w-100" }, S = { class: "modal-title" }, C = { class: "d-flex justify-content-between w-100" }, w = /* @__PURE__ */ u({
	__name: "DefaultModal",
	props: {
		title: {},
		isVisible: { type: Boolean },
		showHeader: {
			type: Boolean,
			default: !0
		},
		showFooter: {
			type: Boolean,
			default: !0
		},
		fullWidth: { type: Boolean },
		size: {},
		type: { default: v.normal }
	},
	emits: [
		"submit",
		"cancel",
		"close"
	],
	setup(u, { emit: w }) {
		let T = w, E = u, D = r(() => E.type === v.normal), O = r(() => E.type === v.success), k = r(() => E.type === v.warning), A = r(() => E.type === v.danger), j = r(() => E.size && E.size !== "md" ? `modal-${E.size}` : ""), M = r(() => ({
			"bg-normal": D.value,
			"bg-success": O.value,
			"bg-danger": A.value,
			"text-white": A.value,
			"bg-warning": k.value
		})), N = r(() => ({ "text-danger": A.value })), P = r(() => ({})), F = () => T("close"), I = () => T("cancel"), L = () => T("submit");
		return (r, v) => (p(), i(n, { name: "modal" }, {
			default: g(() => [u.isVisible ? (p(), o("div", {
				key: 0,
				class: "modal-mask",
				onKeydown: _(F, ["esc"])
			}, [s("div", y, [s("div", b, [s("div", { class: d(["modal-dialog modal-dialog-scrollable", [j.value, { "full-width": u.fullWidth }]]) }, [s("div", {
				class: "modal-content",
				style: f({ "min-height": u.fullWidth ? "60vh" : "inherit" })
			}, [
				u.showHeader ? (p(), o("div", {
					key: 0,
					class: d(["modal-header py-2", M.value])
				}, [s("div", x, [m(r.$slots, "title", {}, () => [s("h3", S, [
					A.value ? (p(), i(e, {
						key: 0,
						name: "alert",
						class: "me-2"
					})) : a("", !0),
					k.value ? (p(), i(e, {
						key: 1,
						name: "warning",
						class: "me-2"
					})) : a("", !0),
					c(" " + h(u.title), 1)
				])]), m(r.$slots, "header-close-button", { handleClose: F }, () => [l(t, {
					icon: "close",
					class: d([A.value ? "btn-danger" : "btn-outline-danger"]),
					title: "close",
					onClick: F,
					"data-dismiss": "modal"
				}, null, 8, ["class"])])])], 2)) : a("", !0),
				s("div", { class: d(["modal-body", N.value]) }, [m(r.$slots, "default")], 2),
				u.showFooter ? (p(), o("div", {
					key: 1,
					class: d(["modal-footer py-1", P.value])
				}, [m(r.$slots, "buttons", {}, () => [s("div", C, [m(r.$slots, "footer-close-button", { handleCancel: I }, () => [s("div", null, [l(t, {
					icon: "cancel",
					class: "btn-outline-secondary",
					onClick: I
				}, {
					default: g(() => [...v[0] ||= [c("Cancel", -1)]]),
					_: 1
				})])]), m(r.$slots, "footer-submit-button", { handleClose: L }, () => [s("div", null, [l(t, {
					icon: "submit",
					class: d(A.value ? "btn-danger" : "btn-success"),
					onClick: L
				}, {
					default: g(() => [...v[1] ||= [c("Submit", -1)]]),
					_: 1
				}, 8, ["class"])])])])])], 2)) : a("", !0)
			], 4)], 2)])])], 32)) : a("", !0)]),
			_: 3
		}));
	}
});
//#endregion
export { v as n, w as t };
