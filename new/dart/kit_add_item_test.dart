// בדיקת-חוזה · kitAddItem — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/kit_add_item_test.dart
import 'kit_add_item.dart';

void _t(bool ok, String label) {
  if (!ok) throw StateError('FAIL [$label]');
}

bool _mapEq(Map<String, Object?> got, Map<String, Object?> want) {
  if (got.length != want.length) return false;
  for (final e in want.entries) {
    if (!got.containsKey(e.key) || got[e.key] != e.value) return false;
  }
  return true;
}

void main() {
  var n = 0;

  // #1 — הוספה טרייה.
  {
    final out = <String, String>{};
    kitAddItem(out, 'a', 'X');
    _t(_mapEq(out, {'a': 'X'}), '1 fresh');
    n++;
  }

  // #2 — אותו מפתח פעמיים ⇒ הראשון נשמר, השני נזרק (first-write-wins).
  {
    final out = <String, String>{};
    kitAddItem(out, 'a', 'X');
    kitAddItem(out, 'a', 'Y');
    _t(_mapEq(out, {'a': 'X'}), '2 first-wins');
    n++;
  }

  // #3 — שני מפתחות ⇒ שניהם נכנסים.
  {
    final out = <String, String>{};
    kitAddItem(out, 'a', 'X');
    kitAddItem(out, 'b', 'Y');
    _t(_mapEq(out, {'a': 'X', 'b': 'Y'}), '3 two-keys');
    n++;
  }

  // #4 — מפתח מאוכלס-מראש ⇒ ללא-שינוי.
  {
    final out = <String, String>{'a': 'X'};
    kitAddItem(out, 'a', 'Z');
    _t(_mapEq(out, {'a': 'X'}), '4 preexisting-untouched');
    n++;
  }

  // #5 — מחרוזת-ריק מפתח-תקף.
  {
    final out = <String, String>{};
    kitAddItem(out, '', 'X');
    _t(_mapEq(out, {'': 'X'}), '5 empty-key');
    n++;
  }

  // #6 — עדשה-עוינת: מפתח קיים עם ערך-null ⇒ containsKey=true ⇒ 'X' נזרק.
  {
    final out = <String, String?>{'a': null};
    kitAddItem<String?>(out, 'a', 'X');
    _t(out.length == 1 && out['a'] == null, '6 null-value-key-kept');
    n++;
  }

  // #7 — סמנטיקת-האתר: אותו כלי מוצע מכמה מפרקים ⇒ מופיע פעם-אחת.
  {
    final out = <String, String>{};
    kitAddItem(out, 'ptfe', 'סרט טפלון (PTFE)');
    kitAddItem(out, 'ptfe', 'סרט טפלון (PTFE)');
    kitAddItem(out, 'ptfe', 'סרט טפלון (PTFE)');
    _t(_mapEq(out, {'ptfe': 'סרט טפלון (PTFE)'}), '7 site-dedup');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  {
    final out = <String, int>{};
    kitAddItem(out, 'k', 7);
    kitAddItem(out, 'k', 9);
    assert(out.length == 1 && out['k'] == 7, 'assert-live guard');
  }

  print('OK kitAddItem: $n asserts passed');
}
