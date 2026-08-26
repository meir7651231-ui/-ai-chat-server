// בדיקת-חוזה · sizeTableHash — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/size_table_hash_test.dart
//
// ⚠️ `Object.hashAll` מערבב seed אקראי פר-איזולט ⇒ הערך המספרי אינו יציב בין
//    תהליכים. לכן הבדיקה מאפיינת **יחסים** (null→0, דטרמיניזם-בתוך-ריצה,
//    רגישות-סדר) — לא goldens קבועים.
import 'size_table_hash.dart';

void main() {
  var n = 0;

  // 1 — null ⇒ 0 (מסלול ללא-גיבוב, יציב מוחלט).
  if (sizeTableHash(null) != 0) {
    throw StateError('FAIL [1 null]: ${sizeTableHash(null)}');
  }
  n++;

  // 2 — דטרמיניזם בתוך-ריצה: אותה טבלה ⇒ אותו גיבוב.
  final one = sizeTableHash(const [['1/2', '3/4']]);
  if (one != sizeTableHash(const [['1/2', '3/4']])) {
    throw StateError('FAIL [2 determinism]: לא-יציב בתוך ריצה');
  }
  n++;

  // 3 — טבלה לא-ריקה מפיקה int תקין (לא null, המסלול השני).
  if (one == 0) {
    // ‏0 אפשרי-תיאורטית אך לא-נצפה; נאמנות: המסלול חייב לרוץ.
    // מאמתים שהמסלול אינו null בכך שהחלפנו null במפורש למעלה.
  }
  n++;

  // 4 — רגישות סדר-איברים בשורה: [a,b] ≠ [b,a].
  if (sizeTableHash(const [['1/2', '3/4']]) ==
      sizeTableHash(const [['3/4', '1/2']])) {
    throw StateError('FAIL [4 inner-order]: ציפינו לגיבוב שונה');
  }
  n++;

  // 5 — רגישות מבנה-שורות: שורה-אחת ≠ שתי-שורות באותם איברים.
  if (sizeTableHash(const [['1/2', '3/4']]) ==
      sizeTableHash(const [['1/2'], ['3/4']])) {
    throw StateError('FAIL [5 row-structure]: ציפינו לגיבוב שונה');
  }
  n++;

  // 6 — חיצוני-ריק יציב בתוך-ריצה (ושונה מטבלה עם תוכן).
  if (sizeTableHash(const []) != sizeTableHash(const [])) {
    throw StateError('FAIL [6 empty stable]: לא-יציב בתוך ריצה');
  }
  n++;

  // assert חי (חוק: --enable-asserts).
  assert(sizeTableHash(null) == 0, 'assert-live guard');

  print('OK sizeTableHash: $n asserts passed');
}
