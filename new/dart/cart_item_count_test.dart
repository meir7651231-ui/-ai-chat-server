// בדיקת-Golden · cartItemCount — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'cart_item_count.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((cartItemCount(const <String, int>{}, const <SmartCartLine>[])).toString(), '0', '#0'); n++;
  _eq((cartItemCount(const <String, int>{'a': 1}, const <SmartCartLine>[const SmartCartLine(productKey: 'a', productName: 'a', productEmoji: 'a', brandName: 'a', brandPrice: 0, productQty: 0, accessories: const <SmartCartAcc>[]),const SmartCartLine(productKey: 'a', productName: 'a', productEmoji: 'a', brandName: 'a', brandPrice: 0, productQty: 0, accessories: const <SmartCartAcc>[])])).toString(), '1', '#1'); n++;
  _eq((cartItemCount(const <String, int>{}, const <SmartCartLine>[const SmartCartLine(productKey: 'a', productName: 'a', productEmoji: 'a', brandName: 'a', brandPrice: 0, productQty: 0, accessories: const <SmartCartAcc>[]),const SmartCartLine(productKey: 'a', productName: 'a', productEmoji: 'a', brandName: 'a', brandPrice: 0, productQty: 0, accessories: const <SmartCartAcc>[])])).toString(), '0', '#2'); n++;
  _eq((cartItemCount(const <String, int>{'a': 1}, const <SmartCartLine>[])).toString(), '1', '#3'); n++;
  print('✓ cartItemCount: '+n.toString()+' Golden');
}
