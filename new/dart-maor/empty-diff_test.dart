// בדיקת-חוזה (רתמת-זהב) · emptyDiff — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/empty-diff.test.mjs:
//   1) {sets:[], deletes:[], meta:null}                         ⇒ true   (ריק לגמרי)
//   2) {sets:[{col,id,data}], deletes:[], meta:null}            ⇒ false  (יש set)
//   3) {sets:[], deletes:[{col,id}], meta:null}                 ⇒ false  (יש delete)
//   4) {sets:[], deletes:[], meta:{seq:12}}                     ⇒ false  (יש meta)
//   5) {sets:[], deletes:[], meta:undefined}                    ⇒ false  (meta=undefined אינו null)
// המרה (DART-PORTING-RULE 2): meta:null ⇒ מפתח קיים עם null · meta:undefined ⇒ מפתח חסר.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/empty-diff_test.dart  ⇒ exit 0
import 'empty-diff.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) ריק לגמרי ⇒ true.
  _ok(emptyDiff({'sets': [], 'deletes': [], 'meta': null}) == true, 'ריק לגמרי'); n++;

  // 2) יש set ⇒ false.
  _ok(emptyDiff({
        'sets': [{'col': 'families', 'id': 'f1', 'data': {'id': 'f1'}}],
        'deletes': [],
        'meta': null,
      }) == false, 'יש set'); n++;

  // 3) יש delete ⇒ false.
  _ok(emptyDiff({
        'sets': [],
        'deletes': [{'col': 'events', 'id': 'e9'}],
        'meta': null,
      }) == false, 'יש delete'); n++;

  // 4) יש meta (לא null) ⇒ false.
  _ok(emptyDiff({'sets': [], 'deletes': [], 'meta': {'seq': 12}}) == false, 'יש meta'); n++;

  // 5) meta=undefined אינו null — מודל: מפתח 'meta' חסר ⇒ false (RULE 2).
  _ok(emptyDiff({'sets': [], 'deletes': []}) == false, 'meta=undefined אינו null'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(emptyDiff({'sets': [], 'deletes': [], 'meta': null}) == true, 'assert-live guard');

  print('OK emptyDiff: $n asserts passed');
}
