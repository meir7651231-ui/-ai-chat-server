// בדיקת-חוזה golden · attentionItems — מייבאת אך ורק את האטום-שלה (חוק-4).
// הרצה: dart run --enable-asserts new/dart/attention_items_test.dart
import 'attention_items.dart';

// שקע-הבדיקה: termOf מדומה = מחזיר את ה-fallback (התנהגות ברירת-מחדל של המונחון).
String _term(String key, String fallback) => fallback;

void main() {
  var n = 0;

  // — עד-3 הזמנות פרטניות + פריט-צבירה, ותק-יורד —
  final r1 = attentionItems(
    AttentionInput(agingOrders: const [
      AgingOrder(id: 'A', ageDays: 5),
      AgingOrder(id: 'B', ageDays: 20),
      AgingOrder(id: 'C', ageDays: 10),
      AgingOrder(id: 'D', ageDays: 1),
    ]),
    termOf: _term,
    orderCritDays: 14,
    approvalsCritCount: 3,
  );
  // 3 פרטניות + 1 צבירה = 4.
  if (r1.length != 4) throw StateError('FAIL 1 len ${r1.length}');
  // מיון ותק-יורד: B(20)>C(10)>A(5) — אבל crit-לפני-warn מזיז את B(crit,20>=14) לראש.
  // B crit, C/A warn, ואז order:more warn.
  if (r1[0].key != 'order:B') throw StateError('FAIL 1 first ${r1[0].key}');
  if (r1[0].sev != AttentionSev.crit) throw StateError('FAIL 1 sev');
  if (r1[0].title != 'הזמנה B ממתינה 20 ימים') throw StateError('FAIL 1 title ${r1[0].title}');
  // פריט-הצבירה: +1 (4-3) הזמנות נוספות.
  final more = r1.firstWhere((a) => a.key == 'order:more');
  if (more.title != '+1 הזמנות נוספות ממתינות') throw StateError('FAIL 1 more ${more.title}');
  n++;

  // — אישורים: יחיד ⇒ ניסוח-יחיד; מעל-סף ⇒ crit —
  final r2 = attentionItems(
    const AttentionInput(pendingApprovals: 1),
    termOf: _term,
    orderCritDays: 14,
    approvalsCritCount: 3,
  );
  if (r2.length != 1) throw StateError('FAIL 2 len');
  if (r2[0].title != 'משימה אחת ממתינה לאישור') throw StateError('FAIL 2 title ${r2[0].title}');
  if (r2[0].sev != AttentionSev.warn) throw StateError('FAIL 2 sev');
  if (r2[0].navTab != 3) throw StateError('FAIL 2 navTab');
  n++;

  final r3 = attentionItems(
    const AttentionInput(pendingApprovals: 5),
    termOf: _term,
    orderCritDays: 14,
    approvalsCritCount: 3,
  );
  if (r3[0].title != '5 משימות ממתינות לאישור') throw StateError('FAIL 3 title');
  if (r3[0].sev != AttentionSev.crit) throw StateError('FAIL 3 crit');
  n++;

  // — חופשות + בקשות-חשבון (יחיד/רבים), navTab 3, warn בלבד —
  final r4 = attentionItems(
    const AttentionInput(pendingVacations: 2, pendingAccountReqs: 1),
    termOf: _term,
    orderCritDays: 14,
    approvalsCritCount: 3,
  );
  if (r4.length != 2) throw StateError('FAIL 4 len');
  if (r4[0].title != '2 בקשות חופשה ממתינות') throw StateError('FAIL 4 vac');
  if (r4[1].title != 'בקשת חשבון אחת ממתינה') throw StateError('FAIL 4 acc');
  n++;

  // — crit-לפני-warn חלוקה (לא מיון-פנימי): order crit אחרי approvals crit נשמר בסדר-המקור —
  final r5 = attentionItems(
    AttentionInput(
      agingOrders: const [AgingOrder(id: 'X', ageDays: 30)],
      pendingApprovals: 9,
    ),
    termOf: _term,
    orderCritDays: 14,
    approvalsCritCount: 3,
  );
  // שניהם crit; סדר-המקור: order:X נבנה לפני approvals.
  if (r5[0].key != 'order:X' || r5[1].key != 'approvals') {
    throw StateError('FAIL 5 order ${r5.map((a) => a.key).toList()}');
  }
  n++;

  // — קלט ריק ⇒ רשימה ריקה —
  if (attentionItems(const AttentionInput(), termOf: _term, orderCritDays: 14, approvalsCritCount: 3).isNotEmpty) {
    throw StateError('FAIL 6 empty');
  }
  n++;

  // — סף-ותק: ageDays == orderCritDays ⇒ crit (>=) —
  final r7 = attentionItems(
    AttentionInput(agingOrders: const [AgingOrder(id: 'E', ageDays: 14)]),
    termOf: _term,
    orderCritDays: 14,
    approvalsCritCount: 3,
  );
  if (r7[0].sev != AttentionSev.crit) throw StateError('FAIL 7 boundary');
  n++;

  assert(attentionItems(const AttentionInput(pendingApprovals: 1),
      termOf: _term, orderCritDays: 14, approvalsCritCount: 3).length == 1, 'assert-live');
  print('OK attentionItems: $n asserts passed');
}
