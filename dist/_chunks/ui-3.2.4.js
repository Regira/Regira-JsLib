import { isEmail as e, isIP as t, isPhone as n } from "../utilities/string-utility.js";
import { debounceToPromise as r } from "../utilities/promise-utility.js";
import { n as i, t as a } from "./clipboard-utility-3.2.4.js";
import { useEventListener as o, useVModelField as s } from "../vue/vue-helper.js";
import { t as c } from "./_plugin-vue_export-helper-3.2.4.js";
import "./feedback-3.2.4.js";
import { n as l, r as u } from "./modal-3.2.4.js";
import { dateInputString as d } from "../vue/formatters/index.js";
import "./icons-3.2.4.js";
import { Fragment as f, Teleport as p, computed as m, createBlock as h, createCommentVNode as g, createElementBlock as _, createElementVNode as v, createTextVNode as y, createVNode as b, defineComponent as x, getCurrentInstance as S, inject as C, isRef as w, mergeDefaults as T, mergeModels as E, mergeProps as ee, normalizeClass as D, normalizeStyle as O, onMounted as k, onUnmounted as te, openBlock as A, ref as j, renderList as M, renderSlot as N, resolveComponent as P, resolveDirective as F, resolveDynamicComponent as I, toDisplayString as L, toRefs as R, unref as z, useModel as B, vModelText as ne, vShow as V, watch as H, watchEffect as re, withCtx as U, withDirectives as W, withKeys as G, withModifiers as K } from "vue";
import { useRouter as q } from "vue-router";
import { isValid as J } from "date-fns";
//#region src/vue/ui/autocomplete/autocomplete.ts
var Y = [
	"update:modelValue",
	"update:idValue",
	"select",
	"qInput"
], ie = {
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
}, ae = {
	data: () => [],
	maxResults: 10,
	debounceTime: 250,
	autoSelect: !1
};
function oe(e, { emit: t }) {
	let n = j(""), a = j(-1), s = j(e.data), c = j(!1), l = j(!1), u = j(!1), d = m({
		get: () => e.modelValue,
		set: (n) => {
			e.modelValue !== n && (t("update:modelValue", n), t("update:idValue", y(n)), t("select", n));
		}
	}), f = m(() => y(d.value)), p = j(), h = j({
		top: 0,
		left: 0
	}), g = j({
		top: 0,
		left: 0
	}), _ = j({
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
		P(), u.value = !0, s.value = void 0;
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
			r.length == 1 ? D(r[0]) : t && e.autoSelect && D(s.value[0]);
		}
	}
	function T() {
		A(), C();
	}
	function E() {}
	function ee(e, t) {
		F(), D(e, e ? t : -1);
	}
	function D(e, t) {
		if (e == null && t == null) {
			A(), n.value || F();
			return;
		}
		e && (t == null || t < 0) ? t = (s.value || []).indexOf(e) : !e && t >= 0 && (e = s.value[t]), e != null && (a.value = t, d.value = e, n.value = x(d.value));
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
	function A() {
		a.value = -1, d.value = void 0;
	}
	function M() {
		n.value = "", A(), F();
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
	function P() {
		z(), c.value = !0;
	}
	function F() {
		c.value = !1;
	}
	function I() {
		c.value && setTimeout(() => {
			w(!0), d.value ?? (n.value = ""), F();
		}, 250);
	}
	function L(e) {
		throw e;
	}
	let R = r(e.search || e.data && S || L(/* @__PURE__ */ Error("prop search or data is required")), e.debounceTime), z = () => {
		h.value = N(p.value), _.value = p.value ? i(p.value) : {
			top: 0,
			left: 0
		};
	}, B = r(z, 50);
	return o(window, "resize", B), k(() => {
		n.value = x(d.value), z(), document.addEventListener("scroll", B, !0);
	}), te(() => {
		document.removeEventListener("scroll", B, !0);
	}), H(d, (e, t) => {
		e != t && e != d.value && D(e), e && (n.value = x(d.value));
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
		resultOffset: g,
		resultStyle: v,
		displayItemFormatter: x,
		resultItemFormatter: b,
		handleInput: T,
		handleChange: E,
		handleSelect: ee,
		handleSearch: C,
		openResults: P,
		closeResults: F,
		closeGently: I,
		moveSelection: O,
		checkMatch: w,
		clearSelection: A,
		reset: M
	};
}
//#endregion
//#region src/vue/ui/autocomplete/Autocomplete.vue?vue&type=script&setup=true&lang.ts
var se = { class: "loading list-group-item" }, ce = ["onClick"], le = ["innerHTML"], ue = /* @__PURE__ */ x({
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
	}, { ...ae }),
	emits: Y,
	setup(e, { expose: t, emit: n }) {
		let r = n, i = e, { q: a, selectedItem: o, selectedIndex: s, items: c, isFocus: l, inputEl: u, resultStyle: d, isLoading: p, resultItemFormatter: m, closeGently: h, moveSelection: g, handleInput: y, handleChange: b, handleSelect: x, handleSearch: S, reset: C } = oe(i, { emit: r });
		function T() {
			l.value = !0, ((i.idSelector && i.idSelector(o.value) || "new") == "new" || o.value == null) && S();
		}
		function E() {
			l.value = !1;
		}
		function k() {
			i.enableDblClick && S("");
		}
		function te(e) {
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
			let r = F("click-outside");
			return A(), _(f, null, [W(v("input", ee({
				autocomplete: "__away",
				type: "text"
			}, t.$attrs, {
				"onUpdate:modelValue": n[0] ||= (e) => w(a) ? a.value = e : null,
				onInput: n[1] ||= (...e) => z(y) && z(y)(...e),
				onFocus: T,
				onDblclick: k,
				onBlur: E,
				onChange: n[2] ||= (...e) => z(b) && z(b)(...e),
				onKeydown: [
					n[3] ||= G((e) => z(g)(1), ["down"]),
					n[4] ||= G((e) => z(g)(-1), ["up"]),
					n[5] ||= G(K((e) => z(x)(z(o), z(s)), ["prevent"]), ["enter"])
				],
				ref_key: "inputEl",
				ref: u
			}), null, 16), [[ne, z(a)]]), W((A(), _("div", {
				class: D(["autocomplete-items bg-white border", e.resultClass]),
				style: O(z(d))
			}, [v("div", { class: D(["list-group", e.itemsClass]) }, [W(v("div", se, "Loading...", 512), [[V, z(p)]]), (A(!0), _(f, null, M(z(c), (n, r) => (A(), _("div", {
				key: r,
				onClick: (e) => z(x)(n, r),
				class: D(["autocomplete-item list-group-item list-group-item-action", [e.itemClass, { "bg-light": r == z(s) }]])
			}, [N(t.$slots, "default", {
				item: n,
				q: z(a)
			}, () => [v("div", { innerHTML: z(m)(n, z(a)) }, null, 8, le)])], 10, ce))), 128))], 2)], 6)), [[r, te]])], 64);
		};
	}
}), de = ["name"], fe = {
	key: 1,
	class: "ms-1"
}, pe = /* @__PURE__ */ x({
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
		let n = t, r = j(!1);
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
			let c = P("Icon"), l = P("MyModal");
			return A(), _("button", {
				type: "button",
				class: "btn",
				name: e.icon,
				onClick: a
			}, [N(t.$slots, "button-content", {}, () => [e.icon == null ? g("", !0) : (A(), h(c, {
				key: 0,
				name: e.icon
			}, null, 8, ["name"])), e.buttonLabel ? (A(), _("span", fe, L(e.buttonLabel), 1)) : g("", !0)]), (A(), h(p, { to: "#modals" }, [N(t.$slots, "modal", {}, () => [b(l, {
				"is-visible": r.value,
				type: e.modalType,
				title: e.modalTitle,
				onSubmit: i,
				onCancel: o,
				onClose: s
			}, {
				default: U(() => [N(t.$slots, "default")]),
				_: 3
			}, 8, [
				"is-visible",
				"type",
				"title"
			])])]))], 8, de);
		};
	}
}), me = ["href"], he = /* @__PURE__ */ x({
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
		return (e, t) => (A(), _("a", { href: a.value }, [N(e.$slots, "default")], 8, me));
	}
}), ge = ["value", "lang"], _e = /* @__PURE__ */ x({
	__name: "DateInput",
	props: {
		modelValue: {},
		culture: {}
	},
	emits: ["update:modelValue"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = m(() => J(new Date(r.modelValue || ""))), a = m(() => i.value ? d(new Date(r.modelValue)) : r.modelValue), o = (e) => {
			let t = new Date(e.target.value);
			(!e.target.value || J(t)) && n("update:modelValue", t || e.target.value);
		};
		return (t, n) => (A(), _("input", {
			type: "date",
			value: a.value,
			onChange: o,
			lang: e.culture,
			class: D({ "is-invalid": a.value && !i.value })
		}, null, 42, ge));
	}
}), ve = /* @__PURE__ */ x({
	__name: "FormLabel",
	props: {
		label: {},
		autoHide: {
			type: Boolean,
			default: !1
		}
	},
	setup(e) {
		return (t, n) => (A(), _("small", { class: D(["form-text text-muted", e.autoHide ? "d-none d-md-inline" : "d-inline"]) }, L(e.label), 3));
	}
}), ye = { class: "description-input" }, be = ["readonly"], xe = /* @__PURE__ */ x({
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
		return (n, r) => (A(), _("div", ye, [W(v("textarea", {
			"onUpdate:modelValue": r[0] ||= (e) => t.value = e,
			readonly: e.readonly,
			class: "form-control",
			rows: "3"
		}, null, 8, be), [[ne, t.value]]), e.label ? (A(), h(ve, {
			key: 0,
			label: e.label
		}, null, 8, ["label"])) : g("", !0)]));
	}
}), Se = { class: "form-buttons btn-group" }, Ce = {
	key: 0,
	type: "submit",
	class: "btn btn-primary"
}, we = /* @__PURE__ */ x({
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
		return (t, n) => (A(), _("div", Se, [
			e.readonly ? g("", !0) : (A(), _("button", Ce, "Save")),
			v("button", {
				type: "button",
				class: "btn btn-link",
				onClick: n[0] ||= (e) => r("cancel")
			}, "Cancel"),
			e.showDelete && !i.value ? (A(), _("button", {
				key: 1,
				type: "button",
				class: "btn btn-outline-danger",
				onClick: n[1] ||= (e) => r("remove")
			}, "Delete")) : g("", !0),
			i.value ? (A(), _("button", {
				key: 2,
				type: "button",
				class: "btn btn-outline-secondary",
				onClick: n[2] ||= (e) => r("restore")
			}, "Restore")) : g("", !0)
		]));
	}
}), Te = ["checked"], Ee = /* @__PURE__ */ x({
	name: "NullableCheckBox",
	props: { modelValue: { type: [
		Boolean,
		String,
		Number
	] } },
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = j(null), a = j(((e) => {
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
		return re(() => i.value && (i.value.indeterminate = o.value === void 0)), (e, t) => (A(), _("input", {
			type: "checkbox",
			ref_key: "input",
			ref: i,
			onClick: c,
			"true-value": !0,
			checked: o.value,
			style: O(s.value)
		}, null, 12, Te));
	}
}), De = /* @__PURE__ */ x({
	__name: "NullableLabel",
	props: { label: {} },
	setup(e) {
		return (t, n) => (A(), _("span", { class: D({ "italic-muted": !e.label }) }, [e.label ? (A(), _(f, { key: 0 }, [y(L(e.label), 1)], 64)) : N(t.$slots, "default", { key: 1 })], 2));
	}
}), Oe = { class: "form-section" }, ke = { class: "form-section-title" }, Ae = { class: "row" }, je = { class: "p-2 mb-2" }, Me = { class: "col-auto" }, Ne = /* @__PURE__ */ x({
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
		let n = t, r = e, i = S(), a = j(r.collapsed), o = j(r.readonly || r.showSummary), s = m({
			get: () => i?.slots.summary && (r.readonly || o.value),
			set: (e) => o.value = !!e
		});
		function c() {
			a.value = !a.value, a.value ? n("collapse") : n("expand");
		}
		return H(() => r.collapsed, () => {
			a.value = r.collapsed, a.value ? n("collapse") : n("expand");
		}), (t, n) => {
			let r = P("Icon");
			return A(), _("div", Oe, [v("div", ke, [N(t.$slots, "header", {
				collapsed: a.value,
				showSummary: s.value
			}, () => [v("div", Ae, [v("div", {
				class: "col",
				onClick: n[0] ||= (e) => s.value = !s.value
			}, [N(t.$slots, "title", { showSummary: s.value }, () => [v("h3", je, L(e.title), 1)])]), v("div", Me, [!e.readonly && t.$slots.summary ? (A(), _("button", {
				key: 0,
				type: "button",
				class: "btn btn-default my-2 px-2 py-1 opacity-50",
				onClick: n[1] ||= K((e) => s.value = !s.value, ["stop"])
			}, [b(r, { name: s.value ? "look" : "edit" }, null, 8, ["name"])])) : g("", !0), v("button", {
				type: "button",
				class: "btn btn-default my-2 px-2 py-1 opacity-50",
				onClick: K(c, ["stop"])
			}, [b(r, { name: a.value ? "maximize" : "minimize" }, null, 8, ["name"])])])])])]), W(v("div", { class: D(["form-section-body", s.value && e.summaryClass]) }, [
				!t.$slots.summary || !s.value ? N(t.$slots, "default", {
					key: 0,
					collapsed: a.value
				}) : g("", !0),
				t.$slots.summary && s.value ? N(t.$slots, "summary", {
					key: 1,
					collapsed: a.value
				}) : g("", !0),
				N(t.$slots, "always")
			], 2), [[V, !a.value]])]);
		};
	}
}), Pe = /* @__PURE__ */ x({
	__name: "FileDropZone",
	emits: ["drop-files"],
	setup(e, { expose: t, emit: n }) {
		let r = n, i = j();
		async function a(e) {
			r("drop-files", [...e.dataTransfer.files]);
		}
		return t({ isDropping: i }), (e, t) => (A(), _("div", {
			onDrop: K(a, ["prevent"]),
			onDragover: t[0] ||= K((e) => i.value = !0, ["prevent"]),
			onDragleave: t[1] ||= K((e) => i.value = !1, ["prevent"])
		}, [N(e.$slots, "default", { isDropping: i.value })], 32));
	}
}), Fe = /* @__PURE__ */ x({
	__name: "CopyToClipboardButton",
	props: {
		value: {},
		timeout: { default: 2500 }
	},
	setup(e, { expose: t }) {
		let n = e, r = j();
		function i() {
			a(n.value ?? ""), r.value = !0, setTimeout(() => r.value = void 0, n.timeout);
		}
		return t({ success: r }), (e, t) => {
			let n = P("IconButton");
			return A(), h(n, {
				icon: r.value ? "check" : "copy",
				disabled: r.value,
				onClick: i
			}, null, 8, ["icon", "disabled"]);
		};
	}
}), Ie = ["src"], Le = /* @__PURE__ */ x({
	__name: "GMap",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = m(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = m(() => `https://maps.google.com/maps?q=${encodeURIComponent(n.value)}&t=&z=${t.zoom || 10}&ie=UTF8&iwloc=&output=embed`);
		return (e, t) => (A(), _("iframe", {
			src: r.value,
			frameborder: "0",
			scrolling: "no",
			marginheight: "0",
			marginwidth: "0",
			allowfullscreen: ""
		}, null, 8, Ie));
	}
}), Re = ["href"], ze = /* @__PURE__ */ x({
	__name: "GmapLink",
	props: { modelValue: {} },
	setup(e) {
		let t = e, n = m(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" "));
		return (e, t) => {
			let r = P("Icon");
			return A(), _("a", { href: `https://www.google.com/maps/?q=${n.value}` }, [b(r, { name: "map" }), N(e.$slots, "default")], 8, Re);
		};
	}
}), Be = /*#__PURE__*/ c(/* @__PURE__ */ x({
	__name: "ModalButton",
	props: {
		modelValue: {},
		zoom: {}
	},
	setup(e) {
		let t = e, n = m(() => (Array.isArray(t.modelValue) ? t.modelValue : [t.modelValue]).filter((e) => e).join(" ")), r = j(!1);
		return (t, i) => {
			let a = P("Icon");
			return A(), _("button", {
				type: "button",
				onClick: i[1] ||= (e) => r.value = !0
			}, [N(t.$slots, "default", {}, () => [b(a, { name: "map" })], !0), (A(), h(p, { to: "#modals" }, [b(z(l), {
				"is-visible": r.value,
				title: n.value,
				"show-footer": !1,
				"full-width": !0,
				onClose: i[0] ||= (e) => r.value = !1
			}, {
				default: U(() => [b(Le, {
					id: "gmap_canvas",
					modelValue: e.modelValue,
					zoom: e.zoom,
					class: "w-100"
				}, null, 8, ["modelValue", "zoom"])]),
				_: 1
			}, 8, ["is-visible", "title"])]))]);
		};
	}
}), [["__scopeId", "data-v-7bb909c3"]]), Ve = ["src"], X = /* @__PURE__ */ x({
	__name: "Loading",
	setup(e, { expose: t }) {
		let n = C("loadingImg"), r = j(null);
		return t({
			imgEl: r,
			dimensions: () => [r.value?.width, r.value?.height],
			height: () => r.value?.naturalHeight
		}), (e, t) => (A(), _("img", {
			src: z(n),
			ref_key: "imgEl",
			ref: r
		}, null, 8, Ve));
	}
}), He = ["disabled"], Ue = /* @__PURE__ */ x({
	__name: "LoadingButton",
	props: {
		isLoading: { type: Boolean },
		disabled: { type: Boolean }
	},
	setup(e) {
		return (t, n) => (A(), _("button", {
			type: "button",
			class: "btn",
			disabled: e.disabled || e.isLoading
		}, [e.isLoading ? N(t.$slots, "loading", { key: 0 }, () => [b(X, { style: { width: "1rem" } })]) : N(t.$slots, "default", { key: 1 })], 8, He));
	}
}), We = /* @__PURE__ */ x({
	__name: "LoadingContainer",
	props: { isLoading: { type: Boolean } },
	setup(e, { expose: t }) {
		let n = j(null), r = j(null);
		function i() {
			return r.value?.imgEl?.width;
		}
		return t({
			containerEl: n,
			loadingImgEl: r.value?.imgEl
		}), (t, a) => (A(), _("div", {
			class: "position-relative",
			style: O({ height: e.isLoading ? `${i()}px` : void 0 }),
			ref_key: "containerEl",
			ref: n
		}, [N(t.$slots, "loading", {}, () => [e.isLoading ? (A(), h(X, {
			key: 0,
			class: "position-absolute top-0 start-50 translate-middle-x",
			style: {
				width: "20rem",
				"max-width": "100%"
			},
			ref_key: "loadingEl",
			ref: r
		}, null, 512)) : g("", !0)]), v("div", { style: O({ opacity: e.isLoading ? "0.4" : "" }) }, [N(t.$slots, "default")], 4)], 4));
	}
}), Ge = { install(e, t) {
	e.component("Loading", X), e.component("LoadingButton", Ue), e.component("LoadingContainer", We), e.provide("loadingImg", t.img);
} }, Ke = { PAGESIZE: 10 }, qe = /* @__PURE__ */ function(e) {
	return e.anchor = "Anchor", e.button = "Button", e;
}({}), Je = {
	maxPages: 9,
	buttonType: "Anchor"
};
function Ye({ pagingInfo: e, count: t, maxPages: n, emit: r }) {
	n = window.innerWidth < 576 ? Math.ceil(n / 2) : n;
	let i = m(() => (isNaN(parseInt(e.value.pageSize + "")) ? null : e.value.pageSize) || Ke.PAGESIZE), a = q();
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
var Xe = /* @__PURE__ */ x({
	__name: "PagingAnchor",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => {
			let r = P("RouterLink");
			return A(), h(r, {
				class: "page-link",
				to: e.to,
				title: "page " + e.page,
				activeClass: "active-page"
			}, {
				default: U(() => [N(t.$slots, "default", {}, () => [y(L(e.page), 1)])]),
				_: 3
			}, 8, ["to", "title"]);
		};
	}
}), Ze = ["title"], Qe = /* @__PURE__ */ x({
	__name: "PagingButton",
	props: {
		to: {},
		page: {}
	},
	setup(e) {
		return (t, n) => (A(), _("button", {
			type: "button",
			class: "btn btn-link page-link",
			title: "page " + e.page
		}, [N(t.$slots, "default", {}, () => [y(L(e.page), 1)])], 8, Ze));
	}
}), $e = { "aria-label": "Pagination" }, et = { class: "pagination" }, tt = { class: "page-item" }, nt = { class: "page-item" }, rt = /* @__PURE__ */ x({
	__name: "Paging",
	props: /*@__PURE__*/ T({
		modelValue: {},
		count: {},
		maxPages: {},
		buttonType: {}
	}, { ...Je }),
	emits: ["update:modelValue", "change"],
	setup(e, { emit: t }) {
		let n = t, r = e, i = s(r, n), { count: a } = R(r), o = r.buttonType == qe.button ? Qe : Xe, { pagedRoute: c, page: l, totalPages: u, pages: d, handleChangePage: p } = Ye({
			pagingInfo: i,
			count: a,
			maxPages: r.maxPages,
			emit: n
		});
		return (e, t) => (A(), _("nav", $e, [v("ul", et, [
			v("li", tt, [N(e.$slots, "firstPage", { page: 1 }, () => [(A(), h(I(z(o)), {
				page: 1,
				to: z(c)(1),
				onClick: t[0] ||= K((e) => z(p)(1), ["prevent"]),
				"aria-label": "Previous"
			}, {
				default: U(() => [...t[2] ||= [y("«", -1)]]),
				_: 1
			}, 8, ["to"]))])]),
			(A(!0), _(f, null, M(z(d), (t) => (A(), _("li", {
				class: D(["page-item", { active: t == z(l) }]),
				key: t
			}, [N(e.$slots, "default", {
				page: t,
				route: z(c)(t),
				handleChange: z(p)
			}, () => [(A(), h(I(z(o)), {
				page: t,
				to: z(c)(t),
				onClick: K((e) => z(p)(t), ["prevent"])
			}, {
				default: U(() => [y(L(t), 1)]),
				_: 2
			}, 1032, [
				"page",
				"to",
				"onClick"
			]))])], 2))), 128)),
			v("li", nt, [N(e.$slots, "lastPage", { page: z(u) }, () => [(A(), h(I(z(o)), {
				page: z(u),
				to: z(c)(z(u)),
				onClick: t[1] ||= K((e) => z(p)(z(u)), ["prevent"]),
				"aria-label": "Next"
			}, {
				default: U(() => [...t[3] ||= [y(" » ", -1)]]),
				_: 1
			}, 8, ["page", "to"]))])])
		])]));
	}
}), it = { class: "result-summary text-muted small" }, at = /* @__PURE__ */ x({
	__name: "ResultSummary",
	props: {
		visibleCount: {},
		totalCount: {}
	},
	setup(e) {
		return (t, n) => (A(), _("span", it, L(e.visibleCount ?? 0) + " / " + L(e.totalCount ?? 0), 1));
	}
}), ot = { install(e, { defaultPageSize: t = 10 } = {}) {
	Ke.PAGESIZE = t, e.component("Paging", rt);
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
	let e = j(Z());
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
}, ut = ["href", "onClick"], dt = /* @__PURE__ */ x({
	__name: "TabNavigation",
	props: {
		tabs: {},
		activeTab: {}
	},
	emits: ["select"],
	setup(e) {
		let t = m(() => (e) => typeof e.isVisible == "function" ? e.isVisible() : e.isVisible);
		return (n, r) => {
			let i = P("Icon");
			return A(), _("ul", { class: D(["nav", {
				"nav-pills": !n.$screen?.isLarge,
				"nav-tabs": n.$screen?.isLarge
			}]) }, [(A(!0), _(f, null, M(e.tabs, (r) => (A(), _(f, { key: r.key }, [t.value(r) ? (A(), _("li", {
				key: 0,
				class: D(["nav-item", { disabled: r.isDisabled }])
			}, [v("a", {
				href: `#${r.key}`,
				class: D([
					"py-1 px-2",
					"nav-link",
					{
						active: e.activeTab == r.key,
						disabled: r.isDisabled
					}
				]),
				onClick: K((e) => n.$emit("select", r.key), ["prevent"])
			}, [r.icon ? (A(), h(i, {
				key: 0,
				name: r.icon
			}, null, 8, ["name"])) : g("", !0), v("span", { class: D({ "d-none d-lg-inline ms-1": r.icon }) }, L(r.title), 3)], 10, ut)], 2)) : g("", !0)], 64))), 128))], 2);
		};
	}
}), ft = { class: "tab-container" }, pt = {
	key: 0,
	class: "tab-content pt-2"
}, mt = /* @__PURE__ */ x({
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
		let n = t, r = e, i = q(), a = m(() => r.tabs.filter((e) => e != null).map((e) => e instanceof $ ? e : new $(e))), o = m(() => (a.value.find((e) => e.isDefault) || a.value[0]).key), s = j(r.active), c = m({
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
		return k(() => {
			s.value == null && r.useRouteNav && l((r.useRouteNav ? i.currentRoute.value.hash?.substring(1) : null) || o.value);
		}), (e, t) => (A(), _("div", ft, [b(dt, {
			tabs: a.value,
			activeTab: c.value,
			onSelect: l
		}, null, 8, ["tabs", "activeTab"]), (A(!0), _(f, null, M(a.value, (t) => (A(), _(f, { key: t.key }, [c.value == t.key ? (A(), _("div", pt, [N(e.$slots, t.key)])) : g("", !0)], 64))), 128))]));
	}
});
//#endregion
export { oe as A, ve as C, ue as D, pe as E, Y as O, xe as S, he as T, Pe as _, ot as a, Ee as b, qe as c, We as d, X as f, Fe as g, Le as h, st as i, ie as k, Je as l, ze as m, $ as n, at as o, Be as p, lt as r, rt as s, mt as t, Ge as u, Ne as v, _e as w, we as x, De as y };
