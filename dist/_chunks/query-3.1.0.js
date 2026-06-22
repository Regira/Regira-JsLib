//#region src/vue/http/query.ts
function e(e) {
	let t = new URLSearchParams();
	return Object.entries(e || {}).forEach(([e, n]) => {
		Array.isArray(n) ? n.forEach((n) => t.append(e, n)) : t.append(e, n);
	}), t;
}
//#endregion
export { e as t };
