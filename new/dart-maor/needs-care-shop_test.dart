import '../dart-data-maor/needs-care-shop-sockets.dart' as sk_needs_care_shop;
// בדיקת-חוזה (רתמת-זהב) · needsCare — מייבאת אך ורק את האטום-שלה (חוק-4).
// שבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/needs-care-shop.test.mjs:
//   שקעי-בדיקה דטרמיניסטיים (בסיס ניטרלי, כל דוגמה דורסת מה שהיא צריכה) —
//     upcomingHolidays=[] · itemRemaining=null · componentRemaining=null ·
//     beneficiaryLabel='משפ׳ לוי' · itemOf=comp.__item · holidayAllowed=true ·
//     assignmentRedeemed=false · couponExpiry='' · featureOn=true ·
//     expiringIntakes=[] · shopHolidayDueDays=30 · TODAY='2026-08-24'.
//   1) מלאי אזל (rem=0) ⇒ stockOut יחיד.
//   2) מלאי נמוך (minStock=5, rem=2) ⇒ restock 'להצטייד: נותרו 2 מתחת ל-5'.
//   3א) waits=2 + rem=null ⇒ waitingRestocked '2 ממתינים לסוכר'; 3ב) rem=0 ⇒ בלי waitingRestocked.
//   4א) קופון פג ('2026-01-01'<TODAY) ⇒ couponExpired; 4ב) בלי-תוקף ⇒ couponPending.
//   5א) פגישה ⇒ meetingPending; 5ב) שיוך לא-active ⇒ אפס.
//   6) מתנת-חג ⇒ holidayDue ראשון, לפני stockOut.
//   7א) featureOn=false ⇒ אפס expiring; 7ב) config=null ⇒ expiring נפלט.
// אם עובר ⇒ Dart≡JS. הרצה: dart run --enable-asserts new/dart-maor/needs-care-shop_test.dart ⇒ exit 0
import 'needs-care-shop.dart';

const TODAY = '2026-08-24';

// שקעי-הבסיס — מקבילים ביט-אחר-ביט למקור-ה-JS (חתימות מלאות; מתעלמים מהארגומנטים).
List<dynamic> _holNone(String t, int d) => [];
int? _remNull(Map<String, dynamic> db, dynamic id) => null;
int? _compNull(dynamic c, dynamic p, dynamic a, dynamic s) => null;
String _who(Map<String, dynamic> db, dynamic a, dynamic cfg) => 'משפ׳ לוי';
dynamic _itemOf(Map<String, dynamic> db, dynamic comp) => comp['__item'];
bool _holAllow(dynamic ri, dynamic name) => true;
bool _redNo(dynamic a, dynamic cid, [dynamic h]) => false;
String _expEmpty(dynamic a, dynamic ri) => '';
bool _featOn(dynamic cfg, String key) => true;
List<dynamic> _expNone(Map<String, dynamic> db, String t) => [];

// עוזר: needsCare עם עקיפות פר-דוגמה (מה שלא נמסר = ברירת-הבסיס).
List<Map<String, dynamic>> run(
  Map<String, dynamic> db,
  dynamic config, {
  List<dynamic> Function(String, int)? upcomingHolidays,
  int? Function(Map<String, dynamic>, dynamic)? itemRemaining,
  String Function(dynamic, dynamic)? couponExpiry,
  bool Function(dynamic, String)? featureOn,
  List<dynamic> Function(Map<String, dynamic>, String)? expiringIntakes,
}) {
  return needsCare(db, TODAY, config, upcomingHolidays ?? _holNone, itemRemaining ?? _remNull, _compNull, _who, _itemOf, _holAllow, _redNo, couponExpiry ?? _expEmpty, featureOn ?? _featOn, expiringIntakes ?? _expNone, 30, sk_needs_care_shop.needsCareShop_T);
}

int _f = 0;
void ok(bool cond, String msg) {
  if (!cond) {
    _f = 1;
    print('✗ $msg');
  }
}

Map<String, dynamic> emptyDb() =>
    {'shopItems': [], 'shopProducts': [], 'shopAssignments': []};

// שיוך פעיל עם רכיב יחיד (מקביל ל-assignDb של ה-JS).
Map<String, dynamic> assignDb(Map<String, dynamic> item) => {
      'shopItems': [],
      'shopProducts': [
        {
          'id': 'p1',
          'name': 'חבילה',
          'active': true,
          'components': [
            {'id': 'c1', 'itemId': 'i1', '__item': item},
          ],
        },
      ],
      'shopAssignments': [
        {'id': 'a1', 'productId': 'p1', 'status': 'active'},
      ],
    };

void main() {
  // 1) מלאי אזל — פריט פעיל, rem=0
  {
    final db = emptyDb()
      ..['shopItems'] = [
        {'id': 'i1', 'name': 'סוכר', 'active': true}
      ];
    final out = run(db, null, itemRemaining: (d, i) => 0);
    ok(
        out.length == 1 &&
            out[0]['kind'] == 'stockOut' &&
            out[0]['componentId'] == 'i1' &&
            out[0]['label'] == 'סוכר — המלאי אזל' &&
            out[0]['hint'] == 'לחדש מלאי או לעדכן את הפריט',
        'דוגמה 1 (stockOut): $out');
  }

  // 2) מלאי נמוך — minStock=5, rem=2
  {
    final db = emptyDb()
      ..['shopItems'] = [
        {'id': 'i1', 'name': 'סוכר', 'active': true, 'minStock': 5}
      ];
    final out = run(db, null, itemRemaining: (d, i) => 2);
    ok(
        out.length == 1 &&
            out[0]['kind'] == 'restock' &&
            out[0]['label'] == 'סוכר — המלאי נמוך' &&
            out[0]['hint'] == 'להצטייד: נותרו 2 מתחת ל-5',
        'דוגמה 2 (restock): $out');
  }

  // 3) רשימת-המתנה — waits=2, rem=null; ובמלאי 0 ⇒ בלי waitingRestocked
  {
    final db = emptyDb()
      ..['shopItems'] = [
        {'id': 'i1', 'name': 'סוכר', 'active': true, 'waits': ['f1', 'f2']}
      ];
    final out = run(db, null); // rem=null
    ok(
        out.length == 1 &&
            out[0]['kind'] == 'waitingRestocked' &&
            out[0]['label'] == '2 ממתינים לסוכר',
        'דוגמה 3א (waitingRestocked): $out');
    final outZero = run(db, null, itemRemaining: (d, i) => 0);
    ok(!outZero.any((x) => x['kind'] == 'waitingRestocked'),
        'דוגמה 3ב: במלאי 0 נפלטה התרעת-המתנה');
  }

  // 4) קופון פג-תוקף / קופון-ממתין
  {
    final db = assignDb({'kind': 'coupon', 'name': 'קופון מזון'});
    final out = run(db, null, couponExpiry: (a, ri) => '2026-01-01');
    ok(
        out.length == 1 &&
            out[0]['kind'] == 'couponExpired' &&
            out[0]['assignmentId'] == 'a1' &&
            out[0]['hint'] == 'הקופון פג בתוקף ב-2026-01-01 וטרם מומש',
        'דוגמה 4א (couponExpired): $out');
    final out2 = run(db, null); // בלי תוקף
    ok(
        out2.length == 1 &&
            out2[0]['kind'] == 'couponPending' &&
            out2[0]['hint'] == 'קופון טרם מומש',
        'דוגמה 4ב (couponPending): $out2');
  }

  // 5) פגישה ממתינה; שיוך לא-פעיל ⇒ כלום
  {
    final db = assignDb({'kind': 'meeting', 'name': 'פגישה'});
    final out = run(db, null);
    ok(
        out.length == 1 &&
            out[0]['kind'] == 'meetingPending' &&
            out[0]['label'] == 'משפ׳ לוי — פגישה' &&
            out[0]['hint'] == 'פגישת ליווי טרם התקיימה',
        'דוגמה 5א (meetingPending): $out');
    (db['shopAssignments'] as List)[0]['status'] = 'done';
    ok(run(db, null).isEmpty, 'דוגמה 5ב: שיוך לא-פעיל פלט התרעות');
  }

  // 6) מתנת-חג לפני-מסירה — וקדימות holidayDue על-פני מלאי
  {
    final db = assignDb({'kind': 'holidayGift', 'name': 'סל חג'});
    db['shopItems'] = [
      {'id': 'i9', 'name': 'שמן', 'active': true}
    ];
    final out = run(
      db,
      null,
      upcomingHolidays: (t, d) => [
        {'name': 'ראש השנה', 'iso': '2026-09-12'}
      ],
      itemRemaining: (d, i) => 0, // ייצור גם stockOut — שחייב לבוא אחרי ה-holidayDue
    );
    ok(
        out.length == 2 &&
            out[0]['kind'] == 'holidayDue' &&
            out[0]['hint'] == 'ראש השנה ב-2026-09-12 — טרם נמסרה' &&
            out[1]['kind'] == 'stockOut',
        'דוגמה 6 (holidayDue ראשון): $out');
  }

  // 7) גידור-תפוגה: featureOn=false ⇒ אפס expiring; בלי config ⇒ נפלט
  {
    List<dynamic> expiring(Map<String, dynamic> db, String t) => [
          {
            'intake': {'itemId': 'i1', 'expiry': '2026-08-20', 'qty': 4},
            'itemName': 'חלב',
            'expired': true,
          }
        ];
    final off = run(emptyDb(), {'flags': {}},
        featureOn: (c, k) => false, expiringIntakes: expiring);
    ok(off.isEmpty, 'דוגמה 7א: דגל כבוי ועדיין נפלטה התרעת-תפוגה');
    final on = run(emptyDb(), null, expiringIntakes: expiring);
    ok(
        on.length == 1 &&
            on[0]['kind'] == 'expiring' &&
            on[0]['label'] == 'חלב — פג תוקף' &&
            on[0]['hint'] == 'פג ב-2026-08-20 · אצווה 4 יח׳',
        'דוגמה 7ב (expiring): $on');
  }

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
      run(emptyDb(), null).isEmpty, 'assert-live guard: db ריק ⇒ אפס התרעות');

  if (_f != 0) {
    throw StateError('needs-care-shop: דוגמת-חוזה נכשלה');
  }
  print('OK needsCare: 7 דוגמאות-חוזה (9 בדיקות) — ירוק · Dart≡JS');
}
