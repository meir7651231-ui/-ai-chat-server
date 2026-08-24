// בדיקת-חוזה (רתמת-זהב) · donationsPath — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/donations-path.test.mjs:
//   colPath = (slug,root,col) => root ? col : 'orgs/'+slug+'/'+col ; COL='donations'
//   [['demo',  true ], 'donations']
//   [['demo',  false], 'orgs/demo/donations']
//   [['kehila',false], 'orgs/kehila/donations']
// כולל בדיקת שקילות-שקע: donationsPath(...) == colPath(slug,root,COL).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/donations-path_test.dart  ⇒ exit 0
import 'donations-path.dart';

// השקע colPath — verbatim מהבדיקה של המקור (הבדיקה לא מייבאת אטום אחר — חוק-4).
String _colPath(String slug, bool cloudRoot, String col) =>
    cloudRoot ? col : 'orgs/' + slug + '/' + col;

const String _COL = 'donations';

void _eq(String got, String want, String label) {
  if (got != want) {
    throw StateError('FAIL [$label]: got="$got" want="$want"');
  }
}

void main() {
  var n = 0;

  // — שלוש דוגמאות-החוזה verbatim (donations-path.test.mjs) —
  _eq(donationsPath('demo', true, _colPath, _COL), 'donations', '1 root');                       n++;
  _eq(donationsPath('demo', false, _colPath, _COL), 'orgs/demo/donations', '2 per-org');         n++;
  _eq(donationsPath('kehila', false, _colPath, _COL), 'orgs/kehila/donations', '3 per-org');     n++;

  // — שקילות-שקע: donationsPath ≡ קריאה-ישירה ל-colPath (כמו במקור) —
  for (final root in [true, false]) {
    for (final slug in ['demo', 'kehila', '']) {
      _eq(donationsPath(slug, root, _colPath, _COL), _colPath(slug, root, _COL),
          'socket-eq slug="$slug" root=$root');
      n++;
    }
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(donationsPath('demo', false, _colPath, _COL) == 'orgs/demo/donations',
      'assert-live guard');

  print('OK donationsPath: $n asserts passed');
}
