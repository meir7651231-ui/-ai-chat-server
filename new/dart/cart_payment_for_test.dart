// בדיקת-Golden · cartPaymentFor — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'cart_payment_for.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((cartPaymentFor(StorePayment.card)).toString(), 'CartPaymentMethod.card', '#0'); n++;
  _eq((cartPaymentFor(StorePayment.supplierCredit)).toString(), 'CartPaymentMethod.supplierCredit', '#1'); n++;
  print('✓ cartPaymentFor: '+n.toString()+' Golden');
}
