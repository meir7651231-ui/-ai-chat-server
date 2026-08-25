// בדיקת-חוזה (רתמת-זהב) · stripAuditMeta — מייבאת אך ורק את האטום-שלה (חוק-4).
// 8 הקלטות-ה-Golden זהות ביט-אחר-ביט למקור new/atoms/strip-audit-meta.test.mjs:
// הקלט מפוענח מ-JSON, הפלט מושווה עומק (מערכים = אורך+איבר-איבר, כלל-8; מפות =
// קבוצת-מפתחות + ערך-ערך + סדר-מפתחות דרך jsonEncode — שקילות ל-JSON.stringify).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/strip-audit-meta_test.dart  ⇒ exit 0
import 'dart:convert';

import 'strip-audit-meta.dart';

// השוואת-עומק: List = אורך + איבר-איבר (כלל-8 — לעולם לא join); Map = אורך +
// מפתח-מפתח; אחר = ==.
bool _deepEq(dynamic a, dynamic b) {
  if (a is List && b is List) {
    if (a.length != b.length) return false;
    for (var i = 0; i < a.length; i++) {
      if (!_deepEq(a[i], b[i])) return false;
    }
    return true;
  }
  if (a is Map && b is Map) {
    if (a.length != b.length) return false;
    for (final k in a.keys) {
      if (!b.containsKey(k)) return false;
      if (!_deepEq(a[k], b[k])) return false;
    }
    return true;
  }
  return a == b;
}

void _golden(String inputJson, String wantJson, String label) {
  final got = stripAuditMeta(jsonDecode(inputJson));
  final want = jsonDecode(wantJson);
  if (!_deepEq(got, want)) {
    throw StateError('FAIL [$label]: deep got=${jsonEncode(got)} want=$wantJson');
  }
  // סדר-מפתחות זהה-ביט (JSON.stringify במקור): הקידוד חייב להשתוות למחרוזת-ההקלטה.
  final enc = jsonEncode(got);
  if (enc != wantJson) {
    throw StateError('FAIL [$label]: encode got=$enc want=$wantJson');
  }
}

void main() {
  var n = 0;

  // — 8 הקלטות-ה-Golden verbatim (strip-audit-meta.test.mjs) —
  _golden('{"amount":100}', '{"amount":100}', '1');                                     n++;
  _golden('{"payments":[{"amount":100},{"amount":50}]}',
          '{"payments":[{"amount":100},{"amount":50}]}', '2');                          n++;
  _golden('{"name":"כהן","phone":"0501234567"}',
          '{"name":"כהן","phone":"0501234567"}', '3');                                  n++;
  _golden('[{"amount":100}]', '[{"amount":100}]', '4');                                 n++;
  _golden('["2026-08-24"]', '["2026-08-24"]', '5');                                    n++;
  _golden('[]', '[]', '6');                                                             n++;
  _golden('["א","ב"]', '["א","ב"]', '7');                                              n++;
  _golden('{}', '{}', '8');                                                             n++;

  // — אינווריאנטים מן המקור (מעבר להקלטות; נגזרים ישירות מגוף-ה-JS) —

  // אין 'audit' ⇒ זהות-רפרנס (return meta, לא העתק).
  final noAudit = jsonDecode('{"amount":100}');
  if (!identical(stripAuditMeta(noAudit), noAudit)) {
    throw StateError('FAIL [identity]: absent audit must return the same object');
  }
  n++;

  // יש 'audit' ⇒ העתק חדש בלי 'audit'; המקור לא נגוע (delete על rest, לא על meta).
  final withAudit = jsonDecode('{"audit":{"who":"x"},"amount":100,"name":"כהן"}');
  final stripped = stripAuditMeta(withAudit);
  if (identical(stripped, withAudit)) {
    throw StateError('FAIL [copy]: present audit must return a fresh copy');
  }
  if (jsonEncode(stripped) != '{"amount":100,"name":"כהן"}') {
    throw StateError('FAIL [strip]: got ${jsonEncode(stripped)}');
  }
  if (!(withAudit as Map).containsKey('audit')) {
    throw StateError('FAIL [no-mutate]: source object was mutated');
  }
  n++;

  // חוק-2: audit:null מפורש = מפתח-קיים ('in' תופס) ⇒ מוסר, מוחזר העתק.
  final nullAudit = jsonDecode('{"audit":null,"amount":100}');
  final strippedNull = stripAuditMeta(nullAudit);
  if (identical(strippedNull, nullAudit) || jsonEncode(strippedNull) != '{"amount":100}') {
    throw StateError('FAIL [audit-null]: explicit null must still be stripped');
  }
  n++;

  // חוק-14: מפתחות דמויי-שלם-קנוני ממוינים מספרית-קודם בהעתק (סדר-אנומרציה של JS).
  final intKeys = <dynamic, dynamic>{'b': 1, '10': 2, 'audit': 3, '2': 4};
  if (jsonEncode(stripAuditMeta(intKeys)) != '{"2":4,"10":2,"b":1}') {
    throw StateError('FAIL [key-order]: got ${jsonEncode(stripAuditMeta(intKeys))}');
  }
  n++;

  // מערך עם 'audit' כערך-איבר (לא מפתח) ⇒ זהות-רפרנס.
  final arr = jsonDecode('["audit"]');
  if (!identical(stripAuditMeta(arr), arr)) {
    throw StateError('FAIL [array-identity]');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_deepEq(stripAuditMeta(<dynamic, dynamic>{}), <dynamic, dynamic>{}),
      'assert-live guard');

  print('OK stripAuditMeta: $n asserts passed (8 הקלטות-Golden — ירוק)');
}
