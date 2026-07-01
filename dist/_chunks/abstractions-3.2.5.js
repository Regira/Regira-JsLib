import { C as e, g as t, w as n } from "./array-utility-3.2.5.js";
import { t as r } from "./query-3.2.5.js";
import { AxiosError as i } from "axios";
//#region src/vue/entities/abstractions/IConfig.ts
var a = /* @__PURE__ */ function(e) {
	return e.dashboard = "Dashboard", e.navbar = "Navbar", e;
}({}), o = 10, s = class {
	page = 1;
	pageSize = 10;
	constructor(e = 10, t = 1) {
		this.pageSize = e, this.page = t;
	}
}, c = class {
	sortBy = "";
};
//#endregion
//#region src/vue/entities/utilities/query.ts
function l(e, t) {
	return Object.fromEntries(Object.entries(e).filter(([e, t]) => t != null && e[0] != "$" && (e !== "page" || t > 1)));
}
function u(e) {
	let { page: t, pageSize: n, ...r } = e;
	return {
		searchObject: r,
		pagingInfo: {
			page: parseInt(t) || 1,
			pageSize: parseInt(n)
		}
	};
}
//#endregion
//#region src/vue/entities/abstractions/EntityServiceBase.ts
var d = class {
	axios;
	config;
	defaultPageSize = 10;
	constructor(e, t) {
		if (this.axios = e, this.config = t, e == null) throw Error(`EntityServiceBase ("${t?.key ?? "unknown entity"}") was constructed without an axios instance. Register the shared axios in the IoC container so services can resolve it: app.use(servicesPlugin, { configure: (sp) => sp.add("axios", () => initAxios({ api })) }).`);
		t.detailsUrl ??= t.api, t.listUrl ??= t.api, t.searchUrl ??= t.api, t.saveUrl ??= t.api, t.deleteUrl ??= t.api, this.defaultPageSize = t.defaultPageSize ?? 10;
	}
	requireUrl(e, t) {
		if (e == null || e === "") throw Error(`EntityServiceBase ("${this.config.key ?? "unknown entity"}"): config.${t} could not be resolved (config.api is also unset). Set config.api so the request URL can be built.`);
		return e;
	}
	async details(e) {
		let t = await this.axios.get(`${this.requireUrl(this.config.detailsUrl, "detailsUrl")}/${e}`);
		if (t?.status == 200) {
			let { data: { item: e } } = t;
			return this.processItem(e);
		}
		throw t;
	}
	async list(e) {
		let { items: t } = await this.fetchItems(this.requireUrl(this.config.listUrl, "listUrl"), e);
		return t.map((e) => this.processItem(e));
	}
	async search(e) {
		let { items: t, count: n } = await this.fetchItems(this.requireUrl(this.config.searchUrl, "searchUrl"), e);
		return {
			items: t.map((e) => this.processItem(e)),
			count: n
		};
	}
	async searchUnion(e, t) {
		let n = r(l({
			...this.config.baseQueryParams || {},
			...t || {}
		}, this.defaultPageSize)), i = `${this.requireUrl(this.config.searchUrl, "searchUrl")}?${n}`, { data: a } = await this.axios.post(i, e).then((e) => e);
		return a;
	}
	async save(e) {
		let t = e.$id == null || e.$id === "new", n = t ? await this.insert(e) : await this.update(e);
		return {
			saved: this.processItem(n),
			isNew: t
		};
	}
	async remove(e) {
		let t = this.prepareItem(e), n = `${this.requireUrl(this.config.deleteUrl, "deleteUrl")}/${t.$id}`;
		await this.axios.delete(n).then((e) => e.data);
	}
	async update(e) {
		let t = `${this.requireUrl(this.config.saveUrl, "saveUrl")}/${e.$id}`, n = this.prepareItem(e);
		console.debug("update", {
			item: e,
			prepared: n
		});
		let r = await this.axios.put(t, n);
		if (r instanceof i) throw r;
		let { item: a } = await r.data;
		return this.processItem(a);
	}
	async insert(e) {
		let t = this.requireUrl(this.config.saveUrl, "saveUrl"), n = this.prepareItem(e), r = await this.axios.post(t, n);
		if (r instanceof i) throw r;
		let { item: a } = r.data;
		return "id" in a && Object.defineProperty(e, "id", {
			value: a.id,
			writable: !0,
			configurable: !0,
			enumerable: !0
		}), this.processItem(a);
	}
	async fetchItems(e, t) {
		let n = {
			...this.config.baseQueryParams || {},
			...t || {}
		};
		!n.pageSize && n.pageSize !== 0 && (n.pageSize = this.defaultPageSize), (!("isArchived" in n) || n.isArchived == null) && (n.isArchived = !1);
		let i = `${e}?${r(l(n, this.defaultPageSize))}`, { data: a } = await this.axios.get(i).then((e) => e);
		return a;
	}
	processItem(e) {
		if (e == null) return null;
		let t = this.toEntity(e);
		if ("created" in e) {
			let e = t;
			e.created != null && (t.created = new Date(Date.parse(e.created)));
		}
		if ("lastModified" in e) {
			let e = t;
			e.lastModified != null && (t.lastModified = new Date(Date.parse(e.lastModified)));
		}
		return t;
	}
	prepareItem(e) {
		return Object.keys(e).forEach((t) => {
			t[0] == "_" && delete e[t];
		}), e;
	}
	createInstance(e) {
		return new e();
	}
	async newEntity(e) {
		return this.toEntity(e || {});
	}
}, f = /* @__PURE__ */ new Map(), p = class extends d {
	key;
	constructor(e, t, n) {
		super(e, t), this.key = n;
	}
	get cachedItems() {
		return f.get(this.key) || null;
	}
	set cachedItems(e) {
		f.set(this.key, e);
	}
	async fetchJSONItems() {
		return this.cachedItems ??= await super.list(), this.cachedItems;
	}
	async details(e) {
		let t = (await this.list({ pageSize: 0 })).find((t) => t.$id == e) || null;
		return t == null ? null : this.toEntity(t);
	}
	async list(t) {
		let r = this.processSearchObject(t), i = n(await this.fetchJSONItems(), r), a = t?.pageSize === void 0 ? this.config.defaultPageSize : t.pageSize;
		return a ? e(i, a, Math.max(t?.page || 0, 1) - 1) : i;
	}
	async search(e) {
		let t = this.processSearchObject(e), r = n(await this.fetchJSONItems(), t).length;
		return {
			items: await this.list(e),
			count: r
		};
	}
	async save(e) {
		let n = this.processItem(e), r = n.$id == null || n.$id == "new", i = await this.fetchJSONItems();
		if (r) {
			let e = (t(i, (e) => parseInt(e.$id.toString())) ?? 0) + 1;
			Object.defineProperty(n, "id", {
				value: e,
				enumerable: !0,
				writable: !0,
				configurable: !0
			}), this.cachedItems.push(n);
		} else {
			let e = i.findIndex((e) => e.$id == n.$id);
			i.splice(e, 1, n);
		}
		return {
			saved: this.toEntity(n),
			isNew: r
		};
	}
	async remove(e) {
		let t = this.cachedItems.findIndex((t) => t.$id == e.$id);
		t !== -1 && this.cachedItems.splice(t, 1);
	}
	processSearchObject(e) {
		let { pageSize: t = 0, page: n = 0, q: r = "", ...i } = {
			...e || {},
			"*$title*": e?.q || null
		};
		return Object.fromEntries(Object.entries(i).filter(([, e]) => e != null));
	}
}, m = class {
	constructor() {}
};
Object.defineProperty(m.prototype, "entityType", {
	get() {
		return this.constructor.name;
	},
	configurable: !0,
	enumerable: !0
});
//#endregion
//#region src/vue/entities/abstractions/SearchObjectBase.ts
var h = class {
	q;
}, g = class extends h {};
//#endregion
export { d as a, c, a as d, p as i, o as l, h as n, l as o, m as r, u as s, g as t, s as u };
