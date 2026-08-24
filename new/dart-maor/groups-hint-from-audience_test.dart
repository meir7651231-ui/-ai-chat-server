import 'groups-hint-from-audience.dart';

/// רתמת-זהב: אותן 7 דוגמאות-חוזה בדיוק מ-new/atoms/groups-hint-from-audience.test.mjs.
/// undefined של JS ⇒ null של Dart (הקלט nullable).
void main() {
  final c = <List<Object?>>[
    ['3 קבוצות', 3],
    ['נפגשים 5 פעמים בשבוע', 5],
    ['4  קבוצות', 4],
    ['1 קבוצות', null],
    ['13 קבוצות', null],
    ['בנות בית ספר', null],
    [null, null],
  ];
  var f = 0;
  for (final row in c) {
    final a = row[0] as String?;
    final w = row[1] as int?;
    final g = groupsHintFromAudience(a);
    if (g != w) {
      print('✗ "$a" ⇒ $g ≠ $w');
      f = 1;
    }
  }
  if (f != 0) throw StateError('groups-hint-from-audience: סטייה מהמקור');
  print('✓ groups-hint-from-audience: 7 דוגמאות-חוזה — ירוק');
}
