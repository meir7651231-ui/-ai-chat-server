/** חוט · upcoming-holidays — החגים בטווח הימים הקרוב (חג רב-ימי ⇒ יומו הראשון).
 *  חוזה: upcoming-holidays.contract.md
 *  חולץ כלשונו מ-maor/src/components/shop/lib.ts:131-144 (תורגם TS→JS);
 *  השכנים holidayOf/isoOf הוזרקו כשקעים (חוק-1 — אפס import פנימי). */
export function upcomingHolidays(fromIso, days = 45, holidayOf, isoOf) {
    const out = [];
    const seen = new Set();
    const start = new Date(fromIso + 'T12:00:00');
    for (let i = 0; i <= days; i++) {
        const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
        const name = holidayOf(d);
        if (name && !seen.has(name)) {
            seen.add(name);
            out.push({ iso: isoOf(d), name });
        }
    }
    return out;
}
