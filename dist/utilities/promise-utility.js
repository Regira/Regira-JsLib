//#region src/utilities/promise-utility.ts
var e = (e, t = 250) => {
	let n, r = [];
	return async function(...i) {
		return n !== void 0 && clearTimeout(n), new Promise((a) => {
			r.push(a), n = setTimeout(() => {
				n = void 0;
				let t = e(...i);
				for (; r.length;) r.shift()(t);
			}, t);
		});
	};
}, t = async (e, t = !1) => {
	let n = [], r = [];
	for (let i of e) try {
		n.push(await i());
	} catch (e) {
		if (t) throw e;
		r.push(e);
	}
	return r.length ? Promise.reject(r) : n;
}, n = (e = 1e3) => new Promise((t) => setTimeout(t, e)), r = {
	debounceToPromise: e,
	enqueue: t,
	delay: n
};
//#endregion
export { e as debounceToPromise, r as default, n as delay, t as enqueue };
