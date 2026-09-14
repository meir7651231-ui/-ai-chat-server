// בדיקת-Golden · courierPhase — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'courier_phase.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((courierPhase(OrderStage.newOrder)).toString(), '0', '#0'); n++;
  _eq((courierPhase(OrderStage.delivered)).toString(), '2', '#1'); n++;
  print('✓ courierPhase: '+n.toString()+' Golden');
}
