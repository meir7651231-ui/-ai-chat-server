// חוט · default-course-dates — טווח-ברירת-מחדל לחוג = שנה"ל הנוכחית (1.9–31.7). חוזה: default-course-dates.contract.md
// המרה מ-JS (new/atoms/default-course-dates.mjs) — התנהגות זהה-לחלוטין למקור (חוק-4).
// מוצא: maor/src/components/courses/lib.ts:32-46 (defaultCourseDates). השכן isoTodayLocal
// (ברירת-מחדל-הפרמטר) הוסר — today מוזרק ע"י הקופסה (חוק-1 — אפס import פנימי). אפס-import (dart-core בלבד).
Map<String, String> defaultCourseDates(String today) {
  // JS: today.slice(0, 10) — סלחן לקצר; Dart substring זורק ⇒ שומרים אורך (כלל-המרה 5).
  final head = today.length > 10 ? today.substring(0, 10) : today;
  // JS: new Date(head + 'T12:00:00') — צהריים-מקומי (מוסכמת-maor). תאריך-שבור ⇒ NaN ⇒ נפילה לשעון.
  // כלל-המרה 4: DateTime.tryParse מגלגל חודש/יום מחוץ-לטווח (13→ינואר-הבא); JS מחזיר Invalid.
  // ⇒ regex ‏yyyy-mm-dd + round-trip: מקבלים רק תאריך ש-רכיביו נשמרו בפרסור (בלי גלגול).
  DateTime? d;
  final m = RegExp(r'^(\d{4})-(\d{2})-(\d{2})$').firstMatch(head);
  if (m != null) {
    final parsed = DateTime.tryParse('${head}T12:00:00');
    if (parsed != null &&
        parsed.year == int.parse(m.group(1)!) &&
        parsed.month == int.parse(m.group(2)!) &&
        parsed.day == int.parse(m.group(3)!)) {
      d = parsed;
    }
  }
  final DateTime base = d ?? DateTime.now(); // תאריך-שבור ⇒ שעון-נוכחי (אותו כלל)
  final y = base.year;
  // JS getMonth() 0-based: אוגוסט=7, והתנאי m>=7. Dart month 1-based: אוגוסט=8 ⇒ month>=8 (זהה).
  // שנת-הלימודים פותחת ב-1.9. באוגוסט ואילך פותחים את השנה שמתחילה השנה;
  // בספטמבר–יולי אנחנו בתוך השנה שנפתחה בספטמבר הקודם.
  final startYear = base.month >= 8 ? y : y - 1;
  return {'start': '$startYear-09-01', 'end': '${startYear + 1}-07-31'};
}
