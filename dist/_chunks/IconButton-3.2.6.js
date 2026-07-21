import { a as e, t } from "./Icon-3.2.6.js";
import { createElementBlock as n, createVNode as r, defineComponent as i, mergeDefaults as a, openBlock as o, renderSlot as s } from "vue";
//#region src/vue/ui/icons/IconButton.vue?vue&type=script&setup=true&lang.ts
var c = ["type"], l = /* @__PURE__ */ i({
	__name: "IconButton",
	props: /*@__PURE__*/ a({
		icon: {},
		size: {},
		type: {}
	}, { ...e }),
	setup(e) {
		return (i, a) => (o(), n("button", {
			type: e.type,
			class: "rg-icon-button btn d-inline-flex align-items-center gap-1"
		}, [r(t, {
			name: e.icon,
			size: e.size
		}, null, 8, ["name", "size"]), s(i.$slots, "default")], 8, c));
	}
});
//#endregion
export { l as t };
