//#region src/vue/ioc/ServiceProvider.ts
var e = class {
	services;
	constructor() {
		this.services = /* @__PURE__ */ new Map();
	}
	get(e) {
		let t = this.services.get(e);
		if (t != null) return t(this);
	}
	add(e, t) {
		return this.services.set(e, t), this;
	}
}, t = new e();
function n(e) {
	return t.get(e);
}
//#endregion
//#region src/vue/ioc/plugin.ts
var r = { install(e, { configure: n } = {}) {
	e.config.globalProperties.$services = t, e.config.globalProperties.$configs ??= {}, e.provide("services", t), n && n(t);
} }, i = { registerComponentsGlobally: !1 };
function a(e) {
	Object.assign(i, e);
}
//#endregion
export { t as a, e as i, i as n, n as o, r, a as t };
