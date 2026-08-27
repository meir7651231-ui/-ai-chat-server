// בדיקת-אטום · tasksFor — מייבא רק את האטום.
import 'tasks_for.dart';

void main() {
  // בברירת-המחדל (demo) kPersonaTasks = 5 הרשומות.
  assert(kPersonaTasks.length == 5);

  // worker 0 · active → רק id 1.
  final a = tasksFor(0, {'active'});
  assert(a.length == 1);
  assert(a.single.id == 1);

  // worker 0 · pending → ids 2 ו-5 (סדר-המקור נשמר).
  final p = tasksFor(0, {'pending'});
  assert(p.map((t) => t.id).toList().toString() == '[2, 5]');

  // worker 1 · {review, done} → ids 3 ו-4.
  final w1 = tasksFor(1, {'review', 'done'});
  assert(w1.map((t) => t.id).toSet().difference({3, 4}).isEmpty);
  assert(w1.length == 2);

  // סטטוסים ריקים ⇒ ריק.
  assert(tasksFor(0, <String>{}).isEmpty);
  // worker ללא-תואם ⇒ ריק.
  assert(tasksFor(9, {'active'}).isEmpty);

  print('tasks_for OK');
}
