import { computed as e, getCurrentInstance as t, onMounted as n, ref as r, watch as i } from "vue";
import { defineStore as a } from "pinia";
//#region src/vue/app/store.ts
var o = /* @__PURE__ */ function(e) {
	return e.Init = "Init", e.Loading = "Loading", e.Mounting = "Mounting", e.Ready = "Ready", e;
}({}), s = a("AppStore", () => {
	let t = r(o.Init), n = r(navigator.language), i = r();
	return {
		culture: n,
		logo: i,
		status: t,
		isReady: e(() => t.value == o.Ready),
		setCulture(e) {
			n.value = e || navigator.language;
		},
		setStatus(e) {
			t.value = e;
		},
		setLogo(e) {
			i.value = e;
		}
	};
}), c = { install(e, { culture: t } = {}) {
	let n = s();
	n.setCulture(t), Object.defineProperty(e.config.globalProperties, "$culture", {
		get() {
			return n.culture;
		},
		enumerable: !0,
		configurable: !0
	}), e.config.globalProperties.$setCulture = (e) => n.setCulture(e), Object.defineProperty(e.config.globalProperties, "$isReady", {
		get() {
			return n.isReady;
		},
		enumerable: !0,
		configurable: !0
	}), Object.defineProperty(e.config.globalProperties, "$appStatus", {
		get() {
			return n.status;
		},
		enumerable: !0,
		configurable: !0
	}), e.config.globalProperties.$setAppStatus = (e) => n.setStatus(e);
} };
//#endregion
//#region src/vue/app/culture.ts
function l() {
	return t()?.appContext.config.globalProperties.$culture;
}
//#endregion
//#region src/vue/app/functions.ts
function u(e) {
	let r = s(), a = t();
	r.isReady ? e() : (i(() => r.isReady, () => e(), { once: !0 }), a && n(() => {
		r.isReady && e();
	}));
}
function d() {
	let e = s();
	return new Promise((t) => {
		let n = !1;
		return e.isReady ? t() : u(() => {
			n ||= (t(), !0);
		});
	});
}
//#endregion
export { o as AppStatus, u as onAppReady, c as plugin, s as useAppStore, l as useCulture, d as whenAppReady };
