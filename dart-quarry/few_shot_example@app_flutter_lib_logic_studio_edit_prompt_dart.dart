// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _fewShotExample — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_prompt.dart:249-319 (71 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): propKeysFor, contains, studioEditPrompt, promptSafeText, scopeElementIds, toList, writeln, scopeLabel, toString, assert
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String? _fewShotExample(List<String> slice, RegistryView registry) {
  if (slice.isEmpty) return null;
  for (final id in slice) {
    if (registry.propKeysFor(id).contains('text')) {
      return '[{"op":"setText","id":"$id","text":"טקסט לדוגמה"}]';
    }
  }
  return '[{"op":"setHidden","id":"${slice.first}","hidden":false}]';
}

/// Stage-B PROMPT — the grounded ops prompt for [scope]. Embeds, in order: the
/// "מתוך: …" preview label ([scopeLabel]); the in-scope element slice (compact,
/// sorted); the action catalog + component palette `id = he` lines; the ops grammar
/// (the REAL P1 tags); the folded + capped utterance; and ONE valid few-shot from a
/// REAL slice id. A debug budget-assert (§9-a) fails FAST if the result still
/// exceeds [kStudioPromptCharBudget], before a server round-trip — the two-stage
/// design's whole point is that a narrowed scope keeps this under 8000.
String studioEditPrompt({
  required RegistryView registry,
  required String utterance,
  required String scope,
}) {
  final safe = promptSafeText(
    utterance,
    maxLen: kStudioMaxUtteranceChars,
    collapseWhitespace: true,
  );
  final slice = scopeElementIds(scope, registry).toList()..sort();

  final b = StringBuffer();
  b.writeln(scopeLabel(scope)); // the §4 preview line
  b.writeln();
  b.writeln('אלמנטים בטווח (id = מה ניתן לערוך):');
  if (slice.isEmpty) {
    b.writeln('(אין אלמנטים בטווח)');
  } else {
    for (final id in slice) {
      b.writeln(_elementLine(registry, id));
    }
  }
  b.writeln();
  b.writeln('פעולות מותרות ל-setAction (id = תיאור):');
  for (final a in kActionCatalog) {
    b.writeln('${a.id} = ${a.he}');
  }
  b.writeln();
  b.writeln('רכיבים שניתן להוסיף (type = תיאור):');
  for (final t in kComponentPalette) {
    b.writeln('${t.type.name} = ${t.he}');
  }
  b.writeln();
  b.writeln('בקשת המנהל: "$safe".');
  b.writeln(_kOpsGrammar);
  final example = _fewShotExample(slice, registry);
  if (example != null) {
    b.writeln('דוגמה תקינה (id אמיתי מהרשימה):');
    b.writeln(example);
  }

  final prompt = b.toString();
  // §9-a — fail FAST in dev if a slice still blows the 8000-char server cap
  // (claude.ts:40,127-132), before wasting a round-trip. In release the assert is
  // stripped and the server rejects an over-budget prompt honestly.
  assert(
    prompt.length <= kStudioPromptCharBudget,
    'studioEditPrompt exceeded $kStudioPromptCharBudget chars '
    '(${prompt.length}) for scope <$scope> — narrow the scope further',
  );
  return prompt;
}

