// בדיקת-חוזה · findTypeSiblings — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/find_type_siblings_test.dart
import 'find_type_siblings.dart';

void _eqNames(List<LipRow> got, List<String> want, String label) {
  final g = got.map((r) => r.nameHe).toList();
  if (g.length != want.length) {
    throw StateError('FAIL [$label]: len got=${g.length} want=${want.length} · $g vs $want');
  }
  for (var k = 0; k < g.length; k++) {
    if (g[k] != want[k]) throw StateError('FAIL [$label][$k]: got=${g[k]} want=${want[k]}');
  }
}

void main() {
  var n = 0;

  // קטלוג-בדיקה — ראה find_type_siblings.contract.md.
  const a = LipRow(nameHe: 'מחסום רצפה', categoryHe: 'ניקוז');
  const b = LipRow(nameHe: 'סיפון כפול', categoryHe: 'ניקוז');
  const c = LipRow(nameHe: 'מחסום עגול', categoryHe: 'ניקוז');
  const d = LipRow(nameHe: 'ברז גן', categoryHe: 'ברזים');
  const e = LipRow(nameHe: 'זמבורי אדום', categoryHe: 'ניקוז');
  const p1 = LipRow(nameHe: 'מתאם רקורד 20', brand: 'פולירול', categoryHe: 'PPR');
  const p2 = LipRow(nameHe: 'מתאם מצרה 25', brand: 'פולירול', categoryHe: 'PPR');
  const p3 = LipRow(nameHe: 'מצמד 20', brand: 'פולירול', categoryHe: 'PPR');

  // דוגמה 1 — נציג לכל סוג באותה קטגוריה; C כפול-מדולג, D קטגוריה-אחרת. (:1984-1991)
  _eqNames(findTypeSiblings(a, catalog: const [a, b, c, d]),
      ['מחסום רצפה', 'סיפון כפול'], '1 distinct-types'); n++;

  // דוגמה 2 — סוג יחיד בקטגוריה ⇒ [p]. (:1990)
  _eqNames(findTypeSiblings(a, catalog: const [a, c]),
      ['מחסום רצפה'], '2 single-type'); n++;

  // דוגמה 3 — compound ריק ⇒ [p]. (:1973-1974)
  _eqNames(findTypeSiblings(e, catalog: const [e, a]),
      ['זמבורי אדום'], '3 empty-compound'); n++;

  // דוגמה 4 — PPR מפתח לפי _leadingType ⇒ P2 מתקפל ל-'מתאם'. (:1980-1981)
  _eqNames(findTypeSiblings(p1, catalog: const [p1, p2, p3]),
      ['מתאם רקורד 20', 'מצמד 20'], '4 ppr-leading-key'); n++;

  // assert חי (חוק: --enable-asserts).
  assert(findTypeSiblings(a, catalog: const [a, c]).length == 1, 'assert-live guard');

  print('OK findTypeSiblings: $n asserts passed');
}
