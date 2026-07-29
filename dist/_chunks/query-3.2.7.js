import { n as e } from "./datetime-utility-3.2.7.js";
//#region src/vue/http/query.ts
var t = (t) => t instanceof Date ? e(t) : String(t);
function n(e) {
	let n = new URLSearchParams();
	return Object.entries(e || {}).forEach(([e, r]) => {
		if (Array.isArray(r)) r.forEach((r) => {
			let i = t(r);
			i !== void 0 && n.append(e, i);
		});
		else {
			let i = t(r);
			i !== void 0 && n.append(e, i);
		}
	}), n;
}
//#endregion
export { n as t };
