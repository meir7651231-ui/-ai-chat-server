// בדיקת-חוזה (רתמת-זהב) · parseJoinFullCode — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/parse-join-full-code.test.mjs.
// שקע-הבדיקה = בדיוק המקור (platform/lib.ts:34): /^[a-z0-9-]{2,40}$/.
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/parse-join-full-code_test.dart ⇒ exit 0
import 'parse-join-full-code.dart';

// שקע isValidSlug — verbatim מהמקור: /^[a-z0-9-]{2,40}$/.test(slug)
final _slugRe = RegExp(r'^[a-z0-9-]{2,40}$');
bool isValidSlug(String slug) => _slugRe.hasMatch(slug);

void _eq(Map<String, String>? got, Map<String, String>? want, String label) {
  final g = got == null ? 'null' : '{slug:${got['slug']}, code:${got['code']}}';
  final w = want == null ? 'null' : '{slug:${want['slug']}, code:${want['code']}}';
  final same = (got == null && want == null) ||
      (got != null &&
          want != null &&
          got['slug'] == want['slug'] &&
          got['code'] == want['code']);
  if (!same) {
    throw StateError('FAIL [$label]: got=$g want=$w');
  }
}

void main() {
  var n = 0;

  // — שבע דוגמאות-החוזה verbatim (parse-join-full-code.test.mjs) —
  _eq(parseJoinFullCode('maor.AB12', isValidSlug),
      {'slug': 'maor', 'code': 'AB12'}, '1 maor.AB12');            n++;
  _eq(parseJoinFullCode(' MAOR.k9 ', isValidSlug),
      {'slug': 'maor', 'code': 'k9'}, '2 trim + lowercase slug');  n++;
  _eq(parseJoinFullCode('my-org.k.9', isValidSlug),
      {'slug': 'my-org', 'code': 'k.9'}, '3 first dot splits');    n++;
  _eq(parseJoinFullCode('maor', isValidSlug), null, '4 no dot');   n++;
  _eq(parseJoinFullCode('.abc', isValidSlug), null, '5 dot<=0');   n++;
  _eq(parseJoinFullCode('maor.', isValidSlug), null, '6 empty code'); n++;
  _eq(parseJoinFullCode('a!.k99', isValidSlug), null, '7 slug rejected'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  final r = parseJoinFullCode('maor.AB12', isValidSlug);
  assert(r != null && r['slug'] == 'maor' && r['code'] == 'AB12',
      'assert-live guard');

  print('OK parseJoinFullCode: $n asserts passed');
}
