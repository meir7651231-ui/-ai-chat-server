// ⚛️ אטום-Dart (דרגת-חוזה) · campaignCsvRows — שורות-CSV לסיכום (שורה פר-ניסיון, כרונולוגי).
// מוצא: maor-system/src/lib/dialer.ts:121 (campaignCsvRows) + OUTCOME_LABELS:15 (inline) · המקור: new/atoms/dialer-campaign-csv-rows.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//        nameOf = פרמטר-caller (לא שקע-אטום) — פונקציה id⇒שם.
//
// הערות-המרה (JS→Dart):
//  • `OUTCOME_LABELS[e.outcome]` ⇒ מפתוח-Map.
//  • `e.note ?? ''` ⇒ e['note'] ?? '' (null-coalesce זהה).
//  • הפלט List<List> — שורת-כותרת ואז שורה פר-רשומת-יומן.

/// Summary CSV rows. Verbatim port of new/atoms/dialer-campaign-csv-rows.mjs.
List<List<dynamic>> campaignCsvRows(
  Map<String, dynamic> c,
  Object? Function(Object?) nameOf,
) {
  const outcomeLabels = {
    'donated': 'תרם/ה',
    'noanswer': 'לא ענה',
    'refused': 'סירב/ה',
    'callback': 'לחזור',
    'done': 'טופל',
    'skip': 'דילוג',
  };
  final rows = <List<dynamic>>[
    ['שם', 'תוצאה', 'הערה', 'מתי'],
  ];
  for (final e in (c['log'] as List)) {
    rows.add([
      nameOf(e['id']),
      outcomeLabels[e['outcome']],
      e['note'] ?? '',
      e['at'],
    ]);
  }
  return rows;
}
