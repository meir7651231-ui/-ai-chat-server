// בדיקת-אטום · colorModifier — מוכיחה בדיוק את דוגמאות color_modifier.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/color_modifier_test.dart ⇒ exit 0 + "colorModifier OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'color_modifier.dart';

void main() {
  // #1 — 'מט' הוא ה-modifier.
  assert(colorModifier(const ColorProduct(nameHe: 'ברז שחור מט')) == 'מט');

  // #2 — 'מוברש'.
  assert(colorModifier(const ColorProduct(nameHe: 'ברז ניקל מוברש')) == 'מוברש');

  // #3 — אין modifier ⇒ null (orElse '').
  assert(colorModifier(const ColorProduct(nameHe: 'ברז זהב')) == null);

  // #4 — אין modifier ⇒ null.
  assert(colorModifier(const ColorProduct(nameHe: 'ברז')) == null);

  // #5 — firstWhere = ה-modifier הראשון לפי סדר-מילים.
  assert(colorModifier(const ColorProduct(nameHe: 'ברז מוברש שחור מט')) == 'מוברש');

  print('colorModifier OK — 5/5 contract examples proven');
}
