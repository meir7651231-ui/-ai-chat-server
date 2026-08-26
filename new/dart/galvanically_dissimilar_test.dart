// בדיקת-חוזה · galvanicallyDissimilar — מייבאת אך ורק את האטום-שלה (חוק-4).
// DoD (דיבר-12): dart run --enable-asserts new/dart/galvanically_dissimilar_test.dart ⇒ exit 0.
import 'galvanically_dissimilar.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(galvanicallyDissimilar({'נחושת', 'פליז'}), false, '1 copper↔brass same group'); n++;
  _eq(galvanicallyDissimilar({'נחושת', 'פלדה'}), true, '2 copper↔steel');             n++;
  _eq(galvanicallyDissimilar({'פליז', 'פלדה'}), true, '3 brass↔steel (fix)');         n++;
  _eq(galvanicallyDissimilar({'נחושת', 'נירוסטה'}), true, '4 copper↔stainless');      n++;
  _eq(galvanicallyDissimilar({'פלדה', 'נירוסטה'}), false, '5 iron group same');       n++;
  _eq(galvanicallyDissimilar({'נחושת'}), false, '6 single group');                    n++;
  _eq(galvanicallyDissimilar({'PEX', 'HDPE'}), false, '7 non-metal');                 n++;
  _eq(galvanicallyDissimilar(<String>{}), false, '8 empty');                          n++;

  assert(galvanicallyDissimilar({'פליז', 'פלדה'}) == true, 'assert-live guard');
  assert(galvanicallyDissimilar({'נחושת', 'פליז'}) == false, 'assert-live guard 2');
  print('OK galvanicallyDissimilar: $n asserts passed');
}
