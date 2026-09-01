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
function fontExpr(val) {
  const m = val && val.match(/var\(--(serif|serifHe|grotesk|he)\)/);
  return m ? `fonts.${FONT[m[1]]}` : null;
}
const px = v => { const m = v && String(v).match(/(-?\d+(?:\.\d+)?)px/); return m ? m[1] : null; };
const num = v => { const m = v && String(v).match(/-?\d+(?:\.\d+)?/); return m ? m[0] : null; };

// ───────────────────────── פרסר-CSS (תת-קבוצה) ─────────────────────────
// מפה שטוחה: מחלקה-בודדת ⇒ מיזוג-כללים. סלקטורים מורכבים (.a .b / .a.b / [x]) מדולגים לפשטות.
function parseStyle(css) {
  const map = {};                              // class → {prop:val}
  css = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const re = /([^{}]+)\{([^{}]*)\}/g; let m;
  while ((m = re.exec(css))) {
    const sels = m[1].split(',').map(s => s.trim());
    const decl = {};
    for (const d of m[2].split(';')) {
      const i = d.indexOf(':'); if (i < 0) continue;
      decl[d.slice(0, i).trim()] = d.slice(i + 1).trim();
    }
    for (const sel of sels) {
      const mm = sel.match(/^\.([a-z0-9-]+)$/i);   // מחלקה-בודדת בלבד
      if (!mm) continue;
      map[mm[1]] = Object.assign(map[mm[1]] || {}, decl);
    }
  }
  return map;
}
// מיזוג-סגנון לאלמנט לפי כל מחלקותיו
function styleOf(classes, map) {
  const s = {};
  for (const c of classes) if (map[c]) Object.assign(s, map[c]);
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
  const bg = colorExpr(st['background'] || st['background-color']);
  if (bg) parts.push(`color: ${bg}`);
  const br = st['border'];
  if (br) { const bc = colorExpr(br); if (bc) parts.push(`border: Border.all(color: ${bc}${/\b2px\b/.test(br) ? ', width: 2' : ''})`); }
  const rad = st['border-radius'];
  if (rad) { const r = /999/.test(rad) ? '999' : (px(rad) || num(rad)); if (r) parts.push(`borderRadius: BorderRadius.circular(${r})`); }
  return parts.length ? `BoxDecoration(${parts.join(', ')})` : null;
}
function padExpr(st) {
  const p = st['padding']; if (!p) return null;
  const ns = p.trim().split(/\s+/).map(x => px(x) || num(x) || '0');
  if (ns.length === 1) return `const EdgeInsets.all(${ns[0]})`;
  if (ns.length === 2) return `const EdgeInsets.symmetric(vertical: ${ns[0]}, horizontal: ${ns[1]})`;
  const [t, r, b = t, l = r] = ns;
  return `const EdgeInsets.fromLTRB(${l}, ${t}, ${r}, ${b})`;
}
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

// אלמנט ⇒ ביטוי-widget. עלה-טקסט ⇒ Text; מיכל ⇒ Container(+Row/Column). svg ⇒ אייקון-פלייסהולדר.
function emit(node, map, depth = 0) {
  if (depth > 14) return 'const SizedBox.shrink()';
  if (node.tag === 'svg') return '_icon(skin.mut)';             // אייקון ניטרלי (SVG לא מתורגם)
  if (node.tag === 'input') {
    const ph = node.attrs.placeholder || node.attrs.value || 'Label';
    return `Text(${dq(ph)}, style: TextStyle(color: skin.faint, fontFamily: fonts.he, fontSize: 13))`;
  }
  const st = styleOf(node.classes, map);
  const kids = elemChildren(node);
  const txt = textOf(node);

  // עלה עם טקסט בלבד ⇒ Text
  if (!kids.length && txt) {
    const ts = textStyle(st);
    return `Text(${dq(txt)}${ts.length ? `, style: TextStyle(${ts.join(', ')})` : ''})`;
  }
  // בונה ילדים
  const childExprs = [];
  for (const c of node.children) {
    if (c.text != null) { const t = c.text.trim(); if (t) childExprs.push(`Text(${dq(t)}, style: TextStyle(color: skin.ink, fontFamily: fonts.he))`); }
    else if (c.tag === 'br') continue;
    else childExprs.push(emit(c, map, depth + 1));
  }
  let inner;
  const disp = st['display'] || '', fd = st['flex-direction'] || '';
  const gap = px(st['gap']);
  const listSep = gap ? `, spacing: ${gap}` : '';   // Flutter 3.24+ Row/Column spacing
  if (childExprs.length === 0) inner = null;
  else if (childExprs.length === 1 && !/flex/.test(disp)) inner = childExprs[0];
  else if (/flex/.test(disp) && !/column/.test(fd))
    inner = `Row(mainAxisSize: MainAxisSize.min${listSep}, children: [${childExprs.join(', ')}])`;
  else
    inner = `Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min${listSep}, children: [${childExprs.join(', ')}])`;

  const deco = decoration(st), pad = padExpr(st);
  if (!deco && !pad) return inner || 'const SizedBox.shrink()';
  const cp = [];
  if (pad) cp.push(`padding: ${pad}`);
  if (deco) cp.push(`decoration: ${deco}`);
  if (inner) cp.push(`child: ${inner}`);
  return `Container(${cp.join(', ')})`;
}

// ───────────────────────── חציבת-תאים ⇒ אטומים ─────────────────────────
const snake = s => s.replace(/[^A-Za-z0-9]+/g, '_').replace(/([a-z0-9])([A-Z])/g, '$1_$2').replace(/^_+|_+$/g, '').toLowerCase();
const pascal = s => s.replace(/[^A-Za-z0-9]+/g, ' ').trim().split(/\s+/).map(w => w[0].toUpperCase() + w.slice(1)).join('');

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
// אייקון-פלייסהולדר ניטרלי (SVG המקורי אינו מתורגם — נשמר כתצורה, לא כפיקסל)
Widget _icon(Color c) => Icon(Icons.circle_outlined, size: 15, color: c);
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
    const dom = parseDOM(c.body);
    let bodyExpr;
    try { bodyExpr = emit(dom, map); } catch { bodyExpr = 'const SizedBox.shrink()'; }
    // הכרז רק על מה שבשימוש (למניעת unused_local_variable / unused_element)
    const useSkin = /\bskin\./.test(bodyExpr), useTheme = /\btheme\./.test(bodyExpr);
    const useFonts = /\bfonts\./.test(bodyExpr), useIcon = /_icon\(/.test(bodyExpr);
    const decls = [
      useSkin && '    final skin = DsSeam.skinOf(context);   // מלוא-העיצוב מהחריץ',
      useTheme && '    final theme = DsSeam.of(context);       // אקצנט (מורף)',
      useFonts && '    final fonts = DsSeam.fontsOf(context);  // פונט',
    ].filter(Boolean).join('\n');
    const src = HEADER(fam, useSkin || useTheme || useFonts || useIcon) + (useIcon ? ICON : '') + `
/// ${c.name} — seam:${c.seam}
class ${cls} extends StatelessWidget {
  const ${cls}({super.key});
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
