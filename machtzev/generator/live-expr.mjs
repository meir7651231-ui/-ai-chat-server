// ⏱️ live-expr — ביטוי-הערך של תנאי-חי (הכרעת-בעלים 23.9 «תחבר כבר»): צורת-תנאי אחת הייתה «שדה יחס מספר»; כאן נוספת «שדה-תאריך יחס משך»
//   (ותק בימים, DateTime.now בזמן-ריצה כמו ds_calendar). מקום אחד לכל הקוראים (insight · app-shell · לוח) — לא שלושה העתקים.
//   live = { slug, field, op:'<'|'>', n, kind:'num'|'age', days? }. אין המצאה: תנאי-משך על שדה שאינו תאריך אינו נוצר (app-ds משאיר סטטי ומדווח).
export const AGE_HELPER = `double _ageDays(String s) { final t = s.trim(); DateTime? d = DateTime.tryParse(t); if (d == null) { final m = RegExp(r'^(\\d{1,2})[./-](\\d{1,2})[./-](\\d{2,4})$').firstMatch(t); if (m != null) { final y = int.parse(m.group(3)!); d = DateTime(y < 100 ? 2000 + y : y, int.parse(m.group(2)!), int.parse(m.group(1)!)); } } return d == null ? double.nan : DateTime.now().difference(d).inDays.toDouble(); }`;
//   kind:'refCount' — לכל רשומת-הורה: כמה רשומות-בנות מצביעות עליה ({ childSlug, childField, parentKey }) · kind:'agg' — על הקבוצה כולה: avg/sum/count של שדה (agg, field)
export const liveValue = (live, r = 'r', k = (s) => `'${s}'`) =>
  live.kind === 'age' ? `_ageDays(${r}[${k(live.field)}] ?? '')`
  : live.kind === 'refCount' ? `appStore.records('${live.childSlug}').where((c) => (c[${k(live.childField)}] ?? '').trim() == (${r}[${k(live.parentKey)}] ?? '').trim()).length.toDouble()`
  : `(double.tryParse(${r}[${k(live.field)}] ?? '') ?? double.nan)`;
export const liveIsSet = (live) => live.kind === 'agg';
/** ערך-הקבוצה (agg): count ⇒ מספר הרשומות · sum ⇒ sumBy (אטום-קטלוג dart-maor) · avg ⇒ sumBy / מספר (צורה: סכום חלקי מונה) */
export const liveAggExpr = (live, rs = 'rs', k = (s) => `'${s}'`) => live.agg === 'count' ? `${rs}.length.toDouble()` : live.agg === 'sum' ? `sumBy(${rs}, (x) => double.tryParse(((x as Map)[${k(live.field)}] ?? '').toString()) ?? 0).toDouble()` : `(${rs}.isEmpty ? double.nan : sumBy(${rs}, (x) => double.tryParse(((x as Map)[${k(live.field)}] ?? '').toString()) ?? 0) / ${rs}.length)`;
export const liveAggImport = (live) => (live.kind === 'agg' && live.agg !== 'count' ? "import '../dart-maor/op-sum-by.dart';" : null);
export const AGG_WORD = { avg: 'ממוצע', sum: 'סכום', count: 'מונה' };
export const liveIsGrouped = (live) => live.kind === 'aggBy';
/** קבוצות (aggBy): הרשומות ⇒ רשימת-קבוצות {by: ערך-החלוקה, field: ערך-הצבירה} — ומכאן הצורה היא פר-רשומה (רשומה = קבוצה) */
export const liveGroupsExpr = (live, rs0 = 'rs0', k = (s) => `'${s}'`) => `(() { final g = <String, List<Map<String, String>>>{}; for (final r in ${rs0}) { g.putIfAbsent((r[${k(live.by)}] ?? '').trim(), () => <Map<String, String>>[]).add(r); } return [for (final e in g.entries) <String, String>{${k(live.by)}: e.key, ${k(live.field)}: ((${liveAggExpr(live, 'e.value', k)}) * 10).round() / 10 == ((${liveAggExpr(live, 'e.value', k)}) * 10).round() ~/ 10 ? (((${liveAggExpr(live, 'e.value', k)}) * 10).round() ~/ 10).toString() : (((${liveAggExpr(live, 'e.value', k)}) * 10).round() / 10).toString()}]; })()`;
/** ערך-הקבוצות מהדוגמאות (aggBy) ⇒ [[by, value]] */
export function liveGroupsSample(live, rows, fi, bi) { const g = new Map(); for (const r of rows) { const key = String(r[bi] || '').trim(); (g.get(key) || g.set(key, []).get(key)).push(r); } return [...g.entries()].map(([key, rs]) => { const v = liveAggSample(live, rs, fi); return [key, v == null ? null : Math.round(v * 10) / 10]; }); }
export const liveThreshold = (live) => (live.kind === 'age' ? live.days : live.n);
export const liveNeedsHelper = (live) => live.kind === 'age';
/** ערכי-הדוגמאות של הבעלים בצורת-התנאי: מספר ⇒ המספר · תאריך ⇒ ותק בימים היום (תלוי-זמן, מוצהר) */
/** ערך-הקבוצה מהדוגמאות (agg) — לציפייה ולהחלטה */
export function liveAggSample(live, rows, fi) { const vals = rows.map((r) => parseFloat(r[fi])).filter((v) => !isNaN(v)); if (live.agg === 'count') return rows.length; if (!vals.length) return null; const sum = vals.reduce((a, b) => a + b, 0); return live.agg === 'sum' ? sum : sum / vals.length; }
export function liveSample(live, raw) {
  if (live.kind !== 'age') { const v = parseFloat(raw); return isNaN(v) ? null : v; }
  const t = String(raw || '').trim(); let d = Date.parse(t); if (isNaN(d)) { const m = t.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/); if (m) { const y = +m[3]; d = Date.UTC(y < 100 ? 2000 + y : y, +m[2] - 1, +m[1]); } }
  if (isNaN(d)) return null; return Math.floor((Date.now() - d) / 86400000);
}
