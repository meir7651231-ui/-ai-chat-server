// בדיקת-חוזה (רתמת-זהב) · orgSlugFromUrl — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/org-slug-from-url.test.mjs
// (‏undefined של JS ⇒ null ב-Dart), ובנוסף קצוות-URLSearchParams שאומתו מול Node חי:
// first-wins · percent-decode סלחני (מפתח וערך) · בלי-'?' · '??' · ‏'?org=' ריק ·
// '+'⇒רווח · ‏% שבור · רצועות-ריקות · קלט-לא-מחרוזתי · '\n' · רגישות-רישיות.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/org-slug-from-url_test.dart  ⇒ exit 0
import 'org-slug-from-url.dart';

void _eq(dynamic got, dynamic want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — שמונה דוגמאות-הבדיקה verbatim (org-slug-from-url.test.mjs) —
  _eq(orgSlugFromUrl('?org=demo'), 'demo', '1 חוקי בסיסי');                       n++;
  _eq(orgSlugFromUrl('?x=1&org=or-rishon-2'), 'or-rishon-2', '2 פרמטר-שני');      n++;
  _eq(orgSlugFromUrl('?org=UPPER'), null, '3 אותיות-גדולות');                     n++;
  _eq(orgSlugFromUrl('?org=a'), null, '4 קצר מ-2');                               n++;
  _eq(orgSlugFromUrl('?org=${'a' * 41}'), null, '5 ארוך מ-40');                   n++;
  _eq(orgSlugFromUrl('?org=../etc'), null, '6 עוין ../etc');                      n++;
  _eq(orgSlugFromUrl(''), null, '7 מחרוזת-ריקה');                                 n++;
  _eq(orgSlugFromUrl(null), null, '8 undefined⇒null');                            n++;

  // — גבולות-אורך חיוביים (ערבות-1 בחוזה: 2-40 כולל) —
  _eq(orgSlugFromUrl('?org=ab'), 'ab', '9 בדיוק 2');                              n++;
  _eq(orgSlugFromUrl('?org=${'a' * 40}'), 'a' * 40, '10 בדיוק 40');               n++;

  // — קצוות-URLSearchParams, אומתו מול המקור ב-Node (זהה-ביט) —
  _eq(orgSlugFromUrl('?org=demo&org=xx'), 'demo', '11 כפול ⇒ הראשון מנצח');       n++;
  _eq(orgSlugFromUrl('?x=%zz&org=demo'), 'demo', '12 %-שבור בפרמטר-אחר');         n++;
  _eq(orgSlugFromUrl('?org=%64emo'), 'demo', '13 percent-decode בערך');           n++;
  _eq(orgSlugFromUrl('%6Frg=demo'), 'demo', '14 percent-decode במפתח, בלי ?');    n++;
  _eq(orgSlugFromUrl('org=demo'), 'demo', '15 בלי ? מוביל');                      n++;
  _eq(orgSlugFromUrl('??org=demo'), null, '16 ?? ⇒ מפתח "?org"');                 n++;
  _eq(orgSlugFromUrl('?org='), null, '17 ערך-ריק ⇒ falsy');                       n++;
  _eq(orgSlugFromUrl('?org=de+mo'), null, "18 '+'⇒רווח ⇒ נכשל-רג'קס");            n++;
  _eq(orgSlugFromUrl('?org=demo%'), null, '19 % שבור בסוף נשאר-מילולית');         n++;
  _eq(orgSlugFromUrl('?&&org=demo'), 'demo', '20 רצועות-ריקות מדולגות');          n++;
  _eq(orgSlugFromUrl(123), null, '21 קלט-מספרי ⇒ אין org');                       n++;
  _eq(orgSlugFromUrl('?org=demo\n'), null, r'22 \n בסוף ⇒ $ לא תופס');            n++;
  _eq(orgSlugFromUrl('?ORG=demo'), null, '23 מפתח רגיש-רישיות');                  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(orgSlugFromUrl('?org=demo') == 'demo', 'assert-live guard');

  print('OK orgSlugFromUrl: $n asserts passed');
}
