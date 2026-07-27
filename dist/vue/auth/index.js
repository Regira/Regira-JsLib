import { startsWith as e } from "../../utilities/string-utility.js";
import { t } from "../../_chunks/query-3.2.7.js";
import { n } from "../../_chunks/modal-3.2.7.js";
import { computed as r, createBlock as i, createCommentVNode as a, createElementBlock as o, createElementVNode as s, createTextVNode as c, createVNode as l, customRef as u, defineComponent as d, guardReactiveProps as f, isRef as p, normalizeClass as m, normalizeProps as h, openBlock as g, ref as _, renderSlot as v, resolveDynamicComponent as y, toDisplayString as b, unref as x, vModelText as S, watch as C, withCtx as w, withDirectives as T, withModifiers as E } from "vue";
import { defineStore as D } from "pinia";
import { useRouter as O } from "vue-router";
//#region src/vue/auth/AuthData.ts
var k = class {
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
}, A = () => new k(), j = (e, t) => !t || /[?&]clientApp=/.test(e) ? e : `${e}${e.includes("?") ? "&" : "?"}clientApp=${encodeURIComponent(t)}`, M = class {
	axios;
	tokenManager;
	options;
	constructor(e, t, n) {
		this.axios = e, this.tokenManager = t, this.options = n || {};
	}
	authenticate({ token: e, isAuthenticated: t }) {
		return t ? (this.tokenManager.token = e, new k(e, { isAuthenticated: t })) : (this.tokenManager.token = void 0, A());
	}
	async login(e, t) {
		let n = j(this.options?.loginUrl || "auth", this.options?.clientApp), r = await this.axios.post(n, {
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
		return A();
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
}, N = ({ router: e, store: t }) => {
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
}, P = "auth:token", ee = class {
	prefix;
	constructor(e = "") {
		this.prefix = e;
	}
	get token() {
		return Object.fromEntries((document.cookie || "").split(";").filter((e) => e.indexOf("=") > 1 && e.indexOf("=") < e.length - 1).map((e) => [e.substring(0, e.indexOf("=")).trim(), e.substring(e.indexOf("=") + 1).trim()]))[this.fullKey];
	}
	set token(e) {
		e == null ? document.cookie = `${this.fullKey}=;expires=${(/* @__PURE__ */ new Date(0)).toUTCString()}; path=/;` : document.cookie = `${this.fullKey}=${e}; path=/;`;
	}
	get fullKey() {
		return this.prefix + P;
	}
}, F = class {
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
}, I = class {
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
		return this.prefix + P;
	}
}, L;
function R(e) {
	let { enabled: t, tokenManager: n, axios: r, clientApp: i, loginUrl: a } = e, o = new M(r, n, {
		clientApp: i,
		loginUrl: a
	});
	return L = {
		enabled: t,
		get clientApp() {
			return o.options.clientApp;
		},
		tokenManager: n,
		service: o
	}, L;
}
var z = () => L, B;
function te(e) {
	B = e;
}
var V = () => B, ne = (e = V()) => e?.authData?.displayName ?? e?.authData?.name ?? e?.authData?.email, H = "Auth";
function U() {
	let e = _(!0), t = u((e, t) => ({
		get() {
			return e(), z()?.service?.options?.clientApp;
		},
		set(e) {
			let n = z();
			n?.service?.options && (n.service.options.clientApp = e), t();
		}
	})), n = _(A()), i = _(!1), a = O(), o = r(() => e.value && !a.currentRoute.value?.meta?.allowAnonymous), s = r(() => !!n.value.isAuthenticated), c = r(() => n.value?.displayName), l = r(() => (e) => n.value.get(e)), d = r(() => (e, t) => n.value?.hasClaim(e, t) ?? !1), f = r(() => (e) => n.value?.hasPermission(e) ?? !1);
	function p(e) {
		t.value = e;
	}
	async function m({ username: e, password: t }) {
		let { service: r } = z();
		return n.value = await r.login(e, t), n.value.isAuthenticated;
	}
	async function h(e) {
		let { service: t } = z();
		return n.value = await t.refresh(e), n.value.isAuthenticated;
	}
	async function g() {
		let { service: e } = z();
		return n.value = await e.validateToken(), n.value.isAuthenticated;
	}
	function v() {
		n.value = A();
		let { service: e } = z();
		e.logout();
	}
	return {
		enabled: e,
		clientApp: t,
		authData: n,
		authRequired: i,
		isRequired: o,
		isAuthenticated: s,
		hasPermission: f,
		displayName: c,
		hasClaim: d,
		getClaimValue: l,
		setClientApp: p,
		login: m,
		refresh: h,
		validateToken: g,
		logout: v
	};
}
U.storeName = H;
var W = D(H, U);
//#endregion
//#region src/vue/auth/auth-axios.ts
function G(e, t) {
	return e.interceptors.request.use((e) => (t.token && (e.headers.Authorization = `Bearer ${t.token}`), e)), e;
}
function K(t, n) {
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
var q = { async install(e, t) {
	let { clientApp: n, loginUrl: r, tokenManager: i, authStore: a, axios: o, enableRouteGuard: s = !0, enabled: c = !0, onAuthenticationChange: l = () => {} } = t, { $router: u } = e.config.globalProperties, d = R({
		enabled: c,
		tokenManager: i,
		axios: o,
		clientApp: n,
		loginUrl: r
	}), f = a ?? W();
	if (f.$patch({ enabled: c }), c ? (e.config.globalProperties.$auth = {
		...d,
		get clientApp() {
			return d.clientApp;
		},
		get authData() {
			return f.authData;
		},
		get isAuthenticated() {
			return !!f.authData?.isAuthenticated;
		},
		get isRequired() {
			return f.authRequired;
		}
	}, n && f.setClientApp(n)) : e.config.globalProperties.$auth = { enabled: !1 }, te(e.config.globalProperties.$auth), c) {
		G(o, i);
		let e;
		C(() => f.isAuthenticated, () => {
			f.isAuthenticated && (clearInterval(e), e = setInterval(() => f.validateToken(), f.authData.expires * 1e3)), l(f.authData);
		}), await f.validateToken(), s && N({
			router: u,
			store: f
		}), K(o, f);
	} else l({ isAuthenticated: !1 });
} };
//#endregion
//#region src/vue/auth/useLoginForm.ts
function J(e, t) {
	let n = _(e.username || ""), r = _(""), i = _(!1), a = _(!1), o = _(!1), s = W();
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
function Y(e, t, n) {
	let { service: i } = z(), a = _(!1), o = _(e.username || ""), s = r(() => o.value != ""), c = _();
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
	return C(() => e.username, () => o.value = e.username || ""), {
		username: o,
		isLoading: a,
		isFormValid: s,
		isSuccess: c,
		handleSubmit: l
	};
}
//#endregion
//#region src/vue/auth/useChangePasswordForm.ts
function X(e) {
	let { service: t } = z(), n = _(""), i = _(""), a = _(""), o = _(!1), s = _(), c = r(() => i.value === a.value), l = r(() => n.value != "" && i.value != "" && c.value);
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
function Z(e, t) {
	let { service: n } = z(), i = _(""), a = _(""), o = _(!1), s = _(), c = r(() => i.value === a.value), l = r(() => i.value != "" && c.value);
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
var re = {
	key: 0,
	class: "mb-3 position-relative"
}, ie = { class: "bg-danger border rounded text-light p-2" }, ae = { key: 0 }, oe = { class: "row mb-3" }, se = { class: "col-sm-9" }, ce = { class: "input-group" }, le = ["disabled"], ue = { class: "row mb-3" }, de = { class: "col-sm-9" }, fe = ["disabled"], pe = { class: "row" }, me = { class: "col-sm-3" }, he = ["disabled"], ge = { class: "col-sm" }, _e = {
	key: 0,
	class: "text-info"
}, Q = /* @__PURE__ */ d({
	__name: "LoginForm",
	props: { username: {} },
	emits: [
		"forgotPassword",
		"signingIn",
		"success",
		"fail"
	],
	setup(e, { emit: t }) {
		let { username: n, password: r, signingIn: i, failed: l, isLockedOut: u, handleSubmit: d, handleForgotPassword: f } = J(e, t);
		return (e, t) => (g(), o("form", {
			class: "rg-login-form",
			onSubmit: t[3] ||= E((...e) => x(d) && x(d)(...e), ["prevent"]),
			ref: "loginForm"
		}, [
			x(l) ? (g(), o("div", re, [s("div", ie, [t[4] ||= c(" Unfortunately, signing in failed. ", -1), x(u) ? (g(), o("span", ae, "Try again in 5 min.")) : a("", !0)])])) : a("", !0),
			s("div", oe, [t[5] ||= s("label", {
				for: "username",
				class: "col-sm-3 col-form-label"
			}, "Username", -1), s("div", se, [s("div", ce, [T(s("input", {
				class: "form-control",
				autocomplete: "username email",
				"onUpdate:modelValue": t[0] ||= (e) => p(n) ? n.value = e : null,
				disabled: x(i)
			}, null, 8, le), [[S, x(n)]])])])]),
			s("div", ue, [t[6] ||= s("label", {
				for: "password",
				class: "col-sm-3 col-form-label"
			}, "Password", -1), s("div", de, [T(s("input", {
				type: "password",
				class: "form-control",
				autocomplete: "password current-password",
				"onUpdate:modelValue": t[1] ||= (e) => p(r) ? r.value = e : null,
				disabled: x(i)
			}, null, 8, fe), [[S, x(r)]])])]),
			s("div", pe, [s("div", me, [s("button", {
				type: "submit",
				class: "btn btn-primary",
				disabled: x(i)
			}, "Sign in", 8, he)]), s("div", ge, [x(i) ? (g(), o("span", _e, " Signing in ... ")) : (g(), o("button", {
				key: 1,
				type: "button",
				class: "btn btn-link",
				onClick: t[2] ||= (...e) => x(f) && x(f)(...e)
			}, "Forgot password?"))])])
		], 544));
	}
}), ve = { class: "rg-logout-form" }, ye = /* @__PURE__ */ d({
	__name: "LogoutForm",
	setup(e) {
		let t = W(), n = O(), i = () => {
			t.logout();
			let e = n.currentRoute.value.fullPath;
			n.push({
				name: "login",
				query: { returnUrl: e }
			});
		}, a = r(() => t.displayName);
		return (e, t) => (g(), o("form", ve, [s("button", {
			type: "button",
			class: "btn btn-sm btn-secondary",
			onClick: i
		}, b(a.value) + " afmelden", 1)]));
	}
}), be = /* @__PURE__ */ d({
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
		return (n, r) => (g(), i(y(x(t)), {
			"is-visible": e.isVisible,
			title: e.title,
			showFooter: !1
		}, {
			default: w(() => [v(n.$slots, "default", h(f({ username: e.username })), () => [l(Q, {
				onSuccess: r[0] ||= (e) => n.$emit("success", e),
				onForgotPassword: r[1] ||= (e) => n.$emit("forgotPassword", e),
				onSigningIn: r[2] ||= (e) => n.$emit("signingIn", e),
				onFail: r[3] ||= (e) => n.$emit("fail", e)
			})])]),
			_: 3
		}, 8, ["is-visible", "title"]));
	}
}), xe = /* @__PURE__ */ d({
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
		return (n, r) => (g(), i(y(x(t)), {
			"is-visible": e.isVisible,
			title: "Forgot password",
			showFooter: !1
		}, {
			default: w(() => [v(n.$slots, "default", h(f({ username: e.username })))]),
			_: 3
		}, 8, ["is-visible"]));
	}
}), Se = {
	key: 0,
	class: "mb-3"
}, Ce = {
	key: 1,
	class: "mb-3"
}, we = ["value"], Te = { class: "row mb-3" }, Ee = { class: "col-sm-9" }, De = ["disabled"], Oe = { class: "row mb-3" }, ke = { class: "col-sm-9" }, Ae = ["disabled"], je = { class: "row mb-3" }, Me = { class: "col-sm-9" }, Ne = ["disabled"], Pe = { class: "row" }, Fe = { class: "col-sm-9 offset-sm-3" }, Ie = ["disabled"], Le = /* @__PURE__ */ d({
	__name: "ChangePasswordForm",
	props: { username: {} },
	emits: ["success", "fail"],
	setup(e, { emit: t }) {
		let { currentPassword: n, newPassword: r, confirmPassword: i, isLoading: c, isSuccess: l, passwordsMatch: u, isFormValid: d, handleSubmit: f } = X(t);
		return (t, h) => (g(), o("form", {
			class: "rg-change-password-form",
			onSubmit: h[3] ||= E((...e) => x(f) && x(f)(...e), ["prevent"])
		}, [
			x(l) === !1 ? (g(), o("div", Se, [...h[4] ||= [s("div", { class: "bg-danger border rounded text-light p-2" }, "Unfortunately, changing the password failed.", -1)]])) : a("", !0),
			x(l) ? (g(), o("div", Ce, [...h[5] ||= [s("div", { class: "bg-success border rounded text-light p-2" }, "Password changed.", -1)]])) : a("", !0),
			s("input", {
				type: "text",
				class: "visually-hidden",
				name: "username",
				autocomplete: "username",
				value: e.username,
				readonly: "",
				tabindex: "-1",
				"aria-hidden": "true"
			}, null, 8, we),
			s("div", Te, [h[6] ||= s("label", { class: "col-sm-3 col-form-label" }, "Current password", -1), s("div", Ee, [T(s("input", {
				type: "password",
				class: "form-control",
				autocomplete: "current-password",
				"onUpdate:modelValue": h[0] ||= (e) => p(n) ? n.value = e : null,
				disabled: x(c)
			}, null, 8, De), [[S, x(n)]])])]),
			s("div", Oe, [h[7] ||= s("label", { class: "col-sm-3 col-form-label" }, "New password", -1), s("div", ke, [T(s("input", {
				type: "password",
				class: "form-control",
				autocomplete: "new-password",
				"onUpdate:modelValue": h[1] ||= (e) => p(r) ? r.value = e : null,
				disabled: x(c)
			}, null, 8, Ae), [[S, x(r)]])])]),
			s("div", je, [h[9] ||= s("label", { class: "col-sm-3 col-form-label" }, "Confirm password", -1), s("div", Me, [T(s("input", {
				type: "password",
				class: m(["form-control", { "is-invalid": x(i) && !x(u) }]),
				autocomplete: "new-password",
				"onUpdate:modelValue": h[2] ||= (e) => p(i) ? i.value = e : null,
				disabled: x(c)
			}, null, 10, Ne), [[S, x(i)]]), h[8] ||= s("div", { class: "invalid-feedback" }, "Passwords don't match.", -1)])]),
			s("div", Pe, [s("div", Fe, [s("button", {
				type: "submit",
				class: "btn btn-primary",
				disabled: x(c) || !x(d)
			}, "Change password", 8, Ie)])])
		], 32));
	}
}), Re = {
	key: 0,
	class: "mb-3"
}, ze = {
	key: 1,
	class: "mb-3"
}, Be = { class: "bg-success border rounded text-light p-2" }, Ve = ["value"], $ = { class: "row mb-3" }, He = { class: "col-sm-9" }, Ue = ["disabled"], We = { class: "row mb-3" }, Ge = { class: "col-sm-9" }, Ke = ["disabled"], qe = { class: "row" }, Je = { class: "col-sm-9 offset-sm-3" }, Ye = ["disabled"], Xe = /* @__PURE__ */ d({
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
		let n = t, { password: r, confirmPassword: i, isLoading: l, isSuccess: u, passwordsMatch: d, isFormValid: f, handleSubmit: h } = Z(e, n);
		return (t, _) => (g(), o("form", {
			class: "rg-reset-password-form",
			onSubmit: _[3] ||= E((...e) => x(h) && x(h)(...e), ["prevent"])
		}, [
			x(u) === !1 ? (g(), o("div", Re, [..._[4] ||= [s("div", { class: "bg-danger border rounded text-light p-2" }, "Unfortunately, resetting the password failed.", -1)]])) : a("", !0),
			x(u) ? (g(), o("div", ze, [s("div", Be, [_[5] ||= c(" Password reset. ", -1), s("button", {
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
			}, null, 8, Ve),
			s("div", $, [_[6] ||= s("label", { class: "col-sm-3 col-form-label" }, "New password", -1), s("div", He, [T(s("input", {
				type: "password",
				class: "form-control",
				autocomplete: "new-password",
				"onUpdate:modelValue": _[1] ||= (e) => p(r) ? r.value = e : null,
				disabled: x(l)
			}, null, 8, Ue), [[S, x(r)]])])]),
			s("div", We, [_[8] ||= s("label", { class: "col-sm-3 col-form-label" }, "Confirm password", -1), s("div", Ge, [T(s("input", {
				type: "password",
				class: m(["form-control", { "is-invalid": x(i) && !x(d) }]),
				autocomplete: "new-password",
				"onUpdate:modelValue": _[2] ||= (e) => p(i) ? i.value = e : null,
				disabled: x(l)
			}, null, 10, Ke), [[S, x(i)]]), _[7] ||= s("div", { class: "invalid-feedback" }, "Passwords don't match.", -1)])]),
			s("div", qe, [s("div", Je, [s("button", {
				type: "submit",
				class: "btn btn-primary",
				disabled: x(l) || !x(f)
			}, "Reset password", 8, Ye)])])
		], 32));
	}
});
//#endregion
export { M as AuthService, Le as ChangePasswordForm, ee as CookieTokenManager, xe as ForgotPasswordModal, I as LocalStorageTokenManager, Q as LoginForm, be as LoginModal, ye as LogoutForm, F as MemoryTokenManager, Xe as ResetPasswordForm, U as createStore, ne as getAccountName, q as plugin, N as routeGuard, z as useAuth, W as useAuthStore, X as useChangePasswordForm, Y as useForgotPasswordForm, V as useGlobalAuth, J as useLoginForm, Z as useResetPasswordForm };
