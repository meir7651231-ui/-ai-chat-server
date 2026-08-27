import 'wf_stage_index.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  _eq(wfStageIndex(WfStage.intake), 0, '1'); n++;
  _eq(wfStageIndex(WfStage.ready), 2, '2'); n++;
  _eq(wfStageIndex(WfStage.done), 4, '3'); n++;
  print('✓ wfStageIndex: $n');
}
