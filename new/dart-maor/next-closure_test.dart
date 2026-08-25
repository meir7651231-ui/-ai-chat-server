// בדיקת-חוזה (רתמת-זהב) · next-closure — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/next-closure.test.mjs
// (אותם קלטים→פלטים; הערכים הומרו ל-Dart). אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/next-closure_test.dart  ⇒ exit 0
// אפס import של dart:convert — ה-JSON נבנה ידנית מסדר-ההכנסה (מדמה JSON.stringify).
import 'next-closure.dart';

// — סריאליזציה זהה ל-JSON.stringify עבור הדאטה הזה: null/String/bool/num/List/Map,
//   סדר-הכנסה נשמר, תווי-עברית כלשונם. —
String _stringify(dynamic v) {
  if (v == null) return 'null';
  if (v is String) {
    final esc = v.replaceAll('\\', '\\\\').replaceAll('"', '\\"');
    return '"$esc"';
  }
  if (v is bool) return v ? 'true' : 'false';
  if (v is num) return v.toString();
  if (v is List) return '[${v.map(_stringify).join(',')}]';
  if (v is Map) {
    final parts = <String>[];
    v.forEach((k, val) => parts.add('${_stringify(k as String)}:${_stringify(val)}'));
    return '{${parts.join(',')}}';
  }
  throw StateError('unsupported type: ${v.runtimeType}');
}

void main() {
  // שקעי-דמה מקומיים לבדיקה (כמו במקור-ה-JS).
  final CITIES = <String, dynamic>{
    'jerusalem': {'he': 'ירושלים', 'lat': 31.778, 'lon': 35.235, 'candle': 40},
    'telaviv': {'he': 'תל אביב', 'lat': 32.083, 'lon': 34.8, 'candle': 18},
  };
  final WIN = <String, dynamic>{
    'reason': 'שבת', 'kind': 'shabbat', 'startIso': '2026-08-28',
    'startTime': '18:42', 'endIso': '2026-08-29', 'endTime': '19:53', 'days': 1,
  };

  // 1. בלי telephony ⇒ null והשקע לא נקרא
  {
    var called = 0;
    final r = nextClosure(<String, dynamic>{}, '2026-08-24',
        (a, b, c, d) { called++; return [WIN]; }, CITIES);
    assert(r == null, '1: לא null — ${_stringify(r)}');
    assert(called == 0, '1: השקע נקרא למרות שאין telephony ($called)');
  }

  // 2+6. עיר מוכרת + מיפוי-שדות + אימות ארגומנטים-לשקע
  {
    List<dynamic>? gotArgs;
    final r = nextClosure({'telephony': {'city': 'telaviv'}}, '2026-08-24',
        (a, b, c, d) { gotArgs = [a, b, c, d]; return [WIN]; }, CITIES);
    assert(
        _stringify(r) ==
            '{"reason":"שבת","kind":"shabbat","startIso":"2026-08-28","candle":"18:42","endIso":"2026-08-29","tzeis":"19:53","cityHe":"תל אביב"}',
        '2: פלט לא תואם — ${_stringify(r)}');
    assert(
        _stringify(gotArgs) ==
            '["2026-08-24",10,{"city":"telaviv","timezone":"Asia/Jerusalem"},{}]',
        '6: ארגומנטי-השקע לא תואמים — ${_stringify(gotArgs)}');
  }

  // 3. אין חלונות ⇒ null
  {
    final r = nextClosure({'telephony': {'city': 'telaviv'}}, '2026-08-24',
        (a, b, c, d) => <dynamic>[], CITIES);
    assert(r == null, '3: לא null — ${_stringify(r)}');
  }

  // 4. בלי city ⇒ tenant.city='default' + נפילת-ירושלים
  {
    List<dynamic>? gotArgs4;
    final r4 = nextClosure({'telephony': <String, dynamic>{}}, '2026-08-24',
        (a, b, c, d) { gotArgs4 = [a, b, c, d]; return [WIN]; }, CITIES);
    assert(
        _stringify(gotArgs4![2]) == '{"city":"default","timezone":"Asia/Jerusalem"}',
        '4: tenant ברירת-מחדל לא תואם — ${_stringify(gotArgs4![2])}');
    assert(r4!['cityHe'] == 'ירושלים', '4: cityHe ≠ ירושלים — ${r4!['cityHe']}');
  }

  // 5. עיר לא-מוכרת ⇒ tenant שומר אותה, cityHe נופל לירושלים
  {
    List<dynamic>? gotArgs5;
    final r5 = nextClosure({'telephony': {'city': 'nowhere'}}, '2026-08-24',
        (a, b, c, d) { gotArgs5 = [a, b, c, d]; return [WIN]; }, CITIES);
    assert((gotArgs5![2] as Map)['city'] == 'nowhere',
        '5: tenant.city ≠ nowhere — ${(gotArgs5![2] as Map)['city']}');
    assert(r5!['cityHe'] == 'ירושלים', '5: cityHe ≠ ירושלים — ${r5!['cityHe']}');
  }

  print('✓ next-closure: 6 דוגמאות-חוזה — ירוק (Dart≡JS · 2 שקעים מוזרקים, אפס import פנימי)');
}
