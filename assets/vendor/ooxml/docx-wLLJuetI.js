import { $ as e, B as t, Bt as n, C as r, D as i, E as a, F as o, Ft as s, G as c, Gt as l, H as u, Ht as d, I as f, It as p, J as m, Jt as h, K as g, Kt as _, L as v, Lt as y, M as b, Mt as x, N as S, Nt as C, O as w, Pt as T, R as E, Rt as D, St as O, T as k, U as A, Ut as j, V as M, Vt as N, W as P, Wt as F, Xt as I, Y as L, Yt as R, _ as z, _t as B, a as V, at as ee, b as H, ct as U, d as W, dt as te, et as ne, f as G, ft as K, g as re, gt as q, h as J, i as Y, it as X, j as ie, jt as ae, l as Z, lt as oe, m as se, n as ce, nt as le, o as ue, p as de, pt as fe, q as Q, qt as pe, r as me, rt as he, t as ge, tt as _e, u as ve, v as ye, vt as be, w as xe, x as Se, xt as Ce, y as we, yt as Te, z as Ee, zt as De } from "./find-cursor-DBifiZop.js";
import { a as Oe, c as ke, d as Ae, f as je, i as Me, l as Ne, m as Pe, n as Fe, o as Ie, p as Le, r as Re, s as ze, t as Be, u as Ve } from "./highlight-rect-DTgfiJgA.js";
import { t as He } from "./mathjax-Dk_JzbFj.js";
import { t as Ue } from "./segments--0hIQLXB.js";
//#region packages/core/src/fonts/embedded.ts
function We(e, t) {
	let n = Ge(t), r = e.slice(), i = Math.min(32, r.length);
	for (let e = 0; e < i; e++) r[e] ^= n[e % 16];
	return r;
}
function Ge(e) {
	let t = e.replace(/[{}\-\s]/g, "");
	if (t.length !== 32 || /[^0-9a-fA-F]/.test(t)) throw Error(`invalid fontKey GUID: ${e}`);
	let n = new Uint8Array(16);
	for (let e = 0; e < 16; e++) n[e] = parseInt(t.slice(e * 2, e * 2 + 2), 16);
	return n.reverse();
}
function Ke(e, t, n, r) {
	let i = 2166136261;
	for (let e = 0; e < r.length; e++) i ^= r[e], i = Math.imul(i, 16777619);
	return `${e}|${t}|${n}|${r.length}|${(i >>> 0).toString(16)}`;
}
async function qe(e, t = 30 * 1024 * 1024) {
	let n = N();
	if (!n || typeof FontFace > "u") return [];
	let r = [], i = [], a = [];
	for (let o of e) try {
		if (o.bytes.length === 0 || o.bytes.length > t) {
			a.push(o.family);
			continue;
		}
		let e = o.odttf ? We(o.bytes, o.fontKey ?? "") : o.bytes, { face: s, isNew: c } = _(`embedded:${Ke(o.family, o.weight, o.style, e)}`, n, () => {
			let t = e.buffer.slice(e.byteOffset, e.byteOffset + e.byteLength), r = new FontFace(o.family, t, {
				weight: o.weight,
				style: o.style
			});
			return n.add(r), r;
		});
		r.push(s), c && i.push(s);
	} catch {
		a.push(o.family);
	}
	return i.length > 0 && await F(Promise.allSettled(i.map((e) => e.load())).then((e) => (e.forEach((e, t) => {
		e.status === "rejected" && a.push(i[t].family);
	}), n.ready))), a.length > 0 && console.warn(`[ooxml] failed to register embedded font(s): ${[...new Set(a)].join(", ")}; falling back to substitute fonts (text may shift or differ).`), r;
}
function Je(e) {
	l(e);
}
//#endregion
//#region packages/core/src/draw/double-border.ts
function Ye(e, t) {
	let n = Math.max(1, Math.round(e * t / 3)), r = Math.max(1, Math.round(e * t / 3));
	return {
		railDev: n,
		gapDev: r,
		spanDev: 2 * n + r
	};
}
function Xe(e, t, n, r, i, a, o) {
	let { railDev: s, gapDev: c, spanDev: l } = Ye(a, o);
	if (n === i) {
		let i = Math.round(n * o - l / 2);
		e.fillRect(t, i / o, r - t, s / o), e.fillRect(t, (i + s + c) / o, r - t, s / o);
	} else {
		let r = Math.round(t * o - l / 2);
		e.fillRect(r / o, n, s / o, i - n), e.fillRect((r + s + c) / o, n, s / o, i - n);
	}
}
//#endregion
//#region packages/core/src/text/number-format.ts
var Ze = [
	[1e3, "M"],
	[900, "CM"],
	[500, "D"],
	[400, "CD"],
	[100, "C"],
	[90, "XC"],
	[50, "L"],
	[40, "XL"],
	[10, "X"],
	[9, "IX"],
	[5, "V"],
	[4, "IV"],
	[1, "I"]
];
function Qe(e) {
	let t = "", n = e;
	for (let [e, r] of Ze) for (; n >= e;) t += r, n -= e;
	return t;
}
function $e(e, t) {
	let n = t.length, r = Math.floor((e - 1) / n) + 1;
	return t[(e - 1) % n].repeat(r);
}
var et = Array.from({ length: 26 }, (e, t) => String.fromCharCode(65 + t)), tt = /* @__PURE__ */ "أ.ب.ت.ث.ج.ح.خ.د.ذ.ر.ز.س.ش.ص.ض.ط.ظ.ع.غ.ف.ق.ك.ل.م.ن.ه.و.ي".split("."), nt = /* @__PURE__ */ "أ.ب.ج.د.ه.و.ز.ح.ط.ي.ك.ل.م.ن.س.ع.ف.ص.ق.ر.ش.ت.ث.خ.ذ.ض.غ.ظ".split("."), rt = [
	"א",
	"ב",
	"ג",
	"ד",
	"ה",
	"ו",
	"ז",
	"ח",
	"ט",
	"י",
	"כ",
	"ל",
	"מ",
	"נ",
	"ס",
	"ע",
	"פ",
	"צ",
	"ק",
	"ר",
	"ש",
	"ת"
], it = [
	...dt(1072, 1080),
	...dt(1082, 1087),
	...dt(1088, 1097),
	"ы",
	"э",
	"ю",
	"я"
], at = [
	...dt(1040, 1048),
	...dt(1050, 1055),
	...dt(1056, 1065),
	"Ы",
	"Э",
	"Ю",
	"Я"
], ot = [
	"ก",
	"ข",
	"ค",
	...dt(3591, 3619),
	"ล",
	...dt(3623, 3630)
], st = [
	"ㄱ",
	"ㄴ",
	"ㄷ",
	"ㄹ",
	"ㅁ",
	"ㅂ",
	"ㅅ",
	"ㅇ",
	"ㅈ",
	"ㅊ",
	"ㅋ",
	"ㅌ",
	"ㅍ",
	"ㅎ"
], ct = [
	"가",
	"나",
	"다",
	"라",
	"마",
	"바",
	"사",
	"아",
	"자",
	"차",
	"카",
	"타",
	"파",
	"하"
], lt = dt(2325, 2361), ut = [
	...dt(2309, 2324),
	"अं",
	"अः"
];
function dt(e, t) {
	let n = [];
	for (let r = e; r <= t; r++) n.push(String.fromCodePoint(r));
	return n;
}
var ft = /* @__PURE__ */ "ア.イ.ウ.エ.オ.カ.キ.ク.ケ.コ.サ.シ.ス.セ.ソ.タ.チ.ツ.テ.ト.ナ.ニ.ヌ.ネ.ノ.ハ.ヒ.フ.ヘ.ホ.マ.ミ.ム.メ.モ.ヤ.ユ.ヨ.ラ.リ.ル.レ.ロ.ワ.ヰ.ヱ.ヲ.ン".split("."), pt = [
	...dt(65393, 65436),
	"ｦ",
	"ﾝ"
];
function mt(e) {
	return e <= 20 ? String.fromCodePoint(9312 + (e - 1)) : String(e);
}
function ht(e, t) {
	return String(e).split("").map((e) => t[e.charCodeAt(0) - 48]).join("");
}
var gt = dt(65296, 65305), _t = dt(3664, 3673), vt = dt(2406, 2415), yt = [
	"〇",
	"一",
	"二",
	"三",
	"四",
	"五",
	"六",
	"七",
	"八",
	"九"
], bt = [
	"영",
	"일",
	"이",
	"삼",
	"사",
	"오",
	"육",
	"칠",
	"팔",
	"구"
], xt = [
	"零",
	"一",
	"二",
	"三",
	"四",
	"五",
	"六",
	"七",
	"八",
	"九"
], St = [
	"○",
	"一",
	"二",
	"三",
	"四",
	"五",
	"六",
	"七",
	"八",
	"九"
];
function Ct(e, t) {
	if (e < 10) return t[e];
	if (e < 100) {
		let n = Math.floor(e / 10), r = e % 10, i = n === 1 ? "十" : t[n] + "十";
		return r === 0 ? i : i + t[r];
	}
	return ht(e, t);
}
function wt(e, t) {
	switch (t) {
		case "upperRoman": return e >= 1 ? Qe(e) : String(e);
		case "lowerRoman": return e >= 1 ? Qe(e).toLowerCase() : String(e);
		case "upperLetter": return e >= 1 ? $e(e, et) : String(e);
		case "lowerLetter": return e >= 1 ? $e(e, et).toLowerCase() : String(e);
		case "arabicAlpha": return e >= 1 ? $e(e, tt) : String(e);
		case "arabicAbjad": return e >= 1 ? $e(e, nt) : String(e);
		case "russianLower": return e >= 1 ? $e(e, it) : String(e);
		case "russianUpper": return e >= 1 ? $e(e, at) : String(e);
		case "thaiLetters": return e >= 1 ? $e(e, ot) : String(e);
		case "chosung": return e >= 1 ? $e(e, st) : String(e);
		case "ganada": return e >= 1 ? $e(e, ct) : String(e);
		case "hindiVowels": return e >= 1 ? $e(e, lt) : String(e);
		case "hindiConsonants": return e >= 1 ? $e(e, ut) : String(e);
		case "aiueoFullWidth": return e >= 1 ? $e(e, ft) : String(e);
		case "aiueo": return e >= 1 ? $e(e, pt) : String(e);
		case "decimalEnclosedCircle": return e >= 1 ? mt(e) : String(e);
		case "hebrew1": return e >= 1 ? Ot(e) : String(e);
		case "hebrew2": return e >= 1 ? kt(e) : String(e);
		case "hex": return e >= 1 ? e.toString(16).toUpperCase() : String(e);
		case "numberInDash": return e >= 1 ? `- ${e} -` : String(e);
		case "decimalZero": return e >= 1 && e <= 9 ? `0${e}` : String(e);
		case "decimalFullWidth": return e >= 1 ? ht(e, gt) : String(e);
		case "decimalHalfWidth": return String(e);
		case "thaiNumbers": return e >= 1 ? ht(e, _t) : String(e);
		case "hindiNumbers": return e >= 1 ? ht(e, vt) : String(e);
		case "ideographDigital":
		case "japaneseDigitalTenThousand": return e >= 1 ? ht(e, yt) : String(e);
		case "koreanDigital": return e >= 1 ? ht(e, bt) : String(e);
		case "koreanDigital2": return e >= 1 ? ht(e, xt) : String(e);
		case "taiwaneseDigital": return e >= 1 ? ht(e, St) : String(e);
		case "chineseCounting": return e >= 1 ? Ct(e, yt) : String(e);
		case "taiwaneseCounting": return e >= 1 ? Ct(e, St) : String(e);
		case "chineseCountingThousand": return e >= 1 ? Rt(e, jt) : String(e);
		case "taiwaneseCountingThousand": return e >= 1 ? Rt(e, Mt) : String(e);
		case "chineseLegalSimplified": return e >= 1 ? Rt(e, Pt) : String(e);
		case "ideographLegalTraditional": return e >= 1 ? Rt(e, It) : String(e);
		case "japaneseCounting": return e >= 1 ? Rt(e, At) : String(e);
		case "japaneseLegal": return e >= 1 ? Rt(e, Ft) : String(e);
		case "koreanCounting": return e >= 1 ? Rt(e, Nt) : String(e);
		case "koreanLegal": return e >= 1 ? Vt(e) : String(e);
		default: return String(e);
	}
}
var Tt = [
	"",
	"א",
	"ב",
	"ג",
	"ד",
	"ה",
	"ו",
	"ז",
	"ח",
	"ט"
], Et = [
	"",
	"י",
	"כ",
	"ל",
	"מ",
	"נ",
	"ס",
	"ע",
	"פ",
	"צ"
], Dt = [
	"",
	"ק",
	"ר",
	"ש",
	"ת",
	"ך",
	"ם",
	"ן",
	"ף",
	"ץ"
];
function Ot(e) {
	let t = "", n = e, r = Math.floor(n / 1e3);
	n %= 1e3;
	let i = Math.floor(n / 100);
	if (n %= 100, r > 0 && (t += Tt[r % 10]), t += Dt[i], n === 15) return t + "טו";
	if (n === 16) return t + "טז";
	let a = Math.floor(n / 10), o = n % 10;
	return t += Et[a], t += Tt[o], t;
}
function kt(e) {
	let t = rt.length, n = Math.floor((e - 1) / t);
	return rt[e - t * n - 1] + "ת".repeat(n);
}
var At = {
	digits: xt,
	ten: "十",
	hundred: "百",
	thousand: "千",
	myriad: "万",
	elideOne: !0,
	insertZero: !1
}, jt = {
	...At,
	elideOne: !1,
	insertZero: !0
}, Mt = { ...jt }, Nt = {
	digits: [
		"영",
		"일",
		"이",
		"삼",
		"사",
		"오",
		"육",
		"칠",
		"팔",
		"구"
	],
	ten: "십",
	hundred: "백",
	thousand: "천",
	myriad: "만",
	elideOne: !0,
	insertZero: !1
}, Pt = {
	digits: [
		"零",
		"壹",
		"贰",
		"叁",
		"肆",
		"伍",
		"陆",
		"柒",
		"捌",
		"玖"
	],
	ten: "拾",
	hundred: "佰",
	thousand: "仟",
	myriad: "万",
	elideOne: !1,
	insertZero: !0
}, Ft = {
	digits: [
		"零",
		"壱",
		"弐",
		"参",
		"四",
		"伍",
		"六",
		"七",
		"八",
		"九"
	],
	ten: "拾",
	hundred: "百",
	thousand: "阡",
	myriad: "萬",
	elideOne: !1,
	insertZero: !1
}, It = {
	digits: [
		"零",
		"壹",
		"貳",
		"參",
		"肆",
		"伍",
		"陸",
		"柒",
		"捌",
		"玖"
	],
	ten: "拾",
	hundred: "佰",
	thousand: "仟",
	myriad: "萬",
	elideOne: !1,
	insertZero: !1
};
function Lt(e, t, n) {
	let r = Math.floor(e / 1e3) % 10, i = Math.floor(e / 100) % 10, a = Math.floor(e / 10) % 10, o = e % 10, s = [
		{
			digit: r,
			unit: t.thousand
		},
		{
			digit: i,
			unit: t.hundred
		},
		{
			digit: a,
			unit: t.ten
		},
		{
			digit: o,
			unit: ""
		}
	], c = "", l = !1, u = !1;
	for (let { digit: e, unit: r } of s) {
		if (e === 0) {
			l && (u = !0);
			continue;
		}
		u &&= (t.insertZero && (c += t.digits[0]), !1), n && e === 1 && r ? c += r : c += t.digits[e] + r, l = !0;
	}
	return c;
}
function Rt(e, t) {
	if (e >= 1e8) {
		let n = Math.floor(e / 1e8), r = e % 1e8, i = Rt(n, t) + "億";
		return r === 0 ? i : i + (t.insertZero && r < 1e7 ? t.digits[0] : "") + Rt(r, t);
	}
	let n = Math.floor(e / 1e4), r = e % 1e4, i = "";
	return n > 0 && (i += Lt(n, t, t.elideOne) + t.myriad), r > 0 && (t.insertZero && n > 0 && r < 1e3 && (i += t.digits[0]), i += Lt(r, t, t.elideOne)), i;
}
var zt = [
	"",
	"하나",
	"둘",
	"셋",
	"넷",
	"다섯",
	"여섯",
	"일곱",
	"여덟",
	"아홉"
], Bt = [
	"",
	"열",
	"스물",
	"서른",
	"마흔",
	"쉰",
	"예순",
	"일흔",
	"여든",
	"아흔"
];
function Vt(e) {
	if (e >= 100) return String(e);
	let t = Math.floor(e / 10), n = e % 10;
	return Bt[t] + zt[n];
}
//#endregion
//#region packages/core/src/text/field-format-switch.ts
var Ht = {
	Arabic: "decimal",
	ArabicDash: "numberInDash",
	Hex: "hex",
	Roman: "upperRoman",
	roman: "lowerRoman",
	ALPHABETIC: "upperLetter",
	alphabetic: "lowerLetter",
	ARABICABJAD: "arabicAbjad",
	ARABICALPHA: "arabicAlpha",
	HEBREW1: "hebrew1",
	HEBREW2: "hebrew2",
	HINDIARABIC: "hindiNumbers",
	HINDILETTER1: "hindiVowels",
	HINDILETTER2: "hindiConsonants",
	THAIARABIC: "thaiNumbers",
	THAILETTER: "thaiLetters",
	CHOSUNG: "chosung",
	GANADA: "ganada",
	DBCHAR: "decimalFullWidth",
	SBCHAR: "decimalHalfWidth"
};
function Ut(e) {
	let t = /\\\*\s+(\S+)/g, n;
	for (; (n = t.exec(e)) !== null;) {
		let e = Ht[n[1]];
		if (e) return e;
	}
	return null;
}
//#endregion
//#region packages/core/src/text/date-time-picture.ts
var Wt = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
], Gt = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
], Kt = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
], qt = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
], Jt = (e) => e < 10 ? `0${e}` : `${e}`;
function Yt(e) {
	let t = /\\@\s*"([^"]*)"/.exec(e);
	if (t) return t[1];
	let n = /\\@\s*(\S+)/.exec(e);
	return n ? n[1] : null;
}
function Xt(e, t) {
	let n = t.getFullYear(), r = t.getMonth(), i = t.getDate(), a = t.getDay(), o = t.getHours(), s = o % 12 == 0 ? 12 : o % 12, c = t.getMinutes(), l = t.getSeconds(), u = o >= 12, d = "", f = 0, p = e.length;
	for (; f < p;) {
		let t = e[f];
		if (t === "'") {
			f++;
			let t = "";
			for (; f < p;) {
				if (e[f] === "'") {
					if (e[f + 1] === "'") {
						t += "'", f += 2;
						continue;
					}
					f++;
					break;
				}
				t += e[f++];
			}
			d += t;
			continue;
		}
		if (/[A-Za-z]/.test(t)) {
			let u = f;
			for (; u < p && e[u] === t;) u++;
			let m = e.slice(f, u).length, h = t.toLowerCase(), g = null;
			if (t === "y" || t === "Y" ? g = m >= 4 ? String(n).padStart(4, "0") : Jt(n % 100) : t === "M" ? g = m >= 4 ? Wt[r] : m === 3 ? Gt[r] : m === 2 ? Jt(r + 1) : String(r + 1) : h === "d" ? g = m >= 4 ? Kt[a] : m === 3 ? qt[a] : m === 2 ? Jt(i) : String(i) : t === "H" ? g = m >= 2 ? Jt(o) : String(o) : t === "h" ? g = m >= 2 ? Jt(s) : String(s) : t === "m" ? g = m >= 2 ? Jt(c) : String(c) : t === "s" ? g = m >= 2 ? Jt(l) : String(l) : (h === "a" || h === "p") && (g = null), g !== null) {
				d += g, f = u;
				continue;
			}
			if (!(h === "a" || h === "p")) return null;
		}
		let m = /^([AaPp])([Mm])?\/([AaPp])([Mm])?/.exec(e.slice(f));
		if (m) {
			let e = m[2] !== void 0;
			d += e ? u ? "PM" : "AM" : u ? "P" : "A", f += m[0].length;
			continue;
		}
		d += t, f++;
	}
	return d;
}
//#endregion
//#region packages/core/src/fonts/local-metrics.ts
function Zt(e) {
	return e.trim().toLowerCase();
}
function Qt(e) {
	return `local("${e.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"")}")`;
}
function $t(e) {
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return (t >>> 0).toString(16).padStart(8, "0");
}
function en() {
	return typeof OffscreenCanvas < "u" ? new OffscreenCanvas(1, 1).getContext("2d") : typeof document < "u" && document?.createElement ? document.createElement("canvas").getContext("2d") : null;
}
async function tn(e) {
	let t = N(), n = en();
	if (!t || !n || typeof FontFace > "u") return {
		faces: [],
		metrics: {}
	};
	let r = [], i = {};
	for (let a of e) {
		let e = a.family.trim(), o = a.localNames.map((e) => e.trim()).filter(Boolean);
		if (!e || o.length === 0 || !(a.lineHeightMultiplier > 0)) continue;
		let s = o.map(Qt).join(", "), c = `local-metric:${Zt(e)}:${s}`, u = `__ooxml_local_${$t(c)}`, { face: d } = _(c, t, () => {
			let e = new FontFace(u, s);
			return t.add(e), e;
		});
		try {
			if (!await F(d.load()) || d.status !== "loaded") throw Error("local font load timed out");
			n.font = `100px "${u}"`;
			let t = n.measureText("Hg国"), o = t.fontBoundingBoxAscent, s = t.fontBoundingBoxDescent;
			if (!(Number.isFinite(o) && Number.isFinite(s) && o + s > 0)) throw Error("font design metrics unavailable");
			let c = (o + s) / 100 * a.lineHeightMultiplier;
			r.push(d), i[Zt(e)] = {
				family: u,
				lineHeightRatio: c
			};
		} catch {
			l([d]);
		}
	}
	return {
		faces: r,
		metrics: i
	};
}
function nn(e) {
	l(e);
}
//#endregion
//#region packages/core/src/text/font-advance-metrics.ts
var rn = [{
	test: (e) => e === "georgia",
	biasEm: .0105
}];
function an(e) {
	return (e ?? "").trim().replace(/^["']|["']$/g, "").replace(/\s+/g, " ").toLowerCase();
}
function on(e) {
	let t = an(e);
	for (let e of rn) if (e.test(t)) return e.biasEm;
	return 0;
}
//#endregion
//#region packages/docx/src/worker.ts?worker&inline
var sn = "var e=class{__destroy_into_raw(){let e=this.__wbg_ptr;return this.__wbg_ptr=0,n.unregister(this),e}free(){let e=this.__destroy_into_raw();v.__wbg_docxarchive_free(e,0)}extract_image(e){let t=d(e,v.__wbindgen_malloc,v.__wbindgen_realloc),n=_,i=v.docxarchive_extract_image(this.__wbg_ptr,t,n);if(i[3])throw f(i[2]);var a=r(i[0],i[1]).slice();return v.__wbindgen_free(i[0],i[1]*1,1),a}constructor(e,t){let r=u(e,v.__wbindgen_malloc),i=_,a=v.docxarchive_new(r,i,!l(t),l(t)?BigInt(0):t);if(a[2])throw f(a[1]);return this.__wbg_ptr=a[0]>>>0,n.register(this,this.__wbg_ptr,this),this}parse(){let e=v.docxarchive_parse(this.__wbg_ptr);if(e[3])throw f(e[2]);var t=r(e[0],e[1]).slice();return v.__wbindgen_free(e[0],e[1]*1,1),t}to_markdown(){let e,t;try{let i=v.docxarchive_to_markdown(this.__wbg_ptr);var n=i[0],r=i[1];if(i[3])throw n=0,r=0,f(i[2]);return e=n,t=r,o(n,r)}finally{v.__wbindgen_free(e,t,1)}}};Symbol.dispose&&(e.prototype[Symbol.dispose]=e.prototype.free);function t(){return{__proto__:null,\"./docx_parser_bg.js\":{__proto__:null,__wbg___wbindgen_throw_6b64449b9b9ed33c:function(e,t){throw Error(o(e,t))},__wbg_error_a6fa202b58aa1cd3:function(e,t){let n,r;try{n=e,r=t,console.error(o(e,t))}finally{v.__wbindgen_free(n,r,1)}},__wbg_new_227d7c05414eb861:function(){return Error()},__wbg_stack_3b0d974bbf31e44f:function(e,t){let n=t.stack,r=d(n,v.__wbindgen_malloc,v.__wbindgen_realloc),i=_;a().setInt32(e+4,i,!0),a().setInt32(e+0,r,!0)},__wbindgen_cast_0000000000000001:function(e,t){return o(e,t)},__wbindgen_init_externref_table:function(){let e=v.__wbindgen_externrefs,t=e.grow(4);e.set(0,void 0),e.set(t+0,void 0),e.set(t+1,null),e.set(t+2,!0),e.set(t+3,!1)}}}}const n=typeof FinalizationRegistry>`u`?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>v.__wbg_docxarchive_free(e>>>0,1));function r(e,t){return e>>>=0,c().subarray(e/1,e/1+t)}let i=null;function a(){return(i===null||i.buffer.detached===!0||i.buffer.detached===void 0&&i.buffer!==v.memory.buffer)&&(i=new DataView(v.memory.buffer)),i}function o(e,t){return e>>>=0,h(e,t)}let s=null;function c(){return(s===null||s.byteLength===0)&&(s=new Uint8Array(v.memory.buffer)),s}function l(e){return e==null}function u(e,t){let n=t(e.length*1,1)>>>0;return c().set(e,n/1),_=e.length,n}function d(e,t,n){if(n===void 0){let n=g.encode(e),r=t(n.length,1)>>>0;return c().subarray(r,r+n.length).set(n),_=n.length,r}let r=e.length,i=t(r,1)>>>0,a=c(),o=0;for(;o<r;o++){let t=e.charCodeAt(o);if(t>127)break;a[i+o]=t}if(o!==r){o!==0&&(e=e.slice(o)),i=n(i,r,r=o+e.length*3,1)>>>0;let t=c().subarray(i+o,i+r),a=g.encodeInto(e,t);o+=a.written,i=n(i,r,o,1)>>>0}return _=o,i}function f(e){let t=v.__wbindgen_externrefs.get(e);return v.__externref_table_dealloc(e),t}let p=new TextDecoder(`utf-8`,{ignoreBOM:!0,fatal:!0});p.decode();let m=0;function h(e,t){return m+=t,m>=2146435072&&(p=new TextDecoder(`utf-8`,{ignoreBOM:!0,fatal:!0}),p.decode(),m=t),p.decode(c().subarray(e,e+t))}const g=new TextEncoder;`encodeInto`in g||(g.encodeInto=function(e,t){let n=g.encode(e);return t.set(n),{read:e.length,written:n.length}});let _=0,v;function y(e,t){return v=e.exports,i=null,s=null,v.__wbindgen_start(),v}async function b(e,t){if(typeof Response==`function`&&e instanceof Response){if(typeof WebAssembly.instantiateStreaming==`function`)try{return await WebAssembly.instantiateStreaming(e,t)}catch(t){if(e.ok&&n(e.type)&&e.headers.get(`Content-Type`)!==`application/wasm`)console.warn(\"`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\\n\",t);else throw t}let r=await e.arrayBuffer();return await WebAssembly.instantiate(r,t)}else{let n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}function n(e){switch(e){case`basic`:case`cors`:case`default`:return!0}return!1}}async function x(e){if(v!==void 0)return v;e!==void 0&&(Object.getPrototypeOf(e)===Object.prototype?{module_or_path:e}=e:console.warn(`using deprecated parameters for the initialization function; pass a single object instead`));let n=t();(typeof e==`string`||typeof Request==`function`&&e instanceof Request||typeof URL==`function`&&e instanceof URL)&&(e=fetch(e));let{instance:r,module:i}=await b(await e,n);return y(r,i)}async function S(e){return v=void 0,i=null,s=null,x(e)}function C(e){if(!e.startsWith(`data:`))return null;let t=e.indexOf(`,`);if(t===-1)return null;let n=atob(e.slice(t+1)),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);return r.buffer}var w=class e extends Error{code=`parser-crashed`;constructor(t){super(t),this.name=`WasmTrapError`,Object.setPrototypeOf(this,e.prototype)}};function T(e){let t=globalThis.WebAssembly?.RuntimeError;if(t&&e instanceof t||e instanceof RangeError)return!0;if(e instanceof Error){let t=e.name;if(t===`RuntimeError`||t===`CompileError`||t===`LinkError`)return!0}return!1}const E=new class{_init;_opts;_wasmInput=null;_initPromise=null;_poisoned=!1;_archive=null;constructor(e,t={}){this._init=e,this._opts=t}setWasmUrl(e){this._wasmInput=e,this._poisoned=!1,this._initPromise=this._init(e)}get archive(){return this._archive}setArchive(e){this._freeArchive(),this._archive=e}disposeArchive(){this._freeArchive()}_freeArchive(){this._archive!=null&&this._opts.freeArchive&&this._opts.freeArchive(this._archive),this._archive=null}get poisoned(){return this._poisoned}async ensureReady(){if(this._poisoned){if(this._wasmInput===null)throw Error(`WasmParserHost: setWasmUrl was never called`);let e=(this._opts.reinit??this._init)(this._wasmInput);this._initPromise=e,await e,this._poisoned=!1;return}if(this._initPromise===null)throw Error(`WasmParserHost: setWasmUrl was never called`);await this._initPromise}run(e){try{return e()}catch(e){throw T(e)?(this._poison(),new w(`WASM parser trapped and was recycled: ${e instanceof Error?e.message:String(e)}`)):e}}poison(){this._poison()}_poison(){if(this._poisoned=!0,this._initPromise=null,this._archive!=null&&this._opts.freeArchive)try{this._opts.freeArchive(this._archive)}catch{}this._archive=null}}(x,{freeArchive:e=>e.free(),reinit:S});self.onmessage=async t=>{let n=t.data;if(n.type===`init`){E.setWasmUrl(C(n.wasmUrl)??n.wasmUrl);return}let r=n.id;try{if(await E.ensureReady(),n.type===`parse`){let t=typeof n.maxZipEntryBytes==`number`&&n.maxZipEntryBytes>0?BigInt(n.maxZipEntryBytes):void 0,i=new Uint8Array(n.data),a=E.run(()=>{let n=new e(i,t);return E.setArchive(n),n.parse()}).buffer,o={type:`parsed`,id:r,documentJson:a};self.postMessage(o,[a]);return}let t=E.archive;if(n.type===`extractImage`){if(!t)throw Error(`No docx loaded`);let e=E.run(()=>t.extract_image(n.path).buffer),i={type:`imageExtracted`,id:r,bytes:e};self.postMessage(i,[e]);return}if(n.type===`toMarkdown`){if(!t)throw Error(`No docx loaded`);let e={type:`markdownRendered`,id:r,markdown:E.run(()=>t.to_markdown())};self.postMessage(e);return}}catch(e){let t={type:`error`,id:r,message:String(e)};self.postMessage(t)}};", cn = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", sn], { type: "text/javascript;charset=utf-8" });
function ln(e) {
	let t;
	try {
		if (t = cn && (self.URL || self.webkitURL).createObjectURL(cn), !t) throw "";
		let n = new Worker(t, {
			type: "module",
			name: e?.name
		});
		return n.addEventListener("error", () => {
			(self.URL || self.webkitURL).revokeObjectURL(t);
		}), n;
	} catch {
		return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(sn), {
			type: "module",
			name: e?.name
		});
	}
}
//#endregion
//#region packages/docx/src/wasm/docx_parser_bg.wasm?url
var un = new URL("docx_parser_bg.wasm", import.meta.url).href;
//#endregion
//#region packages/docx/src/page-numbering.ts
function dn(e) {
	return e?.[0]?.sectionPageNumType ?? null;
}
function fn(e) {
	return e?.[0]?.sectionHF;
}
function pn(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length; n++) for (let r of e[n]) {
		let e = r.sectionHF;
		t.has(e) || t.set(e, n);
	}
	return t;
}
function mn(e) {
	let t = [], n = pn(e), r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = dn(e[i]), o = a?.fmt ?? "decimal";
		if ((i === 0 || fn(e[i]) !== fn(e[i - 1])) && a?.start != null) {
			let t = n.get(fn(e[i])) ?? i;
			r = a.start + (i - t);
		} else r += 1;
		t.push({
			displayNumber: r,
			format: o
		});
	}
	return t;
}
//#endregion
//#region packages/docx/src/underline-map.ts
var hn = {
	double: "dbl",
	dotted: "dotted",
	dottedHeavy: "dottedHeavy",
	dash: "dash",
	dashLong: "dashLong",
	dashLongHeavy: "dashLongHeavy",
	dotDash: "dotDash",
	dotDotDash: "dotDotDash",
	wavyHeavy: "wavyHeavy",
	single: "sng",
	wave: "wavy",
	wavyDouble: "wavyDbl",
	dashedHeavy: "dashHeavy",
	dashDotHeavy: "dotDashHeavy",
	dashDotDotHeavy: "dotDotDashHeavy",
	thick: "heavy",
	words: "sng"
};
function gn(e) {
	return e ? hn[e] ?? "sng" : "sng";
}
//#endregion
//#region packages/docx/src/cell-border-conflict.ts
function _n(e, t, n, r) {
	let i = (n, r, i) => {
		if (n) return {
			spec: n,
			source: "cell"
		};
		let a = r ? i : e.insideH ?? t.insideH;
		return a ? {
			spec: a,
			source: "table"
		} : null;
	}, a = (n, r, i) => {
		if (n) return {
			spec: n,
			source: "cell"
		};
		let a = r ? i : e.insideV ?? t.insideV;
		return a ? {
			spec: a,
			source: "table"
		} : null;
	};
	return {
		top: i(e.top, n.topRow, t.top),
		bottom: i(e.bottom, n.bottomRow, t.bottom),
		left: r ? a(e.right, n.rightCol, t.right) : a(e.left, n.leftCol, t.left),
		right: r ? a(e.left, n.leftCol, t.left) : a(e.right, n.rightCol, t.right)
	};
}
var vn = {
	single: 1,
	thick: 2,
	double: 3,
	dotted: 4,
	dashed: 5,
	dotDash: 6,
	dotDotDash: 7,
	triple: 8,
	thinThickSmallGap: 9,
	thickThinSmallGap: 10,
	thinThickThinSmallGap: 11,
	thinThickMediumGap: 12,
	thickThinMediumGap: 13,
	thinThickThinMediumGap: 14,
	thinThickLargeGap: 15,
	thickThinLargeGap: 16,
	thinThickThinLargeGap: 17,
	wave: 18,
	doubleWave: 19,
	dashSmallGap: 20,
	dashDotStroked: 21,
	threeDEmboss: 22,
	threeDEngrave: 23,
	outset: 24,
	inset: 25
}, yn = {
	double: 2,
	triple: 3,
	thinThickSmallGap: 2,
	thickThinSmallGap: 2,
	thinThickThinSmallGap: 3,
	thinThickMediumGap: 2,
	thickThinMediumGap: 2,
	thinThickThinMediumGap: 3,
	thinThickLargeGap: 2,
	thickThinLargeGap: 2,
	thinThickThinLargeGap: 3,
	doubleWave: 2
}, bn = [
	"single",
	"thick",
	"double",
	"dotted",
	"dashed",
	"dotDash",
	"dotDotDash",
	"triple",
	"thinThickSmallGap",
	"thickThinSmallGap",
	"thinThickThinSmallGap",
	"thinThickMediumGap",
	"thickThinMediumGap",
	"thinThickThinMediumGap",
	"thinThickLargeGap",
	"thickThinLargeGap",
	"thinThickThinLargeGap",
	"wave",
	"doubleWave",
	"dashSmallGap",
	"dashDotStroked",
	"threeDEmboss",
	"threeDEngrave",
	"outset",
	"inset"
];
function xn(e) {
	return vn[e] ?? 0;
}
function Sn(e) {
	return yn[e] ?? 1;
}
function Cn(e) {
	return Sn(e) * xn(e);
}
function wn(e) {
	let t = bn.indexOf(e);
	return t === -1 ? bn.length : t;
}
function Tn(e) {
	return e.style === "nil" || e.style === "none";
}
function En(e) {
	if (!e) return {
		r: 0,
		g: 0,
		b: 0
	};
	let t = e.replace(/^#/, "");
	return t.length !== 6 || /[^0-9a-fA-F]/.test(t) ? {
		r: 0,
		g: 0,
		b: 0
	} : {
		r: parseInt(t.slice(0, 2), 16),
		g: parseInt(t.slice(2, 4), 16),
		b: parseInt(t.slice(4, 6), 16)
	};
}
function Dn(e, t) {
	let n = En(e), r = En(t), i = (e) => e.r + e.b + 2 * e.g, a = (e) => e.b + 2 * e.g, o = (e) => e.g;
	for (let e of [
		i,
		a,
		o
	]) {
		let t = e(n) - e(r);
		if (t !== 0) return t;
	}
	return 0;
}
function On(e, t) {
	let n = e && !Tn(e.spec) ? e : null, r = t && !Tn(t.spec) ? t : null;
	if (!n && !r) return null;
	if (!n) return r;
	if (!r || n.source === "cell" && r.source === "table") return n;
	if (r.source === "cell" && n.source === "table") return r;
	let i = Cn(n.spec.style), a = Cn(r.spec.style);
	if (i !== a) return i > a ? n : r;
	let o = wn(n.spec.style), s = wn(r.spec.style);
	if (o !== s) return o < s ? n : r;
	let c = Dn(n.spec.color, r.spec.color);
	return c === 0 || c < 0 ? n : r;
}
//#endregion
//#region packages/docx/src/bidi-line.ts
var kn = (e) => {
	let t = e.text;
	return typeof t == "string" ? t : void 0;
}, An = (e) => e.rtl === !0, jn = (e) => e.digitsAsAN === !0, Mn = (e) => "isTab" in e;
function Nn(e) {
	for (let n of e) {
		if (An(n)) return !0;
		let e = kn(n);
		if (e !== void 0 && t(e)) return !0;
	}
	return !1;
}
var Pn = /[\p{P}\p{S}]/u;
function Fn(e, t) {
	let n = e.length;
	if (n === 0) return {
		order: [],
		rtl: []
	};
	let r = "", i = Array(n), a = Array(n), o, s = () => {
		for (o ||= []; o.length < r.length;) o.push(null);
		return o;
	};
	for (let t = 0; t < n; t++) {
		let n = kn(e[t]) ?? "";
		if (i[t] = r.length, r += n.length > 0 ? n : "￼", a[t] = r.length, Mn(e[t])) s()[i[t]] = "S";
		else if (n.length > 0 && (jn(e[t]) || An(e[t]))) {
			let n = s(), o = jn(e[t]), c = An(e[t]);
			for (let e = i[t]; e < a[t]; e++) {
				let t = r.charCodeAt(e);
				o && t >= 48 && t <= 57 ? n[e] = "AN" : c && Pn.test(r[e]) && (n[e] = "R");
			}
		}
	}
	if (o) for (; o.length < r.length;) o.push(null);
	let { levels: c, paragraphLevel: l } = M().computeLevels(r, t ? "rtl" : "ltr", o), { order: u } = Ee(c, l, i), d = Array(n);
	for (let e = 0; e < n; e++) {
		let t = a[e];
		for (; t > i[e] && r[t - 1] === " ";) t--;
		let n = !1;
		for (let r = i[e]; r < t; r++) {
			let e = c[r];
			if (e !== 255 && (e & 1) == 1) {
				n = !0;
				break;
			}
		}
		d[e] = n;
	}
	return {
		order: u,
		rtl: d
	};
}
function In(e, t) {
	switch (e) {
		case "center": return "center";
		case "both":
		case "justify":
		case "distribute":
		case "lowKashida":
		case "mediumKashida":
		case "highKashida":
		case "thaiDistribute": return "justify";
		case "end":
		case "right": return t ? "left" : "right";
		case "start":
		case "left":
		case void 0:
		default: return t ? "right" : "left";
	}
}
function Ln(e) {
	switch (e) {
		case "both":
		case "justify":
		case "distribute":
		case "lowKashida":
		case "mediumKashida":
		case "highKashida":
		case "thaiDistribute": return !0;
		default: return !1;
	}
}
function Rn(e) {
	return e === "distribute";
}
var zn = .05;
function Bn(e) {
	return (72 - zn) * e;
}
function Vn(e) {
	return e === "square" || e === "topAndBottom" || e === "tight" || e === "through";
}
function Hn(e, t, n) {
	return e.xRight > t + .01 && e.xLeft < n - .01;
}
function Un(e, t, n, r, i, a, o, s) {
	return e < a - .01 && t > i + .01 && n < s - .01 && r > o + .01;
}
function Wn(e, t, n) {
	let r = e.slice().sort((e, t) => e.l - t.l), i = t, a = null, o = (e, t) => {
		t - e > (a ? a.r - a.l : 0) && (a = {
			l: e,
			r: t
		});
	};
	for (let e of r) if (e.l > i && o(i, Math.min(e.l, n)), i = Math.max(i, Math.min(e.r, n)), i >= n) break;
	return i < n && o(i, n), a;
}
function Gn(e, t, n, r, i, a, o = r, s = r + i) {
	let c = r, l = r + i;
	for (let t = 0; t < 16; t++) {
		let t = e + n, r = null;
		for (let n of a) n.mode === "topAndBottom" && Hn(n, o, s) && t > n.yTop && e < n.yBottom && (r = r === null ? n.yBottom : Math.max(r, n.yBottom));
		if (r === null) break;
		e = r;
	}
	let u = Math.max(t, 1), d = 0, f = i;
	for (let t = 0; t < 64; t++) {
		let t = e + n, r = [], o = [];
		for (let n of a) if (n.mode === "square" && !(t <= n.yTop || e >= n.yBottom) && Hn(n, c, l)) switch (o.push(n), n.side) {
			case "left":
				r.push({
					l: n.xLeft,
					r: l
				});
				break;
			case "right":
				r.push({
					l: c,
					r: n.xRight
				});
				break;
			default:
				r.push({
					l: n.xLeft,
					r: n.xRight
				});
				break;
		}
		if (o.length === 0) {
			d = 0, f = i;
			break;
		}
		let s = Wn(r, c, l);
		if (s && s.r - s.l >= u) {
			d = Math.max(0, s.l - c), f = Math.min(i - d, s.r - s.l), f < 0 && (f = 0);
			break;
		}
		let p = Math.max(...o.map((e) => e.yBottom));
		if (p <= e) {
			d = 0, f = i;
			break;
		}
		e = p;
	}
	return {
		topY: e,
		xOffset: d,
		maxWidth: f
	};
}
function Kn(e, t, n, r, i, a, o, s, c, l, u, d, f) {
	for (let p = 0; p < 16; p++) {
		let p = e - i, m = e + n + a, h = t - o, g = t + r + s, _ = f.filter((e) => (l ? e.paraId !== c : u !== "table" || e.kind === "table") && Un(p, m, h, g, e.xLeft, e.xRight, e.yTop, e.yBottom));
		if (_.length === 0) return {
			x: e,
			y: t
		};
		let v = Math.max(..._.map((e) => e.xRight)) + i;
		if (v + n + a <= d + .5) {
			e = v;
			continue;
		}
		t = Math.max(..._.map((e) => e.yBottom)) + o;
	}
	return {
		x: e,
		y: t
	};
}
function qn(e, t, n, r) {
	for (let i = 0; i < 16; i++) {
		let i = e;
		for (let a of t) a.mode === "topAndBottom" && Hn(a, n, r) && e >= a.yTop && e < a.yBottom && (i = Math.max(i, a.yBottom));
		if (i === e) return e;
		e = i;
	}
	return e;
}
//#endregion
//#region packages/docx/src/text-distribute.ts
function Jn(e, t, n, r, i = -Infinity, a = !0, o = !1) {
	return Oe(e, t, {
		firstContentSi: n,
		lastDrawnSi: r,
		minPerGap: i,
		seaClusterGaps: o,
		...a ? {} : { isGapChar: () => !1 }
	});
}
function Yn(e) {
	if (!e) return 0;
	let t = 0;
	for (let n of e.perSeg.values()) t += n.splitBefore.length + +!!n.trailingGap;
	return e.perGap * t;
}
function Xn(e, t, n, r, i) {
	return t >= 0 ? null : Jn(e, t, n, r, -i * .25, !1);
}
//#endregion
//#region packages/docx/src/arabic-joining.generated.ts
var Zn = [
	"U",
	"C",
	"D",
	"L",
	"R",
	"T"
], Qn = [
	0,
	173,
	174,
	768,
	880,
	1155,
	1162,
	1425,
	1470,
	1471,
	1472,
	1473,
	1475,
	1476,
	1478,
	1479,
	1480,
	1552,
	1563,
	1564,
	1565,
	1568,
	1569,
	1570,
	1574,
	1575,
	1576,
	1577,
	1578,
	1583,
	1587,
	1600,
	1601,
	1608,
	1609,
	1611,
	1632,
	1646,
	1648,
	1649,
	1652,
	1653,
	1656,
	1672,
	1690,
	1728,
	1729,
	1731,
	1740,
	1741,
	1742,
	1743,
	1744,
	1746,
	1748,
	1749,
	1750,
	1757,
	1759,
	1765,
	1767,
	1769,
	1770,
	1774,
	1776,
	1786,
	1789,
	1791,
	1792,
	1807,
	1808,
	1809,
	1810,
	1813,
	1818,
	1822,
	1823,
	1832,
	1833,
	1834,
	1835,
	1836,
	1837,
	1839,
	1840,
	1867,
	1869,
	1870,
	1881,
	1884,
	1899,
	1901,
	1905,
	1906,
	1907,
	1909,
	1912,
	1914,
	1920,
	1958,
	1969,
	1994,
	2027,
	2036,
	2042,
	2043,
	2045,
	2046,
	2070,
	2074,
	2075,
	2084,
	2085,
	2088,
	2089,
	2094,
	2112,
	2113,
	2118,
	2120,
	2121,
	2122,
	2132,
	2133,
	2134,
	2137,
	2140,
	2144,
	2145,
	2146,
	2150,
	2151,
	2152,
	2153,
	2155,
	2160,
	2179,
	2182,
	2183,
	2185,
	2190,
	2191,
	2192,
	2199,
	2208,
	2218,
	2221,
	2222,
	2223,
	2225,
	2227,
	2233,
	2234,
	2249,
	2250,
	2274,
	2275,
	2307,
	2362,
	2363,
	2364,
	2365,
	2369,
	2377,
	2381,
	2382,
	2385,
	2392,
	2402,
	2404,
	2433,
	2434,
	2492,
	2493,
	2497,
	2501,
	2509,
	2510,
	2530,
	2532,
	2558,
	2559,
	2561,
	2563,
	2620,
	2621,
	2625,
	2627,
	2631,
	2633,
	2635,
	2638,
	2641,
	2642,
	2672,
	2674,
	2677,
	2678,
	2689,
	2691,
	2748,
	2749,
	2753,
	2758,
	2759,
	2761,
	2765,
	2766,
	2786,
	2788,
	2810,
	2816,
	2817,
	2818,
	2876,
	2877,
	2879,
	2880,
	2881,
	2885,
	2893,
	2894,
	2901,
	2903,
	2914,
	2916,
	2946,
	2947,
	3008,
	3009,
	3021,
	3022,
	3072,
	3073,
	3076,
	3077,
	3132,
	3133,
	3134,
	3137,
	3142,
	3145,
	3146,
	3150,
	3157,
	3159,
	3170,
	3172,
	3201,
	3202,
	3260,
	3261,
	3263,
	3264,
	3270,
	3271,
	3276,
	3278,
	3298,
	3300,
	3328,
	3330,
	3387,
	3389,
	3393,
	3397,
	3405,
	3406,
	3426,
	3428,
	3457,
	3458,
	3530,
	3531,
	3538,
	3541,
	3542,
	3543,
	3633,
	3634,
	3636,
	3643,
	3655,
	3663,
	3761,
	3762,
	3764,
	3773,
	3784,
	3791,
	3864,
	3866,
	3893,
	3894,
	3895,
	3896,
	3897,
	3898,
	3953,
	3967,
	3968,
	3973,
	3974,
	3976,
	3981,
	3992,
	3993,
	4029,
	4038,
	4039,
	4141,
	4145,
	4146,
	4152,
	4153,
	4155,
	4157,
	4159,
	4184,
	4186,
	4190,
	4193,
	4209,
	4213,
	4226,
	4227,
	4229,
	4231,
	4237,
	4238,
	4253,
	4254,
	4957,
	4960,
	5906,
	5909,
	5938,
	5940,
	5970,
	5972,
	6002,
	6004,
	6068,
	6070,
	6071,
	6078,
	6086,
	6087,
	6089,
	6100,
	6109,
	6110,
	6151,
	6152,
	6154,
	6155,
	6158,
	6159,
	6160,
	6176,
	6265,
	6277,
	6279,
	6313,
	6314,
	6315,
	6432,
	6435,
	6439,
	6441,
	6450,
	6451,
	6457,
	6460,
	6679,
	6681,
	6683,
	6684,
	6742,
	6743,
	6744,
	6751,
	6752,
	6753,
	6754,
	6755,
	6757,
	6765,
	6771,
	6781,
	6783,
	6784,
	6832,
	6878,
	6880,
	6892,
	6912,
	6916,
	6964,
	6965,
	6966,
	6971,
	6972,
	6973,
	6978,
	6979,
	7019,
	7028,
	7040,
	7042,
	7074,
	7078,
	7080,
	7082,
	7083,
	7086,
	7142,
	7143,
	7144,
	7146,
	7149,
	7150,
	7151,
	7154,
	7212,
	7220,
	7222,
	7224,
	7376,
	7379,
	7380,
	7393,
	7394,
	7401,
	7405,
	7406,
	7412,
	7413,
	7416,
	7418,
	7616,
	7680,
	8203,
	8204,
	8205,
	8206,
	8208,
	8234,
	8239,
	8288,
	8293,
	8298,
	8304,
	8400,
	8433,
	11503,
	11506,
	11647,
	11648,
	11744,
	11776,
	12330,
	12334,
	12441,
	12443,
	42607,
	42611,
	42612,
	42622,
	42654,
	42656,
	42736,
	42738,
	43010,
	43011,
	43014,
	43015,
	43019,
	43020,
	43045,
	43047,
	43052,
	43053,
	43072,
	43122,
	43123,
	43204,
	43206,
	43232,
	43250,
	43263,
	43264,
	43302,
	43310,
	43335,
	43346,
	43392,
	43395,
	43443,
	43444,
	43446,
	43450,
	43452,
	43454,
	43493,
	43494,
	43561,
	43567,
	43569,
	43571,
	43573,
	43575,
	43587,
	43588,
	43596,
	43597,
	43644,
	43645,
	43696,
	43697,
	43698,
	43701,
	43703,
	43705,
	43710,
	43712,
	43713,
	43714,
	43756,
	43758,
	43766,
	43767,
	44005,
	44006,
	44008,
	44009,
	44013,
	44014,
	64286,
	64287,
	65024,
	65040,
	65056,
	65072,
	65279,
	65280,
	65529,
	65532,
	66045,
	66046,
	66272,
	66273,
	66422,
	66427,
	68097,
	68100,
	68101,
	68103,
	68108,
	68112,
	68152,
	68155,
	68159,
	68160,
	68288,
	68293,
	68294,
	68295,
	68296,
	68297,
	68299,
	68301,
	68302,
	68307,
	68311,
	68312,
	68317,
	68318,
	68321,
	68322,
	68324,
	68325,
	68327,
	68331,
	68335,
	68336,
	68480,
	68481,
	68482,
	68483,
	68486,
	68489,
	68490,
	68492,
	68493,
	68494,
	68496,
	68497,
	68498,
	68521,
	68525,
	68527,
	68864,
	68865,
	68898,
	68899,
	68900,
	68904,
	68969,
	68974,
	69291,
	69293,
	69314,
	69315,
	69317,
	69318,
	69320,
	69370,
	69376,
	69424,
	69427,
	69428,
	69445,
	69446,
	69457,
	69460,
	69461,
	69488,
	69492,
	69494,
	69506,
	69510,
	69552,
	69553,
	69554,
	69556,
	69559,
	69560,
	69561,
	69563,
	69565,
	69566,
	69568,
	69569,
	69570,
	69572,
	69573,
	69577,
	69578,
	69579,
	69580,
	69633,
	69634,
	69688,
	69703,
	69744,
	69745,
	69747,
	69749,
	69759,
	69762,
	69811,
	69815,
	69817,
	69819,
	69826,
	69827,
	69888,
	69891,
	69927,
	69932,
	69933,
	69941,
	70003,
	70004,
	70016,
	70018,
	70070,
	70079,
	70089,
	70093,
	70095,
	70096,
	70191,
	70194,
	70196,
	70197,
	70198,
	70200,
	70206,
	70207,
	70209,
	70210,
	70367,
	70368,
	70371,
	70379,
	70400,
	70402,
	70459,
	70461,
	70464,
	70465,
	70502,
	70509,
	70512,
	70517,
	70587,
	70593,
	70606,
	70607,
	70608,
	70609,
	70610,
	70611,
	70625,
	70627,
	70712,
	70720,
	70722,
	70725,
	70726,
	70727,
	70750,
	70751,
	70835,
	70841,
	70842,
	70843,
	70847,
	70849,
	70850,
	70852,
	71090,
	71094,
	71100,
	71102,
	71103,
	71105,
	71132,
	71134,
	71219,
	71227,
	71229,
	71230,
	71231,
	71233,
	71339,
	71340,
	71341,
	71342,
	71344,
	71350,
	71351,
	71352,
	71453,
	71454,
	71455,
	71456,
	71458,
	71462,
	71463,
	71468,
	71727,
	71736,
	71737,
	71739,
	71995,
	71997,
	71998,
	71999,
	72003,
	72004,
	72148,
	72152,
	72154,
	72156,
	72160,
	72161,
	72193,
	72203,
	72243,
	72249,
	72251,
	72255,
	72263,
	72264,
	72273,
	72279,
	72281,
	72284,
	72330,
	72343,
	72344,
	72346,
	72544,
	72545,
	72546,
	72549,
	72550,
	72551,
	72752,
	72759,
	72760,
	72766,
	72767,
	72768,
	72850,
	72872,
	72874,
	72881,
	72882,
	72884,
	72885,
	72887,
	73009,
	73015,
	73018,
	73019,
	73020,
	73022,
	73023,
	73030,
	73031,
	73032,
	73104,
	73106,
	73109,
	73110,
	73111,
	73112,
	73459,
	73461,
	73472,
	73474,
	73526,
	73531,
	73536,
	73537,
	73538,
	73539,
	73562,
	73563,
	78896,
	78913,
	78919,
	78934,
	90398,
	90410,
	90413,
	90416,
	92912,
	92917,
	92976,
	92983,
	94031,
	94032,
	94095,
	94099,
	94180,
	94181,
	113821,
	113823,
	113824,
	113828,
	118528,
	118574,
	118576,
	118599,
	119143,
	119146,
	119155,
	119171,
	119173,
	119180,
	119210,
	119214,
	119362,
	119365,
	121344,
	121399,
	121403,
	121453,
	121461,
	121462,
	121476,
	121477,
	121499,
	121504,
	121505,
	121520,
	122880,
	122887,
	122888,
	122905,
	122907,
	122914,
	122915,
	122917,
	122918,
	122923,
	123023,
	123024,
	123184,
	123191,
	123566,
	123567,
	123628,
	123632,
	124140,
	124144,
	124398,
	124400,
	124643,
	124644,
	124646,
	124647,
	124654,
	124656,
	124661,
	124662,
	125136,
	125143,
	125184,
	125252,
	125260,
	917505,
	917506,
	917536,
	917632,
	917760,
	918e3
], $n = [
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	2,
	0,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	1,
	2,
	4,
	2,
	5,
	0,
	2,
	5,
	4,
	0,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	0,
	4,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	4,
	0,
	2,
	0,
	2,
	0,
	5,
	4,
	5,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	5,
	0,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	0,
	5,
	0,
	2,
	5,
	0,
	1,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	5,
	0,
	2,
	0,
	2,
	0,
	4,
	2,
	4,
	0,
	4,
	1,
	2,
	0,
	2,
	4,
	2,
	0,
	5,
	2,
	4,
	0,
	4,
	2,
	4,
	2,
	4,
	2,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	2,
	0,
	1,
	5,
	0,
	5,
	0,
	2,
	0,
	5,
	2,
	5,
	2,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	1,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	2,
	3,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	2,
	4,
	0,
	4,
	0,
	4,
	0,
	3,
	4,
	2,
	3,
	2,
	4,
	2,
	4,
	0,
	4,
	5,
	0,
	2,
	4,
	0,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	2,
	4,
	0,
	4,
	2,
	0,
	3,
	2,
	4,
	2,
	5,
	0,
	5,
	0,
	5,
	0,
	4,
	2,
	0,
	2,
	0,
	5,
	0,
	2,
	4,
	2,
	0,
	5,
	2,
	4,
	0,
	2,
	4,
	2,
	5,
	0,
	2,
	0,
	2,
	4,
	0,
	2,
	4,
	2,
	4,
	2,
	0,
	2,
	4,
	2,
	0,
	4,
	2,
	3,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0,
	2,
	5,
	0,
	5,
	0,
	5,
	0,
	5,
	0
], er = [
	1587,
	1588,
	1589,
	1590,
	1690,
	1691,
	1692,
	1693,
	1694,
	1786,
	1787,
	1884,
	1901,
	1904,
	1917,
	1918,
	2223
], tr = [
	1580,
	1581,
	1582,
	1665,
	1666,
	1667,
	1668,
	1669,
	1670,
	1671,
	1727,
	1879,
	1880,
	1902,
	1903,
	1906,
	1916,
	2186,
	2210,
	2241,
	2245,
	2246
], nr = [
	1576,
	1578,
	1579,
	1646,
	1657,
	1658,
	1659,
	1660,
	1661,
	1662,
	1663,
	1664,
	1872,
	1873,
	1874,
	1875,
	1876,
	1877,
	1878,
	2208,
	2209,
	2230,
	2231,
	2232,
	2238,
	2239,
	2240
], rr = [
	1574,
	1585,
	1586,
	1597,
	1598,
	1599,
	1609,
	1610,
	1656,
	1681,
	1682,
	1683,
	1684,
	1685,
	1686,
	1687,
	1688,
	1689,
	1740,
	1742,
	1744,
	1745,
	1775,
	1883,
	1899,
	1900,
	1905,
	1909,
	1910,
	1911,
	2216,
	2217,
	2218,
	2226,
	2233,
	2234,
	69319
], ir = [
	1570,
	1571,
	1573,
	1575,
	1591,
	1592,
	1595,
	1596,
	1603,
	1604,
	1649,
	1650,
	1651,
	1653,
	1695,
	1705,
	1707,
	1708,
	1709,
	1710,
	1711,
	1712,
	1713,
	1714,
	1715,
	1716,
	1717,
	1718,
	1719,
	1720,
	1890,
	1891,
	1892,
	1898,
	1907,
	1908,
	1919,
	2160,
	2161,
	2162,
	2163,
	2164,
	2165,
	2166,
	2167,
	2168,
	2169,
	2170,
	2171,
	2172,
	2173,
	2174,
	2175,
	2176,
	2177,
	2178,
	2187,
	2188,
	2189,
	2211,
	2214,
	2224,
	2228,
	2242,
	2247,
	2248,
	69315,
	69316
], ar = [
	1572,
	1593,
	1594,
	1601,
	1602,
	1608,
	1647,
	1654,
	1655,
	1696,
	1697,
	1698,
	1699,
	1700,
	1701,
	1702,
	1703,
	1704,
	1732,
	1733,
	1734,
	1735,
	1736,
	1737,
	1738,
	1739,
	1743,
	1788,
	1885,
	1886,
	1887,
	1888,
	1889,
	1912,
	1913,
	2212,
	2213,
	2219,
	2227,
	2229,
	2243
];
//#endregion
//#region packages/docx/src/arabic-joining.ts
function or(e) {
	let t = 0, n = Qn.length - 1, r = -1;
	for (; t <= n;) {
		let i = t + (n - t >> 1);
		Qn[i] <= e ? (r = i, t = i + 1) : n = i - 1;
	}
	return r < 0 ? "U" : Zn[$n[r]] ?? "U";
}
function sr(e) {
	let t = or(e);
	return t === "D" || t === "L" || t === "C";
}
function cr(e) {
	let t = or(e);
	return t === "D" || t === "R" || t === "C";
}
var lr = 1604, ur = new Set([
	1575,
	1570,
	1571,
	1573,
	1649
]), dr = 1600, fr = new Set(er), pr = new Set(tr), mr = new Set(nr), hr = new Set(rr), gr = new Set(ir), _r = new Set(ar), vr = /* @__PURE__ */ function(e) {
	return e[e.Normal = 7] = "Normal", e[e.Waw = 8] = "Waw", e[e.BaRa = 9] = "BaRa", e[e.Alef = 10] = "Alef", e[e.HahDal = 11] = "HahDal", e[e.Seen = 12] = "Seen", e[e.Kashida = 13] = "Kashida", e;
}(vr || {});
function yr(e) {
	let t = [...e].map((e) => e.codePointAt(0)), n = [], r = t.length > 0 && or(t[0]) !== "T" ? 0 : -1;
	for (let e = 1; e < t.length; e++) {
		let i = t[e];
		if (or(i) !== "T") {
			if (r >= 0) {
				let a = t[r];
				!(a === lr && ur.has(i)) && sr(a) && cr(i) && n.push(e);
			}
			r = e;
		}
	}
	return n;
}
function br(e, t, n) {
	let r = t - 1;
	for (; r >= 0 && or(e[r]) === "T";) r--;
	let i = e[r], a = e[t];
	return i === dr ? vr.Kashida : fr.has(i) ? vr.Seen : pr.has(i) ? vr.HahDal : t === n && gr.has(a) ? vr.Alef : mr.has(i) && hr.has(a) ? vr.BaRa : t === n && _r.has(a) ? vr.Waw : vr.Normal;
}
function xr(e) {
	let t = [...e], n = [];
	for (let e = 0; e < t.length;) {
		for (; e < t.length && /\s/u.test(t[e]);) e++;
		if (e >= t.length) break;
		let r = e + 1;
		for (; r < t.length && !/\s/u.test(t[r]);) r++;
		let i = t.slice(e, r), a = i.map((e) => e.codePointAt(0)), o = a.length - 1;
		for (; o >= 0 && or(a[o]) === "T";) o--;
		let s = -1, c = -1;
		for (let e of yr(i.join(""))) {
			let t = br(a, e, o);
			t >= c && (s = e, c = t);
		}
		s >= 0 && n.push({
			beforeCp: e + s,
			priority: c
		}), e = r;
	}
	return n;
}
//#endregion
//#region packages/docx/src/kashida-justify.ts
var Sr = "ـ";
function Cr(e, t) {
	let n = [...e], r = "";
	for (let e = 0; e < n.length; e++) {
		let i = t.get(e) ?? 0;
		i > 0 && (r += Sr.repeat(i)), r += n[e];
	}
	return r;
}
function wr(e, t, n, r) {
	if (t <= .5) return null;
	let i = [];
	for (let t = 0; t < e.length; t++) {
		let n = e[t].text;
		if (n !== void 0) for (let { beforeCp: e, priority: r } of xr(n)) i.push({
			si: t,
			beforeCp: e,
			priority: r,
			textOrder: i.length
		});
	}
	if (i.length === 0) return null;
	i.sort((e, t) => t.priority - e.priority || e.textOrder - t.textOrder);
	let a = n === "low" ? 1 : n === "medium" ? 2 : Infinity, o = a, s = i.length * 64, c = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), u = /* @__PURE__ */ new Map();
	for (let { si: t } of i) {
		if (u.has(t)) continue;
		let n = r(t, e[t].text);
		l.set(t, n), u.set(t, n);
	}
	let d = t, f = 0;
	for (let t = 0; t < o && d > .5 && f < s; t++) {
		let t = !1;
		for (let { si: n, beforeCp: o } of i) {
			if (d <= .5 || f >= s) break;
			let i = c.get(n);
			i || (i = /* @__PURE__ */ new Map(), c.set(n, i));
			let l = i.get(o) ?? 0;
			if (l >= a) continue;
			i.set(o, l + 1);
			let p = r(n, Cr(e[n].text, i)), m = p - u.get(n);
			m > 0 && m <= d + 1e-6 ? (u.set(n, p), d -= m, f++, t = !0) : l === 0 ? i.delete(o) : i.set(o, l);
		}
		if (!t) break;
	}
	let p = /* @__PURE__ */ new Map();
	for (let [t, n] of c) {
		let r = [...n.entries()].filter(([, e]) => e > 0).sort(([e], [t]) => e - t).map(([e, t]) => ({
			beforeCp: e,
			count: t
		}));
		r.length !== 0 && p.set(t, {
			text: Cr(e[t].text, n),
			insertions: r,
			advanceDeltaPx: u.get(t) - l.get(t)
		});
	}
	if (p.size === 0) return null;
	let m = [...p.values()].reduce((e, t) => e + t.advanceDeltaPx, 0);
	return {
		perSeg: p,
		appliedPx: m,
		residualPx: t - m
	};
}
//#endregion
//#region packages/docx/src/frame-geometry.ts
function Tr(e, t) {
	let n = t.scale;
	switch (e) {
		case "margin": return {
			left: t.marginLeft * n,
			right: (t.pageWidth - t.marginRight) * n
		};
		case "page": return {
			left: 0,
			right: t.pageWidth * n
		};
		default: return {
			left: t.contentX,
			right: t.contentX + t.contentW
		};
	}
}
function Er(e, t, n, r) {
	let i = r.scale;
	switch (e) {
		case "margin": return {
			start: r.marginTop * i,
			end: r.pageH - r.marginBottom * i
		};
		case "page": return {
			start: 0,
			end: r.pageH
		};
		default: return {
			start: t,
			end: t + n
		};
	}
}
function Dr(e, t, n, r) {
	switch (e) {
		case "center": return t + (n - t - r) / 2;
		case "right":
		case "outside": return n - r;
		default: return t;
	}
}
function Or(e, t, n) {
	switch (e) {
		case "center": return t.start + (t.end - t.start - n) / 2;
		case "bottom":
		case "outside": return t.end - n;
		default: return t.start;
	}
}
function kr(e, t, n) {
	return e + t <= n.end ? e : Math.max(n.start, n.end - t);
}
function Ar(e, t, n, r, i, a) {
	let o = t.scale, s = e.dropCap === "drop" || e.dropCap === "margin", c = Tr(e.hAnchor, t), l = Er(e.vAnchor, n, i, t), u = e.w == null ? r : e.w * o, d;
	if (s) d = Math.max(1, e.lines) * a;
	else {
		let t = e.h == null ? 0 : e.h * o;
		d = e.hRule === "exact" ? t : e.hRule === "atLeast" ? Math.max(t, i) : i;
	}
	let f;
	f = e.dropCap === "drop" ? c.left : e.dropCap === "margin" ? c.left - u : e.xAlign ? Dr(e.xAlign, c.left, c.right, u) : c.left + (e.x == null ? 0 : e.x * o);
	let p;
	p = s ? l.start : e.yAlign && e.vAnchor !== "text" ? Or(e.yAlign, l, d) : l.start + (e.y == null ? 0 : e.y * o), (e.vAnchor === "page" || e.vAnchor === "margin") && (p = kr(p, d, l));
	let m = e.wrap === "around" || e.wrap === "auto" ? e.hSpace * o : 0, h = e.vSpace * o;
	return {
		x: f,
		y: p,
		w: u,
		h: d,
		exLeft: f - m,
		exRight: f + u + m,
		exTop: p - h,
		exBottom: p + d + h
	};
}
function jr(e, t) {
	let n = t.x, r = t.y;
	if (t.avoidOverlap) {
		let i = Kn(n, r, t.w, t.h, t.dl, t.dr, t.dt, t.db, t.paraId, t.allowOverlap ?? !0, t.kind, e.pageWidth * e.scale, e.floats);
		n = i.x, r = i.y;
	}
	let i = {
		kind: t.kind,
		mode: t.mode,
		imageKey: t.imageKey,
		imageX: n,
		imageY: r,
		imageW: t.w,
		imageH: t.h,
		xLeft: n - t.dl,
		xRight: n + t.w + t.dr,
		yTop: r - t.dt,
		yBottom: r + t.h + t.db,
		side: t.side,
		distLeft: t.dl,
		distRight: t.dr,
		distTop: t.dt,
		distBottom: t.db,
		paraId: t.paraId,
		drawn: t.drawn
	};
	return e.floats.push(i), i;
}
function Mr(e, t, n) {
	if (t.wrap === "none" || e.w <= 0 || e.h <= 0) return;
	let r = n.floatParaSeq++, i = t.wrap === "notBeside" ? "topAndBottom" : "square";
	jr(n, {
		x: e.x,
		y: e.y,
		w: e.w,
		h: e.h,
		dl: e.x - e.exLeft,
		dr: e.exRight - (e.x + e.w),
		dt: e.y - e.exTop,
		db: e.exBottom - (e.y + e.h),
		kind: "frame",
		mode: i,
		side: t.dropCap === "drop" || t.dropCap === "margin" ? "right" : "bothSides",
		imageKey: "",
		drawn: !0,
		paraId: r,
		avoidOverlap: !1
	});
}
//#endregion
//#region packages/docx/src/float-table-geometry.ts
function Nr(e, t, n, r, i, a = !1) {
	let o = t.scale, s = e.horzSpecified ? Tr(e.horzAnchor, t) : Tr("text", t), c = Er(e.vertAnchor, n, i, t), l;
	l = e.tblpXSpec ? Dr(e.tblpXSpec, s.left, s.right, r) : s.left + e.tblpX * o;
	let u;
	return u = e.tblpYSpec && e.vertAnchor !== "text" ? Or(e.tblpYSpec, c, i) : c.start + e.tblpY * o, !a && (e.vertAnchor === "page" || e.vertAnchor === "margin") && (u = kr(u, i, c)), {
		x: l,
		y: u,
		w: r,
		h: i
	};
}
function Pr(e, t, n, r, i) {
	if (e.w <= 0 || e.h <= 0) return;
	let a = n.scale, o = t.leftFromText * a, s = t.rightFromText * a, c = t.topFromText * a, l = t.bottomFromText * a, u = n.floatParaSeq++;
	jr(n, {
		x: e.x,
		y: e.y,
		w: e.w,
		h: e.h,
		dl: o,
		dr: s,
		dt: c,
		db: l,
		kind: "table",
		mode: "square",
		side: r,
		imageKey: "",
		drawn: !0,
		paraId: u,
		avoidOverlap: !0,
		allowOverlap: i
	});
}
function Fr(e, t) {
	let n = (t.contentX + (t.contentX + t.contentW)) / 2;
	return e.x + e.w <= n ? "right" : e.x >= n ? "left" : "bothSides";
}
//#endregion
//#region packages/docx/src/anchor-geometry.ts
function Ir(e, t, n) {
	let { scale: r } = n, i = n.pageWidth * r, a = n.marginLeft * r, o = n.marginRight * r;
	switch (e ?? (t ? "margin" : "page")) {
		case "page": return {
			start: 0,
			end: i
		};
		case "leftMargin": return {
			start: 0,
			end: a
		};
		case "rightMargin": return {
			start: i - o,
			end: i
		};
		case "insideMargin": return {
			start: 0,
			end: a
		};
		case "outsideMargin": return {
			start: i - o,
			end: i
		};
		case "character":
		case "column": return {
			start: n.contentX,
			end: n.contentX + n.contentW
		};
		default: return {
			start: a,
			end: i - o
		};
	}
}
function Lr(e, t, n, r) {
	let { scale: i } = r, a = r.marginTop * i, o = r.marginBottom * i;
	switch (e ?? (t ? "paragraph" : "page")) {
		case "page": return {
			start: 0,
			end: r.pageH
		};
		case "topMargin": return {
			start: 0,
			end: a
		};
		case "bottomMargin": return {
			start: r.pageH - o,
			end: r.pageH
		};
		case "paragraph":
		case "line": return {
			start: n,
			end: r.pageH
		};
		default: return {
			start: a,
			end: r.pageH - o
		};
	}
}
function Rr(e, t, n, r, i, a, o, s) {
	let { scale: c } = i, l = Ir(a, t, i), u = n * c;
	if (o != null) return l.start + (l.end - l.start) * o + u;
	if (!e) return l.start + u;
	let d = l.end - l.start, f = s == null ? r : s * c, p = s == null ? 0 : u;
	switch (e) {
		case "center": return l.start + (d - f) / 2 + p;
		case "right":
		case "outside": return l.end - f + p;
		default: return l.start + p;
	}
}
function zr(e, t, n, r, i, a, o, s, c) {
	let { scale: l } = a, u = Lr(o, t, i, a), d = n * l;
	if (s != null) return u.start + (u.end - u.start) * s + d;
	if (!e) return u.start + d;
	let f = u.end - u.start, p = c == null ? r : c * l, m = c == null ? 0 : d;
	switch (e) {
		case "center": return u.start + (f - p) / 2 + m;
		case "bottom":
		case "outside": return u.end - p + m;
		default: return u.start + m;
	}
}
function Br(e, t) {
	let n = e.gridBefore ?? 0;
	if (!Number.isFinite(n)) return 0;
	let r = Math.max(0, Math.trunc(n));
	return r > Math.max(0, Math.trunc(t)) ? 0 : r;
}
function Vr(e, t, n) {
	let r = t;
	for (let i = t + 1; i < e.rows.length; i++) {
		let t = e.rows[i], a = Br(t, e.colWidths.length), o = !1;
		for (let e of t.cells) {
			if (a === n) {
				e.vMerge === !1 && (o = !0);
				break;
			}
			if (a > n) break;
			a += e.colSpan;
		}
		if (!o) break;
		r = i;
	}
	return r;
}
function Hr(e, t, n) {
	let r = Br(e, n);
	for (let n of e.cells) {
		if (t >= r && t < r + n.colSpan) return n;
		r += n.colSpan;
	}
	return null;
}
function Ur(e) {
	let t = e?.spec;
	return !t || t.style === "none" || t.style === "nil" ? 0 : t.width;
}
function Wr(e) {
	let t = e.rows.length, n = e.colWidths.length, r = Array(t + 1).fill(0);
	if (t === 0 || n === 0) return r;
	let i = Array.from({ length: t }, () => Array(n).fill(null));
	for (let r = 0; r < t; r++) {
		let t = e.rows[r], a = Br(t, n);
		for (let o of t.cells) {
			let t = Math.min(o.colSpan, n - a);
			if (o.vMerge !== !1 && t > 0) {
				let n = o.vMerge === !0 ? Vr(e, r, a) : r, s = {
					cell: o,
					ri: r,
					lastRi: n,
					ci: a,
					span: t
				};
				for (let e = r; e <= n; e++) for (let n = a; n < a + t; n++) i[e][n] = s;
			}
			a += t;
		}
	}
	let a = (e) => ({
		topRow: e.ri === 0,
		bottomRow: e.lastRi === t - 1,
		leftCol: e.ci === 0,
		rightCol: e.ci + e.span === n
	}), o = (t) => _n((t.lastRi > t.ri ? Hr(e.rows[t.lastRi], t.ci, n) ?? t.cell : t.cell).borders, e.borders, a(t), !1).bottom;
	for (let s = 0; s < n; s++) {
		let n = i[0][s];
		if (n) {
			let t = _n(n.cell.borders, e.borders, a(n), !1).top;
			r[0] = Math.max(r[0], Ur(On(t, null)));
		}
		for (let n = 1; n < t; n++) {
			if (e.rows[n - 1].pageCutBottom === !0) continue;
			let t = i[n - 1][s], c = i[n][s];
			if (t && t === c) continue;
			let l = t ? o(t) : null, u = c ? _n(c.cell.borders, e.borders, a(c), !1).top : null;
			r[n] = Math.max(r[n], Ur(On(l, u)));
		}
		let c = i[t - 1][s];
		c && (r[t] = Math.max(r[t], Ur(On(o(c), null))));
	}
	return r;
}
function Gr(e, t, n, r) {
	if (e.rowHeight != null && e.rowHeightRule === "exact") return e.rowHeight * n;
	let i = e.rowHeight != null && (e.rowHeightRule === "atLeast" || e.rowHeightRule === "auto") ? e.rowHeight * n : 10 * n, a = Br(e, t.length);
	for (let n of e.cells) {
		let e = Math.min(n.colSpan, t.length - a);
		if (n.vMerge !== !0 && n.vMerge !== !1) {
			let o = r(n, t.slice(a, a + e).reduce((e, t) => e + t, 0));
			o > i && (i = o);
		}
		a += e;
	}
	return i;
}
function Kr(e, t, n, r) {
	let i = e.rows.map((e) => Gr(e, t, n, r));
	for (let n = 0; n < e.rows.length; n++) {
		let a = e.rows[n], o = Br(a, t.length);
		for (let s of a.cells) {
			let a = Math.min(s.colSpan, t.length - o);
			if (s.vMerge === !0) {
				let c = r(s, t.slice(o, o + a).reduce((e, t) => e + t, 0)), l = Vr(e, n, o), u = 0;
				for (let e = n; e <= l; e++) u += i[e];
				u < c && (i[l] += c - u);
			}
			o += a;
		}
	}
	return i;
}
function qr(e, t, n) {
	let r = Wr(e);
	return t.map((t, i) => e.rows[i]?.rowHeightRule === "exact" ? t : t + ((r[i] ?? 0) + (r[i + 1] ?? 0)) * n / 2);
}
function Jr(e, t, n, r) {
	return qr(e, Kr(e, t, n, r), n);
}
//#endregion
//#region packages/docx/src/line-fit-policy.ts
function Yr(e, t, n, r) {
	let i = e, a = 0;
	for (let o = e + 1; o <= t; o++) {
		let e = r(o);
		if (!(e <= n)) break;
		i = o, a = e;
	}
	return {
		end: i,
		fitValue: a
	};
}
function Xr(e) {
	return !e.widowControl || e.end >= e.totalLines ? { kind: "keep" } : e.totalLines - e.end === 1 && e.end - e.start >= 2 ? { kind: "dropLastLine" } : e.start === 0 && e.end - e.start === 1 && e.canRelocate ? { kind: "relocate" } : { kind: "keep" };
}
//#endregion
//#region packages/docx/src/fit-text.ts
function Zr(e, t) {
	let n = [];
	for (let r = 0; r < e.length;) {
		let i = e[r];
		if (i.fitTextValTwips === void 0) {
			r += 1;
			continue;
		}
		let a = r + 1;
		if (i.fitTextId !== void 0) for (; a < e.length && e[a].fitTextValTwips !== void 0 && e[a].fitTextId === i.fitTextId;) a += 1;
		let o = 0, s = 0;
		for (let t = r; t < a; t += 1) {
			let n = e[t];
			o += n.naturalWidthPx * (n.charScale ?? 1), s += n.charCount;
		}
		let c = i.fitTextValTwips / 20 * t, l = s > 1 ? (c - o) / (s - 1) : 0, u = c - o - Math.max(0, s - 1) * l;
		n.push({
			start: r,
			end: a,
			targetPx: c,
			naturalPx: o,
			charCount: s,
			perGapPx: l,
			trailingPadPx: u
		}), r = a;
	}
	return n;
}
//#endregion
//#region packages/docx/src/vertical-text.ts
function Qr(e) {
	let t = Se(e);
	return t === "U" || t === "Tu" ? "upright" : t === "Tr" ? "rotate" : "sideways";
}
var $r = new Set([65294]);
function ei(e) {
	return $r.has(e) ? {
		dx: .4,
		dy: -.4
	} : {
		dx: 0,
		dy: 0
	};
}
var ti = () => !1;
function ni(e, t, n) {
	let r = e.textBaseline;
	e.textBaseline = "alphabetic";
	let i = e.measureText(t);
	e.textBaseline = r;
	let a = i.fontBoundingBoxAscent, o = i.fontBoundingBoxDescent;
	return typeof a == "number" && typeof o == "number" && (a !== 0 || o !== 0) ? (a - o) / 2 : .38 * n;
}
function ri(e, t) {
	let n = e.textAlign, r = e.textBaseline;
	e.textAlign = "center", e.textBaseline = "middle";
	let i = e.measureText(t);
	e.textAlign = n, e.textBaseline = r;
	let a = i.actualBoundingBoxAscent, o = i.actualBoundingBoxDescent;
	return typeof a == "number" && typeof o == "number" ? (a - o) / 2 : 0;
}
function ii(e) {
	return Qr(e) === "rotate" && we(e) === null && !r(e);
}
function ai(e) {
	let t = Se(e);
	return t === "Tu" || t === "Tr";
}
function oi(e, t) {
	let n = e.textAlign, r = e.textBaseline;
	e.textAlign = "center", e.textBaseline = "middle";
	let i = e.measureText(t);
	e.textAlign = n, e.textBaseline = r;
	let a = i.actualBoundingBoxLeft, o = i.actualBoundingBoxRight;
	return typeof a != "number" || typeof o != "number" || !Number.isFinite(a) || !Number.isFinite(o) ? null : {
		extentPx: a + o,
		shiftPx: (a - o) / 2
	};
}
function si(e, t, n, r, i) {
	let a = e.measureText(t).width;
	if (ai(n) && r(n)) {
		let n = re(e, t);
		return {
			naturalPx: n.cellAdvancePx,
			vert: n,
			rotateInkShiftPx: 0
		};
	}
	if (i && ii(n)) {
		let n = oi(e, t);
		if (n !== null && n.extentPx > a) return {
			naturalPx: n.extentPx,
			vert: null,
			rotateInkShiftPx: n.shiftPx
		};
	}
	return {
		naturalPx: a,
		vert: null,
		rotateInkShiftPx: 0
	};
}
function ci(e, t, n) {
	let r = 0;
	for (let i of t) {
		let t = si(e, i, i.codePointAt(0) ?? 0, n, !0);
		r += t.naturalPx;
	}
	return r - e.measureText(t).width;
}
function li(e, t) {
	return ci(e, t, (t) => z(e, t));
}
function ui(e, t, n, i, a, o, s = 1, c = !1, l = ti) {
	let u = e.textAlign, d = e.textBaseline, f = ni(e, t, a), p = s !== 1, m = 0;
	for (let d of t) {
		let t = d.codePointAt(0) ?? 0, h = Qr(t), g = h === "rotate" ? we(t) : null, _ = h === "rotate" && g === null && r(t), v = si(e, d, t, l, c), y = v.vert, b = v.naturalPx, x = v.rotateInkShiftPx, S = b * s + o;
		if (y !== null) {
			let t = n + m + y.originInCellPx * s;
			e.save(), e.translate(t, i), e.rotate(-Math.PI / 2), p && e.scale(1, s), e.textAlign = "center", e.textBaseline = "middle", ye(e, () => e.fillText(d, 0, 0)), e.restore();
		} else if (h === "upright" || g !== null || _) {
			let r = g === null ? H(t) : null, o = g === null ? r : g, c = o === null ? d : String.fromCodePoint(o), l = n + m + S / 2, u = o === null ? ei(t) : {
				dx: 0,
				dy: 0
			}, f = r !== null, h = u.dy === 0 && !f ? ri(e, c) / a : 0;
			e.save(), e.translate(l, i), e.rotate(-Math.PI / 2), p && e.scale(1, s), e.textAlign = "center", e.textBaseline = "middle", e.fillText(c, u.dx * a, (h + u.dy) * a), e.restore();
		} else if (h === "rotate") {
			let t = n + m + S / 2;
			e.textAlign = "center", e.textBaseline = "middle", p || x !== 0 ? (e.save(), e.translate(t, i), x !== 0 && e.translate(s * x, 0), e.transform(s, 0, 0, 1, 0, 0), e.fillText(d, 0, 0), e.restore()) : e.fillText(d, t, i);
		} else e.textAlign = u, e.textBaseline = "alphabetic", p ? (e.save(), e.translate(n + m, 0), e.scale(s, 1), e.fillText(d, 0, i + f), e.restore()) : e.fillText(d, n + m, i + f);
		m += S;
	}
	e.textAlign = u, e.textBaseline = d;
}
function di(e, t, n, r, i, a, o = 1, s = !1) {
	ui(e, t, n, r, i, a, o, s, (t) => z(e, t));
}
function fi(e, t, n, r, i, a, o, s) {
	let c = e.textAlign, l = e.textBaseline, u = 1;
	if (s) {
		let n = e.measureText(t), r = n.fontBoundingBoxAscent, a = n.fontBoundingBoxDescent;
		if (typeof r == "number" && typeof a == "number") {
			let e = r + a;
			e > i && e > 0 && (u = i / e);
		}
	}
	let d = n + a / 2;
	e.save(), e.translate(d, r), e.rotate(-Math.PI / 2), e.scale(o, u), e.textAlign = "center", e.textBaseline = "middle", e.fillText(t, 0, 0), e.restore(), e.textAlign = c, e.textBaseline = l;
}
function pi(e, t, n, r, i, a) {
	let o = t + r / 2, s = n + i / 2;
	e.save(), e.translate(o, s), e.rotate(-Math.PI / 2), a(-i / 2, -r / 2, i, r), e.restore();
}
function mi(e, t, n, r, i) {
	return {
		x: t,
		y: i - (e + n),
		w: r,
		h: n
	};
}
function hi(e, t, n, r) {
	return r ? {
		left: n - t,
		top: e,
		transform: "rotate(90deg)"
	} : null;
}
//#endregion
//#region packages/docx/src/line-layout.ts
function gi(e, t, n) {
	return t == null ? e * n * 1.5 : t * n;
}
var _i = /* @__PURE__ */ new WeakMap(), vi = new Set([
	"sakkal majalla",
	"traditional arabic",
	"simplified arabic",
	"arabic typesetting",
	"univers next arabic",
	"noto naskh arabic",
	"noto sans arabic"
]), yi = new Set([
	"sakkal majalla",
	"traditional arabic",
	"simplified arabic",
	"arabic typesetting",
	"noto naskh arabic"
]);
function bi(e) {
	return vi.has(e.toLowerCase());
}
function xi(e) {
	return e.map((e) => `"${e}"`).join(", ");
}
var Si = ["Noto Naskh Arabic", "Noto Sans Arabic"];
function Ci(e) {
	let t = e && e !== "jp" ? s(e, "sans") : [
		"Noto Sans JP",
		"Hiragino Sans",
		"Meiryo",
		...s("jp", "sans").slice(1)
	];
	return e == null ? `${xi([
		...x,
		"Arial",
		"Helvetica",
		"Liberation Sans",
		...t,
		...Si
	])}, sans-serif` : `${xi([
		...t,
		...Si,
		...x
	])}, sans-serif`;
}
function wi(e) {
	let t = e && e !== "jp" ? s(e, "serif") : [
		"Yu Mincho",
		"YuMincho",
		"Hiragino Mincho ProN",
		"MS Mincho",
		"Noto Serif JP",
		...s("jp", "serif").slice(1)
	];
	return e == null ? `${xi([
		...C,
		"Times New Roman",
		"Cambria",
		"Liberation Serif",
		...t,
		...Si
	])}, serif` : `${xi([
		...t,
		...Si,
		...C
	])}, serif`;
}
var Ti = /* @__PURE__ */ new WeakMap(), Ei = /* @__PURE__ */ new WeakMap();
function Di(e, t) {
	let n = e ?? {};
	return t && Object.keys(t).length > 0 && Ei.set(n, t), n;
}
function Oi(e, t = {}) {
	let n = Ti.get(t) ?? (() => {
		let e = /* @__PURE__ */ new Map();
		return Ti.set(t, e), e;
	})(), r = e ?? "\0null", i = n.get(r);
	if (i !== void 0) return i;
	let a = ki(e, t, Ei.get(t));
	return n.set(r, a), a;
}
function ki(e, t, n = {}) {
	if (!e) return Ci(null);
	let r = `"${((e) => e.replace(/"/g, "\\\""))(e)}"`, i = e.toLowerCase(), a = p(e);
	if (bi(e)) return yi.has(i) ? `${r}, "Noto Naskh Arabic", "Noto Sans Arabic", "Noto Serif", "Noto Sans JP", "Hiragino Sans", serif` : `${r}, "Noto Sans Arabic", "Noto Naskh Arabic", "Noto Sans JP", "Hiragino Sans", sans-serif`;
	let o = t[e];
	if (o && o !== "auto") switch (o) {
		case "roman": return `${r}, ${wi(a)}`;
		case "swiss": return `${r}, ${Ci(a)}`;
		case "modern":
			if (n[e] === "fixed") return `${r}, "Courier New", monospace`;
			break;
		default: break;
	}
	let s = y(e);
	if (s === "serif") return `${r}, ${wi(a)}`;
	if (s === "mono") return `${r}, "Courier New", monospace`;
	if (a == null || a === "jp") {
		if (i.includes("meiryo") || e.includes("メイリオ")) return `${r}, "Meiryo UI", "Meiryo", ${Ci(a)}`;
		if (e.includes("游ゴシック") || /\byu\s*gothic\b/i.test(e) || i.includes("yugothic")) return `${r}, "Yu Gothic", "YuGothic", ${Ci(a)}`;
		if (i.includes("ipa")) return `${r}, "IPAexGothic", ${Ci(a)}`;
		if (i.includes("segoe")) return `${r}, "Segoe UI", ${xi([...Si, ...x])}, sans-serif`;
	}
	return `${r}, ${Ci(a)}`;
}
function Ai(e, t, n, r, i = {}) {
	return `${t ? "italic" : "normal"} ${e ? "bold" : "normal"} ${n}px ${Oi(r, i)}`;
}
function ji(e, t) {
	let n = (e.smallCaps ? Math.max(e.fontSize - 2, 1) : e.fontSize) * t;
	return e.vertAlign && (n *= .65), n;
}
function Mi(e, t, n = !1) {
	return Math.max(ue(e.fontFamily, t, n), (e.resolvedLineHeightRatio ?? 0) * t);
}
function Ni(e, t, n = !1) {
	return Math.max(ue(e.eaFloorFamily, t, n), (e.resolvedEaFloorLineHeightRatio ?? 0) * t);
}
function Pi(e) {
	for (let t of e.runs) if (t.type === "text" || t.type === "field") return t.fontSize;
	return typeof e.defaultFontSize == "number" ? e.defaultFontSize : 10;
}
function Fi(e, t = !1) {
	for (let t of e.runs) if (t.type === "text" || t.type === "field") return t.fontFamily;
	return t && e.defaultFontFamilyEastAsia ? e.defaultFontFamilyEastAsia : e.defaultFontFamily ?? null;
}
function Ii(e, t, n) {
	return ue(Fi(e, n), Pi(e) * t, n);
}
var Li = /[ᄀ-ᇿ⺀-⿟　-〿぀-ヿ㄰-㆏㐀-䶿一-鿿ꥠ-꥿가-퟿豈-﫿＀-￯]/u;
function Ri(e, t) {
	return !e || e.charSpacePt == null || e.type !== "linesAndChars" && e.type !== "snapToChars" ? 0 : e.charSpacePt * t;
}
function zi(e) {
	let t = 0;
	for (let n of e) Li.test(n) && t++;
	return t;
}
function Bi(e, t) {
	if (t === 0 || e.length === 0) return 0;
	let n = [...e];
	return zi(e) === n.length ? n.length * t : 0;
}
function Vi(e, t) {
	return e.snapToCharacterGrid === !1 ? 0 : t;
}
function Hi(e, t) {
	return e.fitTextPerGapPx === void 0 ? (e.charSpacing ?? 0) * t : e.fitTextPerGapPx;
}
function Ui(e) {
	return e.charScale ?? 1;
}
function Wi(e, t, n, r, i) {
	return e * r + Bi(t, n) + [...t].length * i;
}
function Gi(e, t, n) {
	if (e.fitTextPerGapPx !== void 0) return e.fitTextPerGapPx;
	let r = Vi(e, t);
	return (Bi(e.text, r) === 0 ? 0 : r) + Hi(e, n);
}
function Ki(e, t, n, r) {
	if (e.fitTextPerGapPx !== void 0) {
		let n = [...e.text].length, r = e.fitTextRegionEnd ? Math.max(0, n - 1) : n;
		return t * Ui(e) + r * e.fitTextPerGapPx + (e.fitTextTrailingPadPx ?? 0);
	}
	if (e.tateChuYoko) return e.fontSize * r;
	let i = Vi(e, n);
	return Wi(t, e.text, i, Ui(e), Hi(e, r));
}
function qi(e) {
	return !e || !e.linePitchPt || e.linePitchPt <= 0 ? !1 : e.type === "lines" || e.type === "linesAndChars" || e.type === "snapToChars";
}
function Ji(e, t) {
	return t > 0 ? Math.max(1, Math.ceil(e / t)) : 1;
}
function Yi(e, t) {
	return e > 0 ? e : t * 1.3;
}
function Xi(e, t, n, r, i, a, o = 0, s = !1, c, l) {
	let u = t + n, d = Math.max(u, o), f = qi(i), p = f ? i.linePitchPt * r : 0, m = () => s ? a ? Math.max(p, Math.ceil(u / p) * p) : Ji(c ?? (o > 0 ? o : l === void 0 ? p : Yi(0, l)), p) * p : Math.max(u, p), h = e !== null && e.explicit !== !0;
	return !e || (e.rule === "exact" || e.rule === "auto") && e.value <= 0 ? f ? m() : d : e.rule === "auto" ? f ? h ? m() : Math.max(u, p * e.value) : d * e.value : e.rule === "exact" ? e.value * r : e.rule === "atLeast" ? Math.max(d, e.value * r, f ? a || h ? m() : p : 0) : d;
}
function Zi(e, t) {
	return {
		asc: e * t * .8,
		desc: e * t * .2
	};
}
function Qi(e, t, n, r, i = !1) {
	return V(t, r, e.fontBoundingBoxAscent ?? e.actualBoundingBoxAscent ?? n * .8, e.fontBoundingBoxDescent ?? e.actualBoundingBoxDescent ?? n * .2, i);
}
function $i(e, t, n, r, i = !1, a, o = {}, s = e.lineSpacing, c = {}) {
	let l = Pi(e), u = Fi(e, i), d = u ? c[Zt(u)] : void 0, f = d?.family ?? u, p, m;
	if (a) {
		let e = a.font;
		a.font = Ai(!1, !1, l * t, f, o);
		let n = a.measureText(i ? "あ" : "x");
		a.font = e, {ascent: p, descent: m} = Qi(n, f, l * t, l * t, i);
	} else ({asc: p, desc: m} = Zi(l, t));
	let h = d ? l * t * d.lineHeightRatio : Ii(e, t, i), g = i ? Yi(h, l * t) : void 0;
	return {
		advancePx: Xi(s, p, m, t, n, r, h, i, g),
		ascentPx: p,
		descentPx: m
	};
}
function ea(e, t, n, r, i = !1, a, o = {}, s = e.lineSpacing, c = {}) {
	return $i(e, t, n, r, i, a, o, s, c).advancePx;
}
function ta(e, t, n) {
	return Math.max(0, (e - t + n) / 2);
}
function na(e, t, n, r, i, a, o, s = {}) {
	let c = $i(e, 1, t, n, r, i, a, o, s);
	return ta(c.advancePx, c.ascentPx, c.descentPx);
}
function ra(e) {
	let t = [];
	for (let n of e) {
		let e = n.toLowerCase() === n && n.toUpperCase() !== n, r = /\s/.test(n) ? t[t.length - 1]?.reduced ?? !1 : e, i = t[t.length - 1];
		i && i.reduced === r ? i.text += n : t.push({
			text: n,
			reduced: r
		});
	}
	return t.length ? t : [{
		text: e,
		reduced: !1
	}];
}
function ia(e, t) {
	for (let n = t - 1; n >= 0; n--) {
		let t = e[n];
		if (t.type === "text" || t.type === "field") return t.fontSize;
	}
	for (let n = t + 1; n < e.length; n++) {
		let t = e[n];
		if (t.type === "text" || t.type === "field") return t.fontSize;
	}
	return 10;
}
function aa(e, t) {
	if (e.fieldType === "page") return wt(t.displayPageNumber ?? t.pageIndex + 1, Ut(e.instruction) ?? t.pageNumberFormat ?? "decimal");
	if (e.fieldType === "numPages") {
		let n = Ut(e.instruction) ?? "decimal";
		return wt(t.totalPages, n);
	}
	if (e.fieldType === "date" || e.fieldType === "time") {
		let n = Yt(e.instruction);
		if (n) {
			let e = Xt(n, new Date(t.currentDateMs ?? Date.now()));
			if (e !== null) return e;
		}
		return e.fallbackText;
	}
	return e.fallbackText;
}
var oa = new Set([
	"+",
	"-",
	"−",
	"=",
	"±",
	"×",
	"÷"
]);
function sa(e) {
	return oa.has(e) ? ` ${e} ` : e;
}
function $(e) {
	return e.map((e) => {
		switch (e.kind) {
			case "run": return sa(e.text);
			case "fraction": return `${$(e.num)}/${$(e.den)}`;
			case "sup": return `${$(e.base)}^${$(e.sup ?? [])}`;
			case "sub": return `${$(e.base)}_${$(e.sub ?? [])}`;
			case "subSup": return `${$(e.base)}_${$(e.sub ?? [])}^${$(e.sup ?? [])}`;
			case "nary": return `${e.op}${$(e.sub ?? [])}${$(e.sup ?? [])}${$(e.body)}`;
			case "delimiter": return `${e.begChar}${e.items.map($).join(",")}${e.endChar}`;
			case "radical": return `${e.index && e.index.length > 0 ? $(e.index) : ""}√${$(e.radicand)}`;
			case "limit": return `${$(e.base)}${$(e.lower ?? [])}${$(e.upper ?? [])}`;
			case "array": return e.rows.map((e) => e.map($).join(" ")).join(" ");
			case "groupChr": return `${e.char}${$(e.base)}`;
			case "bar":
			case "box":
			case "borderBox": return $(e.base);
			case "accent": return `${e.char}${$(e.base)}`;
			case "func": return `${$(e.name)}(${$(e.arg)})`;
			case "group": return $(e.items);
			case "phant": return e.show ? $(e.base) : "";
			case "sPre": return `${$(e.sub)}${$(e.sup)}${$(e.base)}`;
		}
	}).join("").replace(/[ \t]{2,}/g, " ");
}
function ca(e) {
	for (let t = 0; t < e.length;) {
		let n = e.codePointAt(t);
		if (S(n)) return !0;
		t += n > 65535 ? 2 : 1;
	}
	return !1;
}
function la(e, t) {
	if (e === void 0) return;
	let n = [];
	for (let r of e) r > t && n.push(r - t);
	return n;
}
function ua(e, t) {
	if (t <= 0) return t;
	let n = t;
	for (; n < e.length && e[n] === "　";) n++;
	return n;
}
function da(e, t, n, r = 0, i = 1, a = 0, o = !1) {
	let s = [...t], c = (t) => {
		let c = t;
		for (; c > 0 && s[c - 1] === "　";) c--;
		let l = s.slice(0, c).join("");
		return l.length === 0 ? !0 : Wi(e.measureText(l).width + (o ? li(e, l) : 0), l, r, i, a) <= n;
	}, l = 0, u = s.length;
	for (; l < u;) {
		let e = l + u + 1 >> 1;
		c(e) ? l = e : u = e - 1;
	}
	return s.slice(0, l).join("");
}
var fa = new Set([
	"ar",
	"fa",
	"ur",
	"he",
	"iw",
	"yi",
	"ji",
	"ps",
	"sd",
	"ug",
	"dv",
	"syr",
	"ckb"
]);
function pa(e, t) {
	if (e) {
		let t = e.split("-")[0].toLowerCase();
		if (fa.has(t)) return !0;
	}
	return t;
}
function ma(e) {
	let t = [], n = null, r = "";
	for (let i of e) {
		let e = i.codePointAt(0);
		if (!/\p{L}/u.test(i)) {
			r += i;
			continue;
		}
		let a = D(e);
		n === null ? (n = a, r += i) : a === n ? r += i : (t.push({
			text: r,
			cs: n
		}), n = a, r = i);
	}
	return r.length > 0 && t.push({
		text: r,
		cs: n ?? !1
	}), t;
}
function ha(e) {
	let t = [], n = null, r = "";
	for (let i of e) {
		let e = S(i.codePointAt(0));
		n === null || e === n ? (n = e, r += i) : (t.push({
			text: r,
			ea: n
		}), n = e, r = i);
	}
	return r.length > 0 && t.push({
		text: r,
		ea: n ?? !1
	}), t;
}
function ga(e) {
	let t = (e) => e >= 48 && e <= 57, n = (e) => e === "." || e === "," || e === ":" || e === "/" || e === "\xA0", r = [], i = "", a = null;
	for (let o = 0; o < e.length; o++) {
		let s = e[o], c = t(s.charCodeAt(0));
		!c && a === !0 && n(s) && t(e.charCodeAt(o + 1)) && (c = !0), a === null || c === a ? i += s : (r.push(i), i = s), a = c;
	}
	return i.length > 0 && r.push(i), r.length ? r : [e];
}
function _a(e) {
	let t = [], n = 0;
	for (; n < e.length;) {
		let r = n;
		for (; r < e.length && e[r] !== " ";) r++;
		for (; r < e.length && e[r] === " ";) r++;
		r > n && t.push(e.slice(n, r)), n = r;
	}
	return t.length ? t : [e];
}
var va = .25;
function ya(e) {
	let t = e?.defaultTabStop;
	return t != null && t > 0 ? t : 36;
}
function ba(e, t, n) {
	let r = null, i = 0;
	for (let n of t) n.pos > i && (i = n.pos), n.pos > e && (r === null || n.pos < r.pos) && (r = n);
	let a = null;
	if (n > 0) {
		let t = Math.ceil((Math.max(e, i) + 1e-6) / n) * n;
		t <= e && (t += n), a = {
			pos: t,
			alignment: "left"
		};
	}
	return r && a ? r.pos <= a.pos ? r : a : r ?? a;
}
function xa(e, t, n) {
	let r = null, i = 0;
	for (let n of t) n.pos > i && (i = n.pos), n.pos > e && (r === null || n.pos < r.pos) && (r = n);
	let a = null;
	if (n > 0) {
		let t = Math.ceil((Math.max(e, i) + 1e-6) / n) * n;
		t <= e && (t += n), a = {
			pos: t,
			alignment: "left"
		};
	}
	return r && a ? r.pos <= a.pos ? r : a : r ?? a;
}
function Sa(e, t, n, r, i) {
	let a = e.length, o = e.map((e) => e.width), s = Array(a).fill(void 0), c = (t) => {
		let n = 0;
		for (let r = t; r < a && !e[r].isTab; r++) n += o[r];
		return n;
	}, l = n;
	for (let n = 0; n < a; n++) {
		if (!e[n].isTab) {
			l += o[n];
			continue;
		}
		let a = xa(l, t, i);
		if (!a) {
			o[n] = 0;
			continue;
		}
		let u = c(n + 1), d;
		d = a.alignment === "right" ? a.pos - u : a.alignment === "center" ? a.pos - u / 2 : a.pos, d + u > r && (d = r - u), d < l && (d = l), o[n] = d - l, s[n] = a.leader, l = d;
	}
	return e.map((e, t) => ({
		width: o[t],
		leader: s[t]
	}));
}
function Ca(e, t) {
	if (e === t) return !0;
	if (e.enabled !== t.enabled) return !1;
	let n = (e, t) => {
		if (e.size !== t.size) return !1;
		for (let n of e) if (!t.has(n)) return !1;
		return !0;
	};
	return n(e.lineStartForbidden, t.lineStartForbidden) && n(e.lineEndForbidden, t.lineEndForbidden);
}
function wa(e) {
	for (let t of e.runs) if (t.type === "field") {
		let e = t.fieldType;
		if (e === "page" || e === "numPages" || e === "date" || e === "time") return !0;
	} else if (t.type === "text" && t.noteRef) return !0;
	return !1;
}
function Ta(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let t of e) {
		if (t.fitTextRegionIndex === void 0) continue;
		let e = r.get(t.fitTextRegionIndex) ?? [];
		e.push(t), r.set(t.fitTextRegionIndex, e);
	}
	for (let e of r.values()) {
		let r = e.find((e) => e.fitTextVal !== void 0);
		if (!r || r.fitTextVal === void 0) continue;
		let i = 0, a = 0;
		for (let t of e) i += n(t) * Ui(t), a += [...t.text].length;
		let o = Zr([{
			fitTextValTwips: r.fitTextVal,
			charCount: a,
			naturalWidthPx: i
		}], t)[0];
		o && e.forEach((t, n) => {
			t.fitTextPerGapPx = o.perGapPx, t.fitTextTrailingPadPx = n === e.length - 1 ? o.trailingPadPx : void 0, t.fitTextRegionStart = n === 0 ? !0 : void 0, t.fitTextRegionEnd = n === e.length - 1 ? !0 : void 0;
		});
	}
}
function Ea(e, t) {
	let n = [], r = (e) => e ? t.resolvedLocalFonts?.[Zt(e)] : void 0, i = /* @__PURE__ */ new Map(), a = [];
	for (let [t, n] of e.entries()) {
		if (n.type !== "text") {
			a.push({
				charCount: 0,
				naturalWidthPx: 0
			});
			continue;
		}
		let e = n.text.split("	");
		for (let r = 0; r < e.length; r += 1) i.set(`${t}:${r}`, a.length), a.push({
			fitTextValTwips: n.fitTextVal,
			fitTextId: n.fitTextId,
			charCount: [...e[r]].length,
			naturalWidthPx: 0,
			charScale: n.charScale
		}), r < e.length - 1 && a.push({
			charCount: 0,
			naturalWidthPx: 0
		});
	}
	let o = /* @__PURE__ */ new Map();
	Zr(a, 1).forEach((e, t) => {
		for (let n = e.start; n < e.end; n += 1) o.set(n, t);
	});
	let s = (e, a, s, c, l) => {
		let u = !1, d = a.ruby, f = d ? {
			text: d.text,
			fontSizePt: d.fontSizePt,
			...d.hpsRaisePt == null ? {} : { hpsRaisePt: d.hpsRaisePt }
		} : void 0, p = a.revision, m = a, h = m.rtl === !0 ? !0 : void 0, g = l === void 0 ? void 0 : i.get(`${c}:${l}`), _ = g === void 0 ? void 0 : o.get(g), v = m.hyperlink ? {
			kind: "external",
			url: m.hyperlink
		} : m.hyperlinkAnchor ? {
			kind: "internal",
			ref: m.hyperlinkAnchor
		} : void 0, y = m.rtl === !0 || m.cs === !0, b = m.fontSizeCs ?? a.fontSize, x = m.fontFamilyCs ?? a.fontFamily, S = m.boldCs ?? !1, C = m.italicCs ?? !1, w = a.fontFamilyEastAsia ?? a.fontFamily, T = (y || m.rtl === !0) && pa(m.langBidi, m.rtl === !0), E = !0, D = !1, O = (e, i, o) => {
			let c = i ? S : a.bold, l = i ? C : a.italic, d = r(o), y = r(w), x = !c && !l ? d?.family : void 0, O = !c && !l ? y?.family : void 0;
			n.push({
				text: e,
				bold: c,
				italic: l,
				underline: a.underline,
				underlineStyle: a.underlineStyle,
				underlineColor: a.underlineColor,
				strikethrough: a.strikethrough,
				fontSize: i ? b : a.fontSize,
				color: a.color,
				fontFamily: x ?? o,
				resolvedLineHeightRatio: d?.lineHeightRatio,
				vertAlign: s,
				measuredWidth: 0,
				smallCaps: u,
				joinPrev: D ? !0 : void 0,
				doubleStrikethrough: a.doubleStrikethrough ?? !1,
				highlight: a.highlight ?? null,
				emphasisMark: a.emphasisMark,
				background: a.background ?? null,
				colorAuto: m.colorAuto ?? !1,
				border: m.border ?? null,
				ruby: E ? f : void 0,
				revision: p,
				rtl: h,
				digitsAsAN: T ? !0 : void 0,
				eaFloorFamily: O ?? w,
				resolvedEaFloorLineHeightRatio: y?.lineHeightRatio,
				hyperlink: v,
				snapToCharacterGrid: m.snapToGrid !== !1,
				charSpacing: m.charSpacing,
				charScale: m.charScale,
				fitTextVal: _ === void 0 ? void 0 : m.fitTextVal,
				fitTextId: _ === void 0 ? void 0 : m.fitTextId,
				fitTextRegionIndex: _,
				fitTextRunIndex: _ === void 0 ? void 0 : g,
				position: m.position,
				kerning: m.kerning,
				tateChuYoko: t.verticalCJK && m.eastAsianVert === !0 ? !0 : void 0,
				tateChuYokoCompress: t.verticalCJK && m.eastAsianVert === !0 && m.eastAsianVertCompress === !0 ? !0 : void 0,
				verticalRun: t.verticalCJK && m.eastAsianVert !== !0 ? !0 : void 0
			}), E = !1, D = !1;
		}, k = (e, t) => {
			let n = t === "cs", r = t === "cs" ? x : t === "ea" ? w : a.fontFamily;
			if (je(r)) {
				for (let t of Pe(e, r)) O(t.text, n, t.mapped ? null : r);
				return;
			}
			O(e, n, r);
		}, A = (e) => {
			for (let t of ha(e)) k(t.text, t.ea ? "ea" : "latin");
		}, j = a.smallCaps ? ra(e) : [{
			text: e,
			reduced: !1
		}], M = "";
		for (let e of j) {
			u = e.reduced, D = M.length > 0 && !/\s$/.test(M), M = e.text;
			let t = a.allCaps || a.smallCaps ? e.text.toUpperCase() : e.text;
			for (let e of _a(t)) if (y) if (T) for (let t of ga(e)) k(t, "cs");
			else k(e, "cs");
			else for (let t of ma(e)) t.cs ? k(t.text, "cs") : A(t.text);
		}
	};
	for (let [i, a] of e.entries()) if (a.type === "text") {
		let e = a, r = e.noteRef ? e.noteRef.id ? t.noteNumbers?.get(`${e.noteRef.kind}:${e.noteRef.id}`) : t.currentNoteNumber : void 0;
		if (e.noteRef) {
			let t = r == null ? e.text || "" : String(r);
			t.length > 0 && s(t, e, e.vertAlign ?? "super", i, 0);
			continue;
		}
		let o = e.text.split("	");
		for (let t = 0; t < o.length; t++) o[t].length > 0 && s(o[t], e, e.vertAlign, i, t), t < o.length - 1 && n.push({
			isTab: !0,
			fontSize: e.fontSize,
			measuredWidth: 0,
			bold: e.bold,
			italic: e.italic
		});
	} else if (a.type === "image") {
		let e = a;
		n.push({
			imagePath: e.imagePath,
			mimeType: e.mimeType,
			widthPt: e.widthPt,
			heightPt: e.heightPt,
			rotation: e.rotation,
			flipH: e.flipH,
			flipV: e.flipV,
			anchor: e.anchor ?? !1,
			anchorXPt: e.anchorXPt ?? 0,
			anchorYPt: e.anchorYPt ?? 0,
			anchorXFromMargin: e.anchorXFromMargin ?? !1,
			anchorYFromPara: e.anchorYFromPara ?? !1,
			colorReplaceFrom: e.colorReplaceFrom,
			duotone: e.duotone,
			alpha: e.alpha,
			srcRect: e.srcRect ?? void 0,
			measuredWidth: 0
		});
	} else if (a.type === "chart") {
		let e = a;
		n.push({
			imagePath: "",
			mimeType: "",
			widthPt: e.widthPt,
			heightPt: e.heightPt,
			anchor: e.anchor ?? !1,
			anchorXPt: e.anchorXPt ?? 0,
			anchorYPt: e.anchorYPt ?? 0,
			anchorXFromMargin: e.anchorXFromMargin ?? !1,
			anchorYFromPara: e.anchorYFromPara ?? !1,
			chart: e.chart,
			measuredWidth: 0
		});
	} else if (a.type === "break") {
		if (a.breakType === "line") {
			let t = ia(e, e.indexOf(a));
			n.push({
				lineBreak: !0,
				fontSize: t,
				measuredWidth: 0
			});
		}
	} else if (a.type === "field") {
		let e = a, n = aa(e, t);
		n && s(n, e, e.vertAlign, i);
	} else if (a.type === "math") {
		let t = a.fontSize || ia(e, e.indexOf(a));
		n.push({
			mathNodes: a.nodes,
			display: a.display,
			fontSize: t,
			color: null,
			fallbackText: $(a.nodes),
			measuredWidth: 0,
			mathAscent: 0,
			mathDescent: 0,
			jc: a.jc
		});
	} else if (a.type === "ptab") n.push({
		isTab: !0,
		fontSize: a.fontSize || ia(e, e.indexOf(a)),
		measuredWidth: 0,
		leader: a.leader,
		ptab: {
			alignment: a.alignment,
			relativeTo: a.relativeTo
		}
	});
	else if (a.type === "anchorHost") {
		let e = a.fontFamilyEastAsia != null, t = a.bold ?? !1, i = a.italic ?? !1, o = a.fontFamilyEastAsia ?? a.fontFamily ?? null, s = r(o), c = r(a.fontFamilyEastAsia ?? null), l = !t && !i;
		n.push({
			text: "",
			metricOnly: !0,
			...e ? { metricEastAsian: !0 } : {},
			bold: t,
			italic: i,
			underline: !1,
			strikethrough: !1,
			fontSize: a.fontSize,
			color: null,
			fontFamily: (l ? s?.family : void 0) ?? o,
			resolvedLineHeightRatio: s?.lineHeightRatio,
			vertAlign: null,
			measuredWidth: 0,
			eaFloorFamily: (l ? c?.family : void 0) ?? a.fontFamilyEastAsia ?? null,
			resolvedEaFloorLineHeightRatio: c?.lineHeightRatio,
			snapToCharacterGrid: !1
		});
	}
	for (let e = 1; e < n.length; e++) {
		let t = n[e];
		if (!("text" in t) || t.joinPrev) continue;
		let r = t.text.codePointAt(0);
		if (r === void 0 || !v.lineStartForbidden.has(r)) continue;
		let i = n[e - 1];
		!("text" in i) || /\s$/.test(i.text) || (t.joinPrev = !0);
	}
	for (let e = 1; e < n.length; e++) {
		let t = n[e];
		if (!("text" in t) || t.joinPrev || t.text.length === 0) continue;
		let r = n[e - 1];
		if (!("text" in r) || r.text.length === 0 || /\s$/u.test(r.text) || /^\s/u.test(t.text)) continue;
		let i = [...r.text].at(-1), a = [...t.text][0], o = i?.codePointAt(0), s = a?.codePointAt(0);
		o === void 0 || s === void 0 || o === 8203 || s === 8203 || xe(r.text) || xe(t.text) || ca(r.text) || ca(t.text) || b(o, s) && (t.joinPrev = !0);
	}
	let c = /* @__PURE__ */ new Set();
	for (let e of n) !("text" in e) || e.fitTextRegionIndex === void 0 || (c.has(e.fitTextRegionIndex) ? e.joinPrev = !0 : (e.fitTextRegionStart = !0, c.add(e.fitTextRegionIndex)));
	return n;
}
function Da(e, t, n, r, s, c = [], l, u = {}, d = 0, p = v, m = 0, h = 36, g = n, _ = !1, y = !1, b = !1, x) {
	let S = [], C = [], T = 0, E = 0, D = 0, O = 0, A = 0, j = 0, M = 0, N = 0, P = 0, F = 0, I = 0, L = !1, R = !0, z = n, B = 0, V = l?.startPageY ?? 0, ee = () => Bn(s), H = t.length > 0 && t.every((e) => "text" in e && e.metricOnly === !0 || "imagePath" in e && !!e.anchor), U = (e = 0) => {
		if (D = 0, B = 0, z = n, !l) return;
		let t = 10 * s;
		if (l.lineWindow) {
			let r = l.lineWindow({
				topYPt: V,
				minimumStartWidthPt: e,
				probeHeightPt: t,
				paragraphXPt: l.paraX,
				maximumWidthPt: n,
				columnXPt: l.columnXPt,
				columnWidthPt: l.columnWidthPt
			});
			V = r.topYPt, B = r.xOffsetPt, z = r.maximumWidthPt;
		} else {
			let r = Gn(V, e, t, l.paraX, n, l.floats, l.columnXPt, l.columnXPt + l.columnWidthPt);
			V = r.topY, B = r.xOffset, z = r.maxWidth;
		}
	}, W = () => z - (R ? r : 0), te = _ ? c.map((e) => ({
		pos: e.pos * s,
		alignment: e.alignment,
		leader: e.leader
	})) : [], ne = h * s, G = () => {
		if (!_ || !C.some((e) => "isTab" in e)) return;
		let e = Sa(C.map((e) => ({
			isTab: "isTab" in e,
			width: e.measuredWidth
		})), te, g - (B + z) + (R ? r : 0), g + d, ne), t = 0;
		for (let n = 0; n < C.length; n++) {
			let r = C[n];
			"isTab" in r && (t += e[n].width - r.measuredWidth, r.measuredWidth = e[n].width, r.leader = e[n].leader);
		}
		T += t;
	}, K = !1, re = !1, q = !1, J = (e, t = !1, n) => {
		G();
		let r = e === void 0 ? O || 10 : Math.max(O, e), i = A > 0 || j > 0, a = i ? A : r * s * .8, o = i ? j : r * s * .2, c = L ? P : a, u = L ? F : o, d = L ? I : M, f = N || (re ? Yi(M, r * s) : a + o);
		S.push({
			segments: C,
			height: r,
			ascent: a,
			descent: o,
			visibleAscent: c,
			visibleDescent: u,
			visibleIntendedSingle: d,
			intendedSingle: M,
			gridCountSingle: f,
			xOffset: B,
			availWidth: z,
			topY: l ? V : void 0,
			hasRuby: K,
			eastAsian: re,
			endsWithBreak: t,
			consumedEnd: n ?? Q[0]?.src ?? de
		}), l && (V += l.lineBoxH(a, o, K, M, re, f)), C = [], T = 0, E = 0, D = 0, O = 0, A = 0, j = 0, M = 0, N = 0, P = 0, F = 0, I = 0, L = !1, K = !1, re = !1, q = !1, R = !1, U(ee());
	}, Y = (e, t = e.text) => on(e.fontFamily) * ji(e, s) * Ui(e) * [...t].length, X = (e, t, n, r, a, o = 0) => {
		C.push(e), T += t, E += o, "text" in e && (D += Y(e)), n > O && (O = n), r > A && (A = r), a > j && (j = a);
		let c = !("text" in e) || e.metricOnly !== !0;
		c && (L = !0, r > P && (P = r), a > F && (F = a));
		let l = 0;
		if (!("isTab" in e) && !("imagePath" in e) && !("mathNodes" in e)) {
			let t = e;
			t.ruby && (K = !0), t.seaBreaks !== void 0 && i(t.text) && (q = !0);
			let n = t.metricEastAsian === !0 || Li.test(t.text);
			!re && n && (re = !0);
			let r = t.smallCaps && !t.vertAlign ? t.fontSize * s : ae(t), a = n && !t.ruby, o = Mi(t, r, a);
			o > M && (M = o), c && o > I && (I = o), a && (l = Yi(o, r));
		} else "isTab" in e || (l = r + a);
		l > N && (N = l);
	}, ae = (e) => ji(e, s), Z = null, oe = (t) => {
		t !== Z && (e.font = t, Z = t);
	}, se = (t) => {
		if (t.kerning == null) return null;
		let n = e.fontKerning;
		return e.fontKerning = t.fontSize >= t.kerning ? "normal" : "none", n;
	}, ce = (t) => {
		t != null && (e.fontKerning = t);
	}, le = (t) => {
		oe(Ai(t.bold, t.italic, ae(t), t.fontFamily, u));
		let n = se(t), r = e.measureText(t.text);
		return ce(n), r;
	}, ue = (t, n) => {
		if (!t.verticalRun) return 0;
		let r = se(t);
		try {
			return li(e, n);
		} finally {
			ce(r);
		}
	}, de = {
		segIndex: t.length,
		charOffset: 0
	}, fe = t.map((e, t) => (e.src = {
		segIndex: t,
		charOffset: 0
	}, "text" in e && xe(e.text) && (e.seaBreaks = ie(e.text, {
		cjk: !0,
		kinsoku: p
	})), e)), Q;
	if (!x) Q = fe;
	else if (x.segIndex >= fe.length) Q = [];
	else {
		let e = fe[x.segIndex];
		if (x.charOffset > 0) if (!("text" in e) || x.charOffset > e.text.length) Q = [];
		else {
			let t = e.text.slice(x.charOffset);
			Q = t ? [{
				...e,
				text: t,
				measuredWidth: 0,
				src: { ...x },
				seaBreaks: la(e.seaBreaks, x.charOffset)
			}, ...fe.slice(x.segIndex + 1)] : fe.slice(x.segIndex + 1);
		}
		else Q = fe.slice(x.segIndex);
	}
	Ta(Q.filter((e) => "text" in e), s, (e) => le(e).width + ue(e, e.text));
	let pe = (e) => Ki(e, le(e).width + ue(e, e.text), m, s), me = (t, n) => {
		oe(Ai(t.bold, t.italic, ae(t), t.fontFamily, u));
		let r = se(t), i = e.measureText(n).width;
		return ce(r), Ki({
			...t,
			text: n
		}, i + ue(t, n), m, s);
	}, he = (e) => "isTab" in e ? e.measuredWidth || 0 : "imagePath" in e ? e.widthPt * s : "mathNodes" in e ? e.measuredWidth || 0 : "lineBreak" in e ? 0 : pe(e), ge = null;
	for (U(H ? l?.paragraphMarkLineStartWidth ?? ee() : ee()); Q.length > 0;) {
		let t = Q.shift();
		if ("lineBreak" in t) {
			J(t.fontSize, !0), ge = t.fontSize;
			continue;
		}
		if (ge = null, "isTab" in t) {
			if (_ && !t.ptab) {
				t.measuredWidth = 0, X(t, 0, t.fontSize, t.fontSize * s * .8, t.fontSize * s * .2);
				continue;
			}
			let e = T + (R ? r : 0);
			if (t.ptab) {
				let r = t.ptab.relativeTo === "indent" ? 0 : -d, i = t.ptab.relativeTo === "indent" ? n : g, a = t.ptab.alignment === "left" ? r : t.ptab.alignment === "center" ? (r + i) / 2 : i, o = 0;
				for (let e of Q) {
					if ("isTab" in e || "lineBreak" in e) break;
					o += he(e);
				}
				let c = t.ptab.alignment === "center" ? .5 : +(t.ptab.alignment === "right"), l = a - e - o * c;
				if (l <= 0) {
					if (C.length > 0) {
						J(void 0, !1, t.src), Q.unshift(t);
						continue;
					}
					l = 0;
				}
				if (t.measuredWidth = l, X(t, l, t.fontSize, t.fontSize * s * .8, t.fontSize * s * .2), t.ptab.alignment !== "left") for (; Q.length > 0;) {
					let e = Q[0];
					if ("isTab" in e || "lineBreak" in e) break;
					if (Q.shift(), "imagePath" in e) {
						let t = e.widthPt * s;
						e.measuredWidth = t, X(e, t, e.heightPt, e.heightPt * s, 0);
					} else if ("mathNodes" in e) X(e, e.measuredWidth || 0, e.fontSize, e.mathAscent || 0, e.mathDescent || 0);
					else {
						let t = le(e), n = Ki(e, t.width + ue(e, e.text), m, s);
						e.measuredWidth = n;
						let r = t.fontBoundingBoxAscent ?? t.actualBoundingBoxAscent ?? e.fontSize * s * .8, i = t.fontBoundingBoxDescent ?? t.actualBoundingBoxDescent ?? e.fontSize * s * .2;
						X(e, n, e.fontSize, r, i);
					}
				}
				continue;
			}
			let i = ba(e + d, c.map((e) => ({
				pos: e.pos * s,
				alignment: e.alignment,
				leader: e.leader
			})), h * s), a = i ? i.pos - d : e;
			if (i && i.alignment !== "left" && i.alignment !== "bar" && i.alignment !== "clear") {
				let n = a;
				t.leader = i.leader;
				let r = 0;
				for (let e of Q) {
					if ("isTab" in e || "lineBreak" in e) break;
					r += he(e);
				}
				let o = i.alignment === "center" ? .5 : 1, c = n - e - r * o;
				for (c <= 0 && (c = t.fontSize * s * .25), t.measuredWidth = c, X(t, c, t.fontSize, t.fontSize * s * .8, t.fontSize * s * .2); Q.length > 0;) {
					let e = Q[0];
					if ("isTab" in e || "lineBreak" in e) break;
					if (Q.shift(), "imagePath" in e) {
						let t = e.widthPt * s;
						e.measuredWidth = t, X(e, t, e.heightPt, e.heightPt * s, 0);
					} else if ("mathNodes" in e) X(e, e.measuredWidth || 0, e.fontSize, e.mathAscent || 0, e.mathDescent || 0);
					else {
						let t = le(e), n = Ki(e, t.width + ue(e, e.text), m, s);
						e.measuredWidth = n;
						let r = t.fontBoundingBoxAscent ?? t.actualBoundingBoxAscent ?? e.fontSize * s * .8, i = t.fontBoundingBoxDescent ?? t.actualBoundingBoxDescent ?? e.fontSize * s * .2;
						X(e, n, e.fontSize, r, i);
					}
				}
				continue;
			}
			let o = a - e;
			if (i && (t.leader = i.leader), o <= 0) {
				J(void 0, !1, t.src), Q.unshift(t);
				continue;
			}
			if (T + o > W() && C.length > 0) {
				J(void 0, !1, t.src), Q.unshift(t);
				continue;
			}
			t.measuredWidth = o, X(t, o, t.fontSize, t.fontSize * s * .8, t.fontSize * s * .2);
			continue;
		}
		if ("imagePath" in t) {
			if (t.anchor) {
				t.measuredWidth = 0;
				continue;
			}
			let e = t.widthPt * s, n = t.heightPt, r = t.heightPt * s;
			t.measuredWidth = e, C.length > 0 && T + e > W() && J(void 0, !1, t.src), X(t, e, n, r, 0);
			continue;
		}
		if ("mathNodes" in t) {
			let n = _i.get(t.mathNodes);
			if (!n) {
				let n = t.fontSize * s;
				oe(Ai(!1, !1, n, null, u));
				let r = e.measureText(t.fallbackText), i = r.width, a = r.fontBoundingBoxAscent ?? r.actualBoundingBoxAscent ?? n * .8, o = r.fontBoundingBoxDescent ?? r.actualBoundingBoxDescent ?? n * .2;
				t.measuredWidth = i, t.mathAscent = a, t.mathDescent = o, C.length > 0 && T + i > W() && J(void 0, !1, t.src), X(t, i, t.fontSize, Math.max(a, n * .8), Math.max(o, n * .2));
				continue;
			}
			let r = t.fontSize * s, i = n.widthEm * r, a = n.ascentEm * r, o = n.descentEm * r;
			t.measuredWidth = i, t.mathAscent = a, t.mathDescent = o;
			let c = Math.max(a, r * .8), l = Math.max(o, r * .2);
			C.length > 0 && T + i > W() && J(void 0, !1, t.src), X(t, i, t.fontSize, c, l);
			continue;
		}
		let l = t, x = le(l), S = Ki(l, x.width + ue(l, l.text), m, s), O = l.fontSize, A = l.fontSize * s, j = x, M = ae(l);
		if (l.smallCaps && !l.vertAlign && M !== A) {
			let t = e.font;
			e.font = Ai(l.bold, l.italic, A, l.fontFamily, u), j = e.measureText(l.text || "X"), e.font = t, M = A;
		}
		let N = Qi(j, l.fontFamily, A, M, (l.metricEastAsian === !0 || Li.test(l.text)) && !l.ruby), P = N.ascent, F = N.descent;
		if (l.ruby && (P += gi(l.ruby.fontSizePt, l.ruby.hpsRaisePt, s)), l.fitTextRegionIndex !== void 0) {
			if (l.fitTextRegionStart) {
				let e = S;
				for (let t of Q) {
					if (!("text" in t) || t.fitTextRegionIndex !== l.fitTextRegionIndex) break;
					e += pe(t);
				}
				C.length > 0 && T + e > W() && J(void 0, !1, l.src);
			}
			l.measuredWidth = S, X(l, S, O, P, F);
			continue;
		}
		let I = l.text.replace(/ +$/, ""), L = l.text.endsWith(" ") ? S - me(l, I) : 0, B = S - L, V = l.seaBreaks !== void 0 && i(l.text), ee = (e, t) => {
			let n = e === void 0 || "lineBreak" in e;
			return y && (!n || b) ? t : q || V ? 0 : E * va;
		}, H = ee(Q[0], D + Y(l, I));
		if (!l.joinPrev && C.length > 0 && Q[0]?.joinPrev && !ca(l.text) && !(l.seaBreaks && l.seaBreaks.length > 0)) {
			let e = S, t = L, n = 0, r = D, i = l, a = l.text, o = (e, t = e.text) => {
				r += Y(i, a), i = e, a = t;
			};
			for (; n < Q.length && Q[n].joinPrev; n++) {
				let r = Q[n];
				if (ca(r.text)) {
					let n = [...r.text], i = 0;
					for (; i < n.length && v.lineStartForbidden.has(n[i].codePointAt(0));) i++;
					if (i < n.length) {
						let a = n.slice(0, i).join("");
						e += me(r, a), a.length > 0 && o(r, a), t = 0;
						break;
					}
				}
				let i = pe(r);
				e += i, o(r);
				let a = r.text.replace(/ +$/, "");
				t = r.text.endsWith(" ") ? i - me(r, a) : 0;
			}
			r += Y(i, a.replace(/ +$/, "")), T + (e - t) > W() + ee(Q[n], r) && J(void 0, !1, l.src);
		}
		if (V && C.length > 0 && (() => {
			let e = C[C.length - 1];
			return !("text" in e) || e.text.endsWith(" ");
		})()) {
			let e = S, t = L, n = 0, r = D + Y(l, I);
			if (!l.text.endsWith(" ")) for (; n < Q.length; n++) {
				let a = Q[n];
				if (!("text" in a) || a.seaBreaks === void 0 || !i(a.text)) break;
				let o = a, s = pe(o), c = o.text.replace(/ +$/, "");
				if (e += s, t = o.text.endsWith(" ") ? s - me(o, c) : 0, r += Y(o, c), o.text.endsWith(" ")) {
					n++;
					break;
				}
			}
			let a = e - t;
			T + a > W() + ee(Q[n], r) && a <= z && J(void 0, !1, l.src);
		}
		if (T + B <= W() + H) l.measuredWidth = S, X(l, S, O, P, F, L);
		else if (ca(l.text) && l.seaBreaks === void 0) {
			let t = W() - T;
			oe(Ai(l.bold, l.italic, ae(l), l.fontFamily, u));
			let n = se(l), r = "";
			try {
				r = t > 0 ? da(e, l.text, t, Vi(l, m), Ui(l), Hi(l, s), l.verticalRun === !0) : "";
			} finally {
				ce(n);
			}
			let i = [...l.text], a = [...r].length, c = ua(i, f(i, a, p, C.length > 0 ? 0 : 1)), d = i.slice(0, c).join("");
			if (d.length > 0) {
				let e = me(l, d);
				X({
					...l,
					text: d,
					measuredWidth: e
				}, e, O, P, F);
				let t = l.text.slice(d.length);
				t && Q.unshift({
					...l,
					text: t,
					measuredWidth: 0,
					src: {
						segIndex: l.src.segIndex,
						charOffset: l.src.charOffset + d.length
					}
				});
			} else if (C.length > 0) {
				let e = null, t = l.text.codePointAt(0), n = C[C.length - 1];
				if (t !== void 0 && p.lineStartForbidden.has(t) && "text" in n) {
					let t = n, r = [...t.text], i = o(r, p, C.length > 1 ? 0 : 1);
					if (i > 0) {
						let n = r.slice(0, r.length - i).join(""), a = r.slice(r.length - i).join("");
						if (e = {
							...t,
							text: a,
							measuredWidth: me(t, a),
							src: {
								segIndex: t.src.segIndex,
								charOffset: t.src.charOffset + n.length
							}
						}, n) {
							let e = me(t, n);
							T -= t.measuredWidth - e, C[C.length - 1] = {
								...t,
								text: n,
								measuredWidth: e
							};
						} else T -= t.measuredWidth, C.pop();
					}
				}
				J(void 0, !1, e?.src ?? l.src), Q.unshift(l), e && Q.unshift(e);
			} else {
				let e = [...l.text], t = e.length > 0 ? ua(e, 1) : 0, n = e.slice(0, t).join("");
				if (n) {
					let e = me(l, n);
					X({
						...l,
						text: n,
						measuredWidth: e
					}, e, O, P, F);
					let t = l.text.slice(n.length);
					t && Q.unshift({
						...l,
						text: t,
						measuredWidth: 0,
						src: {
							segIndex: l.src.segIndex,
							charOffset: l.src.charOffset + n.length
						}
					});
				}
			}
		} else if (l.seaBreaks !== void 0) {
			let e = W() - T, t = (e) => me(l, e), n = w(l.text), r = k(l.text, l.seaBreaks, 0, e, t, n);
			if (r > 0) {
				let e = l.text.slice(0, r), t = me(l, e);
				X({
					...l,
					text: e,
					measuredWidth: t
				}, t, O, P, F);
				let n = l.text.slice(r);
				n && Q.unshift({
					...l,
					text: n,
					measuredWidth: 0,
					src: {
						segIndex: l.src.segIndex,
						charOffset: l.src.charOffset + r
					},
					seaBreaks: la(l.seaBreaks, r)
				});
			} else if (C.length > 0) {
				let e = null, t = l.text.codePointAt(0), n = C[C.length - 1];
				if (t !== void 0 && p.lineStartForbidden.has(t) && "text" in n) {
					let t = n, r = [...t.text], i = o(r, p, C.length > 1 ? 0 : 1);
					if (i > 0) {
						let n = r.slice(0, r.length - i).join(""), a = r.slice(r.length - i).join("");
						if (e = {
							...t,
							text: a,
							measuredWidth: me(t, a),
							src: {
								segIndex: t.src.segIndex,
								charOffset: t.src.charOffset + n.length
							},
							seaBreaks: la(t.seaBreaks, n.length)
						}, n) {
							let e = me(t, n);
							T -= t.measuredWidth - e, C[C.length - 1] = {
								...t,
								text: n,
								measuredWidth: e
							};
						} else T -= t.measuredWidth, C.pop();
					}
				}
				J(void 0, !1, e?.src ?? l.src), Q.unshift(l), e && Q.unshift(e);
			} else {
				let r = l.seaBreaks[0] ?? l.text.length, i = l.text.slice(0, r), o = a(i), s = k(i, o, 0, e, t, n);
				s <= 0 && (s = o.length > 0 ? o[0] : i.length);
				let c = l.text.slice(0, s), u = me(l, c);
				X({
					...l,
					text: c,
					measuredWidth: u
				}, u, O, P, F);
				let d = l.text.slice(s);
				d && Q.unshift({
					...l,
					text: d,
					measuredWidth: 0,
					src: {
						segIndex: l.src.segIndex,
						charOffset: l.src.charOffset + s
					},
					seaBreaks: la(l.seaBreaks, s)
				});
			}
		} else if (C.length === 0) {
			let t = W();
			oe(Ai(l.bold, l.italic, ae(l), l.fontFamily, u));
			let n = [...l.text], r = se(l), i = 0;
			try {
				i = t > 0 ? [...da(e, l.text, t, Vi(l, m), Ui(l), Hi(l, s), l.verticalRun === !0)].length : 0;
			} finally {
				ce(r);
			}
			if (i < 1 && (i = 1), i = ua(n, i), i >= n.length) l.measuredWidth = S, X(l, S, O, P, F);
			else {
				let e = n.slice(0, i).join(""), t = me(l, e);
				X({
					...l,
					text: e,
					measuredWidth: t
				}, t, O, P, F), Q.unshift({
					...l,
					text: n.slice(i).join(""),
					measuredWidth: 0,
					src: {
						segIndex: l.src.segIndex,
						charOffset: l.src.charOffset + e.length
					}
				});
			}
		} else J(void 0, !1, l.src), Q.unshift(l);
	}
	return C.length > 0 ? J() : ge !== null && J(ge), S;
}
function Oa(e, t, n, r, i, a = !1) {
	if (t === 1) return e;
	if (a) return e.map((e) => ({
		...e,
		segments: e.segments.map((e) => "imagePath" in e ? e.anchor ? {
			...e,
			measuredWidth: 0
		} : {
			...e,
			measuredWidth: e.widthPt * t
		} : "mathNodes" in e ? {
			...e,
			measuredWidth: e.measuredWidth * t,
			mathAscent: e.mathAscent * t,
			mathDescent: e.mathDescent * t
		} : "text" in e ? {
			...e,
			measuredWidth: e.measuredWidth * t,
			fitTextPerGapPx: e.fitTextPerGapPx === void 0 ? void 0 : e.fitTextPerGapPx * t,
			fitTextTrailingPadPx: e.fitTextTrailingPadPx === void 0 ? void 0 : e.fitTextTrailingPadPx * t
		} : {
			...e,
			measuredWidth: e.measuredWidth * t
		}),
		ascent: e.ascent * t,
		descent: e.descent * t,
		visibleAscent: (e.visibleAscent ?? e.ascent) * t,
		visibleDescent: (e.visibleDescent ?? e.descent) * t,
		visibleIntendedSingle: (e.visibleIntendedSingle ?? e.intendedSingle) * t,
		intendedSingle: e.intendedSingle * t,
		gridCountSingle: e.gridCountSingle * t,
		xOffset: e.xOffset * t,
		availWidth: e.availWidth * t,
		topY: e.topY === void 0 ? void 0 : e.topY * t
	}));
	let o = (e, t) => {
		if (e.kerning == null) return t();
		let r = n.fontKerning;
		n.fontKerning = e.fontSize >= e.kerning ? "normal" : "none";
		try {
			return t();
		} finally {
			n.fontKerning = r;
		}
	}, s = (e, t) => o(e, () => n.measureText(t).width + (e.verticalRun ? li(n, t) : 0)), c = (e) => {
		let a = ji(e, t);
		n.font = Ai(e.bold, e.italic, a, e.fontFamily, r);
		let c = o(e, () => n.measureText(e.text)), l = Ki(e, s(e, e.text), i, t), u = e.fontSize * t, d = c, f = a;
		e.smallCaps && !e.vertAlign && f !== u && (n.font = Ai(e.bold, e.italic, u, e.fontFamily, r), d = n.measureText(e.text || "X"), f = u);
		let p = (e.metricEastAsian === !0 || Li.test(e.text)) && !e.ruby, m = Qi(d, e.fontFamily, u, f, p), h = e.ruby ? m.ascent + gi(e.ruby.fontSizePt, e.ruby.hpsRaisePt, t) : m.ascent, g = e.smallCaps && !e.vertAlign ? u : a, _ = Mi(e, g, p);
		return {
			advance: l,
			asc: h,
			desc: m.descent,
			intended: _,
			gridCount: p ? Yi(_, g) : 0
		};
	};
	return e.map((e) => {
		let i = 0, a = 0, o = 0, l = 0, u = !1, d = 0, f = 0, p = 0, m = !1, h = e.segments.map((e) => ({ ...e }));
		Ta(h.filter((e) => "text" in e), t, (e) => {
			let i = ji(e, t);
			return n.font = Ai(e.bold, e.italic, i, e.fontFamily, r), s(e, e.text);
		});
		let g = h.map((e) => {
			if ("isTab" in e) return {
				...e,
				measuredWidth: e.measuredWidth * t
			};
			if ("imagePath" in e) {
				if (e.anchor) return {
					...e,
					measuredWidth: 0
				};
				let n = e.heightPt * t;
				return i = Math.max(i, n), l = Math.max(l, n), d = Math.max(d, n), m = !0, {
					...e,
					measuredWidth: e.widthPt * t
				};
			}
			if ("mathNodes" in e) {
				let n = {
					...e,
					measuredWidth: e.measuredWidth * t
				};
				return n.mathAscent *= t, n.mathDescent *= t, i = Math.max(i, n.mathAscent, e.fontSize * t * .8), a = Math.max(a, n.mathDescent, e.fontSize * t * .2), l = Math.max(l, n.mathAscent + n.mathDescent), d = Math.max(d, n.mathAscent, e.fontSize * t * .8), f = Math.max(f, n.mathDescent, e.fontSize * t * .2), m = !0, n;
			}
			let n = e, r = c(n);
			return u = !0, r.asc > i && (i = r.asc), r.desc > a && (a = r.desc), r.intended > o && (o = r.intended), n.metricOnly !== !0 && (d = Math.max(d, r.asc), f = Math.max(f, r.desc), p = Math.max(p, r.intended), m = !0), l = Math.max(l, r.gridCount), {
				...n,
				measuredWidth: r.advance
			};
		});
		return !u && i === 0 && a === 0 && (i = e.ascent * t, a = e.descent * t, o = e.intendedSingle * t, l = e.gridCountSingle * t), {
			...e,
			segments: g,
			ascent: i,
			descent: a,
			visibleAscent: m ? d : (e.visibleAscent ?? e.ascent) * t,
			visibleDescent: m ? f : (e.visibleDescent ?? e.descent) * t,
			visibleIntendedSingle: m ? p : (e.visibleIntendedSingle ?? e.intendedSingle) * t,
			intendedSingle: o,
			gridCountSingle: l || i + a,
			xOffset: e.xOffset * t,
			availWidth: e.availWidth * t,
			topY: e.topY === void 0 ? void 0 : e.topY * t
		};
	});
}
function ka(e) {
	return {
		type: "text",
		text: e.text,
		bold: e.bold ?? !1,
		italic: e.italic ?? !1,
		underline: !1,
		strikethrough: !1,
		fontSize: e.fontSizePt,
		color: e.color ?? null,
		fontFamily: e.fontFamily ?? null,
		fontFamilyEastAsia: e.fontFamilyEastAsia ?? null,
		isLink: !1,
		background: null,
		vertAlign: null,
		hyperlink: null,
		ruby: e.ruby ?? void 0
	};
}
function Aa(e, t, n, r) {
	return {
		ctx: e,
		scale: t,
		fontFamilyClasses: n,
		images: r,
		kinsoku: v,
		defaultTabPt: 36
	};
}
//#endregion
//#region packages/docx/src/layout-context.ts
function ja(e) {
	return {
		story: e.story,
		containers: [...e.containers, { kind: "tableCell" }],
		lineNumberingEligible: !1
	};
}
function Ma(e) {
	return e.runs.some((e) => e.type === "text" && !!e.ruby);
}
function Na(e) {
	return e.runs.some((e) => e.type === "text" && Li.test(e.text));
}
function Pa(e) {
	for (let t of e) {
		if (t.type === "paragraph") {
			if (Na(t)) return !0;
			continue;
		}
		if (t.type === "table") {
			for (let e of t.rows) for (let t of e.cells) if (Pa(t.content)) return !0;
		}
	}
	return !1;
}
function Fa(e) {
	return {
		kinsoku: E(e.settings),
		defaultTabPt: ya(e.settings),
		characterSpacingControl: e.settings?.characterSpacingControl,
		mathDefJc: e.settings?.mathDefJc,
		documentHasEastAsianText: Pa(e.body),
		compat: {
			adjustLineHeightInTable: e.settings?.adjustLineHeightInTable ?? !1,
			useFeLayout: e.settings?.useFeLayout ?? !1,
			balanceSingleByteDoubleByteWidth: e.settings?.balanceSingleByteDoubleByteWidth ?? !1
		}
	};
}
function Ia(e) {
	let t = e.pageWidth - e.marginLeft - e.marginRight, n = e.columns;
	if (!n || n.count <= 1) return [{
		xPt: e.marginLeft,
		wPt: Math.max(1, t)
	}];
	if (!n.equalWidth && n.cols.length > 0) {
		let t = [], r = e.marginLeft;
		for (let e of n.cols) t.push({
			xPt: r,
			wPt: Math.max(1, e.widthPt)
		}), r += e.widthPt + e.spacePt;
		return t;
	}
	let r = Math.max(1, (t - (n.count - 1) * n.spacePt) / n.count);
	return Array.from({ length: n.count }, (t, i) => ({
		xPt: e.marginLeft + i * (r + n.spacePt),
		wPt: r
	}));
}
function La(e) {
	switch (e) {
		case "lines":
		case "linesAndChars":
		case "snapToChars": return e;
		default: return "none";
	}
}
function Ra(e) {
	return e === "lines" || e === "linesAndChars" || e === "snapToChars";
}
function za(e) {
	return e === "linesAndChars" || e === "snapToChars";
}
function Ba(e, t) {
	return {
		geometry: {
			pageWidth: t.pageWidth,
			pageHeight: t.pageHeight,
			marginTop: t.marginTop,
			marginRight: t.marginRight,
			marginBottom: t.marginBottom,
			marginLeft: t.marginLeft,
			headerDistance: t.headerDistance,
			footerDistance: t.footerDistance
		},
		columns: Ia(t),
		grid: {
			kind: La(t.docGridType),
			linePitchPt: t.docGridLinePitch ?? null,
			charSpacePt: t.docGridCharSpace == null ? null : t.docGridCharSpace / 4096
		},
		textDirection: t.textDirection ?? "lrTb",
		verticalAlignment: t.vAlign ?? "top",
		lineNumbering: t.lineNumbering ?? void 0
	};
}
function Va(e) {
	return {
		type: e.grid.kind === "none" ? null : e.grid.kind,
		linePitchPt: e.grid.linePitchPt,
		charSpacePt: e.grid.charSpacePt
	};
}
function Ha(e) {
	return e.containers.some((e) => e.kind === "tableCell");
}
function Ua(e, t, n, r) {
	let i = Ra(t.grid.kind) && t.grid.linePitchPt != null && t.grid.linePitchPt > 0 && r.snapToGrid !== !1 && r.lineSpacing?.rule !== "exact" && (!Ha(n) || e.compat.adjustLineHeightInTable), a = za(t.grid.kind) && t.grid.charSpacePt != null, o = r.bidi === !0, s = r.numbering, c = s != null && (s.text !== "" || s.picBulletImagePath != null), l = o && c && (s.suff || "tab") === "tab" && r.indentFirst < 0;
	return {
		lineGrid: {
			active: i,
			pitchPt: i ? t.grid.linePitchPt : null
		},
		characterGrid: {
			active: a,
			deltaPt: a ? t.grid.charSpacePt ?? 0 : 0
		},
		physicalIndentLeftPt: o ? r.indentRight : r.indentLeft,
		physicalIndentRightPt: o ? r.indentLeft : r.indentRight,
		firstIndentPt: l ? 0 : r.indentFirst,
		lineSpacing: r.lineSpacing,
		spaceBeforePt: r.spaceBefore,
		spaceAfterPt: r.spaceAfter,
		baseRtl: o,
		isJustified: Ln(r.alignment),
		stretchLastLine: Rn(r.alignment),
		tabStops: [...r.tabStops],
		hasRuby: Ma(r),
		hasEastAsianText: Na(r),
		kinsoku: e.kinsoku,
		defaultTabPt: e.defaultTabPt
	};
}
//#endregion
//#region packages/docx/src/emphasis-mark.ts
function Wa(e, t, n, r) {
	let i = [...e], a = [], o = "";
	for (let e = 0; e < i.length; e++) {
		let s = i[e], c = n + t(o) + e * r, l = o + s, u = n + t(l) + (e + 1) * r;
		o = l, /\s/u.test(s) || a.push({ centerX: (c + u) / 2 });
	}
	return a;
}
function Ga(e, t) {
	let n = t * .07;
	switch (e) {
		case "circle": return {
			shape: "circle",
			radius: n,
			above: !0
		};
		case "comma": return {
			shape: "comma",
			radius: n,
			above: !0
		};
		case "underDot": return {
			shape: "dot",
			radius: n,
			above: !1
		};
		default: return {
			shape: "dot",
			radius: n,
			above: !0
		};
	}
}
//#endregion
//#region packages/docx/src/paragraph-measure.ts
function Ka(e) {
	let t = [...e];
	return {
		lineWindow: ({ topYPt: e, minimumStartWidthPt: n, probeHeightPt: r, paragraphXPt: i, maximumWidthPt: a, columnXPt: o, columnWidthPt: s }) => {
			let c = Gn(e, n, r, i, a, t, o, o + s);
			return {
				topYPt: c.topY,
				xOffsetPt: c.xOffset,
				maximumWidthPt: c.maxWidth
			};
		},
		skipTopAndBottomBands: ({ yPt: e, columnXPt: n, columnWidthPt: r }) => qn(e, t, n, n + r)
	};
}
function qa(e) {
	return {
		type: e.lineGrid.active ? "lines" : null,
		linePitchPt: e.lineGrid.active ? e.lineGrid.pitchPt : null,
		charSpacePt: e.characterGrid.active ? e.characterGrid.deltaPt : null
	};
}
function Ja(e, t) {
	if (!qi(t)) return e;
	let n = t.linePitchPt;
	return n <= 0 ? e : e <= n ? n : Math.ceil(e / n) * n;
}
function Ya(e, t, n, r, i, a) {
	let o = qa(t), s = Math.max(1, n.availableWidthPt - t.physicalIndentLeftPt - t.physicalIndentRightPt), c = n.paragraphXPt + t.physicalIndentLeftPt, l = t.spaceBeforePt, u = t.spaceAfterPt, d = Object.freeze({ ...n }), f = r.fontFamilyClasses, p = n.startYPt + (n.suppressSpaceBefore ? 0 : l);
	n.wrap && (p = n.wrap.skipTopAndBottomBands({
		yPt: p,
		columnXPt: n.paragraphXPt,
		columnWidthPt: n.availableWidthPt
	}));
	let m = () => {
		let a = p;
		n.wrap && (a = n.wrap.lineWindow({
			topYPt: a,
			minimumStartWidthPt: Pi(e),
			probeHeightPt: 10,
			paragraphXPt: c,
			maximumWidthPt: s,
			columnXPt: n.paragraphXPt,
			columnWidthPt: n.availableWidthPt
		}).topYPt);
		let m = ea(e, 1, o, t.hasRuby, i.documentHasEastAsianText === !0, r.context, f, t.lineSpacing, i.resolvedLocalFonts);
		return {
			lines: [],
			markOnly: !0,
			requestedSpaceBeforePt: l,
			requestedSpaceAfterPt: u,
			uniformRubyAdvancePt: 0,
			contentStartYPt: a,
			contentEndYPt: a + m,
			lastLineBelowBaselinePt: na(e, o, t.hasRuby, i.documentHasEastAsianText === !0, r.context, f, t.lineSpacing, i.resolvedLocalFonts),
			placement: d
		};
	}, h = Ea(e.runs, i);
	if (h.length === 0) return m();
	let g = n.wrap ? {
		startPageY: p,
		paraX: c,
		columnXPt: n.paragraphXPt,
		columnWidthPt: n.availableWidthPt,
		floats: [],
		paragraphMarkLineStartWidth: Pi(e),
		lineWindow: (e) => n.wrap.lineWindow(e),
		lineBoxH: (e, n, r, i, a, s) => Xi(t.lineSpacing, e, n, 1, o, t.hasRuby, i ?? 0, t.hasRuby ? t.hasEastAsianText : a ?? !1, s),
		pageH: n.maximumYPt
	} : void 0, _ = Da(r.context, h, s, a ? 0 : t.firstIndentPt, 1, [...t.tabStops], g, f, t.physicalIndentLeftPt, t.kinsoku, t.characterGrid.active ? t.characterGrid.deltaPt : 0, t.defaultTabPt, s + t.physicalIndentRightPt, t.baseRtl, t.isJustified, t.stretchLastLine, a?.boundary);
	if (_.length === 0) return m();
	let v = t.hasRuby ? Ja(Math.max(0, ..._.map((e) => Xi(t.lineSpacing, e.ascent, e.descent, 1, o, !0, e.intendedSingle, t.hasEastAsianText))), o) : 0;
	t.hasRuby && a?.uniformRubyAdvancePt !== void 0 && (v = Math.max(v, a.uniformRubyAdvancePt));
	let y = [];
	for (let e of _) {
		let n = e.topY !== void 0 && e.topY > p ? e.topY : p, r = t.hasRuby ? v : Xi(t.lineSpacing, e.ascent, e.descent, 1, o, !1, e.intendedSingle, e.eastAsian ?? !1, e.gridCountSingle);
		y.push({
			layout: e,
			topYPt: n,
			advancePt: r
		}), p = n + r;
	}
	let b = y[y.length - 1];
	return {
		lines: y,
		markOnly: !1,
		requestedSpaceBeforePt: l,
		requestedSpaceAfterPt: u,
		uniformRubyAdvancePt: v,
		contentStartYPt: y[0].topYPt,
		contentEndYPt: p,
		lastLineBelowBaselinePt: ta(b.advancePt, b.layout.ascent, b.layout.descent),
		placement: d
	};
}
//#endregion
//#region packages/docx/src/layout-fragments.ts
function Xa(e) {
	let t = e.measured;
	if (t.markOnly || t.lines.length === 0) return t.contentEndYPt - t.contentStartYPt;
	let n = 0;
	for (let r = e.lineStart; r < e.lineEnd; r++) {
		let i = t.lines[r];
		if (!i) break;
		if (r === e.lineStart) {
			n += i.advancePt;
			continue;
		}
		let a = t.lines[r - 1], o = a.topYPt + a.advancePt;
		n += Math.max(0, i.topYPt - o) + i.advancePt;
	}
	return n;
}
function Za(e) {
	return e.leadingSpacePt + Xa(e) + e.trailingSpacePt;
}
function Qa(e) {
	let t = 0;
	for (let n of e.rows) t += n.heightPt;
	return t;
}
//#endregion
//#region packages/docx/src/table-fragments.ts
function $a(e) {
	return e.vMerge === !0 ? "restart" : e.vMerge === !1 ? "continue" : "none";
}
function eo(e) {
	let { table: t, columnWidthsPt: n, rowHeightsPt: r, continuesFromPreviousPage: i, continuesOnNextPage: a, repeatedHeaderRowCount: o, buildCellBlocks: s } = e, c = e.sourceRowIndexOf ?? ((e) => e), l = Object.freeze([...n]), u = t.rows.map((e, t) => {
		let n = Br(e, l.length), i = e.cells.map((e) => {
			let i = Math.min(e.colSpan, l.length - n), a = 0;
			for (let e = n; e < n + i; e++) a += l[e] ?? 0;
			n += i;
			let o = $a(e), c = Object.freeze(o === "continue" ? [] : [...s(e, a)]);
			return Object.freeze({
				source: e,
				blocks: c,
				verticalMerge: o,
				boxHeightPt: r[t] ?? 0
			});
		});
		return Object.freeze({
			source: e,
			sourceRowIndex: c(t),
			heightPt: r[t] ?? 0,
			cells: Object.freeze(i),
			repeatedHeader: t < o
		});
	});
	return Object.freeze({
		kind: "table",
		source: t,
		columnWidthsPt: l,
		rows: Object.freeze(u),
		continuesFromPreviousPage: i,
		continuesOnNextPage: a
	});
}
//#endregion
//#region packages/docx/src/fragment-paint.ts
function to(e, t, n = {}) {
	let r = e.fragment;
	if (r.kind !== "paragraph") return;
	let i = r.measured, a = i.lines.map((e) => e.layout), o = n.continuesParagraph === !0, s = r.lineStart === 0 && r.lineEnd === i.lines.length && !o ? void 0 : {
		start: r.lineStart,
		end: r.lineEnd,
		...o ? { continues: !0 } : {}
	};
	Rc(r.source, t, a, n.suppressSpaceBefore ?? !1, s, n.borderMerge);
}
function no(e, t) {
	let n = e.fragment;
	n.kind === "table" && Pl(n, t);
}
//#endregion
//#region packages/docx/src/renderer.ts
var ro = {
	yellow: "#FFFF00",
	cyan: "#00FFFF",
	green: "#00FF00",
	magenta: "#FF00FF",
	blue: "#0000FF",
	red: "#FF0000",
	darkBlue: "#000080",
	darkCyan: "#008080",
	darkGreen: "#008000",
	darkMagenta: "#800080",
	darkRed: "#800000",
	darkYellow: "#808000",
	darkGray: "#808080",
	lightGray: "#C0C0C0",
	black: "#000000",
	white: "#FFFFFF"
};
function io(e) {
	return e === "lowKashida" ? "low" : e === "mediumKashida" ? "medium" : e === "highKashida" ? "high" : null;
}
function ao(e, t, n, r, i, a, o) {
	let s = t.map((e) => "text" in e && e.fitTextRegionIndex === void 0 ? { text: e.text } : {}), c = /* @__PURE__ */ new Map(), l = (n, r) => {
		let s = t[n];
		e.font = Ai(s.bold, s.italic, ji(s, i), s.fontFamily, a);
		let c = e.fontKerning, l = e.letterSpacing;
		s.kerning != null && (e.fontKerning = s.fontSize >= s.kerning ? "normal" : "none"), e.letterSpacing = "0px";
		let u = e.measureText(r).width;
		return e.letterSpacing = l, s.kerning != null && (e.fontKerning = c), Ki({
			...s,
			text: r
		}, u, o, i);
	};
	return wr(s, n, r, (e, n) => {
		let r = t[e], i = c.get(e);
		return i === void 0 && (i = l(e, r.text), c.set(e, i)), n === r.text ? r.measuredWidth : r.measuredWidth + l(e, n) - i;
	});
}
function oo(e) {
	return so(e).length > 0;
}
function so(e) {
	let t = [], n = (e) => {
		for (let n of e) n.type === "math" && t.push({
			nodes: n.nodes,
			display: n.display
		});
	}, r = (e) => {
		if ("runs" in e && n(e.runs), "rows" in e) for (let t of e.rows) for (let e of t.cells) for (let t of e.content) r(t);
	};
	return e.forEach(r), t;
}
function co(e) {
	let t = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(e)}`, n = new Image();
	return new Promise((e, r) => {
		n.onload = () => e(n), n.onerror = r, n.src = t;
	});
}
async function lo(e, t) {
	let n = so(e);
	if (n.length !== 0) {
		await t.loadMathJax();
		for (let e of n) if (!_i.has(e.nodes)) try {
			let n = await t.mathMLToSvg(Q(e.nodes, e.display)), r = await co(He(n.svg, "#000000"));
			_i.set(e.nodes, {
				img: r,
				widthEm: n.widthEm,
				ascentEm: n.ascentEm,
				descentEm: n.descentEm
			});
		} catch {}
	}
}
var uo = {
	story: "body",
	containers: [],
	lineNumberingEligible: !0
};
function fo(e, t) {
	return Ua(e.layoutSettings, e.sectionLayout, uo, t);
}
function po(e, t) {
	return Ua(e.layoutSettings, e.sectionLayout, e.storyContext ?? uo, t);
}
function mo(e) {
	return {
		...e,
		storyContext: ja(e.storyContext ?? uo)
	};
}
function ho(e, t, n, r, i, a, o) {
	let s = e.story === "body" && (e.containers.length === 0 || e.containers.every((e) => e.kind === "tableCell"));
	return !r && !n && s && !t && !i.hasRuby && !i.baseRtl && a.numbering == null && !Nn(o) && io(a.alignment) === null && o.every((e) => !("isTab" in e) && !("mathNodes" in e) && (!("text" in e) || e.emphasisMark == null));
}
function go(e) {
	return e == null ? Date.now() : typeof e == "number" ? e : e.getTime();
}
function _o(e, t, n) {
	let r = e;
	return t && (r += `|clr:${t}`), n && (r += `|duo:${n.clr1}:${n.clr2}`), r;
}
var vo = /* @__PURE__ */ new WeakMap();
function yo(e) {
	let t = vo.get(e);
	return t || (t = /* @__PURE__ */ new Map(), vo.set(e, t)), t;
}
function bo(e) {
	let t = vo.get(e);
	if (t) {
		for (let n of t.values()) he(e, n);
		t.clear(), vo.delete(e);
	}
}
var xo = [
	"#C00000",
	"#0070C0",
	"#00B050",
	"#7030A0",
	"#E97132",
	"#196B24",
	"#9E480E",
	"#525252"
];
function So(e) {
	if (!e) return xo[0];
	let t = 2166136261;
	for (let n = 0; n < e.length; n++) t ^= e.charCodeAt(n), t = Math.imul(t, 16777619);
	return xo[Math.abs(t) % xo.length];
}
function Co(e) {
	let t = /* @__PURE__ */ new Map(), n = (e) => {
		let n = _o(e.imagePath, e.colorReplaceFrom, e.duotone), r = t.get(n);
		r ? (r.widthPt = Math.max(r.widthPt, e.widthPt), r.heightPt = Math.max(r.heightPt, e.heightPt), r.hasCrop = r.hasCrop || e.hasCrop) : t.set(n, e);
	}, r = (e) => {
		let t = e.numbering, r = t?.picBulletImagePath;
		if (r && t) {
			let i = Ql(t, e);
			n({
				imagePath: r,
				mimeType: t.picBulletMimeType ?? "",
				widthPt: i.w,
				heightPt: i.h
			});
		}
	}, i = (e) => {
		for (let t of e) if (t.type === "image") {
			let e = t;
			n({
				imagePath: e.imagePath,
				mimeType: e.mimeType,
				svgImagePath: e.svgImagePath,
				colorReplaceFrom: e.colorReplaceFrom,
				duotone: e.duotone,
				..._e(e.mimeType, e.srcRect, e.widthPt ?? 0, e.heightPt ?? 0),
				hasCrop: e.srcRect != null
			});
		} else if (t.type === "shape") {
			let e = t;
			for (let t of e.textBlocks ?? []) t.imagePath && n({
				imagePath: t.imagePath,
				mimeType: t.mimeType ?? "",
				svgImagePath: t.svgImagePath,
				widthPt: t.imageWidthPt ?? 0,
				heightPt: t.imageHeightPt ?? 0
			});
		}
	}, a = (e) => {
		for (let t of e.rows) for (let e of t.cells) for (let t of e.content) if (t.type === "paragraph") {
			let e = t;
			r(e), i(e.runs);
		} else t.type === "table" && a(t);
	}, o = (e) => {
		for (let t of e) {
			if (t.type === "paragraph") {
				let e = t;
				r(e), i(e.runs);
			}
			t.type === "table" && a(t);
		}
	};
	return o(e.body), e.headers.default && o(e.headers.default.body), e.headers.first && o(e.headers.first.body), e.headers.even && o(e.headers.even.body), e.footers.default && o(e.footers.default.body), e.footers.first && o(e.footers.first.body), e.footers.even && o(e.footers.even.body), [...t.values()];
}
async function wo(e, t) {
	let n = parseInt(t.slice(0, 2), 16), r = parseInt(t.slice(2, 4), 16), i = parseInt(t.slice(4, 6), 16), a = new OffscreenCanvas(e.width, e.height), o = a.getContext("2d");
	o.drawImage(e, 0, 0);
	let s = o.getImageData(0, 0, e.width, e.height), c = s.data;
	for (let e = 0; e < c.length; e += 4) c[e] === n && c[e + 1] === r && c[e + 2] === i && (c[e + 3] = 0);
	return o.putImageData(s, 0, 0), createImageBitmap(a);
}
async function To(e, t, n, r, i = 0, a = 0, o) {
	let s = await ee(e, t, r, {
		widthPt: i,
		heightPt: a,
		suppressBoundaryFrame: !0
	});
	if (!s) return null;
	if (!n && !o) return s;
	let c = yo(r), l = _o(e, n, o), u = c.get(l);
	return u || (u = (async () => {
		let e = s;
		if (n && (e = await wo(e, n)), o) {
			let { w: t, h: n } = ne(e);
			t > 0 && n > 0 && (e = await L(e, o, {
				width: t,
				height: n
			}));
		}
		return e;
	})(), u.catch(() => c.delete(l)), u.then((e) => {
		e === s && c.delete(l);
	}).catch(() => {}), c.set(l, u)), u;
}
async function Eo(e, t) {
	if (!t) return /* @__PURE__ */ new Map();
	let n = t, r = Co(e), i = await Promise.all(r.map(async (e) => {
		let t = e.mimeType === "image/svg+xml", r = {
			svgImagePath: e.svgImagePath,
			srcRect: e.hasCrop || null
		};
		try {
			let i;
			if (m(r)) try {
				i = await oe(r.svgImagePath, n);
			} catch {
				i = t ? await oe(e.imagePath, n) : await To(e.imagePath, e.mimeType, e.colorReplaceFrom, n, e.widthPt, e.heightPt, e.duotone);
			}
			else i = t ? await oe(e.imagePath, n) : await To(e.imagePath, e.mimeType, e.colorReplaceFrom, n, e.widthPt, e.heightPt, e.duotone);
			return i ? [_o(e.imagePath, e.colorReplaceFrom, e.duotone), i] : null;
		} catch {
			return null;
		}
	}));
	return new Map(i.filter((e) => e !== null));
}
var Do = /* @__PURE__ */ new WeakMap(), Oo = /* @__PURE__ */ new WeakMap();
function ko(e, t) {
	Oo.set(e, t);
}
function Ao(e) {
	Oo.delete(e);
}
function jo(e) {
	return Oo.get(e) ?? {};
}
function Mo(e) {
	return No(e.textDirection);
}
function No(e) {
	return e === "tbRl" || e === "tbRlV" || e === "tbLrV" || e === "btLr";
}
function Po(e) {
	return e === "btLr";
}
function Fo(e) {
	return {
		...e,
		pageWidth: e.pageHeight,
		pageHeight: e.pageWidth,
		marginLeft: e.marginTop,
		marginTop: e.marginRight,
		marginRight: e.marginBottom,
		marginBottom: e.marginLeft,
		headerDistance: e.headerDistance,
		footerDistance: e.footerDistance
	};
}
function Io(e) {
	return Mo(e.section) ? {
		...e,
		section: Fo(e.section)
	} : e;
}
function Lo(e) {
	return {
		...e,
		pageWidth: e.pageHeight,
		pageHeight: e.pageWidth,
		marginTop: e.marginLeft,
		marginRight: e.marginTop,
		marginBottom: e.marginRight,
		marginLeft: e.marginBottom
	};
}
function Ro(e) {
	return {
		pageWidth: e.pageHeight,
		pageHeight: e.pageWidth,
		marginLeft: e.marginTop,
		marginTop: e.marginRight,
		marginRight: e.marginBottom,
		marginBottom: e.marginLeft,
		headerDistance: e.headerDistance,
		footerDistance: e.footerDistance
	};
}
function zo(e) {
	return {
		pageWidth: e.pageHeight,
		pageHeight: e.pageWidth,
		marginTop: e.marginLeft,
		marginRight: e.marginTop,
		marginBottom: e.marginRight,
		marginLeft: e.marginBottom,
		headerDistance: e.headerDistance,
		footerDistance: e.footerDistance
	};
}
var Bo = /* @__PURE__ */ new WeakMap();
function Vo(e, t, n) {
	let r = e[t], i = r?.[0]?.sectionTextDirection;
	if (i !== void 0) return i;
	let a = r ? Bo.get(r) : void 0;
	return a ? a.textDirection : n.textDirection ?? null;
}
function Ho(e, t, n) {
	let r = e[t], i = r ? Bo.get(r) : void 0, a = r?.[0]?.sectionGeom ?? i?.geom;
	return a == null ? {
		widthPt: n.pageWidth,
		heightPt: n.pageHeight
	} : No(Vo(e, t, n)) ? {
		widthPt: a.pageHeight,
		heightPt: a.pageWidth
	} : {
		widthPt: a.pageWidth,
		heightPt: a.pageHeight
	};
}
function Uo(e, t, n, r) {
	e.save();
	let i = Math.max(24, Math.min(t, n) * .06);
	e.strokeStyle = "#c8ccd2", e.lineWidth = Math.max(1, Math.min(t, n) * .003), e.setLineDash([e.lineWidth * 6, e.lineWidth * 5]), e.strokeRect(i, i, t - i * 2, n - i * 2), e.setLineDash([]);
	let a = t / 2, o = Math.min(t, n), s = Math.max(24, o * .09);
	e.fillStyle = "#b23b3b", e.textAlign = "center", e.textBaseline = "middle", e.font = `${s}px sans-serif`, e.fillText("⚠", a, n * .34);
	let c = Math.max(13, o * .032);
	e.fillStyle = "#333333", e.font = `600 ${c}px sans-serif`, e.fillText("This document could not be displayed", a, n * .44);
	let l = Math.max(10, o * .02);
	e.fillStyle = "#666666", e.font = `${l}px sans-serif`;
	let u = t - i * 4, d = r.split(/\s+/), f = [], p = "";
	for (let t of d) {
		let n = p ? `${p} ${t}` : t;
		if (e.measureText(n).width > u && p ? (f.push(p), p = t) : p = n, f.length >= 4) break;
	}
	p && f.length < 4 && f.push(p);
	let m = l * 1.4, h = n * .5 + m;
	for (let t of f.slice(0, 4)) e.fillText(t, a, h), h += m;
	e.restore();
}
async function Wo(e, t, n, r = {}) {
	let i = r.fetchImage ? le(r.fetchImage) : void 0;
	try {
		await Go(e, t, n, r);
	} finally {
		i?.();
	}
}
async function Go(e, t, n, r = {}) {
	let i = (Do.get(t) ?? 0) + 1;
	Do.set(t, i);
	let a = () => Do.get(t) !== i, o = r.dpr ?? c(), s = t.getContext("2d"), l = jo(e), u = Io(e), d = Fa(u), f = d.kinsoku, p = r.prebuiltPages ?? vs(u, s, Di(u.fontFamilyClasses, u.fontFamilyPitches), d, u.footnotes ?? [], l), m = Math.max(r.totalPages ?? p.length, p.length), h = p[n] ?? p[0] ?? [], _ = mn(p)[n] ?? {
		displayNumber: n + 1,
		format: "decimal"
	}, v = mc(p, n, u).geom, y = Vo(p, n, u.section), b = {
		...u.section,
		...v,
		textDirection: y
	}, x = Mo(b), S = Ba(d, b), C = x ? b.pageHeight : b.pageWidth, w = x ? b.pageWidth : b.pageHeight, T = r.width ?? C * 1.3333333333333333, E = T / C, D = w * E, O = A(T * o, D * o), k = O.clamped ? o * O.scale : o;
	if (t.width = O.width, t.height = O.height, g(t) && (t.style.width = `${T}px`, t.style.height = `${D}px`, t.style.display || (t.style.display = "block")), s.scale(k, k), s.fillStyle = "#ffffff", s.fillRect(0, 0, T, D), e.parseError != null) {
		Uo(s, T, D, e.parseError);
		return;
	}
	x && (s.translate(T, 0), s.rotate(Math.PI / 2));
	let j = await Eo(e, r.fetchImage);
	if (a()) return;
	let M = Zo(e.footnotes), N = Zo(e.endnotes), P = /* @__PURE__ */ new Map();
	for (let [e, t] of M) P.set(`footnote:${e}`, t);
	for (let [e, t] of N) P.set(`endnote:${e}`, t);
	let F = ds(b.marginTop), I = ds(b.marginBottom), L = {
		ctx: s,
		scale: E,
		dpr: k,
		contentX: b.marginLeft * E,
		contentW: (b.pageWidth - b.marginLeft - b.marginRight) * E,
		y: F * E,
		pageH: b.pageHeight * E,
		defaultColor: r.defaultTextColor ?? "#000000",
		pageIndex: n,
		totalPages: m,
		displayPageNumber: _.displayNumber,
		pageNumberFormat: _.format,
		images: j,
		dryRun: !1,
		marginLeft: b.marginLeft,
		marginRight: b.marginRight,
		marginTop: F,
		marginBottom: I,
		pageWidth: b.pageWidth,
		floats: [],
		floatParaSeq: 0,
		docGrid: Va(S),
		layoutSettings: d,
		sectionLayout: S,
		storyContext: uo,
		docEastAsian: d.documentHasEastAsianText,
		fontFamilyClasses: Di(e.fontFamilyClasses, e.fontFamilyPitches),
		resolvedLocalFonts: l,
		kinsoku: f,
		defaultTabPt: d.defaultTabPt,
		characterSpacingControl: d.characterSpacingControl,
		useFeLayout: d.compat.useFeLayout,
		balanceSingleByteDoubleByteWidth: d.compat.balanceSingleByteDoubleByteWidth,
		mathDefJc: d.mathDefJc,
		onTextRun: r.onTextRun,
		showTrackChanges: r.showTrackChanges ?? !0,
		currentDateMs: go(r.currentDate),
		noteNumbers: P,
		verticalCJK: x,
		verticalAllRotated: x && Po(y),
		verticalPhys: x ? {
			pageWidth: C,
			pageHeight: w,
			marginLeft: b.marginBottom,
			marginRight: b.marginTop,
			marginTop: ds(b.marginLeft),
			marginBottom: ds(b.marginRight),
			cssWidthPx: T
		} : void 0
	}, R = ms(p, n, e), z = ps(p, n, e), B = 0, V = 0;
	if (x) {
		if (R || z) {
			let e = {
				...Lo(b),
				textDirection: null
			}, t = Ba(d, e), n = {
				...L,
				contentX: e.marginLeft * E,
				contentW: (C - e.marginLeft - e.marginRight) * E,
				marginLeft: e.marginLeft,
				marginRight: e.marginRight,
				marginTop: ds(e.marginTop),
				marginBottom: ds(e.marginBottom),
				pageWidth: C,
				pageH: w * E,
				docGrid: Va(t),
				sectionLayout: t,
				verticalCJK: !1,
				verticalAllRotated: !1,
				verticalPhys: void 0
			};
			if (s.save(), s.setTransform(k, 0, 0, k, 0, 0), R && hc(R, e.headerDistance * E, n), z) {
				let t = gc(z, n);
				hc(z, D - e.footerDistance * E - t, n);
			}
			s.restore();
		}
	} else {
		if (R) {
			let e = gc(R, L);
			hc(R, b.headerDistance * E, L), B = us(e, b.marginTop * E, b.headerDistance * E);
		}
		if (z) {
			let e = gc(z, L);
			hc(z, D - b.footerDistance * E - e, L), V = ls(e, b.marginBottom * E, b.footerDistance * E);
		}
	}
	let ee = Ia(b), H = F * E + B, U = {
		...L,
		y: H
	}, W = b.lineNumbering;
	if (W && ee.length <= 1) {
		U.lineNumbering = {
			countBy: W.countBy,
			start: W.start,
			distancePt: W.distance ?? rs,
			fontSizePt: is(e)
		};
		let t = W.start;
		if ((W.restart === "continuous" || W.restart === "newSection") && n > 0) {
			let e = W.start;
			for (let t = 0; t < n; t++) {
				let n = {
					...U,
					y: 0,
					dryRun: !0,
					floats: [],
					lineNumberCounter: e
				};
				Ec(p[t] ?? [], n, Ia(b), 0), e = n.lineNumberCounter ?? e;
			}
			t = e;
		}
		U.lineNumberCounter = t;
	}
	let te = b.vAlign;
	if ((te === "center" || te === "bottom") && B === 0) {
		let e = F * E, t = D - I * E - V - e, n = {
			...U,
			y: 0,
			dryRun: !0,
			floats: [],
			lineNumbering: void 0,
			lineNumberCounter: void 0
		};
		Ec(h, n, ee, 0);
		let r = n.y;
		r < t && (U.y = e + (te === "center" ? (t - r) / 2 : t - r));
	}
	if (b.pageBorders && b.pageBorders.zOrder === "back" && as(b.pageBorders, n) && os(s, b.pageBorders, b, E), b.columns?.sep) {
		let e = /* @__PURE__ */ new Set(), t = [];
		for (let n of h) {
			let r = n.colGeom ?? ee;
			r.length > 1 && !e.has(r) && (e.add(r), t.push(r));
		}
		t.length === 0 && ee.length > 1 && t.push(ee);
		for (let e of t) Tc(s, e, b, E);
	}
	Ec(h, U, ee, B), qo(h, e, L, E, D, b, V), n === m - 1 && Jo(e, U, E, D, b), b.pageBorders && b.pageBorders.zOrder !== "back" && as(b.pageBorders, n) && os(s, b.pageBorders, b, E);
}
function Ko(e, t, n, r, i) {
	return ts(e, bs(t, n, r, i), n.pageWidth - n.marginLeft - n.marginRight);
}
function qo(e, t, n, r, i, a, o = 0) {
	if (!t.footnotes || t.footnotes.length === 0) return;
	let s = Qo(t.footnotes), c = [], l = /* @__PURE__ */ new Set();
	for (let t of e) for (let e of es(t)) !l.has(e) && s.has(e) && (l.add(e), c.push(e));
	if (c.length === 0) return;
	let u = 0, d = 0;
	for (let e of c) {
		let t = s.get(e);
		if (!t) continue;
		let r = Ko(t, n.ctx, a, n.fontFamilyClasses, n.layoutSettings);
		u += r.total, d = r.trailingSpaceAfter;
	}
	let f = Math.max(0, u - d), p = Yo * r, m = i - ds(a.marginBottom) * r - o - f * r, h = a.marginLeft * r, g = Math.round(m - p), _ = n.ctx;
	_.save(), _.strokeStyle = n.defaultColor;
	let v = Math.max(1, Math.round(.5 * r));
	_.lineWidth = v;
	let y = P(g, v, n.dpr);
	_.beginPath(), _.moveTo(h, g + y), _.lineTo(h + (a.pageWidth - a.marginLeft - a.marginRight) * r / 3, g + y), _.stroke(), _.restore();
	let b = {
		...n,
		y: m
	};
	for (let e of c) {
		let n = s.get(e);
		n && (b.currentNoteNumber = t.footnotes.findIndex((t) => t.id === e) + 1, Dc(n.content.filter((e) => e.type === "paragraph"), b));
	}
}
function Jo(e, t, n, r, i) {
	if (!e.endnotes || e.endnotes.length === 0) return;
	let a = e.endnotes.filter((e) => e.content.some((e) => e.type === "paragraph" && e.runs.length > 0));
	if (a.length === 0) return;
	let o = t.ctx, s = t.y + Yo * 2 * n;
	if (s >= r - ds(i.marginBottom) * n) return;
	let c = i.marginLeft * n;
	o.save(), o.strokeStyle = t.defaultColor;
	let l = Math.max(1, Math.round(.5 * n));
	o.lineWidth = l;
	let u = Math.round(s), d = P(u, l, t.dpr);
	o.beginPath(), o.moveTo(c, u + d), o.lineTo(c + (i.pageWidth - i.marginLeft - i.marginRight) * n / 3, u + d), o.stroke(), o.restore();
	let f = {
		...t,
		y: s + Yo * n,
		lineNumbering: void 0,
		lineNumberCounter: void 0
	};
	for (let t of a) f.currentNoteNumber = e.endnotes.findIndex((e) => e.id === t.id) + 1, Dc(t.content.filter((e) => e.type === "paragraph"), f);
}
var Yo = 6, Xo = {
	default: null,
	first: null,
	even: null
};
function Zo(e) {
	let t = /* @__PURE__ */ new Map();
	return e && e.forEach((e, n) => t.set(e.id, n + 1)), t;
}
function Qo(e) {
	let t = /* @__PURE__ */ new Map();
	if (!e) return t;
	for (let n of e) t.set(n.id, n);
	return t;
}
function $o(e) {
	let t = [];
	for (let n of e) {
		if (n.type !== "text") continue;
		let e = n.noteRef;
		e && e.kind === "footnote" && e.id && t.push(e.id);
	}
	return t;
}
function es(e) {
	if (e.type === "paragraph") return $o(e.runs);
	if (e.type === "table") {
		let t = [];
		for (let n of e.rows) for (let e of n.cells) for (let n of e.content) t.push(...es(n));
		return t;
	}
	return [];
}
function ts(e, t, n) {
	let r = 0, i = 0;
	for (let a of e.content) {
		if (a.type !== "paragraph") continue;
		let e = a;
		r += Ls(t, e, n, !1), i = e.spaceAfter;
	}
	return {
		total: r,
		trailingSpaceAfter: i
	};
}
function ns(e, t, n, r) {
	let { total: i, trailingSpaceAfter: a } = ts(e, t, n);
	return Math.max(0, i - a) + (r ? Yo : 0);
}
var rs = 18;
function is(e) {
	for (let t of e.body) if (t.type === "paragraph") {
		let e = t;
		if (typeof e.defaultFontSize == "number") return e.defaultFontSize;
		for (let t of e.runs) if (t.type === "text") return t.fontSize;
	}
	return 10;
}
function as(e, t) {
	switch (e.display) {
		case "firstPage": return t === 0;
		case "notFirstPage": return t !== 0;
		default: return !0;
	}
}
function os(e, t, n, r) {
	let i = t.offsetFrom === "text", a = i ? n.marginLeft : 0, o = i ? n.pageWidth - n.marginRight : n.pageWidth, s = i ? ds(n.marginTop) : 0, c = i ? n.pageHeight - ds(n.marginBottom) : n.pageHeight, l = (e) => ({
		width: e.width,
		color: e.color ?? null,
		style: e.style
	}), u = (s + (t.top?.space ?? 0)) * r, d = (c - (t.bottom?.space ?? 0)) * r, f = (a + (t.left?.space ?? 0)) * r, p = (o - (t.right?.space ?? 0)) * r;
	t.top && Rl(e, f, u, p, u, l(t.top), r, 1), t.bottom && Rl(e, f, d, p, d, l(t.bottom), r, 1), t.left && Rl(e, f, u, f, d, l(t.left), r, 1), t.right && Rl(e, p, u, p, d, l(t.right), r, 1);
}
var ss = {
	top: 0,
	bottom: 0
};
function cs(e, t, n, r = {}, i = v, a = [], o = [], s = 36, c, l, u = {}) {
	let d = () => ds(B.marginTop), f = () => ds(B.marginBottom), p = () => B.pageHeight - d() - f(), m = l ?? {
		...Fa({
			section: t,
			body: e,
			headers: Xo,
			footers: Xo,
			settings: c
		}),
		kinsoku: i,
		defaultTabPt: s
	}, h = bs(n, t, r, m, u), g = () => z.vertical, _ = () => {
		let e = z.vertical ? zo(z.geom) : z.geom;
		return e.pageWidth - e.marginLeft - e.marginRight;
	}, y = Qo(a), b = y.size > 0, x = [0], S = (n) => {
		for (let r = n; r < e.length; r++) {
			let n = e[r];
			if (n.type === "sectionBreak") return Ia({
				...t,
				...j(n).geom,
				columns: n.columns ?? null
			});
		}
		return Ia(t);
	}, C = (n) => {
		for (let t = n; t < e.length; t++) {
			let n = e[t];
			if (n.type === "sectionBreak") return n.kind ?? "nextPage";
		}
		return t.sectionStart ?? "nextPage";
	}, w = (t) => Cc(e, t) && C(t + 2) === "continuous", T = (t) => w(t) ? (e[t].spaceBefore ?? 0) === 0 : !1, E = (t) => {
		for (let n = t; n < e.length; n++) {
			let t = e[n];
			if (t.type === "sectionBreak") return {
				headers: t.headers ?? Xo,
				footers: t.footers ?? Xo,
				titlePage: t.titlePage ?? !1
			};
		}
	}, D = fs(t), O = Mo(t), k = O ? zo(D) : D, A = {
		geom: D,
		textDirection: t.textDirection ?? null,
		vertical: O,
		columnsSpec: t.columns ?? null
	}, j = (e) => {
		let t = e.textDirection ?? null, n = No(t), r = e.geom ?? k;
		return {
			geom: n ? Ro(r) : r,
			textDirection: t,
			vertical: n,
			columnsSpec: e.columns ?? null
		};
	}, M = (t) => {
		for (let n = t; n < e.length; n++) {
			let t = e[n];
			if (t.type === "sectionBreak") return j(t);
		}
		return A;
	}, N = (n) => {
		for (let t = n; t < e.length; t++) {
			let n = e[t];
			if (n.type === "sectionBreak") return n.pageNumType ?? null;
		}
		return t.pageNumType ?? null;
	}, P = S(0), F = 0, I = () => P[F].xPt, L = () => P[F].wPt, R = E(0), z = M(0), B = z.geom, V = N(0), ee = e.some((e) => e.type === "sectionBreak" && No(e.textDirection ?? null) !== O), H = () => {
		if (!ee) return;
		let e = B;
		if (h.pageWidth = e.pageWidth, h.pageH = e.pageHeight, h.marginLeft = e.marginLeft, h.marginRight = e.marginRight, h.marginTop = ds(e.marginTop), h.marginBottom = ds(e.marginBottom), h.contentX = e.marginLeft, h.contentW = e.pageWidth - e.marginLeft - e.marginRight, z.vertical) {
			let t = zo(e);
			h.verticalPhys = {
				pageWidth: t.pageWidth,
				pageHeight: t.pageHeight,
				marginLeft: t.marginLeft,
				marginRight: t.marginRight,
				marginTop: ds(t.marginTop),
				marginBottom: ds(t.marginBottom),
				cssWidthPx: t.pageWidth
			};
		} else h.verticalPhys = void 0;
		h.sectionLayout = Ba(m, {
			...t,
			...e,
			textDirection: z.textDirection,
			columns: z.columnsSpec
		}), h.docGrid = Va(h.sectionLayout);
	};
	H();
	let U = 0, W = 0, te = null, ne = () => d() + U, G = (e) => {
		let t = h.contentX, n = h.contentW;
		h.contentX = I() * h.scale, h.contentW = L() * h.scale;
		try {
			return e();
		} finally {
			h.contentX = t, h.contentW = n;
		}
	}, K = [[]], re = () => {
		Bo.set(K[K.length - 1], {
			geom: B,
			textDirection: z.textDirection
		});
	};
	re();
	let q = 0, J = null, Y = 0;
	h.y = d(), h.floats = [], h.floatParaSeq = 0, h.pageAnchorPrescanned = /* @__PURE__ */ new Set();
	let X = (t) => {
		h.pageAnchorPrescanned = /* @__PURE__ */ new Set(), pl(e, t, h);
	};
	X(0);
	let ie = /* @__PURE__ */ new Set(), ae = (e) => o.length === 0 ? ss : o[Math.min(e, o.length - 1)] ?? ss, Z = () => {
		let e = ae(K.length - 1);
		return p() - (x[K.length - 1] ?? 0) - e.bottom - e.top;
	}, oe = (e) => {
		let t = 0;
		for (let n = 0; n < e.length; n++) {
			let r = y.get(e[n]);
			if (!r) continue;
			let i = (x[K.length - 1] ?? 0) === 0 && n === 0;
			t += ns(r, h, L(), i);
		}
		return t;
	}, se = () => {
		x[K.length - 1] = 0, ie = /* @__PURE__ */ new Set(), re();
	}, ce = (e) => {
		K[K.length - 1].length > 0 && (K.push([]), q = 0, F = 0, U = 0, W = 0, te = null, J = null, Y = 0, h.y = d(), h.floats = [], h.floatParaSeq = 0, X(e), se(), fe(e));
	}, le = () => {
		W = Math.max(W, q), F++, q = U, J = null, Y = 0, h.y = d() + U;
	}, ue = (e) => {
		F < P.length - 1 ? le() : ce(e);
	}, de = (t, n) => {
		let r = {
			...h,
			y: d(),
			floats: [],
			floatParaSeq: 0
		}, i = 0, a = 0, o = null, s = !1;
		for (let c = t; c < e.length; c++) {
			let t = e[c];
			if (t.type === "sectionBreak" || t.type === "pageBreak") {
				s = !0;
				break;
			}
			if (t.type !== "columnBreak") {
				if (t.type === "paragraph") {
					let e = t;
					if (e.pageBreakBefore) return {
						height: Infinity,
						terminated: !1
					};
					if (e.framePr) continue;
					let s = w(c), l = _c(o, e, a, s ? 0 : e.spaceBefore), u = l.suppressBefore || s;
					i += Ls(r, e, n, u, 0) - l.overlap, a = e.spaceAfter, o = e;
				} else if (t.type === "table") {
					let e = t;
					if (e.tblpPr) continue;
					i += Hs(r, e, n).reduce((e, t) => e + t, 0), a = 0, o = null;
				}
			}
		}
		return {
			height: i,
			terminated: s
		};
	}, fe = (e) => {
		te = null;
		let t = P.length;
		if (t < 2) return;
		let { height: n, terminated: r } = de(e, P[0].wPt);
		if (!r || !Number.isFinite(n)) return;
		let i = Z() - U;
		i <= 0 || n > t * i || (te = n / t);
	}, Q = (e) => te != null && F < P.length - 1 && q > U && q + e > U + te, pe = (e) => {
		if (g()) return 0;
		let t = 0;
		for (let n of e.runs) if (n.type === "image") {
			let e = n;
			if (!e.anchor || !e.anchorYFromPara) continue;
			let r = (e.anchorYPt ?? 0) + e.heightPt;
			r > t && (t = r);
		} else if (n.type === "shape") {
			let e = n;
			if ((e.presetGeometry ?? "").toLowerCase().includes("callout") && e.wrapMode === "none" || !e.anchorYFromPara) continue;
			let r = Yc(e, h, h.y);
			if (r.h <= 0) continue;
			let i = (e.anchorYPt ?? 0) + r.h;
			i > t && (t = i);
		}
		return t;
	}, me = (t) => {
		let n = e[t];
		return n ? n.type === "paragraph" ? Ls(h, n, L(), !1) : n.type === "table" ? g() ? Ks(n, _(), h).reduce((e, t) => e + t, 0) : Ws(h, n, L()) : 0 : 0;
	}, he = (t) => {
		let n = 0;
		for (let r = t; r < e.length; r++) {
			let t = e[r];
			if (!t || t.type === "pageBreak" || t.type === "sectionBreak" || t.type === "columnBreak" || t.type !== "paragraph") return 0;
			let i = t;
			if (yc(i)) {
				n += Ls(h, i, L(), !1);
				continue;
			}
			return Sc(i) ? n + Ls(h, i, L(), !1) : 0;
		}
		return 0;
	}, ge = (e) => {
		e.colIndex = F, e.colGeom = P, e.colTopPt = ne(), e.sectionHF = R, e.sectionGeom = B, e.sectionPageNumType = V, e.sectionTextDirection = z.textDirection, K[K.length - 1].push(e);
	};
	fe(0);
	let _e = (t) => {
		for (let n = t; n < e.length; n++) {
			let t = e[n];
			if (t.type === "paragraph" || t.type === "table") return !0;
		}
		return !1;
	}, ve = (t) => {
		for (let n = t; n < e.length; n++) {
			let t = e[n];
			if (t.type === "pageBreak" || t.type === "columnBreak" || t.type === "sectionBreak" && C(n + 1) !== "continuous") return !1;
			if (t.type === "table") return !0;
			if (t.type === "paragraph") {
				let e = t;
				if (e.pageBreakBefore) return !1;
				if (!yc(e)) return !0;
			}
		}
		return !1;
	};
	for (let t = 0; t < e.length; t++) {
		let n = e[t];
		if (n.type === "columnBreak") {
			if (!_e(t + 1)) continue;
			ue(t + 1);
			continue;
		}
		if (n.type === "pageBreak") {
			K.push([]), q = 0, U = 0, W = 0, te = null, J = null, Y = 0, h.y = d(), h.floats = [], h.floatParaSeq = 0, X(t + 1), se(), (n.parity === "odd" && K.length % 2 == 0 || n.parity === "even" && K.length % 2 == 1) && (K.push([]), se());
			continue;
		}
		if (n.type === "sectionBreak") {
			P = S(t + 1), F = 0, R = E(t + 1);
			let e = z;
			z = M(t + 1), B = z.geom, V = N(t + 1), H();
			let n = C(t + 1), r = n === "continuous" && z.vertical !== e.vertical ? "nextPage" : n;
			if (r === "continuous") {
				let e = Math.max(W, q);
				q = e, h.y = d() + e, U = e, W = e, J = null, Y = 0, fe(t + 1);
			} else K.push([]), q = 0, U = 0, W = 0, te = null, J = null, Y = 0, h.y = d(), h.floats = [], h.floatParaSeq = 0, X(t + 1), se(), fe(t + 1), (r === "oddPage" && K.length % 2 == 0 || r === "evenPage" && K.length % 2 == 1) && (Bo.set(K[K.length - 1], {
				geom: e.geom,
				textDirection: e.textDirection
			}), K.push([]), se());
			continue;
		}
		if (n.type === "paragraph") {
			let r = n;
			if (r.pageBreakBefore && ce(t), r.framePr) {
				let i = r.framePr, a = Ac(e, n, h), o = G(() => jc(r, h, a)), s = o.y + o.h - h.y, c = i.vAnchor !== "page" && i.vAnchor !== "margin" && s > 0 && q + s > Z(), l = s > 0 && s <= Z();
				q > 0 && c && l && ue(t), G(() => {
					Mr(jc(r, h, a), r.framePr, h);
				}), ge(n);
				continue;
			}
			let i = w(t);
			if (i && (n.sectionBreakSpacer = !0), T(t)) {
				n.collapsedSpacer = !0, ge(n);
				continue;
			}
			if (bc(r)) {
				n.hiddenCollapsed = !0, ge(n);
				continue;
			}
			let a = _c(J, r, Y, i ? 0 : r.spaceBefore), o = a.suppressBefore || i, s = yc(r) && T(t + 1);
			s && (n.leadsCollapsedRun = !0);
			let c = s ? Y : a.overlap;
			q -= c, h.y -= c;
			let l = h.floats.length, u = h.floatParaSeq, f = h.y;
			fl(r, h, f);
			let p = e[t + 1], m = p?.type === "paragraph" && Jl(r, p), g = Fs(h, r, L(), o, I()), _ = Is(g, r, m), v = [], S = 0;
			if (b) {
				let e = /* @__PURE__ */ new Set();
				for (let t of $o(r.runs)) ie.has(t) || e.has(t) || y.has(t) && (e.add(t), v.push(t));
				S = oe(v);
			}
			let C = r.keepNext ? me(t + 1) : 0, E = _ - r.spaceAfter, D = ae(K.length - 1).bottom + (x[K.length - 1] ?? 0), O = E - (g.markOnly && yc(r) && !r.shading && !r.borders && C === 0 && S === 0 && D === 0 && ve(t + 1) ? g.lastLineBelowBaselinePt : 0), k = O + C + S, A = pe(r), j = A > 0 && q + A > Z(), M = A > 0 && A <= Z(), N = p?.type === "pageBreak", ee = !N && q > 0 && j && M, H = Sc(r) && p?.type === "paragraph" && e[t + 2]?.type === "pageBreak" && xc(p) ? p : null, ne = H ? pe(H) : 0, re = ne > 0 && q > 0 && q + E + ne > Z() && E + ne <= Z(), X = Sc(r) ? he(t + 1) : 0, se = X > 0 && q > 0 && q + E + X > Z() && E + X <= Z(), le = q > 0 && q + k > Z(), de = r.keepLines || C > 0 || S > 0, fe = !r.keepLines || _ > Z(), _e = Q(E) && !fe, ye = C > 0 && te != null && Q(E + C) && E + C <= te;
			if (ee || re || se || _e || ye || le && de && k <= Z()) {
				let e = K.length;
				ue(t), K.length > e ? (fl(r, h, h.y), b && v.length > 0 && (S = oe(v))) : (h.floats.length = l, h.floatParaSeq = u, fl(r, h, h.y));
			}
			if (N && xc(r)) {
				ge(n), J = r, Y = 0;
				continue;
			}
			let be = Z(), xe = () => te != null && F < P.length - 1 ? Math.min(Z(), U + te) : Z(), Se = xe(), Ce = Se - q;
			if ((Se === Z() ? O : E) > Ce && fe) {
				let e = Vs(h, r, L, o, I, q, be, K, (e) => {
					W = Math.max(W, e), ue(t);
				}, () => F, P, () => U, xe, () => R, () => B, () => V, () => z.textDirection);
				q = e.endY, h.y = d() + e.endY, b && v.length > 0 && (v = v.filter((e) => !ie.has(e)), S = oe(v));
			} else Ps(n, r, h, {
				paragraphXPt: I(),
				availableWidthPt: L(),
				suppressSpaceBefore: o,
				columnIndex: F
			}, g), ge(n), q += _, h.y += _;
			if (b && v.length > 0) {
				let e = K.length - 1;
				x[e] = (x[e] ?? 0) + S;
				for (let e of v) ie.add(e);
			}
			J = r, Y = r.spaceAfter;
		} else if (n.type === "table") {
			let e = n;
			if (e.tblpPr) {
				let r = e.tblpPr, i = () => G(() => {
					let t = L() * h.scale, n = _l(e, t, h), i = n.rowHeights.reduce((e, t) => e + t, 0);
					return {
						box: Nr(r, h, h.y, n.tableW, i),
						rawBox: Nr(r, h, h.y, n.tableW, i, !0),
						layout: n,
						contentWPt: t / h.scale
					};
				}), a = i(), o = r.vertAnchor !== "page" && r.vertAnchor !== "margin";
				o || (() => {
					let e = a.rawBox.y, t = a.rawBox.y + a.rawBox.h, n = a.rawBox.x, r = a.rawBox.x + a.rawBox.w;
					return h.floats.some((i) => i.kind === "table" && t - i.yTop > .01 && i.yBottom - e > .01 && r - i.xLeft > .01 && i.xRight - n > .01);
				})() && K[K.length - 1].length > 0 && (ue(t), q = U, a = i());
				let s = a.box.y + a.box.h - h.y, c = o && s > 0 && q + s > Z(), l = a.rawBox.y - d(), u = !o && a.rawBox.h > p();
				if (o && c || u) {
					let n = o ? a.box.y - h.y : l - q, i = fc(e, r, a.layout.colWidths, a.layout.rowContentHeights, n, a.contentWPt, () => q, () => U, () => Z(), () => ue(t), (t) => {
						G(() => {
							let n = t, r = t.tblpPr, i = (n.tableColWidthsPt ?? []).reduce((e, t) => e + t, 0) * h.scale, a = (n.tableRowHeightsPt ?? []).reduce((e, t) => e + t, 0) * h.scale, o = r.vertAnchor === "page" || r.vertAnchor === "margin", s = Nr(r, h, h.y, i, a, o);
							Pr(s, r, h, Fr(s, h), e.overlap !== "never");
						}), ge(t);
					});
					q = i, h.y = d() + i, J = null, Y = 0;
					continue;
				}
				G(() => {
					let t = Fr(a.box, h);
					Pr(a.box, r, h, t, e.overlap !== "never");
				}), Xs(n, a.layout.colWidths, a.layout.rowHeights, a.contentWPt), ge(n);
				continue;
			}
			let r = [], i = 0;
			if (b) {
				let e = /* @__PURE__ */ new Set();
				for (let t of es(n)) ie.has(t) || e.has(t) || !y.has(t) || (e.add(t), r.push(t));
				i = oe(r);
			}
			let a = () => {
				if (!b || r.length === 0) return;
				r = r.filter((e) => !ie.has(e));
				let e = oe(r), t = K.length - 1;
				x[t] = (x[t] ?? 0) + e;
				for (let e of r) ie.add(e);
			};
			if (g()) {
				let n = _(), { colWidthsPt: r, rowHeightsPt: o } = Us(h, e, n), s = r.reduce((e, t) => e + t, 0), c = {
					...e,
					type: "table"
				};
				Xs(c, r, o, n), q + s > Z() - i && q > U && ue(t), ge(c), q += s, h.y += s, a(), J = null;
				continue;
			}
			let o = L(), { colWidthsPt: s, rowContentHeightsPt: c, rowHeightsPt: l } = Us(h, e, o), u = s.reduce((e, t) => e + t, 0), f = e.tblInd != null && e.jc === "left", m = e.jc === "center" ? I() + Math.max(0, (L() - u) / 2) : e.jc === "right" ? I() + Math.max(0, L() - u) : I();
			if (f) {
				let t = e.tblInd;
				m = e.bidiVisual === !0 ? I() + L() - t - u : I() + t;
			}
			let v = m + u, S = l.reduce((e, t) => e + t, 0), C = d() + q, w = C;
			for (;;) {
				let e = w + S, t = w;
				for (let n of h.floats) {
					if (n.kind !== "table") continue;
					let r = v - n.xLeft > .01 && n.xRight - m > .01, i = e - n.yTop > .01 && n.yBottom - w > .01;
					r && i && (t = Math.max(t, n.yBottom));
				}
				if (t <= w + .01) break;
				w = t;
			}
			w > C + .01 && (q = w - d(), h.y = w);
			let T = Z() - i, E = lc(e, c, s, T, h, !0), D = E?.table ?? e, O = E?.rowHs ?? c, k = E ? qr(D, O, 1) : l, A = E?.sourceRowIndexByRow, j = {
				...D,
				type: "table"
			}, M = k.reduce((e, t) => e + t, 0), N = q + M > T;
			if (M > T || !Q(M) && N) {
				let e = dc(D, O, q, T, K, (e) => {
					W = Math.max(W, e), ue(t);
				}, () => F, P, () => U, d(), () => R, () => B, () => V, {
					colWidthsPt: s,
					contentWPt: o,
					rowHeightsAreContent: !0
				}, {
					colWidthsPt: s,
					state: h
				}, A, (e, t) => As(e, e, s, t.heightsPt, o, h, {
					columnIndex: e.colIndex ?? 0,
					xPt: P[e.colIndex ?? 0]?.xPt ?? I(),
					yPt: e.colTopPt ?? h.y,
					continuesFromPreviousPage: t.continuesFromPreviousPage,
					continuesOnNextPage: t.continuesOnNextPage,
					repeatedHeaderRowCount: t.repeatedHeaderRowCount,
					sourceRowIndexOf: t.sourceRowIndexOf
				}), () => z.textDirection);
				q = e, h.y = d() + e, a();
			} else (Q(M) || q + M > T) && ue(t), As(j, j, s, k, o, h, {
				columnIndex: F,
				xPt: I(),
				yPt: h.y,
				continuesFromPreviousPage: !1,
				continuesOnNextPage: !1,
				repeatedHeaderRowCount: 0,
				sourceRowIndexOf: A ? (e) => A[e] : void 0
			}), ge(j), q += M, h.y += M, a();
			J = null;
		}
	}
	return K;
}
function ls(e, t, n) {
	return t < 0 ? 0 : Math.max(0, n + e - t);
}
function us(e, t, n) {
	return t < 0 ? 0 : Math.max(0, n + e - t);
}
function ds(e) {
	return Math.abs(e);
}
function fs(e) {
	return {
		pageWidth: e.pageWidth,
		pageHeight: e.pageHeight,
		marginTop: e.marginTop,
		marginRight: e.marginRight,
		marginBottom: e.marginBottom,
		marginLeft: e.marginLeft,
		headerDistance: e.headerDistance,
		footerDistance: e.footerDistance
	};
}
function ps(e, t, n) {
	let r = mc(e, t, n);
	return pc(r.footers, r.isFirstPageOfSection, t % 2 == 1, r.titlePage, n.section.evenAndOddHeaders);
}
function ms(e, t, n) {
	let r = mc(e, t, n);
	return pc(r.headers, r.isFirstPageOfSection, t % 2 == 1, r.titlePage, n.section.evenAndOddHeaders);
}
var hs = .5;
function gs(e, t, n) {
	return e.map((r, i) => {
		if (No(Vo(e, i, t.section))) return 0;
		let a = ps(e, i, t);
		if (!a) return 0;
		let o = gc(a, n(i)), s = e[i]?.[0]?.sectionGeom;
		return ls(o, s?.marginBottom ?? t.section.marginBottom, s?.footerDistance ?? t.section.footerDistance);
	});
}
function _s(e, t, n) {
	return e.map((r, i) => {
		if (No(Vo(e, i, t.section))) return 0;
		let a = ms(e, i, t);
		if (!a) return 0;
		let o = gc(a, n(i)), s = e[i]?.[0]?.sectionGeom;
		return us(o, s?.marginTop ?? t.section.marginTop, s?.headerDistance ?? t.section.headerDistance);
	});
}
function vs(e, t, n, r, i, a = {}) {
	let o = cs(e.body, e.section, t, n, r.kinsoku, i, [], r.defaultTabPt, e.settings, r, a), s = Mo(e.section);
	if (!(!s || e.body.some((e) => e.type === "sectionBreak" && !No(e.textDirection ?? null)))) return o;
	let c = bs(t, e.section, n, r, a), l = s ? (i) => {
		let s = o[i]?.[0]?.sectionGeom;
		return bs(t, {
			...e.section,
			...s ?? {},
			textDirection: null
		}, n, r, a);
	} : () => c, u = gs(o, e, l), d = _s(o, e, l), f = (e) => e.some((e) => e > hs);
	if (!f(u) && !f(d)) return o;
	let p = o.map((e, t) => ({
		top: d[t] ?? 0,
		bottom: u[t] ?? 0
	}));
	return cs(e.body, e.section, t, n, r.kinsoku, i, p, r.defaultTabPt, e.settings, r, a);
}
function ys(e) {
	let t = new OffscreenCanvas(1, 1).getContext("2d");
	if (!t) return [e.body];
	let n = jo(e), r = Io(e), i = Fa(r);
	return vs(r, t, Di(r.fontFamilyClasses, r.fontFamilyPitches), i, r.footnotes ?? [], n);
}
function bs(e, t, n = {}, r, i = {}) {
	let a = Ba(r, t);
	return {
		ctx: e,
		scale: 1,
		dpr: 1,
		contentX: t.marginLeft,
		contentW: t.pageWidth - t.marginLeft - t.marginRight,
		y: 0,
		pageH: t.pageHeight,
		defaultColor: "#000000",
		pageIndex: 0,
		totalPages: 1,
		images: /* @__PURE__ */ new Map(),
		dryRun: !0,
		marginLeft: t.marginLeft,
		marginRight: t.marginRight,
		marginTop: ds(t.marginTop),
		marginBottom: ds(t.marginBottom),
		pageWidth: t.pageWidth,
		floats: [],
		floatParaSeq: 0,
		docGrid: Va(a),
		layoutSettings: r,
		sectionLayout: a,
		storyContext: uo,
		docEastAsian: r.documentHasEastAsianText,
		fontFamilyClasses: n,
		resolvedLocalFonts: i,
		kinsoku: r.kinsoku,
		defaultTabPt: r.defaultTabPt,
		characterSpacingControl: r.characterSpacingControl,
		useFeLayout: r.compat.useFeLayout,
		balanceSingleByteDoubleByteWidth: r.compat.balanceSingleByteDoubleByteWidth,
		showTrackChanges: !1,
		verticalPhys: Mo(t) ? (() => {
			let e = Lo(t);
			return {
				pageWidth: e.pageWidth,
				pageHeight: e.pageHeight,
				marginLeft: e.marginLeft,
				marginRight: e.marginRight,
				marginTop: ds(e.marginTop),
				marginBottom: ds(e.marginBottom),
				cssWidthPx: e.pageWidth
			};
		})() : void 0
	};
}
function xs(e) {
	return {
		pageIndex: e.pageIndex,
		totalPages: e.totalPages,
		displayPageNumber: e.displayPageNumber,
		pageNumberFormat: e.pageNumberFormat,
		currentDateMs: e.currentDateMs,
		noteNumbers: e.noteNumbers,
		currentNoteNumber: e.currentNoteNumber,
		verticalCJK: e.verticalCJK && !e.verticalAllRotated,
		documentHasEastAsianText: e.docEastAsian,
		resolvedLocalFonts: e.resolvedLocalFonts
	};
}
function Ss(e) {
	return e.verticalAllRotated ? {
		...e,
		verticalCJK: !1
	} : e;
}
var Cs = /* @__PURE__ */ new WeakMap();
function ws(e) {
	return Cs.get(e);
}
function Ts(e, t, n, r, i, a, o) {
	let s = i ? t.contentStartYPt - t.placement.startYPt : 0;
	return Object.freeze({
		kind: "paragraph",
		source: e,
		measured: t,
		lineStart: n,
		lineEnd: r,
		leadingSpacePt: s,
		trailingSpacePt: a ? o : 0
	});
}
function Es(e, t, n, r, i) {
	return Object.freeze({
		fragment: e,
		columnIndex: t,
		xPt: n,
		yPt: r,
		widthPt: i,
		heightPt: Za(e)
	});
}
function Ds(e, t, n) {
	return Ya(t, po(e, t), {
		startYPt: 0,
		paragraphXPt: 0,
		availableWidthPt: n,
		maximumYPt: e.pageH,
		suppressSpaceBefore: !0
	}, {
		context: e.ctx,
		fontFamilyClasses: e.fontFamilyClasses
	}, xs(e));
}
function Os(e, t, n, r) {
	let i = mo(r), a = El(e, t), o = Math.max(0, n - (a.left + a.right)), s = [];
	for (let t of e.content) if (t.type === "paragraph") {
		let e = t, n = Ds(i, e, o), r = Math.max(n.requestedSpaceAfterPt, Wl(e.borders)), a = n.markOnly ? 0 : n.lines.length, c = t.lineSlice, l = c ? c.start : 0, u = c ? Math.min(c.end, a) : a;
		s.push(Ts(e, n, l, u, l === 0, u >= a, r));
	} else if (t.type === "table") {
		let e = t, n = t, r = Ks(e, o, i), a = Jr(e, r, 1, (t, n) => vl(t, e, n, 1, i));
		s.push(eo({
			table: e,
			columnWidthsPt: r,
			rowHeightsPt: a,
			continuesFromPreviousPage: n.nestedSliceContinuesFromPrevious ?? !1,
			continuesOnNextPage: n.nestedSliceContinuesOnNext ?? !1,
			repeatedHeaderRowCount: 0,
			buildCellBlocks: (t, n) => Os(t, e, n, i)
		}));
	}
	return s;
}
var ks = /* @__PURE__ */ new WeakMap();
function As(e, t, n, r, i, a, o) {
	let s = eo({
		table: t,
		columnWidthsPt: n,
		rowHeightsPt: r,
		continuesFromPreviousPage: o.continuesFromPreviousPage,
		continuesOnNextPage: o.continuesOnNextPage,
		repeatedHeaderRowCount: o.repeatedHeaderRowCount,
		sourceRowIndexOf: o.sourceRowIndexOf,
		buildCellBlocks: (e, n) => Os(e, t, n, a)
	}), c = n.reduce((e, t) => e + t, 0);
	Cs.set(e, Object.freeze({
		fragment: s,
		columnIndex: o.columnIndex,
		xPt: o.xPt,
		yPt: o.yPt,
		widthPt: c,
		heightPt: Qa(s)
	})), ks.set(e, i);
}
function js(e) {
	if (e.tblInd != null && e.tblInd < 0 && e.jc === "left") return !0;
	for (let t of e.rows) for (let e of t.cells) for (let t of e.content) if (t.type === "table") {
		let e = t;
		if (e.tblpPr != null || js(e)) return !0;
	}
	return !1;
}
function Ms(e, t, n) {
	if (!Ic || t === void 0 || t.fragment.kind !== "table" || e.tblpPr != null || n.verticalCJK || js(e)) return !1;
	let r = ks.get(e);
	if (r === void 0) return !1;
	let i = n.contentW / n.scale;
	return Math.abs(r - i) <= 1e-6 * Math.max(1, Math.abs(i));
}
var Ns = !0;
function Ps(e, t, n, r, i) {
	let a = fo(n, t), o = i !== void 0 && Ns && n.floats.length === 0 && i.placement.wrap === void 0 && i.placement.startYPt === n.y && i.placement.paragraphXPt === r.paragraphXPt && i.placement.availableWidthPt === r.availableWidthPt && i.placement.maximumYPt === n.pageH && i.placement.suppressSpaceBefore === r.suppressSpaceBefore ? i : Ya(t, a, {
		startYPt: n.y,
		paragraphXPt: r.paragraphXPt,
		availableWidthPt: r.availableWidthPt,
		maximumYPt: n.pageH,
		suppressSpaceBefore: r.suppressSpaceBefore,
		wrap: n.floats.length > 0 ? Ka(n.floats) : void 0
	}, {
		context: n.ctx,
		fontFamilyClasses: n.fontFamilyClasses
	}, xs(n)), s = Math.max(o.requestedSpaceAfterPt, Wl(t.borders)), c = Ts(t, o, 0, o.markOnly ? 0 : o.lines.length, !0, !0, s);
	Cs.set(e, Es(c, r.columnIndex, r.paragraphXPt, o.placement.startYPt, r.availableWidthPt));
}
function Fs(e, t, n, r, i) {
	return Ya(t, fo(e, t), {
		startYPt: e.y,
		paragraphXPt: i,
		availableWidthPt: n,
		maximumYPt: e.pageH,
		suppressSpaceBefore: r,
		wrap: e.floats.length > 0 ? Ka(e.floats) : void 0
	}, {
		context: e.ctx,
		fontFamilyClasses: e.fontFamilyClasses
	}, xs(e));
}
function Is(e, t, n) {
	let r = n ? 0 : Wl(t.borders);
	return e.contentEndYPt - e.placement.startYPt + Math.max(e.requestedSpaceAfterPt, r);
}
function Ls(e, t, n, r = !1, i = 0, a = !1) {
	return bc(t) ? 0 : Is(Fs(e, t, n, r, i), t, a);
}
function Rs(e, t, n) {
	if (!qi(t)) return e;
	let r = t.linePitchPt * n;
	return r <= 0 ? e : e <= r ? r : Math.ceil(e / r) * r;
}
function zs(e, t) {
	return {
		type: e.docGrid.type,
		linePitchPt: t.lineGrid.active ? t.lineGrid.pitchPt : null,
		charSpacePt: t.characterGrid.active ? t.characterGrid.deltaPt : null
	};
}
function Bs(e, t) {
	return zs(t, po(t, e));
}
function Vs(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g) {
	let _ = d ?? (() => 0), v = f ?? (() => o), y = (t) => (l && (t.colIndex = l()), u && (t.colGeom = u), d && (t.colTopPt = (m ? ds(m().marginTop) : e.marginTop) + _()), p && (t.sectionHF = p()), m && (t.sectionGeom = m()), h && (t.sectionPageNumType = h()), g && (t.sectionTextDirection = g()), t);
	{
		let o = fo(e, t), u = zs(e, o), d = o.physicalIndentLeftPt, f = o.physicalIndentRightPt, p = Math.max(1, n() - d - f), h = null, g, b = (r) => Ya(t, o, {
			startYPt: e.y,
			paragraphXPt: i(),
			availableWidthPt: n(),
			maximumYPt: e.pageH,
			suppressSpaceBefore: h === null ? r : !0,
			wrap: e.floats.length > 0 ? Ka(e.floats) : void 0
		}, {
			context: e.ctx,
			fontFamilyClasses: e.fontFamilyClasses
		}, xs(e), h === null ? void 0 : {
			boundary: h,
			uniformRubyAdvancePt: g
		}), x = b(r), S = () => {
			let e = () => x.contentEndYPt - x.placement.startYPt + Math.max(x.requestedSpaceAfterPt, Wl(t.borders)), n = e(), i = a;
			return a > 0 && a + n - x.requestedSpaceAfterPt > v() && (c(a), i = _(), x = b(r), n = e()), s[s.length - 1].push(y(t)), { endY: i + n };
		};
		if (x.markOnly || x.lines.length === 0) return S();
		let C = () => x.lines.map((e, t) => {
			if (t === 0) return e.topYPt - x.placement.startYPt + e.advancePt;
			let n = x.lines[t - 1], r = n.topYPt + n.advancePt;
			return Math.max(0, e.topYPt - r) + e.advancePt;
		}), w = x.lines.map((e) => e.layout), T = C(), E = () => {
			x = b(r), p = Math.max(1, x.placement.availableWidthPt - d - f), w = x.lines.map((e) => e.layout), T = C();
		}, D = !wa(t), O = Math.max(x.requestedSpaceAfterPt, Wl(t.borders)), k = 0, A = !1, j = () => {
			if (k === 0 || t.numbering != null || wa(t) || e.verticalCJK || e.floats.length > 0 || x.placement.wrap !== void 0) return;
			let r = n(), i = 1e-6 * Math.max(1, Math.abs(r));
			if (Math.abs(x.placement.availableWidthPt - r) <= i) return;
			let a = w[k - 1].consumedEnd;
			if (!a) return;
			let o = {
				measured: x,
				lines: w,
				lineExtents: T,
				paraW: p,
				boundary: h,
				uniformRubyAdvancePt: g
			};
			h = a, g = x.uniformRubyAdvancePt;
			let s = b(!0);
			if (s.markOnly || s.lines.length === 0) {
				h = o.boundary, g = o.uniformRubyAdvancePt;
				return;
			}
			x = s, p = Math.max(1, x.placement.availableWidthPt - d - f), w = x.lines.map((e) => e.layout), T = C(), k = 0, A = !0;
		}, M = a;
		for (; k < w.length;) {
			let r = v() - M, a = k, o = 0, f = a, h = Yr(a, w.length, r, (e) => {
				for (; f < e;) o += T[f], f++;
				return o;
			}), g = h.fitValue, b = h.end;
			if (b === a) {
				if (M > 0) {
					c(M), M = _(), k === 0 ? E() : j();
					continue;
				}
				b = a + 1, g += T[a];
			}
			let S = Xr({
				widowControl: t.widowControl !== !1,
				start: a,
				end: b,
				totalLines: w.length,
				canRelocate: M > 0
			});
			if (S.kind === "dropLastLine" && (b--, g -= T[b], S = Xr({
				widowControl: !0,
				start: a,
				end: b,
				totalLines: w.length,
				canRelocate: M > 0
			})), S.kind === "relocate") {
				c(M), M = _(), E();
				continue;
			}
			let C = b === w.length;
			C && (g += O);
			let N = {
				...t,
				type: "paragraph",
				lineSlice: {
					start: a,
					end: b,
					...A ? { continues: !0 } : {}
				}
			};
			D && Vc(N, w, {
				paraW: p,
				firstIndent: t.indentFirst,
				tabOriginPx: d,
				gridDeltaPx: Ri(u, 1),
				hasFloats: x.placement.wrap !== void 0,
				kinsoku: e.kinsoku
			});
			{
				let r = m ? ds(m().marginTop) : e.marginTop, o = Ts(t, x, a, b, a === 0 && !A, C, O);
				Cs.set(N, Es(o, l ? l() : 0, i(), r + M, n()));
			}
			s[s.length - 1].push(y(N)), k = b, M += g, C || (c(M), M = _(), j());
		}
		return { endY: M };
	}
}
function Hs(e, t, n) {
	return Us(e, t, n).rowHeightsPt;
}
function Us(e, t, n) {
	let r = Ks(t, n, e), i = Kr(t, r, 1, (n, r) => vl(n, t, r, 1, e));
	return {
		colWidthsPt: r,
		rowContentHeightsPt: i,
		rowHeightsPt: qr(t, i, 1)
	};
}
function Ws(e, t, n) {
	return Hs(e, t, n).reduce((e, t) => e + t, 0);
}
function Gs(e, t, n) {
	let { ctx: r, fontFamilyClasses: i } = n, a = 0, o = (e) => {
		for (let t of e.runs) {
			if (t.type !== "text") continue;
			let e = t;
			if (!e.text) continue;
			let n = e.rtl === !0 || e.cs === !0;
			r.font = Ai(n ? e.boldCs ?? !1 : e.bold, n ? e.italicCs ?? !1 : e.italic, n ? e.fontSizeCs ?? e.fontSize : e.fontSize, n ? e.fontFamilyCs ?? e.fontFamily : e.fontFamily, i);
			for (let t of e.text.split("	")) for (let e of _a(t)) {
				let t = e.replace(/\s+$/u, "");
				if (!t) continue;
				let n = ca(t) ? Math.max(...[...t].map((e) => r.measureText(e).width)) : r.measureText(t).width;
				n > a && (a = n);
			}
		}
	};
	for (let t of e.content) t.type === "paragraph" && o(t);
	if (a === 0) return 0;
	let s = El(e, t);
	return a + s.left + s.right;
}
function Ks(e, t, n) {
	let r = e.colWidths.length;
	if (r === 0) return [];
	let i = e.colWidths, a = e.tblpPr ? Math.max(t, n.pageWidth) : t, o = Array(r).fill(0);
	for (let t of e.rows) {
		let a = Br(t, r);
		for (let s of t.cells) {
			let t = Math.min(Math.max(s.colSpan, 1), r - a), c = Gs(s, e, n);
			if (c > 0) if (t === 1) c > o[a] && (o[a] = c);
			else {
				let e = i.slice(a, a + t), n = e.reduce((e, t) => e + t, 0);
				for (let r = 0; r < t; r++) {
					let i = c * (n > 0 ? e[r] / n : 1 / t);
					i > o[a + r] && (o[a + r] = i);
				}
			}
			a += t;
		}
	}
	let s = (e) => {
		let t = e.reduce((e, t) => e + t, 0);
		if (t <= a || t <= 0) return e;
		let n = o.reduce((e, t) => e + t, 0);
		if (n >= a) {
			let t = a / n;
			return n > 0 ? o.map((e) => e * t) : e.map(() => a / r);
		}
		let i = e.slice(), s = Array(r).fill(!1);
		for (let t = 0; t < r; t++) {
			let t = a, n = 0;
			for (let a = 0; a < r; a++) s[a] ? t -= i[a] : n += e[a];
			if (n <= 0) break;
			let c = !1;
			for (let a = 0; a < r; a++) {
				if (s[a]) continue;
				let r = t * (e[a] / n);
				r < o[a] ? (i[a] = o[a], s[a] = !0, c = !0) : i[a] = r;
			}
			if (!c) break;
		}
		return i;
	};
	if (e.layout === "fixed") {
		let e = i.slice(), t = e.reduce((e, t) => e + t, 0);
		if (t > a && t > 0) {
			let n = a / t;
			return e.map((e) => e * n);
		}
		return e;
	}
	let c = e.widthPt != null || e.widthPct != null;
	if (i.reduce((e, t) => e + t, 0) > 0 && c) return s(i.map((e, t) => Math.max(e, o[t])));
	let l = Array(r).fill(0), u = Array(r).fill(!1), d = (e) => e.widthPt == null ? e.widthPct == null ? null : e.widthPct / 5e3 * t : e.widthPt;
	for (let t of e.rows) {
		let e = Br(t, r);
		for (let n of t.cells) {
			let t = Math.min(Math.max(n.colSpan, 1), r - e);
			if (t === 1) {
				let t = d(n);
				t != null && (t > l[e] && (l[e] = t), u[e] = !0);
			}
			e += t;
		}
	}
	for (let t of e.rows) {
		let e = Br(t, r);
		for (let n of t.cells) {
			let t = Math.min(Math.max(n.colSpan, 1), r - e);
			if (t > 1) {
				let r = d(n);
				if (r != null) {
					let n = i.slice(e, e + t), a = n.reduce((e, t) => e + t, 0), o = n.reduce((t, n, r) => t + (u[e + r] ? l[e + r] : n), 0);
					if (r > o) {
						let s = r - o;
						for (let r = 0; r < t; r++) {
							let o = a > 0 ? n[r] / a : 1 / t, c = u[e + r] ? l[e + r] : i[e + r];
							l[e + r] = c + s * o, u[e + r] = !0;
						}
					}
				}
			}
			e += t;
		}
	}
	return s(l.map((e, t) => Math.max(u[t] ? e : i[t], o[t])));
}
function qs(e, t) {
	return t <= 0 ? !0 : !e.rows[t].cells.some((e) => e.vMerge === !1);
}
function Js(e, t, n) {
	let r = Br(e, n);
	for (let n of e.cells) {
		if (t >= r && t < r + n.colSpan) return n;
		r += n.colSpan;
	}
	return null;
}
function Ys(e, t, n, r, i) {
	let a = e[t], o = Br(a, i), s = a.cells.map((a) => {
		let s = o;
		if (o += a.colSpan, a.vMerge !== !1) return a;
		let c = -1, l = null;
		for (let n = t - 1; n >= 0; n--) {
			let t = Js(e[n], s, i);
			if (!t) break;
			if (t.vMerge === !0) {
				c = n, l = t;
				break;
			}
			if (t.vMerge !== !1) break;
		}
		return !l || r && c < n ? a : {
			...l,
			colSpan: a.colSpan,
			vMerge: !0,
			content: []
		};
	});
	return {
		...a,
		cells: s
	};
}
function Xs(e, t, n, r) {
	e.tableColWidthsPt = t, e.tableRowHeightsPt = n, e.tableLayoutInputs = {
		scale: 1,
		contentWPt: r
	};
}
function Zs(e, t, n, r) {
	return Gr(e, n, 1, (e, n) => vl(e, t, n, 1, r));
}
function Qs(e, t, n) {
	return {
		...e,
		cells: e.cells.map((e) => ({
			...e,
			content: e.content.slice(t, n)
		}))
	};
}
function $s(e, t, n, r, i) {
	if (t.isHeader || t.cantSplit || t.rowHeightRule === "exact" || t.cells.some((e) => e.vMerge === !1)) return null;
	let a = Math.max(0, ...t.cells.map((e) => e.content.length));
	if (a <= 1) return null;
	let o = [], s = [], c = 0;
	for (; c < a;) {
		let l = c + 1, u = Infinity;
		for (let o = c + 1; o <= a; o++) {
			let a = Zs(Qs(t, c, o), e, n, i);
			if ((a <= r || u === Infinity) && (l = o, u = a), a > r) break;
		}
		let d = Qs(t, c, l);
		o.push(d), s.push(Number.isFinite(u) ? u : Zs(d, e, n, i)), c = l;
	}
	if (o.length > 1) for (let e = 0; e < o.length - 1; e++) o[e].pageCutBottom = !0;
	return o.length > 1 ? {
		rows: o,
		heights: s
	} : null;
}
function ec(e, t, n) {
	{
		let r = po(n, e), i = zs(n, r), a = r.physicalIndentLeftPt, o = r.physicalIndentRightPt, s = Math.max(1, t - a - o), c = Ya(e, r, {
			startYPt: 0,
			paragraphXPt: 0,
			availableWidthPt: t,
			maximumYPt: n.pageH,
			suppressSpaceBefore: !0
		}, {
			context: n.ctx,
			fontFamilyClasses: n.fontFamilyClasses
		}, xs(n));
		return c.markOnly || c.lines.length === 0 ? null : {
			lines: c.lines.map((e) => e.layout),
			lineHeights: c.lines.map((e) => e.advancePt),
			inputs: {
				paraW: s,
				firstIndent: e.indentFirst,
				tabOriginPx: a,
				gridDeltaPx: Ri(i, 1),
				hasFloats: !1,
				kinsoku: n.kinsoku
			}
		};
	}
}
function tc(e, t, n, r) {
	let i = 0;
	for (let e = n; e < r; e++) i += t[e] ?? 0;
	return n === 0 && (i += e.spaceBefore), r >= t.length && (i += Math.max(e.spaceAfter, Wl(e.borders))), i;
}
function nc(e, t, n, r) {
	let i = {
		...e,
		type: "paragraph",
		lineSlice: {
			start: n,
			end: r
		}
	};
	return wa(e) || Vc(i, t.lines, t.inputs), i;
}
function rc(e, t, n) {
	return {
		...e,
		type: "table",
		rows: e.rows.slice(t, n),
		nestedSliceContinuesFromPrevious: t > 0,
		nestedSliceContinuesOnNext: n < e.rows.length
	};
}
function ic(e, t, n, r) {
	let { rowHeightsPt: i } = Us(r, e, t);
	if (i.length <= 1) return null;
	let a = 0, o = 0, s = 0, c = 0;
	for (; o < i.length;) {
		let t = i[o];
		if (o > 0 && a + t > n) {
			if (qs(e, o)) break;
			if (s > 0) {
				o = s, a = c;
				break;
			}
		}
		o > 0 && qs(e, o) && (s = o, c = a), a += t, o++;
	}
	return o <= 0 || o >= e.rows.length || !qs(e, o) ? null : {
		before: rc(e, 0, o),
		after: rc(e, o, e.rows.length),
		beforeHeight: a,
		afterHeight: i.slice(o).reduce((e, t) => e + t, 0)
	};
}
function ac(e, t, n, r) {
	let i = [], a = 0, o = null, s = 0, c = (e) => e.lineSlice, l = (e, t, n = c(e)) => {
		if (e.type !== "paragraph") return t;
		let r = e, i = !!n && n.start > 0, a = i ? 0 : r.spaceBefore, l = _c(i ? null : o, r, s, a);
		return t - (l.suppressBefore ? a : 0) - l.overlap;
	}, u = (e, t, n = c(e), r) => {
		if (i.push(e), a += l(e, t, n), e.type === "paragraph") {
			let t = e;
			o = t, s = !n || r == null || n.end >= r ? t.spaceAfter : 0;
		} else o = null, s = 0;
	}, d = (e) => {
		if (e.type !== "paragraph") return { rawHeight: Ol(r, e, t, 1) };
		let n = e, i = ec(n, t, r);
		if (!i) return { rawHeight: Ol(r, e, t, 1) };
		let a = c(e), o = {
			start: Math.max(0, a?.start ?? 0),
			end: Math.min(i.lines.length, a?.end ?? i.lines.length)
		};
		return {
			rawHeight: tc(n, i.lineHeights, o.start, o.end),
			slice: o,
			totalLines: i.lines.length
		};
	}, f = (e) => {
		let t = 0, n = null, r = 0;
		for (let i of e) {
			let e = d(i);
			if (i.type !== "paragraph") {
				t += e.rawHeight, n = null, r = 0;
				continue;
			}
			let a = i, o = !!e.slice && e.slice.start > 0, s = o ? 0 : a.spaceBefore, c = _c(o ? null : n, a, r, s);
			t += e.rawHeight - (c.suppressBefore ? s : 0) - c.overlap, n = a, r = !e.slice || e.totalLines == null || e.slice.end >= e.totalLines ? a.spaceAfter : 0;
		}
		return t;
	};
	for (let o = 0; o < e.length; o++) {
		let s = e[o], d = s.type === "paragraph" ? s : null, p = d ? ec(d, t, r) : null, m = c(s), h = p ? {
			start: Math.max(0, m?.start ?? 0),
			end: Math.min(p.lines.length, m?.end ?? p.lines.length)
		} : m, g = d && p ? tc(d, p.lineHeights, h?.start ?? 0, h?.end ?? p.lines.length) : Ol(r, s, t, 1), _ = l(s, g, h);
		if (a + _ <= n) {
			u(s, g, h, p?.lines.length);
			continue;
		}
		if (s.type !== "paragraph") {
			if (s.type === "table") {
				let c = ic(s, t, n - a, r);
				if (c) {
					i.push(c.before), a += c.beforeHeight;
					let t = [c.after, ...e.slice(o + 1)], n = c.afterHeight + f(e.slice(o + 1));
					return {
						before: i,
						after: t,
						beforeHeight: a,
						afterHeight: n
					};
				}
			}
			let c = e.slice(o), l = f(c);
			return i.length > 0 ? {
				before: i,
				after: c,
				beforeHeight: a,
				afterHeight: l
			} : null;
		}
		if (!p) {
			let t = e.slice(o), n = f(t);
			return i.length > 0 ? {
				before: i,
				after: t,
				beforeHeight: a,
				afterHeight: n
			} : null;
		}
		let v = d ?? s, y = h?.start ?? 0, b = h?.end ?? p.lines.length, x = Yr(y, b, n, (e) => {
			let t = tc(v, p.lineHeights, y, e);
			return a + l(s, t, {
				start: y,
				end: e
			});
		}), S = x.end === y ? 0 : x.end, C = S === 0 ? 0 : tc(v, p.lineHeights, y, S), w = S === 0 ? 0 : l(s, C, {
			start: y,
			end: S
		});
		if (S === 0) {
			let t = e.slice(o), n = f(t);
			return i.length > 0 ? {
				before: i,
				after: t,
				beforeHeight: a,
				afterHeight: n
			} : null;
		}
		if (S >= b) {
			u(s, g, h, p.lines.length);
			continue;
		}
		i.push(nc(v, p, y, S)), a += w;
		let T = [nc(v, p, S, b), ...e.slice(o + 1)], E = f(T);
		return {
			before: i,
			after: T,
			beforeHeight: a,
			afterHeight: E
		};
	}
	return {
		before: i,
		after: [],
		beforeHeight: a,
		afterHeight: 0
	};
}
function oc(e, t, n, r, i) {
	if (t.isHeader || t.cantSplit || t.rowHeightRule === "exact" || t.cells.some((e) => e.vMerge === !1)) return null;
	let a = [], o = [], s = [], c = [], l = /* @__PURE__ */ new Map(), u = !1, d = !1, f = Br(t, n.length);
	for (let p of t.cells) {
		let t = mo(i), m = Math.min(p.colSpan, n.length - f), h = n.slice(f, f + m).reduce((e, t) => e + t, 0), g = f;
		f += m;
		let _ = El(p, e), v = Math.max(0, r - _.top - _.bottom), y = ac(Al(p.content), h - _.left - _.right, v, t);
		if (!y) return null;
		a.push({
			...p,
			content: y.before
		}), o.push({
			...p,
			content: y.after
		}), s.push(_.top + _.bottom + y.beforeHeight), p.vMerge === !0 ? y.after.length > 0 && l.set(g, _.top + _.bottom + y.afterHeight) : c.push(_.top + _.bottom + y.afterHeight), u ||= y.before.length > 0, d ||= y.after.length > 0;
	}
	if (!u || !d) return null;
	let p = t.rowHeight != null && (t.rowHeightRule === "atLeast" || t.rowHeightRule === "auto") ? t.rowHeight : 0;
	return {
		rows: [{
			...t,
			cells: a,
			rowHeight: null,
			rowHeightRule: "auto",
			pageCutBottom: !0
		}, {
			...t,
			cells: o,
			rowHeight: null,
			rowHeightRule: "auto"
		}],
		heights: [Math.max(p, ...s), Math.max(0, ...c)],
		restartRemainders: l.size > 0 ? l : void 0
	};
}
function sc(e, t, n, r, i) {
	return oc(e, t, n, r, i) ?? $s(e, t, n, r, i);
}
function cc(e, t, n, r, i, a) {
	let o = e.rows;
	if (!o[n]) return;
	let s = n, c = (t) => {
		let n = o[t], i = Br(n, r.length);
		for (let a of n.cells) {
			let n = Math.min(a.colSpan, r.length - i);
			if (a.vMerge === !0) {
				let n = Vr(e, t, i);
				n > s && (s = n);
			}
			i += n;
		}
	};
	c(n);
	for (let e = n + 1; e <= s && e < o.length; e++) c(e);
	for (let a = n + 1; a <= s && a < o.length; a++) t[a] = Zs(o[a], e, r, i);
	for (let c = n; c <= s && c < o.length; c++) {
		let s = o[c], l = Br(s, r.length);
		for (let o of s.cells) {
			let s = Math.min(o.colSpan, r.length - l);
			if (o.vMerge === !0) {
				let u = r.slice(l, l + s).reduce((e, t) => e + t, 0), d = c === n ? a?.get(l) ?? vl(o, e, u, 1, i) : vl(o, e, u, 1, i), f = Vr(e, c, l), p = 0;
				for (let e = c; e <= f; e++) p += t[e] ?? 0;
				d > p && f < t.length && (t[f] += d - p);
			}
			l += s;
		}
	}
}
function lc(e, t, n, r, i, a = !1) {
	let o = !1, s = [], c = [], l = [], u = [];
	for (let d = 0; d < e.rows.length; d++) {
		let f = e.rows[d], p = t[d], m = a ? qr({
			...e,
			rows: [f]
		}, [p], 1)[0] : p;
		if (m > r) {
			let t = Math.max(0, m - p), a = sc(e, f, n, Math.max(0, r - t), i);
			if (a) {
				s.push(...a.rows), c.push(...a.heights), l.push(...a.rows.map(() => d)), u.push({
					finalPieceIdx: s.length - 1,
					restartRemainders: a.restartRemainders
				}), o = !0;
				continue;
			}
		}
		s.push(f), c.push(p), l.push(d);
	}
	if (!o) return null;
	let d = {
		...e,
		rows: s
	};
	for (let e of u) cc(d, c, e.finalPieceIdx, n, i, e.restartRemainders);
	return {
		table: d,
		rowHs: c,
		sourceRowIndexByRow: l
	};
}
function uc(e, t, n, r) {
	if (e.length === 0) throw Error("expected at least one safe table endpoint");
	for (let i = e.length - 1; i >= 0; i--) {
		let a = e[i], o = r?.endpoint === a ? r.value : n(a);
		if (o.usedPt <= t || i === 0) return {
			endpoint: a,
			value: o
		};
	}
	throw Error("unreachable table endpoint selection");
}
function dc(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _) {
	let v = c ?? (() => 0), y = e, b = e.rows, x = t, S = h?.slice() ?? b.map((e, t) => t), C = b.length, w = 0;
	for (; w < C && b[w].isHeader;) w++;
	let T = b.slice(0, w), E = S.slice(0, w), D = x.slice(0, w), O = D.reduce((e, t) => e + t, 0), k = (e, t, n) => {
		let r = b.slice(e, t), i = e > 0 && r.length > 0 && r[0].cells.some((e) => e.vMerge === !1) ? [Ys(b, e, w, n, y.colWidths.length), ...r.slice(1)] : r, a = n ? [...T, ...i] : i, o = n ? [...D, ...x.slice(e, t)] : x.slice(e, t), s = {
			...y,
			rows: a
		}, c = p?.rowHeightsAreContent ? qr(s, o, 1) : o;
		return {
			rows: a,
			heightsPt: c,
			usedPt: c.reduce((e, t) => e + t, 0)
		};
	}, A = n, j = 0, M = !0;
	for (; j < C;) {
		let e = !M && w > 0 && j >= w, t = r - A, n = k(j, j + 1, e).usedPt, h = r - v(), T = Math.max(0, x[j] + t - n), D = j;
		for (; D + 1 < C && !qs(y, D + 1);) D++;
		let N = k(j, D + 1, e).usedPt, P = N > r, F = (e) => qs(y, e) || P && e > j && e <= D;
		if (m && (n > t || N > t) && T > 0 && j >= w) {
			let e = sc(y, b[j], m.colWidthsPt, T, m.state);
			if (e && e.heights[0] <= T) {
				let t = S[j];
				b = [
					...b.slice(0, j),
					...e.rows,
					...b.slice(j + 1)
				], x = [
					...x.slice(0, j),
					...e.heights,
					...x.slice(j + 1)
				], S = [
					...S.slice(0, j),
					...e.rows.map(() => t),
					...S.slice(j + 1)
				], y = {
					...y,
					rows: b
				}, C = b.length, cc(y, x, j + e.rows.length - 1, m.colWidthsPt, m.state, e.restartRemainders);
				continue;
			}
		}
		if (n > t && A > v() && n <= h) {
			a(A), A = v(), M = !1;
			continue;
		}
		let I = p?.rowHeightsAreContent ? e ? O : 0 : k(j, j, e).usedPt, L = j, R = j, z = I, B = [];
		for (; L < C;) {
			let n = I + x[L];
			if (L > j && n > t) {
				if (F(L)) {
					let r = p?.rowHeightsAreContent ? k(j, L + 1, e).usedPt : n, i = Math.max(0, x[L] + t - r);
					if (m && i > 0 && L >= w) {
						let e = sc(y, b[L], m.colWidthsPt, i, m.state);
						if (e && e.heights[0] <= i) {
							let t = S[L];
							b = [
								...b.slice(0, L),
								...e.rows,
								...b.slice(L + 1)
							], x = [
								...x.slice(0, L),
								...e.heights,
								...x.slice(L + 1)
							], S = [
								...S.slice(0, L),
								...e.rows.map(() => t),
								...S.slice(L + 1)
							], y = {
								...y,
								rows: b
							}, C = b.length, cc(y, x, L + e.rows.length - 1, m.colWidthsPt, m.state, e.restartRemainders);
							continue;
						}
					}
					break;
				}
				if (R > j) {
					L = R, I = z;
					break;
				}
			}
			L > j && F(L) && (R = L, z = I, B.push(L)), I = n, L++;
		}
		let V = k(j, L, e);
		if (V.usedPt > t && L > j + 1) {
			let n = uc([
				j + 1,
				...B.filter((e) => e > j + 1 && e < L),
				...L > j + 1 ? [L] : []
			], t, (t) => k(j, t, e), {
				endpoint: L,
				value: V
			});
			L = n.endpoint, V = n.value;
		}
		let ee = V.rows, H = {
			...y,
			type: "table",
			rows: ee
		};
		o && (H.colIndex = o()), s && (H.colGeom = s), c && l != null && (H.colTopPt = l + v()), u && (H.sectionHF = u()), d && (H.sectionGeom = d()), f && (H.sectionPageNumType = f()), _ && (H.sectionTextDirection = _());
		let U = V.heightsPt;
		if (p && Xs(H, p.colWidthsPt, U, p.contentWPt), g) {
			let t = e ? w : 0;
			g(H, {
				heightsPt: U,
				continuesFromPreviousPage: j > 0,
				continuesOnNextPage: L < C,
				repeatedHeaderRowCount: t,
				sourceRowIndexOf: (e) => e < t ? E[e] : S[j + (e - t)]
			});
		}
		i[i.length - 1].push(H), I = V.usedPt, A += I, j = L, M = !1, j < C && (a(A), A = v());
	}
	return A;
}
function fc(e, t, n, r, i, a, o, s, c, l, u) {
	let d = r.length, f = 0, p = !0, m = (n, i, a) => {
		let o = a ? t : {
			...t,
			vertAnchor: "text",
			tblpY: 0,
			tblpYSpec: void 0
		}, s = {
			...e,
			type: "table",
			rows: e.rows.slice(n, i),
			tblpPr: o
		}, c = qr(s, r.slice(n, i), 1);
		return {
			element: s,
			heightsPt: c,
			usedPt: c.reduce((e, t) => e + t, 0)
		};
	};
	for (; f < d;) {
		let t = p ? o() + i : s(), h = c() - t;
		if (m(f, f + 1, p).usedPt > h && t > s()) {
			l(), p = !1;
			continue;
		}
		let g = 0, _ = f, v = [];
		for (; _ < d;) {
			let t = r[_];
			if (_ > f && g + t > h && qs(e, _)) break;
			g += t, _++, (_ === d || qs(e, _)) && v.push(_);
		}
		let y = m(f, _, p);
		if (y.usedPt > h && v.length > 1) {
			let e = uc(v, h, (e) => m(f, e, p), {
				endpoint: _,
				value: y
			});
			y = e.value, _ = e.endpoint;
		}
		let b = y.element;
		Xs(b, n, y.heightsPt, a), u?.(b), f = _, p = !1, f < d && l();
	}
	return s();
}
function pc(e, t, n, r, i) {
	return r && t && e.first ? e.first : i && n && e.even ? e.even : e.default ?? null;
}
function mc(e, t, n) {
	let r = (t) => e[t]?.[0]?.sectionHF, i = r(t), a = i?.headers ?? n.headers, o = i?.footers ?? n.footers, s = i?.titlePage ?? n.section.titlePage, c = t === 0 || r(t - 1) !== i, l = e[t], u = l ? Bo.get(l) : void 0;
	return {
		headers: a,
		footers: o,
		titlePage: s,
		isFirstPageOfSection: c,
		geom: l?.[0]?.sectionGeom ?? u?.geom ?? fs(n.section)
	};
}
function hc(e, t, n) {
	let r = {
		...n,
		y: t
	};
	Ec(e.body, r);
}
function gc(e, t) {
	let n = {
		...t,
		y: 0,
		dryRun: !0,
		floats: []
	};
	return Ec(e.body, n), n.y;
}
function _c(e, t, n, r) {
	let i = !!(e?.styleId && e.styleId === t.styleId), a = !!(i && e?.contextualSpacing), o = !!(i && t.contextualSpacing);
	return a && o ? {
		suppressBefore: !0,
		overlap: n
	} : o ? {
		suppressBefore: !0,
		overlap: 0
	} : a ? {
		suppressBefore: !1,
		overlap: n + Math.min(n, r)
	} : {
		suppressBefore: !1,
		overlap: Math.min(n, r)
	};
}
function vc(e, t, n, r) {
	if (t <= 0) return n[t];
	let i = _c(e[t - 1], e[t], r[t - 1], n[t]);
	return r[t - 1] + (i.suppressBefore ? 0 : n[t]) - i.overlap;
}
function yc(e) {
	return !(e.runs ?? []).some((e) => {
		let t = e;
		return t.type === "text" ? (t.text ?? "").length > 0 : !0;
	});
}
function bc(e) {
	return e.markVanish === !0 && yc(e);
}
function xc(e) {
	let t = !1;
	for (let n of e.runs ?? []) if (!(n.type === "text" && (n.text ?? "").length === 0)) {
		if (n.type === "shape") {
			t = !0;
			continue;
		}
		if (n.type === "image" && n.anchor) {
			t = !0;
			continue;
		}
		if (n.type === "chart" && n.anchor) {
			t = !0;
			continue;
		}
		return !1;
	}
	return t;
}
function Sc(e) {
	return (e.runs ?? []).some((e) => e.type === "image" && !e.anchor);
}
function Cc(e, t) {
	let n = e[t];
	return !n || n.type !== "paragraph" || e[t + 1]?.type !== "sectionBreak" ? !1 : yc(n);
}
function wc(e, t, n) {
	let r = 0, i = null, a = 0;
	for (let o of e) if (o.type === "paragraph") {
		let e = o, s = _c(i, e, a, e.spaceBefore);
		r += t(o) - (s.suppressBefore ? e.spaceBefore : 0) * n - s.overlap * n, i = e, a = e.spaceAfter;
	} else r += t(o), i = null, a = 0;
	return r;
}
function Tc(e, t, n, r) {
	let i = ds(n.marginTop) * r, a = (n.pageHeight - ds(n.marginBottom)) * r;
	e.save(), e.strokeStyle = "#000000", e.lineWidth = Math.max(1, Math.round(.5 * r));
	for (let n = 0; n < t.length - 1; n++) {
		let o = t[n].xPt + t[n].wPt, s = t[n + 1].xPt, c = Math.round((o + s) / 2 * r) + .5;
		e.beginPath(), e.moveTo(c, i), e.lineTo(c, a), e.stroke();
	}
	e.restore();
}
function Ec(e, t, n, r = 0) {
	let i = null, a = 0;
	t.pageAnchorPrescanned = /* @__PURE__ */ new Set(), pl(e, 0, t);
	let o = t.deferFront;
	t.deferFront = [];
	let s = -1, c, l = (e, t) => (e.colGeom ?? n) === (t.colGeom ?? n) && (e.colIndex ?? 0) === (t.colIndex ?? 0), u = (e, t) => {
		if (!t || t.type !== "paragraph" || !l(e, t)) return null;
		let n = t;
		return n.framePr ? null : n;
	}, d = (t) => u(e[t], e[t - 1]), f = (t) => u(e[t], e[t + 1]);
	for (let o = 0; o < e.length; o++) {
		let l = e[o], u = l.colGeom ?? n, p = !!u && u.length > 1, m = l.colIndex ?? 0;
		if (p && (u !== c || m !== s)) {
			let e = u[Math.min(m, u.length - 1)];
			t.contentX = e.xPt * t.scale, t.contentW = e.wPt * t.scale, m > s && u === c && (t.y = (l.colTopPt ?? t.marginTop) * t.scale + r), i = null, a = 0, s = m, c = u;
		} else if (!p && u && u.length === 1 && u !== c) {
			c && c.length > 1 && l.colTopPt != null && (t.y = Math.max(t.y, l.colTopPt * t.scale + r));
			let e = u[0];
			t.contentX = e.xPt * t.scale, t.contentW = e.wPt * t.scale, i = null, a = 0, s = m, c = u;
		}
		if (l.type === "paragraph") {
			let n = l, r = l.lineSlice;
			if (n.framePr) {
				Mc(n, t, Ac(e, l, t));
				continue;
			}
			if (l.collapsedSpacer || l.hiddenCollapsed) continue;
			let s = !!l.sectionBreakSpacer, c = _c(i, n, a, s ? 0 : n.spaceBefore), u = c.suppressBefore || s, p = l.leadsCollapsedRun ? a : c.overlap;
			t.y -= p * t.scale;
			let m = !!r && r.start > 0 || r?.continues === !0, h = ql(n.borders) ? {
				suppressTop: Jl(d(o), n),
				suppressBottom: Jl(n, f(o))
			} : void 0, g = ws(l);
			Lc(n, g, t, r === void 0) ? to(g, t, {
				suppressSpaceBefore: u || m,
				borderMerge: h,
				continuesParagraph: r?.continues === !0
			}) : Fc(n, t, u || m, r, !1, h), i = n, a = n.spaceAfter;
		} else if (l.type === "table") {
			let e = l, n = ws(l);
			Ms(e, n, t) ? no(n, t) : wl(e, t), e.tblpPr || (i = null, a = 0);
		}
	}
	let p = t.deferFront ?? [];
	t.deferFront = o;
	for (let e of p) e();
}
function Dc(e, t) {
	let n = null, r = 0;
	for (let i = 0; i < e.length; i++) {
		let a = e[i], o = _c(n, a, r, a.spaceBefore), s = o.suppressBefore;
		t.y -= o.overlap * t.scale;
		let c = e[i - 1] ?? null, l = e[i + 1] ?? null;
		Fc(a, t, s, void 0, !1, ql(a.borders) ? {
			suppressTop: Jl(c, a),
			suppressBottom: Jl(a, l)
		} : void 0), n = a, r = a.spaceAfter;
	}
}
function Oc(e) {
	switch (e) {
		case "left": return "left";
		case "right": return "right";
		default: return "center";
	}
}
function kc(e, t, n) {
	let { ctx: r, scale: i, dryRun: a } = t, { grid: o, paraHasRuby: s, contentX: c, indLeft: l, paraW: u, borderX: d, borderW: f, textAreaTopY: p, paragraphStartY: m, markTop: h, totalLines: g, lineSlice: _, borderMerge: v } = n, y = Math.max(0, h - p);
	h > t.y && (t.y = h);
	let b = t.y, x = ea(e, i, o, s, t.docEastAsian, r, t.fontFamilyClasses, e.lineSpacing, t.resolvedLocalFonts);
	if (e.shading && !a) {
		r.fillStyle = `#${e.shading}`;
		let t = Bl(d, b, f, x, e.borders, v, i);
		r.fillRect(t.x, t.y, t.w, t.h);
	}
	t.y += x, e.borders && !a && Ul(r, d, b, f, x, e.borders, i, t.dpr, v), (!_ || _.end >= g) && (t.y += Math.max(e.spaceAfter, Wl(e.borders, v)) * i), (!_ || _.start === 0 && !_.continues) && qc(e, t, m + y, "front", m);
}
function Ac(e, t, n) {
	let r = e.indexOf(t);
	for (let t = r + 1; t < e.length; t++) {
		let r = e[t];
		if (r.type !== "paragraph") continue;
		let i = r;
		if (!i.framePr) return ea(i, n.scale, Bs(i, n), fo(n, i).hasRuby, n.docEastAsian, n.ctx, n.fontFamilyClasses, i.lineSpacing, n.resolvedLocalFonts);
	}
	let i = t;
	return ea(i, n.scale, Bs(i, n), fo(n, i).hasRuby, n.docEastAsian, n.ctx, n.fontFamilyClasses, i.lineSpacing, n.resolvedLocalFonts);
}
function jc(e, t, n) {
	let r = e.framePr, { scale: i } = t, a = t.y, o = Bs(e, t), s = fo(t, e), c = s.hasRuby, l = Ea(e.runs, Ss(t)), u = 1e5, d = l.length === 0 ? [] : Da(t.ctx, l, u, 0, i, e.tabStops, void 0, t.fontFamilyClasses, 0, t.kinsoku, Ri(o, i), t.defaultTabPt, u, s.baseRtl, s.isJustified, s.stretchLastLine);
	return Ar(r, t, a, d.length === 0 ? 0 : Math.max(...d.map((e) => e.segments.reduce((e, t) => e + t.measuredWidth, 0))), d.reduce((t, n) => t + Xi(e.lineSpacing, n.ascent, n.descent, i, o, c, n.intendedSingle, c ? s.hasEastAsianText : n.eastAsian ?? !1, n.gridCountSingle), 0), n);
}
function Mc(e, t, n) {
	let r = e.framePr, i = t.y, a = jc(e, t, n), o = t.contentX, s = t.contentW;
	t.contentX = a.x, t.contentW = Math.max(a.w, a.exRight - a.x), t.y = a.y, Fc(e, t, !0, void 0, !0), t.contentX = o, t.contentW = s, t.y = i, Mr(a, r, t);
}
function Nc(e, t, n, r) {
	let { ctx: i, scale: a, fontFamilyClasses: o } = t, s = "", c = 0, l = null, u = 0, d = 0, f = 0;
	if (e.numbering) {
		s = e.numbering.text, c = e.numbering.tab * a;
		let p = e.numbering.suff || "tab", m = e.numbering.picBulletImagePath;
		if (m) {
			let n = t.images.get(_o(m));
			if (n) {
				let t = Ql(e.numbering, e);
				l = {
					bmp: n,
					w: t.w * a,
					h: t.h * a
				};
			}
		}
		let h;
		l ? h = l.w : (i.font = Ai(!1, !1, Pi(e) * a, Xl(e.numbering), o), h = i.measureText(Zl(e.numbering)).width), f = h;
		let g = e.numbering.jc || "left";
		d = g === "right" ? -h : g === "center" ? -h / 2 : 0;
		let _ = r + d + h;
		if (p !== "tab") u = _ + (p === "space" ? i.measureText(" ").width : 0);
		else if (_ > 0) {
			let r = ba(n + _, (e.tabStops ?? []).map((e) => ({
				pos: e.pos * a,
				alignment: e.alignment,
				leader: e.leader
			})), t.defaultTabPt * a);
			r && (u = r.pos - n);
		}
	}
	return {
		numTab: c,
		picBullet: l,
		numBodyOffset: u,
		markerJcShiftPx: d,
		markerWidthPx: f,
		hasMarker: s !== "" || l !== null
	};
}
function Pc(e, t, n, r, i, a, o, s, c) {
	if (!c) {
		let t = e + n + i + a;
		return {
			left: t,
			right: t + o
		};
	}
	let l = e + t - r - i - a, u = l - o, d = e + t - r + s;
	return {
		left: Math.min(u, d - o),
		right: Math.max(l, d)
	};
}
function Fc(e, t, n = !1, r, i = !1, a, o) {
	let { ctx: s, scale: c, contentX: l, contentW: u, defaultColor: d, dryRun: f, fontFamilyClasses: p } = t, m = po(t, e), h = t.y;
	n || (t.y += e.spaceBefore * c), i || fl(e, t, h), (!r || r.start === 0 && !r.continues) && qc(e, t, h, "behind"), t.y = qn(t.y, t.floats, l, l + u);
	let g = t.y, _ = m.baseRtl, v = i ? 0 : m.physicalIndentLeftPt * c, y = i ? 0 : m.physicalIndentRightPt * c, b = i ? 0 : e.indentFirst * c, { numTab: x, picBullet: S, numBodyOffset: C, markerJcShiftPx: w, markerWidthPx: T, hasMarker: E } = Nc(e, t, v, b), D = l + v, O = D + b, k = u - v - y, A = Vl(l, u, v, y, b, _, E ? Pc(l, u, v, y, b, w, T, x, _) : void 0), j = E && (!_ || (e.numbering?.suff || "tab") === "tab" && b < 0), M = Ea(e.runs, Ss(t)), N = m.hasRuby, P = Bs(e, t), F = () => {
		if (t.floats.length === 0) return g;
		let n = 10 * c;
		return Gn(g, $l(e, c), n, D, k, t.floats, l, l + u).topY;
	};
	if (M.length === 0) {
		kc(e, t, {
			grid: P,
			paraHasRuby: N,
			contentX: l,
			indLeft: v,
			paraW: k,
			borderX: A.x,
			borderW: A.w,
			textAreaTopY: g,
			paragraphStartY: h,
			markTop: F(),
			totalLines: 0,
			lineSlice: void 0,
			borderMerge: a
		});
		return;
	}
	let I = t.floats.length > 0 ? {
		startPageY: t.y,
		paraX: D,
		columnXPt: l,
		columnWidthPt: u,
		floats: t.floats,
		paragraphMarkLineStartWidth: $l(e, c),
		lineBoxH: (t, n, r, i, a, o) => Xi(e.lineSpacing, t, n, c, P, N, i ?? 0, N ? m.hasEastAsianText : a ?? !1, o),
		pageH: t.pageH
	} : void 0, L = ho(t.storyContext ?? uo, t.verticalCJK, i, I !== void 0, m, e, M), R = j ? C : O - D, z = Ri(P, c), B = e, V = u / c - (i ? 0 : m.physicalIndentLeftPt) - (i ? 0 : m.physicalIndentRightPt), ee = i ? 0 : m.physicalIndentLeftPt, H = j ? C / c : e.indentFirst, U = Ri(P, 1), W = Hc && B.layoutLines !== void 0 && B.layoutLinesInputs !== void 0 && B.layoutLinesInputs.scale === 1 && !I && !B.layoutLinesInputs.hasFloats && Math.abs(B.layoutLinesInputs.paraW - V) <= 1e-6 * Math.max(1, Math.abs(V)) && B.layoutLinesInputs.firstIndent === H && B.layoutLinesInputs.tabOriginPx === ee && B.layoutLinesInputs.gridDeltaPx === U && Ca(B.layoutLinesInputs.kinsoku, t.kinsoku), te = i ? 0 : m.physicalIndentRightPt, ne = k + y, G = V + te, K = o === void 0 ? W ? Oa(B.layoutLines, c, s, t.fontFamilyClasses, z, L) : I ? Da(s, M, k, R, c, e.tabStops, I, t.fontFamilyClasses, v, t.kinsoku, z, t.defaultTabPt, ne, _, Ln(e.alignment), Rn(e.alignment)) : Oa(Da(s, M, V, H, 1, e.tabStops, void 0, t.fontFamilyClasses, ee, t.kinsoku, U, t.defaultTabPt, G, _, Ln(e.alignment), Rn(e.alignment)), c, s, t.fontFamilyClasses, z, L) : Oa([...o], c, s, t.fontFamilyClasses, z, L), re = (() => {
		if (M.some((e) => "isTab" in e)) return null;
		let t = e.tabStops ?? [];
		if (t.length === 0) return null;
		let n = t.reduce((e, t) => t.pos < e.pos ? t : e);
		if (n.alignment !== "decimal") return null;
		let r = e.runs.map((e) => e.text ?? "").join("").trim();
		return r === "" || !/^[+\-(]?[\d., ]+\)?%?$/.test(r) ? null : n.pos * c - v;
	})();
	if (K.length === 0) {
		kc(e, t, {
			grid: P,
			paraHasRuby: N,
			contentX: l,
			indLeft: v,
			paraW: k,
			borderX: A.x,
			borderW: A.w,
			textAreaTopY: g,
			paragraphStartY: h,
			markTop: F(),
			totalLines: K.length,
			lineSlice: r,
			borderMerge: a
		});
		return;
	}
	let q = N ? Rs(Math.max(0, ...K.map((t) => Xi(e.lineSpacing, t.ascent, t.descent, c, P, !0, t.intendedSingle, m.hasEastAsianText))), P, c) : 0, J = (t) => N ? q : Xi(e.lineSpacing, t.ascent, t.descent, c, P, !1, t.intendedSingle, t.eastAsian ?? !1, t.gridCountSingle), Y = r ? r.start : 0, X = r ? r.end : K.length, ie = Math.min(X, K.length);
	if (e.shading && !f) {
		let t = zl(K, Y, ie, g, J);
		s.fillStyle = `#${e.shading}`;
		let n = Bl(A.x, g, A.w, t, e.borders, a, c);
		s.fillRect(n.x, n.y, n.w, n.h);
	}
	let ae = Ln(e.alignment), Z = Rn(e.alignment), oe = _ || Nn(M), se = In(e.alignment, _), ce = Ri(P, c), le = {
		ctx: s,
		scale: c,
		state: t,
		para: e,
		dryRun: f,
		defaultColor: d,
		fontFamilyClasses: p,
		contentX: l,
		contentW: u,
		lines: K,
		grid: P,
		paraHasRuby: N,
		paraX: D,
		firstLineX: O,
		paraW: k,
		indLeft: v,
		indFirst: b,
		continuesParagraph: r?.continues === !0,
		baseRtl: _,
		hasMarker: E,
		markerUsesBodyOffset: j,
		numTab: x,
		numBodyOffset: C,
		markerJcShiftPx: w,
		picBullet: S,
		isJustified: ae,
		stretchLastLine: Z,
		alignEdge: se,
		paraNeedsBidi: oe,
		decimalAutoTabPx: re,
		drawGridDeltaPx: ce,
		canonicalTextScale: L,
		lineHForLine: J
	};
	for (let e = Y; e < ie; e++) zc(e, le);
	if (e.borders && !f) {
		let n = t.y - g;
		Ul(s, A.x, g, A.w, n, e.borders, c, t.dpr, a);
	}
	(!r || r.end >= K.length) && (t.y += Math.max(e.spaceAfter, Wl(e.borders, a)) * c), (!r || r.start === 0 && !r.continues) && qc(e, t, h);
}
var Ic = !0;
function Lc(e, t, n, r) {
	if (!Ic || t === void 0 || t.fragment.kind !== "paragraph" || e.numbering != null || n.floats.length !== 0 || n.verticalCJK || t.fragment.measured.placement.wrap !== void 0 || wa(e)) return !1;
	let i = n.contentW / n.scale, a = t.fragment.measured.placement.availableWidthPt, o = Math.abs(a - i) <= 1e-6 * Math.max(1, Math.abs(i)), s = !r || t.fragment.source === e;
	return o && s;
}
function Rc(e, t, n, r, i, a) {
	Fc(e, t, r, i, !1, a, n);
}
function zc(e, t) {
	let { ctx: n, scale: r, state: i, para: a, dryRun: o, defaultColor: s, fontFamilyClasses: c, contentX: l, contentW: u, lines: d, grid: f, paraHasRuby: p, paraX: m, firstLineX: h, paraW: g, indLeft: _, indFirst: v, continuesParagraph: y, baseRtl: b, hasMarker: x, markerUsesBodyOffset: S, numTab: C, numBodyOffset: w, markerJcShiftPx: T, picBullet: E, isJustified: D, stretchLastLine: O, alignEdge: k, paraNeedsBidi: A, decimalAutoTabPx: j, drawGridDeltaPx: M, canonicalTextScale: N, lineHForLine: F } = t, I = d[e], L = !!i.verticalCJK && !i.verticalAllRotated, R = e === 0 && !y, z = e === d.length - 1;
	I.topY !== void 0 && I.topY > i.y && (i.y = I.topY);
	let B = F(I), V = I.visibleAscent ?? I.ascent, ee = I.visibleDescent ?? I.descent, H = I.visibleIntendedSingle ?? I.intendedSingle, U = V + ee, W = a.lineSpacing?.rule === "auto" && !p && !qi(f), te = W && (a.lineSpacing?.value ?? 1) < 1, ne = W && !te ? Math.max(U, H) : B, G = i.y + (ne - U) / 2 + V, K = m + I.xOffset, re = I.availWidth, q = R && !b ? x ? K + w : K + v : K, J = b && R ? re - (S ? w : v) : re, Y = A ? Fn(I.segments, b) : null;
	A && (n.textAlign = "left");
	let X = I.segments.length, ie = Y ? Y.order[X - 1] : X - 1, ae = I.segments.reduce((e, t) => e + t.measuredWidth, 0), Z = J - (q - K) - ae, oe = z || (I.endsWithBreak ?? !1), se = D && (!oe || O), ce = null, le = 0, ue = null, de = 0;
	if (!A) for (let e = 0; e < X; e++) {
		let t = I.segments[e];
		if (!("text" in t) || /\S/.test(t.text)) {
			de = e;
			break;
		}
	}
	let fe = 0;
	if (!se && Z < 0) {
		let e = Xn(I.segments.map((e) => "text" in e && e.fitTextRegionIndex === void 0 ? { text: e.text } : {}), Z, de, A ? ie : X, I.ascent);
		e && (ce = e.perSeg, le = e.perGap, fe = Yn(e));
	}
	let Q = Z - fe, pe = 0, me = I.segments.length === 1 && "mathNodes" in I.segments[0] && I.segments[0].display ? I.segments[0] : null, he = (me ? Oc(me.jc ?? i.mathDefJc ?? "centerGroup") : null) ?? k;
	if (he === "right" ? pe = Q : he === "center" ? pe = Q / 2 : he === "justify" && b && !se && (pe = Q), j != null && ae > 0 && (pe = Math.max(0, m + j - ae - q)), q += pe, R && x && !o) if (E) {
		let { bmp: e, w: t, h: r } = E, i = G - r, a = b ? q + ae + C - t : K + v + T;
		n.drawImage(e, a, i, t, r);
	} else {
		let e = Pi(a) * r;
		n.font = Ai(!1, !1, e, Xl(a.numbering), c);
		let t = a.numbering.color ?? (a.numbering.colorAuto ? null : a.paragraphMarkColor);
		if (n.fillStyle = t ? `#${t}` : s, b) {
			let e = n.textAlign, t = n.direction;
			n.textAlign = "left", n.direction = "rtl";
			let r = Zl(a.numbering), i = n.measureText(r).width;
			n.fillText(r, q + ae + C - i, G), n.textAlign = e, n.direction = t;
		} else {
			let t = Zl(a.numbering), r = K + v + T;
			L ? di(n, t, r, G, e, 0) : n.fillText(t, r, G);
		}
		n.fillStyle = s;
	}
	if (se) {
		let e = J - (q - K) - ae, t = -I.ascent * .25, i = I.segments.map((e) => "text" in e && e.fitTextRegionIndex === void 0 ? { text: e.text } : {}), o = L ? null : io(a.alignment), s = o ? ao(n, I.segments, e, o, r, c, M) : null;
		s && (ue = s.perSeg);
		let l = s?.residualPx ?? e, u = Jn(i, l, de, A ? ie : X, t, l > 0, a.alignment === "thaiDistribute" && l > 0);
		ce = u ? u.perSeg : null, le = u ? u.perGap : 0;
	}
	let ge = null, _e = () => {
		if (!ge) return;
		let e = ge;
		ge = null;
		let t = Math.max(1, e.border.width * r), i = (e.border.space ?? 0) * r;
		n.strokeStyle = e.border.color ? `#${e.border.color}` : s, n.lineWidth = t, n.strokeRect(e.left - i, e.top - i, e.right - e.left + 2 * i, e.bottom - e.top + 2 * i);
	};
	for (let e = 0; e < X; e++) {
		let t = Y ? Y.order[e] : e, l = I.segments[t];
		if (Y && (n.direction = Y.rtl[t] ? "rtl" : "ltr"), "text" in l || _e(), "isTab" in l) {
			!o && l.leader && l.leader !== "none" && l.measuredWidth > 1 && Wc(n, l.leader, q, G, l.measuredWidth, l.fontSize * r, s, l.bold, l.italic), q += l.measuredWidth;
			continue;
		}
		if ("imagePath" in l) {
			o || Gc(n, l, q, G, r, i.images, !!i.verticalCJK), q += l.measuredWidth;
			continue;
		}
		if ("mathNodes" in l) {
			let e = _i.get(l.mathNodes);
			if (!o && e) {
				let t = l.fontSize * r, i = e.widthEm * t, a = (e.ascentEm + e.descentEm) * t, o = G - e.ascentEm * t;
				n.drawImage(e.img, q, o, i, a);
			} else !o && l.fallbackText && (n.font = Ai(!1, !1, l.fontSize * r, null, c), n.fillStyle = l.color ?? s, n.fillText(l.fallbackText, q, G));
			q += l.measuredWidth;
			continue;
		}
		let u = l, d = ue?.get(t), f = d?.text ?? u.text, p = ce?.get(t), m = !d && u.fitTextRegionIndex === void 0 ? p : void 0, h = p?.trailingGap ?? !1, g = (m?.internalStretch ?? 0) + (d?.advanceDeltaPx ?? 0);
		if (!o) {
			let e = N && r !== 1, o = ji(u, r), l = ji(u, e ? 1 : r), d = -(u.position ?? 0) * r, p = (u.vertAlign === "super" ? -u.fontSize * r * .35 : u.vertAlign === "sub" ? u.fontSize * r * .15 : 0) + d;
			n.font = Ai(u.bold, u.italic, l, u.fontFamily, c);
			let h = u.charScale ?? 1, _ = u.fitTextPerGapPx ?? (u.charSpacing ?? 0) * r, v = n.fontKerning;
			u.kerning != null && (n.fontKerning = u.fontSize >= u.kerning ? "normal" : "none");
			let y = u.measuredWidth + g, b = y + (m?.trailingGap && !A && /\s$/.test(u.text) ? le : 0), x = G + p - o * .85, S = o * 1.1;
			u.highlight && (n.fillStyle = ro[u.highlight] ?? "#FFFF00", n.fillRect(q, x, b, S)), u.background && (n.fillStyle = `#${u.background}`, n.fillRect(q, x, b, S));
			let C = u.border && u.border.style !== "none" && u.border.style !== "nil" ? u.border : null;
			if (C) {
				let e = x, t = e + S;
				ge && Yl(ge.border, C) ? (ge.right = q + b, ge.top = Math.min(ge.top, e), ge.bottom = Math.max(ge.bottom, t)) : (_e(), ge = {
					border: C,
					left: q,
					right: q + b,
					top: e,
					bottom: t
				});
			} else _e();
			let w = i.showTrackChanges && !!u.revision, T = w ? So(u.revision.author) : null, E, D = u.background ?? a.shading ?? i.containerShading ?? null;
			E = T || (u.color ? `#${u.color}` : u.colorAuto || D != null ? Te(D) : s), n.fillStyle = E;
			let O = Vi(u, M), k = Bi(f, O), j = f, F = q, I = 0;
			if (Y && Y.rtl[t] === !0 && !L && /\s$/u.test(f)) {
				let e = f.replace(/\s+$/u, "");
				if (e.length > 0) {
					let t = n.letterSpacing;
					n.letterSpacing = "0px";
					let i = n.measureText(f).width, a = n.measureText(e).width;
					n.letterSpacing = t, I = Ki({
						...u,
						text: f
					}, i, M, r) - Ki({
						...u,
						text: e
					}, a, M, r), j = e, F = q + I;
				}
			}
			let R = e ? r : 1, z = e ? 0 : G + p, V = (t) => e ? (t - q) / r : t;
			if (e && (n.save(), n.translate(q, G + p), n.scale(r, r)), L && u.tateChuYoko) fi(n, f, q, G + p, o, y, h, !!u.tateChuYokoCompress);
			else if (L) di(n, f, q, G + p, o, Gi(u, M, r), h, u.verticalRun === !0);
			else if (u.fitTextPerGapPx !== void 0) {
				let e = !!(Y && Y.rtl[t]), r = u.fitTextTrailingPadPx ?? 0, i = q + (e ? r : 0) + I, a = h !== 1, o = n.letterSpacing, s = V(i);
				a && (n.save(), n.translate(s, 0), n.scale(h, 1)), n.letterSpacing = `${u.fitTextPerGapPx / R / h}px`, n.fillText(j, a ? 0 : s, z), n.letterSpacing = o, a && n.restore();
			} else if (k !== 0) {
				let e = [...f], t = (e) => n.measureText(e).width, r = O + _, i = h !== 1, a = Me(e, m?.splitBefore ?? [], le / R / h, t, r / R / h), o = n.letterSpacing, s = V(q);
				i && (n.save(), n.translate(s, 0), n.scale(h, 1));
				let c = i ? 0 : s;
				n.letterSpacing = `${r / R / h}px`;
				for (let { text: e, dx: t } of a) n.fillText(e, c + t, z);
				n.letterSpacing = o, i && n.restore();
			} else if (m && m.splitBefore.length > 0) {
				let e = [...f], t = h !== 1, r = V(q), i = t ? 0 : r, a = n.letterSpacing;
				if (t && (n.save(), n.translate(r, 0), n.scale(h, 1)), m.splitBefore.length === e.length - 1) n.letterSpacing = `${(le + _) / R / h}px`, n.fillText(f, i, z);
				else {
					let t = (e) => n.measureText(e).width;
					for (let { text: r, dx: a } of Me(e, m.splitBefore, le / R / h, t, _ / R / h)) n.letterSpacing = `${_ / R / h}px`, n.fillText(r, i + a, z);
				}
				n.letterSpacing = a, t && n.restore();
			} else if (h !== 1) {
				n.save(), n.translate(V(F), 0), n.scale(h, 1);
				let e = n.letterSpacing;
				_ !== 0 && (n.letterSpacing = `${_ / R / h}px`), n.fillText(j, 0, z), n.letterSpacing = e, n.restore();
			} else if (_ !== 0) {
				let e = n.letterSpacing;
				n.letterSpacing = `${_ / R}px`, n.fillText(j, V(F), z), n.letterSpacing = e;
			} else n.fillText(j, V(F), z);
			if (e && (n.restore(), n.font = Ai(u.bold, u.italic, o, u.fontFamily, c)), u.kerning != null && (n.fontKerning = v), u.ruby) {
				let e = u.ruby.fontSizePt * r, t = Ai(u.bold, u.italic, e, u.fontFamily, c);
				n.save(), n.font = t;
				let i = n.measureText(u.ruby.text).width, a = q + (y - i) / 2, s = u.ruby.hpsRaisePt == null ? G + p - o * .85 - e * .1 : G + p - u.ruby.hpsRaisePt * r;
				n.fillStyle = E, n.fillText(u.ruby.text, a, s), n.restore();
			}
			if (u.emphasisMark) {
				let e = Ga(u.emphasisMark, o), t = !!m && m.splitBefore.length > 0 && m.splitBefore.length === [...u.text].length - 1, r = k === 0 ? t ? le : 0 : O, i = Wa(u.text, (e) => n.measureText(e).width, q, r), a = o * .06, s = e.above ? x - a - e.radius : x + S + a + e.radius;
				n.save(), n.fillStyle = E, n.strokeStyle = E;
				for (let { centerX: t } of i) e.shape === "circle" ? (n.lineWidth = Math.max(.5, e.radius * .35), n.beginPath(), n.arc(t, s, e.radius, 0, Math.PI * 2), n.stroke()) : e.shape === "comma" ? (n.beginPath(), n.arc(t, s, e.radius, 0, Math.PI * 2), n.fill(), n.beginPath(), n.moveTo(t - e.radius * .5, s + e.radius * .2), n.lineTo(t + e.radius * .5, s + e.radius * .2), n.lineTo(t - e.radius * .1, s + e.radius * 1.4), n.closePath(), n.fill()) : (n.beginPath(), n.arc(t, s, e.radius, 0, Math.PI * 2), n.fill());
				n.restore();
			}
			if (i.onTextRun && u.text) {
				let e = hi(q, i.y, i.verticalPhys?.cssWidthPx ?? 0, !!i.verticalCJK), t = !L && !u.tateChuYoko ? Gi(u, M, r) : 0;
				i.onTextRun({
					text: u.text,
					x: e ? e.left : q,
					y: e ? e.top : i.y,
					w: y,
					h: B,
					fontSize: o,
					font: n.font,
					...t === 0 ? {} : { letterSpacingPx: t },
					transform: e?.transform,
					hyperlink: u.hyperlink,
					eastAsianVert: L && u.tateChuYoko ? !0 : void 0
				});
			}
			let ee = E, H = Math.max(.5, o * .05), U = w && u.revision?.kind === "insertion", W = w && u.revision?.kind === "deletion";
			if (u.underline || U) {
				let e = G + p + o * .12, t = U ? void 0 : u.underlineStyle;
				if (t) {
					let r = u.underlineColor && u.underlineColor !== "auto" ? `#${u.underlineColor}` : ee, a = Math.max(1, o * .05), s = e - Math.max(2, a);
					Ie(n, q, s, b, o, r, gn(t), i.dpr), n.setLineDash([]);
				} else {
					n.strokeStyle = !U && u.underlineColor && u.underlineColor !== "auto" ? `#${u.underlineColor}` : ee, n.lineWidth = H;
					let t = e + P(e, H, i.dpr);
					n.beginPath(), n.moveTo(q, t), n.lineTo(q + b, t), n.stroke();
				}
			}
			if (u.strikethrough || W) {
				n.strokeStyle = ee, n.lineWidth = H;
				let e = G + p - o * .3, t = e + P(e, H, i.dpr);
				n.beginPath(), n.moveTo(q, t), n.lineTo(q + b, t), n.stroke();
			}
			if (u.doubleStrikethrough) {
				n.strokeStyle = ee, n.lineWidth = H;
				let e = G + p - o * .35, t = G + p - o * .22, r = e + P(e, H, i.dpr), a = t + P(t, H, i.dpr);
				n.beginPath(), n.moveTo(q, r), n.lineTo(q + b, r), n.stroke(), n.beginPath(), n.moveTo(q, a), n.lineTo(q + b, a), n.stroke();
			}
		}
		q += u.measuredWidth + g, h && (q += le);
	}
	if (_e(), A && (n.direction = "ltr"), i.lineNumbering && i.lineNumberCounter !== void 0) {
		let e = i.lineNumberCounter;
		e % i.lineNumbering.countBy === 0 && !o && Bc(n, e, G, l, i.lineNumbering, r, i.defaultColor), i.lineNumberCounter = e + 1;
	}
	i.y += B;
}
function Bc(e, t, n, r, i, a, o) {
	e.save(), e.fillStyle = o, e.font = Ai(!1, !1, i.fontSizePt * a, null, {});
	let s = e.textAlign;
	e.textAlign = "right", e.fillText(String(t), r - i.distancePt * a, n), e.textAlign = s, e.restore();
}
function Vc(e, t, n) {
	let r = e;
	r.layoutLines = t, r.layoutLinesInputs = {
		scale: 1,
		...n
	};
}
var Hc = !0, Uc = !0;
function Wc(e, t, n, r, i, a, o, s, c) {
	let l = t === "hyphen" ? "-" : t === "underscore" || t === "heavy" ? "_" : t === "middleDot" ? "·" : ".";
	e.save(), e.font = `${`${c ? "italic " : ""}${s ? "bold " : ""}`}${a}px serif`, e.fillStyle = o;
	let u = e.measureText(l).width;
	if (u > 0) {
		let a = t === "dot" || t === "middleDot" ? u * 1.5 : u, o = u * .5, s = n + i - a - o;
		for (let t = n + o; t <= s; t += a) e.fillText(l, t, r);
	}
	e.restore();
}
function Gc(e, t, n, r, i, a, o) {
	if (t.anchor) return;
	let s = t.widthPt * i, c = t.heightPt * i, l = r - c, u = (t) => {
		o ? pi(e, n, l, s, c, t) : t(n, l, s, c);
	};
	if (t.chart) {
		let n = t.chart;
		u((t, r, a, o) => B(e, n, {
			x: t,
			y: r,
			w: a,
			h: o
		}, i));
		return;
	}
	let d = a.get(_o(t.imagePath, t.colorReplaceFrom, t.duotone));
	if (!d) return;
	let f = t.alpha != null && t.alpha < 1;
	f && (e.save(), e.globalAlpha *= t.alpha), u((n, r, i, a) => Kc(e, d, t, n, r, i, a)), f && e.restore();
}
function Kc(t, n, r, i, a, o, s) {
	let c = r.rotation ?? 0;
	if (c === 0 && !r.flipH && !r.flipV) {
		e(t, n, r.srcRect ?? void 0, i, a, o, s);
		return;
	}
	t.save(), t.translate(i + o / 2, a + s / 2), t.rotate(c * Math.PI / 180), t.scale(r.flipH ? -1 : 1, r.flipV ? -1 : 1), e(t, n, r.srcRect ?? void 0, -o / 2, -s / 2, o, s), t.restore();
}
function qc(e, t, n, r = "front", i = n) {
	if (t.dryRun) return;
	if (r === "behind") {
		let r = e.runs.filter((e) => e.type === "shape" && !!e.behindDoc).slice().sort((e, t) => (e.zOrder ?? 0) - (t.zOrder ?? 0));
		for (let e of r) {
			let r = e;
			Qc(r, t, Vn(r.wrapMode) ? i : n);
		}
		return;
	}
	if (t.deferFront) {
		let r = t.contentX, a = t.contentW;
		t.deferFront.push(() => {
			let o = t.contentX, s = t.contentW, c = t.deferFront;
			t.contentX = r, t.contentW = a, t.deferFront = null, qc(e, t, n, "front", i), t.contentX = o, t.contentW = s, t.deferFront = c;
		});
		return;
	}
	let a = e.runs.map((e, t) => {
		let n = e.type === "shape" ? e.zOrder : null;
		return {
			run: e,
			index: t,
			z: typeof n == "number" && Number.isFinite(n) ? n : t
		};
	}).sort((e, t) => e.z - t.z || e.index - t.index);
	for (let { run: e } of a) {
		if (e.type === "shape") {
			let r = e;
			if (r.behindDoc) continue;
			Qc(r, t, Vn(r.wrapMode) ? i : n);
			continue;
		}
		if (e.type === "chart") {
			let r = e;
			if (!r.anchor || Vn(r.wrapMode)) continue;
			let { x: i, y: a, w: o, h: s } = ll(r, t, n), c = r.chart;
			t.verticalCJK ? pi(t.ctx, i, a, o, s, (e, n, r, i) => B(t.ctx, c, {
				x: e,
				y: n,
				w: r,
				h: i
			}, t.scale)) : B(t.ctx, c, {
				x: i,
				y: a,
				w: o,
				h: s
			}, t.scale);
			continue;
		}
		if (e.type !== "image") continue;
		let r = e;
		if (!r.anchor || Vn(r.wrapMode)) continue;
		let a = t.images.get(_o(r.imagePath, r.colorReplaceFrom, r.duotone));
		if (!a) continue;
		let { x: o, y: s, w: c, h: l } = ll(r, t, n), u = r.alpha != null && r.alpha < 1;
		u && (t.ctx.save(), t.ctx.globalAlpha *= r.alpha), t.verticalCJK ? pi(t.ctx, o, s, c, l, (e, n, i, o) => Kc(t.ctx, a, r, e, n, i, o)) : Kc(t.ctx, a, r, o, s, c, l), u && t.ctx.restore();
	}
}
function Jc(e) {
	if (e) return {
		type: e.type,
		w: e.w,
		len: e.len
	};
}
function Yc(e, t, n) {
	if (t.verticalPhys) {
		let n = Yc(e, cl(t), t.contentX);
		return mi(n.x, n.y, n.w, n.h, t.verticalPhys.cssWidthPx);
	}
	let { scale: r } = t, i = e.widthPt * r, a = e.heightPt * r, o = e.anchorXPt, s = e.anchorYPt, c = e.groupWidthPt ?? null, l = e.groupHeightPt ?? null;
	if (e.widthPct != null) {
		let n = Ir(e.widthRelativeFrom, !1, t), a = (n.end - n.start) * e.widthPct / r;
		if (e.groupWidthPt != null && e.groupWidthPt > 0) {
			let t = a / e.groupWidthPt;
			i = e.widthPt * r * t, o = e.anchorXPt * t;
		} else i = a * r;
		c = a;
	}
	if (e.heightPct != null) {
		let i = Lr(e.heightRelativeFrom, !1, n, t), o = (i.end - i.start) * e.heightPct / r;
		if (e.groupHeightPt != null && e.groupHeightPt > 0) {
			let t = o / e.groupHeightPt;
			a = e.heightPt * r * t, s = e.anchorYPt * t;
		} else a = o * r;
		l = o;
	}
	return {
		x: Rr(e.anchorXAlign, e.anchorXFromMargin, o, i, t, e.anchorXRelativeFrom, e.pctPosH, c),
		y: zr(e.anchorYAlign, e.anchorYFromPara, s, a, n, t, e.anchorYRelativeFrom, e.pctPosV, l),
		w: i,
		h: a
	};
}
function Xc(e) {
	return e && e.fillType === "solid" ? `#${e.color}` : null;
}
function Zc(e, t, n, r, i, a, o, s, c, l = {}) {
	let u = t.string;
	if (!u || i <= 0 || a <= 0) return;
	e.save(), e.font = Ai(t.bold ?? !1, t.italic ?? !1, 100, t.fontFamily ?? null, l);
	let d = e.measureText(u), f = d.width || 100, p = (d.fontBoundingBoxAscent ?? d.actualBoundingBoxAscent ?? 100 * .8) + (d.fontBoundingBoxDescent ?? d.actualBoundingBoxDescent ?? 100 * .2) || 100, m = n + i / 2, h = r + a / 2;
	e.translate(m, h), o !== 0 && e.rotate(o * Math.PI / 180), e.scale(i / f, a / p), e.textAlign = "center", e.textBaseline = "middle", e.globalAlpha = Math.max(0, Math.min(1, c)), e.fillStyle = s ?? "#c0c0c0", e.fillText(u, 0, 0), e.restore();
}
function Qc(e, t, n) {
	if (t.verticalPhys) {
		let n = t.verticalPhys.cssWidthPx, { ctx: r } = t;
		r.save(), r.rotate(-Math.PI / 2), r.translate(-n, 0), Qc(e, cl(t), t.contentX), r.restore();
		return;
	}
	let { ctx: r, scale: i } = t, { x: a, y: o, w: s, h: c } = Yc(e, t, n), l = e.presetGeometry?.toLowerCase() ?? "", u = l === "line" || l.startsWith("straightconnector") || l.startsWith("bentconnector") || l.startsWith("curvedconnector"), d = l === "callout1" || l === "callout2" || l === "callout3" || l === "bordercallout1" || l === "bordercallout2" || l === "bordercallout3" || l === "accentcallout1" || l === "accentcallout2" || l === "accentcallout3" || l === "accentbordercallout1" || l === "accentbordercallout2" || l === "accentbordercallout3", f = d || l === "line" || l.startsWith("straightconnector") || l.startsWith("bentconnector");
	if (s < 0 || c < 0 || (u ? s === 0 && c === 0 : s === 0 || c === 0)) return;
	if (!u) {
		let n = al(e, {
			x: a,
			y: o,
			w: s,
			h: c
		}, r, i, t.fontFamilyClasses, t.images, t);
		a = n.x, o = n.y, s = n.w, c = n.h;
	}
	if (e.textPath && e.textPath.string.length > 0) {
		Zc(r, e.textPath, a, o, s, c, e.rotation ?? 0, Xc(e.fill), e.fillOpacity ?? 1, t.fontFamilyClasses);
		return;
	}
	let p = e.rotation ?? 0, m = e.flipH ?? !1, h = e.flipV ?? !1;
	r.save(), (p !== 0 || m || h) && (r.translate(a + s / 2, o + c / 2), p !== 0 && r.rotate(p * Math.PI / 180), m && r.scale(-1, 1), h && r.scale(1, -1), r.translate(-(a + s / 2), -(o + c / 2)));
	let g = e.presetGeometry?.toLowerCase() ?? "", _ = !!e.presetGeometry && K(g), v = e.adjValues ?? [], y = Ce(e.fill, r, a, o, s, c), b = e.stroke && (e.strokeWidth ?? 0) > 0 ? {
		color: e.stroke,
		width: e.strokeWidth ?? 0,
		dashStyle: e.strokeDash ?? void 0,
		lineCap: e.strokeCap ?? void 0,
		headEnd: Jc(e.headEnd),
		tailEnd: Jc(e.tailEnd)
	} : null, x = b ? () => {
		be(r, b, i), r.stroke();
	} : null;
	if (_ ? fe(r, g, a, o, s, c, [
		v[0] ?? null,
		v[1] ?? null,
		v[2] ?? null,
		v[3] ?? null,
		v[4] ?? null,
		v[5] ?? null,
		v[6] ?? null,
		v[7] ?? null
	], y, x, () => {}, f && (b?.headEnd || b?.tailEnd) ? { skipTrailingStroke: !0 } : void 0) : (r.beginPath(), e.presetGeometry ? Ve(r, e.presetGeometry, a, o, s, c, v[0] ?? null, v[1] ?? null, v[2] ?? null, v[3] ?? null) : Ae(r, e.subpaths, a, o, s, c), y && (r.fillStyle = y, r.fill()), x && x()), b && (b.headEnd || b.tailEnd) && (u || d)) {
		let t = te(l, a, o, s, c, e.adjValues ?? []);
		if (t) {
			if (r.setLineDash([]), f && t.vertices.length >= 2) {
				let e = t.vertices.map((e) => ({
					x: e.x,
					y: e.y
				}));
				if (b.tailEnd) {
					let t = ke(b.tailEnd, b, i);
					e[e.length - 1] = Ne(e[e.length - 1], e[e.length - 2], t);
				}
				if (b.headEnd) {
					let t = ke(b.headEnd, b, i);
					e[0] = Ne(e[0], e[1], t);
				}
				be(r, b, i), r.beginPath(), r.moveTo(e[0].x, e[0].y);
				for (let t = 1; t < e.length; t++) r.lineTo(e[t].x, e[t].y);
				r.stroke();
			}
			b.tailEnd && ze(r, t.end.x, t.end.y, t.end.angle, b.tailEnd, b, i), b.headEnd && ze(r, t.start.x, t.start.y, t.start.angle, b.headEnd, b, i);
		}
	}
	r.restore(), e.textBlocks && e.textBlocks.length > 0 && ol(e, a, o, s, c, r, i, t.fontFamilyClasses, t.images, t);
}
function $c(e, t, n, r) {
	let i = (e ?? 0) * r, a = (t ?? 0) * r;
	return i <= 0 || a <= 0 ? {
		w: n,
		h: n
	} : i <= n ? {
		w: i,
		h: a
	} : {
		w: n,
		h: n / i * a
	};
}
function el(e, t) {
	return {
		lIns: (e.textInsetL ?? 0) * t,
		rIns: (e.textInsetR ?? 0) * t
	};
}
function tl(e) {
	return e.lineSpacingRule ? {
		value: e.lineSpacingVal ?? 0,
		rule: e.lineSpacingRule
	} : null;
}
function nl(e) {
	return e === "vert" || e === "vert270" || e === "eaVert" || e === "mongolianVert" ? e : null;
}
function rl(e, t, n, r) {
	let i = e.ascent + e.descent, a = Xi(t, e.ascent, e.descent, n, r, !0, e.intendedSingle, e.eastAsian ?? !1);
	return {
		lineH: a,
		baselineOffset: (a - i) / 2 + e.ascent
	};
}
function il(e, t, n, r, i = {}, a = /* @__PURE__ */ new Map(), o) {
	let s = o ?? Aa(n, r, i, a), c = e.textBlocks ?? [], l = nl(e.textVert), { lIns: u, rIns: d } = el(e, r), f = (e.textInsetT ?? 0) * r, p = (e.textInsetB ?? 0) * r, m = Math.max(0, t - u - d), h = (e) => {
		let t = (e.indentLeft ?? 0) * r, n = (e.indentRight ?? 0) * r, i = (e.indentFirst ?? 0) * r, a = e.numbering && i < 0 ? 0 : i, o = Math.max(0, m - t - n);
		return {
			leftPx: t,
			firstPx: a,
			paraW: o,
			firstLineW: Math.max(0, o - a)
		};
	}, g = (e, t) => {
		if (l && t.hasRuby) return rl(t, tl(e), r, s.docGrid).lineH;
		let a = null, o = !1, c = 0, u = "";
		for (let e of t.segments) {
			if (!("text" in e)) continue;
			let t = e;
			u += t.text;
			let n = Li.test(t.text) && !t.ruby;
			(!a || t.fontSize > a.fontSize) && (a = t, o = n);
			let i = t.fontSize * r;
			c = Math.max(c, Mi(t, i, n), Ni(t, i, n));
		}
		let d = Li.test(u), f = (a?.fontSize ?? e.fontSizePt) * r, p = a?.fontFamily ?? e.fontFamily ?? null, m = a?.eaFloorFamily ?? e.fontFamily ?? null, h = a ? Mi(a, f, o) : ue(p, f, o), g = (a ? Ni(a, f, o) : ue(m, f, o)) > h ? m : p;
		n.font = Ai(a?.bold ?? e.bold ?? !1, a?.italic ?? e.italic ?? !1, f, g, i);
		let _ = n.measureText("Mg"), v = V(g, f, _.fontBoundingBoxAscent ?? _.actualBoundingBoxAscent ?? f * .8, _.fontBoundingBoxDescent ?? _.actualBoundingBoxDescent ?? f * .2, o), y = e.lineSpacingRule ? {
			value: e.lineSpacingVal ?? 0,
			rule: e.lineSpacingRule
		} : null, b = d;
		return Xi(y, v.ascent, v.descent, r, s.docGrid, t.hasRuby ?? !1, c, b, t.gridCountSingle);
	}, _ = c.map((e) => (e.spaceBefore ?? 0) * r), v = c.map((e) => (e.spaceAfter ?? 0) * r), y = (e) => vc(c, e, _, v);
	n.save();
	try {
		let e = 0;
		for (let t = 0; t < c.length; t++) {
			let a = c[t], o = h(a);
			if (e += y(t), a.imagePath) {
				e += $c(a.imageWidthPt ?? 0, a.imageHeightPt ?? 0, o.firstLineW, r).h;
				continue;
			}
			let l = Ea((a.runs && a.runs.length > 0 ? a.runs : [{
				text: a.text,
				fontSizePt: a.fontSizePt,
				color: a.color,
				fontFamily: a.fontFamily,
				bold: a.bold,
				italic: a.italic
			}]).map(ka), s), u = Ue(a.bidi, a.text) === "rtl", d = Da(n, l, o.paraW, o.firstPx, r, a.tabStops ?? [], void 0, i, o.leftPx, s.kinsoku, 0, s.defaultTabPt, o.paraW, u, Ln(a.alignment), Rn(a.alignment));
			e += d.reduce((e, t) => e + g(a, t), 0);
		}
		return f + e + p;
	} finally {
		n.restore();
	}
}
function al(e, t, n, r, i = {}, a = /* @__PURE__ */ new Map(), o) {
	let { x: s, y: c, w: l, h: u } = t;
	if (e.textAutofit !== "sp" || !e.textBlocks || e.textBlocks.length === 0) return {
		x: s,
		y: c,
		w: l,
		h: u
	};
	if (nl(e.textVert) === null) {
		let t = il(e, l, n, r, i, a, o);
		return Number.isFinite(t) && t > 0 ? {
			x: s,
			y: c,
			w: l,
			h: t
		} : {
			x: s,
			y: c,
			w: l,
			h: u
		};
	}
	if (e.textBlocks.some((e) => e.imagePath)) return {
		x: s,
		y: c,
		w: l,
		h: u
	};
	let d = il(e, u, n, r, i, a, o);
	return Number.isFinite(d) && d > 0 ? {
		x: s,
		y: c,
		w: d,
		h: u
	} : {
		x: s,
		y: c,
		w: l,
		h: u
	};
}
function ol(e, t, n, r, i, a, o, s = {}, c = /* @__PURE__ */ new Map(), l) {
	let u = nl(e.textVert), d = u === "eaVert" || u === "mongolianVert", f = u === "mongolianVert", p = u === "vert270" ? -1 : 1;
	if (u) {
		let e = r, o = i;
		a.save(), a.translate(t + e / 2, n + o / 2), a.rotate(Math.PI / 2 * p), t = -o / 2, n = -e / 2, r = o, i = e;
	}
	let m = l ?? Aa(a, o, s, c), h = m.defaultColor ?? "#000000", g = e.defaultTextColor ? `#${e.defaultTextColor}` : h, _ = e.textBlocks ?? [], { lIns: v, rIns: y } = el(e, o), b = (e.textInsetT ?? 0) * o, x = (e.textInsetB ?? 0) * o, S = t + v, C = Math.max(0, r - v - y), w = n + b, T = Math.max(0, i - b - x), E = (e, t) => f ? 2 * w + T - e - t + x - v : e, D = (e) => {
		let t = (e.indentLeft ?? 0) * o, n = (e.indentRight ?? 0) * o, r = (e.indentFirst ?? 0) * o, i = e.numbering && r < 0 ? 0 : r, a = Math.max(0, C - t - n);
		return {
			leftPx: t,
			firstPx: i,
			markerFirstPx: r,
			paraW: a,
			firstLineW: Math.max(0, a - i)
		};
	}, O = (e, t, n, r, i, c, l, u, d, f = !1, p = !1, m = f) => {
		let h = ue(e ?? null, r, m), g = ue(c ?? null, r, m), _ = l ?? Math.max(h, g), v = g > h ? c ?? null : e ?? null;
		a.font = Ai(t, n, r, v, s);
		let y = a.measureText("Mg"), b = V(v, r, y.fontBoundingBoxAscent ?? y.actualBoundingBoxAscent ?? r * .8, y.fontBoundingBoxDescent ?? y.actualBoundingBoxDescent ?? r * .2, m), x = b.ascent + b.descent, S = i.lineSpacingRule ? {
			value: i.lineSpacingVal ?? 0,
			rule: i.lineSpacingRule
		} : null, C = Xi(S, b.ascent, b.descent, o, d, p, _, f, u);
		return {
			lineH: C,
			baselineOffset: ((S?.rule === "auto" && !p && !qi(d) ? Math.max(x, _) : C) - x) / 2 + b.ascent
		};
	}, k = (e, t) => {
		if (u && t.hasRuby) return rl(t, tl(e), o, m.docGrid);
		let n = null, r = !1, i = 0, a = "";
		for (let e of t.segments) {
			if (!("text" in e)) continue;
			let t = e;
			a += t.text;
			let s = t.fontSize * o, c = Li.test(t.text) && !t.ruby;
			(!n || t.fontSize > n.fontSize) && (n = t, r = c), i = Math.max(i, Mi(t, s, c), Ni(t, s, c));
		}
		let s = (n?.fontSize ?? e.fontSizePt) * o, c = Li.test(a);
		return O(n?.fontFamily ?? e.fontFamily, n?.bold ?? e.bold ?? !1, n?.italic ?? e.italic ?? !1, s, e, n?.eaFloorFamily ?? e.fontFamily, i, t.gridCountSingle, m.docGrid, c, t.hasRuby ?? !1, r);
	}, A = _.map((e) => {
		let t = D(e);
		if (e.imagePath) {
			if (u) {
				let n = $c(e.imageHeightPt ?? 0, e.imageWidthPt ?? 0, t.firstLineW, o), r = n.w, i = n.h;
				return {
					kind: "image",
					fitW: i,
					fitH: r,
					crossExtent: i,
					ind: t
				};
			}
			let { w: n, h: r } = $c(e.imageWidthPt ?? 0, e.imageHeightPt ?? 0, t.firstLineW, o);
			return {
				kind: "image",
				fitW: n,
				fitH: r,
				ind: t
			};
		}
		let n = Ea((e.runs && e.runs.length > 0 ? e.runs : [{
			text: e.text,
			fontSizePt: e.fontSizePt,
			color: e.color,
			fontFamily: e.fontFamily,
			bold: e.bold,
			italic: e.italic
		}]).map(ka), m), r = Ue(e.bidi, e.text) === "rtl", i = Da(a, n, t.paraW, t.firstPx, o, e.tabStops ?? [], void 0, s, t.leftPx, m.kinsoku, 0, m.defaultTabPt, t.paraW, r, Ln(e.alignment), Rn(e.alignment)), c = i.map((t) => k(e, t));
		return {
			kind: "text",
			lines: i,
			lineHeights: c.map((e) => e.lineH),
			baselineOffsets: c.map((e) => e.baselineOffset),
			baseRtl: r,
			alignment: e.alignment,
			ind: t
		};
	}), j = (e) => e.kind === "image" ? e.crossExtent ?? e.fitH : e.lineHeights.reduce((e, t) => e + t, 0), M = _.map((e) => (e.spaceBefore ?? 0) * o), N = _.map((e) => (e.spaceAfter ?? 0) * o), P = (e) => vc(_, e, M, N), F = A.reduce((e, t, n) => e + P(n) + j(t), 0), I = e.textAnchor ?? "t", L;
	L = I === "b" ? w + Math.max(0, T - F) : I === "ctr" ? w + Math.max(0, (T - F) / 2) : w;
	let R = e.textAutofit === "none";
	R && (a.save(), a.beginPath(), a.rect(t, n, r, i), a.clip());
	for (let e = 0; e < _.length; e++) {
		let t = _[e], n = A[e];
		if (L += P(e), n.kind === "image") {
			let { fitW: e, fitH: r, ind: i } = n, o = S + i.leftPx + i.firstPx, s = i.firstLineW, l = t.imagePath ? c.get(_o(t.imagePath)) : void 0;
			if (u) {
				let i = n.crossExtent ?? e, c = r, u = o + Math.max(0, (s - c) / 2);
				t.alignment === "left" || t.alignment === "both" ? u = o : t.alignment === "right" && (u = o + Math.max(0, s - c));
				let d = E(L, i);
				l && (a.save(), a.translate(u + c / 2, d + i / 2), a.rotate(-p * Math.PI / 2), a.drawImage(l, -i / 2, -c / 2, i, c), a.restore()), L += i;
				continue;
			}
			if (l) {
				let n = o + Math.max(0, (s - e) / 2);
				t.alignment === "left" || t.alignment === "both" ? n = o : t.alignment === "right" && (n = o + Math.max(0, s - e)), a.drawImage(l, n, L, e, r);
			}
			L += r;
			continue;
		}
		if (n.kind === "text") {
			let { lines: e, baseRtl: r, ind: i } = n, c = Ln(n.alignment) ? "justify" : In(n.alignment, r), l = c === "justify", u = Rn(n.alignment), p = r || e.some((e) => Nn(e.segments));
			a.textAlign = "left";
			for (let h = 0; h < e.length; h++) {
				let _ = e[h], v = h === 0, y = h === e.length - 1, b = n.lineHeights[h], x = n.baselineOffsets[h], C = f ? _.segments.reduce((e, t) => !("text" in t) || !t.ruby ? e : Math.max(e, gi(t.ruby.fontSizePt, t.ruby.hpsRaisePt, o)), 0) : 0, w = E(L, b) + (f ? b - x + C : x), T = S + i.leftPx + (v ? i.firstPx : 0), D = v ? i.firstLineW : i.paraW, O = _.segments.length, k = p ? Fn(_.segments, r) : null, A = k ? k.order[O - 1] : O - 1, j = _.segments.reduce((e, t) => e + t.measuredWidth, 0), M = y || (_.endsWithBreak ?? !1), N = l && (!M || u), P = D - j, F = null, I = 0, R = null, z = 0;
				if (!p) for (let e = 0; e < O; e++) {
					let t = _.segments[e];
					if (!("text" in t) || /\S/.test(t.text)) {
						z = e;
						break;
					}
				}
				let B = 0;
				if (!N && P < 0) {
					let e = Xn(_.segments.map((e) => "text" in e && e.fitTextRegionIndex === void 0 ? { text: e.text } : {}), P, z, p ? A : O, _.ascent);
					e && (F = e.perSeg, I = e.perGap, B = Yn(e));
				}
				let V = P - B, ee = 0;
				N || (c === "right" ? ee = Math.max(0, V) : c === "center" ? ee = Math.max(0, V / 2) : c === "justify" && r && (ee = Math.max(0, V)));
				let H = T + ee;
				if (v && t.numbering) {
					a.font = Ai(!1, !1, t.fontSizePt * o, Xl(t.numbering), s);
					let e = t.numbering.color ?? (t.numbering.colorAuto ? null : t.color ?? t.runs?.find((e) => e.color)?.color ?? null);
					a.fillStyle = e ? `#${e}` : g;
					let n = Zl(t.numbering), r = a.measureText(n).width, c = t.numbering.jc || "left", l = c === "right" ? -r : c === "center" ? -r / 2 : 0, u = S + i.leftPx + i.markerFirstPx + l;
					d ? di(a, n, u, w, t.fontSizePt * o, 0) : a.fillText(n, u, w);
				}
				if (N) {
					let e = -_.ascent * .25, t = _.segments.map((e) => "text" in e && e.fitTextRegionIndex === void 0 ? { text: e.text } : {}), r = m.verticalCJK ? null : io(n.alignment), i = r ? ao(a, _.segments, P, r, o, s, 0) : null;
					i && (R = i.perSeg);
					let c = i?.residualPx ?? P, l = Jn(t, c, z, p ? A : O, e, c > 0, n.alignment === "thaiDistribute" && c > 0);
					F = l ? l.perSeg : null, I = l ? l.perGap : 0;
				}
				for (let e = 0; e < O; e++) {
					let t = k ? k.order[e] : e, n = _.segments[t];
					if (k && (a.direction = k.rtl[t] ? "rtl" : "ltr"), "isTab" in n) {
						n.leader && n.leader !== "none" && n.measuredWidth > 1 && Wc(a, n.leader, H, w, n.measuredWidth, n.fontSize * o, g, n.bold, n.italic), H += n.measuredWidth;
						continue;
					}
					if ("imagePath" in n || "mathNodes" in n) {
						H += n.measuredWidth;
						continue;
					}
					let r = n, i = R?.get(t), c = i?.text ?? r.text, l = F?.get(t), u = i ? void 0 : l, f = (u?.internalStretch ?? 0) + (i?.advanceDeltaPx ?? 0), h = ji(r, o), v = r.vertAlign === "super" ? -r.fontSize * o * .35 : r.vertAlign === "sub" ? r.fontSize * o * .15 : 0;
					if (a.font = Ai(r.bold, r.italic, h, r.fontFamily, s), a.fillStyle = r.color ? `#${r.color}` : g, d) {
						if (di(a, r.text, H, w + v, h, Gi(r, 0, o), r.charScale ?? 1, r.verticalRun === !0), r.ruby && r.ruby.text.length > 0) {
							let e = r.ruby.fontSizePt * o, t = [...r.ruby.text], n = r.measuredWidth, i = r.ruby.hpsRaisePt == null ? w + v - (h / 2 + e) : w + v - r.ruby.hpsRaisePt * o, c = t.length * e, l = c <= n ? H : H + (n - c) / 2, u = c <= n ? n / t.length : e;
							a.save(), a.font = Ai(r.bold, r.italic, e, r.fontFamily, s), a.textAlign = "center", a.textBaseline = "middle";
							for (let e = 0; e < t.length; e++) {
								let n = l + u * (e + .5);
								a.save(), a.translate(n, i), a.rotate(-Math.PI / 2), a.fillText(t[e], 0, 0), a.restore();
							}
							a.restore();
						}
						H += r.measuredWidth;
						continue;
					}
					let y = c, b = H, x = 0;
					if (k && k.rtl[t] === !0 && !m.verticalCJK && /\s$/u.test(c)) {
						let e = c.replace(/\s+$/u, "");
						if (e.length > 0) {
							let t = a.letterSpacing;
							a.letterSpacing = "0px";
							let n = a.measureText(c).width, i = a.measureText(e).width;
							a.letterSpacing = t, x = Ki({
								...r,
								text: c
							}, n, 0, o) - Ki({
								...r,
								text: e
							}, i, 0, o), y = e, b = H + x;
						}
					}
					if (i) {
						let e = r.charScale ?? 1, t = Gi(r, 0, o), n = a.fontKerning;
						if (r.kerning != null && (a.fontKerning = r.fontSize >= r.kerning ? "normal" : "none"), e !== 1) {
							a.save(), a.translate(b, 0), a.scale(e, 1);
							let n = a.letterSpacing;
							t !== 0 && (a.letterSpacing = `${t / e}px`), a.fillText(y, 0, w + v), a.letterSpacing = n, a.restore();
						} else if (t !== 0) {
							let e = a.letterSpacing;
							a.letterSpacing = `${t}px`, a.fillText(y, b, w + v), a.letterSpacing = e;
						} else a.fillText(y, b, w + v);
						r.kerning != null && (a.fontKerning = n);
					} else if (u && u.splitBefore.length > 0) {
						let e = [...r.text];
						if (u.splitBefore.length === e.length - 1) {
							let e = a.letterSpacing;
							a.letterSpacing = `${I}px`, a.fillText(r.text, H, w + v), a.letterSpacing = e;
						} else {
							let t = (e) => a.measureText(e).width;
							for (let { text: n, dx: r } of Me(e, u.splitBefore, I, t)) a.fillText(n, H + r, w + v);
						}
					} else a.fillText(y, b, w + v);
					if (r.ruby) {
						let e = r.measuredWidth + f, t = r.ruby.fontSizePt * o, n = Ai(r.bold, r.italic, t, r.fontFamily, s);
						a.save(), a.font = n;
						let i = a.measureText(r.ruby.text).width, c = H + (e - i) / 2, l = r.ruby.hpsRaisePt == null ? w + v - h * .85 - t * .1 : w + v - r.ruby.hpsRaisePt * o;
						a.fillText(r.ruby.text, c, l), a.restore();
					}
					H += r.measuredWidth + f, l?.trailingGap && !p && /\s$/.test(r.text) && (H += I);
				}
				L += b;
			}
			continue;
		}
	}
	R && a.restore(), a.direction = "ltr", u && a.restore();
}
function sl(e) {
	let t = e.verticalPhys;
	return t ? {
		...e,
		pageWidth: t.pageWidth,
		marginLeft: t.marginLeft,
		marginRight: t.marginRight,
		marginTop: t.marginTop,
		marginBottom: t.marginBottom,
		pageH: t.pageHeight * e.scale
	} : e;
}
function cl(e) {
	let t = e.verticalPhys;
	return t ? {
		...sl(e),
		contentX: t.marginLeft * e.scale,
		contentW: (t.pageWidth - t.marginLeft - t.marginRight) * e.scale,
		verticalCJK: !1,
		verticalAllRotated: !1,
		verticalPhys: void 0,
		floats: [],
		deferFront: null
	} : e;
}
function ll(e, t, n) {
	let r = t.scale, i = e.widthPt * r, a = e.heightPt * r, o = (e.distLeft ?? 0) * r, s = (e.distRight ?? 0) * r, c = (e.distTop ?? 0) * r, l = (e.distBottom ?? 0) * r;
	if (t.verticalPhys) {
		let n = sl(t), r = mi(Rr(e.anchorXAlign, e.anchorXFromMargin ?? !1, e.anchorXPt ?? 0, i, n, e.anchorXRelativeFrom ?? null, null, null), zr(e.anchorYAlign, e.anchorYFromPara ?? !1, e.anchorYPt ?? 0, a, t.contentX, n, e.anchorYRelativeFrom ?? null, null, null), i, a, t.verticalPhys.cssWidthPx);
		return {
			x: r.x,
			y: r.y,
			w: r.w,
			h: r.h,
			dl: c,
			dr: l,
			dt: s,
			db: o
		};
	}
	return {
		x: Rr(e.anchorXAlign, e.anchorXFromMargin ?? !1, e.anchorXPt ?? 0, i, t, e.anchorXRelativeFrom ?? null, null, null),
		y: zr(e.anchorYAlign, e.anchorYFromPara ?? !1, e.anchorYPt ?? 0, a, n, t, e.anchorYRelativeFrom ?? null, null, null),
		w: i,
		h: a,
		dl: o,
		dr: s,
		dt: c,
		db: l
	};
}
function ul(e, t) {
	if (e == null) return !t;
	switch (e) {
		case "paragraph":
		case "line":
		case "character": return !1;
		default: return !0;
	}
}
function dl(e) {
	return Vn(e.wrapMode) ? ul(e.anchorYRelativeFrom ?? null, e.anchorYFromPara ?? !1) : !1;
}
function fl(e, t, n) {
	let r = t.floatParaSeq++, i = t.pageAnchorPrescanned?.has(e) ?? !1;
	for (let a of e.runs) if (a.type === "image") {
		let e = a;
		if (i && dl(e)) continue;
		ml(e, t, n, r);
	} else if (a.type === "chart") {
		let e = a;
		if (i && dl(e)) continue;
		hl(e, t, n, r);
	} else if (a.type === "shape") {
		let e = a;
		if (i && dl(e)) continue;
		gl(e, t, n, r);
	}
}
function pl(e, t, n) {
	n.pageAnchorPrescanned ||= /* @__PURE__ */ new Set();
	for (let r = t; r < e.length; r++) {
		let t = e[r];
		if (!t) continue;
		if (t.type === "pageBreak") break;
		if (t.type === "sectionBreak") {
			let e = t;
			if (e.kind && e.kind !== "continuous") break;
			continue;
		}
		if (t.type !== "paragraph") continue;
		let i = t;
		if (n.pageAnchorPrescanned.has(i)) continue;
		let a = !1;
		for (let e of i.runs) if (e.type === "image") {
			if (dl(e)) {
				a = !0;
				break;
			}
		} else if (e.type === "chart") {
			if (dl(e)) {
				a = !0;
				break;
			}
		} else if (e.type === "shape" && dl(e)) {
			a = !0;
			break;
		}
		if (!a) continue;
		let o = n.floatParaSeq++;
		for (let e of i.runs) if (e.type === "image") {
			let t = e;
			if (!dl(t)) continue;
			ml(t, n, 0, o);
		} else if (e.type === "chart") {
			let t = e;
			if (!dl(t)) continue;
			hl(t, n, 0, o);
		} else if (e.type === "shape") {
			let t = e;
			if (!dl(t)) continue;
			gl(t, n, 0, o);
		}
		n.pageAnchorPrescanned.add(i);
	}
}
function ml(e, t, n, r) {
	if (!e.anchor || !Vn(e.wrapMode)) return;
	let i = e.wrapMode === "topAndBottom" ? "topAndBottom" : "square", a = ll(e, t, n), { w: o, h: s, dl: c, dr: l, dt: u, db: d } = a, f = e.allowOverlap ?? !0, p = _o(e.imagePath, e.colorReplaceFrom, e.duotone), m = jr(t, {
		x: a.x,
		y: a.y,
		w: o,
		h: s,
		dl: c,
		dr: l,
		dt: u,
		db: d,
		kind: "shape",
		mode: i,
		side: e.wrapSide ?? "bothSides",
		imageKey: p,
		drawn: !1,
		paraId: r,
		avoidOverlap: !0,
		allowOverlap: f
	});
	if (!t.dryRun) {
		let n = t.images.get(p);
		if (n) {
			let r = e.alpha != null && e.alpha < 1;
			r && (t.ctx.save(), t.ctx.globalAlpha *= e.alpha), t.verticalCJK ? pi(t.ctx, m.imageX, m.imageY, m.imageW, m.imageH, (r, i, a, o) => Kc(t.ctx, n, e, r, i, a, o)) : Kc(t.ctx, n, e, m.imageX, m.imageY, m.imageW, m.imageH), r && t.ctx.restore();
		}
		m.drawn = !0;
	}
}
function hl(e, t, n, r) {
	if (!e.anchor || !Vn(e.wrapMode)) return;
	let i = ll(e, t, n), { w: a, h: o, dl: s, dr: c, dt: l, db: u } = i;
	if (a <= 0 || o <= 0) return;
	let d = jr(t, {
		x: i.x,
		y: i.y,
		w: a,
		h: o,
		dl: s,
		dr: c,
		dt: l,
		db: u,
		kind: "shape",
		mode: e.wrapMode === "topAndBottom" ? "topAndBottom" : "square",
		side: e.wrapSide ?? "bothSides",
		allowOverlap: e.allowOverlap ?? !0,
		avoidOverlap: !0,
		paraId: r,
		imageKey: "",
		drawn: !1
	});
	if (!t.dryRun) {
		let n = (n, r, i, a) => B(t.ctx, e.chart, {
			x: n,
			y: r,
			w: i,
			h: a
		}, t.scale);
		t.verticalCJK ? pi(t.ctx, d.imageX, d.imageY, d.imageW, d.imageH, n) : n(d.imageX, d.imageY, d.imageW, d.imageH), d.drawn = !0;
	}
}
function gl(e, t, n, r) {
	if (!Vn(e.wrapMode)) return;
	let { x: i, y: a, w: o, h: s } = Yc(e, t, n);
	if (o <= 0 || s <= 0) return;
	let c = e.wrapMode === "topAndBottom" ? "topAndBottom" : "square", l = t.scale, u = (e.distLeft ?? 0) * l, d = (e.distRight ?? 0) * l, f = (e.distTop ?? 0) * l, p = (e.distBottom ?? 0) * l, m = !!t.verticalPhys;
	jr(t, {
		x: i,
		y: a,
		w: o,
		h: s,
		dl: m ? f : u,
		dr: m ? p : d,
		dt: m ? d : f,
		db: m ? u : p,
		kind: "shape",
		mode: c,
		side: e.wrapSide ?? "bothSides",
		imageKey: "",
		drawn: !0,
		paraId: r,
		avoidOverlap: !0,
		allowOverlap: !0
	});
}
function _l(e, t, n) {
	let { scale: r } = n, i = (t) => {
		let n = qr(e, Array(e.rows.length).fill(0), r);
		return t.map((e, t) => e - (n[t] ?? 0));
	}, a = e, o = t / r, s = Cs.get(e), c = ks.get(e);
	if (Uc && s !== void 0 && s.fragment.kind === "table" && c !== void 0 && s.fragment.rows.length === e.rows.length && Math.abs(c - o) <= 1e-6 * Math.max(1, Math.abs(o))) {
		let e = s.fragment, t = e.columnWidthsPt.map((e) => e * r), n = e.rows.map((e) => e.heightPt * r);
		return {
			colWidths: t,
			tableW: t.reduce((e, t) => e + t, 0),
			rowContentHeights: i(n),
			rowHeights: n
		};
	}
	let l = a.tableLayoutInputs;
	if (Uc && l !== void 0 && a.tableColWidthsPt !== void 0 && a.tableRowHeightsPt !== void 0 && l.scale === 1 && a.tableRowHeightsPt.length === e.rows.length && Math.abs(l.contentWPt - o) <= 1e-6 * Math.max(1, Math.abs(o))) {
		let e = a.tableColWidthsPt.map((e) => e * r), t = a.tableRowHeightsPt.map((e) => e * r);
		return {
			colWidths: e,
			tableW: e.reduce((e, t) => e + t, 0),
			rowContentHeights: i(t),
			rowHeights: t
		};
	}
	let u = Ks(e, o, n).map((e) => e * r), d = u.reduce((e, t) => e + t, 0), f = Kr(e, u, r, (t, i) => vl(t, e, i, r, n));
	return {
		colWidths: u,
		tableW: d,
		rowContentHeights: f,
		rowHeights: qr(e, f, r)
	};
}
function vl(e, t, n, r, i) {
	let a = mo(i), o = El(e, t), s = n - (o.left + o.right) * r, c = Al(e.content);
	return (o.top + o.bottom) * r + wc(c, (e) => Ol(a, e, s, r), r);
}
function yl(e, t, n, r, i, a, o, s) {
	let { scale: c, dryRun: l } = o, u = e.bidiVisual === !0, d = [], f = e.rows.map(() => Array(t.length).fill(-1)), p = a;
	for (let a = 0; a < e.rows.length; a++) {
		let m = e.rows[a], h = s?.rows[a], g = r[a], _ = Br(m, t.length), v = i + t.slice(0, _).reduce((e, t) => e + t, 0), y = 0;
		for (let s of m.cells) {
			let b = h?.cells[y];
			y++;
			let x = Math.min(s.colSpan, t.length - _), S = t.slice(_, _ + x).reduce((e, t) => e + t, 0), C = u ? i + n - (v - i) - S : v;
			if (s.vMerge !== !1) {
				let n = g, i = a;
				if (s.vMerge === !0) {
					let t = Vr(e, a, _);
					i = t, n = 0;
					for (let e = a; e <= t; e++) n += r[e];
				}
				let u = {
					topRow: a === 0,
					bottomRow: i === e.rows.length - 1,
					leftCol: _ === 0,
					rightCol: _ + x === t.length
				}, h = m.rowHeightRule === "exact" && s.vMerge !== !0;
				if (l) Dl(s, e, S, c, o);
				else {
					let e = d.length;
					d.push({
						cell: s,
						x: C,
						y: p,
						w: S,
						h: n,
						edges: u,
						clipExact: h,
						ci: _,
						ri: a,
						span: x,
						lastRi: i,
						cellFragment: b
					});
					for (let n = a; n <= i && n < f.length; n++) for (let r = _; r < _ + x && r < t.length; r++) f[n][r] = e;
				}
			}
			v += S, _ += x;
		}
		p += g;
	}
	for (let t of d) kl(t.cell, e, t.x, t.y, t.w, t.h, o, t.clipExact, t.cellFragment);
	let m = o.ctx, h = o.dpr, g = [0];
	for (let e of t) g.push(g[g.length - 1] + e);
	let _ = [0];
	for (let e of r) _.push(_[_.length - 1] + e);
	let v = (e) => u ? i + n - g[e] : i + g[e], y = (e) => a + _[e];
	for (let n of d) {
		let { x: r, y: i, w: a, h: o } = n, s = _n(n.cell.borders, e.borders, n.edges, u), l = n.lastRi > n.ri ? Js(e.rows[n.lastRi], n.ci, t.length) ?? n.cell : n.cell, p = l === n.cell ? s.bottom : _n(l.borders, e.borders, {
			...n.edges,
			topRow: !1
		}, u).bottom, g = u ? n.edges.rightCol : n.edges.leftCol, _ = u ? n.edges.leftCol : n.edges.rightCol, b = u ? n.ci + n.span : n.ci - 1, x = u ? n.ci - 1 : n.ci + n.span;
		if (n.edges.topRow) {
			let e = Fl(s.top?.spec ?? null);
			e && Rl(m, r, i, r + a, i, e, c, h);
		} else {
			let e = Fl(s.top?.spec ?? null);
			if (e) {
				let t = n.ci;
				for (; t < n.ci + n.span;) {
					let r = f[n.ri - 1]?.[t] ?? -1, a = t + 1;
					for (; a < n.ci + n.span && (f[n.ri - 1]?.[a] ?? -1) === r;) a++;
					r < 0 && Rl(m, v(t), i, v(a), i, e, c, h), t = a;
				}
			}
		}
		if (g) {
			let e = Fl(s.left?.spec ?? null);
			e && Rl(m, r, i, r, i + o, e, c, h);
		} else {
			let e = Fl(s.left?.spec ?? null);
			if (e) {
				let t = n.ri;
				for (; t <= n.lastRi;) {
					let i = f[t]?.[b] ?? -1, a = t;
					for (; a + 1 <= n.lastRi && (f[a + 1]?.[b] ?? -1) === i;) a++;
					i < 0 && Rl(m, r, y(t), r, y(a + 1), e, c, h), t = a + 1;
				}
			}
		}
		if (n.edges.bottomRow) {
			let t;
			if (e.rows[n.lastRi]?.pageCutBottom === !0) {
				let r = _n(n.cell.borders, e.borders, {
					...n.edges,
					topRow: !0
				}, u).top;
				t = Sl(p, r);
			} else t = Fl(p?.spec ?? null);
			t && Rl(m, r, i + o, r + a, i + o, t, c, h);
		} else if (e.rows[n.lastRi]?.pageCutBottom !== !0) {
			let t = n.lastRi + 1, r = n.ci;
			for (; r < n.ci + n.span;) {
				let a = f[t][r], s = r + 1;
				for (; s < n.ci + n.span && f[t][s] === a;) s++;
				let l = xl(d, f, t, r), g = Sl(p, (l ? _n(l.cell.borders, e.borders, l.edges, u) : null)?.top ?? null);
				g && Rl(m, v(r), i + o, v(s), i + o, g, c, h), r = s;
			}
		}
		if (_) {
			let e = Fl(s.right?.spec ?? null);
			e && Rl(m, r + a, i, r + a, i + o, e, c, h);
		} else {
			let t = n.ri;
			for (; t <= n.lastRi;) {
				let i = f[t][x], o = t;
				for (; o + 1 <= n.lastRi && f[o + 1][x] === i;) o++;
				let l = bl(d, f, t, x, u, e.borders), p = Sl(s.right, l?.left ?? null);
				p && Rl(m, r + a, y(t), r + a, y(o + 1), p, c, h), t = o + 1;
			}
		}
	}
	return p;
}
function bl(e, t, n, r, i, a) {
	let o = xl(e, t, n, r);
	return o ? _n(o.cell.borders, a, o.edges, i) : null;
}
function xl(e, t, n, r) {
	if (n < 0 || n >= t.length || r < 0 || r >= t[n].length) return null;
	let i = t[n][r];
	return i < 0 ? null : e[i] ?? null;
}
function Sl(e, t) {
	let n = On(e, t);
	return n ? Fl(n.spec) : null;
}
function Cl(e, t) {
	let n = e.tblpPr, r = t.y, i = t.contentX, a = t.contentW, { colWidths: o, tableW: s, rowHeights: c } = _l(e, t.contentW, t), l = Nr(n, t, r, s, c.reduce((e, t) => e + t, 0)), u = Fr(l, t);
	t.contentX = l.x, t.contentW = s, yl(e, o, s, c, l.x, l.y, t), t.contentX = i, t.contentW = a, t.y = r, Pr(l, n, t, u, e.overlap !== "never");
}
function wl(e, t) {
	if (e.tblpPr) {
		Cl(e, t);
		return;
	}
	if (t.verticalPhys) {
		let n = t.verticalPhys.cssWidthPx, r = cl(t), { colWidths: i, tableW: a, rowHeights: o } = _l(e, r.contentW, r), s = n - t.y - a, c = t.contentX, { ctx: l } = t;
		l.save(), l.rotate(-Math.PI / 2), l.translate(-n, 0), yl(e, i, a, o, s, c, r), l.restore(), t.y += a;
		return;
	}
	let { contentX: n, contentW: r, scale: i } = t, a = e.tblInd != null && e.jc === "left", { colWidths: o, tableW: s, rowHeights: c } = _l(e, a && e.tblInd < 0 ? t.pageWidth * i : r, t), l = e.jc === "center" ? n + Math.max(0, (r - s) / 2) : e.jc === "right" ? n + Math.max(0, r - s) : n;
	if (a) {
		let t = e.tblInd * i;
		l = e.bidiVisual === !0 ? n + r - t - s : n + t;
	}
	t.y = yl(e, o, s, c, l, t.y, t);
}
function Tl(e, t, n, r, i) {
	{
		let a = po(e, t), o = zs(e, a), s = n / r, c = Ya(t, a, {
			startYPt: 0,
			paragraphXPt: 0,
			availableWidthPt: s,
			maximumYPt: e.pageH / r,
			suppressSpaceBefore: !0
		}, {
			context: e.ctx,
			fontFamilyClasses: e.fontFamilyClasses
		}, xs(e));
		if (r === 1 && !c.markOnly && !wa(t)) {
			let n = a.physicalIndentLeftPt, r = a.physicalIndentRightPt;
			Vc(t, c.lines.map((e) => e.layout), {
				paraW: Math.max(1, s - n - r),
				firstIndent: t.indentFirst,
				tabOriginPx: n,
				gridDeltaPx: Ri(o, 1),
				hasFloats: !1,
				kinsoku: e.kinsoku
			});
		}
		let l = c.contentEndYPt - c.placement.startYPt, u = c.markOnly ? 0 : c.lines.length, d = i ? Math.max(0, i.start) : 0, f = i ? Math.min(u, i.end) : u;
		if (r === 1) {
			if (!i || c.markOnly || c.lines.length === 0) return {
				heightPx: l,
				totalLines: u
			};
			let e = 0;
			for (let t = d; t < f; t++) {
				let n = c.lines[t];
				if (t === d) {
					e += n.advancePt;
					continue;
				}
				let r = c.lines[t - 1];
				e += Math.max(0, n.topYPt - (r.topYPt + r.advancePt)) + n.advancePt;
			}
			return {
				heightPx: e,
				totalLines: u
			};
		}
		let p = a.hasRuby, m = a.hasEastAsianText;
		if (c.markOnly || c.lines.length === 0) return {
			heightPx: ea(t, r, o, p, e.docEastAsian, e.ctx, e.fontFamilyClasses, a.lineSpacing, e.resolvedLocalFonts),
			totalLines: u
		};
		let h = Ea(t.runs, Ss(e)), g = ho(e.storyContext ?? uo, e.verticalCJK, !1, !1, a, t, h), _ = Oa(c.lines.map((e) => e.layout), r, e.ctx, e.fontFamilyClasses, Ri(o, r), g), v = p ? Rs(Math.max(0, ..._.map((e) => Xi(t.lineSpacing, e.ascent, e.descent, r, o, !0, e.intendedSingle, m))), o, r) : 0;
		return {
			heightPx: zl(_, d, f, 0, (e) => p ? v : Xi(t.lineSpacing, e.ascent, e.descent, r, o, !1, e.intendedSingle, e.eastAsian ?? !1, e.gridCountSingle)),
			totalLines: u
		};
	}
}
function El(e, t) {
	return {
		top: e.marginTop ?? t.cellMarginTop,
		bottom: e.marginBottom ?? t.cellMarginBottom,
		left: e.marginLeft ?? t.cellMarginLeft,
		right: e.marginRight ?? t.cellMarginRight
	};
}
function Dl(e, t, n, r, i) {
	let a = mo(i), o = El(e, t), s = o.left * r, c = o.right * r, l = n - s - c;
	for (let t of e.content) Ol(a, t, l, r);
}
function Ol(e, t, n, r) {
	if (t.type === "paragraph") {
		let i = t, a = t.lineSlice, { heightPx: o, totalLines: s } = Tl(e, i, n, r, a);
		return o + ((!a || a.start === 0 ? i.spaceBefore : 0) + (!a || a.end >= s ? Math.max(i.spaceAfter, Wl(i.borders)) : 0)) * r;
	}
	return Ws(e, t, n / r) * r;
}
function kl(e, t, n, r, i, a, o, s = !1, c) {
	let { ctx: l, scale: u } = o;
	e.background && (l.fillStyle = `#${e.background}`, l.fillRect(n, r, i, a));
	let d = El(e, t), f = d.top * u, p = d.bottom * u, m = d.left * u, h = d.right * u, g = {
		...o,
		contentX: n + m,
		contentW: i - m - h,
		y: r + f,
		storyContext: ja(o.storyContext ?? uo),
		lineNumbering: void 0,
		lineNumberCounter: void 0,
		containerShading: e.background ?? o.containerShading,
		floats: [],
		floatParaSeq: 0
	};
	if (e.vAlign === "center" || e.vAlign === "bottom") {
		let t = Al(e.content), n = t.reduce((e, t) => e + Ol(g, t, i - m - h, u), 0), o = t[0], s = t[t.length - 1], c = (e) => e?.lineSlice, l = c(o), d = o && o.type === "paragraph" && (!l || l.start === 0) ? o.spaceBefore * u : 0;
		if (n -= d, s && s.type === "paragraph") {
			let e = c(s);
			(!e || e.end >= Tl(g, s, i - m - h, u, e).totalLines) && (n -= s.spaceAfter * u);
		}
		e.vAlign === "center" ? g.y = r + (a - n) / 2 - d : g.y = r + a - n - p - d;
	}
	s ? (l.save(), l.beginPath(), l.rect(0, r, l.canvas.width, a), l.clip(), c ? Nl(c, g) : jl(e.content, g), l.restore()) : c ? Nl(c, g) : jl(e.content, g);
}
function Al(e) {
	if (e.length < 2) return e;
	let t = e[e.length - 1], n = e[e.length - 2];
	return t.type !== "paragraph" || n.type === "paragraph" || t.runs.length > 0 ? e : e.slice(0, -1);
}
function jl(e, t) {
	let n = null, r = 0;
	for (let i of e) if (i.type === "paragraph") {
		let e = i, a = i.lineSlice, o = a?.start != null && a.start > 0, s = a ? {
			...a,
			...o ? { continues: !0 } : {}
		} : void 0, c = _c(o ? null : n, e, r, o ? 0 : e.spaceBefore);
		t.y -= c.overlap * t.scale, Fc(e, t, c.suppressBefore || o, s), n = e, r = e.spaceAfter;
	} else i.type === "table" && (wl(i, t), n = null, r = 0);
}
function Ml(e, t) {
	let n = e.source;
	if (n.numbering != null || t.floats.length !== 0 || wa(n)) return !1;
	let r = t.contentW / t.scale, i = e.measured.placement.availableWidthPt;
	return Math.abs(i - r) <= 1e-6 * Math.max(1, Math.abs(r));
}
function Nl(e, t) {
	let n = null, r = 0;
	for (let i of e.blocks) if (i.kind === "paragraph") {
		let e = i.source, a = i.lineStart > 0, o = i.lineStart === 0 && i.lineEnd === i.measured.lines.length ? void 0 : {
			start: i.lineStart,
			end: i.lineEnd,
			...a ? { continues: !0 } : {}
		}, s = _c(a ? null : n, e, r, a ? 0 : e.spaceBefore);
		t.y -= s.overlap * t.scale, Ml(i, t) ? Rc(e, t, i.measured.lines.map((e) => e.layout), s.suppressBefore || a, o, void 0) : Fc(e, t, s.suppressBefore || a, o), n = e, r = e.spaceAfter;
	} else Pl(i, t), n = null, r = 0;
}
function Pl(e, t) {
	let n = e.source, { contentX: r, contentW: i, scale: a } = t, o = e.columnWidthsPt.map((e) => e * a), s = o.reduce((e, t) => e + t, 0), c = e.rows.map((e) => e.heightPt * a), l = n.tblInd != null && n.jc === "left", u = n.jc === "center" ? r + Math.max(0, (i - s) / 2) : n.jc === "right" ? r + Math.max(0, i - s) : r;
	if (l) {
		let e = n.tblInd * a;
		u = n.bidiVisual === !0 ? r + i - e - s : r + e;
	}
	t.y = yl(n, o, s, c, u, t.y, t, e);
}
function Fl(e) {
	return !e || e.style === "none" || e.style === "nil" ? null : e;
}
function Il(e, t, n, r, i, a, o, s) {
	e.lineWidth = a;
	let c = n === i, l = t === r, u = c ? 0 : s, d = c ? s : 0, f = l ? P(t + u, a, o) : 0, p = c ? P(n + d, a, o) : 0;
	e.beginPath(), e.moveTo(t + u + f, n + d + p), e.lineTo(r + u + f, i + d + p), e.stroke();
}
function Ll(e, t) {
	return O(e, t);
}
function Rl(e, t, n, r, i, a, o, s = 1) {
	e.save(), e.strokeStyle = a.color ? `#${a.color}` : "#000000";
	let c = Math.max(.5, a.width * o);
	if (a.style === "double") {
		e.fillStyle = e.strokeStyle, Xe(e, t, n, r, i, c, s), e.restore();
		return;
	}
	let l = Ll(a.style, c);
	l.length && e.setLineDash(l), Il(e, t, n, r, i, c, s, 0), e.restore();
}
function zl(e, t, n, r, i) {
	let a = r;
	for (let r = t; r < n; r++) {
		let t = e[r];
		t.topY !== void 0 && t.topY > a && (a = t.topY), a += i(t);
	}
	return a - r;
}
function Bl(e, t, n, r, i, a, o) {
	if (!i) return {
		x: e,
		y: t,
		w: n,
		h: r
	};
	let s = (e) => e && e.style !== "none" ? (e.space ?? 0) * o : 0, c = a?.suppressTop ? i.between : i.top, l = s(i.left), u = s(i.right), d = s(c), f = a?.suppressBottom ? 0 : s(i.bottom);
	return {
		x: e - l,
		y: t - d,
		w: n + l + u,
		h: r + d + f
	};
}
function Vl(e, t, n, r, i, a, o) {
	let s = e + n, c = e + t - r;
	return i < 0 && (a ? c -= i : s += i), o && (s = Math.min(s, o.left), c = Math.max(c, o.right)), {
		x: s,
		w: Math.max(0, c - s)
	};
}
function Hl(e, t, n, r, i, a, o = 1) {
	let s = (e) => e != null && e.style !== "none", c = (e) => s(e) ? (e.space ?? 0) * o : 0, l = a?.suppressTop ? i.between : i.top, u = a?.suppressBottom ? null : i.bottom, d = e - c(i.left), f = e + n + c(i.right), p = t - c(l), m = t + r + c(u), h = [];
	return s(l) && h.push({
		side: "top",
		edge: l,
		x1: d,
		y1: p,
		x2: f,
		y2: p
	}), s(u) && h.push({
		side: "bottom",
		edge: u,
		x1: d,
		y1: m,
		x2: f,
		y2: m
	}), s(i.left) && h.push({
		side: "left",
		edge: i.left,
		x1: d,
		y1: p,
		x2: d,
		y2: m
	}), s(i.right) && h.push({
		side: "right",
		edge: i.right,
		x1: f,
		y1: p,
		x2: f,
		y2: m
	}), h;
}
function Ul(e, t, n, r, i, a, o, s = 1, c) {
	for (let l of Hl(t, n, r, i, a, c, o)) {
		let { edge: t } = l, n = {
			width: t.width,
			color: t.color,
			style: t.style
		};
		Rl(e, l.x1, l.y1, l.x2, l.y2, n, o, s);
	}
}
function Wl(e, t) {
	if (!e || t?.suppressBottom) return 0;
	let n = e.bottom;
	return !n || n.style === "none" ? 0 : (n.space ?? 0) + (n.width ?? 0) / 2;
}
function Gl(e, t) {
	let n = (e) => e == null || e.style === "none" ? null : e, r = n(e), i = n(t);
	return r == null || i == null ? r == null && i == null : r.style === i.style && r.width === i.width && (r.space ?? 0) === (i.space ?? 0) && (r.color ?? null) === (i.color ?? null);
}
function Kl(e, t) {
	return e == null || t == null ? !1 : Gl(e.top, t.top) && Gl(e.bottom, t.bottom) && Gl(e.left, t.left) && Gl(e.right, t.right) && Gl(e.between, t.between);
}
function ql(e) {
	if (!e) return !1;
	let t = (e) => e != null && e.style !== "none";
	return t(e.top) || t(e.bottom) || t(e.left) || t(e.right) || t(e.between);
}
function Jl(e, t) {
	return !e || !t || e.framePr || t.framePr || !ql(e.borders) || !ql(t.borders) ? !1 : Kl(e.borders, t.borders);
}
function Yl(e, t) {
	return e.style === t.style && e.width === t.width && (e.space ?? 0) === (t.space ?? 0) && (e.color ?? null) === (t.color ?? null);
}
function Xl(e) {
	let t = e.text.codePointAt(0) ?? 0, n = e.fontFamily ?? null;
	return S(t) ? e.fontFamilyEastAsia ?? n : n;
}
function Zl(e) {
	return Le(e.text, e.fontFamily ?? null);
}
function Ql(e, t) {
	let n = Pi(t);
	return {
		w: e.picBulletWidthPt ?? n,
		h: e.picBulletHeightPt ?? n
	};
}
function $l(e, t) {
	return Pi(e) * t;
}
//#endregion
//#region packages/docx/src/bookmark-nav.ts
function eu(e, t) {
	if (e.type === "paragraph") {
		for (let n of e.bookmarks ?? []) t(n);
		return;
	}
	if (e.type === "table") for (let n of e.rows) for (let e of n.cells) for (let n of e.content) eu(n, t);
}
function tu(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n = 0; n < e.length; n++) for (let r of e[n]) eu(r, (e) => {
		e !== "" && !t.has(e) && t.set(e, n);
	});
	return t;
}
//#endregion
//#region packages/docx/src/document-content.ts
function* nu(e) {
	e.textPath && (yield {
		text: e.textPath.string,
		fontFamilies: [e.textPath.fontFamily]
	});
	for (let t of e.textBlocks ?? []) yield* ru(t);
}
function* ru(e) {
	if (e.numbering && (yield {
		text: e.numbering.text,
		fontFamilies: [e.numbering.fontFamily, e.numbering.fontFamilyEastAsia]
	}), e.runs?.length) for (let t of e.runs) yield {
		text: t.text,
		fontFamilies: [
			t.fontFamily,
			t.fontFamilyEastAsia,
			e.fontFamily
		]
	};
	else yield {
		text: e.text,
		fontFamilies: [e.fontFamily]
	};
}
function* iu(e) {
	e.type === "text" ? yield {
		text: e.text,
		fontFamilies: [
			e.fontFamily,
			e.fontFamilyEastAsia,
			e.fontFamilyCs
		]
	} : e.type === "field" ? yield {
		text: e.fallbackText,
		fontFamilies: [e.fontFamily]
	} : e.type === "shape" ? yield* nu(e) : e.type === "anchorHost" && (yield {
		text: "",
		fontFamilies: [e.fontFamily, e.fontFamilyEastAsia]
	});
}
function* au(e) {
	yield {
		text: "",
		fontFamilies: [e.defaultFontFamily, e.defaultFontFamilyEastAsia]
	}, e.numbering && (yield {
		text: e.numbering.text,
		fontFamilies: [e.numbering.fontFamily, e.numbering.fontFamilyEastAsia]
	});
	for (let t of e.runs) yield* iu(t);
}
function* ou(e) {
	for (let t of e.rows) for (let e of t.cells) yield* cu(e.content);
}
function* su(e) {
	if (e) for (let t of [
		e.default,
		e.first,
		e.even
	]) t && (yield* cu(t.body));
}
function* cu(e) {
	for (let t of e) t.type === "paragraph" ? yield* au(t) : t.type === "table" ? yield* ou(t) : t.type === "sectionBreak" && (yield* su(t.headers), yield* su(t.footers));
}
function* lu(e) {
	yield* cu(e.body ?? []), yield* su(e.headers), yield* su(e.footers);
	for (let t of [...e.footnotes ?? [], ...e.endnotes ?? []]) yield* cu(t.content);
}
function uu(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of lu(e)) for (let e of n.fontFamilies) {
		let n = e?.trim();
		n && t.add(n);
	}
	return [...t];
}
//#endregion
//#region packages/docx/src/google-fonts.ts
var du = {
	...n,
	...T
};
function* fu(e) {
	for (let t of lu(e)) yield t.text;
}
function pu(e) {
	let t = p(e.majorFont) ?? p(e.minorFont) ?? null;
	return [
		e.majorFont,
		e.minorFont,
		...De(fu(e), t)
	];
}
//#endregion
//#region packages/docx/src/embedded-fonts.ts
async function mu(e, t) {
	let n = e.embeddedFonts;
	if (!n || n.length === 0) return [];
	let r = (await Promise.all(n.map(async (e) => {
		try {
			let n = await t(e.partPath);
			return {
				family: e.fontName,
				bytes: n,
				odttf: e.partPath.toLowerCase().endsWith(".odttf"),
				fontKey: e.fontKey,
				weight: hu(e.style),
				style: gu(e.style)
			};
		} catch {
			return null;
		}
	}))).filter((e) => e !== null);
	return r.length === 0 ? [] : qe(r);
}
function hu(e) {
	return e === "bold" || e === "boldItalic" ? "bold" : "normal";
}
function gu(e) {
	return e === "italic" || e === "boldItalic" ? "italic" : "normal";
}
//#endregion
//#region packages/docx/src/local-font-metrics.ts
function _u(e) {
	let t = new Set((e.embeddedFonts ?? []).filter((e) => e.style === "regular").map((e) => Zt(e.fontName))), n = new Set([
		...Object.keys(e.fontFamilyClasses ?? {}),
		...e.majorFont ? [e.majorFont] : [],
		...e.minorFont ? [e.minorFont] : [],
		...uu(e)
	]), r = [];
	for (let e of n) {
		let n = Zt(e);
		t.has(n) || (n === "meiryo" || e.trim() === "メイリオ") && r.push({
			family: e,
			localNames: ["Meiryo"],
			lineHeightMultiplier: 1.3
		});
	}
	return r;
}
function vu(e) {
	return tn(_u(e));
}
//#endregion
//#region packages/docx/src/document.ts
var yu = class e {
	_document = null;
	_meta = null;
	_pages = null;
	_bookmarkPages = null;
	_mode = "main";
	_worker;
	_bridge;
	_imageCache = /* @__PURE__ */ new Map();
	_embeddedFontFaces = [];
	_googleFontFaces = [];
	_localMetricFontFaces = [];
	_fetchImage = (e, t) => this.getImage(e, t);
	constructor(e, t, n) {
		this._worker = e, this._mode = t, this._bridge = new u(this._worker, {
			correlate: (e) => e.id,
			toError: (e) => e.type === "error" ? e.message : void 0
		});
		let r = new URL(n ?? un, location.href).href;
		this._bridge.post({
			type: "init",
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
		i = h(await pe(i, n.password));
		let a = new e(r === "worker" ? (await import("./render-worker-host-B5esxBj-.js")).createRenderWorker() : new ln(), r, n.wasmUrl);
		if (n.math && r === "worker" && console.warn("[ooxml] the math engine is unavailable in mode: 'worker'; equations will be skipped. Use mode: 'main' for documents with equations."), await a._parse(i, n.maxZipEntryBytes, r === "worker" ? !!n.useGoogleFonts : !1, n.workerTimeoutMs), r === "main" && n.useGoogleFonts && a._document && (a._googleFontFaces = await d(pu(a._document), du)), r === "main" && a._document?.embeddedFonts?.length && (a._embeddedFontFaces = await mu(a._document, (e) => a.getFontBytes(e))), r === "main" && a._document) {
			let e = await vu(a._document);
			a._localMetricFontFaces = e.faces, ko(a._document, e.metrics);
		}
		return r === "main" && n.math && a._document && oo(a._document.body) && await lo(a._document.body, n.math), a;
	}
	async _parse(e, t, n = !1, r) {
		let i = await this._bridge.request((r) => this._mode === "worker" ? {
			type: "parse",
			id: r,
			data: e,
			maxZipEntryBytes: t,
			useGoogleFonts: n
		} : {
			type: "parse",
			id: r,
			data: e,
			maxZipEntryBytes: t
		}, [e], { timeoutMs: r });
		if (this._mode === "worker") this._meta = i.meta;
		else {
			let { documentJson: e } = i;
			this._document = JSON.parse(new TextDecoder().decode(new Uint8Array(e)));
		}
	}
	destroy() {
		this._bridge.terminate(), this._document && Ao(this._document), this._document = null, this._meta = null, this._pages = null, this._bookmarkPages = null, this._imageCache.clear(), this._embeddedFontFaces.length > 0 && (Je(this._embeddedFontFaces), this._embeddedFontFaces = []), this._googleFontFaces.length > 0 && (j(this._googleFontFaces), this._googleFontFaces = []), this._localMetricFontFaces.length > 0 && (nn(this._localMetricFontFaces), this._localMetricFontFaces = []), X(this._fetchImage), bo(this._fetchImage), U(this._fetchImage);
	}
	async getImage(e, t) {
		let n = this._imageCache.get(e);
		if (n) return n;
		let r = this._bridge.request((t) => ({
			type: "extractImage",
			id: t,
			path: e
		})).then((e) => {
			let n = e.bytes;
			return new Blob([n], { type: t });
		});
		return this._imageCache.set(e, r), r;
	}
	async getFontBytes(e) {
		let t = (await this._bridge.request((t) => ({
			type: "extractImage",
			id: t,
			path: e
		}))).bytes;
		return new Uint8Array(t);
	}
	async toMarkdown() {
		return (await this._bridge.request((e) => ({
			type: "toMarkdown",
			id: e
		}))).markdown;
	}
	get pageCount() {
		return this._meta ? this._meta.pageCount : this._document ? this._getPages().length : 0;
	}
	get mode() {
		return this._mode;
	}
	get document() {
		if (this._meta && !this._document) throw Error("the raw document model stays in the worker in mode: 'worker'; use mode: 'main' if you need direct model access");
		if (!this._document) throw Error("Document not loaded");
		return this._document;
	}
	get comments() {
		return this._meta?.comments ?? this._document?.comments ?? [];
	}
	get footnotes() {
		return this._meta?.footnotes ?? this._document?.footnotes ?? [];
	}
	get endnotes() {
		return this._meta?.endnotes ?? this._document?.endnotes ?? [];
	}
	_getPages() {
		return this._pages ? this._pages : this._document ? (this._pages = ys(this._document), this._pages) : [];
	}
	_getBookmarkPages() {
		return this._bookmarkPages ||= this._meta ? new Map(this._meta.bookmarkPages) : tu(this._getPages()), this._bookmarkPages;
	}
	getBookmarkPage(e) {
		return this._getBookmarkPages().get(e);
	}
	pageSize(e) {
		if (this._meta) {
			let t = this._meta.pageSizes, n = t[Math.max(0, Math.min(e, t.length - 1))];
			return n ? {
				widthPt: n.widthPt,
				heightPt: n.heightPt
			} : {
				widthPt: 0,
				heightPt: 0
			};
		}
		if (!this._document) return {
			widthPt: 0,
			heightPt: 0
		};
		let t = this._getPages();
		return Ho(t, Math.max(0, Math.min(e, t.length - 1)), this._document.section);
	}
	renderPage(e, t, n = {}) {
		if (this._mode === "worker") throw Error("renderPage(canvas) is unavailable in mode: 'worker'; use renderPageToBitmap() and paint it via an ImageBitmapRenderingContext");
		if (!this._document) throw Error("Document not loaded");
		let r = this._getPages();
		return Wo(this._document, e, t, {
			...n,
			totalPages: r.length,
			prebuiltPages: r,
			fetchImage: this._fetchImage
		});
	}
	async renderPageToBitmap(e, t = {}) {
		let { onTextRun: n, ...r } = t, i = {
			...r,
			dpr: r.dpr ?? c()
		};
		if (this._mode === "worker") {
			if (!Number.isInteger(e) || e < 0 || e >= this.pageCount) throw Error(`Page index ${e} out of range (count: ${this.pageCount})`);
			let t = await this._bridge.request((t) => ({
				type: "renderPage",
				id: t,
				pageIndex: e,
				opts: i
			}));
			if (n) for (let e of t.runs) n(e);
			return t.bitmap;
		}
		let a = new OffscreenCanvas(1, 1);
		return await this.renderPage(a, e, {
			...i,
			onTextRun: n
		}), a.transferToImageBitmap();
	}
	async collectPageRuns(e, t = {}) {
		let n = {
			...t,
			dpr: t.dpr ?? c()
		};
		if (this._mode === "worker") {
			if (!Number.isInteger(e) || e < 0 || e >= this.pageCount) throw Error(`Page index ${e} out of range (count: ${this.pageCount})`);
			return (await this._bridge.request((t) => ({
				type: "collectRuns",
				id: t,
				pageIndex: e,
				opts: n
			}))).runs;
		}
		let r = [], i = typeof OffscreenCanvas < "u" ? new OffscreenCanvas(1, 1) : globalThis.document?.createElement("canvas");
		return await this.renderPage(i, e, {
			...n,
			onTextRun: (e) => r.push(e)
		}), r;
	}
};
//#endregion
//#region packages/docx/src/tate-chu-yoko-overlay.ts
function bu(e, t) {
	if (!e.eastAsianVert) return 1;
	let n = t(e.text);
	return !(n > 0) || e.w >= n ? 1 : e.w / n;
}
//#endregion
//#region packages/docx/src/text-layer.ts
function xu(e, t, n, r, i, a) {
	e.innerHTML = "";
	for (let o of t) {
		let t = document.createElement("span");
		t.textContent = o.text;
		let s = o.transform ?? "";
		if (a && o.eastAsianVert) {
			let e = bu(o, a(o.font));
			e !== 1 && (s = `${s ? `${s} ` : ""}scaleX(${e})`);
		}
		let c = s ? `transform:${s};transform-origin:top left;` : "", l = i ? o.hyperlink : void 0, u = l ? "pointer" : "text", d = o.letterSpacingPx === void 0 ? "0" : `${o.letterSpacingPx}px`;
		t.style.cssText = `position:absolute;left:${Be(o.x, n)};top:${Be(o.y, r)};font:${o.font};line-height:${o.h}px;letter-spacing:${d};` + c + `white-space:pre;color:transparent;cursor:${u};pointer-events:all;`, l && i && (t.title = l.kind === "external" ? l.url : l.ref, t.addEventListener("click", () => i(l))), e.appendChild(t);
	}
}
function Su(e, t, n, r, i, a, o = {}) {
	e.innerHTML = "";
	let s = o.match ?? "rgba(255, 214, 0, 0.42)", c = o.active ?? "rgba(255, 140, 0, 0.55)";
	for (let o of n) {
		let n = o.active ? c : s;
		for (let s of o.slices) {
			let o = t[s.runIndex];
			if (!o) continue;
			let c = a(o.font), l = Fe(o.text, s.start, s.end, c), u = o.letterSpacingPx ?? 0, d = Math.min(s.end, [...o.text].length), f = l.x + s.start * u, p = l.width + Math.max(0, d - s.start - 1) * u, m = bu(o, c), h = f * m, g = p * m;
			if (g <= 0) continue;
			let _ = document.createElement("div"), v = o.transform ? `transform:${o.transform};transform-origin:top left;` : "";
			_.style.cssText = `position:absolute;left:${Be(o.x + h, r)};top:${Be(o.y, i)};width:${Be(g, r)};height:${Be(o.h, i)};` + v + `background:${n};pointer-events:none;`, e.appendChild(_);
		}
	}
}
//#endregion
//#region packages/docx/src/find.ts
var Cu = class {
	_pageRuns = /* @__PURE__ */ new Map();
	_matches = [];
	_active = -1;
	constructor(e, t) {
		this._pageCount = e, this._collectPageRuns = t;
	}
	invalidate() {
		this._pageRuns.clear(), this._matches = [], this._active = -1;
	}
	pageRuns(e) {
		return this._pageRuns.get(e);
	}
	setPageRuns(e, t) {
		this._pageRuns.set(e, t);
	}
	_matchAt(e) {
		return this._matches[e];
	}
	pageHighlights(e) {
		let t = [];
		for (let n = 0; n < this._matches.length; n++) {
			let r = this._matches[n];
			r.page === e && t.push({
				slices: r.slices,
				active: n === this._active
			});
		}
		return t;
	}
	activePage() {
		let e = this._matchAt(this._active);
		return e ? e.page : null;
	}
	matches() {
		return this._matches.map((e, t) => ({
			matchIndex: t,
			text: e.text,
			location: { page: e.page }
		}));
	}
	async find(e, t = {}) {
		if (this._matches = [], this._active = -1, e.length === 0) return [];
		let n = this._pageCount();
		for (let r = 0; r < n; r++) {
			let n = await this._ensurePageRuns(r), i = me(n);
			for (let a of Y(i, e, t)) {
				let e = a.slices.map((e) => n[e.runIndex].text.slice(e.start, e.end)).join("");
				this._matches.push({
					page: r,
					text: e,
					slices: a.slices
				});
			}
		}
		return this.matches();
	}
	next() {
		return this._active = ge(this._active, this._matches.length), this._activePublic();
	}
	prev() {
		return this._active = ce(this._active, this._matches.length), this._activePublic();
	}
	_activePublic() {
		let e = this._matchAt(this._active);
		return e ? {
			matchIndex: this._active,
			text: e.text,
			location: { page: e.page }
		} : null;
	}
	async _ensurePageRuns(e) {
		let t = this._pageRuns.get(e);
		if (t) return t;
		let n = await this._collectPageRuns(e);
		return this._pageRuns.set(e, n), n;
	}
}, wu = class {
	_doc = null;
	_currentPage = 0;
	_scale = null;
	_canvas;
	_wrapper;
	_originalParent = null;
	_originalNextSibling = null;
	_originalDisplay = "";
	_textLayer = null;
	_highlightLayer = null;
	_find;
	_measureCtx = null;
	_opts;
	_mode;
	_bitmapCtx = null;
	_destroyed = !1;
	_loadGen = 0;
	constructor(e, t = {}) {
		this._canvas = e, this._opts = t, this._mode = t.mode ?? "main";
		let n = e.parentElement;
		this._originalParent = n, this._originalNextSibling = e.nextSibling, this._originalDisplay = e.style.display, this._wrapper = document.createElement("div"), this._wrapper.style.cssText = "position:relative;display:inline-block;vertical-align:top;", e.style.display || (e.style.display = "block"), n && n.insertBefore(this._wrapper, e), this._wrapper.appendChild(e), this._mode === "worker" && (this._bitmapCtx = e.getContext("bitmaprenderer")), t.enableTextSelection && (this._textLayer = document.createElement("div"), this._textLayer.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;user-select:text;-webkit-user-select:text;", this._wrapper.appendChild(this._textLayer)), this._highlightLayer = document.createElement("div"), this._highlightLayer.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;overflow:hidden;pointer-events:none;", this._wrapper.appendChild(this._highlightLayer), this._find = new Cu(() => this.pageCount, (e) => this._collectPageRuns(e));
	}
	async load(e) {
		let t = ++this._loadGen, n = this._doc;
		try {
			let r = await yu.load(e, {
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
			this._doc = r, n?.destroy(), this._currentPage = 0, this._find.invalidate(), await this._render();
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
	get pageCount() {
		return this._doc?.pageCount ?? 0;
	}
	get currentPage() {
		return this._currentPage;
	}
	get canvasElement() {
		return this._canvas;
	}
	async goToPage(e) {
		this._doc && (this._currentPage = Math.max(0, Math.min(e, this.pageCount - 1)), await this._render());
	}
	async nextPage() {
		await this.goToPage(this._currentPage + 1);
	}
	async prevPage() {
		await this.goToPage(this._currentPage - 1);
	}
	_naturalWidthPx() {
		return !this._doc || this._doc.pageCount === 0 ? 0 : this._doc.pageSize(this._currentPage).widthPt * ae;
	}
	_renderWidth() {
		if (this._scale === null) return this._opts.width;
		let e = this._naturalWidthPx();
		return e <= 0 ? this._opts.width : Math.round(e * this._scale);
	}
	getScale() {
		if (this._scale !== null) return this._scale;
		let e = this._naturalWidthPx();
		return e <= 0 ? 1 : this._opts.width && this._opts.width > 0 ? this._opts.width / e : 1;
	}
	_zoomMin() {
		return this._opts.zoomMin ?? .1;
	}
	_zoomMax() {
		return this._opts.zoomMax ?? 4;
	}
	async setScale(e) {
		let t = ve(e, this._zoomMin(), this._zoomMax()), n = t !== this.getScale();
		this._scale = t, await this._render(), n && this._opts.onScaleChange?.(t);
	}
	async zoomIn() {
		await this.setScale(G(this.getScale()));
	}
	async zoomOut() {
		await this.setScale(de(this.getScale()));
	}
	async fitWidth() {
		await this._fit("width");
	}
	async fitPage() {
		await this._fit("page");
	}
	async _fit(e) {
		if (!this._doc || this._doc.pageCount === 0) return;
		let t = this._doc.pageSize(this._currentPage), n = this._fitContainer();
		if (!n) return;
		let r = W({
			contentWidth: t.widthPt * ae,
			contentHeight: t.heightPt * ae,
			containerWidth: n.clientWidth,
			containerHeight: n.clientHeight
		}, e);
		r <= 0 || await this.setScale(r);
	}
	_fitContainer() {
		return this._opts.container ?? this._wrapper.parentElement ?? null;
	}
	async findText(e, t = {}) {
		if (!this._doc) return [];
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
		return e ? (e.location.page === this._currentPage ? this._redrawHighlights() : await this.goToPage(e.location.page), e) : (this._redrawHighlights(), null);
	}
	_redrawHighlights() {
		let e = this._find.pageRuns(this._currentPage) ?? [];
		this._buildHighlightLayer(e);
	}
	destroy() {
		if (this._destroyed = !0, this._loadGen++, this._doc?.destroy(), this._doc = null, this._find.invalidate(), this._originalParent) {
			let e = this._originalNextSibling && this._originalNextSibling.parentNode === this._originalParent ? this._originalNextSibling : null;
			this._originalParent.insertBefore(this._canvas, e);
		} else this._canvas.parentNode && this._canvas.parentNode.removeChild(this._canvas);
		this._canvas.style.display = this._originalDisplay, this._wrapper.remove();
	}
	async _render() {
		try {
			await this._renderPage();
		} catch (e) {
			this._reportRenderError(e);
		}
	}
	_reportRenderError(e) {
		if (this._destroyed) return;
		let t = e instanceof Error ? e : Error(String(e));
		this._opts.onError ? this._opts.onError(t) : console.error("[ooxml] DocxViewer render failed:", t);
	}
	async _renderPage() {
		if (!this._doc) return;
		let e = this._mode === "worker", t = this._renderWidth(), n = [], r = (e) => n.push(e);
		if (e) {
			let e = this._opts.dpr ?? (typeof window < "u" && window.devicePixelRatio || 1), n = await this._doc.renderPageToBitmap(this._currentPage, {
				width: t,
				dpr: this._opts.dpr,
				defaultTextColor: this._opts.defaultTextColor,
				showTrackChanges: this._opts.showTrackChanges,
				currentDate: this._opts.currentDate,
				onTextRun: r
			});
			this._canvas.width = n.width, this._canvas.height = n.height, this._canvas.style.width = `${Math.round(n.width / e)}px`, this._canvas.style.height = `${Math.round(n.height / e)}px`, this._bitmapCtx?.transferFromImageBitmap(n);
		} else await this._doc.renderPage(this._canvas, this._currentPage, {
			...this._opts,
			width: t,
			onTextRun: r
		});
		this._textLayer && this._buildTextLayer(this._textLayer, n), this._find.setPageRuns(this._currentPage, n), this._buildHighlightLayer(n), this._opts.onPageChange?.(this._currentPage, this.pageCount);
	}
	_buildHighlightLayer(e) {
		let t = this._highlightLayer;
		if (!t) return;
		let { width: n, height: r } = this._canvasCssPx();
		Su(t, e, this._find.pageHighlights(this._currentPage), n, r, (e) => this._measureForFont(e));
	}
	_canvasCssPx() {
		return {
			width: parseFloat(this._canvas.style.width) || this._canvas.width,
			height: parseFloat(this._canvas.style.height) || this._canvas.height
		};
	}
	_measureForFont(e) {
		this._measureCtx ||= document.createElement("canvas").getContext("2d");
		let t = this._measureCtx;
		return t ? (t.font = e, (e) => t.measureText(e).width) : (e) => e.length;
	}
	async _collectPageRuns(e) {
		return this._doc ? this._doc.collectPageRuns(e, {
			width: this._renderWidth(),
			dpr: this._opts.dpr,
			defaultTextColor: this._opts.defaultTextColor,
			showTrackChanges: this._opts.showTrackChanges,
			currentDate: this._opts.currentDate
		}) : [];
	}
	_buildTextLayer(e, t) {
		let { width: n, height: r } = this._canvasCssPx();
		xu(e, t, n, r, this._hyperlinkHandler(), (e) => this._measureForFont(e));
	}
	_hyperlinkHandler() {
		return this._opts.enableHyperlinks === !1 ? void 0 : this._opts.onHyperlinkClick || ((e) => {
			if (e.kind === "external") {
				Z(e.url);
				return;
			}
			let t = this._doc?.getBookmarkPage(e.ref);
			t !== void 0 && this.goToPage(t);
		});
	}
}, Tu = 150, Eu = "0 1px 3px rgba(0,0,0,0.2)", Du = class {
	_doc = null;
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
	_measureCtx;
	_loadGen = 0;
	_bitmapInFlight = /* @__PURE__ */ new Set();
	_renderEpoch = 0;
	_settleTimer = null;
	_wheelListener = null;
	_pendingZoomAnchor = null;
	_resizeObserver = null;
	_prevBase = 0;
	_lastFitWidth = 0;
	_pageShadow;
	constructor(e, t = {}) {
		if (e.tagName === "CANVAS") throw Error("DocxScrollViewer takes a container element (e.g. a <div>), not a <canvas> — the viewer creates and manages its own canvases. Pass a block container; for the single-page canvas API use DocxViewer.");
		if (this._container = e, this._opts = t, this._pageShadow = t.pageShadow ?? Eu, this._injected = !!t.document, this._injected) {
			let e = t.document;
			if (t.mode !== void 0 && t.mode !== e.mode) throw Error(`DocxScrollViewer: opts.mode='${t.mode}' conflicts with the injected engine's mode='${e.mode}'. Omit opts.mode when injecting an engine — the engine owns its render mode.`);
			this._doc = e, this._mode = e.mode;
		} else this._mode = t.mode ?? "main";
		this._wrapper = document.createElement("div"), this._wrapper.style.cssText = "position:relative;width:100%;height:100%;overflow:hidden;", this._scrollHost = document.createElement("div"), this._scrollHost.style.cssText = "position:absolute;inset:0;overflow:auto;", t.background && (this._scrollHost.style.background = t.background), this._spacer = document.createElement("div"), this._spacer.style.cssText = "position:absolute;top:0;left:0;width:1px;height:0;pointer-events:none;", this._scrollHost.appendChild(this._spacer), this._wrapper.appendChild(this._scrollHost), this._container.appendChild(this._wrapper), this._scrollListener = () => this._onScroll(), this._scrollHost.addEventListener("scroll", this._scrollListener), this._opts.enableZoom !== !1 && (this._wheelListener = (e) => {
			if (!(e.ctrlKey || e.metaKey) || (e.preventDefault(), e.deltaY === 0)) return;
			let t = this._scrollHost.getBoundingClientRect(), n = e.clientX - t.left, r = e.clientY - t.top;
			this._pendingZoomAnchor = Number.isFinite(n) && Number.isFinite(r) ? {
				x: n,
				y: r
			} : null, this.setScale(J(this._scale, e.deltaY));
		}, this._scrollHost.addEventListener("wheel", this._wheelListener, { passive: !1 })), typeof ResizeObserver < "u" && (this._resizeObserver = new ResizeObserver(() => this._onResize()), this._resizeObserver.observe(this._container)), this._injected && this.relayout();
	}
	async load(e) {
		if (this._injected) throw Error("DocxScrollViewer.load() is unsupported when an engine is injected via opts.document; the injected engine is already loaded.");
		let t = ++this._loadGen, n = this._doc;
		try {
			let r = await yu.load(e, {
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
			if (this._doc = r, n?.destroy(), n) {
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
	get pageCount() {
		return this._doc?.pageCount ?? 0;
	}
	_pageWidthPx(e) {
		return this._doc.pageSize(e).widthPt * ae * this._scale;
	}
	_pageHeightPx(e) {
		return this._doc.pageSize(e).heightPt * ae * this._scale;
	}
	_fitWidthPx() {
		if (this._opts.width && this._opts.width > 0) return this._opts.width;
		let e = this._container.clientWidth || this._scrollHost.clientWidth;
		if (e <= 0) return 0;
		let { left: t, right: n } = this._padH(), r = e - t - n;
		return r > 0 ? r : 0;
	}
	_baseScale() {
		if (!this._doc || this._doc.pageCount === 0) return 0;
		let e = this._fitWidthPx();
		if (e <= 0) return 0;
		let t = this._doc.pageSize(0).widthPt;
		return t <= 0 ? 0 : e / (t * ae);
	}
	relayout() {
		if (this._doc) {
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
		let e = this._doc.pageCount, t = Array(e);
		for (let n = 0; n < e; n++) t[n] = this._pageHeightPx(n);
		this._heights = t;
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
	_pageIndexAtOffset(e, t) {
		let { offsets: n } = e, r = 0, i = n.length - 1, a = 0;
		for (; r <= i;) {
			let e = r + i >> 1;
			n[e] <= t ? (a = e, r = e + 1) : i = e - 1;
		}
		return a;
	}
	_range() {
		return Re(this._heights, this._gap(), this._scrollHost.scrollTop, this._scrollHost.clientHeight, this._overscan(), this._pad());
	}
	_syncSpacer() {
		let e = this._range();
		this._lastRange = e, this._spacer.style.height = `${e.totalHeight}px`, this._syncSpacerWidth();
	}
	_syncSpacerWidth() {
		let { left: e, right: t } = this._padH(), n = 0;
		for (let e = 0; e < this._heights.length; e++) {
			let t = this._pageWidthPx(e);
			t > n && (n = t);
		}
		this._spacer.style.width = `${n + e + t}px`;
	}
	_onScroll() {
		!this._doc || !this._scaleEstablished || this._mountVisible();
	}
	_mountVisible() {
		if (!this._doc || this._doc.pageCount === 0) return;
		let e = this._range();
		this._lastRange = e;
		for (let [t, n] of [...this._slots]) (t < e.start || t > e.end) && this._recycleSlot(t, n);
		for (let t = e.start; t <= e.end; t++) if (this._slots.has(t)) this._positionSlot(this._slots.get(t), t, e);
		else {
			let n = this._acquireSlot();
			this._positionSlot(n, t, e), this._slots.set(t, n), this._renderSlot(t, n);
		}
		e.topIndex !== this._lastTopIndex && (this._lastTopIndex = e.topIndex, this._opts.onVisiblePageChange?.(e.topIndex, this._doc.pageCount));
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
			renderedPage: -1,
			renderedScale: -1,
			bitmap: null,
			bitmapCtx: null
		};
	}
	_recycleSlot(e, t) {
		this._slots.delete(e), t.bitmap &&= (t.bitmap.close(), null), t.textLayer && (t.textLayer.innerHTML = "", t.textLayer.style.transform = "", t.textLayer.style.transformOrigin = ""), t.renderedPage = -1, t.renderedScale = -1, t.wrapper.remove(), this._free.push(t);
	}
	_positionSlot(e, t, n) {
		e.wrapper.style.top = `${n.offsets[t]}px`;
		let r = this._pageWidthPx(t), i = this._pageHeightPx(t);
		e.wrapper.style.width = `${r}px`, e.wrapper.style.height = `${i}px`;
		let { left: a } = this._padH(), o = this._scrollHost.clientWidth;
		e.wrapper.style.left = `${Math.max(a, (o - r) / 2)}px`;
	}
	_dpr() {
		return this._opts.dpr ?? (typeof window < "u" && window.devicePixelRatio || 1);
	}
	_renderSlot(e, t) {
		if (!this._doc || t.renderedPage === e) return;
		t.renderedPage = e;
		let n = this._dpr(), r = this._pageWidthPx(e), i = this._renderEpoch, a = this._scale;
		if (this._mode === "worker") {
			this._renderSlotBitmap(e, t, r, n, a);
			return;
		}
		let o = [], s = !!this._opts.enableTextSelection && !!t.textLayer, c = s ? (e) => o.push(e) : void 0;
		this._doc.renderPage(t.canvas, e, {
			width: r,
			dpr: n,
			defaultTextColor: this._opts.defaultTextColor,
			showTrackChanges: this._opts.showTrackChanges,
			onTextRun: c
		}).then(() => {
			if (!(i !== this._renderEpoch || this._slots.get(e) !== t || t.renderedPage !== e) && (t.renderedScale = a, s && t.textLayer)) {
				let { width: e, height: n } = this._canvasCssPx(t.canvas);
				xu(t.textLayer, o, e, n, this._hyperlinkHandler(), (e) => this._measureForFont(e));
			}
		}).catch((e) => {
			this._reportRenderError(e);
		});
	}
	_hyperlinkHandler() {
		return this._opts.enableHyperlinks === !1 ? void 0 : this._opts.onHyperlinkClick || ((e) => {
			if (e.kind === "external") {
				Z(e.url);
				return;
			}
			let t = this._doc?.getBookmarkPage(e.ref);
			t !== void 0 && this.scrollToPage(t);
		});
	}
	_measureForFont(e) {
		this._measureCtx === void 0 && (this._measureCtx = document.createElement("canvas").getContext("2d"));
		let t = this._measureCtx;
		return t ? (t.font = e, (e) => t.measureText(e).width) : (e) => e.length;
	}
	_canvasCssPx(e) {
		return {
			width: parseFloat(e.style.width) || e.width,
			height: parseFloat(e.style.height) || e.height
		};
	}
	_reportRenderError(e) {
		if (this._destroyed) return;
		let t = e instanceof Error ? e : Error(String(e));
		this._opts.onError ? this._opts.onError(t) : console.error("[ooxml] DocxScrollViewer render failed:", t);
	}
	async _renderSlotBitmap(e, t, n, r, i) {
		if (this._bitmapInFlight.has(e) || this._slots.get(e) !== t) return;
		let a = this._renderEpoch;
		this._bitmapInFlight.add(e);
		let o = !1;
		t.bitmapCtx ||= t.canvas.getContext("bitmaprenderer");
		let s = !!this._opts.enableTextSelection && !!t.textLayer, c = [];
		try {
			let l = await this._doc.renderPageToBitmap(e, {
				width: n,
				dpr: r,
				defaultTextColor: this._opts.defaultTextColor,
				showTrackChanges: this._opts.showTrackChanges,
				onTextRun: s ? (e) => c.push(e) : void 0
			});
			if (a !== this._renderEpoch || this._slots.get(e) !== t || t.renderedPage !== e) {
				l.close();
				return;
			}
			if (t.bitmap && t.bitmap.close(), t.bitmap = l, t.canvas.width = l.width, t.canvas.height = l.height, t.canvas.style.width = `${Math.round(l.width / r)}px`, t.canvas.style.height = `${Math.round(l.height / r)}px`, t.bitmapCtx?.transferFromImageBitmap(l), t.bitmap = null, t.renderedScale = i, t.textLayer && (t.textLayer.style.transform = "", t.textLayer.style.transformOrigin = "", s)) {
				let { width: e, height: n } = this._canvasCssPx(t.canvas);
				xu(t.textLayer, c, e, n, this._hyperlinkHandler(), (e) => this._measureForFont(e));
			}
			o = !0;
		} catch (e) {
			this._reportRenderError(e);
		} finally {
			this._bitmapInFlight.delete(e);
			let n = this._slots.get(e);
			!o && n && (n !== t || a !== this._renderEpoch) && !this._bitmapInFlight.has(e) && !this._destroyed && this._renderSlotBitmap(e, n, this._pageWidthPx(e), this._dpr(), this._scale);
		}
	}
	setScale(e) {
		let t = this._opts.zoomMin ?? .1, n = this._opts.zoomMax ?? 4, r = Math.min(n, Math.max(t, e)), i = this._pendingZoomAnchor;
		if (this._pendingZoomAnchor = null, !this._doc || this._doc.pageCount === 0 || !this._scaleEstablished) {
			this._pendingScale = r;
			return;
		}
		if (r === this._scale) return;
		let a = this._scale, o = i ? i.y : 0, s = this._range(), c = this._scrollHost.scrollTop + o, l = this._pageIndexAtOffset(s, c), u = this._heights[l] || 0, d = u > 0 ? (c - s.offsets[l]) / u : 0;
		d = Math.min(1, Math.max(0, d));
		let f = this._padH().left, p = this._scrollHost.scrollLeft || 0;
		this._renderEpoch++, this._scale = r, this._recomputeHeights();
		let m = Re(this._heights, this._gap(), 0, this._scrollHost.clientHeight, this._overscan(), this._pad());
		this._spacer.style.height = `${m.totalHeight}px`, this._syncSpacerWidth();
		let h = Math.max(0, m.totalHeight - this._scrollHost.clientHeight), g = (m.offsets[l] ?? 0) + d * (this._heights[l] || 0);
		if (this._scrollHost.scrollTop = Math.min(h, Math.max(0, g - o)), i) {
			let e = Math.max(0, (this._spacer.offsetWidth || 0) - this._scrollHost.clientWidth);
			this._scrollHost.scrollLeft = se(p, i.x - f, a, r, { maxScroll: e });
		}
		this._previewVisible(), this._scheduleSettle(), this._opts.onScaleChange?.(r);
	}
	getScale() {
		return this._scaleEstablished ? this._scale : this._pendingScale ?? 1;
	}
	zoomIn() {
		this.setScale(G(this.getScale()));
	}
	zoomOut() {
		this.setScale(de(this.getScale()));
	}
	fitWidth() {
		this._fit("width");
	}
	fitPage() {
		this._fit("page");
	}
	_fit(e) {
		if (!this._doc || this._doc.pageCount === 0) return;
		let t = this._doc.pageSize(0), n = W({
			contentWidth: t.widthPt * ae,
			contentHeight: t.heightPt * ae,
			containerWidth: this._fitWidthPx(),
			containerHeight: this._scrollHost.clientHeight
		}, e);
		n <= 0 || this.setScale(n);
	}
	_previewVisible() {
		if (!this._doc || this._doc.pageCount === 0) return;
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
		e.topIndex !== this._lastTopIndex && (this._lastTopIndex = e.topIndex, this._opts.onVisiblePageChange?.(e.topIndex, this._doc.pageCount));
	}
	_previewSlot(e, t, n) {
		if (this._positionSlot(e, t, n), e.canvas.style.width = `${this._pageWidthPx(t)}px`, e.canvas.style.height = `${this._pageHeightPx(t)}px`, e.textLayer && e.renderedScale > 0) {
			let t = this._scale / e.renderedScale;
			e.textLayer.style.transformOrigin = "0 0", e.textLayer.style.transform = `scale(${t})`;
		}
	}
	_scheduleSettle() {
		this._settleTimer !== null && clearTimeout(this._settleTimer), this._settleTimer = setTimeout(() => {
			this._settleTimer = null, this._settleRender();
		}, Tu);
	}
	_settleRender() {
		if (!(this._destroyed || !this._doc || this._doc.pageCount === 0)) for (let [e, t] of [...this._slots]) t.renderedScale !== this._scale && this._settleSlot(e, t);
	}
	_settleSlot(e, t) {
		if (!this._doc) return;
		let n = this._dpr(), r = this._pageWidthPx(e), i = this._scale, a = this._renderEpoch;
		if (this._mode === "worker") {
			this._renderSlotBitmap(e, t, r, n, i);
			return;
		}
		let o = document.createElement("canvas");
		o.style.cssText = "display:block;background:#fff;", this._applyPageShadow(o);
		let s = [], c = !!this._opts.enableTextSelection && !!t.textLayer, l = c ? (e) => s.push(e) : void 0;
		this._doc.renderPage(o, e, {
			width: r,
			dpr: n,
			defaultTextColor: this._opts.defaultTextColor,
			showTrackChanges: this._opts.showTrackChanges,
			onTextRun: l
		}).then(() => {
			if (a !== this._renderEpoch || this._slots.get(e) !== t || t.renderedPage !== e) return;
			let n = t.canvas;
			if (t.wrapper.insertBefore(o, n), n.remove(), t.canvas = o, t.bitmapCtx = null, t.renderedScale = i, t.textLayer && (t.textLayer.style.transform = "", t.textLayer.style.transformOrigin = "", c)) {
				let { width: e, height: n } = this._canvasCssPx(o);
				xu(t.textLayer, s, e, n, this._hyperlinkHandler(), (e) => this._measureForFont(e));
			}
		}).catch((e) => {
			this._reportRenderError(e);
		});
	}
	scrollToPage(e, t) {
		if (!this._doc || this._doc.pageCount === 0 || !this._scaleEstablished) return;
		let n = Math.max(0, Math.min(e, this._doc.pageCount - 1)), r = Re(this._heights, this._gap(), 0, this._scrollHost.clientHeight, this._overscan(), this._pad()), i = r.offsets[n] ?? 0, a = Math.max(0, r.totalHeight - this._scrollHost.clientHeight), o = Math.min(a, Math.max(0, i)), s = this._scrollHost;
		typeof s.scrollTo == "function" ? s.scrollTo({
			top: o,
			behavior: t?.behavior ?? "auto"
		}) : this._scrollHost.scrollTop = o, this._mountVisible();
	}
	_onResize() {
		if (!this._doc || this._doc.pageCount === 0) return;
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
	get topVisiblePage() {
		return this._lastRange?.topIndex ?? 0;
	}
	mountedPageIndicesForTest() {
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
		let t = this._range(), n = this._scrollHost.scrollTop + e, r = this._pageIndexAtOffset(t, n), i = this._heights[r] || 0;
		return {
			page: r,
			frac: i > 0 ? Math.min(1, Math.max(0, (n - t.offsets[r]) / i)) : 0
		};
	}
	viewportYOfForTest(e, t) {
		return (this._range().offsets[e] ?? 0) + t * (this._heights[e] || 0) - this._scrollHost.scrollTop;
	}
	destroy() {
		this._destroyed = !0, this._loadGen++, this._scrollListener &&= (this._scrollHost.removeEventListener("scroll", this._scrollListener), null), this._wheelListener &&= (this._scrollHost.removeEventListener("wheel", this._wheelListener), null), this._resizeObserver?.disconnect(), this._resizeObserver = null, this._settleTimer !== null && (clearTimeout(this._settleTimer), this._settleTimer = null);
		for (let [e, t] of [...this._slots]) this._recycleSlot(e, t);
		this._free.length = 0, this._injected || this._doc?.destroy(), this._doc = null, this._wrapper.remove();
	}
};
//#endregion
//#region packages/docx/src/types.ts
function Ou(e) {
	let t = [];
	for (let n of e.content) {
		if (n.type !== "paragraph") continue;
		let e = "";
		for (let t of n.runs) t.type === "text" && !t.noteRef && (e += t.text);
		e = e.trim(), e && t.push(e);
	}
	return t.join(" ");
}
//#endregion
//#region src/docx.ts
var ku = /* @__PURE__ */ I({
	DocxDocument: () => yu,
	DocxScrollViewer: () => Du,
	DocxViewer: () => wu,
	OoxmlError: () => R,
	autoResize: () => q,
	buildDocxHighlightLayer: () => Su,
	buildDocxTextLayer: () => xu,
	noteText: () => Ou,
	openExternalHyperlink: () => Z
});
//#endregion
export { Su as a, wu as i, Ou as n, xu as o, Du as r, yu as s, ku as t };
