import { t as e } from "../../_chunks/Icon-3.2.6.js";
import { n as t } from "../../_chunks/ioc-3.2.6.js";
import { t as n } from "../../_chunks/_plugin-vue_export-helper-3.2.6.js";
import { computed as r, createCommentVNode as i, createElementBlock as a, createElementVNode as o, createVNode as s, defineComponent as c, getCurrentInstance as l, normalizeClass as u, openBlock as d, ref as f, toDisplayString as p, withModifiers as m } from "vue";
//#region src/vue/debug/Display.vue?vue&type=script&setup=true&lang.ts
var h = { class: "value" }, g = /*#__PURE__*/ n(/* @__PURE__ */ c({
	__name: "Display",
	props: {
		title: {},
		modelValue: {}
	},
	setup(t) {
		let n = t, c = f(!1), g = l(), _ = r(() => g?.proxy?.$isDebug), v = r(() => JSON.stringify(n.modelValue ?? {}, null, 2));
		return (n, r) => _.value ? (d(), a("div", {
			key: 0,
			class: u(["debug", { minimized: c.value }])
		}, [
			o("button", {
				type: "button",
				class: "btn btn-default",
				onClick: r[0] ||= m((e) => c.value = !c.value, ["stop"])
			}, [s(e, { name: c.value ? "maximize" : "minimize" }, null, 8, ["name"])]),
			o("div", {
				class: "title",
				onClick: r[1] ||= (e) => c.value = !c.value
			}, "Debug " + p(t.title), 1),
			o("div", h, p(v.value), 1)
		], 2)) : i("", !0);
	}
}), [["__scopeId", "data-v-f993b440"]]), _ = { install(e, n) {
	let r = f(!!n?.isDebug), i = f(!0);
	t.registerComponentsGlobally && e.component("Debug", n?.Debug ?? g), Object.defineProperty(e.config.globalProperties, "$isDebug", {
		get() {
			let t = e.config.globalProperties.$router.currentRoute.value.query?.debug;
			return i.value && (t === void 0 ? r.value : t === "1");
		},
		enumerable: !0,
		configurable: !0
	}), e.config.globalProperties.$setDebug = (e = !0) => i.value = e;
} };
//#endregion
export { g as Debug, _ as default, _ as plugin };
