import { t as e } from "./event-handler-3.2.3.js";
//#region src/identity/identity-manager.ts
var t = class {
	_service;
	_autoRefreshTimer;
	_autoRefresh;
	state;
	constructor({ authenticationService: e, autoRefresh: t = !1 }) {
		this._service = e, this._autoRefreshTimer = null, this._autoRefresh = t, this._setState();
	}
	get autoRefresh() {
		return this._autoRefresh;
	}
	set autoRefresh(e) {
		this._autoRefresh = !!e, this._checkAutoRefresh();
	}
	async login(e, t) {
		let n = await this._service.login(e, t);
		return this._setState(n), this._checkAutoRefresh(), this.trigger("login", { ...this.state });
	}
	async refresh() {
		let e = await this._service.refresh(this.state.refreshToken);
		return this._setState(e), this._checkAutoRefresh(), this.trigger("refresh", { ...this.state });
	}
	async logoff() {
		let e = { ...this.state };
		return this._setState(), this.trigger("logoff", e);
	}
	_setState(e = null) {
		if (!e) {
			this.state = { isAuthenticated: !1 };
			return;
		}
		let t = e;
		this.state = {
			...t,
			expiresAt: new Date((/* @__PURE__ */ new Date()).getTime() + t.expiresIn * 1e3),
			isAuthenticated: !0
		};
	}
	_checkAutoRefresh() {
		let e = this;
		if (this._autoRefreshTimer && clearTimeout(this._autoRefreshTimer), this._autoRefresh) {
			let t = Math.abs(this.state.expiresAt.getTime() - (/* @__PURE__ */ new Date()).getTime()) - 60 * 1e3;
			this._autoRefreshTimer = setTimeout(() => e.refresh(), t);
		}
	}
};
e.injectInto(t.prototype);
//#endregion
//#region src/identity/authentication/dummy-service.ts
var n = class {
	constructor() {
		console.warn("This is a dummy-service");
	}
	async login(e, t) {
		console.warn("Not implemented: login");
	}
	async refresh(e) {
		console.warn("Not implemented: refresh");
	}
	async resetPassword(e) {
		console.warn("Not implemented: resetPassword");
	}
}, r = {
	IdentityManager: t,
	DummyService: n
};
//#endregion
export { n, t as r, r as t };
