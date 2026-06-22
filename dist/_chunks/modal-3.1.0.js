import { Transition as e, computed as t, createBlock as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createTextVNode as o, createVNode as s, defineComponent as c, normalizeClass as l, normalizeStyle as u, openBlock as d, renderSlot as f, resolveComponent as p, toDisplayString as m, withCtx as h, withKeys as g } from "vue";
//#region src/vue/ui/modal/modal.ts
var _ = /* @__PURE__ */ function(e) {
	return e.normal = "Normal", e.success = "Success", e.warning = "Warning", e.danger = "Danger", e;
}({}), v = { class: "modal-wrapper" }, y = {
	class: "modal show d-block",
	tabindex: "-1"
}, b = { class: "d-flex justify-content-between w-100" }, x = { class: "modal-title" }, S = { class: "d-flex justify-content-between w-100" }, C = /* @__PURE__ */ c({
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
		type: { default: _.normal }
	},
	emits: [
		"submit",
		"cancel",
		"close"
	],
	setup(c, { emit: C }) {
		let w = C, T = c, E = t(() => T.type === _.normal), D = t(() => T.type === _.success), O = t(() => T.type === _.warning), k = t(() => T.type === _.danger), A = t(() => ({
			"bg-normal": E.value,
			"bg-success": D.value,
			"bg-danger": k.value,
			"text-white": k.value,
			"bg-warning": O.value
		})), j = t(() => ({ "text-danger": k.value })), M = t(() => ({})), N = () => w("close"), P = () => w("cancel"), F = () => w("submit");
		return (t, _) => {
			let C = p("Icon"), w = p("IconButton");
			return d(), n(e, { name: "modal" }, {
				default: h(() => [c.isVisible ? (d(), i("div", {
					key: 0,
					class: "modal-mask",
					onKeydown: g(N, ["esc"])
				}, [a("div", v, [a("div", y, [a("div", { class: l(["modal-dialog modal-dialog-scrollable", { "full-width": c.fullWidth }]) }, [a("div", {
					class: "modal-content",
					style: u({ "min-height": c.fullWidth ? "60vh" : "inherit" })
				}, [
					c.showHeader ? (d(), i("div", {
						key: 0,
						class: l(["modal-header py-2", A.value])
					}, [a("div", b, [f(t.$slots, "title", {}, () => [a("h3", x, [
						k.value ? (d(), n(C, {
							key: 0,
							name: "alert",
							class: "me-2"
						})) : r("", !0),
						O.value ? (d(), n(C, {
							key: 1,
							name: "warning",
							class: "me-2"
						})) : r("", !0),
						o(" " + m(c.title), 1)
					])]), f(t.$slots, "header-close-button", { handleClose: N }, () => [s(w, {
						icon: "close",
						class: l([k.value ? "btn-danger" : "btn-outline-danger"]),
						title: "close",
						onClick: N,
						"data-dismiss": "modal"
					}, null, 8, ["class"])])])], 2)) : r("", !0),
					a("div", { class: l(["modal-body", j.value]) }, [f(t.$slots, "default")], 2),
					c.showFooter ? (d(), i("div", {
						key: 1,
						class: l(["modal-footer py-1", M.value])
					}, [f(t.$slots, "buttons", {}, () => [a("div", S, [f(t.$slots, "footer-close-button", { handleCancel: P }, () => [a("div", null, [s(w, {
						icon: "cancel",
						class: "btn-outline-secondary",
						onClick: P
					}, {
						default: h(() => [..._[0] ||= [o("Cancel", -1)]]),
						_: 1
					})])]), f(t.$slots, "footer-submit-button", { handleClose: F }, () => [a("div", null, [s(w, {
						icon: "submit",
						class: l(k.value ? "btn-danger" : "btn-success"),
						onClick: F
					}, {
						default: h(() => [..._[1] ||= [o("Submit", -1)]]),
						_: 1
					}, 8, ["class"])])])])])], 2)) : r("", !0)
				], 4)], 2)])])], 32)) : r("", !0)]),
				_: 3
			});
		};
	}
}), w = { install(e, { DefaultModal: t } = { DefaultModal: C }) {
	e.component("MyModal", t);
} };
//#endregion
export { C as n, _ as r, w as t };
