// בדיקת-חוזה · matchAssistantCategory — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_assistant_category_test.dart
import 'match_assistant_category.dart';

const List<String> _cats = ['plumbing', 'electric', 'plumbingPro'];

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(matchAssistantCategory('electric', categories: _cats), 'electric',
      '1 exact'); n++;
  _eq(matchAssistantCategory('plumbingPro', categories: _cats), 'plumbingPro',
      '2 exact-over-substring'); n++;
  _eq(matchAssistantCategory('רוצה plumbingPro בבקשה', categories: _cats),
      'plumbingPro', '3 longest-contained'); n++;
  _eq(matchAssistantCategory('zzz', categories: _cats), null, '4 no-match'); n++;
  _eq(matchAssistantCategory('   ', categories: _cats), null, '5 blank'); n++;
  _eq(matchAssistantCategory('electric', categories: const <String>[]), null,
      '6 empty'); n++;

  assert(matchAssistantCategory('electric', categories: _cats) == 'electric',
      'assert-live guard');

  print('OK matchAssistantCategory: $n asserts passed');
}
