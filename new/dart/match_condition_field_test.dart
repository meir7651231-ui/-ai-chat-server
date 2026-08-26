// בדיקת-חוזה · matchConditionField — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/match_condition_field_test.dart
import 'match_condition_field.dart';

// שקע-הבדיקה: stand-in ל-kRuleConditionFields (ערכי-מקור אינם זמינים; חוק-3).
const Set<String> _fields = {'ageDays', 'sum', 'count'};

void _eq(String? got, String? want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got="$got" want="$want"');
}

void main() {
  var n = 0;

  _eq(matchConditionField('ageDays', conditionFields: _fields), 'ageDays',
      '1 exact'); n++;
  _eq(matchConditionField('התנאי sum גדול', conditionFields: _fields), 'sum',
      '2 contained'); n++;
  _eq(matchConditionField('zzz', conditionFields: _fields), null, '3 no-match'); n++;
  _eq(matchConditionField('   ', conditionFields: _fields), null, '4 blank'); n++;
  _eq(matchConditionField('sum', conditionFields: const <String>{}), null,
      '5 empty fail-closed'); n++;

  assert(matchConditionField('sum', conditionFields: _fields) == 'sum',
      'assert-live guard');

  print('OK matchConditionField: $n asserts passed');
}
