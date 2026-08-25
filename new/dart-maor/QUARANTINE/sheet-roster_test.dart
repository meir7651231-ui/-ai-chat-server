// בדיקת-חוזה (רתמת-זהב) · sheetRoster — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/sheet-roster.test.mjs:
//   1) active+frozen נכנסים; ended+wait בחוץ (בדיוק 2, בסדרם)
//   2) חוג אחר מסונן ⇒ []
//   3) סטטוס חסר נכלל (שיבוץ-עבר) — אותו אובייקט, זהות-הפניה
//   4) מערך ריק ⇒ [] חדש (List, לא null)
//   5) הסדר נשמר + זהות-הפניה ([a,b,c] ⇒ [a,c])
// השוואת-מערכים = אורך + איבר-איבר (כלל-8); === של JS ⇒ identical ב-Dart.
// הרצה: dart run --enable-asserts new/dart-maor/sheet-roster_test.dart  ⇒ exit 0
import 'sheet-roster.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) active+frozen נכנסים; ended+wait בחוץ.
  {
    final list = [
      {'courseId': 'c1', 'status': 'active'},
      {'courseId': 'c1', 'status': 'frozen'},
      {'courseId': 'c1', 'status': 'ended'},
      {'courseId': 'c1', 'status': 'wait'},
    ];
    final out = sheetRoster(list, 'c1');
    _ok(out.length == 2,
        'חייבים בדיוק 2 — פעיל+מוקפא (בפועל: ${out.length})'); n++;
    _ok(out[0]['status'] == 'active' && out[1]['status'] == 'frozen',
        'ended/wait אסור שייכנסו לגיליון'); n++;
    // כלל-8: איבר-איבר בזהות-הפניה מול המקור.
    _ok(identical(out[0], list[0]) && identical(out[1], list[1]),
        'האיברים חייבים לעבור בזהות-הפניה'); n++;
  }

  // 2) חוג אחר מסונן.
  {
    final out = sheetRoster([
      {'courseId': 'c2', 'status': 'active'}
    ], 'c1');
    _ok(out.length == 0, 'שיבוץ של חוג אחר דלף לגיליון'); n++;
  }

  // 3) סטטוס חסר נכלל (שיבוץ-עבר) — undefined!=='ended' ב-JS ⇒ null!='ended' כאן.
  {
    final e = {'courseId': 'c1'};
    final out = sheetRoster([e], 'c1');
    _ok(out.length == 1 && identical(out[0], e),
        'שיבוץ בלי status חייב להיכלל — פעיל'); n++;
  }

  // 4) מערך ריק ⇒ [] חדש (List, לא null).
  {
    final out = sheetRoster([], 'c1');
    _ok(out is List && out.length == 0, 'מערך ריק חייב להחזיר []'); n++;
  }

  // 5) סדר נשמר + זהות-הפניה: [a(c1), b(c2), c(c1)] ⇒ [a, c].
  {
    final a = {'courseId': 'c1', 'status': 'active'};
    final b = {'courseId': 'c2', 'status': 'active'};
    final c = {'courseId': 'c1', 'status': 'frozen'};
    final out = sheetRoster([a, b, c], 'c1');
    _ok(out.length == 2 && identical(out[0], a) && identical(out[1], c),
        'הסדר המקורי והאיברים-עצמם חייבים להישמר'); n++;
    // filter מחזיר מערך **חדש** — לא המקור.
    final src = [a, c];
    _ok(!identical(sheetRoster(src, 'c1'), src),
        'הפלט חייב להיות מערך חדש, לא המקור'); n++;
  }

  // assert חי (--enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(sheetRoster([], 'c1').isEmpty, 'assert-live guard');

  print('OK sheetRoster: $n asserts passed');
}
