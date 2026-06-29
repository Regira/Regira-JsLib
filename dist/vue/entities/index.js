import "../../_chunks/ui-3.2.3.js";
import { C as e, S as t, g as n, w as r } from "../../_chunks/array-utility-3.2.3.js";
import { debounceToPromise as i } from "../../utilities/promise-utility.js";
import { t as a } from "../../_chunks/treelist-3.2.3.js";
import { t as o } from "../../_chunks/query-3.2.3.js";
import { i as s } from "../../_chunks/feedback-3.2.3.js";
import { n as c, t as l } from "../../_chunks/details-3.2.3.js";
import { a as u, c as d, i as f, l as p, n as m, o as h, r as g, s as _, t as ee } from "../../_chunks/form-3.2.3.js";
import { i as te } from "../../_chunks/ioc-3.2.3.js";
import { AxiosError as v } from "axios";
import { computed as y, onMounted as ne, ref as b, toRaw as x, watch as re } from "vue";
import { useRouter as S } from "vue-router";
//#region src/vue/entities/abstractions/IConfig.ts
var C = /* @__PURE__ */ function(e) {
	return e.dashboard = "Dashboard", e.navbar = "Navbar", e;
}({}), w = 10, T = class {
	page = 1;
	pageSize = 10;
	constructor(e = 10, t = 1) {
		this.pageSize = e, this.page = t;
	}
}, ie = class {
	sortBy = "";
};
//#endregion
//#region src/vue/entities/utilities/query.ts
function E(e, t) {
	return Object.fromEntries(Object.entries(e).filter(([e, t]) => t != null && e[0] != "$" && (e !== "page" || t > 1)));
}
function D(e) {
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
var O = class {
	axios;
	config;
	defaultPageSize = 10;
	constructor(e, t) {
		if (this.axios = e, this.config = t, e == null) throw Error(`EntityServiceBase ("${t?.key ?? "unknown entity"}") was constructed without an axios instance. Register the shared axios in the IoC container so services can resolve it: app.use(servicesPlugin, { configure: (sp) => sp.add("axios", () => initAxios({ api })) }).`);
		this.defaultPageSize = t.defaultPageSize ?? 10, t.api != null && (t.detailsUrl ??= t.api, t.listUrl ??= t.api, t.saveUrl ??= t.api, t.deleteUrl ??= t.api, t.searchUrl ??= t.isComplex ? `${t.api}/search` : t.api);
	}
	async details(e) {
		let t = await this.axios.get(`${this.config.detailsUrl}/${e}`);
		if (t?.status == 200) {
			let { data: { item: e } } = t;
			return this.processItem(e);
		}
		throw t;
	}
	async list(e) {
		let { items: t } = await this.fetchItems(this.config.listUrl, e);
		return t.map((e) => this.processItem(e));
	}
	async search(e) {
		let { items: t, count: n } = await this.fetchItems(this.config.searchUrl, e);
		return {
			items: t.map((e) => this.processItem(e)),
			count: n
		};
	}
	async searchUnion(e, t) {
		let n = o(E({
			...this.config.baseQueryParams || {},
			...t || {}
		}, this.defaultPageSize)), r = `${this.config.searchUrl}?${n}`, { data: i } = await this.axios.post(r, e).then((e) => e);
		return i;
	}
	async save(e) {
		let t = e.$id == null || e.$id === "new", n = t ? await this.insert(e) : await this.update(e);
		return {
			saved: this.processItem(n),
			isNew: t
		};
	}
	async remove(e) {
		let t = this.prepareItem(e), n = `${this.config.deleteUrl}/${t.$id}`;
		await this.axios.delete(n).then((e) => e.data);
	}
	async update(e) {
		let t = `${this.config.saveUrl}/${e.$id}`, n = this.prepareItem(e);
		console.debug("update", {
			item: e,
			prepared: n
		});
		let r = await this.axios.put(t, n);
		if (r instanceof v) throw r;
		let { item: i } = await r.data;
		return this.processItem(i);
	}
	async insert(e) {
		let t = `${this.config.saveUrl}`, n = this.prepareItem(e), r = n.id;
		(r == null || r === 0 || r === "new") && delete n.id;
		let i = await this.axios.post(t, n);
		if (i instanceof v) throw i;
		let { item: a } = i.data;
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
		let r = `${e}?${o(E(n, this.defaultPageSize))}`, { data: i } = await this.axios.get(r).then((e) => e);
		return i;
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
}, k = /* @__PURE__ */ new Map(), A = class extends O {
	key;
	constructor(e, t, n) {
		super(e, t), this.key = n;
	}
	get cachedItems() {
		return k.get(this.key) || null;
	}
	set cachedItems(e) {
		k.set(this.key, e);
	}
	async fetchJSONItems() {
		return this.cachedItems ??= await super.list(), this.cachedItems;
	}
	async details(e) {
		let t = (await this.list({ pageSize: 0 })).find((t) => t.$id == e) || null;
		return t == null ? null : this.toEntity(t);
	}
	async list(t) {
		let n = this.processSearchObject(t), i = r(await this.fetchJSONItems(), n), a = t?.pageSize === void 0 ? this.config.defaultPageSize : t.pageSize;
		return a ? e(i, a, Math.max(t?.page || 0, 1) - 1) : i;
	}
	async search(e) {
		let t = this.processSearchObject(e), n = r(await this.fetchJSONItems(), t).length;
		return {
			items: await this.list(e),
			count: n
		};
	}
	async save(e) {
		let t = this.processItem(e), r = t.$id == null || t.$id == "new", i = await this.fetchJSONItems();
		if (r) {
			let e = (n(i, (e) => parseInt(e.$id.toString())) ?? 0) + 1;
			Object.defineProperty(t, "id", {
				value: e,
				enumerable: !0,
				writable: !0,
				configurable: !0
			}), this.cachedItems.push(t);
		} else {
			let e = i.findIndex((e) => e.$id == t.$id);
			i.splice(e, 1, t);
		}
		return {
			saved: this.toEntity(t),
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
}, j = class {
	constructor() {}
};
Object.defineProperty(j.prototype, "entityType", {
	get() {
		return this.constructor.name;
	},
	configurable: !0,
	enumerable: !0
});
//#endregion
//#region src/vue/entities/abstractions/SearchObjectBase.ts
var M = class {
	q;
}, N = class extends M {}, ae = class {
	Entity;
	serviceBuilder;
	config;
	Overview;
	Details;
	Form;
	Fiche;
	constructor(e, t, n, { Overview: r, Details: i, Form: a, Fiche: o }) {
		this.Entity = e, this.serviceBuilder = t, this.config = n, this.Overview = r, this.Details = i, this.Form = a, this.Fiche = o;
	}
	get key() {
		return this.Entity.name;
	}
}, P = /* @__PURE__ */ new Map(), oe = Symbol();
function se(e = oe) {
	let t = P.has(e) ? P.get(e) : P.set(e, /* @__PURE__ */ new Map()).get(e);
	function n(e, n, r) {
		t.set(e.key, {
			config: e,
			store: n,
			components: r
		});
	}
	function r(e) {
		return t.get(e);
	}
	return {
		describers: t,
		get types() {
			return [...t.keys()];
		},
		addType: n,
		getDesc: r
	};
}
//#endregion
//#region src/vue/entities/filter/filter.ts
function ce({ searchObject: e, emit: t, Constructor: n }) {
	let r = () => {
		t("update:modelValue", { ...e.value });
	}, i = () => {
		t("filter", e.value);
	};
	return {
		filterIsActive: y(() => {
			let t = n ? new n() : new N(), r = Object.keys(t), i = Object.entries(e.value || {}).filter(([, e]) => e != null).map(([e]) => e);
			return r.some((e) => i.some((t) => e == t));
		}),
		handleToggle: () => t("toggle-adv"),
		handleFilter: i,
		handleUpdate: () => {
			r(), i();
		},
		handleReset: () => {
			t("update:modelValue", Object.fromEntries(Object.entries({ ...e.value }).map(([e, t]) => [e, void 0]))), i();
		}
	};
}
//#endregion
//#region src/vue/entities/navigation/NavItem.ts
var F = class {
	id;
	name;
	icon;
	routeName;
	title;
	description;
	initialQuery;
	parentId;
}, I = class {
	id;
	title;
	parentId;
	icon;
};
//#endregion
//#region src/vue/entities/navigation/functions.ts
function L(e) {
	return Object.assign(new I(), e);
}
function R(e, t) {
	return Object.assign(new F(), {
		id: e.key,
		parentId: t,
		icon: e.key ?? e.name,
		routeName: `${e.key ?? e.name}Overview`,
		title: e.overviewTitle,
		description: e.description,
		initialQuery: e.initialQuery ?? {}
	});
}
function z(e) {
	function t(t) {
		return e.configs.find((e) => e.key == t);
	}
	let n = e.entities.flatMap(([n, r]) => r.map((e) => t(e)).filter((t) => e.hasAccess(t)).map((e) => R(e, n)));
	return e.groups.filter((e) => n.some((t) => t.parentId == e.id)).map((e) => L(e)).concat(n);
}
function B(e) {
	function t(t) {
		return e.configs.find((e) => e.key == t);
	}
	let n = e.groups?.map(L);
	return e.entities.flatMap((r) => {
		if (r.length == 2 && Array.isArray(r[1])) {
			let i = n.find((e) => e.id == r[0]);
			return [i, ...r[1].map((e) => t(e)).filter((t) => e.hasAccess(t)).map((e) => R(e, i.id))];
		}
		let i = t(r);
		return e.hasAccess(i) ? [R(i)] : [];
	});
}
function V(e) {
	return new a().init(e, (e, t) => t.filter((t) => t.id == e.parentId));
}
function H(e) {
	return e instanceof F;
}
//#endregion
//#region src/vue/entities/overview/overview-core.ts
function U({ service: e, searchObject: t, defaultPageSize: n = 10 }) {
	let r = b(t), i = b(new T(n || 10)), a = b(), o = b(), c = b(!1), l = s();
	async function u(t) {
		c.value = !0;
		try {
			l.reset();
			let { saved: n, isNew: r } = await e.save(t);
			return l.success(`Saved ${t.$title}`), {
				saved: n,
				isNew: r
			};
		} catch (e) {
			console.error("saving failed", {
				ex: e,
				item: t
			});
			let n = e;
			l.fail(`Saving ${t.$title} failed`, n.response?.data?.errors);
		} finally {
			c.value = !1;
		}
		return null;
	}
	async function d(t) {
		c.value = !0;
		try {
			l.reset(), await e.remove(t);
		} catch (e) {
			console.error("removing failed", {
				ex: e,
				item: t
			});
			let n = e;
			l.fail(`Removing ${t.$title} failed`, n.response?.data?.errors);
		} finally {
			c.value = !1;
		}
	}
	function f({ saved: e, isNew: t }) {
		if (o.value != null) if (t) o.value.push(e);
		else {
			let t = o.value.findIndex((t) => t.$id === e.$id);
			t !== -1 && o.value.splice(t, 1, e);
		}
	}
	function p(e) {
		if (o.value == null) return;
		let t = o.value.findIndex((t) => t.$id === e.$id);
		t !== -1 && o.value.splice(t, 1);
	}
	function m() {
		i.value = {
			...i?.value,
			page: 1
		};
	}
	return {
		searchObject: r,
		pagingInfo: i,
		items: o,
		itemsCount: a,
		isLoading: c,
		feedback: l,
		applySave: u,
		applyRemove: d,
		handleSave: f,
		handleRemove: p,
		resetPage: m
	};
}
//#endregion
//#region src/vue/entities/overview/search-view.ts
function W({ service: e, searchObject: t, defaultPageSize: n = 10, debounceDelay: r = 250 }) {
	let { searchObject: a, pagingInfo: o, items: s, itemsCount: c, isLoading: l, feedback: u, applySave: d, applyRemove: f, handleSave: p, handleRemove: m, resetPage: h } = U({
		service: e,
		searchObject: t,
		defaultPageSize: n
	});
	async function g(t = !1) {
		l.value = !0;
		try {
			u.reset();
			let n = {
				...a.value || {},
				...o.value || {}
			};
			t && (n.page = 1);
			let { items: r, count: i } = await e.search(n);
			s.value = r, c.value = i;
		} catch (e) {
			console.error("fetching failed", { ex: e });
			let t = e;
			u.fail("fetching data failed", t.response?.data?.errors);
		} finally {
			l.value = !1;
		}
	}
	return {
		searchObject: a,
		pagingInfo: o,
		items: s,
		itemsCount: c,
		isLoading: l,
		feedback: u,
		applySave: d,
		applyRemove: f,
		handleSave: p,
		handleRemove: m,
		resetPage: h,
		searchHandler: g,
		debouncedSearchHandler: i(g, r)
	};
}
//#endregion
//#region src/vue/entities/overview/list-view.ts
function le({ service: e, searchObject: t, defaultPageSize: n = 10, debounceDelay: r = 250 }) {
	let { searchObject: a, pagingInfo: o, items: s, itemsCount: c, isLoading: l, feedback: u, applySave: d, applyRemove: f, handleSave: p, handleRemove: m, resetPage: h } = U({
		service: e,
		searchObject: t,
		defaultPageSize: n
	});
	async function g() {
		l.value = !0;
		try {
			u.reset(), s.value = await e.list({
				...t.value || {},
				...o.value || {}
			}), c.value = s.value.length;
		} catch (e) {
			console.error("fetching failed", { ex: e });
			let t = e;
			u.fail("fetching data failed", t.response?.data?.errors);
		} finally {
			l.value = !1;
		}
	}
	return {
		searchObject: a,
		pagingInfo: o,
		items: s,
		itemsCount: c,
		isLoading: l,
		feedback: u,
		applySave: d,
		applyRemove: f,
		handleSave: p,
		handleRemove: m,
		resetPage: h,
		listHandler: g,
		debouncedListHandler: i(g, r)
	};
}
//#endregion
//#region src/vue/entities/overview/route-overview.ts
function ue({ pagingInfo: e, searchObject: t, defaultPageSize: n = 10, handler: r }) {
	let i = S();
	function a(r = !1) {
		r && e != null && (e.value = {
			...e?.value,
			page: 1
		});
		let a = i.currentRoute.value, o = E({
			...a.query,
			...t.value,
			...e.value ?? {}
		}, n), s = {
			...a,
			query: o
		};
		i.push(s);
	}
	async function o() {
		let { searchObject: a, pagingInfo: o } = D(i.currentRoute.value.query);
		o.page ||= 1, (isNaN(o.pageSize) || o.pageSize == null) && n > 0 && (o.pageSize = n), t.value != null && (t.value = a), e.value != null && (e.value = o), await r();
	}
	let s = re(i.currentRoute, async (e, t) => {
		e.name === t.name && await o();
	});
	return ne(o), {
		updateOverviewRoute: a,
		routeSearchHandler: o,
		routeWatcher: s
	};
}
//#endregion
//#region src/vue/entities/pooling/PoolService.ts
var G = class {
	service;
	cache;
	type;
	constructor(e, t, n) {
		this.service = e, this.cache = t, this.type = n;
	}
	async details(e) {
		let t = await this.service.details(e);
		return t == null ? null : (this.cache.set(this.toEntity({ ...t })), this.toEntity({ ...t }));
	}
	async list(e) {
		let t = await this.service.list(e);
		return t.forEach((e) => this.cache.set(this.toEntity({ ...e }))), t;
	}
	async search(e) {
		let { items: t, count: n } = await this.service.search(e);
		return t.forEach((e) => this.cache.set(this.toEntity({ ...e }))), {
			items: t,
			count: n
		};
	}
	async searchUnion(e, t) {
		let { items: n, count: r } = await this.service.searchUnion(e, t);
		return n.forEach((e) => this.cache.set(this.toEntity({ ...e }))), {
			items: n,
			count: r
		};
	}
	async save(e) {
		let { saved: t, isNew: n } = await this.service.save(e);
		return this.cache.set(this.toEntity({ ...t })), {
			saved: t,
			isNew: n
		};
	}
	async remove(e) {
		await this.service.remove(e), this.cache.remove(e);
	}
	get(e) {
		let t = this.toEntity(e);
		return this.cache.get(this.type, t.$id) || this.cache.set(t);
	}
	getMany(e) {
		return e.map((e) => this.get(e)).filter((e) => e != null);
	}
	set(e) {
		return e = this.toEntity(e), this.cache.set(e);
	}
	setMany(e) {
		return e.map((e) => this.set(e));
	}
	toEntity(e) {
		return this.service.toEntity(e);
	}
	newEntity(e) {
		return this.service.newEntity(e);
	}
}, K = {
	INTERVAL: 60,
	EXPIRES: 600,
	MAX_ITEMS: 1e3
}, q = class {
	_cache = /* @__PURE__ */ new Map();
	_expires;
	_maxItems;
	persistentTypes = [];
	constructor({ interval: e = K.INTERVAL, expires: t = K.EXPIRES, maxItems: n = K.MAX_ITEMS } = {}) {
		e > 0 && setInterval(() => this.cleanup(), e * 1e3), this._expires = t, this._maxItems = n;
	}
	set(e) {
		let t = this.getEntityMap(e.constructor.name), n = this.get(e.constructor.name, e.$id);
		return n == null ? n = b(e) : n.value = e, n.timestamp = +/* @__PURE__ */ new Date(), t.set(e.$id, n), n;
	}
	get(e, t) {
		return this.getEntityMap(e).get(t);
	}
	remove(e) {
		return this.getEntityMap(e.constructor.name).delete(e.$id);
	}
	hasType(e) {
		return this._cache.has(e);
	}
	getAll(e) {
		return e == null ? [...this._cache].flatMap(([, e]) => [...e].map(([, e]) => e)) : [...this.getEntityMap(e)].map(([, e]) => e);
	}
	findReferences(e) {
		return this.getAll().filter((t) => {
			function n(t) {
				return Array.isArray(t) ? t.some((e) => n(e)) : t instanceof j ? t?.constructor?.name === e.constructor.name ? t.$id === e.$id : n(Object.entries(t).map(([, e]) => e).filter((e) => e instanceof j || Array.isArray(e) && e.some((e) => e instanceof j))) : !1;
			}
			return n(t.value);
		});
	}
	getEntityMap(e) {
		return this._cache.has(e) || this._cache.set(e, /* @__PURE__ */ new Map()), this._cache.get(e);
	}
	cleanup() {
		if (this._expires > 0) {
			let e = /* @__PURE__ */ new Date() - this._expires * 1e3;
			for (let [t, n] of this._cache) if (!this.persistentTypes.includes(t)) for (let [r, i] of n) i.timestamp < e && (console.debug("removing", t, r), n.delete(r));
		}
		let e = t([...this._cache].flatMap(([, e]) => [...e].map(([, e]) => e)), (e) => e.timestamp);
		e.length > this._maxItems && e.slice(this._maxItems).forEach((e) => {
			let t = e.value.constructor.name;
			if (!this.persistentTypes.includes(t)) {
				let n = this.getEntityMap(t);
				console.debug("removing", t, e.value.$id), n.delete(e.value.$id);
			}
		});
	}
}, J = new q();
function Y(e, t, n = J, r = !1) {
	let i = e instanceof G ? e : new G(e, n, t);
	r && !n.persistentTypes.includes(t) && n.persistentTypes.push(t);
	function a(t) {
		if (t == null) return t;
		if (!Array.isArray(t)) {
			let n = e.toEntity(t);
			if ([
				"new",
				null,
				void 0,
				"",
				0
			].includes(n?.$id)) return n;
		}
		return Array.isArray(t) ? i.getMany(t || []).map((e) => e.value) : i.get(t)?.value;
	}
	return {
		service: i,
		cache: n,
		details: i.details.bind(i),
		list: i.list.bind(i),
		search: i.search.bind(i),
		searchUnion: i.searchUnion.bind(i),
		save: i.save.bind(i),
		remove: i.remove.bind(i),
		toEntity: i.toEntity.bind(i),
		newEntity: i.newEntity.bind(i),
		get: (e) => i.get(e),
		getMany: (e) => i.getMany(e),
		set: (e) => n.set(i.toEntity(e)),
		setMany: (e) => e.map((e) => n.set(i.toEntity(e))),
		fromPool: a,
		fromCache: (e) => e ? n.get(t, e) : n.getAll(t)
	};
}
//#endregion
//#region src/vue/entities/pooling/store.ts
function de(e, t) {
	return Y(e, t);
}
//#endregion
//#region src/vue/entities/preloading/preloader.ts
var X = [], Z = [];
function Q(e) {
	Z.length = 0, X.length = 0;
	for (let t of e) {
		X.push(t.name);
		let { list: e } = Y(te(t.name), t.name, void 0, !0), n = e({ pageSize: 0 });
		Z.push(n);
	}
	return $();
}
async function $() {
	return await new Promise((e) => {
		async function t() {
			if (X.length > Z.length) {
				setTimeout(t, 50);
				return;
			}
			e(await Promise.allSettled(Z));
		}
		t();
	});
}
var fe = {
	install(e) {},
	preload: Q,
	ready: $
};
function pe() {
	return {
		preload: Q,
		ready: $
	};
}
//#endregion
//#region src/vue/entities/tree/tree.ts
function me(e, t) {
	return e.$id != null && e.$id == t.$id && e.constructor == t.constructor;
}
function he(e) {
	let t = b(), n = b(), r = e?.equals || me, i = y(() => t.value?.filter((e) => n.value?.some((t) => r(e.value, t))) || []), o = y(() => i.value.flatMap((e) => e.getAncestors())), s = y(() => i.value.flatMap((e) => e.getOffspring())), c = y(() => [...new Set(i.value.flatMap((e) => e.getAncestors()).concat(i.value).concat(i.value.flatMap((e) => e.getOffspring())))]);
	function l(e, r, i) {
		n.value = e, t.value = new a().init(r.map((e) => x(e)), i), t.value.filter((e) => e.parent == null ? !1 : e.parent.getOffspring().some((t) => t != e && t.value == e.value)).forEach((e) => t.value.remove(e));
	}
	return {
		tree: t,
		nodes: i,
		ancestors: o,
		offspring: s,
		family: c,
		init: l
	};
}
function ge({ emit: e }) {
	let t = b();
	function n(n) {
		n != null && (t.value = n, e("drag", n));
	}
	function r() {
		t.value = void 0, e("dragend");
	}
	function i(n) {
		n == null || t.value == null || t.value == n || (t.value?.getOffspring())?.includes(n) || (e("drop", n), e("move", {
			child: t.value,
			parent: n
		}), t.value = void 0);
	}
	return {
		draggingNode: t,
		handleDrag: n,
		handleDragEnd: r,
		handleDrop: i
	};
}
//#endregion
export { w as DEFAULT_PAGESIZE, N as DefaultSearchObject, l as DetailsSummary, j as EntityBase, ae as EntityDescriptor, O as EntityServiceBase, _ as FormStates, A as JSONService, I as NavGroup, F as NavItem, C as NavTypes, T as PagingInfo, q as PoolCache, G as PoolService, M as SearchObjectBase, ie as SortByInfo, V as buildNavigationTree, E as cleanQueryParams, L as createNavGroup, R as createNavItem, de as createStore, J as defaultPoolCache, d as formDefaults, u as formModalDefaults, z as importDashboard, B as importNavbar, H as isNavItem, D as parseQueryParams, fe as preloaderPlugin, c as useDetails, ge as useDragDrop, se as useEntityDescribers, ce as useFilter, p as useForm, g as useListInput, f as useListItemInput, le as useListView, h as useModal, U as useOverviewCore, m as useOwnedCollection, ee as useOwnedModal, Y as usePooling, pe as usePreloader, ue as useRouteOverview, W as useSearchView, he as useTree };
