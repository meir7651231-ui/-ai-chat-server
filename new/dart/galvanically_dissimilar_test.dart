import '../dart-data/galvanically_dissimilar-terms.dart' as td_galvanically_dissimilar;
// בדיקת-חוזה · galvanicallyDissimilar — מייבאת אך ורק את האטום-שלה (חוק-4).
// DoD (דיבר-12): dart run --enable-asserts new/dart/galvanically_dissimilar_test.dart ⇒ exit 0.
import 'galvanically_dissimilar.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(galvanicallyDissimilar({'נחושת', 'פליז'}, term: (k)=>td_galvanically_dissimilar.kTerms[k]!), false, '1 copper↔brass same group'); n++;
  _eq(galvanicallyDissimilar({'נחושת', 'פלדה'}, term: (k)=>td_galvanically_dissimilar.kTerms[k]!), true, '2 copper↔steel');             n++;
  _eq(galvanicallyDissimilar({'פליז', 'פלדה'}, term: (k)=>td_galvanically_dissimilar.kTerms[k]!), true, '3 brass↔steel (fix)');         n++;
  _eq(galvanicallyDissimilar({'נחושת', 'נירוסטה'}, term: (k)=>td_galvanically_dissimilar.kTerms[k]!), true, '4 copper↔stainless');      n++;
  _eq(galvanicallyDissimilar({'פלדה', 'נירוסטה'}, term: (k)=>td_galvanically_dissimilar.kTerms[k]!), false, '5 iron group same');       n++;
  _eq(galvanicallyDissimilar({'נחושת'}, term: (k)=>td_galvanically_dissimilar.kTerms[k]!), false, '6 single group');                    n++;
  _eq(galvanicallyDissimilar({'PEX', 'HDPE'}, term: (k)=>td_galvanically_dissimilar.kTerms[k]!), false, '7 non-metal');                 n++;
  _eq(galvanicallyDissimilar(<String>{}, term: (k)=>td_galvanically_dissimilar.kTerms[k]!), false, '8 empty');                          n++;

  assert(galvanicallyDissimilar({'פליז', 'פלדה'}, term: (k)=>td_galvanically_dissimilar.kTerms[k]!) == true, 'assert-live guard');
  assert(galvanicallyDissimilar({'נחושת', 'פליז'}, term: (k)=>td_galvanically_dissimilar.kTerms[k]!) == false, 'assert-live guard 2');
  print('OK galvanicallyDissimilar: $n asserts passed');
}
