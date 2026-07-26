import { isEmail as e, isIP as t, isPhone as n } from "../utilities/string-utility.js";
import { debounceToPromise as r } from "../utilities/promise-utility.js";
import { n as i, t as a } from "./clipboard-utility-3.2.6.js";
import { useEventListener as o, useVModelField as s } from "../vue/vue-helper.js";
import { a as c, n as l } from "./modal-3.2.6.js";
import { t as u } from "./Icon-3.2.6.js";
import { t as d } from "./IconButton-3.2.6.js";
import { n as f } from "./ioc-3.2.6.js";
import { t as p } from "./_plugin-vue_export-helper-3.2.6.js";
import { r as m } from "./feedback-3.2.6.js";
import { dateInputString as h } from "../vue/formatters/index.js";
import "./icons-3.2.6.js";
import { Fragment as g, Teleport as _, computed as v, createBlock as y, createCommentVNode as b, createElementBlock as x, createElementVNode as S, createTextVNode as C, createVNode as w, defineComponent as T, getCurrentInstance as E, inject as D, isRef as ee, mergeDefaults as O, mergeModels as k, mergeProps as te, normalizeClass as A, normalizeStyle as j, onMounted as ne, onUnmounted as re, openBlock as M, ref as N, renderList as P, renderSlot as F, resolveComponent as I, resolveDirective as L, resolveDynamicComponent as R, toDisplayString as z, toRefs as ie, unref as B, useModel as ae, vModelText as oe, vShow as se, watch as V, watchEffect as ce, withCtx as H, withDirectives as U, withKeys as W, withModifiers as G } from "vue";
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
	let n = N(""), a = N(-1), s = N(e.data), c = N(!1), l = N(!1), u = N(!1), d = v({
		get: () => e.modelValue,
		set: (n) => {
			e.modelValue !== n && (t("update:modelValue", n), t("update:idValue", y(n)), t("select", n));
		}
	}), f = v(() => y(d.value)), p = N(), m = N({
		top: 0,
		left: 0
	}), h = N({
		top: 0,
		left: 0
	}), g = N({
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
		A(), u.value = !0, s.value = void 0;
		try {
			let n = await F(t), r = e.maxResults || n.length;
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
		j(), D(e, e ? t : -1);
	}
	function D(e, t) {
		if (e == null && t == null) {
			O(), n.value || j();
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
		n.value = "", O(), j();
	}
	function te(e) {
		let t = 0, n = 0;
		do
			t += e?.offsetTop || 0, n += e?.offsetLeft || 0, e = e?.offsetParent;
		while (e);
		return {
			top: t,
			left: n
		};
	}
	function A() {
		I(), c.value = !0;
	}
	function j() {
		c.value = !1;
	}
	function M() {
		c.value && setTimeout(() => {
			C(!0), d.value ?? (n.value = ""), j();
		}, 250);
	}
	function P(e) {
		throw e;
	}
	let F = r(e.search || e.data && x || P(/* @__PURE__ */ Error("prop search or data is required")), e.debounceTime), I = () => {
		m.value = te(p.value), g.value = p.value ? i(p.value) : {
			top: 0,
			left: 0
		};
	}, L = r(I, 50);
	return o(window, "resize", L), ne(() => {
		n.value = b(d.value), I(), document.addEventListener("scroll", L, !0);
	}), re(() => {
		document.removeEventListener("scroll", L, !0);
	}), V(d, (e, t) => {
		e != t && e != d.value && D(e), e && (n.value = b(d.value));
	}), V(n, () => t("qInput", n.value || "")), {
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
		openResults: A,
		closeResults: j,
		closeGently: M,
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
			let r = L("click-outside");
			return M(), x(g, null, [U(S("input", te({
				class: "rg-autocomplete",
				autocomplete: "__away",
				type: "text"
			}, t.$attrs, {
				"onUpdate:modelValue": n[0] ||= (e) => ee(a) ? a.value = e : null,
				onInput: n[1] ||= (...e) => B(_) && B(_)(...e),
				onFocus: E,
				onDblclick: O,
				onBlur: D,
				onChange: n[2] ||= (...e) => B(v) && B(v)(...e),
				onKeydown: [
					n[3] ||= W((e) => B(h)(1), ["down"]),
					n[4] ||= W((e) => B(h)(-1), ["up"]),
					n[5] ||= W(G((e) => B(y)(B(o), B(s)), ["prevent"]), ["enter"])
				],
				ref_key: "inputEl",
				ref: u
			}), null, 16), [[oe, B(a)]]), U((M(), x("div", {
				class: A(["autocomplete-items bg-white border", e.resultClass]),
				style: j(B(d))
			}, [S("div", { class: A(["list-group", e.itemsClass]) }, [U(S("div", me, "Loading...", 512), [[se, B(f)]]), (M(!0), x(g, null, P(B(c), (n, r) => (M(), x("div", {
				key: r,
				onClick: (e) => B(y)(n, r),
				class: A(["autocomplete-item list-group-item list-group-item-action", [e.itemClass, { "bg-light": r == B(s) }]])
			}, [F(t.$slots, "default", {
				item: n,
				q: B(a)
			}, () => [S("div", null, [(M(!0), x(g, null, P(T(n), (e, t) => (M(), x(g, { key: t }, [e.match ? (M(), x("strong", ge, z(e.text), 1)) : (M(), x(g, { key: 1 }, [C(z(e.text), 1)], 64))], 64))), 128))])])], 10, he))), 128))], 2)], 6)), [[r, k]])], 64);
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
	setup(e, { emit: t }) {
		let n = t, r = l(), i = N(!1);
		function a() {
			n("confirm"), c();
		}
		function o() {
			n("open"), i.value = !0;
		}
		function s() {
			n("cancel"), c();
		}
		function c() {
			n("close"), i.value = !1;
		}
		return (t, n) => (M(), x("button", {
			type: "button",
			class: "rg-confirm-button btn",
			name: e.icon,
			onClick: o
		}, [F(t.$slots, "button-content", {}, () => [e.icon == null ? b("", !0) : (M(), y(u, {
			key: 0,
			name: e.icon
		}, null, 8, ["name"])), e.buttonLabel ? (M(), x("span", be, z(e.buttonLabel), 1)) : b("", !0)]), (M(), y(_, { to: "#modals" }, [F(t.$slots, "modal", {}, () => [(M(), y(R(B(r)), {
			"is-visible": i.value,
			type: e.modalType,
			title: e.modalTitle,
			onSubmit: a,
			onCancel: s,
			onClose: c
		}, {
			default: H(() => [F(t.$slots, "default")]),
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
		return (e, t) => (M(), x("a", {
			class: "rg-anchor",
			href: a.value
		}, [F(e.$slots, "default")], 8, Se));
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
		return (t, n) => (M(), x("input", {
			type: "date",
			class: A(["rg-date-input form-control", { "is-invalid": a.value && !i.value }]),
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
		return (t, n) => (M(), x("small", { class: A(["rg-form-label form-text text-muted", e.autoHide ? "d-none d-md-inline" : "d-inline"]) }, z(e.label), 3));
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
		return (n, r) => (M(), x("div", ke, [U(S("textarea", {
			"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
			readonly: e.readonly,
			class: "form-control",
			rows: "3"
		}, null, 8, Ae), [[oe, t.value]]), e.label ? (M(), y(Oe, {
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
		return (t, n) => (M(), x("div", Me, [
			e.readonly ? b("", !0) : (M(), y(d, {
				key: 0,
				type: "submit",
				icon: "save",
				class: "btn-primary",
				disabled: o.value
			}, {
				default: H(() => [S("span", Ne, z(e.labels?.save ?? "Save"), 1)]),
				_: 1
			}, 8, ["disabled"])),
			w(d, {
				type: "button",
				icon: "cancel",
				class: "btn-secondary",
				onClick: n[0] ||= (e) => r("cancel")
			}, {
				default: H(() => [S("span", Pe, z(e.labels?.cancel ?? "Cancel"), 1)]),
				_: 1
			}),
			e.showDelete && !i.value ? (M(), y(xe, {
				key: 1,
				"modal-title": e.modalTitle ?? "Delete?",
				"modal-type": B(c).danger,
				class: "btn-danger",
				disabled: e.readonly || o.value,
				onConfirm: n[1] ||= (e) => r("remove")
			}, {
				"button-content": H(() => [w(u, { name: "delete" }), S("span", Fe, z(e.labels?.delete ?? "Delete"), 1)]),
				default: H(() => [F(t.$slots, "delete", {}, () => [C("Delete " + z(a.value) + "?", 1)])]),
				_: 3
			}, 8, [
				"modal-title",
				"modal-type",
				"disabled"
			])) : b("", !0),
			i.value ? (M(), y(d, {
				key: 2,
				type: "button",
				icon: "restore",
				class: "btn-warning",
				disabled: o.value,
				onClick: n[2] ||= (e) => r("restore")
			}, {
				default: H(() => [S("span", Ie, z(e.labels?.restore ?? "Restore"), 1)]),
				_: 1
			}, 8, ["disabled"])) : b("", !0)
		]));
	}
}), Re = ["checked"], ze = /* @__PURE__ */ T({
	name: "NullableCheckBox",
	props: { modelValue: { type: [
		Boolean,
		String,
		Number
	] } },
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = N(null), a = N(((e) => {
			if (e != null) return typeof e == "string" ? e === "true" ? !0 : e === "false" ? !1 : void 0 : new Boolean(e).valueOf();
		})(r.modelValue)), o = v({
			get() {
				return a.value;
			},
			set(e) {
				a.value = e, n("update:modelValue", e), n("change", { target: i.value });
			}
		}), s = v(() => ({ opacity: o.value == null ? .5 : 1 }));
		function c() {
			o.value = o.value == null ? !0 : o.value ? !1 : void 0;
		}
		return ce(() => i.value && (i.value.indeterminate = o.value === void 0)), (e, t) => (M(), x("input", {
			type: "checkbox",
			class: "rg-nullable-checkbox",
			ref_key: "input",
			ref: i,
			onClick: c,
			"true-value": !0,
			checked: o.value,
			style: j(s.value)
		}, null, 12, Re));
	}
}), Be = /* @__PURE__ */ T({
	__name: "NullableLabel",
	props: { label: {} },
	setup(e) {
		return (t, n) => (M(), x("span", { class: A(["rg-nullable-label", { "italic-muted": !e.label }]) }, [e.label ? (M(), x(g, { key: 0 }, [C(z(e.label), 1)], 64)) : F(t.$slots, "default", { key: 1 })], 2));
	}
}), Ve = { class: "form-section mb-3" }, He = { class: "form-section-title bg-body-secondary rounded-2 px-2 mb-2" }, Ue = { class: "row align-items-center" }, We = { class: "fs-6 fw-semibold py-2 mb-0" }, Ge = { class: "col-auto" }, Ke = /* @__PURE__ */ T({
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
		let n = t, r = e, i = E(), a = N(r.collapsed), o = N(r.readonly || r.showSummary), s = v({
			get: () => !!(i?.slots.summary && (r.readonly || o.value)),
			set: (e) => o.value = !!e
		});
		function c() {
			a.value = !a.value, a.value ? n("collapse") : n("expand");
		}
		return V(() => r.collapsed, () => {
			a.value = r.collapsed, a.value ? n("collapse") : n("expand");
		}), (t, n) => (M(), x("div", Ve, [S("div", He, [F(t.$slots, "header", {
			collapsed: a.value,
			showSummary: s.value
		}, () => [S("div", Ue, [S("div", {
			class: "col",
			onClick: n[0] ||= (e) => s.value = !s.value
		}, [F(t.$slots, "title", { showSummary: s.value }, () => [S("h3", We, z(e.title), 1)])]), S("div", Ge, [!e.readonly && t.$slots.summary ? (M(), x("button", {
			key: 0,
			type: "button",
			class: "btn btn-default my-1 px-2 py-1 opacity-50",
			onClick: n[1] ||= G((e) => s.value = !s.value, ["stop"])
		}, [w(u, { name: s.value ? "look" : "edit" }, null, 8, ["name"])])) : b("", !0), S("button", {
			type: "button",
			class: "btn btn-default my-1 px-2 py-1 opacity-50",
			onClick: G(c, ["stop"])
		}, [w(u, { name: a.value ? "maximize" : "minimize" }, null, 8, ["name"])])])])])]), U(S("div", { class: A(["form-section-body", s.value && e.summaryClass]) }, [
			!t.$slots.summary || !s.value ? F(t.$slots, "default", {
				key: 0,
				collapsed: a.value
			}) : b("", !0),
			t.$slots.summary && s.value ? F(t.$slots, "summary", {
				key: 1,
				collapsed: a.value
			}) : b("", !0),
			F(t.$slots, "always")
		], 2), [[se, !a.value]])]));
	}
}), qe = /* @__PURE__ */ T({
	__name: "FileDropZone",
	emits: ["drop-files"],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = N();
		async function a(e) {
			r("drop-files", [...e.dataTransfer.files]);
		}
		return t({ isDropping: i }), (e, t) => (M(), x("div", {
			class: "rg-file-drop-zone",
			onDrop: G(a, ["prevent"]),
			onDragover: t[0] ||= G((e) => i.value = !0, ["prevent"]),
			onDragleave: t[1] ||= G((e) => i.value = !1, ["prevent"])
		}, [F(e.$slots, "default", { isDropping: i.value })], 32));
	}
}), Je = /* @__PURE__ */ T({
	__name: "CopyToClipboardButton",
	props: /*@__PURE__*/ O({
		value: {},
		timeout: {}
	}, { ...De }),
	setup(e, { expose: t }) {
		let n = e, r = N();
		function i() {
			a(n.value ?? ""), r.value = !0, setTimeout(() => r.value = void 0, n.timeout);
		}
		return t({ success: r }), (e, t) => (M(), y(d, {
			class: "rg-copy-button",
			icon: r.value ? "check" : "copy",
			disabled: r.value,
			onClick: i
		}, null, 8, ["icon", "disabled"]));
	}
}), Ye = ["src"], Xe = /* @__PURE__ */ T({
	__name: "GMap",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = v(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = v(() => `https://maps.google.com/maps?q=${encodeURIComponent(n.value)}&t=&z=${t.zoom || 10}&ie=UTF8&iwloc=&output=embed`);
		return (e, t) => (M(), x("iframe", {
			src: r.value,
			frameborder: "0",
			scrolling: "no",
			marginheight: "0",
			marginwidth: "0",
			allowfullscreen: ""
		}, null, 8, Ye));
	}
}), Ze = ["href"], Qe = /* @__PURE__ */ T({
	__name: "GmapLink",
	props: { modelValue: {} },
	setup(e) {
		let t = e, n = v(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" "));
		return (e, t) => (M(), x("a", { href: `https://www.google.com/maps/?q=${n.value}` }, [w(u, { name: "map" }), F(e.$slots, "default")], 8, Ze));
	}
}), $e = /*#__PURE__*/ p(/* @__PURE__ */ T({
	__name: "ModalButton",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = v(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = l(), i = N(!1);
		return (t, a) => (M(), x("button", {
			type: "button",
			onClick: a[1] ||= (e) => i.value = !0
		}, [F(t.$slots, "default", {}, () => [w(u, { name: "map" })], !0), (M(), y(_, { to: "#modals" }, [(M(), y(R(B(r)), {
			"is-visible": i.value,
			title: n.value,
			"show-footer": !1,
			"full-width": !0,
			onClose: a[0] ||= (e) => i.value = !1
		}, {
			default: H(() => [w(Xe, {
				id: "gmap_canvas",
				modelValue: e.modelValue,
				zoom: e.zoom,
				class: "w-100"
			}, null, 8, ["modelValue", "zoom"])]),
			_: 1
		}, 40, ["is-visible", "title"]))]))]));
	}
}), [["__scopeId", "data-v-4c9ec967"]]), et = ["src"], tt = {
	key: 1,
	class: "rg-loading rg-loading-fallback d-flex justify-content-center",
	role: "status"
}, nt = { class: "visually-hidden" }, K = /* @__PURE__ */ T({
	__name: "Loading",
	setup(e, { expose: t }) {
		let n = D("loadingImg"), r = D("loadingLabel", "Loading…"), i = N(null);
		return t({
			imgEl: i,
			dimensions: () => [i.value?.width, i.value?.height],
			height: () => i.value?.naturalHeight
		}), (e, t) => B(n) ? (M(), x("img", {
			key: 0,
			class: "rg-loading",
			src: B(n),
			ref_key: "imgEl",
			ref: i,
			alt: ""
		}, null, 8, et)) : (M(), x("div", tt, [t[0] ||= S("span", {
			class: "rg-loading-spinner spinner-border text-primary",
			"aria-hidden": "true"
		}, null, -1), S("span", nt, z(B(r)), 1)]));
	}
}), q = Symbol("regira.loading");
function J() {
	return D(q, K);
}
//#endregion
//#region src/vue/ui/loading/LoadingButton.vue?vue&type=script&setup=true&lang.ts
var rt = ["disabled"], it = /* @__PURE__ */ T({
	__name: "LoadingButton",
	props: {
		isLoading: { type: Boolean },
		disabled: { type: Boolean }
	},
	setup(e) {
		let t = J();
		return (n, r) => (M(), x("button", {
			type: "button",
			class: "rg-loading-button btn",
			disabled: e.disabled || e.isLoading
		}, [e.isLoading ? F(n.$slots, "loading", { key: 0 }, () => [(M(), y(R(B(t)), { style: { width: "1rem" } }))]) : F(n.$slots, "default", { key: 1 })], 8, rt));
	}
}), at = /* @__PURE__ */ T({
	__name: "LoadingContainer",
	props: { isLoading: { type: Boolean } },
	setup(e, { expose: t }) {
		let n = J(), r = N(null), i = N(null);
		function a() {
			return i.value?.imgEl?.width;
		}
		return t({
			containerEl: r,
			loadingImgEl: v(() => i.value?.imgEl)
		}), (t, o) => (M(), x("div", {
			class: "rg-loading-container position-relative",
			style: j({ height: e.isLoading ? `${a()}px` : void 0 }),
			ref_key: "containerEl",
			ref: r
		}, [F(t.$slots, "loading", {}, () => [e.isLoading ? (M(), y(R(B(n)), {
			key: 0,
			class: "position-absolute top-0 start-50 translate-middle-x",
			style: {
				width: "20rem",
				"max-width": "100%"
			},
			ref_key: "loadingEl",
			ref: i
		}, null, 512)) : b("", !0)]), S("div", { style: j({ opacity: e.isLoading ? "0.4" : "" }) }, [F(t.$slots, "default")], 4)], 4));
	}
}), ot = { install(e, t = {}) {
	e.provide("loadingImg", t.img);
	let n = t.Loading ?? K;
	e.provide(q, n), f.registerComponentsGlobally && (e.component("Loading", n), e.component("LoadingButton", t.LoadingButton ?? it), e.component("LoadingContainer", t.LoadingContainer ?? at));
} }, st = { PAGESIZE: 10 };
//#endregion
//#region src/vue/ui/screen/screen.ts
function Y() {
	return typeof window > "u" ? [0, 0] : [window.innerWidth, window.innerHeight];
}
var X = {
	xs: 0,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	xxl: 1400
};
function ct(e, t) {
	let n;
	return (...r) => {
		n && clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
var Z;
function Q() {
	if (Z) return Z;
	let e = N(Y()), t = {
		get size() {
			return e.value;
		},
		get isExtraSmall() {
			return this.size[0] >= X.xs;
		},
		get isSmall() {
			return this.size[0] >= X.sm;
		},
		get isMedium() {
			return this.size[0] >= X.md;
		},
		get isLarge() {
			return this.size[0] >= X.lg;
		},
		get isExtraLarge() {
			return this.size[0] >= X.xl;
		},
		get isExtraExtraLarge() {
			return this.size[0] >= X.xxl;
		},
		get layout() {
			return this.isExtraExtraLarge ? "xxl" : this.isExtraLarge ? "xl" : this.isLarge ? "lg" : this.isMedium ? "md" : this.isSmall ? "sm" : "xs";
		},
		isSize(e) {
			return this.size[0] >= X[e];
		},
		updateSize: (t = Y()) => e.value = t
	};
	if (Z = {
		size: e,
		screen: t
	}, typeof window < "u") {
		let e = ct(() => t.updateSize(Y()), 250);
		window.addEventListener("resize", e), window.addEventListener("orientationchange", e);
	}
	return Z;
}
//#endregion
//#region src/vue/ui/screen/plugin.ts
var lt = { install: (e, { sizes: t } = {}) => {
	if (t) for (let e in t) e in X && (X[e] = t[e]);
	let { screen: n } = Q();
	e.config.globalProperties.$screen = n, e.provide("screen", n);
} }, ut = /* @__PURE__ */ function(e) {
	return e.anchor = "Anchor", e.button = "Button", e;
}({}), dt = {
	maxPages: 9,
	buttonType: "Anchor"
};
function ft({ pagingInfo: e, count: t, maxPages: n, emit: r }) {
	let { screen: i } = Q(), a = v(() => i.isSmall ? n : Math.ceil(n / 2)), o = v(() => (isNaN(parseInt(e.value.pageSize + "")) ? void 0 : e.value.pageSize) || st.PAGESIZE), s = le();
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
var pt = /* @__PURE__ */ T({
	__name: "PagingAnchor",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => {
			let r = I("RouterLink");
			return M(), y(r, {
				class: "page-link",
				to: e.to,
				title: "page " + e.page,
				activeClass: "active-page"
			}, {
				default: H(() => [F(t.$slots, "default", {}, () => [C(z(e.page), 1)])]),
				_: 3
			}, 8, ["to", "title"]);
		};
	}
}), mt = ["title"], ht = /* @__PURE__ */ T({
	__name: "PagingButton",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => (M(), x("button", {
			type: "button",
			class: "btn btn-link page-link",
			title: "page " + e.page
		}, [F(t.$slots, "default", {}, () => [C(z(e.page), 1)])], 8, mt));
	}
}), gt = {
	class: "rg-paging",
	"aria-label": "Pagination"
}, _t = { class: "pagination flex-wrap" }, vt = { class: "rg-paging__page page-item" }, yt = { class: "rg-paging__page page-item" }, bt = /* @__PURE__ */ T({
	__name: "Paging",
	props: /*@__PURE__*/ O({
		modelValue: {},
		count: {},
		maxPages: {},
		buttonType: {}
	}, { ...dt }),
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = s(r, n), { count: a } = ie(r), o = r.buttonType == ut.button ? ht : pt, { pagedRoute: c, page: l, totalPages: u, pages: d, handleChangePage: f } = ft({
			pagingInfo: i,
			count: a,
			maxPages: r.maxPages,
			emit: n
		});
		return (e, t) => (M(), x("nav", gt, [S("ul", _t, [
			S("li", vt, [F(e.$slots, "firstPage", { page: 1 }, () => [(M(), y(R(B(o)), {
				page: 1,
				to: B(c)(1),
				onClick: t[0] ||= G((e) => B(f)(1), ["prevent"]),
				"aria-label": "Previous"
			}, {
				default: H(() => [...t[2] ||= [C("«", -1)]]),
				_: 1
			}, 8, ["to"]))])]),
			(M(!0), x(g, null, P(B(d), (t) => (M(), x("li", {
				class: A(["rg-paging__page page-item", { active: t == B(l) }]),
				key: t
			}, [F(e.$slots, "default", {
				page: t,
				route: B(c)(t),
				handleChange: B(f)
			}, () => [(M(), y(R(B(o)), {
				page: t,
				to: B(c)(t),
				onClick: G((e) => B(f)(t), ["prevent"])
			}, {
				default: H(() => [C(z(t), 1)]),
				_: 2
			}, 1032, [
				"page",
				"to",
				"onClick"
			]))])], 2))), 128)),
			S("li", yt, [F(e.$slots, "lastPage", { page: B(u) }, () => [(M(), y(R(B(o)), {
				page: B(u),
				to: B(c)(B(u)),
				onClick: t[1] ||= G((e) => B(f)(B(u)), ["prevent"]),
				"aria-label": "Next"
			}, {
				default: H(() => [...t[3] ||= [C(" » ", -1)]]),
				_: 1
			}, 8, ["page", "to"]))])])
		])]));
	}
}), xt = { class: "result-summary text-muted small" }, St = /* @__PURE__ */ T({
	__name: "ResultSummary",
	props: {
		visibleCount: {},
		totalCount: {}
	},
	setup(e) {
		return (t, n) => (M(), x("span", xt, [F(t.$slots, "default", {
			visibleCount: e.visibleCount,
			totalCount: e.totalCount
		}, () => [C(z(e.visibleCount ?? 0) + " / " + z(e.totalCount ?? 0), 1)])]));
	}
}), Ct = { install(e, { defaultPageSize: t = 10, Paging: n } = {}) {
	st.PAGESIZE = t, f.registerComponentsGlobally && e.component("Paging", n ?? bt);
} }, $ = class e {
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
}, wt = { useRouteNav: !1 }, Tt = ["href", "onClick"], Et = /* @__PURE__ */ T({
	__name: "TabNavigation",
	props: {
		tabs: {},
		activeTab: {}
	},
	emits: ["select"],
	setup(e) {
		let t = v(() => (e) => typeof e.isVisible == "function" ? e.isVisible() : e.isVisible);
		return (n, r) => (M(), x("ul", { class: A(["rg-tab-nav nav", {
			"nav-pills": !n.$screen?.isLarge,
			"nav-tabs": n.$screen?.isLarge
		}]) }, [(M(!0), x(g, null, P(e.tabs, (r) => (M(), x(g, { key: r.key }, [t.value(r) ? (M(), x("li", {
			key: 0,
			class: A(["nav-item", { disabled: r.isDisabled }])
		}, [S("a", {
			href: `#${r.key}`,
			class: A([
				"py-1 px-2",
				"nav-link",
				{
					active: e.activeTab == r.key,
					disabled: r.isDisabled
				}
			]),
			onClick: G((e) => n.$emit("select", r.key), ["prevent"])
		}, [r.icon ? (M(), y(u, {
			key: 0,
			name: r.icon
		}, null, 8, ["name"])) : b("", !0), S("span", { class: A({ "d-none d-lg-inline ms-1": r.icon }) }, z(r.title), 3)], 10, Tt)], 2)) : b("", !0)], 64))), 128))], 2));
	}
}), Dt = { class: "tab-container" }, Ot = {
	key: 0,
	class: "tab-content pt-2"
}, kt = /* @__PURE__ */ T({
	__name: "TabContainer",
	props: /*@__PURE__*/ O({
		tabs: {},
		useRouteNav: { type: Boolean },
		active: {}
	}, { ...wt }),
	emits: ["select"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = le(), a = v(() => r.tabs.filter((e) => e != null).map((e) => e instanceof $ ? e : new $(e))), o = v(() => (a.value.find((e) => e.isDefault) || a.value[0]).key), s = N(r.active), c = v({
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
		return ne(() => {
			s.value == null && r.useRouteNav && l((r.useRouteNav ? i.currentRoute.value.hash?.substring(1) : void 0) || o.value);
		}), (e, t) => (M(), x("div", Dt, [w(Et, {
			tabs: a.value,
			activeTab: c.value,
			onSelect: l
		}, null, 8, ["tabs", "activeTab"]), (M(!0), x(g, null, P(a.value, (t) => (M(), x(g, { key: t.key }, [c.value == t.key ? (M(), x("div", Ot, [F(e.$slots, t.key)])) : b("", !0)], 64))), 128))]));
	}
});
//#endregion
export { De as A, qe as C, Le as D, ze as E, ve as F, _e as I, fe as L, Te as M, Ce as N, je as O, xe as P, pe as R, Je as S, Be as T, J as _, Ct as a, Qe as b, ut as c, lt as d, Q as f, q as g, it as h, $ as i, Ee as j, Oe as k, dt as l, at as m, Et as n, St as o, ot as p, wt as r, bt as s, kt as t, ft as u, K as v, Ke as w, Xe as x, $e as y };
