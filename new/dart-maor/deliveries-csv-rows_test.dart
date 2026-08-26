import '../dart-data-maor/deliveries-csv-rows-terms.dart';
// בדיקת-חוזה (רתמת-זהב) · deliveriesCsvRows — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/deliveries-csv-rows.test.mjs
// (אותם קלטים→פלטים; השקעים: statusLabel כבמקור · termOf=(c,k,fb)=>c.terms?.[k]??fb):
//   1) עם config+מונח-דריסה ⇒ כותרת ['תאריך','לקוח','כתובת','מתנדב','סטטוס','הערה']
//   2) שורה מלאה (trim+', ') ⇒ ['2026-08-01','כהן','הרצל 3, צפת','משה','איסוף','דחוף']
//   3) לא-נמצאים/ריקים ⇒ ['','לוי','','','נמסר','']
//   6) שלוש שורות בסדר deliveries
//   4) בלי config ⇒ כותרת-ברירת-מחדל, ושקע-termOf (שזורק) לא נקרא כלל
//   5) deliveries ריק ⇒ כותרת בלבד (אורך 1)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/deliveries-csv-rows_test.dart  ⇒ exit 0
import 'deliveries-csv-rows.dart';

// שקע-הבדיקה statusLabel — כבמקור: pickup='איסוף' · enroute='בדרך' · אחרת 'נמסר'.
String _statusLabel(dynamic s) => s == 'pickup' ? 'איסוף' : (s == 'enroute' ? 'בדרך' : 'נמסר');

// שקע-הבדיקה termOf — c.terms?.[k] ?? fb.
String _termOf(dynamic c, String k, String fb) =>
    (((c as Map)['terms'] as Map?)?[k] as String?) ?? fb;

// שקע-בום — termOf שזורק אם הופעל בלי config (מוכיח שהשקע לא נקרא, חוזה §4).
String _boom(dynamic c, String k, String fb) => throw StateError('termOf הופעל בלי config');

final Map<String, dynamic> _db = {
  'distributionDays': [
    {'id': 'd1', 'date': '2026-08-01'},
  ],
  'families': [
    {'id': 'f1', 'name': 'כהן', 'address': ' הרצל 3 ', 'city': 'צפת'},
    {'id': 'f2', 'name': 'לוי', 'address': '', 'city': ''},
  ],
  'volunteers': [
    {'id': 'v1', 'name': 'משה'},
  ],
  'deliveries': [
    {'dayId': 'd1', 'familyId': 'f1', 'volunteerId': 'v1', 'status': 'pickup', 'note': 'דחוף'},
    {'dayId': 'dX', 'familyId': 'f2', 'volunteerId': 'vX', 'status': 'delivered'},
  ],
};

String _ser(List<String> xs) => xs.map((s) => '<$s>').join('|');

void _eq(List<String> got, List<String> want, String label) {
  if (_ser(got) != _ser(want)) {
    throw StateError('FAIL [$label]:\n got =[${_ser(got)}]\n want=[${_ser(want)}]');
  }
}

void main() {
  var n = 0;

  // 1–3, 6) עם config ומונח-דריסה.
  final rows = deliveriesCsvRows(
      _db, {'terms': {'entity.family': 'לקוח'}}, _termOf, _statusLabel, term: (k)=>kTerms[k]!);
  _eq(rows[0], ['תאריך', 'לקוח', 'כתובת', 'מתנדב', 'סטטוס', 'הערה'], '1 כותרת עם מונח');
  n++;
  _eq(rows[1], ['2026-08-01', 'כהן', 'הרצל 3, צפת', 'משה', 'איסוף', 'דחוף'], '2 שורה מלאה');
  n++;
  _eq(rows[2], ['', 'לוי', '', '', 'נמסר', ''], '3 לא-נמצאים/ריקים');
  n++;
  if (rows.length != 3) throw StateError('FAIL [6]: got ${rows.length} rows, want 3');
  n++;

  // 4) בלי config — fallback, והשקע לא נקרא כלל (termOf שזורק לא מופעל).
  final rows2 = deliveriesCsvRows(_db, null, _boom, _statusLabel, term: (k)=>kTerms[k]!);
  _eq(rows2[0], ['תאריך', 'משפחה', 'כתובת', 'מתנדב', 'סטטוס', 'הערה'], '4 כותרת ברירת-מחדל');
  n++;

  // 5) deliveries ריק ⇒ כותרת בלבד.
  final db3 = Map<String, dynamic>.from(_db)..['deliveries'] = <dynamic>[];
  final rows3 = deliveriesCsvRows(db3, null, _boom, _statusLabel, term: (k)=>kTerms[k]!);
  if (rows3.length != 1) throw StateError('FAIL [5]: got ${rows3.length} rows, want 1');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_ser(rows[2]) == '<>|<לוי>|<>|<>|<נמסר>|<>', 'assert-live guard');

  print('OK deliveriesCsvRows: $n asserts passed');
}
