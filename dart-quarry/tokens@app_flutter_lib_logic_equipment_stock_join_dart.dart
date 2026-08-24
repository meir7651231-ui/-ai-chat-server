// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _tokens — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/equipment_stock_join.dart:42-51 (10 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<String> _tokens(String normalized) =>
    normalized.isEmpty ? const [] : normalized.split(' ');

/// True iff [needle]'s token-sequence appears as a CONTIGUOUS run inside
/// [haystack]'s token-sequence (whole-token alignment — no mid-word or
/// cross-space substring is possible because we compare whole tokens). An empty
/// [needle] never matches. A single-token [needle] is intentionally NOT matched
/// here (callers handle single-token correspondence via exact equality only) —
/// this is what keeps a generic short stock token (מפתח/שקע/עט) from
/// fabricating availability against a longer label that merely contains it.
