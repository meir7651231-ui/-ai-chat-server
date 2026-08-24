// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · studioScopePrompt — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_prompt.dart:213-235 (23 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): promptSafeText, studioScopeTokens, toList, writeln, toString
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String studioScopePrompt(RegistryView registry, String utterance) {
  final safe = promptSafeText(
    utterance,
    maxLen: kStudioMaxUtteranceChars,
    collapseWhitespace: true,
  );
  final tokens = studioScopeTokens(registry).toList()..sort();
  final b = StringBuffer();
  b.writeln('טווחי-עריכה זמינים (token = תיאור):');
  for (final t in tokens) {
    b.writeln('$t = ${_scopeTokenHe(t)}');
  }
  b.writeln('$kScopeSinglePrefix<id> = אלמנט בודד (id אמיתי מהרישום)');
  b.writeln();
  b.writeln('בקשת המנהל: "$safe".');
  b.writeln('בחר token אחד בלבד מהרשימה הסגורה שמתאר את טווח-העריכה, או השב '
      'AMBIGUOUS אם הבקשה אינה חד-משמעית. החזר שורה אחת: ה-token בלבד.');
  return b.toString();
}

/// A compact `id = <editable-props · actions>` line for an in-scope element (the
/// `id = he` slot carries the grounded editable summary, since the frozen seam
/// exposes no Hebrew label). Both sub-lists are read straight off [registry].
