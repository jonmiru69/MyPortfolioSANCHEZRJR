import { Y as e, at as t, et as n, rt as r } from "./find-cursor-DBifiZop.js";
//#region packages/core/src/image/duotone-bitmap-by-path.ts
function i(e, t) {
	return t ? `${e}|duo:${t.clr1}:${t.clr2}` : e;
}
var a = /* @__PURE__ */ new WeakMap();
function o(e) {
	let t = a.get(e);
	return t || (t = /* @__PURE__ */ new Map(), a.set(e, t)), t;
}
async function s(r, a, s, c, l = {}) {
	let { offscreenFactory: u, ...d } = l, f = await t(r, a, c, d);
	if (!s || !f) return f;
	let p = o(c), m = i(r, s), h = p.get(m);
	return h || (h = (async () => {
		let { w: t, h: r } = n(f);
		return t <= 0 || r <= 0 ? f : await e(f, s, {
			width: t,
			height: r,
			offscreenFactory: u
		});
	})(), h.catch(() => p.delete(m)), h.then((e) => {
		e === f && p.delete(m);
	}).catch(() => {}), p.set(m, h)), h;
}
function c(e) {
	let t = a.get(e);
	if (t) {
		for (let n of t.values()) r(e, n);
		t.clear(), a.delete(e);
	}
}
//#endregion
//#region packages/core/src/nav/visible-index.ts
function l(e, t, n, r) {
	for (let i = e + t; i >= 0 && i < r; i += t) if (!n(i)) return i;
	return e;
}
function u(e, t, n) {
	if (n === 0 || !t(e)) return e;
	let r = l(e, 1, t, n);
	return r === e ? l(e, -1, t, n) : r;
}
function d(e, t) {
	let n = 0;
	for (let r = 0; r < t; r++) e(r) || n++;
	return n;
}
//#endregion
export { s as a, c as i, l as n, u as r, d as t };
