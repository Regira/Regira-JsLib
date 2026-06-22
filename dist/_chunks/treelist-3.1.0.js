import { a as e, j as t, m as n } from "./array-utility-3.1.0.js";
//#region src/treelist/TreeNode.ts
var r = class e {
	_value;
	_parentNode;
	_level;
	_tree;
	_children;
	constructor(e, t = null, n) {
		this._value = e, this._parentNode = t, this._level = t ? t.level + 1 : 0, this._tree = n, this._children = [];
	}
	get value() {
		return this._value;
	}
	get parent() {
		return this._parentNode;
	}
	get level() {
		return this._level;
	}
	get children() {
		return this._children;
	}
	add(t) {
		let n = new e(t, this, this._tree);
		return n._level = this.level + 1, this._children.push(n), this._tree.push(n), n;
	}
	remove(e) {
		this._tree.remove(e);
	}
	update(e) {
		this._value = e;
	}
	getOffspring() {
		return this._tree.getOffspring(this);
	}
	getAncestors() {
		return this._tree.getAncestors(this);
	}
	getRoot() {
		return this._tree.getRoots(this)[0];
	}
	*[Symbol.iterator]() {
		for (let e of this.children) yield e;
	}
}, i = class extends Array {
	roots;
	constructor(e) {
		super(), this.roots = [], Array.isArray(e) && this.init(e);
	}
	static get [Symbol.species]() {
		return Array;
	}
	init(e = [], t = (e, t) => []) {
		this.length = 0, this.roots = [];
		let n = (r) => {
			let i = t(r, e);
			return i.length ? (i.forEach((e) => {
				let t = this.find((t) => t.value === e) || n(e);
				this.addValue(r, t);
			}), null) : this.addValue(r);
		};
		return e.forEach(n), this;
	}
	addValue(e, t) {
		return this.addValues([e], t)[0];
	}
	addValues(e, t) {
		if (!t) {
			let t = e.map((e) => new r(e, null, this));
			return this.push(...t), this.roots.push(...t), t;
		}
		return e.map((e) => t.add(e));
	}
	remove(e) {
		if (e?.children?.length > 0 && e.children.forEach((e) => this.remove(e)), e.parent != null) {
			let t = e.parent._children.findIndex((t) => t === e);
			t !== -1 && e.parent._children.splice(t, 1);
		} else {
			let t = this.roots.findIndex((t) => t === e);
			t !== -1 && this.roots.splice(t, 1);
		}
		let t = this.findIndex((t) => t === e);
		return t === -1 ? !1 : (this.splice(t, 1), !0);
	}
	move(e, t) {
		if (e.parent != null) {
			let t = e.parent.children.findIndex((t) => t === e);
			if (t !== -1) e.parent.children.splice(t, 1);
			else debugger;
		} else {
			let t = this.roots.findIndex((t) => t === e);
			t !== -1 && this.roots.splice(t, 1);
		}
		t == null ? this.roots.includes(e) || this.roots.push(e) : t.children.includes(e) || t.children.push(e), e._parentNode = t;
	}
	getNodes(e) {
		if (e == null) return [...this];
		let r = t(n(e) ? e : [e]);
		return this.filter((e) => r.includes(e.value));
	}
	getRoots(t) {
		return t == null ? [...this.roots] : (t = this._ensureNodeList(t), e(t.map((e) => {
			let t = e;
			for (; t.parent;) t = t.parent;
			return t;
		})));
	}
	getAncestors(t) {
		t = this._ensureNodeList(t);
		let n = (e) => e.parent ? [e.parent].concat(n(e.parent)) : [];
		return e(t.flatMap(n));
	}
	getOffspring(e) {
		e = this._ensureNodeList(e);
		let t = (e) => e.children.length > 0 ? [...e.children, ...e.children.flatMap(t)] : [];
		return e.flatMap(t);
	}
	getValues(e) {
		return e = this._ensureNodeList(e), e.map((e) => e.value);
	}
	_ensureNodeList(e) {
		return e instanceof r ? [e] : e || this;
	}
};
//#endregion
export { r as n, i as t };
