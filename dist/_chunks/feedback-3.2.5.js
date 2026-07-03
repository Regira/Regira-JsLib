import { n as e, t } from "./DefaultModal-3.2.5.js";
import { t as n } from "./Icon-3.2.5.js";
import { t as r } from "./IconButton-3.2.5.js";
import "./modal-3.2.5.js";
import { Fragment as i, Teleport as a, computed as o, createBlock as s, createCommentVNode as c, createElementBlock as l, createElementVNode as u, createTextVNode as d, createVNode as f, defineComponent as p, normalizeClass as m, openBlock as h, ref as g, renderList as _, renderSlot as v, toDisplayString as y, unref as b, withCtx as x } from "vue";
//#region src/vue/ui/feedback/Pending.vue?vue&type=script&setup=true&lang.ts
var S = { class: "bg-light text-info" }, C = /* @__PURE__ */ p({
	__name: "Pending",
	props: { msg: { default: "Loading..." } },
	setup(e) {
		return (t, n) => (h(), l("div", S, [v(t.$slots, "message", {}, () => [d(y(e.msg), 1)])]));
	}
}), w = { class: "bg-success bg-opacity-75 text-light" }, T = /* @__PURE__ */ p({
	__name: "Success",
	props: { msg: { default: "Success!" } },
	setup(e) {
		return (t, n) => (h(), l("div", w, [v(t.$slots, "message", {}, () => [d(y(e.msg), 1)])]));
	}
}), E = { class: "bg-danger bg-opacity-75 text-light" }, D = { class: "row gy-0 gx-1" }, O = { class: "col-auto" }, k = ["diabled"], A = { class: "col-auto pt-1" }, j = {
	key: 0,
	class: "col-auto"
}, M = ["diabled"], N = {
	key: 0,
	class: "mt-2"
}, P = {
	key: 0,
	class: "mt-2"
}, F = { key: 1 }, I = {
	key: 0,
	class: "mt-2"
}, L = {
	key: 0,
	class: "mt-2"
}, R = { key: 1 }, z = /* @__PURE__ */ p({
	__name: "ErrorSummary",
	props: {
		msg: { default: "Unfortunately, an error has occurred." },
		error: { default: () => ({}) },
		enablePopup: { type: Boolean }
	},
	setup(r) {
		let o = g(!1);
		return (d, p) => (h(), l("div", E, [
			v(d.$slots, "message", {}, () => [u("div", D, [
				u("div", O, [u("button", {
					type: "button",
					class: "btn btn-default p-0 m-0 text-light",
					diabled: !r.error,
					onClick: p[0] ||= (e) => o.value = !o.value
				}, [f(n, { name: "warning" })], 8, k)]),
				u("div", A, y(r.msg), 1),
				r.enablePopup && r.error ? (h(), l("div", j, [u("button", {
					type: "button",
					class: "btn btn-link p-0 m-0 text-light",
					diabled: !r.error,
					onClick: p[1] ||= (e) => o.value = !o.value
				}, [f(n, { name: "info" })], 8, M)])) : c("", !0)
			])]),
			v(d.$slots, "summary", {}, () => [r.error ? (h(), l(i, { key: 0 }, [typeof r.error == "string" ? (h(), l("div", N, y(r.error), 1)) : (h(!0), l(i, { key: 1 }, _(r.error, (e, t) => (h(), l("ul", {
				class: "list-unstyled mt-2",
				key: t
			}, [u("li", null, [u("b", null, y(t), 1), typeof e == "string" ? (h(), l("div", P, y(e), 1)) : (h(), l("ul", F, [(h(!0), l(i, null, _(e, (e) => (h(), l("li", { key: e }, y(e), 1))), 128))]))])]))), 128))], 64)) : c("", !0)]),
			(h(), s(a, { to: "#modals" }, [o.value ? (h(), s(t, {
				key: 0,
				"is-visible": "",
				title: r.msg,
				"show-footer": !1,
				type: b(e).danger,
				onClose: p[2] ||= (e) => o.value = !1,
				onCancel: p[3] ||= (e) => o.value = !1,
				onSubmit: p[4] ||= (e) => o.value = !1
			}, {
				default: x(() => [typeof r.error == "string" ? (h(), l("div", I, y(r.error), 1)) : (h(!0), l(i, { key: 1 }, _(r.error, (e, t) => (h(), l("ul", {
					class: "list-unstyled mt-2",
					key: t
				}, [u("li", null, [u("b", null, y(t), 1), typeof e == "string" ? (h(), l("div", L, y(e), 1)) : (h(), l("ul", R, [(h(!0), l(i, null, _(e, (e) => (h(), l("li", { key: e }, y(e), 1))), 128))]))])]))), 128))]),
				_: 1
			}, 8, ["title", "type"])) : c("", !0)]))
		]));
	}
}), B = /* @__PURE__ */ function(e) {
	return e.none = "", e.pending = "Pending", e.success = "Success", e.failed = "Failed", e;
}({});
function V({ autoHideDelay: e = 1500 } = {}) {
	let t = g(B.none), n = g(""), r = g(null), i;
	function a() {
		e > 0 && (clearTimeout(i), i = setTimeout(o, e));
	}
	function o() {
		t.value = B.none, n.value = "", r.value = null;
	}
	function s(e) {
		t.value = B.pending, n.value = e, r.value = null;
	}
	function c(i) {
		t.value = B.success, n.value = i, r.value = null, e && a();
	}
	function l(e, i) {
		t.value = B.failed, n.value = e, typeof i == "string" ? n.value = `${n.value}: ${i.split("\n")[0]}` : r.value = i?.message || i;
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
var H = {
	key: 0,
	class: "mb-1 position-relative border h-100"
}, U = /* @__PURE__ */ p({
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
		let n = t, { status: i, message: a, error: s, reset: u } = e.feedback, d = o(() => i.value === B.pending), p = o(() => i.value === B.success), g = o(() => i.value === B.failed), _ = (e) => {
			e.stopPropagation(), n("close", {
				status: i.value,
				error: s.value
			}), u();
		};
		return (t, n) => d.value || p.value || g.value ? (h(), l("div", H, [
			e.hideCloseButton ? c("", !0) : v(t.$slots, "close-button", { key: 0 }, () => [f(r, {
				icon: "close",
				class: m(["btn btn-sm position-absolute end-0 p-1", { "text-light": g.value }]),
				onClick: _
			}, null, 8, ["class"])]),
			d.value ? v(t.$slots, "pending", { key: 1 }, () => [f(C, {
				msg: b(a),
				class: "px-2 py-1 border h-100"
			}, null, 8, ["msg"])]) : c("", !0),
			p.value ? v(t.$slots, "success", { key: 2 }, () => [f(T, {
				msg: b(a),
				class: "px-2 py-1 border h-100"
			}, null, 8, ["msg"])]) : c("", !0),
			g.value ? v(t.$slots, "error", { key: 3 }, () => [f(z, {
				msg: b(a),
				error: b(s),
				"enable-popup": e.enableErrorPopup,
				class: "px-2 border h-100"
			}, null, 8, [
				"msg",
				"error",
				"enable-popup"
			])]) : c("", !0)
		])) : c("", !0);
	}
}), W = { install: (e, t) => {
	let n = V(t);
	e.config.globalProperties.$feedback = n, e.provide("feedback", n);
} };
//#endregion
export { z as a, V as i, U as n, T as o, B as r, C as s, W as t };
