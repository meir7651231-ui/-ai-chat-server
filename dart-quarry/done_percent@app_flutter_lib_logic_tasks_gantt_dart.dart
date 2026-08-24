// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _donePercent — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/tasks_gantt.dart:94-126 (33 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): difference
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int _donePercent(TaskItem t) {
  if (t.steps.isNotEmpty) {
    final pct = (t.doneSteps.length / t.steps.length * 100).round();
    return pct < 0 ? 0 : (pct > 100 ? 100 : pct);
  }
  switch (t.status) {
    case 'done':
    case 'review':
      return 100;
    case 'active':
      return 50;
    default: // pending · rejected · proposed
      return 0;
  }
}

/// Lay [tasks] onto a whole-day gantt timeline (PURE — the G2a cross-file
/// contract the G2b sheet + tests share).
///
/// • SPLIT: a task with a non-null [TaskItem.scheduledStart] is SCHEDULED (gets
///   a [GanttBar]); a task with null goes to [TasksGanttLayout.unscheduled] in
///   input order — NEVER given a synthetic date.
/// • EMPTY: no scheduled tasks → `bars` empty, `spanDays` 0, `unscheduled` = all.
/// • OFFSETS: dates only (time-of-day dropped). `earliest` = the minimum
///   scheduled date → day 0; each bar's `startDay` = `date.difference(earliest)
///   .inDays`, floored at 0 (defensive — earliest is the min, so it is already
///   non-negative).
/// • LENGTH: `lenDays` = `max(1, task.days)` — a 0/negative-day task still
///   occupies one visible cell.
/// • PROGRESS: `donePercent` per the steps-then-status rule (see [_donePercent]).
/// • SPAN: `spanDays` = `max(startDay + lenDays)` across bars (0 if none).
/// • ORDER: bars sorted by (startDay, then taskId) — a stable, timestamp-free
///   total order, so the layout is deterministic with no tie ambiguity.
