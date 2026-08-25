// רתמת-זהב · is-admin-user — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות). Dart≡JS.
import 'is-admin-user.dart';

void main() {
  final cases = <List<dynamic>>[
    [<String, dynamic>{}, 'anyone@x.com', true],
    [<String, dynamic>{'adminEmails': <String>[]}, null, true],
    [<String, dynamic>{'adminEmails': ['a@b.com']}, null, false],
    [<String, dynamic>{'adminEmails': [' A@B.Com ']}, 'a@b.com', true],
    [<String, dynamic>{'adminEmails': ['a@b.com']}, '  A@B.COM ', true],
    [<String, dynamic>{'adminEmails': ['a@b.com']}, 'z@b.com', false],
    [<String, dynamic>{'adminEmails': ['a@b.com']}, '', false],
  ];
  for (final c in cases) {
    final config = c[0] as Map<String, dynamic>;
    final email = c[1] as String?;
    final want = c[2] as bool;
    final got = isAdminUser(config, email);
    assert(got == want, '✗ $config · $email ⇒ $got ≠ $want');
  }
  print('✓ is-admin-user (Dart): 7 דוגמאות-חוזה — ירוק (רשימה-ריקה=כולם · trim+lowercase דו-צדדי)');
}
