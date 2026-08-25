// בדיקת-חוזה (רתמת-זהב) · siteUi — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/site-ui.test.mjs:
// שקע-הנתונים UI מוצהר בבדיקה עצמה (זהות-הערכים למקור נאכפת בבדיקת site-ui-labels).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/site-ui_test.dart  ⇒ exit 0
import 'site-ui.dart';

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  // שקע-נתונים: תת-קבוצה מערכי-האמת של site-ui-labels (verbatim מבדיקת-ה-JS).
  final ui = {
    'he': {'donate': 'לתרומה', 'goal': 'יעד', 'dir': 'rtl'},
    'en': {'donate': 'Donate', 'goal': 'Goal', 'dir': 'ltr'},
    'yi': {'donate': 'שפּענדן', 'goal': 'ציל', 'dir': 'rtl'},
  };

  var n = 0;

  // — שש דוגמאות-החוזה verbatim (site-ui.test.mjs / site-ui.contract.md) —
  _eq(siteUi('he', 'donate', ui), 'לתרומה', "1 ('he','donate')");
  n++;
  _eq(siteUi('en', 'goal', ui), 'Goal', "2 ('en','goal')");
  n++;
  _eq(siteUi('yi', 'dir', ui), 'rtl', "3 ('yi','dir') — גם כיוון-הכתיבה תווית");
  n++;
  _eq(siteUi('fr', 'donate', ui), 'לתרומה', "4 ('fr','donate') — שפה לא-מוכרת ⇒ מילון-he");
  n++;
  _eq(siteUi('en', 'no-such', ui), '', "5 ('en','no-such') — מפתח שאינו קיים באף מילון ⇒ ''");
  n++;
  _eq(
    siteUi('en', 'shalom', {
      'he': {'shalom': 'שלום'},
      'en': <String, dynamic>{},
    }),
    'שלום',
    "6 ('en','shalom') — מפתח חסר באנגלית ⇒ הערך העברי",
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(siteUi('he', 'donate', ui) == 'לתרומה', 'assert-live guard');

  print('OK siteUi: $n asserts passed');
}
