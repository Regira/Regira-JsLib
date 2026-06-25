//#region src/utilities/datetime-utility.ts
var e = (e) => {
	let t = e instanceof Date ? e : new Date(e);
	return !isNaN(+t);
}, t = {
	last: (/* @__PURE__ */ new Date()).getTime(),
	log(e) {
		let t = (/* @__PURE__ */ new Date()).getTime(), n = e ? new Date(e).getTime() : this.last;
		return this.last = t, t - n;
	}
}, n = (e, t = 1e3) => {
	let n = {
		days: 0,
		hours: 0,
		minutes: 0,
		seconds: 0
	}, r = () => {
		let t = /* @__PURE__ */ new Date(), r = Math.abs(new Date(e).getTime() - t.getTime()) / 1e3;
		n.days = Math.floor(r / 86400), r -= n.days * 86400, n.hours = Math.floor(r / 3600) % 24, r -= n.hours * 3600, n.minutes = Math.floor(r / 60) % 60, r -= n.minutes * 60, n.seconds = Math.floor(r);
	};
	return setInterval(r, t), r(), n;
}, r = function(t) {
	if (!e(t)) return "";
	let n = -t.getTimezoneOffset(), r = n / 60, i = n % 60;
	return `${r >= 0 ? "+" : "-"}${Math.abs(r).toString().padStart(2, "0")}:${Math.abs(i).toString().padStart(2, "0")}`;
}, i = function(t) {
	if (!e(t)) return null;
	let n = t instanceof Date ? t : new Date(t), i = new Date(t instanceof Date ? t.getTime() : t), a = r(n);
	return i.setHours(n.getHours() + parseInt(a.split(":")[0])), `${i.toISOString().replace("Z", "")}${a}`;
}, a = {
	isValidDate: e,
	timer: t,
	countDown: n,
	stringifyDate: i
};
//#endregion
export { i as n, a as t };
