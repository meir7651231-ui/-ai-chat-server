// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · _isContiguousSubsequence — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/equipment_stock_join.dart:52-68 (17 שורות) · Dart-טהור, לא-מתורגם (חוק-4) · ⚠️ פרטי-במקור (עוזר — שקול גלגול לקופסה, כלל-הגלגול)
// שקעים-מועמדים (קריאות-חוץ להזרקה): —
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
bool _isContiguousSubsequence(List<String> needle, List<String> haystack) {
  if (needle.length < 2 || needle.length > haystack.length) return false;
  final last = haystack.length - needle.length;
  outer:
  for (var i = 0; i <= last; i++) {
    for (var j = 0; j < needle.length; j++) {
      if (haystack[i + j] != needle[j]) continue outer;
    }
    return true;
  }
  return false;
}

/// Map a stock item's raw [EmployerStockItem.location] to the enum. Anything
/// other than the canonical `'warehouse'` is treated as on-site (the stock map
/// only ever holds `'warehouse'`/`'site'`; an unexpected value is surfaced as
/// `site` rather than silently dropped to `unknown`, since the item DOES exist).
