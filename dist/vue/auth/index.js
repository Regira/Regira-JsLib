import { startsWith as e } from "../../utilities/string-utility.js";
import { t } from "../../_chunks/query-3.2.5.js";
import { t as n } from "../../_chunks/DefaultModal-3.2.5.js";
import { computed as r, createBlock as i, createCommentVNode as a, createElementBlock as o, createElementVNode as s, createTextVNode as c, createVNode as l, defineComponent as u, guardReactiveProps as d, isRef as f, normalizeProps as p, openBlock as m, ref as h, renderSlot as g, toDisplayString as _, unref as v, vModelText as y, watch as b, withCtx as x, withDirectives as S, withModifiers as C } from "vue";
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
function te(e) {
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
var P = () => N, F = "Auth";
function I() {
	let e = h(!0), t = h(), n = h(D()), i = h(!1), a = T(), o = r(() => e.value && !a.currentRoute.value?.meta?.allowAnonymous), s = r(() => !!n.value.isAuthenticated), c = r(() => n.value?.displayName), l = r(() => (e) => n.value.get(e)), u = r(() => (e, t) => n.value?.hasClaim(e, t) ?? !1), d = r(() => (e) => n.value?.hasPermission(e) ?? !1);
	function f(e) {
		t.value = e;
	}
	async function p({ username: e, password: r }) {
		let { service: i } = P();
		return n.value = await i.login(e, r, t.value), n.value.isAuthenticated;
	}
	async function m(e) {
		let { service: t } = P();
		return n.value = await t.refresh(e), n.value.isAuthenticated;
	}
	async function g() {
		let { service: e } = P();
		return n.value = await e.validateToken(), n.value.isAuthenticated;
	}
	function _() {
		n.value = D();
		let { service: e } = P();
		e.logout();
	}
	return {
		enabled: e,
		clientApp: t,
		authData: n,
		authRequired: i,
		isRequired: o,
		isAuthenticated: s,
		hasPermission: d,
		displayName: c,
		hasClaim: u,
		getClaimValue: l,
		setClientApp: f,
		login: p,
		refresh: m,
		validateToken: g,
		logout: _
	};
}
I.storeName = F;
var L = w(F, I);
//#endregion
//#region src/vue/auth/auth-axios.ts
function R(e, t) {
	return e.interceptors.request.use((e) => (t.token && (e.headers.Authorization = `Bearer ${t.token}`), e)), e;
}
function z(t, n) {
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
var B = { async install(e, t) {
	let { clientApp: n, loginUrl: r, tokenManager: i, authStore: a, axios: o, enableRouteGuard: s = !0, enabled: c = !0, onAuthenticationChange: l = () => {} } = t, { $router: u } = e.config.globalProperties, d = te({
		enabled: c,
		tokenManager: i,
		axios: o,
		clientApp: n,
		loginUrl: r
	}), f = a ?? L();
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
		R(o, i);
		let e = 0;
		b(() => f.isAuthenticated, () => {
			f.isAuthenticated && (clearInterval(e), e = setInterval(() => f.validateToken(), f.authData.expires * 1e3)), l(f.authData);
		}), await f.validateToken(), s && k({
			router: u,
			store: f
		}), z(o, f);
	} else l({ isAuthenticated: !1 });
} };
//#endregion
//#region src/vue/auth/useLoginForm.ts
function V(e, t) {
	let n = h(e.username || ""), r = h(""), i = h(!1), a = h(!1), o = h(!1), s = L();
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
function H(e, t, n) {
	let { service: i } = P(), a = h(!1), o = h(e.username || ""), s = r(() => o.value != ""), c = h();
	async function l() {
		c.value = void 0, a.value = !0;
		try {
			await i.forgotPassword({
				username: o.value,
				siteUrl: n.siteUrl,
				siteName: n.siteName
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
var U = {
	key: 0,
	class: "mb-3 position-relative"
}, W = { class: "bg-danger border rounded text-light p-2" }, G = { key: 0 }, K = { class: "row mb-3" }, q = { class: "col-sm-9" }, J = { class: "input-group" }, Y = ["disabled"], X = { class: "row mb-3" }, Z = { class: "col-sm-9" }, ne = ["disabled"], re = { class: "row" }, ie = { class: "col-sm-3" }, ae = ["disabled"], oe = { class: "col-sm" }, Q = {
	key: 0,
	class: "text-info"
}, $ = /* @__PURE__ */ u({
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
		let { username: n, password: r, signingIn: i, failed: l, isLockedOut: u, handleSubmit: d, handleForgotPassword: p } = V(e, t);
		return (e, t) => (m(), o("form", {
			onSubmit: t[3] ||= C((...e) => v(d) && v(d)(...e), ["prevent"]),
			ref: "loginForm"
		}, [
			v(l) ? (m(), o("div", U, [s("div", W, [t[4] ||= c(" Unfortunately, signing in failed. ", -1), v(u) ? (m(), o("span", G, "Try again in 5 min.")) : a("", !0)])])) : a("", !0),
			s("div", K, [t[5] ||= s("label", {
				for: "username",
				class: "col-sm-3 col-form-label"
			}, "Username", -1), s("div", q, [s("div", J, [S(s("input", {
				class: "form-control",
				autocomplete: "username email",
				"onUpdate:modelValue": t[0] ||= (e) => f(n) ? n.value = e : null,
				disabled: v(i)
			}, null, 8, Y), [[y, v(n)]])])])]),
			s("div", X, [t[6] ||= s("label", {
				for: "password",
				class: "col-sm-3 col-form-label"
			}, "Password", -1), s("div", Z, [S(s("input", {
				type: "password",
				class: "form-control",
				autocomplete: "password current-password",
				"onUpdate:modelValue": t[1] ||= (e) => f(r) ? r.value = e : null,
				disabled: v(i)
			}, null, 8, ne), [[y, v(r)]])])]),
			s("div", re, [s("div", ie, [s("button", {
				type: "submit",
				class: "btn btn-primary",
				disabled: v(i)
			}, "Sign in", 8, ae)]), s("div", oe, [v(i) ? (m(), o("span", Q, " Signing in ... ")) : (m(), o("button", {
				key: 1,
				type: "button",
				class: "btn btn-link",
				onClick: t[2] ||= (...e) => v(p) && v(p)(...e)
			}, "Forgot password?"))])])
		], 544));
	}
}), se = /* @__PURE__ */ u({
	__name: "LogoutForm",
	setup(e) {
		let t = L(), n = T(), i = () => {
			t.logout();
			let e = n.currentRoute.value.fullPath;
			n.push({
				name: "login",
				query: { returnUrl: e }
			});
		}, a = r(() => t.displayName);
		return (e, t) => (m(), o("form", null, [s("button", {
			type: "button",
			class: "btn btn-sm btn-secondary",
			onClick: i
		}, _(a.value) + " afmelden", 1)]));
	}
}), ce = /* @__PURE__ */ u({
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
		return (t, r) => (m(), i(n, {
			"is-visible": "",
			title: e.title,
			showFooter: !1
		}, {
			default: x(() => [g(t.$slots, "default", p(d({ username: e.username })), () => [l($, {
				onSuccess: r[0] ||= (e) => t.$emit("success", e),
				onForgotPassword: r[1] ||= (e) => t.$emit("forgotPassword", e),
				onSigningIn: r[2] ||= (e) => t.$emit("signingIn", e),
				onFail: r[3] ||= (e) => t.$emit("fail", e)
			})])]),
			_: 3
		}, 8, ["title"]));
	}
}), le = /* @__PURE__ */ u({
	__name: "ForgotPasswordModal",
	props: { username: {} },
	setup(e) {
		return (t, r) => (m(), i(n, {
			"is-visible": "",
			title: "Forgot password",
			showFooter: !1
		}, {
			default: x(() => [g(t.$slots, "default", p(d({ username: e.username })))]),
			_: 3
		}));
	}
});
//#endregion
export { O as AuthService, j as CookieTokenManager, le as ForgotPasswordModal, M as LocalStorageTokenManager, $ as LoginForm, ce as LoginModal, se as LogoutForm, ee as MemoryTokenManager, I as createStore, B as plugin, k as routeGuard, P as useAuth, L as useAuthStore, H as useForgotPasswordForm, V as useLoginForm };
