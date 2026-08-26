import '../dart-data-maor/audit-report-lines-terms.dart';
// בדיקת-חוזה (רתמת-זהב) · auditReportLines — מייבאת אך ורק את האטום-שלה (חוק-4).
// ארבע דוגמאות-החוזה זהות ביט-אחר-ביט למקור-ה-JS new/atoms/audit-report-lines.test.mjs
// (אותם קלטים→פלטים; הממצא {cat,title} = Map<String,String>):
//   1) 'מאור', [{כפילות/תומך כפול}], '24.8.2026'
//        ⇒ 4 שורות: כותרת/הופק/''/[כפילות] תומך כפול
//   2) '' (ריק) ⇒ כותרת בברירת-מחדל 'מאור החסד'
//   3) 'א', [], 'עכשיו' ⇒ אורך 3, שורה-3 ריקה
//   4) 'ב', [קבלות,תאריכים,כפילות] ⇒ אורך 6, סדר-הקלט נשמר
// אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/audit-report-lines_test.dart  ⇒ exit 0
import 'audit-report-lines.dart';

void _eq(List<String> got, List<String> want, String label) {
  final g = got.join('\n');
  final w = want.join('\n');
  if (g != w) {
    throw StateError('FAIL [$label]:\n got =[$g]\n want=[$w]');
  }
}

void main() {
  var n = 0;

  // 1) דוח עם ממצא יחיד.
  final r1 = auditReportLines(
    'מאור',
    [{'cat': 'כפילות', 'title': 'תומך כפול'}],
    '24.8.2026',
   term: (k)=>kTerms[k]!);
  _eq(r1, [
    'דוח תקינות נתונים — מאור',
    'הופק: 24.8.2026',
    '',
    '[כפילות] תומך כפול',
  ], 'ממצא יחיד');
  n++;
  if (r1.length != 4) throw StateError('FAIL: אורך ≠ 4 (${r1.length})');
  n++;

  // 2) שם-ארגון ריק ⇒ ברירת-מחדל 'מאור החסד'.
  final r2 = auditReportLines('', <Map<String, String>>[], 'x', term: (k)=>kTerms[k]!);
  if (r2[0] != 'דוח תקינות נתונים — מאור החסד') {
    throw StateError('FAIL: ברירת-המחדל לא הופעלה — [${r2[0]}]');
  }
  n++;

  // 3) אפס ממצאים ⇒ אורך 3, שורה-3 ריקה.
  final r3 = auditReportLines('א', <Map<String, String>>[], 'עכשיו', term: (k)=>kTerms[k]!);
  if (!(r3.length == 3 && r3[2] == '')) {
    throw StateError('FAIL: אפס-ממצאים מבנה שגוי (len=${r3.length})');
  }
  n++;

  // 4) שלושה ממצאים — סדר-הקלט נשמר.
  final r4 = auditReportLines('ב', [
    {'cat': 'קבלות', 'title': 'פער רץ'},
    {'cat': 'תאריכים', 'title': 'עתידי'},
    {'cat': 'כפילות', 'title': 'שם כפול'},
  ], 'ת', term: (k)=>kTerms[k]!);
  if (r4.length != 6) throw StateError('FAIL: 3 ממצאים אורך ≠ 6 (${r4.length})');
  n++;
  if (!(r4[3] == '[קבלות] פער רץ' &&
      r4[4] == '[תאריכים] עתידי' &&
      r4[5] == '[כפילות] שם כפול')) {
    throw StateError('FAIL: סדר-הממצאים שובש');
  }
  n++;

  // assert חי (חוק: --enable-asserts) — מוכיח שהמנגנון פעיל.
  assert(
    auditReportLines('מאור', [{'cat': 'כפילות', 'title': 'תומך כפול'}],
            '24.8.2026', term: (k)=>kTerms[k]!)[3] ==
        '[כפילות] תומך כפול',
    'assert-live guard',
  );

  print('OK auditReportLines: $n asserts passed');
}
