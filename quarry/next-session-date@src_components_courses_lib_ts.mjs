/** 🪨 טיוטת-חוט (דרגת-מחצבה) · nextSessionDate — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:376-390 (15 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): nextSessionDate, sessionsOf, getFullYear, getMonth, getDate, getDay, setDate
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function nextSessionDate(c, now = new Date()) {
    const n = now;
    let best = null;
    for (const ss of sessionsOf(c)) {
        const t = (ss.time || '17:00').split(':');
        const d = new Date(n.getFullYear(), n.getMonth(), n.getDate(), +t[0], +(t[1] ?? 0) || 0);
        let add = (ss.day - d.getDay() + 7) % 7;
        if (add === 0 && d <= n)
            add = 7;
        d.setDate(d.getDate() + add);
        if (!best || d < best)
            best = d;
    }
    return best;
}
/** גיליון-נוכחות (roll-call) — שיבוצים פעילים/מוקפאים (לא שהסתיימו, לא רשימת-המתנה). */
