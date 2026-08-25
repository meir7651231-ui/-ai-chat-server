// בדיקת-חוזה · xlat — מתרגמת את new/atoms/xlat.test.mjs אחד-לאחד (כלל-8: בלי join).
// הרצה: dart run --enable-asserts new/dart-maor/xlat_test.dart ⇒ OK
import 'xlat.dart';

// ה-norm של הבדיקה-המקורית: lowercase · הסרת-ניקוד · נרמול-סופיות · הסרת-סימנים · trim
final _finals = {'ך': 'כ', 'ם': 'מ', 'ן': 'נ', 'ף': 'פ', 'ץ': 'צ'};
dynamic norm(dynamic t) {
  var s = (t ?? '').toString().toLowerCase();
  // ‏[֑-ׇ] — טווח-הניקוד U+0591–U+05C7
  s = s.replaceAll(RegExp(r'[֑-ׇ]'), '');
  s = s.split('').map((c) => _finals[c] ?? c).join('');
  s = s.replaceAll(RegExp("['\"׳״\\-–._]"), '');
  return s.trim();
}

bool has(String q, String x) => expandQuery(q, norm).contains(x);

void main() {
  if (!has('כהן', 'cohen') || !has('כהן', 'коэн')) throw StateError('כהן לא מתרחב');
  if (!has('cohen', 'כהן')) throw StateError('כיוון-הפוך נכשל');
  if (!has('משה', 'מוישי')) throw StateError('כינוי חסר');
  if (expandQuery('xyz', norm).length != 1) throw StateError('לא-מוכר חייב להישאר לבד');
  if (expandQuery('כהן', norm)[0] != 'כהן') throw StateError('המקור חייב להיות ראשון');
  if (xlatTable.keys.length < 20) throw StateError('הטבלה נחתכה');
  print('OK xlat: 6 asserts passed (table: ${xlatTable.keys.length})');
}
