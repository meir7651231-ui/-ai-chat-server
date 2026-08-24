// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · groupThousands — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/money_format.dart:19-30 (12 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): toString, write
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
String groupThousands(int n) {
  final s = n.abs().toString();
  final buf = StringBuffer();
  for (var i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 == 0) buf.write(',');
    buf.write(s[i]);
  }
  return buf.toString();
}

/// Convenience: a signed ₪ amount with grouping — "₪3,150" / "-₪3,150".
/// The sign sits BEFORE the ₪ (never "₪-3,150"). [prefix] (e.g. "~") leads.
