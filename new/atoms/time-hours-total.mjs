/** חוט · time-hours-total — סה"כ שעות בשעתון. חוזה: time-hours-total.contract.md
 *  חולץ כלשונו מ-maor/src/lib/ayin.ts:104-106. טהור. */
export function timeHoursTotal(a) {
    return (a.time || []).reduce((t, e) => t + (+e.hours || 0), 0);
}
