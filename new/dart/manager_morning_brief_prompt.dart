// ⚛️ אטום-Dart (דרגת-חוזה) · managerMorningBriefPrompt
// תפקיד: בונה את מחרוזת-ה-prompt ל"תדריך-בוקר" — מצב-העסק (context) + הנחיית-הפלט הקבועה.
// מוצא: buildsmart/app_flutter/lib/logic/manager_copilot.dart:109-116 (‏managerMorningBriefPrompt; חוק-4).
// אחים: אין. אפס-שקע (הכול מחרוזות-קבועות + [context]).
// טוהר: dart:core בלבד; אפס import, אפס state.

/// מחרוזת prompt לתדריך-בוקר: מצב-אמת [context] + הנחיית 3-4 נקודות-תבליט.
/// verbatim manager_copilot.dart:109-116.
String managerMorningBriefPrompt(String context) {
  return 'מצב-העסק כעת (נתוני-אמת):\n$context\n\n'
      'כתוב תדריך-בוקר קצר לבעלים: 3-4 נקודות-תבליט על מה שדורש תשומת-לב היום '
      '(הזמנות תקועות/פתוחות, ניצול-אשראי גבוה, לקוח בולט). '
      'אך ורק לפי הנתונים שלמעלה — בלי להמציא (אין נתוני-עבר/מגמה). '
      'פתח ב-"☀️ תדריך-בוקר:".';
}
