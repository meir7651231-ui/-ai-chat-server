// 🧩 חולל ע"י behavior-compose --plan (up-compose · הכרעה-30): צרכים-חיצוניים ⇒ התנהגויות מחלקיקים מוכחים. אל תערוך ידנית.
// מקור: machtzev/generator/goals/payments/plan.json · 7 מוכחים · 0 ∅ (—)
import '../dart-maor/cockpit-days-since.dart' as c0_0;
import '../dart-maor/op-cmp-gt-str.dart' as c1_0;
import '../dart-maor/add-days-iso.dart' as c1_1;
import '../dart-maor/op-field-pred.dart' as c2_0;
import './gen_goal_payments.dart' as c2_1;
import '../dart-maor/op-where-list.dart' as c3_0;
import './gen_goal_payments.dart' as c3_1;
import '../dart-maor/op-sum-by.dart' as c4_0;
import '../dart-maor/op-field-of.dart' as c4_1;
import '../dart/pp.dart' as c5_0;
import '../dart-maor/op-add-to.dart' as c6_0;
import '../dart-maor/op-add-dyn.dart' as c6_1;

/// ימים מאז מועד התשלום עד היום — cockpitDaysSince(p0,now)
num bhOverdueDays(String p0, String now) => c0_0.cockpitDaysSince(p0, now);

/// האם התשלום באיחור מעל 30 יום — cmpGtStr(now,addDaysIso(p0,30))
bool bhOverdue30(String p0, String now) => c1_0.cmpGtStr(now, c1_1.addDaysIso(p0, 30));

/// האם רשומת תשלום באיחור מעל 30 יום לפי שדה due — fieldPred(p0,'due',λbhOverdue30(_,now))
bool bhRecordOverdue30(dynamic p0, String now) => c2_0.fieldPred(p0, 'due', (x1_0) => c2_1.bhOverdue30(x1_0, now));

/// רק התשלומים שבאיחור מעל 30 יום — whereList(p0,λbhRecordOverdue30(_,now))
List<dynamic> bhOverdueList(List<dynamic> p0, String now) => c3_0.whereList(p0, (x1_0) => c3_1.bhRecordOverdue30(x1_0, now));

/// כמה הם חייבים בסך הכל סכום כולל — sumBy(p0,λfieldOf(_,'amount'))
num bhTotalDue(List<dynamic> p0) => c4_0.sumBy(p0, (x1_0) => c4_1.fieldOf(x1_0, 'amount'));

/// נוסח תזכורת להורה עם שם וסכום — pp(p1,p0)
String bhReminder(String p0, int p1) => c5_0.pp(p1, p0);

/// שלח תזכורת לטלפון רשום שנשלח — addTo(w,addDyn(p0,p1))
void bhSendReminder(String p0, String p1, List<dynamic> w) { c6_0.addTo(w, c6_1.addDyn(p0, p1)); }
