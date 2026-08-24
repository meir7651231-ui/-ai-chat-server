// בדיקת-חוזה (רתמת-זהב) · assignmentRedeemed — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/assignment-redeemed.test.mjs:
//   שקעים מזויפים כמתועד בחוזה —
//     liveRedemptions = (a) => a.redemptions.filter((r) => !r.voidedAt)  (מחריג מבוטלים)
//     hebYearOf       = (iso) => Number(iso.slice(0,4))                  (זיוף דטרמיניסטי)
//   1) בלי-חג: {componentId:'c1'} ⇒ true ; רכיב-אחר 'c2' ⇒ false
//   2) בלי-חג: המימוש היחיד מבוטל (voidedAt) ⇒ false
//   3) חג {iso:'2026-04-02',name:'פסח'} + מימוש {c1,'פסח','2026-04-20'} ⇒ true (אותה שנה)
//   4) אותו מימוש אך date:'2025-04-10' ⇒ false (שנה אחרת — מחזורי)
//   5) מימוש בלי date ('') ⇒ false
//   6) שם-חג שונה ('סוכות') ⇒ false
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/assignment-redeemed_test.dart  ⇒ exit 0
import 'assignment-redeemed.dart';

// שקעי-הבדיקה — מקבילים ביט-אחר-ביט למקור-ה-JS.
List<Map<String, dynamic>> _live(Map<String, dynamic> a) =>
    (a['redemptions'] as List)
        .cast<Map<String, dynamic>>()
        // !r.voidedAt : falsy = null/missing/'' ⇒ נשמר; מחרוזת-תאריך ⇒ מוחרג.
        .where((r) => r['voidedAt'] == null || r['voidedAt'] == '')
        .toList();

int _year(String iso) => int.parse(iso.substring(0, 4));

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;
  const h = {'iso': '2026-04-02', 'name': 'פסח'};

  // 1) בלי חג — מימוש-חי של הרכיב.
  final a1 = {
    'redemptions': [
      {'componentId': 'c1'},
    ],
  };
  _eq(assignmentRedeemed(a1, 'c1', null, _live, _year), true,
      'בלי-חג: מימוש-קיים ⇒ true');
  n++;
  _eq(assignmentRedeemed(a1, 'c2', null, _live, _year), false,
      'בלי-חג: רכיב-אחר ⇒ false');
  n++;

  // 2) מימוש מבוטל מוחרג.
  final a2 = {
    'redemptions': [
      {'componentId': 'c1', 'voidedAt': '2026-01-01'},
    ],
  };
  _eq(assignmentRedeemed(a2, 'c1', null, _live, _year), false, 'מבוטל מוחרג');
  n++;

  // 3) מתנת-חג — אותו שם, אותה שנה.
  final a3 = {
    'redemptions': [
      {'componentId': 'c1', 'holiday': 'פסח', 'date': '2026-04-20'},
    ],
  };
  _eq(assignmentRedeemed(a3, 'c1', h, _live, _year), true, 'חג: אותה-שנה ⇒ true');
  n++;

  // 4) שנה אחרת — לא מכסה.
  final a4 = {
    'redemptions': [
      {'componentId': 'c1', 'holiday': 'פסח', 'date': '2025-04-10'},
    ],
  };
  _eq(assignmentRedeemed(a4, 'c1', h, _live, _year), false, 'חג-אשתקד ⇒ false');
  n++;

  // 5) בלי תאריך — לא נספר.
  final a5 = {
    'redemptions': [
      {'componentId': 'c1', 'holiday': 'פסח', 'date': ''},
    ],
  };
  _eq(assignmentRedeemed(a5, 'c1', h, _live, _year), false, 'בלי-תאריך ⇒ false');
  n++;

  // 6) שם-חג שונה.
  final a6 = {
    'redemptions': [
      {'componentId': 'c1', 'holiday': 'סוכות', 'date': '2026-10-01'},
    ],
  };
  _eq(assignmentRedeemed(a6, 'c1', h, _live, _year), false,
      'שם-חג-שונה ⇒ false');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(assignmentRedeemed(a3, 'c1', h, _live, _year) == true,
      'assert-live guard');

  print('OK assignmentRedeemed: $n asserts passed');
}
