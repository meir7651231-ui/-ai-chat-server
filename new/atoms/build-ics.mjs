/** חוט · build-ics — בניית קובץ ICS ‏(RFC 5545) שלם ממופעים קונקרטיים.
 *  חוזה: build-ics.contract.md · שקעים: icsEscape, foldIcsLine
 *  חולץ כלשונו מ-maor/src/lib/ics.ts:96-132; העוזרים הפרטיים של הקובץ
 *  (basicDate · basicLocal · stampUtc · nextIso) נשארו בקובץ — עוזר-פנימי. */

/** YYYYMMDD מ-ISO. */

/** תאריך+שעה מקומיים בפורמט בסיסי צף: YYYYMMDDTHHMMSS. */

/** DTSTAMP ב-UTC: YYYYMMDDTHHMMSSZ. */

/** יום-המחרת של ISO (ל-DTEND של אירוע יום-שלם). */

export function buildIcs(occurrences, calName, now, icsEscape, foldIcsLine, T2) {
  // 🪺 עוזרים קוננו פנימה (מנוע-הטיהור v4) — שקעי-הדאטה נראים להם דרך הסגירה
  function basicDate(iso) {
      return iso.replace(/-/g, '');
  }
  function basicLocal(d) {
      const p = (n, w = 2) => String(n).padStart(w, '0');
      return (String(d.getFullYear()) + p(d.getMonth() + 1) + p(d.getDate()) +
          'T' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds()));
  }
  function stampUtc(now) {
      const p = (n) => String(n).padStart(2, '0');
      return (String(now.getUTCFullYear()) + p(now.getUTCMonth() + 1) + p(now.getUTCDate()) +
          'T' + p(now.getUTCHours()) + p(now.getUTCMinutes()) + p(now.getUTCSeconds()) + 'Z');
  }
  function nextIso(iso) {
      const d = new Date(iso + 'T12:00:00');
      d.setDate(d.getDate() + 1);
      const p = (n) => String(n).padStart(2, '0');
      return String(d.getFullYear()) + '-' + p(d.getMonth() + 1) + '-' + p(d.getDate());
  }

    const lines = [
        T2.k1,
        T2.k2,
        'PRODID:-//maor-system//he//',
        T2.k3,
        T2.k4,
        T2.k5 + icsEscape(calName),
    ];
    const stamp = stampUtc(now);
    for (const oc of occurrences) {
        lines.push(T2.k6);
        lines.push(T2.k7 + icsEscape(oc.uid));
        lines.push(T2.k8 + stamp);
        // שעה שאינה HH:MM (ייבוא-JSON ידני, '9:00') ⇒ Invalid Date ⇒ VEVENT מושחת
        // שמפיל את **כל** הקובץ ביבואן. נפילה בטוחה: אירוע יום-שלם. (ביקורת 4.8.)
        // 🐛 נחיל-עמוק (13.8): '25:00'/'12:60' עברו את הרגקס אך יצרו Invalid Date —
        // כעת מאמתים גם את הערך בפועל (isNaN), לא רק את הפורמט.
        const parsedStart = oc.time && /^\d{2}:\d{2}$/.test(oc.time) ? new Date(oc.date + 'T' + oc.time + ':00') : null;
        if (parsedStart && !Number.isNaN(parsedStart.getTime())) {
            const end = new Date(parsedStart.getTime() + 3600e3); // שעה — כולל גלגול-חצות
            lines.push(T2.k9 + basicLocal(parsedStart));
            lines.push(T2.k10 + basicLocal(end));
        }
        else {
            lines.push(T2.k11 + basicDate(oc.date));
            lines.push(T2.k12 + basicDate(nextIso(oc.date)));
        }
        lines.push(T2.k13 + icsEscape(oc.title));
        if (oc.notes)
            lines.push(T2.k14 + icsEscape(oc.notes));
        if (oc.location)
            lines.push(T2.k15 + icsEscape(oc.location));
        lines.push(T2.k16);
    }
    lines.push(T2.k17);
    return lines.flatMap(foldIcsLine).join('\r\n') + '\r\n';
}
