// ⚛️ אטום-Dart (דרגת-חוזה) · assistantIntentPrompt
// תפקיד: בונה את מחרוזת-ה-prompt לסיווג-כוונת-משתמש (BuildSmart) — שיחה-אחרונה + קטגוריות + ערכות.
// מוצא: buildsmart/app_flutter/lib/logic/assistant_intent.dart:124-169 (חוק-4 — נוסח verbatim).
// אחים שהוטבעו/סוקטו (חוק-3, כדפוס branch_label):
//   • kIntentHistoryWindow (const-מודול, לא-בטיוטה) ⇒ שקע `historyWindow`.
//   • assistantCategories() ⇒ שקע `categories` (List<String>).
//   • kSmartProducts (seed-חיצוני; נקרא כ-'${r.key}=${r.name}') ⇒ שקע `recipes` (רשומות key/name);
//     בניית שורות ה-'key=name' נשארת inline (לוגיקת-האטום).
//   • promptSafeText(text, maxLen:) ⇒ שקע-פונקציה `promptSafeText`.
//   • טיפוס-השכן IntentTurn (.user/.text) ⇒ הוטבע inline.
//   • assistantIntentSystem (const-אח נפרד) אינו חלק מהפונקציה — הושמט.
// טוהר: dart:core בלבד.

/// prompt-הסיווג verbatim assistant_intent.dart:124-169: חלון-שיחה אחרון (עד [historyWindow]),
/// רשימת-הקטגוריות ורשימת-הערכות (key=name), עטופים בהוראות ה-JSON-שורה-אחת.
String assistantIntentPrompt(
  List<IntentTurn> history,
  String userText, {
  required int historyWindow,
  required List<String> categories,
  required List<({String key, String name})> recipes,
  required String Function(String text, {required int maxLen}) promptSafeText,
}) {
  final recent = history.length > historyWindow
      ? history.sublist(history.length - historyWindow)
      : history;
  final cats = categories.join('\n');
  final recipeLines =
      [for (final r in recipes) '${r.key}=${r.name}'].join('\n');
  final b = StringBuffer();
  if (recent.isNotEmpty) {
    b.writeln('השיחה עד כה:');
    for (final m in recent) {
      b.writeln(
          '${m.user ? "משתמש" : "עוזר"}: ${promptSafeText(m.text, maxLen: 600)}');
    }
    b.writeln();
  }
  b.writeln('המשתמש כתב: "${promptSafeText(userText, maxLen: 600)}".');
  b.writeln('בחר פעולה אחת מהרשימה הסגורה והחזר שורת-JSON אחת בלבד:');
  b.writeln('- "answer": ענה ישירות. שים את התשובה ב-say, key="".');
  b.writeln('- "findProduct": המשתמש מחפש מוצר. key = קטגוריה אחת מרשימת '
      'הקטגוריות למטה בדיוק (שורה אחת).');
  b.writeln('- "summarizeOrders": המשתמש שואל על ההזמנות/הרכש שלו.');
  b.writeln('- "checkBudget": המשתמש שואל על התקציב / כמה נשאר.');
  b.writeln('- "addToCart": המשתמש מבקש להוסיף ערכה לסל. key = מפתח-ערכה אחד '
      'מרשימת הערכות למטה בדיוק (החלק שלפני ה-=).');
  b.writeln();
  b.writeln('קטגוריות זמינות ל-findProduct:');
  b.writeln(cats);
  b.writeln();
  b.writeln('ערכות זמינות ל-addToCart (מפתח=שם):');
  b.writeln(recipeLines);
  b.writeln();
  b.writeln('החזר אך ורק שורת-JSON אחת בפורמט: '
      '{"action":"...","key":"...","say":"..."}');
  b.writeln('אם אף קטגוריה/ערכה לא מתאימה — השתמש ב-answer.');
  return b.toString();
}

// — טיפוס-השכן מוטבע (השדות הנקראים ע"י האטום בלבד) —
class IntentTurn {
  const IntentTurn({required this.user, required this.text});
  final bool user;
  final String text;
}
