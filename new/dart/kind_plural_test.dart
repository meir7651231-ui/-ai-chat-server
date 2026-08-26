import '../dart-data/kind_plural-terms.dart';
// בדיקת-חוזה · kindPlural — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/kind_plural_test.dart
import 'kind_plural.dart';

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;
  _eq(kindPlural(ConfigOpKind.setText, false, term: (k)=>kTerms[k]!), 'טקסטים', '1'); n++;
  _eq(kindPlural(ConfigOpKind.setEmoji, false, term: (k)=>kTerms[k]!), 'אמוג׳ים', '2'); n++;
  _eq(kindPlural(ConfigOpKind.setHidden, false, term: (k)=>kTerms[k]!), 'הסתרות', '3'); n++;
  _eq(kindPlural(ConfigOpKind.setOrder, false, term: (k)=>kTerms[k]!), 'שינויי סדר', '4'); n++;
  _eq(kindPlural(ConfigOpKind.setStyle, true, term: (k)=>kTerms[k]!), 'צבעים', '5 all-color'); n++;
  _eq(kindPlural(ConfigOpKind.setStyle, false, term: (k)=>kTerms[k]!), 'עיצובים', '6 mixed'); n++;
  _eq(kindPlural(ConfigOpKind.setAction, true, term: (k)=>kTerms[k]!), 'פעולות', '7 flag-noop'); n++;
  _eq(kindPlural(ConfigOpKind.setText, true, term: (k)=>kTerms[k]!), 'טקסטים', '8 flag-noop'); n++;

  assert(kindPlural(ConfigOpKind.setStyle, true, term: (k)=>kTerms[k]!) == 'צבעים', 'assert-live guard');
  print('OK kindPlural: $n asserts passed');
}
