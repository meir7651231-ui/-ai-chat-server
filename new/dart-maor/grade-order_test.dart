// בדיקת-חוזה (רתמת-זהב) · GRADE_ORDER — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/grade-order.test.mjs:
//   length→13 · [0]→'גן' · [1]→'א' · [12]→'יב' · indexOf('ז')→7 ·
//   המערך המלא→['גן','א','ב','ג','ד','ה','ו','ז','ח','ט','י','יא','יב'] ·
//   אין כפילויות (Set.size == length). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/grade-order_test.dart  ⇒ exit 0
import 'grade-order.dart';

void _eqStr(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void _eqInt(int got, int want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // 1) אורך = 13.
  _eqInt(gradeOrder.length, 13, 'length');
  n++;

  // 2) [0] → 'גן'.
  _eqStr(gradeOrder[0], 'גן', '[0]');
  n++;

  // 3) [1] → 'א'.
  _eqStr(gradeOrder[1], 'א', '[1]');
  n++;

  // 4) [12] → 'יב'.
  _eqStr(gradeOrder[12], 'יב', '[12]');
  n++;

  // 5) indexOf('ז') → 7.
  _eqInt(gradeOrder.indexOf('ז'), 7, "indexOf('ז')");
  n++;

  // 6) המערך המלא — צילום-ערך זהה, סדר+תוכן (איבר-איבר, לא join עיוור).
  const want = <String>[
    'גן', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב',
  ];
  _eqInt(gradeOrder.length, want.length, 'המערך המלא: אורך');
  for (var i = 0; i < want.length; i++) {
    _eqStr(gradeOrder[i], want[i], 'המערך המלא[$i]');
  }
  n++;

  // 7) אין כפילויות — Set.length == List.length.
  _eqInt(gradeOrder.toSet().length, gradeOrder.length, 'אין כפילויות');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(gradeOrder.length == 13, 'assert-live guard');

  print('OK gradeOrder: $n asserts passed');
}
