import { t as e } from "./Icon-3.2.5.js";
import { createElementBlock as t, createVNode as n, defineComponent as r, openBlock as i, renderSlot as a } from "vue";
//#region src/vue/ui/icons/IconButton.vue?vue&type=script&setup=true&lang.ts
var o = ["type"], s = /* @__PURE__ */ r({
	__name: "IconButton",
	props: {
		icon: {},
		size: {},
		type: { default: "button" }
	},
	setup(r) {
		return (s, c) => (i(), t("button", {
			type: r.type,
			class: "btn"
		}, [n(e, {
			name: r.icon,
			size: r.size
		}, null, 8, ["name", "size"]), a(s.$slots, "default")], 8, o));
	}
});
//#endregion
export { s as t };
