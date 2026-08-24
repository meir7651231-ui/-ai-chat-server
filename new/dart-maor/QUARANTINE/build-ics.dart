// ⚛️ אטום-Dart (דרגת-חוזה) · buildIcs — בניית קובץ ICS ‏(RFC 5545) שלם ממופעים.
// מוצא: maor/src/lib/ics.ts:96-132 דרך new/atoms/build-ics.mjs (חוק-4 — התנהגות
//        זהה-לחלוטין למקור-ה-JS, לא-משופרת). חוזה: new/atoms/build-ics.contract.md.
// טוהר: פונקציית top-level עצמאית, אפס import (רק dart-core). העוזרים הפרטיים של
//        המקור (basicDate · basicLocal · stampUtc · nextIso) נשארים כאן — עוזר-פנימי.
// שקעים (חוק-3): icsEscape · foldIcsLine מוזרקים כפרמטרי-פונקציה.
//
// הערות-המרה (מקור-JS → Dart; כל אחת סטייה-אילו-לא-תוקנה):
//   • getMonth 0↔1: ה-JS מוסיף +1 ל-getMonth()/getUTCMonth() (0-בסיס); ב-Dart
//     DateTime.month כבר 1-בסיס — בלי +1.
//   • truthiness: `oc.time &&` / `if (oc.notes)` — מחרוזת-ריקה/חסר falsy ב-JS ⇒
//     ב-Dart בדיקת `!= null && isNotEmpty`.
//   • Invalid-Date: `new Date('...T25:00:00')` ⇒ NaN ב-JS; DateTime.tryParse ב-Dart
//     *סלחני* וגולל ל-25:00⇒01:00-למחרת. כדי לשמר את הנפילה-הבטוחה ליום-שלם, מאמתים
//     טווח שעה<24 ודקה<60 (שקול-ה-isNaN לקלט HH:MM שעבר את הרגקס).
//   • locale/פורמט: אין — הפורמט קבוע (basic ICS), לא תלוי-locale.

String _basicDate(String iso) => iso.replaceAll('-', '');

String _p(int n, [int w = 2]) => n.toString().padLeft(w, '0');

/// תאריך+שעה מקומיים בפורמט בסיסי צף: YYYYMMDDTHHMMSS.
String _basicLocal(DateTime d) =>
    d.year.toString() + _p(d.month) + _p(d.day) +
    'T' + _p(d.hour) + _p(d.minute) + _p(d.second);

/// DTSTAMP ב-UTC: YYYYMMDDTHHMMSSZ.
String _stampUtc(DateTime now) {
  final u = now.toUtc();
  return u.year.toString() + _p(u.month) + _p(u.day) +
      'T' + _p(u.hour) + _p(u.minute) + _p(u.second) + 'Z';
}

/// יום-המחרת של ISO (ל-DTEND של אירוע יום-שלם).
String _nextIso(String iso) {
  final d = DateTime.parse(iso + 'T12:00:00');
  final n = DateTime(d.year, d.month, d.day + 1);
  return n.year.toString() + '-' + _p(n.month) + '-' + _p(n.day);
}

String buildIcs(
  List<Map<String, String?>> occurrences,
  String calName,
  DateTime now,
  String Function(String) icsEscape,
  List<String> Function(String) foldIcsLine,
) {
  final lines = <String>[
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//maor-system//he//',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:' + icsEscape(calName),
  ];
  final stamp = _stampUtc(now);
  final timeRe = RegExp(r'^\d{2}:\d{2}$');
  for (final oc in occurrences) {
    lines.add('BEGIN:VEVENT');
    lines.add('UID:' + icsEscape(oc['uid'] ?? ''));
    lines.add('DTSTAMP:' + stamp);
    // שעה שאינה HH:MM תקין ⇒ Invalid Date ⇒ נפילה בטוחה ליום-שלם (ביקורת 4.8 · נחיל 13.8).
    final time = oc['time'];
    DateTime? parsedStart;
    if (time != null && time.isNotEmpty && timeRe.hasMatch(time)) {
      final hh = int.parse(time.substring(0, 2));
      final mm = int.parse(time.substring(3, 5));
      // שקול-ה-isNaN של ה-JS: הרגקס לבד לא חוסם 25:00/12:60.
      if (hh < 24 && mm < 60) {
        parsedStart = DateTime.tryParse((oc['date'] ?? '') + 'T' + time + ':00');
      }
    }
    if (parsedStart != null) {
      final end = parsedStart.add(const Duration(milliseconds: 3600000)); // שעה — כולל גלגול-חצות
      lines.add('DTSTART:' + _basicLocal(parsedStart));
      lines.add('DTEND:' + _basicLocal(end));
    } else {
      lines.add('DTSTART;VALUE=DATE:' + _basicDate(oc['date'] ?? ''));
      lines.add('DTEND;VALUE=DATE:' + _basicDate(_nextIso(oc['date'] ?? '')));
    }
    lines.add('SUMMARY:' + icsEscape(oc['title'] ?? ''));
    final notes = oc['notes'];
    if (notes != null && notes.isNotEmpty) {
      lines.add('DESCRIPTION:' + icsEscape(notes));
    }
    final location = oc['location'];
    if (location != null && location.isNotEmpty) {
      lines.add('LOCATION:' + icsEscape(location));
    }
    lines.add('END:VEVENT');
  }
  lines.add('END:VCALENDAR');
  return lines.expand(foldIcsLine).join('\r\n') + '\r\n';
}
