// בדיקת-חוזה (רתמת-זהב) · pushRecent — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/push-recent.test.mjs:
//   1) []                    + 'f1' ⇒ ['f1']
//   2) ['f1','f2']           + 'f3' ⇒ ['f3','f1','f2']  (החדש בראש)
//   3) ['f1','f2','f3']      + 'f2' ⇒ ['f2','f1','f3']  (ייחודיות/קידום)
//   4) ['a','b','c','d','e','f'] + 'g' ⇒ ['g','a','b','c','d','e']  (תקרת-6, f נדחק)
//   5) טוהר — הקלט ids לא משתנה
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/push-recent_test.dart  ⇒ exit 0
import 'push-recent.dart';

bool _eq(List<String> a, List<String> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

void main() {
  var n = 0;

  // 1) רשימה ריקה.
  assert(_eq(pushRecent([], 'f1'), ['f1']), 'FAIL דוגמה 1: [] + f1 ≠ [f1]');
  n++;

  // 2) החדש בראש.
  assert(_eq(pushRecent(['f1', 'f2'], 'f3'), ['f3', 'f1', 'f2']),
      'FAIL דוגמה 2: החדש לא בראש');
  n++;

  // 3) ייחודיות — מופע קיים קודם לראש ומוסר ממקומו.
  assert(_eq(pushRecent(['f1', 'f2', 'f3'], 'f2'), ['f2', 'f1', 'f3']),
      'FAIL דוגמה 3: הייחודיות/הקידום שגויים');
  n++;

  // 4) תקרת 6 — האחרון נדחק.
  assert(
      _eq(pushRecent(['a', 'b', 'c', 'd', 'e', 'f'], 'g'),
          ['g', 'a', 'b', 'c', 'd', 'e']),
      'FAIL דוגמה 4: תקרת-6 לא נאכפה (f היה אמור להידחק)');
  n++;

  // 5) טוהר — הקלט המקורי לא משתנה.
  {
    final ids = <String>['f1', 'f2'];
    pushRecent(ids, 'f3');
    assert(ids.length == 2 && ids[0] == 'f1', 'FAIL דוגמה 5: הקלט המקורי השתנה');
    n++;
  }

  print('OK pushRecent: $n asserts passed');
}
