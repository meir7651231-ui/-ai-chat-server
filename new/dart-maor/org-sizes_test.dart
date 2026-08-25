// בדיקת-חוזה (רתמת-זהב) · orgSizes — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/org-sizes.test.mjs —
// שם הבדיקה היא צילום-ערך (JSON.stringify) של כל השדות; כאן נבדק כל שדה-ושדה verbatim.
// הרצה: dart run --enable-asserts new/dart-maor/org-sizes_test.dart  ⇒ exit 0
import 'org-sizes.dart';

void main() {
  var n = 0;
  final s = orgSizes;

  // 1) אורך 3.
  assert(s.length == 3, 'FAIL: אורך ${s.length} ≠ 3');
  n++;

  // 2) small — {id,label,sub} verbatim.
  assert(s[0]['id'] == 'small', "FAIL: [0].id ≠ 'small'");
  assert(s[0]['label'] == 'קטן', "FAIL: [0].label ≠ 'קטן'");
  assert(s[0]['sub'] == 'עד 5 אנשי צוות', "FAIL: [0].sub ≠ 'עד 5 אנשי צוות'");
  n++;

  // 3) medium — כולל en-dash '5–20'.
  assert(s[1]['id'] == 'medium', "FAIL: [1].id ≠ 'medium'");
  assert(s[1]['label'] == 'בינוני', "FAIL: [1].label ≠ 'בינוני'");
  assert(s[1]['sub'] == '5–20 אנשי צוות', "FAIL: [1].sub ≠ '5–20 אנשי צוות'");
  n++;

  // 4) large — כולל '20+'.
  assert(s[2]['id'] == 'large', "FAIL: [2].id ≠ 'large'");
  assert(s[2]['label'] == 'גדול', "FAIL: [2].label ≠ 'גדול'");
  assert(s[2]['sub'] == '20+ אנשי צוות', "FAIL: [2].sub ≠ '20+ אנשי צוות'");
  n++;

  // 5) כל פריט = בדיוק 3 מפתחות (id,label,sub) — אין שדה עודף/חסר.
  for (final row in s) {
    assert(row.length == 3, 'FAIL: פריט עם ${row.length} מפתחות ≠ 3');
    assert(row.containsKey('id') &&
        row.containsKey('label') &&
        row.containsKey('sub'), 'FAIL: מפתח חסר');
  }
  n++;

  // 6) מזהים ייחודיים ובסדר small<medium<large.
  final ids = s.map((r) => r['id']).toList();
  assert(ids.join(',') == 'small,medium,large',
      "FAIL: סדר/מזהים ≠ small,medium,large — ${ids.join(',')}");
  n++;

  print('OK orgSizes: $n asserts passed');
}
