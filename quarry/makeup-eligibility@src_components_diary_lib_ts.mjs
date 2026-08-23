/** 🪨 טיוטת-חוט (דרגת-מחצבה) · makeupEligibility — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/diary/lib.ts:67-96 (30 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): makeupEligibility
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function makeupEligibility(kind, justified, rawHrs) {
    if (kind === 'noshow')
        return { eligible: false, dropsPunch: true };
    const earlyCancel = rawHrs != null && rawHrs >= 48;
    const eligible = justified || earlyCancel;
    return { eligible, dropsPunch: !eligible };
}
/** חגים שבהם אין פעילות כלל (מתוך לוח החגים המשותף). */
const FULL_HOLIDAYS = [
    'ראש השנה',
    'ראש השנה ב׳',
    'יום כיפור',
    'סוכות',
    'שמחת תורה',
    'פסח',
    'שביעי של פסח',
    'שבועות',
    'תשעה באב',
];
/**
 * סיבת חסימת היום לתזמון חוגים — שבת, שישי, חג מלא או חול המועד (כמו במקור).
 * `blockingOn=false` (דגל diary.blocking כבוי) ⇒ אין חסימת שבת/חג כלל —
 * התנגשויות חדרים ממשיכות לחול (הן מחושבות ב-buildSlots, לא כאן).
 */
