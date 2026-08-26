// בדיקת-חוזה · templateForName — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/template_for_name_test.dart
import 'template_for_name.dart';

typedef _Tpl = ({String typeName, String he});

const List<_Tpl> _palette = [
  (typeName: 'button', he: 'כפתור'),
  (typeName: 'text', he: 'טקסט'),
];

String _name(_Tpl t) => t.typeName;

void main() {
  var n = 0;

  final r1 = templateForName<_Tpl>('button', palette: _palette, typeName: _name);
  if (r1?.he != 'כפתור') throw StateError('FAIL [1]: $r1'); n++;

  final r2 = templateForName<_Tpl>('  button  ', palette: _palette, typeName: _name);
  if (r2?.he != 'כפתור') throw StateError('FAIL [2 trim]: $r2'); n++;

  final r3 = templateForName<_Tpl>('', palette: _palette, typeName: _name);
  if (r3 != null) throw StateError('FAIL [3 empty]: $r3'); n++;

  final r4 = templateForName<_Tpl>('   ', palette: _palette, typeName: _name);
  if (r4 != null) throw StateError('FAIL [4 whitespace]: $r4'); n++;

  final r5 = templateForName<_Tpl>('zzz', palette: _palette, typeName: _name);
  if (r5 != null) throw StateError('FAIL [5 miss]: $r5'); n++;

  final r6 = templateForName<_Tpl>('text', palette: const [], typeName: _name);
  if (r6 != null) throw StateError('FAIL [6 empty-palette]: $r6'); n++;

  assert(templateForName<_Tpl>('text', palette: _palette, typeName: _name) != null,
      'assert-live guard');

  print('OK templateForName: $n asserts passed');
}
