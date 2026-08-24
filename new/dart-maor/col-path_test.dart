// בדיקת-חוזה (רתמת-זהב) · colPath — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/col-path.test.mjs:
//   [['demo',true,'families'], 'families']
//   [['demo',false,'families'], 'orgs/demo/families']
//   [['kehila',false,'supporters'], 'orgs/kehila/supporters']
//   [['x',true,'donations'], 'donations']
//   [['',false,'meta'], 'orgs//meta']
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/col-path_test.dart  ⇒ exit 0
import 'col-path.dart';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — חמש דוגמאות-החוזה verbatim (col-path.test.mjs) —
  _eq(colPath('demo', true, 'families'), 'families', '1 root');                        n++;
  _eq(colPath('demo', false, 'families'), 'orgs/demo/families', '2 per-org');          n++;
  _eq(colPath('kehila', false, 'supporters'), 'orgs/kehila/supporters', '3 per-org');  n++;
  _eq(colPath('x', true, 'donations'), 'donations', '4 root');                         n++;
  _eq(colPath('', false, 'meta'), 'orgs//meta', '5 empty slug');                       n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(colPath('demo', false, 'families') == 'orgs/demo/families', 'assert-live guard');

  print('OK colPath: $n asserts passed');
}
