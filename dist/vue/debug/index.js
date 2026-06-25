import { t as e } from "../../_chunks/_plugin-vue_export-helper-3.2.1.js";
import { computed as t, createCommentVNode as n, createElementBlock as r, createElementVNode as i, createVNode as a, defineComponent as o, getCurrentInstance as s, normalizeClass as c, openBlock as l, ref as u, resolveComponent as d, toDisplayString as f, withModifiers as p } from "vue";
//#region src/vue/debug/Display.vue?vue&type=script&setup=true&lang.ts
var m = { class: "value" }, h = /*#__PURE__*/ e(/* @__PURE__ */ o({
	__name: "Display",
	props: {
		title: {},
		modelValue: {}
	},
	setup(e) {
		let o = e, h = u(!1), g = s(), _ = t(() => g?.proxy?.$isDebug), v = t(() => JSON.stringify(o.modelValue ?? {}, null, 2));
		return (t, o) => {
			let s = d("Icon");
			return _.value ? (l(), r("div", {
				key: 0,
				class: c(["debug", { minimized: h.value }])
			}, [
				i("button", {
					type: "button",
					class: "btn btn-default",
					onClick: o[0] ||= p((e) => h.value = !h.value, ["stop"])
				}, [a(s, { name: h.value ? "maximize" : "minimize" }, null, 8, ["name"])]),
				i("div", {
					class: "title",
					onClick: o[1] ||= (e) => h.value = !h.value
				}, "Debug " + f(e.title), 1),
				i("div", m, f(v.value), 1)
			], 2)) : n("", !0);
		};
	}
}), [["__scopeId", "data-v-d74fa8a3"]]), g = { install(e, t) {
	let n = u(!!t?.isDebug), r = u(!0);
	e.component("Debug", h), Object.defineProperty(e.config.globalProperties, "$isDebug", {
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
