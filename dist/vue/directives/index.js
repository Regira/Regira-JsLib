//#region src/vue/directives/click-outside.ts
var e = {
	beforeMount: (e, t) => {
		e.clickOutsideEvent = (n) => {
			e == n.target || e.contains(n.target) || typeof t.value == "function" && t.value(n);
		}, document.addEventListener("click", e.clickOutsideEvent);
	},
	unmounted: (e) => {
		document.removeEventListener("click", e.clickOutsideEvent);
	}
}, t = { install(t) {
	t.directive("clickOutside", e);
} }, n = { mounted: (e) => {
	setTimeout(() => e.focus(), 250);
} }, r = { install(e) {
	e.directive("focus", n);
} }, i = { maxGrow: 7 }, a;
function o(e) {
	return e * parseFloat(getComputedStyle(document.documentElement).fontSize);
}
function s(e) {
	let t = e.target, n = t.value, r = n?.split("\n").length || 0;
	if (r > 1 && r <= a.maxGrow) {
		let e = r * 1.75;
		o(e) > t.offsetHeight && (t.style.minHeight = e + "rem");
	} else n == "" && (t.style.minHeight = "");
}
var c = {
	beforeMount(e) {
		e.addEventListener("input", s);
	},
	unmounted: (e) => {
		e.removeEventListener("input", s);
	}
}, l = { install(e, t = i) {
	a = t, e.directive("grow", c);
} };
//#endregion
export { t as clickOutside, r as focus, l as grow };
