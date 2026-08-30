#!/usr/bin/env node
/** 🔧 מחצב · מתקן-ההסגר (מבצע-המאה, פאזה 3) — ריפוי שרידי-JS בהמרות-Dart מוסגרות,
 *  מונחה-analyzer: ‏dart analyze --format=machine נותן span מדויק לכל שגיאה, המנוע עוטף
 *  נקודתית (truthiness ⇒ _truthy · for-in/spread/ארגומנט dynamic ⇒ cast מפורש), חוזר עד
 *  fixpoint, ואז מריץ את בדיקת-האטום החיה. ‏strict-נקי + בדיקה-ירוקה ⇒ שחרור מההסגר
 *  (הזוג חוזר ל-dart-maor). כשל ⇒ נשאר בהסגר עם דוח-כן (סטיות-התנהגות = FIXES.md, יד).
 *
 *  שימוש: node machtzev/repair-quarantine.mjs [--only <base>] [--keep]  (keep=לא מזיז, רק מתקן במקום)
 */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const ROOT = new URL('..', import.meta.url).pathname;
const Q = path.join(ROOT, 'new/dart-maor/QUARANTINE');
const DM = path.join(ROOT, 'new/dart-maor');
const DART = process.env.DART_BIN || '/tmp/claude-0/-home-user/2d086046-4b60-52a1-9aee-58e2962b1958/scratchpad/dart-sdk/bin/dart';
const ONLY = (() => { const i = process.argv.indexOf('--only'); return i > 0 ? process.argv[i + 1] : null; })();
const KEEP = process.argv.includes('--keep');

// חבילת-analyze זמנית: ההסגר + המדפים (ל-imports יחסיים) תחת strict
const WORK = fs.mkdtempSync('/tmp/repairq-');
fs.writeFileSync(path.join(WORK, 'pubspec.yaml'), 'name: repairq\nenvironment:\n  sdk: ">=3.0.0 <4.0.0"\n');
fs.writeFileSync(path.join(WORK, 'analysis_options.yaml'), 'analyzer:\n  language:\n    strict-casts: true\n    strict-inference: true\n    strict-raw-types: true\n');
fs.mkdirSync(path.join(WORK, 'lib'));
fs.cpSync(DM, path.join(WORK, 'lib/dart-maor'), { recursive: true });
fs.cpSync(path.join(ROOT, 'new/dart-data-maor'), path.join(WORK, 'lib/dart-data-maor'), { recursive: true });
// ההסגר יושב בתוך dart-maor/QUARANTINE — imports יחסיים 'x.dart' פותרים לשכנים? לא: בהסגר
// הבדיקות מייבאות '../<dep>.dart'. משאירים את המבנה כפי-שהוא.

const TRUTHY_BLOCK = `
/// ‏truthiness של JS (חוק 7): '' / 0 / -0 / NaN / null / false כוזבים. (הוזרק ע"י מתקן-ההסגר)
bool _rqTruthy(dynamic v) =>
    !(v == null || v == false || v == '' || (v is num && (v == 0 || v.isNaN)));
`;

const analyze = (rel) => {
  try {
    execFileSync(DART, ['analyze', '--format=machine', rel], { cwd: WORK, stdio: 'pipe', timeout: 120000 });
    return [];
  } catch (e) {
    const out = String(e.stdout || '');
    return out.split('\n').filter(l => l.startsWith('ERROR|')).map(l => {
      const p = l.split('|');
      return { code: p[2], file: p[3], line: +p[4], col: +p[5], len: +p[6], msg: p.slice(7).join('|') };
    });
  }
};

const castFromMsg = (msg) => {
  const m = msg.match(/parameter type '([^']+)'|return type of '[^']+'|type '([^']+)'\.?$/);
  const m2 = msg.match(/assigned to (?:the )?(?:parameter |list |map |a variable of )?type '([^']+)'/);
  return (m2 && m2[1]) || (m && (m[1] || m[2])) || null;
};

function repairFile(base, report) {
  const fp = path.join(WORK, 'lib/dart-maor/QUARANTINE', base + '.dart');
  const rel = 'lib/dart-maor/QUARANTINE/' + base + '.dart';
  if (!fs.existsSync(fp)) return report(base, 'skip', 'אין-קובץ');
  let rounds = 0, lastCount = Infinity;
  while (rounds++ < 12) {
    const errs = analyze(rel).filter(e => e.file.endsWith(base + '.dart'));
    if (!errs.length) break;
    if (errs.length >= lastCount) return report(base, 'stuck', `לא-מתכנס (${errs.length} שגיאות: ${[...new Set(errs.map(e => e.code))].join(',')})`);
    lastCount = errs.length;
    let src = fs.readFileSync(fp, 'utf8');
    const lines = src.split('\n');
    const off = (ln, col) => lines.slice(0, ln - 1).reduce((a, l) => a + l.length + 1, 0) + col - 1;
    // תיקונים מהסוף-להתחלה (spans לא זזים)
    const jobs = errs.map(e => ({ ...e, at: off(e.line, e.col) })).sort((a, b) => b.at - a.at);
    let usedTruthy = src.includes('_rqTruthy');
    for (const e of jobs) {
      const seg = src.slice(e.at, e.at + e.len);
      const wrap = (open, close) => { src = src.slice(0, e.at) + open + seg + close + src.slice(e.at + e.len); };
      if (['non_bool_condition', 'non_bool_operand', 'non_bool_negation_expression'].includes(e.code.toLowerCase())) {
        wrap('_rqTruthy(', ')'); usedTruthy = true;
      } else if (e.code.toLowerCase() === 'for_in_of_invalid_type') {
        wrap('((', ') as Iterable)');
      } else if (e.code.toLowerCase() === 'not_iterable_spread') {
        wrap('((', ') as Iterable)');
      } else if (e.code.toLowerCase() === 'not_map_spread') {
        wrap('((', ') as Map)');
      } else if (['argument_type_not_assignable', 'invalid_assignment', 'return_of_invalid_type', 'list_element_type_not_assignable', 'map_value_type_not_assignable', 'map_key_type_not_assignable'].includes(e.code.toLowerCase())) {
        const t = castFromMsg(e.msg);
        if (t && !/Function|\(/.test(t)) wrap('((', `) as ${t})`);
      }
    }
    if (usedTruthy && !src.includes('bool _rqTruthy')) {
      const firstDecl = src.search(/\n(?:[A-Za-z_][\w<>,?\[\] ]*\s+)?[a-z_]\w*\s*\(/);
      src = firstDecl > 0 ? src.slice(0, firstDecl) + '\n' + TRUTHY_BLOCK + src.slice(firstDecl) : src + TRUTHY_BLOCK;
    }
    fs.writeFileSync(fp, src);
  }
  const left = analyze(rel).filter(e => e.file.endsWith(base + '.dart'));
  if (left.length) return report(base, 'stuck', `נותרו ${left.length}: ${[...new Set(left.map(e => e.code))].join(',')}`);
  // בדיקה-חיה (בהסגר-העבודה)
  const tp = path.join(WORK, 'lib/dart-maor/QUARANTINE', base + '_test.dart');
  if (fs.existsSync(tp)) {
    try { execFileSync(DART, ['run', '--enable-asserts', tp], { cwd: path.dirname(tp), stdio: 'pipe', timeout: 60000 }); }
    catch (e) { return report(base, 'behavior', 'analyze-נקי אך הבדיקה אדומה (סטיית-התנהגות — FIXES.md): ' + String(e.stderr || e.stdout || '').slice(0, 120).replace(/\n/g, ' ')); }
  } else return report(base, 'behavior', 'analyze-נקי אבל אין בדיקה — לא משתחרר בלי הוכחה');
  // ✅ שחרור: הזוג חוזר למקור (ההסגר האמיתי) — או --keep לתיקון-במקום
  const fixed = fs.readFileSync(fp, 'utf8');
  const fixedT = fs.readFileSync(tp, 'utf8');
  if (KEEP) {
    fs.writeFileSync(path.join(Q, base + '.dart'), fixed);
    fs.writeFileSync(path.join(Q, base + '_test.dart'), fixedT);
    return report(base, 'ok', 'תוקן בתוך-ההסגר (--keep)');
  }
  fs.writeFileSync(path.join(DM, base + '.dart'), fixed.replace(/import '\.\.\//g, "import '"));
  fs.writeFileSync(path.join(DM, base + '_test.dart'), fixedT.replace(/import '\.\.\//g, "import '"));
  // אימות אחרי-ההזזה (imports יחסיים השתנו) — בעץ-העבודה
  fs.writeFileSync(path.join(WORK, 'lib/dart-maor', base + '.dart'), fs.readFileSync(path.join(DM, base + '.dart')));
  fs.writeFileSync(path.join(WORK, 'lib/dart-maor', base + '_test.dart'), fs.readFileSync(path.join(DM, base + '_test.dart')));
  try {
    execFileSync(DART, ['run', '--enable-asserts', path.join(WORK, 'lib/dart-maor', base + '_test.dart')], { cwd: path.join(WORK, 'lib/dart-maor'), stdio: 'pipe', timeout: 60000 });
  } catch (e) {
    fs.rmSync(path.join(DM, base + '.dart'), { force: true });
    fs.rmSync(path.join(DM, base + '_test.dart'), { force: true });
    return report(base, 'stuck', 'אחרי-הזזה הבדיקה אדומה — הוחזר להסגר: ' + String(e.stderr || '').slice(0, 100).replace(/\n/g, ' '));
  }
  fs.rmSync(path.join(Q, base + '.dart'));
  fs.rmSync(path.join(Q, base + '_test.dart'), { force: true });
  return report(base, 'ok', 'שוחרר מההסגר — analyze-נקי + בדיקה-ירוקה');
}

const bases = fs.readdirSync(Q).filter(f => f.endsWith('.dart') && !f.endsWith('_test.dart')).map(f => f.replace(/\.dart$/, ''))
  .filter(b => !ONLY || b === ONLY);
let ok = 0, stuck = 0, behav = 0;
const report = (b, kind, msg) => {
  if (kind === 'ok') ok++; else if (kind === 'behavior') behav++; else stuck++;
  console.log(`${kind === 'ok' ? '✅' : kind === 'behavior' ? '🧪' : '🫱'} ${b} — ${msg}`);
};
for (const b of bases) repairFile(b, report);
fs.rmSync(WORK, { recursive: true, force: true });
console.log(`\n🔧 מתקן-ההסגר: ${ok} שוחררו · ${behav} סטיות-התנהגות · ${stuck} תקועים (מתוך ${bases.length})`);
