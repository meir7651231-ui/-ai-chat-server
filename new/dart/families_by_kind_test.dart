// בדיקת-חוזה golden · familiesByKind — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/families_by_kind_test.dart
import 'families_by_kind.dart';

void main() {
  var n = 0;
  const fams = <VariantFamily>[
    VariantFamily(kind: AttrKind.size),
    VariantFamily(kind: AttrKind.color),
    VariantFamily(kind: AttrKind.size),
  ];

  // null ⇒ הכול (אותה רשימה)
  final r1 = familiesByKind(null, families: fams);
  if (r1.length != 3) throw StateError('FAIL 1: ${r1.length}');
  n++;

  // סינון size ⇒ 2
  final r2 = familiesByKind(AttrKind.size, families: fams);
  if (r2.length != 2 || r2.any((f) => f.kind != AttrKind.size)) {
    throw StateError('FAIL 2: ${r2.length}');
  }
  n++;

  // סינון color ⇒ 1
  if (familiesByKind(AttrKind.color, families: fams).length != 1) {
    throw StateError('FAIL 3');
  }
  n++;

  // סוג שאין ⇒ ריק
  if (familiesByKind(AttrKind.model, families: fams).isNotEmpty) {
    throw StateError('FAIL 4');
  }
  n++;

  assert(familiesByKind(null, families: const []).isEmpty, 'assert-live');
  print('OK familiesByKind: $n asserts passed');
}
