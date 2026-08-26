// ⚛️ אטום-Dart (דרגת-חוזה) · startCampaign — פתיחת-קמפיין (דדופ + סינון-ריקים, סדר נשמר).
// מוצא: maor-system/src/lib/dialer.ts:25 (startCampaign) · המקור: new/atoms/dialer-start-campaign.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//
// הערות-המרה (JS→Dart):
//  • `!id` (falsy) ⇒ מזהה ריק/null מדולג (המזהים מחרוזות בדומיין).
//  • `new Set()` + `seen.has/add` ⇒ Set<dynamic>.
//  • הפלט Map בסדר: name → startedAt → queue → total → log (Map-literal = LinkedHashMap).

/// Opens a campaign: dedup + drop-empties, order preserved.
/// Verbatim port of new/atoms/dialer-start-campaign.mjs.
Map<String, dynamic> startCampaign(String name, List ids, String iso) {
  final seen = <dynamic>{};
  final queue = <dynamic>[];
  for (final id in ids) {
    if (id == null || id == '' || seen.contains(id)) continue;
    seen.add(id);
    queue.add(id);
  }
  return {
    'name': name,
    'startedAt': iso,
    'queue': queue,
    'total': queue.length,
    'log': <dynamic>[],
  };
}
