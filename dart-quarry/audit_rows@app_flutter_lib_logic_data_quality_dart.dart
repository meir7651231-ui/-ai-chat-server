// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · auditRows — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/data_quality.dart:56-90 (35 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): normName
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
QualityReport auditRows(List<QualityRow> rows) {
  final warnings = <QualityWarning>[];
  final firstByName = <String, int>{}; // normName(name) → השורה הראשונה
  final firstByKey = <String, int>{}; // normName(key)  → השורה הראשונה
  for (final r in rows) {
    final nn = normName(r.name);
    if (nn.isNotEmpty) {
      final first = firstByName[nn];
      if (first != null) {
        warnings.add(QualityWarning(
          line: r.line,
          kind: 'dup-name',
          message: 'פריט ${r.line} — שם זהה לפריט $first (מק"ט שונה): "${r.name}"',
        ));
      } else {
        firstByName[nn] = r.line;
      }
    }
    final nk = normName(r.key);
    if (nk.isNotEmpty) {
      final first = firstByKey[nk];
      if (first != null) {
        warnings.add(QualityWarning(
          line: r.line,
          kind: 'near-key',
          message: 'פריט ${r.line} — מק"ט שונה רק ברישיות/רווח מפריט $first',
        ));
      } else {
        firstByKey[nk] = r.line;
      }
    }
  }
  return QualityReport(warnings: warnings, scanned: rows.length);
}

