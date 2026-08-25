import 'lesson-price-for-tier.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/lesson-price-for-tier.test.mjs.
/// אם ירוק — Dart ≡ JS.
void main() {
  var f = 0;
  void ok(bool cond, String msg) {
    if (!cond) {
      print('✗ $msg');
      f = 1;
    }
  }

  final c0 = {'lessonPrice': 100, 'lessonPrice1': 80, 'lessonPrice2': 60};
  // 1) רמה 1
  ok(lessonPriceForTier(c0, '1') == 80, "tier '1' ≠ 80");
  // 2) רמה 2
  ok(lessonPriceForTier(c0, '2') == 60, "tier '2' ≠ 60");
  // 3) רמה 3 חסרה ⇒ מלא
  ok(lessonPriceForTier(c0, '3') == 100, "tier '3' חסר לא נפל ל-100");
  // 4) '' ⇒ מלא
  ok(lessonPriceForTier(c0, '') == 100, "tier '' ≠ 100");
  // 5) מחיר-רמה 0 = falsy ⇒ מלא
  ok(lessonPriceForTier({'lessonPrice': 100, 'lessonPrice1': 0}, '1') == 100,
      'lessonPrice1=0 לא נפל למלא');
  // 6) אובייקט ריק ⇒ 0
  ok(lessonPriceForTier({}, '2') == 0, 'אובייקט ריק ≠ 0');

  if (f != 0) throw StateError('lesson-price-for-tier: סטייה מהמקור');
  print('✓ lesson-price-for-tier: 6 דוגמאות-חוזה — ירוק');
}
