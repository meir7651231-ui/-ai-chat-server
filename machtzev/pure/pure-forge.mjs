#!/usr/bin/env node
/** 🏭 מנוע-החישול (pure-forge) — ממיר את שפת-Pure מה-HTML (מקור-האמת) לאטומי-Dart seam-aware.
 *  לא מצייר, לא ממציא: קורא את חוקי-ה-CSS + מבנה-הקומפוננטה מ-machtzev/pure/<family>-family.html,
 *  ממפה CSS-var ⇒ skin/theme/fonts (הזרע היחיד pure-look), ופולט widget שקורא DsSeam (כלל-הזהב).
 *  שימוש: node machtzev/pure/pure-forge.mjs <family> [--write]   ·   אימות: flutter analyze.
 *  אפס-מילון-דומייני · המבנה נגזר מה-HTML · חוק-7 (בלי PureScope נופל ל-DsPure.skin). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = new URL('../../', import.meta.url).pathname;
const PDIR = path.join(ROOT, 'machtzev/pure');
const OUT = path.join(ROOT, 'new/dart-ui-bs/forged');

// ── CSS-var ⇒ ביטוי-Dart (מהזרע pure-look — נייטרל/סמנטי=skin · אקצנט=theme · פונט=fonts) ──
const VAR = {
  canvas: 'skin.canvas', sunken: 'skin.sunken', surface: 'skin.surface', raised: 'skin.raised', 'raised2': 'skin.raised2',
  ink: 'skin.ink', mut: 'skin.mut', faint: 'skin.faint', hair: 'skin.hair', 'hair2': 'skin.hair2',
  ok: 'skin.ok', warn: 'skin.warn', err: 'skin.err', gold: 'skin.gold',
  a: 'theme.a', 'a-hi': 'theme.aHi', 'a-800': 'theme.a800', 'c2': 'theme.c2', 'c3': 'theme.c3', gl: 'theme.gl',
  he: 'fonts.he', grotesk: 'fonts.grotesk', serif: 'fonts.serif', serifHe: 'fonts.serifHe',
};
const cssVar = (v) => { const m = String(v).match(/var\(--([a-z0-9-]+)\)/); return m && VAR[m[1]] ? VAR[m[1]] : null; };
const usedSeam = new Set(); // אילו ערוצים נצרכו (skin/theme/fonts) ⇒ לקרוא רק מה שצריך
const asColor = (v) => { const d = cssVar(v); if (d) { usedSeam.add(d.split('.')[0]); return d; } const h = String(v).match(/#([0-9a-fA-F]{6})/); return h ? `const Color(0xFF${h[1].toUpperCase()})` : null; };
const asFont = (v) => { const d = cssVar(v); if (d) { usedSeam.add('fonts'); return d; } return null; };

// ── פרסור <style> ⇒ {class: {prop:val}} ──
function parseCss(html) {
  const style = (html.match(/<style>([\s\S]*?)<\/style>/) || [])[1] || '';
  const map = {};
  for (const m of style.matchAll(/\.([a-z][a-z0-9_-]*)\s*\{([^}]*)\}/g)) {
    const props = {};
    for (const d of m[2].split(';')) { const [k, ...r] = d.split(':'); if (k && r.length) props[k.trim()] = r.join(':').trim(); }
    map[m[1]] = { ...(map[m[1]] || {}), ...props };
  }
  return map;
}

// ── חוקי-סגנון ⇒ TextStyle-Dart ──
function textStyle(p) {
  const parts = [];
  const c = p['color'] && asColor(p['color']); if (c) parts.push(`color: ${c}`);
  const f = p['font-family'] && asFont(p['font-family']); if (f) parts.push(`fontFamily: ${f}`);
  const sz = p['font-size'] && p['font-size'].match(/([\d.]+)px/); if (sz) parts.push(`fontSize: ${sz[1]}`);
  const w = p['font-weight']; if (w) parts.push(`fontWeight: FontWeight.w${w === 'bold' ? 700 : w}`);
  const ls = p['letter-spacing'] && p['letter-spacing'].match(/(-?[\d.]+)/); if (ls && p['letter-spacing'].includes('px')) parts.push(`letterSpacing: ${ls[1]}`);
  if (/uppercase/.test(p['text-transform'] || '')) parts._upper = true;
  const style = parts.length ? `TextStyle(${parts.join(', ')})` : null;
  return { style, upper: !!parts._upper, ltr: /ltr/.test(p['direction'] || '') };
}

// ── חוקי-סגנון ⇒ BoxDecoration (משטח/כרטיס) ──
function boxDeco(p) {
  const parts = [];
  const bgVar = (p['background'] || p['background-color'] || '').match(/var\(--([a-z0-9-]+)\)/);
  if (bgVar && VAR[bgVar[1]]) { usedSeam.add(VAR[bgVar[1]].split('.')[0]); parts.push(`color: ${VAR[bgVar[1]]}`); }
  const rad = (p['border-radius'] || '').match(/([\d.]+)px/); if (rad) parts.push(`borderRadius: BorderRadius.circular(${rad[1]})`);
  const bord = (p['border'] || '').match(/var\(--([a-z0-9-]+)\)/); if (bord && VAR[bord[1]]) { usedSeam.add(VAR[bord[1]].split('.')[0]); parts.push(`border: Border.all(color: ${VAR[bord[1]]})`); }
  return parts.length ? `BoxDecoration(${parts.join(', ')})` : null;
}
const padOf = (p) => { const m = (p['padding'] || '').match(/([\d.]+)px(?:\s+([\d.]+)px)?/); if (!m) return null; return m[2] ? `const EdgeInsets.symmetric(vertical: ${m[1]}, horizontal: ${m[2]})` : `const EdgeInsets.all(${m[1]})`; };

// ── פרסור markup — בורא-DOM מבוסס-מחסנית (מודע-קינון; div-בתוך-div נכון) ──
const VOID = new Set(['br', 'hr', 'img', 'input', 'path', 'meta', 'link', 'use', 'circle', 'rect', 'line', 'polyline', 'polygon']);
function parseTree(html) {
  const root = { tag: '#root', cls: [], text: '', children: [] };
  const stack = [root];
  const re = /<(\/?)([\w-]+)((?:"[^"]*"|'[^']*'|[^'">])*?)(\/?)>|([^<]+)/g;
  let m, guard = 0;
  while ((m = re.exec(html)) && guard++ < 20000) {
    const [, close, tag, attrs = '', selfClose, text] = m;
    if (text != null) { const t = text.replace(/\s+/g, ' ').trim(); if (t) stack[stack.length - 1].text += (stack[stack.length - 1].text ? ' ' : '') + t; continue; }
    if (close) { for (let i = stack.length - 1; i > 0; i--) { if (stack[i].tag === tag) { stack.length = i; break; } } continue; }
    const cls = (attrs.match(/class="([^"]*)"/) || [])[1] || '';
    const node = { tag, cls: cls.split(/\s+/).filter(Boolean), text: '', children: [] };
    stack[stack.length - 1].children.push(node);
    if (!selfClose && !VOID.has(tag)) stack.push(node);
  }
  return root;
}
const parseNodes = (html) => parseTree(html).children; // תאימות-אחורה: ילדי-השורש
const escDart = (s) => "'" + String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/\$/g, '\\$') + "'";

// ── קומפוננטה ⇒ Dart widget-tree (מודע-עץ: div.card ⇒ Container · flex ⇒ Row · עלה-טקסט ⇒ Text) ──
function nodeToDart(node, css, depth = 0) {
  if (depth > 8) return null;
  const p = node.cls.map((c) => css[c] || {}).reduce((a, b) => ({ ...a, ...b }), {});
  const isFlex = /flex/.test(p['display'] || '') || node.cls.includes('row') || node.cls.includes('main');
  const svg = node.tag === 'svg' || node.children.some((c) => c.tag === 'path'); // אייקון ⇒ placeholder
  if (svg) { usedSeam.add('skin'); return `Icon(Icons.circle_outlined, size: 16, color: skin.mut)`; }
  // עלה-טקסט (עלה עם טקסט ובלי ילדי-אלמנט)
  if (!node.children.length && /[A-Za-z֐-׿0-9]/.test(node.text)) {
    const { style } = textStyle(p);
    return `Text(${escDart(node.text.replace(/&[a-z]+;/g, ' '))}${style ? `, style: ${style}` : ''})`;
  }
  const kids = node.children.map((c) => nodeToDart(c, css, depth + 1)).filter(Boolean);
  // טקסט-משולב-בקומפוזיט (טקסט + ילדים) ⇒ הוסף כ-Text ראשון
  if (/[A-Za-z֐-׿0-9]/.test(node.text)) { const { style } = textStyle(p); kids.unshift(`Text(${escDart(node.text.replace(/&[a-z]+;/g, ' '))}${style ? `, style: ${style}` : ''})`); }
  let w;
  if (!kids.length) w = `const SizedBox.shrink()`;
  else if (isFlex) w = `Row(mainAxisSize: MainAxisSize.min, children: [${kids.join(', ')}])`;
  else if (kids.length > 1) w = `Column(crossAxisAlignment: CrossAxisAlignment.start, mainAxisSize: MainAxisSize.min, children: [${kids.join(', ')}])`;
  else w = kids[0];
  const deco = boxDeco(p); const pad = padOf(p);
  if (deco || pad) w = `Container(${pad ? `padding: ${pad}, ` : ''}${deco ? `decoration: ${deco}, ` : ''}child: ${w})`;
  return w;
}
// חיפוש-רקורסיבי לקומפוננטה-הקנונית — היוריסטיקה מבנית (עיוור-משפחה):
// משטח-מעוצב (border/background + radius) עם ילדים, שאינו כרום-עליון (bar/seg/toolbar).
const CHROME = new Set(['bar', 'seg', 'toolbar', 'mk', 'ind', 'tick', 'wrap', 'page', 'body']);
function isSurface(node, css) {
  if (CHROME.has(node.cls[0] || '')) return false;
  const p = node.cls.map((c) => css[c] || {}).reduce((a, b) => ({ ...a, ...b }), {});
  const styled = /var\(--/.test((p['border'] || '') + (p['background'] || '') + (p['background-color'] || '')) && /radius/.test(p['border-radius'] || 'radius') ;
  return styled && node.children.length >= 1;
}
function findCanon(node, css) {
  if (/^(row|list|card|surface|tile|panel|item)$/.test(node.cls[0] || '') && node.children.length) return node;
  for (const c of node.children) { const f = findCanon(c, css); if (f) return f; }
  if (isSurface(node, css)) return node;
  for (const c of node.children) { if (isSurface(c, css)) return c; }
  return null;
}

export function forgeFamily(family, write = false) {
  const html = fs.readFileSync(path.join(PDIR, `${family}-family.html`), 'utf8');
  const css = parseCss(html);
  // הקומפוננטה-הקנונית = הראשונה מסוג .row / .list / .card בגוף
  const body = (html.match(/<body[^>]*>([\s\S]*)<\/body>/) || [])[1] || html;
  const canon = findCanon(parseTree(body), css);
  if (!canon) return { ok: false, reason: `אין קומפוננטה-קנונית ב-${family}` };
  usedSeam.clear();
  const tree = nodeToDart(canon, css);
  const cls = 'Forged' + family.replace(/(^|[-_])([a-z])/g, (_, __, c) => c.toUpperCase());
  const reads = [...usedSeam].sort().map((ch) => ch === 'skin' ? '    final skin = DsSeam.skinOf(context);' : ch === 'theme' ? '    final theme = DsSeam.of(context);' : '    final fonts = DsSeam.fontsOf(context);').join('\n');
  const code = `// 🏭 חושל ע"י pure-forge ממקור-האמת machtzev/pure/${family}-family.html — seam-aware, אל תערוך ידנית.
import 'package:flutter/material.dart';
import '../ds/ds_seam.dart';

class ${cls} extends StatelessWidget {
  const ${cls}({super.key});
  @override
  Widget build(BuildContext context) {
${reads || '    // אין תלות-חריץ'}
    return ${tree};
  }
}
`;
  if (write) { fs.mkdirSync(OUT, { recursive: true }); fs.writeFileSync(path.join(OUT, `forged_${family}.dart`), code); }
  return { ok: true, cls, code, seam: [...usedSeam] };
}

if (import.meta.url === 'file://' + process.argv[1]) {
  const fam = process.argv[2]; const write = process.argv.includes('--write');
  if (!fam) { console.error('שימוש: node pure-forge.mjs <family> [--write]'); process.exit(1); }
  const r = forgeFamily(fam, write);
  if (!r.ok) { console.error('🔴 ' + r.reason); process.exit(2); }
  console.log(`🏭 חושל ${r.cls} · ערוצי-חריץ: ${r.seam.join('+') || 'אין'}${write ? ' · נכתב ל-forged/' : ''}`);
  if (!write) console.log(r.code);
}
