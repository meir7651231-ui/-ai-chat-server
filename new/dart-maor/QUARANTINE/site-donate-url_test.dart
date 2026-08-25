// בדיקת-חוזה (רתמת-זהב) · siteDonateUrl — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/site-donate-url.test.mjs
// (שהן בדיוק 7 הדוגמאות-המחייבות של site-donate-url.contract.md):
//   1) {site:{donateUrl:'https://pay.me/x'}}                        ⇒ 'https://pay.me/x'
//   2) {site:{donateUrl:''}, integrations:{payments:{payUrl:'https://p.io/q'}}} ⇒ 'https://p.io/q'
//   3) שניהם קיימים                                                  ⇒ הישיר מנצח
//   4) בלי site בכלל                                                 ⇒ payUrl
//   5) {}                                                            ⇒ null
//   6) לא-מחרוזת (5/7) נפסל בשתי התחנות                              ⇒ null
//   7) payments בלי payUrl                                           ⇒ null
// הפלט סקלרי (String/null) ⇒ השוואת-ערך ישירה; כלל-8 (איבר-איבר) לא נדרש — אין מערכים.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/site-donate-url_test.dart  ⇒ exit 0
import 'site-donate-url.dart';

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=${got == null ? 'null' : '"$got"'}'
        ' want=${want == null ? 'null' : '"$want"'}');
  }
}

void main() {
  var n = 0;

  // 1) הישיר גובר.
  _eq(
    siteDonateUrl({
      'site': {'donateUrl': 'https://pay.me/x'},
    }),
    'https://pay.me/x',
    'הישיר לא הוחזר',
  );
  n++;

  // 2) ריק אינו נחשב — נפילה ל-payUrl.
  _eq(
    siteDonateUrl({
      'site': {'donateUrl': ''},
      'integrations': {
        'payments': {'payUrl': 'https://p.io/q'},
      },
    }),
    'https://p.io/q',
    'נפילה-ל-payUrl נכשלה',
  );
  n++;

  // 3) שניהם קיימים — הישיר מנצח.
  _eq(
    siteDonateUrl({
      'site': {'donateUrl': 'https://pay.me/x'},
      'integrations': {
        'payments': {'payUrl': 'https://p.io/q'},
      },
    }),
    'https://pay.me/x',
    'עדיפות-הישיר נשברה',
  );
  n++;

  // 4) בלי site בכלל.
  _eq(
    siteDonateUrl({
      'integrations': {
        'payments': {'payUrl': 'https://p.io/q'},
      },
    }),
    'https://p.io/q',
    'payUrl בלי site לא הוחזר',
  );
  n++;

  // 5) קונפיג ריק.
  _eq(siteDonateUrl(<String, dynamic>{}), null, 'קונפיג ריק לא החזיר null');
  n++;

  // 6) לא-מחרוזת נפסל בשתי התחנות.
  _eq(
    siteDonateUrl({
      'site': {'donateUrl': 5},
      'integrations': {
        'payments': {'payUrl': 7},
      },
    }),
    null,
    'לא-מחרוזת לא נפסל',
  );
  n++;

  // 7) payments בלי payUrl.
  _eq(
    siteDonateUrl({
      'integrations': {'payments': <String, dynamic>{}},
    }),
    null,
    'payments ריק לא החזיר null',
  );
  n++;

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    siteDonateUrl({
          'site': {'donateUrl': 'https://a.b/c'},
        }) ==
        'https://a.b/c',
    'assert-live guard',
  );

  print('OK siteDonateUrl: $n asserts passed');
}
