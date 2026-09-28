/* runtime.js — זמן הריצה של "פשוט" בדפדפן (ובבדיקות: ב-node).
 * אותם כללים כמו runtime.h: מספר שלם = BigInt בטווח של 64 ביט, בדיוק כמו בגרסה שרצה על המעבד;
 * כל כשל = הודעה בעברית עם מספר שורה. */
'use strict';
class PdError extends Error { constructor(line, msg) { super(msg); this.line = line; this.msg = msg; } }
const pd = {};
const IS_NODE = typeof process !== 'undefined' && process.versions && process.versions.node && typeof window === 'undefined';
pd.die = (line, msg) => { throw new PdError(line, msg); };
pd.unset = (name, line) => pd.die(line, `המשתנה "${name}" עוד לא קיבל ערך`);

/* ---------- מספרים שלמים ---------- */
const MAXI = 2n ** 63n - 1n, MINI = -(2n ** 63n);
const OVF = 'המספר גדול מדי (מעבר לטווח של מספר שלם)';
pd.ci = (r, l) => { if (r > MAXI || r < MINI) pd.die(l, OVF); return r; };
pd.add = (a, b, l) => pd.ci(a + b, l);
pd.sub = (a, b, l) => pd.ci(a - b, l);
pd.mul = (a, b, l) => pd.ci(a * b, l);
pd.neg = (a, l) => pd.ci(-a, l);
pd.abs = (a, l) => pd.ci(a < 0n ? -a : a, l);
pd.floordiv = (a, b, l) => {
    if (b === 0n) pd.die(l, 'חלוקה באפס');
    let q = a / b;
    if ((a % b !== 0n) && ((a < 0n) !== (b < 0n))) q -= 1n;
    return pd.ci(q, l);
};
pd.mod = (a, b, l) => {
    if (b === 0n) pd.die(l, 'חלוקה באפס (שארית)');
    let r = a % b;
    if (r !== 0n && ((r < 0n) !== (b < 0n))) r += b;
    return r;
};
/* ---------- שברים ---------- */
pd.fc = (v, l) => { if (!Number.isFinite(v)) pd.die(l, 'שבר גדול מדי (אינסוף)'); return v; };
pd.fdiv = (a, b, l) => { if (b === 0) pd.die(l, 'חלוקה באפס'); return pd.fc(a / b, l); };
pd.itof = (a) => Number(a);

/* ---------- טקסט (לפי אותיות, לא לפי יחידות UTF-16) ---------- */
pd.chars = (s) => Array.from(s);
pd.len = (s) => { let n = 0; for (const _ of s) n++; return n; };
const inRanges = (t, c) => { let lo = 0, hi = t.length; while (lo < hi) { const m = (lo + hi) >> 1; if (c < t[m][0]) hi = m; else if (c > t[m][1]) lo = m + 1; else return true; } return false; };
const isSpace = (ch) => inRanges(PD_SPACE, ch.codePointAt(0));
pd.textAt = (s, i, l) => {
    const a = pd.chars(s), n = BigInt(a.length), j = i < 0n ? i + n : i;
    if (j < 0n || j >= n) pd.die(l, `אין אות במקום ${i} (בטקסט יש ${n} אותיות)`);
    return a[Number(j)];
};
pd.contains = (hay, needle) => hay.includes(needle);
pd.repeatText = (s, n, l) => {
    if (n <= 0n || s === '') return '';
    if (BigInt(s.length) * n > 1n << 29n) pd.die(l, 'הטקסט יוצא גדול מדי');
    return s.repeat(Number(n));
};
pd.repeatList = (a, n, l) => {
    if (n <= 0n || a.length === 0) return [];
    if (BigInt(a.length) * n > 1n << 27n) pd.die(l, 'הרשימה יוצאת גדולה מדי');
    const r = []; for (let i = 0n; i < n; i++) for (const x of a) r.push(x); return r;
};
/* מקום בבתים -> מקום באותיות */
const cpIndex = (s, unitIdx) => pd.len(s.slice(0, unitIdx));
pd.find = (s, sub) => { const f = s.indexOf(sub); return BigInt(f < 0 ? -1 : cpIndex(s, f)); };
pd.count = (s, sub) => {
    if (sub === '') return BigInt(pd.len(s) + 1);
    let n = 0, i = 0;
    for (;;) { const f = s.indexOf(sub, i); if (f < 0) break; n++; i = f + sub.length; }
    return BigInt(n);
};
pd.starts = (s, x) => s.startsWith(x);
pd.ends = (s, x) => s.endsWith(x);
pd.replace = (s, o, n) => {
    if (o === '') return n + pd.chars(s).map(c => c + n).join('');
    return s.split(o).join(n);
};
pd.split = (s, sep, l) => {
    if (sep !== null) {
        if (sep === '') pd.die(l, 'המפריד ב"פצל" לא יכול להיות טקסט ריק');
        return s.split(sep);
    }
    const r = []; let cur = null;
    for (const ch of s) { if (isSpace(ch)) { if (cur !== null) { r.push(cur); cur = null; } } else cur = (cur ?? '') + ch; }
    if (cur !== null) r.push(cur);
    return r;
};
pd.lines = (s) => {
    const r = []; let cur = ''; const a = pd.chars(s);
    for (let i = 0; i < a.length; i++) {
        const c = a[i].codePointAt(0);
        if (c === 10 || c === 13 || c === 0x0B || c === 0x0C || c === 0x1C || c === 0x1D || c === 0x1E || c === 0x85 || c === 0x2028 || c === 0x2029) {
            r.push(cur); cur = '';
            if (c === 13 && a[i + 1] === '\n') i++;
        } else cur += a[i];
    }
    if (cur !== '') r.push(cur);
    return r;
};
pd.join = (sep, l) => l.join(sep);
pd.strip = (s, chars) => {
    const a = pd.chars(s);
    const has = chars === null ? isSpace : (ch) => chars.includes(ch);
    let i = 0, j = a.length;
    while (i < j && has(a[i])) i++;
    while (j > i && has(a[j - 1])) j--;
    return a.slice(i, j).join('');
};
pd.upper = (s) => s.toUpperCase();
pd.lower = (s) => s.toLowerCase();
pd.ord = (s, l) => { const a = pd.chars(s); if (a.length !== 1) pd.die(l, `"קוד_אות" צריך אות אחת בדיוק — קיבל טקסט עם ${a.length} אותיות`); return BigInt(a[0].codePointAt(0)); };
pd.chr = (c, l) => {
    if (c <= 0n || c > 0x10FFFFn || (c >= 0xD800n && c < 0xE000n)) pd.die(l, `${c} אינו קוד של אות (צריך 1 עד 1114111, בלי 55296–57343)`);
    return String.fromCodePoint(Number(c));
};
/* ---------- חיתוך — הכללים של Python ---------- */
pd.sliceIdx = (len, a, b, s, l) => {
    if (s === null) s = 1n;
    if (s === 0n) pd.die(l, 'הקפיצה בחיתוך לא יכולה להיות 0');
    const L = BigInt(len);
    if (a === null) a = s < 0n ? L - 1n : 0n; else { if (a < 0n) { a += L; if (a < 0n) a = s < 0n ? -1n : 0n; } else if (a >= L) a = s < 0n ? L - 1n : L; }
    if (b === null) b = s < 0n ? -1n : L; else { if (b < 0n) { b += L; if (b < 0n) b = s < 0n ? -1n : 0n; } else if (b >= L) b = s < 0n ? L - 1n : L; }
    const r = [];
    if (s > 0n) for (let i = a; i < b; i += s) r.push(Number(i)); else for (let i = a; i > b; i += s) r.push(Number(i));
    return r;
};
pd.sliceList = (x, a, b, s, l) => pd.sliceIdx(x.length, a, b, s, l).map(i => x[i]);
pd.sliceText = (x, a, b, s, l) => { const c = pd.chars(x); return pd.sliceIdx(c.length, a, b, s, l).map(i => c[i]).join(''); };

/* ---------- המרות ---------- */
pd.ftos = (v) => {                   /* כמו repr של Python: הכי מעט ספרות שמחזירות את אותו מספר */
    if (v === 0) return Object.is(v, -0) ? '-0.0' : '0.0';
    const e = v.toExponential();      /* הכי קצר שמדויק — לפי התקן */
    const m = /^(-?)(\d)(?:\.(\d+))?e([+-]\d+)$/.exec(e);
    const neg = m[1], digits = (m[2] + (m[3] || '')).replace(/0+$/, '') || '0', exp = parseInt(m[4], 10);
    let out;
    if (exp >= -4 && exp < 16) {
        if (exp < 0) out = '0.' + '0'.repeat(-exp - 1) + digits;
        else {
            const ip = digits.slice(0, exp + 1).padEnd(exp + 1, '0'), fp = digits.slice(exp + 1);
            out = ip + '.' + (fp || '0');
        }
    } else {
        out = digits[0] + (digits.length > 1 ? '.' + digits.slice(1) : '') + 'e' + (exp < 0 ? '-' : '+') + String(Math.abs(exp)).padStart(2, '0');
    }
    return neg + out;
};
pd.btos = (b) => b ? 'נכון' : 'לא נכון';
pd.stoi = (s, l) => {
    const m = /^[ \t]*([+-]?)([0-9]+)[ \t\r\n]*$/.exec(s);
    if (!m) pd.die(l, `הטקסט "${s.slice(0, 200)}" אינו מספר שלם`);
    return pd.ci(BigInt(m[1] + m[2]), l);
};
pd.stof = (s, l) => {
    const m = /^[ \t\n\v\f\r]*([+-]?([0-9]+\.?[0-9]*|\.[0-9]+)([eE][+-]?[0-9]+)?)[ \t\r\n]*$/.exec(s);
    const v = m ? Number(m[1]) : NaN;
    if (!m || !Number.isFinite(v)) pd.die(l, `הטקסט "${s.slice(0, 200)}" אינו מספר`);
    return v;
};
pd.ftoi = (v, l) => { if (!(v > -9223372036854775808.0 && v < 9223372036854775808.0)) pd.die(l, OVF); return BigInt(Math.trunc(v)); };
/* עגל כמו Python: חצי הולך לזוגי, ובדיוק מלא (לפי הערך המדויק של השבר) */
pd.round0 = (x, l) => {
    const f = Math.floor(x), d = x - f;
    let r = d > 0.5 ? f + 1 : d < 0.5 ? f : (f % 2 === 0 ? f : f + 1);
    return pd.ftoi(r, l);
};
pd.roundn = (x, n, l) => {
    if (n < 0n) pd.die(l, '"עגל" עם מספר ספרות שלילי עוד לא נתמך');
    if (n > 330n) return x;
    /* x = m * 2^e בדיוק */
    const buf = new DataView(new ArrayBuffer(8)); buf.setFloat64(0, x);
    const hi = buf.getUint32(0), lo = buf.getUint32(4);
    const sign = hi >>> 31 ? -1n : 1n, ex = (hi >>> 20) & 0x7ff;
    let mant = (BigInt(hi & 0xfffff) << 32n) | BigInt(lo), e;
    if (ex === 0) e = -1074; else { mant |= 1n << 52n; e = ex - 1075; }
    const N = Number(n), p10 = 10n ** BigInt(N);
    let q;
    if (e >= 0) q = mant * (2n ** BigInt(e)) * p10;
    else {
        const den = 2n ** BigInt(-e), num = mant * p10;
        q = num / den; const r = num % den, twice = 2n * r;
        if (twice > den || (twice === den && (q & 1n))) q += 1n;
    }
    const s = q.toString().padStart(N + 1, '0');
    const str = (sign < 0n ? '-' : '') + (N ? s.slice(0, s.length - N) + '.' + s.slice(s.length - N) : s);
    return pd.fc(Number(str), l);
};

/* ---------- הצגה (כמו str / repr של Python) ---------- */
const hex = (c, w) => c.toString(16).padStart(w, '0');
pd.reprText = (s) => {
    const q = (s.includes("'") && !s.includes('"')) ? '"' : "'";
    let o = q;
    for (const ch of s) {
        const c = ch.codePointAt(0);
        if (ch === '\\') o += '\\\\';
        else if (ch === q) o += '\\' + q;
        else if (ch === '\n') o += '\\n';
        else if (ch === '\t') o += '\\t';
        else if (ch === '\r') o += '\\r';
        else if (c < 0x20 || c === 0x7f) o += '\\x' + hex(c, 2);
        else if (c >= 0x80 && inRanges(PD_NOPRINT, c)) o += c < 0x100 ? '\\x' + hex(c, 2) : c < 0x10000 ? '\\u' + hex(c, 4) : '\\U' + hex(c, 8);
        else o += ch;
    }
    return o + q;
};
pd.repr = (v) => {
    if (v === null || v === undefined) return 'כלום';
    switch (typeof v) {
    case 'bigint': return v.toString();
    case 'number': return pd.ftos(v);
    case 'string': return pd.reprText(v);
    case 'boolean': return pd.btos(v);
    }
    if (Array.isArray(v)) return '[' + v.map(pd.repr).join(', ') + ']';
    if (v instanceof PdDict) { const p = []; for (const [k, x] of v.m) p.push(pd.repr(k) + ': ' + pd.repr(x)); return '{' + p.join(', ') + '}'; }
    if (v.__pd) return v.__pd.name + '(' + v.__pd.fields.map((f, i) => f + '=' + pd.repr(v[v.__pd.keys[i]])).join(', ') + ')';
    if (v instanceof PdEl) return '<רכיב בדף>';
    return String(v);
};
pd.str = (v) => typeof v === 'string' ? v : pd.repr(v);
pd.eq = (a, b) => {
    if (a === b) return true;
    if (a === null || b === null || typeof a !== 'object') return false;
    if (Array.isArray(a)) return a.length === b.length && a.every((x, i) => pd.eq(x, b[i]));
    if (a instanceof PdDict) {
        if (a.m.size !== b.m.size) return false;
        for (const [k, x] of a.m) { if (!b.m.has(k) || !pd.eq(x, b.m.get(k))) return false; }
        return true;
    }
    if (a.__pd) return a.__pd === b.__pd && a.__pd.keys.every(k => pd.eq(a[k], b[k]));
    return false;
};
pd.nn = (x, l) => { if (x === null || x === undefined) pd.die(l, 'הערך כאן הוא כלום — אין לו שדות, איברים או ערך לחשב איתו'); return x; };

/* ---------- רשימות ---------- */
pd.idx = (a, i, l) => {
    const n = BigInt(a.length), j = i < 0n ? i + n : i;
    if (j < 0n || j >= n) {
        if (n === 0n) pd.die(l, `אין איבר במקום ${i} — הרשימה ריקה`);
        if (n === 1n) pd.die(l, `אין איבר במקום ${i} (ברשימה יש איבר אחד, במקום 0)`);
        pd.die(l, `אין איבר במקום ${i} (ברשימה יש ${n} איברים: מקומות 0 עד ${n - 1n})`);
    }
    return Number(j);
};
pd.get = (a, i, l) => a[pd.idx(a, i, l)];
pd.set = (a, i, v, l) => { a[pd.idx(a, i, l)] = v; };
pd.pop = (a, l) => { if (a.length === 0) pd.die(l, 'אי אפשר להוציא איבר מרשימה ריקה'); return a.pop(); };
pd.size = (x) => Array.isArray(x) ? x.length : x.m.size;
pd.need = (a, what, l) => { if (a.length === 0) pd.die(l, `${what} של רשימה ריקה — אין בה אף איבר`); };
pd.inList = (a, x) => a.some(y => pd.eq(y, x));
pd.sumI = (a, l) => { let s = 0n; for (const x of a) s = pd.add(s, x, l); return s; };
pd.sumF = (a, l) => {            /* כמו Python 3.12+: צבירה מתוקנת */
    let r = 0, c = 0;
    for (const x of a) { const t = r + x; if (Math.abs(r) >= Math.abs(x)) c += (r - t) + x; else c += (x - t) + r; r = t; }
    if (c !== 0 && Number.isFinite(c)) r += c;
    return pd.fc(r, l);
};
const cmpCp = (a, b) => {       /* טקסט: לפי קוד האות (כמו Python), לא לפי UTF-16 */
    const x = pd.chars(a), y = pd.chars(b);
    for (let i = 0; i < x.length && i < y.length; i++) { const d = x[i].codePointAt(0) - y[i].codePointAt(0); if (d) return d; }
    return x.length - y.length;
};
pd.cmp = (a, b) => typeof a === 'string' ? cmpCp(a, b) : (a < b ? -1 : a > b ? 1 : 0);
pd.lt = (a, b) => pd.cmp(a, b) < 0;
pd.sorted = (a, keys, rev) => {
    const ix = a.map((_, i) => i), k = keys || a;
    ix.sort((i, j) => rev ? pd.cmp(k[j], k[i]) : pd.cmp(k[i], k[j]));    /* sort של JS יציב */
    return ix.map(i => a[i]);
};
pd.best = (a, keys, dir, what, l) => {
    pd.need(a, what, l);
    const k = keys || a; let b = 0;
    for (let i = 1; i < a.length; i++) if (dir * pd.cmp(k[i], k[b]) > 0) b = i;
    return a[b];
};

/* ---------- מילונים (בסדר ההכנסה) ---------- */
class PdDict { constructor() { this.m = new Map(); this.ver = 0; } }
pd.dict = (pairs) => { const d = new PdDict(); for (const [k, v] of pairs) pd.dset(d, k, v); return d; };
pd.dset = (d, k, v) => { if (!d.m.has(k)) d.ver++; d.m.set(k, v); };
const missing = (k, l) => pd.die(l, 'אין במילון את המפתח ' + pd.repr(k));
pd.dget = (d, k, l) => { if (!d.m.has(k)) missing(k, l); return d.m.get(k); };
pd.dgetor = (d, k, def) => d.m.has(k) ? d.m.get(k) : def;
pd.dpop = (d, k, l) => { if (!d.m.has(k)) missing(k, l); const v = d.m.get(k); d.m.delete(k); d.ver++; return v; };
pd.dhas = (d, k) => d.m.has(k);
pd.keys = (d) => [...d.m.keys()];
pd.values = (d) => [...d.m.values()];
pd.diter = function* (d, l) {
    const ver = d.ver;
    const ks = [...d.m.keys()];
    for (const k of ks) {
        if (d.ver !== ver) pd.die(l, 'המילון השתנה (נוסף או נמחק מפתח) בזמן שהלולאה עוברת עליו');
        if (d.m.has(k)) yield k;
    }
    if (d.ver !== ver) pd.die(l, 'המילון השתנה (נוסף או נמחק מפתח) בזמן שהלולאה עוברת עליו');
};

/* ---------- קלט, פלט, קבצים ---------- */
let pdOut = '';
pd.print = (parts) => {
    const line = parts.join(' ') + '\n';
    if (IS_NODE) process.stdout.write(line); else pd.ui.console(line);
};
pd.input = (prompt, l) => {
    if (IS_NODE) {
        process.stdout.write(prompt);
        const fs = require('fs'); const b = Buffer.alloc(1); const bytes = [];
        let any = false;
        for (;;) {
            let n; try { n = fs.readSync(0, b, 0, 1, null); } catch (e) { if (e.code === 'EAGAIN') continue; if (e.code === 'EOF') n = 0; else throw e; }
            if (n === 0) break;
            any = true;
            if (b[0] === 10) break;
            bytes.push(b[0]);
        }
        if (!any) pd.die(l, 'לא התקבל קלט (הקלט נגמר)');
        let s = null;
        try { s = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(bytes)); } catch (e) { }
        if (s === null || s.includes('\0')) pd.die(l, 'הקלט לא בקידוד UTF-8 (או שיש בו תו אפס)');
        return s;
    }
    const r = window.prompt(prompt);
    if (r === null) pd.die(l, 'לא התקבל קלט (הקלט נגמר)');
    return r;
};
const fileFail = (what, path, why, l) => pd.die(l, what + ' ' + pd.reprText(path) + ': ' + why);
const errHe = (e) => ({ ENOENT: 'הקובץ או התיקייה לא קיימים', EACCES: 'אין הרשאה', EPERM: 'אין הרשאה', EISDIR: 'זו תיקייה, לא קובץ',
                        ENOTDIR: 'חלק מהנתיב אינו תיקייה', ENOSPC: 'הדיסק מלא', EROFS: 'הדיסק לקריאה בלבד', ENAMETOOLONG: 'השם ארוך מדי' })[e.code] || e.message;
/* בדפדפן, "קובץ" נשמר בזיכרון של הדפדפן (localStorage) — נשאר גם אחרי סגירה */
const LS = 'פשוט:';
pd.readFile = (p, l) => {
    if (IS_NODE) {
        const fs = require('fs'); let b;
        try { b = fs.readFileSync(p); } catch (e) { fileFail('אי אפשר לקרוא את הקובץ', p, errHe(e), l); }
        if (b.includes(0)) fileFail('הקובץ', p, 'מכיל תו אפס — זה לא קובץ טקסט', l);
        const s = new TextDecoder('utf-8', { fatal: true });
        try { return s.decode(b); } catch (e) { fileFail('הקובץ', p, 'לא שמור בקידוד UTF-8', l); }
    }
    let v = null; try { v = localStorage.getItem(LS + p); } catch (e) { }
    if (v === null) fileFail('אי אפשר לקרוא את הקובץ', p, 'הקובץ או התיקייה לא קיימים', l);
    return v;
};
pd.writeFile = (p, t, append, l) => {
    if (IS_NODE) {
        const fs = require('fs');
        try { (append ? fs.appendFileSync : fs.writeFileSync)(p, t); } catch (e) { fileFail('אי אפשר לכתוב לקובץ', p, errHe(e), l); }
        return;
    }
    try { localStorage.setItem(LS + p, (append ? (localStorage.getItem(LS + p) || '') : '') + t); }
    catch (e) { fileFail('אי אפשר לכתוב לקובץ', p, 'הדפדפן לא מרשה לשמור', l); }
};
pd.exists = (p) => {
    if (IS_NODE) return require('fs').existsSync(p);
    try { return localStorage.getItem(LS + p) !== null; } catch (e) { return false; }
};
pd.args = () => IS_NODE ? process.argv.slice(2) : [...new URLSearchParams(location.search).values()];

/* ---------- הדף: רכיבים שאפשר לבנות בעברית ---------- */
class PdEl { constructor(node, kind) { this.node = node; this.kind = kind; } }
pd.ui = {
    root: null,
    area() { if (!this.root) this.root = document.getElementById('pd-app'); return this.root; },
    consoleEl: null,
    console(line) {                    /* הצג(...) בדף: שורות טקסט */
        if (IS_NODE) { process.stdout.write(line); return; }
        if (!this.consoleEl) { this.consoleEl = document.createElement('pre'); this.consoleEl.className = 'pd-out'; this.area().appendChild(this.consoleEl); }
        this.consoleEl.textContent += line;
    },
    add(tag, cls) {
        if (IS_NODE) return { textContent: '', value: '', children: [], appendChild(c) { this.children.push(c); }, remove() {}, addEventListener() {}, set innerHTML(v) { this.children = []; } };
        const n = document.createElement(tag); if (cls) n.className = cls;
        this.area().appendChild(n); this.consoleEl = null;
        return n;
    },
};
/* פעולה שנקראת מאירוע (לחיצה, Enter, שעון): שגיאה בה מוצגת בדף */
const guard = (f) => () => { try { f(); } catch (e) { pd.report(e); } };
pd.title = (t) => { const n = pd.ui.add('h1', 'pd-title'); n.textContent = t; return new PdEl(n, 'text'); };
pd.textEl = (t) => { const n = pd.ui.add('p', 'pd-text'); n.textContent = t; return new PdEl(n, 'text'); };
pd.input_el = (hint, onEnter) => {
    const n = pd.ui.add('input', 'pd-input');
    if (!IS_NODE) { n.placeholder = hint; n.type = 'text'; n.dir = 'auto'; }
    if (onEnter) n.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') guard(onEnter)(); });
    return new PdEl(n, 'input');
};
pd.button = (t, f) => {
    let n;
    if (IS_NODE) n = pd.ui.add('button', 'pd-button');
    else {                                     /* כפתורים שנוצרים ברצף — באותה שורה */
        let row = pd.ui.area().lastElementChild;
        if (!row || !row.classList.contains('pd-row')) { row = pd.ui.add('div', 'pd-row'); }
        n = document.createElement('button'); n.className = 'pd-button'; row.appendChild(n);
    } n.textContent = t; n.addEventListener('click', guard(f)); return new PdEl(n, 'button'); };
pd.listEl = () => new PdEl(pd.ui.add('ul', 'pd-list'), 'list');
/* לוח: שורות × עמודות של משבצות לכתיבה. כל 3 משבצות — קו עבה (כמו בסודוקו) כשהגודל מתחלק ב-3 */
pd.grid = (rows, cols, l, onChange) => {
    if (rows < 1n || cols < 1n || rows > 50n || cols > 50n) pd.die(l, '"לוח" צריך בין 1 ל-50 שורות ועמודות');
    const R = Number(rows), C = Number(cols), cells = [];
    const square = R === C && R % 3 === 0;
    let n;
    if (IS_NODE) n = pd.ui.add('div', 'pd-grid');
    else if (square) { n = pd.ui.add('div', 'pd-grid pd-grid-sq'); n.style.gridTemplateColumns = `repeat(${C}, 1fr)`; }
    else {                                      /* טבלה: משבצות מלבניות; בטלפון גוללים לצד בתוך הטבלה בלבד */
        const wrap = pd.ui.add('div', 'pd-scroll');
        n = document.createElement('div'); n.className = 'pd-grid pd-grid-wide'; wrap.appendChild(n);
        n.style.gridTemplateColumns = `minmax(34px, 0.45fr) repeat(${C - 1}, minmax(76px, 1fr))`;
    }
    for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
        let inp;
        if (IS_NODE) inp = { value: '', classList: { toggle() {} } };
        else {
            inp = document.createElement('input');
            inp.dir = 'auto'; inp.setAttribute('aria-label', `שורה ${r + 1}, עמודה ${c + 1}`);
            if (square) {                            /* לוח ריבועי (כמו סודוקו): קו עבה כל 3 משבצות, וספרות בלבד */
                inp.inputMode = 'numeric'; inp.maxLength = 3;
                if (c % 3 === 2 && c !== C - 1) inp.classList.add('pd-b-r');
                if (r % 3 === 2 && r !== R - 1) inp.classList.add('pd-b-b');
            }
            if (onChange) inp.addEventListener('change', guard(onChange));
            n.appendChild(inp);
        }
        cells.push(inp);
    }
    const e = new PdEl(n, 'grid'); e.R = R; e.C = C; e.cells = cells;
    return e;
};
pd.every = (secs, f, l) => {
    if (!(secs > 0)) pd.die(l, '"כל_כמה" צריך מספר שניות גדול מ-0');
    if (!IS_NODE) setInterval(guard(f), secs * 1000);
};
pd.el = {
    cell(e, r, c, l) {
        if (e.kind !== 'grid') pd.die(l, '"קבע" / "קרא" / "סמן" עובדים רק על לוח');
        if (r < 0n || c < 0n || r >= BigInt(e.R) || c >= BigInt(e.C)) pd.die(l, `אין משבצת בשורה ${r}, עמודה ${c} (בלוח יש ${e.R} שורות ו-${e.C} עמודות, מ-0)`);
        const inp = e.cells[Number(r) * e.C + Number(c)];
        return { set: (t) => { inp.value = t; }, get: () => inp.value.trim(), mark: (b) => inp.classList.toggle('pd-mark', b),
                 lock: () => {
                     if (!inp.setAttribute) return;
                     inp.setAttribute('readonly', ''); inp.tabIndex = -1;
                     if (r === 0n || c === 0n) inp.classList.add('pd-head');     /* שורה/עמודה ראשונה נעולה = כותרת */
                 } };
    },
    set(e, t) { if (e.kind === 'input') e.node.value = t; else e.node.textContent = t; },
    get(e) { return e.kind === 'input' ? e.node.value : e.node.textContent; },
    clear(e) {
        if (e.kind === 'input') e.node.value = '';
        else if (e.kind === 'list') e.node.innerHTML = '';
        else if (e.kind === 'grid') e.cells.forEach(c => { c.value = ''; c.classList.toggle('pd-mark', false); });
        else e.node.textContent = '';
    },
    add(e, t, l) {
        if (e.kind !== 'list') pd.die(l, '"הוסף" על רכיב בדף עובד רק על רשימת_שורות()');
        const li = IS_NODE ? { textContent: '' } : document.createElement('li'); li.textContent = t; e.node.appendChild(li);
    },
};

/* ---------- הרצה ---------- */
pd.report = (e) => {
    let msg;
    if (e instanceof PdError) msg = `שגיאה בשורה ${e.line}: ${e.msg}`;
    else if (e instanceof RangeError && /call stack/i.test(e.message)) msg = 'שגיאה: רקורסיה עמוקה מדי — פעולה קוראת לעצמה יותר מדי פעמים';
    else msg = 'שגיאה פנימית: ' + (e && e.message) + ' (זה באג במהדר, לא בקוד שלך)';
    if (IS_NODE) { process.stderr.write(msg + '\n'); process.exitCode = 1; return; }
    const n = document.createElement('div'); n.className = 'pd-error'; n.textContent = msg; pd.ui.area().appendChild(n);
};
pd.run = (main) => {
    try { main(); }
    catch (e) { pd.report(e); if (IS_NODE) process.exit(1); }
};

/* ---------- מספרים אקראיים ופעולות מתמטיות (אותו רצף כמו runtime.h) ---------- */
const M64 = (1n << 64n) - 1n;
let rngState = 0n, rngReady = false;
pd.seed = (s) => { rngState = BigInt.asUintN(64, s); rngReady = true; };
pd.rand = () => {
    if (!rngReady) { rngState = BigInt.asUintN(64, BigInt(Date.now()) * 1000003n); rngReady = true; }
    rngState = (rngState + 0x9E3779B97F4A7C15n) & M64;
    let z = rngState;
    z = ((z ^ (z >> 30n)) * 0xBF58476D1CE4E5B9n) & M64;
    z = ((z ^ (z >> 27n)) * 0x94D049BB133111EBn) & M64;
    z ^= z >> 31n;
    return Number(z >> 11n) / 9007199254740992;
};
pd.exp = (x, l) => pd.fc(Math.exp(x), l);
pd.log = (x, l) => { if (x <= 0) pd.die(l, '"לוג" עובד רק על מספר גדול מ-0'); return Math.log(x); };
pd.sqrt = (x, l) => { if (x < 0) pd.die(l, '"שורש" של מספר שלילי'); return Math.sqrt(x); };
pd.pow = (a, b, l) => {
    if (a === 0 && b < 0) pd.die(l, 'חלוקה באפס');
    if (a < 0 && b !== Math.floor(b)) pd.die(l, '"חזקה" של מספר שלילי בשבר — התוצאה לא מספר ממשי');
    return pd.fc(a ** b, l);
};
