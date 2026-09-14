// בדיקת-Golden · socket — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'socket.dart';
import '../dart-data/k_verified_specs-table.dart';
String _show(ConnectorEnd? x) => x == null ? 'null' : 'ConnectorEnd(' + 'type=' + x.type.toString() + ', ' + 'size=' + x.size.toString() + ')';
void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq(_show(socket(0)), 'ConnectorEnd(type=EndType.hdpeCompression, size=0)', '#0'); n++;
  _eq(_show(socket(1)), 'ConnectorEnd(type=EndType.hdpeCompression, size=1)', '#1'); n++;
  _eq(_show(socket(-3)), 'ConnectorEnd(type=EndType.hdpeCompression, size=-3)', '#2'); n++;
  _eq(_show(socket(100)), 'ConnectorEnd(type=EndType.hdpeCompression, size=100)', '#3'); n++;
  _eq(_show(socket(786)), 'ConnectorEnd(type=EndType.hdpeCompression, size=786)', '#4'); n++;
  print('✓ socket: '+n.toString()+' Golden');
}
