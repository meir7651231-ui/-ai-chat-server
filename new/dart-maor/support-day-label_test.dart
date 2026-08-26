// בדיקת-Golden ל-support-day-label (12 הקלטות מ-support-day-label.test.mjs) + עוגני-רגרסיה.
import 'dart:convert';
import 'support-day-label.dart';

void main() {
  // [[args...], wantJson] — מ-support-day-label.test.mjs verbatim.
  final cases = <List<dynamic>>[
    [['', ''], '"היום"'],
    [['', 'אבג'], '""'],
    [['', 'כהן לוי'], '""'],
    [['', 'abc'], '""'],
    [['', 'a@b.com'], '""'],
    [['', '2026-08-24'], '""'],
    [['', '2026-08-24T12:00:00'], '""'],
    [['', '0501234567'], '""'],
    [['', '03-1234567'], '""'],
    [['', 'https://x.co'], '""'],
    [['', 'שלום עולם'], '""'],
    [['', '12'], '""'],
  ];

  var fail = 0;
  for (final c in cases) {
    final args = c[0] as List<dynamic>;
    final want = c[1] as String;
    final got = jsonEncode(supportDayLabel(args[0], args[1]));
    if (got != want) {
      print('✗ $args ⇒ $got ≠ $want');
      fail++;
    }
  }
  assert(fail == 0, 'Golden נכשל');

  // עוגן-רגרסיה (הבאג של-ההסגר): שנה-מורחבת V8 +002026 מתקבלת ⇒ 'אתמול'.
  final ext = supportDayLabel('2026-08-23', '+002026-08-24');
  assert(ext == 'אתמול', 'שנה-מורחבת +002026 חייבת להתפרסם ⇒ אתמול, קיבלנו: $ext');

  // עוגן: תאריך-רגיל אתמול.
  assert(supportDayLabel('2026-08-23', '2026-08-24') == 'אתמול');
  // עוגן: תאריך-רחוק ⇒ dd/mm/yyyy.
  assert(supportDayLabel('2026-01-15', '2026-08-24') == '15/01/2026');
  // עוגן: T-נוסף ב-todayIso שובר את הפרסור ⇒ לא 'אתמול'.
  assert(supportDayLabel('2026-08-23', '2026-08-24T12:00:00') == '23/08/2026');

  print('✓ support-day-label: ${cases.length} הקלטות-Golden + 4 עוגני-רגרסיה — ירוק');
}
