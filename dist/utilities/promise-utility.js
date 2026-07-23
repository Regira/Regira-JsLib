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
}, t = async (e) => {
	let t = !1, n = await e.reduce(async (e, n) => {
		let r = await e, i = await Promise.resolve(n()).catch((e) => (t = !0, e));
		return r.push(i), r;
	}, Promise.resolve([]));
	return t ? Promise.reject(n) : n;
}, n = (e = 1e3) => new Promise((t) => setTimeout(t, e)), r = {
	debounceToPromise: e,
	enqueue: t,
	delay: n
};
//#endregion
export { e as debounceToPromise, r as default, n as delay, t as enqueue };
