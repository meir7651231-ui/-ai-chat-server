// חוט · support-msg-time — הומר מ-JS ‏(new/atoms/support-msg-time.mjs). חוזה: support-msg-time.contract.md
// שיקוף V8: פרסור-ISO בלבד (regex + אימות-טווחים); קלט לא-תקין ⇒ '' (כמו NaN-date ב-JS).
// פורמט he-IL ‏hour/minute '2-digit' = ‏HH:MM ‏(24 שעות, מרופד) — עוזר _ מקומי (חוק 6).

int _daysInMonth(int year, int month) {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (month == 2 &&
      (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0))) {
    return 29;
  }
  return days[month - 1];
}

/// שעה-ודקה מקומיות למחרוזת-ISO בסגנון V8; ‏null = Invalid Date.
List<int>? _jsLocalHourMinute(String s) {
  final re = RegExp(
      r'^(\d{4}|[+-]\d{6})-(\d{2})(?:-(\d{2}))?T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,9}))?)?(Z|[+-]\d{2}:?\d{2})?$');
  final m = re.firstMatch(s);
  if (m == null) return null;
  final year = int.parse(m.group(1)!);
  final month = int.parse(m.group(2)!);
  final day = m.group(3) == null ? 1 : int.parse(m.group(3)!);
  final hour = int.parse(m.group(4)!);
  final minute = int.parse(m.group(5)!);
  final second = m.group(6) == null ? 0 : int.parse(m.group(6)!);
  if (month < 1 || month > 12) return null; // חודש-13/00 ⇒ Invalid (חוק 3+4)
  if (day < 1 || day > _daysInMonth(year, month)) return null; // יום-00/גולש ⇒ Invalid
  if (hour > 24 || minute > 59 || second > 59) return null;
  if (hour == 24 && (minute != 0 || second != 0)) return null; // T24:00 בלבד תקין
  final tz = m.group(8);
  if (tz == null) {
    // בלי אזור-זמן: ES מפרש כזמן-מקומי ⇒ הפלט המקומי הוא בדיוק השעה שנכתבה.
    return [hour == 24 ? 0 : hour, minute];
  }
  var offMin = 0;
  if (tz != 'Z') {
    final sign = tz[0] == '-' ? -1 : 1;
    final digits = tz.substring(1).replaceAll(':', '');
    offMin = sign *
        (int.parse(digits.substring(0, 2)) * 60 +
            int.parse(digits.substring(2, 4)));
  }
  final dt = DateTime.utc(year, month, day, hour == 24 ? 0 : hour, minute, second)
      .add(Duration(days: hour == 24 ? 1 : 0))
      .subtract(Duration(minutes: offMin))
      .toLocal();
  return [dt.hour, dt.minute];
}

/// חוט · supportMsgTime — "HH:MM" בפורמט he-IL, או '' לקלט לא-תקין.
dynamic supportMsgTime(dynamic at) {
  final String raw = at as String;
  final s = raw.contains('T') ? raw : raw + 'T12:00:00';
  final hm = _jsLocalHourMinute(s);
  if (hm == null) return '';
  final hh = hm[0].toString().padLeft(2, '0');
  final mm = hm[1].toString().padLeft(2, '0');
  return '$hh:$mm';
}
