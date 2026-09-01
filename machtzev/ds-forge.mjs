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
  const vm = val.match(/var\(--([a-z0-9-]+)\)/i);
  if (vm) {
    const k = vm[1];
    if (SKIN[k]) return `skin.${SKIN[k]}`;
    if (THEME[k]) return `theme.${THEME[k]}`;
  }
  // color-mix(in …, var(--a) N%, transparent) ⇒ theme/skin.withValues(alpha:N/100)
  const cm = val.match(/color-mix\([^,]+,\s*var\(--([a-z0-9-]+)\)\s*(\d+)%/i);
  if (cm) {
    const k = cm[1], a = (+cm[2] / 100).toFixed(2);
    const base = SKIN[k] ? `skin.${SKIN[k]}` : THEME[k] ? `theme.${THEME[k]}` : null;
    if (base) return `${base}.withValues(alpha: ${a})`;
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
function fontExpr(val) {
  const m = val && val.match(/var\(--(serif|serifHe|grotesk|he)\)/);
  return m ? `fonts.${FONT[m[1]]}` : null;
}
const px = v => { const m = v && String(v).match(/(-?\d+(?:\.\d+)?)px/); return m ? m[1] : null; };
const num = v => { const m = v && String(v).match(/-?\d+(?:\.\d+)?/); return m ? m[0] : null; };

// ───────────────────────── פרסר-CSS (תת-קבוצה + מורכבים) ─────────────────────────
// single: .a ⇒ decl · compound: .a.b(.c) ⇒ {set,decl,order} (חל כשלאלמנט כל המחלקות).
// סלקטורים עם צאצא/[attr]/psuedo מדולגים. מחזיר {single, compound}.
function parseStyle(css) {
  const single = {}, compound = [], descend = []; let order = 0;
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /([^{}]+)\{([^{}]*)\}/g; let m;
  const simple = tok => /^(\.[a-z0-9-]+)+$/i.test(tok) ? tok.split('.').filter(Boolean) : null;  // .a / .a.b ⇒ [classes]
  while ((m = re.exec(css))) {
    const sels = m[1].split(',').map(s => s.trim());
    const decl = {};
    for (const d of m[2].split(';')) { const i = d.indexOf(':'); if (i < 0) continue; decl[d.slice(0, i).trim().toLowerCase()] = d.slice(i + 1).trim(); }
    for (const sel of sels) {
      if (/^\.([a-z0-9-]+)$/i.test(sel)) { const c = sel.slice(1); single[c] = Object.assign(single[c] || {}, decl); continue; }
      if (/^(\.[a-z0-9-]+){2,}$/i.test(sel)) { compound.push({ set: sel.split('.').filter(Boolean), decl, order: order++ }); continue; }
      // צאצא: ".a .b .c" — רק מחלקות מופרדות-רווח (בלי > ~ [attr] :pseudo tag)
      if (/^\.[a-z0-9-]+(\.[a-z0-9-]+)*( +\.[a-z0-9-]+(\.[a-z0-9-]+)*)+$/i.test(sel)) {
        const parts = sel.split(/\s+/).filter(Boolean).map(simple);
        if (parts.every(Boolean)) descend.push({ chain: parts, decl, order: order++ });
      }
    }
  }
  return { single, compound, descend };
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
    let found = false;
    while (i < ancestors.length) { if (part.every(c => ancestors[i].includes(c))) { found = true; i++; break; } i++; }
    if (!found) return false;
  }
  return true;
}
// מיזוג-cascade מקורב: בודדים → מורכבים → צאצא-תואם → inline (גובר).
function styleOf(node, map, ancestors = []) {
  const s = {}, classes = node.classes || [];
  for (const c of classes) if (map.single[c]) Object.assign(s, map.single[c]);
  for (const r of map.compound) if (r.set.every(c => classes.includes(c))) Object.assign(s, r.decl);
  for (const r of map.descend) {
    const target = r.chain[r.chain.length - 1];
    if (target.every(c => classes.includes(c)) && chainMatches(r.chain.slice(0, -1), ancestors)) Object.assign(s, r.decl);
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
  else { const bg = colorExpr(bgRaw); if (bg) parts.push(`color: ${bg}`); }
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
  if (/tabular/.test(st['font-feature-settings'] || '') || /tabular/.test(st['font-variant-numeric'] || ''))
    p.push('fontFeatures: const [FontFeature.tabularFigures()]');
  return p;
}

// SVG ⇒ path-data מנורמל (circle/rect/line/polyline ⇒ פקודות-path); <path d> נשמר כמו-שהוא
function svgToPathData(node) {
  let d = '';
  const walk = n => {
    for (const ch of n.children) {
      if (!ch.tag) continue;
      const a = ch.attrs;
      if (ch.tag === 'path' && a.d) d += ' ' + a.d;
      else if (ch.tag === 'circle') { const cx = +a.cx, cy = +a.cy, r = +a.r; d += ` M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`; }
      else if (ch.tag === 'rect') { const x = +a.x || 0, y = +a.y || 0, w = +a.width, h = +a.height; d += ` M ${x} ${y} h ${w} v ${h} h ${-w} Z`; }
      else if (ch.tag === 'line') { d += ` M ${a.x1} ${a.y1} L ${a.x2} ${a.y2}`; }
      else if ((ch.tag === 'polyline' || ch.tag === 'polygon') && a.points) { const pts = a.points.trim().split(/[\s,]+/); d += ' M ' + pts[0] + ' ' + pts[1]; for (let k = 2; k < pts.length; k += 2) d += ` L ${pts[k]} ${pts[k + 1]}`; if (ch.tag === 'polygon') d += ' Z'; }
      walk(ch);
    }
  };
  walk(node);
  return d.trim().replace(/\s+/g, ' ');
}
// טקסט-סטייל עם צבע-ברירת-מחדל (skin.ink) — לעולם לא "בלתי-נראה" תחת Material
function textStyleC(st) { const ts = textStyle(st); if (!ts.some(x => /^color:/.test(x))) ts.unshift('color: skin.ink'); if (!ts.some(x => /^fontFamily:/.test(x))) ts.push('fontFamily: fonts.he'); return ts; }
// אלמנט ⇒ ביטוי-widget. ancestors = מחלקות-האבות (שורש→אב) לסלקטורי-צאצא.
function emit(node, map, ancestors = [], depth = 0) {
  if (depth > 16) return 'const SizedBox.shrink()';
  if (node.tag === 'svg') {
    const d = svgToPathData(node);
    if (!d) return '_icon(skin.mut)';                           // אין path ⇒ נפילה לאייקון
    const vb = (node.attrs.viewbox || '0 0 24 24').split(/\s+/)[2] || '24';
    const sw = node.attrs['stroke-width'] || '1.8';
    const st0 = styleOf(node, map, ancestors);
    const w = px(st0['width']) || '16', h = px(st0['height']) || w;
    const stroke = colorExpr(st0['color'] || st0['stroke']) || 'skin.mut';
    const filled = (node.attrs.fill && node.attrs.fill !== 'none') || /^(?!none)/.test(st0['fill'] || 'none') && (st0['fill'] || '') !== 'none' && st0['fill'];
    return `CustomPaint(size: const Size(${w}, ${h}), painter: _SvgPaint(${dq(d)}, ${stroke}, ${sw}, ${filled ? 'true' : 'false'}, ${vb}))`;
  }
  if (node.tag === 'input') {
    const ph = node.attrs.placeholder || node.attrs.value || 'Label';
    const filled = !!node.attrs.value;
    const ist = styleOf(node, map, ancestors);
    const t = `Text(${dq(ph)}, style: TextStyle(color: ${filled ? 'skin.ink' : 'skin.faint'}, fontFamily: fonts.he, fontSize: 13))`;
    return wrapBox(Object.assign({ 'min-height': '44px' }, ist), t, node);
  }
  const st = styleOf(node, map, ancestors);
  const kids = elemChildren(node);
  const txt = textOf(node);
  const ta = st['text-align'];
  const taExpr = ta === 'center' ? ', textAlign: TextAlign.center' : ta === 'left' ? ', textAlign: TextAlign.left' : ta === 'right' ? ', textAlign: TextAlign.right' : '';

  // עלה עם טקסט בלבד ⇒ Text (תמיד עם צבע)
  if (!kids.length && txt) {
    return wrapBox(st, `Text(${dq(txt)}${taExpr}, style: TextStyle(${textStyleC(st).join(', ')}))`, node);
  }
  // בונה ילדים (מפריד אבסולוטיים ל-Stack)
  const childAnc = ancestors.concat([node.classes || []]);
  const flow = [], abs = [];
  for (const c of node.children) {
    if (c.text != null) { const t = c.text.trim(); if (t) flow.push(`Text(${dq(t)}, style: TextStyle(color: skin.ink, fontFamily: fonts.he))`); continue; }
    if (c.tag === 'br') continue;
    const cst = styleOf(c, map, childAnc);
    const e = emit(c, map, childAnc, depth + 1);
    if (cst['position'] === 'absolute') abs.push({ e, st: cst }); else flow.push(e);
  }
  let inner;
  const disp = st['display'] || '', fd = st['flex-direction'] || '';
  const gap = px(st['gap']);
  const listSep = gap ? `, spacing: ${gap}` : '';
  const isFlex = /flex/.test(disp), col = /column/.test(fd);
  const maj = JUST[st['justify-content']], min = ALIGN[st['align-items']];
  const majE = maj ? `, mainAxisAlignment: MainAxisAlignment.${maj}` : '';
  if (flow.length === 0) inner = null;
  else if (flow.length === 1 && !isFlex) inner = flow[0];
  else if (isFlex && !col) inner = `Row(mainAxisSize: MainAxisSize.min${majE}, crossAxisAlignment: CrossAxisAlignment.${min || 'center'}${listSep}, children: [${flow.join(', ')}])`;
  else inner = `Column(mainAxisSize: MainAxisSize.min, crossAxisAlignment: CrossAxisAlignment.${min || 'start'}${majE}${listSep}, children: [${flow.join(', ')}])`;
  // אבסולוטיים ⇒ Stack + Positioned
  if (abs.length) {
    const pos = abs.map(a => {
      const p = [];
      const t = px(a.st['top']), b = px(a.st['bottom']), l = px(a.st['left'] || a.st['inset-inline-start']), r = px(a.st['right'] || a.st['inset-inline-end']);
      if (t != null) p.push(`top: ${t}`); if (b != null) p.push(`bottom: ${b}`); if (l != null) p.push(`left: ${l}`); if (r != null) p.push(`right: ${r}`);
      return p.length ? `Positioned(${p.join(', ')}, child: ${a.e})` : `Positioned.fill(child: ${a.e})`;
    });
    inner = `Stack(clipBehavior: Clip.none, children: [${(inner ? [inner] : []).concat(pos).join(', ')}])`;
  }
  return wrapBox(st, inner, node);
}

// עוטף ביטוי ב-Container (רקע/מסגרת/צל/מידות/שוליים) + Opacity, לפי הסגנון
function wrapBox(st, inner, node) {
  const deco = decoration(st), pad = edge(st, 'padding'), mg = edge(st, 'margin');
  const w = px(st['width']), h = px(st['height']), minH = px(st['min-height']), minW = px(st['min-width']);
  const cp = [];
  if (w) cp.push(`width: ${w}`);
  if (h) cp.push(`height: ${h}`);
  if (minH != null || minW != null) cp.push(`constraints: const BoxConstraints(${[minH != null ? `minHeight: ${minH}` : '', minW != null ? `minWidth: ${minW}` : ''].filter(Boolean).join(', ')})`);
  if (mg) cp.push(`margin: ${mg}`);
  if (pad) cp.push(`padding: ${pad}`);
  if (deco) cp.push(`decoration: ${deco}`);
  let out;
  if (!cp.length) out = inner || 'const SizedBox.shrink()';
  else { if (inner) cp.push(`child: ${inner}`); out = `Container(${cp.join(', ')})`; }
  const op = st['opacity'] != null ? parseFloat(st['opacity']) : null;
  if (op != null && !isNaN(op) && op < 1) out = `Opacity(opacity: ${op}, child: ${out})`;
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
const HEADER = (fam, seamUse) => `// 🔨 אטום-Dart מחושל (forge) · משפחת-Pure "${fam}" · מחולל ע"י machtzev/ds-forge.mjs ממקור-האמת
// machtzev/pure/${fam}-family.html (אל תערוך ידנית — regen). לובש עיצוב מהחריץ בלבד (DsSeam.skinOf/of/fontsOf,
// חוק-5/6): אפס צבע-קבוע. תוכן Label/Value/Meta. material בלבד.
import 'package:flutter/material.dart';
${seamUse ? "import '../../dart-ui-bs/ds/ds_seam.dart';\n" : ''}`;
const ICON = `
// אייקון-פלייסהולדר ניטרלי (svg ללא path)
Widget _icon(Color c) => Icon(Icons.circle_outlined, size: 15, color: c);
`;
// צייר-SVG אמיתי · פרסר path-data ב-runtime (M/L/H/V/C/Q/A/Z + יחסי) ⇒ Path מוקטן ל-viewBox
const SVGHELPER = `
class _SvgPaint extends CustomPainter {
  final String d; final Color color; final double sw; final bool filled; final double vb;
  const _SvgPaint(this.d, this.color, this.sw, this.filled, this.vb);
  @override
  void paint(Canvas canvas, Size size) {
    Path raw;
    try { raw = _parse(d); } catch (_) { return; }   // path פגום ⇒ ריקון-רך, לא זריקה
    final m = Matrix4.identity()..scale(size.width / vb, size.height / vb);
    final p = raw.transform(m.storage);
    canvas.drawPath(p, Paint()
      ..color = color
      ..style = filled ? PaintingStyle.fill : PaintingStyle.stroke
      ..strokeWidth = sw
      ..strokeCap = StrokeCap.round
      ..strokeJoin = StrokeJoin.round);
  }
  @override
  bool shouldRepaint(_SvgPaint o) => o.d != d || o.color != color || o.sw != sw || o.filled != filled;
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

function forgeFamily(fam) {
  const html = fs.readFileSync(path.join(PURE, `${fam}-family.html`), 'utf8');
  const styleM = html.match(/<style>([\s\S]*?)<\/style>/);
  const map = parseStyle(styleM ? styleM[1] : '');
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
    const useSvg = /_SvgPaint\(/.test(bodyExpr);
    const decls = [
      useSkin && '    final skin = DsSeam.skinOf(context);   // מלוא-העיצוב מהחריץ',
      useTheme && '    final theme = DsSeam.of(context);       // אקצנט (מורף)',
      useFonts && '    final fonts = DsSeam.fontsOf(context);  // פונט',
    ].filter(Boolean).join('\n');
    const src = HEADER(fam, useSkin || useTheme || useFonts || useIcon || useSvg) + (useIcon ? ICON : '') + (useSvg ? SVGHELPER : '') + `
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
