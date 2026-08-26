// בדיקת-חוזה · managerMorningBriefPrompt — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/manager_morning_brief_prompt_test.dart
import 'manager_morning_brief_prompt.dart';

void _assert(bool cond, String label) {
  if (!cond) throw StateError('FAIL [$label]');
}

void main() {
  var n = 0;

  final out = managerMorningBriefPrompt('2 הזמנות תקועות');
  _assert(out.startsWith('מצב-העסק כעת (נתוני-אמת):\n2 הזמנות תקועות\n\nכתוב תדריך-בוקר'),
      '1 head+context'); n++;
  _assert(out.endsWith('פתח ב-"☀️ תדריך-בוקר:".'), '2 tail'); n++;
  _assert(out.contains('בלי להמציא (אין נתוני-עבר/מגמה).'), '3 no-fabricate clause'); n++;

  final empty = managerMorningBriefPrompt('');
  _assert(empty.startsWith('מצב-העסק כעת (נתוני-אמת):\n\n\nכתוב תדריך-בוקר'),
      '4 empty context'); n++;

  // exact full-string golden (empty context — הכי דטרמיניסטי).
  const golden = 'מצב-העסק כעת (נתוני-אמת):\n\n\n'
      'כתוב תדריך-בוקר קצר לבעלים: 3-4 נקודות-תבליט על מה שדורש תשומת-לב היום '
      '(הזמנות תקועות/פתוחות, ניצול-אשראי גבוה, לקוח בולט). '
      'אך ורק לפי הנתונים שלמעלה — בלי להמציא (אין נתוני-עבר/מגמה). '
      'פתח ב-"☀️ תדריך-בוקר:".';
  _assert(empty == golden, '5 exact golden'); n++;

  assert(managerMorningBriefPrompt('x').contains('☀️ תדריך-בוקר:'),
      'assert-live guard');

  print('OK managerMorningBriefPrompt: $n asserts passed');
}
