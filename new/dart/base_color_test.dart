// בדיקת-אטום · baseColor — מוכיחה בדיוק את דוגמאות base_color.contract.md.
// DoD (דיבר-12): dart run --enable-asserts new/dart/base_color_test.dart ⇒ exit 0 + "baseColor OK".
// מייבאת אך-ורק את האטום-שלה (חוק-4).
import 'base_color.dart';

void main() {
  // #1 — 'שחור'=base · 'מט'=modifier מסונן (:799).
  assert(baseColor(const ColorProduct(nameHe: 'ברז שחור מט')) == 'שחור');

  // #2 — 'מוברש' מסונן, 'ניקל' נשאר.
  assert(baseColor(const ColorProduct(nameHe: 'ברז ניקל מוברש')) == 'ניקל');

  // #3 — base יחיד.
  assert(baseColor(const ColorProduct(nameHe: 'ברז זהב')) == 'זהב');

  // #4 — 'גדול' לא-צבע ⇒ מושמט; 'כרום' נשאר.
  assert(baseColor(const ColorProduct(nameHe: 'ברז כרום גדול')) == 'כרום');

  // #5 — אין מילת-צבע ⇒ מחרוזת-ריקה (לא null).
  assert(baseColor(const ColorProduct(nameHe: 'ברז')) == '');

  print('baseColor OK — 5/5 contract examples proven');
}
