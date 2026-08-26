// בדיקת-חוזה · formatNis — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/format_nis_test.dart
import 'format_nis.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

// stub דטרמיניסטי — מבודד את הרכבת-האטום מהתנהגות-groupThousands האמיתית.
String _grp(int x) => x.abs().toString();

void main() {
  var n = 0;
  _eq(formatNis(0, groupThousands: _grp), '₪0', '1 zero no minus'); n++;
  _eq(formatNis(500, groupThousands: _grp), '₪500', '2 positive'); n++;
  _eq(formatNis(-500, groupThousands: _grp), '-₪500', '3 minus before shekel'); n++;
  _eq(formatNis(1200, prefix: 'סה"כ ', groupThousands: _grp), 'סה"כ ₪1200',
      '4 prefix'); n++;
  _eq(formatNis(-1, prefix: 'X', groupThousands: _grp), 'X-₪1', '5 prefix+minus'); n++;

  assert(formatNis(0, groupThousands: _grp) == '₪0', 'assert-live guard');

  print('OK formatNis: $n asserts passed');
}
