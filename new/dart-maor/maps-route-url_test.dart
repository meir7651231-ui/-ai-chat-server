// רתמת-זהב · maps-route-url — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
import 'maps-route-url.dart';

void main() {
  final cases = <List<Object?>>[
    [<String>[], null],
    [<String>['', '  '], null],
    [
      <String>['הרצל 10, חיפה'],
      'https://www.google.com/maps/search/?api=1&query=%D7%94%D7%A8%D7%A6%D7%9C%2010%2C%20%D7%97%D7%99%D7%A4%D7%94'
    ],
    [
      <String>['A 1', 'B 2', 'C 3'],
      'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=C%203&waypoints=A%201%7CB%202'
    ],
    [
      <String>['a|b', 'יעד'],
      'https://www.google.com/maps/dir/?api=1&travelmode=driving&destination=%D7%99%D7%A2%D7%93&waypoints=a%20b'
    ],
  ];
  for (final c in cases) {
    final stops = c[0] as List<String>;
    final want = c[1] as String?;
    final got = mapsRouteUrl(stops);
    assert(got == want, '✗ mapsRouteUrl($stops) = $got ≠ $want');
  }
  print('✓ maps-route-url (Dart): 5 דוגמאות-חוזה — ירוק');
}
