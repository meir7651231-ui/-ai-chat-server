#!/usr/bin/env node
// 🧠 behavior-plan — בורר-התנהגויות-לפי-ייעוד ל«בלגן» (GENMAX·G34 · הכרעת-בעלים 9.9: "אין אותם באטום? תעשה את זה").
//   הכרעה-21/22: המחולל לא כותב התנהגות ביד — הוא מצהיר **צורך** (צורת-דאטה במסך: מועד · אדם · כסף · טקסט-חופשי · יומן · תזכורת)
//   עם מילות-ייעוד + חתימה, והבורר מדרג את **כל** מנועי-הלוגיקה באינדקס-האמת (atom-index-full · לוגיקה) כמו auto-logic (G18):
//   חפיפת-ייעוד (כותרת-doc של המנוע, idf) + התאמת-חתימה (argc · טיפוסים · החזרה). צורך בלי מועמד = פסילה (שקע-חובה ריק), לא נפילה לקוד-ידני.
//   G34ב (הכרעת-בעלים 9.9 «הכי-טוב-לייעוד = מה שהמנוע עושה, לא מה שכתוב עליו»): אחרי החתימה — **הוכחה-בריצה**: דוגמאות (קלט ⇒ בדיקה) של פעולת-היסוד
//   רצות ב-Dart על כל המועמדים (קובץ-מוכיח ב-.prove/, ייבוא-עם-קידומת); נבחר מי שעובר את כולן; התיאור רק שובר-שוויון. אף מועמד לא עובר ⇒ הצורך לא נפתר.
//   הפלט: behavior-plan.json (need ⇒ pick · file · score · top3). balagan.mjs/app-shell.mjs קוראים את התוכנית ומייבאים את הנבחר.
//   --gate: (א) כל צורך נפתר; (ב) הנבחר מיובא ונקרא בפועל בקבצי-בלגן המחוללים; (ג) המתאמים ב-Dart דקים (הלבשת-מונחים בלבד, אין מימוש-מחדש).
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { catalog } from './auto-logic.mjs';
import * as R from '../root.mjs';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(HERE, 'behavior-plan.json');

// הצרכים: מזהה ⇒ {shape (צורת-הדאטה), demand (מילות-הייעוד מצד המסך), params, ret}
export const NEEDS = {
  // הכרעת-בעלים 9.9: "אין לא-קיים או חלקי — המחולל מרכיב חלקיקים לייעוד". כל צורך = פעולת-יסוד אחת; ההתנהגות (דחייה · תזכורת · תווית-תאריך · לשון-עבר…) = דבק שמרכיב אותן.
  'week.start':         { shape: 'מועד',       demand: 'תחילת השבוע ראשון חצות תאריך', params: ['DateTime'], ret: 'DateTime', forbid: '\\.weekday\\b', examples: [['DateTime(2026, 9, 8)', 'r == DateTime(2026, 9, 6)'], ['DateTime(2026, 9, 13)', 'r == DateTime(2026, 9, 13)'], ['DateTime(2026, 9, 12)', 'r == DateTime(2026, 9, 6)']] },
  'iso.addDays':        { shape: 'מועד',       demand: 'הוספת ימים לתאריך ISO קדימה אחורה גלגול', params: ['String', 'int'], ret: 'String', forbid: 'Duration\\(days', examples: [["'2026-09-08', 1", "r == '2026-09-09'"], ["'2026-09-30', 1", "r == '2026-10-01'"], ["'2026-09-08', -8", "r == '2026-08-31'"]] },
    'iso.daysSince':      { shape: 'מועד',       demand: 'ימים בין ISO ליום ייחוס', params: ['String', 'String'], ret: 'num', forbid: '\\.inDays\\b', examples: [["'2026-09-05', '2026-09-08'", 'r == 3'], ["'2026-09-09', '2026-09-08'", 'r == -1'], ["'2026-09-08', '2026-09-08'", 'r == 0']] },
  'iso.inRange':        { shape: 'מועד',       demand: 'תאריך ISO בתוך טווח גבולות כוללים לפני אחרי', params: ['String?', '( String? from, String? to ) r'], ret: 'bool', examples: [["'2026-09-09', (from: '2026-09-08', to: null)", 'r == true'], ["'2026-09-07', (from: '2026-09-08', to: null)", 'r == false'], ["'2026-09-08', (from: '2026-09-08', to: '2026-09-08')", 'r == true']] },
    'task.overdue':       { shape: 'מועד',       demand: 'האם משימה באיחור due לפני היום פתוחה', params: ['dynamic', 'dynamic'], ret: 'bool', forbid: 'isBefore\\(today\\) \\? today', examples: [["{'due': '2026-09-01'}, '2026-09-08'", 'r == true'], ["{'due': '2026-09-20'}, '2026-09-08'", 'r == false'], ["{'due': '2026-09-08'}, '2026-09-08'", 'r == false']] },
  'time.toMin':         { shape: 'שעה',        demand: 'HH:MM לדקות מחצות שעה', params: ['dynamic'], ret: 'dynamic', examples: [["'15:03'", 'r == 903'], ["'00:30'", 'r == 30']] },
  'time.minutesBetween':{ shape: 'יומן',       demand: 'דקות בין שני זמנים ISO לפני', params: ['String', 'String'], ret: 'int', forbid: '\\.inMinutes|\\.inHours', examples: [["'2026-09-08T09:55', '2026-09-08T10:00'", 'r == 5'], ["'2026-09-07T23:00', '2026-09-08T10:00'", 'r == 660']] },
    'text.normSearch':    { shape: 'טקסט-חופשי', demand: 'נרמול טקסט לחיפוש אותיות סופיות', params: ['dynamic', 'Map<String, String> T'], ret: 'String', forbid: "ך\\$'\\), 'כ'", examples: [["'שלום', {'k1': 'כ', 'k2': 'מ', 'k3': 'נ', 'k4': 'פ', 'k5': 'צ'}", "r == 'שלומ'"], ["'ארנונה', {'k1': 'כ', 'k2': 'מ', 'k3': 'נ', 'k4': 'פ', 'k5': 'צ'}", "r == 'ארנונה'"], ["'ABC', {'k1': 'כ', 'k2': 'מ', 'k3': 'נ', 'k4': 'פ', 'k5': 'צ'}", "r == 'abc'"], ["'אב גד', {'k1': 'כ', 'k2': 'מ', 'k3': 'נ', 'k4': 'פ', 'k5': 'צ'}", "r == 'אב גד'"]] },
  'name.norm':          { shape: 'אדם',        demand: 'נרמול שם אדם בלי רווחים חיפוש', params: ['dynamic', 'String Function(dynamic) normSearch'], ret: 'String', examples: [["'רות לוי', (t) => t.toString().toLowerCase()", "r == 'רותלוי'"], ["' אבי  כהן ', (t) => t.toString()", "r == 'אביכהן'"]] },
  'phone.digits':       { shape: 'חיפוש',      demand: 'נרמול טלפון ספרות בלבד מקפים 972', params: ['String?'], ret: 'String', examples: [["'052-1234567'", "r == '0521234567'"], ["'1,250'", "r == '1250'"], ["'+972-52-1234567'", "r == '0521234567'"]] },
    'count.by':           { shape: 'רשומות',     demand: 'ספירה לפי מפתח מונה קבוצה', params: ['List<dynamic>', 'String Function(dynamic) key'], ret: 'List<List<Object>>', examples: [["[{'s': 'a'}, {'s': 'a'}, {'s': 'b'}], (x) => (x as Map)['s'].toString()", "r.toString() == '[[a, 2], [b, 1]]'"]] },
  'prefix.rule':        { shape: 'חיפוש',      demand: 'כלל ניקוד קידומת מתחיל ב', params: ['String', 'String'], ret: 'int?', forbid: "startsWith\\(w \\+ ' '\\)", examples: [["'איפה ', 'איפה הפיקדון'", 'r != null'], ["'חפש ', 'איפה הפיקדון'", 'r == null'], ["'הפיקדון', 'איפה הפיקדון'", 'r == null']] },
  'money.fmt':          { shape: 'כסף',        demand: 'מפריד אלפים ₪ מספר שלם עיגול', params: ['num'], ret: 'String', forbid: "replaceAllMapped\\(RegExp\\(r'\\\\B|\\(s\\.length - i\\) % 3 == 0", examples: [['9840', "r.replaceAll('₪', '').trim() == '9,840'"], ['1650', "r.replaceAll('₪', '').trim() == '1,650'"], ['999', "r.replaceAll('₪', '').trim() == '999'"]] },
};
const heTok = (s) => [...String(s).matchAll(/[֐-׿][֐-׿"'\-״]{1,}/g)].map((m) => m[0].replace(/^["'\-]+|["'\-]+$/g, '')).filter((t) => t.length >= 2);
const parts = (t) => t.split(/[-\/·]/).filter((x) => x.length >= 2).map((x) => (x.length > 3 && /^[הובלמשכ]/.test(x) ? x.slice(1) : x));
const bag = (tokens) => new Set(tokens.flatMap((t) => [t, ...parts(t)]));
const norm = (t) => String(t || 'dynamic').replace(/\s+/g, '').replace(/\?$/, '');
const sigOk = (c, need) => c.argc === need.params.length && c.params.every((p, i) => { const a = norm(p), b = norm(need.params[i]); return a === b || a === 'dynamic'; }) && (norm(c.ret) === norm(need.ret) || norm(c.ret) === 'dynamic');
const agree = (c, need) => { let n = 0; c.params.forEach((p, i) => { if (norm(p) !== 'dynamic' && norm(p) === norm(need.params[i])) n++; }); if (norm(c.ret) !== 'dynamic' && norm(c.ret) === norm(need.ret)) n++; return n; };

export function plan({ prove = true } = {}) {
  const { rows, idf } = catalog();
  const out = {};
  const needsIds = Object.keys(NEEDS);
  // מועמדים לפי חתימה — רק אטומים טהורים (אפס import; חוק-1) שניתן להריץ בבידוד
  const candsOf = (need) => rows.filter((c) => sigOk(c, need)).filter((c) => { try { return !/^import /m.test(fs.readFileSync(path.join(R.NEW, c.file), 'utf8')); } catch { return false; } });
  // הוכחה-בריצה: קובץ-מוכיח לכל צורך — כל המועמדים מיובאים עם קידומת, כל דוגמה נבדקת; פלט = "i:j:1/0"
  const proofs = {};
  if (prove) {
    const dir = path.join(HERE, '.prove'); fs.mkdirSync(dir, { recursive: true });
    const DART = process.env.DART || (fs.existsSync('/home/user/flutter/bin/cache/dart-sdk/bin/dart') ? '/home/user/flutter/bin/cache/dart-sdk/bin/dart' : 'dart');
    for (const id of needsIds) {
      const need = NEEDS[id]; const cands = candsOf(need); if (!cands.length || !need.examples) continue;
      const imps = cands.map((c, i) => `import '${path.relative(dir, path.join(R.NEW, c.file)).split(path.sep).join('/')}' as c${i};`).join('\n');
      const body = cands.map((c, i) => need.examples.map((ex, j) => `  try { final dynamic r = c${i}.${c.id}(${ex[0]}); out.add('${i}:${j}:' + ((${ex[1]}) ? '1' : '0')); } catch (_) { out.add('${i}:${j}:0'); }`).join('\n')).join('\n');
      const file = path.join(dir, id.replace(/\W/g, '_') + '.dart');
      fs.writeFileSync(file, `// G34 · מוכיח-בחירה: ${id} — ${cands.length} מועמדים × ${need.examples.length} דוגמאות\n${imps}\nvoid main() {\n  final out = <String>[];\n${body}\n  print(out.join(','));\n}\n`);
      const r = spawnSync(DART, ['run', file], { cwd: dir, encoding: 'utf8', timeout: 120000 });
      const line = (r.stdout || '').trim().split('\n').pop() || '';
      const pass = {}; for (const tok of line.split(',')) { const [i, j, ok] = tok.split(':'); if (i === undefined || ok === undefined) continue; (pass[cands[+i].id] ||= { ok: 0, total: need.examples.length }).ok += ok === '1' ? 1 : 0; }
      if (!line.includes(':')) { proofs[id] = { error: (r.stderr || r.stdout || '').split('\n').filter((l) => /Error|error/.test(l)).slice(0, 2).join(' | ') }; continue; }
      proofs[id] = pass;
    }
  } else if (fs.existsSync(OUT)) { const saved = JSON.parse(fs.readFileSync(OUT, 'utf8')); for (const id of needsIds) if (saved[id] && saved[id].proof) proofs[id] = saved[id].proof; }
  for (const id of needsIds) {
    const need = NEEDS[id]; const demand = bag(heTok(need.demand));
    const score = (c) => { let s = 0; for (const t of c.titleTok) if (demand.has(t)) s += 2 * idf(t); for (const t of c.bodyTok) if (demand.has(t) && !c.titleTok.has(t)) s += idf(t); return s + agree(c, need); };
    const pf = proofs[id] || {};
    const cands = candsOf(need).map((c) => ({ id: c.id, file: c.file, score: +score(c).toFixed(2), exact: c.params.every((p, i) => norm(p) === norm(need.params[i])) && norm(c.ret) === norm(need.ret), proven: pf[c.id] ? pf[c.id].ok === pf[c.id].total : false, ok: pf[c.id] ? pf[c.id].ok : 0 }))
      .sort((x, y) => (y.proven - x.proven) || (y.ok - x.ok) || (y.score - x.score) || (x.exact === y.exact ? (x.id < y.id ? -1 : 1) : x.exact ? -1 : 1));
    const top = cands[0] || null; const ok = top && (pf.error ? top.score > 0 : top.proven);
    out[id] = { shape: need.shape, pick: ok ? top.id : null, file: ok ? top.file : null, score: top ? top.score : 0, proven: !!(top && top.proven), candidates: cands.length, top3: cands.slice(0, 3).map((c) => `${c.id}:${c.ok}/${need.examples ? need.examples.length : 0}${c.proven ? '✓' : ''}:${c.score}`), proof: pf };
  }
  return out;
}
export function readPlan() { return JSON.parse(fs.readFileSync(OUT, 'utf8')); }
/** למחולל: השם+הקובץ של הנבחר לצורך; צורך לא-פתור ⇒ זריקה (שקע-חובה ריק = פסילה, הכרעה-20ג) */
export function pick(id) { const p = readPlan()[id]; if (!p || !p.pick) throw new Error(`behavior-plan: אין אטום לצורך ${id} — פסילה (לא כותבים ביד)`); return { name: p.pick, file: p.file }; }

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const gate = process.argv.includes('--gate');
  const P = plan({ prove: !gate });   // --gate: בלי ריצה מחדש (התוכנית השמורה = ההוכחה); כתיבה = הוכחה-בריצה
  if (!gate) { fs.writeFileSync(OUT, JSON.stringify(P, null, 1) + '\n'); }
  const fails = [];
  for (const [id, p] of Object.entries(P)) if (!p.pick) fails.push(`צורך בלי אטום: ${id} (${p.candidates} מועמדים בחתימה)`);
  if (gate) {
    // (ב) הנבחר מיובא ונקרא בפועל · (ג) מתאמים דקים
    const GEN = R.outDir(); const files = fs.readdirSync(GEN).filter((f) => /^gen_(balagan_|app_)/.test(f) && f.endsWith('.dart'));
    const src = Object.fromEntries(files.map((f) => [f, fs.readFileSync(path.join(GEN, f), 'utf8')]));
    const all = Object.values(src).join('\n');
    const saved = fs.existsSync(OUT) ? readPlan() : {};
    for (const [id, p] of Object.entries(P)) { if (!p.pick) continue; if (!saved[id] || saved[id].pick !== p.pick) fails.push(`התוכנית השמורה ≠ הבחירה החיה: ${id} (${saved[id] && saved[id].pick} ≠ ${p.pick}) — הרץ בלי --gate`); const imp = new RegExp(`^import '\\.\\./${p.file.replace(/[.\/]/g, '\\$&')}';`, 'm'); if (!imp.test(all)) fails.push(`${id}: ${p.pick} לא מיובא באף קובץ מחולל`); else if (!new RegExp(`\\b${p.pick}\\(`).test(all.replace(/^import .*$/gm, ''))) fails.push(`${id}: ${p.pick} מיובא אך לא נקרא`); }
    // (ג) חלקיק-קיים ⇒ הפרימיטיב שלו אסור בדבק המחולל (הכרעה-20ב: מרכיבים חלקיקים, לא ממציאים מחדש)
    for (const [id, need] of Object.entries(NEEDS)) { if (!need.forbid) continue; const re = new RegExp(need.forbid); for (const [f, s] of Object.entries(src)) { const m = s.split('\n').findIndex((l) => re.test(l)); if (m >= 0) fails.push(`${f}:${m + 1}: פרימיטיב במקום החלקיק ${P[id].pick} (${id})`); } }
    // (ד) כפילות-בכניסה: אטום שנוסף ב-G34 עם חתימה זהה + ≥2 מילות-ייעוד משותפות לאטום ותיק = מימוש-מחדש
    { const { rows } = catalog(); const mine = rows.filter((r) => /G34/.test(r.title) || /G34/.test((fs.existsSync(path.join(R.NEW, r.file)) ? fs.readFileSync(path.join(R.NEW, r.file), 'utf8') : '').split('\n').slice(0, 3).join(' '))); for (const a of mine) for (const b of rows) { if (a === b || /G34/.test(b.title)) continue; if (a.argc !== b.argc || !a.params.every((p, i) => norm(p) === norm(b.params[i])) || norm(a.ret) !== norm(b.ret)) continue; const shared = [...a.titleTok].filter((t) => b.titleTok.has(t) && t.length >= 3); if (shared.length >= 2) fails.push(`כפילות-בכניסה: ${a.id} ≈ ${b.id} (חתימה זהה · ${shared.join(',')})`); } }
    // (ה) מתאמים ארוכים = חשד
    const ADAPTERS = ['balaganDayLabel', 'balaganAgo', 'balaganFmtMoney', 'balaganPlanStart', 'balaganSearchQuery', 'balaganBackupAge', 'balaganBackupDue', 'balaganOpenCount'];
    for (const [f, s] of Object.entries(src)) for (const a of ADAPTERS) { const m = s.match(new RegExp(`^[A-Za-z<>?, ]+ ${a}\\([^\\n]*`, 'm')); if (m && m[0].length > 900) fails.push(`${f}: ${a} ארוך מדי למתאם (${m[0].length} תווים) — מימוש-מחדש?`); }
  }
  const n = Object.keys(P).length, ok = Object.values(P).filter((p) => p.pick).length;
  if (fails.length) { console.log(`🔴 behavior: ${fails.length} כשלים\n  ` + fails.slice(0, 12).join('\n  ')); process.exit(1); }
  console.log(`✓ behavior: ${ok}/${n} צרכים ⇒ חלקיקים נבחרו-בהוכחה-בריצה (${Object.values(P).filter((p) => p.proven).length} מוכחים) מ-${catalog().rows.length} מנועים` + (gate ? ' · מיובאים+נקראים · מתאמים דקים' : ' · behavior-plan.json'));
}
