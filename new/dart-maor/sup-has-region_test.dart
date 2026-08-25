// בדיקת-חוזה (רתמת-זהב) · supHasRegion — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sup-has-region.test.mjs
// (אותם קלטים→פלטים; השקע ap = sp => sp.rows):
//   1) ({rows:[{region:'il'}]}, 'il')               ⇒ true
//   2) ({rows:[{region:'il'}]}, 'intl')             ⇒ false
//   3) ({rows:[]}, 'il')                            ⇒ false
//   4) ({rows:[{region:'intl'},{region:'il'}]}, 'intl') ⇒ true
//   5) ({rows:[{region:'intl'},{region:'il'}]}, 'il')   ⇒ true
//   6) ({rows:[{region:'intl'}]}, 'il')             ⇒ false
// הפלט בוליאני (אין השוואת-מערכים ⇒ כלל-8 אינו נדרש כאן). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/sup-has-region_test.dart  ⇒ exit 0
import 'sup-has-region.dart';

// שקע-הבדיקה — מקביל ל-ap = sp => sp.rows במקור-ה-JS.
List<dynamic> _ap(dynamic sp) => (sp as Map)['rows'] as List;

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // 1) שורה יחידה באזור המבוקש ⇒ true.
  _eq(
    supHasRegion({
      'rows': [
        {'region': 'il'},
      ],
    }, 'il', _ap),
    true,
    "il מול ['il']",
  );
  n++;

  // 2) שורה יחידה באזור אחר ⇒ false.
  _eq(
    supHasRegion({
      'rows': [
        {'region': 'il'},
      ],
    }, 'intl', _ap),
    false,
    "intl מול ['il']",
  );
  n++;

  // 3) אין טלפונים ⇒ false.
  _eq(supHasRegion({'rows': []}, 'il', _ap), false, 'רשימה ריקה');
  n++;

  // 4) שתי שורות, המבוקש ראשון ⇒ true.
  _eq(
    supHasRegion({
      'rows': [
        {'region': 'intl'},
        {'region': 'il'},
      ],
    }, 'intl', _ap),
    true,
    "intl מול ['intl','il']",
  );
  n++;

  // 5) שתי שורות, המבוקש שני ⇒ true.
  _eq(
    supHasRegion({
      'rows': [
        {'region': 'intl'},
        {'region': 'il'},
      ],
    }, 'il', _ap),
    true,
    "il מול ['intl','il']",
  );
  n++;

  // 6) רק intl כשמבוקש il ⇒ false.
  _eq(
    supHasRegion({
      'rows': [
        {'region': 'intl'},
      ],
    }, 'il', _ap),
    false,
    "il מול ['intl']",
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    supHasRegion({
      'rows': [
        {'region': 'il'},
      ],
    }, 'il', _ap),
    'assert-live guard',
  );

  print('OK supHasRegion: $n asserts passed');
}
