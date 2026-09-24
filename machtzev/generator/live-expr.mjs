// ⏱️ live-expr — ביטוי-הערך של תנאי-חי (הכרעת-בעלים 23.9 «תחבר כבר»): צורת-תנאי אחת הייתה «שדה יחס מספר»; כאן נוספת «שדה-תאריך יחס משך»
//   (ותק בימים, DateTime.now בזמן-ריצה כמו ds_calendar). מקום אחד לכל הקוראים (insight · app-shell · לוח) — לא שלושה העתקים.
//   live = { slug, field, op:'<'|'>', n, kind:'num'|'age', days? }. אין המצאה: תנאי-משך על שדה שאינו תאריך אינו נוצר (app-ds משאיר סטטי ומדווח).
import path from 'node:path';
import * as R from '../root.mjs';
import { verifiedTwin } from './op-twins.mjs';
export const AGE_HELPER = `double _ageDays(String s) { final t = s.trim(); DateTime? d = DateTime.tryParse(t); if (d == null) { final m = RegExp(r'^(\\d{1,2})[./-](\\d{1,2})[./-](\\d{2,4})$').firstMatch(t); if (m != null) { final y = int.parse(m.group(3)!); d = DateTime(y < 100 ? 2000 + y : y, int.parse(m.group(2)!), int.parse(m.group(1)!)); } } return d == null ? double.nan : DateTime.now().difference(d).inDays.toDouble(); }\ndouble _ageMin(String s) { final d = DateTime.tryParse(s.trim()); if (d == null || s.trim().length <= 10) return double.infinity; return DateTime.now().difference(d).inSeconds / 60.0; }`;
//   kind:'refCount' — לכל רשומת-הורה: כמה רשומות-בנות מצביעות עליה ({ childSlug, childField, parentKey }) · kind:'agg' — על הקבוצה כולה: avg/sum/count של שדה (agg, field)
// ═══ liveValue = eq ⊕ age ⊕ refCount ⊕ num
export const liveValue = (live, r = 'r', k = (s) => `'${s}'`) =>
  live.kind === 'eq' ? `(${r}[${k(live.field)}] ?? '').trim()`
  : live.kind === 'age' ? `_ageDays(${r}[${k(live.field)}] ?? '')`
  : live.kind === 'refCount' ? `appStore.records('${live.childSlug}').where((c) => (c[${k(live.childField)}] ?? '').trim() == (${r}[${k(live.parentKey)}] ?? '').trim()).length.toDouble()`
  : `(double.tryParse(${r}[${k(live.field)}] ?? '') ?? double.nan)`;
export const liveIsSet = (live) => live.kind === 'agg';
/** ערך-הקבוצה (agg): count ⇒ מספר הרשומות · sum ⇒ sumBy (אטום-קטלוג dart-maor) · avg ⇒ sumBy / מספר (צורה: סכום חלקי מונה) */
export const liveAggExpr = (live, rs = 'rs', k = (s) => `'${s}'`) => live.agg === 'count' ? `${rs}.length.toDouble()` : live.agg === 'sum' ? `sumBy(${rs}, (x) => double.tryParse(((x as Map)[${k(live.field)}] ?? '').toString()) ?? 0).toDouble()` : `(${rs}.isEmpty ? double.nan : sumBy(${rs}, (x) => double.tryParse(((x as Map)[${k(live.field)}] ?? '').toString()) ?? 0) / ${rs}.length)`;
export const liveAggImport = (live) => (live.kind === 'agg' && live.agg !== 'count' ? "import '../dart-maor/op-sum-by.dart';" : null);
export const AGG_WORD = { avg: 'ממוצע', sum: 'סכום', count: 'מונה' };
export const liveIsGrouped = (live) => live.kind === 'aggBy' || live.kind === 'levels';
/** מפתח-הקבוצה: aggBy ⇒ ערך שדה-החלוקה · levels ⇒ המדרגה (אטום-ההחלטה המוכח כשיש — live.decide — אחרת השוואה ביד לפי הצורה: ≥גבוה ⇒ 2 · ≥בינוני ⇒ 1 · אחרת 0) */
// ═══ liveKeyExpr = levels ⊕ aggBy
export const liveKeyExpr = (live, r = 'r', k = (s) => `'${s}'`) => live.kind === 'levels'
  ? `(() { final v = double.tryParse(${r}[${k(live.field)}] ?? '') ?? double.nan; return v.isNaN ? '' : ${live.decide && (live.thresholds || []).length === 2 ? `${live.decide}(v.toInt(), ${live.high}, ${live.mid})` : `const [${(live.thresholds || [live.high, live.mid]).join(', ')}].where((t) => v >= t).length`}.toString(); })()`
  : `(${r}[${k(live.by)}] ?? '').trim()`;
export const levelOf = (live, v) => (v == null || isNaN(v) ? null : (live.thresholds || [live.high, live.mid]).filter((t) => v >= t).length);
/** קבוצות (aggBy): הרשומות ⇒ רשימת-קבוצות {by: ערך-החלוקה, field: ערך-הצבירה} — ומכאן הצורה היא פר-רשומה (רשומה = קבוצה) */
export const liveGroupsExpr = (live, rs0 = 'rs0', k = (s) => `'${s}'`) => `(() { final g = <String, List<Map<String, String>>>{}; for (final r in ${rs0}) { g.putIfAbsent(${liveKeyExpr(live, 'r', k)}, () => <Map<String, String>>[]).add(r); } return [for (final e in g.entries) <String, String>{${k(live.by)}: e.key, ${k(live.field)}: ((${liveAggExpr(live, 'e.value', k)}) * 10).round() / 10 == ((${liveAggExpr(live, 'e.value', k)}) * 10).round() ~/ 10 ? (((${liveAggExpr(live, 'e.value', k)}) * 10).round() ~/ 10).toString() : (((${liveAggExpr(live, 'e.value', k)}) * 10).round() / 10).toString()}]; })()`;
/** ערך-הקבוצות מהדוגמאות (aggBy) ⇒ [[by, value]] */
export function liveGroupsSample(live, rows, fi, bi) { const g = new Map(); for (const r of rows) { const key = live.kind === 'levels' ? String(levelOf(live, parseFloat(r[fi])) ?? '') : String(r[bi] || '').trim(); (g.get(key) || g.set(key, []).get(key)).push(r); } return [...g.entries()].map(([key, rs]) => { const v = liveAggSample(live, rs, fi); return [key, v == null ? null : Math.round(v * 10) / 10]; }); }
export const liveThreshold = (live) => (live.kind === 'eq' ? live.value : live.kind === 'age' ? live.days : live.n);
/** הסף כביטוי-Dart: שוויון ⇒ מחרוזת דרך k (קבוע-תוכן), אחרת המספר · האופרטור ב-Dart: «=» ⇒ «==» */
export const liveThresholdDart = (live, k = (s) => `'${s}'`) => (live.kind === 'eq' ? k(live.value) : String(liveThreshold(live)));
export const liveOpDart = (live) => (live.op === '=' ? '==' : live.op);
/** בדיקת-התנאי כביטוי-Dart: יחס נלמד «@אטום» ⇒ קריאה לאטום (ערך, סף) · אחרת «ערך יחס סף» */
export const liveTest = (live, v, t) => (String(live.op || '')[0] === '@' ? `${live.op.slice(1)}(${v}, ${t})` : `${v} ${liveOpDart(live)} ${t}`);
/** ייבוא-האטום של יחס נלמד (גם בצירוף/חלופה) */
export const liveAtomImports = (live) => [live, ...(live.pre || []), ...(live.alt || [])].filter((p) => String(p.op || '')[0] === '@' && p.atomFile).map((p) => `import '../${p.atomFile}';`);
/** האם ערך-דוגמה עונה לתנאי (JS, לציפייה): < · > · = (מחרוזת) */
export const liveHit = (live, v) => { const t = liveThreshold(live); if (v == null) return false; if (String(live.op || '')[0] === '@') { const fn = verifiedTwin(live.op.slice(1), live.atomFile ? path.join(R.ROOT, 'new', live.atomFile) : null); return fn ? fn(String(v).trim(), String(t).trim()) === true : false; } return live.op === '<' ? v < t : live.op === '>' ? v > t : String(v).trim() === String(t).trim(); };   /* @אטום: התאום המאומת-מול-Dart (op-twins) */
export const liveNeedsHelper = (live) => live.kind === 'age' || !!live.window || (live.pre || []).some((p) => p.kind === 'age');
/** צירוף («וגם», הכרעת-בעלים 23.9 «צא לדרך»): live.pre = תנאים קודמים על אותה קבוצה ⇒ הקבוצה של התנאי הראשי היא הרשומות שעברו את כולם (מסנן על מסנן) */
// ═══ livePre = and (filter over filter)
export const livePre = (live, r = 'r', k = (s) => `'${s}'`) => (live.pre || []).map((p) => `(${liveTest(p, liveValue(p, r, k), liveThresholdDart(p, k))})`).join(' && ');
const liveWin = (live, rs) => (live.window ? `${rs}.where((r) => _ageMin(r['__at'] ?? '') <= ${live.window}).toList()` : rs);   // חלון-זמן: רק מה שנכנס ב-N הדקות האחרונות (שורה בלי זמן מלא ⇒ לא בחלון)
export const liveSetExpr = (live, rs, k = (s) => `'${s}'`) => { const w = liveWin(live, rs); return live.pre && live.pre.length ? `${w}.where((r) => ${livePre(live, 'r', k)}).toList()` : w; };
/** חלופה («או»): live.alt = תנאים שכל אחד מהם מספיק — רשומה חורגת אם התנאי הראשי או אחת החלופות (איחוד) */
// ═══ liveAlt = or (union)
export const liveAlt = (live, r = 'r', k = (s) => `'${s}'`) => (live.alt || []).map((p) => `(${liveTest(p, liveValue(p, r, k), liveThresholdDart(p, k))})`).join(' || ');
export const liveCond = (live, cond, r = 'r', k = (s) => `'${s}'`) => (live.alt && live.alt.length ? `((${cond}) || ${liveAlt(live, r, k)})` : cond);
export const liveAltOk = (live, row, fieldIndex) => (live.alt || []).some((p) => liveHit(p, liveSample(p, row[fieldIndex(p.field)])));
export const livePreOk = (live, row, fieldIndex) => (live.pre || []).every((p) => liveHit(p, liveSample(p, row[fieldIndex(p.field)])));
/** ערכי-הדוגמאות של הבעלים בצורת-התנאי: מספר ⇒ המספר · תאריך ⇒ ותק בימים היום (תלוי-זמן, מוצהר) */
/** ערך-הקבוצה מהדוגמאות (agg) — לציפייה ולהחלטה */
export function liveAggSample(live, rows, fi) { const vals = rows.map((r) => parseFloat(r[fi])).filter((v) => !isNaN(v)); if (live.agg === 'count') return rows.length; if (!vals.length) return null; const sum = vals.reduce((a, b) => a + b, 0); return live.agg === 'sum' ? sum : sum / vals.length; }
export function liveSample(live, raw) {
  if (live.kind === 'eq') return String(raw ?? '').trim();
  if (live.kind !== 'age') { const v = parseFloat(raw); return isNaN(v) ? null : v; }
  const t = String(raw || '').trim(); let d = Date.parse(t); if (isNaN(d)) { const m = t.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/); if (m) { const y = +m[3]; d = Date.UTC(y < 100 ? 2000 + y : y, +m[2] - 1, +m[1]); } }
  if (isNaN(d)) return null; return Math.floor((Date.now() - d) / 86400000);
}
