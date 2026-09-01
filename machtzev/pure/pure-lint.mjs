#!/usr/bin/env node
// pure-lint — deterministic gate for the PURE visual-spec BYTE rules.
// Encodes exactly the checkable half of PURE-SPEC.md (§0/§1/§2/§5) so verification
// is repeatable and permanent, instead of a one-off prose swarm ("bytes-not-prose").
// The perceptual residue (Flat≠Elevated by eye, identifiable-without-name, morph-look)
// is NOT judged here — that is the only place an eye/render is still required.
//
//   node pure-lint.mjs            # lint every *-family.html + index.html
//   node pure-lint.mjs foo.html   # lint specific files
// Exit 1 if any BLOCKER; 0 otherwise (MAJOR/MINOR are reported, non-fatal).

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SEMANTIC = ['--ok', '--warn', '--err'];            // §1 fixed, must never morph
const ACCENT = ['--a', '--a-hi', '--a-800', '--gl', '--c2', '--c3']; // §1 morph set
// §0 hard bans in rendered CONTENT (after stripping style/script/svg/comments/tags):
const CURRENCY = /[₪€]/;                                  // blocker
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{FE0F}]/u;           // true emoji pictographs → blocker
const GLYPH_ICONS = /[⌄‹›★☆▲▼◂▸«»➤➜●○◆■]/; // misc-symbol glyphs used as icons → should be SVG (minor)

function stripToContent(html) {
  return html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
    .replace(/<[^>]+>/g, ' ');
}
function styleBlocks(html) {
  return [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
    .map(m => m[1]).join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');  // drop CSS comments so selectors stay clean
}
// leaf CSS rules only (bodies with no nested braces) — naturally skips @media/@keyframes wrappers
function leafRules(css) {
  return [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)].map(m => ({ sel: m[1].trim(), body: m[2] }));
}
function pxOf(body, prop) {
  const re = new RegExp('(?:^|[;{\\s])' + prop + '\\s*:\\s*(\\d+(?:\\.\\d+)?)px', 'i');
  const m = body.match(re);
  return m ? parseFloat(m[1]) : null;
}
function lineOf(html, idx) { return html.slice(0, idx).split('\n').length; }

function lint(file) {
  const html = fs.readFileSync(file, 'utf8');
  const css = styleBlocks(html);
  const F = [];
  const add = (sev, rule, msg) => F.push({ sev, rule, msg });

  // ── §1 file requirements ──────────────────────────────────────────────
  if (!/<meta\s+charset=["']?utf-8/i.test(html)) add('BLOCKER', '§1', 'missing <meta charset="utf-8">');
  if (!/name=["']viewport["']/i.test(html)) add('MAJOR', 'spec', 'missing viewport meta');
  const hasMotion = /@keyframes|animation\s*:|transition\s*:/i.test(css);
  if (hasMotion && !/prefers-reduced-motion/i.test(css))
    add('MAJOR', '§1/§5', 'animation/transition present but no prefers-reduced-motion kill');

  // ── §1 tokens: semantic used-but-undefined (broken ref) + never inside a theme block ──
  for (const t of SEMANTIC) {
    const def = new RegExp(t.replace(/[-]/g, '\\-') + '\\s*:').test(css);
    const used = new RegExp('var\\(\\s*' + t.replace(/[-]/g, '\\-')).test(css);
    if (used && !def) add('MAJOR', '§1', `semantic token ${t} referenced via var() but never defined`);
  }
  // theme blocks = selectors containing .t-  (accent-morph classes)
  const themeRules = leafRules(css).filter(r => /\.t-[a-z]/i.test(r.sel));
  for (const r of themeRules) {
    for (const t of [...SEMANTIC, '--gold'])
      if (new RegExp(t.replace(/[-]/g, '\\-') + '\\s*:').test(r.body))
        add('BLOCKER', '§1', `semantic ${t} redefined inside theme block "${r.sel}" — would morph on theme switch`);
  }
  if (themeRules.length) {
    for (const a of ACCENT)
      if (!themeRules.some(r => new RegExp(a.replace(/[-]/g, '\\-') + '\\s*:').test(r.body)))
        add('MINOR', '§1', `accent token ${a} missing from theme block(s)`);
  }

  // ── §0 forbidden content (rendered text only) ─────────────────────────
  const content = stripToContent(html);
  const scan = (re, sev, label) => {
    const m = content.match(re);
    if (m) add(sev, '§0', `${label}: "${m[0]}" in rendered content`);
  };
  scan(CURRENCY, 'BLOCKER', 'currency symbol');
  scan(EMOJI, 'BLOCKER', 'emoji-as-icon (SVG only)');
  scan(GLYPH_ICONS, 'MINOR', 'glyph used as icon (should be inline SVG)');

  // ── §2/§5 interactive target size (text control ≥44px; square icon ≥40px) ──
  for (const r of leafRules(css)) {
    if (!/cursor\s*:\s*pointer/i.test(r.body)) continue;
    if (/input\[type=(range|checkbox|radio)\]/i.test(r.sel)) continue; // native control: own hit model
    const h = pxOf(r.body, 'min-height') ?? pxOf(r.body, 'height');
    if (h == null) continue;                       // padding-sized: not statically checkable
    const w = pxOf(r.body, 'width');
    const square = w != null && w === h;           // square icon button → icon floor 40; else text floor 44
    const floor = square ? 40 : 44;
    if (h < floor) add('MAJOR', '§5', `"${r.sel}" target ${h}px < ${floor}px`);
  }
  return F;
}

const targets = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(DIR).filter(f => /(-family|^index)\.html$/.test(f)).sort().map(f => path.join(DIR, f));

let blockers = 0, majors = 0, minors = 0;
for (const file of targets) {
  const F = lint(file);
  const b = F.filter(x => x.sev === 'BLOCKER').length;
  const mj = F.filter(x => x.sev === 'MAJOR').length;
  const mn = F.filter(x => x.sev === 'MINOR').length;
  blockers += b; majors += mj; minors += mn;
  const tag = b ? '✗ BLOCKER' : mj ? '⚠ MAJOR' : mn ? '· minor' : '✓ clean';
  console.log(`\n${tag}  ${path.basename(file)}  (${b}B/${mj}M/${mn}m)`);
  for (const x of F) console.log(`    [${x.sev}] ${x.rule}  ${x.msg}`);
}
console.log(`\n── pure-lint: ${targets.length} files · ${blockers} blocker · ${majors} major · ${minors} minor ──`);
process.exit(blockers ? 1 : 0);
