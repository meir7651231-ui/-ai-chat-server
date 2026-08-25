// רתמת-זהב · org-join-full-code — assert-ים = 12 דוגמאות-הזהב של בדיקת-ה-JS (זהות-ביט).
// המקור new/atoms/org-join-full-code.test.mjs משווה JSON.stringify(תוצאה) לצילום; התוצאה
// היא מחרוזת, ולכן ההשוואה כאן על ה-String הגולמי (בלי מרכאות-JSON) — אותם קלט→פלט.
// אם עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts new/dart-maor/org-join-full-code_test.dart ⇒ exit 0
import 'org-join-full-code.dart';

void main() {
  // [slug, code, expected] — 12 ההקלטות מ-org-join-full-code.test.mjs (כולן slug="").
  const cases = <List<String>>[
    ['', '', '.'],
    ['', 'אבג', '.אבג'],
    ['', 'כהן לוי', '.כהן לוי'],
    ['', 'abc', '.abc'],
    ['', 'a@b.com', '.a@b.com'],
    ['', '2026-08-24', '.2026-08-24'],
    ['', '2026-08-24T12:00:00', '.2026-08-24T12:00:00'],
    ['', '0501234567', '.0501234567'],
    ['', '03-1234567', '.03-1234567'],
    ['', 'https://x.co', '.https://x.co'],
    ['', 'שלום עולם', '.שלום עולם'],
    ['', '12', '.12'],
  ];
  var n = 0;
  for (final c in cases) {
    final got = orgJoinFullCode(c[0], c[1]);
    assert(got == c[2], '✗ [${c[0]},${c[1]}] ⇒ $got ≠ ${c[2]}');
    n++;
  }
  // מקרה-שקע נוסף: slug לא-ריק — מוכיח את מבנה השרשור המלא (מעבר להקלטות ה-golden).
  assert(orgJoinFullCode('maor', 'x9') == 'maor.x9', 'assert-live guard');
  print('✓ org-join-full-code (Dart): $n דוגמאות-חוזה — ירוק');
}
