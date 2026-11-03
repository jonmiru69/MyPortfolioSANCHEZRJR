import { A as e, Ct as t, N as n, W as r, bt as i, k as a, ut as o } from "./find-cursor-DBifiZop.js";
//#region packages/core/src/fonts/symbol-font.ts
var s = {
	167: "♣",
	168: "♦",
	169: "♥",
	170: "♠",
	171: "↔",
	172: "←",
	173: "↑",
	174: "→",
	175: "↓",
	183: "•",
	184: "÷",
	185: "≠",
	180: "×",
	176: "°",
	177: "±",
	163: "≤",
	179: "≥"
}, c = {
	33: "✏",
	34: "✂",
	36: "👓",
	74: "☺",
	75: "😐",
	76: "☹",
	118: "❖",
	167: "▪",
	108: "●",
	110: "■",
	116: "◆",
	119: "◆",
	251: "✗",
	252: "✓",
	253: "☒",
	254: "☑",
	223: "←",
	224: "→",
	225: "↑",
	226: "↓",
	227: "↖",
	228: "↗",
	229: "↙",
	230: "↘"
};
function l(e) {
	let t = {};
	for (let n of Object.keys(e)) {
		let r = Number(n);
		t[r] = e[r], t[61440 + r] = e[r];
	}
	return t;
}
var u = l(s), d = l(c);
function f(e, t) {
	if (!t) return e;
	let n = t.trim().toLowerCase(), r = n === "wingdings" ? d : n === "symbol" ? u : null;
	return r ? r[e.charCodeAt(0)] ?? e : e;
}
function p(e) {
	if (!e) return !1;
	let t = e.toLowerCase();
	return t === "symbol" || t.includes("wingdings");
}
function m(e, t) {
	if (!p(t) || e.length === 0) return [{
		text: e,
		mapped: !1
	}];
	let n = [], r = "", i = null;
	for (let a of e) {
		let e = f(a, t), o = e !== a;
		i === null || o === i ? (i = o, r += e) : (n.push({
			text: r,
			mapped: i
		}), i = o, r = e);
	}
	return r.length > 0 && n.push({
		text: r,
		mapped: i ?? !1
	}), n;
}
//#endregion
//#region packages/core/src/shape/custGeom.ts
function h(e, t, n, r, i, a) {
	for (let o of t) {
		let t = 0, s = 0;
		for (let c of o) switch (c.cmd) {
			case "moveTo":
				e.moveTo(n + c.x * i, r + c.y * a), t = c.x, s = c.y;
				break;
			case "lineTo":
				e.lineTo(n + c.x * i, r + c.y * a), t = c.x, s = c.y;
				break;
			case "cubicBezTo":
				e.bezierCurveTo(n + c.x1 * i, r + c.y1 * a, n + c.x2 * i, r + c.y2 * a, n + c.x * i, r + c.y * a), t = c.x, s = c.y;
				break;
			case "arcTo": {
				let o = c.wr * i, l = c.hr * a;
				if (o <= 0 || l <= 0) break;
				let u = c.stAng * Math.PI / 180, d = c.swAng * Math.PI / 180, f = n + t * i, p = r + s * a, m = f - o * Math.cos(u), h = p - l * Math.sin(u), g = u + d;
				e.ellipse(m, h, o, l, 0, u, g, d < 0), t = (m + o * Math.cos(g) - n) / i, s = (h + l * Math.sin(g) - r) / a;
				break;
			}
			case "close":
				e.closePath();
				break;
		}
	}
}
//#endregion
//#region packages/core/src/shape/preset.ts
function g(e, t, n, r, i, a, o, s = -Math.PI / 2) {
	let c = a * 2;
	for (let l = 0; l < c; l++) {
		let c = s + l * Math.PI / a, u = l % 2 == 0 ? 1 : o, d = t + r * u * Math.cos(c), f = n + i * u * Math.sin(c);
		l === 0 ? e.moveTo(d, f) : e.lineTo(d, f);
	}
	e.closePath();
}
function _(e, t, n, r, i, a, o = -Math.PI / 2) {
	for (let s = 0; s < a; s++) {
		let c = o + s * 2 * Math.PI / a, l = t + r * Math.cos(c), u = n + i * Math.sin(c);
		s === 0 ? e.moveTo(l, u) : e.lineTo(l, u);
	}
	e.closePath();
}
function v(e, t, n, r, i, a, o) {
	let s = (e) => Math.atan2(r * Math.sin(e), i * Math.cos(e)), c = s(a), l = s(a + o), u = t - r * Math.cos(c), d = n - i * Math.sin(c);
	return e.ellipse(u, d, Math.abs(r), Math.abs(i), 0, c, l, o < 0), {
		x: u + r * Math.cos(l),
		y: d + i * Math.sin(l)
	};
}
var y = {
	oval: "ellipse",
	rtriangle: "rttriangle",
	roundrectangle: "roundrect",
	flowchartsumingjunction: "flowchartsummingjunction"
}, b = new Set(/* @__PURE__ */ "ellipse.rttriangle.triangle.diamond.trapezoid.roundrect.snip1rect.frame.irregularseal1.irregularseal2.star4.star8.star12.star16.star24.star32.line.straightconnector1.callout1.bordercallout1.leftuparrow.quadarrowcallout.mathequal.mathplus.mathminus.flowchartdecision.flowchartmanualinput.flowchartconnector.flowchartinputoutput.flowchartmerge.flowchartextract.flowchartpreparation.flowchartcollate".split(".")), x = new Set([
	"accentcallout1",
	"accentbordercallout1",
	"flowchartpredefinedprocess",
	"flowchartsort",
	"flowchartinternalstorage",
	"flowchartsummingjunction"
]), S = new Set([
	"round2samerect",
	"round2diagrect",
	"dodecagon",
	"star10"
]);
function C(e, t, n, r, i, a, s = null, c = null, l = null, u = null) {
	let d = n + i / 2, f = r + a / 2;
	{
		let d = t.toLowerCase(), f = y[d] ?? d;
		if ((b.has(f) || x.has(f) || S.has(f)) && o(e, f, n, r, i, a, [
			s,
			c,
			l,
			u
		])) return;
	}
	switch (t.toLowerCase()) {
		case "parallelogram": {
			let t = i * Math.min(.5, (s ?? 25e3) / 1e5);
			e.moveTo(n + t, r), e.lineTo(n + i, r), e.lineTo(n + i - t, r + a), e.lineTo(n, r + a), e.closePath();
			break;
		}
		case "pentagon":
			_(e, d, f, i / 2, a / 2, 5);
			break;
		case "hexagon":
			_(e, d, f, i / 2, a / 2, 6, 0);
			break;
		case "heptagon":
			_(e, d, f, i / 2, a / 2, 7);
			break;
		case "octagon":
			_(e, d, f, i / 2, a / 2, 8, -Math.PI / 8);
			break;
		case "decagon":
			_(e, d, f, i / 2, a / 2, 10);
			break;
		case "star5":
		case "star":
			g(e, d, f, i / 2, a / 2, 5, (s ?? 19098) / 5e4);
			break;
		case "star6":
			g(e, d, f, i / 2, a / 2, 6, (s ?? 28868) / 5e4, 0);
			break;
		case "star7":
			g(e, d, f, i / 2, a / 2, 7, (s ?? 34142) / 5e4);
			break;
		case "rightarrow": {
			let t = a * Math.min(1, (s ?? 5e4) / 1e5), o = i * Math.min(1, (c ?? 5e4) / 1e5), l = r + (a - t) / 2;
			e.moveTo(n, l), e.lineTo(n + i - o, l), e.lineTo(n + i - o, r), e.lineTo(n + i, f), e.lineTo(n + i - o, r + a), e.lineTo(n + i - o, l + t), e.lineTo(n, l + t), e.closePath();
			break;
		}
		case "leftarrow": {
			let t = a * Math.min(1, (s ?? 5e4) / 1e5), o = i * Math.min(1, (c ?? 5e4) / 1e5), l = r + (a - t) / 2;
			e.moveTo(n + i, l), e.lineTo(n + o, l), e.lineTo(n + o, r), e.lineTo(n, f), e.lineTo(n + o, r + a), e.lineTo(n + o, l + t), e.lineTo(n + i, l + t), e.closePath();
			break;
		}
		case "uparrow": {
			let t = i * Math.min(1, (s ?? 5e4) / 1e5), o = a * Math.min(1, (c ?? 5e4) / 1e5), l = n + (i - t) / 2;
			e.moveTo(d, r), e.lineTo(n + i, r + o), e.lineTo(l + t, r + o), e.lineTo(l + t, r + a), e.lineTo(l, r + a), e.lineTo(l, r + o), e.lineTo(n, r + o), e.closePath();
			break;
		}
		case "downarrow": {
			let t = i * Math.min(1, (s ?? 5e4) / 1e5), o = a * Math.min(1, (c ?? 5e4) / 1e5), l = n + (i - t) / 2;
			e.moveTo(d, r + a), e.lineTo(n + i, r + a - o), e.lineTo(l + t, r + a - o), e.lineTo(l + t, r), e.lineTo(l, r), e.lineTo(l, r + a - o), e.lineTo(n, r + a - o), e.closePath();
			break;
		}
		case "leftrightarrow": {
			let t = a * Math.min(1, (s ?? 5e4) / 1e5), o = i * Math.min(.5, (c ?? 25e3) / 1e5), l = r + (a - t) / 2;
			e.moveTo(n, f), e.lineTo(n + o, r), e.lineTo(n + o, l), e.lineTo(n + i - o, l), e.lineTo(n + i - o, r), e.lineTo(n + i, f), e.lineTo(n + i - o, r + a), e.lineTo(n + i - o, l + t), e.lineTo(n + o, l + t), e.lineTo(n + o, r + a), e.closePath();
			break;
		}
		case "updownarrow": {
			let t = i * Math.min(1, (s ?? 5e4) / 1e5), o = a * Math.min(.5, (c ?? 25e3) / 1e5), l = n + (i - t) / 2;
			e.moveTo(d, r), e.lineTo(n + i, r + o), e.lineTo(l + t, r + o), e.lineTo(l + t, r + a - o), e.lineTo(n + i, r + a - o), e.lineTo(d, r + a), e.lineTo(n, r + a - o), e.lineTo(l, r + a - o), e.lineTo(l, r + o), e.lineTo(n, r + o), e.closePath();
			break;
		}
		case "notchedrightarrow": {
			let t = a * Math.min(1, (s ?? 5e4) / 1e5), o = i * Math.min(1, (c ?? 35e3) / 1e5), l = r + (a - t) / 2, u = o * .43;
			e.moveTo(n, l), e.lineTo(n + i - o, l), e.lineTo(n + i - o, r), e.lineTo(n + i, f), e.lineTo(n + i - o, r + a), e.lineTo(n + i - o, l + t), e.lineTo(n, l + t), e.lineTo(n + u, f), e.closePath();
			break;
		}
		case "chevron": {
			let t = i * Math.min(1, Math.max(0, (s ?? 5e4) / 1e5));
			e.moveTo(n, r), e.lineTo(n + t, r), e.lineTo(n + i, f), e.lineTo(n + t, r + a), e.lineTo(n, r + a), t > 0 && e.lineTo(n + t, f), e.closePath();
			break;
		}
		case "homeplate": {
			let t = a * .4;
			e.moveTo(n, r), e.lineTo(n + i, r), e.lineTo(n + i, r + a - t), e.lineTo(d, r + a), e.lineTo(n, r + a - t), e.closePath();
			break;
		}
		case "leftbracket": {
			let t = Math.min(a * Math.min(5e4, Math.max(0, s ?? 8333)) / 1e5, a / 2);
			e.moveTo(n + i, r), e.quadraticCurveTo(n, r, n, r + t), a - 2 * t > .5 && e.lineTo(n, r + a - t), e.quadraticCurveTo(n, r + a, n + i, r + a);
			break;
		}
		case "rightbracket": {
			let t = Math.min(a * Math.min(5e4, Math.max(0, s ?? 8333)) / 1e5, a / 2);
			e.moveTo(n, r), e.quadraticCurveTo(n + i, r, n + i, r + t), a - 2 * t > .5 && e.lineTo(n + i, r + a - t), e.quadraticCurveTo(n + i, r + a, n, r + a);
			break;
		}
		case "leftbrace": {
			let t = f, o = i * .45;
			e.moveTo(n + i, r), e.bezierCurveTo(n + i - o, r, n + i - o, t - a * .08, n, t), e.bezierCurveTo(n + i - o, t + a * .08, n + i - o, r + a, n + i, r + a);
			break;
		}
		case "rightbrace": {
			let t = f, o = i * .45;
			e.moveTo(n, r), e.bezierCurveTo(n + o, r, n + o, t - a * .08, n + i, t), e.bezierCurveTo(n + o, t + a * .08, n + o, r + a, n, r + a);
			break;
		}
		case "wedgerectcallout": {
			e.rect(n, r, i, a * .8);
			let t = n + i * .2, o = r + a;
			e.moveTo(n + i * .1, r + a * .8), e.lineTo(t, o), e.lineTo(n + i * .3, r + a * .8), e.closePath();
			break;
		}
		case "wedgeellipsecallout": {
			let t = (s ?? -2e4) / 1e5 * i, n = (c ?? 12e4) / 1e5 * a, r = d + t, o = f + n;
			e.ellipse(d, f, i / 2, a / 2, 0, 0, Math.PI * 2);
			let l = Math.atan2(n, t), u = Math.PI / 10, p = i / 2, m = a / 2, h = d + p * Math.cos(l - u), g = f + m * Math.sin(l - u), _ = d + p * Math.cos(l + u), v = f + m * Math.sin(l + u);
			e.moveTo(h, g), e.lineTo(r, o), e.lineTo(_, v), e.closePath();
			break;
		}
		case "cloudcallout": {
			let t = Math.min(i, a) * .22, n = [
				[d - i * .25, r + a * .35],
				[d - i * .1, r + a * .15],
				[d + i * .1, r + a * .1],
				[d + i * .28, r + a * .2],
				[d + i * .35, r + a * .4]
			];
			e.moveTo(n[0][0] - t, n[0][1]);
			for (let [r, i] of n) e.arc(r, i, t, Math.PI, 0);
			e.arc(d, r + a * .65, i * .45, 0, Math.PI), e.closePath();
			let o = d + (s ?? -2e4) / 1e5 * i, l = f + (c ?? 12e4) / 1e5 * a;
			e.moveTo(d + i * .05, r + a * .8), e.arc(o, l, Math.min(i, a) * .07, 0, Math.PI * 2);
			break;
		}
		case "bentconnector2":
		case "bentconnector3":
		case "bentconnector4":
		case "bentconnector5":
		case "curvedconnector2":
		case "curvedconnector3":
		case "curvedconnector4":
		case "curvedconnector5":
			e.moveTo(n, r), e.lineTo(n + i, r + a);
			break;
		case "heart":
			e.moveTo(d, r + a * .32), e.bezierCurveTo(d, r, n + i * .05, r, n, r + a * .3), e.bezierCurveTo(n, r + a * .68, d - i * .05, r + a * .78, d, r + a), e.bezierCurveTo(d + i * .05, r + a * .78, n + i, r + a * .68, n + i, r + a * .3), e.bezierCurveTo(n + i - i * .05, r, d, r, d, r + a * .32);
			break;
		case "donut": {
			let t = i / 2, n = a / 2, r = Math.min(t, n) * (s ?? 25e3) / 1e5, o = t - r, c = n - r;
			e.ellipse(d, f, t, n, 0, 0, Math.PI * 2, !1), e.moveTo(d + o, f), e.ellipse(d, f, o, c, 0, 0, Math.PI * 2, !0);
			break;
		}
		case "nosmoking":
		case "nosmokingsign": {
			let t = (s ?? 18750) / 1e5, n = i / 2, r = a / 2, o = n * (1 - 2 * t), c = r * (1 - 2 * t);
			e.ellipse(d, f, n, r, 0, 0, Math.PI * 2, !1), e.moveTo(d + o, f), e.ellipse(d, f, o, c, 0, 0, Math.PI * 2, !0), e.moveTo(d + o, f), e.ellipse(d, f, o, c, 0, 0, Math.PI / 2, !1), e.lineTo(d - o, f), e.ellipse(d, f, o, c, 0, Math.PI, 3 * Math.PI / 2, !1), e.closePath();
			break;
		}
		case "pie": {
			let t = (s ?? 0) / 216e5 * Math.PI * 2, n = (c ?? 162e5) / 216e5 * Math.PI * 2;
			e.moveTo(d, f), e.arc(d, f, Math.min(i, a) / 2, t, n), e.closePath();
			break;
		}
		case "cloud": {
			let t = a * .28;
			e.arc(n + i * .25, r + a * .55, t, Math.PI, Math.PI * 1.8), e.arc(n + i * .45, r + a * .35, t * 1.1, Math.PI * 1.3, Math.PI * 1.9), e.arc(n + i * .65, r + a * .4, t, Math.PI * 1.5, Math.PI * 2), e.arc(n + i * .8, r + a * .6, t * .9, Math.PI * 1.6, Math.PI * .1), e.arc(n + i * .55, r + a * .75, t, 0, Math.PI * .7), e.arc(n + i * .25, r + a * .7, t * .9, 0, Math.PI), e.closePath();
			break;
		}
		case "funnel":
			e.moveTo(n, r), e.lineTo(n + i, r), e.lineTo(d + i * .15, r + a), e.lineTo(d - i * .15, r + a), e.closePath();
			break;
		case "smileyface": {
			e.ellipse(d, f, i / 2, a / 2, 0, 0, Math.PI * 2), e.closePath();
			let t = i * .05, n = a * .05, r = f - a * .12;
			e.moveTo(d - i * .2 + t, r), e.ellipse(d - i * .2, r, t, n, 0, 0, Math.PI * 2), e.moveTo(d + i * .2 + t, r), e.ellipse(d + i * .2, r, t, n, 0, 0, Math.PI * 2), e.moveTo(d - i * .25, f + a * .05), e.quadraticCurveTo(d, f + a * .3, d + i * .25, f + a * .05);
			break;
		}
		case "document":
		case "foldedcorner": {
			let t = Math.min(i, a) * .15;
			e.moveTo(n, r), e.lineTo(n + i - t, r), e.lineTo(n + i, r + t), e.lineTo(n + i, r + a), e.lineTo(n, r + a), e.closePath(), e.moveTo(n + i - t, r), e.lineTo(n + i - t, r + t), e.lineTo(n + i, r + t);
			break;
		}
		case "snip2samerect": {
			let t = Math.min(i, a) * Math.min(5e4, Math.max(0, s ?? 16667)) / 1e5;
			e.moveTo(n, r), e.lineTo(n + i - t, r), e.lineTo(n + i, r + t), e.lineTo(n + i, r + a), e.lineTo(n + t, r + a), e.lineTo(n, r + a - t), e.closePath();
			break;
		}
		case "snip2diagrect": {
			let t = Math.min(i, a) * Math.min(5e4, Math.max(0, s ?? 16667)) / 1e5;
			e.moveTo(n + t, r), e.lineTo(n + i - t, r), e.lineTo(n + i, r + t), e.lineTo(n + i, r + a - t), e.lineTo(n + i - t, r + a), e.lineTo(n + t, r + a), e.lineTo(n, r + a - t), e.lineTo(n, r + t), e.closePath();
			break;
		}
		case "sniproundrect": {
			let t = Math.min(i, a) * Math.min(5e4, Math.max(0, s ?? 16667)) / 1e5;
			e.moveTo(n + t, r), e.lineTo(n + i - t, r), e.lineTo(n + i, r + t), e.lineTo(n + i, r + a), e.lineTo(n, r + a), e.quadraticCurveTo(n, r, n + t, r), e.closePath();
			break;
		}
		case "round1rect": {
			let t = Math.min(i, a) * Math.min(5e4, Math.max(0, s ?? 16667)) / 1e5;
			e.moveTo(n + t, r), e.lineTo(n + i, r), e.lineTo(n + i, r + a), e.lineTo(n, r + a), e.lineTo(n, r + t), e.quadraticCurveTo(n, r, n + t, r), e.closePath();
			break;
		}
		case "plaque": {
			let t = Math.min(i, a) * .25;
			e.moveTo(n + t, r), e.lineTo(n + i - t, r), e.quadraticCurveTo(n + i, r, n + i, r + t), e.lineTo(n + i, r + a - t), e.quadraticCurveTo(n + i, r + a, n + i - t, r + a), e.lineTo(n + t, r + a), e.quadraticCurveTo(n, r + a, n, r + a - t), e.lineTo(n, r + t), e.quadraticCurveTo(n, r, n + t, r), e.closePath();
			break;
		}
		case "can": {
			let t = a * .1;
			e.ellipse(d, r + t, i / 2, t, 0, 0, Math.PI * 2), e.moveTo(n, r + t), e.lineTo(n, r + a - t), e.ellipse(d, r + a - t, i / 2, t, 0, Math.PI, 2 * Math.PI), e.lineTo(n + i, r + t);
			break;
		}
		case "cube": {
			let t = Math.min(i, a) * .2;
			e.moveTo(n + t, r), e.lineTo(n + i, r), e.lineTo(n + i, r + a - t), e.lineTo(n + i - t, r + a), e.lineTo(n, r + a), e.lineTo(n, r + t), e.closePath(), e.moveTo(n + t, r), e.lineTo(n + t, r + t), e.lineTo(n + i - t, r + t), e.moveTo(n + t, r + t), e.lineTo(n, r + t);
			break;
		}
		case "bevel": {
			let t = Math.min(i, a) * .1;
			e.rect(n, r, i, a), e.moveTo(n, r), e.lineTo(n + t, r + t), e.lineTo(n + i - t, r + t), e.lineTo(n + i, r), e.moveTo(n + i - t, r + t), e.lineTo(n + i - t, r + a - t), e.lineTo(n + i, r + a), e.moveTo(n + i - t, r + a - t), e.lineTo(n + t, r + a - t), e.lineTo(n, r + a), e.moveTo(n + t, r + a - t), e.lineTo(n + t, r + t);
			break;
		}
		case "halfframe": {
			let t = Math.min(i, a) * .25;
			e.moveTo(n, r), e.lineTo(n + i, r), e.lineTo(n + i, r + t), e.lineTo(n + t, r + t), e.lineTo(n + t, r + a), e.lineTo(n, r + a), e.closePath();
			break;
		}
		case "corner": {
			let t = Math.min(i, a) * .25;
			e.moveTo(n, r), e.lineTo(n + i, r), e.lineTo(n + i, r + t), e.lineTo(n + t, r + t), e.lineTo(n + t, r + a), e.lineTo(n, r + a), e.closePath();
			break;
		}
		case "flowchartalternateprocess":
		case "flowchartprocess": {
			let t = Math.min(i, a) * Math.min(5e4, Math.max(0, s ?? 16667)) / 1e5;
			e.roundRect(n, r, i, a, [{
				x: t,
				y: t
			}]);
			break;
		}
		case "flowchartterminator": {
			let t = Math.min(i, a) / 2;
			e.roundRect(n, r, i, a, [{
				x: t,
				y: t
			}]);
			break;
		}
		case "flowchartdocument": {
			let t = a * .1;
			e.moveTo(n, r), e.lineTo(n + i, r), e.lineTo(n + i, r + a - t), e.bezierCurveTo(n + i * .75, r + a, n + i * .25, r + a - t * 2, n, r + a - t), e.closePath();
			break;
		}
		case "moon":
			e.arc(d, f, Math.min(i, a) / 2, -Math.PI / 2, Math.PI / 2), e.arc(d - i * .2, f, Math.min(i, a) / 2, Math.PI / 2, -Math.PI / 2, !0), e.closePath();
			break;
		case "arc": {
			let t = 216e5, n = (s ?? 162e5) / t * Math.PI * 2, r = (c ?? 54e5) / t * Math.PI * 2;
			e.ellipse(d, f, i / 2, a / 2, 0, n, n + r, r < 0);
			break;
		}
		case "mathmultiply": {
			let t = Math.min(i, a) * Math.min(51965, Math.max(0, s ?? 23520)) / 1e5, o = Math.atan2(a, i), c = Math.sin(o), l = Math.cos(o), u = t / 2 * c, d = t / 2 * l;
			e.moveTo(n + u, r - d), e.lineTo(n - u, r + d), e.lineTo(n + i - u, r + a + d), e.lineTo(n + i + u, r + a - d), e.closePath(), e.moveTo(n + i - u, r - d), e.lineTo(n + i + u, r + d), e.lineTo(n + u, r + a + d), e.lineTo(n - u, r + a - d), e.closePath();
			break;
		}
		case "mathdivide": {
			let t = Math.min(36745, Math.max(1e3, s ?? 23520)), n = (73490 + -t) / 4, o = 36745 * i / a, u = Math.min(Math.min(n, o), Math.max(1e3, l ?? 11760)), p = 73490 + 4 * u - t, m = Math.min(p, Math.max(0, c ?? 5880)), h = a * t / 2e5, g = a * m / 1e5, _ = a * u / 1e5, v = i * 73490 / 2e5, y = f - h, b = f + h, x = y - (g + _) - _, S = r + a - x, C = d - v, w = d + v;
			e.rect(C, y, w - C, b - y), e.moveTo(d + _, x + _), e.arc(d, x + _, _, 0, Math.PI * 2), e.moveTo(d + _, S - _), e.arc(d, S - _, _, 0, Math.PI * 2);
			break;
		}
		case "quadarrow": {
			let t = i * (s ?? 23e3) / 1e5, o = i * (c ?? 3e4) / 1e5, l = n + (i - t) / 2, u = r + (a - t) / 2;
			e.moveTo(d, r), e.lineTo(n + i - o, r + o), e.lineTo(n + i - o, u), e.lineTo(l + t, u), e.lineTo(l + t, r + o), e.lineTo(n + o, r + o), e.lineTo(n + i, f), e.lineTo(n + i - o, r + a - o), e.lineTo(l + t, r + a - o), e.lineTo(l + t, u + t), e.lineTo(n + i - o, u + t), e.lineTo(n + i - o, r + a - o), e.lineTo(d, r + a), e.lineTo(n + o, r + a - o), e.lineTo(n + o, u + t), e.lineTo(l, u + t), e.lineTo(l, r + a - o), e.lineTo(n, f), e.lineTo(n + o, r + o), e.lineTo(l, r + o), e.lineTo(l, u), e.lineTo(n + o, u), e.closePath();
			break;
		}
		case "wave": {
			let t = a * (s ?? 12500) / 1e5, o = r + t, c = r + a - t;
			e.moveTo(n, o), e.bezierCurveTo(n + i * .25, r, n + i * .25, r + t * 2, n + i * .5, o), e.bezierCurveTo(n + i * .75, r + t * 2, n + i * .75, r, n + i, o), e.lineTo(n + i, c), e.bezierCurveTo(n + i * .75, r + a, n + i * .75, r + a - t * 2, n + i * .5, c), e.bezierCurveTo(n + i * .25, r + a - t * 2, n + i * .25, r + a, n, c), e.closePath();
			break;
		}
		case "doublewave": {
			let t = a * (s ?? 6250) / 1e5, o = r + t, c = r + a - t;
			e.moveTo(n, o), e.bezierCurveTo(n + i * .25, r, n + i * .25, r + t * 2, n + i * .5, o), e.bezierCurveTo(n + i * .75, r + t * 2, n + i * .75, r, n + i, o), e.lineTo(n + i, c), e.bezierCurveTo(n + i * .75, r + a, n + i * .75, r + a - t * 2, n + i * .5, c), e.bezierCurveTo(n + i * .25, r + a - t * 2, n + i * .25, r + a, n, c), e.closePath();
			break;
		}
		case "sun": {
			let t = Math.min(i, a) / 2, n = t * ((s ?? 25e3) / 1e5 + .5), r = Math.min(n, t * .9), o = Math.PI / 16;
			for (let n = 0; n < 8; n++) {
				let i = n / 8 * Math.PI * 2;
				e.moveTo(d + r * Math.cos(i - o), f + r * Math.sin(i - o)), e.lineTo(d + t * Math.cos(i), f + t * Math.sin(i)), e.lineTo(d + r * Math.cos(i + o), f + r * Math.sin(i + o)), e.closePath();
			}
			e.moveTo(d + r, f), e.arc(d, f, r, 0, Math.PI * 2);
			break;
		}
		case "lightningbolt":
			e.moveTo(d + i * .1, r), e.lineTo(n, f - a * .05), e.lineTo(d + i * .05, f - a * .05), e.lineTo(d - i * .1, r + a), e.lineTo(n + i, f + a * .05), e.lineTo(d - i * .05, f + a * .05), e.closePath();
			break;
		case "bracketpair": {
			let t = a * Math.min(5e4, Math.max(0, s ?? 8333)) / 1e5;
			e.moveTo(n + i * .4, r), e.quadraticCurveTo(n, r, n, r + t), a - 2 * t > 0 && e.lineTo(n, r + a - t), e.quadraticCurveTo(n, r + a, n + i * .4, r + a), e.moveTo(n + i * .6, r), e.quadraticCurveTo(n + i, r, n + i, r + t), a - 2 * t > 0 && e.lineTo(n + i, r + a - t), e.quadraticCurveTo(n + i, r + a, n + i * .6, r + a);
			break;
		}
		case "bracepair": {
			let t = i * .2;
			e.moveTo(n + i * .4, r), e.bezierCurveTo(n + i * .4 - t, r, n + i * .4 - t, f - a * .08, n, f), e.bezierCurveTo(n + i * .4 - t, f + a * .08, n + i * .4 - t, r + a, n + i * .4, r + a), e.moveTo(n + i * .6, r), e.bezierCurveTo(n + i * .6 + t, r, n + i * .6 + t, f - a * .08, n + i, f), e.bezierCurveTo(n + i * .6 + t, f + a * .08, n + i * .6 + t, r + a, n + i * .6, r + a);
			break;
		}
		case "chord": {
			let t = (s ?? 27e5) / 216e5 * Math.PI * 2, n = (c ?? 162e5) / 216e5 * Math.PI * 2;
			e.ellipse(d, f, i / 2, a / 2, 0, t, n), e.closePath();
			break;
		}
		case "blockarc": {
			let t = Math.min(i, a) / 2, n = s ?? 108e5, r = c ?? 0, o = t * (1 - (l ?? 25e3) / 1e5), u = n / 216e5 * Math.PI * 2, p = r / 216e5 * Math.PI * 2;
			e.arc(d, f, t, u, p, !1), e.arc(d, f, o, p, u, !0), e.closePath();
			break;
		}
		case "teardrop": {
			let t = Math.min(i, a) * .4, o = n + t, s = r + a - t;
			e.arc(o, s, t, 0, Math.PI * 2 * .75), e.bezierCurveTo(o - t * .1, s - t, n + i - t, r + t, n + i, r), e.bezierCurveTo(n + i - t * .2, r + t * .5, o + t, s - t * 1.1, o + t, s), e.closePath();
			break;
		}
		case "diagstripe": {
			let t = a * (s ?? 5e4) / 1e5 * i / a;
			e.moveTo(n + t, r), e.lineTo(n + i, r), e.lineTo(n + i - t, r + a), e.lineTo(n, r + a), e.closePath();
			break;
		}
		case "wedgeroundrectcallout": {
			let t = Math.min(i, a) * .1;
			e.roundRect(n, r, i, a * .85, t), e.moveTo(n + i * .1, r + a * .85), e.lineTo(n + i * .2, r + a), e.lineTo(n + i * .3, r + a * .85), e.closePath();
			break;
		}
		case "rightarrowcallout": {
			let t = a * (s ?? 5e4) / 1e5, o = i * (c ?? 5e4) / 1e5, l = r + (a - t) / 2;
			e.rect(n, l, o, t), e.moveTo(n + o, r), e.lineTo(n + i, f), e.lineTo(n + o, r + a), e.closePath();
			break;
		}
		case "leftarrowcallout": {
			let t = a * (s ?? 5e4) / 1e5, o = i * (c ?? 5e4) / 1e5, l = r + (a - t) / 2;
			e.rect(n + i - o, l, o, t), e.moveTo(n + i - o, r), e.lineTo(n, f), e.lineTo(n + i - o, r + a), e.closePath();
			break;
		}
		case "uparrowcallout": {
			let t = i * (s ?? 5e4) / 1e5, o = a * (c ?? 5e4) / 1e5, l = n + (i - t) / 2;
			e.rect(l, r + o, t, a - o), e.moveTo(n, r + o), e.lineTo(d, r), e.lineTo(n + i, r + o), e.closePath();
			break;
		}
		case "downarrowcallout": {
			let t = i * (s ?? 5e4) / 1e5, o = a * (c ?? 5e4) / 1e5, l = n + (i - t) / 2;
			e.rect(l, r, t, a - o), e.moveTo(n, r + a - o), e.lineTo(d, r + a), e.lineTo(n + i, r + a - o), e.closePath();
			break;
		}
		case "leftrightarrowcallout": {
			let t = a * (s ?? 5e4) / 1e5, o = i * (c ?? 25e3) / 1e5, l = r + (a - t) / 2;
			e.rect(n + o, l, i - 2 * o, t), e.moveTo(n + o, r), e.lineTo(n, f), e.lineTo(n + o, r + a), e.closePath(), e.moveTo(n + i - o, r), e.lineTo(n + i, f), e.lineTo(n + i - o, r + a), e.closePath();
			break;
		}
		case "leftrightuparrow": {
			let t = i * (s ?? 25e3) / 1e5, o = a * (c ?? 3e4) / 1e5, l = n + (i - t) / 2;
			e.moveTo(d, r), e.lineTo(n + i, r + o), e.lineTo(l + t, r + o), e.lineTo(l + t, r + a), e.lineTo(l, r + a), e.lineTo(l, r + o), e.lineTo(n, r + o), e.closePath();
			break;
		}
		case "uturnarrow": {
			let t = i * (s ?? 25e3) / 1e5, o = (i - t) / 2, c = Math.max(0, o - t), l = n + t + o, u = r + t + o, d = t * 2, f = r + a - t * 2.5;
			e.moveTo(n, r + a), e.lineTo(n, u), e.arc(l, u, o, Math.PI, 0), e.lineTo(n + i, f), e.lineTo(n + i + (d - t) / 2, f), e.lineTo(l + t / 2, r + a), e.lineTo(n + i - (d - t) / 2 - t, f), e.lineTo(n + i - t, f), e.lineTo(n + i - t, u), e.arc(l, u, c, 0, Math.PI, !0), e.lineTo(n + t, r + a), e.closePath();
			break;
		}
		case "bentarrow":
		case "bentuparrow": {
			let t = Math.min(i, a) * .25;
			e.moveTo(n, f - t / 2), e.lineTo(n + i - t * 2, f - t / 2), e.lineTo(n + i - t * 2, r + t), e.lineTo(n + i, f), e.lineTo(n + i - t * 2, r + a - t), e.lineTo(n + i - t * 2, f + t / 2), e.lineTo(n, f + t / 2), e.closePath();
			break;
		}
		case "plus": {
			let t = Math.min(i, a) * (s ?? 25e3) / 1e5;
			e.rect(d - t, r, 2 * t, a), e.rect(n, f - t, i, 2 * t);
			break;
		}
		case "mathnotequal": {
			let t = Math.min(5e4, Math.max(0, s ?? 23520)), n = Math.min(66e5, Math.max(42e5, c ?? 66e5)), o = Math.min(1e5 - 2 * t, Math.max(0, l ?? 11760)), u = a * t / 1e5, p = a * o / 2e5, m = i * 73490 / 2e5, h = a / 2, g = (n / 6e4 - 90) * Math.PI / 180, _ = h * Math.tan(g), v = Math.hypot(_, h) * u / h;
			e.rect(d - m, f - p - u, 2 * m, u), e.rect(d - m, f + p, 2 * m, u), e.moveTo(d + _ - v / 2, r), e.lineTo(d + _ + v / 2, r), e.lineTo(d - _ + v / 2, r + a), e.lineTo(d - _ - v / 2, r + a), e.closePath();
			break;
		}
		case "flowchartdelay": {
			let t = a / 2;
			e.moveTo(n, r), e.lineTo(n + i - t, r), e.arc(n + i - t, f, t, -Math.PI / 2, Math.PI / 2), e.lineTo(n, r + a), e.closePath();
			break;
		}
		case "flowchartdisplay": {
			let t = i * .2, o = i * .15;
			e.moveTo(n + t, r), e.lineTo(n + i - o, r), e.arc(n + i - o, f, a / 2, -Math.PI / 2, Math.PI / 2), e.lineTo(n + t, r + a), e.lineTo(n, f), e.closePath();
			break;
		}
		case "flowchartpunchedcard": {
			let t = i * .2;
			e.moveTo(n + t, r), e.lineTo(n + i, r), e.lineTo(n + i - t, r + a), e.lineTo(n, r + a), e.closePath();
			break;
		}
		case "flowchartoffpageconnector": {
			let t = a * .3;
			e.moveTo(n, r), e.lineTo(n + i, r), e.lineTo(n + i, r + a - t), e.lineTo(d, r + a), e.lineTo(n, r + a - t), e.closePath();
			break;
		}
		case "flowchartonlinestorage":
		case "flowchartmanuallabel":
		case "flowchartpuncheddisk":
			e.rect(n, r, i, a);
			break;
		case "horizontalscroll": {
			let t = Math.min(i, a) * .15;
			e.roundRect(n + t, r, i - t, a, t), e.moveTo(n + t, r + t * 2), e.arc(n + t, r + t, t, Math.PI / 2, Math.PI * 2.5);
			break;
		}
		case "verticalscroll": {
			let t = Math.min(i, a) * .15;
			e.roundRect(n, r + t, i, a - t, t), e.moveTo(n + t * 2, r + t), e.arc(n + t, r + t, t, 0, Math.PI * 2);
			break;
		}
		case "ribbon": {
			let t = Math.min(33333, Math.max(0, s ?? 16667)), o = i * Math.min(75e3, Math.max(25e3, c ?? 5e4)) / 2e5, l = i / 8, u = i / 32, d = i / 2 - o, f = i / 2 + o, p = d + u, m = f - u, h = d + l, g = f - l, _ = h - u, v = g + u, y = i - l, b = a * t / 2e5, x = a * t / 1e5, S = a - x, C = S / 2;
			e.moveTo(n, r), e.lineTo(n + _, r), e.lineTo(n + p, r + b), e.lineTo(n + m, r + x), e.lineTo(n + v, r + b), e.lineTo(n + i, r), e.lineTo(n + y, r + C), e.lineTo(n + i, r + S), e.lineTo(n + f, r + S), e.lineTo(n + f, r + a), e.lineTo(n + p, r + a), e.lineTo(n + d, r + S), e.lineTo(n, r + S), e.lineTo(n + l, r + C), e.closePath();
			break;
		}
		case "ribbon2": {
			let t = Math.min(33333, Math.max(0, s ?? 16667)), o = i * Math.min(75e3, Math.max(25e3, c ?? 5e4)) / 2e5, l = i / 8, u = i / 32, d = i / 2 - o, f = i / 2 + o, p = d + u, m = f - u, h = d + l, g = f - l, _ = h - u, v = g + u, y = i - l, b = a * t / 2e5, x = a * t / 1e5, S = a - b, C = a - x, w = x, T = (w + a) / 2;
			e.moveTo(n, r + a), e.lineTo(n + _, r + a), e.lineTo(n + p, r + S), e.lineTo(n + m, r + C), e.lineTo(n + v, r + S), e.lineTo(n + i, r + a), e.lineTo(n + y, r + T), e.lineTo(n + i, r + w), e.lineTo(n + f, r + w), e.lineTo(n + f, r), e.lineTo(n + p, r), e.lineTo(n + d, r + w), e.lineTo(n, r + w), e.lineTo(n + l, r + T), e.closePath();
			break;
		}
		case "ellipseribbon": {
			let t = Math.min(1e5, Math.max(0, s ?? 25e3)), o = Math.min(75e3, Math.max(25e3, c ?? 5e4)), u = Math.max(0, t - (1e5 - t) / 2), d = Math.min(t, Math.max(u, l ?? 12500)), f = i / 8, p = i * o / 2e5, m = i / 2 - p, h = m + f, g = i - h, _ = i - m, v = i - f, y = a * d / 1e5, b = 4 * y / i, x = b * (h - h * h / i), S = h / 2, C = b * S, w = i - S, T = a * t / 1e5, E = T - y, D = b * (m - m * m / i), O = D + E, k = y + E - O + y + E, A = a - T, j = (y * 14 / 16 + A) / 2, M = D + A, N = O + A, P = m / 2, F = b * P + A, I = i - P, L = k + A;
			e.moveTo(n, r), e.quadraticCurveTo(n + S, r + C, n + h, r + x), e.lineTo(n + m, r + O), e.quadraticCurveTo(n + i / 2, r + k, n + _, r + O), e.lineTo(n + g, r + x), e.quadraticCurveTo(n + w, r + C, n + i, r), e.lineTo(n + v, r + j), e.lineTo(n + i, r + A), e.quadraticCurveTo(n + I, r + F, n + _, r + M), e.lineTo(n + _, r + N), e.quadraticCurveTo(n + i / 2, r + L, n + m, r + N), e.lineTo(n + m, r + M), e.quadraticCurveTo(n + P, r + F, n, r + A), e.lineTo(n + f, r + j), e.closePath();
			break;
		}
		case "ellipseribbon2": {
			let t = Math.min(1e5, Math.max(0, s ?? 25e3)), o = Math.min(75e3, Math.max(25e3, c ?? 5e4)), u = Math.max(0, t - (1e5 - t) / 2), d = Math.min(t, Math.max(u, l ?? 12500)), f = i / 8, p = i * o / 2e5, m = i / 2 - p, h = m + f, g = i - h, _ = i - m, v = i - f, y = a * d / 1e5, b = 4 * y / i, x = a - b * (h - h * h / i), S = h / 2, C = a - b * S, w = i - S, T = a * t / 1e5, E = T - y, D = b * (m - m * m / i), O = D + E, k = a - O, A = y + E - O + y + E, j = a - A, M = a - T, N = a - (y * 14 / 16 + M) / 2, P = a - (D + M), F = a - (O + M), I = m / 2, L = a - (b * I + M), R = i - I, z = a - (A + M);
			e.moveTo(n, r + a), e.quadraticCurveTo(n + S, r + C, n + h, r + x), e.lineTo(n + m, r + k), e.quadraticCurveTo(n + i / 2, r + j, n + _, r + k), e.lineTo(n + g, r + x), e.quadraticCurveTo(n + w, r + C, n + i, r + a), e.lineTo(n + v, r + N), e.lineTo(n + i, r + T), e.quadraticCurveTo(n + R, r + L, n + _, r + P), e.lineTo(n + _, r + F), e.quadraticCurveTo(n + i / 2, r + z, n + m, r + F), e.lineTo(n + m, r + P), e.quadraticCurveTo(n + I, r + L, n, r + T), e.lineTo(n + f, r + N), e.closePath();
			break;
		}
		case "circulararrow": {
			let t = (c ?? 0) / 6e4 * Math.PI / 180, n = (s ?? 162e5) / 6e4 * Math.PI / 180, r = (l ?? 5e4) / 1e5, o = Math.min(i, a) / 2, u = o * (1 - r), p = (o + u) / 2, m = o - u, h = t + n;
			e.arc(d, f, o, t, h, !1), e.arc(d, f, u, h, t, !0), e.closePath();
			let g = Math.sin(h), _ = -Math.cos(h), v = m * 1.5, y = d + p * Math.cos(h) + v * g, b = f + p * Math.sin(h) + v * _;
			e.moveTo(y, b), e.lineTo(d + o * Math.cos(h), f + o * Math.sin(h)), e.lineTo(d + u * Math.cos(h), f + u * Math.sin(h)), e.closePath();
			break;
		}
		case "curvedrightarrow": {
			let t = Math.min(i, a), o = a / 2, u = 5e4 * a / t, d = Math.min(u, Math.max(0, c ?? 5e4)), f = t * Math.min(d, Math.max(0, s ?? 25e3)) / 1e5, p = t * d / 1e5, m = o - (f + p) / 4, h = (2 * m) ** 2 - f ** 2, g = 1e5 * (Math.sqrt(Math.max(0, h)) * i / (2 * m)) / t, _ = t * Math.min(g, Math.max(0, l ?? 25e3)) / 1e5, y = Math.sqrt(Math.max(0, i * i - _ * _)) * m / i, b = m + f, x = m + y, S = b + y, C = (p - f) / 2, w = x - C, T = S + C, E = a - p / 2, D = i - _, O = Math.atan2(_, y), k = -O, A = Math.PI - O;
			e.moveTo(n, r + m), v(e, n, r + m, i, m, Math.PI, k), e.lineTo(n + D, r + w), e.lineTo(n + i, r + E), e.lineTo(n + D, r + T), e.lineTo(n + D, r + S), v(e, n + D, r + S, i, m, A, O), e.closePath();
			break;
		}
		case "curvedleftarrow": {
			let t = Math.min(i, a), o = a / 2, u = 5e4 * a / t, d = Math.min(u, Math.max(0, c ?? 5e4)), f = t * Math.min(d, Math.max(0, s ?? 25e3)) / 1e5, p = t * d / 1e5, m = o - (f + p) / 4, h = (2 * m) ** 2 - f ** 2, g = Math.sqrt(Math.max(0, h)) * i / (2 * m), _ = 1e5 * g / t, y = t * Math.min(_, Math.max(0, l ?? 25e3)) / 1e5, b = Math.sqrt(Math.max(0, i * i - y * y)) * m / i, x = m + f, S = m + b, C = x + b, w = (p - f) / 2, T = S - w, E = C + w, D = a - p / 2, O = y, k = Math.atan2(y, b), A = f / 2, j = Math.atan2(A, g), M = j - k, N = k - j, P = -j;
			e.moveTo(n, r + D), e.lineTo(n + O, r + T), e.lineTo(n + O, r + S);
			let F = v(e, n + O, r + S, i, m, k, M);
			v(e, F.x, F.y, i, m, P, N), e.lineTo(n + O, r + E), e.closePath();
			break;
		}
		case "curveduparrow": {
			let t = Math.min(i, a), o = i / 2, u = 5e4 * i / t, d = Math.min(u, Math.max(0, c ?? 5e4)), f = t * Math.min(1e5, Math.max(0, s ?? 25e3)) / 1e5, p = t * d / 1e5, m = o - (f + p) / 4, h = (2 * m) ** 2 - f ** 2, g = Math.sqrt(Math.max(0, h)) * a / (2 * m), _ = 1e5 * g / t, y = t * Math.min(_, Math.max(0, l ?? 25e3)) / 1e5, b = Math.sqrt(Math.max(0, a * a - y * y)) * m / a, x = m + f, S = m + b, C = x + b, w = (p - f) / 2, T = S - w, E = C + w, D = i - p / 2, O = y, k = Math.atan2(y, b), A = f / 2, j = Math.atan2(A, g), M = j - k, N = k - j, P = Math.PI / 2 - k, F = Math.PI / 2 - j;
			e.moveTo(n + D, r), e.lineTo(n + E, r + O), e.lineTo(n + C, r + O);
			let I = v(e, n + C, r + O, m, a, P, N);
			v(e, I.x, I.y, m, a, F, M), e.lineTo(n + T, r + O), e.closePath();
			break;
		}
		case "curveddownarrow": {
			let t = Math.min(i, a), o = i / 2, u = 5e4 * i / t, d = Math.min(u, Math.max(0, c ?? 5e4)), f = t * Math.min(1e5, Math.max(0, s ?? 25e3)) / 1e5, p = t * d / 1e5, m = o - (f + p) / 4, h = (2 * m) ** 2 - f ** 2, g = Math.sqrt(Math.max(0, h)) * a / (2 * m), _ = 1e5 * g / t, y = t * Math.min(_, Math.max(0, l ?? 25e3)) / 1e5, b = Math.sqrt(Math.max(0, a * a - y * y)) * m / a, x = m + f, S = m + b, C = x + b, w = (p - f) / 2, T = S - w, E = C + w, D = i - p / 2, O = a - y, k = Math.atan2(y, b), A = f / 2, j = Math.atan2(A, g), M = 3 * Math.PI / 2 + k;
			3 * Math.PI / 2 - j, j - Math.PI / 2, Math.PI / 2 - j, e.moveTo(n + D, r + a), e.lineTo(n + T, r + O), e.lineTo(n + S, r + O), v(e, n + S, r + O, m, a, M, -k), e.lineTo(n + x, r), v(e, n + x, r, m, a, 3 * Math.PI / 2, k), e.lineTo(n + E, r + O), e.closePath();
			break;
		}
		case "stripedrightarrow": {
			let t = Math.min(i, a), o = t / 32, l = t / 16, u = t / 8, d = t * (s ?? 5e4) / 1e5, p = i * (c ?? 5e4) / 1e5, m = f - d / 2, h = f + d / 2, g = n + i - p;
			e.rect(n, m, o, d), e.rect(n + l, m, l, d), e.rect(n + u, m, u, d), e.moveTo(g, m), e.lineTo(g, r), e.lineTo(n + i, f), e.lineTo(g, r + a), e.lineTo(g, h), e.lineTo(n + u * 2, h), e.lineTo(n + u * 2, m), e.closePath();
			break;
		}
		case "flowchartmagneticdisk": {
			let t = a * .15;
			e.moveTo(n, r + t), e.ellipse(d, r + t, i / 2, t, 0, Math.PI, 0), e.lineTo(n + i, r + a - t), e.ellipse(d, r + a - t, i / 2, t, 0, 0, Math.PI), e.lineTo(n, r + t), e.closePath(), e.moveTo(n + i, r + t), e.ellipse(d, r + t, i / 2, t, 0, 0, Math.PI);
			break;
		}
		case "flowchartmagneticdrum": {
			let t = i * .15;
			e.moveTo(n + t, r), e.lineTo(n + i, r), e.lineTo(n + i, r + a), e.lineTo(n + t, r + a), e.ellipse(n + t, f, t, a / 2, 0, Math.PI / 2, -Math.PI / 2, !0), e.closePath(), e.moveTo(n + i, r), e.ellipse(n + i, f, t, a / 2, 0, -Math.PI / 2, Math.PI / 2);
			break;
		}
		case "flowchartmagnetictape": {
			let t = Math.min(i, a) / 2, n = d + t * .5;
			e.moveTo(d, r + a), e.arc(d, f, t, Math.PI / 2, Math.PI / 2 + Math.PI * 2 * .875), e.lineTo(n, f + t * .5), e.lineTo(n, r + a), e.closePath();
			break;
		}
		case "flowchartpunchedtape": {
			let t = a * .12;
			e.moveTo(n, r), e.lineTo(n + i, r), e.lineTo(n + i, r + a - t), e.bezierCurveTo(n + i * .75, r + a, n + i * .25, r + a - t * 2, n, r + a - t), e.closePath(), e.moveTo(n, r + t), e.bezierCurveTo(n + i * .25, r, n + i * .75, r + t * 2, n + i, r + t);
			break;
		}
		case "flowchartmanualoperation": {
			let t = i * .15;
			e.moveTo(n + t, r), e.lineTo(n + i - t, r), e.lineTo(n + i, r + a), e.lineTo(n, r + a), e.closePath();
			break;
		}
		case "flowchartmultidocument": {
			let t = a * .1, o = i * .04;
			e.rect(n + o * 2, r - a * .08, i - o * 2, a * .1), e.rect(n + o, r - a * .04, i - o, a * .06), e.moveTo(n, r), e.lineTo(n + i, r), e.lineTo(n + i, r + a - t), e.bezierCurveTo(n + i * .75, r + a, n + i * .25, r + a - t * 2, n, r + a - t), e.closePath();
			break;
		}
		case "rttriangle":
			e.moveTo(n, r), e.lineTo(n, r + a), e.lineTo(n + i, r + a), e.closePath();
			break;
		default:
			e.rect(n, r, i, a);
			break;
	}
}
//#endregion
//#region packages/core/src/shape/arrow.ts
function w(e, t, n) {
	let r = Math.max(.5, t.width * n), i = e.w === "sm" ? 4 : e.w === "lg" ? 8 : 6, a = e.len === "sm" ? 4 : e.len === "lg" ? 8 : 6;
	return {
		lw: r,
		halfW: r * i / 2,
		len: r * a
	};
}
var T = new Set([
	"triangle",
	"stealth",
	"diamond",
	"oval"
]);
function E(e, t, n) {
	return T.has(e.type) ? w(e, t, n).len : 0;
}
function D(e, t, n) {
	if (n <= 0) return {
		x: e.x,
		y: e.y
	};
	let r = t.x - e.x, i = t.y - e.y, a = Math.hypot(r, i);
	if (a < 1e-9) return {
		x: e.x,
		y: e.y
	};
	let o = Math.min(n, a) / a;
	return {
		x: e.x + r * o,
		y: e.y + i * o
	};
}
function O(e, t, n, r, a, o, s) {
	if (a.type === "none") return;
	let { lw: c, halfW: l, len: u } = w(a, o, s), d = i(o.color);
	switch (e.save(), e.translate(t, n), e.rotate(r), e.fillStyle = d, e.strokeStyle = d, e.lineWidth = c, e.setLineDash([]), e.beginPath(), a.type) {
		case "triangle":
		case "stealth":
			e.moveTo(0, 0), e.lineTo(-u, -l), e.lineTo(-u, l), e.closePath(), e.fill();
			break;
		case "arrow":
			e.moveTo(0, 0), e.lineTo(-u, -l), e.moveTo(0, 0), e.lineTo(-u, l), e.stroke();
			break;
		case "diamond":
			e.moveTo(0, 0), e.lineTo(-u / 2, -l), e.lineTo(-u, 0), e.lineTo(-u / 2, l), e.closePath(), e.fill();
			break;
		case "oval":
			e.ellipse(-u / 2, 0, u / 2, l, 0, 0, Math.PI * 2), e.fill();
			break;
	}
	e.restore();
}
//#endregion
//#region packages/core/src/text/underline.ts
function k(e, n, i, a, o, s, c, l = 1) {
	let u = Math.max(1, o * .05), d = c === "heavy" || (c?.endsWith("Heavy") ?? !1) ? u * 1.8 : u, f = i + Math.max(2, d), p = r(f, d, l);
	if (e.strokeStyle = s, e.lineWidth = d, e.setLineDash([]), c && c.startsWith("wavy")) {
		let t = d, r = d * 6;
		e.beginPath(), e.moveTo(n, f);
		let i = Math.max(1, d * .5);
		for (let o = 0; o <= a; o += i) {
			let i = f + Math.sin(o / r * Math.PI * 2) * t;
			e.lineTo(n + o, i);
		}
		if (e.stroke(), c === "wavyDbl") {
			e.beginPath(), e.moveTo(n, f + t * 2.5);
			for (let o = 0; o <= a; o += i) {
				let i = f + t * 2.5 + Math.sin(o / r * Math.PI * 2) * t;
				e.lineTo(n + o, i);
			}
			e.stroke();
		}
		return;
	}
	if (c === "dbl") {
		let t = d * 1.4, i = f - t / 2, o = f + t / 2;
		e.beginPath(), e.moveTo(n, i + r(i, d, l)), e.lineTo(n + a, i + r(i, d, l)), e.moveTo(n, o + r(o, d, l)), e.lineTo(n + a, o + r(o, d, l)), e.stroke();
		return;
	}
	e.setLineDash(t(c ?? "sng", d)), e.beginPath(), e.moveTo(n, f + p), e.lineTo(n + a, f + p), e.stroke(), e.setLineDash([]);
}
//#endregion
//#region packages/core/src/text/line-distribute.ts
var A = (e) => e === 32 || e === 12288;
function j(t, r, i = {}) {
	if (Math.abs(r) <= .5) return null;
	let o = i.firstContentSi ?? 0, s = i.lastDrawnSi ?? t.length - 1, c = i.minPerGap ?? -Infinity, l = i.isGapChar ?? n, u = i.isWhitespace ?? A, d = i.seaClusterGaps ?? !1, f = [];
	for (let e = o; e < t.length; e++) {
		let n = t[e];
		if (n === void 0) continue;
		if (n.text === void 0) {
			f.push({
				si: e,
				off: 0,
				ws: !1
			});
			continue;
		}
		let r = 0;
		for (let t of n.text) {
			let n = t.codePointAt(0);
			f.push({
				si: e,
				off: r,
				cp: n,
				ws: u(n)
			}), r++;
		}
	}
	let p = -1, m = -1;
	for (let e = 0; e < f.length; e++) f[e].ws || (p === -1 && (p = e), m = e);
	if (p === -1 || p === m) return null;
	let h = Array(f.length).fill(!1), g = 0;
	for (let t = p; t < m; t++) {
		let n = f[t];
		if (n.si === s) continue;
		if (n.ws) {
			h[t] = !0, g++;
			continue;
		}
		let r = f[t + 1];
		if (r.ws) continue;
		let i = n.cp, o = r.cp;
		(i !== void 0 && l(i) || o !== void 0 && l(o) || d && i !== void 0 && o !== void 0 && e(i) && e(o) && !a(o)) && (h[t] = !0, g++);
	}
	if (g === 0) return null;
	let _ = r / g;
	r < 0 && _ < c && (_ = c);
	let v = /* @__PURE__ */ new Map();
	for (let e of f) e.cp !== void 0 && v.set(e.si, (v.get(e.si) ?? 0) + 1);
	let y = /* @__PURE__ */ new Map();
	for (let e = 0; e < f.length; e++) {
		if (!h[e]) continue;
		let t = f[e], n = y.get(t.si);
		n || (n = {
			splitBefore: [],
			trailingGap: !1,
			internalStretch: 0
		}, y.set(t.si, n));
		let r = v.get(t.si) ?? 0;
		t.cp === void 0 || t.off === r - 1 ? n.trailingGap = !0 : (n.splitBefore.push(t.off + 1), n.internalStretch += _);
	}
	return {
		perGap: _,
		perSeg: y
	};
}
//#endregion
//#region packages/core/src/text/justify-positions.ts
function M(e, t, n, r, i = 0) {
	let a = [], o = 0, s = 0;
	for (let c of t) a.push({
		text: e.slice(o, c).join(""),
		dx: r(e.slice(0, o).join("")) + o * i + s * n
	}), o = c, s++;
	return a.push({
		text: e.slice(o).join(""),
		dx: r(e.slice(0, o).join("")) + o * i + s * n
	}), a;
}
//#endregion
//#region packages/core/src/layout/virtual-scroll.ts
function N(e, t, n) {
	return e < t ? t : e > n ? n : e;
}
function P(e, t, n, r, i, a) {
	let o = e.length;
	if (o === 0) return {
		start: 0,
		end: -1,
		topIndex: 0,
		offsets: [],
		totalHeight: 0
	};
	let s = a?.leading ?? 0, c = a?.trailing ?? 0, l = Array(o), u = 0;
	for (let n = 0; n < o; n++) l[n] = s + u + n * t, u += e[n];
	let d = s + u + (o - 1) * t + c, f = 0, p = o;
	for (; f < p;) {
		let e = f + p >>> 1;
		l[e] <= n ? f = e + 1 : p = e;
	}
	let m = N(f - 1, 0, o - 1), h = n + r;
	for (f = 0, p = o; f < p;) {
		let e = f + p >>> 1;
		l[e] < h ? f = e + 1 : p = e;
	}
	let g = N(f - 1, 0, o - 1);
	return {
		start: N(m - i, 0, o - 1),
		end: N(g + i, 0, o - 1),
		topIndex: m,
		offsets: l,
		totalHeight: d
	};
}
//#endregion
//#region packages/core/src/search/highlight-rect.ts
function F(e, t, n, r) {
	let i = t <= 0 ? 0 : r(e.slice(0, t)), a = n >= e.length ? r(e) : r(e.slice(0, n));
	return {
		x: i,
		width: Math.max(0, a - i)
	};
}
function I(e, t) {
	return t > 0 ? `${e / t * 100}%` : "0%";
}
//#endregion
export { j as a, E as c, h as d, p as f, M as i, D as l, m, F as n, k as o, f as p, P as r, O as s, I as t, C as u };
