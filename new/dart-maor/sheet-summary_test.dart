// בדיקת-חוזה (רתמת-זהב) · sheetSummary — מייבאת אך ורק את האטום-שלה (חוק-4).
// מתרגמת את כל 5 דוגמאות-החוזה (sheet-summary.contract.md) ואת בדיקת-ה-JS
// (new/atoms/sheet-summary.test.mjs) ביט-אחר-ביט: ספירה / presents-חסר /
// רשימה-ריקה / אפס-סימונים / התאמת-תאריך-מדויקת. הפלט = Map {present,total} —
// נבדק שדה-שדה (רוח חוק-8: אף פעם לא JSON/join). כשל ⇒ StateError. אם עובר ⇒ Dart≡JS.
// הרצה: dart run --enable-asserts new/dart-maor/sheet-summary_test.dart ⇒ exit 0
import 'sheet-summary.dart';

void _ok(bool cond, String msg) {
  if (!cond) throw StateError('FAIL: $msg');
}

/// השוואת פלט {present,total} שדה-שדה, כמו eq של בדיקת-ה-JS.
void _eq(dynamic out, int present, int total, String msg) {
  _ok(out is Map && out['present'] == present && out['total'] == total,
      '$msg (בפועל: $out)');
}

void main() {
  var n = 0;

  // 1) רק מי שהתאריך ברשימתו נספר.
  {
    final roster = [
      {'presents': ['2026-08-24']},
      {'presents': ['2026-08-23']},
      {'presents': ['2026-08-23', '2026-08-24']},
    ];
    _eq(sheetSummary(roster, '2026-08-24'), 2, 3, 'חייב {present:2,total:3}');
    n++;
  }

  // 2) presents חסר נספר לא-נוכח, בלי לקרוס (?? []).
  {
    _eq(
        sheetSummary([
          <String, dynamic>{},
          {'presents': ['2026-08-24']},
        ], '2026-08-24'),
        1,
        2,
        'שיבוץ בלי presents חייב להיספר לא-נוכח (?? [])');
    n++;
  }

  // 3) רשימה ריקה ⇒ {present:0, total:0}.
  {
    _eq(sheetSummary([], '2026-08-24'), 0, 0, 'רשימה ריקה חייבת {present:0,total:0}');
    n++;
  }

  // 4) אף אחד לא סומן ⇒ present:0, total נשאר 2.
  {
    _eq(
        sheetSummary([
          {'presents': <dynamic>[]},
          {'presents': ['2026-08-23']},
        ], '2026-08-24'),
        0,
        2,
        'בלי סימון ליום ⇒ present:0, total נשאר 2');
    n++;
  }

  // 5) התאמת-תאריך מדויקת — אין נירמול-פורמט (includes מדויק).
  {
    _eq(
        sheetSummary([
          {'presents': ['2026-08-04']},
        ], '2026-08-4'),
        0,
        1,
        "'2026-08-4' אסור שיתאים ל-'2026-08-04' — includes מדויק");
    n++;
  }

  print('OK sheetSummary: $n contract examples passed');
}
