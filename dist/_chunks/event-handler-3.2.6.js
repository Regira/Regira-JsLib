//#region src/events/event.ts
var e = class {
	type;
	src;
	constructor(e, t, n) {
		this.type = e, this.src = t, n != null && Object.keys(n).forEach((e) => {
			e in this || (this[e] = n[e]);
		});
	}
}, t = (e) => {
	let t = e[0], n = e.splice(0, 1)[0], r = n.callback ?? e[e.length - 1], i = n.constraint ?? (e.length > 2 ? e.splice(0, 1).find((e) => e !== r && typeof e == "function") : void 0), a = n.scope;
	return {
		key: t ?? "",
		constraint: i,
		callback: r,
		thisScope: a
	};
};
function n(e) {
	let t = this;
	e.key.split(" ").forEach((n) => {
		n in t.listeners || (t.listeners[n] = []);
		let r = {
			constraint: e.constraint,
			callback: e.callback,
			scope: e.thisScope,
			once: e.once
		};
		t.listeners[n].push(r);
	});
}
var r = class {
	static injectInto(r) {
		Object.defineProperties(r, {
			listeners: { get() {
				return "_listeners" in this || Object.defineProperty(this, "_listeners", { value: {} }), this._listeners;
			} },
			on: {
				value() {
					let e = t([...arguments]);
					return n.call(this, e), this;
				},
				configurable: !0
			},
			once: {
				value() {
					let e = t([...arguments]);
					return e.once = !0, n.call(this, e), this;
				},
				configurable: !0
			},
			off: {
				value(e, t) {
					if (this.listeners[e]) {
						if (this.listeners[e].length && typeof t == "function") {
							let n = this.listeners[e].findIndex((e) => e.callback === t);
							n >= 0 && this.listeners[e].splice(n, 1);
						}
						(!this.listeners[e].length || t == null) && delete this.listeners[e];
					}
					return this;
				},
				configurable: !0
			},
			trigger: {
				async value(t, n) {
					let r = this, i = typeof t == "string" ? new e(t) : t, a = [];
					return (r.listeners[i.type] ?? []).concat(r.listeners[""] ?? []).filter((e) => e && (e.constraint == null || e.constraint.call(e.scope ?? r, t, n))).map((e) => (e.once && r.off(i.type, e.callback), () => {
						try {
							let t = e.callback.call(e.scope ?? r, i, n ?? {});
							return Promise.resolve(t);
						} catch (t) {
							return console.error("Executing listener failed", {
								error: t,
								event: i,
								listener: e.callback
							}), Promise.resolve(t);
						}
					})).reduce((e, t) => e.then(t).then((e) => (a.push(e), e)), Promise.resolve(void 0)).then(() => a);
				},
				configurable: !0
			}
		});
	}
};
r.injectInto(r.prototype);
//#endregion
export { e as n, r as t };
