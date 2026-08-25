// בדיקת-חוזה (רתמת-זהב) · removeMember — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/remove-member.test.mjs:
//   1) org1 + '  A@B.com '  ⇒ {members:['c@d.com'], memberConfigs:{}}   (הסרה+נירמול)
//   2) {members:[' A@b.com ','c@d.com']} + 'a@b.com' ⇒ members=['c@d.com'] (צורה גולמית מוסרת)
//   3) לא-חבר 'z@w.com'      ⇒ אין-שינוי-תוכן (members מוחזר מנורמל)
//   4) {}                    ⇒ {members:[], memberConfigs:{}}
//   5) immutability          ⇒ org1 המקורי לא שוכתב (members + memberConfigs)
// המרה: nrm=(e)=>e.trim().toLowerCase(). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/remove-member_test.dart  ⇒ exit 0
import 'remove-member.dart';

String nrm(String e) => e.trim().toLowerCase();

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

  // 1) הסרה מ-members ומ-memberConfigs אחרי נירמול המייל.
  final org1 = <String, dynamic>{
    'members': ['a@b.com', 'c@d.com'],
    'memberConfigs': {
      'a@b.com': {'limited': true},
    },
  };
  final r1 = removeMember(org1, '  A@B.com ', nrm);
  _ok(_listEq(r1['members'] as List, ['c@d.com']), '1 members ⇒ ${r1['members']}');
  n++;
  _ok((r1['memberConfigs'] as Map).isEmpty,
      '1 memberConfigs ⇒ ${r1['memberConfigs']}');
  n++;

  // 2) רשומת-עבר לא-מנורמלת מוסרת גם היא.
  final r2 = removeMember(
      <String, dynamic>{'members': [' A@b.com ', 'c@d.com']}, 'a@b.com', nrm);
  _ok(_listEq(r2['members'] as List, ['c@d.com']), '2 raw ⇒ ${r2['members']}');
  n++;

  // 3) מייל שאינו חבר — אין-שינוי-תוכן (members מוחזר מנורמל).
  final r3 = removeMember(<String, dynamic>{
    'members': ['x@y.com'],
    'memberConfigs': {
      'x@y.com': {'limited': false},
    },
  }, 'z@w.com', nrm);
  _ok(_listEq(r3['members'] as List, ['x@y.com']), '3 members ⇒ ${r3['members']}');
  n++;
  final mc3 = r3['memberConfigs'] as Map;
  _ok(mc3.containsKey('x@y.com') && (mc3['x@y.com'] as Map)['limited'] == false,
      '3 config ⇒ $mc3');
  n++;

  // 4) org ריק.
  final r4 = removeMember(<String, dynamic>{}, 'a@b.com', nrm);
  _ok((r4['members'] as List).isEmpty, '4 members ⇒ ${r4['members']}');
  n++;
  _ok((r4['memberConfigs'] as Map).isEmpty, '4 memberConfigs ⇒ ${r4['memberConfigs']}');
  n++;

  // 5) immutability — הארגון הנכנס (org1) לא שוכתב.
  _ok(_listEq(org1['members'] as List, ['a@b.com', 'c@d.com']),
      '5 org.members שוכתב ⇒ ${org1['members']}');
  n++;
  _ok((org1['memberConfigs'] as Map).containsKey('a@b.com'),
      '5 org.memberConfigs שוכתב');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_listEq(
      removeMember(org1, 'a@b.com', nrm)['members'] as List, ['c@d.com']),
      'assert-live guard');

  print('OK removeMember: $n asserts passed');
}
