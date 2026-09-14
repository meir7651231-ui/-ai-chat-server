// בדיקת-Golden · attrEmoji — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'attr_emoji.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((attrEmoji(AttrKind.values.first)).toString(), '📐', '#0'); n++;
  _eq((attrEmoji(AttrKind.values.last)).toString(), '🏭', '#1'); n++;
  print('✓ attrEmoji: '+n.toString()+' Golden');
}
