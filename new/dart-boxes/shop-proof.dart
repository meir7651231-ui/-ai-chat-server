// 🧪 הוכחת-חוצה-שפות · shop (Dart) — מריצה את shop.dart על אותם קלטים/WANT כמו
// 10 דוגמאות-החוזה של new/boxes/shop.test.mjs. ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart) על אותה קופסה.
// 🛡 מגני-מקור-ה-JS (readFileSync על shop.mjs — כלל-הצהריים/הזרקה/עלי-שכן) מדולגים:
//    הם regex על מקור-ה-JS, לא חוזה-פלט חוצה-שפות (ראה חוקי-המשימה).
import 'dart:convert';
import 'shop.dart' as SHOP;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) {
    print('✗ $name: got $g want $w');
    fails++;
  } else {
    n++;
  }
}

void ok(String name, bool c) {
  if (!c) {
    print('✗ $name');
    fails++;
  } else {
    n++;
  }
}

void main() {
  // 1) liveRedemptions — מבוטל מוחרג
  eq('liveRedemptions',
      SHOP.liveRedemptions(<String, dynamic>{
        'redemptions': [
          {'value': 1, 'voidedAt': null},
          {'value': 2, 'voidedAt': '2026-01-01'}
        ]
      }).length,
      1);

  // 2) maxDiscountPct — הגבוה
  eq('maxDiscountPct',
      SHOP.maxDiscountPct(['c1', 'c2'], [
        <String, dynamic>{'id': 'c1', 'discountPct': 10},
        <String, dynamic>{'id': 'c2', 'discountPct': 25}
      ]),
      25);

  // 3) effectivePrice — 100 פחות 25% = 75
  eq('effectivePrice', SHOP.effectivePrice(100, ['c2'], [
    <String, dynamic>{'id': 'c2', 'discountPct': 25}
  ]), 75);

  // 4) subsidyTotal — 100-30=70; אחרי ביטול=0
  eq('subsidyTotal חי', SHOP.subsidyTotal([
    <String, dynamic>{
      'redemptions': [
        {'value': 100, 'paid': 30, 'voidedAt': null}
      ]
    }
  ]), 70);
  eq('subsidyTotal מבוטל', SHOP.subsidyTotal([
    <String, dynamic>{
      'redemptions': [
        {'value': 100, 'paid': 30, 'voidedAt': 'x'}
      ]
    }
  ]), 0);

  // 5) itemRemaining — 5 פחות מימוש-חי אחד = 4 (מבוטל אינו נספר)
  final dbStock = <String, dynamic>{
    'shopItems': [
      {'id': 'it', 'stock': 5}
    ],
    'shopProducts': [
      {
        'id': 'p',
        'components': [
          {'id': 'c', 'itemId': 'it'}
        ]
      }
    ],
    'shopAssignments': [
      {
        'id': 'a',
        'productId': 'p',
        'redemptions': [
          {'componentId': 'c', 'voidedAt': null},
          {'componentId': 'c', 'voidedAt': 'x'}
        ]
      }
    ],
  };
  eq('itemRemaining', SHOP.itemRemaining(dbStock, 'it'), 4);

  // 6) beneficiaryLabel — בלי/עם config (termOf מחווט)
  final dbFam = <String, dynamic>{
    'families': [
      {'id': 'f', 'name': 'לוי', 'members': []}
    ]
  };
  eq('beneficiaryLabel default', SHOP.beneficiaryLabel(dbFam, {'famId': 'f'}), 'משפחת לוי');
  eq('beneficiaryLabel term',
      SHOP.beneficiaryLabel(dbFam, {'famId': 'f'}, {
        'terms': {'entity.familyOf': 'בית'}
      }),
      'בית לוי');

  // 7) couponExpiry — since+validDays; בלי validDays ⇒ ''
  eq('couponExpiry', SHOP.couponExpiry({'since': '2026-08-01'}, {'validDays': 10}), '2026-08-11');
  eq('couponExpiry ריק', SHOP.couponExpiry({'since': '2026-08-01'}, {}), '');

  // 8) upcomingHolidays — holidayOf מוזרק (מחזיר 'X' ב-3 לחודש) ⇒ פריט יחיד (שם-כפול מנוכה)
  dynamic holidayOfX(DateTime d) => d.day == 3 ? 'X' : null;
  eq('upcomingHolidays', SHOP.upcomingHolidays('2026-08-01', 45, holidayOfX), [
    {'iso': '2026-08-03', 'name': 'X'}
  ]);

  // 9) filterProducts — smartFilter מוזרק (זהות) + onlyActive
  List identity(Object? q, List items, List Function(dynamic) getTerms) => List.from(items);
  eq('filterProducts onlyActive',
      SHOP.filterProducts([
        {'name': 'א', 'active': true},
        {'name': 'ב', 'active': false}
      ], '', true, identity).length,
      1);

  // 10) needsCare — קופון-שפקע ⇒ couponExpired; featureOn מוזרק מגדר 'expiring'
  final dbCare = <String, dynamic>{
    'shopItems': [
      {'id': 'it1', 'name': 'חלב', 'kind': 'coupon', 'active': true}
    ],
    'shopProducts': [
      {
        'id': 'p1',
        'name': 'סל',
        'active': true,
        'components': [
          {'id': 'cmp1', 'kind': 'coupon', 'label': 'קופון', 'validDays': 10}
        ]
      }
    ],
    'shopAssignments': [
      {'id': 'a1', 'productId': 'p1', 'famId': 'f1', 'status': 'active', 'since': '2026-01-01', 'redemptions': []}
    ],
    'families': [
      {'id': 'f1', 'name': 'כהן', 'members': []}
    ],
    'shopIntakes': [
      {'id': 'in1', 'itemId': 'it1', 'expiry': '2026-07-01', 'qty': 5, 'date': '2026-06-01', 'cost': 0}
    ],
    'rooms': [],
    'shopEvents': [],
  };
  dynamic holidayOfNull(DateTime d) => null;
  final careOff = SHOP.needsCare(dbCare, '2026-08-01', {'features': {}}, holidayOfNull, (c, k) => false);
  ok('needsCare קופון-שפקע', careOff.any((x) => (x as Map)['kind'] == 'couponExpired'));
  ok('needsCare featureOn=false גידר expiring', !careOff.any((x) => (x as Map)['kind'] == 'expiring'));
  final careOn = SHOP.needsCare(dbCare, '2026-08-01', {'features': {}}, holidayOfNull, (c, k) => true);
  ok('needsCare featureOn=true הפיק expiring', careOn.any((x) => (x as Map)['kind'] == 'expiring'));

  if (fails > 0) {
    print('❌ קופסת-shop (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('shop dart proof failed');
  }
  print('✓ קופסת-החנות (Dart): $n טענות — 10 דוגמאות-חוזה דרך הקופסה · פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
