// בדיקת-Golden · p58SaddleModel — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'p58_saddle_model.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((p58SaddleModel('x32')).toString(), 'B', '#0'); n++;
  _eq((p58SaddleModel('B')).toString(), 'A', '#1'); n++;
  _eq((p58SaddleModel('110-125-160x25')).toString(), 'B', '#2'); n++;
  _eq((p58SaddleModel('A')).toString(), 'A', '#3'); n++;
  _eq((p58SaddleModel('')).toString(), 'A', '#4'); n++;
  _eq((p58SaddleModel('abc')).toString(), 'A', '#5'); n++;
  _eq((p58SaddleModel('כהן לוי')).toString(), 'A', '#6'); n++;
  _eq((p58SaddleModel('2026-08-24')).toString(), 'A', '#7'); n++;
  _eq((p58SaddleModel('0501234567')).toString(), 'A', '#8'); n++;
  _eq((p58SaddleModel('  x  ')).toString(), 'A', '#9'); n++;
  print('✓ p58SaddleModel: '+n.toString()+' Golden');
}
