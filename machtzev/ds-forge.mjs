#!/usr/bin/env node
/** 🔨 מנוע-חישול (forge) · ds-forge — פירוק-Pure (HTML של gallery + מדף) ⇒ אטומי-Dart אמיתיים.
 *  במקום לפרוט 553 אטומים ביד: קורא כל machtzev/pure/<family>-family.html, מפרסר את ה-<style>
 *  למפת-מחלקות (class→{prop:val}), חוצב כל תא-אטום (.cell), ומתרגם את ה-DOM ל-widget Flutter
 *  מחווט-חריץ: כל צבע דרך DsSeam.skinOf/of/fontsOf (חוק-5/6), אפס-הארד-קוד. תוכן Label/Value/Meta.
 *  פלט: new/dart-forge-bs/<family>/<snake>.dart (StatelessWidget) + barrel + מניפסט.
 *  דטרמיניסטי · regen ביט-זהה · אימות: מוזרק ל-buildsmart ⇒ flutter analyze (genesis-compile).
 *  שימוש: node machtzev/ds-forge.mjs [family…]   (בלי ארגומנט = כל המשפחות) */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const PURE = path.join(HERE, 'pure');
const OUT = path.join(ROOT, 'new/dart-forge-bs');

// ───────────────────────── טוקנים ⇒ ביטוי-Dart (חריץ) ─────────────────────────
// נייטרל+סמנטי ⇒ skin.<x> · אקצנט ⇒ theme.<x> · פונט ⇒ fonts.<x>
const SKIN = { canvas:'canvas', sunken:'sunken', surface:'surface', raised:'raised', raised2:'raised2',
  ink:'ink', mut:'mut', faint:'faint', hair:'hair', hair2:'hair2', ok:'ok', warn:'warn', err:'err', gold:'gold' };
const THEME = { 'a-hi':'aHi', 'a':'a', 'a-800':'a800', 'gl':'gl', 'c2':'c2', 'c3':'c3' };
const FONT = { serif:'serif', serifHe:'serifHe', grotesk:'grotesk', he:'he' };

const hx = n => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0').toUpperCase();
function litColor(v) {                       // #hex / rgba() ⇒ Color(0x…) קבוע (לא-טוקן, נדיר)
  v = v.trim();
  if (/^#([0-9a-f]{6})$/i.test(v)) return `const Color(0xFF${v.slice(1).toUpperCase()})`;
  if (/^#([0-9a-f]{3})$/i.test(v)) { const c = v.slice(1); return `const Color(0xFF${(c[0]+c[0]+c[1]+c[1]+c[2]+c[2]).toUpperCase()})`; }
  const m = v.match(/rgba?\(([^)]+)\)/);
  if (m) { const [r,g,b,a='1'] = m[1].split(',').map(s=>s.trim()); return `const Color(0x${hx(parseFloat(a)*255)}${hx(+r)}${hx(+g)}${hx(+b)})`; }
  return null;
}
// value ⇒ {expr, alpha?} · מזהה var(--token) (עם עטיפת color-mix/גרדיאנט ⇒ מפשט לטוקן-הבסיס)
function colorExpr(val) {
  if (!val) return null;
  // color-mix(in …, var(--a) N%, transparent) ⇒ theme/skin.withValues(alpha:N/100) — לפני var-פשוט (ה-var בפנים)
  const cm = val.match(/color-mix\([^,]+,\s*var\(--([a-z0-9-]+)\)\s*(\d+)%/i);
  if (cm) {
    const k = cm[1], a = (+cm[2] / 100).toFixed(2);
    const base = SKIN[k] ? `skin.${SKIN[k]}` : THEME[k] ? `theme.${THEME[k]}` : null;
    if (base) return `${base}.withValues(alpha: ${a})`;
  }
  const vm = val.match(/var\(--([a-z0-9-]+)\)/i);
  if (vm) {
    const k = vm[1];
    if (SKIN[k]) return `skin.${SKIN[k]}`;
    if (THEME[k]) return `theme.${THEME[k]}`;
  }
  const lit = litColor(val);
  if (lit) return lit;
  return null;                                // גרדיאנט/לא-מזוהה ⇒ null (הקורא מדלג)
}
// פיצול לפי פסיק ברמה-העליונה (מכבד סוגריים של rgba()/color-mix())
function splitTop(s) {
  const out = []; let d = 0, cur = '';
  for (const ch of s) {
    if (ch === '(') d++; else if (ch === ')') d--;
    if (ch === ',' && d === 0) { out.push(cur.trim()); cur = ''; } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
// linear-gradient(angle, stopA, stopB…) ⇒ LinearGradient(...) | null (אם צבע לא-מזוהה)
function gradientExpr(val) {
  const m = val && val.match(/linear-gradient\((.*)\)\s*$/i);
  if (!m) return null;
  const parts = splitTop(m[1]);
  let begin = 'Alignment.topCenter', end = 'Alignment.bottomCenter';
  if (/deg/.test(parts[0]) || /^to\s/.test(parts[0])) {
    const a = parts.shift();
    const deg = /(-?\d+)deg/.test(a) ? +RegExp.$1 : (/to right/.test(a) ? 90 : /to left/.test(a) ? 270 : 180);
    const map = { 0: ['bottomCenter', 'topCenter'], 90: ['centerLeft', 'centerRight'], 180: ['topCenter', 'bottomCenter'],
      270: ['centerRight', 'centerLeft'], 135: ['topLeft', 'bottomRight'], 45: ['bottomLeft', 'topRight'], 225: ['topRight', 'bottomLeft'] };
    const mm = map[(deg % 360 + 360) % 360] || ['topCenter', 'bottomCenter'];
    begin = `Alignment.${mm[0]}`; end = `Alignment.${mm[1]}`;
  }
  const cols = [];
  for (const p of parts) {
    const c = colorExpr(p.replace(/\s+\d+%\s*$/, ''));
    if (!c) return null;
    cols.push(c);
  }
  if (cols.length < 2) return null;
  return `LinearGradient(colors: [${cols.join(', ')}], begin: ${begin}, end: ${end})`;
}
// radial-gradient(SIZE at X% Y%, colorA, colorB N%) ⇒ RadialGradient(...) | null · transparent ⇒ צבע-הבסיס
function radialExpr(val, baseColor) {
  const m = val && val.match(/radial-gradient\((.*)\)/i);
  if (!m) return null;
  const inner = splitTop(m[1]);
  let center = 'Alignment.center', radius = '0.8';
  if (inner.length && /\bat\b|%/.test(inner[0]) && !colorExpr(inner[0].replace(/\s+[\d.]+%.*$/, '').trim())) {
    const seg = inner.shift();
    const at = seg.match(/at\s+([\d.]+)%\s+([\d.]+)%/);
    if (at) center = `Alignment(${(+at[1] / 50 - 1).toFixed(2)}, ${(+at[2] / 50 - 1).toFixed(2)})`;
    const sz = seg.match(/([\d.]+)%/); if (sz) radius = (+sz[1] / 100).toFixed(2);
  }
  const cols = [], stops = [];
  for (const seg of inner) {
    const sm = seg.trim().match(/^(.*?)(?:\s+([\d.]+)%)?$/);
    const cexpr = /transparent/.test(sm[1]) ? baseColor : colorExpr(sm[1].trim());
    if (!cexpr) return null;
    cols.push(cexpr);
    stops.push(sm[2] != null ? (+sm[2] / 100).toFixed(2) : (stops.length ? '1.0' : '0.0'));
  }
  if (cols.length < 2) return null;
  return `RadialGradient(center: ${center}, radius: ${radius}, colors: [${cols.join(', ')}], stops: [${stops.join(', ')}])`;
}
function fontExpr(val) {
  const m = val && val.match(/var\(--(serif|serifHe|grotesk|he)\)/);
  return m ? `fonts.${FONT[m[1]]}` : null;
}
const px = v => { const m = v && String(v).match(/(-?\d+(?:\.\d+)?)px/); return m ? m[1] : null; };
const pct = v => { const m = v && String(v).match(/^\s*(\d+(?:\.\d+)?)%\s*$/); return m ? (+m[1] / 100).toFixed(3) : null; };  // רוחב/גובה יחסי
const num = v => { const m = v && String(v).match(/-?(?:\d+\.?\d*|\.\d+)/); if (!m) return null; return m[0].replace(/^-\./, '-0.').replace(/^\./, '0.'); };

// ───────────────────────── פרסר-CSS (תת-קבוצה + מורכבים) ─────────────────────────
// single: .a ⇒ decl · compound: .a.b(.c) ⇒ {set,decl,order} (חל כשלאלמנט כל המחלקות).
// סלקטורים עם צאצא/[attr]/psuedo מדולגים. מחזיר {single, compound}.
function parseStyle(css) {
  const single = {}, compound = [], descend = [], tagcls = []; let order = 0;
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /([^{}]+)\{([^{}]*)\}/g; let m;
  // חלק-שרשרת ⇒ {cls:[...]} (מחלקות) | {tag:'svg'} (תג-בודד) | null
  const simple = tok => {
    if (/^(\.[a-z0-9-]+)+$/i.test(tok)) return { cls: tok.split('.').filter(Boolean) };
    if (/^[a-z][a-z0-9]*$/i.test(tok)) return { tag: tok.toLowerCase() };
    return null;
  };
  while ((m = re.exec(css))) {
    const sels = m[1].split(',').map(s => s.trim());
    const decl = {};
    for (const d of m[2].split(';')) { const i = d.indexOf(':'); if (i < 0) continue; decl[d.slice(0, i).trim().toLowerCase()] = d.slice(i + 1).trim(); }
    for (const sel of sels) {
      if (/^\.([a-z0-9-]+)$/i.test(sel)) { const c = sel.slice(1); single[c] = Object.assign(single[c] || {}, decl); continue; }
      if (/^(\.[a-z0-9-]+){2,}$/i.test(sel)) { compound.push({ set: sel.split('.').filter(Boolean), decl, order: order++ }); continue; }
      // תג-מוכשר-מחלקה: "svg.i" / "button.p" ⇒ תואם כשהתג+כל-המחלקות
      if (/^[a-z][a-z0-9]*(\.[a-z0-9-]+)+$/i.test(sel)) { const ps = sel.split('.'); tagcls.push({ tag: ps[0].toLowerCase(), set: ps.slice(1).filter(Boolean), decl, order: order++ }); continue; }
      // צאצא: ".a .b" / ".a svg" — מחלקות/תגים מופרדי-רווח (בלי > ~ [attr] :pseudo #id)
      if (/ /.test(sel) && !/[>~[\]:()#]/.test(sel)) {
        const parts = sel.split(/\s+/).filter(Boolean).map(simple);
        if (parts.length >= 2 && parts.every(Boolean)) descend.push({ chain: parts, decl, order: order++ });
      }
    }
  }
  return { single, compound, descend, tagcls };
}
function parseInline(style) {
  const d = {}; if (!style) return d;
  for (const p of style.split(';')) { const i = p.indexOf(':'); if (i < 0) continue; d[p.slice(0, i).trim().toLowerCase()] = p.slice(i + 1).trim(); }
  return d;
}
// האם שרשרת-האבות (חלקים) תואמת רצף-משנה בעצי-האבות (ancestors = מערך-מחלקות שורש→אב)
function chainMatches(chain, ancestors) {
  let i = 0;
  for (const part of chain) {
    const cls = part.cls || [];            // אבות נושאים מחלקות בלבד; חלק-תג-אב לא-תואם (נדיר ב-CSS זה)
    let found = false;
    while (i < ancestors.length) { if (cls.length && cls.every(c => ancestors[i].includes(c))) { found = true; i++; break; } i++; }
    if (!found) return false;
  }
  return true;
}
// מיזוג-cascade מקורב: בודדים → מורכבים → צאצא-תואם → inline (גובר).
function styleOf(node, map, ancestors = []) {
  const s = {}, classes = node.classes || [];
  for (const c of classes) if (map.single[c]) Object.assign(s, map.single[c]);
  for (const r of map.tagcls || []) if (node.tag === r.tag && r.set.every(c => classes.includes(c))) Object.assign(s, r.decl);
  for (const r of map.compound) if (r.set.every(c => classes.includes(c))) Object.assign(s, r.decl);
  for (const r of map.descend) {
    const target = r.chain[r.chain.length - 1];
    const hit = target.tag ? node.tag === target.tag : target.cls.every(c => classes.includes(c));
    if (hit && chainMatches(r.chain.slice(0, -1), ancestors)) Object.assign(s, r.decl);
  }
  Object.assign(s, parseInline(node.attrs && node.attrs.style));
  return s;
}

// ───────────────────────── פרסר-HTML סובלני ─────────────────────────
const VOID = new Set(['input', 'br', 'img', 'hr', 'meta', 'link', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'use', 'source']);
function parseDOM(html) {
  const root = { tag: '#root', classes: [], attrs: {}, children: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*?)(\/?)>|([^<]+)/g;
  let m;
  while ((m = re.exec(html))) {
    if (m[0].startsWith('<!--')) continue;
    if (m[5] != null) {                          // טקסט
      const t = m[5].replace(/\s+/g, ' ');
      if (t.trim()) stack[stack.length - 1].children.push({ text: decode(t) });
      continue;
    }
    const closing = m[1] === '/', tag = m[2].toLowerCase(), rawAttr = m[3] || '', selfClose = m[4] === '/';
    if (closing) { if (stack.length > 1 && stack[stack.length - 1].tag === tag) stack.pop(); continue; }
    const attrs = {}; let am;
    const are = /([\w-]+)(?:=("[^"]*"|'[^']*'|[^\s]+))?/g;
    while ((am = are.exec(rawAttr))) attrs[am[1].toLowerCase()] = am[2] ? am[2].replace(/^['"]|['"]$/g, '') : '';
    const node = { tag, classes: (attrs.class || '').split(/\s+/).filter(Boolean), attrs, children: [] };
    stack[stack.length - 1].children.push(node);
    if (!selfClose && !VOID.has(tag)) stack.push(node);
  }
  return root;
}
const decode = s => s.replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&nbsp;/g,' ').replace(/&middot;/g,'·').replace(/&times;/g,'×').replace(/&#(\d+);/g,(_,n)=>String.fromCodePoint(+n));
const dq = s => '"' + String(s).replace(/\\/g,'\\\\').replace(/"/g,'\\"').replace(/\$/g,'\\$') + '"';

// ───────────────────────── DOM ⇒ Flutter ─────────────────────────
function textOf(node) { return node.children.filter(c => c.text != null).map(c => c.text).join('').trim(); }
function elemChildren(node) { return node.children.filter(c => c.tag && c.tag !== 'br'); }

function decoration(st) {                       // {prop} ⇒ BoxDecoration(...) | null
  const parts = [];
  const bgRaw = st['background'] || st['background-color'];
  const grad = gradientExpr(bgRaw);
  if (grad) parts.push(`gradient: ${grad}`);     // גרדיאנט גובר על מילוי-אחיד
  else if (bgRaw) {                               // רקע רב-שכבתי: שכבת-בסיס-אחיד + זוהר-radial (עומק)
    let bg = null, radSeg = null;
    for (const seg of splitTop(bgRaw)) {          // בידוד שכבות (לא-חמדני — כל שכבה בנפרד)
      if (/radial-gradient/i.test(seg)) radSeg = seg;
      else if (!/gradient\(/i.test(seg) && !bg) { const c = colorExpr(seg.trim()); if (c) bg = c; }
    }
    const rad = radSeg ? radialExpr(radSeg, bg || 'skin.sunken') : null;
    if (rad) parts.push(`gradient: ${rad}`);       // RadialGradient עם צבע-הבסיס כעצירה-אחרונה (זוהר מתמזג)
    else if (bg) parts.push(`color: ${bg}`);
    else { const c = colorExpr(bgRaw); if (c) parts.push(`color: ${c}`); }
  }
  const br = st['border'];
  if (br) { const bc = colorExpr(br); if (bc) parts.push(`border: Border.all(color: ${bc}${/\b2px\b/.test(br) ? ', width: 2' : ''})`); }
  const rad = st['border-radius'];
  if (rad) { const r = /999/.test(rad) ? '999' : (px(rad) || num(rad)); if (r) parts.push(`borderRadius: BorderRadius.circular(${r})`); }
  const sh = shadowExpr(st['box-shadow']);
  if (sh) parts.push(`boxShadow: [${sh}]`);
  return parts.length ? `BoxDecoration(${parts.join(', ')})` : null;
}
// EdgeInsets מ-shorthand (padding/margin) + פר-צד (margin-top…). null אם אין.
function edge(st, prop) {
  const sh = st[prop];
  const per = { top: px(st[`${prop}-top`]), right: px(st[`${prop}-right`]), bottom: px(st[`${prop}-bottom`]), left: px(st[`${prop}-left`]) };
  const hasPer = Object.values(per).some(v => v != null);
  if (!sh && !hasPer) return null;
  let t = 0, r = 0, b = 0, l = 0;
  if (sh) {
    const ns = sh.trim().split(/\s+/).map(x => (px(x) != null ? px(x) : (num(x) || '0')));
    if (ns.length === 1) [t, r, b, l] = [ns[0], ns[0], ns[0], ns[0]];
    else if (ns.length === 2) [t, r, b, l] = [ns[0], ns[1], ns[0], ns[1]];
    else if (ns.length === 3) [t, r, b, l] = [ns[0], ns[1], ns[2], ns[1]];
    else [t, r, b, l] = [ns[0], ns[1], ns[2], ns[3]];
  }
  if (per.top != null) t = per.top; if (per.right != null) r = per.right; if (per.bottom != null) b = per.bottom; if (per.left != null) l = per.left;
  return `const EdgeInsets.fromLTRB(${l}, ${t}, ${r}, ${b})`;
}
// box-shadow ⇒ [BoxShadow(...)] (מדלג inset — Flutter לא תומך חיצוני-בלבד)
function shadowExpr(val) {
  if (!val || val === 'none') return null;
  const out = [];
  for (const s of splitTop(val)) {
    if (/^\s*inset/.test(s)) continue;
    const cm = s.match(/(rgba?\([^)]*\)|#[0-9a-f]{3,8}|var\(--[a-z0-9-]+\))/i);
    const col = cm ? (colorExpr(cm[1]) || litColor(cm[1])) : null;
    if (!col) continue;
    const nums = (s.replace(/(rgba?\([^)]*\)|#[0-9a-f]{3,8}|var\(--[a-z0-9-]+\))/ig, '').match(/-?\d+(?:\.\d+)?/g) || []).map(x => parseFloat(x));
    const [ox = 0, oy = 0, blur = 0, spread = 0] = nums;
    // blurRadius = blur של CSS (תרגום נאמן). הערה: flutter test (headless) לא מרנדר gaussian-blur —
    // הצל נראה שם צמוד, אך ב-web/device עם GPU הוא זוהר רך תואם-CSS. אין לכייל לפי תמונת-הבדיקה!
    out.push(`BoxShadow(color: ${col}, offset: const Offset(${ox}, ${oy}), blurRadius: ${blur}, spreadRadius: ${spread})`);
  }
  return out.length ? out.join(', ') : null;
}
const JUST = { 'center': 'center', 'flex-end': 'end', 'end': 'end', 'flex-start': 'start', 'start': 'start', 'space-between': 'spaceBetween', 'space-around': 'spaceAround', 'space-evenly': 'spaceEvenly' };
const ALIGN = { 'center': 'center', 'flex-start': 'start', 'start': 'start', 'flex-end': 'end', 'end': 'end', 'stretch': 'stretch', 'baseline': 'baseline' };
function textStyle(st) {
  const p = [];
  const c = colorExpr(st['color']); if (c) p.push(`color: ${c}`);
  const f = fontExpr(st['font-family']); if (f) p.push(`fontFamily: ${f}`);
  const fs = px(st['font-size']); if (fs) p.push(`fontSize: ${fs}`);
  const fw = st['font-weight']; if (fw && +fw >= 600) p.push(`fontWeight: FontWeight.w${fw >= 700 ? 700 : 600}`);
  const ls = st['letter-spacing'];
  if (ls && ls !== 'normal') {
    let v = px(ls);
    if (v == null) { const em = String(ls).match(/(-?\d*\.?\d+)em/); const fs2 = px(st['font-size']); if (em && fs2) v = (parseFloat(em[1]) * +fs2).toFixed(2); }  // em ⇒ פיקסלים לפי font-size
    if (v == null) v = num(ls);
    if (v != null && +v !== 0) p.push(`letterSpacing: ${v}`);
  }
  const lh = st['line-height']; if (lh && lh !== 'normal' && !/px|%/.test(lh)) { const v = num(lh); if (v) p.push(`height: ${v}`); }
  if (/tabular/.test(st['font-feature-settings'] || '') || /tabular/.test(st['font-variant-numeric'] || ''))
    p.push('fontFeatures: const [FontFeature.tabularFigures()]');
  return p;
}

// SVG ⇒ סצנת-ציור רב-אלמנטית: כל <rect>/<circle>/<line>/<path>/<polygon> = op עם צבע-משלו (fill/stroke).
// כל צבע נפתר דרך colorExpr (skin/theme); ברירת-מחדל = inherit. שומר per-shape fill (לא flatten).
function svgScene(node, map, anc, inherit) {
  const vb = (node.attrs.viewbox || '0 0 24 24').split(/\s+/).map(Number);
  const vbw = vb[2] || 24, vbh = vb[3] || 24;
  const ops = [];
  // מרשם-גרדיאנטים: גלובלי-למסמך (defs מוגדר פעם, מופנה מכל svg) + מקומי-לצומת. objectBoundingBox.
  const grads = { ...GLOBAL_GRADS };
  const collect = n => { for (const ch of n.children) { if (!ch.tag) continue; if (ch.tag === 'lineargradient' && ch.attrs.id) grads[ch.attrs.id] = gradStops(ch, inherit); collect(ch); } };
  collect(node);
  const gArgs = gd => gd ? `, g: [${gd.cols.join(', ')}], gs: [${gd.offs.join(', ')}], gv: [${gd.v.join(', ')}]` : '';
  const urlId = v => { const m = v && v.match(/url\(#([\w-]+)\)/); return m ? grads[m[1]] : null; };
  const allText = n => n.children.map(c => c.text != null ? c.text : (c.tag ? allText(c) : '')).join('');
  const walk = (n, panc) => {
    for (const ch of n.children) {
      if (!ch.tag) continue;
      const est = styleOf(ch, map, panc), a = ch.attrs;
      const fillRaw = a.fill || est['fill'];
      const strokeRaw = a.stroke || est['stroke'] || est['color'];
      const filled = !!(fillRaw && fillRaw !== 'none');
      const gd = filled ? urlId(fillRaw) : urlId(strokeRaw);          // גרדיאנט על מילוי/קו
      const col = filled ? (colorExpr(fillRaw) || inherit) : (colorExpr(strokeRaw) || inherit);
      const sw = num(a['stroke-width'] || est['stroke-width'] || '1.8') || '1.8';
      if (ch.tag === 'rect') ops.push(`_Op.rect(${+a.x || 0}, ${+a.y || 0}, ${+a.width || 0}, ${+a.height || 0}, ${a.rx ? +a.rx : 0}, ${col}, ${filled}, ${sw}${gArgs(gd)})`);
      else if (ch.tag === 'circle' && a['stroke-dasharray']) {          // dasharray+rotate(-90) ⇒ קשת
        const r = +a.r || 0, circ = 2 * Math.PI * r;
        const dash = a['stroke-dasharray'].trim().split(/[\s,]+/).map(Number);
        const drawn = Math.min(dash[0] || 0, circ), off = a['stroke-dashoffset'] != null ? +a['stroke-dashoffset'] : 0;
        const start = (-Math.PI / 2 + ((-off) / circ) * 2 * Math.PI).toFixed(4), sweep = ((drawn / circ) * 2 * Math.PI).toFixed(4);
        ops.push(`_Op.arc(${+a.cx || 0}, ${+a.cy || 0}, ${r}, ${start}, ${sweep}, ${col}, ${sw}${gArgs(gd)})`);
      }
      else if (ch.tag === 'circle') ops.push(`_Op.circle(${+a.cx || 0}, ${+a.cy || 0}, ${+a.r || 0}, ${col}, ${filled}, ${sw})`);
      else if (ch.tag === 'line') ops.push(`_Op.line(${+a.x1 || 0}, ${+a.y1 || 0}, ${+a.x2 || 0}, ${+a.y2 || 0}, ${col}, ${sw})`);
      else if (ch.tag === 'path' && a.d) ops.push(`_Op.path(${dq(a.d)}, ${col}, ${filled}, ${sw}${gArgs(gd)})`);
      else if (ch.tag === 'text') {
        const s = allText(ch).replace(/\s+/g, ' ').trim();
        if (s) { const anchr = { middle: 1, end: 2 }[a['text-anchor'] || est['text-anchor']] || 0; const size = px(est['font-size']) || 9; const tc = colorExpr(est['fill'] || est['color']) || inherit; const ff = fontExpr(est['font-family']) || 'fonts.grotesk'; ops.push(`_Op.text(${dq(decode(s))}, ${+a.x || 0}, ${+a.y || 0}, ${size}, ${tc}, ${anchr}, ${ff})`); }
      }
      else if ((ch.tag === 'polyline' || ch.tag === 'polygon') && a.points) {
        const pts = a.points.trim().split(/[\s,]+/); let d = 'M ' + pts[0] + ' ' + pts[1];
        for (let k = 2; k < pts.length; k += 2) d += ` L ${pts[k]} ${pts[k + 1]}`; if (ch.tag === 'polygon') d += ' Z';
        ops.push(`_Op.path(${dq(d)}, ${col}, ${ch.tag === 'polygon' && filled}, ${sw}${gArgs(gd)})`);
      }
      if (ch.tag !== 'text') walk(ch, panc.concat([ch.classes || []]));
    }
  };
  walk(node, anc.concat([node.classes || []]));
  return { ops, vbw, vbh };
}
// <linearGradient> ⇒ {cols:[Color…], offs:[0..1…], v:[x1,y1,x2,y2]} (שברי objectBoundingBox)
function gradStops(gnode, inherit) {
  const cols = [], offs = [];
  for (const s of gnode.children) {
    if (s.tag !== 'stop') continue;
    let col = colorExpr(s.attrs['stop-color']) || inherit;
    const so = s.attrs['stop-opacity'];
    if (so != null && +so < 1) col += `.withValues(alpha: ${(+so).toFixed(2)})`;
    cols.push(col);
    let o = s.attrs.offset != null ? parseFloat(s.attrs.offset) : 0; if (o > 1) o /= 100;
    offs.push(o.toFixed(2));
  }
  const g = gnode.attrs;
  const v = [(+g.x1 || 0).toFixed(2), (+g.y1 || 0).toFixed(2), (+g.x2 || 0).toFixed(2), (g.y2 != null ? +g.y2 : 1).toFixed(2)];
  return { cols, offs, v };
}
// טקסט-סטייל עם צבע-יורש (CSS color inheritance) — לעולם לא "בלתי-נראה"
function textStyleC(st, inherit) { const ts = textStyle(st); if (!ts.some(x => /^color:/.test(x))) ts.unshift(`color: ${inherit}`); if (!ts.some(x => /^fontFamily:/.test(x))) ts.push('fontFamily: fonts.he'); return ts; }
// אלמנט ⇒ ביטוי-widget. ancestors=מחלקות-אבות (צאצא) · inherit=צבע-טקסט-יורש.
function emit(node, map, ancestors = [], depth = 0, inherit = 'skin.ink') {
  if (depth > 16) return 'const SizedBox.shrink()';
  if (node.tag === 'svg') {
    const sc = svgScene(node, map, ancestors, inherit);
    if (!sc.ops.length) return `_icon(${inherit})`;
    const st0 = styleOf(node, map, ancestors);
    const wpx = px(st0['width']) || num(node.attrs.width);   // CSS או attr HTML (donut/gauge width="118")
    const hpx = px(st0['height']) || num(node.attrs.height);
    const body = `CustomPaint(painter: _SvgScene([${sc.ops.join(', ')}], ${sc.vbw}, ${sc.vbh}))`;
    if (wpx) return `SizedBox(width: ${wpx}, height: ${hpx || (wpx / (sc.vbw / sc.vbh)).toFixed(2)}, child: ${body})`;  // אייקון/טבעת גודל-קבוע
    if (hpx) return `SizedBox(height: ${hpx}, child: ${body})`;                          // גובה-קבוע, רוחב מהאב (ספארק)
    return `AspectRatio(aspectRatio: ${(sc.vbw / sc.vbh).toFixed(4)}, child: ${body})`;  // width:100% ⇒ מילוי-רוחב לפי יחס-viewBox
  }
  if (node.tag === 'input') {
    const ph = node.attrs.placeholder || node.attrs.value || 'Label';
    const filled = !!node.attrs.value;
    const ist = styleOf(node, map, ancestors);
    const t = `Text(${dq(ph)}, style: TextStyle(color: ${filled ? 'skin.ink' : 'skin.faint'}, fontFamily: fonts.he, fontSize: 13))`;
    return wrapBox(Object.assign({ 'min-height': '44px' }, ist), t, node);
  }
  const st = styleOf(node, map, ancestors);
  const myColor = colorExpr(st['color']) || inherit;            // צבע-הטקסט האפקטיבי (עובר לילדים)
  const kids = elemChildren(node);
  const txt = textOf(node);
  const ta = st['text-align'];
  const taExpr = ta === 'center' ? ', textAlign: TextAlign.center' : ta === 'left' ? ', textAlign: TextAlign.left' : ta === 'right' ? ', textAlign: TextAlign.right' : '';

  // עלה עם טקסט בלבד ⇒ Text (צבע-יורש · text-transform)
  if (!kids.length && txt) {
    const tt = st['text-transform'];
    const shown = tt === 'uppercase' ? txt.toUpperCase() : tt === 'lowercase' ? txt.toLowerCase() : tt === 'capitalize' ? txt.replace(/\b\w/g, c => c.toUpperCase()) : txt;
    return wrapBox(st, `Text(${dq(shown)}${taExpr}, style: TextStyle(${textStyleC(st, inherit).join(', ')}))`, node);
  }
  // בונה ילדים (מפריד אבסולוטיים ל-Stack) · מעביר צבע-יורש
  const childAnc = ancestors.concat([node.classes || []]);
  const pFlexRow = /flex/.test(st['display'] || '') && !/column/.test(st['flex-direction'] || '');
  const flow = [], abs = [];
  for (const c of node.children) {
    // טקסט-חופשי בתוך אלמנט יורש את סגנון-ההורה (גודל/משקל/צבע/פונט) — CSS inheritance
    if (c.text != null) { const t = c.text.trim(); if (t) flow.push(`Text(${dq(t)}, style: TextStyle(${textStyleC(st, myColor).join(', ')}))`); continue; }
    if (c.tag === 'br') continue;
    const cst = styleOf(c, map, childAnc);
    let e = emit(c, map, childAnc, depth + 1, myColor);
    if (cst['position'] === 'absolute') { abs.push({ e, st: cst }); continue; }
    // flex-grow חיובי בשורה ⇒ Expanded (מוסר אי-חסימת-רוחב לצאצא כמו svg-ספארק)
    if (pFlexRow) { const fx = (cst['flex'] || '').trim(); if (fx && fx !== 'none' && fx !== '0' && !/^0\b/.test(fx)) e = `Expanded(child: ${e})`; }
    flow.push(e);
  }
  let inner;
  const disp = st['display'] || '', fd = st['flex-direction'] || '';
  const gap = px(st['gap']);
  const listSep = gap ? `, spacing: ${gap}` : '';
  const isFlex = /flex/.test(disp), col = /column/.test(fd);
  const maj = JUST[st['justify-content']], min = ALIGN[st['align-items']];
  const majE = maj ? `, mainAxisAlignment: MainAxisAlignment.${maj}` : '';
  const rowCross = min || 'center', colCross = min || 'start';
  const tb = c => c === 'baseline' ? ', textBaseline: TextBaseline.alphabetic' : '';
  // display:flex (בלוק) = רוחב-מלא ⇒ MainAxisSize.max · inline-flex = כיווץ-לתוכן ⇒ min · space-* דורש max
  const isInlineFlex = /inline-flex/.test(disp);
  const rowSize = ((isFlex && !isInlineFlex) || /^space-/.test(st['justify-content'] || '')) ? 'MainAxisSize.max' : 'MainAxisSize.min';
  if (flow.length === 0) inner = null;
  else if (flow.length === 1 && !isFlex) inner = flow[0];
  else if (isFlex && !col) inner = `Row(mainAxisSize: ${rowSize}${majE}, crossAxisAlignment: CrossAxisAlignment.${rowCross}${tb(rowCross)}${listSep}, children: [${flow.join(', ')}])`;
  else inner = `Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.${colCross}${tb(colCross)}${majE}${listSep}, children: [${flow.join(', ')}])`;
  // אבסולוטיים ⇒ Stack + Positioned · ה-padding עוטף רק את הזרימה (CSS: absolute יחסי ל-padding-box)
  let noPad = false;
  if (abs.length) {
    const pos = abs.map(a => {
      const p = [];
      const t = px(a.st['top']), b = px(a.st['bottom']), l = px(a.st['left'] || a.st['inset-inline-start']), r = px(a.st['right'] || a.st['inset-inline-end']);
      if (t != null) p.push(`top: ${t}`); if (b != null) p.push(`bottom: ${b}`); if (l != null) p.push(`left: ${l}`); if (r != null) p.push(`right: ${r}`);
      return p.length ? `Positioned(${p.join(', ')}, child: ${a.e})` : `Positioned.fill(child: ${a.e})`;
    });
    const pad = edge(st, 'padding');
    const flowW = pad && inner ? `Padding(padding: ${pad}, child: ${inner})` : inner;
    inner = `Stack(clipBehavior: Clip.none, children: [${(flowW ? [flowW] : []).concat(pos).join(', ')}])`;
    noPad = true;                                       // ה-padding כבר בתוך ה-Stack
  }
  return wrapBox(st, inner, node, noPad);
}

// עוטף ביטוי ב-Container (רקע/מסגרת/צל/מידות/שוליים) + Opacity, לפי הסגנון
function wrapBox(st, inner, node, noPad) {
  const deco = decoration(st), pad = noPad ? null : edge(st, 'padding'), mg = edge(st, 'margin');
  const w = px(st['width']), h = px(st['height']), minH = px(st['min-height']), minW = px(st['min-width']);
  const cp = [];
  if (w) cp.push(`width: ${w}`);
  if (h) cp.push(`height: ${h}`);
  // תיבה בגודל-קבוע מהדקת את הילד (constraints הדוקים) ⇒ מותחת אותו. אם ה-CSS ממרכז (grid/place-items/align+justify)
  // ⇒ alignment:center מעביר constraints רופפים ⇒ הילד שומר גודלו וממורכז (אריח-אייקון, נקודה, אווטאר).
  const pl = `${st['place-items'] || ''} ${st['place-content'] || ''} ${st['justify-items'] || ''}`;
  const bothCenter = ALIGN[st['align-items']] === 'center' && JUST[st['justify-content']] === 'center';
  // <button> ממרכז את הטקסט שלו כברירת-מחדל (text-align:center + מרכוז-אנכי) — כמו grid/place-items:center
  const centered = /center/.test(pl) || bothCenter || (node && node.tag === 'button');
  // מרכוז: שני-ממדים-קבועים ⇒ alignment בטוח. ממד-בודד ⇒ Center עם factor על הציר-החופשי (מכווץ-לתוכן,
  // אחרת alignment מרחיב למלוא-הרוחב בהקשר-חסום כמו טור — כפתור שהתנפח למלוא-השורה).
  if (centered && inner) {
    if (w && h) cp.push('alignment: Alignment.center');
    else if (h) inner = `Center(widthFactor: 1.0, child: ${inner})`;
    else if (w) inner = `Center(heightFactor: 1.0, child: ${inner})`;
    else cp.push('alignment: Alignment.center');
  } else if ((w || h) && centered) cp.push('alignment: Alignment.center');
  if (minH != null || minW != null) cp.push(`constraints: const BoxConstraints(${[minH != null ? `minHeight: ${minH}` : '', minW != null ? `minWidth: ${minW}` : ''].filter(Boolean).join(', ')})`);
  if (mg) cp.push(`margin: ${mg}`);
  if (pad) cp.push(`padding: ${pad}`);
  if (deco) cp.push(`decoration: ${deco}`);
  let out;
  if (!cp.length) out = inner || 'const SizedBox.shrink()';
  else { if (inner) cp.push(`child: ${inner}`); out = `Container(${cp.join(', ')})`; }
  // backdrop-filter: blur ⇒ ClipRRect + BackdropFilter (זכוכית אמיתית)
  const bf = st['backdrop-filter'] || st['-webkit-backdrop-filter'];
  if (bf && /blur/.test(bf) && cp.length) { const rad = /999/.test(st['border-radius'] || '') ? '999' : (px(st['border-radius']) || '0'); const bl = px(bf) || '12'; out = `ClipRRect(borderRadius: BorderRadius.circular(${rad}), child: BackdropFilter(filter: ImageFilter.blur(sigmaX: ${bl}, sigmaY: ${bl}), child: ${out}))`; }
  const op = st['opacity'] != null ? parseFloat(st['opacity']) : null;
  if (op != null && !isNaN(op) && op < 1) out = `Opacity(opacity: ${op}, child: ${out})`;
  // רוחב/גובה יחסי חלקי (%<100) ⇒ FractionallySizedBox · יישור-התחלה RTL = ימין (סקלטון/מילוי-בר).
  // 100% מדלגים — הוא ממילא ממלא (עטיפה תשבש מרכוז grid/place-items).
  const wp = pct(st['width']), hp = pct(st['height']);
  const wpct = wp && +wp < 1 ? wp : null, hpct = hp && +hp < 1 ? hp : null;
  if (wpct || hpct) out = `FractionallySizedBox(${wpct ? `widthFactor: ${wpct}, ` : ''}${hpct ? `heightFactor: ${hpct}, ` : ''}alignment: Alignment.centerRight, child: ${out})`;
  // direction:ltr/rtl מפורש ⇒ Directionality (הופך סדר-Row: חץ+אחוז, ספרות — מבטל RTL-אב)
  const dir = st['direction'];
  if (dir === 'ltr' || dir === 'rtl') out = `Directionality(textDirection: TextDirection.${dir}, child: ${out})`;
  return out;
}

// ───────────────────────── חציבת-תאים ⇒ אטומים ─────────────────────────
const snake = s => s.replace(/[^A-Za-z0-9]+/g, '_').replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/^_+|_+$/g, '').toLowerCase();
const pascal = s => s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join('');

// חוצב בלוקי <div class="…cls…"> מאוזנים, ללא-חפיפה (מדלג על הפנימיים)
function divBlocks(html, cls) {
  const out = [], re = new RegExp(`<div class="([^"]*\\b${cls}\\b[^"]*)"[^>]*>`, 'g'); let m;
  while ((m = re.exec(html))) {
    const start = m.index; let i = re.lastIndex, depth = 1;
    const tre = /<(\/?)div\b[^>]*>/g; tre.lastIndex = i; let t;
    while (depth > 0 && (t = tre.exec(html))) { depth += t[1] ? -1 : 1; i = tre.lastIndex; }
    out.push(html.slice(start, i)); re.lastIndex = i;
  }
  return out;
}
// theater ⇒ [{label, html}] · כל .st = מצב (label מ-.slb, גוף = השאר)
function theaterStates(body) {
  const th = divBlocks(body, 'theater')[0]; if (!th) return null;
  const sts = divBlocks(th, 'st'); if (sts.length < 2) return null;
  return sts.map(st => {
    const lb = st.match(/<span class="slb">([^<]+)<\/span>/);
    const label = lb ? decode(lb[1]).trim() : 'state';
    const inner = st.replace(/<div class="([^"]*\bst\b[^"]*)"[^>]*>/, '').replace(/<span class="slb">[^<]*<\/span>/, '').replace(/<\/div>\s*$/, '');
    return { label, html: inner };
  });
}
const enumId = (s, i) => { let id = s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).map((w, k) => k ? w[0].toUpperCase() + w.slice(1) : w.toLowerCase()).join(''); if (!id || /^\d/.test(id)) id = 's' + i + (id || ''); return id; };

// חוצב בלוקי .cell ומחזיר {name, seam, bodyHtml}
function cells(html) {
  const out = [];
  // איתור כל <div class="...cell..."> ברמת-האיזון, עד ה-</div> התואם
  const re = /<div class="([^"]*\bcell\b[^"]*)"[^>]*>/g; let m;
  while ((m = re.exec(html))) {
    const start = m.index; let i = re.lastIndex, depth = 1;
    const tre = /<(\/?)div\b[^>]*>/g; tre.lastIndex = i;
    let t;
    while (depth > 0 && (t = tre.exec(html))) { depth += t[1] ? -1 : 1; i = tre.lastIndex; }
    const block = html.slice(start, i);
    const nm = block.match(/<span class="nm">([^<]+)<\/span>/);
    if (!nm) continue;
    const name = decode(nm[1]).split('·')[0].trim();
    const seamM = block.match(/<span class="seam[^"]*">([^<]+)<\/span>/);
    const seam = seamM ? decode(seamM[1]).toLowerCase().split(/\s/)[0] : 'fields';
    // גוף = תוכן-התא ללא ה-<div class="foot">…
    let body = block.replace(/<div class="([^"]*\bcell\b[^"]*)"[^>]*>/, '');
    body = body.replace(/<div class="foot">[\s\S]*$/, '');    // חתוך מ-foot ועד הסוף
    out.push({ name, seam, body });
  }
  return out;
}

// ───────────────────────── פליטת-קובץ-אטום ─────────────────────────
const HEADER = (fam, seamUse, uiUse) => `// 🔨 אטום-Dart מחושל (forge) · משפחת-Pure "${fam}" · מחולל ע"י machtzev/ds-forge.mjs ממקור-האמת
// machtzev/pure/${fam}-family.html (אל תערוך ידנית — regen). לובש עיצוב מהחריץ בלבד (DsSeam.skinOf/of/fontsOf,
// חוק-5/6): אפס צבע-קבוע. תוכן Label/Value/Meta.
${uiUse ? "import 'dart:ui' show ImageFilter;\n" : ''}import 'package:flutter/material.dart';
${seamUse ? "import '../../dart-ui-bs/ds/ds_seam.dart';\n" : ''}`;
const ICON = `
// אייקון-פלייסהולדר ניטרלי (svg ללא path)
Widget _icon(Color c) => Icon(Icons.circle_outlined, size: 15, color: c);
`;
// צייר-SVG רב-אלמנטי · כל אלמנט = _Op עם צבע-משלו; פרסר path-data ל-runtime; מוקטן ל-viewBox
const SVGHELPER = `
// ignore_for_file: unused_element
class _Op {
  final int k;            // 0 rect · 1 circle · 2 line · 3 path · 4 text · 5 arc
  final List<double> a; final Color c; final bool f; final double sw; final String d;
  final List<Color>? g; final List<double>? gs; final List<double>? gv;  // גרדיאנט: צבעים · עצירות · וקטור-שבר
  final int anchor;       // עוגן-טקסט: 0 start · 1 middle · 2 end
  _Op(this.k, this.a, this.c, this.f, this.sw, this.d, {this.g, this.gs, this.gv, this.anchor = 0, this.font = ''});
  static _Op rect(double x, double y, double w, double h, double r, Color c, bool f, double sw, {List<Color>? g, List<double>? gs, List<double>? gv}) => _Op(0, [x, y, w, h, r], c, f, sw, '', g: g, gs: gs, gv: gv);
  static _Op circle(double x, double y, double r, Color c, bool f, double sw) => _Op(1, [x, y, r], c, f, sw, '');
  static _Op line(double x1, double y1, double x2, double y2, Color c, double sw) => _Op(2, [x1, y1, x2, y2], c, false, sw, '');
  static _Op path(String d, Color c, bool f, double sw, {List<Color>? g, List<double>? gs, List<double>? gv}) => _Op(3, const [], c, f, sw, d, g: g, gs: gs, gv: gv);
  final String font;
  static _Op text(String s, double x, double y, double size, Color c, int anchor, String font) => _Op(4, [x, y, size], c, true, 0, s, anchor: anchor, font: font);
  static _Op arc(double cx, double cy, double r, double start, double sweep, Color c, double sw, {List<Color>? g, List<double>? gs, List<double>? gv}) => _Op(5, [cx, cy, r, start, sweep], c, false, sw, '', g: g, gs: gs, gv: gv);
}
class _SvgScene extends CustomPainter {
  final List<_Op> ops; final double vbw, vbh;
  const _SvgScene(this.ops, this.vbw, this.vbh);
  Alignment _al(double fx, double fy) => Alignment(fx * 2 - 1, fy * 2 - 1);
  Path? _safe(String d) { try { return _parse(d); } catch (_) { return null; } }
  void _paintText(Canvas cv, _Op o) {
    final tp = TextPainter(text: TextSpan(text: o.d, style: TextStyle(color: o.c, fontSize: o.a[2], fontFamily: o.font.isEmpty ? null : o.font, fontWeight: FontWeight.w600, fontFeatures: const [FontFeature.tabularFigures()])), textDirection: TextDirection.ltr)..layout();
    double dx = o.a[0]; if (o.anchor == 1) dx -= tp.width / 2; else if (o.anchor == 2) dx -= tp.width;
    tp.paint(cv, Offset(dx, o.a[1] - tp.height * 0.82));
  }
  @override
  void paint(Canvas cv, Size s) {
    if (vbw <= 0 || vbh <= 0) return;
    cv.save(); cv.scale(s.width / vbw, s.height / vbh);
    for (final o in ops) {
      if (o.k == 4) { _paintText(cv, o); continue; }
      final p = Paint()..style = o.f ? PaintingStyle.fill : PaintingStyle.stroke..strokeWidth = o.sw..strokeCap = StrokeCap.round..strokeJoin = StrokeJoin.round;
      Rect b = Rect.zero; Path? pa;
      switch (o.k) {
        case 0: b = Rect.fromLTWH(o.a[0], o.a[1], o.a[2], o.a[3]); break;
        case 5: b = Rect.fromCircle(center: Offset(o.a[0], o.a[1]), radius: o.a[2]); break;
        case 3: pa = _safe(o.d); if (pa != null) b = pa.getBounds(); break;
      }
      if (o.g != null && o.g!.isNotEmpty) { final v = o.gv ?? const [0, 0, 0, 1]; p.shader = LinearGradient(begin: _al(v[0], v[1]), end: _al(v[2], v[3]), colors: o.g!, stops: o.gs).createShader(b.isEmpty ? const Rect.fromLTWH(0, 0, 1, 1) : b); }
      else { p.color = o.c; }
      switch (o.k) {
        case 0: cv.drawRRect(RRect.fromRectAndRadius(b, Radius.circular(o.a[4])), p); break;
        case 1: cv.drawCircle(Offset(o.a[0], o.a[1]), o.a[2], p); break;
        case 2: cv.drawLine(Offset(o.a[0], o.a[1]), Offset(o.a[2], o.a[3]), p); break;
        case 3: if (pa != null) cv.drawPath(pa, p); break;
        case 5: cv.drawArc(Rect.fromCircle(center: Offset(o.a[0], o.a[1]), radius: o.a[2]), o.a[3], o.a[4], false, p); break;
      }
    }
    cv.restore();
  }
  @override
  bool shouldRepaint(_SvgScene o) => true;
}
Path _parse(String d) {
  final path = Path();
  final t = RegExp(r'[a-zA-Z]|-?\\d*\\.?\\d+(?:e-?\\d+)?').allMatches(d).map((x) => x.group(0)!).toList();
  double cx = 0, cy = 0, sx = 0, sy = 0; String cmd = ''; int i = 0;
  double n() => double.parse(t[i++]);
  while (i < t.length) {
    if (RegExp(r'[a-zA-Z]').hasMatch(t[i])) { cmd = t[i]; i++; }
    if (i > t.length) break;
    final rel = cmd == cmd.toLowerCase(); final C = cmd.toUpperCase();
    switch (C) {
      case 'M': { double x = n(), y = n(); if (rel) { x += cx; y += cy; } path.moveTo(x, y); cx = x; cy = y; sx = x; sy = y; cmd = rel ? 'l' : 'L'; break; }
      case 'L': { double x = n(), y = n(); if (rel) { x += cx; y += cy; } path.lineTo(x, y); cx = x; cy = y; break; }
      case 'H': { double x = n(); if (rel) x += cx; path.lineTo(x, cy); cx = x; break; }
      case 'V': { double y = n(); if (rel) y += cy; path.lineTo(cx, y); cy = y; break; }
      case 'C': { double x1 = n(), y1 = n(), x2 = n(), y2 = n(), x = n(), y = n(); if (rel) { x1 += cx; y1 += cy; x2 += cx; y2 += cy; x += cx; y += cy; } path.cubicTo(x1, y1, x2, y2, x, y); cx = x; cy = y; break; }
      case 'Q': { double x1 = n(), y1 = n(), x = n(), y = n(); if (rel) { x1 += cx; y1 += cy; x += cx; y += cy; } path.quadraticBezierTo(x1, y1, x, y); cx = x; cy = y; break; }
      case 'A': { double rx = n(), ry = n(), rot = n(), laf = n(), sf = n(), x = n(), y = n(); if (rel) { x += cx; y += cy; } path.arcToPoint(Offset(x, y), radius: Radius.elliptical(rx, ry), rotation: rot, largeArc: laf != 0, clockwise: sf != 0); cx = x; cy = y; break; }
      case 'Z': path.close(); cx = sx; cy = sy; break;
      default: if (i < t.length) i++;
    }
  }
  return path;
}
`;

let GLOBAL_GRADS = {};   // מרשם-גרדיאנטים למסמך-שלם (defs מוגדר פעם, מופנה מכל התאים)
function collectGlobalGrads(html) {
  GLOBAL_GRADS = {};
  try { const dom = parseDOM(html); const go = n => { for (const ch of n.children || []) { if (ch.tag === 'lineargradient' && ch.attrs.id) GLOBAL_GRADS[ch.attrs.id] = gradStops(ch, 'skin.ink'); go(ch); } }; go(dom); } catch { /* עמיד */ }
}
function forgeFamily(fam) {
  const html = fs.readFileSync(path.join(PURE, `${fam}-family.html`), 'utf8');
  const styleM = html.match(/<style>([\s\S]*?)<\/style>/);
  const map = parseStyle(styleM ? styleM[1] : '');
  collectGlobalGrads(html);
  const list = cells(html);
  const dir = path.join(OUT, fam);
  fs.mkdirSync(dir, { recursive: true });
  const seen = new Set(), made = [];
  for (const c of list) {
    const cls = 'Forge' + pascal(c.name);
    if (seen.has(cls)) continue; seen.add(cls);
    const file = snake(c.name) + '.dart';
    // מצבים (theater) ⇒ enum + switch; אחרת ⇒ אטום-יחיד
    const states = theaterStates(c.body);
    let bodyExpr, enumBlock = '', stateField = '', ctorState = '';
    if (states) {
      const ids = []; const seenId = new Set();
      const arms = states.map((s, i) => {
        let id = enumId(s.label, i); while (seenId.has(id)) id += i; seenId.add(id); ids.push(id);
        let e; try { e = emit(parseDOM(s.html), map); } catch { e = 'const SizedBox.shrink()'; }
        return { id, e };
      });
      enumBlock = `enum ${cls}State { ${ids.join(', ')} }\n\n`;
      stateField = `  final ${cls}State state;\n`;
      ctorState = `this.state = ${cls}State.${ids[0]}`;
      bodyExpr = `switch (state) {\n${arms.map(a => `      ${cls}State.${a.id} => ${a.e},`).join('\n')}\n    }`;
    } else {
      const dom = parseDOM(c.body);
      try { bodyExpr = emit(dom, map); } catch { bodyExpr = 'const SizedBox.shrink()'; }
    }
    // הכרז רק על מה שבשימוש (למניעת unused_local_variable / unused_element)
    const useSkin = /\bskin\./.test(bodyExpr), useTheme = /\btheme\./.test(bodyExpr);
    const useFonts = /\bfonts\./.test(bodyExpr), useIcon = /_icon\(/.test(bodyExpr);
    const useSvg = /_SvgScene\(/.test(bodyExpr);
    const useUi = /ImageFilter\./.test(bodyExpr);
    const decls = [
      useSkin && '    final skin = DsSeam.skinOf(context);   // מלוא-העיצוב מהחריץ',
      useTheme && '    final theme = DsSeam.of(context);       // אקצנט (מורף)',
      useFonts && '    final fonts = DsSeam.fontsOf(context);  // פונט',
    ].filter(Boolean).join('\n');
    const src = HEADER(fam, useSkin || useTheme || useFonts || useIcon || useSvg, useUi) + (useIcon ? ICON : '') + (useSvg ? SVGHELPER : '') + `
/// ${c.name} — seam:${c.seam}${states ? ' · מצבים חיים' : ''}
${enumBlock}class ${cls} extends StatelessWidget {
${stateField}  const ${cls}({super.key${ctorState ? ', ' + ctorState : ''}});
  @override
  Widget build(BuildContext context) {
${decls}${decls ? '\n' : ''}    return ${bodyExpr};
  }
}
`;
    fs.writeFileSync(path.join(dir, file), src);
    made.push({ cls, file });
  }
  // barrel
  fs.writeFileSync(path.join(dir, `${fam}.dart`), made.map(a => `export '${a.file}';`).join('\n') + '\n');
  return made.length;
}

// ───────────────────────── main ─────────────────────────
const all = fs.readdirSync(PURE).filter(f => /-family\.html$/.test(f)).map(f => f.replace('-family.html', '')).sort();
const wanted = process.argv.slice(2).filter(a => !a.startsWith('-'));
const fams = wanted.length ? wanted : all;
fs.mkdirSync(OUT, { recursive: true });
const manifest = { families: {}, total: 0, generatedBy: 'machtzev/ds-forge.mjs' };
for (const fam of fams) {
  const n = forgeFamily(fam);
  manifest.families[fam] = n; manifest.total += n;
  console.log(`🔨 forge ${fam}: ${n} אטומי-Dart`);
}
fs.writeFileSync(path.join(OUT, 'forge-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(`✓ ds-forge: ${fams.length} משפחות · ${manifest.total} אטומי-Dart מחושלים ⇒ new/dart-forge-bs/`);
