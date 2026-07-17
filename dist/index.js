//#region node_modules/@vue/shared/dist/shared.esm-bundler.js
// @__NO_SIDE_EFFECTS__
function e(e) {
	let t = /* @__PURE__ */ Object.create(null);
	for (let n of e.split(",")) t[n] = 1;
	return (e) => e in t;
}
var t = {}, n = [], r = () => {}, i = () => !1, a = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97), o = (e) => e.startsWith("onUpdate:"), s = Object.assign, c = (e, t) => {
	let n = e.indexOf(t);
	n > -1 && e.splice(n, 1);
}, l = Object.prototype.hasOwnProperty, u = (e, t) => l.call(e, t), d = Array.isArray, f = (e) => x(e) === "[object Map]", p = (e) => x(e) === "[object Set]", m = (e) => x(e) === "[object Date]", h = (e) => typeof e == "function", g = (e) => typeof e == "string", _ = (e) => typeof e == "symbol", v = (e) => typeof e == "object" && !!e, y = (e) => (v(e) || h(e)) && h(e.then) && h(e.catch), b = Object.prototype.toString, x = (e) => b.call(e), ee = (e) => x(e).slice(8, -1), S = (e) => x(e) === "[object Object]", C = (e) => g(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e, te = /* @__PURE__ */ e(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"), ne = (e) => {
	let t = /* @__PURE__ */ Object.create(null);
	return ((n) => t[n] || (t[n] = e(n)));
}, re = /-\w/g, w = ne((e) => e.replace(re, (e) => e.slice(1).toUpperCase())), ie = /\B([A-Z])/g, T = ne((e) => e.replace(ie, "-$1").toLowerCase()), ae = ne((e) => e.charAt(0).toUpperCase() + e.slice(1)), oe = ne((e) => e ? `on${ae(e)}` : ""), se = (e, t) => !Object.is(e, t), ce = (e, ...t) => {
	for (let n = 0; n < e.length; n++) e[n](...t);
}, E = (e, t, n, r = !1) => {
	Object.defineProperty(e, t, {
		configurable: !0,
		enumerable: !1,
		writable: r,
		value: n
	});
}, le = (e) => {
	let t = parseFloat(e);
	return isNaN(t) ? e : t;
}, ue, de = () => ue ||= typeof globalThis < "u" ? globalThis : typeof self < "u" ? self : typeof window < "u" ? window : typeof global < "u" ? global : {};
function fe(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) {
			let r = e[n], i = g(r) ? ge(r) : fe(r);
			if (i) for (let e in i) t[e] = i[e];
		}
		return t;
	} else if (g(e) || v(e)) return e;
}
var pe = /;(?![^(]*\))/g, me = /:([^]+)/, he = /\/\*[^]*?\*\//g;
function ge(e) {
	let t = {};
	return e.replace(he, "").split(pe).forEach((e) => {
		if (e) {
			let n = e.split(me);
			n.length > 1 && (t[n[0].trim()] = n[1].trim());
		}
	}), t;
}
function D(e) {
	let t = "";
	if (g(e)) t = e;
	else if (d(e)) for (let n = 0; n < e.length; n++) {
		let r = D(e[n]);
		r && (t += r + " ");
	}
	else if (v(e)) for (let n in e) e[n] && (t += n + " ");
	return t.trim();
}
var _e = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly", ve = /* @__PURE__ */ e(_e);
_e + "";
function ye(e) {
	return !!e || e === "";
}
function be(e, t) {
	if (e.length !== t.length) return !1;
	let n = !0;
	for (let r = 0; n && r < e.length; r++) n = xe(e[r], t[r]);
	return n;
}
function xe(e, t) {
	if (e === t) return !0;
	let n = m(e), r = m(t);
	if (n || r) return n && r ? e.getTime() === t.getTime() : !1;
	if (n = _(e), r = _(t), n || r) return e === t;
	if (n = d(e), r = d(t), n || r) return n && r ? be(e, t) : !1;
	if (n = v(e), r = v(t), n || r) {
		if (!n || !r || Object.keys(e).length !== Object.keys(t).length) return !1;
		for (let n in e) {
			let r = e.hasOwnProperty(n), i = t.hasOwnProperty(n);
			if (r && !i || !r && i || !xe(e[n], t[n])) return !1;
		}
	}
	return String(e) === String(t);
}
function Se(e, t) {
	return e.findIndex((e) => xe(e, t));
}
var Ce = (e) => !!(e && e.__v_isRef === !0), O = (e) => g(e) ? e : e == null ? "" : d(e) || v(e) && (e.toString === b || !h(e.toString)) ? Ce(e) ? O(e.value) : JSON.stringify(e, we, 2) : String(e), we = (e, t) => Ce(t) ? we(e, t.value) : f(t) ? { [`Map(${t.size})`]: [...t.entries()].reduce((e, [t, n], r) => (e[Te(t, r) + " =>"] = n, e), {}) } : p(t) ? { [`Set(${t.size})`]: [...t.values()].map((e) => Te(e)) } : _(t) ? Te(t) : v(t) && !d(t) && !S(t) ? String(t) : t, Te = (e, t = "") => _(e) ? `Symbol(${e.description ?? t})` : e, k, Ee = class {
	constructor(e = !1) {
		this.detached = e, this._active = !0, this._on = 0, this.effects = [], this.cleanups = [], this._isPaused = !1, this._warnOnRun = !0, this.__v_skip = !0, !e && k && (k.active ? (this.parent = k, this.index = (k.scopes ||= []).push(this) - 1) : (this._active = !1, this._warnOnRun = !1));
	}
	get active() {
		return this._active;
	}
	pause() {
		if (this._active) {
			this._isPaused = !0;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].pause();
			}
			for (e = 0, t = this.effects.length; e < t; e++) this.effects[e].pause();
		}
	}
	resume() {
		if (this._active && this._isPaused) {
			this._isPaused = !1;
			let e, t;
			if (this.scopes) {
				let n = this.scopes.slice();
				for (e = 0, t = n.length; e < t; e++) n[e].resume();
			}
			let n = this.effects.slice();
			for (e = 0, t = n.length; e < t; e++) n[e].resume();
		}
	}
	run(e) {
		if (this._active) {
			let t = k;
			try {
				return k = this, e();
			} finally {
				k = t;
			}
		}
	}
	on() {
		++this._on === 1 && (this.prevScope = k, k = this);
	}
	off() {
		if (this._on > 0 && --this._on === 0) {
			if (k === this) k = this.prevScope;
			else {
				let e = k;
				for (; e;) {
					if (e.prevScope === this) {
						e.prevScope = this.prevScope;
						break;
					}
					e = e.prevScope;
				}
			}
			this.prevScope = void 0;
		}
	}
	stop(e) {
		if (this._active) {
			this._active = !1;
			let t, n;
			for (t = 0, n = this.effects.length; t < n; t++) this.effects[t].stop();
			for (this.effects.length = 0, t = 0, n = this.cleanups.length; t < n; t++) this.cleanups[t]();
			if (this.cleanups.length = 0, this.scopes) {
				let e = this.scopes.slice();
				for (t = 0, n = e.length; t < n; t++) e[t].stop(!0);
				this.scopes.length = 0;
			}
			if (!this.detached && this.parent && !e) {
				let e = this.parent.scopes.pop();
				e && e !== this && (this.parent.scopes[this.index] = e, e.index = this.index);
			}
			this.parent = void 0;
		}
	}
};
function De() {
	return k;
}
var A, Oe = /* @__PURE__ */ new WeakSet(), ke = class {
	constructor(e) {
		this.fn = e, this.deps = void 0, this.depsTail = void 0, this.flags = 5, this.next = void 0, this.cleanup = void 0, this.scheduler = void 0, k && (k.active ? k.effects.push(this) : this.flags &= -2);
	}
	pause() {
		this.flags |= 64;
	}
	resume() {
		this.flags & 64 && (this.flags &= -65, Oe.has(this) && (Oe.delete(this), this.trigger()));
	}
	notify() {
		this.flags & 2 && !(this.flags & 32) || this.flags & 8 || Ne(this);
	}
	run() {
		if (!(this.flags & 1)) return this.fn();
		this.flags |= 2, Ke(this), Ie(this);
		let e = A, t = He;
		A = this, He = !0;
		try {
			return this.fn();
		} finally {
			Le(this), A = e, He = t, this.flags &= -3;
		}
	}
	stop() {
		if (this.flags & 1) {
			for (let e = this.deps; e; e = e.nextDep) Be(e);
			this.deps = this.depsTail = void 0, Ke(this), this.onStop && this.onStop(), this.flags &= -2;
		}
	}
	trigger() {
		this.flags & 64 ? Oe.add(this) : this.scheduler ? this.scheduler() : this.runIfDirty();
	}
	runIfDirty() {
		Re(this) && this.run();
	}
	get dirty() {
		return Re(this);
	}
}, Ae = 0, je, Me;
function Ne(e, t = !1) {
	if (e.flags |= 8, t) {
		e.next = Me, Me = e;
		return;
	}
	e.next = je, je = e;
}
function Pe() {
	Ae++;
}
function Fe() {
	if (--Ae > 0) return;
	if (Me) {
		let e = Me;
		for (Me = void 0; e;) {
			let t = e.next;
			e.next = void 0, e.flags &= -9, e = t;
		}
	}
	let e;
	for (; je;) {
		let t = je;
		for (je = void 0; t;) {
			let n = t.next;
			if (t.next = void 0, t.flags &= -9, t.flags & 1) try {
				t.trigger();
			} catch (t) {
				e ||= t;
			}
			t = n;
		}
	}
	if (e) throw e;
}
function Ie(e) {
	for (let t = e.deps; t; t = t.nextDep) t.version = -1, t.prevActiveLink = t.dep.activeLink, t.dep.activeLink = t;
}
function Le(e) {
	let t, n = e.depsTail, r = n;
	for (; r;) {
		let e = r.prevDep;
		r.version === -1 ? (r === n && (n = e), Be(r), Ve(r)) : t = r, r.dep.activeLink = r.prevActiveLink, r.prevActiveLink = void 0, r = e;
	}
	e.deps = t, e.depsTail = n;
}
function Re(e) {
	for (let t = e.deps; t; t = t.nextDep) if (t.dep.version !== t.version || t.dep.computed && (ze(t.dep.computed) || t.dep.version !== t.version)) return !0;
	return !!e._dirty;
}
function ze(e) {
	if (e.flags & 4 && !(e.flags & 16) || (e.flags &= -17, e.globalVersion === qe) || (e.globalVersion = qe, !e.isSSR && e.flags & 128 && (!e.deps && !e._dirty || !Re(e)))) return;
	e.flags |= 2;
	let t = e.dep, n = A, r = He;
	A = e, He = !0;
	try {
		Ie(e);
		let n = e.fn(e._value);
		(t.version === 0 || se(n, e._value)) && (e.flags |= 128, e._value = n, t.version++);
	} catch (e) {
		throw t.version++, e;
	} finally {
		A = n, He = r, Le(e), e.flags &= -3;
	}
}
function Be(e, t = !1) {
	let { dep: n, prevSub: r, nextSub: i } = e;
	if (r && (r.nextSub = i, e.prevSub = void 0), i && (i.prevSub = r, e.nextSub = void 0), n.subs === e && (n.subs = r, !r && n.computed)) {
		n.computed.flags &= -5;
		for (let e = n.computed.deps; e; e = e.nextDep) Be(e, !0);
	}
	!t && !--n.sc && n.map && n.map.delete(n.key);
}
function Ve(e) {
	let { prevDep: t, nextDep: n } = e;
	t && (t.nextDep = n, e.prevDep = void 0), n && (n.prevDep = t, e.nextDep = void 0);
}
var He = !0, Ue = [];
function We() {
	Ue.push(He), He = !1;
}
function Ge() {
	let e = Ue.pop();
	He = e === void 0 || e;
}
function Ke(e) {
	let { cleanup: t } = e;
	if (e.cleanup = void 0, t) {
		let e = A;
		A = void 0;
		try {
			t();
		} finally {
			A = e;
		}
	}
}
var qe = 0, Je = class {
	constructor(e, t) {
		this.sub = e, this.dep = t, this.version = t.version, this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
	}
}, Ye = class {
	constructor(e) {
		this.computed = e, this.version = 0, this.activeLink = void 0, this.subs = void 0, this.map = void 0, this.key = void 0, this.sc = 0, this.__v_skip = !0;
	}
	track(e) {
		if (!A || !He || A === this.computed) return;
		let t = this.activeLink;
		if (t === void 0 || t.sub !== A) t = this.activeLink = new Je(A, this), A.deps ? (t.prevDep = A.depsTail, A.depsTail.nextDep = t, A.depsTail = t) : A.deps = A.depsTail = t, Xe(t);
		else if (t.version === -1 && (t.version = this.version, t.nextDep)) {
			let e = t.nextDep;
			e.prevDep = t.prevDep, t.prevDep && (t.prevDep.nextDep = e), t.prevDep = A.depsTail, t.nextDep = void 0, A.depsTail.nextDep = t, A.depsTail = t, A.deps === t && (A.deps = e);
		}
		return t;
	}
	trigger(e) {
		this.version++, qe++, this.notify(e);
	}
	notify(e) {
		Pe();
		try {
			for (let e = this.subs; e; e = e.prevSub) e.sub.notify() && e.sub.dep.notify();
		} finally {
			Fe();
		}
	}
};
function Xe(e) {
	if (e.dep.sc++, e.sub.flags & 4) {
		let t = e.dep.computed;
		if (t && !e.dep.subs) {
			t.flags |= 20;
			for (let e = t.deps; e; e = e.nextDep) Xe(e);
		}
		let n = e.dep.subs;
		n !== e && (e.prevSub = n, n && (n.nextSub = e)), e.dep.subs = e;
	}
}
var Ze = /* @__PURE__ */ new WeakMap(), Qe = /* @__PURE__ */ Symbol(""), $e = /* @__PURE__ */ Symbol(""), et = /* @__PURE__ */ Symbol("");
function j(e, t, n) {
	if (He && A) {
		let t = Ze.get(e);
		t || Ze.set(e, t = /* @__PURE__ */ new Map());
		let r = t.get(n);
		r || (t.set(n, r = new Ye()), r.map = t, r.key = n), r.track();
	}
}
function tt(e, t, n, r, i, a) {
	let o = Ze.get(e);
	if (!o) {
		qe++;
		return;
	}
	let s = (e) => {
		e && e.trigger();
	};
	if (Pe(), t === "clear") o.forEach(s);
	else {
		let i = d(e), a = i && C(n);
		if (i && n === "length") {
			let e = Number(r);
			o.forEach((t, n) => {
				(n === "length" || n === et || !_(n) && n >= e) && s(t);
			});
		} else switch ((n !== void 0 || o.has(void 0)) && s(o.get(n)), a && s(o.get(et)), t) {
			case "add":
				i ? a && s(o.get("length")) : (s(o.get(Qe)), f(e) && s(o.get($e)));
				break;
			case "delete":
				i || (s(o.get(Qe)), f(e) && s(o.get($e)));
				break;
			case "set":
				f(e) && s(o.get(Qe));
				break;
		}
	}
	Fe();
}
function nt(e) {
	let t = /* @__PURE__ */ M(e);
	return t === e ? t : (j(t, "iterate", et), /* @__PURE__ */ Vt(e) ? t : t.map(Wt));
}
function rt(e) {
	return j(e = /* @__PURE__ */ M(e), "iterate", et), e;
}
function it(e, t) {
	return /* @__PURE__ */ Bt(e) ? Gt(/* @__PURE__ */ zt(e) ? Wt(t) : t) : Wt(t);
}
var at = {
	__proto__: null,
	[Symbol.iterator]() {
		return ot(this, Symbol.iterator, (e) => it(this, e));
	},
	concat(...e) {
		return nt(this).concat(...e.map((e) => d(e) ? nt(e) : e));
	},
	entries() {
		return ot(this, "entries", (e) => (e[1] = it(this, e[1]), e));
	},
	every(e, t) {
		return ct(this, "every", e, t, void 0, arguments);
	},
	filter(e, t) {
		return ct(this, "filter", e, t, (e) => e.map((e) => it(this, e)), arguments);
	},
	find(e, t) {
		return ct(this, "find", e, t, (e) => it(this, e), arguments);
	},
	findIndex(e, t) {
		return ct(this, "findIndex", e, t, void 0, arguments);
	},
	findLast(e, t) {
		return ct(this, "findLast", e, t, (e) => it(this, e), arguments);
	},
	findLastIndex(e, t) {
		return ct(this, "findLastIndex", e, t, void 0, arguments);
	},
	forEach(e, t) {
		return ct(this, "forEach", e, t, void 0, arguments);
	},
	includes(...e) {
		return ut(this, "includes", e);
	},
	indexOf(...e) {
		return ut(this, "indexOf", e);
	},
	join(e) {
		return nt(this).join(e);
	},
	lastIndexOf(...e) {
		return ut(this, "lastIndexOf", e);
	},
	map(e, t) {
		return ct(this, "map", e, t, void 0, arguments);
	},
	pop() {
		return dt(this, "pop");
	},
	push(...e) {
		return dt(this, "push", e);
	},
	reduce(e, ...t) {
		return lt(this, "reduce", e, t);
	},
	reduceRight(e, ...t) {
		return lt(this, "reduceRight", e, t);
	},
	shift() {
		return dt(this, "shift");
	},
	some(e, t) {
		return ct(this, "some", e, t, void 0, arguments);
	},
	splice(...e) {
		return dt(this, "splice", e);
	},
	toReversed() {
		return nt(this).toReversed();
	},
	toSorted(e) {
		return nt(this).toSorted(e);
	},
	toSpliced(...e) {
		return nt(this).toSpliced(...e);
	},
	unshift(...e) {
		return dt(this, "unshift", e);
	},
	values() {
		return ot(this, "values", (e) => it(this, e));
	}
};
function ot(e, t, n) {
	let r = rt(e), i = r[t]();
	return r !== e && !/* @__PURE__ */ Vt(e) && (i._next = i.next, i.next = () => {
		let e = i._next();
		return e.done || (e.value = n(e.value)), e;
	}), i;
}
var st = Array.prototype;
function ct(e, t, n, r, i, a) {
	let o = rt(e), s = o !== e && !/* @__PURE__ */ Vt(e), c = o[t];
	if (c !== st[t]) {
		let t = c.apply(e, a);
		return s ? Wt(t) : t;
	}
	let l = n;
	o !== e && (s ? l = function(t, r) {
		return n.call(this, it(e, t), r, e);
	} : n.length > 2 && (l = function(t, r) {
		return n.call(this, t, r, e);
	}));
	let u = c.call(o, l, r);
	return s && i ? i(u) : u;
}
function lt(e, t, n, r) {
	let i = rt(e), a = i !== e && !/* @__PURE__ */ Vt(e), o = n, s = !1;
	i !== e && (a ? (s = r.length === 0, o = function(t, r, i) {
		return s && (s = !1, t = it(e, t)), n.call(this, t, it(e, r), i, e);
	}) : n.length > 3 && (o = function(t, r, i) {
		return n.call(this, t, r, i, e);
	}));
	let c = i[t](o, ...r);
	return s ? it(e, c) : c;
}
function ut(e, t, n) {
	let r = /* @__PURE__ */ M(e);
	j(r, "iterate", et);
	let i = r[t](...n);
	return (i === -1 || i === !1) && /* @__PURE__ */ Ht(n[0]) ? (n[0] = /* @__PURE__ */ M(n[0]), r[t](...n)) : i;
}
function dt(e, t, n = []) {
	We(), Pe();
	let r = (/* @__PURE__ */ M(e))[t].apply(e, n);
	return Fe(), Ge(), r;
}
var ft = /* @__PURE__ */ e("__proto__,__v_isRef,__isVue"), pt = new Set(/* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((e) => e !== "arguments" && e !== "caller").map((e) => Symbol[e]).filter(_));
function mt(e) {
	_(e) || (e = String(e));
	let t = /* @__PURE__ */ M(this);
	return j(t, "has", e), t.hasOwnProperty(e);
}
var ht = class {
	constructor(e = !1, t = !1) {
		this._isReadonly = e, this._isShallow = t;
	}
	get(e, t, n) {
		if (t === "__v_skip") return e.__v_skip;
		let r = this._isReadonly, i = this._isShallow;
		if (t === "__v_isReactive") return !r;
		if (t === "__v_isReadonly") return r;
		if (t === "__v_isShallow") return i;
		if (t === "__v_raw") return n === (r ? i ? Nt : Mt : i ? jt : At).get(e) || Object.getPrototypeOf(e) === Object.getPrototypeOf(n) ? e : void 0;
		let a = d(e);
		if (!r) {
			let e;
			if (a && (e = at[t])) return e;
			if (t === "hasOwnProperty") return mt;
		}
		let o = Reflect.get(e, t, /* @__PURE__ */ N(e) ? e : n);
		if ((_(t) ? pt.has(t) : ft(t)) || (r || j(e, "get", t), i)) return o;
		if (/* @__PURE__ */ N(o)) {
			let e = a && C(t) ? o : o.value;
			return r && v(e) ? /* @__PURE__ */ Lt(e) : e;
		}
		return v(o) ? r ? /* @__PURE__ */ Lt(o) : /* @__PURE__ */ Ft(o) : o;
	}
}, gt = class extends ht {
	constructor(e = !1) {
		super(!1, e);
	}
	set(e, t, n, r) {
		let i = e[t], a = d(e) && C(t);
		if (!this._isShallow) {
			let e = /* @__PURE__ */ Bt(i);
			if (!/* @__PURE__ */ Vt(n) && !/* @__PURE__ */ Bt(n) && (i = /* @__PURE__ */ M(i), n = /* @__PURE__ */ M(n)), !a && /* @__PURE__ */ N(i) && !/* @__PURE__ */ N(n)) return e || (i.value = n), !0;
		}
		let o = a ? Number(t) < e.length : u(e, t), s = Reflect.set(e, t, n, /* @__PURE__ */ N(e) ? e : r);
		return e === /* @__PURE__ */ M(r) && s && (o ? se(n, i) && tt(e, "set", t, n, i) : tt(e, "add", t, n)), s;
	}
	deleteProperty(e, t) {
		let n = u(e, t), r = e[t], i = Reflect.deleteProperty(e, t);
		return i && n && tt(e, "delete", t, void 0, r), i;
	}
	has(e, t) {
		let n = Reflect.has(e, t);
		return (!_(t) || !pt.has(t)) && j(e, "has", t), n;
	}
	ownKeys(e) {
		return j(e, "iterate", d(e) ? "length" : Qe), Reflect.ownKeys(e);
	}
}, _t = class extends ht {
	constructor(e = !1) {
		super(!0, e);
	}
	set(e, t) {
		return !0;
	}
	deleteProperty(e, t) {
		return !0;
	}
}, vt = /* @__PURE__ */ new gt(), yt = /* @__PURE__ */ new _t(), bt = /* @__PURE__ */ new gt(!0), xt = (e) => e, St = (e) => Reflect.getPrototypeOf(e);
function Ct(e, t, n) {
	return function(...r) {
		let i = this.__v_raw, a = /* @__PURE__ */ M(i), o = f(a), c = e === "entries" || e === Symbol.iterator && o, l = e === "keys" && o, u = i[e](...r), d = n ? xt : t ? Gt : Wt;
		return !t && j(a, "iterate", l ? $e : Qe), s(Object.create(u), { next() {
			let { value: e, done: t } = u.next();
			return t ? {
				value: e,
				done: t
			} : {
				value: c ? [d(e[0]), d(e[1])] : d(e),
				done: t
			};
		} });
	};
}
function wt(e) {
	return function(...t) {
		return e === "delete" ? !1 : e === "clear" ? void 0 : this;
	};
}
function Tt(e, t) {
	let n = {
		get(n) {
			let r = this.__v_raw, i = /* @__PURE__ */ M(r), a = /* @__PURE__ */ M(n);
			e || (se(n, a) && j(i, "get", n), j(i, "get", a));
			let { has: o } = St(i), s = t ? xt : e ? Gt : Wt;
			if (o.call(i, n)) return s(r.get(n));
			if (o.call(i, a)) return s(r.get(a));
			r !== i && r.get(n);
		},
		get size() {
			let t = this.__v_raw;
			return !e && j(/* @__PURE__ */ M(t), "iterate", Qe), t.size;
		},
		has(t) {
			let n = this.__v_raw, r = /* @__PURE__ */ M(n), i = /* @__PURE__ */ M(t);
			return e || (se(t, i) && j(r, "has", t), j(r, "has", i)), t === i ? n.has(t) : n.has(t) || n.has(i);
		},
		forEach(n, r) {
			let i = this, a = i.__v_raw, o = /* @__PURE__ */ M(a), s = t ? xt : e ? Gt : Wt;
			return !e && j(o, "iterate", Qe), a.forEach((e, t) => n.call(r, s(e), s(t), i));
		}
	};
	return s(n, e ? {
		add: wt("add"),
		set: wt("set"),
		delete: wt("delete"),
		clear: wt("clear")
	} : {
		add(e) {
			let n = /* @__PURE__ */ M(this), r = St(n), i = /* @__PURE__ */ M(e), a = !t && !/* @__PURE__ */ Vt(e) && !/* @__PURE__ */ Bt(e) ? i : e;
			return r.has.call(n, a) || se(e, a) && r.has.call(n, e) || se(i, a) && r.has.call(n, i) || (n.add(a), tt(n, "add", a, a)), this;
		},
		set(e, n) {
			!t && !/* @__PURE__ */ Vt(n) && !/* @__PURE__ */ Bt(n) && (n = /* @__PURE__ */ M(n));
			let r = /* @__PURE__ */ M(this), { has: i, get: a } = St(r), o = i.call(r, e);
			o ||= (e = /* @__PURE__ */ M(e), i.call(r, e));
			let s = a.call(r, e);
			return r.set(e, n), o ? se(n, s) && tt(r, "set", e, n, s) : tt(r, "add", e, n), this;
		},
		delete(e) {
			let t = /* @__PURE__ */ M(this), { has: n, get: r } = St(t), i = n.call(t, e);
			i ||= (e = /* @__PURE__ */ M(e), n.call(t, e));
			let a = r ? r.call(t, e) : void 0, o = t.delete(e);
			return i && tt(t, "delete", e, void 0, a), o;
		},
		clear() {
			let e = /* @__PURE__ */ M(this), t = e.size !== 0, n = e.clear();
			return t && tt(e, "clear", void 0, void 0, void 0), n;
		}
	}), [
		"keys",
		"values",
		"entries",
		Symbol.iterator
	].forEach((r) => {
		n[r] = Ct(r, e, t);
	}), n;
}
function Et(e, t) {
	let n = Tt(e, t);
	return (t, r, i) => r === "__v_isReactive" ? !e : r === "__v_isReadonly" ? e : r === "__v_raw" ? t : Reflect.get(u(n, r) && r in t ? n : t, r, i);
}
var Dt = { get: /* @__PURE__ */ Et(!1, !1) }, Ot = { get: /* @__PURE__ */ Et(!1, !0) }, kt = { get: /* @__PURE__ */ Et(!0, !1) }, At = /* @__PURE__ */ new WeakMap(), jt = /* @__PURE__ */ new WeakMap(), Mt = /* @__PURE__ */ new WeakMap(), Nt = /* @__PURE__ */ new WeakMap();
function Pt(e) {
	switch (e) {
		case "Object":
		case "Array": return 1;
		case "Map":
		case "Set":
		case "WeakMap":
		case "WeakSet": return 2;
		default: return 0;
	}
}
// @__NO_SIDE_EFFECTS__
function Ft(e) {
	return /* @__PURE__ */ Bt(e) ? e : Rt(e, !1, vt, Dt, At);
}
// @__NO_SIDE_EFFECTS__
function It(e) {
	return Rt(e, !1, bt, Ot, jt);
}
// @__NO_SIDE_EFFECTS__
function Lt(e) {
	return Rt(e, !0, yt, kt, Mt);
}
function Rt(e, t, n, r, i) {
	if (!v(e) || e.__v_raw && !(t && e.__v_isReactive) || e.__v_skip || !Object.isExtensible(e)) return e;
	let a = i.get(e);
	if (a) return a;
	let o = Pt(ee(e));
	if (o === 0) return e;
	let s = new Proxy(e, o === 2 ? r : n);
	return i.set(e, s), s;
}
// @__NO_SIDE_EFFECTS__
function zt(e) {
	return /* @__PURE__ */ Bt(e) ? /* @__PURE__ */ zt(e.__v_raw) : !!(e && e.__v_isReactive);
}
// @__NO_SIDE_EFFECTS__
function Bt(e) {
	return !!(e && e.__v_isReadonly);
}
// @__NO_SIDE_EFFECTS__
function Vt(e) {
	return !!(e && e.__v_isShallow);
}
// @__NO_SIDE_EFFECTS__
function Ht(e) {
	return e ? !!e.__v_raw : !1;
}
// @__NO_SIDE_EFFECTS__
function M(e) {
	let t = e && e.__v_raw;
	return t ? /* @__PURE__ */ M(t) : e;
}
function Ut(e) {
	return !u(e, "__v_skip") && Object.isExtensible(e) && E(e, "__v_skip", !0), e;
}
var Wt = (e) => v(e) ? /* @__PURE__ */ Ft(e) : e, Gt = (e) => v(e) ? /* @__PURE__ */ Lt(e) : e;
// @__NO_SIDE_EFFECTS__
function N(e) {
	return e ? e.__v_isRef === !0 : !1;
}
// @__NO_SIDE_EFFECTS__
function P(e) {
	return Kt(e, !1);
}
function Kt(e, t) {
	return /* @__PURE__ */ N(e) ? e : new qt(e, t);
}
var qt = class {
	constructor(e, t) {
		this.dep = new Ye(), this.__v_isRef = !0, this.__v_isShallow = !1, this._rawValue = t ? e : /* @__PURE__ */ M(e), this._value = t ? e : Wt(e), this.__v_isShallow = t;
	}
	get value() {
		return this.dep.track(), this._value;
	}
	set value(e) {
		let t = this._rawValue, n = this.__v_isShallow || /* @__PURE__ */ Vt(e) || /* @__PURE__ */ Bt(e);
		e = n ? e : /* @__PURE__ */ M(e), se(e, t) && (this._rawValue = e, this._value = n ? e : Wt(e), this.dep.trigger());
	}
};
function Jt(e) {
	return /* @__PURE__ */ N(e) ? e.value : e;
}
var Yt = {
	get: (e, t, n) => t === "__v_raw" ? e : Jt(Reflect.get(e, t, n)),
	set: (e, t, n, r) => {
		let i = e[t];
		return /* @__PURE__ */ N(i) && !/* @__PURE__ */ N(n) ? (i.value = n, !0) : Reflect.set(e, t, n, r);
	}
};
function Xt(e) {
	return /* @__PURE__ */ zt(e) ? e : new Proxy(e, Yt);
}
var Zt = class {
	constructor(e, t, n) {
		this.fn = e, this.setter = t, this._value = void 0, this.dep = new Ye(this), this.__v_isRef = !0, this.deps = void 0, this.depsTail = void 0, this.flags = 16, this.globalVersion = qe - 1, this.next = void 0, this.effect = this, this.__v_isReadonly = !t, this.isSSR = n;
	}
	notify() {
		if (this.flags |= 16, !(this.flags & 8) && A !== this) return Ne(this, !0), !0;
	}
	get value() {
		let e = this.dep.track();
		return ze(this), e && (e.version = this.dep.version), this._value;
	}
	set value(e) {
		this.setter && this.setter(e);
	}
};
// @__NO_SIDE_EFFECTS__
function Qt(e, t, n = !1) {
	let r, i;
	return h(e) ? r = e : (r = e.get, i = e.set), new Zt(r, i, n);
}
var $t = {}, en = /* @__PURE__ */ new WeakMap(), tn = void 0;
function nn(e, t = !1, n = tn) {
	if (n) {
		let t = en.get(n);
		t || en.set(n, t = []), t.push(e);
	}
}
function rn(e, n, i = t) {
	let { immediate: a, deep: o, once: s, scheduler: l, augmentJob: u, call: f } = i, p = (e) => o ? e : /* @__PURE__ */ Vt(e) || o === !1 || o === 0 ? an(e, 1) : an(e), m, g, _, v, y = !1, b = !1;
	if (/* @__PURE__ */ N(e) ? (g = () => e.value, y = /* @__PURE__ */ Vt(e)) : /* @__PURE__ */ zt(e) ? (g = () => p(e), y = !0) : d(e) ? (b = !0, y = e.some((e) => /* @__PURE__ */ zt(e) || /* @__PURE__ */ Vt(e)), g = () => e.map((e) => {
		if (/* @__PURE__ */ N(e)) return e.value;
		if (/* @__PURE__ */ zt(e)) return p(e);
		if (h(e)) return f ? f(e, 2) : e();
	})) : g = h(e) ? n ? f ? () => f(e, 2) : e : () => {
		if (_) {
			We();
			try {
				_();
			} finally {
				Ge();
			}
		}
		let t = tn;
		tn = m;
		try {
			return f ? f(e, 3, [v]) : e(v);
		} finally {
			tn = t;
		}
	} : r, n && o) {
		let e = g, t = o === !0 ? Infinity : o;
		g = () => an(e(), t);
	}
	let x = De(), ee = () => {
		m.stop(), x && x.active && c(x.effects, m);
	};
	if (s && n) {
		let e = n;
		n = (...t) => {
			let n = e(...t);
			return ee(), n;
		};
	}
	let S = b ? Array(e.length).fill($t) : $t, C = (e) => {
		if (!(!(m.flags & 1) || !m.dirty && !e)) if (n) {
			let t = m.run();
			if (e || o || y || (b ? t.some((e, t) => se(e, S[t])) : se(t, S))) {
				_ && _();
				let e = tn;
				tn = m;
				try {
					let e = [
						t,
						S === $t ? void 0 : b && S[0] === $t ? [] : S,
						v
					];
					S = t, f ? f(n, 3, e) : n(...e);
				} finally {
					tn = e;
				}
			}
		} else m.run();
	};
	return u && u(C), m = new ke(g), m.scheduler = l ? () => l(C, !1) : C, v = (e) => nn(e, !1, m), _ = m.onStop = () => {
		let e = en.get(m);
		if (e) {
			if (f) f(e, 4);
			else for (let t of e) t();
			en.delete(m);
		}
	}, n ? a ? C(!0) : S = m.run() : l ? l(C.bind(null, !0), !0) : m.run(), ee.pause = m.pause.bind(m), ee.resume = m.resume.bind(m), ee.stop = ee, ee;
}
function an(e, t = Infinity, n) {
	if (t <= 0 || !v(e) || e.__v_skip || (n ||= /* @__PURE__ */ new Map(), (n.get(e) || 0) >= t)) return e;
	if (n.set(e, t), t--, /* @__PURE__ */ N(e)) an(e.value, t, n);
	else if (d(e)) for (let r = 0; r < e.length; r++) an(e[r], t, n);
	else if (p(e) || f(e)) e.forEach((e) => {
		an(e, t, n);
	});
	else if (S(e)) {
		for (let r in e) an(e[r], t, n);
		for (let r of Object.getOwnPropertySymbols(e)) Object.prototype.propertyIsEnumerable.call(e, r) && an(e[r], t, n);
	}
	return e;
}
//#endregion
//#region node_modules/@vue/runtime-core/dist/runtime-core.esm-bundler.js
function on(e, t, n, r) {
	try {
		return r ? e(...r) : e();
	} catch (e) {
		cn(e, t, n);
	}
}
function sn(e, t, n, r) {
	if (h(e)) {
		let i = on(e, t, n, r);
		return i && y(i) && i.catch((e) => {
			cn(e, t, n);
		}), i;
	}
	if (d(e)) {
		let i = [];
		for (let a = 0; a < e.length; a++) i.push(sn(e[a], t, n, r));
		return i;
	}
}
function cn(e, n, r, i = !0) {
	let a = n ? n.vnode : null, { errorHandler: o, throwUnhandledErrorInProduction: s } = n && n.appContext.config || t;
	if (n) {
		let t = n.parent, i = n.proxy, a = `https://vuejs.org/error-reference/#runtime-${r}`;
		for (; t;) {
			let n = t.ec;
			if (n) {
				for (let t = 0; t < n.length; t++) if (n[t](e, i, a) === !1) return;
			}
			t = t.parent;
		}
		if (o) {
			We(), on(o, null, 10, [
				e,
				i,
				a
			]), Ge();
			return;
		}
	}
	ln(e, r, a, i, s);
}
function ln(e, t, n, r = !0, i = !1) {
	if (i) throw e;
	console.error(e);
}
var F = [], un = -1, dn = [], fn = null, pn = 0, mn = /* @__PURE__ */ Promise.resolve(), hn = null;
function gn(e) {
	let t = hn || mn;
	return e ? t.then(this ? e.bind(this) : e) : t;
}
function _n(e) {
	let t = un + 1, n = F.length;
	for (; t < n;) {
		let r = t + n >>> 1, i = F[r], a = Cn(i);
		a < e || a === e && i.flags & 2 ? t = r + 1 : n = r;
	}
	return t;
}
function vn(e) {
	if (!(e.flags & 1)) {
		let t = Cn(e), n = F[F.length - 1];
		!n || !(e.flags & 2) && t >= Cn(n) ? F.push(e) : F.splice(_n(t), 0, e), e.flags |= 1, yn();
	}
}
function yn() {
	hn ||= mn.then(wn);
}
function bn(e) {
	d(e) ? dn.push(...e) : fn && e.id === -1 ? fn.splice(pn + 1, 0, e) : e.flags & 1 || (dn.push(e), e.flags |= 1), yn();
}
function xn(e, t, n = un + 1) {
	for (; n < F.length; n++) {
		let t = F[n];
		if (t && t.flags & 2) {
			if (e && t.id !== e.uid) continue;
			F.splice(n, 1), n--, t.flags & 4 && (t.flags &= -2), t(), t.flags & 4 || (t.flags &= -2);
		}
	}
}
function Sn(e) {
	if (dn.length) {
		let e = [...new Set(dn)].sort((e, t) => Cn(e) - Cn(t));
		if (dn.length = 0, fn) {
			fn.push(...e);
			return;
		}
		for (fn = e, pn = 0; pn < fn.length; pn++) {
			let e = fn[pn];
			e.flags & 4 && (e.flags &= -2), e.flags & 8 || e(), e.flags &= -2;
		}
		fn = null, pn = 0;
	}
}
var Cn = (e) => e.id == null ? e.flags & 2 ? -1 : Infinity : e.id;
function wn(e) {
	try {
		for (un = 0; un < F.length; un++) {
			let e = F[un];
			e && !(e.flags & 8) && (e.flags & 4 && (e.flags &= -2), on(e, e.i, e.i ? 15 : 14), e.flags & 4 || (e.flags &= -2));
		}
	} finally {
		for (; un < F.length; un++) {
			let e = F[un];
			e && (e.flags &= -2);
		}
		un = -1, F.length = 0, Sn(e), hn = null, (F.length || dn.length) && wn(e);
	}
}
var Tn = null, En = null;
function Dn(e) {
	let t = Tn;
	return Tn = e, En = e && e.type.__scopeId || null, t;
}
function On(e, t = Tn, n) {
	if (!t || e._n) return e;
	let r = (...n) => {
		r._d && Mi(-1);
		let i = Dn(t), a = Oi.length, o;
		try {
			o = e(...n);
		} finally {
			for (let e = Oi.length; e > a; e--) Ai();
			Dn(i), r._d && Mi(1);
		}
		return o;
	};
	return r._n = !0, r._c = !0, r._d = !0, r;
}
function I(e, n) {
	if (Tn === null) return e;
	let r = fa(Tn), i = e.dirs ||= [];
	for (let e = 0; e < n.length; e++) {
		let [a, o, s, c = t] = n[e];
		a && (h(a) && (a = {
			mounted: a,
			updated: a
		}), a.deep && an(o), i.push({
			dir: a,
			instance: r,
			value: o,
			oldValue: void 0,
			arg: s,
			modifiers: c
		}));
	}
	return e;
}
function kn(e, t, n, r) {
	let i = e.dirs, a = t && t.dirs;
	for (let o = 0; o < i.length; o++) {
		let s = i[o];
		a && (s.oldValue = a[o].value);
		let c = s.dir[r];
		c && (We(), sn(c, n, 8, [
			e.el,
			s,
			e,
			t
		]), Ge());
	}
}
function An(e, t) {
	if (G) {
		let n = G.provides, r = G.parent && G.parent.provides;
		r === n && (n = G.provides = Object.create(r)), n[e] = t;
	}
}
function jn(e, t, n = !1) {
	let r = Zi();
	if (r || Ir) {
		let i = Ir ? Ir._context.provides : r ? r.parent == null || r.ce ? r.vnode.appContext && r.vnode.appContext.provides : r.parent.provides : void 0;
		if (i && e in i) return i[e];
		if (arguments.length > 1) return n && h(t) ? t.call(r && r.proxy) : t;
	}
}
var Mn = /* @__PURE__ */ Symbol.for("v-scx"), Nn = () => jn(Mn);
function Pn(e, t, n) {
	return Fn(e, t, n);
}
function Fn(e, n, i = t) {
	let { immediate: a, deep: o, flush: c, once: l } = i, u = s({}, i), d = n && a || !n && c !== "post", f;
	if (ra) {
		if (c === "sync") {
			let e = Nn();
			f = e.__watcherHandles ||= [];
		} else if (!d) {
			let e = () => {};
			return e.stop = r, e.resume = r, e.pause = r, e;
		}
	}
	let p = G;
	u.call = (e, t, n) => sn(e, p, t, n);
	let m = !1;
	c === "post" ? u.scheduler = (e) => {
		R(e, p && p.suspense);
	} : c !== "sync" && (m = !0, u.scheduler = (e, t) => {
		t ? e() : vn(e);
	}), u.augmentJob = (e) => {
		n && (e.flags |= 4), m && (e.flags |= 2, p && (e.id = p.uid, e.i = p));
	};
	let h = rn(e, n, u);
	return ra && (f ? f.push(h) : d && h()), h;
}
function In(e, t, n) {
	let r = this.proxy, i = g(e) ? e.includes(".") ? Ln(r, e) : () => r[e] : e.bind(r, r), a;
	h(t) ? a = t : (a = t.handler, n = t);
	let o = ea(this), s = Fn(i, a.bind(r), n);
	return o(), s;
}
function Ln(e, t) {
	let n = t.split(".");
	return () => {
		let t = e;
		for (let e = 0; e < n.length && t; e++) t = t[n[e]];
		return t;
	};
}
var Rn = /* @__PURE__ */ Symbol("_vte"), zn = (e) => e.__isTeleport, Bn = /* @__PURE__ */ Symbol("_leaveCb");
function Vn(e, t) {
	e.shapeFlag & 6 && e.component ? (e.transition = t, Vn(e.component.subTree, t)) : e.shapeFlag & 128 ? (e.ssContent.transition = t.clone(e.ssContent), e.ssFallback.transition = t.clone(e.ssFallback)) : e.transition = t;
}
// @__NO_SIDE_EFFECTS__
function Hn(e, t) {
	return h(e) ? /* @__PURE__ */ s({ name: e.name }, t, { setup: e }) : e;
}
function Un(e) {
	e.ids = [
		e.ids[0] + e.ids[2]++ + "-",
		0,
		0
	];
}
function Wn(e, t) {
	let n;
	return !!((n = Object.getOwnPropertyDescriptor(e, t)) && !n.configurable);
}
var Gn = /* @__PURE__ */ new WeakMap();
function Kn(e, n, r, a, o = !1) {
	if (d(e)) {
		e.forEach((e, t) => Kn(e, n && (d(n) ? n[t] : n), r, a, o));
		return;
	}
	if (Jn(a) && !o) {
		a.shapeFlag & 512 && a.type.__asyncResolved && a.component.subTree.component && Kn(e, n, r, a.component.subTree);
		return;
	}
	let s = a.shapeFlag & 4 ? fa(a.component) : a.el, l = o ? null : s, { i: f, r: p } = e, m = n && n.r, _ = f.refs === t ? f.refs = {} : f.refs, v = f.setupState, y = /* @__PURE__ */ M(v), b = v === t ? i : (e) => !Wn(_, e) && u(y, e), x = (e, t) => !(t && Wn(_, t));
	if (m != null && m !== p) {
		if (qn(n), g(m)) _[m] = null, b(m) && (v[m] = null);
		else if (/* @__PURE__ */ N(m)) {
			let e = n;
			x(m, e.k) && (m.value = null), e.k && (_[e.k] = null);
		}
	}
	if (h(p)) on(p, f, 12, [l, _]);
	else {
		let t = g(p), n = /* @__PURE__ */ N(p);
		if (t || n) {
			let i = () => {
				if (e.f) {
					let n = t ? b(p) ? v[p] : _[p] : x(p) || !e.k ? p.value : _[e.k];
					if (o) d(n) && c(n, s);
					else if (d(n)) n.includes(s) || n.push(s);
					else if (t) _[p] = [s], b(p) && (v[p] = _[p]);
					else {
						let t = [s];
						x(p, e.k) && (p.value = t), e.k && (_[e.k] = t);
					}
				} else t ? (_[p] = l, b(p) && (v[p] = l)) : n && (x(p, e.k) && (p.value = l), e.k && (_[e.k] = l));
			};
			if (l) {
				let t = () => {
					i(), Gn.delete(e);
				};
				t.id = -1, Gn.set(e, t), R(t, r);
			} else qn(e), i();
		}
	}
}
function qn(e) {
	let t = Gn.get(e);
	t && (t.flags |= 8, Gn.delete(e));
}
de().requestIdleCallback, de().cancelIdleCallback;
var Jn = (e) => !!e.type.__asyncLoader, Yn = (e) => e.type.__isKeepAlive;
function Xn(e, t) {
	Qn(e, "a", t);
}
function Zn(e, t) {
	Qn(e, "da", t);
}
function Qn(e, t, n = G) {
	let r = e.__wdc ||= () => {
		let t = n;
		for (; t;) {
			if (t.isDeactivated) return;
			t = t.parent;
		}
		return e();
	};
	if (er(t, r, n), n) {
		let e = n.parent;
		for (; e && e.parent;) Yn(e.parent.vnode) && $n(r, t, n, e), e = e.parent;
	}
}
function $n(e, t, n, r) {
	let i = er(t, e, r, !0);
	sr(() => {
		c(r[t], i);
	}, n);
}
function er(e, t, n = G, r = !1) {
	if (n) {
		let i = n[e] || (n[e] = []), a = t.__weh ||= (...r) => {
			We();
			let i = ea(n), a = sn(t, n, e, r);
			return i(), Ge(), a;
		};
		return r ? i.unshift(a) : i.push(a), a;
	}
}
var tr = (e) => (t, n = G) => {
	(!ra || e === "sp") && er(e, (...e) => t(...e), n);
}, nr = tr("bm"), rr = tr("m"), ir = tr("bu"), ar = tr("u"), or = tr("bum"), sr = tr("um"), cr = tr("sp"), lr = tr("rtg"), ur = tr("rtc");
function dr(e, t = G) {
	er("ec", e, t);
}
var fr = /* @__PURE__ */ Symbol.for("v-ndc");
function pr(e, t, n, r) {
	let i, a = n && n[r], o = d(e);
	if (o || g(e)) {
		let n = o && /* @__PURE__ */ zt(e), r = !1, s = !1;
		n && (r = !/* @__PURE__ */ Vt(e), s = /* @__PURE__ */ Bt(e), e = rt(e)), i = Array(e.length);
		for (let n = 0, o = e.length; n < o; n++) i[n] = t(r ? s ? Gt(Wt(e[n])) : Wt(e[n]) : e[n], n, void 0, a && a[n]);
	} else if (typeof e == "number") {
		i = Array(e);
		for (let n = 0; n < e; n++) i[n] = t(n + 1, n, void 0, a && a[n]);
	} else if (v(e)) if (e[Symbol.iterator]) i = Array.from(e, (e, n) => t(e, n, void 0, a && a[n]));
	else {
		let n = Object.keys(e);
		i = Array(n.length);
		for (let r = 0, o = n.length; r < o; r++) {
			let o = n[r];
			i[r] = t(e[o], o, r, a && a[r]);
		}
	}
	else i = [];
	return n && (n[r] = i), i;
}
var mr = (e) => e ? na(e) ? fa(e) : mr(e.parent) : null, hr = /* @__PURE__ */ s(/* @__PURE__ */ Object.create(null), {
	$: (e) => e,
	$el: (e) => e.vnode.el,
	$data: (e) => e.data,
	$props: (e) => e.props,
	$attrs: (e) => e.attrs,
	$slots: (e) => e.slots,
	$refs: (e) => e.refs,
	$parent: (e) => mr(e.parent),
	$root: (e) => mr(e.root),
	$host: (e) => e.ce,
	$emit: (e) => e.emit,
	$options: (e) => wr(e),
	$forceUpdate: (e) => e.f ||= () => {
		vn(e.update);
	},
	$nextTick: (e) => e.n ||= gn.bind(e.proxy),
	$watch: (e) => In.bind(e)
}), gr = (e, n) => e !== t && !e.__isScriptSetup && u(e, n), _r = {
	get({ _: e }, n) {
		if (n === "__v_skip") return !0;
		let { ctx: r, setupState: i, data: a, props: o, accessCache: s, type: c, appContext: l } = e;
		if (n[0] !== "$") {
			let e = s[n];
			if (e !== void 0) switch (e) {
				case 1: return i[n];
				case 2: return a[n];
				case 4: return r[n];
				case 3: return o[n];
			}
			else if (gr(i, n)) return s[n] = 1, i[n];
			else if (a !== t && u(a, n)) return s[n] = 2, a[n];
			else if (u(o, n)) return s[n] = 3, o[n];
			else if (r !== t && u(r, n)) return s[n] = 4, r[n];
			else yr && (s[n] = 0);
		}
		let d = hr[n], f, p;
		if (d) return n === "$attrs" && j(e.attrs, "get", ""), d(e);
		if ((f = c.__cssModules) && (f = f[n])) return f;
		if (r !== t && u(r, n)) return s[n] = 4, r[n];
		if (p = l.config.globalProperties, u(p, n)) return p[n];
	},
	set({ _: e }, n, r) {
		let { data: i, setupState: a, ctx: o } = e;
		return gr(a, n) ? (a[n] = r, !0) : i !== t && u(i, n) ? (i[n] = r, !0) : u(e.props, n) || n[0] === "$" && n.slice(1) in e ? !1 : (o[n] = r, !0);
	},
	has({ _: { data: e, setupState: n, accessCache: r, ctx: i, appContext: a, props: o, type: s } }, c) {
		let l;
		return !!(r[c] || e !== t && c[0] !== "$" && u(e, c) || gr(n, c) || u(o, c) || u(i, c) || u(hr, c) || u(a.config.globalProperties, c) || (l = s.__cssModules) && l[c]);
	},
	defineProperty(e, t, n) {
		return n.get == null ? u(n, "value") && this.set(e, t, n.value, null) : e._.accessCache[t] = 0, Reflect.defineProperty(e, t, n);
	}
};
function vr(e) {
	return d(e) ? e.reduce((e, t) => (e[t] = null, e), {}) : e;
}
var yr = !0;
function br(e) {
	let t = wr(e), n = e.proxy, i = e.ctx;
	yr = !1, t.beforeCreate && Sr(t.beforeCreate, e, "bc");
	let { data: a, computed: o, methods: s, watch: c, provide: l, inject: u, created: f, beforeMount: p, mounted: m, beforeUpdate: g, updated: _, activated: y, deactivated: b, beforeDestroy: x, beforeUnmount: ee, destroyed: S, unmounted: C, render: te, renderTracked: ne, renderTriggered: re, errorCaptured: w, serverPrefetch: ie, expose: T, inheritAttrs: ae, components: oe, directives: se, filters: ce } = t;
	if (u && xr(u, i, null), s) for (let e in s) {
		let t = s[e];
		h(t) && (i[e] = t.bind(n));
	}
	if (a) {
		let t = a.call(n, n);
		v(t) && (e.data = /* @__PURE__ */ Ft(t));
	}
	if (yr = !0, o) for (let e in o) {
		let t = o[e], a = K({
			get: h(t) ? t.bind(n, n) : h(t.get) ? t.get.bind(n, n) : r,
			set: !h(t) && h(t.set) ? t.set.bind(n) : r
		});
		Object.defineProperty(i, e, {
			enumerable: !0,
			configurable: !0,
			get: () => a.value,
			set: (e) => a.value = e
		});
	}
	if (c) for (let e in c) Cr(c[e], i, n, e);
	if (l) {
		let e = h(l) ? l.call(n) : l;
		Reflect.ownKeys(e).forEach((t) => {
			An(t, e[t]);
		});
	}
	f && Sr(f, e, "c");
	function E(e, t) {
		d(t) ? t.forEach((t) => e(t.bind(n))) : t && e(t.bind(n));
	}
	if (E(nr, p), E(rr, m), E(ir, g), E(ar, _), E(Xn, y), E(Zn, b), E(dr, w), E(ur, ne), E(lr, re), E(or, ee), E(sr, C), E(cr, ie), d(T)) if (T.length) {
		let t = e.exposed ||= {};
		T.forEach((e) => {
			Object.defineProperty(t, e, {
				get: () => n[e],
				set: (t) => n[e] = t,
				enumerable: !0
			});
		});
	} else e.exposed ||= {};
	te && e.render === r && (e.render = te), ae != null && (e.inheritAttrs = ae), oe && (e.components = oe), se && (e.directives = se), ie && Un(e);
}
function xr(e, t, n = r) {
	d(e) && (e = kr(e));
	for (let n in e) {
		let r = e[n], i;
		i = v(r) ? "default" in r ? jn(r.from || n, r.default, !0) : jn(r.from || n) : jn(r), /* @__PURE__ */ N(i) ? Object.defineProperty(t, n, {
			enumerable: !0,
			configurable: !0,
			get: () => i.value,
			set: (e) => i.value = e
		}) : t[n] = i;
	}
}
function Sr(e, t, n) {
	sn(d(e) ? e.map((e) => e.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function Cr(e, t, n, r) {
	let i = r.includes(".") ? Ln(n, r) : () => n[r];
	if (g(e)) {
		let n = t[e];
		h(n) && Pn(i, n);
	} else if (h(e)) Pn(i, e.bind(n));
	else if (v(e)) if (d(e)) e.forEach((e) => Cr(e, t, n, r));
	else {
		let r = h(e.handler) ? e.handler.bind(n) : t[e.handler];
		h(r) && Pn(i, r, e);
	}
}
function wr(e) {
	let t = e.type, { mixins: n, extends: r } = t, { mixins: i, optionsCache: a, config: { optionMergeStrategies: o } } = e.appContext, s = a.get(t), c;
	return s ? c = s : !i.length && !n && !r ? c = t : (c = {}, i.length && i.forEach((e) => Tr(c, e, o, !0)), Tr(c, t, o)), v(t) && a.set(t, c), c;
}
function Tr(e, t, n, r = !1) {
	let { mixins: i, extends: a } = t;
	a && Tr(e, a, n, !0), i && i.forEach((t) => Tr(e, t, n, !0));
	for (let i in t) if (!(r && i === "expose")) {
		let r = Er[i] || n && n[i];
		e[i] = r ? r(e[i], t[i]) : t[i];
	}
	return e;
}
var Er = {
	data: Dr,
	props: jr,
	emits: jr,
	methods: Ar,
	computed: Ar,
	beforeCreate: L,
	created: L,
	beforeMount: L,
	mounted: L,
	beforeUpdate: L,
	updated: L,
	beforeDestroy: L,
	beforeUnmount: L,
	destroyed: L,
	unmounted: L,
	activated: L,
	deactivated: L,
	errorCaptured: L,
	serverPrefetch: L,
	components: Ar,
	directives: Ar,
	watch: Mr,
	provide: Dr,
	inject: Or
};
function Dr(e, t) {
	return t ? e ? function() {
		return s(h(e) ? e.call(this, this) : e, h(t) ? t.call(this, this) : t);
	} : t : e;
}
function Or(e, t) {
	return Ar(kr(e), kr(t));
}
function kr(e) {
	if (d(e)) {
		let t = {};
		for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
		return t;
	}
	return e;
}
function L(e, t) {
	return e ? [...new Set([].concat(e, t))] : t;
}
function Ar(e, t) {
	return e ? s(/* @__PURE__ */ Object.create(null), e, t) : t;
}
function jr(e, t) {
	return e ? d(e) && d(t) ? [.../* @__PURE__ */ new Set([...e, ...t])] : s(/* @__PURE__ */ Object.create(null), vr(e), vr(t ?? {})) : t;
}
function Mr(e, t) {
	if (!e) return t;
	if (!t) return e;
	let n = s(/* @__PURE__ */ Object.create(null), e);
	for (let r in t) n[r] = L(e[r], t[r]);
	return n;
}
function Nr() {
	return {
		app: null,
		config: {
			isNativeTag: i,
			performance: !1,
			globalProperties: {},
			optionMergeStrategies: {},
			errorHandler: void 0,
			warnHandler: void 0,
			compilerOptions: {}
		},
		mixins: [],
		components: {},
		directives: {},
		provides: /* @__PURE__ */ Object.create(null),
		optionsCache: /* @__PURE__ */ new WeakMap(),
		propsCache: /* @__PURE__ */ new WeakMap(),
		emitsCache: /* @__PURE__ */ new WeakMap()
	};
}
var Pr = 0;
function Fr(e, t) {
	return function(n, r = null) {
		h(n) || (n = s({}, n)), r != null && !v(r) && (r = null);
		let i = Nr(), a = /* @__PURE__ */ new WeakSet(), o = [], c = !1, l = i.app = {
			_uid: Pr++,
			_component: n,
			_props: r,
			_container: null,
			_context: i,
			_instance: null,
			version: ma,
			get config() {
				return i.config;
			},
			set config(e) {},
			use(e, ...t) {
				return a.has(e) || (e && h(e.install) ? (a.add(e), e.install(l, ...t)) : h(e) && (a.add(e), e(l, ...t))), l;
			},
			mixin(e) {
				return i.mixins.includes(e) || i.mixins.push(e), l;
			},
			component(e, t) {
				return t ? (i.components[e] = t, l) : i.components[e];
			},
			directive(e, t) {
				return t ? (i.directives[e] = t, l) : i.directives[e];
			},
			mount(a, o, s) {
				if (!c) {
					let u = l._ceVNode || U(n, r);
					return u.appContext = i, s === !0 ? s = "svg" : s === !1 && (s = void 0), o && t ? t(u, a) : e(u, a, s), c = !0, l._container = a, a.__vue_app__ = l, fa(u.component);
				}
			},
			onUnmount(e) {
				o.push(e);
			},
			unmount() {
				c && (sn(o, l._instance, 16), e(null, l._container), delete l._container.__vue_app__);
			},
			provide(e, t) {
				return i.provides[e] = t, l;
			},
			runWithContext(e) {
				let t = Ir;
				Ir = l;
				try {
					return e();
				} finally {
					Ir = t;
				}
			}
		};
		return l;
	};
}
var Ir = null, Lr = (e, t) => t === "modelValue" || t === "model-value" ? e.modelModifiers : e[`${t}Modifiers`] || e[`${w(t)}Modifiers`] || e[`${T(t)}Modifiers`];
function Rr(e, n, ...r) {
	if (e.isUnmounted) return;
	let i = e.vnode.props || t, a = r, o = n.startsWith("update:"), s = o && Lr(i, n.slice(7));
	s && (s.trim && (a = r.map((e) => g(e) ? e.trim() : e)), s.number && (a = r.map(le)));
	let c, l = i[c = oe(n)] || i[c = oe(w(n))];
	!l && o && (l = i[c = oe(T(n))]), l && sn(l, e, 6, a);
	let u = i[c + "Once"];
	if (u) {
		if (!e.emitted) e.emitted = {};
		else if (e.emitted[c]) return;
		e.emitted[c] = !0, sn(u, e, 6, a);
	}
}
var zr = /* @__PURE__ */ new WeakMap();
function Br(e, t, n = !1) {
	let r = n ? zr : t.emitsCache, i = r.get(e);
	if (i !== void 0) return i;
	let a = e.emits, o = {}, c = !1;
	if (!h(e)) {
		let r = (e) => {
			let n = Br(e, t, !0);
			n && (c = !0, s(o, n));
		};
		!n && t.mixins.length && t.mixins.forEach(r), e.extends && r(e.extends), e.mixins && e.mixins.forEach(r);
	}
	return !a && !c ? (v(e) && r.set(e, null), null) : (d(a) ? a.forEach((e) => o[e] = null) : s(o, a), v(e) && r.set(e, o), o);
}
function Vr(e, t) {
	return !e || !a(t) ? !1 : (t = t.slice(2), t = t === "Once" ? t : t.replace(/Once$/, ""), u(e, t[0].toLowerCase() + t.slice(1)) || u(e, T(t)) || u(e, t));
}
function Hr(e) {
	let { type: t, vnode: n, proxy: r, withProxy: i, propsOptions: [a], slots: s, attrs: c, emit: l, render: u, renderCache: d, props: f, data: p, setupState: m, ctx: h, inheritAttrs: g } = e, _ = Dn(e), v, y;
	try {
		if (n.shapeFlag & 4) {
			let e = i || r, t = e;
			v = Ui(u.call(t, e, d, f, m, p, h)), y = c;
		} else {
			let e = t;
			v = Ui(e.length > 1 ? e(f, {
				attrs: c,
				slots: s,
				emit: l
			}) : e(f, null)), y = t.props ? c : Ur(c);
		}
	} catch (t) {
		Oi.length = 0, cn(t, e, 1), v = U(Ei);
	}
	let b = v;
	if (y && g !== !1) {
		let e = Object.keys(y), { shapeFlag: t } = b;
		e.length && t & 7 && (a && e.some(o) && (y = Wr(y, a)), b = Vi(b, y, !1, !0));
	}
	return n.dirs && (b = Vi(b, null, !1, !0), b.dirs = b.dirs ? b.dirs.concat(n.dirs) : n.dirs), n.transition && Vn(b, n.transition), v = b, Dn(_), v;
}
var Ur = (e) => {
	let t;
	for (let n in e) (n === "class" || n === "style" || a(n)) && ((t ||= {})[n] = e[n]);
	return t;
}, Wr = (e, t) => {
	let n = {};
	for (let r in e) (!o(r) || !(r.slice(9) in t)) && (n[r] = e[r]);
	return n;
};
function Gr(e, t, n) {
	let { props: r, children: i, component: a } = e, { props: o, children: s, patchFlag: c } = t, l = a.emitsOptions;
	if (t.dirs || t.transition) return !0;
	if (n && c >= 0) {
		if (c & 1024) return !0;
		if (c & 16) return r ? Kr(r, o, l) : !!o;
		if (c & 8) {
			let e = t.dynamicProps;
			for (let t = 0; t < e.length; t++) {
				let n = e[t];
				if (qr(o, r, n) && !Vr(l, n)) return !0;
			}
		}
	} else return (i || s) && (!s || !s.$stable) ? !0 : r === o ? !1 : r ? !o || Kr(r, o, l) : !!o;
	return !1;
}
function Kr(e, t, n) {
	let r = Object.keys(t);
	if (r.length !== Object.keys(e).length) return !0;
	for (let i = 0; i < r.length; i++) {
		let a = r[i];
		if (qr(t, e, a) && !Vr(n, a)) return !0;
	}
	return !1;
}
function qr(e, t, n) {
	let r = e[n], i = t[n];
	return n === "style" && v(r) && v(i) ? !xe(r, i) : r !== i;
}
function Jr({ vnode: e, parent: t, suspense: n }, r) {
	for (; t;) {
		let n = t.subTree;
		if (n.suspense && n.suspense.activeBranch === e && (n.suspense.vnode.el = n.el = r, e = n), n === e) (e = t.vnode).el = r, t = t.parent;
		else break;
	}
	n && n.activeBranch === e && (n.vnode.el = r);
}
var Yr = {}, Xr = () => Object.create(Yr), Zr = (e) => Object.getPrototypeOf(e) === Yr;
function Qr(e, t, n, r = !1) {
	let i = {}, a = Xr();
	e.propsDefaults = /* @__PURE__ */ Object.create(null), ei(e, t, i, a);
	for (let t in e.propsOptions[0]) t in i || (i[t] = void 0);
	n ? e.props = r ? i : /* @__PURE__ */ It(i) : e.type.props ? e.props = i : e.props = a, e.attrs = a;
}
function $r(e, t, n, r) {
	let { props: i, attrs: a, vnode: { patchFlag: o } } = e, s = /* @__PURE__ */ M(i), [c] = e.propsOptions, l = !1;
	if ((r || o > 0) && !(o & 16)) {
		if (o & 8) {
			let n = e.vnode.dynamicProps;
			for (let r = 0; r < n.length; r++) {
				let o = n[r];
				if (Vr(e.emitsOptions, o)) continue;
				let d = t[o];
				if (c) if (u(a, o)) d !== a[o] && (a[o] = d, l = !0);
				else {
					let t = w(o);
					i[t] = ti(c, s, t, d, e, !1);
				}
				else d !== a[o] && (a[o] = d, l = !0);
			}
		}
	} else {
		ei(e, t, i, a) && (l = !0);
		let r;
		for (let a in s) (!t || !u(t, a) && ((r = T(a)) === a || !u(t, r))) && (c ? n && (n[a] !== void 0 || n[r] !== void 0) && (i[a] = ti(c, s, a, void 0, e, !0)) : delete i[a]);
		if (a !== s) for (let e in a) (!t || !u(t, e)) && (delete a[e], l = !0);
	}
	l && tt(e.attrs, "set", "");
}
function ei(e, n, r, i) {
	let [a, o] = e.propsOptions, s = !1, c;
	if (n) for (let t in n) {
		if (te(t)) continue;
		let l = n[t], d;
		a && u(a, d = w(t)) ? !o || !o.includes(d) ? r[d] = l : (c ||= {})[d] = l : Vr(e.emitsOptions, t) || (!(t in i) || l !== i[t]) && (i[t] = l, s = !0);
	}
	if (o) {
		let n = /* @__PURE__ */ M(r), i = c || t;
		for (let t = 0; t < o.length; t++) {
			let s = o[t];
			r[s] = ti(a, n, s, i[s], e, !u(i, s));
		}
	}
	return s;
}
function ti(e, t, n, r, i, a) {
	let o = e[n];
	if (o != null) {
		let e = u(o, "default");
		if (e && r === void 0) {
			let e = o.default;
			if (o.type !== Function && !o.skipFactory && h(e)) {
				let { propsDefaults: a } = i;
				if (n in a) r = a[n];
				else {
					let o = ea(i);
					r = a[n] = e.call(null, t), o();
				}
			} else r = e;
			i.ce && i.ce._setProp(n, r);
		}
		o[0] && (a && !e ? r = !1 : o[1] && (r === "" || r === T(n)) && (r = !0));
	}
	return r;
}
var ni = /* @__PURE__ */ new WeakMap();
function ri(e, r, i = !1) {
	let a = i ? ni : r.propsCache, o = a.get(e);
	if (o) return o;
	let c = e.props, l = {}, f = [], p = !1;
	if (!h(e)) {
		let t = (e) => {
			p = !0;
			let [t, n] = ri(e, r, !0);
			s(l, t), n && f.push(...n);
		};
		!i && r.mixins.length && r.mixins.forEach(t), e.extends && t(e.extends), e.mixins && e.mixins.forEach(t);
	}
	if (!c && !p) return v(e) && a.set(e, n), n;
	if (d(c)) for (let e = 0; e < c.length; e++) {
		let n = w(c[e]);
		ii(n) && (l[n] = t);
	}
	else if (c) for (let e in c) {
		let t = w(e);
		if (ii(t)) {
			let n = c[e], r = l[t] = d(n) || h(n) ? { type: n } : s({}, n), i = r.type, a = !1, o = !0;
			if (d(i)) for (let e = 0; e < i.length; ++e) {
				let t = i[e], n = h(t) && t.name;
				if (n === "Boolean") {
					a = !0;
					break;
				} else n === "String" && (o = !1);
			}
			else a = h(i) && i.name === "Boolean";
			r[0] = a, r[1] = o, (a || u(r, "default")) && f.push(t);
		}
	}
	let m = [l, f];
	return v(e) && a.set(e, m), m;
}
function ii(e) {
	return e[0] !== "$" && !te(e);
}
var ai = (e) => e === "_" || e === "_ctx" || e === "$stable", oi = (e) => d(e) ? e.map(Ui) : [Ui(e)], si = (e, t, n) => {
	if (t._n) return t;
	let r = On((...e) => oi(t(...e)), n);
	return r._c = !1, r;
}, ci = (e, t, n) => {
	let r = e._ctx;
	for (let n in e) {
		if (ai(n)) continue;
		let i = e[n];
		if (h(i)) t[n] = si(n, i, r);
		else if (i != null) {
			let e = oi(i);
			t[n] = () => e;
		}
	}
}, li = (e, t) => {
	let n = oi(t);
	e.slots.default = () => n;
}, ui = (e, t, n) => {
	for (let r in t) (n || !ai(r)) && (e[r] = t[r]);
}, di = (e, t, n) => {
	let r = e.slots = Xr();
	if (e.vnode.shapeFlag & 32) {
		let e = t._;
		e ? (ui(r, t, n), n && E(r, "_", e, !0)) : ci(t, r);
	} else t && li(e, t);
}, fi = (e, n, r) => {
	let { vnode: i, slots: a } = e, o = !0, s = t;
	if (i.shapeFlag & 32) {
		let e = n._;
		e ? r && e === 1 ? o = !1 : ui(a, n, r) : (o = !n.$stable, ci(n, a)), s = n;
	} else n && (li(e, n), s = { default: 1 });
	if (o) for (let e in a) !ai(e) && s[e] == null && delete a[e];
}, R = wi;
function pi(e) {
	return mi(e);
}
function mi(e, i) {
	let a = de();
	a.__VUE__ = !0;
	let { insert: o, remove: s, patchProp: c, createElement: l, createText: u, createComment: d, setText: f, setElementText: p, parentNode: m, nextSibling: h, setScopeId: g = r, insertStaticContent: _ } = e, v = (e, t, n, r = null, i = null, a = null, o = void 0, s = null, c = !!t.dynamicChildren) => {
		if (e === t) return;
		e && !Ii(e, t) && (r = xe(e), D(e, i, a, !0), e = null), t.patchFlag === -2 && (c = !1, t.dynamicChildren = null);
		let { type: l, ref: u, shapeFlag: d } = t;
		switch (l) {
			case Ti:
				y(e, t, n, r);
				break;
			case Ei:
				b(e, t, n, r);
				break;
			case Di:
				e ?? x(t, n, r, o);
				break;
			case z:
				oe(e, t, n, r, i, a, o, s, c);
				break;
			default: d & 1 ? C(e, t, n, r, i, a, o, s, c) : d & 6 ? se(e, t, n, r, i, a, o, s, c) : (d & 64 || d & 128) && l.process(e, t, n, r, i, a, o, s, c, O);
		}
		u != null && i ? Kn(u, e && e.ref, a, t || e, !t) : u == null && e && e.ref != null && Kn(e.ref, null, a, e, !0);
	}, y = (e, t, n, r) => {
		if (e == null) o(t.el = u(t.children), n, r);
		else {
			let n = t.el = e.el;
			t.children !== e.children && f(n, t.children);
		}
	}, b = (e, t, n, r) => {
		e == null ? o(t.el = d(t.children || ""), n, r) : t.el = e.el;
	}, x = (e, t, n, r) => {
		[e.el, e.anchor] = _(e.children, t, n, r, e.el, e.anchor);
	}, ee = ({ el: e, anchor: t }, n, r) => {
		let i;
		for (; e && e !== t;) i = h(e), o(e, n, r), e = i;
		o(t, n, r);
	}, S = ({ el: e, anchor: t }) => {
		let n;
		for (; e && e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, C = (e, t, n, r, i, a, o, s, c) => {
		if (t.type === "svg" ? o = "svg" : t.type === "math" && (o = "mathml"), e == null) ne(t, n, r, i, a, o, s, c);
		else {
			let n = e.el && e.el._isVueCE ? e.el : null;
			try {
				n && n._beginPatch(), ie(e, t, i, a, o, s, c);
			} finally {
				n && n._endPatch();
			}
		}
	}, ne = (e, t, n, r, i, a, s, u) => {
		let d, f, { props: m, shapeFlag: h, transition: g, dirs: _ } = e;
		if (d = e.el = l(e.type, a, m && m.is, m), h & 8 ? p(d, e.children) : h & 16 && w(e.children, d, null, r, i, hi(e, a), s, u), _ && kn(e, null, r, "created"), re(d, e, e.scopeId, s, r), m) {
			for (let e in m) e !== "value" && !te(e) && c(d, e, null, m[e], a, r);
			"value" in m && c(d, "value", null, m.value, a), (f = m.onVnodeBeforeMount) && qi(f, r, e);
		}
		_ && kn(e, null, r, "beforeMount");
		let v = _i(i, g);
		v && g.beforeEnter(d), o(d, t, n), ((f = m && m.onVnodeMounted) || v || _) && R(() => {
			try {
				f && qi(f, r, e), v && g.enter(d), _ && kn(e, null, r, "mounted");
			} finally {}
		}, i);
	}, re = (e, t, n, r, i) => {
		if (n && g(e, n), r) for (let t = 0; t < r.length; t++) g(e, r[t]);
		if (i) {
			let n = i.subTree;
			if (t === n || Ci(n.type) && (n.ssContent === t || n.ssFallback === t)) {
				let t = i.vnode;
				re(e, t, t.scopeId, t.slotScopeIds, i.parent);
			}
		}
	}, w = (e, t, n, r, i, a, o, s, c = 0) => {
		for (let l = c; l < e.length; l++) {
			let c = e[l] = s ? Wi(e[l]) : Ui(e[l]);
			v(null, c, t, n, r, i, a, o, s);
		}
	}, ie = (e, n, r, i, a, o, s) => {
		let l = n.el = e.el, { patchFlag: u, dynamicChildren: d, dirs: f } = n;
		u |= e.patchFlag & 16;
		let m = e.props || t, h = n.props || t, g;
		if (r && gi(r, !1), (g = h.onVnodeBeforeUpdate) && qi(g, r, n, e), f && kn(n, e, r, "beforeUpdate"), r && gi(r, !0), d && (!e.dynamicChildren || e.dynamicChildren.length !== d.length) && (u = 0, s = !1, d = null), (m.innerHTML && h.innerHTML == null || m.textContent && h.textContent == null) && p(l, ""), d ? T(e.dynamicChildren, d, l, r, i, hi(n, a), o) : s || pe(e, n, l, null, r, i, hi(n, a), o, !1), u > 0) {
			if (u & 16) ae(l, m, h, r, a);
			else if (u & 2 && m.class !== h.class && c(l, "class", null, h.class, a), u & 4 && c(l, "style", m.style, h.style, a), u & 8) {
				let e = n.dynamicProps;
				for (let t = 0; t < e.length; t++) {
					let n = e[t], i = m[n], o = h[n];
					(o !== i || n === "value") && c(l, n, i, o, a, r);
				}
			}
			u & 1 && e.children !== n.children && p(l, n.children);
		} else !s && d == null && ae(l, m, h, r, a);
		((g = h.onVnodeUpdated) || f) && R(() => {
			g && qi(g, r, n, e), f && kn(n, e, r, "updated");
		}, i);
	}, T = (e, t, n, r, i, a, o) => {
		for (let s = 0; s < t.length; s++) {
			let c = e[s], l = t[s], u = c.el && (c.type === z || !Ii(c, l) || c.shapeFlag & 198) ? m(c.el) : n;
			v(c, l, u, null, r, i, a, o, !0);
		}
	}, ae = (e, n, r, i, a) => {
		if (n !== r) {
			if (n !== t) for (let t in n) !te(t) && !(t in r) && c(e, t, n[t], null, a, i);
			for (let t in r) {
				if (te(t)) continue;
				let o = r[t], s = n[t];
				o !== s && t !== "value" && c(e, t, s, o, a, i);
			}
			"value" in r && c(e, "value", n.value, r.value, a);
		}
	}, oe = (e, t, n, r, i, a, s, c, l) => {
		let d = t.el = e ? e.el : u(""), f = t.anchor = e ? e.anchor : u(""), { patchFlag: p, dynamicChildren: m, slotScopeIds: h } = t;
		h && (c = c ? c.concat(h) : h), e == null ? (o(d, n, r), o(f, n, r), w(t.children || [], n, f, i, a, s, c, l)) : p > 0 && p & 64 && m && e.dynamicChildren && e.dynamicChildren.length === m.length ? (T(e.dynamicChildren, m, n, i, a, s, c), (t.key != null || i && t === i.subTree) && vi(e, t, !0)) : pe(e, t, n, f, i, a, s, c, l);
	}, se = (e, t, n, r, i, a, o, s, c) => {
		t.slotScopeIds = s, e == null ? t.shapeFlag & 512 ? i.ctx.activate(t, n, r, o, c) : E(t, n, r, i, a, o, c) : le(e, t, c);
	}, E = (e, t, n, r, i, a, o) => {
		let s = e.component = Xi(e, r, i);
		if (Yn(e) && (s.ctx.renderer = O), ia(s, !1, o), s.asyncDep) {
			if (i && i.registerDep(s, ue, o), !e.el) {
				let r = s.subTree = U(Ei);
				b(null, r, t, n), e.placeholder = r.el;
			}
		} else ue(s, e, t, n, i, a, o);
	}, le = (e, t, n) => {
		let r = t.component = e.component;
		if (Gr(e, t, n)) if (r.asyncDep && !r.asyncResolved) {
			fe(r, t, n);
			return;
		} else r.next = t, r.update();
		else t.el = e.el, r.vnode = t;
	}, ue = (e, t, n, r, i, a, o) => {
		let s = () => {
			if (e.isMounted) {
				let { next: t, bu: n, u: r, parent: s, vnode: c } = e;
				{
					let n = bi(e);
					if (n) {
						t && (t.el = c.el, fe(e, t, o)), n.asyncDep.then(() => {
							R(() => {
								e.isUnmounted || l();
							}, i);
						});
						return;
					}
				}
				let u = t, d;
				gi(e, !1), t ? (t.el = c.el, fe(e, t, o)) : t = c, n && ce(n), (d = t.props && t.props.onVnodeBeforeUpdate) && qi(d, s, t, c), gi(e, !0);
				let f = Hr(e), p = e.subTree;
				e.subTree = f, v(p, f, m(p.el), xe(p), e, i, a), t.el = f.el, u === null && Jr(e, f.el), r && R(r, i), (d = t.props && t.props.onVnodeUpdated) && R(() => qi(d, s, t, c), i);
			} else {
				let o, { el: s, props: c } = t, { bm: l, m: u, parent: d, root: f, type: p } = e, m = Jn(t);
				if (gi(e, !1), l && ce(l), !m && (o = c && c.onVnodeBeforeMount) && qi(o, d, t), gi(e, !0), s && Te) {
					let t = () => {
						e.subTree = Hr(e), Te(s, e.subTree, e, i, null);
					};
					m && p.__asyncHydrate ? p.__asyncHydrate(s, e, t) : t();
				} else {
					f.ce && f.ce._hasShadowRoot() && f.ce._injectChildStyle(p, e.parent ? e.parent.type : void 0);
					let o = e.subTree = Hr(e);
					v(null, o, n, r, e, i, a), t.el = o.el;
				}
				if (u && R(u, i), !m && (o = c && c.onVnodeMounted)) {
					let e = t;
					R(() => qi(o, d, e), i);
				}
				(t.shapeFlag & 256 || d && Jn(d.vnode) && d.vnode.shapeFlag & 256) && e.a && R(e.a, i), e.isMounted = !0, t = n = r = null;
			}
		};
		e.scope.on();
		let c = e.effect = new ke(s);
		e.scope.off();
		let l = e.update = c.run.bind(c), u = e.job = c.runIfDirty.bind(c);
		u.i = e, u.id = e.uid, c.scheduler = () => vn(u), gi(e, !0), l();
	}, fe = (e, t, n) => {
		t.component = e;
		let r = e.vnode.props;
		e.vnode = t, e.next = null, $r(e, t.props, r, n), fi(e, t.children, n), We(), xn(e), Ge();
	}, pe = (e, t, n, r, i, a, o, s, c = !1) => {
		let l = e && e.children, u = e ? e.shapeFlag : 0, d = t.children, { patchFlag: f, shapeFlag: m } = t;
		if (f > 0) {
			if (f & 128) {
				he(l, d, n, r, i, a, o, s, c);
				return;
			} else if (f & 256) {
				me(l, d, n, r, i, a, o, s, c);
				return;
			}
		}
		m & 8 ? (u & 16 && be(l, i, a), d !== l && p(n, d)) : u & 16 ? m & 16 ? he(l, d, n, r, i, a, o, s, c) : be(l, i, a, !0) : (u & 8 && p(n, ""), m & 16 && w(d, n, r, i, a, o, s, c));
	}, me = (e, t, r, i, a, o, s, c, l) => {
		e ||= n, t ||= n;
		let u = e.length, d = t.length, f = Math.min(u, d), p;
		for (p = 0; p < f; p++) {
			let n = t[p] = l ? Wi(t[p]) : Ui(t[p]);
			v(e[p], n, r, null, a, o, s, c, l);
		}
		u > d ? be(e, a, o, !0, !1, f) : w(t, r, i, a, o, s, c, l, f);
	}, he = (e, t, r, i, a, o, s, c, l) => {
		let u = 0, d = t.length, f = e.length - 1, p = d - 1;
		for (; u <= f && u <= p;) {
			let n = e[u], i = t[u] = l ? Wi(t[u]) : Ui(t[u]);
			if (Ii(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			u++;
		}
		for (; u <= f && u <= p;) {
			let n = e[f], i = t[p] = l ? Wi(t[p]) : Ui(t[p]);
			if (Ii(n, i)) v(n, i, r, null, a, o, s, c, l);
			else break;
			f--, p--;
		}
		if (u > f) {
			if (u <= p) {
				let e = p + 1, n = e < d ? t[e].el : i;
				for (; u <= p;) v(null, t[u] = l ? Wi(t[u]) : Ui(t[u]), r, n, a, o, s, c, l), u++;
			}
		} else if (u > p) for (; u <= f;) D(e[u], a, o, !0), u++;
		else {
			let m = u, h = u, g = /* @__PURE__ */ new Map();
			for (u = h; u <= p; u++) {
				let e = t[u] = l ? Wi(t[u]) : Ui(t[u]);
				e.key != null && g.set(e.key, u);
			}
			let _, y = 0, b = p - h + 1, x = !1, ee = 0, S = Array(b);
			for (u = 0; u < b; u++) S[u] = 0;
			for (u = m; u <= f; u++) {
				let n = e[u];
				if (y >= b) {
					D(n, a, o, !0);
					continue;
				}
				let i;
				if (n.key != null) i = g.get(n.key);
				else for (_ = h; _ <= p; _++) if (S[_ - h] === 0 && Ii(n, t[_])) {
					i = _;
					break;
				}
				i === void 0 ? D(n, a, o, !0) : (S[i - h] = u + 1, i >= ee ? ee = i : x = !0, v(n, t[i], r, null, a, o, s, c, l), y++);
			}
			let C = x ? yi(S) : n;
			for (_ = C.length - 1, u = b - 1; u >= 0; u--) {
				let e = h + u, n = t[e], f = t[e + 1], p = e + 1 < d ? f.el || Si(f) : i;
				S[u] === 0 ? v(null, n, r, p, a, o, s, c, l) : x && (_ < 0 || u !== C[_] ? ge(n, r, p, 2) : _--);
			}
		}
	}, ge = (e, t, n, r, i = null) => {
		let { el: a, type: c, transition: l, children: u, shapeFlag: d } = e;
		if (d & 6) {
			ge(e.component.subTree, t, n, r);
			return;
		}
		if (d & 128) {
			e.suspense.move(t, n, r);
			return;
		}
		if (d & 64) {
			c.move(e, t, n, O);
			return;
		}
		if (c === z) {
			o(a, t, n);
			for (let e = 0; e < u.length; e++) ge(u[e], t, n, r);
			o(e.anchor, t, n);
			return;
		}
		if (c === Di) {
			ee(e, t, n);
			return;
		}
		if (r !== 2 && d & 1 && l) if (r === 0) l.persisted && !a[Bn] ? o(a, t, n) : (l.beforeEnter(a), o(a, t, n), R(() => l.enter(a), i));
		else {
			let { leave: r, delayLeave: i, afterLeave: c } = l, u = () => {
				e.ctx.isUnmounted ? s(a) : o(a, t, n);
			}, d = () => {
				let e = a._isLeaving || !!a[Bn];
				a._isLeaving && a[Bn](!0), l.persisted && !e ? u() : r(a, () => {
					u(), c && c();
				});
			};
			i ? i(a, u, d) : d();
		}
		else o(a, t, n);
	}, D = (e, t, n, r = !1, i = !1) => {
		let { type: a, props: o, ref: s, children: c, dynamicChildren: l, shapeFlag: u, patchFlag: d, dirs: f, cacheIndex: p, memo: m } = e;
		if (d === -2 && (i = !1), s != null && (We(), Kn(s, null, n, e, !0), Ge()), p != null && (t.renderCache[p] = void 0), u & 256) {
			t.ctx.deactivate(e);
			return;
		}
		let h = u & 1 && f, g = !Jn(e), _;
		if (g && (_ = o && o.onVnodeBeforeUnmount) && qi(_, t, e), u & 6) ye(e.component, n, r);
		else {
			if (u & 128) {
				e.suspense.unmount(n, r);
				return;
			}
			h && kn(e, null, t, "beforeUnmount"), u & 64 ? e.type.remove(e, t, n, O, r) : l && !l.hasOnce && (a !== z || d > 0 && d & 64) ? be(l, t, n, !1, !0) : (a === z && d & 384 || !i && u & 16) && be(c, t, n), r && _e(e);
		}
		let v = m != null && p == null;
		(g && (_ = o && o.onVnodeUnmounted) || h || v) && R(() => {
			_ && qi(_, t, e), h && kn(e, null, t, "unmounted"), v && (e.el = null);
		}, n);
	}, _e = (e) => {
		let { type: t, el: n, anchor: r, transition: i } = e;
		if (t === z) {
			ve(n, r);
			return;
		}
		if (t === Di) {
			S(e);
			return;
		}
		let a = () => {
			s(n), i && !i.persisted && i.afterLeave && i.afterLeave();
		};
		if (e.shapeFlag & 1 && i && !i.persisted) {
			let { leave: t, delayLeave: r } = i, o = () => t(n, a);
			r ? r(e.el, a, o) : o();
		} else a();
	}, ve = (e, t) => {
		let n;
		for (; e !== t;) n = h(e), s(e), e = n;
		s(t);
	}, ye = (e, t, n) => {
		let { bum: r, scope: i, job: a, subTree: o, um: s, m: c, a: l } = e;
		xi(c), xi(l), r && ce(r), i.stop(), a && (a.flags |= 8, D(o, e, t, n)), s && R(s, t), R(() => {
			e.isUnmounted = !0;
		}, t);
	}, be = (e, t, n, r = !1, i = !1, a = 0) => {
		for (let o = a; o < e.length; o++) D(e[o], t, n, r, i);
	}, xe = (e) => {
		if (e.shapeFlag & 6) return xe(e.component.subTree);
		if (e.shapeFlag & 128) return e.suspense.next();
		let t = h(e.anchor || e.el), n = t && t[Rn];
		return n ? h(n) : t;
	}, Se = !1, Ce = (e, t, n) => {
		let r;
		e == null ? t._vnode && (D(t._vnode, null, null, !0), r = t._vnode.component) : v(t._vnode || null, e, t, null, null, null, n), t._vnode = e, Se ||= (Se = !0, xn(r), Sn(), !1);
	}, O = {
		p: v,
		um: D,
		m: ge,
		r: _e,
		mt: E,
		mc: w,
		pc: pe,
		pbc: T,
		n: xe,
		o: e
	}, we, Te;
	return i && ([we, Te] = i(O)), {
		render: Ce,
		hydrate: we,
		createApp: Fr(Ce, we)
	};
}
function hi({ type: e, props: t }, n) {
	return n === "svg" && e === "foreignObject" || n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html") ? void 0 : n;
}
function gi({ effect: e, job: t }, n) {
	n ? (e.flags |= 32, t.flags |= 4) : (e.flags &= -33, t.flags &= -5);
}
function _i(e, t) {
	return (!e || e && !e.pendingBranch) && t && !t.persisted;
}
function vi(e, t, n = !1) {
	let r = e.children, i = t.children;
	if (d(r) && d(i)) for (let e = 0; e < r.length; e++) {
		let t = r[e], a = i[e];
		a.shapeFlag & 1 && !a.dynamicChildren && ((a.patchFlag <= 0 || a.patchFlag === 32) && (a = i[e] = Wi(i[e]), a.el = t.el), !n && a.patchFlag !== -2 && vi(t, a)), a.type === Ti && (a.patchFlag === -1 && (a = i[e] = Wi(a)), a.el = t.el), a.type === Ei && !a.el && (a.el = t.el);
	}
}
function yi(e) {
	let t = e.slice(), n = [0], r, i, a, o, s, c = e.length;
	for (r = 0; r < c; r++) {
		let c = e[r];
		if (c !== 0) {
			if (i = n[n.length - 1], e[i] < c) {
				t[r] = i, n.push(r);
				continue;
			}
			for (a = 0, o = n.length - 1; a < o;) s = a + o >> 1, e[n[s]] < c ? a = s + 1 : o = s;
			c < e[n[a]] && (a > 0 && (t[r] = n[a - 1]), n[a] = r);
		}
	}
	for (a = n.length, o = n[a - 1]; a-- > 0;) n[a] = o, o = t[o];
	return n;
}
function bi(e) {
	let t = e.subTree.component;
	if (t) return t.asyncDep && !t.asyncResolved ? t : bi(t);
}
function xi(e) {
	if (e) for (let t = 0; t < e.length; t++) e[t].flags |= 8;
}
function Si(e) {
	if (e.placeholder) return e.placeholder;
	let t = e.component;
	return t ? Si(t.subTree) : null;
}
var Ci = (e) => e.__isSuspense;
function wi(e, t) {
	t && t.pendingBranch ? d(e) ? t.effects.push(...e) : t.effects.push(e) : bn(e);
}
var z = /* @__PURE__ */ Symbol.for("v-fgt"), Ti = /* @__PURE__ */ Symbol.for("v-txt"), Ei = /* @__PURE__ */ Symbol.for("v-cmt"), Di = /* @__PURE__ */ Symbol.for("v-stc"), Oi = [], ki = null;
function B(e = !1) {
	Oi.push(ki = e ? null : []);
}
function Ai() {
	Oi.pop(), ki = Oi[Oi.length - 1] || null;
}
var ji = 1;
function Mi(e, t = !1) {
	ji += e, e < 0 && ki && t && (ki.hasOnce = !0);
}
function Ni(e) {
	return e.dynamicChildren = ji > 0 ? ki || n : null, Ai(), ji > 0 && ki && ki.push(e), e;
}
function V(e, t, n, r, i, a) {
	return Ni(H(e, t, n, r, i, a, !0));
}
function Pi(e, t, n, r, i) {
	return Ni(U(e, t, n, r, i, !0));
}
function Fi(e) {
	return e ? e.__v_isVNode === !0 : !1;
}
function Ii(e, t) {
	return e.type === t.type && e.key === t.key;
}
var Li = ({ key: e }) => e ?? null, Ri = ({ ref: e, ref_key: t, ref_for: n }) => (typeof e == "number" && (e = "" + e), e == null ? null : g(e) || /* @__PURE__ */ N(e) || h(e) ? {
	i: Tn,
	r: e,
	k: t,
	f: !!n
} : e);
function H(e, t = null, n = null, r = 0, i = null, a = e === z ? 0 : 1, o = !1, s = !1) {
	let c = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e,
		props: t,
		key: t && Li(t),
		ref: t && Ri(t),
		scopeId: En,
		slotScopeIds: null,
		children: n,
		component: null,
		suspense: null,
		ssContent: null,
		ssFallback: null,
		dirs: null,
		transition: null,
		el: null,
		anchor: null,
		target: null,
		targetStart: null,
		targetAnchor: null,
		staticCount: 0,
		shapeFlag: a,
		patchFlag: r,
		dynamicProps: i,
		dynamicChildren: null,
		appContext: null,
		ctx: Tn
	};
	return s ? (Gi(c, n), a & 128 && e.normalize(c)) : n && (c.shapeFlag |= g(n) ? 8 : 16), ji > 0 && !o && ki && (c.patchFlag > 0 || a & 6) && c.patchFlag !== 32 && ki.push(c), c;
}
var U = zi;
function zi(e, t = null, n = null, r = 0, i = null, a = !1) {
	if ((!e || e === fr) && (e = Ei), Fi(e)) {
		let r = Vi(e, t, !0);
		return n && Gi(r, n), ji > 0 && !a && ki && (r.shapeFlag & 6 ? ki[ki.indexOf(e)] = r : ki.push(r)), r.patchFlag = -2, r;
	}
	if (pa(e) && (e = e.__vccOpts), t) {
		t = Bi(t);
		let { class: e, style: n } = t;
		e && !g(e) && (t.class = D(e)), v(n) && (/* @__PURE__ */ Ht(n) && !d(n) && (n = s({}, n)), t.style = fe(n));
	}
	let o = g(e) ? 1 : Ci(e) ? 128 : zn(e) ? 64 : v(e) ? 4 : h(e) ? 2 : 0;
	return H(e, t, n, r, i, o, a, !0);
}
function Bi(e) {
	return e ? /* @__PURE__ */ Ht(e) || Zr(e) ? s({}, e) : e : null;
}
function Vi(e, t, n = !1, r = !1) {
	let { props: i, ref: a, patchFlag: o, children: s, transition: c } = e, l = t ? Ki(i || {}, t) : i, u = {
		__v_isVNode: !0,
		__v_skip: !0,
		type: e.type,
		props: l,
		key: l && Li(l),
		ref: t && t.ref ? n && a ? d(a) ? a.concat(Ri(t)) : [a, Ri(t)] : Ri(t) : a,
		scopeId: e.scopeId,
		slotScopeIds: e.slotScopeIds,
		children: s,
		target: e.target,
		targetStart: e.targetStart,
		targetAnchor: e.targetAnchor,
		staticCount: e.staticCount,
		shapeFlag: e.shapeFlag,
		patchFlag: t && e.type !== z ? o === -1 ? 16 : o | 16 : o,
		dynamicProps: e.dynamicProps,
		dynamicChildren: e.dynamicChildren,
		appContext: e.appContext,
		dirs: e.dirs,
		transition: c,
		component: e.component,
		suspense: e.suspense,
		ssContent: e.ssContent && Vi(e.ssContent),
		ssFallback: e.ssFallback && Vi(e.ssFallback),
		placeholder: e.placeholder,
		el: e.el,
		anchor: e.anchor,
		ctx: e.ctx,
		ce: e.ce
	};
	return c && r && Vn(u, c.clone(u)), u;
}
function W(e = " ", t = 0) {
	return U(Ti, null, e, t);
}
function Hi(e = "", t = !1) {
	return t ? (B(), Pi(Ei, null, e)) : U(Ei, null, e);
}
function Ui(e) {
	return e == null || typeof e == "boolean" ? U(Ei) : d(e) ? U(z, null, e.slice()) : Fi(e) ? Wi(e) : U(Ti, null, String(e));
}
function Wi(e) {
	return e.el === null && e.patchFlag !== -1 || e.memo ? e : Vi(e);
}
function Gi(e, t) {
	let n = 0, { shapeFlag: r } = e;
	if (t == null) t = null;
	else if (d(t)) n = 16;
	else if (typeof t == "object") if (r & 65) {
		let n = t.default;
		n && (n._c && (n._d = !1), Gi(e, n()), n._c && (n._d = !0));
		return;
	} else {
		n = 32;
		let r = t._;
		!r && !Zr(t) ? t._ctx = Tn : r === 3 && Tn && (Tn.slots._ === 1 ? t._ = 1 : (t._ = 2, e.patchFlag |= 1024));
	}
	else if (h(t)) {
		if (r & 65) {
			Gi(e, { default: t });
			return;
		}
		t = {
			default: t,
			_ctx: Tn
		}, n = 32;
	} else t = String(t), r & 64 ? (n = 16, t = [W(t)]) : n = 8;
	e.children = t, e.shapeFlag |= n;
}
function Ki(...e) {
	let t = {};
	for (let n = 0; n < e.length; n++) {
		let r = e[n];
		for (let e in r) if (e === "class") t.class !== r.class && (t.class = D([t.class, r.class]));
		else if (e === "style") t.style = fe([t.style, r.style]);
		else if (a(e)) {
			let n = t[e], i = r[e];
			i && n !== i && !(d(n) && n.includes(i)) ? t[e] = n ? [].concat(n, i) : i : i == null && n == null && !o(e) && (t[e] = i);
		} else e !== "" && (t[e] = r[e]);
	}
	return t;
}
function qi(e, t, n, r = null) {
	sn(e, t, 7, [n, r]);
}
var Ji = Nr(), Yi = 0;
function Xi(e, n, r) {
	let i = e.type, a = (n ? n.appContext : e.appContext) || Ji, o = {
		uid: Yi++,
		vnode: e,
		type: i,
		parent: n,
		appContext: a,
		root: null,
		next: null,
		subTree: null,
		effect: null,
		update: null,
		job: null,
		scope: new Ee(!0),
		render: null,
		proxy: null,
		exposed: null,
		exposeProxy: null,
		withProxy: null,
		provides: n ? n.provides : Object.create(a.provides),
		ids: n ? n.ids : [
			"",
			0,
			0
		],
		accessCache: null,
		renderCache: [],
		components: null,
		directives: null,
		propsOptions: ri(i, a),
		emitsOptions: Br(i, a),
		emit: null,
		emitted: null,
		propsDefaults: t,
		inheritAttrs: i.inheritAttrs,
		ctx: t,
		data: t,
		props: t,
		attrs: t,
		slots: t,
		refs: t,
		setupState: t,
		setupContext: null,
		suspense: r,
		suspenseId: r ? r.pendingId : 0,
		asyncDep: null,
		asyncResolved: !1,
		isMounted: !1,
		isUnmounted: !1,
		isDeactivated: !1,
		bc: null,
		c: null,
		bm: null,
		m: null,
		bu: null,
		u: null,
		um: null,
		bum: null,
		da: null,
		a: null,
		rtg: null,
		rtc: null,
		ec: null,
		sp: null
	};
	return o.ctx = { _: o }, o.root = n ? n.root : o, o.emit = Rr.bind(null, o), e.ce && e.ce(o), o;
}
var G = null, Zi = () => G || Tn, Qi, $i;
{
	let e = de(), t = (t, n) => {
		let r;
		return (r = e[t]) || (r = e[t] = []), r.push(n), (e) => {
			r.length > 1 ? r.forEach((t) => t(e)) : r[0](e);
		};
	};
	Qi = t("__VUE_INSTANCE_SETTERS__", (e) => G = e), $i = t("__VUE_SSR_SETTERS__", (e) => ra = e);
}
var ea = (e) => {
	let t = G;
	return Qi(e), e.scope.on(), () => {
		e.scope.off(), Qi(t);
	};
}, ta = () => {
	G && G.scope.off(), Qi(null);
};
function na(e) {
	return e.vnode.shapeFlag & 4;
}
var ra = !1;
function ia(e, t = !1, n = !1) {
	t && $i(t);
	let { props: r, children: i } = e.vnode, a = na(e);
	Qr(e, r, a, t), di(e, i, n || t);
	let o = a ? aa(e, t) : void 0;
	return t && $i(!1), o;
}
function aa(e, t) {
	let n = e.type;
	e.accessCache = /* @__PURE__ */ Object.create(null), e.proxy = new Proxy(e.ctx, _r);
	let { setup: r } = n;
	if (r) {
		We();
		let n = e.setupContext = r.length > 1 ? da(e) : null, i = ea(e), a = on(r, e, 0, [e.props, n]), o = y(a);
		if (Ge(), i(), (o || e.sp) && !Jn(e) && Un(e), o) {
			if (a.then(ta, ta), t) return a.then((n) => {
				oa(e, n, t);
			}).catch((t) => {
				cn(t, e, 0);
			});
			e.asyncDep = a;
		} else oa(e, a, t);
	} else la(e, t);
}
function oa(e, t, n) {
	h(t) ? e.type.__ssrInlineRender ? e.ssrRender = t : e.render = t : v(t) && (e.setupState = Xt(t)), la(e, n);
}
var sa, ca;
function la(e, t, n) {
	let i = e.type;
	if (!e.render) {
		if (!t && sa && !i.render) {
			let t = i.template || wr(e).template;
			if (t) {
				let { isCustomElement: n, compilerOptions: r } = e.appContext.config, { delimiters: a, compilerOptions: o } = i;
				i.render = sa(t, s(s({
					isCustomElement: n,
					delimiters: a
				}, r), o));
			}
		}
		e.render = i.render || r, ca && ca(e);
	}
	{
		let t = ea(e);
		We();
		try {
			br(e);
		} finally {
			Ge(), t();
		}
	}
}
var ua = { get(e, t) {
	return j(e, "get", ""), e[t];
} };
function da(e) {
	return {
		attrs: new Proxy(e.attrs, ua),
		slots: e.slots,
		emit: e.emit,
		expose: (t) => {
			e.exposed = t || {};
		}
	};
}
function fa(e) {
	return e.exposed ? e.exposeProxy ||= new Proxy(Xt(Ut(e.exposed)), {
		get(t, n) {
			if (n in t) return t[n];
			if (n in hr) return hr[n](e);
		},
		has(e, t) {
			return t in e || t in hr;
		}
	}) : e.proxy;
}
function pa(e) {
	return h(e) && "__vccOpts" in e;
}
var K = (e, t) => /* @__PURE__ */ Qt(e, t, ra), ma = "3.5.40", ha = void 0, ga = typeof window < "u" && window.trustedTypes;
if (ga) try {
	ha = /* @__PURE__ */ ga.createPolicy("vue", { createHTML: (e) => e });
} catch {}
var _a = ha ? (e) => ha.createHTML(e) : (e) => e, va = "http://www.w3.org/2000/svg", ya = "http://www.w3.org/1998/Math/MathML", ba = typeof document < "u" ? document : null, xa = ba && /* @__PURE__ */ ba.createElement("template"), Sa = {
	insert: (e, t, n) => {
		t.insertBefore(e, n || null);
	},
	remove: (e) => {
		let t = e.parentNode;
		t && t.removeChild(e);
	},
	createElement: (e, t, n, r) => {
		let i = t === "svg" ? ba.createElementNS(va, e) : t === "mathml" ? ba.createElementNS(ya, e) : n ? ba.createElement(e, { is: n }) : ba.createElement(e);
		return e === "select" && r && r.multiple != null && i.setAttribute("multiple", r.multiple), i;
	},
	createText: (e) => ba.createTextNode(e),
	createComment: (e) => ba.createComment(e),
	setText: (e, t) => {
		e.nodeValue = t;
	},
	setElementText: (e, t) => {
		e.textContent = t;
	},
	parentNode: (e) => e.parentNode,
	nextSibling: (e) => e.nextSibling,
	querySelector: (e) => ba.querySelector(e),
	setScopeId(e, t) {
		e.setAttribute(t, "");
	},
	insertStaticContent(e, t, n, r, i, a) {
		let o = n ? n.previousSibling : t.lastChild;
		if (i && (i === a || i.nextSibling)) for (; t.insertBefore(i.cloneNode(!0), n), !(i === a || !(i = i.nextSibling)););
		else {
			xa.innerHTML = _a(r === "svg" ? `<svg>${e}</svg>` : r === "mathml" ? `<math>${e}</math>` : e);
			let i = xa.content;
			if (r === "svg" || r === "mathml") {
				let e = i.firstChild;
				for (; e.firstChild;) i.appendChild(e.firstChild);
				i.removeChild(e);
			}
			t.insertBefore(i, n);
		}
		return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
	}
}, Ca = /* @__PURE__ */ Symbol("_vtc");
function wa(e, t, n) {
	let r = e[Ca];
	r && (t = (t ? [t, ...r] : [...r]).join(" ")), t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : e.className = t;
}
var Ta = /* @__PURE__ */ Symbol("_vod"), Ea = /* @__PURE__ */ Symbol("_vsh"), Da = {
	name: "show",
	beforeMount(e, { value: t }, { transition: n }) {
		e[Ta] = e.style.display === "none" ? "" : e.style.display, n && t ? n.beforeEnter(e) : Oa(e, t);
	},
	mounted(e, { value: t }, { transition: n }) {
		n && t && n.enter(e);
	},
	updated(e, { value: t, oldValue: n }, { transition: r }) {
		!t != !n && (r ? t ? (r.beforeEnter(e), Oa(e, !0), r.enter(e)) : r.leave(e, () => {
			Oa(e, !1);
		}) : Oa(e, t));
	},
	beforeUnmount(e, { value: t }) {
		Oa(e, t);
	}
};
function Oa(e, t) {
	e.style.display = t ? e[Ta] : "none", e[Ea] = !t;
}
var ka = /* @__PURE__ */ Symbol(""), Aa = /(?:^|;)\s*display\s*:/;
function ja(e, t, n) {
	let r = e.style, i = g(n), a = !1;
	if (n && !i) {
		if (t) if (g(t)) for (let e of t.split(";")) {
			let t = e.slice(0, e.indexOf(":")).trim();
			n[t] ?? Na(r, t, "");
		}
		else for (let e in t) n[e] ?? Na(r, e, "");
		for (let i in n) {
			i === "display" && (a = !0);
			let o = n[i];
			o == null ? Na(r, i, "") : La(e, i, !g(t) && t ? t[i] : void 0, o) || Na(r, i, o);
		}
	} else if (i) {
		if (t !== n) {
			let e = r[ka];
			e && (n += ";" + e), r.cssText = n, a = Aa.test(n);
		}
	} else t && e.removeAttribute("style");
	Ta in e && (e[Ta] = a ? r.display : "", e[Ea] && (r.display = "none"));
}
var Ma = /\s*!important$/;
function Na(e, t, n) {
	if (d(n)) n.forEach((n) => Na(e, t, n));
	else if (n ??= "", t.startsWith("--")) e.setProperty(t, n);
	else {
		let r = Ia(e, t);
		Ma.test(n) ? e.setProperty(T(r), n.replace(Ma, ""), "important") : e[r] = n;
	}
}
var Pa = [
	"Webkit",
	"Moz",
	"ms"
], Fa = {};
function Ia(e, t) {
	let n = Fa[t];
	if (n) return n;
	let r = w(t);
	if (r !== "filter" && r in e) return Fa[t] = r;
	r = ae(r);
	for (let n = 0; n < Pa.length; n++) {
		let i = Pa[n] + r;
		if (i in e) return Fa[t] = i;
	}
	return t;
}
function La(e, t, n, r) {
	return e.tagName === "TEXTAREA" && (t === "width" || t === "height") && g(r) && n === r;
}
var Ra = "http://www.w3.org/1999/xlink";
function za(e, t, n, r, i, a = ve(t)) {
	r && t.startsWith("xlink:") ? n == null ? e.removeAttributeNS(Ra, t.slice(6, t.length)) : e.setAttributeNS(Ra, t, n) : n == null || a && !ye(n) ? e.removeAttribute(t) : e.setAttribute(t, a ? "" : _(n) ? String(n) : n);
}
function Ba(e, t, n, r, i) {
	if (t === "innerHTML" || t === "textContent") {
		n != null && (e[t] = t === "innerHTML" ? _a(n) : n);
		return;
	}
	let a = e.tagName;
	if (t === "value" && a !== "PROGRESS" && !a.includes("-")) {
		let r = a === "OPTION" ? e.getAttribute("value") || "" : e.value, i = n == null ? e.type === "checkbox" ? "on" : "" : String(n);
		(r !== i || !("_value" in e)) && (e.value = i), n ?? e.removeAttribute(t), e._value = n;
		return;
	}
	let o = !1;
	if (n === "" || n == null) {
		let r = typeof e[t];
		r === "boolean" ? n = ye(n) : n == null && r === "string" ? (n = "", o = !0) : r === "number" && (n = 0, o = !0);
	}
	try {
		e[t] = n;
	} catch {}
	o && e.removeAttribute(i || t);
}
function Va(e, t, n, r) {
	e.addEventListener(t, n, r);
}
function Ha(e, t, n, r) {
	e.removeEventListener(t, n, r);
}
var Ua = /* @__PURE__ */ Symbol("_vei");
function Wa(e, t, n, r, i = null) {
	let a = e[Ua] || (e[Ua] = {}), o = a[t];
	if (r && o) o.value = r;
	else {
		let [n, s] = qa(t);
		r ? Va(e, n, a[t] = Za(r, i), s) : o && (Ha(e, n, o, s), a[t] = void 0);
	}
}
var Ga = /(Once|Passive|Capture)$/, Ka = /^on:?(?:Once|Passive|Capture)$/;
function qa(e) {
	let t, n;
	for (; (n = e.match(Ga)) && !Ka.test(e);) t ||= {}, e = e.slice(0, e.length - n[1].length), t[n[1].toLowerCase()] = !0;
	return [e[2] === ":" ? e.slice(3) : T(e.slice(2)), t];
}
var Ja = 0, Ya = /* @__PURE__ */ Promise.resolve(), Xa = () => Ja ||= (Ya.then(() => Ja = 0), Date.now());
function Za(e, t) {
	let n = (e) => {
		if (!e._vts) e._vts = Date.now();
		else if (e._vts <= n.attached) return;
		let r = n.value;
		if (d(r)) {
			let n = e.stopImmediatePropagation;
			e.stopImmediatePropagation = () => {
				n.call(e), e._stopped = !0;
			};
			let i = r.slice(), a = [e];
			for (let n = 0; n < i.length && !e._stopped; n++) {
				let e = i[n];
				e && sn(e, t, 5, a);
			}
		} else sn(r, t, 5, [e]);
	};
	return n.value = e, n.attached = Xa(), n;
}
var Qa = (e) => e.charCodeAt(0) === 111 && e.charCodeAt(1) === 110 && e.charCodeAt(2) > 96 && e.charCodeAt(2) < 123, $a = (e, t, n, r, i, s) => {
	let c = i === "svg";
	t === "class" ? wa(e, r, c) : t === "style" ? ja(e, n, r) : a(t) ? o(t) || Wa(e, t, n, r, s) : (t[0] === "." ? (t = t.slice(1), !0) : t[0] === "^" ? (t = t.slice(1), !1) : eo(e, t, r, c)) ? (Ba(e, t, r), !e.tagName.includes("-") && (t === "value" || t === "checked" || t === "selected") && za(e, t, r, c, s, t !== "value")) : e._isVueCE && (to(e, t) || e._def.__asyncLoader && (/[A-Z]/.test(t) || !g(r))) ? Ba(e, w(t), r, s, t) : (t === "true-value" ? e._trueValue = r : t === "false-value" && (e._falseValue = r), za(e, t, r, c));
};
function eo(e, t, n, r) {
	if (r) return !!(t === "innerHTML" || t === "textContent" || t in e && Qa(t) && h(n));
	if (t === "spellcheck" || t === "draggable" || t === "translate" || t === "autocorrect" || t === "sandbox" && e.tagName === "IFRAME" || t === "form" || t === "list" && e.tagName === "INPUT" || t === "type" && e.tagName === "TEXTAREA") return !1;
	if (t === "width" || t === "height") {
		let t = e.tagName;
		if (t === "IMG" || t === "VIDEO" || t === "CANVAS" || t === "SOURCE") return !1;
	}
	return Qa(t) && g(n) ? !1 : t in e;
}
function to(e, t) {
	let n = e._def.props;
	if (!n) return !1;
	let r = w(t);
	return Array.isArray(n) ? n.some((e) => w(e) === r) : Object.keys(n).some((e) => w(e) === r);
}
var no = (e) => {
	let t = e.props["onUpdate:modelValue"] || !1;
	return d(t) ? (e) => ce(t, e) : t;
};
function ro(e) {
	e.target.composing = !0;
}
function io(e) {
	let t = e.target;
	t.composing && (t.composing = !1, t.dispatchEvent(new Event("input")));
}
var ao = /* @__PURE__ */ Symbol("_assign");
function oo(e, t, n) {
	return t && (e = e.trim()), n && (e = le(e)), e;
}
var q = {
	created(e, { modifiers: { lazy: t, trim: n, number: r } }, i) {
		e[ao] = no(i);
		let a = r || i.props && i.props.type === "number";
		Va(e, t ? "change" : "input", (t) => {
			t.target.composing || e[ao](oo(e.value, n, a));
		}), (n || a) && Va(e, "change", () => {
			e.value = oo(e.value, n, a);
		}), t || (Va(e, "compositionstart", ro), Va(e, "compositionend", io), Va(e, "change", io));
	},
	mounted(e, { value: t }) {
		e.value = t ?? "";
	},
	beforeUpdate(e, { value: t, oldValue: n, modifiers: { lazy: r, trim: i, number: a } }, o) {
		if (e[ao] = no(o), e.composing) return;
		let s = (a || e.type === "number") && !/^0\d/.test(e.value) ? le(e.value) : e.value, c = t ?? "";
		if (s === c) return;
		let l = e.getRootNode();
		(l instanceof Document || l instanceof ShadowRoot) && l.activeElement === e && e.type !== "range" && (r && t === n || i && e.value.trim() === c) || (e.value = c);
	}
}, so = {
	deep: !0,
	created(e, t, n) {
		e[ao] = no(n), Va(e, "change", () => {
			let t = e._modelValue, n = fo(e), r = e.checked, i = e[ao];
			if (d(t)) {
				let e = Se(t, n), a = e !== -1;
				if (r && !a) i(t.concat(n));
				else if (!r && a) {
					let n = [...t];
					n.splice(e, 1), i(n);
				}
			} else if (p(t)) {
				let e = new Set(t);
				r ? e.add(n) : e.delete(n), i(e);
			} else i(po(e, r));
		});
	},
	mounted: co,
	beforeUpdate(e, t, n) {
		e[ao] = no(n), co(e, t, n);
	}
};
function co(e, { value: t, oldValue: n }, r) {
	e._modelValue = t;
	let i;
	if (d(t)) i = Se(t, r.props.value) > -1;
	else if (p(t)) i = t.has(r.props.value);
	else {
		if (t === n) return;
		i = xe(t, po(e, !0));
	}
	e.checked !== i && (e.checked = i);
}
var lo = {
	deep: !0,
	created(e, { value: t, modifiers: { number: n } }, r) {
		e._modelValue = t, Va(e, "change", () => {
			let t = Array.prototype.filter.call(e.options, (e) => e.selected).map((e) => n ? le(fo(e)) : fo(e));
			e[ao](e.multiple ? p(e._modelValue) ? new Set(t) : t : t[0]), e._assigning = !0, gn(() => {
				e._assigning = !1;
			});
		}), e[ao] = no(r);
	},
	mounted(e, { value: t }) {
		uo(e, t);
	},
	beforeUpdate(e, { value: t }, n) {
		e._modelValue = t, e[ao] = no(n);
	},
	updated(e, { value: t }) {
		e._assigning || uo(e, t);
	}
};
function uo(e, t) {
	let n = e.multiple, r = d(t);
	if (!(n && !r && !p(t))) {
		for (let i = 0, a = e.options.length; i < a; i++) {
			let a = e.options[i], o = fo(a);
			if (n) if (r) {
				let e = typeof o;
				e === "string" || e === "number" ? a.selected = t.some((e) => String(e) === String(o)) : a.selected = Se(t, o) > -1;
			} else a.selected = t.has(o);
			else if (xe(fo(a), t)) {
				e.selectedIndex !== i && (e.selectedIndex = i);
				return;
			}
		}
		!n && e.selectedIndex !== -1 && (e.selectedIndex = -1);
	}
}
function fo(e) {
	return "_value" in e ? e._value : e.value;
}
function po(e, t) {
	let n = t ? "_trueValue" : "_falseValue";
	return n in e ? e[n] : t;
}
var mo = /* @__PURE__ */ s({ patchProp: $a }, Sa), ho;
function go() {
	return ho ||= pi(mo);
}
var _o = ((...e) => {
	let t = go().createApp(...e), { mount: n } = t;
	return t.mount = (e) => {
		let r = yo(e);
		if (!r) return;
		let i = t._component;
		!h(i) && !i.render && !i.template && (i.template = r.innerHTML), r.nodeType === 1 && (r.textContent = "");
		let a = n(r, !1, vo(r));
		return r instanceof Element && (r.removeAttribute("v-cloak"), r.setAttribute("data-v-app", "")), a;
	}, t;
});
function vo(e) {
	if (e instanceof SVGElement) return "svg";
	if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function yo(e) {
	return g(e) ? document.querySelector(e) : e;
}
//#endregion
//#region src/settings/defaults.ts
var J = Object.freeze({
	enabled: !0,
	verbatimTurns: 10,
	turnsPerSummary: 3,
	snippetsPerLayer: 30,
	snippetsPerPromotion: 3,
	maxLayers: 5,
	injectionTemplate: "\n\n<summary>\n{{summary}}\n</summary>\n\n",
	summarizerSystemPrompt: "Role: precise narrative-state tracker. Output only the summary line — no preamble, no commentary, no markdown.",
	summarizerUserPrompt: "",
	promptPreset: "narrative",
	savedCustomPrompts: {},
	lastCustomPrompt: "",
	pauseSummarization: !1,
	disableGhosting: !1,
	stripPatterns: [
		"<|channel>thought",
		"<channel|>",
		"<output>",
		"</output>",
		"<thinking>",
		"</thinking>"
	],
	debugMode: !1,
	traceMode: !1,
	connectionSource: "default",
	summarizerResponseLength: 0,
	connectionProfileId: "",
	ollamaUrl: "http://localhost:11434",
	ollamaModel: "",
	ollamaModelsCache: [],
	openaiUrl: "",
	openaiKey: "",
	openaiModel: "",
	openaiMaxTokens: 0
}), bo = {
	narrative: "<player_name>\n{{player_name}}\n</player_name>\n\n<prior_context>\n{{context_str}}\n</prior_context>\n\n<passage_in_question>\n{{story_txt}}\n</passage_in_question>\n\nSummarize only the necessary elements from the passage_in_question to coherently continue the prior_context. If the passage_in_question has 2nd person point of view, 'you' pronoun in prose refers to the player. Use the player name in the summary output instead of 'you'.\n\nFocus on: character interactions, dialogue tone, and relationship dynamics; emotional beats and character motivations; atmosphere, mood, and sensory details that establish tone; narrative themes and subtext; names, location changes, and time; plot developments and unresolved tensions.\n\nExclude anything insubstantial, fluff, atmospheric details, or events already covered in Prior Context.\n\nWrite in short phrases, no more than 20; output must be a single line:",
	gamestate: "<player_name>\n{{player_name}}\n</player_name>\n\n<prior_context>\n{{context_str}}\n</prior_context>\n\n<passage_in_question>\n{{story_txt}}\n</passage_in_question>\n\nSummarize only the necessary elements from the passage_in_question to coherently continue the prior_context.\n\nFocus on: story progression, plot points, plans, tasks, quests; location changes and current location (reference by name); location interactables encountered, used, or discovered; significant changes to player, NPCs, locations, world, or setting.\n\nExclude anything insubstantial, fluff, atmospheric details, or events already covered in Prior Context.\nSkip any passages that are empty, unclear, or lack significant content.\nWrite in short phrases, no more than 20; output must be a single line:"
}, xo = {
	maxRetries: 5,
	baseDelay: 2e3,
	maxDelay: 6e4,
	backoffMultiplier: 2,
	retryableStatuses: [
		429,
		500,
		502,
		503,
		504
	]
};
J.summarizerUserPrompt = bo.narrative;
//#endregion
//#region src/settings/store.ts
var So = "tauritavern-summaryception-settings", Co = "summaryception";
function wo(e) {
	if (typeof structuredClone == "function") try {
		return structuredClone(e);
	} catch {}
	return JSON.parse(JSON.stringify(e));
}
function To() {
	let e = wo(J);
	try {
		let t = localStorage.getItem(So);
		if (!t) return e;
		let n = JSON.parse(t);
		for (let t of Object.keys(J)) t in n && n[t] !== void 0 && (e[t] = n[t]);
	} catch (e) {
		console.warn(`[${Co}] Failed to load settings from localStorage`, e);
	}
	if (!e.promptPreset) {
		let t = (e.summarizerUserPrompt || "").trim(), n = bo.gamestate.trim();
		!t || t === n ? (e.promptPreset = "narrative", e.summarizerUserPrompt = bo.narrative) : e.promptPreset = "custom";
	}
	return e;
}
function Eo(e) {
	try {
		localStorage.setItem(So, JSON.stringify(e));
	} catch (e) {
		console.error(`[${Co}] Failed to save settings to localStorage`, e);
	}
}
var Do = null;
function Oo() {
	if (Do) return Do;
	let e = /* @__PURE__ */ Ft(To()), t = null, n = /* @__PURE__ */ new Set();
	function r() {
		t && clearTimeout(t), t = setTimeout(() => {
			Eo(e), t = null;
		}, 300);
	}
	function i() {
		for (let t of n) try {
			t(e);
		} catch (e) {
			console.error(`[${Co}] Settings subscriber error`, e);
		}
	}
	function a(t) {
		Object.assign(e, t), r(), i();
	}
	function o(t) {
		e.promptPreset === "custom" && (e.lastCustomPrompt = e.summarizerUserPrompt), e.promptPreset = t, t === "custom" ? e.lastCustomPrompt && (e.summarizerUserPrompt = e.lastCustomPrompt) : (t === "narrative" || t === "gamestate") && (e.summarizerUserPrompt = bo[t]), r(), i();
	}
	function s(t) {
		e.summarizerUserPrompt = t, e.promptPreset === "custom" ? e.lastCustomPrompt = t : t !== (e.promptPreset === "narrative" || e.promptPreset === "gamestate" ? bo[e.promptPreset] : "") && (e.promptPreset = "custom", e.lastCustomPrompt = t), r(), i();
	}
	function c(t) {
		return !t.trim() || !e.summarizerUserPrompt.trim() ? !1 : (e.savedCustomPrompts[t] = e.summarizerUserPrompt, r(), i(), !0);
	}
	function l(t) {
		let n = e.savedCustomPrompts[t];
		return n ? (e.summarizerUserPrompt = n, e.lastCustomPrompt = n, e.promptPreset = "custom", r(), i(), !0) : !1;
	}
	function u(t) {
		t in e.savedCustomPrompts && (delete e.savedCustomPrompts[t], r(), i());
	}
	function d() {
		e.verbatimTurns = J.verbatimTurns, e.turnsPerSummary = J.turnsPerSummary, e.snippetsPerLayer = J.snippetsPerLayer, e.snippetsPerPromotion = J.snippetsPerPromotion, e.maxLayers = J.maxLayers, e.summarizerSystemPrompt = J.summarizerSystemPrompt, e.summarizerUserPrompt = J.summarizerUserPrompt, e.promptPreset = J.promptPreset, e.injectionTemplate = J.injectionTemplate, e.stripPatterns = [...J.stripPatterns], e.summarizerResponseLength = J.summarizerResponseLength, e.debugMode = J.debugMode, e.traceMode = J.traceMode, r(), i();
	}
	function f(e) {
		return n.add(e), () => n.delete(e);
	}
	return Do = {
		state: /* @__PURE__ */ Lt(e),
		update: a,
		setPromptPreset: o,
		setUserPrompt: s,
		saveCustomPrompt: c,
		loadCustomPrompt: l,
		deleteCustomPrompt: u,
		resetAdvancedToDefaults: d,
		subscribe: f
	}, Do;
}
//#endregion
//#region src/store/chat-store.ts
var ko = "summaryception";
function Ao() {
	return {
		layers: [],
		summarizedUpTo: -1,
		ghostedIndices: []
	};
}
var jo = null;
function Mo() {
	if (jo) return jo;
	let e = /* @__PURE__ */ Ft(Ao()), t = !1, n = null;
	async function r(e) {
		try {
			let t = (await e.metadata.get())[ko];
			if (!t || typeof t != "object") return null;
			let n = t, r = Ao();
			return Array.isArray(n.layers) && (r.layers = n.layers.map((e) => Array.isArray(e) ? [...e] : [])), typeof n.summarizedUpTo == "number" && (r.summarizedUpTo = n.summarizedUpTo), Array.isArray(n.ghostedIndices) && (r.ghostedIndices = [...n.ghostedIndices]), r;
		} catch (e) {
			return console.error("[Summaryception] Failed to read chat store from host metadata", e), null;
		}
	}
	async function i(i) {
		n = i.ref;
		let a = await r(i);
		if (a) e.layers = a.layers, e.summarizedUpTo = a.summarizedUpTo, e.ghostedIndices = a.ghostedIndices;
		else {
			let t = Ao();
			e.layers = t.layers, e.summarizedUpTo = t.summarizedUpTo, e.ghostedIndices = t.ghostedIndices;
		}
		t = !0;
	}
	async function a(n) {
		if (!(!t || !n)) try {
			let t = {
				layers: e.layers.map((e) => [...e]),
				summarizedUpTo: e.summarizedUpTo,
				ghostedIndices: [...e.ghostedIndices]
			};
			await n.metadata.setExtension({
				namespace: ko,
				value: t
			});
		} catch (e) {
			console.error("[Summaryception] Failed to save chat store to host metadata", e);
		}
	}
	async function o(t) {
		let n = Ao();
		e.layers = n.layers, e.summarizedUpTo = n.summarizedUpTo, e.ghostedIndices = n.ghostedIndices, await a(t);
	}
	function s(t) {
		e.layers = t.layers.map((e) => [...e]), e.summarizedUpTo = t.summarizedUpTo, e.ghostedIndices = [...t.ghostedIndices];
	}
	async function c(e, t) {
		if (!Array.isArray(t.layers)) throw Error("Invalid store data: layers must be an array");
		s(t), await a(e);
	}
	return jo = {
		state: e,
		get isLoaded() {
			return t;
		},
		get currentChatRef() {
			return n;
		},
		load: i,
		save: a,
		reset: o,
		replace: s,
		importFrom: c
	}, jo;
}
async function No(e, t) {
	let n = e.state;
	if (n.summarizedUpTo < 0) return !1;
	let r;
	try {
		r = (await t.summary({ includeMetadata: !1 })).message_count;
	} catch (e) {
		return console.error("[Summaryception] Branch repair: failed to get chat summary", e), !1;
	}
	if (r === 0 || n.summarizedUpTo < r) return !1;
	let i = n.summarizedUpTo;
	console.warn(`[Summaryception] Branch detected! summarizedUpTo (${i}) >= chat length (${r}). Repairing...`);
	let a = r, o = n.layers[0];
	if (o) {
		let e = o.length, t = o.filter((e) => !e.turnRange || e.turnRange[1] < a);
		t.length !== e && (o.length = 0, o.push(...t));
	}
	let s = -1;
	if (n.layers[0] && n.layers[0].length > 0) for (let e of n.layers[0]) e.turnRange && e.turnRange[1] > s && (s = e.turnRange[1]);
	return n.summarizedUpTo = s, n.ghostedIndices = n.ghostedIndices.filter((e) => e < a), await e.save(t), console.warn(`[Summaryception] Branch repair complete. summarizedUpTo: ${i} → ${e.state.summarizedUpTo}`), !0;
}
//#endregion
//#region src/host/api.ts
function Po() {
	return window.__TAURITAVERN__?.api ?? null;
}
async function Fo() {
	let e = window.__TAURITAVERN__?.ready ?? window.__TAURITAVERN_MAIN_READY__;
	e && await e;
}
function Io() {
	try {
		return window.SillyTavern?.getContext() ?? null;
	} catch {
		return null;
	}
}
//#endregion
//#region src/host/st-bridge.ts
var Lo = "summaryception";
function Ro() {
	let e = Io();
	if (!e) throw Error("SillyTavern context is unavailable. Summaryception requires TauriTavern (which preserves the ST frontend) or a standard SillyTavern installation.");
	return e;
}
function zo() {
	return Io();
}
function Bo() {
	return Ro().name1 || "User";
}
async function Vo() {
	let e = Ro();
	typeof e.saveChat == "function" && await e.saveChat();
}
var Ho = 0, Uo = 0, Wo = !1, Go = 0;
function Ko(e) {
	let t = zo();
	if (t) try {
		t.setExtensionPrompt(Lo, e, Ho, Uo, Wo, Go);
	} catch (e) {
		console.error("[Summaryception] setExtensionPrompt failed", e);
	}
}
function qo() {
	Ko("");
}
async function Jo(e) {
	return Ro().executeSlashCommandsWithOptions(e, { showOutput: !1 });
}
var Yo = null;
function Xo() {
	if (Yo) return Yo;
	let e = Ro().event_types;
	return Yo = {
		MESSAGE_RECEIVED: e.MESSAGE_RECEIVED ?? e.MESSAGE_RECEIVED ?? "message_received",
		CHAT_CHANGED: e.CHAT_CHANGED ?? "chat_changed",
		GENERATION_STARTED: e.GENERATION_STARTED ?? "generation_started",
		APP_READY: e.APP_READY ?? "app_ready",
		...e
	}, Yo;
}
function Zo(e) {
	let t = Ro(), n = Xo().MESSAGE_RECEIVED, r = (...t) => e(t[0]);
	return t.eventSource.on(n, r), () => t.eventSource.off(n, r);
}
function Qo(e) {
	let t = Ro(), n = Xo().CHAT_CHANGED;
	return t.eventSource.on(n, e), () => t.eventSource.off(n, e);
}
function $o(e) {
	let t = Ro(), n = Xo().GENERATION_STARTED;
	return t.eventSource.on(n, e), () => t.eventSource.off(n, e);
}
function es(e) {
	let t = Ro(), n = Xo().APP_READY;
	return t.eventSource.on(n, e), () => t.eventSource.off(n, e);
}
function ts() {
	let e = /* @__PURE__ */ new Map(), t = zo();
	if (!t?.promptManager) return { entries: e };
	try {
		let n = t.promptManager.getPromptOrderEntries();
		if (!n) return { entries: e };
		for (let t of n) e.set(t.identifier, t.enabled);
	} catch (e) {
		console.warn("[Summaryception] Failed to snapshot prompt toggles", e);
	}
	return { entries: e };
}
function ns() {
	let e = zo();
	if (e?.promptManager) try {
		let t = e.promptManager.getPromptOrderEntries();
		if (!t) return;
		for (let e of t) e.enabled &&= !1;
	} catch (e) {
		console.warn("[Summaryception] Failed to disable prompt toggles", e);
	}
}
function rs(e) {
	if (!e || e.entries.size === 0) return;
	let t = zo();
	if (t?.promptManager) try {
		let n = t.promptManager.getPromptOrderEntries();
		if (!n) return;
		for (let t of n) e.entries.has(t.identifier) && (t.enabled = e.entries.get(t.identifier) ?? !1);
	} catch (e) {
		console.warn("[Summaryception] Failed to restore prompt toggles", e);
	}
}
async function is(e, t, n) {
	let r = Ro().generateRaw;
	if (typeof r != "function") throw Error("generateRaw is not available in the current SillyTavern context.");
	let i;
	if (r.length <= 1) {
		let a = {
			prompt: e,
			systemPrompt: t
		};
		n && n > 0 && (a.responseLength = n), i = await r(a);
	} else i = await r(e, t);
	if (!i || typeof i != "string") throw Error("generateRaw returned an empty or invalid response.");
	return i;
}
function as() {
	let e = zo()?.ConnectionManagerRequestService;
	return !e || typeof e.sendRequest != "function" ? null : e;
}
async function os(e, t, n) {
	let r = as();
	if (!r) throw Error("ConnectionManagerRequestService is not available. Requires SillyTavern with PR #3603 (March 2025+).");
	let i = [{
		role: "system",
		content: t
	}, {
		role: "user",
		content: n
	}], a = await r.sendRequest(e, i, { ignoreInstruct: !0 });
	if (typeof a == "string") return a;
	let o = a;
	if (typeof o.content == "string") return o.content;
	let s = o.message;
	if (typeof s?.content == "string") return s.content;
	let c = o.choices;
	if (c?.[0]?.message?.content) return c[0].message.content;
	if (typeof o.data == "string") return o.data;
	throw Error(`Connection Profile returned unexpected type: ${typeof a}. Preview: ${JSON.stringify(a).slice(0, 200)}`);
}
function ss(e, t) {
	let n = as();
	if (!n || typeof n.handleDropdown != "function") return !1;
	try {
		return n.handleDropdown(e), t && (e.value = t), !0;
	} catch (e) {
		return console.warn("[Summaryception] Error populating profile dropdown", e), !1;
	}
}
async function cs(e, t) {
	let n = zo();
	if (n) try {
		let r = typeof n.getRequestHeaders == "function" ? n.getRequestHeaders() : { "Content-Type": "application/json" }, i = await fetch("/api/connection-manager/profiles", {
			method: "GET",
			headers: r
		});
		if (!i.ok) return;
		let a = await i.json();
		if (e.innerHTML = "<option value=\"\">-- Select a Profile --</option>", Array.isArray(a)) for (let t of a) {
			let n = document.createElement("option");
			n.value = t.id || t.name || "", n.textContent = t.name || t.id || "", e.appendChild(n);
		}
		else if (a && typeof a == "object") for (let [t, n] of Object.entries(a)) {
			let r = document.createElement("option");
			r.value = t, r.textContent = n.name || t, e.appendChild(r);
		}
		t && (e.value = t);
	} catch (e) {
		console.warn("[Summaryception] Could not fetch connection profiles", e);
	}
}
function ls() {
	let e = zo();
	if (e && typeof e.getRequestHeaders == "function") try {
		return e.getRequestHeaders();
	} catch {}
	return { "Content-Type": "application/json" };
}
function us(e) {
	return `/proxy/${e}`;
}
function ds() {
	return window.toastr ?? null;
}
function Y(e, t, n) {
	return ds()?.info(e, t, n) ?? null;
}
function X(e, t, n) {
	return ds()?.success(e, t, n) ?? null;
}
function Z(e, t, n) {
	return ds()?.warning(e, t, n) ?? null;
}
function fs(e, t, n) {
	return ds()?.error(e, t, n) ?? null;
}
function ps(e) {
	ds()?.clear(e);
}
function ms(e, t, n) {
	let r = zo(), i = r?.SlashCommandParser, a = r?.SlashCommand;
	if (!i?.addCommandObject || !a?.fromProps) return console.warn("[Summaryception] SlashCommandParser not available, skipping /" + e), !1;
	try {
		return i.addCommandObject(a.fromProps({
			name: e,
			callback: t,
			helpString: n
		})), !0;
	} catch (t) {
		return console.warn("[Summaryception] Failed to register slash command /" + e, t), !1;
	}
}
//#endregion
//#region src/engine/passage.ts
async function hs(e, t, n) {
	let r = await e.getRange(t, n), i = [];
	for (let e of r) {
		if (!e.mes || !e.mes.trim() || (e.is_system || e.is_hidden) && !e.extra?.sc_ghosted) continue;
		let t = e.is_user ? "Player" : "Assistant";
		i.push(`${t}: ${e.mes.trim()}`);
	}
	return i.join("\n");
}
function gs(e, t, n) {
	let r = [];
	for (let i = e.length - 1; i >= t; i--) {
		let t = e[i];
		if (!(!t || t.length === 0)) for (let e = 0; e < t.length; e++) {
			if (n && n.layer === i && n.index === e) continue;
			let a = t[e];
			a && r.push(a.text);
		}
	}
	return r.length > 0 ? r.join(" ") : "(none yet)";
}
//#endregion
//#region src/engine/messages.ts
var _s = 100, vs = class {
	pages = [];
	totalCount = 0;
	handle;
	constructor(e) {
		this.handle = e;
	}
	async init() {
		let e = await this.handle.history.tail({ limit: _s });
		this.totalCount = e.totalCount, this.pages = [e];
	}
	getTotalCount() {
		return this.totalCount;
	}
	lowestCachedIndex() {
		if (this.pages.length === 0) return this.totalCount;
		let e = this.pages[this.pages.length - 1];
		return e ? e.startIndex : this.totalCount;
	}
	async ensureCoverage(e) {
		if (!(e < 0)) for (this.pages.length === 0 && await this.init(); this.lowestCachedIndex() > e;) {
			let e = this.pages[this.pages.length - 1];
			if (!e || !e.hasMoreBefore) return;
			try {
				let t = await this.handle.history.before(e, { limit: _s });
				this.pages.push(t);
			} catch (e) {
				console.error("[Summaryception] Failed to fetch history page", e);
				return;
			}
		}
	}
	async getMessage(e) {
		return e < 0 || e >= this.totalCount ? null : (await this.ensureCoverage(e), this.getMessageCached(e));
	}
	getMessageCached(e) {
		for (let t of this.pages) {
			let n = e - t.startIndex;
			if (n >= 0 && n < t.messages.length) return t.messages[n] ?? null;
		}
		return null;
	}
	async getRange(e, t) {
		if (e > t || (e < 0 && (e = 0), t >= this.totalCount && (t = this.totalCount - 1), e > t)) return [];
		await this.ensureCoverage(e);
		let n = [];
		for (let r = e; r <= t; r++) {
			let e = this.getMessageCached(r);
			e && n.push(e);
		}
		return n;
	}
	async collectFiltered(e, t, n = {}) {
		let r = n.limit ?? Infinity, i = n.scanLimit ?? Infinity, a = [], o = 0;
		for (let n = e; n < this.totalCount && a.length < r && o < i; n++) {
			let e = await this.getMessage(n);
			o++, e && t(e, n) && a.push({
				index: n,
				message: e
			});
		}
		return a;
	}
}, ys = null, bs = null;
async function xs(e) {
	let t = e.getCurrentChatHandle();
	if (!t) throw Error("No active chat handle available.");
	let n = t.ref, r = JSON.stringify(n);
	return ys && bs === r ? ys : (ys = new vs(t), bs = r, await ys.init(), ys);
}
function Ss() {
	ys = null, bs = null;
}
function Cs(e, t, n) {
	if (!e || !e.mes || !e.mes.trim() || e.is_user) return !1;
	let r = e.extra?.sc_ghosted === !0 || n.has(t);
	return !(e.is_system && !r);
}
function ws(e, t, n) {
	return e && e.extra?.sc_ghosted === !0 || n.has(t);
}
async function Ts(e, t, n, r = {}) {
	return (await e.collectFiltered(t, (e, t) => Cs(e, t, n) && !ws(e, t, n), r)).map(({ index: e, message: t }) => ({
		index: e,
		mes: t.mes,
		name: t.name || "Assistant"
	}));
}
//#endregion
//#region src/engine/ghosting.ts
var Es = "summaryception";
function Ds(e, ...t) {
	e.debugMode && console.log(`[${Es}]`, ...t);
}
async function Os(e, t, n, r) {
	if (e.state.ghostedIndices.includes(r)) return;
	let i = await t.getMessage(r);
	if (i && (i.extra ||= {}, i.extra.sc_ghosted = !0), e.state.ghostedIndices.push(r), !n.disableGhosting) try {
		await Jo(`/hide ${r}`);
	} catch (e) {
		Ds(n, `Failed to hide message ${r}:`, e);
	}
	Ds(n, `Ghosted message at index ${r}${n.disableGhosting ? " (hiding disabled — metadata only)" : ""}`);
}
async function ks(e, t, n, r) {
	let i = n.disableGhosting ? null : Y(`Hiding messages: 0 / ${r + 1}`, "Summaryception — Ghosting", {
		timeOut: 0,
		extendedTimeOut: 0,
		tapToDismiss: !1
	}), a = 0, o = new Set(e.state.ghostedIndices);
	for (let s = 0; s <= r; s++) {
		if (o.has(s)) continue;
		let c = await t.getMessage(s);
		if (c) {
			if (c.is_hidden && !c.extra?.sc_ghosted) {
				Ds(n, `Skipping message ${s} — already hidden by user`);
				continue;
			}
			if (!(c.is_system && !c.extra?.sc_ghosted) && !(!c.mes || !c.mes.trim())) {
				if (c.extra ||= {}, c.extra.sc_ghosted = !0, e.state.ghostedIndices.push(s), o.add(s), !n.disableGhosting) try {
					await Jo(`/hide ${s}`);
				} catch (e) {
					Ds(n, `Failed to hide message ${s}:`, e);
				}
				a++, i && a % 10 == 0 && Math.round(s / (r + 1) * 100);
			}
		}
	}
	i && ps(i), Ds(n, `Ghosted messages from index 0 to ${r}${n.disableGhosting ? " (hiding disabled — metadata only)" : ""}`);
}
async function As(e, t) {
	let n = [...e.state.ghostedIndices];
	if (n.length === 0) return;
	let r = t.disableGhosting ? null : Y(`Unhiding messages: 0 / ${n.length}`, "Summaryception — Clearing", {
		timeOut: 0,
		extendedTimeOut: 0,
		tapToDismiss: !1
	}), i = 0;
	for (let e of n) {
		if (!t.disableGhosting) try {
			await Jo(`/unhide ${e}`);
		} catch (n) {
			Ds(t, `Failed to unhide message ${e}:`, n);
		}
		i++, r && i % 10;
	}
	e.state.ghostedIndices.length = 0, r && ps(r), Ds(t, `Unghosted ${n.length} messages`);
}
//#endregion
//#region src/engine/injection.ts
var js = "summaryception", Ms = "";
function Ns(e, t) {
	let n = t.state.layers;
	if (!n || n.every((e) => !e || e.length === 0)) return "";
	let r = [];
	for (let e = n.length - 1; e >= 1; e--) {
		let t = n[e];
		if (!(!t || t.length === 0)) for (let e of t) r.push(e.text);
	}
	if (n[0] && n[0].length > 0) for (let e of n[0]) r.push(e.text);
	return r.length === 0 ? "" : e.injectionTemplate.replace("{{summary}}", r.join(" "));
}
function Ps(e, t) {
	try {
		if (!e.enabled) {
			Ms !== "" && (qo(), Ms = "");
			return;
		}
		let n = Ns(e, t);
		if (n === Ms) return;
		Ko(n || ""), Ms = n || "", e.debugMode && console.log(`[${js}] Injection updated: ${n.length} chars`);
	} catch (e) {
		console.error(`[${js}] updateInjection error:`, e);
	}
}
function Fs() {
	Ms !== "" && (qo(), Ms = "");
}
//#endregion
//#region src/engine/connection.ts
var Q = class extends Error {
	retryable;
	status;
	constructor(e, t = {}) {
		super(e), this.name = "ConnectionError", this.retryable = t.retryable ?? !1, this.status = t.status ?? null;
	}
};
function Is(e) {
	try {
		let t = e, n = t.response?.headers?.["retry-after"] ?? t.retryAfter ?? t.data?.retry_after;
		if (!n) return null;
		let r = Number(n);
		if (!isNaN(r)) return r * 1e3;
		let i = new Date(String(n));
		if (!isNaN(i.getTime())) return Math.max(0, i.getTime() - Date.now());
	} catch {}
	return null;
}
function Ls(e) {
	if (!e) return !1;
	let t = e;
	if (t.name === "AbortError") return !1;
	if (t.name === "ConnectionError" && typeof t.retryable == "boolean") return t.retryable;
	if (t.name === "TypeError" && typeof t.message == "string" && t.message.includes("fetch")) return !0;
	let n = t.status ?? t.response?.status ?? t.statusCode;
	if (n && [
		429,
		500,
		502,
		503,
		504
	].includes(n)) return !0;
	let r = (t.message ?? String(t)).toLowerCase();
	return !!(r.includes("rate limit") || r.includes("too many requests") || r.includes("server error") || r.includes("timeout") || r.includes("econnreset") || r.includes("econnrefused") || r.includes("network") || r.includes("overloaded") || r.includes("capacity"));
}
function Rs(e, t) {
	let n = e;
	for (let e of t.stripPatterns) for (; n.includes(e);) n = n.replace(e, "");
	for (let { regex: e, keepContent: t } of [
		{
			regex: /<\|channel>thought[\s\S]*?<channel\|>/gi,
			keepContent: !1
		},
		{
			regex: /<thinking>[\s\S]*?<\/thinking>/gi,
			keepContent: !1
		},
		{
			regex: /<output>([\s\S]*?)<\/output>/gi,
			keepContent: !0
		},
		{
			regex: /<reasoning>[\s\S]*?<\/reasoning>/gi,
			keepContent: !1
		},
		{
			regex: /<thought>[\s\S]*?<\/thought>/gi,
			keepContent: !1
		},
		{
			regex: /<reflect>[\s\S]*?<\/reflect>/gi,
			keepContent: !1
		},
		{
			regex: /<inner_monologue>[\s\S]*?<\/inner_monologue>/gi,
			keepContent: !1
		}
	]) n = t ? n.replace(e, "$1") : n.replace(e, "");
	return n = n.replace(/\n{3,}/g, "\n").trim(), n;
}
async function zs(e, t, n, r) {
	switch (e.connectionSource || "default") {
		case "profile": return await Vs(e.connectionProfileId, t, n);
		case "ollama": return await Hs(e.ollamaUrl, e.ollamaModel, t, n);
		case "openai": return await Gs(e.openaiUrl, e.openaiKey, e.openaiModel, t, n, e.openaiMaxTokens, r);
		default: return await Bs(t, n, e.summarizerResponseLength);
	}
}
async function Bs(e, t, n) {
	try {
		return await is(t, e, n);
	} catch (e) {
		throw new Q(`Default connection failed: ${e?.message ?? String(e)}`, { retryable: !0 });
	}
}
async function Vs(e, t, n) {
	if (!e) throw new Q("No Connection Profile selected. Please select one in Summaryception settings.", { retryable: !1 });
	try {
		return await os(e, t, n);
	} catch (t) {
		if (t instanceof Q) throw t;
		let n = t, r = n.message || String(t), i = n.status;
		throw i === 401 || r.includes("401") || r.toLowerCase().includes("unauthorized") ? new Q(`Connection Profile auth failed (401). This may be the API key switching bug (ST Issue #5348). Original error: ${r}`, {
			retryable: !1,
			status: 401
		}) : r.includes("not found") || r.includes("profile") ? new Q(`Connection Profile "${e}" not found. It may have been deleted. Please re-select a profile in Summaryception settings.`, {
			retryable: !1,
			status: 404
		}) : new Q(`Connection Profile request failed: ${r}`, {
			retryable: !0,
			status: i
		});
	}
}
async function Hs(e, t, n, r) {
	if (!e) throw new Q("Ollama URL is not configured.", { retryable: !1 });
	if (!t) throw new Q("Ollama model is not selected.", { retryable: !1 });
	let i = e.replace(/\/+$/, ""), a = `${i}/api/chat`, o = JSON.stringify({
		model: t,
		messages: [{
			role: "system",
			content: n
		}, {
			role: "user",
			content: r
		}],
		stream: !1,
		options: { temperature: .3 }
	}), s;
	try {
		s = await fetch(us(a), {
			method: "POST",
			headers: {
				...ls(),
				"Content-Type": "application/json"
			},
			body: o
		});
	} catch (e) {
		try {
			s = await fetch(a, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: o
			});
		} catch (t) {
			throw new Q(`Failed to connect to Ollama at ${i}. Proxy error: ${e.message}. Direct error: ${t.message}. Set OLLAMA_ORIGINS=* on your Ollama instance or enable the CORS proxy.`, { retryable: !0 });
		}
	}
	if (!s.ok) {
		let e = await s.text().catch(() => "Unknown error");
		throw new Q(`Ollama request failed (${s.status}): ${e}`, {
			retryable: s.status >= 500,
			status: s.status
		});
	}
	let c = await s.json();
	if (!c?.message?.content) throw new Q("Ollama returned an empty or invalid response.", { retryable: !0 });
	return c.message.content;
}
async function Us(e) {
	if (!e) throw Error("Ollama URL is not configured.");
	let t = e.replace(/\/+$/, ""), n = `${t}/api/tags`, r;
	try {
		r = await fetch(us(n), {
			method: "GET",
			headers: ls()
		});
	} catch (e) {
		try {
			r = await fetch(n, {
				method: "GET",
				headers: { "Content-Type": "application/json" }
			});
		} catch (n) {
			throw Error(`Failed to connect to Ollama at ${t}. Proxy: ${e.message}. Direct: ${n.message}`);
		}
	}
	if (!r.ok) {
		let e = await r.text().catch(() => "Unknown error");
		throw Error(`Failed to fetch Ollama models (${r.status}): ${e}`);
	}
	let i = await r.json();
	if (!i?.models || !Array.isArray(i.models)) throw Error("Unexpected response format from Ollama /api/tags.");
	return i.models;
}
var Ws = /^https?:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?/i;
async function Gs(e, t, n, r, i, a, o) {
	if (!e) throw new Q("OpenAI Compatible URL is not configured.", { retryable: !1 });
	if (!n) throw new Q("OpenAI Compatible model name is not set.", { retryable: !1 });
	let s = e.replace(/\/+$/, ""), c = s;
	c.endsWith("/chat/completions") || (c.endsWith("/v1") ? c += "/chat/completions" : c.includes("/chat/completions") || (c += "/v1/chat/completions"));
	let l = Ws.test(c), u = { "Content-Type": "application/json" };
	t && (u.Authorization = `Bearer ${t}`);
	let d = {
		model: n,
		messages: [{
			role: "system",
			content: r
		}, {
			role: "user",
			content: i
		}],
		temperature: .8,
		stream: !0
	};
	a && a > 0 && (d.max_tokens = a);
	let f = JSON.stringify(d), p;
	if (l) try {
		p = await fetch(us(c), {
			method: "POST",
			headers: {
				...ls(),
				...u
			},
			body: f,
			signal: o
		});
	} catch (e) {
		if (o.aborted) throw e;
		try {
			p = await fetch(c, {
				method: "POST",
				headers: u,
				body: f,
				signal: o
			});
		} catch (t) {
			throw new Q(`Failed to connect to ${s}. Proxy: ${e.message}. Direct: ${t.message}`, { retryable: !0 });
		}
	}
	else try {
		p = await fetch(c, {
			method: "POST",
			headers: u,
			body: f,
			signal: o
		});
	} catch (e) {
		throw o.aborted ? e : new Q(`Failed to connect to ${s}: ${e.message}`, { retryable: !0 });
	}
	if (!p.ok) {
		let e = await p.text().catch(() => "Unknown error");
		throw p.status === 401 ? new Q("OpenAI Compatible endpoint returned 401 Unauthorized. Check your API key.", {
			retryable: !1,
			status: 401
		}) : p.status === 403 ? new Q(`OpenAI Compatible endpoint returned 403 Forbidden: ${e}`, {
			retryable: !1,
			status: 403
		}) : new Q(`OpenAI Compatible request failed (${p.status}): ${e}`, {
			retryable: p.status >= 500 || p.status === 429,
			status: p.status
		});
	}
	let m = p.body?.getReader();
	if (!m) throw new Q("OpenAI Compatible endpoint returned no readable body.", { retryable: !0 });
	let h = new TextDecoder(), g = "", _ = "";
	try {
		for (;;) {
			let { done: e, value: t } = await m.read();
			if (e) break;
			_ += h.decode(t, { stream: !0 });
			let n = _.split("\n");
			_ = n.pop() ?? "";
			for (let e of n) {
				let t = e.trim();
				if (!t || !t.startsWith("data:")) continue;
				let n = t.slice(5).trim();
				if (n !== "[DONE]") try {
					let e = JSON.parse(n).choices?.[0]?.delta?.content;
					e && (g += e);
				} catch {}
			}
		}
	} finally {
		m.releaseLock();
	}
	if (!g.trim()) throw new Q("OpenAI Compatible endpoint returned an empty response (streaming).", { retryable: !0 });
	return g;
}
async function Ks(e, t, n) {
	try {
		let r = new AbortController();
		return {
			success: !0,
			message: `Connection successful! Response: "${(await Gs(e, t, n || "test", "You are a test assistant.", "Respond with exactly: CONNECTION_OK", 100, r.signal)).slice(0, 100)}"`
		};
	} catch (e) {
		return {
			success: !1,
			message: `Connection failed: ${e.message}`
		};
	}
}
//#endregion
//#region src/engine/summarizer.ts
var qs = "summaryception";
function Js(e, ...t) {
	e.debugMode && console.log(`[${qs}]`, ...t);
}
function Ys(e, ...t) {
	if (e.debugMode && e.traceMode) {
		let e = t.map((e, t) => t === 0 && typeof e == "string" ? e.toUpperCase() : e);
		console.log(`[${qs}]`, "[TRACE]", ...e);
	}
}
var Xs = null;
function Zs(e) {
	Xs && (Xs.abort(), Js(e, "Abort signal sent."));
}
function Qs() {
	return Xs !== null;
}
async function $s(e, t, n) {
	Ys(e, ">>> ENTERING callSummarizer"), Ys(e, "  storyTxt length:", t?.length ?? 0), Ys(e, "  contextStr length:", n?.length ?? 0);
	let r = e.summarizerUserPrompt.replace("{{player_name}}", Bo()).replace("{{context_str}}", n || "(none yet)").replace("{{story_txt}}", t);
	Js(e, "── Summarizer Call ──"), Js(e, "Context str length:", n.length, "chars"), Js(e, "Story txt length:", t.length, "chars");
	let i = !e.connectionSource || e.connectionSource === "default", a = i ? ts() : null;
	i && ns(), Xs = new AbortController();
	let { signal: o } = Xs, s = null;
	try {
		for (let t = 0; t <= xo.maxRetries; t++) {
			if (Ys(e, `  Attempt ${t} starting...`), o.aborted) return Js(e, "Summarization aborted by user."), Z("Summarization aborted.", "Summaryception", { timeOut: 3e3 }), "";
			try {
				t > 0 && Js(e, `Retry attempt ${t}/${xo.maxRetries}`), Ys(e, "  Calling sendSummarizerRequest...");
				let n = await Promise.race([zs(e, e.summarizerSystemPrompt, r, o), new Promise((e, t) => {
					let n = setTimeout(() => t(/* @__PURE__ */ Error("Request timed out after 120s")), 12e4);
					o.addEventListener("abort", () => {
						clearTimeout(n), t(/* @__PURE__ */ Error("Aborted by user"));
					}, { once: !0 });
				})]);
				Ys(e, "  sendSummarizerRequest returned:", n?.substring?.(0, 50));
				let i = (n || "").trim();
				if (i = Rs(i, e), !i) throw Js(e, "Empty response from LLM, treating as retryable"), new Q("Empty response from summarizer", { retryable: !0 });
				return Js(e, "Result:", i), Ys(e, "<<< EXITING callSummarizer WITH SUCCESS"), i;
			} catch (n) {
				if (s = n, Ys(e, `  Caught error on attempt ${t}:`, {
					name: n?.name,
					message: n?.message,
					retryable: n?.retryable
				}), o.aborted || n?.message === "Aborted by user") return Js(e, "Summarization aborted by user."), Z("Summarization aborted.", "Summaryception", { timeOut: 3e3 }), "";
				if (!Ls(n)) {
					Ys(e, "  ERROR IS NON-RETRYABLE, BREAKING"), console.error(`[${qs}] Non-retryable error:`, n);
					break;
				}
				if (t >= xo.maxRetries) {
					Ys(e, "  MAX RETRIES EXHAUSTED"), console.error(`[${qs}] All ${xo.maxRetries} retries exhausted.`);
					break;
				}
				let r, i = Is(n);
				if (i) r = Math.min(i, xo.maxDelay), Js(e, `Server requested retry after ${r}ms`);
				else {
					let e = xo.baseDelay * xo.backoffMultiplier ** +t, n = Math.random() * xo.baseDelay;
					r = Math.min(e + n, xo.maxDelay);
				}
				let a = (r / 1e3).toFixed(1), c = n?.status ?? n?.response?.status ?? "?";
				console.warn(`[${qs}] Attempt ${t + 1} failed (${c}). Retrying in ${a}s...`, n?.message ?? n), Z(`API error (${c}). Retrying in ${a}s... (${t + 1}/${xo.maxRetries})`, "Summaryception", { timeOut: r }), await new Promise((e) => {
					let t = setTimeout(e, r);
					o.addEventListener("abort", () => {
						clearTimeout(t), e();
					}, { once: !0 });
				});
			}
		}
		let t = s?.status ?? s?.response?.status ?? "";
		return console.error(`[${qs}] Summarization failed after all retries:`, s), fs(`Summarization failed after ${xo.maxRetries} retries${t ? ` (${t})` : ""}. Batch skipped — will retry on next trigger.`, "Summaryception", { timeOut: 8e3 }), Ys(e, "<<< EXITING callSummarizer WITH FAILURE"), "";
	} finally {
		Xs = null, i && a && rs(a);
	}
}
//#endregion
//#region src/engine/promotion.ts
var ec = "summaryception";
function tc(e, ...t) {
	e.debugMode && console.log(`[${ec}]`, ...t);
}
async function nc(e, t, n) {
	if (n >= e.maxLayers - 1) {
		tc(e, `Max layer depth (${e.maxLayers}) reached.`);
		return;
	}
	let r = t.state, i = r.layers[n];
	if (!i || i.length <= e.snippetsPerLayer) return;
	tc(e, `Layer ${n}: ${i.length} snippets > limit ${e.snippetsPerLayer} → promoting`), r.layers[n + 1] || r.layers.push([]);
	let a = r.layers[n + 1];
	if (a.length === 0) {
		let r = i.shift();
		r.promoted = !0, r.seedFromLayer = n, a.push(r), tc(e, `Seeded Layer ${n + 1} with oldest snippet from Layer ${n} (no LLM call)`), Y(`Seeded Layer ${n + 1} from Layer ${n} (free promotion)`, "Summaryception", { timeOut: 2e3 }), i.length > e.snippetsPerLayer && await nc(e, t, n), a.length > e.snippetsPerLayer && await nc(e, t, n + 1);
		return;
	}
	let o = i.splice(0, e.snippetsPerPromotion), s = o.map((e) => e.text).join(" "), c = gs(r.layers, n + 1);
	Y(`Promoting ${o.length} snippets: Layer ${n} → Layer ${n + 1}`, "Summaryception", {
		timeOut: 3e3,
		progressBar: !0
	});
	let l = await $s(e, s, c);
	if (!l) {
		i.unshift(...o);
		return;
	}
	a.push({
		text: l,
		fromLayer: n,
		mergedCount: o.length,
		timestamp: Date.now()
	}), tc(e, `Layer ${n + 1} now has ${a.length} snippets`), i.length > e.snippetsPerLayer && await nc(e, t, n), a.length > e.snippetsPerLayer && await nc(e, t, n + 1);
}
//#endregion
//#region src/engine/pipeline.ts
var rc = "summaryception";
function ic(e, ...t) {
	e.debugMode && console.log(`[${rc}]`, ...t);
}
function $(e, ...t) {
	if (e.debugMode && e.traceMode) {
		let e = t.map((e, t) => t === 0 && typeof e == "string" ? e.toUpperCase() : e);
		console.log(`[${rc}]`, "[TRACE]", ...e);
	}
}
var ac = !1, oc = !1;
function sc() {
	return ac;
}
function cc(e) {
	Zs(e), ac = !1;
}
async function lc(e) {
	let { settings: t, store: n } = e;
	if (!t.enabled || t.pauseSummarization || ac) return;
	let r = await xs(e.host), i = await Ts(r, 0, new Set(n.state.ghostedIndices), { scanLimit: t.verbatimTurns * 10 + 100 });
	if (ic(t, `Visible assistant turns: ${i.length}, limit: ${t.verbatimTurns}`), i.length <= t.verbatimTurns) return;
	let a = i.length - t.verbatimTurns, o = t.turnsPerSummary * 2;
	if (a > o && !oc) {
		ic(t, `Large backlog detected: ${a} turns over limit`);
		let o = await fc(a, Math.ceil(a / t.turnsPerSummary), t);
		if (o === "skip") {
			let r = i[i.length - t.verbatimTurns - 1];
			r && (n.state.summarizedUpTo = r.index, ic(t, `Skipped backlog. summarizedUpTo set to ${n.state.summarizedUpTo}`)), oc = !0, await n.save(e.host.getCurrentChatHandle());
			return;
		}
		if (o === "catchup") {
			await dc(e, i, a);
			return;
		}
		if (o === "partial") {
			await uc(e, i, r);
			return;
		}
		return;
	}
	if (!await uc(e, i, r)) {
		ic(t, "Batch failed, stopping cycle to avoid retry loop.");
		return;
	}
	let s = await Ts(r, 0, new Set(n.state.ghostedIndices), { scanLimit: t.verbatimTurns * 10 + 100 });
	s.length > t.verbatimTurns && s.length - t.verbatimTurns <= o && await lc(e);
}
async function uc(e, t, n) {
	$(e.settings, ">>> ENTERING summarizeOneBatch"), $(e.settings, "  visibleTurns:", t?.length ?? 0);
	let { settings: r, store: i } = e, a = t.filter((e) => e.index > i.state.summarizedUpTo);
	if ($(e.settings, "  eligibleTurns after filtering:", a.length), a.length === 0) {
		ic(e.settings, "All visible turns are already summarized — repairing ghosting...");
		let a = t.filter((e) => e.index <= i.state.summarizedUpTo);
		for (let e of a) await Os(i, n, r, e.index);
		return await i.save(e.host.getCurrentChatHandle()), $(e.settings, "<<< EXITING summarizeOneBatch - REPAIRED GHOSTING"), !1;
	}
	let o = Math.min(r.turnsPerSummary, a.length), s = a.slice(0, o);
	if (s.length === 0) return $(e.settings, "<<< EXITING summarizeOneBatch - EMPTY BATCH"), !1;
	ac = !0;
	try {
		let t = s[0].index, a = s[s.length - 1].index;
		$(e.settings, "  startIdx:", t, "endIdx:", a), $(e.settings, "  store.summarizedUpTo:", i.state.summarizedUpTo), ic(e.settings, `Summarizing ${s.length} assistant turns (indices ${t}–${a})`), i.state.layers[0] || i.state.layers.push([]);
		let o = i.state.summarizedUpTo < 0 ? 0 : i.state.summarizedUpTo + 1;
		if (o > a) return ic(e.settings, `ERROR: passageStart (${o}) > endIdx (${a}). Batch already summarized?`), $(e.settings, "<<< EXITING summarizeOneBatch - PASSAGE START GREATER THAN END"), !1;
		let c = await hs(n, o, a);
		if ($(e.settings, "  storyTxt length:", c?.length ?? 0), !c.trim()) return $(e.settings, "<<< EXITING summarizeOneBatch - EMPTY PASSAGE"), i.state.summarizedUpTo = Math.max(i.state.summarizedUpTo, a), await i.save(e.host.getCurrentChatHandle()), !0;
		let l = gs(i.state.layers, 0);
		Y(`Summarizing ${s.length} turn${s.length > 1 ? "s" : ""}…`, "Summaryception", {
			timeOut: 3e3,
			progressBar: !0
		});
		let u = await $s(r, c, l);
		if ($(e.settings, "  summary length:", u?.length ?? 0), !u) return ic(e.settings, "Summarization failed for batch, leaving turns intact for next attempt."), $(e.settings, "<<< EXITING summarizeOneBatch - EMPTY SUMMARY"), !1;
		let d = i.state.layers[0];
		d.push({
			text: u,
			turnRange: [o, a],
			timestamp: Date.now()
		}), i.state.summarizedUpTo = Math.max(i.state.summarizedUpTo, a), await ks(i, n, r, a), ic(e.settings, `Layer 0 now has ${d.length} snippets`), await nc(r, i, 0), await i.save(e.host.getCurrentChatHandle());
		try {
			await Vo();
		} catch (t) {
			ic(e.settings, "Could not save chat:", t);
		}
		return X(`Summary saved (Layer 0: ${i.state.layers[0].length} snippets)`, "Summaryception", { timeOut: 2e3 }), Ps(r, i), $(e.settings, "<<< EXITING summarizeOneBatch - SUCCESS"), !0;
	} finally {
		ac = !1;
	}
}
async function dc(e, t, n) {
	$(e.settings, ">>> ENTERING runCatchup"), $(e.settings, "  overflow:", n);
	let { settings: r, store: i } = e, a = Math.ceil(n / r.turnsPerSummary), o = 0, s = 0, c = !1, l = Y(`Processing backlog: 0 / ${a} batches (0%)`, "Summaryception Catch-Up", {
		timeOut: 0,
		extendedTimeOut: 0,
		tapToDismiss: !1,
		closeButton: !0,
		onCloseClick: () => {
			c = !0, cc(r);
		}
	});
	ac = !0;
	try {
		let t = 0;
		for (; !c;) {
			let n = await xs(e.host), a = await Ts(n, 0, new Set(i.state.ghostedIndices), { scanLimit: r.verbatimTurns * 10 + 100 });
			if (a.length <= r.verbatimTurns) break;
			let c = await uc(e, a, n);
			if (c === !0) o++, t = 0;
			else if (c === "EMPTY_SKIP") t = 0;
			else if (s++, t++, t >= 3) {
				fs("3 consecutive failures — API may be down. Pausing catch-up. Progress saved; will resume on next message.", "Summaryception", { timeOut: 8e3 });
				break;
			}
			await new Promise((e) => setTimeout(e, 200));
		}
		ps(l), c ? Z(`Catch-up paused at ${o}/${a}. Progress saved — will continue on next message.`, "Summaryception", { timeOut: 5e3 }) : s === 0 ? X(`Catch-up complete! ${o} batches processed.`, "Summaryception", { timeOut: 4e3 }) : Z(`Catch-up finished. ${o} succeeded, ${s} failed (will retry on next trigger).`, "Summaryception", { timeOut: 6e3 }), Ps(r, i);
	} finally {
		ac = !1;
	}
}
function fc(e, t, n) {
	return new Promise((r) => {
		let i = document.createElement("div");
		i.className = "sc-catchup-overlay", i.innerHTML = `
        <div class="sc-catchup-modal">
        <h3>🧠 Summaryception — Backlog Detected</h3>
        <div class="sc-catchup-dialog">
        <p>Summaryception detected <strong>${e} unsummarized turns</strong>
        in this chat (beyond your ${n.verbatimTurns} verbatim limit).</p>
        <p>This will require approximately <strong>${t} summarizer calls</strong> to process.</p>
        <hr>
        <div class="sc-catchup-options">
        <button id="sc_catchup_full" class="menu_button">
        <i class="fa-solid fa-forward-fast"></i>
        <div class="sc-btn-text">
        <span class="sc-btn-label">Process Entire Backlog</span>
        <span class="sc-btn-desc">Summarize all ${e} turns — cancelable at any time</span>
        </div>
        </button>
        <button id="sc_catchup_skip" class="menu_button">
        <i class="fa-solid fa-forward-step"></i>
        <div class="sc-btn-text">
        <span class="sc-btn-label">Skip Backlog</span>
        <span class="sc-btn-desc">Ignore old turns, only summarize new ones going forward</span>
        </div>
        </button>
        <button id="sc_catchup_partial" class="menu_button">
        <i class="fa-solid fa-play"></i>
        <div class="sc-btn-text">
        <span class="sc-btn-label">Just One Batch</span>
        <span class="sc-btn-desc">Summarize ${n.turnsPerSummary} turns now, deal with the rest later</span>
        </div>
        </button>
        </div>
        </div>
        </div>
        `, document.body.appendChild(i);
		let a = (e) => {
			i.remove(), r(e);
		};
		i.querySelector("#sc_catchup_full")?.addEventListener("click", () => a("catchup")), i.querySelector("#sc_catchup_skip")?.addEventListener("click", () => a("skip")), i.querySelector("#sc_catchup_partial")?.addEventListener("click", () => a("partial"));
	});
}
function pc() {
	oc = !1, Ss();
}
async function mc(e) {
	let { settings: t, store: n } = e;
	if (!t.enabled) {
		Z("Enable Summaryception first.");
		return;
	}
	if (ac) {
		Z("Already summarizing. Please wait.");
		return;
	}
	oc = !1;
	let r = await Ts(await xs(e.host), 0, new Set(n.state.ghostedIndices), { scanLimit: t.verbatimTurns * 10 + 100 });
	if (r.length <= t.verbatimTurns) {
		Y("Nothing to summarize — visible turns are within the verbatim limit.", "Summaryception");
		return;
	}
	let i = r.length - t.verbatimTurns;
	Y(`${i} turns to process. Starting...`, "Summaryception", { timeOut: 2e3 }), await dc(e, r, i), Ps(t, n);
}
async function hc(e) {
	let { settings: t, store: n } = e;
	try {
		await As(n, t);
	} catch (e) {
		console.error(`[${rc}] Error during unghost (continuing with clear):`, e), Z("Some messages could not be unghosted, but memory will still be cleared.", "Summaryception");
	}
	let r = e.host.getCurrentChatHandle();
	if (!r) {
		fs("No active chat handle.", "Summaryception");
		return;
	}
	await n.reset(r);
	try {
		await Vo();
	} catch (e) {
		ic(t, "Could not save chat:", e);
	}
	Ps(t, n), X("Memory cleared & messages unghosted", "Summaryception");
}
async function gc(e) {
	let { settings: t } = e, n = await xs(e.host), r = 0, i = Y("Scanning for orphaned messages...", "Summaryception — Repair", {
		timeOut: 0,
		extendedTimeOut: 0,
		tapToDismiss: !1
	}), a = n.getTotalCount();
	for (let e = 0; e < a; e++) {
		let i = await n.getMessage(e);
		if (i && (i.is_system || i.is_hidden) && !i.is_user && !i.extra?.sc_ghosted && i.mes && i.mes.trim().length > 0) {
			try {
				await Jo(`/unhide ${e}`);
			} catch (n) {
				ic(t, `Repair: failed to unhide ${e}:`, n);
			}
			i.is_system = !1, delete i.is_hidden, r++;
		}
	}
	if (ps(i), r > 0) {
		try {
			await Vo();
		} catch (e) {
			ic(t, "Could not save chat:", e);
		}
		X(`Repaired ${r} orphaned messages. They are now visible to the summarizer again.`, "Summaryception", { timeOut: 5e3 });
	} else Y("No orphaned messages found.", "Summaryception", { timeOut: 3e3 });
	return r;
}
function _c(e) {
	let t = {
		layers: e.state.layers,
		summarizedUpTo: e.state.summarizedUpTo,
		ghostedIndices: e.state.ghostedIndices
	}, n = new Blob([JSON.stringify(t, null, 2)], { type: "application/json" }), r = URL.createObjectURL(n), i = document.createElement("a");
	i.href = r, i.download = `summaryception_${Date.now()}.json`, i.click(), URL.revokeObjectURL(r), X("Memory exported", "Summaryception");
}
async function vc(e, t) {
	let { settings: n, store: r } = e;
	try {
		let i = await t.text(), a = JSON.parse(i);
		if (!Array.isArray(a.layers)) {
			fs("Invalid file format — layers array missing.", "Summaryception");
			return;
		}
		let o = e.host.getCurrentChatHandle();
		if (!o) {
			fs("No active chat handle.", "Summaryception");
			return;
		}
		await As(r, n);
		let s = {
			layers: a.layers,
			summarizedUpTo: a.summarizedUpTo ?? -1,
			ghostedIndices: a.ghostedIndices ?? []
		};
		await r.importFrom(o, s), s.summarizedUpTo >= 0 && await ks(r, await xs(e.host), n, s.summarizedUpTo);
		try {
			await Vo();
		} catch (e) {
			ic(n, "Could not save chat:", e);
		}
		Ps(n, r), X(`Memory imported. ${s.layers.reduce((e, t) => e + (t?.length ?? 0), 0)} snippets loaded, messages ghosted up to index ${s.summarizedUpTo}.`, "Summaryception", { timeOut: 4e3 });
	} catch (e) {
		console.error(`[${rc}] Import failed`, e), fs("Import failed — check console.", "Summaryception");
	}
}
async function yc(e, t, n) {
	let { settings: r, store: i } = e, a = i.state.layers[t];
	if (!a) return;
	let o = a[n];
	if (!o) return;
	if (!o.turnRange) {
		Z("Only Layer 0 (turn summary) snippets can be regenerated. Promoted meta-summaries have no source turns.", "Summaryception", { timeOut: 5e3 });
		return;
	}
	if (ac || Qs()) {
		Z("Already summarizing. Please wait.", "Summaryception");
		return;
	}
	let [s, c] = o.turnRange, l = await xs(e.host);
	if (confirm(`Regenerate summary for turns ${s}–${c}?`)) {
		ac = !0;
		try {
			let a = await hs(l, s, c);
			if (!a.trim()) {
				fs("Source turns are empty — cannot regenerate.", "Summaryception");
				return;
			}
			let u = gs(i.state.layers, 0, {
				layer: t,
				index: n
			});
			Y(`Regenerating summary for turns ${s}–${c}…`, "Summaryception", {
				timeOut: 3e3,
				progressBar: !0
			});
			let d = await $s(r, a, u);
			if (!d) {
				fs("Regeneration failed — original snippet kept.", "Summaryception");
				return;
			}
			o.text = d, o.timestamp = Date.now(), o.regenerated = !0, await i.save(e.host.getCurrentChatHandle()), Ps(r, i), X(`Snippet regenerated for turns ${s}–${c}`, "Summaryception", { timeOut: 3e3 });
		} finally {
			ac = !1;
		}
	}
}
async function bc(e, t, n) {
	let { store: r } = e, i = r.state.layers[t];
	if (!i) return;
	if (i.splice(n, 1), t === 0 && r.state.layers[0] && r.state.layers[0].length > 0) {
		let e = -1;
		for (let t of r.state.layers[0]) t.turnRange && t.turnRange[1] > e && (e = t.turnRange[1]);
		r.state.summarizedUpTo = e;
	} else t === 0 && (r.state.summarizedUpTo = -1);
	let a = e.host.getCurrentChatHandle();
	a && await r.save(a), Ps(e.settings, r), Y(`Snippet removed from Layer ${t}`, "Summaryception");
}
async function xc(e, t, n, r) {
	let { store: i } = e, a = i.state.layers[t];
	if (!a) return;
	let o = a[n];
	if (!o) return;
	o.text = r;
	let s = e.host.getCurrentChatHandle();
	s && await i.save(s), Ps(e.settings, i), X("Snippet updated", "Summaryception", { timeOut: 1500 });
}
//#endregion
//#region src/ui/useEngine.ts
var Sc = Symbol("summaryception-engine"), Cc = null;
function wc(e) {
	if (Cc) return Cc;
	let t = Oo(), n = Mo(), r = /* @__PURE__ */ Ft({ isSummarizing: !1 });
	function i() {
		if (!e.getCurrentChatHandle()) throw Error("No active chat handle. Open a chat first.");
		return {
			host: e,
			settings: t.state,
			store: n
		};
	}
	async function a() {
		let t = e.getCurrentChatHandle();
		t && (!n.isLoaded || n.currentChatRef !== t.ref) && (await n.load(t), await No(n, t));
	}
	let o = {
		host: e,
		settings: t,
		chatStore: n,
		isSummarizing: (/* @__PURE__ */ Lt(r)).isSummarizing,
		async forceSummarize() {
			await a(), r.isSummarizing = !0;
			try {
				await mc(i());
			} finally {
				r.isSummarizing = sc();
			}
		},
		stopSummarization() {
			cc(t.state), r.isSummarizing = !1;
		},
		async clearMemory() {
			await a(), await hc(i());
		},
		async repairOrphans() {
			return await a(), gc(i());
		},
		exportMemory() {
			_c(n);
		},
		async importMemory(e) {
			await a(), await vc(i(), e);
		},
		async regenerateSnippet(e, t) {
			await a(), r.isSummarizing = !0;
			try {
				await yc(i(), e, t);
			} finally {
				r.isSummarizing = !1;
			}
		},
		async deleteSnippet(e, t) {
			await a(), await bc(i(), e, t);
		},
		async editSnippet(e, t, n) {
			await a(), await xc(i(), e, t, n);
		},
		async onMessageReceived(e) {
			await a(), setTimeout(async () => {
				r.isSummarizing = !0;
				try {
					await lc(i());
				} catch (e) {
					console.error("[Summaryception] maybeSummarizeTurns failed", e);
				} finally {
					r.isSummarizing = sc();
				}
				Ps(t.state, n);
			}, 500);
		},
		async onChatChanged() {
			pc();
			let r = e.getCurrentChatHandle();
			if (r) {
				try {
					await n.load(r), await No(n, r);
				} catch (e) {
					console.error("[Summaryception] Failed to load chat store on chat change", e);
				}
				Ps(t.state, n);
			}
		},
		onGenerationStarted() {
			Ps(t.state, n);
		},
		onAppReady() {
			Ps(t.state, n);
		},
		refresh() {
			Ps(t.state, n);
		}
	};
	return t.subscribe(() => {
		Ps(t.state, n);
	}), Cc = o, o;
}
function Tc() {
	let e = jn(Sc);
	if (!e) throw Error("Engine API not provided. Did you forget to call app.provide(ENGINE_KEY)?");
	return e;
}
//#endregion
//#region src/components/SettingsDrawer.vue?vue&type=script&setup=true&lang.ts
var Ec = { class: "sc-row" }, Dc = {
	class: "checkbox_label",
	for: "sc_enabled"
}, Oc = { class: "sc-row" }, kc = {
	class: "checkbox_label",
	for: "sc_pause_summarization"
}, Ac = { class: "sc-row" }, jc = {
	class: "checkbox_label",
	for: "sc_disable_ghosting"
}, Mc = { class: "sc-button-row" }, Nc = ["disabled"], Pc = ["disabled"], Fc = ["disabled"], Ic = { class: "sc-button-row" }, Lc = /* @__PURE__ */ Hn({
	__name: "SettingsDrawer",
	setup(e) {
		let t = Tc(), n = t.settings, r = /* @__PURE__ */ P(n.state.enabled), i = /* @__PURE__ */ P(n.state.pauseSummarization), a = /* @__PURE__ */ P(n.state.disableGhosting), o = /* @__PURE__ */ P(null);
		function s() {
			n.update({ enabled: r.value }), t.refresh();
		}
		function c() {
			n.update({ pauseSummarization: i.value }), i.value ? Y("Summarization paused. Existing summaries will continue to be injected. Use Force Summarize or unpause to catch up.", "Summaryception", { timeOut: 5e3 }) : Y("Summarization resumed. Will process new turns automatically.", "Summaryception", { timeOut: 3e3 });
		}
		function l() {
			n.update({ disableGhosting: a.value }), a.value && Y("Message hiding disabled. Summarized messages will remain visible but still be excluded from LLM context via the sc_ghosted flag.", "Summaryception", { timeOut: 5e3 });
		}
		async function u() {
			try {
				await t.forceSummarize();
			} catch (e) {
				console.error("[Summaryception] Force summarize failed", e), Z("Force summarize failed. Check console for details.", "Summaryception");
			}
		}
		function d() {
			t.stopSummarization(), Z("Summarization stopped. Progress has been saved.", "Summaryception", { timeOut: 4e3 });
		}
		async function f() {
			try {
				await t.repairOrphans();
			} catch (e) {
				console.error("[Summaryception] Repair failed", e), Z("Repair failed. Check console for details.", "Summaryception");
			}
		}
		function p() {
			o.value?.click();
		}
		async function m(e) {
			let n = e.target, r = n.files?.[0];
			if (r) {
				try {
					await t.importMemory(r);
				} catch (e) {
					console.error("[Summaryception] Import failed", e);
				}
				n.value = "";
			}
		}
		async function h() {
			if (confirm("Clear ALL Summaryception memory for this chat and unghost all messages?")) try {
				await t.clearMemory(), X("Memory cleared.", "Summaryception");
			} catch (e) {
				console.error("[Summaryception] Clear memory failed", e), Z("Clear memory failed. Check console for details.", "Summaryception");
			}
		}
		return (e, n) => (B(), V(z, null, [
			H("div", Ec, [H("label", Dc, [I(H("input", {
				id: "sc_enabled",
				"onUpdate:modelValue": n[0] ||= (e) => r.value = e,
				type: "checkbox",
				onChange: s
			}, null, 544), [[so, r.value]]), n[4] ||= H("span", null, "Enable Summaryception", -1)])]),
			H("div", Oc, [H("label", kc, [
				I(H("input", {
					id: "sc_pause_summarization",
					"onUpdate:modelValue": n[1] ||= (e) => i.value = e,
					type: "checkbox",
					onChange: c
				}, null, 544), [[so, i.value]]),
				n[5] ||= H("span", null, "Pause Summarization", -1),
				n[6] ||= H("small", { class: "sc-hint" }, " Stop processing new turns while keeping existing summaries injected. Preserves prompt cache hits. Unpause or use Force Summarize to catch up. ", -1)
			])]),
			H("div", Ac, [H("label", jc, [
				I(H("input", {
					id: "sc_disable_ghosting",
					"onUpdate:modelValue": n[2] ||= (e) => a.value = e,
					type: "checkbox",
					onChange: l
				}, null, 544), [[so, a.value]]),
				n[7] ||= H("span", null, "Disable Message Hiding", -1),
				n[8] ||= H("small", { class: "sc-hint" }, " Messages will still be summarized and excluded from LLM context, but won't be visually hidden. Useful for compatibility with other extensions. ", -1)
			])]),
			H("div", Mc, [
				H("button", {
					class: "menu_button",
					disabled: Jt(t).isSummarizing,
					onClick: u
				}, [n[9] ||= H("i", { class: "fa-solid fa-bolt" }, null, -1), W(" " + O(Jt(t).isSummarizing ? "Working…" : "Force Summarize Now"), 1)], 8, Nc),
				H("button", {
					class: "menu_button menu_button_danger",
					disabled: !Jt(t).isSummarizing,
					onClick: d
				}, [...n[10] ||= [H("i", { class: "fa-solid fa-stop" }, null, -1), W(" Stop ", -1)]], 8, Pc),
				H("button", {
					class: "menu_button",
					disabled: Jt(t).isSummarizing,
					onClick: f
				}, [...n[11] ||= [H("i", { class: "fa-solid fa-wrench" }, null, -1), W(" Repair Orphans ", -1)]], 8, Fc)
			]),
			H("div", Ic, [
				H("button", {
					class: "menu_button",
					onClick: p
				}, [...n[12] ||= [H("i", { class: "fa-solid fa-download" }, null, -1), W(" Import Memory ", -1)]]),
				H("button", {
					class: "menu_button",
					onClick: n[3] ||= (e) => Jt(t).exportMemory()
				}, [...n[13] ||= [H("i", { class: "fa-solid fa-upload" }, null, -1), W(" Export Memory ", -1)]]),
				H("button", {
					class: "menu_button menu_button_danger",
					onClick: h
				}, [...n[14] ||= [H("i", { class: "fa-solid fa-trash" }, null, -1), W(" Clear Memory ", -1)]])
			]),
			H("input", {
				ref_key: "importInput",
				ref: o,
				type: "file",
				accept: ".json",
				style: { display: "none" },
				onChange: m
			}, null, 544)
		], 64));
	}
}), Rc = { class: "sc-snippet-browser" }, zc = {
	key: 0,
	class: "sc-muted"
}, Bc = { key: 1 }, Vc = { class: "sc-browser-layer-title" }, Hc = ["onKeydown", "onBlur"], Uc = ["onClick"], Wc = { class: "sc-snippet-meta" }, Gc = ["disabled", "onClick"], Kc = ["onClick"], qc = /* @__PURE__ */ Hn({
	__name: "SnippetBrowser",
	setup(e) {
		let t = Tc(), n = t.chatStore, r = /* @__PURE__ */ P(null), i = /* @__PURE__ */ P(""), a = K(() => {
			let e = n.state.layers;
			return e && e.some((e) => e && e.length > 0);
		}), o = K(() => {
			let e = n.state.layers;
			if (!e) return [];
			let t = [];
			for (let n = e.length - 1; n >= 0; n--) {
				let r = e[n];
				if (!r || r.length === 0) continue;
				let i = r.map((e, t) => ({
					snippet: e,
					originalIdx: t
				}));
				t.push({
					originalIdx: n,
					snippets: i
				});
			}
			return t.map((e) => ({
				layerIdx: e.originalIdx,
				snippets: e.snippets.map((e) => e.snippet),
				snippetIndices: e.snippets.map((e) => e.originalIdx)
			}));
		});
		function s(e) {
			let t = o.value[e];
			if (!t) return "";
			let n = t.layerIdx;
			return n === 0 ? "Layer 0 (Turn Summaries)" : `Layer ${n} (Meta-Summary)`;
		}
		function c(e) {
			return e.turnRange ? `turns ${e.turnRange[0]}–${e.turnRange[1]}` : e.mergedCount ? `merged ${e.mergedCount} from L${e.fromLayer}` : "";
		}
		function l(e, t, n) {
			r.value = `${e}-${t}`, i.value = n;
		}
		async function u(e, t, n) {
			e.key === "Enter" && !e.shiftKey ? (e.preventDefault(), await f(t, n)) : e.key === "Escape" && (r.value = null);
		}
		async function d(e, t) {
			await f(e, t);
		}
		async function f(e, n) {
			if (r.value === null) return;
			let a = i.value.trim();
			if (r.value = null, a) try {
				await t.editSnippet(e, n, a), X("Snippet updated", "Summaryception", { timeOut: 1500 });
			} catch (e) {
				console.error("[Summaryception] Edit failed", e);
			}
		}
		async function p(e, n) {
			try {
				await t.regenerateSnippet(e, n), X("Snippet regenerated", "Summaryception", { timeOut: 3e3 });
			} catch (e) {
				console.error("[Summaryception] Regenerate failed", e), Z("Regeneration failed.", "Summaryception");
			}
		}
		async function m(e, n) {
			try {
				await t.deleteSnippet(e, n), Y(`Snippet removed from Layer ${e}`, "Summaryception");
			} catch (e) {
				console.error("[Summaryception] Delete failed", e);
			}
		}
		return (e, n) => (B(), V("div", Rc, [a.value ? (B(), V("div", Bc, [(B(!0), V(z, null, pr(o.value, (e, a) => (B(), V("div", {
			key: a,
			class: "sc-browser-layer"
		}, [H("div", Vc, O(s(a)), 1), (B(!0), V(z, null, pr(e.snippets, (e, o) => (B(), V("div", {
			key: o,
			class: "sc-snippet"
		}, [
			r.value === `${a}-${o}` ? I((B(), V("textarea", {
				key: 0,
				"onUpdate:modelValue": n[0] ||= (e) => i.value = e,
				class: "sc-snippet-edit text_pole",
				rows: "2",
				onKeydown: (e) => u(e, a, o),
				onBlur: (e) => d(a, o)
			}, null, 40, Hc)), [[q, i.value]]) : (B(), V("span", {
				key: 1,
				class: "sc-snippet-text",
				title: "Click to edit",
				onClick: (t) => l(a, o, e.text)
			}, O(e.text), 9, Uc)),
			H("span", Wc, O(c(e)), 1),
			e.turnRange ? (B(), V("button", {
				key: 2,
				class: "sc-snippet-redo menu_button fa-solid fa-rotate-right",
				title: "Regenerate this snippet",
				disabled: Jt(t).isSummarizing,
				onClick: (e) => p(a, o)
			}, null, 8, Gc)) : Hi("", !0),
			H("button", {
				class: "sc-snippet-delete menu_button fa-solid fa-xmark",
				title: "Delete this snippet",
				onClick: (e) => m(a, o)
			}, null, 8, Kc)
		]))), 128))]))), 128))])) : (B(), V("div", zc, "No snippets to display."))]));
	}
}), Jc = ["value"], Yc = { class: "sc-button-row" }, Xc = /* @__PURE__ */ Hn({
	__name: "InjectionPreview",
	setup(e) {
		let t = Tc(), n = K(() => {
			try {
				return Ns(t.settings.state, t.chatStore) || "(empty — no summaries yet)";
			} catch (e) {
				return console.error("[Summaryception] Preview assembly failed", e), "(error assembling preview)";
			}
		});
		return (e, r) => (B(), V("div", null, [H("textarea", {
			class: "text_pole sc-textarea sc-preview",
			rows: "6",
			readonly: "",
			value: n.value
		}, null, 8, Jc), H("div", Yc, [H("button", {
			class: "menu_button",
			onClick: r[0] ||= (e) => Jt(t).refresh()
		}, [...r[1] ||= [H("i", { class: "fa-solid fa-rotate" }, null, -1), W(" Refresh ", -1)]])])]));
	}
}), Zc = { class: "sc-stats-box" }, Qc = { class: "sc-layer-stat" }, $c = { class: "sc-layer-label" }, el = { class: "sc-layer-stat sc-muted" }, tl = {
	key: 0,
	class: "sc-layer-stat sc-muted"
}, nl = /* @__PURE__ */ Hn({
	__name: "LayerStats",
	setup(e) {
		let t = Tc(), n = t.chatStore, r = t.settings, i = K(() => n.state.ghostedIndices.length), a = K(() => r.state.disableGhosting ? "messages ghosted (metadata only — not visually hidden)" : "messages ghosted (hidden from LLM, visible to you)"), o = K(() => r.state.snippetsPerLayer), s = K(() => n.state.summarizedUpTo ?? -1), c = K(() => {
			let e = n.state.layers;
			if (!e) return [];
			let t = [];
			for (let n = e.length - 1; n >= 0; n--) {
				let r = e[n];
				!r || r.length === 0 || t.push({
					idx: n,
					label: n === 0 ? "Layer 0 (turn summaries)" : `Layer ${n} (depth ${n} meta)`,
					count: r.length
				});
			}
			return t;
		}), l = K(() => c.value.length > 0);
		return (e, t) => (B(), V("div", Zc, [
			H("div", Qc, [
				t[0] ||= W(" 👻 ", -1),
				H("strong", null, O(i.value), 1),
				W(" " + O(a.value), 1)
			]),
			(B(!0), V(z, null, pr(c.value, (e) => (B(), V("div", {
				key: e.idx,
				class: "sc-layer-stat"
			}, [
				H("span", $c, O(e.label) + ":", 1),
				H("strong", null, O(e.count), 1),
				W(" / " + O(o.value) + " snippets ", 1)
			]))), 128)),
			H("div", el, " Summarized up to chat index: " + O(s.value), 1),
			l.value ? Hi("", !0) : (B(), V("div", tl, "No summaries yet for this chat."))
		]));
	}
}), rl = { class: "summaryception-connection-section" }, il = { class: "summaryception-setting-row" }, al = { class: "summaryception-setting-row" }, ol = { class: "summaryception-sub-panel" }, sl = { class: "summaryception-setting-row" }, cl = { class: "summaryception-sub-panel" }, ll = { class: "summaryception-setting-row" }, ul = { class: "summaryception-setting-row" }, dl = { class: "summaryception-input-group" }, fl = ["value"], pl = { class: "summaryception-sub-panel" }, ml = { class: "summaryception-setting-row" }, hl = { class: "summaryception-setting-row" }, gl = { class: "summaryception-setting-row" }, _l = { class: "summaryception-setting-row" }, vl = /* @__PURE__ */ Hn({
	__name: "ConnectionPanel",
	setup(e) {
		let t = Tc().settings, n = /* @__PURE__ */ P(null), r = K({
			get: () => t.state.connectionSource,
			set: (e) => t.update({ connectionSource: e })
		}), i = K({
			get: () => t.state.summarizerResponseLength || 0,
			set: (e) => t.update({ summarizerResponseLength: e || 0 })
		}), a = K({
			get: () => t.state.connectionProfileId,
			set: (e) => t.update({ connectionProfileId: e })
		}), o = K({
			get: () => t.state.ollamaUrl,
			set: (e) => t.update({ ollamaUrl: e.trim() })
		}), s = K({
			get: () => t.state.ollamaModel,
			set: (e) => t.update({ ollamaModel: e })
		}), c = K(() => t.state.ollamaModelsCache || []), l = K({
			get: () => t.state.openaiUrl,
			set: (e) => t.update({ openaiUrl: e.trim() })
		}), u = K({
			get: () => t.state.openaiKey,
			set: (e) => t.update({ openaiKey: e.trim() })
		}), d = K({
			get: () => t.state.openaiModel,
			set: (e) => t.update({ openaiModel: e.trim() })
		}), f = K({
			get: () => t.state.openaiMaxTokens || 0,
			set: (e) => t.update({ openaiMaxTokens: e || 0 })
		}), p = /* @__PURE__ */ P({
			visible: !1,
			type: "loading",
			message: ""
		}), m = K(() => {
			switch (p.value.type) {
				case "success": return "fa-circle-check";
				case "error": return "fa-circle-xmark";
				case "loading": return "fa-spinner fa-spin";
			}
		});
		function h(e, t) {
			p.value = {
				visible: !0,
				type: e,
				message: t
			}, e !== "loading" && setTimeout(() => {
				p.value.visible = !1;
			}, 8e3);
		}
		async function g() {
			await gn(), n.value && (ss(n.value, a.value) || await cs(n.value, a.value));
		}
		Pn(r, (e) => {
			e === "profile" && g();
		}), rr(() => {
			r.value === "profile" && g();
		});
		async function _() {
			let e = o.value || "http://localhost:11434";
			h("loading", "Fetching Ollama models...");
			try {
				let n = await Us(e);
				t.update({ ollamaModelsCache: n.map((e) => ({ name: e.name })) }), h("success", `Found ${n.length} model(s)`), X(`Found ${n.length} Ollama model(s)`, "Summaryception");
			} catch (e) {
				let t = e.message;
				h("error", `Failed: ${t}`), fs(`Failed to fetch Ollama models: ${t}`, "Summaryception");
			}
		}
		async function v() {
			if (!l.value) {
				fs("Please enter an endpoint URL first.", "Summaryception");
				return;
			}
			if (!d.value) {
				fs("Please enter a model name first.", "Summaryception");
				return;
			}
			h("loading", "Testing connection...");
			let e = await Ks(l.value, u.value, d.value);
			e.success ? (h("success", e.message), X(e.message, "Summaryception")) : (h("error", e.message), fs(e.message, "Summaryception"));
		}
		return (e, t) => (B(), V("div", rl, [
			t[26] ||= H("hr", { class: "sysHR" }, null, -1),
			t[27] ||= H("div", { class: "summaryception-section-header" }, [H("span", { class: "fa-solid fa-bolt" }), H("span", null, "Summarizer Connection")], -1),
			t[28] ||= H("small", { class: "summaryception-help-text" }, " Choose which LLM connection to use for summarization. Use a cheaper/faster model to save costs while keeping your main API for RP. ", -1),
			H("div", il, [t[9] ||= H("label", { for: "sc_summarizer_response_length" }, [H("span", null, "Summarizer Response Length"), H("small", null, " Override max response tokens for summarizer calls (Default/Profile modes). 0 = use your preset's value. If you get \"max_tokens > 4096 must have stream=true\" errors, set to 4096. ")], -1), I(H("input", {
				id: "sc_summarizer_response_length",
				"onUpdate:modelValue": t[0] ||= (e) => i.value = e,
				type: "number",
				class: "text_pole",
				min: "0",
				step: "100",
				placeholder: "0 = use preset default"
			}, null, 512), [[
				q,
				i.value,
				void 0,
				{ number: !0 }
			]])]),
			H("div", al, [t[11] ||= H("label", { for: "summaryception_connection_source" }, [H("span", null, "Connection Source")], -1), I(H("select", {
				id: "summaryception_connection_source",
				"onUpdate:modelValue": t[1] ||= (e) => r.value = e,
				class: "text_pole"
			}, [...t[10] ||= [
				H("option", { value: "default" }, "Default (Main API)", -1),
				H("option", { value: "profile" }, "Connection Profile", -1),
				H("option", { value: "ollama" }, "Ollama (Local)", -1),
				H("option", { value: "openai" }, "OpenAI Compatible", -1)
			]], 512), [[lo, r.value]])]),
			I(H("div", ol, [H("div", sl, [t[13] ||= H("label", { for: "summaryception_connection_profile" }, [H("span", null, "Connection Profile")], -1), I(H("select", {
				id: "summaryception_connection_profile",
				ref_key: "profileSelect",
				ref: n,
				"onUpdate:modelValue": t[2] ||= (e) => a.value = e,
				class: "text_pole"
			}, [...t[12] ||= [H("option", { value: "" }, "-- Select a Profile --", -1)]], 512), [[lo, a.value]])]), t[14] ||= H("div", { class: "summaryception-note" }, [H("span", { class: "fa-solid fa-info-circle" }), H("small", null, " Uses a saved SillyTavern Connection Profile. Includes endpoint, API key, model, and presets. ⚠️ Connection Profiles inject preset formatting into summary requests, which may degrade summary quality. Consider using Default or OpenAI Compatible instead. ")], -1)], 512), [[Da, r.value === "profile"]]),
			I(H("div", cl, [
				H("div", ll, [t[15] ||= H("label", { for: "summaryception_ollama_url" }, [H("span", null, "Ollama URL")], -1), I(H("input", {
					id: "summaryception_ollama_url",
					"onUpdate:modelValue": t[3] ||= (e) => o.value = e,
					type: "text",
					class: "text_pole",
					placeholder: "http://localhost:11434"
				}, null, 512), [[q, o.value]])]),
				H("div", ul, [t[18] ||= H("label", { for: "summaryception_ollama_model" }, [H("span", null, "Model")], -1), H("div", dl, [I(H("select", {
					id: "summaryception_ollama_model",
					"onUpdate:modelValue": t[4] ||= (e) => s.value = e,
					class: "text_pole"
				}, [t[16] ||= H("option", { value: "" }, "-- Select Model --", -1), (B(!0), V(z, null, pr(c.value, (e) => (B(), V("option", {
					key: e.name,
					value: e.name
				}, O(e.name), 9, fl))), 128))], 512), [[lo, s.value]]), H("div", {
					class: "menu_button menu_button_icon",
					title: "Refresh model list from Ollama",
					onClick: _
				}, [...t[17] ||= [H("span", { class: "fa-solid fa-arrows-rotate" }, null, -1)]])])]),
				t[19] ||= H("div", { class: "summaryception-note" }, [H("span", { class: "fa-solid fa-info-circle" }), H("small", null, [
					W(" Connects to a local Ollama instance. Requires "),
					H("code", null, "enableCorsProxy: true"),
					W(" in your SillyTavern "),
					H("code", null, "config.yaml"),
					W(", OR set "),
					H("code", null, "OLLAMA_ORIGINS=*"),
					W(" on your Ollama instance. ")
				])], -1)
			], 512), [[Da, r.value === "ollama"]]),
			I(H("div", pl, [
				H("div", ml, [t[20] ||= H("label", { for: "summaryception_openai_url" }, [H("span", null, "Endpoint URL")], -1), I(H("input", {
					id: "summaryception_openai_url",
					"onUpdate:modelValue": t[5] ||= (e) => l.value = e,
					type: "text",
					class: "text_pole",
					placeholder: "http://localhost:1234/v1 or https://openrouter.ai/api/v1"
				}, null, 512), [[q, l.value]])]),
				H("div", hl, [t[21] ||= H("label", { for: "summaryception_openai_key" }, [H("span", null, "API Key")], -1), I(H("input", {
					id: "summaryception_openai_key",
					"onUpdate:modelValue": t[6] ||= (e) => u.value = e,
					type: "password",
					class: "text_pole",
					placeholder: "(optional, for cloud services)",
					autocomplete: "off"
				}, null, 512), [[q, u.value]])]),
				H("div", gl, [t[22] ||= H("label", { for: "summaryception_openai_model" }, [H("span", null, "Model Name")], -1), I(H("input", {
					id: "summaryception_openai_model",
					"onUpdate:modelValue": t[7] ||= (e) => d.value = e,
					type: "text",
					class: "text_pole",
					placeholder: "e.g. gpt-4o-mini, llama-3.1-8b"
				}, null, 512), [[q, d.value]])]),
				H("div", _l, [t[23] ||= H("label", { for: "summaryception_openai_max_tokens" }, [H("span", null, "Max Tokens")], -1), I(H("input", {
					id: "summaryception_openai_max_tokens",
					"onUpdate:modelValue": t[8] ||= (e) => f.value = e,
					type: "number",
					class: "text_pole",
					min: "0",
					step: "100",
					placeholder: "0 = no limit (provider default)"
				}, null, 512), [[
					q,
					f.value,
					void 0,
					{ number: !0 }
				]])]),
				H("div", { class: "summaryception-setting-row" }, [H("div", {
					class: "menu_button menu_button_icon",
					title: "Test the OpenAI-compatible connection",
					onClick: v
				}, [...t[24] ||= [H("span", { class: "fa-solid fa-plug-circle-check" }, null, -1), H("span", null, "Test Connection", -1)]])]),
				t[25] ||= H("div", { class: "summaryception-note" }, [H("span", { class: "fa-solid fa-info-circle" }), H("small", null, [
					W(" Works with LM Studio, KoboldCPP, vLLM, text-generation-webui, OpenRouter, or any OpenAI-compatible endpoint. Enter the base URL up to "),
					H("code", null, "/v1"),
					W(". Local endpoints require "),
					H("code", null, "enableCorsProxy: true"),
					W(" in "),
					H("code", null, "config.yaml"),
					W(". Cloud APIs work without the proxy. ")
				])], -1)
			], 512), [[Da, r.value === "openai"]]),
			I(H("div", { class: D(["summaryception-connection-status", p.value.type]) }, [H("span", { class: D(["fa-solid", m.value]) }, null, 2), H("span", null, O(p.value.message), 1)], 2), [[Da, p.value.visible]])
		]));
	}
}), yl = { class: "inline-drawer" }, bl = { class: "inline-drawer-content" }, xl = { class: "sc-row" }, Sl = { class: "sc-slider-row" }, Cl = { class: "sc-val" }, wl = { class: "sc-row" }, Tl = { class: "sc-slider-row" }, El = { class: "sc-val" }, Dl = { class: "sc-row" }, Ol = { class: "sc-slider-row" }, kl = { class: "sc-val" }, Al = { class: "sc-row" }, jl = { class: "sc-slider-row" }, Ml = { class: "sc-val" }, Nl = { class: "sc-row" }, Pl = { class: "sc-slider-row" }, Fl = { class: "sc-val" }, Il = { class: "sc-row" }, Ll = { class: "sc-setting-item" }, Rl = { class: "sc-custom-prompt-manager" }, zl = { class: "sc-custom-prompt-row" }, Bl = { class: "sc-custom-prompt-slots" }, Vl = { class: "sc-custom-prompt-slot-row" }, Hl = ["value"], Ul = { class: "sc-custom-prompt-actions" }, Wl = { class: "sc-custom-prompt-save-row" }, Gl = { class: "sc-row" }, Kl = { class: "sc-row" }, ql = { class: "sc-row" }, Jl = { class: "sc-row" }, Yl = {
	class: "checkbox_label",
	for: "sc_debug_mode"
}, Xl = { class: "sc-row" }, Zl = {
	class: "checkbox_label",
	for: "sc_trace_mode"
}, Ql = /* @__PURE__ */ Hn({
	__name: "AdvancedSettings",
	setup(e) {
		let t = Tc().settings, n = /* @__PURE__ */ P(!0), r = /* @__PURE__ */ P(null), i = K({
			get: () => t.state.verbatimTurns,
			set: (e) => t.update({ verbatimTurns: e })
		}), a = K({
			get: () => t.state.turnsPerSummary,
			set: (e) => t.update({ turnsPerSummary: e })
		}), o = K({
			get: () => t.state.snippetsPerLayer,
			set: (e) => t.update({ snippetsPerLayer: e })
		}), s = K({
			get: () => t.state.snippetsPerPromotion,
			set: (e) => t.update({ snippetsPerPromotion: e })
		}), c = K({
			get: () => t.state.maxLayers,
			set: (e) => t.update({ maxLayers: e })
		}), l = /* @__PURE__ */ P(t.state.summarizerSystemPrompt), u = /* @__PURE__ */ P(t.state.summarizerUserPrompt), d = /* @__PURE__ */ P(t.state.injectionTemplate), f = /* @__PURE__ */ P((t.state.stripPatterns || []).join("\n")), p = /* @__PURE__ */ P(t.state.promptPreset), m = K(() => Object.keys(t.state.savedCustomPrompts || {}).sort()), h = /* @__PURE__ */ P(""), g = /* @__PURE__ */ P("");
		function _() {
			t.update({ summarizerSystemPrompt: l.value });
		}
		function v() {
			t.setPromptPreset(p.value), u.value = t.state.summarizerUserPrompt;
		}
		function y() {
			t.setUserPrompt(u.value), p.value = t.state.promptPreset;
		}
		function b() {
			t.update({ injectionTemplate: d.value });
		}
		function x() {
			let e = f.value.split("\n").map((e) => e.trim()).filter((e) => e.length > 0);
			t.update({ stripPatterns: e });
		}
		function ee() {
			t.update({ debugMode: C.value });
		}
		function S() {
			t.update({ traceMode: te.value });
		}
		let C = /* @__PURE__ */ P(t.state.debugMode), te = /* @__PURE__ */ P(t.state.traceMode);
		function ne() {
			if (!g.value.trim()) {
				Z("Enter a name for the prompt.", "Summaryception");
				return;
			}
			if (t.saveCustomPrompt(g.value.trim())) {
				let e = g.value.trim();
				g.value = "", X(`Prompt "${e}" saved.`, "Summaryception", { timeOut: 2e3 });
			} else Z("Prompt is empty — nothing to save.", "Summaryception");
		}
		function re() {
			if (!h.value) {
				Z("Select a saved prompt to load.", "Summaryception");
				return;
			}
			t.loadCustomPrompt(h.value) ? (u.value = t.state.summarizerUserPrompt, p.value = "custom", X(`Loaded prompt "${h.value}".`, "Summaryception", { timeOut: 2e3 })) : fs(`Prompt "${h.value}" not found.`, "Summaryception");
		}
		function w() {
			if (!h.value) {
				Z("Select a saved prompt to delete.", "Summaryception");
				return;
			}
			confirm(`Delete saved prompt "${h.value}"?`) && (t.deleteCustomPrompt(h.value), h.value = "", Y("Prompt deleted.", "Summaryception", { timeOut: 2e3 }));
		}
		function ie() {
			let e = u.value;
			if (!e.trim()) {
				Z("Prompt is empty — nothing to export.", "Summaryception");
				return;
			}
			let t = new Blob([e], { type: "text/plain" }), n = URL.createObjectURL(t), r = document.createElement("a");
			r.href = n, r.download = `summaryception_prompt_${Date.now()}.txt`, r.click(), URL.revokeObjectURL(n), X("Prompt exported.", "Summaryception", { timeOut: 2e3 });
		}
		function T() {
			r.value?.click();
		}
		async function ae(e) {
			let n = e.target, r = n.files?.[0];
			if (r) {
				try {
					let e = await r.text();
					if (!e.trim()) {
						Z("File is empty.", "Summaryception");
						return;
					}
					u.value = e, t.setUserPrompt(e), p.value = "custom", X(`Prompt imported from "${r.name}".`, "Summaryception", { timeOut: 3e3 });
				} catch (e) {
					console.error("[Summaryception] Prompt import failed", e), fs("Import failed — check console.", "Summaryception");
				}
				n.value = "";
			}
		}
		function oe() {
			confirm("Reset all Advanced Settings to defaults?\n\nThis will reset sliders, prompts, injection template, and strip patterns.\nIt will NOT clear your summary memory or connection settings.") && (t.resetAdvancedToDefaults(), l.value = t.state.summarizerSystemPrompt, u.value = t.state.summarizerUserPrompt, d.value = t.state.injectionTemplate, f.value = (t.state.stripPatterns || []).join("\n"), p.value = t.state.promptPreset, C.value = t.state.debugMode, te.value = t.state.traceMode, X("Advanced settings reset to defaults. Connection settings and summary memory were preserved.", "Summaryception", { timeOut: 4e3 }));
		}
		return (e, t) => (B(), V("div", yl, [H("div", {
			class: "inline-drawer-toggle inline-drawer-header",
			onClick: t[0] ||= (e) => n.value = !n.value
		}, [t[15] ||= H("b", null, "⚙️ Advanced Settings", -1), H("div", { class: D(["inline-drawer-icon fa-solid fa-circle-chevron-down down", { rotated: n.value }]) }, null, 2)]), I(H("div", bl, [
			U(vl),
			t[38] ||= H("hr", { class: "sc-divider" }, null, -1),
			t[39] ||= H("h4", { class: "sc-section-title" }, "📖 Verbatim Turn Settings", -1),
			H("div", xl, [t[16] ||= H("label", { for: "sc_verbatim_turns" }, [H("span", null, "Verbatim Assistant Turns to Keep"), H("small", { class: "sc-hint" }, "Recent assistant turns sent word-for-word. Older ones are summarized.")], -1), H("div", Sl, [I(H("input", {
				id: "sc_verbatim_turns",
				"onUpdate:modelValue": t[1] ||= (e) => i.value = e,
				type: "range",
				min: "1",
				max: "50",
				step: "1"
			}, null, 512), [[
				q,
				i.value,
				void 0,
				{ number: !0 }
			]]), H("span", Cl, O(i.value), 1)])]),
			H("div", wl, [t[17] ||= H("label", { for: "sc_turns_per_summary" }, [H("span", null, "Turns per Summary Batch"), H("small", { class: "sc-hint" }, "When limit is exceeded, this many oldest turns are summarized together.")], -1), H("div", Tl, [I(H("input", {
				id: "sc_turns_per_summary",
				"onUpdate:modelValue": t[2] ||= (e) => a.value = e,
				type: "range",
				min: "1",
				max: "20",
				step: "1"
			}, null, 512), [[
				q,
				a.value,
				void 0,
				{ number: !0 }
			]]), H("span", El, O(a.value), 1)])]),
			t[40] ||= H("hr", { class: "sc-divider" }, null, -1),
			t[41] ||= H("h4", { class: "sc-section-title" }, "🔄 Layer Settings (the \"ception\")", -1),
			H("div", Dl, [t[18] ||= H("label", { for: "sc_snippets_per_layer" }, [H("span", null, "Max Snippets per Layer"), H("small", { class: "sc-hint" }, "When exceeded, oldest snippets are promoted into a deeper layer.")], -1), H("div", Ol, [I(H("input", {
				id: "sc_snippets_per_layer",
				"onUpdate:modelValue": t[3] ||= (e) => o.value = e,
				type: "range",
				min: "3",
				max: "100",
				step: "1"
			}, null, 512), [[
				q,
				o.value,
				void 0,
				{ number: !0 }
			]]), H("span", kl, O(o.value), 1)])]),
			H("div", Al, [t[19] ||= H("label", { for: "sc_snippets_per_promotion" }, [H("span", null, "Snippets per Promotion"), H("small", { class: "sc-hint" }, "How many oldest snippets merge when promoting to the next layer.")], -1), H("div", jl, [I(H("input", {
				id: "sc_snippets_per_promotion",
				"onUpdate:modelValue": t[4] ||= (e) => s.value = e,
				type: "range",
				min: "2",
				max: "20",
				step: "1"
			}, null, 512), [[
				q,
				s.value,
				void 0,
				{ number: !0 }
			]]), H("span", Ml, O(s.value), 1)])]),
			H("div", Nl, [t[20] ||= H("label", { for: "sc_max_layers" }, [H("span", null, "Maximum Layer Depth"), H("small", { class: "sc-hint" }, "How many recursive layers of summarization are allowed.")], -1), H("div", Pl, [I(H("input", {
				id: "sc_max_layers",
				"onUpdate:modelValue": t[5] ||= (e) => c.value = e,
				type: "range",
				min: "1",
				max: "10",
				step: "1"
			}, null, 512), [[
				q,
				c.value,
				void 0,
				{ number: !0 }
			]]), H("span", Fl, O(c.value), 1)])]),
			t[42] ||= H("hr", { class: "sc-divider" }, null, -1),
			t[43] ||= H("h4", { class: "sc-section-title" }, "✏️ Summarizer Prompts", -1),
			H("div", Il, [t[21] ||= H("label", { for: "sc_summarizer_system_prompt" }, [H("span", null, "System Prompt")], -1), I(H("textarea", {
				id: "sc_summarizer_system_prompt",
				"onUpdate:modelValue": t[6] ||= (e) => l.value = e,
				class: "text_pole sc-textarea",
				rows: "3",
				onChange: _
			}, null, 544), [[q, l.value]])]),
			H("div", Ll, [t[23] ||= H("label", { for: "sc_prompt_preset" }, [H("small", null, "Prompt Preset")], -1), I(H("select", {
				id: "sc_prompt_preset",
				"onUpdate:modelValue": t[7] ||= (e) => p.value = e,
				class: "text_pole",
				onChange: v
			}, [...t[22] ||= [
				H("option", { value: "narrative" }, "Narrative State (Default)", -1),
				H("option", { value: "gamestate" }, "Game State", -1),
				H("option", { value: "custom" }, "Custom", -1)
			]], 544), [[lo, p.value]])]),
			I(H("div", Rl, [H("div", zl, [H("div", Bl, [t[27] ||= H("label", { for: "sc_custom_prompt_slot" }, [H("small", null, "Saved Custom Prompts")], -1), H("div", Vl, [
				I(H("select", {
					id: "sc_custom_prompt_slot",
					"onUpdate:modelValue": t[8] ||= (e) => h.value = e,
					class: "text_pole"
				}, [t[24] ||= H("option", { value: "" }, "-- Load a saved prompt --", -1), (B(!0), V(z, null, pr(m.value, (e) => (B(), V("option", {
					key: e,
					value: e
				}, O(e), 9, Hl))), 128))], 512), [[lo, h.value]]),
				H("button", {
					class: "menu_button",
					title: "Load selected prompt",
					onClick: re
				}, [...t[25] ||= [H("i", { class: "fa-solid fa-folder-open" }, null, -1)]]),
				H("button", {
					class: "menu_button menu_button_danger",
					title: "Delete selected prompt",
					onClick: w
				}, [...t[26] ||= [H("i", { class: "fa-solid fa-trash" }, null, -1)]])
			])]), H("div", Ul, [H("div", Wl, [I(H("input", {
				id: "sc_custom_prompt_name",
				"onUpdate:modelValue": t[9] ||= (e) => g.value = e,
				type: "text",
				class: "text_pole",
				placeholder: "Prompt name..."
			}, null, 512), [[q, g.value]]), H("button", {
				class: "menu_button",
				title: "Save current prompt",
				onClick: ne
			}, [...t[28] ||= [H("i", { class: "fa-solid fa-floppy-disk" }, null, -1), W(" Save ", -1)]])]), H("div", { class: "sc-custom-prompt-io-row" }, [H("button", {
				class: "menu_button",
				title: "Export current prompt as .txt",
				onClick: ie
			}, [...t[29] ||= [H("i", { class: "fa-solid fa-file-export" }, null, -1), W(" Export ", -1)]]), H("button", {
				class: "menu_button",
				title: "Import prompt from .txt",
				onClick: T
			}, [...t[30] ||= [H("i", { class: "fa-solid fa-file-import" }, null, -1), W(" Import ", -1)]])])])])], 512), [[Da, p.value === "custom"]]),
			H("div", Gl, [t[31] ||= H("label", { for: "sc_summarizer_user_prompt" }, [H("span", null, "User Prompt (Turn → Snippet & Layer Promotion)"), H("small", { class: "sc-hint" }, [
				W(" Variables: "),
				H("code", null, "{{player_name}}"),
				H("code", null, "{{context_str}}"),
				W(" (that layer's existing snippets) "),
				H("code", null, "{{story_txt}}"),
				W(" (passage to summarize) ")
			])], -1), I(H("textarea", {
				id: "sc_summarizer_user_prompt",
				"onUpdate:modelValue": t[10] ||= (e) => u.value = e,
				class: "text_pole sc-textarea sc-textarea-tall",
				rows: "10",
				onInput: y
			}, null, 544), [[q, u.value]])]),
			H("div", Kl, [t[32] ||= H("label", { for: "sc_injection_template" }, [H("span", null, "Injection Wrapper Template"), H("small", { class: "sc-hint" }, [
				W(" Wraps the assembled block. Use "),
				H("code", null, "{{summary}}"),
				W(" for the combined text. ")
			])], -1), I(H("textarea", {
				id: "sc_injection_template",
				"onUpdate:modelValue": t[11] ||= (e) => d.value = e,
				class: "text_pole sc-textarea",
				rows: "3",
				onChange: b
			}, null, 544), [[q, d.value]])]),
			t[44] ||= H("hr", { class: "sc-divider" }, null, -1),
			H("div", ql, [t[33] ||= H("label", { for: "sc_strip_patterns" }, [H("span", null, "Strip Patterns (one per line)"), H("small", { class: "sc-hint" }, "Tags and prefixes to remove from summarizer output.")], -1), I(H("textarea", {
				id: "sc_strip_patterns",
				"onUpdate:modelValue": t[12] ||= (e) => f.value = e,
				class: "text_pole sc-textarea",
				rows: "4",
				onChange: x
			}, null, 544), [[q, f.value]])]),
			t[45] ||= H("hr", { class: "sc-divider" }, null, -1),
			H("div", Jl, [H("label", Yl, [I(H("input", {
				id: "sc_debug_mode",
				"onUpdate:modelValue": t[13] ||= (e) => C.value = e,
				type: "checkbox",
				onChange: ee
			}, null, 544), [[so, C.value]]), t[34] ||= H("span", null, "Debug Mode (verbose console logs)", -1)])]),
			H("div", Xl, [H("label", Zl, [I(H("input", {
				id: "sc_trace_mode",
				"onUpdate:modelValue": t[14] ||= (e) => te.value = e,
				type: "checkbox",
				onChange: S
			}, null, 544), [[so, te.value]]), t[35] ||= H("span", null, "Trace Mode (detailed flow logs)", -1)]), t[36] ||= H("small", { class: "sc-hint" }, "Requires Debug Mode to be enabled.", -1)]),
			t[46] ||= H("hr", { class: "sc-divider" }, null, -1),
			H("div", { class: "sc-button-row" }, [H("button", {
				class: "menu_button",
				onClick: oe
			}, [...t[37] ||= [H("i", { class: "fa-solid fa-arrow-rotate-left" }, null, -1), W(" Reset to Defaults ", -1)]])]),
			H("input", {
				ref_key: "promptImportInput",
				ref: r,
				type: "file",
				accept: ".txt,.text",
				style: { display: "none" },
				onChange: ae
			}, null, 544)
		], 512), [[Da, n.value]])]));
	}
}), $l = { class: "sc-settings" }, eu = { class: "inline-drawer" }, tu = { class: "inline-drawer-content" }, nu = /* @__PURE__ */ Hn({
	__name: "App",
	setup(e) {
		let t = /* @__PURE__ */ P(!0);
		function n() {
			t.value = !t.value;
		}
		return (e, r) => (B(), V("div", $l, [H("div", eu, [H("div", {
			class: "inline-drawer-toggle inline-drawer-header",
			onClick: n
		}, [r[0] ||= H("b", null, "🧠 Summaryception", -1), H("div", { class: D(["inline-drawer-icon fa-solid fa-circle-chevron-down down", { rotated: t.value }]) }, null, 2)]), I(H("div", tu, [
			U(Lc),
			r[1] ||= H("hr", { class: "sc-divider" }, null, -1),
			r[2] ||= H("h4", { class: "sc-section-title" }, "🗂️ Snippet Browser", -1),
			U(qc),
			r[3] ||= H("hr", { class: "sc-divider" }, null, -1),
			r[4] ||= H("h4", { class: "sc-section-title" }, "👁️ Injection Preview", -1),
			U(Xc),
			r[5] ||= H("hr", { class: "sc-divider" }, null, -1),
			r[6] ||= H("h4", { class: "sc-section-title" }, "📊 Layer Stats", -1),
			U(nl),
			r[7] ||= H("hr", { class: "sc-divider" }, null, -1),
			U(Ql)
		], 512), [[Da, t.value]])])]));
	}
});
//#endregion
//#region src/host/client.ts
function ru(e) {
	let t = /* @__PURE__ */ new Set();
	return e.chat && t.add("chat"), e.layout && t.add("layout"), t;
}
function iu(e = Po()) {
	if (!e) throw Error("TauriTavern host API is unavailable.");
	let t = ru(e);
	return {
		api: e,
		capabilities: t,
		supports(e) {
			return t.has(e);
		},
		supportsAll(e) {
			return e.every((e) => t.has(e));
		},
		getChatApi() {
			if (!e.chat) throw Error("Chat API is unavailable on this TauriTavern host.");
			return e.chat;
		},
		getCurrentChatHandle() {
			if (!e.chat) return null;
			try {
				return e.chat.current.handle();
			} catch {
				return null;
			}
		},
		getCurrentChatRef() {
			if (!e.chat) return null;
			try {
				return e.chat.current.ref();
			} catch {
				return null;
			}
		}
	};
}
//#endregion
//#region src/index.ts
var au = "summaryception-mount", ou = "[Summaryception]", su = null, cu = null, lu = null, uu = [], du = !1;
function fu() {
	return document.readyState === "loading" ? new Promise((e) => {
		document.addEventListener("DOMContentLoaded", () => e(), { once: !0 });
	}) : Promise.resolve();
}
function pu() {
	return document.getElementById("extensions_settings2") ?? document.getElementById("extensions_settings");
}
function mu(e) {
	ms("sc-status", () => {
		let t = e.chatStore.state, n = ["**Summaryception Status**"];
		if (n.push(`Summarized up to index: ${t.summarizedUpTo}`), t.layers) for (let e = 0; e < t.layers.length; e++) {
			let r = t.layers[e];
			r && r.length > 0 && n.push(`Layer ${e}: ${r.length} snippets`);
		}
		return n.push(`Ghosted messages: ${t.ghostedIndices.length}`), n.join("\n");
	}, "Show Summaryception layer status"), ms("sc-clear", async () => (await e.clearMemory(), "Summaryception memory cleared and messages unghosted."), "Clear all Summaryception memory and unghost messages for this chat"), ms("sc-preview", () => Ns(e.settings.state, e.chatStore) || "(No summaries yet)", "Preview the summary block that would be injected");
}
function hu(e) {
	let t = Zo((t) => {
		e.onMessageReceived(t);
	});
	uu.push(t);
	let n = Qo(() => {
		e.onChatChanged();
	});
	uu.push(n);
	let r = $o(() => {
		e.onGenerationStarted();
	});
	uu.push(r);
	let i = es(() => {
		e.onAppReady(), console.log(ou, "v5.5.3-tt.1 loaded (TauriTavern native port).");
	});
	uu.push(i);
}
function gu(e) {
	if (su) return;
	let t = pu();
	if (!t) {
		console.error(ou, "Extensions settings container not found.");
		return;
	}
	document.getElementById(au)?.remove(), cu = document.createElement("div"), cu.id = au, cu.className = "extension_container", t.appendChild(cu), su = _o(nu), su.provide(Sc, e), su.mount(cu), console.log(ou, "Vue app mounted.");
}
function _u() {
	for (let e of uu) try {
		e();
	} catch (e) {
		console.warn(ou, "Disposer error", e);
	}
	uu = [], Fs(), su?.unmount(), su = null, cu?.remove(), cu = null;
}
async function vu() {
	if (du) return;
	du = !0, await fu(), await Fo();
	let e = Po();
	if (!e) {
		console.error(ou, "TauriTavern host API is unavailable. This extension requires TauriTavern.");
		return;
	}
	try {
		lu = iu(e);
	} catch (e) {
		console.error(ou, "Failed to create HostClient", e);
		return;
	}
	if (!lu.supports("chat")) {
		console.error(ou, "TauriTavern host does not expose the chat API. Summaryception cannot function.");
		return;
	}
	let t = wc(lu);
	gu(t), mu(t), hu(t), window.addEventListener("pagehide", () => _u(), { once: !0 });
}
vu().catch((e) => {
	console.error(ou, "Bootstrap failed", e);
});
//#endregion

//# sourceMappingURL=index.js.map