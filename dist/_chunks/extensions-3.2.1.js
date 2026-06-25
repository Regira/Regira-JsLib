import { t as e } from "./array-utility-3.2.1.js";
import t from "../extensions/date-extensions.js";
import { debounceToPromise as n, enqueue as r } from "../utilities/promise-utility.js";
//#region src/extensions/array-extensions.ts
var { isArray: i, isIterable: a, toArray: o, newArray: s, ...c } = e, l = {
	injectInto(e, t = !1) {
		let n = c;
		Object.getOwnPropertyNames(n).forEach((r) => {
			r !== "constructor" && (t || !Object.prototype.hasOwnProperty.call(e, r)) && Object.defineProperty(e, r, {
				value: function() {
					let e = [this, ...arguments];
					return n[r].apply(this, e);
				},
				configurable: !0
			});
		});
	},
	use(e = !1) {
		this.injectInto(Array.prototype, e);
	}
}, u = { use() {
	Promise.debounce = n, Promise.enqueue = r;
} }, d = {
	useArrayExtensions: l.use.bind(l),
	useDateExtensions: t.use.bind(t),
	usePromiseExtensions: u.use.bind(u)
};
//#endregion
export { u as n, l as r, d as t };
