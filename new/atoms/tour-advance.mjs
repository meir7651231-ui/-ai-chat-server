/** חוט · tour-advance — אינדקס-הצעד-הבא בסיור. חוזה: tour-advance.contract.md
 *  חולץ כלשונו מ-maor/src/lib/tour.ts:80-85. טהור. */
export function tourAdvance(index, delta, length) {
    const next = index + delta;
    if (next < 0)
        return 0;
    if (next >= length)
        return null;
    return next;
}
