import 'collection-score-delta.dart';

/// רתמת-זהב: אותן 6 דוגמאות-חוזה בדיוק מ-new/atoms/collection-score-delta.test.mjs.
/// השקע כמו-במקור: הריקון האחרון = מקסימום c.date, '' כשאין.
String lastIso(dynamic box) {
  var last = '';
  for (final c in box['collections']) {
    final d = c['date'] as String;
    if (d.compareTo(last) > 0) last = d; // JS: c.date > last (השוואת-מחרוזת)
  }
  return last;
}

Map<String, dynamic> boxOf(List<String> dates) => {
      'collections': [
        for (final d in dates) {'date': d, 'amount': 1},
      ],
    };

void main() {
  var f = 0;
  void chk(int n, num got, num want) {
    if (got != want) {
      print('✗ דוגמה $n: $got ≠ $want');
      f = 1;
    }
  }

  chk(1, collectionScoreDelta(boxOf([]), '2026-08-01', 120, lastIso), 12);
  chk(2, collectionScoreDelta(boxOf([]), '2026-08-01', 49, lastIso), 10);
  chk(3, collectionScoreDelta(boxOf(['2026-07-01']), '2026-08-01', 100, lastIso), 17);
  chk(4, collectionScoreDelta(boxOf(['2026-01-01']), '2026-08-01', 100, lastIso), 12);
  chk(5, collectionScoreDelta(boxOf(['2026-08-10']), '2026-08-01', 100, lastIso), 12);
  chk(6, collectionScoreDelta(boxOf([]), '2026-08-01', 55, lastIso,
      {'emptyPts': 0, 'ilsPerPoint': 10, 'streakDays': 30, 'streakPts': 3}), 5);

  if (f != 0) throw StateError('collection-score-delta: סטייה מהמקור');
  print('✓ collection-score-delta: 6 דוגמאות-חוזה — ירוק');
}
