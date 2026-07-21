import { a as e, n as t } from "./modal-3.2.6.js";
import { t as n } from "./Icon-3.2.6.js";
import { t as r } from "./IconButton-3.2.6.js";
import { Fragment as i, Teleport as a, computed as o, createBlock as s, createCommentVNode as c, createElementBlock as l, createElementVNode as u, createTextVNode as d, createVNode as f, defineComponent as p, mergeDefaults as m, normalizeClass as h, openBlock as g, ref as _, renderList as v, renderSlot as y, resolveDynamicComponent as b, toDisplayString as x, unref as S, withCtx as C } from "vue";
//#region src/vue/ui/feedback/Pending.vue?vue&type=script&setup=true&lang.ts
var w = { class: "rg-pending bg-light text-info" }, T = /* @__PURE__ */ p({
	__name: "Pending",
	props: { msg: { default: "Loading..." } },
	setup(e) {
		return (t, n) => (g(), l("div", w, [y(t.$slots, "message", {}, () => [d(x(e.msg), 1)])]));
	}
}), E = { class: "rg-success bg-success bg-opacity-75 text-light" }, D = /* @__PURE__ */ p({
	__name: "Success",
	props: { msg: { default: "Success!" } },
	setup(e) {
		return (t, n) => (g(), l("div", E, [y(t.$slots, "message", {}, () => [d(x(e.msg), 1)])]));
	}
}), O = { class: "rg-error-summary bg-danger bg-opacity-75 text-light" }, k = { class: "row gy-0 gx-1" }, A = { class: "col-auto" }, j = ["diabled"], M = { class: "col-auto pt-1" }, N = {
	key: 0,
	class: "col-auto"
}, P = ["diabled"], F = {
	key: 0,
	class: "mt-2"
}, I = {
	key: 0,
	class: "mt-2"
}, L = { key: 1 }, R = {
	key: 0,
	class: "mt-2"
}, z = {
	key: 0,
	class: "mt-2"
}, B = { key: 1 }, V = /* @__PURE__ */ p({
	__name: "ErrorSummary",
	props: {
		msg: { default: "Unfortunately, an error has occurred." },
		error: { default: () => ({}) },
		enablePopup: { type: Boolean }
	},
	setup(r) {
		let o = t(), d = _(!1);
		return (t, p) => (g(), l("div", O, [
			y(t.$slots, "message", {}, () => [u("div", k, [
				u("div", A, [u("button", {
					type: "button",
					class: "btn btn-default p-0 m-0 text-light",
					diabled: !r.error,
					onClick: p[0] ||= (e) => d.value = !d.value
				}, [f(n, { name: "warning" })], 8, j)]),
				u("div", M, x(r.msg), 1),
				r.enablePopup && r.error ? (g(), l("div", N, [u("button", {
					type: "button",
					class: "btn btn-link p-0 m-0 text-light",
					diabled: !r.error,
					onClick: p[1] ||= (e) => d.value = !d.value
				}, [f(n, { name: "info" })], 8, P)])) : c("", !0)
			])]),
			y(t.$slots, "summary", {}, () => [r.error ? (g(), l(i, { key: 0 }, [typeof r.error == "string" ? (g(), l("div", F, x(r.error), 1)) : (g(!0), l(i, { key: 1 }, v(r.error, (e, t) => (g(), l("ul", {
				class: "list-unstyled mt-2",
				key: t
			}, [u("li", null, [u("b", null, x(t), 1), typeof e == "string" ? (g(), l("div", I, x(e), 1)) : (g(), l("ul", L, [(g(!0), l(i, null, v(e, (e) => (g(), l("li", { key: e }, x(e), 1))), 128))]))])]))), 128))], 64)) : c("", !0)]),
			(g(), s(a, { to: "#modals" }, [d.value ? (g(), s(b(S(o)), {
				key: 0,
				"is-visible": "",
				title: r.msg,
				"show-footer": !1,
				type: S(e).danger,
				onClose: p[2] ||= (e) => d.value = !1,
				onCancel: p[3] ||= (e) => d.value = !1,
				onSubmit: p[4] ||= (e) => d.value = !1
			}, {
				default: C(() => [typeof r.error == "string" ? (g(), l("div", R, x(r.error), 1)) : (g(!0), l(i, { key: 1 }, v(r.error, (e, t) => (g(), l("ul", {
					class: "list-unstyled mt-2",
					key: t
				}, [u("li", null, [u("b", null, x(t), 1), typeof e == "string" ? (g(), l("div", z, x(e), 1)) : (g(), l("ul", B, [(g(!0), l(i, null, v(e, (e) => (g(), l("li", { key: e }, x(e), 1))), 128))]))])]))), 128))]),
				_: 1
			}, 40, ["title", "type"])) : c("", !0)]))
		]));
	}
}), H = /* @__PURE__ */ function(e) {
	return e.none = "", e.pending = "Pending", e.success = "Success", e.failed = "Failed", e;
}({}), U = {
	hideCloseButton: !1,
	enableErrorPopup: !1
};
function W({ autoHideDelay: e = 1500 } = {}) {
	let t = _(""), n = _(""), r = _(null), i;
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
var G = {
	key: 0,
	class: "rg-feedback mb-1 position-relative border h-100"
}, K = /* @__PURE__ */ p({
	__name: "Feedback",
	props: /*@__PURE__*/ m({
		feedback: {},
		hideCloseButton: { type: Boolean },
		enableErrorPopup: { type: Boolean }
	}, { ...U }),
	emits: ["close"],
	setup(e, { emit: t }) {
		let n = t, { status: i, message: a, error: s, reset: u } = e.feedback, d = o(() => i.value === H.pending), p = o(() => i.value === H.success), m = o(() => i.value === H.failed), _ = (e) => {
			e.stopPropagation(), n("close", {
				status: i.value,
				error: s.value
			}), u();
		};
		return (t, n) => d.value || p.value || m.value ? (g(), l("div", G, [
			e.hideCloseButton ? c("", !0) : y(t.$slots, "close-button", { key: 0 }, () => [f(r, {
				icon: "close",
				class: h(["rg-feedback__close-button btn btn-sm position-absolute end-0 p-1", { "text-light": m.value }]),
				onClick: _
			}, null, 8, ["class"])]),
			d.value ? y(t.$slots, "pending", { key: 1 }, () => [f(T, {
				msg: S(a),
				class: "rg-feedback__pending px-2 py-1 border h-100"
			}, null, 8, ["msg"])]) : c("", !0),
			p.value ? y(t.$slots, "success", { key: 2 }, () => [f(D, {
				msg: S(a),
				class: "rg-feedback__success px-2 py-1 border h-100"
			}, null, 8, ["msg"])]) : c("", !0),
			m.value ? y(t.$slots, "error", { key: 3 }, () => [f(V, {
				msg: S(a),
				error: S(s),
				"enable-popup": e.enableErrorPopup,
				class: "rg-feedback__error px-2 border h-100"
			}, null, 8, [
				"msg",
				"error",
				"enable-popup"
			])]) : c("", !0)
		])) : c("", !0);
	}
}), q = { install: (e, t) => {
	let n = W(t);
	e.config.globalProperties.$feedback = n, e.provide("feedback", n);
} };
//#endregion
export { W as a, T as c, U as i, K as n, V as o, H as r, D as s, q as t };
