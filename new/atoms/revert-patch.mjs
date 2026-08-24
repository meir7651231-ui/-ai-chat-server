/** חוט · revert-patch — patch לחזרת תיק-ayin לשלב קודם; לפני 'answer' ⇒ ביטול דגל-הדחיפה.
 *  חוזה: revert-patch.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:62-68 (תורגם TS→JS); השכן stageIndex
 *  (מיקום בסדר-השלבים) הוזרק כשקע (חוק-1 — אפס import פנימי). */
export function revertPatch(stage, stageIndex) {
    const patch = { stage };
    if (stageIndex(stage) < stageIndex('answer'))
        patch.answerPushed = false;
    return patch;
}
