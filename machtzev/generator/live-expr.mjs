// ⏱️ live-expr — ביטוי-הערך של תנאי-חי (הכרעת-בעלים 23.9 «תחבר כבר»): צורת-תנאי אחת הייתה «שדה יחס מספר»; כאן נוספת «שדה-תאריך יחס משך»
//   (ותק בימים, DateTime.now בזמן-ריצה כמו ds_calendar). מקום אחד לכל הקוראים (insight · app-shell · לוח) — לא שלושה העתקים.
//   live = { slug, field, op:'<'|'>', n, kind:'num'|'age', days? }. אין המצאה: תנאי-משך על שדה שאינו תאריך אינו נוצר (app-ds משאיר סטטי ומדווח).
import path from 'node:path';
import * as R from '../root.mjs';
import { verifiedTwin } from './op-twins.mjs';
export const AGE_HELPER = `double _ageDays(String s) { final t = s.trim(); DateTime? d = DateTime.tryParse(t); if (d == null) { final m = RegExp(r'^(\\d{1,2})[./-](\\d{1,2})[./-](\\d{2,4})$').firstMatch(t); if (m != null) { final y = int.parse(m.group(3)!); d = DateTime(y < 100 ? 2000 + y : y, int.parse(m.group(2)!), int.parse(m.group(1)!)); } } return d == null ? double.nan : DateTime.now().difference(d).inDays.toDouble(); }\ndouble _ageMin(String s) { final d = DateTime.tryParse(s.trim()); if (d == null || s.trim().length <= 10) return double.infinity; return DateTime.now().difference(d).inSeconds / 60.0; }\ndouble _trendAt(List<Map<String, String>> rs, String f, num h) { final xs = <double>[], ys = <double>[]; final now = DateTime.now(); for (final r in rs) { final at = (r['__at'] ?? '').trim(); final t = DateTime.tryParse(at); final v = double.tryParse((r[f] ?? '').trim()); if (t == null || at.length <= 10 || v == null) continue; xs.add(t.difference(now).inSeconds / 60.0); ys.add(v); } if (xs.isEmpty) return double.nan; final n = xs.length; if (n == 1) return ys.first; final mx = xs.reduce((a, b) => a + b) / n, my = ys.reduce((a, b) => a + b) / n; var sxy = 0.0, sxx = 0.0; for (var i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) * (xs[i] - mx); } final b = sxx == 0 ? 0.0 : sxy / sxx; return my + b * (h - mx); } double _sinceClock(int hm) { final n = DateTime.now(); var d = n.hour * 60 + n.minute - hm; if (d >= 720) d -= 1440; if (d < -720) d += 1440; return d.toDouble(); }`;
//   kind:'refCount' — לכל רשומת-הורה: כמה רשומות-בנות מצביעות עליה ({ childSlug, childField, parentKey }) · kind:'agg' — על הקבוצה כולה: avg/sum/count של שדה (agg, field)
// ═══ liveValue = eq ⊕ age ⊕ refCount ⊕ num
export const liveValue = (live, r = 'r', k = (s) => `'${s}'`) =>
  live.kind === 'eq' ? `(${r}[${k(live.field)}] ?? '').trim()`
  : live.kind === 'age' ? `_ageDays(${r}[${k(live.field)}] ?? '')`
  : live.kind === 'ageMin' ? `_ageMin(${r}[${k(live.field)}] ?? '')`
  : live.kind === 'linked' ? liveLinkedExpr(live, r, k)
  : live.kind === 'expr' ? exprDart(live.tree, r, k)
  : live.kind === 'refCount' ? `appStore.records('${live.childSlug}').where((c) => (c[${k(live.childField)}] ?? '').trim() == (${r}[${k(live.parentKey)}] ?? '').trim()).length.toDouble()`
  : `(double.tryParse(${r}[${k(live.field)}] ?? '') ?? double.nan)`;
/** 🔗 תוצאה של טבלאות קשורות כשדה (הכרעת-בעלים 24.9 «תמשיך» — «תוצאה של שלב היא קלט לשלב הבא»): לכל רשומת-אב — סכום האיברים
 *  (yeshiva/shape.searchLinked) על רשומות-הבת החיות; live = { kind:'linked', parentKey, terms:[{slug, op, n, to, from?, filt?}] } — אותם חלקי-יסוד כמו מסך-הקשר */
export function liveLinkedExpr(live, r = 'r', k = (s) => `'${s}'`) {
  const num = (m, c) => `(num.tryParse(((${m} as Map)[${k(c)}] ?? '').toString().trim()) ?? 0)`;
  const inOf = (t, x) => `sumBy(whereList(appStore.records('${t.slug}').toList(), (x) => ((x as Map)[${k(x)}] ?? '').toString().trim() == (${r}[${k(live.parentKey)}] ?? '').trim()${t.filt ? ` && ${t.filt.cmp === 'le' ? 'leNum' : 'geNum'}(${num('x', t.filt.col)}, ${t.filt.v})` : ''}), (x) => ${num('x', t.n)})`;
  const termE = (t) => (t.op === 'net' ? `subNum(${inOf(t, t.to)}, ${inOf(t, t.from)})` : inOf(t, t.to));
  const base = `(${live.terms.slice(1).reduce((acc, t) => `addNum(${acc}, ${termE(t)})`, termE(live.terms[0]))}).toDouble()`;
  if (!live.arith) return base;   // ⊕ «צפי חלקי שטח»: תוצאת-הקשר <פעולה> שדה של אותה רשומה
  const f = `(double.tryParse((${r}[${k(live.arith.field)}] ?? '').trim()) ?? double.nan)`; return `(${base} ${live.arith.op} ${f})`;
}
/** ⊕⊕ עץ-ביטוי (app-ds.valueOf) ⇒ Dart. עלים: num · field · ageField (דקות מאז) · since (דקות מאז כניסה לשלב; לא בשלב ⇒ NaN) · linked */
export function exprDart(t, r = 'r', k = (s) => `'${s}'`) {
  if (t.op) return `(${exprDart(t.a, r, k)} ${t.op} ${exprDart(t.b, r, k)})`;
  if (t.num != null) return String(t.num);
  if (t.clock != null) return t.notStage != null ? `(((${r}['__stage'] ?? '0') != '${t.notStage}') ? _sinceClock(${t.clock}) : double.nan)` : `_sinceClock(${t.clock})`;   // ⏰ דקות מאז HH:MM הלילה (±12 שעות) · «כשלא <שלב>» ⇒ רק רשומה שעוד לא הגיעה לשלב
  if (t.since != null) return `(((${r}['__stage'] ?? '0') == '${t.since}') ? _ageMin(${r}['__stage_at'] ?? '') : double.nan)`;
  if (t.ageField) return `_ageMin(${r}[${k(t.ageField)}] ?? '')`;
  if (t.linked) return liveLinkedExpr(t.linked, r, k);
  if (t.queue) return `simWaitMin(${t.queue.map((q) => exprDart(q, r, k)).join(', ')})`;   // 🌉 המתנה צפויה (קצב, עמדות, דקות-טיפול) ⇒ סימולציה של מנוע-המערכות (gen_sim_engine.dart)
  return `(double.tryParse((${r}[${k(t.field)}] ?? '').trim()) ?? double.nan)`;
}
/** אותו עץ בצד-JS (לציפייה מהדוגמאות): null כשעלה תלוי-זמן (since/ageField) או קשר — אז אין ציפייה מהדוגמאות */
export function exprJs(t, row, ctx = null) {
  if (t.op) { const a = exprJs(t.a, row, ctx), b = exprJs(t.b, row, ctx); return a == null || b == null ? null : t.op === '+' ? a + b : t.op === '-' ? a - b : t.op === '*' ? a * b : a / b; }
  if (t.queue) { const a = t.queue.map((q) => exprJs(q, row, ctx)); return ctx && ctx.queue && a.every((v) => v != null) ? ctx.queue(a) ?? null : null; }   // 🌉 הסימולציה מחושבת מראש ב-mavin-gen (shofet.simWaitJs — אותו מנוע) ⇒ ctx.queue
  if (t.num != null) return t.num; if (t.fi != null) { const v = parseFloat(row[t.fi]); return Number.isFinite(v) ? v : null; } return null;
}
const treeHas = (t, key) => !!t && (t[key] != null || treeHas(t.a, key) || treeHas(t.b, key) || (t.queue || []).some((q) => treeHas(q, key)));
export const exprHasQueue = (t) => treeHas(t, 'queue');
export const SIM_IMPORT = "import 'gen_sim_engine.dart';";   // 🌉 נכתב ע"י mavin-gen ליד המסכים כשיש «המתנה צפויה»
export const exprNeedsAge = (t) => treeHas(t, 'since') || treeHas(t, 'ageField') || treeHas(t, 'clock');
export const exprHasLinked = (t) => treeHas(t, 'linked');
export const LINKED_IMPORTS = ['op-where-list', 'op-sum-by', 'op-sub-num', 'op-add-num', 'op-le-num', 'op-ge-num'].map((f) => `import '../dart-maor/${f}.dart';`);
export const liveIsSet = (live) => live.kind === 'agg';
/** ערך-הקבוצה (agg): count ⇒ מספר הרשומות · sum ⇒ sumBy (אטום-קטלוג dart-maor) · avg ⇒ sumBy / מספר (צורה: סכום חלקי מונה) */
export const liveAggExpr = (live, rs = 'rs', k = (s) => `'${s}'`) => live.agg === 'trend' ? `_trendAt(${rs}, ${k(live.field)}, ${live.horizon || 0})` : live.agg === 'count' ? `${rs}.length.toDouble()` : live.agg === 'sum' ? `sumBy(${rs}, (x) => double.tryParse(((x as Map)[${k(live.field)}] ?? '').toString()) ?? 0).toDouble()` : `(${rs}.isEmpty ? double.nan : sumBy(${rs}, (x) => double.tryParse(((x as Map)[${k(live.field)}] ?? '').toString()) ?? 0) / ${rs}.length)`;
export const liveAggImport = (live) => (live.kind === 'agg' && live.agg !== 'count' && live.agg !== 'trend' ? "import '../dart-maor/op-sum-by.dart';" : null);
export const AGG_WORD = { avg: 'ממוצע', sum: 'סכום', count: 'מונה', trend: 'צפי' };
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
export const liveThreshold = (live) => (live.kind === 'eq' ? live.value : live.kind === 'age' ? live.days : live.kind === 'ageMin' ? live.minutes : live.n);
/** הסף כביטוי-Dart: שוויון ⇒ מחרוזת דרך k (קבוע-תוכן), אחרת המספר · האופרטור ב-Dart: «=» ⇒ «==» */
export const liveThresholdDart = (live, k = (s) => `'${s}'`) => (live.kind === 'eq' ? k(live.value) : String(liveThreshold(live)));
export const liveOpDart = (live) => (live.op === '=' ? '==' : live.op);
/** בדיקת-התנאי כביטוי-Dart: יחס נלמד «@אטום» ⇒ קריאה לאטום (ערך, סף) · אחרת «ערך יחס סף» */
export const liveTest = (live, v, t) => (String(live.op || '')[0] === '@' ? `${live.op.slice(1)}(${v}, ${t})` : `${v} ${liveOpDart(live)} ${t}`);
/** ייבוא-האטום של יחס נלמד (גם בצירוף/חלופה) */
export const liveAtomImports = (live) => [live, ...(live.pre || []), ...(live.alt || [])].filter((p) => String(p.op || '')[0] === '@' && p.atomFile).map((p) => `import '../${p.atomFile}';`);
/** האם ערך-דוגמה עונה לתנאי (JS, לציפייה): < · > · = (מחרוזת) */
export const liveHit = (live, v) => { const t = liveThreshold(live); if (v == null) return false; if (String(live.op || '')[0] === '@') { const fn = verifiedTwin(live.op.slice(1), live.atomFile ? path.join(R.ROOT, 'new', live.atomFile) : null); return fn ? fn(String(v).trim(), String(t).trim()) === true : false; } return live.op === '<' ? v < t : live.op === '>' ? v > t : String(v).trim() === String(t).trim(); };   /* @אטום: התאום המאומת-מול-Dart (op-twins) */
export const liveNeedsHelper = (live) => live.kind === 'age' || live.kind === 'ageMin' || (live.kind === 'expr' && exprNeedsAge(live.tree)) || !!live.window || live.agg === 'trend' || [...(live.pre || []), ...(live.alt || [])].some((p) => liveNeedsHelper(p));   // מסנן/חלופה שצריכים _ageMin (זמן-מאז-שלב · ותק) ⇒ גם הראשי
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
/** צפי (JS, זהה ל-_trendAt): קריאות [דקות-מעכשיו, ערך] ⇒ קו-מגמה (ריבועים-פחותים) ⇒ הערך בעוד h דקות */
export function trendAt(pts, h) { if (!pts.length) return NaN; const n = pts.length; if (n === 1) return pts[0][1]; const mx = pts.reduce((a, p) => a + p[0], 0) / n, my = pts.reduce((a, p) => a + p[1], 0) / n; let sxy = 0, sxx = 0; for (const [x, y] of pts) { sxy += (x - mx) * (y - my); sxx += (x - mx) * (x - mx); } const b = sxx === 0 ? 0 : sxy / sxx; return my + b * (h - mx); }
export function liveAggSample(live, rows, fi) { const vals = rows.map((r) => parseFloat(r[fi])).filter((v) => !isNaN(v)); if (live.agg === 'count') return rows.length; if (!vals.length) return null; const sum = vals.reduce((a, b) => a + b, 0); return live.agg === 'sum' ? sum : sum / vals.length; }
export function liveSample(live, raw) {
  if (live.kind === 'eq') return String(raw ?? '').trim();
  if (live.kind === 'expr') return null;   // ערך-ביטוי: מחושב מהשורה (exprJs), לא מתא אחד
  if (live.kind === 'ageMin') { const t = String(raw || '').trim(); const d = Date.parse(t.replace(' ', 'T')); return t.length <= 10 || isNaN(d) ? null : Math.floor((Date.now() - d) / 60000); }   // כמו _ageMin: רק חותמת מלאה (תאריך+שעה)
  if (live.kind !== 'age') { const v = parseFloat(raw); return isNaN(v) ? null : v; }
  const t = String(raw || '').trim(); let d = Date.parse(t); if (isNaN(d)) { const m = t.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/); if (m) { const y = +m[3]; d = Date.UTC(y < 100 ? 2000 + y : y, +m[2] - 1, +m[1]); } }
  if (isNaN(d)) return null; return Math.floor((Date.now() - d) / 86400000);
}
