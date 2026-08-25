// בדיקת-חוזה (רתמת-זהב) · sizeLabels — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/size-labels.test.mjs:
//   assert.deepStrictEqual(SIZE_LABELS, { small: 'קטן', medium: 'בינוני', large: 'גדול' })
// מתורגם כאן ל: (1) רתמת-זהב — jsonEncode ≡ JSON.stringify (ליטרל-map של Dart
// שומר סדר-הכנסה כמו אובייקט-JS ⇒ מחרוזת זהה-ביט); (2) השוואה מבנית מפורשת —
// בדיוק 3 מפתחות בסדר-המקור + ערך-מול-ערך (רוח כלל-המרה 8: לא join, גבול-איבר).
// ערבויות-החוזה: בדיוק small·medium·large; ערכים verbatim 'קטן'/'בינוני'/'גדול'.
// (הצלבה מול sizeMult של default-prices = בדיקת-קופסת-התמחור — חוק-2, לא כאן.)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/size-labels_test.dart  ⇒ exit 0
import 'dart:convert';
import 'size-labels.dart';

// הצילום המדויק ממקור-ה-JS: JSON.stringify(SIZE_LABELS).
const String _snap = '{"small":"קטן","medium":"בינוני","large":"גדול"}';

void main() {
  var n = 0;
  final m = sizeLabels;

  // 1) רתמת-הזהב: jsonEncode ≡ JSON.stringify — מחרוזת זהה-ביט לצילום-המקור.
  final got = jsonEncode(m);
  if (got != _snap) {
    throw StateError('FAIL צילום-ערך סטה:\n got =$got\n want=$_snap');
  }
  n++;

  // 2) deepStrictEqual מבני: בדיוק 3 מפתחות, בסדר-המקור (ערבות-חוזה 1).
  const wantKeys = ['small', 'medium', 'large'];
  final keys = m.keys.toList();
  if (keys.length != wantKeys.length) {
    throw StateError('FAIL מספר-מפתחות: ${keys.length} != ${wantKeys.length}');
  }
  for (var i = 0; i < wantKeys.length; i++) {
    if (keys[i] != wantKeys[i]) {
      throw StateError("FAIL מפתח [$i]: '${keys[i]}' != '${wantKeys[i]}'");
    }
    n++;
  }

  // 3) הערכים verbatim (ערבות-חוזה 2).
  const wantVals = {'small': 'קטן', 'medium': 'בינוני', 'large': 'גדול'};
  for (final k in wantKeys) {
    if (m[k] != wantVals[k]) {
      throw StateError("FAIL ערך '$k': '${m[k]}' != '${wantVals[k]}'");
    }
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(m['small'] == 'קטן', 'assert-live guard');
  assert(m.length == 3, 'assert-live guard length');

  print('OK sizeLabels: $n asserts passed');
}
