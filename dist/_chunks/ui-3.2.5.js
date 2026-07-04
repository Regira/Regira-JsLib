import { isEmail as e, isIP as t, isPhone as n } from "../utilities/string-utility.js";
import { debounceToPromise as r } from "../utilities/promise-utility.js";
import { n as i, t as a } from "./clipboard-utility-3.2.5.js";
import { useEventListener as o, useVModelField as s } from "../vue/vue-helper.js";
import { n as c, t as l } from "./DefaultModal-3.2.5.js";
import { t as u } from "./Icon-3.2.5.js";
import { t as d } from "./IconButton-3.2.5.js";
import { t as f } from "./_plugin-vue_export-helper-3.2.5.js";
import { n as p } from "./ioc-3.2.5.js";
import "./feedback-3.2.5.js";
import "./modal-3.2.5.js";
import { dateInputString as m } from "../vue/formatters/index.js";
import "./icons-3.2.5.js";
import { Fragment as h, Teleport as g, computed as _, createBlock as v, createCommentVNode as y, createElementBlock as b, createElementVNode as x, createTextVNode as S, createVNode as C, defineComponent as w, getCurrentInstance as T, inject as E, isRef as D, mergeDefaults as O, mergeModels as k, mergeProps as A, normalizeClass as j, normalizeStyle as M, onMounted as N, onUnmounted as ee, openBlock as P, ref as F, renderList as I, renderSlot as L, resolveComponent as R, resolveDirective as z, resolveDynamicComponent as B, toDisplayString as V, toRefs as te, unref as H, useModel as ne, vModelText as U, vShow as W, watch as G, watchEffect as re, withCtx as K, withDirectives as q, withKeys as J, withModifiers as Y } from "vue";
import { useRouter as ie } from "vue-router";
import { isValid as ae } from "date-fns";
//#region src/vue/ui/autocomplete/autocomplete.ts
var oe = [
	"update:modelValue",
	"update:idValue",
	"select",
	"qInput"
], se = {
	idValue: [String, Number],
	modelValue: { required: !1 },
	data: {
		type: Array,
		default: () => []
	},
	search: Function,
	idSelector: Function,
	displayItemFormatter: Function,
	resultItemFormatter: Function,
	enableDblClick: {
		type: Boolean,
		default: !1
	},
	resultClass: {
		type: String,
		default: ""
	},
	itemsClass: {
		type: String,
		default: ""
	},
	itemClass: {
		type: String,
		default: ""
	},
	maxResults: {
		type: Number,
		default: 10
	},
	debounceTime: {
		type: Number,
		defaults: 250
	}
}, ce = {
	data: () => [],
	maxResults: 10,
	debounceTime: 250,
	autoSelect: !1
};
function le(e, { emit: t }) {
	let n = F(""), a = F(-1), s = F(e.data), c = F(!1), l = F(!1), u = F(!1), d = _({
		get: () => e.modelValue,
		set: (n) => {
			e.modelValue !== n && (t("update:modelValue", n), t("update:idValue", y(n)), t("select", n));
		}
	}), f = _(() => y(d.value)), p = F(), m = F({
		top: 0,
		left: 0
	}), h = F({
		top: 0,
		left: 0
	}), g = F({
		top: 0,
		left: 0
	}), v = _(() => {
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
	}), y = e.idSelector || ((e) => e), b = e.resultItemFormatter || ((e, t) => (e || "").toString()), x = e.displayItemFormatter || b;
	async function S(t = "") {
		return e.data?.filter((e) => b(e, n.value).toLowerCase().startsWith(t.toLowerCase()));
	}
	async function C(t = n.value) {
		P(), u.value = !0, s.value = void 0;
		try {
			let n = await z(t), r = e.maxResults || n.length;
			s.value = n.slice(0, r), a.value = s.value?.findIndex((e) => y(e) == y(d.value));
		} finally {
			u.value = !1;
		}
	}
	function w(t = !1) {
		if (d.value == null && s.value) {
			let r = s.value?.filter((e) => (x(e)?.toString() || "").toLowerCase() === n.value?.toLowerCase());
			r.length == 1 ? O(r[0]) : t && e.autoSelect && O(s.value[0]);
		}
	}
	function T() {
		A(), C();
	}
	function E() {}
	function D(e, t) {
		I(), O(e, e ? t : -1);
	}
	function O(e, t) {
		if (e == null && t == null) {
			A(), n.value || I();
			return;
		}
		e && (t == null || t < 0) ? t = (s.value || []).indexOf(e) : !e && t >= 0 && (e = s.value[t]), e != null && (a.value = t, d.value = e, n.value = x(d.value));
	}
	function k(e) {
		console.debug("moveSelection", {
			step: e,
			selectedIndex: a.value,
			items: s.value
		});
		let t = a.value + e, n = s.value[t];
		t >= 0 && t < s.value.length && O(n, t);
	}
	function A() {
		a.value = -1, d.value = void 0;
	}
	function j() {
		n.value = "", A(), I();
	}
	function M(e) {
		let t = 0, n = 0;
		do
			t += e?.offsetTop || 0, n += e?.offsetLeft || 0, e = e?.offsetParent;
		while (e);
		return {
			top: t,
			left: n
		};
	}
	function P() {
		B(), c.value = !0;
	}
	function I() {
		c.value = !1;
	}
	function L() {
		c.value && setTimeout(() => {
			w(!0), d.value ?? (n.value = ""), I();
		}, 250);
	}
	function R(e) {
		throw e;
	}
	let z = r(e.search || e.data && S || R(/* @__PURE__ */ Error("prop search or data is required")), e.debounceTime), B = () => {
		m.value = M(p.value), g.value = p.value ? i(p.value) : {
			top: 0,
			left: 0
		};
	}, V = r(B, 50);
	return o(window, "resize", V), N(() => {
		n.value = x(d.value), B(), document.addEventListener("scroll", V, !0);
	}), ee(() => {
		document.removeEventListener("scroll", V, !0);
	}), G(d, (e, t) => {
		e != t && e != d.value && O(e), e && (n.value = x(d.value));
	}), G(n, () => t("qInput", n.value || "")), {
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
		resultStyle: v,
		displayItemFormatter: x,
		resultItemFormatter: b,
		handleInput: T,
		handleChange: E,
		handleSelect: D,
		handleSearch: C,
		openResults: P,
		closeResults: I,
		closeGently: L,
		moveSelection: k,
		checkMatch: w,
		clearSelection: A,
		reset: j
	};
}
//#endregion
//#region src/vue/ui/autocomplete/Autocomplete.vue?vue&type=script&setup=true&lang.ts
var ue = { class: "loading list-group-item" }, de = ["onClick"], fe = ["innerHTML"], pe = /* @__PURE__ */ w({
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
		displayItemFormatter: { type: Function },
		resultItemFormatter: { type: Function }
	}, { ...ce }),
	emits: oe,
	setup(e, { expose: t, emit: n }) {
		let r = n, i = e, { q: a, selectedItem: o, selectedIndex: s, items: c, isFocus: l, inputEl: u, resultStyle: d, isLoading: f, resultItemFormatter: p, closeGently: m, moveSelection: g, handleInput: _, handleChange: v, handleSelect: y, handleSearch: S, reset: C } = le(i, { emit: r });
		function w() {
			l.value = !0, ((i.idSelector && i.idSelector(o.value) || "new") == "new" || o.value == null) && S();
		}
		function T() {
			l.value = !1;
		}
		function E() {
			i.enableDblClick && S("");
		}
		function O(e) {
			e.target != u.value && m();
		}
		return t({
			inputEl: u,
			q: a,
			selectedItem: o,
			search: S,
			reset: C,
			resetQ() {
				l.value || (a.value = "");
			}
		}), (t, n) => {
			let r = z("click-outside");
			return P(), b(h, null, [q(x("input", A({
				autocomplete: "__away",
				type: "text"
			}, t.$attrs, {
				"onUpdate:modelValue": n[0] ||= (e) => D(a) ? a.value = e : null,
				onInput: n[1] ||= (...e) => H(_) && H(_)(...e),
				onFocus: w,
				onDblclick: E,
				onBlur: T,
				onChange: n[2] ||= (...e) => H(v) && H(v)(...e),
				onKeydown: [
					n[3] ||= J((e) => H(g)(1), ["down"]),
					n[4] ||= J((e) => H(g)(-1), ["up"]),
					n[5] ||= J(Y((e) => H(y)(H(o), H(s)), ["prevent"]), ["enter"])
				],
				ref_key: "inputEl",
				ref: u
			}), null, 16), [[U, H(a)]]), q((P(), b("div", {
				class: j(["autocomplete-items bg-white border", e.resultClass]),
				style: M(H(d))
			}, [x("div", { class: j(["list-group", e.itemsClass]) }, [q(x("div", ue, "Loading...", 512), [[W, H(f)]]), (P(!0), b(h, null, I(H(c), (n, r) => (P(), b("div", {
				key: r,
				onClick: (e) => H(y)(n, r),
				class: j(["autocomplete-item list-group-item list-group-item-action", [e.itemClass, { "bg-light": r == H(s) }]])
			}, [L(t.$slots, "default", {
				item: n,
				q: H(a)
			}, () => [x("div", { innerHTML: H(p)(n, H(a)) }, null, 8, fe)])], 10, de))), 128))], 2)], 6)), [[r, O]])], 64);
		};
	}
}), me = ["name"], he = {
	key: 1,
	class: "ms-1"
}, ge = /* @__PURE__ */ w({
	__name: "ConfirmButton",
	props: {
		icon: { default: "warning" },
		buttonLabel: {},
		modalTitle: { default: "Sure?" },
		modalType: { default: c.warning }
	},
	emits: [
		"confirm",
		"cancel",
		"open",
		"close"
	],
	setup(e, { emit: t }) {
		let n = t, r = F(!1);
		function i() {
			n("confirm"), s();
		}
		function a() {
			n("open"), r.value = !0;
		}
		function o() {
			n("cancel"), s();
		}
		function s() {
			n("close"), r.value = !1;
		}
		return (t, n) => (P(), b("button", {
			type: "button",
			class: "btn",
			name: e.icon,
			onClick: a
		}, [L(t.$slots, "button-content", {}, () => [e.icon == null ? y("", !0) : (P(), v(u, {
			key: 0,
			name: e.icon
		}, null, 8, ["name"])), e.buttonLabel ? (P(), b("span", he, V(e.buttonLabel), 1)) : y("", !0)]), (P(), v(g, { to: "#modals" }, [L(t.$slots, "modal", {}, () => [C(l, {
			"is-visible": r.value,
			type: e.modalType,
			title: e.modalTitle,
			onSubmit: i,
			onCancel: o,
			onClose: s
		}, {
			default: K(() => [L(t.$slots, "default")]),
			_: 3
		}, 8, [
			"is-visible",
			"type",
			"title"
		])])]))], 8, me));
	}
}), _e = ["href"], ve = /* @__PURE__ */ w({
	__name: "Anchor",
	props: { href: {} },
	setup(r) {
		let i = r, a = _(() => {
			let r = i.href;
			return e(r) ? r.startsWith("mailto:") || (r = "mailto:" + r) : t(r) ? r = "http://" + r : n(r) ? r.startsWith("tel:") || (r = "tel:" + r) : !r.startsWith("http") && ![
				"mailto:",
				"tel:",
				"ftp:"
			].some((e) => r.startsWith(e)) && (r = "http://" + r), r;
		});
		return (e, t) => (P(), b("a", { href: a.value }, [L(e.$slots, "default")], 8, _e));
	}
}), ye = ["value", "lang"], be = /* @__PURE__ */ w({
	__name: "DateInput",
	props: {
		modelValue: {},
		culture: {}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = _(() => ae(new Date(r.modelValue || ""))), a = _(() => i.value ? m(new Date(r.modelValue)) : r.modelValue), o = (e) => {
			let t = new Date(e.target.value);
			(!e.target.value || ae(t)) && n("update:modelValue", t || e.target.value);
		};
		return (t, n) => (P(), b("input", {
			type: "date",
			class: j(["form-control", { "is-invalid": a.value && !i.value }]),
			value: a.value,
			onChange: o,
			lang: e.culture
		}, null, 42, ye));
	}
}), xe = /* @__PURE__ */ w({
	__name: "FormLabel",
	props: {
		label: {},
		autoHide: {
			type: Boolean,
			default: !1
		}
	},
	setup(e) {
		return (t, n) => (P(), b("small", { class: j(["form-text text-muted", e.autoHide ? "d-none d-md-inline" : "d-inline"]) }, V(e.label), 3));
	}
}), Se = { class: "description-input" }, Ce = ["readonly"], we = /* @__PURE__ */ w({
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
		let t = ne(e, "modelValue");
		return (n, r) => (P(), b("div", Se, [q(x("textarea", {
			"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
			readonly: e.readonly,
			class: "form-control",
			rows: "3"
		}, null, 8, Ce), [[U, t.value]]), e.label ? (P(), v(xe, {
			key: 0,
			label: e.label
		}, null, 8, ["label"])) : y("", !0)]));
	}
}), Te = { class: "form-buttons d-flex flex-wrap gap-2" }, Ee = /* @__PURE__ */ w({
	__name: "FormButtonsRow",
	props: {
		item: {},
		readonly: { type: Boolean },
		feedback: {},
		showDelete: { type: Boolean }
	},
	emits: [
		"cancel",
		"remove",
		"restore"
	],
	setup(e, { emit: t }) {
		let n = e, r = t, i = _(() => n.item?.isArchived === !0), a = _(() => n.item?.$title ?? "");
		return (t, n) => (P(), b("div", Te, [
			e.readonly ? y("", !0) : (P(), v(d, {
				key: 0,
				type: "submit",
				icon: "save",
				class: "btn-primary"
			}, {
				default: K(() => [...n[3] ||= [x("span", { class: "d-none d-md-inline ms-1" }, "Save", -1)]]),
				_: 1
			})),
			C(d, {
				type: "button",
				icon: "cancel",
				class: "btn-secondary",
				onClick: n[0] ||= (e) => r("cancel")
			}, {
				default: K(() => [...n[4] ||= [x("span", { class: "d-none d-md-inline ms-1" }, "Cancel", -1)]]),
				_: 1
			}),
			e.showDelete && !i.value ? (P(), v(ge, {
				key: 1,
				"modal-title": "Delete?",
				"modal-type": H(c).danger,
				class: "btn-danger",
				disabled: e.readonly,
				onConfirm: n[1] ||= (e) => r("remove")
			}, {
				"button-content": K(() => [C(u, { name: "delete" }), n[5] ||= x("span", { class: "d-none d-md-inline ms-1" }, "Delete", -1)]),
				default: K(() => [L(t.$slots, "delete", {}, () => [S("Delete " + V(a.value) + "?", 1)])]),
				_: 3
			}, 8, ["modal-type", "disabled"])) : y("", !0),
			i.value ? (P(), v(d, {
				key: 2,
				type: "button",
				icon: "restore",
				class: "btn-warning",
				onClick: n[2] ||= (e) => r("restore")
			}, {
				default: K(() => [...n[6] ||= [x("span", { class: "d-none d-md-inline ms-1" }, "Restore", -1)]]),
				_: 1
			})) : y("", !0)
		]));
	}
}), De = ["checked"], Oe = /* @__PURE__ */ w({
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
		})(r.modelValue)), o = _({
			get() {
				return a.value;
			},
			set(e) {
				a.value = e, n("update:modelValue", e), n("change", { target: i.value });
			}
		}), s = _(() => ({ opacity: o.value == null ? .5 : 1 }));
		function c() {
			o.value = o.value == null ? !0 : o.value ? !1 : void 0;
		}
		return re(() => i.value && (i.value.indeterminate = o.value === void 0)), (e, t) => (P(), b("input", {
			type: "checkbox",
			ref_key: "input",
			ref: i,
			onClick: c,
			"true-value": !0,
			checked: o.value,
			style: M(s.value)
		}, null, 12, De));
	}
}), ke = /* @__PURE__ */ w({
	__name: "NullableLabel",
	props: { label: {} },
	setup(e) {
		return (t, n) => (P(), b("span", { class: j({ "italic-muted": !e.label }) }, [e.label ? (P(), b(h, { key: 0 }, [S(V(e.label), 1)], 64)) : L(t.$slots, "default", { key: 1 })], 2));
	}
}), Ae = { class: "form-section" }, je = { class: "form-section-title" }, Me = { class: "row" }, Ne = { class: "p-2 mb-2" }, Pe = { class: "col-auto" }, Fe = /* @__PURE__ */ w({
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
		let n = t, r = e, i = T(), a = F(r.collapsed), o = F(r.readonly || r.showSummary), s = _({
			get: () => i?.slots.summary && (r.readonly || o.value),
			set: (e) => o.value = !!e
		});
		function c() {
			a.value = !a.value, a.value ? n("collapse") : n("expand");
		}
		return G(() => r.collapsed, () => {
			a.value = r.collapsed, a.value ? n("collapse") : n("expand");
		}), (t, n) => (P(), b("div", Ae, [x("div", je, [L(t.$slots, "header", {
			collapsed: a.value,
			showSummary: s.value
		}, () => [x("div", Me, [x("div", {
			class: "col",
			onClick: n[0] ||= (e) => s.value = !s.value
		}, [L(t.$slots, "title", { showSummary: s.value }, () => [x("h3", Ne, V(e.title), 1)])]), x("div", Pe, [!e.readonly && t.$slots.summary ? (P(), b("button", {
			key: 0,
			type: "button",
			class: "btn btn-default my-2 px-2 py-1 opacity-50",
			onClick: n[1] ||= Y((e) => s.value = !s.value, ["stop"])
		}, [C(u, { name: s.value ? "look" : "edit" }, null, 8, ["name"])])) : y("", !0), x("button", {
			type: "button",
			class: "btn btn-default my-2 px-2 py-1 opacity-50",
			onClick: Y(c, ["stop"])
		}, [C(u, { name: a.value ? "maximize" : "minimize" }, null, 8, ["name"])])])])])]), q(x("div", { class: j(["form-section-body", s.value && e.summaryClass]) }, [
			!t.$slots.summary || !s.value ? L(t.$slots, "default", {
				key: 0,
				collapsed: a.value
			}) : y("", !0),
			t.$slots.summary && s.value ? L(t.$slots, "summary", {
				key: 1,
				collapsed: a.value
			}) : y("", !0),
			L(t.$slots, "always")
		], 2), [[W, !a.value]])]));
	}
}), Ie = /* @__PURE__ */ w({
	__name: "FileDropZone",
	emits: ["drop-files"],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = F();
		async function a(e) {
			r("drop-files", [...e.dataTransfer.files]);
		}
		return t({ isDropping: i }), (e, t) => (P(), b("div", {
			onDrop: Y(a, ["prevent"]),
			onDragover: t[0] ||= Y((e) => i.value = !0, ["prevent"]),
			onDragleave: t[1] ||= Y((e) => i.value = !1, ["prevent"])
		}, [L(e.$slots, "default", { isDropping: i.value })], 32));
	}
}), Le = /* @__PURE__ */ w({
	__name: "CopyToClipboardButton",
	props: {
		value: {},
		timeout: { default: 2500 }
	},
	setup(e, { expose: t }) {
		let n = e, r = F();
		function i() {
			a(n.value ?? ""), r.value = !0, setTimeout(() => r.value = void 0, n.timeout);
		}
		return t({ success: r }), (e, t) => (P(), v(d, {
			icon: r.value ? "check" : "copy",
			disabled: r.value,
			onClick: i
		}, null, 8, ["icon", "disabled"]));
	}
}), Re = ["src"], ze = /* @__PURE__ */ w({
	__name: "GMap",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = _(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = _(() => `https://maps.google.com/maps?q=${encodeURIComponent(n.value)}&t=&z=${t.zoom || 10}&ie=UTF8&iwloc=&output=embed`);
		return (e, t) => (P(), b("iframe", {
			src: r.value,
			frameborder: "0",
			scrolling: "no",
			marginheight: "0",
			marginwidth: "0",
			allowfullscreen: ""
		}, null, 8, Re));
	}
}), Be = ["href"], Ve = /* @__PURE__ */ w({
	__name: "GmapLink",
	props: { modelValue: {} },
	setup(e) {
		let t = e, n = _(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" "));
		return (e, t) => (P(), b("a", { href: `https://www.google.com/maps/?q=${n.value}` }, [C(u, { name: "map" }), L(e.$slots, "default")], 8, Be));
	}
}), He = /*#__PURE__*/ f(/* @__PURE__ */ w({
	__name: "ModalButton",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = _(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = F(!1);
		return (t, i) => (P(), b("button", {
			type: "button",
			onClick: i[1] ||= (e) => r.value = !0
		}, [L(t.$slots, "default", {}, () => [C(u, { name: "map" })], !0), (P(), v(g, { to: "#modals" }, [C(H(l), {
			"is-visible": r.value,
			title: n.value,
			"show-footer": !1,
			"full-width": !0,
			onClose: i[0] ||= (e) => r.value = !1
		}, {
			default: K(() => [C(ze, {
				id: "gmap_canvas",
				modelValue: e.modelValue,
				zoom: e.zoom,
				class: "w-100"
			}, null, 8, ["modelValue", "zoom"])]),
			_: 1
		}, 8, ["is-visible", "title"])]))]));
	}
}), [["__scopeId", "data-v-998cd3e5"]]), Ue = ["src"], X = /* @__PURE__ */ w({
	__name: "Loading",
	setup(e, { expose: t }) {
		let n = E("loadingImg"), r = F(null);
		return t({
			imgEl: r,
			dimensions: () => [r.value?.width, r.value?.height],
			height: () => r.value?.naturalHeight
		}), (e, t) => (P(), b("img", {
			src: H(n),
			ref_key: "imgEl",
			ref: r
		}, null, 8, Ue));
	}
}), We = ["disabled"], Ge = /* @__PURE__ */ w({
	__name: "LoadingButton",
	props: {
		isLoading: { type: Boolean },
		disabled: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (P(), b("button", {
			type: "button",
			class: "btn",
			disabled: e.disabled || e.isLoading
		}, [e.isLoading ? L(t.$slots, "loading", { key: 0 }, () => [C(X, { style: { width: "1rem" } })]) : L(t.$slots, "default", { key: 1 })], 8, We));
	}
}), Ke = /* @__PURE__ */ w({
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
		}), (t, a) => (P(), b("div", {
			class: "position-relative",
			style: M({ height: e.isLoading ? `${i()}px` : void 0 }),
			ref_key: "containerEl",
			ref: n
		}, [L(t.$slots, "loading", {}, () => [e.isLoading ? (P(), v(X, {
			key: 0,
			class: "position-absolute top-0 start-50 translate-middle-x",
			style: {
				width: "20rem",
				"max-width": "100%"
			},
			ref_key: "loadingEl",
			ref: r
		}, null, 512)) : y("", !0)]), x("div", { style: M({ opacity: e.isLoading ? "0.4" : "" }) }, [L(t.$slots, "default")], 4)], 4));
	}
}), qe = { install(e, t) {
	e.provide("loadingImg", t.img), p.registerComponentsGlobally && (e.component("Loading", X), e.component("LoadingButton", Ge), e.component("LoadingContainer", Ke));
} }, Je = { PAGESIZE: 10 }, Ye = /* @__PURE__ */ function(e) {
	return e.anchor = "Anchor", e.button = "Button", e;
}({}), Xe = {
	maxPages: 9,
	buttonType: "Anchor"
};
function Ze({ pagingInfo: e, count: t, maxPages: n, emit: r }) {
	n = window.innerWidth < 576 ? Math.ceil(n / 2) : n;
	let i = _(() => (isNaN(parseInt(e.value.pageSize + "")) ? null : e.value.pageSize) || Je.PAGESIZE), a = ie();
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
	let s = _(() => e.value.page || 1), c = _(() => Math.ceil(t.value / i.value)), l = _(() => Math.min(c.value, n)), u = _(() => {
		let e = Math.floor(l.value / 2), t = Math.max(s.value - e, 1);
		return t + n > c.value && (t -= t + n - c.value - 1), Math.max(t, 1);
	}), d = _(() => Math.min(u.value + l.value, c.value)), f = _(() => !isNaN(l.value) && l.value > 0 ? Array(l.value).fill(0).map((e, t) => u.value + t).filter((e) => e <= d.value) : []);
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
var Qe = /* @__PURE__ */ w({
	__name: "PagingAnchor",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => {
			let r = R("RouterLink");
			return P(), v(r, {
				class: "page-link",
				to: e.to,
				title: "page " + e.page,
				activeClass: "active-page"
			}, {
				default: K(() => [L(t.$slots, "default", {}, () => [S(V(e.page), 1)])]),
				_: 3
			}, 8, ["to", "title"]);
		};
	}
}), $e = ["title"], et = /* @__PURE__ */ w({
	__name: "PagingButton",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => (P(), b("button", {
			type: "button",
			class: "btn btn-link page-link",
			title: "page " + e.page
		}, [L(t.$slots, "default", {}, () => [S(V(e.page), 1)])], 8, $e));
	}
}), tt = { "aria-label": "Pagination" }, nt = { class: "pagination" }, rt = { class: "page-item" }, it = { class: "page-item" }, at = /* @__PURE__ */ w({
	__name: "Paging",
	props: /*@__PURE__*/ O({
		modelValue: {},
		count: {},
		maxPages: {},
		buttonType: {}
	}, { ...Xe }),
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = s(r, n), { count: a } = te(r), o = r.buttonType == Ye.button ? et : Qe, { pagedRoute: c, page: l, totalPages: u, pages: d, handleChangePage: f } = Ze({
			pagingInfo: i,
			count: a,
			maxPages: r.maxPages,
			emit: n
		});
		return (e, t) => (P(), b("nav", tt, [x("ul", nt, [
			x("li", rt, [L(e.$slots, "firstPage", { page: 1 }, () => [(P(), v(B(H(o)), {
				page: 1,
				to: H(c)(1),
				onClick: t[0] ||= Y((e) => H(f)(1), ["prevent"]),
				"aria-label": "Previous"
			}, {
				default: K(() => [...t[2] ||= [S("«", -1)]]),
				_: 1
			}, 8, ["to"]))])]),
			(P(!0), b(h, null, I(H(d), (t) => (P(), b("li", {
				class: j(["page-item", { active: t == H(l) }]),
				key: t
			}, [L(e.$slots, "default", {
				page: t,
				route: H(c)(t),
				handleChange: H(f)
			}, () => [(P(), v(B(H(o)), {
				page: t,
				to: H(c)(t),
				onClick: Y((e) => H(f)(t), ["prevent"])
			}, {
				default: K(() => [S(V(t), 1)]),
				_: 2
			}, 1032, [
				"page",
				"to",
				"onClick"
			]))])], 2))), 128)),
			x("li", it, [L(e.$slots, "lastPage", { page: H(u) }, () => [(P(), v(B(H(o)), {
				page: H(u),
				to: H(c)(H(u)),
				onClick: t[1] ||= Y((e) => H(f)(H(u)), ["prevent"]),
				"aria-label": "Next"
			}, {
				default: K(() => [...t[3] ||= [S(" » ", -1)]]),
				_: 1
			}, 8, ["page", "to"]))])])
		])]));
	}
}), ot = { class: "result-summary text-muted small" }, st = /* @__PURE__ */ w({
	__name: "ResultSummary",
	props: {
		visibleCount: {},
		totalCount: {}
	},
	setup(e) {
		return (t, n) => (P(), b("span", ot, V(e.visibleCount ?? 0) + " / " + V(e.totalCount ?? 0), 1));
	}
}), ct = { install(e, { defaultPageSize: t = 10 } = {}) {
	Je.PAGESIZE = t, p.registerComponentsGlobally && e.component("Paging", at);
} };
//#endregion
//#region src/vue/ui/screen/screen.ts
function Z() {
	return [window.innerWidth, window.innerHeight];
}
var Q = {
	xs: 0,
	sm: 576,
	md: 768,
	lg: 992,
	xl: 1200,
	xxl: 1400
};
function lt() {
	let e = F(Z());
	return {
		size: e,
		screen: {
			get size() {
				return e.value;
			},
			get isExtraSmall() {
				return this.size[0] >= Q.xs;
			},
			get isSmall() {
				return this.size[0] >= Q.sm;
			},
			get isMedium() {
				return this.size[0] >= Q.md;
			},
			get isLarge() {
				return this.size[0] >= Q.lg;
			},
			get isExtraLarge() {
				return this.size[0] >= Q.xl;
			},
			get isExtraExtraLarge() {
				return this.size[0] >= Q.xxl;
			},
			get layout() {
				return this.isExtraExtraLarge ? "xxl" : this.isExtraLarge ? "xl" : this.isLarge ? "lg" : this.isMedium ? "md" : this.isSmall ? "sm" : "xs";
			},
			isSize(e) {
				return this.size[0] >= Q[e];
			},
			updateSize: (t = Z()) => e.value = t
		}
	};
}
//#endregion
//#region src/vue/ui/screen/plugin.ts
function ut(e, t) {
	let n;
	return (...r) => {
		n && clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
var dt = { install: (e, { sizes: t } = {}) => {
	if (t) for (let e in t) e in Q && (Q[e] = t[e]);
	let { screen: n } = lt(), r = ut(() => n.updateSize(Z()), 250);
	window.addEventListener("resize", r), window.addEventListener("orientationchange", r), e.config.globalProperties.$screen = n, e.provide("screen", n);
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
}, ft = ["href", "onClick"], pt = /* @__PURE__ */ w({
	__name: "TabNavigation",
	props: {
		tabs: {},
		activeTab: {}
	},
	emits: ["select"],
	setup(e) {
		let t = _(() => (e) => typeof e.isVisible == "function" ? e.isVisible() : e.isVisible);
		return (n, r) => (P(), b("ul", { class: j(["nav", {
			"nav-pills": !n.$screen?.isLarge,
			"nav-tabs": n.$screen?.isLarge
		}]) }, [(P(!0), b(h, null, I(e.tabs, (r) => (P(), b(h, { key: r.key }, [t.value(r) ? (P(), b("li", {
			key: 0,
			class: j(["nav-item", { disabled: r.isDisabled }])
		}, [x("a", {
			href: `#${r.key}`,
			class: j([
				"py-1 px-2",
				"nav-link",
				{
					active: e.activeTab == r.key,
					disabled: r.isDisabled
				}
			]),
			onClick: Y((e) => n.$emit("select", r.key), ["prevent"])
		}, [r.icon ? (P(), v(u, {
			key: 0,
			name: r.icon
		}, null, 8, ["name"])) : y("", !0), x("span", { class: j({ "d-none d-lg-inline ms-1": r.icon }) }, V(r.title), 3)], 10, ft)], 2)) : y("", !0)], 64))), 128))], 2));
	}
}), mt = { class: "tab-container" }, ht = {
	key: 0,
	class: "tab-content pt-2"
}, gt = /* @__PURE__ */ w({
	__name: "TabContainer",
	props: {
		tabs: {},
		useRouteNav: {
			type: Boolean,
			default: !1
		},
		active: {}
	},
	emits: ["select"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = ie(), a = _(() => r.tabs.filter((e) => e != null).map((e) => e instanceof $ ? e : new $(e))), o = _(() => (a.value.find((e) => e.isDefault) || a.value[0]).key), s = F(r.active), c = _({
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
		}), (e, t) => (P(), b("div", mt, [C(pt, {
			tabs: a.value,
			activeTab: c.value,
			onSelect: l
		}, null, 8, ["tabs", "activeTab"]), (P(!0), b(h, null, I(a.value, (t) => (P(), b(h, { key: t.key }, [c.value == t.key ? (P(), b("div", ht, [L(e.$slots, t.key)])) : y("", !0)], 64))), 128))]));
	}
});
//#endregion
export { le as A, xe as C, pe as D, ge as E, oe as O, we as S, ve as T, Ie as _, ct as a, Oe as b, Ye as c, Ke as d, X as f, Le as g, ze as h, lt as i, se as k, Xe as l, Ve as m, $ as n, st as o, He as p, dt as r, at as s, gt as t, qe as u, Fe as v, be as w, Ee as x, ke as y };
