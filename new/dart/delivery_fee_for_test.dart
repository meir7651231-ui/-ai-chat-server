// בדיקת-Golden · deliveryFeeFor — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'delivery_fee_for.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((deliveryFeeFor(CartDelivery.values.first)).toString(), '120', '#0'); n++;
  _eq((deliveryFeeFor(CartDelivery.values.last)).toString(), '0', '#1'); n++;
  print('✓ deliveryFeeFor: '+n.toString()+' Golden');
}
