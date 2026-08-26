// בדיקת-חוזה · findAttrSiblings — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/find_attr_siblings_test.dart
import 'find_attr_siblings.dart';

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

  // ד1 — מסגרת/צבע: אחים באותה מסגרת+קטגוריה הנושאים מילת-צבע. (:1900-1909)
  const p = LipRow(nameHe: 'מחסום עגול לבן', categoryHe: 'ניקוז');
  const q1 = LipRow(nameHe: 'מחסום עגול שחור', categoryHe: 'ניקוז');
  const q2 = LipRow(nameHe: 'מחסום עגול אדום', categoryHe: 'ניקוז');
  const q4 = LipRow(nameHe: 'סיפון כפול לבן', categoryHe: 'ניקוז');
  const q5 = LipRow(nameHe: 'מחסום עגול שחור', categoryHe: 'אחר');
  _eqNames(
      findAttrSiblings(p, '', AttrKind.color, catalog: const [p, q1, q2, q4, q5]),
      ['מחסום עגול לבן', 'מחסום עגול שחור', 'מחסום עגול אדום'], '1 frame-color'); n++;

  // ד2 — דגם: נציג לכל מילת-דגם, כפולים מדולגים. (:1884-1898)
  const m0 = LipRow(nameHe: 'מושב קיסר', categoryHe: 'מושבים');
  const m1 = LipRow(nameHe: 'מושב דיור', categoryHe: 'מושבים');
  const m2 = LipRow(nameHe: 'מושב קיסר משופר', categoryHe: 'מושבים');
  _eqNames(findAttrSiblings(m0, '', AttrKind.model, catalog: const [m0, m1, m2]),
      ['מושב קיסר', 'מושב דיור'], '2 model'); n++;

  // ד3 — יצרן: אותו spec, יצרן שונה; יצרן-כפול מדולג. (:1845-1857)
  const pm = LipRow(
      nameHe: 'מצמד PPR 20', brand: 'פולירול', categoryHe: 'מצמדים',
      dims: {'יצרן': 'הליארומה', 'dn נומינלי': '20', 'PN': '20'});
  const mk1 = LipRow(
      nameHe: 'מצמד PPRCT 20', brand: 'פולירול', categoryHe: 'מצמדים',
      dims: {'יצרן': 'אקוותרם', 'dn נומינלי': '20', 'PN': '20'});
  const mk2 = LipRow(
      nameHe: 'מצמד PPR 20', brand: 'פולירול', categoryHe: 'מצמדים',
      dims: {'יצרן': 'הליארומה', 'dn נומינלי': '20', 'PN': '20'});
  _eqNames(findAttrSiblings(pm, '', AttrKind.maker, catalog: const [pm, mk1, mk2]),
      ['מצמד PPR 20', 'מצמד PPRCT 20'], '3 maker'); n++;

  // ד4 — PPR/מידה: אחי-מידה באותו סוג+קטגוריה; sameLineOnly מסנן קטגוריה-אחרת. (:1862-1883)
  const pp = LipRow(nameHe: 'מצמד 20', brand: 'פולירול', categoryHe: 'מצמדים');
  const pp1 = LipRow(nameHe: 'מצמד 25', brand: 'פולירול', categoryHe: 'מצמדים');
  const pp2 = LipRow(nameHe: 'מצמד 20', brand: 'פולירול', categoryHe: 'מצמדים');
  const pp3 = LipRow(nameHe: 'מצמד 32', brand: 'פולירול', categoryHe: 'אחר');
  _eqNames(
      findAttrSiblings(pp, '', AttrKind.size, catalog: const [pp, pp1, pp2, pp3]),
      ['מצמד 20', 'מצמד 25'], '4 ppr-size'); n++;

  // ד5 — מסגרת קצרה (frame ריק לאחר הפשטת-הצבע) ⇒ [p]. (:1901)
  const solo = LipRow(nameHe: 'לבן', categoryHe: 'ניקוז');
  _eqNames(findAttrSiblings(solo, '', AttrKind.color, catalog: const [solo, q1]),
      ['לבן'], '5 short-frame'); n++;

  // assert חי (חוק: --enable-asserts).
  assert(findAttrSiblings(solo, '', AttrKind.color, catalog: const [solo]).length == 1,
      'assert-live guard');

  print('OK findAttrSiblings: $n asserts passed');
}
