// בדיקת-חוזה (רתמת-זהב) · supLastInPeriod — מייבאת אך ורק את האטום-שלה (חוק-4).
// כל דוגמאות-החוזה + בדיקת-ה-JS זהות ביט-אחר-ביט למקור
// new/atoms/sup-last-in-period.test.mjs (שקע-הבדיקה: supLast = (sp) => sp.last || ''):
//   1) ‏null/null ⇒ true תמיד, גם ל-{} · 2) שנה תואמת ⇒ true · 3) שנה אחרת ⇒ false ·
//   4) שנה+חודש ⇒ true / חודש-שגוי ⇒ false · 5) חודש-בלבד ⇒ true ·
//   6) תורם-ריק עם סינון ⇒ false.
// כלל-8 (השוואת-מערכים אורך+איבר-איבר) — לא-רלוונטי: הפלט boolean בלבד.
// אם עובר ⇒ Dart≡JS. כשל ⇒ StateError.
// הרצה: dart run --enable-asserts new/dart-maor/sup-last-in-period_test.dart  ⇒ exit 0
import 'sup-last-in-period.dart';

// שקע-הבדיקה verbatim: ‏(sp) => sp.last || '' — ‏undefined/'' (falsy) ⇒ ''.
dynamic _supLast(dynamic sp) {
  final dynamic v = sp['last'];
  return (v == null || v == '' || v == false || v == 0) ? '' : v;
}

void _check(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) בלי סינון — true תמיד, גם לתורם ריק.
  _check(supLastInPeriod(<String, dynamic>{}, null, null, _supLast) == true,
      'דוגמה 1: null/null על {} ≠ true'); n++;
  _check(supLastInPeriod({'last': '2026-08-24'}, null, null, _supLast) == true,
      'דוגמה 1ב: null/null ≠ true'); n++;

  // 2) שנה תואמת.
  _check(supLastInPeriod({'last': '2026-08-24'}, 2026, null, _supLast) == true,
      'דוגמה 2: שנה 2026 ≠ true'); n++;

  // 3) שנה אחרת.
  _check(supLastInPeriod({'last': '2026-08-24'}, 2025, null, _supLast) == false,
      'דוגמה 3: שנה 2025 ≠ false'); n++;

  // 4) שנה+חודש.
  _check(supLastInPeriod({'last': '2026-08-24'}, 2026, 8, _supLast) == true,
      'דוגמה 4: 2026/8 ≠ true'); n++;
  _check(supLastInPeriod({'last': '2026-08-24'}, 2026, 7, _supLast) == false,
      'דוגמה 4ב: 2026/7 ≠ false'); n++;

  // 5) חודש בלבד (כל שנה).
  _check(supLastInPeriod({'last': '2026-08-24'}, null, 8, _supLast) == true,
      'דוגמה 5: חודש-בלבד ≠ true'); n++;

  // 6) אין תרומה + סינון ⇒ false.
  _check(supLastInPeriod(<String, dynamic>{}, 2026, null, _supLast) == false,
      'דוגמה 6: תורם-ריק עם סינון ≠ false'); n++;

  // קצוות-נאמנות-JS (מעבר לחוזה — מוודאים שהעוזרים לא סוטים):
  // ‏'08' ⇒ 8 (אפס-מוביל עשרוני, לא אוקטלי) — כבר מכוסה ב-4; חודש 12:
  _check(supLastInPeriod({'last': '2025-12-31'}, null, 12, _supLast) == true,
      'קצה: חודש 12 ≠ true'); n++;
  // מחרוזת קצרה — ‏slice סלחן (JS: +'20' = 20 ≠ 2026 ⇒ false, בלי זריקה).
  _check(supLastInPeriod({'last': '20'}, 2026, null, _supLast) == false,
      'קצה: iso קצר ⇒ false בלי זריקה'); n++;
  // ‏iso שאינו-תאריך — ‏+'ab' = NaN ⇒ ‏NaN !== 2026 ⇒ false.
  _check(supLastInPeriod({'last': 'abcd-ef-gh'}, 2026, null, _supLast) == false,
      'קצה: NaN ⇒ false'); n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(supLastInPeriod(<String, dynamic>{}, null, null, _supLast) == true,
      'assert-live guard');

  print('OK supLastInPeriod: $n דוגמאות — ירוק');
}
