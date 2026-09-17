// 🧩 חולל ע"י behavior-compose --plan (up-compose · הכרעה-30): צרכים-חיצוניים ⇒ התנהגויות מחלקיקים מוכחים. אל תערוך ידנית.
// מקור: machtzev/generator/goals/anyg1/plan.json · 5 מוכחים · 0 ∅ (—)
import '../dart-maor/cockpit-days-since.dart' as c0_0;
import '../dart-maor/op-cmp-gt-str.dart' as c1_0;
import '../dart-maor/add-days-iso.dart' as c1_1;
import './gen_goal_anyg1.dart' as c2_0;
import '../dart-maor/op-field-of.dart' as c2_1;
import '../dart-maor/op-where-list.dart' as c3_0;
import './gen_goal_anyg1.dart' as c3_1;
import '../dart-maor/op-sum-by.dart' as c4_0;
import '../dart-maor/op-field-of.dart' as c4_1;

/// בוקר לדעת אילו תשלומי הורים באיחור יום כמה חייבים בסך הכל date — cockpitDaysSince(p0,now)
num bhDateDays(String p0, String now) => c0_0.cockpitDaysSince(p0, now);

/// בוקר לדעת אילו תשלומי הורים באיחור יום כמה חייבים בסך הכל date מעל — cmpGtStr(now,addDaysIso(p0,30))
bool bhDateOver30(String p0, String now) => c1_0.cmpGtStr(now, c1_1.addDaysIso(p0, 30));

/// בוקר לדעת אילו תשלומי הורים באיחור יום כמה חייבים בסך הכל date מעל — bhDateOver30(fieldOf(p0,'date'),now)
bool bhRecordDateOver30(dynamic p0, String now) => c2_0.bhDateOver30(c2_1.fieldOf(p0, 'date'), now);

/// בוקר לדעת אילו תשלומי הורים באיחור יום כמה חייבים בסך הכל date מעל — whereList(p0,λbhRecordDateOver30(_,now))
List<dynamic> bhDateOver30List(List<dynamic> p0, String now) => c3_0.whereList(p0, (x1_0) => c3_1.bhRecordDateOver30(x1_0, now));

/// ולשלוח אחד תזכורת בוואטסאפ הסכום amount סכום — sumBy(p0,λfieldOf(_,'amount'))
num bhSumAmount(List<dynamic> p0) => c4_0.sumBy(p0, (x1_0) => c4_1.fieldOf(x1_0, 'amount'));
