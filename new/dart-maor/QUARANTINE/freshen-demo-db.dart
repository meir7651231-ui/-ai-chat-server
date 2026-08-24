// חוט · freshen-demo-db — ריענון תאריכי-תזמון של הדמו בדלתא מהעוגן.
// חוזה: new/atoms/freshen-demo-db.contract.md · המרה מ-JS (new/atoms/freshen-demo-db.mjs)
// — התנהגות זהה-לחלוטין למקור (חוק-4). חולץ כלשונו מ-maor/src/lib/demoFresh.ts:32-51
// (כולל העוזרים הפרטיים daysBetween/shift). DEMO_ANCHOR ו-isoLocal הוזרקו כשקעים (חוק-1).
// אפס-import (dart-core בלבד). db = Map; פריטי-אוסף = Map.
// שקעי-JS ⇒ Dart: getMonth() 0-based ⇒ DateTime.month 1-based (בשקע-הבדיקה) ·
// setDate מגלגל ⇒ קונסטרוקטור DateTime מנרמל גלישה (יום/חודש/שנה) · !iso/isNaN ⇒
// null/ריק/tryParse · {...db} ⇒ Map.from (families נשאר אותה רפרנס) · delta 0 ⇒ אותו db.

int _daysBetween(String fromIso, String toIso) {
  final a = DateTime.tryParse(fromIso + 'T12:00:00');
  final b = DateTime.tryParse(toIso + 'T12:00:00');
  if (a == null || b == null) return 0;
  return ((b.millisecondsSinceEpoch - a.millisecondsSinceEpoch) / 86400000)
      .round();
}

/// מזיז תאריך ISO ב-days; קלט ריק/לא-תקין מוחזר כמות-שהוא.
dynamic _shift(dynamic iso, int days, String Function(DateTime d) isoLocal) {
  if (iso == null ||
      iso is! String ||
      iso.isEmpty ||
      !RegExp(r'^\d{4}-\d{2}-\d{2}').hasMatch(iso)) {
    return iso;
  }
  final base = DateTime.tryParse(iso.substring(0, 10) + 'T12:00:00');
  if (base == null) return iso;
  // מקביל ל-setDate(getDate()+days): הקונסטרוקטור מנרמל גלישת-יום/חודש/שנה.
  final d = DateTime(base.year, base.month, base.day + days, 12);
  return isoLocal(d);
}

Map<String, dynamic> freshenDemoDb(
  Map<String, dynamic> db,
  String todayIso,
  String anchorIso,
  String Function(DateTime d) isoLocal,
) {
  final delta = _daysBetween(anchorIso, todayIso);
  if (delta == 0) return db;
  final out = Map<String, dynamic>.from(db);
  out['courses'] = (db['courses'] as List).map((c) {
    final m = Map<String, dynamic>.from(c as Map);
    m['start'] = _shift(m['start'], delta, isoLocal);
    m['end'] = _shift(m['end'], delta, isoLocal);
    return m;
  }).toList();
  out['events'] = (db['events'] as List).map((e) {
    final m = Map<String, dynamic>.from(e as Map);
    m['date'] = _shift(m['date'], delta, isoLocal);
    return m;
  }).toList();
  out['distributionDays'] = (db['distributionDays'] as List).map((d) {
    final m = Map<String, dynamic>.from(d as Map);
    m['date'] = _shift(m['date'], delta, isoLocal);
    m['createdAt'] = _shift(m['createdAt'], delta, isoLocal);
    return m;
  }).toList();
  out['enrollments'] = (db['enrollments'] as List).map((en) {
    final m = Map<String, dynamic>.from(en as Map);
    m['dueDate'] = _shift(m['dueDate'], delta, isoLocal);
    m['enrolledAt'] = _shift(m['enrolledAt'], delta, isoLocal);
    return m;
  }).toList();
  return out;
}
