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
import { Fragment as h, Teleport as g, computed as _, createBlock as v, createCommentVNode as y, createElementBlock as b, createElementVNode as x, createTextVNode as S, createVNode as C, defineComponent as w, getCurrentInstance as T, inject as E, isRef as D, mergeDefaults as O, mergeModels as ee, mergeProps as k, normalizeClass as A, normalizeStyle as j, onMounted as te, onUnmounted as ne, openBlock as M, ref as N, renderList as P, renderSlot as F, resolveComponent as I, resolveDirective as L, resolveDynamicComponent as R, toDisplayString as z, toRefs as re, unref as B, useModel as ie, vModelText as V, vShow as H, watch as U, watchEffect as ae, withCtx as W, withDirectives as G, withKeys as K, withModifiers as q } from "vue";
import { useRouter as J } from "vue-router";
import { isValid as Y } from "date-fns";
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
	let n = N(""), a = N(-1), s = N(e.data), c = N(!1), l = N(!1), u = N(!1), d = _({
		get: () => e.modelValue,
		set: (n) => {
			e.modelValue !== n && (t("update:modelValue", n), t("update:idValue", y(n)), t("select", n));
		}
	}), f = _(() => y(d.value)), p = N(), m = N({
		top: 0,
		left: 0
	}), h = N({
		top: 0,
		left: 0
	}), g = N({
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
		M(), u.value = !0, s.value = void 0;
		try {
			let n = await L(t), r = e.maxResults || n.length;
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
		k(), C();
	}
	function E() {}
	function D(e, t) {
		P(), O(e, e ? t : -1);
	}
	function O(e, t) {
		if (e == null && t == null) {
			k(), n.value || P();
			return;
		}
		e && (t == null || t < 0) ? t = (s.value || []).indexOf(e) : !e && t >= 0 && (e = s.value[t]), e != null && (a.value = t, d.value = e, n.value = x(d.value));
	}
	function ee(e) {
		console.debug("moveSelection", {
			step: e,
			selectedIndex: a.value,
			items: s.value
		});
		let t = a.value + e, n = s.value[t];
		t >= 0 && t < s.value.length && O(n, t);
	}
	function k() {
		a.value = -1, d.value = void 0;
	}
	function A() {
		n.value = "", k(), P();
	}
	function j(e) {
		let t = 0, n = 0;
		do
			t += e?.offsetTop || 0, n += e?.offsetLeft || 0, e = e?.offsetParent;
		while (e);
		return {
			top: t,
			left: n
		};
	}
	function M() {
		R(), c.value = !0;
	}
	function P() {
		c.value = !1;
	}
	function F() {
		c.value && setTimeout(() => {
			w(!0), d.value ?? (n.value = ""), P();
		}, 250);
	}
	function I(e) {
		throw e;
	}
	let L = r(e.search || e.data && S || I(/* @__PURE__ */ Error("prop search or data is required")), e.debounceTime), R = () => {
		m.value = j(p.value), g.value = p.value ? i(p.value) : {
			top: 0,
			left: 0
		};
	}, z = r(R, 50);
	return o(window, "resize", z), te(() => {
		n.value = x(d.value), R(), document.addEventListener("scroll", z, !0);
	}), ne(() => {
		document.removeEventListener("scroll", z, !0);
	}), U(d, (e, t) => {
		e != t && e != d.value && O(e), e && (n.value = x(d.value));
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
		resultStyle: v,
		displayItemFormatter: x,
		resultItemFormatter: b,
		handleInput: T,
		handleChange: E,
		handleSelect: D,
		handleSearch: C,
		openResults: M,
		closeResults: P,
		closeGently: F,
		moveSelection: ee,
		checkMatch: w,
		clearSelection: k,
		reset: A
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
			let r = L("click-outside");
			return M(), b(h, null, [G(x("input", k({
				autocomplete: "__away",
				type: "text"
			}, t.$attrs, {
				"onUpdate:modelValue": n[0] ||= (e) => D(a) ? a.value = e : null,
				onInput: n[1] ||= (...e) => B(_) && B(_)(...e),
				onFocus: w,
				onDblclick: E,
				onBlur: T,
				onChange: n[2] ||= (...e) => B(v) && B(v)(...e),
				onKeydown: [
					n[3] ||= K((e) => B(g)(1), ["down"]),
					n[4] ||= K((e) => B(g)(-1), ["up"]),
					n[5] ||= K(q((e) => B(y)(B(o), B(s)), ["prevent"]), ["enter"])
				],
				ref_key: "inputEl",
				ref: u
			}), null, 16), [[V, B(a)]]), G((M(), b("div", {
				class: A(["autocomplete-items bg-white border", e.resultClass]),
				style: j(B(d))
			}, [x("div", { class: A(["list-group", e.itemsClass]) }, [G(x("div", ue, "Loading...", 512), [[H, B(f)]]), (M(!0), b(h, null, P(B(c), (n, r) => (M(), b("div", {
				key: r,
				onClick: (e) => B(y)(n, r),
				class: A(["autocomplete-item list-group-item list-group-item-action", [e.itemClass, { "bg-light": r == B(s) }]])
			}, [F(t.$slots, "default", {
				item: n,
				q: B(a)
			}, () => [x("div", { innerHTML: B(p)(n, B(a)) }, null, 8, fe)])], 10, de))), 128))], 2)], 6)), [[r, O]])], 64);
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
		let n = t, r = N(!1);
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
		return (t, n) => (M(), b("button", {
			type: "button",
			class: "btn",
			name: e.icon,
			onClick: a
		}, [F(t.$slots, "button-content", {}, () => [e.icon == null ? y("", !0) : (M(), v(u, {
			key: 0,
			name: e.icon
		}, null, 8, ["name"])), e.buttonLabel ? (M(), b("span", he, z(e.buttonLabel), 1)) : y("", !0)]), (M(), v(g, { to: "#modals" }, [F(t.$slots, "modal", {}, () => [C(l, {
			"is-visible": r.value,
			type: e.modalType,
			title: e.modalTitle,
			onSubmit: i,
			onCancel: o,
			onClose: s
		}, {
			default: W(() => [F(t.$slots, "default")]),
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
		return (e, t) => (M(), b("a", { href: a.value }, [F(e.$slots, "default")], 8, _e));
	}
}), ye = ["value", "lang"], be = /* @__PURE__ */ w({
	__name: "DateInput",
	props: {
		modelValue: {},
		culture: {}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = _(() => Y(new Date(r.modelValue || ""))), a = _(() => i.value ? m(new Date(r.modelValue)) : r.modelValue), o = (e) => {
			let t = new Date(e.target.value);
			(!e.target.value || Y(t)) && n("update:modelValue", t || e.target.value);
		};
		return (t, n) => (M(), b("input", {
			type: "date",
			value: a.value,
			onChange: o,
			lang: e.culture,
			class: A({ "is-invalid": a.value && !i.value })
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
		return (t, n) => (M(), b("small", { class: A(["form-text text-muted", e.autoHide ? "d-none d-md-inline" : "d-inline"]) }, z(e.label), 3));
	}
}), Se = { class: "description-input" }, Ce = ["readonly"], we = /* @__PURE__ */ w({
	__name: "DescriptionInput",
	props: /*@__PURE__*/ ee({
		label: {},
		readonly: { type: Boolean }
	}, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = ie(e, "modelValue");
		return (n, r) => (M(), b("div", Se, [G(x("textarea", {
			"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
			readonly: e.readonly,
			class: "form-control",
			rows: "3"
		}, null, 8, Ce), [[V, t.value]]), e.label ? (M(), v(xe, {
			key: 0,
			label: e.label
		}, null, 8, ["label"])) : y("", !0)]));
	}
}), Te = { class: "form-buttons btn-group" }, Ee = {
	key: 0,
	type: "submit",
	class: "btn btn-primary"
}, De = /* @__PURE__ */ w({
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
		let n = e, r = t, i = _(() => n.item?.isArchived === !0);
		return (t, n) => (M(), b("div", Te, [
			e.readonly ? y("", !0) : (M(), b("button", Ee, "Save")),
			x("button", {
				type: "button",
				class: "btn btn-link",
				onClick: n[0] ||= (e) => r("cancel")
			}, "Cancel"),
			e.showDelete && !i.value ? (M(), b("button", {
				key: 1,
				type: "button",
				class: "btn btn-outline-danger",
				onClick: n[1] ||= (e) => r("remove")
			}, "Delete")) : y("", !0),
			i.value ? (M(), b("button", {
				key: 2,
				type: "button",
				class: "btn btn-outline-secondary",
				onClick: n[2] ||= (e) => r("restore")
			}, "Restore")) : y("", !0)
		]));
	}
}), Oe = ["checked"], ke = /* @__PURE__ */ w({
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
		return ae(() => i.value && (i.value.indeterminate = o.value === void 0)), (e, t) => (M(), b("input", {
			type: "checkbox",
			ref_key: "input",
			ref: i,
			onClick: c,
			"true-value": !0,
			checked: o.value,
			style: j(s.value)
		}, null, 12, Oe));
	}
}), Ae = /* @__PURE__ */ w({
	__name: "NullableLabel",
	props: { label: {} },
	setup(e) {
		return (t, n) => (M(), b("span", { class: A({ "italic-muted": !e.label }) }, [e.label ? (M(), b(h, { key: 0 }, [S(z(e.label), 1)], 64)) : F(t.$slots, "default", { key: 1 })], 2));
	}
}), je = { class: "form-section" }, Me = { class: "form-section-title" }, Ne = { class: "row" }, Pe = { class: "p-2 mb-2" }, Fe = { class: "col-auto" }, Ie = /* @__PURE__ */ w({
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
		let n = t, r = e, i = T(), a = N(r.collapsed), o = N(r.readonly || r.showSummary), s = _({
			get: () => i?.slots.summary && (r.readonly || o.value),
			set: (e) => o.value = !!e
		});
		function c() {
			a.value = !a.value, a.value ? n("collapse") : n("expand");
		}
		return U(() => r.collapsed, () => {
			a.value = r.collapsed, a.value ? n("collapse") : n("expand");
		}), (t, n) => (M(), b("div", je, [x("div", Me, [F(t.$slots, "header", {
			collapsed: a.value,
			showSummary: s.value
		}, () => [x("div", Ne, [x("div", {
			class: "col",
			onClick: n[0] ||= (e) => s.value = !s.value
		}, [F(t.$slots, "title", { showSummary: s.value }, () => [x("h3", Pe, z(e.title), 1)])]), x("div", Fe, [!e.readonly && t.$slots.summary ? (M(), b("button", {
			key: 0,
			type: "button",
			class: "btn btn-default my-2 px-2 py-1 opacity-50",
			onClick: n[1] ||= q((e) => s.value = !s.value, ["stop"])
		}, [C(u, { name: s.value ? "look" : "edit" }, null, 8, ["name"])])) : y("", !0), x("button", {
			type: "button",
			class: "btn btn-default my-2 px-2 py-1 opacity-50",
			onClick: q(c, ["stop"])
		}, [C(u, { name: a.value ? "maximize" : "minimize" }, null, 8, ["name"])])])])])]), G(x("div", { class: A(["form-section-body", s.value && e.summaryClass]) }, [
			!t.$slots.summary || !s.value ? F(t.$slots, "default", {
				key: 0,
				collapsed: a.value
			}) : y("", !0),
			t.$slots.summary && s.value ? F(t.$slots, "summary", {
				key: 1,
				collapsed: a.value
			}) : y("", !0),
			F(t.$slots, "always")
		], 2), [[H, !a.value]])]));
	}
}), Le = /* @__PURE__ */ w({
	__name: "FileDropZone",
	emits: ["drop-files"],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = N();
		async function a(e) {
			r("drop-files", [...e.dataTransfer.files]);
		}
		return t({ isDropping: i }), (e, t) => (M(), b("div", {
			onDrop: q(a, ["prevent"]),
			onDragover: t[0] ||= q((e) => i.value = !0, ["prevent"]),
			onDragleave: t[1] ||= q((e) => i.value = !1, ["prevent"])
		}, [F(e.$slots, "default", { isDropping: i.value })], 32));
	}
}), Re = /* @__PURE__ */ w({
	__name: "CopyToClipboardButton",
	props: {
		value: {},
		timeout: { default: 2500 }
	},
	setup(e, { expose: t }) {
		let n = e, r = N();
		function i() {
			a(n.value ?? ""), r.value = !0, setTimeout(() => r.value = void 0, n.timeout);
		}
		return t({ success: r }), (e, t) => (M(), v(d, {
			icon: r.value ? "check" : "copy",
			disabled: r.value,
			onClick: i
		}, null, 8, ["icon", "disabled"]));
	}
}), ze = ["src"], Be = /* @__PURE__ */ w({
	__name: "GMap",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = _(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = _(() => `https://maps.google.com/maps?q=${encodeURIComponent(n.value)}&t=&z=${t.zoom || 10}&ie=UTF8&iwloc=&output=embed`);
		return (e, t) => (M(), b("iframe", {
			src: r.value,
			frameborder: "0",
			scrolling: "no",
			marginheight: "0",
			marginwidth: "0",
			allowfullscreen: ""
		}, null, 8, ze));
	}
}), Ve = ["href"], He = /* @__PURE__ */ w({
	__name: "GmapLink",
	props: { modelValue: {} },
	setup(e) {
		let t = e, n = _(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" "));
		return (e, t) => (M(), b("a", { href: `https://www.google.com/maps/?q=${n.value}` }, [C(u, { name: "map" }), F(e.$slots, "default")], 8, Ve));
	}
}), Ue = /*#__PURE__*/ f(/* @__PURE__ */ w({
	__name: "ModalButton",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = _(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = N(!1);
		return (t, i) => (M(), b("button", {
			type: "button",
			onClick: i[1] ||= (e) => r.value = !0
		}, [F(t.$slots, "default", {}, () => [C(u, { name: "map" })], !0), (M(), v(g, { to: "#modals" }, [C(B(l), {
			"is-visible": r.value,
			title: n.value,
			"show-footer": !1,
			"full-width": !0,
			onClose: i[0] ||= (e) => r.value = !1
		}, {
			default: W(() => [C(Be, {
				id: "gmap_canvas",
				modelValue: e.modelValue,
				zoom: e.zoom,
				class: "w-100"
			}, null, 8, ["modelValue", "zoom"])]),
			_: 1
		}, 8, ["is-visible", "title"])]))]));
	}
}), [["__scopeId", "data-v-998cd3e5"]]), We = ["src"], X = /* @__PURE__ */ w({
	__name: "Loading",
	setup(e, { expose: t }) {
		let n = E("loadingImg"), r = N(null);
		return t({
			imgEl: r,
			dimensions: () => [r.value?.width, r.value?.height],
			height: () => r.value?.naturalHeight
		}), (e, t) => (M(), b("img", {
			src: B(n),
			ref_key: "imgEl",
			ref: r
		}, null, 8, We));
	}
}), Ge = ["disabled"], Ke = /* @__PURE__ */ w({
	__name: "LoadingButton",
	props: {
		isLoading: { type: Boolean },
		disabled: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (M(), b("button", {
			type: "button",
			class: "btn",
			disabled: e.disabled || e.isLoading
		}, [e.isLoading ? F(t.$slots, "loading", { key: 0 }, () => [C(X, { style: { width: "1rem" } })]) : F(t.$slots, "default", { key: 1 })], 8, Ge));
	}
}), qe = /* @__PURE__ */ w({
	__name: "LoadingContainer",
	props: { isLoading: { type: Boolean } },
	setup(e, { expose: t }) {
		let n = N(null), r = N(null);
		function i() {
			return r.value?.imgEl?.width;
		}
		return t({
			containerEl: n,
			loadingImgEl: r.value?.imgEl
		}), (t, a) => (M(), b("div", {
			class: "position-relative",
			style: j({ height: e.isLoading ? `${i()}px` : void 0 }),
			ref_key: "containerEl",
			ref: n
		}, [F(t.$slots, "loading", {}, () => [e.isLoading ? (M(), v(X, {
			key: 0,
			class: "position-absolute top-0 start-50 translate-middle-x",
			style: {
				width: "20rem",
				"max-width": "100%"
			},
			ref_key: "loadingEl",
			ref: r
		}, null, 512)) : y("", !0)]), x("div", { style: j({ opacity: e.isLoading ? "0.4" : "" }) }, [F(t.$slots, "default")], 4)], 4));
	}
}), Je = { install(e, t) {
	e.provide("loadingImg", t.img), p.registerComponentsGlobally && (e.component("Loading", X), e.component("LoadingButton", Ke), e.component("LoadingContainer", qe));
} }, Ye = { PAGESIZE: 10 }, Xe = /* @__PURE__ */ function(e) {
	return e.anchor = "Anchor", e.button = "Button", e;
}({}), Ze = {
	maxPages: 9,
	buttonType: "Anchor"
};
function Qe({ pagingInfo: e, count: t, maxPages: n, emit: r }) {
	n = window.innerWidth < 576 ? Math.ceil(n / 2) : n;
	let i = _(() => (isNaN(parseInt(e.value.pageSize + "")) ? null : e.value.pageSize) || Ye.PAGESIZE), a = J();
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
var $e = /* @__PURE__ */ w({
	__name: "PagingAnchor",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => {
			let r = I("RouterLink");
			return M(), v(r, {
				class: "page-link",
				to: e.to,
				title: "page " + e.page,
				activeClass: "active-page"
			}, {
				default: W(() => [F(t.$slots, "default", {}, () => [S(z(e.page), 1)])]),
				_: 3
			}, 8, ["to", "title"]);
		};
	}
}), et = ["title"], tt = /* @__PURE__ */ w({
	__name: "PagingButton",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => (M(), b("button", {
			type: "button",
			class: "btn btn-link page-link",
			title: "page " + e.page
		}, [F(t.$slots, "default", {}, () => [S(z(e.page), 1)])], 8, et));
	}
}), nt = { "aria-label": "Pagination" }, rt = { class: "pagination" }, it = { class: "page-item" }, at = { class: "page-item" }, ot = /* @__PURE__ */ w({
	__name: "Paging",
	props: /*@__PURE__*/ O({
		modelValue: {},
		count: {},
		maxPages: {},
		buttonType: {}
	}, { ...Ze }),
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = s(r, n), { count: a } = re(r), o = r.buttonType == Xe.button ? tt : $e, { pagedRoute: c, page: l, totalPages: u, pages: d, handleChangePage: f } = Qe({
			pagingInfo: i,
			count: a,
			maxPages: r.maxPages,
			emit: n
		});
		return (e, t) => (M(), b("nav", nt, [x("ul", rt, [
			x("li", it, [F(e.$slots, "firstPage", { page: 1 }, () => [(M(), v(R(B(o)), {
				page: 1,
				to: B(c)(1),
				onClick: t[0] ||= q((e) => B(f)(1), ["prevent"]),
				"aria-label": "Previous"
			}, {
				default: W(() => [...t[2] ||= [S("«", -1)]]),
				_: 1
			}, 8, ["to"]))])]),
			(M(!0), b(h, null, P(B(d), (t) => (M(), b("li", {
				class: A(["page-item", { active: t == B(l) }]),
				key: t
			}, [F(e.$slots, "default", {
				page: t,
				route: B(c)(t),
				handleChange: B(f)
			}, () => [(M(), v(R(B(o)), {
				page: t,
				to: B(c)(t),
				onClick: q((e) => B(f)(t), ["prevent"])
			}, {
				default: W(() => [S(z(t), 1)]),
				_: 2
			}, 1032, [
				"page",
				"to",
				"onClick"
			]))])], 2))), 128)),
			x("li", at, [F(e.$slots, "lastPage", { page: B(u) }, () => [(M(), v(R(B(o)), {
				page: B(u),
				to: B(c)(B(u)),
				onClick: t[1] ||= q((e) => B(f)(B(u)), ["prevent"]),
				"aria-label": "Next"
			}, {
				default: W(() => [...t[3] ||= [S(" » ", -1)]]),
				_: 1
			}, 8, ["page", "to"]))])])
		])]));
	}
}), st = { class: "result-summary text-muted small" }, ct = /* @__PURE__ */ w({
	__name: "ResultSummary",
	props: {
		visibleCount: {},
		totalCount: {}
	},
	setup(e) {
		return (t, n) => (M(), b("span", st, z(e.visibleCount ?? 0) + " / " + z(e.totalCount ?? 0), 1));
	}
}), lt = { install(e, { defaultPageSize: t = 10 } = {}) {
	Ye.PAGESIZE = t, p.registerComponentsGlobally && e.component("Paging", ot);
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
function ut() {
	let e = N(Z());
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
function dt(e, t) {
	let n;
	return (...r) => {
		n && clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
var ft = { install: (e, { sizes: t } = {}) => {
	if (t) for (let e in t) e in Q && (Q[e] = t[e]);
	let { screen: n } = ut(), r = dt(() => n.updateSize(Z()), 250);
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
}, pt = ["href", "onClick"], mt = /* @__PURE__ */ w({
	__name: "TabNavigation",
	props: {
		tabs: {},
		activeTab: {}
	},
	emits: ["select"],
	setup(e) {
		let t = _(() => (e) => typeof e.isVisible == "function" ? e.isVisible() : e.isVisible);
		return (n, r) => (M(), b("ul", { class: A(["nav", {
			"nav-pills": !n.$screen?.isLarge,
			"nav-tabs": n.$screen?.isLarge
		}]) }, [(M(!0), b(h, null, P(e.tabs, (r) => (M(), b(h, { key: r.key }, [t.value(r) ? (M(), b("li", {
			key: 0,
			class: A(["nav-item", { disabled: r.isDisabled }])
		}, [x("a", {
			href: `#${r.key}`,
			class: A([
				"py-1 px-2",
				"nav-link",
				{
					active: e.activeTab == r.key,
					disabled: r.isDisabled
				}
			]),
			onClick: q((e) => n.$emit("select", r.key), ["prevent"])
		}, [r.icon ? (M(), v(u, {
			key: 0,
			name: r.icon
		}, null, 8, ["name"])) : y("", !0), x("span", { class: A({ "d-none d-lg-inline ms-1": r.icon }) }, z(r.title), 3)], 10, pt)], 2)) : y("", !0)], 64))), 128))], 2));
	}
}), ht = { class: "tab-container" }, gt = {
	key: 0,
	class: "tab-content pt-2"
}, _t = /* @__PURE__ */ w({
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
		let n = t, r = e, i = J(), a = _(() => r.tabs.filter((e) => e != null).map((e) => e instanceof $ ? e : new $(e))), o = _(() => (a.value.find((e) => e.isDefault) || a.value[0]).key), s = N(r.active), c = _({
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
			s.value == null && r.useRouteNav && l((r.useRouteNav ? i.currentRoute.value.hash?.substring(1) : null) || o.value);
		}), (e, t) => (M(), b("div", ht, [C(mt, {
			tabs: a.value,
			activeTab: c.value,
			onSelect: l
		}, null, 8, ["tabs", "activeTab"]), (M(!0), b(h, null, P(a.value, (t) => (M(), b(h, { key: t.key }, [c.value == t.key ? (M(), b("div", gt, [F(e.$slots, t.key)])) : y("", !0)], 64))), 128))]));
	}
});
//#endregion
export { le as A, xe as C, pe as D, ge as E, oe as O, we as S, ve as T, Le as _, lt as a, ke as b, Xe as c, qe as d, X as f, Re as g, Be as h, ut as i, se as k, Ze as l, He as m, $ as n, ct as o, Ue as p, ft as r, ot as s, _t as t, Je as u, Ie as v, be as w, De as x, Ae as y };
