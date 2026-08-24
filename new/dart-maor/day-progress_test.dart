// רתמת-זהב · day-progress — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות: אותם קלטים→פלטים).
// אם עובר ⇒ Dart≡JS. שקע-deliveriesOfDay מקומי: סינון db.deliveries לפי dayId (התנהגות maor).
import 'day-progress.dart';

List _deliveriesOfDay(Map<String, dynamic> db, String dayId) =>
    (db['deliveries'] as List).where((d) => d['dayId'] == dayId).toList();

bool _eq(Map<String, int> got, Map<String, int> want) =>
    got['total'] == want['total'] &&
    got['pickup'] == want['pickup'] &&
    got['enroute'] == want['enroute'] &&
    got['delivered'] == want['delivered'];

void main() {
  final db = <String, dynamic>{
    'deliveries': [
      {'dayId': 'd1', 'status': 'pickup'},
      {'dayId': 'd1', 'status': 'enroute'},
      {'dayId': 'd1', 'status': 'delivered'},
      {'dayId': 'd1', 'status': 'delivered'},
      {'dayId': 'd2', 'status': 'pickup'},
      {'dayId': 'd3', 'status': 'x'},
    ],
  };

  final cases = <List<dynamic>>[
    ['d1', {'total': 4, 'pickup': 1, 'enroute': 1, 'delivered': 2}],
    ['d2', {'total': 1, 'pickup': 1, 'enroute': 0, 'delivered': 0}],
    ['d9', {'total': 0, 'pickup': 0, 'enroute': 0, 'delivered': 0}],
    ['d3', {'total': 1, 'pickup': 0, 'enroute': 0, 'delivered': 0}],
  ];

  for (final c in cases) {
    final day = c[0] as String;
    final want = (c[1] as Map).cast<String, int>();
    final got = dayProgress(db, day, _deliveriesOfDay);
    assert(_eq(got, want), '✗ $day ⇒ $got ≠ $want');
  }
  print('✓ day-progress (Dart): 4 דוגמאות-חוזה — ירוק');
}
