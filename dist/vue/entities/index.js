import { S as e } from "../../_chunks/array-utility-3.2.5.js";
import { debounceToPromise as t } from "../../utilities/promise-utility.js";
import { t as n } from "../../_chunks/treelist-3.2.5.js";
import { a as r, c as i, d as a, i as o, l as s, n as c, o as l, r as u, s as d, t as f, u as p } from "../../_chunks/abstractions-3.2.5.js";
import { i as m } from "../../_chunks/feedback-3.2.5.js";
import { n as h, t as g } from "../../_chunks/details-3.2.5.js";
import { a as ee, c as _, i as te, l as ne, n as re, o as ie, r as ae, s as oe, t as se } from "../../_chunks/form-3.2.5.js";
import "../../_chunks/ui-3.2.5.js";
import { i as v } from "../../_chunks/ioc-3.2.5.js";
import { Fragment as ce, computed as y, createCommentVNode as le, createElementBlock as b, createElementVNode as x, defineComponent as S, onMounted as C, openBlock as w, ref as T, renderList as ue, renderSlot as E, toDisplayString as D, toRaw as de, watch as fe, withModifiers as pe } from "vue";
import { useRouter as me } from "vue-router";
//#region src/vue/entities/config/EntityDescriptor.ts
var O = class {
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
}, k = /* @__PURE__ */ new Map(), A = Symbol();
function j(e = A) {
	let t = k.has(e) ? k.get(e) : k.set(e, /* @__PURE__ */ new Map()).get(e);
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
function M({ searchObject: e, emit: t, Constructor: n }) {
	let r = () => {
		t("update:modelValue", { ...e.value });
	}, i = () => {
		t("filter", e.value);
	};
	return {
		filterIsActive: y(() => {
			let t = n ? new n() : new f(), r = Object.keys(t), i = Object.entries(e.value || {}).filter(([, e]) => e != null).map(([e]) => e);
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
//#region src/vue/entities/lean/EntityOverview.vue?vue&type=script&setup=true&lang.ts
var N = { class: "entity-overview" }, P = { class: "table" }, F = { class: "entity-paging d-flex align-items-center gap-2" }, I = ["disabled"], L = { class: "text-muted small" }, R = ["disabled"], z = /* @__PURE__ */ S({
	__name: "EntityOverview",
	props: {
		service: {},
		query: {},
		pageSize: { default: 10 }
	},
	setup(e, { expose: t }) {
		let n = e, r = T([]), i = T(0), a = T(1), o = y(() => Math.max(1, Math.ceil(i.value / n.pageSize)));
		async function s() {
			let e = await n.service.search({
				...n.query,
				page: a.value,
				pageSize: n.pageSize
			});
			r.value = e.items, i.value = e.count;
		}
		async function c(e) {
			a.value = Math.min(Math.max(1, e), o.value), await s();
		}
		async function l(e) {
			await n.service.remove(e), await s();
		}
		return C(s), t({
			reload: s,
			setPage: c
		}), (e, t) => (w(), b("div", N, [
			E(e.$slots, "toolbar", {
				reload: s,
				setPage: c
			}),
			x("table", P, [x("thead", null, [E(e.$slots, "head")]), x("tbody", null, [(w(!0), b(ce, null, ue(r.value, (t) => (w(), b("tr", { key: t.$id }, [E(e.$slots, "row", {
				item: t,
				remove: l,
				reload: s
			}, () => [x("td", null, D(t.$title), 1)])]))), 128))])]),
			x("div", F, [E(e.$slots, "paging", {
				page: a.value,
				pageCount: o.value,
				count: i.value,
				setPage: c
			}, () => [
				x("button", {
					type: "button",
					class: "btn btn-sm btn-outline-secondary",
					disabled: a.value <= 1,
					onClick: t[0] ||= (e) => c(a.value - 1)
				}, "Previous", 8, I),
				x("span", L, "Page " + D(a.value) + " / " + D(o.value) + " · " + D(i.value), 1),
				x("button", {
					type: "button",
					class: "btn btn-sm btn-outline-secondary",
					disabled: a.value >= o.value,
					onClick: t[1] ||= (e) => c(a.value + 1)
				}, "Next", 8, R)
			])])
		]));
	}
}), he = { class: "mt-3" }, ge = ["disabled"], _e = /* @__PURE__ */ S({
	__name: "EntityForm",
	props: {
		service: {},
		id: {}
	},
	emits: ["saved", "cancel"],
	setup(e, { emit: t }) {
		let n = e, r = t, i = T(), a = T(!1);
		C(async () => {
			i.value = n.id === "new" ? await n.service.newEntity() : await n.service.details(n.id) ?? void 0;
		});
		async function o() {
			if (i.value) {
				a.value = !0;
				try {
					let { saved: e } = await n.service.save(i.value);
					r("saved", e);
				} finally {
					a.value = !1;
				}
			}
		}
		return (e, t) => i.value ? (w(), b("form", {
			key: 0,
			class: "entity-form",
			onSubmit: pe(o, ["prevent"])
		}, [E(e.$slots, "default", { item: i.value }), x("div", he, [x("button", {
			type: "submit",
			class: "btn btn-primary",
			disabled: a.value
		}, "Save", 8, ge), x("button", {
			type: "button",
			class: "btn btn-link",
			onClick: t[0] ||= (e) => r("cancel")
		}, "Cancel")])], 32)) : le("", !0);
	}
}), B = class {
	id;
	name;
	icon;
	routeName;
	title;
	description;
	initialQuery;
	parentId;
}, V = class {
	id;
	title;
	parentId;
	icon;
};
//#endregion
//#region src/vue/entities/navigation/functions.ts
function H(e) {
	return Object.assign(new V(), e);
}
function U(e, t) {
	return Object.assign(new B(), {
		id: e.key,
		parentId: t,
		icon: e.key ?? e.name,
		routeName: `${e.key ?? e.name}Overview`,
		title: e.overviewTitle,
		description: e.description,
		initialQuery: e.initialQuery ?? {}
	});
}
function ve(e) {
	function t(t) {
		return e.configs.find((e) => e.key == t);
	}
	let n = e.entities.flatMap(([n, r]) => r.map((e) => t(e)).filter((t) => e.hasAccess(t)).map((e) => U(e, n)));
	return e.groups.filter((e) => n.some((t) => t.parentId == e.id)).map((e) => H(e)).concat(n);
}
function ye(e) {
	function t(t) {
		return e.configs.find((e) => e.key == t);
	}
	let n = e.groups?.map(H);
	return e.entities.flatMap((r) => {
		if (r.length == 2 && Array.isArray(r[1])) {
			let i = n.find((e) => e.id == r[0]);
			return [i, ...r[1].map((e) => t(e)).filter((t) => e.hasAccess(t)).map((e) => U(e, i.id))];
		}
		let i = t(r);
		return e.hasAccess(i) ? [U(i)] : [];
	});
}
function be(e) {
	return new n().init(e, (e, t) => t.filter((t) => t.id == e.parentId));
}
function xe(e) {
	return e instanceof B;
}
//#endregion
//#region src/vue/entities/overview/overview-core.ts
function W({ service: e, searchObject: t, defaultPageSize: n = 10 }) {
	let r = T(t), i = T(new p(n || 10)), a = T(), o = T(), s = T(!1), c = m();
	async function l(t) {
		s.value = !0;
		try {
			c.reset();
			let { saved: n, isNew: r } = await e.save(t);
			return c.success(`Saved ${t.$title}`), {
				saved: n,
				isNew: r
			};
		} catch (e) {
			console.error("saving failed", {
				ex: e,
				item: t
			});
			let n = e;
			c.fail(`Saving ${t.$title} failed`, n.response?.data?.errors);
		} finally {
			s.value = !1;
		}
		return null;
	}
	async function u(t) {
		s.value = !0;
		try {
			c.reset(), await e.remove(t);
		} catch (e) {
			console.error("removing failed", {
				ex: e,
				item: t
			});
			let n = e;
			c.fail(`Removing ${t.$title} failed`, n.response?.data?.errors);
		} finally {
			s.value = !1;
		}
	}
	function d({ saved: e, isNew: t }) {
		if (o.value != null) if (t) o.value.push(e);
		else {
			let t = o.value.findIndex((t) => t.$id === e.$id);
			t !== -1 && o.value.splice(t, 1, e);
		}
	}
	function f(e) {
		if (o.value == null) return;
		let t = o.value.findIndex((t) => t.$id === e.$id);
		t !== -1 && o.value.splice(t, 1);
	}
	function h() {
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
		isLoading: s,
		feedback: c,
		applySave: l,
		applyRemove: u,
		handleSave: d,
		handleRemove: f,
		resetPage: h
	};
}
//#endregion
//#region src/vue/entities/overview/search-view.ts
function Se({ service: e, searchObject: n, defaultPageSize: r = 10, debounceDelay: i = 250 }) {
	let { searchObject: a, pagingInfo: o, items: s, itemsCount: c, isLoading: l, feedback: u, applySave: d, applyRemove: f, handleSave: p, handleRemove: m, resetPage: h } = W({
		service: e,
		searchObject: n,
		defaultPageSize: r
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
		debouncedSearchHandler: t(g, i)
	};
}
//#endregion
//#region src/vue/entities/overview/list-view.ts
function Ce({ service: e, searchObject: n, defaultPageSize: r = 10, debounceDelay: i = 250 }) {
	let { searchObject: a, pagingInfo: o, items: s, itemsCount: c, isLoading: l, feedback: u, applySave: d, applyRemove: f, handleSave: p, handleRemove: m, resetPage: h } = W({
		service: e,
		searchObject: n,
		defaultPageSize: r
	});
	async function g() {
		l.value = !0;
		try {
			u.reset(), s.value = await e.list({
				...n.value || {},
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
		debouncedListHandler: t(g, i)
	};
}
//#endregion
//#region src/vue/entities/overview/route-overview.ts
function we({ pagingInfo: e, searchObject: t, defaultPageSize: n = 10, handler: r }) {
	let i = me();
	function a(r = !1) {
		r && e != null && (e.value = {
			...e?.value,
			page: 1
		});
		let a = i.currentRoute.value, o = l({
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
		let { searchObject: a, pagingInfo: o } = d(i.currentRoute.value.query);
		o.page ||= 1, (isNaN(o.pageSize) || o.pageSize == null) && n > 0 && (o.pageSize = n), t.value != null && (t.value = a), e.value != null && (e.value = o), await r();
	}
	let s = fe(i.currentRoute, async (e, t) => {
		e.name === t.name && await o();
	});
	return C(o), {
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
		return n == null ? n = T(e) : n.value = e, n.timestamp = +/* @__PURE__ */ new Date(), t.set(e.$id, n), n;
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
				return Array.isArray(t) ? t.some((e) => n(e)) : t instanceof u ? t?.constructor?.name === e.constructor.name ? t.$id === e.$id : n(Object.entries(t).map(([, e]) => e).filter((e) => e instanceof u || Array.isArray(e) && e.some((e) => e instanceof u))) : !1;
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
		let t = e([...this._cache].flatMap(([, e]) => [...e].map(([, e]) => e)), (e) => e.timestamp);
		t.length > this._maxItems && t.slice(this._maxItems).forEach((e) => {
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
function Te(e, t) {
	return Y(e, t);
}
//#endregion
//#region src/vue/entities/preloading/preloader.ts
var X = [], Z = [];
function Q(e) {
	Z.length = 0, X.length = 0;
	for (let t of e) {
		X.push(t.name);
		let { list: e } = Y(v(t.name), t.name, void 0, !0), n = e({ pageSize: 0 });
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
var Ee = {
	install(e) {},
	preload: Q,
	ready: $
};
function De() {
	return {
		preload: Q,
		ready: $
	};
}
//#endregion
//#region src/vue/entities/tree/tree.ts
function Oe(e, t) {
	return e.$id != null && e.$id == t.$id && e.constructor == t.constructor;
}
function ke(e) {
	let t = T(), r = T(), i = e?.equals || Oe, a = y(() => t.value?.filter((e) => r.value?.some((t) => i(e.value, t))) || []), o = y(() => a.value.flatMap((e) => e.getAncestors())), s = y(() => a.value.flatMap((e) => e.getOffspring())), c = y(() => [...new Set(a.value.flatMap((e) => e.getAncestors()).concat(a.value).concat(a.value.flatMap((e) => e.getOffspring())))]);
	function l(e, i, a) {
		r.value = e, t.value = new n().init(i.map((e) => de(e)), a), t.value.filter((e) => e.parent == null ? !1 : e.parent.getOffspring().some((t) => t != e && t.value == e.value)).forEach((e) => t.value.remove(e));
	}
	return {
		tree: t,
		nodes: a,
		ancestors: o,
		offspring: s,
		family: c,
		init: l
	};
}
function Ae({ emit: e }) {
	let t = T();
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
export { s as DEFAULT_PAGESIZE, f as DefaultSearchObject, g as DetailsSummary, u as EntityBase, O as EntityDescriptor, _e as EntityForm, z as EntityOverview, r as EntityServiceBase, oe as FormStates, o as JSONService, V as NavGroup, B as NavItem, a as NavTypes, p as PagingInfo, q as PoolCache, G as PoolService, c as SearchObjectBase, i as SortByInfo, be as buildNavigationTree, l as cleanQueryParams, H as createNavGroup, U as createNavItem, Te as createStore, J as defaultPoolCache, _ as formDefaults, ee as formModalDefaults, ve as importDashboard, ye as importNavbar, xe as isNavItem, d as parseQueryParams, Ee as preloaderPlugin, h as useDetails, Ae as useDragDrop, j as useEntityDescribers, M as useFilter, ne as useForm, ae as useListInput, te as useListItemInput, Ce as useListView, ie as useModal, W as useOverviewCore, re as useOwnedCollection, se as useOwnedModal, Y as usePooling, De as usePreloader, we as useRouteOverview, Se as useSearchView, ke as useTree };
