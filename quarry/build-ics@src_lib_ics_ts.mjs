/** 🪨 טיוטת-חוט (דרגת-מחצבה) · buildIcs — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/ics.ts:96-132 (37 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): buildIcs, icsEscape, stampUtc, isNaN, getTime, basicLocal, basicDate, nextIso, flatMap
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function buildIcs(occurrences, calName, now) {
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//maor-system//he//',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'X-WR-CALNAME:' + icsEscape(calName),
    ];
    const stamp = stampUtc(now);
    for (const oc of occurrences) {
        lines.push('BEGIN:VEVENT');
        lines.push('UID:' + icsEscape(oc.uid));
        lines.push('DTSTAMP:' + stamp);
        // שעה שאינה HH:MM (ייבוא-JSON ידני, '9:00') ⇒ Invalid Date ⇒ VEVENT מושחת
        // שמפיל את **כל** הקובץ ביבואן. נפילה בטוחה: אירוע יום-שלם. (ביקורת 4.8.)
        // 🐛 נחיל-עמוק (13.8): '25:00'/'12:60' עברו את הרגקס אך יצרו Invalid Date —
        // כעת מאמתים גם את הערך בפועל (isNaN), לא רק את הפורמט.
        const parsedStart = oc.time && /^\d{2}:\d{2}$/.test(oc.time) ? new Date(oc.date + 'T' + oc.time + ':00') : null;
        if (parsedStart && !Number.isNaN(parsedStart.getTime())) {
            const end = new Date(parsedStart.getTime() + 3600e3); // שעה — כולל גלגול-חצות
            lines.push('DTSTART:' + basicLocal(parsedStart));
            lines.push('DTEND:' + basicLocal(end));
        }
        else {
            lines.push('DTSTART;VALUE=DATE:' + basicDate(oc.date));
            lines.push('DTEND;VALUE=DATE:' + basicDate(nextIso(oc.date)));
        }
        lines.push('SUMMARY:' + icsEscape(oc.title));
        if (oc.notes)
            lines.push('DESCRIPTION:' + icsEscape(oc.notes));
        if (oc.location)
            lines.push('LOCATION:' + icsEscape(oc.location));
        lines.push('END:VEVENT');
    }
    lines.push('END:VCALENDAR');
    return lines.flatMap(foldIcsLine).join('\r\n') + '\r\n';
}
/** הורדת קובץ ICS — mime יומן, בלי BOM (בניגוד ל-CSV — יומנים לא אוהבים BOM). */
