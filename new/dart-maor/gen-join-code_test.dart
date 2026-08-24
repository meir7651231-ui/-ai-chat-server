// 🥇 רתמת-זהב · genJoinCode — 12 זוגות-Golden בדיוק כמו new/atoms/gen-join-code.test.mjs.
// אם עובר: ‏Dart ≡ JS (חוק-4). הרצה: dart run --enable-asserts gen-join-code_test.dart
import 'gen-join-code.dart';

void main() {
  final cases = <List<String>>[
    ['', 'pftntzvf'],
    ['אבג', '45c0fya5'],
    ['כהן לוי', 'hwy4rhnw'],
    ['abc', 'zagia75b'],
    ['a@b.com', 'p06g521w'],
    ['2026-08-24', 'zihyvk16'],
    ['2026-08-24T12:00:00', 'av8lpigv'],
    ['0501234567', 'y5uk536u'],
    ['03-1234567', '92b8ex1g'],
    ['https://x.co', 'alhc6c1h'],
    ['שלום עולם', 'sur1sf1z'],
    ['12', 'yikua84j'],
  ];
  for (final c in cases) {
    final got = genJoinCode(c[0]);
    if (got != c[1]) {
      throw StateError('✗ "${c[0]}" ⇒ "$got" ≠ "${c[1]}"');
    }
  }
  print('✓ gen-join-code: ${cases.length} הקלטות-Golden — ירוק');
}
