import { isEmail as e, isIP as t, isPhone as n } from "../utilities/string-utility.js";
import { debounceToPromise as r } from "../utilities/promise-utility.js";
import { n as i, t as a } from "./clipboard-utility-3.2.5.js";
import { useEventListener as o, useVModelField as s } from "../vue/vue-helper.js";
import { n as c, t as l } from "./DefaultModal-3.2.5.js";
import { t as u } from "./Icon-3.2.5.js";
import { t as d } from "./IconButton-3.2.5.js";
import { t as f } from "./_plugin-vue_export-helper-3.2.5.js";
import { n as p } from "./ioc-3.2.5.js";
import { r as m } from "./feedback-3.2.5.js";
import "./modal-3.2.5.js";
import { dateInputString as h } from "../vue/formatters/index.js";
import "./icons-3.2.5.js";
import { Fragment as g, Teleport as _, computed as v, createBlock as y, createCommentVNode as b, createElementBlock as x, createElementVNode as S, createTextVNode as C, createVNode as w, defineComponent as T, getCurrentInstance as E, inject as D, isRef as O, mergeDefaults as k, mergeModels as A, mergeProps as j, normalizeClass as M, normalizeStyle as N, onMounted as ee, onUnmounted as te, openBlock as P, ref as F, renderList as I, renderSlot as L, resolveComponent as R, resolveDirective as z, resolveDynamicComponent as B, toDisplayString as V, toRefs as ne, unref as H, useModel as re, vModelText as U, vShow as ie, watch as W, watchEffect as ae, withCtx as G, withDirectives as K, withKeys as q, withModifiers as J } from "vue";
import { useRouter as oe } from "vue-router";
import { isValid as se } from "date-fns";
//#region src/vue/ui/autocomplete/autocomplete.ts
var ce = [
	"update:modelValue",
	"update:idValue",
	"select",
	"qInput"
], le = {
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
}, ue = {
	data: () => [],
	maxResults: 10,
	debounceTime: 250,
	autoSelect: !1
};
function de(e, { emit: t }) {
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
	}), y = e.idSelector || ((e) => e), b = e.resultItemFormatter || ((e, t) => (e || "").toString()), x = e.displayItemFormatter || b;
	async function S(t = "") {
		return e.data?.filter((e) => b(e, n.value).toLowerCase().startsWith(t.toLowerCase()));
	}
	async function C(t = n.value) {
		N(), u.value = !0, s.value = void 0;
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
		P(), O(e, e ? t : -1);
	}
	function O(e, t) {
		if (e == null && t == null) {
			A(), n.value || P();
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
		n.value = "", A(), P();
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
	function N() {
		z(), c.value = !0;
	}
	function P() {
		c.value = !1;
	}
	function I() {
		c.value && setTimeout(() => {
			w(!0), d.value ?? (n.value = ""), P();
		}, 250);
	}
	function L(e) {
		throw e;
	}
	let R = r(e.search || e.data && S || L(/* @__PURE__ */ Error("prop search or data is required")), e.debounceTime), z = () => {
		m.value = M(p.value), g.value = p.value ? i(p.value) : {
			top: 0,
			left: 0
		};
	}, B = r(z, 50);
	return o(window, "resize", B), ee(() => {
		n.value = x(d.value), z(), document.addEventListener("scroll", B, !0);
	}), te(() => {
		document.removeEventListener("scroll", B, !0);
	}), W(d, (e, t) => {
		e != t && e != d.value && O(e), e && (n.value = x(d.value));
	}), W(n, () => t("qInput", n.value || "")), {
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
		displayItemFormatter: x,
		resultItemFormatter: b,
		handleInput: T,
		handleChange: E,
		handleSelect: D,
		handleSearch: C,
		openResults: N,
		closeResults: P,
		closeGently: I,
		moveSelection: k,
		checkMatch: w,
		clearSelection: A,
		reset: j
	};
}
//#endregion
//#region src/vue/ui/autocomplete/Autocomplete.vue?vue&type=script&setup=true&lang.ts
var fe = { class: "loading list-group-item" }, pe = ["onClick"], me = ["innerHTML"], he = /* @__PURE__ */ T({
	inheritAttrs: !1,
	inheritAttrs: !1,
	__name: "Autocomplete",
	props: /* @__PURE__ */ k({
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
	}, { ...ue }),
	emits: ce,
	setup(e, { expose: t, emit: n }) {
		let r = n, i = e, { q: a, selectedItem: o, selectedIndex: s, items: c, isFocus: l, inputEl: u, resultStyle: d, isLoading: f, resultItemFormatter: p, closeGently: m, moveSelection: h, handleInput: _, handleChange: v, handleSelect: y, handleSearch: b, reset: C } = de(i, { emit: r });
		function w() {
			l.value = !0, ((i.idSelector && i.idSelector(o.value) || "new") == "new" || o.value == null) && b();
		}
		function T() {
			l.value = !1;
		}
		function E() {
			i.enableDblClick && b("");
		}
		function D(e) {
			e.target != u.value && m();
		}
		return t({
			inputEl: u,
			q: a,
			selectedItem: o,
			search: b,
			reset: C,
			resetQ() {
				l.value || (a.value = "");
			}
		}), (t, n) => {
			let r = z("click-outside");
			return P(), x(g, null, [K(S("input", j({
				autocomplete: "__away",
				type: "text"
			}, t.$attrs, {
				"onUpdate:modelValue": n[0] ||= (e) => O(a) ? a.value = e : null,
				onInput: n[1] ||= (...e) => H(_) && H(_)(...e),
				onFocus: w,
				onDblclick: E,
				onBlur: T,
				onChange: n[2] ||= (...e) => H(v) && H(v)(...e),
				onKeydown: [
					n[3] ||= q((e) => H(h)(1), ["down"]),
					n[4] ||= q((e) => H(h)(-1), ["up"]),
					n[5] ||= q(J((e) => H(y)(H(o), H(s)), ["prevent"]), ["enter"])
				],
				ref_key: "inputEl",
				ref: u
			}), null, 16), [[U, H(a)]]), K((P(), x("div", {
				class: M(["autocomplete-items bg-white border", e.resultClass]),
				style: N(H(d))
			}, [S("div", { class: M(["list-group", e.itemsClass]) }, [K(S("div", fe, "Loading...", 512), [[ie, H(f)]]), (P(!0), x(g, null, I(H(c), (n, r) => (P(), x("div", {
				key: r,
				onClick: (e) => H(y)(n, r),
				class: M(["autocomplete-item list-group-item list-group-item-action", [e.itemClass, { "bg-light": r == H(s) }]])
			}, [L(t.$slots, "default", {
				item: n,
				q: H(a)
			}, () => [S("div", { innerHTML: H(p)(n, H(a)) }, null, 8, me)])], 10, pe))), 128))], 2)], 6)), [[r, D]])], 64);
		};
	}
}), ge = ["name"], _e = {
	key: 1,
	class: "ms-1"
}, ve = /* @__PURE__ */ T({
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
		return (t, n) => (P(), x("button", {
			type: "button",
			class: "btn",
			name: e.icon,
			onClick: a
		}, [L(t.$slots, "button-content", {}, () => [e.icon == null ? b("", !0) : (P(), y(u, {
			key: 0,
			name: e.icon
		}, null, 8, ["name"])), e.buttonLabel ? (P(), x("span", _e, V(e.buttonLabel), 1)) : b("", !0)]), (P(), y(_, { to: "#modals" }, [L(t.$slots, "modal", {}, () => [w(l, {
			"is-visible": r.value,
			type: e.modalType,
			title: e.modalTitle,
			onSubmit: i,
			onCancel: o,
			onClose: s
		}, {
			default: G(() => [L(t.$slots, "default")]),
			_: 3
		}, 8, [
			"is-visible",
			"type",
			"title"
		])])]))], 8, ge));
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
		return (e, t) => (P(), x("a", { href: a.value }, [L(e.$slots, "default")], 8, ye));
	}
}), xe = ["value", "lang"], Se = /* @__PURE__ */ T({
	__name: "DateInput",
	props: {
		modelValue: {},
		culture: {}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = v(() => se(new Date(r.modelValue || ""))), a = v(() => i.value ? h(new Date(r.modelValue)) : r.modelValue), o = (e) => {
			let t = new Date(e.target.value);
			(!e.target.value || se(t)) && n("update:modelValue", t || e.target.value);
		};
		return (t, n) => (P(), x("input", {
			type: "date",
			class: M(["form-control", { "is-invalid": a.value && !i.value }]),
			value: a.value,
			onChange: o,
			lang: e.culture
		}, null, 42, xe));
	}
}), Ce = /* @__PURE__ */ T({
	__name: "FormLabel",
	props: {
		label: {},
		autoHide: {
			type: Boolean,
			default: !1
		}
	},
	setup(e) {
		return (t, n) => (P(), x("small", { class: M(["form-text text-muted", e.autoHide ? "d-none d-md-inline" : "d-inline"]) }, V(e.label), 3));
	}
}), we = { class: "description-input" }, Te = ["readonly"], Ee = /* @__PURE__ */ T({
	__name: "DescriptionInput",
	props: /* @__PURE__ */ A({
		label: {},
		readonly: { type: Boolean }
	}, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = re(e, "modelValue");
		return (n, r) => (P(), x("div", we, [K(S("textarea", {
			"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
			readonly: e.readonly,
			class: "form-control",
			rows: "3"
		}, null, 8, Te), [[U, t.value]]), e.label ? (P(), y(Ce, {
			key: 0,
			label: e.label
		}, null, 8, ["label"])) : b("", !0)]));
	}
}), De = { class: "form-buttons d-flex flex-wrap gap-2" }, Oe = { class: "d-none d-md-inline ms-1" }, ke = { class: "d-none d-md-inline ms-1" }, Ae = { class: "d-none d-md-inline ms-1" }, je = { class: "d-none d-md-inline ms-1" }, Me = /* @__PURE__ */ T({
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
		return (t, n) => (P(), x("div", De, [
			e.readonly ? b("", !0) : (P(), y(d, {
				key: 0,
				type: "submit",
				icon: "save",
				class: "btn-primary",
				disabled: o.value
			}, {
				default: G(() => [S("span", Oe, V(e.labels?.save ?? "Save"), 1)]),
				_: 1
			}, 8, ["disabled"])),
			w(d, {
				type: "button",
				icon: "cancel",
				class: "btn-secondary",
				onClick: n[0] ||= (e) => r("cancel")
			}, {
				default: G(() => [S("span", ke, V(e.labels?.cancel ?? "Cancel"), 1)]),
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
				"button-content": G(() => [w(u, { name: "delete" }), S("span", Ae, V(e.labels?.delete ?? "Delete"), 1)]),
				default: G(() => [L(t.$slots, "delete", {}, () => [C("Delete " + V(a.value) + "?", 1)])]),
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
				default: G(() => [S("span", je, V(e.labels?.restore ?? "Restore"), 1)]),
				_: 1
			}, 8, ["disabled"])) : b("", !0)
		]));
	}
}), Ne = ["checked"], Pe = /* @__PURE__ */ T({
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
		return ae(() => i.value && (i.value.indeterminate = o.value === void 0)), (e, t) => (P(), x("input", {
			type: "checkbox",
			ref_key: "input",
			ref: i,
			onClick: c,
			"true-value": !0,
			checked: o.value,
			style: N(s.value)
		}, null, 12, Ne));
	}
}), Fe = /* @__PURE__ */ T({
	__name: "NullableLabel",
	props: { label: {} },
	setup(e) {
		return (t, n) => (P(), x("span", { class: M({ "italic-muted": !e.label }) }, [e.label ? (P(), x(g, { key: 0 }, [C(V(e.label), 1)], 64)) : L(t.$slots, "default", { key: 1 })], 2));
	}
}), Ie = { class: "form-section" }, Le = { class: "form-section-title" }, Re = { class: "row" }, ze = { class: "p-2 mb-2" }, Be = { class: "col-auto" }, Ve = /* @__PURE__ */ T({
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
			get: () => i?.slots.summary && (r.readonly || o.value),
			set: (e) => o.value = !!e
		});
		function c() {
			a.value = !a.value, a.value ? n("collapse") : n("expand");
		}
		return W(() => r.collapsed, () => {
			a.value = r.collapsed, a.value ? n("collapse") : n("expand");
		}), (t, n) => (P(), x("div", Ie, [S("div", Le, [L(t.$slots, "header", {
			collapsed: a.value,
			showSummary: s.value
		}, () => [S("div", Re, [S("div", {
			class: "col",
			onClick: n[0] ||= (e) => s.value = !s.value
		}, [L(t.$slots, "title", { showSummary: s.value }, () => [S("h3", ze, V(e.title), 1)])]), S("div", Be, [!e.readonly && t.$slots.summary ? (P(), x("button", {
			key: 0,
			type: "button",
			class: "btn btn-default my-2 px-2 py-1 opacity-50",
			onClick: n[1] ||= J((e) => s.value = !s.value, ["stop"])
		}, [w(u, { name: s.value ? "look" : "edit" }, null, 8, ["name"])])) : b("", !0), S("button", {
			type: "button",
			class: "btn btn-default my-2 px-2 py-1 opacity-50",
			onClick: J(c, ["stop"])
		}, [w(u, { name: a.value ? "maximize" : "minimize" }, null, 8, ["name"])])])])])]), K(S("div", { class: M(["form-section-body", s.value && e.summaryClass]) }, [
			!t.$slots.summary || !s.value ? L(t.$slots, "default", {
				key: 0,
				collapsed: a.value
			}) : b("", !0),
			t.$slots.summary && s.value ? L(t.$slots, "summary", {
				key: 1,
				collapsed: a.value
			}) : b("", !0),
			L(t.$slots, "always")
		], 2), [[ie, !a.value]])]));
	}
}), He = /* @__PURE__ */ T({
	__name: "FileDropZone",
	emits: ["drop-files"],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = F();
		async function a(e) {
			r("drop-files", [...e.dataTransfer.files]);
		}
		return t({ isDropping: i }), (e, t) => (P(), x("div", {
			onDrop: J(a, ["prevent"]),
			onDragover: t[0] ||= J((e) => i.value = !0, ["prevent"]),
			onDragleave: t[1] ||= J((e) => i.value = !1, ["prevent"])
		}, [L(e.$slots, "default", { isDropping: i.value })], 32));
	}
}), Ue = /* @__PURE__ */ T({
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
		return t({ success: r }), (e, t) => (P(), y(d, {
			icon: r.value ? "check" : "copy",
			disabled: r.value,
			onClick: i
		}, null, 8, ["icon", "disabled"]));
	}
}), We = ["src"], Ge = /* @__PURE__ */ T({
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
		}, null, 8, We));
	}
}), Ke = ["href"], qe = /* @__PURE__ */ T({
	__name: "GmapLink",
	props: { modelValue: {} },
	setup(e) {
		let t = e, n = v(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" "));
		return (e, t) => (P(), x("a", { href: `https://www.google.com/maps/?q=${n.value}` }, [w(u, { name: "map" }), L(e.$slots, "default")], 8, Ke));
	}
}), Je = /* @__PURE__ */ f(/* @__PURE__ */ T({
	__name: "ModalButton",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = v(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = F(!1);
		return (t, i) => (P(), x("button", {
			type: "button",
			onClick: i[1] ||= (e) => r.value = !0
		}, [L(t.$slots, "default", {}, () => [w(u, { name: "map" })], !0), (P(), y(_, { to: "#modals" }, [w(H(l), {
			"is-visible": r.value,
			title: n.value,
			"show-footer": !1,
			"full-width": !0,
			onClose: i[0] ||= (e) => r.value = !1
		}, {
			default: G(() => [w(Ge, {
				id: "gmap_canvas",
				modelValue: e.modelValue,
				zoom: e.zoom,
				class: "w-100"
			}, null, 8, ["modelValue", "zoom"])]),
			_: 1
		}, 8, ["is-visible", "title"])]))]));
	}
}), [["__scopeId", "data-v-d98fe386"]]), Ye = ["src"], Y = /* @__PURE__ */ T({
	__name: "Loading",
	setup(e, { expose: t }) {
		let n = D("loadingImg"), r = F(null);
		return t({
			imgEl: r,
			dimensions: () => [r.value?.width, r.value?.height],
			height: () => r.value?.naturalHeight
		}), (e, t) => (P(), x("img", {
			src: H(n),
			ref_key: "imgEl",
			ref: r
		}, null, 8, Ye));
	}
}), Xe = ["disabled"], Ze = /* @__PURE__ */ T({
	__name: "LoadingButton",
	props: {
		isLoading: { type: Boolean },
		disabled: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (P(), x("button", {
			type: "button",
			class: "btn",
			disabled: e.disabled || e.isLoading
		}, [e.isLoading ? L(t.$slots, "loading", { key: 0 }, () => [w(Y, { style: { width: "1rem" } })]) : L(t.$slots, "default", { key: 1 })], 8, Xe));
	}
}), Qe = /* @__PURE__ */ T({
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
			class: "position-relative",
			style: N({ height: e.isLoading ? `${i()}px` : void 0 }),
			ref_key: "containerEl",
			ref: n
		}, [L(t.$slots, "loading", {}, () => [e.isLoading ? (P(), y(Y, {
			key: 0,
			class: "position-absolute top-0 start-50 translate-middle-x",
			style: {
				width: "20rem",
				"max-width": "100%"
			},
			ref_key: "loadingEl",
			ref: r
		}, null, 512)) : b("", !0)]), S("div", { style: N({ opacity: e.isLoading ? "0.4" : "" }) }, [L(t.$slots, "default")], 4)], 4));
	}
}), $e = { install(e, t) {
	e.provide("loadingImg", t.img), p.registerComponentsGlobally && (e.component("Loading", Y), e.component("LoadingButton", Ze), e.component("LoadingContainer", Qe));
} }, et = { PAGESIZE: 10 }, X = /* @__PURE__ */ function(e) {
	return e.anchor = "Anchor", e.button = "Button", e;
}({}), tt = {
	maxPages: 9,
	buttonType: X.anchor
};
function nt({ pagingInfo: e, count: t, maxPages: n, emit: r }) {
	n = window.innerWidth < 576 ? Math.ceil(n / 2) : n;
	let i = v(() => (isNaN(parseInt(e.value.pageSize + "")) ? null : e.value.pageSize) || et.PAGESIZE), a = oe();
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
var rt = /* @__PURE__ */ T({
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
				default: G(() => [L(t.$slots, "default", {}, () => [C(V(e.page), 1)])]),
				_: 3
			}, 8, ["to", "title"]);
		};
	}
}), it = ["title"], at = /* @__PURE__ */ T({
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
		}, [L(t.$slots, "default", {}, () => [C(V(e.page), 1)])], 8, it));
	}
}), ot = { "aria-label": "Pagination" }, st = { class: "pagination" }, ct = { class: "page-item" }, lt = { class: "page-item" }, ut = /* @__PURE__ */ T({
	__name: "Paging",
	props: /* @__PURE__ */ k({
		modelValue: {},
		count: {},
		maxPages: {},
		buttonType: {}
	}, { ...tt }),
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = s(r, n), { count: a } = ne(r), o = r.buttonType == X.button ? at : rt, { pagedRoute: c, page: l, totalPages: u, pages: d, handleChangePage: f } = nt({
			pagingInfo: i,
			count: a,
			maxPages: r.maxPages,
			emit: n
		});
		return (e, t) => (P(), x("nav", ot, [S("ul", st, [
			S("li", ct, [L(e.$slots, "firstPage", { page: 1 }, () => [(P(), y(B(H(o)), {
				page: 1,
				to: H(c)(1),
				onClick: t[0] ||= J((e) => H(f)(1), ["prevent"]),
				"aria-label": "Previous"
			}, {
				default: G(() => [...t[2] ||= [C("«", -1)]]),
				_: 1
			}, 8, ["to"]))])]),
			(P(!0), x(g, null, I(H(d), (t) => (P(), x("li", {
				class: M(["page-item", { active: t == H(l) }]),
				key: t
			}, [L(e.$slots, "default", {
				page: t,
				route: H(c)(t),
				handleChange: H(f)
			}, () => [(P(), y(B(H(o)), {
				page: t,
				to: H(c)(t),
				onClick: J((e) => H(f)(t), ["prevent"])
			}, {
				default: G(() => [C(V(t), 1)]),
				_: 2
			}, 1032, [
				"page",
				"to",
				"onClick"
			]))])], 2))), 128)),
			S("li", lt, [L(e.$slots, "lastPage", { page: H(u) }, () => [(P(), y(B(H(o)), {
				page: H(u),
				to: H(c)(H(u)),
				onClick: t[1] ||= J((e) => H(f)(H(u)), ["prevent"]),
				"aria-label": "Next"
			}, {
				default: G(() => [...t[3] ||= [C(" » ", -1)]]),
				_: 1
			}, 8, ["page", "to"]))])])
		])]));
	}
}), dt = { class: "result-summary text-muted small" }, ft = /* @__PURE__ */ T({
	__name: "ResultSummary",
	props: {
		visibleCount: {},
		totalCount: {}
	},
	setup(e) {
		return (t, n) => (P(), x("span", dt, V(e.visibleCount ?? 0) + " / " + V(e.totalCount ?? 0), 1));
	}
}), pt = { install(e, { defaultPageSize: t = 10 } = {}) {
	et.PAGESIZE = t, p.registerComponentsGlobally && e.component("Paging", ut);
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
function mt() {
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
function ht(e, t) {
	let n;
	return (...r) => {
		n && clearTimeout(n), n = setTimeout(() => e(...r), t);
	};
}
var gt = { install: (e, { sizes: t } = {}) => {
	if (t) for (let e in t) e in Q && (Q[e] = t[e]);
	let { screen: n } = mt(), r = ht(() => n.updateSize(Z()), 250);
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
}, _t = ["href", "onClick"], vt = /* @__PURE__ */ T({
	__name: "TabNavigation",
	props: {
		tabs: {},
		activeTab: {}
	},
	emits: ["select"],
	setup(e) {
		let t = v(() => (e) => typeof e.isVisible == "function" ? e.isVisible() : e.isVisible);
		return (n, r) => (P(), x("ul", { class: M(["nav", {
			"nav-pills": !n.$screen?.isLarge,
			"nav-tabs": n.$screen?.isLarge
		}]) }, [(P(!0), x(g, null, I(e.tabs, (r) => (P(), x(g, { key: r.key }, [t.value(r) ? (P(), x("li", {
			key: 0,
			class: M(["nav-item", { disabled: r.isDisabled }])
		}, [S("a", {
			href: `#${r.key}`,
			class: M([
				"py-1 px-2",
				"nav-link",
				{
					active: e.activeTab == r.key,
					disabled: r.isDisabled
				}
			]),
			onClick: J((e) => n.$emit("select", r.key), ["prevent"])
		}, [r.icon ? (P(), y(u, {
			key: 0,
			name: r.icon
		}, null, 8, ["name"])) : b("", !0), S("span", { class: M({ "d-none d-lg-inline ms-1": r.icon }) }, V(r.title), 3)], 10, _t)], 2)) : b("", !0)], 64))), 128))], 2));
	}
}), yt = { class: "tab-container" }, bt = {
	key: 0,
	class: "tab-content pt-2"
}, xt = /* @__PURE__ */ T({
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
		let n = t, r = e, i = oe(), a = v(() => r.tabs.filter((e) => e != null).map((e) => e instanceof $ ? e : new $(e))), o = v(() => (a.value.find((e) => e.isDefault) || a.value[0]).key), s = F(r.active), c = v({
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
		return ee(() => {
			s.value == null && r.useRouteNav && l((r.useRouteNav ? i.currentRoute.value.hash?.substring(1) : null) || o.value);
		}), (e, t) => (P(), x("div", yt, [w(vt, {
			tabs: a.value,
			activeTab: c.value,
			onSelect: l
		}, null, 8, ["tabs", "activeTab"]), (P(!0), x(g, null, I(a.value, (t) => (P(), x(g, { key: t.key }, [c.value == t.key ? (P(), x("div", bt, [L(e.$slots, t.key)])) : b("", !0)], 64))), 128))]));
	}
});
//#endregion
export { de as A, Ce as C, he as D, ve as E, ce as O, Ee as S, be as T, He as _, pt as a, Pe as b, X as c, Qe as d, Y as f, Ue as g, Ge as h, mt as i, le as k, tt as l, qe as m, $ as n, ft as o, Je as p, gt as r, ut as s, xt as t, $e as u, Ve as v, Se as w, Me as x, Fe as y };
