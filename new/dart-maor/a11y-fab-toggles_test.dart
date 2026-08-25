// בדיקת-חוזה (רתמת-זהב) · a11yFabToggles — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמת-החוזה זהה ביט-אחר-ביט למקור-ה-JS new/atoms/a11y-fab-toggles.test.mjs:
//   הצילום (SNAP) הוא JSON.stringify של הקבוע. ‏jsonEncode של Dart מקביל ל-JSON.stringify —
//   אותו סדר, אותם ערכים, ללא-רווחים ⇒ מחרוזת זהה-ביט. אם עובר ⇒ Dart≡JS.
// גם השוואה מבנית איבר-איבר (כלל-המרה 8: לא join שמאבד גבולות-איבר).
// הרצה: dart run --enable-asserts new/dart-maor/a11y-fab-toggles_test.dart  ⇒ exit 0
import 'dart:convert';
import 'a11y-fab-toggles.dart';

// הצילום המדויק ממקור-ה-JS (SNAP['A11Y_FAB_TOGGLES']).
const String _snap =
    '[["contrast","ניגודיות גבוהה"],["links","הדגשת כפתורים וקישורים"],'
    '["noanim","עצירת אנימציות ותנועה"],["spacing","ריווח טקסט מוגדל"]]';

void main() {
  var n = 0;

  // 1) רתמת-הזהב: jsonEncode ≡ JSON.stringify — מחרוזת זהה-ביט לצילום-המקור.
  final got = jsonEncode(a11yFabToggles);
  if (got != _snap) {
    throw StateError('FAIL צילום-ערך סטה:\n got =$got\n want=$_snap');
  }
  n++;

  // 2) השוואה מבנית מפורשת — אורך + כל [key,label] איבר-איבר (כלל-המרה 8).
  const want = [
    ['contrast', 'ניגודיות גבוהה'],
    ['links', 'הדגשת כפתורים וקישורים'],
    ['noanim', 'עצירת אנימציות ותנועה'],
    ['spacing', 'ריווח טקסט מוגדל'],
  ];
  if (a11yFabToggles.length != want.length) {
    throw StateError('FAIL אורך: ${a11yFabToggles.length} != ${want.length}');
  }
  for (var i = 0; i < want.length; i++) {
    final row = a11yFabToggles[i];
    final w = want[i];
    if (row.length != 2 || w.length != 2) {
      throw StateError('FAIL שורה $i אינה זוג');
    }
    if (row[0] != w[0] || row[1] != w[1]) {
      throw StateError('FAIL שורה $i: [${row[0]},${row[1]}] != [${w[0]},${w[1]}]');
    }
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(a11yFabToggles[0][0] == 'contrast', 'assert-live guard');
  assert(a11yFabToggles.length == 4, 'assert-live guard length');

  print('OK a11yFabToggles: $n asserts passed');
}
