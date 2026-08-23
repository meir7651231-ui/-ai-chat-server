/** 🪨 טיוטת-חוט (דרגת-מחצבה) · campaignProgress — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/tzedaka/lib.ts:149-173 (25 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): campaignProgress, campaignTotal, coordinatorLastCollection, coordinatorBoxes, lastCollectionIso
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function campaignProgress(campaign, boxes) {
    const sum = campaignTotal(boxes, campaign.id);
    const goal = campaign.goal || 0;
    const pct = goal > 0 ? Math.min(100, Math.round((sum / goal) * 100)) : 0;
    return { sum, goal, pct };
}
/* ---------- הלוח הייעודי (מבודד — tzEvents בלבד, אין db.events!) ---------- */
/* ---------- חיפוש/סינון/מיון (UX סינון 1) — טהור, smartFilter הקיים ---------- */
/** הריקון האחרון של רכז — על-פני כל קופותיו ('' כשאין). */
function coordinatorLastCollection(boxes, coordId) {
    let last = '';
    for (const b of coordinatorBoxes(boxes, coordId)) {
        const l = lastCollectionIso(b);
        if (l > last)
            last = l;
    }
    return last;
}
/**
 * סינון+מיון הרכזים: q דרך smartFilter על השם (עברית, שגיאות-כתיב);
 * 'stale' = ריקון-אחרון-ישן-קודם (מי שדורש דחיפה למעלה; מעולם-לא ראשון).
 */
