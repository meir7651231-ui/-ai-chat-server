// רתמת-זהב · importable-contacts — בדיוק 5 דוגמאות-החוזה של importable-contacts.test.mjs.
// עובר ⇒ Dart ≡ JS. הרצה: dart run --enable-asserts importable-contacts_test.dart
import 'importable-contacts.dart';

void main() {
  // 1. אין כרטיסים
  assert(importableContacts('x', (t) => <dynamic>[], (c) => true).isEmpty);

  // 2. סינון-זבל שומר-סדר (זבל = שם ריק, כמו JS `(c) => !c.n`)
  final three = <Map<String, dynamic>>[
    {'n': 'א'},
    {'n': ''},
    {'n': 'ב'},
  ];
  final got2 = importableContacts('x', (t) => three, (c) => (c['n'] as String).isEmpty);
  assert(got2.length == 2 && got2[0]['n'] == 'א' && got2[1]['n'] == 'ב');

  // 3. הכול זבל
  assert(importableContacts('x', (t) => three, (c) => true).isEmpty);

  // 4. אפס-זבל — אותם רפרנסים ובאותו סדר
  final got4 = importableContacts('x', (t) => three, (c) => false);
  assert(got4.length == 3 &&
      identical(got4[0], three[0]) &&
      identical(got4[1], three[1]) &&
      identical(got4[2], three[2]));

  // 5. הטקסט מועבר כמו-שהוא, קריאה אחת
  final seen = <dynamic>[];
  importableContacts('BEGIN:VCARD', (t) {
    seen.add(t);
    return <dynamic>[];
  }, (c) => false);
  assert(seen.length == 1 && seen[0] == 'BEGIN:VCARD');

  print('✓ importable-contacts (Dart): 5 דוגמאות-חוזה — ירוק');
}
