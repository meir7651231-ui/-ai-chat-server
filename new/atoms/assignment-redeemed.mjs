/** חוט · assignment-redeemed — האם רכיב מומש בשיוך (מתנת-חג: פר-שנה-עברית).
 *  חוזה: assignment-redeemed.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:180-199 (תורגם TS→JS);
 *  השכנים liveRedemptions + hebYearOf הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function assignmentRedeemed(a, componentId, holiday, liveRedemptions, hebYearOf) {
    const live = liveRedemptions(a);
    if (!holiday)
        return live.some((r) => r.componentId === componentId);
    const year = hebYearOf(holiday.iso);
    return live.some((r) => r.componentId === componentId && r.holiday === holiday.name && !!r.date && hebYearOf(r.date) === year);
}
