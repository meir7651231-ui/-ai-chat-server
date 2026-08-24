// 🥇 רתמת-זהב · donationPartitionDiff — 6 דוגמאות-החוזה של בדיקת-ה-JS, ביט-אחר-ביט.
// המקור: new/atoms/donation-partition-diff.test.mjs (ה-asserts = מקור-האמת).
// אם עובר ⇒ Dart ≡ JS. הרצה: dart run --enable-asserts donation-partition-diff_test.dart
import 'donation-partition-diff.dart';

// שקע: explodeSupporter האמיתי (id=rid · pkey=purpose מחוטא או המשותף · התרומה שלמה).
Iterable<Map<String, dynamic>> explode(dynamic sp) {
  final donations = (sp['donations'] ?? const []) as List;
  return donations.map((d) {
    final purpose = ((d['purpose'] ?? '') as String).trim();
    return <String, dynamic>{
      'id': d['rid'],
      'supporterId': sp['id'],
      'pkey': purpose.isEmpty ? '_shared_' : purpose, // '' ⇒ falsy ⇒ '_shared_'
      'donation': d,
    };
  }).toList();
}

void main() {
  final d1 = {'rid': 'D-1', 'date': '2026-08-01', 'amount': 100, 'purpose': ''};
  final d2 = {'rid': 'D-2', 'date': '2026-08-02', 'amount': 50, 'purpose': 'כולל'};
  final s1 = {
    'id': 's1',
    'name': 'כהן',
    'donations': [d1, d2]
  };

  // 1 — הכול חדש
  var r = donationPartitionDiff([], [s1], explode);
  var sets = r['sets'] as List;
  var deletes = r['deletes'] as List;
  assert(sets.length == 2 && sets[0]['id'] == 'D-1' && sets[1]['id'] == 'D-2',
      'חדש: 2 sets');
  assert(deletes.isEmpty, 'חדש: אפס deletes');
  assert(sets[0]['pkey'] == '_shared_' && sets[1]['pkey'] == 'כולל',
      'חדש: pkey משותף/ייעוד');

  // 2 — ללא שינוי (עותקים חדשים של אותם מסמכים)
  r = donationPartitionDiff([
    s1
  ], [
    {
      ...s1,
      'donations': [
        {...d1},
        {...d2}
      ]
    }
  ], explode);
  assert((r['sets'] as List).isEmpty && (r['deletes'] as List).isEmpty,
      'ללא-שינוי: ריק');

  // 3 — שינוי סכום D-2
  r = donationPartitionDiff([
    s1
  ], [
    {
      ...s1,
      'donations': [
        d1,
        {...d2, 'amount': 75}
      ]
    }
  ], explode);
  sets = r['sets'] as List;
  assert(
      sets.length == 1 &&
          sets[0]['id'] == 'D-2' &&
          sets[0]['donation']['amount'] == 75 &&
          (r['deletes'] as List).isEmpty,
      'שינוי-סכום: רק D-2');

  // 4 — הסרת D-2
  r = donationPartitionDiff([
    s1
  ], [
    {
      ...s1,
      'donations': [d1]
    }
  ], explode);
  deletes = r['deletes'] as List;
  assert((r['sets'] as List).isEmpty && deletes.length == 1 && deletes[0] == 'D-2',
      'הסרה: deletes=[D-2]');

  // 5 — מעבר-תומך: D-2 עבר ל-s2
  r = donationPartitionDiff([
    s1
  ], [
    {
      ...s1,
      'donations': [d1]
    },
    {
      'id': 's2',
      'name': 'לוי',
      'donations': [d2]
    }
  ], explode);
  sets = r['sets'] as List;
  assert(
      sets.length == 1 &&
          sets[0]['id'] == 'D-2' &&
          sets[0]['supporterId'] == 's2' &&
          (r['deletes'] as List).isEmpty,
      'מעבר-תומך: set לא-מחיקה');

  // 6 — שינוי ייעוד D-1
  r = donationPartitionDiff([
    s1
  ], [
    {
      ...s1,
      'donations': [
        {...d1, 'purpose': 'ישיבה'},
        d2
      ]
    }
  ], explode);
  sets = r['sets'] as List;
  assert(sets.length == 1 && sets[0]['id'] == 'D-1' && sets[0]['pkey'] == 'ישיבה',
      'שינוי-ייעוד: pkey חדש');

  print('✓ donation-partition-diff (Dart): 6 דוגמאות-חוזה — ירוק');
}
