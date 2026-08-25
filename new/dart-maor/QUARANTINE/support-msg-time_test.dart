// בדיקת-Golden · support-msg-time — כל 12 הזוגות מהחוזה ומבדיקת-ה-JS (זהה-ביט).
import 'support-msg-time.dart';

void main() {
  final cases = <List<String>>[
    ['', ''],
    ['אבג', ''],
    ['כהן לוי', ''],
    ['abc', ''],
    ['a@b.com', ''],
    ['2026-08-24', '12:00'],
    ['2026-08-24T12:00:00', '12:00'],
    ['0501234567', ''],
    ['03-1234567', ''],
    ['https://x.co', ''],
    ['שלום עולם', ''],
    ['12', ''],
  ];
  var i = 0;
  for (final c in cases) {
    final got = supportMsgTime(c[0]);
    if (got is! String) {
      throw StateError('מקרה $i: הפלט אינו String — $got');
    }
    if (got != c[1]) {
      throw StateError("מקרה $i: '${c[0]}' ⇒ '$got' ≠ '${c[1]}'");
    }
    i++;
  }
  print('OK');
}
