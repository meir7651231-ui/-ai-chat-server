// בדיקת-חוזה (רתמת-זהב) · cities — מייבאת אך ורק את האטום-שלה (חוק-4).
// דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/cities.test.mjs:
//   1) 10 מפתחות · כולל 'default'
//   2) jerusalem = { he:'ירושלים', lat:31.778, lon:35.235, candle:40 }
//   3) telaviv.candle===18 · tzfat.lat===32.965 · haifa.candle===30
//   4) default === נ״צ-ירושלים (lat/lon/candle) · default.he ='ברירת-מחדל (ירושלים)'
//   5) לכל עיר: he מחרוזת-לא-ריקה · lat/lon/candle סופיים (Number.isFinite ⇒ num.isFinite)
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/cities_test.dart  ⇒ exit 0
import 'cities.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

void main() {
  var n = 0;
  final c = cities();
  final keys = c.keys.toList();

  // 1) מספר-מפתחות + נוכחות 'default'
  _ok(keys.length == 10, 'מספר-מפתחות ${keys.length} ≠ 10'); n++;
  _ok(keys.contains('default'), "חסר מפתח 'default'"); n++;

  // 2) jerusalem תואם-חוזה במלואו
  final j = c['jerusalem']!;
  _ok(j['he'] == 'ירושלים' && j['lat'] == 31.778 && j['lon'] == 35.235 && j['candle'] == 40,
      'jerusalem לא תואם-חוזה'); n++;

  // 3) ערכים-נקודתיים
  _ok(c['telaviv']!['candle'] == 18, 'telaviv.candle ≠ 18'); n++;
  _ok(c['tzfat']!['lat'] == 32.965, 'tzfat.lat ≠ 32.965'); n++;
  _ok(c['haifa']!['candle'] == 30, 'haifa.candle ≠ 30'); n++;

  // 4) default === נ״צ-ירושלים
  final d = c['default']!;
  _ok(d['lat'] == j['lat'] && d['lon'] == j['lon'] && d['candle'] == j['candle'],
      'default ≠ נ״צ-ירושלים'); n++;
  _ok(d['he'] == 'ברירת-מחדל (ירושלים)', 'default.he לא תואם-חוזה'); n++;

  // 5) אינווריאנט-טיפוס לכל עיר (Number.isFinite ⇒ num.isFinite)
  c.forEach((k, v) {
    final he = v['he'];
    _ok(he is String && he.isNotEmpty, '$k.he לא מחרוזת-תקינה'); n++;
    final lat = v['lat'], lon = v['lon'], candle = v['candle'];
    _ok(lat is num && lat.isFinite && lon is num && lon.isFinite && candle is num && candle.isFinite,
        '$k: lat/lon/candle לא סופיים'); n++;
  });

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(cities()['jerusalem']!['candle'] == 40, 'assert-live guard');

  print('OK cities: ${keys.length} ערים — $n asserts passed');
}
