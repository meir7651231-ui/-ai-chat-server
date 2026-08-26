// בדיקת-חוזה · templateFor — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/template_for_test.dart
import 'template_for.dart';

typedef _Tpl = ({String type, String he});

const List<_Tpl> _palette = [
  (type: 'button', he: 'כפתור'),
  (type: 'text', he: 'טקסט'),
];

String _typeOf(_Tpl t) => t.type;

void main() {
  var n = 0;

  final r1 = templateFor<_Tpl, String>('button', palette: _palette, typeOf: _typeOf);
  if (r1?.he != 'כפתור') throw StateError('FAIL [1]: $r1'); n++;

  final r2 = templateFor<_Tpl, String>('text', palette: _palette, typeOf: _typeOf);
  if (r2?.he != 'טקסט') throw StateError('FAIL [2]: $r2'); n++;

  final r3 = templateFor<_Tpl, String>('slider', palette: _palette, typeOf: _typeOf);
  if (r3 != null) throw StateError('FAIL [3 miss]: $r3'); n++;

  final r4 = templateFor<_Tpl, String>('button', palette: const [], typeOf: _typeOf);
  if (r4 != null) throw StateError('FAIL [4 empty]: $r4'); n++;

  const dup = [(type: 'dup', he: 'a'), (type: 'dup', he: 'b')];
  final r5 = templateFor<_Tpl, String>('dup', palette: dup, typeOf: _typeOf);
  if (r5?.he != 'a') throw StateError('FAIL [5 first-wins]: $r5'); n++;

  assert(templateFor<_Tpl, String>('text', palette: _palette, typeOf: _typeOf) != null,
      'assert-live guard');

  print('OK templateFor: $n asserts passed');
}
