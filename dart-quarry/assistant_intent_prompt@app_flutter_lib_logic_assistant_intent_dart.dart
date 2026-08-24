// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · assistantIntentPrompt — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/assistant_intent.dart:124-169 (46 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): sublist, assistantCategories, writeln, promptSafeText, toString
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String assistantIntentPrompt(List<IntentTurn> history, String userText) {
  final recent = history.length > kIntentHistoryWindow
      ? history.sublist(history.length - kIntentHistoryWindow)
      : history;
  final cats = assistantCategories().join('\n');
  final recipes =
      [for (final r in kSmartProducts) '${r.key}=${r.name}'].join('\n');
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
  b.writeln(recipes);
  b.writeln();
  b.writeln('החזר אך ורק שורת-JSON אחת בפורמט: '
      '{"action":"...","key":"...","say":"..."}');
  b.writeln('אם אף קטגוריה/ערכה לא מתאימה — השתמש ב-answer.');
  return b.toString();
}

const String assistantIntentSystem =
    'אתה מסווג בקשת-משתמש לפעולה אחת מתוך רשימה סגורה, ב-BuildSmart (רכש '
    'לאינסטלטורים). החזר אך ורק שורת-JSON אחת: action מהרשימה, key (קטגוריה '
    'מהרשימה או ""), ו-say בעברית. לעולם אל תמציא קטגוריה, מוצר, מחיר או מספר.';

/// Parse + VALIDATE the model reply into a trusted intent. TOTAL: any failure
/// (not JSON / missing or unknown action / category outside the real set) →
/// a plain `answer`. Never throws, never yields an un-validated action.
