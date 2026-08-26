// ⚛️ אטום-Dart (דרגת-חוזה) · undoLast — ביטול-סיווג-אחרון: המזהה לחזית, יומן−1; requeue מוסר מסוף-התור.
// מוצא: maor-system/src/lib/dialer.ts:106 (undoLast) + REQUEUE_OUTCOMES:10 (inline) · המקור: new/atoms/dialer-undo-last.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//
// הערות-המרה (JS→Dart):
//  • `c.log[c.log.length-1]` ואז `if(!last)` — יומן ריק ⇒ no-op (מגן [-1]).
//  • `REQUEUE_OUTCOMES.includes` ⇒ .contains; `queue.lastIndexOf` ⇒ .lastIndexOf.
//  • `queue.slice(0,at)`/`slice(at+1)` ⇒ sublist(0,at)/sublist(at+1); spread ⇒ [...].
//  • `c.log.slice(0,-1)` ⇒ sublist(0, len-1).
//  • `{ ...c, queue, log }` — Map.of(c) שומר-סדר-הקלט (name, startedAt, total, queue, log).

/// Undo the last outcome. Verbatim port of new/atoms/dialer-undo-last.mjs.
Map<String, dynamic> undoLast(Map<String, dynamic> c) {
  const requeueOutcomes = ['noanswer', 'skip'];
  final log = c['log'] as List;
  if (log.isEmpty) return c;
  final last = log[log.length - 1];
  var queue = c['queue'] as List;
  if (requeueOutcomes.contains(last['outcome'])) {
    final at = queue.lastIndexOf(last['id']);
    queue = at >= 0
        ? [...queue.sublist(0, at), ...queue.sublist(at + 1)]
        : queue;
  }
  final out = Map<String, dynamic>.of(c);
  out['queue'] = [last['id'], ...queue];
  out['log'] = log.sublist(0, log.length - 1);
  return out;
}
