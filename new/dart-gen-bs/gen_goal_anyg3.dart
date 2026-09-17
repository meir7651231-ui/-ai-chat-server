// 🧩 חולל ע"י behavior-compose --plan (up-compose · הכרעה-30): צרכים-חיצוניים ⇒ התנהגויות מחלקיקים מוכחים. אל תערוך ידנית.
// מקור: machtzev/generator/goals/anyg3/plan.json · 2 מוכחים · 2 ∅ (g2.predicate.recordCreatedAtOver60, g2.collection.createdAtOver60List)
import '../dart-maor/cockpit-days-since.dart' as c0_0;
import '../dart-maor/op-cmp-ge-str.dart' as c1_0;
import '../dart-maor/add-days-iso.dart' as c1_1;

/// לסמן משפחות שלא ביקרנו אצלן יום createdAt — cockpitDaysSince(p0,now)
num bhCreatedAtDays(String p0, String now) => c0_0.cockpitDaysSince(p0, now);

/// לסמן משפחות שלא ביקרנו אצלן יום createdAt מעל — cmpGeStr(now,addDaysIso(p0,60))
bool bhCreatedAtOver60(String p0, String now) => c1_0.cmpGeStr(now, c1_1.addDaysIso(p0, 60));
