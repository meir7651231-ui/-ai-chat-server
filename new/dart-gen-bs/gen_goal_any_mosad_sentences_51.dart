// 🧩 חולל ע"י behavior-compose --plan (up-compose · הכרעה-30): צרכים-חיצוניים ⇒ התנהגויות מחלקיקים מוכחים. אל תערוך ידנית.
// מקור: machtzev/generator/goals/any_mosad_sentences_51/plan.json · 1 מוכחים · 0 ∅ (—)
import '../dart-maor/op-sum-by.dart' as c0_0;
import '../dart-maor/op-field-of.dart' as c0_1;

/// חוב משפחה סכום תאריך אחראי הערה שלבים ממתין תזכורת שיחה הסדר נסגר kidsHome — sumBy(p0,λfieldOf(_,'kidsHome'))
num bhSumKidsHome(List<dynamic> p0) => c0_0.sumBy(p0, (x1_0) => c0_1.fieldOf(x1_0, 'kidsHome'));
