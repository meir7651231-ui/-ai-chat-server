// בדיקת-חוזה (רתמת-זהב) · isDone — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/is-done.test.mjs:
//   1) {queue:[]}                                      ⇒ true   (תור ריק = הסתיים)
//   2) {queue:['s1']}                                  ⇒ false  (נותר אחד)
//   3) {queue:['s1','s2','s3']}                        ⇒ false
//   4) {queue:[], log:[{id:'s1',outcome:'answered'}], total:1} ⇒ true  (רק ה-queue קובע)
// המרה: === 0 של JS ⇒ isEmpty ב-Dart. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/is-done_test.dart  ⇒ exit 0
import 'is-done.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  // 1) תור ריק ⇒ true.
  _ok(isDone({'queue': []}) == true, '{queue:[]} ⇒ צריך true'); n++;

  // 2) נותר אחד ⇒ false.
  _ok(isDone({'queue': ['s1']}) == false, "{queue:['s1']} ⇒ צריך false"); n++;

  // 3) שלושה ⇒ false.
  _ok(isDone({'queue': ['s1', 's2', 's3']}) == false,
      "{queue:['s1','s2','s3']} ⇒ צריך false"); n++;

  // 4) יומן מלא אך תור ריק ⇒ true (רק ה-queue קובע, חוק-5).
  _ok(
      isDone({
            'queue': [],
            'log': [
              {'id': 's1', 'outcome': 'answered'}
            ],
            'total': 1
          }) ==
          true,
      'תור ריק עם יומן ⇒ צריך true'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(isDone({'queue': []}) == true, 'assert-live guard');

  print('OK isDone: $n asserts passed');
}
