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
const BS_SEM = { brand: 'accent', brandDark: 'accentDark', danger: 'danger', dangerDark: 'danger', success: 'success' };   // הסמנטיים — לפי שם (הכרעת-בעלים 23.9)
// שאר צבעי-הפלטה — לפי **שם-התפקיד** של הפלטה עצמה, לא לפי הערך: BsTokens היא פלטת-תמה-בהירה (דיו כהה על רקע בהיר); הערך הקרוב בתמה-הכהה
// היה הופך דיו לרקע. ink*⇒ink · muted*⇒muted · bg*⇒bg · card*⇒card · divider⇒line · surfaceMid/bgLightAlt⇒cardAlt · warn*⇒warn. שם שאינו כאן (chain*/kb/chat) ⇒ נשאר, מדווח.
const BS_NAME = { ...BS_SEM, successDark: 'success', bgLight: 'bg', bgDark: 'bg', cardLight: 'card', cardDark: 'card', inkLight: 'ink', inkDark: 'ink', mutedLight: 'muted', mutedDark: 'muted', warnText: 'warn', warnBright: 'warn', divider: 'line', surfaceMid: 'cardAlt', bgLightAlt: 'cardAlt' };

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
  if (/^( {2})?(static\s+)?(final|const|var|late|[A-Z]\w*(<[^>]*>)?\??)\s+_?\w+\s*=/.test(lines[lines.length - 1])) return false;   // שדה/קבוע ברמת-חבר או עליון — אין context
  for (let k = lines.length - 1; k >= 0; k--) {
    const ln = lines[k]; const body = ln.replace(/'[^']*'|"[^"]*"/g, '').replace(/\/\/.*$/, '');
    for (const ch of body) { if ('([{'.includes(ch)) bal++; else if (')]}'.includes(ch)) bal--; }
    if (/^( {2})?\S/.test(ln) && !/^\s*[\]\)\}]/.test(ln) && (bal > 0 || /=>/.test(body))) { if (/^\s*(class|enum|mixin|extension)\b/.test(ln)) return false; return /BuildContext context/.test(ln); }
  }
  return false;
}
function constScope(code, i, info = null) {
  let d = 0, firstConst = null;   // סריקה לאחור עד תחילת-המשפט; יציאה מקבוצה שפותחה אחרי `const` ⇒ const · יציאה מרשימת-פרמטרים ({…}) ⇒ ברירת-מחדל
  for (let k = i - 1; k >= 0; k--) {
    const ch = code[k];
    if (')]}'.includes(ch)) d++;
    else if ('([{'.includes(ch)) { if (d > 0) { d--; continue; } const pre = code.slice(Math.max(0, k - 40), k); const cm = pre.match(/const\s+(\w+(<[^>]*>)?\s*)?$/) || pre.match(/const\s*$/);
      if (cm) { const at = k - (pre.length - cm.index); if (!firstConst) { firstConst = at; continue; } if (info) info.nested = true; return 'const'; }   // const ראשון (הקרוב) — נמשיך לבדוק אם יש const עוטף
      if (ch === '{' && /\(\s*$/.test(pre)) return 'param'; if (ch === '(' && /[A-Z]\w*\s*$/.test(pre) && /\bthis\./.test(code.slice(k, i))) return 'param'; }
    else if (d === 0 && (ch === ';' || (ch === '>' && code[k - 1] === '='))) break;
  }
  const line = code.slice(code.lastIndexOf('\n', i) + 1, i);
  if (/^\s*(static\s+)?const\s/.test(line)) return 'const';
  if (firstConst != null) { if (info) info.dropAt = firstConst; return 'const'; }
  return null;
}
const importOf = (rel, file) => `import '${'../'.repeat(rel.split('/').length - 1)}ds/${file}';`;
const ensureImport = (code, rel, file) => (code.includes(`ds/${file}'`) || new RegExp(`^import '${file}';$`, 'm').test(code) ? code : code.replace(/^import 'package:flutter\/material\.dart';$/m, (l) => `${l}\n${importOf(rel, file)}`));

export function wear({ root = UI, dry = false } = {}) {
  const seed = fs.existsSync(path.join(root, 'atoms-colors.json')) ? JSON.parse(fs.readFileSync(path.join(root, 'atoms-colors.json'), 'utf8')) : { _: 'זרע צבעי-האטומים (הכרעת-בעלים 23.9 «לא קשיח»): לכל קובץ-אטום הצבעים שישבו בו ביד, AARRGGBB, בסדר ההופעה. ds-atoms.mjs ⇒ ds_atoms.dart (DsAtomColors).', files: {} };
  const R = roles(); const st = { files: 0, literals: 0, worn: 0, statics: 0, uses: 0, bs: 0, leftConst: 0, leftNoCtx: 0, leftUnmapped: 0, constDropped: 0, seedGrew: false, generated: [], wornAt: [] };
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
    code = code.replace(/^(\s*)(static\s+)?(?:const\s+|final\s+)?(?:Color\s+)?(_\w+)\s*=\s*(DsAtomColors|BsTokens)\.(\w+);(.*)$/gm, (m, ind, s, name, src0, atom, rest) => {
      const role = src0 === 'DsAtomColors' ? (hexByName[atom] ? roleExpr(R, hexByName[atom]) : null) : (BS_NAME[atom] ? `(l) => l.${BS_NAME[atom]}` : null);
      if (!role || /\(context\)/.test(m)) return m;
      if (/0$/.test(name) && code.includes(`Color ${name.slice(0, -1)}(BuildContext context)`)) return m;   // כבר לובש
      names.push(name); st.statics++;
      return `${ind}${s || ''}const ${name}0 = ${src0}.${atom};${rest}\n${ind}${s || ''}Color ${name}(BuildContext context) => dsWear(context, ${src0}.${atom}, ${role});   // לובש עור · ${name}0 = הערך-הכהה`;
    });
    // השימושים בשדה נכתבים בשלב-העריכות (למטה): בהיקף עם context ולא-ב-const ⇒ <שם>(context) · const-יחיד ⇒ מורידים ⇒ (context) · אחרת (ברירת-מחדל/const מקונן/בלי context) ⇒ <שם>0 (הערך-הכהה)
    // 2 · DsAtomColors.<שם> חשוף ⇒ dsWear (מלבד השדה-הכהה <שם>0 שהוגדר ב-3)
    let n2 = 0, n4 = 0;
    // const-יחיד (const Foo(color: X) בלי const עוטף, בהיקף עם context) ⇒ מורידים את ה-const ולובשים; const מקונן / ברירת-מחדל / שדה-קבוע ⇒ נשאר
    // כל העריכות נמדדות על הקוד-המקורי ומוחלות מהסוף להתחלה (אינדקסים יציבים)
    const edits = []; const dropConst = new Set();
    const wearable = (i) => { if (!ctxInScope(code, i)) { st.leftNoCtx++; return false; } const info = {}; const c = constScope(code, i, info); if (c === 'const' && info.dropAt != null && !info.nested) { dropConst.add(info.dropAt); } else if (c) { st.leftConst++; return false; } st.wornAt.push(`${rel}:${code.slice(0, i).split('\n').length}`); return true; };
    for (const [name, hex] of Object.entries(hexByName)) { const re = new RegExp(`(?<!dsWear\\(context, )(?<!0 = )DsAtomColors\\.${name}\\b`, 'g'); for (const m of code.matchAll(re)) { if (!wearable(m.index)) continue; n2++; edits.push({ at: m.index, len: m[0].length, text: `dsWear(context, DsAtomColors.${name}, ${roleExpr(R, hex)})` }); } }
    // 4 · BsTokens: סמנטיים לפי שם · שאר צבעי-הפלטה לפי הערך (התפקיד הקרוב)
    for (const m of code.matchAll(/(?<!dsWear\(context, )(?<!0 = )BsTokens\.(\w+)\b/g)) { const k = m[1]; const role = BS_NAME[k] ? `(l) => l.${BS_NAME[k]}` : null; if (!role) { if (/^(brand|bg|card|ink|muted|success|danger|warn|divider|surface|chain|kb|chat)/.test(k)) st.leftUnmapped++; continue; } if (!wearable(m.index)) continue; n4++; edits.push({ at: m.index, len: m[0].length, text: `dsWear(context, BsTokens.${k}, ${role})` }); }
    for (const name of names) { const re = new RegExp(`(?<![\\w.])${name}\\b(?![\\w(])`, 'g'); for (const m of code.matchAll(re)) { if (/^\s*(static\s+)?const\s+\w+0 = /.test(code.slice(code.lastIndexOf('\n', m.index) + 1, m.index))) continue; st.uses++; const info = {}; const ok = ctxInScope(code, m.index) && (() => { const c = constScope(code, m.index, info); if (!c) return true; if (c === 'const' && info.dropAt != null && !info.nested) { dropConst.add(info.dropAt); return true; } return false; })(); edits.push({ at: m.index, len: m[0].length, text: ok ? `${name}(context)` : `${name}0` }); } }
    for (const at of dropConst) { const m = code.slice(at).match(/^const\s+/); if (m) { edits.push({ at, len: m[0].length, text: '' }); st.constDropped++; } }
    for (const e of edits.sort((a, b) => b.at - a.at)) code = code.slice(0, e.at) + e.text + code.slice(e.at + e.len);
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
  const line = `ds-wear${DRY || CHECK ? ' (מדידה)' : ''}: קבצים ${st.files} · ליטרלים ${st.literals} · DsAtomColors חשופים ${st.worn} · שדות-סטטיים ${st.statics} (שימושים ${st.uses}) · BsTokens ${st.bs} · const-הוסר ${st.constDropped} · נשארים-בכוונה: const ${st.leftConst} · בלי-context ${st.leftNoCtx} · BsTokens-בלי-תפקיד ${st.leftUnmapped}${st.generated.length ? ` · מחוללים עם ליטרל (תקן מנוע): ${st.generated.join(', ')}` : ''}`;
  if (CHECK) { if (left || st.generated.length) { console.error(`🚨 ${line}`); process.exit(1); } console.log(`✓ ${line} — הכל לובש`); process.exit(0); }
  console.log(`🎨 ${line}`);
  if (argv.includes('--list')) for (const w of st.wornAt) console.log('   ' + w);
}
