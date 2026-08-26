// ⚛️ אטום-Dart (דרגת-חוזה) · currentId — חזית-התור או null.
// מוצא: maor-system/src/lib/dialer.ts:37 (currentId) · המקור: new/atoms/dialer-current-id.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//  • `c.queue.length ? c.queue[0] : null` — truthy=לא-ריק ⇒ queue.isNotEmpty ? queue[0] : null.

/// Head of the queue, or null when empty. Verbatim port of dialer-current-id.mjs.
Object? currentId(Map<String, dynamic> c) {
  final queue = c['queue'] as List;
  return queue.isNotEmpty ? queue[0] : null;
}
