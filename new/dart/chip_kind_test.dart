// בדיקת-Golden · chipKind — אפיון-חצב (חוק-4). מייבאת רק את האטום.
import 'chip_kind.dart';

void _eq(String got, String want, String lbl){ if(got!=want) throw StateError('FAIL [$lbl]: got=$got want=$want'); }
void main(){
  var n=0;
  _eq((chipKind('diameter')).toString(), 'AttributeKind.dimension', '#0'); n++;
  _eq((chipKind('diameter-small')).toString(), 'AttributeKind.dimension', '#1'); n++;
  _eq((chipKind('color')).toString(), 'AttributeKind.color', '#2'); n++;
  _eq((chipKind('dimension')).toString(), 'AttributeKind.choice', '#3'); n++;
  _eq((chipKind('choice')).toString(), 'AttributeKind.choice', '#4'); n++;
  _eq((chipKind('material')).toString(), 'AttributeKind.choice', '#5'); n++;
  _eq((chipKind('')).toString(), 'AttributeKind.choice', '#6'); n++;
  _eq((chipKind('abc')).toString(), 'AttributeKind.choice', '#7'); n++;
  _eq((chipKind('כהן לוי')).toString(), 'AttributeKind.choice', '#8'); n++;
  _eq((chipKind('2026-08-24')).toString(), 'AttributeKind.choice', '#9'); n++;
  _eq((chipKind('0501234567')).toString(), 'AttributeKind.choice', '#10'); n++;
  _eq((chipKind('  x  ')).toString(), 'AttributeKind.choice', '#11'); n++;
  print('✓ chipKind: '+n.toString()+' Golden');
}
