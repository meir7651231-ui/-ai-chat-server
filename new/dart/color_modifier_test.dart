// בדיקת-אטום · colorModifier — מוכיחה בדיוק את דוגמאות color_modifier.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/color_modifier_test.dart ⇒ exit 0 + "colorModifier OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import '../dart-data/color_modifier-data.dart' as td_color_modifier;
import 'color_modifier.dart';

void main() {
  // #1 — 'מט' הוא ה-modifier.
  assert(colorModifier(const ColorProduct(nameHe: 'ברז שחור מט'), kColorModifiers: td_color_modifier.kColorModifiers) == 'מט');

  // #2 — 'מוברש'.
  assert(colorModifier(const ColorProduct(nameHe: 'ברז ניקל מוברש'), kColorModifiers: td_color_modifier.kColorModifiers) == 'מוברש');

  // #3 — אין modifier ⇒ null (orElse '').
  assert(colorModifier(const ColorProduct(nameHe: 'ברז זהב'), kColorModifiers: td_color_modifier.kColorModifiers) == null);

  // #4 — אין modifier ⇒ null.
  assert(colorModifier(const ColorProduct(nameHe: 'ברז'), kColorModifiers: td_color_modifier.kColorModifiers) == null);

  // #5 — firstWhere = ה-modifier הראשון לפי סדר-מילים.
  assert(colorModifier(const ColorProduct(nameHe: 'ברז מוברש שחור מט'), kColorModifiers: td_color_modifier.kColorModifiers) == 'מוברש');

  print('colorModifier OK — 5/5 contract examples proven');
}
