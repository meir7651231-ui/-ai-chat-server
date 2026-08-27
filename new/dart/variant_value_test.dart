// בדיקת-חוזה golden · variantValue — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/variant_value_test.dart
import 'variant_value.dart';

void main() {
  var n = 0;
  AttrKind? kindOf(String w) {
    if (RegExp(r'^\d').hasMatch(w)) return AttrKind.size;
    if (w == 'כחול' || w == 'אדום') return AttrKind.color;
    return null;
  }

  final r1 = variantValue(
      const LipskeyCatalogProduct(nameHe: 'ברז 16 כחול'), AttrKind.size,
      kindOf: kindOf);
  if (r1 != '16') throw StateError('FAIL 1: "$r1"');
  n++;

  final r2 = variantValue(
      const LipskeyCatalogProduct(nameHe: 'ברז 16 כחול'), AttrKind.color,
      kindOf: kindOf);
  if (r2 != 'כחול') throw StateError('FAIL 2: "$r2"');
  n++;

  final r3 = variantValue(
      const LipskeyCatalogProduct(nameHe: '16 מחבר 20'), AttrKind.size,
      kindOf: kindOf);
  if (r3 != '16 20') throw StateError('FAIL 3: "$r3"');
  n++;

  final r4 = variantValue(
      const LipskeyCatalogProduct(nameHe: 'ברז פשוט'), AttrKind.model,
      kindOf: kindOf);
  if (r4 != '') throw StateError('FAIL 4: "$r4"');
  n++;

  assert(
      variantValue(const LipskeyCatalogProduct(nameHe: 'אדום'), AttrKind.color,
              kindOf: kindOf) ==
          'אדום',
      'assert-live');
  print('OK variantValue: $n asserts passed');
}
