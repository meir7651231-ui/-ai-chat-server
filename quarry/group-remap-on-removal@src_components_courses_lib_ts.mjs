/** 🪨 טיוטת-חוט (דרגת-מחצבה) · groupRemapOnRemoval — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:159-173 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): groupRemapOnRemoval, groupLabelOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function groupRemapOnRemoval(sessions, removeIdx) {
    const removed = groupLabelOf(sessions[removeIdx], removeIdx);
    const remap = new Map();
    for (let k = removeIdx + 1; k < sessions.length; k++) {
        const oldLabel = groupLabelOf(sessions[k], k);
        const newLabel = groupLabelOf(sessions[k], k - 1);
        if (oldLabel !== newLabel)
            remap.set(oldLabel, newLabel);
    }
    return { removed, remap };
}
/** אפשרויות שיוך קבוצה — רק כשיש יותר ממפגש אחד. */
