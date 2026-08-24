/** חוט · component-redeemed-now — האם רכיב-שיוך מומש עכשיו (מתנת-חג: פר-שנה-עברית).
 *  חוזה: component-redeemed-now.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:466-481 (תורגם TS→JS);
 *  השכנים itemOf + holidayAllowed + assignmentRedeemed הוזרקו כשקעים (חוק-1). */
export function componentRedeemedNow(db, a, comp, holidays, itemOf, holidayAllowed, assignmentRedeemed) {
  if (holidays) {
    const ri = itemOf(db, comp);
    if (ri.kind === 'holidayGift') {
      // חגים נבחרים (הכרעה 17) — רק חג שסומן על הפריט רלוונטי
      const next = holidays.find((h) => holidayAllowed(ri, h.name));
      if (next) return assignmentRedeemed(a, comp.id, next);
    }
  }
  return assignmentRedeemed(a, comp.id);
}
