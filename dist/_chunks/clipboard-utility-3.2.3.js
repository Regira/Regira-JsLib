//#region src/utilities/html-utility.ts
var e = (e, t = 0) => {
	let n = document.createElement("meta");
	n.setAttribute("http-equiv", "Refresh"), n.setAttribute("content", `${t}; url=${e}`), document.head.appendChild(n);
}, t = (e) => {
	let t = 0, n = 0, r = e;
	for (; r;) t += r.scrollTop || 0, n += r.scrollLeft || 0, r = r.parentElement;
	return {
		top: t,
		left: n
	};
}, n = {
	redirect: e,
	setMetaTag: (e, t) => {
		let n = document.getElementsByName(e)[0];
		if (n == null) {
			let e = Array.from(document.head.childNodes).filter((e) => e.tagName === "META").slice(-1)[0];
			n = document.createElement("meta"), e == null ? document.head.appendChild(n) : e.insertAdjacentElement("afterend", n);
		}
		n.setAttribute("name", e), n.setAttribute("content", t);
	},
	setCanonicalTag: (e) => {
		let t = document.querySelector("[rel=canonical]");
		if (t == null) {
			let e = Array.from(document.head.childNodes).filter((e) => e.tagName === "META").slice(-1)[0];
			t = document.createElement("link"), e == null ? document.head.appendChild(t) : e.insertAdjacentElement("afterend", t);
		}
		t.setAttribute("rel", "canonical"), t.setAttribute("href", e);
	}
};
//#endregion
//#region src/utilities/clipboard-utility.ts
function r(e) {
	let t = document.createElement("textarea");
	t.value = e, t.style.top = "0", t.style.left = "0", t.style.position = "fixed", document.body.appendChild(t), t.focus(), t.select();
	let n = document.execCommand("copy");
	return document.body.removeChild(t), Promise.resolve(n);
}
function i(e) {
	return navigator.clipboard ? navigator.clipboard.writeText(e) : r(e);
}
//#endregion
export { e as i, t as n, n as r, i as t };
