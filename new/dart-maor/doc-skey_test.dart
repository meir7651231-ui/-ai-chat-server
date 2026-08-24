// בדיקת-חוזה (רתמת-זהב) · docSkey — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/doc-skey.test.mjs:
//   SHARED='_shared_' · supKeyOf(sp)=(sp.forWho??'').trim()||SHARED · map={s1→'כולל ערב'}
//   1) ('supporters', {forWho:'ישיבת אור'}) ⇒ 'ישיבת אור'
//   2) ('supporters', {forWho:'  '})        ⇒ '_shared_'   (רווחים ⇒ משותף)
//   3) ('events',     {spId:'s1'})          ⇒ 'כולל ערב'   (דרך המפה)
//   4) ('events',     {spId:'s9'})          ⇒ '_shared_'   (spId שאינו במפה)
//   5) ('events',     {})                   ⇒ '_shared_'   (אירוע כללי)
//   6) ('events',     {spId:42})            ⇒ '_shared_'   (spId לא-מחרוזת)
//   7) ('families',   {forWho:'ישיבת אור'}) ⇒ ''           (אוסף לא-נאכף)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/doc-skey_test.dart  ⇒ exit 0
import 'doc-skey.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;

  const SHARED = '_shared_';
  // השקע supKeyOf האמיתי (forWho מחוטא): (forWho??'').trim() || SHARED.
  String supKeyOf(Map<String, dynamic> sp) {
    final t = ((sp['forWho'] ?? '') as String).trim();
    return t.isNotEmpty ? t : SHARED;
  }

  final map = <String, String>{'s1': 'כולל ערב'};

  // כל שורה: [col, data, want] — בדיוק טבלת-C של בדיקת-ה-JS.
  final cases = <List<dynamic>>[
    ['supporters', <String, dynamic>{'forWho': 'ישיבת אור'}, 'ישיבת אור'],
    ['supporters', <String, dynamic>{'forWho': '  '}, SHARED],
    ['events', <String, dynamic>{'spId': 's1'}, 'כולל ערב'],
    ['events', <String, dynamic>{'spId': 's9'}, SHARED],
    ['events', <String, dynamic>{}, SHARED],
    ['events', <String, dynamic>{'spId': 42}, SHARED],
    ['families', <String, dynamic>{'forWho': 'ישיבת אור'}, ''],
  ];

  for (final c in cases) {
    final col = c[0] as String;
    final data = c[1] as Map<String, dynamic>;
    final want = c[2] as String;
    final got = docSkey(col, data, map, supKeyOf, SHARED);
    _ok(got == want, '($col, $data) ⇒ "$got" ≠ "$want"');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(docSkey('events', {'spId': 's1'}, map, supKeyOf, SHARED) == 'כולל ערב',
      'assert-live guard');

  print('OK docSkey: $n asserts passed');
}
