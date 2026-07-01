import { t as e } from "../../_chunks/Icon-3.2.5.js";
import { t } from "../../_chunks/_plugin-vue_export-helper-3.2.5.js";
import { computed as n, createCommentVNode as r, createElementBlock as i, createElementVNode as a, createVNode as o, defineComponent as s, getCurrentInstance as c, normalizeClass as l, openBlock as u, ref as d, toDisplayString as f, withModifiers as p } from "vue";
//#region src/vue/debug/Display.vue?vue&type=script&setup=true&lang.ts
var m = { class: "value" }, h = /*#__PURE__*/ t(/* @__PURE__ */ s({
	__name: "Display",
	props: {
		title: {},
		modelValue: {}
	},
	setup(t) {
		let s = t, h = d(!1), g = c(), _ = n(() => g?.proxy?.$isDebug), v = n(() => JSON.stringify(s.modelValue ?? {}, null, 2));
		return (n, s) => _.value ? (u(), i("div", {
			key: 0,
			class: l(["debug", { minimized: h.value }])
		}, [
			a("button", {
				type: "button",
				class: "btn btn-default",
				onClick: s[0] ||= p((e) => h.value = !h.value, ["stop"])
			}, [o(e, { name: h.value ? "maximize" : "minimize" }, null, 8, ["name"])]),
			a("div", {
				class: "title",
				onClick: s[1] ||= (e) => h.value = !h.value
			}, "Debug " + f(t.title), 1),
			a("div", m, f(v.value), 1)
		], 2)) : r("", !0);
	}
}), [["__scopeId", "data-v-3de56375"]]), g = { install(e, t) {
	let n = d(!!t?.isDebug), r = d(!0);
	Object.defineProperty(e.config.globalProperties, "$isDebug", {
		get() {
			let t = e.config.globalProperties.$router.currentRoute.value.query?.debug;
			return r.value && (t === void 0 ? n.value : t === "1");
		},
		enumerable: !0,
		configurable: !0
	}), e.config.globalProperties.$setDebug = (e = !0) => r.value = e;
} };
//#endregion
export { h as Debug, g as default, g as plugin };
