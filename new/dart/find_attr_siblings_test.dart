import '../dart-data/find_attr_siblings-terms.dart' as td_find_attr_siblings;
// בדיקת-חוזה · findAttrSiblings — מייבאת אך ורק את האטום-שלה (חוק-4).
// המנוע נבדק עם **מילון מוזרק זעיר** (תת-קבוצת-מקור) — מוכיח מנגנון, לא קטלוג.
// טענת "הדאטה מוחלפת ⇒ הפלט משתנה" מוכיחה שהמילון מוזרק, לא צרוב.
// הרצה: dart run --enable-asserts new/dart/find_attr_siblings_test.dart
import 'find_attr_siblings.dart';

// ─── מילון מוזרק זעיר (תת-קבוצת-מקור מספיקה לדוגמאות) ─────────────────────────
const _models = ['קיסר', 'דיור'];
const _types = ['מצמד'];
const _subtypes = <String>[];
const _colorsFull = ['לבן', 'שחור', 'אדום'];
const _ppr = {'PPR', 'PPRCT'};
const _mods = {'מוברש', 'מט'};
const _brand = 'פולירול';

List<LipRow> _fa(LipRow p, AttrKind kind, List<LipRow> catalog,
        {List<String> colors = _colorsFull}) =>
    findAttrSiblings(p, '', kind,
        catalog: catalog,
        models: _models,
        types: _types,
        subtypes: _subtypes,
        colors: colors,
        pprMaterials: _ppr,
        colorModifiers: _mods,
        polyrollBrand: _brand, term: (k)=>td_find_attr_siblings.kTerms[k]!);

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

  // ד1 — מסגרת/צבע: אחים באותה מסגרת+קטגוריה הנושאים מילת-צבע.
  const p = LipRow(nameHe: 'מחסום עגול לבן', categoryHe: 'ניקוז');
  const q1 = LipRow(nameHe: 'מחסום עגול שחור', categoryHe: 'ניקוז');
  const q2 = LipRow(nameHe: 'מחסום עגול אדום', categoryHe: 'ניקוז');
  const q4 = LipRow(nameHe: 'סיפון כפול לבן', categoryHe: 'ניקוז');
  const q5 = LipRow(nameHe: 'מחסום עגול שחור', categoryHe: 'אחר');
  _eqNames(_fa(p, AttrKind.color, const [p, q1, q2, q4, q5]),
      ['מחסום עגול לבן', 'מחסום עגול שחור', 'מחסום עגול אדום'], '1 frame-color'); n++;

  // ד2 — דגם: נציג לכל מילת-דגם, כפולים מדולגים.
  const m0 = LipRow(nameHe: 'מושב קיסר', categoryHe: 'מושבים');
  const m1 = LipRow(nameHe: 'מושב דיור', categoryHe: 'מושבים');
  const m2 = LipRow(nameHe: 'מושב קיסר משופר', categoryHe: 'מושבים');
  _eqNames(_fa(m0, AttrKind.model, const [m0, m1, m2]),
      ['מושב קיסר', 'מושב דיור'], '2 model'); n++;

  // ד3 — יצרן: אותו spec, יצרן שונה; יצרן-כפול מדולג.
  const pm = LipRow(
      nameHe: 'מצמד PPR 20', brand: 'פולירול', categoryHe: 'מצמדים',
      dims: {'יצרן': 'הליארומה', 'dn נומינלי': '20', 'PN': '20'});
  const mk1 = LipRow(
      nameHe: 'מצמד PPRCT 20', brand: 'פולירול', categoryHe: 'מצמדים',
      dims: {'יצרן': 'אקוותרם', 'dn נומינלי': '20', 'PN': '20'});
  const mk2 = LipRow(
      nameHe: 'מצמד PPR 20', brand: 'פולירול', categoryHe: 'מצמדים',
      dims: {'יצרן': 'הליארומה', 'dn נומינלי': '20', 'PN': '20'});
  _eqNames(_fa(pm, AttrKind.maker, const [pm, mk1, mk2]),
      ['מצמד PPR 20', 'מצמד PPRCT 20'], '3 maker'); n++;

  // ד4 — PPR/מידה: אחי-מידה באותו סוג+קטגוריה; sameLineOnly מסנן קטגוריה-אחרת.
  const pp = LipRow(nameHe: 'מצמד 20', brand: 'פולירול', categoryHe: 'מצמדים');
  const pp1 = LipRow(nameHe: 'מצמד 25', brand: 'פולירול', categoryHe: 'מצמדים');
  const pp2 = LipRow(nameHe: 'מצמד 20', brand: 'פולירול', categoryHe: 'מצמדים');
  const pp3 = LipRow(nameHe: 'מצמד 32', brand: 'פולירול', categoryHe: 'אחר');
  _eqNames(_fa(pp, AttrKind.size, const [pp, pp1, pp2, pp3]),
      ['מצמד 20', 'מצמד 25'], '4 ppr-size'); n++;

  // ד5 — מסגרת קצרה (frame ריק לאחר הפשטת-הצבע) ⇒ [p].
  const solo = LipRow(nameHe: 'לבן', categoryHe: 'ניקוז');
  _eqNames(_fa(solo, AttrKind.color, const [solo, q1]),
      ['לבן'], '5 short-frame'); n++;

  // — הדאטה מוחלפת ⇒ הפלט משתנה: colors בלי 'אדום' ⇒ q2 יוצא מהאחים. —
  _eqNames(_fa(p, AttrKind.color, const [p, q1, q2, q4, q5], colors: const ['לבן', 'שחור']),
      ['מחסום עגול לבן', 'מחסום עגול שחור'], 'swap colors'); n++;

  // assert חי (חוק: --enable-asserts).
  assert(_fa(solo, AttrKind.color, const [solo]).length == 1, 'assert-live guard');

  print('OK findAttrSiblings: $n asserts passed (מנוע-נקי · מילון מוזרק)');
}
