// ⚛️ אטום-Dart (דרגת-חוזה) · progress — remaining ייחודי + counts (לא-ענה/דלג פר-אדם, שאר פר-ניסיון).
// מוצא: maor-system/src/lib/dialer.ts:80 (progress) + REQUEUE_OUTCOMES:10 + ZERO_COUNTS:66 (inline) · המקור: new/atoms/dialer-progress.mjs.
// טוהר: פונקציית top-level עצמאית, אפס import (dart:core בלבד). חוק-4 — זהה-ביט למקור-JS.
//
// הערות-המרה (JS→Dart):
//  • `new Set(c.queue)` ⇒ Set.of(queue); `.size` ⇒ .length.
//  • `seen[e.outcome] ??= new Set()` ⇒ seen.putIfAbsent(outcome, () => <dynamic>{}).
//  • `counts[e.outcome]++` — כל התוצאות מפתחות-קבועים (ZERO_COUNTS).
//  • `Math.max(0, total - remaining)` ⇒ inline (x < 0 ? 0 : x).
//  • הפלט Map בסדר: total → remaining → finalized → counts.

/// Progress meter. Verbatim port of new/atoms/dialer-progress.mjs.
Map<String, dynamic> progress(Map<String, dynamic> c) {
  const requeueOutcomes = ['noanswer', 'skip'];
  final counts = <String, int>{
    'donated': 0,
    'noanswer': 0,
    'refused': 0,
    'callback': 0,
    'done': 0,
    'skip': 0,
  };
  final pending = Set.of(c['queue'] as List);
  final remaining = pending.length;
  final seen = <String, Set<dynamic>>{};
  for (final e in (c['log'] as List)) {
    final outcome = e['outcome'] as String;
    if (requeueOutcomes.contains(outcome)) {
      final s = seen.putIfAbsent(outcome, () => <dynamic>{});
      if (s.contains(e['id'])) continue;
      s.add(e['id']);
    }
    counts[outcome] = counts[outcome]! + 1;
  }
  final total = c['total'] as int;
  final diff = total - remaining;
  return {
    'total': total,
    'remaining': remaining,
    'finalized': diff < 0 ? 0 : diff,
    'counts': counts,
  };
}
