import { startsWith as e } from "../../utilities/string-utility.js";
import { t } from "../../_chunks/query-3.2.0.js";
import { computed as n, createBlock as r, createCommentVNode as i, createElementBlock as a, createElementVNode as o, createTextVNode as s, createVNode as c, defineComponent as l, guardReactiveProps as u, isRef as d, normalizeProps as f, openBlock as p, ref as m, renderSlot as h, resolveComponent as g, toDisplayString as _, unref as v, vModelText as y, watch as b, withCtx as x, withDirectives as S, withModifiers as C } from "vue";
import { defineStore as w } from "pinia";
import { useRouter as T } from "vue-router";
//#region src/vue/auth/AuthData.ts
var E = class {
	_decodedToken;
	isAuthenticated;
	expires;
	userId;
	name;
	email;
	displayName;
	culture;
	role;
	constructor(e, t = { isAuthenticated: !1 }) {
		this._decodedToken = e == null ? {} : JSON.parse(window.atob(e.split(".")[1])), this.isAuthenticated = t.isAuthenticated, this.expires = (this._decodedToken.exp ?? 0) - (this._decodedToken.nbf ?? 0), this.userId = this.get("sub"), this.name = this.get("name"), this.email = this.get("email"), this.displayName = this.get("displayName") ?? this.get("display_name"), this.culture = this.get("culture");
	}
	get(e) {
		return this._decodedToken[e];
	}
	hasClaim(e, t) {
		let n = this.get(e);
		return n !== void 0 && (t == null || (Array.isArray(n) ? n.includes(t) : n == t));
	}
	hasPermission(e) {
		return this.hasClaim("permissions", e);
	}
}, D = () => new E(), O = class {
	axios;
	tokenManager;
	options;
	constructor(e, t, n) {
		this.axios = e, this.tokenManager = t, this.options = n || {};
	}
	authenticate({ token: e, isAuthenticated: t }) {
		return t ? (this.tokenManager.token = e, new E(e, { isAuthenticated: t })) : (this.tokenManager.token = void 0, D());
	}
	async login(e, t) {
		let n = this.options?.loginUrl || "auth", r = await this.axios.post(n, {
			username: e,
			password: t
		});
		return this.authenticate(r.data);
	}
	async refresh(e) {
		let n = `auth/refresh/?${t(e || {})}`, r = await this.axios.post(n);
		return this.authenticate(r.data);
	}
	async validateToken() {
		if (this.tokenManager.token != null) try {
			let e = await this.axios.post("auth/validate");
			if (e.status >= 200 && e.status < 300) return this.authenticate({
				token: this.tokenManager.token,
				isAuthenticated: !0
			});
			console.warn("validateToken: invalid statusCode", e.status, {
				tokenManager: this.tokenManager,
				token: this.tokenManager.token
			});
		} catch (e) {
			console.error("validating token failed", {
				ex: e,
				token: this.tokenManager.token
			}), e.response && e.response.status === 401 && (this.tokenManager.token = void 0);
		}
		return D();
	}
	logout() {
		this.tokenManager.token = void 0;
	}
	async changePassword(e) {
		await this.axios.post("auth/password", e);
	}
	async forgotPassword(e) {
		await this.axios.post("auth/password/recover", e);
	}
	async resetPassword(e) {
		await this.axios.post("auth/password/reset", e);
	}
}, k = ({ router: e, store: t }) => {
	e.beforeEach((e, n) => {
		if (e.meta && e.meta.allowAnonymous) return !0;
		if (t.isAuthenticated) {
			let n = e.matched.map((e) => e.meta?.policy).filter((e) => typeof e == "function");
			if (n.length && !n.every((e) => e(t))) return {
				name: "forbidden",
				query: { url: e.fullPath }
			};
			let r = e.matched.flatMap((e) => e.meta?.permissions || []);
			return r.length && !r.every((e) => t.hasPermission(e)) ? {
				name: "forbidden",
				query: { url: e.fullPath }
			} : !0;
		}
		return t.$patch({ authRequired: !0 }), !0;
	});
}, A = "auth:token", j = class {
	prefix;
	constructor(e = "") {
		this.prefix = e;
	}
	get token() {
		return Object.fromEntries((document.cookie || "").split(";").filter((e) => e.indexOf("=") > 1 && e.indexOf("=") < e.length - 1).map((e) => [e.substring(0, e.indexOf("=")).trim(), e.substring(e.indexOf("=") + 1).trim()]))[this.fullKey];
	}
	set token(e) {
		e == null ? document.cookie = `${this.fullKey}=;expires=${/* @__PURE__ */ new Date() - 1}; path=/;` : document.cookie = `${this.fullKey}=${e}; path=/;`;
	}
	get fullKey() {
		return this.prefix + A;
	}
}, ee = class {
	_token;
	constructor(e) {
		this._token = e;
	}
	get token() {
		return this._token;
	}
	set token(e) {
		this._token = e;
	}
}, M = class {
	prefix;
	constructor(e = "") {
		this.prefix = e;
	}
	get token() {
		return localStorage.getItem(this.fullKey) ?? void 0;
	}
	set token(e) {
		e ? localStorage.setItem(this.fullKey, e) : localStorage.removeItem(this.fullKey);
	}
	get fullKey() {
		return this.prefix + A;
	}
}, N;
function P(e) {
	let { enabled: t, tokenManager: n, axios: r, clientApp: i, loginUrl: a } = e;
	return N = {
		enabled: t,
		clientApp: i,
		tokenManager: n,
		service: new O(r, n, {
			clientApp: i,
			loginUrl: a
		})
	}, N;
}
var F = () => N, I = "Auth";
function L() {
	let e = m(!0), t = m(), r = m(D()), i = m(!1), a = T(), o = n(() => e.value && !a.currentRoute.value?.meta?.allowAnonymous), s = n(() => !!r.value.isAuthenticated), c = n(() => r.value?.displayName), l = n(() => (e) => r.value.get(e)), u = n(() => (e, t) => r.value?.hasClaim(e, t) ?? !1), d = n(() => (e) => r.value?.hasPermission(e) ?? !1);
	function f(e) {
		t.value = e;
	}
	async function p({ username: e, password: n }) {
		let { service: i } = F();
		return r.value = await i.login(e, n, t.value), r.value.isAuthenticated;
	}
	async function h(e) {
		let { service: t } = F();
		return r.value = await t.refresh(e), r.value.isAuthenticated;
	}
	async function g() {
		let { service: e } = F();
		return r.value = await e.validateToken(), r.value.isAuthenticated;
	}
	function _() {
		r.value = D();
		let { service: e } = F();
		e.logout();
	}
	return {
		enabled: e,
		clientApp: t,
		authData: r,
		authRequired: i,
		isRequired: o,
		isAuthenticated: s,
		hasPermission: d,
		displayName: c,
		hasClaim: u,
		getClaimValue: l,
		setClientApp: f,
		login: p,
		refresh: h,
		validateToken: g,
		logout: _
	};
}
L.storeName = I;
var R = w(I, L);
//#endregion
//#region src/vue/auth/auth-axios.ts
function z(e, t) {
	return e.interceptors.request.use((e) => (t.token && (e.headers.Authorization = `Bearer ${t.token}`), e)), e;
}
function B(t, n) {
	t.interceptors.response.use((e) => e, async (r) => {
		let { config: i } = r;
		return console.error("axios error", {
			error: r,
			config: i,
			auth: { ...n.authData },
			axios: t
		}), !e(i.url, "auth/", !0) && [401].includes(r.response?.status) && (n.$patch({ authRequired: !0 }), n.isAuthenticated && await n.validateToken()), Promise.reject(r);
	});
}
//#endregion
//#region src/vue/auth/plugin.ts
var V = { async install(e, t) {
	let { clientApp: n, loginUrl: r, tokenManager: i, authStore: a, axios: o, enableRouteGuard: s = !0, enabled: c = !0, onAuthenticationChange: l = () => {} } = t, { $router: u } = e.config.globalProperties, d = P({
		enabled: c,
		tokenManager: i,
		axios: o,
		clientApp: n,
		loginUrl: r
	}), f = a ?? R();
	if (f.$patch({ enabled: c }), c ? (e.config.globalProperties.$auth = {
		...d,
		get authData() {
			return f.authData;
		},
		get isAuthenticated() {
			return !!f.authData?.isAuthenticated;
		},
		get isRequired() {
			return f.authRequired;
		}
	}, n && f.$patch({ clientApp: n })) : e.config.globalProperties.$auth = { enabled: !1 }, c) {
		z(o, i);
		let e = 0;
		b(() => f.isAuthenticated, () => {
			f.isAuthenticated && (clearInterval(e), e = setInterval(() => f.validateToken(), f.authData.expires * 1e3)), l(f.authData);
		}), await f.validateToken(), s && k({
			router: u,
			store: f
		}), B(o, f);
	} else l({ isAuthenticated: !1 });
} };
//#endregion
//#region src/vue/auth/useLoginForm.ts
function H(e, t) {
	let n = m(e.username || ""), r = m(""), i = m(!1), a = m(!1), o = m(!1), s = R();
	async function c() {
		a.value = !0, i.value = !1, t("signingIn", n.value);
		try {
			await s.login({
				username: n.value,
				password: r.value
			}) ? t("success", n.value) : t("fail", n.value);
		} catch (e) {
			console.error("login failed", { ex: e }), i.value = !0, o.value = e.response?.data?.isLockedOut, t("fail", n.value);
		} finally {
			a.value = !1;
		}
	}
	function l() {
		t("forgotPassword", n.value);
	}
	return {
		username: n,
		password: r,
		failed: i,
		signingIn: a,
		isLockedOut: o,
		handleSubmit: c,
		handleForgotPassword: l
	};
}
//#endregion
//#region src/vue/auth/useForgotPasswordForm.ts
function U(e, t, r) {
	let { service: i } = F(), a = m(!1), o = m(e.username || ""), s = n(() => o.value != ""), c = m();
	async function l() {
		c.value = void 0, a.value = !0;
		try {
			await i.forgotPassword({
				username: o.value,
				siteUrl: r.siteUrl,
				siteName: r.siteName
			}), t("success", o.value), c.value = !0;
		} catch (e) {
			c.value = !1, console.error("Resetting password failed", { err: e }), t("fail", e);
		} finally {
			a.value = !1;
		}
	}
	return b(() => e.username, () => o.value = e.username || ""), {
		username: o,
		isLoading: a,
		isFormValid: s,
		isSuccess: c,
		handleSubmit: l
	};
}
//#endregion
//#region src/vue/auth/LoginForm.vue?vue&type=script&setup=true&lang.ts
var W = {
	key: 0,
	class: "mb-3 position-relative"
}, G = { class: "bg-danger border rounded text-light p-2" }, K = { key: 0 }, q = { class: "row mb-3" }, J = { class: "col-sm-9" }, Y = { class: "input-group" }, X = ["disabled"], Z = { class: "row mb-3" }, Q = { class: "col-sm-9" }, te = ["disabled"], ne = { class: "row" }, re = { class: "col-sm-3" }, ie = ["disabled"], ae = { class: "col-sm" }, oe = {
	key: 0,
	class: "text-info"
}, $ = /* @__PURE__ */ l({
	__name: "LoginForm",
	props: {
		username: {},
		signingIn: { type: Boolean }
	},
	emits: [
		"forgotPassword",
		"signingIn",
		"success",
		"fail"
	],
	setup(e, { emit: t }) {
		let { username: n, password: r, signingIn: c, failed: l, isLockedOut: u, handleSubmit: f, handleForgotPassword: m } = H(e, t);
		return (e, t) => (p(), a("form", {
			onSubmit: t[3] ||= C((...e) => v(f) && v(f)(...e), ["prevent"]),
			ref: "loginForm"
		}, [
			v(l) ? (p(), a("div", W, [o("div", G, [t[4] ||= s(" Unfortunately, signing in failed. ", -1), v(u) ? (p(), a("span", K, "Try again in 5 min.")) : i("", !0)])])) : i("", !0),
			o("div", q, [t[5] ||= o("label", {
				for: "username",
				class: "col-sm-3 col-form-label"
			}, "Username", -1), o("div", J, [o("div", Y, [S(o("input", {
				class: "form-control",
				autocomplete: "username email",
				"onUpdate:modelValue": t[0] ||= (e) => d(n) ? n.value = e : null,
				disabled: v(c)
			}, null, 8, X), [[y, v(n)]])])])]),
			o("div", Z, [t[6] ||= o("label", {
				for: "password",
				class: "col-sm-3 col-form-label"
			}, "Password", -1), o("div", Q, [S(o("input", {
				type: "password",
				class: "form-control",
				autocomplete: "password current-password",
				"onUpdate:modelValue": t[1] ||= (e) => d(r) ? r.value = e : null,
				disabled: v(c)
			}, null, 8, te), [[y, v(r)]])])]),
			o("div", ne, [o("div", re, [o("button", {
				type: "submit",
				class: "btn btn-primary",
				disabled: v(c)
			}, "Sign in", 8, ie)]), o("div", ae, [v(c) ? (p(), a("span", oe, " Signing in ... ")) : (p(), a("button", {
				key: 1,
				type: "button",
				class: "btn btn-link",
				onClick: t[2] ||= (...e) => v(m) && v(m)(...e)
			}, "Forgot password?"))])])
		], 544));
	}
}), se = /* @__PURE__ */ l({
	__name: "LogoutForm",
	setup(e) {
		let t = R(), r = T(), i = () => {
			t.logout();
			let e = r.currentRoute.value.fullPath;
			r.push({
				name: "login",
				query: { returnUrl: e }
			});
		}, s = n(() => t.displayName);
		return (e, t) => (p(), a("form", null, [o("button", {
			type: "button",
			class: "btn btn-sm btn-secondary",
			onClick: i
		}, _(s.value) + " afmelden", 1)]));
	}
}), ce = /* @__PURE__ */ l({
	__name: "LoginModal",
	props: {
		username: {},
		title: { default: "Sign in" }
	},
	emits: [
		"forgotPassword",
		"signingIn",
		"success",
		"fail"
	],
	setup(e, { emit: t }) {
		return (t, n) => {
			let i = g("MyModal");
			return p(), r(i, {
				title: e.title,
				showFooter: !1
			}, {
				default: x(() => [h(t.$slots, "default", f(u({ username: e.username })), () => [c($, {
					onSuccess: n[0] ||= (e) => t.$emit("success", e),
					onForgotPassword: n[1] ||= (e) => t.$emit("forgotPassword", e),
					onSigningIn: n[2] ||= (e) => t.$emit("signingIn", e),
					onFail: n[3] ||= (e) => t.$emit("fail", e)
				})])]),
				_: 3
			}, 8, ["title"]);
		};
	}
}), le = /* @__PURE__ */ l({
	__name: "ForgotPasswordModal",
	props: { username: {} },
	setup(e) {
		return (t, n) => {
			let i = g("MyModal");
			return p(), r(i, {
				title: "Forgot password",
				showFooter: !1
			}, {
				default: x(() => [h(t.$slots, "default", f(u({ username: e.username })))]),
				_: 3
			});
		};
	}
});
//#endregion
export { O as AuthService, j as CookieTokenManager, le as ForgotPasswordModal, M as LocalStorageTokenManager, $ as LoginForm, ce as LoginModal, se as LogoutForm, ee as MemoryTokenManager, L as createStore, V as plugin, k as routeGuard, F as useAuth, R as useAuthStore, U as useForgotPasswordForm, H as useLoginForm };
