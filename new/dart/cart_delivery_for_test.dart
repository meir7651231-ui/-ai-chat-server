// בדיקת-Golden · cartDeliveryFor — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'cart_delivery_for.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((cartDeliveryFor(true)).toString(), 'CartDelivery.pickup', '#0'); n++;
  _eq((cartDeliveryFor(false)).toString(), 'CartDelivery.standard', '#1'); n++;
  print('✓ cartDeliveryFor: '+n.toString()+' Golden');
}
