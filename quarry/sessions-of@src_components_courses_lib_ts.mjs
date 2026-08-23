/** 🪨 טיוטת-חוט (דרגת-מחצבה) · sessionsOf — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/components/courses/lib.ts:84-91 (8 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): sessionsOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function sessionsOf(c) {
    return c.sessions && c.sessions.length ? c.sessions : [{ day: c.weekday, time: c.time, label: '' }];
}
/**
 * הצעת מספר קבוצות מטקסט קהל-היעד (P3 פריט 1; לגאסי: regex 'קבוצות|פעמים').
 * הצעה בלבד — לא דריסה; מחוץ ל-2–12 או בלי התאמה ⇒ null.
 */
