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
// פתירת custom-properties מוגדרי-משתמש (‏.tone-info{--tone:var(--a-hi)}): מרחיב var(--X) לערכו
// מהקסקד (‏vars), רקורסיבית, עד טוקן-ערכה מוכר (--a-hi) או ליטרל. טוקני-ערכה נשארים ל-colorExpr.
function resolveVars(val, vars) {
  if (!val || typeof val !== 'string' || !val.includes('var(') || !vars) return val;
  let out = val, prev, guard = 0;
  do { prev = out; out = out.replace(/var\(\s*(--[a-z0-9-]+)\s*(?:,[^()]*)?\)/gi, (m, name) => (vars[name] != null ? vars[name] : m)); } while (out !== prev && ++guard < 12);
  return out;
}
// value ⇒ {expr, alpha?} · מזהה var(--token) (עם עטיפת color-mix/גרדיאנט ⇒ מפשט לטוקן-הבסיס)
function colorExpr(val) {
  if (!val) return null;
  if (/^\s*transparent\s*$/i.test(val)) return 'const Color(0x00000000)';   // עצירת-transparent בגרדיאנט (scrim/fade) — בלי זה gradientExpr נכשל ונצבע צבע-אחיד-כהה
  // color-mix(in …, A N%, B): A במשקל N% + B ב-(100-N)%. B=transparent ⇒ A.withValues(alpha:N/100) (שקיפות);
  // B=צבע-אטום (למשל var(--raised2)) ⇒ Color.lerp(B, A, N/100) — מיזוג-אמת. בלי זה נצבע A שקוף במקום המיזוג-הכהה.
  const cm = val.match(/color-mix\(\s*in\s+[^,]+,\s*([^,]+?)\s*(\d+(?:\.\d+)?)%\s*,\s*(var\(--[a-z0-9-]+\)|[^,)]+)\s*\)/i);
  if (cm) {
    const cA = colorExpr(cm[1].trim()), p = (+cm[2] / 100).toFixed(3), second = cm[3].trim();
    if (cA) {
      if (/^transparent$/i.test(second)) return `${cA}.withValues(alpha: ${p})`;
      const cB = colorExpr(second);
      if (cB) return `Color.lerp(${cB}, ${cA}, ${p})!`;
    }
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
    const at = seg.match(/at\s+(-?[\d.]+)%\s+(-?[\d.]+)%/);   // ‏-? = מיקום שלילי (at 85% -20%) — בלעדיו הזוהר נפל למרכז
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
// conic-gradient(from Ndeg, c1, c2, …) ⇒ SweepGradient. CSS: 0°=למעלה, עם-כיוון-השעון; Flutter SweepGradient:
// 0=מזרח (3), עם-כיוון-השעון ⇒ סיבוב (from-90)°. טבעת-הסטורי (.story) חוזרת לצבעוניות במקום סגול-אחיד.
function conicExpr(val) {
  const m = val && val.match(/conic-gradient\((.*)\)/is);
  if (!m) return null;
  const parts = splitTop(m[1]);
  let from = 0;
  if (parts.length && /^\s*from\s/i.test(parts[0])) { const fm = parts.shift().match(/from\s+(-?[\d.]+)deg/i); if (fm) from = +fm[1]; }
  const cols = [];
  for (const seg of parts) { const c = colorExpr(seg.trim().replace(/\s+-?[\d.]+(?:deg|%)\s*$/i, '').trim()); if (!c) return null; cols.push(c); }
  if (cols.length < 2) return null;
  const rot = (((from - 90) % 360) * Math.PI / 180).toFixed(4);
  return `SweepGradient(colors: [${cols.join(', ')}], transform: const GradientRotation(${rot}))`;
}
function fontExpr(val) {
  const m = val && val.match(/var\(--(serif|serifHe|grotesk|he)\)/);
  return m ? `fonts.${FONT[m[1]]}` : null;
}
// calc(A op B) דו-אופרנדי (px/מספר) ⇒ תוצאה מספרית · null אם לא-מזוהה. (var(--x) כבר הורחב ב-resolveVars.)
const evalCalc = v => {
  if (typeof v !== 'string' || !/calc\(/i.test(v)) return null;
  const m = /calc\(\s*(-?[\d.]+)(?:px)?\s*([*/+-])\s*(-?[\d.]+)(?:px)?\s*\)/i.exec(v);
  if (!m) return null;
  const a = parseFloat(m[1]), b = parseFloat(m[3]), op = m[2];
  const r = op === '*' ? a * b : op === '/' ? a / b : op === '+' ? a + b : a - b;
  return isFinite(r) ? r : null;
};
// ‏px: מחשב calc() · תומך ב-.5px (נקודה-מובילה) ומחזיר מספר-Dart-תקין (0.5, לא .5). ‏(?<![\d.]) מונע חטיפת "5px" מ-".5px".
const px = v => { const c = evalCalc(v); if (c != null) return (+c.toFixed(3)).toString(); const m = v && String(v).match(/(?<![\d.])(-?(?:\d+(?:\.\d+)?|\.\d+))px/); return m ? m[1].replace(/^(-?)\./, '$10.') : null; };
const pct = v => { const m = v && String(v).match(/^\s*(\d+(?:\.\d+)?)%\s*$/); return m ? (+m[1] / 100).toFixed(3) : null; };  // רוחב/גובה יחסי
const num = v => { const m = v && String(v).match(/-?(?:\d+\.?\d*|\.\d+)/); if (!m) return null; return m[0].replace(/^-\./, '-0.').replace(/^\./, '0.'); };

// ───────────────────────── פרסר-CSS (תת-קבוצה + מורכבים) ─────────────────────────
// single: .a ⇒ decl · compound: .a.b(.c) ⇒ {set,decl,order} (חל כשלאלמנט כל המחלקות).
// סלקטורים עם צאצא/[attr]/psuedo מדולגים. מחזיר {single, compound}.
function parseStyle(css) {
  const single = {}, compound = [], descend = [], tagcls = [], pseudo = [], sibling = []; let order = 0;
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /([^{}]+)\{([^{}]*)\}/g; let m;
  // חלק-שרשרת ⇒ {cls:[...]} (מחלקות) | {tag:'svg'} (תג-בודד) | null
  const simple = tok => {
    if (/^(\.[a-z0-9-]+)+$/i.test(tok)) return { cls: tok.split('.').filter(Boolean) };
    if (/^[a-z][a-z0-9]*$/i.test(tok)) return { tag: tok.toLowerCase() };
    const tc = /^([a-z][a-z0-9]*)((?:\.[a-z0-9-]+)+)$/i.exec(tok);   // תג+מחלקה: "i.ink"
    if (tc) return { tag: tc[1].toLowerCase(), cls: tc[2].split('.').filter(Boolean) };
    return null;
  };
  while ((m = re.exec(css))) {
    const sels = m[1].split(',').map(s => s.trim());
    const decl = {};
    for (const d of m[2].split(';')) { const i = d.indexOf(':'); if (i < 0) continue; decl[d.slice(0, i).trim().toLowerCase()] = d.slice(i + 1).trim(); }
    for (const sel of sels) {
      // ::before / ::after — פסבדו-אלמנט מעוצב. השרשרת = מארח (כמו descend); ה-decl כולל content.
      const pm = /^(.+?)::?(before|after)$/i.exec(sel);
      if (pm && /content\s*:/.test(m[2])) {
        const base = pm[1].trim(), pos = pm[2].toLowerCase();
        const parts = (base.includes(' ') ? base.split(/\s+/).filter(Boolean) : [base]).map(simple);
        if (parts.length && parts.every(Boolean)) pseudo.push({ chain: parts, pos, decl, order: order++ });
        continue;
      }
      if (/^\.([a-z0-9-]+)$/i.test(sel)) { const c = sel.slice(1); single[c] = Object.assign(single[c] || {}, decl); continue; }
      if (/^(\.[a-z0-9-]+){2,}$/i.test(sel)) { compound.push({ set: sel.split('.').filter(Boolean), decl, order: order++ }); continue; }
      // תג-מוכשר-מחלקה: "svg.i" / "button.p" ⇒ תואם כשהתג+כל-המחלקות
      if (/^[a-z][a-z0-9]*(\.[a-z0-9-]+)+$/i.test(sel)) { const ps = sel.split('.'); tagcls.push({ tag: ps[0].toLowerCase(), set: ps.slice(1).filter(Boolean), decl, order: order++ }); continue; }
      // אח-עוקב: "A ~ B" (אולי עם אבות "P A ~ B") — B שאחרי אח-שמאלי A. משמש לפינוי-מקום (padding
      // ל-.inp שאחרי אייקון-.lic). בלי > [attr] :pseudo #id. הרשומה: אבות + אח-שמאלי + מטרה-ימנית.
      if (/~/.test(sel) && !/[>[\]:()#]/.test(sel)) {
        const [ls, rs] = sel.split('~');
        const leftParts = ls.trim().split(/\s+/).filter(Boolean).map(simple);
        const right = simple((rs || '').trim());
        if (right && leftParts.length && leftParts.every(Boolean)) sibling.push({ anc: leftParts.slice(0, -1), left: leftParts[leftParts.length - 1], right, decl, order: order++ });
        continue;
      }
      // צאצא: ".a .b" / ".a svg" — מחלקות/תגים מופרדי-רווח (בלי > ~ [attr] :pseudo #id)
      if (/ /.test(sel) && !/[>~[\]:()#]/.test(sel)) {
        const parts = sel.split(/\s+/).filter(Boolean).map(simple);
        if (parts.length >= 2 && parts.every(Boolean)) descend.push({ chain: parts, decl, order: order++ });
      }
    }
  }
  return { single, compound, descend, tagcls, pseudo, sibling };
}
// פסבדו-אלמנטים (::before/::after) התואמים לצומת ⇒ צמתי-span סינתטיים (decl כ-inline + content כטקסט).
function pseudoKids(node, map, ancestors, sibIdx = 0) {
  if (!map.pseudo || !map.pseudo.length) return { before: [], after: [] };
  const classes = node.classes || [];
  const out = { before: [], after: [] };
  for (const r of map.pseudo) {
    const target = r.chain[r.chain.length - 1];
    const hit = (target.tag ? node.tag === target.tag : true) && (target.cls ? target.cls.every(c => classes.includes(c)) : true);
    if (!hit || !chainMatches(r.chain.slice(0, -1), ancestors)) continue;
    const cm = /content\s*:\s*(?:"([^"]*)"|'([^']*)'|([^;]+))/.exec(Object.entries(r.decl).map(([k, v]) => `${k}:${v}`).join(';'));
    let text = '';
    if (cm) { const raw = cm[1] != null ? cm[1] : cm[2] != null ? cm[2] : (cm[3] || '').trim();
      if (/counter\(/.test(raw)) text = String(sibIdx + 1);   // content:counter(n) ⇒ מספר-הסידור (1-מבוסס)
      else if (!/attr\(|url\(/.test(raw)) text = raw; }
    const style = Object.entries(r.decl).filter(([k]) => k !== 'content').map(([k, v]) => `${k}:${v}`).join(';');
    const kid = { tag: 'span', classes: [], attrs: { style }, children: text ? [{ text }] : [] };
    out[r.pos].push(kid);
  }
  return out;
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
    const hit = (target.tag ? node.tag === target.tag : true) && (target.cls ? target.cls.every(c => classes.includes(c)) : true);
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
// ילד עם margin אנכי-auto (‏margin:auto / margin:auto 0) בטור-flex ⇒ מרכוז-אנכי בתוך min-height (‏.ctl segment).
// margin:0 auto (אופקי) לא-נכלל — הטוקן-הראשון חייב להיות auto.
function hasVAutoChild(node) { return elemChildren(node).some(c => /margin\s*:\s*auto(?:[\s;"]|$)/.test((c.attrs && c.attrs.style) || '')); }

function decoration(st) {                       // {prop} ⇒ BoxDecoration(...) | null
  const parts = [];
  const bgRaw = st['background'] || st['background-color'];
  const grad = gradientExpr(bgRaw) || conicExpr(bgRaw);   // linear או conic (SweepGradient)
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
  const br = st['border'], bcRaw = st['border-color'];   // צבע-גבול יכול לבוא ב-property נפרד (border-color)
  if (br || bcRaw) {
    const bc = (br && colorExpr(br)) || (bcRaw && colorExpr(bcRaw)) || null;
    const wm = /(\d+(?:\.\d+)?)px/.exec(br || '');
    const bw = wm ? wm[1] : '1';
    if (bc) parts.push(`border: Border.all(color: ${bc}${+bw !== 1 ? `, width: ${bw}` : ''})`);
  } else {
    // גבולות-כיווניים (border-inline-start/end · border-left/right/top/bottom) — RTL: start=right, end=left.
    const sideMap = { 'border-top': 'top', 'border-bottom': 'bottom', 'border-left': 'left', 'border-right': 'right', 'border-inline-start': 'right', 'border-inline-end': 'left', 'border-block-start': 'top', 'border-block-end': 'bottom' };
    const sides = [];
    for (const prop in sideMap) { const v = st[prop]; if (!v) continue; const c = colorExpr(v); if (!c) continue; const wm = /(\d+(?:\.\d+)?)px/.exec(v); sides.push(`${sideMap[prop]}: BorderSide(color: ${c}, width: ${wm ? wm[1] : '1'})`); }
    if (sides.length) parts.push(`border: Border(${sides.join(', ')})`);
  }
  const rad = st['border-radius'];
  // border-radius:50% = עגול-מלא ביחס-לגודל · Flutter circular(פיקסלים) — לא אחוז; המנוע לא יודע את הגודל
  // בזמן-חילול ⇒ ערך-גדול (999) שנחתך לעיגול/גלולה בכל מידה. circular(50) פיקסלים היה נכשל על קופסה >100px.
  if (rad) { const r = /%|999/.test(rad) ? '999' : (px(rad) || num(rad)); if (r) parts.push(`borderRadius: BorderRadius.circular(${r})`); }
  const sh = shadowExpr(st['box-shadow']);
  if (sh) parts.push(`boxShadow: [${sh}]`);
  return parts.length ? `BoxDecoration(${parts.join(', ')})` : null;
}
// רקע דו-שכבתי radial-glow מעל linear-base: Flutter מגביל gradient-יחיד ל-BoxDecoration ⇒ ה-linear נבחר
// ל-decoration (בסיס), וזוהר-ה-radial נצבע כ-foregroundDecoration מעליו — דוהה ל-transparent אמיתי כך שהבסיס
// מציץ (hero_card: הזוהר הסגול חזר; קודם רק ה-linear הכהה נצבע). רק כשהבסיס הנבחר הוא linear + יש שכבת-radial.
function bgOverlayGlow(st) {
  const bgRaw = st['background'] || st['background-color'];
  if (!bgRaw || !gradientExpr(bgRaw)) return null;
  const radSeg = splitTop(bgRaw).find(s => /radial-gradient/i.test(s));
  if (!radSeg) return null;
  const rad = radialExpr(radSeg, 'const Color(0x00000000)');   // עצירת-transparent = שקוף-אמיתי (הבסיס נחשף)
  if (!rad) return null;
  const rv = st['border-radius'], r = rv ? (/%|999/.test(rv) ? '999' : (px(rv) || num(rv))) : null;
  return `BoxDecoration(gradient: ${rad}${r ? `, borderRadius: BorderRadius.circular(${r})` : ''})`;
}
// EdgeInsets מ-shorthand (padding/margin) + פר-צד (margin-top…). null אם אין. noV=אפס-שוליים-אנכיים
// (לקריסת-שוליים ב-block flow — השוליים-האנכיים נבנים-מחדש כ-SizedBox-מקוריס ברמת-ה-Column).
function edge(st, prop, noV) {
  const sh = st[prop];
  const per = { top: px(st[`${prop}-top`]), right: px(st[`${prop}-right`]), bottom: px(st[`${prop}-bottom`]), left: px(st[`${prop}-left`]) };
  // תכונות-לוגיות (RTL): inline-start⇒right · inline-end⇒left · block-start⇒top · block-end⇒bottom.
  // בלי זה padding-inline-start (הזחת-מרקר-רשימה) לא חל ⇒ מספר/נקודה חופפים לטקסט.
  const iis = px(st[`${prop}-inline-start`]), iie = px(st[`${prop}-inline-end`]), ibs = px(st[`${prop}-block-start`]), ibe = px(st[`${prop}-block-end`]);
  if (iis != null) per.right = iis; if (iie != null) per.left = iie; if (ibs != null) per.top = ibs; if (ibe != null) per.bottom = ibe;
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
  if (noV) { t = 0; b = 0; if (!r && !l) return null; }
  return `const EdgeInsets.fromLTRB(${l}, ${t}, ${r}, ${b})`;
}
// שוליים-אנכיים (מספריים, px) של אלמנט — מ-shorthand + margin-top/bottom + margin-block(-start/end).
// משמש לקריסת-שוליים (margin collapsing) ב-block flow: הפער בין אחים = max(תחתון-קודם, עליון-נוכחי).
function vMarginOf(st) {
  const v = x => { const p = px(x); return p != null ? +p : (num(x) || 0); };
  let mt = 0, mb = 0;
  const sh = st['margin'];
  if (sh) { const ns = sh.trim().split(/\s+/); if (ns.length === 1) { mt = mb = v(ns[0]); } else if (ns.length === 2) { mt = mb = v(ns[0]); } else { mt = v(ns[0]); mb = v(ns[2]); } }
  const mbk = st['margin-block']; if (mbk) { const ns = mbk.trim().split(/\s+/); mt = v(ns[0]); mb = v(ns[1] != null ? ns[1] : ns[0]); }
  if (st['margin-block-start'] != null) mt = v(st['margin-block-start']);
  if (st['margin-block-end'] != null) mb = v(st['margin-block-end']);
  if (st['margin-top'] != null) mt = v(st['margin-top']);
  if (st['margin-bottom'] != null) mb = v(st['margin-bottom']);
  return { mt, mb };
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
  // font-size: הערך שנפתר (מפורש/יורש) ⇒ אותו. אין font-size כלל ⇒ ברירת-CSS (body ללא font-size = 16px);
  // בלי הזרעה זו Flutter נופל ל-14px משלו ⇒ טקסט-בלי-גודל (reveal_card "Label") קטן-מהמקור ב-16/14.
  // ערך קיים-אך-לא-נפתר (clamp/calc-מורכב) ⇒ לא-מזריקים (לא ניחוש) — נשאר כפי-שהיה.
  const fs = px(st['font-size']); if (fs) p.push(`fontSize: ${fs}`); else if (st['font-size'] == null) p.push('fontSize: 16');
  const fw = st['font-weight']; if (fw && +fw >= 600) p.push(`fontWeight: FontWeight.w${fw >= 700 ? 700 : 600}`);
  const ls = st['letter-spacing'];
  if (ls && ls !== 'normal') {
    let v = px(ls);
    if (v == null) { const em = String(ls).match(/(-?\d*\.?\d+)em/); const fs2 = px(st['font-size']); if (em && fs2) v = (parseFloat(em[1]) * +fs2).toFixed(2); }  // em ⇒ פיקסלים לפי font-size
    if (v == null) v = num(ls);
    if (v != null && +v !== 0) p.push(`letterSpacing: ${v}`);
  }
  // line-height ⇒ height + leadingDistribution.even: CSS מחלק את הליווי (line-height פחות גובה-הגליף)
  // באופן שווה מעל+מתחת לגליף. Flutter דיפולטית proportional ⇒ הגליף גבוה-מדי בקופסת-השורה, מה שהזיז
  // את המונה ברשימה-ממוספרת מהמרכז. even = התאמה-לדפדפן (הגליף ממורכז-אנכית בקופסת-השורה).
  const lh = st['line-height']; if (lh && lh !== 'normal' && !/px|%/.test(lh)) { const v = num(lh); if (v) { p.push(`height: ${v}`); p.push('leadingDistribution: TextLeadingDistribution.even'); } }
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
  // תכונות-הצגה של SVG יורדות מ-<g> אל הילדים (fill/stroke/… ירושה כמו-CSS). בלי זה, 12 עמודות בתוך
  // <g fill="…"> נופלות לברירת-קו-ink במקום מילוי-האקסנט (waveform_bars). מיזוג: תכונת-הילד גוברת על הירושה.
  const SVG_INH = ['fill', 'stroke', 'stroke-width', 'fill-opacity', 'stroke-opacity', 'text-anchor'];
  const walk = (n, panc, pattr) => {
    for (const ch of n.children) {
      if (!ch.tag) continue;
      const est = styleOf(ch, map, panc), a = { ...ch.attrs };
      for (const k of SVG_INH) if (a[k] == null && pattr[k] != null) a[k] = pattr[k];
      const fillRaw = a.fill || est['fill'];
      const strokeRaw = a.stroke || est['stroke'] || est['color'];
      const filled = !!(fillRaw && fillRaw !== 'none');
      const gd = filled ? urlId(fillRaw) : urlId(strokeRaw);          // גרדיאנט על מילוי/קו
      let col = filled ? (colorExpr(fillRaw) || inherit) : (colorExpr(strokeRaw) || inherit);
      // opacity/fill-opacity/stroke-opacity על צורת-SVG ⇒ אלפא על הצבע (step_area: fill var(--a) opacity=.1 = מילוי
      // דהוי; בלי זה נצבע מלא-אטום). לא-חל כשיש גרדיאנט (לו יש אלפא-עצמי בעצירות). opacity חל על כל-הצורה.
      { const so = parseFloat(a['opacity'] ?? est['opacity'] ?? '1'); const fso = parseFloat((filled ? a['fill-opacity'] : a['stroke-opacity']) ?? '1'); const al = (isNaN(so) ? 1 : so) * (isNaN(fso) ? 1 : fso); if (al < 1 && !gd) col = `${col}.withValues(alpha: ${al.toFixed(2)})`; }
      const sw = num(a['stroke-width'] || est['stroke-width'] || '1.8') || '1.8';
      if (ch.tag === 'rect') ops.push(`_Op.rect(${+a.x || 0}, ${+a.y || 0}, ${+a.width || 0}, ${+a.height || 0}, ${a.rx ? +a.rx : 0}, ${col}, ${filled}, ${sw}${gArgs(gd)})`);
      else if (ch.tag === 'circle' && a['stroke-dasharray']) {          // dasharray+rotate(-90) ⇒ קשת
        const r = +a.r || 0, circ = 2 * Math.PI * r;
        const dash = a['stroke-dasharray'].trim().split(/[\s,]+/).map(Number);
        const off = a['stroke-dashoffset'] != null ? +a['stroke-dashoffset'] : 0;
        // אורך-הקשת-הנראה = dash[0] פחות ה-offset (מוסכמת-מד: dasharray=היקף, dashoffset=(1-חלק)·היקף ⇒
        // נראה = היקף−offset; מוסכמת-דונאט: dasharray="קשת פער", offset שלילי = נקודת-ההתחלה קדימה (‏PieChart:
        // seg2 off=-130 מתחיל היכן ש-seg1 נגמר). offset שלילי ⇒ מסובב את זווית-ההתחלה; חיובי ⇒ גוזם מלמעלה.
        let drawn, startPos;
        if (off < 0) { startPos = Math.min(-off, circ); drawn = Math.max(0, Math.min(dash[0] || 0, circ)); }
        else { startPos = 0; drawn = Math.max(0, Math.min(dash[0] || 0, circ) - off); }
        const start = (-Math.PI / 2 + (startPos / circ) * 2 * Math.PI).toFixed(4), sweep = ((drawn / circ) * 2 * Math.PI).toFixed(4);
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
      if (ch.tag !== 'text') { const nattr = {}; for (const k of SVG_INH) if (a[k] != null) nattr[k] = a[k]; walk(ch, panc.concat([ch.classes || []]), nattr); }
    }
  };
  walk(node, anc.concat([node.classes || []]), {});
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
// תכונות-טקסט תורשתיות (CSS inheritance) — יורדות מאב לצאצא; הצאצא-עם-ערך-משלו גובר.
const INHERIT_PROPS = ['font-size', 'font-family', 'font-weight', 'font-style', 'letter-spacing', 'line-height', 'text-transform', 'font-feature-settings', 'font-variant-numeric'];
// ווידג'ט-זרימה ⇒ InlineSpan עבור Text.rich (זרימת-inline אמיתית: עוטף-שורות + bidi + baseline).
// Text פשוט ⇒ TextSpan; כל השאר (איקון/Directionality/Container) ⇒ WidgetSpan מיושר-אמצע.
function toRichSpan(w) {
  w = w.trim();
  // Directionality(ltr/rtl, child: Text(...)) ⇒ TextSpan (ה-bidi של Text.rich מטפל בכיוון; עטיפת
  // WidgetSpan הייתה הופכת את סדר-ה-runs ב-RTL — Label/Meta התחלפו).
  const d = /^Directionality\(textDirection: TextDirection\.\w+, child: (Text\(.+\))\)$/s.exec(w);
  if (d) w = d[1];
  const m = /^Text\((.+), style: (TextStyle\(.*\))\)$/s.exec(w);
  if (m && !/,\s*text(Align|Direction):/.test(m[1])) return `TextSpan(text: ${m[1]}, style: ${m[2]})`;
  return `WidgetSpan(alignment: PlaceholderAlignment.middle, child: ${w})`;
}
function emit(node, map, ancestors = [], depth = 0, inherit = 'skin.ink', parentFlex = false, inhFont = {}, inhVars = {}, sibIdx = 0, parentWrap = false, styleOverride = null, noVMargin = false) {
  if (depth > 16) return 'const SizedBox.shrink()';
  if (node.tag === 'svg') {
    const st0r = styleOf(node, map, ancestors);
    const st0 = {}; for (const k in st0r) st0[k] = resolveVars(st0r[k], inhVars);   // פתירת var(--faint) וכו'
    const svgCol = colorExpr(st0['color']) || inherit;   // צבע-svg עצמי (.ph svg{color:var(--faint)}) גובר על היורש
    const sc = svgScene(node, map, ancestors, svgCol);
    if (!sc.ops.length) return `_icon(${svgCol})`;
    const wpx = px(st0['width']) || num(node.attrs.width);   // CSS או attr HTML (donut/gauge width="118")
    const hpx = px(st0['height']) || num(node.attrs.height);
    const _op = st0['opacity'] != null ? parseFloat(st0['opacity']) : null;   // .ph svg{opacity:.8}
    const _b0 = `CustomPaint(painter: _SvgScene([${sc.ops.join(', ')}], ${sc.vbw}, ${sc.vbh}))`;
    const body = (_op != null && !isNaN(_op) && _op < 1) ? `Opacity(opacity: ${_op}, child: ${_b0})` : _b0;
    // svg בגודל-אחוז חלקי (‏.ph svg{width:38%}) ⇒ FractionallySizedBox+FittedBox(contain). רק אחוז <100% פר-ציר:
    // height:100% (גרף .cbody svg) עם heightFactor:1 בהקשר-גובה-לא-חסום כופה אינסוף (קריסת-רינדור!) ⇒ נופל
    // ל-AspectRatio (מילוי-רוחב לפי יחס-viewBox — תקף תמיד). כך גרפי-dataviz נצבעים במקום לזרוק.
    const wf = pct(st0['width']), hf = pct(st0['height']);
    const wfp = wf && +wf < 1 ? wf : null, hfp = hf && +hf < 1 ? hf : null;
    if (wfp || hfp) return `FractionallySizedBox(${wfp ? `widthFactor: ${wfp}, ` : ''}${hfp ? `heightFactor: ${hfp}, ` : ''}child: FittedBox(fit: BoxFit.contain, child: SizedBox(width: ${sc.vbw}, height: ${sc.vbh}, child: ${body})))`;
    if (wpx) return `SizedBox(width: ${wpx}, height: ${hpx || (wpx / (sc.vbw / sc.vbh)).toFixed(2)}, child: ${body})`;  // אייקון/טבעת גודל-קבוע
    // גובה-קבוע, רוחב-אוטו (block ⇒ ממלא-מיכל). CustomPaint חסר-ילד עם רוחב-לא-חסום צובע ברוחב-0 (הגל נעלם!) ⇒
    // LayoutBuilder כובל את הרוחב למיכל (כשחסום) או ל-viewBox (בהקשר-רופף) ⇒ הצייר ממלא, preserveAspectRatio=none.
    if (hpx) return `SizedBox(height: ${hpx}, child: LayoutBuilder(builder: (ctx, cns) => SizedBox(width: cns.maxWidth.isFinite ? cns.maxWidth : ${sc.vbw}, height: ${hpx}, child: ${body})))`;
    return `AspectRatio(aspectRatio: ${(sc.vbw / sc.vbh).toFixed(4)}, child: ${body})`;  // width:100% ⇒ מילוי-רוחב לפי יחס-viewBox
  }
  if (node.tag === 'input') {
    const ph = node.attrs.placeholder || node.attrs.value || 'Label';
    const filled = !!node.attrs.value;
    const ist = styleOf(node, map, ancestors);
    if (styleOverride) Object.assign(ist, styleOverride);   // דריסת אח-עוקב (.lic ~ .inp ⇒ padding לפינוי-אייקון)
    // טקסט-הקלט ממורכז-אנכית (CSS input: line-height מלוא-הגובה) · אופקית לפי text-align (RTL: ברירת-מחדל ימין)
    const ta2 = resolveVars(ist['text-align'] || '', {});
    const alignH = ta2 === 'center' ? 'center' : ta2 === 'left' ? 'centerLeft' : 'centerRight';
    const t = `Align(alignment: Alignment.${alignH}, child: Text(${dq(ph)}, style: TextStyle(color: ${filled ? 'skin.ink' : 'skin.faint'}, fontFamily: fonts.he, fontSize: 13)))`;
    return wrapBox(Object.assign({ 'min-height': '44px' }, ist), t, node);
  }
  const st0 = styleOf(node, map, ancestors);
  // custom-properties: אוסף עצמי + מורש (יורש כמו ב-CSS); מרחיב var(--X) בכל ערכי-הסגנון.
  const ownVars = {}; for (const k in st0) if (k[0] === '-' && k[1] === '-') ownVars[k] = st0[k];
  const nextVars = Object.assign({}, inhVars, ownVars);
  const st = {}; for (const k in st0) st[k] = resolveVars(st0[k], nextVars);
  if (styleOverride) for (const k in styleOverride) st[k] = resolveVars(styleOverride[k], nextVars);   // דריסת אח-עוקב (A ~ B)
  // סגנון-טקסט אפקטיבי = תכונות-תורשה מהאב + הסגנון-העצמי (העצמי גובר). רק לטקסט (לא לקופסה).
  const effText = Object.assign({}, inhFont, st);
  const myColor = colorExpr(st['color']) || inherit;            // צבע-הטקסט האפקטיבי (עובר לילדים)
  const nextInh = {}; for (const k of INHERIT_PROPS) if (effText[k] != null) nextInh[k] = effText[k];  // תורשה מצטברת לצאצאים
  // אלמנט מוסתר-במנוחה (מתגלה-בהובר) ⇒ לא-מצויר. שני דפוסים:
  //  (א) פָּן-אחורי: backface-visibility:hidden + rotateY/X(180) — כרטיס-היפוך.
  //  (ב) פאנל-מוחלק-החוצה: position:absolute + transform:translate ±100% — נדחף לגמרי מחוץ למסגרת (reveal).
  // בלי זה FORGE צייר את הפָּן/הפאנל-המוסתר מעל התוכן (הראה Action/צד-אחורי במקום Label).
  const _tf = st['transform'] || '';
  const _backHidden = /hidden/.test(st['backface-visibility'] || '') && /rotate[xy]\(\s*180/i.test(_tf);
  const _slidOut = /^(?:absolute|fixed)$/.test((st['position'] || '').trim()) && /translate[xy]?\([^)]*(?<!\d)-?100%/i.test(_tf);
  if (_backHidden || _slidOut) return 'const SizedBox.shrink()';
  const kids = elemChildren(node);
  const txt = textOf(node);
  const ta = st['text-align'];
  const taExpr = ta === 'center' ? ', textAlign: TextAlign.center' : ta === 'left' ? ', textAlign: TextAlign.left' : ta === 'right' ? ', textAlign: TextAlign.right' : '';

  // פסבדו-אלמנטים (::before/::after) של הצומת — מחושבים מראש כדי שגם עלה-טקסט-בלבד עם ::before
  // (למשל li::before{content:counter} ברשימה ממוספרת) יזכה בהם ולא ייחתך במסלול-העלה.
  const pk = pseudoKids(node, map, ancestors, sibIdx);   // ::before/::after ⇒ צמתים סינתטיים לפני/אחרי הזרימה
  const hasPseudo = pk.before.length || pk.after.length;
  // עלה עם טקסט בלבד (ובלי פסבדו) ⇒ Text (צבע-יורש · text-transform · גודל/פונט-יורשים)
  if (!kids.length && txt && !hasPseudo) {
    const tt = effText['text-transform'];
    const shown = tt === 'uppercase' ? txt.toUpperCase() : tt === 'lowercase' ? txt.toLowerCase() : tt === 'capitalize' ? txt.replace(/\b\w/g, c => c.toUpperCase()) : txt;
    // background-clip:text (+ color/fill:transparent) = טקסט-גרדיאנט. Flutter: ShaderMask עם הגרדיאנט על
    // הטקסט (srcIn), צבע-טקסט לבן, וביטול רקע-הקופסה. בלי זה הגרדיאנט צויר כרקע-מלבן מאחורי טקסט-שקוף.
    const clipText = /text/.test(st['background-clip'] || st['-webkit-background-clip'] || '');
    const grad = clipText ? gradientExpr(st['background'] || '') : null;
    if (grad) {
      const ef2 = Object.assign({}, effText); delete ef2['color'];
      const tw = `Text(${dq(shown)}${taExpr}, style: TextStyle(${textStyleC(ef2, 'const Color(0xFFFFFFFF)').join(', ')}))`;
      const masked = `ShaderMask(shaderCallback: (b) => ${grad}.createShader(b), blendMode: BlendMode.srcIn, child: ${tw})`;
      const st2 = Object.assign({}, st, { background: undefined, 'background-clip': undefined, '-webkit-background-clip': undefined, color: undefined });
      return wrapBox(st2, masked, node, false, parentFlex, noVMargin);
    }
    return wrapBox(st, `Text(${dq(shown)}${taExpr}, style: TextStyle(${textStyleC(effText, inherit).join(', ')}))`, node, false, parentFlex, noVMargin);   // parentFlex ⇒ פריט-flex-עלה שומר width (blockification), למשל .sevrow .lb width:64px
  }
  // בונה ילדים (מפריד אבסולוטיים ל-Stack) · מעביר צבע-יורש
  const childAnc = ancestors.concat([node.classes || []]);
  const pFlexRow = /flex/.test(st['display'] || '') && !/column/.test(st['flex-direction'] || '');
  // ילד של קונטיינר flex/grid עובר blockification (used-display⇒block) ⇒ width/height חלים גם על span-item.
  const selfFlexGrid = /flex|grid/.test(st['display'] || '');
  // האם המיכל הזה הוא Wrap (flex-wrap בשורה) — ילדיו חייבים גודל-תוכן (min), אחרת פריט-max ממלא-שורה ונערם.
  const selfWrap = /flex/.test(st['display'] || '') && !/column/.test(st['flex-direction'] || '') && /wrap/.test(st['flex-wrap'] || '') && !/nowrap/.test(st['flex-wrap'] || '');
  // מיכל-בלוק (לא flex/grid) ⇒ ילדי-הבלוק שבו עוברים קריסת-שוליים אנכית (CSS margin collapsing).
  const parentBlock = !/flex|grid/.test(st['display'] || '');
  const flow = [], abs = [], flowVM = [];   // flowVM מקביל ל-flow: {mt,mb} לילד-בלוק שהוסרו-לו שוליים, אחרת null
  let flowInline = true, flowAllText = true;   // כל-הילדים inline-level ⇒ זרימת-inline (שורה, לא טור)
  const allKids = hasPseudo ? [...pk.before, ...node.children, ...pk.after] : node.children;
  let elemIdx = 0;
  const seenLeft = new Set();   // כללי אח-עוקב (A ~ B) שאחיהם-השמאלי כבר נראה ⇒ המטרה-הימנית תדרס
  const sibRules = (map.sibling || []).filter(r => chainMatches(r.anc, childAnc));   // רק כללים שהאבות תואמים למיכל
  const clsHit = (t, c) => (t.tag ? c.tag === t.tag : true) && (t.cls ? t.cls.every(x => (c.classes || []).includes(x)) : true);
  // אב = flex-column עם align-items לא-מפורש ⇒ ברירת-CSS = stretch: ילד-בלוק ללא-רוחב-קבוע ובעל-יישור-עצמי
  // (direction/text-align) ממלא-רוחב ומתיישר-פנימית. ממקדים לילד-הטקסט בלבד — אח בגודל-קבוע (avatar 44) לא-נמתח.
  const pColStretch = /flex/.test(st['display'] || '') && /column/.test(st['flex-direction'] || '') && !ALIGN[st['align-items']];
  const pColAny = /flex/.test(st['display'] || '') && /column/.test(st['flex-direction'] || '');   // אב flex-column (ל-align-self)
  const zOf = s => { const v = s['z-index']; return /^-?\d+$/.test((v || '').trim()) ? +v : 0; };   // z-index מספרי (ברירת 0)
  let flowMaxZ = 0;   // z-index-מרבי בזרימה — אם גבוה מ-abs, הזרימה נצבעת אחריהם (av מעל .gap ב-story ring)
  for (const c of allKids) {
    // טקסט-חופשי בתוך אלמנט יורש את סגנון-ההורה (גודל/משקל/צבע/פונט) — CSS inheritance.
    // רווחי-גבול בין-אלמנטים משמעותיים ב-CSS (inline) — משמרים רווח-בודד (לא trim מלא ⇒
    // "בדגש נושא" נשמר, לא "בדגשנושא"); דילוג רק על רווח-טהור.
    if (c.text != null) { const raw = c.text.replace(/\s+/g, ' '); if (raw.trim()) { const tt = effText['text-transform']; const shown = tt === 'uppercase' ? raw.toUpperCase() : tt === 'lowercase' ? raw.toLowerCase() : tt === 'capitalize' ? raw.replace(/\b\w/g, ch => ch.toUpperCase()) : raw; flow.push(`Text(${dq(shown)}, style: TextStyle(${textStyleC(effText, myColor).join(', ')}))`); flowVM.push(null); } continue; }   // text-transform חל גם על טקסט-בזרימה (‏.kt SECTION עם ::before-קו)
    if (c.tag === 'br') { flow.push(`Text("\\n", style: TextStyle(${textStyleC(effText, myColor).join(', ')}))`); flowVM.push(null); continue; }   // <br> ⇒ שבירת-שורה (נשמרת ב-Text.rich)
    const cst = styleOf(c, map, childAnc);
    let sibOv = null;
    for (const r of sibRules) { if (seenLeft.has(r) && clsHit(r.right, c)) { sibOv = sibOv || {}; Object.assign(sibOv, r.decl); } }   // אח-שמאלי נראה + c=מטרה ⇒ דריסה
    for (const r of sibRules) if (clsHit(r.left, c)) seenLeft.add(r);   // c הוא אח-שמאלי ⇒ יחול על אחיו-הבאים
    // inline-level? display:inline* מפורש, או תג-inline כברירת-מחדל. אחרת בלוק ⇒ ביטול זרימת-inline.
    const cInline = cst['display'] ? /^inline/.test(cst['display']) : INLINE_TAGS.has(c.tag);
    const posAbsC = /^(?:absolute|fixed)$/.test((cst['position'] || '').trim());
    // ילד-בלוק במיכל-בלוק ⇒ מסירים שוליים-אנכיים (ייבנו-מחדש מקוריסים ברמת-ה-Column). לא ל-abs/inline/flex.
    const collapseChild = parentBlock && !cInline && !posAbsC;
    let e = emit(c, map, childAnc, depth + 1, myColor, selfFlexGrid, nextInh, nextVars, elemIdx++, selfWrap, sibOv, collapseChild);
    if (cst['position'] === 'absolute') { abs.push({ e, st: cst, z: zOf(cst) }); continue; }
    { const cz = zOf(cst); if (cz > flowMaxZ) flowMaxZ = cz; }   // ילד-זרימה בעל z-index גבוה
    // ילד-טקסט בעל-יישור-עצמי בטור-stretch, בלי רוחב-קבוע ⇒ ממלא-רוחב כדי שיישורו-הפנימי יחול (kpi "92"
    // direction:ltr ⇒ שמאל; "no avatar"/"+12"/"Meta" כנ"ל). אח בגודל-קבוע לא-מושפע (לא נכנס לתנאי).
    if (pColStretch && (cst['direction'] || cst['text-align']) && !px(cst['width'])) e = `SizedBox(width: double.infinity, child: ${e})`;   // ילד-flex מבוקק (גם span) ⇒ אין תנאי-inline
    // align-self בילד-flex-column ⇒ יישור-עצמי חוצה (RTL: flex-end=שמאל · center=מרכז · flex-start=ימין ברירת-מחדל).
    // עוטף Align ברוחב-מלא (chat: בועת .out לשמאל, .sys למרכז). ברירת-start ו-stretch לא-נוגעים.
    { const asf = ALIGN[cst['align-self']]; if (pColAny && (asf === 'end' || asf === 'center') && !cInline) e = `SizedBox(width: double.infinity, child: Align(alignment: Alignment.${asf === 'end' ? 'centerLeft' : 'center'}, heightFactor: 1.0, child: ${e}))`; }
    if (!cInline) flowInline = false;
    if (!(cInline && /^(?:Text\(|Directionality\(textDirection: TextDirection\.\w+, child: Text\()/.test(e))) flowAllText = false;
    // flex-grow חיובי או width:100% בשורת-flex ⇒ Expanded (ממלא · מוסר אי-חסימת-רוחב; SizedBox אינסופי
    // בתוך Row-לא-חסום קורס — Expanded נותן רוחב-חסום שה-SizedBox ממלא).
    if (pFlexRow) { const fx = (cst['flex'] || '').trim(); if ((fx && fx !== 'none' && fx !== '0' && !/^0\b/.test(fx)) || pct(cst['width']) === '1.000') e = `Expanded(child: ${e})`; }
    flow.push(e); flowVM.push(collapseChild ? vMarginOf(cst) : null);
  }
  let inner;
  const disp = st['display'] || '', fd = st['flex-direction'] || '';
  const gap = px(st['gap']);
  const listSep = gap ? `, spacing: ${gap}` : '';
  const isFlex = /flex/.test(disp), col = /column/.test(fd);
  const maj = JUST[st['justify-content']], min = ALIGN[st['align-items']];
  // טור-flex עם ילד margin אנכי-auto ובלי justify ⇒ מרכוז-אנכי (‏.ctl > div[margin:auto 0] > segment). Column
  // ממלא-גובה (max) וממרכז; wrapBox קובע גובה=min-height כדי שהמרכוז יחול (כמו תיקון-האווטארים).
  const colVAuto = isFlex && col && !maj && hasVAutoChild(node);
  const majE = maj ? `, mainAxisAlignment: MainAxisAlignment.${maj}` : '';
  const rowCross = min || 'center', colCross = min || 'start';
  const tb = c => c === 'baseline' ? ', textBaseline: TextBaseline.alphabetic' : '';
  // display:flex (בלוק) = רוחב-מלא ⇒ MainAxisSize.max · inline-flex = כיווץ-לתוכן ⇒ min · space-* דורש max
  const isInlineFlex = /inline-flex/.test(disp);
  // פריט בתוך Wrap אב ⇒ גודל-תוכן (min), אחרת שורת-max ממלאת-שורה ⇒ פריט-אחד-בשורה (נערם). CSS: פריט-flex-wrap מתכווץ-לתוכן.
  const rowSize = parentWrap ? 'MainAxisSize.min' : (((isFlex && !isInlineFlex) || /^space-/.test(st['justify-content'] || '')) ? 'MainAxisSize.max' : 'MainAxisSize.min');
  // flex-wrap:wrap בשורה ⇒ Wrap (Flutter Row לא עוטף ⇒ overflow). spacing=gap, runSpacing=gap.
  const flexWrap = /wrap/.test(st['flex-wrap'] || '') && !/nowrap/.test(st['flex-wrap'] || '');
  // display:grid עם grid-template-columns של fr — עמודות-שוות בשורה-אחת ⇒ Row של Expanded (flex לפי fr).
  // (שורה-אחת בלבד — flow.length<=cols; רשתות רב-שורות כמו לוח-שנה נשארות בזרימה הקיימת.)
  const isGrid = /grid/.test(disp), gtc = st['grid-template-columns'];
  let gridCols = null;
  if (isGrid && gtc) { const rep = /repeat\(\s*(\d+)\s*,\s*([\d.]+)fr/.exec(gtc); if (rep) gridCols = Array(+rep[1]).fill(+rep[2]); else { const fr = gtc.match(/([\d.]+)fr/g); if (fr) gridCols = fr.map(parseFloat); } }
  // קריסת-שוליים ב-block Column: השוליים-האנכיים שהוסרו מהילדים נבנים-מחדש כ-SizedBox — פער בין-אחים =
  // max(תחתון-קודם, עליון-נוכחי) (לא סכום, כמו CSS); שוליים-קצה (ראשון-עליון/אחרון-תחתון) נשמרים.
  const hasVM = flowVM.some(Boolean);
  const collapsedCol = () => {
    const kids = []; const mAt = i => flowVM[i] || { mt: 0, mb: 0 };
    if (mAt(0).mt > 0) kids.push(`const SizedBox(height: ${mAt(0).mt})`);
    for (let i = 0; i < flow.length; i++) { if (i > 0) { const g = Math.max(mAt(i - 1).mb, mAt(i).mt); if (g > 0) kids.push(`const SizedBox(height: ${g})`); } kids.push(flow[i]); }
    const lb = mAt(flow.length - 1).mb; if (lb > 0) kids.push(`const SizedBox(height: ${lb})`);
    return kids.join(', ');
  };
  if (flow.length === 0) inner = null;
  else if (flow.length === 1 && !isFlex) { const m = flowVM[0]; inner = (m && (m.mt || m.mb)) ? `Padding(padding: const EdgeInsets.only(top: ${m.mt}, bottom: ${m.mb}), child: ${flow[0]})` : flow[0]; }
  else if (isGrid && gridCols && flow.length > 1 && flow.length <= gridCols.length) inner = `Row(crossAxisAlignment: CrossAxisAlignment.${rowCross}${tb(rowCross)}${listSep}, children: [${flow.map((e, i) => `Expanded(flex: ${Math.max(1, Math.round(gridCols[i] || 1))}, child: ${e})`).join(', ')}])`;
  else if (isFlex && !col && flexWrap) inner = `Wrap(spacing: ${gap || 0}, runSpacing: ${gap || 0}, crossAxisAlignment: WrapCrossAlignment.${rowCross === 'start' ? 'start' : rowCross === 'end' ? 'end' : 'center'}, children: [${flow.join(', ')}])`;
  else if (isFlex && !col) inner = `Row(mainAxisSize: ${rowSize}${majE}, crossAxisAlignment: CrossAxisAlignment.${rowCross}${tb(rowCross)}${listSep}, children: [${flow.join(', ')}])`;
  // מיכל לא-flex עם ילדים inline-level בלבד ⇒ זרימת-inline אמיתית דרך Text.rich (עוטף-שורות +
  // bidi-RTL + baseline) במקום Row (שלא עוטף ⇒ overflow בפסקה). textAlign מהמיכל.
  else if (!isFlex && flowInline) inner = `Text.rich(TextSpan(children: [${flow.map(toRichSpan).join(', ')}])${ta === 'center' ? ', textAlign: TextAlign.center' : ta === 'left' ? ', textAlign: TextAlign.left' : ta === 'right' ? ', textAlign: TextAlign.right' : ''})`;
  else inner = `Column(mainAxisSize: ${colVAuto ? 'MainAxisSize.max' : 'MainAxisSize.min'}, ${colVAuto ? 'mainAxisAlignment: MainAxisAlignment.center, ' : ''}crossAxisAlignment: CrossAxisAlignment.${colCross}${tb(colCross)}${majE}${hasVM ? '' : listSep}, children: [${hasVM ? collapsedCol() : flow.join(', ')}])`;
  // אבסולוטיים ⇒ Stack + Positioned · ה-padding עוטף רק את הזרימה (CSS: absolute יחסי ל-padding-box)
  let noPad = false;
  if (abs.length) {
    const emBase = +(px(effText['font-size']) || 14);
    const pxe = v => { if (v == null) return null; if (/^0(px)?$/.test(String(v).trim())) return '0'; const p = px(v); if (p != null) return p; const em = /(-?\d*\.?\d+)em/.exec(v); return em ? (parseFloat(em[1]) * emBase).toFixed(2) : null; };
    const pos = abs.map(a => {
      const p = [];
      // inset-block = top+bottom (קיצור), inset-block-start/end = top/bottom. בלי זה פס-אקצנט
      // (mrow.sel::before, inset-block:8px) נשאר בלי גובה ⇒ מילא את כל השורה.
      let t = pxe(a.st['top']), b = pxe(a.st['bottom']);
      const ib = a.st['inset-block']; if (ib != null) { const parts = ib.trim().split(/\s+/); if (t == null) t = pxe(parts[0]); if (b == null) b = pxe(parts[1] || parts[0]); }
      if (t == null && a.st['inset-block-start'] != null) t = pxe(a.st['inset-block-start']);
      if (b == null && a.st['inset-block-end'] != null) b = pxe(a.st['inset-block-end']);
      // logical ⇒ physical לפי direction של האלמנט עצמו (לא ההקשר): rtl (ברירת-המחדל) ⇒ inline-start=right ·
      // ltr (למשל המונה ברשימה-ממוספרת, direction:ltr) ⇒ inline-start=left. בלי זה המונה נופל לצד-הלא-נכון.
      const isLtr = /ltr/.test(a.st['direction'] || '');
      let l = pxe(a.st['left']), r = pxe(a.st['right']);
      const iss = a.st['inset-inline-start'] != null ? pxe(a.st['inset-inline-start']) : null;
      const ise = a.st['inset-inline-end'] != null ? pxe(a.st['inset-inline-end']) : null;
      if (isLtr) { if (l == null && iss != null) l = iss; if (r == null && ise != null) r = ise; }
      else { if (r == null && iss != null) r = iss; if (l == null && ise != null) l = ise; }
      if (t != null) p.push(`top: ${t}`); if (b != null) p.push(`bottom: ${b}`); if (l != null) p.push(`left: ${l}`); if (r != null) p.push(`right: ${r}`);
      // abs בלי inset-אנכי + הורה align-items:center ⇒ המיקום-הסטטי ממורכז-אנכית (CSS). בלי זה
      // Positioned(right:X) בלי top מיישר-לראש. פותרים ע"י top:0/bottom:0 + Align(center) על הילד.
      if (t == null && b == null && /center/.test(st['align-items'] || '')) {
        const lr = [l != null ? `left: ${l}` : '', r != null ? `right: ${r}` : ''].filter(Boolean).join(', ');
        return `Positioned(${lr ? lr + ', ' : ''}top: 0, bottom: 0, child: Align(alignment: Alignment.center, child: ${a.e}))`;
      }
      return p.length ? `Positioned(${p.join(', ')}, child: ${a.e})` : `Positioned.fill(child: ${a.e})`;
    });
    const pad = edge(st, 'padding');
    const flowW = pad && inner ? `Padding(padding: ${pad}, child: ${inner})` : inner;
    // מיכל שממרכז-תוכן (grid/place-items:center · align+justify:center) ⇒ ה-Stack מיישר את הילדים
    // הלא-ממוקמים (זרימת-הטקסט) למרכז. בלי זה ברירת-המחדל topStart = RTL ⇒ ימין-למעלה, והטקסט-בזרימה
    // (reveal_card "Label" מעל .rv האבסולוטי) נדבק לימין במקום מרכז. Positioned/Positioned.fill לא מושפעים.
    const _plS = `${st['place-items'] || ''} ${st['place-content'] || ''} ${st['justify-items'] || ''}`;
    const stackCentered = /center/.test(_plS) || (ALIGN[st['align-items']] === 'center' && JUST[st['justify-content']] === 'center');
    // מיכל flex-column עם justify-content:flex-end (+ min-height) ⇒ הזרימה יורדת לתחתית (cover_banner: Label/Meta
    // בתחתית). בלי זה ה-Column (MainAxisSize.min) נשאר בראש-ה-Stack. אופקי מ-align-items (RTL: start=ימין).
    let stackAlign = stackCentered ? 'Alignment.center' : null;
    if (!stackAlign && /column/.test(st['flex-direction'] || '') && JUST[st['justify-content']] === 'end')
      stackAlign = ALIGN[st['align-items']] === 'center' ? 'Alignment.bottomCenter' : ALIGN[st['align-items']] === 'end' ? 'Alignment.bottomLeft' : 'Alignment.bottomRight';
    // סדר-ציור לפי z-index: זרימה (flowW, z=flowMaxZ) מול האבסולוטיים (כל אחד ו-z שלו). מיון-יציב עולה ⇒
    // ברירת-מחדל (הכל z=0) נשמרת [זרימה, abs], אך ילד-זרימה בעל z גבוה (.av z:2) נצבע אחרי abs נמוך (.gap z:0).
    const zItems = (flowW ? [{ w: flowW, z: flowMaxZ }] : []).concat(pos.map((w, i) => ({ w, z: abs[i].z })));
    zItems.forEach((it, i) => (it.i = i));
    zItems.sort((a, b) => a.z - b.z || a.i - b.i);
    inner = `Stack(clipBehavior: Clip.none${stackAlign ? `, alignment: ${stackAlign}` : ''}, children: [${zItems.map(it => it.w).join(', ')}])`;
    // בלוק-במסגרת-בלוק (לא פריט-flex) בלי רוחב-מפורש = מילוי-רוחב-הורה (CSS block) ⇒ Positioned right:0
    // מתיישר לקצה-המיכל (li ברשימה: המספר/הנקודה בשוליים), לא לקצה-הטקסט. פריט-flex (avw) נשאר גודל-תוכן.
    if (!parentFlex && !st['width'] && !/^inline/.test(st['display'] || '')) inner = `SizedBox(width: double.infinity, child: ${inner})`;
    noPad = true;                                       // ה-padding כבר בתוך ה-Stack
  }
  return wrapBox(st, inner, node, noPad, parentFlex, noVMargin);
}

// עוטף ביטוי ב-Container (רקע/מסגרת/צל/מידות/שוליים) + Opacity, לפי הסגנון
const INLINE_TAGS = new Set(['span', 'a', 'em', 'strong', 'b', 'i', 'small', 'code', 'abbr', 'mark', 'sub', 'sup', 'cite', 'q', 's', 'u', 'time', 'kbd', 'samp', 'var', 'label', 'bdi', 'bdo']);
function wrapBox(st, inner, node, noPad, parentFlex = false, noVMargin = false) {
  // אלמנט inline-בזרימה (span/a/em… בלי display-בלוק, ולא פריט-flex/grid) מתעלם מ-width/height ב-CSS.
  // ריק ⇒ מתמוטט ל-0×0 ואינו נצבע (נאמנות-למקור L4: .bar2 .f = span-מילוי inline שלא נראה במקור).
  const dispRaw = (st['display'] || '').trim();
  // position:absolute/fixed מבצע blockification (האלמנט יוצא מזרימת-inline) ⇒ אינו-inline גם אם span.
  const posAbs = /^(absolute|fixed)$/.test((st['position'] || '').trim());
  const effInline = !parentFlex && !posAbs && (dispRaw ? dispRaw === 'inline' : !!(node && INLINE_TAGS.has(node.tag)));
  if (effInline && !inner) return 'const SizedBox.shrink()';
  // inline עם-תוכן ⇒ width/height ושוליים-אנכיים לא-חלים ב-CSS. השמטתם שומרת אותו כ-TextSpan נקי
  // (Container-שוליים היה הופך ל-WidgetSpan ושובר סדר-bidi — Label/Meta התחלפו).
  if (effInline) st = Object.assign({}, st, { width: undefined, height: undefined, margin: undefined, 'margin-top': undefined, 'margin-bottom': undefined });
  const deco = decoration(st), pad = noPad ? null : edge(st, 'padding'), mg = edge(st, 'margin', noVMargin);
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
    // אין ממד-קבוע ⇒ Center מכווץ-לתוכן בשני-הצירים (widthFactor+heightFactor). alignment:center לבדו
    // היה חמדני בהקשר-רופף (Stack/גובה-לא-חסום) ומותח את הקופסה למלוא-הגובה (כפתורי-טאבים ⇒ 600px).
    else inner = `Center(widthFactor: 1.0, heightFactor: 1.0, child: ${inner})`;
  } else if ((w || h) && centered) cp.push('alignment: Alignment.center');
  // שורת-flex עוטפת (‏.mrow avatars: align-items:center · flex-wrap · min-height:88 · בלי justify) ⇒ ה-Wrap
  // מכווץ-לגובה-התוכן ויושב בראש-הרצועה; ‏CSS ממרכז אנכית. הפתרון: גובה-קבוע=min-height + alignment:centerRight
  // ⇒ ממרכז ברצועת-ה-88 (RTL: התחלה=ימין). גובה-קבוע (ולא minHeight+alignment) כי alignment לבדו מתרחב למלוא-
  // הגובה-הלא-חסום של מסגרת-הביקורת. בטוח: כל תוכן-ה-.mrow ≤88. מצומצם ל-flex-wrap+ללא-justify (לא טורים/רוחב-מלא).
  const isMrowCtr = minH != null && !w && !h && !centered && inner &&
    /\bflex\b/.test(st['display'] || '') && (st['flex-direction'] || 'row') !== 'column' &&
    /wrap/.test(st['flex-wrap'] || '') && !/nowrap/.test(st['flex-wrap'] || '') &&
    (!st['justify-content'] || /^(?:flex-)?start$/.test(st['justify-content'])) &&
    ALIGN[st['align-items']] === 'center';
  // טור-flex עם ילד margin אנכי-auto ובלי justify ⇒ גובה-קבוע=min-height כדי שה-Column (max+center מ-emit) ימרכז
  // אנכית ברצועה (‏.ctl segment). גובה-קבוע (לא minHeight) — אחרת ה-max קורס בגובה-לא-חסום של מסגרת-הביקורת.
  const isColVCtr = minH != null && !w && !h && !centered && inner && node &&
    /\bflex\b/.test(st['display'] || '') && (st['flex-direction'] || '') === 'column' && !st['justify-content'] && hasVAutoChild(node);
  if (isMrowCtr) { cp.push(`height: ${minH}`, 'alignment: Alignment.centerRight'); if (minW != null) cp.push(`constraints: const BoxConstraints(minWidth: ${minW})`); }
  else if (isColVCtr) { cp.push(`height: ${minH}`); if (minW != null) cp.push(`constraints: const BoxConstraints(minWidth: ${minW})`); }
  else if (minH != null || minW != null) cp.push(`constraints: const BoxConstraints(${[minH != null ? `minHeight: ${minH}` : '', minW != null ? `minWidth: ${minW}` : ''].filter(Boolean).join(', ')})`);
  if (mg) cp.push(`margin: ${mg}`);
  if (pad) cp.push(`padding: ${pad}`);
  if (deco) cp.push(`decoration: ${deco}`);
  if (deco) { const glow = bgOverlayGlow(st); if (glow) cp.push(`foregroundDecoration: ${glow}`); }   // שכבת-זוהר radial מעל בסיס-linear
  let out;
  if (!cp.length) out = inner || 'const SizedBox.shrink()';
  else { if (inner) cp.push(`child: ${inner}`); out = `Container(${cp.join(', ')})`; }
  // max-width בלי width-קבוע (‏.msg{max-width:74%}) = תקרה בלבד; האלמנט מכווץ-לתוכן. IntrinsicWidth גורם לכיווץ
  // כך שילד-בלוק מלא-רוחב (‏.ts timestamp, display:block) ממלא את הבועה-המכווצת במקום למתוח אותה למלוא-הרוחב.
  if (st['max-width'] && st['max-width'] !== 'none' && !w && !pct(st['width']) && inner) out = `IntrinsicWidth(child: ${out})`;   // max-width:none = ללא-תקרה (מילוי) — לא IntrinsicWidth
  // אלמנט ממוקם-align-self (end/center) בטור-flex = hug-לתוכן. אם הוא מכיל שורת-justify (Row max — חותם-מסירה
  // .ts justify-end בבועת-out) ⇒ בלי IntrinsicWidth הבועה נמתחת למלוא-הרוחב. IntrinsicWidth כובל לרוחב-הילד-הרחב
  // ⇒ שורת-ה-justify מיישרת-לימין בתוכו במקום למתוח. (max-width:none עוקף את הסעיף-הקודם ⇒ נדרש כאן בנפרד.)
  else if (['end', 'center'].includes(ALIGN[st['align-self']]) && !w && !pct(st['width']) && inner && !/^IntrinsicWidth/.test(out)) out = `IntrinsicWidth(child: ${out})`;
  // CSS aspect-ratio (‏.ph{aspect-ratio:1/1} · .ph.wide{16/9}) — בלי זה האריח קרס לגובה-התוכן (438→250) והצורה
  // והאייקון יצאו שגויים. עוטפים ב-AspectRatio (מקבל רוחב-חסום מהבלוק ⇒ מחשב גובה). רק כשאין גובה-קבוע.
  const arRaw = st['aspect-ratio'];
  if (arRaw && !h) { const am = arRaw.trim().match(/^([\d.]+)\s*(?:\/\s*([\d.]+))?$/); if (am) { const ar = am[2] ? (+am[1] / +am[2]) : +am[1]; if (ar > 0) out = `AspectRatio(aspectRatio: ${ar.toFixed(4)}, child: ${out})`; } }
  // backdrop-filter: blur ⇒ ClipRRect + BackdropFilter (זכוכית אמיתית)
  const bf = st['backdrop-filter'] || st['-webkit-backdrop-filter'];
  if (bf && /blur/.test(bf) && cp.length) { const rad = /%|999/.test(st['border-radius'] || '') ? '999' : (px(st['border-radius']) || '0'); const bl = px(bf) || '12'; out = `ClipRRect(borderRadius: BorderRadius.circular(${rad}), child: BackdropFilter(filter: ImageFilter.blur(sigmaX: ${bl}, sigmaY: ${bl}), child: ${out}))`; }
  const op = st['opacity'] != null ? parseFloat(st['opacity']) : null;
  if (op != null && !isNaN(op) && op < 1) out = `Opacity(opacity: ${op}, child: ${out})`;
  // רוחב/גובה יחסי חלקי (%<100) ⇒ FractionallySizedBox · יישור-התחלה RTL = ימין (סקלטון/מילוי-בר).
  // 100% מדלגים — הוא ממילא ממלא (עטיפה תשבש מרכוז grid/place-items).
  const wp = pct(st['width']), hp = pct(st['height']);
  const wpct = wp && +wp < 1 ? wp : null, hpct = hp && +hp < 1 ? hp : null;
  if (wpct || hpct) out = `FractionallySizedBox(${wpct ? `widthFactor: ${wpct}, ` : ''}${hpct ? `heightFactor: ${hpct}, ` : ''}alignment: Alignment.centerRight, child: ${out})`;
  // width:100% ⇒ מילוי-רוחב-מלא גם בטור-ממורכז (align-items:center לא מותח) — SizedBox אינסופי, לא FractionallySizedBox
  else if (wp === '1.000' && !w) out = `SizedBox(width: double.infinity, child: ${out})`;
  // אלמנט-בלוק (track) עם ילד-אחוז ישיר (FractionallySizedBox) וללא רוחב מפורש ⇒ מילוי-רוחב-מלא,
  // כדי שהאחוז יימדד מול הרוחב-המלא של האב (CSS: track=block width:auto=מלא, fill=% ממנו). בלי זה
  // ה-Container מתכווץ לרוחב-המילוי והרקע/מסגרת של ה-track נעלמים מהחלק-הריק.
  else if (!w && !effInline && /^FractionallySizedBox\(/.test((inner || '').trim())) out = `SizedBox(width: double.infinity, child: ${out})`;
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
  // דגל-קשת (largeArc/sweep) = ספרה-בודדת 0/1 · ה-SVG מתיר צמידות ("00-3-3") ⇒ הטוקנייזר מיזג ל"00";
  // קולפים תו-אחד ומשאירים את השארית לטוקן הבא (בלי זה קשת-מעוגלת בעיפרון/אייקון נשברת ⇒ אייקון-ריק).
  double fl() { final tok = t[i]; if (tok.length <= 1) { i++; return double.parse(tok); } t[i] = tok.substring(1); return double.parse(tok[0]); }
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
      case 'A': { double rx = n(), ry = n(), rot = n(), laf = fl(), sf = fl(), x = n(), y = n(); if (rel) { x += cx; y += cy; } path.arcToPoint(Offset(x, y), radius: Radius.elliptical(rx, ry), rotation: rot, largeArc: laf != 0, clockwise: sf != 0); cx = x; cy = y; break; }
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

// ───────────────────────── ייצוא לכלי-הביקורת (pixel-forge-audit) ─────────────────────────
// מנוע-הביקורת מייבא את אותה חציבת-תאים (מקור-אמת יחיד) כדי למסגר ORIG בדיוק כמו ה-FORGE.
export { cells, theaterStates, pascal, snake, PURE, OUT, parseStyle, styleOf, parseDOM, INLINE_TAGS };
const familiesOf = () => fs.readdirSync(PURE).filter(f => /-family\.html$/.test(f)).map(f => f.replace('-family.html', '')).sort();
export { familiesOf };

// ───────────────────────── main (רק בהרצה-ישירה, לא ב-import) ─────────────────────────
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const all = familiesOf();
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
}
