// בדיקת-חוזה (רתמת-זהב) · overrideColumn — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/override-column.test.mjs:
//   1) דריסה בסיסית          overrideColumn(rows,1,{1:'חדש'}) ⇒ ['א','חדש'] בשורה 1
//   2) כותרת חסינה           {0:'פריצה',2:'y'} ⇒ שורה 0 אותה רפרנס+לא-נדרסה; שורה 2 נדרסה
//   3) colIdx שלילי          overrideColumn(rows,-1,{1:'z'}) === rows (אותה רפרנס)
//   4) אפס דריסות            {} ⇒ כל שורה אותה רפרנס (אין העתקה לחינם)
//   5) אי-מוטציה             הקלט לא שונה במקום
//   6) ערך-ריק תופס          {1:''} ⇒ ['א',''] (רק undefined/מפתח-חסר מדולג)
// המרה: === של JS ⇒ identical ב-Dart; JSON.stringify ⇒ deepEq רקורסיבי.
// הרצה: dart run --enable-asserts new/dart-maor/override-column_test.dart ⇒ exit 0
import 'override-column.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

// deepEq רקורסיבי — מקביל ל-JSON.stringify(a) === JSON.stringify(b) של המקור.
bool deepEq(dynamic a, dynamic b) {
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  return a == b;
}

// mkRows — שורות טריות בכל קריאה (מקביל ל-mkRows של ה-JS).
List<dynamic> mkRows() => [
      ['שם', 'הערות'],
      ['א', 'ישן'],
      ['ב', 'x'],
    ];

void main() {
  var n = 0;

  // 1) דריסה בסיסית
  final r1src = mkRows();
  final r1 = overrideColumn(r1src, 1, {1: 'חדש'});
  _ok(
      deepEq(r1, [
        ['שם', 'הערות'],
        ['א', 'חדש'],
        ['ב', 'x'],
      ]),
      'דוגמה 1'); n++;

  // 2) כותרת חסינה (גם כשמנסים לדרוס אינדקס 0)
  final r2src = mkRows();
  final r2 = overrideColumn(r2src, 1, {0: 'פריצה', 2: 'y'});
  _ok(identical(r2[0], r2src[0]), 'דוגמה 2: כותרת לא באותה רפרנס'); n++;
  _ok(deepEq(r2[0], ['שם', 'הערות']), 'דוגמה 2: כותרת נדרסה'); n++;
  _ok(deepEq(r2[2], ['ב', 'y']), 'דוגמה 2: שורה 2 לא נדרסה'); n++;

  // 3) colIdx שלילי ⇒ הקלט עצמו (אותה רפרנס)
  final r3src = mkRows();
  _ok(identical(overrideColumn(r3src, -1, {1: 'z'}), r3src),
      'דוגמה 3: לא הוחזר הקלט עצמו'); n++;

  // 4) אפס דריסות ⇒ כל שורה באותה רפרנס
  final r4src = mkRows();
  final r4 = overrideColumn(r4src, 1, {});
  var allSame = r4.length == 3;
  for (var i = 0; i < r4.length; i++) {
    if (!identical(r4[i], r4src[i])) allSame = false;
  }
  _ok(allSame, 'דוגמה 4: הועתקו שורות לחינם'); n++;

  // 5) אי-מוטציה של הקלט
  _ok((r1src[1] as List)[1] == 'ישן', 'דוגמה 5: הקלט שונה במקום'); n++;

  // 6) דריסה לערך-ריק תופסת (רק undefined/מפתח-חסר מדולג)
  final r6 = overrideColumn(mkRows(), 1, {1: ''});
  _ok(deepEq(r6[1], ['א', '']), 'דוגמה 6: ערך-ריק לא נדרס'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(deepEq(
      overrideColumn(mkRows(), 1, {1: 'חדש'})[1], ['א', 'חדש']), 'assert-live guard');

  print('OK overrideColumn: $n asserts passed');
}
