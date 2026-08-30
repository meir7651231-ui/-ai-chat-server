import '../dart-data/lipskey_acc_for-data.dart' as td_lipskey_acc_for;
import 'lipskey_acc_for.dart';
void _eq(Object? got, Object? want, String l){ if(got!=want) throw StateError('FAIL [$l]: $got != $want'); }
void main(){
  var n=0;
  // דריסת-SKU ריקה ⇒ נופל לברירת-קטגוריה
  final acc = lipskeyAccFor('ANY-SKU', 'מחסומים גלויים', kLipskeyAccBySku: td_lipskey_acc_for.kLipskeyAccBySku, kLipskeyAccByCategory: td_lipskey_acc_for.kLipskeyAccByCategory);
  _eq(acc.length, 4, '1'); n++;
  _eq(acc.first.name, 'סרט טפלון', '2'); n++;
  _eq(acc.first.must, true, '3'); n++;
  // קטגוריה לא-קיימת ⇒ ריק
  _eq(lipskeyAccFor('X', 'לא-קיים', kLipskeyAccBySku: td_lipskey_acc_for.kLipskeyAccBySku, kLipskeyAccByCategory: td_lipskey_acc_for.kLipskeyAccByCategory).isEmpty, true, '4'); n++;
  print('✓ lipskeyAccFor: $n');
}
