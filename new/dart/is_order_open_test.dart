// בדיקת-Golden · isOrderOpen — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'is_order_open.dart';

// --- מימוש-השקע verbatim מהמקור (לבדיקה בלבד; לא אטום מיובא) ---
final _src_kDeliveredStage = 'delivered';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((isOrderOpen('', kDeliveredStage: _src_kDeliveredStage)).toString(), 'true', '#0'); n++;
  _eq((isOrderOpen('abc', kDeliveredStage: _src_kDeliveredStage)).toString(), 'true', '#1'); n++;
  _eq((isOrderOpen('כהן לוי', kDeliveredStage: _src_kDeliveredStage)).toString(), 'true', '#2'); n++;
  _eq((isOrderOpen('2026-08-24', kDeliveredStage: _src_kDeliveredStage)).toString(), 'true', '#3'); n++;
  _eq((isOrderOpen('0501234567', kDeliveredStage: _src_kDeliveredStage)).toString(), 'true', '#4'); n++;
  _eq((isOrderOpen('  x  ', kDeliveredStage: _src_kDeliveredStage)).toString(), 'true', '#5'); n++;
  print('✓ isOrderOpen: '+n.toString()+' Golden');
}
