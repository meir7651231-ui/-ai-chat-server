// רתמת-זהב · is-member — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// שקעי-הבדיקה מקומיים (מוסכמת-maor: nrm=trim+lower · mgr=manager מנורמל).
import 'is-member.dart';

String nrm(String e) => e.trim().toLowerCase();

bool mgr(String e, Map<String, dynamic> o) {
  final m = ((o['manager'] as String?) ?? '').trim().toLowerCase();
  return m.isNotEmpty && nrm(e) == m;
}

void main() {
  final cases = <List<dynamic>>[
    ['boss@x.com', {'manager': 'Boss@x.com', 'members': <String>[]}, true],
    [' Anna@x.com', {'manager': 'boss@x.com', 'members': ['anna@x.com ']}, true],
    ['guest@x.com', {'manager': 'boss@x.com', 'members': ['anna@x.com']}, false],
    ['a@x.com', <String, dynamic>{}, false],
    ['b@x.com', {'members': [' B@X.com ']}, true],
  ];
  for (final c in cases) {
    final email = c[0] as String;
    final org = (c[1] as Map).cast<String, dynamic>();
    final want = c[2] as bool;
    final got = isMember(email, org, nrm, mgr);
    assert(got == want, '✗ $email ⇒ $got ≠ $want');
  }
  print('✓ is-member (Dart): 5 דוגמאות-חוזה — ירוק');
}
