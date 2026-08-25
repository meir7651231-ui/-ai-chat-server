import 'match-incoming-to-planned.dart';

/// רתמת-זהב: אותן 7 דוגמאות-חוזה בדיוק מ-new/atoms/match-incoming-to-planned.test.mjs.
/// אם עובר — Dart ≡ JS.

// שקעים אמיתיים/מתועדים (כמו בבדיקת-ה-JS):
bool nameMatches(String a, String b) => a == b; // שקע-דמיון (כאן: זהות פשוטה)

num dayDiff(String a, String b) {
  // מימוש-אמת של maor: מרחק-ימים מוחלט.
  final pa = a.split('-').map((n) => int.parse(n)).toList();
  final pb = b.split('-').map((n) => int.parse(n)).toList();
  final da = DateTime(pa[0], (pa.length > 1 ? pa[1] : 1), (pa.length > 2 ? pa[2] : 1), 12);
  final db = DateTime(pb[0], (pb.length > 1 ? pb[1] : 1), (pb.length > 2 ? pb[2] : 1), 12);
  return (da.difference(db).inMilliseconds / 86400000).round().abs();
}

Map<String, dynamic> ref(String id, num amount, String date, String name) => {
      'entityType': 'supporter',
      'entityId': 'e$id',
      'plan': {'id': id, 'amount': amount, 'date': date},
      'name': name,
    };

Map<String, dynamic> inc(String id, num amount, String at, String name) =>
    {'id': id, 'amount': amount, 'at': at, 'name': name};

void main() {
  var f = 0;
  void bad(String msg) {
    print('✗ $msg');
    f = 1;
  }

  // 1) התאמה-יחידה תאריך-זהה → confidence 100
  var m = matchIncomingToPlanned(
      inc('i1', 100, '2026-08-24', 'כהן'),
      [ref('p1', 100, '2026-08-24', 'כהן')],
      nameMatches,
      dayDiff);
  if (m == null ||
      m['confidence'] != 100 ||
      (m['plan'] as Map)['id'] != 'p1' ||
      m['incomingId'] != 'i1' ||
      m['entityId'] != 'ep1') bad('התאמה-יחידה: $m');

  // 2) סכום שונה → null
  if (matchIncomingToPlanned(
          inc('i2', 100, '2026-08-24', 'כהן'),
          [ref('p2', 200, '2026-08-24', 'כהן')],
          nameMatches,
          dayDiff) !=
      null) bad('סכום-שונה היה אמור להיות null');

  // 3) שם שונה → null
  if (matchIncomingToPlanned(
          inc('i3', 100, '2026-08-24', 'כהן'),
          [ref('p3', 100, '2026-08-24', 'לוי')],
          nameMatches,
          dayDiff) !=
      null) bad('שם-שונה היה אמור להיות null');

  // 4) תאריך מחוץ-לחלון (6 ימים) → null
  if (matchIncomingToPlanned(
          inc('i4', 100, '2026-08-24', 'כהן'),
          [ref('p4', 100, '2026-08-18', 'כהן')],
          nameMatches,
          dayDiff) !=
      null) bad('מחוץ-לחלון היה אמור להיות null');

  // 5) אמביגואי (2 מועמדים) → null
  if (matchIncomingToPlanned(
          inc('i5', 100, '2026-08-24', 'כהן'),
          [
            ref('p5a', 100, '2026-08-24', 'כהן'),
            ref('p5b', 100, '2026-08-23', 'כהן')
          ],
          nameMatches,
          dayDiff) !=
      null) bad('אמביגואי היה אמור להיות null');

  // 6) מרחק 2 ימים → confidence 80
  m = matchIncomingToPlanned(
      inc('i6', 100, '2026-08-24', 'כהן'),
      [ref('p6', 100, '2026-08-22', 'כהן')],
      nameMatches,
      dayDiff);
  if (m == null || m['confidence'] != 80) bad('dd=2 conf: $m');

  // 7) מרחק 3 ימים (קצה-החלון) → confidence 70, עדיין מוחזר
  m = matchIncomingToPlanned(
      inc('i7', 100, '2026-08-24', 'כהן'),
      [ref('p7', 100, '2026-08-21', 'כהן')],
      nameMatches,
      dayDiff);
  if (m == null || m['confidence'] != 70) bad('dd=3 conf: $m');

  if (f != 0) throw StateError('match-incoming-to-planned: סטייה מהמקור');
  print('✓ match-incoming-to-planned: 7 דוגמאות-חוזה — ירוק');
}
