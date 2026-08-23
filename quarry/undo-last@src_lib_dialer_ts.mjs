/** 🪨 טיוטת-חוט (דרגת-מחצבה) · undoLast — חולל אוטומטית, טרם-קודם לדרגת-חוזה.
 *  מוצא: maor/src/lib/dialer.ts:106-119 (14 שורות) · תורגם TS→JS מכונה.
 *  שקעים-מועמדים (קריאות-חוץ שצריכות הזרקה): undoLast, lastIndexOf
 *  קידום: לכתוב <שם>.contract.md + <שם>.test.mjs ← להעביר ל-new/atoms/. */
export function undoLast(c) {
    const last = c.log[c.log.length - 1];
    if (!last)
        return c;
    let queue = c.queue;
    if (REQUEUE_OUTCOMES.includes(last.outcome)) {
        const at = queue.lastIndexOf(last.id);
        queue = at >= 0 ? [...queue.slice(0, at), ...queue.slice(at + 1)] : queue;
    }
    return { ...c, queue: [last.id, ...queue], log: c.log.slice(0, -1) };
}
/* ---------- יומן-שיחות עמיד פר-תומך (23.8 — "שיראה כמה התקשרו אליו") ---------- */
/** תקרת יומן-השיחות פר-תומך — טבעת: ותיקות נשמטות, האחרונות נשמרות. */
