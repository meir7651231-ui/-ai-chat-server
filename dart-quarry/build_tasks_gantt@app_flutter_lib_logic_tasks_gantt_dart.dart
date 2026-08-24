// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · buildTasksGantt — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/tasks_gantt.dart:127-187 (61 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): isBefore, daysBetweenDst, compareTo
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
TasksGanttLayout buildTasksGantt(List<TaskItem> tasks) {
  final scheduled = <TaskItem>[];
  final unscheduled = <TaskItem>[];
  for (final t in tasks) {
    if (t.scheduledStart != null) {
      scheduled.add(t);
    } else {
      unscheduled.add(t);
    }
  }

  // No anchored task → nothing on the timeline; everything is unscheduled.
  if (scheduled.isEmpty) {
    return TasksGanttLayout(
      bars: const [],
      spanDays: 0,
      unscheduled: unscheduled,
    );
  }

  // earliest scheduled DATE (time-of-day dropped) = day 0.
  var earliest = _dateOnly(scheduled.first.scheduledStart!);
  for (final t in scheduled) {
    final d = _dateOnly(t.scheduledStart!);
    if (d.isBefore(earliest)) earliest = d;
  }

  final bars = <GanttBar>[
    for (final t in scheduled)
      GanttBar(
        taskId: t.id,
        name: t.name,
        // earliest → 0; floored at 0 defensively (earliest is the min).
        startDay: () {
          // DST-safe whole-day offset (A4): local-midnight differencing
          // truncates across a spring-forward; daysBetweenDst counts UTC dates.
          final off = daysBetweenDst(earliest, t.scheduledStart!);
          return off < 0 ? 0 : off;
        }(),
        lenDays: t.days < 1 ? 1 : t.days,
        donePercent: _donePercent(t),
        status: t.status,
      ),
  ]..sort((a, b) {
      final byStart = a.startDay.compareTo(b.startDay);
      return byStart != 0 ? byStart : a.taskId.compareTo(b.taskId);
    });

  var spanDays = 0;
  for (final b in bars) {
    final end = b.startDay + b.lenDays;
    if (end > spanDays) spanDays = end;
  }

  return TasksGanttLayout(
    bars: bars,
    spanDays: spanDays,
    unscheduled: unscheduled,
  );
}

