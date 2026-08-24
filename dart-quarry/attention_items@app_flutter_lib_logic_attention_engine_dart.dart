// 🪨 טיוטת-חוט Dart (דרגת-מחצבה) · attentionItems — חולל אוטומטית מהאתר-החי (app_flutter).
// מוצא: buildsmart/app_flutter/lib/logic/attention_engine.dart:81-154 (74 שורות) · Dart-טהור, לא-מתורגם (חוק-4)
// שקעים-מועמדים (קריאות-חוץ להזרקה): termOf, take, where
// קידום: <שם>.contract.md + <שם>_test.dart (flutter test) ⇒ new/dart/.
List<AttentionItem> attentionItems(AttentionInput inp, {required OrgConfig cfg}) {
  final out = <AttentionItem>[];

  // הזמנות-פתוחות ותיקות — ותק יורד; עד 3 פרטניות ואז פריט-צבירה אחד.
  final aging = [...inp.agingOrders]..sort((a, b) => b.ageDays - a.ageDays);
  final tagOrder = termOf(cfg, 'attn.tag.order', 'הזמנה');
  for (final o in aging.take(3)) {
    out.add(AttentionItem(
      key: 'order:${o.id}',
      tag: tagOrder,
      title: 'הזמנה ${o.id} ממתינה ${o.ageDays} ימים',
      sev: o.ageDays >= kAttnOrderCritDays ? AttentionSev.crit : AttentionSev.warn,
      navTab: 1,
    ));
  }
  if (aging.length > 3) {
    out.add(AttentionItem(
      key: 'order:more',
      tag: tagOrder,
      title: '+${aging.length - 3} הזמנות נוספות ממתינות',
      sev: AttentionSev.warn,
      navTab: 1,
    ));
  }

  // אישורי-עובדים ממתינים (משימות במצב "review") — פריט-צבירה, טאב ניהול.
  if (inp.pendingApprovals > 0) {
    out.add(AttentionItem(
      key: 'approvals',
      tag: termOf(cfg, 'attn.tag.approval', 'אישור'),
      title: inp.pendingApprovals == 1
          ? 'משימה אחת ממתינה לאישור'
          : '${inp.pendingApprovals} משימות ממתינות לאישור',
      sev: inp.pendingApprovals >= kAttnApprovalsCritCount
          ? AttentionSev.crit
          : AttentionSev.warn,
      navTab: 3,
    ));
  }

  // בקשות-חופשה ממתינות.
  if (inp.pendingVacations > 0) {
    out.add(AttentionItem(
      key: 'vacations',
      tag: termOf(cfg, 'attn.tag.vacation', 'חופשה'),
      title: inp.pendingVacations == 1
          ? 'בקשת חופשה אחת ממתינה'
          : '${inp.pendingVacations} בקשות חופשה ממתינות',
      sev: AttentionSev.warn,
      navTab: 3,
    ));
  }

  // בקשות-חשבון/תפקיד ממתינות (שרת בלבד — 0 בדמו, ואז אין פריט).
  if (inp.pendingAccountReqs > 0) {
    out.add(AttentionItem(
      key: 'accountReqs',
      tag: termOf(cfg, 'attn.tag.account', 'חשבון'),
      title: inp.pendingAccountReqs == 1
          ? 'בקשת חשבון אחת ממתינה'
          : '${inp.pendingAccountReqs} בקשות חשבון ממתינות',
      sev: AttentionSev.warn,
      navTab: 3,
    ));
  }

  // crit-לפני-warn, סדר-פנימי נשמר (חלוקה, לא מיון).
  return [
    ...out.where((a) => a.sev == AttentionSev.crit),
    ...out.where((a) => a.sev == AttentionSev.warn),
  ];
}

/// תקציר-בוקר קומפקטי: שורת-ראש קריטית (אם יש), שורה-לכל-מקור, אחרת "שקט".
