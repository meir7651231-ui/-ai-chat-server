/** חוט · stage-index — מיקום שלב-הטיפול בסדר-השלבים (0..4).
 *  חוזה: stage-index.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:50-53 (תורגם TS→JS);
 *  סדר-השלבים AYIN_STAGES (אותו קובץ, שורה 18) הוטבע כקבוע-פרטי —
 *  נתון של האטום, לא קריאת-שכן (חוק-1; קיים גם כאטום-קבוע ayin-stages). */

/** סדר השלבים — קבוע; התוויות נגזרות דרך termOf (אצל stage-label). */

export function stageIndex(stage, AYIN_STAGES) {
    const i = AYIN_STAGES.indexOf(stage);
    return i < 0 ? 0 : i;
}
