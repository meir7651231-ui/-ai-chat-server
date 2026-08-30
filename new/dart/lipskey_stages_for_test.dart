import '../dart-data/lipskey_stages_for-data.dart' as td_lipskey_stages_for;
import 'lipskey_stages_for.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  final st = lipskeyStagesFor('ANY-SKU', 'מחסומים גלויים', kLipskeyStagesBySku: td_lipskey_stages_for.kLipskeyStagesBySku, kLipskeyStagesByCategory: td_lipskey_stages_for.kLipskeyStagesByCategory);
  _eq(st.length, 4, '1'); n++;
  _eq(st.first.label, 'הכנה', '2'); n++;
  _eq(st.last.isFinal, true, '3'); n++;
  _eq(lipskeyStagesFor('X', 'לא-קיים', kLipskeyStagesBySku: td_lipskey_stages_for.kLipskeyStagesBySku, kLipskeyStagesByCategory: td_lipskey_stages_for.kLipskeyStagesByCategory).isEmpty, true, '4'); n++;
  print('✓ lipskeyStagesFor: $n');
}
