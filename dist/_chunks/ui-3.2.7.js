import { isEmail as e, isIP as t, isPhone as n } from "../utilities/string-utility.js";
import { debounceToPromise as r } from "../utilities/promise-utility.js";
import { n as i, t as a } from "./clipboard-utility-3.2.7.js";
import { useEventListener as o, useVModelField as s } from "../vue/vue-helper.js";
import { a as c, n as l } from "./modal-3.2.7.js";
import { t as u } from "./Icon-3.2.7.js";
import { t as d } from "./IconButton-3.2.7.js";
import { n as f } from "./ioc-3.2.7.js";
import { t as p } from "./_plugin-vue_export-helper-3.2.7.js";
import { r as m } from "./feedback-3.2.7.js";
import { dateInputString as h } from "../vue/formatters/index.js";
import "./icons-3.2.7.js";
import { Fragment as g, Teleport as _, computed as v, createBlock as y, createCommentVNode as b, createElementBlock as x, createElementVNode as S, createTextVNode as C, createVNode as w, defineComponent as T, getCurrentInstance as E, inject as D, isRef as ee, mergeDefaults as O, mergeModels as k, mergeProps as A, normalizeClass as j, normalizeStyle as M, onMounted as te, onUnmounted as ne, openBlock as N, ref as P, renderList as F, renderSlot as I, resolveComponent as L, resolveDirective as R, resolveDynamicComponent as z, toDisplayString as B, toRefs as re, unref as V, useAttrs as ie, useModel as ae, vModelText as oe, vShow as se, watch as H, watchEffect as ce, withCtx as U, withDirectives as W, withKeys as G, withModifiers as K } from "vue";
import { useRouter as le } from "vue-router";
import { isValid as ue } from "date-fns";
//#region src/vue/ui/autocomplete/autocomplete.ts
var de = 8, fe = {
	data: () => [],
	maxResults: 10,
	debounceTime: 250,
	autoSelect: !1
};
function pe(e, { emit: t }) {
	let n = P(""), a = P(-1), s = P(e.data), c = P(!1), l = P(!1), u = P(!1), d = v({
		get: () => e.modelValue,
		set: (n) => {
			e.modelValue !== n && (t("update:modelValue", n), t("update:idValue", y(n)), t("select", n));
		}
	}), f = v(() => y(d.value)), p = P(), m = P({
		top: 0,
		left: 0
	}), h = P({
		top: 0,
		left: 0
	}), g = P({
		top: 0,
		left: 0
	}), _ = v(() => {
		m.value;
		let { height: e } = p.value?.getBoundingClientRect() || { height: 0 }, t = p.value?.offsetParent, n = p.value?.closest?.(".input-group"), r = !!n && n === t, i = r ? n : p.value, a = (r ? n.offsetWidth : p.value?.offsetWidth) || 0, o = typeof window > "u" ? 0 : window.innerWidth || 0, s = i?.getBoundingClientRect?.(), l = s ? o - s.left - de : 0, u = s ? s.right - de : 0, d = o > 0 && l < a && u > l, f = o > 0 ? Math.max(0, Math.round(d ? u : l)) : 0, h = (p.value?.offsetLeft || 0) + (p.value?.offsetWidth || 0), g = r ? 0 : Math.max(0, (t?.offsetWidth || 0) - h);
		return {
			visibility: c.value ? "visible" : "hidden",
			top: `${e}px`,
			left: d ? "auto" : `${r ? 0 : p.value?.offsetLeft || 0}px`,
			right: d ? `${g}px` : "auto",
			minWidth: `${a}px`,
			width: "max-content",
			maxWidth: f > 0 ? `min(90vw, 32rem, ${f}px)` : "min(90vw, 32rem)"
		};
	}), y = e.idSelector || ((e) => e), b = e.displayItemFormatter || ((e) => (e ?? "").toString());
	async function x(t = "") {
		return e.data?.filter((e) => b(e).toLowerCase().startsWith(t.toLowerCase()));
	}
	async function S(t = n.value) {
		j(), u.value = !0, s.value = void 0;
		try {
			let n = await I(t), r = e.maxResults || n.length;
			s.value = n.slice(0, r), a.value = s.value?.findIndex((e) => y(e) == y(d.value));
		} finally {
			u.value = !1;
		}
	}
	function C(t = !1) {
		if (d.value == null && s.value) {
			let r = s.value?.filter((e) => (b(e)?.toString() || "").toLowerCase() === n.value?.toLowerCase());
			r.length == 1 ? D(r[0]) : t && e.autoSelect && D(s.value[0]);
		}
	}
	function w() {
		O(), S();
	}
	function T() {}
	function E(e, t) {
		M(), D(e, e ? t : -1);
	}
	function D(e, t) {
		if (e == null && t == null) {
			O(), n.value || M();
			return;
		}
		e && (t == null || t < 0) ? t = (s.value || []).indexOf(e) : !e && t >= 0 && (e = s.value[t]), e != null && (a.value = t, d.value = e, n.value = b(d.value));
	}
	function ee(e) {
		console.debug("moveSelection", {
			step: e,
			selectedIndex: a.value,
			items: s.value
		});
		let t = a.value + e, n = s.value[t];
		t >= 0 && t < s.value.length && D(n, t);
	}
	function O() {
		a.value = -1, d.value = void 0;
	}
	function k() {
		n.value = "", O(), M();
	}
	function A(e) {
		let t = 0, n = 0;
		do
			t += e?.offsetTop || 0, n += e?.offsetLeft || 0, e = e?.offsetParent;
		while (e);
		return {
			top: t,
			left: n
		};
	}
	function j() {
		L(), c.value = !0;
	}
	function M() {
		c.value = !1;
	}
	function N() {
		c.value && setTimeout(() => {
			C(!0), d.value ?? (n.value = ""), M();
		}, 250);
	}
	function F(e) {
		throw e;
	}
	let I = r(e.search || e.data && x || F(/* @__PURE__ */ Error("prop search or data is required")), e.debounceTime), L = () => {
		m.value = A(p.value), g.value = p.value ? i(p.value) : {
			top: 0,
			left: 0
		};
	}, R = r(L, 50);
	return o(window, "resize", R), te(() => {
		n.value = b(d.value), L(), document.addEventListener("scroll", R, !0);
	}), ne(() => {
		document.removeEventListener("scroll", R, !0);
	}), H(d, (e, t) => {
		e != t && e != d.value && D(e), e && (n.value = b(d.value));
	}), H(n, () => t("qInput", n.value || "")), {
		q: n,
		selectedItem: d,
		selectedIndex: a,
		selectedId: f,
		items: s,
		isOpen: c,
		isFocus: l,
		isLoading: u,
		inputEl: p,
		resultOffset: h,
		resultStyle: _,
		displayItemFormatter: b,
		handleInput: w,
		handleChange: T,
		handleSelect: E,
		handleSearch: S,
		openResults: j,
		closeResults: M,
		closeGently: N,
		moveSelection: ee,
		checkMatch: C,
		clearSelection: O,
		reset: k
	};
}
//#endregion
//#region src/vue/ui/autocomplete/Autocomplete.vue?vue&type=script&setup=true&lang.ts
var me = { class: "loading list-group-item" }, he = ["onClick"], ge = { key: 0 }, _e = /* @__PURE__ */ T({
	inheritAttrs: !1,
	inheritAttrs: !1,
	__name: "Autocomplete",
	props: /*@__PURE__*/ O({
		idValue: {},
		modelValue: {},
		data: {},
		maxResults: {},
		debounceTime: {},
		enableDblClick: { type: Boolean },
		autoSelect: { type: Boolean },
		allowFreeInput: { type: Boolean },
		resultClass: {},
		itemsClass: {},
		itemClass: {},
		search: { type: Function },
		idSelector: { type: Function },
		displayItemFormatter: { type: Function }
	}, { ...fe }),
	emits: [
		"update:modelValue",
		"update:idValue",
		"select",
		"qInput"
	],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = e, { q: a, selectedItem: o, selectedIndex: s, items: c, isFocus: l, inputEl: u, resultStyle: d, isLoading: f, displayItemFormatter: p, closeGently: m, moveSelection: h, handleInput: _, handleChange: v, handleSelect: y, handleSearch: b, reset: w } = pe(i, { emit: r });
		function T(e) {
			let t = p(e) ?? "", n = a.value?.trim();
			if (!n) return [{
				text: t,
				match: !1
			}];
			let r = n.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), i = t.match(new RegExp(r, "i"));
			if (!i || i.index == null) return [{
				text: t,
				match: !1
			}];
			let o = i.index, s = o + i[0].length;
			return [
				{
					text: t.slice(0, o),
					match: !1
				},
				{
					text: t.slice(o, s),
					match: !0
				},
				{
					text: t.slice(s),
					match: !1
				}
			].filter((e) => e.text);
		}
		function E() {
			l.value = !0, ((i.idSelector && i.idSelector(o.value) || "new") == "new" || o.value == null) && b();
		}
		function D() {
			l.value = !1;
		}
		function O() {
			i.enableDblClick && b("");
		}
		function k(e) {
			e.target != u.value && m();
		}
		return t({
			inputEl: u,
			q: a,
			selectedItem: o,
			search: b,
			reset: w,
			resetQ() {
				l.value || (a.value = "");
			}
		}), (t, n) => {
			let r = R("click-outside");
			return N(), x(g, null, [W(S("input", A({
				class: "rg-autocomplete",
				autocomplete: "__away",
				type: "text"
			}, t.$attrs, {
				"onUpdate:modelValue": n[0] ||= (e) => ee(a) ? a.value = e : null,
				onInput: n[1] ||= (...e) => V(_) && V(_)(...e),
				onFocus: E,
				onDblclick: O,
				onBlur: D,
				onChange: n[2] ||= (...e) => V(v) && V(v)(...e),
				onKeydown: [
					n[3] ||= G((e) => V(h)(1), ["down"]),
					n[4] ||= G((e) => V(h)(-1), ["up"]),
					n[5] ||= G(K((e) => V(y)(V(o), V(s)), ["prevent"]), ["enter"])
				],
				ref_key: "inputEl",
				ref: u
			}), null, 16), [[oe, V(a)]]), W((N(), x("div", {
				class: j(["autocomplete-items bg-white border", e.resultClass]),
				style: M(V(d))
			}, [S("div", { class: j(["list-group", e.itemsClass]) }, [W(S("div", me, "Loading...", 512), [[se, V(f)]]), (N(!0), x(g, null, F(V(c), (n, r) => (N(), x("div", {
				key: r,
				onClick: (e) => V(y)(n, r),
				class: j(["autocomplete-item list-group-item list-group-item-action", [e.itemClass, { "bg-light": r == V(s) }]])
			}, [I(t.$slots, "default", {
				item: n,
				q: V(a)
			}, () => [S("div", null, [(N(!0), x(g, null, F(T(n), (e, t) => (N(), x(g, { key: t }, [e.match ? (N(), x("strong", ge, B(e.text), 1)) : (N(), x(g, { key: 1 }, [C(B(e.text), 1)], 64))], 64))), 128))])])], 10, he))), 128))], 2)], 6)), [[r, k]])], 64);
		};
	}
}), ve = {
	icon: "warning",
	modalTitle: "Sure?",
	modalType: c.warning
}, ye = ["name"], be = {
	key: 1,
	class: "ms-1"
}, xe = /* @__PURE__ */ T({
	__name: "ConfirmButton",
	props: /*@__PURE__*/ O({
		icon: {},
		buttonLabel: {},
		modalTitle: {},
		modalType: {}
	}, { ...ve }),
	emits: [
		"confirm",
		"cancel",
		"open",
		"close"
	],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = l(), a = P(!1);
		function o() {
			r("confirm"), d();
		}
		function s() {
			r("open"), a.value = !0;
		}
		function c() {
			r("cancel"), d();
		}
		function d() {
			r("close"), a.value = !1;
		}
		return t({
			open: s,
			close: d
		}), (t, n) => (N(), x("button", {
			type: "button",
			class: "rg-confirm-button btn",
			name: e.icon,
			onClick: s
		}, [I(t.$slots, "button-content", {}, () => [e.icon == null ? b("", !0) : (N(), y(u, {
			key: 0,
			name: e.icon
		}, null, 8, ["name"])), e.buttonLabel ? (N(), x("span", be, B(e.buttonLabel), 1)) : b("", !0)]), (N(), y(_, { to: "#modals" }, [I(t.$slots, "modal", {}, () => [(N(), y(z(V(i)), {
			"is-visible": a.value,
			type: e.modalType,
			title: e.modalTitle,
			onSubmit: o,
			onCancel: c,
			onClose: d
		}, {
			default: U(() => [I(t.$slots, "default")]),
			_: 3
		}, 40, [
			"is-visible",
			"type",
			"title"
		]))])]))], 8, ye));
	}
}), Se = ["href"], Ce = /* @__PURE__ */ T({
	__name: "Anchor",
	props: { href: {} },
	setup(r) {
		let i = r, a = v(() => {
			let r = i.href;
			return e(r) ? r.startsWith("mailto:") || (r = "mailto:" + r) : t(r) ? r = "http://" + r : n(r) ? r.startsWith("tel:") || (r = "tel:" + r) : !r.startsWith("http") && ![
				"mailto:",
				"tel:",
				"ftp:"
			].some((e) => r.startsWith(e)) && (r = "http://" + r), r;
		});
		return (e, t) => (N(), x("a", {
			class: "rg-anchor",
			href: a.value
		}, [I(e.$slots, "default")], 8, Se));
	}
}), we = [
	"value",
	"readonly",
	"lang"
], Te = /* @__PURE__ */ T({
	__name: "DateInput",
	props: {
		modelValue: {},
		culture: {},
		readonly: { type: Boolean }
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = v(() => ue(new Date(r.modelValue || ""))), a = v(() => i.value ? h(new Date(r.modelValue)) : r.modelValue), o = (e) => {
			if (r.readonly) return;
			let t = new Date(e.target.value);
			(!e.target.value || ue(t)) && n("update:modelValue", t || e.target.value);
		};
		return (t, n) => (N(), x("input", {
			type: "date",
			class: j(["rg-date-input form-control", { "is-invalid": a.value && !i.value }]),
			value: a.value,
			readonly: e.readonly,
			onChange: o,
			lang: e.culture
		}, null, 42, we));
	}
}), Ee = { autoHide: !1 }, De = { timeout: 2500 }, Oe = /* @__PURE__ */ T({
	__name: "FormLabel",
	props: /*@__PURE__*/ O({
		label: {},
		autoHide: { type: Boolean }
	}, { ...Ee }),
	setup(e) {
		return (t, n) => (N(), x("small", { class: j(["rg-form-label form-text text-muted", e.autoHide ? "d-none d-md-inline" : "d-inline"]) }, B(e.label), 3));
	}
}), ke = { class: "description-input" }, Ae = ["readonly"], je = /* @__PURE__ */ T({
	__name: "DescriptionInput",
	props: /*@__PURE__*/ k({
		label: {},
		readonly: { type: Boolean }
	}, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = ae(e, "modelValue");
		return (n, r) => (N(), x("div", ke, [W(S("textarea", {
			"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
			readonly: e.readonly,
			class: "form-control",
			rows: "3"
		}, null, 8, Ae), [[oe, t.value]]), e.label ? (N(), y(Oe, {
			key: 0,
			label: e.label
		}, null, 8, ["label"])) : b("", !0)]));
	}
}), Me = { class: "form-buttons d-flex flex-wrap gap-2" }, Ne = { class: "d-none d-md-inline ms-1" }, Pe = { class: "d-none d-md-inline ms-1" }, Fe = { class: "d-none d-md-inline ms-1" }, Ie = { class: "d-none d-md-inline ms-1" }, Le = /* @__PURE__ */ T({
	__name: "FormButtonsRow",
	props: {
		item: {},
		readonly: { type: Boolean },
		feedback: {},
		showDelete: { type: Boolean },
		labels: {},
		modalTitle: {}
	},
	emits: [
		"cancel",
		"remove",
		"restore"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = v(() => !!n.item?.isArchived), a = v(() => n.item?.$title ?? ""), o = v(() => {
			let e = n.feedback?.status.value;
			return e != null && e !== m.none && e !== m.failed;
		});
		return (t, n) => (N(), x("div", Me, [
			e.readonly ? b("", !0) : (N(), y(d, {
				key: 0,
				type: "submit",
				icon: "save",
				class: "btn-primary",
				disabled: o.value
			}, {
				default: U(() => [S("span", Ne, B(e.labels?.save ?? "Save"), 1)]),
				_: 1
			}, 8, ["disabled"])),
			w(d, {
				type: "button",
				icon: "cancel",
				class: "btn-secondary",
				onClick: n[0] ||= (e) => r("cancel")
			}, {
				default: U(() => [S("span", Pe, B(e.labels?.cancel ?? "Cancel"), 1)]),
				_: 1
			}),
			e.showDelete && !i.value ? (N(), y(xe, {
				key: 1,
				"modal-title": e.modalTitle ?? "Delete?",
				"modal-type": V(c).danger,
				class: "btn-danger",
				disabled: e.readonly || o.value,
				onConfirm: n[1] ||= (e) => r("remove")
			}, {
				"button-content": U(() => [w(u, { name: "delete" }), S("span", Fe, B(e.labels?.delete ?? "Delete"), 1)]),
				default: U(() => [I(t.$slots, "delete", {}, () => [C("Delete " + B(a.value) + "?", 1)])]),
				_: 3
			}, 8, [
				"modal-title",
				"modal-type",
				"disabled"
			])) : b("", !0),
			i.value ? (N(), y(d, {
				key: 2,
				type: "button",
				icon: "restore",
				class: "btn-warning",
				disabled: o.value,
				onClick: n[2] ||= (e) => r("restore")
			}, {
				default: U(() => [S("span", Ie, B(e.labels?.restore ?? "Restore"), 1)]),
				_: 1
			}, 8, ["disabled"])) : b("", !0)
		]));
	}
}), Re = ["checked"], ze = ["for"], Be = /* @__PURE__ */ T({
	name: "NullableCheckBox",
	inheritAttrs: !1,
	props: {
		modelValue: { type: [
			Boolean,
			String,
			Number
		] },
		label: {}
	},
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = P(null), a = P(((e) => {
			if (e != null) return typeof e == "string" ? e === "true" || e !== "false" && void 0 : new Boolean(e).valueOf();
		})(r.modelValue)), o = v({
			get() {
				return a.value;
			},
			set(e) {
				a.value = e, n("update:modelValue", e), n("change", { target: i.value });
			}
		}), s = v(() => ({ opacity: o.value == null ? .5 : 1 }));
		function c() {
			o.value = o.value == null || !o.value && void 0;
		}
		let l = ie(), u = v(() => l.id || void 0), d = v(() => l.disabled !== void 0 && l.disabled !== !1);
		function f() {
			d.value || c();
		}
		return ce(() => i.value && (i.value.indeterminate = o.value === void 0)), (t, n) => (N(), x(g, null, [S("input", A({
			type: "checkbox",
			class: "rg-nullable-checkbox",
			ref_key: "input",
			ref: i
		}, t.$attrs, {
			onClick: c,
			"true-value": !0,
			checked: o.value,
			style: s.value
		}), null, 16, Re), e.label ? (N(), x("label", {
			key: 0,
			class: "rg-nullable-checkbox-label",
			for: u.value,
			onClick: K(f, ["prevent"])
		}, B(e.label), 9, ze)) : b("", !0)], 64));
	}
}), Ve = /* @__PURE__ */ T({
	__name: "NullableLabel",
	props: { label: {} },
	setup(e) {
		return (t, n) => (N(), x("span", { class: j(["rg-nullable-label", { "italic-muted": !e.label }]) }, [e.label ? (N(), x(g, { key: 0 }, [C(B(e.label), 1)], 64)) : I(t.$slots, "default", {}, void 0, void 0, 1)], 2));
	}
}), He = { class: "form-section mb-3" }, Ue = { class: "form-section-title bg-body-secondary rounded-2 px-2 mb-2" }, We = { class: "row align-items-center" }, Ge = { class: "fs-6 fw-semibold py-2 mb-0" }, Ke = { class: "col-auto" }, qe = /* @__PURE__ */ T({
	__name: "FormSection",
	props: {
		title: {},
		readonly: { type: Boolean },
		showSummary: { type: Boolean },
		collapsed: { type: Boolean },
		summaryClass: {}
	},
	emits: ["expand", "collapse"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = E(), a = P(r.collapsed), o = P(r.readonly || r.showSummary), s = v({
			get: () => !!(i?.slots.summary && (r.readonly || o.value)),
			set: (e) => o.value = !!e
		});
		function c() {
			a.value = !a.value, a.value ? n("collapse") : n("expand");
		}
		return H(() => r.collapsed, () => {
			a.value = r.collapsed, a.value ? n("collapse") : n("expand");
		}), (t, n) => (N(), x("div", He, [S("div", Ue, [I(t.$slots, "header", {
			collapsed: a.value,
			showSummary: s.value
		}, () => [S("div", We, [S("div", {
			class: "col",
			onClick: n[0] ||= (e) => s.value = !s.value
		}, [I(t.$slots, "title", { showSummary: s.value }, () => [S("h3", Ge, B(e.title), 1)])]), S("div", Ke, [!e.readonly && t.$slots.summary ? (N(), x("button", {
			key: 0,
			type: "button",
			class: "btn btn-default my-1 px-2 py-1 opacity-50",
			onClick: n[1] ||= K((e) => s.value = !s.value, ["stop"])
		}, [w(u, { name: s.value ? "look" : "edit" }, null, 8, ["name"])])) : b("", !0), S("button", {
			type: "button",
			class: "btn btn-default my-1 px-2 py-1 opacity-50",
			onClick: K(c, ["stop"])
		}, [w(u, { name: a.value ? "maximize" : "minimize" }, null, 8, ["name"])])])])])]), W(S("div", { class: j(["form-section-body", s.value && e.summaryClass]) }, [
			!t.$slots.summary || !s.value ? I(t.$slots, "default", { collapsed: a.value }, void 0, void 0, 0) : b("", !0),
			t.$slots.summary && s.value ? I(t.$slots, "summary", { collapsed: a.value }, void 0, void 0, 1) : b("", !0),
			I(t.$slots, "always")
		], 2), [[se, !a.value]])]));
	}
}), Je = /* @__PURE__ */ T({
	__name: "FileDropZone",
	emits: ["drop-files"],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = P();
		async function a(e) {
			r("drop-files", [...e.dataTransfer.files]);
		}
		return t({ isDropping: i }), (e, t) => (N(), x("div", {
			class: "rg-file-drop-zone",
			onDrop: K(a, ["prevent"]),
			onDragover: t[0] ||= K((e) => i.value = !0, ["prevent"]),
			onDragleave: t[1] ||= K((e) => i.value = !1, ["prevent"])
		}, [I(e.$slots, "default", { isDropping: i.value })], 32));
	}
}), Ye = /* @__PURE__ */ T({
	__name: "CopyToClipboardButton",
	props: /*@__PURE__*/ O({
		value: {},
		timeout: {}
	}, { ...De }),
	setup(e, { expose: t }) {
		let n = e, r = P();
		function i() {
			a(n.value ?? ""), r.value = !0, setTimeout(() => r.value = void 0, n.timeout);
		}
		return t({ success: r }), (e, t) => (N(), y(d, {
			class: "rg-copy-button",
			icon: r.value ? "check" : "copy",
			disabled: r.value,
			onClick: i
		}, null, 8, ["icon", "disabled"]));
	}
}), Xe = ["src"], Ze = /* @__PURE__ */ T({
	__name: "GMap",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = v(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = v(() => `https://maps.google.com/maps?q=${encodeURIComponent(n.value)}&t=&z=${t.zoom || 10}&ie=UTF8&iwloc=&output=embed`);
		return (e, t) => (N(), x("iframe", {
			src: r.value,
			frameborder: "0",
			scrolling: "no",
			marginheight: "0",
			marginwidth: "0",
			allowfullscreen: ""
		}, null, 8, Xe));
	}
}), Qe = ["href"], $e = /* @__PURE__ */ T({
	__name: "GmapLink",
	props: { modelValue: {} },
	setup(e) {
		let t = e, n = v(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" "));
		return (e, t) => (N(), x("a", { href: `https://www.google.com/maps/?q=${n.value}` }, [w(u, { name: "map" }), I(e.$slots, "default")], 8, Qe));
	}
}), et = /*#__PURE__*/ p(/* @__PURE__ */ T({
	__name: "ModalButton",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = v(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = l(), i = P(!1);
		return (t, a) => (N(), x("button", {
			type: "button",
			onClick: a[1] ||= (e) => i.value = !0
		}, [I(t.$slots, "default", {}, () => [w(u, { name: "map" })], !0), (N(), y(_, { to: "#modals" }, [(N(), y(z(V(r)), {
			"is-visible": i.value,
			title: n.value,
			"show-footer": !1,
			"full-width": !0,
			onClose: a[0] ||= (e) => i.value = !1
		}, {
			default: U(() => [w(Ze, {
				id: "gmap_canvas",
				modelValue: e.modelValue,
				zoom: e.zoom,
				class: "w-100"
			}, null, 8, ["modelValue", "zoom"])]),
			_: 1
		}, 40, ["is-visible", "title"]))]))]));
	}
}), [["__scopeId", "data-v-4c9ec967"]]), tt = ["src"], nt = {
	key: 1,
	class: "rg-loading rg-loading-fallback d-flex justify-content-center",
	role: "status"
}, rt = { class: "visually-hidden" }, q = /* @__PURE__ */ T({
	__name: "Loading",
	setup(e, { expose: t }) {
		let n = D("loadingImg"), r = D("loadingLabel", "Loading…"), i = P(null);
		return t({
			imgEl: i,
			dimensions: () => [i.value?.width, i.value?.height],
			height: () => i.value?.naturalHeight
		}), (e, t) => V(n) ? (N(), x("img", {
			key: 0,
			class: "rg-loading",
			src: V(n),
			ref_key: "imgEl",
			ref: i,
			alt: ""
		}, null, 8, tt)) : (N(), x("div", nt, [t[0] ||= S("span", {
			class: "rg-loading-spinner spinner-border text-primary",
			"aria-hidden": "true"
		}, null, -1), S("span", rt, B(V(r)), 1)]));
	}
}), J = Symbol("regira.loading");
function Y() {
	return D(J, q);
}
//#endregion
//#region src/vue/ui/loading/LoadingButton.vue?vue&type=script&setup=true&lang.ts
var it = ["disabled"], at = /* @__PURE__ */ T({
	__name: "LoadingButton",
	props: {
		isLoading: { type: Boolean },
		disabled: { type: Boolean }
	},
	setup(e) {
		let t = Y();
		return (n, r) => (N(), x("button", {
			type: "button",
			class: "rg-loading-button btn",
			disabled: e.disabled || e.isLoading
		}, [e.isLoading ? I(n.$slots, "loading", {}, () => [(N(), y(z(V(t)), { style: { width: "1rem" } }))], void 0, 0) : I(n.$slots, "default", {}, void 0, void 0, 1)], 8, it));
	}
}), ot = /* @__PURE__ */ T({
	__name: "LoadingContainer",
	props: { isLoading: { type: Boolean } },
	setup(e, { expose: t }) {
		let n = Y(), r = P(null), i = P(null);
		function a() {
			return i.value?.imgEl?.width;
		}
		return t({
			containerEl: r,
			loadingImgEl: v(() => i.value?.imgEl)
		}), (t, o) => (N(), x("div", {
			class: "rg-loading-container position-relative",
			style: M({ height: e.isLoading ? `${a()}px` : void 0 }),
			ref_key: "containerEl",
			ref: r
		}, [I(t.$slots, "loading", {}, () => [e.isLoading ? (N(), y(z(V(n)), {
			key: 0,
			class: "position-absolute top-0 start-50 translate-middle-x",
			style: {
				width: "20rem",
				"max-width": "100%"
			},
			ref_key: "loadingEl",
			ref: i
		}, null, 512)) : b("", !0)]), S("div", { style: M({ opacity: e.isLoading ? "0.4" : "" }) }, [I(t.$slots, "default")], 4)], 4));
	}
}), st = { install(e, t = {}) {
	e.provide("loadingImg", t.img);
	let n = t.Loading ?? q;
	e.provide(J, n), f.registerComponentsGlobally && (e.component("Loading", n), e.component("LoadingButton", t.LoadingButton ?? at), e.component("LoadingContainer", t.LoadingContainer ?? ot));
} }, ct = { PAGESIZE: 10 };
//#endregion
//#region src/vue/ui/screen/screen.ts
function X() {
	return typeof window > "u" ? [0, 0] : [window.innerWidth, window.innerHeight];
}
var Z = {
	xs: 0,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	xxl: 1400
};
function lt(e, t) {
	let n;
	return (...r) => {
		n && clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
var Q;
function $() {
	if (Q) return Q;
	let e = P(X()), t = {
		get size() {
			return e.value;
		},
		get isExtraSmall() {
			return this.size[0] >= Z.xs;
		},
		get isSmall() {
			return this.size[0] >= Z.sm;
		},
		get isMedium() {
			return this.size[0] >= Z.md;
		},
		get isLarge() {
			return this.size[0] >= Z.lg;
		},
		get isExtraLarge() {
			return this.size[0] >= Z.xl;
		},
		get isExtraExtraLarge() {
			return this.size[0] >= Z.xxl;
		},
		get layout() {
			return this.isExtraExtraLarge ? "xxl" : this.isExtraLarge ? "xl" : this.isLarge ? "lg" : this.isMedium ? "md" : this.isSmall ? "sm" : "xs";
		},
		isSize(e) {
			return this.size[0] >= Z[e];
		},
		updateSize: (t = X()) => e.value = t
	};
	if (Q = {
		size: e,
		screen: t
	}, typeof window < "u") {
		let e = lt(() => t.updateSize(X()), 250);
		window.addEventListener("resize", e), window.addEventListener("orientationchange", e);
	}
	return Q;
}
//#endregion
//#region src/vue/ui/screen/plugin.ts
var ut = { install: (e, { sizes: t } = {}) => {
	if (t) for (let e in t) e in Z && (Z[e] = t[e]);
	let { screen: n } = $();
	e.config.globalProperties.$screen = n, e.provide("screen", n);
} }, dt = /* @__PURE__ */ function(e) {
	return e.anchor = "Anchor", e.button = "Button", e;
}({}), ft = {
	maxPages: 9,
	buttonType: "Anchor"
};
function pt({ pagingInfo: e, count: t, maxPages: n, emit: r }) {
	let { screen: i } = $(), a = v(() => i.isSmall ? n : Math.ceil(n / 2)), o = v(() => (isNaN(parseInt(e.value.pageSize + "")) ? void 0 : e.value.pageSize) || ct.PAGESIZE), s = le();
	function c(e) {
		let { name: t, path: n, hash: r, query: i } = s.currentRoute.value, a = {
			name: t,
			path: n,
			hash: r,
			query: i
		}, o = {
			name: a.name || void 0,
			query: {
				...a.query,
				page: e
			}
		};
		return e <= 1 && delete o.query.p, s.resolve(o).fullPath;
	}
	let l = v(() => e.value.page || 1), u = v(() => Math.ceil(t.value / o.value)), d = v(() => Math.min(u.value, a.value)), f = v(() => {
		let e = Math.floor(d.value / 2), t = Math.max(l.value - e, 1);
		return t + a.value > u.value && (t -= t + a.value - u.value - 1), Math.max(t, 1);
	}), p = v(() => Math.min(f.value + d.value, u.value)), m = v(() => !isNaN(d.value) && d.value > 0 ? Array(d.value).fill(0).map((e, t) => f.value + t).filter((e) => e <= p.value) : []);
	function h(t) {
		let n = {
			...e.value,
			page: t
		};
		r("update:modelValue", n), r("change", n);
	}
	return {
		pagedRoute: c,
		page: l,
		totalPages: u,
		totalVisiblePages: d,
		firstPage: f,
		lastPage: p,
		pages: m,
		visibleMaxPages: a,
		handleChangePage: h
	};
}
//#endregion
//#region src/vue/ui/paging/PagingAnchor.vue
var mt = /* @__PURE__ */ T({
	__name: "PagingAnchor",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => {
			let r = L("RouterLink");
			return N(), y(r, {
				class: "page-link",
				to: e.to,
				title: "page " + e.page,
				activeClass: "active-page"
			}, {
				default: U(() => [I(t.$slots, "default", {}, () => [C(B(e.page), 1)])]),
				_: 3
			}, 8, ["to", "title"]);
		};
	}
}), ht = ["title"], gt = /* @__PURE__ */ T({
	__name: "PagingButton",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => (N(), x("button", {
			type: "button",
			class: "btn btn-link page-link",
			title: "page " + e.page
		}, [I(t.$slots, "default", {}, () => [C(B(e.page), 1)])], 8, ht));
	}
}), _t = {
	class: "rg-paging",
	"aria-label": "Pagination"
}, vt = { class: "pagination flex-wrap" }, yt = { class: "rg-paging__page page-item" }, bt = { class: "rg-paging__page page-item" }, xt = /* @__PURE__ */ T({
	__name: "Paging",
	props: /*@__PURE__*/ O({
		modelValue: {},
		count: {},
		maxPages: {},
		buttonType: {}
	}, { ...ft }),
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = s(r, n), { count: a } = re(r), o = r.buttonType == dt.button ? gt : mt, { pagedRoute: c, page: l, totalPages: u, pages: d, handleChangePage: f } = pt({
			pagingInfo: i,
			count: a,
			maxPages: r.maxPages,
			emit: n
		});
		return (e, t) => (N(), x("nav", _t, [S("ul", vt, [
			S("li", yt, [I(e.$slots, "firstPage", { page: 1 }, () => [(N(), y(z(V(o)), {
				page: 1,
				to: V(c)(1),
				onClick: t[0] ||= K((e) => V(f)(1), ["prevent"]),
				"aria-label": "Previous"
			}, {
				default: U(() => [...t[2] ||= [C("«", -1)]]),
				_: 1
			}, 8, ["to"]))])]),
			(N(!0), x(g, null, F(V(d), (t) => (N(), x("li", {
				class: j(["rg-paging__page page-item", { active: t == V(l) }]),
				key: t
			}, [I(e.$slots, "default", {
				page: t,
				route: V(c)(t),
				handleChange: V(f)
			}, () => [(N(), y(z(V(o)), {
				page: t,
				to: V(c)(t),
				onClick: K((e) => V(f)(t), ["prevent"])
			}, {
				default: U(() => [C(B(t), 1)]),
				_: 2
			}, 1032, [
				"page",
				"to",
				"onClick"
			]))])], 2))), 128)),
			S("li", bt, [I(e.$slots, "lastPage", { page: V(u) }, () => [(N(), y(z(V(o)), {
				page: V(u),
				to: V(c)(V(u)),
				onClick: t[1] ||= K((e) => V(f)(V(u)), ["prevent"]),
				"aria-label": "Next"
			}, {
				default: U(() => [...t[3] ||= [C(" » ", -1)]]),
				_: 1
			}, 8, ["page", "to"]))])])
		])]));
	}
}), St = { class: "result-summary text-muted small" }, Ct = /* @__PURE__ */ T({
	__name: "ResultSummary",
	props: {
		visibleCount: {},
		totalCount: {}
	},
	setup(e) {
		return (t, n) => (N(), x("span", St, [I(t.$slots, "default", {
			visibleCount: e.visibleCount,
			totalCount: e.totalCount
		}, () => [C(B(e.visibleCount ?? 0) + " / " + B(e.totalCount ?? 0), 1)])]));
	}
}), wt = { install(e, { defaultPageSize: t = 10, Paging: n } = {}) {
	ct.PAGESIZE = t, f.registerComponentsGlobally && e.component("Paging", n ?? xt);
} }, Tt = class e {
	key;
	icon;
	title;
	isDefault;
	isDisabled;
	isVisible;
	constructor(e, t = e, n = !1, r = !1, i = !0) {
		this.title = e, this.key = t, this.isDefault = n, this.isDisabled = r, this.isVisible = i;
	}
	static create(t, n) {
		return Object.assign(new e(t), n || {});
	}
}, Et = { useRouteNav: !1 }, Dt = ["href", "onClick"], Ot = /* @__PURE__ */ T({
	__name: "TabNavigation",
	props: {
		tabs: {},
		activeTab: {}
	},
	emits: ["select"],
	setup(e) {
		let t = v(() => (e) => typeof e.isVisible == "function" ? e.isVisible() : e.isVisible);
		return (n, r) => (N(), x("ul", { class: j(["rg-tab-nav nav", {
			"nav-pills": !n.$screen?.isLarge,
			"nav-tabs": n.$screen?.isLarge
		}]) }, [(N(!0), x(g, null, F(e.tabs, (r) => (N(), x(g, { key: r.key }, [t.value(r) ? (N(), x("li", {
			key: 0,
			class: j(["nav-item", { disabled: r.isDisabled }])
		}, [S("a", {
			href: `#${r.key}`,
			class: j([
				"py-1 px-2",
				"nav-link",
				{
					active: e.activeTab == r.key,
					disabled: r.isDisabled
				}
			]),
			onClick: K((e) => n.$emit("select", r.key), ["prevent"])
		}, [r.icon ? (N(), y(u, {
			key: 0,
			name: r.icon
		}, null, 8, ["name"])) : b("", !0), S("span", { class: j({ "d-none d-lg-inline ms-1": r.icon }) }, B(r.title), 3)], 10, Dt)], 2)) : b("", !0)], 64))), 128))], 2));
	}
}), kt = { class: "tab-container" }, At = {
	key: 0,
	class: "tab-content pt-2"
}, jt = /* @__PURE__ */ T({
	__name: "TabContainer",
	props: /*@__PURE__*/ O({
		tabs: {},
		useRouteNav: { type: Boolean },
		active: {}
	}, { ...Et }),
	emits: ["select"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = le(), a = v(() => r.tabs.filter((e) => e != null).map((e) => e instanceof Tt ? e : new Tt(e))), o = v(() => (a.value.find((e) => e.isDefault) || a.value[0]).key), s = P(r.active), c = v({
			get: () => (r.useRouteNav ? i.currentRoute.value.hash?.substring(1) : s.value) || o.value,
			set: (e) => {
				let t = s.value != null;
				if (s.value = e, r.useRouteNav) {
					let n = {
						...i.currentRoute.value,
						hash: "#" + e
					};
					t ? i.push(n) : i.replace(n);
				}
				n("select", e);
			}
		});
		function l(e) {
			s.value !== e && (c.value = e);
		}
		return te(() => {
			s.value == null && r.useRouteNav && l((r.useRouteNav ? i.currentRoute.value.hash?.substring(1) : void 0) || o.value);
		}), (e, t) => (N(), x("div", kt, [w(Ot, {
			tabs: a.value,
			activeTab: c.value,
			onSelect: l
		}, null, 8, ["tabs", "activeTab"]), (N(!0), x(g, null, F(a.value, (t) => (N(), x(g, { key: t.key }, [c.value == t.key ? (N(), x("div", At, [I(e.$slots, t.key)])) : b("", !0)], 64))), 128))]));
	}
});
//#endregion
export { De as A, Je as C, Le as D, Be as E, ve as F, _e as I, fe as L, Te as M, Ce as N, je as O, xe as P, pe as R, Ye as S, Ve as T, Y as _, wt as a, $e as b, dt as c, ut as d, $ as f, J as g, at as h, Tt as i, Ee as j, Oe as k, ft as l, ot as m, Ot as n, Ct as o, st as p, Et as r, xt as s, jt as t, pt as u, q as v, qe as w, Ze as x, et as y };
