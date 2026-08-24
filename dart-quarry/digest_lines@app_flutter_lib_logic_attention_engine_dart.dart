// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · digestLines — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/attention_engine.dart:155-193 (39 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): attentionItems, where, toList
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<DigestLine> digestLines(AttentionInput inp, {required OrgConfig cfg}) {
  final items = attentionItems(inp, cfg: cfg);
  final out = <DigestLine>[];

  final crit = items.where((a) => a.sev == AttentionSev.crit).toList();
  if (crit.isNotEmpty) {
    out.add(DigestLine(
      key: 'urgent',
      urgent: true,
      text: crit.length == 1
          ? '⚠ פריט קריטי אחד דורש טיפול'
          : '⚠ ${crit.length} פריטים קריטיים דורשים טיפול',
      navTab: crit.first.navTab,
    ));
  }
  if (inp.pendingApprovals > 0) {
    out.add(DigestLine(
      key: 'approvals',
      text: '${inp.pendingApprovals} משימות ממתינות לאישור',
      navTab: 3,
    ));
  }
  if (inp.pendingVacations > 0) {
    out.add(DigestLine(
      key: 'vacations',
      text: '${inp.pendingVacations} בקשות חופשה ממתינות',
      navTab: 3,
    ));
  }
  if (out.isEmpty) {
    out.add(const DigestLine(
      key: 'quiet',
      text: 'הכל מעודכן — אין משימות דחופות הבוקר',
      navTab: 0,
    ));
  }
  return out;
}

