import '../dart-data/manager_copilot_prompt-terms.dart' as td_manager_copilot_prompt;
// בדיקת-חוזה · managerCopilotPrompt — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/manager_copilot_prompt_test.dart
import 'manager_copilot_prompt.dart';

// שקע-זהותי: מחזיר את הטקסט כפי-שהוא (מתעלם מ-maxLen).
String _id(String t, {int maxLen = 0}) => t;

// שקע-חותך: חותך ל-maxLen תווים (בודק שה-const 400 עובר, וש-q עבר חיטוי).
String _clip(String t, {int maxLen = 0}) =>
    t.length <= maxLen ? t : t.substring(0, maxLen);

void _eq(String got, String want, String label) {
  if (got != want) throw StateError('FAIL [$label]:\n got="$got"\nwant="$want"');
}

void main() {
  var n = 0;

  _eq(
    managerCopilotPrompt('3 הזמנות פתוחות', 'מה דחוף?', promptSafeText: _id, term: (k)=>td_manager_copilot_prompt.kTerms[k]!),
    'מצב-העסק כעת (נתוני-אמת):\n3 הזמנות פתוחות\n\n'
        'שאלת-הבעלים: "מה דחוף?"\n'
        'ענה בעברית, אך ורק לפי הנתונים שלמעלה.',
    '1 basic',
  );
  n++;

  _eq(
    managerCopilotPrompt('', '', promptSafeText: _id, term: (k)=>td_manager_copilot_prompt.kTerms[k]!),
    'מצב-העסק כעת (נתוני-אמת):\n\n\n'
        'שאלת-הבעלים: ""\n'
        'ענה בעברית, אך ורק לפי הנתונים שלמעלה.',
    '2 empty',
  );
  n++;

  // שקע-חותך ל-5: מוודא ש-maxLen מגיע לשקע (הקריאה עם 400 עוברת), ו-q נחתך.
  final clipped = managerCopilotPrompt('ctx', 'abcdefgh',
      promptSafeText: (t, {int maxLen = 0}) => _clip(t, maxLen: 5), term: (k)=>td_manager_copilot_prompt.kTerms[k]!);
  if (!clipped.contains('"abcde"')) {
    throw StateError('FAIL [3 clip]: expected "abcde" in\n$clipped');
  }
  n++;

  assert(
    managerCopilotPrompt('a', 'b', promptSafeText: _id, term: (k)=>td_manager_copilot_prompt.kTerms[k]!).startsWith('מצב-העסק כעת'),
    'assert-live guard',
  );

  print('OK managerCopilotPrompt: $n asserts passed');
}
