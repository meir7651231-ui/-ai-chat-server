import '../dart-data/few_shot_example-terms.dart' as td_few_shot_example;
// בדיקת-חוזה · fewShotExample — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/few_shot_example_test.dart
import 'few_shot_example.dart';

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  Iterable<String> Function(String) mk(Map<String, List<String>> m) =>
      (id) => m[id] ?? const <String>[];

  _eq(fewShotExample(const [], propKeysFor: mk({}), term: (k)=>td_few_shot_example.kTerms[k]!), null, '1 empty->null'); n++;

  _eq(
    fewShotExample(['a'], propKeysFor: mk({'a': ['text']}), term: (k)=>td_few_shot_example.kTerms[k]!),
    '[{"op":"setText","id":"a","text":"טקסט לדוגמה"}]',
    '2 text first',
  ); n++;

  _eq(
    fewShotExample(['a', 'b'],
        propKeysFor: mk({'a': ['bg'], 'b': ['text']}), term: (k)=>td_few_shot_example.kTerms[k]!),
    '[{"op":"setText","id":"b","text":"טקסט לדוגמה"}]',
    '3 b has text',
  ); n++;

  _eq(
    fewShotExample(['a', 'b'],
        propKeysFor: mk({'a': ['bg'], 'b': ['color']}), term: (k)=>td_few_shot_example.kTerms[k]!),
    '[{"op":"setHidden","id":"a","hidden":false}]',
    '4 no text -> first',
  ); n++;

  _eq(
    fewShotExample(['x', 'y'],
        propKeysFor: mk({'x': ['text'], 'y': ['text']}), term: (k)=>td_few_shot_example.kTerms[k]!),
    '[{"op":"setText","id":"x","text":"טקסט לדוגמה"}]',
    '5 x earliest',
  ); n++;

  assert(fewShotExample(const [], propKeysFor: mk({}), term: (k)=>td_few_shot_example.kTerms[k]!) == null,
      'assert-live guard');

  print('OK fewShotExample: $n asserts passed');
}
