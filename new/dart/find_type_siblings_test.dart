import '../dart-data/find_type_siblings-terms.dart' as td_find_type_siblings;
// בדיקת-חוזה · findTypeSiblings — מייבאת אך ורק את האטום-שלה (חוק-4).
// המנוע נבדק עם **מילון מוזרק זעיר** — מוכיח מנגנון, לא קטלוג.
// טענת "הדאטה מוחלפת ⇒ הפלט משתנה" מוכיחה שהמילון מוזרק, לא צרוב.
// הרצה: dart run --enable-asserts new/dart/find_type_siblings_test.dart
import 'find_type_siblings.dart';

// ─── מילון מוזרק זעיר ────────────────────────────────────────────────────────
const _models = <String>[];
const _types = ['מחסום', 'סיפון', 'מצמד', 'מתאם'];
const _subtypesFull = ['רצפה', 'עגול', 'כפול'];
const _colors = <String>[];
const _ppr = {'PPR', 'PPRCT'};
const _mods = {'מוברש', 'מט'};
const _brand = 'פולירול';

List<LipRow> _ft(LipRow p, List<LipRow> catalog,
        {List<String> subtypes = _subtypesFull}) =>
    findTypeSiblings(p,
        catalog: catalog,
        models: _models,
        types: _types,
        subtypes: subtypes,
        colors: _colors,
        pprMaterials: _ppr,
        colorModifiers: _mods,
        polyrollBrand: _brand, term: (k)=>td_find_type_siblings.kTerms[k]!);

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

  const a = LipRow(nameHe: 'מחסום רצפה', categoryHe: 'ניקוז');
  const b = LipRow(nameHe: 'סיפון כפול', categoryHe: 'ניקוז');
  const c = LipRow(nameHe: 'מחסום עגול', categoryHe: 'ניקוז');
  const d = LipRow(nameHe: 'ברז גן', categoryHe: 'ברזים');
  const e = LipRow(nameHe: 'זמבורי אדום', categoryHe: 'ניקוז');
  const p1 = LipRow(nameHe: 'מתאם רקורד 20', brand: 'פולירול', categoryHe: 'PPR');
  const p2 = LipRow(nameHe: 'מתאם מצרה 25', brand: 'פולירול', categoryHe: 'PPR');
  const p3 = LipRow(nameHe: 'מצמד 20', brand: 'פולירול', categoryHe: 'PPR');

  // דוגמה 1 — נציג לכל סוג באותה קטגוריה; C כפול-מדולג (מחסום), D קטגוריה-אחרת.
  _eqNames(_ft(a, const [a, b, c, d]),
      ['מחסום רצפה', 'סיפון כפול'], '1 distinct-types'); n++;

  // דוגמה 2 — סוג יחיד בקטגוריה ⇒ [p].
  _eqNames(_ft(a, const [a, c]), ['מחסום רצפה'], '2 single-type'); n++;

  // דוגמה 3 — compound ריק ⇒ [p].
  _eqNames(_ft(e, const [e, a]), ['זמבורי אדום'], '3 empty-compound'); n++;

  // דוגמה 4 — PPR מפתח לפי _leadingType ⇒ P2 מתקפל ל-'מתאם'.
  _eqNames(_ft(p1, const [p1, p2, p3]),
      ['מתאם רקורד 20', 'מצמד 20'], '4 ppr-leading-key'); n++;

  // — הדאטה מוחלפת ⇒ הפלט משתנה: subtypes בלי 'עגול' ⇒ 'מחסום עגול' סוג-נפרד ⇒ C נכנס. —
  _eqNames(_ft(a, const [a, b, c, d], subtypes: const ['רצפה', 'כפול']),
      ['מחסום רצפה', 'סיפון כפול', 'מחסום עגול'], 'swap subtypes'); n++;

  // assert חי (חוק: --enable-asserts).
  assert(_ft(a, const [a, c]).length == 1, 'assert-live guard');

  print('OK findTypeSiblings: $n asserts passed (מנוע-נקי · מילון מוזרק)');
}
