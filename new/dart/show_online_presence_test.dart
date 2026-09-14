// בדיקת-Golden · showOnlinePresence — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'show_online_presence.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((showOnlinePresence(ChatLastSeen.everyone)).toString(), 'true', '#0'); n++;
  _eq((showOnlinePresence(ChatLastSeen.nobody)).toString(), 'false', '#1'); n++;
  print('✓ showOnlinePresence: '+n.toString()+' Golden');
}
