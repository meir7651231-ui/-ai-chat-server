// בדיקת-חוזה golden · buildTasksGantt — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/build_tasks_gantt_test.dart
import 'build_tasks_gantt.dart';

// שקעים מדומים המייצגים את החוזה:
// daysBetweenDst = הפרש-ימים לפי תאריך-בלבד (DST-בטוח במקור); donePercent = 100 ל-done אחרת 50.
int _days(DateTime a, DateTime b) =>
    DateTime(b.year, b.month, b.day)
        .difference(DateTime(a.year, a.month, a.day))
        .inDays;
int _done(TaskItem t) => t.status == 'done' ? 100 : 50;

TasksGanttLayout _run(List<TaskItem> tasks) =>
    buildTasksGantt(tasks, daysBetweenDst: _days, donePercent: _done);

void main() {
  var n = 0;

  // — הכל לא-מעוגן ⇒ bars ריק, span 0, unscheduled=הכל —
  final r0 = _run(const [
    TaskItem(id: 'U1', name: 'a', days: 2, status: 'active'),
    TaskItem(id: 'U2', name: 'b', days: 1, status: 'done'),
  ]);
  if (r0.bars.isNotEmpty) throw StateError('FAIL 0 bars');
  if (r0.spanDays != 0) throw StateError('FAIL 0 span');
  if (r0.unscheduled.length != 2) throw StateError('FAIL 0 unsched');
  n++;

  // — תמהיל: T1(Jan5,3), T2(Jan1,2,done), T3(null), T4(Jan1,0) —
  final r = _run([
    TaskItem(id: 'T1', name: 'רצפה', days: 3, status: 'active', scheduledStart: DateTime(2026, 1, 5)),
    TaskItem(id: 'T2', name: 'יסוד', days: 2, status: 'done', scheduledStart: DateTime(2026, 1, 1)),
    const TaskItem(id: 'T3', name: 'גמר', days: 1, status: 'active'),
    TaskItem(id: 'T4', name: 'ניקוי', days: 0, status: 'active', scheduledStart: DateTime(2026, 1, 1)),
  ]);
  // unscheduled = [T3]
  if (r.unscheduled.length != 1 || r.unscheduled.first.id != 'T3') {
    throw StateError('FAIL unsched ${r.unscheduled.map((t) => t.id).toList()}');
  }
  n++;
  // סדר: startDay ואז taskId ⇒ [T2, T4, T1]
  if (r.bars.map((b) => b.taskId).join(',') != 'T2,T4,T1') {
    throw StateError('FAIL order ${r.bars.map((b) => b.taskId).toList()}');
  }
  n++;
  // T2: startDay 0, lenDays 2, done 100
  final t2 = r.bars[0];
  if (t2.startDay != 0 || t2.lenDays != 2 || t2.donePercent != 100) {
    throw StateError('FAIL T2 ${t2.startDay}/${t2.lenDays}/${t2.donePercent}');
  }
  n++;
  // T4: days 0 ⇒ lenDays 1 (רצפה)
  final t4 = r.bars[1];
  if (t4.startDay != 0 || t4.lenDays != 1) throw StateError('FAIL T4 len ${t4.lenDays}');
  n++;
  // T1: startDay 4 (Jan1→Jan5), lenDays 3, done 50
  final t1 = r.bars[2];
  if (t1.startDay != 4 || t1.lenDays != 3 || t1.donePercent != 50) {
    throw StateError('FAIL T1 ${t1.startDay}/${t1.lenDays}/${t1.donePercent}');
  }
  n++;
  // spanDays = max(0+2, 0+1, 4+3) = 7
  if (r.spanDays != 7) throw StateError('FAIL span ${r.spanDays}');
  n++;

  // — startDay מרוצף ל-0 כשהחישוב שלילי (הגנה) —
  // כאן earliest הוא המוקדם, כך שכל ה-offset אי-שלילי; נבדוק מקרה יום-בודד ⇒ span=lenDays.
  final rs = _run([
    TaskItem(id: 'S', name: 's', days: 5, status: 'active', scheduledStart: DateTime(2026, 3, 10)),
  ]);
  if (rs.bars.length != 1 || rs.bars[0].startDay != 0 || rs.spanDays != 5) {
    throw StateError('FAIL single ${rs.spanDays}');
  }
  n++;

  assert(_run(const []).spanDays == 0, 'assert-live');
  print('OK buildTasksGantt: $n asserts passed');
}
