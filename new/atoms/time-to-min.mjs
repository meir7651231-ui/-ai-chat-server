/** חוט · time-to-min — "HH:MM" לדקות-מחצות. חוזה: time-to-min.contract.md
 *  חולץ כלשונו מ-maor/src/components/diary/lib.ts:39-43. טהור. */
export function timeToMin(t) {
    const m = /^(\d{1,2}):(\d{2})$/.exec(String(t || '').trim());
    if (!m)
        return NaN;
    return +m[1] * 60 + +m[2];
}
