// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _lastClose — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/studio/edit_intent.dart:323-333 (11 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): lastIndexOf
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
int _lastClose(String s) {
  final brace = s.lastIndexOf('}');
  final bracket = s.lastIndexOf(']');
  return brace > bracket ? brace : bracket;
}

/// True when [candidate] was CUT OFF: an unterminated string literal, or a net
/// unclosed `{`/`[` depth (more opens than closes outside strings). String-aware so a
/// brace inside a "text" value can't confuse the count. A NEGATIVE depth (a stray
/// close) is left to `jsonDecode` to reject as malformed (→ clean empty, not
/// truncated) — this predicate only flags the "opened, never finished" shape.
