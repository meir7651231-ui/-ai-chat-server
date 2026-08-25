// בדיקת-חוזה (רתמת-זהב) · ayinSheetHeader — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/ayin-sheet-header.test.mjs:
//   הצילום (SNAP['AYIN_SHEET_HEADER']) הוא JSON.stringify של הקבוע. ‏jsonEncode של Dart
//   מקביל ל-JSON.stringify — אותו סדר, אותם ערכים, ללא-רווחים ⇒ מחרוזת זהה-ביט.
//   אם עובר ⇒ Dart≡JS.
// גם השוואה מבנית איבר-איבר (כלל-המרה 8: לא join שמאבד גבולות-איבר).
// הרצה: dart run --enable-asserts new/dart-maor/ayin-sheet-header_test.dart  ⇒ exit 0
import 'dart:convert';
import 'ayin-sheet-header.dart';

// הצילום המדויק ממקור-ה-JS (SNAP['AYIN_SHEET_HEADER']).
const String _snap =
    '["תומכת","טלפון","שם למסירה","כמה עיניים","נמסר (כן/לא)",'
    '"שולם (כן/לא)","תשובה/הערה","עופרת בוצעה (כן/לא)"]';

void main() {
  var n = 0;

  // 1) רתמת-הזהב: jsonEncode ≡ JSON.stringify — מחרוזת זהה-ביט לצילום-המקור.
  final got = jsonEncode(ayinSheetHeader);
  if (got != _snap) {
    throw StateError('FAIL צילום-ערך סטה:\n got =$got\n want=$_snap');
  }
  n++;

  // 2) השוואה מבנית מפורשת — אורך + כל כותרת איבר-איבר (כלל-המרה 8).
  const want = [
    'תומכת',
    'טלפון',
    'שם למסירה',
    'כמה עיניים',
    'נמסר (כן/לא)',
    'שולם (כן/לא)',
    'תשובה/הערה',
    'עופרת בוצעה (כן/לא)',
  ];
  if (ayinSheetHeader.length != want.length) {
    throw StateError('FAIL אורך: ${ayinSheetHeader.length} != ${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    if (ayinSheetHeader[i] != want[i]) {
      throw StateError('FAIL [$i]: "${ayinSheetHeader[i]}" != "${want[i]}"');
    }
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(ayinSheetHeader.length == 8, 'assert-live guard length');
  assert(ayinSheetHeader[0] == 'תומכת', 'assert-live guard first');
  assert(ayinSheetHeader[7] == 'עופרת בוצעה (כן/לא)', 'assert-live guard last');

  print('OK ayinSheetHeader: $n asserts passed');
}
