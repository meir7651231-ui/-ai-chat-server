// בדיקת-אטום · baseColor — מוכיחה בדיוק את דוגמאות base_color.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/base_color_test.dart ⇒ exit 0 + "baseColor OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import '../dart-data/base_color-data.dart' as td_base_color;
import 'base_color.dart';

void main() {
  // #1 — 'שחור'=base · 'מט'=modifier מסונן (:799).
  assert(baseColor(const ColorProduct(nameHe: 'ברז שחור מט'), kColorWords: td_base_color.kColorWords, kColorModifiers: td_base_color.kColorModifiers) == 'שחור');

  // #2 — 'מוברש' מסונן, 'ניקל' נשאר.
  assert(baseColor(const ColorProduct(nameHe: 'ברז ניקל מוברש'), kColorWords: td_base_color.kColorWords, kColorModifiers: td_base_color.kColorModifiers) == 'ניקל');

  // #3 — base יחיד.
  assert(baseColor(const ColorProduct(nameHe: 'ברז זהב'), kColorWords: td_base_color.kColorWords, kColorModifiers: td_base_color.kColorModifiers) == 'זהב');

  // #4 — 'גדול' לא-צבע ⇒ מושמט; 'כרום' נשאר.
  assert(baseColor(const ColorProduct(nameHe: 'ברז כרום גדול'), kColorWords: td_base_color.kColorWords, kColorModifiers: td_base_color.kColorModifiers) == 'כרום');

  // #5 — אין מילת-צבע ⇒ מחרוזת-ריקה (לא null).
  assert(baseColor(const ColorProduct(nameHe: 'ברז'), kColorWords: td_base_color.kColorWords, kColorModifiers: td_base_color.kColorModifiers) == '');

  print('baseColor OK — 5/5 contract examples proven');
}
