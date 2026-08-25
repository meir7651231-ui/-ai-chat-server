// בדיקת-חוזה (רתמת-זהב) · stepScale — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/step-scale.test.mjs:
//   (1.0,1)=1.1 · (1.1,1)=1.2 בדיוק (הוכחת-העיגול) · (1.6,1)=1.6 · (0.8,-1)=0.8 ·
//   (2.5,1)=1.6 · (NaN,1)=1.1 · (1.3,-1)=1.2
// שקע-clampScale מקומי, זהה לקוד-המקור של הבדיקה (Number.isFinite קפדני ⇒ 1).
// השוואה: != של Dart על double = ‏=== של JS לערכים סופיים (דוגמה-2 דורשת ביט-מדויק —
// ‏1.2 != 1.2000000000000002 ⇒ הבדיקה מוכיחה שהעיגול קרה).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/step-scale_test.dart  ⇒ OK + exit 0
import 'dart:math' as math;

import 'step-scale.dart';

// שקע-clampScale אמיתי כקוד-המקור (מקומי לבדיקה — כמו ב-step-scale.test.mjs):
//   if (!Number.isFinite(v)) return 1; return Math.min(1.6, Math.max(0.8, v));
num _clampScale(dynamic v) {
  if (!(v is num && v.isFinite)) return 1;
  return math.min(1.6, math.max(0.8, v));
}

void _eq(dynamic got, num want, String label) {
  if (!(got is num) || got != want) {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

void main() {
  var n = 0;

  // — 7 דוגמאות-החוזה, verbatim (step-scale.test.mjs) —
  _eq(stepScale(1.0, 1, _clampScale), 1.1, '1 צעד למעלה');            n++;
  _eq(stepScale(1.1, 1, _clampScale), 1.2, '2 הוכחת-עיגול 1.1+0.1');  n++;
  _eq(stepScale(1.6, 1, _clampScale), 1.6, '3 תקרה 1.6');             n++;
  _eq(stepScale(0.8, -1, _clampScale), 0.8, '4 רצפה 0.8');            n++;
  _eq(stepScale(2.5, 1, _clampScale), 1.6, '5 קלט-חורג מוצמד קודם');  n++;
  _eq(stepScale(double.nan, 1, _clampScale), 1.1, '6 NaN ⇒ 1 ואז צעד'); n++;
  _eq(stepScale(1.3, -1, _clampScale), 1.2, '7 צעד למטה');            n++;

  // הוכחת-העיגול מהצד השני: בלי עיגול, 1.1+0.1 היה 1.2000000000000002 —
  // הבדיקה מוודאת שהתוצאה איננה הערך-הלא-מעוגל (שוויון-ביטים, כלל-הבדיקה של המקור).
  final dynamic proof = stepScale(1.1, 1, _clampScale);
  if (proof == 1.1 + 0.1 && (1.1 + 0.1) != 1.2) {
    throw StateError('FAIL [עיגול]: 1.2000000000000002 דלף בלי עיגול');
  }
  n++;

  // שקע-step מוזרק (ברירת-המחדל 0.1 נבדקה בכל השבע; כאן צעד-חצי מפורש):
  // ‏JS: stepScale(1.0, 1, clampScale, 0.5) ⇒ clamp(round(1.5*10)/10)=1.5
  _eq(stepScale(1.0, 1, _clampScale, 0.5), 1.5, '8 שקע-step מוזרק'); n++;

  // assert חי (הרצה עם --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(stepScale(1.0, 1, _clampScale) == 1.1, 'assert-live guard');

  print('OK stepScale: $n asserts passed');
}
