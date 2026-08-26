// ⚛️ אטום-Dart (דרגת-חוזה) · applyOutcome — רישום-יומן + קידום; לא-סופי ⇒ requeue; בלי-נוכחי ⇒ no-op.
// מוצא: maor-system/src/lib/dialer.ts:46 (applyOutcome) + REQUEUE_OUTCOMES:10 (inline) · המקור: new/atoms/dialer-apply-outcome.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//        השכן currentId הוזרק כשקע-פרמטר (חוק-1/חוק-3).
//
// הערות-המרה (JS→Dart):
//  • `REQUEUE_OUTCOMES.includes(outcome)` ⇒ const List + .contains.
//  • `!id` (null או '') ⇒ no-op.
//  • `c.queue.slice(1)` ⇒ sublist(1); `[...rest, id]` ⇒ [...rest, id].
//  • `note && note.trim()` — note לא-null ולא-ריק-אחרי-trim.
//  • `{ ...c, queue, log:[...] }` — Map.of(c) שומר-סדר, ואז דריסת queue/log במקומן.
//    הפלט שומר את סדר-מפתחות-הקלט (name, startedAt, queue, total, log).

/// Applies a call outcome. Verbatim port of new/atoms/dialer-apply-outcome.mjs;
/// the neighbour `currentId` is injected as a socket (Law 1/3).
Map<String, dynamic> applyOutcome(
  Map<String, dynamic> c,
  String outcome,
  String? note,
  String iso, {
  required Object? Function(Map<String, dynamic>) currentId,
}) {
  const requeueOutcomes = ['noanswer', 'skip'];
  final id = currentId(c);
  if (id == null || id == '') return c;
  final rest = (c['queue'] as List).sublist(1);
  final queue = requeueOutcomes.contains(outcome) ? [...rest, id] : rest;
  final entry = <String, dynamic>{'id': id, 'outcome': outcome, 'at': iso};
  if (note != null && note.trim().isNotEmpty) entry['note'] = note.trim();
  final out = Map<String, dynamic>.of(c);
  out['queue'] = queue;
  out['log'] = [...(c['log'] as List), entry];
  return out;
}
