// בדיקת-חוזה · installAddItem — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/install_add_item_test.dart
import 'install_add_item.dart';

// פריט-בדיקה: sku + תג-זהות (להוכחת dedup לפי-sku, לא לפי-אובייקט).
class _P {
  final String sku;
  final String tag;
  const _P(this.sku, this.tag);
}

String _skuOf(_P p) => p.sku;

// עוזרי-השוואה טהורים (בלי import).
void _t(bool ok, String label) {
  if (!ok) throw StateError('FAIL [$label]');
}

bool _listEq(List<String> a, List<String> b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

bool _qtyEq(Map<String, int> got, Map<String, int> want) {
  if (got.length != want.length) return false;
  for (final e in want.entries) {
    if (got[e.key] != e.value) return false;
  }
  return true;
}

bool _zonesEq(Map<String, List<String>> got, Map<String, List<String>> want) {
  if (got.length != want.length) return false;
  for (final e in want.entries) {
    final g = got[e.key];
    if (g == null || !_listEq(g, e.value)) return false;
  }
  return true;
}

void main() {
  var n = 0;
  final a = const _P('A', 'x');
  final b = const _P('B', 'x');

  // #1 — הוספה טרייה, בלי אזור.
  {
    final items = <_P>[];
    final qty = <String, int>{};
    final zones = <String, List<String>>{};
    installAddItem(a, skuOf: _skuOf, items: items, qty: qty, zones: zones);
    _t(items.length == 1 && identical(items[0], a), '1 items');
    _t(_qtyEq(qty, {'A': 1}), '1 qty');
    _t(_zonesEq(zones, {}), '1 zones');
    n++;
  }

  // #2 — אותו sku פעמיים, בלי אזור ⇒ items אחד, qty=2.
  {
    final items = <_P>[];
    final qty = <String, int>{};
    final zones = <String, List<String>>{};
    installAddItem(a, skuOf: _skuOf, items: items, qty: qty, zones: zones);
    installAddItem(a, skuOf: _skuOf, items: items, qty: qty, zones: zones);
    _t(items.length == 1, '2 items len');
    _t(_qtyEq(qty, {'A': 2}), '2 qty');
    _t(_zonesEq(zones, {}), '2 zones');
    n++;
  }

  // #3 — עם אזור.
  {
    final items = <_P>[];
    final qty = <String, int>{};
    final zones = <String, List<String>>{};
    installAddItem(a, zone: 'גזע', skuOf: _skuOf, items: items, qty: qty, zones: zones);
    _t(items.length == 1, '3 items');
    _t(_qtyEq(qty, {'A': 1}), '3 qty');
    _t(_zonesEq(zones, {'גזע': ['A']}), '3 zones');
    n++;
  }

  // #4 — אותו sku אותו אזור פעמיים ⇒ sku לא מוכפל ברשימת-האזור.
  {
    final items = <_P>[];
    final qty = <String, int>{};
    final zones = <String, List<String>>{};
    installAddItem(a, zone: 'גזע', skuOf: _skuOf, items: items, qty: qty, zones: zones);
    installAddItem(a, zone: 'גזע', skuOf: _skuOf, items: items, qty: qty, zones: zones);
    _t(items.length == 1, '4 items');
    _t(_qtyEq(qty, {'A': 2}), '4 qty');
    _t(_zonesEq(zones, {'גזע': ['A']}), '4 zones');
    n++;
  }

  // #5 — שני sku-ים באותו אזור ⇒ שניהם ברשימת-האזור, בסדר-הוספה.
  {
    final items = <_P>[];
    final qty = <String, int>{};
    final zones = <String, List<String>>{};
    installAddItem(a, zone: 'ז', skuOf: _skuOf, items: items, qty: qty, zones: zones);
    installAddItem(b, zone: 'ז', skuOf: _skuOf, items: items, qty: qty, zones: zones);
    _t(items.length == 2, '5 items');
    _t(_qtyEq(qty, {'A': 1, 'B': 1}), '5 qty');
    _t(_zonesEq(zones, {'ז': ['A', 'B']}), '5 zones');
    n++;
  }

  // #6 — אובייקט שונה אותו sku ⇒ הפריט לא נוסף שוב; ה-**ראשון** נשמר (עדשה-עוינת).
  {
    final items = <_P>[];
    final qty = <String, int>{};
    final zones = <String, List<String>>{};
    final first = const _P('A', 'x');
    final second = const _P('A', 'y');
    installAddItem(first, skuOf: _skuOf, items: items, qty: qty, zones: zones);
    installAddItem(second, skuOf: _skuOf, items: items, qty: qty, zones: zones);
    _t(items.length == 1 && items[0].tag == 'x', '6 first-kept');
    _t(_qtyEq(qty, {'A': 2}), '6 qty');
    n++;
  }

  // #7 — מחרוזת-ריק היא אזור-תקף (zone != null).
  {
    final items = <_P>[];
    final qty = <String, int>{};
    final zones = <String, List<String>>{};
    installAddItem(a, zone: '', skuOf: _skuOf, items: items, qty: qty, zones: zones);
    _t(_zonesEq(zones, {'': ['A']}), '7 empty-zone');
    n++;
  }

  // #8 — zone=null אינו נוגע ב-zones, גם כשהם מאוכלסים מראש.
  {
    final items = <_P>[];
    final qty = <String, int>{};
    final zones = <String, List<String>>{'ז': ['Z']};
    installAddItem(a, skuOf: _skuOf, items: items, qty: qty, zones: zones);
    _t(_zonesEq(zones, {'ז': ['Z']}), '8 zones-untouched');
    _t(items.length == 1 && _qtyEq(qty, {'A': 1}), '8 items+qty');
    n++;
  }

  // #9 — אותו sku בשני אזורים ⇒ מופיע בשתי הרשימות; items אחד, qty=2.
  {
    final items = <_P>[];
    final qty = <String, int>{};
    final zones = <String, List<String>>{};
    installAddItem(a, zone: 'ז1', skuOf: _skuOf, items: items, qty: qty, zones: zones);
    installAddItem(a, zone: 'ז2', skuOf: _skuOf, items: items, qty: qty, zones: zones);
    _t(items.length == 1, '9 items');
    _t(_qtyEq(qty, {'A': 2}), '9 qty');
    _t(_zonesEq(zones, {'ז1': ['A'], 'ז2': ['A']}), '9 cross-zone');
    n++;
  }

  // #10 — qty מוזרע {A:0}: containsKey=true ⇒ הפריט לא נוסף ל-items (עדשה-עוינת).
  {
    final items = <_P>[];
    final qty = <String, int>{'A': 0};
    final zones = <String, List<String>>{};
    installAddItem(a, skuOf: _skuOf, items: items, qty: qty, zones: zones);
    _t(items.isEmpty, '10 items-stay-empty');
    _t(_qtyEq(qty, {'A': 1}), '10 qty');
    n++;
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  {
    final items = <_P>[];
    final qty = <String, int>{};
    final zones = <String, List<String>>{};
    installAddItem(a, skuOf: _skuOf, items: items, qty: qty, zones: zones);
    assert(items.length == 1 && qty['A'] == 1, 'assert-live guard');
  }

  print('OK installAddItem: $n asserts passed');
}
