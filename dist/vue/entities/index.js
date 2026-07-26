import { S as e } from "../../_chunks/array-utility-3.2.6.js";
import { debounceToPromise as t } from "../../utilities/promise-utility.js";
import { t as n } from "../../_chunks/treelist-3.2.6.js";
import { o as r } from "../../_chunks/ioc-3.2.6.js";
import { isNewEntity as i } from "./abstractions/IEntity.js";
import { a, c as o, d as s, i as c, l, n as u, o as d, r as f, s as p, t as m, u as h } from "../../_chunks/abstractions-3.2.6.js";
import { t as g } from "../../_chunks/ISearchObject-3.2.6.js";
import { a as ee } from "../../_chunks/feedback-3.2.6.js";
import { n as te, t as ne } from "../../_chunks/details-3.2.6.js";
import { a as re, c as ie, i as ae, l as oe, n as se, o as ce, r as le, s as _, t as v, u as y } from "../../_chunks/form-3.2.6.js";
import "../../_chunks/ui-3.2.6.js";
import { Fragment as ue, computed as b, createCommentVNode as de, createElementBlock as x, createElementVNode as S, defineComponent as C, mergeDefaults as fe, onMounted as w, openBlock as T, ref as E, renderList as pe, renderSlot as D, toDisplayString as O, toRaw as me, unref as k, watch as he, withModifiers as ge } from "vue";
import { useRouter as _e } from "vue-router";
//#region src/vue/entities/config/EntityDescriptor.ts
var A = class {
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
}, j = /* @__PURE__ */ new Map(), M = Symbol();
function N(e = M) {
	let t = j.has(e) ? j.get(e) : j.set(e, /* @__PURE__ */ new Map()).get(e);
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
function P({ searchObject: e, emit: t, Constructor: n }) {
	let r = () => {
		t("update:modelValue", { ...e.value });
	}, i = () => {
		t("filter", e.value);
	};
	return {
		filterIsActive: b(() => {
			let t = n ? new n() : new m(), r = Object.keys(t), i = Object.entries(e.value || {}).filter(([, e]) => e != null).map(([e]) => e);
			return r.some((e) => i.some((t) => e == t));
		}),
		handleToggle: () => t("toggle-adv"),
		handleFilter: i,
		handleUpdate: () => {
			r(), i();
		},
		handleReset: () => {
			t("update:modelValue", Object.fromEntries(Object.entries({ ...e.value }).map(([e]) => [e, void 0]))), i();
		}
	};
}
//#endregion
//#region src/vue/entities/lean/overview.ts
var F = { pageSize: 10 };
function I(e) {
	let t = E([]), n = E(0), r = E(1), i = b(() => e.pageSize ?? 10), a = b(() => Math.max(1, Math.ceil(n.value / i.value)));
	async function o() {
		let a = await e.service.search({
			...e.query,
			page: r.value,
			pageSize: i.value
		});
		t.value = a.items, n.value = a.count;
	}
	async function s(e) {
		r.value = Math.min(Math.max(1, e), a.value), await o();
	}
	async function c(t) {
		await e.service.remove(t), await o();
	}
	return w(o), {
		items: t,
		count: n,
		page: r,
		pageCount: a,
		reload: o,
		setPage: s,
		remove: c
	};
}
//#endregion
//#region src/vue/entities/lean/EntityOverview.vue?vue&type=script&setup=true&lang.ts
var ve = { class: "entity-overview" }, ye = { class: "table" }, be = { class: "entity-paging d-flex align-items-center gap-2" }, xe = ["disabled"], Se = { class: "text-muted small" }, Ce = ["disabled"], we = /* @__PURE__ */ C({
	__name: "EntityOverview",
	props: /*@__PURE__*/ fe({
		service: {},
		query: {},
		pageSize: {}
	}, { ...F }),
	setup(e, { expose: t }) {
		let { items: n, count: r, page: i, pageCount: a, reload: o, setPage: s, remove: c } = I(e);
		return t({
			reload: o,
			setPage: s
		}), (e, t) => (T(), x("div", ve, [
			D(e.$slots, "toolbar", {
				reload: k(o),
				setPage: k(s)
			}),
			S("table", ye, [S("thead", null, [D(e.$slots, "head")]), S("tbody", null, [(T(!0), x(ue, null, pe(k(n), (t) => (T(), x("tr", { key: t.$id }, [D(e.$slots, "row", {
				item: t,
				remove: k(c),
				reload: k(o)
			}, () => [S("td", null, O(t.$title), 1)])]))), 128))])]),
			S("div", be, [D(e.$slots, "paging", {
				page: k(i),
				pageCount: k(a),
				count: k(r),
				setPage: k(s)
			}, () => [
				S("button", {
					type: "button",
					class: "btn btn-sm btn-outline-secondary",
					disabled: k(i) <= 1,
					onClick: t[0] ||= (e) => k(s)(k(i) - 1)
				}, "Previous", 8, xe),
				S("span", Se, "Page " + O(k(i)) + " / " + O(k(a)) + " · " + O(k(r)), 1),
				S("button", {
					type: "button",
					class: "btn btn-sm btn-outline-secondary",
					disabled: k(i) >= k(a),
					onClick: t[1] ||= (e) => k(s)(k(i) + 1)
				}, "Next", 8, Ce)
			])])
		]));
	}
});
//#endregion
//#region src/vue/entities/lean/form.ts
function L(e, { emit: t }) {
	let n = E(), r = E(!1);
	w(async () => {
		n.value = e.id === "new" ? await e.service.newEntity() : await e.service.details(e.id) ?? void 0;
	});
	async function i() {
		if (n.value) {
			r.value = !0;
			try {
				let { saved: r } = await e.service.save(n.value);
				t("saved", r);
			} finally {
				r.value = !1;
			}
		}
	}
	return {
		item: n,
		saving: r,
		submit: i
	};
}
//#endregion
//#region src/vue/entities/lean/EntityForm.vue?vue&type=script&setup=true&lang.ts
var Te = { class: "mt-3" }, Ee = ["disabled"], De = /* @__PURE__ */ C({
	__name: "EntityForm",
	props: {
		service: {},
		id: {}
	},
	emits: ["saved", "cancel"],
	setup(e, { emit: t }) {
		let n = e, r = t, { item: i, saving: a, submit: o } = L(n, { emit: r });
		return (e, t) => k(i) ? (T(), x("form", {
			key: 0,
			class: "entity-form",
			onSubmit: t[1] ||= ge((...e) => k(o) && k(o)(...e), ["prevent"])
		}, [D(e.$slots, "default", { item: k(i) }), S("div", Te, [S("button", {
			type: "submit",
			class: "btn btn-primary",
			disabled: k(a)
		}, "Save", 8, Ee), S("button", {
			type: "button",
			class: "btn btn-link",
			onClick: t[0] ||= (e) => r("cancel")
		}, "Cancel")])], 32)) : de("", !0);
	}
}), R = class {
	id;
	name;
	icon;
	routeName;
	title;
	description;
	initialQuery;
	parentId;
}, z = class {
	id;
	title;
	parentId;
	icon;
};
//#endregion
//#region src/vue/entities/navigation/functions.ts
function B(e) {
	return Object.assign(new z(), e);
}
function V(e, t) {
	return Object.assign(new R(), {
		id: e.key,
		parentId: t,
		icon: e.key ?? e.name,
		routeName: `${e.key ?? e.name}Overview`,
		title: e.overviewTitle,
		description: e.description,
		initialQuery: e.initialQuery ?? {}
	});
}
function H(e, t) {
	return e.flatMap((e) => {
		let n = t.find((t) => t.key == e);
		return n ? [n] : (console.warn(`[regira] navigation entry "${e}" matches no registered entity config (expected the entity key, e.g. "Article") — skipping.`), []);
	});
}
function Oe(e) {
	let t = e.entities.flatMap(([t, n]) => H(n, e.configs).filter((t) => e.hasAccess(t)).map((e) => V(e, t)));
	return e.groups.filter((e) => t.some((t) => t.parentId == e.id)).map((e) => B(e)).concat(t);
}
function ke(e) {
	let t = e.groups?.map(B);
	return e.entities.flatMap((n) => {
		if (n.length == 2 && Array.isArray(n[1])) {
			let r = t?.find((e) => e.id == n[0]);
			return r ? [r, ...H(n[1], e.configs).filter((t) => e.hasAccess(t)).map((e) => V(e, r.id))] : (console.warn(`[regira] navigation group "${n[0]}" matches no entry in navigation.groups — skipping.`), []);
		}
		let [r] = H([n], e.configs);
		return r && e.hasAccess(r) ? [V(r)] : [];
	});
}
function Ae(e) {
	return new n().init(e, (e, t) => t.filter((t) => t.id == e.parentId));
}
function je(e) {
	return e instanceof R;
}
//#endregion
//#region src/vue/entities/overview/overview-core.ts
function U({ service: e, searchObject: t, defaultPageSize: n = 10 }) {
	let r = E(t), i = E(new h(n || 10)), a = E(), o = E(), s = E(!1), c = ee();
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
	function p() {
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
		resetPage: p
	};
}
//#endregion
//#region src/vue/entities/overview/search-view.ts
function Me({ service: e, searchObject: n, defaultPageSize: r = 10, debounceDelay: i = 250 }) {
	let { searchObject: a, pagingInfo: o, items: s, itemsCount: c, isLoading: l, feedback: u, applySave: d, applyRemove: f, handleSave: p, handleRemove: m, resetPage: h } = U({
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
function Ne({ service: e, searchObject: n, defaultPageSize: r = 10, debounceDelay: i = 250 }) {
	let { searchObject: a, pagingInfo: o, items: s, itemsCount: c, isLoading: l, feedback: u, applySave: d, applyRemove: f, handleSave: p, handleRemove: m, resetPage: h } = U({
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
function Pe({ pagingInfo: e, searchObject: t, defaultPageSize: n = 10, handler: r }) {
	let i = _e();
	function a(r = !1) {
		r && e != null && (e.value = {
			...e?.value,
			page: 1
		});
		let a = i.currentRoute.value, o = d({
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
		let { searchObject: a, pagingInfo: o } = p(i.currentRoute.value.query);
		o.page ||= 1, (o.pageSize == null || isNaN(o.pageSize)) && n > 0 && (o.pageSize = n), t.value != null && (t.value = a), e.value != null && (e.value = o), await r();
	}
	let s = he(i.currentRoute, async (e, t) => {
		e.name === t.name && await o();
	});
	return w(o), {
		updateOverviewRoute: a,
		routeSearchHandler: o,
		routeWatcher: s
	};
}
//#endregion
//#region src/vue/entities/pooling/PoolService.ts
var W = class {
	service;
	cache;
	type;
	constructor(e, t, n) {
		this.service = e, this.cache = t, this.type = n;
	}
	async details(e, t) {
		let n = await this.service.details(e, t);
		if (n != null) return this.cache.set(this.toEntity({ ...n })), this.toEntity({ ...n });
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
}, G = {
	INTERVAL: 60,
	EXPIRES: 600,
	MAX_ITEMS: 1e3
}, K = class {
	_cache = /* @__PURE__ */ new Map();
	_expires;
	_maxItems;
	persistentTypes = [];
	constructor({ interval: e = G.INTERVAL, expires: t = G.EXPIRES, maxItems: n = G.MAX_ITEMS } = {}) {
		e > 0 && setInterval(() => this.cleanup(), e * 1e3), this._expires = t, this._maxItems = n;
	}
	set(e) {
		let t = this.getEntityMap(e.constructor.name), n = this.get(e.constructor.name, e.$id);
		return n == null ? n = E(e) : n.value = e, n.timestamp = +/* @__PURE__ */ new Date(), t.set(e.$id, n), n;
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
				return Array.isArray(t) ? t.some((e) => n(e)) : t instanceof f ? t?.constructor?.name === e.constructor.name ? t.$id === e.$id : n(Object.entries(t).map(([, e]) => e).filter((e) => e instanceof f || Array.isArray(e) && e.some((e) => e instanceof f))) : !1;
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
}, q = new K();
function J(e, t, n = q, r = !1) {
	let a = e instanceof W ? e : new W(e, n, t);
	r && !n.persistentTypes.includes(t) && n.persistentTypes.push(t);
	function o(t) {
		if (t == null) return t;
		if (!Array.isArray(t)) {
			let n = e.toEntity(t);
			if (i(n?.$id)) return n;
		}
		return Array.isArray(t) ? a.getMany(t || []).map((e) => e.value) : a.get(t)?.value;
	}
	return {
		service: a,
		cache: n,
		details: a.details.bind(a),
		list: a.list.bind(a),
		search: a.search.bind(a),
		searchUnion: a.searchUnion.bind(a),
		save: a.save.bind(a),
		remove: a.remove.bind(a),
		toEntity: a.toEntity.bind(a),
		newEntity: a.newEntity.bind(a),
		get: (e) => a.get(e),
		getMany: (e) => a.getMany(e),
		set: (e) => n.set(a.toEntity(e)),
		setMany: (e) => e.map((e) => n.set(a.toEntity(e))),
		fromPool: o,
		fromCache: (e) => e ? n.get(t, e) : n.getAll(t)
	};
}
//#endregion
//#region src/vue/entities/pooling/store.ts
function Y(e, t) {
	return J(e, t);
}
//#endregion
//#region src/vue/entities/preloading/preloader.ts
var X = [], Z = [];
function Q(e) {
	Z.length = 0, X.length = 0;
	for (let t of e) {
		X.push(t.name);
		let { list: e } = J(r(t.name), t.name, void 0, !0), n = e({ pageSize: 0 });
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
var Fe = {
	install(e) {},
	preload: Q,
	ready: $
};
function Ie() {
	return {
		preload: Q,
		ready: $
	};
}
//#endregion
//#region src/vue/entities/tree/tree.ts
function Le(e, t) {
	return e.$id != null && e.$id == t.$id && e.constructor == t.constructor;
}
function Re(e) {
	let t = E(), r = E(), i = e?.equals || Le, a = b(() => t.value?.filter((e) => r.value?.some((t) => i(e.value, t))) || []), o = b(() => a.value.flatMap((e) => e.getAncestors())), s = b(() => a.value.flatMap((e) => e.getOffspring())), c = b(() => [...new Set(a.value.flatMap((e) => e.getAncestors()).concat(a.value).concat(a.value.flatMap((e) => e.getOffspring())))]);
	function l(e, i, a) {
		r.value = e, t.value = new n().init(i.map((e) => me(e)), a), t.value.filter((e) => e.parent == null ? !1 : e.parent.getOffspring().some((t) => t != e && t.value == e.value)).forEach((e) => t.value.remove(e));
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
function ze({ emit: e }) {
	let t = E();
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
export { g as ArchivedFilter, l as DEFAULT_PAGESIZE, m as DefaultSearchObject, ne as DetailsSummary, f as EntityBase, A as EntityDescriptor, De as EntityForm, we as EntityOverview, a as EntityServiceBase, ie as FormStates, v as InputSelectorInline, c as JSONService, z as NavGroup, R as NavItem, s as NavTypes, h as PagingInfo, K as PoolCache, W as PoolService, u as SearchObjectBase, o as SortByInfo, Ae as buildNavigationTree, d as cleanQueryParams, B as createNavGroup, V as createNavItem, Y as createStore, q as defaultPoolCache, oe as formDefaults, ce as formModalDefaults, Oe as importDashboard, ke as importNavbar, je as isNavItem, i as isNewEntity, F as leanOverviewDefaults, p as parseQueryParams, Fe as preloaderPlugin, te as useDetails, ze as useDragDrop, N as useEntityDescribers, P as useFilter, y as useForm, L as useLeanForm, I as useLeanOverview, ae as useListInput, re as useListItemInput, Ne as useListView, _ as useModal, U as useOverviewCore, le as useOwnedCollection, se as useOwnedModal, J as usePooling, Ie as usePreloader, Pe as useRouteOverview, Me as useSearchView, Re as useTree };
