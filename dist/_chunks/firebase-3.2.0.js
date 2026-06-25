import { trimRight as e } from "../utilities/string-utility.js";
import t from "axios";
//#region src/firebase/communicator.ts
var n = class extends Error {
	code;
	constructor(e, t) {
		super(`${e} (${t})`), this.code = t;
	}
}, r = (e) => {
	let t = e.status;
	if (t < 200 || t >= 400) {
		let r = e.data && e.data.error ? e.data.error.message : e.statusText;
		throw console.error("Firebase Error", t, {
			message: r,
			response: e
		}), new n(r, t);
	}
}, i = async (e, n, i) => {
	let a = {
		url: e,
		method: n
	};
	i !== void 0 && (a.data = i);
	let o = await t(a);
	return r(o), o.data;
}, a = {
	get: (e) => i(e, "get"),
	put: (e, t) => i(e, "put", t),
	post: (e, t) => i(e, "post", t),
	delete: (e) => i(e, "delete")
};
//#endregion
//#region src/firebase/entity-utility.ts
function o(t, n, r) {
	return `${e(t, "/")}/${n}/${r}.json`;
}
function s(t, n) {
	return `${e(t, "/")}/${n}.json`;
}
async function c(e, t, n) {
	let r = n ? o(e, t, n) : s(e, t);
	return a.get(r);
}
async function l(e, t) {
	let n = s(e, t), r = await a.get(n), i = Object.entries(r).map((e) => ({
		...e[1],
		id: e[0]
	}));
	return i.sort((e, t) => e.sortOrder - t.sortOrder), i;
}
async function u(e, t, n) {
	let r = !n.id, i = r ? s(e, t) : o(e, t, n.id);
	return a[r ? "post" : "put"](i, n);
}
async function d(e, t, n) {
	let r = o(e, t, n.id);
	return a.delete(r);
}
async function f(e, t, n) {
	return [...n].map(async (n, r) => (n.sortOrder = r, await u(e, t, n)));
}
//#endregion
//#region src/firebase/entity-service.ts
var p = class {
	apiUrl;
	catalogName;
	constructor({ catalogName: e, apiUrl: t }) {
		this.apiUrl = t, this.catalogName = e;
	}
	async details(e) {
		return c(this.apiUrl, this.catalogName, e);
	}
	async list() {
		return l(this.apiUrl, this.catalogName);
	}
	async save(e) {
		return u(this.apiUrl, this.catalogName, e);
	}
	async delete(e) {
		return d(this.apiUrl, this.catalogName, e);
	}
	async import(e) {
		return f(this.apiUrl, this.catalogName, e);
	}
}, m = {
	REFRESH_TOKEN: "https://securetoken.googleapis.com/v1",
	IDENTITY_TOOLKIT: "https://identitytoolkit.googleapis.com/v1/accounts:"
};
function h(e, t, n) {
	return `${e}/${n}/?key=${t}`;
}
async function g(e, t, n) {
	let r = h(m.IDENTITY_TOOLKIT, e, "accounts:verifyPassword"), i = {
		email: t,
		password: n,
		returnSecureToken: !0
	}, { idToken: o, refreshToken: s, expiresIn: c, localId: l } = await a.post(r, i);
	return {
		idToken: o,
		refreshToken: s,
		expiresIn: c,
		userId: l
	};
}
async function _(e, t) {
	let n = h(m.REFRESH_TOKEN, e, "token"), r = {
		grant_type: "refresh_token",
		refresh_token: t
	}, { id_token: i, refresh_token: o, expires_in: s, user_id: c } = await a.post(n, r);
	return {
		idToken: i,
		refreshToken: o,
		expiresIn: s,
		userId: c
	};
}
async function v(e, t) {
	let n = h(m.IDENTITY_TOOLKIT, e, "accounts:sendOobCode"), r = {
		email: t,
		requestType: "PASSWORD_RESET"
	};
	return await a.post(n, r), !0;
}
//#endregion
//#region src/firebase/authentication-service.ts
var y = class {
	apiKey;
	constructor(e) {
		this.apiKey = typeof e == "string" ? e : e.apiKey;
	}
	async login(e, t) {
		return g(this.apiKey, e, t);
	}
	async refresh(e) {
		return _(this.apiKey, e);
	}
	async resetPassword(e) {
		return v(this.apiKey, e);
	}
}, b = {
	EntityService: p,
	AuthenticationService: y
};
//#endregion
export { y as n, p as r, b as t };
