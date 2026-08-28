import '../dart-data/is_directional_device-terms.dart' as td_is_directional_device;
// בדיקת-חוזה · isDirectionalDevice — מייבאת אך ורק את האטום-שלה (חוק-4).
// DoD (דיבר-12): dart run --enable-asserts new/dart/is_directional_device_test.dart ⇒ exit 0.
import 'is_directional_device.dart';

void _eq(bool got, bool want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;
  _eq(isDirectionalDevice(const DevicePart(categoryHe: 'אל חזור'), term: (k)=>td_is_directional_device.kTerms[k]!), true,
      '1 category exact'); n++;
  _eq(isDirectionalDevice(const DevicePart(
          categoryHe: 'אביזרי נחושת', nameHe: 'שסתום אל-חזור נחושת'), term: (k)=>td_is_directional_device.kTerms[k]!),
      true, '2 name with hyphen'); n++;
  _eq(isDirectionalDevice(const DevicePart(
          categoryHe: 'אביזרי נחושת', nameHe: 'שסתום אל חוזר'), term: (k)=>td_is_directional_device.kTerms[k]!),
      true, '3 name with space'); n++;
  _eq(isDirectionalDevice(const DevicePart(
          categoryHe: 'ברזי מעבר', nameHe: 'ברז כדורי'), term: (k)=>td_is_directional_device.kTerms[k]!),
      false, '4 plain valve'); n++;
  _eq(isDirectionalDevice(const DevicePart(categoryHe: 'אל-חזור'), term: (k)=>td_is_directional_device.kTerms[k]!), false,
      '5 category with hyphen ⇒ no match'); n++;
  _eq(isDirectionalDevice(const DevicePart(nameHe: 'אלחזור'), term: (k)=>td_is_directional_device.kTerms[k]!), true,
      '6 contiguous name'); n++;

  assert(isDirectionalDevice(const DevicePart(categoryHe: 'אל חזור'), term: (k)=>td_is_directional_device.kTerms[k]!) == true,
      'assert-live guard');
  print('OK isDirectionalDevice: $n asserts passed');
}
