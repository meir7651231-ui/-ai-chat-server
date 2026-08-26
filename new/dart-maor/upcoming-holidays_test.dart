import 'upcoming-holidays.dart';

/// רתמת-זהב: בדיוק 5 דוגמאות-החוזה מ-new/atoms/upcoming-holidays.test.mjs.
/// שקעים נאמנים למקור: isoOf מקומי + holidayOf לפי מפת-ISO (מפתח-חסר ⇒ null).
String _pad2(int n) => n.toString().padLeft(2, '0');
String _isoOf(DateTime d) => '${d.year}-${_pad2(d.month)}-${_pad2(d.day)}';
dynamic Function(DateTime) _byMap(Map<String, String> map) =>
    (DateTime d) => map[_isoOf(d)];

void main() {
  var f = 0;
  // השוואת-מערך = אורך + איבר-איבר (כלל-המרה 8 — לעולם לא join).
  void eqList(
    List<Map<String, dynamic>> got,
    List<Map<String, String>> want,
    String msg,
  ) {
    var bad = got.length != want.length;
    if (!bad) {
      for (var i = 0; i < want.length; i++) {
        final g = got[i];
        if (g.length != 2 ||
            g['iso'] != want[i]['iso'] ||
            g['name'] != want[i]['name']) {
          bad = true;
        }
      }
    }
    if (bad) {
      print('✗ $msg ⇒ $got');
      f = 1;
    }
  }

  // 1) דדופ-שם — חג רב-ימי מוחזר ביומו הראשון בלבד
  {
    final holidayOf = _byMap({
      '2026-09-12': 'ראש השנה',
      '2026-09-13': 'ראש השנה',
      '2026-09-15': 'צום גדליה',
    });
    eqList(
      upcomingHolidays('2026-09-10', holidayOf, _isoOf, 5),
      [
        {'iso': '2026-09-12', 'name': 'ראש השנה'},
        {'iso': '2026-09-15', 'name': 'צום גדליה'},
      ],
      'דוגמה 1: דדופ + יום ראשון',
    );
  }

  // 2) הטווח כולל את יום-הקצה (i<=days ⇒ days+1 ימים)
  {
    final holidayOf = _byMap({'2026-09-12': 'ראש השנה'});
    eqList(
      upcomingHolidays('2026-09-10', holidayOf, _isoOf, 2),
      [
        {'iso': '2026-09-12', 'name': 'ראש השנה'},
      ],
      'דוגמה 2: יום-הקצה נכלל',
    );
  }

  // 3) days=0 — רק fromIso עצמו
  {
    final holidayOf = _byMap({
      '2026-09-10': 'חג היום',
      '2026-09-11': 'חג מחר',
    });
    eqList(
      upcomingHolidays('2026-09-10', holidayOf, _isoOf, 0),
      [
        {'iso': '2026-09-10', 'name': 'חג היום'},
      ],
      'דוגמה 3: days=0',
    );
  }

  // 4) אין חגים ⇒ []
  eqList(
    upcomingHolidays('2026-09-10', (DateTime d) => null, _isoOf, 5),
    [],
    'דוגמה 4: ריק',
  );

  // 5) גלגול-חודש — Date(y,0,30+3) מתגלגל לפברואר
  {
    final holidayOf = _byMap({'2026-02-02': 'חג פברואר'});
    eqList(
      upcomingHolidays('2026-01-30', holidayOf, _isoOf, 3),
      [
        {'iso': '2026-02-02', 'name': 'חג פברואר'},
      ],
      'דוגמה 5: גלגול-חודש',
    );
  }

  if (f != 0) throw StateError('upcoming-holidays: סטייה מהמקור');
  print('✓ upcoming-holidays: 5 דוגמאות-החוזה — ירוק');
}
