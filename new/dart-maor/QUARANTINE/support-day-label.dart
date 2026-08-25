// חוט · support-day-label — תווית-יום לצ'אט-תמיכה (היום/אתמול/dd/mm/yyyy). חוזה: support-day-label.contract.md
// המרה מ-JS (new/atoms/support-day-label.mjs) — התנהגות זהה-לחלוטין למקור (חוק-4).
// אפס-import (dart-core בלבד). dynamic מותר.

/// truthiness של JS (חוק-7 בתקציר): '' / null / 0 / NaN כוזבים.
bool _truthy(dynamic v) {
  if (v == null) return false;
  if (v is String) return v.isNotEmpty;
  if (v is bool) return v;
  if (v is num) return v != 0 && !v.isNaN;
  return true;
}

/// slice(0,10) בטוח (חוק-5): מחרוזת קצרה מ-10 חוזרת כמות-שהיא.
String _slice10(String s) => s.length <= 10 ? s : s.substring(0, 10);

/// new Date(todayIso+'T12:00:00') בסגנון V8 (חוק-3+4):
/// רק YYYY-MM-DD תקני מתקבל (כל תו-T נוסף ב-todayIso ⇒ הפורמט נשבר ⇒ Invalid);
/// חודש 13/00 ויום 00 ⇒ Invalid (null); יום-גולש מגלגל (DateTime מנרמל).
DateTime? _noonLocal(String todayIso) {
  final m = RegExp(r'^(\d{4})-(\d{2})-(\d{2})$').firstMatch(todayIso);
  if (m == null) return null;
  final y = int.parse(m.group(1)!);
  final mo = int.parse(m.group(2)!);
  final d = int.parse(m.group(3)!);
  if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
  return DateTime(y, mo, d, 12);
}

dynamic supportDayLabel(dynamic at, dynamic todayIso) {
  final day = _slice10(at as String);
  if (day == todayIso) return 'היום';
  // אתמול = יום-אחד לפני todayIso (חישוב על ה-ISO, צהריים מקומי).
  final t = _noonLocal(todayIso as String);
  String y, m, dd;
  if (t == null) {
    // Invalid Date ב-JS: getFullYear/getMonth/getDate = NaN ⇒ String(NaN)='NaN'
    // ('NaN'.padStart(2,'0') נשאר 'NaN' — אורך 3 ≥ 2).
    y = 'NaN';
    m = 'NaN';
    dd = 'NaN';
  } else {
    final yst = DateTime(t.year, t.month, t.day - 1, 12); // setDate(getDate()-1) — מגלגל חודש/שנה
    y = yst.year.toString();
    m = yst.month.toString().padLeft(2, '0');
    dd = yst.day.toString().padLeft(2, '0');
  }
  if (day == '$y-$m-$dd') return 'אתמול';
  // const [yy, mm, d2] = day.split('-') — פירוק JS: איבר-חסר = undefined (null).
  final parts = day.split('-');
  final yy = parts.isNotEmpty ? parts[0] : null;
  final mm = parts.length > 1 ? parts[1] : null;
  final d2 = parts.length > 2 ? parts[2] : null;
  return (_truthy(d2) && _truthy(mm) && _truthy(yy)) ? '$d2/$mm/$yy' : day;
}
