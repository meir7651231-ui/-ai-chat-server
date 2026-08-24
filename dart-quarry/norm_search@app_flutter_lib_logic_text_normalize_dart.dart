// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · normSearch — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/text_normalize.dart:24-37 (14 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): replaceAll, write, toString, normName
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String normSearch(String t) {
  var s = t.toLowerCase();
  s = s.replaceAll(RegExp('[֑-ׇ]'), ''); // ניקוד עברי (U+0591..U+05C7)
  final b = StringBuffer();
  for (final ch in s.split('')) {
    b.write(kHebrewFinalFold[ch] ?? ch);
  }
  s = b.toString().replaceAll(RegExp('[\'"׳״\\-–._]'), '');
  return s.trim();
}

/// מפתח-dedup הדוק: [normSearch] + הסרת כל רווח. `'בן דוד' ≡ 'בןדוד'`.
String normName(String s) => normSearch(s).replaceAll(RegExp(r'\s'), '');

