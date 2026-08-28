// בדיקת-חוזה · insertAt — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/insert_at_test.dart
import 'insert_at.dart';

void _eq(Object? got, Object? want, String label) {
  if ('$got' != '$want') {
    throw StateError('FAIL [$label]: got=$got want=$want');
  }
}

/// רתמה זעירה: קטלוג-מוזרק ומצב-טרי לכל מקרה (המנוע לא מכיר קטלוג — חוק-1).
class _Rig {
  _Rig(List<String> chain, {Set<String>? skus, Map<String, int>? qty})
      : items = List.of(chain),
        skus = skus ?? {},
        qty = qty ?? {};
  final List<String> items;
  final Set<String> skus;
  final Map<String, int> qty;
  // הפותר-המוזרק: מק"ט ⇒ אובייקט-מוצר (כאן: המק"ט באותיות-קטנות), Z ⇒ null.
  String? skuOf(String sku) => sku == 'Z' ? null : sku.toLowerCase();

  void call(int pos, Set<String> alts, String pref) => insertAt<String>(
      pos, alts, pref,
      items: items, skus: skus, qty: qty, skuOf: skuOf);
}

void main() {
  var n = 0;

  // 1 · הכנסה באמצע: אינדקס 1, qty=1, skus מתעדכן (חוזה §5).
  final r1 = _Rig(['A', 'B', 'C']);
  r1(1, {'X'}, 'X');
  _eq(r1.items, ['A', 'x', 'B', 'C'], '1 insert@1');
  _eq(r1.qty, {'X': 1}, '1 qty');
  _eq(r1.skus.contains('X'), true, '1 skus');
  n++;

  // 2 · clamp-מטה: position 0 ⇒ אינדקס 1 — לעולם לא בראש-השרשרת (חוזה §4).
  final r2 = _Rig(['A', 'B', 'C']);
  r2(0, {'X'}, 'X');
  _eq(r2.items, ['A', 'x', 'B', 'C'], '2 clamp-low 0⇒1');
  n++;

  // 3 · clamp-מעלה: position 99 ⇒ len-1=2 — לפני האחרון (חוזה §4, דוגמה 3).
  final r3 = _Rig(['A', 'B', 'C']);
  r3(99, {'X'}, 'X');
  _eq(r3.items, ['A', 'B', 'x', 'C'], '3 clamp-high 99⇒2');
  n++;

  // 4 · clamp-מטה משלילי: -5 ⇒ 1 (חוזה §4, דוגמה 4).
  final r4 = _Rig(['A', 'B', 'C']);
  r4(-5, {'X'}, 'X');
  _eq(r4.items, ['A', 'x', 'B', 'C'], '4 clamp-negative');
  n++;

  // 5 · גארד len<2 (חוזה §1): שרשרת-יחיד וריקה — אפס-שינוי ואפס-קריסה
  //     (בלי הגארד: clamp(1,0)/clamp(1,-1) זורק ArgumentError — הערת-המקור).
  final r5a = _Rig(['A']);
  r5a(1, {'X'}, 'X');
  _eq(r5a.items, ['A'], '5a single item untouched');
  _eq(r5a.qty, <String, int>{}, '5a qty untouched');
  final r5b = _Rig([]);
  r5b(1, {'X'}, 'X');
  _eq(r5b.items, <String>[], '5b empty untouched');
  n++;

  // 6 · חלופה-כבר-קיימת ⇒ דילוג מלא (חוזה §2, דוגמה 6).
  final r6 = _Rig(['A', 'B', 'C'], skus: {'B1'});
  r6(1, {'B1', 'B2'}, 'B2');
  _eq(r6.items, ['A', 'B', 'C'], '6 alternative present ⇒ skip');
  _eq(r6.qty, <String, int>{}, '6 qty untouched');
  n++;

  // 7 · הפותר מחזיר null ⇒ דילוג (חוזה §3, דוגמה 7).
  final r7 = _Rig(['A', 'B', 'C']);
  r7(1, {'Z'}, 'Z');
  _eq(r7.items, ['A', 'B', 'C'], '7 resolver null ⇒ skip');
  _eq(r7.skus.contains('Z'), false, '7 skus untouched');
  n++;

  // 8 · קצה-נאמנות verbatim: preferred כבר ב-skus אך לא ב-alternatives ⇒
  //     מוכנס-שוב ו-qty נדרס ל-1 (חוזה, דוגמה 8 — הבדיקה על alternatives בלבד).
  final r8 = _Rig(['A', 'x', 'B'], skus: {'X'}, qty: {'X': 3});
  r8(2, {'Y'}, 'X');
  _eq(r8.items, ['A', 'x', 'x', 'B'], '8 verbatim re-insert');
  _eq(r8.qty, {'X': 1}, '8 qty overwritten to 1');
  n++;

  // 9 · מנגנון-שקע: פותר שונה ⇒ אובייקט שונה נכנס (מוכיח שהקטלוג מוזרק, לא צרוב).
  final items9 = ['A', 'B'];
  insertAt<String>(1, {'X'}, 'X',
      items: items9, skus: {}, qty: {}, skuOf: (s) => '<$s>');
  _eq(items9, ['A', '<X>', 'B'], '9 injected resolver drives output');
  n++;

  assert(n == 9, 'assert-live guard');
  print('OK insertAt: $n asserts passed (שקעי items/skus/qty/skuOf מוזרקים · גארד len<2)');
}
