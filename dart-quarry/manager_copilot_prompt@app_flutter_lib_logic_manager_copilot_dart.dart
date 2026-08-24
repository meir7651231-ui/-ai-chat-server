// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · managerCopilotPrompt — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/manager_copilot.dart:101-108 (8 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): promptSafeText
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String managerCopilotPrompt(String context, String question) {
  final q = promptSafeText(question, maxLen: 400);
  return 'מצב-העסק כעת (נתוני-אמת):\n$context\n\n'
      'שאלת-הבעלים: "$q"\n'
      'ענה בעברית, אך ורק לפי הנתונים שלמעלה.';
}

/// One-tap "morning brief" — Claude flags what needs attention today.
