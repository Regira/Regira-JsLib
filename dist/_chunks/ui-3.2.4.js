import { isEmail as e, isIP as t, isPhone as n } from "../utilities/string-utility.js";
import { debounceToPromise as r } from "../utilities/promise-utility.js";
import { n as i, t as a } from "./clipboard-utility-3.2.4.js";
import { useEventListener as o, useVModelField as s } from "../vue/vue-helper.js";
import { t as c } from "./_plugin-vue_export-helper-3.2.4.js";
import "./feedback-3.2.4.js";
import { n as l, r as u } from "./modal-3.2.4.js";
import { dateInputString as d } from "../vue/formatters/index.js";
import "./icons-3.2.4.js";
import { Fragment as f, Teleport as p, computed as m, createBlock as h, createCommentVNode as g, createElementBlock as _, createElementVNode as v, createTextVNode as y, createVNode as b, defineComponent as x, getCurrentInstance as S, inject as C, isRef as w, mergeDefaults as T, mergeModels as E, mergeProps as D, normalizeClass as O, normalizeStyle as k, onMounted as A, onUnmounted as ee, openBlock as j, ref as M, renderList as N, renderSlot as P, resolveComponent as F, resolveDirective as I, resolveDynamicComponent as L, toDisplayString as R, toRefs as te, unref as z, useModel as B, vModelText as ne, vShow as re, watch as V, watchEffect as ie, withCtx as H, withDirectives as U, withKeys as W, withModifiers as G } from "vue";
import { useRouter as K } from "vue-router";
import { isValid as q } from "date-fns";
//#region \0rolldown/runtime.js
var ae = Object.create, J = Object.defineProperty, oe = Object.getOwnPropertyDescriptor, se = Object.getOwnPropertyNames, ce = Object.getPrototypeOf, le = Object.prototype.hasOwnProperty, Y = (e, t) => () => (t || (e((t = { exports: {} }).exports, t), e = null), t.exports), ue = (e, t, n, r) => {
	if (t && typeof t == "object" || typeof t == "function") for (var i = se(t), a = 0, o = i.length, s; a < o; a++) s = i[a], !le.call(e, s) && s !== n && J(e, s, {
		get: ((e) => t[e]).bind(null, s),
		enumerable: !(r = oe(t, s)) || r.enumerable
	});
	return e;
}, de = (e, t, n) => (n = e == null ? {} : ae(ce(e)), ue(t || !e || !e.__esModule ? J(n, "default", {
	value: e,
	enumerable: !0
}) : n, e)), fe = [
	"update:modelValue",
	"update:idValue",
	"select",
	"qInput"
], pe = {
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
}, me = {
	data: () => [],
	maxResults: 10,
	debounceTime: 250,
	autoSelect: !1
};
function he(e, { emit: t }) {
	let n = M(""), a = M(-1), s = M(e.data), c = M(!1), l = M(!1), u = M(!1), d = m({
		get: () => e.modelValue,
		set: (n) => {
			e.modelValue !== n && (t("update:modelValue", n), t("update:idValue", y(n)), t("select", n));
		}
	}), f = m(() => y(d.value)), p = M(), h = M({
		top: 0,
		left: 0
	}), g = M({
		top: 0,
		left: 0
	}), _ = M({
		top: 0,
		left: 0
	}), v = m(() => {
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
			let n = await te(t), r = e.maxResults || n.length;
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
		j(), C();
	}
	function E() {}
	function D(e, t) {
		I(), O(e, e ? t : -1);
	}
	function O(e, t) {
		if (e == null && t == null) {
			j(), n.value || I();
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
	function j() {
		a.value = -1, d.value = void 0;
	}
	function N() {
		n.value = "", j(), I();
	}
	function P(e) {
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
	function R(e) {
		throw e;
	}
	let te = r(e.search || e.data && S || R(/* @__PURE__ */ Error("prop search or data is required")), e.debounceTime), z = () => {
		h.value = P(p.value), _.value = p.value ? i(p.value) : {
			top: 0,
			left: 0
		};
	}, B = r(z, 50);
	return o(window, "resize", B), A(() => {
		n.value = x(d.value), z(), document.addEventListener("scroll", B, !0);
	}), ee(() => {
		document.removeEventListener("scroll", B, !0);
	}), V(d, (e, t) => {
		e != t && e != d.value && O(e), e && (n.value = x(d.value));
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
		resultOffset: g,
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
		clearSelection: j,
		reset: N
	};
}
//#endregion
//#region src/vue/ui/autocomplete/Autocomplete.vue?vue&type=script&setup=true&lang.ts
var ge = { class: "loading list-group-item" }, _e = ["onClick"], ve = ["innerHTML"], ye = /* @__PURE__ */ x({
	inheritAttrs: !1,
	inheritAttrs: !1,
	__name: "Autocomplete",
	props: /*@__PURE__*/ T({
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
	}, { ...me }),
	emits: fe,
	setup(e, { expose: t, emit: n }) {
		let r = n, i = e, { q: a, selectedItem: o, selectedIndex: s, items: c, isFocus: l, inputEl: u, resultStyle: d, isLoading: p, resultItemFormatter: m, closeGently: h, moveSelection: g, handleInput: y, handleChange: b, handleSelect: x, handleSearch: S, reset: C } = he(i, { emit: r });
		function T() {
			l.value = !0, ((i.idSelector && i.idSelector(o.value) || "new") == "new" || o.value == null) && S();
		}
		function E() {
			l.value = !1;
		}
		function A() {
			i.enableDblClick && S("");
		}
		function ee(e) {
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
			let r = I("click-outside");
			return j(), _(f, null, [U(v("input", D({
				autocomplete: "__away",
				type: "text"
			}, t.$attrs, {
				"onUpdate:modelValue": n[0] ||= (e) => w(a) ? a.value = e : null,
				onInput: n[1] ||= (...e) => z(y) && z(y)(...e),
				onFocus: T,
				onDblclick: A,
				onBlur: E,
				onChange: n[2] ||= (...e) => z(b) && z(b)(...e),
				onKeydown: [
					n[3] ||= W((e) => z(g)(1), ["down"]),
					n[4] ||= W((e) => z(g)(-1), ["up"]),
					n[5] ||= W(G((e) => z(x)(z(o), z(s)), ["prevent"]), ["enter"])
				],
				ref_key: "inputEl",
				ref: u
			}), null, 16), [[ne, z(a)]]), U((j(), _("div", {
				class: O(["autocomplete-items bg-white border", e.resultClass]),
				style: k(z(d))
			}, [v("div", { class: O(["list-group", e.itemsClass]) }, [U(v("div", ge, "Loading...", 512), [[re, z(p)]]), (j(!0), _(f, null, N(z(c), (n, r) => (j(), _("div", {
				key: r,
				onClick: (e) => z(x)(n, r),
				class: O(["autocomplete-item list-group-item list-group-item-action", [e.itemClass, { "bg-light": r == z(s) }]])
			}, [P(t.$slots, "default", {
				item: n,
				q: z(a)
			}, () => [v("div", { innerHTML: z(m)(n, z(a)) }, null, 8, ve)])], 10, _e))), 128))], 2)], 6)), [[r, ee]])], 64);
		};
	}
}), be = ["name"], xe = {
	key: 1,
	class: "ms-1"
}, Se = /* @__PURE__ */ x({
	__name: "ConfirmButton",
	props: {
		icon: { default: "warning" },
		buttonLabel: {},
		modalTitle: { default: "Sure?" },
		modalType: { default: u.warning }
	},
	emits: [
		"confirm",
		"cancel",
		"open",
		"close"
	],
	setup(e, { emit: t }) {
		let n = t, r = M(!1);
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
		return (t, n) => {
			let c = F("Icon"), l = F("MyModal");
			return j(), _("button", {
				type: "button",
				class: "btn",
				name: e.icon,
				onClick: a
			}, [P(t.$slots, "button-content", {}, () => [e.icon == null ? g("", !0) : (j(), h(c, {
				key: 0,
				name: e.icon
			}, null, 8, ["name"])), e.buttonLabel ? (j(), _("span", xe, R(e.buttonLabel), 1)) : g("", !0)]), (j(), h(p, { to: "#modals" }, [P(t.$slots, "modal", {}, () => [b(l, {
				"is-visible": r.value,
				type: e.modalType,
				title: e.modalTitle,
				onSubmit: i,
				onCancel: o,
				onClose: s
			}, {
				default: H(() => [P(t.$slots, "default")]),
				_: 3
			}, 8, [
				"is-visible",
				"type",
				"title"
			])])]))], 8, be);
		};
	}
}), Ce = ["href"], we = /* @__PURE__ */ x({
	__name: "Anchor",
	props: { href: {} },
	setup(r) {
		let i = r, a = m(() => {
			let r = i.href;
			return e(r) ? r.startsWith("mailto:") || (r = "mailto:" + r) : t(r) ? r = "http://" + r : n(r) ? r.startsWith("tel:") || (r = "tel:" + r) : !r.startsWith("http") && ![
				"mailto:",
				"tel:",
				"ftp:"
			].some((e) => r.startsWith(e)) && (r = "http://" + r), r;
		});
		return (e, t) => (j(), _("a", { href: a.value }, [P(e.$slots, "default")], 8, Ce));
	}
}), Te = ["value", "lang"], Ee = /* @__PURE__ */ x({
	__name: "DateInput",
	props: {
		modelValue: {},
		culture: {}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = m(() => q(new Date(r.modelValue || ""))), a = m(() => i.value ? d(new Date(r.modelValue)) : r.modelValue), o = (e) => {
			let t = new Date(e.target.value);
			(!e.target.value || q(t)) && n("update:modelValue", t || e.target.value);
		};
		return (t, n) => (j(), _("input", {
			type: "date",
			value: a.value,
			onChange: o,
			lang: e.culture,
			class: O({ "is-invalid": a.value && !i.value })
		}, null, 42, Te));
	}
}), De = /* @__PURE__ */ x({
	__name: "FormLabel",
	props: {
		label: {},
		autoHide: {
			type: Boolean,
			default: !1
		}
	},
	setup(e) {
		return (t, n) => (j(), _("small", { class: O(["form-text text-muted", e.autoHide ? "d-none d-md-inline" : "d-inline"]) }, R(e.label), 3));
	}
}), Oe = { class: "description-input" }, ke = ["readonly"], Ae = /* @__PURE__ */ x({
	__name: "DescriptionInput",
	props: /*@__PURE__*/ E({
		label: {},
		readonly: { type: Boolean }
	}, {
		modelValue: {},
		modelModifiers: {}
	}),
	emits: ["update:modelValue"],
	setup(e) {
		let t = B(e, "modelValue");
		return (n, r) => (j(), _("div", Oe, [U(v("textarea", {
			"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
			readonly: e.readonly,
			class: "form-control",
			rows: "3"
		}, null, 8, ke), [[ne, t.value]]), e.label ? (j(), h(De, {
			key: 0,
			label: e.label
		}, null, 8, ["label"])) : g("", !0)]));
	}
}), je = { class: "form-buttons btn-group" }, Me = {
	key: 0,
	type: "submit",
	class: "btn btn-primary"
}, Ne = /* @__PURE__ */ x({
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
		let n = e, r = t, i = m(() => n.item?.isArchived === !0);
		return (t, n) => (j(), _("div", je, [
			e.readonly ? g("", !0) : (j(), _("button", Me, "Save")),
			v("button", {
				type: "button",
				class: "btn btn-link",
				onClick: n[0] ||= (e) => r("cancel")
			}, "Cancel"),
			e.showDelete && !i.value ? (j(), _("button", {
				key: 1,
				type: "button",
				class: "btn btn-outline-danger",
				onClick: n[1] ||= (e) => r("remove")
			}, "Delete")) : g("", !0),
			i.value ? (j(), _("button", {
				key: 2,
				type: "button",
				class: "btn btn-outline-secondary",
				onClick: n[2] ||= (e) => r("restore")
			}, "Restore")) : g("", !0)
		]));
	}
}), Pe = ["checked"], Fe = /* @__PURE__ */ x({
	name: "NullableCheckBox",
	props: { modelValue: { type: [
		Boolean,
		String,
		Number
	] } },
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = M(null), a = M(((e) => {
			if (e != null) return typeof e == "string" ? e === "true" ? !0 : e === "false" ? !1 : void 0 : new Boolean(e).valueOf();
		})(r.modelValue)), o = m({
			get() {
				return a.value;
			},
			set(e) {
				a.value = e, n("update:modelValue", e), n("change", { target: i.value });
			}
		}), s = m(() => ({ opacity: o.value == null ? .5 : 1 }));
		function c() {
			o.value = o.value == null ? !0 : o.value ? !1 : void 0;
		}
		return ie(() => i.value && (i.value.indeterminate = o.value === void 0)), (e, t) => (j(), _("input", {
			type: "checkbox",
			ref_key: "input",
			ref: i,
			onClick: c,
			"true-value": !0,
			checked: o.value,
			style: k(s.value)
		}, null, 12, Pe));
	}
}), Ie = /* @__PURE__ */ x({
	__name: "NullableLabel",
	props: { label: {} },
	setup(e) {
		return (t, n) => (j(), _("span", { class: O({ "italic-muted": !e.label }) }, [e.label ? (j(), _(f, { key: 0 }, [y(R(e.label), 1)], 64)) : P(t.$slots, "default", { key: 1 })], 2));
	}
}), Le = { class: "form-section" }, Re = { class: "form-section-title" }, ze = { class: "row" }, Be = { class: "p-2 mb-2" }, Ve = { class: "col-auto" }, He = /* @__PURE__ */ x({
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
		let n = t, r = e, i = S(), a = M(r.collapsed), o = M(r.readonly || r.showSummary), s = m({
			get: () => i?.slots.summary && (r.readonly || o.value),
			set: (e) => o.value = !!e
		});
		function c() {
			a.value = !a.value, a.value ? n("collapse") : n("expand");
		}
		return V(() => r.collapsed, () => {
			a.value = r.collapsed, a.value ? n("collapse") : n("expand");
		}), (t, n) => {
			let r = F("Icon");
			return j(), _("div", Le, [v("div", Re, [P(t.$slots, "header", {
				collapsed: a.value,
				showSummary: s.value
			}, () => [v("div", ze, [v("div", {
				class: "col",
				onClick: n[0] ||= (e) => s.value = !s.value
			}, [P(t.$slots, "title", { showSummary: s.value }, () => [v("h3", Be, R(e.title), 1)])]), v("div", Ve, [!e.readonly && t.$slots.summary ? (j(), _("button", {
				key: 0,
				type: "button",
				class: "btn btn-default my-2 px-2 py-1 opacity-50",
				onClick: n[1] ||= G((e) => s.value = !s.value, ["stop"])
			}, [b(r, { name: s.value ? "look" : "edit" }, null, 8, ["name"])])) : g("", !0), v("button", {
				type: "button",
				class: "btn btn-default my-2 px-2 py-1 opacity-50",
				onClick: G(c, ["stop"])
			}, [b(r, { name: a.value ? "maximize" : "minimize" }, null, 8, ["name"])])])])])]), U(v("div", { class: O(["form-section-body", s.value && e.summaryClass]) }, [
				!t.$slots.summary || !s.value ? P(t.$slots, "default", {
					key: 0,
					collapsed: a.value
				}) : g("", !0),
				t.$slots.summary && s.value ? P(t.$slots, "summary", {
					key: 1,
					collapsed: a.value
				}) : g("", !0),
				P(t.$slots, "always")
			], 2), [[re, !a.value]])]);
		};
	}
}), Ue = /* @__PURE__ */ x({
	__name: "FileDropZone",
	emits: ["drop-files"],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = M();
		async function a(e) {
			r("drop-files", [...e.dataTransfer.files]);
		}
		return t({ isDropping: i }), (e, t) => (j(), _("div", {
			onDrop: G(a, ["prevent"]),
			onDragover: t[0] ||= G((e) => i.value = !0, ["prevent"]),
			onDragleave: t[1] ||= G((e) => i.value = !1, ["prevent"])
		}, [P(e.$slots, "default", { isDropping: i.value })], 32));
	}
}), We = /* @__PURE__ */ x({
	__name: "CopyToClipboardButton",
	props: {
		value: {},
		timeout: { default: 2500 }
	},
	setup(e, { expose: t }) {
		let n = e, r = M();
		function i() {
			a(n.value ?? ""), r.value = !0, setTimeout(() => r.value = void 0, n.timeout);
		}
		return t({ success: r }), (e, t) => {
			let n = F("IconButton");
			return j(), h(n, {
				icon: r.value ? "check" : "copy",
				disabled: r.value,
				onClick: i
			}, null, 8, ["icon", "disabled"]);
		};
	}
}), Ge = ["src"], Ke = /* @__PURE__ */ x({
	__name: "GMap",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = m(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = m(() => `https://maps.google.com/maps?q=${encodeURIComponent(n.value)}&t=&z=${t.zoom || 10}&ie=UTF8&iwloc=&output=embed`);
		return (e, t) => (j(), _("iframe", {
			src: r.value,
			frameborder: "0",
			scrolling: "no",
			marginheight: "0",
			marginwidth: "0",
			allowfullscreen: ""
		}, null, 8, Ge));
	}
}), qe = ["href"], Je = /* @__PURE__ */ x({
	__name: "GmapLink",
	props: { modelValue: {} },
	setup(e) {
		let t = e, n = m(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" "));
		return (e, t) => {
			let r = F("Icon");
			return j(), _("a", { href: `https://www.google.com/maps/?q=${n.value}` }, [b(r, { name: "map" }), P(e.$slots, "default")], 8, qe);
		};
	}
}), Ye = /*#__PURE__*/ c(/* @__PURE__ */ x({
	__name: "ModalButton",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = m(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = M(!1);
		return (t, i) => {
			let a = F("Icon");
			return j(), _("button", {
				type: "button",
				onClick: i[1] ||= (e) => r.value = !0
			}, [P(t.$slots, "default", {}, () => [b(a, { name: "map" })], !0), (j(), h(p, { to: "#modals" }, [b(z(l), {
				"is-visible": r.value,
				title: n.value,
				"show-footer": !1,
				"full-width": !0,
				onClose: i[0] ||= (e) => r.value = !1
			}, {
				default: H(() => [b(Ke, {
					id: "gmap_canvas",
					modelValue: e.modelValue,
					zoom: e.zoom,
					class: "w-100"
				}, null, 8, ["modelValue", "zoom"])]),
				_: 1
			}, 8, ["is-visible", "title"])]))]);
		};
	}
}), [["__scopeId", "data-v-7bb909c3"]]), Xe = ["src"], X = /* @__PURE__ */ x({
	__name: "Loading",
	setup(e, { expose: t }) {
		let n = C("loadingImg"), r = M(null);
		return t({
			imgEl: r,
			dimensions: () => [r.value?.width, r.value?.height],
			height: () => r.value?.naturalHeight
		}), (e, t) => (j(), _("img", {
			src: z(n),
			ref_key: "imgEl",
			ref: r
		}, null, 8, Xe));
	}
}), Ze = ["disabled"], Qe = /* @__PURE__ */ x({
	__name: "LoadingButton",
	props: {
		isLoading: { type: Boolean },
		disabled: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (j(), _("button", {
			type: "button",
			class: "btn",
			disabled: e.disabled || e.isLoading
		}, [e.isLoading ? P(t.$slots, "loading", { key: 0 }, () => [b(X, { style: { width: "1rem" } })]) : P(t.$slots, "default", { key: 1 })], 8, Ze));
	}
}), $e = /* @__PURE__ */ x({
	__name: "LoadingContainer",
	props: { isLoading: { type: Boolean } },
	setup(e, { expose: t }) {
		let n = M(null), r = M(null);
		function i() {
			return r.value?.imgEl?.width;
		}
		return t({
			containerEl: n,
			loadingImgEl: r.value?.imgEl
		}), (t, a) => (j(), _("div", {
			class: "position-relative",
			style: k({ height: e.isLoading ? `${i()}px` : void 0 }),
			ref_key: "containerEl",
			ref: n
		}, [P(t.$slots, "loading", {}, () => [e.isLoading ? (j(), h(X, {
			key: 0,
			class: "position-absolute top-0 start-50 translate-middle-x",
			style: {
				width: "20rem",
				"max-width": "100%"
			},
			ref_key: "loadingEl",
			ref: r
		}, null, 512)) : g("", !0)]), v("div", { style: k({ opacity: e.isLoading ? "0.4" : "" }) }, [P(t.$slots, "default")], 4)], 4));
	}
}), et = { install(e, t) {
	e.component("Loading", X), e.component("LoadingButton", Qe), e.component("LoadingContainer", $e), e.provide("loadingImg", t.img);
} }, tt = { PAGESIZE: 10 }, nt = /* @__PURE__ */ function(e) {
	return e.anchor = "Anchor", e.button = "Button", e;
}({}), rt = {
	maxPages: 9,
	buttonType: "Anchor"
};
function it({ pagingInfo: e, count: t, maxPages: n, emit: r }) {
	n = window.innerWidth < 576 ? Math.ceil(n / 2) : n;
	let i = m(() => (isNaN(parseInt(e.value.pageSize + "")) ? null : e.value.pageSize) || tt.PAGESIZE), a = K();
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
	let s = m(() => e.value.page || 1), c = m(() => Math.ceil(t.value / i.value)), l = m(() => Math.min(c.value, n)), u = m(() => {
		let e = Math.floor(l.value / 2), t = Math.max(s.value - e, 1);
		return t + n > c.value && (t -= t + n - c.value - 1), Math.max(t, 1);
	}), d = m(() => Math.min(u.value + l.value, c.value)), f = m(() => !isNaN(l.value) && l.value > 0 ? Array(l.value).fill(0).map((e, t) => u.value + t).filter((e) => e <= d.value) : []);
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
var at = /* @__PURE__ */ x({
	__name: "PagingAnchor",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => {
			let r = F("RouterLink");
			return j(), h(r, {
				class: "page-link",
				to: e.to,
				title: "page " + e.page,
				activeClass: "active-page"
			}, {
				default: H(() => [P(t.$slots, "default", {}, () => [y(R(e.page), 1)])]),
				_: 3
			}, 8, ["to", "title"]);
		};
	}
}), ot = ["title"], st = /* @__PURE__ */ x({
	__name: "PagingButton",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => (j(), _("button", {
			type: "button",
			class: "btn btn-link page-link",
			title: "page " + e.page
		}, [P(t.$slots, "default", {}, () => [y(R(e.page), 1)])], 8, ot));
	}
}), ct = { "aria-label": "Pagination" }, lt = { class: "pagination" }, ut = { class: "page-item" }, dt = { class: "page-item" }, ft = /* @__PURE__ */ x({
	__name: "Paging",
	props: /*@__PURE__*/ T({
		modelValue: {},
		count: {},
		maxPages: {},
		buttonType: {}
	}, { ...rt }),
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = s(r, n), { count: a } = te(r), o = r.buttonType == nt.button ? st : at, { pagedRoute: c, page: l, totalPages: u, pages: d, handleChangePage: p } = it({
			pagingInfo: i,
			count: a,
			maxPages: r.maxPages,
			emit: n
		});
		return (e, t) => (j(), _("nav", ct, [v("ul", lt, [
			v("li", ut, [P(e.$slots, "firstPage", { page: 1 }, () => [(j(), h(L(z(o)), {
				page: 1,
				to: z(c)(1),
				onClick: t[0] ||= G((e) => z(p)(1), ["prevent"]),
				"aria-label": "Previous"
			}, {
				default: H(() => [...t[2] ||= [y("«", -1)]]),
				_: 1
			}, 8, ["to"]))])]),
			(j(!0), _(f, null, N(z(d), (t) => (j(), _("li", {
				class: O(["page-item", { active: t == z(l) }]),
				key: t
			}, [P(e.$slots, "default", {
				page: t,
				route: z(c)(t),
				handleChange: z(p)
			}, () => [(j(), h(L(z(o)), {
				page: t,
				to: z(c)(t),
				onClick: G((e) => z(p)(t), ["prevent"])
			}, {
				default: H(() => [y(R(t), 1)]),
				_: 2
			}, 1032, [
				"page",
				"to",
				"onClick"
			]))])], 2))), 128)),
			v("li", dt, [P(e.$slots, "lastPage", { page: z(u) }, () => [(j(), h(L(z(o)), {
				page: z(u),
				to: z(c)(z(u)),
				onClick: t[1] ||= G((e) => z(p)(z(u)), ["prevent"]),
				"aria-label": "Next"
			}, {
				default: H(() => [...t[3] ||= [y(" » ", -1)]]),
				_: 1
			}, 8, ["page", "to"]))])])
		])]));
	}
}), pt = { class: "result-summary text-muted small" }, mt = /* @__PURE__ */ x({
	__name: "ResultSummary",
	props: {
		visibleCount: {},
		totalCount: {}
	},
	setup(e) {
		return (t, n) => (j(), _("span", pt, R(e.visibleCount ?? 0) + " / " + R(e.totalCount ?? 0), 1));
	}
}), ht = { install(e, { defaultPageSize: t = 10 } = {}) {
	tt.PAGESIZE = t, e.component("Paging", ft);
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
function gt() {
	let e = M(Z());
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
//#region node_modules/lodash/isObject.js
var _t = /* @__PURE__ */ Y(((e, t) => {
	function n(e) {
		var t = typeof e;
		return e != null && (t == "object" || t == "function");
	}
	t.exports = n;
})), vt = /* @__PURE__ */ Y(((e, t) => {
	t.exports = typeof global == "object" && global && global.Object === Object && global;
})), yt = /* @__PURE__ */ Y(((e, t) => {
	var n = vt(), r = typeof self == "object" && self && self.Object === Object && self;
	t.exports = n || r || Function("return this")();
})), bt = /* @__PURE__ */ Y(((e, t) => {
	var n = yt();
	t.exports = function() {
		return n.Date.now();
	};
})), xt = /* @__PURE__ */ Y(((e, t) => {
	var n = /\s/;
	function r(e) {
		for (var t = e.length; t-- && n.test(e.charAt(t)););
		return t;
	}
	t.exports = r;
})), St = /* @__PURE__ */ Y(((e, t) => {
	var n = xt(), r = /^\s+/;
	function i(e) {
		return e && e.slice(0, n(e) + 1).replace(r, "");
	}
	t.exports = i;
})), Ct = /* @__PURE__ */ Y(((e, t) => {
	t.exports = yt().Symbol;
})), wt = /* @__PURE__ */ Y(((e, t) => {
	var n = Ct(), r = Object.prototype, i = r.hasOwnProperty, a = r.toString, o = n ? n.toStringTag : void 0;
	function s(e) {
		var t = i.call(e, o), n = e[o];
		try {
			e[o] = void 0;
			var r = !0;
		} catch {}
		var s = a.call(e);
		return r && (t ? e[o] = n : delete e[o]), s;
	}
	t.exports = s;
})), Tt = /* @__PURE__ */ Y(((e, t) => {
	var n = Object.prototype.toString;
	function r(e) {
		return n.call(e);
	}
	t.exports = r;
})), Et = /* @__PURE__ */ Y(((e, t) => {
	var n = Ct(), r = wt(), i = Tt(), a = "[object Null]", o = "[object Undefined]", s = n ? n.toStringTag : void 0;
	function c(e) {
		return e == null ? e === void 0 ? o : a : s && s in Object(e) ? r(e) : i(e);
	}
	t.exports = c;
})), Dt = /* @__PURE__ */ Y(((e, t) => {
	function n(e) {
		return typeof e == "object" && !!e;
	}
	t.exports = n;
})), Ot = /* @__PURE__ */ Y(((e, t) => {
	var n = Et(), r = Dt(), i = "[object Symbol]";
	function a(e) {
		return typeof e == "symbol" || r(e) && n(e) == i;
	}
	t.exports = a;
})), kt = /* @__PURE__ */ Y(((e, t) => {
	var n = St(), r = _t(), i = Ot(), a = NaN, o = /^[-+]0x[0-9a-f]+$/i, s = /^0b[01]+$/i, c = /^0o[0-7]+$/i, l = parseInt;
	function u(e) {
		if (typeof e == "number") return e;
		if (i(e)) return a;
		if (r(e)) {
			var t = typeof e.valueOf == "function" ? e.valueOf() : e;
			e = r(t) ? t + "" : t;
		}
		if (typeof e != "string") return e === 0 ? e : +e;
		e = n(e);
		var u = s.test(e);
		return u || c.test(e) ? l(e.slice(2), u ? 2 : 8) : o.test(e) ? a : +e;
	}
	t.exports = u;
})), At = /* @__PURE__ */ de((/* @__PURE__ */ Y(((e, t) => {
	var n = _t(), r = bt(), i = kt(), a = "Expected a function", o = Math.max, s = Math.min;
	function c(e, t, c) {
		var l, u, d, f, p, m, h = 0, g = !1, _ = !1, v = !0;
		if (typeof e != "function") throw TypeError(a);
		t = i(t) || 0, n(c) && (g = !!c.leading, _ = "maxWait" in c, d = _ ? o(i(c.maxWait) || 0, t) : d, v = "trailing" in c ? !!c.trailing : v);
		function y(t) {
			var n = l, r = u;
			return l = u = void 0, h = t, f = e.apply(r, n), f;
		}
		function b(e) {
			return h = e, p = setTimeout(C, t), g ? y(e) : f;
		}
		function x(e) {
			var n = e - m, r = e - h, i = t - n;
			return _ ? s(i, d - r) : i;
		}
		function S(e) {
			var n = e - m, r = e - h;
			return m === void 0 || n >= t || n < 0 || _ && r >= d;
		}
		function C() {
			var e = r();
			if (S(e)) return w(e);
			p = setTimeout(C, x(e));
		}
		function w(e) {
			return p = void 0, v && l ? y(e) : (l = u = void 0, f);
		}
		function T() {
			p !== void 0 && clearTimeout(p), h = 0, l = m = u = p = void 0;
		}
		function E() {
			return p === void 0 ? f : w(r());
		}
		function D() {
			var e = r(), n = S(e);
			if (l = arguments, u = this, m = e, n) {
				if (p === void 0) return b(m);
				if (_) return clearTimeout(p), p = setTimeout(C, t), y(m);
			}
			return p === void 0 && (p = setTimeout(C, t)), f;
		}
		return D.cancel = T, D.flush = E, D;
	}
	t.exports = c;
})))(), 1), jt = { install: (e, { sizes: t } = {}) => {
	if (t) for (let e in t) e in Q && (Q[e] = t[e]);
	let { screen: n } = gt(), r = (0, At.default)(() => n.updateSize(Z()), 250);
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
}, Mt = ["href", "onClick"], Nt = /* @__PURE__ */ x({
	__name: "TabNavigation",
	props: {
		tabs: {},
		activeTab: {}
	},
	emits: ["select"],
	setup(e) {
		let t = m(() => (e) => typeof e.isVisible == "function" ? e.isVisible() : e.isVisible);
		return (n, r) => {
			let i = F("Icon");
			return j(), _("ul", { class: O(["nav", {
				"nav-pills": !n.$screen?.isLarge,
				"nav-tabs": n.$screen?.isLarge
			}]) }, [(j(!0), _(f, null, N(e.tabs, (r) => (j(), _(f, { key: r.key }, [t.value(r) ? (j(), _("li", {
				key: 0,
				class: O(["nav-item", { disabled: r.isDisabled }])
			}, [v("a", {
				href: `#${r.key}`,
				class: O([
					"py-1 px-2",
					"nav-link",
					{
						active: e.activeTab == r.key,
						disabled: r.isDisabled
					}
				]),
				onClick: G((e) => n.$emit("select", r.key), ["prevent"])
			}, [r.icon ? (j(), h(i, {
				key: 0,
				name: r.icon
			}, null, 8, ["name"])) : g("", !0), v("span", { class: O({ "d-none d-lg-inline ms-1": r.icon }) }, R(r.title), 3)], 10, Mt)], 2)) : g("", !0)], 64))), 128))], 2);
		};
	}
}), Pt = { class: "tab-container" }, Ft = {
	key: 0,
	class: "tab-content pt-2"
}, It = /* @__PURE__ */ x({
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
		let n = t, r = e, i = K(), a = m(() => r.tabs.filter((e) => e != null).map((e) => e instanceof $ ? e : new $(e))), o = m(() => (a.value.find((e) => e.isDefault) || a.value[0]).key), s = M(r.active), c = m({
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
		return A(() => {
			s.value == null && r.useRouteNav && l((r.useRouteNav ? i.currentRoute.value.hash?.substring(1) : null) || o.value);
		}), (e, t) => (j(), _("div", Pt, [b(Nt, {
			tabs: a.value,
			activeTab: c.value,
			onSelect: l
		}, null, 8, ["tabs", "activeTab"]), (j(!0), _(f, null, N(a.value, (t) => (j(), _(f, { key: t.key }, [c.value == t.key ? (j(), _("div", Ft, [P(e.$slots, t.key)])) : g("", !0)], 64))), 128))]));
	}
});
//#endregion
export { he as A, De as C, ye as D, Se as E, fe as O, Ae as S, we as T, Ue as _, ht as a, Fe as b, nt as c, $e as d, X as f, We as g, Ke as h, gt as i, pe as k, rt as l, Je as m, $ as n, mt as o, Ye as p, jt as r, ft as s, It as t, et as u, He as v, Ee as w, Ne as x, Ie as y };
