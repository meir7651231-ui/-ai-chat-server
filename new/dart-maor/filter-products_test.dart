// בדיקת-חוזה (רתמת-זהב) · filterProducts — מייבאת אך ורק את האטום-שלה (חוק-4).
// חמש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/filter-products.test.mjs:
//   1) onlyActive=true  ⇒ הבסיס = הפעילות בלבד            ⇒ names == ['קופון']
//   2) onlyActive=false ⇒ הבסיס = הכול, בסדר-המקור         ⇒ names == ['קופון','מתנה']
//   3) העתק — לא אותה רפרנס (out !== products)             ⇒ !identical
//   4) getTerms(product) ⇒ [name, desc]                    ⇒ ['קופון','הנחה']
//   5) q עובר כלשונו                                       ⇒ 'הנח'
// smartFilter-מזויף (כמו במקור): מתעד קריאות, מחזיר את items כמות-שהם.
// השוואת-מערך = אורך + איבר-איבר (כלל-8, לא join). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/filter-products_test.dart  ⇒ exit 0
import 'filter-products.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

bool _listEq(List a, List b) {
  if (a.length != b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] != b[i]) return false;
  }
  return true;
}

void main() {
  var n = 0;

  // smartFilter-מזויף: מתעד קריאות, מחזיר items כמו-שהם.
  final calls = <Map<String, dynamic>>[];
  dynamic fakeSmart(Object? q, List items, List Function(dynamic) getTerms) {
    calls.add({'q': q, 'items': items, 'getTerms': getTerms});
    return items;
  }

  final products = [
    {'name': 'קופון', 'desc': 'הנחה', 'active': true},
    {'name': 'מתנה', 'desc': '', 'active': false},
  ];

  // 1) onlyActive=true ⇒ הבסיס = הפעילות בלבד.
  final r1 = (filterProducts(products, 'הנח', true, fakeSmart) as List)
      .map((p) => p['name'])
      .toList();
  _ok(_listEq(r1, ['קופון']), 'onlyActive לא סינן לא-פעילות ⇒ $r1');
  n++;

  // 2) onlyActive=false ⇒ הבסיס = הכול, בסדר-המקור.
  final r2 = (filterProducts(products, '', false, fakeSmart) as List)
      .map((p) => p['name'])
      .toList();
  _ok(_listEq(r2, ['קופון', 'מתנה']), 'onlyActive=false שינה את הבסיס ⇒ $r2');
  n++;

  // 3) העתק — לא אותה רפרנס.
  final out3 = filterProducts(products, '', false, fakeSmart) as List;
  _ok(!identical(out3, products), 'הוחזר הקלט עצמו ולא העתק');
  n++;

  // 4) getTerms ⇒ [name, desc].
  final getTerms0 = calls[0]['getTerms'] as List Function(dynamic);
  final terms = getTerms0({'name': 'קופון', 'desc': 'הנחה'});
  _ok(_listEq(terms, ['קופון', 'הנחה']), 'getTerms לא [name, desc] ⇒ $terms');
  n++;

  // 5) q עובר כלשונו.
  _ok(calls[0]['q'] == 'הנח', 'q לא הועבר כלשונו ⇒ ${calls[0]['q']}');
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_listEq(r1, ['קופון']), 'assert-live guard');

  print('OK filterProducts: $n asserts passed');
}
