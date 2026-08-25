// בדיקת-חוזה (רתמת-זהב) · stripSupKey — מייבאת אך ורק את האטום-שלה (חוק-4).
// כל 8 דוגמאות-החוזה (Golden) מתורגמות ביט-אחר-ביט מ-new/atoms/strip-sup-key.test.mjs:
// הקלט מפורק מ-JSON (כמו ‏de ב-JS), הפלט מושווה גם עומק-מבנה (מערך = אורך+איבר-איבר,
// חוק-8) וגם כמחרוזת-jsonEncode מול מחרוזת-הפלט המוקלטת (מקביל ל-JSON.stringify ב-JS;
// ‏Dart jsonEncode אינו ממלט לא-ASCII — עברית נשארת גלויה, כמו JS).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/strip-sup-key_test.dart  ⇒ exit 0
import 'dart:convert';

import 'strip-sup-key.dart';

/// השוואת-עומק נאמנת-חוק-8: מערך = אורך + איבר-איבר; מפה = קבוצת-מפתחות + ערך-ערך.
bool _deepEq(dynamic a, dynamic b) {
  if (a is List) {
    if (b is! List || a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  if (a is Map) {
    if (b is! Map || a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k) || !_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  return a == b;
}

void _golden(String inputJson, String wantJson, String label) {
  final got = stripSupKey(jsonDecode(inputJson));
  final want = jsonDecode(wantJson);
  if (!_deepEq(got, want)) {
    throw StateError('FAIL [$label] deep: got=${jsonEncode(got)} want=$wantJson');
  }
  final gotStr = jsonEncode(got);
  if (gotStr != wantJson) {
    throw StateError('FAIL [$label] stringify: got=$gotStr want=$wantJson');
  }
}

void main() {
  var n = 0;

  // — 8 דוגמאות-החוזה verbatim (strip-sup-key.test.mjs / strip-sup-key.contract.md) —
  _golden('{"amount":100}', '{"amount":100}', 'G1');                                 n++;
  _golden('{"payments":[{"amount":100},{"amount":50}]}',
          '{"payments":[{"amount":100},{"amount":50}]}', 'G2');                      n++;
  _golden('{"name":"כהן","phone":"0501234567"}',
          '{"name":"כהן","phone":"0501234567"}', 'G3');                              n++;
  _golden('[{"amount":100}]', '[{"amount":100}]', 'G4');                             n++;
  _golden('["2026-08-24"]', '["2026-08-24"]', 'G5');                                 n++;
  _golden('[]', '[]', 'G6');                                                         n++;
  _golden('["א","ב"]', '["א","ב"]', 'G7');                                           n++;
  _golden('{}', '{}', 'G8');                                                         n++;

  // — אימותי-נאמנות מעבר-ל-Golden (סמנטיקת-המקור, לא-משנים את החוזה) —

  // אין 'skey' ⇒ ‏`return data` ב-JS מחזיר את אותו אובייקט — זהות-הפניה, לא עותק.
  final same = <String, dynamic>{'amount': 100};
  if (!identical(stripSupKey(same), same)) {
    throw StateError('FAIL [identity]: ללא skey חייב לחזור אותו אובייקט (return data)');
  }
  n++;

  // יש 'skey' ⇒ עותק-רדוד בלעדיו; המקור לא נפגע (delete על העותק בלבד).
  final src = <String, dynamic>{'a': 1, 'skey': 'סוד', 'b': 2};
  final stripped = stripSupKey(src);
  if (jsonEncode(stripped) != '{"a":1,"b":2}') {
    throw StateError('FAIL [strip]: got=${jsonEncode(stripped)} want={"a":1,"b":2}');
  }
  if (!src.containsKey('skey')) {
    throw StateError('FAIL [no-mutate]: המקור שונה — {...data} הוא עותק, לא מוטציה');
  }
  n += 2;

  // מפתח 'skey' קיים עם ערך null ⇒ ‏`'skey' in data` ב-JS עדיין true (חוק-2: containsKey).
  final nullKey = <String, dynamic>{'skey': null, 'x': 7};
  if (jsonEncode(stripSupKey(nullKey)) != '{"x":7}') {
    throw StateError('FAIL [null-key]: מפתח-קיים-עם-null חייב להתקלף (containsKey!)');
  }
  n++;

  // חוק-14: ‏{...data} ממיין מפתחות-אינדקס-קנוניים מספרית תחילה, שאר בסדר-הכנסה.
  final ordered = stripSupKey(<String, dynamic>{'b': 1, '10': 2, 'skey': 0, '2': 3});
  if (jsonEncode(ordered) != '{"2":3,"10":2,"b":1}') {
    throw StateError('FAIL [key-order]: got=${jsonEncode(ordered)} '
        'want={"2":3,"10":2,"b":1} (דין-הסדר של spread ב-JS)');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(identical(stripSupKey(same), same), 'assert-live guard');

  print('OK stripSupKey: $n asserts passed');
}
