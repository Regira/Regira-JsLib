//#region src/vue/ioc/ServiceProvider.ts
var e = class {
	services;
	constructor() {
		this.services = /* @__PURE__ */ new Map();
	}
	get(e) {
		let t = this.services.get(e);
		return t == null ? null : t(this);
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
	e.config.globalProperties.$services = t, e.provide("services", t), n && n(t);
} };
//#endregion
export { n as i, e as n, t as r, r as t };
