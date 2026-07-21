import { startsWith as e } from "../../utilities/string-utility.js";
import { t } from "../../_chunks/query-3.2.6.js";
import { n } from "../../_chunks/modal-3.2.6.js";
import { computed as r, createBlock as i, createCommentVNode as a, createElementBlock as o, createElementVNode as s, createTextVNode as c, createVNode as l, defineComponent as u, guardReactiveProps as d, isRef as f, normalizeClass as p, normalizeProps as m, openBlock as h, ref as g, renderSlot as _, resolveDynamicComponent as v, toDisplayString as y, unref as b, vModelText as x, watch as S, withCtx as C, withDirectives as w, withModifiers as T } from "vue";
import { defineStore as E } from "pinia";
import { useRouter as D } from "vue-router";
//#region src/vue/auth/AuthData.ts
var O = class {
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
}, k = () => new O(), A = class {
	axios;
	tokenManager;
	options;
	constructor(e, t, n) {
		this.axios = e, this.tokenManager = t, this.options = n || {};
	}
	authenticate({ token: e, isAuthenticated: t }) {
		return t ? (this.tokenManager.token = e, new O(e, { isAuthenticated: t })) : (this.tokenManager.token = void 0, k());
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
		return k();
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
}, j = ({ router: e, store: t }) => {
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
}, M = "auth:token", N = class {
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
		return this.prefix + M;
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
}, te = class {
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
		return this.prefix + M;
	}
}, P;
function F(e) {
	let { enabled: t, tokenManager: n, axios: r, clientApp: i, loginUrl: a } = e;
	return P = {
		enabled: t,
		clientApp: i,
		tokenManager: n,
		service: new A(r, n, {
			clientApp: i,
			loginUrl: a
		})
	}, P;
}
var I = () => P, L;
function R(e) {
	L = e;
}
var z = () => L, ne = (e = z()) => e?.authData?.displayName ?? e?.authData?.name ?? e?.authData?.email, B = "Auth";
function V() {
	let e = g(!0), t = g(), n = g(k()), i = g(!1), a = D(), o = r(() => e.value && !a.currentRoute.value?.meta?.allowAnonymous), s = r(() => !!n.value.isAuthenticated), c = r(() => n.value?.displayName), l = r(() => (e) => n.value.get(e)), u = r(() => (e, t) => n.value?.hasClaim(e, t) ?? !1), d = r(() => (e) => n.value?.hasPermission(e) ?? !1);
	function f(e) {
		t.value = e;
	}
	async function p({ username: e, password: r }) {
		let { service: i } = I();
		return n.value = await i.login(e, r, t.value), n.value.isAuthenticated;
	}
	async function m(e) {
		let { service: t } = I();
		return n.value = await t.refresh(e), n.value.isAuthenticated;
	}
	async function h() {
		let { service: e } = I();
		return n.value = await e.validateToken(), n.value.isAuthenticated;
	}
	function _() {
		n.value = k();
		let { service: e } = I();
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
		validateToken: h,
		logout: _
	};
}
V.storeName = B;
var H = E(B, V);
//#endregion
//#region src/vue/auth/auth-axios.ts
function U(e, t) {
	return e.interceptors.request.use((e) => (t.token && (e.headers.Authorization = `Bearer ${t.token}`), e)), e;
}
function W(t, n) {
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
var G = { async install(e, t) {
	let { clientApp: n, loginUrl: r, tokenManager: i, authStore: a, axios: o, enableRouteGuard: s = !0, enabled: c = !0, onAuthenticationChange: l = () => {} } = t, { $router: u } = e.config.globalProperties, d = F({
		enabled: c,
		tokenManager: i,
		axios: o,
		clientApp: n,
		loginUrl: r
	}), f = a ?? H();
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
	}, n && f.$patch({ clientApp: n })) : e.config.globalProperties.$auth = { enabled: !1 }, R(e.config.globalProperties.$auth), c) {
		U(o, i);
		let e = 0;
		S(() => f.isAuthenticated, () => {
			f.isAuthenticated && (clearInterval(e), e = setInterval(() => f.validateToken(), f.authData.expires * 1e3)), l(f.authData);
		}), await f.validateToken(), s && j({
			router: u,
			store: f
		}), W(o, f);
	} else l({ isAuthenticated: !1 });
} };
//#endregion
//#region src/vue/auth/useLoginForm.ts
function K(e, t) {
	let n = g(e.username || ""), r = g(""), i = g(!1), a = g(!1), o = g(!1), s = H();
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
function q(e, t, n) {
	let { service: i } = I(), a = g(!1), o = g(e.username || ""), s = r(() => o.value != ""), c = g();
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
	return S(() => e.username, () => o.value = e.username || ""), {
		username: o,
		isLoading: a,
		isFormValid: s,
		isSuccess: c,
		handleSubmit: l
	};
}
//#endregion
//#region src/vue/auth/useChangePasswordForm.ts
function J(e) {
	let { service: t } = I(), n = g(""), i = g(""), a = g(""), o = g(!1), s = g(), c = r(() => i.value === a.value), l = r(() => n.value != "" && i.value != "" && c.value);
	async function u() {
		if (l.value) {
			s.value = void 0, o.value = !0;
			try {
				await t.changePassword({
					currentPassword: n.value,
					newPassword: i.value
				}), s.value = !0, n.value = "", i.value = "", a.value = "", e("success");
			} catch (t) {
				s.value = !1, console.error("changing password failed", { ex: t }), e("fail", t);
			} finally {
				o.value = !1;
			}
		}
	}
	return {
		currentPassword: n,
		newPassword: i,
		confirmPassword: a,
		isLoading: o,
		isSuccess: s,
		passwordsMatch: c,
		isFormValid: l,
		handleSubmit: u
	};
}
//#endregion
//#region src/vue/auth/useResetPasswordForm.ts
function Y(e, t) {
	let { service: n } = I(), i = g(""), a = g(""), o = g(!1), s = g(), c = r(() => i.value === a.value), l = r(() => i.value != "" && c.value);
	async function u() {
		if (l.value) {
			s.value = void 0, o.value = !0;
			try {
				await n.resetPassword({
					token: e.token,
					password: i.value
				}), s.value = !0, t("success");
			} catch (e) {
				s.value = !1, console.error("resetting password failed", { ex: e }), t("fail", e);
			} finally {
				o.value = !1;
			}
		}
	}
	return {
		password: i,
		confirmPassword: a,
		isLoading: o,
		isSuccess: s,
		passwordsMatch: c,
		isFormValid: l,
		handleSubmit: u
	};
}
//#endregion
//#region src/vue/auth/LoginForm.vue?vue&type=script&setup=true&lang.ts
var X = {
	key: 0,
	class: "mb-3 position-relative"
}, Z = { class: "bg-danger border rounded text-light p-2" }, re = { key: 0 }, ie = { class: "row mb-3" }, ae = { class: "col-sm-9" }, oe = { class: "input-group" }, se = ["disabled"], ce = { class: "row mb-3" }, le = { class: "col-sm-9" }, ue = ["disabled"], de = { class: "row" }, fe = { class: "col-sm-3" }, pe = ["disabled"], me = { class: "col-sm" }, he = {
	key: 0,
	class: "text-info"
}, Q = /* @__PURE__ */ u({
	__name: "LoginForm",
	props: { username: {} },
	emits: [
		"forgotPassword",
		"signingIn",
		"success",
		"fail"
	],
	setup(e, { emit: t }) {
		let { username: n, password: r, signingIn: i, failed: l, isLockedOut: u, handleSubmit: d, handleForgotPassword: p } = K(e, t);
		return (e, t) => (h(), o("form", {
			class: "rg-login-form",
			onSubmit: t[3] ||= T((...e) => b(d) && b(d)(...e), ["prevent"]),
			ref: "loginForm"
		}, [
			b(l) ? (h(), o("div", X, [s("div", Z, [t[4] ||= c(" Unfortunately, signing in failed. ", -1), b(u) ? (h(), o("span", re, "Try again in 5 min.")) : a("", !0)])])) : a("", !0),
			s("div", ie, [t[5] ||= s("label", {
				for: "username",
				class: "col-sm-3 col-form-label"
			}, "Username", -1), s("div", ae, [s("div", oe, [w(s("input", {
				class: "form-control",
				autocomplete: "username email",
				"onUpdate:modelValue": t[0] ||= (e) => f(n) ? n.value = e : null,
				disabled: b(i)
			}, null, 8, se), [[x, b(n)]])])])]),
			s("div", ce, [t[6] ||= s("label", {
				for: "password",
				class: "col-sm-3 col-form-label"
			}, "Password", -1), s("div", le, [w(s("input", {
				type: "password",
				class: "form-control",
				autocomplete: "password current-password",
				"onUpdate:modelValue": t[1] ||= (e) => f(r) ? r.value = e : null,
				disabled: b(i)
			}, null, 8, ue), [[x, b(r)]])])]),
			s("div", de, [s("div", fe, [s("button", {
				type: "submit",
				class: "btn btn-primary",
				disabled: b(i)
			}, "Sign in", 8, pe)]), s("div", me, [b(i) ? (h(), o("span", he, " Signing in ... ")) : (h(), o("button", {
				key: 1,
				type: "button",
				class: "btn btn-link",
				onClick: t[2] ||= (...e) => b(p) && b(p)(...e)
			}, "Forgot password?"))])])
		], 544));
	}
}), ge = { class: "rg-logout-form" }, _e = /* @__PURE__ */ u({
	__name: "LogoutForm",
	setup(e) {
		let t = H(), n = D(), i = () => {
			t.logout();
			let e = n.currentRoute.value.fullPath;
			n.push({
				name: "login",
				query: { returnUrl: e }
			});
		}, a = r(() => t.displayName);
		return (e, t) => (h(), o("form", ge, [s("button", {
			type: "button",
			class: "btn btn-sm btn-secondary",
			onClick: i
		}, y(a.value) + " afmelden", 1)]));
	}
}), ve = /* @__PURE__ */ u({
	__name: "LoginModal",
	props: {
		username: {},
		title: { default: "Sign in" },
		isVisible: {
			type: Boolean,
			default: !0
		}
	},
	emits: [
		"forgotPassword",
		"signingIn",
		"success",
		"fail"
	],
	setup(e) {
		let t = n();
		return (n, r) => (h(), i(v(b(t)), {
			"is-visible": e.isVisible,
			title: e.title,
			showFooter: !1
		}, {
			default: C(() => [_(n.$slots, "default", m(d({ username: e.username })), () => [l(Q, {
				onSuccess: r[0] ||= (e) => n.$emit("success", e),
				onForgotPassword: r[1] ||= (e) => n.$emit("forgotPassword", e),
				onSigningIn: r[2] ||= (e) => n.$emit("signingIn", e),
				onFail: r[3] ||= (e) => n.$emit("fail", e)
			})])]),
			_: 3
		}, 8, ["is-visible", "title"]));
	}
}), ye = /* @__PURE__ */ u({
	__name: "ForgotPasswordModal",
	props: {
		username: {},
		isVisible: {
			type: Boolean,
			default: !0
		}
	},
	setup(e) {
		let t = n();
		return (n, r) => (h(), i(v(b(t)), {
			"is-visible": e.isVisible,
			title: "Forgot password",
			showFooter: !1
		}, {
			default: C(() => [_(n.$slots, "default", m(d({ username: e.username })))]),
			_: 3
		}, 8, ["is-visible"]));
	}
}), be = {
	key: 0,
	class: "mb-3"
}, xe = {
	key: 1,
	class: "mb-3"
}, Se = ["value"], Ce = { class: "row mb-3" }, we = { class: "col-sm-9" }, Te = ["disabled"], Ee = { class: "row mb-3" }, De = { class: "col-sm-9" }, Oe = ["disabled"], ke = { class: "row mb-3" }, Ae = { class: "col-sm-9" }, je = ["disabled"], Me = { class: "row" }, Ne = { class: "col-sm-9 offset-sm-3" }, Pe = ["disabled"], $ = /* @__PURE__ */ u({
	__name: "ChangePasswordForm",
	props: { username: {} },
	emits: ["success", "fail"],
	setup(e, { emit: t }) {
		let { currentPassword: n, newPassword: r, confirmPassword: i, isLoading: c, isSuccess: l, passwordsMatch: u, isFormValid: d, handleSubmit: m } = J(t);
		return (t, g) => (h(), o("form", {
			class: "rg-change-password-form",
			onSubmit: g[3] ||= T((...e) => b(m) && b(m)(...e), ["prevent"])
		}, [
			b(l) === !1 ? (h(), o("div", be, [...g[4] ||= [s("div", { class: "bg-danger border rounded text-light p-2" }, "Unfortunately, changing the password failed.", -1)]])) : a("", !0),
			b(l) ? (h(), o("div", xe, [...g[5] ||= [s("div", { class: "bg-success border rounded text-light p-2" }, "Password changed.", -1)]])) : a("", !0),
			s("input", {
				type: "text",
				class: "visually-hidden",
				name: "username",
				autocomplete: "username",
				value: e.username,
				readonly: "",
				tabindex: "-1",
				"aria-hidden": "true"
			}, null, 8, Se),
			s("div", Ce, [g[6] ||= s("label", { class: "col-sm-3 col-form-label" }, "Current password", -1), s("div", we, [w(s("input", {
				type: "password",
				class: "form-control",
				autocomplete: "current-password",
				"onUpdate:modelValue": g[0] ||= (e) => f(n) ? n.value = e : null,
				disabled: b(c)
			}, null, 8, Te), [[x, b(n)]])])]),
			s("div", Ee, [g[7] ||= s("label", { class: "col-sm-3 col-form-label" }, "New password", -1), s("div", De, [w(s("input", {
				type: "password",
				class: "form-control",
				autocomplete: "new-password",
				"onUpdate:modelValue": g[1] ||= (e) => f(r) ? r.value = e : null,
				disabled: b(c)
			}, null, 8, Oe), [[x, b(r)]])])]),
			s("div", ke, [g[9] ||= s("label", { class: "col-sm-3 col-form-label" }, "Confirm password", -1), s("div", Ae, [w(s("input", {
				type: "password",
				class: p(["form-control", { "is-invalid": b(i) && !b(u) }]),
				autocomplete: "new-password",
				"onUpdate:modelValue": g[2] ||= (e) => f(i) ? i.value = e : null,
				disabled: b(c)
			}, null, 10, je), [[x, b(i)]]), g[8] ||= s("div", { class: "invalid-feedback" }, "Passwords don't match.", -1)])]),
			s("div", Me, [s("div", Ne, [s("button", {
				type: "submit",
				class: "btn btn-primary",
				disabled: b(c) || !b(d)
			}, "Change password", 8, Pe)])])
		], 32));
	}
}), Fe = {
	key: 0,
	class: "mb-3"
}, Ie = {
	key: 1,
	class: "mb-3"
}, Le = { class: "bg-success border rounded text-light p-2" }, Re = ["value"], ze = { class: "row mb-3" }, Be = { class: "col-sm-9" }, Ve = ["disabled"], He = { class: "row mb-3" }, Ue = { class: "col-sm-9" }, We = ["disabled"], Ge = { class: "row" }, Ke = { class: "col-sm-9 offset-sm-3" }, qe = ["disabled"], Je = /* @__PURE__ */ u({
	__name: "ResetPasswordForm",
	props: {
		token: {},
		username: {}
	},
	emits: [
		"success",
		"fail",
		"login"
	],
	setup(e, { emit: t }) {
		let n = t, { password: r, confirmPassword: i, isLoading: l, isSuccess: u, passwordsMatch: d, isFormValid: m, handleSubmit: g } = Y(e, n);
		return (t, _) => (h(), o("form", {
			class: "rg-reset-password-form",
			onSubmit: _[3] ||= T((...e) => b(g) && b(g)(...e), ["prevent"])
		}, [
			b(u) === !1 ? (h(), o("div", Fe, [..._[4] ||= [s("div", { class: "bg-danger border rounded text-light p-2" }, "Unfortunately, resetting the password failed.", -1)]])) : a("", !0),
			b(u) ? (h(), o("div", Ie, [s("div", Le, [_[5] ||= c(" Password reset. ", -1), s("button", {
				type: "button",
				class: "btn btn-link p-0 align-baseline",
				onClick: _[0] ||= (e) => n("login")
			}, "Sign in")])])) : a("", !0),
			s("input", {
				type: "text",
				class: "visually-hidden",
				name: "username",
				autocomplete: "username",
				value: e.username,
				readonly: "",
				tabindex: "-1",
				"aria-hidden": "true"
			}, null, 8, Re),
			s("div", ze, [_[6] ||= s("label", { class: "col-sm-3 col-form-label" }, "New password", -1), s("div", Be, [w(s("input", {
				type: "password",
				class: "form-control",
				autocomplete: "new-password",
				"onUpdate:modelValue": _[1] ||= (e) => f(r) ? r.value = e : null,
				disabled: b(l)
			}, null, 8, Ve), [[x, b(r)]])])]),
			s("div", He, [_[8] ||= s("label", { class: "col-sm-3 col-form-label" }, "Confirm password", -1), s("div", Ue, [w(s("input", {
				type: "password",
				class: p(["form-control", { "is-invalid": b(i) && !b(d) }]),
				autocomplete: "new-password",
				"onUpdate:modelValue": _[2] ||= (e) => f(i) ? i.value = e : null,
				disabled: b(l)
			}, null, 10, We), [[x, b(i)]]), _[7] ||= s("div", { class: "invalid-feedback" }, "Passwords don't match.", -1)])]),
			s("div", Ge, [s("div", Ke, [s("button", {
				type: "submit",
				class: "btn btn-primary",
				disabled: b(l) || !b(m)
			}, "Reset password", 8, qe)])])
		], 32));
	}
});
//#endregion
export { A as AuthService, $ as ChangePasswordForm, N as CookieTokenManager, ye as ForgotPasswordModal, te as LocalStorageTokenManager, Q as LoginForm, ve as LoginModal, _e as LogoutForm, ee as MemoryTokenManager, Je as ResetPasswordForm, V as createStore, ne as getAccountName, G as plugin, j as routeGuard, I as useAuth, H as useAuthStore, J as useChangePasswordForm, q as useForgotPasswordForm, z as useGlobalAuth, K as useLoginForm, Y as useResetPasswordForm };
