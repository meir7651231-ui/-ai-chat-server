// בדיקת-חוזה · isDirectionalDevice — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/is_directional_device_test.dart
import 'is_directional_device.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(isDirectionalDevice(categoryHe: 'אל חזור', nameHe: ''), true, '1 cat'); n++;
  _eq(isDirectionalDevice(categoryHe: 'ברזים', nameHe: 'שסתום אל-חזור'), true, '2 name-hyphen'); n++;
  _eq(isDirectionalDevice(categoryHe: 'ברזים', nameHe: 'אל חוזר קפיצי'), true, '3 name-space'); n++;
  _eq(isDirectionalDevice(categoryHe: 'ברזים', nameHe: 'ברז כדורי'), false, '4 neither'); n++;
  _eq(isDirectionalDevice(categoryHe: 'אל חזור ', nameHe: 'x'), false, '5 cat-exact'); n++;
  _eq(isDirectionalDevice(categoryHe: 'ברזים', nameHe: 'א-ל-ח-ז-ו-ר'), true, '6 hyphens'); n++;
  _eq(isDirectionalDevice(categoryHe: 'ברזים', nameHe: 'אלחוזר'), true, '7 direct'); n++;

  assert(isDirectionalDevice(categoryHe: 'אל חזור', nameHe: ''), 'assert-live guard');
  print('OK isDirectionalDevice: $n asserts passed');
}
