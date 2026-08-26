// 🧪 הוכחת-חוצה-שפות · reports (Dart) — מריצה את reports.dart על אותם קלטים/WANT
// כמו new/boxes/reports.test.mjs (13 חוטים + עדשה-עוינת). ירוק ⇒ מאור(JS) ובנייה-חכמה(Dart)
// על אותה קופסה. שלושת מגני-המקור של בדיקת-ה-JS (regex על reports.mjs) = מגני-מקור-JS ⇒
// מדולגים כאן (חוק: מקרה תלוי-JS — הקופסה ה-Dart נבדקת דרך ה-API, לא דרך טקסט-המקור).
import 'dart:convert';
import 'reports.dart' as R;

int n = 0, fails = 0;
void eq(String name, Object? got, Object? want) {
  final g = jsonEncode(got), w = jsonEncode(want);
  if (g != w) { print('✗ $name: got $g want $w'); fails++; } else { n++; }
}

// isoLocal-סטאב (זהה date-util:17-20) לשקע-הזמן — DateTime במקום Date.
String _p2(int nn) => nn.toString().padLeft(2, '0');
String isoLocal(DateTime d) => '${d.year}-${_p2(d.month)}-${_p2(d.day)}';

// allMembers-סטאב (זהה בדיקת-ה-JS) לשקע nameIndex.
List<Map<String, dynamic>> allMembers(dynamic db) {
  final out = <Map<String, dynamic>>[];
  for (final fam in (db['families'] as List)) {
    for (final m in (fam['members'] as List)) {
      out.add({...(m as Map<String, dynamic>), 'famId': fam['id'], 'famName': fam['name']});
    }
  }
  return out;
}

void main() {
  // isoToday (שקע-זמן) — DateTime(2026,8,24) ≡ JS new Date(2026,7,24) (חודש 1-based ב-Dart).
  eq('isoToday', R.isoToday(isoLocal, DateTime(2026, 8, 24, 12, 0, 0)), '2026-08-24');
  eq('isoToday גבול-לילה', R.isoToday(isoLocal, DateTime(2026, 1, 1, 3, 0, 0)), '2026-01-01');

  // fmtDate — כולל עדשה-עוינת: ריק=>'' · שבור=>כמו-שהוא (לא '—')
  eq('fmtDate תקין', R.fmtDate('2026-08-24'), '24/08/2026');
  eq('fmtDate עם-שעה', R.fmtDate('2026-08-24T12:00:00'), '24/08/2026');
  eq('fmtDate ריק', R.fmtDate(''), '');
  eq('fmtDate שבור=>כמו-שהוא', R.fmtDate('שטויות'), 'שטויות');
  eq('fmtDate חלקי=>כמו-שהוא', R.fmtDate('2026-08'), '2026-08');

  // inRange
  eq('inRange בטווח', R.inRange('2026-05-01', {'from': '2026-01-01', 'to': '2026-12-31'}), true);
  eq('inRange מתחת', R.inRange('2025-12-31', {'from': '2026-01-01', 'to': ''}), false);
  eq('inRange ריק', R.inRange('', {'from': '', 'to': ''}), false);

  // rangeLabel (שקע fmtDate של הקופסה)
  eq('rangeLabel ריק', R.rangeLabel({'from': '', 'to': ''}), 'כל התאריכים');
  eq('rangeLabel מלא', R.rangeLabel({'from': '2026-01-01', 'to': '2026-03-01'}), '01/01/2026 – 01/03/2026');
  eq('rangeLabel מ', R.rangeLabel({'from': '2026-01-01', 'to': ''}), 'מ-01/01/2026');
  eq('rangeLabel עד', R.rangeLabel({'from': '', 'to': '2026-03-01'}), 'עד 01/03/2026');

  // paidOf — עדשה-עוינת: NaN מדולג · payments חסר
  eq('paidOf', R.paidOf({'payments': [{'amount': 100}, {'amount': 50}]}), 150);
  eq('paidOf NaN מדולג', R.paidOf({'payments': [{'amount': 100}, {'amount': double.nan}]}), 100);
  eq('paidOf ללא-payments', R.paidOf({}), 0);

  // round2
  eq('round2 float', R.round2(0.1 + 0.2), 0.3);

  // paidInRange (שקע inRange)
  eq('paidInRange',
      R.paidInRange({'payments': [{'amount': 100, 'date': '2026-02-01'}, {'amount': 50, 'date': '2025-01-01'}]},
          {'from': '2026-01-01', 'to': ''}),
      100);

  // balanceOf (שקע paidOf) — לא-שלילי
  eq('balanceOf', R.balanceOf({'totalDue': 200, 'payments': [{'amount': 50}]}), 150);
  eq('balanceOf לא-שלילי', R.balanceOf({'totalDue': 100, 'payments': [{'amount': 300}]}), 0);
  eq('balanceOf ריק', R.balanceOf({}), 0);

  // monthKey / monthLabel
  eq('monthKey', R.monthKey('2026-08-24'), '2026-08');
  eq('monthLabel', R.monthLabel('2026-08'), '08/2026');

  // nameIndex (שקע allMembers)
  final idx = R.nameIndex({'families': [{'id': 'f', 'name': 'כהן', 'members': [{'id': 'm1'}]}]}, allMembers) as Map;
  eq('nameIndex', idx['m1'], {'id': 'm1', 'famId': 'f', 'famName': 'כהן'});
  eq('nameIndex גודל', idx.length, 1);

  // STATUS_LABEL — עברית verbatim
  eq('STATUS_LABEL', R.statusLabel, {'active': 'פעילה', 'pending': 'ממתינה', 'inactive': 'לא פעילה'});

  // countBy — ממוין יורד
  eq('countBy', R.countBy([{'s': 'a'}, {'s': 'a'}, {'s': 'b'}], (x) => x['s'] as String), [['a', 2], ['b', 1]]);
  eq('countBy ריק', R.countBy([], (x) => x['s'] as String), []);

  // 🛡 שלושת מגני-המקור של בדיקת-ה-JS (regex על reports.mjs) = מגני-מקור-JS ⇒ מדולגים (ראה כותרת).

  if (fails > 0) {
    print('❌ קופסת-reports (Dart): $fails אי-התאמות מול golden ה-JS');
    throw StateError('reports dart proof failed');
  }
  print('✓ קופסת-הדוחות (Dart): $n טענות — 13 חוטים דרך הקופסה + עדשה-עוינת · פלט זהה-ביט ל-JS · שתי המערכות על אותה קופסה');
}
