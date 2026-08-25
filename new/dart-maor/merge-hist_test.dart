// בדיקת-חוזה (רתמת-זהב) · mergeHist — מייבאת אך ורק את האטום-שלה (חוק-4).
// 6 דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/merge-hist.test.mjs
// (אותם קלטים→פלטים). JSON.stringify של JS ⇒ jsonEncode (dart:convert, ספריית-שפה);
// הפלט-הצפוי = מחרוזות-ה-Golden כמות-שהן. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/merge-hist_test.dart  ⇒ exit 0
import 'dart:convert';
import 'merge-hist.dart';

int _f = 0;
void _ok(String got, String want, String label) {
  if (got != want) {
    // ignore: avoid_print
    print('✗ ' + label + ' ⇒ ' + got + ' ≠ ' + want);
    _f = 1;
  }
}

void main() {
  // קלטי-ה-Golden (JSON.parse של המקור): אובייקט·מחרוזת-בודדת-במערך·מחרוזת-ריקה.
  final obj = <String, Object?>{'amount': 100};
  const date = '2026-08-24';
  const empty = '';

  // 1) [{amount:100}] , [{amount:100}] ⇒ [{"amount":100}]
  _ok(jsonEncode(mergeHist(<Object?>[Map.of(obj)], <Object?>[Map.of(obj)])),
      '[{"amount":100}]', 'obj+obj');

  // 2) [{amount:100}] , ["2026-08-24"] ⇒ ספרד-מחרוזת + amount
  _ok(
      jsonEncode(mergeHist(<Object?>[Map.of(obj)], <Object?>[date])),
      '[{"0":"2","1":"0","2":"2","3":"6","4":"-","5":"0","6":"8","7":"-","8":"2","9":"4","amount":100}]',
      'obj+date');

  // 3) [{amount:100}] , "" ⇒ [{"amount":100}]
  _ok(jsonEncode(mergeHist(<Object?>[Map.of(obj)], empty)),
      '[{"amount":100}]', 'obj+empty');

  // 4) ["2026-08-24"] , [{amount:100}] ⇒ ספרד-מחרוזת + amount (אינדקסים עולים תחילה)
  _ok(
      jsonEncode(mergeHist(<Object?>[date], <Object?>[Map.of(obj)])),
      '[{"0":"2","1":"0","2":"2","3":"6","4":"-","5":"0","6":"8","7":"-","8":"2","9":"4","amount":100}]',
      'date+obj');

  // 5) ["2026-08-24"] , ["2026-08-24"] ⇒ ספרד-מחרוזת בלבד
  _ok(
      jsonEncode(mergeHist(<Object?>[date], <Object?>[date])),
      '[{"0":"2","1":"0","2":"2","3":"6","4":"-","5":"0","6":"8","7":"-","8":"2","9":"4"}]',
      'date+date');

  // 6) ["2026-08-24"] , "" ⇒ ספרד-מחרוזת בלבד
  _ok(
      jsonEncode(mergeHist(<Object?>[date], empty)),
      '[{"0":"2","1":"0","2":"2","3":"6","4":"-","5":"0","6":"8","7":"-","8":"2","9":"4"}]',
      'date+empty');

  if (_f != 0) throw StateError('merge-hist: golden mismatch');
  // ignore: avoid_print
  print('✓ merge-hist: 6 הקלטות-Golden — ירוק');
}
