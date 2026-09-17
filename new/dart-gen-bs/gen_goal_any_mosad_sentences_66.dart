// 🧩 חולל ע"י behavior-compose --plan (up-compose · הכרעה-30): צרכים-חיצוניים ⇒ התנהגויות מחלקיקים מוכחים. אל תערוך ידנית.
// מקור: machtzev/generator/goals/any_mosad_sentences_66/plan.json · 1 מוכחים · 0 ∅ (—)
import '../dart-maor/op-sum-by.dart' as c0_0;
import '../dart-maor/op-field-of.dart' as c0_1;

/// תרומה תורם תאריך סכום ייעוד כללי קרן בניין מלגות קמחא דפסחא הכנסת כלה ספר תורה אמצעי הקדשה amount — sumBy(p0,λfieldOf(_,'amount'))
num bhSumAmount(List<dynamic> p0) => c0_0.sumBy(p0, (x1_0) => c0_1.fieldOf(x1_0, 'amount'));
