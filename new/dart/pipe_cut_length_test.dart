// בדיקת-Golden · pipeCutLength — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'pipe_cut_length.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((pipeCutLength(0, 0, 0)).toString(), '0.0', '#0'); n++;
  _eq((pipeCutLength(1, 1, 1)).toString(), '-1.0', '#1'); n++;
  _eq((pipeCutLength(-3, -3, -3)).toString(), '3.0', '#2'); n++;
  _eq((pipeCutLength(100, 100, 100)).toString(), '-100.0', '#3'); n++;
  _eq((pipeCutLength(786, 786, 786)).toString(), '-786.0', '#4'); n++;
  _eq((pipeCutLength(3.14, 3.14, 3.14)).toString(), '-3.1', '#5'); n++;
  _eq((pipeCutLength(0.5, 0.5, 0.5)).toString(), '-0.5', '#6'); n++;
  _eq((pipeCutLength(0, 1, 1)).toString(), '-2.0', '#7'); n++;
  _eq((pipeCutLength(0, 1, -3)).toString(), '2.0', '#8'); n++;
  _eq((pipeCutLength(0, 1, 100)).toString(), '-101.0', '#9'); n++;
  _eq((pipeCutLength(0, 1, 786)).toString(), '-787.0', '#10'); n++;
  _eq((pipeCutLength(0, 1, 3.14)).toString(), '-4.1', '#11'); n++;
  print('✓ pipeCutLength: '+n.toString()+' Golden');
}
