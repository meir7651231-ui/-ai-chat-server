// ⚛️ אטום-Dart (דרגת-חוזה) · studioScopePrompt
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_prompt.dart:213-235 (חוק-4 — טקסט+לוגיקה verbatim).
// אחים-שהוזרקו (חוק-3): `promptSafeText(utterance, maxLen:kStudioMaxUtteranceChars, collapseWhitespace:true)`
//        ⇒ שקע-כבול `safeText` (הקורא כובל maxLen/collapse); `studioScopeTokens(registry)` ⇒ שקע
//        `scopeTokens` (הקורא כובל registry); הפונקציה-השכנה `_scopeTokenHe` ⇒ שקע `scopeTokenHe`;
//        הקבוע `kScopeSinglePrefix` (ערכו נעדר מהטיוטה) ⇒ שקע `singlePrefix` (חוק-8). כל ליטרל-עברי verbatim.
//
// קלט:  utterance     — בקשת-המנהל הגולמית (String).
//       safeText      — שקע: ניקוי/קיצוץ הבקשה (utterance ⇒ safe).
//       scopeTokens   — שקע: קבוצת-הטוקנים הזמינה (מהרישום).
//       scopeTokenHe  — שקע: טוקן ⇒ תיאור-עברי.
//       singlePrefix  — שקע: תחילית-הטוקן-הבודד (kScopeSinglePrefix).
// פלט:  פרומפט רב-שורות (StringBuffer) עם הטוקנים ממוינים עולה + שורת-הבודד + הבקשה + הוראת-הבחירה.

/// Build the Stage-A scope-selection prompt: the sorted available scope tokens
/// (each `token = <he>`), the single-element line, then the (sanitised) manager
/// utterance and the closed-set choice instruction.
/// Verbatim behaviour of edit_prompt.dart:213-235 with the four neighbour deps injected.
String studioScopePrompt(
  String utterance, {
  required String Function(String) safeText,
  required Set<String> Function() scopeTokens,
  required String Function(String) scopeTokenHe,
  required String singlePrefix,
}) {
  final safe = safeText(utterance);
  final tokens = scopeTokens().toList()..sort();
  final b = StringBuffer();
  b.writeln('טווחי-עריכה זמינים (token = תיאור):');
  for (final t in tokens) {
    b.writeln('$t = ${scopeTokenHe(t)}');
  }
  b.writeln('$singlePrefix<id> = אלמנט בודד (id אמיתי מהרישום)');
  b.writeln();
  b.writeln('בקשת המנהל: "$safe".');
  b.writeln('בחר token אחד בלבד מהרשימה הסגורה שמתאר את טווח-העריכה, או השב '
      'AMBIGUOUS אם הבקשה אינה חד-משמעית. החזר שורה אחת: ה-token בלבד.');
  return b.toString();
}
