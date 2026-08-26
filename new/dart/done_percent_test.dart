// בדיקת-חוזה · donePercent — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/done_percent_test.dart
import 'done_percent.dart';

const _l1 = [1];
const _l2 = [1, 2];
const _l3 = [1, 2, 3];
const _l4 = [1, 2, 3, 4];
const _e = <Object?>[];

void _eq(int got, int want, String label) {
  if (got != want) throw StateError('FAIL [$label]: got=$got want=$want');
}

void main() {
  var n = 0;

  // מסלול-צעדים גובר על סטטוס
  _eq(donePercent(steps: _l4, doneSteps: _l1, status: 'active'), 25, '1 steps>status');
  n++;
  _eq(donePercent(steps: _l2, doneSteps: _l2, status: 'pending'), 100, '2 full-steps');
  n++;
  _eq(donePercent(steps: _l3, doneSteps: _e, status: 'done'), 0, '3 zero-steps-override');
  n++;

  // מסלול-סטטוס (אין צעדים)
  _eq(donePercent(steps: _e, doneSteps: _e, status: 'done'), 100, '4 done');
  n++;
  _eq(donePercent(steps: _e, doneSteps: _e, status: 'review'), 100, '5 review');
  n++;
  _eq(donePercent(steps: _e, doneSteps: _e, status: 'active'), 50, '6 active');
  n++;
  _eq(donePercent(steps: _e, doneSteps: _e, status: 'pending'), 0, '7 pending');
  n++;
  _eq(donePercent(steps: _e, doneSteps: _e, status: 'proposed'), 0, '8 proposed');
  n++;

  // חיתוך עליון (done > total) + עיגול
  _eq(donePercent(steps: _l3, doneSteps: _l4, status: 'x'), 100, '9 clamp-high');
  n++;
  _eq(donePercent(steps: _l3, doneSteps: _l1, status: 'x'), 33, '10 round');
  n++;

  assert(donePercent(steps: _e, doneSteps: _e, status: 'active') == 50, 'assert-live guard');

  print('OK donePercent: $n asserts passed');
}
