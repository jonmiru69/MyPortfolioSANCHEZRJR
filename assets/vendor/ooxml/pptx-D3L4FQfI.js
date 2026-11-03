import { At as e, B as t, Bt as n, C as r, E as i, Ft as a, G as o, H as s, Ht as c, I as l, It as u, J as d, Jt as f, K as p, L as m, Lt as h, M as g, Mt as _, N as v, Nt as y, O as b, Pt as x, Q as S, S as C, T as w, Tt as T, U as E, Ut as D, V as O, W as k, X as A, Xt as j, Yt as M, Z as N, _ as P, _t as F, at as I, b as L, bt as R, c as z, ct as B, d as V, dt as H, f as U, ft as W, gt as ee, h as te, ht as ne, i as re, it as ie, j as ae, kt as G, l as oe, lt as se, m as ce, mt as le, n as ue, nt as de, o as fe, ot as pe, p as me, pt as he, q as ge, qt as _e, r as ve, s as ye, st as be, t as xe, tt as Se, u as Ce, ut as we, v as Te, vt as Ee, w as De, x as Oe, xt as ke, y as Ae, z as je, zt as Me } from "./find-cursor-DBifiZop.js";
import { a as Ne, c as Pe, d as Fe, f as Ie, i as Le, l as Re, n as ze, o as Be, p as Ve, r as He, s as Ue, t as K, u as We } from "./highlight-rect-DTgfiJgA.js";
import { a as Ge, i as Ke, n as qe, r as Je, t as Ye } from "./visible-index-DSN5XPnm.js";
import { t as Xe } from "./mathjax-Dk_JzbFj.js";
//#region packages/core/src/shape/custgeom-endpoints.ts
var q = 1e-9;
function Ze(e) {
	return e.cmd === "lineTo" || e.cmd === "cubicBezTo" || e.cmd === "arcTo";
}
function Qe(e, t, n, r) {
	let i = n === 0 ? 0 : n, a = r === 0 ? 0 : r;
	return {
		x: e,
		y: t,
		dx: i,
		dy: a,
		angle: Math.atan2(a, i)
	};
}
function $e(e, t, n) {
	switch (n.cmd) {
		case "lineTo": return {
			dx: n.x - e,
			dy: n.y - t
		};
		case "cubicBezTo": {
			let r = n.x1 - e, i = n.y1 - t;
			return Math.abs(r) < q && Math.abs(i) < q && (r = n.x2 - e, i = n.y2 - t), Math.abs(r) < q && Math.abs(i) < q && (r = n.x - e, i = n.y - t), {
				dx: r,
				dy: i
			};
		}
		case "arcTo": {
			let e = n.stAng * Math.PI / 180, t = n.swAng < 0 ? -1 : 1;
			return {
				dx: -n.wr * Math.sin(e) * t,
				dy: n.hr * Math.cos(e) * t
			};
		}
		default: return {
			dx: 0,
			dy: 0
		};
	}
}
function et(e, t, n) {
	switch (n.cmd) {
		case "moveTo":
		case "lineTo":
		case "cubicBezTo": return {
			x: n.x,
			y: n.y
		};
		case "arcTo": {
			if (n.wr <= 0 || n.hr <= 0) return {
				x: e,
				y: t
			};
			let r = n.stAng * Math.PI / 180, i = r + n.swAng * Math.PI / 180, a = e - n.wr * Math.cos(r), o = t - n.hr * Math.sin(r);
			return {
				x: a + n.wr * Math.cos(i),
				y: o + n.hr * Math.sin(i)
			};
		}
		default: return {
			x: e,
			y: t
		};
	}
}
function tt(e, t, n) {
	let { x: r, y: i } = et(e, t, n);
	switch (n.cmd) {
		case "lineTo": return {
			dx: n.x - e,
			dy: n.y - t,
			x: r,
			y: i
		};
		case "cubicBezTo": {
			let a = n.x - n.x2, o = n.y - n.y2;
			return Math.abs(a) < q && Math.abs(o) < q && (a = n.x - n.x1, o = n.y - n.y1), Math.abs(a) < q && Math.abs(o) < q && (a = n.x - e, o = n.y - t), {
				dx: a,
				dy: o,
				x: r,
				y: i
			};
		}
		case "arcTo": {
			if (n.wr <= 0 || n.hr <= 0) return {
				dx: 0,
				dy: 0,
				x: r,
				y: i
			};
			let e = n.stAng * Math.PI / 180 + n.swAng * Math.PI / 180, t = n.swAng < 0 ? -1 : 1;
			return {
				dx: -n.wr * Math.sin(e) * t,
				dy: n.hr * Math.cos(e) * t,
				x: r,
				y: i
			};
		}
		default: return {
			dx: 0,
			dy: 0,
			x: r,
			y: i
		};
	}
}
function nt(e) {
	let t = 0, n = 0, r = !1;
	for (let i of e) i.cmd === "moveTo" && (r = !0), {x: t, y: n} = et(t, n, i);
	return r ? {
		x: t,
		y: n
	} : null;
}
function rt(e) {
	if (e.some((e) => e.cmd === "close")) return !0;
	let t = e.find((e) => e.cmd === "moveTo");
	if (!t) return !1;
	let n = nt(e);
	return !n || !e.some(Ze) ? !1 : Math.abs(n.x - t.x) < q && Math.abs(n.y - t.y) < q;
}
function it(e) {
	let t = {
		start: null,
		end: null
	};
	if (!e || e.length === 0) return t;
	let n = e[0];
	if (n && n.length > 0 && !rt(n)) {
		let e = n.find((e) => e.cmd === "moveTo"), r = n.find(Ze);
		if (e && r) {
			let n = $e(e.x, e.y, r);
			(Math.abs(n.dx) > q || Math.abs(n.dy) > q) && (t.start = Qe(e.x, e.y, -n.dx, -n.dy));
		}
	}
	let r = e[e.length - 1];
	if (r && r.length > 0 && !rt(r)) {
		let e = 0, n = 0, i = -1;
		for (let e = 0; e < r.length; e++) Ze(r[e]) && (i = e);
		if (i >= 0) {
			for (let t = 0; t < i; t++) ({x: e, y: n} = et(e, n, r[t]));
			let a = tt(e, n, r[i]);
			(Math.abs(a.dx) > q || Math.abs(a.dy) > q) && (t.end = Qe(a.x, a.y, a.dx, a.dy));
		}
	}
	return t;
}
var at = {
	textarchdown: {
		adj: [["adj", "val 0"]],
		gd: [
			["adval", "pin 0 adj 21599999"],
			["v1", "+- 10800000 0 adval"],
			["v2", "+- 32400000 0 adval"],
			["nv1", "+- 0 0 v1"],
			["stAng", "?: nv1 v2 v1"],
			["w1", "+- 5400000 0 adval"],
			["w2", "+- 16200000 0 adval"],
			["d1", "+- adval 0 stAng"],
			["d2", "+- d1 0 21600000"],
			["v3", "+- 0 0 10800000"],
			["c2", "?: w2 d1 d2"],
			["c1", "?: v1 d2 c2"],
			["c0", "?: w1 d1 c1"],
			["swAng", "?: stAng c0 v3"],
			["wt1", "sin wd2 adj"],
			["ht1", "cos hd2 adj"],
			["dx1", "cat2 wd2 ht1 wt1"],
			["dy1", "sat2 hd2 ht1 wt1"],
			["x1", "+- hc dx1 0"],
			["y1", "+- vc dy1 0"],
			["wt2", "sin wd2 stAng"],
			["ht2", "cos hd2 stAng"],
			["dx2", "cat2 wd2 ht2 wt2"],
			["dy2", "sat2 hd2 ht2 wt2"],
			["x2", "+- hc dx2 0"],
			["y2", "+- vc dy2 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x2",
				"y2"
			], [
				"a",
				"wd2",
				"hd2",
				"stAng",
				"swAng"
			]]
		}]
	},
	textarchdownpour: {
		adj: [["adj1", "val 0"], ["adj2", "val 25000"]],
		gd: [
			["adval", "pin 0 adj1 21599999"],
			["v1", "+- 10800000 0 adval"],
			["v2", "+- 32400000 0 adval"],
			["nv1", "+- 0 0 v1"],
			["stAng", "?: nv1 v2 v1"],
			["w1", "+- 5400000 0 adval"],
			["w2", "+- 16200000 0 adval"],
			["d1", "+- adval 0 stAng"],
			["d2", "+- d1 0 21600000"],
			["v3", "+- 0 0 10800000"],
			["c2", "?: w2 d1 d2"],
			["c1", "?: v1 d2 c2"],
			["c0", "?: w1 d1 c1"],
			["swAng", "?: stAng c0 v3"],
			["wt1", "sin wd2 stAng"],
			["ht1", "cos hd2 stAng"],
			["dx1", "cat2 wd2 ht1 wt1"],
			["dy1", "sat2 hd2 ht1 wt1"],
			["x1", "+- hc dx1 0"],
			["y1", "+- vc dy1 0"],
			["adval2", "pin 0 adj2 99000"],
			["ratio", "*/ adval2 1 100000"],
			["iwd2", "*/ wd2 ratio 1"],
			["ihd2", "*/ hd2 ratio 1"],
			["wt2", "sin iwd2 adval"],
			["ht2", "cos ihd2 adval"],
			["dx2", "cat2 iwd2 ht2 wt2"],
			["dy2", "sat2 ihd2 ht2 wt2"],
			["x2", "+- hc dx2 0"],
			["y2", "+- vc dy2 0"],
			["wt3", "sin iwd2 stAng"],
			["ht3", "cos ihd2 stAng"],
			["dx3", "cat2 iwd2 ht3 wt3"],
			["dy3", "sat2 ihd2 ht3 wt3"],
			["x3", "+- hc dx3 0"],
			["y3", "+- vc dy3 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x3",
				"y3"
			], [
				"a",
				"iwd2",
				"ihd2",
				"stAng",
				"swAng"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x1",
				"y1"
			], [
				"a",
				"wd2",
				"hd2",
				"stAng",
				"swAng"
			]]
		}]
	},
	textarchup: {
		adj: [["adj", "val cd2"]],
		gd: [
			["adval", "pin 0 adj 21599999"],
			["v1", "+- 10800000 0 adval"],
			["v2", "+- 32400000 0 adval"],
			["end", "?: v1 v1 v2"],
			["w1", "+- 5400000 0 adval"],
			["w2", "+- 16200000 0 adval"],
			["d1", "+- end 0 adval"],
			["d2", "+- 21600000 d1 0"],
			["c2", "?: w2 d1 d2"],
			["c1", "?: v1 d2 c2"],
			["swAng", "?: w1 d1 c1"],
			["wt1", "sin wd2 adj"],
			["ht1", "cos hd2 adj"],
			["dx1", "cat2 wd2 ht1 wt1"],
			["dy1", "sat2 hd2 ht1 wt1"],
			["x1", "+- hc dx1 0"],
			["y1", "+- vc dy1 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x1",
				"y1"
			], [
				"a",
				"wd2",
				"hd2",
				"adval",
				"swAng"
			]]
		}]
	},
	textarchuppour: {
		adj: [["adj1", "val cd2"], ["adj2", "val 50000"]],
		gd: [
			["adval", "pin 0 adj1 21599999"],
			["v1", "+- 10800000 0 adval"],
			["v2", "+- 32400000 0 adval"],
			["end", "?: v1 v1 v2"],
			["w1", "+- 5400000 0 adval"],
			["w2", "+- 16200000 0 adval"],
			["d1", "+- end 0 adval"],
			["d2", "+- 21600000 d1 0"],
			["c2", "?: w2 d1 d2"],
			["c1", "?: v1 d2 c2"],
			["swAng", "?: w1 d1 c1"],
			["wt1", "sin wd2 adval"],
			["ht1", "cos hd2 adval"],
			["dx1", "cat2 wd2 ht1 wt1"],
			["dy1", "sat2 hd2 ht1 wt1"],
			["x1", "+- hc dx1 0"],
			["y1", "+- vc dy1 0"],
			["adval2", "pin 0 adj2 99000"],
			["ratio", "*/ adval2 1 100000"],
			["iwd2", "*/ wd2 ratio 1"],
			["ihd2", "*/ hd2 ratio 1"],
			["wt2", "sin iwd2 adval"],
			["ht2", "cos ihd2 adval"],
			["dx2", "cat2 iwd2 ht2 wt2"],
			["dy2", "sat2 ihd2 ht2 wt2"],
			["x2", "+- hc dx2 0"],
			["y2", "+- vc dy2 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x1",
				"y1"
			], [
				"a",
				"wd2",
				"hd2",
				"adval",
				"swAng"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x2",
				"y2"
			], [
				"a",
				"iwd2",
				"ihd2",
				"adval",
				"swAng"
			]]
		}]
	},
	textbutton: {
		adj: [["adj", "val 10800000"]],
		gd: [
			["adval", "pin 0 adj 21599999"],
			["bot", "+- 5400000 0 adval"],
			["lef", "+- 10800000 0 adval"],
			["top", "+- 16200000 0 adval"],
			["rig", "+- 21600000 0 adval"],
			["c3", "?: top adval 0"],
			["c2", "?: lef 10800000 c3"],
			["c1", "?: bot rig c2"],
			["stAng", "?: adval c1 0"],
			["w1", "+- 21600000 0 stAng"],
			["stAngB", "?: stAng w1 0"],
			["td1", "*/ bot 2 1"],
			["td2", "*/ top 2 1"],
			["ntd2", "+- 0 0 td2"],
			["w2", "+- 0 0 10800000"],
			["c6", "?: top ntd2 w2"],
			["c5", "?: lef 10800000 c6"],
			["c4", "?: bot td1 c5"],
			["v1", "?: adval c4 10800000"],
			["swAngT", "+- 0 0 v1"],
			["stT", "?: lef stAngB stAng"],
			["stB", "?: lef stAng stAngB"],
			["swT", "?: lef v1 swAngT"],
			["swB", "?: lef swAngT v1"],
			["wt1", "sin wd2 stT"],
			["ht1", "cos hd2 stT"],
			["dx1", "cat2 wd2 ht1 wt1"],
			["dy1", "sat2 hd2 ht1 wt1"],
			["x1", "+- hc dx1 0"],
			["y1", "+- vc dy1 0"],
			["wt2", "sin wd2 stB"],
			["ht2", "cos hd2 stB"],
			["dx2", "cat2 wd2 ht2 wt2"],
			["dy2", "sat2 hd2 ht2 wt2"],
			["x2", "+- hc dx2 0"],
			["y2", "+- vc dy2 0"],
			["wt3", "sin wd2 adj"],
			["ht3", "cos hd2 adj"],
			["dx3", "cat2 wd2 ht3 wt3"],
			["dy3", "sat2 hd2 ht3 wt3"],
			["x3", "+- hc dx3 0"],
			["y3", "+- vc dy3 0"]
		],
		paths: [
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"x1",
					"y1"
				], [
					"a",
					"wd2",
					"hd2",
					"stT",
					"swT"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"l",
					"vc"
				], [
					"l",
					"r",
					"vc"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"x2",
					"y2"
				], [
					"a",
					"wd2",
					"hd2",
					"stB",
					"swB"
				]]
			}
		]
	},
	textbuttonpour: {
		adj: [["adj1", "val cd2"], ["adj2", "val 50000"]],
		gd: [
			["adval", "pin 0 adj1 21599999"],
			["bot", "+- 5400000 0 adval"],
			["lef", "+- 10800000 0 adval"],
			["top", "+- 16200000 0 adval"],
			["rig", "+- 21600000 0 adval"],
			["c3", "?: top adval 0"],
			["c2", "?: lef 10800000 c3"],
			["c1", "?: bot rig c2"],
			["stAng", "?: adval c1 0"],
			["w1", "+- 21600000 0 stAng"],
			["stAngB", "?: stAng w1 0"],
			["td1", "*/ bot 2 1"],
			["td2", "*/ top 2 1"],
			["ntd2", "+- 0 0 td2"],
			["w2", "+- 0 0 10800000"],
			["c6", "?: top ntd2 w2"],
			["c5", "?: lef 10800000 c6"],
			["c4", "?: bot td1 c5"],
			["v1", "?: adval c4 10800000"],
			["swAngT", "+- 0 0 v1"],
			["stT", "?: lef stAngB stAng"],
			["stB", "?: lef stAng stAngB"],
			["swT", "?: lef v1 swAngT"],
			["swB", "?: lef swAngT v1"],
			["wt1", "sin wd2 stT"],
			["ht1", "cos hd2 stT"],
			["dx1", "cat2 wd2 ht1 wt1"],
			["dy1", "sat2 hd2 ht1 wt1"],
			["x1", "+- hc dx1 0"],
			["y1", "+- vc dy1 0"],
			["wt6", "sin wd2 stB"],
			["ht6", "cos hd2 stB"],
			["dx6", "cat2 wd2 ht6 wt6"],
			["dy6", "sat2 hd2 ht6 wt6"],
			["x6", "+- hc dx6 0"],
			["y6", "+- vc dy6 0"],
			["adval2", "pin 40000 adj2 99000"],
			["ratio", "*/ adval2 1 100000"],
			["iwd2", "*/ wd2 ratio 1"],
			["ihd2", "*/ hd2 ratio 1"],
			["wt2", "sin iwd2 stT"],
			["ht2", "cos ihd2 stT"],
			["dx2", "cat2 iwd2 ht2 wt2"],
			["dy2", "sat2 ihd2 ht2 wt2"],
			["x2", "+- hc dx2 0"],
			["y2", "+- vc dy2 0"],
			["wt5", "sin iwd2 stB"],
			["ht5", "cos ihd2 stB"],
			["dx5", "cat2 iwd2 ht5 wt5"],
			["dy5", "sat2 ihd2 ht5 wt5"],
			["x5", "+- hc dx5 0"],
			["y5", "+- vc dy5 0"],
			["d1", "+- hd2 0 ihd2"],
			["d12", "*/ d1 1 2"],
			["yu", "+- vc 0 d12"],
			["yd", "+- vc d12 0"],
			["v1", "*/ d12 d12 1"],
			["v2", "*/ ihd2 ihd2 1"],
			["v3", "*/ v1 1 v2"],
			["v4", "+- 1 0 v3"],
			["v5", "*/ iwd2 iwd2 1"],
			["v6", "*/ v4 v5 1"],
			["v7", "sqrt v6"],
			["xl", "+- hc 0 v7"],
			["xr", "+- hc v7 0"],
			["wtadj", "sin iwd2 adj1"],
			["htadj", "cos ihd2 adj1"],
			["dxadj", "cat2 iwd2 htadj wtadj"],
			["dyadj", "sat2 ihd2 htadj wtadj"],
			["xadj", "+- hc dxadj 0"],
			["yadj", "+- vc dyadj 0"]
		],
		paths: [
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"x1",
					"y1"
				], [
					"a",
					"wd2",
					"hd2",
					"stT",
					"swT"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"x2",
					"y2"
				], [
					"a",
					"iwd2",
					"ihd2",
					"stT",
					"swT"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"xl",
					"yu"
				], [
					"l",
					"xr",
					"yu"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"xl",
					"yd"
				], [
					"l",
					"xr",
					"yd"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"x5",
					"y5"
				], [
					"a",
					"iwd2",
					"ihd2",
					"stB",
					"swB"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"x6",
					"y6"
				], [
					"a",
					"wd2",
					"hd2",
					"stB",
					"swB"
				]]
			}
		]
	},
	textcandown: {
		adj: [["adj", "val 14286"]],
		gd: [
			["a", "pin 0 adj 33333"],
			["dy", "*/ a h 100000"],
			["y0", "+- t dy 0"],
			["y1", "+- b 0 dy"],
			["ncd2", "*/ cd2 -1 1"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"t"
			], [
				"a",
				"wd2",
				"dy",
				"cd2",
				"ncd2"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y1"
			], [
				"a",
				"wd2",
				"dy",
				"cd2",
				"ncd2"
			]]
		}]
	},
	textcanup: {
		adj: [["adj", "val 85714"]],
		gd: [
			["a", "pin 66667 adj 100000"],
			["dy1", "*/ a h 100000"],
			["dy", "+- h 0 dy1"],
			["y0", "+- t dy1 0"],
			["y1", "+- t dy 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y1"
			], [
				"a",
				"wd2",
				"dy",
				"cd2",
				"cd2"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"b"
			], [
				"a",
				"wd2",
				"dy",
				"cd2",
				"cd2"
			]]
		}]
	},
	textcascadedown: {
		adj: [["adj", "val 44444"]],
		gd: [
			["a", "pin 28570 adj 100000"],
			["dy", "*/ a h 100000"],
			["y1", "+- t dy 0"],
			["dy2", "+- h 0 dy"],
			["dy3", "*/ dy2 1 4"],
			["y2", "+- t dy3 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"t"
			], [
				"l",
				"r",
				"y2"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y1"
			], [
				"l",
				"r",
				"b"
			]]
		}]
	},
	textcascadeup: {
		adj: [["adj", "val 44444"]],
		gd: [
			["a", "pin 28570 adj 100000"],
			["dy", "*/ a h 100000"],
			["y1", "+- t dy 0"],
			["dy2", "+- h 0 dy"],
			["dy3", "*/ dy2 1 4"],
			["y2", "+- t dy3 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y2"
			], [
				"l",
				"r",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"b"
			], [
				"l",
				"r",
				"y1"
			]]
		}]
	},
	textchevron: {
		adj: [["adj", "val 25000"]],
		gd: [
			["a", "pin 0 adj 50000"],
			["y", "*/ a h 100000"],
			["y1", "+- t b y"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"l",
					"y"
				],
				[
					"l",
					"hc",
					"t"
				],
				[
					"l",
					"r",
					"y"
				]
			]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"l",
					"b"
				],
				[
					"l",
					"hc",
					"y1"
				],
				[
					"l",
					"r",
					"b"
				]
			]
		}]
	},
	textchevroninverted: {
		adj: [["adj", "val 75000"]],
		gd: [
			["a", "pin 50000 adj 100000"],
			["y", "*/ a h 100000"],
			["y1", "+- b 0 y"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"l",
					"t"
				],
				[
					"l",
					"hc",
					"y1"
				],
				[
					"l",
					"r",
					"t"
				]
			]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"l",
					"y"
				],
				[
					"l",
					"hc",
					"b"
				],
				[
					"l",
					"r",
					"y"
				]
			]
		}]
	},
	textcircle: {
		adj: [["adj", "val 10800000"]],
		gd: [
			["adval", "pin 0 adj 21599999"],
			["d0", "+- adval 0 10800000"],
			["d1", "+- 10800000 0 adval"],
			["d2", "+- 21600000 0 adval"],
			["d3", "?: d1 d1 10799999"],
			["d4", "?: d0 d2 d3"],
			["swAng", "*/ d4 2 1"],
			["wt1", "sin wd2 adj"],
			["ht1", "cos hd2 adj"],
			["dx1", "cat2 wd2 ht1 wt1"],
			["dy1", "sat2 hd2 ht1 wt1"],
			["x1", "+- hc dx1 0"],
			["y1", "+- vc dy1 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x1",
				"y1"
			], [
				"a",
				"wd2",
				"hd2",
				"adval",
				"swAng"
			]]
		}]
	},
	textcirclepour: {
		adj: [["adj1", "val cd2"], ["adj2", "val 50000"]],
		gd: [
			["adval", "pin 0 adj1 21599999"],
			["d0", "+- adval 0 10800000"],
			["d1", "+- 10800000 0 adval"],
			["d2", "+- 21600000 0 adval"],
			["d3", "?: d1 d1 10799999"],
			["d4", "?: d0 d2 d3"],
			["swAng", "*/ d4 2 1"],
			["wt1", "sin wd2 adval"],
			["ht1", "cos hd2 adval"],
			["dx1", "cat2 wd2 ht1 wt1"],
			["dy1", "sat2 hd2 ht1 wt1"],
			["x1", "+- hc dx1 0"],
			["y1", "+- vc dy1 0"],
			["adval2", "pin 0 adj2 99000"],
			["ratio", "*/ adval2 1 100000"],
			["iwd2", "*/ wd2 ratio 1"],
			["ihd2", "*/ hd2 ratio 1"],
			["wt2", "sin iwd2 adval"],
			["ht2", "cos ihd2 adval"],
			["dx2", "cat2 iwd2 ht2 wt2"],
			["dy2", "sat2 ihd2 ht2 wt2"],
			["x2", "+- hc dx2 0"],
			["y2", "+- vc dy2 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x1",
				"y1"
			], [
				"a",
				"wd2",
				"hd2",
				"adval",
				"swAng"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x2",
				"y2"
			], [
				"a",
				"iwd2",
				"ihd2",
				"adval",
				"swAng"
			]]
		}]
	},
	textcurvedown: {
		adj: [["adj", "val 45977"]],
		gd: [
			["a", "pin 0 adj 56338"],
			["dy", "*/ a h 100000"],
			["gd1", "*/ dy 3 4"],
			["gd2", "*/ dy 5 4"],
			["gd3", "*/ dy 3 8"],
			["gd4", "*/ dy 1 8"],
			["gd5", "+- h 0 gd3"],
			["gd6", "+- gd4 h 0"],
			["y0", "+- t dy 0"],
			["y1", "+- t gd1 0"],
			["y2", "+- t gd2 0"],
			["y3", "+- t gd3 0"],
			["y4", "+- t gd4 0"],
			["y5", "+- t gd5 0"],
			["y6", "+- t gd6 0"],
			["x1", "+- l wd3 0"],
			["x2", "+- r 0 wd3"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"t"
			], [
				"C",
				"x1",
				"y1",
				"x2",
				"y2",
				"r",
				"y0"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y5"
			], [
				"C",
				"x1",
				"y6",
				"x2",
				"y6",
				"r",
				"y5"
			]]
		}]
	},
	textcurveup: {
		adj: [["adj", "val 45977"]],
		gd: [
			["a", "pin 0 adj 56338"],
			["dy", "*/ a h 100000"],
			["gd1", "*/ dy 3 4"],
			["gd2", "*/ dy 5 4"],
			["gd3", "*/ dy 3 8"],
			["gd4", "*/ dy 1 8"],
			["gd5", "+- h 0 gd3"],
			["gd6", "+- gd4 h 0"],
			["y0", "+- t dy 0"],
			["y1", "+- t gd1 0"],
			["y2", "+- t gd2 0"],
			["y3", "+- t gd3 0"],
			["y4", "+- t gd4 0"],
			["y5", "+- t gd5 0"],
			["y6", "+- t gd6 0"],
			["x1", "+- l wd3 0"],
			["x2", "+- r 0 wd3"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y0"
			], [
				"C",
				"x1",
				"y2",
				"x2",
				"y1",
				"r",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y5"
			], [
				"C",
				"x1",
				"y6",
				"x2",
				"y6",
				"r",
				"y5"
			]]
		}]
	},
	textdeflate: {
		adj: [["adj", "val 18750"]],
		gd: [
			["a", "pin 0 adj 37500"],
			["dy", "*/ a ss 100000"],
			["gd0", "*/ dy 4 3"],
			["gd1", "+- h 0 gd0"],
			["adjY", "+- t dy 0"],
			["y0", "+- t gd0 0"],
			["y1", "+- t gd1 0"],
			["x0", "+- l wd3 0"],
			["x1", "+- r 0 wd3"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"t"
			], [
				"C",
				"x0",
				"y0",
				"x1",
				"y0",
				"r",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"b"
			], [
				"C",
				"x0",
				"y1",
				"x1",
				"y1",
				"r",
				"b"
			]]
		}]
	},
	textdeflatebottom: {
		adj: [["adj", "val 50000"]],
		gd: [
			["a", "pin 6250 adj 100000"],
			["dy", "*/ a ss 100000"],
			["dy2", "+- h 0 dy"],
			["y1", "+- t dy 0"],
			["cp", "+- y1 0 dy2"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"t"
			], [
				"l",
				"r",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"b"
			], [
				"Q",
				"hc",
				"cp",
				"r",
				"b"
			]]
		}]
	},
	textdeflateinflate: {
		adj: [["adj", "val 35000"]],
		gd: [
			["a", "pin 5000 adj 95000"],
			["dy", "*/ a h 100000"],
			["del", "*/ h 5 100"],
			["dh1", "*/ h 45 100"],
			["dh2", "*/ h 55 100"],
			["yh", "+- dy 0 del"],
			["yl", "+- dy del 0"],
			["y3", "+- yh yh dh1"],
			["y4", "+- yl yl dh2"]
		],
		paths: [
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"l",
					"t"
				], [
					"l",
					"r",
					"t"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"l",
					"dh1"
				], [
					"Q",
					"hc",
					"y3",
					"r",
					"dh1"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"l",
					"dh2"
				], [
					"Q",
					"hc",
					"y4",
					"r",
					"dh2"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"l",
					"b"
				], [
					"l",
					"r",
					"b"
				]]
			}
		]
	},
	textdeflateinflatedeflate: {
		adj: [["adj", "val 25000"]],
		gd: [
			["a", "pin 3000 adj 47000"],
			["dy", "*/ a h 100000"],
			["del", "*/ h 3 100"],
			["ey1", "*/ h 30 100"],
			["ey2", "*/ h 36 100"],
			["ey3", "*/ h 63 100"],
			["ey4", "*/ h 70 100"],
			["by", "+- b 0 dy"],
			["yh1", "+- dy 0 del"],
			["yl1", "+- dy del 0"],
			["yh2", "+- by 0 del"],
			["yl2", "+- by del 0"],
			["y1", "+- yh1 yh1 ey1"],
			["y2", "+- yl1 yl1 ey2"],
			["y3", "+- yh2 yh2 ey3"],
			["y4", "+- yl2 yl2 ey4"]
		],
		paths: [
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"l",
					"t"
				], [
					"l",
					"r",
					"t"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"l",
					"ey1"
				], [
					"Q",
					"hc",
					"y1",
					"r",
					"ey1"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"l",
					"ey2"
				], [
					"Q",
					"hc",
					"y2",
					"r",
					"ey2"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"l",
					"ey3"
				], [
					"Q",
					"hc",
					"y3",
					"r",
					"ey3"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"l",
					"ey4"
				], [
					"Q",
					"hc",
					"y4",
					"r",
					"ey4"
				]]
			},
			{
				w: null,
				h: null,
				fill: null,
				stroke: !0,
				extrusionOk: !0,
				cmds: [[
					"m",
					"l",
					"b"
				], [
					"l",
					"r",
					"b"
				]]
			}
		]
	},
	textdeflatetop: {
		adj: [["adj", "val 50000"]],
		gd: [
			["a", "pin 0 adj 93750"],
			["dy", "*/ a h 100000"],
			["y1", "+- t dy 0"],
			["cp", "+- y1 dy 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"t"
			], [
				"Q",
				"hc",
				"cp",
				"r",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"b"
			], [
				"l",
				"r",
				"b"
			]]
		}]
	},
	textdoublewave1: {
		adj: [["adj1", "val 6250"], ["adj2", "val 0"]],
		gd: [
			["a1", "pin 0 adj1 12500"],
			["a2", "pin -10000 adj2 10000"],
			["y1", "*/ h a1 100000"],
			["dy2", "*/ y1 10 3"],
			["y2", "+- y1 0 dy2"],
			["y3", "+- y1 dy2 0"],
			["y4", "+- b 0 y1"],
			["y5", "+- y4 0 dy2"],
			["y6", "+- y4 dy2 0"],
			["of", "*/ w a2 100000"],
			["of2", "*/ w a2 50000"],
			["x1", "abs of"],
			["dx2", "?: of2 0 of2"],
			["x2", "+- l 0 dx2"],
			["dx8", "?: of2 of2 0"],
			["x8", "+- r 0 dx8"],
			["dx3", "+/ dx2 x8 6"],
			["x3", "+- x2 dx3 0"],
			["dx4", "+/ dx2 x8 3"],
			["x4", "+- x2 dx4 0"],
			["x5", "+/ x2 x8 2"],
			["x6", "+- x5 dx3 0"],
			["x7", "+/ x6 x8 2"],
			["x9", "+- l dx8 0"],
			["x15", "+- r dx2 0"],
			["x10", "+- x9 dx3 0"],
			["x11", "+- x9 dx4 0"],
			["x12", "+/ x9 x15 2"],
			["x13", "+- x12 dx3 0"],
			["x14", "+/ x13 x15 2"],
			["x16", "+- r 0 x1"],
			["xAdj", "+- hc of 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"x2",
					"y1"
				],
				[
					"C",
					"x3",
					"y2",
					"x4",
					"y3",
					"x5",
					"y1"
				],
				[
					"C",
					"x6",
					"y2",
					"x7",
					"y3",
					"x8",
					"y1"
				]
			]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"x9",
					"y4"
				],
				[
					"C",
					"x10",
					"y5",
					"x11",
					"y6",
					"x12",
					"y4"
				],
				[
					"C",
					"x13",
					"y5",
					"x14",
					"y6",
					"x15",
					"y4"
				]
			]
		}]
	},
	textfadedown: {
		adj: [["adj", "val 33333"]],
		gd: [
			["a", "pin 0 adj 49999"],
			["dx", "*/ a w 100000"],
			["x1", "+- l dx 0"],
			["x2", "+- r 0 dx"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"t"
			], [
				"l",
				"r",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x1",
				"b"
			], [
				"l",
				"x2",
				"b"
			]]
		}]
	},
	textfadeleft: {
		adj: [["adj", "val 33333"]],
		gd: [
			["a", "pin 0 adj 49999"],
			["dy", "*/ a h 100000"],
			["y1", "+- t dy 0"],
			["y2", "+- b 0 dy"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y1"
			], [
				"l",
				"r",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y2"
			], [
				"l",
				"r",
				"b"
			]]
		}]
	},
	textfaderight: {
		adj: [["adj", "val 33333"]],
		gd: [
			["a", "pin 0 adj 49999"],
			["dy", "*/ a h 100000"],
			["y1", "+- t dy 0"],
			["y2", "+- b 0 dy"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"t"
			], [
				"l",
				"r",
				"y1"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"b"
			], [
				"l",
				"r",
				"y2"
			]]
		}]
	},
	textfadeup: {
		adj: [["adj", "val 33333"]],
		gd: [
			["a", "pin 0 adj 49999"],
			["dx", "*/ a w 100000"],
			["x1", "+- l dx 0"],
			["x2", "+- r 0 dx"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x1",
				"t"
			], [
				"l",
				"x2",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"b"
			], [
				"l",
				"r",
				"b"
			]]
		}]
	},
	textinflate: {
		adj: [["adj", "val 18750"]],
		gd: [
			["a", "pin 0 adj 20000"],
			["dy", "*/ a h 100000"],
			["gd", "*/ dy 1 3"],
			["gd0", "+- 0 0 gd"],
			["gd1", "+- h 0 gd0"],
			["ty", "+- t dy 0"],
			["by", "+- b 0 dy"],
			["y0", "+- t gd0 0"],
			["y1", "+- t gd1 0"],
			["x0", "+- l wd3 0"],
			["x1", "+- r 0 wd3"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"ty"
			], [
				"C",
				"x0",
				"y0",
				"x1",
				"y0",
				"r",
				"ty"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"by"
			], [
				"C",
				"x0",
				"y1",
				"x1",
				"y1",
				"r",
				"by"
			]]
		}]
	},
	textinflatebottom: {
		adj: [["adj", "val 60000"]],
		gd: [
			["a", "pin 60000 adj 100000"],
			["dy", "*/ a h 100000"],
			["ty", "+- t dy 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"t"
			], [
				"l",
				"r",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"ty"
			], [
				"Q",
				"hc",
				"b",
				"r",
				"ty"
			]]
		}]
	},
	textinflatetop: {
		adj: [["adj", "val 40000"]],
		gd: [
			["a", "pin 0 adj 50000"],
			["dy", "*/ a h 100000"],
			["ty", "+- t dy 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"ty"
			], [
				"Q",
				"hc",
				"t",
				"r",
				"ty"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"b"
			], [
				"l",
				"r",
				"b"
			]]
		}]
	},
	textplain: {
		adj: [["adj", "val 50000"]],
		gd: [
			["a", "pin 30000 adj 70000"],
			["mid", "*/ a w 100000"],
			["midDir", "+- mid 0 hc"],
			["dl", "+- mid 0 l"],
			["dr", "+- r 0 mid"],
			["dl2", "*/ dl 2 1"],
			["dr2", "*/ dr 2 1"],
			["dx", "?: midDir dr2 dl2"],
			["xr", "+- l dx 0"],
			["xl", "+- r 0 dx"],
			["tlx", "?: midDir l xl"],
			["trx", "?: midDir xr r"],
			["blx", "?: midDir xl l"],
			["brx", "?: midDir r xr"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"tlx",
				"t"
			], [
				"l",
				"trx",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"blx",
				"b"
			], [
				"l",
				"brx",
				"b"
			]]
		}]
	},
	textringinside: {
		adj: [["adj", "val 60000"]],
		gd: [
			["a", "pin 50000 adj 99000"],
			["dy", "*/ a h 100000"],
			["y", "+- t dy 0"],
			["r", "*/ dy 1 2"],
			["y1", "+- t r 0"],
			["y2", "+- b 0 r"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y1"
			], [
				"a",
				"wd2",
				"r",
				"10800000",
				"21599999"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y2"
			], [
				"a",
				"wd2",
				"r",
				"10800000",
				"21599999"
			]]
		}]
	},
	textringoutside: {
		adj: [["adj", "val 60000"]],
		gd: [
			["a", "pin 50000 adj 99000"],
			["dy", "*/ a h 100000"],
			["y", "+- t dy 0"],
			["r", "*/ dy 1 2"],
			["y1", "+- t r 0"],
			["y2", "+- b 0 r"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y1"
			], [
				"a",
				"wd2",
				"r",
				"10800000",
				"-21599999"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y2"
			], [
				"a",
				"wd2",
				"r",
				"10800000",
				"-21599999"
			]]
		}]
	},
	textslantdown: {
		adj: [["adj", "val 44445"]],
		gd: [
			["a", "pin 28569 adj 100000"],
			["dy", "*/ a h 100000"],
			["y1", "+- t dy 0"],
			["y2", "+- b 0 dy"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"t"
			], [
				"l",
				"r",
				"y2"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y1"
			], [
				"l",
				"r",
				"b"
			]]
		}]
	},
	textslantup: {
		adj: [["adj", "val 55555"]],
		gd: [
			["a", "pin 0 adj 71431"],
			["dy", "*/ a h 100000"],
			["y1", "+- t dy 0"],
			["y2", "+- b 0 dy"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"y1"
			], [
				"l",
				"r",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"b"
			], [
				"l",
				"r",
				"y2"
			]]
		}]
	},
	textstop: {
		adj: [["adj", "val 25000"]],
		gd: [
			["a", "pin 14286 adj 50000"],
			["dx", "*/ w 1 3"],
			["dy", "*/ a h 100000"],
			["x1", "+- l dx 0"],
			["x2", "+- r 0 dx"],
			["y1", "+- t dy 0"],
			["y2", "+- b 0 dy"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"l",
					"y1"
				],
				[
					"l",
					"x1",
					"t"
				],
				[
					"l",
					"x2",
					"t"
				],
				[
					"l",
					"r",
					"y1"
				]
			]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"l",
					"y2"
				],
				[
					"l",
					"x1",
					"b"
				],
				[
					"l",
					"x2",
					"b"
				],
				[
					"l",
					"r",
					"y2"
				]
			]
		}]
	},
	texttriangle: {
		adj: [["adj", "val 50000"]],
		gd: [["a", "pin 0 adj 100000"], ["y", "*/ a h 100000"]],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"l",
					"y"
				],
				[
					"l",
					"hc",
					"t"
				],
				[
					"l",
					"r",
					"y"
				]
			]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"b"
			], [
				"l",
				"r",
				"b"
			]]
		}]
	},
	texttriangleinverted: {
		adj: [["adj", "val 50000"]],
		gd: [["a", "pin 0 adj 100000"], ["y", "*/ a h 100000"]],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"l",
				"t"
			], [
				"l",
				"r",
				"t"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"l",
					"y"
				],
				[
					"l",
					"hc",
					"b"
				],
				[
					"l",
					"r",
					"y"
				]
			]
		}]
	},
	textwave1: {
		adj: [["adj1", "val 12500"], ["adj2", "val 0"]],
		gd: [
			["a1", "pin 0 adj1 20000"],
			["a2", "pin -10000 adj2 10000"],
			["y1", "*/ h a1 100000"],
			["dy2", "*/ y1 10 3"],
			["y2", "+- y1 0 dy2"],
			["y3", "+- y1 dy2 0"],
			["y4", "+- b 0 y1"],
			["y5", "+- y4 0 dy2"],
			["y6", "+- y4 dy2 0"],
			["of", "*/ w a2 100000"],
			["of2", "*/ w a2 50000"],
			["x1", "abs of"],
			["dx2", "?: of2 0 of2"],
			["x2", "+- l 0 dx2"],
			["dx5", "?: of2 of2 0"],
			["x5", "+- r 0 dx5"],
			["dx3", "+/ dx2 x5 3"],
			["x3", "+- x2 dx3 0"],
			["x4", "+/ x3 x5 2"],
			["x6", "+- l dx5 0"],
			["x10", "+- r dx2 0"],
			["x7", "+- x6 dx3 0"],
			["x8", "+/ x7 x10 2"],
			["x9", "+- r 0 x1"],
			["xAdj", "+- hc of 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x2",
				"y1"
			], [
				"C",
				"x3",
				"y2",
				"x4",
				"y3",
				"x5",
				"y1"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x6",
				"y4"
			], [
				"C",
				"x7",
				"y5",
				"x8",
				"y6",
				"x10",
				"y4"
			]]
		}]
	},
	textwave2: {
		adj: [["adj1", "val 12500"], ["adj2", "val 0"]],
		gd: [
			["a1", "pin 0 adj1 20000"],
			["a2", "pin -10000 adj2 10000"],
			["y1", "*/ h a1 100000"],
			["dy2", "*/ y1 10 3"],
			["y2", "+- y1 0 dy2"],
			["y3", "+- y1 dy2 0"],
			["y4", "+- b 0 y1"],
			["y5", "+- y4 0 dy2"],
			["y6", "+- y4 dy2 0"],
			["of", "*/ w a2 100000"],
			["of2", "*/ w a2 50000"],
			["x1", "abs of"],
			["dx2", "?: of2 0 of2"],
			["x2", "+- l 0 dx2"],
			["dx5", "?: of2 of2 0"],
			["x5", "+- r 0 dx5"],
			["dx3", "+/ dx2 x5 3"],
			["x3", "+- x2 dx3 0"],
			["x4", "+/ x3 x5 2"],
			["x6", "+- l dx5 0"],
			["x10", "+- r dx2 0"],
			["x7", "+- x6 dx3 0"],
			["x8", "+/ x7 x10 2"],
			["x9", "+- r 0 x1"],
			["xAdj", "+- hc of 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x2",
				"y1"
			], [
				"C",
				"x3",
				"y3",
				"x4",
				"y2",
				"x5",
				"y1"
			]]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [[
				"m",
				"x6",
				"y4"
			], [
				"C",
				"x7",
				"y6",
				"x8",
				"y5",
				"x10",
				"y4"
			]]
		}]
	},
	textwave4: {
		adj: [["adj1", "val 6250"], ["adj2", "val 0"]],
		gd: [
			["a1", "pin 0 adj1 12500"],
			["a2", "pin -10000 adj2 10000"],
			["y1", "*/ h a1 100000"],
			["dy2", "*/ y1 10 3"],
			["y2", "+- y1 0 dy2"],
			["y3", "+- y1 dy2 0"],
			["y4", "+- b 0 y1"],
			["y5", "+- y4 0 dy2"],
			["y6", "+- y4 dy2 0"],
			["of", "*/ w a2 100000"],
			["of2", "*/ w a2 50000"],
			["x1", "abs of"],
			["dx2", "?: of2 0 of2"],
			["x2", "+- l 0 dx2"],
			["dx8", "?: of2 of2 0"],
			["x8", "+- r 0 dx8"],
			["dx3", "+/ dx2 x8 6"],
			["x3", "+- x2 dx3 0"],
			["dx4", "+/ dx2 x8 3"],
			["x4", "+- x2 dx4 0"],
			["x5", "+/ x2 x8 2"],
			["x6", "+- x5 dx3 0"],
			["x7", "+/ x6 x8 2"],
			["x9", "+- l dx8 0"],
			["x15", "+- r dx2 0"],
			["x10", "+- x9 dx3 0"],
			["x11", "+- x9 dx4 0"],
			["x12", "+/ x9 x15 2"],
			["x13", "+- x12 dx3 0"],
			["x14", "+/ x13 x15 2"],
			["x16", "+- r 0 x1"],
			["xAdj", "+- hc of 0"]
		],
		paths: [{
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"x2",
					"y1"
				],
				[
					"C",
					"x3",
					"y3",
					"x4",
					"y2",
					"x5",
					"y1"
				],
				[
					"C",
					"x6",
					"y3",
					"x7",
					"y2",
					"x8",
					"y1"
				]
			]
		}, {
			w: null,
			h: null,
			fill: null,
			stroke: !0,
			extrusionOk: !0,
			cmds: [
				[
					"m",
					"x9",
					"y4"
				],
				[
					"C",
					"x10",
					"y6",
					"x11",
					"y5",
					"x12",
					"y4"
				],
				[
					"C",
					"x13",
					"y6",
					"x14",
					"y5",
					"x15",
					"y4"
				]
			]
		}]
	}
}, ot = Math.PI * 2 / 216e5, st = at, ct = /* @__PURE__ */ new Map();
function lt(e) {
	return e.toLowerCase() in st;
}
function ut(e) {
	let t = ct.get(e);
	if (t) return t;
	let n = st[e];
	return n ? (t = {
		adj: n.adj.map(([e, t]) => [e, le(t)]),
		gd: n.gd.map(([e, t]) => [e, le(t)]),
		paths: n.paths
	}, ct.set(e, t), t) : null;
}
var dt = 48;
function ft(e, t, n, r) {
	let i = e.w == null ? 1 : n / e.w, a = e.h == null ? 1 : r / e.h, o = (e) => e * i, s = (e) => e * a, c = [], l = 0, u = 0;
	for (let n of e.cmds) switch (n[0]) {
		case "m":
			l = o(t.resolve(n[1])), u = s(t.resolve(n[2])), c.push({
				x: l,
				y: u
			});
			break;
		case "l":
			l = o(t.resolve(n[1])), u = s(t.resolve(n[2])), c.push({
				x: l,
				y: u
			});
			break;
		case "C": {
			let e = o(t.resolve(n[1])), r = s(t.resolve(n[2])), i = o(t.resolve(n[3])), a = s(t.resolve(n[4])), d = o(t.resolve(n[5])), f = s(t.resolve(n[6]));
			for (let t = 1; t <= dt; t++) {
				let n = t / dt, o = 1 - n, s = o * o * o * l + 3 * o * o * n * e + 3 * o * n * n * i + n * n * n * d, p = o * o * o * u + 3 * o * o * n * r + 3 * o * n * n * a + n * n * n * f;
				c.push({
					x: s,
					y: p
				});
			}
			l = d, u = f;
			break;
		}
		case "Q": {
			let e = o(t.resolve(n[1])), r = s(t.resolve(n[2])), i = o(t.resolve(n[3])), a = s(t.resolve(n[4]));
			for (let t = 1; t <= dt; t++) {
				let n = t / dt, o = 1 - n, s = o * o * l + 2 * o * n * e + n * n * i, d = o * o * u + 2 * o * n * r + n * n * a;
				c.push({
					x: s,
					y: d
				});
			}
			l = i, u = a;
			break;
		}
		case "a": {
			let e = t.resolve(n[1]), r = t.resolve(n[2]), o = e * i, s = r * a, d = t.resolve(n[3]) * ot, f = t.resolve(n[4]) * ot, p = (t) => Math.atan2(e * Math.sin(t), r * Math.cos(t)), m = Math.PI * 2, h = p(d), g = Math.trunc(f / m), _ = f - g * m, v = p(d + _) - h;
			_ > 0 && v < 0 ? v += m : _ < 0 && v > 0 && (v -= m);
			let y = v + g * m, b = l - o * Math.cos(h), x = u - s * Math.sin(h), S = Math.max(dt, Math.ceil(Math.abs(y) / m * 96));
			for (let e = 1; e <= S; e++) {
				let t = h + y * e / S;
				c.push({
					x: b + o * Math.cos(t),
					y: x + s * Math.sin(t)
				});
			}
			l = b + o * Math.cos(h + y), u = x + s * Math.sin(h + y);
			break;
		}
		case "c": break;
	}
	return c;
}
function pt(e) {
	let t = [0];
	for (let n = 1; n < e.length; n++) {
		let r = e[n].x - e[n - 1].x, i = e[n].y - e[n - 1].y;
		t.push(t[n - 1] + Math.hypot(r, i));
	}
	return t;
}
function mt(e, t, n, r) {
	let i = ut(e.toLowerCase());
	if (!i || i.paths.length === 0) return null;
	let a = ne({
		w: n,
		h: r,
		adj: t
	}, i.adj, i.gd), o = i.paths.length === 1, s = ft(i.paths[0], a, n, r), c = o ? s : ft(i.paths[i.paths.length - 1], a, n, r);
	return {
		top: s,
		bottom: c,
		topLen: pt(s),
		bottomLen: pt(c),
		singleEdge: o
	};
}
function ht(e, t, n) {
	let r = t[t.length - 1];
	if (e.length === 1 || r === 0) return {
		x: e[0].x,
		y: e[0].y,
		tx: 1,
		ty: 0
	};
	let i = Math.max(0, Math.min(1, n)) * r, a = 0, o = t.length - 1;
	for (; a < o - 1;) {
		let e = a + o >> 1;
		t[e] <= i ? a = e : o = e;
	}
	let s = t[o] - t[a] || 1, c = (i - t[a]) / s, l = e[a], u = e[o], d = u.x - l.x, f = u.y - l.y, p = Math.hypot(d, f) || 1;
	return {
		x: l.x + d * c,
		y: l.y + f * c,
		tx: d / p,
		ty: f / p
	};
}
function gt(e) {
	return e.topLen[e.topLen.length - 1] ?? 0;
}
function _t(e, t) {
	if (!e.singleEdge) return 1;
	let n = gt(e);
	return n <= 0 ? 1 : Math.max(0, Math.min(1, t / n));
}
function vt(e, t, n, r) {
	if (e.singleEdge) {
		let i = ht(e.top, e.topLen, t), a = Math.atan2(i.ty, i.tx), o = i.ty, s = -i.tx, c = n * (1 - r);
		return {
			x: i.x - o * c,
			y: i.y - s * c,
			angle: a,
			vScale: 1,
			shear: 0
		};
	}
	let i = ht(e.top, e.topLen, t), a = ht(e.bottom, e.bottomLen, t), o = a.x - i.x, s = a.y - i.y, c = i.x + o * r, l = i.y + s * r, u = i.tx + a.tx, d = i.ty + a.ty, f = Math.atan2(d, u), p = Math.cos(f), m = Math.sin(f), h = (p * o + m * s) / (n > 0 ? n : 1), g = (-m * o + p * s) / (n > 0 ? n : 1);
	return {
		x: c,
		y: l,
		angle: f,
		vScale: g === 0 ? n > 0 ? Math.hypot(o, s) / n : 1 : g,
		shear: g === 0 ? 0 : h / g
	};
}
//#endregion
//#region packages/core/src/shape/effects.ts
function yt(e, t) {
	return e * t;
}
function bt(e) {
	return e.getContext("2d") ?? null;
}
function xt(e, t, n, r) {
	let i = Math.max(0, Math.floor(e.x - t)), a = Math.max(0, Math.floor(e.y - t)), o = Math.min(n, Math.ceil(e.x + e.w + t)), s = Math.min(r, Math.ceil(e.y + e.h + t));
	return {
		x: i,
		y: a,
		w: Math.max(1, o - i),
		h: Math.max(1, s - a)
	};
}
function St(e, t) {
	if (t.x === 0 && t.y === 0) return e;
	let n = t.x, r = t.y;
	return new Proxy(e, {
		get(e, t) {
			if (t === "setTransform") return (t) => {
				e.setTransform(t.a, t.b, t.c, t.d, t.e - n, t.f - r);
			};
			let i = Reflect.get(e, t);
			return typeof i == "function" ? i.bind(e) : i;
		},
		set(e, t, n) {
			return e[t] = n, !0;
		}
	});
}
function Ct(e, t, n, r, i, a, o) {
	let s = yt(r.blur, i), c = yt(r.dist, i), l = r.dir * Math.PI / 180, u = Math.cos(l) * c, d = Math.sin(l) * c, f = xt(n, Math.ceil(3 * s + Math.abs(c)) + 2, a, o), p = T(f.w, f.h);
	if (!p) return;
	let m = bt(p);
	if (!m) return;
	let h = St(m, f);
	h.save(), h.fillStyle = R(r.color, r.alpha), t(h), h.restore(), h.save(), h.globalCompositeOperation = "destination-out", h.filter = s > 0 ? `blur(${s}px)` : "none", h.translate(u, d), h.fillStyle = "#000", t(h), h.restore(), h.save(), h.globalCompositeOperation = "destination-in", h.filter = "none", h.fillStyle = "#000", t(h), h.restore(), e.save(), e.drawImage(p, f.x, f.y), e.restore();
}
function wt(e, t, n, r, i, a, o, s) {
	let c = yt(r.radius, i);
	if (c <= 0) {
		t(e);
		return;
	}
	let l = xt(n, Math.ceil(c) + 2, a, o), u = n.x - l.x, d = n.y - l.y, f = T(l.w, l.h);
	if (!f) {
		t(e);
		return;
	}
	let p = bt(f);
	if (!p) {
		t(e);
		return;
	}
	let m = St(p, l), h = s ?? t;
	t(m);
	let g = T(l.w, l.h), _ = T(l.w, l.h), v = g ? bt(g) : null, y = _ ? bt(_) : null;
	if (g && v && _ && y) {
		let t = St(v, l);
		t.fillStyle = "#000", h(t), y.drawImage(f, u, d, n.w, n.h, u - c, d - c, n.w + c * 2, n.h + c * 2), y.drawImage(f, 0, 0), y.globalCompositeOperation = "destination-in", y.filter = `blur(${c / 3}px)`, y.drawImage(g, 0, 0), y.filter = "none", y.globalCompositeOperation = "source-over", e.save(), e.drawImage(_, l.x, l.y), e.restore();
		return;
	}
	e.save(), e.drawImage(f, 0, 0), e.restore();
}
function Tt(e, t, n, r, i, a, o) {
	let s = T(a, o);
	if (!s) return;
	let c = bt(s);
	if (!c) return;
	let l = yt(r.blur, i);
	c.save(), l > 0 && (c.filter = `blur(${l}px)`), t(c), c.restore(), c.save(), c.globalCompositeOperation = "destination-in";
	let u = n.y, d = n.y + n.h, f = c.createLinearGradient(0, d, 0, u), p = Et(r.stPos), m = Et(r.endPos);
	f.addColorStop(0, `rgba(0,0,0,${r.stA})`), p > 0 && f.addColorStop(p, `rgba(0,0,0,${r.stA})`), m < 1 && m > p && f.addColorStop(m, `rgba(0,0,0,${r.endA})`), f.addColorStop(1, `rgba(0,0,0,${r.endA})`), c.fillStyle = f, c.fillRect(0, 0, a, o), c.restore();
	let h = yt(r.dist, i), g = r.dir * Math.PI / 180, _ = Math.cos(g) * h, v = Math.sin(g) * h;
	e.save(), e.translate(n.x + _, d + v), e.scale(r.sx, r.sy), e.translate(-n.x, -d), e.drawImage(s, 0, 0), e.restore();
}
function Et(e) {
	return e < 0 ? 0 : e > 1 ? 1 : e;
}
//#endregion
//#region packages/core/src/shape/scene3d-camera.ts
var J = 26, Dt = {
	orthographicFront: {
		kind: "orthographic",
		baseLat: 0,
		baseLon: 0,
		baseRev: 0,
		fovDeg: 0
	},
	perspectiveFront: {
		kind: "perspective",
		baseLat: 0,
		baseLon: 0,
		baseRev: 0,
		fovDeg: J
	},
	perspectiveRelaxed: {
		kind: "perspective",
		baseLat: 0,
		baseLon: 0,
		baseRev: 0,
		fovDeg: J
	},
	perspectiveRelaxedModerately: {
		kind: "perspective",
		baseLat: 0,
		baseLon: 0,
		baseRev: 0,
		fovDeg: J
	},
	perspectiveAbove: {
		kind: "perspective",
		baseLat: -20,
		baseLon: 0,
		baseRev: 0,
		fovDeg: J
	},
	perspectiveBelow: {
		kind: "perspective",
		baseLat: 20,
		baseLon: 0,
		baseRev: 0,
		fovDeg: J
	},
	perspectiveLeft: {
		kind: "perspective",
		baseLat: 0,
		baseLon: -20,
		baseRev: 0,
		fovDeg: J
	},
	perspectiveRight: {
		kind: "perspective",
		baseLat: 0,
		baseLon: 20,
		baseRev: 0,
		fovDeg: J
	}
};
function Ot(e, t) {
	let n = Array(9).fill(0);
	for (let r = 0; r < 3; r++) for (let i = 0; i < 3; i++) {
		let a = 0;
		for (let n = 0; n < 3; n++) a += e[r * 3 + n] * t[n * 3 + i];
		n[r * 3 + i] = a;
	}
	return n;
}
function kt(e) {
	let t = e * Math.PI / 180, n = Math.cos(t), r = Math.sin(t);
	return [
		1,
		0,
		0,
		0,
		n,
		-r,
		0,
		r,
		n
	];
}
function At(e) {
	let t = e * Math.PI / 180, n = Math.cos(t), r = Math.sin(t);
	return [
		n,
		0,
		r,
		0,
		1,
		0,
		-r,
		0,
		n
	];
}
function jt(e) {
	let t = e * Math.PI / 180, n = Math.cos(t), r = Math.sin(t);
	return [
		n,
		-r,
		0,
		r,
		n,
		0,
		0,
		0,
		1
	];
}
function Mt(e, t, n, r) {
	return [
		e[0] * t + e[1] * n + e[2] * r,
		e[3] * t + e[4] * n + e[5] * r,
		e[6] * t + e[7] * n + e[8] * r
	];
}
function Nt(e, t) {
	let n = t ? t.lat : e.baseLat, r = t ? t.lon : e.baseLon;
	return Ot(jt(-(t ? t.rev : e.baseRev)), Ot(kt(-n), At(-r)));
}
function Pt(e) {
	return Dt[e] ?? Dt.orthographicFront;
}
function Ft(e, t, n) {
	let r = Pt(e.prst), i = Nt(r, e.rot);
	if (t <= 0 || n <= 0) return {
		corners: [
			{
				x: 0,
				y: 0
			},
			{
				x: t,
				y: 0
			},
			{
				x: t,
				y: n
			},
			{
				x: 0,
				y: n
			}
		],
		isAffine: !0,
		isIdentity: !0
	};
	let a = t / 2, o = n / 2, s = [
		[-a, -o],
		[a, -o],
		[a, o],
		[-a, o]
	], c = e.zoom ?? 1, l = Math.max(a, o), u;
	if (r.kind === "perspective") {
		let t = e.fov ?? r.fovDeg, n = Math.max(1, Math.min(179, t)) * Math.PI / 180, a = l / Math.tan(n / 2);
		u = s.map(([e, t]) => {
			let [n, r, o] = Mt(i, e, t, 0), s = a - o, c = a / (Math.abs(s) < 1e-6 ? 1e-6 * Math.sign(s || 1) : s);
			return [n * c, r * c];
		});
	} else u = s.map(([e, t]) => {
		let [n, r] = Mt(i, e, t, 0);
		return [n, r];
	});
	u = u.map(([e, t]) => [e * c, t * c]);
	let d = Infinity, f = Infinity, p = -Infinity, m = -Infinity;
	for (let [e, t] of u) e < d && (d = e), t < f && (f = t), e > p && (p = e), t > m && (m = t);
	let h = p - d || 1, g = m - f || 1, _ = Math.min(t / h, n / g), v = (d + p) / 2, y = (f + m) / 2, b = u.map(([e, r]) => ({
		x: t / 2 + (e - v) * _,
		y: n / 2 + (r - y) * _
	})), x = .001 * Math.max(t, n), S = b[0].x + b[2].x - (b[1].x + b[3].x), C = b[0].y + b[2].y - (b[1].y + b[3].y), w = Math.abs(S) < x && Math.abs(C) < x, T = [
		[0, 0],
		[t, 0],
		[t, n],
		[0, n]
	], E = !0;
	for (let e = 0; e < 4; e++) if (Math.abs(b[e].x - T[e][0]) > x || Math.abs(b[e].y - T[e][1]) > x) {
		E = !1;
		break;
	}
	return {
		corners: b,
		isAffine: w,
		isIdentity: E
	};
}
function It(e) {
	let { isIdentity: t } = Ft(e, 1e3, 1e3);
	return !t;
}
function Lt(e, t, n, r) {
	let i = Pt(e.prst), a = Nt(i, e.rot);
	if (t <= 0 || n <= 0 || r === 0) return {
		x: 0,
		y: 0
	};
	let o = t / 2, s = n / 2, c = Math.max(o, s), l = e.zoom ?? 1, u = (t) => {
		let [n, r, o] = Mt(a, 0, 0, t);
		if (i.kind === "perspective") {
			let t = e.fov ?? i.fovDeg, a = Math.max(1, Math.min(179, t)) * Math.PI / 180, s = c / Math.tan(a / 2), u = s - o, d = s / (Math.abs(u) < 1e-6 ? 1e-6 * Math.sign(u || 1) : u);
			return [n * d * l, r * d * l];
		}
		return [n * l, r * l];
	}, [d, f] = u(0), [p, m] = u(-r);
	return {
		x: p - d,
		y: m - f
	};
}
//#endregion
//#region packages/core/src/shape/scene3d-draw.ts
function Rt(e, t, n, r) {
	let i = e.x, a = e.y, o = t.x, s = t.y, c = n.x, l = n.y, u = r.x, d = r.y, f = o - c, p = u - c, m = i - o + c - u, h = s - l, g = d - l, _ = a - s + l - d, v, y;
	if (Math.abs(m) < 1e-12 && Math.abs(_) < 1e-12) v = 0, y = 0;
	else {
		let e = f * g - p * h;
		if (Math.abs(e) < 1e-12) return null;
		v = (m * g - p * _) / e, y = (f * _ - m * h) / e;
	}
	return [
		o - i + v * o,
		u - i + y * u,
		i,
		s - a + v * s,
		d - a + y * d,
		a,
		v,
		y,
		1
	];
}
function zt(e, t, n) {
	let r = e[6] * t + e[7] * n + e[8];
	return {
		x: (e[0] * t + e[1] * n + e[2]) / r,
		y: (e[3] * t + e[4] * n + e[5]) / r
	};
}
var Bt = 1;
function Vt(e, t) {
	let [n, r, i, a, o, s] = e, [c, l, u, d, f, p] = t;
	return [
		n * c + i * l,
		r * c + a * l,
		n * u + i * d,
		r * u + a * d,
		n * f + i * p + o,
		r * f + a * p + s
	];
}
function Ht(e, t, n, r, i, a, o, s, c, l, u, d, f) {
	let p = c - o, m = l - s;
	if (p <= 0 || m <= 0) return;
	let h = (d.x - u.x) / p, g = (d.y - u.y) / p, _ = (f.x - u.x) / m, v = (f.y - u.y) / m, y = (Math.hypot(d.x - u.x, d.y - u.y) || 1) * a, b = (Math.hypot(f.x - u.x, f.y - u.y) || 1) * a, x = Bt * p / y, S = Bt * m / b, C = Math.max(0, o - x), w = Math.max(0, s - S), T = Math.min(n, c + x), E = Math.min(r, l + S), D = T - C, O = E - w;
	if (D <= 0 || O <= 0) return;
	e.save();
	let [k, A, j, M, N, P] = Vt(i, [
		h,
		g,
		_,
		v,
		u.x - o * h - s * _,
		u.y - o * g - s * v
	]);
	e.setTransform(k, A, j, M, N, P), e.drawImage(t, C, w, D, O, C, w, D, O), e.restore();
}
function Ut(e, t, n, r, i, a, o, s, c, l, u, d, f) {
	let p = zt(o, s, c), m = zt(o, l, c), h = zt(o, s, u), g = zt(o, l, u), _ = (s + l) / 2, v = (c + u) / 2, y = zt(o, _, v), b = {
		x: (p.x + m.x + h.x + g.x) / 4,
		y: (p.y + m.y + h.y + g.y) / 4
	}, x = Gt(i), S = Math.hypot(y.x - b.x, y.y - b.y) * x;
	if (f <= 0 || S <= d) {
		Ht(e, t, n, r, i, a, s * n, c * r, l * n, u * r, p, m, h);
		return;
	}
	l - s >= u - c ? (Ut(e, t, n, r, i, a, o, s, c, _, u, d, f - 1), Ut(e, t, n, r, i, a, o, _, c, l, u, d, f - 1)) : (Ut(e, t, n, r, i, a, o, s, c, l, v, d, f - 1), Ut(e, t, n, r, i, a, o, s, v, l, u, d, f - 1));
}
function Wt(e, t, n, r, i, a = .5) {
	if (n <= 0 || r <= 0) return;
	let [o, s, c, l] = i;
	if (Math.abs(o.x * s.y - s.x * o.y + s.x * c.y - c.x * s.y + c.x * l.y - l.x * c.y + l.x * o.y - o.x * l.y) / 2 < 1e-6) return;
	let u = Rt(i[0], i[1], i[2], i[3]);
	if (!u) return;
	let d = t.getTransform(), f = [
		d.a,
		d.b,
		d.c,
		d.d,
		d.e,
		d.f
	], p = Gt(f);
	Xt(e, t, n, r, i, f, p, u, a, 14) || (Jt(), t.save(), t.beginPath(), t.moveTo(i[0].x, i[0].y), t.lineTo(i[1].x, i[1].y), t.lineTo(i[2].x, i[2].y), t.lineTo(i[3].x, i[3].y), t.closePath(), t.clip(), Ut(t, e, n, r, f, p, u, 0, 0, 1, 1, a, 14), t.restore());
}
function Gt(e) {
	return Math.sqrt(Math.abs(e[0] * e[3] - e[1] * e[2])) || 1;
}
function Kt(e, t, n) {
	let r = Rt(e[0], e[1], e[2], e[3]);
	if (!r) return null;
	let i = [
		[-t, -n],
		[1 + t, -n],
		[1 + t, 1 + n],
		[-t, 1 + n]
	], a = [];
	for (let [e, t] of i) {
		if (!(r[6] * e + r[7] * t + r[8] > 1e-9)) return null;
		a.push(zt(r, e, t));
	}
	return a;
}
var qt = !1;
function Jt() {
	qt || (qt = !0, typeof console < "u" && typeof console.warn == "function" && console.warn("[ooxml] scene3d: no offscreen canvas available — using the direct warp fallback (per-cell bleed only, no supersample). Textured-source seams may be faintly visible; the silhouette and geometry are unaffected."));
}
var Yt = 2;
function Xt(e, t, n, r, i, a, o, s, c, l) {
	let u = i.map((e) => ({
		x: a[0] * e.x + a[2] * e.y + a[4],
		y: a[1] * e.x + a[3] * e.y + a[5]
	})), d = Infinity, f = Infinity, p = -Infinity, m = -Infinity;
	for (let e of u) e.x < d && (d = e.x), e.y < f && (f = e.y), e.x > p && (p = e.x), e.y > m && (m = e.y);
	d = Math.floor(d) - 1, f = Math.floor(f) - 1, p = Math.ceil(p) + 1, m = Math.ceil(m) + 1;
	let h = p - d, g = m - f;
	if (h <= 0 || g <= 0) return !1;
	let _ = Math.max(1, Math.ceil(h * Yt)), v = Math.max(1, Math.ceil(g * Yt)), y = T(_, v);
	if (!y || y.width !== _ || y.height !== v) return !1;
	let b = y.getContext("2d") ?? null;
	if (!b) return !1;
	let x = Yt, S = [
		a[0] * x,
		a[1] * x,
		a[2] * x,
		a[3] * x,
		(a[4] - d) * x,
		(a[5] - f) * x
	];
	b.save(), b.setTransform(S[0], S[1], S[2], S[3], S[4], S[5]), b.beginPath(), b.moveTo(i[0].x, i[0].y), b.lineTo(i[1].x, i[1].y), b.lineTo(i[2].x, i[2].y), b.lineTo(i[3].x, i[3].y), b.closePath(), b.clip(), Ut(b, e, n, r, S, o, s, 0, 0, 1, 1, c * x, l), b.restore(), t.save(), t.setTransform(1, 0, 0, 1, 0, 0);
	let C = t.imageSmoothingEnabled, w = t.imageSmoothingQuality;
	return t.imageSmoothingEnabled = !0, t.imageSmoothingQuality = "high", t.drawImage(y, 0, 0, h * x, g * x, d, f, h, g), t.imageSmoothingEnabled = C, t.imageSmoothingQuality = w, t.restore(), !0;
}
//#endregion
//#region packages/core/src/shape/bevel-shading.ts
function Zt(e, t) {
	if (t <= 0) return () => 1;
	let n = (e) => Math.max(0, Math.min(1, e / t));
	switch (e) {
		case "hardEdge": {
			let e = on;
			return (t) => {
				let r = Math.min(1, n(t) / e);
				return r * r * (3 - 2 * r);
			};
		}
		case "angle":
		case "slope": return (e) => n(e);
		case "circle":
		case "convex":
		case "softRound": return (e) => {
			let t = 1 - n(e);
			return Math.sqrt(Math.max(0, 1 - t * t));
		};
		default: return (e) => {
			let t = n(e);
			return t * t * (3 - 2 * t);
		};
	}
}
function Qt(e) {
	let t = e.length, n = new Float64Array(t);
	if (t === 0) return n;
	let r = new Int32Array(t), i = new Float64Array(t + 1), a = 0;
	r[0] = 0, i[0] = -Infinity, i[1] = Infinity;
	for (let n = 1; n < t; n++) {
		let t = (e[n] + n * n - (e[r[a]] + r[a] * r[a])) / (2 * n - 2 * r[a]);
		for (; t <= i[a];) a--, t = (e[n] + n * n - (e[r[a]] + r[a] * r[a])) / (2 * n - 2 * r[a]);
		a++, r[a] = n, i[a] = t, i[a + 1] = Infinity;
	}
	a = 0;
	for (let o = 0; o < t; o++) {
		for (; i[a + 1] < o;) a++;
		let t = o - r[a];
		n[o] = t * t + e[r[a]];
	}
	return n;
}
function $t(e, t = 3) {
	if (e <= 0) return Array(t).fill(1);
	let n = Math.sqrt(12 * e * e / t + 1), r = Math.floor(n);
	r % 2 == 0 && r--;
	let i = r + 2, a = (12 * e * e - t * r * r - 4 * t * r - 3 * t) / (-4 * r - 4), o = Math.round(a), s = [];
	for (let e = 0; e < t; e++) s.push(e < o ? r : i);
	return s;
}
function en(e, t, n, r, i, a) {
	let o = 1 / (2 * i + 1);
	if (a) for (let a = 0; a < r; a++) {
		let r = a * n, s = 0;
		for (let t = 0; t <= i; t++) t < n && (s += e[r + t]);
		for (let a = 0; a < n; a++) {
			t[r + a] = s * o;
			let c = a + i + 1, l = a - i;
			c < n && (s += e[r + c]), l >= 0 && (s -= e[r + l]);
		}
	}
	else for (let a = 0; a < n; a++) {
		let s = 0;
		for (let t = 0; t <= i; t++) t < r && (s += e[t * n + a]);
		for (let c = 0; c < r; c++) {
			t[c * n + a] = s * o;
			let l = c + i + 1, u = c - i;
			l < r && (s += e[l * n + a]), u >= 0 && (s -= e[u * n + a]);
		}
	}
}
function tn(e, t, n, r) {
	let i = Float64Array.from(e);
	if (r <= 0 || t <= 0 || n <= 0) return i;
	let a = new Float64Array(t * n);
	for (let e of $t(r, 3)) {
		let r = Math.max(1, (e - 1) / 2);
		en(i, a, t, n, r, !0), en(a, i, t, n, r, !1);
	}
	return i;
}
function nn(e, t, n, r = 128) {
	let i = new Float64Array(t * n);
	for (let a = 0; a < t * n; a++) i[a] = (e[a] ?? 0) >= r ? 0x56bc75e2d63100000 : 0;
	let a = new Float64Array(n);
	for (let e = 0; e < t; e++) {
		for (let r = 0; r < n; r++) a[r] = i[r * t + e];
		let r = Qt(a);
		for (let a = 0; a < n; a++) i[a * t + e] = r[a];
	}
	let o = new Float64Array(t);
	for (let e = 0; e < n; e++) {
		for (let n = 0; n < t; n++) o[n] = i[e * t + n];
		let n = Qt(o);
		for (let r = 0; r < t; r++) i[e * t + r] = n[r];
	}
	for (let e = 0; e < n; e++) for (let r = 0; r < t; r++) {
		let a = e * t + r;
		if (i[a] === 0) continue;
		let o = (e + 1) * (e + 1), s = (n - e) * (n - e), c = (r + 1) * (r + 1), l = (t - r) * (t - r), u = Math.min(o, s, c, l);
		u < i[a] && (i[a] = u);
	}
	for (let e = 0; e < t * n; e++) i[e] = Math.sqrt(i[e]);
	return i;
}
var rn = .25, an = .35, on = .5;
function sn(e, t, n, r, i, a) {
	let o = new Float32Array(t * n * 3), s = new Uint8Array(t * n), c = new Float32Array(t * n);
	if (t <= 0 || n <= 0) return {
		normals: o,
		bandMask: s,
		bandWeight: c
	};
	let l = nn(e, t, n), u = Zt(i, r), d = (n, r) => (e[r * t + n] ?? 0) >= 128, f = (r > 0 ? a / r : 0) * r, p = tn(l, t, n, Math.max(1, r * rn)), m = (e) => {
		let t = u(Math.max(0, e - .5));
		return u(e + .5) - t;
	};
	for (let e = 0; e < n; e++) for (let i = 0; i < t; i++) {
		let a = e * t + i;
		if (!d(i, e)) {
			o[a * 3 + 2] = 1;
			continue;
		}
		let u = l[a], h = u > 0 && u < r;
		if (s[a] = +!!h, !h) {
			o[a * 3 + 2] = 1;
			continue;
		}
		let g = u / r, _ = 1 - an, v = 1;
		if (g > _) {
			let e = Math.min(1, (g - _) / an);
			v = 1 - e * e * (3 - 2 * e);
		}
		c[a] = v;
		let y = i > 0 ? i - 1 : i, b = i < t - 1 ? i + 1 : i, x = e > 0 ? e - 1 : e, S = e < n - 1 ? e + 1 : e, C = (p[e * t + b] - p[e * t + y]) / (b - y || 1), w = (p[S * t + i] - p[x * t + i]) / (S - x || 1), T = Math.hypot(C, w), E = 0, D = 0;
		T > 1e-9 && (E = -C / T, D = -w / T);
		let O = m(u) * f, k = O * E, A = O * D, j = 1, M = Math.hypot(k, A, j) || 1;
		k /= M, A /= M, j /= M, o[a * 3] = k, o[a * 3 + 1] = A, o[a * 3 + 2] = j;
	}
	return {
		normals: o,
		bandMask: s,
		bandWeight: c
	};
}
var cn = 35 * Math.PI / 180, ln = 12 * Math.PI / 180, un = {
	t: {
		x: 0,
		y: -1
	},
	b: {
		x: 0,
		y: 1
	},
	l: {
		x: -1,
		y: 0
	},
	r: {
		x: 1,
		y: 0
	},
	tl: {
		x: -1,
		y: -1
	},
	tr: {
		x: 1,
		y: -1
	},
	bl: {
		x: -1,
		y: 1
	},
	br: {
		x: 1,
		y: 1
	}
};
function dn(e, t, n) {
	let r = n * Math.PI / 180, i = Math.cos(r), a = Math.sin(r);
	return {
		x: e * i - t * a,
		y: e * a + t * i
	};
}
function fn(e, t, n) {
	let r = un[t] ?? un.t;
	return n && n.rev && (r = dn(r.x, r.y, n.rev)), mn(r.x, r.y, cn);
}
function pn(e) {
	let t = Math.hypot(e.x, e.y) || 1;
	return mn(-e.x / t, -e.y / t, ln);
}
function mn(e, t, n) {
	let r = Math.hypot(e, t) || 1, i = Math.cos(n), a = Math.sin(n), o = e / r * i, s = t / r * i, c = a, l = Math.hypot(o, s, c) || 1;
	return {
		x: o / l,
		y: s / l,
		z: c / l
	};
}
var hn = 2, gn = {
	matte: {
		ambient: .62,
		diffuse: .45,
		specular: 0,
		shininess: 8
	},
	plastic: {
		ambient: .55,
		diffuse: .5,
		specular: .35,
		shininess: 22
	}
}, _n = .8;
function vn(e) {
	switch (e) {
		case "plastic":
		case "metal":
		case "clear":
		case "softEdge":
		case "shiny":
		case "softmetal": return "plastic";
		default: return "matte";
	}
}
function yn(e, t, n = !0) {
	let r = gn[e], i = {
		light: t,
		material: e,
		ambient: r.ambient,
		diffuse: r.diffuse,
		specular: r.specular,
		shininess: r.shininess
	};
	return n && (i.fillLight = pn(t), i.fillDiffuse = i.diffuse * _n), i;
}
function bn(e, t) {
	let n = e.x * t.light.x + e.y * t.light.y + e.z * t.light.z, r = t.diffuse * Math.max(0, n), i = 0;
	if (t.fillLight && t.fillDiffuse) {
		let n = e.x * t.fillLight.x + e.y * t.fillLight.y + e.z * t.fillLight.z;
		i = t.fillDiffuse * Math.max(0, n);
	}
	let a = 0;
	if (t.specular > 0) {
		let n = t.light.x, r = t.light.y, i = t.light.z + 1, o = Math.hypot(n, r, i) || 1, s = (e.x * n + e.y * r + e.z * i) / o;
		a = t.specular * Math.max(0, s) ** +t.shininess;
	}
	return Math.max(0, t.ambient + r + i + a);
}
function xn(e, t, n) {
	if (!e) return {
		x: 0,
		y: 0,
		w: t,
		h: n
	};
	let r = Math.max(0, Math.floor(e.x)), i = Math.max(0, Math.floor(e.y)), a = Math.min(t, Math.ceil(e.x + e.w)), o = Math.min(n, Math.ceil(e.y + e.h));
	return {
		x: r,
		y: i,
		w: Math.max(0, a - r),
		h: Math.max(0, o - i)
	};
}
function Sn(e, t, n) {
	let r = e.canvas.width, i = e.canvas.height;
	if (r <= 0 || i <= 0) return;
	let a = t.widthPx;
	if (a < .75) return;
	let { x: o, y: s, w: c, h: l } = xn(n, r, i);
	if (c <= 0 || l <= 0) return;
	let u = e.getImageData(o, s, c, l), d = u.data, f = new Uint8ClampedArray(c * l);
	for (let e = 0; e < c * l; e++) f[e] = d[e * 4 + 3];
	let { bandMask: p, bandWeight: m, normals: h } = sn(f, c, l, a, t.prst, t.heightPx), g = yn(t.material, t.light), _ = bn({
		x: 0,
		y: 0,
		z: 1
	}, g) || 1;
	for (let e = 0; e < c * l; e++) {
		if (p[e] === 0) continue;
		let n = m[e];
		if (n <= 0) continue;
		let r = h[e * 3], i = h[e * 3 + 1], a = h[e * 3 + 2];
		t.bottom && (r = -r, i = -i);
		let o = 1 + (bn({
			x: r,
			y: i,
			z: a
		}, g) / _ - 1) * n, s = e * 4;
		if (o >= 1) {
			let e = Math.min(1, (o - 1) * hn);
			for (let t = 0; t < 3; t++) {
				let n = Math.min(255, d[s + t] * o);
				d[s + t] = n + (255 - n) * e;
			}
		} else d[s] = Math.max(0, d[s] * o), d[s + 1] = Math.max(0, d[s + 1] * o), d[s + 2] = Math.max(0, d[s + 2] * o);
	}
	e.putImageData(u, o, s);
}
function Cn(e, t, n) {
	let r = e.canvas.width, i = e.canvas.height;
	if (r <= 0 || i <= 0) return;
	let a = t.offsetX, o = t.offsetY, s = Math.hypot(a, o);
	if (s < .75) return;
	let { x: c, y: l, w: u, h: d } = xn(n, r, i);
	if (u <= 0 || d <= 0) return;
	let f = e.getImageData(c, l, u, d), p = f.data, m = new Uint8ClampedArray(u * d);
	for (let e = 0; e < u * d; e++) m[e] = p[e * 4 + 3];
	let h = Math.max(1, Math.ceil(s)), [g, _, v] = t.rgb;
	for (let e = 0; e < d; e++) for (let t = 0; t < u; t++) {
		let n = e * u + t;
		if (m[n] >= 128) continue;
		let r = !1;
		for (let n = 1; n <= h; n++) {
			let i = n / h, s = Math.round(t - a * i), c = Math.round(e - o * i);
			if (!(s < 0 || c < 0 || s >= u || c >= d) && m[c * u + s] >= 128) {
				r = !0;
				break;
			}
		}
		if (!r) continue;
		let i = n * 4;
		p[i] = g, p[i + 1] = _, p[i + 2] = v, p[i + 3] = 255;
	}
	e.putImageData(f, c, l);
}
//#endregion
//#region packages/core/src/text/highlight-box.ts
function wn(e, t) {
	return {
		top: e - t * .85,
		height: t * 1.1
	};
}
//#endregion
//#region packages/core/src/nav/internal-target.ts
function Tn(e, t) {
	let n = t.startsWith("/") ? [] : e.split("/").filter((e) => e !== "");
	for (let e of t.split("/")) if (e === "..") n.pop();
	else if (e === "." || e === "") continue;
	else n.push(e);
	return n.join("/");
}
function En(e) {
	let t = /[?&]jump=([a-zA-Z]+)/.exec(e);
	if (!t) return null;
	let n = t[1].toLowerCase();
	return n === "firstslide" || n === "lastslide" || n === "nextslide" || n === "previousslide" ? n : null;
}
function Dn(e, t, n) {
	if (!(n <= 0)) switch (e) {
		case "firstslide": return 0;
		case "lastslide": return n - 1;
		case "nextslide": return Math.min(t + 1, n - 1);
		case "previousslide": return Math.max(t - 1, 0);
	}
}
//#endregion
//#region packages/pptx/src/text-layer.ts
function On(e, t, n, r, i) {
	e.innerHTML = "";
	let a = /* @__PURE__ */ new Map();
	for (let o of t) {
		let t = o.rotation + (o.textBodyRotation ?? 0), s = `${o.shapeX},${o.shapeY},${o.shapeW},${o.shapeH},${t}`;
		if (!a.has(s)) {
			let i = document.createElement("div");
			i.style.cssText = `position:absolute;left:${K(o.shapeX, n)};top:${K(o.shapeY, r)};width:${K(o.shapeW, n)};height:${K(o.shapeH, r)};pointer-events:all;overflow:hidden;`, t !== 0 && (i.style.transformOrigin = "center center", i.style.transform = `rotate(${t}deg)`), a.set(s, {
				div: i,
				x: o.shapeX,
				y: o.shapeY,
				w: o.shapeW,
				h: o.shapeH,
				rot: t
			}), e.appendChild(i);
		}
		let c = a.get(s), l = document.createElement("span");
		l.textContent = o.text;
		let u = i ? o.hyperlink : void 0;
		l.style.cssText = `position:absolute;left:${K(o.inShapeX, c.w)};top:${K(o.inShapeY, c.h)};font:${o.font};line-height:${o.h}px;letter-spacing:0;white-space:pre;color:transparent;cursor:${u ? "pointer" : "text"};`, u && i && (l.title = u.kind === "external" ? u.url : u.ref, l.addEventListener("click", (e) => {
			e.preventDefault(), i(u);
		})), c.div.appendChild(l);
	}
}
function kn(e, t, n, r, i, a, o = {}) {
	e.innerHTML = "";
	let s = o.match ?? "rgba(255, 214, 0, 0.42)", c = o.active ?? "rgba(255, 140, 0, 0.55)", l = /* @__PURE__ */ new Map(), u = (t) => {
		let n = t.rotation + (t.textBodyRotation ?? 0), a = `${t.shapeX},${t.shapeY},${t.shapeW},${t.shapeH},${n}`, o = l.get(a);
		if (!o) {
			let s = document.createElement("div");
			s.style.cssText = `position:absolute;left:${K(t.shapeX, r)};top:${K(t.shapeY, i)};width:${K(t.shapeW, r)};height:${K(t.shapeH, i)};pointer-events:none;overflow:hidden;`, n !== 0 && (s.style.transformOrigin = "center center", s.style.transform = `rotate(${n}deg)`), o = {
				div: s,
				w: t.shapeW,
				h: t.shapeH
			}, l.set(a, o), e.appendChild(s);
		}
		return o;
	};
	for (let e of n) {
		let n = e.active ? c : s;
		for (let r of e.slices) {
			let e = t[r.runIndex];
			if (!e) continue;
			let i = a(e.font), { x: o, width: s } = ze(e.text, r.start, r.end, i);
			if (s <= 0) continue;
			let c = u(e), l = document.createElement("div");
			l.style.cssText = `position:absolute;left:${K(e.inShapeX + o, c.w)};top:${K(e.inShapeY, c.h)};width:${K(s, c.w)};height:${K(e.h, c.h)};background:${n};pointer-events:none;`, c.div.appendChild(l);
		}
	}
}
//#endregion
//#region packages/pptx/src/find.ts
var An = class {
	_slideRuns = /* @__PURE__ */ new Map();
	_matches = [];
	_active = -1;
	constructor(e, t) {
		this._slideCount = e, this._collectSlideRuns = t;
	}
	invalidate() {
		this._slideRuns.clear(), this._matches = [], this._active = -1;
	}
	slideRuns(e) {
		return this._slideRuns.get(e);
	}
	setSlideRuns(e, t) {
		this._slideRuns.set(e, t);
	}
	slideHighlights(e) {
		let t = [];
		for (let n = 0; n < this._matches.length; n++) {
			let r = this._matches[n];
			r.slide === e && t.push({
				slices: r.slices,
				active: n === this._active
			});
		}
		return t;
	}
	activeSlide() {
		let e = this._matches[this._active];
		return e ? e.slide : null;
	}
	matches() {
		return this._matches.map((e, t) => ({
			matchIndex: t,
			text: e.text,
			location: { slide: e.slide }
		}));
	}
	async find(e, t = {}) {
		if (this._matches = [], this._active = -1, e.length === 0) return [];
		let n = this._slideCount();
		for (let r = 0; r < n; r++) {
			let n = await this._ensureSlideRuns(r), i = ve(n);
			for (let a of re(i, e, t)) {
				let e = a.slices.map((e) => n[e.runIndex].text.slice(e.start, e.end)).join("");
				this._matches.push({
					slide: r,
					text: e,
					slices: a.slices
				});
			}
		}
		return this.matches();
	}
	next() {
		return this._active = xe(this._active, this._matches.length), this._activePublic();
	}
	prev() {
		return this._active = ue(this._active, this._matches.length), this._activePublic();
	}
	_activePublic() {
		let e = this._matches[this._active];
		return e ? {
			matchIndex: this._active,
			text: e.text,
			location: { slide: e.slide }
		} : null;
	}
	async _ensureSlideRuns(e) {
		let t = this._slideRuns.get(e);
		if (t) return t;
		let n = await this._collectSlideRuns(e);
		return this._slideRuns.set(e, n), n;
	}
};
//#endregion
//#region packages/pptx/src/types.ts
function jn(e) {
	return e;
}
//#endregion
//#region packages/pptx/src/hyperlink.ts
function Mn(e, t) {
	let n = e !== void 0 && e !== "" ? e : void 0, r = t !== void 0 && t !== "" ? t : void 0;
	if (n === void 0 && r === void 0) return;
	if (r !== void 0) return {
		kind: "internal",
		ref: n ?? r
	};
	let i = n, a = z(i);
	return a !== null && ye.includes(a) ? {
		kind: "external",
		url: i
	} : {
		kind: "internal",
		ref: i
	};
}
//#endregion
//#region packages/pptx/src/media-chrome.ts
function Nn(e, t, n, r, i, a) {
	let o = Math.max(18, Math.min(32, Math.min(r, i) * .25));
	if (e.save(), e.shadowColor = "rgba(0, 0, 0, 0.3)", e.shadowBlur = o * .35, e.fillStyle = "rgba(20, 20, 20, 0.7)", e.beginPath(), e.arc(t, n, o, 0, Math.PI * 2), e.fill(), e.shadowColor = "transparent", e.shadowBlur = 0, e.fillStyle = "#fff", a === "paused") {
		e.beginPath();
		let r = o * .48;
		e.moveTo(t - r * .4, n - r), e.lineTo(t - r * .4, n + r), e.lineTo(t + r * .75, n), e.closePath(), e.fill();
	} else {
		let r = o * .2, i = o * .8, a = o * .15;
		e.fillRect(t - a - r, n - i / 2, r, i), e.fillRect(t + a, n - i / 2, r, i);
	}
	e.restore();
}
//#endregion
//#region packages/pptx/src/bidi-line.ts
var Pn = (e) => {
	let t = e.text;
	return typeof t == "string" ? t : void 0;
}, Fn = (e) => "isTab" in e;
function In(e) {
	for (let n of e) {
		let e = Pn(n);
		if (e !== void 0 && t(e)) return !0;
	}
	return !1;
}
function Ln(e, t) {
	let n = e.length;
	if (n === 0) return {
		order: [],
		rtl: []
	};
	let r = "", i = Array(n), a;
	for (let t = 0; t < n; t++) {
		i[t] = r.length;
		let n = Pn(e[t]) ?? "";
		if (r += n.length > 0 ? n : "￼", Fn(e[t])) {
			for (a ??= []; a.length < r.length;) a.push(null);
			a[i[t]] = "S";
		}
	}
	if (a) for (; a.length < r.length;) a.push(null);
	let { levels: o, paragraphLevel: s } = O().computeLevels(r, t ? "rtl" : "ltr", a), { order: c, segLevels: l } = je(o, s, i), u = Array(n);
	for (let e = 0; e < n; e++) u[e] = (l[e] & 1) == 1;
	return {
		order: c,
		rtl: u
	};
}
//#endregion
//#region packages/pptx/src/cjk-wrap.ts
function Rn(e, t, n, r) {
	if (e.length === 0) return 0;
	let i = t === 0, a = 0, o = t;
	for (let t of e) {
		if (o + t.w > n) {
			if (a > 0 || !i) break;
			o += t.w, a++;
			break;
		}
		o += t.w, a++;
	}
	return a === 0 ? 0 : a >= e.length ? e.length : l(e.map((e) => e.ch), a, r, +!!i);
}
//#endregion
//#region packages/pptx/src/text-justify.ts
var zn = (e) => /\s/.test(String.fromCodePoint(e));
function Bn(e, t, n, r, i) {
	if (r === "just" && i) return null;
	let a = t - n;
	if (a <= .5) return null;
	let o = Ne(e, a, {
		firstContentSi: 0,
		lastDrawnSi: e.length,
		isGapChar: v,
		isWhitespace: zn,
		seaClusterGaps: r === "thaiDist"
	});
	if (!o) return null;
	let { perGap: s, perSeg: c } = o, l = [];
	for (let t = 0; t < e.length; t++) {
		let n = e[t], r = c.get(t), i = r?.trailingGap ? s : 0, a = r?.splitBefore;
		a && a.length > 0 ? l.push({
			...n,
			jext: i,
			splitBefore: [...a],
			perGap: s
		}) : l.push({
			...n,
			jext: i
		});
	}
	return l;
}
//#endregion
//#region packages/pptx/src/table-border-conflict.ts
function Vn(e) {
	if (!e) return {
		r: 0,
		g: 0,
		b: 0
	};
	let t = e.replace(/^#/, "");
	return t.length < 6 || /[^0-9a-fA-F]/.test(t.slice(0, 6)) ? {
		r: 0,
		g: 0,
		b: 0
	} : {
		r: parseInt(t.slice(0, 2), 16),
		g: parseInt(t.slice(2, 4), 16),
		b: parseInt(t.slice(4, 6), 16)
	};
}
function Hn(e) {
	let t = Vn(e);
	return .299 * t.r + .587 * t.g + .114 * t.b;
}
function Un(e, t) {
	if (!e && !t) return null;
	if (!e) return t;
	if (!t) return e;
	if (e.width !== t.width) return e.width > t.width ? e : t;
	let n = Hn(e.color), r = Hn(t.color);
	return n === r || n < r ? e : t;
}
//#endregion
//#region packages/pptx/src/smartart-fallback-contrast.ts
function Wn(e) {
	let t = A(e.length === 8 ? e.slice(0, 6) : e);
	if (!t) return null;
	let n = N(t[0], t[1], t[2]);
	if (e.length !== 8) return n;
	let r = Number.parseInt(e.slice(6, 8), 16);
	if (Number.isNaN(r)) return null;
	let i = r / 255;
	return i * n + (1 - i);
}
function Gn(e) {
	if (!e) return null;
	if (e.fillType === "solid") return Wn(e.color);
	if (e.fillType === "gradient") {
		let t = e.stops.map((e) => ({
			p: Math.min(1, Math.max(0, e.position)),
			l: Wn(e.color)
		})).filter((e) => e.l !== null).sort((e, t) => e.p - t.p);
		if (t.length === 0) return null;
		let n = t[0], r = t[t.length - 1], i = n.l * n.p + r.l * (1 - r.p);
		for (let e = 0; e + 1 < t.length; e++) i += (t[e].l + t[e + 1].l) / 2 * (t[e + 1].p - t[e].p);
		return i;
	}
	return null;
}
function Kn(e) {
	return e.name === "SmartArt" && e.id === void 0;
}
function qn(e, t) {
	let n = Gn(e);
	if (n === null || n >= .5) return null;
	let r = Wn(t.replace(/^#/, ""));
	return r !== null && r >= .5 ? null : "#FFFFFF";
}
//#endregion
//#region packages/pptx/src/tab-layout.ts
function Jn(e, t, n, r, i, a = 0) {
	let o = e.map((e) => e.width), s = (t) => {
		let n = 0;
		for (let r = t; r < e.length && !e[r].isTab; r++) n += o[r];
		return n;
	}, c = n;
	for (let n = 0; n < e.length; n++) {
		if (!e[n].isTab) {
			c += o[n];
			continue;
		}
		let l = null;
		for (let e of t) e.pos > c && (l === null || e.pos < l.pos) && (l = e);
		if (l === null) if (a > 0) l = {
			pos: (Math.floor(c / a) + 1) * a,
			algn: "l"
		};
		else {
			o[n] = i, c += i;
			continue;
		}
		let u = s(n + 1), d = l.algn === "ctr" ? .5 : +(l.algn === "r" || l.algn === "dec"), f = l.pos - u * d;
		f + u > r && (f = r - u), f < c && (f = c), o[n] = f - c, c = f;
	}
	return o;
}
//#endregion
//#region packages/pptx/src/vertical-text.ts
var Yn = () => !1;
function Xn(e, t, n) {
	let r = e.textBaseline;
	e.textBaseline = "alphabetic";
	let i = e.measureText(t);
	e.textBaseline = r;
	let a = i.fontBoundingBoxAscent, o = i.fontBoundingBoxDescent;
	return typeof a == "number" && typeof o == "number" && (a !== 0 || o !== 0) ? (a - o) / 2 : .38 * n;
}
function Zn(e, t) {
	let n = e.textAlign, r = e.textBaseline;
	e.textAlign = "center", e.textBaseline = "middle";
	let i = e.measureText(t);
	e.textAlign = n, e.textBaseline = r;
	let a = i.actualBoundingBoxAscent, o = i.actualBoundingBoxDescent;
	return typeof a == "number" && typeof o == "number" ? (a - o) / 2 : 0;
}
function Qn(e, t, n, i, a, o, s = "fill", c = Yn) {
	let l = e.textAlign, u = e.textBaseline, d = s === "stroke" ? e.strokeText.bind(e) : e.fillText.bind(e), f = i - Xn(e, t, a), p = 0;
	for (let s of t) {
		let t = s.codePointAt(0) ?? 0, u = Oe(t), m = e.measureText(s).width + o, h = u === "Tr" ? Ae(t) : null, g = u === "Tr" && h === null && r(t), _ = u === "U" || u === "Tu" || h !== null || g;
		if (C(t) && c(t)) {
			let t = n + p + m / 2;
			e.save(), e.translate(t, f), e.rotate(-Math.PI / 2), e.textAlign = "center", e.textBaseline = "middle", Te(e, () => d(s, 0, 0)), e.restore();
		} else if (_) {
			let r = h === null && u === "Tu" ? L(t) : null, i = h === null ? r : h, o = i === null ? s : String.fromCodePoint(i), c = n + p + m / 2, l = r === null ? Zn(e, o) / a : 0;
			e.save(), e.translate(c, f), e.rotate(-Math.PI / 2), e.textAlign = "center", e.textBaseline = "middle", d(o, 0, l * a), e.restore();
		} else if (u === "Tr") {
			let t = n + p + m / 2;
			e.textAlign = "center", e.textBaseline = "middle", d(s, t, f);
		} else e.textAlign = l, e.textBaseline = "alphabetic", d(s, n + p, i);
		p += m;
	}
	e.textAlign = l, e.textBaseline = u;
}
function $n(e, t, n, r, i, a, o = "fill") {
	Qn(e, t, n, r, i, a, o, (t) => P(e, t));
}
//#endregion
//#region packages/pptx/src/renderer.ts
function Y(e, t) {
	return e * t;
}
var X = R;
function er(e, t, n, r, i, a, o) {
	let { top: s, height: c } = wn(n, i);
	e.fillStyle = a, e.fillRect(t, s, r, c), e.fillStyle = o;
}
function tr(e) {
	return !e || e.fillType === "none" ? null : e.fillType === "solid" ? X(e.color) : e.fillType === "gradient" ? e.stops.length > 0 ? X(e.stops[0].color) : null : e.fillType === "pattern" ? X(e.fg) : null;
}
function nr(e, t, n, r, i, a) {
	return ke(e, t, n, r, i, a);
}
var rr = /* @__PURE__ */ new WeakMap();
function ir(e, t) {
	let n = e.tinted.get(t);
	if (n) return n;
	let r = e.img.naturalWidth || 1, i = e.img.naturalHeight || 1, a = document.createElement("canvas");
	a.width = r, a.height = i;
	let o = a.getContext("2d");
	return o ? (o.drawImage(e.img, 0, 0, r, i), o.globalCompositeOperation = "source-in", o.fillStyle = t, o.fillRect(0, 0, r, i), e.tinted.set(t, a), a) : e.img;
}
function ar(e) {
	let t = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(e)}`, n = new Image();
	return new Promise((e, r) => {
		n.onload = () => e(n), n.onerror = r, n.src = t;
	});
}
var or = 256;
function sr(e, t, n) {
	let r = Math.max(1, Math.round(t * or)), i = Math.max(1, Math.round(n * or));
	return e.replace(/<svg([^>]*?)>/, (e, t) => `<svg${t.replace(/\s(?:width|height)="[^"]*"/g, "")} width="${r}" height="${i}">`);
}
function cr(e) {
	let t = [], n = (e) => {
		if (e) for (let n of e.paragraphs) for (let e of n.runs) e.type === "math" && t.push({
			nodes: e.nodes,
			display: e.display
		});
	};
	for (let t of e.elements) if (t.type === "shape") n(t.textBody);
	else if (t.type === "table") for (let e of t.rows) for (let t of e.cells) n(t.textBody);
	return t;
}
async function lr(e, t) {
	let n = cr(e);
	if (n.length !== 0) {
		await t.loadMathJax();
		for (let e of n) if (!rr.has(e.nodes)) try {
			let n = await t.mathMLToSvg(ge(e.nodes, e.display)), r = await ar(sr(Xe(n.svg, "#000000"), n.widthEm, n.ascentEm + n.descentEm));
			rr.set(e.nodes, {
				img: r,
				widthEm: n.widthEm,
				ascentEm: n.ascentEm,
				descentEm: n.descentEm,
				tinted: /* @__PURE__ */ new Map()
			});
		} catch {}
	}
}
function ur(e, t) {
	return e ? e.startsWith("+") ? e === "+mj-lt" || e === "+mj-ea" || e === "+mj-cs" ? t.themeMajorFont ?? "sans-serif" : t.themeMinorFont ?? "sans-serif" : e.split(",")[0].trim() || (t.themeMinorFont ?? "sans-serif") : t.themeMinorFont ?? "sans-serif";
}
var dr = new Set([
	"serif",
	"sans-serif",
	"monospace",
	"cursive",
	"fantasy",
	"system-ui"
]);
function fr(e) {
	let t = h(e);
	return t === "mono" ? "monospace" : t === "serif" ? "serif" : "sans-serif";
}
var pr = {
	calibri: "Carlito",
	"calibri light": "Carlito",
	cambria: "Caladea",
	"cambria math": "Caladea",
	"sakkal majalla": "Noto Naskh Arabic",
	"traditional arabic": "Noto Naskh Arabic",
	"simplified arabic": "Noto Naskh Arabic",
	"arabic typesetting": "Noto Naskh Arabic",
	"univers next arabic": "Noto Sans Arabic"
}, mr = "\"Noto Naskh Arabic\", \"Noto Sans Arabic\"";
function hr(e) {
	if (pr[e.toLowerCase()]?.includes("Arabic")) return !0;
	let t = e.toLowerCase();
	return /arabic|naskh|kufi|nastaliq|amiri|scheherazade|lateef|aldhabi|urdu|farsi|العرب|[؀-ۿ]/.test(t);
}
function gr(e) {
	return e.map((e) => `"${e}"`).join(", ");
}
function _r(e) {
	let t = fr(e), n = pr[e.toLowerCase()], r = n ? `"${n}", ` : "";
	if (hr(e)) return `"${e}", ${r}${mr}, ${t}`;
	let i = t === "serif" ? "serif" : "sans", o = u(e);
	return `"${e}", ${r}${o ? `${gr(a(o, i))}, ` : ""}${`${gr(i === "serif" ? y : _)}, `}${t}`;
}
function vr(e) {
	return e ? e.kind === "external" ? `e:${e.url}` : `i:${e.ref}` : "";
}
function Z(e, t, n, r, i) {
	let a = t ? "italic " : "", o = e ? "bold " : "", s = ur(r, i);
	return dr.has(s) ? `${a}${o}${n}px ${s}` : `${a}${o}${n}px ${_r(s)}`;
}
function yr(e) {
	return e.bullet.type === "char" || e.bullet.type === "autoNum" || jn(e.bullet).type === "blip";
}
function br(e, t) {
	return e ? 0 : Math.max(0, t);
}
function xr(e, t, n, r, i, a, o) {
	let s = (t.defaultFontSize ?? 18) * G * a;
	for (let c of t.paragraphs) {
		let l = Y(c.marL, a), u = Y(c.marR, a), d = Y(c.indent, a), f = br(yr(c), d), p = n - r - i - l - u - f, m = 0;
		for (let n of c.runs) {
			if (n.type !== "text") continue;
			let r = n.fontSize == null ? c.defFontSize == null ? s : c.defFontSize * G * a : n.fontSize * G * a, i = ur(n.fontFamily ?? c.defFontFamily ?? null, o);
			if (e.font = Z(n.bold ?? c.defBold ?? t.defaultBold ?? !1, n.italic ?? c.defItalic ?? t.defaultItalic ?? !1, r, i, o), m += e.measureText(n.text).width, m > p) return !0;
		}
	}
	return !1;
}
function Sr(e) {
	for (let t of e) if (v(t.codePointAt(0) ?? 0)) return !0;
	return !1;
}
function Q(e) {
	let t = 0;
	for (let n of e) t++;
	return t;
}
function Cr(e, t, n, r, a, o, s, c = !1, l = !1, u = 1, d, f = {
	themeMajorFont: null,
	themeMinorFont: null,
	dpr: 1
}, p = 0) {
	let h = [], _ = () => n - (h.length === 0 ? p : 0), y = { segments: [] }, x = 0, S = !1, C = t.rtl === !0, T = Y(t.marR, o), E = (t.tabStops ?? []).map((e) => ({
		pos: Y(e.pos, o),
		algn: e.algn
	})), D = Y(t.defTabSz ?? 914400, o), O = !1, k = [], A = 0, j = () => C ? T : s + (h.length === 0 ? p : 0), M = (e = 0) => {
		let t = Jn(e > 0 ? [...k, {
			isTab: !1,
			width: e
		}] : k, E, j(), Infinity, A, D), n = 0;
		for (let e of t) n += e;
		return n;
	}, N = (e) => {
		let t = _();
		return Number.isFinite(t) ? O ? M(e) <= t : x + e <= t : !0;
	}, P = () => {
		let e = _();
		if (!O) return e - x;
		if (!Number.isFinite(e)) return Infinity;
		if (M(0) >= e) return 0;
		let t = 0, n = e;
		for (let r = 0; r < 40; r++) {
			let r = (t + n) / 2;
			M(r) <= e ? t = r : n = r;
		}
		return t;
	}, F = (e = !1) => {
		e && (y.endsWithBreak = !0), h.push(y), y = { segments: [] }, x = 0, O = !1, k = [], S = !1;
	}, I = (t, n, r, i, a, o, s, c) => {
		if (!t) return;
		e.font = n;
		let l = c?.letterSpacingPx ?? 0, u = e.measureText(t).width + l * Q(t), d = c?.strikeDouble, f = c?.underlineStyle, p = c?.underlineColor, m = c?.shadow, h = c?.outline, g = c?.highlight, _ = c?.fontFamily, v = c?.hyperlink, b = (e) => !e.math && !e.isTab && e.font === n && e.color === i && e.underline === a && (e.underlineStyle ?? "") === (f ?? "") && (e.underlineColor ?? "") === (p ?? "") && e.strikethrough === o && (e.strikeDouble ?? !1) === (d ?? !1) && (e.letterSpacingPx ?? 0) === l && e.baseline === s && e.shadow === m && e.outline === h && (e.highlight ?? "") === (g ?? "") && (e.fontFamily ?? "") === (_ ?? "") && vr(e.hyperlink) === vr(v);
		x += u, k.push({
			isTab: !1,
			width: u
		});
		let S = y.segments.at(-1);
		S && b(S) ? S.text += t : y.segments.push({
			text: t,
			font: n,
			fontFamily: _,
			sizePx: r,
			color: i,
			underline: a,
			underlineStyle: f,
			underlineColor: p,
			strikethrough: o,
			strikeDouble: d,
			letterSpacingPx: l || void 0,
			baseline: s,
			shadow: m,
			outline: h,
			highlight: g,
			hyperlink: v
		});
	}, L = () => {
		let e = y.segments.at(-1);
		if (!e || e.math) return !1;
		let t = /^(.*\s)(\S+)$/s.exec(e.text), n;
		if (t) e.text = t[1], n = t[2];
		else if (y.segments.length > 1) y.segments.pop(), n = e.text;
		else return !1;
		return F(), I(n, e.font, e.sizePx, e.color, e.underline, e.strikethrough, e.baseline, {
			strikeDouble: e.strikeDouble,
			letterSpacingPx: e.letterSpacingPx,
			underlineStyle: e.underlineStyle,
			underlineColor: e.underlineColor,
			shadow: e.shadow,
			outline: e.outline,
			highlight: e.highlight,
			fontFamily: e.fontFamily
		}), !0;
	};
	for (let n of t.runs) {
		if (n.type === "break") {
			F(!0);
			continue;
		}
		if (n.type === "math") {
			let e = rr.get(n.nodes), t = n.fontSize == null ? r : n.fontSize * G * o * u, i = e ? e.widthEm * t : 0, s = e ? e.ascentEm * t : 0, c = e ? e.descentEm * t : 0;
			(n.display && x > 0 || !N(i) && x > 0) && F(), k.push({
				isTab: !1,
				width: i
			}), y.segments.push({
				text: "",
				font: `${t}px sans-serif`,
				sizePx: t,
				color: n.color ? X(n.color) : a,
				underline: !1,
				strikethrough: !1,
				math: {
					nodes: n.nodes,
					display: n.display,
					width: i,
					ascent: s,
					descent: c
				}
			}), x += i, n.display && F();
			continue;
		}
		let s = n.fontSize == null ? r : n.fontSize * G * o * u, p = ur(n.fontFamily ?? t.defFontFamily ?? null, f), h = n.fontFamilyEa ? ur(n.fontFamilyEa, f) : null, C = n.fontFamilySym ? ur(n.fontFamilySym, f) : null, T;
		T = n.color ? X(n.color) : n.hyperlink && f.themeHlinkColor ? X(f.themeHlinkColor) : a;
		let E = n.bold ?? t.defBold ?? c, D = n.italic ?? t.defItalic ?? l, j = Z(E, D, s, p, f), M = h ? Z(E, D, s, h, f) : j;
		e.font = j;
		let R = n.caps, z = n.text;
		(R === "all" || R === "small") && (z = z.toUpperCase());
		let B = n.fieldType === "slidenum" && d !== void 0 ? String(d) : z, V = n.underline || n.hyperlink !== void 0, H = n.strikeDouble === !0, U = n.letterSpacing == null ? 0 : n.letterSpacing * G * o, W = {
			strikeDouble: H,
			letterSpacingPx: U,
			underlineStyle: n.underlineStyle,
			underlineColor: n.underlineColor ? X(n.underlineColor) : void 0,
			shadow: n.shadow,
			outline: n.outline,
			fontFamily: p,
			highlight: n.highlight ? X(n.highlight) : void 0,
			hyperlink: Mn(n.hyperlink)
		}, ee = B.split(/(\s+)/);
		for (let r of ee) {
			if (!r) continue;
			if (/^\t+$/.test(r)) {
				O || (e.font = j, A = e.measureText(" ").width);
				for (let e of r) y.segments.push({
					text: "",
					isTab: !0,
					font: j,
					fontFamily: p,
					sizePx: s,
					color: T,
					underline: !1,
					strikethrough: !1
				}), k.push({
					isTab: !0,
					width: 0
				});
				O = !0;
				continue;
			}
			e.font = j;
			let a = e.measureText(r).width, o = /^\s+$/.test(r), c = /[-]/;
			if (c.test(r) && (C != null || Ie(p))) {
				let t = C ?? p;
				for (let i of r) {
					let r = i, a = j;
					if (c.test(i)) {
						let e = Ve(i, t);
						e === i ? a = Z(E, D, s, t, f) : (r = e, a = Z(E, D, s, "sans-serif", f));
					}
					e.font = a;
					let o = e.measureText(r).width;
					!N(o) && x > 0 && F(), I(r, a, s, T, V, n.strikethrough, n.baseline ?? void 0, W);
				}
				continue;
			}
			if (Sr(r) && (!De(r) || t.eaLnBrk === !1)) {
				let i = [];
				for (let t of r) {
					let n = v(t.codePointAt(0) ?? 0) && h != null, r = n ? M : j, a = n ? h : p;
					e.font = r, i.push({
						ch: t,
						w: e.measureText(t).width,
						font: r,
						family: a
					});
				}
				if (t.eaLnBrk === !1) {
					let e = i.reduce((e, t) => e + t.w, 0);
					x > 0 && !N(e) && F();
					for (let e of i) I(e.ch, e.font, s, T, V, n.strikethrough, n.baseline ?? void 0, {
						...W,
						fontFamily: e.family
					});
					continue;
				}
				let a = i;
				for (; a.length > 0;) {
					let e = Number.isFinite(_()) ? _() - P() : x, t = Rn(a, e, _(), m);
					if (t === 0) {
						if (x > 0) {
							F();
							continue;
						}
						t = 1;
					}
					for (let e = 0; e < t; e++) {
						let t = a[e];
						I(t.ch, t.font, s, T, V, n.strikethrough, n.baseline ?? void 0, {
							...W,
							fontFamily: t.family
						});
					}
					a = a.slice(t), a.length > 0 && F();
				}
				continue;
			}
			if (De(r)) {
				let t = ae(r, {
					cjk: !0,
					kinsoku: m
				}), a = h != null && M !== j, o = (e) => a && v(e.codePointAt(0) ?? 0), c = (t) => {
					let n = U * Q(t), r = "", i = null, a = () => {
						r !== "" && (e.font = i ? M : j, n += e.measureText(r).width, r = "");
					};
					for (let e of t) {
						let t = o(e);
						i === null || t === i ? (r += e, i = t) : (a(), r = e, i = t);
					}
					return a(), n;
				}, l = (e) => {
					let t = "", r = null, i = () => {
						if (t === "") return;
						let e = r ? M : j, i = r ? h : p;
						I(t, e, s, T, V, n.strikethrough, n.baseline ?? void 0, {
							...W,
							fontFamily: i
						}), t = "";
					};
					for (let n of e) {
						let e = o(n);
						r === null || e === r ? (t += n, r = e) : (i(), t = n, r = e);
					}
					i();
				}, u = b(r), d = r.length, f = 0;
				for (; f < d;) {
					let e = P(), n = w(r, t, f, e, c, u);
					if (n <= f) {
						if (x > 0) {
							F();
							continue;
						}
						let a = t.find((e) => e > f) ?? d, o = r.slice(f, a), s = i(o), l = w(o, s, 0, e, c, u);
						l <= 0 && (l = s.length > 0 ? s[0] : o.length), n = f + l;
					}
					l(r.slice(f, n)), f = n, f < d && F();
				}
				continue;
			}
			if (N(a)) I(r, j, s, T, V, n.strikethrough, n.baseline ?? void 0, W), o && (S = !0);
			else if (o) x > 0 && F();
			else if (a > _()) {
				x > 0 && F();
				for (let t of r) {
					e.font = j;
					let r = e.measureText(t).width;
					!N(r) && x > 0 && F(), I(t, j, s, T, V, n.strikethrough, n.baseline ?? void 0, W);
				}
			} else if (!S) I(r, j, s, T, V, n.strikethrough, n.baseline ?? void 0, W);
			else {
				let e = y.segments.at(-1)?.text ?? "", t = r.codePointAt(0), i = [...e].at(-1)?.codePointAt(0), a = /\S$/u.test(e) && /^\S/u.test(r) && i !== 8203 && t !== 8203, o = t !== void 0 && m.lineStartForbidden.has(t) && a, c = i !== void 0 && t !== void 0 && a && !De(e) && !De(r) && g(i, t);
				(o || c) && L() || F(), I(r, j, s, T, V, n.strikethrough, n.baseline ?? void 0, W);
			}
		}
	}
	return h.push(y), h;
}
async function wr(e, t, n, r, i, a) {
	if (t && t.fillType === "image") {
		if (e.fillStyle = "#FFFFFF", e.fillRect(0, 0, n, r), !t.imagePath || !t.mimeType || !a) return;
		try {
			let o = await Ge(t.imagePath, t.mimeType, t.duotone, a, {
				widthPt: n / i / G,
				heightPt: r / i / G
			});
			if (!o) return;
			if (e.save(), e.beginPath(), e.rect(0, 0, n, r), e.clip(), t.alpha != null && (e.globalAlpha = t.alpha), t.tile) Dr(e, o, t.tile, n, r, i);
			else {
				let i = t.fillRect ?? {}, a = i.l ?? 0, s = i.t ?? 0, c = i.r ?? 0, l = i.b ?? 0, u = a * n, d = s * r, f = n * (1 - a - c), p = r * (1 - s - l);
				e.drawImage(o, u, d, f, p);
			}
			e.restore();
		} catch {}
		return;
	}
	e.fillStyle = nr(t, e, 0, 0, n, r) ?? "#FFFFFF", e.fillRect(0, 0, n, r);
}
var Tr = 9525;
function Er(e, t, n, r, i) {
	let a;
	a = e === "t" || e === "ctr" || e === "b" ? (t - r) / 2 : e === "tr" || e === "r" || e === "br" ? t - r : 0;
	let o;
	return o = e === "l" || e === "ctr" || e === "r" ? (n - i) / 2 : e === "bl" || e === "b" || e === "br" ? n - i : 0, {
		ax: a,
		ay: o
	};
}
function Dr(e, t, n, r, i, a) {
	let o = t.width * Tr * n.sx * a, s = t.height * Tr * n.sy * a;
	if (!(o > 0) || !(s > 0)) return;
	let c = n.flip === "x" || n.flip === "xy", l = n.flip === "y" || n.flip === "xy", u = T(o * (c ? 2 : 1), s * (l ? 2 : 1));
	if (!u) return;
	let d = u.getContext("2d");
	if (!d) return;
	let f = (e, n, r, i) => {
		d.save(), d.translate(e + (r ? o : 0), n + (i ? s : 0)), d.scale(r ? -1 : 1, i ? -1 : 1), d.drawImage(t, 0, 0, o, s), d.restore();
	};
	f(0, 0, !1, !1), c && f(o, 0, !0, !1), l && f(0, s, !1, !0), c && l && f(o, s, !0, !0);
	let p = e.createPattern(u, "repeat");
	if (!p) return;
	let { ax: m, ay: h } = Er(n.algn, r, i, o, s), g = m + Y(n.tx, a), _ = h + Y(n.ty, a);
	typeof p.setTransform == "function" && typeof DOMMatrix < "u" ? (p.setTransform(new DOMMatrix().translateSelf(g, _)), e.fillStyle = p, e.fillRect(0, 0, r, i)) : (e.save(), e.translate(g, _), e.fillStyle = p, e.fillRect(-g, -_, r, i), e.restore());
}
function Or(e, t, n) {
	if (!t) return;
	let r = t.dir * Math.PI / 180, i = Y(t.dist, n);
	e.shadowColor = X(t.color, t.alpha), e.shadowBlur = Y(t.blur, n), e.shadowOffsetX = Math.cos(r) * i, e.shadowOffsetY = Math.sin(r) * i;
}
function kr(e, t, n) {
	t && (e.shadowColor = X(t.color, t.alpha), e.shadowBlur = Y(t.radius, n), e.shadowOffsetX = 0, e.shadowOffsetY = 0);
}
function Ar(e) {
	e.shadowColor = "transparent", e.shadowBlur = 0, e.shadowOffsetX = 0, e.shadowOffsetY = 0;
}
var jr = 8, Mr = 1, Nr = 1, Pr = 256;
function Fr(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m) {
	if (r <= 0) return;
	let h = e.measureText(t), g = h.actualBoundingBoxAscent > 0 ? h.actualBoundingBoxAscent : r, _ = h.actualBoundingBoxDescent > 0 ? h.actualBoundingBoxDescent : r * .25, v = h.actualBoundingBoxLeft > 0 ? h.actualBoundingBoxLeft : 0, y = h.actualBoundingBoxRight > 0 ? h.actualBoundingBoxRight : r, b = r * l * i, x = Math.min(Pr, Math.max(1, Math.round(b / jr))), S = (e) => Rr(e, a, r, o, s, c, u, d), C = S(x), w = Br(C, a, o, s, c, u, d, l, i, -g, _);
	for (; w > Nr && x < Pr;) {
		let e = Math.min(Pr, x * 2), t = S(e), n = Br(t, a, o, s, c, u, d, l, i, -g, _);
		if (n >= w * .75) {
			C = t;
			break;
		}
		x = e, C = t, w = n;
	}
	let E = 1e4, D = Mr / (l * i), O = C.length - 1, k = (e, t, n) => e === 0 ? -E : t - n - D, A = (e, t, n) => e === O ? E : t - n + D, j = (e, r) => {
		e.fillStyle = r;
		for (let r = 0; r <= O; r++) {
			let { s0: i, s1: a, g: o } = C[r], s = (i + a) / 2;
			e.save(), e.translate(f + o.x, p + o.y), e.rotate(o.angle), o.shear !== 0 && e.transform(1, 0, o.shear, 1, 0, 0), (l !== 1 || o.vScale !== 1) && e.scale(l, o.vScale), e.beginPath();
			let c = k(r, i, s), u = A(r, a, s);
			e.rect(c, -E, u - c, 2 * E), e.clip(), e.fillText(t, -s + n / 2, 0), e.restore();
		}
	}, M = Ir(m), N = typeof e.globalAlpha == "number" ? e.globalAlpha : 1;
	if (M >= 1 && N >= 1) {
		j(e, m);
		return;
	}
	if (M <= 0 || N <= 0) return;
	let P = typeof e.getTransform == "function" ? e.getTransform() : null;
	if (!P) {
		j(e, m);
		return;
	}
	let F = Infinity, I = Infinity, L = -Infinity, R = -Infinity;
	for (let e = 0; e <= O; e++) {
		let { s0: t, s1: r, g: i } = C[e], a = (t + r) / 2, o = -a + n / 2, s = Math.max(k(e, t, a), o - v), c = Math.min(A(e, r, a), o + y);
		if (!(c <= s)) for (let [e, t] of [
			[s, -g],
			[c, -g],
			[s, _],
			[c, _]
		]) {
			let n = zr(i, l, e, t), r = f + n.x, a = p + n.y, o = P.a * r + P.c * a + P.e, s = P.b * r + P.d * a + P.f;
			o < F && (F = o), o > L && (L = o), s < I && (I = s), s > R && (R = s);
		}
	}
	if (!(L > F && R > I)) return;
	let z = Math.floor(F - 2), B = Math.floor(I - 2), V = T(Math.ceil(L + 2) - z, Math.ceil(R + 2) - B), H = V ? V.getContext("2d") : null;
	if (!V || !H) {
		j(e, m);
		return;
	}
	H.font = e.font, H.textAlign = "left", H.textBaseline = "alphabetic", H.setTransform(P.a, P.b, P.c, P.d, P.e - z, P.f - B), j(H, Lr(m)), e.save(), e.setTransform(1, 0, 0, 1, 0, 0), e.globalAlpha = N * M, e.drawImage(V, z, B), e.restore();
}
function Ir(e) {
	let t = /^rgba?\(\s*[\d.]+\s*,\s*[\d.]+\s*,\s*[\d.]+\s*,\s*([\d.]+)\s*\)$/i.exec(e);
	if (!t) return 1;
	let n = parseFloat(t[1]);
	return Number.isFinite(n) ? Math.min(1, Math.max(0, n)) : 1;
}
function Lr(e) {
	let t = /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i.exec(e);
	return t ? `rgb(${t[1]}, ${t[2]}, ${t[3]})` : e;
}
function Rr(e, t, n, r, i, a, o, s) {
	let c = Array(e);
	for (let l = 0; l < e; l++) {
		let u = l / e * n, d = (l + 1) / e * n;
		c[l] = {
			s0: u,
			s1: d,
			g: vt(t, (r + (u + d) / 2) / i * a, o, s)
		};
	}
	return c;
}
function zr(e, t, n, r) {
	let i = n * t, a = r * e.vScale, o = i + e.shear * a, s = Math.cos(e.angle), c = Math.sin(e.angle);
	return {
		x: e.x + s * o - c * a,
		y: e.y + c * o + s * a
	};
}
function Br(e, t, n, r, i, a, o, s, c, l, u) {
	let d = 0;
	for (let f of e) {
		let e = (f.s0 + f.s1) / 2;
		for (let p of [f.s0, f.s1]) {
			let m = vt(t, (n + p) / r * i, a, o);
			for (let t of [l, u]) {
				let n = zr(m, s, 0, t), r = zr(f.g, s, p - e, t), i = Math.hypot(r.x - n.x, r.y - n.y) * c;
				i > d && (d = i);
			}
		}
	}
	return d;
}
function Vr(e, t, n, r, i, a, o, s, c, l, u) {
	let d = i, f = a, p = Math.max(1, o), m = Math.max(1, s), h = mt(n, r, p, m);
	if (!h) return;
	let g = t.defaultBold ?? !1, _ = t.defaultItalic ?? !1, v = (t.defaultFontSize ?? 18) * G * c, y = [];
	for (let n of t.paragraphs) {
		let t = Cr(e, n, Infinity, n.defFontSize == null ? v : n.defFontSize * G * c, n.defColor ? X(n.defColor) : l, c, 0, g, _, 1, void 0, u, 0);
		for (let e of t) y.push(e);
	}
	if (y.length === 0) return;
	e.save(), e.textAlign = "left", e.textBaseline = "alphabetic";
	let b = -1, x = () => {
		if (b >= 0) return b;
		let t = typeof e.getTransform == "function" ? e.getTransform() : null, n = t ? Math.abs(t.a * t.d - t.b * t.c) : 1;
		return b = n > 0 ? Math.sqrt(n) : 1, b;
	}, S = y.length;
	for (let t = 0; t < S; t++) {
		let n = y[t], r = t / S, i = (t + 1) / S, a = 0, o = 0, s = 0, c = 0;
		for (let t of n.segments) {
			if (t.math) {
				a += t.math.width, o = Math.max(o, t.sizePx), s = Math.max(s, t.math.ascent), c = Math.max(c, t.math.descent);
				continue;
			}
			e.font = t.font;
			let n = t.letterSpacingPx ?? 0, r = e.measureText(t.text);
			a += r.width + n * Q(t.text), o = Math.max(o, t.sizePx), r.actualBoundingBoxAscent > 0 && (s = Math.max(s, r.actualBoundingBoxAscent)), r.actualBoundingBoxDescent > 0 && (c = Math.max(c, r.actualBoundingBoxDescent));
		}
		if (a <= 0) continue;
		let l = s + c > 0 ? s + c : o, u = h.singleEdge ? .8 : l > 0 ? s / l : .8, g = h.singleEdge ? 1 : p / a, _ = h.singleEdge ? m : l / (i - r), v = _t(h, a), b = 0;
		for (let t of n.segments) {
			if (t.math) {
				b += t.math.width;
				continue;
			}
			e.font = t.font, e.fillStyle = t.color;
			let n = t.letterSpacingPx ?? 0, o = [...t.text];
			for (let s of o) {
				let o = e.measureText(s).width + n, c = r + u * (i - r);
				if (!h.singleEdge && o > 0) {
					Fr(e, s, n, o, x(), h, b, a, v, g, _, c, d, f, t.color), b += o;
					continue;
				}
				let l = vt(h, (b + o / 2) / a * v, _, c);
				e.save(), e.translate(d + l.x, f + l.y), e.rotate(l.angle), l.shear !== 0 && e.transform(1, 0, l.shear, 1, 0, 0), (g !== 1 || l.vScale !== 1) && e.scale(g, l.vScale), e.fillText(s, -o / 2 + n / 2, 0), e.restore(), b += o;
			}
		}
	}
	e.restore();
}
function Hr(e, t, n, r, i, a, o) {
	let s = Math.min(r, i);
	switch (e) {
		case "rightarrow":
		case "leftarrow": {
			let c = Math.min(Math.max(a ?? 5e4, 0), 1e5), l = s * Math.min(Math.max(o ?? 5e4, 0), 1e5) / 1e5, u = i * c / 2e5, d = n + i / 2 - u, f = 2 * u, p = Math.max(0, r - l);
			return e === "rightarrow" ? {
				tx: t,
				ty: d,
				tw: p,
				th: f
			} : {
				tx: t + l,
				ty: d,
				tw: p,
				th: f
			};
		}
		case "roundrect": {
			let e = s * Math.min(Math.max(a ?? 16667, 0), 1e5) / 1e5 * (1 - 1 / Math.SQRT2);
			return {
				tx: t + e,
				ty: n + e,
				tw: Math.max(0, r - 2 * e),
				th: Math.max(0, i - 2 * e)
			};
		}
		default: return null;
	}
}
function Ur(e, t) {
	return e.defaultTextColor ? X(e.defaultTextColor) : t.smartArtFallbackTextColor != null && Kn(e) ? t.smartArtFallbackTextColor : null;
}
function Wr(e, t, n, r = "#000000", i, a = {
	themeMajorFont: null,
	themeMinorFont: null,
	dpr: 1
}, o, s) {
	let c = Y(t.x, n), l = Y(t.y, n), u = Y(t.width, n), d = Y(t.height, n);
	if (d === 0 && t.textBody?.verticalAnchor === "b") {
		if (t.stroke && (e.save(), $(e, t.stroke, n), e.beginPath(), e.moveTo(c, l), e.lineTo(c + u, l), e.stroke(), e.restore()), t.textBody) {
			let f = Ur(t, a);
			Xr(e, t.textBody, c, l, u, d, n, f, t.rotation, t.flipH, t.flipV, r, i, a, o, !1, s);
		}
		return;
	}
	let f = t.scene3d && It(t.scene3d.camera) ? t.scene3d : null;
	if (f && u > 0 && d > 0) {
		let o = e.getTransform(), s = Math.abs(o.a * o.d - o.b * o.c), p = s > 0 ? Math.sqrt(s) : 1, m = Zr(t.sp3d, t.scene3d?.lightRig, t.sp3d?.prstMaterial, n, p), h = Qr(t.sp3d, f.camera, u, d, n, p);
		e.save(), (t.rotation !== 0 || t.flipH || t.flipV) && (e.translate(c + u / 2, l + d / 2), e.rotate(t.rotation * Math.PI / 180), t.flipH && e.scale(-1, 1), t.flipV && e.scale(1, -1), e.translate(-(c + u / 2), -(l + d / 2)));
		let g = {
			...t,
			x: 0,
			y: 0,
			rotation: 0,
			flipH: !1,
			flipV: !1,
			scene3d: void 0
		};
		if ($r(e, f.camera, c, l, u, d, (e) => {
			Wr(e, g, n, r, i, a, void 0);
		}, {
			bevels: m,
			extrusion: h ?? void 0,
			edgePadCss: (t.stroke ? t.stroke.width * n / 2 : 0) + (t.sp3d?.contourW ? t.sp3d.contourW * n : 0) + (h ? Math.hypot(h.offsetX, h.offsetY) / p : 0) + 2
		})) {
			e.restore();
			return;
		}
		e.restore();
	}
	e.save(), (t.rotation !== 0 || t.flipH || t.flipV) && (e.translate(c + u / 2, l + d / 2), e.rotate(t.rotation * Math.PI / 180), t.flipH && e.scale(-1, 1), t.flipV && e.scale(1, -1), e.translate(-(c + u / 2), -(l + d / 2)));
	let p = t.geometry.toLowerCase(), m = nr(t.fill, e, c, l, u, d);
	Or(e, t.shadow ?? null, n), t.shadow || kr(e, t.glow ?? null, n);
	let h = new Set([
		"line",
		"straightconnector1",
		"bentconnector2",
		"bentconnector3",
		"bentconnector4",
		"bentconnector5",
		"curvedconnector2",
		"curvedconnector3",
		"curvedconnector4",
		"curvedconnector5"
	]), g = new Set([
		"callout1",
		"callout2",
		"callout3",
		"bordercallout1",
		"bordercallout2",
		"bordercallout3",
		"accentcallout1",
		"accentcallout2",
		"accentcallout3",
		"accentbordercallout1",
		"accentbordercallout2",
		"accentbordercallout3"
	]), _ = (e) => g.has(e) || e === "line" || e === "straightconnector1" || e.startsWith("bentconnector"), v = !t.custGeom && W(p), y = (e, r) => {
		let i = r ?? m, a = r ? null : t.stroke ? () => {
			$(e, t.stroke, n), e.stroke();
		} : null, o = () => Ar(e);
		if (v && !r) {
			he(e, p, c, l, u, d, [
				t.adj,
				t.adj2,
				t.adj3,
				t.adj4,
				t.adj5,
				t.adj6,
				t.adj7,
				t.adj8
			], i, a, o, _(p) ? { skipTrailingStroke: !0 } : void 0);
			return;
		}
		e.beginPath(), t.custGeom && t.custGeom.length > 0 ? Gr(e, t.custGeom, c, l, u, d) : We(e, p, c, l, u, d, t.adj, t.adj2, t.adj3, t.adj4), i && p !== "arc" && (e.fillStyle = i, p === "donut" || p === "smileyface" || p === "frame" ? e.fill("evenodd") : e.fill(), r || o()), a && a();
	}, b = e.canvas.width || 0, x = e.canvas.height || 0, S = e.getTransform(), C = Math.abs(S.a * S.d - S.b * S.c), w = C > 0 ? Math.sqrt(C) : 1, T = {
		x: c * w,
		y: l * w,
		w: u * w,
		h: d * w
	}, E = n * w, D = (e) => {
		e.setTransform(S);
	};
	if (t.reflection && b > 0 && x > 0 && (e.save(), e.setTransform(new DOMMatrix()), Tt(e, (e) => {
		D(e), y(e);
	}, T, t.reflection, E, b, x), e.restore()), t.softEdge && b > 0 && x > 0 ? (e.save(), e.setTransform(new DOMMatrix()), wt(e, (e) => {
		D(e), y(e);
	}, T, t.softEdge, E, b, x, (e) => {
		D(e), y(e, "#000");
	}), e.restore()) : y(e), t.innerShadow && b > 0 && x > 0 && (e.save(), e.setTransform(new DOMMatrix()), Ct(e, (e) => {
		D(e), y(e, "#000");
	}, T, t.innerShadow, E, b, x), e.restore()), t.stroke && (h.has(p) || g.has(p))) {
		let r = H(p, c, l, u, d, [
			t.adj,
			t.adj2,
			t.adj3,
			t.adj4,
			t.adj5,
			t.adj6,
			t.adj7,
			t.adj8
		]);
		if (r) {
			let i = t.stroke.cmpd, a = p === "line" || p === "straightconnector1";
			if (_(p) && r.vertices.length >= 2 && !(i && a)) {
				let i = r.vertices.map((e) => ({
					x: e.x,
					y: e.y
				}));
				if (t.stroke.tailEnd) {
					let e = Pe(t.stroke.tailEnd, t.stroke, n);
					i[i.length - 1] = Re(i[i.length - 1], i[i.length - 2], e);
				}
				if (t.stroke.headEnd) {
					let e = Pe(t.stroke.headEnd, t.stroke, n);
					i[0] = Re(i[0], i[1], e);
				}
				$(e, t.stroke, n), e.beginPath(), e.moveTo(i[0].x, i[0].y);
				for (let t = 1; t < i.length; t++) e.lineTo(i[t].x, i[t].y);
				e.stroke();
			}
			i && a && ai(e, r.start, r.end, t.stroke, i, n), t.stroke.tailEnd && Ue(e, r.end.x, r.end.y, r.end.angle, t.stroke.tailEnd, t.stroke, n), t.stroke.headEnd && Ue(e, r.start.x, r.start.y, r.start.angle, t.stroke.headEnd, t.stroke, n);
		}
	} else if (t.stroke && t.custGeom && t.custGeom.length > 0 && (t.stroke.headEnd && t.stroke.headEnd.type !== "none" || t.stroke.tailEnd && t.stroke.tailEnd.type !== "none")) {
		let { start: r, end: i } = it(t.custGeom);
		r && t.stroke.headEnd && t.stroke.headEnd.type !== "none" && Ue(e, c + r.x * u, l + r.y * d, Math.atan2(r.dy * d, r.dx * u), t.stroke.headEnd, t.stroke, n), i && t.stroke.tailEnd && t.stroke.tailEnd.type !== "none" && Ue(e, c + i.x * u, l + i.y * d, Math.atan2(i.dy * d, i.dx * u), t.stroke.tailEnd, t.stroke, n);
	}
	if (t.textBody) {
		let f = Ur(t, a);
		if (e.save(), t.flipH || t.flipV) {
			let n = c + u / 2, r = l + d / 2;
			e.translate(n, r), t.flipH && e.scale(-1, 1), t.flipV && e.scale(1, -1), e.translate(-n, -r);
		}
		let m = c, h = l, g = u, _ = d;
		if (t.textRect) m = Y(t.textRect.x, n), h = Y(t.textRect.y, n), g = Y(t.textRect.width, n), _ = Y(t.textRect.height, n);
		else if (p === "ellipse") {
			let e = u * (1 - 1 / Math.SQRT2) / 2, t = d * (1 - 1 / Math.SQRT2) / 2;
			m = c + e, h = l + t, g = u / Math.SQRT2, _ = d / Math.SQRT2;
		} else {
			let e = Hr(p, c, l, u, d, t.adj, t.adj2);
			e && (m = e.tx, h = e.ty, g = e.tw, _ = e.th);
		}
		Xr(e, t.textBody, m, h, g, _, n, f, t.rotation, !1, !1, r, i, a, o, !1, s), e.restore();
	}
	e.restore();
}
var Gr = Fe;
function Kr(e, t) {
	let n = `${e}`, r = e >= 1 && e <= 26 ? String.fromCharCode(96 + e) : n, i = e >= 1 && e <= 26 ? String.fromCharCode(64 + e) : n, a = qr(e).toLowerCase(), o = qr(e), s = n.replace(/[0-9]/g, (e) => String.fromCharCode(65296 + (e.charCodeAt(0) - 48)));
	switch (t) {
		case "arabicPlain": return n;
		case "arabicPeriod": return `${n}.`;
		case "arabicParenR": return `${n})`;
		case "arabicParenBoth": return `(${n})`;
		case "arabicDbPlain": return s;
		case "arabicDbPeriod": return `${s}.`;
		case "alphaLcPlain": return r;
		case "alphaLcPeriod": return `${r}.`;
		case "alphaLcParenR": return `${r})`;
		case "alphaLcParenBoth": return `(${r})`;
		case "alphaUcPlain": return i;
		case "alphaUcPeriod": return `${i}.`;
		case "alphaUcParenR": return `${i})`;
		case "alphaUcParenBoth": return `(${i})`;
		case "romanLcPlain": return a;
		case "romanLcPeriod": return `${a}.`;
		case "romanLcParenR": return `${a})`;
		case "romanLcParenBoth": return `(${a})`;
		case "romanUcPlain": return o;
		case "romanUcPeriod": return `${o}.`;
		case "romanUcParenR": return `${o})`;
		case "romanUcParenBoth": return `(${o})`;
		default: return `${n}.`;
	}
}
function qr(e) {
	let t = [
		1e3,
		900,
		500,
		400,
		100,
		90,
		50,
		40,
		10,
		9,
		5,
		4,
		1
	], n = [
		"M",
		"CM",
		"D",
		"CD",
		"C",
		"XC",
		"L",
		"XL",
		"X",
		"IX",
		"V",
		"IV",
		"I"
	], r = "";
	for (let i = 0; i < t.length; i++) for (; e >= t[i];) r += n[i], e -= t[i];
	return r;
}
function Jr(e) {
	for (let t of e.runs) if (t.type === "text" && t.text !== "" || t.type === "math") return !0;
	return !1;
}
function Yr(e, t) {
	let n = Jr(e);
	if (e.bullet.type === "char") return t.clear(), n ? Ve(e.bullet.char, e.bullet.fontFamily ?? null) : "";
	if (e.bullet.type === "autoNum") {
		if (!n) return "";
		let r = e.lvl;
		return t.has(r) ? t.set(r, t.get(r) + 1) : t.set(r, e.bullet.startAt ?? 1), Kr(t.get(r), e.bullet.numType);
	}
	return t.clear(), "";
}
function Xr(e, t, n, r, i, a, o, s = null, c = 0, l = !1, u = !1, d = "#000000", f, p = {
	themeMajorFont: null,
	themeMinorFont: null,
	dpr: 1
}, m, h = !1, g, _ = !1) {
	let v = t.vert === "vert" || t.vert === "eaVert", y = t.vert === "vert270";
	if (v || y) {
		let l = n + i / 2, u = r + a / 2, _ = v ? 90 : -90, b = m ? (e) => m({
			...e,
			inShapeX: e.inShapeX - a / 2 + i / 2,
			inShapeY: e.inShapeY - i / 2 + a / 2,
			shapeX: n,
			shapeY: r,
			shapeW: i,
			shapeH: a,
			rotation: c,
			textBodyRotation: _
		}) : void 0;
		if (h) return i;
		e.save(), e.translate(l, u), e.rotate(y ? -Math.PI / 2 : Math.PI / 2), Xr(e, {
			...t,
			vert: "horz"
		}, -a / 2, -i / 2, a, i, o, s, 0, !1, !1, d, f, p, b, !1, g, t.vert === "eaVert"), e.restore();
		return;
	}
	let b = t.textWarp;
	if (!h && b && lt(b.preset)) {
		Vr(e, t, b.preset, b.adj ?? [], n, r, i, a, o, s ?? d, p);
		return;
	}
	let x = Y(t.lIns, o), S = Y(t.rIns, o), C = Y(t.tIns, o), w = Y(t.bIns, o), T = t.wrap !== "none", E = t.autoFit === "sp" ? T && xr(e, t, i, x, S, o, p) : T, D = Math.max(1, t.numCol ?? 1), O = Y(t.spcCol ?? 0, o), A = t.defaultBold ?? !1, j = t.defaultItalic ?? !1, M = s ?? d, N = (r) => {
		let a = (t.defaultFontSize ?? 18) * G * o * r, s = [], c = 0, l = /* @__PURE__ */ new Map();
		for (let u = 0; u < t.paragraphs.length; u++) {
			let d = t.paragraphs[u], m = Y(d.marL, o), h = Y(d.marR, o), g = Y(d.indent, o), _ = d.defFontSize == null ? a : d.defFontSize * G * o * r, v = d.defColor ? X(d.defColor) : M, y = yr(d), b = (() => {
				for (let e of d.runs) if (e.type === "text" && e.fontSize != null) return e.fontSize;
				return null;
			})(), C = b == null ? _ : b * G * o * r, w = (() => {
				for (let e of d.runs) if (e.type === "text" && e.color) return e.color;
				return null;
			})(), T = w ? X(w) : v, k = "", N = Z(!1, !1, C, "sans-serif", p), P = T, F = null;
			k = Yr(d, l);
			let I = jn(d.bullet);
			if (I.type === "char") {
				let e = I;
				N = Z(!1, !1, e.sizePts == null ? e.sizePct == null ? C : C * (e.sizePct / 100) : e.sizePts * G * o * r, k === e.char ? ur(e.fontFamily ?? null, p) : "sans-serif", p), P = e.color ? X(e.color) : T;
			} else if (I.type === "autoNum") N = Z(!1, !1, C, "sans-serif", p), P = I.color ? X(I.color) : T;
			else if (I.type === "blip") {
				let e = I, t = e.sizePts == null ? e.sizePct == null ? C : C * (e.sizePct / 100) : e.sizePts * G * o * r;
				F = {
					imagePath: e.imagePath,
					mimeType: e.mimeType,
					sizePx: t
				};
			}
			let L = D > 1 ? (i - x - S - (D - 1) * O) / D : i - x - S, R = n + x + m, z = n + x + m + g, B = L - m - h, V = Cr(e, d, E ? B : Infinity, _, v, o, m, A, j, r, f, p, br(y, g)), H = d.spaceBefore == null ? 0 : d.spaceBefore / 100 * G * o * r, U = d.spaceAfter == null ? 0 : d.spaceAfter / 100 * G * o * r;
			for (let n = 0; n < V.length; n++) {
				let r = V[n], i = n === 0, a = n === V.length - 1, l = 0, f = 0;
				for (let e of r.segments) {
					let t = e.math ? Math.max(e.sizePx, (e.math.ascent + e.math.descent) / 1.2) : e.sizePx;
					if (t > l && (l = t), !e.math) {
						let t = fe(e.fontFamily, e.sizePx);
						t > f && (f = t);
					}
				}
				if (l === 0 && (l = _), i && k) {
					e.font = N;
					let t = e.measureText("M"), n = t.actualBoundingBoxAscent + t.actualBoundingBoxDescent;
					n > l && (l = n);
				}
				i && F && F.sizePx > l && (l = F.sizePx);
				let p = Math.max(l * 1.2, f), m;
				m = d.spaceLine ? d.spaceLine.type === "pct" ? p * (d.spaceLine.val / 1e5) : d.spaceLine.val * G * o : p, t.autoFit === "norm" && t.lnSpcReduction != null && d.spaceLine?.type !== "pts" && (m *= 1 - t.lnSpcReduction);
				let h = m + (a ? U : 0), v = i && u > 0 ? H : 0, b = i ? br(y, g) : 0, x = r.segments.some((e) => e.text && e.text.length > 0 || e.math != null), S = i && x ? F : null;
				s.push({
					line: r,
					linePx: h,
					lineHeight: m,
					topGapPx: v,
					textXOffset: b,
					bulletLabel: i ? k : "",
					bulletFont: N,
					bulletColor: P,
					bulletX: z,
					bulletImage: S,
					textX: R,
					textMaxW: B,
					alignment: d.alignment,
					isLastLine: a,
					para: d
				}), c += h + v;
			}
		}
		return {
			allLines: s,
			totalHeight: c
		};
	}, { allLines: P, totalHeight: F } = N(1);
	if (t.autoFit === "norm") if (t.fontScale != null && t.fontScale > 0) t.fontScale < 1 && ({allLines: P, totalHeight: F} = N(t.fontScale));
	else {
		let e = a - C - w;
		if (F > e && e > 0) {
			let t = .1, n = 1;
			for (let r = 0; r < 6; r++) {
				let r = (t + n) / 2;
				N(r).totalHeight <= e ? t = r : n = r;
			}
			({allLines: P, totalHeight: F} = N(t));
		}
	}
	if (h) return C + F + w;
	let I = t.verticalAnchor ?? "t", L = r, R;
	a === 0 && I === "b" ? (R = C + F + w, L = r - R) : R = t.autoFit === "sp" ? Math.max(a, C + F + w) : a;
	let z, B = Math.max(0, R - C - w);
	z = I === "ctr" ? L + C + (B - F) / 2 : I === "b" ? L + R - w - F : L + C, e.save(), e.textAlign = "left", e.textBaseline = "alphabetic";
	let V = z, H = D > 1 ? (i - x - S - (D - 1) * O) / D + O : 0, U = Math.max(0, R - C - w), W = a === 0 || F <= U + .5, ee = D > 1 && !W ? Math.ceil(P.length / D) : P.length, te = 0, ne = 0;
	for (let s of P) {
		let { line: l, linePx: u, lineHeight: d, topGapPx: f, textXOffset: h, bulletLabel: v, bulletFont: y, bulletColor: b, bulletImage: x, alignment: S, isLastLine: C } = s;
		D > 1 && te < D - 1 && ne >= ee && (te++, ne = 0, z = V), z += f, ne++;
		let w = (t.rtlCol ? D - 1 - te : te) * H, T = s.textX + w, E = s.bulletX + w, O = s.textMaxW, A = s.para.rtl === !0, j = A || In(l.segments), M = l.segments.some((e) => e.isTab);
		if (M) {
			let t = Y(s.para.marL, o), n = Y(s.para.marR, o), r = A ? n : t + h, i = O + t + n;
			e.font = l.segments.find((e) => e.isTab).font;
			let a = e.measureText(" ").width, c = Jn(l.segments.map((t) => {
				if (t.isTab) return {
					isTab: !0,
					width: 0
				};
				if (t.math) return {
					isTab: !1,
					width: t.math.width
				};
				e.font = t.font;
				let n = t.letterSpacingPx ?? 0;
				return {
					isTab: !1,
					width: t.text ? e.measureText(t.text).width + n * Q(t.text) : 0
				};
			}), (s.para.tabStops ?? []).map((e) => ({
				pos: Y(e.pos, o),
				algn: e.algn
			})), r, i, a, Y(s.para.defTabSz ?? 914400, o));
			for (let e = 0; e < l.segments.length; e++) l.segments[e].isTab && (l.segments[e].tabWidthPx = c[e]);
		}
		let N = 0, P = d * .8;
		for (let t of l.segments) {
			if (t.isTab) {
				N += t.tabWidthPx ?? 0;
				continue;
			}
			if (t.math) {
				N += t.math.width, P = Math.max(P, t.math.ascent);
				continue;
			}
			e.font = t.font;
			let n = e.measureText(t.text || "M"), r = t.letterSpacingPx ?? 0;
			N += t.text ? n.width + r * Q(t.text) : 0, n.actualBoundingBoxAscent > 0 && (P = Math.max(P, n.actualBoundingBoxAscent));
		}
		let F = z + P, I = T + O, L = 0, R = null;
		if (j && A) {
			if (v) e.font = y, L = e.measureText(v).width;
			else if (x && g && (R = pe(x.imagePath, g), R)) {
				let e = x.sizePx;
				L = R.height > 0 ? e * (R.width / R.height) : e;
			}
		}
		if (v) if (e.font = y, e.fillStyle = b, j && A) {
			let t = e.direction;
			e.direction = "rtl", e.fillText(v, I - L, F), e.direction = t;
		} else e.fillText(v, E, F);
		if (x && g) {
			let t = pe(x.imagePath, g);
			if (t) {
				let n = x.sizePx, r = t.height > 0 ? n * (t.width / t.height) : n, i = F - n;
				j && A ? e.drawImage(t, I - r, i, r, n) : e.drawImage(t, E, i, r, n);
			}
		}
		let B = T + h, U;
		U = M ? A ? T + O - L - N : B : S === "ctr" ? B + (O - h - N) / 2 : S === "r" ? T + O - L - N : B;
		let W = S === "just" || S === "justLow" ? "just" : S === "thaiDist" ? "thaiDist" : S === "dist" ? "dist" : null, re = C || (l.endsWithBreak ?? !1), ie = (W && !j && !M ? Bn(l.segments, O - h, N, W, re) : null) ?? l.segments, ae = j ? Ln(l.segments, A) : null, G = ie.length;
		for (let t = 0; t < G; t++) {
			let s = ae ? ae.order[t] : t, l = ie[s], u = ae ? ae.rtl[s] : !1;
			if (j && (e.direction = u ? "rtl" : "ltr"), l.isTab) {
				U += l.tabWidthPx ?? 0;
				continue;
			}
			let f = l.jext ?? 0, h = l.splitBefore, g = l.perGap ?? 0, v = h && h.length > 0 ? h.length * g : 0;
			if (l.math) {
				let t = rr.get(l.math.nodes), n = l.math.width, r = l.math.ascent + l.math.descent;
				if (t && n > 0 && r > 0) {
					let i = F - l.math.ascent, a = ir(t, l.color);
					e.drawImage(a, U, i, n, r);
				}
				U += n, U += f;
				continue;
			}
			e.font = l.font, e.fillStyle = l.color;
			let y = F + (l.baseline ? -(l.baseline / 1e5) * l.sizePx : 0), b = l.letterSpacingPx ?? 0;
			if (l.highlight && l.text) {
				let t = e.measureText(l.text).width + (b > 0 ? b * Q(l.text) : 0) + v + f;
				er(e, U, y, t, l.sizePx, l.highlight, l.color);
			}
			let x = l.shadow;
			if (x) {
				let t = x.dir * Math.PI / 180, n = Y(x.dist, o);
				e.save(), e.shadowColor = X(x.color, x.alpha), e.shadowBlur = Y(x.blur, o), e.shadowOffsetX = Math.cos(t) * n, e.shadowOffsetY = Math.sin(t) * n;
			}
			let S = (t, n, r) => {
				let i = r === "fill" ? e.fillText.bind(e) : e.strokeText.bind(e);
				if (b > 0 && t.length > 1) {
					let r = e, a = r.letterSpacing;
					try {
						r.letterSpacing = `${b}px`;
					} catch {}
					i(t, n, y);
					try {
						r.letterSpacing = a;
					} catch {}
				} else i(t, n, y);
			}, C = (t) => e.measureText(t).width, w = h && h.length > 0 ? Le([...l.text], h, g, C, b) : null, T = [...l.text], E = !!h && h.length === T.length - 1 && T.length > 1, D = (t) => {
				if (_) {
					let n = E ? b + g : b;
					$n(e, l.text, U, y, l.sizePx, n, t);
					return;
				}
				if (E) {
					let n = e, r = n.letterSpacing;
					try {
						n.letterSpacing = `${b + g}px`;
					} catch {}
					(t === "fill" ? e.fillText.bind(e) : e.strokeText.bind(e))(l.text, U, y);
					try {
						n.letterSpacing = r;
					} catch {}
				} else if (w) for (let { text: e, dx: n } of w) S(e, U + n, t);
				else S(l.text, U, t);
			};
			D("fill"), x && e.restore();
			let O = l.outline;
			O && O.width > 0 && (e.save(), e.lineWidth = Math.max(.5, Y(O.width, o)), e.strokeStyle = O.color ? `#${O.color}` : l.color, e.lineJoin = "round", D("stroke"), e.restore()), e.font = l.font;
			let A = e.measureText(l.text).width + (b > 0 ? b * Q(l.text) : 0) + v;
			if (m && l.text && m({
				text: l.text,
				inShapeX: U - n,
				inShapeY: z - r,
				w: A + f,
				h: d,
				fontSize: l.sizePx,
				font: l.font,
				shapeX: n,
				shapeY: r,
				shapeW: i,
				shapeH: a,
				rotation: c,
				hyperlink: l.hyperlink
			}), l.underline && Be(e, U, y, A + f, l.sizePx, l.underlineColor ?? l.color, l.underlineStyle, p.dpr), l.strikethrough) {
				let t = Math.max(1, l.sizePx * .05);
				e.strokeStyle = l.color, e.lineWidth = t, e.setLineDash([]);
				let n = y - l.sizePx * .32;
				if (l.strikeDouble) {
					let r = t * .9, i = n - r, a = n + r;
					e.beginPath(), e.moveTo(U, i + k(i, t, p.dpr)), e.lineTo(U + A + f, i + k(i, t, p.dpr)), e.moveTo(U, a + k(a, t, p.dpr)), e.lineTo(U + A + f, a + k(a, t, p.dpr)), e.stroke();
				} else {
					let r = n + k(n, t, p.dpr);
					e.beginPath(), e.moveTo(U, r), e.lineTo(U + A + f, r), e.stroke();
				}
			}
			U += A, U += f;
		}
		j && (e.direction = "ltr"), z += u;
	}
	e.restore();
}
function Zr(e, t, n, r, i) {
	if (!e) return [];
	let a = fn(t?.rig ?? "threePt", t?.dir ?? "t", t?.rot), o = vn(n), s = r * i, c = [];
	return e.bevelT && e.bevelT.w > 0 && e.bevelT.h > 0 && c.push({
		widthPx: e.bevelT.w * s,
		heightPx: e.bevelT.h * s,
		prst: e.bevelT.prst || "circle",
		material: o,
		light: a
	}), e.bevelB && e.bevelB.w > 0 && e.bevelB.h > 0 && c.push({
		widthPx: e.bevelB.w * s,
		heightPx: e.bevelB.h * s,
		prst: e.bevelB.prst || "circle",
		material: o,
		light: a,
		bottom: !0
	}), c;
}
function Qr(e, t, n, r, i, a) {
	if (!e || !e.extrusionH || e.extrusionH <= 0) return null;
	let o = e.extrusionH * i * a, s = Lt(t, n * a, r * a, o);
	if (Math.hypot(s.x, s.y) < .75) return null;
	let c = [
		64,
		64,
		64
	];
	if (e.extrusionClr) {
		let t = e.extrusionClr.replace("#", "");
		t.length >= 6 && (c = [
			parseInt(t.slice(0, 2), 16),
			parseInt(t.slice(2, 4), 16),
			parseInt(t.slice(4, 6), 16)
		]);
	}
	return {
		offsetX: s.x,
		offsetY: s.y,
		rgb: c
	};
}
function $r(e, t, n, r, i, a, o, s = {}) {
	if (i <= 0 || a <= 0) return !1;
	let c = e.getTransform(), l = Math.abs(c.a * c.d - c.b * c.c), u = l > 0 ? Math.sqrt(l) : 1, d = Math.max(0, Math.ceil((s.edgePadCss ?? 0) * u)), f = Ft(t, i, a), p = f.corners;
	if (d > 0) {
		let e = d / u, t = Kt(f.corners, e / i, e / a);
		t ? p = t : d = 0;
	}
	let m = d / u, h = Math.max(1, Math.ceil(i * u) + 2 * d), g = Math.max(1, Math.ceil(a * u) + 2 * d), _ = T(h, g);
	if (!_) return !1;
	let v = _.getContext("2d");
	if (!v) return !1;
	v.save(), v.scale(u, u), v.translate(m, m), o(v, 0, 0, i, a), v.restore();
	let y = Math.ceil(i * u), b = Math.ceil(a * u), x = (e) => ({
		x: d - e,
		y: d - e,
		w: y + 2 * e,
		h: b + 2 * e
	});
	if (s.extrusion) {
		let e = Math.ceil(Math.hypot(s.extrusion.offsetX, s.extrusion.offsetY)) + 2;
		Cn(v, s.extrusion, x(e));
	}
	if (s.bevels && s.bevels.length > 0) for (let e of s.bevels) Sn(v, e, x(Math.ceil(e.widthPx) + 2));
	return s.paintEdges && (v.save(), v.scale(u, u), v.translate(m, m), s.paintEdges(v, 0, 0, i, a), v.restore()), Wt(_, e, h, g, p.map((e) => ({
		x: n + e.x,
		y: r + e.y
	}))), !0;
}
function ei(e, t, n, r, i, a, o, s, c = 0) {
	if (r <= 0 || i <= 0 || a.length === 0) return !1;
	let l = e.getTransform(), u = Math.abs(l.a * l.d - l.b * l.c), d = u > 0 ? Math.sqrt(u) : 1, f = Math.max(0, Math.ceil(c * d)), p = f / d, m = Math.max(1, Math.ceil(r * d) + 2 * f), h = Math.max(1, Math.ceil(i * d) + 2 * f), g = T(m, h);
	if (!g) return !1;
	let _ = g.getContext("2d");
	if (!_) return !1;
	_.save(), _.scale(d, d), _.translate(p, p), o(_, 0, 0, r, i), _.restore();
	let v = Math.ceil(r * d), y = Math.ceil(i * d);
	for (let e of a) {
		let t = Math.ceil(e.widthPx) + 2;
		Sn(_, e, {
			x: f - t,
			y: f - t,
			w: v + 2 * t,
			h: y + 2 * t
		});
	}
	return s && (_.save(), _.scale(d, d), _.translate(p, p), s(_, 0, 0, r, i), _.restore()), e.drawImage(g, t - p, n - p, m / d, h / d), !0;
}
var ti = /* @__PURE__ */ new WeakMap();
function ni(e, t) {
	let n = ti.get(e);
	if (n) return n;
	let r = (async () => {
		let n = await t(e.posterPath), r = e.posterMimeType ? new Blob([n], { type: e.posterMimeType }) : n;
		if (be(new Uint8Array(await r.slice(0, 64 * 1024).arrayBuffer()))) throw Error("poster raster exceeds the pixel budget");
		return createImageBitmap(r);
	})();
	return ti.set(e, r), r;
}
async function ri(e, t, n, r) {
	if (r) try {
		let i = t.mimeType === "image/svg+xml", { widthPt: a, heightPt: o } = Se(t.mimeType, t.srcRect, t.width / G, t.height / G), s;
		if (d(t)) try {
			s = await se(t.svgImagePath, r);
		} catch {
			s = i ? await se(t.imagePath, r) : await Ge(t.imagePath, t.mimeType, t.duotone, r, {
				widthPt: a,
				heightPt: o
			});
		}
		else s = i ? await se(t.imagePath, r) : await Ge(t.imagePath, t.mimeType, t.duotone, r, {
			widthPt: a,
			heightPt: o
		});
		if (!s) return;
		e.save(), t.alpha != null && (e.globalAlpha *= t.alpha);
		let c = Y(t.x, n), l = Y(t.y, n), u = Y(t.width, n), f = Y(t.height, n);
		(t.rotation !== 0 || t.flipH || t.flipV) && (e.translate(c + u / 2, l + f / 2), e.rotate(t.rotation * Math.PI / 180), t.flipH && e.scale(-1, 1), t.flipV && e.scale(1, -1), e.translate(-(c + u / 2), -(l + f / 2)));
		let p = S(s, t.srcRect), m = (e, n, r, i, a) => {
			t.custGeom && t.custGeom.length > 0 ? Gr(e, t.custGeom, n, r, i, a) : t.prstGeom && we(e, t.prstGeom, n, r, i, a, t.prstAdjust ?? []) || e.rect(n, r, i, a);
		}, h = (e, t, n, r, i) => {
			e.beginPath(), m(e, t, n, r, i);
		}, g = (e, n, r, i, a) => {
			(t.prstGeom || t.custGeom && t.custGeom.length > 0) && (h(e, n, r, i, a), e.clip());
		}, _ = (e, r, i, a, o) => {
			t.stroke && (e.save(), $(e, t.stroke, n), h(e, r, i, a, o), e.stroke(), e.restore());
		}, v = (e, r, i, a, o) => {
			let s = t.sp3d;
			if (s && (s.contourW ?? 0) > 0 && s.contourClr) {
				let t = Math.max(.5, s.contourW * n);
				e.save(), e.beginPath();
				let c = t * 2 + Math.max(a, o);
				e.rect(r - c, i - c, a + 2 * c, o + 2 * c), m(e, r, i, a, o), e.clip("evenodd"), e.beginPath(), h(e, r, i, a, o), e.strokeStyle = X(s.contourClr), e.lineWidth = t * 2, e.setLineDash([]), e.stroke(), e.restore();
			}
		}, y = t.scene3d && It(t.scene3d.camera) ? t.scene3d : null, b = (e, t, n, r, i) => {
			e.save(), g(e, t, n, r, i), p ? e.drawImage(s, p.sx, p.sy, p.sw, p.sh, t, n, r, i) : e.drawImage(s, t, n, r, i), e.restore();
		}, x = (e, t, n, r, i) => {
			b(e, t, n, r, i), _(e, t, n, r, i), v(e, t, n, r, i);
		}, C = (e, t, n, r, i) => {
			b(e, t, n, r, i), _(e, t, n, r, i);
		}, w = e.getTransform(), T = Math.abs(w.a * w.d - w.b * w.c), E = T > 0 ? Math.sqrt(T) : 1, D = Zr(t.sp3d, t.scene3d?.lightRig, t.sp3d ? t.sp3d.prstMaterial : void 0, n, E), O = y ? Qr(t.sp3d, y.camera, u, f, n, E) : null, k = t.stroke ? t.stroke.width * n / 2 : 0, A = t.sp3d?.contourW ? t.sp3d.contourW * n : 0, j = O ? Math.hypot(O.offsetX, O.offsetY) / E : 0, M = k + A + j + 2, N = (e) => {
			if (y) {
				if ($r(e, y.camera, c, l, u, f, C, {
					bevels: D,
					extrusion: O ?? void 0,
					paintEdges: v,
					edgePadCss: M
				})) return;
			} else if (D.length > 0 && ei(e, c, l, u, f, D, C, v, M)) return;
			x(e, c, l, u, f);
		}, P = (e, t, n, r, i, a) => {
			e.save(), g(e, n, r, i, a), e.fillStyle = t, e.fillRect(n, r, i, a), e.restore();
		}, F = (e, t) => {
			y && $r(e, y.camera, c, l, u, f, (e, n, r, i, a) => P(e, t, n, r, i, a)) || P(e, t, c, l, u, f);
		}, I = e.canvas.width || 0, L = e.canvas.height || 0, R = e.getTransform(), z = Math.abs(R.a * R.d - R.b * R.c), B = z > 0 ? Math.sqrt(z) : 1, V = {
			x: c * B,
			y: l * B,
			w: u * B,
			h: f * B
		}, H = n * B, U = (e) => e.setTransform(R), W = I > 0 && L > 0;
		t.reflection && W && (e.save(), e.setTransform(new DOMMatrix()), Tt(e, (e) => {
			U(e), N(e);
		}, V, t.reflection, H, I, L), e.restore()), t.shadow ? Or(e, t.shadow, n) : t.glow && kr(e, t.glow, n), t.softEdge && W ? (e.save(), e.setTransform(new DOMMatrix()), wt(e, (e) => {
			U(e), N(e);
		}, V, t.softEdge, H, I, L, (e) => {
			U(e), F(e, "#000");
		}), e.restore()) : N(e), (t.shadow || t.glow) && Ar(e), t.innerShadow && W && (e.save(), e.setTransform(new DOMMatrix()), Ct(e, (e) => {
			U(e), F(e, "#000");
		}, V, t.innerShadow, H, I, L), e.restore()), e.restore();
	} catch {}
}
async function ii(e, t, n, r, i) {
	let a = Y(t.x, n), o = Y(t.y, n), s = Y(t.width, n), c = Y(t.height, n), l;
	if (t.posterPath && r) try {
		l = await ni(t, r);
	} catch {}
	e.save(), oi(e, t, n), l ? e.drawImage(l, a, o, s, c) : (e.fillStyle = t.mediaKind === "video" ? "#111" : "#f0f0f0", e.fillRect(a, o, s, c)), i || Nn(e, a + s / 2, o + c / 2, s, c, "paused"), e.restore();
}
function ai(e, t, n, r, i, a) {
	let o = Math.max(.5, Y(r.width, a)), s = n.x - t.x, c = n.y - t.y, l = Math.hypot(s, c);
	if (l === 0) return;
	let u = -c / l, d = s / l, f;
	switch (i) {
		case "dbl":
			f = [{
				offset: -1 / 3,
				widthFrac: 1 / 3
			}, {
				offset: 1 / 3,
				widthFrac: 1 / 3
			}];
			break;
		case "thinThick":
			f = [{
				offset: -3 / 8,
				widthFrac: 1 / 4
			}, {
				offset: 1 / 4,
				widthFrac: 1 / 2
			}];
			break;
		case "thickThin":
			f = [{
				offset: -1 / 4,
				widthFrac: 1 / 2
			}, {
				offset: 3 / 8,
				widthFrac: 1 / 4
			}];
			break;
		case "tri":
			f = [
				{
					offset: -2 / 5,
					widthFrac: 1 / 5
				},
				{
					offset: 0,
					widthFrac: 3 / 5
				},
				{
					offset: 2 / 5,
					widthFrac: 1 / 5
				}
			];
			break;
		default: return;
	}
	e.save(), e.globalCompositeOperation = "destination-out", e.strokeStyle = "#000", e.lineWidth = o + .5, e.setLineDash([]), e.beginPath(), e.moveTo(t.x, t.y), e.lineTo(n.x, n.y), e.stroke(), e.globalCompositeOperation = "source-over", e.strokeStyle = X(r.color);
	for (let r of f) {
		let i = u * (o * r.offset), a = d * (o * r.offset);
		e.lineWidth = Math.max(.5, o * r.widthFrac), e.beginPath(), e.moveTo(t.x + i, t.y + a), e.lineTo(n.x + i, n.y + a), e.stroke();
	}
	e.restore();
}
function $(e, t, n) {
	Ee(e, t, n);
}
function oi(e, t, n) {
	if (t.rotation === 0 && !t.flipH && !t.flipV) return;
	let r = Y(t.x, n), i = Y(t.y, n), a = Y(t.width, n), o = Y(t.height, n);
	e.translate(r + a / 2, i + o / 2), e.rotate(t.rotation * Math.PI / 180), t.flipH && e.scale(-1, 1), t.flipV && e.scale(1, -1), e.translate(-(r + a / 2), -(i + o / 2));
}
function si(e, t, n, r, i = {
	themeMajorFont: null,
	themeMinorFont: null,
	dpr: 1
}) {
	e.save(), oi(e, t, n);
	let a = Y(t.x, n), o = Y(t.y, n), s = t.cols.map((e) => Y(e, n)), c = s.length, l = (e, t) => {
		let n = 0;
		for (let r = 0; r < t; r++) n += s[e + r] ?? 0;
		return n;
	}, u = t.rows.map((e) => Y(e.height, n));
	for (let a = 0; a < t.rows.length; a++) {
		let o = t.rows[a];
		for (let t = 0; t < o.cells.length; t++) {
			let s = o.cells[t];
			if (s.hMerge || s.vMerge || (s.rowSpan || 1) > 1 || !s.textBody) continue;
			let c = l(t, s.gridSpan || 1), d = Xr(e, s.textBody, 0, 0, c, 0, n, null, 0, !1, !1, "#000000", r, i, void 0, !0) || 0;
			d > u[a] && (u[a] = d);
		}
	}
	for (let a = 0; a < t.rows.length; a++) {
		let o = t.rows[a];
		for (let t = 0; t < o.cells.length; t++) {
			let s = o.cells[t];
			if (s.hMerge || s.vMerge) continue;
			let c = s.rowSpan || 1;
			if (c <= 1 || !s.textBody) continue;
			let d = l(t, s.gridSpan || 1), f = Xr(e, s.textBody, 0, 0, d, 0, n, null, 0, !1, !1, "#000000", r, i, void 0, !0) || 0, p = 0;
			for (let e = 0; e < c && a + e < u.length; e++) p += u[a + e];
			if (f > p) {
				let e = (f - p) / c;
				for (let t = 0; t < c && a + t < u.length; t++) u[a + t] += e;
			}
		}
	}
	let d = s.reduce((e, t) => e + t, 0), f = Array(c);
	if (t.rtl) {
		let e = a + d;
		for (let t = 0; t < c; t++) e -= s[t], f[t] = e;
	} else {
		let e = a;
		for (let t = 0; t < c; t++) f[t] = e, e += s[t];
	}
	let p = (e, n) => t.rtl ? f[e + n - 1] : f[e], m = Array(t.rows.length);
	{
		let e = o;
		for (let n = 0; n < t.rows.length; n++) m[n] = e, e += u[n];
	}
	let h = [], g = t.rows.map(() => Array(c).fill(-1));
	for (let e = 0; e < t.rows.length; e++) {
		let n = t.rows[e], r = m[e];
		for (let i = 0; i < n.cells.length; i++) {
			let a = n.cells[i];
			if (a.hMerge || a.vMerge) continue;
			let o = a.gridSpan || 1, s = a.rowSpan || 1, d = l(i, o), f = 0;
			for (let t = 0; t < s; t++) f += u[e + t] ?? 0;
			let m = p(i, o), _ = Math.min(e + s - 1, t.rows.length - 1), v = h.length;
			h.push({
				cell: a,
				colX: m,
				rowY: r,
				cellW: d,
				cellH: f,
				ci: i,
				ri: e,
				span: o,
				lastRi: _
			});
			for (let t = e; t <= _; t++) for (let e = i; e < i + o && e < c; e++) g[t][e] = v;
		}
	}
	for (let { cell: t, colX: a, rowY: o, cellW: s, cellH: c } of h) {
		let l = tr(t.fill);
		if (l && (e.fillStyle = l, e.fillRect(a, o, s, c)), t.textBody) {
			let l = t.textColor ? X(t.textColor) : null;
			Xr(e, t.textBody, a, o, s, c, n, l, 0, !1, !1, "#000000", r, i);
		}
	}
	let _ = i.dpr, v = (e, t) => {
		if (e < 0 || e >= g.length || t < 0 || t >= c) return null;
		let n = g[e][t];
		return n < 0 ? null : h[n];
	}, y = (t, r, i, a, o) => {
		$(e, t, n);
		let s = r === a ? k(r, e.lineWidth, _) : 0, c = i === o ? k(i, e.lineWidth, _) : 0;
		e.beginPath(), e.moveTo(r + s, i + c), e.lineTo(a + s, o + c), e.stroke();
	};
	for (let r of h) {
		let { cell: i, colX: a, rowY: o, cellW: s, cellH: d } = r;
		e.save();
		let f = t.rtl ? i.borderR : i.borderL, h = t.rtl ? i.borderL : i.borderR, _ = t.rtl ? r.ci + r.span === c : r.ci === 0, b = t.rtl ? r.ci === 0 : r.ci + r.span === c, x = t.rtl ? r.ci - 1 : r.ci + r.span, S = (e) => t.rtl ? e.borderR : e.borderL;
		if (r.ri === 0 && i.borderT && y(i.borderT, a, o, a + s, o), _ && f && y(f, a, o, a, o + d), r.lastRi === t.rows.length - 1) {
			let e = i.borderB;
			e && y(e, a, o + d, a + s, o + d);
		} else {
			let e = r.lastRi + 1, t = o + d, n = Math.min(r.ci + r.span, c), a = r.ci;
			for (; a < n;) {
				let r = g[e][a], o = a + 1;
				for (; o < n && g[e][o] === r;) o++;
				let s = v(e, a), c = Un(i.borderB, s ? s.cell.borderT : null);
				if (c) {
					let e = p(a, o - a);
					y(c, e, t, e + l(a, o - a), t);
				}
				a = o;
			}
		}
		if (b) {
			let e = h;
			e && y(e, a + s, o, a + s, o + d);
		} else {
			let e = a + s, t = r.ri;
			for (; t <= r.lastRi;) {
				let n = g[t][x], i = t;
				for (; i + 1 <= r.lastRi && g[i + 1][x] === n;) i++;
				let a = v(t, x), o = Un(h, a ? S(a.cell) : null);
				o && y(o, e, m[t], e, m[i] + u[i]), t = i + 1;
			}
		}
		i.diagonalTL && ($(e, i.diagonalTL, n), e.beginPath(), e.moveTo(a, o), e.lineTo(a + s, o + d), e.stroke()), i.diagonalTR && ($(e, i.diagonalTR, n), e.beginPath(), e.moveTo(a + s, o), e.lineTo(a, o + d), e.stroke()), e.restore();
	}
	e.restore();
}
function ci(e, t, n, r) {
	e.save(), e.globalAlpha = t.opacity, e.fillStyle = t.color, e.fillRect(0, 0, n, r), e.restore();
}
var li = /* @__PURE__ */ new WeakMap();
function ui(e, t, n, r, i) {
	e.save(), e.fillStyle = "#f7f7f8", e.fillRect(0, 0, t, n);
	let a = Math.max(12, Math.min(t, n) * .04);
	e.strokeStyle = "#c8ccd2", e.lineWidth = Math.max(1, Math.min(t, n) * .004), e.setLineDash([e.lineWidth * 6, e.lineWidth * 5]), e.strokeRect(a, a, t - a * 2, n - a * 2), e.setLineDash([]);
	let o = t / 2, s = Math.max(18, Math.min(t, n) * .14);
	e.fillStyle = "#b23b3b", e.textAlign = "center", e.textBaseline = "middle", e.font = `${s}px sans-serif`, e.fillText("⚠", o, n * .34);
	let c = Math.max(11, Math.min(t, n) * .045);
	e.fillStyle = "#333333", e.font = `600 ${c}px sans-serif`, e.fillText(`Slide ${r} could not be displayed`, o, n * .52);
	let l = Math.max(9, Math.min(t, n) * .028);
	e.fillStyle = "#666666", e.font = `${l}px sans-serif`;
	let u = t - a * 4, d = i.split(/\s+/), f = [], p = "";
	for (let t of d) {
		let n = p ? `${p} ${t}` : t;
		if (e.measureText(n).width > u && p ? (f.push(p), p = t) : p = n, f.length >= 4) break;
	}
	p && f.length < 4 && f.push(p);
	let m = l * 1.35, h = n * .6 + m;
	for (let t of f.slice(0, 4)) e.fillText(t, o, h), h += m;
	e.restore();
}
async function di(e, t, n, r, i = {}, a) {
	let o = i.fetchImage ? de(i.fetchImage) : void 0;
	try {
		return await fi(e, t, n, r, i, a);
	} finally {
		o?.();
	}
}
async function fi(e, t, n, r, i = {}, a) {
	let s = (li.get(e) ?? 0) + 1;
	li.set(e, s);
	let c = () => li.get(e) !== s, l = i.width ?? ((p(e) ? e.offsetWidth : 0) || 960), u = l / n, f = Math.round(l), m = Math.round(r * u), h = i.dpr ?? o(), g = E(f * h, m * h), _ = g.clamped ? h * g.scale : h;
	e.width = g.width, e.height = g.height, p(e) && (e.style.width = `${f}px`, e.style.display || (e.style.display = "block"));
	let v = e.getContext("2d");
	if (!v) throw Error("Could not get 2D context");
	if (v.scale(_, _), t.parseError) return ui(v, f, m, t.slideNumber, t.parseError), e;
	let y = i.defaultTextColor ? `#${i.defaultTextColor}` : "#000000", b = {
		themeMajorFont: i.majorFont ?? null,
		themeMinorFont: i.minorFont ?? null,
		themeHlinkColor: i.hlinkColor ?? null,
		dpr: _,
		smartArtFallbackTextColor: qn(t.background, y)
	};
	if (await wr(v, t.background, f, m, u, i.fetchImage), c() || (i.math && await lr(t, i.math), c())) return e;
	let x = t.slideNumber;
	for (let e of t.elements) if (e.type === "picture" && i.fetchImage) {
		let t = e, n = t.mimeType === "image/svg+xml";
		if (d(t)) se(t.svgImagePath, i.fetchImage).catch(() => void 0);
		else if (n) se(t.imagePath, i.fetchImage).catch(() => void 0);
		else {
			let e = Se(t.mimeType, t.srcRect, t.width / G, t.height / G);
			Ge(t.imagePath, t.mimeType, t.duotone, i.fetchImage, {
				widthPt: e.widthPt,
				heightPt: e.heightPt
			}).catch(() => void 0);
		}
	} else if (e.type === "media") {
		let t = e;
		t.posterPath && i.fetchMedia && ni(t, i.fetchMedia).catch(() => void 0);
	}
	if (i.fetchImage) {
		let n = i.fetchImage, r = /* @__PURE__ */ new Set();
		for (let e of t.elements) if (!(e.type !== "shape" || !e.textBody)) for (let t of e.textBody.paragraphs) {
			let e = jn(t.bullet);
			e.type === "blip" && r.add(`${e.imagePath} ${e.mimeType}`);
		}
		if (r.size > 0 && (await Promise.all([...r].map((e) => {
			let [t, r] = e.split(" ");
			return I(t, r, n).catch(() => void 0);
		})), c())) return e;
	}
	for (let n of t.elements) {
		if (c()) return e;
		if (n.type === "shape") Wr(v, n, u, y, x, b, a, i.fetchImage);
		else if (n.type === "picture") await ri(v, n, u, i.fetchImage);
		else if (n.type === "table") si(v, n, u, x, b);
		else if (n.type === "media") await ii(v, n, u, i.fetchMedia, i.skipMediaControls);
		else if (n.type === "chart") {
			let e = G * u;
			v.save(), oi(v, n, u), F(v, n.chart, {
				x: Y(n.x, u),
				y: Y(n.y, u),
				w: Y(n.width, u),
				h: Y(n.height, u)
			}, e), v.restore();
		}
	}
	return c() || i.dim && ci(v, i.dim, f, m), e;
}
//#endregion
//#region packages/pptx/src/tabular-text.ts
var pi = (e) => e >= "0" && e <= "9";
function mi(e) {
	let t = 0;
	for (let n = 0; n < 10; n++) t = Math.max(t, e.measureText(String(n)).width);
	return t;
}
function hi(e, t, n) {
	let r = 0;
	for (let i of t) r += pi(i) ? n : e.measureText(i).width;
	return r;
}
function gi(e, t, n, r, i) {
	let a = e.textAlign;
	e.textAlign = "left";
	let o = n;
	for (let n of t) if (pi(n)) {
		let t = e.measureText(n).width;
		e.fillText(n, o + (i - t) / 2, r), o += i;
	} else e.fillText(n, o, r), o += e.measureText(n).width;
	e.textAlign = a;
}
//#endregion
//#region packages/pptx/src/presentation-handle.ts
var _i = (t, n) => t / e * n;
async function vi(t, n, r) {
	let i = t.getContext("2d");
	if (!i) throw Error("2D context not available");
	let a = r.width / (r.slideWidthEmu / e);
	await r.drawBase();
	let o = document.createElement("canvas");
	o.width = t.width, o.height = t.height;
	let s = o.getContext("2d");
	if (!s) throw Error("base 2D context not available");
	s.drawImage(t, 0, 0);
	let c = [];
	for (let e of n) {
		let t;
		try {
			t = await r.fetchMedia(e.mediaPath);
		} catch {
			continue;
		}
		let n = e.mimeType || t.type, i = t.type === n ? t : new Blob([t], { type: n }), o = URL.createObjectURL(i), s = e.mediaKind === "video" ? document.createElement("video") : document.createElement("audio");
		s.src = o, s.preload = "metadata", e.mediaKind === "video" && (s.playsInline = !0);
		let l = {
			x: _i(e.x, a),
			y: _i(e.y, a),
			w: _i(e.width, a),
			h: _i(e.height, a)
		}, u = e.mediaKind === "audio" ? {
			x: l.x + l.w / 2 - Math.max(l.w, 260) / 2,
			y: l.y,
			w: Math.max(l.w, 260),
			h: l.h + 36
		} : l;
		c.push({
			el: e,
			rect: u,
			posterRect: l,
			media: s,
			objectUrl: o
		});
	}
	let l = null, u = !1, d = null, f = () => {
		i.setTransform(r.dpr, 0, 0, r.dpr, 0, 0);
		let e = t.width / r.dpr, n = t.height / r.dpr;
		i.drawImage(o, 0, 0, t.width, t.height, 0, 0, e, n);
		for (let e of c) {
			let t = e.media;
			if (e.el.mediaKind === "video" && t.readyState >= 2) {
				let { x: n, y: r, w: a, h: o } = e.posterRect;
				i.drawImage(t, n, r, a, o);
			}
			if (e === d || g?.state === e) wi(i, e, t);
			else if (t.paused) {
				let { x: t, y: n, w: r, h: a } = e.posterRect;
				Nn(i, t + r / 2, n + a / 2, r, a, "paused");
			}
		}
	}, p = () => {
		u || (f(), l = requestAnimationFrame(p));
	}, m = (e, n) => {
		let i = t.getBoundingClientRect(), a = t.width / r.dpr, o = t.height / r.dpr;
		return {
			x: (e - i.left) / i.width * a,
			y: (n - i.top) / i.height * o
		};
	}, h = (e, t) => {
		for (let n of c) {
			let { x: r, y: i, w: a, h: o } = n.rect;
			if (e < r || e > r + a || t < i || t > i + o) continue;
			let s = Ai(n), c = s.y - 12, l = s.y + s.h + 8;
			return (Number.isFinite(n.media.duration) ? n.media.duration : 0) > 0 && e >= s.x && e <= s.x + s.w && t >= c && t <= l ? {
				kind: "seek",
				state: n,
				fraction: Math.max(0, Math.min(1, (e - s.x) / s.w))
			} : {
				kind: "toggle",
				state: n
			};
		}
		return null;
	}, g = null, _ = (e, t) => {
		let n = Number.isFinite(e.media.duration) ? e.media.duration : 0;
		n <= 0 || (e.media.currentTime = n * t);
	}, v = (e) => {
		let { x: n, y: r } = m(e.clientX, e.clientY), i = h(n, r);
		i && (i.kind === "seek" ? (g = {
			state: i.state,
			wasPlaying: !i.state.media.paused
		}, i.state.media.pause(), _(i.state, i.fraction), t.setPointerCapture(e.pointerId), e.preventDefault()) : i.state.media.paused ? i.state.media.play().catch(() => void 0) : i.state.media.pause());
	}, y = (e) => {
		let { x: t, y: n } = m(e.clientX, e.clientY);
		d = null;
		for (let e of c) {
			let { x: r, y: i, w: a, h: o } = e.rect;
			if (t >= r && t <= r + a && n >= i && n <= i + o) {
				d = e;
				break;
			}
		}
		if (g) {
			let e = Ai(g.state), n = Math.max(0, Math.min(1, (t - e.x) / e.w));
			_(g.state, n);
		}
	}, b = () => {
		d = null;
	}, x = (e) => {
		if (!g) return;
		let { wasPlaying: n, state: r } = g;
		g = null, t.releasePointerCapture(e.pointerId), n && r.media.play().catch(() => void 0);
	};
	return c.length > 0 && (t.addEventListener("pointerdown", v), t.addEventListener("pointermove", y), t.addEventListener("pointerleave", b), t.addEventListener("pointerup", x), t.addEventListener("pointercancel", x), t.style.cursor = "pointer", p()), {
		play(e) {
			for (let t of c) (!e || t.el.mediaPath === e) && t.media.play().catch(() => void 0);
		},
		pause(e) {
			for (let t of c) (!e || t.el.mediaPath === e) && t.media.pause();
		},
		destroy() {
			if (!u) {
				u = !0, l !== null && cancelAnimationFrame(l), t.removeEventListener("pointerdown", v), t.removeEventListener("pointermove", y), t.removeEventListener("pointerleave", b), t.removeEventListener("pointerup", x), t.removeEventListener("pointercancel", x), t.style.cursor = "";
				for (let e of c) e.media.pause(), e.media.removeAttribute("src"), e.media.load(), URL.revokeObjectURL(e.objectUrl);
			}
		}
	};
}
var yi = 28, bi = 14, xi = 72, Si = 10, Ci = 3;
function wi(e, t, n) {
	let r = Number.isFinite(n.duration) ? n.duration : 0, i = r > 0 ? Math.min(1, n.currentTime / r) : 0, a = t.posterRect;
	Nn(e, a.x + a.w / 2, a.y + a.h / 2, a.w, a.h, n.paused ? "paused" : "playing"), t.el.mediaKind === "audio" ? Ei(e, t, n, r, i) : Ti(e, t, n, r, i);
}
function Ti(e, t, n, r, i) {
	let { x: a, y: o, w: s, h: c } = t.rect, l = Math.max(28, Math.min(56, c * .22)), u = o + c - l;
	e.save();
	let d = e.createLinearGradient(0, u, 0, o + c);
	d.addColorStop(0, "rgba(0, 0, 0, 0)"), d.addColorStop(1, "rgba(0, 0, 0, 0.55)"), e.fillStyle = d, e.fillRect(a, u, s, l), e.restore();
	let f = Ai(t);
	Oi(e, f, i, r > 0), e.save(), e.font = "500 11px system-ui, -apple-system, sans-serif", e.textBaseline = "middle", e.shadowColor = "rgba(0, 0, 0, 0.75)", e.shadowBlur = 3, e.fillStyle = "rgba(255, 255, 255, 0.95)", Di(e, n.currentTime, r, f.x, f.y - 10, "bottom"), e.restore();
}
function Ei(e, t, n, r, i) {
	let a = ki(t.rect);
	e.save(), ji(e, a.x, a.y, a.w, a.h, a.h / 2), e.fillStyle = "rgba(20, 20, 20, 0.72)", e.fill(), e.font = "500 11px system-ui, -apple-system, sans-serif", e.textBaseline = "middle", e.fillStyle = "rgba(255, 255, 255, 0.95)", Di(e, n.currentTime, r, a.x + bi, a.y + a.h / 2, "middle"), e.restore(), Oi(e, Ai(t), i, r > 0);
}
function Di(e, t, n, r, i, a) {
	let o = Mi(t), s = Mi(n), c = mi(e), l = hi(e, o, c), u = hi(e, s, c), d = e.measureText(" / ").width, f = Math.max(l, u);
	gi(e, o, r + f - l, i, c);
	let p = e.textAlign;
	e.textAlign = "left", e.fillText(" / ", r + f, i), e.textAlign = p, gi(e, s, r + f + d, i, c);
}
function Oi(e, t, n, r) {
	let i = t.h / 2;
	if (e.save(), ji(e, t.x, t.y, t.w, t.h, i), e.fillStyle = "rgba(255, 255, 255, 0.35)", e.fill(), n > 0 && (ji(e, t.x, t.y, t.w * n, t.h, i), e.fillStyle = "#fff", e.fill()), r) {
		let r = Math.max(t.x + 5, Math.min(t.x + t.w - 5, t.x + t.w * n));
		e.shadowColor = "rgba(0, 0, 0, 0.3)", e.shadowBlur = 3, e.fillStyle = "#fff", e.beginPath(), e.arc(r, t.y + t.h / 2, 5, 0, Math.PI * 2), e.fill();
	}
	e.restore();
}
function ki(e) {
	let t = Math.max(220, e.w - 24);
	return {
		x: e.x + e.w / 2 - t / 2,
		y: e.y + e.h - yi - 4,
		w: t,
		h: yi
	};
}
function Ai(e) {
	if (e.el.mediaKind === "audio") {
		let t = ki(e.rect), n = t.x + bi + xi + Si, r = Math.max(40, t.x + t.w - bi - n);
		return {
			x: n,
			y: t.y + (t.h - Ci) / 2,
			w: r,
			h: Ci
		};
	}
	let t = e.rect, n = Math.max(12, t.w * .025), r = Math.max(12, Math.min(18, t.h * .05));
	return {
		x: t.x + n,
		y: t.y + t.h - Ci - r,
		w: t.w - n * 2,
		h: Ci
	};
}
function ji(e, t, n, r, i, a) {
	let o = Math.min(a, i / 2, r / 2);
	e.beginPath(), e.moveTo(t + o, n), e.lineTo(t + r - o, n), e.quadraticCurveTo(t + r, n, t + r, n + o), e.lineTo(t + r, n + i - o), e.quadraticCurveTo(t + r, n + i, t + r - o, n + i), e.lineTo(t + o, n + i), e.quadraticCurveTo(t, n + i, t, n + i - o), e.lineTo(t, n + o), e.quadraticCurveTo(t, n, t + o, n), e.closePath();
}
function Mi(e) {
	if (!Number.isFinite(e) || e < 0) return "0:00";
	let t = Math.floor(e);
	return `${Math.floor(t / 60)}:${(t % 60).toString().padStart(2, "0")}`;
}
//#endregion
//#region packages/pptx/src/notes.ts
function Ni(e, t) {
	return !Number.isInteger(t) || t < 0 || t >= e.length ? null : e[t].notes ?? null;
}
//#endregion
//#region packages/pptx/src/hidden.ts
function Pi(e, t) {
	return !Number.isInteger(t) || t < 0 || t >= e.length ? !1 : e[t].hidden ?? !1;
}
//#endregion
//#region packages/pptx/src/slide-nav.ts
function Fi(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		r !== void 0 && r !== "" && !t.has(r) && t.set(r, n);
	}
	return t;
}
function Ii(e, t) {
	if (e === "") return;
	let n = Tn("ppt/slides", e);
	return t.get(n);
}
function Li(e, t, n) {
	let r = En(e);
	return r === null ? Ii(e, t) : Dn(r, n, t.size);
}
//#endregion
//#region packages/pptx/src/google-fonts.ts
var Ri = {
	...n,
	...x
};
function* zi(e) {
	for (let t of e?.paragraphs ?? []) for (let e of t.runs) e.type === "text" && (yield e.text);
}
function* Bi(e) {
	for (let t of e.slides) for (let e of t.elements) if (e.type === "shape") yield* zi(e.textBody);
	else if (e.type === "table") for (let t of e.rows) for (let e of t.cells) yield* zi(e.textBody);
	else if (e.type === "chart") {
		e.chart.title && (yield e.chart.title);
		for (let t of e.chart.categories) yield t;
		for (let t of e.chart.series) t.name && (yield t.name);
	}
}
function Vi(e) {
	let t = u(e.majorFont) ?? u(e.minorFont) ?? null;
	return [
		e.majorFont,
		e.minorFont,
		...Me(Bi(e), t)
	];
}
//#endregion
//#region packages/pptx/src/media-mime.ts
function Hi(e, t) {
	for (let n of e.slides) for (let e of n.elements) {
		if (e.type !== "media") continue;
		let n = e;
		if (n.mediaPath === t) return n.mimeType;
		if (n.posterPath === t) return n.posterMimeType;
	}
	return "";
}
//#endregion
//#region packages/pptx/src/worker.ts?worker&inline
var Ui = "function e(e){if(!e.startsWith(`data:`))return null;let t=e.indexOf(`,`);if(t===-1)return null;let n=atob(e.slice(t+1)),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);return r.buffer}var t=class e extends Error{code=`parser-crashed`;constructor(t){super(t),this.name=`WasmTrapError`,Object.setPrototypeOf(this,e.prototype)}};function n(e){let t=globalThis.WebAssembly?.RuntimeError;if(t&&e instanceof t||e instanceof RangeError)return!0;if(e instanceof Error){let t=e.name;if(t===`RuntimeError`||t===`CompileError`||t===`LinkError`)return!0}return!1}var r=class{_init;_opts;_wasmInput=null;_initPromise=null;_poisoned=!1;_archive=null;constructor(e,t={}){this._init=e,this._opts=t}setWasmUrl(e){this._wasmInput=e,this._poisoned=!1,this._initPromise=this._init(e)}get archive(){return this._archive}setArchive(e){this._freeArchive(),this._archive=e}disposeArchive(){this._freeArchive()}_freeArchive(){this._archive!=null&&this._opts.freeArchive&&this._opts.freeArchive(this._archive),this._archive=null}get poisoned(){return this._poisoned}async ensureReady(){if(this._poisoned){if(this._wasmInput===null)throw Error(`WasmParserHost: setWasmUrl was never called`);let e=(this._opts.reinit??this._init)(this._wasmInput);this._initPromise=e,await e,this._poisoned=!1;return}if(this._initPromise===null)throw Error(`WasmParserHost: setWasmUrl was never called`);await this._initPromise}run(e){try{return e()}catch(e){throw n(e)?(this._poison(),new t(`WASM parser trapped and was recycled: ${e instanceof Error?e.message:String(e)}`)):e}}poison(){this._poison()}_poison(){if(this._poisoned=!0,this._initPromise=null,this._archive!=null&&this._opts.freeArchive)try{this._opts.freeArchive(this._archive)}catch{}this._archive=null}},i=class{__destroy_into_raw(){let e=this.__wbg_ptr;return this.__wbg_ptr=0,o.unregister(this),e}free(){let e=this.__destroy_into_raw();S.__wbg_pptxarchive_free(e,0)}extract_image(e){let t=h(e,S.__wbindgen_malloc,S.__wbindgen_realloc),n=x,r=S.pptxarchive_extract_image(this.__wbg_ptr,t,n);if(r[3])throw g(r[2]);var i=s(r[0],r[1]).slice();return S.__wbindgen_free(r[0],r[1]*1,1),i}extract_media(e){let t=h(e,S.__wbindgen_malloc,S.__wbindgen_realloc),n=x,r=S.pptxarchive_extract_media(this.__wbg_ptr,t,n);if(r[3])throw g(r[2]);var i=s(r[0],r[1]).slice();return S.__wbindgen_free(r[0],r[1]*1,1),i}constructor(e,t){let n=m(e,S.__wbindgen_malloc),r=x,i=S.pptxarchive_new(n,r,!p(t),p(t)?BigInt(0):t);if(i[2])throw g(i[1]);return this.__wbg_ptr=i[0]>>>0,o.register(this,this.__wbg_ptr,this),this}parse(){let e=S.pptxarchive_parse(this.__wbg_ptr);if(e[3])throw g(e[2]);var t=s(e[0],e[1]).slice();return S.__wbindgen_free(e[0],e[1]*1,1),t}to_markdown(){let e,t;try{let i=S.pptxarchive_to_markdown(this.__wbg_ptr);var n=i[0],r=i[1];if(i[3])throw n=0,r=0,g(i[2]);return e=n,t=r,u(n,r)}finally{S.__wbindgen_free(e,t,1)}}};Symbol.dispose&&(i.prototype[Symbol.dispose]=i.prototype.free);function a(){return{__proto__:null,\"./pptx_parser_bg.js\":{__proto__:null,__wbg___wbindgen_throw_6b64449b9b9ed33c:function(e,t){throw Error(u(e,t))},__wbg_error_a6fa202b58aa1cd3:function(e,t){let n,r;try{n=e,r=t,console.error(u(e,t))}finally{S.__wbindgen_free(n,r,1)}},__wbg_new_227d7c05414eb861:function(){return Error()},__wbg_stack_3b0d974bbf31e44f:function(e,t){let n=t.stack,r=h(n,S.__wbindgen_malloc,S.__wbindgen_realloc),i=x;l().setInt32(e+4,i,!0),l().setInt32(e+0,r,!0)},__wbindgen_cast_0000000000000001:function(e,t){return u(e,t)},__wbindgen_init_externref_table:function(){let e=S.__wbindgen_externrefs,t=e.grow(4);e.set(0,void 0),e.set(t+0,void 0),e.set(t+1,null),e.set(t+2,!0),e.set(t+3,!1)}}}}const o=typeof FinalizationRegistry>`u`?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>S.__wbg_pptxarchive_free(e>>>0,1));function s(e,t){return e>>>=0,f().subarray(e/1,e/1+t)}let c=null;function l(){return(c===null||c.buffer.detached===!0||c.buffer.detached===void 0&&c.buffer!==S.memory.buffer)&&(c=new DataView(S.memory.buffer)),c}function u(e,t){return e>>>=0,y(e,t)}let d=null;function f(){return(d===null||d.byteLength===0)&&(d=new Uint8Array(S.memory.buffer)),d}function p(e){return e==null}function m(e,t){let n=t(e.length*1,1)>>>0;return f().set(e,n/1),x=e.length,n}function h(e,t,n){if(n===void 0){let n=b.encode(e),r=t(n.length,1)>>>0;return f().subarray(r,r+n.length).set(n),x=n.length,r}let r=e.length,i=t(r,1)>>>0,a=f(),o=0;for(;o<r;o++){let t=e.charCodeAt(o);if(t>127)break;a[i+o]=t}if(o!==r){o!==0&&(e=e.slice(o)),i=n(i,r,r=o+e.length*3,1)>>>0;let t=f().subarray(i+o,i+r),a=b.encodeInto(e,t);o+=a.written,i=n(i,r,o,1)>>>0}return x=o,i}function g(e){let t=S.__wbindgen_externrefs.get(e);return S.__externref_table_dealloc(e),t}let _=new TextDecoder(`utf-8`,{ignoreBOM:!0,fatal:!0});_.decode();let v=0;function y(e,t){return v+=t,v>=2146435072&&(_=new TextDecoder(`utf-8`,{ignoreBOM:!0,fatal:!0}),_.decode(),v=t),_.decode(f().subarray(e,e+t))}const b=new TextEncoder;`encodeInto`in b||(b.encodeInto=function(e,t){let n=b.encode(e);return t.set(n),{read:e.length,written:n.length}});let x=0,S;function C(e,t){return S=e.exports,c=null,d=null,S.__wbindgen_start(),S}async function w(e,t){if(typeof Response==`function`&&e instanceof Response){if(typeof WebAssembly.instantiateStreaming==`function`)try{return await WebAssembly.instantiateStreaming(e,t)}catch(t){if(e.ok&&n(e.type)&&e.headers.get(`Content-Type`)!==`application/wasm`)console.warn(\"`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\\n\",t);else throw t}let r=await e.arrayBuffer();return await WebAssembly.instantiate(r,t)}else{let n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}function n(e){switch(e){case`basic`:case`cors`:case`default`:return!0}return!1}}async function T(e){if(S!==void 0)return S;e!==void 0&&(Object.getPrototypeOf(e)===Object.prototype?{module_or_path:e}=e:console.warn(`using deprecated parameters for the initialization function; pass a single object instead`));let t=a();(typeof e==`string`||typeof Request==`function`&&e instanceof Request||typeof URL==`function`&&e instanceof URL)&&(e=fetch(e));let{instance:n,module:r}=await w(await e,t);return C(n,r)}async function E(e){return S=void 0,c=null,d=null,T(e)}const D=new r(T,{freeArchive:e=>e.free(),reinit:E});self.onmessage=async t=>{let n=t.data;if(n.kind===`init`){D.setWasmUrl(e(n.wasmUrl)??n.wasmUrl);return}let r=n.id;try{if(await D.ensureReady(),n.kind===`parse`){let e=typeof n.maxZipEntryBytes==`number`&&n.maxZipEntryBytes>0?BigInt(n.maxZipEntryBytes):void 0,t=new Uint8Array(n.buffer),a=D.run(()=>{let n=new i(t,e);return D.setArchive(n),n.parse()}).buffer,o={kind:`parsed`,id:r,presentationJson:a};self.postMessage(o,[a]);return}let e=D.archive;if(n.kind===`extractMedia`){if(!e)throw Error(`No pptx loaded`);let t=D.run(()=>e.extract_media(n.path).buffer),i={kind:`mediaExtracted`,id:r,bytes:t};self.postMessage(i,[t]);return}if(n.kind===`extractImage`){if(!e)throw Error(`No pptx loaded`);let t=D.run(()=>e.extract_image(n.path).buffer),i={kind:`imageExtracted`,id:r,bytes:t};self.postMessage(i,[t]);return}if(n.kind===`toMarkdown`){if(!e)throw Error(`No pptx loaded`);let t={kind:`markdownRendered`,id:r,markdown:D.run(()=>e.to_markdown())};self.postMessage(t);return}}catch(e){let t={kind:`error`,id:r,message:e instanceof Error?e.message:String(e)};self.postMessage(t)}};", Wi = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Ui], { type: "text/javascript;charset=utf-8" });
function Gi(e) {
	let t;
	try {
		if (t = Wi && (self.URL || self.webkitURL).createObjectURL(Wi), !t) throw "";
		let n = new Worker(t, {
			type: "module",
			name: e?.name
		});
		return n.addEventListener("error", () => {
			(self.URL || self.webkitURL).revokeObjectURL(t);
		}), n;
	} catch {
		return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(Ui), {
			type: "module",
			name: e?.name
		});
	}
}
//#endregion
//#region packages/pptx/src/wasm/pptx_parser_bg.wasm?url
var Ki = new URL("pptx_parser_bg.wasm", import.meta.url).href, qi = class e {
	_worker;
	_bridge;
	_mode = "main";
	_presentation = null;
	_meta = null;
	_slidePartIndex = null;
	_mediaCache = /* @__PURE__ */ new Map();
	_imageCache = /* @__PURE__ */ new Map();
	_googleFontFaces = [];
	_fetchImage = (e, t) => this.getImage(e, t);
	_math;
	constructor(e, t, n) {
		this._worker = e, this._mode = t, this._bridge = new s(this._worker, {
			correlate: (e) => e.id,
			toError: (e) => e.kind === "error" ? e.message : void 0
		});
		let r = new URL(n ?? Ki, location.href).href;
		this._bridge.post({
			kind: "init",
			wasmUrl: r
		});
	}
	static async load(t, n = {}) {
		let r = n.mode ?? "main";
		if (r === "worker" && (typeof Worker > "u" || typeof OffscreenCanvas > "u")) throw Error("mode: 'worker' requires Worker and OffscreenCanvas support");
		let i;
		if (typeof t == "string") {
			let e = await fetch(t);
			if (!e.ok) throw Error(`Failed to fetch: ${e.status} ${e.statusText}`);
			i = await e.arrayBuffer();
		} else i = t;
		i = f(await _e(i, n.password));
		let a = new e(r === "worker" ? (await import("./render-worker-host-BzhGwe0I.js")).createRenderWorker() : new Gi(), r, n.wasmUrl);
		return n.math && r === "worker" && console.warn("[ooxml] the math engine is unavailable in mode: 'worker'; equations will be skipped. Use mode: 'main' for documents with equations."), a._math = r === "worker" ? void 0 : n.math, await a._parse(i, n.maxZipEntryBytes, r === "worker" ? !!n.useGoogleFonts : !1, n.workerTimeoutMs), r === "main" && n.useGoogleFonts && a._presentation && (a._googleFontFaces = await c(Vi(a._presentation), Ri)), a;
	}
	async _parse(e, t, n = !1, r) {
		let i = await this._bridge.request((r) => this._mode === "worker" ? {
			kind: "parse",
			id: r,
			buffer: e,
			maxZipEntryBytes: t,
			useGoogleFonts: n
		} : {
			kind: "parse",
			id: r,
			buffer: e,
			maxZipEntryBytes: t
		}, [e], { timeoutMs: r });
		if (this._mode === "worker") this._meta = i.meta;
		else {
			let { presentationJson: e } = i;
			this._presentation = JSON.parse(new TextDecoder().decode(new Uint8Array(e)));
		}
	}
	get slideCount() {
		return this._presentation?.slides.length ?? this._meta?.slideCount ?? 0;
	}
	get slideWidth() {
		return this._presentation?.slideWidth ?? this._meta?.slideWidth ?? 0;
	}
	get slideHeight() {
		return this._presentation?.slideHeight ?? this._meta?.slideHeight ?? 0;
	}
	get mode() {
		return this._mode;
	}
	getNotes(e) {
		return this._meta ? Number.isInteger(e) ? this._meta.notes[e] ?? null : null : Ni(this._presentation?.slides ?? [], e);
	}
	isHidden(e) {
		return this._meta ? Number.isInteger(e) ? this._meta.hidden[e] ?? !1 : !1 : Pi(this._presentation?.slides ?? [], e);
	}
	_partNames() {
		return this._meta ? this._meta.partNames : (this._presentation?.slides ?? []).map((e) => e.partName);
	}
	_partIndex() {
		return this._slidePartIndex ||= Fi(this._partNames()), this._slidePartIndex;
	}
	getSlideIndexByPartName(e) {
		return this._partIndex().get(e);
	}
	resolveInternalTarget(e, t = 0) {
		return Li(e, this._partIndex(), t);
	}
	async renderSlide(e, t, n = {}) {
		if (this._mode === "worker") throw Error("renderSlide(canvas) is unavailable in mode: 'worker'; use renderSlideToBitmap() and paint it via an ImageBitmapRenderingContext");
		if (!this._presentation) throw Error("Presentation not loaded");
		let r = this._presentation.slides[t];
		if (!r) throw Error(`Slide index ${t} out of range (count: ${this.slideCount})`);
		let i = n.dpr ?? o(), a = n.width ?? ((p(e) ? e.offsetWidth : 0) || 960);
		await di(e, r, this._presentation.slideWidth, this._presentation.slideHeight, {
			width: a,
			dpr: i,
			defaultTextColor: this._presentation.defaultTextColor,
			majorFont: this._presentation.majorFont,
			minorFont: this._presentation.minorFont,
			hlinkColor: this._presentation.hlinkColor ?? null,
			fetchMedia: (e) => this.getMedia(e),
			fetchImage: this._fetchImage,
			skipMediaControls: n.skipMediaControls,
			dim: n.dim,
			math: this._math
		}, n.onTextRun);
	}
	async renderSlideToBitmap(e, t = {}) {
		let n = t.width ?? 960, r = t.dpr ?? o();
		if (this._mode === "worker") {
			if (!Number.isInteger(e) || e < 0 || e >= this.slideCount) throw Error(`Slide index ${e} out of range (count: ${this.slideCount})`);
			let i = await this._bridge.request((i) => ({
				kind: "renderSlide",
				id: i,
				slideIndex: e,
				width: n,
				dpr: r,
				skipMediaControls: t.skipMediaControls,
				dim: t.dim
			}));
			if (t.onTextRun) for (let e of i.runs) t.onTextRun(e);
			return i.bitmap;
		}
		let i = new OffscreenCanvas(1, 1);
		return await this.renderSlide(i, e, {
			width: n,
			dpr: r,
			skipMediaControls: t.skipMediaControls,
			dim: t.dim,
			onTextRun: t.onTextRun
		}), i.transferToImageBitmap();
	}
	async collectSlideRuns(e, t = 960) {
		if (this._mode === "worker") {
			if (!Number.isInteger(e) || e < 0 || e >= this.slideCount) throw Error(`Slide index ${e} out of range (count: ${this.slideCount})`);
			return (await this._bridge.request((n) => ({
				kind: "collectRuns",
				id: n,
				slideIndex: e,
				width: t
			}))).runs;
		}
		let n = [], r = new OffscreenCanvas(1, 1);
		return await this.renderSlide(r, e, {
			width: t,
			onTextRun: (e) => n.push(e)
		}), n;
	}
	async getMedia(e) {
		let t = this._mediaCache.get(e);
		if (t) return t;
		let n = this._findMimeTypeForPath(e), r = (async () => {
			let t = (await this._bridge.request((t) => ({
				kind: "extractMedia",
				id: t,
				path: e
			}))).bytes;
			return new Blob([t], { type: n });
		})();
		return this._mediaCache.set(e, r), r;
	}
	_findMimeTypeForPath(e) {
		return this._presentation ? Hi(this._presentation, e) : "";
	}
	async getImage(e, t) {
		let n = this._imageCache.get(e);
		if (n) return n;
		let r = (async () => {
			let n = (await this._bridge.request((t) => ({
				kind: "extractImage",
				id: t,
				path: e
			}))).bytes;
			return new Blob([n], { type: t });
		})();
		return this._imageCache.set(e, r), r;
	}
	async toMarkdown() {
		return (await this._bridge.request((e) => ({
			kind: "toMarkdown",
			id: e
		}))).markdown;
	}
	async presentSlide(e, t, n = {}) {
		if (this._mode === "main" && !this._presentation) throw Error("Presentation not loaded");
		if (!Number.isInteger(t) || t < 0 || t >= this.slideCount) throw Error(`Slide index ${t} out of range (count: ${this.slideCount})`);
		let r = n.dpr ?? o(), i = n.width ?? (e.offsetWidth || 960), a = this._mode === "worker" ? async () => {
			let a = await this.renderSlideToBitmap(t, {
				width: i,
				dpr: r,
				skipMediaControls: !0,
				dim: n.dim,
				onTextRun: n.onTextRun
			});
			e.width = a.width, e.height = a.height, e.style.width = `${Math.round(a.width / r)}px`, e.style.display || (e.style.display = "block");
			let o = e.getContext("2d");
			if (!o) throw Error("2D context not available");
			o.drawImage(a, 0, 0), a.close();
		} : () => this.renderSlide(e, t, {
			width: i,
			dpr: r,
			skipMediaControls: !0,
			dim: n.dim,
			onTextRun: n.onTextRun
		});
		return vi(e, this._mode === "worker" ? this._meta?.mediaElements[t] ?? [] : this._presentation.slides[t].elements.filter((e) => e.type === "media"), {
			width: i,
			dpr: r,
			slideWidthEmu: this.slideWidth,
			fetchMedia: (e) => this.getMedia(e),
			fetchImage: this._fetchImage,
			drawBase: a
		});
	}
	destroy() {
		this._bridge.terminate(), this._presentation = null, this._meta = null, this._slidePartIndex = null, this._mediaCache.clear(), this._imageCache.clear(), this._googleFontFaces.length > 0 && (D(this._googleFontFaces), this._googleFontFaces = []), ie(this._fetchImage), Ke(this._fetchImage), B(this._fetchImage);
	}
}, Ji = {
	color: "#ffffff",
	opacity: .6
}, Yi = class {
	canvas;
	wrapper;
	_scale = null;
	_originalParent;
	_originalNextSibling;
	_originalDisplay;
	textLayer = null;
	highlightLayer = null;
	_find;
	_measureCtx = null;
	engine = null;
	opts;
	currentSlide = 0;
	_hiddenMode;
	handle = null;
	_mode;
	_bitmapCtx = null;
	_destroyed = !1;
	_loadGen = 0;
	constructor(e, t = {}) {
		this.opts = t, this.canvas = e, this._mode = t.mode ?? "main", this._hiddenMode = t.hiddenSlideMode ?? "show";
		let n = e.parentElement;
		this._originalParent = n, this._originalNextSibling = e.nextSibling, this._originalDisplay = e.style.display, this.wrapper = document.createElement("div"), this.wrapper.style.cssText = "position:relative;display:inline-block;vertical-align:top;", e.style.display || (e.style.display = "block"), n && n.insertBefore(this.wrapper, e), this.wrapper.appendChild(e), this._mode === "worker" && !t.enableMediaPlayback && (this._bitmapCtx = e.getContext("bitmaprenderer")), t.enableTextSelection && (this.textLayer = document.createElement("div"), this.textLayer.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;user-select:text;-webkit-user-select:text;", this.wrapper.appendChild(this.textLayer)), this.highlightLayer = document.createElement("div"), this.highlightLayer.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;", this.wrapper.appendChild(this.highlightLayer), this._find = new An(() => this.slideCount, (e) => this._collectSlideRuns(e));
	}
	async load(e) {
		let t = ++this._loadGen, n = this.engine;
		try {
			let r = await qi.load(e, {
				useGoogleFonts: this.opts.useGoogleFonts,
				maxZipEntryBytes: this.opts.maxZipEntryBytes,
				workerTimeoutMs: this.opts.workerTimeoutMs,
				wasmUrl: this.opts.wasmUrl,
				math: this.opts.math,
				mode: this._mode
			});
			if (t !== this._loadGen) {
				r.destroy();
				return;
			}
			this.handle?.destroy(), this.handle = null, this.engine = r, n?.destroy(), this.currentSlide = this._initialSlide(), this._find.invalidate(), await this.renderCurrentSlide();
		} catch (e) {
			if (t !== this._loadGen) return;
			let n = e instanceof Error ? e : Error(String(e));
			if (this.opts.onError) {
				this.opts.onError(n);
				return;
			}
			throw n;
		}
	}
	async goToSlide(e) {
		!this.engine || this.slideCount === 0 || (this.currentSlide = Math.max(0, Math.min(e, this.slideCount - 1)), await this.renderCurrentSlide());
	}
	async nextSlide() {
		await this.goToSlide(this._step(1));
	}
	async prevSlide() {
		await this.goToSlide(this._step(-1));
	}
	_step(e) {
		return this._hiddenMode === "skip" && this.engine ? qe(this.currentSlide, e, (e) => this.engine.isHidden(e), this.slideCount) : this.currentSlide + e;
	}
	_initialSlide() {
		return this._hiddenMode === "skip" && this.engine ? Je(0, (e) => this.engine.isHidden(e), this.slideCount) : 0;
	}
	_dim() {
		return {
			color: this.opts.hiddenSlideDim?.color ?? Ji.color,
			opacity: this.opts.hiddenSlideDim?.opacity ?? Ji.opacity
		};
	}
	async setHiddenSlideMode(e) {
		this._hiddenMode = e, e === "skip" && this.engine && (this.currentSlide = Je(this.currentSlide, (e) => this.engine.isHidden(e), this.slideCount)), await this.renderCurrentSlide();
	}
	get hiddenSlideMode() {
		return this._hiddenMode;
	}
	get visibleSlideCount() {
		if (!this.engine) return 0;
		let e = this.engine;
		return Ye((t) => e.isHidden(t), this.slideCount);
	}
	get slideIndex() {
		return this.currentSlide;
	}
	get slideCount() {
		return this.engine?.slideCount ?? 0;
	}
	getNotes(e) {
		return this.engine?.getNotes(e) ?? null;
	}
	get canvasElement() {
		return this.canvas;
	}
	_naturalWidthPx() {
		let t = this.engine?.slideWidth ?? 0;
		return t > 0 ? t / e : 0;
	}
	_targetWidth() {
		if (this._scale === null) return this.opts.width ?? (this.canvas.offsetWidth || 960);
		let e = this._naturalWidthPx();
		return e <= 0 ? this.opts.width ?? (this.canvas.offsetWidth || 960) : Math.round(e * this._scale);
	}
	getScale() {
		if (this._scale !== null) return this._scale;
		let e = this._naturalWidthPx();
		return e <= 0 ? 1 : this._targetWidth() / e;
	}
	_zoomMin() {
		return this.opts.zoomMin ?? .1;
	}
	_zoomMax() {
		return this.opts.zoomMax ?? 4;
	}
	async setScale(e) {
		let t = Ce(e, this._zoomMin(), this._zoomMax()), n = t !== this.getScale();
		this._scale = t, await this.renderCurrentSlide(), n && this.opts.onScaleChange?.(t);
	}
	async zoomIn() {
		await this.setScale(U(this.getScale()));
	}
	async zoomOut() {
		await this.setScale(me(this.getScale()));
	}
	async fitWidth() {
		await this._fit("width");
	}
	async fitPage() {
		await this._fit("page");
	}
	async _fit(t) {
		if (!this.engine) return;
		let n = this.wrapper.parentElement;
		if (!n) return;
		let r = V({
			contentWidth: this.engine.slideWidth / e,
			contentHeight: this.engine.slideHeight / e,
			containerWidth: n.clientWidth,
			containerHeight: n.clientHeight
		}, t);
		r <= 0 || await this.setScale(r);
	}
	async renderCurrentSlide() {
		if (!this.engine) return;
		let e = this._hiddenMode === "dim" && this.engine.isHidden(this.currentSlide) ? this._dim() : void 0, t = this._targetWidth(), n = this.opts.dpr ?? (window.devicePixelRatio || 1), r = t / this.engine.slideWidth, i = Math.round(this.engine.slideHeight * r);
		this.canvas.style.width = `${t}px`, this.canvas.style.height = `${i}px`, this.handle?.destroy(), this.handle = null;
		let a = this._mode === "worker", o = [], s = (e) => o.push(e);
		try {
			if (this.opts.enableMediaPlayback) this.handle = await this.engine.presentSlide(this.canvas, this.currentSlide, {
				width: t,
				dpr: n,
				dim: e,
				onTextRun: s
			});
			else if (a) {
				let r = await this.engine.renderSlideToBitmap(this.currentSlide, {
					width: t,
					dpr: n,
					dim: e,
					onTextRun: s
				});
				this.canvas.width = r.width, this.canvas.height = r.height, this._bitmapCtx?.transferFromImageBitmap(r);
			} else await this.engine.renderSlide(this.canvas, this.currentSlide, {
				width: t,
				dpr: n,
				onTextRun: s,
				dim: e
			});
			this.opts.onSlideChange?.(this.currentSlide, this.slideCount);
		} catch (e) {
			this._reportRenderError(e);
		}
		this.textLayer && this._buildTextLayer(this.textLayer, o, t, i), this._find.setSlideRuns(this.currentSlide, o), this._buildHighlightLayer(o, t, i);
	}
	_buildHighlightLayer(e, t, n) {
		let r = this.highlightLayer;
		r && kn(r, e, this._find.slideHighlights(this.currentSlide), t, n, (e) => this._measureForFont(e));
	}
	_measureForFont(e) {
		this._measureCtx ||= document.createElement("canvas").getContext("2d");
		let t = this._measureCtx;
		return t ? (t.font = e, (e) => t.measureText(e).width) : (e) => e.length;
	}
	async _collectSlideRuns(e) {
		return this.engine ? this.engine.collectSlideRuns(e, this._targetWidth()) : [];
	}
	async findText(e, t = {}) {
		if (!this.engine) return [];
		let n = await this._find.find(e, t);
		return this._redrawHighlights(), n;
	}
	async findNext() {
		return this._activateMatch(this._find.next());
	}
	async findPrev() {
		return this._activateMatch(this._find.prev());
	}
	clearFind() {
		this._find.invalidate(), this._redrawHighlights();
	}
	async _activateMatch(e) {
		return e ? (e.location.slide === this.currentSlide ? this._redrawHighlights() : await this.goToSlide(e.location.slide), e) : (this._redrawHighlights(), null);
	}
	_redrawHighlights() {
		let e = this._find.slideRuns(this.currentSlide) ?? [], t = this._targetWidth(), n = this.engine ? Math.round(this.engine.slideHeight * (t / this.engine.slideWidth)) : 0;
		this._buildHighlightLayer(e, t, n);
	}
	_buildTextLayer(e, t, n, r) {
		On(e, t, n, r, this._hyperlinkHandler());
	}
	_hyperlinkHandler() {
		if (this.opts.enableHyperlinks !== !1) return (e) => this._onHyperlinkClick(e);
	}
	_onHyperlinkClick(e) {
		let t = this._resolveInternalSlideIndex(e);
		if (this.opts.onHyperlinkClick) {
			this.opts.onHyperlinkClick(t);
			return;
		}
		if (t.kind === "external") {
			oe(t.url);
			return;
		}
		t.slideIndex !== void 0 && this.goToSlide(t.slideIndex);
	}
	_resolveInternalSlideIndex(e) {
		if (e.kind !== "internal" || e.slideIndex !== void 0) return e;
		let t = this.engine?.resolveInternalTarget(e.ref, this.currentSlide);
		return t === void 0 ? e : {
			...e,
			slideIndex: t
		};
	}
	_reportRenderError(e) {
		if (this._destroyed) return;
		let t = e instanceof Error ? e : Error(String(e));
		this.opts.onError ? this.opts.onError(t) : console.error("[ooxml] PptxViewer render failed:", t);
	}
	destroy() {
		if (this._destroyed = !0, this._loadGen++, this.handle?.destroy(), this.handle = null, this.engine?.destroy(), this._find.invalidate(), this._originalParent) {
			let e = this._originalNextSibling && this._originalNextSibling.parentNode === this._originalParent ? this._originalNextSibling : null;
			this._originalParent.insertBefore(this.canvas, e);
		} else this.canvas.parentNode && this.canvas.parentNode.removeChild(this.canvas);
		this.canvas.style.display = this._originalDisplay, this.wrapper.remove();
	}
}, Xi = 150, Zi = "0 1px 3px rgba(0,0,0,0.2)", Qi = class {
	_pres = null;
	_injected;
	_opts;
	_container;
	_wrapper;
	_scrollHost;
	_spacer;
	_mode;
	_scale = 1;
	_scaleEstablished = !1;
	_pendingScale = null;
	_slots = /* @__PURE__ */ new Map();
	_free = [];
	_heights = [];
	_lastRange = null;
	_lastTopIndex = -1;
	_scrollListener = null;
	_destroyed = !1;
	_loadGen = 0;
	_slideInFlight = /* @__PURE__ */ new Set();
	_renderEpoch = 0;
	_settleTimer = null;
	_wheelListener = null;
	_pendingZoomAnchor = null;
	_resizeObserver = null;
	_prevBase = 0;
	_lastFitWidth = 0;
	_pageShadow;
	constructor(e, t = {}) {
		if (e.tagName === "CANVAS") throw Error("PptxScrollViewer takes a container element (e.g. a <div>), not a <canvas> — the viewer creates and manages its own canvases. Pass a block container; for the single-slide canvas API use PptxViewer.");
		if (this._container = e, this._opts = t, this._pageShadow = t.pageShadow ?? Zi, this._injected = !!t.presentation, this._injected) {
			let e = t.presentation;
			if (t.mode !== void 0 && t.mode !== e.mode) throw Error(`PptxScrollViewer: opts.mode='${t.mode}' conflicts with the injected engine's mode='${e.mode}'. Omit opts.mode when injecting an engine — the engine owns its render mode.`);
			this._pres = e, this._mode = e.mode;
		} else this._mode = t.mode ?? "main";
		this._wrapper = document.createElement("div"), this._wrapper.style.cssText = "position:relative;width:100%;height:100%;overflow:hidden;", this._scrollHost = document.createElement("div"), this._scrollHost.style.cssText = "position:absolute;inset:0;overflow:auto;", t.background && (this._scrollHost.style.background = t.background), this._spacer = document.createElement("div"), this._spacer.style.cssText = "position:absolute;top:0;left:0;width:1px;height:0;pointer-events:none;", this._scrollHost.appendChild(this._spacer), this._wrapper.appendChild(this._scrollHost), this._container.appendChild(this._wrapper), this._scrollListener = () => this._onScroll(), this._scrollHost.addEventListener("scroll", this._scrollListener), this._opts.enableZoom !== !1 && (this._wheelListener = (e) => {
			if (!(e.ctrlKey || e.metaKey) || (e.preventDefault(), e.deltaY === 0)) return;
			let t = this._scrollHost.getBoundingClientRect(), n = e.clientX - t.left, r = e.clientY - t.top;
			this._pendingZoomAnchor = Number.isFinite(n) && Number.isFinite(r) ? {
				x: n,
				y: r
			} : null, this.setScale(te(this._scale, e.deltaY));
		}, this._scrollHost.addEventListener("wheel", this._wheelListener, { passive: !1 })), typeof ResizeObserver < "u" && (this._resizeObserver = new ResizeObserver(() => this._onResize()), this._resizeObserver.observe(this._container)), this._injected && this.relayout();
	}
	async load(e) {
		if (this._injected) throw Error("PptxScrollViewer.load() is unsupported when an engine is injected via opts.presentation; the injected engine is already loaded.");
		let t = ++this._loadGen, n = this._pres;
		try {
			let r = await qi.load(e, {
				useGoogleFonts: this._opts.useGoogleFonts,
				maxZipEntryBytes: this._opts.maxZipEntryBytes,
				workerTimeoutMs: this._opts.workerTimeoutMs,
				wasmUrl: this._opts.wasmUrl,
				math: this._opts.math,
				mode: this._mode
			});
			if (t !== this._loadGen) {
				r.destroy();
				return;
			}
			if (this._pres = r, n?.destroy(), n) {
				for (let [e, t] of [...this._slots]) this._recycleSlot(e, t);
				this._lastTopIndex = -1;
			}
			this.relayout();
		} catch (e) {
			if (t !== this._loadGen) return;
			let n = e instanceof Error ? e : Error(String(e));
			if (this._opts.onError) {
				this._opts.onError(n);
				return;
			}
			throw n;
		}
	}
	get slideCount() {
		return this._pres?.slideCount ?? 0;
	}
	_slideWidthPx() {
		return this._pres.slideWidth / e * this._scale;
	}
	_slideHeightPx() {
		return this._pres.slideHeight / e * this._scale;
	}
	_fitWidthPx() {
		if (this._opts.width && this._opts.width > 0) return this._opts.width;
		let e = this._container.clientWidth || this._scrollHost.clientWidth;
		if (e <= 0) return 0;
		let { left: t, right: n } = this._padH(), r = e - t - n;
		return r > 0 ? r : 0;
	}
	_baseScale() {
		if (!this._pres || this._pres.slideCount === 0) return 0;
		let t = this._fitWidthPx(), n = this._pres.slideWidth / e;
		return t <= 0 || n <= 0 ? 0 : t / n;
	}
	relayout() {
		if (this._pres) {
			if (!this._scaleEstablished) {
				let e = this._baseScale();
				if (e > 0) {
					if (this._scale = e, this._prevBase = e, this._lastFitWidth = this._fitWidthPx(), this._scaleEstablished = !0, this._pendingScale !== null) {
						let e = this._pendingScale;
						this._pendingScale = null, e !== this._scale && (this._scale = e, this._opts.onScaleChange?.(e));
					}
				} else return;
			}
			this._recomputeHeights(), this._syncSpacer(), this._mountVisible();
		}
	}
	_recomputeHeights() {
		let e = this._pres.slideCount, t = this._slideHeightPx();
		this._heights = Array(e).fill(t);
	}
	_gap() {
		return this._opts.gap ?? 16;
	}
	_overscan() {
		return this._opts.overscan ?? 1;
	}
	_pad() {
		let e = this._gap();
		return {
			leading: this._opts.paddingTop ?? e,
			trailing: this._opts.paddingBottom ?? e
		};
	}
	_padH() {
		let e = this._gap();
		return {
			left: this._opts.paddingLeft ?? e,
			right: this._opts.paddingRight ?? e
		};
	}
	_slideIndexAtOffset(e, t) {
		let { offsets: n } = e, r = 0, i = n.length - 1, a = 0;
		for (; r <= i;) {
			let e = r + i >> 1;
			n[e] <= t ? (a = e, r = e + 1) : i = e - 1;
		}
		return a;
	}
	_range() {
		return He(this._heights, this._gap(), this._scrollHost.scrollTop, this._scrollHost.clientHeight, this._overscan(), this._pad());
	}
	_syncSpacer() {
		let e = this._range();
		this._lastRange = e, this._spacer.style.height = `${e.totalHeight}px`, this._syncSpacerWidth();
	}
	_syncSpacerWidth() {
		let { left: e, right: t } = this._padH();
		this._spacer.style.width = `${this._slideWidthPx() + e + t}px`;
	}
	_onScroll() {
		!this._pres || !this._scaleEstablished || this._mountVisible();
	}
	_mountVisible() {
		if (!this._pres || this._pres.slideCount === 0) return;
		let e = this._range();
		this._lastRange = e;
		for (let [t, n] of [...this._slots]) (t < e.start || t > e.end) && this._recycleSlot(t, n);
		for (let t = e.start; t <= e.end; t++) if (this._slots.has(t)) this._positionSlot(this._slots.get(t), t, e);
		else {
			let n = this._acquireSlot();
			this._positionSlot(n, t, e), this._slots.set(t, n), this._renderSlot(t, n);
		}
		e.topIndex !== this._lastTopIndex && (this._lastTopIndex = e.topIndex, this._opts.onVisibleSlideChange?.(e.topIndex, this._pres.slideCount));
	}
	_applyPageShadow(e) {
		this._pageShadow !== !1 && (e.style.boxShadow = this._pageShadow);
	}
	_acquireSlot() {
		let e = this._free.pop();
		if (e) return this._scrollHost.appendChild(e.wrapper), e;
		let t = document.createElement("div");
		t.style.cssText = "position:absolute;";
		let n = document.createElement("canvas");
		n.style.cssText = "display:block;background:#fff;", this._applyPageShadow(n), t.appendChild(n);
		let r = null;
		return this._opts.enableTextSelection && (r = document.createElement("div"), r.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;user-select:text;-webkit-user-select:text;", t.appendChild(r)), this._scrollHost.appendChild(t), {
			wrapper: t,
			canvas: n,
			textLayer: r,
			renderedSlide: -1,
			renderedScale: -1,
			bitmap: null,
			bitmapCtx: null
		};
	}
	_recycleSlot(e, t) {
		this._slots.delete(e), t.bitmap &&= (t.bitmap.close(), null), t.textLayer && (t.textLayer.innerHTML = "", t.textLayer.style.transform = "", t.textLayer.style.transformOrigin = ""), t.renderedSlide = -1, t.renderedScale = -1, t.wrapper.remove(), this._free.push(t);
	}
	_positionSlot(e, t, n) {
		e.wrapper.style.top = `${n.offsets[t]}px`;
		let r = this._slideWidthPx();
		e.wrapper.style.width = `${r}px`, e.wrapper.style.height = `${this._slideHeightPx()}px`;
		let { left: i } = this._padH(), a = this._scrollHost.clientWidth;
		e.wrapper.style.left = `${Math.max(i, (a - r) / 2)}px`;
	}
	_dpr() {
		return this._opts.dpr ?? (typeof window < "u" && window.devicePixelRatio || 1);
	}
	_renderSlot(e, t) {
		if (!this._pres || t.renderedSlide === e) return;
		t.renderedSlide = e;
		let n = this._dpr(), r = this._slideWidthPx(), i = this._renderEpoch, a = this._scale;
		if (this._mode === "worker") {
			this._renderSlotBitmap(e, t, r, n, a);
			return;
		}
		let o = [], s = !!this._opts.enableTextSelection && !!t.textLayer, c = s ? (e) => o.push(e) : void 0;
		this._pres.renderSlide(t.canvas, e, {
			width: r,
			dpr: n,
			onTextRun: c
		}).then(() => {
			i !== this._renderEpoch || this._slots.get(e) !== t || t.renderedSlide !== e || (t.renderedScale = a, s && t.textLayer && On(t.textLayer, o, Math.round(r), Math.round(this._slideHeightPx()), this._hyperlinkHandler()));
		}).catch((e) => {
			this._reportRenderError(e);
		});
	}
	_reportRenderError(e) {
		if (this._destroyed) return;
		let t = e instanceof Error ? e : Error(String(e));
		this._opts.onError ? this._opts.onError(t) : console.error("[ooxml] PptxScrollViewer render failed:", t);
	}
	async _renderSlotBitmap(e, t, n, r, i) {
		if (this._slideInFlight.has(e) || this._slots.get(e) !== t) return;
		let a = this._renderEpoch;
		this._slideInFlight.add(e);
		let o = !1;
		t.bitmapCtx ||= t.canvas.getContext("bitmaprenderer");
		let s = !!this._opts.enableTextSelection && !!t.textLayer, c = [];
		try {
			let l = await this._pres.renderSlideToBitmap(e, {
				width: n,
				dpr: r,
				onTextRun: s ? (e) => c.push(e) : void 0
			});
			if (a !== this._renderEpoch || this._slots.get(e) !== t || t.renderedSlide !== e) {
				l.close();
				return;
			}
			t.bitmap && t.bitmap.close(), t.bitmap = l, t.canvas.width = l.width, t.canvas.height = l.height, t.canvas.style.width = `${Math.round(l.width / r)}px`, t.canvas.style.height = `${Math.round(l.height / r)}px`, t.bitmapCtx?.transferFromImageBitmap(l), t.bitmap = null, t.renderedScale = i, t.textLayer && (t.textLayer.style.transform = "", t.textLayer.style.transformOrigin = "", s && On(t.textLayer, c, Math.round(n), Math.round(this._slideHeightPx()), this._hyperlinkHandler())), o = !0;
		} catch (e) {
			this._reportRenderError(e);
		} finally {
			this._slideInFlight.delete(e);
			let n = this._slots.get(e);
			!o && n && (n !== t || a !== this._renderEpoch) && !this._slideInFlight.has(e) && !this._destroyed && this._renderSlotBitmap(e, n, this._slideWidthPx(), this._dpr(), this._scale);
		}
	}
	setScale(e) {
		let t = this._opts.zoomMin ?? .1, n = this._opts.zoomMax ?? 4, r = Math.min(n, Math.max(t, e)), i = this._pendingZoomAnchor;
		if (this._pendingZoomAnchor = null, !this._pres || this._pres.slideCount === 0 || !this._scaleEstablished) {
			this._pendingScale = r;
			return;
		}
		if (r === this._scale) return;
		let a = this._scale, o = i ? i.y : 0, s = this._range(), c = this._scrollHost.scrollTop + o, l = this._slideIndexAtOffset(s, c), u = this._heights[l] || 0, d = u > 0 ? (c - s.offsets[l]) / u : 0;
		d = Math.min(1, Math.max(0, d));
		let f = this._padH().left, p = this._scrollHost.scrollLeft || 0;
		this._renderEpoch++, this._scale = r, this._recomputeHeights();
		let m = He(this._heights, this._gap(), 0, this._scrollHost.clientHeight, this._overscan(), this._pad());
		this._spacer.style.height = `${m.totalHeight}px`, this._syncSpacerWidth();
		let h = Math.max(0, m.totalHeight - this._scrollHost.clientHeight), g = (m.offsets[l] ?? 0) + d * (this._heights[l] || 0);
		if (this._scrollHost.scrollTop = Math.min(h, Math.max(0, g - o)), i) {
			let e = Math.max(0, (this._spacer.offsetWidth || 0) - this._scrollHost.clientWidth);
			this._scrollHost.scrollLeft = ce(p, i.x - f, a, r, { maxScroll: e });
		}
		this._previewVisible(), this._scheduleSettle(), this._opts.onScaleChange?.(r);
	}
	getScale() {
		return this._scaleEstablished ? this._scale : this._pendingScale ?? 1;
	}
	zoomIn() {
		this.setScale(U(this.getScale()));
	}
	zoomOut() {
		this.setScale(me(this.getScale()));
	}
	fitWidth() {
		this._fit("width");
	}
	fitPage() {
		this._fit("page");
	}
	_fit(t) {
		if (!this._pres || this._pres.slideCount === 0) return;
		let n = V({
			contentWidth: this._pres.slideWidth / e,
			contentHeight: this._pres.slideHeight / e,
			containerWidth: this._fitWidthPx(),
			containerHeight: this._scrollHost.clientHeight
		}, t);
		n <= 0 || this.setScale(n);
	}
	_previewVisible() {
		if (!this._pres || this._pres.slideCount === 0) return;
		let e = this._range();
		this._lastRange = e;
		for (let [t, n] of [...this._slots]) (t < e.start || t > e.end) && this._recycleSlot(t, n);
		for (let t = e.start; t <= e.end; t++) {
			let n = this._slots.get(t);
			if (n) this._previewSlot(n, t, e);
			else {
				let n = this._acquireSlot();
				this._positionSlot(n, t, e), this._slots.set(t, n), this._renderSlot(t, n);
			}
		}
		e.topIndex !== this._lastTopIndex && (this._lastTopIndex = e.topIndex, this._opts.onVisibleSlideChange?.(e.topIndex, this._pres.slideCount));
	}
	_previewSlot(e, t, n) {
		if (this._positionSlot(e, t, n), e.canvas.style.width = `${this._slideWidthPx()}px`, e.canvas.style.height = `${this._slideHeightPx()}px`, e.textLayer && e.renderedScale > 0) {
			let t = this._scale / e.renderedScale;
			e.textLayer.style.transformOrigin = "0 0", e.textLayer.style.transform = `scale(${t})`;
		}
	}
	_scheduleSettle() {
		this._settleTimer !== null && clearTimeout(this._settleTimer), this._settleTimer = setTimeout(() => {
			this._settleTimer = null, this._settleRender();
		}, Xi);
	}
	_settleRender() {
		if (!(this._destroyed || !this._pres || this._pres.slideCount === 0)) for (let [e, t] of [...this._slots]) t.renderedScale !== this._scale && this._settleSlot(e, t);
	}
	_settleSlot(e, t) {
		if (!this._pres) return;
		let n = this._dpr(), r = this._slideWidthPx(), i = this._scale, a = this._renderEpoch;
		if (this._mode === "worker") {
			this._renderSlotBitmap(e, t, r, n, i);
			return;
		}
		let o = document.createElement("canvas");
		o.style.cssText = "display:block;background:#fff;", this._applyPageShadow(o);
		let s = [], c = !!this._opts.enableTextSelection && !!t.textLayer, l = c ? (e) => s.push(e) : void 0;
		this._pres.renderSlide(o, e, {
			width: r,
			dpr: n,
			onTextRun: l
		}).then(() => {
			if (a !== this._renderEpoch || this._slots.get(e) !== t || t.renderedSlide !== e) return;
			let n = t.canvas;
			t.wrapper.insertBefore(o, n), n.remove(), t.canvas = o, t.bitmapCtx = null, t.renderedScale = i, t.textLayer && (t.textLayer.style.transform = "", t.textLayer.style.transformOrigin = "", c && On(t.textLayer, s, Math.round(r), Math.round(this._slideHeightPx()), this._hyperlinkHandler()));
		}).catch((e) => {
			this._reportRenderError(e);
		});
	}
	scrollToSlide(e, t) {
		if (!this._pres || this._pres.slideCount === 0 || !this._scaleEstablished) return;
		let n = Math.max(0, Math.min(e, this._pres.slideCount - 1)), r = He(this._heights, this._gap(), 0, this._scrollHost.clientHeight, this._overscan(), this._pad()), i = r.offsets[n] ?? 0, a = Math.max(0, r.totalHeight - this._scrollHost.clientHeight), o = Math.min(a, Math.max(0, i)), s = this._scrollHost;
		typeof s.scrollTo == "function" ? s.scrollTo({
			top: o,
			behavior: t?.behavior ?? "auto"
		}) : this._scrollHost.scrollTop = o, this._mountVisible();
	}
	_hyperlinkHandler() {
		if (this._opts.enableHyperlinks !== !1) return (e) => this._onHyperlinkClick(e);
	}
	_onHyperlinkClick(e) {
		let t = this._resolveInternalSlideIndex(e);
		if (this._opts.onHyperlinkClick) {
			this._opts.onHyperlinkClick(t);
			return;
		}
		if (t.kind === "external") {
			oe(t.url);
			return;
		}
		t.slideIndex !== void 0 && this.scrollToSlide(t.slideIndex);
	}
	_resolveInternalSlideIndex(e) {
		if (e.kind !== "internal" || e.slideIndex !== void 0) return e;
		let t = this._pres?.resolveInternalTarget(e.ref, this._range().topIndex);
		return t === void 0 ? e : {
			...e,
			slideIndex: t
		};
	}
	_onResize() {
		if (!this._pres || this._pres.slideCount === 0) return;
		if (!this._scaleEstablished) {
			this.relayout();
			return;
		}
		let e = this._baseScale();
		if (e <= 0) return;
		let t = this._fitWidthPx();
		if (t === this._lastFitWidth) {
			this._mountVisible();
			return;
		}
		this._lastFitWidth = t;
		let n = this._prevBase > 0 ? this._scale / this._prevBase : 1;
		this._prevBase = e, this.setScale(e * n), this._mountVisible();
	}
	get topVisibleSlide() {
		return this._lastRange?.topIndex ?? 0;
	}
	mountedSlideIndicesForTest() {
		return [...this._slots.keys()];
	}
	scaleForTest() {
		return this._scale;
	}
	baseScaleForTest() {
		return this._baseScale();
	}
	renderEpochForTest() {
		return this._renderEpoch;
	}
	resizeForTest() {
		this._onResize();
	}
	contentAtViewportYForTest(e) {
		let t = this._range(), n = this._scrollHost.scrollTop + e, r = this._slideIndexAtOffset(t, n), i = this._heights[r] || 0;
		return {
			slide: r,
			frac: i > 0 ? Math.min(1, Math.max(0, (n - t.offsets[r]) / i)) : 0
		};
	}
	viewportYOfForTest(e, t) {
		return (this._range().offsets[e] ?? 0) + t * (this._heights[e] || 0) - this._scrollHost.scrollTop;
	}
	destroy() {
		this._destroyed = !0, this._loadGen++, this._scrollListener &&= (this._scrollHost.removeEventListener("scroll", this._scrollListener), null), this._wheelListener &&= (this._scrollHost.removeEventListener("wheel", this._wheelListener), null), this._resizeObserver?.disconnect(), this._resizeObserver = null, this._settleTimer !== null && (clearTimeout(this._settleTimer), this._settleTimer = null);
		for (let [e, t] of [...this._slots]) this._recycleSlot(e, t);
		this._free.length = 0, this._injected || this._pres?.destroy(), this._pres = null, this._wrapper.remove();
	}
}, $i = /* @__PURE__ */ j({
	OoxmlError: () => M,
	PptxPresentation: () => qi,
	PptxScrollViewer: () => Qi,
	PptxViewer: () => Yi,
	autoResize: () => ee,
	buildPptxHighlightLayer: () => kn,
	buildPptxTextLayer: () => On,
	openExternalHyperlink: () => oe,
	renderSlide: () => di
});
//#endregion
export { di as a, qi as i, Qi as n, kn as o, Yi as r, On as s, $i as t };
