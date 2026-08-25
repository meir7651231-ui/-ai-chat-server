// בדיקת-חוזה (רתמת-זהב) · supporterVisibleForDesignations — מייבאת אך ורק את האטום-שלה (חוק-4).
// חלק א׳: 12 הקלטות-ה-Golden זהות ביט-אחר-ביט למקור-ה-JS
//   new/atoms/supporter-visible-for-designations.test.mjs (sup='' כ-String,
//   allowed כ-String — כמו שהוקלט; allowed='' ⇒ true, כל השאר ⇒ false).
// חלק ב׳: 9 מקרים ריאליסטיים (Map/List) שהורצו מול node על קוד-המקור עצמו
//   באותו סשן והפלט הועתק ככתבו (trim דו-צדדי, ייעוד-חסר, allowed ריק/null).
// הפלט bool — השוואה ישירה (אין מערכים בפלט). כשל ⇒ StateError. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/supporter-visible-for-designations_test.dart ⇒ exit 0
import 'supporter-visible-for-designations.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // ─── חלק א׳: 12 הקלטות-Golden (קלטים מוקלטים: sup="" · allowed=String) ───
  final golden = <List<dynamic>>[
    ['', '', true],
    ['', 'אבג', false],
    ['', 'כהן לוי', false],
    ['', 'abc', false],
    ['', 'a@b.com', false],
    ['', '2026-08-24', false],
    ['', '2026-08-24T12:00:00', false],
    ['', '0501234567', false],
    ['', '03-1234567', false],
    ['', 'https://x.co', false],
    ['', 'שלום עולם', false],
    ['', '12', false],
  ];
  for (final c in golden) {
    _eq(supporterVisibleForDesignations(c[0], c[1]), c[2] as bool,
        'Golden ["${c[0]}","${c[1]}"]');
    n++;
  }

  // ─── חלק ב׳: מקרים ריאליסטיים — פלט מאומת-node על קוד-המקור ───
  // 1) forWho עם רווחים נגזם ונמצא ברשימה ⇒ true.
  _eq(
      supporterVisibleForDesignations(
          {'forWho': ' אבג '}, <String>['אבג', 'דף']),
      true,
      'forWho גזום ∈ allowed');
  n++;
  // 2) איברי-allowed נגזמים אף הם ⇒ true.
  _eq(supporterVisibleForDesignations({'forWho': 'אבג'}, <String>[' אבג ']),
      true, 'allowed גזום');
  n++;
  // 3) ייעוד אחר ⇒ false.
  _eq(supporterVisibleForDesignations({'forWho': 'אבג'}, <String>['דף']),
      false, 'ייעוד אחר ⇒ false');
  n++;
  // 4) בלי forWho (מפתח-חסר ≈ undefined) ⇒ false (היפוך #8 — לא-משותף).
  _eq(supporterVisibleForDesignations(<String, dynamic>{}, <String>['אבג']),
      false, 'בלי forWho ⇒ false');
  n++;
  // 5) forWho רווחים-בלבד ⇒ נגזם לריק ⇒ false.
  _eq(supporterVisibleForDesignations({'forWho': '  '}, <String>['אבג']),
      false, 'forWho רווחים ⇒ false');
  n++;
  // 6) forWho=null (?? '') ⇒ false.
  _eq(supporterVisibleForDesignations({'forWho': null}, <String>['אבג']),
      false, 'forWho null ⇒ false');
  n++;
  // 7) allowed=null (≡undefined) ⇒ אין הגבלה ⇒ true.
  _eq(supporterVisibleForDesignations({'forWho': 'אבג'}, null), true,
      'allowed null ⇒ true');
  n++;
  // 8) allowed=[] (length 0 כוזב ב-JS) ⇒ true.
  _eq(supporterVisibleForDesignations({'forWho': 'אבג'}, <String>[]), true,
      'allowed ריק ⇒ true');
  n++;
  // 9) ייעוד רב-מילתי תואם ⇒ true.
  _eq(
      supporterVisibleForDesignations(
          {'forWho': 'כהן לוי'}, <String>['כהן לוי', 'x']),
      true,
      'ייעוד רב-מילתי');
  n++;

  // assert חי (הרצה עם --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    supporterVisibleForDesignations({'forWho': 'אבג'}, <String>['אבג']),
    'assert-live guard',
  );

  print('OK supporterVisibleForDesignations: $n asserts passed');
}
