// 🧩 חולל ע"י behavior-compose --plan (up-compose · הכרעה-30): צרכים-חיצוניים ⇒ התנהגויות מחלקיקים מוכחים. אל תערוך ידנית.
// מקור: machtzev/generator/goals/anyg6/plan.json · 4 מוכחים · 0 ∅ (—)
import '../dart-maor/cockpit-days-since.dart' as c0_0;
import '../dart-maor/op-cmp-ge-str.dart' as c1_0;
import '../dart-maor/add-days-iso.dart' as c1_1;
import './gen_goal_anyg6.dart' as c2_0;
import '../dart-maor/op-field-of.dart' as c2_1;
import '../dart-maor/op-where-list.dart' as c3_0;
import './gen_goal_anyg6.dart' as c3_1;

/// לזהות תורמים שלא תרמו יום date — cockpitDaysSince(p0,now)
num bhDateDays(String p0, String now) => c0_0.cockpitDaysSince(p0, now);

/// לזהות תורמים שלא תרמו יום date מעל — cmpGeStr(now,addDaysIso(p0,90))
bool bhDateOver90(String p0, String now) => c1_0.cmpGeStr(now, c1_1.addDaysIso(p0, 90));

/// לזהות תורמים שלא תרמו יום date מעל — bhDateOver90(fieldOf(p0,'date'),now)
bool bhRecordDateOver90(dynamic p0, String now) => c2_0.bhDateOver90(c2_1.fieldOf(p0, 'date'), now);

/// לזהות תורמים שלא תרמו יום date מעל — whereList(p0,λbhRecordDateOver90(_,now))
List<dynamic> bhDateOver90List(List<dynamic> p0, String now) => c3_0.whereList(p0, (x1_0) => c3_1.bhRecordDateOver90(x1_0, now));
