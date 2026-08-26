// ⚛️ אטום-Dart (דרגת-חוזה) · isDone — האם התור ריק.
// מוצא: maor-system/src/lib/dialer.ts:97 (isDone) · המקור: new/atoms/dialer-is-done.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//  • `c.queue.length === 0` ⇒ queue.isEmpty.

/// True when the queue is empty. Verbatim port of new/atoms/dialer-is-done.mjs.
bool isDone(Map<String, dynamic> c) {
  return (c['queue'] as List).isEmpty;
}
