// בדיקת-חוזה (רתמת-זהב) · itemOf — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/item-of.test.mjs
// (אותם קלטים→פלטים). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/item-of_test.dart ⇒ exit 0
import 'item-of.dart';

int _f = 0;

void _ok(bool cond, String msg) {
  if (!cond) {
    _f = 1;
    print('✗ $msg');
  }
}

// השוואת-ערך תואמת JSON.stringify של ה-JS (סדר-מפתחות קובע; undefined מושמט ⇒
// המפה כלל לא מכילה את המפתח, לכן אין ערכי-null להדפיס).
void _eq(Object? a, Object? b, String msg) {
  _ok(_js(a) == _js(b), '$msg\n  קיבלנו: ${_js(a)}\n  ציפינו: ${_js(b)}');
}

String _js(Object? v) {
  if (v == null) return 'null';
  if (v is bool) return v ? 'true' : 'false';
  if (v is num) return v.toString();
  if (v is String) return '"$v"';
  if (v is List) return '[${v.map(_js).join(',')}]';
  if (v is Map) {
    final parts = <String>[];
    v.forEach((k, val) => parts.add('"$k":${_js(val)}'));
    return '{${parts.join(',')}}';
  }
  return 'null';
}

void main() {
  final Map<String, dynamic> i1 = {
    'id': 'i1',
    'name': 'קופון מזון',
    'kind': 'coupon',
    'storeId': 's1',
    'value': 100,
    'basePrice': 20,
    'stock': 5,
    'validDays': 30,
    'holidays': ['פסח'],
    'active': false,
  };
  final Map<String, dynamic> db = {
    'shopItems': [i1]
  };

  // 1) רכיב מצביע בלי דריסות — הפריט גובר על שדות-התאימות
  _eq(
    itemOf(db, {'itemId': 'i1', 'label': 'ישן', 'kind': 'x', 'storeId': 'sX'}),
    {
      'itemId': 'i1',
      'name': 'קופון מזון',
      'kind': 'coupon',
      'storeId': 's1',
      'value': 100,
      'basePrice': 20,
      'stock': 5,
      'validDays': 30,
      'holidays': ['פסח'],
      'active': false,
    },
    '1: פענוח בלי דריסות שגוי',
  );

  // 2) דריסות value/basePrice — גם 0 דורס (?? ולא ||)
  final r2 = itemOf(db, {
    'itemId': 'i1',
    'label': 'ישן',
    'kind': 'x',
    'storeId': 'sX',
    'value': 80,
    'basePrice': 0
  });
  _ok(r2['value'] == 80, '2: value=80 לא דרס');
  _ok(r2['basePrice'] == 0, '2: basePrice=0 לא דרס (?? ולא ||)');
  _ok(r2['name'] == 'קופון מזון' && r2['stock'] == 5 && r2['active'] == false,
      '2: שאר-השדות לא מהפריט');

  // 3) מצביע שבור — נפילת-תאימות לשדות-הרכיב, active:true, בלי holidays
  _eq(
    itemOf(db, {
      'itemId': 'iZZZ',
      'label': 'רכיב ישן',
      'kind': 'gift',
      'storeId': 's9',
      'value': 50,
      'basePrice': 10,
      'stock': 3,
      'validDays': 7
    }),
    {
      'itemId': 'iZZZ',
      'name': 'רכיב ישן',
      'kind': 'gift',
      'storeId': 's9',
      'value': 50,
      'basePrice': 10,
      'stock': 3,
      'validDays': 7,
      'active': true,
    },
    '3: נפילת-תאימות שגויה',
  );
  _ok(
      !itemOf(db, {'itemId': 'iZZZ', 'label': 'x', 'kind': 'gift', 'storeId': ''})
          .containsKey('holidays'),
      '3: נפילה לא אמורה לשאת holidays');

  // 4) מצביע שבור בלי שדות-תאימות — ברירות ?? 0
  final r4 = itemOf(db, {'itemId': '', 'label': 'ריק', 'kind': 'meet', 'storeId': ''});
  _ok(r4['value'] == 0 && r4['basePrice'] == 0, '4: value/basePrice לא נפלו ל-0');
  _ok(!r4.containsKey('stock') && !r4.containsKey('validDays') && r4['active'] == true,
      '4: stock/validDays/active שגויים');

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(_f == 0, 'item-of contract examples must be green');

  if (_f != 0) {
    throw StateError('item-of: דוגמאות-חוזה נכשלו');
  }
  print('✓ item-of: 4 דוגמאות-חוזה — ירוק');
}
