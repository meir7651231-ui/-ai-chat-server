#!/usr/bin/env node
// pure-lint — deterministic gate for the PURE visual-spec, pushed to its byte maximum.
// Encodes every CHECKABLE rule of PURE-SPEC.md (§0/§1/§2/§5) so verification is
// repeatable, zero-token, and permanent — "bytes-not-prose". Anything genuinely
// perceptual (Flat≠Elevated by eye, identifiable-without-name, the morph *look*) is
// deliberately NOT judged here; that thin residue is the only place a render+eye remains.
//
//   node pure-lint.mjs [files...]   # default: every *-family.html + index.html
//   --strict                        # exit 1 on MAJOR too (gate mode), not only BLOCKER
//   --json                          # machine-readable findings
//
// Checks: charset/viewport · reduced-motion present+neutralizes animation · neutral &
// semantic tokens fixed (never inside .t-*) · accent tokens present per theme · token
// used-but-undefined · WCAG contrast of ink/mut/faint + per-theme accent-link · currency
// & emoji in content (blocker) · glyph-as-icon (minor) · numbers-without-tnum · target
// size ≥44 (square-icon ≥40) · focus-visible coverage · keyboard-operable clickable div/li
// · aria-invalid⇄role=alert pairing · pill indicator uses getBoundingClientRect.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const ARGV = process.argv.slice(2);
const STRICT = ARGV.includes('--strict');
const JSON_OUT = ARGV.includes('--json');
const FILES_IN = ARGV.filter(a => !a.startsWith('--'));

const NEUTRAL = ['--canvas', '--sunken', '--surface', '--raised', '--raised2', '--ink', '--mut', '--faint', '--hair', '--hair2'];
const SEMANTIC = ['--ok', '--warn', '--err', '--gold'];  // §1 fixed — must never morph
const ACCENT = ['--a', '--a-hi', '--a-800', '--gl', '--c2', '--c3']; // §1 morph set
const CURRENCY = /[₪€]/;                                  // §0 blocker
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{FE0F}]/u;           // true emoji pictographs → blocker
const GLYPH_ICONS = /[⌄‹›★☆▲▼◂▸«»➤➜●○◆■]/;       // misc-symbol glyph used as icon → SVG (minor)

// ── helpers ───────────────────────────────────────────────────────────
const stripToContent = h => h
  .replace(/<!--[\s\S]*?-->/g, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<svg[\s\S]*?<\/svg>/gi, ' ')
  .replace(/<[^>]+>/g, ' ');
const styleCss = h => [...h.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)]
  .map(m => m[1]).join('\n').replace(/\/\*[\s\S]*?\*\//g, '');
const scriptJs = h => [...h.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]).join('\n');
const leafRules = css => [...css.matchAll(/([^{}]+)\{([^{}]+)\}/g)].map(m => ({ sel: m[1].trim(), body: m[2] }));
const pxOf = (body, prop) => { const m = body.match(new RegExp('(?:^|[;{\\s])' + prop + '\\s*:\\s*(\\d+(?:\\.\\d+)?)px', 'i')); return m ? parseFloat(m[1]) : null; };
const has = (str, tok) => new RegExp('var\\(\\s*' + tok.replace(/-/g, '\\-') + '\\b').test(str);
const defd = (str, tok) => new RegExp(tok.replace(/-/g, '\\-') + '\\s*:').test(str);

// WCAG relative luminance + contrast — deterministic, no eye needed
function lum(hex) {
  let c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map(x => x + x).join('');
  const ch = [0, 2, 4].map(i => parseInt(c.slice(i, i + 2), 16) / 255)
    .map(v => v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}
const contrast = (a, b) => { const x = lum(a), y = lum(b); const hi = Math.max(x, y), lo = Math.min(x, y); return (hi + 0.05) / (lo + 0.05); };
const tokMap = body => { const m = {}; for (const x of body.matchAll(/(--[a-z0-9-]+)\s*:\s*(#[0-9a-fA-F]{3,8})/gi)) m[x[1]] = x[2]; return m; };

// ── the linter ────────────────────────────────────────────────────────
function lint(file) { return lintHtml(fs.readFileSync(file, 'utf8')); }
function lintHtml(html) {
  const css = styleCss(html), js = scriptJs(html), content = stripToContent(html);
  const rules = leafRules(css);
  const F = [];
  const add = (sev, rule, msg) => F.push({ sev, rule, msg });

  // §1 file requirements
  if (!/<meta\s+charset=["']?utf-8/i.test(html)) add('BLOCKER', '§1', 'missing <meta charset="utf-8">');
  if (!/name=["']viewport["']/i.test(html)) add('MAJOR', 'spec', 'missing viewport meta');

  // §1/§5 motion: keyframe/animation present → reduced-motion must neutralize it
  // (bare CSS transitions like a theme-color fade are exempt: §1 kills pulse/shimmer/flip/float/blink)
  if (/@keyframes|animation\s*:/i.test(css)) {
    const rm = css.match(/@media[^{]*prefers-reduced-motion[^{]*\{([\s\S]*?\})\s*\}/i);
    if (!rm) add('MAJOR', '§1/§5', 'animation/transition present but no prefers-reduced-motion block');
    else if (!/animation\s*:\s*none/i.test(rm[1])) add('MINOR', '§1/§5', 'reduced-motion block does not set animation:none');
  }

  // §1 tokens: neutral+semantic must be FIXED (never inside a .t-* theme block)
  const themeRules = rules.filter(r => /\.t-[a-z]/i.test(r.sel));
  for (const r of themeRules)
    for (const t of [...NEUTRAL, ...SEMANTIC])
      if (defd(r.body, t)) add('BLOCKER', '§1', `fixed token ${t} redefined inside theme block "${r.sel}" — it would morph on theme switch`);
  // accent set present in each theme block
  if (themeRules.length)
    for (const a of ACCENT)
      if (!themeRules.some(r => defd(r.body, a))) add('MINOR', '§1', `accent token ${a} missing from theme block(s)`);
  // used-but-undefined (broken var reference)
  for (const t of [...NEUTRAL, ...SEMANTIC, ...ACCENT])
    if (has(css, t) && !defd(css, t) && !themeRules.some(r => defd(r.body, t)))
      add('MAJOR', '§1', `${t} referenced via var() but never defined`);

  // §2/§5 CONTRAST (WCAG) — the big perceptual→byte win
  const root = {}; for (const r of rules) if (/(^|[,\s])(:root|html|body)\b/.test(r.sel)) Object.assign(root, tokMap(r.body));
  const bg = root['--surface'] || root['--canvas'];
  const bgName = root['--surface'] ? '--surface' : '--canvas';
  if (bg) {
    for (const [tok, sev] of [['--ink', 'MAJOR'], ['--mut', 'MAJOR'], ['--faint', 'MINOR']]) {
      if (!root[tok]) continue;
      const cr = contrast(root[tok], bg);
      if (cr < 4.5) add(sev, '§5', `${tok} on ${bgName} = ${cr.toFixed(2)}:1 < 4.5:1 (body-text contrast)`);
    }
    // per-theme accent link text (--a-hi) on the base surface
    for (const r of themeRules) {
      const tm = tokMap(r.body), ah = tm['--a-hi']; if (!ah) continue;
      const cr = contrast(ah, bg);
      if (cr < 4.5) add('MAJOR', '§5', `${r.sel.trim()} --a-hi link text on ${bgName} = ${cr.toFixed(2)}:1 < 4.5:1`);
    }
  }

  // §0 content bans
  const cm = CURRENCY.exec(content); if (cm) add('BLOCKER', '§0', `currency symbol "${cm[0]}" in rendered content`);
  const em = EMOJI.exec(content); if (em) add('BLOCKER', '§0', `emoji-as-icon "${em[0]}" in rendered content (SVG only)`);
  const gm = GLYPH_ICONS.exec(content); if (gm) add('MINOR', '§0', `glyph "${gm[0]}" used as icon (should be inline SVG)`);
  // numbers present but no tabular-nums anywhere
  if (/\d{2,}[%.,]?\d*/.test(content.replace(/\b(19|20)\d{2}\b/g, '')) && !/tabular-nums|font-feature-settings\s*:\s*["']?tnum|font-variant-numeric\s*:\s*tabular/i.test(css))
    add('MINOR', '§0', 'numbers in content but no tabular-nums (tnum) declared anywhere');

  // §2/§5 target size (text ≥44px; square icon ≥40px); native controls exempt
  const interactive = [];
  for (const r of rules) {
    if (!/cursor\s*:\s*pointer/i.test(r.body)) continue;
    interactive.push(r.sel);
    if (/input\[type=(range|checkbox|radio)\]/i.test(r.sel)) continue;
    const h = pxOf(r.body, 'min-height') ?? pxOf(r.body, 'height'); if (h == null) continue;
    const w = pxOf(r.body, 'width'); const square = w != null && w === h;
    const floor = square ? 40 : 44;
    if (h < floor) add('MAJOR', '§5', `"${r.sel}" target ${h}px < ${floor}px`);
  }

  // §5 focus-visible coverage: an interactive selector with NO focus rule sharing any class token
  const focusRules = rules.filter(r => /:focus-visible/i.test(r.sel)).map(r => r.sel);
  const classesOf = s => (s.match(/\.[A-Za-z][\w-]*/g) || []);
  for (const sel of interactive) {
    if (/input\[type=/.test(sel)) continue;
    const cls = classesOf(sel); if (!cls.length) continue;                 // tag-only: skip (can't key reliably)
    const covered = focusRules.some(f => classesOf(f).some(c => cls.includes(c)));
    if (!covered) add('MINOR', '§5', `"${sel}" is interactive but no :focus-visible rule shares its class`);
  }

  // §5 keyboard: a clickable <div>/<li> should be a button/link (or carry role+tabindex).
  // Only the SUBJECT class of a cursor:pointer rule counts (not ancestors, not tag-subject
  // rules like ".seg button" whose real control is the <button>). Reported once per class.
  const subjectClass = sel => {                       // last compound; class-subject only
    const last = sel.split(/[\s>+~]+/).pop() || '';
    if (!last.startsWith('.')) return null;           // tag subject (button/a/…): native, skip
    return (last.match(/^\.([\w-]+)/) || [])[1] || null;
  };
  const clickClasses = new Set(interactive.map(subjectClass).filter(Boolean));
  const kbCount = {};
  for (const mt of html.matchAll(/<(div|li)\b([^>]*)>/gi)) {
    const attrs = mt[2];
    const clsM = attrs.match(/class=["']([^"']+)["']/); if (!clsM) continue;
    if (/\brole=/.test(attrs) || /\btabindex=/.test(attrs)) continue;
    const hit = clsM[1].split(/\s+/).find(c => clickClasses.has(c)); if (!hit) continue;
    kbCount[hit] = (kbCount[hit] || 0) + 1;
  }
  for (const [c, n] of Object.entries(kbCount))
    add('MINOR', '§5', `clickable .${c} rendered as <div/li>${n > 1 ? ' ×' + n : ''} with no role/tabindex — not a button (verify keyboard-operability)`);

  // §5 error pairing: aria-invalid must be accompanied by role="alert"
  if (/aria-invalid=["']?true/i.test(html) && !/role=["']?alert/i.test(html))
    add('MAJOR', '§5', 'aria-invalid="true" present but no role="alert" in file');

  // §1/§10 pill indicator must be positioned via getBoundingClientRect
  if (/class=["'][^"']*\b(seg|ind|pill|sgi)\b/i.test(html) && /getBoundingClientRect/.test(css) === false && !/getBoundingClientRect/.test(js))
    add('MINOR', '§1', 'segmented/pill indicator present but getBoundingClientRect not used to position it');

  return F;
}

// ── selftest: prove the gate bites (GOOD clean · BAD trips every rule) ──
if (ARGV.includes('--selftest')) {
  const good = `<meta charset="utf-8"><meta name="viewport" content="width=device-width">
<title>g</title><style>
:root{--canvas:#0C0C0E;--sunken:#0A0A0C;--surface:#151517;--raised:#1B1B1E;--raised2:#212126;--ink:#ECE9E2;--mut:#B8B2A6;--faint:#C9C4B8;--hair:rgba(236,233,226,.09);--ok:#43D08C;--warn:#E6B84F;--err:#E0574E}
.t-indigo{--a:#7A6BF0;--a-hi:#B0A4FF;--a-800:#4B3ECB;--gl:rgba(122,107,240,.42);--c2:#4CC6E6;--c3:#B57BE6}
.b{cursor:pointer;min-height:44px;font-variant-numeric:tabular-nums}
.b:focus-visible{outline:2px solid var(--a-hi)}
@keyframes p{to{opacity:1}}.x{animation:p 1s}
@media(prefers-reduced-motion:reduce){*{animation:none!important}}
</style><button class="b">Label 1,024</button><input aria-invalid="true"><span role="alert">Meta</span>`;

  const bad = `<meta name="viewport" content="width=device-width"><title>b</title><style>
:root{--canvas:#0C0C0E;--surface:#151517;--ink:#ECE9E2;--mut:#9B968C;--faint:#6E6A62;--ok:#43D08C;--warn:#E6B84F}
.t-x{--ink:#000;--a:#7A6BF0}
.b{cursor:pointer;min-height:30px}
.row{cursor:pointer}
.q{color:var(--err)}
@keyframes p{to{opacity:1}}.z{animation:p 1s}
</style><button class="b">Value 500 ₪ 😀 ‹</button><div class="row">Label</div><input aria-invalid="true"><div class="pill">x</div>`;

  const gf = lintHtml(good), bf = lintHtml(bad);
  const bmsg = bf.map(x => x.msg).join('\n');
  const need = ['missing <meta charset', 'currency symbol', 'emoji-as-icon', 'glyph "', 'redefined inside theme',
    'never defined', '< 4.5:1', 'target 30px', 'role/tabindex', 'no role="alert"', 'prefers-reduced-motion',
    'tabular-nums', 'getBoundingClientRect', 'accent token'];
  const miss = need.filter(s => !bmsg.includes(s));
  let ok = true;
  if (gf.length) { ok = false; console.log('✗ GOOD fixture not clean:', gf.map(x => `${x.rule} ${x.msg}`)); }
  if (miss.length) { ok = false; console.log('✗ BAD fixture missed rules:', miss); }
  if (!bf.some(x => x.sev === 'BLOCKER')) { ok = false; console.log('✗ BAD fixture produced no BLOCKER'); }
  console.log(ok ? `✓ pure-lint selftest — GOOD lints clean · BAD trips all ${need.length} rules + BLOCKER` : '✗ pure-lint selftest FAILED');
  process.exit(ok ? 0 : 1);
}

// ── run ───────────────────────────────────────────────────────────────
const targets = (FILES_IN.length ? FILES_IN
  : fs.readdirSync(DIR).filter(f => /(-family|^index)\.html$/.test(f)).sort().map(f => path.join(DIR, f)));

const report = [];
let B = 0, M = 0, m = 0;
for (const file of targets) {
  const findings = lint(file);
  report.push({ file: path.basename(file), findings });
  B += findings.filter(x => x.sev === 'BLOCKER').length;
  M += findings.filter(x => x.sev === 'MAJOR').length;
  m += findings.filter(x => x.sev === 'MINOR').length;
}

if (JSON_OUT) {
  console.log(JSON.stringify({ files: targets.length, blocker: B, major: M, minor: m, report }, null, 2));
} else {
  for (const { file, findings } of report) {
    const b = findings.filter(x => x.sev === 'BLOCKER').length, mj = findings.filter(x => x.sev === 'MAJOR').length, mn = findings.length - b - mj;
    const tag = b ? '✗ BLOCKER' : mj ? '⚠ MAJOR' : mn ? '· minor' : '✓ clean';
    console.log(`\n${tag}  ${file}  (${b}B/${mj}M/${mn}m)`);
    for (const x of findings) console.log(`    [${x.sev}] ${x.rule}  ${x.msg}`);
  }
  console.log(`\n── pure-lint: ${targets.length} files · ${B} blocker · ${M} major · ${m} minor ${STRICT ? '(strict)' : ''}──`);
}
process.exit((B || (STRICT && M)) ? 1 : 0);
