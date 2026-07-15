import { computed as e, createBlock as t, createElementBlock as n, defineComponent as r, inject as i, normalizeClass as a, normalizeStyle as o, openBlock as s, resolveDynamicComponent as c } from "vue";
//#region src/vue/ui/icons/bootstrap-icons.ts
var l = {
	address: "bi bi-journal-richtext",
	admin: "bi bi-person-gear",
	alert: "bi bi-exclamation-circle",
	attachment: "bi bi-paperclip",
	ban: "bi bi-ban",
	bank: "bi bi-piggy-bank",
	birthday: "bi bi-balloon",
	box: "bi bi-box",
	boxes: "bi bi-boxes",
	building: "bi bi-building",
	calendar: "bi bi-calendar",
	cancel: "bi bi-x-octagon",
	car: "bi bi-car-front",
	chat: "bi bi-chat",
	chatLeft: "bi bi-chat-left-text",
	chatRight: "bi bi-chat-right-text",
	check: "bi bi-check",
	checked: "bi bi-check2-square",
	clear: "bi bi-eraser",
	client: "bi bi-person-rolodex",
	clone: "bi bi-clipboard-plus",
	close: "bi bi-x-circle",
	closeSq: "bi bi-x-square",
	code: "bi bi-c-square",
	collapse: "bi bi-arrows-collapse",
	collection: "bi bi-collection",
	columns: "bi bi-layout-three-columns",
	connect: "bi bi-link",
	contact: "bi bi-person-lines-fill",
	copy: "bi bi-clipboard",
	country: "bi bi-globe",
	csv: "bi bi-filetype-csv",
	dashboard: "bi bi-speedometer2",
	date: "bi bi-calendar",
	delete: "bi bi-trash",
	details: "bi bi-eye-fill",
	docTable: "bi bi-file-ruled",
	docx: "bi bi-file-earmark-word",
	down: "bi bi-caret-down-square",
	download: "bi bi-file-earmark-arrow-down",
	edit: "bi bi-pencil-fill",
	email: "bi bi-at",
	error: "bi bi-exclamation-circle",
	euro: "bi bi-currency-euro",
	exit: "bi bi-box-arrow-right",
	expand: "bi bi-arrows-expand",
	export: "bi bi-file-earmark-arrow-up",
	fiche: "bi bi-list-columns-reverse",
	file: "bi bi-file-earmark",
	filter: "bi bi-funnel",
	folder: "bi bi-folder",
	form: "bi bi-pencil-square",
	from: "bi bi-box-arrow-right",
	git: "bi bi-github",
	globe: "bi bi-globe-europe-africa",
	home: "bi bi-house-door",
	import: "bi bi-file-earmark-arrow-down",
	info: "bi bi-info-circle",
	internet: "bi bi-globe",
	invoice: "bi bi-file-earmark-ruled",
	ip: "bi bi-modem",
	key: "bi bi-key",
	language: "bi bi-translate",
	list: "bi bi-list-task",
	locked: "bi bi-lock-fill",
	look: "bi bi-eye",
	mail: "bi bi-envelope-at",
	manage: "bi bi-gear-fill",
	map: "bi bi-geo-alt",
	markdown: "bi bi-markdown",
	maximize: "bi bi-plus-square",
	message: "bi bi-chat-left-dots",
	minimize: "bi bi-dash-square",
	minus: "bi bi-dash",
	mobilePhone: "bi bi-phone",
	move: "bi bi-arrows-move",
	multiline: "bi bi-chat-square-text",
	new: "bi bi-plus",
	notes: "bi bi-journal-text",
	noUser: "bi bi-person-x",
	pay: "bi bi-cash-coin",
	pdf: "bi bi-file-earmark-pdf",
	people: "bi bi-people-fill",
	peppol: "bi bi-send",
	phone: "bi bi-telephone",
	popOut: "bi bi-box-arrow-up-right",
	question: "bi bi-question",
	receipt: "bi bi-receipt",
	report: "bi bi-file-earmark-bar-graph",
	restore: "bi bi-wrench-adjustable-circle",
	save: "bi bi-save-fill",
	search: "bi bi-search",
	security: "bi bi-shield-check",
	select: "bi bi-cursor",
	selected: "bi bi-cursor-fill",
	settings: "bi bi-tools",
	sidebarLeft: "bi bi-layout-sidebar",
	sidebarRight: "bi bi-layout-sidebar-reverse",
	singleline: "bi bi-chat-square-dots",
	statistics: "bi bi-graph-up",
	submit: "bi bi-check-circle",
	tag: "bi bi-tag",
	tenant: "bi bi-person-rolodex",
	times: "bi bi-x-lg",
	timespan: "bi bi-hourglass",
	title: "bi bi-fonts",
	to: "bi bi-box-arrow-in-right",
	today: "bi bi-calendar-check",
	tools: "bi bi-tools",
	transport: "bi bi-truck",
	tree: "bi bi-diagram-3",
	truck: "bi bi-truck",
	unchecked: "bi bi-square",
	unlocked: "bi bi-unlock-fill",
	up: "bi bi-caret-up-square",
	upload: "bi bi-file-earmark-arrow-up",
	user: "bi bi-person-circle",
	vCard: "bi bi-person-vcard-fill",
	warning: "bi bi-exclamation-triangle",
	website: "bi bi-browser-chrome",
	wrench: "bi bi-wrench-adjustable",
	xlsx: "bi bi-file-earmark-excel",
	xml: "bi bi-filetype-xml",
	zip: "bi bi-file-earmark-zip"
}, u = /* @__PURE__ */ new Map();
function d(e) {
	(Array.isArray(e) ? e : Object.entries(e)).forEach(([e, t]) => {
		u.set(e, t);
	});
}
function f() {
	u.clear();
}
d(l);
//#endregion
//#region src/vue/ui/icons/BsIcon.vue
var p = /* @__PURE__ */ r({
	__name: "BsIcon",
	props: {
		name: {},
		size: { default: "md" }
	},
	setup(t) {
		let r = t;
		!u.has(r.name) && !((e) => /\s/.test(e) || e.startsWith("bi-") || e.startsWith("fa-"))(r.name) && console.warn(`Icon "${r.name}" is not a registered key; pass a known key or a raw icon class.`);
		let i = e(() => u.get(r.name) ?? r.name), c = {
			sm: .75,
			md: 1,
			lg: 2,
			xl: 3
		}, l = e(() => ({ "font-size": `${c[r.size]}rem` }));
		return (e, t) => (s(), n("i", {
			class: a(i.value),
			style: o(l.value)
		}, null, 6));
	}
}), m = /* @__PURE__ */ r({
	__name: "FaIcon",
	props: {
		name: {},
		size: { default: "md" }
	},
	setup(t) {
		let r = t;
		!u.has(r.name) && !((e) => /\s/.test(e) || e.startsWith("bi-") || e.startsWith("fa-"))(r.name) && console.warn(`Icon "${r.name}" is not a registered key; pass a known key or a raw icon class.`);
		let i = {
			sm: "fa-sm",
			md: "fa-md",
			lg: "fa-lg",
			xl: "fa-3x"
		}, o = e(() => [u.get(r.name) ?? r.name, i[r.size]]);
		return (e, t) => (s(), n("i", { class: a(o.value) }, null, 2));
	}
}), h = /* @__PURE__ */ r({
	__name: "Icon",
	props: {
		name: {},
		size: { default: "md" }
	},
	setup(n) {
		let r = i("icons.config", null), a = e(() => r?.source === "fa" ? m : p);
		return (e, r) => (s(), t(c(a.value), {
			class: "rg-icon",
			name: n.name,
			size: n.size
		}, null, 8, ["name", "size"]));
	}
});
//#endregion
export { u as a, f as i, m as n, d as o, p as r, l as s, h as t };
