import { isEmail as e, isIP as t, isPhone as n } from "../utilities/string-utility.js";
import { debounceToPromise as r } from "../utilities/promise-utility.js";
import { n as i, t as a } from "./clipboard-utility-3.2.5.js";
import { useEventListener as o, useVModelField as s } from "../vue/vue-helper.js";
import { n as c, t as l } from "./DefaultModal-3.2.5.js";
import { t as u } from "./Icon-3.2.5.js";
import { t as d } from "./IconButton-3.2.5.js";
import { t as f } from "./_plugin-vue_export-helper-3.2.5.js";
import "./feedback-3.2.5.js";
import "../vue/ui/modal/index.js";
import { dateInputString as p } from "../vue/formatters/index.js";
import "./icons-3.2.5.js";
import { Fragment as m, Teleport as h, computed as g, createBlock as _, createCommentVNode as v, createElementBlock as y, createElementVNode as b, createTextVNode as x, createVNode as S, defineComponent as C, getCurrentInstance as w, inject as T, isRef as E, mergeDefaults as D, mergeModels as O, mergeProps as k, normalizeClass as A, normalizeStyle as j, onMounted as M, onUnmounted as ee, openBlock as N, ref as P, renderList as F, renderSlot as I, resolveComponent as L, resolveDirective as te, resolveDynamicComponent as R, toDisplayString as z, toRefs as B, unref as V, useModel as ne, vModelText as re, vShow as H, watch as U, watchEffect as ie, withCtx as W, withDirectives as G, withKeys as K, withModifiers as q } from "vue";
import { useRouter as J } from "vue-router";
import { isValid as Y } from "date-fns";
//#region src/vue/ui/autocomplete/autocomplete.ts
var X = [
	"update:modelValue",
	"update:idValue",
	"select",
	"qInput"
], ae = {
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
}, oe = {
	data: () => [],
	maxResults: 10,
	debounceTime: 250,
	autoSelect: !1
};
function se(e, { emit: t }) {
	let n = P(""), a = P(-1), s = P(e.data), c = P(!1), l = P(!1), u = P(!1), d = g({
		get: () => e.modelValue,
		set: (n) => {
			e.modelValue !== n && (t("update:modelValue", n), t("update:idValue", y(n)), t("select", n));
		}
	}), f = g(() => y(d.value)), p = P(), m = P({
		top: 0,
		left: 0
	}), h = P({
		top: 0,
		left: 0
	}), _ = P({
		top: 0,
		left: 0
	}), v = g(() => {
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
		F(), u.value = !0, s.value = void 0;
		try {
			let n = await R(t), r = e.maxResults || n.length;
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
	function N(e) {
		let t = 0, n = 0;
		do
			t += e?.offsetTop || 0, n += e?.offsetLeft || 0, e = e?.offsetParent;
		while (e);
		return {
			top: t,
			left: n
		};
	}
	function F() {
		z(), c.value = !0;
	}
	function I() {
		c.value = !1;
	}
	function L() {
		c.value && setTimeout(() => {
			w(!0), d.value ?? (n.value = ""), I();
		}, 250);
	}
	function te(e) {
		throw e;
	}
	let R = r(e.search || e.data && S || te(/* @__PURE__ */ Error("prop search or data is required")), e.debounceTime), z = () => {
		m.value = N(p.value), _.value = p.value ? i(p.value) : {
			top: 0,
			left: 0
		};
	}, B = r(z, 50);
	return o(window, "resize", B), M(() => {
		n.value = x(d.value), z(), document.addEventListener("scroll", B, !0);
	}), ee(() => {
		document.removeEventListener("scroll", B, !0);
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
		openResults: F,
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
var ce = { class: "loading list-group-item" }, le = ["onClick"], ue = ["innerHTML"], de = /* @__PURE__ */ C({
	inheritAttrs: !1,
	inheritAttrs: !1,
	__name: "Autocomplete",
	props: /*@__PURE__*/ D({
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
	}, { ...oe }),
	emits: X,
	setup(e, { expose: t, emit: n }) {
		let r = n, i = e, { q: a, selectedItem: o, selectedIndex: s, items: c, isFocus: l, inputEl: u, resultStyle: d, isLoading: f, resultItemFormatter: p, closeGently: h, moveSelection: g, handleInput: _, handleChange: v, handleSelect: x, handleSearch: S, reset: C } = se(i, { emit: r });
		function w() {
			l.value = !0, ((i.idSelector && i.idSelector(o.value) || "new") == "new" || o.value == null) && S();
		}
		function T() {
			l.value = !1;
		}
		function D() {
			i.enableDblClick && S("");
		}
		function O(e) {
			e.target != u.value && h();
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
			let r = te("click-outside");
			return N(), y(m, null, [G(b("input", k({
				autocomplete: "__away",
				type: "text"
			}, t.$attrs, {
				"onUpdate:modelValue": n[0] ||= (e) => E(a) ? a.value = e : null,
				onInput: n[1] ||= (...e) => V(_) && V(_)(...e),
				onFocus: w,
				onDblclick: D,
				onBlur: T,
				onChange: n[2] ||= (...e) => V(v) && V(v)(...e),
				onKeydown: [
					n[3] ||= K((e) => V(g)(1), ["down"]),
					n[4] ||= K((e) => V(g)(-1), ["up"]),
					n[5] ||= K(q((e) => V(x)(V(o), V(s)), ["prevent"]), ["enter"])
				],
				ref_key: "inputEl",
				ref: u
			}), null, 16), [[re, V(a)]]), G((N(), y("div", {
				class: A(["autocomplete-items bg-white border", e.resultClass]),
				style: j(V(d))
			}, [b("div", { class: A(["list-group", e.itemsClass]) }, [G(b("div", ce, "Loading...", 512), [[H, V(f)]]), (N(!0), y(m, null, F(V(c), (n, r) => (N(), y("div", {
				key: r,
				onClick: (e) => V(x)(n, r),
				class: A(["autocomplete-item list-group-item list-group-item-action", [e.itemClass, { "bg-light": r == V(s) }]])
			}, [I(t.$slots, "default", {
				item: n,
				q: V(a)
			}, () => [b("div", { innerHTML: V(p)(n, V(a)) }, null, 8, ue)])], 10, le))), 128))], 2)], 6)), [[r, O]])], 64);
		};
	}
}), fe = ["name"], pe = {
	key: 1,
	class: "ms-1"
}, me = /* @__PURE__ */ C({
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
		let n = t, r = P(!1);
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
		return (t, n) => (N(), y("button", {
			type: "button",
			class: "btn",
			name: e.icon,
			onClick: a
		}, [I(t.$slots, "button-content", {}, () => [e.icon == null ? v("", !0) : (N(), _(u, {
			key: 0,
			name: e.icon
		}, null, 8, ["name"])), e.buttonLabel ? (N(), y("span", pe, z(e.buttonLabel), 1)) : v("", !0)]), (N(), _(h, { to: "#modals" }, [I(t.$slots, "modal", {}, () => [S(l, {
			"is-visible": r.value,
			type: e.modalType,
			title: e.modalTitle,
			onSubmit: i,
			onCancel: o,
			onClose: s
		}, {
			default: W(() => [I(t.$slots, "default")]),
			_: 3
		}, 8, [
			"is-visible",
			"type",
			"title"
		])])]))], 8, fe));
	}
}), he = ["href"], ge = /* @__PURE__ */ C({
	__name: "Anchor",
	props: { href: {} },
	setup(r) {
		let i = r, a = g(() => {
			let r = i.href;
			return e(r) ? r.startsWith("mailto:") || (r = "mailto:" + r) : t(r) ? r = "http://" + r : n(r) ? r.startsWith("tel:") || (r = "tel:" + r) : !r.startsWith("http") && ![
				"mailto:",
				"tel:",
				"ftp:"
			].some((e) => r.startsWith(e)) && (r = "http://" + r), r;
		});
		return (e, t) => (N(), y("a", { href: a.value }, [I(e.$slots, "default")], 8, he));
	}
}), _e = ["value", "lang"], ve = /* @__PURE__ */ C({
	__name: "DateInput",
	props: {
		modelValue: {},
		culture: {}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = g(() => Y(new Date(r.modelValue || ""))), a = g(() => i.value ? p(new Date(r.modelValue)) : r.modelValue), o = (e) => {
			let t = new Date(e.target.value);
			(!e.target.value || Y(t)) && n("update:modelValue", t || e.target.value);
		};
		return (t, n) => (N(), y("input", {
			type: "date",
			value: a.value,
			onChange: o,
			lang: e.culture,
			class: A({ "is-invalid": a.value && !i.value })
		}, null, 42, _e));
	}
}), ye = /* @__PURE__ */ C({
	__name: "FormLabel",
	props: {
		label: {},
		autoHide: {
			type: Boolean,
			default: !1
		}
	},
	setup(e) {
		return (t, n) => (N(), y("small", { class: A(["form-text text-muted", e.autoHide ? "d-none d-md-inline" : "d-inline"]) }, z(e.label), 3));
	}
}), be = { class: "description-input" }, xe = ["readonly"], Se = /* @__PURE__ */ C({
	__name: "DescriptionInput",
	props: /*@__PURE__*/ O({
		label: {},
		readonly: { type: Boolean }
	}, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = ne(e, "modelValue");
		return (n, r) => (N(), y("div", be, [G(b("textarea", {
			"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
			readonly: e.readonly,
			class: "form-control",
			rows: "3"
		}, null, 8, xe), [[re, t.value]]), e.label ? (N(), _(ye, {
			key: 0,
			label: e.label
		}, null, 8, ["label"])) : v("", !0)]));
	}
}), Ce = { class: "form-buttons btn-group" }, we = {
	key: 0,
	type: "submit",
	class: "btn btn-primary"
}, Te = /* @__PURE__ */ C({
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
		let n = e, r = t, i = g(() => n.item?.isArchived === !0);
		return (t, n) => (N(), y("div", Ce, [
			e.readonly ? v("", !0) : (N(), y("button", we, "Save")),
			b("button", {
				type: "button",
				class: "btn btn-link",
				onClick: n[0] ||= (e) => r("cancel")
			}, "Cancel"),
			e.showDelete && !i.value ? (N(), y("button", {
				key: 1,
				type: "button",
				class: "btn btn-outline-danger",
				onClick: n[1] ||= (e) => r("remove")
			}, "Delete")) : v("", !0),
			i.value ? (N(), y("button", {
				key: 2,
				type: "button",
				class: "btn btn-outline-secondary",
				onClick: n[2] ||= (e) => r("restore")
			}, "Restore")) : v("", !0)
		]));
	}
}), Ee = ["checked"], De = /* @__PURE__ */ C({
	name: "NullableCheckBox",
	props: { modelValue: { type: [
		Boolean,
		String,
		Number
	] } },
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = P(null), a = P(((e) => {
			if (e != null) return typeof e == "string" ? e === "true" ? !0 : e === "false" ? !1 : void 0 : new Boolean(e).valueOf();
		})(r.modelValue)), o = g({
			get() {
				return a.value;
			},
			set(e) {
				a.value = e, n("update:modelValue", e), n("change", { target: i.value });
			}
		}), s = g(() => ({ opacity: o.value == null ? .5 : 1 }));
		function c() {
			o.value = o.value == null ? !0 : o.value ? !1 : void 0;
		}
		return ie(() => i.value && (i.value.indeterminate = o.value === void 0)), (e, t) => (N(), y("input", {
			type: "checkbox",
			ref_key: "input",
			ref: i,
			onClick: c,
			"true-value": !0,
			checked: o.value,
			style: j(s.value)
		}, null, 12, Ee));
	}
}), Oe = /* @__PURE__ */ C({
	__name: "NullableLabel",
	props: { label: {} },
	setup(e) {
		return (t, n) => (N(), y("span", { class: A({ "italic-muted": !e.label }) }, [e.label ? (N(), y(m, { key: 0 }, [x(z(e.label), 1)], 64)) : I(t.$slots, "default", { key: 1 })], 2));
	}
}), ke = { class: "form-section" }, Ae = { class: "form-section-title" }, je = { class: "row" }, Me = { class: "p-2 mb-2" }, Ne = { class: "col-auto" }, Pe = /* @__PURE__ */ C({
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
		let n = t, r = e, i = w(), a = P(r.collapsed), o = P(r.readonly || r.showSummary), s = g({
			get: () => i?.slots.summary && (r.readonly || o.value),
			set: (e) => o.value = !!e
		});
		function c() {
			a.value = !a.value, a.value ? n("collapse") : n("expand");
		}
		return U(() => r.collapsed, () => {
			a.value = r.collapsed, a.value ? n("collapse") : n("expand");
		}), (t, n) => (N(), y("div", ke, [b("div", Ae, [I(t.$slots, "header", {
			collapsed: a.value,
			showSummary: s.value
		}, () => [b("div", je, [b("div", {
			class: "col",
			onClick: n[0] ||= (e) => s.value = !s.value
		}, [I(t.$slots, "title", { showSummary: s.value }, () => [b("h3", Me, z(e.title), 1)])]), b("div", Ne, [!e.readonly && t.$slots.summary ? (N(), y("button", {
			key: 0,
			type: "button",
			class: "btn btn-default my-2 px-2 py-1 opacity-50",
			onClick: n[1] ||= q((e) => s.value = !s.value, ["stop"])
		}, [S(u, { name: s.value ? "look" : "edit" }, null, 8, ["name"])])) : v("", !0), b("button", {
			type: "button",
			class: "btn btn-default my-2 px-2 py-1 opacity-50",
			onClick: q(c, ["stop"])
		}, [S(u, { name: a.value ? "maximize" : "minimize" }, null, 8, ["name"])])])])])]), G(b("div", { class: A(["form-section-body", s.value && e.summaryClass]) }, [
			!t.$slots.summary || !s.value ? I(t.$slots, "default", {
				key: 0,
				collapsed: a.value
			}) : v("", !0),
			t.$slots.summary && s.value ? I(t.$slots, "summary", {
				key: 1,
				collapsed: a.value
			}) : v("", !0),
			I(t.$slots, "always")
		], 2), [[H, !a.value]])]));
	}
}), Fe = /* @__PURE__ */ C({
	__name: "FileDropZone",
	emits: ["drop-files"],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = P();
		async function a(e) {
			r("drop-files", [...e.dataTransfer.files]);
		}
		return t({ isDropping: i }), (e, t) => (N(), y("div", {
			onDrop: q(a, ["prevent"]),
			onDragover: t[0] ||= q((e) => i.value = !0, ["prevent"]),
			onDragleave: t[1] ||= q((e) => i.value = !1, ["prevent"])
		}, [I(e.$slots, "default", { isDropping: i.value })], 32));
	}
}), Ie = /* @__PURE__ */ C({
	__name: "CopyToClipboardButton",
	props: {
		value: {},
		timeout: { default: 2500 }
	},
	setup(e, { expose: t }) {
		let n = e, r = P();
		function i() {
			a(n.value ?? ""), r.value = !0, setTimeout(() => r.value = void 0, n.timeout);
		}
		return t({ success: r }), (e, t) => (N(), _(d, {
			icon: r.value ? "check" : "copy",
			disabled: r.value,
			onClick: i
		}, null, 8, ["icon", "disabled"]));
	}
}), Le = ["src"], Re = /* @__PURE__ */ C({
	__name: "GMap",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = g(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = g(() => `https://maps.google.com/maps?q=${encodeURIComponent(n.value)}&t=&z=${t.zoom || 10}&ie=UTF8&iwloc=&output=embed`);
		return (e, t) => (N(), y("iframe", {
			src: r.value,
			frameborder: "0",
			scrolling: "no",
			marginheight: "0",
			marginwidth: "0",
			allowfullscreen: ""
		}, null, 8, Le));
	}
}), ze = ["href"], Be = /* @__PURE__ */ C({
	__name: "GmapLink",
	props: { modelValue: {} },
	setup(e) {
		let t = e, n = g(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" "));
		return (e, t) => (N(), y("a", { href: `https://www.google.com/maps/?q=${n.value}` }, [S(u, { name: "map" }), I(e.$slots, "default")], 8, ze));
	}
}), Ve = /*#__PURE__*/ f(/* @__PURE__ */ C({
	__name: "ModalButton",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = g(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = P(!1);
		return (t, i) => (N(), y("button", {
			type: "button",
			onClick: i[1] ||= (e) => r.value = !0
		}, [I(t.$slots, "default", {}, () => [S(u, { name: "map" })], !0), (N(), _(h, { to: "#modals" }, [S(V(l), {
			"is-visible": r.value,
			title: n.value,
			"show-footer": !1,
			"full-width": !0,
			onClose: i[0] ||= (e) => r.value = !1
		}, {
			default: W(() => [S(Re, {
				id: "gmap_canvas",
				modelValue: e.modelValue,
				zoom: e.zoom,
				class: "w-100"
			}, null, 8, ["modelValue", "zoom"])]),
			_: 1
		}, 8, ["is-visible", "title"])]))]));
	}
}), [["__scopeId", "data-v-998cd3e5"]]), He = ["src"], Ue = /* @__PURE__ */ C({
	__name: "Loading",
	setup(e, { expose: t }) {
		let n = T("loadingImg"), r = P(null);
		return t({
			imgEl: r,
			dimensions: () => [r.value?.width, r.value?.height],
			height: () => r.value?.naturalHeight
		}), (e, t) => (N(), y("img", {
			src: V(n),
			ref_key: "imgEl",
			ref: r
		}, null, 8, He));
	}
}), We = /* @__PURE__ */ C({
	__name: "LoadingContainer",
	props: { isLoading: { type: Boolean } },
	setup(e, { expose: t }) {
		let n = P(null), r = P(null);
		function i() {
			return r.value?.imgEl?.width;
		}
		return t({
			containerEl: n,
			loadingImgEl: r.value?.imgEl
		}), (t, a) => (N(), y("div", {
			class: "position-relative",
			style: j({ height: e.isLoading ? `${i()}px` : void 0 }),
			ref_key: "containerEl",
			ref: n
		}, [I(t.$slots, "loading", {}, () => [e.isLoading ? (N(), _(Ue, {
			key: 0,
			class: "position-absolute top-0 start-50 translate-middle-x",
			style: {
				width: "20rem",
				"max-width": "100%"
			},
			ref_key: "loadingEl",
			ref: r
		}, null, 512)) : v("", !0)]), b("div", { style: j({ opacity: e.isLoading ? "0.4" : "" }) }, [I(t.$slots, "default")], 4)], 4));
	}
}), Ge = { install(e, t) {
	e.provide("loadingImg", t.img);
} }, Ke = { PAGESIZE: 10 }, qe = /* @__PURE__ */ function(e) {
	return e.anchor = "Anchor", e.button = "Button", e;
}({}), Je = {
	maxPages: 9,
	buttonType: "Anchor"
};
function Ye({ pagingInfo: e, count: t, maxPages: n, emit: r }) {
	n = window.innerWidth < 576 ? Math.ceil(n / 2) : n;
	let i = g(() => (isNaN(parseInt(e.value.pageSize + "")) ? null : e.value.pageSize) || Ke.PAGESIZE), a = J();
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
	let s = g(() => e.value.page || 1), c = g(() => Math.ceil(t.value / i.value)), l = g(() => Math.min(c.value, n)), u = g(() => {
		let e = Math.floor(l.value / 2), t = Math.max(s.value - e, 1);
		return t + n > c.value && (t -= t + n - c.value - 1), Math.max(t, 1);
	}), d = g(() => Math.min(u.value + l.value, c.value)), f = g(() => !isNaN(l.value) && l.value > 0 ? Array(l.value).fill(0).map((e, t) => u.value + t).filter((e) => e <= d.value) : []);
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
var Xe = /* @__PURE__ */ C({
	__name: "PagingAnchor",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => {
			let r = L("RouterLink");
			return N(), _(r, {
				class: "page-link",
				to: e.to,
				title: "page " + e.page,
				activeClass: "active-page"
			}, {
				default: W(() => [I(t.$slots, "default", {}, () => [x(z(e.page), 1)])]),
				_: 3
			}, 8, ["to", "title"]);
		};
	}
}), Ze = ["title"], Qe = /* @__PURE__ */ C({
	__name: "PagingButton",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => (N(), y("button", {
			type: "button",
			class: "btn btn-link page-link",
			title: "page " + e.page
		}, [I(t.$slots, "default", {}, () => [x(z(e.page), 1)])], 8, Ze));
	}
}), $e = { "aria-label": "Pagination" }, et = { class: "pagination" }, tt = { class: "page-item" }, nt = { class: "page-item" }, rt = /* @__PURE__ */ C({
	__name: "Paging",
	props: /*@__PURE__*/ D({
		modelValue: {},
		count: {},
		maxPages: {},
		buttonType: {}
	}, { ...Je }),
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = s(r, n), { count: a } = B(r), o = r.buttonType == qe.button ? Qe : Xe, { pagedRoute: c, page: l, totalPages: u, pages: d, handleChangePage: f } = Ye({
			pagingInfo: i,
			count: a,
			maxPages: r.maxPages,
			emit: n
		});
		return (e, t) => (N(), y("nav", $e, [b("ul", et, [
			b("li", tt, [I(e.$slots, "firstPage", { page: 1 }, () => [(N(), _(R(V(o)), {
				page: 1,
				to: V(c)(1),
				onClick: t[0] ||= q((e) => V(f)(1), ["prevent"]),
				"aria-label": "Previous"
			}, {
				default: W(() => [...t[2] ||= [x("«", -1)]]),
				_: 1
			}, 8, ["to"]))])]),
			(N(!0), y(m, null, F(V(d), (t) => (N(), y("li", {
				class: A(["page-item", { active: t == V(l) }]),
				key: t
			}, [I(e.$slots, "default", {
				page: t,
				route: V(c)(t),
				handleChange: V(f)
			}, () => [(N(), _(R(V(o)), {
				page: t,
				to: V(c)(t),
				onClick: q((e) => V(f)(t), ["prevent"])
			}, {
				default: W(() => [x(z(t), 1)]),
				_: 2
			}, 1032, [
				"page",
				"to",
				"onClick"
			]))])], 2))), 128)),
			b("li", nt, [I(e.$slots, "lastPage", { page: V(u) }, () => [(N(), _(R(V(o)), {
				page: V(u),
				to: V(c)(V(u)),
				onClick: t[1] ||= q((e) => V(f)(V(u)), ["prevent"]),
				"aria-label": "Next"
			}, {
				default: W(() => [...t[3] ||= [x(" » ", -1)]]),
				_: 1
			}, 8, ["page", "to"]))])])
		])]));
	}
}), it = { class: "result-summary text-muted small" }, at = /* @__PURE__ */ C({
	__name: "ResultSummary",
	props: {
		visibleCount: {},
		totalCount: {}
	},
	setup(e) {
		return (t, n) => (N(), y("span", it, z(e.visibleCount ?? 0) + " / " + z(e.totalCount ?? 0), 1));
	}
}), ot = { install(e, { defaultPageSize: t = 10 } = {}) {
	Ke.PAGESIZE = t;
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
function st() {
	let e = P(Z());
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
function ct(e, t) {
	let n;
	return (...r) => {
		n && clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
var lt = { install: (e, { sizes: t } = {}) => {
	if (t) for (let e in t) e in Q && (Q[e] = t[e]);
	let { screen: n } = st(), r = ct(() => n.updateSize(Z()), 250);
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
}, ut = ["href", "onClick"], dt = /* @__PURE__ */ C({
	__name: "TabNavigation",
	props: {
		tabs: {},
		activeTab: {}
	},
	emits: ["select"],
	setup(e) {
		let t = g(() => (e) => typeof e.isVisible == "function" ? e.isVisible() : e.isVisible);
		return (n, r) => (N(), y("ul", { class: A(["nav", {
			"nav-pills": !n.$screen?.isLarge,
			"nav-tabs": n.$screen?.isLarge
		}]) }, [(N(!0), y(m, null, F(e.tabs, (r) => (N(), y(m, { key: r.key }, [t.value(r) ? (N(), y("li", {
			key: 0,
			class: A(["nav-item", { disabled: r.isDisabled }])
		}, [b("a", {
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
		}, [r.icon ? (N(), _(u, {
			key: 0,
			name: r.icon
		}, null, 8, ["name"])) : v("", !0), b("span", { class: A({ "d-none d-lg-inline ms-1": r.icon }) }, z(r.title), 3)], 10, ut)], 2)) : v("", !0)], 64))), 128))], 2));
	}
}), ft = { class: "tab-container" }, pt = {
	key: 0,
	class: "tab-content pt-2"
}, mt = /* @__PURE__ */ C({
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
		let n = t, r = e, i = J(), a = g(() => r.tabs.filter((e) => e != null).map((e) => e instanceof $ ? e : new $(e))), o = g(() => (a.value.find((e) => e.isDefault) || a.value[0]).key), s = P(r.active), c = g({
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
		return M(() => {
			s.value == null && r.useRouteNav && l((r.useRouteNav ? i.currentRoute.value.hash?.substring(1) : null) || o.value);
		}), (e, t) => (N(), y("div", ft, [S(dt, {
			tabs: a.value,
			activeTab: c.value,
			onSelect: l
		}, null, 8, ["tabs", "activeTab"]), (N(!0), y(m, null, F(a.value, (t) => (N(), y(m, { key: t.key }, [c.value == t.key ? (N(), y("div", pt, [I(e.$slots, t.key)])) : v("", !0)], 64))), 128))]));
	}
});
//#endregion
export { se as A, ye as C, de as D, me as E, X as O, Se as S, ge as T, Fe as _, ot as a, De as b, qe as c, We as d, Ue as f, Ie as g, Re as h, st as i, ae as k, Je as l, Be as m, $ as n, at as o, Ve as p, lt as r, rt as s, mt as t, Ge as u, Pe as v, ve as w, Te as x, Oe as y };
