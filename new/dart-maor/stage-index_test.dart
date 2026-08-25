// בדיקת-חוזה (רתמת-זהב) · stageIndex — מייבאת אך ורק את האטום-שלה (חוק-4).
// כל דוגמאות-החוזה (stage-index.contract.md 1–4) ובדיקת-ה-JS
// (new/atoms/stage-index.test.mjs — 6 השוואות) מתורגמות ביט-אחר-ביט:
// אותם קלטים ⇒ אותם אינדקסים. הפלט סקלרי (int) ⇒ כלל-8 (מערכים) לא-ישים.
// הרצה: dart run --enable-asserts new/dart-maor/stage-index_test.dart ⇒ OK
import 'stage-index.dart';

void main() {
  // [קלט, פלט-מוקלט] — הועתק אחד-לאחד מ-stage-index.test.mjs.
  final cases = <List<dynamic>>[
    // 1-3) חמשת השלבים בסדרם (חוזה 1–3)
    ['new', 0],
    ['lead', 1],
    ['eyes', 2],
    ['answer', 3],
    ['done', 4],
    // 4) לא-מוכר ⇒ 0 (לא ‎-1) — חוזה 4
    ['foo', 0],
  ];

  var f = 0;
  for (final row in cases) {
    final got = stageIndex(row[0]);
    if (got != row[1]) {
      print("✗ stageIndex('${row[0]}') ⇒ $got ≠ ${row[1]}");
      f = 1;
    }
  }
  if (f != 0) throw StateError('stage-index: סטייה מדוגמאות-החוזה');
  print('✓ stage-index: ${cases.length} דוגמאות-חוזה — ירוק');
  print('OK');
}
