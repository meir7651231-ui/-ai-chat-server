// רתמת-זהב · deliveries-of-volunteer — assert-ים = דוגמאות-החוזה של בדיקת-ה-JS (זהות).
// אם עובר: Dart ≡ JS (new/atoms/deliveries-of-volunteer.test.mjs).
import 'deliveries-of-volunteer.dart';

void main() {
  final db = <String, dynamic>{
    'deliveries': [
      {'id': 'd1', 'volunteerId': 'v1', 'dayId': 'A'},
      {'id': 'd2', 'volunteerId': 'v2', 'dayId': 'A'},
      {'id': 'd3', 'volunteerId': 'v1', 'dayId': 'B'},
    ],
  };

  // 1) בלי dayId — כל ימי-המתנדב
  final a = deliveriesOfVolunteer(db, 'v1');
  assert(a.length == 2 && a[0]['id'] == 'd1' && a[1]['id'] == 'd3',
      '✗ v1: לא [d1,d3]');

  // 2) עם dayId — צמצום ליום
  final b = deliveriesOfVolunteer(db, 'v1', 'A');
  assert(b.length == 1 && b[0]['id'] == 'd1', "✗ v1+'A': לא [d1]");

  // 3) dayId='' (falsy) — כמו בלי
  assert(deliveriesOfVolunteer(db, 'v1', '').length == 2, "✗ dayId='' לא כמו-בלי");

  // 4) יום בלי מסירות של המתנדב
  assert(deliveriesOfVolunteer(db, 'v1', 'C').length == 0, "✗ v1+'C': לא ריק");

  // 5) מתנדב לא-קיים
  assert(deliveriesOfVolunteer(db, 'v9').length == 0, '✗ v9: לא ריק');

  print('✓ deliveries-of-volunteer (Dart): 5 דוגמאות-חוזה — ירוק');
}
