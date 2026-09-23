// ⏱️ live-expr — ביטוי-הערך של תנאי-חי (הכרעת-בעלים 23.9 «תחבר כבר»): צורת-תנאי אחת הייתה «שדה יחס מספר»; כאן נוספת «שדה-תאריך יחס משך»
//   (ותק בימים, DateTime.now בזמן-ריצה כמו ds_calendar). מקום אחד לכל הקוראים (insight · app-shell · לוח) — לא שלושה העתקים.
//   live = { slug, field, op:'<'|'>', n, kind:'num'|'age', days? }. אין המצאה: תנאי-משך על שדה שאינו תאריך אינו נוצר (app-ds משאיר סטטי ומדווח).
export const AGE_HELPER = `double _ageDays(String s) { final t = s.trim(); DateTime? d = DateTime.tryParse(t); if (d == null) { final m = RegExp(r'^(\\d{1,2})[./-](\\d{1,2})[./-](\\d{2,4})$').firstMatch(t); if (m != null) { final y = int.parse(m.group(3)!); d = DateTime(y < 100 ? 2000 + y : y, int.parse(m.group(2)!), int.parse(m.group(1)!)); } } return d == null ? double.nan : DateTime.now().difference(d).inDays.toDouble(); }`;
export const liveValue = (live, r = 'r', k = (s) => `'${s}'`) => live.kind === 'age' ? `_ageDays(${r}[${k(live.field)}] ?? '')` : `(double.tryParse(${r}[${k(live.field)}] ?? '') ?? double.nan)`;
export const liveThreshold = (live) => (live.kind === 'age' ? live.days : live.n);
export const liveNeedsHelper = (live) => live.kind === 'age';
/** ערכי-הדוגמאות של הבעלים בצורת-התנאי: מספר ⇒ המספר · תאריך ⇒ ותק בימים היום (תלוי-זמן, מוצהר) */
export function liveSample(live, raw) {
  if (live.kind !== 'age') { const v = parseFloat(raw); return isNaN(v) ? null : v; }
  const t = String(raw || '').trim(); let d = Date.parse(t); if (isNaN(d)) { const m = t.match(/^(\d{1,2})[./-](\d{1,2})[./-](\d{2,4})$/); if (m) { const y = +m[3]; d = Date.UTC(y < 100 ? 2000 + y : y, +m[2] - 1, +m[1]); } }
  if (isNaN(d)) return null; return Math.floor((Date.now() - d) / 86400000);
}
