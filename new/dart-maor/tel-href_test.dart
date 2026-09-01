// בדיקת חוט · tel-href — כל דוגמאות-החוזה + בדיקת-ה-JS (tel-href.test.mjs)
import 'tel-href.dart';

void main() {
  final cases = <List<dynamic>>[
    ['050-1234567', 'tel:0501234567'],
    ['+972-50-123-4567', 'tel:+972501234567'],
    ['05 0 1234567', 'tel:0501234567'],
    ['123', null],
    ['', null],
    [null, null],
  ];
  if (cases.length != 6) {
    throw StateError('tel-href: צפויות 6 דוגמאות-חוזה, נמצאו ${cases.length}');
  }
  for (final c in cases) {
    final got = telHref(c[0]);
    if (got != c[1]) {
      throw StateError('tel-href: ${c[0]} ⇒ $got ≠ ${c[1]}');
    }
  }
  print('OK');
}
