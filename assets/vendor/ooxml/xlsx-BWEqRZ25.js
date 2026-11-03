import { $ as e, At as t, B as n, Bt as r, C as i, Dt as a, E as o, Et as s, Ft as c, G as l, H as u, Ht as d, I as f, It as p, J as m, Jt as h, K as g, L as _, Lt as v, M as y, Mt as b, N as x, Nt as S, O as C, Ot as w, P as T, Pt as E, S as D, T as O, Tt as k, U as A, Ut as j, V as M, W as N, Xt as P, Yt as F, _ as ee, _t as I, b as L, bt as R, ct as z, d as B, f as V, gt as H, h as U, i as te, it as W, j as ne, jt as G, kt as re, l as ie, lt as ae, m as oe, n as se, nt as ce, o as le, p as ue, pt as K, q as de, qt as fe, r as q, t as pe, tt as me, v as he, w as J, wt as ge, x as _e, y as ve, z as ye, zt as be } from "./find-cursor-DBifiZop.js";
import { a as xe, i as Se, n as Ce, r as we, t as Te } from "./visible-index-DSN5XPnm.js";
import { t as Ee } from "./mathjax-Dk_JzbFj.js";
import { t as De } from "./segments--0hIQLXB.js";
//#region packages/core/src/sparkline/renderer.ts
function Oe(e, t, n) {
	let { values: r } = n;
	if (r.length === 0 || t.w <= 0 || t.h <= 0) return;
	let i = n.colorSeries ?? "#5B9BD5", a = Math.min(2, t.w * .08), o = Math.max(2, t.h * .2), s = t.x + a, c = t.y + o, l = Math.max(1, t.w - a * 2), u = Math.max(1, t.h - o * 2), d = r.filter((e) => typeof e == "number");
	if (d.length === 0) return;
	let f = Math.min(...d), p = Math.max(...d), m = n.min ?? f, h = n.max ?? p;
	m === h && (h = m + 1, --m);
	let g = h - m, _ = (e) => c + u - (e - m) / g * u;
	if (n.kind === "stem") {
		je(e, n, s, c, l, u);
		return;
	}
	if (n.kind === "column") {
		Ae(e, n, r, s, c, l, u, m, h);
		return;
	}
	if (n.displayXAxis && m < 0 && h > 0) {
		e.save(), e.strokeStyle = n.colorAxis ?? "#000000", e.lineWidth = 1, e.beginPath();
		let t = _(0);
		e.moveTo(s, t), e.lineTo(s + l, t), e.stroke(), e.restore();
	}
	let v = r.length, y = (e) => v === 1 ? s + l / 2 : s + e / (v - 1) * l;
	e.save(), e.strokeStyle = i, e.lineCap = "round", e.lineJoin = "round", e.lineWidth = (n.lineWeight ?? .75) * G, e.beginPath();
	let b = !1, x = n.displayEmptyCellsAs ?? "gap";
	for (let t = 0; t < v; t++) {
		let n = r[t];
		if (n == null) {
			if (x === "zero") {
				let n = y(t), r = _(0);
				b ? e.lineTo(n, r) : (e.moveTo(n, r), b = !0);
			} else x === "gap" && (b = !1);
			continue;
		}
		let i = y(t), a = _(n);
		b ? e.lineTo(i, a) : (e.moveTo(i, a), b = !0);
	}
	e.stroke(), e.restore();
	let S = Math.max(1, Math.min(2.5, u * .12)), C = ke(r, n);
	for (let t = 0; t < v; t++) {
		let a = r[t];
		if (a == null) continue;
		let o = C[t];
		(n.markers || o != null) && (e.save(), e.fillStyle = o ?? n.colorMarkers ?? i, e.beginPath(), e.arc(y(t), _(a), S, 0, Math.PI * 2), e.fill(), e.restore());
	}
}
function ke(e, t) {
	let n = e.map(() => null), r = e.map((e) => typeof e == "number" ? e : null), i = r.findIndex((e) => e != null), a = -1;
	for (let e = r.length - 1; e >= 0; e--) if (r[e] != null) {
		a = e;
		break;
	}
	let o = r.filter((e) => e != null), s = NaN, c = NaN;
	if (o.length > 0 && (s = Math.max(...o), c = Math.min(...o)), t.negative && t.colorNegative) for (let e = 0; e < r.length; e++) {
		let i = r[e];
		i != null && i < 0 && (n[e] = t.colorNegative);
	}
	if (t.first && t.colorFirst && i >= 0 && (n[i] = t.colorFirst), t.last && t.colorLast && a >= 0 && (n[a] = t.colorLast), t.high && t.colorHigh && !Number.isNaN(s)) for (let e = 0; e < r.length; e++) r[e] === s && (n[e] = t.colorHigh);
	if (t.low && t.colorLow && !Number.isNaN(c)) for (let e = 0; e < r.length; e++) r[e] === c && (n[e] = t.colorLow);
	return n;
}
function Ae(e, t, n, r, i, a, o, s, c) {
	let l = n.length;
	if (l === 0) return;
	let u = s < 0 && c > 0 ? 0 : s, d = c - s, f = (e) => i + o - (e - s) / d * o, p = f(u), m = a / l, h = Math.min(1.5, m * .15), g = ke(n, t);
	for (let i = 0; i < l; i++) {
		let a = n[i];
		if (a == null) continue;
		let o = g[i] ?? (a < 0 && t.colorNegative ? t.colorNegative : t.colorSeries ?? "#5B9BD5"), s = f(a), c = r + m * i + h / 2, l = Math.max(1, m - h);
		e.save(), e.fillStyle = o, e.fillRect(c, Math.min(p, s), l, Math.abs(p - s)), e.restore();
	}
}
function je(e, t, n, r, i, a) {
	let o = t.values.length;
	if (o === 0) return;
	let s = r + a / 2, c = a / 2, l = i / o, u = Math.min(1.5, l * .15), d = ke(t.values, t);
	for (let r = 0; r < o; r++) {
		let i = t.values[r];
		if (i == null || i === 0) continue;
		let a = i < 0, o = d[r] ?? (a && t.colorNegative ? t.colorNegative : t.colorSeries ?? "#5B9BD5"), f = n + l * r + u / 2, p = Math.max(1, l - u);
		e.save(), e.fillStyle = o, a ? e.fillRect(f, s, p, c) : e.fillRect(f, s - c, p, c), e.restore();
	}
}
//#endregion
//#region packages/xlsx/src/worker.ts?worker&inline
var Me = "var e=class{__destroy_into_raw(){let e=this.__wbg_ptr;return this.__wbg_ptr=0,n.unregister(this),e}free(){let e=this.__destroy_into_raw();y.__wbg_xlsxarchive_free(e,0)}extract_image(e){let t=f(e,y.__wbindgen_malloc,y.__wbindgen_realloc),n=v,r=y.xlsxarchive_extract_image(this.__wbg_ptr,t,n);if(r[3])throw p(r[2]);var a=i(r[0],r[1]).slice();return y.__wbindgen_free(r[0],r[1]*1,1),a}constructor(e,t){let r=d(e,y.__wbindgen_malloc),i=v,a=y.xlsxarchive_new(r,i,!u(t),u(t)?BigInt(0):t);if(a[2])throw p(a[1]);return this.__wbg_ptr=a[0]>>>0,n.register(this,this.__wbg_ptr,this),this}parse(){let e=y.xlsxarchive_parse(this.__wbg_ptr);if(e[3])throw p(e[2]);var t=i(e[0],e[1]).slice();return y.__wbindgen_free(e[0],e[1]*1,1),t}parse_sheet(e,t){let n=f(t,y.__wbindgen_malloc,y.__wbindgen_realloc),r=v,a=y.xlsxarchive_parse_sheet(this.__wbg_ptr,e,n,r);if(a[3])throw p(a[2]);var o=i(a[0],a[1]).slice();return y.__wbindgen_free(a[0],a[1]*1,1),o}to_markdown(){let e,t;try{let i=y.xlsxarchive_to_markdown(this.__wbg_ptr);var n=i[0],r=i[1];if(i[3])throw n=0,r=0,p(i[2]);return e=n,t=r,s(n,r)}finally{y.__wbindgen_free(e,t,1)}}};Symbol.dispose&&(e.prototype[Symbol.dispose]=e.prototype.free);function t(){return{__proto__:null,\"./xlsx_parser_bg.js\":{__proto__:null,__wbg___wbindgen_debug_string_ab4b34d23d6778bd:function(e,t){let n=f(r(t),y.__wbindgen_malloc,y.__wbindgen_realloc),i=v;o().setInt32(e+4,i,!0),o().setInt32(e+0,n,!0)},__wbg___wbindgen_string_get_7ed5322991caaec5:function(e,t){let n=t,r=typeof n==`string`?n:void 0;var i=u(r)?0:f(r,y.__wbindgen_malloc,y.__wbindgen_realloc),a=v;o().setInt32(e+4,a,!0),o().setInt32(e+0,i,!0)},__wbg___wbindgen_throw_6b64449b9b9ed33c:function(e,t){throw Error(s(e,t))},__wbg_error_a6fa202b58aa1cd3:function(e,t){let n,r;try{n=e,r=t,console.error(s(e,t))}finally{y.__wbindgen_free(n,r,1)}},__wbg_new_227d7c05414eb861:function(){return Error()},__wbg_stack_3b0d974bbf31e44f:function(e,t){let n=t.stack,r=f(n,y.__wbindgen_malloc,y.__wbindgen_realloc),i=v;o().setInt32(e+4,i,!0),o().setInt32(e+0,r,!0)},__wbindgen_cast_0000000000000001:function(e,t){return s(e,t)},__wbindgen_init_externref_table:function(){let e=y.__wbindgen_externrefs,t=e.grow(4);e.set(0,void 0),e.set(t+0,void 0),e.set(t+1,null),e.set(t+2,!0),e.set(t+3,!1)}}}}const n=typeof FinalizationRegistry>`u`?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(e=>y.__wbg_xlsxarchive_free(e>>>0,1));function r(e){let t=typeof e;if(t==`number`||t==`boolean`||e==null)return`${e}`;if(t==`string`)return`\"${e}\"`;if(t==`symbol`){let t=e.description;return t==null?`Symbol`:`Symbol(${t})`}if(t==`function`){let t=e.name;return typeof t==`string`&&t.length>0?`Function(${t})`:`Function`}if(Array.isArray(e)){let t=e.length,n=`[`;t>0&&(n+=r(e[0]));for(let i=1;i<t;i++)n+=`, `+r(e[i]);return n+=`]`,n}let n=/\\[object ([^\\]]+)\\]/.exec(toString.call(e)),i;if(n&&n.length>1)i=n[1];else return toString.call(e);if(i==`Object`)try{return`Object(`+JSON.stringify(e)+`)`}catch{return`Object`}return e instanceof Error?`${e.name}: ${e.message}\\n${e.stack}`:i}function i(e,t){return e>>>=0,l().subarray(e/1,e/1+t)}let a=null;function o(){return(a===null||a.buffer.detached===!0||a.buffer.detached===void 0&&a.buffer!==y.memory.buffer)&&(a=new DataView(y.memory.buffer)),a}function s(e,t){return e>>>=0,g(e,t)}let c=null;function l(){return(c===null||c.byteLength===0)&&(c=new Uint8Array(y.memory.buffer)),c}function u(e){return e==null}function d(e,t){let n=t(e.length*1,1)>>>0;return l().set(e,n/1),v=e.length,n}function f(e,t,n){if(n===void 0){let n=_.encode(e),r=t(n.length,1)>>>0;return l().subarray(r,r+n.length).set(n),v=n.length,r}let r=e.length,i=t(r,1)>>>0,a=l(),o=0;for(;o<r;o++){let t=e.charCodeAt(o);if(t>127)break;a[i+o]=t}if(o!==r){o!==0&&(e=e.slice(o)),i=n(i,r,r=o+e.length*3,1)>>>0;let t=l().subarray(i+o,i+r),a=_.encodeInto(e,t);o+=a.written,i=n(i,r,o,1)>>>0}return v=o,i}function p(e){let t=y.__wbindgen_externrefs.get(e);return y.__externref_table_dealloc(e),t}let m=new TextDecoder(`utf-8`,{ignoreBOM:!0,fatal:!0});m.decode();let h=0;function g(e,t){return h+=t,h>=2146435072&&(m=new TextDecoder(`utf-8`,{ignoreBOM:!0,fatal:!0}),m.decode(),h=t),m.decode(l().subarray(e,e+t))}const _=new TextEncoder;`encodeInto`in _||(_.encodeInto=function(e,t){let n=_.encode(e);return t.set(n),{read:e.length,written:n.length}});let v=0,y;function b(e,t){return y=e.exports,a=null,c=null,y.__wbindgen_start(),y}async function x(e,t){if(typeof Response==`function`&&e instanceof Response){if(typeof WebAssembly.instantiateStreaming==`function`)try{return await WebAssembly.instantiateStreaming(e,t)}catch(t){if(e.ok&&n(e.type)&&e.headers.get(`Content-Type`)!==`application/wasm`)console.warn(\"`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\\n\",t);else throw t}let r=await e.arrayBuffer();return await WebAssembly.instantiate(r,t)}else{let n=await WebAssembly.instantiate(e,t);return n instanceof WebAssembly.Instance?{instance:n,module:e}:n}function n(e){switch(e){case`basic`:case`cors`:case`default`:return!0}return!1}}async function S(e){if(y!==void 0)return y;e!==void 0&&(Object.getPrototypeOf(e)===Object.prototype?{module_or_path:e}=e:console.warn(`using deprecated parameters for the initialization function; pass a single object instead`));let n=t();(typeof e==`string`||typeof Request==`function`&&e instanceof Request||typeof URL==`function`&&e instanceof URL)&&(e=fetch(e));let{instance:r,module:i}=await x(await e,n);return b(r,i)}async function C(e){return y=void 0,a=null,c=null,S(e)}function w(e){if(!e.startsWith(`data:`))return null;let t=e.indexOf(`,`);if(t===-1)return null;let n=atob(e.slice(t+1)),r=new Uint8Array(n.length);for(let e=0;e<n.length;e++)r[e]=n.charCodeAt(e);return r.buffer}var T=class e extends Error{code=`parser-crashed`;constructor(t){super(t),this.name=`WasmTrapError`,Object.setPrototypeOf(this,e.prototype)}};function E(e){let t=globalThis.WebAssembly?.RuntimeError;if(t&&e instanceof t||e instanceof RangeError)return!0;if(e instanceof Error){let t=e.name;if(t===`RuntimeError`||t===`CompileError`||t===`LinkError`)return!0}return!1}const D=new class{_init;_opts;_wasmInput=null;_initPromise=null;_poisoned=!1;_archive=null;constructor(e,t={}){this._init=e,this._opts=t}setWasmUrl(e){this._wasmInput=e,this._poisoned=!1,this._initPromise=this._init(e)}get archive(){return this._archive}setArchive(e){this._freeArchive(),this._archive=e}disposeArchive(){this._freeArchive()}_freeArchive(){this._archive!=null&&this._opts.freeArchive&&this._opts.freeArchive(this._archive),this._archive=null}get poisoned(){return this._poisoned}async ensureReady(){if(this._poisoned){if(this._wasmInput===null)throw Error(`WasmParserHost: setWasmUrl was never called`);let e=(this._opts.reinit??this._init)(this._wasmInput);this._initPromise=e,await e,this._poisoned=!1;return}if(this._initPromise===null)throw Error(`WasmParserHost: setWasmUrl was never called`);await this._initPromise}run(e){try{return e()}catch(e){throw E(e)?(this._poison(),new T(`WASM parser trapped and was recycled: ${e instanceof Error?e.message:String(e)}`)):e}}poison(){this._poison()}_poison(){if(this._poisoned=!0,this._initPromise=null,this._archive!=null&&this._opts.freeArchive)try{this._opts.freeArchive(this._archive)}catch{}this._archive=null}}(S,{freeArchive:e=>e.free(),reinit:C});self.onmessage=async t=>{let n=t.data;if(n.type===`init`){D.setWasmUrl(w(n.wasmUrl)??n.wasmUrl);return}let r=n.id;try{if(await D.ensureReady(),n.type===`parse`){let t=typeof n.maxZipEntryBytes==`number`&&n.maxZipEntryBytes>0?BigInt(n.maxZipEntryBytes):void 0,i=new Uint8Array(n.data),a=D.run(()=>{let n=new e(i,t);return D.setArchive(n),n.parse()}).buffer,o={type:`parsed`,id:r,workbookJson:a};self.postMessage(o,[a]);return}let t=D.archive;if(n.type===`parseSheet`){if(!t)throw Error(`parseSheet before parse: no archive retained`);let e=D.run(()=>t.parse_sheet(n.sheetIndex,n.sheetName)).buffer,i={type:`parsedSheet`,id:r,worksheetJson:e};self.postMessage(i,[e]);return}if(n.type===`extractImage`){if(!t)throw Error(`No xlsx loaded`);let e=D.run(()=>t.extract_image(n.path).buffer),i={type:`imageExtracted`,id:r,bytes:e};self.postMessage(i,[e]);return}if(n.type===`toMarkdown`){if(!t)throw Error(`No xlsx loaded`);let e={type:`markdownRendered`,id:r,markdown:D.run(()=>t.to_markdown())};self.postMessage(e);return}}catch(e){let t={type:`error`,id:r,message:String(e)};self.postMessage(t)}};", Ne = typeof self < "u" && self.Blob && new Blob(["URL.revokeObjectURL(import.meta.url);", Me], { type: "text/javascript;charset=utf-8" });
function Pe(e) {
	let t;
	try {
		if (t = Ne && (self.URL || self.webkitURL).createObjectURL(Ne), !t) throw "";
		let n = new Worker(t, {
			type: "module",
			name: e?.name
		});
		return n.addEventListener("error", () => {
			(self.URL || self.webkitURL).revokeObjectURL(t);
		}), n;
	} catch {
		return new Worker("data:text/javascript;charset=utf-8," + encodeURIComponent(Me), {
			type: "module",
			name: e?.name
		});
	}
}
//#endregion
//#region packages/xlsx/src/wasm/xlsx_parser_bg.wasm?url
var Fe = new URL("xlsx_parser_bg.wasm", import.meta.url).href;
//#endregion
//#region packages/xlsx/src/sheet-visibility.ts
function Ie(e, t) {
	return !Number.isInteger(t) || t < 0 || t >= e.length ? "visible" : e[t].visibility ?? "visible";
}
//#endregion
//#region packages/xlsx/src/phonetic.ts
function Le(e) {
	return Array.from(e);
}
function Re(e, t, n, r, i) {
	let a = Le(t), o = a.length, s = [];
	for (let t of e) {
		let e = t.sb, c = t.eb;
		if (!(e < c) || e >= o) continue;
		let l = Math.min(c, o), u = n + i(a.slice(0, e).join("")), d = i(a.slice(e, l).join("")), f = r === "center" ? "center" : r === "distributed" ? "distribute" : "start";
		s.push({
			text: t.text,
			x: u,
			width: d,
			spread: f
		});
	}
	return s;
}
//#endregion
//#region packages/xlsx/src/formula.ts
function Y(e) {
	return Array.isArray(e) ? e : [e];
}
function ze(e) {
	return Array.isArray(e) ? e[0] ?? 0 : e;
}
var Be = 8;
function Ve(e, t) {
	try {
		return He(Ye(e, t));
	} catch {
		return !1;
	}
}
function He(e) {
	let t = ze(e);
	return typeof t == "boolean" ? t : typeof t == "number" ? t !== 0 : typeof t == "string" ? t.length > 0 && t.toUpperCase() !== "FALSE" : !1;
}
function X(e) {
	let t = ze(e);
	if (typeof t == "number") return t;
	if (typeof t == "boolean") return +!!t;
	if (t == null) return 0;
	let n = parseFloat(String(t));
	return isNaN(n) ? 0 : n;
}
function Ue(e) {
	let t = ze(e);
	return t == null ? "" : typeof t == "boolean" ? t ? "TRUE" : "FALSE" : String(t);
}
var We = new Set([
	"<",
	">",
	"=",
	"+",
	"-",
	"*",
	"/",
	"&",
	"^",
	"%"
]);
function Ge(e) {
	let t = [], n = 0, r = e;
	for (; n < r.length;) {
		let e = r[n];
		if (e === " " || e === "	" || e === "\n" || e === "\r") {
			n++;
			continue;
		}
		if (e === "(") {
			t.push({
				kind: "lparen",
				text: e
			}), n++;
			continue;
		}
		if (e === ")") {
			t.push({
				kind: "rparen",
				text: e
			}), n++;
			continue;
		}
		if (e === ",") {
			t.push({
				kind: "comma",
				text: e
			}), n++;
			continue;
		}
		if (e === ":") {
			t.push({
				kind: "colon",
				text: e
			}), n++;
			continue;
		}
		if (e === "\"") {
			let e = n + 1, i = "";
			for (; e < r.length;) {
				if (r[e] === "\"" && r[e + 1] === "\"") {
					i += "\"", e += 2;
					continue;
				}
				if (r[e] === "\"") break;
				i += r[e], e++;
			}
			t.push({
				kind: "str",
				text: i
			}), n = e + 1;
			continue;
		}
		if (e >= "0" && e <= "9") {
			let e = n;
			for (; e < r.length && (r[e] >= "0" && r[e] <= "9" || r[e] === ".");) e++;
			t.push({
				kind: "num",
				text: r.slice(n, e)
			}), n = e;
			continue;
		}
		if (We.has(e)) {
			(e === "<" || e === ">") && (r[n + 1] === "=" || e === "<" && r[n + 1] === ">") ? (t.push({
				kind: "op",
				text: r.slice(n, n + 2)
			}), n += 2) : (t.push({
				kind: "op",
				text: e
			}), n++);
			continue;
		}
		if (e === "$" || Ke(e)) {
			let e = n;
			for (; e < r.length && (r[e] === "$" || qe(r[e]));) e++;
			let i = r.slice(n, e);
			n = e;
			let a = Je(i);
			if (a) t.push({
				kind: "ref",
				text: i,
				ref: a
			});
			else {
				let e = i.toUpperCase();
				e === "TRUE" || e === "FALSE" ? t.push({
					kind: "bool",
					text: e
				}) : t.push({
					kind: "name",
					text: i
				});
			}
			continue;
		}
		n++;
	}
	return t;
}
function Ke(e) {
	return e >= "A" && e <= "Z" || e >= "a" && e <= "z" || e === "_";
}
function qe(e) {
	return Ke(e) || e >= "0" && e <= "9" || e === ".";
}
function Je(e) {
	let t = 0, n = !1, r = !1;
	e[t] === "$" && (n = !0, t++);
	let i = t;
	for (; t < e.length && e[t] >= "A" && e[t].toUpperCase() <= "Z" && !(!(e[t] >= "A" && e[t] <= "Z") && !(e[t] >= "a" && e[t] <= "z"));) t++;
	if (t === i) return null;
	let a = e.slice(i, t).toUpperCase();
	e[t] === "$" && (r = !0, t++);
	let o = t;
	for (; t < e.length && e[t] >= "0" && e[t] <= "9";) t++;
	if (t === o || t !== e.length) return null;
	let s = parseInt(e.slice(o, t), 10), c = 0;
	for (let e = 0; e < a.length; e++) c = c * 26 + (a.charCodeAt(e) - 64);
	return {
		colAbs: n,
		col: c,
		rowAbs: r,
		row: s
	};
}
function Ye(e, t) {
	return Qe({
		toks: Ge(e),
		pos: 0
	}, t);
}
function Xe(e) {
	return e.toks[e.pos];
}
function Ze(e) {
	return e.toks[e.pos++];
}
function Qe(e, t) {
	return $e(e, t);
}
function $e(e, t) {
	let n = et(e, t), r = Xe(e);
	if (r && r.kind === "op" && (r.text === "<" || r.text === ">" || r.text === "<=" || r.text === ">=" || r.text === "=" || r.text === "<>")) {
		Ze(e);
		let i = et(e, t);
		return tt(r.text, n, i);
	}
	return n;
}
function et(e, t) {
	let n = nt(e, t);
	for (;;) {
		let r = Xe(e);
		if (!r || r.kind !== "op" || r.text !== "&") break;
		Ze(e);
		let i = nt(e, t);
		n = Ue(n) + Ue(i);
	}
	return n;
}
function tt(e, t, n) {
	let r = typeof t == "string" && isNaN(parseFloat(t)) ? null : X(t), i = typeof n == "string" && isNaN(parseFloat(n)) ? null : X(n);
	if (r !== null && i !== null) switch (e) {
		case "<": return r < i;
		case ">": return r > i;
		case "<=": return r <= i;
		case ">=": return r >= i;
		case "=": return r === i;
		case "<>": return r !== i;
	}
	let a = String(t ?? ""), o = String(n ?? "");
	switch (e) {
		case "<": return a < o;
		case ">": return a > o;
		case "<=": return a <= o;
		case ">=": return a >= o;
		case "=": return a === o;
		case "<>": return a !== o;
	}
	return !1;
}
function nt(e, t) {
	let n = rt(e, t);
	for (;;) {
		let r = Xe(e);
		if (!r || r.kind !== "op" || r.text !== "+" && r.text !== "-") break;
		Ze(e);
		let i = rt(e, t);
		n = r.text === "+" ? X(n) + X(i) : X(n) - X(i);
	}
	return n;
}
function rt(e, t) {
	let n = it(e, t);
	for (;;) {
		let r = Xe(e);
		if (!r || r.kind !== "op" || r.text !== "*" && r.text !== "/") break;
		Ze(e);
		let i = it(e, t);
		if (r.text === "*") n = X(n) * X(i);
		else {
			let e = X(i);
			n = e === 0 ? 0 : X(n) / e;
		}
	}
	return n;
}
function it(e, t) {
	let n = Xe(e);
	return n && n.kind === "op" && n.text === "-" ? (Ze(e), -X(it(e, t))) : n && n.kind === "op" && n.text === "+" ? (Ze(e), X(it(e, t))) : at(e, t);
}
function at(e, t) {
	let n = Ze(e);
	if (!n) return 0;
	if (n.kind === "num") return parseFloat(n.text);
	if (n.kind === "str") return n.text;
	if (n.kind === "bool") return n.text === "TRUE";
	if (n.kind === "lparen") {
		let n = Qe(e, t), r = Ze(e);
		if (!r || r.kind !== "rparen") throw Error("missing )");
		return n;
	}
	if (n.kind === "ref") {
		if (Xe(e)?.kind === "colon") {
			Ze(e);
			let r = Ze(e);
			if (r?.kind !== "ref" || !r.ref) throw Error("range: expected ref after :");
			return ct(n.ref, r.ref, t);
		}
		return st(n.ref, t);
	}
	if (n.kind === "name") {
		if (Xe(e)?.kind === "lparen") {
			Ze(e);
			let r = [];
			if (Xe(e)?.kind !== "rparen") for (r.push(Qe(e, t)); Xe(e)?.kind === "comma";) Ze(e), r.push(Qe(e, t));
			let i = Ze(e);
			if (!i || i.kind !== "rparen") throw Error("missing )");
			return ut(n.text, r, t);
		}
		let r = t.definedNames.get(n.text);
		return r && t.depth < Be ? Ye(ot(r.formula), {
			...t,
			anchorRow: 1,
			anchorCol: 1,
			depth: t.depth + 1
		}) : 0;
	}
	return 0;
}
function ot(e) {
	let t = e.match(/^(?:'[^']*'|[A-Za-z_][A-Za-z0-9_.]*)!(.*)$/);
	return t ? t[1] : e;
}
function st(e, t) {
	let n = e.colAbs ? e.col : e.col + (t.col - t.anchorCol), r = e.rowAbs ? e.row : e.row + (t.row - t.anchorRow);
	return lt(t.cellIndex.get(`${r}:${n}`));
}
function ct(e, t, n) {
	let r = e.colAbs ? e.col : e.col + (n.col - n.anchorCol), i = e.rowAbs ? e.row : e.row + (n.row - n.anchorRow), a = t.colAbs ? t.col : t.col + (n.col - n.anchorCol), o = t.rowAbs ? t.row : t.row + (n.row - n.anchorRow), s = Math.min(r, a), c = Math.max(r, a), l = Math.min(i, o), u = Math.max(i, o), d = [], f = 4096;
	for (let e = l; e <= u && d.length < f; e++) for (let t = s; t <= c && d.length < f; t++) d.push(lt(n.cellIndex.get(`${e}:${t}`)));
	return d;
}
function lt(e) {
	if (!e) return null;
	switch (e.value.type) {
		case "number": return e.value.number;
		case "bool": return e.value.bool;
		case "text": return e.value.text;
		case "error": return null;
		default: return null;
	}
}
function ut(e, t, n) {
	switch (e.toUpperCase()) {
		case "AND": return t.flatMap(Y).every((e) => He(e));
		case "OR": return t.flatMap(Y).some((e) => He(e));
		case "NOT": return !He(t[0]);
		case "IF": return He(t[0]) ? t[1] ?? !0 : t[2] ?? !1;
		case "IFERROR": return t[0] == null ? t[1] ?? 0 : t[0];
		case "IFS":
			for (let e = 0; e + 1 < t.length; e += 2) if (He(t[e])) return t[e + 1];
			return null;
		case "TRUE": return !0;
		case "FALSE": return !1;
		case "ISBLANK": {
			let e = ze(t[0]);
			return e == null || e === "";
		}
		case "ISNUMBER": return typeof ze(t[0]) == "number";
		case "ISTEXT": return typeof ze(t[0]) == "string";
		case "ISNONTEXT": return typeof ze(t[0]) != "string";
		case "ISERROR":
		case "ISERR":
		case "ISNA": return ze(t[0]) == null;
		case "ISLOGICAL": return typeof ze(t[0]) == "boolean";
		case "ROUNDDOWN": {
			let e = X(t[0]), n = 10 ** X(t[1]);
			return (e >= 0 ? Math.floor(e * n) : Math.ceil(e * n)) / n;
		}
		case "ROUNDUP": {
			let e = X(t[0]), n = 10 ** X(t[1]);
			return (e >= 0 ? Math.ceil(e * n) : Math.floor(e * n)) / n;
		}
		case "ROUND": {
			let e = X(t[0]), n = 10 ** X(t[1]);
			return Math.round(e * n) / n;
		}
		case "INT": return Math.floor(X(t[0]));
		case "TRUNC": {
			let e = X(t[0]), n = 10 ** X(t[1] ?? 0);
			return (e >= 0 ? Math.floor(e * n) : Math.ceil(e * n)) / n;
		}
		case "CEILING": {
			let e = X(t[0]), n = X(t[1] ?? 1);
			return n === 0 ? 0 : Math.ceil(e / n) * n;
		}
		case "FLOOR": {
			let e = X(t[0]), n = X(t[1] ?? 1);
			return n === 0 ? 0 : Math.floor(e / n) * n;
		}
		case "MOD": {
			let e = X(t[0]), n = X(t[1]);
			return n === 0 ? null : e - Math.floor(e / n) * n;
		}
		case "POWER": return X(t[0]) ** +X(t[1]);
		case "SQRT": {
			let e = X(t[0]);
			return e < 0 ? null : Math.sqrt(e);
		}
		case "ABS": return Math.abs(X(t[0]));
		case "SIGN": {
			let e = X(t[0]);
			return e > 0 ? 1 : e < 0 ? -1 : 0;
		}
		case "EXP": return Math.exp(X(t[0]));
		case "LN": {
			let e = X(t[0]);
			return e <= 0 ? null : Math.log(e);
		}
		case "LOG10": {
			let e = X(t[0]);
			return e <= 0 ? null : Math.log10(e);
		}
		case "MIN": {
			let e = t.flatMap(Y).filter((e) => typeof e == "number");
			return e.length ? Math.min(...e) : 0;
		}
		case "MAX": {
			let e = t.flatMap(Y).filter((e) => typeof e == "number");
			return e.length ? Math.max(...e) : 0;
		}
		case "SUM": return t.flatMap(Y).reduce((e, t) => e + (typeof t == "number" ? t : 0), 0);
		case "AVERAGE": {
			let e = t.flatMap(Y).filter((e) => typeof e == "number");
			return e.length ? e.reduce((e, t) => e + t, 0) / e.length : null;
		}
		case "COUNT": return t.flatMap(Y).filter((e) => typeof e == "number").length;
		case "COUNTA": return t.flatMap(Y).filter((e) => e != null && e !== "").length;
		case "COUNTBLANK": return t.flatMap(Y).filter((e) => e == null || e === "").length;
		case "COUNTIF": return dt(Y(t[0]), t[1]);
		case "SUMIF": return ft(Y(t[0]), t[1], t[2] === void 0 ? null : Y(t[2]));
		case "AVERAGEIF": {
			let e = Y(t[0]), n = ft(e, t[1], t[2] === void 0 ? null : Y(t[2])), r = dt(e, t[1]);
			return r === 0 ? null : X(n) / r;
		}
		case "LEN": return Ue(t[0]).length;
		case "LEFT": return Ue(t[0]).slice(0, Math.max(0, X(t[1] ?? 1)));
		case "RIGHT": {
			let e = Ue(t[0]), n = Math.max(0, X(t[1] ?? 1));
			return n >= e.length ? e : e.slice(e.length - n);
		}
		case "MID": {
			let e = Ue(t[0]), n = Math.max(1, X(t[1])) - 1, r = Math.max(0, X(t[2]));
			return e.slice(n, n + r);
		}
		case "UPPER": return Ue(t[0]).toUpperCase();
		case "LOWER": return Ue(t[0]).toLowerCase();
		case "TRIM": return Ue(t[0]).replace(/\s+/g, " ").trim();
		case "EXACT": return Ue(t[0]) === Ue(t[1]);
		case "FIND": {
			let e = Ue(t[0]), n = Ue(t[1]), r = Math.max(1, X(t[2] ?? 1)) - 1, i = n.indexOf(e, r);
			return i < 0 ? null : i + 1;
		}
		case "SEARCH": {
			let e = Ue(t[0]).toLowerCase(), n = Ue(t[1]).toLowerCase(), r = Math.max(1, X(t[2] ?? 1)) - 1, i = n.indexOf(e, r);
			return i < 0 ? null : i + 1;
		}
		case "CONCATENATE":
		case "CONCAT": return t.flatMap(Y).map((e) => e == null ? "" : typeof e == "boolean" ? e ? "TRUE" : "FALSE" : String(e)).join("");
		case "T": {
			let e = ze(t[0]);
			return typeof e == "string" ? e : "";
		}
		case "N": {
			let e = ze(t[0]);
			return typeof e == "number" ? e : typeof e == "boolean" ? +!!e : 0;
		}
		case "VALUE": return X(t[0]);
		case "ROW": return n.row;
		case "COLUMN": return n.col;
		case "TODAY": return mt();
		case "NOW": return ht();
		case "DATE": return gt(X(t[0]), X(t[1]), X(t[2]));
		case "YEAR": return vt(X(t[0])).y;
		case "MONTH": return vt(X(t[0])).m;
		case "DAY": return vt(X(t[0])).d;
		case "WEEKDAY": {
			let e = _t(X(t[0])).getUTCDay(), n = X(t[1] ?? 1);
			return n === 2 ? e === 0 ? 7 : e : n === 3 ? e === 0 ? 6 : e - 1 : e + 1;
		}
		default: return 0;
	}
}
function dt(e, t) {
	let n = pt(t), r = 0;
	for (let t of e) n(t) && r++;
	return r;
}
function ft(e, t, n) {
	let r = pt(t), i = n ?? e, a = 0;
	for (let t = 0; t < e.length; t++) if (r(e[t])) {
		let e = i[t];
		typeof e == "number" && (a += e);
	}
	return a;
}
function pt(e) {
	let t = ze(e);
	if (typeof t != "string") {
		let e = typeof t == "number" ? t : null;
		return (n) => e !== null && typeof n == "number" ? n === e : n === t;
	}
	let n = t.match(/^(<=|>=|<>|<|>|=)(.*)$/), r = n ? n[1] : "=", i = n ? n[2] : t, a = i.trim() === "" ? NaN : parseFloat(i), o = !isNaN(a) && /^-?\d+(\.\d+)?$/.test(i.trim());
	return (e) => {
		if (o && typeof e == "number") switch (r) {
			case "<": return e < a;
			case ">": return e > a;
			case "<=": return e <= a;
			case ">=": return e >= a;
			case "<>": return e !== a;
			default: return e === a;
		}
		let t = e == null ? "" : typeof e == "boolean" ? e ? "TRUE" : "FALSE" : String(e);
		switch (r) {
			case "<>": return t !== i;
			case "<": return t < i;
			case ">": return t > i;
			case "<=": return t <= i;
			case ">=": return t >= i;
			default: return t === i;
		}
	};
}
function mt() {
	let e = /* @__PURE__ */ new Date();
	return w(new Date(Date.UTC(e.getFullYear(), e.getMonth(), e.getDate())), !1);
}
function ht() {
	return w(new Date(Date.now()), !1);
}
function gt(e, t, n) {
	return Math.floor(w(new Date(Date.UTC(e, t - 1, n)), !1));
}
function _t(e) {
	return a(Math.floor(e), !1);
}
function vt(e) {
	let t = _t(e);
	return {
		y: t.getUTCFullYear(),
		m: t.getUTCMonth() + 1,
		d: t.getUTCDate()
	};
}
//#endregion
//#region packages/xlsx/src/number-format.ts
function yt(e) {
	switch (e.type) {
		case "empty": return "";
		case "text": return e.text;
		case "number": return String(e.number);
		case "bool": return e.bool ? "TRUE" : "FALSE";
		case "error": return e.error;
		case "shared": return "";
	}
}
function bt(e, t, n, r = !1) {
	return xt(e, t, n, r).text;
}
function xt(e, t, n, r = !1) {
	let i = t.cellXfs[e.styleIndex ?? 0]?.numFmtId ?? 0, a = t.numFmts?.find((e) => e.numFmtId === i)?.formatCode ?? null, o = n?.numFmtId ?? i, s = n?.formatCode ?? a;
	if (e.value.type !== "number") {
		let t = yt(e.value);
		return { text: s ? St(t, s) : t };
	}
	let c = Ct(e.formula);
	return zt(c ?? e.value.number, o, s, c === null ? r : !1);
}
function St(e, t) {
	let n = Ht(t), r;
	if (n.length >= 4) r = n[3];
	else {
		let t = n[n.length - 1];
		if (!t.includes("@")) return e;
		r = t;
	}
	if (r === "") return "";
	let i = "", a = 0;
	for (; a < r.length;) {
		let t = r[a];
		if (t === "\"") {
			for (a++; a < r.length && r[a] !== "\"";) i += r[a++];
			a < r.length && a++;
		} else if (t === "\\") a + 1 < r.length && (i += r[a + 1]), a += 2;
		else if (t === "[") {
			for (; a < r.length && r[a] !== "]";) a++;
			a < r.length && a++;
		} else t === "@" ? (i += e, a++) : t === "_" || t === "*" ? a += 2 : (i += t, a++);
	}
	return i;
}
function Ct(e) {
	if (!e) return null;
	let t = e.trim().replace(/^=/, "").toUpperCase().replace(/\s+/g, "");
	return t === "TODAY()" ? mt() : t === "NOW()" ? ht() : null;
}
var wt = {
	14: "m/d/yyyy",
	15: "d-mmm-yy",
	16: "d-mmm",
	17: "mmm-yy",
	18: "h:mm AM/PM",
	19: "h:mm:ss AM/PM",
	20: "h:mm",
	21: "h:mm:ss",
	22: "m/d/yyyy h:mm",
	27: "[$-411]ge.m.d",
	28: "[$-411]ggge\"年\"m\"月\"d\"日\"",
	29: "[$-411]ggge\"年\"m\"月\"d\"日\"",
	30: "m/d/yy",
	31: "yyyy\"年\"m\"月\"d\"日\"",
	50: "[$-411]ge.m.d",
	51: "[$-411]ggge\"年\"m\"月\"d\"日\"",
	52: "yyyy\"年\"m\"月\"",
	53: "m\"月\"d\"日\"",
	54: "[$-411]ggge\"年\"m\"月\"d\"日\"",
	55: "yyyy\"年\"m\"月\"",
	56: "m\"月\"d\"日\"",
	57: "[$-411]ge.m.d",
	58: "[$-411]ggge\"年\"m\"月\"d\"日\""
}, Tt = [
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
], Et = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
], Dt = [
	"日",
	"月",
	"火",
	"水",
	"木",
	"金",
	"土"
], Ot = [
	"日曜日",
	"月曜日",
	"火曜日",
	"水曜日",
	"木曜日",
	"金曜日",
	"土曜日"
], kt = [
	{
		start: new Date(Date.UTC(2019, 4, 1)),
		abbr: "R",
		short: "令",
		long: "令和"
	},
	{
		start: new Date(Date.UTC(1989, 0, 8)),
		abbr: "H",
		short: "平",
		long: "平成"
	},
	{
		start: new Date(Date.UTC(1926, 11, 25)),
		abbr: "S",
		short: "昭",
		long: "昭和"
	},
	{
		start: new Date(Date.UTC(1912, 6, 30)),
		abbr: "T",
		short: "大",
		long: "大正"
	},
	{
		start: new Date(Date.UTC(1868, 0, 25)),
		abbr: "M",
		short: "明",
		long: "明治"
	}
];
function At(e) {
	for (let t of kt) if (e.getTime() >= t.start.getTime()) return {
		abbr: t.abbr,
		short: t.short,
		long: t.long,
		year: e.getUTCFullYear() - t.start.getUTCFullYear() + 1
	};
	let t = kt[kt.length - 1];
	return {
		abbr: t.abbr,
		short: t.short,
		long: t.long,
		year: e.getUTCFullYear()
	};
}
function jt(e, t, n = !1) {
	let r = a(e, n), i = r.getUTCFullYear(), o = r.getUTCMonth() + 1, s = r.getUTCDate(), c = r.getUTCDay(), l = r.getUTCHours(), u = r.getUTCMinutes(), d = r.getUTCSeconds(), f = t.split(";")[0], p = /am\/pm|a\/p/i.test(f), m = null, h = () => m ??= At(r), g = "", _ = 0, v = !1;
	for (; _ < f.length;) {
		let t = f[_];
		if (t === "\"") {
			for (_++; _ < f.length && f[_] !== "\"";) g += f[_++];
			_ < f.length && _++, v = !1;
		} else if (t === "[") {
			let t = f.indexOf("]", _), n = t > _ ? f.slice(_ + 1, t) : "", r = n.match(/^([hms])\1*$/i);
			if (r) {
				let i = r[1].toLowerCase(), a = e < 0 ? "-" : "", o = Math.floor(Math.abs(e) * 86400), s;
				s = i === "h" ? Math.floor(o / 3600) : i === "m" ? Math.floor(o / 60) : o;
				let c = n.length >= 2 ? String(s).padStart(n.length, "0") : String(s);
				g += a + c, _ = t + 1, v = i === "h";
			} else {
				for (; _ < f.length && f[_] !== "]";) _++;
				_ < f.length && _++;
			}
		} else if (t === "_") _ += 2;
		else if (t === "*") _ += 2;
		else if (t === "\\") _ + 1 < f.length && (g += f[_ + 1]), _ += 2, v = !1;
		else if (t === "y" || t === "Y") {
			let e = 0;
			for (; _ < f.length && f[_].toLowerCase() === "y";) e++, _++;
			g += e <= 2 ? String(i).slice(-2) : String(i).padStart(4, "0"), v = !1;
		} else if (t === "m" || t === "M") {
			let e = 0;
			for (; _ < f.length && f[_].toLowerCase() === "m";) e++, _++;
			let t = f.slice(_).replace(/\[[^\]]*\]/g, "");
			v || /^:s/i.test(t) ? g += e >= 2 ? String(u).padStart(2, "0") : String(u) : e === 1 ? g += String(o) : e === 2 ? g += String(o).padStart(2, "0") : e === 3 ? g += Tt[o - 1].slice(0, 3) : e === 4 ? g += Tt[o - 1] : g += Tt[o - 1][0], v = !1;
		} else if (t === "d" || t === "D") {
			let e = 0;
			for (; _ < f.length && f[_].toLowerCase() === "d";) e++, _++;
			e === 1 ? g += String(s) : e === 2 ? g += String(s).padStart(2, "0") : e === 3 ? g += Et[c].slice(0, 3) : g += Et[c], v = !1;
		} else if (t === "h" || t === "H") {
			let e = 0;
			for (; _ < f.length && f[_].toLowerCase() === "h";) e++, _++;
			let t = p ? l % 12 || 12 : l;
			g += e >= 2 ? String(t).padStart(2, "0") : String(t), v = !0;
		} else if (t === "s" || t === "S") {
			let e = 0;
			for (; _ < f.length && f[_].toLowerCase() === "s";) e++, _++;
			g += e >= 2 ? String(d).padStart(2, "0") : String(d), v = !1;
		} else if (t === "g" || t === "G") {
			let e = 0;
			for (; _ < f.length && f[_].toLowerCase() === "g";) e++, _++;
			let t = h();
			e === 1 ? g += t.abbr : e === 2 ? g += t.short : g += t.long, v = !1;
		} else if (t === "e" || t === "E") {
			let e = 0;
			for (; _ < f.length && f[_].toLowerCase() === "e";) e++, _++;
			let t = h().year;
			g += e >= 2 ? String(t).padStart(2, "0") : String(t), v = !1;
		} else if (t === "r" || t === "R") {
			let e = 0;
			for (; _ < f.length && f[_].toLowerCase() === "r";) e++, _++;
			let t = h().year;
			g += e >= 2 ? String(t).padStart(2, "0") : String(t), v = !1;
		} else if (t === "A" || t === "a") {
			let e = f.slice(_).toUpperCase();
			e.startsWith("AAAA") ? (g += Ot[c], _ += 4) : e.startsWith("AAA") ? (g += Dt[c], _ += 3) : e.startsWith("AM/PM") ? (g += l < 12 ? "AM" : "PM", _ += 5) : e.startsWith("A/P") ? (g += l < 12 ? "A" : "P", _ += 3) : (g += t, _++), v = !1;
		} else g += t, _++, t !== ":" && t !== "/" && t !== "-" && t !== "." && t !== " " && (v = !1);
	}
	return g;
}
function Mt(e) {
	if (/\[[hms]+\]/i.test(e)) return !0;
	let t = e.replace(/"[^"]*"/g, "").replace(/\[[^\]]*\]/g, "");
	return /[yd]/i.test(t) || /a{3,}/i.test(t);
}
var Nt = 11, Pt = 6;
function Ft(e) {
	return e.includes(".") ? e.replace(/0+$/, "").replace(/\.$/, "") : e;
}
function It(e) {
	return `${e >= 0 ? "+" : "-"}${Math.abs(e).toString().padStart(2, "0")}`;
}
function Lt(e) {
	let [t, n] = e.toExponential(Pt - 1).split("e");
	return `${Ft(t)}E${It(Number(n))}`;
}
function Rt(e) {
	if (!Number.isFinite(e)) return String(e);
	if (e === 0) return "0";
	let t = e < 0, n = Math.abs(e), r = Number(n.toExponential(Nt - 1).split("e")[1]), i = r >= Nt || r < -5 ? Lt(n) : Ft(n.toPrecision(Nt));
	return t ? `-${i}` : i;
}
function zt(e, t, n, r = !1) {
	let i = wt[t];
	if (i) return { text: jt(e, i, r) };
	if (n && n.trim().toLowerCase() === "general") return { text: Rt(e) };
	if (n) return Mt(n) ? { text: jt(e, n, r) } : Qt(e, n);
	switch (t) {
		case 0: return { text: Rt(e) };
		case 1: return Qt(e, "0");
		case 2: return Qt(e, "0.00");
		case 3: return Qt(e, "#,##0");
		case 4: return Qt(e, "#,##0.00");
		case 9: return Qt(e, "0%");
		case 10: return Qt(e, "0.00%");
		case 11: return Qt(e, "0.00E+00");
		case 37: return Qt(e, "#,##0 ;(#,##0)");
		case 38: return Qt(e, "#,##0 ;[Red](#,##0)");
		case 39: return Qt(e, "#,##0.00;(#,##0.00)");
		case 40: return Qt(e, "#,##0.00;[Red](#,##0.00)");
		case 48: return Qt(e, "##0.0E+0");
		case 49: return { text: String(e) };
		default: return { text: Rt(e) };
	}
}
var Bt = {
	black: "#000000",
	blue: "#0000FF",
	cyan: "#00FFFF",
	green: "#008000",
	magenta: "#FF00FF",
	red: "#FF0000",
	white: "#FFFFFF",
	yellow: "#FFFF00"
}, Vt = /* @__PURE__ */ "#000000.#FFFFFF.#FF0000.#00FF00.#0000FF.#FFFF00.#FF00FF.#00FFFF.#000000.#FFFFFF.#FF0000.#00FF00.#0000FF.#FFFF00.#FF00FF.#00FFFF.#800000.#008000.#000080.#808000.#800080.#008080.#C0C0C0.#808080.#9999FF.#993366.#FFFFCC.#CCFFFF.#660066.#FF8080.#0066CC.#CCCCFF.#000080.#FF00FF.#FFFF00.#00FFFF.#800080.#800000.#008080.#0000FF.#00CCFF.#CCFFFF.#CCFFCC.#FFFF99.#99CCFF.#FF99CC.#CC99FF.#FFCC99.#3366FF.#33CCCC.#99CC00.#FFCC00.#FF9900.#FF6600.#666699.#969696.#003366.#339966.#003300.#333300.#993300.#993366.#333399.#333333".split(".");
function Ht(e) {
	let t = [], n = "", r = 0;
	for (; r < e.length;) {
		let i = e[r];
		if (i === "\"") {
			for (n += i, r++; r < e.length && e[r] !== "\"";) n += e[r++];
			r < e.length && (n += e[r++]);
		} else if (i === "\\") n += i, r + 1 < e.length && (n += e[r + 1]), r += 2;
		else if (i === "[") {
			for (n += i, r++; r < e.length && e[r] !== "]";) n += e[r++];
			r < e.length && (n += e[r++]);
		} else i === ";" ? (t.push(n), n = "", r++) : (n += i, r++);
	}
	return t.push(n), t;
}
function Ut(e) {
	let t = "", n, r, i = 0;
	for (; i < e.length;) {
		let a = e[i];
		if (a === "\"") {
			for (t += a, i++; i < e.length && e[i] !== "\"";) t += e[i++];
			i < e.length && (t += e[i++]);
		} else if (a === "\\") t += a, i + 1 < e.length && (t += e[i + 1]), i += 2;
		else if (a === "[") {
			let o = e.indexOf("]", i);
			if (o < 0) {
				t += a, i++;
				continue;
			}
			let s = e.slice(i + 1, o), c = s.toLowerCase(), l = c.match(/^color(\d{1,2})$/), u = s.match(/^(<=|>=|<>|<|>|=)\s*(-?[0-9.]+(?:[eE][-+]?\d+)?)$/);
			if (c in Bt) n = Bt[c];
			else if (l) {
				let e = parseInt(l[1], 10);
				e >= 1 && e <= 56 && (n = Vt[e + 7] ?? n);
			} else u ? r = {
				op: u[1],
				value: Number(u[2])
			} : t += e.slice(i, o + 1);
			i = o + 1;
		} else t += a, i++;
	}
	return {
		body: t,
		color: n,
		condition: r
	};
}
function Wt(e, t) {
	switch (e.op) {
		case "<": return t < e.value;
		case "<=": return t <= e.value;
		case ">": return t > e.value;
		case ">=": return t >= e.value;
		case "=": return t === e.value;
		case "<>": return t !== e.value;
	}
}
function Gt(e) {
	let t = [], n = "", r = "", i = !1, a = !1, o, s = !1, c = 0, l = 0, u = (e) => {
		if (!e) return;
		!a && !s && (c = n.replace(/,/g, "").length);
		let r = t[t.length - 1];
		r && r.kind === "lit" ? r.text += e : t.push({
			kind: "lit",
			text: e
		});
	}, d = 0;
	for (; d < e.length;) {
		let c = e[d];
		if (c === "\"") {
			d++;
			let t = "";
			for (; d < e.length && e[d] !== "\"";) t += e[d++];
			d < e.length && d++, u(t);
		} else if (c === "\\") d + 1 < e.length && u(e[d + 1]), d += 2;
		else if (c === "[") {
			let t = e.indexOf("]", d), n = t > d ? e.slice(d + 1, t) : "";
			if (n.startsWith("$")) {
				let e = n.slice(1), t = e.indexOf("-");
				u(t >= 0 ? e.slice(0, t) : e);
			}
			d = t < 0 ? e.length : t + 1;
		} else if (c === "_") u(" "), d += 2;
		else if (c === "*") u(e[d + 1] ?? ""), d += 2;
		else if (c === "#" || c === "0" || c === "?") a ? (r += c, t.push({
			kind: "fracph",
			ph: c
		})) : (n += c, t.push({
			kind: "intph",
			ph: c
		})), l = 0, d++;
		else if (c === ".") a = !0, t.push({ kind: "dot" }), d++;
		else if (c === ",") a || (n += ","), l++, d++;
		else if (c === "/" && n.replace(/,/g, "").length > 0) {
			s = !0, t.push({ kind: "fraction" }), d++;
			let n = "";
			for (; d < e.length && /[0-9#?]/.test(e[d]);) n += e[d++];
			t[t.length - 1].den = n;
		} else if (c === "%") i = !0, t.push({ kind: "percent" }), d++;
		else if ((c === "E" || c === "e") && (e[d + 1] === "+" || e[d + 1] === "-")) {
			let n = e[d + 1] === "+";
			d += 2;
			let r = 0;
			for (; d < e.length && (e[d] === "0" || e[d] === "#" || e[d] === "?");) r++, d++;
			o = {
				plus: n,
				width: Math.max(r, 1)
			}, t.push({ kind: "exp" });
		} else u(c), d++;
	}
	let f = l, p = /,(?=[#0?])/.test(n), m = n.replace(/,/g, ""), h;
	if (s) {
		let e = t.find((e) => e.kind === "fraction")?.den ?? "?", n = e.match(/[0-9]+/);
		h = {
			wholeSpec: m.slice(0, c),
			numSpec: m.slice(c) || "?",
			denSpec: e.replace(/[^0#?]/g, ""),
			fixedDen: n ? parseInt(n[0], 10) : null
		};
	}
	return {
		parts: t,
		intSpec: m,
		fracSpec: r,
		hasPercent: i,
		commaScale: f,
		grouping: p,
		exp: o,
		fraction: h
	};
}
function Kt(e) {
	return e.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
function qt(e, t, n) {
	let r = t.split(""), i = e.split(""), a = [], o = i.length - 1, s = [];
	for (let e = r.length - 1; e >= 0; e--) o >= 0 ? (a.unshift(i[o]), s.unshift(i[o]), o--) : r[e] === "0" ? (a.unshift("0"), s.unshift("0")) : r[e] === "?" && a.unshift(" ");
	for (; o >= 0;) a.unshift(i[o]), s.unshift(i[o]), o--;
	if (n) {
		let e = Kt(s.join(""));
		return (a.length - s.length > 0 ? a.slice(0, a.length - s.length).join("") : "") + e;
	}
	return a.join("");
}
function Jt(e, t) {
	let n = t.length;
	if (n === 0) return "";
	let r = e.padEnd(n, "0").slice(0, n).split("");
	for (let e = n - 1; e >= 0; e--) {
		let n = t[e] ?? "#";
		if (r[e] === "0" && n === "#") r[e] = "";
		else if (r[e] === "0" && n === "?") r[e] = " ";
		else break;
	}
	return r.join("");
}
function Yt(e, t, n) {
	if (n !== null) return [Math.round(e * n), n];
	let r = 10 ** Math.max(t, 1) - 1, i = 0, a = 1, o = Math.abs(e), s = [0, 1], c = [1, 1];
	for (let t = 0; t < 100; t++) {
		let t = s[0] + c[0], n = s[1] + c[1];
		if (n > r) break;
		let l = t / n, u = Math.abs(l - e);
		if (u < o && (o = u, i = t, a = n), l < e) s = [t, n];
		else if (l > e) c = [t, n];
		else break;
	}
	return [i, a];
}
function Xt(e, t, n) {
	let r = Gt(t), i = n ? Math.abs(e) : e;
	r.hasPercent && (i *= 100), r.commaScale > 0 && (i /= 1e3 ** r.commaScale);
	let a = i < 0 ? "-" : "", o = Math.abs(i);
	if (r.fraction) {
		let e = Math.floor(o), t = o - e, { wholeSpec: n, numSpec: i, denSpec: s, fixedDen: c } = r.fraction, l = n.length > 0, [u, d] = Yt(t, s.length, c), f = (e, t) => {
			let n = String(e), r = t.includes("0") ? "0" : " ";
			for (; n.length < t.length;) n = r + n;
			return n;
		}, p = (e, t) => {
			let n = String(e), r = t.includes("0") ? "0" : " ";
			for (; n.length < t.length;) n += r;
			return n;
		}, m = a;
		if (l) {
			let t = e > 0 ? String(e) : n.includes("0") ? "0" : "";
			if (u === 0) {
				let e = c === null ? s.length || 1 : String(c).length;
				m += t + " ".repeat(1 + i.length + 1 + e);
			} else {
				let e = c === null ? p(d, s) : String(c);
				m += t + " " + f(u, i) + "/" + e;
			}
		} else {
			let t = u + e * d, n = c === null ? p(d, s) : String(c);
			m += f(t, i) + "/" + n;
		}
		return m;
	}
	if (r.exp) {
		let e = Math.max(r.intSpec.length, 1), t = r.fracSpec.length, n = 0, i = 0;
		o !== 0 && (i = Math.floor(Math.log10(o)), i = Math.floor(i / e) * e, n = o / 10 ** i, parseFloat(s(n, t)) >= 10 ** e && (i += e, n = o / 10 ** i));
		let [c, l = ""] = s(n, t).split(".");
		return a + Zt(r, qt(c, r.intSpec, !1), Jt(l, r.fracSpec), "E" + (i < 0 ? "-" : r.exp.plus ? "+" : "") + String(Math.abs(i)).padStart(r.exp.width, "0"));
	}
	let c = r.fracSpec.length, [l, u = ""] = s(o, c).split("."), d = l.replace(/^0+/, ""), f = /[0]/.test(r.intSpec) || r.intSpec === "" && !1;
	return d === "" && f && (d = "0"), a + Zt(r, qt(d, r.intSpec, r.grouping), Jt(u, r.fracSpec), "");
}
function Zt(e, t, n, r) {
	let i = t.split(""), a = [];
	e.parts.forEach((e, t) => {
		e.kind === "intph" && a.push(t);
	});
	let o = n.split(""), s = [];
	e.parts.forEach((e, t) => {
		e.kind === "fracph" && s.push(t);
	});
	let c = /* @__PURE__ */ new Map(), l = i.length - 1;
	for (let e = a.length - 1; e >= 0; e--) if (e === 0) {
		let t = "";
		for (; l >= 0;) t = i[l--] + t;
		c.set(a[e], t);
	} else l >= 0 ? c.set(a[e], i[l--]) : c.set(a[e], "");
	let u = /* @__PURE__ */ new Map();
	for (let e = 0; e < s.length; e++) u.set(s[e], o[e] ?? "");
	let d = e.fracSpec.length > 0 && (n.length > 0 || /[0?]/.test(e.fracSpec)), f = "";
	for (let t = 0; t < e.parts.length; t++) {
		let n = e.parts[t];
		n.kind === "lit" ? f += n.text : n.kind === "intph" ? f += c.get(t) ?? "" : n.kind === "fracph" ? f += u.get(t) ?? "" : n.kind === "dot" ? f += d ? "." : "" : n.kind === "percent" ? f += "%" : n.kind === "exp" && (f += r);
	}
	return f;
}
function Qt(e, t) {
	let n = Ht(t).map(Ut), r = n.some((e) => e.condition), i, a = !1;
	if (r) {
		let t = !1;
		for (let r of n) if (r.condition) {
			if (Wt(r.condition, e)) {
				i = r, t = !0;
				break;
			}
		} else if (i ??= r, i === r) break;
		if (!i) return { text: "#" };
		a = t && e < 0;
	} else e > 0 ? i = n[0] : e < 0 ? n.length > 1 ? (i = n[1], a = !0) : i = n[0] : i = n.length > 2 ? n[2] : n[0];
	let o = Xt(e, i.body, a);
	return i.color ? {
		text: o,
		color: i.color
	} : { text: o };
}
//#endregion
//#region packages/xlsx/src/conditional-format.ts
function $t(e, t, n) {
	for (let r of e) if (t >= r.top && t <= r.bottom && n >= r.left && n <= r.right) return !0;
	return !1;
}
function en(e) {
	return e && e.value.type === "number" ? e.value.number : null;
}
function tn(e) {
	return e && e.value.type === "text" ? e.value.text : null;
}
function nn(e, t) {
	let n = [];
	for (let r of e.rows) for (let e of r.cells) e.value.type === "number" && $t(t, e.row, e.col) && n.push(e.value.number);
	return n;
}
function rn(e, t) {
	let n = t.length ? Math.min(...t) : 0, r = t.length ? Math.max(...t) : 0, i = e.value == null ? NaN : parseFloat(e.value);
	switch (e.kind) {
		case "min": return n;
		case "max": return r;
		case "num": return isNaN(i) ? 0 : i;
		case "percent": {
			let e = isNaN(i) ? 50 : i;
			return n + (r - n) * (e / 100);
		}
		case "percentile": {
			if (!t.length) return 0;
			let e = [...t].sort((e, t) => e - t), n = (isNaN(i) ? 50 : i) / 100;
			return e[Math.max(0, Math.min(e.length - 1, Math.round(n * (e.length - 1))))];
		}
		default: return isNaN(i) ? 0 : i;
	}
}
function an(e) {
	let t = [], n = /* @__PURE__ */ new Map();
	for (let t of e.rows) for (let e of t.cells) n.set(`${e.row}:${e.col}`, e);
	let r = /* @__PURE__ */ new Map();
	for (let t of e.definedNames ?? []) r.set(t.name, t);
	for (let n of e.conditionalFormats ?? []) {
		let r = nn(e, n.sqref);
		for (let e of n.rules) {
			let i = {
				rule: e,
				sqref: n.sqref
			};
			if (e.type === "colorScale") i.scaleStops = e.stops.map((e) => rn(e, r));
			else if (e.type === "dataBar") i.barMin = rn(e.min, r), i.barMax = rn(e.max, r);
			else if (e.type === "top10") {
				let t = [...r].sort((e, t) => e - t), n = t.length;
				if (n > 0) {
					let r = Math.min(e.rank, n);
					if (e.percent) {
						let a = e.top ? 1 - r / 100 : r / 100;
						i.top10Threshold = t[Math.max(0, Math.min(n - 1, Math.round(a * (n - 1))))];
					} else i.top10Threshold = e.top ? t[Math.max(0, n - r)] : t[Math.min(n - 1, r - 1)];
					i.top10IsTop = e.top;
				}
			} else if (e.type === "aboveAverage") {
				if (r.length > 0) {
					let t = r.reduce((e, t) => e + t, 0) / r.length;
					if (i.avgValue = t, i.avgIsAbove = e.aboveAverage, e.stdDev && e.stdDev > 0) {
						let e = r.reduce((e, n) => e + (n - t) * (n - t), 0) / r.length;
						i.avgStdDev = Math.sqrt(e);
					}
				}
			} else e.type === "iconSet" && (i.iconThresholds = e.cfvos.map((e) => rn(e, r)));
			t.push(i);
		}
	}
	return t.sort((e, t) => (e.rule.priority ?? 0) - (t.rule.priority ?? 0)), {
		compiled: t,
		worksheet: e,
		cellIndex: n,
		definedNames: r
	};
}
function on(e, t, n) {
	switch (t) {
		case "greaterThan": return e > (n[0] ?? 0);
		case "greaterThanOrEqual": return e >= (n[0] ?? 0);
		case "lessThan": return e < (n[0] ?? 0);
		case "lessThanOrEqual": return e <= (n[0] ?? 0);
		case "equal": return e === (n[0] ?? 0);
		case "notEqual": return e !== (n[0] ?? 0);
		case "between": return e >= (n[0] ?? 0) && e <= (n[1] ?? 0);
		case "notBetween": return e < (n[0] ?? 0) || e > (n[1] ?? 0);
		default: return !1;
	}
}
function sn(e) {
	let t = e.trim();
	if (t.length >= 2 && t.startsWith("\"") && t.endsWith("\"")) return { text: t.slice(1, -1).replace(/""/g, "\"") };
	let n = parseFloat(t);
	return isNaN(n) ? { text: t } : { num: n };
}
function cn(e, t, n) {
	let r = n[0] ?? "", i = n[1] ?? "", a = (e) => e.toLowerCase();
	switch (t) {
		case "equal": return a(e) === a(r);
		case "notEqual": return a(e) !== a(r);
		case "containsText": return a(e).includes(a(r));
		case "notContains": return !a(e).includes(a(r));
		case "beginsWith": return a(e).startsWith(a(r));
		case "endsWith": return a(e).endsWith(a(r));
		case "between": return a(e) >= a(r) && a(e) <= a(i);
		case "notBetween": return a(e) < a(r) || a(e) > a(i);
		default: return !1;
	}
}
function ln(e, t, n) {
	let r = e.replace("#", ""), i = t.replace("#", ""), a = parseInt(r.slice(0, 2), 16), o = parseInt(r.slice(2, 4), 16), s = parseInt(r.slice(4, 6), 16), c = parseInt(i.slice(0, 2), 16), l = parseInt(i.slice(2, 4), 16), u = parseInt(i.slice(4, 6), 16), d = Math.round(a + (c - a) * n), f = Math.round(o + (l - o) * n), p = Math.round(s + (u - s) * n);
	return `#${d.toString(16).padStart(2, "0").toUpperCase()}${f.toString(16).padStart(2, "0").toUpperCase()}${p.toString(16).padStart(2, "0").toUpperCase()}`;
}
function un(e, t, n) {
	if (!t.length) return "#FFFFFF";
	if (e <= n[0]) return t[0].color;
	if (e >= n[n.length - 1]) return t[t.length - 1].color;
	for (let r = 1; r < n.length; r++) if (e <= n[r]) {
		let i = n[r - 1], a = n[r], o = a === i ? 0 : (e - i) / (a - i);
		return ln(t[r - 1].color, t[r].color, o);
	}
	return t[t.length - 1].color;
}
function dn(e, t) {
	if (t && (t.fill && !e.fill && (e.fill = t.fill), t.font?.color && e.fontColor == null && (e.fontColor = t.font.color), t.font?.bold && e.fontBold == null && (e.fontBold = !0), t.font?.italic && e.fontItalic == null && (e.fontItalic = !0), t.font?.underline && e.fontUnderline == null && (e.fontUnderline = !0), t.font?.strike && e.fontStrike == null && (e.fontStrike = !0), t.numFmt && e.numFmt == null && (e.numFmt = {
		numFmtId: t.numFmt.numFmtId,
		formatCode: t.numFmt.formatCode || null
	}), t.border)) {
		let n = e.border ?? {};
		e.border = {
			left: n.left ?? t.border.left,
			right: n.right ?? t.border.right,
			top: n.top ?? t.border.top,
			bottom: n.bottom ?? t.border.bottom,
			diagonalUp: n.diagonalUp ?? t.border.diagonalUp,
			diagonalDown: n.diagonalDown ?? t.border.diagonalDown
		};
	}
}
function fn(e, t, n, r, i) {
	let a = {};
	if (!r.compiled.length) return a;
	for (let o of r.compiled) {
		if (!$t(o.sqref, t, n)) continue;
		let s = o.rule, c = en(e);
		if (s.type === "expression") {
			let e = o.sqref[0];
			if (!e) continue;
			if (Ve(s.formula, {
				row: t,
				col: n,
				anchorRow: e.top,
				anchorCol: e.left,
				cellIndex: r.cellIndex,
				definedNames: r.definedNames,
				depth: 0
			}) && (dn(a, s.dxfId == null ? null : i[s.dxfId]), s.stopIfTrue)) break;
			continue;
		}
		if (s.type === "cellIs") {
			let t = s.formulas.map(sn), n = tn(e), r = !1;
			c != null && t.every((e) => e.num != null) ? r = on(c, s.operator, t.map((e) => e.num)) : n != null && t.every((e) => e.text != null) && (r = cn(n, s.operator, t.map((e) => e.text))), r && dn(a, s.dxfId == null ? null : i[s.dxfId]);
		} else if (s.type === "top10") {
			if (c == null || o.top10Threshold == null) continue;
			(o.top10IsTop ? c >= o.top10Threshold : c <= o.top10Threshold) && dn(a, s.dxfId == null ? null : i[s.dxfId]);
		} else if (s.type === "aboveAverage") {
			if (c == null || o.avgValue == null) continue;
			let e = o.avgStdDev == null ? 0 : o.avgStdDev * (s.stdDev ?? 1), t = o.avgIsAbove ? o.avgValue + e : o.avgValue - e, n = s.equalAverage === !0;
			(o.avgIsAbove ? n ? c >= t : c > t : n ? c <= t : c < t) && dn(a, s.dxfId == null ? null : i[s.dxfId]);
		} else if (s.type === "iconSet") {
			if (c == null || !o.iconThresholds?.length) continue;
			let e = o.iconThresholds, t = e.length, n = 0;
			for (let r = 1; r < t; r++) c >= e[r] && (n = r);
			if (s.reverse && (n = t - 1 - n), s.customIcons && s.customIcons[n]) {
				let e = s.customIcons[n];
				e.iconSet !== "NoIcons" && (a.iconSet = {
					name: e.iconSet,
					index: e.iconId
				});
			} else a.iconSet = {
				name: s.iconSet,
				index: n
			};
		} else if (s.type === "colorScale") {
			if (c == null || !o.scaleStops || a.fill) continue;
			let e = un(c, s.stops, o.scaleStops);
			a.fill = {
				patternType: "solid",
				fgColor: e,
				bgColor: e
			};
		} else if (s.type === "dataBar") {
			if (c == null || o.barMin == null || o.barMax == null || a.dataBar) continue;
			let e = o.barMax - o.barMin, t = e === 0 ? 0 : Math.max(0, Math.min(1, (c - o.barMin) / e));
			a.dataBar = {
				color: s.color,
				ratio: t,
				gradient: s.gradient
			};
		}
	}
	return a;
}
//#endregion
//#region packages/xlsx/src/bidi-line.ts
function pn(e, t) {
	return e === 2 ? !0 : e === 1 ? !1 : De(void 0, t) === "rtl";
}
var mn = (e) => {
	let t = e.text;
	return typeof t == "string" ? t : void 0;
};
function hn(e, t) {
	let r = e === 2 || n(t);
	return {
		needBidi: r,
		baseRtl: r && pn(e, t)
	};
}
function gn(e, t) {
	let n = e.length;
	if (n === 0) return {
		order: [],
		rtl: []
	};
	let r = "", i = Array(n);
	for (let t = 0; t < n; t++) {
		i[t] = r.length;
		let n = mn(e[t]) ?? "";
		r += n.length > 0 ? n : "￼";
	}
	let { levels: a, paragraphLevel: o } = M().computeLevels(r, t ? "rtl" : "ltr"), { order: s, segLevels: c } = ye(a, o, i), l = Array(n);
	for (let e = 0; e < n; e++) l[e] = (c[e] & 1) == 1;
	return {
		order: s,
		rtl: l
	};
}
//#endregion
//#region packages/xlsx/src/a1.ts
function _n(e) {
	let t = /^\$?([A-Z]+)\$?(\d+)$/.exec(e.trim());
	if (!t) return null;
	let n = t[1], r = 0;
	for (let e = 0; e < n.length; e++) r = r * 26 + (n.charCodeAt(e) - 64);
	return {
		row: parseInt(t[2], 10),
		col: r
	};
}
function vn(e, t) {
	let n = "", r = t;
	for (; r > 0;) {
		let e = (r - 1) % 26;
		n = String.fromCharCode(65 + e) + n, r = Math.floor((r - 1) / 26);
	}
	return `${n}${e}`;
}
//#endregion
//#region packages/xlsx/src/vertical-text.ts
function yn(e, t, n, r, a, o = !1) {
	let s = t.codePointAt(0) ?? 0, c = _e(s);
	if (o && D(s)) {
		e.save(), e.translate(n, r + a / 2), e.textAlign = "center", e.textBaseline = "middle", he(e, () => e.fillText(t, 0, 0)), e.restore();
		return;
	}
	if (c === "Tr") {
		let o = ve(s);
		if (o !== null) {
			e.fillText(String.fromCodePoint(o), n, r);
			return;
		}
		if (i(s)) {
			e.fillText(t, n, r);
			return;
		}
		e.save(), e.translate(n, r + a / 2), e.rotate(Math.PI / 2), e.textAlign = "center", e.textBaseline = "middle", e.fillText(t, 0, 0), e.restore();
		return;
	}
	let l = c === "Tu" ? L(s) : null;
	e.fillText(l === null ? t : String.fromCodePoint(l), n, r);
}
//#endregion
//#region packages/xlsx/src/renderer.ts
function bn(e, t) {
	return t ? `${e}|duo:${t.clr1}:${t.clr2}` : e;
}
var xn = b.map((e) => `"${e}"`).join(", "), Sn = S.map((e) => `"${e}"`).join(", "), Cn = `"Calibri", "Carlito", "Cambria", "Caladea", Arial, "Noto Naskh Arabic", "Noto Sans Arabic", ${xn}, sans-serif`, wn = `"Cambria", "Caladea", "Times New Roman", "Liberation Serif", "Noto Naskh Arabic", "Noto Sans Arabic", ${Sn}, serif`, Tn = "\"Courier New\", \"Liberation Mono\", monospace";
function En(e) {
	let t = e ? p(e) : null, n = v(e);
	if (!t) return n === "serif" ? wn : n === "mono" ? Tn : Cn;
	let r = n === "serif";
	return `${c(t, r ? "serif" : "sans").map((e) => `"${e}"`).join(", ")}, "Calibri", "Carlito", "Cambria", "Caladea", Arial, "Noto Naskh Arabic", "Noto Sans Arabic", ${r ? Sn : xn}, ${r ? "serif" : "sans-serif"}`;
}
function Dn(e) {
	return e ? `"${e}", ${En(e)}` : Cn;
}
var On = 11, kn = 8;
function An(e, t, n) {
	return n - e - t;
}
function jn(e, t, n, r) {
	return r ? An(e, t, n) : e;
}
var Mn = "#7a7a7a", Nn = /* @__PURE__ */ new Map(), Pn = {
	"meiryo ui": {
		10: 8,
		11: 8
	},
	meiryo: {
		10: 8,
		11: 8
	}
};
function Fn(e, t) {
	let n = `${e}:${t}`, r = Nn.get(n);
	if (r !== void 0) return r;
	let i = Pn[e.toLowerCase()]?.[Math.round(t)];
	if (i !== void 0) return Nn.set(n, i), i;
	let a = t * G, o = typeof OffscreenCanvas < "u" ? new OffscreenCanvas(1, 1) : typeof document < "u" ? document.createElement("canvas") : null;
	if (!o) return kn;
	let s = o.getContext("2d");
	if (!s) return kn;
	s.font = `${a}px ${Dn(e)}`;
	let c = 0;
	for (let e of "0123456789") {
		let t = s.measureText(e).width;
		t > c && (c = t);
	}
	let l = Math.round(c) || kn;
	return Nn.set(n, l), l;
}
function Z(e) {
	return !e.defaultFontFamily || !e.defaultFontSize ? kn : Fn(e.defaultFontFamily, e.defaultFontSize);
}
function Q(e, t = kn) {
	return Math.trunc((256 * e + Math.trunc(128 / t)) / 256 * t);
}
function In(e, t = kn) {
	return e / t;
}
function $(e) {
	return Math.round(e * G);
}
function Ln(e) {
	return e / G;
}
function Rn(e, t, n, r, i, a, o) {
	if (!(i <= 0 || a <= 0)) {
		if (o) {
			let a = e.createLinearGradient(n, r, n + i, r);
			a.addColorStop(0, R(t, .85)), a.addColorStop(1, R(t, .15)), e.fillStyle = a;
		} else e.fillStyle = R(t);
		e.fillRect(n, r, i, a);
	}
}
function zn(e) {
	switch (e) {
		case "solid": return 1;
		case "darkGray": return .75;
		case "mediumGray": return .5;
		case "lightGray": return .25;
		case "gray125": return .125;
		case "gray0625": return .0625;
		case "darkHorizontal":
		case "darkVertical":
		case "darkDown":
		case "darkUp":
		case "darkGrid":
		case "darkTrellis": return .5;
		case "lightHorizontal":
		case "lightVertical":
		case "lightDown":
		case "lightUp":
		case "lightGrid":
		case "lightTrellis": return .25;
		default: return 1;
	}
}
var Bn = /* @__PURE__ */ new Map(), Vn = {
	gray0625: [
		128,
		0,
		8,
		0,
		128,
		0,
		8,
		0
	],
	gray125: [
		136,
		0,
		34,
		0,
		136,
		0,
		34,
		0
	],
	lightGray: [
		170,
		0,
		85,
		0,
		170,
		0,
		85,
		0
	],
	mediumGray: [
		170,
		85,
		170,
		85,
		170,
		85,
		170,
		85
	],
	darkGray: [
		119,
		221,
		119,
		221,
		119,
		221,
		119,
		221
	],
	darkHorizontal: [
		4095,
		4095,
		0,
		4095,
		4095,
		0,
		4095,
		4095,
		0,
		4095,
		4095,
		0
	],
	lightHorizontal: [
		4095,
		0,
		0,
		4095,
		0,
		0,
		4095,
		0,
		0,
		4095,
		0,
		0
	],
	darkVertical: Array(12).fill(3510),
	lightVertical: Array(12).fill(2340),
	darkGrid: [
		204,
		204,
		51,
		51,
		204,
		204,
		51,
		51
	],
	lightGrid: [
		255,
		136,
		136,
		136,
		255,
		136,
		136,
		136
	],
	darkDown: [
		204,
		102,
		51,
		153,
		204,
		102,
		51,
		153
	],
	lightDown: [
		136,
		68,
		34,
		17,
		136,
		68,
		34,
		17
	],
	darkUp: [
		51,
		102,
		204,
		153,
		51,
		102,
		204,
		153
	],
	lightUp: [
		17,
		34,
		68,
		136,
		17,
		34,
		68,
		136
	],
	darkTrellis: [
		255,
		102,
		255,
		153,
		255,
		102,
		255,
		153
	],
	lightTrellis: [
		153,
		102,
		102,
		153,
		153,
		102,
		102,
		153
	]
};
function Hn(e, t, n, r) {
	let i = e.getTransform(), a = Math.max(1, Math.round(Math.hypot(i.a, i.b))), o = Math.max(1, Math.round(Math.hypot(i.c, i.d))), s = `${t}|${n}|${r}|${a}|${o}`;
	if (Bn.has(s)) return Bn.get(s);
	let c = Vn[t];
	if (!c) return Bn.set(s, null), null;
	let l = c.length, u = k(l, l);
	if (!u) return Bn.set(s, null), null;
	let d = u.getContext("2d");
	if (!d) return Bn.set(s, null), null;
	d.fillStyle = R(r), d.fillRect(0, 0, l, l), d.fillStyle = R(n);
	for (let e = 0; e < l; e++) {
		let t = c[e];
		for (let n = 0; n < l; n++) t & 1 << l - 1 - n && d.fillRect(n, e, 1, 1);
	}
	let f = e.createPattern(u, "repeat");
	if (f && typeof DOMMatrix < "u" && (a >= 2 || o >= 2)) {
		let e = new DOMMatrix();
		e.scaleSelf(1 / a, 1 / o), f.setTransform(e);
	}
	return Bn.set(s, f), f;
}
function Un(e, t, n, r, i, a) {
	if (t.gradient && t.gradient.stops.length > 0) return e.fillStyle = Wn(e, t.gradient, n, r, i, a), e.fillRect(n, r, i, a), !0;
	let o = t.patternType;
	if (!o || o === "none") return !1;
	let s = t.fgColor ?? "000000", c = t.bgColor ?? "FFFFFF";
	if (o === "solid") return e.fillStyle = R(s), e.fillRect(n, r, i, a), !0;
	let l = Hn(e, o, s, c);
	if (l) e.fillStyle = l;
	else {
		let t = zn(o);
		e.fillStyle = t >= 1 ? R(s) : qn(s, c, t);
	}
	return e.fillRect(n, r, i, a), !0;
}
function Wn(e, t, n, r, i, a) {
	let o;
	if (t.gradientType === "path") {
		let s = n + i * (t.left + (1 - t.right - t.left) / 2), c = r + a * (t.top + (1 - t.bottom - t.top) / 2), l = Math.hypot(Math.max(s - n, n + i - s), Math.max(c - r, r + a - c));
		o = e.createRadialGradient(s, c, 0, s, c, l);
	} else {
		let s = t.degree * Math.PI / 180, c = n + i / 2, l = r + a / 2, u = (Math.abs(Math.cos(s)) * i + Math.abs(Math.sin(s)) * a) / 2;
		o = e.createLinearGradient(c - Math.cos(s) * u, l - Math.sin(s) * u, c + Math.cos(s) * u, l + Math.sin(s) * u);
	}
	for (let e of t.stops) {
		let t = Math.min(1, Math.max(0, e.position));
		o.addColorStop(t, R(e.color));
	}
	return o;
}
var Gn = _n;
function Kn(e, t, n, r, i) {
	let a = Math.max(4, Math.min(8, Math.min(r, i) * .18));
	e.save(), e.fillStyle = "#D40000", e.beginPath(), e.moveTo(t + r - a, n), e.lineTo(t + r, n), e.lineTo(t + r, n + a), e.closePath(), e.fill(), e.restore();
}
function qn(e, t, n) {
	let r = e.replace("#", ""), i = t.replace("#", ""), a = parseInt(r.slice(0, 2), 16), o = parseInt(r.slice(2, 4), 16), s = parseInt(r.slice(4, 6), 16), c = parseInt(i.slice(0, 2), 16), l = parseInt(i.slice(2, 4), 16), u = parseInt(i.slice(4, 6), 16), d = Math.min(1, Math.max(0, n));
	return `rgb(${Math.round(a * d + c * (1 - d))},${Math.round(o * d + l * (1 - d))},${Math.round(s * d + u * (1 - d))})`;
}
function Jn(e, t, n = 1, r) {
	let i = Math.round(e * G * n * t);
	return r ? Math.max(i, Math.round(le(r, e * G * t))) : i;
}
function Yn(e, t = 1) {
	return `${e.italic ? "italic " : ""}${e.bold ? "bold " : ""}${Math.max(1, Math.round(e.size * G * t))}px ${Dn(e.name)}`;
}
function Xn(e, t, n, r, i, a, o, s, c, l) {
	if (t.length === 0) return;
	let u = n?.fontId ?? 0, d = a.fonts[u] ?? a.fonts[0];
	if (!d) return;
	let f = n?.alignment ?? "left";
	e.save(), e.font = Yn(d, c), e.textBaseline = "top", e.textAlign = "left", e.fillStyle = l;
	let p = s + Math.round(2 * c);
	if (f === "noControl") {
		let n = o;
		for (let r of t) e.fillText(r.text, n, p), n += e.measureText(r.text).width;
		e.restore();
		return;
	}
	let m = Re(t, r, o, f, (t) => Zn(e, t, i));
	for (let t of m) {
		let n = e.measureText(t.text).width, r = [...t.text];
		if (t.spread === "distribute" && r.length > 1 && n < t.width) {
			let i = (t.width - n) / (r.length - 1);
			try {
				e.letterSpacing = `${i}px`;
			} catch {}
			e.fillText(t.text, t.x, p);
			try {
				e.letterSpacing = "0px";
			} catch {}
		} else t.spread === "center" ? e.fillText(t.text, t.x + (t.width - n) / 2, p) : e.fillText(t.text, t.x, p);
	}
	e.restore();
}
function Zn(e, t, n) {
	let r = e.font;
	e.font = n;
	let i = e.measureText(t).width;
	return e.font = r, i;
}
function Qn(e, t, n, r, i, a, o = 1) {
	if (e.save(), e.strokeStyle = i, e.lineWidth = .5, e.beginPath(), a) {
		let i = r - 1, a = r + 1, s = i + N(i, .5, o), c = a + N(a, .5, o);
		e.moveTo(t, s), e.lineTo(n, s), e.moveTo(t, c), e.lineTo(n, c);
	} else {
		let i = r + N(r, .5, o);
		e.moveTo(t, i), e.lineTo(n, i);
	}
	e.stroke(), e.restore();
}
function $n(e, t) {
	let n = t.font;
	return n ? {
		bold: n.bold,
		italic: n.italic,
		underline: n.underline,
		underlineStyle: n.underlineStyle,
		strike: n.strike,
		size: n.size ?? e.size,
		color: n.color ?? e.color,
		name: n.name ?? e.name,
		vertAlign: n.vertAlign
	} : e;
}
function er(e, t) {
	let n = e.cellXfs[t] ?? e.cellXfs[0] ?? {
		fontId: 0,
		fillId: 0,
		borderId: 0,
		numFmtId: 0,
		alignH: null,
		alignV: null,
		wrapText: !1
	};
	return {
		font: e.fonts[n.fontId] ?? {
			bold: !1,
			italic: !1,
			underline: !1,
			strike: !1,
			size: On,
			color: null,
			name: null
		},
		fill: e.fills[n.fillId] ?? {
			patternType: "none",
			fgColor: null,
			bgColor: null
		},
		border: e.borders[n.borderId] ?? {
			left: null,
			right: null,
			top: null,
			bottom: null
		},
		xf: n
	};
}
function tr(e, t, n) {
	let r = [];
	for (let i of t.split("\n")) r.push(...ar(e, i, n));
	return r;
}
function nr(e, t) {
	if (e.length === 0 || t.length === 0) return 0;
	let n = [...e, ...t], r = e.length;
	return r - f(n, r, _, 1);
}
function rr(e, t) {
	let n = t;
	for (; n < e.length;) {
		let t = e[e.length - n - 1], r = e[e.length - n], i = t?.codePointAt(0), a = r?.codePointAt(0);
		if (i !== void 0 && a !== void 0 && T(i) && T(a)) n++;
		else break;
	}
	return n >= e.length ? t : n;
}
function ir(e, t) {
	if (e.length === 0 || t.length === 0) return 0;
	let n = t[0].codePointAt(0), r = e.length - 1, i = e[r].codePointAt(0);
	if (i === void 0 || n === void 0 || i === 8203 || n === 8203 || !y(i, n)) return 0;
	for (; r > 0;) {
		let t = e[r - 1].codePointAt(0), n = e[r].codePointAt(0);
		if (t === void 0 || n === void 0 || !y(t, n)) break;
		r--;
	}
	return r === 0 ? 0 : e.length - r;
}
function ar(e, t, n) {
	let r = [], i = [], a = 0;
	for (; a < t.length;) {
		let e = t[a], n = e.codePointAt(0) ?? 0;
		if (x(n)) i.push(e), a += n > 65535 ? 2 : 1;
		else if (e === " ") {
			let e = a;
			for (; e < t.length && t[e] === " ";) e++;
			i.push(t.slice(a, e)), a = e;
		} else {
			let e = a;
			for (; e < t.length;) {
				let n = t[e], r = n.codePointAt(0) ?? 0;
				if (n === " " || x(r)) break;
				e += r > 65535 ? 2 : 1;
			}
			let n = t.slice(a, e), r = J(n) ? ne(n) : null;
			if (r && r.length > 0) {
				let e = 0;
				for (let t of r) i.push(n.slice(e, t)), e = t;
				i.push(n.slice(e));
			} else i.push(n);
			a = e;
		}
	}
	let o = "";
	for (let t of i) {
		if (o === "") {
			o = t;
			continue;
		}
		let i = o + t;
		if (e.measureText(i).width <= n) o = i;
		else {
			let e = t.replace(/^ +/, "");
			e === "" && (e = t);
			let n = [...o], i = nr(n, [...e]);
			if (i > 0) {
				let t = n.length - i;
				r.push(n.slice(0, t).join("")), o = n.slice(t).join("") + e;
			} else r.push(o), o = e;
		}
	}
	return r.push(o), r;
}
function or(e, t, n, r, i) {
	let a = [], s = [], c = 0, l = 0, u = null, d = n.size, f = n.name, p = 0, m = () => {
		s.length !== 0 && (a.push({
			segments: s,
			maxFontSize: l,
			maxFontFamily: u,
			para: p
		}), s = [], c = 0, l = 0, u = null);
	}, h = () => {
		if (s.length === 0) {
			a.push({
				segments: [],
				maxFontSize: d || On,
				maxFontFamily: f,
				para: p
			});
			return;
		}
		m();
	}, g = (t, n) => {
		if (!t) return;
		d = n.size, f = n.name, e.font = Yn(cr(n), r);
		let a = e.measureText(t).width;
		if (s.length > 0 && c + a > i) {
			let i = s.flatMap((e) => [...e.text]), a = nr(i, [...t]);
			a > 0 ? a = rr(i, a) : !J(t) && !J(s[s.length - 1]?.text ?? "") && !/^\s/u.test(t) && !/\s$/u.test(i.at(-1) ?? "") && (a = ir(i, [...t]));
			let o = s[s.length - 1], d = [...o.text];
			a > d.length && (a = d.length);
			let f = null;
			if (a > 0) {
				let t = d.slice(0, d.length - a), n = d.slice(d.length - a);
				if (e.font = Yn(cr(o.font), r), t.length === 0) s.pop();
				else {
					let n = t.join("");
					o.text = n, o.width = e.measureText(n).width;
				}
				let i = n.join("");
				f = {
					text: i,
					font: o.font,
					width: e.measureText(i).width
				};
			}
			m(), f && (s.push(f), c += f.width, f.font.size > l && (l = f.font.size, u = f.font.name)), e.font = Yn(cr(n), r);
		}
		s.push({
			text: t,
			font: n,
			width: a
		}), c += a, n.size > l && (l = n.size, u = n.name);
	}, _ = (t, n) => {
		let a = ne(t);
		if (a.length === 0) {
			g(t, n);
			return;
		}
		e.font = Yn(cr(n), r);
		let s = (t) => e.measureText(t).width, l = C(t), u = t.length, d = 0;
		for (; d < u;) {
			let e = i - c, r = O(t, a, d, e, s, l);
			if (r <= d) {
				if (c > 0) {
					m();
					continue;
				}
				let n = a.find((e) => e > d) ?? u, i = t.slice(d, n), f = o(i), p = O(i, f, 0, e, s, l);
				p <= 0 && (p = f.length > 0 ? f[0] : i.length), r = d + p;
			}
			g(t.slice(d, r), n), d = r, d < u && m();
		}
	};
	for (let e of t) {
		let t = $n(n, e), r = [], i = 0;
		for (; i < e.text.length;) {
			let t = e.text[i], n = t.codePointAt(0) ?? 0;
			if (n === 10) r.push("\n"), i += 1;
			else if (x(n)) r.push(t), i += n > 65535 ? 2 : 1;
			else if (t === " ") {
				let t = i;
				for (; t < e.text.length && e.text[t] === " ";) t++;
				r.push(e.text.slice(i, t)), i = t;
			} else {
				let t = i;
				for (; t < e.text.length;) {
					let n = e.text[t], r = n.codePointAt(0) ?? 0;
					if (n === " " || n === "\n" || x(r)) break;
					t += r > 65535 ? 2 : 1;
				}
				r.push(e.text.slice(i, t)), i = t;
			}
		}
		for (let e of r) e === "\n" ? (h(), p++) : J(e) ? _(e, t) : g(e, t);
	}
	return (s.length > 0 || a.length > 0) && h(), a;
}
function sr(e, t, n) {
	return e === "middle" ? {
		underline: t + Math.round(n * .55),
		strike: t
	} : e === "bottom" ? {
		underline: t + 1,
		strike: t - Math.round(n * .35)
	} : {
		underline: t + n + 1,
		strike: t + Math.round(n * .5)
	};
}
function cr(e) {
	return e.vertAlign === "superscript" || e.vertAlign === "subscript" ? {
		...e,
		size: e.size * .65
	} : e;
}
function lr(e, t, n, r, i, a, o, s) {
	e.textAlign = "left", e.textBaseline = i;
	let c = s.needBidi ? gn(t, s.baseRtl ?? !1) : null, l = e, u = n;
	for (let n = 0; n < t.length; n++) {
		let d = c ? c.order[n] : n;
		if (c) try {
			l.direction = c.rtl[d] ? "rtl" : "ltr";
		} catch {}
		let f = t[d], p = cr(f.font);
		e.font = Yn(p, a);
		let m = s.fontColor ?? f.font.color;
		e.fillStyle = m ? R(m) : "#000000";
		let h = Jn(f.font.size, a), g = 0;
		f.font.vertAlign === "superscript" ? g = -Math.round(h * .35) : f.font.vertAlign === "subscript" && (g = Math.round(h * .1)), e.fillText(f.text, u, r + g);
		let _ = Jn(p.size, a);
		if (f.font.underline || f.font.strike) {
			let t = sr(i, r, _);
			if (f.font.underline) {
				let n = m ? R(m) : "#000000", r = f.font.underlineStyle === "double" || f.font.underlineStyle === "doubleAccounting";
				Qn(e, u, u + f.width, t.underline + g, n, r, o);
			}
			if (f.font.strike) {
				let n = t.strike + g, r = n + N(n, .5, o);
				e.save(), e.strokeStyle = m ? R(m) : "#000000", e.lineWidth = .5, e.beginPath(), e.moveTo(u, r), e.lineTo(u + f.width, r), e.stroke(), e.restore();
			}
		}
		u += f.width;
	}
	if (c) try {
		l.direction = "ltr";
	} catch {}
}
function ur(e, t, n, r, i, a, o, s, c) {
	let { alignH: l, cx: u, cellW: d, leftPad: f, paddingX: p } = r, m = t.map((t) => {
		let r = $n(n, t);
		return e.font = Yn(cr(r), i), {
			text: t.text,
			font: r,
			width: e.measureText(t.text).width
		};
	}), h = m.reduce((e, t) => e + t.width, 0), g;
	g = l === "right" ? u + d - p - h : l === "center" ? u + d / 2 - h / 2 : u + f;
	let { needBidi: _, baseRtl: v } = hn(o.readingOrder, m.map((e) => e.text).join(""));
	lr(e, m, g, s, c, i, a, {
		fontColor: o.fontColor,
		needBidi: _,
		baseRtl: v
	});
}
function dr(e, t, n, r, i, a, o = {}) {
	let { alignV: s, cy: c, cellH: l, paddingY: u } = r, d, f;
	s === "top" ? (f = "top", d = c + u) : s === "center" ? (f = "middle", d = c + l / 2) : (f = "bottom", d = c + l - u), ur(e, t, n, r, i, a, o, d, f);
}
function fr(e, t, n, r, i, a, o = {}) {
	let { alignV: s, cy: c, cellH: l, paddingY: u } = r, d = [[]];
	for (let e of t) {
		let t = e.text.split("\n");
		for (let n = 0; n < t.length; n++) n > 0 && d.push([]), t[n] !== "" && d[d.length - 1].push({
			...e,
			text: t[n]
		});
	}
	let f = n.size, p = n.name, m = d.map((e) => {
		if (e.length === 0) return {
			pt: f || On,
			family: p
		};
		let t = 0, r = null;
		for (let i of e) {
			let e = $n(n, i);
			e.size > t && (t = e.size, r = e.name), f = e.size, p = e.name;
		}
		return {
			pt: t,
			family: r
		};
	}).map((e) => Jn(e.pt, i, 1.2, e.family ?? void 0)), h = m.reduce((e, t) => e + t, 0), g;
	g = s === "top" ? c + u : s === "center" ? c + (l - h) / 2 : c + l - h - u;
	for (let t = 0; t < d.length; t++) {
		let s = d[t];
		s.length > 0 && ur(e, s, n, r, i, a, o, g, "top"), g += m[t];
	}
}
function pr(e, t, n, r, i, a, o = {}) {
	t.some((e) => e.text.includes("\n")) ? fr(e, t, n, r, i, a, o) : dr(e, t, n, r, i, a, o);
}
function mr(e, t, n, r, i, a, o = {}) {
	let { alignH: s, alignV: c, cx: l, cy: u, cellW: d, cellH: f, leftPad: p, paddingX: m, paddingY: h } = r, g = or(e, t, n, i, d - p - m), _ = g.reduce((e, t) => e + Jn(t.maxFontSize, i, 1.2, t.maxFontFamily ?? void 0), 0), v;
	v = c === "top" ? u + h : c === "center" ? u + (f - _) / 2 : u + f - _ - h;
	let y = t.map((e) => e.text).join("").split("\n").map((e) => hn(o.readingOrder, e));
	for (let t of g) {
		let n = t.segments.reduce((e, t) => e + t.width, 0), r;
		r = s === "right" ? l + d - m - n : s === "center" ? l + d / 2 - n / 2 : l + p;
		let { needBidi: c, baseRtl: u } = y[t.para];
		lr(e, t.segments, r, v, "top", i, a, {
			fontColor: o.fontColor,
			needBidi: c,
			baseRtl: u
		}), v += Jn(t.maxFontSize, i, 1.2, t.maxFontFamily ?? void 0);
	}
}
function hr(e) {
	let t = "";
	for (; e > 0;) {
		let n = (e - 1) % 26;
		t = String.fromCharCode(65 + n) + t, e = Math.floor((e - 1) / 26);
	}
	return t;
}
var gr = [
	"#FF0000",
	"#FFFF00",
	"#00B050"
], _r = [
	"#FF0000",
	"#FF6600",
	"#FFFF00",
	"#00B050"
], vr = [
	"#FF0000",
	"#FF6600",
	"#FFFF00",
	"#92D050",
	"#00B050"
];
function yr(e, t, n, r, i, a) {
	if (t === "NoIcons") return;
	let o = t || "3TrafficLights1", s = parseInt(o[0]) || 3, c = s === 5 ? vr : s === 4 ? _r : gr, l = c[Math.max(0, Math.min(n, c.length - 1))];
	if (e.save(), e.fillStyle = l, o.includes("Arrow")) {
		let t = a / 2;
		e.beginPath(), n === s - 1 ? (e.moveTo(r + t, i), e.lineTo(r + a, i + a), e.lineTo(r, i + a)) : n === 0 ? (e.moveTo(r, i), e.lineTo(r + a, i), e.lineTo(r + t, i + a)) : (e.moveTo(r, i + a * .3), e.lineTo(r + a, i + t), e.lineTo(r, i + a * .7)), e.closePath(), e.fill();
	} else o.includes("Flag") ? (e.beginPath(), e.moveTo(r, i), e.lineTo(r + a, i), e.lineTo(r, i + a), e.closePath(), e.fill()) : (e.beginPath(), e.arc(r + a / 2, i + a / 2, a / 2, 0, Math.PI * 2), e.fill());
	e.restore();
}
function br(e, t, n, r, i) {
	let a = Math.max(6, Math.round(Math.min(r, i) * .45)), o = t + r - a - 1, s = n + i - a - 1;
	e.save(), e.fillStyle = "#D0D0D0", e.fillRect(o, s, a, a), e.fillStyle = "#444444";
	let c = a * .55, l = o + (a - c) / 2, u = s + (a - c * .5) / 2;
	e.beginPath(), e.moveTo(l, u), e.lineTo(l + c, u), e.lineTo(l + c / 2, u + c * .5), e.closePath(), e.fill(), e.restore();
}
function xr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.tables ?? []) {
		if (!n.styleName) continue;
		let { top: e, bottom: r, left: i, right: a } = n.range, o = n.accentColor || "#808080", s = !!n.isCustom, c = Math.max(0, n.headerRowCount ?? 1), l = Math.max(0, n.totalsRowCount ?? 0), u = e + c - 1, d = r - l + 1;
		for (let f = e; f <= r; f++) {
			let p = c > 0 && f <= u, m = l > 0 && f >= d, h = !p && !m ? f - u - 1 : -1, g = n.showRowStripes && h >= 0 ? h % 2 == 1 ? n.band1HorizontalDxf : n.band2HorizontalDxf : void 0;
			for (let c = i; c <= a; c++) t.set(`${f}:${c}`, {
				accent: o,
				isCustom: s,
				isHeader: p,
				isTotals: m,
				isBanded: n.showRowStripes && h >= 0 && h % 2 == 1,
				isFirstCol: n.showFirstColumn && c === i,
				isLastCol: n.showLastColumn && c === a,
				isTopEdge: f === e,
				isBottomEdge: f === r,
				wholeTableDxf: n.wholeTableDxf,
				headerRowDxf: n.headerRowDxf,
				totalRowDxf: n.totalRowDxf,
				firstColumnDxf: n.firstColumnDxf,
				lastColumnDxf: n.lastColumnDxf,
				stripeDxf: g
			});
		}
	}
	return t;
}
function Sr(e, t, n, r) {
	let i = t?.border?.horizontal, a = t?.border?.top, o = t?.border?.bottom, s = t?.border?.left, c = t?.border?.right, l = n?.border?.bottom, u = n?.border?.top;
	if (i || a || o || s || c || l || u) {
		let t = {
			left: null,
			right: null,
			top: null,
			bottom: null
		};
		return e.isTopEdge ? t.top = a ?? null : i && (t.top = i), e.isHeader && l ? t.bottom = l : e.isBottomEdge ? t.bottom = o ?? null : i && (t.bottom = i), (e.isFirstCol || r === 0) && (t.left = s ?? null), e.isLastCol && (t.right = c ?? null), {
			kind: "dxf",
			border: t
		};
	}
	return e.isCustom ? { kind: "none" } : {
		kind: "accent",
		color: e.accent,
		lineWidth: e.isHeader ? 1.5 : 1,
		topEdge: e.isTopEdge
	};
}
function Cr(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e.sparklineGroups ?? []) {
		let e = Infinity, r = -Infinity;
		if (n.minAxisType === "group" || n.maxAxisType === "group") {
			for (let t of n.sparklines) for (let n of t.values) typeof n == "number" && (n < e && (e = n), n > r && (r = n));
			(!isFinite(e) || !isFinite(r)) && (e = 0, r = 1);
		}
		for (let i of n.sparklines) {
			let a = i.values.filter((e) => typeof e == "number"), o = a.length ? Math.min(...a) : 0, s = a.length ? Math.max(...a) : 1, c = n.minAxisType === "custom" && typeof n.manualMin == "number" ? n.manualMin : n.minAxisType === "group" ? e : o, l = n.maxAxisType === "custom" && typeof n.manualMax == "number" ? n.manualMax : n.maxAxisType === "group" ? r : s;
			t.set(`${i.row}:${i.col}`, {
				kind: n.kind,
				values: i.values,
				min: c,
				max: l,
				displayEmptyCellsAs: n.displayEmptyCellsAs === "zero" || n.displayEmptyCellsAs === "span" ? n.displayEmptyCellsAs : "gap",
				displayXAxis: n.displayXAxis,
				lineWeight: n.lineWeight,
				markers: n.markers,
				high: n.high,
				low: n.low,
				first: n.first,
				last: n.last,
				negative: n.negative,
				colorSeries: n.colorSeries,
				colorNegative: n.colorNegative,
				colorAxis: n.colorAxis,
				colorMarkers: n.colorMarkers,
				colorFirst: n.colorFirst,
				colorLast: n.colorLast,
				colorHigh: n.colorHigh,
				colorLow: n.colorLow
			});
		}
	}
	return t;
}
function wr(e) {
	let t = e.replace("#", "");
	if (t.length < 6) return "#F2F2F2";
	let n = parseInt(t.slice(0, 2), 16), r = parseInt(t.slice(2, 4), 16), i = parseInt(t.slice(4, 6), 16), a = (e) => Math.round(e * .2 + 255 * .8), o = (e) => e.toString(16).padStart(2, "0").toUpperCase();
	return `#${o(a(n))}${o(a(r))}${o(a(i))}`;
}
function Tr(e, t, n, r, i, a, o, s, c, l, u, d, f, p) {
	if (f <= 0 || p <= 0) return;
	let { styles: m, cellMap: h, mergeAnchorMap: g, mergeSkipSet: _, cfContext: v, cs: y, dpr: b } = t, x = i.length, S = a.length, C = (e, n) => t.rtl ? An(e, n, t.canvasW) : e, w = [], T = -o;
	for (let e = 0; e < x; e++) w.push(T), T += i[e];
	let E = [], O = -s;
	for (let e = 0; e < S; e++) E.push(O), O += a[e];
	e.save(), e.beginPath(), e.rect(C(u, f), d, f, p), e.clip();
	let k = [], A = [], j = [];
	for (let i of t.worksheet.mergeCells ?? []) {
		let a = i.top, u = i.left;
		if (a >= n && a < n + S && u >= r && u < r + x || i.bottom < n || i.top >= n + S || i.right < r || i.left >= r + x) continue;
		let d = t.mergeAnchorMap.get(`${a}:${u}`);
		if (!d) continue;
		let f;
		if (u >= r) f = c + w[u - r];
		else {
			let e = 0;
			for (let n = u; n < r; n++) e += Math.round(Q(t.worksheet.colWidths[n] ?? t.worksheet.defaultColWidth, t.mdw) * y);
			f = c - o - e;
		}
		let p;
		if (a >= n) p = l + E[a - n];
		else {
			let e = 0;
			for (let r = a; r < n; r++) e += Math.round($(t.worksheet.rowHeights[r] ?? t.worksheet.defaultRowHeight) * y);
			p = l - s - e;
		}
		let h = d.totalW, g = d.totalH;
		f = C(f, h);
		let _ = `${a}:${u}`, T = t.cellMap.get(_), { font: D, fill: O, border: k, xf: j } = er(m, T?.styleIndex ?? 0), M = fn(T, a, u, v, m.dxfs ?? []);
		if (Un(e, M.fill ?? O, f, p, h, g), M.dataBar && M.dataBar.ratio > 0) {
			let t = Math.max(0, (h - 4) * M.dataBar.ratio);
			Rn(e, M.dataBar.color, f + 2, p + 2, t, g - 4, M.dataBar.gradient);
		}
		let N = Kr(Gr(k, a, u, d.right, d.bottom, t.cellMap, m), M.border);
		if (A.push(() => qr(e, N, f, p, h, g, b)), !T) continue;
		let P = xt(T, m, M.numFmt, t.worksheet.date1904), F = P.text;
		if (!F || F === "0" && t.worksheet.showZeros === !1) continue;
		let ee = D.bold || !!M.fontBold, I = D.italic || !!M.fontItalic, L = D.underline || !!M.fontUnderline, z = D.strike || !!M.fontStrike, B = ee !== D.bold || I !== D.italic || L !== D.underline || z !== D.strike ? {
			...D,
			bold: ee,
			italic: I,
			underline: L,
			strike: z
		} : D;
		e.font = Yn(B, y);
		let V = t.hyperlinkMap.get(_) ? "#0563C1" : M.fontColor ?? P.color ?? D.color;
		e.fillStyle = V ? R(V) : "#000000";
		let H = T.value.type === "number", U = j.alignH ?? (H ? "right" : "left"), te = j.alignV ?? "bottom", W = j.indent ? Math.round(j.indent * 3 * t.mdw) : 0, ne = 3 + (U === "left" || !j.alignH ? W : 0);
		e.save(), e.beginPath(), e.rect(f, p, h, g), e.clip();
		let G;
		U === "right" ? (G = f + h - 3, e.textAlign = "right") : U === "center" ? (G = f + h / 2, e.textAlign = "center") : (G = f + ne, e.textAlign = "left");
		let re = T.value.type === "text" ? T.value.runs : void 0, ie = re && re.length > 0;
		if (j.wrapText && ie) mr(e, re, B, {
			alignH: U,
			alignV: te,
			cx: f,
			cy: p,
			cellW: h,
			cellH: g,
			leftPad: ne,
			paddingX: 3,
			paddingY: 2
		}, y, b, {
			fontColor: M.fontColor,
			readingOrder: j.readingOrder
		});
		else if (j.wrapText) {
			let t = tr(e, F, h - ne - 3), n = Jn(D.size, y, 1.2, D.name ?? void 0), r = t.length * n, i;
			i = te === "top" ? p + 2 : te === "center" ? p + (g - r) / 2 : p + g - r - 2, e.textBaseline = "top";
			for (let r = 0; r < t.length; r++) e.fillText(t[r], G, i + r * n);
		} else if (ie) pr(e, re, B, {
			alignH: U,
			alignV: te,
			cx: f,
			cy: p,
			cellW: h,
			cellH: g,
			leftPad: ne,
			paddingX: 3,
			paddingY: 2
		}, y, b, {
			fontColor: M.fontColor,
			readingOrder: j.readingOrder
		});
		else {
			let t;
			te === "top" ? (e.textBaseline = "top", t = p + 2) : te === "center" ? (e.textBaseline = "middle", t = p + g / 2) : (e.textBaseline = "bottom", t = p + g - 2), e.fillText(F, G, t);
		}
		e.restore();
	}
	for (let o = 0; o < S; o++) {
		let s = n + o, S = l + E[o], T = a[o];
		if (S + T <= d || S >= d + p) continue;
		let O = /* @__PURE__ */ new Set(), M = /* @__PURE__ */ new Set(), P = -1, F = (e) => {
			if (P >= 0 && e - P >= 2) {
				for (let t = P; t < e - 1; t++) O.add(t);
				for (let t = P + 1; t < e; t++) M.add(t);
			}
			P = -1;
		};
		for (let e = 0; e <= x; e++) {
			let t = !1, n = !1;
			if (e < x) {
				let i = `${s}:${r + e}`;
				if (!_.has(i) && !g.has(i)) {
					let e = h.get(i);
					t = er(m, e?.styleIndex ?? 0).xf.alignH === "centerContinuous", n = !!(e && e.value && e.value.type !== "empty");
				}
			}
			t ? n && P >= 0 && e > P ? (F(e), P = e) : P < 0 && (P = e) : F(e);
		}
		for (let n = 0; n < x; n++) {
			let a = r + n, l = c + w[n], d = i[n];
			if (l + d <= u || l >= u + f) continue;
			let p = `${s}:${a}`;
			if (_.has(p)) continue;
			let E = g.get(p), P = E ? E.totalW : d, F = E ? E.totalH : T, I = C(l, P), L = h.get(p), { font: z, fill: B, border: V, xf: H } = er(m, L?.styleIndex ?? 0), U = fn(L, s, a, v, m.dxfs ?? []), te = U.fill ?? B, W = t.tableStyleMap.get(p), ne = m.dxfs ?? [], G = (e) => e == null ? void 0 : ne[e], re = G(W?.wholeTableDxf), ie = G(W?.headerRowDxf), ae = G(W?.totalRowDxf), oe = G(W?.firstColumnDxf), se = G(W?.lastColumnDxf), ce = G(W?.stripeDxf), le = W?.isHeader && ie?.fill?.fgColor ? ie : W?.isTotals && ae?.fill?.fgColor ? ae : W?.isLastCol && se?.fill?.fgColor ? se : W?.isFirstCol && oe?.fill?.fgColor ? oe : ce?.fill?.fgColor ? ce : !W?.isHeader && !W?.isTotals && re?.fill?.fgColor ? re : void 0;
			if (Un(e, te, I, S, P, F) || (W && le?.fill?.fgColor ? (e.fillStyle = R(le.fill.fgColor), e.fillRect(I, S, P, F)) : W && !W.isCustom && W.isBanded && (e.fillStyle = wr(W.accent), e.fillRect(I, S, P, F))), t.commentCells.has(p) && Kn(e, I, S, P, F), U.dataBar && U.dataBar.ratio > 0) {
				let t = Math.max(0, (P - 4) * U.dataBar.ratio);
				Rn(e, U.dataBar.color, I + 2, S + 2, t, F - 4, U.dataBar.gradient);
			}
			let ue = t.sparklineMap.get(p);
			if (ue && Oe(e, {
				x: I,
				y: S,
				w: P,
				h: F
			}, ue), t.worksheet.showGridlines !== !1) {
				if (e.strokeStyle = "#d0d0d0", e.lineWidth = .5, e.beginPath(), !O.has(n)) {
					let t = I + P + N(I + P, .5, b);
					e.moveTo(t, S), e.lineTo(t, S + F);
				}
				let t = S + F + N(S + F, .5, b);
				if (e.moveTo(I, t), e.lineTo(I + P, t), o === 0) {
					let t = S + N(S, .5, b);
					e.moveTo(I, t), e.lineTo(I + P, t);
				}
				if (n === 0) {
					let t = I + N(I, .5, b);
					e.moveTo(t, S), e.lineTo(t, S + F);
				}
				e.stroke();
			}
			let K = Kr(E ? Gr(V, s, a, E.right, E.bottom, h, m) : V, U.border);
			(O.has(n) || M.has(n)) && (K = {
				...K,
				left: M.has(n) ? null : K.left,
				right: O.has(n) ? null : K.right
			});
			let de = h.get(`${s - 1}:${a}`), fe = de ? er(m, de.styleIndex ?? 0).border.bottom : null;
			if (fe?.style && (o === 0 || K.top?.style) && (K = {
				...K,
				top: Zr(K.top, fe)
			}), !M.has(n)) {
				let e = h.get(`${s}:${a - 1}`), t = e ? er(m, e.styleIndex ?? 0).border.right : null;
				t?.style && (n === 0 || K.left?.style) && (K = {
					...K,
					left: Zr(K.left, t)
				});
			}
			let q = W ? Sr(W, re, ie, a) : null, pe = t.autoFilterCells.has(p), me = () => {
				if (q) {
					if (q.kind === "dxf") qr(e, q.border, I, S, P, F, b);
					else if (q.kind === "accent") {
						let t = .5 / b;
						if (e.strokeStyle = q.color, e.lineWidth = q.lineWidth, e.beginPath(), e.moveTo(I, S + F - t), e.lineTo(I + P, S + F - t), q.topEdge) {
							let t = S + N(S, q.lineWidth, b);
							e.moveTo(I, t), e.lineTo(I + P, t);
						}
						e.stroke();
					}
				}
				pe && br(e, I, S, d, F);
			};
			if (E) {
				let t = K;
				A.push(() => qr(e, t, I, S, P, F, b)), me();
			} else {
				let t = K;
				j.push(() => {
					qr(e, t, I, S, P, F, b), me();
				});
			}
			if (!L) continue;
			let he = xt(L, m, U.numFmt, t.worksheet.date1904), J = he.text;
			!J || J === "0" && t.worksheet.showZeros === !1 || k.push(() => {
				let o = W?.isHeader ? ie : W?.isTotals ? ae : W?.isLastCol && se ? se : W?.isFirstCol && oe ? oe : ce || (W ? re : void 0), c = W ? W.isCustom ? !!o?.font?.bold : W.isHeader || W.isTotals : !1, l = z.bold || !!U.fontBold || c, u = z.italic || !!U.fontItalic, d = z.underline || !!U.fontUnderline, f = z.strike || !!U.fontStrike, v = l !== z.bold || u !== z.italic || d !== z.underline || f !== z.strike ? {
					...z,
					bold: l,
					italic: u,
					underline: d,
					strike: f
				} : z;
				e.font = Yn(v, y);
				let C = t.hyperlinkMap.get(p), w = o?.font?.color ?? null, T = C ? "#0563C1" : U.fontColor ?? he.color ?? w ?? z.color;
				e.fillStyle = T ? R(T) : "#000000";
				let O = L.value.type === "number", k = H.alignH ?? (O ? "right" : "left"), A = H.alignV ?? "bottom", j = H.indent ? Math.round(H.indent * 3 * t.mdw) : 0, M = U.iconSet ? Math.max(8, Math.round(Math.min(P, F) * .55)) : 0, B = M > 0 ? M + 4 : 0, V = 3 + (k === "left" || !H.alignH ? j : 0) + B, te = P, ne = I, G = n;
				if (k === "centerContinuous" && !E) for (let e = n + 1; e < x; e++) {
					let t = `${s}:${r + e}`;
					if (_.has(t) || g.has(t)) break;
					let n = h.get(t);
					if (n && n.value.type !== "empty" || er(m, n?.styleIndex ?? 0).xf.alignH !== "centerContinuous") break;
					te += i[e], G = e;
				}
				let le = k === "centerContinuous" ? ne : I, ue = k === "centerContinuous" ? te : P, K = J.includes("\n");
				if (!E && !H.wrapText && !H.textRotation && !O && !K) {
					let t = e.measureText(J).width, a = k === "centerContinuous", o = a ? t + 6 : t + V + 3, c = a ? te : P;
					if (o > c) {
						let e = o - c, t = 0, l = 0;
						if (k === "right" ? l = e : k === "center" || a ? (l = e / 2, t = e / 2) : t = e, t > 0) {
							let e = t, o = a ? G + 1 : n + 1;
							for (let t = o; t < x && e > 0; t++) {
								let n = `${s}:${r + t}`;
								if (_.has(n) || g.has(n)) break;
								let a = h.get(n);
								if (a && a.value.type !== "empty") break;
								ue += i[t], e -= i[t];
							}
						}
						if (l > 0) {
							let e = l;
							for (let t = n - 1; t >= 0 && e > 0; t--) {
								let n = `${s}:${r + t}`;
								if (_.has(n) || g.has(n)) break;
								let a = h.get(n);
								if (a && a.value.type !== "empty") break;
								le -= i[t], ue += i[t], e -= i[t];
							}
						}
					}
				}
				let de = J, fe = 0;
				if (k === "fill" && !O && J.length > 0) {
					let t = Math.max(1, P - 6), n = e.measureText(J).width;
					if (n > 0 && n < t) {
						let e = Math.max(1, Math.floor(t / n));
						de = J.repeat(e);
					}
				}
				if (k === "distributed" || k === "justify" && !H.wrapText && !K) {
					let t = Math.max(1, P - 6), n = e.measureText(de).width, r = Math.max(1, [...de].length - 1);
					n < t && (fe = Math.max(0, (t - n) / r));
				}
				let q, pe;
				k === "right" ? (q = I + P - 3, pe = "right") : k === "center" ? (q = I + P / 2, pe = "center") : k === "centerContinuous" ? (q = ne + te / 2, pe = "center") : k === "distributed" || k === "justify" && !H.wrapText && !K ? (q = I + 3, pe = "left") : (q = I + V, pe = "left");
				let me = H.textRotation ?? 0, ge = me === 255, _e = me > 0 && me !== 255;
				if (U.iconSet && M > 0 && (e.save(), e.beginPath(), e.rect(I, S, P, F), e.clip(), yr(e, U.iconSet.name, U.iconSet.index, I + 2, S + (F - M) / 2, M), e.restore()), e.save(), e.beginPath(), e.rect(le, S, ue, F), e.clip(), ge) {
					let t = Jn(z.size, y, 1.1), n = [...J].length * t, r = A === "top" ? S + 2 : A === "center" ? S + (F - n) / 2 : S + F - n - 2;
					e.textAlign = "center", e.textBaseline = "top";
					for (let n of J) {
						let i = n.codePointAt(0) ?? 0, a = D(i) && ee(e, i);
						yn(e, n, I + P / 2, r, t, a), r += t;
					}
					e.restore();
					return;
				}
				if (_e) {
					let t = me <= 90 ? -(me * Math.PI / 180) : (me - 90) * Math.PI / 180;
					e.translate(I + P / 2, S + F / 2), e.rotate(t), e.textAlign = "center", e.textBaseline = "middle", e.fillText(J, 0, 0), e.restore();
					return;
				}
				if (H.shrinkToFit) {
					let t = e.measureText(J).width, n = P - V - 3;
					if (t > n && t > 0) {
						let r = n / t, i = k === "right" ? I + P - 3 : k === "center" ? I + P / 2 : I + V;
						e.transform(r, 0, 0, 1, i * (1 - r), 0);
					}
				}
				if (e.textAlign = pe, fe > 0) try {
					e.letterSpacing = `${fe}px`;
				} catch {}
				try {
					e.direction = pn(H.readingOrder, J) ? "rtl" : "ltr";
				} catch {}
				let ve = L.value.type === "text" ? L.value.runs : void 0, ye = ve && ve.length > 0;
				if (H.wrapText && ye) mr(e, ve, v, {
					alignH: k,
					alignV: A,
					cx: I,
					cy: S,
					cellW: P,
					cellH: F,
					leftPad: V,
					paddingX: 3,
					paddingY: 2
				}, y, b, {
					fontColor: U.fontColor,
					readingOrder: H.readingOrder
				});
				else if (H.wrapText) {
					let t = tr(e, J, P - V - 3), n = Jn(z.size, y, 1.2, z.name ?? void 0), r = t.length * n, i;
					A === "top" ? (i = S + 2, e.textBaseline = "top") : A === "center" ? (i = S + (F - r) / 2, e.textBaseline = "top") : (i = S + F - r - 2, e.textBaseline = "top");
					for (let r = 0; r < t.length; r++) e.fillText(t[r], q, i + r * n);
				} else if (ye) pr(e, ve, v, {
					alignH: k,
					alignV: A,
					cx: I,
					cy: S,
					cellW: P,
					cellH: F,
					leftPad: V,
					paddingX: 3,
					paddingY: 2
				}, y, b, {
					fontColor: U.fontColor,
					readingOrder: H.readingOrder
				});
				else {
					let t = v.vertAlign, n = Jn(z.size, y), r = 0;
					t === "superscript" ? r = -Math.round(n * .35) : t === "subscript" && (r = Math.round(n * .1));
					let i = t ? {
						...v,
						size: v.size * .65
					} : v;
					t && (e.font = Yn(i, y));
					let a = null, o = () => a ??= e.measureText(J), s = () => {
						let e = Math.min(o().width, ue - V - 3);
						return {
							x: k === "right" ? I + P - 3 - e : k === "center" ? I + P / 2 - e / 2 : I + V,
							width: e
						};
					}, c = Jn(i.size, y);
					if (v.underline || C) {
						let { x: t, width: n } = s(), i = (A === "top" ? S + 2 + c + 1 : A === "center" ? S + F / 2 + Math.round(c * .55) : S + F - 2 + 1) + r, a = C ? "#0563C1" : T ? R(T) : "#000000", o = v.underlineStyle === "double" || v.underlineStyle === "doubleAccounting";
						Qn(e, t, t + n, i, a, o, b);
					}
					if (v.strike) {
						let { x: t, width: n } = s(), i = (A === "top" ? S + 2 + Math.round(c * .5) : A === "center" ? S + F / 2 : S + F - 2 - Math.round(c * .35)) + r, a = i + N(i, .5, b);
						e.save(), e.strokeStyle = T ? R(T) : "#000000", e.lineWidth = .5, e.beginPath(), e.moveTo(t, a), e.lineTo(t + n, a), e.stroke(), e.restore();
					}
					if (J.includes("\n")) {
						let t = J.split("\n"), n = Jn(z.size, y, 1.2, z.name ?? void 0), i = t.length * n, a;
						A === "top" ? (a = S + 2, e.textBaseline = "top") : A === "center" ? (a = S + (F - i) / 2, e.textBaseline = "top") : (a = S + F - i - 2, e.textBaseline = "top");
						for (let i = 0; i < t.length; i++) e.fillText(t[i], q, a + i * n + r);
					} else {
						let t;
						A === "top" ? (e.textBaseline = "top", t = S + 2) : A === "center" ? (e.textBaseline = "middle", t = S + F / 2) : (e.textBaseline = "bottom", t = S + F - 2), e.fillText(de, q, t + r);
					}
				}
				let be = L.value.type === "text" ? L.value.phoneticRuns : void 0;
				if (L.showPhonetic && be && be.length > 0 && !J.includes("\n")) {
					let t = Yn(v, y), n = Zn(e, J, t), r;
					r = k === "right" ? I + P - 3 - n : k === "center" ? I + P / 2 - n / 2 : I + V;
					let i = T ? R(T) : "#000000";
					Xn(e, be, L.value.type === "text" ? L.value.phoneticPr : void 0, J, t, m, r, S, y, i);
				}
				e.restore(), J && t.onTextRun && t.onTextRun({
					text: J,
					x: I,
					y: S,
					width: P,
					height: F,
					row: s,
					col: a
				});
			});
		}
	}
	for (let e of j) e();
	for (let e of A) e();
	for (let e of k) e();
	e.restore();
}
var Er = /* @__PURE__ */ new WeakMap();
function Dr(e) {
	let t = Er.get(e);
	if (t) return t;
	let n = /* @__PURE__ */ new Map();
	for (let t of e.rows) for (let e of t.cells) n.set(`${e.row}:${e.col}`, e);
	let r = /* @__PURE__ */ new Set();
	for (let t of e.mergeCells ?? []) for (let e = t.top; e <= t.bottom; e++) for (let n = t.left; n <= t.right; n++) e === t.top && n === t.left || r.add(`${e}:${n}`);
	let i = /* @__PURE__ */ new Set();
	if (e.autoFilter) {
		let t = e.autoFilter;
		for (let e = t.left; e <= t.right; e++) i.add(`${t.top}:${e}`);
	}
	let a = /* @__PURE__ */ new Map();
	for (let t of e.hyperlinks ?? []) t.url && a.set(`${t.row}:${t.col}`, t.url);
	let o = /* @__PURE__ */ new Set();
	for (let t of e.commentRefs ?? []) {
		let e = Gn(t);
		e && o.add(`${e.row}:${e.col}`);
	}
	let s = {
		cellMap: n,
		cfContext: an(e),
		mergeSkipSet: r,
		autoFilterCells: i,
		hyperlinkMap: a,
		commentCells: o,
		tableStyleMap: xr(e),
		sparklineMap: Cr(e)
	};
	return Er.set(e, s), s;
}
function Or(e, t, n, r, i = {}) {
	let a = i.dpr ?? 1, o = i.cellScale ?? 1, s = Z(t), c = e.canvas.width / a, l = e.canvas.height / a;
	e.clearRect(0, 0, c, l), e.fillStyle = "#ffffff", e.fillRect(0, 0, c, l);
	let u = (e) => Math.round(e * o), d = u(50), f = u(22), { row: p, col: m, rows: h, cols: g } = r, _ = (i.scrollOffsetX ?? 0) * o, v = (i.scrollOffsetY ?? 0) * o, y = i.freezeRows ?? 0, b = i.freezeCols ?? 0, x = [];
	for (let e = 1; e <= b; e++) x.push(u(Q(t.colWidths[e] ?? t.defaultColWidth, s)));
	let S = [];
	for (let e = 1; e <= y; e++) S.push(u($(t.rowHeights[e] ?? t.defaultRowHeight)));
	let C = x.reduce((e, t) => e + t, 0), w = S.reduce((e, t) => e + t, 0), T = [];
	for (let e = m; e < m + g; e++) T.push(u(Q(t.colWidths[e] ?? t.defaultColWidth, s)));
	let E = [];
	for (let e = p; e < p + h; e++) E.push(u($(t.rowHeights[e] ?? t.defaultRowHeight)));
	let { cellMap: D, cfContext: O, mergeSkipSet: k, autoFilterCells: A, hyperlinkMap: j, commentCells: M, tableStyleMap: P, sparklineMap: F } = Dr(t), ee = /* @__PURE__ */ new Map();
	for (let e of t.mergeCells ?? []) {
		let n = 0;
		for (let r = e.left; r <= e.right; r++) n += u(Q(t.colWidths[r] ?? t.defaultColWidth, s));
		let r = 0;
		for (let n = e.top; n <= e.bottom; n++) r += u($(t.rowHeights[n] ?? t.defaultRowHeight));
		ee.set(`${e.top}:${e.left}`, {
			totalW: n,
			totalH: r,
			right: e.right,
			bottom: e.bottom
		});
	}
	let I = {
		worksheet: t,
		styles: n,
		cellMap: D,
		mergeAnchorMap: ee,
		mergeSkipSet: k,
		cfContext: O,
		colWidths: T,
		rowHeights: E,
		frozenColWidths: x,
		frozenRowHeights: S,
		frozenW: C,
		frozenH: w,
		startRow: p,
		startCol: m,
		cs: o,
		dpr: a,
		autoFilterCells: A,
		hyperlinkMap: j,
		commentCells: M,
		tableStyleMap: P,
		sparklineMap: F,
		mdw: s,
		onTextRun: i.onTextRun,
		rtl: t.rightToLeft === !0,
		canvasW: c
	}, L = d, R = f, z = L + C, B = R + w, V = Math.max(0, c - z), H = Math.max(0, l - B);
	y > 0 && b > 0 && Tr(e, I, 1, 1, x, S, 0, 0, L, R, L, R, C, w), y > 0 && Tr(e, I, 1, m, T, S, _, 0, z, R, z, R, V, w), b > 0 && Tr(e, I, p, 1, x, E, 0, v, L, B, L, B, C, H), Tr(e, I, p, m, T, E, _, v, z, B, z, B, V, H), t.images && t.images.length > 0 && i.loadedImages && Mr(e, t, i.loadedImages, o, p, m, _, v, z, B, V, H, t.rightToLeft === !0, c), t.shapeGroups && t.shapeGroups.length > 0 && Nr(e, t, o, p, m, _, v, z, B, V, H, i.loadedImages, t.rightToLeft === !0, c), t.charts && t.charts.length > 0 && Qr(e, t, o, p, m, _, v, z, B, V, H, t.rightToLeft === !0, c), t.slicers && t.slicers.length > 0 && di(e, t, o, p, m, _, v, z, B, V, H, t.rightToLeft === !0, c), kr(e, c, l, p, m, h, g, T, E, _, v, x, S, C, w, d, f, o, a, i.selectedRowRange ?? null, i.selectedColRange ?? null, t.rightToLeft === !0);
	let U = t.rightToLeft === !0;
	if (y > 0) {
		e.save(), e.strokeStyle = Mn, e.lineWidth = .5, e.beginPath();
		let t = B + N(B, .5, a);
		U ? (e.moveTo(0, t), e.lineTo(c - d, t)) : (e.moveTo(d, t), e.lineTo(c, t)), e.stroke(), e.restore();
	}
	if (b > 0) {
		e.save(), e.strokeStyle = Mn, e.lineWidth = .5, e.beginPath();
		let t = U ? c - z : z, n = t + N(t, .5, a);
		e.moveTo(n, f), e.lineTo(n, l), e.stroke(), e.restore();
	}
}
function kr(e, t, n, r, i, a, o, s, c, l, u, d, f, p, m, h, g, _, v, y, b, x) {
	let S = "#f8f9fa", C = "#e8eaed", w = "#caddf6", T = "#c8ccd0", E = "#5b9bd5", D = "#444", O = (e) => !b || e < b.start || e > b.end ? S : b.strong ? w : C, k = (e) => !b || e < b.start || e > b.end ? T : b.strong ? E : T, A = (e) => !y || e < y.start || e > y.end ? S : y.strong ? w : C, j = (e) => !y || e < y.start || e > y.end ? T : y.strong ? E : T, M = `${Math.max(1, Math.round(11 * _))}px ${Cn}`, P = h + p, F = g + m, ee = .5 / v, I = (e, n) => x ? An(e, n, t) : e, L = x ? t - h : 0;
	e.fillStyle = S, e.fillRect(L, 0, h, g), e.strokeStyle = T, e.lineWidth = .5, e.beginPath();
	let R = L + N(L, .5, v), z = N(0, .5, v);
	e.moveTo(R, 0), e.lineTo(R, g), e.moveTo(L, z), e.lineTo(L + h, z), e.moveTo(L + h - ee, 0), e.lineTo(L + h - ee, g), e.moveTo(L, g - ee), e.lineTo(L + h, g - ee), e.stroke(), e.font = M, e.fillStyle = D;
	let B = (t, n, r) => {
		let i = I(n, r);
		e.fillStyle = O(t), e.fillRect(i, 0, r, g), e.strokeStyle = k(t), e.lineWidth = .5, e.beginPath();
		let a = i + N(i, .5, v), o = N(0, .5, v);
		e.moveTo(a, 0), e.lineTo(a, g), e.moveTo(i, g - ee), e.lineTo(i + r, g - ee), e.moveTo(i, o), e.lineTo(i + r, o), e.stroke(), e.fillStyle = D, e.textAlign = "center", e.textBaseline = "middle", e.fillText(hr(t), i + r / 2, g / 2);
	}, V = (t, n, r) => {
		let i = L;
		e.fillStyle = A(t), e.fillRect(i, n, h, r), e.strokeStyle = j(t), e.lineWidth = .5, e.beginPath();
		let a = n + N(n, .5, v), o = i + N(i, .5, v);
		e.moveTo(i + h - ee, n), e.lineTo(i + h - ee, n + r), e.moveTo(i, a), e.lineTo(i + h, a), e.moveTo(o, n), e.lineTo(o, n + r), e.stroke(), e.fillStyle = D, e.textBaseline = "middle";
		let s = Math.max(2, Math.round(4 * _));
		x ? (e.textAlign = "left", e.fillText(String(t), i + s, n + r / 2)) : (e.textAlign = "right", e.fillText(String(t), i + h - s, n + r / 2));
	};
	if (d.length > 0) {
		e.save(), e.beginPath(), e.rect(I(h, p), 0, p, g), e.clip();
		let t = h;
		for (let e = 0; e < d.length; e++) B(e + 1, t, d[e]), t += d[e];
		e.restore();
	}
	e.save(), e.beginPath(), e.rect(I(P, t - P), 0, t - P, g), e.clip();
	let H = P - l;
	for (let e = 0; e < s.length; e++) {
		let n = s[e];
		H + n > P && H < t && B(i + e, H, n), H += n;
	}
	if (e.restore(), f.length > 0) {
		e.save(), e.beginPath(), e.rect(L, g, h, m), e.clip();
		let t = g;
		for (let e = 0; e < f.length; e++) V(e + 1, t, f[e]), t += f[e];
		e.restore();
	}
	e.save(), e.beginPath(), e.rect(L, F, h, n - F), e.clip();
	let U = F - u;
	for (let e = 0; e < c.length; e++) {
		let t = c[e];
		U + t > F && U < n && V(r + e, U, t), U += t;
	}
	e.restore();
}
function Ar(e, t, n) {
	let r = Z(e), i = 0;
	for (let a = 1; a < t; a++) i += Math.round(Q(e.colWidths[a] ?? e.defaultColWidth, r) * n);
	return i;
}
function jr(e, t, n) {
	let r = 0;
	for (let i = 1; i < t; i++) r += Math.round($(e.rowHeights[i] ?? e.defaultRowHeight) * n);
	return r;
}
function Mr(n, r, i, a, o, s, c, l, u, d, f, p, m, h) {
	if (f <= 0 || p <= 0) return;
	let g = Ar(r, s, a), _ = jr(r, o, a);
	n.save(), n.beginPath();
	let v = jn(u, f, h, m);
	n.rect(v, d, f, p), n.clip();
	for (let o of r.images) {
		let s = i.get(bn(o.imagePath, o.duotone));
		if (!s) continue;
		let y = o.fromCol + 1, b = o.fromRow + 1, x = Ar(r, y, a) + o.fromColOff * a / t, S = jr(r, b, a) + o.fromRowOff * a / t, C, w;
		if (o.editAs === "oneCell" && o.nativeExtCx > 0 && o.nativeExtCy > 0) C = o.nativeExtCx * a / t, w = o.nativeExtCy * a / t;
		else {
			let e = o.toCol + 1, n = o.toRow + 1, i = Ar(r, e, a) + o.toColOff * a / t, s = jr(r, n, a) + o.toRowOff * a / t;
			C = i - x, w = s - S;
		}
		if (C <= 0 || w <= 0) continue;
		let T = jn(u + (x - g) - c, C, h, m), E = d + (S - _) - l;
		T + C < v || T > v + f || E + w < d || E > d + p || (o.alpha != null && o.alpha < 1 ? (n.save(), n.globalAlpha = o.alpha, e(n, s, o.srcRect, T, E, C, w), n.restore()) : e(n, s, o.srcRect, T, E, C, w));
	}
	n.restore();
}
function Nr(e, n, r, i, a, o, s, c, l, u, d, f, p, m) {
	if (u <= 0 || d <= 0) return;
	let h = n.shapeGroups;
	if (!h || h.length === 0) return;
	let g = Ar(n, a, r), _ = jr(n, i, r);
	e.save(), e.beginPath();
	let v = jn(c, u, m, p);
	e.rect(v, l, u, d), e.clip();
	for (let i of h) {
		let a = i.fromCol + 1, h = i.fromRow + 1, y = Ar(n, a, r) + i.fromColOff * r / t, b = jr(n, h, r) + i.fromRowOff * r / t, x, S;
		if (i.editAs === "oneCell" && i.nativeExtCx > 0 && i.nativeExtCy > 0) x = i.nativeExtCx * r / t, S = i.nativeExtCy * r / t;
		else {
			let e = i.toCol + 1, a = i.toRow + 1, o = Ar(n, e, r) + i.toColOff * r / t, s = jr(n, a, r) + i.toRowOff * r / t;
			x = o - y, S = s - b;
		}
		if (x <= 0 || S <= 0) continue;
		let C = jn(c + (y - g) - o, x, m, p), w = l + (b - _) - s;
		if (!(C + x < v || C > v + u) && !(w + S < l || w > l + d)) for (let t of i.shapes) {
			let n = C + t.x * x, i = w + t.y * S, a = t.w * x, o = t.h * S;
			a <= 0 || o <= 0 || Pr(e, t, n, i, a, o, r, f);
		}
	}
	e.restore();
}
function Pr(n, r, i, a, o, s, c, l) {
	if (n.save(), r.rot !== 0 || r.flipH || r.flipV ? (n.translate(i + o / 2, a + s / 2), n.rotate(r.rot * Math.PI / 180), n.scale(r.flipH ? -1 : 1, r.flipV ? -1 : 1), n.translate(-o / 2, -s / 2)) : n.translate(i, a), r.geom.type === "custom") for (let e of r.geom.paths) {
		if (e.w <= 0 || e.h <= 0) continue;
		let t = o / e.w, i = s / e.h;
		n.beginPath();
		let a = 0, c = 0, l = 0, u = 0;
		for (let r of e.commands) switch (r.op) {
			case "moveTo": {
				let e = r.x * t, o = r.y * i;
				n.moveTo(e, o), a = l = e, c = u = o;
				break;
			}
			case "lineTo": {
				let e = r.x * t, o = r.y * i;
				n.lineTo(e, o), a = e, c = o;
				break;
			}
			case "cubicBezTo": {
				let e = r.x3 * t, o = r.y3 * i;
				n.bezierCurveTo(r.x1 * t, r.y1 * i, r.x2 * t, r.y2 * i, e, o), a = e, c = o;
				break;
			}
			case "quadBezTo": {
				let e = r.x2 * t, o = r.y2 * i;
				n.quadraticCurveTo(r.x1 * t, r.y1 * i, e, o), a = e, c = o;
				break;
			}
			case "arcTo": {
				let e = r.wr * t, o = r.hr * i;
				if (e <= 0 || o <= 0) break;
				let s = r.stAng / 6e4 * (Math.PI / 180), l = r.swAng / 6e4 * (Math.PI / 180), u = a - Math.cos(s) * e, d = c - Math.sin(s) * o, f = s + l;
				n.ellipse(u, d, e, o, 0, s, f, l < 0), a = u + Math.cos(f) * e, c = d + Math.sin(f) * o;
				break;
			}
			case "close":
				n.closePath(), a = l, c = u;
				break;
		}
		Wr(n, r);
	}
	else if (r.geom.type === "preset") {
		let e = r.fillColor ?? null, i = r.strokeColor && r.strokeWidth > 0 ? () => {
			n.strokeStyle = r.strokeColor, n.lineWidth = Math.max(.5, r.strokeWidth / t), n.stroke();
		} : null;
		K(n, r.geom.name, 0, 0, o, s, r.geom.adj ?? [], e, i, () => {}) || (n.beginPath(), n.rect(0, 0, o, s), Wr(n, r));
	} else if (r.geom.type === "image") {
		let t = l?.get(bn(r.geom.imagePath, r.geom.duotone));
		if (t) {
			let i = r.geom.alpha;
			i != null && i < 1 ? (n.save(), n.globalAlpha = i, e(n, t, r.geom.srcRect, 0, 0, o, s), n.restore()) : e(n, t, r.geom.srcRect, 0, 0, o, s);
		}
	}
	r.text && Ur(n, r.text, o, s, c), n.restore();
}
var Fr = /* @__PURE__ */ new WeakMap();
function Ir(e, t) {
	let n = e.tinted.get(t);
	if (n) return n;
	let r = e.img.naturalWidth || 1, i = e.img.naturalHeight || 1, a = document.createElement("canvas");
	a.width = r, a.height = i;
	let o = a.getContext("2d");
	return o ? (o.drawImage(e.img, 0, 0, r, i), o.globalCompositeOperation = "source-in", o.fillStyle = t, o.fillRect(0, 0, r, i), e.tinted.set(t, a), a) : e.img;
}
function Lr(e) {
	let t = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(e)}`, n = new Image();
	return new Promise((e, r) => {
		n.onload = () => e(n), n.onerror = r, n.src = t;
	});
}
var Rr = 256;
function zr(e, t, n) {
	let r = Math.max(1, Math.round(t * Rr)), i = Math.max(1, Math.round(n * Rr));
	return e.replace(/<svg([^>]*?)>/, (e, t) => `<svg${t.replace(/\s(?:width|height)="[^"]*"/g, "")} width="${r}" height="${i}">`);
}
function Br(e) {
	let t = [];
	for (let n of e.shapeGroups ?? []) for (let e of n.shapes) for (let n of e.text?.paragraphs ?? []) for (let e of n.runs) e.type === "math" && t.push({
		nodes: e.nodes,
		display: e.display
	});
	return t;
}
function Vr(e) {
	for (let t of e.shapeGroups ?? []) for (let e of t.shapes) for (let t of e.text?.paragraphs ?? []) for (let e of t.runs) if (e.type === "math" && !Fr.has(e.nodes)) return !0;
	return !1;
}
async function Hr(e, t) {
	let n = Br(e).filter((e) => !Fr.has(e.nodes));
	if (n.length !== 0) {
		await t.loadMathJax();
		for (let e of n) if (!Fr.has(e.nodes)) try {
			let n = await t.mathMLToSvg(de(e.nodes, e.display)), r = await Lr(zr(Ee(n.svg, "#000000"), n.widthEm, n.ascentEm + n.descentEm));
			Fr.set(e.nodes, {
				img: r,
				widthEm: n.widthEm,
				ascentEm: n.ascentEm,
				descentEm: n.descentEm,
				tinted: /* @__PURE__ */ new Map()
			});
		} catch {}
	}
}
function Ur(e, n, r, i, a) {
	if (r <= 0 || i <= 0 || n.paragraphs.length === 0) return;
	let o = n.lIns / t * a, s = n.rIns / t * a, c = n.tIns / t * a, l = n.bIns / t * a, u = Math.max(0, r - o - s), d = Math.max(0, i - c - l);
	if (u <= 0 || d <= 0) return;
	let f = (e) => {
		let t = (e.size > 0 ? e.size : On) * G * a, n = Dn(e.fontFace);
		return {
			font: `${e.italic ? "italic " : ""}${e.bold ? "bold " : ""}${t}px ${n}`,
			px: t
		};
	}, p = (t, n) => {
		let r = e.font;
		e.font = t;
		let i = e.measureText("M").actualBoundingBoxAscent;
		return e.font = r, i > 0 ? i : n * .85;
	}, m = n.wrap !== "none", h = [];
	for (let r of n.paragraphs) {
		let i = r.align || "l", o = (r.marL ?? 0) / t * a, s = (r.marR ?? 0) / t * a, c = (r.indent ?? 0) / t * a, l = Math.max(0, c), d = Math.max(0, u - o - s), g = !1, _ = () => g ? o : o + l, v = () => g ? d : d - l, y = [], b = 0, x = 0, S = 0, C = !1, w = (e) => {
			let t = e;
			return r.spaceLine && (r.spaceLine.type === "pct" ? t *= r.spaceLine.val / 1e5 : t = r.spaceLine.val * G * a), n.autoFit === "norm" && n.lnSpcReduction != null && r.spaceLine?.type !== "pts" && (t *= 1 - n.lnSpcReduction), t;
		}, T = () => {
			if (x === 0) {
				let e = (E || On) * G * a, t = Math.max(le(D, e), le(O, e));
				x = Math.max(e * 1.2, t), S = p(`${e}px ${Dn(D)}`, e);
			}
			x = w(x), h.push({
				segs: y,
				align: i,
				height: x,
				ascent: S,
				hasMath: C,
				leftInset: _(),
				availW: v()
			}), g = !0, y = [], b = 0, x = 0, S = 0, C = !1;
		}, E = 0, D, O;
		for (let t of r.runs) {
			if (t.type === "break") {
				T();
				continue;
			}
			if (t.type === "math") {
				let e = Fr.get(t.nodes);
				if (!e) continue;
				let n = (t.fontSize ?? (E || On)) * G * a, r = e.widthEm * n, s = e.ascentEm * n, c = e.descentEm * n, l = t.color ?? "#000000";
				if (t.display) {
					T(), h.push({
						segs: [{
							kind: "math",
							render: e,
							color: l,
							w: r,
							ascent: s,
							descent: c
						}],
						align: i,
						height: w(s + c),
						ascent: s,
						hasMath: !0,
						leftInset: o,
						availW: d
					}), g = !0;
					continue;
				}
				m && b + r > v() && y.length > 0 && T(), y.push({
					kind: "math",
					render: e,
					color: l,
					w: r,
					ascent: s,
					descent: c
				}), b += r, x = Math.max(x, s + c), S = Math.max(S, s), C = !0;
				continue;
			}
			E = t.size > 0 ? t.size : On, D = t.fontFace, O = t.fontFaceEa;
			let { font: n, px: r } = f(t), s = t.color ?? "#000000", c = Math.max(le(t.fontFace, r), le(t.fontFaceEa, r)), l = Math.max(r * 1.2, c);
			x = Math.max(x, l), S = Math.max(S, p(n, r)), e.font = n;
			let u = t.text.split("\n");
			for (let t = 0; t < u.length; t++) {
				t > 0 && T();
				let i = u[t];
				if (!i) continue;
				if (!m) {
					let t = e.measureText(i).width;
					y.push({
						kind: "text",
						text: i,
						font: n,
						color: s,
						w: t
					}), b += t;
					continue;
				}
				let a = "";
				for (let t of i) {
					let i = a + t, o = e.measureText(i).width;
					if (b + o > v() && (a.length > 0 || y.length > 0)) {
						if (a) {
							let t = e.measureText(a).width;
							y.push({
								kind: "text",
								text: a,
								font: n,
								color: s,
								w: t
							}), b += t;
						}
						T(), a = t, e.font = n, x = Math.max(x, l), S = Math.max(S, p(n, r));
					} else a = i;
				}
				if (a) {
					let t = e.measureText(a).width;
					y.push({
						kind: "text",
						text: a,
						font: n,
						color: s,
						w: t
					}), b += t;
				}
			}
		}
		T();
	}
	let g = h.reduce((e, t) => e + t.height, 0), _ = c;
	n.anchor === "ctr" ? _ = c + (d - g) / 2 : n.anchor === "b" && (_ = c + Math.max(0, d - g));
	let v = _;
	for (let t of h) {
		let n = t.segs.reduce((e, t) => e + t.w, 0), r = o + t.leftInset, i = r;
		if (t.align === "ctr" ? i = r + Math.max(0, (t.availW - n) / 2) : t.align === "r" && (i = r + Math.max(0, t.availW - n)), t.hasMath) {
			e.textBaseline = "alphabetic";
			let n = v + t.ascent;
			for (let r of t.segs) {
				if (r.kind === "text") e.font = r.font, e.fillStyle = r.color, e.fillText(r.text, i, n);
				else {
					let t = Ir(r.render, r.color);
					e.drawImage(t, i, n - r.ascent, r.w, r.ascent + r.descent);
				}
				i += r.w;
			}
		} else {
			e.textBaseline = "middle";
			let n = v + t.height / 2;
			for (let r of t.segs) r.kind === "text" && (e.font = r.font, e.fillStyle = r.color, e.fillText(r.text, i, n)), i += r.w;
		}
		v += t.height;
	}
}
function Wr(e, n) {
	n.fillColor && (e.fillStyle = n.fillColor, e.fill()), n.strokeColor && n.strokeWidth > 0 && (e.strokeStyle = n.strokeColor, e.lineWidth = Math.max(.5, n.strokeWidth / t), e.stroke());
}
function Gr(e, t, n, r, i, a, o) {
	if (r === n && i === t) return e;
	let s = (e, r) => {
		if (e === t && r === n) return null;
		let i = a.get(`${e}:${r}`);
		return i ? er(o, i.styleIndex ?? 0).border : null;
	}, c = s(t, r), l = s(i, n), u = s(i, r), d = (e, ...t) => {
		if (e?.style) return e;
		for (let e of t) if (e?.style) return e;
		return e ?? null;
	};
	return {
		left: e.left,
		top: e.top,
		right: d(c?.right, u?.right, e.right),
		bottom: d(l?.bottom, u?.bottom, e.bottom),
		diagonalUp: e.diagonalUp ?? null,
		diagonalDown: e.diagonalDown ?? null
	};
}
function Kr(e, t) {
	if (!t) return e;
	let n = (e, t) => t && t.style ? t : e ?? null;
	return {
		left: n(e.left, t.left),
		right: n(e.right, t.right),
		top: n(e.top, t.top),
		bottom: n(e.bottom, t.bottom),
		diagonalUp: n(e.diagonalUp, t.diagonalUp),
		diagonalDown: n(e.diagonalDown, t.diagonalDown)
	};
}
function qr(e, t, n, r, i, a, o = 1) {
	let s = [
		{
			edge: t.top,
			x1: n,
			y1: r,
			x2: n + i,
			y2: r,
			kind: "h"
		},
		{
			edge: t.bottom,
			x1: n,
			y1: r + a,
			x2: n + i,
			y2: r + a,
			kind: "h"
		},
		{
			edge: t.left,
			x1: n,
			y1: r,
			x2: n,
			y2: r + a,
			kind: "v"
		},
		{
			edge: t.right,
			x1: n + i,
			y1: r,
			x2: n + i,
			y2: r + a,
			kind: "v"
		},
		{
			edge: t.diagonalUp,
			x1: n,
			y1: r + a,
			x2: n + i,
			y2: r,
			kind: "d"
		},
		{
			edge: t.diagonalDown,
			x1: n,
			y1: r,
			x2: n + i,
			y2: r + a,
			kind: "d"
		}
	];
	for (let { edge: t, x1: c, y1: l, x2: u, y2: d, kind: f } of s) {
		if (!t || !t.style || t.style === "none") continue;
		let s = t.color ? R(t.color) : "#000000";
		if (t.style === "double" && f === "d") {
			e.strokeStyle = s, e.lineWidth = 1, e.setLineDash([]);
			let t = u - c, n = d - l, r = Math.hypot(t, n), i = -n / r * 1, a = t / r * 1;
			e.beginPath(), e.moveTo(c + i, l + a), e.lineTo(u + i, d + a), e.moveTo(c - i, l - a), e.lineTo(u - i, d - a), e.stroke();
			continue;
		}
		if (t.style === "double" && f !== "d") {
			if (e.strokeStyle = s, e.lineWidth = 1, e.setLineDash([]), e.beginPath(), f === "h") {
				let t = l === r, o = t ? r - 1 : r + a + 1, s = t ? r + 1 : r + a - 1;
				e.moveTo(n - 1, o), e.lineTo(n + i + 1, o), e.moveTo(n + 1, s), e.lineTo(n + i - 1, s);
			} else {
				let t = c === n, o = t ? n - 1 : n + i + 1, s = t ? n + 1 : n + i - 1;
				e.moveTo(o, r - 1), e.lineTo(o, r + a + 1), e.moveTo(s, r + 1), e.lineTo(s, r + a - 1);
			}
			e.stroke();
			continue;
		}
		e.beginPath(), e.strokeStyle = s;
		let p = Jr(t.style);
		e.lineWidth = p;
		let m = Yr(t.style);
		e.setLineDash(m);
		let h = f === "v" ? N(c, p, o) : 0, g = f === "h" ? N(l, p, o) : 0;
		e.moveTo(c + h, l + g), e.lineTo(u + h, d + g), e.stroke(), e.setLineDash([]);
	}
}
function Jr(e) {
	switch (e) {
		case "thick": return 3;
		case "medium":
		case "mediumDashed":
		case "mediumDashDot":
		case "mediumDashDotDot":
		case "slantDashDot": return 2;
		case "hair": return .5;
		default: return 1;
	}
}
function Yr(e) {
	return ge(e);
}
function Xr(e) {
	switch (e) {
		case "double": return 13;
		case "thick": return 12;
		case "medium": return 11;
		case "mediumDashed": return 10;
		case "mediumDashDot": return 9;
		case "slantDashDot": return 8;
		case "mediumDashDotDot": return 7;
		case "thin": return 6;
		case "dashed": return 5;
		case "dashDot": return 4;
		case "dashDotDot": return 3;
		case "dotted": return 2;
		case "hair": return 1;
		default: return 0;
	}
}
function Zr(e, t) {
	let n = Xr(e?.style), r = Xr(t?.style);
	return n === 0 && r === 0 ? null : n >= r ? e ?? null : t ?? null;
}
function Qr(e, n, r, i, a, o, s, c, l, u, d, f, p) {
	if (u <= 0 || d <= 0) return;
	let m = Ar(n, a, r), h = jr(n, i, r), g = jn(c, u, p, f);
	for (let i of n.charts) {
		let a = i.fromCol + 1, _ = i.fromRow + 1, v = i.toCol + 1, y = i.toRow + 1, b = Ar(n, a, r) + i.fromColOff * r / t, x = jr(n, _, r) + i.fromRowOff * r / t, S = Ar(n, v, r) + i.toColOff * r / t, C = jr(n, y, r) + i.toRowOff * r / t, w = S - b, T = C - x;
		if (w <= 0 || T <= 0) continue;
		let E = jn(c + (b - m) - o, w, p, f), D = l + (x - h) - s;
		if (E + w < g || E > g + u || D + T < l || D > l + d) continue;
		e.save(), e.beginPath(), e.rect(g, l, u, d), e.clip();
		let O = G * r;
		I(e, i.chart, {
			x: E,
			y: D,
			w,
			h: T
		}, O), e.restore();
	}
}
var $r = "600 12px \"Meiryo UI\", \"Segoe UI\", sans-serif", ei = "11px \"Meiryo UI\", \"Segoe UI\", sans-serif", ti = "#FFFFFF", ni = "#BFBFBF", ri = "#F2F2F2", ii = "#404040", ai = "#FFFFFF", oi = "#000000", si = "#A5A5A5", ci = "#E7E6E6", li = "#A6A6A6", ui = "#C6C6C6";
function di(e, n, r, i, a, o, s, c, l, u, d, f, p) {
	if (u <= 0 || d <= 0) return;
	let m = n.slicers;
	if (!m) return;
	let h = Ar(n, a, r), g = jr(n, i, r), _ = jn(c, u, p, f);
	for (let i of m) {
		let a = i.fromCol + 1, m = i.fromRow + 1, v = i.toCol + 1, y = i.toRow + 1, b = Ar(n, a, r) + i.fromColOff * r / t, x = jr(n, m, r) + i.fromRowOff * r / t, S = Ar(n, v, r) + i.toColOff * r / t, C = jr(n, y, r) + i.toRowOff * r / t, w = S - b, T = C - x;
		if (w <= 0 || T <= 0) continue;
		let E = jn(c + (b - h) - o, w, p, f), D = l + (x - g) - s;
		E + w < _ || E > _ + u || D + T < l || D > l + d || (e.save(), e.beginPath(), e.rect(_, l, u, d), e.clip(), fi(e, i.caption, i.items, E, D, w, T, r), e.restore());
	}
}
function fi(e, t, n, r, i, a, o, s) {
	e.fillStyle = ti, e.fillRect(r, i, a, o), e.strokeStyle = ni, e.lineWidth = 1, e.strokeRect(r + .5, i + .5, a - 1, o - 1);
	let c = Math.max(20 * s, 14);
	e.fillStyle = ri, e.fillRect(r + 1, i + 1, a - 2, c), e.fillStyle = ii, e.font = pi($r, s), e.textBaseline = "middle", e.textAlign = "left";
	let l = 6 * s;
	if (mi(e, t, r + l, i + c / 2 + 1, a - 2 * l), n.length === 0) return;
	let u = Math.max(1, Math.round(2 * s)), d = 4 * s, f = r + d, p = i + c + d, m = a - 2 * d, h = o - c - 2 * d;
	if (m <= 0 || h <= 0) return;
	let g = Math.max(18 * s, 16), _ = Math.max(1, Math.floor((h + u) / (g + u))), v = Math.min(n.length, _), y = Math.min(g, (h - u * (v - 1)) / v);
	if (y <= 0) return;
	e.font = pi(ei, s);
	let b = 8 * s;
	for (let t = 0; t < v; t++) {
		let r = n[t], i = p + t * (y + u), a = r.selected;
		e.fillStyle = a ? ai : ci, e.fillRect(f, i, m, y), e.strokeStyle = a ? si : ui, e.lineWidth = 1, e.strokeRect(f + .5, i + .5, m - 1, y - 1), e.fillStyle = a ? oi : li, mi(e, r.name, f + b, i + y / 2 + 1, m - 2 * b);
	}
}
function pi(e, t) {
	return e.replace(/(\d+(?:\.\d+)?)px/, (e, n) => `${Math.round(Number(n) * t)}px`);
}
function mi(e, t, n, r, i) {
	if (i <= 0) return;
	let a = t;
	if (e.measureText(a).width > i) {
		for (; a.length > 0 && e.measureText(a + "…").width > i;) a = a.slice(0, -1);
		a = a.length > 0 ? a + "…" : "";
	}
	e.fillText(a, n, r);
}
//#endregion
//#region packages/xlsx/src/render-orchestrator.ts
async function hi(e, t, n, r, i = 0, a = 0, o = null, s = null, c) {
	let l = t === "image/svg+xml", u = me(t, o, i, a), d = () => xe(e, t, s, r, {
		widthPt: u.widthPt,
		heightPt: u.heightPt,
		offscreenFactory: c
	}), f = {
		svgImagePath: n,
		srcRect: o
	};
	if (m(f)) try {
		return await ae(f.svgImagePath, r);
	} catch {
		return l ? ae(e, r) : d();
	}
	return l ? ae(e, r) : d();
}
async function gi(e, t, n, r) {
	if (!n) return;
	let i = n, a = /* @__PURE__ */ new Map();
	if (e.images) for (let t of e.images) a.set(bn(t.imagePath, t.duotone), {
		imagePath: t.imagePath,
		mimeType: t.mimeType,
		svgImagePath: t.svgImagePath,
		widthPt: t.nativeExtCx > 0 ? t.nativeExtCx / re : 0,
		heightPt: t.nativeExtCy > 0 ? t.nativeExtCy / re : 0,
		srcRect: t.srcRect ?? null,
		duotone: t.duotone ?? null
	});
	if (e.shapeGroups) for (let t of e.shapeGroups) for (let e of t.shapes) e.geom.type === "image" && a.set(bn(e.geom.imagePath, e.geom.duotone), {
		imagePath: e.geom.imagePath,
		mimeType: e.geom.mimeType,
		svgImagePath: e.geom.svgImagePath,
		widthPt: t.nativeExtCx > 0 ? t.nativeExtCx * e.w / re : 0,
		heightPt: t.nativeExtCy > 0 ? t.nativeExtCy * e.h / re : 0,
		srcRect: e.geom.srcRect ?? null,
		duotone: e.geom.duotone ?? null
	});
	a.size !== 0 && await Promise.all([...a.entries()].map(async ([e, n]) => {
		try {
			let a = await hi(n.imagePath, n.mimeType, n.svgImagePath, i, n.widthPt, n.heightPt, n.srcRect, n.duotone, r?.offscreenFactory);
			t.set(e, a);
		} catch {
			t.delete(e);
		}
	}));
}
async function _i(e, t, n, r = {}) {
	let i = r.fetchImage ? ce(r.fetchImage) : void 0;
	try {
		await vi(e, t, n, r);
	} finally {
		i?.();
	}
}
async function vi(e, t, n, r = {}) {
	let { ws: i, styles: a, imageCache: o } = e;
	await gi(i, o, r.fetchImage), e.math && Vr(i) && await Hr(i, e.math);
	let s = r.dpr ?? l(), c = g(t) ? t.clientWidth || 800 : t.width, u = g(t) ? t.clientHeight || 600 : t.height, d = r.width ?? c, f = r.height ?? u, p = A(d * s, f * s), m = p.clamped ? s * p.scale : s, h = p.width, _ = p.height;
	if (t.width !== h && (t.width = h), t.height !== _ && (t.height = _), g(t)) {
		let e = `${d}px`, n = `${f}px`;
		t.style.width !== e && (t.style.width = e), t.style.height !== n && (t.style.height = n);
	}
	let v = t.getContext("2d");
	if (v.setTransform(m, 0, 0, m, 0, 0), i.parseError) {
		yi(v, d, f, i.name, i.parseError);
		return;
	}
	Or(v, i, a, n, {
		...r,
		dpr: m,
		loadedImages: o
	});
}
function yi(e, t, n, r, i) {
	e.save(), e.fillStyle = "#f7f7f8", e.fillRect(0, 0, t, n);
	let a = t / 2, o = Math.min(t, n), s = Math.max(20, o * .1);
	e.fillStyle = "#b23b3b", e.textAlign = "center", e.textBaseline = "middle", e.font = `${s}px sans-serif`, e.fillText("⚠", a, n * .32);
	let c = Math.max(13, o * .035);
	e.fillStyle = "#333333", e.font = `600 ${c}px sans-serif`, e.fillText(`Sheet "${r}" could not be displayed`, a, n * .46);
	let l = Math.max(10, o * .022);
	e.fillStyle = "#666666", e.font = `${l}px sans-serif`;
	let u = Math.min(t * .8, 640), d = i.split(/\s+/), f = [], p = "";
	for (let t of d) {
		let n = p ? `${p} ${t}` : t;
		if (e.measureText(n).width > u && p ? (f.push(p), p = t) : p = n, f.length >= 4) break;
	}
	p && f.length < 4 && f.push(p);
	let m = l * 1.4, h = n * .52 + m;
	for (let t of f.slice(0, 4)) e.fillText(t, a, h), h += m;
	e.restore();
}
//#endregion
//#region packages/xlsx/src/google-fonts.ts
var bi = {
	...r,
	...E
};
function* xi(e) {
	for (let t of e?.sharedStrings ?? []) if (t.runs && t.runs.length > 0) for (let e of t.runs) yield e.text;
	else yield t.text;
}
function Si(e) {
	let t = /* @__PURE__ */ new Set(), n = null;
	for (let r of e?.styles?.fonts ?? []) r.name && (t.add(r.name), n ??= p(r.name));
	for (let r of be(xi(e), n)) t.add(r);
	return t;
}
//#endregion
//#region packages/xlsx/src/shared-strings.ts
function Ci(e, t) {
	for (let n of e.rows) for (let e of n.cells) {
		let n = e.value;
		if (n.type === "shared") {
			let r = t[n.si];
			if (r) {
				let t = {
					type: "text",
					text: r.text
				};
				r.runs !== void 0 && (t.runs = r.runs), r.phoneticRuns !== void 0 && (t.phoneticRuns = r.phoneticRuns), r.phoneticPr !== void 0 && (t.phoneticPr = r.phoneticPr), e.value = t;
			} else e.value = {
				type: "text",
				text: ""
			};
		}
	}
	return e;
}
function wi(e) {
	let t = (e ?? "").trim();
	if (!t) return {
		kind: "unresolved",
		formula: ""
	};
	if (t.length >= 2 && t.startsWith("\"") && t.endsWith("\"")) return {
		kind: "inline",
		values: t.slice(1, -1).split(",").map((e) => e.trim()).filter((e) => e.length > 0)
	};
	let n, r = t, i = t.indexOf("!");
	if (i >= 0) {
		let e = t.slice(0, i);
		e.startsWith("'") && e.endsWith("'") && e.length >= 2 && (e = e.slice(1, -1).replace(/''/g, "'")), n = e, r = t.slice(i + 1);
	}
	let [a, o] = r.split(":"), s = _n(a ?? "");
	if (s) {
		let e = o ? _n(o) : s;
		if (e) {
			let t = {
				row: Math.min(s.row, e.row),
				col: Math.min(s.col, e.col)
			}, r = {
				row: Math.max(s.row, e.row),
				col: Math.max(s.col, e.col)
			};
			return {
				kind: "range",
				sheet: n,
				start: t,
				end: r
			};
		}
	}
	return {
		kind: "unresolved",
		formula: t
	};
}
function Ti(e, t) {
	if (e.kind === "inline") return {
		kind: "values",
		values: e.values
	};
	if (e.kind === "unresolved") return {
		kind: "formula",
		formula: e.formula
	};
	let n = [];
	for (let r = e.start.row; r <= e.end.row; r++) for (let i = e.start.col; i <= e.end.col; i++) {
		let e = t(r, i);
		e != null && e !== "" && n.push(e);
	}
	return {
		kind: "values",
		values: n
	};
}
function Ei(e) {
	let { cell: t, panel: n, viewport: r, rtl: i } = e, a = t.y + t.h + 2, o = t.y - 2 - n.h, s;
	s = a + n.h <= r.h ? a : o >= 0 ? o : a, s = Math.max(0, Math.min(s, r.h - n.h));
	let c = i ? t.x + t.w - n.w : t.x;
	return c = Math.max(0, Math.min(c, r.w - n.w)), {
		left: c,
		top: s
	};
}
//#endregion
//#region packages/xlsx/src/workbook.ts
var Di = class e {
	worker;
	bridge;
	parsedWorkbook = null;
	sheetCache = /* @__PURE__ */ new Map();
	imageCache = /* @__PURE__ */ new Map();
	imageBlobCache = /* @__PURE__ */ new Map();
	_fetchImage = (e, t) => this.getImage(e, t);
	rawData = null;
	maxZipEntryBytes;
	math;
	googleFontFaces = [];
	_mode = "main";
	constructor(e, t, n) {
		this.worker = e, this._mode = t, this.bridge = new u(this.worker, {
			correlate: (e) => e.id,
			toError: (e) => e.type === "error" ? e.message : void 0
		});
		let r = new URL(n ?? Fe, location.href).href;
		this.bridge.post({
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
		i = h(await fe(i, n.password));
		let a = new e(r === "worker" ? (await import("./render-worker-host-Cg60RAG_.js")).createRenderWorker() : new Pe(), r, n.wasmUrl);
		return await a._load(i, n), a;
	}
	async _load(e, t = {}) {
		this.rawData = e, this.maxZipEntryBytes = t.maxZipEntryBytes, this.math = t.math, t.math && this._mode === "worker" && console.warn("[ooxml] the math engine is unavailable in mode: 'worker'; equations will be skipped. Use mode: 'main' for workbooks with equations.");
		let n = await this.bridge.request((n) => this._mode === "worker" ? {
			type: "parse",
			id: n,
			data: e.slice(0),
			maxZipEntryBytes: this.maxZipEntryBytes,
			useGoogleFonts: !!t.useGoogleFonts
		} : {
			type: "parse",
			id: n,
			data: e.slice(0),
			maxZipEntryBytes: this.maxZipEntryBytes
		}, void 0, { timeoutMs: t.workerTimeoutMs });
		if (this._mode === "worker") this.parsedWorkbook = n.workbook;
		else {
			let { workbookJson: e } = n;
			this.parsedWorkbook = JSON.parse(new TextDecoder().decode(new Uint8Array(e)));
		}
		let r = this.parsedWorkbook?.workbook.parseError;
		r && console.warn(`[ooxml] xlsx opened with a degraded part: ${r}`), this._mode === "main" && t.useGoogleFonts && (this.googleFontFaces = await d(Si(this.parsedWorkbook), bi));
	}
	get sheetNames() {
		return this.parsedWorkbook?.workbook.sheets.map((e) => e.name) ?? [];
	}
	get sheetCount() {
		return this.parsedWorkbook?.workbook.sheets.length ?? 0;
	}
	get tabColors() {
		return this.parsedWorkbook?.workbook.sheets.map((e) => e.tabColor ?? null) ?? [];
	}
	sheetVisibility(e) {
		return Ie(this.parsedWorkbook?.workbook.sheets ?? [], e);
	}
	isHidden(e) {
		return this.sheetVisibility(e) !== "visible";
	}
	async getWorksheet(e) {
		let t = this.sheetCache.get(e);
		if (t) return t;
		if (!this.parsedWorkbook || !this.rawData) throw Error("Workbook not loaded");
		let n = this.parsedWorkbook.workbook.sheets[e];
		if (!n) throw Error(`Sheet index ${e} out of range`);
		let r = await this.bridge.request((t) => ({
			type: "parseSheet",
			id: t,
			sheetIndex: e,
			sheetName: n.name,
			maxZipEntryBytes: this.maxZipEntryBytes
		})), i;
		if (this._mode === "worker") i = r.worksheet;
		else {
			let { worksheetJson: e } = r;
			i = JSON.parse(new TextDecoder().decode(new Uint8Array(e)));
		}
		return Ci(i, this.parsedWorkbook.sharedStrings), this.sheetCache.set(e, i), i;
	}
	async getImage(e, t) {
		let n = this.imageBlobCache.get(e);
		if (n) return n;
		let r = this.bridge.request((t) => ({
			type: "extractImage",
			id: t,
			path: e
		})).then((e) => {
			let n = e.bytes;
			return new Blob([n], { type: t });
		});
		return this.imageBlobCache.set(e, r), r;
	}
	async toMarkdown() {
		return (await this.bridge.request((e) => ({
			type: "toMarkdown",
			id: e
		}))).markdown;
	}
	async resolveValidationList(e, t) {
		if (!this.parsedWorkbook) throw Error("Workbook not loaded");
		let n = wi(t);
		if (n.kind !== "range") return Ti(n, () => null);
		let r = e;
		if (n.sheet) {
			let e = this.sheetNames.findIndex((e) => e.toLowerCase() === n.sheet?.toLowerCase());
			if (e < 0) return {
				kind: "formula",
				formula: t ?? ""
			};
			r = e;
		}
		let i = await this.getWorksheet(r), a = this.parsedWorkbook.styles, o = /* @__PURE__ */ new Map();
		for (let e of i.rows) for (let t of e.cells) o.set(`${t.row}:${t.col}`, t);
		return Ti(n, (e, t) => {
			let n = o.get(`${e}:${t}`);
			return n ? bt(n, a, null, i.date1904) : null;
		});
	}
	cellText(e, t) {
		return this.parsedWorkbook ? bt(t, this.parsedWorkbook.styles, null, e.date1904) : "";
	}
	async renderViewport(e, t, n, r = {}) {
		if (this._mode === "worker") throw Error("renderViewport(canvas) is unavailable in mode: 'worker'; use renderViewportToBitmap() and paint it via an ImageBitmapRenderingContext");
		if (!this.parsedWorkbook) throw Error("Workbook not loaded");
		return _i({
			ws: this.sheetCache.get(t) ?? await this.getWorksheet(t),
			styles: this.parsedWorkbook.styles,
			imageCache: this.imageCache,
			math: this.math
		}, e, n, {
			...r,
			fetchImage: this._fetchImage
		});
	}
	async renderViewportToBitmap(e, t, n) {
		let r = {
			...n,
			dpr: n.dpr ?? l()
		};
		if (this._mode === "worker") {
			if (!Number.isInteger(e) || e < 0 || e >= this.sheetCount) throw Error(`Sheet index ${e} out of range (count: ${this.sheetCount})`);
			return (await this.bridge.request((n) => ({
				type: "renderViewport",
				id: n,
				sheetIndex: e,
				viewport: t,
				opts: r
			}))).bitmap;
		}
		let i = new OffscreenCanvas(1, 1);
		return await this.renderViewport(i, e, t, r), i.transferToImageBitmap();
	}
	destroy() {
		this.bridge.terminate(), this.parsedWorkbook = null, this.sheetCache.clear(), this.googleFontFaces.length > 0 && (j(this.googleFontFaces), this.googleFontFaces = []), this.imageCache.clear(), W(this._fetchImage), Se(this._fetchImage), z(this._fetchImage), this.imageBlobCache.clear(), this.rawData = null;
	}
};
//#endregion
//#region packages/xlsx/src/data-validation.ts
function Oi(e, t, n) {
	if (!e) return !1;
	for (let r of e.split(/\s+/)) {
		if (!r) continue;
		let [e, i] = r.split(":"), a = _n(e);
		if (!a) continue;
		if (!i) {
			if (a.row === t && a.col === n) return !0;
			continue;
		}
		let o = _n(i);
		if (!o) continue;
		let s = Math.min(a.row, o.row), c = Math.max(a.row, o.row), l = Math.min(a.col, o.col), u = Math.max(a.col, o.col);
		if (t >= s && t <= c && n >= l && n <= u) return !0;
	}
	return !1;
}
function ki(e, t, n) {
	if (!e) return null;
	for (let r of e) if (r.validationType === "list" && Oi(r.sqref, t, n)) return r;
	return null;
}
//#endregion
//#region packages/xlsx/src/find.ts
var Ai = class {
	_matches = [];
	_active = -1;
	constructor(e, t, n) {
		this._sheetCount = e, this._sheetName = t, this._collectSheetCells = n;
	}
	invalidate() {
		this._matches = [], this._active = -1;
	}
	sheetHighlights(e) {
		let t = [];
		for (let n = 0; n < this._matches.length; n++) {
			let r = this._matches[n];
			r.sheet === e && t.push({
				row: r.row,
				col: r.col,
				active: n === this._active
			});
		}
		return t;
	}
	activeLocation() {
		return this._locationAt(this._active);
	}
	_locationAt(e) {
		let t = this._matches[e];
		return t ? {
			sheet: t.sheet,
			sheetName: t.sheetName,
			ref: vn(t.row, t.col),
			row: t.row,
			col: t.col
		} : null;
	}
	matches() {
		return this._matches.map((e, t) => {
			let n = this._locationAt(t);
			return {
				matchIndex: t,
				text: e.text,
				location: n
			};
		});
	}
	async find(e, t = {}) {
		if (this._matches = [], this._active = -1, e.length === 0) return [];
		let n = this._sheetCount();
		for (let r = 0; r < n; r++) {
			let n = await this._collectSheetCells(r), i = this._sheetName(r);
			for (let a of n) {
				let n = te(q([{ text: a.text }]), e, t);
				for (let e of n) {
					let t = e.slices[0], n = a.text.slice(t.start, t.end);
					this._matches.push({
						sheet: r,
						sheetName: i,
						row: a.row,
						col: a.col,
						text: n
					});
				}
			}
		}
		return this.matches();
	}
	next() {
		return this._active = pe(this._active, this._matches.length), this._activePublic();
	}
	prev() {
		return this._active = se(this._active, this._matches.length), this._activePublic();
	}
	_activePublic() {
		let e = this._locationAt(this._active);
		return e ? {
			matchIndex: this._active,
			text: this._matches[this._active].text,
			location: e
		} : null;
	}
};
function ji(e) {
	let { cell: t, popup: n, viewport: r, rtl: i } = e, a = t.x + t.w + 8, o = t.x - 8 - n.w, s = a + n.w <= r.w, c = o >= 0, l;
	l = i ? c ? o : s ? a : o : s ? a : c ? o : a, l = Math.max(0, Math.min(l, r.w - n.w));
	let u = t.y;
	return u = Math.max(0, Math.min(u, r.h - n.h)), {
		left: l,
		top: u
	};
}
function Mi(e) {
	return e > 0 ? (e + 1) * 19 : 0;
}
function Ni(e, t) {
	let n = /* @__PURE__ */ new Map(), r = /* @__PURE__ */ new Map(), i = 0, a = 0;
	for (let t of e) t.level > 0 && n.set(t.index, t.level), t.collapsed && r.set(t.index, !0), t.index > i && (i = t.index), t.level > a && (a = t.level);
	let o = i, s = [];
	if (a === 0) return {
		maxLevel: 0,
		groups: s
	};
	let c = (e) => n.get(e) ?? 0;
	for (let e = 1; e <= a; e++) {
		let n = null;
		for (let i = 1; i <= o + 1; i++) c(i) >= e ? n ? n.end = i : n = {
			start: i,
			end: i
		} : n &&= (s.push(Pi(e, n, t, r, c)), null);
		n && s.push(Pi(e, n, t, r, c));
	}
	return {
		maxLevel: a,
		groups: s
	};
}
function Pi(e, t, n, r, i) {
	let a = null;
	if (n) {
		let n = t.end + 1;
		n >= 1 && i(n) < e && (a = n);
	} else {
		let n = t.start - 1;
		n >= 1 && i(n) < e && (a = n);
	}
	let o = a != null && (r.get(a) ?? !1);
	return {
		level: e,
		start: t.start,
		end: t.end,
		summary: a,
		collapsed: o
	};
}
function Fi(e, t) {
	let n = !e.collapsed, r = /* @__PURE__ */ new Map();
	for (let e of t) r.set(e.index, e);
	let i = [], a = [];
	if (n) for (let t = e.start; t <= e.end; t++) i.push(t);
	else {
		let n = /* @__PURE__ */ new Set();
		for (let r of t) r.index >= e.start && r.index <= e.end && r.collapsed && n.add(r.index);
		for (let t = e.start; t <= e.end; t++) Ii(t, e, r, n) || a.push(t);
	}
	return {
		hide: i,
		show: a,
		nowCollapsed: n
	};
}
function Ii(e, t, n, r) {
	let i = n.get(e)?.level ?? 0;
	if (i <= t.level) return !1;
	for (let e of r) {
		let r = n.get(e)?.level ?? 0;
		if (!(r >= i) && !(r < t.level)) return !0;
	}
	return !1;
}
function Li(e, t) {
	let n = [], r = [];
	for (let i of e) i.level >= t ? n.push(i.index) : r.push(i.index);
	return {
		hide: n,
		show: r
	};
}
function Ri(e) {
	let t = [];
	for (let n of e.rows) {
		let e = n.outlineLevel ?? 0, r = n.collapsed ?? !1;
		e === 0 && !r || t.push({
			index: n.index,
			level: e,
			collapsed: r,
			hidden: n.hidden ?? !1
		});
	}
	return t;
}
function zi(e) {
	let t = e.colOutlineLevels ?? {}, n = e.colCollapsed ?? {}, r = e.colHidden ?? {}, i = /* @__PURE__ */ new Set();
	for (let e of Object.keys(t)) i.add(Number(e));
	for (let e of Object.keys(n)) i.add(Number(e));
	let a = [];
	for (let e of [...i].sort((e, t) => e - t)) a.push({
		index: e,
		level: t[e] ?? 0,
		collapsed: n[e] ?? !1,
		hidden: r[e] ?? !1
	});
	return a;
}
function Bi(e, t) {
	let n = e.outlinePr;
	return n ? t === "row" ? n.summaryBelow : n.summaryRight : !0;
}
//#endregion
//#region packages/xlsx/src/viewer.ts
var Vi = 150, Hi = 280, Ui = 200, Wi = 240, Gi = 200, Ki = 30, qi = 1, Ji = .45, Yi = "data-xlsx-viewer-styles", Xi = ".xlsx-tab-strip::-webkit-scrollbar{display:none}.xlsx-tab-nav{background:transparent;transition:background 0.1s;}.xlsx-tab-nav:hover{background:rgba(0,0,0,0.08);}.xlsx-zoom-slider{-webkit-appearance:none;appearance:none;background:transparent;height:15px;margin:0;}.xlsx-zoom-slider::-webkit-slider-runnable-track{height:4px;background:#c4c4c4;border-radius:2px;}.xlsx-zoom-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:12px;height:12px;margin-top:-4px;border-radius:50%;background:#808080;cursor:pointer;}.xlsx-zoom-slider:hover::-webkit-slider-thumb{background:#5f5f5f;}.xlsx-zoom-slider::-moz-range-track{height:4px;background:#c4c4c4;border-radius:2px;}.xlsx-zoom-slider::-moz-range-thumb{width:12px;height:12px;border:none;border-radius:50%;background:#808080;cursor:pointer;}";
function Zi() {
	if (typeof document > "u" || !document.head || document.head.querySelector(`style[${Yi}]`)) return;
	let e = document.createElement("style");
	e.setAttribute(Yi, ""), e.textContent = Xi, document.head.appendChild(e);
}
var Qi = class {
	idxs;
	cumDelta;
	constructor(e, t, n, r) {
		this.defaultPx = t, this.maxIndex = r, this.idxs = Object.keys(e).map(Number).filter((e) => e >= 1 && e <= r).sort((e, t) => e - t), this.cumDelta = Array(this.idxs.length);
		let i = 0;
		for (let r = 0; r < this.idxs.length; r++) i += n(e[this.idxs[r]]) - t, this.cumDelta[r] = i;
	}
	deltaBefore(e) {
		let t = 0, n = this.idxs.length;
		for (; t < n;) {
			let r = t + n >> 1;
			this.idxs[r] < e ? t = r + 1 : n = r;
		}
		return t === 0 ? 0 : this.cumDelta[t - 1];
	}
	offsetOf(e) {
		return (e - 1) * this.defaultPx + this.deltaBefore(e);
	}
	indexAt(e) {
		if (e <= 0) return {
			index: 1,
			partial: 0
		};
		let t = 1, n = this.maxIndex;
		for (; t < n;) {
			let r = t + n + 1 >> 1;
			this.offsetOf(r) <= e ? t = r : n = r - 1;
		}
		return {
			index: t,
			partial: e - this.offsetOf(t)
		};
	}
	scrollableIndexAt(e, t) {
		let n = e + this.offsetOf(t);
		return n >= this.offsetOf(this.maxIndex) + this.sizeOf(this.maxIndex) ? null : this.indexAt(n).index;
	}
	sizeOf(e) {
		return this.offsetOf(e + 1) - this.offsetOf(e);
	}
}, $i = "#1a73e8", ea = 4, ta = 5;
function na(e, t, n, r) {
	for (let { index: i, edge: a } of t) if (!(a <= r) && Math.abs(e - a) <= n) return i;
	return null;
}
function ra(e) {
	return {
		border: `2px solid ${e}`,
		background: `color-mix(in srgb, ${e} 8%, transparent)`
	};
}
var ia = /* @__PURE__ */ new WeakMap();
function aa(e, t) {
	let n = ia.get(e);
	if (n) return n;
	let r = {
		col: new Qi(e.colWidths, Q(e.defaultColWidth, t), (e) => Q(e, t), 16384),
		row: new Qi(e.rowHeights, $(e.defaultRowHeight), (e) => $(e), 1048576)
	};
	return ia.set(e, r), r;
}
var oa = class {
	wb = null;
	wrapper;
	canvas;
	gridRegion;
	rowGutter;
	colGutter;
	cornerGutter;
	gutter = {
		w: 0,
		h: 0
	};
	rowOutline = null;
	colOutline = null;
	rowOutlineBands = [];
	colOutlineBands = [];
	stashedRowHeights = /* @__PURE__ */ new Map();
	stashedColWidths = /* @__PURE__ */ new Map();
	sizeOverrideStore = /* @__PURE__ */ new Map();
	canvasArea;
	scrollHost;
	spacer;
	tabBar;
	tabStrip;
	navPrev;
	navNext;
	navGroup;
	tabs = [];
	tabColors = [];
	zoomSlider = null;
	zoomLabel = null;
	currentSheet = 0;
	_hiddenSheetMode;
	currentWorksheet = null;
	opts;
	_mode;
	_bitmapCtx = null;
	_destroyed = !1;
	_loadGen = 0;
	resizeObserver = null;
	_rafId = null;
	_renderSeq = 0;
	effectiveH = 0;
	_pendingZoomAnchor = null;
	anchorCell = null;
	activeCell = null;
	selectionMode = "cells";
	isSelecting = !1;
	selectionOverlay;
	findOverlay;
	_find;
	keydownHandler = null;
	pendingTap = null;
	pendingClick = null;
	resizeDrag = null;
	commentPopup;
	commentMap = /* @__PURE__ */ new Map();
	hyperlinkMap = /* @__PURE__ */ new Map();
	commentPopupKey = null;
	commentPopupTimer = null;
	validationPanel;
	validationPanelKey = null;
	validationArrowRect = null;
	validationOutsideHandler = null;
	constructor(e, t = {}) {
		this.opts = t, this._mode = t.mode ?? "main", this._hiddenSheetMode = t.hiddenSheetMode ?? "show", this.wrapper = document.createElement("div"), this.wrapper.style.cssText = "position:relative;width:100%;height:100%;border:1px solid #c8ccd0;background:#fff;box-sizing:border-box;font-family:sans-serif;display:flex;flex-direction:column;", this.gridRegion = document.createElement("div"), this.gridRegion.style.cssText = "position:relative;flex:1;min-height:0;overflow:hidden;";
		let n = "position:absolute;top:0;left:0;z-index:3;display:none;background:#f5f5f5;";
		this.cornerGutter = document.createElement("canvas"), this.cornerGutter.style.cssText = n, this.cornerGutter.setAttribute("data-xlsx-outline", "corner"), this.colGutter = document.createElement("canvas"), this.colGutter.style.cssText = n, this.colGutter.setAttribute("data-xlsx-outline", "col"), this.rowGutter = document.createElement("canvas"), this.rowGutter.style.cssText = n, this.rowGutter.setAttribute("data-xlsx-outline", "row"), this.canvasArea = document.createElement("div"), this.canvasArea.style.cssText = "position:absolute;inset:0;overflow:hidden;", this.canvas = document.createElement("canvas"), this.canvas.style.cssText = "position:absolute;top:0;left:0;z-index:0;display:block;", this._mode === "worker" && (this._bitmapCtx = this.canvas.getContext("bitmaprenderer")), this.selectionOverlay = document.createElement("div"), this.selectionOverlay.style.cssText = "position:absolute;top:0;left:0;z-index:1;pointer-events:none;overflow:hidden;width:100%;height:100%;", this.findOverlay = document.createElement("div"), this.findOverlay.style.cssText = "position:absolute;top:0;left:0;z-index:1;pointer-events:none;overflow:hidden;width:100%;height:100%;", this.scrollHost = document.createElement("div"), this.scrollHost.style.cssText = "position:absolute;inset:0;overflow:auto;z-index:2;background:transparent;", this.spacer = document.createElement("div"), this.spacer.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;", this.scrollHost.appendChild(this.spacer), this.commentPopup = document.createElement("div"), this.commentPopup.style.cssText = `position:absolute;z-index:3;pointer-events:none;display:none;max-width:${Hi}px;max-height:${Ui}px;overflow:hidden;box-sizing:border-box;padding:6px 8px;background:#fffbcc;border:1px solid #b8b8a0;box-shadow:1px 2px 5px rgba(0,0,0,0.25);font:12px/1.4 sans-serif;color:#222;white-space:pre-wrap;word-break:break-word;`, this.validationPanel = document.createElement("div"), this.validationPanel.setAttribute("data-xlsx-validation-panel", ""), this.validationPanel.style.cssText = `position:absolute;z-index:4;pointer-events:auto;display:none;min-width:80px;max-width:${Wi}px;max-height:${Gi}px;overflow-y:auto;box-sizing:border-box;background:#fff;border:1px solid #7f7f7f;box-shadow:1px 2px 5px rgba(0,0,0,0.25);font:12px/1.4 sans-serif;color:#222;`, this.validationPanel.addEventListener("wheel", (e) => e.stopPropagation()), this.canvasArea.appendChild(this.canvas), this.canvasArea.appendChild(this.selectionOverlay), this.canvasArea.appendChild(this.findOverlay), this.canvasArea.appendChild(this.scrollHost), this.canvasArea.appendChild(this.commentPopup), this.canvasArea.appendChild(this.validationPanel);
		let r = Math.round(50 * (this.opts.cellScale ?? 1));
		this.tabBar = document.createElement("div"), this.tabBar.style.cssText = `display:flex;align-items:flex-end;height:${Ki}px;flex-shrink:0;background:#f0f0f0;border-top:1px solid #c8ccd0;`, this.navPrev = this.makeNavButton("◀", "Scroll tabs left", () => this.scrollTabs(-1)), this.navNext = this.makeNavButton("▶", "Scroll tabs right", () => this.scrollTabs(1)), this.navPrev.dataset.xlsxTabNav = "prev", this.navNext.dataset.xlsxTabNav = "next";
		let i = document.createElement("div");
		i.style.cssText = `display:flex;flex-shrink:0;width:${r}px;height:100%;`, i.appendChild(this.navPrev), i.appendChild(this.navNext), this.navGroup = i, this.tabStrip = document.createElement("div"), this.tabStrip.style.cssText = `position:relative;display:flex;align-items:flex-end;flex:1;min-width:0;height:100%;margin-left:${qi}px;overflow-x:auto;overflow-y:hidden;gap:${qi}px;scrollbar-width:none;`, this.tabStrip.classList.add("xlsx-tab-strip"), Zi(), this.tabStrip.addEventListener("scroll", () => this.updateNavButtons()), this.tabBar.appendChild(i), this.tabBar.appendChild(this.tabStrip), this.opts.showZoomSlider !== !1 && this.tabBar.appendChild(this.buildZoomControl()), this.gridRegion.appendChild(this.canvasArea), this.wrapper.appendChild(this.gridRegion), this.wrapper.appendChild(this.tabBar), e.appendChild(this.wrapper), this.rowGutter.addEventListener("pointerdown", (e) => this.onGutterPointerDown(e, "row")), this.colGutter.addEventListener("pointerdown", (e) => this.onGutterPointerDown(e, "col")), this.scrollHost.addEventListener("scroll", () => {
			this.pendingTap = null, this.hideCommentPopup(), this.hideValidationPanel(), this.scrollHost.clientWidth > 0 && (this.effectiveH = this.effectiveScrollLeft), this.scheduleRender(), this.updateSelectionOverlay(), this.updateFindOverlay();
		}), this.resizeObserver = new ResizeObserver(() => {
			this.reanchorHorizontalScroll(), this.layoutGutters(), this.scheduleRender(), this.updateSelectionOverlay(), this.updateFindOverlay(), this.updateNavButtons();
		}), this.resizeObserver.observe(this.gridRegion), this.setupSelectionEvents(), this._find = new Ai(() => this.sheetCount, (e) => this.wb?.sheetNames[e] ?? "", (e) => this._collectSheetCells(e));
	}
	async _collectSheetCells(e) {
		let t = this.wb;
		if (!t) return [];
		let n = await t.getWorksheet(e), r = [];
		for (let e of n.rows) for (let i of e.cells) {
			let e = t.cellText(n, i);
			e !== "" && r.push({
				row: i.row,
				col: i.col,
				text: e
			});
		}
		return r;
	}
	async load(e) {
		let t = ++this._loadGen, n = this.wb;
		try {
			let r = await Di.load(e, {
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
			this.wb = r, n?.destroy(), this._find.invalidate(), this.sizeOverrideStore.clear(), this.buildTabs(), this.opts.onReady?.(this.wb.sheetNames), await this.showSheet(this._initialSheet());
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
	get workbook() {
		if (!this.wb) throw Error("Workbook not loaded");
		return this.wb;
	}
	async showSheet(e) {
		this.currentSheet = e, this.scrollHost.scrollTop = 0, this.anchorCell = null, this.activeCell = null, this.selectionMode = "cells", this.hideCommentPopup(), this.hideValidationPanel(), this.updateSelectionOverlay(), this.updateTabActive(e), this.currentWorksheet = await this.workbook.getWorksheet(e), this.buildCommentMap(this.currentWorksheet), this.buildHyperlinkMap(this.currentWorksheet), this.buildOutline(this.currentWorksheet), this.layoutGutters(), this.updateSpacerSize(this.currentWorksheet), this.resetHorizontalScroll(), await this.renderCurrentSheet(), this.updateFindOverlay(), this.opts.onSheetChange?.(e, this.workbook.sheetNames.length);
	}
	buildOutline(e) {
		this.stashedRowHeights.clear(), this.stashedColWidths.clear(), this.rowOutlineBands = Ri(e), this.colOutlineBands = zi(e);
		let t = Ni(this.rowOutlineBands, Bi(e, "row")), n = Ni(this.colOutlineBands, Bi(e, "col"));
		this.rowOutline = t.maxLevel > 0 ? t : null, this.colOutline = n.maxLevel > 0 ? n : null;
	}
	layoutGutters() {
		let e = this.opts.cellScale ?? 1, t = this.rowOutline ? Math.round(Mi(this.rowOutline.maxLevel) * e) : 0, n = this.colOutline ? Math.round(Mi(this.colOutline.maxLevel) * e) : 0;
		this.gutter = {
			w: t,
			h: n
		}, t > 0 || n > 0 ? this.colGutter.parentElement || (this.gridRegion.appendChild(this.colGutter), this.gridRegion.appendChild(this.rowGutter), this.gridRegion.appendChild(this.cornerGutter)) : (this.colGutter.remove(), this.rowGutter.remove(), this.cornerGutter.remove()), this.canvasArea.style.left = `${t}px`, this.canvasArea.style.top = `${n}px`;
		let r = (e, t, n, r, i) => {
			if (r <= 0 || i <= 0) {
				e.style.display = "none";
				return;
			}
			e.style.display = "block", e.style.left = `${t}px`, e.style.top = `${n}px`, e.style.width = `${r}px`, e.style.height = `${i}px`;
		}, i = this.gridRegion.clientWidth, a = this.gridRegion.clientHeight;
		r(this.cornerGutter, 0, 0, t, n), r(this.colGutter, t, 0, Math.max(0, i - t), n), r(this.rowGutter, 0, n, t, Math.max(0, a - n));
	}
	renderGutters() {
		this.currentWorksheet && (this.gutter.h > 0 && this.colOutline && this.paintAxisGutter("col"), this.gutter.w > 0 && this.rowOutline && this.paintAxisGutter("row"), (this.gutter.w > 0 || this.gutter.h > 0) && this.paintCornerGutter());
	}
	paintAxisGutter(e) {
		if (!this.currentWorksheet) return;
		let t = this.opts.cellScale ?? 1, n = window.devicePixelRatio ?? 1, r = e === "row", i = r ? this.rowGutter : this.colGutter, a = r ? this.rowOutline : this.colOutline;
		if (!a) return;
		let o = parseFloat(i.style.width) || 0, s = parseFloat(i.style.height) || 0;
		if (o <= 0 || s <= 0) return;
		i.width = Math.round(o * n), i.height = Math.round(s * n);
		let c = i.getContext("2d");
		if (!c) return;
		c.setTransform(n, 0, 0, n, 0, 0), c.clearRect(0, 0, o, s), c.fillStyle = "#f5f5f5", c.fillRect(0, 0, o, s);
		let l = 19 * t;
		c.strokeStyle = "#808080", c.lineWidth = 1, c.fillStyle = "#404040";
		for (let e of a.groups) {
			let n = (e.level - 1 + .5) * l, i = r ? this.getCellRect(e.start, 1) : this.getCellRect(1, e.start), a = r ? this.getCellRect(e.end, 1) : this.getCellRect(1, e.end);
			if (!i || !a) continue;
			let o = r ? i.y : this.screenX(i.x, i.w), s = r ? a.y + a.h : this.screenX(a.x, a.w) + a.w, u = Math.min(o, s), d = Math.max(o, s);
			if (!e.collapsed && d - u > 1) {
				if (c.beginPath(), r) {
					c.moveTo(n, u), c.lineTo(n, d);
					let t = e.summary != null && e.summary > e.end ? d : u;
					c.lineTo(n + l / 2, t);
				} else {
					c.moveTo(u, n), c.lineTo(d, n);
					let t = e.summary != null && e.summary > e.end ? d : u;
					c.lineTo(t, n + l / 2);
				}
				c.stroke();
			}
			if (e.summary != null) {
				let i = r ? this.getCellRect(e.summary, 1) : this.getCellRect(1, e.summary);
				if (i) {
					let a = r ? i.y + i.h / 2 : this.screenX(i.x, i.w) + i.w / 2;
					this.drawToggleBox(c, r ? n : a, r ? a : n, e.collapsed, t);
				}
			}
		}
		let u = r ? 22 * t / 2 : 50 * t / 2;
		for (let e = 1; e <= a.maxLevel + 1; e++) {
			let n = (e - .5) * l;
			if (n + l / 2 > (r ? o : s) + .5) break;
			this.drawLevelButton(c, r ? n : u, r ? u : n, String(e), t);
		}
	}
	drawToggleBox(e, t, n, r, i) {
		let a = Math.round(9 * i), o = Math.round(t - a / 2), s = Math.round(n - a / 2);
		e.save(), e.fillStyle = "#ffffff", e.strokeStyle = "#808080", e.lineWidth = 1, e.fillRect(o + .5, s + .5, a, a), e.strokeRect(o + .5, s + .5, a, a), e.strokeStyle = "#404040", e.beginPath(), e.moveTo(o + 2.5, s + a / 2 + .5), e.lineTo(o + a - 1.5, s + a / 2 + .5), r && (e.moveTo(o + a / 2 + .5, s + 2.5), e.lineTo(o + a / 2 + .5, s + a - 1.5)), e.stroke(), e.restore();
	}
	drawLevelButton(e, t, n, r, i) {
		let a = Math.round(11 * i), o = Math.round(t - a / 2), s = Math.round(n - a / 2);
		e.save(), e.font = `${Math.round(9 * i)}px sans-serif`, e.textAlign = "center", e.textBaseline = "middle", e.fillStyle = "#ffffff", e.strokeStyle = "#808080", e.lineWidth = 1, e.fillRect(o + .5, s + .5, a, a), e.strokeRect(o + .5, s + .5, a, a), e.fillStyle = "#404040", e.fillText(r, t, n + .5), e.restore();
	}
	paintCornerGutter() {
		let e = window.devicePixelRatio ?? 1, t = this.cornerGutter, n = parseFloat(t.style.width) || 0, r = parseFloat(t.style.height) || 0;
		if (n <= 0 || r <= 0) return;
		t.width = Math.round(n * e), t.height = Math.round(r * e);
		let i = t.getContext("2d");
		i && (i.setTransform(e, 0, 0, e, 0, 0), i.clearRect(0, 0, n, r), i.fillStyle = "#f5f5f5", i.fillRect(0, 0, n, r));
	}
	onGutterPointerDown(e, t) {
		if (!this.currentWorksheet) return;
		let n = t === "row", r = n ? this.rowOutline : this.colOutline;
		if (!r) return;
		let i = (n ? this.rowGutter : this.colGutter).getBoundingClientRect(), a = e.clientX - i.left, o = e.clientY - i.top, s = this.opts.cellScale ?? 1, c = 19 * s, l = 7 * s, u = n ? 22 * s / 2 : 50 * s / 2;
		if ((n ? o : a) <= (n ? 22 : 50) * s) {
			for (let i = 1; i <= r.maxLevel + 1; i++) {
				let r = (i - .5) * c, s = n ? r : u, d = n ? u : r;
				if (Math.abs(a - s) <= l && Math.abs(o - d) <= l) {
					e.preventDefault(), this.applyLevelButton(i, t);
					return;
				}
			}
			return;
		}
		for (let i of r.groups) {
			if (i.summary == null) continue;
			let r = (i.level - 1 + .5) * c, s = n ? this.getCellRect(i.summary, 1) : this.getCellRect(1, i.summary);
			if (!s) continue;
			let u = n ? s.y + s.h / 2 : this.screenX(s.x, s.w) + s.w / 2, d = n ? r : u, f = n ? u : r;
			if (Math.abs(a - d) <= l && Math.abs(o - f) <= l) {
				e.preventDefault(), this.applyGroupToggle(i, t);
				return;
			}
		}
	}
	applyGroupToggle(e, t) {
		let n = this.currentWorksheet;
		if (!n) return;
		let { hide: r, show: i, nowCollapsed: a } = Fi(e, t === "row" ? this.rowOutlineBands : this.colOutlineBands);
		for (let e of r) this.setBandHidden(t, e, !0);
		for (let e of i) this.setBandHidden(t, e, !1);
		e.summary != null && this.setBandCollapsed(t, e.summary, a), this.afterOutlineMutation(n);
	}
	applyLevelButton(e, t) {
		let n = this.currentWorksheet;
		if (!n) return;
		let { hide: r, show: i } = Li(t === "row" ? this.rowOutlineBands : this.colOutlineBands, e);
		for (let e of r) this.setBandHidden(t, e, !0);
		for (let e of i) this.setBandHidden(t, e, !1);
		let a = t === "row" ? this.rowOutline : this.colOutline;
		if (a) for (let n of a.groups) n.summary != null && this.setBandCollapsed(t, n.summary, n.level >= e);
		this.afterOutlineMutation(n);
	}
	setBandHidden(e, t, n) {
		let r = this.currentWorksheet;
		if (r) {
			if (e === "row") if (n) this.stashedRowHeights.has(t) || this.stashedRowHeights.set(t, r.rowHeights[t]), r.rowHeights[t] = 0;
			else if (this.stashedRowHeights.has(t)) {
				let e = this.stashedRowHeights.get(t);
				e === void 0 ? delete r.rowHeights[t] : r.rowHeights[t] = e, this.stashedRowHeights.delete(t);
			} else r.rowHeights[t] === 0 && delete r.rowHeights[t];
			else if (n) this.stashedColWidths.has(t) || this.stashedColWidths.set(t, r.colWidths[t]), r.colWidths[t] = 0;
			else if (this.stashedColWidths.has(t)) {
				let e = this.stashedColWidths.get(t);
				e === void 0 ? delete r.colWidths[t] : r.colWidths[t] = e, this.stashedColWidths.delete(t);
			} else r.colWidths[t] === 0 && delete r.colWidths[t];
			this.recordSizeOverride(e, t);
		}
	}
	recordSizeOverride(e, t) {
		let n = this.currentWorksheet;
		if (!n) return;
		let r = this.sizeOverrideStore.get(this.currentSheet);
		r || (r = {
			rows: /* @__PURE__ */ new Map(),
			cols: /* @__PURE__ */ new Map()
		}, this.sizeOverrideStore.set(this.currentSheet, r)), e === "row" ? r.rows.set(t, n.rowHeights[t] ?? null) : r.cols.set(t, n.colWidths[t] ?? null);
	}
	wireSizeOverrides() {
		let e = this.sizeOverrideStore.get(this.currentSheet);
		if (!e || e.rows.size === 0 && e.cols.size === 0) return;
		let t = {};
		return e.rows.size > 0 && (t.rows = Object.fromEntries(e.rows)), e.cols.size > 0 && (t.cols = Object.fromEntries(e.cols)), t;
	}
	setBandCollapsed(e, t, n) {
		let r = this.currentWorksheet;
		if (r) if (e === "row") {
			let e = r.rows.find((e) => e.index === t);
			e && (e.collapsed = n);
		} else r.colCollapsed = r.colCollapsed ?? {}, n ? r.colCollapsed[t] = !0 : delete r.colCollapsed[t];
	}
	afterOutlineMutation(e) {
		ia.delete(e), this.buildOutlineLayoutOnly(e), this.updateSpacerSize(e), this.updateSelectionOverlay(), this.scheduleRender();
	}
	buildOutlineLayoutOnly(e) {
		this.rowOutlineBands = Ri(e), this.colOutlineBands = zi(e);
		let t = Ni(this.rowOutlineBands, Bi(e, "row")), n = Ni(this.colOutlineBands, Bi(e, "col"));
		this.rowOutline = t.maxLevel > 0 ? t : null, this.colOutline = n.maxLevel > 0 ? n : null;
	}
	get isRtl() {
		return this.currentWorksheet?.rightToLeft === !0;
	}
	get maxScrollLeft() {
		return Math.max(0, this.scrollHost.scrollWidth - this.scrollHost.clientWidth);
	}
	get effectiveScrollLeft() {
		let e = this.scrollHost.scrollLeft;
		return this.isRtl ? this.maxScrollLeft - e : e;
	}
	screenX(e, t) {
		return this.isRtl ? An(e, t, this.canvasArea.clientWidth) : e;
	}
	resetHorizontalScroll() {
		this.effectiveH = 0, this.scrollHost.scrollLeft = this.isRtl ? this.maxScrollLeft : 0;
	}
	reanchorHorizontalScroll() {
		if (!this.isRtl || this.scrollHost.clientWidth === 0) return;
		let e = Math.max(0, this.maxScrollLeft - this.effectiveH);
		Math.abs(this.scrollHost.scrollLeft - e) > 1 && (this.scrollHost.scrollLeft = e);
	}
	get sheetIndex() {
		return this.currentSheet;
	}
	get sheetCount() {
		return this.wb?.sheetCount ?? 0;
	}
	async goToSheet(e) {
		this.sheetCount !== 0 && await this.showSheet(Math.max(0, Math.min(e, this.sheetCount - 1)));
	}
	async nextSheet() {
		await this.goToSheet(this._stepSheet(1));
	}
	async prevSheet() {
		await this.goToSheet(this._stepSheet(-1));
	}
	_stepSheet(e) {
		return this._hiddenSheetMode === "skip" && this.wb ? Ce(this.currentSheet, e, (e) => this.wb.isHidden(e), this.sheetCount) : this.currentSheet + e;
	}
	_initialSheet() {
		return this._hiddenSheetMode === "skip" && this.wb ? we(0, (e) => this.wb.isHidden(e), this.sheetCount) : 0;
	}
	getCellAt(e, t) {
		let n = this.currentWorksheet;
		if (!n) return null;
		let r = this.opts.cellScale ?? 1, i = this.canvasArea.getBoundingClientRect(), a = this.screenX(e - i.left, 0) / r, o = (t - i.top) / r;
		if (a < 50 || o < 22) return null;
		let s = a - 50, c = o - 22, l = n.freezeRows ?? 0, u = n.freezeCols ?? 0, d = 0, f = [];
		for (let e = 1; e <= l; e++) {
			let t = $(n.rowHeights[e] ?? n.defaultRowHeight);
			f.push(t), d += t;
		}
		let p = 0, m = [];
		for (let e = 1; e <= u; e++) {
			let t = Q(n.colWidths[e] ?? n.defaultColWidth, Z(n));
			m.push(t), p += t;
		}
		let h;
		if (c < d) {
			h = -1;
			let e = 0;
			for (let t = 0; t < l; t++) if (e += f[t], c < e) {
				h = t + 1;
				break;
			}
			if (h === -1) return null;
		} else {
			let e = c - d + this.scrollHost.scrollTop / r, t = aa(n, Z(n)).row.scrollableIndexAt(e, l + 1);
			if (t === null) return null;
			h = t;
		}
		let g;
		if (s < p) {
			g = -1;
			let e = 0;
			for (let t = 0; t < u; t++) if (e += m[t], s < e) {
				g = t + 1;
				break;
			}
			if (g === -1) return null;
		} else {
			let e = s - p + this.effectiveScrollLeft / r, t = aa(n, Z(n)).col.scrollableIndexAt(e, u + 1);
			if (t === null) return null;
			g = t;
		}
		return {
			row: h,
			col: g
		};
	}
	getCellRect(e, t) {
		let n = this.currentWorksheet;
		if (!n) return null;
		let r = this.opts.cellScale ?? 1, i = Z(n), a = (e) => Math.round(e * r), o = (e) => a(Q(n.colWidths[e] ?? n.defaultColWidth, i)), s = (e) => a($(n.rowHeights[e] ?? n.defaultRowHeight)), c = n.freezeRows ?? 0, l = n.freezeCols ?? 0, u;
		if (t <= l) {
			let e = a(50);
			for (let n = 1; n < t; n++) e += o(n);
			u = e;
		} else {
			let e = 0;
			for (let t = 1; t <= l; t++) e += o(t);
			let s = a(50) + e, c = this.effectiveScrollLeft / r, d = aa(n, i).col, { index: f, partial: p } = d.indexAt(c + d.offsetOf(l + 1)), m = s - p * r;
			if (t >= f) for (let e = f; e < t; e++) m += o(e);
			else for (let e = t; e < f; e++) m -= o(e);
			u = m;
		}
		let d;
		if (e <= c) {
			let t = a(22);
			for (let n = 1; n < e; n++) t += s(n);
			d = t;
		} else {
			let t = 0;
			for (let e = 1; e <= c; e++) t += s(e);
			let o = a(22) + t, l = this.scrollHost.scrollTop / r, u = aa(n, i).row, { index: f, partial: p } = u.indexAt(l + u.offsetOf(c + 1)), m = o - p * r;
			if (e >= f) for (let t = f; t < e; t++) m += s(t);
			else for (let t = e; t < f; t++) m -= s(t);
			d = m;
		}
		return {
			x: u,
			y: d,
			w: o(t),
			h: s(e)
		};
	}
	get selection() {
		return !this.anchorCell || !this.activeCell ? null : {
			anchor: this.anchorCell,
			active: this.activeCell,
			mode: this.selectionMode
		};
	}
	select(e) {
		let t = _n(e);
		t && (this.hideValidationPanel(), this.selectionMode = "cells", this.anchorCell = {
			row: t.row,
			col: t.col
		}, this.activeCell = {
			row: t.row,
			col: t.col
		}, this.updateSelectionOverlay(), this.renderCurrentSheet(), this.opts.onSelectionChange?.(this.selection));
	}
	getHeaderHit(e, t) {
		let n = this.currentWorksheet;
		if (!n) return null;
		let r = this.opts.cellScale ?? 1, i = this.canvasArea.getBoundingClientRect(), a = this.screenX(e - i.left, 0) / r, o = (t - i.top) / r, s = a < 50, c = o < 22;
		if (!s && !c) return null;
		if (s && c) return { kind: "corner" };
		let l = n.freezeRows ?? 0, u = n.freezeCols ?? 0;
		if (s) {
			let e = o - 22;
			if (e < 0) return { kind: "corner" };
			let t = 0, i = [];
			for (let e = 1; e <= l; e++) {
				let r = $(n.rowHeights[e] ?? n.defaultRowHeight);
				i.push(r), t += r;
			}
			if (e < t) {
				let t = 0;
				for (let n = 0; n < l; n++) if (t += i[n], e < t) return {
					kind: "row",
					row: n + 1
				};
				return null;
			}
			let a = e - t + this.scrollHost.scrollTop / r, s = aa(n, Z(n)).row.scrollableIndexAt(a, l + 1);
			return s === null ? null : {
				kind: "row",
				row: s
			};
		}
		let d = a - 50;
		if (d < 0) return { kind: "corner" };
		let f = 0, p = [];
		for (let e = 1; e <= u; e++) {
			let t = Q(n.colWidths[e] ?? n.defaultColWidth, Z(n));
			p.push(t), f += t;
		}
		if (d < f) {
			let e = 0;
			for (let t = 0; t < u; t++) if (e += p[t], d < e) return {
				kind: "col",
				col: t + 1
			};
			return null;
		}
		let m = d - f + this.effectiveScrollLeft / r, h = aa(n, Z(n)).col.scrollableIndexAt(m, u + 1);
		return h === null ? null : {
			kind: "col",
			col: h
		};
	}
	getResizeTarget(e, t) {
		let n = this.currentWorksheet;
		if (!n) return null;
		let r = this.opts.cellScale ?? 1, i = this.canvasArea.getBoundingClientRect(), a = this.screenX(e - i.left, 0), o = t - i.top, s = Math.round(50 * r), c = Math.round(22 * r), l = Z(n);
		if (o <= c && a > s) {
			let n = this.getHeaderHit(e, t);
			if (n?.kind !== "col") return null;
			let r = /* @__PURE__ */ new Map(), i = [];
			for (let e of [n.col - 1, n.col]) {
				if (e < 1) continue;
				let t = this.getCellRect(1, e);
				t && (r.set(e, t.x), i.push({
					index: e,
					edge: t.x + t.w
				}));
			}
			let o = na(a, i, ea, s);
			return o === null ? null : {
				kind: "col",
				index: o,
				originScaled: r.get(o),
				mdw: l
			};
		}
		if (a <= s && o > c) {
			let n = this.getHeaderHit(e, t);
			if (n?.kind !== "row") return null;
			let r = /* @__PURE__ */ new Map(), i = [];
			for (let e of [n.row - 1, n.row]) {
				if (e < 1) continue;
				let t = this.getCellRect(e, 1);
				t && (r.set(e, t.y), i.push({
					index: e,
					edge: t.y + t.h
				}));
			}
			let a = na(o, i, ea, c);
			return a === null ? null : {
				kind: "row",
				index: a,
				originScaled: r.get(a),
				mdw: l
			};
		}
		return null;
	}
	applyResize(e, t) {
		let n = this.resizeDrag, r = this.currentWorksheet;
		if (!n || !r) return;
		let i = this.opts.cellScale ?? 1, a = this.canvasArea.getBoundingClientRect();
		if (n.kind === "col") {
			let t = this.screenX(e - a.left, 0), o = Math.max(ta, Math.round((t - n.originScaled) / i));
			r.colWidths[n.index] = In(o, n.mdw), this.recordSizeOverride("col", n.index);
		} else {
			let e = t - a.top, o = Math.max(ta, Math.round((e - n.originScaled) / i));
			r.rowHeights[n.index] = Ln(o), this.recordSizeOverride("row", n.index);
		}
		ia.delete(r), this.updateSpacerSize(r), this.updateSelectionOverlay(), this.scheduleRender();
	}
	setSelectionColor(e) {
		this.opts.selectionColor = e, this.updateSelectionOverlay();
	}
	async setHiddenSheetMode(e) {
		this._hiddenSheetMode = e, this.buildTabs(), e === "skip" && this.wb && this.wb.isHidden(this.currentSheet) ? await this.showSheet(we(this.currentSheet, (e) => this.wb.isHidden(e), this.sheetCount)) : this.updateTabActive(this.currentSheet);
	}
	get hiddenSheetMode() {
		return this._hiddenSheetMode;
	}
	get visibleSheetCount() {
		if (!this.wb) return 0;
		let e = this.wb;
		return Te((t) => e.isHidden(t), this.sheetCount);
	}
	copySelection() {
		let e = this.currentWorksheet;
		if (!e || !this.anchorCell || !this.activeCell) return;
		let t = 1, n = 1;
		for (let r of e.rows) {
			r.index > t && (t = r.index);
			for (let e of r.cells) e.col > n && (n = e.col);
		}
		let r, i, a, o;
		this.selectionMode === "all" ? (r = 1, i = t, a = 1, o = n) : this.selectionMode === "rows" ? (r = Math.min(this.anchorCell.row, this.activeCell.row), i = Math.max(this.anchorCell.row, this.activeCell.row), a = 1, o = n) : this.selectionMode === "cols" ? (a = Math.min(this.anchorCell.col, this.activeCell.col), o = Math.max(this.anchorCell.col, this.activeCell.col), r = 1, i = t) : (r = Math.min(this.anchorCell.row, this.activeCell.row), i = Math.max(this.anchorCell.row, this.activeCell.row), a = Math.min(this.anchorCell.col, this.activeCell.col), o = Math.max(this.anchorCell.col, this.activeCell.col));
		let s = /* @__PURE__ */ new Map();
		for (let t of e.rows) if (!(t.index < r || t.index > i)) for (let e of t.cells) {
			if (e.col < a || e.col > o) continue;
			let n = e.value, r = "";
			n.type === "text" ? r = n.runs ? n.runs.map((e) => e.text).join("") : n.text : n.type === "number" ? r = String(n.number) : n.type === "bool" ? r = n.bool ? "TRUE" : "FALSE" : n.type === "error" && (r = n.error), r && s.set(`${t.index}:${e.col}`, r);
		}
		let c = [];
		for (let e = r; e <= i; e++) {
			let t = [];
			for (let n = a; n <= o; n++) t.push(s.get(`${e}:${n}`) ?? "");
			c.push(t.join("	"));
		}
		navigator.clipboard.writeText(c.join("\n")).catch(() => void 0);
	}
	updateSelectionOverlay() {
		if (this.selectionOverlay.innerHTML = "", !this.anchorCell || !this.activeCell) return;
		let e = this.opts.cellScale ?? 1, t = this.currentWorksheet, n = t?.freezeRows ?? 0, r = t?.freezeCols ?? 0, i = (t) => Math.round(t * e), a = i(50), o = i(22), s = 0;
		if (t) for (let e = 1; e <= n; e++) s += i($(t.rowHeights[e] ?? t.defaultRowHeight));
		let c = 0;
		if (t) for (let e = 1; e <= r; e++) c += i(Q(t.colWidths[e] ?? t.defaultColWidth, Z(t)));
		let l, u, d, f, p = 1, m = 1;
		if (this.selectionMode === "all") l = a, u = o, d = this.canvasArea.clientWidth - a, f = this.canvasArea.clientHeight - o;
		else if (this.selectionMode === "rows") {
			p = Math.min(this.anchorCell.row, this.activeCell.row);
			let e = Math.max(this.anchorCell.row, this.activeCell.row), t = this.getCellRect(p, 1), n = this.getCellRect(e, 1);
			if (!t || !n) return;
			l = a, u = t.y, d = this.canvasArea.clientWidth - a, f = n.y + n.h - t.y;
		} else if (this.selectionMode === "cols") {
			m = Math.min(this.anchorCell.col, this.activeCell.col);
			let e = Math.max(this.anchorCell.col, this.activeCell.col), t = this.getCellRect(1, m), n = this.getCellRect(1, e);
			if (!t || !n) return;
			l = t.x, u = o, d = n.x + n.w - t.x, f = this.canvasArea.clientHeight - o;
		} else {
			p = Math.min(this.anchorCell.row, this.activeCell.row);
			let e = Math.max(this.anchorCell.row, this.activeCell.row);
			m = Math.min(this.anchorCell.col, this.activeCell.col);
			let t = Math.max(this.anchorCell.col, this.activeCell.col), n = this.getCellRect(p, m), r = this.getCellRect(e, t);
			if (!n || !r) return;
			l = n.x, u = n.y, d = r.x + r.w - n.x, f = r.y + r.h - n.y;
		}
		l < a && (d -= a - l, l = a), u < o && (f -= o - u, u = o);
		let h = a + c, g = o + s;
		if (m > r && l < h && (d -= h - l, l = h), p > n && u < g && (f -= g - u, u = g), d <= 0 || f <= 0) return;
		let _ = this.screenX(l, d), { border: v, background: y } = ra(this.opts.selectionColor ?? $i), b = document.createElement("div");
		b.style.cssText = `position:absolute;left:${_}px;top:${u}px;width:${d}px;height:${f}px;box-sizing:border-box;border:${v};background:${y};pointer-events:none;`, this.selectionOverlay.appendChild(b), this.maybeDrawValidationDropdown();
	}
	maybeDrawValidationDropdown() {
		if (this.validationArrowRect = null, this.selectionMode !== "cells") return;
		let e = this.currentWorksheet, t = this.activeCell;
		if (!e || !t || !ki(e.dataValidations, t.row, t.col)) return;
		let n = this.getCellRect(t.row, t.col);
		if (!n) return;
		let r = this.opts.cellScale ?? 1, i = Math.round(50 * r), a = Math.round(22 * r), o = Math.max(14, Math.min(n.h, 22 * r)), s = n.x + n.w, c = n.y;
		if (s + o <= i || c + o <= a) return;
		let l = this.screenX(s, o), u = document.createElement("div");
		u.setAttribute("data-xlsx-validation-dropdown", ""), u.style.cssText = `position:absolute;left:${l}px;top:${c}px;width:${o}px;height:${o}px;box-sizing:border-box;display:flex;align-items:center;justify-content:center;background:#f0f0f0;border:1px solid #7f7f7f;pointer-events:none;`;
		let d = Math.max(4, Math.round(o * .42));
		u.innerHTML = `<svg width="${d}" height="${d}" viewBox="0 0 10 6" aria-hidden="true"><path d="M0 0 L10 0 L5 6 Z" fill="#333"/></svg>`, this.selectionOverlay.appendChild(u), this.validationArrowRect = {
			x: l,
			y: c,
			w: o,
			h: o
		}, this.validationPanel.style.display !== "none" && (this.validationPanelKey === `${t.row}:${t.col}` ? this.positionValidationPanel() : this.hideValidationPanel());
	}
	updateFindOverlay() {
		this.findOverlay.innerHTML = "";
		let e = this.currentWorksheet;
		if (!e) return;
		let t = this.opts.cellScale ?? 1, n = (e) => Math.round(e * t), r = n(50), i = n(22), a = e.freezeRows ?? 0, o = e.freezeCols ?? 0, s = 0;
		for (let t = 1; t <= o; t++) s += n(Q(e.colWidths[t] ?? e.defaultColWidth, Z(e)));
		let c = 0;
		for (let t = 1; t <= a; t++) c += n($(e.rowHeights[t] ?? e.defaultRowHeight));
		let l = r + s, u = i + c, d = ra("#ffb300"), f = ra("#fb8c00");
		for (let e of this._find.sheetHighlights(this.currentSheet)) {
			let t = this.getCellRect(e.row, e.col);
			if (!t) continue;
			let { x: n, y: s, w: c, h: p } = t;
			if (n < r && (c -= r - n, n = r), s < i && (p -= i - s, s = i), e.col > o && n < l && (c -= l - n, n = l), e.row > a && s < u && (p -= u - s, s = u), c <= 0 || p <= 0) continue;
			let m = this.screenX(n, c), { border: h, background: g } = e.active ? f : d, _ = document.createElement("div");
			_.style.cssText = `position:absolute;left:${m}px;top:${s}px;width:${c}px;height:${p}px;box-sizing:border-box;border:${h};background:${g};pointer-events:none;`, this.findOverlay.appendChild(_);
		}
	}
	async findText(e, t = {}) {
		if (!this.wb) return [];
		let n = await this._find.find(e, t);
		return this.updateFindOverlay(), n;
	}
	async findNext() {
		return this._activateMatch(this._find.next());
	}
	async findPrev() {
		return this._activateMatch(this._find.prev());
	}
	clearFind() {
		this._find.invalidate(), this.updateFindOverlay();
	}
	async _activateMatch(e) {
		if (!e) return this.updateFindOverlay(), null;
		let { sheet: t, row: n, col: r } = e.location;
		return t !== this.currentSheet && await this.goToSheet(t), this._scrollCellIntoView(n, r), this.updateFindOverlay(), e;
	}
	_scrollCellIntoView(e, t) {
		let n = this.currentWorksheet;
		if (!n) return;
		let r = this.opts.cellScale ?? 1, i = Z(n), a = aa(n, i), o = n.freezeRows ?? 0, s = n.freezeCols ?? 0;
		if (e > o) {
			let t = Math.round(22 * r), i = 0;
			for (let e = 1; e <= o; e++) i += Math.round($(n.rowHeights[e] ?? n.defaultRowHeight) * r);
			let s = t + i, c = this.canvasArea.clientHeight, l = a.row.offsetOf(e) - a.row.offsetOf(o + 1), u = $(n.rowHeights[e] ?? n.defaultRowHeight), d = s + (l * r - this.scrollHost.scrollTop), f = d + u * r;
			d < s ? this.scrollHost.scrollTop = l * r : f > c && (this.scrollHost.scrollTop = l * r - (c - s - u * r));
		}
		if (t > s) {
			let e = Math.round(50 * r), o = 0;
			for (let e = 1; e <= s; e++) o += Math.round(Q(n.colWidths[e] ?? n.defaultColWidth, i) * r);
			let c = e + o, l = this.canvasArea.clientWidth, u = a.col.offsetOf(t) - a.col.offsetOf(s + 1), d = Q(n.colWidths[t] ?? n.defaultColWidth, i), f = c + (u * r - this.effectiveScrollLeft), p = f + d * r, m = this.effectiveScrollLeft;
			f < c ? m = u * r : p > l && (m = u * r - (l - c - d * r)), m = Math.max(0, m), this.effectiveH = m, this.scrollHost.scrollLeft = this.isRtl ? Math.max(0, this.maxScrollLeft - m) : m;
		}
	}
	toggleValidationPanel() {
		let e = this.currentWorksheet, t = this.activeCell;
		if (!e || !t) return;
		let n = `${t.row}:${t.col}`;
		if (this.validationPanelKey === n && this.validationPanel.style.display !== "none") {
			this.hideValidationPanel();
			return;
		}
		let r = ki(e.dataValidations, t.row, t.col);
		r && this.openValidationPanel(t, r.formula1);
	}
	async openValidationPanel(e, t) {
		let n;
		try {
			n = await this.workbook.resolveValidationList(this.currentSheet, t);
		} catch {
			n = {
				kind: "formula",
				formula: t ?? ""
			};
		}
		let r = this.activeCell;
		!r || r.row !== e.row || r.col !== e.col || (this.validationPanelKey = `${e.row}:${e.col}`, this.renderValidationPanel(n), this.positionValidationPanel(), this.installValidationOutsideHandler());
	}
	renderValidationPanel(e) {
		let t = this.validationPanel;
		if (t.textContent = "", e.kind === "formula" || e.values.length === 0) {
			let n = document.createElement("div");
			n.style.cssText = "padding:4px 8px;color:#666;font-style:italic;white-space:pre-wrap;word-break:break-word;", n.textContent = e.kind === "formula" ? e.formula ? `= ${e.formula}` : "(no list)" : "(empty list)", t.appendChild(n);
			return;
		}
		for (let n of e.values) {
			let e = document.createElement("div");
			e.setAttribute("data-xlsx-validation-item", ""), e.style.cssText = "padding:3px 8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:default;", e.textContent = n, e.addEventListener("pointerenter", () => {
				e.style.background = "#cfe3ff";
			}), e.addEventListener("pointerleave", () => {
				e.style.background = "";
			}), t.appendChild(e);
		}
	}
	positionValidationPanel() {
		let e = this.activeCell;
		if (!e) return;
		let t = this.getCellRect(e.row, e.col);
		if (!t) return;
		let n = this.screenX(t.x, t.w);
		this.validationPanel.style.left = "-9999px", this.validationPanel.style.top = "-9999px", this.validationPanel.style.display = "block";
		let r = Ei({
			cell: {
				x: n,
				y: t.y,
				w: t.w,
				h: t.h
			},
			panel: {
				w: this.validationPanel.offsetWidth,
				h: this.validationPanel.offsetHeight
			},
			viewport: {
				w: this.canvasArea.clientWidth,
				h: this.canvasArea.clientHeight
			},
			rtl: this.isRtl
		});
		this.validationPanel.style.left = `${r.left}px`, this.validationPanel.style.top = `${r.top}px`;
	}
	installValidationOutsideHandler() {
		this.validationOutsideHandler || (this.validationOutsideHandler = (e) => {
			let t = e.target;
			if (t && this.validationPanel.contains(t)) return;
			let n = this.canvasArea.getBoundingClientRect(), r = e.clientX - n.left, i = e.clientY - n.top, a = this.validationArrowRect;
			a && r >= a.x && r <= a.x + a.w && i >= a.y && i <= a.y + a.h || this.hideValidationPanel();
		}, document.addEventListener("pointerdown", this.validationOutsideHandler, !0));
	}
	hideValidationPanel() {
		this.validationPanel.style.display = "none", this.validationPanelKey = null, this.validationOutsideHandler &&= (document.removeEventListener("pointerdown", this.validationOutsideHandler, !0), null);
	}
	buildCommentMap(e) {
		this.commentMap = /* @__PURE__ */ new Map();
		for (let t of e.comments ?? []) {
			let e = _n(t.cellRef);
			e && this.commentMap.set(`${e.row}:${e.col}`, t);
		}
	}
	buildHyperlinkMap(e) {
		this.hyperlinkMap = /* @__PURE__ */ new Map();
		for (let t of e.hyperlinks ?? []) this.hyperlinkMap.set(`${t.row}:${t.col}`, t);
	}
	hyperlinkAtCell(e) {
		return this.opts.enableHyperlinks === !1 ? null : this.hyperlinkMap.get(`${e.row}:${e.col}`) ?? null;
	}
	dispatchHyperlink(e) {
		let t = this.hyperlinkAtCell(e);
		if (!t) return !1;
		let n;
		if (t.url) n = {
			kind: "external",
			url: t.url
		};
		else if (t.location) n = {
			kind: "internal",
			ref: t.location
		};
		else return !1;
		let r = this.opts.onHyperlinkClick;
		return r ? (r(n), !0) : (n.kind === "external" ? ie(n.url) : this.navigateInternalHyperlink(n.ref), !0);
	}
	navigateInternalHyperlink(e) {
		let t = e.lastIndexOf("!");
		if (t < 0) return;
		let n = e.slice(0, t);
		n.startsWith("'") && n.endsWith("'") && (n = n.slice(1, -1).replace(/''/g, "'"));
		let r = this.sheetNames.indexOf(n);
		r >= 0 && this.goToSheet(r);
	}
	scheduleCommentPopup(e) {
		let t = `${e.row}:${e.col}`, n = this.commentMap.get(t);
		if (!n) {
			this.hideCommentPopup();
			return;
		}
		this.commentPopupKey !== t && (this.hideCommentPopup(), this.commentPopupKey = t, this.commentPopupTimer = setTimeout(() => {
			this.commentPopupTimer = null, this.renderCommentPopup(e, n);
		}, Vi));
	}
	renderCommentPopup(e, t) {
		let n = this.getCellRect(e.row, e.col);
		if (!n) return;
		if (this.commentPopup.textContent = "", t.author) {
			let e = document.createElement("div");
			e.style.cssText = "font-weight:bold;margin-bottom:2px;", e.textContent = t.author, this.commentPopup.appendChild(e);
		}
		let r = document.createElement("div");
		r.textContent = t.text, this.commentPopup.appendChild(r);
		let i = this.screenX(n.x, n.w);
		this.commentPopup.style.left = "-9999px", this.commentPopup.style.top = "-9999px", this.commentPopup.style.display = "block";
		let a = ji({
			cell: {
				x: i,
				y: n.y,
				w: n.w,
				h: n.h
			},
			popup: {
				w: this.commentPopup.offsetWidth,
				h: this.commentPopup.offsetHeight
			},
			viewport: {
				w: this.canvasArea.clientWidth,
				h: this.canvasArea.clientHeight
			},
			rtl: this.isRtl
		});
		this.commentPopup.style.left = `${a.left}px`, this.commentPopup.style.top = `${a.top}px`;
	}
	hideCommentPopup() {
		this.commentPopupTimer !== null && (clearTimeout(this.commentPopupTimer), this.commentPopupTimer = null), this.commentPopupKey = null, this.commentPopup.style.display = "none";
	}
	applyPointerSelection(e, t, n, r, i) {
		let a = this.getHeaderHit(e, t);
		if (a) {
			a.kind === "corner" ? (this.selectionMode = "all", this.anchorCell = {
				row: 1,
				col: 1
			}, this.activeCell = {
				row: 1,
				col: 1
			}, this.isSelecting = !1) : a.kind === "row" ? n && this.anchorCell && this.selectionMode === "rows" ? this.activeCell = {
				row: a.row,
				col: 1
			} : (this.selectionMode = "rows", this.anchorCell = {
				row: a.row,
				col: 1
			}, this.activeCell = {
				row: a.row,
				col: 1
			}, i && (this.isSelecting = !0, this.scrollHost.setPointerCapture(r))) : n && this.anchorCell && this.selectionMode === "cols" ? this.activeCell = {
				row: 1,
				col: a.col
			} : (this.selectionMode = "cols", this.anchorCell = {
				row: 1,
				col: a.col
			}, this.activeCell = {
				row: 1,
				col: a.col
			}, i && (this.isSelecting = !0, this.scrollHost.setPointerCapture(r))), this.updateSelectionOverlay(), this.renderCurrentSheet(), this.opts.onSelectionChange?.(this.selection);
			return;
		}
		let o = this.getCellAt(e, t);
		o && (n && this.anchorCell && this.selectionMode === "cells" ? this.activeCell = o : (this.selectionMode = "cells", this.anchorCell = o, this.activeCell = o), i && (this.isSelecting = !0, this.scrollHost.setPointerCapture(r)), this.updateSelectionOverlay(), this.renderCurrentSheet(), this.opts.onSelectionChange?.(this.selection));
	}
	setupSelectionEvents() {
		this.scrollHost.addEventListener("pointerdown", (e) => {
			if (e.button !== 0) return;
			let t = this.opts.resizable ?? !0 ? this.getResizeTarget(e.clientX, e.clientY) : null;
			if (t) {
				e.preventDefault(), this.resizeDrag = {
					...t,
					pointerId: e.pointerId
				}, this.scrollHost.setPointerCapture(e.pointerId), this.hideCommentPopup();
				return;
			}
			let n = this.validationArrowRect;
			if (n) {
				let t = this.canvasArea.getBoundingClientRect(), r = e.clientX - t.left, i = e.clientY - t.top;
				if (r >= n.x && r <= n.x + n.w && i >= n.y && i <= n.y + n.h) {
					e.preventDefault(), this.toggleValidationPanel();
					return;
				}
			}
			let r = this.scrollHost.getBoundingClientRect(), i = e.clientX - r.left - this.scrollHost.clientLeft, a = e.clientY - r.top - this.scrollHost.clientTop;
			if (i >= this.scrollHost.clientWidth || a >= this.scrollHost.clientHeight) return;
			let o = this.scrollHost.scrollWidth > this.scrollHost.clientWidth && this.scrollHost.clientHeight - a <= 16 || this.scrollHost.scrollHeight > this.scrollHost.clientHeight && this.scrollHost.clientWidth - i <= 16;
			if (e.pointerType !== "mouse" || o) {
				this.pendingTap = {
					x: e.clientX,
					y: e.clientY,
					shiftKey: e.shiftKey,
					pointerId: e.pointerId
				};
				return;
			}
			let s = this.getCellAt(e.clientX, e.clientY);
			this.pendingClick = s ? {
				x: e.clientX,
				y: e.clientY,
				pointerId: e.pointerId,
				cell: s
			} : null, this.applyPointerSelection(e.clientX, e.clientY, e.shiftKey, e.pointerId, !0);
		}), this.scrollHost.addEventListener("pointermove", (e) => {
			if (this.resizeDrag && this.resizeDrag.pointerId === e.pointerId) {
				e.preventDefault(), this.applyResize(e.clientX, e.clientY);
				return;
			}
			if (e.pointerType === "mouse" && !this.isSelecting && (this.opts.resizable ?? !0)) {
				let t = this.getResizeTarget(e.clientX, e.clientY);
				if (this.scrollHost.style.cursor = t ? t.kind === "col" ? "col-resize" : "row-resize" : "", t) {
					this.hideCommentPopup();
					return;
				}
			}
			if (this.pendingTap && this.pendingTap.pointerId === e.pointerId) {
				let t = e.clientX - this.pendingTap.x, n = e.clientY - this.pendingTap.y;
				t * t + n * n > 64 && (this.pendingTap = null);
			}
			if (this.pendingClick && this.pendingClick.pointerId === e.pointerId) {
				let t = e.clientX - this.pendingClick.x, n = e.clientY - this.pendingClick.y;
				t * t + n * n > 64 && (this.pendingClick = null);
			}
			if (e.pointerType === "mouse" && !this.isSelecting) {
				let t = this.getCellAt(e.clientX, e.clientY);
				t ? this.scheduleCommentPopup(t) : this.hideCommentPopup(), this.scrollHost.style.cursor = t && this.hyperlinkAtCell(t) ? "pointer" : "";
			}
			if (this.isSelecting) {
				if (this.selectionMode === "rows") {
					let t = this.getHeaderHit(e.clientX, e.clientY), n = t?.kind === "row" ? t.row : this.getCellAt(e.clientX, e.clientY)?.row;
					if (!n || n === this.activeCell?.row) return;
					this.activeCell = {
						row: n,
						col: 1
					};
				} else if (this.selectionMode === "cols") {
					let t = this.getHeaderHit(e.clientX, e.clientY), n = t?.kind === "col" ? t.col : this.getCellAt(e.clientX, e.clientY)?.col;
					if (!n || n === this.activeCell?.col) return;
					this.activeCell = {
						row: 1,
						col: n
					};
				} else {
					let t = this.getCellAt(e.clientX, e.clientY);
					if (!t || t.row === this.activeCell?.row && t.col === this.activeCell?.col) return;
					this.activeCell = t;
				}
				this.updateSelectionOverlay(), this.scheduleRender(), this.opts.onSelectionChange?.(this.selection);
			}
		}), this.scrollHost.addEventListener("pointerup", (e) => {
			if (this.resizeDrag && this.resizeDrag.pointerId === e.pointerId) {
				this.scrollHost.releasePointerCapture(e.pointerId), this.resizeDrag = null;
				return;
			}
			if (this.pendingTap && this.pendingTap.pointerId === e.pointerId) {
				let t = e.clientX - this.pendingTap.x, n = e.clientY - this.pendingTap.y;
				if (t * t + n * n <= 64) {
					if (this.applyPointerSelection(e.clientX, e.clientY, this.pendingTap.shiftKey, e.pointerId, !1), e.pointerType !== "mouse" && this.activeCell) {
						let e = `${this.activeCell.row}:${this.activeCell.col}`, t = this.commentMap.get(e);
						t ? (this.hideCommentPopup(), this.renderCommentPopup(this.activeCell, t)) : this.hideCommentPopup();
					}
					this.activeCell && this.dispatchHyperlink(this.activeCell);
				}
				this.pendingTap = null;
			}
			if (this.pendingClick && this.pendingClick.pointerId === e.pointerId) {
				let t = e.clientX - this.pendingClick.x, n = e.clientY - this.pendingClick.y, r = this.getCellAt(e.clientX, e.clientY);
				t * t + n * n <= 64 && r && r.row === this.pendingClick.cell.row && r.col === this.pendingClick.cell.col && this.dispatchHyperlink(this.pendingClick.cell), this.pendingClick = null;
			}
			this.isSelecting = !1;
		}), this.scrollHost.addEventListener("pointercancel", (e) => {
			this.resizeDrag && this.resizeDrag.pointerId === e.pointerId && (this.resizeDrag = null), this.pendingTap && this.pendingTap.pointerId === e.pointerId && (this.pendingTap = null), this.pendingClick && this.pendingClick.pointerId === e.pointerId && (this.pendingClick = null), this.isSelecting = !1;
		}), this.scrollHost.addEventListener("wheel", (e) => {
			if (!(e.ctrlKey || e.metaKey) || (e.preventDefault(), e.deltaY === 0)) return;
			let t = this.canvasArea.getBoundingClientRect(), n = e.clientX - t.left, r = e.clientY - t.top;
			this._pendingZoomAnchor = Number.isFinite(n) && Number.isFinite(r) ? {
				x: n,
				y: r
			} : null, this.setScale(U(this.opts.cellScale ?? 1, e.deltaY));
		}, { passive: !1 }), this.scrollHost.addEventListener("pointerleave", () => this.hideCommentPopup()), this.keydownHandler = (e) => {
			(e.ctrlKey || e.metaKey) && e.key === "c" ? this.copySelection() : e.key === "Escape" && this.validationPanel.style.display !== "none" && this.hideValidationPanel();
		}, document.addEventListener("keydown", this.keydownHandler);
	}
	buildTabs() {
		this.tabStrip.innerHTML = "", this.tabs = [], this.tabColors = this.workbook.tabColors, this.workbook.sheetNames.forEach((e, t) => {
			let n = document.createElement("button");
			n.textContent = e, n.title = e, n.style.cssText = this.tabCss(t, !1), n.addEventListener("click", () => this.showSheet(t)), this.tabStrip.appendChild(n), this.tabs.push(n);
		}), this.updateNavButtons();
	}
	makeNavButton(e, t, n) {
		let r = document.createElement("button");
		return r.textContent = e, r.setAttribute("aria-label", t), r.title = t, r.classList.add("xlsx-tab-nav"), r.style.cssText = this.navButtonStyle(!1), r.addEventListener("click", n), r;
	}
	navButtonStyle(e) {
		return e ? "flex:1;height:100%;padding:0;display:flex;align-items:center;justify-content:center;border:none;color:#666;font-size:9px;line-height:1;box-sizing:border-box;outline:none;opacity:0.3;cursor:default;pointer-events:none;" : "flex:1;height:100%;padding:0;display:flex;align-items:center;justify-content:center;border:none;color:#666;font-size:9px;line-height:1;box-sizing:border-box;outline:none;cursor:pointer;";
	}
	scrollTabs(e) {
		let t = this.tabStrip, n = t.scrollLeft, r = n + t.clientWidth, i = null;
		if (e === 1) for (let e of this.tabs) {
			let n = e.offsetLeft + e.offsetWidth;
			if (n > r + 1) {
				i = n - t.clientWidth;
				break;
			}
		}
		else for (let e = this.tabs.length - 1; e >= 0; e--) {
			let t = this.tabs[e].offsetLeft;
			if (t < n - 1) {
				i = t;
				break;
			}
		}
		i !== null && (t.scrollLeft = Math.max(0, i)), this.updateNavButtons();
	}
	updateNavButtons() {
		let e = this.tabStrip, t = e.scrollLeft <= 0, n = e.scrollLeft + e.clientWidth >= e.scrollWidth - 1;
		this.navPrev.style.cssText = this.navButtonStyle(t), this.navNext.style.cssText = this.navButtonStyle(n);
	}
	updateTabActive(e) {
		this.tabs.forEach((t, n) => {
			t.style.cssText = this.tabCss(n, n === e);
		});
		let t = this.tabs[e];
		if (t && t.offsetParent !== null) {
			let e = this.tabStrip, n = t.getBoundingClientRect(), r = e.getBoundingClientRect();
			n.left < r.left ? e.scrollLeft -= r.left - n.left : n.right > r.right && (e.scrollLeft += n.right - r.right);
		}
	}
	tabStyle(e, t) {
		let n = Ki - 2, r = Ki - 5, i = t ? `box-shadow:inset 0 -${e ? 2 : 3}px 0 0 ${t};` : "";
		return e ? `display:inline-block;flex:none;padding:0 14px;position:relative;border:1px solid #c8ccd0;border-bottom:none;border-radius:3px 3px 0 0;cursor:pointer;white-space:nowrap;max-width:160px;overflow:hidden;text-overflow:ellipsis;outline:none;box-sizing:border-box;height:${n}px;font-size:13px;background:#fff;color:#000;border-bottom:1px solid #fff;font-weight:600;top:1px;` + i : `display:inline-block;flex:none;padding:0 14px;position:relative;border:1px solid #c8ccd0;border-bottom:none;border-radius:3px 3px 0 0;cursor:pointer;white-space:nowrap;max-width:160px;overflow:hidden;text-overflow:ellipsis;outline:none;box-sizing:border-box;height:${r}px;font-size:11px;background:#e0e0e0;color:#555;` + i;
	}
	tabCss(e, t) {
		let n = this.tabStyle(t, this.tabColors[e]);
		return this._hiddenSheetMode !== "show" && this.wb?.isHidden(e) && (n += this._hiddenSheetMode === "skip" ? "display:none;" : `opacity:${Ji};`), n;
	}
	buildZoomControl() {
		let e = this.opts.zoomMin ?? .1, t = this.opts.zoomMax ?? 4, n = this.opts.cellScale ?? 1, r = document.createElement("div");
		r.style.cssText = "display:flex;align-items:center;flex-shrink:0;gap:2px;padding:0 10px;height:100%;color:#555;font-size:12px;user-select:none;";
		let i = (e, t, n) => {
			let r = document.createElement("button");
			return r.textContent = e, r.setAttribute("aria-label", t), r.title = t, r.style.cssText = "width:18px;height:18px;padding:0;border:none;background:transparent;color:#555;font-size:14px;line-height:1;cursor:pointer;border-radius:3px;", r.addEventListener("click", n), r;
		}, a = document.createElement("input");
		a.type = "range", a.min = "0", a.max = "100", a.step = "any", a.value = String(this.zoomScaleToPos(n, e, t)), a.setAttribute("aria-label", "Zoom"), a.title = "Zoom", a.classList.add("xlsx-zoom-slider"), a.style.cssText = "width:90px;cursor:pointer;", a.addEventListener("input", () => this.setScale(this.zoomPosToScale(Number(a.value), e, t)));
		let o = document.createElement("span");
		return o.textContent = `${Math.round(n * 100)}%`, o.style.cssText = "min-width:42px;margin-left:6px;text-align:right;font-variant-numeric:tabular-nums;", r.appendChild(i("−", "Zoom out", () => this.zoomOut())), r.appendChild(a), r.appendChild(i("+", "Zoom in", () => this.zoomIn())), r.appendChild(o), this.zoomSlider = a, this.zoomLabel = o, r;
	}
	zoomPosToScale(e, t, n) {
		return e <= 50 ? t + e / 50 * (1 - t) : 1 + (e - 50) / 50 * (n - 1);
	}
	zoomScaleToPos(e, t, n) {
		let r = Math.min(n, Math.max(t, e));
		return r <= 1 ? (r - t) / (1 - t) * 50 : 50 + (r - 1) / (n - 1) * 50;
	}
	setScale(e) {
		let t = this.opts.zoomMin ?? .1, n = this.opts.zoomMax ?? 4, r = Math.min(Math.round(n * 100), Math.max(Math.round(t * 100), Math.round(e * 100))), i = r / 100, a = this.opts.cellScale ?? 1, o = this._pendingZoomAnchor;
		if (this._pendingZoomAnchor = null, i !== a) {
			if (this.opts.cellScale = i, this.zoomSlider && (this.zoomSlider.value = String(this.zoomScaleToPos(i, t, n))), this.zoomLabel && (this.zoomLabel.textContent = `${r}%`), this.navGroup.style.width = `${Math.round(50 * i)}px`, this.currentWorksheet) {
				let e = this.effectiveScrollLeft, t = this.scrollHost.scrollTop;
				if (this.layoutGutters(), this.updateSpacerSize(this.currentWorksheet), o) {
					let n = Math.max(0, this.scrollHost.scrollHeight - this.scrollHost.clientHeight);
					this.scrollHost.scrollTop = oe(t, o.y, a, i, { maxScroll: n });
					let r = this.screenX(o.x, 0), s = this.maxScrollLeft, c = oe(e, r, a, i, { maxScroll: s });
					this.effectiveH = c, this.scrollHost.scrollLeft = this.isRtl ? Math.max(0, s - c) : c;
				} else this.effectiveH = e, this.isRtl && (this.scrollHost.scrollLeft = Math.max(0, this.maxScrollLeft - e));
			}
			this.renderCurrentSheet(), this.updateSelectionOverlay(), this.updateFindOverlay(), this.updateNavButtons(), this.opts.onScaleChange?.(i);
		}
	}
	getScale() {
		return this.opts.cellScale ?? 1;
	}
	zoomIn() {
		this.setScale(V(this.getScale()));
	}
	zoomOut() {
		this.setScale(ue(this.getScale()));
	}
	fitWidth() {
		this._fit("width");
	}
	fitPage() {
		this._fit("page");
	}
	_fit(e) {
		let t = this.currentWorksheet;
		if (!t) return;
		let { width: n, height: r } = this._naturalContentExtent(t), i = B({
			contentWidth: n,
			contentHeight: r,
			containerWidth: this.canvasArea.clientWidth,
			containerHeight: this.canvasArea.clientHeight
		}, e);
		i <= 0 || this.setScale(i);
	}
	_naturalContentExtent(e) {
		let t = Z(e), n = Math.max(50, e.freezeRows ?? 0), r = Math.max(26, e.freezeCols ?? 0);
		for (let t of e.rows) {
			t.index > n && (n = t.index);
			for (let e of t.cells) e.col > r && (r = e.col);
		}
		let i = 50;
		for (let n = 1; n <= r; n++) i += Q(e.colWidths[n] ?? e.defaultColWidth, t);
		let a = 22;
		for (let t = 1; t <= n; t++) a += $(e.rowHeights[t] ?? e.defaultRowHeight);
		return {
			width: i,
			height: a
		};
	}
	updateSpacerSize(e) {
		let t = this.opts.cellScale ?? 1, n = Z(e), r = (e) => Math.round(e * t), i = e.freezeRows ?? 0, a = e.freezeCols ?? 0, o = Math.max(50, i), s = Math.max(26, a);
		for (let t of e.rows) {
			t.index > o && (o = t.index);
			for (let e of t.cells) e.col > s && (s = e.col);
		}
		o += 30, s += 10;
		let c = r(50);
		for (let t = 1; t <= s; t++) c += r(Q(e.colWidths[t] ?? e.defaultColWidth, n));
		let l = r(22);
		for (let t = 1; t <= o; t++) l += r($(e.rowHeights[t] ?? e.defaultRowHeight));
		this.spacer.style.width = `${c}px`, this.spacer.style.height = `${l}px`;
	}
	scheduleRender() {
		if (this._rafId === null) {
			if (typeof requestAnimationFrame != "function") {
				this.renderCurrentSheet();
				return;
			}
			this._rafId = requestAnimationFrame(() => {
				this._rafId = null, this.renderCurrentSheet();
			});
		}
	}
	async renderCurrentSheet() {
		try {
			await this._renderCurrentSheet();
		} catch (e) {
			this._reportRenderError(e);
		}
	}
	_reportRenderError(e) {
		if (this._destroyed) return;
		let t = e instanceof Error ? e : Error(String(e));
		this.opts.onError ? this.opts.onError(t) : console.error("[ooxml] XlsxViewer render failed:", t);
	}
	async _renderCurrentSheet() {
		if (!this.currentWorksheet) return;
		let e = this.currentWorksheet, t = this.canvasArea.clientWidth, n = this.canvasArea.clientHeight;
		if (t <= 0 || n <= 0) return;
		let r = ++this._renderSeq, i = this.opts.cellScale ?? 1, a = window.devicePixelRatio ?? 1, o = e.freezeRows ?? 0, s = e.freezeCols ?? 0, c = 0;
		for (let t = 1; t <= s; t++) c += Q(e.colWidths[t] ?? e.defaultColWidth, Z(e));
		let l = 0;
		for (let t = 1; t <= o; t++) l += $(e.rowHeights[t] ?? e.defaultRowHeight);
		let u = this.effectiveScrollLeft / i, d = this.scrollHost.scrollTop / i, f = aa(e, Z(e)), { index: p, partial: m } = f.col.indexAt(u + f.col.offsetOf(s + 1)), { index: h, partial: g } = f.row.indexAt(d + f.row.offsetOf(o + 1)), _ = t / i - 50 - c, v = n / i - 22 - l, y = 0;
		{
			let t = -m, n = p;
			for (; t < _ + m && n <= 16384;) t += Q(e.colWidths[n] ?? e.defaultColWidth, Z(e)), y++, n++;
			y += 2;
		}
		let b = 0;
		{
			let t = -g, n = h;
			for (; t < v + g && n <= 1048576;) t += $(e.rowHeights[n] ?? e.defaultRowHeight), b++, n++;
			b += 2;
		}
		let x = {
			row: h,
			col: p,
			rows: b,
			cols: y
		}, { selectedRowRange: S, selectedColRange: C } = this.computeHeaderHighlight(), w = {
			width: t,
			height: n,
			dpr: a,
			cellScale: i,
			scrollOffsetX: m,
			scrollOffsetY: g,
			freezeRows: o,
			freezeCols: s,
			selectedRowRange: S,
			selectedColRange: C
		};
		if (this._mode === "worker") {
			let e = this.wireSizeOverrides(), i = await this.workbook.renderViewportToBitmap(this.currentSheet, x, e ? {
				...w,
				sizeOverrides: e
			} : w);
			if (r !== this._renderSeq) {
				i.close();
				return;
			}
			this.canvas.width !== i.width && (this.canvas.width = i.width), this.canvas.height !== i.height && (this.canvas.height = i.height);
			let a = `${t}px`, o = `${n}px`;
			this.canvas.style.width !== a && (this.canvas.style.width = a), this.canvas.style.height !== o && (this.canvas.style.height = o), this._bitmapCtx?.transferFromImageBitmap(i);
		} else await this.workbook.renderViewport(this.canvas, this.currentSheet, x, w);
		this.renderGutters();
	}
	computeHeaderHighlight() {
		if (!this.anchorCell || !this.activeCell) return {
			selectedRowRange: null,
			selectedColRange: null
		};
		let e = 2 ** 53 - 1, t = Math.min(this.anchorCell.row, this.activeCell.row), n = Math.max(this.anchorCell.row, this.activeCell.row), r = Math.min(this.anchorCell.col, this.activeCell.col), i = Math.max(this.anchorCell.col, this.activeCell.col);
		switch (this.selectionMode) {
			case "cells": return {
				selectedRowRange: {
					start: t,
					end: n,
					strong: !1
				},
				selectedColRange: {
					start: r,
					end: i,
					strong: !1
				}
			};
			case "rows": return {
				selectedRowRange: {
					start: t,
					end: n,
					strong: !0
				},
				selectedColRange: {
					start: 1,
					end: e,
					strong: !1
				}
			};
			case "cols": return {
				selectedRowRange: {
					start: 1,
					end: e,
					strong: !1
				},
				selectedColRange: {
					start: r,
					end: i,
					strong: !0
				}
			};
			case "all": return {
				selectedRowRange: {
					start: 1,
					end: e,
					strong: !0
				},
				selectedColRange: {
					start: 1,
					end: e,
					strong: !0
				}
			};
		}
	}
	get sheetNames() {
		return this.wb?.sheetNames ?? [];
	}
	get canvasElement() {
		return this.canvas;
	}
	destroy() {
		this._destroyed = !0, this._loadGen++, this.resizeObserver?.disconnect(), this._rafId !== null && typeof cancelAnimationFrame == "function" && (cancelAnimationFrame(this._rafId), this._rafId = null), this._renderSeq++, this.hideCommentPopup(), this.hideValidationPanel(), this.keydownHandler && document.removeEventListener("keydown", this.keydownHandler), this._find.invalidate(), this.wb?.destroy(), this.wrapper.remove();
	}
}, sa = /* @__PURE__ */ P({
	OoxmlError: () => F,
	XlsxViewer: () => oa,
	XlsxWorkbook: () => Di,
	autoResize: () => H,
	openExternalHyperlink: () => ie,
	resolveSharedStrings: () => Ci
});
//#endregion
export { Ci as i, oa as n, Di as r, sa as t };
