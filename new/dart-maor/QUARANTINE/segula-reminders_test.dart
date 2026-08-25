// בדיקת-חוזה (רתמת-זהב) · segulaReminders — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/segula-reminders.test.mjs:
//   ברירת-מחדל '2026-08-24' ⇒ 5 תזכורות (1/7/21/35/40, האחרונה final) +
//   offsets מותאם ('2026-01-01',[3]) ⇒ [{day:3,date:'2026-01-04',final:true}].
// השוואת-מערכים = אורך + איבר-איבר (כלל-8 — לעולם לא join). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/segula-reminders_test.dart  ⇒ exit 0
import 'segula-reminders.dart';

void _eqRow(dynamic got, Map<String, dynamic> want, String label) {
  final g = got as Map;
  for (final k in ['day', 'date', 'final']) {
    if (g[k] != want[k]) {
      throw StateError('FAIL [$label.$k]: got=${g[k]} want=${want[k]}');
    }
  }
  if (g.length != want.length) {
    throw StateError('FAIL [$label]: keys=${g.length} want=${want.length}');
  }
}

void _eqList(dynamic got, List<Map<String, dynamic>> want, String label) {
  final g = got as List;
  if (g.length != want.length) {
    throw StateError('FAIL [$label]: length=${g.length} want=${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    _eqRow(g[i], want[i], '$label[$i]');
  }
}

void main() {
  var n = 0;

  // — דוגמאות-החוזה verbatim (segula-reminders.test.mjs) —
  // ברירת-מחדל: startIso='2026-08-24' ⇒ אורך 5, כל שורה, האחרונה final:true.
  _eqList(segulaReminders('2026-08-24'), [
    {'day': 1, 'date': '2026-08-25', 'final': false},
    {'day': 7, 'date': '2026-08-31', 'final': false},
    {'day': 21, 'date': '2026-09-14', 'final': false},
    {'day': 35, 'date': '2026-09-28', 'final': false},
    {'day': 40, 'date': '2026-10-03', 'final': true},
  ], 'default-2026-08-24');
  n += 6; // אורך + 5 שורות

  // offsets מותאם: חציית-חודש (01-01 + 3 ⇒ 01-04), דילוג-יחיד ⇒ final:true.
  _eqList(segulaReminders('2026-01-01', [3]), [
    {'day': 3, 'date': '2026-01-04', 'final': true},
  ], 'custom-[3]');
  n += 2;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert((segulaReminders('2026-08-24') as List).length == 5, 'assert-live');

  print('OK segulaReminders: $n asserts passed');
}
