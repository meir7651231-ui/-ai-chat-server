// בדיקת-חוזה · lineInstallReminders — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/line_install_reminders_test.dart
import 'line_install_reminders.dart';

void main() {
  var n = 0;
  final r = lineInstallReminders();

  if (r.length != 2) throw StateError('FAIL 1: length ${r.length} want 2');
  n++;
  if (r[0] != 'שיפוע לקטע אופקי ארוך') {
    throw StateError('FAIL 2: r[0]="${r[0]}"');
  }
  n++;
  if (r[1] != 'נקודת בדיקה/גישה לתחזוקה') {
    throw StateError('FAIL 3: r[1]="${r[1]}"');
  }
  n++;

  assert(lineInstallReminders().length == 2, 'assert-live guard');
  print('OK lineInstallReminders: $n asserts passed');
}
