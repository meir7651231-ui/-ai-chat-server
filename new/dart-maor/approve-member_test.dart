// בדיקת-חוזה (רתמת-זהב) · approveMember — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/approve-member.test.mjs:
//   1) {members:['A@b.com ']} + 'c@D.com'          ⇒ {members:['a@b.com','c@d.com']}  (צירוף+נירמול)
//   2) {members:['a@b.com']} + '  A@B.com '         ⇒ {members:['a@b.com']}            (כפילות לא נוספת)
//   3) {} + 'x@y.co.il'                             ⇒ {members:['x@y.co.il']}          (org בלי members)
//   4) {members:['a@b.com',' A@b.com ']} + 'c@d.com' ⇒ {members:['a@b.com','c@d.com']} (כפיל-עבר אוחד)
//   5) org הנכנס לא שוכתב (immutability)            ⇒ org1.members == ['A@b.com ']
// nrm = (e) => e.trim().toLowerCase()  — שקע-הנירמול, זהה למקור.
// הרצה: dart run --enable-asserts new/dart-maor/approve-member_test.dart  ⇒ exit 0
import 'approve-member.dart';

String _nrm(String e) => e.trim().toLowerCase();

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

bool _listEq(List a, List b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

void main() {
  var n = 0;

  // 1) הקיים נורמל, החדש צורף מנורמל.
  final org1 = {
    'members': ['A@b.com ']
  };
  _ok(_listEq(approveMember(org1, 'c@D.com', _nrm)['members']!,
      ['a@b.com', 'c@d.com']), 'צירוף+נירמול שגוי'); n++;

  // 2) כפילות לא נוספת פעמיים.
  _ok(_listEq(approveMember({'members': ['a@b.com']}, '  A@B.com ', _nrm)['members']!,
      ['a@b.com']), 'כפילות נוספה'); n++;

  // 3) org בלי members.
  _ok(_listEq(approveMember({}, 'x@y.co.il', _nrm)['members']!,
      ['x@y.co.il']), 'org ריק לא טופל'); n++;

  // 4) כפילי-עבר מאוחדים בנירמול.
  _ok(_listEq(
      approveMember({'members': ['a@b.com', ' A@b.com ']}, 'c@d.com', _nrm)['members']!,
      ['a@b.com', 'c@d.com']), 'כפיל-עבר לא אוחד'); n++;

  // 5) immutability — הארגון הנכנס לא שוכתב.
  _ok(_listEq(org1['members']!, ['A@b.com ']), 'org הנכנס שוכתב'); n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_listEq(approveMember({}, 'z@z.z', _nrm)['members']!, ['z@z.z']),
      'assert-live guard');

  print('OK approveMember: $n asserts passed');
}
