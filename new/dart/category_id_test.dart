// בדיקת-Golden · categoryId — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'category_id.dart';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((categoryId('', kPlumbingTradeId: 'plumbing')).toString(), 'plumbing.cat.', '#0'); n++;
  _eq((categoryId('abc', kPlumbingTradeId: 'plumbing')).toString(), 'plumbing.cat.abc', '#1'); n++;
  _eq((categoryId('כהן לוי', kPlumbingTradeId: 'plumbing')).toString(), 'plumbing.cat.כהן לוי', '#2'); n++;
  _eq((categoryId('2026-08-24', kPlumbingTradeId: 'plumbing')).toString(), 'plumbing.cat.2026-08-24', '#3'); n++;
  _eq((categoryId('0501234567', kPlumbingTradeId: 'plumbing')).toString(), 'plumbing.cat.0501234567', '#4'); n++;
  _eq((categoryId('  x  ', kPlumbingTradeId: 'plumbing')).toString(), 'plumbing.cat.  x  ', '#5'); n++;
  print('✓ categoryId: '+n.toString()+' Golden');
}
