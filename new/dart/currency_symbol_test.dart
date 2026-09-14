// בדיקת-Golden · currencySymbol — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'currency_symbol.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((currencySymbol(CatalogCurrency.values.first)).toString(), '₪', '#0'); n++;
  _eq((currencySymbol(CatalogCurrency.values.last)).toString(), '€', '#1'); n++;
  print('✓ currencySymbol: '+n.toString()+' Golden');
}
