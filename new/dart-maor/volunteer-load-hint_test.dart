// בדיקת-חוזה · volunteerLoadHint — תרגום new/atoms/volunteer-load-hint.test.mjs אחד-לאחד.
// הרצה: dart run --enable-asserts ⇒ OK
import 'volunteer-load-hint.dart';

void main() {
  List<dynamic> deliveriesOfVolunteer(dynamic db, dynamic volId, dynamic dayId) =>
      (db['deliveries'] as List)
          .where((d) => d['volunteerId'] == volId && (dayId == null || dayId == '' || d['dayId'] == dayId))
          .toList();

  final db = {
    'deliveries': [
      {'volunteerId': 'v1', 'dayId': 'd1'},
      {'volunteerId': 'v1', 'dayId': 'd1'},
      {'volunteerId': 'v1', 'dayId': 'd1'},
      {'volunteerId': 'v1', 'dayId': 'd2'},
      {'volunteerId': 'v2', 'dayId': 'd1'},
    ],
  };
  final cases = <List<dynamic>>[
    [{'id': 'v1'}, 'd1', 3, false], // maxDeliveries חסר ⇒ אין-מגבלה
    [{'id': 'v1', 'maxDeliveries': 3}, 'd1', 3, true],
    [{'id': 'v1', 'maxDeliveries': 5}, 'd1', 3, false],
    [{'id': 'v1', 'maxDeliveries': 1}, 'd2', 1, true],
    [{'id': 'v9', 'maxDeliveries': 0}, 'd1', 0, true],
  ];
  for (final c in cases) {
    final g = volunteerLoadHint(db, c[0], c[1], deliveriesOfVolunteer);
    if (g['count'] != c[2] || g['over'] != c[3]) {
      throw StateError('(${c[0]},${c[1]}) ⇒ $g ≠ {count:${c[2]},over:${c[3]}}');
    }
  }
  // ‏maxDeliveries:null מפורש ⇒ אותו ענף כמו-חסר (== null רופף במקור)
  final gNull = volunteerLoadHint(db, {'id': 'v1', 'maxDeliveries': null}, 'd1', deliveriesOfVolunteer);
  if (gNull['count'] != 3 || gNull['over'] != false) throw StateError('null-מפורש ⇒ אין-מגבלה');
  print('OK volunteerLoadHint: 6 asserts passed');
}
