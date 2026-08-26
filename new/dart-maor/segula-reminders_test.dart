// בדיקת-חוזה + הסגר · segulaReminders. הרצה:
//   dart run --enable-asserts segula-reminders_test.dart
import 'segula-reminders.dart';

// שוויון-עמוק סובלני-NaN (NaN==NaN⇒true, כמו השוואת-החוזה; jsonEncode דוחה NaN).
bool deepEq(dynamic a, dynamic b) {
  if (a is num && b is num) {
    if (a.isNaN || b.isNaN) return a.isNaN && b.isNaN;
    return a == b;
  }
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) if (!deepEq(a[i], b[i])) return false;
    return true;
  }
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  return a == b;
}

String show(dynamic v) => v.toString();

void expectEq(dynamic got, dynamic want, String label) {
  if (!deepEq(got, want)) {
    throw StateError('✗ $label\n  got : ${show(got)}\n  want: ${show(want)}');
  }
}

void main() {
  // 5 דוגמאות-החוזה מהמקור (segula-reminders.test.mjs).
  expectEq(segulaReminders('2026-08-24'), [
    {'day': 1, 'date': '2026-08-25', 'final': false},
    {'day': 7, 'date': '2026-08-31', 'final': false},
    {'day': 21, 'date': '2026-09-14', 'final': false},
    {'day': 35, 'date': '2026-09-28', 'final': false},
    {'day': 40, 'date': '2026-10-03', 'final': true},
  ], 'ברירת-מחדל [1,7,21,35,40]');

  // דילוג-מותאם יחיד ⇒ final:true.
  expectEq(segulaReminders('2026-01-01', [3]),
      [{'day': 3, 'date': '2026-01-04', 'final': true}], 'מותאם [3]');

  // הסגר #1 — שבר-שלילי: trunc על-הסכום. base.day=25, offset -2.9 ⇒ 25-2.9=22.1 ⇒ trunc 22.
  expectEq(segulaReminders('2026-08-25', [-2.9]),
      [{'day': -2.9, 'date': '2026-08-22', 'final': true}], 'שבר-שלילי trunc-על-סכום');

  // שבר-חיובי: 25+1.9=26.9 ⇒ trunc 26.
  expectEq(segulaReminders('2026-08-25', [1.9]),
      [{'day': 1.9, 'date': '2026-08-26', 'final': true}], 'שבר-חיובי');

  // הסגר #2 — NaN: ⇒ "NaN-NaN-NaN", final:false (NaN===max false). ללא-זריקה.
  expectEq(segulaReminders('2026-08-24', [double.nan]),
      [{'day': double.nan, 'date': 'NaN-NaN-NaN', 'final': false}], 'NaN');

  // ±∞: Infinity===max true ⇒ final:true; date NaN. ללא-זריקה.
  expectEq(segulaReminders('2026-08-24', [double.infinity]), [
    {'day': double.infinity, 'date': 'NaN-NaN-NaN', 'final': true}
  ], 'Infinity');

  // גלישת-חודש (נרמול, לא "2026-13-05"): 24+40 ⇒ אוקטובר.
  expectEq(segulaReminders('2026-08-24', [40])[0],
      {'day': 40, 'date': '2026-10-03', 'final': true}, 'נרמול-חודש');

  print('✓ segula-reminders (Dart): כל דוגמאות-החוזה + הסגר — ירוק');
}
