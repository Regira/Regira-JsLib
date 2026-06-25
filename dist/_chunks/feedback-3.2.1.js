import { r as e } from "./modal-3.2.1.js";
import { Fragment as t, Teleport as n, computed as r, createBlock as i, createCommentVNode as a, createElementBlock as o, createElementVNode as s, createTextVNode as c, createVNode as l, defineComponent as u, normalizeClass as d, openBlock as f, ref as p, renderList as m, renderSlot as h, resolveComponent as g, toDisplayString as _, unref as v, withCtx as y } from "vue";
//#region src/vue/ui/feedback/Pending.vue?vue&type=script&setup=true&lang.ts
var b = { class: "bg-light text-info" }, x = /* @__PURE__ */ u({
	__name: "Pending",
	props: { msg: { default: "Loading..." } },
	setup(e) {
		return (t, n) => (f(), o("div", b, [h(t.$slots, "message", {}, () => [c(_(e.msg), 1)])]));
	}
}), S = { class: "bg-success bg-opacity-75 text-light" }, C = /* @__PURE__ */ u({
	__name: "Success",
	props: { msg: { default: "Success!" } },
	setup(e) {
		return (t, n) => (f(), o("div", S, [h(t.$slots, "message", {}, () => [c(_(e.msg), 1)])]));
	}
}), w = { class: "bg-danger bg-opacity-75 text-light" }, T = { class: "row gy-0 gx-1" }, E = { class: "col-auto" }, D = ["diabled"], O = { class: "col-auto pt-1" }, k = {
	key: 0,
	class: "col-auto"
}, A = ["diabled"], j = {
	key: 0,
	class: "mt-2"
}, M = {
	key: 0,
	class: "mt-2"
}, N = { key: 1 }, P = {
	key: 0,
	class: "mt-2"
}, F = {
	key: 0,
	class: "mt-2"
}, I = { key: 1 }, L = /* @__PURE__ */ u({
	__name: "ErrorSummary",
	props: {
		msg: { default: "Unfortunately, an error has occurred." },
		error: { default: () => ({}) },
		enablePopup: { type: Boolean }
	},
	setup(r) {
		let c = p(!1);
		return (u, d) => {
			let p = g("Icon"), b = g("MyModal");
			return f(), o("div", w, [
				h(u.$slots, "message", {}, () => [s("div", T, [
					s("div", E, [s("button", {
						type: "button",
						class: "btn btn-default p-0 m-0 text-light",
						diabled: !r.error,
						onClick: d[0] ||= (e) => c.value = !c.value
					}, [l(p, { name: "warning" })], 8, D)]),
					s("div", O, _(r.msg), 1),
					r.enablePopup && r.error ? (f(), o("div", k, [s("button", {
						type: "button",
						class: "btn btn-link p-0 m-0 text-light",
						diabled: !r.error,
						onClick: d[1] ||= (e) => c.value = !c.value
					}, [l(p, { name: "info" })], 8, A)])) : a("", !0)
				])]),
				h(u.$slots, "summary", {}, () => [r.error ? (f(), o(t, { key: 0 }, [typeof r.error == "string" ? (f(), o("div", j, _(r.error), 1)) : (f(!0), o(t, { key: 1 }, m(r.error, (e, n) => (f(), o("ul", {
					class: "list-unstyled mt-2",
					key: n
				}, [s("li", null, [s("b", null, _(n), 1), typeof e == "string" ? (f(), o("div", M, _(e), 1)) : (f(), o("ul", N, [(f(!0), o(t, null, m(e, (e) => (f(), o("li", { key: e }, _(e), 1))), 128))]))])]))), 128))], 64)) : a("", !0)]),
				(f(), i(n, { to: "#modals" }, [c.value ? (f(), i(b, {
					key: 0,
					title: r.msg,
					"show-footer": !1,
					type: v(e).danger,
					onClose: d[2] ||= (e) => c.value = !1,
					onCancel: d[3] ||= (e) => c.value = !1,
					onSubmit: d[4] ||= (e) => c.value = !1
				}, {
					default: y(() => [typeof r.error == "string" ? (f(), o("div", P, _(r.error), 1)) : (f(!0), o(t, { key: 1 }, m(r.error, (e, n) => (f(), o("ul", {
						class: "list-unstyled mt-2",
						key: n
					}, [s("li", null, [s("b", null, _(n), 1), typeof e == "string" ? (f(), o("div", F, _(e), 1)) : (f(), o("ul", I, [(f(!0), o(t, null, m(e, (e) => (f(), o("li", { key: e }, _(e), 1))), 128))]))])]))), 128))]),
					_: 1
				}, 8, ["title", "type"])) : a("", !0)]))
			]);
		};
	}
}), R = /* @__PURE__ */ function(e) {
	return e.none = "", e.pending = "Pending", e.success = "Success", e.failed = "Failed", e;
}({});
function z({ autoHideDelay: e = 1500 } = {}) {
	let t = p(""), n = p(""), r = p(null), i;
	function a() {
		e > 0 && (clearTimeout(i), i = setTimeout(o, e));
	}
	function o() {
		t.value = "", n.value = "", r.value = null;
	}
	function s(e) {
		t.value = "Pending", n.value = e, r.value = null;
	}
	function c(i) {
		t.value = "Success", n.value = i, r.value = null, e && a();
	}
	function l(e, i) {
		t.value = "Failed", n.value = e, typeof i == "string" ? n.value = `${n.value}: ${i.split("\n")[0]}` : r.value = i?.message || i;
	}
	return {
		status: t,
		message: n,
		error: r,
		pending: s,
		success: c,
		fail: l,
		reset: o
	};
}
//#endregion
//#region src/vue/ui/feedback/Feedback.vue?vue&type=script&setup=true&lang.ts
var B = {
	key: 0,
	class: "mb-1 position-relative border h-100"
}, V = /* @__PURE__ */ u({
	__name: "Feedback",
	props: {
		hideCloseButton: {
			type: Boolean,
			default: !1
		},
		feedback: {},
		enableErrorPopup: {
			type: Boolean,
			default: !1
		}
	},
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = t, { status: i, message: s, error: c, reset: u } = e.feedback, p = r(() => i.value === R.pending), m = r(() => i.value === R.success), _ = r(() => i.value === R.failed), y = (e) => {
			e.stopPropagation(), n("close", {
				status: i.value,
				error: c.value
			}), u();
		};
		return (t, n) => {
			let r = g("IconButton");
			return p.value || m.value || _.value ? (f(), o("div", B, [
				e.hideCloseButton ? a("", !0) : h(t.$slots, "close-button", { key: 0 }, () => [l(r, {
					icon: "close",
					class: d(["btn btn-sm position-absolute end-0 p-1", { "text-light": _.value }]),
					onClick: y
				}, null, 8, ["class"])]),
				p.value ? h(t.$slots, "pending", { key: 1 }, () => [l(x, {
					msg: v(s),
					class: "px-2 py-1 border h-100"
				}, null, 8, ["msg"])]) : a("", !0),
				m.value ? h(t.$slots, "success", { key: 2 }, () => [l(C, {
					msg: v(s),
					class: "px-2 py-1 border h-100"
				}, null, 8, ["msg"])]) : a("", !0),
				_.value ? h(t.$slots, "error", { key: 3 }, () => [l(L, {
					msg: v(s),
					error: v(c),
					"enable-popup": e.enableErrorPopup,
					class: "px-2 border h-100"
				}, null, 8, [
					"msg",
					"error",
					"enable-popup"
				])]) : a("", !0)
			])) : a("", !0);
		};
	}
}), H = { install: (e, t) => {
	let n = z(t);
	e.config.globalProperties.$feedback = n, e.provide("feedback", n);
} };
//#endregion
export { L as a, z as i, V as n, C as o, R as r, x as s, H as t };
