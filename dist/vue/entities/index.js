import { S as e } from "../../_chunks/array-utility-3.2.6.js";
import { debounceToPromise as t } from "../../utilities/promise-utility.js";
import { t as n } from "../../_chunks/treelist-3.2.6.js";
import { o as r } from "../../_chunks/ioc-3.2.6.js";
import { isNewEntity as i } from "./abstractions/IEntity.js";
import { a, c as o, d as s, i as c, l, n as u, o as d, r as f, s as p, t as m, u as h } from "../../_chunks/abstractions-3.2.6.js";
import { a as g } from "../../_chunks/feedback-3.2.6.js";
import { n as _, t as v } from "../../_chunks/details-3.2.6.js";
import { a as y, c as ee, i as te, l as ne, n as re, o as ie, r as ae, s as oe, t as se, u as ce } from "../../_chunks/form-3.2.6.js";
import "../../_chunks/ui-3.2.6.js";
import { Fragment as le, computed as b, createCommentVNode as ue, createElementBlock as x, createElementVNode as S, defineComponent as C, mergeDefaults as de, onMounted as w, openBlock as T, ref as E, renderList as fe, renderSlot as D, toDisplayString as O, toRaw as pe, unref as k, watch as me, withModifiers as he } from "vue";
import { useRouter as ge } from "vue-router";
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
			t("update:modelValue", Object.fromEntries(Object.entries({ ...e.value }).map(([e, t]) => [e, void 0]))), i();
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
var L = { class: "entity-overview" }, _e = { class: "table" }, ve = { class: "entity-paging d-flex align-items-center gap-2" }, ye = ["disabled"], be = { class: "text-muted small" }, xe = ["disabled"], Se = /* @__PURE__ */ C({
	__name: "EntityOverview",
	props: /*@__PURE__*/ de({
		service: {},
		query: {},
		pageSize: {}
	}, { ...F }),
	setup(e, { expose: t }) {
		let { items: n, count: r, page: i, pageCount: a, reload: o, setPage: s, remove: c } = I(e);
		return t({
			reload: o,
			setPage: s
		}), (e, t) => (T(), x("div", L, [
			D(e.$slots, "toolbar", {
				reload: k(o),
				setPage: k(s)
			}),
			S("table", _e, [S("thead", null, [D(e.$slots, "head")]), S("tbody", null, [(T(!0), x(le, null, fe(k(n), (t) => (T(), x("tr", { key: t.$id }, [D(e.$slots, "row", {
				item: t,
				remove: k(c),
				reload: k(o)
			}, () => [S("td", null, O(t.$title), 1)])]))), 128))])]),
			S("div", ve, [D(e.$slots, "paging", {
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
				}, "Previous", 8, ye),
				S("span", be, "Page " + O(k(i)) + " / " + O(k(a)) + " · " + O(k(r)), 1),
				S("button", {
					type: "button",
					class: "btn btn-sm btn-outline-secondary",
					disabled: k(i) >= k(a),
					onClick: t[1] ||= (e) => k(s)(k(i) + 1)
				}, "Next", 8, xe)
			])])
		]));
	}
});
//#endregion
//#region src/vue/entities/lean/form.ts
function R(e, { emit: t }) {
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
var Ce = { class: "mt-3" }, we = ["disabled"], z = /* @__PURE__ */ C({
	__name: "EntityForm",
	props: {
		service: {},
		id: {}
	},
	emits: ["saved", "cancel"],
	setup(e, { emit: t }) {
		let n = e, r = t, { item: i, saving: a, submit: o } = R(n, { emit: r });
		return (e, t) => k(i) ? (T(), x("form", {
			key: 0,
			class: "entity-form",
			onSubmit: t[1] ||= he((...e) => k(o) && k(o)(...e), ["prevent"])
		}, [D(e.$slots, "default", { item: k(i) }), S("div", Ce, [S("button", {
			type: "submit",
			class: "btn btn-primary",
			disabled: k(a)
		}, "Save", 8, we), S("button", {
			type: "button",
			class: "btn btn-link",
			onClick: t[0] ||= (e) => r("cancel")
		}, "Cancel")])], 32)) : ue("", !0);
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
function Te(e) {
	function t(t) {
		return e.configs.find((e) => e.key == t);
	}
	let n = e.entities.flatMap(([n, r]) => r.map((e) => t(e)).filter((t) => e.hasAccess(t)).map((e) => U(e, n)));
	return e.groups.filter((e) => n.some((t) => t.parentId == e.id)).map((e) => H(e)).concat(n);
}
function Ee(e) {
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
function De(e) {
	return new n().init(e, (e, t) => t.filter((t) => t.id == e.parentId));
}
function Oe(e) {
	return e instanceof B;
}
//#endregion
//#region src/vue/entities/overview/overview-core.ts
function W({ service: e, searchObject: t, defaultPageSize: n = 10 }) {
	let r = E(t), i = E(new h(n || 10)), a = E(), o = E(), s = E(!1), c = g();
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
function ke({ service: e, searchObject: n, defaultPageSize: r = 10, debounceDelay: i = 250 }) {
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
function Ae({ service: e, searchObject: n, defaultPageSize: r = 10, debounceDelay: i = 250 }) {
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
function je({ pagingInfo: e, searchObject: t, defaultPageSize: n = 10, handler: r }) {
	let i = ge();
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
		o.page ||= 1, (isNaN(o.pageSize) || o.pageSize == null) && n > 0 && (o.pageSize = n), t.value != null && (t.value = a), e.value != null && (e.value = o), await r();
	}
	let s = me(i.currentRoute, async (e, t) => {
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
}, J = new q();
function Y(e, t, n = J, r = !1) {
	let a = e instanceof G ? e : new G(e, n, t);
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
function Me(e, t) {
	return Y(e, t);
}
//#endregion
//#region src/vue/entities/preloading/preloader.ts
var X = [], Z = [];
function Q(e) {
	Z.length = 0, X.length = 0;
	for (let t of e) {
		X.push(t.name);
		let { list: e } = Y(r(t.name), t.name, void 0, !0), n = e({ pageSize: 0 });
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
var Ne = {
	install(e) {},
	preload: Q,
	ready: $
};
function Pe() {
	return {
		preload: Q,
		ready: $
	};
}
//#endregion
//#region src/vue/entities/tree/tree.ts
function Fe(e, t) {
	return e.$id != null && e.$id == t.$id && e.constructor == t.constructor;
}
function Ie(e) {
	let t = E(), r = E(), i = e?.equals || Fe, a = b(() => t.value?.filter((e) => r.value?.some((t) => i(e.value, t))) || []), o = b(() => a.value.flatMap((e) => e.getAncestors())), s = b(() => a.value.flatMap((e) => e.getOffspring())), c = b(() => [...new Set(a.value.flatMap((e) => e.getAncestors()).concat(a.value).concat(a.value.flatMap((e) => e.getOffspring())))]);
	function l(e, i, a) {
		r.value = e, t.value = new n().init(i.map((e) => pe(e)), a), t.value.filter((e) => e.parent == null ? !1 : e.parent.getOffspring().some((t) => t != e && t.value == e.value)).forEach((e) => t.value.remove(e));
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
function Le({ emit: e }) {
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
export { l as DEFAULT_PAGESIZE, m as DefaultSearchObject, v as DetailsSummary, f as EntityBase, A as EntityDescriptor, z as EntityForm, Se as EntityOverview, a as EntityServiceBase, ee as FormStates, se as InputSelectorInline, c as JSONService, V as NavGroup, B as NavItem, s as NavTypes, h as PagingInfo, q as PoolCache, G as PoolService, u as SearchObjectBase, o as SortByInfo, De as buildNavigationTree, d as cleanQueryParams, H as createNavGroup, U as createNavItem, Me as createStore, J as defaultPoolCache, ne as formDefaults, ie as formModalDefaults, Te as importDashboard, Ee as importNavbar, Oe as isNavItem, i as isNewEntity, F as leanOverviewDefaults, p as parseQueryParams, Ne as preloaderPlugin, _ as useDetails, Le as useDragDrop, N as useEntityDescribers, P as useFilter, ce as useForm, R as useLeanForm, I as useLeanOverview, te as useListInput, y as useListItemInput, Ae as useListView, oe as useModal, W as useOverviewCore, ae as useOwnedCollection, re as useOwnedModal, Y as usePooling, Pe as usePreloader, je as useRouteOverview, ke as useSearchView, Ie as useTree };
