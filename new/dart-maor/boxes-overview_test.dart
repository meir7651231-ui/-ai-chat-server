// בדיקת-חוזה (רתמת-זהב) · boxesOverview — מייבאת אך ורק את האטום-שלה (חוק-4).
// שש דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/boxes-overview.test.mjs
// (אותם קלטים→פלטים; אותם שלושה שקעים lastCollectionIso/boxTotal/smartFilter):
//   1) מיון num                 ⇒ ['3','7','12']  + שורת '12' מלאה (רבקה כהן/משפחת פרץ/2026-03-01/150)
//   2) famId ריק                ⇒ famName ''
//   3) status=active            ⇒ ['7','12']
//   4) sort=total (יורד)        ⇒ ['7','12','3']
//   5) sort=lastCollection      ⇒ ['3','7','12']  (מעולם-לא ראשון)
//   6) q=רבקה (דרך smartFilter)  ⇒ ['7','12']
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/boxes-overview_test.dart  ⇒ exit 0
import 'boxes-overview.dart';

// ─── שקעי-הבדיקה (מקבילים ביט-אחר-ביט לשקעים במקור-ה-JS) ───

// lastCollectionIso: התאריך המקסימלי במערך-האיסופים, '' אם ריק.
String _lastCollectionIso(Map<String, dynamic> box) {
  var last = '';
  for (final c in (box['collections'] as List)) {
    final d = (c as Map)['date'] as String;
    if (d.compareTo(last) > 0) last = d;
  }
  return last;
}

// boxTotal: סכום-הסכומים הסופיים (Number.isFinite ⇒ is num && isFinite).
num _boxTotal(Map<String, dynamic> box) {
  num sum = 0;
  for (final c in (box['collections'] as List)) {
    final a = (c as Map)['amount'];
    if (a is num && a.isFinite) sum += a;
  }
  return sum;
}

// smartFilter: q ריק ⇒ עותק; אחרת פריטים שאחד ממונחיהם מכיל את q (String(t).includes).
List<Map<String, dynamic>> _smartFilter(
  String q,
  List<Map<String, dynamic>> items,
  List<dynamic> Function(Map<String, dynamic>) getTerms,
) {
  if (q.isEmpty) return List<Map<String, dynamic>>.from(items);
  return items
      .where((it) => getTerms(it).any((t) => t.toString().contains(q)))
      .toList();
}

Map<String, dynamic> _db() => <String, dynamic>{
      'tzBoxes': <Map<String, dynamic>>[
        {
          'num': '12',
          'coordinatorId': 'c1',
          'famId': 'f1',
          'status': 'active',
          'collections': [
            {'date': '2026-01-01', 'amount': 100},
            {'date': '2026-03-01', 'amount': 50},
          ],
        },
        {
          'num': '3',
          'coordinatorId': 'c2',
          'famId': 'f2',
          'status': 'returned',
          'collections': <Map<String, dynamic>>[],
        },
        {
          'num': '7',
          'coordinatorId': 'c1',
          'famId': '',
          'status': 'active',
          'collections': [
            {'date': '2026-02-01', 'amount': 200},
          ],
        },
      ],
      'tzCoordinators': <Map<String, dynamic>>[
        {'id': 'c1', 'name': 'רבקה כהן'},
        {'id': 'c2', 'name': 'שרה לוי'},
      ],
      'families': <Map<String, dynamic>>[
        {'id': 'f1', 'name': 'משפחת פרץ'},
        {'id': 'f2', 'name': 'משפחת גל'},
      ],
    };

List<String> _nums(List<Map<String, dynamic>> rows) =>
    rows.map((r) => (r['box'] as Map)['num'] as String).toList();

void _eqList(List<String> got, List<String> want, String label) {
  final g = got.join('|');
  final w = want.join('|');
  if (g != w) throw StateError('FAIL [$label]:\n got =[$g]\n want=[$w]');
}

void _eqStr(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=[$got] want=[$want]');
}

void main() {
  var n = 0;
  final db = _db();

  // 1 — מיון מספרי + שורת '12' מלאה.
  final r1 = boxesOverview(db, '', '', 'num', _lastCollectionIso, _boxTotal, _smartFilter);
  _eqList(_nums(r1), ['3', '7', '12'], 'דוגמה 1 · סדר num');
  n++;
  final b12 = r1.firstWhere((r) => (r['box'] as Map)['num'] == '12');
  _eqStr(b12['coordName'] as String, 'רבקה כהן', 'דוגמה 1 · coordName');
  _eqStr(b12['famName'] as String, 'משפחת פרץ', 'דוגמה 1 · famName');
  _eqStr(b12['last'] as String, '2026-03-01', 'דוגמה 1 · last');
  if ((b12['total'] as num) != 150) {
    throw StateError('FAIL [דוגמה 1 · total]: got=${b12['total']} want=150');
  }
  n++;

  // 2 — famId ריק ⇒ famName ''.
  final b7 = r1.firstWhere((r) => (r['box'] as Map)['num'] == '7');
  _eqStr(b7['famName'] as String, '', 'דוגמה 2 · famName ריק');
  n++;

  // 3 — סינון סטטוס.
  _eqList(
    _nums(boxesOverview(db, '', 'active', 'num', _lastCollectionIso, _boxTotal, _smartFilter)),
    ['7', '12'],
    'דוגמה 3 · status=active',
  );
  n++;

  // 4 — מיון total יורד.
  _eqList(
    _nums(boxesOverview(db, '', '', 'total', _lastCollectionIso, _boxTotal, _smartFilter)),
    ['7', '12', '3'],
    'דוגמה 4 · sort=total',
  );
  n++;

  // 5 — מיון lastCollection: מעולם-לא ראשון.
  _eqList(
    _nums(boxesOverview(db, '', '', 'lastCollection', _lastCollectionIso, _boxTotal, _smartFilter)),
    ['3', '7', '12'],
    'דוגמה 5 · sort=lastCollection',
  );
  n++;

  // 6 — חיפוש דרך שקע-smartFilter.
  _eqList(
    _nums(boxesOverview(db, 'רבקה', '', 'num', _lastCollectionIso, _boxTotal, _smartFilter)),
    ['7', '12'],
    'דוגמה 6 · q=רבקה',
  );
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    _nums(boxesOverview(db, '', '', 'num', _lastCollectionIso, _boxTotal, _smartFilter))
            .join('|') ==
        '3|7|12',
    'assert-live guard',
  );

  print('OK boxesOverview: $n asserts passed');
}
