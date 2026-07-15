import { isEmail as e, isIP as t, isPhone as n } from "../utilities/string-utility.js";
import { debounceToPromise as r } from "../utilities/promise-utility.js";
import { n as i, t as a } from "./clipboard-utility-3.2.5.js";
import { useEventListener as o, useVModelField as s } from "../vue/vue-helper.js";
import { a as c, n as l } from "./modal-3.2.5.js";
import { t as u } from "./Icon-3.2.5.js";
import { t as d } from "./IconButton-3.2.5.js";
import { n as f } from "./ioc-3.2.5.js";
import { t as p } from "./_plugin-vue_export-helper-3.2.5.js";
import { r as m } from "./feedback-3.2.5.js";
import { dateInputString as h } from "../vue/formatters/index.js";
import "./icons-3.2.5.js";
import { Fragment as g, Teleport as _, computed as v, createBlock as y, createCommentVNode as b, createElementBlock as x, createElementVNode as S, createTextVNode as C, createVNode as w, defineComponent as T, getCurrentInstance as E, inject as D, isRef as O, mergeDefaults as k, mergeModels as A, mergeProps as ee, normalizeClass as j, normalizeStyle as M, onMounted as N, onUnmounted as te, openBlock as P, ref as F, renderList as I, renderSlot as L, resolveComponent as R, resolveDirective as z, resolveDynamicComponent as B, toDisplayString as V, toRefs as ne, unref as H, useModel as re, vModelText as ie, vShow as ae, watch as U, watchEffect as oe, withCtx as W, withDirectives as G, withKeys as K, withModifiers as q } from "vue";
import { useRouter as se } from "vue-router";
import { isValid as ce } from "date-fns";
//#region src/vue/ui/autocomplete/autocomplete.ts
var le = {
	data: () => [],
	maxResults: 10,
	debounceTime: 250,
	autoSelect: !1
};
function ue(e, { emit: t }) {
	let n = F(""), a = F(-1), s = F(e.data), c = F(!1), l = F(!1), u = F(!1), d = v({
		get: () => e.modelValue,
		set: (n) => {
			e.modelValue !== n && (t("update:modelValue", n), t("update:idValue", y(n)), t("select", n));
		}
	}), f = v(() => y(d.value)), p = F(), m = F({
		top: 0,
		left: 0
	}), h = F({
		top: 0,
		left: 0
	}), g = F({
		top: 0,
		left: 0
	}), _ = v(() => {
		let { width: e, height: t } = p.value?.getBoundingClientRect() || {
			width: 0,
			height: 0
		};
		return {
			visibility: c.value ? "visible" : "hidden",
			top: `${t}px`,
			left: `${p.value?.offsetLeft || 0}px`,
			width: `${e}px`
		};
	}), y = e.idSelector || ((e) => e), b = e.displayItemFormatter || ((e) => (e ?? "").toString());
	async function x(t = "") {
		return e.data?.filter((e) => b(e).toLowerCase().startsWith(t.toLowerCase()));
	}
	async function S(t = n.value) {
		j(), u.value = !0, s.value = void 0;
		try {
			let n = await L(t), r = e.maxResults || n.length;
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
		k(), S();
	}
	function T() {}
	function E(e, t) {
		M(), D(e, e ? t : -1);
	}
	function D(e, t) {
		if (e == null && t == null) {
			k(), n.value || M();
			return;
		}
		e && (t == null || t < 0) ? t = (s.value || []).indexOf(e) : !e && t >= 0 && (e = s.value[t]), e != null && (a.value = t, d.value = e, n.value = b(d.value));
	}
	function O(e) {
		console.debug("moveSelection", {
			step: e,
			selectedIndex: a.value,
			items: s.value
		});
		let t = a.value + e, n = s.value[t];
		t >= 0 && t < s.value.length && D(n, t);
	}
	function k() {
		a.value = -1, d.value = void 0;
	}
	function A() {
		n.value = "", k(), M();
	}
	function ee(e) {
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
		R(), c.value = !0;
	}
	function M() {
		c.value = !1;
	}
	function P() {
		c.value && setTimeout(() => {
			C(!0), d.value ?? (n.value = ""), M();
		}, 250);
	}
	function I(e) {
		throw e;
	}
	let L = r(e.search || e.data && x || I(/* @__PURE__ */ Error("prop search or data is required")), e.debounceTime), R = () => {
		m.value = ee(p.value), g.value = p.value ? i(p.value) : {
			top: 0,
			left: 0
		};
	}, z = r(R, 50);
	return o(window, "resize", z), N(() => {
		n.value = b(d.value), R(), document.addEventListener("scroll", z, !0);
	}), te(() => {
		document.removeEventListener("scroll", z, !0);
	}), U(d, (e, t) => {
		e != t && e != d.value && D(e), e && (n.value = b(d.value));
	}), U(n, () => t("qInput", n.value || "")), {
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
		closeGently: P,
		moveSelection: O,
		checkMatch: C,
		clearSelection: k,
		reset: A
	};
}
//#endregion
//#region src/vue/ui/autocomplete/Autocomplete.vue?vue&type=script&setup=true&lang.ts
var de = { class: "loading list-group-item" }, fe = ["onClick"], pe = { key: 0 }, me = /* @__PURE__ */ T({
	inheritAttrs: !1,
	inheritAttrs: !1,
	__name: "Autocomplete",
	props: /*@__PURE__*/ k({
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
	}, { ...le }),
	emits: [
		"update:modelValue",
		"update:idValue",
		"select",
		"qInput"
	],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = e, { q: a, selectedItem: o, selectedIndex: s, items: c, isFocus: l, inputEl: u, resultStyle: d, isLoading: f, displayItemFormatter: p, closeGently: m, moveSelection: h, handleInput: _, handleChange: v, handleSelect: y, handleSearch: b, reset: w } = ue(i, { emit: r });
		function T(e) {
			let t = p(e) ?? "", n = a.value?.trim();
			if (!n) return [{
				text: t,
				match: !1
			}];
			let r = t.toLowerCase().indexOf(n.toLowerCase());
			return r < 0 ? [{
				text: t,
				match: !1
			}] : [
				{
					text: t.slice(0, r),
					match: !1
				},
				{
					text: t.slice(r, r + n.length),
					match: !0
				},
				{
					text: t.slice(r + n.length),
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
		function k() {
			i.enableDblClick && b("");
		}
		function A(e) {
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
			let r = z("click-outside");
			return P(), x(g, null, [G(S("input", ee({
				class: "rg-autocomplete",
				autocomplete: "__away",
				type: "text"
			}, t.$attrs, {
				"onUpdate:modelValue": n[0] ||= (e) => O(a) ? a.value = e : null,
				onInput: n[1] ||= (...e) => H(_) && H(_)(...e),
				onFocus: E,
				onDblclick: k,
				onBlur: D,
				onChange: n[2] ||= (...e) => H(v) && H(v)(...e),
				onKeydown: [
					n[3] ||= K((e) => H(h)(1), ["down"]),
					n[4] ||= K((e) => H(h)(-1), ["up"]),
					n[5] ||= K(q((e) => H(y)(H(o), H(s)), ["prevent"]), ["enter"])
				],
				ref_key: "inputEl",
				ref: u
			}), null, 16), [[ie, H(a)]]), G((P(), x("div", {
				class: j(["autocomplete-items bg-white border", e.resultClass]),
				style: M(H(d))
			}, [S("div", { class: j(["list-group", e.itemsClass]) }, [G(S("div", de, "Loading...", 512), [[ae, H(f)]]), (P(!0), x(g, null, I(H(c), (n, r) => (P(), x("div", {
				key: r,
				onClick: (e) => H(y)(n, r),
				class: j(["autocomplete-item list-group-item list-group-item-action", [e.itemClass, { "bg-light": r == H(s) }]])
			}, [L(t.$slots, "default", {
				item: n,
				q: H(a)
			}, () => [S("div", null, [(P(!0), x(g, null, I(T(n), (e, t) => (P(), x(g, { key: t }, [e.match ? (P(), x("strong", pe, V(e.text), 1)) : (P(), x(g, { key: 1 }, [C(V(e.text), 1)], 64))], 64))), 128))])])], 10, fe))), 128))], 2)], 6)), [[r, A]])], 64);
		};
	}
}), he = {
	icon: "warning",
	modalTitle: "Sure?",
	modalType: c.warning
}, ge = ["name"], _e = {
	key: 1,
	class: "ms-1"
}, ve = /* @__PURE__ */ T({
	__name: "ConfirmButton",
	props: /*@__PURE__*/ k({
		icon: {},
		buttonLabel: {},
		modalTitle: {},
		modalType: {}
	}, { ...he }),
	emits: [
		"confirm",
		"cancel",
		"open",
		"close"
	],
	setup(e, { emit: t }) {
		let n = t, r = l(), i = F(!1);
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
		return (t, n) => (P(), x("button", {
			type: "button",
			class: "rg-confirm-button btn",
			name: e.icon,
			onClick: o
		}, [L(t.$slots, "button-content", {}, () => [e.icon == null ? b("", !0) : (P(), y(u, {
			key: 0,
			name: e.icon
		}, null, 8, ["name"])), e.buttonLabel ? (P(), x("span", _e, V(e.buttonLabel), 1)) : b("", !0)]), (P(), y(_, { to: "#modals" }, [L(t.$slots, "modal", {}, () => [(P(), y(B(H(r)), {
			"is-visible": i.value,
			type: e.modalType,
			title: e.modalTitle,
			onSubmit: a,
			onCancel: s,
			onClose: c
		}, {
			default: W(() => [L(t.$slots, "default")]),
			_: 3
		}, 40, [
			"is-visible",
			"type",
			"title"
		]))])]))], 8, ge));
	}
}), ye = ["href"], be = /* @__PURE__ */ T({
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
		return (e, t) => (P(), x("a", {
			class: "rg-anchor",
			href: a.value
		}, [L(e.$slots, "default")], 8, ye));
	}
}), xe = ["value", "lang"], Se = /* @__PURE__ */ T({
	__name: "DateInput",
	props: {
		modelValue: {},
		culture: {}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = v(() => ce(new Date(r.modelValue || ""))), a = v(() => i.value ? h(new Date(r.modelValue)) : r.modelValue), o = (e) => {
			let t = new Date(e.target.value);
			(!e.target.value || ce(t)) && n("update:modelValue", t || e.target.value);
		};
		return (t, n) => (P(), x("input", {
			type: "date",
			class: j(["rg-date-input form-control", { "is-invalid": a.value && !i.value }]),
			value: a.value,
			onChange: o,
			lang: e.culture
		}, null, 42, xe));
	}
}), Ce = { autoHide: !1 }, we = { timeout: 2500 }, Te = /* @__PURE__ */ T({
	__name: "FormLabel",
	props: /*@__PURE__*/ k({
		label: {},
		autoHide: { type: Boolean }
	}, { ...Ce }),
	setup(e) {
		return (t, n) => (P(), x("small", { class: j(["rg-form-label form-text text-muted", e.autoHide ? "d-none d-md-inline" : "d-inline"]) }, V(e.label), 3));
	}
}), Ee = { class: "description-input" }, De = ["readonly"], Oe = /* @__PURE__ */ T({
	__name: "DescriptionInput",
	props: /*@__PURE__*/ A({
		label: {},
		readonly: { type: Boolean }
	}, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = re(e, "modelValue");
		return (n, r) => (P(), x("div", Ee, [G(S("textarea", {
			"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
			readonly: e.readonly,
			class: "form-control",
			rows: "3"
		}, null, 8, De), [[ie, t.value]]), e.label ? (P(), y(Te, {
			key: 0,
			label: e.label
		}, null, 8, ["label"])) : b("", !0)]));
	}
}), ke = { class: "form-buttons d-flex flex-wrap gap-2" }, Ae = { class: "d-none d-md-inline ms-1" }, je = { class: "d-none d-md-inline ms-1" }, Me = { class: "d-none d-md-inline ms-1" }, Ne = { class: "d-none d-md-inline ms-1" }, Pe = /* @__PURE__ */ T({
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
		return (t, n) => (P(), x("div", ke, [
			e.readonly ? b("", !0) : (P(), y(d, {
				key: 0,
				type: "submit",
				icon: "save",
				class: "btn-primary",
				disabled: o.value
			}, {
				default: W(() => [S("span", Ae, V(e.labels?.save ?? "Save"), 1)]),
				_: 1
			}, 8, ["disabled"])),
			w(d, {
				type: "button",
				icon: "cancel",
				class: "btn-secondary",
				onClick: n[0] ||= (e) => r("cancel")
			}, {
				default: W(() => [S("span", je, V(e.labels?.cancel ?? "Cancel"), 1)]),
				_: 1
			}),
			e.showDelete && !i.value ? (P(), y(ve, {
				key: 1,
				"modal-title": e.modalTitle ?? "Delete?",
				"modal-type": H(c).danger,
				class: "btn-danger",
				disabled: e.readonly || o.value,
				onConfirm: n[1] ||= (e) => r("remove")
			}, {
				"button-content": W(() => [w(u, { name: "delete" }), S("span", Me, V(e.labels?.delete ?? "Delete"), 1)]),
				default: W(() => [L(t.$slots, "delete", {}, () => [C("Delete " + V(a.value) + "?", 1)])]),
				_: 3
			}, 8, [
				"modal-title",
				"modal-type",
				"disabled"
			])) : b("", !0),
			i.value ? (P(), y(d, {
				key: 2,
				type: "button",
				icon: "restore",
				class: "btn-warning",
				disabled: o.value,
				onClick: n[2] ||= (e) => r("restore")
			}, {
				default: W(() => [S("span", Ne, V(e.labels?.restore ?? "Restore"), 1)]),
				_: 1
			}, 8, ["disabled"])) : b("", !0)
		]));
	}
}), Fe = ["checked"], Ie = /* @__PURE__ */ T({
	name: "NullableCheckBox",
	props: { modelValue: { type: [
		Boolean,
		String,
		Number
	] } },
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = F(null), a = F(((e) => {
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
		return oe(() => i.value && (i.value.indeterminate = o.value === void 0)), (e, t) => (P(), x("input", {
			type: "checkbox",
			class: "rg-nullable-checkbox",
			ref_key: "input",
			ref: i,
			onClick: c,
			"true-value": !0,
			checked: o.value,
			style: M(s.value)
		}, null, 12, Fe));
	}
}), Le = /* @__PURE__ */ T({
	__name: "NullableLabel",
	props: { label: {} },
	setup(e) {
		return (t, n) => (P(), x("span", { class: j(["rg-nullable-label", { "italic-muted": !e.label }]) }, [e.label ? (P(), x(g, { key: 0 }, [C(V(e.label), 1)], 64)) : L(t.$slots, "default", { key: 1 })], 2));
	}
}), Re = { class: "form-section" }, ze = { class: "form-section-title" }, Be = { class: "row" }, Ve = { class: "p-2 mb-2" }, He = { class: "col-auto" }, Ue = /* @__PURE__ */ T({
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
		let n = t, r = e, i = E(), a = F(r.collapsed), o = F(r.readonly || r.showSummary), s = v({
			get: () => !!(i?.slots.summary && (r.readonly || o.value)),
			set: (e) => o.value = !!e
		});
		function c() {
			a.value = !a.value, a.value ? n("collapse") : n("expand");
		}
		return U(() => r.collapsed, () => {
			a.value = r.collapsed, a.value ? n("collapse") : n("expand");
		}), (t, n) => (P(), x("div", Re, [S("div", ze, [L(t.$slots, "header", {
			collapsed: a.value,
			showSummary: s.value
		}, () => [S("div", Be, [S("div", {
			class: "col",
			onClick: n[0] ||= (e) => s.value = !s.value
		}, [L(t.$slots, "title", { showSummary: s.value }, () => [S("h3", Ve, V(e.title), 1)])]), S("div", He, [!e.readonly && t.$slots.summary ? (P(), x("button", {
			key: 0,
			type: "button",
			class: "btn btn-default my-2 px-2 py-1 opacity-50",
			onClick: n[1] ||= q((e) => s.value = !s.value, ["stop"])
		}, [w(u, { name: s.value ? "look" : "edit" }, null, 8, ["name"])])) : b("", !0), S("button", {
			type: "button",
			class: "btn btn-default my-2 px-2 py-1 opacity-50",
			onClick: q(c, ["stop"])
		}, [w(u, { name: a.value ? "maximize" : "minimize" }, null, 8, ["name"])])])])])]), G(S("div", { class: j(["form-section-body", s.value && e.summaryClass]) }, [
			!t.$slots.summary || !s.value ? L(t.$slots, "default", {
				key: 0,
				collapsed: a.value
			}) : b("", !0),
			t.$slots.summary && s.value ? L(t.$slots, "summary", {
				key: 1,
				collapsed: a.value
			}) : b("", !0),
			L(t.$slots, "always")
		], 2), [[ae, !a.value]])]));
	}
}), We = /* @__PURE__ */ T({
	__name: "FileDropZone",
	emits: ["drop-files"],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = F();
		async function a(e) {
			r("drop-files", [...e.dataTransfer.files]);
		}
		return t({ isDropping: i }), (e, t) => (P(), x("div", {
			class: "rg-file-drop-zone",
			onDrop: q(a, ["prevent"]),
			onDragover: t[0] ||= q((e) => i.value = !0, ["prevent"]),
			onDragleave: t[1] ||= q((e) => i.value = !1, ["prevent"])
		}, [L(e.$slots, "default", { isDropping: i.value })], 32));
	}
}), Ge = /* @__PURE__ */ T({
	__name: "CopyToClipboardButton",
	props: /*@__PURE__*/ k({
		value: {},
		timeout: {}
	}, { ...we }),
	setup(e, { expose: t }) {
		let n = e, r = F();
		function i() {
			a(n.value ?? ""), r.value = !0, setTimeout(() => r.value = void 0, n.timeout);
		}
		return t({ success: r }), (e, t) => (P(), y(d, {
			class: "rg-copy-button",
			icon: r.value ? "check" : "copy",
			disabled: r.value,
			onClick: i
		}, null, 8, ["icon", "disabled"]));
	}
}), Ke = ["src"], qe = /* @__PURE__ */ T({
	__name: "GMap",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = v(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = v(() => `https://maps.google.com/maps?q=${encodeURIComponent(n.value)}&t=&z=${t.zoom || 10}&ie=UTF8&iwloc=&output=embed`);
		return (e, t) => (P(), x("iframe", {
			src: r.value,
			frameborder: "0",
			scrolling: "no",
			marginheight: "0",
			marginwidth: "0",
			allowfullscreen: ""
		}, null, 8, Ke));
	}
}), Je = ["href"], Ye = /* @__PURE__ */ T({
	__name: "GmapLink",
	props: { modelValue: {} },
	setup(e) {
		let t = e, n = v(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" "));
		return (e, t) => (P(), x("a", { href: `https://www.google.com/maps/?q=${n.value}` }, [w(u, { name: "map" }), L(e.$slots, "default")], 8, Je));
	}
}), Xe = /*#__PURE__*/ p(/* @__PURE__ */ T({
	__name: "ModalButton",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = v(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = l(), i = F(!1);
		return (t, a) => (P(), x("button", {
			type: "button",
			onClick: a[1] ||= (e) => i.value = !0
		}, [L(t.$slots, "default", {}, () => [w(u, { name: "map" })], !0), (P(), y(_, { to: "#modals" }, [(P(), y(B(H(r)), {
			"is-visible": i.value,
			title: n.value,
			"show-footer": !1,
			"full-width": !0,
			onClose: a[0] ||= (e) => i.value = !1
		}, {
			default: W(() => [w(qe, {
				id: "gmap_canvas",
				modelValue: e.modelValue,
				zoom: e.zoom,
				class: "w-100"
			}, null, 8, ["modelValue", "zoom"])]),
			_: 1
		}, 40, ["is-visible", "title"]))]))]));
	}
}), [["__scopeId", "data-v-55a219f6"]]), Ze = ["src"], J = /* @__PURE__ */ T({
	__name: "Loading",
	setup(e, { expose: t }) {
		let n = D("loadingImg"), r = F(null);
		return t({
			imgEl: r,
			dimensions: () => [r.value?.width, r.value?.height],
			height: () => r.value?.naturalHeight
		}), (e, t) => (P(), x("img", {
			class: "rg-loading",
			src: H(n),
			ref_key: "imgEl",
			ref: r
		}, null, 8, Ze));
	}
}), Qe = ["disabled"], $e = /* @__PURE__ */ T({
	__name: "LoadingButton",
	props: {
		isLoading: { type: Boolean },
		disabled: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (P(), x("button", {
			type: "button",
			class: "rg-loading-button btn",
			disabled: e.disabled || e.isLoading
		}, [e.isLoading ? L(t.$slots, "loading", { key: 0 }, () => [w(J, { style: { width: "1rem" } })]) : L(t.$slots, "default", { key: 1 })], 8, Qe));
	}
}), et = /* @__PURE__ */ T({
	__name: "LoadingContainer",
	props: { isLoading: { type: Boolean } },
	setup(e, { expose: t }) {
		let n = F(null), r = F(null);
		function i() {
			return r.value?.imgEl?.width;
		}
		return t({
			containerEl: n,
			loadingImgEl: r.value?.imgEl
		}), (t, a) => (P(), x("div", {
			class: "rg-loading-container position-relative",
			style: M({ height: e.isLoading ? `${i()}px` : void 0 }),
			ref_key: "containerEl",
			ref: n
		}, [L(t.$slots, "loading", {}, () => [e.isLoading ? (P(), y(J, {
			key: 0,
			class: "position-absolute top-0 start-50 translate-middle-x",
			style: {
				width: "20rem",
				"max-width": "100%"
			},
			ref_key: "loadingEl",
			ref: r
		}, null, 512)) : b("", !0)]), S("div", { style: M({ opacity: e.isLoading ? "0.4" : "" }) }, [L(t.$slots, "default")], 4)], 4));
	}
}), tt = { install(e, t) {
	e.provide("loadingImg", t.img), f.registerComponentsGlobally && (e.component("Loading", J), e.component("LoadingButton", $e), e.component("LoadingContainer", et));
} }, nt = { PAGESIZE: 10 }, rt = /* @__PURE__ */ function(e) {
	return e.anchor = "Anchor", e.button = "Button", e;
}({}), it = {
	maxPages: 9,
	buttonType: "Anchor"
};
function at({ pagingInfo: e, count: t, maxPages: n, emit: r }) {
	n = window.innerWidth < 576 ? Math.ceil(n / 2) : n;
	let i = v(() => (isNaN(parseInt(e.value.pageSize + "")) ? null : e.value.pageSize) || nt.PAGESIZE), a = se();
	function o(e) {
		let { name: t, path: n, hash: r, query: i } = a.currentRoute.value, o = {
			name: t,
			path: n,
			hash: r,
			query: i
		}, s = {
			name: o.name || void 0,
			query: {
				...o.query,
				page: e
			}
		};
		return e <= 1 && delete s.query.p, a.resolve(s).fullPath;
	}
	let s = v(() => e.value.page || 1), c = v(() => Math.ceil(t.value / i.value)), l = v(() => Math.min(c.value, n)), u = v(() => {
		let e = Math.floor(l.value / 2), t = Math.max(s.value - e, 1);
		return t + n > c.value && (t -= t + n - c.value - 1), Math.max(t, 1);
	}), d = v(() => Math.min(u.value + l.value, c.value)), f = v(() => !isNaN(l.value) && l.value > 0 ? Array(l.value).fill(0).map((e, t) => u.value + t).filter((e) => e <= d.value) : []);
	function p(t) {
		let n = {
			...e.value,
			page: t
		};
		r("update:modelValue", n), r("change", n);
	}
	return {
		pagedRoute: o,
		page: s,
		totalPages: c,
		totalVisiblePages: l,
		firstPage: u,
		lastPage: d,
		pages: f,
		handleChangePage: p
	};
}
//#endregion
//#region src/vue/ui/paging/PagingAnchor.vue
var ot = /* @__PURE__ */ T({
	__name: "PagingAnchor",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => {
			let r = R("RouterLink");
			return P(), y(r, {
				class: "page-link",
				to: e.to,
				title: "page " + e.page,
				activeClass: "active-page"
			}, {
				default: W(() => [L(t.$slots, "default", {}, () => [C(V(e.page), 1)])]),
				_: 3
			}, 8, ["to", "title"]);
		};
	}
}), st = ["title"], ct = /* @__PURE__ */ T({
	__name: "PagingButton",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => (P(), x("button", {
			type: "button",
			class: "btn btn-link page-link",
			title: "page " + e.page
		}, [L(t.$slots, "default", {}, () => [C(V(e.page), 1)])], 8, st));
	}
}), lt = {
	class: "rg-paging",
	"aria-label": "Pagination"
}, ut = { class: "pagination" }, dt = { class: "rg-paging__page page-item" }, ft = { class: "rg-paging__page page-item" }, pt = /* @__PURE__ */ T({
	__name: "Paging",
	props: /*@__PURE__*/ k({
		modelValue: {},
		count: {},
		maxPages: {},
		buttonType: {}
	}, { ...it }),
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = s(r, n), { count: a } = ne(r), o = r.buttonType == rt.button ? ct : ot, { pagedRoute: c, page: l, totalPages: u, pages: d, handleChangePage: f } = at({
			pagingInfo: i,
			count: a,
			maxPages: r.maxPages,
			emit: n
		});
		return (e, t) => (P(), x("nav", lt, [S("ul", ut, [
			S("li", dt, [L(e.$slots, "firstPage", { page: 1 }, () => [(P(), y(B(H(o)), {
				page: 1,
				to: H(c)(1),
				onClick: t[0] ||= q((e) => H(f)(1), ["prevent"]),
				"aria-label": "Previous"
			}, {
				default: W(() => [...t[2] ||= [C("«", -1)]]),
				_: 1
			}, 8, ["to"]))])]),
			(P(!0), x(g, null, I(H(d), (t) => (P(), x("li", {
				class: j(["rg-paging__page page-item", { active: t == H(l) }]),
				key: t
			}, [L(e.$slots, "default", {
				page: t,
				route: H(c)(t),
				handleChange: H(f)
			}, () => [(P(), y(B(H(o)), {
				page: t,
				to: H(c)(t),
				onClick: q((e) => H(f)(t), ["prevent"])
			}, {
				default: W(() => [C(V(t), 1)]),
				_: 2
			}, 1032, [
				"page",
				"to",
				"onClick"
			]))])], 2))), 128)),
			S("li", ft, [L(e.$slots, "lastPage", { page: H(u) }, () => [(P(), y(B(H(o)), {
				page: H(u),
				to: H(c)(H(u)),
				onClick: t[1] ||= q((e) => H(f)(H(u)), ["prevent"]),
				"aria-label": "Next"
			}, {
				default: W(() => [...t[3] ||= [C(" » ", -1)]]),
				_: 1
			}, 8, ["page", "to"]))])])
		])]));
	}
}), mt = { class: "result-summary text-muted small" }, ht = /* @__PURE__ */ T({
	__name: "ResultSummary",
	props: {
		visibleCount: {},
		totalCount: {}
	},
	setup(e) {
		return (t, n) => (P(), x("span", mt, [L(t.$slots, "default", {
			visibleCount: e.visibleCount,
			totalCount: e.totalCount
		}, () => [C(V(e.visibleCount ?? 0) + " / " + V(e.totalCount ?? 0), 1)])]));
	}
}), gt = { install(e, { defaultPageSize: t = 10 } = {}) {
	nt.PAGESIZE = t, f.registerComponentsGlobally && e.component("Paging", pt);
} };
//#endregion
//#region src/vue/ui/screen/screen.ts
function Y() {
	return [window.innerWidth, window.innerHeight];
}
var X = {
	xs: 0,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	xxl: 1400
};
function _t() {
	let e = F(Y());
	return {
		size: e,
		screen: {
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
		}
	};
}
//#endregion
//#region src/vue/ui/screen/plugin.ts
function vt(e, t) {
	let n;
	return (...r) => {
		n && clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
var yt = { install: (e, { sizes: t } = {}) => {
	if (t) for (let e in t) e in X && (X[e] = t[e]);
	let { screen: n } = _t(), r = vt(() => n.updateSize(Y()), 250);
	window.addEventListener("resize", r), window.addEventListener("orientationchange", r), e.config.globalProperties.$screen = n, e.provide("screen", n);
} }, Z = class e {
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
}, Q = { useRouteNav: !1 }, bt = ["href", "onClick"], $ = /* @__PURE__ */ T({
	__name: "TabNavigation",
	props: {
		tabs: {},
		activeTab: {}
	},
	emits: ["select"],
	setup(e) {
		let t = v(() => (e) => typeof e.isVisible == "function" ? e.isVisible() : e.isVisible);
		return (n, r) => (P(), x("ul", { class: j(["rg-tab-nav nav", {
			"nav-pills": !n.$screen?.isLarge,
			"nav-tabs": n.$screen?.isLarge
		}]) }, [(P(!0), x(g, null, I(e.tabs, (r) => (P(), x(g, { key: r.key }, [t.value(r) ? (P(), x("li", {
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
			onClick: q((e) => n.$emit("select", r.key), ["prevent"])
		}, [r.icon ? (P(), y(u, {
			key: 0,
			name: r.icon
		}, null, 8, ["name"])) : b("", !0), S("span", { class: j({ "d-none d-lg-inline ms-1": r.icon }) }, V(r.title), 3)], 10, bt)], 2)) : b("", !0)], 64))), 128))], 2));
	}
}), xt = { class: "tab-container" }, St = {
	key: 0,
	class: "tab-content pt-2"
}, Ct = /* @__PURE__ */ T({
	__name: "TabContainer",
	props: /*@__PURE__*/ k({
		tabs: {},
		useRouteNav: { type: Boolean },
		active: {}
	}, { ...Q }),
	emits: ["select"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = se(), a = v(() => r.tabs.filter((e) => e != null).map((e) => e instanceof Z ? e : new Z(e))), o = v(() => (a.value.find((e) => e.isDefault) || a.value[0]).key), s = F(r.active), c = v({
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
		return N(() => {
			s.value == null && r.useRouteNav && l((r.useRouteNav ? i.currentRoute.value.hash?.substring(1) : null) || o.value);
		}), (e, t) => (P(), x("div", xt, [w($, {
			tabs: a.value,
			activeTab: c.value,
			onSelect: l
		}, null, 8, ["tabs", "activeTab"]), (P(!0), x(g, null, I(a.value, (t) => (P(), x(g, { key: t.key }, [c.value == t.key ? (P(), x("div", St, [L(e.$slots, t.key)])) : b("", !0)], 64))), 128))]));
	}
});
//#endregion
export { be as A, Ie as C, we as D, Te as E, ue as F, he as M, me as N, Ce as O, le as P, Le as S, Oe as T, Ye as _, yt as a, We as b, ht as c, it as d, at as f, Xe as g, J as h, Z as i, ve as j, Se as k, pt as l, et as m, $ as n, _t as o, tt as p, Q as r, gt as s, Ct as t, rt as u, qe as v, Pe as w, Ue as x, Ge as y };
