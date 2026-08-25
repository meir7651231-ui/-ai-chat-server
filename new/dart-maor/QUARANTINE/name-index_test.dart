// בדיקת-חוזה (רתמת-זהב) · nameIndex — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/name-index.test.mjs:
//   1) [{id:'m1',name:'דנה'},{id:'m2',name:'יוסי'}] ⇒ מפה בגודל 2 עם שני החברים
//   2) הערך במפה הוא אותו אובייקט שהשקע החזיר (=== ⇒ identical, לא עותק)
//   3) השקע נקרא פעם אחת בדיוק, עם ה-db שהוזרק (זהות-רפרנס)
//   4) רשימה ריקה ⇒ מפה ריקה (גודל 0), get('m1')===undefined ⇒ null ב-Dart
//   5) מזהה כפול [{id:'m1',v:1},{id:'m1',v:2}] ⇒ גודל 1, האחרון מנצח (v==2)
// המרה: Map.get של JS ⇒ map[k] ב-Dart · === ⇒ identical · השוואת רשימת-הקריאות
// (calls) לפי כלל-8: אורך + איבר-איבר, לא join.
// הרצה: dart run --enable-asserts new/dart-maor/name-index_test.dart  ⇒ exit 0
import 'name-index.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;
  final db = {'__db': true};

  // 1+2+3) מיפוי, זהות-הפניה, קריאה-אחת עם ה-db
  {
    final m1 = {'id': 'm1', 'name': 'דנה'};
    final m2 = {'id': 'm2', 'name': 'יוסי'};
    final calls = <dynamic>[];
    final map = nameIndex(db, (d) {
      calls.add(d);
      return [m1, m2];
    }) as Map;

    // 1) מפה בגודל 2 עם שני החברים
    _ok(map.length == 2, '1 גודל-המפה ≠ 2'); n++;
    _ok((map['m1'] as Map)['name'] == 'דנה', "1 get('m1').name ≠ 'דנה'"); n++;
    _ok((map['m2'] as Map)['name'] == 'יוסי', "1 get('m2').name ≠ 'יוסי'"); n++;

    // 2) זהות-הפניה (לא עותק) — === במקור ⇒ identical
    _ok(identical(map['m1'], m1), "2 get('m1') אינו אותו אובייקט"); n++;
    _ok(identical(map['m2'], m2), "2 get('m2') אינו אותו אובייקט"); n++;

    // 3) השקע נקרא פעם אחת עם ה-db — כלל-8: אורך + איבר-איבר
    _ok(calls.length == 1, '3 השקע לא נקרא בדיוק פעם אחת'); n++;
    _ok(identical(calls[0], db), '3 השקע לא קיבל את ה-db שהוזרק'); n++;
  }

  // 4) רשימה ריקה ⇒ מפה ריקה
  {
    final map = nameIndex(db, (d) => <dynamic>[]) as Map;
    _ok(map.length == 0, '4 המפה אינה ריקה'); n++;
    _ok(map['m1'] == null, "4 get('m1') על מפה ריקה ≠ undefined/null"); n++;
  }

  // 5) מזהה כפול — האחרון מנצח (סמנטיקת Map.set)
  {
    final map = nameIndex(db, (d) => [
          {'id': 'm1', 'v': 1},
          {'id': 'm1', 'v': 2},
        ]) as Map;
    _ok(map.length == 1, '5 כפול: גודל-המפה ≠ 1'); n++;
    _ok((map['m1'] as Map)['v'] == 2, '5 כפול: האחרון לא ניצח'); n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert((nameIndex(db, (d) => <dynamic>[]) as Map).isEmpty, 'assert-live guard');

  print('OK nameIndex: $n asserts passed');
}
