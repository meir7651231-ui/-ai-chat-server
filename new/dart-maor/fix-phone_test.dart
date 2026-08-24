// בדיקת-חוזה (רתמת-זהב) · fixPhone — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/fix-phone.test.mjs:
//   [['0501234567','050-1234567'],['+972-50-1234567','050-1234567'],
//    ['025551234','02-5551234'],['81234567','08-1234567'],['',''],['abc','abc']]
// השקע formatIsraeliPhone מוזרק כלשונו מ-maor/src/lib/validate.ts (מקומי-לבדיקה, כמו ב-JS).
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/fix-phone_test.dart  ⇒ exit 0
import 'fix-phone.dart';

// — שקע-ייחוס: formatIsraeliPhone כלשונו מ-validate.ts (verbatim מבדיקת-ה-JS) —
String _formatIsraeliPhone(dynamic raw) {
  final s = (raw ?? '').toString().trim();
  var d = s.replaceAll(RegExp(r'\D'), '');
  if (d.startsWith('00972')) {
    d = '0' + d.substring(5);
  } else if (d.startsWith('972')) {
    d = '0' + d.substring(3);
  }
  if (d.isEmpty) return s;
  if (d[0] == '0') {
    if (d.length == 10) return d.substring(0, 3) + '-' + d.substring(3);
    if (d.length == 9) return d.substring(0, 2) + '-' + d.substring(2);
    return d;
  }
  if (d.length == 9) return '0' + d.substring(0, 2) + '-' + d.substring(2);
  if (d.length == 8) return '0' + d[0] + '-' + d.substring(1);
  return s;
}

void _eq(String got, String want, Object? input) {
  if (got != want) {
    throw StateError(
        'FAIL input=${input == null ? "null" : "\"$input\""}\n got =$got\n want=$want');
  }
}

void main() {
  var n = 0;

  // — שש דוגמאות-החוזה verbatim מ-fix-phone.test.mjs (input → expected) —
  final cases = <List<String>>[
    ['0501234567', '050-1234567'],
    ['+972-50-1234567', '050-1234567'],
    ['025551234', '02-5551234'],
    ['81234567', '08-1234567'],
    ['', ''],
    ['abc', 'abc'],
  ];

  for (final c in cases) {
    final input = c[0];
    final want = c[1];
    _eq(fixPhone(input, _formatIsraeliPhone), want, input);
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(fixPhone('0501234567', _formatIsraeliPhone) == '050-1234567',
      'assert-live guard');

  print('OK fixPhone: $n asserts passed');
}
