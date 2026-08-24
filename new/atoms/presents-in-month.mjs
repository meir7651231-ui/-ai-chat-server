/** חוט · presents-in-month — מונה-נוכחות חודשי. חוזה: presents-in-month.contract.md
 *  חולץ כלשונו מ-maor/src/components/courses/lib.ts:47-56 (באג #10). אפס שקעים. */
export function presentsInMonth(presents, todayIso) {
    const ym = todayIso.slice(0, 7); // YYYY-MM
    return (presents ?? []).filter((d) => typeof d === 'string' && d.slice(0, 7) === ym).length;
}
