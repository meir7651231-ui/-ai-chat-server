#!/usr/bin/env node
/** 🎨 מנוע-עיצוב 8 · ds-wear — «כולם לובשים עור» כמעבר קבוע, לא כמיגרציה חד-פעמית (הכרעת-בעלים 23.9 «תוריד לכולם את העור» · חיבור 8 «תתחיל לחבר»).
 *  ההרמה (shelf-lift/data-lift) מחזירה אטומים עם צבע-ביד; עד כאן ארבעה סקריפטים חד-פעמיים הפכו אותם ללובשי-עור. כאן אותם ארבעה מעברים, אידמפוטנטיים, על תיקייה:
 *    1 ליטרל-צבע ⇒ זרע (atoms-colors.json, לפי קובץ ובסדר-הופעה) ⇒ DsAtomColors.<שם> (ds-atoms.mjs מייצר את ds_atoms.dart מהזרע)
 *    2 DsAtomColors.<שם> חשוף ⇒ dsWear(context, DsAtomColors.<שם>, (l) => l.<תפקיד>[.withValues(alpha)]) — התפקיד = הקרוב-ביותר ב-RGB לתפקידי DsLook.dark (צורה, לא משמעות); כהה נשאר ביט-זהה
 *    3 שדה סטטי/עליון שמחזיק צבע-זרע ⇒ <שם>0 (הערך-הכהה, const) + <שם>(BuildContext) (לובש); השימושים ⇒ <שם>(context)
 *    4 BsTokens סמנטיים (brand/brandDark/danger/dangerDark/success) ⇒ dsWear לפי שם-התפקיד
 *  פטורים כמו ds-atoms (ds_scale/ds_pure/ds_atoms · auto/bs_tokens.dart · forged/) + קבצים מחוללים («מחולל ע"י machtzev/ds-»: מתקנים את המנוע, לא את הפלט).
 *  שימוש: node machtzev/ds-wear.mjs [--root new/dart-ui-bs] [--dry] [--check]
 *    --dry: מדווח בלי לכתוב · --check: יציאה-1 אם נשאר משהו ללבוש (ליטרל · DsAtomColors/BsTokens חשופים · שדה סטטי חשוף) */
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { EXEMPT, LITERAL_RE, FLUTTER_COLORS, constName, walk, stripComments } from './ds-atoms.mjs';
import { PURE_LOOK as P } from '../new/atoms/pure-look.mjs';
const HERE = new URL('.', import.meta.url).pathname;
const ROOT = path.resolve(HERE, '..');
const argv = process.argv.slice(2);
const opt = (k) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : null; };
const UI = path.resolve(ROOT, opt('--root') || 'new/dart-ui-bs') + '/';
const DRY = argv.includes('--dry'), CHECK = argv.includes('--check');
const SEED = path.join(UI, 'atoms-colors.json');
const DS_SEED = path.join(UI, 'ds', 'design-seed.json');
const GEN_HEADER = /מחולל ע"י machtzev\/ds-/;
const BS_SEM = { brand: 'accent', brandDark: 'accentDark', danger: 'danger', dangerDark: 'danger', success: 'success' };

// ── תפקידי DsLook.dark ⇒ [alpha, RRGGBB] בדיוק כפי ש-ds.dart פותר אותם (DsTokens ⇐ DsPure/DsIdentity) ──
const hexOf = (v) => { if (v.startsWith('#')) return [255, v.slice(1).toUpperCase()]; const m = v.match(/rgba?\(([^)]+)\)/); const [r, g, b, a = '1'] = m[1].split(',').map((s) => s.trim()); return [Math.round(parseFloat(a) * 255), [r, g, b].map((n) => (+n).toString(16).padStart(2, '0').toUpperCase()).join('')]; };
const arr = (v) => Array.isArray(v) ? [parseInt(v[0], 16), v[1]] : [255, v];
function roles() {
  const ds = JSON.parse(fs.readFileSync(DS_SEED, 'utf8')).identity; const N = P.neutral, T = P.themes[P.defaultTheme];
  return { bg: hexOf(N['--canvas']), card: hexOf(N['--surface']), cardAlt: hexOf(N['--raised']), ink: hexOf(N['--ink']), muted: hexOf(N['--mut']), faint: hexOf(N['--faint']), line: hexOf(N['--hair']), track: hexOf(N['--raised2']), accent: hexOf(T['--a']), accentDark: hexOf(T['--a-hi']), accentSoft: arr(ds.accentSoft), success: arr(ds.success), successSoft: arr(ds.successSoft), warn: arr(ds.lookWarn), danger: arr(ds.danger), dangerSoft: arr(ds.dangerSoft), dangerLine: arr(ds.dangerLine), chipBg: arr(ds.chipBg), onAccent: arr(ds.onAccent) };
}
const rgb = (h) => [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
const dist = (a, b) => { const A = rgb(a), B = rgb(b); return Math.sqrt((A[0] - B[0]) ** 2 + (A[1] - B[1]) ** 2 + (A[2] - B[2]) ** 2); };
function roleExpr(R, aarrggbb) {
  const a = parseInt(aarrggbb.slice(0, 2), 16), h = aarrggbb.slice(2); let best = null;
  for (const [role, [ra, rh]] of Object.entries(R)) { const d = dist(h, rh), da = Math.abs(a - ra); if (!best || d < best.d || (d === best.d && da < best.da)) best = { role, d, da }; }
  const alpha = a === 255 ? '' : `.withValues(alpha: ${(a / 255).toFixed(3).replace(/0+$/, '').replace(/\.$/, '.0')})`;
  return `(l) => l.${best.role}${alpha}`;
}
// ── היקף (צורה, לא ניחוש): לובשים רק כשיש `BuildContext context` בהיקף השיטה, ולא בתוך ביטוי-const (ברירת-מחדל של פרמטר · static const · const Ctor(…)) ──
// כותרת-החבר-המקיף: השורה הראשונה מעל ההפניה ברמת-חבר (0/2 רווחים) שפותחת בלוק/ביטוי שמכיל את ההפניה — בה חייב להופיע `BuildContext context`
function ctxInScope(code, i) {
  const lines = code.slice(0, i).split('\n'); let bal = 0;
  for (let k = lines.length - 1; k >= 0; k--) {
    const ln = lines[k]; const body = ln.replace(/'[^']*'|"[^"]*"/g, '').replace(/\/\/.*$/, '');
    for (const ch of body) { if ('([{'.includes(ch)) bal++; else if (')]}'.includes(ch)) bal--; }
    if (/^( {2})?\S/.test(ln) && !/^\s*[\]\)\}]/.test(ln) && (bal > 0 || /=>/.test(body))) { if (/^\s*(class|enum|mixin|extension)\b/.test(ln)) return false; return /BuildContext context/.test(ln); }
  }
  return false;
}
function constScope(code, i) {
  let d = 0;   // סריקה לאחור עד תחילת-המשפט; יציאה מקבוצה שפותחה אחרי `const` ⇒ const · יציאה מרשימת-פרמטרים ({…}) ⇒ ברירת-מחדל
  for (let k = i - 1; k >= 0; k--) {
    const ch = code[k];
    if (')]}'.includes(ch)) d++;
    else if ('([{'.includes(ch)) { if (d > 0) { d--; continue; } const pre = code.slice(Math.max(0, k - 40), k); if (/const\s+(\w+(<[^>]*>)?\s*)?$/.test(pre) || /const\s*$/.test(pre)) return 'const'; if (ch === '{' && /\(\s*$/.test(pre)) return 'param'; if (ch === '(' && /[A-Z]\w*\s*$/.test(pre) && /\bthis\./.test(code.slice(k, i))) return 'param'; }
    else if (d === 0 && (ch === ';' || (ch === '>' && code[k - 1] === '='))) break;
  }
  const line = code.slice(code.lastIndexOf('\n', i) + 1, i);
  return /^\s*(static\s+)?const\s/.test(line) ? 'const' : null;
}
const importOf = (rel, file) => `import '${'../'.repeat(rel.split('/').length - 1)}ds/${file}';`;
const ensureImport = (code, rel, file) => (code.includes(`ds/${file}'`) || new RegExp(`^import '${file}';$`, 'm').test(code) ? code : code.replace(/^import 'package:flutter\/material\.dart';$/m, (l) => `${l}\n${importOf(rel, file)}`));

export function wear({ root = UI, dry = false } = {}) {
  const seed = fs.existsSync(path.join(root, 'atoms-colors.json')) ? JSON.parse(fs.readFileSync(path.join(root, 'atoms-colors.json'), 'utf8')) : { _: 'זרע צבעי-האטומים (הכרעת-בעלים 23.9 «לא קשיח»): לכל קובץ-אטום הצבעים שישבו בו ביד, AARRGGBB, בסדר ההופעה. ds-atoms.mjs ⇒ ds_atoms.dart (DsAtomColors).', files: {} };
  const R = roles(); const st = { files: 0, literals: 0, worn: 0, statics: 0, uses: 0, bs: 0, leftConst: 0, leftNoCtx: 0, seedGrew: false, generated: [], wornAt: [] };
  for (const f of walk(root).sort()) {
    const rel = path.relative(root, f); if (EXEMPT.test(rel)) continue;
    let code = fs.readFileSync(f, 'utf8'); const orig = code;
    if (GEN_HEADER.test(code.split('\n').slice(0, 3).join('\n'))) { if (LITERAL_RE.test(stripComments(code))) st.generated.push(rel); LITERAL_RE.lastIndex = 0; continue; }
    // 1 · ליטרל ⇒ זרע ⇒ DsAtomColors.<שם>
    const cols = seed.files[rel] ? [...seed.files[rel]] : [];
    const idx = (hex) => { let i = cols.indexOf(hex); if (i < 0) { cols.push(hex); i = cols.length - 1; st.seedGrew = true; } return i; };
    let n1 = 0; const inComment = (i) => { const ls = code.lastIndexOf('\n', i) + 1; const line = code.slice(ls, i); if (/\/\//.test(line.replace(/'[^']*'|"[^"]*"/g, ''))) return true; const bo = code.lastIndexOf('/*', i), bc = code.lastIndexOf('*/', i); return bo > bc; };
    code = code.replace(LITERAL_RE, (m, hex, named, i) => { if (inComment(i)) return m; const h = hex ? hex.toUpperCase() : FLUTTER_COLORS[named]; if (!h) return m; n1++; return `DsAtomColors.${constName(rel, idx(h))}`; });
    if (n1) { code = ensureImport(code, rel, 'ds_atoms.dart'); seed.files[rel] = cols; st.literals += n1; }
    const hexByName = {}; cols.forEach((hex, i) => { hexByName[constName(rel, i)] = hex; });
    // 3 · שדה סטטי/עליון שמחזיק צבע-זרע ⇒ <שם>0 + <שם>(context) (לפני 2, כדי שהשדה יישאר const-כהה)
    const names = [];
    code = code.replace(/^(\s*)(static\s+)?(?:const\s+|final\s+)?(?:Color\s+)?(_\w+)\s*=\s*DsAtomColors\.(\w+);(.*)$/gm, (m, ind, s, name, atom, rest) => {
      if (!hexByName[atom] || /\(context\)/.test(m)) return m;
      if (/0$/.test(name) && code.includes(`Color ${name.slice(0, -1)}(BuildContext context)`)) return m;   // כבר לובש
      names.push(name); st.statics++;
      return `${ind}${s || ''}const ${name}0 = DsAtomColors.${atom};${rest}\n${ind}${s || ''}Color ${name}(BuildContext context) => dsWear(context, DsAtomColors.${atom}, ${roleExpr(R, hexByName[atom])});   // לובש עור · ${name}0 = הערך-הכהה`;
    });
    for (const name of names) { const re = new RegExp(`(?<![\\w.])${name}\\b(?![\\w(])`, 'g'); code = code.replace(re, () => { st.uses++; return `${name}(context)`; }); }
    // 2 · DsAtomColors.<שם> חשוף ⇒ dsWear (מלבד השדה-הכהה <שם>0 שהוגדר ב-3)
    let n2 = 0;
    const wearable = (i) => { if (!ctxInScope(code, i)) { st.leftNoCtx++; return false; } const c = constScope(code, i); if (c) { st.leftConst++; return false; } st.wornAt.push(`${rel}:${code.slice(0, i).split('\n').length}`); return true; };
    for (const [name, hex] of Object.entries(hexByName)) { const re = new RegExp(`(?<!dsWear\\(context, )(?<!0 = )DsAtomColors\\.${name}\\b`, 'g'); code = code.replace(re, (m, i) => { if (!wearable(i)) return m; n2++; return `dsWear(context, DsAtomColors.${name}, ${roleExpr(R, hex)})`; }); }
    // 4 · BsTokens סמנטיים ⇒ dsWear לפי שם
    let n4 = 0; code = code.replace(/(?<!dsWear\(context, )BsTokens\.(brand|brandDark|danger|dangerDark|success)\b/g, (m, k, i) => { if (!wearable(i)) return m; n4++; return `dsWear(context, BsTokens.${k}, (l) => l.${BS_SEM[k]})`; });
    if (n2 || n4 || names.length) code = ensureImport(code, rel, 'ds.dart');
    st.worn += n2; st.bs += n4;
    if (code !== orig) { st.files++; if (!dry) fs.writeFileSync(f, code); }
  }
  if (st.seedGrew && !dry) { fs.writeFileSync(path.join(root, 'atoms-colors.json'), JSON.stringify(seed, null, 1) + '\n'); if (root === UI && path.resolve(root) === path.resolve(ROOT, 'new/dart-ui-bs')) spawnSync(process.execPath, [path.join(HERE, 'ds-atoms.mjs')], { stdio: 'inherit' }); }
  return st;
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === new URL(import.meta.url).pathname;
if (isMain) {
  const st = wear({ root: UI, dry: DRY || CHECK });
  const left = st.literals + st.worn + st.statics + st.bs;
  const line = `ds-wear${DRY || CHECK ? ' (מדידה)' : ''}: קבצים ${st.files} · ליטרלים ${st.literals} · DsAtomColors חשופים ${st.worn} · שדות-סטטיים ${st.statics} (שימושים ${st.uses}) · BsTokens ${st.bs} · נשארים-בכוונה: const ${st.leftConst} · בלי-context ${st.leftNoCtx}${st.generated.length ? ` · מחוללים עם ליטרל (תקן מנוע): ${st.generated.join(', ')}` : ''}`;
  if (CHECK) { if (left || st.generated.length) { console.error(`🚨 ${line}`); process.exit(1); } console.log(`✓ ${line} — הכל לובש`); process.exit(0); }
  console.log(`🎨 ${line}`);
  if (argv.includes('--list')) for (const w of st.wornAt) console.log('   ' + w);
}
